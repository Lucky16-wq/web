# Venue Rental & Booking Platform

Monorepo full-stack platform untuk booking tempat, negosiasi harga, pembuatan dokumen otomatis, pembayaran online, dan manajemen transaksi.

## Arsitektur

- Frontend: `Next.js`, `TypeScript`, `Tailwind CSS`, `Framer Motion`
- Backend: `NestJS`-style `TypeScript`, `Express`, `Socket.IO`
- Database: `PostgreSQL`
- Cache / realtime: `Redis`
- Storage: `AWS S3 / Cloudinary`
- Deployment: `Docker`, `docker-compose`

## Struktur Folder

- `/packages/backend` - backend API dan service
- `/packages/frontend` - web client
- `/infra` - konfigurasi deployment & reverse proxy

## Instalasi

1. Salin `.env.example` menjadi `.env` dan isi nilai rahasia.
2. Jalankan `npm install` di root.
3. Jalankan `npm run dev` untuk development lokal.
4. Jalankan `npm run docker:up` untuk environment docker.

## Database dan ERD (konsep)

Tabel utama:
- `users`
- `roles`
- `venues`
- `venue_images`
- `bookings`
- `booking_status`
- `negotiations`
- `chats`
- `chat_messages`
- `payments`
- `invoices`
- `contracts`
- `documents`
- `notifications`
- `audit_logs`

## Fitur core yang disiapkan

- Role-based access control
- JWT / OAuth Google login
- Email verification OTP
- Venue management, booking engine, chat, payment, dan PDF generator
- Keamanan API: CSP, CSRF, XSS protection, rate limiting

## Frontend saat ini

- Halaman landing, dashboard, login, register, venues
- Tailwind CSS desain modern dan responsif
- Proxy API route untuk login, register, dan venue list

## Backend saat ini

- Auth module dengan JWT login/register
- TypeORM entity model lengkap untuk relasi pengguna, venue, booking, negotiation, chat, pembayaran, invoice, kontrak, dokumen, notifikasi dan audit log
- `src/data-source.ts` untuk migrasi dan koneksi database
- Modul notifikasi dan layanan repository untuk data management

## Langkah selanjutnya

- Lengkapi model database dan migrasi
- Integrasikan gateway pembayaran seperti Xendit / Midtrans melalui endpoint pembayaran terproksi
- Lengkapi modul chat realtime dengan Socket.IO
- Implementasikan generator PDF dan dokumen verifikasi untuk kontrak dan invoice
- Bangun dashboard admin dan UI pemesanan customer

## Konfigurasi tambahan

- `XENDIT_API_KEY` untuk gateway Xendit
- `MIDTRANS_SERVER_KEY` untuk gateway Midtrans sandbox
- `PAYMENT_SUCCESS_URL` dan `PAYMENT_FAILURE_URL` untuk redirect checkout pembayaran
