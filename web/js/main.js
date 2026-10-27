// Republik Emas (anti stunting): dunia terbuka, kamera orang ketiga, mode santai tanpa akhir.
import * as THREE from '../vendor/three.module.js';
import { R, DESA, SAWAH, TPA, KANTOR, SPAWN, TITIK_BEBAS, sungaiX, UKURAN, ZONA, pusatZona, UMKM, PELUANG, JALAN } from './konfig.js';
import { tinggi, lantai, buatTerrain } from './terrain.js';
import { M, buatObjek, manusia, bangunanMBG, bangunanKopdes, mangkrakkan, baliho, pilar, kios, aparatSewaan, ojol, labelSprite, motorPemain, mobilDinas } from './objek.js';
import { buatEfek } from './efek.js';
import { buatNPC } from './npc.js';
import { bunyi, aktifkan, setBisu, bisuSekarang, mesin } from './bunyi.js';
import { mulaiMusik, setMusikBisu, musikBisu, suasanaMusik, infoMusik, ujiMusik } from './musik.js';
import { FOOT, BALIHO_AWAL, adaTempat, tambahJejak } from './tata.js';
import { PRESTASI, PANGKAT, pangkatDari, pilihBerita, ucapan } from './satir.js';
import { MONOLOG, BLOKIR, LOKASI, DENDA, MISI, PAJAK, GAGAL, NAMA_TOMBOL, PAJAK_OJOL, GAGAL_OJOL } from './teks.js';

// ---------- Konstanta permainan ----------
const DETIK_PER_BULAN = 30;
// Bos menagih nilai dasar ditambah 25% dari penghasilan bulanan (mengikuti ukuran bisnis Anda)
const kuotaBulan = b => Math.round(80 + 40 * (b - 1) + 0.25 * G.penghasilan * DETIK_PER_BULAN);
const HARGA = { tebang: 60, tanam: 40, mbg: 60, kopdes: 50, berkas: 50, kambing: 150, aparat: 120 };
const hargaGelar = n => 300 * (n + 1);
const hargaPupuk = n => 200 * 2 ** n;
const hargaOknum = n => 300 * (n + 1);
const GELAR = ['Prof.', 'Dr. (H.C.)', 'K.H.', 'Ir.', 'Ph.D (Honoris)', 'Maestro', 'Putra Terbaik Bangsa'];
const MAKS_PUPUK = 5, MAKS_OKNUM = 4;
const PENDAPATAN_SAWIT = 6, SIKLUS_SAWIT = 3, DURASI_API = 7, UMUR_MANGKRAK = 45, UMUR_MANGKRAK_MBG = 140, TUMBUH_KEMBALI = 150;
const COOLDOWN_UMKM = 25, TUTUP_SETELAH = 3, LAMA_TUTUP = 120, DURASI_APARAT = 60;

// ---------- Keadaan ----------
const G = {
  t: 0, bulan: 1, jalan: false, jeda: false,
  cuan: 20, restu: 60, panas: 5, rakyat: 5, kabut: 0, citra: 0, berkas: 1,
  stunting: 20, pupuk: 0, oknum: 0, gelar: 0, aparat: 0, ojolMogok: 0, korban: 0, insiden: 0, kasRaib: 0, prestasi: [], pangkat: 0, naik: null, balihoList: [],
  bangunan: [], baliho: 0, selfie: 0, kabutPuncak: 0, gulungTikar: 0, misi: 0,
  stat: { bakar: 0, tanam: 0, bangun: 0, blokir: 0, palak: 0, panen: 0, naik: 0, lompat: 0 },
  penghasilan: 0,
};

// ---------- Three.js ----------
const sentuh = matchMedia('(pointer: coarse)').matches;
const kanvas = document.getElementById('dunia');
const renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: !sentuh });
renderer.setPixelRatio(Math.min(devicePixelRatio, sentuh ? 1.5 : 2));
const scene = new THREE.Scene();
const WARNA_LANGIT = new THREE.Color(0x8fd0ee), WARNA_KABUT = new THREE.Color(0x8a7b6a);
scene.background = WARNA_LANGIT.clone();
scene.fog = new THREE.FogExp2(0x8fd0ee, 0.0028);
const kamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1800);
scene.add(new THREE.HemisphereLight(0xffffff, 0x6a7a4a, 1.05));
const matahari = new THREE.DirectionalLight(0xfff2cc, 1.15);
matahari.position.set(120, 180, 80);
scene.add(matahari);

const terrain = buatTerrain(scene);
const dunia = buatObjek(scene, terrain);
const PETAK = dunia.petak;

// ---------- Tokoh utama, oknum, aparat ----------
const pemain = manusia();
pemain.position.set(SPAWN.x, lantai(SPAWN.x, SPAWN.z), SPAWN.z);
scene.add(pemain);
const lenganK = pemain.userData.lenganK, lenganN = pemain.userData.lenganN, kakiK = pemain.userData.kakiK, kakiN = pemain.userData.kakiN;
const daftarOknum = [], daftarAparat = [];

// ---------- UMKM ----------
const KIOS = UMKM.map((u, i) => {
  const g = kios(u.nama, u.tipe, i);
  const h = tinggi(u.x, u.z);
  g.add(new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.4, 4.6), M.batu)); g.children[g.children.length - 1].position.set(0, -0.8, 0);
  g.position.set(u.x, h, u.z);
  g.scale.setScalar(1.3);
  g.rotation.y = Math.atan2(SPAWN.x - u.x, SPAWN.z - u.z);
  scene.add(g);
  return { ...u, jenis: 'kios', g, cd: 0, berhasil: 0, tutup: false, sisaTutup: 0, marah: 0 };
});


// ---------- Ojol: hilir-mudik di jalan, berhenti saat didekati ----------
const OJOL = [];
[0, 0, 0, 1, 2, 2, 3, 4].forEach((ji, i) => {
  const pts = JALAN[ji], seg = []; let tot = 0;
  for (let k = 0; k < pts.length - 1; k++) { const l = Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]); seg.push(l); tot += l; }
  const tipe = ['ramah', 'biasa', 'galak'][i % 3], g = ojol(i), label = labelSprite('OJOL ' + tipe.toUpperCase(), tipe);
  label.position.set(0, 4.4, 0); g.add(label); scene.add(g);
  OJOL.push({ jenis: 'ojol', nama: 'Abang Ojol', tipe, dasar: 20, g, label, pts, seg, tot, s: Math.random() * tot, arah: i % 2 ? 1 : -1, v: 0, vDasar: 7 + Math.random() * 3,
    cd: 0, berhasil: 0, tutup: false, sisaTutup: 0, marah: 0, klakson: 0, x: 0, z: 0 });
});
function titikJalur(o, s) {
  let a = s;
  for (let k = 0; k < o.seg.length; k++) {
    if (a <= o.seg[k] || k === o.seg.length - 1) {
      const t = Math.min(1, a / o.seg[k]), [ax, az] = o.pts[k], [bx, bz] = o.pts[k + 1], l = o.seg[k] || 1;
      return { x: ax + (bx - ax) * t, z: az + (bz - az) * t, dx: (bx - ax) / l, dz: (bz - az) / l };
    }
    a -= o.seg[k];
  }
}
OJOL.forEach(o => { const p = titikJalur(o, o.s); o.x = p.x; o.z = p.z; o.g.position.set(p.x, lantai(p.x, p.z), p.z); });

// Baliho awal (posisi dijamin tidak menabrak benda lain, lihat tata.js)
function pasangBaliho(x, z, hadap, tema, dinamis = false) {
  const b = baliho(x, z, hadap, tema); scene.add(b); G.baliho++;
  if (dinamis) { G.balihoList.push({ x, z, hadap, tema }); tambahJejak(x, z, 6, 'baliho'); dunia.bersihkan(x, z, 8); }
  return b;
}
BALIHO_AWAL.forEach(b => pasangBaliho(b.x, b.z, b.ry, b.tema));

// ---------- Kendaraan: motor dekat titik mulai, mobil dinas dekat Kantor Dinas ----------
const KENDARAAN = [
  { jenis: 'motor', nama: 'Motor', g: motorPemain(), x: 8, z: 22, ry: 2.4, maks: 25, belok: 2.5, duduk: 0.55 },
  { jenis: 'mobil', nama: 'Mobil Dinas', g: mobilDinas(), x: 26, z: 54, ry: Math.PI, maks: 34, belok: 1.6, duduk: 0 },
];
KENDARAAN.forEach(k => { k.v = 0; k.y = lantai(k.x, k.z); k.vy = 0; k.tanah = true; k.jejak = 0; k.g.position.set(k.x, k.y, k.z); k.g.rotation.y = k.ry; scene.add(k.g); });

// Penanda tujuan
const tujuan = pilar(); tujuan.visible = false; scene.add(tujuan);

// ---------- Kamera dan masukan ----------
let yaw = 0.0, pitch = 0.42, jarak = 11;
const tombol = {};
let joyX = 0, joyY = 0;
const jari = new Map();
kanvas.addEventListener('pointerdown', e => { jari.set(e.pointerId, { x: e.clientX, y: e.clientY }); kanvas.setPointerCapture?.(e.pointerId); });
kanvas.addEventListener('pointermove', e => {
  const j = jari.get(e.pointerId); if (!j) return;
  yaw -= (e.clientX - j.x) * 0.006; pitch = Math.max(0.12, Math.min(1.3, pitch + (e.clientY - j.y) * 0.005));
  j.x = e.clientX; j.y = e.clientY;
});
const lepas = e => jari.delete(e.pointerId);
kanvas.addEventListener('pointerup', lepas); kanvas.addEventListener('pointercancel', lepas);
kanvas.addEventListener('wheel', e => { jarak = Math.max(5, Math.min(32, jarak + e.deltaY * 0.02)); }, { passive: true });
let jarakCubit = 0;
kanvas.addEventListener('touchmove', e => {
  if (e.touches.length !== 2) { jarakCubit = 0; return; }
  const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  if (jarakCubit) jarak = Math.max(5, Math.min(32, jarak - (d - jarakCubit) * 0.04));
  jarakCubit = d;
}, { passive: true });
kanvas.addEventListener('touchend', () => { jarakCubit = 0; }, { passive: true });
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  tombol[k] = true;
  if (!e.repeat) aksiTombol(k === ' ' ? 'j' : k);
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
function toast(teks) { $('toast').textContent = teks; $('toast').style.opacity = 1; wToast = 3.6; }
function monolog(kunci) { $('monolog').textContent = '“' + acak(MONOLOG[kunci]) + '”'; $('monolog').style.opacity = 1; wMono = 4.5; }
function kilat(warna = '#fff') { const f = $('kilat'); f.style.background = warna; f.style.transition = 'none'; f.style.opacity = 0.85; requestAnimationFrame(() => { f.style.transition = 'opacity .6s'; f.style.opacity = 0; }); }
// Nama tombol sesuai perangkat: ponsel menampilkan nama tombol, komputer menampilkan hurufnya
const tb = k => `<kbd>${sentuh ? NAMA_TOMBOL[k] : k.toUpperCase()}</kbd>`;
const isiTombol = teks => teks.replace(/\{(\w)\}/g, (_, k) => tb(k));
let promptLama = '';
let aturTumpukan = () => {};
function setPrompt(h) { if (h !== promptLama) { $('prompt').innerHTML = h; $('prompt').style.visibility = h ? 'visible' : 'hidden'; promptLama = h; aturTumpukan(); } }
function kartu(judul, teks, tombolTeks = 'Lanjut') {
  G.jeda = true;
  $('kartuJudul').textContent = judul; $('kartuTeks').textContent = teks; $('kartuLanjut').textContent = tombolTeks;
  $('kartu').hidden = false;
}
$('kartuLanjut').onclick = () => { $('kartu').hidden = true; G.jeda = false; bunyi.klik(); };

