import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bayarAngsuranSchema = z.object({
  angsuranId: z.string().uuid(),
  jumlahBayar: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { angsuranId, jumlahBayar } = bayarAngsuranSchema.parse(body);

    const angsuran = await prisma.angsuran.findUnique({
      where: { id: angsuranId },
      include: { pinjaman: true },
    });

    if (!angsuran) {
      return NextResponse.json({ error: "Angsuran tidak ditemukan" }, { status: 404 });
    }

    const totalTagihan = Number(angsuran.jumlahPokok) + Number(angsuran.jumlahBunga) + Number(angsuran.jumlahDenda);

    let denda = 0;
    const now = new Date();
    if (now > angsuran.tanggalJatuhTempo && angsuran.status === "BELUM") {
      const daysLate = Math.floor((now.getTime() - angsuran.tanggalJatuhTempo.getTime()) / (1000 * 60 * 60 * 24));
      denda = totalTagihan * 0.001 * daysLate;
    }

    const isLunas = jumlahBayar >= totalTagihan + denda;

    const updatedAngsuran = await prisma.angsuran.update({
      where: { id: angsuranId },
      data: {
        jumlahBayar: jumlahBayar,
        jumlahDenda: denda,
        tanggalBayar: now,
        status: isLunas ? "LUNAS" : "BELUM",
      },
    });

    if (isLunas) {
      const allAngsuran = await prisma.angsuran.findMany({
        where: { pinjamanId: angsuran.pinjamanId },
      });

      const allPaid = allAngsuran.every((a) => a.status === "LUNAS");
      if (allPaid) {
        await prisma.pinjaman.update({
          where: { id: angsuran.pinjamanId },
          data: { status: "LUNAS" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pembayaran angsuran berhasil dicatat",
      data: {
        ...updatedAngsuran,
        jumlahPokok: Number(updatedAngsuran.jumlahPokok),
        jumlahBunga: Number(updatedAngsuran.jumlahBunga),
        jumlahDenda: Number(updatedAngsuran.jumlahDenda),
        jumlahBayar: Number(updatedAngsuran.jumlahBayar),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data tidak valid", details: error.issues }, { status: 400 });
    }
    console.error("Bayar angsuran error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}