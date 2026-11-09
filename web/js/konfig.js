// Tata letak pulau fiksi "Nusa Kencana". Semua nama tempat rekaan.
export const R = 320;
export const SUNGAI = { dasar: 40, amp: 30, per: 70, lebar: 12 };
export const sungaiX = z => SUNGAI.dasar + SUNGAI.amp * Math.sin(z / SUNGAI.per);
export const KOLOM = 5, BARIS = 4, JARAK = 28, UKURAN = 24;
// Titik awal (pojok) tiap zona hutan: Hutan Barat Laut, Hutan Barat Daya, Hutan Timur Laut
export const ZONA = [{ x: -220, z: -120, nama: 'Hutan Lindung (Katanya)' }, { x: -220, z: 20, nama: 'Hutan Adat Sementara' }, { x: 70, z: -200, nama: 'Hutan Produksi Abadi' }];
export const pusatZona = z => ({ x: z.x + (KOLOM - 1) * JARAK / 2, z: z.z + (BARIS - 1) * JARAK / 2 });
// Pusat kampung (jalan lurus bersilang di titik ini). Kota barat dan kampung timur dibangun di atas lahan datar.
export const DESA = [{ x: 150, z: 32, nama: 'DESA MAKMUR\nSENTOSA' }, { x: 150, z: 128, nama: 'DESA SUKAMAJU' }];
export const SAWAH = [{ x: 118, z: 90, w: 40, d: 22 }, { x: 182, z: 90, w: 40, d: 22 }, { x: 108, z: -24, w: 40, d: 22 }, { x: 192, z: -24, w: 40, d: 22 }];
// Kawasan datar: pusat (x,z) dan setengah lebar (rx, rz)
export const KOTA = { x: -36, z: 76, rx: 56, rz: 104 };
export const KAMPUNG = { x: 150, z: 80, rx: 60, rz: 114 };
export const TINGGI_DATAR = 2.6;
export const dalamKawasan = (x, z, m = 0) => [KOTA, KAMPUNG].some(k => Math.abs(x - k.x) < k.rx + m && Math.abs(z - k.z) < k.rz + m);
export const TPA = { x: -36, z: 198 };
export const KANTOR = { x: -37, z: 68 };
// Tempat Pemakaman Umum (TPU) dan lahan strategis Koperasi di sebelahnya (Koperasi di sini bercuan besar)
export const TPU = { x: -48, z: -14 };
export const ZONA_EMAS = { x: -16, z: -12, r: 11 };
export const SPAWN = { x: -10, z: 24 };
export const JEMBATAN = { z: 32, panjang: 46, lebar: 8, tinggi: 2.6 };
// Vila Pak Sigap (eks kepala polisi), di sisi selatan Jl. Hutan Timur, menghadap utara ke jalan
export const VILA = { x: 178, z: -60 };
export const TITIK_BEBAS = { x: 70, z: -66 };
// Jalan: garis lurus sejajar sumbu (kisi). Titik sambung antarjalan harus persis sama agar persimpangan terbentuk.
export const JALAN = [
  [[-76, 32], [-48, 32], [0, 32], [150, 32], [198, 32]],       // 0 Jl. Utama (melintasi jembatan)
  [[150, -84], [150, 32], [150, 128], [150, 168]],              // 1 Jl. Kampung (utara-selatan)
  [[0, -32], [0, 32], [0, 96], [0, 168]],                       // 2 Jl. Raya
  [[-76, -128], [-76, 32], [-76, 96], [-76, 168]],              // 3 Jl. Kebun (di tepi timur kebun sawit)
  [[70, -84], [150, -84], [178, -84], [210, -84]],                          // 4 Jl. Hutan Timur (di tepi selatan kebun)
  [[-76, 96], [0, 96]],                                         // 5 Jl. Selatan
  [[-76, 168], [-36, 168], [0, 168]],                           // 6 Jl. TPA
  [[102, 128], [150, 128], [198, 128]],                         // 7 Jl. Sukamaju
  [[-48, 32], [-48, 6]],                                        // 8 jalan masuk TPU
  [[-36, 168], [-36, 178]],                                     // 9 jalan masuk TPA
  [[178, -84], [178, -70]],                                     // 10 jalan masuk vila
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
  { x: -22, z: 20, nama: 'WARUNG BU TINI', tipe: 'ramah', dasar: 30 },
  { x: -12, z: 60, nama: 'BAKSO MAS JOKO', tipe: 'biasa', dasar: 25 },
  { x: 12, z: 60, nama: 'FOTOKOPI & ATK MAJU', tipe: 'biasa', dasar: 30 },
  { x: 12, z: 84, nama: 'TAMBAL BAN 24 JAM', tipe: 'galak', dasar: 45 },
  { x: -62, z: 20, nama: 'WARTEG BAHARI', tipe: 'biasa', dasar: 30 },
  { x: -62, z: 44, nama: 'KIOS PULSA CEPAT', tipe: 'ramah', dasar: 25 },
  { x: 96, z: 20, nama: 'BENGKEL PAK UDIN', tipe: 'galak', dasar: 55 },
  { x: 118, z: 20, nama: 'TOKO KELONTONG SINAR', tipe: 'biasa', dasar: 40 },
  { x: 180, z: 44, nama: 'ANGKRINGAN MALAM', tipe: 'ramah', dasar: 30 },
  { x: 180, z: 20, nama: 'SALON MBAK RINI', tipe: 'galak', dasar: 50 },
  { x: 180, z: 140, nama: 'WARUNG MAK ENDANG', tipe: 'ramah', dasar: 30 },
  { x: 120, z: 140, nama: 'BAKSO PAK WARSO', tipe: 'biasa', dasar: 28 },
  { x: -12, z: 146, nama: 'WARUNG PEMULUNG SEJAHTERA', tipe: 'biasa', dasar: 25 },
  { x: -12, z: 110, nama: 'KIOS KOPI KENANGAN', tipe: 'ramah', dasar: 30 },
];
