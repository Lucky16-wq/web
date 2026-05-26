import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { Chat } from '../../entities/chat.entity';
import { ChatMessage } from '../../entities/chat-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatMessage])],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
