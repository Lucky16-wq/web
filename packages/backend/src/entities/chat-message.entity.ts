import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chat } from './chat.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;

  @Column()
  senderId: string;

  @Column()
  senderRole: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'json', nullable: true })
  attachments: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
