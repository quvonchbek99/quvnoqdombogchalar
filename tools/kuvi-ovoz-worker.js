/**
 * Kuvonch Academy — «Kuvi ovoz serveri» (Cloudflare Worker, bepul tarif yetadi)
 *
 * Nima qiladi: Microsoft Azure Speech orqali
 *   POST /tts  — matnni o'zbekcha tabiiy ovozga aylantiradi (Madina — ayol, Sardor — erkak; inglizcha/ruscha ham)
 *   POST /stt  — o'quvchi ovozini (WAV, 16 kHz) matnga aylantiradi (o'zbek/ingliz/rus)
 *   POST /chat — Kuvi'ning «miyasi»: bir nechta provayder (pastda «Miyalar»). Kaliti qo'shilganlari ishlaydi,
 *                biri band yoki limiti tugasa — keyingisiga o'tadi. Chuqur fikrlash eng kuchlisidan boshlanadi.
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
 *        GEMINI_KEY     — aistudio.google.com → Get API key (Gemini Flash, bepul limit bilan)
 *        DEEPSEEK_KEY   — platform.deepseek.com (pullik, juda arzon)
 *        ANTHROPIC_KEY  — console.anthropic.com (Claude, pullik)   OPENAI_KEY — platform.openai.com (ChatGPT, pullik)
 *        PAID_DAILY     — pullik miyaga kuniga nechta chuqur so'rov (standart 400; asosiy chegarani provayder kabinetida qo'ying)
 *        Model nomini almashtirish (ixtiyoriy, vergul bilan): CLAUDE_MODEL, OPENAI_MODEL, DEEPSEEK_MODEL, GEMINI_MODEL, OR_MODELS
 *   3) Worker manzilini (https://kuvi-ovoz.<...>.workers.dev) sayt sozlamasiga yozamiz.
 * Azure'da «Free F0» tarifini tanlang: oyiga 500 000 belgi bepul, limitdan oshsa pul yechilmaydi — shunchaki to'xtaydi.
 */
const ORIGINS = ["https://kuvonch.uz", "https://www.kuvonch.uz", "https://quvonchbek99.github.io", "http://localhost:8765"];
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
    ["deepseek", "DEEPSEEK_MODEL", ["deepseek-v4-pro", "deepseek-reasoner", "deepseek-chat"]],
    ["gemini", "GEMINI_MODEL", ["gemini-2.5-flash"]],
    ["orouter", "OR_MODELS", ["deepseek/deepseek-v4-flash:free", "deepseek/deepseek-r1-0528:free", "deepseek/deepseek-chat-v3.1:free"]],
    ["groq", "", G_DEEP]
  ],
  fast: [["groq", "", G_CHAT], ["gemini", "GEMINI_FAST", ["gemini-2.5-flash-lite"]], ["orouter", "OR_FAST", ["deepseek/deepseek-v4-flash:free"]]]
};
const cool = new Map(); // band/limit tugagan model — bir muddat chetlab o'tiladi
const PAID = { day: "", n: 0 };
function paidOk(env) { const d = new Date().toISOString().slice(0, 10); if (PAID.day !== d) { PAID.day = d; PAID.n = 0; } return PAID.n < (+env.PAID_DAILY || 400); }
function provs(env) { const o = {}; for (const k in PROV) o[k] = !!env[PROV[k].key]; return o; }
const G_STT = ["whisper-large-v3", "whisper-large-v3-turbo"];
const LIMIT = 150, WINDOW = 10 * 60 * 1000; // bitta IP: 10 daqiqada 150 so'rov (taxminiy himoya)
const hits = new Map();

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const ok = ORIGINS.includes(origin);
    const cors = { "Access-Control-Allow-Origin": ok ? origin : ORIGINS[0], "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(req.url);
    if (url.pathname === "/ping") return json({ ok: true, region: env.AZ_REGION || "", key: !!env.AZ_KEY, groq: !!env.GROQ_KEY, brains: provs(env) }, 200, cors);
    if (!ok) return json({ error: "ruxsat yo'q" }, 403, cors);
    const ip = req.headers.get("CF-Connecting-IP") || "?", now = Date.now(), h = hits.get(ip) || { t: now, n: 0 };
    if (now - h.t > WINDOW) { h.t = now; h.n = 0; }
    if (++h.n > LIMIT) return json({ error: "juda ko'p so'rov, biroz kuting" }, 429, cors);
    hits.set(ip, h); if (hits.size > 5000) hits.clear();
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

/* ---------- Groq: Kuvi'ning miyasi (bepul tarif: kartasiz, daqiqasiga ~30 so'rov) ----------
   Sayt OpenAI ko'rinishidagi xabarlarni yuboradi: [{role: system|user|assistant, content}].
   Javob oqim (SSE) bo'lib qaytadi — Kuvi gapni yozilayotgan paytida o'qiy boshlaydi. */
async function chat(req, env, cors) {
  const b = await req.json().catch(() => ({}));
  const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-16)
    .map(m => ({ role: ["system", "user", "assistant"].includes(m && m.role) ? m.role : "user", content: String((m && m.content) || "").slice(0, 8000) }))
    .filter(m => m.content);
  if (!msgs.some(m => m.role === "user")) return json({ error: "xabar yo'q" }, 400, cors);
  const deep = !!b.deep, stream = b.stream !== false;
  // effort: low | medium | high — sayt so'ragan fikrlash kuchi; max — javob (o'ylash bilan birga) uchun token chegarasi
  const o = { deep, stream, effort: ["low", "medium", "high"].includes(b.effort) ? b.effort : deep ? "medium" : "low", maxT: Math.max(300, Math.min(8000, +b.max || (deep ? 4000 : 1000))) };
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
  const j = await res.r.json().catch(() => ({}));
  return json({ text: ((((j.choices || [])[0] || {}).message || {}).content || "").trim(), model: res.tag }, 200, h);
}
// har bir miyaning o'z sozlamalari (parametr nomlari biroz farq qiladi)
function bodyFor(p, model, msgs, o) {
  const b = { model, messages: msgs, stream: o.stream }, mx = o.maxT;
  if (p === "groq") {
    b.temperature = o.deep ? 0.6 : 0.85; b.max_completion_tokens = mx;
    // gpt-oss o'ylab javob beradi: oddiy suhbatda qisqa o'ylaydi (tez), «tushuntir»da chuqurroq; o'ylash matni javobga qo'shilmaydi
    if (model.startsWith("openai/gpt-oss")) { b.reasoning_effort = o.effort; b.include_reasoning = false; }
    else if (model.startsWith("qwen/qwen3")) { b.reasoning_format = "hidden"; b.reasoning_effort = o.deep ? "default" : "none"; b.max_completion_tokens = Math.min(mx, 4000); }
    else b.max_completion_tokens = Math.min(mx, 2500); // Llama/Kimi o'ylash tokenini sarflamaydi
  } else if (p === "orouter") {
    b.max_tokens = mx; b.temperature = 0.6; b.reasoning = { effort: o.effort === "high" ? "high" : "medium", exclude: true };
  } else if (p === "gemini") {
    b.max_tokens = mx; b.temperature = o.deep ? 0.6 : 0.85; b.reasoning_effort = o.deep ? (o.effort === "high" ? "high" : "medium") : "low";
  } else if (p === "deepseek") {
    b.max_tokens = Math.min(mx, 8000); if (!/reasoner|pro/.test(model)) b.temperature = 0.6;
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
