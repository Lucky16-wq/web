import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getVenues = async (params?: Record<string, any>) => {
  const response = await api.get('/venues', { params });
  return response.data;
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export default api;
