// Tata letak statis tanpa tumpang tindih: semua benda punya "jejak" lingkaran (FOOT).
import { VILA, DESA, SAWAH, KANTOR, TPA, TPU, SPAWN, UMKM, JEMBATAN, sungaiX, titikJalanTerdekat } from './konfig.js';

export const FOOT = [];
const bentrok = (x, z, r, sela = 0) => FOOT.some(f => Math.hypot(f.x - x, f.z - z) < f.r + r + sela);
export const adaTempat = (x, z, r, sela = 0) => !bentrok(x, z, r, sela);
export function tambahJejak(x, z, r, n = '') { FOOT.push({ x, z, r, n }); }

// Baliho awal: berdiri di tepi jalan dan menghadap jalan
const hadapJalan = (x, z) => { const t = titikJalanTerdekat(x, z); return Math.round(Math.atan2(t.x - x, t.z - z) / (Math.PI / 2)) * Math.PI / 2; };
export const BALIHO_AWAL = [
  { x: 14, z: 20 }, { x: -32, z: 46, tema: 'EMAS UNTUK\nSEMUA (KECUALI ANDA)' }, { x: 94, z: 46, tema: 'PAJAK ITU\nSUMBANGAN SUKARELA' },
].map(b => ({ ...b, ry: hadapJalan(b.x, b.z) }));

// Benda tetap
tambahJejak(SPAWN.x, SPAWN.z, 5, 'spawn');
tambahJejak(KANTOR.x, KANTOR.z, 16, 'kantor');
tambahJejak(TPA.x, TPA.z, 22, 'tpa');
tambahJejak(TPU.x, TPU.z, 26, 'tpu');
tambahJejak(VILA.x, VILA.z, 18, 'vila');
for (let i = 0; i < 5; i++) tambahJejak(sungaiX(JEMBATAN.z) - 20 + i * 10, JEMBATAN.z, 5, 'jembatan');
UMKM.forEach(u => tambahJejak(u.x, u.z, 7, u.nama));
BALIHO_AWAL.forEach((b, i) => tambahJejak(b.x, b.z, 6, 'baliho' + i));

// Kampung: bangunan umum di sudut persimpangan, rumah berderet rapi di kiri-kanan jalan dan menghadap jalan
const dalamSawah = (x, z, m = 0) => SAWAH.some(s => Math.abs(x - s.x) < s.w / 2 + m && Math.abs(z - s.z) < s.d / 2 + m);
export const TATA = { desa: [] };
DESA.forEach((d, di) => {
  const t = { rumah: [], palem: [] };
  const taruh = (x, z, r, n) => { if (bentrok(x, z, r, 1) || dalamSawah(x, z, r)) return null; tambahJejak(x, z, r, n); return { x, z, ry: hadapJalan(x, z) }; };
  t.balai = { x: d.x + 24, z: d.z - 22 }; tambahJejak(t.balai.x, t.balai.z, 9, 'balai' + di);
  t.lumbung = { x: d.x - 22, z: d.z - 22 }; tambahJejak(t.lumbung.x, t.lumbung.z, 4.5, 'lumbung' + di);
  for (const [ox, oz] of [[-30, 32], [-30, 38], [-32, 46], [-30, -44], [30, 46], [30, -44]]) { t.sekolah = taruh(d.x + ox, d.z + oz, 14, 'sekolah' + di); if (t.sekolah) break; }
  if (di === 0) t.puskesmas = taruh(d.x + 32, d.z + 34, 11, 'puskesmas');
  if (t.puskesmas) { const q = t.puskesmas, f = [Math.sin(q.ry), Math.cos(q.ry)], r = [Math.cos(q.ry), -Math.sin(q.ry)]; tambahJejak(q.x + f[0] * 14 + r[0] * 9, q.z + f[1] * 14 + r[1] * 9, 5, 'parkir ambulans'); }
  t.papan = { x: d.x - 56, z: d.z + 8 };
  const kand = [];
  for (const ox of [-62, -51, -40, -29, 29, 40, 51, 62]) for (const oz of [-13, 13]) kand.push([d.x + ox, d.z + oz]);
  for (const oz of [-70, -58, -46, 46, 58, 70]) for (const ox of [-13, 13]) kand.push([d.x + ox, d.z + oz]);
  for (const [x, z] of kand) {
    if (t.rumah.length >= 14) break;
    const r = taruh(x, z, 5.5, 'rumah'); if (r) t.rumah.push({ ...r, tipe: t.rumah.length % 3 });
  }
  // palem berjajar rapi di pinggir jalan kampung
  for (const [x, z] of [[d.x - 9, d.z - 40], [d.x + 9, d.z - 40], [d.x - 9, d.z + 60], [d.x + 9, d.z + 60], [d.x - 62, d.z - 8], [d.x + 62, d.z - 8]]) {
    if (!bentrok(x, z, 1.8, 1) && !dalamSawah(x, z, 2)) { t.palem.push({ x, z }); tambahJejak(x, z, 1.8, 'palem'); }
  }
  TATA.desa.push(t);
});

// Rumah warga di kota barat: berderet di tepi jalan (jarak tetap dari sumbu jalan), menghadap jalan
tambahJejak(KANTOR.x, KANTOR.z + 20, 10, 'halaman kantor');
TATA.kota = [];
{
  const baris = [];
  for (let z = 56; z <= 160; z += 13) { baris.push([-63, z]); baris.push([-89, z]); }   // sisi dalam Jl. Kebun
  for (let z = 58; z <= 160; z += 13) { baris.push([13, z]); baris.push([-13, z]); }     // kedua sisi Jl. Raya
  for (let x = -62; x <= -14; x += 13) { baris.push([x, 108]); baris.push([x, 156]); }  // Jl. Selatan dan Jl. TPA
  for (const [x, z] of baris) {
    if (x < -80 || bentrok(x, z, 5.5, 1) || Math.abs(x - sungaiX(z)) < 30) continue;
    tambahJejak(x, z, 5.5, 'rumah'); TATA.kota.push({ x, z, ry: hadapJalan(x, z), tipe: TATA.kota.length % 3 });
  }
}
