import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Venue } from './venue.entity';
import { BookingStatus } from './booking-status.entity';
import { Negotiation } from './negotiation.entity';
import { Payment } from './payment.entity';
import { Invoice } from './invoice.entity';
import { Contract } from './contract.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  user: User;

  @ManyToOne(() => Venue, (venue) => venue.bookings, { eager: true })
  venue: Venue;

  @ManyToOne(() => BookingStatus, { eager: true })
  status: BookingStatus;

  @Column({ type: 'timestamp with time zone' })
  startAt: Date;

  @Column({ type: 'timestamp with time zone' })
  endAt: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ type: 'json', nullable: true })
  documents: Record<string, any>;

  @OneToMany(() => Negotiation, (negotiation) => negotiation.booking)
  negotiations: Negotiation[];

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @OneToMany(() => Invoice, (invoice) => invoice.booking)
  invoices: Invoice[];

  @OneToMany(() => Contract, (contract) => contract.booking)
  contracts: Contract[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
