import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo koperasi
  const koperasi = await prisma.koperasi.create({
    data: {
      nama: "Kopdes Merah Putih Desa Sukomulyo",
      noBadanHukum: "BH-2025-001",
      desa: "Sukomulyo",
      kecamatan: "Grobogan",
      kabupaten: "Grobogan",
      provinsi: "Jawa Tengah",
    },
  });

  console.log(`✅ Koperasi created: ${koperasi.nama} (${koperasi.id})`);

  // Create pengguna (ketua)
  const ketua = await prisma.pengguna.create({
    data: {
      koperasiId: koperasi.id,
      nama: "Hadi Santoso",
      noHp: "081234567890",
      role: "KETUA",
    },
  });

  // Create bendahara
  const bendahara = await prisma.pengguna.create({
    data: {
      koperasiId: koperasi.id,
      nama: "Sari Rahayu",
      noHp: "081234567891",
      role: "BENDAHARA",
    },
  });

  console.log(`✅ Users created: ${ketua.nama} (Ketua), ${bendahara.nama} (Bendahara)`);

  // Create anggota
  const anggotaData = [
    { nama: "Budi Hartono", noHp: "081234567801", alamat: "RT 01/RW 02" },
    { nama: "Dewi Lestari", noHp: "081234567802", alamat: "RT 02/RW 01" },
    { nama: "Eko Prasetyo", noHp: "081234567803", alamat: "RT 01/RW 03" },
    { nama: "Fitri Wulandari", noHp: "081234567804", alamat: "RT 03/RW 02" },
    { nama: "Gunawan Setiawan", noHp: "081234567805", alamat: "RT 02/RW 03" },
  ];

  const anggotaList = [];
  for (let i = 0; i < anggotaData.length; i++) {
    const anggota = await prisma.anggota.create({
      data: {
        koperasiId: koperasi.id,
        nomorAnggota: `KDS-${String(i + 1).padStart(3, "0")}`,
        nama: anggotaData[i].nama,
        noHp: anggotaData[i].noHp,
        alamat: anggotaData[i].alamat,
        tanggalMasuk: new Date("2025-07-12"),
      },
    });
    anggotaList.push(anggota);
  }

  console.log(`✅ ${anggotaList.length} anggota created`);

  // Create simpanan for each anggota
  for (const anggota of anggotaList) {
    // Simpanan Pokok (sekali)
    await prisma.simpanan.create({
      data: {
        koperasiId: koperasi.id,
        anggotaId: anggota.id,
        jenis: "POKOK",
        jenisTransaksi: "SETOR",
        jumlah: 100000,
        saldoSetelah: 100000,
        dicatatOleh: bendahara.id,
        tanggalTransaksi: new Date("2025-07-12"),
      },
    });

    // Simpanan Wajib (3 bulan)
    let saldo = 100000;
    for (let bulan = 0; bulan < 3; bulan++) {
      saldo += 50000;
      const tgl = new Date(2025, 7 + bulan, 15);
      await prisma.simpanan.create({
        data: {
          koperasiId: koperasi.id,
          anggotaId: anggota.id,
          jenis: "WAJIB",
          jenisTransaksi: "SETOR",
          jumlah: 50000,
          saldoSetelah: saldo,
          dicatatOleh: bendahara.id,
          tanggalTransaksi: tgl,
        },
      });
    }

    // Simpanan Sukarela for some
    if (Math.random() > 0.5) {
      saldo += 200000;
      await prisma.simpanan.create({
        data: {
          koperasiId: koperasi.id,
          anggotaId: anggota.id,
          jenis: "SUKARELA",
          jenisTransaksi: "SETOR",
          jumlah: 200000,
          saldoSetelah: saldo,
          dicatatOleh: bendahara.id,
          tanggalTransaksi: new Date("2025-09-01"),
        },
      });
    }
  }

  console.log("✅ Simpanan created for all anggota");

  // Create a pinjaman
  const pinjamanAnggota = anggotaList[0];
  const pinjaman = await prisma.pinjaman.create({
    data: {
      koperasiId: koperasi.id,
      anggotaId: pinjamanAnggota.id,
      nomorPinjaman: "PIN-2025-001",
      jumlahPokok: 5000000,
      bungaPersen: 12,
      jenisBunga: "FLAT",
      jangkaWaktu: 12,
      tanggalCair: new Date("2025-08-01"),
      tanggalJatuhTempo: new Date("2026-08-01"),
      tujuan: "Modal usaha warung",
    },
  });

  // Create angsuran
  const pokokPerBulan = 5000000 / 12;
  const bungaPerBulan = (5000000 * 0.12) / 12;
  for (let i = 1; i <= 12; i++) {
    const jatuhTempo = new Date(2025, 8 + i, 1);
    await prisma.angsuran.create({
      data: {
        pinjamanId: pinjaman.id,
        ke: i,
        tanggalJatuhTempo: jatuhTempo,
        jumlahPokok: pokokPerBulan,
        jumlahBunga: bungaPerBulan,
        status: i <= 3 ? "LUNAS" : "BELUM",
        jumlahBayar: i <= 3 ? pokokPerBulan + bungaPerBulan : null,
        tanggalBayar: i <= 3 ? jatuhTempo : null,
      },
    });
  }

  console.log("✅ Pinjaman and angsuran created");

  // Kas Umum
  await prisma.kasUmum.create({
    data: {
      koperasiId: koperasi.id,
      jenis: "PEMASUKAN",
      kategori: "jasa_pinjaman",
      jumlah: 180000,
      keterangan: "Jasa pinjaman bulan Agustus-Oktober",
      dicatatOleh: bendahara.id,
      tanggalTransaksi: new Date("2025-10-15"),
    },
  });

  await prisma.kasUmum.create({
    data: {
      koperasiId: koperasi.id,
      jenis: "PENGELUARAN",
      kategori: "operasional",
      jumlah: 250000,
      keterangan: "Biaya ATK dan operasional kantor",
      dicatatOleh: bendahara.id,
      tanggalTransaksi: new Date("2025-10-01"),
    },
  });

  console.log("✅ Kas umum created");
  console.log(`\n🎉 Seed complete!`);
  console.log(`\n📋 Login credentials:`);
  console.log(`   Ketua: 081234567890`);
  console.log(`   Bendahara: 081234567891`);
  console.log(`   (OTP akan ditampilkan otomatis di demo mode)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });