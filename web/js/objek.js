// Objek dunia: tumbuhan (instanced), desa, bangunan, papan, awan.
import * as THREE from '../vendor/three.module.js';
import { rng, fbm } from './noise.js';
import { tinggi } from './terrain.js';
import { TATA, FOOT } from './tata.js';
import { R, sungaiX, ZONA, pusatZona, KOLOM, BARIS, JARAK, UKURAN, DESA, SAWAH, TPA, KANTOR, JEMBATAN, JALAN, jarakJalan } from './konfig.js';

export const M = {
  air: new THREE.MeshLambertMaterial({ color: 0x2f93d3, transparent: true, opacity: 0.82 }),
  batang: new THREE.MeshLambertMaterial({ color: 0x6b4a2a }),
  daun: new THREE.MeshLambertMaterial({ color: 0xffffff }),
  arang: new THREE.MeshLambertMaterial({ color: 0x1c1713 }),
  sawitDaun: new THREE.MeshLambertMaterial({ color: 0x7ab648 }),
  api: new THREE.MeshBasicMaterial({ color: 0xff7a1a }),
  api2: new THREE.MeshBasicMaterial({ color: 0xffd23a }),
  tembok: new THREE.MeshLambertMaterial({ color: 0xf1e8d6 }),
  krem: new THREE.MeshLambertMaterial({ color: 0xe9dcc0 }),
  atapMerah: new THREE.MeshLambertMaterial({ color: 0xb8362e }),
  atapHijau: new THREE.MeshLambertMaterial({ color: 0x2f7a55 }),
  atapAbu: new THREE.MeshLambertMaterial({ color: 0x6c6c6c }),
  atapCoklat: new THREE.MeshLambertMaterial({ color: 0x8a4a2a }),
  rumah: new THREE.MeshLambertMaterial({ color: 0xe3c79a }),
  rumah2: new THREE.MeshLambertMaterial({ color: 0xc9d8b8 }),
  rumah3: new THREE.MeshLambertMaterial({ color: 0xd9b0a0 }),
  kayu: new THREE.MeshLambertMaterial({ color: 0x8a6a42 }),
  sampah: new THREE.MeshLambertMaterial({ color: 0x5b4b3a }),
  kantor: new THREE.MeshLambertMaterial({ color: 0xcfc8b4 }),
  jaket: new THREE.MeshLambertMaterial({ color: 0xf5e9c8, emissive: 0x6a5e40 }), // krem terang
  rompi: new THREE.MeshLambertMaterial({ color: 0xe0701a }),
  kulit: new THREE.MeshLambertMaterial({ color: 0xc98f63 }),
  hitam: new THREE.MeshLambertMaterial({ color: 0x111111 }),
  emas: new THREE.MeshLambertMaterial({ color: 0xe8b83c }),
  mangkrak: new THREE.MeshLambertMaterial({ color: 0x7a7468 }),
  bambu: new THREE.MeshLambertMaterial({ color: 0xb59b5a }),
  batu: new THREE.MeshLambertMaterial({ color: 0x8a867c }),
  kaca: new THREE.MeshLambertMaterial({ color: 0x9ccbe0 }),
  putih: new THREE.MeshLambertMaterial({ color: 0xffffff }),
  jalan: new THREE.MeshLambertMaterial({ color: 0x8a6a42 }),
  awan: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, fog: false }),
};

const geo = {
  box: new THREE.BoxGeometry(1, 1, 1),
  silinder: new THREE.CylinderGeometry(1, 1, 1, 10),
  kerucut: new THREE.ConeGeometry(1, 1, 7),
  bola: new THREE.SphereGeometry(1, 12, 10),
  batang: new THREE.CylinderGeometry(0.55, 1, 1, 6).translate(0, 0.5, 0),
  tajukBulat: new THREE.IcosahedronGeometry(1, 0),
  tajukKerucut: new THREE.ConeGeometry(1, 1, 7).translate(0, 0.5, 0),
  tajukPalem: new THREE.ConeGeometry(1, 0.55, 8).translate(0, 0.25, 0),
  batu: new THREE.DodecahedronGeometry(1, 0),
  api: new THREE.ConeGeometry(1, 1, 6).translate(0, 0.5, 0),
};

export function prisma(w, h, l) {
  const A = [-w / 2, 0, -l / 2], B = [w / 2, 0, -l / 2], C = [0, h, -l / 2], D = [-w / 2, 0, l / 2], E = [w / 2, 0, l / 2], F = [0, h, l / 2];
  const tri = [D, E, F, B, A, C, A, D, F, A, F, C, B, C, F, B, F, E];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(tri.flat(), 3));
  g.computeVertexNormals();
  return g;
}

export function mesh(g, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  const o = new THREE.Mesh(g, m);
  o.position.set(x, y, z); o.scale.set(sx, sy, sz);
  return o;
}
const kotak = (m, x, y, z, w, h, d) => mesh(geo.box, m, x, y, z, w, h, d);
const tiang = (m, x, y, z, r, h) => mesh(geo.silinder, m, x, y, z, r, h, r);

// ---------- Papan bertekstur ----------
export function papan(teks, lebar, tinggiP, opsi = {}) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = Math.round(512 * tinggiP / lebar);
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
  x.textAlign = opsi.wajah ? 'left' : 'center';
  const baris = teks.split('\n'), mulaiX = opsi.wajah ? 215 : c.width / 2, lebarSedia = (opsi.wajah ? c.width - 215 : c.width) - 44;
  let ukuran = 40; // kecilkan huruf sampai semua baris muat
  for (; ukuran > 14; ukuran -= 2) { x.font = `bold ${ukuran}px sans-serif`; if (baris.every(b => x.measureText(b).width <= lebarSedia)) break; }
  x.font = `bold ${ukuran}px sans-serif`;
  const jarakBaris = ukuran * 1.25;
  baris.forEach((b, i) => x.fillText(b, mulaiX, c.height / 2 - (baris.length - 1) * jarakBaris / 2 + i * jarakBaris + ukuran * 0.35));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(lebar, tinggiP), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
}

