// Republik Emas (anti stunting): dunia terbuka, kamera orang ketiga, mode santai tanpa akhir.
import * as THREE from '../vendor/three.module.js';
import { R, DESA, SAWAH, TPA, KANTOR, SPAWN, TITIK_BEBAS, sungaiX, UKURAN, ZONA, pusatZona, UMKM, PELUANG } from './konfig.js';
import { tinggi, lantai, buatTerrain } from './terrain.js';
import { M, buatObjek, manusia, bangunanMBG, bangunanKopdes, mangkrakkan, baliho, pilar, kios, aparatSewaan } from './objek.js';
import { FOOT, BALIHO_AWAL, adaTempat, tambahJejak } from './tata.js';
import { MONOLOG, BLOKIR, LOKASI, DENDA, MISI, PAJAK, GAGAL, NAMA_TOMBOL } from './teks.js';

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
const PENDAPATAN_SAWIT = 6, SIKLUS_SAWIT = 3, DURASI_API = 7, UMUR_MANGKRAK = 45, TUMBUH_KEMBALI = 150;
const COOLDOWN_UMKM = 25, TUTUP_SETELAH = 3, LAMA_TUTUP = 120, DURASI_APARAT = 60;

// ---------- Keadaan ----------
const G = {
  t: 0, bulan: 1, jalan: false, jeda: false,
  cuan: 20, restu: 60, panas: 5, rakyat: 5, kabut: 0, citra: 0, berkas: 1,
  stunting: 20, pupuk: 0, oknum: 0, gelar: 0, aparat: 0,
  bangunan: [], baliho: 0, selfie: 0, kabutPuncak: 0, gulungTikar: 0, misi: 0,
  stat: { bakar: 0, tanam: 0, bangun: 0, blokir: 0, palak: 0, panen: 0 },
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
  return { ...u, g, cd: 0, berhasil: 0, tutup: false, sisaTutup: 0, marah: 0 };
});

// Baliho awal (posisi dijamin tidak menabrak benda lain, lihat tata.js)
function pasangBaliho(x, z, hadap, tema) { const b = baliho(x, z, hadap, tema); scene.add(b); G.baliho++; return b; }
BALIHO_AWAL.forEach(b => pasangBaliho(b.x, b.z, b.ry, b.tema));

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
function toast(teks) { $('toast').textContent = teks; $('toast').style.opacity = 1; wToast = 3.6; }
function monolog(kunci) { $('monolog').textContent = '“' + acak(MONOLOG[kunci]) + '”'; $('monolog').style.opacity = 1; wMono = 4.5; }
function kilat(warna = '#fff') { const f = $('kilat'); f.style.background = warna; f.style.transition = 'none'; f.style.opacity = 0.85; requestAnimationFrame(() => { f.style.transition = 'opacity .6s'; f.style.opacity = 0; }); }
// Nama tombol sesuai perangkat: ponsel menampilkan nama tombol, komputer menampilkan hurufnya
const tb = k => `<kbd>${sentuh ? NAMA_TOMBOL[k] : k.toUpperCase()}</kbd>`;
const isiTombol = teks => teks.replace(/\{(\w)\}/g, (_, k) => tb(k));
let promptLama = '';
function setPrompt(h) { if (h !== promptLama) { $('prompt').innerHTML = h; $('prompt').style.visibility = h ? 'visible' : 'hidden'; promptLama = h; } }
function kartu(judul, teks, tombolTeks = 'Lanjut') {
  G.jeda = true;
  $('kartuJudul').textContent = judul; $('kartuTeks').textContent = teks; $('kartuLanjut').textContent = tombolTeks;
  $('kartu').hidden = false;
}
$('kartuLanjut').onclick = () => { $('kartu').hidden = true; G.jeda = false; };

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
const kiosDekat = () => KIOS.reduce((b, u) => { const d = jarakDua(pemain.position.x, pemain.position.z, u.x, u.z); return d < 9 && (!b || d < b.d) ? { u, d } : b; }, null)?.u || null;
const dekatKantor = () => jarakDua(pemain.position.x, pemain.position.z, KANTOR.x, KANTOR.z) < 24;

