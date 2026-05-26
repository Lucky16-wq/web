import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  createBookingContract(data: any) {
    const doc = new PDFDocument();
    doc.fontSize(16).text('Booking Contract', { align: 'center' });
    doc.moveDown();
    doc.text(`Name: ${data.name}`);
    doc.text(`Venue: ${data.venue}`);
    doc.text(`Start Date: ${data.startDate}`);
    doc.text(`End Date: ${data.endDate}`);
    doc.end();
    return doc;
  }
}