// ---------- Efek visual dan suara (setiap interaksi harus terasa) ----------
const E = buatEfek(scene, kamera, pemain, $('melayang'), $('cuan'));
const V = (x, z, y = 0) => new THREE.Vector3(x, tinggi(x, z) + y, z);
const depanPemain = (jarakD = 6, y = 1.5) => new THREE.Vector3(pemain.position.x + Math.sin(pemain.rotation.y) * jarakD, pemain.position.y + y, pemain.position.z + Math.cos(pemain.rotation.y) * jarakD);
const NPC = buatNPC({ scene, G, tinggi, lantai, E, bunyi, toast, monolog, pemain, V, batas });
let fxSumber = null, fxTujuan = null;
const KEY_DELTA = [['cuan', 'Cuan'], ['restu', 'Restu'], ['panas', 'Panas KPK'], ['rakyat', 'Amarah'], ['citra', 'Citra'], ['berkas', 'Berkas']];
const SIFAT = { cuan: true, restu: true, panas: false, rakyat: false, citra: true, berkas: true };
const ambil = () => ({ cuan: G.cuan, restu: G.restu, panas: G.panas, rakyat: G.rakyat, citra: G.citra, berkas: G.berkas });
function umumkan(a, b) {
  const pos = pemain.position.clone(); pos.y += 3.2;
  let i = 0;
  for (const [k, nama] of KEY_DELTA) {
    const d = Math.round(b[k] - a[k]); if (!d) continue;
    const bagus = (d > 0) === SIFAT[k];
    E.teks(pos, `${d > 0 ? '+' : ''}${d} ${nama}`, k === 'cuan' ? (d > 0 ? 'emas' : 'rugi') : (bagus ? 'bagus' : 'buruk'), i++ * 0.2);
  }
  const dc = Math.round(b.cuan - a.cuan);
  if (dc > 0) { E.koinMasuk(fxSumber || pemain.position.clone().setY(pemain.position.y + 3), Math.min(16, 4 + Math.floor(dc / 10))); E.hudTeks('+' + dc); }
  else if (dc < 0) { E.koinKeluar(fxTujuan || depanPemain(), Math.min(12, 3 + Math.floor(-dc / 20))); E.hudTeks(String(dc), 'rugi'); }
  fxSumber = fxTujuan = null;
}

// ---------- Ruang ----------
const jarakDua = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);
function petakDi(x, z) { return PETAK.find(p => Math.abs(x - p.cx) < UKURAN / 2 && Math.abs(z - p.cz) < UKURAN / 2) || null; }
function klasifikasi(x, z) {
  if (tinggi(x, z) < 0.3) return { k: 'air' };
  if (DESA.some(d => jarakDua(x, z, d.x, d.z) < 40)) return { benar: true };
  if (Math.abs(x - sungaiX(z)) < 22) return { k: 'sungai' };
  if (SAWAH.some(s => Math.abs(x - s.x) < s.w / 2 + 2 && Math.abs(z - s.z) < s.d / 2 + 2)) return { k: 'sawah' };
  if (jarakDua(x, z, TPA.x, TPA.z) < 32) return { k: 'tpa' };
  if (petakDi(x, z)) return { k: 'hutan' };
  if (jarakDua(x, z, KANTOR.x, KANTOR.z) < 24) return { k: 'kantor' };
  if (tinggi(x, z) > 7.5) return { k: 'bukit' };
  return { k: 'kosong' };
}
const kiosDekat = () => sasaranPalak();
const dekatKantor = () => jarakDua(pemain.position.x, pemain.position.z, KANTOR.x, KANTOR.z) < 24;

// ---------- Palak UMKM dan ojol ----------
function sasaranPalak() {
  let terbaik = null;
  for (const u of KIOS.concat(OJOL)) { const d = jarakDua(pemain.position.x, pemain.position.z, u.x, u.z); if (d < 9 && (!terbaik || d < terbaik.d)) terbaik = { u, d }; }
  return terbaik ? terbaik.u : null;
}
let wUcap = 0, uSapa = null;
function ucap(u, jenis) {
  const c = ucapan(u, jenis); if (!c) return;
  const e = $('ucapan'); e.innerHTML = '<b></b><span></span>'; e.firstChild.textContent = c.nama; e.lastChild.textContent = '“' + c.teks + '”';
  e.style.opacity = 1; wUcap = 5;
  if (sentuh) { $('monolog').style.opacity = 0; wMono = 0; } // layar kecil: satu suara dalam satu waktu
}
function palak() {
  const u = sasaranPalak();
  if (!u) return toast('Tidak ada UMKM atau ojol di dekat Anda. Cari kios berpapan nama, atau ojol di jalan.');
  const oj = u.jenis === 'ojol';
  if (u.tutup) return toast(oj ? 'Abang ojol ini sedang mogok. Tidak ada yang bisa dipajaki.' : 'Kiosnya sudah gulung tikar. Tidak ada lagi yang bisa dipajaki.');
  if (u.cd > 0) return toast(`${oj ? 'Abang ojol' : 'Pemilik'} sedang mengawasi Anda. Tunggu ${Math.ceil(u.cd)} detik.`);
  u.cd = oj ? 15 : COOLDOWN_UMKM; G.stat.palak++;
  const pos = new THREE.Vector3(u.x, tinggi(u.x, u.z) + 2.2, u.z);
  const pakaiAparat = G.aparat > 0;
  if (pakaiAparat || Math.random() < PELUANG[u.tipe]) {
    const kotor = Math.round(u.dasar * (1 + 0.05 * (G.bulan - 1)) * (0.8 + Math.random() * 0.5));
    const bersih = pakaiAparat ? Math.round(kotor * 0.75) : kotor;
    G.cuan += bersih; G.panas = batas(G.panas + (pakaiAparat ? 3 : 2)); G.rakyat = batas(G.rakyat + (pakaiAparat ? 3 : 1));
    u.berhasil++;
    fxSumber = pos; E.semburan(pos, 'percik', 12); bunyi.koin();
    toast(`"${acak(oj ? PAJAK_OJOL : PAJAK)}" berhasil: +${bersih} Cuan${pakaiAparat ? ' (25% untuk uang lelah aparat)' : ''}.`);
    monolog(oj ? 'ojol' : 'palak');
    if (u.berhasil >= TUTUP_SETELAH) { tutupkan(u); if (!oj) ucap(u, 't'); } else ucap(u, 'ok');
  } else {
    const rugi = Math.min(G.cuan, 15);
    G.cuan -= rugi; G.rakyat = batas(G.rakyat + 5); G.restu = batas(G.restu - 3); G.citra = Math.max(0, G.citra - 5);
    u.marah = 1.6; fxTujuan = pos;
    E.teks(pos, 'GAGAL!', 'besar buruk'); E.getar(0.35); bunyi.gagal(); kilat('#d6453d');
    toast(`GAGAL: ${acak(oj ? GAGAL_OJOL : GAGAL)} (Cuan -${Math.round(rugi)}, Citra -5)`);
    monolog('palakGagal'); ucap(u, 'g');
    if (oj) klaksonMassal(u);
  }
}
function klaksonMassal(sumber) {
  let n = 0;
  for (const o of OJOL) if (o !== sumber && !o.tutup && jarakDua(o.x, o.z, sumber.x, sumber.z) < 70) { o.klakson = 3.5; n++; }
  sumber.klakson = 3.5; bunyi.klakson(); monolog('klakson');
  G.rakyat = batas(G.rakyat + 2 + n * 1.5);
  E.teks(new THREE.Vector3(sumber.x, tinggi(sumber.x, sumber.z) + 5, sumber.z), 'KLAKSON MASSAL!', 'besar buruk', 0.3);
}
function tutupkan(u) {
  u.tutup = true; G.rakyat = batas(G.rakyat + 4);
  if (u.jenis === 'ojol') {
    u.sisaTutup = 90; G.ojolMogok++; u.label.userData.set('OJOL MOGOK', 'mogok');
    toast('Abang ojol mogok setelah dipajaki berkali-kali. Jalan terasa lebih sepi.'); monolog('mogok');
  } else {
    u.sisaTutup = LAMA_TUTUP; G.gulungTikar++;
    const d = u.g.userData; d.pemilik.visible = false; d.tutup.visible = true; d.label.visible = false; d.atap.color.setHex(0x777777);
    toast(`${u.nama} gulung tikar setelah dipajaki berkali-kali.`); monolog('tutup');
  }
  E.semburan(new THREE.Vector3(u.x, tinggi(u.x, u.z) + 1.5, u.z), 'debu', 14); bunyi.gagal();
}
function visualTutup(u, tutup) {
  if (u.jenis === 'ojol') { u.label.userData.set(tutup ? 'OJOL MOGOK' : 'OJOL ' + u.tipe.toUpperCase(), tutup ? 'mogok' : u.tipe); return; }
  const d = u.g.userData; d.pemilik.visible = !tutup; d.tutup.visible = tutup; d.label.visible = !tutup; d.atap.color.setHex(tutup ? 0x777777 : d.warnaAsli);
}
function bukaLagi(u) {
  u.tutup = false; u.berhasil = 0; u.cd = 0;
  if (u.jenis === 'ojol') { u.label.userData.set('OJOL ' + u.tipe.toUpperCase(), u.tipe); return; }
  const d = u.g.userData; d.pemilik.visible = true; d.tutup.visible = false; d.label.visible = true; d.atap.color.setHex(d.warnaAsli);
}
function sewaAparat() {
  if (G.cuan < HARGA.aparat) return toast(`Cuan kurang (butuh ${HARGA.aparat}) untuk sewa aparat.`);
  G.cuan -= HARGA.aparat; G.aparat = Math.min(G.aparat + DURASI_APARAT, DURASI_APARAT * 3);
  while (daftarAparat.length < 2) { const a = aparatSewaan(); a.position.copy(pemain.position); scene.add(a); daftarAparat.push(a); E.semburan(a.position.clone().setY(a.position.y + 1), 'debu', 10); }
  fxTujuan = depanPemain(4, 2); bunyi.pop();
  toast(`Aparat disewa ${DURASI_APARAT} detik. Palak 100% berhasil, tapi 25% hasilnya untuk mereka.`); monolog('aparat');
}

