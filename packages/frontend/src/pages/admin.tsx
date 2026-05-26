'use client';

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

type Profile = { email: string; fullName: string; role?: string };
type BookingSummary = { total: number; pending: number; confirmed: number; completed: number };

export default function AdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('venue_rental_token');
    if (!token) {
      setError('Silakan login untuk mengakses admin page.');
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
      fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
    ])
      .then(([profileData, bookingsData]) => {
        setProfile(profileData);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      })
      .catch(() => setError('Gagal memuat data admin.'))
      .finally(() => setLoading(false));
  }, []);

  const summary: BookingSummary = {
    total: bookings.length,
    pending: bookings.filter((item) => item.status?.code === 'pending').length,
    confirmed: bookings.filter((item) => item.status?.code === 'confirmed').length,
    completed: bookings.filter((item) => item.status?.code === 'completed').length,
  };

  return (
    <Layout>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Kelola booking, pembayaran, dan status venue dari panel admin.</p>
        </div>

        {loading ? (
          <p className="text-slate-600 dark:text-slate-300">Memuat data...</p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        ) : profile?.role?.includes('Admin') ? (
          <>
            <div className="grid gap-6 md:grid-cols-4 mb-10">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Total Booking</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{summary.total}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Pending</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{summary.pending}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Confirmed</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{summary.confirmed}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Completed</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{summary.completed}</p>
              </div>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Daftar Booking</h2>
              {bookings.length === 0 ? (
                <p className="mt-6 text-slate-600 dark:text-slate-300">Belum ada booking yang perlu dikelola.</p>
              ) : (
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3">Booking ID</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Venue</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{booking.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{booking.user?.fullName || 'Customer'}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{booking.venue?.name || '-'}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{booking.status?.label || booking.status?.code}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{new Date(booking.startAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : (
          <p className="text-red-600 dark:text-red-400">Anda tidak memiliki akses admin.</p>
        )}
      </main>
    </Layout>
  );
}
