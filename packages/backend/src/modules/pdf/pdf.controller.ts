import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { PdfService } from './pdf.service';
import { Booking } from '../../entities/booking.entity';
import { Document } from '../../entities/document.entity';
import { Invoice } from '../../entities/invoice.entity';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  @Get('contract/:bookingId')
  async contract(@Param('bookingId') bookingId: string, @Res() res: Response) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user', 'venue'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const pdfStream = this.pdfService.createBookingContract(booking);
    await this.documentRepository.save({
      booking,
      type: 'contract',
      title: `Contract ${booking.id}`,
      url: `/pdf/contract/${booking.id}`,
      metadata: { generatedAt: new Date().toISOString() },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contract-${booking.id}.pdf`);
    pdfStream.pipe(res);
  }

  @Get('invoice/:bookingId')
  async invoice(@Param('bookingId') bookingId: string, @Res() res: Response) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user', 'venue'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    let invoice = await this.invoiceRepository.findOne({
      where: { booking: { id: bookingId } },
    });

    if (!invoice) {
      invoice = this.invoiceRepository.create({
        booking,
        invoiceNumber: `INV-${Date.now()}`,
        amount: booking.totalPrice,
        status: 'issued',
        issuedAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      invoice = await this.invoiceRepository.save(invoice);
    }

    const pdfStream = this.pdfService.createInvoicePdf(booking, invoice);
    await this.documentRepository.save({
      booking,
      type: 'invoice',
      title: `Invoice ${invoice.invoiceNumber}`,
      url: `/pdf/invoice/${booking.id}`,
      metadata: { invoiceId: invoice.id, generatedAt: new Date().toISOString() },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    pdfStream.pipe(res);
  }
}
