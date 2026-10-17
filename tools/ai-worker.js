/**
 * Kuvonch Academy — AI proxy (Cloudflare Worker, BEPUL tarif: kuniga 100 000 so'rov)
 *
 * Nima uchun kerak: Gemini API kalitini saytga (GitHub Pages) ochiq qo'yib bo'lmaydi —
 * hamma ko'radi. Worker kalitni o'zida saqlaydi, sayt esa faqat Worker manziliga murojaat qiladi.
 *
 * O'RNATISH (5 daqiqa, karta kerak emas):
 *  1. https://aistudio.google.com/apikey — "Create API key" (bepul Gemini kalit)
 *  2. https://dash.cloudflare.com → Workers & Pages → Create → "Hello World" → nomi: kuvonch-ai
 *  3. "Edit code" — shu faylning hammasini qo'yib, Deploy
 *  4. Worker → Settings → Variables and Secrets → Add: nomi GEMINI_KEY, qiymati — 1-qadamdagi kalit (Secret) → Deploy
 *  5. Worker manzili (masalan https://kuvonch-ai.USERNAME.workers.dev) ni ai-slayd.html ichidagi
 *     DEFAULT_WORKER = "" ga yozing (yoki sahifadagi ⚙️ bo'limiga kiriting).
 */
const ALLOW = ["https://kuvonch.uz", "https://www.kuvonch.uz", "https://quvonchbek99.github.io", "http://localhost:8766", "http://127.0.0.1:5500"];
const MODEL = "gemini-2.0-flash";

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOW.includes(origin) ? origin : ALLOW[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8"
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(req.url);
    if (req.method !== "POST" || url.pathname !== "/generate") return new Response(JSON.stringify({ ok: true, info: "Kuvonch Academy AI proxy. POST /generate" }), { headers: cors });
    if (!ALLOW.includes(origin)) return new Response(JSON.stringify({ error: "origin ruxsat etilmagan" }), { status: 403, headers: cors });
    if (!env.GEMINI_KEY) return new Response(JSON.stringify({ error: "GEMINI_KEY sozlanmagan" }), { status: 500, headers: cors });

    // oddiy himoya: so'rov hajmi
    const body = await req.text();
    if (body.length > 20000) return new Response(JSON.stringify({ error: "so'rov juda katta" }), { status: 413, headers: cors });

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${env.GEMINI_KEY}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body
    });
    const txt = await r.text();
    return new Response(txt, { status: r.status, headers: cors });
  }
};
