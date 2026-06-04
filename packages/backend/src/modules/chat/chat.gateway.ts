import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { jwtConstants } from '../auth/auth.constants';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService, private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.headers['authorization'];
    if (!token) {
      client.disconnect();
      return;
    }

    const authToken = token.toString().replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(authToken, { secret: jwtConstants.secret });
      client.data.user = payload;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('chat:join')
  async handleJoin(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const chatId = payload.chatId;
    if (!chatId) {
      return;
    }

    const chat = await this.chatService.findChatById(chatId);
    if (!this.chatService.isAuthorized(chat, client.data.user)) {
      client.emit('chat:error', { message: 'Unauthorized to join chat.' });
      return;
    }

    client.join(`chat:${chatId}`);
    const messages = await this.chatService.findMessages(chatId);
    client.emit('chat:history', messages);
  }

  @SubscribeMessage('chat:message')
  async handleMessage(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const { chatId, content, attachments } = payload;
    const user = client.data.user;
    if (!chatId || !content || !user) {
      return;
    }

    const message = await this.chatService.addMessage(chatId, user.sub || user.id, user.role, content, attachments);
    this.server.to(`chat:${chatId}`).emit('chat:message', message);
  }
}
