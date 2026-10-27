// Musik latar orisinal (disintesis, tanpa berkas audio): dangdut-koplo, tangga nada hijaz di A.
// Kendang, bass, gong, saron, melodi suling. Tempo dan warna bunyi mengikuti keadaan permainan.
import { konteks } from './bunyi.js';

const VOL = 0.8;
let bisuMusik = false;
try { bisuMusik = localStorage.getItem('republikEmasMusikBisu') === '1'; } catch (e) { /* abaikan */ }
export const musikBisu = () => bisuMusik;

// ---------- Bahan musik ----------
const A = 110;                                   // A2
const AKOR = [                                   // Am - Dm - E - Am, masing-masing satu birama (16 langkah)
  { akar: A, nada: [0, 3, 7] },                  // A C E
  { akar: A * 4 / 3, nada: [0, 3, 7] },          // D F A
  { akar: A * 3 / 2, nada: [0, 4, 7] },          // E G# B
  { akar: A, nada: [0, 3, 7] },
];
const SKALA = [0, 1, 4, 5, 7, 8, 10, 12, 13, 16, 17, 19]; // hijaz (semiton dari A)
const MELODI = [                                 // indeks ke SKALA, null = jeda
  [7, null, 6, null, 5, null, 4, null, 5, 6, 7, null, 6, null, 4, null],
  [5, null, 4, null, 3, null, 2, null, 3, 4, 5, null, 4, null, 2, null],
  [4, null, 3, null, 4, null, 5, null, 6, 5, 4, 3, 2, null, 1, null],
  [2, 3, 4, null, 3, null, 2, null, 1, null, 2, null, 0, null, null, null],
];
const BASS = [1, 0, 0, 1, 0, 0, 2, 0, 1, 0, 0, 1, 0, 3, 0, 2]; // 1 akar, 2 oktaf, 3 kuint
const DUNG = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
const TAK = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
const TUNG = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];

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
export function mainkanLangkah(c, out, langkah, t, durLangkah, suasana = {}) {
  const posisi = langkah % 16, birama = Math.floor(langkah / 16) % 4, putaran = Math.floor(langkah / 64), akor = AKOR[birama];
  // Kendang
  if (DUNG[posisi]) nada(c, out, 120, t, 0.2, 'sine', 0.36, 55);
  if (TAK[posisi]) { derau(c, out, t, 0.06, 0.2, 'bandpass', 1800, 2); nada(c, out, 800, t, 0.05, 'sine', 0.08, 400); }
  if (TUNG[posisi]) nada(c, out, 230, t, 0.1, 'sine', 0.16, 160);
  if (posisi % 2 === 0) derau(c, out, t, 0.03, 0.05, 'highpass', 6500);
  // Bass
  const b = BASS[posisi];
  if (b) nada(c, out, b === 1 ? akor.akar : b === 2 ? akor.akar * 2 : akor.akar * 1.5, t, durLangkah * 2.2, 'triangle', 0.24);
  // Gong di awal tiap empat birama, saron di tiap ketukan
  if (langkah % 64 === 0) { nada(c, out, 65, t, 1.8, 'sine', 0.16); nada(c, out, 65 * 2.01, t, 1.2, 'sine', 0.06); }
  if (posisi % 4 === 0) { const sar = nf(akor.akar * 2, akor.nada[(posisi / 4 + birama) % 3]); [1, 2.76].forEach((r, i) => nada(c, out, sar * r, t, 0.7 / (i + 1), 'sine', 0.05 / (i + 1))); }
  // Pad akor di awal birama
  if (posisi === 0) akor.nada.forEach(s => nada(c, out, nf(akor.akar * 2, s), t, durLangkah * 15, 'triangle', 0.028));
  // Melodi suling (oktaf naik pada putaran ganjil), bergetar halus
  const m = MELODI[birama][posisi];
  if (m !== null) nada(c, out, nf(440, SKALA[m]) * (putaran % 2 ? 2 : 1), t, durLangkah * 1.8, 'triangle', 0.085, null, 12);
  // Kabut tebal: dengung rendah yang meresahkan
  if (posisi === 0 && (suasana.kabut || 0) > 40) nada(c, out, A / 2, t, durLangkah * 16, 'sawtooth', 0.02 * Math.min(1, suasana.kabut / 100));
}
const tempo = s => 112 + (s.naik ? 16 : 0) + (s.tegang ? 8 : 0);

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
