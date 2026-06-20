import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const loginSchema = z.object({
  noHp: z.string().min(10, "Nomor HP minimal 10 digit").max(15),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noHp } = loginSchema.parse(body);

    const pengguna = await prisma.pengguna.findUnique({
      where: { noHp },
      include: { koperasi: true },
    });

    if (!pengguna) {
      return NextResponse.json(
        { error: "Nomor HP tidak terdaftar" },
        { status: 404 }
      );
    }

    if (pengguna.status === "NONAKTIF") {
      return NextResponse.json(
        { error: "Akun Anda tidak aktif. Hubungi pengurus koperasi." },
        { status: 403 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.pengguna.update({
      where: { id: pengguna.id },
      data: { otp, otpExpiry },
    });

    return NextResponse.json({
      success: true,
      message: "Kode OTP telah dikirim ke WhatsApp Anda.",
      data: {
        penggunaId: pengguna.id,
        otp: otp, // Remove in production
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}