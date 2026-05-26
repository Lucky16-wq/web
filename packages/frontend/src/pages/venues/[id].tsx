'use client';

import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';

type Venue = {
  id: string;
  name: string;
  description: string;
  location: string;
  basePrice: number;
  capacity: number;
};

export default function VenueDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [purpose, setPurpose] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchVenue = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/venues?id=${id}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Gagal memuat detail venue.');
          return;
        }
        setVenue(data);
      } catch (err) {
        setError('Gagal memuat detail venue.');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  const totalPrice = useMemo(() => {
    if (!venue || !startAt || !endAt) return 0;
    const start = new Date(startAt);
    const end = new Date(endAt);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return days * venue.basePrice;
  }, [venue, startAt, endAt]);

  const handleBooking = async () => {
    setBookingMessage('');
    if (!venue || !startAt || !endAt || !purpose) {
      setBookingMessage('Lengkapi semua field booking terlebih dahulu.');
      return;
    }
    const token = localStorage.getItem('venue_rental_token');
    if (!token) {
      setBookingMessage('Silakan login terlebih dahulu untuk melakukan booking.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueId: venue.id,
          startAt,
          endAt,
          totalPrice,
          purpose,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setBookingMessage(data.message || 'Terjadi kesalahan saat membuat booking.');
        return;
      }
      setBookingMessage('Booking berhasil dibuat. Silakan cek dashboard Anda.');
    } catch (err) {
      setBookingMessage('Terjadi kesalahan jaringan saat membuat booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <button onClick={() => router.back()} className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
          &larr; Kembali ke daftar venue
        </button>

        {loading ? (
          <p className="mt-8 text-slate-600 dark:text-slate-300">Memuat detail venue...</p>
        ) : error ? (
          <p className="mt-8 text-red-600 dark:text-red-400">{error}</p>
        ) : venue ? (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.8fr_1fr]">
            <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{venue.name}</h1>
              <p className="text-slate-600 dark:text-slate-300">{venue.description}</p>
              <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <p>Lokasi: <span className="font-medium text-slate-900 dark:text-white">{venue.location}</span></p>
                <p>Kapasitas: <span className="font-medium text-slate-900 dark:text-white">{venue.capacity} orang</span></p>
                <p>Harga dasar: <span className="font-medium text-slate-900 dark:text-white">Rp {venue.basePrice} / hari</span></p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Pesan Sekarang</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal mulai</label>
                  <input type="date" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal selesai</label>
                  <input type="date" value={endAt} onChange={(e) => setEndAt(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tujuan acara</label>
                  <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Estimasi total: <span className="font-semibold text-slate-900 dark:text-white">Rp {totalPrice}</span>
                </div>
                {bookingMessage ? <p className="text-sm text-red-600 dark:text-red-400">{bookingMessage}</p> : null}
                <button type="button" onClick={handleBooking} disabled={submitting} className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300">
                  {submitting ? 'Mengirim...' : 'Buat Booking'}
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
