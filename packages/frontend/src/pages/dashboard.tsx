import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';

type BookingSummary = {
  total: number;
  pending: number;
  active: number;
  completed: number;
};

type BookingItem = {
  id: string;
  startAt: string;
  endAt: string;
  totalPrice: number;
  purpose?: string;
  status: { code: string; label: string };
  venue: { name: string };
};

export default function Dashboard() {
  const [profile, setProfile] = useState<{ email: string; fullName: string; role?: string } | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const summary = useMemo<BookingSummary>(() => {
    const pending = bookings.filter((booking) => booking.status?.code === 'pending').length;
    const active = bookings.filter((booking) => ['confirmed', 'active'].includes(booking.status?.code)).length;
    const completed = bookings.filter((booking) => booking.status?.code === 'completed').length;
    return { total: bookings.length, pending, active, completed };
  }, [bookings]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
    Promise.all([
      fetch(`${baseUrl}/auth/me`).then(res => res.ok ? res.json() : { fullName: 'Tamu', email: '-' }),
      fetch(`${baseUrl}/bookings`).then(async (res) => {
        if (!res.ok) throw new Error('Tidak dapat memuat booking.');
        return res.json();
      }),
    ])
      .then(([profileData, bookingData]) => {
        setProfile(profileData);
        setBookings(Array.isArray(bookingData) ? bookingData : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">{profile?.role?.includes('Admin') ? 'Admin Dashboard' : 'Dashboard Saya'}</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Ringkasan transaksi dan booking untuk akun Anda.</p>
          </div>
          {profile ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Akun</p>
              <p className="mt-2 font-semibold">{profile.fullName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
              <p className="text-sm text-cyan-600 dark:text-cyan-400">{profile.role || 'Customer'}</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'Menunggu data profil...'}</p>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Booking Saya</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{summary.total}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Pending</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{summary.pending}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Aktif</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{summary.active}</p>
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Riwayat Booking</h2>
          {loading ? (
            <p className="mt-6 text-slate-600 dark:text-slate-300">Memuat booking...</p>
          ) : error ? (
            <p className="mt-6 text-red-600 dark:text-red-400">{error}</p>
          ) : bookings.length === 0 ? (
            <p className="mt-6 text-slate-600 dark:text-slate-300">Belum ada booking untuk ditampilkan.</p>
          ) : (
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Venue</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{booking.venue?.name || 'Venue'}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{new Date(booking.startAt).toLocaleDateString()} – {new Date(booking.endAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">Rp {Number(booking.totalPrice).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {booking.status?.label || booking.status?.code}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