function teksSawah() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#b9c24c' : '#9aae3f'; x.fillRect(0, i * 16, 128, 16); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- Instanced mesh dengan slot yang bisa disembunyikan ----------
const NOL = new THREE.Matrix4().makeScale(0, 0, 0);
export class Inst {
  constructor(g, m, kapasitas, warnaPerInstans = false) {
    this.mesh = new THREE.InstancedMesh(g, m, kapasitas);
    this.mesh.frustumCulled = false;
    this.mats = []; this.n = 0; this.kap = kapasitas;
    for (let i = 0; i < kapasitas; i++) this.mesh.setMatrixAt(i, NOL);
    if (warnaPerInstans) { this.mesh.setColorAt(0, new THREE.Color(1, 1, 1)); }
  }
  tambah(x, y, z, sx, sy, sz, ry = 0, tampil = true, warna = null) {
    if (this.n >= this.kap) return -1;
    const i = this.n++, m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ry), new THREE.Vector3(sx, sy, sz));
    this.mats[i] = m;
    this.mesh.setMatrixAt(i, tampil ? m : NOL);
    if (warna) this.mesh.setColorAt(i, warna);
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    return i;
  }
  tampil(i, ya) { this.mesh.setMatrixAt(i, ya ? this.mats[i] : NOL); this.kotor = true; }
  skala(i, sx, sy, sz) { // untuk animasi (api)
    const m = this.mats[i]; const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    m.decompose(p, q, s); this.mesh.setMatrixAt(i, new THREE.Matrix4().compose(p, q, new THREE.Vector3(sx, sy, sz))); this.kotor = true;
  }
  sinkron() { if (this.kotor) { this.mesh.instanceMatrix.needsUpdate = true; this.kotor = false; } }
}

const HIJAU = [0x2f7a3a, 0x3b8a3c, 0x2a6e44, 0x4a9a3e, 0x2c7a52, 0x558f34].map(c => new THREE.Color(c));
const HIJAU_GELAP = [0x1f5a34, 0x24663a, 0x1b5030].map(c => new THREE.Color(c));

