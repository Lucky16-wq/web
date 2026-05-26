import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('booking_status')
export class BookingStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Booking, (booking) => booking.status)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
