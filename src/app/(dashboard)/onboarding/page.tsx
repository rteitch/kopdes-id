"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  ArrowRight,
  CheckCircle2,
  UserPlus,
  Wallet,
  Loader2,
  FileText,
} from "lucide-react";

const steps = [
  {
    title: "Selamat Datang! 🎉",
    description: "Koperasi Anda berhasil didaftarkan. Mari mulai menambahkan anggota pertama.",
  },
  {
    title: "Tambah Anggota Pertama",
    description: "Tambahkan minimal 1 anggota untuk mulai mencatat transaksi.",
  },
  {
    title: "Siap Digunakan!",
    description: "Anda sudah siap menggunakan kopdes.id. Mulai catat transaksi pertama Anda.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [anggotaForm, setAnggotaForm] = useState({
    nama: "",
    noHp: "",
    alamat: "",
  });

  const handleAddAnggota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.koperasiId) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/anggota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          koperasiId: user.koperasiId,
          ...anggotaForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menambahkan anggota");
        return;
      }

      setCurrentStep(2);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx <= currentStep
                    ? "bg-green-700 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-12 ${
                    idx < currentStep ? "bg-green-700" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <span className="text-4xl">🎉</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {steps[0].title}
                  </h2>
                  <p className="text-gray-500 mt-2">{steps[0].description}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-left">
                  <p className="text-sm text-green-800">
                    <strong>Koperasi:</strong> {user?.koperasiNama}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Anda masuk sebagai <strong>{user?.role}</strong>
                  </p>
                </div>
                <Button onClick={() => setCurrentStep(1)} className="w-full">
                  Mulai Tambah Anggota
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  Lewati, ke Dashboard →
                </button>
              </div>
            )}

            {/* Step 1: Add First Member */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="h-7 w-7 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {steps[1].title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {steps[1].description}
                  </p>
                </div>

                <form onSubmit={handleAddAnggota} className="space-y-4">
                  <div className="form-group">
                    <Label>Nama Lengkap *</Label>
                    <Input
                      placeholder="Nama anggota"
                      value={anggotaForm.nama}
                      onChange={(e) =>
                        setAnggotaForm({ ...anggotaForm, nama: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label>No. HP *</Label>
                    <Input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={anggotaForm.noHp}
                      onChange={(e) =>
                        setAnggotaForm({ ...anggotaForm, noHp: e.target.value })
                      }
                      required
                      minLength={10}
                    />
                  </div>
                  <div className="form-group">
                    <Label>Alamat</Label>
                    <Input
                      placeholder="Alamat (opsional)"
                      value={anggotaForm.alamat}
                      onChange={(e) =>
                        setAnggotaForm({
                          ...anggotaForm,
                          alamat: e.target.value,
                        })
                      }
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Anggota"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      Lewati
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Ready */}
            {currentStep === 2 && (
              <div className="text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {steps[2].title}
                  </h2>
                  <p className="text-gray-500 mt-2">{steps[2].description}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => router.push("/anggota")}
                    className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-center"
                  >
                    <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <span className="text-xs font-medium text-gray-700">
                      Anggota
                    </span>
                  </button>
                  <button
                    onClick={() => router.push("/transaksi")}
                    className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-center"
                  >
                    <Wallet className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <span className="text-xs font-medium text-gray-700">
                      Simpanan
                    </span>
                  </button>
                  <button
                    onClick={() => router.push("/laporan")}
                    className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-center"
                  >
                    <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <span className="text-xs font-medium text-gray-700">
                      Laporan
                    </span>
                  </button>
                </div>

                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                >
                  Masuk ke Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}