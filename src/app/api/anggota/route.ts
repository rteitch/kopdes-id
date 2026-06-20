import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const anggotaSchema = z.object({
  koperasiId: z.string().uuid(),
  nama: z.string().min(1, "Nama wajib diisi"),
  noHp: z.string().min(10).max(15),
  nik: z.string().optional(),
  alamat: z.string().optional(),
  tanggalMasuk: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!koperasiId) {
      return NextResponse.json({ error: "koperasiId wajib diisi" }, { status: 400 });
    }

    const where = {
      koperasiId,
      ...(search
        ? {
            OR: [
              { nama: { contains: search, mode: "insensitive" as const } },
              { nomorAnggota: { contains: search, mode: "insensitive" as const } },
              { noHp: { contains: search } },
            ],
          }
        : {}),
    };

    const [anggota, total] = await Promise.all([
      prisma.anggota.findMany({
        where,
        include: {
          simpanan: { select: { jumlah: true, jenis: true, jenisTransaksi: true } },
          pinjaman: { where: { status: "AKTIF" }, select: { jumlahPokok: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.anggota.count({ where }),
    ]);

    const data = anggota.map((a) => {
      const totalSimpanan = a.simpanan.reduce((acc, s) => {
        return s.jenisTransaksi === "SETOR" ? acc + Number(s.jumlah) : acc - Number(s.jumlah);
      }, 0);
      const totalPinjaman = a.pinjaman.reduce((acc, p) => acc + Number(p.jumlahPokok), 0);

      return {
        id: a.id,
        nomorAnggota: a.nomorAnggota,
        nama: a.nama,
        noHp: a.noHp,
        nik: a.nik,
        alamat: a.alamat,
        tanggalMasuk: a.tanggalMasuk,
        status: a.status,
        totalSimpanan,
        totalPinjaman,
        jumlahPinjamanAktif: a.pinjaman.length,
      };
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get anggota error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = anggotaSchema.parse(body);

    // Generate nomor anggota
    const lastAnggota = await prisma.anggota.findFirst({
      where: { koperasiId: validatedData.koperasiId },
      orderBy: { createdAt: "desc" },
    });

    const lastNum = lastAnggota
      ? parseInt(lastAnggota.nomorAnggota.replace(/\D/g, ""))
      : 0;
    const nomorAnggota = `KDS-${String(lastNum + 1).padStart(3, "0")}`;

    const anggota = await prisma.anggota.create({
      data: {
        koperasiId: validatedData.koperasiId,
        nama: validatedData.nama,
        noHp: validatedData.noHp,
        nik: validatedData.nik || null,
        alamat: validatedData.alamat || null,
        nomorAnggota,
        tanggalMasuk: validatedData.tanggalMasuk
          ? new Date(validatedData.tanggalMasuk)
          : new Date(),
      },
    });

    // Auto-create Simpanan Pokok (FR-ANG-01)
    try {
      const pengguna = await prisma.pengguna.findFirst({
        where: { koperasiId: validatedData.koperasiId, role: "BENDAHARA" },
      });
      if (pengguna) {
        await prisma.simpanan.create({
          data: {
            koperasiId: validatedData.koperasiId,
            anggotaId: anggota.id,
            jenis: "POKOK",
            jenisTransaksi: "SETOR",
            jumlah: 100000,
            saldoSetelah: 100000,
            keterangan: "Simpanan pokok otomatis saat pendaftaran",
            dicatatOleh: pengguna.id,
            tanggalTransaksi: new Date(),
          },
        });
      }
    } catch (e) {
      console.warn("Auto simpanan pokok gagal:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Anggota berhasil ditambahkan",
      data: anggota,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data tidak valid", details: error.issues }, { status: 400 });
    }
    console.error("Create anggota error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}