// ---------- Dunia ----------
export function buatObjek(scene, terrain) {
  const dunia = new THREE.Group(); scene.add(dunia);
  const acak = rng(20260);

  // Air: laut dan sungai (satu bidang di y = 0)
  const air = mesh(new THREE.PlaneGeometry(3000, 3000), M.air, 0, 0, 0);
  air.rotation.x = -Math.PI / 2; dunia.add(air);

  // Sawah bertekstur
  const texSawah = teksSawah();
  SAWAH.forEach(s => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(s.w, s.d), new THREE.MeshLambertMaterial({ map: texSawah }));
    p.rotation.x = -Math.PI / 2; p.position.set(s.x, tinggi(s.x, s.z) + 0.12, s.z); dunia.add(p);
  });

  // Jembatan
  const jx = sungaiX(JEMBATAN.z), jb = new THREE.Group();
  jb.add(kotak(M.kayu, 0, JEMBATAN.tinggi - 0.2, 0, JEMBATAN.panjang, 0.4, JEMBATAN.lebar));
  [-1, 1].forEach(s => { jb.add(kotak(M.kayu, 0, JEMBATAN.tinggi + 0.7, s * (JEMBATAN.lebar / 2 - 0.2), JEMBATAN.panjang, 0.2, 0.2)); });
  for (let i = -3; i <= 3; i++) [-1, 1].forEach(s => jb.add(kotak(M.kayu, i * 7, JEMBATAN.tinggi + 0.3, s * (JEMBATAN.lebar / 2 - 0.2), 0.3, 1.2, 0.3)));
  for (let i = -2; i <= 2; i++) jb.add(kotak(M.kayu, i * 8, 0.6, 0, 0.8, 2.4 + 1.2, 0.8));
  jb.position.set(jx, 0, JEMBATAN.z); dunia.add(jb);

  // ----- Tumbuhan dekoratif (hutan di bukit, semak, batu) -----
  const zonaKena = (x, z, m = 0) => ZONA.some(zn => { const c = pusatZona(zn); return Math.abs(x - c.x) < 82 + m && Math.abs(z - c.z) < 68 + m; });
  const bebas = (x, z) => !zonaKena(x, z, 4) && jarakJalan(x, z) > 7
    && !DESA.some(d => Math.hypot(x - d.x, z - d.z) < 52) && Math.hypot(x - TPA.x, z - TPA.z) > 40
    && Math.hypot(x - KANTOR.x, z - 50) > 40 && !SAWAH.some(s => Math.abs(x - s.x) < s.w / 2 + 6 && Math.abs(z - s.z) < s.d / 2 + 6)
    && Math.abs(x - sungaiX(z)) > 16 && FOOT.every(f => Math.hypot(f.x - x, f.z - z) > f.r + 4);
  const batangDekor = new Inst(geo.batang, M.batang, 1400), bulatDekor = new Inst(geo.tajukBulat, M.daun, 800, true), kerucutDekor = new Inst(geo.tajukKerucut, M.daun, 800, true);
  const batuDekor = new Inst(geo.batu, M.batu, 220);
  let pohon = 0, batu = 0;
  const titikDekor = []; // untuk menyingkirkan pohon dan batu saat ada bangunan baru
  for (let k = 0; k < 9000 && pohon < 1100; k++) {
    const x = (acak() * 2 - 1) * (R - 12), z = (acak() * 2 - 1) * (R - 12);
    if (Math.hypot(x, z) > R - 25 || !bebas(x, z)) continue;
    const h = tinggi(x, z);
    if (h < 1.4) continue;
    const rapat = fbm(x * 0.02 + 90, z * 0.02 + 40, 3);
    if (rapat < 0.45 && acak() < 0.85) continue;
    const tinggiB = 3 + acak() * 3.5, tajuk = 2 + acak() * 1.6, ids = [];
    if (h > 8 || acak() < 0.35) {
      ids.push([batangDekor, batangDekor.tambah(x, h, z, 0.5, tinggiB * 0.6, 0.5)]);
      ids.push([kerucutDekor, kerucutDekor.tambah(x, h + tinggiB * 0.4, z, tajuk, tinggiB * 1.8, tajuk, acak() * 6, true, HIJAU_GELAP[Math.floor(acak() * 3)])]);
    } else {
      ids.push([batangDekor, batangDekor.tambah(x, h, z, 0.55, tinggiB, 0.55)]);
      ids.push([bulatDekor, bulatDekor.tambah(x, h + tinggiB + tajuk * 0.5, z, tajuk, tajuk * 0.85, tajuk, acak() * 6, true, HIJAU[Math.floor(acak() * 6)])]);
    }
    titikDekor.push({ x, z, ids, tampil: true });
    pohon++;
  }
  for (let k = 0; k < 3000 && batu < 200; k++) {
    const x = (acak() * 2 - 1) * (R - 15), z = (acak() * 2 - 1) * (R - 15);
    if (Math.hypot(x, z) > R - 20 || !bebas(x, z)) continue;
    const h = tinggi(x, z); if (h < 0.5) continue;
    const s = 0.6 + acak() * 1.8;
    titikDekor.push({ x, z, ids: [[batuDekor, batuDekor.tambah(x, h + s * 0.3, z, s, s * 0.7, s, acak() * 6)]], tampil: true }); batu++;
  }
  function bersihkan(x, z, r) {
    for (const d of titikDekor) if (d.tampil && Math.hypot(d.x - x, d.z - z) < r) { d.tampil = false; d.ids.forEach(([inst, id]) => inst.tampil(id, false)); }
    [batangDekor, bulatDekor, kerucutDekor, batuDekor].forEach(i => i.sinkron());
  }
  [batangDekor, bulatDekor, kerucutDekor, batuDekor].forEach(i => dunia.add(i.mesh));

  // ----- Petak hutan (bisa berubah status) -----
  const total = ZONA.length * KOLOM * BARIS;
  const I = {
    batang: new Inst(geo.batang, M.batang, total * 16), bulat: new Inst(geo.tajukBulat, M.daun, total * 16, true), kerucut: new Inst(geo.tajukKerucut, M.daun, total * 16, true),
    tunggul: new Inst(geo.batang, M.arang, total * 16), palemB: new Inst(geo.batang, M.batang, total * 16), palemD: new Inst(geo.tajukPalem, M.sawitDaun, total * 16),
    api1: new Inst(geo.api, M.api, total * 5), api2: new Inst(geo.api, M.api2, total * 5),
  };
  Object.values(I).forEach(i => dunia.add(i.mesh));
  const petak = [];
  ZONA.forEach((zn, zi) => {
    for (let j = 0; j < BARIS; j++) for (let i = 0; i < KOLOM; i++) {
      const cx = zn.x + i * JARAK, cz = zn.z + j * JARAK;
      const p = { zona: zi, i, j, cx, cz, status: 'hutan', api: 0, siklus: 0, umurLahan: 0, ref: { hutan: [], api: [], lahan: [], sawit: [] }, warna: terrain.indeksPersegi(cx, cz, UKURAN / 2 + 1) };
      // Hutan
      for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
        if (acak() < 0.12) continue;
        const x = cx + (a - 1.5) * 6 + (acak() - 0.5) * 3, z = cz + (b - 1.5) * 6 + (acak() - 0.5) * 3, h = tinggi(x, z);
        const th = 4 + acak() * 5, tj = 2.2 + acak() * 1.5;
        p.ref.hutan.push([I.batang, I.batang.tambah(x, h, z, 0.55, th, 0.55)]);
        if (acak() < 0.6) p.ref.hutan.push([I.bulat, I.bulat.tambah(x, h + th + tj * 0.5, z, tj, tj * 0.85, tj, acak() * 6, true, HIJAU[Math.floor(acak() * 6)])]);
        else p.ref.hutan.push([I.kerucut, I.kerucut.tambah(x, h + th * 0.5, z, tj * 0.95, th * 1.5, tj * 0.95, acak() * 6, true, HIJAU_GELAP[Math.floor(acak() * 3)])]);
        // Tunggul dan sawit pada posisi yang sama
        p.ref.lahan.push([I.tunggul, I.tunggul.tambah(x, h, z, 0.5, 0.9, 0.5, 0, false)]);
      }
      // Sawit: barisan rapi
      for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
        const x = cx + (a - 1.5) * 6, z = cz + (b - 1.5) * 6, h = tinggi(x, z);
        p.ref.sawit.push([I.palemB, I.palemB.tambah(x, h, z, 0.4, 4.2, 0.4, 0, false)]);
        p.ref.sawit.push([I.palemD, I.palemD.tambah(x, h + 4.1, z, 2.5, 1.3, 2.5, a + b, false)]);
      }
      // Api
      p.api1 = []; p.api2 = [];
      for (let k = 0; k < 5; k++) {
        const x = cx + (acak() - 0.5) * 18, z = cz + (acak() - 0.5) * 18, h = tinggi(x, z), I2 = k % 2 ? I.api1 : I.api2;
        const id = I2.tambah(x, h, z, 2.2, 5, 2.2, 0, false);
        p.ref.api.push([I2, id]); (k % 2 ? p.api1 : p.api2).push([I2, id, x, h, z]);
      }
      petak.push(p);
    }
  });
  const sinkron = () => Object.values(I).forEach(i => i.sinkron());
  function tampilkan(p) {
    for (const k of ['hutan', 'api', 'lahan', 'sawit']) {
      const on = (k === p.status) || (k === 'lahan' && p.status === 'api' && false);
      for (const [inst, id] of p.ref[k]) inst.tampil(id, on);
    }
    sinkron();
    terrain.warnai(p.warna, { hutan: null, api: [0.2, 0.15, 0.12], lahan: [0.3, 0.23, 0.16], sawit: [0.42, 0.52, 0.2] }[p.status]);
  }
  function animasiApi(p, t) {
    p.api1.concat(p.api2).forEach(([inst, id, x, h, z], i) => {
      const s = 4 + Math.sin(t * 9 + i * 1.7) * 1.5;
      const m = new THREE.Matrix4().compose(new THREE.Vector3(x, h, z), new THREE.Quaternion(), new THREE.Vector3(2.3, s, 2.3));
      inst.mats[id] = m; inst.mesh.setMatrixAt(id, m); inst.kotor = true;
    });
  }

  // ----- Desa (tata letak dari tata.js, tanpa tumpang tindih) -----
  function rumah(x, z, tipe, ry) {
    const g = new THREE.Group(), h = tinggi(x, z), bahan = [M.rumah, M.rumah2, M.rumah3][tipe % 3];
    if (tipe === 0) { // rumah biasa
      g.add(kotak(bahan, 0, 1.6, 0, 5, 3.2, 4.5), mesh(prisma(6, 2.4, 5.4), M.atapMerah, 0, 3.2, 0), kotak(M.kayu, 0, 1.2, 2.3, 1, 2.4, 0.1), kotak(M.kaca, -1.7, 1.9, 2.3, 1, 1, 0.1));
    } else if (tipe === 1) { // rumah panggung
      for (const [sx, sz] of [[-2, -1.8], [2, -1.8], [-2, 1.8], [2, 1.8]]) g.add(tiang(M.kayu, sx, 0.8, sz, 0.18, 1.6));
      g.add(kotak(M.kayu, 0, 1.7, 0, 5.4, 0.3, 4.6), kotak(bahan, 0, 3.2, 0, 5, 2.8, 4.2), mesh(prisma(6.2, 2.2, 5.2), M.atapCoklat, 0, 4.6, 0), kotak(M.kayu, 0, 0.8, 3, 1.2, 1.6, 0.4));
    } else { // joglo
      g.add(kotak(bahan, 0, 1.8, 0, 6, 3.6, 6), mesh(geo.kerucut, M.atapMerah, 0, 5, 0, 5.2, 2.8, 5.2), kotak(M.kayu, 0, 1.3, 3.05, 1.2, 2.6, 0.1));
      g.children[1].rotation.y = Math.PI / 4;
    }
    g.scale.setScalar(1.3);
    g.position.set(x, h, z); g.rotation.y = ry; dunia.add(g);
  }
  const palemDesa = new Inst(geo.batang, M.batang, 80), palemDesaD = new Inst(geo.tajukPalem, M.sawitDaun, 80);
  DESA.forEach((d, di) => {
    const tt = TATA.desa[di];
    tt.rumah.forEach(r => rumah(r.x, r.z, r.tipe, r.ry));
    const l = new THREE.Group(); l.add(tiang(M.kayu, 0, 1.6, 0, 1.6, 3.2), mesh(geo.kerucut, M.atapCoklat, 0, 4.2, 0, 2.1, 2.2, 2.1)); l.position.set(tt.lumbung.x, tinggi(tt.lumbung.x, tt.lumbung.z), tt.lumbung.z); dunia.add(l);
    const b = new THREE.Group(); b.add(kotak(M.krem, 0, 2, 0, 10, 4, 6), mesh(prisma(11, 3, 7), M.atapHijau, 0, 4, 0));
    const bp = papan('BALAI DESA', 6, 1.8); bp.position.set(0, 5, 3.2); b.add(bp);
    b.position.set(tt.balai.x, tinggi(tt.balai.x, tt.balai.z), tt.balai.z); dunia.add(b);
    const pd = papan(d.nama, 9, 3.4); pd.position.set(tt.papan.x, tinggi(tt.papan.x, tt.papan.z) + 5.5, tt.papan.z); pd.rotation.y = Math.PI / 2; dunia.add(pd);
    dunia.add(tiang(M.kayu, tt.papan.x, tinggi(tt.papan.x, tt.papan.z) + 2.6, tt.papan.z - 4.2, 0.2, 5.2), tiang(M.kayu, tt.papan.x, tinggi(tt.papan.x, tt.papan.z) + 2.6, tt.papan.z + 4.2, 0.2, 5.2));
    tt.palem.forEach(({ x, z }) => {
      const h = tinggi(x, z), th = 4 + acak() * 2;
      palemDesa.tambah(x, h, z, 0.4, th, 0.4); palemDesaD.tambah(x, h + th - 0.1, z, 2.6, 1.3, 2.6, acak() * 6);
    });
  });
  dunia.add(palemDesa.mesh, palemDesaD.mesh);

  // ----- TPA -----
  for (let i = 0; i < 9; i++) {
    const x = TPA.x + (i - 4) * 4.5 + (acak() - 0.5) * 3, z = TPA.z + ((i * 7) % 5) * 2 - 4, s = 3 + acak() * 3;
    dunia.add(mesh(geo.kerucut, M.sampah, x, tinggi(x, z) + s * 0.4, z, s * 1.3, s, s * 1.3));
  }
  [0xd6453d, 0x5aa0d6, 0xe8b83c, 0x5fb36a, 0xffffff].forEach((c, i) => { const m = new THREE.MeshLambertMaterial({ color: c }); for (let k = 0; k < 4; k++) { const x = TPA.x + (acak() - 0.5) * 36, z = TPA.z + (acak() - 0.5) * 22; dunia.add(mesh(geo.box, m, x, tinggi(x, z) + 0.4, z, 0.8, 0.5, 0.8)); } });
  const tp = papan('TPA\n(Taman Pemandangan Abadi)', 8, 3); tp.position.set(TPA.x, tinggi(TPA.x, TPA.z - 14) + 5, TPA.z - 14); dunia.add(tp);

  // ----- Kantor Dinas -----
  const k = new THREE.Group();
  k.add(kotak(M.kantor, 0, 6, 0, 22, 12, 12), mesh(prisma(24, 4, 13), M.atapAbu, 0, 12, 0), kotak(M.batu, 0, 0.4, 6.8, 24, 0.8, 3));
  for (let i = -2; i <= 2; i++) k.add(tiang(M.putih, i * 4.4, 5.6, 7.6, 0.6, 11));
  for (let i = -2; i <= 2; i++) k.add(kotak(M.kaca, i * 4.4, 8, 6.05, 2.2, 3, 0.1));
  const pk = papan('KANTOR DINAS\nBerkas & Kambing Hitam', 14, 4.4); pk.position.set(0, 13.6, 7.2); k.add(pk);
  k.position.set(KANTOR.x, tinggi(KANTOR.x, KANTOR.z), KANTOR.z); dunia.add(k);

  // ----- Pesisir: perahu kecil dan rambu -----
  [[-120, -250], [260, 60], [-250, 200]].forEach(([x, z]) => { const p = new THREE.Group(); p.add(kotak(M.kayu, 0, 0.4, 0, 6, 0.8, 1.8), kotak(M.atapMerah, 0, 1.4, 0, 0.2, 2, 0.2)); p.position.set(x * 0.95, 0.1, z * 0.95); dunia.add(p); });

  // ----- Awan -----
  const awan = [];
  for (let i = 0; i < 12; i++) {
    const g = new THREE.Group();
    for (let k2 = 0; k2 < 4; k2++) g.add(mesh(geo.bola, M.awan, (k2 - 1.5) * 9, acak() * 3, (acak() - 0.5) * 6, 10 + acak() * 5, 3 + acak() * 2, 7 + acak() * 3));
    g.position.set((acak() * 2 - 1) * 500, 110 + acak() * 50, (acak() * 2 - 1) * 500); dunia.add(g); awan.push(g);
  }

  return { dunia, petak, tampilkan, animasiApi, sinkron, awan, I, jembatanX: jx, bersihkan };
}

