import { Module, Get, Controller } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return { status: 'ok', message: 'Venue Rental API is running' };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '../../.env', // Memastikan backend membaca .env di root monorepo
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // Mengarahkan localhost ke 127.0.0.1 untuk menghindari AggregateError di Node.js 18+
        url: configService.get<string>('DATABASE_URL')?.replace('localhost', '127.0.0.1'),
        autoLoadEntities: true,
        synchronize: true, // Ubah ke true agar tabel otomatis dibuat saat dev
        migrationsRun: true,
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
      ssl: configService.get<string>('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
    }),
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
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
