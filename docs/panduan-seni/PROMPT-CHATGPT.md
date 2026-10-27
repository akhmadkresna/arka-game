# Prompt sederhana untuk ChatGPT (gambar latar menu utama)

**Langkah:** 1) unggah `bingkai-sederhana.png`, 2) tempel prompt di bawah, 3) kirim. Hasilnya berukuran 3:2 (sekitar 1536×1024). Game memakai `cover`, jadi aman dipakai apa adanya.

## Prompt (tempel apa adanya, dengan bingkai diunggah)
```
Create a wide landscape (3:2) background illustration for a game main menu. Use the attached image ONLY as a layout guide: do not draw its boxes, lines or text.

Style: stylized low-poly 3D diorama, golden hour, hazy brown smog sky.

Scene: a smug, stocky middle-aged Indonesian minister in a bright cream safari suit and a black peci hat, hands on hips, standing on a green hill. Put him inside the CHARACTER box. He is a generic caricature, not a real person, with no medals or badges. Behind him, a tropical island: rows of oil palm trees, the edge of a forest burning with thin smoke, a half-built golden building with bamboo scaffolding, giant billboards showing his own caricature face (leave the billboard text blank), a black official car with red and blue sirens, a green delivery motorbike on a dirt road, and a river with a wooden bridge.

Layout: keep the LOGO SPACE box as empty hazy sky. Keep the right side calm, darker and low-detail, because menu buttons will sit there. Keep everything important inside the dashed yellow safe area (the top and bottom may be cropped).

No text, letters, logos, flags, national emblems, or children.
Palette: gold, cream, dark brown, brick red, hazy sky blue.
```

## Versi tanpa mengunggah bingkai
```
Create a wide landscape (3:2) background illustration for a game main menu. Stylized low-poly 3D diorama, golden hour, hazy brown smog sky. A smug, stocky middle-aged Indonesian minister in a bright cream safari suit and black peci hat, hands on hips, standing on a green hill at the left-center of the image (generic caricature, not a real person, no medals). Behind him a tropical island with oil palm rows, a burning forest edge with thin smoke, a half-built golden building with bamboo scaffolding, giant billboards with his caricature face (blank text), a black official car with red and blue sirens, a green delivery motorbike, a river with a wooden bridge. Leave the top-left as empty hazy sky for a logo, and keep the right third calm, darker and low-detail for menu buttons. Keep all important elements in the central horizontal band. No text, letters, logos, flags, national emblems, or children.
```

## Perbaikan cepat (kirim sebagai balasan berikutnya)
- `Make the right side darker and calmer, with fewer details.`
- `Remove all text and letters from the image.`
- `Make his suit a lighter cream and remove any medals or badges.`
- `Move the character a bit to the left and make him smaller so his whole body fits.`
- `Make the sky emptier in the top-left corner.`
- `Redo this with a more painterly storybook style.`

## Setelah gambar jadi
1. Simpan sebagai `web/img/menu.jpg` (usahakan di bawah 500 KB).
2. Di `web/img/menu.json`, ubah `"berkas": null` menjadi `"berkas": "menu.jpg"`.
3. Muat ulang. Judul besar muncul di kiri atas dan kartu menu di kanan.

Prompt dan bingkai versi lengkap ada di `PROMPT-GAMBAR.md`.
