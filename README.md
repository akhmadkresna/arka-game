# REPUBLIK +62: Menteri Mangkrak

Game satir bergaya *hardcore* tentang birokrasi yang salah arah. Anda menjadi menteri baru. Sistem menilai Anda dari hal yang keliru, jadi **melakukan hal yang benar justru membuat Anda gagal**.

Semua tokoh dan lembaga dalam game ini fiktif. Kemiripan hanyalah kebetulan yang sangat sistemik.

## Cara main

Buka `web/index.html` di peramban (tanpa build, tanpa instalasi). Atau jalankan server lokal:

```sh
python3 -m http.server 8000 --directory web
```

- Masa jabatan: 12 bulan, 2 keputusan per bulan.
- Misi resmi: serapan anggaran minimal 80% dan Restu Bos tetap terjaga.
- Teks resmi di kartu keputusan menyesatkan. Kenyataan baru terlihat setelah memilih.
- Kalah jika: Restu Bos habis (direshuffle), Panas KPK 100, Amarah Rakyat 100, atau kas kosong sebelum proyek jadi.

## Mekanik utama

- **Anggaran bocor:** uang melewati banyak tingkat, masing-masing mengambil potongan. Hanya sebagian yang sampai ke lapangan.
- **Restu Bos vs kenyataan:** jujur dan hemat menurunkan Restu Bos. Boros dan "rapi" menaikkannya.
- **Berkas:** pelanggaran yang rapi aman. Pelanggaran ceroboh menaikkan Panas KPK.
- **Viralitas:** masalah baru ditangani ketika viral. Viral tinggi memicu konferensi pers dadakan.
- **Tidak ada cadangan data?** Ransomware menanti.

Rancangan lengkap, riset, dan karakter ada di [`docs/RANCANGAN-GAME.md`](docs/RANCANGAN-GAME.md).

## Struktur

```
web/        game (HTML, CSS, JS murni)
docs/       riset dan rancangan
.github/    penerbitan otomatis ke GitHub Pages
```

Game balita sebelumnya tersimpan di tag `arsip-game-balita`.

## Lisensi

Lihat [LICENSE](LICENSE).
