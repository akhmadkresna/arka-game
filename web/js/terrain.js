import * as THREE from '../vendor/three.module.js';
import { fbm, smooth, lerp } from './noise.js';
import { R, SUNGAI, sungaiX, ZONA, pusatZona, KOLOM, BARIS, JARAK, DESA, SAWAH, TPA, KANTOR, TPU, ZONA_EMAS, JEMBATAN, jarakJalan } from './konfig.js';

// Area yang diratakan: persegi (rx, rz) dengan tinggi sasaran h. rata = tanpa riak.
const DATAR = [
  ...ZONA.map(z => { const c = pusatZona(z); return { x: c.x, z: c.z, rx: 76, rz: 62, h: 3.4 }; }),
  ...DESA.map(d => ({ x: d.x, z: d.z, rx: 44, rz: 44, h: 2.6, rata: true })),
  ...SAWAH.map(s => ({ x: s.x, z: s.z, rx: s.w / 2 + 2, rz: s.d / 2 + 2, h: 2.4, rata: true })),
  { x: TPA.x, z: TPA.z, rx: 32, rz: 32, h: 2.2, rata: true },
  { x: KANTOR.x, z: 45, rx: 34, rz: 42, h: 2.8, rata: true },
  { x: TPU.x, z: TPU.z, rx: 28, rz: 24, h: 3.6, rata: true },
  { x: ZONA_EMAS.x, z: ZONA_EMAS.z, rx: 18, rz: 18, h: 3.6, rata: true },
  { x: sungaiX(JEMBATAN.z), z: JEMBATAN.z, rx: 46, rz: 10, h: JEMBATAN.tinggi - 0.4 },
];

export function tinggi(x, z) {
  const r = Math.hypot(x, z);
  let h = 1.6 + fbm(x * 0.007 + 11, z * 0.007 + 5) * 16 + (fbm(x * 0.05, z * 0.05, 2) - 0.5) * 1.4;
  for (const d of DATAR) {
    const w = smooth(1.45, 1.0, Math.max(Math.abs(x - d.x) / d.rx, Math.abs(z - d.z) / d.rz));
    if (w > 0) h = lerp(h, d.rata ? d.h : d.h + (fbm(x * 0.08, z * 0.08, 2) - 0.5) * 0.8, w);
  }
  const dx = Math.abs(x - sungaiX(z));
  if (dx < SUNGAI.lebar + 10) h = lerp(h, -1.7, smooth(SUNGAI.lebar + 10, SUNGAI.lebar - 4, dx));
  return lerp(-3, h, smooth(R, R - 75, r));
}

// Tinggi pijakan: termasuk dek jembatan
export function lantai(x, z) {
  const h = tinggi(x, z), cx = sungaiX(JEMBATAN.z);
  if (Math.abs(x - cx) < JEMBATAN.panjang / 2 && Math.abs(z - JEMBATAN.z) < JEMBATAN.lebar / 2) return Math.max(h, JEMBATAN.tinggi);
  return h;
}

const PASIR = [0.9, 0.83, 0.6], RUMPUT = [0.36, 0.6, 0.27], RUMPUT2 = [0.27, 0.5, 0.22], BATU = [0.5, 0.48, 0.44], TANAH = [0.55, 0.42, 0.27], LUMPUR = [0.4, 0.34, 0.24];
const camp = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
function warna(x, z, h) {
  const n = fbm(x * 0.03 + 50, z * 0.03, 3);
  let c = camp(RUMPUT, RUMPUT2, n);
  if (h < 1.7) c = camp(PASIR, c, smooth(0.6, 1.7, h));
  if (h < 0.6) c = camp(LUMPUR, PASIR, smooth(-1.5, 0.6, h));
  if (h > 10) c = camp(c, BATU, smooth(10, 15, h));
  for (const zn of ZONA) {
    const p = pusatZona(zn), w = smooth(1.3, 1.0, Math.max(Math.abs(x - p.x) / 76, Math.abs(z - p.z) / 62));
    if (w > 0) c = camp(c, [c[0] * 0.72, c[1] * 0.78, c[2] * 0.72], w);
  }
  const dj = jarakJalan(x, z);
  if (dj < 4.5) c = camp(c, TANAH, smooth(4.5, 2.2, dj));
  return c;
}

export function buatTerrain(scene) {
  const S = 2 * (R + 25), N = 170, step = S / N, V = (N + 1) * (N + 1);
  const pos = new Float32Array(V * 3), col = new Float32Array(V * 3);
  for (let iz = 0; iz <= N; iz++) for (let ix = 0; ix <= N; ix++) {
    const x = -S / 2 + ix * step, z = -S / 2 + iz * step, h = tinggi(x, z), i = (iz * (N + 1) + ix) * 3;
    pos[i] = x; pos[i + 1] = h; pos[i + 2] = z;
    const c = warna(x, z, h); col[i] = c[0]; col[i + 1] = c[1]; col[i + 2] = c[2];
  }
  const idx = [];
  for (let iz = 0; iz < N; iz++) for (let ix = 0; ix < N; ix++) {
    const a = iz * (N + 1) + ix, b = a + 1, c = a + N + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true }));
  scene.add(mesh);
  const asli = col.slice();
  const atrib = g.getAttribute('color');

  // Warnai persegi tanah (untuk petak yang terbakar, dibuka, atau ditanami)
  function indeksPersegi(cx, cz, setengah) {
    const out = [];
    const x0 = Math.floor((cx - setengah + S / 2) / step), x1 = Math.ceil((cx + setengah + S / 2) / step);
    const z0 = Math.floor((cz - setengah + S / 2) / step), z1 = Math.ceil((cz + setengah + S / 2) / step);
    for (let iz = z0; iz <= z1; iz++) for (let ix = x0; ix <= x1; ix++) {
      const x = -S / 2 + ix * step, z = -S / 2 + iz * step;
      const w = smooth(setengah + step, setengah - step, Math.max(Math.abs(x - cx), Math.abs(z - cz)));
      if (w > 0) out.push([(iz * (N + 1) + ix) * 3, w]);
    }
    return out;
  }
  function warnai(daftar, rgb) {
    for (const [i, w] of daftar) for (let k = 0; k < 3; k++) col[i + k] = lerp(asli[i + k], rgb ? rgb[k] : asli[i + k], rgb ? w : 0);
    atrib.needsUpdate = true;
  }
  return { mesh, indeksPersegi, warnai };
}
