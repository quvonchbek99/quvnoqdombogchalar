---
name: kuvi-ai
description: Kuvi AI (kuvonch.uz/kuvi-ai.html va texnikum1son.uz yordamchisi) ustida ishlash — miya serveri, agentlar, «To'liq matematik format» skill, «Fikrlash» paneli, formulalar va LaTeX/Overleaf/Word eksport. Kuvi AI ga oid har qanday o'zgarishda shundan boshla.
---

# Kuvi AI ustida ishlash

Kuvi AI **«To'liq matematik format»** skillidan boshlanadi: har formula LaTeX'da (Overleaf / MathType sifati),
masala yechimi «Berilgan → Yechish → Tekshirish → Javob (\boxed)» tuzilmasida. To'liq tavsif: `kuvi-ai/SKILL-ilmiy-yozish.md`.

## Tuzilma (bitta miya — ikkala sayt)

- `tools/kuvi-ovoz-worker.js` — Cloudflare Worker `kuvi-ovoz` (https://kuvi-ovoz.quvonchmash12.workers.dev).
  `POST /chat {messages, deep, effort, max, fikr, stream}` — `fikr: true` bo'lsa o'ylash matni oqimda
  `delta.reasoning` (Groq, OpenRouter) yoki `delta.reasoning_content` (DeepSeek) bo'lib keladi. `GET /ping` → `v`, `fikr`, `brains`.
  ORIGINS ichida kuvonch.uz va texnikum1son.uz bor. Kalitlar faqat Worker Secrets'da.
- `kuvi-ai/agentlar.js` — `window.KUVI_BILIM`: `agent.{javob,maslahatchi,ilmiy}`, `skill.{formula,ilmiy}`, `fikrlash`, `teg`.
  Prompt matnini shu yerda o'zgartirish yetarli — ikkala sayt GitHub Pages orqali ~10 daqiqada oladi.
- `kuvi-ai/kuvi-ai.js` — `window.KuviAI`: `bilim, tizim, sora, chiz, teg, latex, overleaf, word, yukla, nusxa, fikrPanel, amallar, ping`.
- `kuvi-ai.html` — mustaqil sahifa. texnikum1son repo'sidagi `_manba/assets/t1-kuvi.js` (generator manbasi) va
  `assets/t1-kuvi.js` (nusxasi — ikkalasi bir xil bo'lishi shart) modulni `https://kuvonch.uz/kuvi-ai/kuvi-ai.js` dan yuklaydi.

## Qoidalar

1. API kalitni hech qachon sayt kodiga, GitHub'ga yoki chatga yozma — faqat Cloudflare Worker → Settings → Variables and Secrets.
2. `agentlar.js` dagi `String.raw` ichida `${`, teskari tirnoq, `\u…`, `\x…` yozma.
3. Kod ES5 uslubida (var, function, Promise) — saytning qolgan qismi kabi eski telefonlarda ham yuklanadi.
4. Serverni o'zgartirsang — eski mijozlar buzilmasin: yangi parametrlar ixtiyoriy, `deep/effort/max/stream` ma'nosi o'zgarmaydi
   (ai-ustoz.html ham shu `/chat` ni ishlatadi). `VER` ni yangila.
5. Formulalar KaTeX 0.16.11 + mhchem bilan chiziladi; `align`, `\newcommand`, `\label` ishlatilmaydi (aligned bor).
6. kuvonch.uz sahifalarida CSP `form-action 'self'` — Overleaf tugmasi faqat kuvi-ai.html'da (form-action'ga overleaf.com qo'shilgan)
   to'g'ridan-to'g'ri ochiladi; boshqa joyda `.tex` yuklab beriladi.

## Tekshirish

- Server sintaksisi: `cp tools/kuvi-ovoz-worker.js /tmp/w.mjs && node --check /tmp/w.mjs`
- Brauzer sinovi: Playwright + Chrome, CDN (KaTeX) va Worker so'rovlarini `route` bilan soxtalashtirib —
  oqimda `delta.reasoning` + `delta.content` (LaTeX) yuborib, `.katex`, `.kv-fikr`, `.kv-amal` paydo bo'lishini tekshir.
- Jonli: https://kuvi-ovoz.quvonchmash12.workers.dev/ping

## Joylash

- Sayt fayllari: `main` ga push → GitHub Pages.
- Server: `.github/workflows/kuvi-server.yml` — repo Secrets'da `CLOUDFLARE_API_TOKEN` va `CLOUDFLARE_ACCOUNT_ID` bo'lsa
  `tools/kuvi-ovoz-worker.js` o'zgarganda o'zi joylaydi (`--keep-vars`); bo'lmasa Cloudflare'da Edit code → Deploy.
- Kalitlar jadvali va narxlar: `kuvi-ai/README.md`.
