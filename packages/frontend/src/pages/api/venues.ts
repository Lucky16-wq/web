import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const url = req.query.id ? `${backendBase}/venues/${req.query.id}` : `${backendBase}/venues`;
  const response = await fetch(url);
  const data = await response.json();
  return res.status(response.status).json(data);
}
