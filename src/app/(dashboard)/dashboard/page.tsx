"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface DashboardData {
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

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.koperasiId) {
      fetch(`/api/dashboard?koperasiId=${user.koperasiId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) setData(res.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user?.koperasiId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Gagal memuat data dashboard
      </div>
    );
  }

  const stats = [
    {
      title: "Total Anggota",
      value: data.anggotaAktif,
      subtitle: `dari ${data.totalAnggota} total`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Simpanan",
      value: formatRupiah(data.totalSimpanan),
      subtitle: "Saldo bersih",
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pinjaman Beredar",
      value: formatRupiah(data.totalPinjamanBeredar),
      subtitle: "Pinjaman aktif",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Aset",
      value: formatRupiah(data.totalAset),
      subtitle: "Simpanan + Kas",
      icon: ArrowUpRight,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat Datang, {user?.nama?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Berikut ringkasan koperasi Anda hari ini
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Transaksi Hari Ini */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-gray-400" />
              Aktivitas Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-green-700 mb-2">
                {data.transaksiHariIni}
              </div>
              <p className="text-gray-500">transaksi tercatat hari ini</p>
            </div>
          </CardContent>
        </Card>

        {/* Pinjaman Jatuh Tempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pinjaman Jatuh Tempo Minggu Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.pinjamanJatuhTempo.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Tidak ada pinjaman jatuh tempo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.pinjamanJatuhTempo.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.anggotaNama}
                      </p>
                      <p className="text-xs text-gray-500">
                        Angsuran ke-{item.ke} • {formatDate(item.tanggalJatuhTempo)}
                      </p>
                    </div>
                    <Badge variant="warning">{formatRupiah(item.jumlah)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}