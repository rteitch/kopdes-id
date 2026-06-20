import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Wallet,
  FileText,
  Shield,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="page-container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">KD</span>
            </div>
            <span className="text-xl font-bold text-green-800">kopdes.id</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="page-container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800 mb-6">
              <Shield className="h-4 w-4" />
              Mendukung Inpres No. 9/2025
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Dari nota kertas ke{" "}
              <span className="text-green-700">laporan resmi</span>, dalam 3
              menit.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Platform manajemen koperasi desa yang dirancang khusus untuk 80.000
              Kopdes Merah Putih. Mudah dipakai pengurus non-IT sejak hari
              pertama.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-green-700 text-white text-base font-semibold hover:bg-green-800 transition-all shadow-lg shadow-green-200 hover:shadow-xl"
              >
                Mulai Sekarang — Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg border-2 border-gray-200 text-gray-700 text-base font-semibold hover:border-green-300 hover:text-green-700 transition-colors"
              >
                Sudah Punya Akun? Masuk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <div className="page-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-green-700">80.000</div>
              <div className="text-sm text-gray-500 mt-1">Koperasi Desa Target</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-green-700">16 Juta</div>
              <div className="text-sm text-gray-500 mt-1">Anggota Potensial</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-green-700">{"< 3 Menit"}</div>
              <div className="text-sm text-gray-500 mt-1">Buat Laporan</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-green-700">100%</div>
              <div className="text-sm text-gray-500 mt-1">Bahasa Indonesia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Fitur Lengkap untuk Koperasi Desa
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola koperasi desa secara
              digital — tanpa perlu latar belakang akuntansi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Cara Kerja — Sangat Mudah
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              3 langkah sederhana untuk mulai mengelola koperasi desa Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-extrabold text-green-700">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-green-700">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Mengapa Pilih kopdes.id?
            </h2>
            <div className="mt-12 grid sm:grid-cols-2 gap-6 text-left">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-200 flex-shrink-0 mt-0.5" />
                  <span className="text-green-50 text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Siap Digitalisasi Koperasi Desa Anda?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Bergabung bersama ribuan koperasi desa yang sudah menggunakan
            kopdes.id untuk mengelola keuangan mereka.
          </p>
          <div className="mt-8">
            <Link
              href="/daftar"
              className="inline-flex items-center justify-center h-14 px-10 rounded-lg bg-green-700 text-white text-lg font-semibold hover:bg-green-800 transition-all shadow-lg shadow-green-200"
            >
              Daftar Sekarang — 100% Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-900">
        <div className="page-container py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">KD</span>
              </div>
              <span className="text-lg font-bold text-white">kopdes.id</span>
            </div>
            <div className="text-sm text-gray-400 text-center">
              <p>© 2026 kopdes.id — Rizal Taufiq Hidayat</p>
              <p className="mt-1">Hackathon Digital Cooperatives Expo 2026</p>
            </div>
            <div className="text-sm text-gray-400">
              Kementerian Koperasi RI × PEBS FEB UI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Users,
    title: "Manajemen Anggota",
    description:
      "Daftar, kelola, dan pantau data seluruh anggota koperasi dalam satu tempat. Kartu anggota digital tersedia.",
  },
  {
    icon: Wallet,
    title: "Catat Simpanan",
    description:
      "Catat simpanan pokok, wajib, dan sukarela dengan cepat. Saldo anggota ter-update secara real-time.",
  },
  {
    icon: BookOpen,
    title: "Kelola Pinjaman",
    description:
      "Ajukan, cairkan, dan pantau pinjaman beserta jadwal cicilan. Perhitungan bunga otomatis.",
  },
  {
    icon: FileText,
    title: "Laporan PDF",
    description:
      "Buku kas, neraca, dan laporan simpanan dalam format PDF siap cetak untuk Dinas Koperasi.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First & Offline",
    description:
      "Akses dari HP Android kapan saja. Input transaksi tetap bisa dilakukan walau tidak ada internet.",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    description:
      "Data terenkripsi, backup otomatis, dan akses berbasis peran. Sesuai standar Kemenkop RI.",
  },
];

const steps = [
  {
    title: "Daftar Koperasi",
    description:
      "Isi nama koperasi, desa, dan data ketua. Verifikasi via OTP — selesai dalam 2 menit.",
  },
  {
    title: "Tambah Anggota",
    description:
      "Input data anggota satu per satu atau import dari file Excel. Langsung bisa mulai transaksi.",
  },
  {
    title: "Catat & Lihat Laporan",
    description:
      "Catat simpanan, pinjaman, dan kas. Laporan keuangan PDF otomatis tersedia kapan saja.",
  },
];

const benefits = [
  "Onboarding selesai dalam 10 menit tanpa pelatihan khusus",
  "Laporan keuangan sesuai format standar Kemenkop RI",
  "Antarmuka Bahasa Indonesia yang sangat sederhana",
  "Bisa diakses dari HP Android murah sekalipun",
  "Mode offline — tetap bisa input walau tidak ada sinyal",
  "Gratis untuk koperasi desa — tanpa biaya tersembunyi",
  "Asisten AI yang siap membantu 24 jam",
  "Data terenkripsi dan backup otomatis setiap hari",
];