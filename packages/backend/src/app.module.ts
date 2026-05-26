import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VenuesModule } from './modules/venues/venues.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
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
import { RolesGuard } from './modules/auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      migrationsRun: true,
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
    }),
    AuthModule,
    UsersModule,
    VenuesModule,
    BookingsModule,
    ChatModule,
    PaymentsModule,
    PdfModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
