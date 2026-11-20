# Kuvi AI — to'liq matematik AI (kuvonch.uz + texnikum1son.uz)

Kuvi AI shu skilldan boshlanadi: **har bir formula LaTeX'da, Overleaf / MathType sifatida** (`SKILL-ilmiy-yozish.md`).
Ikkala saytda bitta miya, bitta agentlar va skilllar to'plami ishlaydi.

## 1. Nima bor

- **kuvonch.uz/kuvi-ai.html** — mustaqil sahifa: 3 rejim (💬 Javob beruvchi, 🧑‍🏫 Maslahatchi, 📐 Ilmiy yozuvchi),
  fikrlash darajasi (⚡ Tez · 🧠 Fikrlash · 🧠🧠 Chuqur), formulalar (KaTeX), har javob ostida 📋 Nusxa · 📝 Word · ⬇ .tex · 🌿 Overleaf.
  «🧠 Fikrlash» yoqilsa Kuvi qanday o'ylagani «Kuvi qanday fikrladi» bo'limida jonli ko'rinadi.
- **texnikum1son.uz** — Kuvi AI yordamchisi (`assets/t1-kuvi.js`): shu miya, 3-rejim «Ilmiy», «🧠 Fikrlash» tugmasi,
  formulalar va eksport. Server javob bermasa — avvalgidek Gemini (Firebase) zaxira ishlaydi.
- **Miya** — `tools/kuvi-ovoz-worker.js` (Cloudflare Worker `kuvi-ovoz`) → `POST /chat`. Oddiy savol — bepul Groq,
  chuqur fikrlash — kaliti qo'yilgan eng kuchli model.

## 2. Fayllar

| Fayl | Vazifasi |
|---|---|
| `kuvi-ai/agentlar.js` | agentlar (javob, maslahatchi, ilmiy), skilllar (formula, ilmiy), fikrlash qoidalari — ikkala sayt shu fayldan oladi |
| `kuvi-ai/kuvi-ai.js` | mijoz moduli: `/chat` oqimi, «Kuvi qanday fikrladi» paneli, markdown + KaTeX, eksport (.tex, Overleaf, Word) |
| `kuvi-ai.html` | Kuvi AI sahifasi |
| `kuvi-ai/SKILL-ilmiy-yozish.md` | Kuvi AI boshlanadigan skill: ilmiy yozish dasturlari va to'liq matematik format |
| `tools/kuvi-ovoz-worker.js` | server: miya (`/chat`, `fikr: true` — fikrlash oqimi) va ovoz (`/tts`, `/stt`, `/gstt`) |
| `.github/workflows/kuvi-server.yml` | agent: server fayli o'zgarsa Cloudflare'ga o'zi joylaydi |

## 3. Serverni yangilash (bir marta kerak)

Yangi server: fikrlash jarayonini qaytaradi va **texnikum1son.uz** ga ruxsat beradi. Yangilanmaguncha kuvonch.uz'da Kuvi AI
ishlaydi (fikrlash matnisiz), texnikum1son.uz esa Gemini zaxirasida qoladi.

**A) Avtomatik (tavsiya) — bir marta 2 ta Secret, keyin har o'zgarish o'zi joylanadi**
1. dash.cloudflare.com → o'ng yuqorida profil → **My Profile → API Tokens → Create Token** → «**Edit Cloudflare Workers**» → *Use template* → *Continue to summary* → *Create Token* → tokenni nusxalang.
2. dash.cloudflare.com → **Workers & Pages** → o'ng ustunda **Account ID** → nusxalang.
3. github.com/quvonchbek99/quvnoqdombogchalar → **Settings → Secrets and variables → Actions → New repository secret**:
   `CLOUDFLARE_API_TOKEN` (1-qadam) va `CLOUDFLARE_ACCOUNT_ID` (2-qadam).
4. **Actions → «Kuvi serveri» → Run workflow**.

**B) Qo'lda** — Cloudflare → Workers & Pages → `kuvi-ovoz` → *Edit code* → `tools/kuvi-ovoz-worker.js` ning hammasini qo'yib → *Deploy*.

Tekshirish: https://kuvi-ovoz.quvonchmash12.workers.dev/ping → `"v":"2026-11-21","fikr":true` va `brains` ichida qaysi kalitlar ulangani.

## 4. API kalitlari

Kalitlar **faqat** Cloudflare'da: Worker `kuvi-ovoz` → *Settings → Variables and Secrets → Add* → *Type: Secret*.
Saytga, GitHub'ga yoki chatga qo'ymang — Worker ularni yashiradi.

| Kalit | Nima uchun | Narx | Qayerdan |
|---|---|---|---|
| `GROQ_KEY` | oddiy suhbat, bepul fikrlash (openai/gpt-oss-120b), ovozni tanish | bepul, kartasiz | console.groq.com → API Keys |
| `DEEPSEEK_KEY` | kuchli «Fikrlash» (DeepSeek V4 Pro) — fikrlash jarayoni ko'rinadi | pullik, juda arzon (balans to'ldiriladi) | platform.deepseek.com → Top up → API keys |
| `OPENROUTER_KEY` | bepul zaxira (DeepSeek `:free` modellar) | bepul, kuniga ~50 so'rov | openrouter.ai → Keys |
| `GEMINI_KEY` | zaxira (Gemini Flash) | bepul limit bilan | aistudio.google.com → Get API key |
| `ANTHROPIC_KEY` | Claude Sonnet 5.5 — kuchli, lekin fikrlash matnini qaytarmaydi | pullik | console.anthropic.com |
| `OPENAI_KEY` | GPT-5 mini — fikrlash matnini qaytarmaydi | pullik | platform.openai.com |
| `PAID_DAILY` | pullik miyaga kunlik so'rov chegarasi (standart 400), oddiy o'zgaruvchi | — | — |

Chuqur fikrlash tartibi — kaliti bor birinchisi ishlaydi: **Claude → OpenAI → DeepSeek → Gemini → OpenRouter → Groq**.
Fikrlash jarayoni ko'rinsin desangiz, chuqur fikrlash uchun DeepSeek yoki Groq qoldiring (Claude/OpenAI kalitini qo'shmang).
Pullik kalitda provayder kabinetida oylik chegara qo'ying — narxlar o'zgarib turadi.

## 5. Agent yoki skillni o'zgartirish

- `kuvi-ai/agentlar.js` dagi matnni o'zgartirib GitHub'ga yuklang — ~10 daqiqada ikkala saytda yangilanadi (serverga tegish shart emas).
- Yangi agent: `agent: { yangi: { nom, kim, belgi, skill: ["formula"], salom, tez: [...], tizim: "..." } }` — kuvi-ai.html tabni o'zi qo'shadi.
- `String.raw` ichida `${` va teskari tirnoq yozmang; teskari chiziqdan keyin `u` yoki `x` kelmasin (eski brauzerlar o'qiy olmaydi).

## 6. Foydali havolalar

- `kuvi-ai.html?rejim=ilmiy&fikr=2&q=...` — rejim, fikrlash darajasi va savolni havola orqali berish.
- Formulani bosish — LaTeX nusxa. Word'da: **Alt+=** → LaTeX → joylang (yoki «📝 Word» tugmasi).
- «🌿 Overleaf» — javob to'liq LaTeX hujjat bo'lib overleaf.com'da ochiladi (pdfLaTeX).
