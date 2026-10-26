// Efek visual: uang beterbangan ke kantong, percikan, angka melayang, getar kamera.
import * as THREE from '../vendor/three.module.js';
import { bunyi } from './bunyi.js';

const NOL = new THREE.Matrix4().makeScale(0, 0, 0);
const TIPE = {
  api:    { warna: [0xff7a1a, 0xffd23a, 0xff4a1a], naik: [4, 9], sebar: 3, grav: -2, hidup: [0.6, 1.1], ukuran: [0.18, 0.4] },
  percik: { warna: [0xffd23a, 0xfff1a8], naik: [5, 8], sebar: 3, grav: 14, hidup: [0.4, 0.7], ukuran: [0.18, 0.3] },
  kayu:   { warna: [0x8a6a42, 0x6b4a2a, 0xb59b5a], naik: [5, 9], sebar: 4, grav: 22, hidup: [0.7, 1.0], ukuran: [0.14, 0.3] },
  daun:   { warna: [0x4a9a3e, 0x7ab648, 0x2f7a3a], naik: [3, 6], sebar: 3, grav: 7, hidup: [1.0, 1.4], ukuran: [0.2, 0.36] },
  debu:   { warna: [0xd9c9a4, 0xb59b7a, 0xe6dcc0], naik: [1, 3], sebar: 5, grav: 2, hidup: [0.8, 1.2], ukuran: [0.25, 0.5] },
  konfeti:{ warna: [0xffd23a, 0xd6453d, 0x5aa0d6, 0x5fb36a, 0xffffff], naik: [7, 12], sebar: 5, grav: 12, hidup: [1.2, 1.7], ukuran: [0.16, 0.28] },
  asap:   { warna: [0x6a6560, 0x8a847c], naik: [2, 3.5], sebar: 0.8, grav: -0.4, hidup: [1.6, 2.4], ukuran: [0.4, 0.8], tumbuh: true },
};
const acakDi = (a, b) => a + Math.random() * (b - a);
const pilih = a => a[Math.floor(Math.random() * a.length)];

