# Product Requirements Document (PRD)
## kopdes.id — Sistem Digital Manajemen Koperasi Desa
**Hackathon Digital Cooperatives Expo 2026**
Kementerian Koperasi RI × PEBS FEB Universitas Indonesia

---

> **Versi:** 1.0.0
> **Tanggal:** Juni 2026
> **Pilar:** Pilar 1 — Peningkatan Volume Usaha Koperasi
> **Status:** Draft untuk Hackathon Submission

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang & Kajian Masalah](#2-latar-belakang--kajian-masalah)
3. [Tujuan Produk](#3-tujuan-produk)
4. [Segmen Pengguna & Persona](#4-segmen-pengguna--persona)
5. [Ruang Lingkup Produk (Scope)](#5-ruang-lingkup-produk-scope)
6. [Fitur & Functional Requirements](#6-fitur--functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Arsitektur Sistem & Tech Stack](#8-arsitektur-sistem--tech-stack)
9. [Desain Database](#9-desain-database)
10. [User Flow & Journey](#10-user-flow--journey)
11. [MVP Scope (48 Jam Hackathon)](#11-mvp-scope-48-jam-hackathon)
12. [Metrik Keberhasilan](#12-metrik-keberhasilan)
13. [Risiko & Mitigasi](#13-risiko--mitigasi)
14. [Roadmap Pasca Hackathon](#14-roadmap-pasca-hackathon)
15. [Kajian Referensi & Landasan Data](#15-kajian-referensi--landasan-data)

---

## 1. Ringkasan Eksekutif

**kopdes.id** adalah platform manajemen operasional koperasi desa berbasis web dan mobile yang dirancang khusus untuk mendukung Program Koperasi Desa/Kelurahan Merah Putih (Inpres No. 9 Tahun 2025). Produk ini menjawab kebutuhan paling mendesak di lapangan: **80.000 koperasi desa yang baru terbentuk membutuhkan sistem pembukuan digital yang bisa langsung dipakai pengurus non-IT sejak hari pertama operasional.**

### Proposisi Nilai Utama

```
"Dari nota kertas ke laporan resmi Kemenkop — dalam 3 menit."
```

kopdes.id memungkinkan pengurus koperasi desa mencatat transaksi simpanan, pinjaman, dan usaha koperasi secara digital — termasuk dengan fitur scan nota manual menggunakan kamera smartphone — lalu menghasilkan laporan keuangan yang sesuai format standar Kementerian Koperasi RI secara otomatis.

---

## 2. Latar Belakang & Kajian Masalah

### 2.1 Konteks Kebijakan Nasional

Pemerintah Indonesia melalui **Instruksi Presiden Nomor 9 Tahun 2025** memerintahkan pembentukan Koperasi Desa/Kelurahan Merah Putih (Kopdes Merah Putih) di seluruh desa dan kelurahan Indonesia. Program ini menargetkan **80.000 koperasi baru** yang diresmikan serentak pada **12 Juli 2025**, bertepatan dengan Hari Koperasi Nasional.

Lebih lanjut, **Surat Edaran Menteri Keuangan Nomor S-9/MK/PK/2025** menetapkan bahwa pembentukan Kopdes Merah Putih menjadi **syarat wajib pencairan Dana Desa Tahap II TA 2025**. Hal ini mendorong percepatan pembentukan koperasi yang tidak selalu diikuti kesiapan sumber daya manusia dan sistem pengelolaan.

### 2.2 Identifikasi Masalah

Berdasarkan kajian data dari berbagai sumber riset (lihat Bagian 15):

#### Masalah Utama #1: Kekacauan Administrasi Sejak Hari Pertama

Pengurus koperasi desa yang baru terbentuk — mayoritas bukan berlatar belakang akuntansi atau teknologi — langsung dihadapkan pada keharusan mengelola:
- Data ratusan anggota baru
- Pencatatan simpanan pokok, simpanan wajib, dan simpanan sukarela
- Pencatatan pinjaman dan cicilan
- Laporan keuangan untuk Dinas Koperasi Kabupaten/Kota

Tanpa sistem digital, ini dilakukan secara **manual di buku tulis atau spreadsheet Excel yang tidak terstandar**.

#### Masalah Utama #2: Rendahnya Literasi Digital Pengurus

Survei ADEKMI & IKOPIN (April–Mei 2024) menemukan bahwa:
- **79,56%** responden menjabat sebagai pengurus koperasi (bukan profesional/manajer)
- Mayoritas lulusan S1 (52,55%) dan S2 (19,34%), namun **sangat sedikit yang berlatar teknologi**
- Kurangnya profesionalisme dalam pengelolaan koperasi menjadi hambatan utama inovasi

#### Masalah Utama #3: Keterbatasan Infrastruktur Digital

Menurut Indeks Transformasi Digital Indonesia 2024:
- Wilayah Indonesia Tengah dan Timur masih memiliki **akses internet yang tidak stabil**
- Banyak desa hanya mengandalkan jaringan 3G atau koneksi satelit
- Solusi digital yang membutuhkan koneksi internet stabil **tidak akan bisa diadopsi** oleh mayoritas koperasi desa

#### Masalah Utama #4: Tidak Ada Standar Pelaporan Digital

Setiap Dinas Koperasi di berbagai kabupaten memiliki format laporan yang berbeda-beda. Koperasi desa kesulitan menyesuaikan format laporan keuangan yang diminta, sehingga **audit dan pengawasan dari Kemenkop menjadi tidak efisien**.

#### Masalah Utama #5: Solusi yang Ada Terlalu Kompleks

Aplikasi koperasi yang sudah ada di pasar (seperti Smartcoop, SIKOP, dll) dirancang untuk koperasi skala menengah-besar dengan fitur yang terlalu kompleks untuk koperasi desa baru. Kurva pembelajaran yang tinggi menyebabkan banyak pengurus kembali ke pencatatan manual.

### 2.3 Peluang

```
80.000 koperasi baru × rata-rata 200 anggota = 16.000.000 anggota koperasi desa
yang membutuhkan sistem manajemen sederhana dan terpercaya.
```

Ini adalah pasar yang besar dan kebutuhan yang bersifat **mendesak dan nyata saat ini**.

---

## 3. Tujuan Produk

### 3.1 Tujuan Bisnis (Business Goals)

| # | Tujuan | Indikator Keberhasilan |
|---|--------|------------------------|
| BG-1 | Menjadi platform manajemen koperasi desa paling mudah digunakan di Indonesia | Onboarding selesai dalam < 10 menit tanpa pelatihan |
| BG-2 | Mendukung implementasi Inpres No. 9/2025 secara langsung | Laporan sesuai format standar Kemenkop RI |
| BG-3 | Skalabel ke 80.000 koperasi desa | Arsitektur multi-tenant yang ringan |

### 3.2 Tujuan Pengguna (User Goals)

| # | Tujuan | Persona |
|---|--------|---------|
| UG-1 | Catat transaksi simpanan & pinjaman dengan cepat, tanpa perlu tahu akuntansi | Pengurus Koperasi |
| UG-2 | Lihat saldo dan riwayat transaksi kapan saja lewat HP | Anggota Koperasi |
| UG-3 | Dapatkan laporan keuangan siap cetak sesuai format Kemenkop | Ketua/Bendahara |
| UG-4 | Monitor kesehatan koperasi desa secara real-time | Dinas Koperasi / Kemenkop |

### 3.3 Tujuan Hackathon

Dalam 48 jam sprint hackathon, target yang harus tercapai adalah:
- Demo MVP yang bisa dijalankan live oleh juri
- Alur utama: daftar koperasi → tambah anggota → catat transaksi → lihat laporan
- Minimal 3 fitur inti yang berfungsi penuh

---

## 4. Segmen Pengguna & Persona

### 4.1 Persona 1: Pak Hadi — Ketua Koperasi Desa

```
Nama      : Hadi Santoso, 52 tahun
Lokasi    : Desa Sukomulyo, Kabupaten Grobogan, Jawa Tengah
Pekerjaan : Petani + Ketua RT (baru dipilih jadi Ketua Kopdes)
Perangkat : Smartphone Android mid-range, paket data 4G terbatas
Literasi  : Bisa WhatsApp, Facebook, dan YouTube. Belum pernah pakai aplikasi keuangan.

Pain points:
- "Saya tidak tahu cara bikin laporan keuangan untuk dinas koperasi."
- "Data anggota saya simpan di buku tulis, takut hilang atau rusak."
- "Kalau ada yang minta pinjaman, saya tulis di kertas dulu, nanti lupa catatnya."

Goals:
- Semua data anggota dan transaksi tersimpan aman di HP
- Bisa cetak laporan saat ada kunjungan dari dinas
```

### 4.2 Persona 2: Ibu Sari — Bendahara Koperasi Desa

```
Nama      : Sari Rahayu, 38 tahun
Lokasi    : Kelurahan Tegalrejo, Kota Magelang
Pekerjaan : Guru SD (rangkap sebagai bendahara kopdes)
Perangkat : Laptop + Smartphone Android
Literasi  : Terbiasa Excel, tapi tidak paham software akuntansi

Pain points:
- "Saya bikin laporan di Excel sendiri tapi saya tidak yakin formatnya benar."
- "Tiap bulan harus rekap manual dari catatan anggota, makan waktu 2 hari."
- "Takut salah hitung, nanti kena masalah saat diaudit."

Goals:
- Software yang otomatis hitung SHU (Sisa Hasil Usaha)
- Laporan keuangan otomatis dalam format PDF siap kirim ke dinas
```

### 4.3 Persona 3: Budi — Anggota Koperasi Desa

```
Nama      : Budi Hartono, 29 tahun
Lokasi    : Desa Cimanuk, Kabupaten Pandeglang, Banten
Pekerjaan : Petani muda + anggota Kopdes Merah Putih
Perangkat : Smartphone Android entry-level

Pain points:
- "Saya tidak tahu berapa total simpanan saya di koperasi."
- "Mau tanya ke pengurus harus datang ke kantor, jauh."
- "Pernah ada selisih antara catatan saya dan catatan pengurus."

Goals:
- Bisa cek saldo simpanan dan riwayat transaksi dari HP kapan saja
- Terima notifikasi WhatsApp saat ada transaksi atas nama saya
```

### 4.4 Persona 4: Bu Dian — Petugas Dinas Koperasi

```
Nama      : Dian Puspita, 45 tahun
Lokasi    : Dinas Koperasi Kabupaten Bogor
Pekerjaan : Fungsional Penyuluh Koperasi

Pain points:
- "Saya harus kunjungi 50+ koperasi desa, tidak ada waktu cek satu per satu."
- "Format laporan dari setiap koperasi berbeda-beda, susah dibandingkan."
- "Tidak bisa tahu mana koperasi yang sehat dan mana yang bermasalah tanpa datang langsung."

Goals:
- Dashboard monitoring semua koperasi desa di wilayahnya
- Alert otomatis jika ada koperasi dengan indikator kesehatan buruk
```

---

## 5. Ruang Lingkup Produk (Scope)

### 5.1 In Scope (Masuk dalam Produk)

**Fase MVP Hackathon (48 jam):**
- Registrasi & onboarding koperasi desa
- Manajemen data anggota (tambah, edit, lihat)
- Pencatatan transaksi: simpanan pokok, wajib, sukarela, pinjaman, angsuran
- Dashboard ringkasan keuangan koperasi
- Laporan keuangan sederhana (neraca, buku kas) dalam format PDF
- Antarmuka berbahasa Indonesia yang sangat sederhana (mobile-first)
- Mode offline untuk input transaksi (sinkronisasi saat ada internet)

**Fase Post-Hackathon V1:**
- Scan nota/kuitansi via kamera (AI-powered OCR)
- Notifikasi WhatsApp untuk anggota
- Laporan format standar Kemenkop RI
- Portal anggota (cek saldo mandiri)
- Dashboard Dinas Koperasi

### 5.2 Out of Scope (Tidak Masuk Produk Saat Ini)

- Integrasi pembayaran digital (GoPay, OVO, QRIS) — terlalu kompleks untuk MVP
- Fitur marketplace atau e-commerce koperasi
- Modul koperasi kredit/simpan-pinjam skala besar
- Sistem akuntansi double-entry penuh
- Fitur multi-bahasa daerah

---

## 6. Fitur & Functional Requirements

### 6.1 Modul Autentikasi & Registrasi

#### FR-AUTH-01: Registrasi Koperasi
```
Sebagai pengurus koperasi,
Saya ingin mendaftarkan koperasi desa saya ke sistem,
Agar semua data koperasi tersimpan dan terkelola secara digital.
```

**Acceptance Criteria:**
- Form registrasi memuat: Nama Koperasi, No. Badan Hukum, Nama Desa/Kelurahan, Kabupaten/Kota, Provinsi, Nama Ketua, No. HP Ketua
- Validasi nomor HP dengan format Indonesia (+62)
- OTP via WhatsApp/SMS untuk verifikasi
- Setelah berhasil daftar, langsung masuk ke onboarding wizard

#### FR-AUTH-02: Login Multi-Role
```
Sebagai pengguna,
Saya ingin login menggunakan nomor HP,
Agar tidak perlu mengingat username/password yang rumit.
```

**Role yang tersedia:**
- `KETUA` — akses penuh
- `BENDAHARA` — akses transaksi dan laporan
- `ANGGOTA` — akses portal anggota (lihat saldo saja)
- `DINAS` — akses dashboard monitoring (read-only)

---

### 6.2 Modul Manajemen Anggota

#### FR-ANG-01: Tambah Anggota
```
Sebagai pengurus,
Saya ingin menambahkan data anggota koperasi,
Agar semua anggota terdaftar dan transaksi bisa dikaitkan ke anggota yang tepat.
```

**Data yang dicatat:**
- Nama lengkap, NIK (opsional), No. HP
- Tanggal bergabung
- Status keanggotaan (Aktif / Tidak Aktif / Calon Anggota)
- Simpanan pokok (otomatis dicatat saat pendaftaran)

**Acceptance Criteria:**
- Bisa tambah anggota 1 per 1 atau import dari file Excel/CSV
- Validasi duplikat berdasarkan NIK atau No. HP
- Kartu anggota digital bisa diunduh/dibagikan via WhatsApp

#### FR-ANG-02: Lihat Profil Anggota
```
Sebagai pengurus,
Saya ingin melihat profil lengkap anggota beserta riwayat transaksinya,
Agar saya bisa memantau kondisi keuangan per anggota.
```

**Informasi yang tampil:**
- Total simpanan (pokok + wajib + sukarela)
- Total pinjaman aktif & sisa tagihan
- Riwayat transaksi 12 bulan terakhir
- Status cicilan (Lancar / Kurang Lancar / Macet)

---

### 6.3 Modul Transaksi Keuangan

#### FR-TRX-01: Catat Simpanan
```
Sebagai bendahara,
Saya ingin mencatat setoran simpanan dari anggota,
Agar saldo simpanan anggota selalu ter-update secara real-time.
```

**Jenis simpanan yang didukung:**
| Kode | Jenis | Keterangan |
|------|-------|------------|
| SP | Simpanan Pokok | Dibayar sekali saat masuk, tidak bisa ditarik |
| SW | Simpanan Wajib | Dibayar rutin setiap bulan |
| SS | Simpanan Sukarela | Sewaktu-waktu, bisa ditarik |

**Acceptance Criteria:**
- Input minimal: nama/ID anggota, jenis simpanan, jumlah, tanggal
- Generate kuitansi digital otomatis setelah simpan
- Transaksi bisa dibatalkan dalam 24 jam (soft-delete dengan alasan)
- Mendukung input offline (disimpan lokal, sync saat ada koneksi)

#### FR-TRX-02: Catat Pinjaman
```
Sebagai bendahara,
Saya ingin mencatat pengajuan dan pencairan pinjaman anggota,
Agar semua pinjaman terdokumentasi dan jadwal cicilan otomatis terbuat.
```

**Data pinjaman:**
- Anggota peminjam
- Jumlah pinjaman
- Jangka waktu (bulan)
- Bunga (flat atau menurun)
- Tujuan pinjaman (opsional, untuk klasifikasi)

**Acceptance Criteria:**
- Sistem otomatis hitung jadwal angsuran dan tampilkan tabel cicilan
- Alert otomatis (via WhatsApp) ke anggota H-3 sebelum jatuh tempo
- Status pinjaman ter-update otomatis: Aktif → Lunas

#### FR-TRX-03: Catat Angsuran Pinjaman
```
Sebagai bendahara,
Saya ingin mencatat pembayaran angsuran dari anggota,
Agar sisa tagihan otomatis berkurang dan status pinjaman ter-update.
```

**Acceptance Criteria:**
- Pilih pinjaman aktif anggota dari daftar
- Input jumlah yang dibayar (bisa lebih dari angsuran = pelunasan dipercepat)
- Generate kuitansi pembayaran angsuran
- Hitung denda keterlambatan otomatis jika melewati jatuh tempo

#### FR-TRX-04: Catat Kas Umum (Pemasukan & Pengeluaran)
```
Sebagai bendahara,
Saya ingin mencatat pemasukan dan pengeluaran operasional koperasi,
Agar arus kas koperasi terpantau dengan baik.
```

**Kategori kas:**
- Pemasukan: Jasa pinjaman, pendapatan usaha unit, subsidi/hibah
- Pengeluaran: Gaji pengurus, biaya operasional, pembelian inventaris

---

### 6.4 Modul Laporan Keuangan

#### FR-LAP-01: Buku Kas Harian
- Rekap semua transaksi per hari, diurutkan kronologis
- Filter per periode (hari, minggu, bulan, tahun)
- Export ke PDF dan Excel

#### FR-LAP-02: Neraca Keuangan
- Tampilkan aset, kewajiban, dan modal koperasi
- Diperbarui otomatis setiap ada transaksi baru
- Format sesuai standar koperasi (SAK ETAP)

#### FR-LAP-03: Laporan Simpanan Anggota
- Rekapitulasi total simpanan per jenis per anggota
- Bisa difilter per periode RAT (Rapat Anggota Tahunan)
- Export ke format Excel untuk dilaporkan ke Dinas Koperasi

#### FR-LAP-04: Laporan Pinjaman & Kolektibilitas
- Daftar semua pinjaman aktif beserta status kolektibilitas
- Klasifikasi: Lancar, Kurang Lancar, Diragukan, Macet
- Hitung NPL (Non-Performing Loan) otomatis

#### FR-LAP-05: Sisa Hasil Usaha (SHU)
- Hitung SHU otomatis berdasarkan partisipasi anggota
- Simulasi pembagian SHU sebelum RAT
- Cetak slip SHU per anggota

---

### 6.5 Modul Dashboard

#### FR-DASH-01: Dashboard Pengurus
Widget yang tampil:
- Total anggota aktif
- Total aset koperasi (simpanan + kas)
- Total pinjaman beredar
- Rasio kesehatan koperasi (sederhana)
- Transaksi hari ini
- Pinjaman jatuh tempo minggu ini (alert)

#### FR-DASH-02: Portal Anggota (Self-Service)
Akses via link/QR code unik per koperasi:
- Cek saldo total simpanan
- Lihat riwayat transaksi 6 bulan
- Lihat jadwal cicilan pinjaman (jika ada)
- Download kuitansi simpanan

---

### 6.6 Fitur AI (Diferensiasi)

#### FR-AI-01: Scan Nota/Kuitansi (OCR)
```
Sebagai bendahara,
Saya ingin memfoto nota/kuitansi transaksi menggunakan kamera HP,
Agar data transaksi otomatis terisi tanpa perlu ketik manual.
```

**Flow:**
1. Bendahara tap tombol "Scan Nota"
2. Ambil foto atau upload gambar nota
3. AI ekstrak: tanggal, nominal, keterangan
4. Data ter-pre-fill di form transaksi
5. Bendahara verifikasi dan simpan

**Model AI yang digunakan:** Google Vision API / Tesseract.js (offline)

#### FR-AI-02: Asisten Tanya-Jawab Koperasi
```
Sebagai pengurus yang tidak paham akuntansi,
Saya ingin bisa tanya ke chatbot tentang cara pembukuan,
Agar saya tidak perlu cari informasi di luar aplikasi.
```

**Contoh pertanyaan yang bisa dijawab:**
- "Apa bedanya simpanan wajib dan simpanan pokok?"
- "Bagaimana cara hitung bunga pinjaman flat?"
- "Kapan saya harus buat laporan RAT?"

**Model AI:** Claude API (claude-sonnet-4-6) dengan context koperasi

---

## 7. Non-Functional Requirements

### 7.1 Performa

| Metrik | Target |
|--------|--------|
| Waktu loading halaman pertama | < 3 detik di jaringan 3G |
| Waktu respons API | < 500ms untuk 95% request |
| Waktu sync offline data | < 5 detik setelah koneksi kembali |
| Ukuran bundle JavaScript | < 500KB (gzip) |

### 7.2 Ketersediaan & Keandalan

| Metrik | Target |
|--------|--------|
| Uptime | 99.5% (maksimal downtime 3,6 jam/bulan) |
| Mode offline | Semua fitur input bisa dijalankan tanpa internet |
| Backup data | Otomatis setiap 24 jam ke cloud storage |
| Recovery Point Objective (RPO) | Maksimal 24 jam kehilangan data |

### 7.3 Keamanan

- Enkripsi data in-transit: TLS 1.3
- Enkripsi data at-rest: AES-256
- Autentikasi: OTP-based (tidak ada password yang disimpan)
- Otorisasi: Role-Based Access Control (RBAC)
- Audit log: Semua aksi transaksi dicatat dengan timestamp dan user
- Tidak menyimpan data sensitif (NIK) dalam plaintext

### 7.4 Aksesibilitas & Usabilitas

- Antarmuka dalam **Bahasa Indonesia** penuh
- Ukuran font minimal 16px untuk semua teks penting
- Tombol aksi minimal berukuran 44×44px (standar touch target)
- Mendukung perangkat Android dengan RAM 2GB ke atas
- Warna dan kontras memenuhi standar WCAG 2.1 AA

### 7.5 Skalabilitas

- Arsitektur multi-tenant: 1 instalasi bisa melayani ribuan koperasi
- Horizontal scaling via container orchestration
- Database partitioning per koperasi (tenant isolation)

---

## 8. Arsitektur Sistem & Tech Stack

### 8.1 Gambaran Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        PENGGUNA                                  │
│  [Pengurus HP]    [Bendahara Laptop]    [Anggota HP]            │
└────────┬───────────────────┬───────────────────┬────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                                │
│              Next.js 14 (App Router)                            │
│         PWA (Progressive Web App) + Service Worker              │
│              IndexedDB untuk Offline Cache                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER                                   │
│                   Next.js API Routes                            │
│         (REST API + tRPC untuk type-safe calls)                 │
└──────┬──────────────────────┬──────────────────────────┬────────┘
       │                      │                          │
       ▼                      ▼                          ▼
┌────────────┐    ┌───────────────────┐    ┌────────────────────┐
│  Database   │    │   AI Services     │    │ Notification       │
│  Supabase   │    │                   │    │ Service            │
│  (Postgres) │    │ - Claude API      │    │                    │
│             │    │   (Chatbot)       │    │ - WhatsApp via     │
│  + Prisma   │    │ - Google Vision   │    │   Fonnte/WA Cloud  │
│    ORM      │    │   (OCR)           │    │ - Email via        │
│             │    │                   │    │   Resend           │
└────────────┘    └───────────────────┘    └────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                                 │
│              Supabase Storage (dokumen, foto nota)              │
│              Cloudflare R2 (backup laporan PDF)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Tech Stack Lengkap

#### Frontend

| Komponen | Teknologi | Alasan Pemilihan |
|----------|-----------|------------------|
| Framework | **Next.js 14** (App Router) | SSR untuk performa di jaringan lambat, file-system routing, built-in API routes |
| Bahasa | **TypeScript** | Type safety mengurangi bug di hackathon sprint |
| Styling | **Tailwind CSS** | Rapid UI development, tidak perlu custom CSS |
| Komponen UI | **shadcn/ui** | Aksesibel, customizable, tidak butuh instalasi library besar |
| State Management | **Zustand** | Ringan, simple, cukup untuk skala MVP |
| Offline Support | **PWA + Workbox** | Service Worker untuk cache, IndexedDB untuk data offline |
| Form Handling | **React Hook Form + Zod** | Validasi form yang kuat dengan TypeScript |
| Charts/Grafik | **Recharts** | Ringan, cocok untuk dashboard keuangan sederhana |
| PDF Generator | **@react-pdf/renderer** | Generate laporan PDF langsung di browser |
| Tanggal | **date-fns** | Ringan, tree-shakeable, format tanggal Indonesia |

#### Backend

| Komponen | Teknologi | Alasan Pemilihan |
|----------|-----------|------------------|
| Runtime | **Node.js 20 LTS** | Ecosystem terlengkap, performa stabil |
| API Layer | **Next.js API Routes + tRPC** | Full-stack TypeScript, type-safe end-to-end |
| ORM | **Prisma** | Schema-first, migration otomatis, type-safe queries |
| Autentikasi | **NextAuth.js v5** | OTP-ready, session management, multi-provider |
| Validasi | **Zod** | Schema validation yang konsisten antara frontend-backend |
| Task Queue | **Upstash QStash** | Serverless job queue untuk notifikasi async |

#### Database & Storage

| Komponen | Teknologi | Alasan Pemilihan |
|----------|-----------|------------------|
| Database Utama | **Supabase (PostgreSQL)** | Managed PostgreSQL, free tier cukup untuk MVP, real-time subscription |
| Cache | **Upstash Redis** | Serverless Redis, cocok untuk rate limiting dan session cache |
| File Storage | **Supabase Storage** | Terintegrasi dengan database, untuk foto nota dan dokumen |
| Backup Laporan | **Cloudflare R2** | S3-compatible, murah, CDN terintegrasi |

#### AI & External Services

| Komponen | Teknologi | Alasan Pemilihan |
|----------|-----------|------------------|
| AI Chatbot | **Anthropic Claude API** (claude-sonnet-4-6) | Konteks panjang untuk sistem prompt koperasi, bahasa Indonesia bagus |
| OCR Nota | **Google Cloud Vision API** | Akurasi tinggi untuk teks Indonesia, handwriting support |
| OCR Fallback | **Tesseract.js** | Open source, bisa jalan offline di browser |
| WhatsApp Notif | **Fonnte API** / **Meta WA Business Cloud** | Jangkauan luas, pengurus koperasi desa semua pakai WA |
| Email | **Resend** | Developer-friendly, free tier cukup untuk hackathon |

#### Infrastructure & DevOps

| Komponen | Teknologi | Alasan Pemilihan |
|----------|-----------|------------------|
| Hosting | **Vercel** | Deploy dalam hitungan menit, Next.js native, free tier |
| Domain | **kopdes.id** | Sudah ada / custom domain via Vercel |
| CI/CD | **GitHub Actions** | Gratis, terintegrasi dengan repo |
| Monitoring | **Vercel Analytics + Sentry** | Error tracking dan performance monitoring |
| Environment | **Doppler** | Secrets management yang aman |

### 8.3 Alasan Pemilihan Stack Ini untuk Hackathon

**Kecepatan Development:**
- Next.js + TypeScript + shadcn/ui = UI bisa dibangun 3× lebih cepat
- Prisma dengan Supabase = tidak perlu setup database manual
- Vercel = deploy dengan `git push`, tidak perlu konfigurasi server

**Cocok untuk Konteks Indonesia:**
- PWA = bisa diinstall di HP Android tanpa Play Store
- Offline-first = bisa dipakai di daerah sinyal lemah
- WhatsApp integration = channel komunikasi yang sudah familiar

**Skalabilitas Post-Hackathon:**
- Stack ini mampu menangani ratusan ribu pengguna tanpa ganti arsitektur
- Supabase Row Level Security = multi-tenant siap pakai

---

## 9. Desain Database

### 9.1 Entity Relationship Diagram (Teks)

```
KOPERASI
├── id (uuid, PK)
├── nama (varchar)
├── no_badan_hukum (varchar, unique)
├── desa (varchar)
├── kecamatan (varchar)
├── kabupaten (varchar)
├── provinsi (varchar)
├── created_at (timestamp)
└── settings (jsonb) -- konfigurasi bunga, periode, dll

PENGGUNA
├── id (uuid, PK)
├── koperasi_id (uuid, FK → KOPERASI)
├── nama (varchar)
├── no_hp (varchar, unique)
├── role (enum: KETUA, BENDAHARA, PENGURUS, ANGGOTA, DINAS)
├── status (enum: AKTIF, NONAKTIF)
└── created_at (timestamp)

ANGGOTA
├── id (uuid, PK)
├── koperasi_id (uuid, FK → KOPERASI)
├── pengguna_id (uuid, FK → PENGGUNA, nullable)
├── nomor_anggota (varchar) -- auto-generate: KDS-001
├── nik (varchar, nullable)
├── nama (varchar)
├── no_hp (varchar)
├── tanggal_masuk (date)
├── status (enum: CALON, AKTIF, NONAKTIF, KELUAR)
└── created_at (timestamp)

SIMPANAN
├── id (uuid, PK)
├── koperasi_id (uuid, FK)
├── anggota_id (uuid, FK → ANGGOTA)
├── jenis (enum: POKOK, WAJIB, SUKARELA)
├── jenis_transaksi (enum: SETOR, TARIK)
├── jumlah (decimal 15,2)
├── saldo_setelah (decimal 15,2)
├── keterangan (text, nullable)
├── dicatat_oleh (uuid, FK → PENGGUNA)
├── tanggal_transaksi (date)
└── created_at (timestamp)

PINJAMAN
├── id (uuid, PK)
├── koperasi_id (uuid, FK)
├── anggota_id (uuid, FK → ANGGOTA)
├── nomor_pinjaman (varchar) -- auto: PIN-2026-001
├── jumlah_pokok (decimal 15,2)
├── bunga_persen (decimal 5,2)
├── jenis_bunga (enum: FLAT, MENURUN)
├── jangka_waktu (integer) -- dalam bulan
├── tanggal_cair (date)
├── tanggal_jatuh_tempo (date)
├── status (enum: AKTIF, LUNAS, MACET)
├── tujuan (varchar, nullable)
└── created_at (timestamp)

ANGSURAN
├── id (uuid, PK)
├── pinjaman_id (uuid, FK → PINJAMAN)
├── ke (integer) -- angsuran ke-berapa
├── tanggal_jatuh_tempo (date)
├── jumlah_pokok (decimal 15,2)
├── jumlah_bunga (decimal 15,2)
├── jumlah_denda (decimal 15,2)
├── jumlah_bayar (decimal 15,2, nullable)
├── tanggal_bayar (date, nullable)
├── status (enum: BELUM, LUNAS, TERLAMBAT)
└── created_at (timestamp)

KAS_UMUM
├── id (uuid, PK)
├── koperasi_id (uuid, FK)
├── jenis (enum: PEMASUKAN, PENGELUARAN)
├── kategori (varchar) -- jasa_pinjaman, operasional, dll
├── jumlah (decimal 15,2)
├── keterangan (text)
├── dicatat_oleh (uuid, FK → PENGGUNA)
├── tanggal_transaksi (date)
└── created_at (timestamp)

NOTIFIKASI_LOG
├── id (uuid, PK)
├── koperasi_id (uuid, FK)
├── anggota_id (uuid, FK, nullable)
├── tipe (enum: WA, SMS, EMAIL)
├── pesan (text)
├── status (enum: PENDING, TERKIRIM, GAGAL)
└── created_at (timestamp)
```

### 9.2 Prisma Schema (Utama)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Koperasi {
  id             String    @id @default(uuid())
  nama           String
  noBadanHukum   String?   @unique @map("no_badan_hukum")
  desa           String
  kecamatan      String
  kabupaten      String
  provinsi       String
  settings       Json      @default("{}")
  createdAt      DateTime  @default(now()) @map("created_at")

  pengguna       Pengguna[]
  anggota        Anggota[]
  simpanan       Simpanan[]
  pinjaman       Pinjaman[]
  kasUmum        KasUmum[]

  @@map("koperasi")
}

model Pengguna {
  id          String   @id @default(uuid())
  koperasiId  String   @map("koperasi_id")
  nama        String
  noHp        String   @unique @map("no_hp")
  role        Role     @default(ANGGOTA)
  status      StatusPengguna @default(AKTIF)
  createdAt   DateTime @default(now()) @map("created_at")

  koperasi    Koperasi @relation(fields: [koperasiId], references: [id])

  @@map("pengguna")
}

model Anggota {
  id            String   @id @default(uuid())
  koperasiId    String   @map("koperasi_id")
  nomorAnggota  String   @map("nomor_anggota")
  nik           String?
  nama          String
  noHp          String   @map("no_hp")
  tanggalMasuk  DateTime @map("tanggal_masuk")
  status        StatusAnggota @default(AKTIF)
  createdAt     DateTime @default(now()) @map("created_at")

  koperasi      Koperasi   @relation(fields: [koperasiId], references: [id])
  simpanan      Simpanan[]
  pinjaman      Pinjaman[]

  @@unique([koperasiId, nomorAnggota])
  @@map("anggota")
}

enum Role {
  KETUA
  BENDAHARA
  PENGURUS
  ANGGOTA
  DINAS
}

enum StatusPengguna {
  AKTIF
  NONAKTIF
}

enum StatusAnggota {
  CALON
  AKTIF
  NONAKTIF
  KELUAR
}

enum JenisSimpanan {
  POKOK
  WAJIB
  SUKARELA
}

enum JenisTransaksiSimpanan {
  SETOR
  TARIK
}

enum JenisBunga {
  FLAT
  MENURUN
}

enum StatusPinjaman {
  AKTIF
  LUNAS
  MACET
}

enum StatusAngsuran {
  BELUM
  LUNAS
  TERLAMBAT
}
```

---

## 10. User Flow & Journey

### 10.1 Flow: Onboarding Koperasi Baru

```
[Buka kopdes.id]
      │
      ▼
[Halaman Landing]
      │
      ├─── [Daftar Koperasi Baru] ──────────────────────────┐
      │                                                       │
      │    Step 1: Data Koperasi                             │
      │    • Nama Koperasi                                    │
      │    • Desa / Kelurahan / Kecamatan / Kabupaten        │
      │    • No. Badan Hukum (opsional untuk hackathon)      │
      │              │                                        │
      │              ▼                                        │
      │    Step 2: Data Ketua                                │
      │    • Nama Ketua                                       │
      │    • No. HP (untuk OTP)                              │
      │              │                                        │
      │              ▼                                        │
      │    Step 3: Verifikasi OTP via WhatsApp               │
      │              │                                        │
      │              ▼                                        │
      │    [Koperasi Berhasil Terdaftar!]                    │
      │    → Wizard: "Mulai tambah anggota pertama Anda"     │
      │                                                       │
      └─── [Masuk] ──────────────────────────────────────────┘
           • Input No. HP → OTP → Dashboard
```

### 10.2 Flow: Catat Simpanan (Core Flow)

```
[Dashboard Pengurus]
      │
      ▼
[Tap "Catat Transaksi"]
      │
      ▼
[Pilih Anggota]
 • Cari by nama / nomor anggota
      │
      ▼
[Pilih Jenis: Simpanan]
      │
      ├── [Manual] ─────────────────────────┐
      │   • Jenis (Pokok/Wajib/Sukarela)    │
      │   • Jumlah                           │
      │   • Tanggal                          │
      │   • Keterangan (opsional)            │
      │                                      │
      └── [Scan Nota] ──────────────────────┤
          • Ambil foto nota                  │
          • AI ekstrak jumlah & tanggal      │
          • User verifikasi data             │
                                             │
                                             ▼
                                    [Simpan Transaksi]
                                             │
                                             ▼
                                    [Kuitansi Digital]
                                    • Tampil di layar
                                    • Bisa share via WA
                                    • Saldo anggota ter-update
```

### 10.3 Flow: Cetak Laporan

```
[Dashboard] → [Menu Laporan]
      │
      ├── Pilih Jenis Laporan
      │   • Buku Kas
      │   • Neraca
      │   • Laporan Simpanan
      │   • Laporan Pinjaman
      │   • SHU
      │
      ├── Pilih Periode
      │   • Bulan/Tahun atau Range Custom
      │
      ▼
[Preview Laporan]
      │
      ├── [Download PDF]
      ├── [Download Excel]
      └── [Share via WhatsApp]
```

---

## 11. MVP Scope (48 Jam Hackathon)

### 11.1 Pembagian Waktu Sprint

```
JAM 0–6    : Setup & Boilerplate
             • Init repo, setup Next.js + Prisma + Supabase
             • Deploy awal ke Vercel
             • Setup database schema

JAM 6–18   : Core Features (Hari 1)
             • Autentikasi (OTP simulasi)
             • Registrasi Koperasi + Onboarding
             • Manajemen Anggota (CRUD)
             • Catat Simpanan & Pinjaman
             • Dashboard ringkasan

JAM 18–24  : Istirahat + Review

JAM 24–36  : Advanced Features (Hari 2 Pagi)
             • Laporan PDF (Buku Kas + Neraca sederhana)
             • Portal Anggota (cek saldo)
             • AI Chatbot (basic)
             • Polish UI/UX

JAM 36–44  : Finishing & Demo Prep
             • Bug fixing
             • Seed data demo (3 koperasi contoh)
             • Persiapan deck pitching

JAM 44–48  : Buffer & Pitching
```

### 11.2 Must-Have vs Nice-to-Have

| Fitur | Priority | Target Jam Selesai |
|-------|----------|--------------------|
| Registrasi Koperasi | **MUST** | Jam 10 |
| Login OTP (simulasi) | **MUST** | Jam 10 |
| Tambah/Lihat Anggota | **MUST** | Jam 14 |
| Catat Simpanan | **MUST** | Jam 16 |
| Catat Pinjaman | **MUST** | Jam 18 |
| Dashboard Ringkasan | **MUST** | Jam 20 |
| Laporan PDF Buku Kas | **MUST** | Jam 28 |
| Portal Anggota (cek saldo) | **SHOULD** | Jam 30 |
| AI Chatbot Koperasi | **SHOULD** | Jam 34 |
| Scan Nota (OCR) | **COULD** | Jam 38 |
| Notif WhatsApp | **COULD** | Jam 40 |
| Laporan Neraca Lengkap | **WONT** | Post-hackathon |
| Hitung SHU Otomatis | **WONT** | Post-hackathon |

### 11.3 Demo Script (3 Menit untuk Juri)

```
MENIT 0:00 — 0:30: Hook
"80.000 koperasi desa baru lahir. Pengurus pertama kali memegang
buku kas. Mereka butuh sistem yang bisa langsung dipakai hari ini.
Ini kopdes.id."

MENIT 0:30 — 1:00: Onboarding
[Demo live] Daftar koperasi baru → input data → OTP → masuk dashboard
"Onboarding selesai dalam kurang dari 2 menit."

MENIT 1:00 — 1:45: Core Flow
[Demo live] Tambah anggota → catat simpanan → lihat saldo anggota
"Pencatatan transaksi: 30 detik per transaksi."

MENIT 1:45 — 2:15: Laporan
[Demo live] Klik Laporan → pilih bulan → PDF otomatis muncul
"Laporan siap cetak untuk Dinas Koperasi — tanpa Excel, tanpa manual."

MENIT 2:15 — 2:45: AI Feature
[Demo live] Chat: "Bagaimana cara hitung bunga flat?" → jawaban muncul
"Asisten AI yang paham koperasi, tersedia 24 jam."

MENIT 2:45 — 3:00: Closing
"kopdes.id — dari nota kertas ke laporan resmi, dalam 3 menit.
Siap untuk 80.000 koperasi desa Indonesia."
```

---

## 12. Metrik Keberhasilan

### 12.1 Metrik Teknis (Demo Day)

| Metrik | Target |
|--------|--------|
| Semua fitur MUST berfungsi | 100% |
| Loading halaman pertama (demo) | < 2 detik |
| Tidak ada error saat demo | 0 critical bug |
| PDF berhasil di-generate | ✓ |

### 12.2 Metrik Bisnis (Pasca Hackathon, 3 Bulan)

| Metrik | Target |
|--------|--------|
| Koperasi yang onboarding | 500 koperasi |
| Anggota terdaftar di sistem | 50.000 anggota |
| Transaksi dicatat per bulan | 10.000 transaksi |
| Laporan yang di-generate | 1.000 laporan/bulan |
| Retensi koperasi (bulan ke-3) | > 60% |

### 12.3 Metrik Dampak Sosial

| Metrik | Target |
|--------|--------|
| Waktu rekap laporan yang dihemat | 8 jam → < 30 menit/bulan |
| Koperasi yang bisa audit tanpa masalah | 90%+ |
| Anggota yang bisa cek saldo mandiri | 80%+ |

---

## 13. Risiko & Mitigasi

| # | Risiko | Probabilitas | Dampak | Mitigasi |
|---|--------|-------------|--------|---------|
| R1 | Koneksi internet tidak stabil saat demo | Sedang | Tinggi | Siapkan versi offline (localhost), IndexedDB fallback |
| R2 | OCR tidak akurat untuk tulisan tangan | Tinggi | Sedang | Fitur OCR sebagai opsional, input manual tetap utama |
| R3 | Database crash saat demo | Rendah | Sangat Tinggi | Seed demo data di Supabase + backup lokal SQLite |
| R4 | Tim tidak selesai semua fitur MUST | Sedang | Tinggi | Prioritasi ketat, cut fitur COULD/WONT tanpa ragu |
| R5 | Pengurus desa tidak paham cara pakai | Sedang | Tinggi | UX test dengan 2-3 orang non-teknis sebelum pitching |
| R6 | WhatsApp API rate limit | Sedang | Rendah | Gunakan Fonnte sebagai alternatif, fallback SMS |

---

## 14. Roadmap Pasca Hackathon

### V1.0 — Bulan 1–2 (Post-Hackathon)

- [ ] Integrasi WhatsApp Notification Production (Meta WA Business)
- [ ] Laporan format standar Kemenkop RI (sesuai SK terbaru)
- [ ] Hitung SHU otomatis dengan simulasi pembagian
- [ ] Import anggota massal via Excel
- [ ] OCR nota production-ready

### V1.1 — Bulan 3–4

- [ ] Dashboard Dinas Koperasi (monitoring wilayah)
- [ ] Indikator Kesehatan Koperasi (7 aspek standar Kemenkop)
- [ ] Modul RAT digital (agenda, notulen, voting SHU)
- [ ] Multi-bahasa daerah (Jawa, Sunda, Bali)
- [ ] Mobile app (React Native / Expo)

### V2.0 — Bulan 5–6

- [ ] Integrasi QRIS untuk pembayaran simpanan digital
- [ ] API untuk integrasi dengan Simkopdes Kemenkop
- [ ] Modul kredit scoring sederhana berbasis data simpanan
- [ ] Unit usaha koperasi (toko, sembako, dll)
- [ ] Laporan konsolidasi per kabupaten/provinsi

---

## 15. Kajian Referensi & Landasan Data

### 15.1 Regulasi & Kebijakan

| Dokumen | Relevansi |
|---------|-----------|
| **Inpres No. 9 Tahun 2025** tentang Percepatan Pembentukan Koperasi Desa/Kelurahan Merah Putih | Mandat utama yang menjadi latar belakang produk |
| **SE Menkeu No. S-9/MK/PK/2025** | Kopdes Merah Putih jadi syarat pencairan Dana Desa Tahap II |
| **Permenkop No. 9 Tahun 2023** | Standar kelembagaan dan tata kelola koperasi baru |
| **Permenkop No. 4 Tahun 2024** | Standar digitalisasi koperasi |
| **UU No. 25 Tahun 1992** tentang Perkoperasian | Dasar hukum operasional koperasi Indonesia |
| **SAK ETAP** (Standar Akuntansi Keuangan Entitas Tanpa Akuntabilitas Publik) | Standar pembukuan yang harus digunakan koperasi |

### 15.2 Data & Statistik

| Data | Sumber | Nilai |
|------|--------|-------|
| Jumlah koperasi desa target | Inpres No. 9/2025 | 80.000 unit |
| Penetrasi digital UMKM Indonesia | Google-Temasek-Bain (2022) | 24% sudah digital |
| Pengurus koperasi berlatar non-teknologi | Survei ADEKMI & IKOPIN (April–Mei 2024) | >80% |
| Koperasi desa belum punya strategi digital | Kusumawardhani et al. (2025) | >50% |
| Target koperasi modern Kemenkop | Kemenkop UKM | 500 unit/tahun (2024) |
| Rasio volume usaha koperasi vs PDB | Data 10 tahun terakhir | Rata-rata 1,14% |
| Pasar digital Indonesia | Kemenko Perekonomian | $44 miliar (2022), $125 miliar (proyeksi 2025) |

### 15.3 Referensi Produk Kompetitor

| Produk | Kekuatan | Kelemahan | Diferensiasi kopdes.id |
|--------|----------|-----------|------------------------|
| **Smartcoop** | Sudah dipakai ribuan koperasi sejak 2017 | Terlalu kompleks untuk koperasi desa baru | Onboarding < 10 menit, khusus koperasi desa |
| **SIKOP (Kemenkop)** | Terintegrasi sistem pemerintah | UI/UX kuno, lambat, tidak mobile-friendly | Mobile-first, PWA, offline |
| **Koperasi.id** | Fitur lengkap | Harga mahal, target koperasi besar | Gratis untuk koperasi desa, simple |
| **Excel/Manual** | Familiar | Rentan error, tidak bisa diaudit | Migrasi mudah, import dari Excel |

### 15.4 Referensi Teknis

- Next.js 14 Documentation — [nextjs.org/docs](https://nextjs.org/docs)
- Prisma ORM Documentation — [prisma.io/docs](https://prisma.io/docs)
- Supabase Documentation — [supabase.com/docs](https://supabase.com/docs)
- PWA with Next.js — [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps/)
- shadcn/ui Components — [ui.shadcn.com](https://ui.shadcn.com)
- Anthropic Claude API — [docs.anthropic.com](https://docs.anthropic.com)
- Google Cloud Vision API — [cloud.google.com/vision](https://cloud.google.com/vision)
- Fonnte WhatsApp API — [fonnte.com](https://fonnte.com)

### 15.5 Referensi Akademis & Artikel

1. Kusumawardhani et al. (2025). *Digitalisasi Koperasi Desa di Era Koperasi Merah Putih.* Jurnal Economina, Vol.1.
2. ADEKMI & IKOPIN. (2024). *Survei SDM Koperasi Indonesia.* Jakarta.
3. Azmi, R. (2025). *Digitalisasi Koperasi: Urgensi, Tantangan, dan Strategi.* rizaazmi.id.
4. BRIN. (2024). *Laporan Keberhasilan Digitalisasi Koperasi.* Badan Riset dan Inovasi Nasional.
5. Google, Temasek & Bain & Company. (2022). *e-Conomy SEA 2022 Report.*
6. Kemenko Perekonomian RI. (2022). *Digitalisasi Koperasi Dorong Pengembangan dan Modernisasi Koperasi.*

---

## Lampiran: Struktur Folder Proyek

```
kopdes-id/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Route grup autentikasi
│   │   │   ├── login/
│   │   │   └── daftar/
│   │   ├── (dashboard)/        # Route grup dashboard pengurus
│   │   │   ├── dashboard/
│   │   │   ├── anggota/
│   │   │   ├── transaksi/
│   │   │   ├── pinjaman/
│   │   │   ├── laporan/
│   │   │   └── pengaturan/
│   │   ├── anggota/[token]/    # Portal anggota (public)
│   │   └── api/                # API Routes
│   │       ├── auth/
│   │       ├── koperasi/
│   │       ├── anggota/
│   │       ├── transaksi/
│   │       ├── laporan/
│   │       └── ai/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── forms/              # Form components
│   │   ├── charts/             # Recharts wrappers
│   │   └── pdf/                # React PDF templates
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── supabase.ts         # Supabase client
│   │   ├── auth.ts             # NextAuth config
│   │   ├── ai.ts               # Claude API wrapper
│   │   ├── ocr.ts              # Google Vision + Tesseract
│   │   ├── whatsapp.ts         # Fonnte/WA integration
│   │   └── utils.ts            # Helper functions
│   ├── types/                  # TypeScript type definitions
│   └── hooks/                  # Custom React hooks
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service Worker
├── .env.local                  # Environment variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Lampiran: Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://kopdes.id"

# AI
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_CLOUD_VISION_KEY="AIza..."

# WhatsApp
FONNTE_TOKEN="your-fonnte-token"

# Cache
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Storage
CLOUDFLARE_R2_BUCKET="kopdes-reports"
CLOUDFLARE_R2_ACCESS_KEY="..."
CLOUDFLARE_R2_SECRET_KEY="..."
```

---

*Dokumen ini disiapkan untuk Hackathon Digital Cooperatives Expo 2026*
*Kementerian Koperasi RI × PEBS FEB Universitas Indonesia*
*© 2026 Tim kopdes.id — Hak Cipta Dilindungi*
