// Math Royale savol generatori uchun test: node tools/royale-savol-test.js [soni]
// Har bir sinf x mavzu uchun N ta savol yaratadi va javobni MUSTAQIL hisoblab tekshiradi.
"use strict";
const path = require("path");
const R = require(path.join(__dirname, "..", "royale-savol.js"));
const N = +process.argv[2] || 5000;
const MINUS = "−";
const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };

// ---------- Mustaqil ifoda hisoblagich ----------
function tokenize(s) {
  s = s.replace(/−/g, "-").replace(/(\d) (?=\d{3}(?!\d))/g, "$1"); // minglik bo'shliq
  const t = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " ") { i++; continue; }
    if (/\d/.test(c)) { let j = i; while (j < s.length && /[\d,]/.test(s[j])) j++; t.push({ k: "n", v: +s.slice(i, j).replace(",", ".") }); i = j; continue; }
    if (SUP[c] !== undefined) { let j = i, e = ""; while (j < s.length && SUP[s[j]] !== undefined) { e += SUP[s[j]]; j++; } t.push({ k: "pow", v: +e }); i = j; continue; }
    if (c === "x") { t.push({ k: "x" }); i++; continue; }
    if (c === "π") { t.push({ k: "n", v: Math.PI }); i++; continue; }
    if (c === "√") { t.push({ k: "sqrt" }); i++; continue; }
    if (c === "∛") { t.push({ k: "cbrt" }); i++; continue; }
    if (c === "/") { t.push({ k: "op", v: "/" }); i++; continue; }  // zich bo'lish (kasr chizig'i)
    if (c === "×" || c === "·") { t.push({ k: "op", v: "*" }); i++; continue; }
    if (c === ":") { t.push({ k: "op", v: ":" }); i++; continue; }
    if ("+-()=".includes(c)) { t.push({ k: "op", v: c }); i++; continue; }
    throw new Error("Nomalum belgi '" + c + "' in " + s);
  }
  return t;
}
function evalExpr(s, x) {
  const t = tokenize(s); let p = 0;
  const peek = () => t[p], eat = () => t[p++];
  function isOp(v) { return peek() && peek().k === "op" && peek().v === v; }
  function sum() { let v = prod(); while (isOp("+") || isOp("-")) { const o = eat().v; const r = prod(); v = o === "+" ? v + r : v - r; } return v; }
  function prod() { let v = unary(); while (isOp("*") || isOp(":")) { const o = eat().v; const r = unary(); v = o === "*" ? v * r : v / r; } return v; }
  function unary() { if (isOp("-")) { eat(); return -unary(); } if (isOp("+")) { eat(); return unary(); } return frac(); }
  function frac() { let v = implicit(); while (isOp("/")) { eat(); v = v / implicit(); } return v; }
  function implicit() { // 3x, 2(x-1), 3√2
    let v = power();
    while (peek() && (peek().k === "x" || peek().k === "sqrt" || peek().k === "cbrt" || (peek().k === "op" && peek().v === "("))) v = v * power();
    return v;
  }
  function power() { let v = atom(); while (peek() && peek().k === "pow") v = Math.pow(v, eat().v); return v; }
  function atom() {
    const k = eat(); if (!k) throw new Error("Ifoda tugadi: " + s);
    if (k.k === "n") return k.v;
    if (k.k === "x") { if (x === undefined) throw new Error("x kutilmagan"); return x; }
    if (k.k === "sqrt") return Math.sqrt(power());
    if (k.k === "cbrt") return Math.cbrt(power());
    if (k.k === "op" && k.v === "(") { const v = sum(); if (!isOp(")")) throw new Error(") yo'q: " + s); eat(); return v; }
    if (k.k === "op" && k.v === "-") return -power();
    throw new Error("Kutilmagan token " + JSON.stringify(k) + " in " + s);
  }
  const v = sum(); if (p !== t.length) throw new Error("Ortiqcha tokenlar: " + s); return v;
}
function solveLinear(e) {
  const [L, Rr] = e.split("=");
  const f = (x) => evalExpr(L, x) - evalExpr(Rr, x);
  const f0 = f(0), f1 = f(1), f2 = f(2);
  if (Math.abs((f2 - f1) - (f1 - f0)) > 1e-9) throw new Error("Chiziqli emas: " + e);
  if (Math.abs(f1 - f0) < 1e-12) throw new Error("Yechim yo'q: " + e);
  return -f0 / (f1 - f0);
}
const WORD = {
  fracOf: p => p.n * p.a / p.b, simp: p => p.n / p.d, dec: p => p.x, pctOf: p => p.n * p.p / 100, whatPct: p => p.a / p.b * 100,
  chg: p => p.n * (1 + p._s * p.p / 100), whole: p => p.a * 100 / p.p, succ: p => ((1 + p.p / 100) * (1 - p.p / 100) - 1) * 100,
  sumdiff: p => (p.s + p.d) / 2, rectP: p => 2 * (p.a + p.b), rectS: p => p.a * p.b, sqP: p => 4 * p.a, sqS: p => p.a * p.a,
  triAng: p => 180 - p.a - p.b, cubeV: p => p.a ** 3, boxV: p => p.a * p.b * p.c, adj: p => 180 - p.a, iso: p => (180 - p.a) / 2,
  right: p => 90 - p.a, triS: p => p.a * p.h / 2, parS: p => p.a * p.h, trapS: p => (p.a + p.b) * p.h / 2, circC: p => 2 * Math.PI * p.r,
  circS: p => Math.PI * p.r * p.r, cylV: p => Math.PI * p.r * p.r * p.h, coneV: p => Math.PI * p.r * p.r * p.h / 3,
  polySum: p => (p.n - 2) * 180, regAng: p => (p.n - 2) * 180 / p.n, hyp: p => Math.hypot(p.a, p.b), leg: p => Math.sqrt(p.c * p.c - p.a * p.a),
  dist: p => Math.hypot(p.x2 - p.x1, p.y2 - p.y1), rhomb: p => p.a * p.b / 2, div: p => p.a / p.b,
  rectSfromP: p => p.a * (p.P / 2 - p.a), pctRestDiv: p => p.n * (1 - p.p / 100) / p.k
};
// Javob matnini songa aylantirish va formatini tekshirish
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
function parseAns(s) {
  let t = s.replace(/−/g, "-");
  if (/^-?\d{1,3}( \d{3})+/.test(t)) t = t.replace(/(\d) (?=\d{3})/g, "$1");
  let m;
  if ((m = /^([+-]?\d+)(°|%)$/.exec(t))) return { v: +m[1], kind: m[2] };
  if ((m = /^(-?\d+)\/(\d+)$/.exec(t))) {
    const n = +m[1], d = +m[2];
    if (d <= 1) throw new Error("Maxraj <=1: " + s);
    if (gcd(n, d) !== 1) throw new Error("Qisqarmagan kasr: " + s);
    return { v: n / d, kind: "frac" };
  }
  if ((m = /^(\d*)π$/.exec(t))) { const k = m[1] === "" ? 1 : +m[1]; if (m[1] === "1") throw new Error("1π: " + s); return { v: k * Math.PI, kind: "pi" }; }
  if ((m = /^(-?\d*)√(\d+)$/.exec(t))) {
    const a = m[1] === "" ? 1 : m[1] === "-" ? -1 : +m[1], b = +m[2];
    for (let k = 2; k * k <= b; k++) if (b % (k * k) === 0) throw new Error("Ildiz soddalashmagan: " + s);
    return { v: a * Math.sqrt(b), kind: "root" };
  }
  if ((m = /^-?\d+$/.exec(t))) { if (/^-0$/.test(t)) throw new Error("-0"); return { v: +t, kind: "int" }; }
  throw new Error("Javob formati noto'g'ri: '" + s + "'");
}
function close(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }

