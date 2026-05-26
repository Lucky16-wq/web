import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  const bookingId = req.query.bookingId as string;

  if (!bookingId || (type !== 'contract' && type !== 'invoice')) {
    return res.status(400).json({ message: 'Tipe dokumen atau bookingId tidak valid.' });
  }

  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const response = await fetch(`${backendBase}/pdf/${type}/${bookingId}`);
  const contentType = response.headers.get('content-type') || 'application/pdf';

  const buffer = await response.arrayBuffer();
  res.setHeader('Content-Type', contentType);
  res.status(response.status).send(Buffer.from(buffer));
}
