/**
 * Kuvonch Academy — «Kuvi ovoz serveri» (Cloudflare Worker, bepul tarif yetadi)
 *
 * Nima qiladi: Microsoft Azure Speech orqali
 *   POST /tts  — matnni o'zbekcha tabiiy ovozga aylantiradi (Madina — ayol, Sardor — erkak; inglizcha/ruscha ham)
 *   POST /stt  — o'quvchi ovozini (WAV, 16 kHz) matnga aylantiradi (o'zbek/ingliz/rus)
 *   POST /chat — Kuvi'ning «miyasi»: bir nechta provayder (pastda «Miyalar»). Kaliti qo'shilganlari ishlaydi,
 *                biri band yoki limiti tugasa — keyingisiga o'tadi. Chuqur fikrlash eng kuchlisidan boshlanadi.
 *                {"fikr": true} — «Fikrlash» qismi: model qanday o'ylagani ham oqimda keladi (delta.reasoning yoki
 *                delta.reasoning_content) — Kuvi AI sahifasi uni «Kuvi qanday fikrladi» bo'limida ko'rsatadi.
 *                {"chuqur": true} — «To'liq chuqur o'ylash»: ① reja va yechim → ② mustaqil tekshiruv → ③ xato topilsa
 *                tuzatish. Bosqichlar «Fikrlash» qismida ko'rinadi, foydalanuvchiga faqat tekshirilgan javob boradi.
 *                {"tg": true} — javob Telegram uchun ham tayyorlanadi (HTML bo'laklar, formulalar Unicode'da).
 *                {"rasm": {"mime", "b64"}} — rasmdagi masala (faqat rasm o'qiy oladigan miya ulangan bo'lsa: GEMINI_KEY)
 *                Ikkala sayt ishlatadi: kuvonch.uz (Kuvi AI, AI ustoz) va texnikum1son.uz (Kuvi AI yordamchisi);
 *                Telegramdagi @kuvonch_agent_bot ham (Apps Script orqali, «X-Kuvi-Mijoz: bot»).
 *   POST /tg   — Telegram webhook: @kuvonch_agent_bot ga kelgan xabarlarni agent bot (Apps Script) ga uzatadi.
 *                Telegram'ga darhol «ok» qaytaradi (Apps Script'ning o'zi webhook bo'la olmaydi — 302 qaytaradi).
 *                Bot tokeni bu serverda kerak emas: webhookni Apps Script o'zi ulaydi (webhookUlash), maxfiy kalitni o'zi tekshiradi.
 *   POST /gstt — o'quvchi ovozini Groq Whisper bilan matnga aylantiradi (bepul: kuniga ~8 soat ovoz);
 *                &auto=1 — tilni o'zi aniqlaydi (ingliz/rus rejimida o'quvchi o'zbekcha ham gapiradi)
 *   GET  /ping — server ishlayaptimi
 * Azure va Groq kalitlari shu serverda yashirin turadi, saytning ochiq kodida ko'rinmaydi.
 *
 * O'rnatish (Cloudflare → Workers & Pages → Create → Worker):
 *   1) Shu kodni «Edit code» oynasiga qo'yib, Deploy bosing.
 *   2) Settings → Variables and Secrets:
 *        AZ_REGION = swedencentral        (Azure Speech resursi turgan hudud, Text turi; resurs: kuvonch-ovoz, Sweden Central)
 *        AZ_KEY    = <Azure KEY 1>        (Secret turi — hech kimga ko'rinmaydi)
 *        GROQ_KEY  = <Groq API kaliti gsk_…> (Secret turi; console.groq.com → API Keys, kartasiz bepul)
 *      Ixtiyoriy «miyalar» (Secret turi; qo'shilsa o'zi ulanadi):
 *        OPENROUTER_KEY — openrouter.ai → Keys (bepul DeepSeek va boshqa :free modellar; kartasiz kuniga 50 so'rov)
 *        GEMINI_KEY     — aistudio.google.com → Get API key (Gemini Flash, bepul limit bilan; rasmni ham o'qiydi)
 *        DEEPSEEK_KEY   — platform.deepseek.com (pullik, juda arzon)
 *        ANTHROPIC_KEY  — console.anthropic.com (Claude, pullik)   OPENAI_KEY — platform.openai.com (ChatGPT, pullik)
 *        PAID_DAILY     — pullik miyaga kuniga nechta chuqur so'rov (standart 400; asosiy chegarani provayder kabinetida qo'ying)
 *        BOT_DAILY      — Telegram botdan kuniga nechta so'rov (standart 3000)
 *        Model nomini almashtirish (ixtiyoriy, vergul bilan): CLAUDE_MODEL, OPENAI_MODEL, DEEPSEEK_MODEL, GEMINI_MODEL, OR_MODELS
 *        AGENT_URL — Telegram agent bot (Apps Script web app …/exec); bo'lmasa pastdagi AGENT_URL ishlatiladi
 *   3) Worker manzilini (https://kuvi-ovoz.<...>.workers.dev) sayt sozlamasiga yozamiz.
 * Azure'da «Free F0» tarifini tanlang: oyiga 500 000 belgi bepul, limitdan oshsa pul yechilmaydi — shunchaki to'xtaydi.
 *
 * Avtomatik joylash: .github/workflows/kuvi-server.yml — repo Secrets'da CLOUDFLARE_API_TOKEN va CLOUDFLARE_ACCOUNT_ID
 * bo'lsa, shu fayl o'zgarganda Worker o'zi yangilanadi (kalitlar va AZ_REGION o'chmaydi: --keep-vars).
 */
const VER = "2026-11-22"; // /ping da ko'rinadi — sayt server yangilanganini shundan biladi
const ORIGINS = ["https://kuvonch.uz", "https://www.kuvonch.uz", "https://quvonchbek99.github.io", "http://localhost:8765",
  "https://texnikum1son.uz", "https://www.texnikum1son.uz"];
