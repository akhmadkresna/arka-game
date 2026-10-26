# REPUBLIK EMAS (anti stunting)

Game satir bergaya *hardcore* tentang menteri narsistik yang berjanji menciptakan generasi emas sambil anggarannya menguap. Anda menjadi menteri baru. Sistem menilai Anda dari hal yang keliru, jadi **melakukan hal yang benar justru membuat Anda gagal**.

Semua tokoh dan lembaga dalam game ini fiktif. Kemiripan hanyalah kebetulan yang sangat sistemik.

## Cara main

Game dunia terbuka 3D santai tanpa akhir (Three.js, tanpa build). Karena memakai modul ES, jalankan lewat server lokal:

```sh
python3 -m http.server 8000 --directory web
# buka http://localhost:8000
```

Di ponsel: joystick kiri bawah, tombol aksi kanan bawah, geser jari untuk memutar kamera, cubit untuk zoom. Mode lanskap disarankan.
Di komputer: WASD/panah jalan, Shift lari, seret mouse memutar kamera, roda mouse zoom.

**Tanpa modal? Mulai dari sini:**
1. **Palak UMKM** (`X`): tarik "pajak" dari kios berpapan nama. Pemilik ramah (85%), biasa (60%), atau galak (30%) menentukan peluang berhasil. **Sewa aparat** (`A`, 120 Cuan, 60 detik) menjamin 100% berhasil, tapi 25% hasilnya untuk aparat dan Amarah Rakyat naik. Kios yang dipajaki tiga kali gulung tikar.
2. **Bakar hutan** (`B`, gratis) lalu **tanam sawit** (`P`, 40 Cuan). Sawit menghasilkan Cuan sendiri.
3. **Bangun dapur MBG** (`1`) atau **Kopdes** (`2`). Dekat desa diblokir birokrasi; di tempat absurd langsung disetujui, lalu mangkrak.
4. Belanjakan Cuan: **Pupuk** (`U`), **Oknum** otomatis (`O`), **Gelar** (`G`), berkas (`E`) dan kambing hitam (`K`) di Kantor Dinas, selfie (`F`) dan konferensi pers (`C`).

Tiap akhir bulan Bos menagih **setoran**. Tidak ada game over: kegagalan (direshuffle, dipanggil KPK, demo besar) hanya berupa denda. Tiap 12 bulan muncul **Laporan Tahunan** yang membandingkan versi resmi dengan kenyataan (`R` untuk melihatnya kapan saja).

Versi giliran (prototipe awal) masih ada di `web/giliran/index.html`.

Rancangan lengkap, riset, dan karakter ada di [`docs/RANCANGAN-GAME.md`](docs/RANCANGAN-GAME.md).

## Struktur

```
web/        game 3D (index.html, js/, css/, vendor/three)
web/giliran prototipe giliran (HTML murni)
docs/       riset dan rancangan
.github/    penerbitan otomatis ke GitHub Pages
```

Game balita sebelumnya tersimpan di branch `arsip-game-balita`.

## Lisensi

Lihat [LICENSE](LICENSE).
