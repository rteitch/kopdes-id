// =============================================
// kopdes.id — TypeScript Type Definitions
// =============================================

// Enums (matches Prisma schema)
export type Role = "KETUA" | "BENDAHARA" | "PENGURUS" | "ANGGOTA" | "DINAS";
export type StatusPengguna = "AKTIF" | "NONAKTIF";
export type StatusAnggota = "CALON" | "AKTIF" | "NONAKTIF" | "KELUAR";
export type JenisSimpanan = "POKOK" | "WAJIB" | "SUKARELA";
export type JenisTransaksiSimpanan = "SETOR" | "TARIK";
export type JenisBunga = "FLAT" | "MENURUN";
export type StatusPinjaman = "AKTIF" | "LUNAS" | "MACET";
export type StatusAngsuran = "BELUM" | "LUNAS" | "TERLAMBAT";
export type JenisKas = "PEMASUKAN" | "PENGELUARAN";

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Auth types
export interface UserProfile {
  id: string;
  nama: string;
  noHp: string;
  role: Role;
  koperasiId: string;
  koperasiNama: string;
}

// Anggota types
export interface AnggotaListItem {
  id: string;
  nomorAnggota: string;
  nama: string;
  noHp: string;
  status: StatusAnggota;
  tanggalMasuk: string;
  totalSimpanan: number;
  totalPinjaman: number;
  jumlahPinjamanAktif: number;
}

// Simpanan types
export interface SimpananListItem {
  id: string;
  jenis: JenisSimpanan;
  jenisTransaksi: JenisTransaksiSimpanan;
  jumlah: number;
  saldoSetelah: number | null;
  keterangan: string | null;
  tanggalTransaksi: string;
  anggota: { nama: string; nomorAnggota: string };
}

// Pinjaman types
export interface PinjamanListItem {
  id: string;
  nomorPinjaman: string;
  jumlahPokok: number;
  bungaPersen: number;
  jenisBunga: JenisBunga;
  jangkaWaktu: number;
  tanggalCair: string;
  status: StatusPinjaman;
  tujuan: string | null;
  anggota: { nama: string; nomorAnggota: string };
  angsuran: AngsuranItem[];
}

export interface AngsuranItem {
  id: string;
  ke: number;
  tanggalJatuhTempo: string;
  jumlahPokok: number;
  jumlahBunga: number;
  jumlahDenda: number;
  jumlahBayar: number | null;
  status: StatusAngsuran;
}

// Dashboard types
export interface DashboardData {
  totalAnggota: number;
  anggotaAktif: number;
  totalSimpanan: number;
  totalPinjamanBeredar: number;
  totalAset: number;
  transaksiHariIni: number;
  pinjamanJatuhTempo: Array<{
    id: string;
    ke: number;
    tanggalJatuhTempo: string;
    jumlah: number;
    anggotaNama: string;
  }>;
}

// Laporan types
export interface BukuKasData {
  periode: string;
  transaksi: Array<{
    tanggal: string;
    keterangan: string;
    masuk: number;
    keluar: number;
    saldo: number;
  }>;
  totalMasuk: number;
  totalKeluar: number;
  saldoAkhir: number;
}

export interface NeracaData {
  aset: { kasDanBank: number; piutangPinjaman: number; total: number };
  kewajiban: { simpananAnggota: number; total: number };
  modal: { modalDisetor: number; total: number };
  totalKewajibanDanModal: number;
  balanced: boolean;
}

export interface SHULaporan {
  totalPendapatan: number;
  totalBiaya: number;
  labaKotor: number;
  cadanganWajib: number;
  danaPendidikan: number;
  danaSosial: number;
  shuBersih: number;
}

// Kuitansi types
export interface KuitansiData {
  nomorTransaksi: string;
  tanggal: string;
  namaKoperasi: string;
  namaAnggota: string;
  nomorAnggota: string;
  jenis: string;
  jumlah: number;
  keterangan?: string;
  dicatatOleh: string;
}