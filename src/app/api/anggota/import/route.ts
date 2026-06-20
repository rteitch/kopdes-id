import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const importRowSchema = z.object({
  nama: z.string().min(1),
  noHp: z.string().min(10).max(15),
  nik: z.string().optional(),
  alamat: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { koperasiId, anggota: anggotaList } = body;

    if (!koperasiId || !anggotaList || !Array.isArray(anggotaList)) {
      return NextResponse.json(
        { error: "Data tidak valid. koperasiId dan anggota[] wajib diisi" },
        { status: 400 }
      );
    }

    // Get last anggota number
    const lastAnggota = await prisma.anggota.findFirst({
      where: { koperasiId },
      orderBy: { createdAt: "desc" },
    });

    let lastNum = lastAnggota
      ? parseInt(lastAnggota.nomorAnggota.replace(/\D/g, ""))
      : 0;

    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (let i = 0; i < anggotaList.length; i++) {
      try {
        const row = importRowSchema.parse(anggotaList[i]);
        lastNum++;

        // Check duplicate phone
        const existing = await prisma.anggota.findFirst({
          where: { koperasiId, noHp: row.noHp },
        });

        if (existing) {
          results.failed++;
          results.errors.push(`Baris ${i + 1}: No. HP ${row.noHp} sudah terdaftar (${existing.nama})`);
          continue;
        }

        await prisma.anggota.create({
          data: {
            koperasiId,
            nama: row.nama,
            noHp: row.noHp,
            nik: row.nik || null,
            alamat: row.alamat || null,
            nomorAnggota: `KDS-${String(lastNum).padStart(3, "0")}`,
            tanggalMasuk: new Date(),
          },
        });

        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Baris ${i + 1}: ${err instanceof Error ? err.message : "Data tidak valid"}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import selesai: ${results.success} berhasil, ${results.failed} gagal`,
      data: results,
    });
  } catch (error) {
    console.error("Import anggota error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}