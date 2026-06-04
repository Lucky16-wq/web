import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { ChatMessage } from '../../entities/chat-message.entity';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getOrCreateChat(customerId: string, adminId?: string) {
    const query = this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.customer', 'customer')
      .leftJoinAndSelect('chat.admin', 'admin')
      .leftJoinAndSelect('chat.messages', 'messages')
      .where('customer.id = :customerId', { customerId });

    if (adminId) {
      query.andWhere('admin.id = :adminId', { adminId });
    }

    let chat = await query.getOne();

    if (!chat) {
      let customer = await this.userRepository.findOne({ where: { id: customerId } });
      
      // Jika user tidak ditemukan atau menggunakan placeholder, gunakan Guest User
      if (!customer || customerId === '00000000-0000-0000-0000-000000000000') {
        customer = await this.userRepository.findOne({ where: { email: 'guest@example.com' } });
        
        if (!customer) {
          // Pastikan Role Customer ada
          let customerRole = await this.roleRepository.findOne({ where: { name: 'Customer' } });
          if (!customerRole) {
            customerRole = this.roleRepository.create({ name: 'Customer', description: 'Default user role' });
            await this.roleRepository.save(customerRole);
          }

          customer = this.userRepository.create({
            fullName: 'Guest User',
            email: 'guest@example.com',
            phone: '0000000000',
            role: customerRole,
          });
          await this.userRepository.save(customer);
        }
      }

      const admin = adminId ? await this.userRepository.findOne({ where: { id: adminId } }) : undefined;
      chat = this.chatRepository.create({
        customer,
        admin,
        messages: [],
      });
      chat = await this.chatRepository.save(chat);
    }

    return chat;
  }

  async getChatsForUser(userId: string, role?: string, filters?: { search?: string, status?: string }) {
    const query = this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.customer', 'customer')
      .leftJoinAndSelect('chat.admin', 'admin')
      .leftJoinAndSelect('chat.messages', 'messages')
      .orderBy('chat.updatedAt', 'DESC');

    if (role !== 'Admin' && role !== 'Super Admin') {
      const guest = await this.userRepository.findOne({ where: { email: 'guest@example.com' } });
      const filterId = userId || guest?.id || '00000000-0000-0000-0000-000000000000';
      query.where('customer.id = :filterId', { filterId });
    } else {
      // Fitur Dashboard Admin: Search & Filter
      if (filters?.search) {
        query.andWhere('(customer.fullName ILIKE :search OR customer.email ILIKE :search)', { search: `%${filters.search}%` });
      }
      if (filters?.status) {
        query.andWhere('chat.status = :status', { status: filters.status });
      }
    }

    return query.getMany();
  }

  async findChatById(chatId: string) {
    return this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['customer', 'admin', 'messages'],
    });
  }

  isAuthorized(chat: Chat | null, user: any) {
    if (!chat || !user) {
      return false;
    }

    const role = user.role;
    if (role === 'Admin' || role === 'Super Admin') {
      return true;
    }

    return chat.customer?.id === (user.sub || user.id);
  }

  async addMessage(chatId: string, senderId: string, senderRole: string, content: string, attachments?: Record<string, any>) {
    const chat = await this.chatRepository.findOne({ where: { id: chatId }, relations: ['customer', 'admin'] });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    let sender = await this.userRepository.findOne({ where: { id: senderId } });
    
    // Fallback ke Guest User jika sender tidak ditemukan (mode tanpa login)
    if (!sender || senderId === '00000000-0000-0000-0000-000000000000') {
      sender = await this.userRepository.findOne({ where: { email: 'guest@example.com' } });
    }
    
    if (!sender) throw new NotFoundException('Sender not found');

    if ((senderRole === 'Admin' || senderRole === 'Super Admin') && !chat.admin) {
      chat.admin = sender;
      await this.chatRepository.save(chat);
    }

    const message = this.messageRepository.create({
      chat,
      senderId,
      senderRole,
      content,
      attachments: attachments || {},
    });

    return this.messageRepository.save(message);
  }

  async findMessages(chatId: string) {
    return this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { createdAt: 'ASC' },
    });
  }
}
