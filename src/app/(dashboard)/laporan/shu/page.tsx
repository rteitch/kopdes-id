"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Download,
  Loader2,
  Calculator,
  Users,
  PiggyBank,
} from "lucide-react";

interface SHUData {
  tahun: number;
  laporan: {
    totalPendapatan: number;
    totalBiaya: number;
    labaKotor: number;
    cadanganWajib: number;
    danaPendidikan: number;
    danaSosial: number;
    shuBersih: number;
  };
  anggota: Array<{
    nama: string;
    nomorAnggota: string;
    totalSimpanan: number;
    totalPinjaman: number;
    rasioPartisipasi: number;
    shu: number;
  }>;
}

export default function SHUPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<SHUData | null>(null);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const fetchSHU = async () => {
    if (!user?.koperasiId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/laporan/shu?koperasiId=${user.koperasiId}&tahun=${tahun}`
      );
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSHU();
  }, [user?.koperasiId, tahun]);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sisa Hasil Usaha (SHU)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Hitung dan simulasi pembagian SHU koperasi
          </p>
        </div>
        <Button variant="outline" onClick={handlePrint}>
          <Download className="h-4 w-4 mr-2" />
          Cetak
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-end gap-4">
            <div className="form-group">
              <Label>Tahun</Label>
              <Input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(parseInt(e.target.value))}
                min={2020}
                max={2030}
                className="w-32"
              />
            </div>
            <Button onClick={fetchSHU} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="h-4 w-4 mr-2" />
              )}
              Hitung SHU
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="stat-card animate-pulse h-64" />
      ) : data ? (
        <>
          {/* Laporan SHU */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Laporan SHU Tahun {data.tahun}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 text-gray-600">Total Pendapatan</td>
                      <td className="py-2.5 text-right font-semibold">
                        {formatRupiah(data.laporan.totalPendapatan)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 text-gray-600">Total Biaya Operasional</td>
                      <td className="py-2.5 text-right text-red-600">
                        -{formatRupiah(data.laporan.totalBiaya)}
                      </td>
                    </tr>
                    <tr className="border-b-2 border-gray-300 font-bold">
                      <td className="py-3">Laba Kotor</td>
                      <td className="py-3 text-right text-green-700">
                        {formatRupiah(data.laporan.labaKotor)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pl-4 text-gray-500 text-xs">
                        Cadangan Wajib (20%)
                      </td>
                      <td className="py-2.5 text-right text-gray-600 text-xs">
                        -{formatRupiah(data.laporan.cadanganWajib)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pl-4 text-gray-500 text-xs">
                        Dana Pendidikan (5%)
                      </td>
                      <td className="py-2.5 text-right text-gray-600 text-xs">
                        -{formatRupiah(data.laporan.danaPendidikan)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 pl-4 text-gray-500 text-xs">
                        Dana Sosial (5%)
                      </td>
                      <td className="py-2.5 text-right text-gray-600 text-xs">
                        -{formatRupiah(data.laporan.danaSosial)}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-green-300 font-extrabold text-lg">
                      <td className="py-4 text-green-800">SHU Bersih</td>
                      <td className="py-4 text-right text-green-700">
                        {formatRupiah(data.laporan.shuBersih)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* SHU Per Anggota */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-blue-600" />
                Simulasi Pembagian SHU Per Anggota
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.anggota.length === 0 ? (
                <p className="text-center text-gray-400 py-6">
                  Belum ada data anggota aktif
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">
                          No.
                        </th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">
                          Nama
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">
                          Simpanan
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">
                          Pinjaman
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">
                          SHU
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.anggota.map((a, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="py-2.5 px-2 text-gray-600">
                            {a.nomorAnggota}
                          </td>
                          <td className="py-2.5 px-2 text-gray-900 font-medium">
                            {a.nama}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            {formatRupiah(a.totalSimpanan)}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            {formatRupiah(a.totalPinjaman)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-green-700">
                            {formatRupiah(a.shu)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 font-bold">
                        <td colSpan={4} className="py-3 px-2">
                          Total SHU Dibagikan
                        </td>
                        <td className="py-3 px-2 text-right text-green-700">
                          {formatRupiah(
                            data.anggota.reduce((a, b) => a + b.shu, 0)
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-4">
                * Simulasi ini bersifat indikatif. Pembagian SHU resmi
                disetujui dalam RAT (Rapat Anggota Tahunan).
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}