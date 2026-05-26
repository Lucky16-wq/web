import type { ReactNode } from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Venue Rental
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Link href="/">Home</Link>
            <Link href="/venues">Venues</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200 bg-white/90 px-6 py-8 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto max-w-6xl">© 2026 Venue Rental Platform. All rights reserved.</div>
      </footer>
    </div>
  );
}
