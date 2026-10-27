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

// ---------- Dialog pemilik kios: tiap UMKM punya watak ----------
// s = menyapa saat didekati, ok = saat berhasil dipalak, g = saat gagal, t = saat gulung tikar
export const DIALOG = {
  'WARUNG BU TINI': { n: 'Bu Tini', s: ['Eh, Pak Menteri. Mau beli gorengan? Atau mau pajakin gorengannya?', 'Silakan, Pak. Gorengannya anget, anggaran Bapak dingin.'], ok: ['Ya sudah, Pak. Asal gorengan saya jangan dibilang ilegal.', 'Ambil, Pak. Anak saya sekolahnya bisa gratis kan ya? Ya?'], g: ['Bapak ini kok lebih sering minta daripada beli!', 'Saya lapor, Pak! Ke Ketua RT! Yang dua tahun lalu pindah!'], t: ['Warung ditutup. Gorengan terakhir dititipkan ke KPK.'] },
  'BAKSO MAS JOKO': { n: 'Mas Joko', s: ['Bakso, Pak? Urat atau halus? Pajak atau suap?', 'Kuahnya panas, Pak. Seperti suasana rapat anggaran.'], ok: ['Ini, Pak. Tapi baksonya jadi dua biji, ya.', 'Ya sudah, Pak. Kuah saya encerkan sedikit biar adil.'], g: ['Pak, bakso saya dagangan, bukan sumber pendapatan daerah!', 'Maaf Pak, kuah panas saya tumpah. Persis ke arah Bapak.'], t: ['Bakso Mas Joko tutup. Sisa kuahnya dijadikan bukti.'] },
  'FOTOKOPI & ATK MAJU': { n: 'Koh Anton', s: ['Mau fotokopi KTP, Pak? Atau fotokopi alasan?', 'Berkas banyak ya, Pak? Kami punya segala stempel kecuali stempel jujur.'], ok: ['Fotokopi Bapak per lembar saya naikkan. Biar Bapak merasakan.', 'Ini, Pak. Kuitansi kosong gratis. Sesuai selera.'], g: ['Mesin saya macet, Pak. Persis ketika Bapak datang.', 'Silakan antre, Pak. Semua sama di depan mesin fotokopi.'], t: ['Fotokopi tutup. Mesinnya masih menggandakan laporan sendiri.'] },
  'TAMBAL BAN 24 JAM': { n: 'Bang Rudi', s: ['Ban bocor, Pak? Anggaran bocor juga bisa saya tambal. Sepuluh ribu.', 'Bapak kalau mau pajak, antre di belakang ban ini.'], ok: ['Nih, Pak! Tapi besok Bapak tambal ban gratis, ya!', 'Ambil, Pak. Mumpung ban saya belum meletus. Seperti kesabaran saya.'], g: ['Pak, kunci inggris ini belum pernah salah sasaran.', 'Pulang, Pak! Sebelum ban Bapak yang saya tambal. Pakai paku.'], t: ['Tambal Ban 24 Jam tutup. Pertama kali dalam 24 jam.'] },
  'WARTEG BAHARI': { n: 'Bu Narti', s: ['Makan, Pak? Porsi rakyat. Harganya porsi pejabat.', 'Silakan, Pak. Tempe orek gratis kalau Bapak janji tidak menaikkan pajak.'], ok: ['Ya sudah, Pak. Lauk saya tinggal tempe. Pajak sudah makan ayamnya.', 'Terima kasih sudah memperhatikan kami, Pak. Dengan cara yang agak menyakitkan.'], g: ['Mau makan atau mau memalak? Dua-duanya bayar!', 'Pak, saya gratiskan satu hal: rasa malu. Silakan.'], t: ['Warteg Bahari tutup. Nasi terakhir disumbangkan ke baliho.'] },
  'KIOS PULSA CEPAT': { n: 'Dek Dimas', s: ['Pulsa, Pak? Hanya satu-satunya benda di negeri ini yang cepat.', 'Bapak ada kuota? Atau cuma kuasa?'], ok: ['Ini, Pak. Tapi pulsa saya jadi tidak bisa tembus ke rakyat.', 'Ya Pak. Saya pasrah. Sinyal saya juga pasrah.'], g: ['Pak, saya viralkan ya. Hashtag-nya sudah saya siapkan.', 'Cuma sebar luaskan saja, Pak. Bapak sudah di grup RT sebelah.'], t: ['Kios Pulsa tutup. Nomor ini sedang tidak aktif.'] },
  'BENGKEL PAK UDIN': { n: 'Pak Udin', s: ['Motor mogok, Pak? Atau cuma kinerjanya?', 'Hati-hati di sini, Pak. Kunci pas saya sensitif terhadap pajak.'], ok: ['Baik, Pak. Tapi busi Bapak saya ganti pakai yang bekas.', 'Ambil, Pak. Oli bekas saya sisakan buat dekorasi baliho Bapak.'], g: ['Pak, dongkrak ini saya naikkan sedikit. Ke arah kepala Bapak.', 'Mau pajak? Silakan servis dulu motor dinas Bapak, lima juta.'], t: ['Bengkel Pak Udin tutup. Obeng terakhir disita sebagai barang bukti.'] },
  'TOKO KELONTONG SINAR': { n: 'Koh Sinar', s: ['Beli apa, Pak? Gula naik, pajak naik, sabar tetap gratis.', 'Silakan lihat-lihat, Pak. Harga lama sudah pensiun.'], ok: ['Ya, Pak. Besok harga mi instan saya naikkan sedikit. Sesuai anggaran.', 'Ambil, Pak. Pembukuan saya ikut Bapak, dua versi.'], g: ['Saya catat nomor plat Bapak. Plat dinas pun tetap tercatat.', 'Tidak, Pak. Nanti kalau dituruti, besok semua toko diminta.'], t: ['Toko Sinar tutup. Papan "Harga Pas" diganti "Harga Pasrah".'] },
  'ANGKRINGAN MALAM': { n: 'Mas Gendis', s: ['Kopi joss, Pak? Arangnya dari hutan yang Bapak bakar kemarin.', 'Duduk dulu, Pak. Obrolan bapak-bapak di sini lebih jujur daripada rapat Bapak.'], ok: ['Silakan, Pak. Kopi saya tambah air biar pajaknya cukup.', 'Ini, Pak. Bukan rugi, cuma investasi kesabaran jangka panjang.'], g: ['Pak, di angkringan ini semua pejabat bayar. Termasuk Bapak.', 'Sudahlah, Pak. Minum kopi saja. Pajaknya biar jadi kenangan.'], t: ['Angkringan tutup. Tikar dilipat, obrolan dibawa pulang.'] },
  'SALON MBAK RINI': { n: 'Mbak Rini', s: ['Potong rambut, Pak? Hati-hati, saya terbiasa memotong yang tidak perlu.', 'Bapak kelihatan lelah. Habis ngurus rakyat? Atau ngurus baliho?'], ok: ['Ya sudah, Pak. Tapi poni Bapak saya potong pendek sekali.', 'Ini, Pak. Jangan lupa review bintang lima.'], g: ['Gunting saya baru diasah, Pak. Siap untuk dokumen apa pun.', 'Pak, jari saya sudah di tombol rekam. Siap tayang langsung.'], t: ['Salon Mbak Rini tutup. Kursinya dipindah ke ruang rapat dinas.'] },
  'WARUNG MAK ENDANG': { n: 'Mak Endang', s: ['Nak Menteri, makan dulu. Mak masak lebih sedikit, tapi doanya banyak.', 'Pak Menteri kurus sekali. Mungkin banyak pikiran. Atau banyak rapat.'], ok: ['Iya, Nak. Mak ikhlas. Yang penting Nak sehat. Dompet Nak juga.', 'Ini, Nak. Jangan bilang-bilang Mak yang kasih.'], g: ['Nak, Mak tidak punya apa-apa. Selain sandal. Mau?', 'Mak pernah kasih makan ratusan pejabat. Satu pun tak pernah bayar.'], t: ['Warung Mak Endang tutup. Sambal terakhir dijual sebagai bahan bukti.'] },
  'BAKSO PAK WARSO': { n: 'Pak Warso', s: ['Silakan, Pak. Bakso saya urat semua. Seperti saraf Bapak sekarang.', 'Antre, Pak. Pelanggan lama saya lebih penting daripada pajak baru.'], ok: ['Ya sudah, Pak. Saya potong porsi bakso. Pak Menteri paham, kan?', 'Ini, Pak. Tapi jangan lupa sambal saya bebas pajak. Pedasnya ilegal.'], g: ['Bapak mau bakso gratis? Boleh. Tapi saya gratiskan sendok sambil menuang kuah.', 'Pak, kuah saya masih mendidih. Dari tadi menunggu tamu istimewa.'], t: ['Bakso Pak Warso tutup. Panci terakhir sedang diaudit.'] },
  'WARUNG PEMULUNG SEJAHTERA': { n: 'Pak Slamet', s: ['Selamat datang, Pak. Di sini semua barang punya cerita. Dan harga.', 'Hati-hati, Pak. Yang Bapak injak itu bekas laporan keuangan.'], ok: ['Ya, Pak. Hari ini saya cuma dapat kardus. Tapi ini untuk Bapak.', 'Ambil, Pak. Anggap saja ini sumbangan dari sampah ke penguasa.'], g: ['Pak, di sini sampah pun lebih terhormat dari pungli.', 'Tidak, Pak. Karung saya berat. Banyak mimpi rakyat di dalamnya.'], t: ['Warung Pemulung tutup. Karungnya ikut sampah. Tapi sampah itu bangga.'] },
  'KIOS KOPI KENANGAN': { n: 'Kak Salsa', s: ['Kopi susu, Pak? Rasa kenangan: pahit, mahal, kadang kadaluwarsa.', 'Bapak mau kopi? Atau mau aspirasi? Dua-duanya bisa diseduh.'], ok: ['Ya Pak. Besok kopinya saya encerkan. Sesuai anggaran.', 'Ini, Pak. Struk dicetak dengan tulisan "Pajak Bapak". Gratis.'], g: ['Mesin kopi ini menyala dan siap menyiram kepala siapa pun.', 'Pak, nanti saya buat podcast. Judulnya: "Hari Saya Dipajaki Menteri".'], t: ['Kios Kopi Kenangan tutup. Kenangannya masih ada, kopi tidak.'] },
};
export const DIALOG_OJOL = {
  ramah: { n: 'Abang Ojol', s: ['Siap, Pak. Mau ke mana? Kantor, atau luar negeri?', 'Lagi sepi, Pak. Seperti dompet saya sejak ada kenaikan tarif.'], ok: ['Ya, Pak. Sekali ini saja ya. Besoknya gratis boleh, ya?', 'Ini, Pak. Tapi jangan bilang istri saya, saya bilangnya narik tiga ratus.'], g: ['Maaf, Pak. Saya cuma boleh menerima orderan, bukan perintah pajak.', 'Aduh Pak, saya tidak dengar. Tadi helm saya lagi nyanyi.'] },
  biasa: { n: 'Abang Ojol', s: ['Ada orderan, Pak? Atau cuma ada urusan?', 'Bapak bukan pelanggan. Bapak instansi.'], ok: ['Ya sudah, Pak. Anggap saja saya setor ke negara. Negara mana, saya tidak tahu.', 'Ini, Pak. Saya cuma ojol. Bukan pemilik kilang minyak.'], g: ['Pak, saya antar saja Bapak ke Kantor Pajak. Gratis.', 'Aplikasi saya bilang Bapak tidak ada di pelanggan. Cuma ada di keluhan.'] },
  galak: { n: 'Abang Ojol', s: ['Apa lihat-lihat? Mau naik, atau mau cari masalah?', 'Bapak kenal saya? Saya juga tidak kenal Bapak. Tapi saya benci.'], ok: ['Nih! Ambil! Tapi kalau Bapak lewat, saya klakson tiga hari!', 'Cukup, Pak. Saya sudah tidak punya apa-apa. Selain helm dan dendam.'], g: ['Ngapain Bapak? Mau minta duit? Saya yang butuh!', 'Satu kata lagi, Pak, saya panggil sepuluh teman. Semua pakai klakson.'] },
};
export function ucapan(u, jenis) {
  const d = u.jenis === 'ojol' ? DIALOG_OJOL[u.tipe] : DIALOG[u.nama];
  if (!d || !d[jenis] || !d[jenis].length) return null;
  return { nama: d.n, teks: d[jenis][Math.floor(Math.random() * d[jenis].length)] };
}