// ---------- Palak UMKM ----------
function palak() {
  const u = kiosDekat();
  if (!u) return toast('Tidak ada UMKM di dekat Anda. Cari kios berpapan nama.');
  if (u.tutup) return toast('Kiosnya sudah gulung tikar. Tidak ada lagi yang bisa dipajaki.');
  if (u.cd > 0) return toast(`Pemilik sedang mengawasi Anda. Tunggu ${Math.ceil(u.cd)} detik.`);
  u.cd = COOLDOWN_UMKM; G.stat.palak++;
  const pakaiAparat = G.aparat > 0;
  if (pakaiAparat || Math.random() < PELUANG[u.tipe]) {
    const kotor = Math.round(u.dasar * (1 + 0.05 * (G.bulan - 1)) * (0.8 + Math.random() * 0.5));
    const bersih = pakaiAparat ? Math.round(kotor * 0.75) : kotor;
    G.cuan += bersih; G.panas = batas(G.panas + (pakaiAparat ? 3 : 2)); G.rakyat = batas(G.rakyat + (pakaiAparat ? 3 : 1));
    u.berhasil++;
    toast(`"${acak(PAJAK)}" berhasil: +${bersih} Cuan${pakaiAparat ? ' (25% untuk uang lelah aparat)' : ''}.`);
    monolog('palak');
    if (u.berhasil >= TUTUP_SETELAH) tutupkan(u);
  } else {
    const rugi = Math.min(G.cuan, 15);
    G.cuan -= rugi; G.rakyat = batas(G.rakyat + 5); G.restu = batas(G.restu - 3); G.citra = Math.max(0, G.citra - 5);
    u.marah = 1.6;
    toast(`GAGAL: ${acak(GAGAL)} (Cuan -${Math.round(rugi)}, Citra -5)`);
    kilat('#d6453d'); monolog('palakGagal');
  }
}
function tutupkan(u) {
  u.tutup = true; u.sisaTutup = LAMA_TUTUP; G.gulungTikar++;
  const d = u.g.userData; d.pemilik.visible = false; d.tutup.visible = true; d.label.visible = false; d.atap.color.setHex(0x777777);
  G.rakyat = batas(G.rakyat + 4);
  toast(`${u.nama} gulung tikar setelah dipajaki berkali-kali.`); monolog('tutup');
}
function bukaLagi(u) {
  u.tutup = false; u.berhasil = 0; u.cd = 0;
  const d = u.g.userData; d.pemilik.visible = true; d.tutup.visible = false; d.label.visible = true; d.atap.color.setHex(d.warnaAsli);
}
function sewaAparat() {
  if (G.cuan < HARGA.aparat) return toast(`Cuan kurang (butuh ${HARGA.aparat}) untuk sewa aparat.`);
  G.cuan -= HARGA.aparat; G.aparat = Math.min(G.aparat + DURASI_APARAT, DURASI_APARAT * 3);
  while (daftarAparat.length < 2) { const a = aparatSewaan(); a.position.copy(pemain.position); scene.add(a); daftarAparat.push(a); }
  toast(`Aparat disewa ${DURASI_APARAT} detik. Palak 100% berhasil, tapi 25% hasilnya untuk mereka.`); monolog('aparat');
}

