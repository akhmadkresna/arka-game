// Tata letak pulau fiksi "Nusa Kencana". Semua nama tempat rekaan.
export const R = 320;
export const SUNGAI = { dasar: 40, amp: 30, per: 70, lebar: 12 };
export const sungaiX = z => SUNGAI.dasar + SUNGAI.amp * Math.sin(z / SUNGAI.per);
export const KOLOM = 5, BARIS = 4, JARAK = 28, UKURAN = 24;
// Titik awal (pojok) tiap zona hutan: Hutan Barat Laut, Hutan Barat Daya, Hutan Timur Laut
export const ZONA = [{ x: -220, z: -120, nama: 'Hutan Lindung (Katanya)' }, { x: -220, z: 20, nama: 'Hutan Adat Sementara' }, { x: 70, z: -200, nama: 'Hutan Produksi Abadi' }];
export const pusatZona = z => ({ x: z.x + (KOLOM - 1) * JARAK / 2, z: z.z + (BARIS - 1) * JARAK / 2 });
export const DESA = [{ x: 150, z: 10, nama: 'DESA MAKMUR\nSENTOSA' }, { x: 190, z: 110, nama: 'DESA SUKAMAJU' }];
export const SAWAH = [{ x: 105, z: 60, w: 44, d: 30 }, { x: 150, z: 75, w: 40, d: 26 }, { x: 100, z: -30, w: 34, d: 26 }];
export const TPA = { x: -40, z: 170 };
export const KANTOR = { x: 26, z: 62 };
// Tempat Pemakaman Umum (TPU) dan lahan strategis Koperasi di sebelahnya (Koperasi di sini bercuan besar)
export const TPU = { x: -62, z: -52 };
export const ZONA_EMAS = { x: -22, z: -52, r: 11 };
export const SPAWN = { x: 0, z: 30 };
export const JEMBATAN = { z: 0, panjang: 46, lebar: 8, tinggi: 2.6 };
export const TITIK_BEBAS = { x: 70, z: -70 };
export const JALAN = [
  [[0, 30], [20, 8], [sungaiX(0), 0], [95, 4], [150, 10]],
  [[150, 10], [165, 60], [190, 110]],
  [[0, 30], [0, 60], [-20, 120], [-40, 170]],
  [[0, 30], [-50, 12], [-105, -8], [-105, 40]],
  [[sungaiX(0) + 20, 2], [90, -40], [120, -150], [126, -180]],
  [[-50, 12], [-36, -20], [-38, -44]],            // spur ke TPU dan lahan Koperasi
  [[-50, 12], [-72, 50], [-58, 92], [-20, 120]],  // jalan lingkar barat, tembus ke jalan utara-selatan
];
export function jarakKeSegmen(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l2));
  return Math.hypot(px - (ax + t * dx), pz - (az + t * dz));
}
export function jarakJalan(x, z) {
  let m = 1e9;
  for (const j of JALAN) for (let i = 0; i < j.length - 1; i++) m = Math.min(m, jarakKeSegmen(x, z, j[i][0], j[i][1], j[i + 1][0], j[i + 1][1]));
  return m;
}

export function titikJalanTerdekat(px, pz) {
  let m = 1e9, hasil = { x: px, z: pz };
  for (const j of JALAN) for (let i = 0; i < j.length - 1; i++) {
    const [ax, az] = j[i], [bx, bz] = j[i + 1], dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz || 1;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l2)), x = ax + t * dx, z = az + t * dz, d = Math.hypot(px - x, pz - z);
    if (d < m) { m = d; hasil = { x, z }; }
  }
  return hasil;
}
// UMKM yang bisa "ditarik pajak". tipe pemilik: ramah | biasa | galak. dasar = kisaran hasil dasar (Cuan).
export const PELUANG = { ramah: 0.85, biasa: 0.6, galak: 0.3 };
export const UMKM = [
  { x: -10, z: 44, nama: 'WARUNG BU TINI', tipe: 'ramah', dasar: 30 },
  { x: 22, z: 24, nama: 'BAKSO MAS JOKO', tipe: 'biasa', dasar: 25 },
  { x: -15, z: 78, nama: 'FOTOKOPI & ATK MAJU', tipe: 'biasa', dasar: 30 },
  { x: 8, z: 84, nama: 'TAMBAL BAN 24 JAM', tipe: 'galak', dasar: 45 },
  { x: -60, z: 16, nama: 'WARTEG BAHARI', tipe: 'biasa', dasar: 30 },
  { x: -82, z: 52, nama: 'KIOS PULSA CEPAT', tipe: 'ramah', dasar: 25 },
  { x: 76, z: 12, nama: 'BENGKEL PAK UDIN', tipe: 'galak', dasar: 55 },
  { x: 122, z: -2, nama: 'TOKO KELONTONG SINAR', tipe: 'biasa', dasar: 40 },
  { x: 168, z: 36, nama: 'ANGKRINGAN MALAM', tipe: 'ramah', dasar: 30 },
  { x: 158, z: -1, nama: 'SALON MBAK RINI', tipe: 'galak', dasar: 50 },
  { x: 202, z: 97, nama: 'WARUNG MAK ENDANG', tipe: 'ramah', dasar: 30 },
  { x: 181, z: 121, nama: 'BAKSO PAK WARSO', tipe: 'biasa', dasar: 28 },
  { x: -17, z: 144, nama: 'WARUNG PEMULUNG SEJAHTERA', tipe: 'biasa', dasar: 25 },
  { x: -10, z: 114, nama: 'KIOS KOPI KENANGAN', tipe: 'ramah', dasar: 30 },
];
