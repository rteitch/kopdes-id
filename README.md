# 🏘️ kopdes.id — Sistem Digital Manajemen Koperasi Desa

> **"Dari nota kertas ke laporan resmi Kemenkop — dalam 3 menit."**

Platform manajemen operasional koperasi desa berbasis web yang dirancang khusus untuk mendukung **Program Koperasi Desa/Kelurahan Merah Putih** (Inpres No. 9 Tahun 2025).

**Hackathon Digital Cooperatives Expo 2026**
Kementerian Koperasi RI × PEBS FEB Universitas Indonesia

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Setup Database](#-setup-database)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Panduan Login & Demo](#-panduan-login--demo)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)
- [Fitur Detail](#-fitur-detail)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Tim](#-tim)
- [Lisensi](#-lisensi)

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

### Frontend
| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Form Handling | React Hook Form + Zod |
| Icons | Lucide React |

### Backend
| Komponen | Teknologi |
|----------|-----------|
| Runtime | Node.js 20 LTS |
| API | Next.js API Routes |
| ORM | Prisma 6 |
| Database | PostgreSQL (Supabase) |
| AI Chatbot | Anthropic Claude API |
| Validasi | Zod |

### Infrastruktur
| Komponen | Teknologi |
|----------|-----------|
| Hosting | Vercel |
| CI/CD | GitHub Actions |
| Monitoring | Vercel Analytics |

---

## 📋 Prasyarat

Sebelum menginstal, pastikan sudah terpasang:

- **Node.js** versi 18 atau lebih baru ([Download](https://nodejs.org/))
- **npm** atau **pnpm** atau **yarn**
- **PostgreSQL** atau akun [Supabase](https://supabase.com/) (gratis)
- **Git** ([Download](https://git-scm.com/))

Cek versi Node.js:
```bash
node --version
# Harus v18.x atau lebih baru
```

---

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/your-username/kopdes-id.git
cd kopdes-id
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Lalu edit file `.env` dengan konfigurasi database Anda (lihat [Konfigurasi Environment](#-konfigurasi-environment)).

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database (buat tabel)
npx prisma db push

# Seed data demo (opsional, untuk testing)
npx tsx prisma/seed.ts
```

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

---

## ⚙️ Konfigurasi Environment

Edit file `.env` di root project:

```bash
# =============================================
# DATABASE (PostgreSQL)
# =============================================
# Opsi 1: Supabase (gratis, cloud)
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Opsi 2: PostgreSQL lokal
DATABASE_URL="postgresql://postgres:password@localhost:5432/kopdes_id"
DIRECT_URL="postgresql://postgres:password@localhost:5432/kopdes_id"

# =============================================
# AUTH
# =============================================
NEXTAUTH_SECRET="ganti-dengan-random-string-min-32-karakter"
NEXTAUTH_URL="http://localhost:3000"

# =============================================
# AI CHATBOT (opsional - untuk fitur Asisten AI)
# =============================================
ANTHROPIC_API_KEY="sk-ant-api-key-anda"

# =============================================
# WHATSAPP NOTIFICATION (opsional - untuk notifikasi)
# =============================================
FONNTE_TOKEN="token-fonnte-anda"
```

### Mendapatkan Database URL

#### Opsi 1: Supabase (Direkomendasikan untuk hackathon)

1. Buka [supabase.com](https://supabase.com/) dan daftar gratis
2. Buat project baru
3. Klik **Settings** → **Database**
4. Copy **Connection string** → **URI**
5. Paste ke `DATABASE_URL` di `.env`

#### Opsi 2: PostgreSQL Lokal

```bash
# Install PostgreSQL (Windows)
# Download dari https://www.postgresql.org/download/windows/

# Buat database
psql -U postgres -c "CREATE DATABASE kopdes_id;"
```

#### Opsi 3: Docker

```bash
docker run --name kopdes-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=kopdes_id -p 5432:5432 -d postgres:16
```

---

## 🗄 Setup Database

### Generate & Migrate

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database (membuat semua tabel)
npx prisma db push

# ATAU menggunakan migrations (untuk production)
npx prisma migrate dev --name init
```

### Seed Data Demo

Seed data demo akan membuat:
- 1 koperasi contoh: "Kopdes Merah Putih Desa Sukomulyo"
- 2 pengguna: Ketua (Hadi Santoso) dan Bendahara (Sari Rahayu)
- 5 anggota dengan data simpanan
- 1 pinjaman dengan jadwal angsuran
- Data kas umum

```bash
npx tsx prisma/seed.ts
```

### Buka Prisma Studio (GUI Database)

```bash
npx prisma studio
```

Buka http://localhost:5555 untuk melihat dan mengedit data database.

---

## ▶️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi berjalan di **http://localhost:3000** dengan hot-reload.

### Production Build

```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

### Perintah Lainnya

```bash
# Lint & type-check
npm run lint

# Buka Prisma Studio (GUI database)
npx prisma studio

# Reset database (hapus semua data & re-seed)
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

---

## 🔐 Panduan Login & Demo

### Login dengan Data Seed

Setelah menjalankan `npx tsx prisma/seed.ts`, Anda bisa login dengan:

| Role | No. HP | Nama |
|------|--------|------|
| **Ketua** | `081234567890` | Hadi Santoso |
| **Bendahara** | `081234567891` | Sari Rahayu |

### Cara Login

1. Buka **http://localhost:3000**
2. Klik tombol **"Masuk"** di header
3. Masukkan nomor HP (contoh: `081234567890`)
4. Klik **"Kirim Kode OTP"**
5. OTP akan muncul otomatis di form (mode demo)
6. Klik **"Verifikasi & Masuk"**
7. Anda akan diarahkan ke **Dashboard**

### Mendaftar Koperasi Baru

1. Buka **http://localhost:3000/daftar**
2. **Step 1:** Isi data koperasi (nama, desa, kabupaten, provinsi)
3. **Step 2:** Isi data ketua (nama, nomor HP)
4. **Step 3:** Verifikasi OTP (otomatis terisi di demo mode)
5. Setelah berhasil, langsung masuk ke Dashboard

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

## 📁 Struktur Proyek

```
kopdes-id/
├── prisma/
│   ├── schema.prisma          # Database schema (8 model, 12 enum)
│   └── seed.ts                # Script seed data demo
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles (Tailwind + custom)
│   │   ├── layout.tsx         # Root layout (font, metadata)
│   │   ├── page.tsx           # Landing page
│   │   ├── login/page.tsx     # Halaman login OTP
│   │   ├── daftar/page.tsx    # Halaman registrasi koperasi
│   │   ├── (dashboard)/       # Route grup dashboard (perlu login)
│   │   │   ├── layout.tsx     # Dashboard layout (sidebar + topbar)
│   │   │   ├── dashboard/     # Dashboard ringkasan
│   │   │   ├── anggota/       # Manajemen anggota (list + detail)
│   │   │   ├── transaksi/     # Catat simpanan
│   │   │   ├── pinjaman/      # Kelola pinjaman & angsuran
│   │   │   ├── laporan/       # Laporan keuangan
│   │   │   ├── chatbot/       # Asisten AI koperasi
│   │   │   └── pengaturan/    # Pengaturan akun
│   │   └── api/               # API Routes
│   │       ├── auth/          # Register, login, verify OTP
│   │       ├── anggota/       # CRUD anggota
│   │       ├── transaksi/     # Simpanan (setor/tarik)
│   │       ├── pinjaman/      # Pinjaman + angsuran
│   │       ├── laporan/       # Generate laporan
│   │       ├── dashboard/     # Data dashboard
│   │       └── ai/            # AI chatbot
│   ├── components/
│   │   ├── layout/
│   │   │   └── sidebar.tsx    # Sidebar navigasi
│   │   └── ui/
│   │       ├── button.tsx     # Komponen tombol
│   │       ├── card.tsx       # Komponen card
│   │       ├── input.tsx      # Komponen input
│   │       ├── label.tsx      # Komponen label
│   │       ├── select.tsx     # Komponen select
│   │       ├── badge.tsx      # Komponen badge/status
│   │       └── textarea.tsx   # Komponen textarea
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Helper functions (formatRupiah, dll)
│   └── store/
│       └── auth-store.ts      # Zustand auth state management
├── .env                       # Environment variables (JANGAN di-commit)
├── .eslintrc.json             # ESLint configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies & scripts
└── README.md                  # Dokumentasi ini
```

---

## 🔌 API Endpoints

### Autentikasi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi koperasi baru |
| POST | `/api/auth/login` | Login dengan nomor HP |
| POST | `/api/auth/verify-otp` | Verifikasi kode OTP |

### Anggota
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/anggota?koperasiId=xxx` | List anggota (dengan search) |
| POST | `/api/anggota` | Tambah anggota baru |
| GET | `/api/anggota/[id]` | Detail anggota + riwayat |
| PUT | `/api/anggota/[id]` | Update data anggota |

### Transaksi Simpanan
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/transaksi?koperasiId=xxx` | List transaksi simpanan |
| POST | `/api/transaksi` | Catat simpanan baru (setor/tarik) |

### Pinjaman
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/pinjaman?koperasiId=xxx` | List pinjaman + angsuran |
| POST | `/api/pinjaman` | Ajukan pinjaman baru |
| POST | `/api/pinjaman/angsuran` | Bayar angsuran |

### Laporan
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/laporan?koperasiId=xxx&jenis=buku-kas` | Buku kas harian |
| GET | `/api/laporan?jenis=simpanan` | Laporan simpanan anggota |
| GET | `/api/laporan?jenis=pinjaman` | Laporan pinjaman |

### Dashboard
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/dashboard?koperasiId=xxx` | Data ringkasan dashboard |

### AI Chatbot
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/ai/chat` | Kirim pertanyaan ke asisten AI |

---

## 📖 Fitur Detail

### 1. Manajemen Anggota
- Tambah anggota dengan auto-generate nomor (KDS-001, KDS-002, ...)
- Search anggota berdasarkan nama, nomor, atau HP
- Lihat profil lengkap dengan riwayat simpanan dan pinjaman
- Status anggota: Aktif, Calon, Nonaktif, Keluar

### 2. Pencatatan Simpanan
- **Simpanan Pokok** — dibayar sekali saat masuk, tidak bisa ditarik
- **Simpanan Wajib** — dibayar rutin setiap bulan
- **Simpanan Sukarela** — bisa setor dan tarik kapan saja
- Saldo ter-update otomatis setelah transaksi

### 3. Manajemen Pinjaman
- Ajukan pinjaman dengan pilihan bunga **Flat** atau **Menurun**
- Jadwal angsuran otomatis ter-generate
- Bayar angsuran satu per satu
- Hitung denda keterlambatan otomatis (0.1%/hari)
- Status pinjaman: Aktif → Lunas

### 4. Laporan Keuangan
- **Buku Kas Harian** — semua transaksi per hari dengan saldo running
- **Laporan Simpanan** — rekapitulasi per anggota per jenis simpanan
- **Laporan Pinjaman** — daftar pinjaman dengan status kolektibilitas
- Filter per bulan dan tahun
- Cetak / Print to PDF

### 5. Asisten AI (Chatbot)
- Tanya-jawab tentang pengelolaan koperasi
- Topik: simpanan, bunga pinjaman, SHU, RAT, pelaporan
- Menggunakan Claude API (dengan fallback demo responses)

### 6. Dashboard
- Total anggota aktif
- Total simpanan bersih
- Total pinjaman beredar
- Total aset koperasi
- Transaksi hari ini
- Alert pinjaman jatuh tempo minggu ini

---

## 🚀 Deployment

### Deploy ke Vercel (Direkomendasikan)

1. Push kode ke GitHub
2. Buka [vercel.com](https://vercel.com/) dan login
3. Klik **"New Project"** → import repository
4. Tambahkan environment variables:
   - `DATABASE_URL` — URL PostgreSQL
   - `NEXTAUTH_SECRET` — random string
   - `ANTHROPIC_API_KEY` — API key Claude (opsional)
5. Klik **"Deploy"**
6. Setelah deploy, jalankan seed:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

### Deploy Manual (VPS/Docker)

```bash
# Build
npm run build

# Jalankan
npm start

# Atau dengan PM2
npm install -g pm2
pm2 start npm --name kopdes-id -- start
```

---

## 🗺 Roadmap

### V1.0 — MVP Hackathon (Saat Ini)
- [x] Registrasi & onboarding koperasi
- [x] Manajemen anggota (CRUD)
- [x] Pencatatan simpanan (pokok, wajib, sukarela)
- [x] Pinjaman & angsuran
- [x] Dashboard ringkasan
- [x] Laporan keuangan (buku kas, simpanan, pinjaman)
- [x] Asisten AI chatbot
- [x] PWA mobile-first

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

---

## 👥 Tim

Dibuat untuk **Hackathon Digital Cooperatives Expo 2026**
Kementerian Koperasi RI × PEBS FEB Universitas Indonesia

---

## 📄 Lisensi

© 2026 kopdes.id — Hak Cipta Dilindungi

---

## ❓ FAQ

### Q: Apakah aplikasi ini gratis?
A: Ya, 100% gratis untuk koperasi desa. Tidak ada biaya tersembunyi.

### Q: Apakah butuh internet terus?
A: Untuk saat ini ya, tapi roadmap termasuk mode offline (PWA + IndexedDB).

### Q: Bagaimana jika lupa password?
A: Sistem menggunakan OTP via WhatsApp, jadi tidak ada password yang perlu diingat.

### Q: Bisa dipakai di HP?
A: Ya! Aplikasi ini mobile-first dan bisa diinstall sebagai PWA di Android.

### Q: Berapa banyak anggota yang bisa didaftarkan?
A: Tidak ada batasan. Sistem menggunakan multi-tenant architecture yang scalable.