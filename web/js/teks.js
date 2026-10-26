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

// Panduan misi
export const MISI = [
  'Tidak punya modal? Ikuti penanda kuning ke warung terdekat, lalu tekan PALAK (tarik "pajak"). Pemilik galak bisa melawan. Sewa APARAT supaya 100% berhasil.',
  'Sudah ada Cuan. Ikuti penanda kuning ke hutan, lalu tekan BAKAR (gratis).',
  'Tunggu api padam, lalu TANAM sawit (40 Cuan). Dari sini Cuan mengalir sendiri.',
  'Perbanyak kebun sawit: bakar dan tanam sampai 3 petak.',
  'Bangun DAPUR MBG di tempat bebas (penanda kuning di bukit, jauh dari desa).',
  'Sekarang coba bangun dekat desa. Lihat apa yang terjadi.',
  'Bos menagih setoran tiap akhir bulan. Beli PUPUK, rekrut OKNUM, sewa APARAT. Selamat bertugas, tanpa akhir!',
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
