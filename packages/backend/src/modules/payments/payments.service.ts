import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { Booking } from '../../entities/booking.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async createPaymentSession(payload: any) {
    const booking = await this.bookingRepository.findOne({ where: { id: payload.bookingId } });
    const payment = this.paymentRepository.create({
      booking,
      provider: payload.provider || 'xendit',
      providerReference: payload.providerReference || '',
      amount: payload.amount,
      status: 'pending',
      metadata: payload.metadata || {},
    });

    return this.paymentRepository.save(payment);
  }

  async verifyWebhook(body: any) {
    return { verified: true, body };
  }
}
