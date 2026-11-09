// Penugasan Bos "Telinga di Dinding": rapat tertutup Bos bocor. Cari alat penyadap, lalu pilih: lapor jujur atau sadap balik.
// Musuh Bos adalah Pak Sigap (eks kepala polisi, tokoh rekaan) yang tinggal di vila di tepi Jl. Hutan Timur.
import * as THREE from '../vendor/three.module.js';
import { KANTOR, UMKM, VILA } from './konfig.js';
import { tinggi } from './terrain.js';
import { pasangSesuai, klonModel, gantiDenganSosok } from './model.js';
import { papan, manusia, labelSprite } from './objek.js';

const jarak = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);

export function buatSadap({ scene, G, pemain, E, bunyi, toast, banner, ucapTeks, batas, posMobil, bukaPilihan, lembarTerbuka, segarkan }) {
  // ----- Vila dan Pak Sigap (selalu ada di dunia) -----
  const vila = new THREE.Group(), hv = tinggi(VILA.x, VILA.z);
  vila.position.set(VILA.x, hv, VILA.z); vila.rotation.y = Math.PI; scene.add(vila); // depan vila (+z lokal) menghadap utara, ke jalan
  pasangSesuai('sub/h-t', 16).then(h => { h.position.set(0, 0, -5); vila.add(h); }).catch(() => {});
  [[-7, 6], [7, 6]].forEach(([x, z]) => pasangSesuai('sub/planter', 2.4).then(t => { t.position.set(x, 0, z); vila.add(t); }).catch(() => {}));
  [[-13, 2], [13, 2]].forEach(([x, z]) => pasangSesuai('sub/tree-large', 6).then(t => { t.position.set(x, 0, z); vila.add(t); }).catch(() => {}));
  klonModel('car/sedan').then(m => { m.scale.set(2.35, 2.2, 2.35); m.position.set(10, 0, 8); m.rotation.y = 0.4; vila.add(m); }).catch(() => {});
  const gerbang = papan('VILA SIGAP ASRI\nTamu Wajib Lapor (dan Direkam)', 9, 2.6, { latar: '#e9e2cf' }); gerbang.position.set(0, 8.2, 12.4); vila.add(gerbang);
  [-4.6, 4.6].forEach(x => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.3, 9.4, 0.3), new THREE.MeshLambertMaterial({ color: 0x6a4a2a })); t.position.set(x, 4.7, 12.4); vila.add(t); });

  const sosok = (x, z, ry, nama, skala, klip, model = 'orang/char-j', simpan = []) => {
    const g = manusia(new THREE.MeshLambertMaterial({ color: 0x1f3a6a }), false, 0.5);
    g.position.set(x, tinggi(x, z), z); g.rotation.y = ry; scene.add(g);
    gantiDenganSosok(g, model, skala, simpan, klip);
    return g;
  };
  // Pak Sigap berdiri di teras (depan vila ke utara, jadi ke arah -z dunia)
  const sigap = { x: VILA.x, z: VILA.z - 7 }, aksesori = [], gSigap = sosok(sigap.x, sigap.z, Math.PI, 'Pak Sigap', 2.3, 'idle', 'orang/char-m', aksesori);
  const labelS = labelSprite('PAK SIGAP', 'galak', 34); labelS.position.set(0, 6.2, 0); gSigap.add(labelS);
  // Ciri khas supaya jelas berbeda dari aparat biasa: topi perwira, kacamata hitam, tanda pangkat emas, karpet merah
  {
    const emas = new THREE.MeshLambertMaterial({ color: 0xe8b83c }), putih = new THREE.MeshLambertMaterial({ color: 0xf2f2f2 }), hitam = new THREE.MeshLambertMaterial({ color: 0x0d0d0d }), merah = new THREE.MeshLambertMaterial({ color: 0xb02a2a });
    const F = 1.9, kk = (m, w, h, d, x, y, z, f = F) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w * f, h * f, d * f), m); b.position.set(x * f, y * f, z * f); gSigap.add(b); aksesori.push(b); return b; };
    const k = kk;
    k(hitam, 0.8, 0.11, 0.12, 0, 2.3, 0.5);                // kacamata hitam
    k(hitam, 1.2, 0.18, 1.2, 0, 2.58, 0); k(emas, 1.22, 0.06, 1.22, 0, 2.7, 0); // pita topi emas
    k(putih, 1.15, 0.3, 1.15, 0, 2.88, 0);                 // topi perwira (puncak putih)
    k(hitam, 1.0, 0.07, 0.55, 0, 2.54, 0.85);              // lidah topi
    [-0.78, 0.78].forEach(x => k(emas, 0.5, 0.12, 0.5, x, 1.55, 0)); // pundak emas
    [0, 1, 2].forEach(i => k(emas, 0.17, 0.17, 0.08, -0.32 + i * 0.22, 1.3, 0.58)); // deretan bintang jasa
    k(merah, 5.2, 0.05, 3.2, 0, 0.03, 0.5, 1);                // karpet merah
    k(emas, 5.2, 0.07, 0.12, 0, 0.06, 2.0, 1);
  }
  sosok(VILA.x - 5, VILA.z - 13, 0, 'Pengawal', 1.7, 'idle'); sosok(VILA.x + 5, VILA.z - 13, 0, 'Pengawal', 1.7, 'idle');

  // ----- Alat penyadap (hanya tampil selama penugasan) -----
  const alatBahan = new THREE.MeshLambertMaterial({ color: 0x1a1a1a }), lampuBahan = new THREE.MeshBasicMaterial({ color: 0xff2a2a });
  const buatAlat = () => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.6), alatBahan));
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), lampuBahan); l.position.set(0.25, 0.25, 0); g.add(l);
    g.visible = false; scene.add(g); return g;
  };
  const alat = [
    { nama: 'kantor', tempat: () => ({ x: KANTOR.x + 11, z: KANTOR.z + 12 }), g: buatAlat(), ada: false },
    { nama: 'mobil', tempat: () => { const p = posMobil(); return { x: p.x + 2.4, z: p.z }; }, g: buatAlat(), ada: false },
    { nama: 'warung', tempat: () => ({ x: UMKM[0].x + 4, z: UMKM[0].z + 2 }), g: buatAlat(), ada: false },
  ];
  const KATA_ALAT = ['Label di alat: "Alat Bantu Dengar Aspirasi".', 'Tertulis di bawahnya: "Hadiah dari Tim Peduli Anda".', 'Ada stiker: "Jangan dilepas, ini demi keamanan Anda".'];

  function buat(id) {
    const T = { id, jenis: 'sadap', sisa: 150, fase: 0, ketemu: 0, tahan: 0, selesaiFlag: false, pilihan: null, dibuka: 0, bip: 0, ucapSigap: 0 };
    alat.forEach(a => { a.ada = true; a.g.visible = true; });
    G.sadapMulai = true;
    T.teks = 'Rapat tertutup Bos bocor ke media! Cari 3 alat penyadap yang tersembunyi. Makin dekat, bunyi bip makin cepat.';
    Object.defineProperties(T, {
      ringkas: { get() { return this.fase === 0 ? `Cari alat penyadap (${this.ketemu}/3). Makin dekat, makin cepat bip.` : this.fase === 1 ? 'Pilih sikap: lapor jujur atau sadap balik.' : 'Pasang alat di dekat Pak Sigap. Berdiri dekat sampai selesai.'; } },
    });
    T.target = () => {
      if (T.fase === 0) {
        let t = null, d0 = 1e9;
        alat.filter(a => a.ada).forEach(a => { const p = a.tempat(); const d = jarak(pemain.position.x, pemain.position.z, p.x, p.z); if (d < d0) { d0 = d; t = p; } });
        return t;
      }
      return T.fase === 2 ? sigap : null;
    };
    T.tick = dt => {
      const px = pemain.position.x, pz = pemain.position.z;
      if (T.fase === 0) {
        let dMin = 1e9;
        alat.forEach(a => {
          if (!a.ada) return;
          const p = a.tempat(); a.g.position.set(p.x, tinggi(p.x, p.z) + 0.25, p.z);
          const d = jarak(px, pz, p.x, p.z); dMin = Math.min(dMin, d);
          if (d < 4.5) {
            a.ada = false; a.g.visible = false; T.ketemu++; bunyi.pop(); E.teks(pemain.position.clone().setY(pemain.position.y + 4.5), `Alat ditemukan ${T.ketemu}/3`, 'besar emas');
            toast(KATA_ALAT[T.ketemu - 1]); segarkan();
          }
        });
        if (dMin < 70 && (T.bip -= dt) <= 0) { T.bip = Math.max(0.18, Math.min(1.6, dMin / 35)); bunyi.bip(); }
        if (T.ketemu >= 3) { T.fase = 1; segarkan(); T.dibuka = 0; bukaPilihan('Telinga di Dinding', [
          { k: 'sj', ikon: '📋', judul: 'Lapor jujur ke Bos', ket: 'Aman, tapi Bos tidak suka kabar buruk (Restu turun)' },
          { k: 'sb', ikon: '🎧', judul: 'Sadap balik Pak Sigap', ket: 'Pasang alat di vilanya. Cuan dan Restu naik, Citra turun' }]); }
      } else if (T.fase === 1) {
        T.sisa += dt; // sambil memilih, waktu tidak berjalan
        if (lembarTerbuka()) T.dibuka = 0; else if ((T.dibuka += dt) > 1.2) { T.dibuka = 0; bukaPilihan('Telinga di Dinding', [
          { k: 'sj', ikon: '📋', judul: 'Lapor jujur ke Bos', ket: 'Aman, tapi Bos tidak suka kabar buruk (Restu turun)' },
          { k: 'sb', ikon: '🎧', judul: 'Sadap balik Pak Sigap', ket: 'Pasang alat di vilanya. Cuan dan Restu naik, Citra turun' }]); }
      } else if (T.fase === 2) {
        const d = jarak(px, pz, sigap.x, sigap.z);
        gSigap.rotation.y = Math.atan2(px - sigap.x, pz - sigap.z);
        if (d < 14 && T.ucapSigap === 0) { T.ucapSigap = 1; ucapTeks('Pak Sigap', 'Selamat siang, Pak Menteri. Jauh-jauh ke vila saya, cuma jalan-jalan?', new THREE.Vector3(sigap.x, hv + 8, sigap.z)); }
        if (d < 7) {
          const sebelum = Math.floor(T.tahan * 2); T.tahan += dt;
          if (Math.floor(T.tahan * 2) !== sebelum) { bunyi.bip(); E.teks(pemain.position.clone().setY(pemain.position.y + 4), `Memasang ${Math.min(100, Math.round(T.tahan / 4 * 100))}%`, 'info'); }
          if (T.tahan > 2 && T.ucapSigap === 1) { T.ucapSigap = 2; ucapTeks('Pak Sigap', 'Lho, Bapak ngapain jongkok di dekat saya?', new THREE.Vector3(sigap.x, hv + 8, sigap.z)); }
          if (T.tahan >= 4) T.selesaiFlag = true;
        } else T.tahan = Math.max(0, T.tahan - dt * 1.5);
      }
    };
    T.pilih = k => {
      if (T.fase !== 1) return false;
      if (k === '1') k = 'sj'; else if (k === '2') k = 'sb';
      if (k !== 'sj' && k !== 'sb') return false;
      T.pilihan = k; $lembarTutup();
      if (k === 'sj') T.selesaiFlag = true; else { T.fase = 2; segarkan(); toast('Bawa alatnya ke vila Pak Sigap, di tepi Jl. Hutan Timur.'); }
      return true;
    };
    T.selesai = () => T.selesaiFlag;
    T.hadiah = () => {
      G.sadapSelesai = true;
      if (T.pilihan === 'sj') {
        G.restu = batas(G.restu - 8); G.cuan += 10;
        toast('Bos: "Siapa yang menyuruh Anda tahu?" Restu -8, Cuan +10.');
        banner('📰 BERITA', 'Menteri Lapor Ada Penyadapan; Bos: "Yang saya takutkan bukan disadap, tapi ketahuan."', 'berita', 8);
      } else {
        G.cuan += 150; G.restu = batas(G.restu + 12); G.citra -= 4; G.panas = batas(G.panas + 6);
        toast('Alat terpasang. Cuan +150, Restu +12, Citra -4, Panas +6.');
        banner('📰 BERITA', 'Rekaman Misterius Beredar; Eks Kepala Polisi: "Itu bukan suara saya, itu suara hati."', 'berita', 8);
        setTimeout(() => banner('📢 JUBIR', '“Tidak ada penyadapan. Yang ada hanya komunikasi dua arah yang kebetulan terekam.”', 'jubir', 8), 3500);
      }
      alat.forEach(a => { a.g.visible = false; a.ada = false; });
    };
    return T;
  }
  const $lembarTutup = () => { const l = document.getElementById('lembar'); if (l) l.hidden = true; };
  // Dipanggil bila penugasan gagal atau dibatalkan, supaya alat hilang dari dunia
  const bersih = () => alat.forEach(a => { a.g.visible = false; a.ada = false; });
  return { buat, bersih };
}
