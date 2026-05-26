import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from '../../entities/booking.entity';
import { BookingStatus } from '../../entities/booking-status.entity';
import { Negotiation } from '../../entities/negotiation.entity';
import { Venue } from '../../entities/venue.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookingStatus, Negotiation, Venue, User])],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
