import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: 'system' })
  category: string;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'json', nullable: true })
  payload: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