// Telegram agent bot (@kuvonch_agent_bot) — Apps Script «Avto-javob agent (bot kodi)» web app manzili
const AGENT_URL = "";
const VOICES = {
  "uz-f": "uz-UZ-MadinaNeural", "uz-m": "uz-UZ-SardorNeural",
  "en-f": "en-US-JennyNeural", "en-m": "en-US-GuyNeural",
  "ru-f": "ru-RU-SvetlanaNeural", "ru-m": "ru-RU-DmitryNeural"
};
// kayfiyat -> [tezlik %, ohang %]
const MOOD = { neutral: [0, 0], happy: [8, 10], love: [-4, 6], think: [-6, 0], strict: [0, -8], jealous: [6, -6], sad: [-12, -8], wow: [6, 14], listen: [0, 0] };
const STT_LANG = { "uz-UZ": 1, "en-US": 1, "ru-RU": 1 };
const GROQ = "https://api.groq.com/openai/v1";
// birinchisi band bo'lsa (bepul limit) yoki o'chirilgan bo'lsa — keyingisi
// Groq'dagi chat modellari (2026-noyabr: /models ro'yxati) — har birining kunlik limiti alohida, biri tugasa keyingisi
const G_CHAT = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile"];
const G_DEEP = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"];
/* ---------- Miyalar: hammasi OpenAI ko'rinishidagi Chat Completions API ---------- */
const PROV = {
  groq: { url: GROQ + "/chat/completions", key: "GROQ_KEY" },
  orouter: { url: "https://openrouter.ai/api/v1/chat/completions", key: "OPENROUTER_KEY", h: { "HTTP-Referer": "https://kuvonch.uz", "X-Title": "Kuvonch Academy" } },
  gemini: { url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", key: "GEMINI_KEY" },
  deepseek: { url: "https://api.deepseek.com/chat/completions", key: "DEEPSEEK_KEY", paid: 1 },
  claude: { url: "https://api.anthropic.com/v1/chat/completions", key: "ANTHROPIC_KEY", paid: 1 },
  openai: { url: "https://api.openai.com/v1/chat/completions", key: "OPENAI_KEY", paid: 1 }
};
// [provayder, model nomini almashtiruvchi o'zgaruvchi, standart modellar]
const ROUTES = {
  deep: [
    ["claude", "CLAUDE_MODEL", ["claude-sonnet-5-5"]],
    ["openai", "OPENAI_MODEL", ["gpt-5-mini"]],
    ["deepseek", "DEEPSEEK_MODEL", ["deepseek-v4-pro", "deepseek-flash"]], // 2026-noyabr: V4 Pro va V4.1 Flash (eski nomlar o'chirilgan)
    ["gemini", "GEMINI_MODEL", ["gemini-2.5-flash"]],
    ["orouter", "OR_MODELS", ["deepseek/deepseek-v4-flash:free", "deepseek/deepseek-r1-0528:free", "deepseek/deepseek-chat-v3.1:free"]],
    ["groq", "", G_DEEP]
  ],
  fast: [["groq", "", G_CHAT], ["gemini", "GEMINI_FAST", ["gemini-2.5-flash-lite"]], ["orouter", "OR_FAST", ["deepseek/deepseek-v4-flash:free"]]],
  // rasm o'qiy oladigan miyalar (Groq'da hozir bunday model yo'q)
  vision: [["gemini", "GEMINI_VISION", ["gemini-2.5-flash", "gemini-2.5-flash-lite"]], ["openai", "OPENAI_VISION", ["gpt-5-mini"]], ["orouter", "OR_VISION", ["google/gemma-3-27b-it:free", "mistralai/mistral-small-3.2-24b-instruct:free"]]]
};
const cool = new Map(); // band/limit tugagan model — bir muddat chetlab o'tiladi
const PAID = { day: "", n: 0 };
const BOT = { day: "", n: 0 };
function paidOk(env) { const d = new Date().toISOString().slice(0, 10); if (PAID.day !== d) { PAID.day = d; PAID.n = 0; } return PAID.n < (+env.PAID_DAILY || 400); }
function botOk(env) { const d = new Date().toISOString().slice(0, 10); if (BOT.day !== d) { BOT.day = d; BOT.n = 0; } return ++BOT.n <= (+env.BOT_DAILY || 3000); }
function provs(env) { const o = {}; for (const k in PROV) o[k] = !!env[PROV[k].key]; return o; }
const G_STT = ["whisper-large-v3", "whisper-large-v3-turbo"];
const LIMIT = 150, WINDOW = 10 * 60 * 1000; // bitta IP: 10 daqiqada 150 so'rov (taxminiy himoya)
const hits = new Map();
// Apps Script (Telegram agent bot) — brauzer emas, Origin yubormaydi
function isBot(req) { return req.headers.get("X-Kuvi-Mijoz") === "bot" && /Google-Apps-Script/i.test(req.headers.get("User-Agent") || ""); }

export default {
  async fetch(req, env, ctx) {
    const origin = req.headers.get("Origin") || "";
    const url = new URL(req.url);
    if (url.pathname === "/tg" && req.method === "POST") return tgRelay(req, env, ctx);
    const bot = isBot(req);
    const ok = ORIGINS.includes(origin) || bot;
    const cors = { "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0], "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (url.pathname === "/ping") return json({ ok: true, v: VER, fikr: true, chuqur: true, tg: true, region: env.AZ_REGION || "", key: !!env.AZ_KEY, groq: !!env.GROQ_KEY, brains: provs(env), agent: !!(env.AGENT_URL || AGENT_URL) }, 200, cors);
    if (!ok) return json({ error: "ruxsat yo'q" }, 403, cors);
    if (bot) { if (url.pathname !== "/chat") return json({ error: "ruxsat yo'q" }, 403, cors); if (!botOk(env)) return json({ error: "bot uchun kunlik limit tugadi" }, 429, cors); }
    else {
      const ip = req.headers.get("CF-Connecting-IP") || "?", now = Date.now(), h = hits.get(ip) || { t: now, n: 0 };
      if (now - h.t > WINDOW) { h.t = now; h.n = 0; }
      if (++h.n > LIMIT) return json({ error: "juda ko'p so'rov, biroz kuting" }, 429, cors);
      hits.set(ip, h); if (hits.size > 5000) hits.clear();
    }
    try {
      if (url.pathname === "/chat" && req.method === "POST") return await chat(req, env, cors);
      if (url.pathname === "/models" && req.method === "GET") return await models(env, cors);
      if (url.pathname === "/gstt" && req.method === "POST") return await gstt(req, env, url, cors);
      if ((url.pathname === "/tts" || url.pathname === "/stt") && (!env.AZ_KEY || !env.AZ_REGION)) return json({ error: "AZ_KEY yoki AZ_REGION sozlanmagan" }, 500, cors);
      if (url.pathname === "/tts" && req.method === "POST") return await tts(req, env, cors);
      if (url.pathname === "/stt" && req.method === "POST") return await stt(req, env, url, cors);
    } catch (e) { return json({ error: String(e && e.message || e).slice(0, 200) }, 500, cors); }
    return json({ error: "topilmadi" }, 404, cors);
  }
};

/* ---------- Telegram webhook → agent bot (Apps Script) ----------
   Telegram har xabarni shu yerga yuboradi. Biz darhol «ok» deymiz va xabarni Apps Script'ga uzatamiz.
   Telegram yuborgan maxfiy kalit (sarlavhada) ham uzatiladi — Apps Script uni bot tokenidan hisoblab tekshiradi. */
async function tgRelay(req, env, ctx) {
  const target = String(env.AGENT_URL || AGENT_URL || "");
  const sir = req.headers.get("X-Telegram-Bot-Api-Secret-Token") || "";
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]{20,}\/exec$/.test(target) || !/^[\w-]{16,256}$/.test(sir)) return new Response("ok");
  const body = await req.text();
  if (body.length > 200000) return new Response("ok");
  let u; try { u = JSON.parse(body); } catch (e) { return new Response("ok"); }
  const p = fetch(target, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ tgSir: sir, u }) }).catch(() => null);
  if (ctx && ctx.waitUntil) ctx.waitUntil(p);
  return new Response("ok");
}