// ---------- Tokoh ----------
export function manusia(jaket = M.jaket, peci = true, skala = 0.5) {
  const g = new THREE.Group();
  const lenganK = new THREE.Group(), lenganN = new THREE.Group(), kakiK = new THREE.Group(), kakiN = new THREE.Group();
  g.add(mesh(geo.box, jaket, 0, 2.3, 0, 1.4, 1.8, 0.8), mesh(geo.bola, M.kulit, 0, 3.7, 0, 0.62, 0.62, 0.62));
  if (peci) g.add(mesh(geo.silinder, M.hitam, 0, 4.25, 0, 0.58, 0.36, 0.58));
  lenganK.add(mesh(geo.box, jaket, 0, -0.7, 0, 0.45, 1.5, 0.45)); lenganK.position.set(-0.95, 3.0, 0);
  lenganN.add(mesh(geo.box, jaket, 0, -0.7, 0, 0.45, 1.5, 0.45)); lenganN.position.set(0.95, 3.0, 0);
  kakiK.add(mesh(geo.box, M.hitam, 0, -0.7, 0, 0.55, 1.4, 0.55)); kakiK.position.set(-0.35, 1.4, 0);
  kakiN.add(mesh(geo.box, M.hitam, 0, -0.7, 0, 0.55, 1.4, 0.55)); kakiN.position.set(0.35, 1.4, 0);
  g.add(lenganK, lenganN, kakiK, kakiN);
  g.scale.setScalar(skala);
  g.userData = { lenganK, lenganN, kakiK, kakiN };
  return g;
}

