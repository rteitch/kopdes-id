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

## ☁️ Deploy ke Vercel (Step-by-Step)

### Langkah 1: Persiapan Database Cloud

Pilih salah satu database PostgreSQL cloud (semua gratis):

| Layanan | Free Tier | Link |
|---------|-----------|------|
| **Supabase** ⭐ | 500MB storage, 2 project | [supabase.com](https://supabase.com) |
| **Neon.tech** | 512MB storage, serverless | [neon.tech](https://neon.tech) |
| **Railway** | $5 credit/bulan | [railway.app](https://railway.app) |

**Contoh dengan Supabase:**
1. Buka [supabase.com](https://supabase.com) → Sign up dengan GitHub
2. Klik **"New Project"**
3. Isi: Nama project, Password database, Region: Singapore
4. Tunggu ~2 menit hingga project siap
5. Klik **Settings** → **Database** → Copy **Connection string** (URI format)
6. Ganti `[YOUR-PASSWORD]` dengan password yang Anda buat

Contoh hasil:
```
postgresql://postgres:password123@db.abc123.supabase.co:5432/postgres
```

### Langkah 2: Deploy ke Vercel

```powershell
# 1. Pastikan kode sudah di-push ke GitHub
.\deploy.ps1 push

# 2. Buka vercel.com dan login dengan GitHub
# 3. Klik "Add New Project"
# 4. Import repository "rteitch/kopdes-id"
# 5. Klik "Environment Variables" dan tambahkan:
```

**Environment Variables yang wajib diisi di Vercel:**

| Key | Value | Contoh |
|-----|-------|--------|
| `DATABASE_URL` | PostgreSQL URL | `postgresql://postgres:pw@db.xxx.supabase.co:5432/postgres` |
| `DIRECT_URL` | Sama dengan DATABASE_URL | `postgresql://postgres:pw@db.xxx.supabase.co:5432/postgres` |
| `NEXTAUTH_SECRET` | Random string 32+ karakter | `kopdes-random-secret-key-2026-abc` |
| `NEXTAUTH_URL` | URL aplikasi Anda | `https://kopdes-id.vercel.app` |

```powershell
# 6. Klik "Deploy" — tunggu ~2 menit
# 7. Setelah deploy selesai, jalankan migrasi database:
#    Buka Vercel Dashboard → Project → Settings → Integrations → Vercel CLI
#    Atau gunakan Vercel CLI:
npm i -g vercel
vercel login
vercel env pull .env.local
npx prisma db push
npx tsx prisma/seed.ts
```

### Langkah 3: Akses Aplikasi

Setelah deploy berhasil, aplikasi bisa diakses di:
```
https://kopdes-id.vercel.app
```

Login demo:
- **Ketua:** `081234567890`
- **Bendahara:** `081234567891`

---

## 🌐 Custom Domain (Opsional)

### Opsi Domain yang Tersedia

| Domain | Harga | Registrar | Keterangan |
|--------|-------|-----------|------------|
| `kopdes-id.vercel.app` | **GRATIS** | Vercel | Otomatis, langsung tersedia |
| `kopdes-id.com` | ~Rp 150rb/tahun | [Cloudflare](https://cloudflare.com) / [Namecheap](https://namecheap.com) | Domain internasional |
| `kopdes-merahputih.id` | ~Rp 100rb/tahun | [Niagahoster](https://niagahoster.co.id) / [Domainesia](https://domainesia.com) | Domain Indonesia |
| `kopdesdigital.id` | ~Rp 100rb/tahun | Niagahoster / Domainesia | Domain Indonesia |
| `mykopdes.id` | ~Rp 100rb/tahun | Niagahoster / Domainesia | Domain Indonesia |
| `kopdes.app` | ~Rp 200rb/tahun | Cloudflare | Domain .app (HTTPS only) |
| `kopdes.desa.id` | ~Rp 50rb/tahun | Pandi | Domain khusus desa |

### Cara Setup Custom Domain di Vercel

**Langkah 1: Beli Domain**
1. Buka registrar domain (contoh: [Cloudflare](https://cloudflare.com), [Niagahoster](https://niagahoster.co.id))
2. Cari dan beli domain yang diinginkan
3. Catat nameserver atau DNS settings

**Langkah 2: Tambahkan Domain di Vercel**
1. Buka [vercel.com](https://vercel.com) → Project Anda
2. Klik **Settings** → **Domains**
3. Ketik domain Anda (contoh: `kopdes-merahputih.id`)
4. Klik **Add**
5. Vercel akan menampilkan DNS records yang perlu ditambahkan

**Langkah 3: Update DNS di Registrar**

Tambahkan DNS records berikut di registrar domain Anda:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Atau jika menggunakan nameserver Vercel:
| Type | Name | Value |
|------|------|-------|
| `NS` | `@` | `ns1.vercel-dns.com` |
| `NS` | `@` | `ns2.vercel-dns.com` |

**Langkah 4: Update Environment Variable**

Setelah domain aktif, update di Vercel:
```
NEXTAUTH_URL=https://kopdes-merahputih.id
```

**Langkah 5: Tunggu propagasi DNS (biasanya 5-30 menit)**

### Contoh: Deploy dengan Domain Berbeda

Jika user lain ingin fork repo dan menggunakan domain sendiri:

```powershell
# 1. Fork repository di GitHub
# 2. Clone fork Anda
git clone https://github.com/USERNAME/kopdes-id.git
cd kopdes-id

# 3. Edit package.json (opsional, ganti nama)
# 4. Deploy ke Vercel
vercel login
vercel --prod

# 5. Tambahkan custom domain di Vercel Dashboard
# 6. Update NEXTAUTH_URL ke domain Anda
# 7. Jalankan migrasi database
vercel env pull .env.local
npx prisma db push
npx tsx prisma/seed.ts
```

---

## 🖥 Deploy ke VPS Sendiri

### Spesifikasi Minimum VPS
| Resource | Minimum | Rekomendasi |
|----------|---------|-------------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 GB | 2 GB |
| Storage | 20 GB | 40 GB |
| OS | Ubuntu 22.04 | Ubuntu 22.04 |
| Harga | ~Rp 60rb/bulan | ~Rp 120rb/bulan |

### Provider VPS Indonesia
| Provider | Harga Mulai | Link |
|----------|-------------|------|
| **DigitalOcean** | $6/bulan | [digitalocean.com](https://digitalocean.com) |
| **UpCloud** | €7/bulan | [upcloud.com](https://upcloud.com) |
| **IDCloudHost** | Rp 60rb/bulan | [idcloudhost.com](https://idcloudhost.com) |
| **Rumahweb** | Rp 75rb/bulan | [rumahweb.com](https://rumahweb.com) |

### Step-by-Step Deploy ke VPS

```bash
# 1. SSH ke VPS
ssh root@YOUR_VPS_IP

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 3. Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Clone repository
git clone https://github.com/rteitch/kopdes-id.git
cd kopdes-id

# 5. Edit .env untuk production
nano .env
# Ganti DATABASE_URL dengan PostgreSQL lokal/docker
# Ganti NEXTAUTH_URL dengan domain/IP VPS Anda
# Ganti NEXTAUTH_SECRET dengan random string

# 6. Jalankan dengan Docker
docker-compose up -d --build

# 7. Tunggu build selesai (~3-5 menit pertama)
docker-compose logs -f app

# 8. Jalankan migrasi database
docker-compose exec app npx prisma db push
docker-compose exec app npx tsx prisma/seed.ts

# 9. Akses di browser
# http://YOUR_VPS_IP:3000
```

### Setup Nginx Reverse Proxy + SSL (Opsional)

```bash
# Install Nginx dan Certbot
apt install nginx certbot python3-certbot-nginx -y

# Buat config Nginx
nano /etc/nginx/sites-available/kopdes-id
```

```nginx
server {
    server_name kopdes-merahputih.id www.kopdes-merahputih.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/kopdes-id /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Install SSL certificate (HTTPS gratis)
certbot --nginx -d kopdes-merahputih.id -d www.kopdes-merahputih.id

# Auto-renewal sudah ter-setup otomatis
```

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

## 👥 Tim & Developer

| | |
|---|---|
| **Developer** | **Rizal Taufiq Hidayat** |
| GitHub | [github.com/rteitch](https://github.com/rteitch) |
| Proyek | [github.com/rteitch/kopdes-id](https://github.com/rteitch/kopdes-id) |

Dibuat untuk **Hackathon Digital Cooperatives Expo 2026**
Kementerian Koperasi RI × PEBS FEB Universitas Indonesia

## 📄 Lisensi

© 2026 kopdes.id — Rizal Taufiq Hidayat — Hak Cipta Dilindungi
