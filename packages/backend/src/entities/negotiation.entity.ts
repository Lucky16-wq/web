import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('negotiations')
export class Negotiation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.negotiations, { onDelete: 'CASCADE' })
  booking: Booking;

  @Column()
  proposerRole: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  proposedPrice: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ default: false })
  accepted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
