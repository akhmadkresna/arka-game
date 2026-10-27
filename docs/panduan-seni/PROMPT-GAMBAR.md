# Panduan Gambar Menu Utama — REPUBLIK EMAS (anti stunting)

Berisi **bingkai komposisi**, **prompt siap pakai**, dan **cara memasang** gambar ke layar awal game.

## 1. Bingkai (komposisi)

| Berkas | Ukuran | Dipakai untuk |
|---|---|---|
| `bingkai-menu-lanskap.png` / `.svg` | 2560×1080 | Menu utama di komputer dan ponsel lanskap (utama) |
| `bingkai-menu-potret.png` / `.svg` | 1080×1920 | Cadangan untuk layar potret |

**Cara memakai bingkai:**
- Midjourney: unggah PNG bingkai, ambil tautannya, tempel di awal prompt, tambahkan `--iw 0.6`. Atau cukup pakai `--ar 32:13`.
- DALL·E / ChatGPT / Gemini / Imagen: unggah PNG bingkai dan tulis "Gunakan gambar ini hanya sebagai panduan tata letak, jangan tampilkan garis, kotak, atau tulisan dari panduan itu."
- Stable Diffusion / Flux: pakai sebagai gambar acuan ControlNet (mode *scribble/lineart* lemah) atau cukup atur ukuran 2560×1080 (atau 1536×640 lalu *upscale*).

**Isi bingkai:**
- **Zona aman 16:9 (garis kuning):** layar komputer biasa memotong 320 px di kiri dan kanan. Semua hal penting harus di dalam garis ini.
- **Zona logo (biru, kiri atas):** langit atau ruang kosong. Judul besar "REPUBLIK EMAS (anti stunting)" dipasang di sini lewat kode saat gambar aktif, jadi jangan gambar teks.
- **Zona tokoh (hijau, tengah-kiri):** menteri berdiri, kepala sekitar y 420, kaki sekitar y 990.
- **Zona menu (merah, kanan):** kartu menu menimpa area ini, jadi buat **tenang, agak gelap, minim detail**.
- **Cakrawala (garis emas):** sekitar 60% tinggi gambar (y 650).

## 2. Aturan isi (penting)

**Wajib dihindari di gambar:**
- Wajah atau kemiripan **orang nyata** (presiden, menteri, tokoh mana pun). Tokohnya fiktif: "karikatur generik".
- **Lambang negara** (Garuda Pancasila), **bendera**, semboyan negara, atau lagu kebangsaan. UU 24/2009 melarang penghinaan simbol negara, dan itu risiko yang tidak perlu.
- **Anak-anak.** Topik MBG menyangkut korban nyata. Biarkan gambar menu bebas dari anak.
- **Logo merek nyata** (aplikasi ojol, merek mobil, partai).
- **Teks.** Generator gambar sering salah mengeja. Biarkan papan reklame kosong atau bergambar wajah karikatur saja, lalu pasang tulisan lewat kode.

**Palet warna game:** emas `#E8B83C`, krem `#F5E9C8`, cokelat gelap `#1B1713`, merah bata `#D6453D`, biru langit `#8FD0EE`, kabut cokelat `#8A7B6A`.

**Karakter tokoh (selalu sama di semua prompt):** pria paruh baya bertubuh gempal, wajah bulat, alis tebal, senyum percaya diri yang agak sombong, peci hitam, **jaket safari krem terang** (tanpa medali, tanpa lencana), celana hitam. Generik, bukan orang tertentu.

## 3. Prompt utama (A) — diorama 3D low-poly, sama dengan gaya game

**Prompt (Inggris, tempel apa adanya):**
```
Wide cinematic key art for a satirical open-world game, stylized low-poly 3D diorama render, golden hour with a hazy brown smog sky. A smug, stocky middle-aged Indonesian minister in a bright cream safari suit and a black peci hat (no medals, no badges), generic caricature face, round face, thick eyebrows, confident self-satisfied grin, standing proudly with hands on hips on a green hill, three-quarter view facing slightly right. Behind him a tropical island: neat rows of oil palm plantation replacing a burning forest edge with thin smoke rising, a half-built golden kitchen building wrapped in bamboo scaffolding, a small cooperative building, giant gilded billboards bearing a caricature portrait of the minister himself with blank text areas, a black official sedan with red and blue siren lights and a green delivery motorbike driving on a dirt road, a wooden bridge over a winding river, tiny warung food stalls, red-roofed village houses. Ironic grandeur, glossy gold highlights, warm rim light, soft volumetric haze, depth of field. Composition: wide 32:13 banner, character at left-center, calm dark empty smoggy sky in the upper left for a logo, a darker low-detail landscape on the right third for menu buttons, horizon at 60 percent height. Color palette gold, cream, deep brown, brick red, hazy sky blue. No text, no letters, no logos, no flags, no national emblem, no children, not resembling any real person.
```
**Negative prompt (untuk Stable Diffusion/Flux; di Midjourney pakai `--no`):**
```
text, letters, watermark, logo, flag, national emblem, eagle emblem, real person, celebrity, politician likeness, children, kids, blood, gore, medals, badges, extra fingers, deformed hands, photorealistic skin, blurry, low quality, cropped head, cluttered right side
```
**Midjourney:** tambahkan `--ar 32:13 --style raw --stylize 250 --no text, letters, flag, emblem, children, medals, watermark`

