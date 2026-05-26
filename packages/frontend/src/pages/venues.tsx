'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

type Venue = {
  id: string;
  name: string;
  description: string;
  location: string;
  basePrice: number;
  capacity: number;
};

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('/api/venues');
        const data = await response.json();
        setVenues(data || []);
      } catch (err: any) {
        setError('Gagal memuat daftar venue.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <Layout>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Daftar Venue</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">Temukan tempat terbaik untuk event Anda dengan filter harga, kapasitas, dan fasilitas.</p>

        {loading ? (
          <p className="mt-8 text-slate-600 dark:text-slate-300">Memuat venue...</p>
        ) : error ? (
          <p className="mt-8 text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {venues.map((venue) => (
              <div key={venue.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{venue.name}</h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">{venue.description}</p>
                  </div>
                  <Link href={`/venues/${venue.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300">
                    Lihat Detail
                  </Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Lokasi: {venue.location}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Kapasitas: {venue.capacity}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Harga: Rp {venue.basePrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
