"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Wallet,
} from "lucide-react";

interface KasUmumData {
  id: string;
  jenis: string;
  kategori: string;
  jumlah: number;
  keterangan: string | null;
  tanggalTransaksi: string;
  pencatat: { nama: string };
}

const kategoriPemasukan = [
  { value: "jasa_pinjaman", label: "Jasa Pinjaman" },
  { value: "pendapatan_usaha", label: "Pendapatan Usaha Unit" },
  { value: "subsidi_hibah", label: "Subsidi/Hibah" },
  { value: "lainnya", label: "Lainnya" },
];

const kategoriPengeluaran = [
  { value: "gaji_pengurus", label: "Gaji Pengurus" },
  { value: "operasional", label: "Biaya Operasional" },
  { value: "inventaris", label: "Pembelian Inventaris" },
  { value: "lainnya", label: "Lainnya" },
];

export default function KasUmumPage() {
  const { user } = useAuthStore();
  const [kasUmum, setKasUmum] = useState<KasUmumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    jenis: "PEMASUKAN",
    kategori: "jasa_pinjaman",
    jumlah: "",
    keterangan: "",
  });

  const fetchKasUmum = async () => {
    if (!user?.koperasiId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/kas-umum?koperasiId=${user.koperasiId}`);
      const data = await res.json();
      if (data.success) setKasUmum(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKasUmum();
  }, [user?.koperasiId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.koperasiId || !user?.id) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/kas-umum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          koperasiId: user.koperasiId,
          dicatatOleh: user.id,
          jenis: form.jenis,
          kategori: form.kategori,
          jumlah: parseFloat(form.jumlah),
          keterangan: form.keterangan || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan");
        return;
      }

      setShowForm(false);
      setForm({ jenis: "PEMASUKAN", kategori: "jasa_pinjaman", jumlah: "", keterangan: "" });
      fetchKasUmum();
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setSubmitting(false);
    }
  };

  const kategoriOptions = form.jenis === "PEMASUKAN" ? kategoriPemasukan : kategoriPengeluaran;

  const totalMasuk = kasUmum.filter((k) => k.jenis === "PEMASUKAN").reduce((a, k) => a + k.jumlah, 0);
  const totalKeluar = kasUmum.filter((k) => k.jenis === "PENGELUARAN").reduce((a, k) => a + k.jumlah, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kas Umum</h1>
          <p className="text-gray-500 text-sm mt-1">Catat pemasukan dan pengeluaran operasional koperasi</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Catat Kas
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Total Pemasukan</p>
            <p className="text-lg font-bold text-green-700">{formatRupiah(totalMasuk)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Total Pengeluaran</p>
            <p className="text-lg font-bold text-red-600">{formatRupiah(totalKeluar)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Saldo Kas</p>
            <p className="text-lg font-bold text-gray-900">{formatRupiah(totalMasuk - totalKeluar)}</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-semibold text-gray-900">Catat Kas Umum Baru</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label>Jenis *</Label>
                  <select
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
                    value={form.jenis}
                    onChange={(e) => setForm({ ...form, jenis: e.target.value, kategori: e.target.value === "PEMASUKAN" ? "jasa_pinjaman" : "gaji_pengurus" })}
                  >
                    <option value="PEMASUKAN">Pemasukan</option>
                    <option value="PENGELUARAN">Pengeluaran</option>
                  </select>
                </div>
                <div className="form-group">
                  <Label>Kategori *</Label>
                  <select
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                  >
                    {kategoriOptions.map((k) => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label>Jumlah (Rp) *</Label>
                  <Input type="number" placeholder="100000" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} required min="1" />
                </div>
                <div className="form-group">
                  <Label>Keterangan</Label>
                  <Input placeholder="Opsional" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
                </div>
              </div>

              {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : "Simpan"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="stat-card animate-pulse h-16" />)}
        </div>
      ) : kasUmum.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Belum ada transaksi kas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {kasUmum.map((k) => (
            <Card key={k.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${k.jenis === "PEMASUKAN" ? "bg-green-100" : "bg-red-100"}`}>
                      {k.jenis === "PEMASUKAN" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{k.kategori.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                      <p className="text-xs text-gray-500">{formatDate(k.tanggalTransaksi)} • {k.pencatat.nama}</p>
                      {k.keterangan && <p className="text-xs text-gray-400 mt-0.5">{k.keterangan}</p>}
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${k.jenis === "PEMASUKAN" ? "text-green-600" : "text-red-600"}`}>
                    {k.jenis === "PEMASUKAN" ? "+" : "-"}{formatRupiah(k.jumlah)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}