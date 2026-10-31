// Demo rakyat yang gigih: berkumpul di depan kantor, lalu mengikuti pemain ke mana pun selama Amarah tinggi.
// Aparat sewaan hanya membuat mereka mundur sementara; begitu kontrak habis mereka kembali lebih banyak dan lebih cepat.
import * as THREE from '../vendor/three.module.js';
import { M, papan, manusiaMini } from './objek.js';
import { sungaiX, KANTOR } from './konfig.js';

const TULISAN = ['TURUNKAN\nHARGA!', 'HUTAN\nKAMI!', 'SAWIT BUKAN\nHUTAN', 'MANA\nJANJI?', 'UDARA\nBERSIH!', 'KOPERASI\nKOSONG!', 'MAKAN GRATIS\nYANG BENAR!'];
const SERUAN = ['TURUNKAN HARGA!', 'MANA JANJIMU?', 'HUTAN KAMI!', 'UDARA BERSIH!', 'KOPERASI KOSONG!', 'JANGAN KABUR, PAK!'];
const BAJU = [0xb8362e, 0x3a6aa0, 0x5a8a3a, 0xc98a2a, 0x7a4a8a, 0x2f7a74].map(c => new THREE.MeshLambertMaterial({ color: c }));
const sisi = (x, z) => (x < sungaiX(z) ? 0 : 1);
const rand = (a, b) => a + Math.random() * (b - a);
const MAKS = 26, NYALA = 45, PADAM = 28;

