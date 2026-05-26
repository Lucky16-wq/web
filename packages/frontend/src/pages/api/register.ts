import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const response = await fetch(`${backendBase}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}
