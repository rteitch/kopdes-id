import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const koperasiId = searchParams.get("koperasiId");
    const noHp = searchParams.get("noHp");

    if (!koperasiId || !noHp) {
      return NextResponse.json(
        { error: "koperasiId dan noHp wajib diisi" },
        { status: 400 }
      );
    }

    const anggota = await prisma.anggota.findFirst({
      where: { koperasiId, noHp },
      include: {
        simpanan: {
          orderBy: { tanggalTransaksi: "desc" },
          take: 30,
        },
        pinjaman: {
          where: { status: "AKTIF" },
          include: {
            angsuran: {
              orderBy: { ke: "asc" },
            },
          },
        },
      },
    });

    if (!anggota) {
      return NextResponse.json(
        { error: "Anggota tidak ditemukan" },
        { status: 404 }
      );
    }

    const totalSimpananSetor = anggota.simpanan
      .filter((s) => s.jenisTransaksi === "SETOR")
      .reduce((acc, s) => acc + Number(s.jumlah), 0);
    const totalSimpananTarik = anggota.simpanan
      .filter((s) => s.jenisTransaksi === "TARIK")
      .reduce((acc, s) => acc + Number(s.jumlah), 0);

    const simpananPokok = anggota.simpanan
      .filter((s) => s.jenis === "POKOK" && s.jenisTransaksi === "SETOR")
      .reduce((acc, s) => acc + Number(s.jumlah), 0);
    const simpananWajib = anggota.simpanan
      .filter((s) => s.jenis === "WAJIB")
      .reduce((acc, s) => s.jenisTransaksi === "SETOR" ? acc + Number(s.jumlah) : acc - Number(s.jumlah), 0);
    const simpananSukarela = anggota.simpanan
      .filter((s) => s.jenis === "SUKARELA")
      .reduce((acc, s) => s.jenisTransaksi === "SETOR" ? acc + Number(s.jumlah) : acc - Number(s.jumlah), 0);

    return NextResponse.json({
      success: true,
      data: {
        nama: anggota.nama,
        nomorAnggota: anggota.nomorAnggota,
        status: anggota.status,
        tanggalMasuk: anggota.tanggalMasuk,
        simpanan: {
          pokok: simpananPokok,
          wajib: simpananWajib,
          sukarela: simpananSukarela,
          total: totalSimpananSetor - totalSimpananTarik,
        },
        riwayat: anggota.simpanan.slice(0, 10).map((s) => ({
          tanggal: s.tanggalTransaksi,
          jenis: s.jenis,
          tipe: s.jenisTransaksi,
          jumlah: Number(s.jumlah),
        })),
        pinjaman: anggota.pinjaman.map((p) => ({
          nomorPinjaman: p.nomorPinjaman,
          jumlahPokok: Number(p.jumlahPokok),
          status: p.status,
          angsuran: p.angsuran.map((a) => ({
            ke: a.ke,
            tanggalJatuhTempo: a.tanggalJatuhTempo,
            jumlah: Number(a.jumlahPokok) + Number(a.jumlahBunga),
            status: a.status,
          })),
        })),
      },
    });
  } catch (error) {
    console.error("Portal anggota error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}