export function buatEfek(scene, kamera, pemain, wadahTeks, elCuan) {
  const v = new THREE.Vector3(), v2 = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler(), m = new THREE.Matrix4(), s3 = new THREE.Vector3();
  const warna = new THREE.Color();

  // ----- Koin dan uang kertas yang terbang -----
  const MAKS = 110;
  const koin = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 10), new THREE.MeshBasicMaterial({ color: 0xffd23a, fog: false }), MAKS);
  const uang = new THREE.InstancedMesh(new THREE.BoxGeometry(0.8, 0.05, 0.4), new THREE.MeshBasicMaterial({ color: 0x72d67f, fog: false }), MAKS);
  [koin, uang].forEach(mm => { mm.frustumCulled = false; mm.count = 0; scene.add(mm); });
  const daftar = [];
  const kantong = (out = new THREE.Vector3()) => {
    const ry = pemain.rotation.y;
    return out.set(pemain.position.x + Math.cos(ry) * 0.35 + Math.sin(ry) * 0.3, pemain.position.y + 1.15, pemain.position.z - Math.sin(ry) * 0.35 + Math.cos(ry) * 0.3);
  };
  function terbang(dari, ke, n, arah) {
    for (let i = 0; i < n && daftar.length < 150; i++) {
      daftar.push({
        tipe: Math.random() < 0.45 ? 'uang' : 'koin', arah,
        dari: dari.clone().add(v.set((Math.random() - 0.5) * 1.6, Math.random() * 1.2, (Math.random() - 0.5) * 1.6)),
        ke: ke ? ke.clone() : null, tunda: Math.random() * 0.4, t: 0, dur: 0.7 + Math.random() * 0.35, busur: 2 + Math.random() * 3.5, putar: 6 + Math.random() * 10,
      });
    }
  }
  const koinMasuk = (dari, n = 6) => terbang(dari, null, n, 'masuk');
  const koinKeluar = (ke, n = 5) => { if (n > 0) bunyi.uangKeluar(); terbang(kantong(), ke, n, 'keluar'); };

  // ----- Percikan (slot tetap) -----
  const MB = 360;
  const bm = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }), MB);
  bm.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MB * 3), 3);
  bm.frustumCulled = false; scene.add(bm);
  const slot = new Array(MB).fill(null);
  for (let i = 0; i < MB; i++) bm.setMatrixAt(i, NOL);
  let geserSlot = 0;
  function semburan(pos, jenis, n = 10) {
    const c = TIPE[jenis]; if (!c) return;
    for (let k = 0; k < n; k++) {
      let id = -1;
      for (let j = 0; j < MB; j++) { const i = (geserSlot + j) % MB; if (!slot[i]) { id = i; break; } }
      if (id < 0) return;
      geserSlot = id + 1;
      const a = Math.random() * 6.283, r = Math.random() * c.sebar, hidup = acakDi(c.hidup[0], c.hidup[1]);
      slot[id] = { p: pos.clone().add(v.set(Math.cos(a) * 0.4, 0.2, Math.sin(a) * 0.4)), vx: Math.cos(a) * r, vy: acakDi(c.naik[0], c.naik[1]), vz: Math.sin(a) * r, grav: c.grav, hidup, maks: hidup, uk: acakDi(c.ukuran[0], c.ukuran[1]), tumbuh: !!c.tumbuh };
      bm.setColorAt(id, warna.setHex(pilih(c.warna)));
    }
    bm.instanceColor.needsUpdate = true;
  }

  // ----- Angka melayang di dunia dan di HUD -----
  const teksAktif = [];
  function teks(pos, isi, kelas = 'info', jeda = 0) {
    const el = document.createElement('div');
    el.className = 'mel ' + kelas; el.textContent = isi; el.style.visibility = 'hidden';
    wadahTeks.appendChild(el);
    teksAktif.push({ el, pos: pos.clone(), t: -jeda, dur: 1.5 });
  }
  function hudTeks(isi, kelas = 'emas') {
    const el = document.createElement('div'), r = elCuan.getBoundingClientRect();
    el.className = 'mel hud ' + kelas; el.textContent = isi;
    el.style.left = (r.left + r.width / 2) + 'px'; el.style.top = (r.top - 4) + 'px';
    wadahTeks.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  // ----- Getar kamera dan denyut tokoh -----
  let getar = 0, denyut = 0, bumpTimer = 0;
  const kuat = a => { getar = Math.max(getar, a); };
  const ofsetKamera = out => out.set((Math.random() - 0.5) * getar, (Math.random() - 0.5) * getar, (Math.random() - 0.5) * getar);
  function tibaDiKantong() {
    bunyi.koin(); denyut = 0.2;
    elCuan.classList.add('bump'); clearTimeout(bumpTimer); bumpTimer = setTimeout(() => elCuan.classList.remove('bump'), 220);
  }

  function update(dt) {
    // koin dan uang
    let nk = 0, nu = 0;
    kantong(v2);
    for (let i = daftar.length - 1; i >= 0; i--) {
      const p = daftar[i];
      if ((p.tunda -= dt) > 0) continue;
      p.t += dt / p.dur;
      if (p.t >= 1) { if (p.arah === 'masuk') { tibaDiKantong(); semburan(v2, 'percik', 2); } daftar.splice(i, 1); continue; }
      const u = p.t * p.t * (3 - 2 * p.t), A = p.dari, B = p.arah === 'masuk' ? v2 : p.ke;
      const cx = (A.x + B.x) / 2, cy = Math.max(A.y, B.y) + p.busur, cz = (A.z + B.z) / 2;
      const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
      v.set(a * A.x + b * cx + c * B.x, a * A.y + b * cy + c * B.y, a * A.z + b * cz + c * B.z);
      e.set(p.putar * p.t, p.putar * 0.7 * p.t, 0); q.setFromEuler(e);
      const sk = 1 - 0.55 * u * u * u * u; s3.set(sk, sk, sk);
      m.compose(v, q, s3);
      if (p.tipe === 'koin') koin.setMatrixAt(nk++, m); else uang.setMatrixAt(nu++, m);
    }
    koin.count = nk; uang.count = nu;
    koin.instanceMatrix.needsUpdate = uang.instanceMatrix.needsUpdate = true;

    // percikan
    let ada = false;
    for (let i = 0; i < MB; i++) {
      const p = slot[i]; if (!p) continue;
      ada = true;
      if ((p.hidup -= dt) <= 0) { slot[i] = null; bm.setMatrixAt(i, NOL); continue; }
      p.vy -= p.grav * dt; p.p.x += p.vx * dt; p.p.y += p.vy * dt; p.p.z += p.vz * dt;
      const k = p.hidup / p.maks, sk = p.uk * (p.tumbuh ? 1.8 - k : 0.35 + 0.65 * k);
      s3.set(sk, sk, sk); q.identity(); m.compose(p.p, q, s3); bm.setMatrixAt(i, m);
    }
    if (ada) bm.instanceMatrix.needsUpdate = true;

    // angka melayang
    for (let i = teksAktif.length - 1; i >= 0; i--) {
      const o = teksAktif[i]; o.t += dt;
      if (o.t < 0) continue;
      if (o.t >= o.dur) { o.el.remove(); teksAktif.splice(i, 1); continue; }
      v.copy(o.pos); v.y += 1 + o.t * 1.8; v.project(kamera);
      if (v.z > 1) { o.el.style.visibility = 'hidden'; continue; }
      const x = (v.x * 0.5 + 0.5) * innerWidth, y = (-v.y * 0.5 + 0.5) * innerHeight, muncul = Math.min(1, o.t / 0.12), pudar = 1 - Math.max(0, (o.t - 1.0) / 0.5);
      o.el.style.visibility = 'visible'; o.el.style.opacity = pudar;
      o.el.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${0.6 + 0.5 * muncul})`;
    }

    // getar dan denyut
    getar *= Math.exp(-dt * 7); if (getar < 0.005) getar = 0;
    if (denyut > 0) { denyut -= dt; pemain.scale.setScalar(0.5 * (1 + 0.16 * Math.sin(Math.max(0, denyut) / 0.2 * Math.PI))); } else pemain.scale.setScalar(0.5);
  }

  return { koinMasuk, koinKeluar, semburan, teks, hudTeks, getar: kuat, ofsetKamera, update, kantong };
}