async function tts(req, env, cors) {
  const b = await req.json().catch(() => ({}));
  const text = String(b.text || "").replace(/\s+/g, " ").trim().slice(0, 600);
  if (!text) return json({ error: "matn yo'q" }, 400, cors);
  const lang = ["uz", "en", "ru"].includes(b.lang) ? b.lang : "uz", g = b.g === "m" ? "m" : "f";
  const voice = VOICES[lang + "-" + g], md = MOOD[b.mood] || MOOD.neutral;
  const rate = clamp(md[0] + (Number(b.rate) || 0), -30, 30), pitch = clamp(md[1], -20, 20);
  const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="' + voice.slice(0, 5) + '"><voice name="' + voice + '">' +
    '<prosody rate="' + sign(rate) + '%" pitch="' + sign(pitch) + '%">' + esc(text) + "</prosody></voice></speak>";
  const r = await fetch("https://" + env.AZ_REGION + ".tts.speech.microsoft.com/cognitiveservices/v1", {
    method: "POST",
    headers: { "Ocp-Apim-Subscription-Key": env.AZ_KEY, "Content-Type": "application/ssml+xml", "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3", "User-Agent": "kuvonch-kuvi" },
    body: ssml
  });
  if (!r.ok) return json({ error: "azure " + r.status, detail: (await r.text()).slice(0, 200) }, r.status === 429 ? 429 : 502, cors);
  return new Response(r.body, { headers: Object.assign({ "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=2592000" }, cors) });
}

async function stt(req, env, url, cors) {
  const lang = STT_LANG[url.searchParams.get("lang")] ? url.searchParams.get("lang") : "uz-UZ";
  const audio = await req.arrayBuffer();
  if (!audio.byteLength) return json({ error: "ovoz yo'q" }, 400, cors);
  if (audio.byteLength > 1900000) return json({ error: "ovoz juda uzun (60 soniyagacha)" }, 413, cors);
  const r = await fetch("https://" + env.AZ_REGION + ".stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=" + lang + "&format=simple", {
    method: "POST",
    headers: { "Ocp-Apim-Subscription-Key": env.AZ_KEY, "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000", "Accept": "application/json" },
    body: audio
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return json({ error: "azure " + r.status }, r.status === 429 ? 429 : 502, cors);
  return json({ text: j.DisplayText || "", status: j.RecognitionStatus || "" }, 200, cors);
}

/* ---------- Kuvi'ning miyasi ----------
   Sayt OpenAI ko'rinishidagi xabarlarni yuboradi: [{role: system|user|assistant, content}].
   Javob oqim (SSE) bo'lib qaytadi — Kuvi gapni yozilayotgan paytida o'qiy boshlaydi. */
// Telegramdagi Kuvi (agent bot) — tayyor tizim ko'rsatmasi: {"preset": "tg"}
const TG_TIZIM = "Sen Kuvi — Kuvonch Academy (kuvonch.uz) ning sun'iy intellektli ustozisan va Quvonchbek Mashrapov ustozning AI yordamchisisan. Telegramda javob berasan.\n" +
  "- Har qanday savolga — matematika, fizika, kimyo, informatika, tillar, tarix, kasb va hayotiy savollarga — chuqur o'ylab, aniq va to'liq javob ber. Faqat sayt mavzulari bilan cheklanma.\n" +
  "- Javobni darhol ber: avval qisqa aniq javob yoki xulosa, keyin kerak bo'lsa qadam-baqadam tushuntirish. Nima uchun shunday ekanini, g'oya qayerdan kelib chiqishini va boshqa tushunchalar bilan bog'liqligini ham tushuntir. Foydalanuvchini savolga ko'mib tashlama: savol tushunarsiz bo'lsa ham eng ehtimolli ma'noda javob ber, kerak bo'lsa oxirida bitta aniqlashtiruvchi savol ber.\n" +
  "- Masala yechganda: Berilgan → qoida yoki formula → hisob (har qadam) → tekshirish (javobni o'rniga qo'yib) → «Javob: …».\n" +
  "- Telegram LaTeX'ni ko'rsatmaydi: formulalarni oddiy matn va Unicode belgilar bilan yoz: x², x³, √x, ∛x, ½, π, ≤, ≥, ≠, ≈, ·, ×, ÷, →, ∞, ∫, ∑, Δ, α, β, °. Murakkab kasrni (a+b)/(c−d) ko'rinishida yoz.\n" +
  "- Qisqa paragraflar, kerak bo'lsa «•» ro'yxat va **qalin** ajratish. Jadval ishlatma.\n" +
  "- Foydalanuvchi qaysi tilda yozsa, o'sha tilda javob ber (odatda o'zbekcha, lotin yozuvida).\n" +
  "- Aniq bilmagan fakt, raqam yoki manbani to'qima — ochiq ayt. Xavfli, kattalar mavzusi yoki noqonuniy so'rovlarni muloyim rad et.\n" +
  "- Kimligingni so'rashsa: «Men Kuvi — Kuvonch Academy'ning AI ustoziman» de; inson emasligingni yashirma.";
// «To'liq chuqur o'ylash»: ikkinchi bosqich — mustaqil tekshiruvchi
const TEKSHIR = "Sen qat'iy va diqqatli tekshiruvchisan (matematika, fizika, kimyo, informatika va boshqa fanlar). Senga savol va unga yozilgan javob beriladi. " +
  "Vazifang: javobdagi har bir hisob, formula, mantiqiy qadam va yakuniy natijani MUSTAQIL qayta hisoblab tekshirish (javobni tenglamaga qo'yib, boshqa usul bilan, chegaraviy holat, birlik va aniqlanish sohasini tekshirib). Javobni qayta yozma.\n" +
  "Natijani o'zbek tilida (lotin yozuvida) aynan shu ko'rinishda yoz:\n" +
  "HUKM: TO'G'RI  (yoki: HUKM: XATO)\nTekshirildi: 1–3 qisqa gap — nimalar qayta hisoblandi.\nXatolar: faqat HUKM: XATO bo'lsa — qaysi qadamda nima noto'g'ri va to'g'risi qanday (aniq qiymatlar bilan).\n" +
  "Ko'pi bilan 150 so'z. Faqat mazmuniy xato (noto'g'ri hisob, noto'g'ri formula yoki xulosa, yechimning muhim qismi yetishmasligi) bo'lsa XATO de; uslub, yozuv shakli yoki qisqalik uchun XATO dema.";

async function chat(req, env, cors) {
  const b = await req.json().catch(() => ({}));
  const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-16)
    .map(m => ({ role: ["system", "user", "assistant"].includes(m && m.role) ? m.role : "user", content: String((m && m.content) || "").slice(0, 8000) }))
    .filter(m => m.content);
  if (!msgs.some(m => m.role === "user")) return json({ error: "xabar yo'q" }, 400, cors);
  if (b.preset === "tg") {
    const qo = b.qosh ? "\n\n" + String(b.qosh).slice(0, 2000) : "";
    const si = msgs.findIndex(m => m.role === "system");
    if (si < 0) msgs.unshift({ role: "system", content: TG_TIZIM + qo }); else msgs[si].content = TG_TIZIM + qo + "\n\n" + msgs[si].content;
  }
  const chuqur = !!b.chuqur, deep = !!b.deep || chuqur, tg = !!b.tg, stream = b.stream !== false && !tg;
  // effort: low | medium | high — sayt so'ragan fikrlash kuchi; max — javob (o'ylash bilan birga) uchun token chegarasi
  // fikr: true — model qanday o'ylagani ham qaytadi («Fikrlash» qismi); bo'lmasa o'ylash matni yashirin qoladi
  const o = { deep, stream, fikr: !!b.fikr || chuqur, effort: ["low", "medium", "high"].includes(b.effort) ? b.effort : deep ? "medium" : "low", maxT: Math.max(300, Math.min(8000, +b.max || (deep ? 4000 : 1000))),
    vaqt: +b.vaqt > 0 ? Math.max(15000, Math.min(120000, +b.vaqt)) : 0 };
  // rasmdagi masala: oxirgi foydalanuvchi xabariga rasm qo'shiladi (rasm o'qiy oladigan miya kerak)
  if (b.rasm && b.rasm.b64) {
    const mime = /^image\/(png|jpe?g|webp|gif)$/.test(b.rasm.mime) ? b.rasm.mime : "image/jpeg", b64 = String(b.rasm.b64);
    if (b64.length > 7000000) return json({ error: "rasm juda katta" }, 413, cors);
    const ui = msgs.map(m => m.role).lastIndexOf("user");
    msgs[ui] = { role: "user", content: [{ type: "text", text: msgs[ui].content }, { type: "image_url", image_url: { url: "data:" + mime + ";base64," + b64 } }] };
    const res = await callChat(env, ROUTES.vision, msgs, Object.assign({}, o, { stream: false, deep: true }));
    if (!res.r) return json({ error: res.err ? "rasm: " + res.err : "rasm o'qiydigan miya ulanmagan (GEMINI_KEY kerak)", rasm: false }, res.err && /429/.test(res.err) ? 429 : 503, cors);
    const x = await javobi(res);
    return json(chiqish(x, o, tg, b), 200, Object.assign({ "X-Kuvi-Model": res.tag, "Access-Control-Expose-Headers": "X-Kuvi-Model" }, cors));
  }
  if (chuqur) return chuqurJavob(env, msgs, o, cors, tg, b);
  let route = deep ? ROUTES.deep : ROUTES.fast;
  // sinov uchun: faqat ro'yxatdagi modelni tanlash mumkin (masalan {"model":"groq/moonshotai/kimi-k2-instruct-0905"})
  if (b.model && typeof b.model === "string") {
    const k = b.model.indexOf("/"), pv = b.model.slice(0, k), md = b.model.slice(k + 1);
    const ok = ROUTES.deep.concat(ROUTES.fast).some(x => x[0] === pv && x[2].includes(md));
    if (ok) route = [[pv, "", [md]]];
  }
  const res = await callChat(env, route, msgs, o);
  if (!res.r) return json({ error: res.err || "miya ulanmagan (kalit yo'q)" }, /429/.test(res.err) ? 429 : /40[13]/.test(res.err) ? 401 : 502, cors);
  const h = Object.assign({ "X-Kuvi-Model": res.tag, "Access-Control-Expose-Headers": "X-Kuvi-Model" }, cors);
  if (stream) return new Response(res.r.body, { headers: Object.assign({ "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store" }, h) });
  const x = await javobi(res);
  return json(chiqish(x, o, tg, b), 200, h);
}
// oqimsiz javobni o'qish: {text, fikr, tag}
async function javobi(res) {
  const j = await res.r.json().catch(() => ({}));
  const m = (((j.choices || [])[0] || {}).message || {});
  let text = String(m.content || ""), fikr = String(m.reasoning || m.reasoning_content || "");
  const th = /^\s*<think>([\s\S]*?)<\/think>\s*/.exec(text);
  if (th) { fikr += th[1]; text = text.slice(th[0].length); }
  return { text: text.trim(), fikr: fikr.trim(), tag: res.tag };
}
function chiqish(x, o, tg, b) {
  const out = { text: x.text, model: x.tag };
  if (o.fikr) out.fikr = x.fikr || "";
  if (x.bosqich) out.bosqich = x.bosqich;
  if (x.ms) out.ms = x.ms;
  if (tg) out.tg = tgHtml(x.text, b.tgFikr === false ? "" : out.fikr || "", x.ms);
  return out;
}
// bitta oqimsiz so'rov (chuqur o'ylash bosqichlari uchun)
async function bir(env, route, msgs, o) {
  const res = await callChat(env, route, msgs, Object.assign({}, o, { stream: false }));
  if (!res.r) throw new Error(res.err || "miya ulanmagan");
  return javobi(res);
}
function oxirgiSavol(msgs) { for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].role === "user") return typeof msgs[i].content === "string" ? msgs[i].content : ""; return ""; }
// tekshiruvchiga faqat javobning o'zi: fikr bloklari va kayfiyat teglari olib tashlanadi
function tozaJavob(t) { return String(t || "").replace(/\[fikr\][\s\S]*?\[\/fikr\]/gi, "").replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/\[(?:neutral|happy|love|think|strict|jealous|sad|wow|laugh|cry|shy|wink)\]/gi, "").trim(); }
function qisqart(t, n) { t = String(t || "").trim(); return t.length > n ? t.slice(0, n) + " …" : t; }

