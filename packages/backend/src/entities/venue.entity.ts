import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { VenueImage } from './venue-image.entity';
import { Booking } from './booking.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  location: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  basePrice: number;

  @Column({ default: 0 })
  capacity: number;

  @Column({ type: 'simple-array', nullable: true })
  facilities: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  schedule: Record<string, any>;

  @OneToMany(() => VenueImage, (image) => image.venue, { cascade: true })
  images: VenueImage[];

  @OneToMany(() => Booking, (booking) => booking.venue)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
