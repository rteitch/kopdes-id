import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");
    const tahun = parseInt(searchParams.get("tahun") || String(new Date().getFullYear()));

    if (!koperasiId) {
      return NextResponse.json({ error: "koperasiId wajib" }, { status: 400 });
    }

    const startDate = new Date(tahun, 0, 1);
    const endDate = new Date(tahun, 11, 31, 23, 59, 59);

    // Calculate total income
    const [kasMasuk, kasKeluar, jasaPinjaman] = await Promise.all([
      prisma.kasUmum.aggregate({
        where: { koperasiId, jenis: "PEMASUKAN", tanggalTransaksi: { gte: startDate, lte: endDate } },
        _sum: { jumlah: true },
      }),
      prisma.kasUmum.aggregate({
        where: { koperasiId, jenis: "PENGELUARAN", tanggalTransaksi: { gte: startDate, lte: endDate } },
        _sum: { jumlah: true },
      }),
      prisma.angsuran.aggregate({
        where: {
          pinjaman: { koperasiId },
          status: "LUNAS",
          tanggalBayar: { gte: startDate, lte: endDate },
        },
        _sum: { jumlahBunga: true, jumlahDenda: true },
      }),
    ]);

    const totalPendapatan =
      Number(kasMasuk._sum.jumlah || 0) +
      Number(jasaPinjaman._sum.jumlahBunga || 0) +
      Number(jasaPinjaman._sum.jumlahDenda || 0);

    const totalBiaya = Number(kasKeluar._sum.jumlah || 0);
    const labaKotor = totalPendapatan - totalBiaya;

    // SHU allocation
    const cadanganWajib = labaKotor * 0.2; // min 20%
    const danaPendidikan = labaKotor * 0.05; // 5%
    const danaSosial = labaKotor * 0.05; // 5%
    const shuBersih = labaKotor - cadanganWajib - danaPendidikan - danaSosial;

    // Get anggota participation
    const anggota = await prisma.anggota.findMany({
      where: { koperasiId, status: "AKTIF" },
      include: {
        simpanan: {
          where: { tanggalTransaksi: { gte: startDate, lte: endDate }, jenisTransaksi: "SETOR" },
        },
        pinjaman: {
          where: { tanggalCair: { gte: startDate, lte: endDate } },
        },
      },
    });

    const totalSimpananAll = anggota.reduce((acc, a) => {
      return acc + a.simpanan.reduce((s, sim) => s + Number(sim.jumlah), 0);
    }, 0);

    const totalPinjamanAll = anggota.reduce((acc, a) => {
      return acc + a.pinjaman.reduce((p, pin) => p + Number(pin.jumlahPokok), 0);
    }, 0);

    const shuPerAnggota = anggota.map((a) => {
      const jasaSimpanan = a.simpanan.reduce((s, sim) => s + Number(sim.jumlah), 0);
      const jasaPinjamanAnggota = a.pinjaman.reduce((p, pin) => p + Number(pin.jumlahPokok), 0);

      // SHU based on participation ratio
      const rasioSimpanan = totalSimpananAll > 0 ? jasaSimpanan / totalSimpananAll : 0;
      const rasioPinjaman = totalPinjamanAll > 0 ? jasaPinjamanAnggota / totalPinjamanAll : 0;

      // 60% from savings, 40% from loans
      const shuAnggota = shuBersih * (rasioSimpanan * 0.6 + rasioPinjaman * 0.4);

      return {
        nama: a.nama,
        nomorAnggota: a.nomorAnggota,
        totalSimpanan: jasaSimpanan,
        totalPinjaman: jasaPinjamanAnggota,
        rasioPartisipasi: rasioSimpanan * 0.6 + rasioPinjaman * 0.4,
        shu: Math.max(0, Math.round(shuAnggota)),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        tahun,
        laporan: {
          totalPendapatan,
          totalBiaya,
          labaKotor,
          cadanganWajib: Math.round(cadanganWajib),
          danaPendidikan: Math.round(danaPendidikan),
          danaSosial: Math.round(danaSosial),
          shuBersih: Math.round(shuBersih),
        },
        anggota: shuPerAnggota.sort((a, b) => b.shu - a.shu),
      },
    });
  } catch (error) {
    console.error("SHU error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}