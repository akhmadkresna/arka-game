// Republik Emas (anti stunting): irisan dunia terbuka, kamera orang ketiga.
import * as THREE from '../vendor/three.module.js';
import { MONOLOG, BLOKIR, LOKASI, KARTU_AKHIR } from './teks.js';

// ---------- Konstanta ----------
const DETIK_PER_BULAN = 30;
const BULAN_TOTAL = 12;
const RADIUS_PULAU = 220;
const UKURAN_PETAK = 24;
const JARAK_PETAK = 28;
const KOLOM = 5, BARIS = 4;
const ASAL_X = -180, ASAL_Z = -50;
const DESA = [{ x: 90, z: 30 }, { x: 115, z: -70 }];
const SAWAH = [{ x: 60, z: 75, w: 40, d: 30 }, { x: 105, z: 90, w: 34, d: 26 }, { x: 70, z: -10, w: 30, d: 24 }];
const TPA = { x: -40, z: 130 };
const KANTOR = { x: 30, z: 95 };
const SUNGAI_X = 20;
const kuotaBulan = b => 200 + 150 * (b - 1);
const GELAR = ['Prof.', 'Dr. (H.C.)', 'K.H.', 'Ir.', 'Ph.D (Honoris)', 'Maestro', 'Putra Terbaik Bangsa'];
const HARGA = { gelar: 300, bakar: 20, tebang: 120, tanam: 40, mbg: 60, kopdes: 50, berkas: 50, kambing: 150 };
const PENDAPATAN_SAWIT = 10;      // Cuan per siklus
const SIKLUS_SAWIT = 3;           // detik
const DURASI_API = 7;
const UMUR_MANGKRAK = 45;         // detik sebelum bangunan mangkrak

// ---------- Keadaan ----------
function keadaanBaru() {
  return {
    t: 0, bulan: 1, jalan: false, selesai: false,
    cuan: 200, restu: 60, panas: 10, rakyat: 10, kabut: 0, citra: 0, berkas: 1,
    stunting: 20, gelar: 0, setoranGagal: 0, bangunan: [], baliho: 0, selfie: 0,
  };
}
const G = keadaanBaru();
const PETAK = [];

// ---------- Three.js ----------
const kanvas = document.getElementById('dunia');
const renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const WARNA_LANGIT = new THREE.Color(0x8fd0ee), WARNA_KABUT = new THREE.Color(0x8a7b6a);
scene.background = WARNA_LANGIT.clone();
scene.fog = new THREE.FogExp2(0x8fd0ee, 0.004);
const kamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1500);
scene.add(new THREE.HemisphereLight(0xffffff, 0x556b3a, 1.0));
const matahari = new THREE.DirectionalLight(0xfff2cc, 1.1);
matahari.position.set(80, 140, 60);
scene.add(matahari);

const M = {
  tanah: new THREE.MeshLambertMaterial({ color: 0x5f9a4a }),
  laut: new THREE.MeshLambertMaterial({ color: 0x2b7bbf }),
  sungai: new THREE.MeshLambertMaterial({ color: 0x3aa0d8 }),
  sawah: new THREE.MeshLambertMaterial({ color: 0xc9c35a }),
  daun: new THREE.MeshLambertMaterial({ color: 0x2f7a3a }),
  batang: new THREE.MeshLambertMaterial({ color: 0x6b4a2a }),
  arang: new THREE.MeshLambertMaterial({ color: 0x1a1613 }),
  sawitDaun: new THREE.MeshLambertMaterial({ color: 0x7ab648 }),
  api: new THREE.MeshBasicMaterial({ color: 0xff7a1a }),
  api2: new THREE.MeshBasicMaterial({ color: 0xffd23a }),
  tembok: new THREE.MeshLambertMaterial({ color: 0xf1e8d6 }),
  atapMerah: new THREE.MeshLambertMaterial({ color: 0xb8362e }),
  atapAbu: new THREE.MeshLambertMaterial({ color: 0x6c6c6c }),
  rumah: new THREE.MeshLambertMaterial({ color: 0xe3c79a }),
  sampah: new THREE.MeshLambertMaterial({ color: 0x5b4b3a }),
  kantor: new THREE.MeshLambertMaterial({ color: 0xb9b3a4 }),
  jaket: new THREE.MeshLambertMaterial({ color: 0x2c3a2f }),
  kulit: new THREE.MeshLambertMaterial({ color: 0xc98f63 }),
  hitam: new THREE.MeshLambertMaterial({ color: 0x111111 }),
  emas: new THREE.MeshLambertMaterial({ color: 0xe8b83c }),
  mangkrak: new THREE.MeshLambertMaterial({ color: 0x7a7468 }),
  bambu: new THREE.MeshLambertMaterial({ color: 0xb59b5a }),
};
const G_BOX = new THREE.BoxGeometry(1, 1, 1);
const G_KERUCUT = new THREE.ConeGeometry(1, 1, 7);
const G_SILINDER = new THREE.CylinderGeometry(1, 1, 1, 8);
const G_BOLA = new THREE.SphereGeometry(1, 12, 10);