function check(q, label, nOpt) {
  nOpt = nOpt || 4;
  const errs = [];
  if (!q || typeof q.text !== "string" || !q.text) errs.push("matn yo'q");
  if (/undefined|NaN|null|\?\?|Infinity/.test(q.text + q.explain + q.options.join("|"))) errs.push("yomon matn: " + q.text + " | " + q.options.join(", ") + " | " + q.explain);
  if (!Array.isArray(q.options) || q.options.length !== nOpt) errs.push("variantlar soni " + (q.options && q.options.length));
  if (new Set(q.options).size !== q.options.length) errs.push("takroriy variant matni");
  if (q.options[q.correct] !== q.answer) errs.push("correct indeks noto'g'ri");
  if (q.options.filter(o => o === q.answer).length !== 1) errs.push("javob variantlarda bitta emas");
  if (!q.explain) errs.push("izoh yo'q");
  let ans, vals = [];
  try {
    ans = parseAns(q.answer);
    vals = q.options.map(o => parseAns(o).v);
    for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) if (close(vals[i], vals[j])) errs.push("qiymati teng variantlar: " + q.options[i] + " ~ " + q.options[j]);
  } catch (e) { errs.push(e.message); }
  if (ans && !close(ans.v, q.value)) errs.push("value mos emas");
  // Mustaqil hisob
  try {
    let truth;
    const m = q.meta;
    if (m.k === "expr") truth = evalExpr(m.e);
    else if (m.k === "eq") truth = solveLinear(m.e);
    else if (m.k === "w") { if (!WORD[m.f]) throw new Error("WORD yo'q: " + m.f); truth = WORD[m.f](m.p); }
    else throw new Error("meta yo'q");
    if (!isFinite(truth)) throw new Error("hisob cheksiz");
    if (ans && !close(ans.v, truth)) errs.push("JAVOB XATO: '" + q.text + "' javob=" + q.answer + " haqiqiy=" + truth);
    // so'z masalasi matnida qiymatlar borligini tekshirish (birinchi raqam)
    if (m.k === "expr" && q.text.indexOf(m.e) !== 0) errs.push("ifoda matnda yo'q");
  } catch (e) { errs.push("hisob: " + e.message + " [" + q.text + "]"); }
  if (q.text.length > 160) errs.push("matn juda uzun: " + q.text.length);
  q.options.forEach(o => { if (o.length > 14) errs.push("variant uzun: " + o); });
  if (errs.length) { const e = new Error(label + ": " + errs.join("; ") + "\n   Q=" + JSON.stringify({ t: q.text, a: q.answer, o: q.options })); throw e; }
}

