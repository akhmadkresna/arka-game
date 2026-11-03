// Pemuat model 3D (glTF/GLB) dari paket Kenney (CC0), dengan cache dan penyusun instans.
// Semua pemanggil punya cadangan prosedural: bila berkas gagal dimuat, dunia tetap jalan.
import * as THREE from '../vendor/three.module.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';

const pemuat = new GLTFLoader(), cache = new Map();
export function muatGLTF(nama) {
  if (!cache.has(nama)) cache.set(nama, new Promise((ok, gagal) => pemuat.load('assets/kenney/model/' + nama + '.glb', ok, undefined, gagal)));
  return cache.get(nama);
}
export const muatModel = nama => muatGLTF(nama).then(g => g.scene);
// Salinan tunggal (untuk kendaraan dan objek unik)
export const klonModel = async nama => (await muatModel(nama)).clone(true);

const NOL = new THREE.Matrix4().makeScale(0, 0, 0);
// Instans banyak salinan sebuah model: satu InstancedMesh per bagian model, dengan API yang sama seperti Inst di objek.js
export class InstansModel {
  constructor(sumber, maks) {
    this.bagian = []; this.n = 0; this.kap = maks; this.mats = []; this.kotor = false;
    sumber.updateMatrixWorld(true);
    sumber.traverse(o => {
      if (!o.isMesh) return;
      const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld);
      const im = new THREE.InstancedMesh(g, o.material, maks); im.frustumCulled = false;
      for (let i = 0; i < maks; i++) im.setMatrixAt(i, NOL);
      this.bagian.push(im);
    });
    this.meshes = this.bagian;
  }
  tambah(x, y, z, sx = 1, sy = sx, sz = sx, ry = 0, tampil = true) {
    if (this.n >= this.kap) return -1;
    const i = this.n++, m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ry), new THREE.Vector3(sx, sy, sz));
    this.mats[i] = m;
    for (const b of this.bagian) b.setMatrixAt(i, tampil ? m : NOL);
    this.kotor = true; return i;
  }
  tampil(i, ya) { for (const b of this.bagian) b.setMatrixAt(i, ya ? this.mats[i] : NOL); this.kotor = true; }
  sinkron() { if (this.kotor) { for (const b of this.bagian) b.instanceMatrix.needsUpdate = true; this.kotor = false; } }
  pasangKe(induk) { for (const b of this.bagian) induk.add(b); }
}
export async function buatInstansModel(nama, maks) { return new InstansModel(await muatModel(nama), maks); }
// Ukuran kotak pembatas (untuk menentukan skala)
export async function ukuranModel(nama) { const s = await muatModel(nama); s.updateMatrixWorld(true); return new THREE.Box3().setFromObject(s).getSize(new THREE.Vector3()); }

// ---------- Sosok beranimasi (Kenney Blocky Characters: klip idle, walk, sprint, emote-yes, dan lain-lain) ----------
const sosokAktif = new Set();
const tersambung = o => { while (o.parent) o = o.parent; return !!o.isScene; };
export async function buatSosok(nama, skala = 1) {
  const gltf = await muatGLTF(nama), akar = gltf.scene.clone(true), g = new THREE.Group();
  akar.scale.setScalar(skala); g.add(akar);
  const mixer = new THREE.AnimationMixer(akar), aksi = {};
  for (const k of gltf.animations) aksi[k.name] = mixer.clipAction(k);
  const s = {
    g, mixer, aksi, sekarang: null,
    mainkan(klip, laju = 1) {
      const a = aksi[klip]; if (!a) return;
      if (s.sekarang === klip) { a.timeScale = laju; return; }
      const lama = aksi[s.sekarang]; a.reset().fadeIn(0.15).play(); a.timeScale = laju; if (lama) lama.fadeOut(0.15); s.sekarang = klip;
    },
  };
  mixer.setTime(Math.random() * 1.5); // supaya sosok kembar tidak serempak
  sosokAktif.add(s); return s;
}
let wBersih = 0;
export function perbaruiSosok(dt) {
  for (const s of sosokAktif) s.mixer.update(dt);
  if ((wBersih -= dt) <= 0) { wBersih = 3; for (const s of sosokAktif) if (!tersambung(s.g)) { s.mixer.stopAllAction(); sosokAktif.delete(s); } }
}
export function lepasSosok(s) { if (s) { s.mixer.stopAllAction(); sosokAktif.delete(s); } }
// Sembunyikan isi prosedural sebuah grup (kecuali yang disimpan) dan pasang sosok Kenney; null bila gagal dimuat
export async function gantiDenganSosok(g, nama, skala, simpan = [], klip = 'idle') {
  try {
    const s = await buatSosok(nama, skala);
    g.children.forEach(c => { if (!c.isSprite && !simpan.includes(c)) c.visible = false; });
    g.add(s.g); s.mainkan(klip); g.userData.sosok = s; return s;
  } catch (e) { return null; }
}
