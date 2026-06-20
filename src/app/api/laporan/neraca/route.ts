import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");

    if (!koperasiId) {
      return NextResponse.json({ error: "koperasiId wajib" }, { status: 400 });
    }

    // ASET
    const [totalSimpananSetor, totalSimpananTarik, totalPinjamanAktif, kasMasuk, kasKeluar] =
      await Promise.all([
        prisma.simpanan.aggregate({
          where: { koperasiId, jenisTransaksi: "SETOR" },
          _sum: { jumlah: true },
        }),
        prisma.simpanan.aggregate({
          where: { koperasiId, jenisTransaksi: "TARIK" },
          _sum: { jumlah: true },
        }),
        prisma.pinjaman.aggregate({
          where: { koperasiId, status: "AKTIF" },
          _sum: { jumlahPokok: true },
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

    // Calculate angsuran already paid for pinjaman aktif
    const angsuranPaid = await prisma.angsuran.aggregate({
      where: {
        pinjaman: { koperasiId, status: "AKTIF" },
        status: "LUNAS",
      },
      _sum: { jumlahBayar: true },
    });

    const simpananAnggota =
      Number(totalSimpananSetor._sum.jumlah || 0) -
      Number(totalSimpananTarik._sum.jumlah || 0);

    const pinjamanBersih =
      Number(totalPinjamanAktif._sum.jumlahPokok || 0) -
      Number(angsuranPaid._sum.jumlahBayar || 0);

    const kasKoperasi =
      Number(kasMasuk._sum.jumlah || 0) -
      Number(kasKeluar._sum.jumlah || 0);

    const totalAset = Math.max(0, pinjamanBersih) + Math.max(0, kasKoperasi);

    // KEWAJIBAN & MODAL
    // Simpanan anggota = kewajiban (harus dikembalikan)
    // Modal koperasi = kas bersih - kewajiban
    const totalKewajiban = simpananAnggota;
    const modalKoperasi = totalAset - totalKewajiban;

    return NextResponse.json({
      success: true,
      data: {
        aset: {
          kasDanBank: Math.max(0, kasKoperasi),
          piutangPinjaman: Math.max(0, pinjamanBersih),
          total: totalAset,
        },
        kewajiban: {
          simpananAnggota,
          total: totalKewajiban,
        },
        modal: {
          modalDisetor: Math.max(0, modalKoperasi),
          total: Math.max(0, modalKoperasi),
        },
        totalKewajibanDanModal: totalKewajiban + Math.max(0, modalKoperasi),
        balanced: Math.abs(totalAset - (totalKewajiban + Math.max(0, modalKoperasi))) < 1,
      },
    });
  } catch (error) {
    console.error("Neraca error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}