// ---------- Hutan, sawit, bangunan ----------
function ubahStatus(p, status) { p.status = status; dunia.tampilkan(p); }
function bakar(p) {
  if (!p || p.status !== 'hutan') return;
  if (G.berkas > 0) { G.berkas--; G.panas = batas(G.panas + 1); toast('Dibakar "sesuai prosedur". Berkas terpakai.'); }
  else { G.panas = batas(G.panas + 3); toast('Dibakar tanpa berkas. Titik panas terlihat satelit.'); }
  G.stat.bakar++; p.api = DURASI_API; ubahStatus(p, 'api'); monolog('bakar');
}
function tebang(p) {
  if (!p || p.status !== 'hutan' || !bisaBayar(HARGA.tebang)) return;
  G.cuan -= HARGA.tebang; p.umurLahan = 0; ubahStatus(p, 'lahan');
  toast('Ditebang manual. Mahal dan lama. Tidak ada yang memuji.'); monolog('tebang');
}
function tanam(p) {
  if (!p || p.status !== 'lahan' || !bisaBayar(HARGA.tanam)) return;
  G.cuan -= HARGA.tanam; p.siklus = 0; G.stat.tanam++; ubahStatus(p, 'sawit');
  toast('Sawit ditanam. Penghasilan mengalir.'); monolog('sawit');
}
function bisaBayar(biaya) { if (G.cuan < biaya) { toast(`Cuan kurang (butuh ${biaya}). Coba PALAK UMKM dulu.`); return false; } return true; }
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
    toast('DIBLOKIR: ' + acak(BLOKIR) + ' (biaya administrasi 10)'); monolog('blokir');
    return;
  }
  G.cuan += (jenis === 'mbg' ? 160 : 130) - biaya;
  G.restu = batas(G.restu + 4); G.panas = batas(G.panas + 2); G.citra += 3; G.stat.bangun++;
  const g = jenis === 'mbg' ? bangunanMBG() : bangunanKopdes();
  const fond = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 11), M.batu); fond.position.y = -1.6; g.add(fond);
  g.position.set(x, tinggi(x, z), z); g.rotation.y = ry + Math.PI; scene.add(g);
  G.bangunan.push({ jenis, umur: 0, mangkrak: false, g, x, z });
  tambahJejak(x, z, 9, 'bangunan'); dunia.bersihkan(x, z, 14);
  const rot = ry + Math.PI, depan = [Math.sin(rot), Math.cos(rot)], kanan = [Math.cos(rot), -Math.sin(rot)];
  const calon = [[kanan[0] * 17, kanan[1] * 17], [-kanan[0] * 17, -kanan[1] * 17], [depan[0] * 18, depan[1] * 18], [-depan[0] * 18, -depan[1] * 18]];
  const tempat = calon.map(([dx, dz]) => [x + dx, z + dz]).find(([bx, bz]) => tinggi(bx, bz) > 0.6 && !klasifikasi(bx, bz).benar && !petakDi(bx, bz) && adaTempat(bx, bz, 6, 0.5));
  if (tempat) { pasangBaliho(tempat[0], tempat[1], rot); tambahJejak(tempat[0], tempat[1], 6, 'baliho'); dunia.bersihkan(tempat[0], tempat[1], 8); }
  toast(`${jenis === 'mbg' ? 'DAPUR EMAS (MBG)' : 'KOPDES EMAS'} berdiri ${LOKASI[l.k]}`); monolog('bangun');
}
function selfie() {
  const dekat = G.bangunan.some(b => jarakDua(pemain.position.x, pemain.position.z, b.x, b.z) < 18);
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
  const b = hargaGelar(G.gelar); if (!bisaBayar(b)) return;
  G.cuan -= b; G.citra += 15; G.restu = batas(G.restu + 3);
  toast(`Gelar kehormatan dari "universitas" mitra: ${GELAR[G.gelar++]}. Citra +15.`); monolog('gelar');
}
function beliPupuk() {
  if (G.pupuk >= MAKS_PUPUK) return toast('Pupuk sudah maksimal. Sawit Anda lebih subur dari anggaran.');
  const b = hargaPupuk(G.pupuk); if (!bisaBayar(b)) return;
  G.cuan -= b; G.pupuk++; toast(`Pupuk level ${G.pupuk}: hasil sawit +${G.pupuk * 40}%.`); monolog('pupuk');
}
function rekrutOknum() {
  if (G.oknum >= MAKS_OKNUM) return toast('Oknum sudah penuh. Kantor tidak muat lagi.');
  const b = hargaOknum(G.oknum); if (!bisaBayar(b)) return;
  G.cuan -= b; G.oknum++;
  const f = manusia(M.rompi, false); f.position.copy(pemain.position); scene.add(f);
  daftarOknum.push({ f, waktu: 2 });
  toast('Oknum direkrut: otomatis menanam dan membakar. Anda hanya bertanggung jawab atas fotonya.'); monolog('oknum');
}
function aksiTombol(k) {
  if (!G.jalan || G.jeda) return;
  const p = petakDi(pemain.position.x, pemain.position.z);
  if (k === 'x') palak(); else if (k === 'v') sewaAparat();
  else if (k === 'b') bakar(p); else if (k === 't') tebang(p); else if (k === 'p') tanam(p);
  else if (k === '1') bangun('mbg'); else if (k === '2') bangun('kopdes');
  else if (k === 'f') selfie(); else if (k === 'c') ngeles();
  else if (k === 'g') beliGelar(); else if (k === 'u') beliPupuk(); else if (k === 'o') rekrutOknum();
  else if (k === 'r') laporan(false);
  else if (k === 'e') { if (!dekatKantor()) toast('Berkas dibeli di Kantor Dinas.'); else if (bisaBayar(HARGA.berkas)) { G.cuan -= HARGA.berkas; G.berkas++; toast('Berkas rapi dibeli. Perisai +1.'); monolog('berkas'); } }
  else if (k === 'k') { if (!dekatKantor()) toast('Kambing hitam dicari di Kantor Dinas.'); else if (bisaBayar(HARGA.kambing)) { G.cuan -= HARGA.kambing; G.panas = batas(G.panas - 30); G.restu = batas(G.restu - 2); toast('Staf "penanggung jawab" dimutasi. Panas KPK -30.'); } }
}

