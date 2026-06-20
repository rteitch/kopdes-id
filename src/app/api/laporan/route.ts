import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");
    const jenis = searchParams.get("jenis") || "buku-kas";
    const bulan = parseInt(searchParams.get("bulan") || String(new Date().getMonth() + 1));
    const tahun = parseInt(searchParams.get("tahun") || String(new Date().getFullYear()));

    if (!koperasiId) {
      return NextResponse.json({ error: "koperasiId wajib" }, { status: 400 });
    }

    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0, 23, 59, 59);

    if (jenis === "buku-kas") {
      const [simpanan, kasUmum] = await Promise.all([
        prisma.simpanan.findMany({
          where: { koperasiId, tanggalTransaksi: { gte: startDate, lte: endDate } },
          include: { anggota: { select: { nama: true, nomorAnggota: true } } },
          orderBy: { tanggalTransaksi: "asc" },
        }),
        prisma.kasUmum.findMany({
          where: { koperasiId, tanggalTransaksi: { gte: startDate, lte: endDate } },
          orderBy: { tanggalTransaksi: "asc" },
        }),
      ]);

      const transaksi = [
        ...simpanan.map((s) => ({
          tanggal: s.tanggalTransaksi,
          keterangan: `Simpanan ${s.jenis} ${s.jenisTransaksi} - ${s.anggota.nama}`,
          masuk: s.jenisTransaksi === "SETOR" ? Number(s.jumlah) : 0,
          keluar: s.jenisTransaksi === "TARIK" ? Number(s.jumlah) : 0,
        })),
        ...kasUmum.map((k) => ({
          tanggal: k.tanggalTransaksi,
          keterangan: k.keterangan || k.kategori,
          masuk: k.jenis === "PEMASUKAN" ? Number(k.jumlah) : 0,
          keluar: k.jenis === "PENGELUARAN" ? Number(k.jumlah) : 0,
        })),
      ].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

      let saldo = 0;
      const dataWithSaldo = transaksi.map((t) => {
        saldo += t.masuk - t.keluar;
        return { ...t, saldo };
      });

      return NextResponse.json({
        success: true,
        data: {
          periode: `${bulan}/${tahun}`,
          transaksi: dataWithSaldo,
          totalMasuk: transaksi.reduce((a, t) => a + t.masuk, 0),
          totalKeluar: transaksi.reduce((a, t) => a + t.keluar, 0),
          saldoAkhir: saldo,
        },
      });
    }

    if (jenis === "simpanan") {
      const anggota = await prisma.anggota.findMany({
        where: { koperasiId, status: "AKTIF" },
        include: {
          simpanan: {
            where: { tanggalTransaksi: { gte: startDate, lte: endDate } },
          },
        },
      });

      const data = anggota.map((a) => {
        const pokok = a.simpanan.filter((s) => s.jenis === "POKOK").reduce((acc, s) => s.jenisTransaksi === "SETOR" ? acc + Number(s.jumlah) : acc - Number(s.jumlah), 0);
        const wajib = a.simpanan.filter((s) => s.jenis === "WAJIB").reduce((acc, s) => s.jenisTransaksi === "SETOR" ? acc + Number(s.jumlah) : acc - Number(s.jumlah), 0);
        const sukarela = a.simpanan.filter((s) => s.jenis === "SUKARELA").reduce((acc, s) => s.jenisTransaksi === "SETOR" ? acc + Number(s.jumlah) : acc - Number(s.jumlah), 0);
        return {
          nomorAnggota: a.nomorAnggota,
          nama: a.nama,
          pokok,
          wajib,
          sukarela,
          total: pokok + wajib + sukarela,
        };
      });

      return NextResponse.json({
        success: true,
        data: { periode: `${bulan}/${tahun}`, anggota: data, totalKeseluruhan: data.reduce((a, d) => a + d.total, 0) },
      });
    }

    if (jenis === "pinjaman") {
      const pinjaman = await prisma.pinjaman.findMany({
        where: { koperasiId },
        include: {
          anggota: { select: { nama: true, nomorAnggota: true } },
          angsuran: true,
        },
      });

      const data = pinjaman.map((p) => {
        const totalBayar = p.angsuran.filter((a) => a.status === "LUNAS").reduce((acc, a) => acc + Number(a.jumlahBayar || 0), 0);
        const sisaTagihan = Number(p.jumlahPokok) + p.angsuran.reduce((acc, a) => acc + Number(a.jumlahBunga), 0) - totalBayar;
        const angsuranLunas = p.angsuran.filter((a) => a.status === "LUNAS").length;

        return {
          nomorPinjaman: p.nomorPinjaman,
          nama: p.anggota.nama,
          jumlahPokok: Number(p.jumlahPokok),
          status: p.status,
          angsuranLunas,
          totalAngsuran: p.jangkaWaktu,
          sisaTagihan: Math.max(0, sisaTagihan),
        };
      });

      return NextResponse.json({
        success: true,
        data: { periode: `${bulan}/${tahun}`, pinjaman: data, totalPeminjaman: data.reduce((a, d) => a + d.jumlahPokok, 0) },
      });
    }

    return NextResponse.json({ error: "Jenis laporan tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Laporan error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}