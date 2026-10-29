// Demo rakyat: saat Amarah tinggi, massa datang mengejar. Lari, atau sewa aparat supaya mereka takut.
import * as THREE from '../vendor/three.module.js';
import { M, papan, manusiaMini } from './objek.js';
import { sungaiX } from './konfig.js';

const TULISAN = ['TURUNKAN\nHARGA!', 'HUTAN\nKAMI!', 'SAWIT BUKAN\nHUTAN', 'MANA\nJANJI?', 'UDARA\nBERSIH!', 'KOPDES\nKOSONG!', 'MBG YANG\nBENAR!'];
const SERUAN = ['TURUNKAN HARGA!', 'MANA JANJIMU?', 'HUTAN KAMI!', 'UDARA BERSIH!', 'KOPDES KOSONG!'];
const BAJU = [0xb8362e, 0x3a6aa0, 0x5a8a3a, 0xc98a2a, 0x7a4a8a, 0x2f7a74].map(c => new THREE.MeshLambertMaterial({ color: c }));
const sisi = (x, z) => (x < sungaiX(z) ? 0 : 1);
const rand = (a, b) => a + Math.random() * (b - a);

export function buatDemo({ scene, G, lantai, E, bunyi, toast, pemain, V, batas, kilat }) {
  const massa = [], tanda = [];
  let aktif = false, waktuDemo = 0, jeda = 45, fase = 'kejar', bubar = 0, kebal = 0, takutMode = false, chant = 3;
  const sisiPapan = () => { if (!tanda.length) TULISAN.forEach(t => { const p = papan(t, 3.4, 1.8, { latar: '#fff3c8' }); tanda.push(p); }); };

  function mulai() {
    sisiPapan();
    const px = pemain.position.x, pz = pemain.position.z, s = sisi(px, pz), n = Math.min(14, 8 + Math.floor(G.rakyat / 18));
    let cx = px, cz = pz;
    for (let k = 0; k < 40; k++) {
      const a = rand(0, 6.28), d = rand(55, 80), x = px + Math.cos(a) * d, z = pz + Math.sin(a) * d;
      if (lantai(x, z) > 0.8 && sisi(x, z) === s && Math.hypot(x, z) < 300) { cx = x; cz = z; break; }
    }
    for (let i = 0; i < n; i++) {
      const g = manusiaMini(BAJU[i % BAJU.length], M.hitam, 0.5);
      const t = tanda[i % tanda.length].clone(); t.position.set(0.5, 5.6, 0.2); g.add(t);
      const tongkat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.12), M.kayu); tongkat.position.set(0.5, 4.2, 0.2); g.add(tongkat);
      const x = cx + rand(-6, 6), z = cz + rand(-6, 6);
      g.position.set(x, lantai(x, z), z); scene.add(g);
      massa.push({ g, x, z, ry: 0, v: rand(6.2, 7.6), fase: rand(0, 6), takut: false, jauh: 0 });
    }
    aktif = true; waktuDemo = 0; fase = 'kejar'; bubar = 0; kebal = 0; takutMode = false; chant = 2;
    G.demoKali = (G.demoKali || 0) + 1;
    E.teks(pemain.position.clone().setY(pemain.position.y + 5), 'DEMO RAKYAT!', 'besar buruk'); bunyi.klakson(); E.getar(0.2);
    toast('DEMO! Rakyat datang menuntut janji. Lari, atau sewa aparat supaya mereka takut.');
  }
  function bubarkan(alasan) {
    fase = 'bubar'; bubar = 6;
    if (alasan === 'aparat') {
      G.dibubarkan = (G.dibubarkan || 0) + 1;
      G.rakyat = batas(G.rakyat + 3); G.citra = Math.max(0, G.citra - 3); G.panas = batas(G.panas + 2);
      toast('Aparat berbaris. Rakyat mundur teratur. "Demo ini dibubarkan secara persuasif." Amarah +3, Citra -3.');
    } else if (alasan === 'puas') {
      G.rakyat = batas(G.rakyat - 12);
    }
  }
  function lepas() {
    for (const m of massa) scene.remove(m.g);
    massa.length = 0; aktif = false; jeda = 90 + rand(0, 40);
  }
  function update(dt) {
    if (kebal > 0) kebal -= dt;
    if (!aktif) {
      if (G.misi >= 7 && G.rakyat >= 48 && (jeda -= dt) <= 0) mulai();
      return;
    }
    waktuDemo += dt;
    const px = pemain.position.x, pz = pemain.position.z;
    if (fase === 'kejar' && G.aparat > 0 && massa.some(m => Math.hypot(m.x - px, m.z - pz) < 42)) { takutMode = true; bubarkan('aparat'); }
    if (fase === 'kejar' && waktuDemo > 55) bubarkan('puas');
    if ((chant -= dt) <= 0 && fase === 'kejar') { chant = rand(3, 5); const m = massa[Math.floor(Math.random() * massa.length)]; if (m) E.teks(new THREE.Vector3(m.x, m.g.position.y + 7, m.z), SERUAN[Math.floor(Math.random() * SERUAN.length)], 'info'); }
    let dekat = 0;
    for (const m of massa) {
      const dx = px - m.x, dz = pz - m.z, d = Math.hypot(dx, dz) || 1;
      let ax = 0, az = 0, v = m.v;
      if (fase === 'kejar') { ax = dx / d; az = dz / d; if (d < 1.8) { ax = 0; az = 0; } }
      else if (fase === 'bubar') { ax = -dx / d; az = -dz / d; v = 9.5; if (takutMode && !m.takut) { m.takut = true; E.teks(new THREE.Vector3(m.x, m.g.position.y + 7, m.z), 'TAKUT!', 'buruk'); } }
      for (const o of massa) { if (o === m) continue; const ox = m.x - o.x, oz = m.z - o.z, od = Math.hypot(ox, oz); if (od < 1.6 && od > 0.01) { ax += ox / od * 0.5; az += oz / od * 0.5; } } // tidak menumpuk
      const al = Math.hypot(ax, az);
      if (al > 0.01) {
        const nx = m.x + ax / al * v * dt, nz = m.z + az / al * v * dt;
        if (lantai(nx, nz) > 0.4) { m.x = nx; m.z = nz; } else if (lantai(nx, m.z) > 0.4) m.x = nx; else if (lantai(m.x, nz) > 0.4) m.z = nz;
        m.ry = Math.atan2(ax, az);
      }
      m.fase += dt * 12;
      m.g.position.set(m.x, lantai(m.x, m.z) + Math.abs(Math.sin(m.fase)) * 0.12, m.z);
      m.g.rotation.y += (((m.ry - m.g.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 8);
      const u = m.g.userData, ay = al > 0.01 ? Math.sin(m.fase) * 0.8 : 0; u.lenganK.rotation.x = -2.6 + Math.sin(m.fase * 0.5) * 0.3; u.lenganN.rotation.x = ay;
      if (d < 2.4) dekat++;
      if (fase === 'bubar' && d > 70) m.jauh = 1;
    }
    // Tertangkap massa
    if (fase === 'kejar' && dekat > 0 && kebal <= 0 && G.aparat <= 0) {
      kebal = 5;
      const rugi = Math.min(Math.floor(G.cuan), Math.floor(25 + G.rakyat * 0.3));
      G.cuan -= rugi; G.citra = Math.max(0, G.citra - 4); G.restu = batas(G.restu - 5); G.dikepung = (G.dikepung || 0) + 1;
      const ds = pemain.position.clone(); let ex = 0, ez = 0; for (const m of massa) { ex += px - m.x; ez += pz - m.z; } const el = Math.hypot(ex, ez) || 1;
      const tx = px + ex / el * 6, tz = pz + ez / el * 6; if (lantai(tx, tz) > 0.5 && !G.naik) { pemain.position.x = tx; pemain.position.z = tz; }
      E.teks(ds.setY(ds.y + 5), `DIKEPUNG RAKYAT! -${rugi}`, 'besar buruk'); E.getar(0.5); bunyi.gagal(); kilat && kilat('#d6453d');
      toast(`Rakyat menyampaikan aspirasi dengan sangat dekat. Dompet Anda ikut diaspirasikan. Cuan -${rugi}, Citra -4, Restu -5.`);
      bubarkan('puas');
    }
    if (fase === 'bubar' && ((bubar -= dt) <= 0 || massa.every(m => m.jauh))) lepas();
    // Menyerah bila terpisah sungai dari pemain terlalu lama
    if (fase === 'kejar' && massa.every(m => sisi(m.x, m.z) !== sisi(px, pz)) && waktuDemo > 8) bubarkan('puas');
  }
  return { update, mulai, status: () => ({ aktif, fase, n: massa.length, pos: massa.map(m => [Math.round(m.x), Math.round(m.z)]) }) };
}
