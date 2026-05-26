import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { Venue } from '../../entities/venue.entity';
import { User } from '../../entities/user.entity';
import { BookingStatus } from '../../entities/booking-status.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BookingStatus)
    private readonly bookingStatusRepository: Repository<BookingStatus>,
  ) {}

  async getBookings(userId: string, isAdmin = false, filter: any = {}) {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.venue', 'venue')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.status', 'status');

    if (!isAdmin) {
      query.where('user.id = :userId', { userId });
    }

    if (filter.status) {
      query.andWhere('status.code = :status', { status: filter.status });
    }

    if (filter.venueId) {
      query.andWhere('venue.id = :venueId', { venueId: filter.venueId });
    }

    query.orderBy('booking.startAt', 'DESC');
    return query.getMany();
  }

  async createBooking(payload: any) {
    const user = await this.userRepository.findOne({ where: { id: payload.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const venue = await this.venueRepository.findOne({ where: { id: payload.venueId } });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const startAt = new Date(payload.startAt);
    const endAt = new Date(payload.endAt);
    if (isNaN(startAt.getTime()) || isNaN(endAt.getTime()) || startAt >= endAt) {
      throw new BadRequestException('Invalid booking dates');
    }

    const conflict = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('booking.venue', 'venue')
      .where('venue.id = :venueId', { venueId: venue.id })
      .andWhere('booking.startAt <= :endAt', { endAt })
      .andWhere('booking.endAt >= :startAt', { startAt })
      .getOne();

    if (conflict) {
      throw new BadRequestException('Venue is not available for the selected dates');
    }

    let status = await this.bookingStatusRepository.findOne({ where: { code: 'pending' } });
    if (!status) {
      status = this.bookingStatusRepository.create({ code: 'pending', label: 'Pending', description: 'Menunggu persetujuan' });
      await this.bookingStatusRepository.save(status);
    }

    const booking = this.bookingRepository.create({
      user,
      venue,
      status,
      startAt,
      endAt,
      totalPrice: payload.totalPrice,
      purpose: payload.purpose,
      documents: payload.documents || {},
    });

    return this.bookingRepository.save(booking);
  }

  async checkAvailability(venueId: string, dates: { startAt: Date; endAt: Date }) {
    const startAt = new Date(dates.startAt);
    const endAt = new Date(dates.endAt);
    const conflict = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('booking.venue', 'venue')
      .where('venue.id = :venueId', { venueId })
      .andWhere('booking.startAt <= :endAt', { endAt })
      .andWhere('booking.endAt >= :startAt', { startAt })
      .getOne();
    return { available: !conflict };
  }
}
