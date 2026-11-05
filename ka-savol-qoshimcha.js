/*! Kuvonch Academy — qo'shimcha savol turlari (takrorlanmasligi uchun) */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S || !S.fn) return;
  var H = S.H, R = H.R, RNZ = H.RNZ, pick = H.pick, shuffle = H.shuffle, fr = H.fr, gcd = H.gcd, ms = H.ms, par = H.par, poly = H.poly, nearW = H.nearW;
  function S2(x) { return typeof x === "number" ? ms(x) : String(x); }
  function Q(q, a, w, steps) { return { q: q, a: S2(a), w: w.map(S2), steps: steps || [], lang: S.lang() }; }
  // share(L): yangi generator ishlatilish ehtimoli. Xato bo'lsa yoki variantlar yetmasa — asl generator
  function aug(id, extra, share) {
    var base = S.fn(id); if (!base) return;
    S.register(id, function (L) {
      var p = null;
      if (Math.random() < share(L)) { try { p = extra(L); } catch (e) { p = null; } }
      if (p && (!p.w || p.w.length < 3)) p = null;
      return p || base(L);
    });
  }
  function sh(a, b, c) { return function (L) { return L === 1 ? a : L === 2 ? b : c; }; }
  // takrorlanmas noto'g'ri variantlar (javobga teng bo'lganlari tashlanadi)
  function W(a, list, n) {
    var out = [], seen = {}; seen[String(a)] = 1;
    for (var i = 0; i < list.length && out.length < (n || 4); i++) {
      var s = String(list[i]);
      if (s && !seen[s] && s !== "NaN" && s !== "undefined" && s !== "Infinity" && s !== "-Infinity") { seen[s] = 1; out.push(s); }
    }
    return out;
  }
  // qisqartirilgan kasr, minus "−" bilan
  function F(n, d) { if (!d) return ""; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n /= g; d /= g; return (n < 0 ? "−" : "") + Math.abs(n) + (d === 1 ? "" : "/" + d); }
  function deg(d) { return ms(d) + "°"; }
  function dgs(d) { return (d < 0 ? "−" : "") + String(Math.abs(d)).replace(".", ",") + "°"; }
  // p/q·π ko'rinishida: 7π/6, −π/4, 2π
  function radF(p, q) {
    if (p === 0) return "0";
    if (q < 0) { p = -p; q = -q; }
    var g = gcd(p, q); p /= g; q /= g;
    return (p < 0 ? "−" : "") + (Math.abs(p) === 1 ? "" : Math.abs(p)) + "π" + (q === 1 ? "" : "/" + q);
  }
  function rad(d) { return radF(d, 180); }
  function piN(p, q) { var g = gcd(p, q); p /= g; q /= g; return (p === 1 ? "" : p) + "πn" + (q === 1 ? "" : "/" + q); }
  function ang(d, r) { return r ? rad(d) : deg(d); }

  /* ================= Trigonometriya: aniq qiymatlar jadvali ================= */
  var UND = "aniqlanmagan";
  var ANG = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  var SREF = { 0: "0", 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1" };
  var TREF = { 0: "0", 30: "√3/3", 45: "1", 60: "√3" };
  var FN = ["sin", "cos", "tg", "ctg"];
  var CO = { sin: "cos", cos: "sin", tg: "ctg", ctg: "tg" };
  var VALS = ["0", "1/2", "√2/2", "√3/2", "1", "−1/2", "−√2/2", "−√3/2", "−1", "√3", "√3/3", "−√3", "−√3/3"];
  function nd(d) { d %= 360; return d < 0 ? d + 360 : d; }
  function isTab(d) { return ANG.indexOf(nd(d)) > -1; }
  function neg(v) { return v === "0" || v === UND ? v : v.charAt(0) === "−" ? v.slice(1) : "−" + v; }
  function sinV(d) {
    d = nd(d); var r, s = 1;
    if (d <= 90) r = d; else if (d <= 180) r = 180 - d; else if (d <= 270) { r = d - 180; s = -1; } else { r = 360 - d; s = -1; }
    var v = SREF[r]; return s < 0 ? neg(v) : v;
  }
  function cosV(d) { return sinV(90 - d); }
  function tgV(d) { var t = nd(d) % 180; if (t === 90) return UND; return t < 90 ? TREF[t] : neg(TREF[180 - t]); }
  function ctgV(d) { return tgV(90 - d); }
  function fV(fn, d) { return fn === "sin" ? sinV(d) : fn === "cos" ? cosV(d) : fn === "tg" ? tgV(d) : ctgV(d); }
  function fnum(fn, x) { return fn === "sin" ? Math.sin(x) : fn === "cos" ? Math.cos(x) : fn === "tg" ? Math.tan(x) : Math.cos(x) / Math.sin(x); }
  // qiymat satri → son (√2/2, −√3, 1/2 ...)
  function vNum(v) {
    if (v === UND) return NaN;
    var s = String(v).replace("−", "-"), sg = 1;
    if (s.charAt(0) === "-") { sg = -1; s = s.slice(1); }
    var m = /^(\d*)(√(\d+))?(?:\/(\d+))?$/.exec(s); if (!m) return NaN;
    var k = m[1] ? +m[1] : 1, r = m[3] ? Math.sqrt(+m[3]) : 1, d = m[4] ? +m[4] : 1;
    if (!m[1] && !m[2]) return NaN;
    return sg * k * r / d;
  }
  // qiymatning kvadrati (ratsional): [surat, maxraj]
  function vSq(v) { var x = vNum(v); x = x * x; for (var d = 1; d <= 12; d++) { var n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return [n, d]; } return null; }
  function vRat(v) { var x = vNum(v); for (var d = 1; d <= 4; d++) { var n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-9) return [n, d]; } return null; }
  function togg(s) { return s.charAt(0) === "−" ? s.slice(1) : "−" + s; }
  // shu chorakdagi "ko'zgu" burchak qiymati (keltirilgan burchakni adashtirish xatosi)
  function mirV(fn, d) { var d0 = nd(d); if (d0 % 90 === 0) return neg(fV(fn, d)); var q = quad(d0); return fV(fn, 90 * (2 * q - 1) - d0); }
  function quad(d) { d = nd(d); return d < 90 ? 1 : d < 180 ? 2 : d < 270 ? 3 : 4; }
  var RIM = ["", "I", "II", "III", "IV"];
  function tf(fn, a, r) { // "sin 210°", "cos(−45°)", "tg(7π/6)"
    var s = ang(a, r); return fn + (r || a < 0 ? "(" + s + ")" : " " + s);
  }
  // qiymat uchun noto'g'ri variantlar: ishorasi teskari, ko-funksiya qiymati va h.k.
  function wVal(a, alts) {
    var l = [neg(a)].concat(alts || []).concat(shuffle(VALS));
    if (a === UND) l = ["0", "1", "−1"].concat(shuffle(VALS));
    return W(a, l, 4);
  }
  function valSteps(fn, d, r) {
    var d0 = nd(d), v = fV(fn, d), st = [];
    if (d0 !== d) st.push((fn === "tg" || fn === "ctg") && d % 180 !== d0 % 180 ? "Davriylik" : "Davriylik: " + tf(fn, d, r) + " = " + tf(fn, d0, r));
    if (d0 % 90 === 0) st.push("Jadval qiymati: " + tf(fn, d0, r) + " = " + v);
    else {
      var q = quad(d0), ref = q === 1 ? d0 : q === 2 ? 180 - d0 : q === 3 ? d0 - 180 : 360 - d0;
      st.push(ang(d0, r) + " — " + RIM[q] + " chorak, keltirilgan burchak " + ang(ref, r));
      st.push(tf(fn, d0, r) + " = " + v);
    }
    return st;
  }
  // teskari funksiyalar (gradusda)
  function arcD(fn, v) {
    var c = fn === "sin" ? [-90, -60, -45, -30, 0, 30, 45, 60, 90] : fn === "cos" ? [0, 30, 45, 60, 90, 120, 135, 150, 180]
      : fn === "tg" ? [-60, -45, -30, 0, 30, 45, 60] : [30, 45, 60, 90, 120, 135, 150];
    for (var i = 0; i < c.length; i++) if (fV(fn, c[i]) === v) return c[i];
    return null;
  }
  var SV = ["−1", "−√3/2", "−√2/2", "−1/2", "0", "1/2", "√2/2", "√3/2", "1"];
  var TV = ["−√3", "−1", "−√3/3", "0", "√3/3", "1", "√3"];
  var TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [6, 8, 10]];
  function tri() { var t = pick(TRI); return Math.random() < .5 ? t : [t[1], t[0], t[2]]; }
  var QIV = [null, ["(0°; 90°)", "(0; π/2)"], ["(90°; 180°)", "(π/2; π)"], ["(180°; 270°)", "(π; 3π/2)"], ["(270°; 360°)", "(3π/2; 2π)"]];
  var QS = { 1: [1, 1], 2: [1, -1], 3: [-1, -1], 4: [-1, 1] }; // [sin ishorasi, cos ishorasi]
  function lin2(a, A, b, B) { // a·A + b·B (koeffitsiyent 1 bo'lsa yozilmaydi)
    function c(k, t, first) { var s = t === "" ? String(Math.abs(k)) : Math.abs(k) === 1 ? t : Math.abs(k) + t; return first ? (k < 0 ? "−" : "") + s : (k < 0 ? " − " : " + ") + s; }
    return c(a, A, true) + c(b, B, false);
  }

  /* ---------- t68: asosiy ayniyatlar va keltirish formulalari ---------- */
  var SHIFT = [null, ["90°", "π/2"], ["180°", "π"], ["270°", "3π/2"], ["360°", "2π"]];
  function redArg(k, s, r) { return k === 0 ? "−α" : SHIFT[k][r ? 1 : 0] + (s > 0 ? " + α" : " − α"); }
  function redRes(fn, k, s) { // fn(k·90° ± α) = [ishora, funksiya]
    var g = k % 2 ? CO[fn] : fn, th = (90 * k + s * 20) * Math.PI / 180;
    return [fnum(fn, th) / fnum(g, 20 * Math.PI / 180) > 0 ? 1 : -1, g];
  }
  function redPick() { var k = R(0, 4), s = k === 0 ? -1 : pick([1, -1]); return [k, s]; }
  function combStr(m) {
    var out = "";
    ["sin", "cos", "tg", "ctg"].forEach(function (g) {
      var c = m[g]; if (!c) return;
      var t = (Math.abs(c) === 1 ? "" : Math.abs(c)) + g + " α";
      out += out ? (c < 0 ? " − " : " + ") + t : (c < 0 ? "−" : "") + t;
    });
    return out || "0";
  }
  var IDS = [
    ["1 − sin²α", "cos²α", ["sin²α", "−cos²α", "1 + cos²α"]], ["1 − cos²α", "sin²α", ["cos²α", "−sin²α", "1 + sin²α"]],
    ["sin²α − 1", "−cos²α", ["cos²α", "sin²α", "−sin²α"]], ["cos²α − 1", "−sin²α", ["sin²α", "−cos²α", "cos²α"]],
    ["tg α · ctg α", "1", ["0", "tg²α", "−1"]], ["1 + tg²α", "1/cos²α", ["1/sin²α", "ctg²α", "cos²α"]],
    ["1 + ctg²α", "1/sin²α", ["1/cos²α", "tg²α", "sin²α"]], ["tg α · cos α", "sin α", ["cos α", "1", "ctg α"]],
    ["ctg α · sin α", "cos α", ["sin α", "1", "tg α"]], ["(1 − cos²α)/cos²α", "tg²α", ["ctg²α", "sin²α", "1"]],
    ["(1 − sin²α)/sin²α", "ctg²α", ["tg²α", "cos²α", "1"]], ["(sin α + cos α)² − 2sin α cos α", "1", ["0", "2", "sin 2α"]],
    ["(sin α + cos α)² + (sin α − cos α)²", "2", ["1", "0", "4sin α cos α"]], ["1/cos²α − 1", "tg²α", ["ctg²α", "sin²α", "1"]],
    ["1/sin²α − 1", "ctg²α", ["tg²α", "cos²α", "1"]], ["sin α / tg α", "cos α", ["sin α", "1", "ctg α"]],
    ["cos α / ctg α", "sin α", ["cos α", "1", "tg α"]], ["cos²α · tg²α + cos²α", "1", ["cos²α", "sin²α", "2"]],
    ["sin²α · ctg²α + sin²α", "1", ["sin²α", "cos²α", "2"]], ["(1 − sin α)(1 + sin α)", "cos²α", ["sin²α", "1", "−cos²α"]],
    ["(1 − cos α)(1 + cos α)", "sin²α", ["cos²α", "1", "−sin²α"]], ["sin⁴α − cos⁴α + cos²α", "sin²α", ["cos²α", "1", "2sin²α"]],
    ["(tg α + ctg α) · sin α cos α", "1", ["2", "0", "tg α"]], ["sin²α + cos²α + tg²α", "1/cos²α", ["1/sin²α", "1 + ctg²α", "2"]]
  ];
  var FORM = [
    ["cos 2α ni cos α orqali yozing.", "2cos²α − 1", ["1 − 2cos²α", "2cos²α + 1", "cos²α − 1"]],
    ["cos 2α ni sin α va cos α orqali yozing.", "cos²α − sin²α", ["sin²α − cos²α", "2sin α cos α", "cos²α + sin²α"]],
    ["tg 2α formulasini yozing.", "2tg α/(1 − tg²α)", ["2tg α/(1 + tg²α)", "tg²α − 1", "2tg α"]],
    ["sin²α ni cos 2α orqali ifodalang.", "(1 − cos 2α)/2", ["(1 + cos 2α)/2", "1 − cos 2α", "(cos 2α − 1)/2"]],
    ["cos²α ni cos 2α orqali ifodalang.", "(1 + cos 2α)/2", ["(1 − cos 2α)/2", "1 + cos 2α", "(cos 2α − 1)/2"]],
    ["sin(α + β) formulasini yozing.", "sin α cos β + cos α sin β", ["sin α cos β − cos α sin β", "cos α cos β − sin α sin β", "sin α sin β + cos α cos β"]],
    ["sin(α − β) formulasini yozing.", "sin α cos β − cos α sin β", ["sin α cos β + cos α sin β", "cos α cos β + sin α sin β", "sin α sin β − cos α cos β"]],
    ["cos(α + β) formulasini yozing.", "cos α cos β − sin α sin β", ["cos α cos β + sin α sin β", "sin α cos β + cos α sin β", "sin α sin β − cos α cos β"]],
    ["cos(α − β) formulasini yozing.", "cos α cos β + sin α sin β", ["cos α cos β − sin α sin β", "sin α cos β − cos α sin β", "sin α sin β − cos α cos β"]],
    ["sin α + sin β ni ko'paytmaga keltiring.", "2sin((α+β)/2)·cos((α−β)/2)", ["2cos((α+β)/2)·cos((α−β)/2)", "2sin((α+β)/2)·sin((α−β)/2)", "sin(α+β)"]],
    ["cos α + cos β ni ko'paytmaga keltiring.", "2cos((α+β)/2)·cos((α−β)/2)", ["2sin((α+β)/2)·cos((α−β)/2)", "−2sin((α+β)/2)·sin((α−β)/2)", "cos(α+β)"]],
    ["sin 3α ni sin α orqali yozing.", "3sin α − 4sin³α", ["4sin³α − 3sin α", "3sin α", "3sin α + 4sin³α"]]
  ];
  function t68x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 1, 2] : L === 2 ? [0, 3, 3, 4, 4] : [3, 4, 5, 5, 6, 6, 7]);
    if (k === 0) { // keltirish formulasi
      var fn = pick(FN), rp = redPick(), r = Math.random() < .5, res = redRes(fn, rp[0], rp[1]);
      var a = (res[0] < 0 ? "−" : "") + res[1] + " α", g2 = res[1] === fn ? CO[fn] : fn;
      var arg = redArg(rp[0], rp[1], r);
      return Q("Soddalashtiring: " + fn + "(" + arg + ")", a, W(a, [(res[0] < 0 ? "" : "−") + res[1] + " α", (res[0] < 0 ? "−" : "") + g2 + " α", (res[0] < 0 ? "" : "−") + g2 + " α"]),
        [rp[0] % 2 ? SHIFT[rp[0]][r ? 1 : 0] + " — funksiya nomi o'zgaradi: " + fn + " → " + res[1] : "Funksiya nomi o'zgarmaydi", "α o'tkir deb olsak, " + fn + "(" + arg + ") ishorasi: " + (res[0] < 0 ? "−" : "+"), "Javob: " + a]);
    }
    if (k === 1) { var it = pick(IDS);
      return Q("Soddalashtiring: " + it[0], it[1], it[2], ["sin²α + cos²α = 1, tg α = sin α/cos α", "Javob: " + it[1]]); }
    if (k === 2) { var n = R(2, 9), m = R(1, 9), kind = R(0, 2);
      if (kind === 0) return Q("Hisoblang: " + n + "sin²α + " + m + " + " + n + "cos²α", n + m, W(n + m, [2 * n + m, n, m, n + m + 1, n * m]), [n + "(sin²α + cos²α) + " + m + " = " + n + " + " + m + " = " + (n + m)]);
      if (kind === 1) return Q("Hisoblang: " + n + "·tg α·ctg α − " + m, n - m, W(n - m, [n, n + m, -m, n - m - 1, n * m - m]), ["tg α·ctg α = 1", n + "·1 − " + m + " = " + (n - m)]);
      return Q("Hisoblang: " + n + " − " + n + "sin²α − " + n + "cos²α + " + m, m, W(m, [n + m, 2 * n + m, m - n, m + 1]), [n + " − " + n + "(sin²α + cos²α) + " + m, "= " + n + " − " + n + " + " + m + " = " + m]);
    }
    if (k === 3) { // ikki hadli keltirish
      var f1 = pick(["sin", "cos"]), f2 = pick(["sin", "cos"]), p1 = redPick(), p2 = redPick(), op = pick([1, -1]), rr = L === 3 && Math.random() < .6;
      if (p1[0] === p2[0] && p1[1] === p2[1] && f1 === f2) p2 = [(p1[0] + 1) % 5, p1[0] + 1 === 5 ? -1 : 1];
      if (p2[0] === 0) p2[1] = -1;
      var r1 = redRes(f1, p1[0], p1[1]), r2 = redRes(f2, p2[0], p2[1]);
      var mk = function (s1, g1, s2, g2) { var m2 = {}; m2[g1] = (m2[g1] || 0) + s1; m2[g2] = (m2[g2] || 0) + op * s2; return combStr(m2); };
      var ans = mk(r1[0], r1[1], r2[0], r2[1]);
      var e = f1 + "(" + redArg(p1[0], p1[1], rr) + ") " + (op > 0 ? "+" : "−") + " " + f2 + "(" + redArg(p2[0], p2[1], rr) + ")";
      return Q("Soddalashtiring: " + e, ans, W(ans, [mk(-r1[0], r1[1], r2[0], r2[1]), mk(r1[0], r1[1], -r2[0], r2[1]), mk(r1[0], f1, r2[0], f2), mk(-r1[0], r1[1], -r2[0], r2[1]), mk(r1[0], CO[r1[1]], r2[0], r2[1]), "0", "2sin α", "2cos α"]),
        [f1 + "(" + redArg(p1[0], p1[1], rr) + ") = " + (r1[0] < 0 ? "−" : "") + r1[1] + " α", f2 + "(" + redArg(p2[0], p2[1], rr) + ") = " + (r2[0] < 0 ? "−" : "") + r2[1] + " α", "Javob: " + ans]);
    }
    if (k === 4) { // ixtiyoriy burchakning qiymati
      var fn4 = pick(FN), d = pick(ANG.slice(5)), r4 = L === 3 && Math.random() < .5;
      var form = R(0, 2); if (form === 1) d = d + 360 * R(1, 2); if (form === 2) d = -pick(ANG.slice(1));
      var v = fV(fn4, d);
      if (v === UND) { fn4 = fn4 === "tg" ? "sin" : "cos"; v = fV(fn4, d); }
      return Q(tf(fn4, d, r4) + " ni hisoblang.", v, wVal(v, [fV(CO[fn4], d), mirV(fn4, d)]), valSteps(fn4, d, r4));
    }
    if (k === 5) { // ikkilangan burchak va qo'shish formulalari (son)
      var kind5 = R(0, 3);
      if (kind5 < 2) {
        var th = pick([15, 75, 105, 165, 22.5, 67.5, 112.5, 157.5]), f5 = R(0, 3), t2 = 2 * th, tS = dgs(th);
        var ex = ["2sin " + tS + "·cos " + tS, "cos²" + tS + " − sin²" + tS, "1 − 2sin²" + tS, "2cos²" + tS + " − 1"][f5];
        var res5 = f5 === 0 ? sinV(t2) : cosV(t2);
        return Q("Hisoblang: " + ex, res5, wVal(res5, [f5 === 0 ? cosV(t2) : sinV(t2), mirV(f5 === 0 ? "sin" : "cos", t2)]),
          [f5 === 0 ? "2sin α cos α = sin 2α" : "Ikkilangan burchak: cos 2α", "= " + (f5 === 0 ? "sin " : "cos ") + dgs(t2) + " = " + res5]);
      }
      var T = pick([30, 45, 60, 90, 120, 135, 150]), f6 = R(0, 3), B = pick([5, 10, 12, 15, 18, 20, 25, 35, 40, 50, 55]);
      var A = f6 % 2 === 0 ? T - B : T + B; if (A <= 0) { A = T + B; f6 = f6 === 0 ? 1 : 3; }
      var tt = f6 % 2 === 0 ? A + B : A - B;
      var exs = ["sin " + A + "°·cos " + B + "° + cos " + A + "°·sin " + B + "°", "sin " + A + "°·cos " + B + "° − cos " + A + "°·sin " + B + "°",
        "cos " + A + "°·cos " + B + "° − sin " + A + "°·sin " + B + "°", "cos " + A + "°·cos " + B + "° + sin " + A + "°·sin " + B + "°"][f6];
      var isS = f6 < 2, res6 = isS ? sinV(tt) : cosV(tt);
      return Q("Hisoblang: " + exs, res6, wVal(res6, [isS ? cosV(tt) : sinV(tt), mirV(isS ? "sin" : "cos", tt)]),
        [isS ? (f6 === 0 ? "sin(α + β)" : "sin(α − β)") + " formulasi" : (f6 === 2 ? "cos(α + β)" : "cos(α − β)") + " formulasi", "= " + (isS ? "sin " : "cos ") + tt + "° = " + res6]);
    }
    if (k === 6) { // nisbat
      var g1 = pick(["sin", "cos"]), g2b = pick(["sin", "cos"]), q1 = redPick(), q2 = redPick(), rq = Math.random() < .5;
      var s1 = redRes(g1, q1[0], q1[1]), s2 = redRes(g2b, q2[0], q2[1]), sg = s1[0] * s2[0];
      var core = s1[1] === s2[1] ? "1" : s1[1] === "sin" ? "tg α" : "ctg α", ans6 = sg < 0 ? (core === "1" ? "−1" : "−" + core) : core;
      return Q("Soddalashtiring: " + g1 + "(" + redArg(q1[0], q1[1], rq) + ") / " + g2b + "(" + redArg(q2[0], q2[1], rq) + ")", ans6,
        W(ans6, [togg(ans6)].concat(shuffle(["1", "tg α", "ctg α"].filter(function (c) { return c !== core; })).map(function (c) { return sg < 0 ? "−" + c : c; }), ["1", "−1", "tg α", "−tg α", "ctg α", "−ctg α"])),
        [g1 + "(" + redArg(q1[0], q1[1], rq) + ") = " + (s1[0] < 0 ? "−" : "") + s1[1] + " α", g2b + "(" + redArg(q2[0], q2[1], rq) + ") = " + (s2[0] < 0 ? "−" : "") + s2[1] + " α", "Javob: " + ans6]);
    }
    var it7 = pick(FORM);
    return Q(it7[0], it7[1], it7[2], ["Formula: " + it7[1]]);
  }

  /* ---------- t3: trigonometrik ayniyatlar (chorak ishorasi bilan) ---------- */
  function t3x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [0, 3, 3, 3, 2] : [3, 4, 4, 5, 5, 6, 7]);
    var t, q, rr, sS, sC, given, val, target, ans, sinF, cosF, tgF, ctgF;
    function setup(qd) {
      t = tri(); q = qd; rr = Math.random() < .5; sS = QS[q][0]; sC = QS[q][1];
      sinF = F(sS * t[0], t[2]); cosF = F(sC * t[1], t[2]); tgF = F(sS * sC * t[0], t[1]); ctgF = F(sS * sC * t[1], t[0]);
    }
    function V(f) { return f === "sin" ? sinF : f === "cos" ? cosF : f === "tg" ? tgF : ctgF; }
    if (k === 0 || k === 3) {
      setup(k === 0 ? 1 : R(1, 4)); given = pick(["sin", "cos"]); target = pick(FN.filter(function (f) { return f !== given; }));
      if (k === 0 && Math.random() < .5) rr = true;
      ans = V(target);
      var wr = [neg(ans), F(t[2], t[1]), V(CO[target]), neg(V(CO[target])), F(sS * t[1], t[0]), F(t[0], t[1])];
      if (target === "tg" || target === "ctg") wr.unshift(target === "tg" ? ctgF : tgF);
      return Q(given + " α = " + V(given) + ", α ∈ " + QIV[q][rr ? 1 : 0] + ". " + target + " α ni toping.", ans, W(ans, wr),
        [given === "sin" ? "cos²α = 1 − sin²α = " + F(t[1] * t[1], t[2] * t[2]) : "sin²α = 1 − cos²α = " + F(t[0] * t[0], t[2] * t[2]),
          RIM[q] + " chorakda: sin " + (sS > 0 ? "> 0" : "< 0") + ", cos " + (sC > 0 ? "> 0" : "< 0"), target + " α = " + ans]);
    }
    if (k === 1) { var n = R(2, 9), m = R(1, 9), A = R(1, 89), c = R(0, 1);
      if (c === 0) return Q("Hisoblang: " + n + "sin²" + A + "° + " + n + "cos²" + A + "° − " + m, n - m, W(n - m, [n, n + m, 2 * n - m, n - m + 1, -m]), ["sin²α + cos²α = 1", n + " − " + m + " = " + (n - m)]);
      return Q("Hisoblang: " + n + "·tg " + A + "°·ctg " + A + "° + " + m, n + m, W(n + m, [n, m, n * m, n + m + 1, n - m]), ["tg α·ctg α = 1", n + " + " + m + " = " + (n + m)]); }
    if (k === 2) { setup(1); target = pick(["tg", "ctg"]);
      var gv = pick(["sin", "cos"]);
      ans = V(target);
      return Q(gv + " α = " + V(gv) + " (α — o'tkir burchak). " + target + " α ni toping.", ans, W(ans, [target === "tg" ? ctgF : tgF, sinF, cosF, neg(ans), F(t[2], t[0])]),
        [(gv === "sin" ? "cos α = " + cosF : "sin α = " + sinF), "tg α = sin α/cos α = " + tgF + (target === "ctg" ? ", ctg α = 1/tg α = " + ctgF : "")]); }
    if (k === 4) { // tg berilgan
      setup(R(1, 4)); given = pick(["tg", "ctg"]); target = pick(["sin", "cos"]); ans = V(target);
      return Q(given + " α = " + V(given) + ", α ∈ " + QIV[q][rr ? 1 : 0] + ". " + target + " α ni toping.", ans, W(ans, [neg(ans), V(CO[target]), neg(V(CO[target])), F(t[2], t[1]), F(t[1], t[0])]),
        [given === "tg" ? "1 + tg²α = 1/cos²α → cos²α = " + F(t[1] * t[1], t[2] * t[2]) : "1 + ctg²α = 1/sin²α → sin²α = " + F(t[0] * t[0], t[2] * t[2]),
          RIM[q] + " chorakda: sin " + (sS > 0 ? "> 0" : "< 0") + ", cos " + (sC > 0 ? "> 0" : "< 0"), target + " α = " + ans]);
    }
    if (k === 5) { // (a sin + b cos)/(c sin + d cos), tg berilgan
      var p = RNZ(-5, 5), qq = pick([1, 1, 2, 3, 4]); if (gcd(p, qq) !== 1) qq = 1;
      var a = RNZ(-4, 4), b = RNZ(-5, 5), c2 = RNZ(-4, 4), d = RNZ(-5, 5), den = c2 * p + d * qq;
      if (den === 0 || a * p + b * qq === 0) return null;
      ans = F(a * p + b * qq, den);
      return Q("tg α = " + F(p, qq) + " bo'lsa, (" + lin2(a, "sin α", b, "cos α") + ")/(" + lin2(c2, "sin α", d, "cos α") + ") ni hisoblang.", ans,
        W(ans, [F(a * qq + b * p, c2 * qq + d * p), F(den, a * p + b * qq), neg(ans), F(a * p - b * qq, c2 * p - d * qq), F(a + b, c2 + d)]),
        ["Surat va maxrajni cos α ga bo'lamiz", "(" + lin2(a, "tg α", b, "") + ")/(" + lin2(c2, "tg α", d, "") + ")", "= " + ans]);
    }
    if (k === 6) { // sin α + cos α = p → sin α cos α
      var pr = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [1, 5], [4, 5], [6, 5], [7, 5], [5, 4], [4, 3], [7, 6], [2, 5], [3, 5]]), sgn = pick([1, -1]), mn = pick([1, -1]);
      var pm = sgn * pr[0], pn = pr[1], plus = mn > 0;
      ans = plus ? F(pm * pm - pn * pn, 2 * pn * pn) : F(pn * pn - pm * pm, 2 * pn * pn);
      return Q("sin α " + (plus ? "+" : "−") + " cos α = " + F(pm, pn) + " bo'lsa, sin α · cos α ni toping.", ans,
        W(ans, [neg(ans), F(pm * pm - pn * pn, pn * pn), plus ? F(pn * pn - pm * pm, 2 * pn * pn) : F(pm * pm - pn * pn, 2 * pn * pn), F(pm * pm, 2 * pn * pn), F(pm * pm + pn * pn, 2 * pn * pn)]),
        ["Kvadratga oshiramiz: 1 " + (plus ? "+" : "−") + " 2sin α cos α = " + F(pm * pm, pn * pn), "sin α cos α = " + ans]);
    }
    // tg α berilgan → sin α·cos α = t/(1 + t²)
    var p7 = RNZ(-6, 6), q7 = pick([1, 1, 2, 3, 5]); if (gcd(p7, q7) !== 1) q7 = 1;
    ans = F(p7 * q7, p7 * p7 + q7 * q7);
    return Q("tg α = " + F(p7, q7) + " bo'lsa, sin α · cos α ni toping.", ans,
      W(ans, [neg(ans), F(p7 * q7, q7 * q7 - p7 * p7 || 1), F(p7, q7), F(q7 * q7, p7 * p7 + q7 * q7), F(2 * p7 * q7, p7 * p7 + q7 * q7)]),
      ["sin α cos α = (sin α cos α)/(sin²α + cos²α) = tg α/(1 + tg²α)", "= " + F(p7, q7) + " : (1 + " + F(p7 * p7, q7 * q7) + ") = " + ans]);
  }

  aug("t68", t68x, sh(.82, .82, .88));
  aug("t3", t3x, sh(.72, .72, .78));

  /* @@REST@@ */
})();