function mesh(g, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  const o = new THREE.Mesh(g, m);
  o.position.set(x, y, z);
  o.scale.set(sx, sy, sz);
  return o;
}

// ---------- Papan bertekstur (baliho, papan nama) ----------
function papan(teks, lebar, tinggi, opsi = {}) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = Math.round(512 * tinggi / lebar);
  const x = c.getContext('2d');
  x.fillStyle = opsi.latar || '#f4d56a'; x.fillRect(0, 0, c.width, c.height);
  x.strokeStyle = '#8a5a12'; x.lineWidth = 14; x.strokeRect(7, 7, c.width - 14, c.height - 14);
  if (opsi.wajah) {
    const cx = 110, cy = c.height / 2, r = Math.min(80, c.height / 2 - 24);
    x.fillStyle = '#c98f63'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.fillStyle = '#111'; x.fillRect(cx - r * 0.8, cy - r * 1.15, r * 1.6, r * 0.5);
    x.fillStyle = '#fff'; x.beginPath(); x.arc(cx - r * 0.35, cy - r * 0.1, 9, 0, 7); x.arc(cx + r * 0.35, cy - r * 0.1, 9, 0, 7); x.fill();
    x.fillStyle = '#111'; x.beginPath(); x.arc(cx - r * 0.35, cy - r * 0.1, 4, 0, 7); x.arc(cx + r * 0.35, cy - r * 0.1, 4, 0, 7); x.fill();
    x.strokeStyle = '#5a2a1a'; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy + r * 0.15, r * 0.5, 0.15 * Math.PI, 0.85 * Math.PI); x.stroke();
  }
  x.fillStyle = opsi.warna || '#4a2a06';
  x.font = 'bold 40px sans-serif'; x.textAlign = opsi.wajah ? 'left' : 'center';
  const baris = teks.split('\n');
  const mulaiX = opsi.wajah ? 215 : c.width / 2;
  baris.forEach((b, i) => x.fillText(b, mulaiX, c.height / 2 - (baris.length - 1) * 24 + i * 50 + 14));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(lebar, tinggi), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
}

function baliho(x, z, hadap = 0, tema = 'BERKAT SAYA,\nNEGERI INI MAJU!') {
  const g = new THREE.Group();
  g.add(mesh(G_SILINDER, M.batang, -4, 4, 0, 0.3, 4, 0.3), mesh(G_SILINDER, M.batang, 4, 4, 0, 0.3, 4, 0.3));
  const p = papan(tema, 10, 5, { wajah: true });
  p.position.set(0, 9, 0.2);
  g.add(p);
  g.position.set(x, 0, z); g.rotation.y = hadap;
  scene.add(g);
  G.baliho++;
  return g;
}

// ---------- Dunia ----------
const dunia = new THREE.Group();
scene.add(dunia);
const laut = mesh(new THREE.PlaneGeometry(3000, 3000), M.laut);
laut.rotation.x = -Math.PI / 2; laut.position.y = -0.4; dunia.add(laut);
const pulau = new THREE.Mesh(new THREE.CircleGeometry(RADIUS_PULAU, 48), M.tanah);
pulau.rotation.x = -Math.PI / 2; dunia.add(pulau);
const pantai = new THREE.Mesh(new THREE.RingGeometry(RADIUS_PULAU, RADIUS_PULAU + 12, 48), new THREE.MeshLambertMaterial({ color: 0xe6d49a }));
pantai.rotation.x = -Math.PI / 2; pantai.position.y = 0.02; dunia.add(pantai);
const sungai = mesh(new THREE.PlaneGeometry(14, 420), M.sungai, SUNGAI_X, 0.05, 0);
sungai.rotation.x = -Math.PI / 2; dunia.add(sungai);
SAWAH.forEach(s => { const p = mesh(new THREE.PlaneGeometry(s.w, s.d), M.sawah, s.x, 0.04, s.z); p.rotation.x = -Math.PI / 2; dunia.add(p); });

