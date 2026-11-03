// Jalan beraspal dari City Kit (Roads) Kenney di atas jalur JALAN, lengkap dengan tiang lampu di tepinya.
import * as THREE from '../vendor/three.module.js';
import { JALAN } from './konfig.js';
import { buatInstansModel } from './model.js';

const LEBAR = 8;                                   // lebar dan panjang tiap ubin (m)
const lerp = (a, b, t) => a + (b - a) * t;

export async function pasangJalan(scene, lantai) {
  try {
    const [lurus, lampu, simpang] = await Promise.all([buatInstansModel('roads/road-straight', 600), buatInstansModel('roads/light-curved', 160), buatInstansModel('roads/road-crossroad', 40)]);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), naik = new THREE.Vector3(0, 1, 0);
    const putarX = new THREE.Quaternion().setFromAxisAngle(naik, -Math.PI / 2); // lajur ubin sejajar sumbu x; jadikan sejajar +z
    let jarakLampu = 0;
    for (const jl of JALAN) {
      for (let i = 0; i < jl.length - 1; i++) {
        const [ax, az] = jl[i], [bx, bz] = jl[i + 1], pjg = Math.hypot(bx - ax, bz - az), dx = (bx - ax) / pjg, dz = (bz - az) / pjg;
        const n = Math.max(1, Math.round(pjg / LEBAR));
        for (let k = 0; k < n; k++) {
          const t = (k + 0.5) / n, cx = lerp(ax, bx, t), cz = lerp(az, bz, t), h0 = lantai(cx - dx * LEBAR / 2, cz - dz * LEBAR / 2), h1 = lantai(cx + dx * LEBAR / 2, cz + dz * LEBAR / 2);
          const sisiX = -dz, sisiZ = dx; // tegak lurus arah jalan
          const hSisi = Math.max(lantai(cx + sisiX * LEBAR / 2, cz + sisiZ * LEBAR / 2), lantai(cx - sisiX * LEBAR / 2, cz - sisiZ * LEBAR / 2));
          const y = Math.max((h0 + h1) / 2, hSisi * 0.5 + (h0 + h1) / 4) + 0.1;
          const arah = new THREE.Vector3(dx, (h1 - h0) / LEBAR, dz).normalize();
          const o = new THREE.Object3D(); o.position.set(cx, y, cz); o.lookAt(cx + arah.x, y + arah.y, cz + arah.z); o.quaternion.multiply(putarX);
          m.compose(o.position, o.quaternion, s.set(pjg / n, LEBAR, LEBAR)); // sumbu x ubin = arah lajur
          lurus.tambahM(m);
        }
        // tiang lampu bergantian di kiri dan kanan jalan
        for (let d = jarakLampu; d < pjg; d += 36) {
          const t = d / pjg, cx = lerp(ax, bx, t), cz = lerp(az, bz, t), sisi = (Math.floor(d / 36) % 2 ? 1 : -1), px = cx - dz * sisi * (LEBAR / 2 + 1), pz = cz + dx * sisi * (LEBAR / 2 + 1), y = lantai(px, pz);
          if (y < 0.8) continue;
          q.setFromAxisAngle(naik, Math.atan2(dx * sisi, dz * sisi) + Math.PI / 2);
          m.compose(p.set(px, y, pz), q, s.set(11, 11, 11)); lampu.tambahM(m);
        }
        jarakLampu = ((jarakLampu - pjg) % 36 + 36) % 36;
      }
    }
    // Bantalan persimpangan hanya di titik temu jalan (tiga arah atau lebih); sudut siku diberi bantalan agar rapi
    const simpul = new Map();
    for (const jl of JALAN) jl.forEach(([x, z], i) => {
      const k = x + ',' + z, n = simpul.get(k) || { x, z, arah: new Set() };
      if (i > 0) n.arah.add(Math.sign(jl[i - 1][0] - x) + ':' + Math.sign(jl[i - 1][1] - z));
      if (i < jl.length - 1) n.arah.add(Math.sign(jl[i + 1][0] - x) + ':' + Math.sign(jl[i + 1][1] - z));
      simpul.set(k, n);
    });
    for (const { x, z, arah } of simpul.values()) {
      const lurusSaja = arah.size === 2 && (arah.has('1:0') && arah.has('-1:0') || arah.has('0:1') && arah.has('0:-1'));
      if (arah.size < 2 || lurusSaja) continue;
      m.compose(p.set(x, lantai(x, z) + 0.14, z), q.identity(), s.set(LEBAR * 1.12, LEBAR, LEBAR * 1.12)); simpang.tambahM(m);
    }
    simpang.pasangKe(scene); simpang.sinkron();
    lurus.pasangKe(scene); lampu.pasangKe(scene); lurus.sinkron(); lampu.sinkron();
  } catch (e) { console.warn('Jalan 3D gagal:', e && e.message); }
}