// ---------- Misi ----------
const terdekat = (status) => PETAK.filter(p => p.status === status).sort((a, b) => jarakDua(pemain.position.x, pemain.position.z, a.cx, a.cz) - jarakDua(pemain.position.x, pemain.position.z, b.cx, b.cz))[0];
const MISI_DEF = [
  { selesai: () => G.stat.palak >= 1, target: () => KIOS.find(u => !u.tutup && u.cd <= 0) || KIOS[0], sorot: 'x' },
  { selesai: () => G.stat.bakar >= 1, target: () => terdekat('hutan'), sorot: 'b' },
  { selesai: () => G.stat.tanam >= 1, target: () => terdekat('lahan') || terdekat('api') || terdekat('hutan'), sorot: 'p' },
  { selesai: () => PETAK.filter(p => p.status === 'sawit').length >= 3, target: () => terdekat('lahan') || terdekat('hutan'), sorot: 'p' },
  { selesai: () => G.stat.bangun >= 1, target: () => TITIK_BEBAS, sorot: '1' },
  { selesai: () => G.stat.blokir >= 1, target: () => DESA[0], sorot: '1' },
  { selesai: () => false, target: () => null, sorot: null },
];
let targetTerakhir = null, wMisiBaru = 0, misiTampil = -1, sigTombol = '';
function perbaruiMisi() {
  const sebelum = G.misi;
  while (G.misi < MISI_DEF.length - 1 && MISI_DEF[G.misi].selesai()) { G.misi++; }
  if (G.misi !== sebelum) { toast(`Misi ${G.misi} selesai! Lanjut ke misi berikutnya.`); wMisiBaru = 5; }
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
    $('misiTeks').innerHTML = isiTombol(MISI[G.misi].teks);
  }
  $('misi').classList.toggle('baru', wMisiBaru > 0);
  // Panah kompas di layar menunjuk ke tujuan
  const kp = $('panah');
  if (t && jarakT > 6) {
    const dx = tx - px, dz = tz - pz;
    const kanan = dx * Math.cos(yaw) + dz * -Math.sin(yaw), depan = dx * -Math.sin(yaw) + dz * -Math.cos(yaw);
    $('panahIkon').style.transform = `rotate(${Math.atan2(kanan, depan)}rad)`;
    $('panahJarak').textContent = Math.round(jarakT) + ' m';
    kp.style.visibility = 'visible';
  } else kp.style.visibility = 'hidden';
  return d.sorot;
}

