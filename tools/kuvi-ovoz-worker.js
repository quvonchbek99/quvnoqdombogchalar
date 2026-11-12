/**
 * Kuvonch Academy — «Kuvi ovoz serveri» (Cloudflare Worker, bepul tarif yetadi)
 *
 * Nima qiladi: Microsoft Azure Speech orqali
 *   POST /tts  — matnni o'zbekcha tabiiy ovozga aylantiradi (Madina — ayol, Sardor — erkak; inglizcha/ruscha ham)
 *   POST /stt  — o'quvchi ovozini (WAV, 16 kHz) matnga aylantiradi (o'zbek/ingliz/rus)
 *   POST /chat — Kuvi'ning «miyasi»: Groq (bepul, juda tez) — gpt-oss-120b, band bo'lsa Llama
 *   POST /gstt — o'quvchi ovozini Groq Whisper bilan matnga aylantiradi (bepul: kuniga ~8 soat ovoz)
 *   GET  /ping — server ishlayaptimi
 * Azure va Groq kalitlari shu serverda yashirin turadi, saytning ochiq kodida ko'rinmaydi.
 *
 * O'rnatish (Cloudflare → Workers & Pages → Create → Worker):
 *   1) Shu kodni «Edit code» oynasiga qo'yib, Deploy bosing.
 *   2) Settings → Variables and Secrets:
 *        AZ_REGION = swedencentral        (Azure Speech resursi turgan hudud, Text turi; resurs: kuvonch-ovoz, Sweden Central)
 *        AZ_KEY    = <Azure KEY 1>        (Secret turi — hech kimga ko'rinmaydi)
 *        GROQ_KEY  = <Groq API kaliti gsk_…> (Secret turi; console.groq.com → API Keys, kartasiz bepul)
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
const G_CHAT = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "openai/gpt-oss-20b", "llama-3.1-8b-instant"];
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
    if (url.pathname === "/ping") return json({ ok: true, region: env.AZ_REGION || "", key: !!env.AZ_KEY, groq: !!env.GROQ_KEY }, 200, cors);
    if (!ok) return json({ error: "ruxsat yo'q" }, 403, cors);
    const ip = req.headers.get("CF-Connecting-IP") || "?", now = Date.now(), h = hits.get(ip) || { t: now, n: 0 };
    if (now - h.t > WINDOW) { h.t = now; h.n = 0; }
    if (++h.n > LIMIT) return json({ error: "juda ko'p so'rov, biroz kuting" }, 429, cors);
    hits.set(ip, h); if (hits.size > 5000) hits.clear();
    try {
      if (url.pathname === "/chat" && req.method === "POST") return await chat(req, env, cors);
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
  if (!env.GROQ_KEY) return json({ error: "GROQ_KEY sozlanmagan" }, 503, cors);
  const b = await req.json().catch(() => ({}));
  const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-16)
    .map(m => ({ role: ["system", "user", "assistant"].includes(m && m.role) ? m.role : "user", content: String((m && m.content) || "").slice(0, 8000) }))
    .filter(m => m.content);
  if (!msgs.some(m => m.role === "user")) return json({ error: "xabar yo'q" }, 400, cors);
  const deep = !!b.deep, stream = b.stream !== false;
  let last = "";
  for (const model of G_CHAT) {
    const body = { model, messages: msgs, temperature: deep ? 0.6 : 0.85, max_completion_tokens: deep ? 2000 : 700, stream };
    // gpt-oss o'ylab javob beradi: oddiy suhbatda qisqa o'ylaydi (tez), «tushuntir»da chuqurroq; o'ylash matni javobga qo'shilmaydi
    if (model.startsWith("openai/gpt-oss")) { body.reasoning_effort = deep ? "medium" : "low"; body.include_reasoning = false; }
    const r = await fetch(GROQ + "/chat/completions", { method: "POST", headers: { "Authorization": "Bearer " + env.GROQ_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) {
      const h = Object.assign({ "X-Kuvi-Model": model, "Access-Control-Expose-Headers": "X-Kuvi-Model" }, cors);
      if (stream) return new Response(r.body, { headers: Object.assign({ "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store" }, h) });
      const j = await r.json().catch(() => ({}));
      return json({ text: ((((j.choices || [])[0] || {}).message || {}).content || "").trim(), model }, 200, h);
    }
    last = r.status + " " + (await r.text().catch(() => "")).slice(0, 160);
    if (r.status === 401 || r.status === 403) break; // kalit noto'g'ri — boshqa model ham ishlamaydi
  }
  return json({ error: "groq " + last }, /^429/.test(last) ? 429 : /^40[13]/.test(last) ? 401 : 502, cors);
}

/* ---------- Groq Whisper: o'quvchi ovozini matnga (WAV, 16 kHz) ---------- */
async function gstt(req, env, url, cors) {
  if (!env.GROQ_KEY) return json({ error: "GROQ_KEY sozlanmagan" }, 503, cors);
  const q = url.searchParams.get("lang") || "uz";
  const lang = { "uz-UZ": "uz", "en-US": "en", "en-GB": "en", "ru-RU": "ru", uz: "uz", en: "en", ru: "ru" }[q] || "uz";
  const audio = await req.arrayBuffer();
  if (!audio.byteLength) return json({ error: "ovoz yo'q" }, 400, cors);
  if (audio.byteLength > 1900000) return json({ error: "ovoz juda uzun (60 soniyagacha)" }, 413, cors);
  let last = "";
  for (const model of G_STT) {
    const fd = new FormData();
    fd.append("file", new Blob([audio], { type: "audio/wav" }), "ovoz.wav");
    fd.append("model", model); fd.append("language", lang); fd.append("response_format", "json"); fd.append("temperature", "0");
    if (lang === "uz") fd.append("prompt", "O'zbekcha, lotin yozuvida.");
    const r = await fetch(GROQ + "/audio/transcriptions", { method: "POST", headers: { "Authorization": "Bearer " + env.GROQ_KEY }, body: fd });
    if (r.ok) {
      const j = await r.json().catch(() => ({}));
      let t = String(j.text || "").trim();
      if (lang === "uz") t = cyr2lat(t);
      if (/^o'zbekcha,? lotin yozuvida\.?$/i.test(t)) t = ""; // jimlikda Whisper ko'rsatmani qaytarib qo'yadi
      return json({ text: t, model }, 200, cors);
    }
    last = r.status + " " + (await r.text().catch(() => "")).slice(0, 160);
    if (r.status === 401 || r.status === 403) break;
  }
  return json({ error: "groq " + last }, /^429/.test(last) ? 429 : 502, cors);
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
