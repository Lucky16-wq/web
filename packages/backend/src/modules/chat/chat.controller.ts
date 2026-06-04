import { Controller, Get, Post, Param, Body, Request, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { ForbiddenException } from '@nestjs/common';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @UseGuards(AuthGuard('jwt')) // Admin wajib login untuk melihat daftar
  async list(@Request() req: any, @Query('search') search?: string, @Query('status') status?: string) {
    const userId = req.user?.id;
    const role = req.user?.role;
    // Mengirim parameter search dan status untuk Dashboard Admin
    return this.chatService.getChatsForUser(userId, role, { search, status });
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    // Hindari penggunaan fallback ID statis. Wajibkan guestSessionId yang unik dari frontend.
    const customerId = req.user?.id || body.guestSessionId;
    if (!customerId) {
      throw new ForbiddenException('Identifier unik (User ID atau Guest Session) diperlukan.');
    }
    const adminId = body.adminId; 
    return this.chatService.getOrCreateChat(customerId, adminId);
  }

  @Get(':id')
  async getChat(@Param('id') id: string, @Request() req: any, @Query('guestId') guestId?: string) {
    const chat = await this.chatService.findChatById(id);
    
    // Validasi RBAC: Hanya pemilik chat (Guest) atau Admin yang boleh melihat detail
    const user = req.user || { id: guestId, role: 'Guest' };
    if (!this.chatService.isAuthorized(chat, user)) {
      return { error: 'Access Denied', message: 'Anda tidak memiliki izin melihat percakapan ini.' };
    }
    return chat;
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Request() req: any) {
    return this.chatService.findMessages(id);
  }

  @Post(':id/messages')
  async sendMessage(@Param('id') id: string, @Body() body: any, @Request() req: any, @Query('guestId') guestId?: string) {
    const senderId = req.user?.id || guestId;
    if (!senderId) throw new ForbiddenException('Sender identity missing');

    const senderRole = req.user?.role || 'Guest';
    
    // Validasi tambahan: Pastikan sender adalah bagian dari chat room ini
    const chat = await this.chatService.findChatById(id);
    if (!this.chatService.isAuthorized(chat, { id: senderId, role: senderRole })) {
      throw new ForbiddenException('Anda bukan bagian dari percakapan ini.');
    }

    return this.chatService.addMessage(
      id,
      senderId,
      senderRole,
      body.content,
      body.attachments,
    );
  }
}
