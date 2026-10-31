# REPUBLIK EMAS (anti gizi buruk)

Game satir bergaya *hardcore* tentang menteri narsistik yang berjanji menciptakan generasi emas sambil anggarannya menguap. Anda menjadi menteri baru. Sistem menilai Anda dari hal yang keliru, jadi **melakukan hal yang benar justru membuat Anda gagal**.

Semua tokoh, lembaga, program, dan tempat dalam game ini fiktif. Kemiripan dengan kenyataan hanyalah kebetulan yang sangat sistemik.

## Cara main

Game dunia terbuka 3D santai tanpa akhir (Three.js, tanpa build). Karena memakai modul ES, jalankan lewat server lokal:

```sh
python3 -m http.server 8000 --directory web
# buka http://localhost:8000
```

Di ponsel: joystick kiri bawah, tombol aksi kanan bawah, geser jari untuk memutar kamera, cubit untuk zoom. Mode lanskap disarankan.
Di komputer: WASD/panah jalan, Shift lari, seret mouse memutar kamera, roda mouse zoom.

**Tanpa modal? Mulai dari sini:**
1. **Palak usaha kecil** (`X`): tarik "pajak" dari kios berpapan nama **atau dari ojol yang hilir-mudik di jalan** (mereka berhenti saat Anda dekat; dipalak berkali-kali, mereka mogok). Pemilik ramah (85%), biasa (60%), atau galak (30%) menentukan peluang berhasil. **Sewa aparat** (`V`, 120 Cuan, 60 detik) menjamin 100% berhasil, tapi 25% hasilnya untuk aparat dan Amarah Rakyat naik. Kios yang dipajaki tiga kali gulung tikar.
2. **Bakar hutan** (`B`, gratis) lalu **tanam sawit** (`P`, 40 Cuan). Sawit menghasilkan Cuan sendiri.
3. **Bangun dapur makan gratis** (`1`) atau **koperasi** (`2`). Dekat desa diblokir birokrasi; di tempat absurd langsung disetujui, lalu mangkrak.
4. Belanjakan Cuan: **Pupuk** (`U`), **Oknum** otomatis (`O`), **Gelar** (`G`), berkas (`E`) dan kambing hitam (`K`) di Kantor Kementerian, selfie (`F`) dan konferensi pers (`C`).

Setiap interaksi punya efek visual dan suara: uang beterbangan ke kantong (atau keluar saat membayar), angka perubahan melayang, percikan api, serpihan kayu, konfeti, getar kamera. Tombol **Suara** dan **Musik** di pojok kanan atas mematikan efek suara dan musik latar secara terpisah.

**Kendaraan:** motor ada dekat titik mulai, mobil dinas (bersirene) dekat Kantor Kementerian. Naik dengan `N`, kemudikan dengan W/A/S/D atau joystick. Kendaraan menabrak bangunan dan baliho, berhenti di tepi air, dan motor bisa melompat.

**Simpan:** progres tersimpan otomatis di peramban (tiap 20 detik dan saat tab ditutup), plus tombol **Simpan**. Di layar judul pilih **Lanjutkan** atau **Mulai baru**. Simpanan hanya ada di peramban dan perangkat yang sama.

Tiap akhir bulan Bos menagih **setoran**. Tidak ada game over: kegagalan (dirotasi, dipanggil lembaga antikorupsi, demo besar) hanya berupa denda. Tiap 12 bulan muncul **Laporan Tahunan** yang membandingkan versi resmi dengan kenyataan (`R` untuk melihatnya kapan saja).

**Musik latar** orisinal, disintesis di peramban (kendang, bass, gong, saron, melodi suling) tanpa berkas audio. Tempo naik saat mengendarai kendaraan dan warna bunyi menjadi pengap saat kabut tebal. Untuk memakai berkas musik milik sendiri, letakkan di `web/audio/` dan isi `web/audio/bgm.json` (lihat berkas itu). Pastikan Anda berhak menyebarkannya karena situs ini publik.

**Dapur makan gratis dan kejadian keracunan:** dapur ini berstaf (juru masak), punya label sertifikat higiene, dan mengirim pengantar makan siang bermotor ke sekolah terdekat. Dapur tanpa berkas "sertifikat higiene di atas kertas" (1 berkas terpakai saat membangun) lebih rawan, apalagi di dekat sungai atau tempat pembuangan. Jika terjadi kejadian, ambulans bersirene meluncur ke dapur, mengangkut siswa ke klinik, dan wartawan datang. Dapur ditutup sementara dan jumlah siswa yang dirujuk tercatat. Di dunia ada dua sekolah (murid bermain, guru berjaga), klinik, dan tiga ambulans.

**Gambar menu utama:** dipasang lewat `web/img/menu.json` (`berkas` untuk layar lebar, `berkasPotret` untuk layar tegak; isi `null` untuk tampilan polos).

Ringkasan rancangan ada di [`docs/RANCANGAN-GAME.md`](docs/RANCANGAN-GAME.md).

## Struktur

```
web/        game 3D (index.html, js/, css/, vendor/three)
docs/       riset dan rancangan
.github/    penerbitan otomatis ke GitHub Pages
```

Game balita sebelumnya tersimpan di branch `arsip-game-balita`.

## Lisensi

Lihat [LICENSE](LICENSE).