// ---------- Bangunan buatan pemain ----------
function tandai(g, meshes) { g.userData.warna = meshes; return g; }
export function bangunanMBG() {
  const g = new THREE.Group(), w = [];
  const a = kotak(M.tembok, 0, 3, 0, 11, 6, 8), b = mesh(prisma(12.4, 3.2, 9), M.atapMerah, 0, 6, 0), c = kotak(M.krem, -3.2, 7.6, -1, 1.2, 4, 1.2);
  g.add(a, b, c, kotak(M.emas, 0, 6.05, 4.1, 11.2, 0.4, 0.2), kotak(M.kaca, -2.8, 3.4, 4.05, 3, 1.8, 0.1), kotak(M.kayu, 3, 2, 4.05, 1.8, 4, 0.1), kotak(M.putih, -2.8, 2.2, 4.4, 3.2, 0.3, 0.9));
  for (let i = 0; i < 4; i++) g.add(kotak(M.emas, -4 + i * 1.1, 2.55, 4.45, 0.9, 0.2, 0.7));
  const pn = papan('DAPUR EMAS (MBG)', 9, 2.4); pn.position.set(0, 8.8, 4.3); g.add(pn);
  [-1, 1].forEach(s => g.add(mesh(geo.silinder, M.atapHijau, s * 6.2, 0.9, 5.2, 0.6, 0.9, 0.6)));
  return tandai(g, [a, b, c]);
}
export function bangunanKopdes() {
  const g = new THREE.Group();
  const a = kotak(M.krem, 0, 2.6, 0, 12, 5.2, 8), b = mesh(prisma(13.4, 3, 9), M.atapHijau, 0, 5.2, 0), v = kotak(M.putih, 0, 1.4, 4.2, 12, 0.5, 2);
  g.add(a, b, v, kotak(M.kaca, -3.6, 2.8, 4.05, 3, 2, 0.1), kotak(M.kaca, 3.6, 2.8, 4.05, 3, 2, 0.1), kotak(M.kayu, 0, 1.8, 4.05, 1.8, 3.6, 0.1));
  for (const x of [-5, 5]) g.add(tiang(M.putih, x, 2.6, 4.9, 0.3, 5.2));
  g.add(kotak(M.atapHijau, 0, 5.3, 4.8, 12.6, 0.3, 2));
  const pn = papan('KOPDES EMAS', 9, 2.4); pn.position.set(0, 7.9, 4.3); g.add(pn);
  return tandai(g, [a, b, v]);
}
export function mangkrakkan(g) {
  g.userData.warna.forEach(m => { m.material = M.mangkrak; });
  g.rotation.z = 0.09;
  for (let i = -1; i <= 1; i++) { const s = mesh(geo.silinder, M.bambu, i * 4.2, 4.4, 4.9, 0.15, 8.8, 0.15); s.rotation.z = i * 0.15; g.add(s); }
  [[-3, 6.6], [3, 7.2]].forEach(([x, y]) => g.add(kotak(new THREE.MeshLambertMaterial({ color: 0x4a6a30 }), x, y, 4.2, 1.6, 0.5, 0.4)));
}
export function baliho(x, z, hadap, tema = 'BERKAT SAYA,\nNEGERI INI MAJU!') {
  const g = new THREE.Group();
  g.add(tiang(M.batang, -4, 4, 0, 0.3, 8), tiang(M.batang, 4, 4, 0, 0.3, 8));
  const p = papan(tema, 10, 5, { wajah: true }); p.position.set(0, 9, 0.2); g.add(p);
  g.position.set(x, tinggi(x, z), z); g.rotation.y = hadap;
  return g;
}
export function pilar() { // penanda tujuan: balok cahaya (jauh), cincin dan panah (selalu terlihat)
  const g = new THREE.Group();
  const tabung = mesh(geo.silinder, new THREE.MeshBasicMaterial({ color: 0xffd23a, transparent: true, opacity: 0.28, depthWrite: false, fog: false }), 0, 30, 0, 2.4, 60, 2.4);
  const kerucut = mesh(geo.kerucut, new THREE.MeshBasicMaterial({ color: 0xffd23a, fog: false, depthTest: false }), 0, 12, 0, 2.2, 3.6, 2.2); kerucut.rotation.x = Math.PI; kerucut.renderOrder = 10;
  const cincin = new THREE.Mesh(new THREE.RingGeometry(4.2, 5.4, 40), new THREE.MeshBasicMaterial({ color: 0xffd23a, transparent: true, opacity: 0.9, side: THREE.DoubleSide, fog: false, depthTest: false }));
  cincin.rotation.x = -Math.PI / 2; cincin.position.y = 0.5; cincin.renderOrder = 10;
  g.add(tabung, kerucut, cincin); g.userData = { tabung, kerucut, cincin };
  return g;
}