// Tombol sentuh: sorot yang harus ditekan, redupkan yang belum perlu, dan taruh gelembung "Ketuk" di atasnya
function perbaruiTombol(s) {
  const buka = MISI[G.misi].buka;
  const sig = s + '|' + G.misi;
  if (sig !== sigTombol) {
    sigTombol = sig;
    document.querySelectorAll('#aksiSentuh button').forEach(b => {
      b.classList.toggle('sorot', b.dataset.k === s);
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

// ---------- Pembaruan ----------
let waktu = 0;
function update(dt) {
  waktu += dt;
  if (wToast > 0 && (wToast -= dt) <= 0) $('toast').style.opacity = 0;
  if (wMono > 0 && (wMono -= dt) <= 0) $('monolog').style.opacity = 0;
  if (wMisiBaru > 0) wMisiBaru -= dt;
  if (!G.jalan || G.jeda) return;

  // Gerak relatif kamera, berhenti di air
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
  const ayun = bergerak ? Math.sin(waktu * 12) * 0.7 : 0;
  lenganK.rotation.x = ayun; lenganN.rotation.x = -ayun; kakiK.rotation.x = -ayun; kakiN.rotation.x = ayun;
  const yTarget = lantai(pemain.position.x, pemain.position.z) + (bergerak ? Math.abs(Math.sin(waktu * 12)) * 0.15 : 0);
  pemain.position.y += (yTarget - pemain.position.y) * Math.min(1, dt * 14);

  // Waktu, setoran
  G.t += dt;
  if (G.t >= G.bulan * DETIK_PER_BULAN) akhirBulan();

  // Petak
  let terbakar = 0, sawit = 0;
  for (const p of PETAK) {
    if (p.status === 'sawit') {
      sawit++; p.siklus += dt;
      if (p.siklus >= SIKLUS_SAWIT) { p.siklus -= SIKLUS_SAWIT; G.cuan += PENDAPATAN_SAWIT * (1 + 0.4 * G.pupuk); G.stat.panen++; }
    } else if (p.status === 'api') {
      terbakar++; p.api -= dt; dunia.animasiApi(p, waktu);
      for (const q of PETAK) {
        if ((q.status === 'hutan' || q.status === 'sawit') && q.zona === p.zona && Math.abs(q.i - p.i) + Math.abs(q.j - p.j) === 1 && Math.random() < 0.035 * dt) {
          if (q.status === 'sawit') toast('Api merambat ke kebun sawit Anda!');
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

  // Bangunan
  let mangkrak = 0, mangkrakMbg = 0, pasif = 0;
  for (const b of G.bangunan) {
    b.umur += dt;
    if (!b.mangkrak) { G.cuan += dt; pasif++; if (b.umur > UMUR_MANGKRAK) { b.mangkrak = true; mangkrakkan(b.g); G.rakyat = batas(G.rakyat + 3); if (b.jenis === 'mbg') G.stunting += 0.3; monolog('mangkrak'); } }
    else { mangkrak++; if (b.jenis === 'mbg') mangkrakMbg++; }
  }

  // UMKM
  for (const u of KIOS) {
    if (u.cd > 0) u.cd -= dt;
    if (u.tutup && (u.sisaTutup -= dt) <= 0) bukaLagi(u);
    const o = u.g.userData.pemilik;
    if (u.marah > 0) { u.marah -= dt; o.userData.lenganK.rotation.x = o.userData.lenganN.rotation.x = -2.6 + Math.sin(waktu * 20) * 0.4; } else { o.userData.lenganK.rotation.x = o.userData.lenganN.rotation.x = 0; }
  }

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
    if (lahan && G.cuan >= HARGA.tanam) { o.f.position.set(lahan.cx, lantai(lahan.cx, lahan.cz), lahan.cz); tanam(lahan); }
    else if (hutan && api < 2) { o.f.position.set(hutan.cx, lantai(hutan.cx, hutan.cz), hutan.cz); G.panas = batas(G.panas + 1); G.stat.bakar++; hutan.api = DURASI_API; ubahStatus(hutan, 'api'); }
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
  if (u) {
    const peluang = G.aparat > 0 ? 100 : Math.round(PELUANG[u.tipe] * 100);
    h = u.tutup ? `${u.nama}: gulung tikar.` : `${u.nama} · pemilik ${u.tipe.toUpperCase()} · peluang ${peluang}% · ${tb('x')} Palak${G.aparat > 0 ? ' (aparat aktif)' : ` · ${tb('v')} Sewa aparat (${HARGA.aparat})`}`;
  } else if (p) {
    if (p.status === 'hutan') h = `Petak hutan: ${tb('b')} Bakar (gratis) · ${tb('t')} Tebang (${HARGA.tebang})`;
    else if (p.status === 'lahan') h = `Lahan terbuka: ${tb('p')} Tanam sawit (${HARGA.tanam})`;
    else if (p.status === 'sawit') h = 'Kebun sawit: panen otomatis. Jauhkan dari api.';
    else if (p.status === 'api') h = 'Api sedang menyala. Itu "pembukaan lahan".';
  } else if (dekatKantor()) h = `Kantor Dinas: ${tb('e')} Berkas (${HARGA.berkas}) · ${tb('k')} Kambing hitam (${HARGA.kambing})`;
  setPrompt(h);
  // Sorot tombol hanya saat aksinya benar-benar bisa dilakukan sekarang
  let s = null;
  const tt = targetTerakhir, dekatTarget = tt && jarakDua(pemain.position.x, pemain.position.z, tt.cx ?? tt.x, tt.cz ?? tt.z) < 20;
  if (u && !u.tutup && u.cd <= 0 && (G.misi === 0 || G.cuan < HARGA.tanam)) s = 'x';
  else if (p && p.status === 'hutan' && (G.misi === 1 || G.misi === 3)) s = 'b';
  else if (p && p.status === 'lahan' && G.misi >= 2 && G.cuan >= HARGA.tanam) s = 'p';
  else if ((G.misi === 4 || G.misi === 5) && dekatTarget && !p) s = '1';
  perbaruiTombol(s);
}

function akhirBulan() {
  const kuota = kuotaBulan(G.bulan);
  if (G.cuan >= kuota) { G.cuan -= kuota; G.restu = batas(G.restu + 8); toast(`Setoran bulan ${G.bulan}: ${kuota}. Bos senang.`); monolog('setoranOk'); }
  else { G.restu = batas(G.restu - 12); toast(`Setoran bulan ${G.bulan} KURANG (${kuota}). Restu Bos -12.`); monolog('setoranKurang'); }
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
  kartu(judul, teks);
}

function laporan(tahunan) {
  const hutanSisa = Math.round(PETAK.filter(p => p.status === 'hutan').length / PETAK.length * 100);
  const mangkrak = G.bangunan.filter(b => b.mangkrak).length;
  const stuntingResmi = Math.max(10, 20 - Math.min(8, G.bangunan.length * 0.5 + G.citra * 0.02));
  const tahun = Math.floor((G.bulan - 1) / 12);
  $('laporanJudul').textContent = tahunan ? `Laporan Tahunan ke-${tahun}` : 'Laporan Kinerja (sementara)';
  $('laporanAlasan').textContent = tahunan ? 'Setahun berlalu. Bos meminta laporan. Anda menyiapkan dua versi.' : 'Dua versi laporan, satu kenyataan.';
  $('laporanResmi').innerHTML = `Serapan anggaran: <b>100%</b><br>Bangunan diresmikan: <b>${G.bangunan.length}</b><br>Baliho terpasang: <b>${G.baliho}</b><br>Penerimaan pajak daerah: <b>naik ${60 + G.stat.palak * 3}%</b><br>Stunting (laporan): <b>${stuntingResmi.toFixed(1)}%</b><br>Predikat: <b>SANGAT BERKINERJA</b>`;
  $('laporanNyata').innerHTML = `Hutan tersisa: <b>${hutanSisa}%</b><br>Bangunan mangkrak: <b>${mangkrak} dari ${G.bangunan.length}</b><br>UMKM gulung tikar: <b>${G.gulungTikar}</b><br>Kabut puncak: <b>${Math.round(G.kabutPuncak)}/100</b><br>Stunting nyata: <b>${G.stunting.toFixed(1)}%</b><br>Amarah rakyat: <b>${Math.round(G.rakyat)}/100</b>`;
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
  $('aparat').textContent = G.aparat > 0 ? `Aparat aktif ${Math.ceil(G.aparat)} dtk` : '';
  $('hargaPupuk').textContent = G.pupuk >= MAKS_PUPUK ? 'maks' : hargaPupuk(G.pupuk);
  $('hargaOknum').textContent = G.oknum >= MAKS_OKNUM ? 'maks' : hargaOknum(G.oknum);
  $('hargaGelar').textContent = G.gelar >= GELAR.length ? 'maks' : hargaGelar(G.gelar);
}

let pitchPakai = 0.42, jarakPakai = 11;
function kameraIkut() {
  const tx = pemain.position.x, ty = pemain.position.y + 2.2, tz = pemain.position.z;
  // Di dalam hutan, naikkan kamera supaya tajuk pohon tidak menutupi tokoh
  const dalamHutan = petakDi(tx, tz)?.status === 'hutan';
  pitchPakai += ((dalamHutan ? Math.max(pitch, 0.95) : pitch) - pitchPakai) * 0.08;
  jarakPakai += ((dalamHutan ? Math.max(jarak, 15) : jarak) - jarakPakai) * 0.08;
  let cx = tx + Math.sin(yaw) * Math.cos(pitchPakai) * jarakPakai, cy = ty + Math.sin(pitchPakai) * jarakPakai, cz = tz + Math.cos(yaw) * Math.cos(pitchPakai) * jarakPakai;
  cy = Math.max(cy, tinggi(cx, cz) + 1.6);
  kamera.position.set(cx, cy, cz);
  kamera.lookAt(tx, ty, tz);
}

let terakhir = performance.now();
renderer.setAnimationLoop(now => {
  const dt = Math.min(0.1, (now - terakhir) / 1000); terakhir = now;
  update(dt); hud(); kameraIkut();
  renderer.render(scene, kamera);
});

$('mulai').onclick = () => { $('judul').hidden = true; G.jalan = true; monolog('mulai'); };
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
document.querySelectorAll('#aksiSentuh button').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); aksiTombol(b.dataset.k); }));
if (sentuh) document.body.classList.add('sentuh');

// Kait untuk pengujian otomatis
window.__g = { tujuan, info: () => ({ panggilan: renderer.info.render.calls, segitiga: renderer.info.render.triangles }), G, PETAK, KIOS, pemain, update, palak, sewaAparat, bakar, tebang, tanam, bangun, klasifikasi, petakDi, selfie, ngeles, aksiTombol, terrain, dunia,
  maju(detik) { for (let i = 0; i < detik * 20; i++) update(0.05); }, setYaw(v) { yaw = v; }, ke(x, z) { pemain.position.set(x, lantai(x, z), z); }, kartuLanjut() { $('kartuLanjut').click(); }, lanjutLaporan() { $('lanjut').click(); } };