export function buatDemo({ scene, G, lantai, E, bunyi, toast, pemain, batas, kilat, titik }) {
  const massa = [], tanda = [];
  let tercatat = false, aktif = false, jeda = 40, kebal = 0, gelombang = 0, aparatSebelumnya = false, fase = 'tidur', chant = 3, pulang = 0, petunjuk = false, waktuDemo = 0;
  const siapkanTanda = () => { if (!tanda.length) TULISAN.forEach(t => tanda.push(papan(t, 3.4, 1.8, { latar: '#fff3c8' }))); };

  function tambah(n, x0, z0, sebar = 6) {
    siapkanTanda();
    for (let i = 0; i < n && massa.length < MAKS; i++) {
      const g = manusiaMini(BAJU[massa.length % BAJU.length], M.hitam, 0.5);
      const t = tanda[massa.length % tanda.length].clone(); t.position.set(0.5, 5.6, 0.2); g.add(t);
      const tongkat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.12), M.kayu); tongkat.position.set(0.5, 4.2, 0.2); g.add(tongkat);
      let x = x0 + rand(-sebar, sebar), z = z0 + rand(-sebar, sebar);
      if (lantai(x, z) < 0.8) { x = x0; z = z0; }
      g.position.set(x, lantai(x, z), z); scene.add(g);
      massa.push({ g, x, z, ry: 0, v: rand(6.2, 7.4), fase: rand(0, 6), takut: false, keluar: false, lama: 0 });
    }
  }
  // Titik di sekitar pemain, di sisi sungai yang sama, tempat bala bantuan muncul
  function dekatPemain(jarak) {
    const px = pemain.position.x, pz = pemain.position.z, s = sisi(px, pz);
    for (let k = 0; k < 40; k++) {
      const a = rand(0, 6.28), x = px + Math.cos(a) * jarak, z = pz + Math.sin(a) * jarak;
      if (lantai(x, z) > 0.8 && sisi(x, z) === s && Math.hypot(x, z) < 300) return { x, z };
    }
    return { x: KANTOR.x, z: KANTOR.z + 18 };
  }
  function mulai() {
    const n = Math.min(14, 9 + Math.floor(G.rakyat / 15));
    tambah(n, KANTOR.x, KANTOR.z + 20, 7);
    aktif = true; fase = 'kumpul'; waktuDemo = 0; kebal = 0; gelombang = 0; chant = 2; pulang = 0;
    G.demoKali = (G.demoKali || 0) + 1;
    E.teks(pemain.position.clone().setY(pemain.position.y + 5), 'DEMO DI KANTOR!', 'besar buruk'); bunyi.klakson(); E.getar(0.2);
    toast('DEMO! Rakyat berkumpul di depan kantor, lalu akan mencari Anda ke mana pun. Aparat hanya menahan mereka sebentar.');
    if (!petunjuk) { petunjuk = true; setTimeout(() => toast('Demo baru reda bila Amarah Rakyat turun di bawah 28. Coba konferensi pers atau hentikan kabut.'), 6500); }
  }
  function selesai() { fase = 'pulang'; pulang = 14; toast('Amarah mereda. Massa bubar pulang. Untuk sementara.'); }
  function lepas() { for (const m of massa) scene.remove(m.g); massa.length = 0; aktif = false; fase = 'tidur'; jeda = 70 + rand(0, 40); }

  function update(dt) {
    if (kebal > 0) kebal -= dt;
    if (!aktif) { if (G.misi >= 7 && G.rakyat >= NYALA && (jeda -= dt) <= 0) mulai(); return; }
    waktuDemo += dt;
    const px = pemain.position.x, pz = pemain.position.z, aparat = G.aparat > 0;
    if (fase === 'kumpul' && waktuDemo > 4) fase = 'kejar';
    if (fase !== 'pulang' && G.rakyat < PADAM) selesai();
    if (fase === 'pulang' && ((pulang -= dt) <= 0 || massa.every(m => Math.hypot(m.x - KANTOR.x, m.z - (KANTOR.z + 20)) < 6))) { lepas(); return; }

    // Kontrak aparat berakhir: massa kembali lebih banyak dan lebih cepat
    if (aparatSebelumnya && !aparat && fase === 'kejar') {
      gelombang++;
      const p = dekatPemain(70);
      tambah(3 + gelombang * 2, p.x, p.z, 8);
      massa.forEach(m => { m.v = Math.min(9.5, m.v + 0.35); m.takut = false; });
      G.rakyat = batas(G.rakyat + 4);
      E.teks(pemain.position.clone().setY(pemain.position.y + 5), 'MASSA KEMBALI!', 'besar buruk'); bunyi.klakson(); E.getar(0.25);
      toast(`Kontrak aparat habis. Massa kembali: ${massa.length} orang, lebih ramai dan lebih cepat. Amarah +4.`);
    }
    if (!aparat) tercatat = false;
    aparatSebelumnya = aparat;

    if ((chant -= dt) <= 0 && fase !== 'pulang') { chant = rand(3, 5); const m = massa[Math.floor(Math.random() * massa.length)]; if (m) E.teks(new THREE.Vector3(m.x, m.g.position.y + 7, m.z), SERUAN[Math.floor(Math.random() * SERUAN.length)], 'info'); }

    let dekat = 0, pantau = false;
    for (const m of massa) {
      const dx = px - m.x, dz = pz - m.z, d = Math.hypot(dx, dz) || 1;
      let tx = px, tz = pz, v = m.v, diam = false;
      if (fase === 'kumpul') { tx = KANTOR.x + (m.x - KANTOR.x) * 0.9; tz = KANTOR.z + 20; diam = Math.hypot(m.x - tx, m.z - tz) < 7; }
      else if (fase === 'pulang') { tx = KANTOR.x; tz = KANTOR.z + 20; v = 8; }
      else if (aparat) { // aparat berjaga: mundur bila mendekat, menunggu di tepi
        if (d < 46) { tx = m.x - dx; tz = m.z - dz; v = 10; if (!m.takut) { m.takut = true; E.teks(new THREE.Vector3(m.x, m.g.position.y + 7, m.z), 'TAKUT!', 'buruk'); pantau = true; } }
        else { diam = d < 66; }
      } else {
        v += Math.min(7, Math.max(0, (d - 30) * 0.12)); // menyusul bila tertinggal jauh
        if (kebal > 0) v *= 0.45; // setelah menyergap, beri pemain kesempatan kabur
        if (d > 130) { const p = dekatPemain(55); m.x = p.x; m.z = p.z; } // terlalu jauh: gabung kembali di dekat pemain
        if (d < 1.8) diam = true;
      }
      // Arah: lewat jembatan bila terpisah sungai
      let ax = tx - m.x, az = tz - m.z;
      if (!diam && fase === 'kejar' && (!aparat || d >= 46)) {
        const s = sisi(m.x, m.z), sp = sisi(px, pz);
        if (Math.hypot(m.x - 40, m.z) > 40) m.keluar = false;
        if (s !== sp || m.keluar || Math.abs(m.z) < 8) {
          const w = titik(m.x, m.z, px, pz, m.keluar).slice(1).find(q => Math.hypot(m.x - q.x, m.z - q.z) > (q.keluar ? 3 : 5)) || { x: px, z: pz };
          if (w.keluar && Math.hypot(m.x - w.x, m.z - w.z) < 6) m.keluar = true;
          ax = w.x - m.x; az = w.z - m.z;
        }
      }
      if (diam) { ax = az = 0; }
      for (const o of massa) { if (o === m) continue; const ox = m.x - o.x, oz = m.z - o.z, od = Math.hypot(ox, oz); if (od < 1.6 && od > 0.01) { ax += ox / od * 3; az += oz / od * 3; } }
      const al = Math.hypot(ax, az);
      if (al > 0.05) {
        const nx = m.x + ax / al * v * dt, nz = m.z + az / al * v * dt;
        if (lantai(nx, nz) > 0.4) { m.x = nx; m.z = nz; } else if (lantai(nx, m.z) > 0.4) m.x = nx; else if (lantai(m.x, nz) > 0.4) m.z = nz;
        m.ry = Math.atan2(ax, az);
      }
      m.fase += dt * 12;
      m.g.position.set(m.x, lantai(m.x, m.z) + (al > 0.05 ? Math.abs(Math.sin(m.fase)) * 0.12 : 0), m.z);
      m.g.rotation.y += (((m.ry - m.g.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 8);
      const u = m.g.userData; u.lenganK.rotation.x = -2.6 + Math.sin(m.fase * 0.5) * 0.3; u.lenganN.rotation.x = al > 0.05 ? Math.sin(m.fase) * 0.8 : 0;
      if (d < 2.4) dekat++;
    }
    if (pantau && !tercatat) { tercatat = true; G.dibubarkan = (G.dibubarkan || 0) + 1; G.citra = Math.max(0, G.citra - 3); toast('Aparat berbaris. Massa mundur... untuk sementara. Citra -3.'); }

    // Tersergap massa (berulang selama demo, dengan jeda singkat)
    if (fase === 'kejar' && !aparat && dekat > 0 && kebal <= 0) {
      kebal = 9;
      const rugi = Math.min(Math.floor(G.cuan), Math.floor(20 + G.rakyat * 0.25 + massa.length));
      G.cuan -= rugi; G.citra = Math.max(0, G.citra - 4); G.restu = batas(G.restu - 5); G.rakyat = batas(G.rakyat - 3); G.dikepung = (G.dikepung || 0) + 1;
      const ds = pemain.position.clone(); let ex = 0, ez = 0; for (const m of massa) { ex += px - m.x; ez += pz - m.z; } const el = Math.hypot(ex, ez) || 1;
      const tx = px + ex / el * 6, tz = pz + ez / el * 6; if (lantai(tx, tz) > 0.5 && !G.naik) { pemain.position.x = tx; pemain.position.z = tz; }
      E.teks(ds.setY(ds.y + 5), `DIKEPUNG RAKYAT! -${rugi}`, 'besar buruk'); E.getar(0.5); bunyi.gagal(); kilat && kilat('#d6453d');
      toast(`Rakyat menyampaikan aspirasi dari jarak sangat dekat. Cuan -${rugi}, Citra -4, Restu -5. Mereka masih mengikuti Anda.`);
    }
  }
  return { update, mulai, status: () => ({ aktif, fase, n: massa.length, gelombang, pos: massa.map(m => [Math.round(m.x), Math.round(m.z)]) }) };
}
