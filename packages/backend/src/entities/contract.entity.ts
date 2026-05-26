import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.contracts, { eager: true })
  booking: Booking;

  @Column({ type: 'text' })
  terms: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  agreedPrice: number;

  @Column({ type: 'int', nullable: true })
  durationHours: number;

  @Column({ default: false })
  signedByCustomer: boolean;

  @Column({ default: false })
  signedByAdmin: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  signedAt: Date;

  @Column({ nullable: true })
  pdfUrl: string;

  @Column({ nullable: true })
  qrCodeUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
