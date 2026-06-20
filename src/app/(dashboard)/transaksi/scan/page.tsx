"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  Upload,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Edit3,
} from "lucide-react";
import Link from "next/link";

export default function ScanNotaPage() {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<{
    jumlah: string;
    tanggal: string;
    keterangan: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);
    setImagePreview(URL.createObjectURL(file));

    try {
      // Try to use Tesseract.js for OCR
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "ind", {
        logger: () => {},
      });

      const text = result.data.text;
      const extracted = extractNotaData(text);
      setExtractedData(extracted);
    } catch {
      // Fallback: manual input
      setExtractedData({
        jumlah: "",
        tanggal: new Date().toISOString().split("T")[0],
        keterangan: "Input dari scan nota",
      });
      setError("OCR tidak tersedia. Silakan input manual.");
    } finally {
      setLoading(false);
    }
  };

  const extractNotaData = (text: string) => {
    // Simple regex extraction for Indonesian receipts
    const amountMatch = text.match(/Rp\.?\s*([\d.,]+)/i);
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);

    let jumlah = "";
    if (amountMatch) {
      jumlah = amountMatch[1].replace(/[.,]/g, "");
    }

    let tanggal = new Date().toISOString().split("T")[0];
    if (dateMatch) {
      tanggal = dateMatch[1];
    }

    return {
      jumlah,
      tanggal,
      keterangan: text.substring(0, 100).trim() || "Scan nota",
    };
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/transaksi" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scan Nota</h1>
          <p className="text-gray-500 text-sm">
            Foto atau upload nota/kuitansi untuk auto-fill transaksi
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Nota"
                    className="max-h-48 mx-auto rounded-lg object-contain"
                  />
                  <p className="text-sm text-gray-500">Klik untuk ganti foto</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                    <Camera className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Foto atau Upload Nota
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Ambil foto nota atau upload dari galeri
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Foto
              </Button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">
                  Membaca nota dengan OCR...
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                {error}
              </div>
            )}

            {/* Extracted Data */}
            {extractedData && !loading && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">
                    Data Terdeteksi
                  </h3>
                </div>

                <div className="form-group">
                  <Label>Jumlah (Rp)</Label>
                  <Input
                    type="number"
                    value={extractedData.jumlah}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        jumlah: e.target.value,
                      })
                    }
                    placeholder="Masukkan jumlah"
                  />
                </div>

                <div className="form-group">
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={extractedData.tanggal}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        tanggal: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <Label>Keterangan</Label>
                  <Input
                    value={extractedData.keterangan}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        keterangan: e.target.value,
                      })
                    }
                    placeholder="Keterangan transaksi"
                  />
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-700">
                    <strong>Catatan:</strong> Verifikasi data di atas sebelum
                    menyimpan. Buka menu Simpanan untuk mencatat transaksi
                    dengan data ini.
                  </p>
                </div>

                <Link href="/transaksi">
                  <Button className="w-full">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Lanjut ke Form Transaksi
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}