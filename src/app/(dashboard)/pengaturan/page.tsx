"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Info } from "lucide-react";

export default function PengaturanPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-1">Informasi akun dan koperasi Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-green-600" />
            Informasi Koperasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Nama Koperasi</span>
            <span className="text-sm font-medium text-gray-900">{user?.koperasiNama}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">ID Koperasi</span>
            <span className="text-sm font-mono text-gray-600">{user?.koperasiId?.slice(0, 8)}...</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5 text-blue-600" />
            Profil Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Nama</span>
            <span className="text-sm font-medium text-gray-900">{user?.nama}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">No. HP</span>
            <span className="text-sm font-medium text-gray-900">{user?.noHp}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Role</span>
            <Badge variant="default">{user?.role}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-5 w-5 text-gray-500" />
            Tentang Aplikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Versi</span>
            <span className="text-sm font-medium text-gray-900">1.0.0 (MVP)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Platform</span>
            <span className="text-sm font-medium text-gray-900">Web (PWA)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Hackathon</span>
            <span className="text-sm font-medium text-gray-900">Digital Cooperatives Expo 2026</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            kopdes.id dibuat untuk mendukung Program Koperasi Desa/Kelurahan Merah Putih 
            (Inpres No. 9 Tahun 2025). Aplikasi ini membantu pengurus koperasi desa mengelola 
            data anggota, transaksi simpanan, pinjaman, dan laporan keuangan secara digital.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}