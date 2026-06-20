"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Loader2,
  Scale,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";

interface NeracaData {
  aset: {
    kasDanBank: number;
    piutangPinjaman: number;
    total: number;
  };
  kewajiban: {
    simpananAnggota: number;
    total: number;
  };
  modal: {
    modalDisetor: number;
    total: number;
  };
  totalKewajibanDanModal: number;
  balanced: boolean;
}

export default function NeracaPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<NeracaData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNeraca = async () => {
    if (!user?.koperasiId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/laporan/neraca?koperasiId=${user.koperasiId}`);
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeraca();
  }, [user?.koperasiId]);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Neraca Keuangan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Laporan posisi keuangan koperasi (Aset = Kewajiban + Modal)
          </p>
        </div>
        <Button variant="outline" onClick={handlePrint}>
          <Download className="h-4 w-4 mr-2" />
          Cetak
        </Button>
      </div>

      {loading ? (
        <div className="stat-card animate-pulse h-64" />
      ) : data ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Aset */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-green-600" />
                ASET
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Kas dan Bank</span>
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(data.aset.kasDanBank)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Piutang Pinjaman</span>
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(data.aset.piutangPinjaman)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-green-300">
                  <span className="text-lg font-bold text-green-800">Total Aset</span>
                  <span className="text-lg font-extrabold text-green-700">
                    {formatRupiah(data.aset.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kewajiban & Modal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Scale className="h-5 w-5 text-blue-600" />
                KEWAJIBAN & MODAL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    Kewajiban
                  </p>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Simpanan Anggota</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiah(data.kewajiban.simpananAnggota)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-700">Total Kewajiban</span>
                    <span className="font-bold text-gray-900">
                      {formatRupiah(data.kewajiban.total)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    Modal
                  </p>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Modal Disetor</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiah(data.modal.modalDisetor)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-700">Total Modal</span>
                    <span className="font-bold text-gray-900">
                      {formatRupiah(data.modal.total)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between py-3 border-t-2 border-blue-300">
                  <span className="text-lg font-bold text-blue-800">
                    Total Kewajiban + Modal
                  </span>
                  <span className="text-lg font-extrabold text-blue-700">
                    {formatRupiah(data.totalKewajibanDanModal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance Check */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${data.balanced ? "bg-green-100" : "bg-red-100"}`}>
                    {data.balanced ? (
                      <Building2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {data.balanced ? "Neraca Seimbang" : "Neraca Tidak Seimbang"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {data.balanced
                        ? "Aset = Kewajiban + Modal ✓"
                        : "Periksa kembali pencatatan transaksi"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Gagal memuat data neraca</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}