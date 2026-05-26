import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Venue } from './venue.entity';

@Entity('venue_images')
export class VenueImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Venue, (venue) => venue.images, { onDelete: 'CASCADE' })
  venue: Venue;

  @Column()
  url: string;

  @Column({ default: false })
  isPrimary: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
