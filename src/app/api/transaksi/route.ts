import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const simpananSchema = z.object({
  koperasiId: z.string().uuid(),
  anggotaId: z.string().uuid(),
  jenis: z.enum(["POKOK", "WAJIB", "SUKARELA"]),
  jenisTransaksi: z.enum(["SETOR", "TARIK"]),
  jumlah: z.number().positive("Jumlah harus lebih dari 0"),
  keterangan: z.string().optional(),
  tanggalTransaksi: z.string().optional(),
  dicatatOleh: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!koperasiId) {
      return NextResponse.json({ error: "koperasiId wajib diisi" }, { status: 400 });
    }

    const [transaksi, total] = await Promise.all([
      prisma.simpanan.findMany({
        where: { koperasiId },
        include: { anggota: { select: { nama: true, nomorAnggota: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.simpanan.count({ where: { koperasiId } }),
    ]);

    return NextResponse.json({
      success: true,
      data: transaksi.map((t) => ({
        ...t,
        jumlah: Number(t.jumlah),
        saldoSetelah: t.saldoSetelah ? Number(t.saldoSetelah) : null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get transaksi error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = simpananSchema.parse(body);

    const anggota = await prisma.anggota.findUnique({
      where: { id: data.anggotaId },
    });

    if (!anggota) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }

    if (data.jenisTransaksi === "TARIK" && data.jenis !== "SUKARELA") {
      return NextResponse.json(
        { error: "Hanya simpanan sukarela yang bisa ditarik" },
        { status: 400 }
      );
    }

    // Calculate current balance for the savings type
    const currentSimpanan = await prisma.simpanan.findMany({
      where: {
        anggotaId: data.anggotaId,
        jenis: data.jenis,
      },
    });

    const currentSaldo = currentSimpanan.reduce((acc, s) => {
      return s.jenisTransaksi === "SETOR"
        ? acc + Number(s.jumlah)
        : acc - Number(s.jumlah);
    }, 0);

    if (data.jenisTransaksi === "TARIK" && currentSaldo < data.jumlah) {
      return NextResponse.json(
        { error: `Saldo simpanan ${data.jenis} tidak mencukupi. Saldo saat ini: ${currentSaldo}` },
        { status: 400 }
      );
    }

    const newSaldo =
      data.jenisTransaksi === "SETOR"
        ? currentSaldo + data.jumlah
        : currentSaldo - data.jumlah;

    const transaksi = await prisma.simpanan.create({
      data: {
        koperasiId: data.koperasiId,
        anggotaId: data.anggotaId,
        jenis: data.jenis,
        jenisTransaksi: data.jenisTransaksi,
        jumlah: data.jumlah,
        saldoSetelah: newSaldo,
        keterangan: data.keterangan || null,
        dicatatOleh: data.dicatatOleh,
        tanggalTransaksi: data.tanggalTransaksi
          ? new Date(data.tanggalTransaksi)
          : new Date(),
      },
      include: { anggota: { select: { nama: true, nomorAnggota: true } } },
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi simpanan berhasil dicatat",
      data: {
        ...transaksi,
        jumlah: Number(transaksi.jumlah),
        saldoSetelah: Number(transaksi.saldoSetelah),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data tidak valid", details: error.issues }, { status: 400 });
    }
    console.error("Create transaksi error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}