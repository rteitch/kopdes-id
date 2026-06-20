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
- [Database Schema](#-database-schema)
- [Fitur Detail](#-fitur-detail)
- [Statistik Aplikasi](#-statistik-aplikasi)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)

---

## 🚀 Fitur Utama

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| 📝 Registrasi Koperasi | ✅ | Daftar koperasi desa dengan wizard 3 langkah + OTP |
| 🎓 Onboarding Wizard | ✅ | Panduan setelah registrasi untuk tambah anggota pertama |
| 🔐 Login OTP | ✅ | Login via nomor HP + OTP WhatsApp (simulated) |
| 👥 Manajemen Anggota | ✅ | CRUD anggota, search, import CSV, auto simpanan pokok |
| 💰 Simpanan | ✅ | Catat simpanan pokok, wajib, sukarela (setor & tarik) |
| 📸 Scan Nota OCR | ✅ | Foto nota/kuitansi, AI ekstrak data transaksi otomatis |
| 🏦 Pinjaman | ✅ | Ajukan pinjaman, jadwal angsuran otomatis, bunga flat/menurun |
| 💳 Angsuran | ✅ | Bayar angsuran, hitung denda keterlambatan otomatis |
| 📊 Dashboard | ✅ | Ringkasan keuangan real-time, rasio kesehatan, alert jatuh tempo |
| 📄 Laporan | ✅ | Buku kas, simpanan, pinjaman, neraca, SHU (print/PDF/Excel) |
| 🧮 Neraca Keuangan | ✅ | Aset = Kewajiban + Modal (SAK ETAP format) |
| 💹 SHU Otomatis | ✅ | Hitung Sisa Hasil Usaha berdasarkan partisipasi anggota |
| 🏷️ Kolektibilitas | ✅ | Lancar/Kurang Lancar/Diragukan/Macet + NPL calculation |
| 🏪 Kas Umum | ✅ | Catat pemasukan & pengeluaran operasional koperasi |
| 🧾 Kuitansi Digital | ✅ | Kuitansi otomatis setelah transaksi, bisa print |
| 📥 Export Excel | ✅ | Export laporan ke CSV/Excel untuk Dinas Koperasi |
| 🤖 Asisten AI | ✅ | Chatbot tanya-jawab tentang pengelolaan koperasi |
| 👤 Portal Anggota | ✅ | Anggota cek saldo, riwayat transaksi, jadwal cicilan mandiri |
| 📱 PWA | ✅ | Bisa diinstall di HP Android tanpa Play Store |
| 🌐 Bahasa Indonesia | ✅ | 100% antarmuka Bahasa Indonesia |
| 📴 Mobile-First | ✅ | Responsive, touch-friendly, ukuran font 16px+ |
| 🔒 RBAC | ✅ | Role-Based Access Control (Ketua, Bendahara, Anggota, Dinas) |
| 📋 Audit Log | ✅ | Semua transaksi dicatat dengan timestamp dan user |

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 |
| Auth | OTP-based authentication |
| AI | Anthropic Claude API + Tesseract.js (OCR) |
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

### 3. Jalankan

```powershell
.\deploy.ps1 docker    # Opsi A: Docker
# ATAU
.\deploy.ps1 dev       # Opsi B: Development
```

---

## 🐳 Deploy dengan Docker

Docker Compose menjalankan **2 container**:
- **db** — PostgreSQL 16 (port 5432)
- **app** — Next.js application (port 3000)

```powershell
.\deploy.ps1 docker        # Build & start
.\deploy.ps1 docker-logs   # Lihat logs
.\deploy.ps1 docker-down   # Stop containers
```

---

## 🖥 Deploy Manual (Tanpa Docker)

```powershell
# Install PostgreSQL, buat database
psql -U postgres -c "CREATE DATABASE kopdes_id;"

# Edit .env dengan DATABASE_URL
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

---

## ☁️ Deploy ke Vercel

```powershell
.\deploy.ps1 push    # Push ke GitHub
# Buka vercel.com → Import repository → Deploy
```

Database: Supabase (gratis) / Neon.tech (gratis) / Railway

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

### Alur Demo (3 Menit untuk Juri)

```
1. Landing page → "Daftar Koperasi Baru" → isi data → OTP → masuk
2. Onboarding wizard → tambah anggota pertama
3. Dashboard → lihat rasio kesehatan koperasi
4. Menu "Anggota" → tambah anggota baru
5. Menu "Simpanan" → catat transaksi + scan nota
6. Menu "Pinjaman" → ajukan pinjaman + lihat jadwal angsuran
7. Menu "Laporan" → pilih "Buku Kas" → Export Excel
8. Menu "Asisten AI" → tanya "Apa bedanya simpanan pokok?"
```

---

## 💻 PowerShell Commands

```powershell
.\deploy.ps1 setup         # Install dependencies & setup
.\deploy.ps1 dev           # Start development server
.\deploy.ps1 build         # Build for production
.\deploy.ps1 start         # Start production server
.\deploy.ps1 seed          # Seed demo data
.\deploy.ps1 docker        # Deploy with Docker
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
├── .env.example            # Environment variables template
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git exclusions
├── next.config.mjs         # Next.js configuration (standalone output)
├── tailwind.config.ts      # Tailwind CSS configuration
├── package.json            # Dependencies & scripts
├── README.md               # Dokumentasi ini
├── PROGRESS.md             # Progress tracker & PRD compliance
│
├── prisma/
│   ├── schema.prisma       # Database schema (9 models, 12 enums)
│   └── seed.ts             # Script seed data demo
│
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service Worker (offline cache)
│
└── src/
    ├── app/
    │   ├── globals.css     # Global styles (Tailwind + custom)
    │   ├── layout.tsx      # Root layout (font, metadata, SW registration)
    │   ├── page.tsx        # Landing page
    │   ├── login/          # Halaman login OTP
    │   ├── daftar/         # Halaman registrasi koperasi
    │   ├── portal/         # Portal anggota (public, self-service)
    │   ├── (dashboard)/    # Route grup dashboard (perlu login)
    │   │   ├── layout.tsx  # Dashboard layout (sidebar + topbar)
    │   │   ├── dashboard/  # Dashboard ringkasan + kesehatan
    │   │   ├── onboarding/ # Onboarding wizard setelah registrasi
    │   │   ├── anggota/    # Manajemen anggota (list + detail)
    │   │   ├── transaksi/  # Catat simpanan + scan nota OCR
    │   │   │   └── scan/   # Scan nota/kuitansi (Tesseract.js OCR)
    │   │   ├── pinjaman/   # Kelola pinjaman & angsuran
    │   │   ├── kas-umum/   # Pemasukan & pengeluaran operasional
    │   │   ├── laporan/    # Laporan keuangan
    │   │   │   ├── shu/    # Sisa Hasil Usaha
    │   │   │   └── neraca/ # Neraca keuangan
    │   │   ├── chatbot/    # Asisten AI koperasi
    │   │   └── pengaturan/ # Pengaturan akun
    │   └── api/            # API Routes (13 endpoints)
    │       ├── auth/       # Register, login, verify OTP
    │       ├── anggota/    # CRUD + import + portal
    │       ├── transaksi/  # Simpanan (setor/tarik)
    │       ├── pinjaman/   # Pinjaman + angsuran
    │       ├── kas-umum/   # Pemasukan & pengeluaran
    │       ├── laporan/    # Buku kas, simpanan, pinjaman, neraca, SHU
    │       ├── dashboard/  # Data dashboard
    │       └── ai/         # AI chatbot
    │
    ├── components/
    │   ├── layout/sidebar.tsx
    │   ├── error-boundary.tsx
    │   ├── kuitansi.tsx     # Komponen kuitansi digital
    │   └── ui/ (button, card, input, label, select, badge, textarea)
    │
    ├── lib/
    │   ├── prisma.ts       # Prisma client singleton
    │   ├── utils.ts        # Helper functions (formatRupiah, dll)
    │   └── export-excel.ts # Export CSV/Excel utility
    │
    ├── store/
    │   └── auth-store.ts   # Zustand auth state management
    │
    └── types/
        └── index.ts        # TypeScript type definitions
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
| POST | `/api/anggota` | Tambah anggota baru (auto simpanan pokok) |
| GET | `/api/anggota/[id]` | Detail anggota + riwayat |
| PUT | `/api/anggota/[id]` | Update data anggota |
| POST | `/api/anggota/import` | Import anggota dari CSV |
| GET | `/api/anggota/portal` | Portal anggota (public, by no HP) |

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

### Kas Umum
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/kas-umum?koperasiId=xxx` | List kas umum |
| POST | `/api/kas-umum` | Catat pemasukan/pengeluaran |

### Laporan
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/laporan?jenis=buku-kas` | Buku kas harian |
| GET | `/api/laporan?jenis=simpanan` | Laporan simpanan anggota |
| GET | `/api/laporan?jenis=pinjaman` | Laporan pinjaman + NPL |
| GET | `/api/laporan?jenis=neraca` | Neraca keuangan |
| GET | `/api/laporan/neraca` | Neraca keuangan (dedicated) |
| GET | `/api/laporan/shu` | Sisa Hasil Usaha |

### Dashboard
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/dashboard?koperasiId=xxx` | Data ringkasan + kesehatan |

### AI Chatbot
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/ai/chat` | Kirim pertanyaan ke asisten AI |

---

## 🗄 Database Schema

**9 Models:**

| Model | Deskripsi | Fields |
|-------|-----------|--------|
| Koperasi | Data koperasi desa | 8 fields |
| Pengguna | User dengan role | 10 fields + OTP |
| Anggota | Anggota koperasi | 10 fields |
| Simpanan | Transaksi simpanan | 10 fields |
| Pinjaman | Data pinjaman | 12 fields |
| Angsuran | Jadwal angsuran | 10 fields |
| KasUmum | Pemasukan & pengeluaran | 8 fields |
| NotifikasiLog | Log notifikasi | 6 fields |
| AuditLog | Audit trail | 10 fields |

**12 Enums:** Role, StatusPengguna, StatusAnggota, JenisSimpanan, JenisTransaksiSimpanan, JenisBunga, StatusPinjaman, StatusAngsuran, JenisKas, TipeNotifikasi, StatusNotifikasi

---

## 📖 Fitur Detail

### 1. Registrasi & Onboarding
- Wizard 3 langkah: Data Koperasi → Data Ketua → Verifikasi OTP
- Setelah registrasi, langsung ke onboarding wizard
- Panduan tambah anggota pertama

### 2. Manajemen Anggota
- Auto-generate nomor anggota (KDS-001, KDS-002, ...)
- Search berdasarkan nama, nomor, atau HP
- Import massal dari CSV
- Auto simpanan pokok Rp 100.000 saat daftar
- Profil lengkap dengan riwayat transaksi

### 3. Simpanan & Scan Nota
- 3 jenis: Pokok (sekali), Wajib (bulanan), Sukarela (bebas)
- Scan nota/kuitansi dengan Tesseract.js OCR
- Kuitansi digital printable setelah transaksi

### 4. Pinjaman & Angsuran
- Bunga Flat atau Menurun
- Jadwal angsuran otomatis ter-generate
- Denda keterlambatan 0.1%/hari
- Status: Aktif → Lunas otomatis
- Klasifikasi kolektibilitas (Lancar/Kurang Lancar/Diragukan/Macet)
- NPL (Non-Performing Loan) calculation

### 5. Kas Umum
- Pemasukan: Jasa pinjaman, pendapatan usaha, subsidi/hibah
- Pengeluaran: Gaji pengurus, operasional, inventaris
- 4 kategori per jenis

### 6. Laporan Keuangan
- **Buku Kas Harian** — transaksi per hari dengan saldo running
- **Laporan Simpanan** — rekap per anggota per jenis
- **Laporan Pinjaman** — dengan kolektibilitas dan NPL
- **Neraca** — Aset = Kewajiban + Modal (SAK ETAP)
- **SHU** — simulasi pembagian berdasarkan partisipasi
- Filter bulan/tahun
- Export: Print-to-PDF + Export Excel/CSV

### 7. Dashboard
- 4 stat cards: Anggota, Simpanan, Pinjaman, Aset
- Rasio Kesehatan Koperasi (skor 1-100 + circular progress)
- Transaksi hari ini
- Alert pinjaman jatuh tempo minggu ini

### 8. Portal Anggota (Self-Service)
- Akses tanpa login (by ID Koperasi + No. HP)
- Cek saldo simpanan (Pokok + Wajib + Sukarela + Total)
- Riwayat transaksi terakhir
- Jadwal cicilan pinjaman

### 9. Asisten AI Chatbot
- Tanya-jawab tentang pengelolaan koperasi
- Topik: simpanan, bunga, SHU, RAT, pelaporan
- Claude API + demo fallback responses

---

## 📊 Statistik Aplikasi

| Metric | Value |
|--------|-------|
| Total Routes | 27 (14 static + 13 API) |
| Prisma Models | 9 |
| Prisma Enums | 12 |
| Build Errors | 0 |
| First Load JS | max 111KB |
| Shared JS | 87.4KB |
| Middleware | 26.6KB |
| PRD Compliance | 94% (17/18 items) |
| Fitur Terimplementasi | 38 |
| Git Commits | 18 |

---

## 🗺 Roadmap

### V1.0 — MVP Hackathon (Saat Ini) ✅
- [x] Registrasi & onboarding koperasi
- [x] Manajemen anggota (CRUD + import)
- [x] Simpanan + kuitansi digital
- [x] Scan nota OCR
- [x] Pinjaman & angsuran + kolektibilitas + NPL
- [x] Kas umum
- [x] Dashboard + kesehatan koperasi
- [x] Laporan (Buku Kas, Simpanan, Pinjaman, Neraca, SHU)
- [x] Export PDF + Excel
- [x] Portal anggota self-service
- [x] AI chatbot
- [x] PWA + offline service worker
- [x] Docker deployment + PowerShell script

### V1.1 — Post-Hackathon
- [ ] Notifikasi WhatsApp real-time (Fonnte/Meta API)
- [ ] IndexedDB offline storage
- [ ] Laporan format standar Kemenkop RI
- [ ] Import anggota dari Excel
- [ ] Dashboard Dinas Koperasi

### V2.0 — Scale
- [ ] Integrasi QRIS untuk pembayaran
- [ ] Mobile app (React Native)
- [ ] Multi-bahasa daerah
- [ ] PgBouncer untuk 10.000+ concurrent users

---

## ❓ FAQ

### Q: Apakah aplikasi ini gratis?
A: Ya, 100% gratis. Semua teknologi open source.

### Q: Database apa yang dipakai?
A: **PostgreSQL 16** berjalan di Docker. Tidak perlu layanan cloud.

### Q: Bisa dipakai di HP?
A: Ya! Mobile-first PWA yang bisa diinstall di Android.

### Q: Berapa banyak anggota yang bisa didaftarkan?
A: Tidak ada batasan. PostgreSQL bisa handle jutaan row.

### Q: Bagaimana jika lupa password?
A: Sistem menggunakan OTP via WhatsApp, tidak ada password.

### Q: Apakah perlu PgBouncer?
A: Tidak untuk hackathon & MVP. Prisma sudah punya built-in connection pooling.

### Q: Bisa deploy di VPS sendiri?
A: Ya! `.\deploy.ps1 docker` — satu perintah selesai.

### Q: Apakah ada mode offline?
A: Service Worker sudah registered untuk cache. IndexedDB offline storage ada di roadmap.

---

## 👥 Tim

Dibuat untuk **Hackathon Digital Cooperatives Expo 2026**
Kementerian Koperasi RI × PEBS FEB Universitas Indonesia

## 📄 Lisensi

© 2026 kopdes.id — Hak Cipta Dilindungi