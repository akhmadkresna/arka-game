# REPUBLIK EMAS (anti stunting)

Game satir bergaya *hardcore* tentang menteri narsistik yang berjanji menciptakan generasi emas sambil anggarannya menguap. Anda menjadi menteri baru. Sistem menilai Anda dari hal yang keliru, jadi **melakukan hal yang benar justru membuat Anda gagal**.

Semua tokoh dan lembaga dalam game ini fiktif. Kemiripan hanyalah kebetulan yang sangat sistemik.

## Cara main

Game dunia terbuka 3D (Three.js, tanpa build). Karena memakai modul ES, jalankan lewat server lokal:

```sh
python3 -m http.server 8000 --directory web
# buka http://localhost:8000
```

**Kontrol:** WASD/panah jalan, Shift lari, seret mouse memutar kamera, roda mouse zoom.
**Aksi:** `B` bakar petak hutan, `T` tebang, `P` tanam sawit, `1` dapur MBG, `2` Kopdes, `F` selfie, `C` konferensi pers, `G` beli gelar, `E`/`K` berkas dan kambing hitam di Kantor Dinas.

- Masa jabatan 12 bulan (30 detik per bulan). Tiap akhir bulan Bos menagih **setoran** yang terus naik.
- **Tani cuan:** bakar hutan lalu tanam sawit, atau bangun dapur MBG dan Kopdes. Membangun dekat desa **diblokir** birokrasi; membangun di tempat absurd (tepi sungai, tengah sawah, samping TPA) langsung disetujui, lalu mangkrak.
- Berkas menurunkan Panas KPK saat membakar. Asap menaikkan Amarah Rakyat. Stunting nyata naik, laporan resmi selalu "turun".
- Kalah jika Restu Bos habis, Panas KPK 100, atau Amarah Rakyat 100. Bermain jujur membuat Anda direshuffle sekitar bulan 5.

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