// ---------- Kios UMKM ----------
const WARNA_ATAP = [0xd6453d, 0x2f7a55, 0xe8b83c, 0x5aa0d6, 0xb36a2a, 0x8a5aa0];
const LABEL = { ramah: ['PEMILIK RAMAH', '#9ad98f'], biasa: ['PEMILIK BIASA', '#f1d96a'], galak: ['PEMILIK GALAK', '#f08a80'] };
export function kios(nama, tipe, indeks) {
  const g = new THREE.Group();
  const atap = new THREE.MeshLambertMaterial({ color: WARNA_ATAP[indeks % WARNA_ATAP.length] });
  g.add(kotak(new THREE.MeshLambertMaterial({ color: 0xd9c9a4 }), 0, 1.4, -1.2, 5, 2.8, 2), kotak(M.kayu, 0, 1.0, 0.5, 4.6, 0.25, 1.2), kotak(M.kayu, 0, 0.5, 0.5, 4.4, 1, 1));
  const kanopi = kotak(atap, 0, 3.2, 0.1, 5.6, 0.25, 3.6); g.add(kanopi);
  g.add(tiang(M.kayu, -2.6, 1.6, 1.7, 0.12, 3.2), tiang(M.kayu, 2.6, 1.6, 1.7, 0.12, 3.2));
  [0xe8b83c, 0xd6453d, 0x5fb36a, 0x5aa0d6].forEach((c, i) => g.add(kotak(new THREE.MeshLambertMaterial({ color: c }), -1.6 + i * 1.07, 1.35, 0.5, 0.7, 0.5, 0.6)));
  const pemilik = manusia(new THREE.MeshLambertMaterial({ color: [0x4a7ab0, 0xb04a6a, 0x6a9a4a][indeks % 3] }), false, 0.385);
  pemilik.position.set(0, 0, -0.4); g.add(pemilik);
  const nm = papan(nama, 5.4, 1.2, { latar: '#f3e8c8' }); nm.position.set(0, 4.1, 1.95); g.add(nm);
  const [teksL, warnaL] = LABEL[tipe];
  const label = papan(teksL, 4, 0.9, { latar: warnaL }); label.position.set(0, 5.3, 1.95); g.add(label);
  const tutup = papan('TUTUP (GULUNG TIKAR)', 4.4, 1, { latar: '#9a9a9a' }); tutup.position.set(0, 2.2, 1.9); tutup.visible = false; g.add(tutup);
  g.userData = { pemilik, atap, kanopi, label, tutup, warnaAsli: atap.color.getHex() };
  return g;
}
export function aparatSewaan() {
  const jaket = new THREE.MeshLambertMaterial({ color: 0x1f3a6a });
  const g = manusia(jaket, false, 0.52);
  g.add(mesh(geo.silinder, jaket, 0, 4.2, 0, 0.62, 0.3, 0.62));
  return g;
}

