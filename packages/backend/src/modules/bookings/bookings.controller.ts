import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

    @UseGuards(AuthGuard('jwt'))
  @Get()
  async list(@Query() filter: any, @Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    const role = req.user?.role;
    const isAdmin = role === 'Admin' || role === 'Super Admin';
    return this.bookingsService.getBookings(userId, isAdmin, filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() payload: CreateBookingDto, @Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.bookingsService.createBooking({ ...payload, userId });
  }
}
