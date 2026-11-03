// Pemuat model 3D (glTF/GLB) dari paket Kenney (CC0), dengan cache dan penyusun instans.
// Semua pemanggil punya cadangan prosedural: bila berkas gagal dimuat, dunia tetap jalan.
import * as THREE from '../vendor/three.module.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';

const pemuat = new GLTFLoader(), cache = new Map();
export function muatModel(nama) {
  if (!cache.has(nama)) cache.set(nama, new Promise((ok, gagal) => pemuat.load('assets/kenney/model/' + nama + '.glb', g => ok(g.scene), undefined, gagal)));
  return cache.get(nama);
}
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
