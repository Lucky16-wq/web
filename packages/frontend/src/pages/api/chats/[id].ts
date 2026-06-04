import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const authHeader = req.headers.authorization || '';
  const chatId = req.query.id as string;

  if (!chatId) {
    return res.status(400).json({ message: 'Chat ID is required' });
  }

  if (req.method === 'GET') {
    const response = await fetch(`${backendBase}/chats/${chatId}/messages`, {
      headers: {
        Authorization: authHeader,
      },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  if (req.method === 'POST') {
    const response = await fetch(`${backendBase}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method not allowed' });
}