// ---------- Hutan, sawit, bangunan ----------
function ubahStatus(p, status) { p.status = status; dunia.tampilkan(p); }
const pusatPetak = (p, y = 1) => V(p.cx, p.cz, y);
function bakar(p) {
  if (!p || p.status !== 'hutan') return;
  if (G.berkas > 0) { G.berkas--; G.panas = batas(G.panas + 1); toast('Dibakar "sesuai prosedur". Berkas terpakai.'); }
  else { G.panas = batas(G.panas + 3); toast('Dibakar tanpa berkas. Titik panas terlihat satelit.'); }
  G.stat.bakar++; p.api = DURASI_API; ubahStatus(p, 'api'); monolog('bakar');
  E.semburan(pusatPetak(p, 1), 'api', 34); E.semburan(pusatPetak(p, 3), 'asap', 8); E.getar(0.3); bunyi.api();
}
function tebang(p) {
  if (!p || p.status !== 'hutan' || !bisaBayar(HARGA.tebang)) return;
  G.cuan -= HARGA.tebang; p.umurLahan = 0; ubahStatus(p, 'lahan'); fxTujuan = pusatPetak(p, 2);
  E.semburan(pusatPetak(p, 2), 'kayu', 28); E.semburan(pusatPetak(p, 1), 'daun', 14); E.getar(0.25); bunyi.kayu();
  toast('Ditebang manual. Mahal dan lama. Tidak ada yang memuji.'); monolog('tebang');
}
function tanam(p, oleh = null) {
  if (!p || p.status !== 'lahan') return;
  if (G.cuan < HARGA.tanam) { if (!oleh) bisaBayar(HARGA.tanam); return; }
  G.cuan -= HARGA.tanam; p.siklus = 0; G.stat.tanam++; ubahStatus(p, 'sawit'); fxTujuan = pusatPetak(p, 2);
  E.semburan(pusatPetak(p, 1), 'daun', 22); E.semburan(pusatPetak(p, 0.5), 'debu', 8); bunyi.tanam();
  if (oleh) E.koinKeluar(pusatPetak(p, 2), 3);
  toast('Sawit ditanam. Penghasilan mengalir.'); monolog('sawit');
}
function bisaBayar(biaya) { if (G.cuan < biaya) { toast(`Cuan kurang (butuh ${biaya}). Coba PALAK UMKM atau ojol dulu.`); bunyi.blokir(); return false; } return true; }
const easeBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
function pasangBangunan(jenis, x, z, rotY, skalaAwal = 1) {
  const g = jenis === 'mbg' ? bangunanMBG() : bangunanKopdes();
  const fond = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 11), M.batu); fond.position.y = -1.6; g.add(fond);
  g.position.set(x, tinggi(x, z), z); g.rotation.y = rotY; g.scale.setScalar(skalaAwal); scene.add(g);
  const b = { jenis, umur: 0, mangkrak: false, g, x, z, pop: skalaAwal < 1 ? 0 : 1 };
  G.bangunan.push(b); tambahJejak(x, z, 9, 'bangunan'); dunia.bersihkan(x, z, 14);
  return b;
}
function bangun(jenis) {
  const biaya = HARGA[jenis], ry = pemain.rotation.y;
  const x = pemain.position.x + Math.sin(ry) * 9, z = pemain.position.z + Math.cos(ry) * 9;
  const l = klasifikasi(x, z);
  if (l.k === 'air') return toast('Itu air. Izin reklamasinya belum terbit.');
  const pt = petakDi(x, z);
  if (pt && (pt.status === 'hutan' || pt.status === 'sawit')) return toast(`Petak ini masih ditumbuhi ${pt.status === 'hutan' ? 'hutan' : 'sawit'}. Bakar atau tebang dulu, baru bangun.`);
  if (pt && pt.status === 'api') return toast('Api sedang menyala. Tunggu padam dulu.');
  if (!l.benar && !adaTempat(x, z, 9, 1)) return toast('Sudah ada bangunan di sini. Geser sedikit.');
  if (!bisaBayar(biaya)) return;
  if (l.benar) {
    G.cuan = Math.max(0, G.cuan - 10); G.restu = batas(G.restu - 3); G.stat.blokir++;
    E.teks(depanPemain(5, 3.5), 'DIBLOKIR', 'besar buruk'); E.getar(0.3); bunyi.blokir(); kilat('#d6453d');
    toast('DIBLOKIR: ' + acak(BLOKIR) + ' (biaya administrasi 10)'); monolog('blokir');
    return;
  }
  G.cuan += (jenis === 'mbg' ? 160 : 130) - biaya;
  G.restu = batas(G.restu + 4); G.panas = batas(G.panas + 2); G.citra += 3; G.stat.bangun++;
  const slhs = jenis === 'mbg' && G.berkas > 0;
  if (slhs) G.berkas--;
  const rec = pasangBangunan(jenis, x, z, ry + Math.PI, 0.01);
  rec.slhs = slhs; rec.lok = l.k; NPC.dapurBaru(rec);
  const rot = ry + Math.PI, depan = [Math.sin(rot), Math.cos(rot)], kanan = [Math.cos(rot), -Math.sin(rot)];
  const calon = [[kanan[0] * 17, kanan[1] * 17], [-kanan[0] * 17, -kanan[1] * 17], [depan[0] * 18, depan[1] * 18], [-depan[0] * 18, -depan[1] * 18]];
  const tempat = calon.map(([dx, dz]) => [x + dx, z + dz]).find(([bx, bz]) => tinggi(bx, bz) > 0.6 && !klasifikasi(bx, bz).benar && !petakDi(bx, bz) && adaTempat(bx, bz, 6, 0.5));
  if (tempat) pasangBaliho(tempat[0], tempat[1], rot, undefined, true);
  const pusat = V(x, z, 2);
  fxSumber = pusat; E.semburan(pusat, 'debu', 34); E.semburan(V(x, z, 6), 'konfeti', 36); E.getar(0.5); bunyi.bangun();
  E.teks(V(x, z, 9), jenis === 'mbg' ? 'DAPUR EMAS!' : 'KOPDES EMAS!', 'besar emas');
  toast(`${jenis === 'mbg' ? 'DAPUR EMAS (MBG)' : 'KOPDES EMAS'} berdiri ${LOKASI[l.k]}${jenis === 'mbg' ? (slhs ? ' SLHS: lengkap, di atas kertas (1 berkas terpakai).' : ' SLHS: sedang diproses (sejak 2024).') : ''}`); monolog('bangun');
}
function selfie() {
  const dekat = G.bangunan.some(b => jarakDua(pemain.position.x, pemain.position.z, b.x, b.z) < 18);
  kilat(); G.selfie++; bunyi.selfie();
  if (dekat) { G.citra += 10; G.restu = batas(G.restu + 2); E.semburan(pemain.position.clone().setY(pemain.position.y + 3), 'konfeti', 22); toast('Selfie di depan "capaian". Citra +10.'); }
  else { G.citra += 2; toast('Selfie biasa. Citra +2. Cari latar yang lebih berprestasi.'); }
  monolog('selfie');
}
function ngeles() {
  if (G.citra < 20) { bunyi.blokir(); return toast('Citra kurang (butuh 20) untuk konferensi pers.'); }
  G.citra -= 20; G.rakyat = batas(G.rakyat - 15); G.panas = batas(G.panas - 5);
  E.semburan(pemain.position.clone().setY(pemain.position.y + 3), 'percik', 18); bunyi.misi();
  toast('Konferensi pers: "Itu hoaks, tapi sudah kami evaluasi." Amarah rakyat turun.'); monolog('ngeles');
}
function beliGelar() {
  if (G.gelar >= GELAR.length) return toast('Semua gelar sudah dibeli. Nama Anda tidak muat di kartu nama.');
  const b = hargaGelar(G.gelar); if (!bisaBayar(b)) return;
  G.cuan -= b; G.citra += 15; G.restu = batas(G.restu + 3);
  E.semburan(pemain.position.clone().setY(pemain.position.y + 3.5), 'konfeti', 30); bunyi.misi();
  E.teks(pemain.position.clone().setY(pemain.position.y + 4.5), GELAR[G.gelar], 'besar emas', 0.5);
  toast(`Gelar kehormatan dari "universitas" mitra: ${GELAR[G.gelar++]}. Citra +15.`); monolog('gelar');
}
function beliPupuk() {
  if (G.pupuk >= MAKS_PUPUK) return toast('Pupuk sudah maksimal. Sawit Anda lebih subur dari anggaran.');
  const b = hargaPupuk(G.pupuk); if (!bisaBayar(b)) return;
  G.cuan -= b; G.pupuk++; bunyi.tanam(); E.semburan(pemain.position.clone().setY(pemain.position.y + 1), 'daun', 22);
  toast(`Pupuk level ${G.pupuk}: hasil sawit +${G.pupuk * 40}%.`); monolog('pupuk');
}
function rekrutOknum() {
  if (G.oknum >= MAKS_OKNUM) return toast('Oknum sudah penuh. Kantor tidak muat lagi.');
  const b = hargaOknum(G.oknum); if (!bisaBayar(b)) return;
  G.cuan -= b; G.oknum++;
  const f = manusia(M.rompi, false); f.position.copy(pemain.position); scene.add(f);
  daftarOknum.push({ f, waktu: 2 }); E.semburan(f.position.clone().setY(f.position.y + 1), 'debu', 12); bunyi.pop();
  toast('Oknum direkrut: otomatis menanam dan membakar. Anda hanya bertanggung jawab atas fotonya.'); monolog('oknum');
}
function jalankanAksi(k) {
  const p = petakDi(pemain.position.x, pemain.position.z);
  if (k === 'x') palak(); else if (k === 'v') sewaAparat();
  else if (k === 'b') bakar(p); else if (k === 't') tebang(p); else if (k === 'p') tanam(p);
  else if (k === '1') bangun('mbg'); else if (k === '2') bangun('kopdes');
  else if (k === 'f') selfie(); else if (k === 'c') ngeles();
  else if (k === 'g') beliGelar(); else if (k === 'u') beliPupuk(); else if (k === 'o') rekrutOknum();
  else if (k === 'j') lompat(); else if (k === 'n') naikTurun(); else if (k === 'h') klakson();
  else if (k === 'r') laporan(false);
  else if (k === 'e') { if (!dekatKantor()) toast('Berkas dibeli di Kantor Dinas.'); else if (bisaBayar(HARGA.berkas)) { G.cuan -= HARGA.berkas; G.berkas++; fxTujuan = V(KANTOR.x, KANTOR.z, 6); bunyi.pop(); toast('Berkas rapi dibeli. Perisai +1.'); monolog('berkas'); } }
  else if (k === 'k') { if (!dekatKantor()) toast('Kambing hitam dicari di Kantor Dinas.'); else if (bisaBayar(HARGA.kambing)) { G.cuan -= HARGA.kambing; G.panas = batas(G.panas - 30); G.restu = batas(G.restu - 2); fxTujuan = V(KANTOR.x, KANTOR.z, 6); bunyi.pop(); toast('Staf "penanggung jawab" dimutasi. Panas KPK -30.'); } }
}
function aksiTombol(k) {
  if (!G.jalan || G.jeda) return;
  const sebelum = ambil();
  jalankanAksi(k);
  umumkan(sebelum, ambil());
}

