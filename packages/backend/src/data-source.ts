import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { Venue } from './entities/venue.entity';
import { VenueImage } from './entities/venue-image.entity';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from './entities/booking-status.entity';
import { Negotiation } from './entities/negotiation.entity';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import { Contract } from './entities/contract.entity';
import { Document } from './entities/document.entity';
import { Notification } from './entities/notification.entity';
import { AuditLog } from './entities/audit-log.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [
    Role,
    User,
    Venue,
    VenueImage,
    Booking,
    BookingStatus,
    Negotiation,
    Chat,
    ChatMessage,
    Payment,
    Invoice,
    Contract,
    Document,
    Notification,
    AuditLog,
  ],
  migrations: ['dist/migrations/*.js'],
  ssl: process.env.DATABASE_SSL === 'true',
});
