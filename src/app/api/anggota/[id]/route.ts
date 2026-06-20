import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const anggota = await prisma.anggota.findUnique({
      where: { id: params.id },
      include: {
        simpanan: { orderBy: { createdAt: "desc" }, take: 50 },
        pinjaman: {
          include: { angsuran: { orderBy: { ke: "asc" } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!anggota) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }

    const totalSimpananSetor = anggota.simpanan
      .filter((s) => s.jenisTransaksi === "SETOR")
      .reduce((acc, s) => acc + Number(s.jumlah), 0);
    const totalSimpananTarik = anggota.simpanan
      .filter((s) => s.jenisTransaksi === "TARIK")
      .reduce((acc, s) => acc + Number(s.jumlah), 0);

    return NextResponse.json({
      success: true,
      data: {
        ...anggota,
        totalSimpanan: totalSimpananSetor - totalSimpananTarik,
        simpanan: anggota.simpanan.map((s) => ({
          ...s,
          jumlah: Number(s.jumlah),
          saldoSetelah: s.saldoSetelah ? Number(s.saldoSetelah) : null,
        })),
        pinjaman: anggota.pinjaman.map((p) => ({
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
      },
    });
  } catch (error) {
    console.error("Get anggota detail error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const anggota = await prisma.anggota.update({
      where: { id: params.id },
      data: {
        nama: body.nama,
        noHp: body.noHp,
        nik: body.nik,
        alamat: body.alamat,
        status: body.status,
      },
    });
    return NextResponse.json({ success: true, data: anggota });
  } catch (error) {
    console.error("Update anggota error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}