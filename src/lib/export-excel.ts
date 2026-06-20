// Export data to CSV (Excel-compatible) format
// No external library needed - generates proper CSV that opens in Excel

export function exportToCSV(data: Record<string, any>[], filename: string, headers?: string[]) {
  if (data.length === 0) return;

  const keys = headers || Object.keys(data[0]);
  const headerRow = keys.join(",");

  const rows = data.map((row) =>
    keys
      .map((key) => {
        const value = row[key];
        if (value === null || value === undefined) return "";
        if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      })
      .join(",")
  );

  const csv = [headerRow, ...rows].join("\n");
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Format laporan buku kas for export
export function formatBukuKasExport(data: any[]) {
  return data.map((t, i) => ({
    "No": i + 1,
    "Tanggal": t.tanggal,
    "Keterangan": t.keterangan,
    "Masuk (Rp)": t.masuk,
    "Keluar (Rp)": t.keluar,
    "Saldo (Rp)": t.saldo,
  }));
}

// Format laporan simpanan for export
export function formatSimpananExport(data: any[]) {
  return data.map((a, i) => ({
    "No": i + 1,
    "No. Anggota": a.nomorAnggota,
    "Nama": a.nama,
    "Simpanan Pokok (Rp)": a.pokok,
    "Simpanan Wajib (Rp)": a.wajib,
    "Simpanan Sukarela (Rp)": a.sukarela,
    "Total (Rp)": a.total,
  }));
}

// Format laporan pinjaman for export
export function formatPinjamanExport(data: any[]) {
  return data.map((p, i) => ({
    "No": i + 1,
    "No. Pinjaman": p.nomorPinjaman,
    "Nama": p.nama,
    "Pokok (Rp)": p.jumlahPokok,
    "Angsuran": `${p.angsuranLunas}/${p.totalAngsuran}`,
    "Sisa Tagihan (Rp)": p.sisaTagihan,
    "Kolektibilitas": p.kolektibilitas,
    "Status": p.status,
  }));
}