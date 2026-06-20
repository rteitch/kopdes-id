"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Loader2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

interface AngsuranData {
  id: string;
  ke: number;
  tanggalJatuhTempo: string;
  jumlahPokok: number;
  jumlahBunga: number;
  jumlahDenda: number;
  jumlahBayar: number | null;
  status: string;
}

interface PinjamanData {
  id: string;
  nomorPinjaman: string;
  jumlahPokok: number;
  bungaPersen: number;
  jenisBunga: string;
  jangkaWaktu: number;
  tanggalCair: string;
  status: string;
  tujuan: string | null;
  anggota: { nama: string; nomorAnggota: string };
  angsuran: AngsuranData[];
}

interface AnggotaOption {
  id: string;
  nama: string;
  nomorAnggota: string;
}

export default function PinjamanPage() {
  const { user } = useAuthStore();
  const [pinjaman, setPinjaman] = useState<PinjamanData[]>([]);
  const [anggotaList, setAnggotaList] = useState<AnggotaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");

  const [form, setForm] = useState({
    anggotaId: "",
    jumlahPokok: "",
    bungaPersen: "1",
    jenisBunga: "FLAT",
    jangkaWaktu: "12",
    tujuan: "",
  });

  const fetchData = async () => {
    if (!user?.koperasiId) return;
    setLoading(true);
    try {
      const [pinjamanRes, anggotaRes] = await Promise.all([
        fetch(`/api/pinjaman?koperasiId=${user.koperasiId}`),
        fetch(`/api/anggota?koperasiId=${user.koperasiId}&limit=100`),
      ]);
      const pinjamanData = await pinjamanRes.json();
      const anggotaData = await anggotaRes.json();
      if (pinjamanData.success) setPinjaman(pinjamanData.data);
      if (anggotaData.success) setAnggotaList(anggotaData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.koperasiId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.koperasiId) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/pinjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          koperasiId: user.koperasiId,
          anggotaId: form.anggotaId,
          jumlahPokok: parseFloat(form.jumlahPokok),
          bungaPersen: parseFloat(form.bungaPersen),
          jenisBunga: form.jenisBunga,
          jangkaWaktu: parseInt(form.jangkaWaktu),
          tujuan: form.tujuan || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan pinjaman");
        return;
      }

      setShowForm(false);
      setForm({ anggotaId: "", jumlahPokok: "", bungaPersen: "1", jenisBunga: "FLAT", jangkaWaktu: "12", tujuan: "" });
      fetchData();
    } catch (err) {
      setError("Gagal menghubungi server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBayarAngsuran = async (angsuranId: string) => {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) return;

    try {
      const res = await fetch("/api/pinjaman/angsuran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ angsuranId, jumlahBayar: amount }),
      });

      const data = await res.json();
      if (res.ok) {
        setPayingId(null);
        setPayAmount("");
        fetchData();
      } else {
        alert(data.error || "Gagal membayar angsuran");
      }
    } catch {
      alert("Gagal menghubungi server");
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "default" | "success" | "warning" | "destructive"; label: string }> = {
      AKTIF: { variant: "warning", label: "Aktif" },
      LUNAS: { variant: "success", label: "Lunas" },
      MACET: { variant: "destructive", label: "Macet" },
    };
    const s = map[status] || { variant: "default" as const, label: status };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pinjaman</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola pinjaman dan angsuran anggota</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Catat Pinjaman Baru
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-semibold text-gray-900">Ajukan Pinjaman Baru</h3>

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
                    <option key={a.id} value={a.id}>{a.nomorAnggota} - {a.nama}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label>Jumlah Pinjaman (Rp) *</Label>
                  <Input type="number" placeholder="5000000" value={form.jumlahPokok} onChange={(e) => setForm({ ...form, jumlahPokok: e.target.value })} required min="1" />
                </div>
                <div className="form-group">
                  <Label>Bunga (% per tahun) *</Label>
                  <Input type="number" step="0.1" value={form.bungaPersen} onChange={(e) => setForm({ ...form, bungaPersen: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label>Jenis Bunga *</Label>
                  <select className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base" value={form.jenisBunga} onChange={(e) => setForm({ ...form, jenisBunga: e.target.value })}>
                    <option value="FLAT">Flat</option>
                    <option value="MENURUN">Menurun</option>
                  </select>
                </div>
                <div className="form-group">
                  <Label>Jangka Waktu (Bulan) *</Label>
                  <Input type="number" value={form.jangkaWaktu} onChange={(e) => setForm({ ...form, jangkaWaktu: e.target.value })} required min="1" max="60" />
                </div>
              </div>

              <div className="form-group">
                <Label>Tujuan Pinjaman</Label>
                <Input placeholder="Modal usaha, pertanian, dll." value={form.tujuan} onChange={(e) => setForm({ ...form, tujuan: e.target.value })} />
              </div>

              {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : "Simpan Pinjaman"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="stat-card animate-pulse h-20" />)}
        </div>
      ) : pinjaman.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Belum ada pinjaman</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pinjaman.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{p.nomorPinjaman}</p>
                      {statusBadge(p.status)}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{p.anggota.nama} • {p.jenisBunga} • {p.jangkaWaktu} bulan</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatRupiah(p.jumlahPokok)}</p>
                      <p className="text-xs text-gray-500">{p.bungaPersen}% / tahun</p>
                    </div>
                    {expandedId === p.id ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>

                {expandedId === p.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 text-sm mb-3">Jadwal Angsuran</h4>
                    <div className="space-y-2">
                      {p.angsuran.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                          <div>
                            <p className="text-sm font-medium">Angsuran ke-{a.ke}</p>
                            <p className="text-xs text-gray-500">Jatuh tempo: {formatDate(a.tanggalJatuhTempo)}</p>
                            <p className="text-xs text-gray-500">Pokok: {formatRupiah(a.jumlahPokok)} + Bunga: {formatRupiah(a.jumlahBunga)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {a.status === "LUNAS" ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs font-medium">Lunas</span>
                              </div>
                            ) : (
                              <>
                                {payingId === a.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Jumlah"
                                      value={payAmount}
                                      onChange={(e) => setPayAmount(e.target.value)}
                                      className="w-32 h-9 text-sm"
                                    />
                                    <Button size="sm" onClick={() => handleBayarAngsuran(a.id)}>Bayar</Button>
                                    <Button size="sm" variant="ghost" onClick={() => { setPayingId(null); setPayAmount(""); }}>Batal</Button>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setPayingId(a.id); setPayAmount(String(Number(a.jumlahPokok) + Number(a.jumlahBunga))); }}>
                                    Bayar
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}