// Kuvi'ning oflayn javoblari va viktorina reaksiyalarini ko'p marta "o'ynab", eng ko'p takrorlanadigan gaplarni yig'adi
const vm = require("vm"), fs = require("fs"), R = "/home/claude/quvnoqdombogchalar/";
const store = {};
const ctx = { console, Math, Date, JSON, String, Number, Array, Object, RegExp, parseInt, parseFloat, isNaN, setTimeout(){}, clearTimeout(){},
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => store[k] = String(v), removeItem: k => delete store[k] },
  document: { addEventListener(){}, createElement(){ return { appendChild(){}, setAttribute(){} } }, createTextNode(){ return {} }, head: { appendChild(){} }, documentElement: { appendChild(){} }, hidden: false },
  navigator: { userAgent: "node", platform: "", maxTouchPoints: 0 }, location: { origin: "https://kuvonch.uz", hostname: "kuvonch.uz" } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ["ka-kuvi.js", "ka-ustoz-bilim.js"]) vm.runInContext(fs.readFileSync(R + f, "utf8"), ctx, { filename: f });
const Y = ctx.kaYuz, B = ctx.kaUstozBilim;
const cnt = new Map(), mood = new Map();
const PETS = new Set(); ["boy", "girl", "x"].forEach(g => { for (let i = 0; i < 400; i++) PETS.add(Y.pet(g).toLowerCase()); });
function add(s, m) { const k = s.trim(); if (!k) return; cnt.set(k, (cnt.get(k) || 0) + 1); if (!mood.has(k)) mood.set(k, m || "neutral"); }
function sentences(text, m) {
  // qo'shtirnoq ichidagilar alohida bo'lak (boshqa tilda o'qilishi mumkin) — ularni o'tkazib yuboramiz
  String(text).split(/("[^"]*"|«[^»]*»)/).forEach(seg => {
    if (!seg || /^["«]/.test(seg) || /[а-яё]/i.test(seg)) return;
    (seg.match(/[^.!?…]+[.!?…]*["»”]?\s*/g) || []).forEach(p => {
      p = p.trim(); if (!p) return;
      const mm = p.match(/^(.+?),\s*([^,]+?)([!.?])$/);
      if (mm && PETS.has(mm[2].toLowerCase())) { add(mm[1] + ",", m); add(mm[2] + "!", m); }
      else add(p, m);
    });
  });
}
// 1) viktorina reaksiyalari
for (let i = 0; i < 6000; i++) for (const k of ["ok", "bad", "timeout", "cGood", "cMid", "cBad"]) {
  const r = Y.react(k, { tz: i % 2, n: i % 9, sg: ["boy", "girl", ""][i % 3] }); sentences(r.text, r.mood);
}
// 2) AI ustozning oflayn suhbatlari
const modes = ["free", "math", "qosh", "logic", "en", "ru", "ielts"];
for (const md of modes) for (let run = 0; run < 25; run++) {
  const c = { mode: md, sg: ["boy", "girl", ""][run % 3], sinf: String(5 + run % 7), st: {}, tease: run % 2 === 0, name: run % 4 ? "" : "Ali", bank: [], xato: [] };
  let r = B.start(c); sentences(r.t, r.mood);
  if (!c.name) { r = B.reply("Ali", c); sentences(r.t, r.mood); }
  for (let i = 0; i < 60; i++) {
    const cur = c.st.cur; let a;
    const x = Math.random();
    if (!cur) a = "keyingi";
    else if (x < .55) a = cur.k === "tr" ? cur.a[0] : cur.k === "mc" ? "ABCD"[cur.ci] : String(cur.a);
    else if (x < .8) a = cur.k === "mc" ? "ABCD"[(cur.ci + 1) % 4] : cur.k === "tr" ? "xyz abc" : "0";
    else if (x < .9) a = "bilmayman"; else a = ["yordam", "keyingi", "salom", "zerikdim"][i % 4];
    try { r = B.reply(a, c); sentences(r.t, r.mood); } catch (e) {}
  }
}
// 3) tezkor gaplar
["Hmm…", "Xo'sh…", "Bir soniya…", "Keling, chuqurroq o'ylab ko'ray…", "Rasmni ko'ryapman… hozir yechamiz."].forEach(t => sentences(t, "think"));
const all = [...cnt.entries()].sort((a, b) => b[1] - a[1]);
const EN = /\b(the|you|your|who|what|and|why|describe|say|tell|how|did|is|are|was|were|it|they|about)\b/i;
// pets: hammasi kutubxonaga (har biri «!» bilan)
PETS.forEach(p => { if (!cnt.has(p + "!")) { cnt.set(p + "!", 5); mood.set(p + "!", "happy"); } });
const keep = all.concat([...PETS].map(p => [p + "!", 5])).filter(([s, n], i, a) => a.findIndex(x => x[0] === s) === i)
  .filter(([s, n]) => (n >= 5 || /…$/.test(s)) && s.length <= 120 && !/\d/.test(s) && !/[=:]\s*$/.test(s) && !EN.test(s) && /[a-z]/i.test(s));
fs.writeFileSync("phrases.json", JSON.stringify(keep.map(([s, n]) => ({ t: s, n, m: mood.get(s) })), null, 1));
console.log("jami noyob gaplar:", all.length, "| kutubxonaga:", keep.length, "| belgilar:", keep.reduce((a, [s]) => a + s.length, 0));
console.log(keep.slice(0, 40).map(([s, n]) => n + "  " + s).join("\n"));
console.log("...\n" + keep.slice(-15).map(([s, n]) => n + "  " + s).join("\n"));
