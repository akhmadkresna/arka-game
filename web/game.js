// Republik +62: Menteri Mangkrak. Logika game (vanilla JS, tanpa build).
const BULAN_TOTAL = 12;
const KEPUTUSAN_PER_BULAN = 2;
const BATAS_SERAPAN = 80;
const PEMBAGI_BOCOR = [0.15, 0.2, 0.2, 0.3, 0.15];
const TIER = ['Pusat', 'Kementerian', 'Dirjen', 'Dinas', 'Vendor'];

const METER = [
  { k: 'restu', n: 'Restu Bos', j: 'baik' },
  { k: 'kpi', n: 'Kinerja Resmi', j: 'baik' },
  { k: 'serapan', n: 'Serapan Anggaran', j: 'baik' },
  { k: 'panas', n: 'Panas KPK', j: 'bahaya' },
  { k: 'rakyat', n: 'Amarah Rakyat', j: 'bahaya' },
  { k: 'viral', n: 'Viralitas', j: 'netral' },
  { k: 'proyek', n: 'Proyek Nyata', j: 'netral' },
];
const NAMA = { restu: 'Restu Bos', kpi: 'Kinerja', serapan: 'Serapan', panas: 'Panas KPK', rakyat: 'Amarah Rakyat',
  viral: 'Viral', proyek: 'Proyek', berkas: 'Berkas', anggaran: 'Anggaran', bocor: 'Kebocoran' };
const BURUK_JIKA_NAIK = new Set(['panas', 'rakyat', 'bocor']);

let s;
const $ = id => document.getElementById(id);
const acak = a => a[Math.floor(Math.random() * a.length)];
const acakUrut = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
const batas = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));

function baru() {
  s = { bulan: 1, sisa: KEPUTUSAN_PER_BULAN, restu: 50, panas: 10, rakyat: 20, viral: 10, kpi: 30, serapan: 0,
    proyek: 0, berkas: 1, anggaran: 150, bocor: 60, bendera: {}, tunda: [], terjadi: {}, selesai: false, log: [] };
  render();
  modal('Selamat datang, Pak Menteri',
    `<p>Misi resmi Anda: <b>serap anggaran minimal ${BATAS_SERAPAN}%</b> dan buat Bos senang selama ${BULAN_TOTAL} bulan.</p>
     <p>Setiap bulan Anda mengambil ${KEPUTUSAN_PER_BULAN} keputusan. Teks resmi di kartu tidak selalu menceritakan yang sebenarnya. Kenyataan baru terlihat setelah Anda memilih.</p>
     <p>Bertahanlah sampai akhir masa jabatan.</p>`,
    [{ t: 'Mulai bertugas', f: mulaiBulan }]);
}

// ---------- Efek ----------
function terapkan(ef, aksi) {
  const delta = {};
  let tambahan = '';
  if (aksi && aksi.cover && s.berkas <= 0) { ef = { ...ef, panas: (ef.panas || 0) + 20 }; tambahan = 'Tanpa berkas, jejakmu berserakan. Panas KPK naik tajam.'; }
  for (const k in ef) {
    const lama = s[k];
    s[k] = k === 'anggaran' ? Math.max(0, lama + ef[k]) : k === 'berkas' ? Math.max(0, lama + ef[k]) : k === 'bocor' ? batas(lama + ef[k], 10, 90) : batas(lama + ef[k]);
    if (s[k] !== lama) delta[k] = s[k] - lama;
  }
  return { delta, tambahan };
}
function chips(delta) {
  return Object.keys(delta).map(k => {
    const naik = delta[k] > 0;
    const bagus = BURUK_JIKA_NAIK.has(k) ? !naik : naik;
    return `<span class="chip ${bagus ? 'naik' : 'turun'}">${NAMA[k] || k} ${naik ? '+' : ''}${delta[k]}</span>`;
  }).join('');
}
function catat(resmi, nyata, delta) {
  s.log.unshift({ resmi, nyata, delta });
  $('log').innerHTML = s.log.slice(0, 20).map(e =>
    `<div class="entri"><div class="resmi">Resmi: ${e.resmi}</div><div class="nyata">Kenyataan: ${e.nyata}</div>${chips(e.delta)}</div>`).join('');
}

// ---------- Alur ----------
function mulaiBulan() {
  s.sisa = KEPUTUSAN_PER_BULAN;
  // Kejadian acak
  const layak = KEJADIAN.filter(e => (e.min || 0) <= s.bulan && (!e.bulan || (s.bulan >= e.bulan[0] && s.bulan <= e.bulan[1]))
    && !(e.sekali && s.terjadi[e.id]) && (!e.syarat || e.syarat(s)));
  const k = Math.random() < 0.55 && layak.length ? acak(layak) : null;
  const lanjut = () => { if (s.viral >= 60) ngeles(); else render(); };
  if (!k) return lanjut();
  s.terjadi[k.id] = true;
  let ef = k.efek, teks = k.teks;
  if (k.selamat && s.bendera[k.selamat.bendera]) { ef = k.selamat.efek; teks = k.selamat.teks; }
  if (k.selamatBerkas && s.berkas >= k.selamatBerkas) { ef = { panas: -2 }; teks = 'Berkasmu lengkap dan rapi. Auditor pulang dengan tangan kosong.'; s.berkas -= 1; }
  const { delta } = terapkan(ef);
  catat(k.judul, teks, delta);
  if (cekKalah()) return;
  modal(k.judul, `<p>${teks}</p>${chips(delta)}`, [{ t: 'Lanjut', f: lanjut }]);
}

