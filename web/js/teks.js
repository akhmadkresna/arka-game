// Teks game (bahasa Indonesia). Semua tokoh dan tempat fiktif.
export const MONOLOG = {
  mulai: ['Hari ini negeri ini beruntung: saya masuk kantor.', 'Rakyat menunggu. Saya juga, soalnya fotografernya belum datang.'],
  bakar: ['Ini bukan membakar. Ini "pembukaan lahan inovatif".', 'Asapnya? Itu awan pembangunan.', 'Api ini menyala demi generasi emas. Terutama generasi saya.'],
  tebang: ['Menebang manual? Efisien kata siapa? Pasti bukan saya.'],
  sawit: ['Sawit. Hijau juga, kan. Secara warna.', 'Hutan lama, kebun baru. Namanya regenerasi.'],
  bangun: ['Gedung baru, baliho baru, saya baru. Semuanya baru.', 'Lokasinya strategis. Strategi saya, bukan strategis untuk warga.'],
  mangkrak: ['Mangkrak itu istilah orang yang tidak paham proses.', 'Kalau gedungnya retak, itu ulah oknum.'],
  blokir: ['Berkas 14 instansi? Saya cuma butuh satu: instansi saya.', 'Prosedur itu ada supaya diurus orang lain.'],
  selfie: ['Sudut terbaik saya adalah semua sudut.', 'Foto ini akan masuk buku sejarah. Saya yang menulisnya.'],
  setoranOk: ['Bos senang. Berarti saya hebat.', 'Setoran lancar. Bakat memang tidak bisa dibeli (kecuali gelarnya).'],
  setoranKurang: ['Setoran kurang? Itu salah oknum di bagian setoran.', 'Bos kecewa. Pasti ada yang menyabotase kehebatan saya.'],
  ngeles: ['"Itu hoaks, tapi sudah kami evaluasi." Selalu manjur.'],
  berkas: ['Berkas rapi adalah perisai. Saya bawa dua.'],
  pupuk: ['Pupuk bersubsidi, hasil non-subsidi. Itu namanya efisiensi.'],
  oknum: ['Rekrut oknum baru. Dia bekerja, saya bertanggung jawab (atas fotonya).'],
  gelar: ['Gelar baru. Ilmu? Itu urusan belakangan.'],
  palak: ['Itu bukan memalak. Itu "kontribusi sukarela yang diwajibkan".', 'UMKM kuat kalau rajin berkontribusi. Pada saya.'],
  palakGagal: ['Pemilik kiosnya tidak paham konsep "pajak". Sungguh kurang edukasi.', 'Videonya viral. Pasti editan.'],
  aparat: ['Aparat sewaan: pengawal yang loyal selama bayarannya lancar.'],
  tutup: ['Kiosnya tutup? Berarti pajaknya sudah lunas. Selamanya.'],
  ojol: ['Ojol itu mitra. Mitra wajib berkontribusi pada mitranya.', 'Jalan raya itu milik negara. Lewat, ya bayar.'],
  klakson: ['Klakson massal itu bukan protes. Itu paduan suara yang kurang latihan.'],
  mogok: ['Mogok? Berarti pajak jalurnya lunas dibayar dengan tenaga.'],
  keracunan: ['Ini bukan salah saya. Dapurnya yang belum memahami visi saya.', 'Saya sudah meresmikannya. Mengurus isinya itu tugas orang lain.'],
  tumbuh: ['Hutan tumbuh lagi sendiri? Berarti saya boleh membakarnya lagi.'],
};

export const BLOKIR = [
  'Dokumen kurang: butuh tanda tangan 14 instansi.',
  'Lahan sengketa: tiga keluarga merasa memilikinya, dan satu dari kementerian.',
  'Rapat koordinasi dijadwalkan ulang ke tahun depan.',
  'Sertifikat kelayakan sedang diproses (sejak dua periode lalu).',
  'Anggaran belum cair, karena sudah cair.',
  'Lokasi terlalu dekat dengan warga. Butuh kajian dampak keramaian.',
];

// Deskripsi lokasi "salah" yang langsung disetujui
export const LOKASI = {
  sungai: 'tepat di tepi sungai. Terendam pada hujan pertama.',
  sawah: 'di tengah sawah produktif. Padinya pindah ke dalam laporan.',
  tpa: 'persis di samping tempat pembuangan sampah. Baunya ikut diresmikan.',
  hutan: 'di tengah hutan, jauh dari penduduk mana pun.',
  kantor: 'di halaman kantor dinas, demi efisiensi foto.',
  bukit: 'di puncak bukit berangin. Tidak ada jalan, tapi pemandangannya bagus untuk baliho.',
  kosong: 'di lahan kosong tanpa jalan, tanpa air, tanpa penduduk.',
};

// Kartu denda: kegagalan di mode santai hanyalah kerugian
export const DENDA = {
  restu: ['Direshuffle (jabatan baru, nasib sama)', 'Bos kehilangan kepercayaan. Anda dipindah ke kementerian yang sama dengan nama berbeda. Denda administrasi 40% Cuan. Restu Bos dipulihkan ke 45.'],
  panas: ['Dipanggil KPK (hanya sebagai saksi)', 'Berkas diperiksa, kambing hitam disita. Denda 40% Cuan. Berkas habis. Panas KPK turun ke 25.'],
  rakyat: ['Demo besar di depan kantor', 'Rakyat turun ke jalan membawa panci. Anda "berdialog" dengan mereka, 30% Cuan hilang sebagai biaya dialog. Amarah turun ke 35.'],
};

