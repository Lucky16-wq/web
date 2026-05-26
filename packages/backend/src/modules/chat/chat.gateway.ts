import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('chat:join')
  async handleJoin(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const chatId = payload.chatId;
    if (chatId) {
      client.join(`chat:${chatId}`);
      const messages = await this.chatService.findMessages(chatId);
      client.emit('chat:history', messages);
    }
  }

  @SubscribeMessage('chat:message')
  async handleMessage(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const { chatId, senderId, content } = payload;
    if (!chatId || !senderId || !content) {
      return;
    }

    const message = await this.chatService.addMessage(chatId, senderId, content);
    this.server.to(`chat:${chatId}`).emit('chat:message', message);
  }
}