// ---------- Ojol (ojek online, generik) ----------
const WARNA_LABEL = { ramah: '#9ad98f', biasa: '#f1d96a', galak: '#f08a80', mogok: '#a0a0a0', darurat: '#ff7a6a', ada: '#9ad98f', proses: '#f1d96a', tutup: '#ff7a6a' };
export function labelSprite(teks, tipe) {
  const c = document.createElement('canvas'); c.width = 320; c.height = 80;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set(5, 1.25, 1);
  sp.userData.set = (t, w) => {
    const x = c.getContext('2d'); x.clearRect(0, 0, 320, 80);
    x.fillStyle = WARNA_LABEL[w] || '#fff'; x.strokeStyle = '#4a2a06'; x.lineWidth = 5;
    if (x.roundRect) { x.beginPath(); x.roundRect(4, 6, 312, 68, 18); x.fill(); x.stroke(); } else { x.fillRect(4, 6, 312, 68); x.strokeRect(4, 6, 312, 68); }
    x.fillStyle = '#3a2204'; x.font = 'bold 34px sans-serif'; x.textAlign = 'center'; x.fillText(t, 160, 52);
    tex.needsUpdate = true;
  };
  sp.userData.set(teks, tipe);
  return sp;
}
export function ojol(indeks) {
  const g = new THREE.Group();
  const hijau = new THREE.MeshLambertMaterial({ color: 0x2fa04a }), motor = new THREE.MeshLambertMaterial({ color: [0x3a4a6a, 0x8a3a3a, 0x4a4a4a][indeks % 3] });
  g.add(kotak(motor, 0, 1.0, 0, 0.8, 0.55, 2.3), kotak(motor, 0, 1.45, 0.45, 0.7, 0.35, 0.9), kotak(M.hitam, 0, 1.28, -0.25, 0.75, 0.15, 0.9));
  g.add(kotak(M.hitam, 0, 1.2, 0.95, 0.12, 0.9, 0.12), kotak(M.hitam, 0, 1.62, 0.85, 1.3, 0.1, 0.1));
  const roda = [];
  [1.05, -1.0].forEach(z => {
    const r = mesh(geo.silinder, M.hitam, 0, 0.55, z, 0.55, 0.28, 0.55); r.rotation.z = Math.PI / 2; r.add(mesh(geo.box, M.putih, 0.0, 0, 0, 0.5, 1.05, 0.2));
    g.add(r); roda.push(r);
  });
  g.add(kotak(hijau, 0, 2.05, -1.15, 1.15, 1.0, 1.0));
  const bp = papan('OJOL', 1.0, 0.55, { latar: '#2fa04a', warna: '#ffffff' }); bp.position.set(0, 2.05, -1.66); bp.rotation.y = Math.PI; g.add(bp);
  const pengendara = manusia(new THREE.MeshLambertMaterial({ color: 0x2fa04a }), false, 0.4);
  pengendara.position.set(0, 1.0, -0.2); pengendara.add(mesh(geo.bola, M.putih, 0, 3.9, 0, 0.72, 0.62, 0.72));
  g.add(pengendara);
  g.scale.setScalar(1.15);
  g.userData = { pemilik: pengendara, roda };
  return g;
}

// ---------- Kendaraan yang bisa dikendarai pemain ----------
export function motorPemain() {
  const g = new THREE.Group();
  const cat = new THREE.MeshLambertMaterial({ color: 0xc89a2a }), krom = new THREE.MeshLambertMaterial({ color: 0xb8b8b8 });
  g.add(kotak(cat, 0, 1.0, 0, 0.9, 0.6, 2.4), kotak(cat, 0, 1.55, 0.5, 0.8, 0.4, 1.0), kotak(M.hitam, 0, 1.32, -0.3, 0.8, 0.18, 1.0));
  g.add(kotak(krom, 0, 1.2, 1.0, 0.14, 1.0, 0.14), kotak(M.hitam, 0, 1.7, 0.9, 1.5, 0.12, 0.12), kotak(krom, 0, 0.75, -1.15, 0.5, 0.2, 0.5));
  const lampu = kotak(new THREE.MeshBasicMaterial({ color: 0xfff2b0 }), 0, 1.5, 1.2, 0.35, 0.25, 0.1); g.add(lampu);
  const roda = [];
  [1.1, -1.05].forEach(z => {
    const r = mesh(geo.silinder, M.hitam, 0, 0.58, z, 0.58, 0.3, 0.58); r.rotation.z = Math.PI / 2; r.add(mesh(geo.box, M.putih, 0, 0, 0, 0.5, 1.05, 0.2));
    g.add(r); roda.push(r);
  });
  g.scale.setScalar(1.15);
  g.userData = { roda };
  return g;
}
export function mobilDinas() {
  const g = new THREE.Group();
  const cat = new THREE.MeshLambertMaterial({ color: 0x1e1e22 }), emasM = new THREE.MeshLambertMaterial({ color: 0xe8b83c });
  const merah = new THREE.MeshBasicMaterial({ color: 0xff2a2a }), biru = new THREE.MeshBasicMaterial({ color: 0x2a6aff });
  g.add(kotak(cat, 0, 1.15, 0, 2.7, 1.2, 6.0), kotak(cat, 0, 2.05, -0.2, 2.4, 1.0, 3.2), kotak(M.kaca, 0, 2.1, 1.32, 2.2, 0.8, 0.1), kotak(M.kaca, 0, 2.1, -1.74, 2.2, 0.8, 0.1));
  [-1, 1].forEach(s => g.add(kotak(M.kaca, s * 1.22, 2.1, -0.2, 0.1, 0.75, 2.6)));
  g.add(kotak(emasM, 0, 1.25, 3.02, 2.0, 0.28, 0.08), kotak(emasM, 0, 1.25, -3.02, 2.0, 0.28, 0.08));
  [[-1, 2.9], [1, 2.9]].forEach(([s, z]) => g.add(kotak(new THREE.MeshBasicMaterial({ color: 0xfff2b0 }), s * 0.8, 1.2, z, 0.5, 0.3, 0.08)));
  const lampuM = kotak(merah, -0.5, 2.7, -0.2, 0.9, 0.25, 0.5), lampuB = kotak(biru, 0.5, 2.7, -0.2, 0.9, 0.25, 0.5); g.add(lampuM, lampuB);
  const roda = [];
  [[-1.4, 1.9], [1.4, 1.9], [-1.4, -1.9], [1.4, -1.9]].forEach(([x, z]) => {
    const r = mesh(geo.silinder, M.hitam, x, 0.7, z, 0.72, 0.32, 0.72); r.rotation.z = Math.PI / 2; r.add(mesh(geo.box, M.putih, 0, 0, 0, 0.45, 1.05, 0.2)); g.add(r); roda.push(r);
  });
  const pl = papan('MOBIL DINAS', 2.4, 0.6, { latar: '#e8b83c' }); pl.position.set(0, 1.9, 3.1); g.add(pl);
  g.userData = { roda, lampuM, lampuB };
  return g;
}


