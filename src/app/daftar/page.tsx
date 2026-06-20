"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, Building2, MapPin, User, Phone, KeyRound } from "lucide-react";

const steps = [
  { id: "data", title: "Data Koperasi", icon: Building2 },
  { id: "ketua", title: "Data Ketua", icon: User },
  { id: "otp", title: "Verifikasi OTP", icon: KeyRound },
];

export default function DaftarPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    namaKoperasi: "",
    noBadanHukum: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    namaKetua: "",
    noHp: "",
  });

  const [otp, setOtp] = useState("");
  const [penggunaId, setPenggunaId] = useState("");

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 0) {
      if (!form.namaKoperasi || !form.desa || !form.kabupaten || !form.provinsi) {
        setError("Harap isi semua field yang wajib");
        return;
      }
    }
    if (currentStep === 1) {
      if (!form.namaKetua || !form.noHp || form.noHp.length < 10) {
        setError("Harap isi nama ketua dan nomor HP yang valid");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrasi gagal");
        setCurrentStep(1);
        return;
      }

      setPenggunaId(data.data.penggunaId);
      setOtp(data.data.otp);
      setCurrentStep(2);
    } catch {
      setError("Gagal menghubungi server");
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ penggunaId, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verifikasi gagal");
        return;
      }

      login(data.data.user);
      router.push("/dashboard");
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">KD</span>
            </div>
            <span className="text-2xl font-bold text-green-800">kopdes.id</span>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx <= currentStep
                    ? "bg-green-700 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  idx <= currentStep ? "text-green-700" : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 ${
                    idx < currentStep ? "bg-green-700" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {currentStep === 0 && "Data Koperasi Desa"}
              {currentStep === 1 && "Data Ketua Koperasi"}
              {currentStep === 2 && "Verifikasi OTP"}
            </CardTitle>
            <CardDescription>
              {currentStep === 0 && "Lengkapi data koperasi desa Anda"}
              {currentStep === 1 && "Masukkan data ketua koperasi"}
              {currentStep === 2 && "Masukkan kode OTP untuk verifikasi"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Data Koperasi */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="namaKoperasi">Nama Koperasi *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="namaKoperasi"
                      placeholder="Kopdes Merah Putih Desa Sukomulyo"
                      value={form.namaKoperasi}
                      onChange={(e) => updateForm("namaKoperasi", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="noBadanHukum">No. Badan Hukum (opsional)</Label>
                  <Input
                    id="noBadanHukum"
                    placeholder="BH-0001234"
                    value={form.noBadanHukum}
                    onChange={(e) => updateForm("noBadanHukum", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="desa">Desa/Kelurahan *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="desa"
                        placeholder="Sukomulyo"
                        value={form.desa}
                        onChange={(e) => updateForm("desa", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="kecamatan">Kecamatan</Label>
                    <Input
                      id="kecamatan"
                      placeholder="Grobogan"
                      value={form.kecamatan}
                      onChange={(e) => updateForm("kecamatan", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="kabupaten">Kabupaten/Kota *</Label>
                    <Input
                      id="kabupaten"
                      placeholder="Grobogan"
                      value={form.kabupaten}
                      onChange={(e) => updateForm("kabupaten", e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="provinsi">Provinsi *</Label>
                    <Input
                      id="provinsi"
                      placeholder="Jawa Tengah"
                      value={form.provinsi}
                      onChange={(e) => updateForm("provinsi", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button onClick={handleNext} className="w-full">
                  Lanjutkan
                </Button>
              </div>
            )}

            {/* Step 2: Data Ketua */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="namaKetua">Nama Ketua Koperasi *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="namaKetua"
                      placeholder="Hadi Santoso"
                      value={form.namaKetua}
                      onChange={(e) => updateForm("namaKetua", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="noHpKetua">Nomor HP Ketua *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="noHpKetua"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={form.noHp}
                      onChange={(e) => updateForm("noHp", e.target.value)}
                      className="pl-10"
                      required
                      minLength={10}
                      maxLength={15}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Nomor ini akan digunakan untuk login dan menerima OTP via WhatsApp
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                    className="flex-1"
                  >
                    Kembali
                  </Button>
                  <Button onClick={handleRegister} className="flex-1" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mendaftar...
                      </>
                    ) : (
                      "Daftarkan Koperasi"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: OTP Verification */}
            {currentStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Kode OTP telah dikirim ke WhatsApp
                  </p>
                  <p className="font-semibold text-green-700">{form.noHp}</p>
                </div>

                <div className="form-group">
                  <Label htmlFor="otp">Kode OTP (6 digit)</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="pl-10 text-center text-2xl tracking-[0.5em] font-mono"
                      required
                      maxLength={6}
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Demo: OTP terisi otomatis
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    "Verifikasi & Masuk"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-green-700 font-medium hover:underline">
                Masuk
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}