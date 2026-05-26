import Layout from '../components/Layout';
import Hero from '../components/Hero';
import AutoPlaySlider from '../components/AutoPlaySlider';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <AutoPlaySlider />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
            <h2 className="text-2xl font-semibold">Cari tempat terbaik untuk event Anda</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Filter venue berdasarkan harga, lokasi, kapasitas, dan fasilitas. Kelola booking, negosiasi, dan dokumen dalam satu platform.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg dark:border-slate-700 dark:bg-slate-950/80">
            <h2 className="text-2xl font-semibold">Dashboard admin modern</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Pantau transaksi, status pembayaran, dokumen otomatis, notifikasi, dan laporan real-time dengan UI dashboard profesional.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