// ---------- Misi ----------
const terdekat = (status) => PETAK.filter(p => p.status === status).sort((a, b) => jarakDua(pemain.position.x, pemain.position.z, a.cx, a.cz) - jarakDua(pemain.position.x, pemain.position.z, b.cx, b.cz))[0];
const terdekatDari = (daftar) => daftar.slice().sort((a, b) => jarakDua(pemain.position.x, pemain.position.z, a.cx ?? a.x, a.cz ?? a.z) - jarakDua(pemain.position.x, pemain.position.z, b.cx ?? b.x, b.cz ?? b.z))[0];
const MISI_DEF = [
  { selesai: () => G.stat.palak >= 1, target: () => terdekatDari(KIOS.concat(OJOL).filter(u => !u.tutup && u.cd <= 0)) || KIOS[0], sorot: 'x' },
  { selesai: () => G.stat.bakar >= 1, target: () => terdekat('hutan'), sorot: 'b' },
  { selesai: () => G.stat.tanam >= 1, target: () => terdekat('lahan') || terdekat('api') || terdekat('hutan'), sorot: 'p' },
  { selesai: () => PETAK.filter(p => p.status === 'sawit').length >= 3, target: () => terdekat('lahan') || terdekat('hutan'), sorot: 'p' },
  { selesai: () => G.stat.bangun >= 1, target: () => TITIK_BEBAS, sorot: '1' },
  { selesai: () => G.stat.blokir >= 1, target: () => terdekatDari(DESA), sorot: '1' },
  { selesai: () => G.stat.naik >= 1, target: () => KENDARAAN[0], sorot: 'n' },
  { selesai: () => false, target: () => null, sorot: null },
];
let targetTerakhir = null, wMisiBaru = 0, misiTampil = -1, sigTombol = '';
function perbaruiMisi() {
  const sebelum = G.misi;
  while (G.misi < MISI_DEF.length - 1 && MISI_DEF[G.misi].selesai()) { G.misi++; }
  if (G.misi !== sebelum) {
    toast(`Misi ${G.misi} selesai! Lanjut ke misi berikutnya.`); wMisiBaru = 5;
    E.semburan(pemain.position.clone().setY(pemain.position.y + 3), 'konfeti', 40); E.teks(pemain.position.clone().setY(pemain.position.y + 4.5), 'MISI SELESAI!', 'besar emas'); bunyi.misi();
  }
  const d = MISI_DEF[G.misi];
  const t = d.target() || targetTerakhir; // jangan sampai penanda hilang
  targetTerakhir = t;
  const tx = t ? (t.cx ?? t.x) : null, tz = t ? (t.cz ?? t.z) : null;
  const px = pemain.position.x, pz = pemain.position.z;
  const jarakT = t ? jarakDua(px, pz, tx, tz) : 0, jauh = jarakT > 22;
  if (t) {
    const u = tujuan.userData;
    tujuan.visible = true; tujuan.position.set(tx, tinggi(tx, tz), tz);
    u.tabung.visible = jauh;
    u.kerucut.position.y = (jauh ? 14 : 10) + Math.sin(waktu * 4) * 1.2;
    const s = 1 + 0.12 * Math.sin(waktu * 5); u.cincin.scale.set(s, s, s);
  } else tujuan.visible = false;
  // Teks misi (diperbarui hanya saat berganti langkah atau perangkat berubah)
  if (misiTampil !== G.misi) {
    misiTampil = G.misi;
    $('misiNo').textContent = `MISI ${G.misi + 1}/${MISI_DEF.length}`;
    $('misiTeks').innerHTML = isiTombol(sentuh && MISI[G.misi].ringkas ? MISI[G.misi].ringkas : MISI[G.misi].teks);
  }
  $('misi').classList.toggle('baru', wMisiBaru > 0);
  // Panah kompas di layar menunjuk ke tujuan
  const kp = $('panah');
  if (t) {
    const ikon = $('panahIkon');
    if (jarakT > 6) {
      const dx = tx - px, dz = tz - pz;
      const kanan = dx * Math.cos(yaw) + dz * -Math.sin(yaw), depan = dx * -Math.sin(yaw) + dz * -Math.cos(yaw);
      if (ikon.textContent !== '➤') ikon.textContent = '➤';
      ikon.style.transform = `rotate(${Math.atan2(kanan, depan)}rad)`;
      $('panahJarak').textContent = Math.round(jarakT) + ' m';
    } else {
      if (ikon.textContent !== '✔') ikon.textContent = '✔';
      ikon.style.transform = 'none';
      $('panahJarak').textContent = 'Sampai!';
    }
    kp.style.visibility = 'visible';
  } else kp.style.visibility = 'hidden';
  return d.sorot;
}

// Tombol sentuh: sorot yang harus ditekan, redupkan yang belum perlu, dan taruh gelembung "Ketuk" di atasnya
function perbaruiTombol(s, rel = new Set()) {
  const buka = MISI[G.misi].buka;
  if (s) rel.add(s);
  const sig = s + '|' + G.misi + '|' + [...rel].join('');
  if (sig !== sigTombol) {
    sigTombol = sig;
    document.querySelectorAll('#aksiSentuh button[data-k]').forEach(b => {
      b.classList.toggle('sorot', b.dataset.k === s);
      b.classList.toggle('relevan', rel.has(b.dataset.k));
      b.classList.toggle('redup', !!buka && !buka.includes(b.dataset.k) && b.dataset.k !== s);
    });
  }
  const gl = $('gelembung');
  if (sentuh && s) {
    const bt = document.querySelector(`#aksiSentuh button[data-k="${s}"]`);
    if (bt) { const r = bt.getBoundingClientRect(); gl.style.left = (r.left + r.width / 2) + 'px'; gl.style.top = (r.top - 30) + 'px'; gl.textContent = 'Ketuk ' + NAMA_TOMBOL[s] + ' ▼'; gl.style.visibility = 'visible'; return; }
  }
  gl.style.visibility = 'hidden';
}


// ---------- Satir: pangkat, prestasi, berita ----------
let wSatir = 0, wBerita = 25;
function satirTick(dt) {
  if (!G.jalan || G.jeda) return;
  if (wBerita > 0 && (wBerita -= dt) <= 0) {
    wBerita = 38 + Math.random() * 20;
    const hutan = Math.round(PETAK.filter(p => p.status === 'hutan').length / PETAK.length * 100);
    $('berita').innerHTML = '<b>BERITA</b> ' + pilihBerita(G, { hutanPersen: hutan, mangkrak: G.bangunan.filter(b => b.mangkrak).length });
    $('berita').style.opacity = 1; wBeritaTampil = 7; bunyi.pop();
  }
  if (wUcap > 0 && (wUcap -= dt) <= 0) $('ucapan').style.opacity = 0;
  if (wBeritaTampil > 0 && (wBeritaTampil -= dt) <= 0) $('berita').style.opacity = 0;
  if ((wSatir -= dt) > 0) return;
  wSatir = 1;
  const pk = pangkatDari(G.citra);
  if (pk > G.pangkat) {
    G.pangkat = pk; toast('NAIK PANGKAT: ' + PANGKAT[pk][1]); E.teks(pemain.position.clone().setY(pemain.position.y + 4.5), 'NAIK PANGKAT!', 'besar emas'); E.semburan(pemain.position.clone().setY(pemain.position.y + 3), 'konfeti', 40); bunyi.misi();
  }
  $('pangkat').textContent = PANGKAT[G.pangkat][1];
  for (const pr of PRESTASI) {
    if (G.prestasi.includes(pr.id) || !pr.ok(G)) continue;
    G.prestasi.push(pr.id);
    toast(`PRESTASI: ${pr.nama}. ${pr.ket}`); E.teks(pemain.position.clone().setY(pemain.position.y + 4.5), 'PRESTASI!', 'besar emas'); bunyi.misi();
    break;
  }
}
let wBeritaTampil = 0;

