import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  namaKoperasi: z.string().min(1, "Nama koperasi wajib diisi"),
  noBadanHukum: z.string().optional(),
  desa: z.string().min(1, "Desa wajib diisi"),
  kecamatan: z.string().optional(),
  kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  namaKetua: z.string().min(1, "Nama ketua wajib diisi"),
  noHp: z.string().min(10, "Nomor HP minimal 10 digit").max(15),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if phone number already exists
    const existingUser = await prisma.pengguna.findUnique({
      where: { noHp: validatedData.noHp },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Nomor HP sudah terdaftar" },
        { status: 400 }
      );
    }

    // Create koperasi
    const koperasi = await prisma.koperasi.create({
      data: {
        nama: validatedData.namaKoperasi,
        noBadanHukum: validatedData.noBadanHukum || null,
        desa: validatedData.desa,
        kecamatan: validatedData.kecamatan || "",
        kabupaten: validatedData.kabupaten,
        provinsi: validatedData.provinsi,
      },
    });

    // Create ketua user
    const pengguna = await prisma.pengguna.create({
      data: {
        koperasiId: koperasi.id,
        nama: validatedData.namaKetua,
        noHp: validatedData.noHp,
        role: "KETUA",
      },
    });

    // Generate OTP (simulated - 6 digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.pengguna.update({
      where: { id: pengguna.id },
      data: { otp, otpExpiry },
    });

    // In production, send OTP via WhatsApp
    // For hackathon demo, return OTP directly
    return NextResponse.json({
      success: true,
      message: "Koperasi berhasil didaftarkan. Kode OTP telah dikirim.",
      data: {
        koperasiId: koperasi.id,
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
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}