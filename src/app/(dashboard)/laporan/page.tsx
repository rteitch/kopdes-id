"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { formatRupiah, formatDateShort } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  Loader2,
  Wallet,
  BookOpen,
  Users,
  FileSpreadsheet,
} from "lucide-react";
import { exportToCSV, formatBukuKasExport, formatSimpananExport, formatPinjamanExport } from "@/lib/export-excel";

const bulanOptions = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

export default function LaporanPage() {
  const { user } = useAuthStore();
  const [jenis, setJenis] = useState("buku-kas");
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchLaporan = async () => {
    if (!user?.koperasiId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/laporan?koperasiId=${user.koperasiId}&jenis=${jenis}&bulan=${bulan}&tahun=${tahun}`
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
    fetchLaporan();
  }, [jenis, bulan, tahun, user?.koperasiId]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (!data) return;
    if (jenis === "buku-kas" && data.transaksi) {
      exportToCSV(formatBukuKasExport(data.transaksi), `buku-kas-${data.periode}`);
    } else if (jenis === "simpanan" && data.anggota) {
      exportToCSV(formatSimpananExport(data.anggota), `laporan-simpanan-${data.periode}`);
    } else if (jenis === "pinjaman" && data.pinjaman) {
      exportToCSV(formatPinjamanExport(data.pinjaman), `laporan-pinjaman-${data.periode}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-gray-500 text-sm mt-1">Generate laporan keuangan koperasi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel} disabled={!data || jenis === "neraca"}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Cetak / PDF
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="form-group">
              <Label>Jenis Laporan</Label>
              <select
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
              >
                <option value="buku-kas">Buku Kas Harian</option>
                <option value="simpanan">Laporan Simpanan</option>
                <option value="pinjaman">Laporan Pinjaman</option>
                <option value="neraca">Neraca Keuangan</option>
              </select>
            </div>
            <div className="form-group">
              <Label>Bulan</Label>
              <select
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
                value={bulan}
                onChange={(e) => setBulan(parseInt(e.target.value))}
              >
                {bulanOptions.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <Label>Tahun</Label>
              <Input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(parseInt(e.target.value))}
                min={2020}
                max={2030}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchLaporan} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Muat Laporan"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="stat-card animate-pulse h-64" />
      ) : data ? (
        <>
          {/* Buku Kas */}
          {jenis === "buku-kas" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                  Buku Kas Harian — {data.periode}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">Tanggal</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">Keterangan</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Masuk</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Keluar</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transaksi.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400">Tidak ada transaksi</td>
                        </tr>
                      ) : (
                        data.transaksi.map((t: any, i: number) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2.5 px-2 text-gray-600">{formatDateShort(t.tanggal)}</td>
                            <td className="py-2.5 px-2 text-gray-900">{t.keterangan}</td>
                            <td className="py-2.5 px-2 text-right text-green-600 font-medium">
                              {t.masuk > 0 ? formatRupiah(t.masuk) : "-"}
                            </td>
                            <td className="py-2.5 px-2 text-right text-red-600 font-medium">
                              {t.keluar > 0 ? formatRupiah(t.keluar) : "-"}
                            </td>
                            <td className="py-2.5 px-2 text-right font-semibold">{formatRupiah(t.saldo)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 font-bold">
                        <td colSpan={2} className="py-3 px-2">Total</td>
                        <td className="py-3 px-2 text-right text-green-700">{formatRupiah(data.totalMasuk)}</td>
                        <td className="py-3 px-2 text-right text-red-700">{formatRupiah(data.totalKeluar)}</td>
                        <td className="py-3 px-2 text-right">{formatRupiah(data.saldoAkhir)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Laporan Simpanan */}
          {jenis === "simpanan" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Laporan Simpanan Anggota — {data.periode}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">No.</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">Nama</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Pokok</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Wajib</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Sukarela</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.anggota.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-400">Tidak ada data</td>
                        </tr>
                      ) : (
                        data.anggota.map((a: any, i: number) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2.5 px-2 text-gray-600">{a.nomorAnggota}</td>
                            <td className="py-2.5 px-2 text-gray-900">{a.nama}</td>
                            <td className="py-2.5 px-2 text-right">{formatRupiah(a.pokok)}</td>
                            <td className="py-2.5 px-2 text-right">{formatRupiah(a.wajib)}</td>
                            <td className="py-2.5 px-2 text-right">{formatRupiah(a.sukarela)}</td>
                            <td className="py-2.5 px-2 text-right font-semibold">{formatRupiah(a.total)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 font-bold">
                        <td colSpan={5} className="py-3 px-2">Total Keseluruhan</td>
                        <td className="py-3 px-2 text-right">{formatRupiah(data.totalKeseluruhan)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Neraca Keuangan */}
          {jenis === "neraca" && data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Neraca Keuangan Koperasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3">ASET</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kas dan Bank</span>
                        <span className="font-medium">{formatRupiah(data.aset?.kasDanBank || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Piutang Pinjaman</span>
                        <span className="font-medium">{formatRupiah(data.aset?.piutangPinjaman || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t pt-2">
                        <span>Total Aset</span>
                        <span className="text-green-700">{formatRupiah(data.aset?.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-3">KEWAJIBAN & MODAL</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Simpanan Anggota</span>
                        <span className="font-medium">{formatRupiah(data.kewajiban?.simpananAnggota || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Modal Disetor</span>
                        <span className="font-medium">{formatRupiah(data.modal?.modalDisetor || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t pt-2">
                        <span>Total Kewajiban + Modal</span>
                        <span className="text-blue-700">{formatRupiah(data.totalKewajibanDanModal || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {data.balanced !== undefined && (
                  <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${data.balanced ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {data.balanced ? "✓ Neraca Seimbang" : "⚠ Periksa kembali pencatatan transaksi"}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Laporan Pinjaman */}
          {jenis === "pinjaman" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Laporan Pinjaman & Kolektibilitas — {data.periode}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">No. Pinjaman</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-600">Nama</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Pokok</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-600">Angsuran</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-600">Sisa Tagihan</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-600">Kolektibilitas</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.pinjaman.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-400">Tidak ada data</td>
                        </tr>
                      ) : (
                        data.pinjaman.map((p: any, i: number) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2.5 px-2 text-gray-600">{p.nomorPinjaman}</td>
                            <td className="py-2.5 px-2 text-gray-900">{p.nama}</td>
                            <td className="py-2.5 px-2 text-right">{formatRupiah(p.jumlahPokok)}</td>
                            <td className="py-2.5 px-2 text-center">{p.angsuranLunas}/{p.totalAngsuran}</td>
                            <td className="py-2.5 px-2 text-right font-semibold">{formatRupiah(p.sisaTagihan)}</td>
                            <td className="py-2.5 px-2 text-center">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                p.kolektibilitas === "Lancar" ? "bg-green-100 text-green-800" :
                                p.kolektibilitas === "Kurang Lancar" ? "bg-yellow-100 text-yellow-800" :
                                p.kolektibilitas === "Diragukan" ? "bg-orange-100 text-orange-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {p.kolektibilitas}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                p.status === "AKTIF" ? "bg-yellow-100 text-yellow-800" :
                                p.status === "LUNAS" ? "bg-green-100 text-green-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 font-bold">
                        <td colSpan={2} className="py-3 px-2">Total Peminjaman</td>
                        <td className="py-3 px-2 text-right">{formatRupiah(data.totalPeminjaman)}</td>
                      <td />
                      <td colSpan={2} className="text-right text-sm">
                        NPL: <span className={`font-bold ${data.npl > 5 ? "text-red-600" : data.npl > 2 ? "text-yellow-600" : "text-green-600"}`}>{data.npl || 0}%</span>
                      </td>
                      <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}