function rumahDesa(x, z) {
  const g = new THREE.Group();
  g.add(mesh(G_BOX, M.rumah, 0, 1.5, 0, 4, 3, 4), mesh(G_KERUCUT, M.atapMerah, 0, 4.2, 0, 3.6, 2.4, 3.6));
  g.children[1].rotation.y = Math.PI / 4;
  g.position.set(x, 0, z); dunia.add(g);
}
DESA.forEach((d, i) => {
  [[-12, -8], [-3, 10], [8, -10], [14, 6], [-14, 8], [2, -2]].forEach(([dx, dz]) => rumahDesa(d.x + dx, d.z + dz));
  const t = papan(i ? 'DESA SUKAMAJU' : 'DESA MAKMUR\nSENTOSA', 8, 3);
  t.position.set(d.x, 7, d.z - 18); dunia.add(t);
});
for (let i = 0; i < 8; i++) dunia.add(mesh(G_KERUCUT, M.sampah, TPA.x + (i - 4) * 4, 3, TPA.z + ((i * 7) % 5), 5, 6, 5));
const tpaPapan = papan('TPA', 5, 2.4); tpaPapan.position.set(TPA.x, 8, TPA.z - 10); dunia.add(tpaPapan);

const kantor = new THREE.Group();
kantor.add(mesh(G_BOX, M.kantor, 0, 5, 0, 16, 10, 10), mesh(G_BOX, M.atapAbu, 0, 10.5, 0, 17, 1, 11));
const pk = papan('KANTOR DINAS\nBerkas & Kambing Hitam', 12, 4); pk.position.set(0, 13, 5.6); kantor.add(pk);
kantor.position.set(KANTOR.x, 0, KANTOR.z); dunia.add(kantor);

// Pohon dari gagang dan kerucut
function pohon(x, z, tinggi) {
  const g = new THREE.Group();
  g.add(mesh(G_SILINDER, M.batang, 0, tinggi / 2, 0, 0.5, tinggi, 0.5), mesh(G_KERUCUT, M.daun, 0, tinggi + 2, 0, 2.6, 6, 2.6));
  g.position.set(x, 0, z);
  return g;
}
function palem(x, z) {
  const g = new THREE.Group();
  g.add(mesh(G_SILINDER, M.batang, 0, 2, 0, 0.35, 4, 0.35));
  for (let i = 0; i < 5; i++) {
    const d = mesh(G_BOX, M.sawitDaun, Math.cos(i * 1.256) * 1.4, 4.1, Math.sin(i * 1.256) * 1.4, 3, 0.15, 0.7);
    d.rotation.y = -i * 1.256; g.add(d);
  }
  g.position.set(x, 0, z);
  return g;
}

// Petak hutan
for (let j = 0; j < BARIS; j++) for (let i = 0; i < KOLOM; i++) {
  const cx = ASAL_X + i * JARAK_PETAK, cz = ASAL_Z + j * JARAK_PETAK;
  const p = { i, j, cx, cz, status: 'hutan', api: 0, matang: 0, siklus: 0,
    gHutan: new THREE.Group(), gApi: new THREE.Group(), gArang: new THREE.Group(), gSawit: new THREE.Group() };
  for (let k = 0; k < 9; k++) {
    const ox = ((k % 3) - 1) * 7 + (Math.sin(k * 12.9 + i * 3 + j * 5) * 1.5);
    const oz = (Math.floor(k / 3) - 1) * 7 + (Math.cos(k * 7.7 + i + j * 2) * 1.5);
    const tinggi = 5 + Math.abs(Math.sin(k + i * 2 + j)) * 4;
    p.gHutan.add(pohon(cx + ox, cz + oz, tinggi));
    p.gArang.add(mesh(G_SILINDER, M.arang, cx + ox, 1, cz + oz, 0.5, 2, 0.5));
    p.gSawit.add(palem(cx + ox, cz + oz));
    if (k < 6) p.gApi.add(mesh(G_KERUCUT, k % 2 ? M.api : M.api2, cx + ox, 2, cz + oz, 2.4, 5, 2.4));
  }
  p.gArang.visible = p.gApi.visible = p.gSawit.visible = false;
  dunia.add(p.gHutan, p.gApi, p.gArang, p.gSawit);
  PETAK.push(p);
}