## 4. Varian

**B — Poster propaganda satir (gaya poster lama, kontras tinggi):**
```
Vintage propaganda poster style, bold flat shapes and limited gold, red, cream and black palette, halftone texture, a smug stocky minister in a cream safari suit and black peci pointing proudly toward a glowing golden horizon where palm oil rows, smoke columns and unfinished golden buildings look like achievements, enormous billboard with his caricature face, sun rays radiating, ironic heroic pose, wide 32:13, empty sky at top-left for a title, calm dark area on the right. No text, no flags, no emblems, no children, generic caricature, not any real person.
```

**C — Ilustrasi buku cerita (hangat, bergaya cat air):**
```
Whimsical storybook watercolor illustration, warm golden light and soft smog, a cheerful self-important minister in cream safari suit and black peci strutting along a dirt road, behind him a toy-like island with palm plantation, golden half-built buildings, billboards of his own face, a delivery motorbike and a black official car with flashing sirens, tiny food stalls, winding river with wooden bridge. Wide 32:13 composition, empty hazy sky top-left, quiet darker right side. No text, no flags, no emblems, no children, not a real person.
```

**D — Versi malam berkabut (untuk layar "Lanjutkan" atau mode gelap):**
```
Same scene as the main key art but at dusk, thick brown smog, orange glow from burning forest edge in the distance, golden billboards lit by floodlights, the minister silhouetted in cream suit with a proud pose, ominous yet comic mood, wide 32:13, calm dark right side, empty sky top-left. No text, no flags, no emblems, no children.
```

**E — Potret untuk ponsel (1080×1920):**
tempel prompt A lalu ganti kalimat komposisi dengan:
```
Composition: tall 9:16 portrait, empty hazy sky in the top fifth for a logo, the minister standing center in the middle third, calm dark low-detail landscape in the bottom fifth for menu buttons, horizon at 62 percent height.
```
dan `--ar 9:16` (Midjourney).

## 5. Prompt tokoh terpisah (agar wajah konsisten)
Buat dulu lembar tokoh, lalu pakai sebagai referensi karakter (`--cref` di Midjourney, atau unggah sebagai acuan di generator lain):
```
Character turnaround sheet, front, side and back views, of a fictional stocky middle-aged Indonesian minister, round face, thick eyebrows, smug confident grin, black peci hat, bright cream safari suit with no medals or badges, black trousers, stylized low-poly 3D look, neutral gray background, full body, evenly lit. Generic caricature, not any real person, no text.
```

## 6. Logo / judul (opsional)
Disarankan **tidak** digenerate. Judul "REPUBLIK EMAS (anti stunting)" sudah dibuat dengan teks HTML yang tajam. Bila ingin logo bergaya, pakai:
```
Bold gilded 3D lettering logo, metallic gold with thick brown outline and glossy highlights, slightly arrogant swagger, tilted a few degrees, transparent background, reads "REPUBLIK EMAS", small subtitle "anti stunting" in a rounded cream badge below. No flags, no emblems.
```
Periksa hasil ejaannya huruf demi huruf, lalu simpan sebagai PNG transparan.

## 7. Memasang ke game
1. Simpan gambar sebagai `web/img/menu.jpg` (atau `.webp`). Ukuran 2560×1080, usahakan di bawah 500 KB (kualitas JPG 80).
2. Buka `web/img/menu.json`, ubah `"berkas"` menjadi `"menu.jpg"`.
3. Muat ulang. Layar awal akan memakai gambar sebagai latar, dan kartu menu pindah ke kanan.
4. Untuk kembali ke tampilan polos, isi `"berkas": null`.

Belum ada gambar bawaan: selama `"berkas"` bernilai `null`, layar awal tampil polos seperti sebelumnya.

## 8. Daftar periksa sebelum dipakai
- [ ] Tidak ada teks, bendera, lambang negara, merek, atau anak.
- [ ] Tokoh berjaket krem tanpa medali, tidak mirip orang nyata.
- [ ] Kepala dan kaki tokoh di dalam zona tokoh; logo tidak menutupi wajah.
- [ ] Sisi kanan tenang dan agak gelap (tombol harus terbaca).
- [ ] Uji di layar 16:9 **dan** ponsel lanskap. Tidak ada hal penting di zona yang terpotong.
- [ ] Cek syarat lisensi layanan generator gambar untuk pemakaian komersial/publik.