/* ---------- «To'liq chuqur o'ylash»: ① reja va yechim → ② mustaqil tekshiruv → ③ (xato bo'lsa) tuzatish ----------
   Oqimda: bosqichlar «Fikrlash» qismiga (delta.reasoning) yoziladi, foydalanuvchiga faqat tekshirilgan javob (delta.content) boradi. */
async function chuqurIsh(env, msgs, o, yoz, oqimC) {
  const t0 = Date.now(), vaqt = o.vaqt || 0, savol = oxirgiSavol(msgs);
  const bosqich = [];
  yoz("f", "### ① Reja va yechim\n");
  const A = await bir(env, ROUTES.deep, msgs, Object.assign({}, o, { fikr: true, effort: "high", maxT: Math.min(o.maxT, 5000) }));
  if (!A.text) throw new Error("bo'sh javob");
  bosqich.push({ b: "yechim", model: A.tag, s: Math.round((Date.now() - t0) / 100) / 10 });
  yoz("f", (A.fikr ? qisqart(A.fikr, 6000) : "_(model o'ylash matnini ko'rsatmadi)_") + "\n\n");
  // vaqt tugab qolsa (Telegram/Apps Script kutib turolmaydi) — tekshiruvsiz
  if (vaqt && Date.now() - t0 > vaqt * 0.55) { yoz("f", "_Vaqt kam qoldi — javob tekshiruvsiz berildi._"); return { text: A.text, tag: A.tag, bosqich, ms: Date.now() - t0 }; }
  yoz("f", "### ② Tekshiruv\n");
  let V = null;
  try {
    const t1 = Date.now();
    V = await bir(env, ROUTES.deep, [{ role: "system", content: TEKSHIR }, { role: "user", content: "SAVOL:\n" + qisqart(savol, 4000) + "\n\nJAVOB:\n" + qisqart(tozaJavob(A.text), 9000) }],
      { deep: true, fikr: false, effort: "medium", maxT: 2000 });
    bosqich.push({ b: "tekshiruv", model: V.tag, s: Math.round((Date.now() - t1) / 100) / 10 });
  } catch (e) { yoz("f", "_Tekshiruvchi hozir band — javob tekshiruvsiz berildi._\n\n"); }
  const xato = !!V && /HUKM\s*:\s*XATO/i.test(V.text);
  if (V) yoz("f", qisqart(V.text, 2500) + "\n\n");
  if (!xato || (vaqt && Date.now() - t0 > vaqt * 0.7)) {
    if (V) yoz("f", xato ? "⚠️ Tekshiruvchi xato topdi, lekin tuzatishga vaqt qolmadi — ehtiyot bo'ling." : "✅ Tekshiruvdan o'tdi.");
    return { text: A.text, tag: A.tag, bosqich, ms: Date.now() - t0, xato };
  }
  yoz("f", "### ③ Tuzatish\nTekshiruvchi xato topdi — javobni qayta yozyapman.\n");
  const C = msgs.concat([{ role: "assistant", content: A.text },
    { role: "user", content: "Mustaqil tekshiruvchi javobingizda quyidagilarni topdi:\n" + V.text + "\n\nBuni hisobga olib, javobni boshidan to'liq va to'g'ri qilib qayta yoz (avvalgi format va tuzilmani saqla). Tekshiruvchi haq emas deb hisoblasang — qisqa asoslab, to'g'ri javobni ber. «Tuzatdim», «avvalgi javobimda» kabi gaplarni yozma — faqat yakuniy javobni yoz." }]);
  const oc = Object.assign({}, o, { fikr: false, effort: "medium", maxT: Math.min(o.maxT, 4000) });
  if (oqimC) { const r = await oqimC(C, oc); if (r) { bosqich.push({ b: "tuzatish", model: r }); return { oqim: true, bosqich }; } }
  try {
    const F = await bir(env, ROUTES.deep, C, oc);
    bosqich.push({ b: "tuzatish", model: F.tag });
    return { text: F.text || A.text, tag: F.tag || A.tag, bosqich, ms: Date.now() - t0, tuzatildi: true };
  } catch (e) { yoz("f", "_Tuzatish bosqichi bajarilmadi — dastlabki javob berildi._"); return { text: A.text, tag: A.tag, bosqich, ms: Date.now() - t0, xato: true }; }
}
async function chuqurJavob(env, msgs, o, cors, tg, b) {
  if (!o.stream) {
    let f = "";
    try {
      const x = await chuqurIsh(env, msgs, o, (k, t) => { if (k === "f") f += t; }, null);
      x.fikr = f.trim();
      return json(chiqish(x, Object.assign({}, o, { fikr: true }), tg, b), 200, Object.assign({ "X-Kuvi-Model": x.tag || "", "Access-Control-Expose-Headers": "X-Kuvi-Model" }, cors));
    } catch (e) { const m = String(e && e.message || e); return json({ error: m.slice(0, 200) }, /429/.test(m) ? 429 : 502, cors); }
  }
  const ts = new TransformStream(), w = ts.writable.getWriter(), enc = new TextEncoder();
  let yopiq = false;
  const yoz = (k, t) => { if (!yopiq && t) w.write(enc.encode("data: " + JSON.stringify({ choices: [{ index: 0, delta: k === "f" ? { reasoning: t } : { content: t } }] }) + "\n\n")).catch(() => {}); };
  // uzoq o'ylaganda ulanish uzilmasin — har 8 soniyada bo'sh izoh satri (mijoz e'tiborsiz qoldiradi)
  const tick = setInterval(() => { if (!yopiq) w.write(enc.encode(": .\n\n")).catch(() => {}); }, 8000);
  const oqimC = async (C, oc) => {
    const res = await callChat(env, ROUTES.deep, C, Object.assign({}, oc, { stream: true }));
    if (!res.r || !res.r.body) return null;
    clearInterval(tick);
    const rd = res.r.body.getReader();
    for (;;) { const s = await rd.read(); if (s.done) break; await w.write(s.value); }
    return res.tag;
  };
  (async () => {
    try {
      const x = await chuqurIsh(env, msgs, o, yoz, oqimC);
      if (!x.oqim) { const t = x.text; for (let i = 0; i < t.length; i += 400) yoz("j", t.slice(i, i + 400)); await w.write(enc.encode("data: [DONE]\n\n")); }
    } catch (e) {
      await w.write(enc.encode("data: " + JSON.stringify({ error: { message: String(e && e.message || e).slice(0, 200) } }) + "\n\n")).catch(() => {});
    } finally { clearInterval(tick); yopiq = true; try { await w.close(); } catch (e) {} }
  })();
  return new Response(ts.readable, { headers: Object.assign({ "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store", "X-Kuvi-Model": "chuqur", "Access-Control-Expose-Headers": "X-Kuvi-Model" }, cors) });
}

