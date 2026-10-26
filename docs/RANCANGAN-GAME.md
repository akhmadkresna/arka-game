# REPUBLIK EMAS (anti stunting) — Rancangan Game

Game satir manajemen *roguelite* tingkat sulit tentang menjalankan kementerian di negara yang anggarannya menguap, proyeknya tak pernah selesai, dan satu-satunya hal yang bekerja adalah ketika sesuatu viral.

> **Catatan hukum dan etika.** Tokoh dalam game ini adalah *arketipe fiktif gabungan* dengan nama parodi, dibangun dari peristiwa publik yang terdokumentasi, bukan potret individu bernama. UU ITE dan KUHP itu nyata. Tertawakan sistem dan polanya, jangan menuduh orang nyata melakukan hal yang belum dibuktikan pengadilan.

---

## 1. Riset: bahan mentah (peristiwa terdokumentasi)

| Tema | Yang terjadi | Mengapa cocok jadi mekanik |
|---|---|---|
| **Korupsi raksasa** | Kasus tata niaga timah: perkiraan kerugian negara sekitar Rp 300 T, sebagian besar kerusakan lingkungan ([SEA Actions](https://www.seaanticorruption.org/2025/07/10/when-greed-met-tin-the-unfolding-catastrophe-of-indonesias-largest-corruption-case/), [Wikipedia](https://en.wikipedia.org/wiki/Indonesian_tin_mining_scandal)). Kasus Pertamina (2025) awalnya Rp 193,7 T, laporan lain menyebut sekitar Rp 285 T ([oilprice](https://oilprice.com/Latest-Energy-News/World-News/Indonesia-Widens-17-Billion-Corruption-Probe-Into-State-Energy-Firm.html), [East Asia Forum](https://eastasiaforum.org/2025/07/15/indonesias-billion-dollar-fuel-fraud-exposes-deep-corruption-crisis/)). | Angka yang begitu besar sampai jadi lelucon. Penghitung kerugian dengan nol berlebihan. |
| **Keruntuhan digital** | Juni 2024, ransomware (Brain Cipher/varian LockBit) melumpuhkan Pusat Data Nasional; 282 instansi terdampak, tebusan sekitar US$8 juta, hanya sekitar 44 instansi yang punya cadangan ([Investortrust](https://investortrust.id/national/31450/telkom-data-pemerintah-yang-diserang-ransomware-tak-bisa-dipulihkan), [detik](https://inet.detik.com/security/d-7409192/detik-detik-ransomware-brain-cipher-lumpuhkan-pusat-data-indonesia)). | "Sudah backup?" "Belum." sebagai kondisi kalah berulang. |
| **Program andalan yang bermasalah** | Makan Bergizi Gratis: analisis Lancet mencatat 177 kejadian dan lebih dari 20.000 anak sampai akhir 2025; para ibu berdemo membawa panci ([Lancet](https://www.thelancet.com/journals/lansea/article/PIIS2772-3682(26)00019-3/fulltext), [ABC](https://www.abc.net.au/news/2025-10-05/indonesia-free-meal-program-poisons-thousands-of-kids/105836302)). | Ada korban nyata. Sindir *respons pejabat* (menyangkal, ganti nama, menyalahkan), jangan pernah korbannya. |
| **Proyek gajah putih** | Whoosh: anggaran sekitar US$6 M membengkak ke sekitar US$7,3 M, sekitar 75% pinjaman China Development Bank, penumpang di bawah proyeksi, rugi Rp 4,2 T pada 2024; induk operatornya menyebutnya "bom waktu" ([Asia Sentinel](https://www.asiasentinel.com/p/indonesia-high-speed-rail-time-bomb), [Rail Journal](https://www.railjournal.com/financial/pt-kai-takes-chinese-loans-for-whoosh-cost-overrun/), [Indonesia Business Post](https://indonesiabusinesspost.com/5064/corporate-affairs/jakarta-bandung-high-speed-rail-a-ticking-time-bomb-amid-mounting-debt-kai)). | Mekanik pembengkakan biaya dan "proyek mangkrak". |
| **Buronan** | Harun Masiku: ditetapkan tersangka KPK Januari 2020, Red Notice Interpol, bertahun-tahun belum tertangkap, aktivis menduga ada perlindungan ([Jakarta Post](https://www.thejakartapost.com/indonesia/2023/08/13/kpk-search-continues-for-graft-fugitive-harun-masiku), [Tempo](https://en.tempo.co/amp/1677314/anti-graft-activists-deems-kpk-lack-of-commitment-to-find-harun-masiku)). | Level kabur di mana pengejarnya anehnya lambat. |
| **Pungli sehari-hari** | Ombudsman RI mencatat 16.000 aduan maladministrasi layanan publik pada 2021, sekitar 11% soal pungli; polisi paling sering disebut dalam survei suap TI ([Ombudsman RI](https://ombudsman.go.id/news/r/ombudsman-tahun-ini-aduan-pungli-di-layanan-publik-masih-tinggi), [Bisnis](https://kabar24.bisnis.com/read/20211215/15/1478063/ini-sebabnya-pungli-di-indonesia-sulit-diberantas)). | Setiap interaksi NPC punya "biaya administrasi". |
| **"No viral, no justice"** | Anggapan bahwa kasus baru bergerak setelah viral di media sosial ([kumparan](https://kumparan.com/skyyblauw/indonesia-no-viral-no-justice-24HyLPIREBI), [Unima](https://ejurnal.unima.ac.id/index.php/paradigma/article/download/9852/5268/39011)). | **Mekanik inti** (lihat bawah). |
| **Budaya protes dan satir** | Protes Agustus 2025 bermula dari tunjangan rumah anggota dewan (sekitar Rp 50 juta/bulan), pengemudi ojol Affan Kurniawan tewas dilindas kendaraan taktis, pengunjuk rasa mengibarkan bendera One Piece ([Wikipedia](https://en.wikipedia.org/wiki/August_2025_Indonesian_protests), [Jolly Roger](https://en.wikipedia.org/wiki/Straw_Hats'_Jolly_Roger)). | Membuktikan penontonnya: orang Indonesia sudah bersatir lewat meme dan budaya pop. Tertawa *bersama* rakyat, jangan pada korban. |

**Celah riset (verifikasi sebelum dirilis):** detail kasus e-KTP, status Harun Masiku setelah Juni 2024, apakah restrukturisasi Whoosh sudah selesai, dan angka kerugian Pertamina yang berbeda-beda antarsumber. Periksa ulang apa pun yang dijadikan "fakta" dalam game.

---

## 2. Dari riset menjadi game

### Premis
Anda menteri baru di kementerian acak. KPI resmi: "melayani rakyat". KPI sebenarnya: bertahan sepanjang masa jabatan tanpa ditetapkan tersangka, sementara anggaran menyusut di setiap tingkat yang dilaluinya.

### Mekanik inti: Anggaran Bocor
Anggaran mengalir lewat tingkat: Pusat → Kementerian → Dirjen → Dinas → Vendor → Lapangan. Tiap tingkat mengambil potongan yang terlihat. Rp 100 dialokasikan, Rp 40 sampai ke jalan atau sekolah. Jujur tidak memberi hadiah; Anda bisa menambal kebocoran, tetapi setiap tambalan membuat seseorang di atas marah.

### Tiang tingkat sulit
1. **Meter Viral ("No Viral, No Justice").** Masalah diabaikan sampai viral; baru setelah itu birokrasi berlari (24 jam, lalu lupa).
2. **Proyek Mangkrak.** Setiap proyek punya jam pembengkakan biaya. Menyelesaikannya jarang terjadi dan biasanya lebih buruk.
3. **Backup? Backup Apa?** Peristiwa ransomware mengacak progres kecuali Anda membeli upgrade Backup yang membosankan sebelumnya.
4. **Mode Ngeles.** Konferensi pers: pilih kalimat penghindar yang paling licin.
5. **Rapat Maraton, Tender Gaib, Gunting Pita, Laporan ABS (Asal Bapak Senang).**
6. **Reshuffle.** Pergantian kabinet acak memindahkan Anda ke kementerian yang tidak Anda pahami. *(Rencana, belum ada di prototipe.)*

### Menang dan kalah
- **Kalah:** Restu Bos 0 (direshuffle), Panas KPK 100, Amarah Rakyat 100, atau kas kosong sebelum proyek jadi.
- **"Menang":** selamat sampai akhir masa jabatan dengan serapan minimal 80%. Layar akhir membandingkan *Laporan Resmi* dengan *Kenyataan*.

### Aturan nada satir
- **Sasar ke atas, bukan ke bawah.** Pejabat, kontraktor, mesin partai, ritual birokrasi. Bukan pekerja biasa, korban, atau pengunjuk rasa yang gugur.
- **Pola, bukan orang.** Lelucon tentang *cara sistem bekerja*.
- **Rakyat sebagai nurani pemain.**
- **Bahasa:** campuran birokrasi formal (*"sesuai arahan"*, *"dalam rangka"*) dan bahasa jalanan sebagai kontras.

---

## 3. Sistem "Salah Itu Benar" (pemain harus berbuat salah)

Setiap aksi punya dua nilai: yang dihargai sistem dan yang dihukum sistem. Game menilai pemain dari hal yang keliru.

### Indikator
| Indikator | Naik ketika | Batas |
|---|---|---|
| **Restu Bos** | Menggelembungkan, boros, mengangkat orang dekat, diam | 0 = direshuffle (tanda kegagalan bagi yang jujur) |
| **Panas KPK** | Berbuat salah *dengan ceroboh* (tanpa berkas) | 100 = ditangkap |
| **Amarah Rakyat** | Hasil nyata memburuk | 100 = dicopot |
| **Viralitas** | Skandal bocor | Lonjakan mempercepat semua indikator |
| **Kinerja Resmi / Serapan** | Laporan dan belanja | Serapan < 80% di akhir = dicopot |

### Mengapa bukan sekadar "pilih kebalikannya"
1. **Hukuman dua sisi.** Salah yang ceroboh menaikkan Panas KPK. Keahlian pemain: berbuat salah *dengan rapi* (berkas, stempel, kambing hitam).
2. **Aturan tersembunyi.** Teks resmi kartu berbohong. Layar kenyataan menunjukkan apa yang sebenarnya berubah. Setiap percobaan membuka lebih banyak aturan.
3. **Kejujuran terasa pintar sesaat.** Merekrut ahli mempercepat proyek, lalu Restu Bos terkuras dua bulan kemudian.

### Contoh pemetaan (nilai ada di `web/data.js`)
| Aksi | Restu Bos | Panas KPK | Amarah Rakyat | Kinerja Resmi | Alasan |
|---|---|---|---|---|---|
| Selesaikan proyek di bawah anggaran | **-25** | 0 | -5 | -20 | Sisa anggaran memalukan |
| Resmikan proyek yang belum selesai | +12 | 0 | +4 | +15 | Belanja berarti kinerja |
| Rekrut ahli berintegritas | **-20** | 0 | -5 | +5 | Mengancam orang di atas |
| Angkat keponakan Pak Dirjen | +15 | +3 | +8 | +8 | Kesetiaan adalah keahlian |
| RAB "realistis" dengan berkas | +10 | +4 | 0 | +10 | Salah yang rapi |
| RAB "realistis" tanpa berkas | +10 | **+24** | 0 | +10 | Ceroboh = penjara |
| Rilis data apa adanya | -15 | +8 | -10 | -15 | Kejujuran mengundang perhatian |

### Struktur data
Setiap aksi adalah entri data (`web/data.js`) sehingga skandal baru mudah ditambah:

```js
{ id: 'ahli', judul: 'Rekrut tenaga ahli berintegritas',
  tip: 'Peningkatan kualitas SDM.',               // bahasa resmi (menyesatkan)
  efek: { restu: -20, kpi: 5, proyek: 12 },        // kenyataan
  tunda: { bulan: 2, restu: -10 },                 // efek tertunda
  cover: false }                                   // perlu berkas?
```

---

## 4. Karakter (arketipe fiktif dari pola yang terdokumentasi)

| Karakter | Arketipe | Perilaku khas | Pola nyata yang disindir |
|---|---|---|---|
| **Bapak Menteri Anu** (pemain) | Si Ditunjuk | Gelar bintang lima, keahlian nol. "Sesuai arahan" menahan satu pukulan. | Jabatan kabinet bukan karena keahlian |
| **Dirjen Mark-Up** | Si Pemotong | Selalu ambil "cuma 10%". | Penggelembungan anggaran |
| **PT Sejahtera Abadi Jaya Makmur** | Kontraktor | Menang semua tender, menyerahkan 40% jembatan dan banyak spanduk. | Proyek mangkrak dan bengkak |
| **Staf Ahli Ngeles** | Dukun Citra | Menjual kalimat penghindar. "Itu hoaks, tapi sudah kami evaluasi." | Klarifikasi berkelit |
| **Mas Admin Server** | Kepala TI | "Backup itu kan opsional." | Peretasan Pusat Data Nasional 2024 |
| **Tuan Buron** | Si Buronan | Bos level yang "diyakini masih di dalam negeri". | Tersangka buron bertahun-tahun |
| **Bu Anggota Dewan** | Legislator | Tunjangan terus naik. Setuju pada apa pun yang ada kotak snack-nya. | Tunjangan anggota dewan |
| **Komandan Sidak** | Inspektur Foto | Muncul hanya jika viralitas > 60, berfoto, lalu hilang. | "No viral, no justice" |
| **Ibu Warga dan Abang Ojol** | Rakyat | Bukan musuh. Meter marah mereka adalah jam Anda. | Budaya protes |
| **Bapak Penegak** | Bos Auditor | Lambat, lalu tiba-tiba. | Penegakan antikorupsi |

---

## 5. Lembar karakter: "Bapak Presiden" (karikatur)

**Peran:** sumber *Restu Bos*. Bukan karakter yang dimainkan dan bukan penjahat yang dikalahkan. Ia matahari tempat seluruh kementerian mengorbit: setiap aksi dinilai dari cara kelihatannya dari kursinya.

### Batas satir (baca sebelum menggambar)
- **Sasaran:** persona publik, pernyataan publik, dan kebijakan (program makan gratis, imbauan mengibarkan bendera, dana kekayaan negara, proyek besar, kabinet besar).
- **Jangan:** menuduh melakukan kejahatan, menggambarkan pengayaan pribadi, atau bercanda tentang tuduhan pelanggaran HAM 1998 dan korban Agustus 2025. Itu serius, diperdebatkan, dan berbeda kategori dari karikatur persona publik.
- **Jangan pakai nama asli.** Nama parodi ("Bapak Presiden", "Pak Jenderal Gemoy") dan tampilan bergaya; biarkan penonton mengenali sendiri. Cantumkan kredit "semua tokoh fiktif".
- **Hukum:** KUHP baru dilaporkan memuat delik penghinaan presiden (verifikasi pasal dan apakah delik aduan). Minta ulasan ahli hukum sebelum rilis publik.

### Tampilan (bergaya, bukan fotorealistis)
| Ciri | Arah karikatur |
|---|---|
| Postur | Tegap, tegap-militer, dada besar |
| Kepala | Wajah bulat, rambut cepak, alis tebal, pipi ekspresif |
| Busana | Jaket safari gelap dengan medali kebesaran, peci hitam |
| Pose khas | Hormat yang berubah jadi joget ("gemoy") |

### Perilaku dalam game
- Berdiri di podium; kementerian dengan serapan tinggi mendapat acungan jempol.
- Suasana hati mengikuti Restu Bos: senang, tegas, marah.
- Berkunjung tiap 4 bulan: jika Kinerja Resmi rendah, Restu Bos turun; jika tinggi, naik.
- **Tidak pernah dilawan atau dipermalukan.** Humor datang dari semua orang yang menata dunia di sekitar tatapannya.

### Kalimat khas (rekaan)
- "Pokoknya harus jalan. Tidak boleh ada yang tidak jalan."
- "Serapan berapa persen?"
- "Bagus. Teruskan."

---

## 6. Status implementasi (prototipe)

Prototipe dapat dimainkan ada di `web/` (HTML, CSS, JS murni, tanpa build). Sudah ada: 7 indikator, diagram Anggaran Bocor, 17 aksi, 7 kejadian acak, mini-game Ngeles, efek tertunda, ransomware dengan/tanpa backup, kunjungan presiden, layar akhir "Laporan Resmi vs Kenyataan".

Belum ada: Reshuffle, level kabur, animasi, suara, penyimpanan progres, dan jalur akhir rahasia (melakukan semua hal benar, kehilangan jabatan, tetapi jembatannya berdiri).

## 7. Langkah berikut
1. Uji coba nada dan keseimbangan dengan pemain nyata.
2. Tambah Reshuffle dan level kabur.
3. Pemeriksaan sensitivitas untuk apa pun yang menyinggung korban nyata (keracunan makanan, korban demo) sebelum dipublikasikan.
4. Ulasan hukum atas karakter Bapak Presiden.

---

## 8. Arah baru: dunia terbuka, kamera orang ketiga, dan "tani cuan"

### 8.1 Judul: butuh identitas Indonesia
"+62" hanya kode telepon, bukan identitas. Pilihan judul (pilih satu, atau campur):

| Judul | Rasa | Catatan |
|---|---|---|
| **Wani Piro? Nusantara** | Jawa, lugas, langsung ke inti | "Wani piro" = "berani berapa". Paling mudah diingat dan viral. |
| **Negeri Mangkrak** | Sindiran pada proyek mandek | Singkat, mudah dicari. |
| **Nusantara Tak Jadi** | Ironi "Nusantara" (ibu kota) dan "tak jadi" | Hati-hati dibaca sebagai serangan pada proyek tertentu. |
| **Bos Asal Senang: Simulator Menteri** | Memakai istilah ABS yang sudah dikenal | Cocok untuk subjudul. |
| **Gas Pol Rem Blong** | Bahasa jalanan, gambaran negara melaju tanpa rem | Cocok untuk dunia terbuka dan kendaraan. |
| **Ojo Kebanyakan Ngeles** | Lucu, khas, panjang | Cocok untuk nama mode, bukan judul utama. |
| **Cuan Nusantara** | Ringan, fokus pada "tani cuan" | Kurang tajam sebagai satir. |
| **Semua Beres, Pak!** | Jawaban khas bawahan | Bagus untuk slogan. |

**Rekomendasi (diperbarui, lihat 8.7):** karena tokoh utama narsistik, judul harus memuji diri sendiri: **BERKAT SAYA, NEGERI INI MAJU**, subjudul *Simulator Menteri Paling Berjasa Sepanjang Masa*. Daftar judul di atas tetap berguna sebagai cadangan atau nama mode.

**Hindari:** memelesetkan lambang negara (Garuda Pancasila), semboyan Bhinneka Tunggal Ika, bendera, atau lagu kebangsaan. UU 24/2009 melarang penghinaan terhadap simbol negara. Itu risiko hukum yang tidak perlu untuk sebuah lelucon.

### 8.2 Dunia terbuka, kamera orang ketiga
Prototipe giliran (HTML) berubah menjadi **demo dunia terbuka 3D**; mekanik indikator tetap menjadi tulang punggung.

- **Dunia:** kepulauan fiksi yang diracik dari sudut-sudut yang dikenal: kota ibu kota yang macet, sawah dan desa, hutan hujan di pulau besar, pesisir. Nama tempat fiksi agar tidak menuduh daerah tertentu.
- **Kamera:** orang ketiga, mengikuti bahu pemain. Jalan kaki, motor ojol, dan mobil dinas dengan sirene patwal yang membuat lalu lintas minggir.
- **Waktu:** hari berjalan nyata; "bulan" tetap satuan masa jabatan (tiap beberapa menit), dengan Presiden berkunjung tiap 4 bulan.
- **NPC:** Dirjen, vendor, warga, ojol, wartawan. Setiap interaksi punya "biaya administrasi".
- **Nada:** peta menunjukkan akibatnya. Hutan menyusut, kabut menebal, bangunan mangkrak bertambah. Layar akhir membandingkan peta awal dan akhir.

### 8.3 Tani cuan (ekonomi inti)
Mata uang: **Cuan**. Sumbernya sengaja salah. Dibelanjakan untuk Restu Bos, berkas, dan kambing hitam, sehingga "pertanian" yang salah itu menopang permainan.

#### A. Bakar lahan jadi sawit
1. Pilih petak hutan, lalu **bakar** (cepat dan murah) atau **tebang** (lambat, mahal, dianggap "tidak efisien").
2. Petak menjadi lahan kosong, lalu **tanam sawit**; menghasilkan Cuan berkala.
3. **Risiko/akibat:** api merambat jika angin tidak dihitung; **kabut asap** menaikkan Amarah Rakyat dan memengaruhi jarak pandang; titik panas terlihat satelit (Panas KPK/Panas Lingkungan naik); kebun terbakar habis jika api tak terkendali.
4. **Cara aman (rapi):** urus "izin" dan berkas, bayar kambing hitam, pakai perusahaan cangkang. Kerugian ditimpakan pada "oknum".

*Dasar riset:* pada Agustus 2026 Kementerian Kehutanan menjatuhkan sanksi pada enam pemegang konsesi setelah kebakaran lebih dari 1.500 hektare di Kalimantan ([Business Today](https://www.businesstoday.com.my/2026/08/25/indonesia-sanctions-six-companies-over-kalimantan-forest-fires/)); pada Oktober 2026 pemerintah menyelidiki 19 perusahaan atas kebakaran 11.047 ha di tujuh provinsi ([NST](https://www.nst.com.my/amp/news/nation/2026/10/1552703/haze-malaysian-singaporean-firms-under-investigation)); Walhi Kalbar mencatat 8.644 titik panas Mei hingga Juli 2025 dengan mayoritas di konsesi sawit dan hutan tanaman industri ([Indo Left](https://www.indoleft.org/news/2025-07-30/most-fires-in-west-kalimantan-on-palm-oil-concessions-says-walhi.html)). *Catatan:* titik panas dan peta bekas bakar menunjukkan *di mana* api terjadi, bukan *siapa* yang menyalakannya. Dalam game, sasarannya adalah mekanisme pembiaran dan perizinan, bukan menuduh perusahaan atau orang tertentu.

#### B. Bangun dapur MBG dan Kopdes di tempat acak (membangun dengan benar diblokir)
Ini mekanik "salah itu benar" versi dunia terbuka.

- **Lokasi yang benar** (dekat sekolah atau desa, ada air bersih, lahan jelas) **diblokir** oleh rintangan lucu: "Dokumen kurang: tanda tangan 14 instansi", "Lahan sengketa", "Rapat koordinasi dijadwalkan ulang", "SLHS dalam proses". Setiap upaya benar menurunkan Restu Bos dan menghabiskan waktu.
- **Lokasi acak yang absurd** (tengah sawah, tepi sungai, samping tempat pembuangan sampah, di atas lereng) **langsung disetujui**. Bangunan jadi, spanduk terpasang, **serapan naik**, Cuan masuk dari mark-up.
- **Ujungnya:** bangunan yang salah tempat cepat jadi **mangkrak** (kosong, retak, tak dipakai). Layar peta menampilkan "bangunan hantu" yang menumpuk.
- **Kopdes:** gerai koperasi didirikan di mana pun yang cepat difoto untuk laporan. Tiap gerai menambah "capaian" meski tak ada isinya.

*Dasar riset:* Menteri Koperasi mengakui lahan sebagai kendala terbesar pembangunan Kopdes Merah Putih (kebutuhan sekitar 1.000 m²), dan pada Juni 2026 dilaporkan target operasional dipangkas dari 80.000 ke 40.000 unit ([Antara Jogja](https://jogja.antaranews.com/berita/834580/menkop-akui-ada-kendala-lahan-bangun-kopdes-merah-putih-di-perkotaan), [Bisnis](https://ekonomi.bisnis.com/read/20260623/12/1982517/target-kopdes-merah-putih-dipangkas-pemerintah-fokus-pada-kualitas-operasional), baru tingkat judul, perlu dicek ulang). BGN menangguhkan 1.780 dapur MBG pada April 2026 karena IPAL dan SLHS belum memenuhi syarat, dan menetapkan batas 10 Agustus 2026 untuk sertifikat SLHS ([Bisnis](https://ekonomi.bisnis.com/read/20260423/12/1968832/bgn-suspend-1780-dapur-mbg-per-april-2026-ini-biang-keroknya), [Bisnis](https://ekonomi.bisnis.com/read/20260806/12/1994117/bgn-dapur-mbg-tanpa-slhs-per-10-agustus-ditutup-permanen)).
*Catatan:* pemblokiran lokasi yang benar dan pembangunan di tempat absurd adalah **premis satir game**, bukan klaim fakta tentang program tersebut. Pencarian saya tidak menemukan bukti lokasi dapur yang salah tempat atau sengketa lahan pada kasus tertentu.

#### Aturan kepekaan
- **Jangan** menampilkan anak-anak sakit atau korban keracunan. Akibat dapur salah tempat ditampilkan abstrak (bangunan mangkrak, antrean kosong, laporan palsu).
- **Jangan** menampilkan warga atau satwa yang terbakar secara grafis. Dampak kebakaran ditampilkan lewat kabut, peta yang menggelap, dan Amarah Rakyat.
- Humor menyasar **sistem yang membiarkan** (perizinan, mark-up, pembiaran), bukan warga yang terdampak.

### 8.4 Lingkaran permainan
Jalan di peta → pilih petak/lokasi → bakar atau bangun (cepat, salah, menghasilkan Cuan) atau coba cara benar (diblokir) → Cuan masuk → bayar Restu Bos, berkas, kambing hitam → indikator bergerak → peta berubah → Presiden berkunjung → ulangi sampai akhir masa jabatan atau tamat riwayat.

### 8.5 Teknologi (rekomendasi)
| Opsi | Kelebihan | Kekurangan |
|---|---|---|
| **Three.js di web (rekomendasi)** | Jalan di peramban tanpa instalasi, bisa saya uji otomatis di sini, deploy ke Pages tetap sederhana, satu kode dengan prototipe saat ini | Dunia sangat besar perlu pemotongan petak (chunking), model low-poly buatan sendiri |
| **Godot 4** | Editor 3D lengkap, pustaka kendaraan dan fisika, ekspor web | Tidak bisa saya jalankan dan uji penuh di sini, build lebih berat, repo harus kembali memakai Godot |

Lingkup irisan vertikal pertama: satu pulau kecil, jalan kaki/motor, 20 petak hutan, 6 lokasi bangun, sistem Cuan, dan satu pertemuan dengan Bapak Presiden.

### 8.6 Pertanyaan terbuka
1. Judul mana yang dipilih?
2. Three.js atau Godot?
3. Apakah dunia murni fiksi, atau terinspirasi peta nyata (Kalimantan, Jawa) dengan nama samaran?
4. Rating target (semua umur atau 17+)? Ini memengaruhi seberapa gamblang adegan kebakaran dan kabut.

### 8.7 Tokoh utama narsistik dan judul yang memuji diri sendiri

#### Judul memuji diri (pilihan)
| Judul | Catatan |
|---|---|
| **Berkat Saya, Negeri Ini Maju** | Rekomendasi. Pujian diri murni, mudah diingat, cocok jadi hashtag. |
| **Tanpa Saya, Negeri Ini Bubar** | Versi lebih keras dan lebih lucu. |
| **Menteri Paling Merakyat (Menurut Baliho Saya)** | Menyentuh budaya baliho. Agak panjang. |
| **Sang Maestro Pembangunan** | Gelar bombastis, cocok untuk menu utama. |
| **Hebat Banget Saya** | Singkat, kasual, bergaya TikTok. |
| **Dr. (H.C.) Ir. H. Anu, S.E., M.M., Ph.D.: Putra Terbaik Bangsa** | Judul yang gelarnya makin panjang seiring permainan (lihat gelar di bawah). |

Subjudul: *Simulator Menteri Paling Berjasa Sepanjang Masa*.

#### Tokoh: Dr. (H.C.) Ir. H. Bambang Jaya Wijaya Kusuma Perkasa, S.E., M.M. (nama fiktif)
Menteri yang yakin dirinya penyelamat bangsa. **Narsisme adalah sifat tokoh yang menjadi mekanik, bukan sekadar bumbu cerita.**

- **Semua keberhasilan karena saya, semua kegagalan karena "oknum".** Setiap hasil menampilkan dua narasi: monolog batin yang memuji diri dan laporan resmi yang menyalahkan bawahan.
- **Butuh pujian.** Indikator baru **Ego** turun jika tidak diberi pujian, kritik, atau ketika orang lain mendapat sorotan. Ego rendah membuat tokoh uring-uringan: kendali bergetar, dialog ketus, Restu Bos susah naik. Ego tinggi membuat lengah: Panas KPK naik karena ia merasa kebal.
- **Tidak tahan kritik.** Kritik (warga, wartawan, staf jujur) bukan menurunkan Ego sendiri, melainkan memicu mode **Ngambek**: aksi baik terblokir sementara.
- **Cermin dan selfie.** Tombol selfie di setiap lokasi. Foto selfie di tempat yang tampak "berhasil" menambah Viralitas dan Restu; selfie di tempat kerja sungguhan tidak menghasilkan apa-apa.
- **Baliho.** Setiap bangunan dan kebun menambah baliho berwajah tokoh di peta, makin lama makin besar dan lebih banyak daripada bangunan sungguhan.
- **Gelar bertambah.** Beli gelar kehormatan dan penghargaan dari "lembaga" abal-abal dengan Cuan. Nama di layar bertambah panjang hingga tidak muat. Gelar menaikkan Ego dan Kinerja Resmi, tidak menaikkan kemampuan.
- **Pencitraan sebagai mata uang kedua.** Cuan membeli barang; **Citra** membeli perhatian. Citra didapat dari baliho, selfie, peresmian, dan penghargaan, dihabiskan untuk meredam Viralitas buruk.

#### Monolog batin (contoh, fiktif)
- "Sekali lagi, keputusan yang jenius. Sayang tidak ada yang mencatat."
- "Kalau jembatan ini runtuh, itu pasti ulah oknum. Kalau berdiri, itu saya."
- "Rakyat butuh pemimpin seperti saya. Saya juga butuh rakyat, untuk difoto."
- "Gelar saya memang panjang. Prestasi saya lebih panjang."

#### Hubungan dengan Bapak Presiden
Bapak Presiden tetap sumber Restu Bos. Tokoh utama menjilat ke atas dan memuji diri ke samping. Ketika Presiden memuji menteri lain, Ego anjlok dan tokoh mulai merencanakan sabotase kecil.

#### Batas satir
Narsisme di sini adalah **tipe karakter** (pejabat yang haus pencitraan), bukan potret orang nyata. Nama, gelar, dan monolog sepenuhnya rekaan. Jangan memakai gelar atau ciri yang khas milik pejabat tertentu.

---

## 9. Judul final: REPUBLIK EMAS (anti stunting)

**Keputusan:** judul game adalah **Republik Emas (anti stunting)**.

### Mengapa judul ini bekerja
- **Memuji diri sendiri.** "Republik Emas" adalah cap dagang si menteri narsistik: semua programnya ia beri embel-embel "Emas" (Gerakan Emas, Dapur Emas, Koperasi Emas). Plesetan dari jargon visi "Indonesia Emas 2045".
- **"(anti stunting)" sebagai stiker.** Seperti tagline yang ditempel di baliho. Keterangan dalam kurung itu sendiri adalah lelucon: semakin besar tulisannya di baliho, semakin kecil dana yang sampai.
- **Kontras judul dan kenyataan.** Tampilan emas dan megah, indikator yang disembunyikan justru angka stunting nyata.
- **Aman secara hukum.** Tidak memakai lambang negara, semboyan, bendera, atau nama orang.

### Dasar riset
- Prevalensi stunting nasional turun dari 21,5% (2023) menjadi 19,8% (2024) menurut SSGI 2024; target 14,2% pada 2029 ([Kemenkes](https://www.badankebijakan.kemkes.go.id/en/ssgi-2024-prevalensi-stunting-nasional-turun-menjadi-198/), [Kontan](https://nasional.kontan.co.id/news/pemerintah-targetkan-prevalensi-stunting-turun-jadi-142-di-2029)). Data terbaru (SSGI 2025) belum saya cek.
- Contoh yang dipakai Presiden Jokowi pada Juni 2023: anggaran stunting Rp10 miliar di satu daerah, hanya sekitar Rp2 miliar untuk telur, susu, dan sayuran; sisanya perjalanan dinas, rapat, dan program tidak konkret. Beberapa media melaporkan rincian yang berbeda ([Tirto](https://tirto.id/jokowi-kesal-dana-stunting-rp6-m-untuk-perjalanan-dinas-rapat-gLN7), [Bisnis](https://ekonomi.bisnis.com/read/20230816/9/1685576/puan-soroti-anggaran-stunting-rp8-miliar-habis-dipakai-dinas-dan-rapat)). Pencarian saya tidak menemukan temuan audit BPK khusus topik ini, hanya pengawasan BPKP.
- Jangan menyimpulkan bahwa satu contoh daerah berlaku di mana-mana. Dalam game, ini pola yang disindir, bukan klaim tentang daerah tertentu.

### Mekanik stunting (sudah ada di prototipe)
- **Stunting nyata** naik jika kebocoran anggaran tinggi dan turun jika dana sampai ke lapangan. Ditampilkan sebagai persentase abstrak, tanpa gambar anak.
- **Stunting (laporan)** selalu "turun", mengikuti Kinerja Resmi. Layar akhir menampilkan keduanya berdampingan.
- **Aksi "Rakor Percepatan Penurunan Stunting di hotel berbintang":** Restu Bos dan Kinerja naik, stunting nyata sedikit naik.
- **Aksi "Belikan telur dan gizi langsung ke sasaran":** stunting nyata turun, tetapi Restu Bos dan Kinerja Resmi turun. Tidak ada baliho, tidak ada foto.

### Aturan kepekaan
Stunting menyangkut anak-anak nyata. Jangan menampilkan, mengejek, atau menjadikan anak sebagai lelucon. Sasaran satir hanya **pejabat, rapat, dan cara anggaran menguap**, dan hasilnya selalu angka abstrak.

---

## 10. Status irisan 3D (Three.js)

Keputusan: **Three.js**, **peta fiksi**. Irisan vertikal pertama ada di `web/` (`index.html`, `js/main.js`, `js/teks.js`, `css/game.css`, `vendor/three.module.js`).

**Sudah ada:** pulau fiksi dengan 20 petak hutan, dua desa, sungai, sawah, TPA, dan Kantor Dinas; tokoh narsistik dengan kamera orang ketiga; bakar/tebang/tanam sawit dengan api yang merambat dan kabut yang menebal; dapur MBG dan Kopdes dengan pemblokiran lokasi benar (dekat desa) dan persetujuan lokasi absurd, bangunan yang menjadi mangkrak setelah 45 detik; baliho berwajah di setiap bangunan; selfie, konferensi pers (Citra), berkas, kambing hitam, gelar kehormatan; setoran bulanan ke Bos; stunting nyata vs laporan; layar akhir "Laporan Resmi vs Kenyataan".

**Hasil simulasi bot (perkiraan kasar):** bermain jujur kalah (direshuffle sekitar bulan 5); membakar tanpa berkas membuat KPK datang sekitar bulan 3; strategi campuran (berkas, selfie, konferensi pers, kambing hitam) umumnya selamat sampai bulan 12 atau jatuh karena Amarah Rakyat. Bot lebih efisien dari manusia, jadi keseimbangan sebenarnya perlu uji pemain.

**Belum ada:** kendaraan (motor ojol, mobil dinas dengan sirene), kontrol sentuh untuk ponsel, suara, NPC, kunjungan Presiden, Ego dan mode Ngambek, Reshuffle, level kabur, dan ending rahasia.

**Asumsi rating:** tampilan bergaya low-poly tanpa gambar korban; kebakaran hanya berupa api kerucut, kabut, dan peta yang menggelap. Rating target belum diputuskan.

---

## 11. Pembaruan berdasarkan uji coba pertama

Masukan pemain: (1) buat tanpa akhir dan lebih santai, (2) perbaiki peta, terrain, bangunan, hutan, (3) cara bertani tidak jelas dan Cuan habis sehingga tidak bisa membakar.

**Akar masalah 3:** setoran bulan pertama (200) tepat menghabiskan modal awal (200), jadi pemain terjebak tanpa Cuan.

**Perbaikan:**
- **Tanpa modal lewat palak UMKM.** Pemain mulai dengan 20 Cuan dan bisa menarik "pajak" dari kios UMKM. Peluang berhasil bergantung pada pemilik (ramah 85%, biasa 60%, galak 30%). Menyewa aparat membuat 100% berhasil, dengan biaya sewa dan potongan 25%. Kegagalan membuat pemain dipermalukan (Cuan, Citra, Restu turun, Amarah Rakyat naik). Kios yang dipajaki tiga kali gulung tikar selama 120 detik, dan jumlahnya muncul di laporan "Kenyataan".
- **Bakar gratis.** Tanam sawit 40 Cuan. Tidak pernah macet: setoran menyisakan minimal 20 Cuan.
- **Misi berpenanda.** Panel misi dengan pilar cahaya kuning di dunia dan tombol relevan yang berkedip.
- **Mode santai tanpa akhir.** Tidak ada game over. Kegagalan menjadi kartu denda. Laporan Tahunan tiap 12 bulan. Setoran = nilai dasar + 25% penghasilan bulanan, sehingga bisnis yang makin besar tetap ditagih.
- **Pengeluaran jangka panjang:** pupuk (5 level), oknum otomatis (4), gelar kehormatan (7), aparat sewaan.
- **Hutan tumbuh kembali** pada lahan yang dibiarkan 150 detik, supaya pertanian bisa terus berjalan.

**Peta baru:** terrain berbukit prosedural dengan warna per ketinggian, sungai berkelok dan jembatan, jalan tanah, tiga zona hutan (tajuk bulat dan kerucut, ratusan pohon dekoratif, batu), dua desa dengan tiga jenis rumah, balai desa, lumbung, palem, tiang listrik, sawah bertekstur, TPA, Kantor Dinas bertiang, 14 kios UMKM dengan label pemilik, bangunan MBG dan Kopdes yang lebih detail, awan, dan perahu. Tanah di petak berubah warna: gelap saat terbakar, cokelat saat dibuka, hijau muda saat ditanami.

**Satir dan kepekaan.** Dalam mekanik palak, pemain adalah pihak yang salah dan akibatnya ditampilkan (Amarah Rakyat naik, kios gulung tikar, laporan "Kenyataan" mencatat UMKM yang bangkrut). Pemilik kios tidak diejek; yang diejek adalah nama-nama "pajak" yang absurd dan aparat sewaan. "Aparat" dibuat generik dan fiktif, tanpa lambang instansi nyata. Pungli adalah masalah terdokumentasi (lihat bagian riset: Ombudsman RI mencatat ribuan aduan pungli per tahun).

---

## 12. Perbaikan tampilan dari uji coba kedua

Masukan: terlalu banyak tiang kosong, bangunan bertumpuk, tokoh sebaiknya berbaju krem tanpa medali besar, dan proporsi tokoh utama dengan UMKM tidak seimbang (UMKM terlalu kecil).

- **Tiang kosong dihapus:** tiang listrik tanpa kabel di sepanjang jalan dan patok kecil di sudut sawah dibuang.
- **Tidak ada tumpang tindih:** modul `web/js/tata.js` menjaga "jejak" lingkaran untuk semua benda tetap. Desa (rumah, balai, lumbung, palem) disusun otomatis dengan pengecekan tabrakan dan menjauhi jalan. Pengecekan menemukan tiga kios yang bertumpuk (dengan Kantor Dinas, dengan TPA, dan di dalam petak hutan) dan ketiganya digeser. Saat pemain membangun: lokasi yang sudah dipakai ditolak ("Geser sedikit"), petak yang masih hutan atau sawit ditolak ("Bakar atau tebang dulu, baru bangun"), pohon dan batu di sekitar bangunan disingkirkan, dan baliho dicarikan tempat kosong.
- **Baju krem, tanpa medali:** jaket safari krem, medali emas dihapus.
- **Proporsi:** akar masalahnya pemilik kios berskala 0,55 sedangkan tokoh utama 1,0. Semua manusia kini berskala sama (0,5), kios dan rumah diperbesar 1,3 kali, kecepatan dan kamera disesuaikan dengan tokoh yang lebih kecil. Teks papan kini mengecil otomatis agar muat.

---

## 13. Perbaikan dari uji coba ketiga

1. **Bug sewa aparat saat berjalan.** Penyebab: tombol `A` dipakai untuk dua hal (jalan ke kiri dan sewa aparat), sehingga setiap berjalan ke kiri pemain tanpa sadar menyewa aparat dan kehilangan 120 Cuan. Sewa aparat dipindah ke tombol `V`. Pengujian: menahan `A` dan `D` tidak lagi mengurangi Cuan.
2. **Penanda misi hilang saat sampai.** Penanda kini terdiri dari balok cahaya (hanya saat jauh), cincin di tanah, dan panah melayang yang selalu terlihat, dan tidak lagi bergantung pada pencarian target yang bisa kosong (ada cadangan target terakhir).
3. **Baju krem.** Warna jaket dibuat krem terang dengan cahaya tambahan supaya tidak tampak kecokelatan. Alur deploy kini menambahkan `?v=<commit>` pada semua berkas JS dan CSS supaya peramban tidak memakai versi lama dari cache. Ini kemungkinan alasan baju lama masih terlihat.
4. **Petunjuk misi lebih mencolok.** Kartu misi besar dengan nomor langkah, berkedip saat berganti langkah, dan panah kompas di layar dengan jarak ke tujuan.
5. **Petunjuk tombol lebih jelas.** Nama tombol ditampilkan sebagai keycap sesuai perangkat (ponsel: nama tombol; komputer: huruf). Tombol yang belum relevan diredupkan, tombol yang harus ditekan berkedip dengan gelembung "Ketuk ...", dan sorotan hanya muncul saat aksinya benar-benar bisa dilakukan.
