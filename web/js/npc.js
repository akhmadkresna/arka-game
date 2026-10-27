// NPC dan kejadian di sekitar dapur MBG: murid, guru, juru masak, pengantar, wartawan, ambulans.
// Catatan kepekaan: korban keracunan tidak digambarkan. Ambulans hanya berlabel jumlah siswa yang dirujuk,
// dan sasaran satirnya adalah jawaban pejabat serta pembiaran, bukan anak-anak.
import * as THREE from '../vendor/three.module.js';
import { M, bangunanSekolah, bangunanPuskesmas, ambulans, manusiaMini, ojol, labelSprite } from './objek.js';
import { JALAN, sungaiX, JEMBATAN } from './konfig.js';
import { TATA } from './tata.js';

const rand = (a, b) => a + Math.random() * (b - a);
const dist = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);
const sisi = (x, z) => (x < sungaiX(z) ? 0 : 1);
const UJUNG = [{ x: sungaiX(JEMBATAN.z) - 22, z: JEMBATAN.z }, { x: sungaiX(JEMBATAN.z) + 22, z: JEMBATAN.z }];
const wrap = a => ((a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

// Rute lurus; bila berbeda sisi sungai, lewat jembatan
function rute(a, b) {
  const p = [];
  if (sisi(a.x, a.z) !== sisi(b.x, b.z)) { const s = sisi(a.x, a.z); p.push(UJUNG[s], UJUNG[1 - s]); }
  p.push({ x: b.x, z: b.z });
  return p;
}

export const SANGKALAN = [
  'Juru bicara: "Bukan keracunan. Itu reaksi tubuh terhadap gizi yang meningkat."',
  'Juru bicara: "Kasus ini terisolasi dan sedang dievaluasi menyeluruh."',
  'Juru bicara: "Sertifikat higiene dapurnya sedang diproses. Sejak 2024."',
  'Juru bicara: "Anak-anak hanya diperiksa. Sebagai langkah pencegahan. Dengan sirene."',
  'Juru bicara: "Dapur ini sudah sesuai prosedur. Prosedurnya kami tidak tahu."',
];

export function buatNPC(d) {
  const { scene, G, tinggi, lantai, E, bunyi, toast, monolog, pemain, V, batas } = d;
  const grup = new THREE.Group(); scene.add(grup);
  let waktu = 0, sirenTimer = 0;

  const taruh = (o, dt, tinggiTambahan = 0) => {
    o.g.position.set(o.x, Math.max(lantai(o.x, o.z), 0.3) + tinggiTambahan, o.z);
    o.g.rotation.y += wrap(o.ry - o.g.rotation.y) * Math.min(1, dt * 8);
  };
  function ikuti(o, dt, v) {
    const t = o.rute[o.idx]; if (!t) return true;
    const dx = t.x - o.x, dz = t.z - o.z, jarak = Math.hypot(dx, dz);
    if (jarak < 3) { o.idx++; return o.idx >= o.rute.length; }
    const l = Math.min(jarak, v * dt); o.x += dx / jarak * l; o.z += dz / jarak * l; o.ry = Math.atan2(dx, dz);
    return false;
  }

  // ---------- Sekolah: murid bermain di halaman, guru berjaga ----------
  const SEKOLAH = [];
  TATA.desa.forEach((t, di) => {
    const sk = t.sekolah; if (!sk) return;
    const g = bangunanSekolah('SD NEGERI HARAPAN ' + String(di + 1).padStart(2, '0'));
    g.position.set(sk.x, tinggi(sk.x, sk.z), sk.z); g.rotation.y = sk.ry; scene.add(g);
    const f = [Math.sin(sk.ry), Math.cos(sk.ry)], r = [Math.cos(sk.ry), -Math.sin(sk.ry)];
    const s = { x: sk.x, z: sk.z, f, r, pusat: { x: sk.x + f[0] * 15, z: sk.z + f[1] * 15 }, anak: [], kumpul: null };
    const putih = new THREE.MeshLambertMaterial({ color: 0xf4f4f4 }), merah = new THREE.MeshLambertMaterial({ color: 0xc0392b });
    for (let i = 0; i < 8; i++) {
      const u = rand(-10, 10), v = rand(-6, 6), x = s.pusat.x + r[0] * u + f[0] * v, z = s.pusat.z + r[1] * u + f[1] * v;
      const m = manusiaMini(putih, merah, 0.32); grup.add(m);
      s.anak.push({ g: m, x, z, ry: rand(0, 6.28), tx: x, tz: z, tunggu: rand(0, 2) });
    }
    const guru = manusiaMini(new THREE.MeshLambertMaterial({ color: 0x9a7a4a }), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }), 0.5); grup.add(guru);
    s.guru = { g: guru, x: sk.x + f[0] * 8.5 + r[0] * 5, z: sk.z + f[1] * 8.5 + r[1] * 5, ry: sk.ry };
    SEKOLAH.push(s);
  });
  function perbaruiSekolah(dt) {
    for (const s of SEKOLAH) {
      if (s.kumpul && (s.kumpul.sisa -= dt) <= 0) s.kumpul = null;
      for (const a of s.anak) {
        let bergerak = false;
        if (s.kumpul) { // makan siang tiba: berkerumun di dekat pengantar
          if (dist(a.x, a.z, a.tx, a.tz) < 0.5) { a.tx = s.kumpul.x + rand(-3.5, 3.5); a.tz = s.kumpul.z + rand(-3.5, 3.5); }
        } else if ((a.tunggu -= dt) <= 0 && dist(a.x, a.z, a.tx, a.tz) < 0.5) {
          const u = rand(-10, 10), v = rand(-6, 6); a.tx = s.pusat.x + s.r[0] * u + s.f[0] * v; a.tz = s.pusat.z + s.r[1] * u + s.f[1] * v; a.tunggu = rand(1, 4);
        }
        const dx = a.tx - a.x, dz = a.tz - a.z, jr = Math.hypot(dx, dz);
        if (jr > 0.4) { const l = Math.min(jr, (s.kumpul ? 4 : 2) * dt); a.x += dx / jr * l; a.z += dz / jr * l; a.ry = Math.atan2(dx, dz); bergerak = true; }
        a.g.position.set(a.x, lantai(a.x, a.z) + (bergerak ? Math.abs(Math.sin(waktu * 10 + a.tx)) * 0.08 : 0), a.z);
        a.g.rotation.y += wrap(a.ry - a.g.rotation.y) * Math.min(1, dt * 8);
        const u = a.g.userData, ay = bergerak ? Math.sin(waktu * 9 + a.tx) * 0.7 : 0; u.lenganK.rotation.x = ay; u.lenganN.rotation.x = -ay;
      }
      const gu = s.guru; gu.g.position.set(gu.x, lantai(gu.x, gu.z), gu.z); gu.g.rotation.y = gu.ry;
      gu.g.userData.lenganK.rotation.x = s.kumpul ? -2.4 + Math.sin(waktu * 5) * 0.3 : 0; // melambai saat makan siang
    }
  }

  // ---------- Puskesmas dan ambulans ----------
  const pk = TATA.desa[0] && TATA.desa[0].puskesmas;
  let parkir = null;
  if (pk) {
    const g = bangunanPuskesmas(); g.position.set(pk.x, tinggi(pk.x, pk.z), pk.z); g.rotation.y = pk.ry; scene.add(g);
    const f = [Math.sin(pk.ry), Math.cos(pk.ry)], r = [Math.cos(pk.ry), -Math.sin(pk.ry)];
    parkir = { x: pk.x + f[0] * 14 + r[0] * 9, z: pk.z + f[1] * 14 + r[1] * 9 };
  }
  const AMBULANS = [];
  const jalurAmb = [JALAN[0], JALAN[2], null];
  jalurAmb.forEach((pts, i) => {
    const g = ambulans(), label = labelSprite('AMBULANS', 'darurat'); label.position.set(0, 4.8, 0); g.add(label); scene.add(g);
    const a = { g, label, mode: 'patroli', v: 0, x: 0, z: 0, ry: 0, timer: 0, n: 0, rute: [], idx: 0, pts, seg: [], tot: 0, s: 0, arah: i % 2 ? 1 : -1 };
    if (pts) { for (let k = 0; k < pts.length - 1; k++) { const l = dist(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1]); a.seg.push(l); a.tot += l; } a.s = Math.random() * a.tot; }
    else { a.mode = 'parkir'; a.x = parkir ? parkir.x : 0; a.z = parkir ? parkir.z : 0; a.ry = pk ? pk.ry : 0; }
    AMBULANS.push(a);
  });
  function titikJalur(a, s) {
    let sisaS = s;
    for (let k = 0; k < a.seg.length; k++) {
      if (sisaS <= a.seg[k] || k === a.seg.length - 1) {
        const t = Math.min(1, sisaS / a.seg[k]), [ax, az] = a.pts[k], [bx, bz] = a.pts[k + 1], l = a.seg[k] || 1;
        return { x: ax + (bx - ax) * t, z: az + (bz - az) * t, dx: (bx - ax) / l, dz: (bz - az) / l };
      }
      sisaS -= a.seg[k];
    }
  }
  function titikTerdekat(a, x, z) { // titik jalur patroli terdekat (untuk kembali setelah mengantar)
    let terbaik = { s: 0, d: 1e9 };
    for (let s = 0; s <= a.tot; s += 5) { const p = titikJalur(a, s); const dd = dist(p.x, p.z, x, z); if (dd < terbaik.d) terbaik = { s, d: dd, x: p.x, z: p.z }; }
    return terbaik;
  }
  const teksLabel = (a, teks, w = 'darurat') => { if (a.labelTeks !== teks) { a.labelTeks = teks; a.label.userData.set(teks, w); } };
  function perbaruiAmbulans(dt) {
    let adaSirene = false;
    for (const a of AMBULANS) {
      const darurat = a.mode === 'menuju' || a.mode === 'antar';
      if (a.mode === 'patroli') {
        a.v += (9 - a.v) * Math.min(1, dt * 2);
        a.s += a.arah * a.v * dt; if (a.s > a.tot) { a.s = a.tot; a.arah = -1; } if (a.s < 0) { a.s = 0; a.arah = 1; }
        const p = titikJalur(a, a.s), hx = p.dx * a.arah, hz = p.dz * a.arah;
        a.x = p.x + hz * 2.4; a.z = p.z - hx * 2.4; a.ry = Math.atan2(hx, hz); teksLabel(a, 'AMBULANS', 'tutup');
      } else if (a.mode === 'parkir') { a.v = 0; teksLabel(a, 'AMBULANS', 'tutup'); }
      else if (a.mode === 'menuju') { teksLabel(a, 'MENUJU DAPUR'); a.v = 19; if (ikuti(a, dt, 19)) { a.mode = 'muat'; a.timer = 3.5; } }
      else if (a.mode === 'muat') { a.v = 0; teksLabel(a, `MUAT ${a.n} SISWA`); if ((a.timer -= dt) <= 0) { a.mode = 'antar'; a.rute = rute(a, parkir || { x: a.x, z: a.z }); a.idx = 0; } }
      else if (a.mode === 'antar') {
        teksLabel(a, `RUJUK ${a.n} SISWA`); a.v = 19;
        if (ikuti(a, dt, 19)) { a.mode = 'tiba'; a.timer = 2.5; G.korban += a.n; E.teks(new THREE.Vector3(a.x, a.g.position.y + 5, a.z), `${a.n} siswa dirujuk`, 'besar buruk'); bunyi.pop(); }
      } else if (a.mode === 'tiba') { a.v = 0; teksLabel(a, 'TIBA DI PUSKESMAS', 'tutup'); if ((a.timer -= dt) <= 0) { a.n = 0; a.mode = 'kembali'; const t = a.pts ? titikTerdekat(a, a.x, a.z) : { x: parkir ? parkir.x : a.x, z: parkir ? parkir.z : a.z, s: 0 }; a.sKembali = t.s; a.rute = rute(a, t); a.idx = 0; } }
      else if (a.mode === 'kembali') { a.v = 12; if (ikuti(a, dt, 12)) { if (a.pts) { a.s = a.sKembali; a.mode = 'patroli'; } else a.mode = 'parkir'; } }
      taruh(a, dt);
      a.g.userData.roda.forEach(r => { r.rotation.x += a.v * dt * 1.6; });
      const kedip = darurat || a.mode === 'muat' ? Math.sin(waktu * 14) > 0 : false;
      a.g.userData.lampuM.visible = kedip; a.g.userData.lampuB.visible = darurat || a.mode === 'muat' ? !kedip : false;
      a.label.visible = a.mode !== 'patroli' && a.mode !== 'parkir' ? true : dist(a.x, a.z, pemain.position.x, pemain.position.z) < 40;
      if (darurat && dist(a.x, a.z, pemain.position.x, pemain.position.z) < 90) adaSirene = true;
    }
    if (adaSirene && (sirenTimer -= dt) <= 0) { sirenTimer = 0.9; bunyi.sirene(); }
  }
  function kirimAmbulans(b, n) {
    const tujuan = { x: b.x + Math.sin(b.g.rotation.y) * 13, z: b.z + Math.cos(b.g.rotation.y) * 13 };
    const bebas = AMBULANS.filter(a => a.mode === 'patroli' || a.mode === 'parkir' || a.mode === 'kembali').sort((p, q) => dist(p.x, p.z, b.x, b.z) - dist(q.x, q.z, b.x, b.z)).slice(0, 2);
    if (!bebas.length) { G.korban += n; return 0; } // semua ambulans sibuk: dirujuk lewat jalur lain
    bebas.forEach((a, i) => { a.n = i === 0 ? Math.ceil(n * 0.6) : n - Math.ceil(n * 0.6); a.mode = 'menuju'; a.rute = rute(a, tujuan); a.idx = 0; });
    return bebas.length;
  }

  // ---------- Dapur: label SLHS, juru masak ----------
  function labelDapur(b) {
    if (!b.label) { b.label = labelSprite('SLHS', 'proses'); b.label.position.set(0, 11.8, 0); b.g.add(b.label); }
    const ditutup = G.t < (b.sampai || 0);
    const kunci = b.mangkrak ? 'mangkrak' : ditutup ? 'tutup' : b.slhs ? 'ada' : 'proses';
    if (b.labelKunci === kunci) return;
    b.labelKunci = kunci;
    if (kunci === 'mangkrak') b.label.visible = false;
    else { b.label.visible = true; b.label.userData.set(kunci === 'tutup' ? 'DITUTUP SEMENTARA' : kunci === 'ada' ? 'SLHS: ADA (DI KERTAS)' : 'SLHS: PROSES (SEJAK 2024)', kunci); }
  }
  function tambahJuru(b) {
    const rot = b.g.rotation.y, f = [Math.sin(rot), Math.cos(rot)], r = [Math.cos(rot), -Math.sin(rot)];
    const putih = new THREE.MeshLambertMaterial({ color: 0xf2f2f2 }), topi = new THREE.MeshLambertMaterial({ color: 0xf2f2f2 });
    b.juru = [-3, 3].map((u, i) => {
      const g = manusiaMini(putih, M.hitam, 0.5, topi); const x = b.x + f[0] * 8 + r[0] * u, z = b.z + f[1] * 8 + r[1] * u;
      g.position.set(x, lantai(x, z), z); g.rotation.y = rot + Math.PI; grup.add(g); return { g, fase: i * 1.7 };
    });
  }
  function hapusJuru(b) { (b.juru || []).forEach(j => grup.remove(j.g)); b.juru = null; }
  function dapurBaru(b) { if (b.jenis === 'mbg') { b.cek = rand(12, 20); b.antar = rand(6, 14); labelDapur(b); } }

  // ---------- Pengantar makan siang ----------
  const PENGANTAR = [];
  function kirimPengantar(b) {
    if (PENGANTAR.length >= 3 || !SEKOLAH.length) return;
    const s = SEKOLAH.slice().sort((p, q) => dist(p.x, p.z, b.x, b.z) - dist(q.x, q.z, b.x, b.z))[0];
    const g = ojol(PENGANTAR.length + 5), lb = labelSprite('ANTAR MBG', 'ada'); lb.position.set(0, 4.4, 0); g.add(lb); scene.add(g);
    const dari = { x: b.x + Math.sin(b.g.rotation.y) * 11, z: b.z + Math.cos(b.g.rotation.y) * 11 };
    PENGANTAR.push({ g, x: dari.x, z: dari.z, ry: 0, dapur: dari, sekolah: s, fase: 'pergi', rute: rute(dari, s.pusat), idx: 0, timer: 0 });
  }
  function perbaruiPengantar(dt) {
    for (let i = PENGANTAR.length - 1; i >= 0; i--) {
      const p = PENGANTAR[i];
      if (p.fase === 'pergi') { if (ikuti(p, dt, 11)) { p.fase = 'tunggu'; p.timer = 5; p.sekolah.kumpul = { x: p.x, z: p.z, sisa: 5 }; } }
      else if (p.fase === 'tunggu') { if ((p.timer -= dt) <= 0) { p.fase = 'pulang'; p.rute = rute(p, p.dapur); p.idx = 0; } }
      else if (ikuti(p, dt, 11)) { scene.remove(p.g); PENGANTAR.splice(i, 1); continue; }
      taruh(p, dt); p.g.userData.roda.forEach(r => { r.rotation.x += (p.fase === 'tunggu' ? 0 : 11) * dt * 1.6; });
    }
  }

  // ---------- Wartawan datang setelah kejadian ----------
  const WARTAWAN = [];
  function kirimWartawan(b) {
    if (WARTAWAN.length >= 2) return;
    let x = 0, z = 0;
    for (let k = 0; k < 10; k++) { const a = rand(0, 6.28); x = b.x + Math.cos(a) * 55; z = b.z + Math.sin(a) * 55; if (lantai(x, z) > 0.8) break; }
    const rompi = new THREE.MeshLambertMaterial({ color: 0x3a6aa0 }), g = manusiaMini(rompi, M.hitam, 0.5);
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 1.1), M.hitam)); g.children[g.children.length - 1].position.set(1.5, 3.4, 1.0);
    grup.add(g);
    const tujuan = { x: b.x + Math.sin(b.g.rotation.y) * 16 + rand(-3, 3), z: b.z + Math.cos(b.g.rotation.y) * 16 + rand(-3, 3) };
    WARTAWAN.push({ g, x, z, ry: 0, awal: { x, z }, rute: rute({ x, z }, tujuan), idx: 0, fase: 'datang', timer: 0 });
  }
  function perbaruiWartawan(dt) {
    for (let i = WARTAWAN.length - 1; i >= 0; i--) {
      const w = WARTAWAN[i];
      if (w.fase === 'datang') { if (ikuti(w, dt, 7)) { w.fase = 'liput'; w.timer = 22; G.citra = Math.max(0, G.citra - 4); G.rakyat = batas(G.rakyat + 2); E.teks(new THREE.Vector3(w.x, lantai(w.x, w.z) + 3.5, w.z), 'LIVE!', 'besar buruk'); bunyi.selfie(); } }
      else if (w.fase === 'liput') { if ((w.timer -= dt) <= 0) { w.fase = 'pergi'; w.rute = rute(w, w.awal); w.idx = 0; } }
      else if (ikuti(w, dt, 7)) { grup.remove(w.g); WARTAWAN.splice(i, 1); continue; }
      w.g.position.set(w.x, lantai(w.x, w.z), w.z); w.g.rotation.y += wrap(w.ry - w.g.rotation.y) * Math.min(1, dt * 8);
      w.g.userData.lenganK.rotation.x = w.fase === 'liput' ? -1.5 : 0; w.g.userData.lenganN.rotation.x = w.fase === 'liput' ? -1.5 : 0;
    }
  }

  // ---------- Kopdes: bendahara membawa kabur kas ----------
  const KABUR = [
    'Bendahara Kopdes menyetor "uang terima kasih" ke kantong Bapak Menteri. Pembukuan: tidak pernah ada.',
    'Kas Kopdes "diamankan" ke kantong Menteri. Anggota koperasi dijanjikan sisa-sisanya.',
    'Laporan Kopdes: kas aman. Posisi kas: di saku jas Menteri. Sangat aman.',
    'Juru bicara: "Dana itu bukan hilang, melainkan dipindahkan ke pihak yang lebih berjasa."',
  ];
  const PENGURUS = [];
  function picuKasRaib(b) {
    const untung = Math.floor(rand(25, 55));
    b.sampai = G.t + 40; G.kasRaib = (G.kasRaib || 0) + 1;
    G.cuan += untung; G.panas = batas(G.panas + 3); G.rakyat = batas(G.rakyat + 3);
    E.teks(V(b.x, b.z, 7), `KAS KOPDES MASUK KANTONG +${untung}`, 'besar emas');
    toast(KABUR[Math.floor(Math.random() * KABUR.length)]);
    const g = manusiaMini(new THREE.MeshLambertMaterial({ color: 0x7a4a2a }), M.hitam, 0.5);
    const karung = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6), new THREE.MeshLambertMaterial({ color: 0xd9b66a }));
    karung.position.set(0, 3.2, -0.9); g.add(karung); grup.add(g);
    const a = rand(0, 6.28), tujuan = { x: b.x + Math.cos(a) * 70, z: b.z + Math.sin(a) * 70 };
    PENGURUS.push({ g, x: b.x, z: b.z, ry: 0, rute: rute({ x: b.x, z: b.z }, tujuan), idx: 0, fase: 0 });
  }
  function perbaruiPengurus(dt) {
    for (let i = PENGURUS.length - 1; i >= 0; i--) {
      const w = PENGURUS[i];
      if (ikuti(w, dt, 13)) { grup.remove(w.g); PENGURUS.splice(i, 1); continue; }
      w.fase += dt * 14; taruh(w, dt);
      const u = w.g.userData; u.lenganK.rotation.x = Math.sin(w.fase) * 1.1; u.lenganN.rotation.x = -Math.sin(w.fase) * 1.1;
    }
  }
  function perbaruiKopdes(dt) {
    for (const b of G.bangunan) {
      if (b.jenis !== 'kopdes' || b.mangkrak || b.pop < 1 || G.t < (b.sampai || 0)) continue;
      b.cek = (b.cek ?? 12) - dt;
      if (b.cek <= 0) { b.cek = 12; if (b.umur > 12 && Math.random() < 0.4) picuKasRaib(b); }
    }
  }

  // ---------- Kejadian keracunan ----------
  function picuInsiden(b) {
    const n = Math.floor(rand(8, 31));
    b.sampai = G.t + 60; G.insiden++;
    const kirim = kirimAmbulans(b, n);
    G.rakyat = batas(G.rakyat + 8); G.restu = batas(G.restu - 4); G.panas = batas(G.panas + 3); G.citra = Math.max(0, G.citra - 6);
    const pos = V(b.x, b.z, 7);
    E.teks(pos, 'KEJADIAN LUAR BIASA', 'besar buruk'); E.getar(0.3); bunyi.sirene(); bunyi.gagal();
    toast(`${SANGKALAN[Math.floor(Math.random() * SANGKALAN.length)]} ${n} siswa dirujuk, dapur ditutup sementara.`);
    monolog('keracunan');
    kirimWartawan(b);
    return { n, kirim };
  }
  function perbaruiDapur(dt) {
    for (const b of G.bangunan) {
      if (b.jenis !== 'mbg') continue;
      labelDapur(b);
      if (b.mangkrak) { if (b.juru) hapusJuru(b); continue; }
      if (b.pop < 1) continue;
      if (!b.juru) tambahJuru(b);
      b.juru.forEach(j => { const u = j.g.userData; u.lenganK.rotation.x = -1.2 + Math.sin(waktu * 6 + j.fase) * 0.5; u.lenganN.rotation.x = -1.2 + Math.sin(waktu * 6 + j.fase + 3.1) * 0.5; });
      if (G.t < (b.sampai || 0)) continue;
      b.antar = (b.antar ?? 8) - dt; if (b.antar <= 0) { b.antar = rand(30, 45); kirimPengantar(b); }
      b.cek = (b.cek ?? 15) - dt;
      if (b.cek <= 0) {
        b.cek = 18;
        const faktor = b.lok === 'tpa' ? 2 : b.lok === 'sungai' ? 1.5 : 1;
        if (b.umur > 20 && Math.random() < (b.slhs ? 0.08 : 0.38) * faktor) picuInsiden(b);
      }
    }
  }

  function update(dt) {
    waktu += dt;
    perbaruiSekolah(dt); perbaruiAmbulans(dt); perbaruiPengantar(dt); perbaruiWartawan(dt); perbaruiPengurus(dt);
    if (G.jalan) { perbaruiDapur(dt); perbaruiKopdes(dt); }
  }
  return { update, dapurBaru, labelDapur, picuInsiden, kirimAmbulans, AMBULANS, SEKOLAH, PENGANTAR, WARTAWAN };
}
