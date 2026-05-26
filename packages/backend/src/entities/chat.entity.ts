import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.chats, { eager: true })
  customer: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  admin: User;

  @Column({ default: 'open' })
  status: string;

  @OneToMany(() => ChatMessage, (message) => message.chat, { cascade: true })
  messages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
