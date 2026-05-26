import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl font-semibold sm:text-5xl">Platform Booking Venue Modern & Profesional</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Dapatkan venue terbaik dengan sistem booking, negosiasi harga, dokumen otomatis, dan pembayaran realtime dalam satu aplikasi.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#" className="inline-flex rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              Mulai Sekarang
            </a>
            <a href="#" className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Lihat Fitur
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