// ---------- Jalan kaki, lompat, kendaraan ----------
const fis = { vy: 0, tanah: true };
function jalanKaki(dt) {
  const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  let mx = 0, mz = 0;
  if (tombol.w || tombol.arrowup) { mx += fx; mz += fz; }
  if (tombol.s || tombol.arrowdown) { mx -= fx; mz -= fz; }
  if (tombol.d || tombol.arrowright) { mx += rx; mz += rz; }
  if (tombol.a || tombol.arrowleft) { mx -= rx; mz -= rz; }
  if (joyX || joyY) { mx += fx * -joyY + rx * joyX; mz += fz * -joyY + rz * joyX; }
  const bergerak = mx || mz;
  if (bergerak) {
    const n = Math.hypot(mx, mz), lari = tombol.shift || Math.hypot(joyX, joyY) > 0.9, v = (lari ? 18 : 10) * dt;
    const nx = pemain.position.x + mx / n * v, nz = pemain.position.z + mz / n * v;
    if (lantai(nx, nz) > 0.25 && Math.hypot(nx, nz) < R - 8) { pemain.position.x = nx; pemain.position.z = nz; }
    else if (lantai(nx, pemain.position.z) > 0.25) pemain.position.x = nx;
    else if (lantai(pemain.position.x, nz) > 0.25) pemain.position.z = nz;
    pemain.rotation.y = Math.atan2(mx, mz);
  }
  const ayun = (bergerak && fis.tanah) ? Math.sin(waktu * 12) * 0.7 : 0;
  lenganK.rotation.x = ayun; lenganN.rotation.x = -ayun; kakiK.rotation.x = -ayun; kakiN.rotation.x = ayun;
  if (!fis.tanah) { lenganK.rotation.x = lenganN.rotation.x = -2.4; kakiK.rotation.x = 0.5; kakiN.rotation.x = -0.4; }
  // Tinggi: mengikuti tanah, atau fisika bila melompat / jatuh dari tebing
  const dasar = lantai(pemain.position.x, pemain.position.z);
  if (fis.tanah && pemain.position.y <= dasar + 0.35) {
    const yT = dasar + (bergerak ? Math.abs(Math.sin(waktu * 12)) * 0.15 : 0);
    pemain.position.y += (yT - pemain.position.y) * Math.min(1, dt * 14);
  } else {
    fis.tanah = false; fis.vy -= 30 * dt; pemain.position.y += fis.vy * dt;
    if (pemain.position.y <= dasar) {
      const vJatuh = fis.vy; pemain.position.y = dasar; fis.vy = 0; fis.tanah = true;
      if (vJatuh < -6) { E.semburan(pemain.position.clone().setY(dasar + 0.3), 'debu', 10); bunyi.mendarat(); }
    }
  }
  if (Math.abs(kamera.fov - 60) > 0.2) { kamera.fov += (60 - kamera.fov) * Math.min(1, dt * 4); kamera.updateProjectionMatrix(); }
}
function lompat() {
  if (G.naik && G.naik.jenis === 'mobil') return toast('Mobil dinas tidak bisa melompat. Itu bukan kuda.');
  if (G.naik) { if (!G.naik.tanah) return; G.naik.vy = 9; G.naik.tanah = false; }
  else { if (!fis.tanah) return; fis.vy = 11; fis.tanah = false; }
  G.stat.lompat++; bunyi.lompat(); E.semburan(pemain.position.clone().setY(pemain.position.y + 0.3), 'debu', 6);
}
function kendarai(dt, k) {
  let gas = 0, kemudi = 0;
  if (tombol.w || tombol.arrowup) gas += 1;
  if (tombol.s || tombol.arrowdown) gas -= 1;
  if (tombol.a || tombol.arrowleft) kemudi += 1;
  if (tombol.d || tombol.arrowright) kemudi -= 1;
  gas = Math.max(-1, Math.min(1, gas - joyY)); kemudi = Math.max(-1, Math.min(1, kemudi - joyX));
  const arah = k.v >= 0 ? 1 : -1, kontrol = Math.min(1, Math.abs(k.v) / 5);
  k.ry += kemudi * k.belok * kontrol * arah * dt;
  if (gas > 0.1) k.v += gas * (k.jenis === 'mobil' ? 20 : 24) * dt * (k.v < 0 ? 2 : 1);
  else if (gas < -0.1) k.v += gas * (k.v > 0 ? 42 : 12) * dt;
  else k.v -= Math.sign(k.v) * Math.min(Math.abs(k.v), 9 * dt);
  k.v = Math.max(-9, Math.min(k.maks, k.v));
  const nx = k.x + Math.sin(k.ry) * k.v * dt, nz = k.z + Math.cos(k.ry) * k.v * dt;
  if (lantai(nx, nz) > 0.25 && Math.hypot(nx, nz) < R - 8) { k.x = nx; k.z = nz; }
  else { if (Math.abs(k.v) > 4) { E.getar(0.25); bunyi.tabrak(); } k.v *= -0.25; }
  for (const f of FOOT) { // menabrak bangunan dan baliho
    if (f.r < 3 || f.n === 'spawn' || f.n === 'jembatan') continue;
    const d = jarakDua(k.x, k.z, f.x, f.z), lim = f.r * 0.9 + 1.4;
    if (d < lim && d > 0.01) {
      k.x = f.x + (k.x - f.x) / d * lim; k.z = f.z + (k.z - f.z) / d * lim;
      if (Math.abs(k.v) > 6) { E.getar(Math.min(0.6, Math.abs(k.v) / 40)); bunyi.tabrak(); E.semburan(V(k.x, k.z, 1.5), 'debu', 8); }
      k.v *= -0.3;
    }
  }
  const dasar = lantai(k.x, k.z);
  if (k.tanah && k.y <= dasar + 0.6) k.y += (dasar - k.y) * Math.min(1, dt * 18);
  else {
    k.tanah = false; k.vy -= 30 * dt; k.y += k.vy * dt;
    if (k.y <= dasar) { const vj = k.vy; k.y = dasar; k.vy = 0; k.tanah = true; if (vj < -6) { E.semburan(V(k.x, k.z, 0.5), 'debu', 10); bunyi.mendarat(); } }
  }
  k.g.position.set(k.x, k.y, k.z); k.g.rotation.y = k.ry;
  if (k.jenis === 'motor') k.g.rotation.z += ((-kemudi * 0.35 * Math.min(1, Math.abs(k.v) / k.maks)) - k.g.rotation.z) * Math.min(1, dt * 6);
  k.g.userData.roda.forEach(r => { r.rotation.x += k.v * dt * 1.6; });
  pemain.position.set(k.x, k.y + k.duduk, k.z); pemain.rotation.y = k.ry; pemain.visible = k.jenis === 'motor';
  lenganK.rotation.x = lenganN.rotation.x = k.jenis === 'motor' ? -1.1 : 0; kakiK.rotation.x = kakiN.rotation.x = k.jenis === 'motor' ? -1.2 : 0;
  k.jejak -= dt;
  if (Math.abs(k.v) > 8 && k.jejak <= 0) { k.jejak = 0.12; E.semburan(V(k.x - Math.sin(k.ry) * 2, k.z - Math.cos(k.ry) * 2, 0.3), 'debu', 1); }
  if (k.jenis === 'mobil') { const kedip = Math.sin(waktu * 14) > 0; k.g.userData.lampuM.visible = kedip; k.g.userData.lampuB.visible = !kedip; }
  mesin(true, Math.abs(k.v) / k.maks);
  if (jari.size === 0 && Math.abs(k.v) > 1.5) { // kamera menyusul arah laju
    let d = k.ry + Math.PI - yaw; d = ((d + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; yaw += d * Math.min(1, dt * 2.2);
  }
  const fovT = 60 + 16 * Math.abs(k.v) / k.maks; kamera.fov += (fovT - kamera.fov) * Math.min(1, dt * 4); kamera.updateProjectionMatrix();
}
const kendaraanDekat = () => { let b = null; for (const k of KENDARAAN) { const d = jarakDua(pemain.position.x, pemain.position.z, k.x, k.z); if (d < 9 && (!b || d < b.d)) b = { k, d }; } return b ? b.k : null; };
function naikTurun() {
  if (G.naik) {
    const k = G.naik; G.naik = null; k.v = 0; mesin(false);
    let sx = k.x - Math.cos(k.ry) * 4, sz = k.z + Math.sin(k.ry) * 4;
    if (lantai(sx, sz) < 0.25) { sx = k.x + Math.cos(k.ry) * 4; sz = k.z - Math.sin(k.ry) * 4; }
    pemain.position.set(sx, lantai(sx, sz), sz); pemain.visible = true; fis.vy = 0; fis.tanah = true; k.g.rotation.z = 0;
    if (k.jenis === 'mobil') k.g.userData.lampuM.visible = k.g.userData.lampuB.visible = false;
    bunyi.pop(); toast(`Turun dari ${k.nama}.`);
    return;
  }
  const k = kendaraanDekat();
  if (!k) return toast('Tidak ada kendaraan di dekat Anda. Motor ada dekat titik mulai, mobil dinas dekat Kantor Dinas.');
  G.naik = k; k.v = 0; G.stat.naik++; bunyi.pop(); E.semburan(V(k.x, k.z, 1), 'debu', 10);
  toast(`Naik ${k.nama}. Kemudikan dengan W/A/S/D atau joystick. Tekan ${sentuh ? 'Naik' : 'N'} lagi untuk turun.`);
}
function klakson() {
  if (!G.naik) return toast('Klakson hanya ada di kendaraan.');
  bunyi.klakson(); E.getar(0.1); E.teks(pemain.position.clone().setY(pemain.position.y + 3.5), 'TIIIN!', 'besar info');
  for (const o of OJOL) if (!o.tutup && jarakDua(o.x, o.z, G.naik.x, G.naik.z) < 35) o.klakson = Math.max(o.klakson, 1.4);
}

function perbaruiOjol(dt) {
  for (const o of OJOL) {
    if (o.cd > 0) o.cd -= dt;
    if (o.klakson > 0) o.klakson -= dt;
    if (o.tutup && (o.sisaTutup -= dt) <= 0) bukaLagi(o);
    const jarakP = jarakDua(pemain.position.x, pemain.position.z, o.x, o.z);
    const target = (o.tutup || o.klakson > 0 || (jarakP < 14 && o.cd <= 0)) ? 0 : o.vDasar;
    o.v += (target - o.v) * Math.min(1, dt * 3);
    if (o.v > 0.05) { o.s += o.arah * o.v * dt; if (o.s > o.tot) { o.s = o.tot; o.arah = -1; } if (o.s < 0) { o.s = 0; o.arah = 1; } }
    const p = titikJalur(o, o.s), hx = p.dx * o.arah, hz = p.dz * o.arah;
    o.x = p.x + hz * 2.4; o.z = p.z - hx * 2.4; // lajur kiri
    o.g.position.set(o.x, lantai(o.x, o.z), o.z);
    const ry = (o.klakson > 0 || o.marah > 0) ? Math.atan2(pemain.position.x - o.x, pemain.position.z - o.z) : Math.atan2(hx, hz);
    o.g.rotation.y += (((ry - o.g.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 8);
    o.g.userData.roda.forEach(r => { r.rotation.x += o.v * dt * 1.6; });
    const lengan = o.g.userData.pemilik.userData;
    if (o.marah > 0) { o.marah -= dt; lengan.lenganK.rotation.x = lengan.lenganN.rotation.x = -2.6 + Math.sin(waktu * 20) * 0.4; } else lengan.lenganK.rotation.x = lengan.lenganN.rotation.x = -0.9;
  }
}

// ---------- Pembaruan ----------
let waktu = 0, waktuPanen = 0, panenTotal = 0;
function update(dt) {
  waktu += dt;
  E.update(dt);
  if (wToast > 0 && (wToast -= dt) <= 0) $('toast').style.opacity = 0;
  if (wMono > 0 && (wMono -= dt) <= 0) $('monolog').style.opacity = 0;
  satirTick(dt);
  if (wMisiBaru > 0) wMisiBaru -= dt;
  if (!G.jalan || G.jeda) return;

  // Gerak: jalan kaki (dengan lompat) atau mengendarai motor/mobil
  if (G.naik) kendarai(dt, G.naik); else jalanKaki(dt);

  // Waktu, setoran
  G.t += dt;
  if (G.t >= G.bulan * DETIK_PER_BULAN) akhirBulan();

  // Petak
  let terbakar = 0, sawit = 0, panenAkum = 0;
  for (const p of PETAK) {
    if (p.status === 'sawit') {
      sawit++; p.siklus += dt;
      if (p.siklus >= SIKLUS_SAWIT) { p.siklus -= SIKLUS_SAWIT; const hasil = PENDAPATAN_SAWIT * (1 + 0.4 * G.pupuk); G.cuan += hasil; panenAkum += hasil; G.stat.panen++; if (jarakDua(pemain.position.x, pemain.position.z, p.cx, p.cz) < 45) E.semburan(V(p.cx + (Math.random() - 0.5) * 14, p.cz + (Math.random() - 0.5) * 14, 6), 'percik', 3); }
    } else if (p.status === 'api') {
      terbakar++; p.api -= dt; dunia.animasiApi(p, waktu);
      if ((p.asap = (p.asap || 0) - dt) <= 0 && jarakDua(pemain.position.x, pemain.position.z, p.cx, p.cz) < 110) { p.asap = 0.25; const px = p.cx + (Math.random() - 0.5) * 16, pz = p.cz + (Math.random() - 0.5) * 16; E.semburan(V(px, pz, 3), 'asap', 1); E.semburan(V(px, pz, 1), 'api', 1); }
      for (const q of PETAK) {
        if ((q.status === 'hutan' || q.status === 'sawit') && q.zona === p.zona && Math.abs(q.i - p.i) + Math.abs(q.j - p.j) === 1 && Math.random() < 0.035 * dt) {
          if (q.status === 'sawit') { toast('Api merambat ke kebun sawit Anda!'); bunyi.api(); E.getar(0.3); }
          q.api = DURASI_API; ubahStatus(q, 'api');
        }
      }
      if (p.api <= 0) { p.umurLahan = 0; ubahStatus(p, 'lahan'); }
    } else if (p.status === 'lahan') {
      p.umurLahan += dt;
      if (p.umurLahan > TUMBUH_KEMBALI) { ubahStatus(p, 'hutan'); monolog('tumbuh'); }
    }
  }
  dunia.sinkron();
  waktuPanen += dt; panenTotal += panenAkum;
  if (waktuPanen >= 1.5) {
    if (panenTotal > 0) {
      E.hudTeks('+' + Math.round(panenTotal) + ' panen', 'emas');
      const dekatSawit = PETAK.filter(p => p.status === 'sawit').sort((a, b) => jarakDua(pemain.position.x, pemain.position.z, a.cx, a.cz) - jarakDua(pemain.position.x, pemain.position.z, b.cx, b.cz))[0];
      if (dekatSawit && jarakDua(pemain.position.x, pemain.position.z, dekatSawit.cx, dekatSawit.cz) < 90) E.koinMasuk(V(dekatSawit.cx, dekatSawit.cz, 5), Math.min(8, 2 + Math.floor(panenTotal / 15)));
    }
    panenTotal = 0; waktuPanen = 0;
  }

  // Bangunan
  let mangkrak = 0, mangkrakMbg = 0, pasif = 0;
  for (const b of G.bangunan) {
    b.umur += dt;
    if (b.pop < 1) { b.pop = Math.min(1, b.pop + dt / 0.8); b.g.scale.setScalar(Math.max(0.01, easeBack(b.pop))); }
    if (!b.mangkrak) { if (G.t >= (b.sampai || 0)) { G.cuan += dt; pasif++; } if (b.umur > (b.jenis === 'mbg' ? UMUR_MANGKRAK_MBG : UMUR_MANGKRAK)) { b.mangkrak = true; mangkrakkan(b.g); E.semburan(V(b.x, b.z, 3), 'debu', 24); bunyi.kayu(); G.rakyat = batas(G.rakyat + 3); if (b.jenis === 'mbg') G.stunting += 0.3; monolog('mangkrak'); } }
    else { mangkrak++; if (b.jenis === 'mbg') mangkrakMbg++; }
  }

  // UMKM
  for (const u of KIOS) {
    if (u.cd > 0) u.cd -= dt;
    if (u.tutup && (u.sisaTutup -= dt) <= 0) bukaLagi(u);
    const o = u.g.userData.pemilik;
    if (u.marah > 0) { u.marah -= dt; o.userData.lenganK.rotation.x = o.userData.lenganN.rotation.x = -2.6 + Math.sin(waktu * 20) * 0.4; } else { o.userData.lenganK.rotation.x = o.userData.lenganN.rotation.x = 0; }
  }

  perbaruiOjol(dt);
  NPC.update(dt);

  // Aparat sewaan mengikuti pemain; oknum bekerja
  if (G.aparat > 0) {
    G.aparat -= dt;
    daftarAparat.forEach((a, i) => {
      const tx = pemain.position.x - Math.sin(pemain.rotation.y) * 3 + (i ? 3 : -3) * Math.cos(pemain.rotation.y), tz = pemain.position.z - Math.cos(pemain.rotation.y) * 3 - (i ? 3 : -3) * Math.sin(pemain.rotation.y);
      a.position.x += (tx - a.position.x) * Math.min(1, dt * 6); a.position.z += (tz - a.position.z) * Math.min(1, dt * 6);
      a.position.y = lantai(a.position.x, a.position.z); a.rotation.y = pemain.rotation.y;
    });
    if (G.aparat <= 0) { G.aparat = 0; daftarAparat.splice(0).forEach(a => scene.remove(a)); toast('Kontrak aparat habis. Pemilik kios galak kembali menakutkan.'); }
  }
  for (const o of daftarOknum) {
    o.waktu -= dt; if (o.waktu > 0) continue;
    o.waktu = 6;
    const lahan = terdekat('lahan'), hutan = terdekat('hutan'), api = PETAK.filter(p => p.status === 'api').length;
    if (lahan && G.cuan >= HARGA.tanam) { o.f.position.set(lahan.cx, lantai(lahan.cx, lahan.cz), lahan.cz); tanam(lahan, true); }
    else if (hutan && api < 2) { o.f.position.set(hutan.cx, lantai(hutan.cx, hutan.cz), hutan.cz); G.panas = batas(G.panas + 1); G.stat.bakar++; hutan.api = DURASI_API; ubahStatus(hutan, 'api'); E.semburan(pusatPetak(hutan, 1), 'api', 24); E.semburan(pusatPetak(hutan, 3), 'asap', 6); if (jarakDua(pemain.position.x, pemain.position.z, hutan.cx, hutan.cz) < 80) bunyi.api(); }
  }

  // Kabut, amarah, panas, stunting, penghasilan
  G.kabut = batas(G.kabut + (terbakar ? terbakar * 0.5 : -0.6) * dt);
  G.kabutPuncak = Math.max(G.kabutPuncak, G.kabut);
  G.rakyat = batas(G.rakyat + ((G.kabut > 50 ? (G.kabut - 50) / 50 * 0.6 : -0.15) + 0.015 * mangkrak) * dt);
  G.panas = batas(G.panas + ((G.kabut > 40 ? terbakar * 0.3 : 0) - 0.2) * dt);
  G.stunting = Math.min(40, G.stunting + (G.kabut / 100 * 0.03 + mangkrakMbg * 0.002) * dt);
  G.penghasilan = sawit * PENDAPATAN_SAWIT * (1 + 0.4 * G.pupuk) / SIKLUS_SAWIT + pasif;
  const t = G.kabut / 100;
  scene.fog.density = 0.0028 + t * 0.014;
  scene.fog.color.copy(WARNA_LANGIT).lerp(WARNA_KABUT, t);
  scene.background.copy(scene.fog.color);
  dunia.awan.forEach(a => { a.position.x += dt * 2; if (a.position.x > 520) a.position.x = -520; });

  // Denda (mode santai: bukan game over)
  if (G.restu <= 0) denda('restu');
  else if (G.panas >= 100) denda('panas');
  else if (G.rakyat >= 100) denda('rakyat');

  // Petunjuk interaksi
  const sorot = perbaruiMisi();
  const p = petakDi(pemain.position.x, pemain.position.z), u = kiosDekat();
  let h = '';
  const kd = kendaraanDekat();
  if (G.naik) h = `${G.naik.nama} · ${tb('n')} Turun · ${tb('h')} Klakson${G.naik.jenis === 'motor' ? ` · ${tb('j')} Lompat` : ''}`;
  else if (kd && !u) h = `${kd.nama}: ${tb('n')} Naik · ${tb('j')} Lompat`;
  else if (u) {
    const peluang = G.aparat > 0 ? 100 : Math.round(PELUANG[u.tipe] * 100);
    const oj = u.jenis === 'ojol';
    h = u.tutup ? `${u.nama}: ${oj ? 'sedang mogok.' : 'gulung tikar.'}` : sentuh ? `${u.nama} · ${u.tipe.toUpperCase()} · peluang ${peluang}%${G.aparat > 0 ? ' (aparat aktif)' : ''}` : `${u.nama} · ${oj ? 'pengendara' : 'pemilik'} ${u.tipe.toUpperCase()} · peluang ${peluang}% · ${tb('x')} Palak${G.aparat > 0 ? ' (aparat aktif)' : ` · ${tb('v')} Sewa aparat (${HARGA.aparat})`}`;
  } else if (p) {
    if (p.status === 'hutan') h = `Petak hutan: ${tb('b')} Bakar (gratis) · ${tb('t')} Tebang (${HARGA.tebang})`;
    else if (p.status === 'lahan') h = `Lahan terbuka: ${tb('p')} Tanam sawit (${HARGA.tanam})`;
    else if (p.status === 'sawit') h = 'Kebun sawit: panen otomatis. Jauhkan dari api.';
    else if (p.status === 'api') h = 'Api sedang menyala. Itu "pembukaan lahan".';
  } else if (dekatKantor()) h = `Kantor Dinas: ${tb('e')} Berkas (${HARGA.berkas}) · ${tb('k')} Kambing hitam (${HARGA.kambing})`;
  setPrompt(h);
  if (u && !u.tutup && u !== uSapa && G.t > (u.sapaLagi || 0)) { ucap(u, 's'); u.sapaLagi = G.t + 60; }
  uSapa = u || null;
  // Sorot tombol hanya saat aksinya benar-benar bisa dilakukan sekarang
  let s = null;
  const tt = targetTerakhir, dekatTarget = tt && jarakDua(pemain.position.x, pemain.position.z, tt.cx ?? tt.x, tt.cz ?? tt.z) < 20;
  if (u && !u.tutup && u.cd <= 0 && (G.misi === 0 || G.cuan < HARGA.tanam)) s = 'x';
  else if (p && p.status === 'hutan' && (G.misi === 1 || G.misi === 3)) s = 'b';
  else if (p && p.status === 'lahan' && G.misi >= 2 && G.cuan >= HARGA.tanam) s = 'p';
  else if ((G.misi === 4 || G.misi === 5) && dekatTarget && !p) s = '1';
  if (G.misi === 6 && !G.naik && kd) s = 'n';
  const rel = new Set(['j']);
  if (G.naik) { rel.add('n'); rel.add('h'); } else if (kd) rel.add('n');
  if (u && !u.tutup) { rel.add('x'); rel.add('v'); }
  if (p && p.status === 'hutan') { rel.add('b'); rel.add('t'); } else if (p && p.status === 'lahan') rel.add('p'); else if (p && p.status === 'sawit') rel.add('t');
  if (dekatKantor()) { rel.add('e'); rel.add('k'); }
  if (!G.naik && !u && !dekatKantor() && !(p && p.status !== 'lahan')) { rel.add('1'); rel.add('2'); }
  perbaruiTombol(s, rel);
}

function akhirBulan() {
  const kuota = kuotaBulan(G.bulan);
  if (G.cuan >= kuota) {
    G.cuan -= kuota; G.restu = batas(G.restu + 8); toast(`Setoran bulan ${G.bulan}: ${kuota}. Bos senang.`); monolog('setoranOk');
    E.koinKeluar(V(KANTOR.x, KANTOR.z, 7), Math.min(16, 5 + Math.floor(kuota / 40))); E.teks(depanPemain(3, 3.5), `Setoran -${kuota}`, 'besar rugi'); E.teks(depanPemain(3, 4.5), 'Restu +8', 'bagus', 0.35); E.hudTeks('-' + kuota, 'rugi'); bunyi.setoran();
  } else {
    G.restu = batas(G.restu - 12); toast(`Setoran bulan ${G.bulan} KURANG (${kuota}). Restu Bos -12.`); monolog('setoranKurang');
    E.teks(depanPemain(3, 3.5), 'SETORAN KURANG', 'besar buruk'); E.teks(depanPemain(3, 4.5), 'Restu -12', 'buruk', 0.35); E.getar(0.35); bunyi.gagal();
  }
  if (G.cuan < 20) G.cuan = 20;
  const tahunSelesai = G.bulan % 12 === 0;
  G.bulan++;
  if (tahunSelesai) laporan(true);
}

function denda(sebab) {
  const [judul, teks] = DENDA[sebab];
  if (sebab === 'restu') { G.cuan *= 0.6; G.restu = 45; G.rakyat = batas(G.rakyat - 10); }
  else if (sebab === 'panas') { G.cuan *= 0.6; G.panas = 25; G.berkas = 0; }
  else { G.cuan *= 0.7; G.rakyat = 35; G.restu = batas(G.restu - 10); }
  G.cuan = Math.floor(G.cuan);
  E.getar(0.6); bunyi.denda(); E.koinKeluar(depanPemain(6, 2), 10);
  kartu(judul, teks);
}

function laporan(tahunan) {
  const hutanSisa = Math.round(PETAK.filter(p => p.status === 'hutan').length / PETAK.length * 100);
  const mangkrak = G.bangunan.filter(b => b.mangkrak).length;
  const stuntingResmi = Math.max(10, 20 - Math.min(8, G.bangunan.length * 0.5 + G.citra * 0.02));
  const tahun = Math.floor((G.bulan - 1) / 12);
  $('laporanJudul').textContent = tahunan ? `Laporan Tahunan ke-${tahun}` : 'Laporan Kinerja (sementara)';
  $('laporanAlasan').textContent = tahunan ? 'Setahun berlalu. Bos meminta laporan. Anda menyiapkan dua versi.' : 'Dua versi laporan, satu kenyataan.';
  $('laporanResmi').innerHTML = `Serapan anggaran: <b>100%</b><br>Bangunan diresmikan: <b>${G.bangunan.length}</b><br>Baliho terpasang: <b>${G.baliho}</b><br>Penerimaan pajak daerah: <b>naik ${60 + G.stat.palak * 3}%</b><br>Kasus keracunan MBG: <b>0 (hanya "reaksi tubuh")</b><br>Stunting (laporan): <b>${stuntingResmi.toFixed(1)}%</b><br>Predikat: <b>SANGAT BERKINERJA</b>`;
  $('laporanNyata').innerHTML = `Hutan tersisa: <b>${hutanSisa}%</b><br>Bangunan mangkrak: <b>${mangkrak} dari ${G.bangunan.length}</b><br>UMKM gulung tikar: <b>${G.gulungTikar}</b><br>Ojol mogok: <b>${G.ojolMogok}</b><br>Siswa dirujuk ke puskesmas: <b>${G.korban}</b> (${G.insiden} kejadian)<br>Kas Kopdes masuk kantong Menteri: <b>${G.kasRaib || 0} kali</b><br>Pangkat: <b>${PANGKAT[G.pangkat][1]}</b><br>Prestasi: <b>${G.prestasi.length}/${PRESTASI.length}</b> ${G.prestasi.map(id => PRESTASI.find(x => x.id === id).nama).join(', ')}<br>Kabut puncak: <b>${Math.round(G.kabutPuncak)}/100</b><br>Stunting nyata: <b>${G.stunting.toFixed(1)}%</b><br>Amarah rakyat: <b>${Math.round(G.rakyat)}/100</b>`;
  G.jeda = true; $('laporan').hidden = false;
}
$('lanjut').onclick = () => { $('laporan').hidden = true; G.jeda = false; };

function hud() {
  const set = (id, v) => { $(id).style.width = Math.max(0, Math.min(100, v)) + '%'; };
  set('bRestu', G.restu); set('bPanas', G.panas); set('bRakyat', G.rakyat); set('bKabut', G.kabut);
  $('cuan').textContent = Math.floor(G.cuan);
  $('penghasilan').textContent = '+' + G.penghasilan.toFixed(1) + '/dtk';
  $('citra').textContent = Math.floor(G.citra);
  $('berkas').textContent = G.berkas;
  $('bulan').textContent = `Bulan ${G.bulan} (tahun ${Math.floor((G.bulan - 1) / 12) + 1})`;
  $('kuota').textContent = kuotaBulan(G.bulan);
  $('sisaBulan').textContent = Math.max(0, Math.ceil(G.bulan * DETIK_PER_BULAN - G.t)) + ' dtk';
  $('hutan').textContent = Math.round(PETAK.filter(p => p.status === 'hutan').length / PETAK.length * 100) + '%';
  $('stunting').textContent = G.stunting.toFixed(1) + '%';
  $('korban').textContent = G.korban;
  $('aparat').textContent = G.aparat > 0 ? `Aparat aktif ${Math.ceil(G.aparat)} dtk` : '';
  $('hargaAparat').textContent = HARGA.aparat;
  $('hargaPupuk').textContent = G.pupuk >= MAKS_PUPUK ? 'maks' : hargaPupuk(G.pupuk);
  $('hargaOknum').textContent = G.oknum >= MAKS_OKNUM ? 'maks' : hargaOknum(G.oknum);
  $('hargaGelar').textContent = G.gelar >= GELAR.length ? 'maks' : hargaGelar(G.gelar);
}

let pitchPakai = 0.42, jarakPakai = 11;
const getarTmp = new THREE.Vector3();
let kameraBebas = null; // hanya untuk pengambilan gambar promosi: { pos: [x,y,z], tgt: [x,y,z] }
function kameraIkut() {
  if (kameraBebas) { kamera.position.set(...kameraBebas.pos); kamera.lookAt(...kameraBebas.tgt); return; }
  const tx = pemain.position.x, ty = pemain.position.y + 2.2, tz = pemain.position.z;
  // Di dalam hutan, naikkan kamera supaya tajuk pohon tidak menutupi tokoh
  const dalamHutan = petakDi(tx, tz)?.status === 'hutan';
  pitchPakai += ((dalamHutan ? Math.max(pitch, 0.95) : pitch) - pitchPakai) * 0.08;
  jarakPakai += ((dalamHutan ? Math.max(jarak, 15) : jarak) - jarakPakai) * 0.08;
  let cx = tx + Math.sin(yaw) * Math.cos(pitchPakai) * jarakPakai, cy = ty + Math.sin(pitchPakai) * jarakPakai, cz = tz + Math.cos(yaw) * Math.cos(pitchPakai) * jarakPakai;
  cy = Math.max(cy, tinggi(cx, cz) + 1.6);
  // Kamera tidak boleh masuk ke dalam bangunan: dekatkan ke tokoh bila garis pandang tertembus
  let fr = 1;
  for (let i = 1; i <= 14 && fr === 1; i++) {
    const f = i / 14, sx = tx + (cx - tx) * f, sy = cy + 0 * f - (cy - ty) * (1 - f), sz = tz + (cz - tz) * f;
    for (const o of FOOT) {
      if (o.r < 3 || jarakDua(tx, tz, o.x, o.z) < o.r * 0.8) continue;
      if (jarakDua(sx, sz, o.x, o.z) < o.r * 0.8 && sy - tinggi(o.x, o.z) < 10) { fr = Math.max(0.22, (i - 1) / 14); break; }
    }
  }
  if (fr < 1) { cx = tx + (cx - tx) * fr; cy = ty + (cy - ty) * fr + (1 - fr) * 1.5; cz = tz + (cz - tz) * fr; }
  const g = E.ofsetKamera(getarTmp);
  kamera.position.set(cx + g.x, cy + g.y, cz + g.z);
  kamera.lookAt(tx, ty, tz);
}

let terakhir = performance.now(), suasanaTick = 0;
renderer.setAnimationLoop(now => {
  const dt = Math.min(0.1, (now - terakhir) / 1000); terakhir = now;
  update(dt); hud(); kameraIkut();
  suasanaTick += dt;
  if (suasanaTick > 0.5) { suasanaTick = 0; suasanaMusik({ naik: !!G.naik, kabut: G.kabut, tegang: G.panas > 70 || G.rakyat > 70 }); }
  if (G.jalan) { jedaSimpan += dt; if (jedaSimpan > 20) { jedaSimpan = 0; simpan(); } }
  if (wInfoSimpan > 0 && (wInfoSimpan -= dt) <= 0) $('simpanInfo').style.opacity = 0;
  renderer.render(scene, kamera);
});

// ---------- Simpan dan muat progres (localStorage) ----------
const KUNCI = 'republikEmas.simpan.v1';
let simpanGagal = false, jedaSimpan = 0, wInfoSimpan = 0;
function infoSimpan(teks) { $('simpanInfo').textContent = teks; $('simpanInfo').style.opacity = 1; wInfoSimpan = 2.2; }
function kumpul() {
  const KUNCI_G = ['t', 'bulan', 'cuan', 'restu', 'panas', 'rakyat', 'kabut', 'citra', 'berkas', 'stunting', 'pupuk', 'oknum', 'gelar', 'kabutPuncak', 'gulungTikar', 'ojolMogok', 'korban', 'insiden', 'kasRaib', 'misi', 'selfie'];
  const g = {}; KUNCI_G.forEach(k => { g[k] = G[k]; }); g.stat = { ...G.stat }; g.prestasi = G.prestasi.slice(); g.pangkat = G.pangkat;
  return {
    v: 1, waktuSimpan: Date.now(), G: g,
    pemain: { x: pemain.position.x, z: pemain.position.z, ry: pemain.rotation.y, yaw, pitch, jarak },
    petak: PETAK.map(p => [p.status, p.siklus, p.umurLahan, p.api]),
    bangunan: G.bangunan.map(b => ({ jenis: b.jenis, x: b.x, z: b.z, rot: b.g.rotation.y, umur: b.umur, mangkrak: b.mangkrak, slhs: !!b.slhs, lok: b.lok, sisa: Math.max(0, (b.sampai || 0) - G.t) })),
    baliho: G.balihoList.slice(),
    kios: KIOS.map(u => [u.cd, u.berhasil, u.tutup, u.sisaTutup]),
    ojol: OJOL.map(o => [o.s, o.arah, o.tutup, o.sisaTutup, o.berhasil]),
    kendaraan: KENDARAAN.map(k => [k.x, k.z, k.ry]),
    naik: G.naik ? G.naik.jenis : null,
  };
}
function simpan(manual = false) {
  if (!G.jalan && !manual) return; // jangan menimpa simpanan sebelum permainan dimulai
  try {
    localStorage.setItem(KUNCI, JSON.stringify(kumpul()));
    infoSimpan('✓ Tersimpan');
    if (manual) { bunyi.simpan(); toast('Progres disimpan di peramban ini.'); }
  } catch (e) {
    if (!simpanGagal || manual) { simpanGagal = true; toast('Penyimpanan tidak tersedia di peramban ini (mode privat atau penuh).'); }
  }
}
function baca() {
  try { const s = localStorage.getItem(KUNCI); if (!s) return null; const d = JSON.parse(s); return d && d.v === 1 && d.G ? d : null; } catch (e) { return null; }
}
function muat(d) {
  ['t', 'bulan', 'cuan', 'restu', 'panas', 'rakyat', 'kabut', 'citra', 'berkas', 'stunting', 'pupuk', 'oknum', 'gelar', 'kabutPuncak', 'gulungTikar', 'ojolMogok', 'korban', 'insiden', 'kasRaib', 'misi', 'selfie']
    .forEach(k => { if (typeof d.G[k] === 'number' && isFinite(d.G[k])) G[k] = d.G[k]; });
  Object.assign(G.stat, d.G.stat || {});
  G.prestasi = Array.isArray(d.G.prestasi) ? d.G.prestasi.slice() : []; G.pangkat = typeof d.G.pangkat === 'number' ? d.G.pangkat : pangkatDari(G.citra);
  (d.petak || []).forEach((s, i) => { const p = PETAK[i]; if (!p) return; p.siklus = s[1] || 0; p.umurLahan = s[2] || 0; p.api = s[3] || 0; ubahStatus(p, s[0]); });
  (d.bangunan || []).forEach(b => { const r = pasangBangunan(b.jenis, b.x, b.z, b.rot, 1); r.umur = b.umur || 0; r.slhs = !!b.slhs; r.lok = b.lok; r.sampai = G.t + (b.sisa || 0); NPC.dapurBaru(r); if (b.mangkrak) { r.mangkrak = true; mangkrakkan(r.g); } });
  (d.baliho || []).forEach(b => pasangBaliho(b.x, b.z, b.hadap, b.tema, true));
  (d.kios || []).forEach((s, i) => { const u = KIOS[i]; if (!u) return; u.cd = s[0] || 0; u.berhasil = s[1] || 0; u.tutup = !!s[2]; u.sisaTutup = s[3] || 0; if (u.tutup) visualTutup(u, true); });
  (d.ojol || []).forEach((s, i) => { const o = OJOL[i]; if (!o) return; o.s = Math.max(0, Math.min(o.tot, s[0] || 0)); o.arah = s[1] || 1; o.tutup = !!s[2]; o.sisaTutup = s[3] || 0; o.berhasil = s[4] || 0; if (o.tutup) visualTutup(o, true); });
  (d.kendaraan || []).forEach((s, i) => { const k = KENDARAAN[i]; if (!k) return; k.x = s[0]; k.z = s[1]; k.ry = s[2]; k.y = lantai(k.x, k.z); k.g.position.set(k.x, k.y, k.z); k.g.rotation.y = k.ry; });
  for (let i = 0; i < G.oknum; i++) { const f = manusia(M.rompi, false); f.position.copy(pemain.position); scene.add(f); daftarOknum.push({ f, waktu: 2 + i }); }
  const p = d.pemain || {};
  if (typeof p.x === 'number') { pemain.position.set(p.x, lantai(p.x, p.z), p.z); pemain.rotation.y = p.ry || 0; yaw = p.yaw || 0; pitch = p.pitch || 0.42; jarak = p.jarak || 11; }
  if (d.naik) { const k = KENDARAAN.find(x => x.jenis === d.naik); if (k) G.naik = k; }
  misiTampil = -1;
}
function siapkanJudul() {
  const d = baca();
  if (!d) return;
  $('lanjutkan').hidden = false; $('lanjutkan').textContent = `Lanjutkan (bulan ${d.G.bulan}, Cuan ${Math.floor(d.G.cuan)})`;
  $('infoSimpan').textContent = 'Simpanan terakhir: ' + new Date(d.waktuSimpan).toLocaleString('id-ID');
  $('mulai').textContent = 'Mulai baru (hapus simpanan)';
}
function mulaiGame() { aktifkan(); bunyi.klik(); mulaiMusik(); $('judul').hidden = true; G.jalan = true; monolog('mulai'); }
let konfirmasiBaru = false;
$('mulai').onclick = () => {
  if (baca() && !konfirmasiBaru) { konfirmasiBaru = true; $('mulai').textContent = 'Yakin? Klik lagi untuk menghapus simpanan'; return; }
  try { localStorage.removeItem(KUNCI); } catch (e) { /* abaikan */ }
  mulaiGame();
};
$('lanjutkan').onclick = () => {
  const d = baca();
  if (d) { try { muat(d); } catch (e) { console.error(e); } }
  mulaiGame();
};
$('btnRinci').onclick = () => $('kananAtas').classList.toggle('buka');
$('btnSimpan').onclick = () => simpan(true);
addEventListener('visibilitychange', () => { if (document.hidden) simpan(); });
addEventListener('pagehide', () => simpan());
siapkanJudul();
// Gambar latar layar awal (opsional): atur di img/menu.json
(async () => {
  try {
    const r = await fetch('img/menu.json'); if (!r.ok) return;
    const j = await r.json();
    if (!j || !j.berkas) return;
    const potret = matchMedia('(max-aspect-ratio: 1/1)');
    const pasang = () => { const f = (potret.matches && j.berkasPotret) ? j.berkasPotret : j.berkas; $('latarMenu').style.backgroundImage = `url("img/${f}")`; };
    pasang();
    if (potret.addEventListener) potret.addEventListener('change', pasang);
    $('judul').classList.add('berseni');
  } catch (e) { /* abaikan */ }
})();
addEventListener('pointerdown', aktifkan, { once: true });
addEventListener('keydown', aktifkan, { once: true });
const labelSuara = () => { $('btnSuara').textContent = bisuSekarang() ? 'Suara: mati' : 'Suara: hidup'; $('btnMusik').textContent = musikBisu() ? 'Musik: mati' : 'Musik: hidup'; };
$('btnMusik').onclick = () => { setMusikBisu(!musikBisu()); labelSuara(); aktifkan(); bunyi.klik(); };
$('btnSuara').onclick = () => { setBisu(!bisuSekarang()); labelSuara(); aktifkan(); bunyi.klik(); };
labelSuara();
$('btnLaporan').onclick = () => aksiTombol('r');

// ---------- Kontrol sentuh ----------
const joy = $('joy'), knob = $('knob');
let joyId = null;
function joyGerak(e) {
  const r = joy.getBoundingClientRect(), Rj = r.width / 2;
  let dx = e.clientX - (r.left + Rj), dy = e.clientY - (r.top + Rj);
  const d = Math.hypot(dx, dy); if (d > Rj) { dx *= Rj / d; dy *= Rj / d; }
  joyX = dx / Rj; joyY = dy / Rj;
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
}
joy.addEventListener('pointerdown', e => { joyId = e.pointerId; joy.setPointerCapture(e.pointerId); joyGerak(e); e.preventDefault(); });
joy.addEventListener('pointermove', e => { if (e.pointerId === joyId) joyGerak(e); });
const joyLepas = e => { if (e.pointerId !== joyId) return; joyId = null; joyX = joyY = 0; knob.style.transform = 'translate(0,0)'; };
joy.addEventListener('pointerup', joyLepas); joy.addEventListener('pointercancel', joyLepas);
document.querySelectorAll('#aksiSentuh button').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); if (b.id === 'btnSemua') { const a = $('aksiSentuh'); a.classList.toggle('semua'); b.textContent = a.classList.contains('semua') ? 'Tutup' : '⋯ Lainnya'; return; } aksiTombol(b.dataset.k); }));
if (sentuh) document.body.classList.add('sentuh');

