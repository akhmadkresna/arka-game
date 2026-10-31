// Tata letak statis tanpa tumpang tindih: semua benda punya "jejak" lingkaran (FOOT).
import { rng } from './noise.js';
import { tinggi } from './terrain.js';
import { DESA, KANTOR, TPA, TPU, SPAWN, UMKM, jarakJalan } from './konfig.js';

export const FOOT = [];
const bentrok = (x, z, r, sela = 0) => FOOT.some(f => Math.hypot(f.x - x, f.z - z) < f.r + r + sela);
export const adaTempat = (x, z, r, sela = 0) => !bentrok(x, z, r, sela);
export function tambahJejak(x, z, r, n = '') { FOOT.push({ x, z, r, n }); }

export const BALIHO_AWAL = [
  { x: -30, z: 18, ry: 0.5 },
  { x: 32, z: 26, ry: -0.5, tema: 'EMAS UNTUK\nSEMUA (KECUALI ANDA)' },
  { x: 60, z: 24, ry: 0.2, tema: 'PAJAK ITU\nSUMBANGAN SUKARELA' },
];

// Benda tetap
tambahJejak(SPAWN.x, SPAWN.z, 5, 'spawn');
tambahJejak(KANTOR.x, KANTOR.z, 16, 'kantor');
tambahJejak(TPA.x, TPA.z, 22, 'tpa');
tambahJejak(TPU.x, TPU.z, 26, 'tpu');
for (let i = 0; i < 5; i++) tambahJejak(20 + i * 10, 0, 5, 'jembatan');
UMKM.forEach(u => tambahJejak(u.x, u.z, 5.5, u.nama));
BALIHO_AWAL.forEach((b, i) => tambahJejak(b.x, b.z, 6, 'baliho' + i));

// Desa: rumah, balai, lumbung, palem ditebar acak (benih tetap) tanpa bertabrakan dan menjauhi jalan
const acak = rng(777);
export const TATA = { desa: [] };
DESA.forEach((d, di) => {
  const t = { rumah: [], palem: [] };
  t.balai = { x: d.x, z: d.z - 30 }; tambahJejak(t.balai.x, t.balai.z, 9, 'balai' + di);
  t.lumbung = { x: d.x - 26, z: d.z - 24 }; tambahJejak(t.lumbung.x, t.lumbung.z, 4.5, 'lumbung' + di);
  const cariPos = (r, dMin, dMax) => {
    for (let k = 0; k < 500; k++) {
      const a = acak() * 6.283, rad = dMin + acak() * (dMax - dMin), x = d.x + Math.cos(a) * rad, z = d.z + Math.sin(a) * rad;
      if (!bentrok(x, z, r, 3) && jarakJalan(x, z) > r + 2 && tinggi(x, z) > 1) return { x, z, ry: Math.atan2(d.x - x, d.z - z) };
    }
    return null;
  };
  t.sekolah = cariPos(14, 24, 38); if (t.sekolah) tambahJejak(t.sekolah.x, t.sekolah.z, 14, 'sekolah' + di);
  if (di === 0) { t.puskesmas = cariPos(11, 24, 38); if (t.puskesmas) tambahJejak(t.puskesmas.x, t.puskesmas.z, 11, 'puskesmas'); }
  t.papan = { x: d.x - 46, z: d.z + 4 };
  for (let k = 0; k < 900 && t.rumah.length < 9; k++) {
    const a = acak() * 6.283, rad = 12 + acak() * 28, x = d.x + Math.cos(a) * rad, z = d.z + Math.sin(a) * rad;
    if (bentrok(x, z, 6.5, 2) || jarakJalan(x, z) < 10 || tinggi(x, z) < 1) continue;
    const tipe = t.rumah.length % 3;
    t.rumah.push({ x, z, tipe, ry: Math.round(acak() * 4) * Math.PI / 2 + (acak() - 0.5) * 0.4 });
    tambahJejak(x, z, 6.5, 'rumah');
  }
  for (let k = 0; k < 300 && t.palem.length < 7; k++) {
    const a = acak() * 6.283, rad = 10 + acak() * 34, x = d.x + Math.cos(a) * rad, z = d.z + Math.sin(a) * rad;
    if (bentrok(x, z, 1.8, 1) || jarakJalan(x, z) < 5) continue;
    t.palem.push({ x, z }); tambahJejak(x, z, 1.8, 'palem');
  }
  TATA.desa.push(t);
});
