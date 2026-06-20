import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const pinjamanSchema = z.object({
  koperasiId: z.string().uuid(),
  anggotaId: z.string().uuid(),
  jumlahPokok: z.number().positive(),
  bungaPersen: z.number().min(0).max(100),
  jenisBunga: z.enum(["FLAT", "MENURUN"]),
  jangkaWaktu: z.number().int().min(1).max(60),
  tujuan: z.string().optional(),
  tanggalCair: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");
    if (!koperasiId) {
      return NextResponse.json({ error: "koperasiId wajib" }, { status: 400 });
    }

    const pinjaman = await prisma.pinjaman.findMany({
      where: { koperasiId },
      include: {
        anggota: { select: { nama: true, nomorAnggota: true } },
        angsuran: { orderBy: { ke: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: pinjaman.map((p) => ({
        ...p,
        jumlahPokok: Number(p.jumlahPokok),
        bungaPersen: Number(p.bungaPersen),
        angsuran: p.angsuran.map((a) => ({
          ...a,
          jumlahPokok: Number(a.jumlahPokok),
          jumlahBunga: Number(a.jumlahBunga),
          jumlahDenda: Number(a.jumlahDenda),
          jumlahBayar: a.jumlahBayar ? Number(a.jumlahBayar) : null,
        })),
      })),
    });
  } catch (error) {
    console.error("Get pinjaman error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = pinjamanSchema.parse(body);

    // Generate nomor pinjaman
    const year = new Date().getFullYear();
    const lastPinjaman = await prisma.pinjaman.findFirst({
      where: { koperasiId: data.koperasiId },
      orderBy: { createdAt: "desc" },
    });
    const lastNum = lastPinjaman
      ? parseInt(lastPinjaman.nomorPinjaman.split("-")[2] || "0")
      : 0;
    const nomorPinjaman = `PIN-${year}-${String(lastNum + 1).padStart(3, "0")}`;

    const tanggalCair = data.tanggalCair ? new Date(data.tanggalCair) : new Date();
    const tanggalJatuhTempo = new Date(tanggalCair);
    tanggalJatuhTempo.setMonth(tanggalJatuhTempo.getMonth() + data.jangkaWaktu);

    // Create pinjaman with angsuran schedule
    const pokokPerBulan = data.jumlahPokok / data.jangkaWaktu;
    const bungaTotal = data.jumlahPokok * (data.bungaPersen / 100);
    const bungaPerBulan = data.jenisBunga === "FLAT"
      ? bungaTotal / data.jangkaWaktu
      : bungaTotal / data.jangkaWaktu; // simplified for MVP

    const angsuranData = [];
    for (let i = 1; i <= data.jangkaWaktu; i++) {
      const jatuhTempo = new Date(tanggalCair);
      jatuhTempo.setMonth(jatuhTempo.getMonth() + i);

      const sisaPokok = data.jumlahPokok - (pokokPerBulan * (i - 1));
      const bungaBulanIni = data.jenisBunga === "MENURUN"
        ? sisaPokok * (data.bungaPersen / 100 / 12)
        : bungaPerBulan;

      angsuranData.push({
        ke: i,
        tanggalJatuhTempo: jatuhTempo,
        jumlahPokok: pokokPerBulan,
        jumlahBunga: bungaBulanIni,
      });
    }

    const pinjaman = await prisma.pinjaman.create({
      data: {
        koperasiId: data.koperasiId,
        anggotaId: data.anggotaId,
        nomorPinjaman,
        jumlahPokok: data.jumlahPokok,
        bungaPersen: data.bungaPersen,
        jenisBunga: data.jenisBunga,
        jangkaWaktu: data.jangkaWaktu,
        tanggalCair,
        tanggalJatuhTempo,
        tujuan: data.tujuan || null,
        angsuran: { create: angsuranData },
      },
      include: { angsuran: { orderBy: { ke: "asc" } } },
    });

    return NextResponse.json({
      success: true,
      message: "Pinjaman berhasil dicatat",
      data: {
        ...pinjaman,
        jumlahPokok: Number(pinjaman.jumlahPokok),
        bungaPersen: Number(pinjaman.bungaPersen),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data tidak valid", details: error.issues }, { status: 400 });
    }
    console.error("Create pinjaman error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}