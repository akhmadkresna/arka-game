// Jejak panah di tanah dari pemain ke tujuan misi (lewat jembatan bila tujuan di seberang sungai).
import * as THREE from '../vendor/three.module.js';
import { JEMBATAN, sungaiX } from './konfig.js';

const N = 44, JARAK = 4.5, PANJANG_MAKS = 190;
const sisi = (x, z) => (x < sungaiX(z) ? 0 : 1);

export function buatWaypath({ scene, lantai }) {
  const bentuk = new THREE.Shape();
  bentuk.moveTo(0, 1.0); bentuk.lineTo(-0.95, -0.55); bentuk.lineTo(0, -0.1); bentuk.lineTo(0.95, -0.55); bentuk.closePath();
  const geo = new THREE.ShapeGeometry(bentuk); geo.rotateX(-Math.PI / 2); // ujung panah menghadap -z lokal
  const bahan = new THREE.MeshBasicMaterial({ color: 0xffd23a, transparent: true, opacity: 0.92, depthTest: false, fog: false });
  const mesh = new THREE.InstancedMesh(geo, bahan, N);
  mesh.frustumCulled = false; mesh.renderOrder = 8; mesh.visible = false; scene.add(mesh);
  const d = new THREE.Object3D(), nol = new THREE.Matrix4().makeScale(0, 0, 0);

  function titik(px, pz, tx, tz) {
    const p = [{ x: px, z: pz }];
    if (sisi(px, pz) !== sisi(tx, tz)) {
      const s = sisi(px, pz), u = [{ x: sungaiX(JEMBATAN.z) - 22, z: JEMBATAN.z }, { x: sungaiX(JEMBATAN.z) + 22, z: JEMBATAN.z }];
      p.push(u[s], u[1 - s]);
    }
    p.push({ x: tx, z: tz });
    return p;
  }
  // Perbarui jejak; tampil=false menyembunyikan
  function atur(px, pz, tx, tz, tampil, waktu) {
    mesh.visible = tampil;
    if (!tampil) return;
    const p = titik(px, pz, tx, tz), seg = [];
    let total = 0;
    for (let i = 0; i < p.length - 1; i++) { const l = Math.hypot(p[i + 1].x - p[i].x, p[i + 1].z - p[i].z); seg.push(l); total += l; }
    const geser = (waktu * 6) % JARAK;
    let n = 0;
    for (let s = 3 + geser; s < Math.min(total - 4, PANJANG_MAKS) && n < N; s += JARAK) {
      let sisa = s, k = 0;
      while (k < seg.length - 1 && sisa > seg[k]) { sisa -= seg[k]; k++; }
      const t = seg[k] ? sisa / seg[k] : 0, x = p[k].x + (p[k + 1].x - p[k].x) * t, z = p[k].z + (p[k + 1].z - p[k].z) * t;
      const dx = p[k + 1].x - p[k].x, dz = p[k + 1].z - p[k].z;
      d.position.set(x, lantai(x, z) + 0.35, z); d.rotation.set(0, Math.atan2(dx, dz) + Math.PI, 0);
      const memudar = Math.min(1, (total - 4 - s) / 14), mulai = Math.min(1, (s - 3) / 6); // mengecil di ujung dan di dekat pemain
      d.scale.setScalar(2.1 * Math.max(0.3, Math.min(memudar, mulai + 0.4))); d.updateMatrix();
      mesh.setMatrixAt(n++, d.matrix);
    }
    for (let i = n; i < N; i++) mesh.setMatrixAt(i, nol);
    mesh.instanceMatrix.needsUpdate = true;
  }
  return { atur };
}
