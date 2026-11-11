/**
 * Kuvonch Academy — «Kuvi ovoz serveri» (Cloudflare Worker, bepul tarif yetadi)
 *
 * Nima qiladi: Microsoft Azure Speech orqali
 *   POST /tts  — matnni o'zbekcha tabiiy ovozga aylantiradi (Madina — ayol, Sardor — erkak; inglizcha/ruscha ham)
 *   POST /stt  — o'quvchi ovozini (WAV, 16 kHz) matnga aylantiradi (o'zbek/ingliz/rus)
 *   GET  /ping — server ishlayaptimi
 * Azure kaliti shu serverda yashirin turadi, saytning ochiq kodida ko'rinmaydi.
 *
 * O'rnatish (Cloudflare → Workers & Pages → Create → Worker):
 *   1) Shu kodni «Edit code» oynasiga qo'yib, Deploy bosing.
 *   2) Settings → Variables and Secrets:
 *        AZ_REGION = swedencentral        (Azure Speech resursi turgan hudud, Text turi; resurs: kuvonch-ovoz, Sweden Central)
 *        AZ_KEY    = <Azure KEY 1>        (Secret turi — hech kimga ko'rinmaydi)
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
const LIMIT = 150, WINDOW = 10 * 60 * 1000; // bitta IP: 10 daqiqada 150 so'rov (taxminiy himoya)
const hits = new Map();

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const ok = ORIGINS.includes(origin);
    const cors = { "Access-Control-Allow-Origin": ok ? origin : ORIGINS[0], "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(req.url);
    if (url.pathname === "/ping") return json({ ok: true, region: env.AZ_REGION || "", key: !!env.AZ_KEY }, 200, cors);
    if (!ok) return json({ error: "ruxsat yo'q" }, 403, cors);
    if (!env.AZ_KEY || !env.AZ_REGION) return json({ error: "AZ_KEY yoki AZ_REGION sozlanmagan" }, 500, cors);
    const ip = req.headers.get("CF-Connecting-IP") || "?", now = Date.now(), h = hits.get(ip) || { t: now, n: 0 };
    if (now - h.t > WINDOW) { h.t = now; h.n = 0; }
    if (++h.n > LIMIT) return json({ error: "juda ko'p so'rov, biroz kuting" }, 429, cors);
    hits.set(ip, h); if (hits.size > 5000) hits.clear();
    try {
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

function json(o, s, cors) { return new Response(JSON.stringify(o), { status: s, headers: Object.assign({ "Content-Type": "application/json; charset=utf-8" }, cors) }); }
function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
function clamp(v, a, b) { return Math.max(a, Math.min(b, Math.round(v))); }
function sign(v) { return (v >= 0 ? "+" : "") + v; }