// ---------- Pemain ----------
const pemain = new THREE.Group();
const lenganK = new THREE.Group(), lenganN = new THREE.Group(), kakiK = new THREE.Group(), kakiN = new THREE.Group();
pemain.add(mesh(G_BOX, M.jaket, 0, 2.3, 0, 1.4, 1.8, 0.8), mesh(G_BOLA, M.kulit, 0, 3.7, 0, 0.62, 0.62, 0.62), mesh(G_SILINDER, M.hitam, 0, 4.25, 0, 0.58, 0.36, 0.58));
[[-0.4, 2.7], [0, 2.6], [0.4, 2.7]].forEach(([x, y]) => pemain.add(mesh(G_BOLA, M.emas, x, y, 0.42, 0.14, 0.14, 0.14)));
lenganK.add(mesh(G_BOX, M.jaket, 0, -0.7, 0, 0.45, 1.5, 0.45)); lenganK.position.set(-0.95, 3.0, 0);
lenganN.add(mesh(G_BOX, M.jaket, 0, -0.7, 0, 0.45, 1.5, 0.45)); lenganN.position.set(0.95, 3.0, 0);
kakiK.add(mesh(G_BOX, M.hitam, 0, -0.7, 0, 0.55, 1.4, 0.55)); kakiK.position.set(-0.35, 1.4, 0);
kakiN.add(mesh(G_BOX, M.hitam, 0, -0.7, 0, 0.55, 1.4, 0.55)); kakiN.position.set(0.35, 1.4, 0);
pemain.add(lenganK, lenganN, kakiK, kakiN);
pemain.position.set(0, 0, 20);
scene.add(pemain);

// Baliho awal di sekitar titik mulai
baliho(-14, 8, 0.3); baliho(16, 4, -0.4, 'EMAS UNTUK\nSEMUA (KECUALI ANDA)');

// ---------- Kamera dan masukan ----------
let yaw = 0.0, pitch = 0.42, jarak = 16;
const tombol = {};
let joyX = 0, joyY = 0;
// Putar kamera: mouse (seret) atau satu jari di area layar (selain joystick dan tombol)
const jari = new Map();
kanvas.addEventListener('pointerdown', e => { jari.set(e.pointerId, { x: e.clientX, y: e.clientY }); kanvas.setPointerCapture?.(e.pointerId); });
kanvas.addEventListener('pointermove', e => {
  const j = jari.get(e.pointerId); if (!j) return;
  yaw -= (e.clientX - j.x) * 0.006; pitch = Math.max(0.12, Math.min(1.3, pitch + (e.clientY - j.y) * 0.005));
  j.x = e.clientX; j.y = e.clientY;
});
const lepas = e => jari.delete(e.pointerId);
kanvas.addEventListener('pointerup', lepas); kanvas.addEventListener('pointercancel', lepas);
kanvas.addEventListener('wheel', e => { jarak = Math.max(7, Math.min(34, jarak + e.deltaY * 0.02)); }, { passive: true });
// Cubit dua jari untuk zoom
let jarakCubit = 0;
kanvas.addEventListener('touchmove', e => {
  if (e.touches.length !== 2) { jarakCubit = 0; return; }
  const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  if (jarakCubit) jarak = Math.max(7, Math.min(34, jarak - (d - jarakCubit) * 0.05));
  jarakCubit = d;
}, { passive: true });
kanvas.addEventListener('touchend', () => { jarakCubit = 0; }, { passive: true });

addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  tombol[k] = true;
  if (!e.repeat) aksiTombol(k);
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
});
addEventListener('keyup', e => { tombol[e.key.toLowerCase()] = false; });
function resize() { renderer.setSize(innerWidth, innerHeight, false); kamera.aspect = innerWidth / innerHeight; kamera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

// ---------- Antarmuka ----------
const $ = id => document.getElementById(id);
const acak = a => a[Math.floor(Math.random() * a.length)];
const batas = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
let wToast = 0, wMono = 0;
function toast(teks) { $('toast').textContent = teks; $('toast').style.opacity = 1; wToast = 3.2; }
function monolog(kunci) { $('monolog').textContent = '“' + acak(MONOLOG[kunci]) + '”'; $('monolog').style.opacity = 1; wMono = 4.5; }
function kilat() { const f = $('kilat'); f.style.transition = 'none'; f.style.opacity = 0.9; requestAnimationFrame(() => { f.style.transition = 'opacity .6s'; f.style.opacity = 0; }); }
let promptLama = '';
function setPrompt(h) { if (h !== promptLama) { $('prompt').innerHTML = h; $('prompt').style.visibility = h ? 'visible' : 'hidden'; promptLama = h; } }

// ---------- Ruang dan klasifikasi lokasi ----------
const jarakDua = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);
function petakDi(x, z) {
  return PETAK.find(p => Math.abs(x - p.cx) < UKURAN_PETAK / 2 && Math.abs(z - p.cz) < UKURAN_PETAK / 2) || null;
}
function klasifikasi(x, z) {
  if (DESA.some(d => jarakDua(x, z, d.x, d.z) < 40)) return { benar: true };
  if (Math.abs(x - SUNGAI_X) < 9) return { k: 'sungai' };
  if (SAWAH.some(s => Math.abs(x - s.x) < s.w / 2 && Math.abs(z - s.z) < s.d / 2)) return { k: 'sawah' };
  if (jarakDua(x, z, TPA.x, TPA.z) < 30) return { k: 'tpa' };
  if (petakDi(x, z)) return { k: 'hutan' };
  if (jarakDua(x, z, KANTOR.x, KANTOR.z) < 20) return { k: 'kantor' };
  return { k: 'kosong' };
}