function ngeles() {
  const q = acak(NGELES);
  render();
  modal('Konferensi pers dadakan', `<p>Viralitas terlalu tinggi. Wartawan sudah menunggu.</p><p><b>${q.tanya}</b></p>`,
    acakUrut(q.jawab).map(j => ({ t: j.t, f: () => {
      const ef = j.ok ? { viral: -25, rakyat: -3, restu: 4 } : { viral: 15, rakyat: 8, restu: -8, panas: 5 };
      const { delta } = terapkan(ef);
      catat(j.ok ? 'Klarifikasi berhasil.' : 'Jawaban blunder.', j.ok ? 'Wartawan bingung, topik berganti.' : 'Potongan videonya viral lagi.', delta);
      if (!cekKalah()) render();
    } })));
}

function pilih(a) {
  const { delta, tambahan } = terapkan(a.efek, a);
  if (a.bendera) s.bendera[a.bendera] = true;
  if (a.tunda) s.tunda.push({ bulan: s.bulan + a.tunda.bulan, restu: a.tunda.restu });
  catat(a.tip, `${a.kabar}${tambahan ? ' ' + tambahan : ''}`, delta);
  if (cekKalah()) return;
  s.sisa--;
  if (s.sisa <= 0) akhirBulan(); else render();
}

function akhirBulan() {
  const ringkas = [];
  // Efek tertunda
  s.tunda = s.tunda.filter(t => {
    if (t.bulan <= s.bulan) { s.restu = batas(s.restu + t.restu); ringkas.push(`Efek tertunda: Restu Bos ${t.restu}.`); return false; }
    return true;
  });
  // Pembangunan nyata sebanding dengan dana yang sampai ke lapangan
  const lapangan = 100 - s.bocor;
  s.proyek = batas(s.proyek + Math.round(lapangan / 100 * 4));
  s.rakyat = batas(s.rakyat + Math.round((s.bocor - 60) / 10));
  s.panas = batas(s.panas - 2);
  s.viral = batas(s.viral - 5);
  if (s.proyek >= 100 && !s.terjadi.selesai) {
    s.terjadi.selesai = true;
    s.restu = batas(s.restu - 10); s.kpi = batas(s.kpi - 10);
    ringkas.push('Proyek benar-benar selesai. Bos kecewa: tidak ada lagi yang bisa diresmikan, dan sisa anggaran memalukan.');
  }
  if (s.bulan % 4 === 0) {
    if (s.kpi < 40) { s.restu = batas(s.restu - 15); ringkas.push('Bapak Presiden berkunjung dan melihat laporan yang lemah. Restu Bos turun.'); }
    else { s.restu = batas(s.restu + 5); ringkas.push('Bapak Presiden berkunjung dan puas dengan laporan. "Bagus. Teruskan."'); }
  }
  if (cekKalah()) return;
  if (s.bulan >= BULAN_TOTAL) return akhir();
  s.bulan++;
  render();
  modal(`Akhir bulan ${s.bulan - 1}`, `<p>Dana yang sampai ke lapangan bulan ini: <b>${lapangan}%</b>.</p>${ringkas.map(r => `<p>${r}</p>`).join('')}`,
    [{ t: `Masuk bulan ${s.bulan}`, f: mulaiBulan }]);
}

// ---------- Akhir permainan ----------
function cekKalah() {
  const sebab = s.restu <= 0 ? ['Direshuffle', 'Bos kehilangan kepercayaan. Besok pagi Anda tidak lagi menjabat.']
    : s.panas >= 100 ? ['Dipanggil KPK', 'Berkas Anda dibuka. Kali ini tidak ada kambing hitam yang cukup.']
    : s.rakyat >= 100 ? ['Dicopot setelah demo besar', 'Kemarahan rakyat tidak bisa lagi diredam dengan konferensi pers.']
    : s.anggaran <= 0 && s.proyek < 100 ? ['Kas kosong, proyek mangkrak', 'Anggaran habis sebelum proyek jadi. Tradisi lama berlanjut.']
    : null;
  if (!sebab) return false;
  akhir(sebab);
  return true;
}

