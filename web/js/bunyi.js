// Efek suara sintetis (WebAudio), tanpa berkas audio. Aktif setelah pemain menekan tombol pertama.
let ctx = null, bisu = false, bufDerau = null, terakhirKoin = 0;
try { bisu = localStorage.getItem('republikEmasBisu') === '1'; } catch (e) { /* abaikan */ }

export const bisuSekarang = () => bisu;
export const konteks = () => ctx;
export function setBisu(v) { bisu = v; try { localStorage.setItem('republikEmasBisu', v ? '1' : '0'); } catch (e) { /* abaikan */ } }
export function aktifkan() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const n = Math.floor(ctx.sampleRate * 0.6);
      bufDerau = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = bufDerau.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
  } catch (e) { /* abaikan */ }
}
function nada(f, dur, tipe = 'sine', vol = 0.1, f2 = null, tunda = 0) {
  if (!ctx || bisu) return;
  const t = ctx.currentTime + tunda, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = tipe; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.03);
}
function derau(dur, vol = 0.15, lp = 2000, tunda = 0, hp = 0) {
  if (!ctx || bisu || !bufDerau) return;
  const t = ctx.currentTime + tunda, s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  s.buffer = bufDerau; f.type = hp ? 'highpass' : 'lowpass'; f.frequency.value = hp || lp;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t); s.stop(t + dur + 0.03);
}
// Mesin kendaraan: satu osilator yang frekuensi dan volumenya mengikuti laju
let mOsc = null, mGain = null;
export function mesin(aktif, laju = 0) {
  if (!ctx) return;
  if (!aktif || bisu) { if (mOsc) { try { mOsc.stop(); } catch (e) { /* abaikan */ } mOsc = null; mGain = null; } return; }
  if (!mOsc) {
    mOsc = ctx.createOscillator(); mGain = ctx.createGain(); mOsc.type = 'sawtooth'; mGain.gain.value = 0;
    mOsc.connect(mGain); mGain.connect(ctx.destination); mOsc.start();
  }
  const t = ctx.currentTime;
  mOsc.frequency.setTargetAtTime(45 + laju * 110, t, 0.08);
  mGain.gain.setTargetAtTime(0.018 + laju * 0.03, t, 0.08);
}
export const bunyi = {
  koin() { const n = performance.now(); if (n - terakhirKoin < 55) return; terakhirKoin = n; const f = 1100 + Math.random() * 500; nada(f, 0.09, 'square', 0.045); nada(f * 1.5, 0.15, 'square', 0.045, null, 0.06); },
  uangKeluar() { nada(720, 0.16, 'triangle', 0.08, 300); },
  gagal() { nada(170, 0.4, 'sawtooth', 0.1, 70); },
  batuk() { [0, 0.16, 0.34].forEach(t => { derau(0.08, 0.2, 900, t, 300); nada(180, 0.08, 'sawtooth', 0.05, 120, t); }); },
  api() { derau(0.55, 0.2, 1400); nada(120, 0.45, 'sawtooth', 0.04, 60); },
  kayu() { derau(0.12, 0.28, 800); nada(190, 0.1, 'triangle', 0.1, 90); },
  tanam() { nada(380, 0.12, 'sine', 0.12, 760); nada(760, 0.1, 'sine', 0.08, null, 0.08); },
  bangun() { nada(110, 0.32, 'sine', 0.22, 50); derau(0.25, 0.18, 500); [523, 659, 784].forEach((f, i) => nada(f, 0.14, 'square', 0.05, null, 0.18 + i * 0.08)); },
  blokir() { nada(220, 0.12, 'square', 0.1); nada(165, 0.25, 'square', 0.1, null, 0.13); },
  selfie() { derau(0.07, 0.3, 0, 0, 1800); nada(2000, 0.05, 'square', 0.04, null, 0.06); },
  klakson() { nada(380, 0.3, 'sawtooth', 0.1); nada(480, 0.3, 'sawtooth', 0.08); nada(380, 0.25, 'sawtooth', 0.1, null, 0.38); nada(480, 0.25, 'sawtooth', 0.08, null, 0.38); },
  misi() { [523, 659, 784, 1047].forEach((f, i) => nada(f, 0.2, 'triangle', 0.1, null, i * 0.09)); },
  setoran() { [900, 760, 620, 480].forEach((f, i) => nada(f, 0.12, 'square', 0.05, null, i * 0.07)); },
  denda() { nada(150, 0.5, 'sawtooth', 0.12, 55); derau(0.3, 0.15, 600); },
  klik() { nada(620, 0.05, 'square', 0.05); },
  lompat() { nada(260, 0.16, 'sine', 0.1, 520); },
  mendarat() { derau(0.1, 0.18, 600); nada(120, 0.1, 'sine', 0.1, 70); },
  tabrak() { derau(0.25, 0.3, 500); nada(90, 0.25, 'sawtooth', 0.12, 40); },
  simpan() { nada(660, 0.08, 'triangle', 0.07); nada(880, 0.1, 'triangle', 0.07, null, 0.08); },
  sirene() { nada(650, 0.45, 'sawtooth', 0.045, 920); nada(920, 0.45, 'sawtooth', 0.045, 650, 0.45); },
  pop() { nada(300, 0.1, 'sine', 0.1, 900); },
};
