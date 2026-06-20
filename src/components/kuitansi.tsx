"use client";

import { formatRupiah, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";

interface KuitansiProps {
  data: {
    nomorTransaksi: string;
    tanggal: string;
    namaKoperasi: string;
    namaAnggota: string;
    nomorAnggota: string;
    jenis: string;
    jumlah: number;
    keterangan?: string;
    dicatatOleh: string;
  };
  onClose: () => void;
}

export function Kuitansi({ data, onClose }: KuitansiProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 print:shadow-none print:max-w-full">
        {/* Print controls */}
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h3 className="font-semibold text-gray-900">Kuitansi Transaksi</h3>
          <div className="flex gap-2">
            <Button size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Cetak
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Receipt */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">{data.namaKoperasi}</h2>
            <p className="text-xs text-gray-500">KUITANSI TRANSAKSI</p>
          </div>

          <div className="border-b border-gray-200 mb-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">No. Transaksi</span>
              <span className="font-mono text-gray-900">{data.nomorTransaksi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tanggal</span>
              <span className="text-gray-900">{formatDate(data.tanggal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nama Anggota</span>
              <span className="text-gray-900">{data.namaAnggota}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">No. Anggota</span>
              <span className="text-gray-900">{data.nomorAnggota}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jenis Transaksi</span>
              <span className="text-gray-900">{data.jenis}</span>
            </div>
            {data.keterangan && (
              <div className="flex justify-between">
                <span className="text-gray-500">Keterangan</span>
                <span className="text-gray-900">{data.keterangan}</span>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 my-4" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">JUMLAH</span>
            <span className="text-2xl font-extrabold text-green-700">
              {formatRupiah(data.jumlah)}
            </span>
          </div>

          <div className="border-b border-gray-200 my-4" />

          <div className="flex justify-between text-xs text-gray-400 mt-4">
            <span>Dicatat oleh: {data.dicatatOleh}</span>
            <span>kopdes.id</span>
          </div>
        </div>
      </div>
    </div>
  );
}