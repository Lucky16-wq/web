import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { ChatMessage } from '../../entities/chat-message.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getOrCreateChat(customerId: string, adminId?: string) {
    let chat = await this.chatRepository.findOne({
      where: { customer: { id: customerId }, admin: adminId ? { id: adminId } : undefined },
      relations: ['customer', 'admin', 'messages'],
    });

    if (!chat) {
      const customer = await this.userRepository.findOne({ where: { id: customerId } });
      if (!customer) {
        throw new NotFoundException('Customer not found');
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

  async addMessage(chatId: string, senderId: string, content: string) {
    const chat = await this.chatRepository.findOne({ where: { id: chatId }, relations: ['customer', 'admin'] });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const message = this.messageRepository.create({
      chat,
      sender: sender ? sender.fullName : senderId,
      content,
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
