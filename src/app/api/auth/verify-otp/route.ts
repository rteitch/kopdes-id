import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const verifySchema = z.object({
  penggunaId: z.string().uuid(),
  otp: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { penggunaId, otp } = verifySchema.parse(body);

    const pengguna = await prisma.pengguna.findUnique({
      where: { id: penggunaId },
      include: { koperasi: true },
    });

    if (!pengguna) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    if (pengguna.otp !== otp) {
      return NextResponse.json(
        { error: "Kode OTP salah" },
        { status: 400 }
      );
    }

    if (pengguna.otpExpiry && pengguna.otpExpiry < new Date()) {
      return NextResponse.json(
        { error: "Kode OTP sudah kadaluarsa" },
        { status: 400 }
      );
    }

    // Clear OTP after successful verification
    await prisma.pengguna.update({
      where: { id: penggunaId },
      data: { otp: null, otpExpiry: null },
    });

    return NextResponse.json({
      success: true,
      message: "Verifikasi berhasil",
      data: {
        user: {
          id: pengguna.id,
          nama: pengguna.nama,
          noHp: pengguna.noHp,
          role: pengguna.role,
          koperasiId: pengguna.koperasiId,
          koperasiNama: pengguna.koperasi.nama,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data tidak valid", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}