// ---------- Aksi ----------
function bisaBayar(biaya) { if (G.cuan < biaya) { toast(`Cuan kurang (butuh ${biaya}).`); return false; } return true; }
function bakar(p) {
  if (!p || p.status !== 'hutan' || !bisaBayar(HARGA.bakar)) return;
  G.cuan -= HARGA.bakar;
  if (G.berkas > 0) { G.berkas--; G.panas = batas(G.panas + 2); toast('Dibakar "sesuai prosedur". Berkas terpakai.'); }
  else { G.panas = batas(G.panas + 6); toast('Dibakar tanpa berkas. Titik panas terlihat satelit.'); }
  nyalakan(p); monolog('bakar');
}
function nyalakan(p) { p.status = 'api'; p.api = DURASI_API; p.gHutan.visible = false; p.gSawit.visible = false; p.gArang.visible = false; p.gApi.visible = true; }
function tebang(p) {
  if (!p || p.status !== 'hutan' || !bisaBayar(HARGA.tebang)) return;
  G.cuan -= HARGA.tebang; p.status = 'lahan'; p.gHutan.visible = false; p.gArang.visible = true;
  toast('Ditebang manual. Mahal dan lama. Tidak ada yang memuji.'); monolog('tebang');
}
function tanam(p) {
  if (!p || p.status !== 'lahan' || !bisaBayar(HARGA.tanam)) return;
  G.cuan -= HARGA.tanam; p.status = 'sawit'; p.siklus = 0; p.gArang.visible = false; p.gSawit.visible = true;
  toast('Sawit ditanam. Penghasilan mengalir.'); monolog('sawit');
}
function bangun(jenis) {
  const biaya = HARGA[jenis];
  const ry = pemain.rotation.y;
  const x = pemain.position.x + Math.sin(ry) * 8, z = pemain.position.z + Math.cos(ry) * 8;
  if (!bisaBayar(biaya)) return;
  const l = klasifikasi(x, z);
  if (l.benar) {
    G.cuan = Math.max(0, G.cuan - 10); G.restu = batas(G.restu - 3);
    toast('DIBLOKIR: ' + acak(BLOKIR) + ' (biaya administrasi 10)'); monolog('blokir');
    return;
  }
  G.cuan += (jenis === 'mbg' ? 160 : 130) - biaya;
  G.restu = batas(G.restu + 4); G.panas = batas(G.panas + 2); G.citra += 3;
  const g = new THREE.Group();
  const nama = jenis === 'mbg' ? 'DAPUR EMAS (MBG)' : 'KOPDES EMAS';
  g.add(mesh(G_BOX, M.tembok, 0, 3, 0, 10, 6, 8), mesh(G_BOX, jenis === 'mbg' ? M.atapMerah : M.atapAbu, 0, 6.4, 0, 11, 1, 9));
  const pn = papan(nama, 9, 2.6); pn.position.set(0, 8.2, 4.2); g.add(pn);
  g.position.set(x, 0, z); g.rotation.y = ry + Math.PI; scene.add(g);
  const b = { jenis, umur: 0, mangkrak: false, g, x, z };
  G.bangunan.push(b);
  baliho(x + 12 * Math.cos(ry), z - 12 * Math.sin(ry), ry + Math.PI);
  toast(`${nama} berdiri ${LOKASI[l.k]}`); monolog('bangun');
}
function mangkrakkan(b) {
  b.mangkrak = true;
  b.g.children.forEach(c => { if (c.material === M.tembok || c.material === M.atapMerah || c.material === M.atapAbu) c.material = M.mangkrak; });
  b.g.rotation.z = 0.1;
  for (let i = -1; i <= 1; i++) { const s = mesh(G_SILINDER, M.bambu, i * 4, 4, 4.6, 0.15, 8, 0.15); s.rotation.z = i * 0.15; b.g.add(s); }
  G.rakyat = batas(G.rakyat + 3);
  if (b.jenis === 'mbg') G.stunting += 0.3;
  monolog('mangkrak');
}
function selfie() {
  const dekat = G.bangunan.some(b => jarakDua(pemain.position.x, pemain.position.z, b.x, b.z) < 16);
  kilat(); G.selfie++;
  if (dekat) { G.citra += 10; G.restu = batas(G.restu + 2); toast('Selfie di depan "capaian". Citra +10.'); }
  else { G.citra += 2; toast('Selfie biasa. Citra +2. Cari latar yang lebih berprestasi.'); }
  monolog('selfie');
}
function ngeles() {
  if (G.citra < 20) return toast('Citra kurang (butuh 20) untuk konferensi pers.');
  G.citra -= 20; G.rakyat = batas(G.rakyat - 15); G.panas = batas(G.panas - 5);
  toast('Konferensi pers: "Itu hoaks, tapi sudah kami evaluasi." Amarah rakyat turun.'); monolog('ngeles');
}
function beliGelar() {
  if (G.gelar >= GELAR.length) return toast('Semua gelar sudah dibeli. Nama Anda tidak muat di kartu nama.');
  if (!bisaBayar(HARGA.gelar)) return;
  G.cuan -= HARGA.gelar; G.citra += 15; G.restu = batas(G.restu + 3);
  toast(`Gelar kehormatan dari "universitas" mitra: ${GELAR[G.gelar++]}. Citra +15.`);
}
function dekatKantor() { return jarakDua(pemain.position.x, pemain.position.z, KANTOR.x, KANTOR.z) < 20; }
function aksiTombol(k) {
  if (!G.jalan || G.selesai) return;
  const p = petakDi(pemain.position.x, pemain.position.z);
  if (k === 'b') bakar(p); else if (k === 't') tebang(p); else if (k === 'p') tanam(p);
  else if (k === '1') bangun('mbg'); else if (k === '2') bangun('kopdes');
  else if (k === 'g') beliGelar();
  else if (k === 'f') selfie(); else if (k === 'c') ngeles();
  else if (k === 'e' && dekatKantor() && bisaBayar(HARGA.berkas)) { G.cuan -= HARGA.berkas; G.berkas++; toast('Berkas rapi dibeli. Perisai +1.'); monolog('berkas'); }
  else if (k === 'k' && dekatKantor() && bisaBayar(HARGA.kambing)) { G.cuan -= HARGA.kambing; G.panas = batas(G.panas - 30); G.restu = batas(G.restu - 2); toast('Staf "penanggung jawab" dimutasi. Panas KPK -30.'); }
}

