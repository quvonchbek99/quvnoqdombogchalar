/*! Kuvonch Academy — Math Royale savol generatori (royale-savol.js)
 *  RoyaleSavol.next({grade, topic, level}) -> {text, answer, options[4], correct, explain, topic, meta, value}
 *  RoyaleSavol.quick({grade, level})       -> {text, answer, options[3], correct, explain, meta, value}
 *  RoyaleSavol.boss({grade, level})        -> {text, answer, options[4], explain, steps:[{text,answer,options,...}]}
 *  grade: "5-6" | "7-8" | "9-11" | "texnikum";  topic: aralash | arifmetika | kasrlar | foizlar |
 *  tenglamalar | darajalar | geometriya;  level: 1..5 (sonlar kattalashadi).
 *  Barcha javoblar aniq (butun son, qisqarmas kasr, k·π, a√b, gradus yoki foiz),
 *  variantlar qiymati bo'yicha takrorlanmaydi; noto'g'ri variantlar odatiy xatolardan olinadi.
 */
(function (root) {
  "use strict";
  var M = "−"; // minus belgisi
  var SUPS = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
  function sup(n) { return String(n).split("").map(function (c) { return SUPS[c] || c; }).join(""); }

  var rnd = Math.random;
  function ri(a, b) { a = Math.ceil(a); b = Math.floor(b); if (b < a) b = a; return a + Math.floor(rnd() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  function chance(p) { return rnd() < p; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function isInt(n) { return typeof n === "number" && isFinite(n) && Math.floor(n) === n; }
  function fi(n) { // butun sonni chiroyli yozish: −12, 12 500
    var neg = n < 0, s = String(Math.abs(n));
    if (Math.abs(n) >= 10000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? M : "") + s;
  }
  function par(n) { return n < 0 ? "(" + fi(n) + ")" : fi(n); }
  function sg(n) { return n < 0 ? " " + M + " " + fi(-n) : " + " + fi(n); } // " + 5" / " − 5"
  function rev(n) { var s = String(Math.abs(n)); if (s.length < 2) return null; var r = +s.split("").reverse().join(""); return n < 0 ? -r : r; }

  // ---------- Javob qiymatlari ----------
  function I(n) { return isInt(n) ? { s: fi(n), v: n, t: "i" } : null; }
  function Fr(n, d) {
    if (!isInt(n) || !isInt(d) || d === 0) return null;
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d); n /= g; d /= g;
    return { s: d === 1 ? fi(n) : fi(n) + "/" + d, v: n / d, t: "f", n: n, d: d };
  }
  function fstr(n, d) { var f = Fr(n, d); return f ? f.s : "?"; }
  function Dg(n) { return isInt(n) ? { s: fi(n) + "°", v: n, t: "g" } : null; }
  function Pc(n, signed) { return isInt(n) ? { s: (signed && n > 0 ? "+" : "") + fi(n) + "%", v: n, t: "p", sg: !!signed } : null; }
  function Pi(k) { return isInt(k) && k > 0 ? { s: (k === 1 ? "" : fi(k)) + "π", v: k * Math.PI, t: "pi", k: k } : null; }
  function Rt(a, b) { // a√b
    if (!isInt(a) || !isInt(b) || b < 1 || a === 0) return null;
    if (b === 1) return I(a);
    for (var f = 2; f * f <= b; f++) if (b % (f * f) === 0) return null; // faqat soddalashgan shakl
    return { s: (a === 1 ? "" : a === -1 ? M : fi(a)) + "√" + b, v: a * Math.sqrt(b), t: "r", a: a, b: b };
  }

  function RtS(n) { // √n ni soddalashtirib qaytaradi
    if (!isInt(n) || n < 1) return null;
    var k = 1, m = n;
    for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; }
    return Rt(k, m);
  }
  function near(a, k) { // zaxira (yaqin) noto'g'ri variant
    var big = k > 40 ? ri(2, 6) : 1;
    switch (a.t) {
      case "f": return chance(0.6) ? Fr(a.n + pick([1, -1, 2, -2]) * big, a.d) : Fr(a.n, a.d + pick([1, -1, 2]) * big);
      case "g": return Dg(a.v + pick([5, -5, 10, -10, 15, 20, -20, 30]) * big);
      case "p": return Pc(a.v + pick([1, -1, 2, -2, 5, -5, 10, -10]) * big, a.sg);
      case "pi": return Pi(a.k + pick([1, -1, 2, -2, 3]) * big);
      case "r": return Rt(a.a + pick([1, -1, 2, 3]) * big, a.b);
      default:
        var m = Math.abs(a.v);
        var step = m >= 1000 ? pick([1, 10, 100]) : m >= 100 ? pick([1, 2, 10]) : m >= 20 ? pick([1, 2, 10]) : pick([1, 2, 3]);
        return I(a.v + pick([1, -1]) * step * big);
    }
  }

  // Savol obyektini yig'ish. cands — odatiy xatolardan kelib chiqqan variantlar.
  function mk(text, ans, cands, explain, meta, g, nOpt) {
    nOpt = nOpt || 4;
    var out = [ans];
    function ok(c) {
      if (!c || typeof c.v !== "number" || !isFinite(c.v) || !c.s) return false;
      if (g && g.nonneg && c.v < 0) return false;
      if (c.s.length > 14) return false;
      if (ans.t === "i" && c.t === "i" && Math.abs(ans.v) < 1e6 && Math.abs(c.v) > Math.max(1e6, Math.abs(ans.v) * 1000)) return false;
      for (var i = 0; i < out.length; i++) {
        if (out[i].s === c.s) return false;
        if (Math.abs(out[i].v - c.v) <= 1e-9 * Math.max(1, Math.abs(c.v))) return false;
      }
      return true;
    }
    cands = shuffle((cands || []).slice());
    for (var i = 0; i < cands.length && out.length < nOpt; i++) if (ok(cands[i])) out.push(cands[i]);
    var k = 0;
    while (out.length < nOpt && k < 400) { k++; var c = near(ans, k); if (ok(c)) out.push(c); }
    k = 0;
    while (out.length < nOpt && k < 400) { k++; var c2 = I(Math.round(ans.v) + k * 7 + 1); if (ok(c2)) out.push(c2); }
    shuffle(out);
    var opts = out.map(function (o) { return o.s; });
    return { text: text, answer: ans.s, options: opts, correct: opts.indexOf(ans.s), explain: explain, meta: meta, value: ans.v };
  }
  function E(e) { return { k: "expr", e: e }; }
  function EQ(e) { return { k: "eq", e: e }; }
  function W(f, p) { return { k: "w", f: f, p: p }; }

  // ---------- Sinf / daraja ----------
  var GRADES = [["5-6", "5–6-sinf"], ["7-8", "7–8-sinf"], ["9-11", "9–11-sinf"], ["texnikum", "Texnikum"]];
  var TOPICS = [["aralash", "Aralash"], ["arifmetika", "Arifmetika"], ["kasrlar", "Kasrlar"], ["foizlar", "Foizlar"],
    ["tenglamalar", "Tenglamalar"], ["darajalar", "Darajalar va ildizlar"], ["geometriya", "Geometriya"]];
  function normGrade(g) {
    var s = String(g == null ? "" : g).toLowerCase().replace(/[–—\s]/g, "-");
    if (/^tex|^kol|^lit/.test(s)) return "texnikum";
    var n = parseInt(s, 10);
    if (n >= 9) return "9-11";
    if (n === 7 || n === 8) return "7-8";
    if (n === 5 || n === 6 || n < 5) return "5-6";
    return "7-8";
  }
  function normTopic(t) {
    t = String(t || "aralash").toLowerCase();
    if (/^daraj|^ildiz/.test(t)) return "darajalar";
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i][0] === t) return t;
    return "aralash";
  }
  function ctx(o) {
    o = o || {};
    var gr = normGrade(o.grade), L = Math.max(1, Math.min(5, Math.round(+o.level || 1)));
    var base = { "5-6": 0, "7-8": 1, "9-11": 2, "texnikum": 2 }[gr];
    return { gr: gr, L: L, D: Math.min(6, base + L - 1), neg: gr !== "5-6", nonneg: gr === "5-6", hi: gr === "9-11" || gr === "texnikum", tex: gr === "texnikum" };
  }

  // ================= ARIFMETIKA =================
  var MULR = [[2, 9, 2, 9], [3, 12, 3, 12], [11, 19, 3, 9], [12, 30, 4, 12], [21, 60, 11, 19], [25, 99, 11, 30], [101, 250, 4, 25]];
  function arMul(g) {
    var r = MULR[g.D], a = ri(r[0], r[1]), b = ri(r[2], r[3]);
    if (chance(0.5)) { var t = a; a = b; b = t; }
    var p = a * b, e = fi(a) + " × " + fi(b);
    return mk(e + " = ?", I(p), [I(p + a), I(p - a), I(p + b), I(p - b), I(p + 10), I(p - 10), I(rev(p)), I(p + 1)], e + " = " + fi(p), E(e), g);
  }
  function arDiv(g) {
    var r = MULR[g.D], a = ri(r[2], r[3]), b = ri(r[0], r[1]);
    var p = a * b, e = fi(p) + " : " + fi(a);
    return mk(e + " = ?", I(b), [I(b + 1), I(b - 1), I(b + 2), I(b * 10), I(p - a), I(a === b ? null : a), I(rev(b))], e + " = " + fi(b) + ", chunki " + fi(a) + " × " + fi(b) + " = " + fi(p), E(e), g);
  }
  function arOrder(g) {
    var D = g.D, hi = 9 + D * 3;
    var t = ri(0, g.neg ? 8 : 6), a, b, c, d, e, ans, w = [], ex;
    switch (t) {
      case 0: a = ri(2, 12 + D * 4); b = ri(2, hi); c = ri(2, 9);
        e = fi(a) + " + " + fi(b) + " × " + fi(c); ans = a + b * c; w = [(a + b) * c, a + b + c, a * b + c, ans + 1];
        ex = "Avval ko'paytirish: " + b + " × " + c + " = " + b * c + "; keyin " + a + " + " + b * c + " = " + ans; break;
      case 1: a = ri(3, hi); b = ri(3, 9); c = ri(1, Math.min(a * b - 1, 20 + D * 10));
        e = fi(a) + " × " + fi(b) + " " + M + " " + fi(c); ans = a * b - c; w = [b > c ? a * (b - c) : null, a * b + c, ans - 1, ans + 10];
        ex = a + " × " + b + " = " + a * b + "; " + a * b + " " + M + " " + c + " = " + ans; break;
      case 2: b = ri(2, 9); c = ri(2, hi); a = b * c + ri(1, 20 + D * 6);
        e = fi(a) + " " + M + " " + fi(b) + " × " + fi(c); ans = a - b * c; w = [(a - b) * c, a - b - c, ans + b, ans + 10];
        ex = "Avval " + b + " × " + c + " = " + b * c + "; keyin " + a + " " + M + " " + b * c + " = " + ans; break;
      case 3: a = ri(2, hi); b = ri(2, hi); c = ri(2, 9);
        e = "(" + fi(a) + " + " + fi(b) + ") × " + fi(c); ans = (a + b) * c; w = [a + b * c, a * c + b, a + b + c, ans + c];
        ex = "Qavs ichi: " + a + " + " + b + " = " + (a + b) + "; " + (a + b) + " × " + c + " = " + ans; break;
      case 4: c = ri(2, 9); b = c * ri(2, 9 + D); a = ri(2, 20 + D * 5);
        e = fi(a) + " + " + fi(b) + " : " + fi(c); ans = a + b / c; w = [(a + b) % c === 0 ? (a + b) / c : null, a + b - c, ans + 1, a * (b / c)];
        ex = "Avval bo'lish: " + b + " : " + c + " = " + b / c + "; " + a + " + " + b / c + " = " + ans; break;
      case 5: a = ri(2, 9 + D); b = ri(2, 9); c = ri(2, 9 + D); d = ri(2, 9);
        e = fi(a) + " × " + fi(b) + " + " + fi(c) + " × " + fi(d); ans = a * b + c * d; w = [(a * b + c) * d, a * b + c + d, a * (b + c) * d, ans - c];
        ex = a * b + " + " + c * d + " = " + ans; break;
      case 6: c = ri(1, 9 + D); b = c + ri(1, 9 + D * 2); a = (b - c) + ri(1, 30 + D * 5);
        e = fi(a) + " " + M + " (" + fi(b) + " " + M + " " + fi(c) + ")"; ans = a - (b - c); w = [a - b - c, a + b - c, ans + 1, a - b];
        ex = "Qavs: " + b + " " + M + " " + c + " = " + (b - c) + "; " + a + " " + M + " " + (b - c) + " = " + ans; break;
      case 7: b = ri(2, 9); c = ri(3, hi); a = ri(1, b * c - 1);
        e = fi(a) + " " + M + " " + fi(b) + " × " + fi(c); ans = a - b * c; w = [(a - b) * c, b * c - a, a - b - c, ans - 1];
        ex = b + " × " + c + " = " + b * c + "; " + a + " " + M + " " + b * c + " = " + fi(ans); break;
      default: a = ri(2, 9 + D); b = ri(2, 9); c = ri(1, 20 + D * 5);
        e = "(" + M + fi(a) + ") × " + fi(b) + " + " + fi(c); ans = -a * b + c; w = [a * b + c, -a * b - c, -a * (b + c), -ans];
        ex = "(" + M + a + ") × " + b + " = " + fi(-a * b) + "; " + fi(-a * b) + " + " + c + " = " + fi(ans); break;
    }
    return mk(e + " = ?", I(ans), w.map(I), ex, E(e), g);
  }
  function arNeg(g) {
    var D = g.D, a = ri(2, 9 + D * 2), b = ri(2, 9 + D), x = chance(0.5) ? -a : a, y = x > 0 || chance(0.5) ? -b : b, e, ans, ex;
    if (chance(0.5)) {
      e = par(x) + " × " + par(y); ans = x * y;
      ex = (x * y > 0 ? "Ishoralari bir xil — natija musbat: " : "Ishoralari har xil — natija manfiy: ") + fi(ans);
    } else {
      var p = x * y; e = par(p) + " : " + par(y); ans = x;
      ex = (ans > 0 ? "Ishoralari bir xil — natija musbat: " : "Ishoralari har xil — natija manfiy: ") + fi(ans);
    }
    return mk(e + " = ?", I(ans), [I(-ans), I(ans + (ans > 0 ? 1 : -1) * 2), I(x + y), I(-ans + 1), I(ans - 1)], ex, E(e), g);
  }
  function genArif(g) {
    var list = g.gr === "5-6" ? [arMul, arMul, arDiv, arOrder, arOrder] : g.gr === "7-8" ? [arMul, arDiv, arOrder, arOrder, arNeg] : [arMul, arDiv, arOrder, arOrder, arNeg, arNeg];
    return pick(list)(g);
  }

  // ================= KASRLAR =================
  function fq(n, d, first) { var s = fstr(n, d); return n < 0 && !first ? "(" + s + ")" : s; }
  function frSame(g) {
    var n = ri(3, 8 + g.D * 2), a = ri(1, n - 1), b = ri(1, n - 1), e, ans, w;
    if (chance(0.4)) {
      if (a === b) a = Math.min(n - 1, b + 1) === b ? b : b + 1;
      if (a < b) { var t = a; a = b; b = t; }
      if (a === b) { a = n - 1; b = 1; if (a === b) { a = 2; n = 5; b = 1; } }
      e = a + "/" + n + " " + M + " " + b + "/" + n; ans = Fr(a - b, n); w = [Fr(a + b, n), Fr(a - b, n * n), Fr(a - b + 1, n), Fr(a - b, n + 1)];
    } else {
      e = a + "/" + n + " + " + b + "/" + n; ans = Fr(a + b, n); w = [Fr(a + b, 2 * n), Fr(a * b, n), Fr(a + b, n * n), Fr(a + b + 1, n)];
    }
    return mk(e + " = ?", ans, w, "Maxrajlar bir xil — suratlar bilan amal bajariladi: " + e + " = " + ans.s, E(e), g);
  }
  function cop(b) { // b bilan o'zaro tub 1..b-1 son
    for (var t = 0; t < 20; t++) { var a = ri(1, b - 1); if (gcd(a, b) === 1) return a; }
    return 1;
  }
  function frTwo(g) {
    var mx = Math.min(12, 4 + g.D * 2), b = ri(2, mx), d = ri(2, mx);
    if (b === d) d = d === mx ? d - 1 : d + 1;
    var a = cop(b), c = cop(d);
    if (g.D >= 4 && chance(0.25)) { a = b + cop(b); if (gcd(a, b) !== 1) a = b + 1; } // noto'g'ri kasr
    if (g.neg && chance(0.35)) { if (chance(0.5)) a = -a; else c = -c; }
    var op = pick(g.D <= 1 ? ["+", "-"] : ["+", "-", "*", ":"]);
    if (op === "-" && g.nonneg && a * d < c * b) { var t1 = a; a = c; c = t1; t1 = b; b = d; d = t1; }
    var e = fq(a, b, true) + " " + (op === "+" ? "+" : op === "-" ? M : op === "*" ? "×" : ":") + " " + fq(c, d), ans, w, ex;
    var L = lcm(b, d);
    if (op === "+") { ans = Fr(a * d + c * b, b * d); w = [Fr(a + c, b + d), Fr(a + c, b * d), Fr(a * d + c * b, b + d), Fr(a * c, b * d)]; ex = "Umumiy maxraj " + L + ": " + fi(a * L / b) + "/" + L + " + " + par(c * L / d) + "/" + L + " = " + ans.s; }
    else if (op === "-") { ans = Fr(a * d - c * b, b * d); w = [Fr(a - c, b - d), Fr(a - c, b * d), Fr(a * d + c * b, b * d), Fr(a * d - c * b, b + d)]; ex = "Umumiy maxraj " + L + ": " + fi(a * L / b) + "/" + L + " " + M + " " + par(c * L / d) + "/" + L + " = " + ans.s; }
    else if (op === "*") { ans = Fr(a * c, b * d); w = [Fr(a * d, b * c), Fr(a + c, b + d), Fr(a * c, b + d), Fr(a * d + c * b, b * d)]; ex = "Surat suratga, maxraj maxrajga ko'paytiriladi: " + ans.s; }
    else { ans = Fr(a * d, b * c); w = [Fr(a * c, b * d), Fr(b * c, a * d), Fr(a + d, b + c), Fr(a * d, b + c)]; ex = "Bo'lish — ikkinchi kasrni ag'darib ko'paytirish: " + fstr(a, b) + " × " + fstr(d, c) + " = " + ans.s; }
    return mk(e + " = ?", ans, w, ex, E(e), g);
  }
  function frOf(g) {
    var b = ri(2, Math.min(12, 3 + g.D * 2)), a = cop(b), k = ri(2, 6 + g.D * 3), N = b * k;
    var t = fi(N) + " ning " + a + "/" + b + " qismini toping";
    return mk(t, I(a * k), [I(k), I(N * b % a === 0 ? N * b / a : null), I(N - a * k), I(a * k + k), I(N * a)], fi(N) + " : " + b + " × " + a + " = " + fi(a * k), W("fracOf", { n: N, a: a, b: b }), g);
  }
  function frSimp(g) {
    var q = ri(2, 9 + g.D), p = ri(1, q - 1), m = ri(2, 4 + g.D), tries = 0;
    while (gcd(p, q) !== 1 && tries++ < 30) { q = ri(2, 9 + g.D); p = ri(1, q - 1); }
    if (gcd(p, q) !== 1) { p = 1; }
    var n = p * m, d = q * m, ans = Fr(n, d);
    var w = [Fr(q, p), Fr(n - m, d - m), Fr(p, d), Fr(n, q), Fr(p + 1, q + 1), Fr(n - 1, d - 1)];
    return mk(n + "/" + d + " kasrni qisqartiring", ans, w, "Surat va maxrajni " + gcd(n, d) + " ga bo'lamiz: " + ans.s, W("simp", { n: n, d: d }), g);
  }
  var DECS = [["0,5", 1, 2], ["0,25", 1, 4], ["0,75", 3, 4], ["0,2", 1, 5], ["0,4", 2, 5], ["0,6", 3, 5], ["0,8", 4, 5], ["0,125", 1, 8], ["0,375", 3, 8],
    ["0,625", 5, 8], ["0,05", 1, 20], ["0,35", 7, 20], ["0,45", 9, 20], ["1,5", 3, 2], ["2,25", 9, 4], ["0,15", 3, 20], ["0,04", 1, 25], ["0,12", 3, 25], ["1,25", 5, 4], ["0,3", 3, 10], ["0,7", 7, 10]];
  function frDec(g) {
    var r = pick(DECS), ans = Fr(r[1], r[2]), digits = +r[0].replace(",", "").replace(/^0+/, ""), dl = r[0].split(",")[1].length;
    var w = [Fr(digits, 10), Fr(r[2], r[1]), Fr(r[1], r[2] * 10), Fr(digits, Math.pow(10, dl + 1)), Fr(1, digits)];
    return mk(r[0] + " ni oddiy kasr ko'rinishida yozing", ans, w, r[0] + " = " + digits + "/" + Math.pow(10, dl) + (digits + "/" + Math.pow(10, dl) === ans.s ? "" : " = " + ans.s), W("dec", { x: r[1] / r[2], _s: r[0] }), g);
  }
  function frMix(g) {
    var b = ri(2, 6), d = ri(2, 7); if (b === d) d++;
    var a = ri(1, b - 1), c = ri(1, d - 1), L = lcm(b, d), k = ri(1, 3), m = L * k;
    if (g.D >= 5 && chance(0.4)) m = ri(2, 9);
    var e = "(" + fstr(a, b) + " + " + fstr(c, d) + ") × " + m, ans = Fr((a * d + c * b) * m, b * d);
    var w = [Fr(a * d + c * m * b, b * d), Fr((a + c) * m, b + d), Fr((a * d + c * b) * m, b * d * m), Fr(a * m + c, b * d)];
    return mk(e + " = ?", ans, w, "Qavs ichi: " + fstr(a * d + c * b, b * d) + "; × " + m + " = " + ans.s, E(e), g);
  }
  function genKasr(g) {
    var list;
    if (g.gr === "5-6") list = g.D === 0 ? [frSame, frSame, frOf, frSimp] : [frSame, frTwo, frTwo, frOf, frSimp].concat(g.D >= 2 ? [frDec] : []);
    else list = [frTwo, frTwo, frTwo, frOf, frSimp, frDec].concat(g.D >= 3 ? [frMix, frMix] : []);
    return pick(list)(g);
  }

  // ================= FOIZLAR =================
  var PSETS = [[10, 50, 25], [20, 75, 5], [15, 30, 40, 60], [12, 35, 45, 8, 4, 120, 150, 2]];
  function pset(g) { var arr = []; for (var i = 0; i <= Math.min(3, g.D); i++) arr = arr.concat(PSETS[i]); return pick(arr); }
  function pbase(p) { return 100 / gcd(p, 100); }
  function pN(g, p, lo, hi) { var b = pbase(p); return b * ri(Math.max(1, Math.ceil(lo / b)), Math.max(2, Math.floor(hi / b))); }
  function pcOf(g) {
    var p = pset(g), N = pN(g, p, 20, 100 + 220 * g.D), ans = N * p / 100;
    return mk(fi(N) + " ning " + p + "% ini toping", I(ans), [I(N * p / 10), I(N / p), I(N - ans), I(ans * 10), I(ans / 10), I(N + p), I(p === ans ? null : p)],
      fi(N) + " × " + p + " : 100 = " + fi(ans), W("pctOf", { n: N, p: p }), g);
  }
  function pcWhat(g) {
    var p = pick([10, 20, 25, 50, 75, 5, 40, 60, 30, 15, 80, 12, 35].slice(0, 5 + g.D * 2)), b = pN(g, p, 20, 100 + 200 * g.D), a = b * p / 100;
    return mk(fi(a) + " soni " + fi(b) + " ning necha foizini tashkil etadi?", Pc(p), [Pc(100 - p), Pc(b * 100 / a), Pc(p * 10), Pc(p / 10), Pc(a), Pc(b - a)],
      fi(a) + " : " + fi(b) + " × 100 = " + p + "%", W("whatPct", { a: a, b: b }), g);
  }
  function pcChg(g) {
    var p = pset(g); if (p > 100) p = pick([10, 20, 25, 30]);
    var up = chance(0.5), N, unit = "so'm", t;
    if (g.tex || (g.D >= 3 && chance(0.5))) N = pN(g, p, 10, 400) * 1000; else N = pN(g, p, 20, 100 + 200 * g.D);
    var inc = N * p / 100, ans = up ? N + inc : N - inc;
    var ctxs = up ? (g.tex ? ["Bankka " + fi(N) + " " + unit + " yillik " + p + "% bilan qo'yildi. 1 yildan keyin hisobda qancha bo'ladi?",
      "Mahsulot narxi " + fi(N) + " " + unit + ". Unga " + p + "% ustama qo'yildi. Yangi narx?"] : ["Narx " + fi(N) + " " + unit + " edi va " + p + "% ga oshdi. Yangi narx?"])
      : (g.tex ? ["Telefon narxi " + fi(N) + " " + unit + ". " + p + "% chegirma bilan narxi qancha?", "Kurtka " + fi(N) + " " + unit + " turardi, " + p + "% arzonlashdi. Yangi narx?"]
        : ["Narx " + fi(N) + " " + unit + " edi va " + p + "% ga kamaydi. Yangi narx?"]);
    t = pick(ctxs);
    return mk(t, I(ans), [I(up ? N + p : N - p), I(inc), I(up ? N - inc : N + inc), I(up ? N + inc * 10 : N - inc / 10), I(ans + (up ? 10 : -10) * (N >= 10000 ? 100 : 1))],
      fi(N) + " ning " + p + "% i = " + fi(inc) + "; " + fi(N) + (up ? " + " : " " + M + " ") + fi(inc) + " = " + fi(ans), W("chg", { n: N, p: p, _s: up ? 1 : -1 }), g);
  }
  function pcWhole(g) {
    var p = pick([10, 20, 25, 50, 5, 40, 75, 30, 15, 60]), X = pN(g, p, 20, 100 + 200 * g.D), a = X * p / 100;
    return mk("Sonning " + p + "% i " + fi(a) + " ga teng. Shu sonni toping.", I(X), [I(a * p / 100), I(a + p), I(a * p), I(X / 10), I(X * 10), I(a * 100 / (100 - p))],
      fi(a) + " : " + p + " × 100 = " + fi(X), W("whole", { a: a, p: p }), g);
  }
  function dc(x) { return String(+x.toFixed(4)).replace(".", ","); }
  function pcSucc(g) {
    var p = pick([10, 20, 30, 50]), ans = -p * p / 100;
    return mk("Narx avval " + p + "% ga oshdi, keyin " + p + "% ga kamaydi. Narx jami necha foizga o'zgardi?", Pc(ans, true),
      [Pc(0, true), Pc(-ans, true), Pc(-p, true), Pc(-2 * p, true), Pc(ans / 2, true)],
      "(1 + " + dc(p / 100) + ")(1 " + M + " " + dc(p / 100) + ") = " + dc(1 - p * p / 10000) + " → " + fi(ans) + "%", W("succ", { p: p }), g);
  }
  function genFoiz(g) {
    var list = g.gr === "5-6" ? [pcOf, pcOf].concat(g.D >= 1 ? [pcWhat, pcChg] : []).concat(g.D >= 2 ? [pcWhole] : [])
      : [pcOf, pcWhat, pcChg, pcChg, pcWhole].concat(g.D >= 3 ? [pcSucc] : []);
    return pick(list)(g);
  }

  // ================= TENGLAMALAR =================
  function eqBasic(g) {
    var D = g.D, x = ri(1, 10 + D * 15), a, b, e, w, ex;
    switch (ri(0, 3)) {
      case 0: a = ri(2, 20 + D * 20); b = x + a; e = "x + " + a + " = " + b; w = [b + a, x + 1, x - 1, b, a]; ex = "x = " + b + " " + M + " " + a + " = " + x; break;
      case 1: a = ri(2, 20 + D * 20); b = ri(1, 20 + D * 15); x = a + b; e = "x " + M + " " + a + " = " + b; w = [b - a, x + 1, x - 10, b, a]; ex = "x = " + b + " + " + a + " = " + x; break;
      case 2: a = ri(2, 9 + D); x = ri(2, 12 + D * 4); b = a * x; e = a + "x = " + b; w = [b - a, b * a, x + 1, x - 1, b + a]; ex = "x = " + b + " : " + a + " = " + x; break;
      default: a = ri(2, 9); b = ri(2, 12 + D * 3); x = a * b; e = "x : " + a + " = " + b; w = [b % a === 0 ? b / a : null, a + b, b - a, x + a, x - 1]; ex = "x = " + b + " × " + a + " = " + x;
    }
    return mk("x ni toping: " + e, I(x), w.map(I), ex, EQ(e), g);
  }
  function eqLin(g) {
    var D = g.D, a = ri(2, 9), x = ri(-10 - D * 2, 12 + D * 2), b = ri(1, 25 + D * 5) * (chance(0.5) ? 1 : -1), e, ans = x, w, ex;
    if (x === 0) x = ans = ri(1, 9);
    if (chance(0.7)) {
      var c = a * x + b; e = a + "x" + sg(b) + " = " + fi(c);
      w = [(c + b) / a, c - b, -x, (c - b) * a, x + 1, x - 1];
      ex = a + "x = " + fi(c) + (b < 0 ? " + " + fi(-b) : " " + M + " " + fi(b)) + " = " + fi(c - b) + "; x = " + fi(c - b) + " : " + a + " = " + fi(x);
    } else {
      var c2 = b - a * x; e = fi(b) + " " + M + " " + a + "x = " + fi(c2);
      w = [(c2 - b) / a, -x, b - c2, (b + c2) / a, x + 2];
      ex = a + "x = " + fi(b) + " " + M + " " + par(c2) + " = " + fi(b - c2) + "; x = " + fi(x);
    }
    return mk("x ni toping: " + e, I(ans), w.map(I), ex, EQ(e), g);
  }
  function eqAdv(g) {
    var D = g.D, x = ri(-12 - D, 15 + D * 2), a, b, c, d, e, w, ex;
    if (x === 0) x = 3;
    switch (ri(0, 3)) {
      case 0: a = ri(2, 9); b = ri(1, 12) * (chance(0.5) ? 1 : -1); c = a * (x + b);
        e = a + "(x" + sg(b) + ") = " + fi(c); w = [x + b, c / a + b, (c - b) / a, -x, x + 1];
        ex = "x" + sg(b) + " = " + fi(c) + " : " + a + " = " + fi(x + b) + "; x = " + fi(x); break;
      case 1: a = ri(3, 11); c = ri(1, a - 1); b = ri(-20, 20); d = (a - c) * x + b;
        e = a + "x" + sg(b) + " = " + (c === 1 ? "" : c) + "x" + sg(d); w = [(d + b) / (a - c), (d - b) / (a + c), -x, d - b, x + 1];
        ex = (a - c) + "x = " + fi(d) + " " + M + " " + par(b) + " = " + fi(d - b) + "; x = " + fi(x); break;
      case 2: a = ri(2, 9); b = ri(1, 15); c = b + ri(-8, 12); x = a * (c - b);
        e = "x/" + a + sg(b) + " = " + fi(c); w = [c - b, (c + b) * a, c * a - b, -x, x + a];
        ex = "x/" + a + " = " + fi(c - b) + "; x = " + fi(c - b) + " × " + a + " = " + fi(x); break;
      default: a = ri(1, 15) * (chance(0.5) ? 1 : -1); b = ri(2, 9); c = ri(-9, 12); x = b * c - a;
        e = "(x" + sg(a) + ")/" + b + " = " + fi(c); w = [b * c + a, c - a, c * b, -x, x + 1];
        ex = "x" + sg(a) + " = " + fi(c) + " × " + b + " = " + fi(b * c) + "; x = " + fi(x);
    }
    return mk("x ni toping: " + e, I(x), w.map(I), ex, EQ(e), g);
  }
  function eqWord(g) {
    var big = ri(10, 40 + g.D * 20), small = ri(2, big - 1), S = big + small, d = big - small;
    return mk("Ikki sonning yig'indisi " + S + ", ayirmasi " + d + ". Kattasini toping.", I(big), [I(small), I(S - d), I(S / 2), I(S + d), I(d)],
      "Katta son = (" + S + " + " + d + ") : 2 = " + big, W("sumdiff", { s: S, d: d }), g);
  }
  function genTeng(g) {
    var list = g.gr === "5-6" ? [eqBasic] : g.gr === "7-8" ? (g.D <= 1 ? [eqBasic, eqLin, eqLin] : [eqLin, eqLin, eqAdv]) : [eqLin, eqAdv, eqAdv, eqWord];
    return pick(list)(g);
  }

  // ================= DARAJALAR VA ILDIZLAR =================
  function pwSq(g) { var a = ri(2, 9 + 3 * g.D), e = a + "²"; return mk(e + " = ?", I(a * a), [I(2 * a), I(a + 2), I(a * a + a), I((a + 1) * (a + 1)), I((a - 1) * (a - 1)), I(a * 10)], e + " = " + a + " × " + a + " = " + a * a, E(e), g); }
  function pwCube(g) { var a = ri(2, 5 + g.D), e = a + "³"; return mk(e + " = ?", I(a * a * a), [I(3 * a), I(a * a), I(a * a * a + a * a), I((a + 1) * (a + 1) * (a + 1)), I(a * a * 2)], e + " = " + a + " × " + a + " × " + a + " = " + a * a * a, E(e), g); }
  function pwBase(g) {
    var b = pick([2, 2, 3, 5, 10]), n = b === 2 ? ri(3, 6 + g.D) : b === 10 ? ri(2, 3 + g.D) : ri(2, 3 + Math.floor(g.D / 2)), v = Math.pow(b, n), e = b + sup(n);
    return mk(e + " = ?", I(v), [I(b * n), I(Math.pow(b, n - 1)), I(Math.pow(b, n + 1)), I(Math.pow(n, b)), I(v + b)], e + " = " + v, E(e), g);
  }
  function rtSq(g) { var r = ri(2, 12 + 3 * g.D), n = r * r, e = "√" + n; return mk(e + " = ?", I(r), [I(n / 2), I(r + 1), I(r - 1), I(2 * r), I(n - r)], r + "² = " + n + ", demak " + e + " = " + r, E(e), g); }
  function pwNeg(g) {
    var a = ri(2, 5 + g.D), n = ri(2, 4), v = Math.pow(-a, n), e = "(" + M + a + ")" + sup(n);
    return mk(e + " = ?", I(v), [I(-v), I(-a * n), I(a * n), I(Math.pow(-a, n - 1)), I(Math.pow(a, n + 1))], (n % 2 ? "Toq daraja — ishora saqlanadi: " : "Juft daraja — natija musbat: ") + fi(v), E(e), g);
  }
  function pwRule(g) {
    var b = pick([2, 2, 3, 5, 10]), cap = b === 2 ? 10 : b === 3 ? 6 : 4, e, v, w, ex, t = ri(0, 3), m, n;
    if (t === 0) { m = ri(1, cap - 1); n = ri(1, Math.max(1, cap - m)); v = Math.pow(b, m + n); e = b + sup(m) + " · " + b + sup(n); w = [Math.pow(b, m * n), Math.pow(b, m + n - 1), Math.pow(b, m + n + 1), b * (m + n), Math.pow(b * b, m + n) > 1e6 ? null : Math.pow(b * b, m + n)]; ex = "Asoslar bir xil — ko'rsatkichlar qo'shiladi: " + b + sup(m + n) + " = " + fi(v); }
    else if (t === 1) { n = ri(1, cap - 1); m = n + ri(1, cap - n); v = Math.pow(b, m - n); e = b + sup(m) + " : " + b + sup(n); w = [m % n === 0 ? Math.pow(b, m / n) : null, Math.pow(b, m - n + 1), b * (m - n), 1, Math.pow(b, m - n - 1)]; ex = "Ko'rsatkichlar ayiriladi: " + b + sup(m - n) + " = " + fi(v); }
    else if (t === 2) { m = ri(1, 3); n = ri(2, Math.max(2, Math.floor(cap / m))); if (m * n > cap) m = 1; v = Math.pow(b, m * n); e = "(" + b + sup(m) + ")" + sup(n); w = [Math.pow(b, m + n), b * m * n, Math.pow(b, m * n - 1), Math.pow(b * m, n)]; ex = "Ko'rsatkichlar ko'paytiriladi: " + b + sup(m * n) + " = " + fi(v); }
    else { var a = ri(2, 20), c = ri(2, 3), k = ri(2, 4); v = 1 + Math.pow(c, k); e = a + "⁰ + " + c + sup(k); w = [Math.pow(c, k), a + Math.pow(c, k), c * k + 1, Math.pow(c, k) - 1]; ex = a + "⁰ = 1, " + c + sup(k) + " = " + Math.pow(c, k) + "; jami " + v; }
    return mk(e + " = ?", I(v), w.map(I), ex, E(e), g);
  }
  function pwNegExp(g) {
    var b = ri(2, 5 + Math.floor(g.D / 2)), n = ri(1, b > 4 ? 2 : 3), e = b + sup("-" + n), P = Math.pow(b, n);
    return mk(e + " = ?", Fr(1, P), [I(-P), Fr(-1, P), I(-b * n), Fr(1, b * n), Fr(b, n), I(P)], "Manfiy ko'rsatkich: " + e + " = 1/" + b + sup(n) + " = 1/" + P, E(e), g);
  }
  function rtSimp(g) {
    var k = ri(2, 5 + g.D), m = pick([2, 3, 5, 6, 7, 10, 11]), n = k * k * m, e = "√" + n;
    return mk(e + " ni soddalashtiring", Rt(k, m), [Rt(k * k, m), Rt(m, k), Rt(k, m * k), Rt(k + 1, m), Rt(2 * k, m), Rt(k, k * m)], e + " = √(" + k * k + "·" + m + ") = " + k + "√" + m, E(e), g);
  }
  function rtCube(g) {
    var r = ri(2, 5 + g.D), n = r * r * r, neg = g.hi && chance(0.35), e = neg ? "∛(" + M + n + ")" : "∛" + n, v = neg ? -r : r;
    return mk(e + " = ?", I(v), [I(n % 3 === 0 ? (neg ? -n / 3 : n / 3) : null), I(neg ? -r * r : r * r), I(-v), I(v + 1), I(v - 1)], (neg ? "(" + M + r + ")" : r) + "³ = " + fi(neg ? -n : n) + ", demak " + e + " = " + fi(v), E(e), g);
  }
  var TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20], [9, 40, 41], [15, 20, 25]];
  function rtPyth(g) {
    var t = pick(TRIP.slice(0, 5 + Math.min(5, g.D))), a = t[0], b = t[1], c = t[2], e = "√(" + a + "² + " + b + "²)";
    return mk(e + " = ?", I(c), [I(a + b), I(c + 1), I(a * a + b * b), I(c - 1), I(b - a)], a * a + " + " + b * b + " = " + c * c + ", √" + c * c + " = " + c, E(e), g);
  }
  function rtProd(g) {
    var m = pick([2, 3, 5, 6, 7]), k = ri(2, 4 + Math.floor(g.D / 2)), a = m, b = m * k * k, e = "√" + a + " · √" + b;
    return mk(e + " = ?", I(m * k), [RtS(a + b), I(a * b), I(m * k * k), I(m * k + 1), I(k)], "√" + a + " · √" + b + " = √" + a * b + " = " + m * k, E(e), g);
  }
  function pwSum(g) {
    var a = ri(2, 6 + g.D * 2), b = ri(2, 5 + g.D), t = ri(0, 2), e, v, w;
    if (t === 0) { e = a + "\u00b2 + " + b + "\u00b2"; v = a * a + b * b; w = [(a + b) * (a + b), 2 * a + 2 * b, a * a + b, v + 1]; }
    else if (t === 1) { if (a < b) { var s = a; a = b; b = s; } if (a === b) a++; e = a + "\u00b2 " + M + " " + b + "\u00b2"; v = a * a - b * b; w = [(a - b) * (a - b), 2 * a - 2 * b, a * a - b, v + 1]; }
    else { var c = ri(2, 9); e = c + " \u00d7 " + b + "\u00b2"; v = c * b * b; w = [(c * b) * (c * b), c * 2 * b, c * b + b, v + c]; }
    return mk(e + " = ?", I(v), w.map(I), e + " = " + v, E(e), g);
  }
  function genDaraja(g) {
    var list = g.gr === "5-6" ? [pwSq, pwSq, pwCube, pwBase, rtSq, pwSum, pwSum]
      : g.gr === "7-8" ? [pwSq, pwCube, rtSq, pwNeg, pwRule].concat(g.D >= 3 ? [rtProd, pwRule] : [])
        : [pwRule, pwNeg, pwNegExp, rtSimp, rtCube, rtPyth, rtProd, rtSq];
    return pick(list)(g);
  }

  // ================= GEOMETRIYA =================
  function dim(g, lo) { return ri(lo || 2, 9 + 3 * g.D); }
  function gRectP(g, tex) {
    var a = dim(g, 3), b = dim(g, 2); if (a === b) a++;
    var t = tex ? "To'g'ri to'rtburchak shaklidagi hovli " + a + " m × " + b + " m. Atrofini o'rash uchun necha metr sim kerak?"
      : "To'g'ri to'rtburchakning bo'yi " + a + " sm, eni " + b + " sm. Perimetri necha sm?";
    return mk(t, I(2 * (a + b)), [I(a * b), I(a + b), I(2 * a + b), I(4 * a), I(2 * (a + b) + 2)], "P = 2 × (" + a + " + " + b + ") = " + 2 * (a + b), W("rectP", { a: a, b: b }), g);
  }
  function gRectS(g, tex) {
    var a = dim(g, 3), b = dim(g, 2); if (a === b) a++;
    var t = tex ? "Xonaning bo'yi " + a + " m, eni " + b + " m. Polga necha m² linoleum kerak?" : "To'g'ri to'rtburchakning bo'yi " + a + " sm, eni " + b + " sm. Yuzasi necha sm²?";
    return mk(t, I(a * b), [I(2 * (a + b)), I(a + b), I(a * b * 2), I((a + 1) * b), I(a * a)], "S = " + a + " × " + b + " = " + a * b, W("rectS", { a: a, b: b }), g);
  }
  function gSq(g) {
    var a = dim(g, 2), per = chance(0.5);
    return per ? mk("Kvadratning tomoni " + a + " sm. Perimetri necha sm?", I(4 * a), [I(a * a), I(2 * a), I(4 * a + 4), I(a + 4)], "P = 4 × " + a + " = " + 4 * a, W("sqP", { a: a }), g)
      : mk("Kvadratning tomoni " + a + " sm. Yuzasi necha sm²?", I(a * a), [I(4 * a), I(2 * a), I(a * a + a), I((a + 1) * (a + 1))], "S = " + a + " × " + a + " = " + a * a, W("sqS", { a: a }), g);
  }
  function gTriAng(g) {
    var st = g.D <= 1 ? 10 : g.D <= 2 ? 5 : 1, a = st * ri(Math.ceil(20 / st), Math.floor(110 / st)), b = st * ri(Math.ceil(15 / st), Math.floor((170 - a) / st)), c = 180 - a - b;
    if (c < 5) { b = Math.max(st, b - 20); c = 180 - a - b; }
    return mk("Uchburchakning ikki burchagi " + a + "° va " + b + "°. Uchinchi burchagini toping.", Dg(c), [Dg(360 - a - b), Dg(a + b), Dg(180 - a), Dg(90 - a - b > 0 ? 90 - a - b : null), Dg(c + 10)],
      "180° " + M + " " + a + "° " + M + " " + b + "° = " + c + "°", W("triAng", { a: a, b: b }), g);
  }
  function gCube(g, tex) {
    var a = ri(2, 5 + g.D);
    var t = tex ? "Kub shaklidagi bakning qirrasi " + a + " dm. Unga necha litr suv sig'adi?" : "Kubning qirrasi " + a + " sm. Hajmi necha sm³?";
    return mk(t, I(a * a * a), [I(a * a), I(3 * a), I(6 * a * a), I(12 * a), I(a * a * a + a)], "V = " + a + "³ = " + a * a * a + (tex ? " dm³ = " + a * a * a + " l" : ""), W("cubeV", { a: a }), g);
  }
  function gBox(g) {
    var a = ri(2, 6 + g.D * 2), b = ri(2, 6 + g.D), c = ri(2, 5 + g.D);
    return mk("To'g'ri burchakli parallelepipedning o'lchamlari " + a + ", " + b + " va " + c + " sm. Hajmi necha sm³?", I(a * b * c), [I(a + b + c), I(a * b + c), I(2 * (a * b + b * c + a * c)), I(a * b * c + a), I(4 * (a + b + c))], "V = " + a + " × " + b + " × " + c + " = " + a * b * c, W("boxV", { a: a, b: b, c: c }), g);
  }
  function gAdj(g) {
    var st = g.D <= 2 ? 5 : 1, a = st * ri(Math.ceil(15 / st), Math.floor(165 / st));
    if (a === 90) a = 95;
    return mk("Qo'shni burchaklardan biri " + a + "°. Ikkinchisini toping.", Dg(180 - a), [Dg(360 - a), Dg(90 - a > 0 ? 90 - a : null), Dg(a), Dg(180 - a + 10), Dg(a - 90 > 0 ? a - 90 : null)], "Qo'shni burchaklar yig'indisi 180°: 180° " + M + " " + a + "° = " + (180 - a) + "°", W("adj", { a: a }), g);
  }
  function gIso(g) {
    var ap = 2 * ri(10, 70), base = (180 - ap) / 2;
    return mk("Teng yonli uchburchakning uchidagi burchagi " + ap + "°. Asosidagi burchagini toping.", Dg(base), [Dg(180 - ap), Dg(ap), Dg(ap / 2), Dg((360 - ap) / 2), Dg(base + 10)], "(180° " + M + " " + ap + "°) : 2 = " + base + "°", W("iso", { a: ap }), g);
  }
  function gRight(g) {
    var a = ri(15, 75);
    return mk("To'g'ri burchakli uchburchakning bir o'tkir burchagi " + a + "°. Ikkinchi o'tkir burchagi?", Dg(90 - a), [Dg(180 - a), Dg(a), Dg(90 + a), Dg(180 - 90 - a + 10)], "90° " + M + " " + a + "° = " + (90 - a) + "°", W("right", { a: a }), g);
  }
  function gTriS(g) {
    var a = dim(g, 3), h = dim(g, 2); if ((a * h) % 2) a++;
    return mk("Uchburchakning asosi " + a + " sm, balandligi " + h + " sm. Yuzasi necha sm²?", I(a * h / 2), [I(a * h), I(a + h), I(2 * (a + h)), I(a * h / 2 + h)], "S = " + a + " × " + h + " : 2 = " + a * h / 2, W("triS", { a: a, h: h }), g);
  }
  function gPar(g) {
    var a = dim(g, 3), h = dim(g, 2);
    return mk("Parallelogrammning asosi " + a + " sm, balandligi " + h + " sm. Yuzasi necha sm²?", I(a * h), [I(a * h % 2 ? null : a * h / 2), I(2 * (a + h)), I(a + h), I(a * h + a)], "S = a × h = " + a * h, W("parS", { a: a, h: h }), g);
  }
  function gTrap(g) {
    var a = dim(g, 3), b = dim(g, 2), h = dim(g, 2); if (a === b) a++; if (((a + b) * h) % 2) h++;
    return mk("Trapetsiyaning asoslari " + a + " va " + b + " sm, balandligi " + h + " sm. Yuzasi necha sm²?", I((a + b) * h / 2), [I((a + b) * h), I(a * b * h % 2 ? null : a * b * h / 2), I((a + b) / 2 + h), I(a * h), I(a + b + h)], "S = (" + a + " + " + b + ") : 2 × " + h + " = " + (a + b) * h / 2, W("trapS", { a: a, b: b, h: h }), g);
  }
  function gCircC(g) {
    var r = ri(2, 9 + g.D * 2);
    return mk("Aylananing radiusi " + r + " sm. Uzunligini toping.", Pi(2 * r), [Pi(r), Pi(r * r), Pi(4 * r), I(2 * r), Pi(2 * r + 2)], "C = 2πr = 2 × " + r + " × π = " + Pi(2 * r).s, W("circC", { r: r }), g);
  }
  function gCircS(g) {
    var r = ri(2, 9 + g.D * 2);
    return mk("Doiraning radiusi " + r + " sm. Yuzasini toping (sm²).", Pi(r * r), [Pi(2 * r), Pi(4 * r * r), I(r * r), Pi(r * r * 2), Pi(r)], "S = πr² = " + Pi(r * r).s, W("circS", { r: r }), g);
  }
  function gCyl(g, tex) {
    var r = ri(1, 5 + g.D), h = ri(2, 9 + g.D);
    var t = tex ? "Silindrsimon bakning radiusi " + r + " dm, balandligi " + h + " dm. Hajmi necha dm³?" : "Silindrning radiusi " + r + " sm, balandligi " + h + " sm. Hajmini toping (sm³).";
    return mk(t, Pi(r * r * h), [Pi(2 * r * h), Pi(r * h), Pi(r * r * h * 2), I(r * r * h), Pi(r * r + h)], "V = πr²h = π × " + r * r + " × " + h + " = " + Pi(r * r * h).s, W("cylV", { r: r, h: h }), g);
  }
  function gCone(g) {
    var r = ri(1, 4 + g.D), h = 3 * ri(1, 4);
    return mk("Konusning asos radiusi " + r + " sm, balandligi " + h + " sm. Hajmini toping (sm³).", Pi(r * r * h / 3), [Pi(r * r * h), Pi(r * h), Pi(r * h / 3 % 1 ? r * h : r * h / 3), Pi(2 * r * h)], "V = πr²h : 3 = " + Pi(r * r * h / 3).s, W("coneV", { r: r, h: h }), g);
  }
  function gPoly(g) {
    var n = ri(4, 12);
    return mk("Qavariq " + n + " burchak ichki burchaklarining yig'indisi necha gradus?", Dg((n - 2) * 180), [Dg(n * 180), Dg((n - 1) * 180), Dg(360), Dg((n - 2) * 90)], "(n " + M + " 2) × 180° = " + (n - 2) + " × 180° = " + (n - 2) * 180 + "°", W("polySum", { n: n }), g);
  }
  function gReg(g) {
    var n = pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20]), v = (n - 2) * 180 / n;
    return mk("Muntazam " + n + " burchakning har bir ichki burchagini toping.", Dg(v), [Dg(360 / n), Dg((n - 2) * 180), Dg(180 - v / 2 % 1 ? null : 180 - v / 2), Dg(v - 10), Dg(v + 10)], "(" + n + " " + M + " 2) × 180° : " + n + " = " + v + "°", W("regAng", { n: n }), g);
  }
  function triple(g) { var t = pick(TRIP.slice(0, 5 + Math.min(5, g.D))), k = g.D >= 4 ? ri(1, 2) : 1; return [t[0] * k, t[1] * k, t[2] * k]; }
  function gHyp(g) {
    var t = triple(g), a = t[0], b = t[1], c = t[2];
    return mk("To'g'ri burchakli uchburchakning katetlari " + a + " va " + b + " sm. Gipotenuzasini toping.", I(c), [I(a + b), I(c + 1), I(a * a + b * b), I(b - a), I(c - 2)], "c = √(" + a * a + " + " + b * b + ") = √" + c * c + " = " + c, W("hyp", { a: a, b: b }), g);
  }
  function gLeg(g, tex) {
    var t = triple(g), a = t[0], b = t[1], c = t[2];
    if (chance(0.5)) { var s = a; a = b; b = s; }
    var txt = tex ? "Uzunligi " + c + " m bo'lgan narvon devordan " + a + " m uzoqda turibdi. Narvon devorning qancha balandligiga yetadi (m)?"
      : "To'g'ri burchakli uchburchakning gipotenuzasi " + c + " sm, bir kateti " + a + " sm. Ikkinchi katetini toping.";
    return mk(txt, I(b), [I(c - a), I(c + a), I(b + 1), I(c * c - a * a), I(b - 1)], "b = √(" + c * c + " " + M + " " + a * a + ") = √" + b * b + " = " + b, W("leg", { c: c, a: a }), g);
  }
  function gDist(g) {
    var t = triple(g), dx = t[0] * (chance(0.5) ? 1 : -1), dy = t[1] * (chance(0.5) ? 1 : -1);
    if (chance(0.5)) { var s = dx; dx = dy; dy = s; }
    var x1 = ri(-6, 6), y1 = ri(-6, 6), x2 = x1 + dx, y2 = y1 + dy;
    return mk("A(" + fi(x1) + "; " + fi(y1) + ") va B(" + fi(x2) + "; " + fi(y2) + ") nuqtalar orasidagi masofani toping.", I(t[2]), [I(Math.abs(dx) + Math.abs(dy)), I(t[2] * t[2]), I(t[2] + 1), I(Math.abs(Math.abs(dx) - Math.abs(dy))), I(t[2] - 1)],
      "AB = √(" + dx * dx + " + " + dy * dy + ") = " + t[2], W("dist", { x1: x1, y1: y1, x2: x2, y2: y2 }), g);
  }
  function gRhomb(g) {
    var d1 = ri(2, 10 + g.D * 2), d2 = ri(2, 10 + g.D * 2); if ((d1 * d2) % 2) d1++; if (d1 === d2) d2 += 2;
    return mk("Rombning diagonallari " + d1 + " va " + d2 + " sm. Yuzasi necha sm²?", I(d1 * d2 / 2), [I(d1 * d2), I(d1 + d2), I(2 * (d1 + d2)), I(d1 * d2 / 2 + 2)], "S = " + d1 + " × " + d2 + " : 2 = " + d1 * d2 / 2, W("rhomb", { a: d1, b: d2 }), g);
  }
  function gPaint(g) {
    var c = ri(5, 12), L = ri(2, 6 + g.D * 2), A = c * L;
    return mk("1 litr bo'yoq " + c + " m² devorga yetadi. " + A + " m² devorni bo'yash uchun necha litr kerak?", I(L), [I(A - c), I(L + 1), I(A * c > 99999 ? null : A * c), I(L * 2), I(L - 1)], A + " : " + c + " = " + L + " litr", W("div", { a: A, b: c }), g);
  }
  function genGeo(g) {
    var list;
    if (g.gr === "5-6") list = [gRectP, gRectS, gSq, gTriAng].concat(g.D >= 1 ? [gCube, gTriAng] : []).concat(g.D >= 2 ? [gBox] : []);
    else if (g.gr === "7-8") list = [gAdj, gIso, gRight, gTriS, gPar, gTriAng].concat(g.D >= 2 ? [gCircC, gTrap] : []).concat(g.D >= 3 ? [gPoly, gHyp] : []);
    else if (g.gr === "9-11") list = [gHyp, gLeg, gReg, gCircS, gCyl, gCone, gRhomb, gDist, gPoly, gTrap];
    else list = [function (x) { return gRectS(x, true); }, function (x) { return gRectP(x, true); }, gPaint, function (x) { return gLeg(x, true); },
      function (x) { return gCyl(x, true); }, function (x) { return gCube(x, true); }, gHyp, gReg, gCircS, gDist, gTrap];
    return pick(list)(g);
  }

  var GEN = { arifmetika: genArif, kasrlar: genKasr, foizlar: genFoiz, tenglamalar: genTeng, darajalar: genDaraja, geometriya: genGeo };
  var MIXW = ["arifmetika", "arifmetika", "kasrlar", "foizlar", "tenglamalar", "darajalar", "geometriya"];

  function next(o) {
    o = o || {};
    var g = ctx(o), topic = normTopic(o.topic);
    var real = topic === "aralash" ? pick(MIXW) : topic;
    var q;
    for (var attempt = 0; attempt < 8; attempt++) {
      try { q = GEN[real](g); } catch (e) { q = null; }
      if (q && q.options.length === 4 && q.correct >= 0) break;
    }
    if (!q || q.correct < 0) q = arMul(g);
    q.topic = real; q.grade = g.gr; q.level = g.L;
    return q;
  }

  // Tez savol (qayta o'qlash uchun) — 3 ta variant, og'zaki hisob
  function quick(o) {
    var g = ctx(o || {}), D = g.D, a, b, e, ans, w;
    switch (ri(0, 3)) {
      case 0: a = ri(11, 40 + D * 10); b = ri(2, D >= 3 ? 39 : 9); e = a + " + " + b; ans = a + b; w = [ans + 1, ans - 1, ans + 10, ans - 10]; break;
      case 1: a = ri(20, 60 + D * 10); b = ri(2, D >= 3 ? 19 : 9); e = a + " " + M + " " + b; ans = a - b; w = [ans + 1, ans - 1, ans + 10, a + b]; break;
      case 2: a = ri(2, 9); b = ri(2, D >= 2 ? 12 : 9); e = a + " × " + b; ans = a * b; w = [ans + a, ans - a, ans + b, ans - b, ans + 1]; break;
      default: b = ri(2, 9); ans = ri(2, D >= 2 ? 12 : 9); a = ans * b; e = a + " : " + b; w = [ans + 1, ans - 1, ans + 2, b]; break;
    }
    var q = mk(e + " = ?", I(ans), w.map(I), e + " = " + ans, E(e), g, 3);
    q.topic = "tez"; return q;
  }

  // Boss savoli: ko'p bosqichli masala (Airdrop ovchisi uchun)
  function stepQ(g, e, v) { return mk(e + " = ?", I(v), [I(v + 1), I(v - 1), I(v + 10), I(v - 10), I(v * 2), I(v + 2)], e + " = " + fi(v), E(e), g); }
  function boss(o) {
    var g = ctx(o || {}), D = g.D, t = ri(0, g.gr === "5-6" ? 2 : 4), steps = [], text, ex, final, meta, a, b, c, d, s1, s2, s3;
    if (t === 0) {
      a = ri(5, 20 + D * 6); b = ri(5, 20 + D * 6); c = ri(2, 9); d = ri(1, (a + b) * c - 1);
      text = "(" + a + " + " + b + ") × " + c + " " + M + " " + d; s1 = a + b; s2 = s1 * c; s3 = s2 - d;
      steps = [stepQ(g, a + " + " + b, s1), stepQ(g, s1 + " × " + c, s2), stepQ(g, s2 + " " + M + " " + d, s3)];
      final = s3; meta = E(text); ex = text + " = " + s3;
    } else if (t === 1) {
      var w0 = ri(3, 9 + D * 3), h0 = ri(2, 9 + D * 2); if (w0 === h0) w0++;
      var P = 2 * (w0 + h0);
      text = "To'g'ri to'rtburchakning perimetri " + P + " sm, bo'yi " + w0 + " sm. Yuzasi necha sm²?";
      steps = [stepQ(g, P + " : 2", w0 + h0), stepQ(g, (w0 + h0) + " " + M + " " + w0, h0), stepQ(g, w0 + " × " + h0, w0 * h0)];
      final = w0 * h0; meta = W("rectSfromP", { P: P, a: w0 }); ex = "Eni = " + P + " : 2 " + M + " " + w0 + " = " + h0 + "; S = " + w0 * h0;
    } else if (t === 2) {
      var p = pick([10, 20, 25, 50]), N = pbase(p) * ri(2, 10 + D * 4) * 2, k = ri(2, 6);
      text = "Do'konda " + N + " ta daftar bor edi. Ularning " + p + "% i sotildi. Qolganini " + k + " ta sinfga teng bo'lishdi. Har bir sinfga nechtadan?";
      var sold = N * p / 100, rest = N - sold;
      if (rest % k) { k = 1; for (var kk = 2; kk <= 6; kk++) if (rest % kk === 0) k = kk; }
      if (k === 1) { k = 2; N = N * 2; sold = N * p / 100; rest = N - sold; if (rest % 2) { N *= 2; sold = N * p / 100; rest = N - sold; } }
      text = "Do'konda " + N + " ta daftar bor edi. Ularning " + p + "% i sotildi. Qolganini " + k + " ta sinfga teng bo'lishdi. Har bir sinfga nechtadan?";
      steps = [stepQ(g, N + " × " + p + " : 100", sold), stepQ(g, N + " " + M + " " + sold, rest), stepQ(g, rest + " : " + k, rest / k)];
      final = rest / k; meta = W("pctRestDiv", { n: N, p: p, k: k }); ex = "Sotildi " + sold + ", qoldi " + rest + ", " + rest + " : " + k + " = " + rest / k;
    } else if (t === 3) {
      a = ri(2, 9); var x = ri(-9, 15); if (!x) x = 4; b = ri(1, 12); c = ri(1, 30);
      d = a * (x - b) + c;
      text = "x ni toping: " + a + "(x " + M + " " + b + ") + " + c + " = " + fi(d);
      s1 = d - c; s2 = s1 / a;
      steps = [stepQ(g, fi(d) + " " + M + " " + c, s1), stepQ(g, par(s1) + " : " + a, s2), stepQ(g, par(s2) + " + " + b, x)];
      final = x; meta = EQ(a + "(x " + M + " " + b + ") + " + c + " = " + fi(d)); ex = a + "(x " + M + " " + b + ") = " + fi(s1) + "; x " + M + " " + b + " = " + fi(s2) + "; x = " + fi(x);
    } else {
      a = ri(2, 6 + D); b = ri(2, 6 + D); c = ri(2, 4);
      text = a + "² + " + b + "² × " + c;
      steps = [stepQ(g, a + "²", a * a), stepQ(g, b + "² × " + c, b * b * c), stepQ(g, a * a + " + " + b * b * c, a * a + b * b * c)];
      final = a * a + b * b * c; meta = E(text); ex = a * a + " + " + b * b * c + " = " + final;
    }
    var q = mk(text, I(final), [I(final + 10), I(final - 10), I(final + 1), I(final * 2), I(final - 1)], ex, meta, g);
    q.steps = steps; q.topic = "boss"; q.grade = g.gr; q.level = g.L;
    return q;
  }

  var API = {
    next: next, quick: quick, boss: boss,
    grades: GRADES, topics: TOPICS, normGrade: normGrade, normTopic: normTopic,
    gradeName: function (g) { g = normGrade(g); for (var i = 0; i < GRADES.length; i++) if (GRADES[i][0] === g) return GRADES[i][1]; return g; },
    topicName: function (t) { t = normTopic(t); for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i][0] === t) return TOPICS[i][1]; return t; },
    _setRandom: function (fn) { rnd = typeof fn === "function" ? fn : Math.random; }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (root) root.RoyaleSavol = API;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