// ---------- Sekolah, puskesmas, ambulans, dan manusia mini ----------
export function bangunanSekolah(nama) {
  const g = new THREE.Group();
  g.add(kotak(M.krem, 0, 2.6, 0, 20, 5.2, 7), mesh(prisma(21.5, 2.8, 8.4), M.atapMerah, 0, 5.2, 0), kotak(M.putih, 0, 0.35, 4.6, 20, 0.7, 2));
  for (let i = 0; i < 5; i++) { g.add(kotak(M.kaca, -8 + i * 4, 3.4, 3.55, 2.2, 1.6, 0.1), kotak(M.kayu, -8 + i * 4, 1.5, 3.55, 1.2, 2.6, 0.1)); }
  const pn = papan(nama, 13, 2.4); pn.position.set(0, 6.4, 4.3); g.add(pn);
  const halaman = mesh(new THREE.PlaneGeometry(26, 16), new THREE.MeshLambertMaterial({ color: 0xa8b090 }), 0, 0.1, 15);
  halaman.rotation.x = -Math.PI / 2; g.add(halaman);
  return g;
}
export function bangunanPuskesmas() {
  const g = new THREE.Group(), merah = new THREE.MeshLambertMaterial({ color: 0xd6302a });
  g.add(kotak(M.putih, 0, 2.6, 0, 14, 5.2, 8), kotak(M.atapAbu, 0, 5.4, 0, 15, 0.5, 9), kotak(M.kaca, -4, 2.8, 4.05, 3, 1.8, 0.1), kotak(M.kaca, 4, 2.8, 4.05, 3, 1.8, 0.1), kotak(M.kayu, 0, 1.5, 4.05, 1.6, 3, 0.1));
  g.add(kotak(merah, 0, 7.0, 4.0, 3.2, 0.9, 0.3), kotak(merah, 0, 7.0, 4.0, 0.9, 3.2, 0.3));
  const pn = papan('PUSKESMAS MAKMUR\nBuka 08.00-12.00', 9, 2.6); pn.position.set(0, 4.6, 4.3); g.add(pn);
  g.add(kotak(M.atapAbu, 9.5, 3.4, 0, 6, 0.3, 6.5)); [[-2.7, -3], [-2.7, 3], [2.7, -3], [2.7, 3]].forEach(([x, z]) => g.add(tiang(M.putih, 9.5 + x, 1.7, z, 0.2, 3.4)));
  return g;
}
export function ambulans() {
  const g = new THREE.Group(), merah = new THREE.MeshLambertMaterial({ color: 0xd6302a });
  const lampuM = kotak(new THREE.MeshBasicMaterial({ color: 0xff2a2a }), -0.55, 3.0, 0.2, 0.9, 0.25, 0.5), lampuB = kotak(new THREE.MeshBasicMaterial({ color: 0x2a6aff }), 0.55, 3.0, 0.2, 0.9, 0.25, 0.5);
  g.add(kotak(M.putih, 0, 1.7, -0.6, 2.7, 2.2, 4.2), kotak(M.putih, 0, 1.2, 2.5, 2.7, 1.3, 1.8), kotak(M.kaca, 0, 2.1, 3.0, 2.3, 0.7, 0.1), lampuM, lampuB);
  [-1, 1].forEach(s => g.add(kotak(merah, s * 1.37, 1.7, -0.6, 0.06, 0.4, 4.2), kotak(merah, s * 1.38, 2.2, -0.6, 0.06, 1.2, 0.35), kotak(merah, s * 1.38, 2.2, -0.6, 0.06, 0.35, 1.2)));
  const roda = [];
  [[-1.3, 2.2], [1.3, 2.2], [-1.3, -1.9], [1.3, -1.9]].forEach(([x, z]) => { const r = mesh(geo.silinder, M.hitam, x, 0.65, z, 0.66, 0.3, 0.66); r.rotation.z = Math.PI / 2; r.add(mesh(geo.box, M.putih, 0, 0, 0, 0.45, 1.05, 0.2)); g.add(r); roda.push(r); });
  g.scale.setScalar(1.1);
  g.userData = { roda, lampuM, lampuB };
  return g;
}
export function manusiaMini(baju, celana = M.hitam, skala = 0.5, topi = null) {
  const g = new THREE.Group(), lenganK = new THREE.Group(), lenganN = new THREE.Group();
  g.add(mesh(geo.box, baju, 0, 2.3, 0, 1.4, 1.8, 0.8), mesh(geo.bola, M.kulit, 0, 3.7, 0, 0.62, 0.62, 0.62), mesh(geo.box, celana, 0, 0.75, 0, 1.0, 1.5, 0.6));
  lenganK.add(mesh(geo.box, baju, 0, -0.7, 0, 0.45, 1.5, 0.45)); lenganK.position.set(-0.95, 3.0, 0);
  lenganN.add(mesh(geo.box, baju, 0, -0.7, 0, 0.45, 1.5, 0.45)); lenganN.position.set(0.95, 3.0, 0);
  g.add(lenganK, lenganN);
  if (topi) g.add(mesh(geo.silinder, topi, 0, 4.2, 0, 0.62, 0.4, 0.62));
  g.scale.setScalar(skala);
  g.userData = { lenganK, lenganN };
  return g;
}