// ---------- Pembaruan ----------
let kabutPuncak = 0, waktu = 0;
function update(dt) {
  waktu += dt;
  if (wToast > 0 && (wToast -= dt) <= 0) $('toast').style.opacity = 0;
  if (wMono > 0 && (wMono -= dt) <= 0) $('monolog').style.opacity = 0;
  if (!G.jalan || G.selesai) return;

  // Gerak relatif kamera
  const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  let mx = 0, mz = 0;
  if (tombol.w || tombol.arrowup) { mx += fx; mz += fz; }
  if (tombol.s || tombol.arrowdown) { mx -= fx; mz -= fz; }
  if (tombol.d || tombol.arrowright) { mx += rx; mz += rz; }
  if (tombol.a || tombol.arrowleft) { mx -= rx; mz -= rz; }
  if (joyX || joyY) { mx += fx * -joyY + rx * joyX; mz += fz * -joyY + rz * joyX; }
  const bergerak = mx || mz;
  if (bergerak) {
    const n = Math.hypot(mx, mz), lari = tombol.shift || Math.hypot(joyX, joyY) > 0.9, v = (lari ? 22 : 12) * dt;
    pemain.position.x += mx / n * v; pemain.position.z += mz / n * v;
    pemain.rotation.y = Math.atan2(mx, mz);
    const r = Math.hypot(pemain.position.x, pemain.position.z);
    if (r > RADIUS_PULAU - 4) { pemain.position.x *= (RADIUS_PULAU - 4) / r; pemain.position.z *= (RADIUS_PULAU - 4) / r; }
  }
  const ayun = bergerak ? Math.sin(waktu * 12) * 0.7 : 0;
  lenganK.rotation.x = ayun; lenganN.rotation.x = -ayun; kakiK.rotation.x = -ayun; kakiN.rotation.x = ayun;
  pemain.position.y = bergerak ? Math.abs(Math.sin(waktu * 12)) * 0.15 : 0;

  // Waktu dan setoran
  G.t += dt;
  if (G.t >= G.bulan * DETIK_PER_BULAN) akhirBulan();

  // Petak
  let terbakar = 0;
  for (const p of PETAK) {
    if (p.status === 'sawit') {
      p.siklus += dt;
      if (p.siklus >= SIKLUS_SAWIT) { p.siklus -= SIKLUS_SAWIT; G.cuan += PENDAPATAN_SAWIT; }
    } else if (p.status === 'api') {
      terbakar++;
      p.api -= dt;
      p.gApi.children.forEach((c, i) => { c.scale.y = 4 + Math.sin(waktu * 9 + i * 1.7) * 1.4; c.position.y = c.scale.y / 2; });
      for (const q of PETAK) {
        if ((q.status === 'hutan' || q.status === 'sawit') && Math.abs(q.i - p.i) + Math.abs(q.j - p.j) === 1 && Math.random() < 0.05 * dt) {
          if (q.status === 'sawit') toast('Api merambat ke kebun sawit Anda!');
          nyalakan(q);
        }
      }
      if (p.api <= 0) { p.status = 'lahan'; p.gApi.visible = false; p.gArang.visible = true; }
    }
  }

  // Bangunan
  let mangkrakMbg = 0;
  for (const b of G.bangunan) {
    b.umur += dt;
    if (!b.mangkrak) { G.cuan += dt * 1; if (b.umur > UMUR_MANGKRAK) mangkrakkan(b); }
    else if (b.jenis === 'mbg') mangkrakMbg++;
  }

  // Kabut, amarah, panas, stunting
  G.kabut = batas(G.kabut + (terbakar ? terbakar * 0.6 : -0.5) * dt);
  kabutPuncak = Math.max(kabutPuncak, G.kabut);
  G.rakyat = batas(G.rakyat + ((G.kabut > 50 ? (G.kabut - 50) / 50 : -0.12) + 0.02 * G.bangunan.filter(b => b.mangkrak).length) * dt);
  G.panas = batas(G.panas + ((G.kabut > 40 ? terbakar * 0.4 : 0) - 0.15) * dt);
  G.stunting = Math.round((G.stunting + (G.kabut / 100 * 0.03 + mangkrakMbg * 0.002) * dt) * 1000) / 1000;
  const t = G.kabut / 100;
  scene.fog.density = 0.004 + t * 0.018;
  scene.fog.color.copy(WARNA_LANGIT).lerp(WARNA_KABUT, t);
  scene.background.copy(scene.fog.color);

  // Kalah
  if (G.restu <= 0) return akhir('restu');
  if (G.panas >= 100) return akhir('panas');
  if (G.rakyat >= 100) return akhir('rakyat');

  // Petunjuk interaksi
  const p = petakDi(pemain.position.x, pemain.position.z);
  let h = '';
  if (p) {
    if (p.status === 'hutan') h = `Petak hutan: <b>B</b> Bakar (${HARGA.bakar}) · <b>T</b> Tebang (${HARGA.tebang})`;
    else if (p.status === 'lahan') h = `Lahan terbuka: <b>P</b> Tanam sawit (${HARGA.tanam})`;
    else if (p.status === 'sawit') h = 'Kebun sawit: panen otomatis. Jauhkan dari api.';
    else if (p.status === 'api') h = 'Api sedang menyala. Itu "pembukaan lahan".';
  } else if (dekatKantor()) h = `Kantor Dinas: <b>E</b> Berkas (${HARGA.berkas}) · <b>K</b> Kambing hitam (${HARGA.kambing})`;
  setPrompt(h);
}

