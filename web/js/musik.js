// Musik latar orisinal (disintesis, tanpa berkas audio): mars fanfare megah dalam C mayor, dengan sengaja terlalu bersemangat.
// Genderang, snare, timpani, tuba, kuningan, dan terompet. Tempo dan warna bunyi mengikuti keadaan permainan.
import { konteks } from './bunyi.js';

const VOL = 0.9;
let bisuMusik = false;
try { bisuMusik = localStorage.getItem('republikEmasMusikBisu') === '1'; } catch (e) { /* abaikan */ }
export const musikBisu = () => bisuMusik;

// ---------- Bahan musik: mars fanfare orisinal dalam C mayor (8 birama, 16 langkah per birama) ----------
const C4 = 261.63;
const AKOR = [                                   // C - F - C - G - C - F - G - C
  { akar: 0, nada: [0, 4, 7] }, { akar: 5, nada: [0, 4, 7] }, { akar: 0, nada: [0, 4, 7] }, { akar: 7, nada: [0, 4, 7] },
  { akar: 0, nada: [0, 4, 7] }, { akar: 5, nada: [0, 4, 7] }, { akar: 7, nada: [0, 4, 7] }, { akar: 0, nada: [0, 4, 7] },
];
const N = null;
const MELODI = [                                 // semiton dari C4, null = jeda; titik-titik fanfare terompet
  [7, N, N, 7, 12, N, N, 12, 16, N, N, N, 12, N, 16, N],
  [9, N, N, 9, 12, N, N, 12, 17, N, N, N, 12, N, 17, N],
  [16, N, 14, N, 12, N, 14, N, 16, N, 19, N, 16, N, 12, N],
  [14, N, N, 14, 11, N, N, 11, 14, N, 19, N, 19, N, N, N],
  [7, N, N, 7, 12, N, N, 12, 16, N, N, 16, 19, N, N, N],
  [17, N, 16, N, 17, N, 19, N, 21, N, N, N, 17, N, N, N],
  [19, N, 17, N, 16, N, 14, N, 14, N, 16, N, 14, N, 11, N],
  [12, N, N, N, 16, N, N, N, 19, N, N, N, 24, N, N, N],
];
const GENDANG = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];             // bas drum di ketukan 1 dan 3
const SNARE = [0, 0, 1, 0, 2, 0, 1, 0, 0, 0, 1, 0, 2, 0, 1, 0];                // 2 = aksen

const nf = (f0, semiton) => f0 * Math.pow(2, semiton / 12);
const cacheDerau = new WeakMap();
function derauBuf(c) {
  if (!cacheDerau.has(c)) {
    const n = Math.floor(c.sampleRate * 0.5), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    cacheDerau.set(c, b);
  }
  return cacheDerau.get(c);
}
function nada(c, out, f, t, dur, tipe, vol, f2 = null, vib = 0) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = tipe; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  if (vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.5; lg.gain.value = vib; l.connect(lg); lg.connect(o.detune); l.start(t); l.stop(t + dur + 0.05); }
  o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05);
}
function derau(c, out, t, dur, vol, tipeFilter, frek, q = 1) {
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = derauBuf(c); f.type = tipeFilter; f.frequency.value = frek; f.Q.value = q;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + dur + 0.02);
}

// Menjadwalkan satu langkah (1/16 birama). Dipakai oleh pemutar langsung dan oleh uji luring.
const SEMI = [0, 4, 7];
function nadaKuningan(c, out, f, t, dur, vol, vib = 0) {
  nada(c, out, f, t, dur, 'sawtooth', vol, null, vib); nada(c, out, f * 1.003, t, dur, 'square', vol * 0.45, null, vib);
}
export function mainkanLangkah(c, out, langkah, t, durLangkah, suasana = {}) {
  const posisi = langkah % 16, birama = Math.floor(langkah / 16) % 8, putaran = Math.floor(langkah / 128), akor = AKOR[birama];
  const akhirFrasa = birama === 3 || birama === 7, tegang = !!suasana.tegang;
  // Genderang: bas drum di ketukan 1 dan 3, ketukan awal tambahan di akhir frasa
  if (GENDANG[posisi] || (akhirFrasa && posisi === 14)) nada(c, out, 110, t, 0.22, 'sine', 0.42, 48);
  // Snare baris-berbaris, dan gulungan di akhir frasa
  const sn = SNARE[posisi] || (akhirFrasa && posisi >= 12 ? 1 : 0) || (tegang && posisi % 2 === 1 ? 1 : 0);
  if (sn) { derau(c, out, t, 0.09, sn === 2 ? 0.26 : 0.15, 'bandpass', 2400, 0.8); nada(c, out, 190, t, 0.05, 'triangle', sn === 2 ? 0.1 : 0.05, 150); }
  // Timpani pada akar akor di awal birama
  if (posisi === 0) nada(c, out, nf(C4 / 4, akor.akar), t, 0.7, 'sine', 0.3, nf(C4 / 4, akor.akar) * 0.92);
  // Tuba: oom di ketukan 1 (akar) dan 3 (kuint)
  if (posisi === 0 || posisi === 8) nada(c, out, nf(C4 / 2, akor.akar + (posisi === 8 ? 7 : 0)), t, durLangkah * 3.2, 'triangle', 0.28);
  // Kuningan: pah di ketukan 2 dan 4
  if (posisi === 4 || posisi === 12) akor.nada.forEach(s => nadaKuningan(c, out, nf(C4, akor.akar + s), t, durLangkah * 2.4, 0.03));
  // Simbal pada awal tiap delapan birama dan di pengakhiran frasa
  if (langkah % 128 === 0 || (birama === 7 && posisi === 12)) derau(c, out, t, 1.1, 0.14, 'highpass', 5500);
  // Terompet: melodi fanfare dengan harmoni nada akor di bawahnya, oktaf naik pada putaran ganjil
  const mel = MELODI[birama][posisi];
  if (mel !== null) {
    let tahan = 1; while (tahan < 4 && MELODI[birama][posisi + tahan] === N && posisi + tahan < 16) tahan++;
    const dur = durLangkah * (tahan * 0.92 + 0.3), oktaf = putaran % 2 ? 12 : 0;
    nadaKuningan(c, out, nf(C4 * 2, mel - 12 + oktaf), t, dur, 0.06, 6);
    let har = mel - 3; while (!SEMI.includes((((har - akor.akar) % 12) + 12) % 12)) har--; // nada akor terdekat di bawah
    nadaKuningan(c, out, nf(C4 * 2, har - 12 + oktaf), t, dur, 0.035, 6);
    if (putaran % 2) nada(c, out, nf(C4 * 4, mel - 12), t, dur * 0.8, 'sine', 0.03); // gemerincing di putaran ganjil
  }
  // Kabut tebal: dengung rendah yang meresahkan
  if (posisi === 0 && (suasana.kabut || 0) > 40) nada(c, out, C4 / 4, t, durLangkah * 16, 'sawtooth', 0.02 * Math.min(1, suasana.kabut / 100));
}
const tempo = s => 116 + (s.naik ? 14 : 0) + (s.tegang ? 8 : 0);