// har bir miyaning o'z sozlamalari (parametr nomlari biroz farq qiladi)
function bodyFor(p, model, msgs, o) {
  const b = { model, messages: msgs, stream: o.stream }, mx = o.maxT;
  if (p === "groq") {
    b.temperature = o.deep ? 0.6 : 0.85; b.max_completion_tokens = mx;
    // gpt-oss o'ylab javob beradi: oddiy suhbatda qisqa o'ylaydi (tez), «tushuntir»da chuqurroq.
    // O'ylash matni javobga qo'shilmaydi; fikr=true bo'lsa alohida maydonda (delta.reasoning) keladi
    if (model.startsWith("openai/gpt-oss")) { b.reasoning_effort = o.effort; b.include_reasoning = o.fikr; }
    else if (model.startsWith("qwen/qwen3")) { b.reasoning_format = o.fikr && o.deep ? "parsed" : "hidden"; b.reasoning_effort = o.deep ? "default" : "none"; b.max_completion_tokens = Math.min(mx, 4000); }
    else b.max_completion_tokens = Math.min(mx, 2500); // Llama/Kimi o'ylash tokenini sarflamaydi
  } else if (p === "orouter") {
    b.max_tokens = mx; b.temperature = 0.6; b.reasoning = { effort: o.effort === "high" ? "high" : "medium", exclude: !o.fikr };
  } else if (p === "gemini") {
    b.max_tokens = mx; b.temperature = o.deep ? 0.6 : 0.85; b.reasoning_effort = o.deep ? (o.effort === "high" ? "high" : "medium") : "low";
  } else if (p === "deepseek") {
    // V4 doim o'ylaydi (o'ylash matni delta.reasoning_content da keladi); kuchi: low | high | max
    b.max_tokens = Math.min(mx, 8000); b.reasoning_effort = o.effort === "high" ? "max" : o.effort === "low" ? "low" : "high";
  } else if (p === "claude") {
    b.max_tokens = Math.min(mx, 4000); b.temperature = 0.6;
  } else if (p === "openai") {
    b.max_completion_tokens = mx;
    if (/^(gpt-5|o\d)/.test(model)) b.reasoning_effort = o.deep ? (o.effort === "high" ? "medium" : "low") : "minimal"; else b.temperature = 0.7;
  }
  return b;
}
async function callChat(env, route, msgs, o) {
  let last = "";
  for (const [p, ev, defs] of route) {
    const P = PROV[p], key = P && env[P.key]; if (!key) continue;
    const list = ev && env[ev] ? String(env[ev]).split(",").map(x => x.trim()).filter(Boolean) : defs;
    for (const model of list) {
      const ck = p + ":" + model; if ((cool.get(ck) || 0) > Date.now()) continue;
      if (P.paid && !paidOk(env)) break;
      let r;
      try { r = await fetch(P.url, { method: "POST", headers: Object.assign({ "Authorization": "Bearer " + key, "Content-Type": "application/json" }, P.h || {}), body: JSON.stringify(bodyFor(p, model, msgs, o)) }); }
      catch (e) { last = p + "/" + model + " " + String(e && e.message || e).slice(0, 80); cool.set(ck, Date.now() + 30000); continue; }
      if (r.ok) { if (P.paid) PAID.n++; return { r, tag: p + "/" + model }; }
      const st = r.status; last = p + "/" + model + " " + st + " " + (await r.text().catch(() => "")).slice(0, 160);
      cool.set(ck, Date.now() + (st === 429 ? 60000 : st >= 500 ? 30000 : st === 400 || st === 404 ? 600000 : 120000));
      if (st === 401 || st === 403) break; // bu provayder kaliti ishlamaydi — keyingi provayderga
    }
  }
  return { err: last };
}
// Groq'dagi mavjud modellar ro'yxati (faqat nomlari) va qaysi miyalar ulangani
async function models(env, cors) {
  const out = { brains: provs(env), groq: [] };
  if (env.GROQ_KEY) { try { const r = await fetch(GROQ + "/models", { headers: { "Authorization": "Bearer " + env.GROQ_KEY } }); const j = await r.json(); out.groq = (j.data || []).map(m => m.id).sort(); } catch (e) { out.err = String(e).slice(0, 100); } }
  return json(out, 200, cors);
}

