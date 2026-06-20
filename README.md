# 🏘️ kopdes.id — Sistem Digital Manajemen Koperasi Desa

> **"Dari nota kertas ke laporan resmi Kemenkop — dalam 3 menit."**

Platform manajemen operasional koperasi desa berbasis web yang dirancang khusus untuk mendukung **Program Koperasi Desa/Kelurahan Merah Putih** (Inpres No. 9 Tahun 2025).

**Hackathon Digital Cooperatives Expo 2026**
Kementerian Koperasi RI × PEBS FEB Universitas Indonesia

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Quick Start (3 Menit)](#-quick-start-3-menit)
- [Instalasi Lengkap](#-instalasi-lengkap)
- [Deploy dengan Docker](#-deploy-dengan-docker)
- [Deploy Manual (Tanpa Docker)](#-deploy-manual-tanpa-docker)
- [Deploy ke Vercel](#-deploy-ke-vercel)
- [Panduan Login & Demo](#-panduan-login--demo)
- [PowerShell Commands](#-powershell-commands)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)
- [Fitur Detail](#-fitur-detail)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)

---

## 🚀 Fitur Utama

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| 📝 Registrasi Koperasi | ✅ | Daftar koperasi desa dengan wizard 3 langkah + OTP |
| 🔐 Login OTP | ✅ | Login via nomor HP + OTP WhatsApp (simulated) |
| 👥 Manajemen Anggota | ✅ | CRUD anggota, search, profil detail, kartu digital |
| 💰 Simpanan | ✅ | Catat simpanan pokok, wajib, sukarela (setor & tarik) |
| 🏦 Pinjaman | ✅ | Ajukan pinjaman, jadwal angsuran otomatis, bunga flat/menurun |
| 💳 Angsuran | ✅ | Bayar angsuran, hitung denda keterlambatan otomatis |
| 📊 Dashboard | ✅ | Ringkasan keuangan real-time, alert jatuh tempo |
| 📄 Laporan | ✅ | Buku kas, laporan simpanan, laporan pinjaman (print/PDF) |
| 🤖 Asisten AI | ✅ | Chatbot tanya-jawab tentang pengelolaan koperasi |
| 📱 PWA | ✅ | Bisa diinstall di HP Android tanpa Play Store |
| 🌐 Bahasa Indonesia | ✅ | 100% antarmuka Bahasa Indonesia |
| 📴 Mobile-First | ✅ | Responsive, touch-friendly, ukuran font 16px+ |

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 |
| Auth | OTP via WhatsApp (simulated) |
| AI | Anthropic Claude API |
| Container | Docker + Docker Compose |
| Hosting | Vercel / Docker / VPS |

---

## ⚡ Quick Start (3 Menit)

### Opsi A: Docker (Paling Mudah) ⭐

```powershell
# 1. Clone repository
git clone https://github.com/rteitch/kopdes-id.git
cd kopdes-id

# 2. Jalankan Docker (PostgreSQL + App)
.\deploy.ps1 docker
```

Buka **http://localhost:3000** — aplikasi sudah jalan!

### Opsi B: Development Lokal

```powershell
git clone https://github.com/rteitch/kopdes-id.git
cd kopdes-id
.\deploy.ps1 setup      # Install deps & setup
.\deploy.ps1 docker     # Jalankan PostgreSQL
.\deploy.ps1 seed       # Seed data demo
.\deploy.ps1 dev        # Jalankan dev server
```

### Opsi C: Manual

```powershell
git clone https://github.com/rteitch/kopdes-id.git
cd kopdes-id
npm install
# Edit .env dengan DATABASE_URL PostgreSQL
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

---

## 📦 Instalasi Lengkap

### 1. Prasyarat

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://docker.com/)) — untuk Opsi Docker
- **Git** ([Download](https://git-scm.com/))

### 2. Clone & Setup

```powershell
git clone https://github.com/rteitch/kopdes-id.git
cd kopdes-id
.\deploy.ps1 setup
```

Script `setup` akan:
- Cek Node.js, npm, Docker
- Install dependencies
- Buat file `.env`
- Generate Prisma Client

### 3. Jalankan

```powershell
# Opsi A: Docker (easiest)
.\deploy.ps1 docker

# Opsi B: Development
.\deploy.ps1 dev
```

---

## 🐳 Deploy dengan Docker

Docker Compose akan menjalankan **2 container**:
- **db** — PostgreSQL 16 (port 5432)
- **app** — Next.js application (port 3000)

### Jalankan

```powershell
.\deploy.ps1 docker
```

Script akan:
1. Build Docker image
2. Start PostgreSQL + App
3. Wait for database ready
4. Run Prisma migration
5. Seed demo data

### Perintah Docker Lainnya

```powershell
.\deploy.ps1 docker-logs   # Lihat logs (Ctrl+C to exit)
.\deploy.ps1 docker-down   # Stop containers
```

### Deploy Manual Docker

```powershell
docker-compose up -d --build    # Build & start
docker-compose exec app npx prisma db push --skip-generate  # Migrate
docker-compose exec app npx tsx prisma/seed.ts  # Seed
docker-compose logs -f           # Logs
docker-compose down              # Stop
```

---

## 🖥 Deploy Manual (Tanpa Docker)

### Setup Database

Install PostgreSQL ([Download](https://www.postgresql.org/)):

```sql
-- Jalankan di psql atau PgAdmin
CREATE DATABASE kopdes_id;
```

### Edit .env

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/kopdes_id"
DIRECT_URL="postgresql://postgres:password@localhost:5432/kopdes_id"
NEXTAUTH_SECRET="random-string-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

### Setup & Run

```powershell
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

### Production Build

```powershell
npm run build
npm start
```

---

## ☁️ Deploy ke Vercel

### 1. Push ke GitHub

```powershell
.\deploy.ps1 push
```

### 2. Deploy di Vercel

1. Buka [vercel.com](https://vercel.com/) → Import repository
2. Tambah Environment Variables:
   - `DATABASE_URL` — PostgreSQL URL
   - `DIRECT_URL` — PostgreSQL URL (direct)
   - `NEXTAUTH_SECRET` — random string
3. Klik **Deploy**

### 3. Setup Database

Pilih salah satu:
- **Supabase** (gratis) — [supabase.com](https://supabase.com/)
- **Neon.tech** (gratis) — [neon.tech](https://neon.tech/)
- **Railway** — [railway.app](https://railway.app/)

---

## 🔐 Panduan Login & Demo

### Login dengan Data Seed

| Role | No. HP | Nama |
|------|--------|------|
| **Ketua** | `081234567890` | Hadi Santoso |
| **Bendahara** | `081234567891` | Sari Rahayu |

### Cara Login

1. Buka **http://localhost:3000**
2. Klik **"Masuk"** di header
3. Masukkan nomor HP (contoh: `081234567890`)
4. Klik **"Kirim Kode OTP"**
5. OTP akan muncul otomatis di form (mode demo)
6. Klik **"Verifikasi & Masuk"**
7. Anda akan diarahkan ke **Dashboard**

### Alur Demo (3 Menit untuk Juri)

```
1. Buka landing page → klik "Daftar Koperasi Baru"
2. Isi data koperasi → verifikasi OTP → masuk dashboard
3. Klik menu "Anggota" → "Tambah Anggota" → isi data
4. Klik menu "Simpanan" → "Catat Transaksi" → pilih anggota → simpan
5. Klik menu "Laporan" → pilih "Buku Kas" → klik "Cetak/PDF"
6. Klik menu "Asisten AI" → tanya "Apa bedanya simpanan pokok?"
```

---

## 💻 PowerShell Commands

Script `deploy.ps1` menyediakan semua perintah deployment:

```powershell
.\deploy.ps1 setup         # Install dependencies & setup project
.\deploy.ps1 dev           # Start development server
.\deploy.ps1 build         # Build for production
.\deploy.ps1 start         # Start production server
.\deploy.ps1 seed          # Seed demo data
.\deploy.ps1 docker        # Deploy with Docker (PostgreSQL + App)
.\deploy.ps1 docker-down   # Stop Docker containers
.\deploy.ps1 docker-logs   # View Docker logs
.\deploy.ps1 db-reset      # Reset database & re-seed
.\deploy.ps1 studio        # Open Prisma Studio (GUI)
.\deploy.ps1 push          # Git commit & push
.\deploy.ps1 help          # Show help
```

---

## 📁 Struktur Proyek

```
kopdes-id/
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker Compose (PostgreSQL + App)
├── docker-entrypoint.sh    # Auto-migration on container start
├── .dockerignore           # Docker build exclusions
├── deploy.ps1              # Windows PowerShell deployment script
├── .env                    # Environment variables (JANGAN di-commit)
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git exclusions
├── next.config.mjs         # Next.js configuration (standalone output)
├── tailwind.config.ts      # Tailwind CSS configuration
├── package.json            # Dependencies & scripts
├── README.md               # Dokumentasi ini
│
├── prisma/
│   ├── schema.prisma       # Database schema (8 model, 12 enum)
│   └── seed.ts             # Script seed data demo
│
├── public/
│   └── manifest.json       # PWA manifest
│
└── src/
    ├── app/
    │   ├── globals.css     # Global styles
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Landing page
    │   ├── login/          # Halaman login OTP
    │   ├── daftar/         # Halaman registrasi
    │   ├── (dashboard)/    # Route grup dashboard
    │   │   ├── layout.tsx  # Dashboard layout (sidebar)
    │   │   ├── dashboard/  # Dashboard ringkasan
    │   │   ├── anggota/    # Manajemen anggota
    │   │   ├── transaksi/  # Catat simpanan
    │   │   ├── pinjaman/   # Kelola pinjaman & angsuran
    │   │   ├── laporan/    # Laporan keuangan
    │   │   ├── chatbot/    # Asisten AI koperasi
    │   │   └── pengaturan/ # Pengaturan akun
    │   └── api/            # API Routes (13 endpoints)
    │
    ├── components/
    │   ├── layout/sidebar.tsx
    │   └── ui/ (button, card, input, label, select, badge, textarea)
    │
    ├── lib/
    │   ├── prisma.ts       # Prisma client singleton
    │   └── utils.ts        # Helper functions
    │
    └── store/
        └── auth-store.ts   # Zustand auth state
```

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi koperasi baru |
| POST | `/api/auth/login` | Login dengan nomor HP |
| POST | `/api/auth/verify-otp` | Verifikasi kode OTP |
| GET | `/api/anggota?koperasiId=xxx` | List anggota (dengan search) |
| POST | `/api/anggota` | Tambah anggota baru |
| GET | `/api/anggota/[id]` | Detail anggota + riwayat |
| PUT | `/api/anggota/[id]` | Update data anggota |
| GET | `/api/transaksi?koperasiId=xxx` | List transaksi simpanan |
| POST | `/api/transaksi` | Catat simpanan baru (setor/tarik) |
| GET | `/api/pinjaman?koperasiId=xxx` | List pinjaman + angsuran |
| POST | `/api/pinjaman` | Ajukan pinjaman baru |
| POST | `/api/pinjaman/angsuran` | Bayar angsuran |
| GET | `/api/laporan?koperasiId=xxx&jenis=buku-kas` | Laporan keuangan |
| GET | `/api/dashboard?koperasiId=xxx` | Data ringkasan dashboard |
| POST | `/api/ai/chat` | Kirim pertanyaan ke asisten AI |

---

## 📖 Fitur Detail

### 1. Manajemen Anggota
- Auto-generate nomor (KDS-001, KDS-002, ...)
- Search berdasarkan nama, nomor, atau HP
- Profil lengkap dengan riwayat simpanan & pinjaman
- Status: Aktif, Calon, Nonaktif, Keluar

### 2. Pencatatan Simpanan
- **Simpanan Pokok** — dibayar sekali, tidak bisa ditarik
- **Simpanan Wajib** — dibayar rutin setiap bulan
- **Simpanan Sukarela** — bisa setor dan tarik kapan saja
- Saldo ter-update otomatis

### 3. Manajemen Pinjaman
- Bunga **Flat** atau **Menurun**
- Jadwal angsuran otomatis ter-generate
- Bayar angsuran satu per satu
- Denda keterlambatan otomatis (0.1%/hari)
- Status: Aktif → Lunas

### 4. Laporan Keuangan
- **Buku Kas Harian** — transaksi per hari dengan saldo running
- **Laporan Simpanan** — rekap per anggota per jenis
- **Laporan Pinjaman** — daftar pinjaman dengan status kolektibilitas
- Filter bulan/tahun + Print to PDF

### 5. Asisten AI (Chatbot)
- Tanya-jawab tentang pengelolaan koperasi
- Topik: simpanan, bunga, SHU, RAT, pelaporan
- Claude API (dengan fallback demo responses)

### 6. Dashboard
- Total anggota, simpanan, pinjaman, aset
- Transaksi hari ini
- Alert pinjaman jatuh tempo

---

## 🗺 Roadmap

### V1.0 — MVP Hackathon (Saat Ini) ✅
- [x] Registrasi & onboarding koperasi
- [x] Manajemen anggota (CRUD)
- [x] Pencatatan simpanan (pokok, wajib, sukarela)
- [x] Pinjaman & angsuran
- [x] Dashboard ringkasan
- [x] Laporan keuangan
- [x] Asisten AI chatbot
- [x] PWA mobile-first
- [x] Docker deployment
- [x] PowerShell deployment script

### V1.1 — Post-Hackathon
- [ ] Notifikasi WhatsApp real-time
- [ ] Laporan format standar Kemenkop RI
- [ ] Hitung SHU otomatis
- [ ] Import anggota dari Excel
- [ ] Scan nota OCR via kamera

### V2.0 — Scale
- [ ] Dashboard Dinas Koperasi (monitoring wilayah)
- [ ] Integrasi QRIS untuk pembayaran
- [ ] Mobile app (React Native)
- [ ] Multi-bahasa daerah
- [ ] PgBouncer (untuk 10.000+ concurrent users)

---

## ❓ FAQ

### Q: Apakah aplikasi ini gratis?
A: Ya, 100% gratis. Node.js, PostgreSQL, Docker, Next.js, Prisma — semuanya open source.

### Q: Database apa yang dipakai?
A: **PostgreSQL 16** — berjalan di Docker. Tidak perlu Supabase atau layanan cloud.

### Q: Bisa dipakai di HP?
A: Ya! Aplikasi ini mobile-first dan bisa diinstall sebagai PWA di Android.

### Q: Berapa banyak anggota yang bisa didaftarkan?
A: Tidak ada batasan. PostgreSQL bisa handle jutaan row tanpa masalah.

### Q: Bagaimana jika lupa password?
A: Sistem menggunakan OTP via WhatsApp, jadi tidak ada password yang perlu diingat.

### Q: Apakah perlu PgBouncer?
A: **Tidak perlu untuk hackathon & MVP.** Prisma sudah punya built-in connection pooling. PgBouncer hanya perlu ditambahkan ketika sudah mencapai ratusan concurrent users.

### Q: Bisa deploy di VPS sendiri?
A: Ya! Pakai `.\deploy.ps1 docker` — tinggal satu perintah.

---

## 👥 Tim

Dibuat untuk **Hackathon Digital Cooperatives Expo 2026**
Kementerian Koperasi RI × PEBS FEB Universitas Indonesia

## 📄 Lisensi

© 2026 kopdes.id — Hak Cipta Dilindungi