let total = 0, fails = 0;
const stats = {};
const grades = R.grades.map(g => g[0]), topics = R.topics.map(t => t[0]);
const t0 = Date.now();
for (const gr of grades) for (const tp of topics) {
  const seen = new Set(); const kinds = {};
  for (let i = 0; i < N; i++) {
    const level = 1 + (i % 5);
    const q = R.next({ grade: gr, topic: tp, level });
    total++;
    try { check(q, gr + "/" + tp + "/L" + level); seen.add(q.text); kinds[q.topic] = (kinds[q.topic] || 0) + 1; }
    catch (e) { fails++; if (fails <= 25) console.error("XATO " + e.message); }
    if (tp !== "aralash" && q.topic !== tp) { fails++; if (fails <= 25) console.error("Mavzu mos emas " + tp + " -> " + q.topic); }
  }
  stats[gr + "/" + tp] = seen.size;
}
// tez va boss savollar
for (const gr of grades) for (let L = 1; L <= 5; L++) for (let i = 0; i < 1000; i++) {
  total++;
  try { check(R.quick({ grade: gr, level: L }), "quick/" + gr, 3); } catch (e) { fails++; if (fails <= 25) console.error("XATO " + e.message); }
  total++;
  try {
    const b = R.boss({ grade: gr, level: L }); check(b, "boss/" + gr);
    if (!b.steps || b.steps.length < 2) throw new Error("boss bosqichlari yo'q");
    b.steps.forEach((s, k) => check(s, "boss-step" + k + "/" + gr));
    if (b.steps[b.steps.length - 1].answer !== b.answer) throw new Error("boss oxirgi bosqich javobi mos emas: " + b.text + " " + b.answer + " vs " + b.steps[b.steps.length - 1].answer);
  } catch (e) { fails++; if (fails <= 25) console.error("XATO boss " + e.message); }
}
// normGrade
const ng = [["5", "5-6"], ["6-sinf", "5-6"], ["7-8", "7-8"], ["9–11", "9-11"], ["11", "9-11"], ["Texnikum", "texnikum"], ["texnikum", "texnikum"]];
ng.forEach(([i, o]) => { total++; if (R.normGrade(i) !== o) { fails++; console.error("normGrade(" + i + ") = " + R.normGrade(i) + " != " + o); } });

console.log("Har bir mavzu/sinf bo'yicha noyob savollar (" + N + " tadan):");
Object.keys(stats).forEach(k => console.log("  " + k.padEnd(22) + stats[k]));
console.log("\nJami tekshirildi: " + total + ", xato: " + fails + ", vaqt: " + (Date.now() - t0) + " ms");
process.exit(fails ? 1 : 0);