function akhir(kalah) {
  if (s.selesai) return;
  s.selesai = true;
  let judul, alasan;
  if (kalah) [judul, alasan] = kalah;
  else if (s.serapan < BATAS_SERAPAN) { judul = 'Dicopot: serapan rendah'; alasan = `Serapan hanya ${s.serapan}%. Sisa anggaran dianggap bukti Anda tidak bekerja.`; }
  else { judul = 'Masa jabatan selesai'; alasan = 'Anda selamat. Sistem tersenyum.'; }
  const predikat = s.kpi >= 70 ? 'SANGAT BERKINERJA' : s.kpi >= 40 ? 'Cukup' : 'Kurang';
  modal(judul, `<p>${alasan}</p>
    <div class="dua">
      <div><b>Laporan Resmi</b><br>Kinerja: ${s.kpi}/100<br>Serapan: ${s.serapan}%<br>Predikat: <b>${predikat}</b></div>
      <div><b>Kenyataan</b><br>Proyek nyata: ${s.proyek}%<br>Dana sampai lapangan: ${100 - s.bocor}%<br>Amarah rakyat: ${s.rakyat}/100</div>
    </div>
    <p>Semua tokoh fiktif. Kemiripan hanyalah kebetulan yang sangat sistemik.</p>`,
    [{ t: 'Coba lagi dengan menteri baru', f: baru }]);
}

// ---------- Tampilan ----------
function render() {
  $('bulan').textContent = `Bulan ${s.bulan} / ${BULAN_TOTAL}`;
  $('sisa').textContent = `(sisa ${s.sisa})`;
  $('meter').innerHTML = METER.map(m =>
    `<div class="m ${m.j}"><span>${m.n}</span><div class="bar"><i style="width:${s[m.k]}%"></i></div><span>${s[m.k]}</span></div>`).join('');
  $('sumber').innerHTML = `<span>Anggaran sisa: <b>${s.anggaran}</b></span><span>Berkas: <b>${s.berkas}</b></span>`;
  // Aliran anggaran
  let sisa = 100;
  let h = '';
  TIER.forEach((t, i) => {
    sisa -= s.bocor * PEMBAGI_BOCOR[i];
    h += `<div class="tier"><span>${t} → ${Math.round(sisa)}%</span><div class="bar"><i style="width:${sisa}%"></i></div></div>`;
  });
  h += `<div class="tier lapangan"><span><b>Lapangan: ${100 - s.bocor}%</b></span><div class="bar"><i style="width:${100 - s.bocor}%"></i></div></div>`;
  $('bocor').innerHTML = h;
  $('presiden').innerHTML = presiden();
  $('ucapan').textContent = `"${s.restu < 30 ? 'Saya tidak mau dengar alasan. Mana laporannya?' : s.serapan < 40 ? 'Serapan berapa persen?' : s.restu > 70 ? 'Bagus. Teruskan.' : 'Pokoknya harus jalan.'}"`;
  // Kartu keputusan
  if (s.selesai) { $('aksi').innerHTML = ''; return; }
  let pilihan = acakUrut(AKSI).slice(0, 4);
  const wajib = [];
  if (s.berkas <= 0) wajib.push('berkas');
  if (s.panas > 50) wajib.push('kambing');
  wajib.forEach(id => { if (!pilihan.some(a => a.id === id)) pilihan[pilihan.length - 1 - wajib.indexOf(id)] = AKSI.find(a => a.id === id); });
  $('aksi').innerHTML = '';
  pilihan.forEach(a => {
    const b = document.createElement('button');
    b.className = 'kartu';
    b.innerHTML = `<b>${a.judul}</b><span>${a.tip}</span>`;
    b.onclick = () => pilih(a);
    $('aksi').appendChild(b);
  });
}

function presiden() {
  const mulut = s.restu > 60 ? 'M42 74 Q60 88 78 74' : s.restu > 30 ? 'M44 78 L76 78' : 'M44 82 Q60 70 76 82';
  const alis = s.restu > 30 ? 'M36 48 L52 51 M84 48 L68 51' : 'M36 54 L52 48 M84 54 L68 48';
  return `<svg viewBox="0 0 120 150" role="img" aria-label="Bapak Presiden (karikatur fiktif)">
    <rect x="12" y="104" width="96" height="46" rx="14" fill="#2c3a2f"/>
    <circle cx="34" cy="122" r="5" fill="#e8b83c"/><circle cx="50" cy="128" r="4" fill="#d6453d"/><circle cx="68" cy="122" r="5" fill="#e8b83c"/><circle cx="84" cy="128" r="4" fill="#5aa0d6"/>
    <ellipse cx="60" cy="68" rx="38" ry="40" fill="#c98f63"/>
    <rect x="26" y="20" width="68" height="26" rx="8" fill="#111"/>
    <path d="${alis}" stroke="#2a1a10" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="46" cy="58" r="4" fill="#fff"/><circle cx="74" cy="58" r="4" fill="#fff"/><circle cx="46" cy="58" r="2" fill="#111"/><circle cx="74" cy="58" r="2" fill="#111"/>
    <path d="${mulut}" stroke="#5a2a1a" stroke-width="4" stroke-linecap="round" fill="none"/>
  </svg>`;
}

function modal(judul, html, tombol) {
  $('kotak').innerHTML = `<h3>${judul}</h3>${html}<div id="tb"></div>`;
  tombol.forEach(t => {
    const b = document.createElement('button');
    b.className = 'kartu';
    b.innerHTML = `<b>${t.t}</b>`;
    b.onclick = () => { $('modal').hidden = true; t.f(); };
    $('tb').appendChild(b);
  });
  $('modal').hidden = false;
}

baru();