// HP portrait: panel misi tepat di bawah meter/status; prompt, toast, dan monolog bertumpuk di bawah misi (tidak menutupi tokoh)
(() => {
  const potret = matchMedia('(max-aspect-ratio: 1/1)');
  const tumpukan = () => {
    const p = $('prompt'), t = $('toast'), n = $('monolog'), m = $('misi');
    if (!sentuh || !potret.matches) { p.style.top = t.style.top = n.style.top = $('berita').style.top = $('ucapan').style.top = ''; return; }
    let y = m.getBoundingClientRect().bottom + 6;
    p.style.top = y + 'px';
    if (p.style.visibility === 'visible') y += p.offsetHeight + 4;
    t.style.top = y + 'px';
    y += t.offsetHeight + 4;
    n.style.top = y + 'px';
    y += n.offsetHeight + 4;
    $('berita').style.top = y + 'px';
    y += $('berita').offsetHeight + 4;
    $('ucapan').style.top = y + 'px';
  };
  const atur = () => {
    const m = $('misi');
    if (!sentuh || !potret.matches) { m.style.top = ''; tumpukan(); return; }
    const a = $('kiriAtas').getBoundingClientRect(), b = $('kananAtas').getBoundingClientRect();
    m.style.top = (Math.max(a.bottom, b.bottom) + 6) + 'px';
    tumpukan();
  };
  aturTumpukan = tumpukan;
  if (window.ResizeObserver) { const ro = new ResizeObserver(atur); ro.observe($('kiriAtas')); ro.observe($('kananAtas')); ro.observe($('misi')); ro.observe($('toast')); }
  addEventListener('resize', atur); atur();
})();

// Kait untuk pengujian otomatis
window.__g = { setKameraBebas(pos, tgt) { kameraBebas = pos ? { pos, tgt } : null; }, setKamera(y, p, j) { yaw = y; pitch = p; jarak = j; }, NPC, infoMusik, ujiMusik, simpan, muat, baca, KUNCI, KENDARAAN, naikTurun, lompat, klakson, fis, kamera, OJOL, tujuan, info: () => ({ panggilan: renderer.info.render.calls, segitiga: renderer.info.render.triangles }), G, PETAK, KIOS, pemain, update, palak, sewaAparat, bakar, tebang, tanam, bangun, klasifikasi, petakDi, selfie, ngeles, aksiTombol, terrain, dunia,
  maju(detik) { for (let i = 0; i < detik * 20; i++) update(0.05); }, setYaw(v) { yaw = v; }, ke(x, z) { pemain.position.set(x, lantai(x, z), z); }, kartuLanjut() { $('kartuLanjut').click(); }, lanjutLaporan() { $('lanjut').click(); } };
