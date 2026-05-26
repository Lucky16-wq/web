import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from '../../entities/payment.entity';
import { Booking } from '../../entities/booking.entity';
import { BookingStatus } from '../../entities/booking-status.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly configService: ConfigService,
  ) {}

  private async createXenditInvoice(booking: Booking, amount: number) {
    const apiKey = this.configService.get<string>('XENDIT_API_KEY');
    if (!apiKey) {
      throw new BadRequestException('Xendit API key is not configured');
    }

    const externalId = `booking-${booking.id}-${Date.now()}`;
    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        external_id: externalId,
        payer_email: booking.user.email,
        amount,
        description: `Pembayaran booking ${booking.venue.name}`,
        success_redirect_url: this.configService.get<string>('PAYMENT_SUCCESS_URL') || 'http://localhost:3000/dashboard',
        failure_redirect_url: this.configService.get<string>('PAYMENT_FAILURE_URL') || 'http://localhost:3000/dashboard',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(`Xendit error: ${errorText}`);
    }

    return await response.json();
  }

  private async createMidtransTransaction(booking: Booking, amount: number) {
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    if (!serverKey) {
      throw new BadRequestException('Midtrans server key is not configured');
    }

    const orderId = `booking-${booking.id}-${Date.now()}`;
    const response = await fetch('https://api.sandbox.midtrans.com/v2/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        payment_type: 'bank_transfer',
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
        bank_transfer: {
          bank: 'bca',
        },
        customer_details: {
          first_name: booking.user.fullName,
          email: booking.user.email,
          phone: booking.user.phone || '0000000000',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadRequestException(`Midtrans error: ${errorText}`);
    }

    return await response.json();
  }

  async createPaymentSession(payload: any) {
    const booking = await this.bookingRepository.findOne({
      where: { id: payload.bookingId },
      relations: ['user', 'venue'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const amount = Number(payload.amount ?? booking.totalPrice);
    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid payment amount');
    }

    const provider = payload.provider || 'xendit';
    let providerReference = '';
    let checkoutUrl = '';
    let metadata: Record<string, any> = payload.metadata || {};

    if (provider === 'xendit') {
      const invoice = await this.createXenditInvoice(booking, amount);
      providerReference = invoice.id;
      checkoutUrl = invoice.invoice_url || invoice.invoice_url;
      metadata = { ...metadata, xendit: invoice };
    } else if (provider === 'midtrans') {
      const transaction = await this.createMidtransTransaction(booking, amount);
      providerReference = transaction.transaction_id || transaction.order_id || '';
      checkoutUrl = transaction.redirect_url || transaction.actions?.find((a: any) => a.name === 'deeplink-redirect')?.url || '';
      metadata = { ...metadata, midtrans: transaction };
    }

    const payment = this.paymentRepository.create({
      booking,
      provider,
      providerReference,
      amount,
      status: 'pending',
      metadata,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    });

    const saved = await this.paymentRepository.save(payment);
    return { payment: saved, checkoutUrl };
  }

  async verifyWebhook(body: any) {
    let provider = body.type || body.payment_type || 'unknown';
    let reference = body.data?.id || body.order_id || body.transaction_id || body.payment_id || null;
    if (!reference) {
      return { verified: false, reason: 'Missing provider reference' };
    }

    const payment = await this.paymentRepository.findOne({
      where: { providerReference: reference },
      relations: ['booking', 'booking.status'],
    });

    if (!payment) {
      return { verified: false, reason: 'Payment record not found' };
    }

    const status = body.data?.status || body.transaction_status || body.status || 'pending';
    payment.status = status.toLowerCase();
    if (payment.status === 'paid' || payment.status === 'settlement') {
      payment.paidAt = new Date();
      if (payment.booking && payment.booking.status?.code === 'pending') {
        payment.booking.status = await this.bookingRepository.manager.findOne(BookingStatus, { where: { code: 'confirmed' } });
        if (!payment.booking.status) {
          payment.booking.status = this.bookingRepository.manager.create(BookingStatus, {
            code: 'confirmed',
            label: 'Confirmed',
            description: 'Booking dikonfirmasi setelah pembayaran',
          });
          await this.bookingRepository.manager.save(payment.booking.status);
        }
        await this.bookingRepository.save(payment.booking);
      }
    }

    payment.metadata = { ...payment.metadata, webhook: body };
    await this.paymentRepository.save(payment);
    return { verified: true, paymentId: payment.id, status: payment.status, provider };
  }
}
