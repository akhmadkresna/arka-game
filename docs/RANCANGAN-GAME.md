# REPUBLIK +62: Menteri Mangkrak — Rancangan Game

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

**Rekomendasi:** judul **WANI PIRO? NUSANTARA**, subjudul *Simulator Menteri Asal Bapak Senang*.

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