// ---------- Pemutar langsung ----------
let aktif = false, master = null, filter = null, timer = null, langkah = 0, tNext = 0, suasana = {}, audioLuar = null;
export function suasanaMusik(s) { suasana = s; }
export const infoMusik = () => ({ aktif, langkah, luar: !!audioLuar });
export function setMusikBisu(v) {
  bisuMusik = v;
  try { localStorage.setItem('republikEmasMusikBisu', v ? '1' : '0'); } catch (e) { /* abaikan */ }
  const c = konteks();
  if (master && c) master.gain.setTargetAtTime(v ? 0 : VOL, c.currentTime, 0.1);
  if (audioLuar) audioLuar.muted = v;
}
async function berkasLuar() {
  try {
    const r = await fetch('audio/bgm.json'); if (!r.ok) return null;
    const j = await r.json(); return j && j.berkas ? j : null;
  } catch (e) { return null; }
}
export async function mulaiMusik() {
  const c = konteks();
  if (aktif || !c) return;
  aktif = true;
  const luar = await berkasLuar();
  if (luar) { // berkas musik milik pemain
    audioLuar = new Audio('audio/' + luar.berkas); audioLuar.loop = true; audioLuar.volume = Math.max(0, Math.min(1, luar.volume ?? 0.5)); audioLuar.muted = bisuMusik;
    audioLuar.play().catch(() => { audioLuar = null; mulaiSintesis(c); });
    if (audioLuar) return;
  }
  mulaiSintesis(c);
}
function mulaiSintesis(c) {
  master = c.createGain(); master.gain.value = bisuMusik ? 0 : VOL;
  filter = c.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 7000;
  filter.connect(master); master.connect(c.destination);
  tNext = c.currentTime + 0.15; langkah = 0;
  timer = setInterval(() => {
    if (c.state !== 'running') return;
    filter.frequency.setTargetAtTime((suasana.kabut || 0) > 50 ? 1300 : 7000, c.currentTime, 0.6);
    while (tNext < c.currentTime + 0.2) {
      const dur = 60 / tempo(suasana) / 4;
      mainkanLangkah(c, filter, langkah, tNext, dur, suasana);
      tNext += dur; langkah++;
    }
  }, 30);
  document.addEventListener('visibilitychange', () => { if (document.hidden) c.suspend(); else c.resume(); });
}

// ---------- Uji luring: merender musik ke penyangga untuk memeriksa tidak sunyi dan tidak pecah ----------
export async function ujiMusik(detik = 16, s = {}) {
  const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const c = new OC(1, 44100 * detik, 44100), out = c.createGain(); out.gain.value = VOL; out.connect(c.destination);
  const dur = 60 / tempo(s) / 4;
  for (let i = 0, t = 0; t < detik; i++, t += dur) mainkanLangkah(c, out, i, t, dur, s);
  const buf = await c.startRendering(), d = buf.getChannelData(0);
  let puncak = 0, jumlah = 0, sunyi = 0, nan = 0;
  for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a !== a) nan++; if (a > puncak) puncak = a; jumlah += d[i] * d[i]; if (a < 0.002) sunyi++; }
  return { puncak: +puncak.toFixed(3), rms: +Math.sqrt(jumlah / d.length).toFixed(4), bagianSunyi: +(sunyi / d.length).toFixed(3), nan };
}
