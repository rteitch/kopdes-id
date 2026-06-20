"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Receipt,
  Camera,
} from "lucide-react";

interface TransaksiData {
  id: string;
  jenis: string;
  jenisTransaksi: string;
  jumlah: number;
  saldoSetelah: number | null;
  keterangan: string | null;
  tanggalTransaksi: string;
  anggota: { nama: string; nomorAnggota: string };
}

interface AnggotaOption {
  id: string;
  nama: string;
  nomorAnggota: string;
}

export default function TransaksiPage() {
  const { user } = useAuthStore();
  const [transaksi, setTransaksi] = useState<TransaksiData[]>([]);
  const [anggotaList, setAnggotaList] = useState<AnggotaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    anggotaId: "",
    jenis: "WAJIB",
    jenisTransaksi: "SETOR",
    jumlah: "",
    keterangan: "",
  });

  const fetchTransaksi = async () => {
    if (!user?.koperasiId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/transaksi?koperasiId=${user.koperasiId}`);
      const data = await res.json();
      if (data.success) setTransaksi(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnggota = async () => {
    if (!user?.koperasiId) return;
    try {
      const res = await fetch(`/api/anggota?koperasiId=${user.koperasiId}&limit=100`);
      const data = await res.json();
      if (data.success) setAnggotaList(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransaksi();
    fetchAnggota();
  }, [user?.koperasiId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.koperasiId || !user?.id) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          koperasiId: user.koperasiId,
          dicatatOleh: user.id,
          anggotaId: form.anggotaId,
          jenis: form.jenis,
          jenisTransaksi: form.jenisTransaksi,
          jumlah: parseFloat(form.jumlah),
          keterangan: form.keterangan || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan transaksi");
        return;
      }

      setShowForm(false);
      setForm({ anggotaId: "", jenis: "WAJIB", jenisTransaksi: "SETOR", jumlah: "", keterangan: "" });
      fetchTransaksi();
    } catch (err) {
      setError("Gagal menghubungi server");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simpanan</h1>
          <p className="text-gray-500 text-sm mt-1">Catat setoran dan penarikan simpanan anggota</p>
        </div>
        <div className="flex gap-2">
          <Link href="/transaksi/scan">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Scan Nota
            </Button>
          </Link>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Catat Transaksi
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-semibold text-gray-900">Catat Simpanan Baru</h3>

              <div className="form-group">
                <Label>Pilih Anggota *</Label>
                <select
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
                  value={form.anggotaId}
                  onChange={(e) => setForm({ ...form, anggotaId: e.target.value })}
                  required
                >
                  <option value="">-- Pilih Anggota --</option>
                  {anggotaList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nomorAnggota} - {a.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label>Jenis Simpanan *</Label>
                  <select
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
                    value={form.jenis}
                    onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                  >
                    <option value="POKOK">Simpanan Pokok</option>
                    <option value="WAJIB">Simpanan Wajib</option>
                    <option value="SUKARELA">Simpanan Sukarela</option>
                  </select>
                </div>
                <div className="form-group">
                  <Label>Jenis Transaksi *</Label>
                  <select
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
                    value={form.jenisTransaksi}
                    onChange={(e) => setForm({ ...form, jenisTransaksi: e.target.value })}
                  >
                    <option value="SETOR">Setor</option>
                    <option value="TARIK">Tarik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label>Jumlah (Rp) *</Label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={form.jumlah}
                    onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <Label>Keterangan</Label>
                  <Input
                    placeholder="Opsional"
                    value={form.keterangan}
                    onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</>
                  ) : (
                    "Simpan Transaksi"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse h-16" />
          ))}
        </div>
      ) : transaksi.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Belum ada transaksi</p>
            <p className="text-sm text-gray-400 mt-1">Klik "Catat Transaksi" untuk memulai</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {transaksi.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        t.jenisTransaksi === "SETOR" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {t.jenisTransaksi === "SETOR" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{t.anggota.nama}</p>
                      <p className="text-xs text-gray-500">
                        {t.jenis === "POKOK" ? "Sim. Pokok" : t.jenis === "WAJIB" ? "Sim. Wajib" : "Sim. Sukarela"} • {formatDate(t.tanggalTransaksi)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        t.jenisTransaksi === "SETOR" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.jenisTransaksi === "SETOR" ? "+" : "-"}{formatRupiah(t.jumlah)}
                    </p>
                    {t.saldoSetelah !== null && (
                      <p className="text-xs text-gray-400">Saldo: {formatRupiah(t.saldoSetelah)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}