/* ---------- Telegram uchun javob: Markdown + LaTeX → Telegram HTML (formulalar Unicode belgilarda) ----------
   Telegram LaTeX'ni ko'rsatmaydi: \frac{a}{b} → a/b, x^{2} → x², \sqrt{x} → √x, \le → ≤ va h.k.
   Natija: 4000 belgigacha bo'laklar ro'yxati (Telegram xabar chegarasi 4096). Fikrlash — ochiladigan iqtibos bloki. */
const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻", "−": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", "n": "ⁿ", "i": "ⁱ", "x": "ˣ", "y": "ʸ", "a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "d": "ᵈ", "e": "ᵉ", "k": "ᵏ", "m": "ᵐ", "t": "ᵗ", "T": "ᵀ", "°": "°", "∘": "°" };
const SUB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋", "−": "₋", "=": "₌", "(": "₍", ")": "₎", "a": "ₐ", "e": "ₑ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "m": "ₘ", "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "x": "ₓ", ",": "," };
const LX = { alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", varepsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", vartheta: "ϑ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ", sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", varphi: "φ", chi: "χ", psi: "ψ", omega: "ω",
  Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π", Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
  cdot: "·", times: "×", div: "÷", pm: "±", mp: "∓", le: "≤", leq: "≤", leqslant: "≤", ge: "≥", geq: "≥", geqslant: "≥", ne: "≠", neq: "≠", approx: "≈", equiv: "≡", sim: "∼", simeq: "≃", cong: "≅", propto: "∝", ll: "≪", gg: "≫",
  infty: "∞", to: "→", rightarrow: "→", longrightarrow: "⟶", leftarrow: "←", gets: "←", Rightarrow: "⇒", Longrightarrow: "⟹", implies: "⇒", Leftarrow: "⇐", Leftrightarrow: "⇔", iff: "⇔", leftrightarrow: "↔", mapsto: "↦", uparrow: "↑", downarrow: "↓",
  in: "∈", notin: "∉", ni: "∋", subset: "⊂", subseteq: "⊆", supset: "⊃", supseteq: "⊇", cup: "∪", cap: "∩", emptyset: "∅", varnothing: "∅", forall: "∀", exists: "∃", neg: "¬", lnot: "¬", land: "∧", lor: "∨", wedge: "∧", vee: "∨", setminus: "∖",
  sum: "∑", prod: "∏", int: "∫", iint: "∬", iiint: "∭", oint: "∮", partial: "∂", nabla: "∇", angle: "∠", measuredangle: "∠", triangle: "△", perp: "⊥", parallel: "∥", degree: "°", circ: "°", bullet: "•", ldots: "…", cdots: "⋯", dots: "…", vdots: "⋮", ddots: "⋱",
  prime: "′", star: "⋆", ast: "∗", mid: "∣", nmid: "∤", lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉", langle: "⟨", rangle: "⟩", vert: "|", lvert: "|", rvert: "|", Vert: "‖", lVert: "‖", rVert: "‖", hbar: "ℏ", ell: "ℓ", aleph: "ℵ", blacksquare: "■", square: "□", checkmark: "✓",
  sin: "sin", cos: "cos", tan: "tan", tg: "tg", cot: "cot", ctg: "ctg", sec: "sec", csc: "csc", arcsin: "arcsin", arccos: "arccos", arctan: "arctan", arctg: "arctg", arcctg: "arcctg", sinh: "sinh", cosh: "cosh", tanh: "tanh", ln: "ln", log: "log", lg: "lg", exp: "exp",
  lim: "lim", max: "max", min: "min", sup: "sup", inf: "inf", det: "det", gcd: "EKUB", deg: "deg", dim: "dim", arg: "arg", mod: "mod", bmod: "mod", pmod: "mod",
  quad: "  ", qquad: "    ", left: "", right: "", big: "", Big: "", bigg: "", Bigg: "", bigl: "", bigr: "", Bigl: "", Bigr: "", displaystyle: "", textstyle: "", limits: "", nolimits: "", nonumber: "", notag: "", hline: "", centering: "", noindent: "" };
