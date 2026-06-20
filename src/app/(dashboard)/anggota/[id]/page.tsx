"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Wallet,
  Phone,
  Calendar,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

interface SimpananData {
  id: string;
  jenis: string;
  jenisTransaksi: string;
  jumlah: number;
  keterangan: string | null;
  tanggalTransaksi: string;
}

interface AnggotaDetail {
  id: string;
  nomorAnggota: string;
  nama: string;
  noHp: string;
  nik: string | null;
  alamat: string | null;
  tanggalMasuk: string;
  status: string;
  totalSimpanan: number;
  simpanan: SimpananData[];
  pinjaman: Array<{
    id: string;
    nomorPinjaman: string;
    jumlahPokok: number;
    status: string;
    tanggalCair: string;
  }>;
}

export default function AnggotaDetailPage() {
  const params = useParams();
  const [data, setData] = useState<AnggotaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/anggota/${params.id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) setData(res.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="stat-card animate-pulse h-32" />
        <div className="stat-card animate-pulse h-48" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Anggota tidak ditemukan
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/anggota"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Anggota
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-700 font-bold text-xl">
                {data.nama
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{data.nama}</h1>
                <Badge
                  variant={data.status === "AKTIF" ? "success" : "secondary"}
                >
                  {data.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  {data.nomorAnggota}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {data.noHp}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Bergabung {formatDate(data.tanggalMasuk)}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-gray-500">Total Simpanan</p>
              <p className="text-2xl font-bold text-green-700">
                {formatRupiah(data.totalSimpanan)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-5 w-5 text-green-600" />
              Riwayat Simpanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.simpanan.length === 0 ? (
              <p className="text-center text-gray-400 py-6">
                Belum ada transaksi simpanan
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.simpanan.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {s.jenis === "POKOK"
                          ? "Simpanan Pokok"
                          : s.jenis === "WAJIB"
                          ? "Simpanan Wajib"
                          : "Simpanan Sukarela"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(s.tanggalTransaksi)}
                        {s.keterangan && ` - ${s.keterangan}`}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        s.jenisTransaksi === "SETOR"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {s.jenisTransaksi === "SETOR" ? "+" : "-"}
                      {formatRupiah(s.jumlah)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-orange-600" />
              Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.pinjaman.length === 0 ? (
              <p className="text-center text-gray-400 py-6">
                Belum ada pinjaman
              </p>
            ) : (
              <div className="space-y-2">
                {data.pinjaman.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {p.nomorPinjaman}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cair {formatDate(p.tanggalCair)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatRupiah(p.jumlahPokok)}
                        </p>
                        <Badge
                          variant={
                            p.status === "AKTIF"
                              ? "warning"
                              : p.status === "LUNAS"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </div>
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