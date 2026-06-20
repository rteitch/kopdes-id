"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Loader2,
  Search,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface PortalData {
  nama: string;
  nomorAnggota: string;
  status: string;
  tanggalMasuk: string;
  simpanan: {
    pokok: number;
    wajib: number;
    sukarela: number;
    total: number;
  };
  riwayat: Array<{
    tanggal: string;
    jenis: string;
    tipe: string;
    jumlah: number;
  }>;
  pinjaman: Array<{
    nomorPinjaman: string;
    jumlahPokok: number;
    status: string;
    angsuran: Array<{
      ke: number;
      tanggalJatuhTempo: string;
      jumlah: number;
      status: string;
    }>;
  }>;
}

export default function PortalAnggotaPage() {
  const [koperasiId, setKoperasiId] = useState("");
  const [noHp, setNoHp] = useState("");
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setData(null);

    try {
      const res = await fetch(
        `/api/anggota/portal?koperasiId=${koperasiId}&noHp=${noHp}`
      );
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Data tidak ditemukan");
        return;
      }

      setData(result.data);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="page-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">KD</span>
            </div>
            <span className="text-lg font-bold text-green-800">kopdes.id</span>
          </Link>
          <Badge variant="info">Portal Anggota</Badge>
        </div>
      </header>

      <main className="page-container py-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Portal Anggota Koperasi
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Cek saldo simpanan dan riwayat transaksi Anda
          </p>
        </div>

        {/* Search Form */}
        {!data && (
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="koperasiId">ID Koperasi</Label>
                  <Input
                    id="koperasiId"
                    placeholder="Masukkan ID Koperasi"
                    value={koperasiId}
                    onChange={(e) => setKoperasiId(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Dapatkan ID Koperasi dari pengurus Anda
                  </p>
                </div>

                <div className="form-group">
                  <Label htmlFor="noHp">Nomor HP</Label>
                  <Input
                    id="noHp"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    required
                    minLength={10}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Cek Saldo Saya
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* Profile */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold text-lg">
                      {data.nama
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {data.nama}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {data.nomorAnggota}
                      </span>
                      <Badge variant={data.status === "AKTIF" ? "success" : "secondary"}>
                        {data.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simpanan Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wallet className="h-5 w-5 text-green-600" />
                  Total Simpanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-4xl font-extrabold text-green-700">
                    {formatRupiah(data.simpanan.total)}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Pokok</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatRupiah(data.simpanan.pokok)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Wajib</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatRupiah(data.simpanan.wajib)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Sukarela</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatRupiah(data.simpanan.sukarela)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pinjaman Aktif */}
            {data.pinjaman.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                    Pinjaman Aktif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.pinjaman.map((p) => (
                    <div key={p.nomorPinjaman} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {p.nomorPinjaman}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatRupiah(p.jumlahPokok)}
                          </p>
                        </div>
                        <Badge variant="warning">{p.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500">
                          Jadwal Angsuran:
                        </p>
                        {p.angsuran.slice(0, 6).map((a) => (
                          <div
                            key={a.ke}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {a.status === "LUNAS" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                              <span>
                                Angsuran ke-{a.ke} •{" "}
                                {formatDate(a.tanggalJatuhTempo)}
                              </span>
                            </div>
                            <span className="font-medium">
                              {formatRupiah(a.jumlah)}
                            </span>
                          </div>
                        ))}
                        {p.angsuran.length > 6 && (
                          <p className="text-xs text-gray-400 text-center">
                            +{p.angsuran.length - 6} angsuran lainnya
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Riwayat Transaksi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Riwayat Transaksi Terakhir
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.riwayat.length === 0 ? (
                  <p className="text-center text-gray-400 py-6">
                    Belum ada transaksi
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data.riwayat.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              r.tipe === "SETOR"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {r.tipe === "SETOR" ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {r.jenis === "POKOK"
                                ? "Sim. Pokok"
                                : r.jenis === "WAJIB"
                                ? "Sim. Wajib"
                                : "Sim. Sukarela"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(r.tanggal)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            r.tipe === "SETOR"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {r.tipe === "SETOR" ? "+" : "-"}
                          {formatRupiah(r.jumlah)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Back Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setData(null);
                  setKoperasiId("");
                  setNoHp("");
                }}
              >
                Kembali
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}