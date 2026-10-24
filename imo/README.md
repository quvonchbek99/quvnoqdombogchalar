# IMO kunlik postlar (@kuvonch_academy)

Har kuni bitta IMO masalasi + yechimi, Instagram carousel (1080×1350) ko'rinishida.

- `posts/<yil>-<raqam>.json` — post matni (slaydlar)
- `img/<yil>-<raqam>/1.jpg …` — tayyor rasmlar (`python3 imo/render.py imo/posts/<id>.json`)
- `holat.txt` — oxirgi tayyorlangan masala (masalan `2026-1`)

Tartib: IMO 2026 (1→6), so'ng IMO 2025 (1→6), IMO 2024 … orqaga qarab.
Har post Metricool'da **qoralama** bo'lib turadi — muallif tasdiqlab joylaydi.

## Manba (offline)
`manba/IMO-<YIL>-notes.pdf` — Evan Chen'ning IMO yechim yozuvlari (2000–2025), `manba/IMO-<YIL>-notes.txt` — ularning matn ko'rinishi (`pdftotext -layout`).
Har post shu fayldan tayyorlanadi: shart va yechim shu yerdan olinadi, internetdan yuklash shart emas.