function akhirBulan() {
  const kuota = kuotaBulan(G.bulan);
  if (G.cuan >= kuota) { G.cuan -= kuota; G.restu = batas(G.restu + 8); toast(`Setoran bulan ${G.bulan}: ${kuota}. Bos senang.`); monolog('setoranOk'); }
  else { G.restu = batas(G.restu - 25); G.setoranGagal++; toast(`Setoran bulan ${G.bulan} KURANG (${kuota}). Restu Bos -25.`); monolog('setoranKurang'); }
  if (G.bulan >= BULAN_TOTAL) return akhir('selesai');
  G.bulan++;
}

function akhir(sebab) {
  if (G.selesai) return;
  G.selesai = true; G.jalan = false; setPrompt('');
  const [judul, alasan] = KARTU_AKHIR[sebab];
  const hutanSisa = Math.round(PETAK.filter(p => p.status === 'hutan').length / PETAK.length * 100);
  const mangkrak = G.bangunan.filter(b => b.mangkrak).length;
  const stuntingResmi = Math.max(10, 20 - Math.min(5, G.bangunan.length * 0.5 + G.citra * 0.02));
  $('akhirJudul').textContent = judul;
  $('akhirAlasan').textContent = alasan;
  $('akhirResmi').innerHTML = `Serapan anggaran: <b>100%</b><br>Bangunan diresmikan: <b>${G.bangunan.length}</b><br>Baliho terpasang: <b>${G.baliho}</b><br>Stunting (laporan): <b>${stuntingResmi.toFixed(1)}%</b><br>Predikat: <b>SANGAT BERKINERJA</b>`;
  $('akhirNyata').innerHTML = `Hutan tersisa: <b>${hutanSisa}%</b><br>Bangunan mangkrak: <b>${mangkrak} dari ${G.bangunan.length}</b><br>Kabut puncak: <b>${Math.round(kabutPuncak)}/100</b><br>Stunting nyata: <b>${G.stunting.toFixed(1)}%</b><br>Amarah rakyat: <b>${Math.round(G.rakyat)}/100</b>`;
  $('akhir').hidden = false;
}

