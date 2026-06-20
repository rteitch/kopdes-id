import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const kasUmumSchema = z.object({
  koperasiId: z.string().uuid(),
  jenis: z.enum(["PEMASUKAN", "PENGELUARAN"]),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  jumlah: z.number().positive("Jumlah harus lebih dari 0"),
  keterangan: z.string().optional(),
  dicatatOleh: z.string().uuid(),
  tanggalTransaksi: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!koperasiId) {
      return NextResponse.json({ error: "koperasiId wajib diisi" }, { status: 400 });
    }

    const [kasUmum, total] = await Promise.all([
      prisma.kasUmum.findMany({
        where: { koperasiId },
        include: { pencatat: { select: { nama: true } } },
        orderBy: { tanggalTransaksi: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.kasUmum.count({ where: { koperasiId } }),
    ]);

    return NextResponse.json({
      success: true,
      data: kasUmum.map((k) => ({
        ...k,
        jumlah: Number(k.jumlah),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get kas umum error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = kasUmumSchema.parse(body);

    const kasUmum = await prisma.kasUmum.create({
      data: {
        koperasiId: data.koperasiId,
        jenis: data.jenis,
        kategori: data.kategori,
        jumlah: data.jumlah,
        keterangan: data.keterangan || null,
        dicatatOleh: data.dicatatOleh,
        tanggalTransaksi: data.tanggalTransaksi
          ? new Date(data.tanggalTransaksi)
          : new Date(),
      },
      include: { pencatat: { select: { nama: true } } },
    });

    return NextResponse.json({
      success: true,
      message: `${data.jenis === "PEMASUKAN" ? "Pemasukan" : "Pengeluaran"} berhasil dicatat`,
      data: { ...kasUmum, jumlah: Number(kasUmum.jumlah) },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data tidak valid", details: error.issues }, { status: 400 });
    }
    console.error("Create kas umum error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}