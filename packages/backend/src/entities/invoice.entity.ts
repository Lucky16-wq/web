import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.invoices, { eager: true })
  booking: Booking;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'draft' })
  status: string;

  @Column({ type: 'timestamp with time zone' })
  issuedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  pdfUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
