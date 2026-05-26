import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  createBookingContract(booking: any) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.font('Helvetica-Bold').fontSize(20).text('Booking Contract', { align: 'center' });
    doc.moveDown(2);
    doc.font('Helvetica').fontSize(12);
    doc.text(`Customer: ${booking.user.fullName}`);
    doc.text(`Email: ${booking.user.email}`);
    doc.text(`Venue: ${booking.venue.name}`);
    doc.text(`Location: ${booking.venue.location}`);
    doc.text(`Start: ${booking.startAt.toISOString().slice(0, 10)}`);
    doc.text(`End: ${booking.endAt.toISOString().slice(0, 10)}`);
    doc.text(`Total Price: Rp ${Number(booking.totalPrice).toLocaleString()}`);
    doc.moveDown();
    doc.text('Terms and Conditions:', { underline: true });
    doc.moveDown(0.5);
    doc.text('1. Booking ini sah setelah pembayaran diterima dan dikonfirmasi oleh sistem.');
    doc.text('2. Pembatalan dapat dikenakan biaya sesuai kebijakan venue.');
    doc.text('3. Penyewa bertanggung jawab atas kerusakan selama pemakaian venue.');
    doc.moveDown();
    doc.text('Signature:', { continued: false });
    doc.moveDown(3);
    doc.text('______________________________');
    doc.text('Customer Signature');
    doc.end();
    return doc;
  }

  createInvoicePdf(booking: any, invoice: any) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.font('Helvetica-Bold').fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown(2);
    doc.font('Helvetica').fontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Issue Date: ${invoice.issuedAt.toISOString().slice(0, 10)}`);
    doc.text(`Due Date: ${invoice.dueDate?.toISOString().slice(0, 10) || 'N/A'}`);
    doc.moveDown();
    doc.text(`Customer: ${booking.user.fullName}`);
    doc.text(`Venue: ${booking.venue.name}`);
    doc.text(`Period: ${booking.startAt.toISOString().slice(0, 10)} - ${booking.endAt.toISOString().slice(0, 10)}`);
    doc.moveDown();
    doc.text(`Amount Due: Rp ${Number(invoice.amount).toLocaleString()}`, { bold: true });
    doc.moveDown();
    doc.text('Payment Information:', { underline: true });
    doc.moveDown(0.5);
    doc.text('Silakan bayar melalui link pembayaran yang dikirim setelah checkout.');
    doc.moveDown(2);
    doc.text('Thank you for your business.', { align: 'center' });
    doc.end();
    return doc;
  }
}