// Panduan misi. {x} dst. diganti nama tombol sesuai perangkat. buka = tombol yang relevan (null = semua).
export const NAMA_TOMBOL = { n: 'Naik', j: 'Lompat', h: 'Klakson', x: 'Palak', v: 'Aparat', b: 'Bakar', t: 'Tebang', p: 'Tanam', '1': 'MBG', '2': 'Kopdes', f: 'Selfie', c: 'Pers', e: 'Berkas', k: 'Kambing', g: 'Gelar', u: 'Pupuk', o: 'Oknum' };
export const MISI = [
  { ringkas: 'Ke warung bertanda panah, ketuk {x}. {v} = pasti berhasil.', teks: 'Tidak punya modal? Jalan ke warung yang ditandai panah kuning, lalu tekan {x} untuk menarik "pajak". Pemilik galak bisa melawan. {v} (sewa aparat) menjamin berhasil.', buka: ['x', 'v'] },
  { ringkas: 'Ke hutan bertanda panah, ketuk {b} (gratis).', teks: 'Sudah ada Cuan. Jalan ke hutan yang ditandai panah kuning, berdiri di dalamnya, lalu tekan {b} (gratis).', buka: ['b', 't', 'x', 'v'] },
  { ringkas: 'Tunggu api padam ±7 dtk, ketuk {p} untuk tanam sawit (40).', teks: 'Tunggu api padam (sekitar 7 detik), lalu tekan {p} untuk menanam sawit (40 Cuan). Setelah ini Cuan mengalir sendiri.', buka: ['p', 'b', 't', 'x', 'v'] },
  { ringkas: 'Ulangi {b} lalu {p} sampai 3 petak sawit. Kehabisan Cuan? {x}.', teks: 'Perbanyak kebun: ulangi {b} lalu {p} sampai punya 3 petak sawit. Kehabisan Cuan? Tekan {x} di warung.', buka: ['p', 'b', 't', 'x', 'v'] },
  { ringkas: 'Ke titik bertanda (jauh dari desa), hadap tanah kosong, ketuk {1}.', teks: 'Bangun dapur: jalan ke titik yang ditandai (jauh dari desa), hadapkan tokoh ke tanah kosong, lalu tekan {1}.', buka: ['1', '2', 'b', 'p', 't', 'x', 'v', 'f'] },
  { ringkas: 'Hadap ke desa lalu ketuk {1}. Lihat apa yang terjadi.', teks: 'Sekarang coba bangun dekat desa: hadapkan tokoh ke desa, lalu tekan {1}. Lihat apa yang terjadi.', buka: ['1', '2', 'b', 'p', 't', 'x', 'v', 'f'] },
  { ringkas: 'Ke motor bertanda, ketuk {n}; ketuk lagi untuk turun. {j} = lompat.', teks: 'Naik kendaraan: jalan ke motor yang ditandai, lalu tekan {n}. Kemudikan dengan W/A/S/D atau joystick dan tekan {n} lagi untuk turun. Mobil dinas ada di dekat Kantor Dinas. {j} untuk lompat.', buka: ['n', 'j', 'h', 'x', 'v'] },
  { ringkas: 'Bos menagih setoran tiap bulan. Beli {u}, rekrut {o}, atau sewa {v}. Tanpa akhir!', teks: 'Bos menagih setoran tiap akhir bulan. Beli pupuk {u}, rekrut oknum {o}, atau sewa aparat {v}. Ojol di jalan juga bisa dipalak. Selamat bertugas, tanpa akhir!', buka: null },
];

export const PAJAK = [
  'Pajak Keamanan Lingkungan', 'Retribusi Bayangan', 'Iuran Sampah Spiritual', 'Pajak Kehadiran',
  'Biaya Izin Berjualan Sambil Berdiri', 'Sumbangan Wajib Pembangunan', 'Pajak Udara Segar', 'Iuran Fotokopi Berkas Imajiner',
];
export const GAGAL = [
  'Pemilik kios berteriak, menyiram Anda dengan air cucian, dan warga merekam semuanya.',
  'Pemilik kios mengancam melapor. Videonya sudah ditonton ribuan orang.',
  'Ibu pemilik kios lebih galak dari aparat mana pun. Anda mundur teratur.',
  'Pemilik kios menunjukkan struk yang membuktikan Anda yang berutang. Memalukan.',
];

export const PAJAK_OJOL = [
  'Pajak Jalur Strategis', 'Retribusi Aspal Berkah', 'Iuran Parkir Berjalan', 'Pajak Helm Resmi',
  'Biaya Izin Berhenti di Pinggir', 'Sumbangan Lampu Merah',
];
export const GAGAL_OJOL = [
  'Abang ojol menunjukkan aplikasi: pendapatannya hari ini lebih kecil dari ongkos bensin. Anda pergi sambil malu.',
  'Abang ojol langsung membunyikan klakson dan merekam Anda dengan ponselnya.',
  'Abang ojol menjawab sopan bahwa ia harus kejar target, lalu tancap gas.',
  'Abang ojol memperlihatkan bukti setoran ke aplikasi, bukan ke Anda.',
];
