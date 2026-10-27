// Lapisan satir: berita yang menanggapi keadaan, prestasi, dan pangkat kehormatan.
// Sasaran satir selalu pejabat dan pembiaran, bukan warga biasa.
export const PANGKAT = [
  [0, 'Menteri Magang (Merasa Senior)'],
  [10, 'Menteri Pencitraan Muda'],
  [30, 'Menteri Berjasa Madya'],
  [60, 'Menteri Teladan Utama'],
  [100, 'Menteri Paling Berjasa Sepanjang Masa'],
  [200, 'Bapak Pembangunan Abadi (Gelar Dibuat Sendiri)'],
];
export const pangkatDari = (citra) => PANGKAT.reduce((a, p, i) => (citra >= p[0] ? i : a), 0);

export const PRESTASI = [
  { id: 'pajak', nama: 'Pajak Perdana', ket: 'Palak pertama. Selamat datang di sistem.', ok: g => g.stat.palak >= 1 },
  { id: 'pungli', nama: 'Raja Pungli', ket: '15 kali memalak. Disebut "gotong royong".', ok: g => g.stat.palak >= 15 },
  { id: 'bakar', nama: 'Juru Pijar Hutan', ket: 'Membakar hutan. Dengan semangat.', ok: g => g.stat.bakar >= 1 },
  { id: 'sawit', nama: 'Tuan Tanah Sawit', ket: '5 petak sawit. Hutan: "pernah ada".', ok: g => g.stat.tanam >= 5 },
  { id: 'pita', nama: 'Gunting Pita Profesional', ket: 'Meresmikan 3 bangunan. Pemakaiannya urusan nanti.', ok: g => g.stat.bangun >= 3 },
  { id: 'blokir', nama: 'Ditolak Dengan Hormat', ket: 'Izin dapur diblokir. Sudah diduga.', ok: g => g.stat.blokir >= 1 },
  { id: 'dinas', nama: 'Pengendara Dinas', ket: 'Naik kendaraan dinas. Bensin: rakyat.', ok: g => g.stat.naik >= 1 },
  { id: 'lompat', nama: 'Pelompat Jabatan', ket: '20 lompatan. Naik jabatan, bukan prestasi.', ok: g => g.stat.lompat >= 20 },
  { id: 'kas', nama: 'Bendahara Setia', ket: 'Kas Kopdes masuk kantong 3 kali.', ok: g => (g.kasRaib || 0) >= 3 },
  { id: 'kabut', nama: 'Kabut Premium', ket: 'Kabut asap di atas 60. Pemandangan jadi misterius.', ok: g => g.kabut >= 60 },
  { id: 'juta', nama: 'Seribu Pertama', ket: 'Memegang 1.000 Cuan. Asal-usul: rahasia.', ok: g => g.cuan >= 1000 },
  { id: 'selfie', nama: 'Wajah Rakyat', ket: '5 kali berswafoto. Rakyat di latar belakang.', ok: g => g.selfie >= 5 },
  { id: 'panas', nama: 'Panas Tapi Santai', ket: 'Panas KPK di atas 70, masih tersenyum.', ok: g => g.panas >= 70 },
  { id: 'tahun', nama: 'Bertahan Setahun', ket: 'Melewati satu tahun jabatan tanpa dipecat.', ok: g => g.bulan > 12 },
];

const UMUM = [
  'Menteri: "Kita tidak kekurangan anggaran. Kita kekurangan pemahaman tentang ke mana anggarannya pergi."',
  'Rapat koordinasi selesai. Hasil rapat: rapat koordinasi berikutnya.',
  'Pemerintah resmikan gedung baru. Penghuninya masih dicari.',
  'Studi banding ke luar negeri berhasil. Studinya belum ketemu, bandingnya sudah.',
  'Baliho Menteri bertambah. Tingginya sudah melampaui target kinerja.',
  'Pengamat: "Program ini sangat bagus, hanya saja jalannya mundur."',
  'Dinas terkait: "Kami sedang menunggu petunjuk." Petunjuk terkait: sedang menunggu dinas.',
  'Survei: 9 dari 10 pejabat puas dengan kinerja pejabat. Sepuluhnya yang disurvei.',
  'Anggaran terserap 100%. Hasilnya terserap entah ke mana.',
  'Kementerian umumkan inovasi baru: rapat sambil berdiri, supaya pulang lebih cepat.',
];

// Kembalikan satu headline sesuai keadaan; kondisi spesifik lebih diutamakan daripada yang umum.
export function pilihBerita(g, k) {
  const p = [];
  if (g.stunting >= 25) p.push('Angka stunting naik. Juru bicara: "Itu bukan naik, itu pertumbuhan tinggi yang tertunda."');
  if (g.kabut >= 50) p.push('Kabut asap pekat. Menteri: "Itu bukan asap, itu awan pencitraan."', 'Sekolah libur karena kabut. Menteri: "Libur adalah solusi pendidikan paling hemat."');
  if (k.hutanPersen <= 60) p.push('Hutan menyusut. Pemerintah: "Kami menyebutnya penghijauan versi kuning."');
  if (g.stat.palak >= 5) p.push('Pungutan UMKM disebut "Program Gotong Royong Digital". Sistem digitalnya: kantong Menteri.');
  if (g.panas >= 55) p.push('KPK: "Kami hanya sedang lewat." Lewatnya sudah 3 kali.', 'Menteri tegaskan tidak pernah bertemu pihak mana pun. Foto bersama: dianggap editan.');
  if (g.rakyat >= 40) p.push('Rakyat berunjuk rasa. Menteri: "Itu bukan demo, itu apresiasi dengan suara keras."');
  if ((g.kasRaib || 0) > 0) p.push('Kas Kopdes belum ditemukan. Petugas: "Rekeningnya ada, hanya saja pemiliknya bukan koperasi."');
  if (k.mangkrak > 0) p.push(`${k.mangkrak} bangunan mangkrak diresmikan ulang. Gunting pitanya sama.`);
  if (g.bangunan.length === 0 && g.bulan > 2) p.push('Belum ada pembangunan. Pengamat: "Ini terobosan: nol proyek, nol temuan."');
  if (g.citra >= 30) p.push('Survei citra: Menteri unggul. Respondennya Menteri, istri Menteri, dan baliho Menteri.');
  if (g.ojolMogok > 0) p.push('Ojol mogok kerja. Menteri: "Mereka sedang berlibur secara sukarela."');
  const pakai = p.length && Math.random() < 0.75 ? p : UMUM;
  return pakai[Math.floor(Math.random() * pakai.length)];
}
