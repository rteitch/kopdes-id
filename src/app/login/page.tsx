"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, Phone, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [noHp, setNoHp] = useState("");
  const [otp, setOtp] = useState("");
  const [penggunaId, setPenggunaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noHp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan");
        return;
      }

      setPenggunaId(data.data.penggunaId);
      // In demo, auto-fill OTP
      setOtp(data.data.otp);
      setStep("otp");
    } catch {
      setError("Gagal menghubungi server");
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
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">KD</span>
            </div>
            <span className="text-2xl font-bold text-green-800">kopdes.id</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === "phone" ? "Masuk ke Akun Anda" : "Verifikasi OTP"}
            </CardTitle>
            <CardDescription>
              {step === "phone"
                ? "Masukkan nomor HP yang terdaftar"
                : "Masukkan kode OTP yang dikirim ke WhatsApp Anda"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="noHp">Nomor HP</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="noHp"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      className="pl-10"
                      required
                      minLength={10}
                      maxLength={15}
                    />
                  </div>
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
                      Mengirim OTP...
                    </>
                  ) : (
                    "Kirim Kode OTP"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="otp">Kode OTP (6 digit)</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
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

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-sm text-gray-500 hover:text-green-700"
                >
                  Ganti nomor HP
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link href="/daftar" className="text-green-700 font-medium hover:underline">
                Daftar Gratis
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}