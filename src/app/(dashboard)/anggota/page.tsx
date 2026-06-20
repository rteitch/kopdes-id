"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Search,
  UserPlus,
  Users,
  Phone,
  Wallet,
  Loader2,
} from "lucide-react";

interface AnggotaData {
  id: string;
  nomorAnggota: string;
  nama: string;
  noHp: string;
  status: string;
  tanggalMasuk: string;
  totalSimpanan: number;
  totalPinjaman: number;
  jumlahPinjamanAktif: number;
}

export default function AnggotaPage() {
  const { user } = useAuthStore();
  const [anggota, setAnggota] = useState<AnggotaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newAnggota, setNewAnggota] = useState({
    nama: "",
    noHp: "",
    alamat: "",
  });

  const fetchAnggota = async () => {
    if (!user?.koperasiId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/anggota?koperasiId=${user.koperasiId}&search=${search}`
      );
      const data = await res.json();
      if (data.success) setAnggota(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnggota();
  }, [user?.koperasiId, search]);

  const handleAddAnggota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.koperasiId) return;
    setAddLoading(true);

    try {
      const res = await fetch("/api/anggota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          koperasiId: user.koperasiId,
          ...newAnggota,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAdd(false);
        setNewAnggota({ nama: "", noHp: "", alamat: "" });
        fetchAnggota();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "default" | "success" | "warning" | "destructive" | "secondary"; label: string }> = {
      AKTIF: { variant: "success", label: "Aktif" },
      CALON: { variant: "warning", label: "Calon" },
      NONAKTIF: { variant: "secondary", label: "Nonaktif" },
      KELUAR: { variant: "destructive", label: "Keluar" },
    };
    const s = map[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anggota Koperasi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data anggota koperasi desa Anda
          </p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Tambah Anggota
        </Button>
      </div>

      {/* Add Anggota Form */}
      {showAdd && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAddAnggota} className="space-y-4">
              <h3 className="font-semibold text-gray-900">Tambah Anggota Baru</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <Label>Nama Lengkap *</Label>
                  <Input
                    placeholder="Nama anggota"
                    value={newAnggota.nama}
                    onChange={(e) =>
                      setNewAnggota({ ...newAnggota, nama: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <Label>No. HP *</Label>
                  <Input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={newAnggota.noHp}
                    onChange={(e) =>
                      setNewAnggota({ ...newAnggota, noHp: e.target.value })
                    }
                    required
                    minLength={10}
                  />
                </div>
                <div className="form-group">
                  <Label>Alamat</Label>
                  <Input
                    placeholder="Alamat (opsional)"
                    value={newAnggota.alamat}
                    onChange={(e) =>
                      setNewAnggota({ ...newAnggota, alamat: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={addLoading}>
                  {addLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Anggota"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdd(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Cari anggota berdasarkan nama, nomor, atau HP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Anggota List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : anggota.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Belum ada anggota</p>
            <p className="text-sm text-gray-400 mt-1">
              Klik "Tambah Anggota" untuk menambahkan anggota pertama
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {anggota.map((a) => (
            <Link key={a.id} href={`/anggota/${a.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 font-semibold text-sm">
                          {a.nama.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 text-sm">
                            {a.nama}
                          </p>
                          {statusBadge(a.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {a.nomorAnggota}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {a.noHp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-700">
                        <Wallet className="h-4 w-4" />
                        {formatRupiah(a.totalSimpanan)}
                      </div>
                      {a.jumlahPinjamanAktif > 0 && (
                        <p className="text-xs text-orange-500 mt-0.5">
                          {a.jumlahPinjamanAktif} pinjaman aktif
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}