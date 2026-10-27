// Upacara peresmian: pita merah, tamu undangan bertepuk tangan, lalu gunting pita.
import * as THREE from '../vendor/three.module.js';
import { M, manusiaMini } from './objek.js';

const MERAH = new THREE.MeshLambertMaterial({ color: 0xd6252d });
const EMAS = new THREE.MeshLambertMaterial({ color: 0xe8b83c });
const JAS = [new THREE.MeshLambertMaterial({ color: 0xe9dcc0 }), new THREE.MeshLambertMaterial({ color: 0x3a4a6a }), new THREE.MeshLambertMaterial({ color: 0x6a3a3a })];
const wrap = a => ((a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

export function buatPeresmian({ scene, lantai, E, bunyi, V }) {
  const aktif = [];
  // x,z = pusat bangunan; rot = arah hadap bangunan; selesai() dipanggil saat pita digunting
  function mulai(x, z, rot, selesai) {
    const dx = Math.sin(rot), dz = Math.cos(rot), kx = Math.cos(rot), kz = -Math.sin(rot);
    const jarak = 7.8, px = x + dx * jarak, pz = z + dz * jarak, y = lantai(px, pz);
    const g = new THREE.Group(); g.position.set(px, y, pz); g.rotation.y = rot; scene.add(g);
    for (const s of [-1, 1]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.4, 8), EMAS); t.position.set(s * 4.5, 1.7, 0); g.add(t); const b = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), EMAS); b.position.set(s * 4.5, 3.5, 0); g.add(b); }
    const pitaK = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.35, 0.1), MERAH), pitaN = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.35, 0.1), MERAH);
    pitaK.position.set(-2.25, 2.6, 0); pitaN.position.set(2.25, 2.6, 0); g.add(pitaK, pitaN);
    const tamu = [];
    for (let i = 0; i < 3; i++) {
      const sisi = i === 0 ? -1 : 1, geser = i === 2 ? 7.4 : 6, baris = i === 2 ? -1.2 : 0;
      const m = manusiaMini(JAS[i % 3], M.hitam, 0.5, M.hitam); m.position.set(sisi * geser, 0, baris - 1); m.rotation.y = Math.PI; g.add(m); tamu.push(m);
    }
    aktif.push({ g, pitaK, pitaN, tamu, t: 0, gunting: false, x: px, z: pz, y, selesai, fase: Math.random() * 6 });
  }
  function update(dt) {
    for (let i = aktif.length - 1; i >= 0; i--) {
      const a = aktif[i]; a.t += dt;
      for (const [k, m] of a.tamu.entries()) { const u = m.userData, s = Math.sin(a.t * 12 + k * 2) * 0.35; u.lenganK.rotation.x = -1.4 + s; u.lenganN.rotation.x = -1.4 - s; }
      if (!a.gunting && a.t > 2.2) {
        a.gunting = true; a.selesai && a.selesai();
        E.teks(new THREE.Vector3(a.x, a.y + 5, a.z), 'CRET! DIRESMIKAN!', 'besar emas'); E.semburan(new THREE.Vector3(a.x, a.y + 4, a.z), 'konfeti', 50); bunyi.misi();
      }
      if (a.gunting) { const w = a.t - 2.2; a.pitaK.rotation.z = -Math.min(1.4, w * 3); a.pitaN.rotation.z = Math.min(1.4, w * 3); a.pitaK.position.y = Math.max(0.3, 2.6 - w * 3); a.pitaN.position.y = Math.max(0.3, 2.6 - w * 3); }
      if (a.t > 9) { scene.remove(a.g); aktif.splice(i, 1); }
    }
  }
  return { mulai, update };
}