function hud() {
  const set = (id, v, maks = 100) => { $(id).style.width = Math.max(0, Math.min(100, v / maks * 100)) + '%'; };
  set('bRestu', G.restu); set('bPanas', G.panas); set('bRakyat', G.rakyat); set('bKabut', G.kabut);
  $('cuan').textContent = Math.floor(G.cuan);
  $('citra').textContent = Math.floor(G.citra);
  $('berkas').textContent = G.berkas;
  $('bulan').textContent = `Bulan ${G.bulan}/${BULAN_TOTAL}`;
  $('kuota').textContent = kuotaBulan(G.bulan);
  $('hutan').textContent = Math.round(PETAK.filter(p => p.status === 'hutan').length / PETAK.length * 100) + '%';
  $('stunting').textContent = G.stunting.toFixed(1) + '%';
}

function kameraIkut() {
  const tx = pemain.position.x, ty = 3.2, tz = pemain.position.z;
  kamera.position.set(tx + Math.sin(yaw) * Math.cos(pitch) * jarak, ty + Math.sin(pitch) * jarak, tz + Math.cos(yaw) * Math.cos(pitch) * jarak);
  kamera.lookAt(tx, ty, tz);
}

let terakhir = performance.now();
renderer.setAnimationLoop(now => {
  const dt = Math.min(0.1, (now - terakhir) / 1000); terakhir = now;
  update(dt); hud(); kameraIkut();
  renderer.render(scene, kamera);
});

$('mulai').onclick = () => { $('judul').hidden = true; G.jalan = true; monolog('mulai'); };
$('ulang').onclick = () => location.reload();

// Kait untuk pengujian otomatis
window.__g = { G, PETAK, pemain, update, bakar, tebang, tanam, bangun, klasifikasi, petakDi, selfie, ngeles, aksiTombol,
  maju(detik) { for (let i = 0; i < detik * 20; i++) update(0.05); }, setYaw(v) { yaw = v; } };

// ---------- Kontrol sentuh ----------
const joy = $('joy'), knob = $('knob');
let joyId = null;
function joyGerak(e) {
  const r = joy.getBoundingClientRect(), R = r.width / 2;
  let dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R);
  const d = Math.hypot(dx, dy); if (d > R) { dx *= R / d; dy *= R / d; }
  joyX = dx / R; joyY = dy / R;
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
}
joy.addEventListener('pointerdown', e => { joyId = e.pointerId; joy.setPointerCapture(e.pointerId); joyGerak(e); e.preventDefault(); });
joy.addEventListener('pointermove', e => { if (e.pointerId === joyId) joyGerak(e); });
const joyLepas = e => { if (e.pointerId !== joyId) return; joyId = null; joyX = joyY = 0; knob.style.transform = 'translate(0,0)'; };
joy.addEventListener('pointerup', joyLepas); joy.addEventListener('pointercancel', joyLepas);
document.querySelectorAll('#aksiSentuh button').forEach(b => {
  b.addEventListener('pointerdown', e => { e.preventDefault(); aksiTombol(b.dataset.k); });
});
if (matchMedia('(pointer: coarse)').matches) document.body.classList.add('sentuh');
