import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");

    if (!koperasiId) {
      return NextResponse.json(
        { error: "koperasiId wajib diisi" },
        { status: 400 }
      );
    }

    const [
      totalAnggota,
      anggotaAktif,
      totalSimpanan,
      totalPinjamanAktif,
      pinjamanJatuhTempo,
      transaksiHariIni,
      kasMasuk,
      kasKeluar,
    ] = await Promise.all([
      prisma.anggota.count({ where: { koperasiId } }),
      prisma.anggota.count({ where: { koperasiId, status: "AKTIF" } }),
      prisma.simpanan.aggregate({
        where: { koperasiId, jenisTransaksi: "SETOR" },
        _sum: { jumlah: true },
      }),
      prisma.pinjaman.aggregate({
        where: { koperasiId, status: "AKTIF" },
        _sum: { jumlahPokok: true },
      }),
      prisma.angsuran.findMany({
        where: {
          pinjaman: { koperasiId, status: "AKTIF" },
          status: "BELUM",
          tanggalJatuhTempo: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
        include: { pinjaman: { include: { anggota: true } } },
        take: 10,
      }),
      prisma.simpanan.count({
        where: {
          koperasiId,
          tanggalTransaksi: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.kasUmum.aggregate({
        where: { koperasiId, jenis: "PEMASUKAN" },
        _sum: { jumlah: true },
      }),
      prisma.kasUmum.aggregate({
        where: { koperasiId, jenis: "PENGELUARAN" },
        _sum: { jumlah: true },
      }),
    ]);

    const totalSimpananPenarikan = await prisma.simpanan.aggregate({
      where: { koperasiId, jenisTransaksi: "TARIK" },
      _sum: { jumlah: true },
    });

    const netSimpanan =
      Number(totalSimpanan._sum.jumlah || 0) -
      Number(totalSimpananPenarikan._sum.jumlah || 0);

    const totalKas =
      Number(kasMasuk._sum.jumlah || 0) - Number(kasKeluar._sum.jumlah || 0);

    const totalAset = netSimpanan + totalKas;

    return NextResponse.json({
      success: true,
      data: {
        totalAnggota,
        anggotaAktif,
        totalSimpanan: netSimpanan,
        totalPinjamanBeredar: Number(totalPinjamanAktif._sum.jumlahPokok || 0),
        totalAset,
        transaksiHariIni,
        pinjamanJatuhTempo: pinjamanJatuhTempo.map((a) => ({
          id: a.id,
          ke: a.ke,
          tanggalJatuhTempo: a.tanggalJatuhTempo,
          jumlah: Number(a.jumlahPokok) + Number(a.jumlahBunga),
          anggotaNama: a.pinjaman.anggota.nama,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}