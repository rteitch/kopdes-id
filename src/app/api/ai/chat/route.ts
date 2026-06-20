import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah asisten AI untuk pengurus koperasi desa Indonesia. 
Tugas Anda adalah membantu pengurus koperasi memahami konsep koperasi, 
akuntansi sederhana, dan cara mengelola keuangan koperasi desa.

Aturan:
- Selalu jawab dalam Bahasa Indonesia yang sederhana dan mudah dipahami
- Gunakan contoh-contoh yang relevan dengan koperasi desa
- Jika ditanya tentang perhitungan, berikan langkah-langkah yang jelas
- Referensikan peraturan yang berlaku (UU No. 25/1992, SAK ETAP) jika relevan
- Berikan jawaban singkat dan praktis (maksimal 300 kata)

Topik yang bisa dijawab:
- Perbedaan simpanan pokok, wajib, dan sukarela
- Cara menghitung bunga pinjaman (flat dan menurun)
- Cara menghitung SHU (Sisa Hasil Usaha)
- Persiapan RAT (Rapat Anggota Tahunan)
- Standar pelaporan koperasi untuk Dinas Koperasi
- Tips mengelola keuangan koperasi desa
- Penjelasan tentang kesehatan koperasi`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan wajib diisi" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    // If no API key, return a demo response
    if (!apiKey || apiKey === "your-anthropic-api-key") {
      const demoResponse = getDemoResponse(message);
      return NextResponse.json({
        success: true,
        data: { response: demoResponse },
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", response.status);
      const demoResponse = getDemoResponse(message);
      return NextResponse.json({
        success: true,
        data: { response: demoResponse },
      });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Maaf, saya tidak bisa menjawab saat ini.";

    return NextResponse.json({
      success: true,
      data: { response: reply },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

function getDemoResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("simpanan pokok") || lower.includes("bedanya simpanan")) {
    return `**Jenis-jenis Simpanan Koperasi:**

1. **Simpanan Pokok** — Simpanan yang wajib dibayarkan oleh anggota saat pertama kali masuk. Besarannya sama untuk semua anggota dan tidak bisa ditarik selama masih menjadi anggota.

2. **Simpanan Wajib** — Simpanan yang harus dibayarkan setiap bulan oleh anggota. Besarannya ditetapkan dalam Anggaran Dasar (AD/ART). Tidak bisa ditarik selama menjadi anggota.

3. **Simpanan Sukarela** — Simpanan yang bisa disetor kapan saja dengan jumlah bebas. Simpanan ini **bisa ditarik** sewaktu-waktu sesuai kebutuhan anggota.

Contoh: Jika simpanan pokok Rp 100.000 dan simpanan wajib Rp 50.000/bulan, maka anggota yang bergabung di Januari dan sudah 6 bulan akan memiliki:
- Pokok: Rp 100.000
- Wajib: 6 × Rp 50.000 = Rp 300.000
- Total belum termasuk sukarela: Rp 400.000`;
  }

  if (lower.includes("bunga") && (lower.includes("flat") || lower.includes("hitung"))) {
    return `**Cara Menghitung Bunga Pinjaman:**

**Bunga Flat:**
Bunga dihitung dari pokok pinjaman awal, tetap setiap bulan.
Rumus: Bunga/bulan = (Pokok × % Bunga per tahun) ÷ 12

Contoh: Pinjaman Rp 10.000.000, bunga 12%/tahun, 12 bulan
- Bunga/bulan = (10.000.000 × 12%) ÷ 12 = Rp 100.000
- Angsuran pokok/bulan = 10.000.000 ÷ 12 = Rp 833.333
- Total angsuran/bulan = Rp 833.333 + Rp 100.000 = Rp 933.333

**Bunga Menurun:**
Bunga dihitung dari sisa pokok pinjaman. Jadi bunga semakin kecil tiap bulan.
- Bulan 1: Bunga = (10.000.000 × 12%) ÷ 12 = Rp 100.000
- Bulan 2: Bunga = (9.166.667 × 12%) ÷ 12 = Rp 91.667
- Dan seterusnya...

Bunga menurun lebih adil bagi peminjam karena total bunga yang dibayar lebih sedikit.`;
  }

  if (lower.includes("shu") || lower.includes("sisa hasil usaha")) {
    return `**Sisa Hasil Usaha (SHU):**

SHU adalah pendapatan koperasi yang sudah dikurangi biaya operasional, cadangan, dan dana lainnya.

**Cara Hitung SHU:**
1. Total Pendapatan Koperasi
2. - Biaya Operasional
3. - Cadangan Wajib (min. 20% dari sisa)
4. - Dana Pendidikan
5. = SHU yang akan dibagikan

**Pembagian SHU ke Anggota:**
Berdasarkan partisipasi anggota:
- Jasa simpanan (berapa banyak menabung)
- Jasa pinjaman (berapa banyak meminjam)
- Jasa usaha (berapa banyak bertransaksi dengan koperasi)

**Tips:** SHU harus disetujui dalam RAT (Rapat Anggota Tahunan) sebelum dibagikan.`;
  }

  return `Terima kasih atas pertanyaan Anda. Sebagai asisten koperasi desa, saya bisa membantu dengan:

- **Jenis-jenis simpanan** (pokok, wajib, sukarela)
- **Perhitungan bunga** pinjaman (flat/menurun)
- **Cara hitung SHU** (Sisa Hasil Usaha)
- **Persiapan RAT** (Rapat Anggota Tahunan)
- **Laporan keuangan** untuk Dinas Koperasi
- **Tips mengelola** keuangan koperasi

Silakan ajukan pertanyan spesifik tentang topik di atas!`;
}