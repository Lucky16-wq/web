import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.payments, { eager: true })
  booking: Booking;

  @Column()
  provider: string;

  @Column()
  providerReference: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