const BB = { R: "ℝ", N: "ℕ", Z: "ℤ", Q: "ℚ", C: "ℂ", P: "ℙ" };
// {…} guruhini o'qish (ichma-ich qavslar bilan)
function grp(s, i) {
  while (s[i] === " ") i++;
  if (s[i] !== "{") { if (s[i] === "\\") { const m = /^\\([a-zA-Z]+|.)/.exec(s.slice(i)); if (m) return [m[0], i + m[0].length]; } return [s[i] || "", i + 1]; }
  let d = 0, j = i;
  for (; j < s.length; j++) { if (s[j] === "\\") { j++; continue; } if (s[j] === "{") d++; else if (s[j] === "}" && --d === 0) break; }
  return [s.slice(i + 1, j), j + 1];
}
function supStr(t, map, mark) {
  t = t.replace(/\s+/g, "");
  if (t && [...t].every(c => map[c] != null)) return [...t].map(c => map[c]).join("");
  return mark + ([...t].length > 1 ? "(" + t + ")" : t);
}
function wrap(t) { t = t.trim(); return /^[\w.,′'°√∛∜²³ⁿ⁻¹⁰-⁹₀-₉αβγδεθλμπσφωΔΣΩ]+$/.test(t) || /^\(.*\)$/.test(t) ? t : "(" + t + ")"; }
function lxMath(s) {
  s = String(s);
  // \text{..}, \mathrm{..} va h.k. — ichidagi matn; \mathbb{R} → ℝ
  s = s.replace(/\\(?:text|textrm|textbf|textit|mathrm|mathbf|mathit|mathsf|operatorname|mbox|textnormal)\s*\{([^{}]*)\}/g, "$1")
    .replace(/\\mathbb\s*\{?([A-Z])\}?/g, (m, c) => BB[c] || c)
    .replace(/\\ce\s*\{([^{}]*)\}/g, (m, f) => f.replace(/([A-Za-z\)])(\d+)/g, (q, a, n) => a + supStr(n, SUB, "_")))
    .replace(/\\begin\{[a-z*]+\}(\{[^{}]*\})?|\\end\{[a-z*]+\}/g, "").replace(/\\\\/g, "\n").replace(/&/g, "");
  let out = "", i = 0, guard = 0;
  while (i < s.length && guard++ < 20000) {
    const c = s[i];
    if (c === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(s.slice(i)); if (!m) { i++; continue; }
      const nm = m[1]; i += m[0].length;
      if (nm === "frac" || nm === "dfrac" || nm === "tfrac" || nm === "cfrac") { const a = grp(s, i); const b = grp(s, a[1]); i = b[1]; out += wrap(lxMath(a[0])) + "/" + wrap(lxMath(b[0])); continue; }
      if (nm === "sqrt") {
        let n = ""; while (s[i] === " ") i++;
        if (s[i] === "[") { const j = s.indexOf("]", i); n = s.slice(i + 1, j); i = j + 1; }
        const a = grp(s, i); i = a[1]; const v = lxMath(a[0]).trim();
        out += (n === "3" ? "∛" : n === "4" ? "∜" : n ? supStr(lxMath(n), SUP, "^") + "√" : "√") + (/^[\w.,]+$/.test(v) && v.length <= 6 ? v : "(" + v + ")"); continue;
      }
      if (nm === "binom") { const a = grp(s, i); const b = grp(s, a[1]); i = b[1]; out += "C(" + lxMath(a[0]) + ", " + lxMath(b[0]) + ")"; continue; }
      if (nm === "overline" || nm === "bar") { const a = grp(s, i); i = a[1]; const v = lxMath(a[0]); out += [...v].length === 1 ? v + "̄" : [...v].map(ch => ch + "̅").join(""); continue; }
      if (nm === "vec" || nm === "overrightarrow") { const a = grp(s, i); i = a[1]; const v = lxMath(a[0]); out += [...v].length === 1 ? v + "⃗" : v + "⃗"; continue; }
      if (nm === "hat" || nm === "widehat") { const a = grp(s, i); i = a[1]; out += lxMath(a[0]) + "̂"; continue; }
      if (nm === "dot") { const a = grp(s, i); i = a[1]; out += lxMath(a[0]) + "̇"; continue; }
      if (nm === "boxed" || nm === "fbox") { const a = grp(s, i); i = a[1]; out += "【" + lxMath(a[0]).trim() + "】"; continue; }
      if (nm === "underbrace" || nm === "overbrace" || nm === "underline" || nm === "phantom" || nm === "tag") { const a = grp(s, i); i = a[1]; out += nm === "tag" ? "   (" + lxMath(a[0]) + ")" : nm === "phantom" ? "" : lxMath(a[0]); continue; }
      if (nm === "lim" || nm === "sum" || nm === "prod" || nm === "int" || nm === "max" || nm === "min") { out += LX[nm] || nm; continue; }
      if (nm === "%" || nm === "$" || nm === "#" || nm === "&" || nm === "_" || nm === "{" || nm === "}") { out += nm; continue; }
      if (nm === "," || nm === ":" || nm === ";" || nm === " " || nm === ">") { out += " "; continue; }
      if (nm === "!") continue;
      out += LX[nm] != null ? LX[nm] : nm;
      continue;
    }
    if (c === "^" || c === "_") {
      const a = grp(s, i + 1); i = a[1];
      const v = lxMath(a[0]);
      out += c === "^" ? (/^\s*(\\circ|°)\s*$/.test(a[0]) || v === "°" ? "°" : supStr(v, SUP, "^")) : supStr(v, SUB, "_");
      continue;
    }
    if (c === "{" || c === "}") { i++; continue; }
    if (c === "~") { out += " "; i++; continue; }
    out += c; i++;
  }
  return out.replace(/[ \t]{2,}/g, " ").replace(/ *\n */g, "\n").trim();
}
// matndagi formulalarni ($…$, $$…$$, \(…\), \[…\]) Unicode'ga o'giradi; kod bloklari tegilmaydi
function lxMatn(t) {
  return String(t).replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, (m, a, b) => "\n" + lxMath(a || b) + "\n")
    .replace(/\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g, (m, a, b) => lxMath(a != null ? a : b))
    // dollarsiz qolib ketgan buyruqlar
    .replace(/\\(frac|dfrac|sqrt|cdot|times|div|pm|le|leq|ge|geq|ne|neq|approx|infty|pi|alpha|beta|gamma|Delta|delta|theta|lambda|mu|sigma|omega|Rightarrow|Leftrightarrow|to|in|cup|cap|angle|triangle|circ|degree)\b(\s*\{[^{}]*\}(\s*\{[^{}]*\})?)?/g, m => lxMath(m));
}
// kod bloklari (```…```) ichidagi LaTeX o'zgarmaydi — foydalanuvchi LaTeX kodini so'ragan bo'lishi mumkin
function lxTashqi(md) { return String(md).split(/(```[\s\S]*?(?:```|$))/).map((seg, i) => i % 2 ? seg : lxMatn(seg)).join(""); }
function h(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
// bitta qator: **qalin**, *kursiv*, `kod`, [matn](havola)
function mdQator(t) {
  return h(t).replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*\n]+?)\*\*|__([^_\n]+?)__/g, (m, a, b) => "<b>" + (a || b) + "</b>")
    .replace(/(^|[\s(«"])\*(?!\s)([^*\n]+?)(?<!\s)\*(?=[\s).,!?:;»"]|$)/g, "$1<i>$2</i>")
    .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, a, u) => '<a href="' + u.replace(/"/g, "%22") + '">' + a + "</a>");
}
// Markdown matn → Telegram HTML paragraflar ro'yxati (har biri o'z teglarini yopadi)
function mdBloklar(md) {
  const L = lxTashqi(md).replace(/\r/g, "").split("\n"), out = [];
  let cur = [], kod = null, jad = null;
  const tugat = () => { if (cur.length) { out.push(cur.join("\n")); cur = []; } };
  const jTugat = () => {
    if (!jad) return;
    const rows = jad.filter(r => !/^\s*\|?\s*:?-{2,}/.test(r)).map(r => r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map(x => x.replace(/\*\*/g, "").trim()));
    const w = []; rows.forEach(r => r.forEach((c, k) => { w[k] = Math.min(24, Math.max(w[k] || 0, [...c].length)); }));
    tugat(); out.push("<pre>" + h(rows.map(r => r.map((c, k) => c + " ".repeat(Math.max(0, w[k] - [...c].length))).join("  ")).join("\n")) + "</pre>"); jad = null;
  };
  for (const raw of L) {
    if (kod != null) { if (/^\s*```/.test(raw)) { tugat(); out.push("<pre>" + h(kod.join("\n")) + "</pre>"); kod = null; } else kod.push(raw); continue; }
    if (/^\s*```/.test(raw)) { jTugat(); tugat(); kod = []; continue; }
    if (/^\s*\|.*\|\s*$/.test(raw)) { if (!jad) jad = []; jad.push(raw); continue; } else jTugat();
    const t = raw.replace(/\s+$/, "");
    if (!t.trim()) { tugat(); continue; }
    let m;
    if ((m = /^\s*#{1,6}\s+(.*)$/.exec(t))) { tugat(); cur.push("<b>" + mdQator(m[1].replace(/\*\*/g, "")) + "</b>"); continue; }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(t)) { tugat(); out.push("———"); continue; }
    if ((m = /^(\s*)[-*+•]\s+(.*)$/.exec(t))) { cur.push((m[1].length >= 2 ? "   ◦ " : "• ") + mdQator(m[2])); continue; }
    if ((m = /^\s*>\s?(.*)$/.exec(t))) { cur.push("┃ " + mdQator(m[1])); continue; }
    cur.push(mdQator(t));
  }
  if (kod != null) out.push("<pre>" + h(kod.join("\n")) + "</pre>");
  jTugat(); tugat();
  return out;
}
function tgHtml(text, fikr, ms) {
  const javob = tozaJavob(text);
  const bl = mdBloklar(javob || "…");
  const parts = [];
  if (fikr && String(fikr).trim()) {
    const f = qisqart(lxMatn(tozaJavob(fikr)).replace(/^#{1,6}\s*/gm, "").replace(/\*\*/g, "").replace(/_([^_\n]+)_/g, "$1"), 2600);
    parts.push("<blockquote expandable>🧠 <b>Fikrlash" + (ms ? " · " + Math.max(1, Math.round(ms / 1000)) + " s" : "") + "</b>\n" + h(f) + "</blockquote>");
  }
  for (const b of bl) {
    if (b.length <= 3900) { parts.push(b); continue; }
    // juda uzun paragraf — qatorlarga bo'lamiz (teglar qator ichida yopiladi)
    let acc = "";
    for (const ln of b.split("\n")) { if (acc && acc.length + ln.length + 1 > 3900) { parts.push(acc); acc = ""; } acc += (acc ? "\n" : "") + (ln.length > 3900 ? ln.slice(0, 3890) + "…" : ln); }
    if (acc) parts.push(acc);
  }
  const chunks = []; let c = "";
  for (const p of parts) { if (c && c.length + p.length + 2 > 4000) { chunks.push(c); c = ""; } c += (c ? "\n\n" : "") + p; }
  if (c) chunks.push(c);
  return chunks;
}

/* ---------- Groq Whisper: o'quvchi ovozini matnga (WAV, 16 kHz) ---------- */
async function gstt(req, env, url, cors) {
  if (!env.GROQ_KEY) return json({ error: "GROQ_KEY sozlanmagan" }, 503, cors);
  const q = url.searchParams.get("lang") || "uz";
  const lang = q === "auto" || url.searchParams.get("auto") === "1" ? "" : { "uz-UZ": "uz", "en-US": "en", "en-GB": "en", "ru-RU": "ru", uz: "uz", en: "en", ru: "ru" }[q] || "uz";
  const audio = await req.arrayBuffer();
  if (!audio.byteLength) return json({ error: "ovoz yo'q" }, 400, cors);
  if (audio.byteLength > 1900000) return json({ error: "ovoz juda uzun (60 soniyagacha)" }, 413, cors);
  let r = await whisper(env, audio, lang);
  // til avto: o'zbekchani Whisper ba'zan turkcha/qozoqcha deb o'ylaydi — o'zbekcha deb qayta tinglaymiz
  if (r.ok && !lang && !/^(en|ru|uz)$/.test(r.lang)) r = await whisper(env, audio, "uz");
  if (!r.ok) return json({ error: "groq " + r.err }, /^429/.test(r.err) ? 429 : 502, cors);
  return json({ text: r.text, lang: r.lang, model: r.model }, 200, cors);
}
const WL = { english: "en", en: "en", russian: "ru", ru: "ru", uzbek: "uz", uz: "uz" };
async function whisper(env, audio, lang) {
  let last = "";
  for (const model of G_STT) {
    const fd = new FormData();
    fd.append("file", new Blob([audio], { type: "audio/wav" }), "ovoz.wav");
    fd.append("model", model); fd.append("response_format", lang ? "json" : "verbose_json"); fd.append("temperature", "0");
    if (lang) fd.append("language", lang);
    if (lang === "uz") fd.append("prompt", "O'zbekcha, lotin yozuvida.");
    const r = await fetch(GROQ + "/audio/transcriptions", { method: "POST", headers: { "Authorization": "Bearer " + env.GROQ_KEY }, body: fd });
    if (r.ok) {
      const j = await r.json().catch(() => ({}));
      let t = String(j.text || "").trim(), l = lang;
      if (!l) {
        const d = String(j.language || "").toLowerCase();
        l = WL[d] || (d ? d : /[ўқғҳ]/i.test(t) ? "uz" : /[а-яё]/i.test(t) ? "ru" : /[şçğıöü]/i.test(t) ? "tr" : /(o'|g'|oʻ|gʻ)/i.test(t) ? "uz" : "en");
      }
      if (l === "uz") t = cyr2lat(t);
      if (/^o'zbekcha,? lotin yozuvida\.?$/i.test(t)) t = ""; // jimlikda Whisper ko'rsatmani qaytarib qo'yadi
      return { ok: true, text: t, lang: l, model };
    }
    last = r.status + " " + (await r.text().catch(() => "")).slice(0, 160);
    if (r.status === 401 || r.status === 403) break;
  }
  return { ok: false, err: last };
}
// Whisper ba'zan o'zbekchani kirillda yozadi — lotinga o'giramiz
const C2L = { "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "j", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "x", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sh", "ъ": "'", "ь": "", "ы": "i", "э": "e", "ю": "yu", "я": "ya", "ў": "o'", "қ": "q", "ғ": "g'", "ҳ": "h" };
function cyr2lat(t) {
  if (!/[а-яёўқғҳ]/i.test(t)) return t;
  return t.replace(/(^|[\s"«(-])е/g, "$1ye").replace(/(^|[\s"«(-])Е/g, "$1Ye").replace(/[а-яёўқғҳ]/gi, ch => {
    const lo = ch.toLowerCase(), v = C2L[lo]; if (v === undefined) return ch;
    return ch === lo ? v : v.charAt(0).toUpperCase() + v.slice(1);
  });
}

function json(o, s, cors) { return new Response(JSON.stringify(o), { status: s, headers: Object.assign({ "Content-Type": "application/json; charset=utf-8" }, cors) }); }
function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
function clamp(v, a, b) { return Math.max(a, Math.min(b, Math.round(v))); }
function sign(v) { return (v >= 0 ? "+" : "") + v; }
