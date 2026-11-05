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
    var out = [], seen = {}; seen[S2(a)] = 1;
    for (var i = 0; i < list.length && out.length < (n || 4); i++) {
      var s = S2(list[i]);
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
    var l = [neg(a)].concat(alts || []).concat(SV.indexOf(a) > -1 ? shuffle(SV).concat(shuffle(TV)) : shuffle(TV).concat(shuffle(SV)));
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

  /* ---------- t29: trigonometrik funksiyalar ---------- */
  var SUPN = { 2: "²", 3: "³" };
  function t29x(L) {
    var k = pick(L === 1 ? [0, 1, 2, 2, 5] : L === 2 ? [2, 3, 3, 4, 4, 5] : [2, 3, 5, 6, 6, 7, 7]);
    if (k === 0) { // gradus → radian
      var d = pick([15, 18, 20, 36, 40, 72, 10, 12]) * R(1, 18); if (d % 360 === 0 || d > 720) d = pick([150, 210, 240, 300, 330, 135, 225, 315]);
      var a = rad(d);
      return Q(d + "° ni radianda ifodalang.", a, W(a, [radF(d, 360), rad(d + 30), rad(d + 15 * RNZ(-2, 2)), rad(180 - d || 90), radF(d, 90)]),
        ["1° = π/180 radian", d + "° = " + d + "π/180 = " + a]);
    }
    if (k === 1) { // radian → gradus
      var m = pick([2, 3, 4, 5, 6, 9, 10, 12, 18]), n = R(1, 2 * m); while (gcd(n, m) !== 1) n++;
      var dd = 180 * n / m;
      return Q(radF(n, m) + " radian necha gradus?", deg(dd), W(deg(dd), [deg(360 * n / m), deg(dd + 30), deg(90 * n / m), deg(Math.abs(180 - dd) || 360), deg(dd - 15)].filter(function (x) { return /^\d+°$/.test(x); })),
        ["π radian = 180°", radF(n, m) + " = " + n + "·180°/" + m + " = " + dd + "°"]);
    }
    if (k === 2) { // chorak
      var dq, txt;
      if (L === 1) { do { dq = R(1, 359); } while (dq % 90 === 0); txt = dq + "°"; }
      else if (L === 2) { do { dq = R(-720, 1440); } while (dq % 90 === 0 || (dq > 0 && dq < 360)); txt = deg(dq); }
      else { var mm = pick([3, 4, 5, 6, 7, 8, 9, 10, 12]), nn; do { nn = RNZ(-4 * mm, 4 * mm); } while ((2 * nn) % mm === 0 || gcd(nn, mm) !== 1); dq = 180 * nn / mm; txt = radF(nn, mm); }
      var qq = quad(dq), ans = RIM[qq] + " chorak", red = ((dq % 360) + 360) % 360;
      return Q(txt + " burchak qaysi chorakda yotadi?", ans, W(ans, shuffle(["I chorak", "II chorak", "III chorak", "IV chorak"])),
        [L === 1 ? "I: 0°–90°, II: 90°–180°, III: 180°–270°, IV: 270°–360°" : "360° ga karrali qismini tashlaymiz: " + txt + " → " + String(Math.round(red * 100) / 100).replace(".", ",") + "°", "Javob: " + ans]);
    }
    if (k === 3) { // davr
      var fn = pick(["sin", "cos", "tg", "ctg", "sin", "cos"]), tp = fn === "sin" || fn === "cos" ? 2 : 1, A = pick([1, 2, 3, 5, -2]), kk, argS, Tp, Tq;
      if (Math.random() < .75) { kk = R(2, 9); var b = R(-5, 5); argS = kk + "x" + (b > 0 ? " + " + b : b < 0 ? " − " + (-b) : ""); Tp = tp; Tq = kk; }
      else { kk = R(2, 5); argS = "x/" + kk; Tp = tp * kk; Tq = 1; }
      var T = radF(Tp, Tq), co = A === 1 ? "" : A === -1 ? "−" : ms(A);
      return Q("y = " + co + fn + "(" + argS + ") funksiyaning eng kichik musbat davrini toping.", T,
        W(T, [radF(3 - tp, Tq) === T ? radF(4, Tq) : radF(tp === 2 ? 1 : 2, Tq * (tp === 2 ? 1 : 1)) , radF(tp * (Tq === 1 ? 1 : Tq), Tq === 1 ? kk * kk : 1), radF(tp, 1), radF(2 * Tp, Tq), radF(Tp, 2 * Tq)]),
        [fn + " ning asosiy davri " + (tp === 2 ? "2π" : "π"), "T = " + (tp === 2 ? "2π" : "π") + " : |k|, bu yerda k = " + (Tq === 1 ? "1/" + kk : kk), "T = " + T]);
    }
    if (k === 4) { // qiymatlar sohasi
      var f4 = pick(["sin", "cos"]), A4 = RNZ(-6, 6), B4 = R(-7, 7), lo = B4 - Math.abs(A4), hi = B4 + Math.abs(A4);
      var co4 = A4 === 1 ? "" : A4 === -1 ? "−" : ms(A4), e = "y = " + co4 + f4 + " x" + (B4 > 0 ? " + " + B4 : B4 < 0 ? " − " + (-B4) : "");
      function iv(x, y) { return "[" + ms(x) + "; " + ms(y) + "]"; }
      var a4 = iv(lo, hi);
      return Q(e + " funksiyaning qiymatlar sohasini toping.", a4, W(a4, [iv(B4 - 1, B4 + 1), iv(-Math.abs(A4), Math.abs(A4)), iv(Math.min(-B4 - Math.abs(A4), -B4 + Math.abs(A4)), -B4 + Math.abs(A4)), iv(Math.min(B4, hi), Math.max(B4, hi)), iv(lo - 1, hi + 1), iv(-1, 1)]),
        ["−1 ≤ " + f4 + " x ≤ 1", "y ∈ [" + ms(B4) + " − " + Math.abs(A4) + "; " + ms(B4) + " + " + Math.abs(A4) + "]", "E(y) = " + a4]);
    }
    if (k === 5) { // f(x0) qiymati
      var f5 = pick(["sin", "cos"]), A5 = RNZ(-5, 5), B5 = R(-6, 6), d5, rv, kk5 = L === 3 ? pick([1, 2, 3]) : 1, tries = 0;
      do { d5 = pick(ANG); rv = vRat(fV(f5, kk5 * d5)); } while ((!rv || (L > 1 && d5 === 0)) && tries++ < 40);
      if (!rv) return null;
      var num = A5 * rv[0] + B5 * rv[1], ans5 = F(num, rv[1]);
      var co5 = A5 === 1 ? "" : A5 === -1 ? "−" : ms(A5), arg5 = kk5 === 1 ? "x" : kk5 + "x";
      return Q("f(x) = " + co5 + f5 + " " + arg5 + (B5 > 0 ? " + " + B5 : B5 < 0 ? " − " + (-B5) : "") + " bo'lsa, f(" + rad(d5) + ") ni toping.", ans5,
        W(ans5, [F(-A5 * rv[0] + B5 * rv[1], rv[1]), F(A5 * rv[0], rv[1]), F(num + rv[1], rv[1]), F(A5 * (vRat(fV(CO[f5], kk5 * d5)) || [0, 1])[0] * rv[1] / ((vRat(fV(CO[f5], kk5 * d5)) || [0, 1])[1]) + B5 * rv[1], rv[1]), F(num - rv[1], rv[1])]),
        [f5 + " " + (kk5 === 1 ? rad(d5) : rad(kk5 * d5)) + " = " + fV(f5, kk5 * d5), "f = " + ms(A5) + "·" + par(+0) .replace("0", fV(f5, kk5 * d5)) + (B5 >= 0 ? " + " + B5 : " − " + (-B5)) + " = " + ans5]);
    }
    if (k === 6) { // a sin x + b cos x eng katta / kichik qiymati
      var tr = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15]]), sw = Math.random() < .5;
      var a6 = (sw ? tr[1] : tr[0]) * pick([1, -1]), b6 = (sw ? tr[0] : tr[1]) * pick([1, -1]), c6 = R(-6, 6), mx = Math.random() < .5;
      var res6 = mx ? tr[2] + c6 : c6 - tr[2];
      var e6 = "y = " + lin2(a6, "sin x", b6, "cos x") + (c6 > 0 ? " + " + c6 : c6 < 0 ? " − " + (-c6) : "");
      return Q(e6 + " funksiyaning eng " + (mx ? "katta" : "kichik") + " qiymatini toping.", res6,
        W(res6, [mx ? Math.abs(a6) + Math.abs(b6) + c6 : c6 - Math.abs(a6) - Math.abs(b6), mx ? c6 - tr[2] : c6 + tr[2], mx ? tr[2] : -tr[2], mx ? 1 + c6 : c6 - 1, mx ? tr[2] + c6 + 1 : c6 - tr[2] - 1]),
        ["a sin x + b cos x ning qiymatlari [−√(a² + b²); √(a² + b²)] oralig'ida", "√(" + a6 * a6 + " + " + b6 * b6 + ") = " + tr[2], "Javob: " + ms(res6)]);
    }
    // juft-toqlik
    function term() {
      var n = R(0, 3), f = pick(["sin x", "cos x", "tg x", "", "sin x", "cos x"]), c = pick([1, 1, 2, 3, 4, 5]);
      if (!n && !f) f = "cos x";
      var str = (c === 1 ? "" : c) + (n ? "x" + (SUPN[n] || "") : "") + (f ? ((n || c !== 1) ? "·" : "") + f : "");
      return [str, (n % 2 + (f === "sin x" || f === "tg x" ? 1 : 0)) % 2];
    }
    var t1 = term(), two = Math.random() < .55, t2 = two ? term() : null, par7;
    if (two && t2[0] === t1[0]) t2 = ["x" + (t1[1] ? "²" : "³"), t1[1] ? 0 : 1];
    if (!two) par7 = t1[1]; else par7 = t1[1] === t2[1] ? t1[1] : 2;
    var labs = ["juft", "toq", "juft ham, toq ham emas"], ans7 = labs[par7];
    return Q("y = " + t1[0] + (two ? (Math.random() < .5 ? " + " : " − ") + t2[0] : "") + " funksiya juftmi yoki toqmi?", ans7, W(ans7, labs.concat(["ham juft, ham toq"])),
      ["f(−x) ni tekshiramiz: x, sin x, tg x — toq; cos x, x², o'zgarmas — juft", two && par7 === 2 ? "Juft va toq qo'shiluvchilar yig'indisi — umumiy ko'rinishdagi funksiya" : "Ko'paytmada toq ko'paytuvchilar soni juft bo'lsa — juft, toq bo'lsa — toq", "Javob: " + ans7]);
  }

  /* ---------- t30: teskari trigonometrik funksiyalar ---------- */
  var ARC = { sin: "arcsin", cos: "arccos", tg: "arctg", ctg: "arcctg" };
  function arcW(fn, d, r) {
    var c = [-d, 90 - d, 180 - d, d - 90, d + 90, 2 * d, d - 180, 90 + d].filter(function (x) { return Math.abs(x) <= 180; });
    return W(ang(d, r), c.map(function (x) { return ang(x, r); }));
  }
  function t30x(L) {
    var k = pick(L === 1 ? [0, 0, 5, 5] : L === 2 ? [0, 1, 1, 4, 5] : [1, 2, 2, 3, 3, 4]);
    if (k === 0) { // arc qiymatlari
      var fn = pick(FN), pool = fn === "sin" || fn === "cos" ? SV : TV.concat(fn === "ctg" ? [] : []), v, r = Math.random() < .6;
      if (L === 1) pool = pool.filter(function (x) { return x.charAt(0) !== "−"; });
      else pool = pool.filter(function (x) { return x.charAt(0) === "−" || Math.random() < .3; });
      v = pick(pool); var d = arcD(fn, v); if (d === null) return null;
      var a = ang(d, r);
      return Q(ARC[fn] + "(" + v + ") ni " + (r ? "radianda" : "gradusda") + " toping.", a, arcW(fn, d, r),
        [ARC[fn] + " qiymatlari sohasi: " + (fn === "sin" ? "[−π/2; π/2]" : fn === "cos" ? "[0; π]" : fn === "tg" ? "(−π/2; π/2)" : "(0; π)"), tf(fn, d, r) + " = " + v, ARC[fn] + "(" + v + ") = " + a]);
    }
    if (k === 1) { // f(arcg(v))
      var t = tri(), inner = pick(["sin", "cos", "tg"]), sg = L === 2 && Math.random() < .5 ? 1 : pick([1, -1]), sn, cs, vin;
      if (inner === "sin") { vin = F(sg * t[0], t[2]); sn = [sg * t[0], t[2]]; cs = [t[1], t[2]]; }
      else if (inner === "cos") { vin = F(sg * t[1], t[2]); sn = [t[0], t[2]]; cs = [sg * t[1], t[2]]; }
      else { vin = F(sg * t[0], t[1]); sn = [sg * t[0], t[2]]; cs = [t[1], t[2]]; }
      var outer = pick(FN.filter(function (f) { return f !== inner; }));
      var val = outer === "sin" ? F(sn[0], sn[1]) : outer === "cos" ? F(cs[0], cs[1]) : outer === "tg" ? F(sn[0] * cs[1], cs[0] * sn[1]) : F(cs[0] * sn[1], sn[0] * cs[1]);
      return Q(outer + "(" + ARC[inner] + "(" + vin + ")) ni hisoblang.", val, W(val, [neg(val), F(sn[0], cs[0]), F(cs[0], sn[0]), F(t[2], t[1]), F(t[1], t[0]), F(-sn[0], cs[0])]),
        ["α = " + ARC[inner] + "(" + vin + "): " + inner + " α = " + vin + (inner === "cos" ? ", α ∈ [0; π] → sin α ≥ 0" : ", α ∈ (−π/2; π/2) → cos α > 0"), "sin α = " + F(sn[0], sn[1]) + ", cos α = " + F(cs[0], cs[1]), outer + " α = " + val]);
    }
    if (k === 2) { // arcf(f(θ))
      var f2 = pick(FN), th; do { th = pick(ANG) + pick([0, 0, 360, -360]); } while (fV(f2, th) === UND);
      var v2 = fV(f2, th), d2 = arcD(f2, v2); if (d2 === null || d2 === th) { th = th + 360; }
      var a2 = rad(d2);
      return Q(ARC[f2] + "(" + f2 + "(" + rad(th) + ")) ni hisoblang.", a2, W(a2, [rad(th), rad(-d2), rad(180 - d2), rad(nd(th)), rad(d2 + 180)]),
        [f2 + "(" + rad(th) + ") = " + v2, ARC[f2] + "(" + v2 + ") = " + a2 + " (qiymatlar sohasidagi burchak)"]);
    }
    if (k === 3) { // yig'indi
      var g1 = pick(FN), g2 = pick(FN), v1 = pick(g1 === "sin" || g1 === "cos" ? SV : TV), vv2 = pick(g2 === "sin" || g2 === "cos" ? SV : TV);
      var e1 = arcD(g1, v1), e2 = arcD(g2, vv2); if (e1 === null || e2 === null) return null;
      var c1 = pick([1, 1, 2, 3]), op = pick([1, -1]), sum = c1 * e1 + op * e2, a3 = rad(sum);
      var e3 = (c1 === 1 ? "" : c1) + ARC[g1] + "(" + v1 + ") " + (op > 0 ? "+" : "−") + " " + ARC[g2] + "(" + vv2 + ")";
      return Q("Hisoblang: " + e3, a3, W(a3, [rad(c1 * e1 - op * e2), rad(-sum), rad(c1 * e1 + op * (90 - e2)), rad(c1 * (90 - e1) + op * e2), rad(sum + 30), rad(sum - 45)]),
        [ARC[g1] + "(" + v1 + ") = " + rad(e1) + ", " + ARC[g2] + "(" + vv2 + ") = " + rad(e2), (c1 === 1 ? "" : c1 + "·") + (c1 > 1 && e1 < 0 ? "(" + rad(e1) + ")" : rad(e1)) + (op * e2 < 0 ? " − " : " + ") + rad(Math.abs(e2)) + " = " + a3]);
    }
    if (k === 4) { // aniqlanish sohasi
      var f4 = pick(["sin", "cos"]), kk = R(1, 4), b = R(-5, 5); if (kk === 1 && b === 0) b = R(1, 4);
      var ans4 = "[" + F(b - 1, kk) + "; " + F(b + 1, kk) + "]";
      return Q("y = " + ARC[f4] + "(" + poly([kk, -b]) + ") funksiyaning aniqlanish sohasini toping.", ans4,
        W(ans4, ["[" + F(-b - 1, kk) + "; " + F(-b + 1, kk) + "]", "[" + ms(b - 1) + "; " + ms(b + 1) + "]", "(" + F(b - 1, kk) + "; " + F(b + 1, kk) + ")", "[−1; 1]", "[" + F(b, kk) + "; " + F(b + 2, kk) + "]"]),
        ["−1 ≤ " + poly([kk, -b]) + " ≤ 1", ms(b - 1) + " ≤ " + (kk === 1 ? "x" : kk + "x") + " ≤ " + ms(b + 1), "D(y) = " + ans4]);
    }
    // arcf x = θ → x
    var f5 = pick(FN), cand = f5 === "sin" ? [-90, -60, -45, -30, 0, 30, 45, 60, 90] : f5 === "cos" ? [0, 30, 45, 60, 90, 120, 135, 150, 180] : f5 === "tg" ? [-60, -45, -30, 0, 30, 45, 60] : [30, 45, 60, 90, 120, 135, 150];
    if (L === 1) cand = cand.filter(function (x) { return x >= 0 && x <= 90; });
    var d5 = pick(cand), r5 = Math.random() < .6, x5 = fV(f5, d5);
    return Q(ARC[f5] + " x = " + ang(d5, r5) + " bo'lsa, x ni toping.", x5, wVal(x5, [fV(CO[f5], d5)]),
      [ARC[f5] + " x = " + ang(d5, r5) + " → x = " + tf(f5, d5, r5), "x = " + x5]);
  }

  /* ---------- t31: trigonometrik ifodalar qiymati ---------- */
  function t31x(L) {
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2, 3] : [0, 1, 2, 3, 3]);
    if (k === 0) { // ratsional qiymatli ifoda
      var nt = L === 1 ? 2 : pick([2, 3]), r = L === 3 && Math.random() < .6, angs = L === 1 ? [0, 30, 45, 60, 90] : ANG;
      var ex = "", N = 0, alt = [], Ns = [], used = {};
      for (var i = 0; i < nt; i++) {
        var fn, d, v, rv, sq, tries = 0;
        do { fn = pick(FN); d = pick(angs); v = fV(fn, d); } while ((v === UND || v === "0" || used[fn + d]) && tries++ < 50);
        used[fn + d] = 1;
        rv = vRat(v); sq = !rv; if (sq) rv = vSq(v);
        var c = pick(L === 1 ? [1, 2, 4] : [1, 2, 3, 4, 6]), sg = i === 0 ? 1 : pick([1, -1]);
        var term = (c === 1 ? "" : c) + fn + (sq ? "²" : "") + (r ? "(" + rad(d) + ")" : (sq ? "" : " ") + deg(d));
        ex += i === 0 ? term : (sg > 0 ? " + " : " − ") + term;
        var contrib = sg * c * rv[0] * (12 / rv[1]); N += contrib; Ns.push(contrib);
      }
      var a = F(N, 12);
      return Q("Hisoblang: " + ex, a, W(a, [F(N - 2 * Ns[Ns.length - 1], 12), F(N + 6, 12), F(N - 6, 12), F(-N, 12), F(N + 12, 12), F(N - 12, 12)]),
        ["Jadval qiymatlarini qo'yamiz", "Natija: " + a]);
    }
    if (k === 1) { // qiymat
      var f1 = pick(FN), d1 = L === 1 ? pick([120, 135, 150, 180]) : L === 2 ? (Math.random() < .5 ? pick(ANG.slice(8)) : -pick(ANG.slice(1, 9))) : pick(ANG) + 360 * R(1, 3), r1 = L === 3 && Math.random() < .5;
      var v1 = fV(f1, d1); if (v1 === UND) { f1 = CO[f1]; v1 = fV(f1, d1); }
      return Q(tf(f1, d1, r1) + " ni hisoblang.", v1, wVal(v1, [fV(CO[f1], d1), mirV(f1, d1)]), valSteps(f1, d1, r1));
    }
    if (k === 2) { // ishora
      var nf = L === 2 ? 2 : 3, txt = "", s = 1, parts = [];
      for (var j = 0; j < nf; j++) {
        var g = pick(FN), dd; do { dd = R(1, 359); } while (dd % 90 === 0);
        var qd = quad(dd), sgn = g === "sin" ? (qd <= 2 ? 1 : -1) : g === "cos" ? (qd === 1 || qd === 4 ? 1 : -1) : (qd === 1 || qd === 3 ? 1 : -1);
        s *= sgn; parts.push(g + " " + dd + "°"); 
      }
      txt = parts.join("·");
      var a2 = s > 0 ? "musbat" : "manfiy";
      return Q("Ifodaning ishorasini aniqlang: " + txt, a2, W(a2, ["musbat", "manfiy", "nolga teng", "aniqlab bo'lmaydi"]),
        ["Har bir ko'paytuvchining chorakdagi ishorasini aniqlaymiz", "Manfiy ko'paytuvchilar soni " + (s > 0 ? "juft" : "toq") + " → " + a2]);
    }
    // to'ldiruvchi burchaklar
    var A = R(1, 89), c3 = R(1, 6), m3 = R(-6, 9), kind = R(0, 4), ex3, base3;
    var B = 90 - A;
    if (kind === 0) { ex3 = "sin²" + A + "° + sin²" + B + "°"; base3 = 1; }
    else if (kind === 1) { ex3 = "cos²" + A + "° + cos²" + B + "°"; base3 = 1; }
    else if (kind === 2) { ex3 = "tg " + A + "°·tg " + B + "°"; base3 = 1; }
    else if (kind === 3) { ex3 = "sin " + A + "° / cos " + B + "°"; base3 = 1; }
    else { ex3 = "sin " + A + "° − cos " + B + "°"; base3 = 0; }
    var full = (c3 === 1 ? "" : c3 + "(") + ex3 + (c3 === 1 ? "" : ")") + (m3 > 0 ? " + " + m3 : m3 < 0 ? " − " + (-m3) : "");
    var a3 = c3 * base3 + m3;
    return Q("Hisoblang: " + full, a3, W(a3, [c3 * (1 - base3) + m3, c3 * 2 + m3, m3 - c3, a3 + 1, a3 - 1, c3 + m3 + 1]),
      [A + "° + " + B + "° = 90° → " + (kind < 2 ? "sin " + B + "° = cos " + A + "°" : kind === 2 ? "tg " + B + "° = ctg " + A + "°" : "cos " + B + "° = sin " + A + "°"), ex3 + " = " + base3, "Javob: " + ms(a3)]);
  }

  aug("t68", t68x, sh(.82, .82, .88));
  aug("t3", t3x, sh(.72, .72, .78));

  aug("t29", t29x, sh(.82, .72, .62));
  aug("t30", t30x, sh(.86, .86, .86));
  aug("t31", t31x, sh(.82, .82, .82));

  /* ---------- t33, t69, t34, t35: trigonometrik tenglamalar ---------- */
  // umumiy yechim shakli: {m: "p" | "pm" | "m0" | "m1", d: burchak (gradus, kx uchun), P: davr (180° karrasi), k}
  //   p: x = d/k + 180P·n/k;  pm: ±d/k + …;  m0: (−1)ⁿ·d/k + …;  m1: (−1)ⁿ⁺¹·d/k + …
  function gForm(fn, v, k) {
    var d;
    if (fn === "sin") {
      if (v === "0") return { m: "p", d: 0, P: 1, k: k };
      if (v === "1" || v === "−1") return { m: "p", d: v === "1" ? 90 : -90, P: 2, k: k };
      d = arcD("sin", v); return { m: d < 0 ? "m1" : "m0", d: Math.abs(d), P: 1, k: k };
    }
    if (fn === "cos") {
      if (v === "0") return { m: "p", d: 90, P: 1, k: k };
      if (v === "1" || v === "−1") return { m: "p", d: v === "1" ? 0 : 180, P: 2, k: k };
      return { m: "pm", d: arcD("cos", v), P: 2, k: k };
    }
    return { m: "p", d: arcD(fn, v), P: 1, k: k };
  }
  function gStr(f, r) {
    var k = f.k || 1;
    var A = r ? radF(f.d, 180 * k) : deg(f.d / k), Pn = r ? piN(f.P, k) : (180 * f.P / k) + "°n";
    if (f.d === 0 && f.m === "p") return "x = " + Pn;
    if (f.d === 0) return null;
    return "x = " + (f.m === "pm" ? "±" : f.m === "m0" ? "(−1)ⁿ·" : f.m === "m1" ? "(−1)ⁿ⁺¹·" : "") + A + " + " + Pn;
  }
  function gKey(f) { // yechimlar to'plami kaliti (taqqoslash uchun)
    var k = f.k || 1, out = [];
    for (var n = -12; n <= 12; n++) {
      var xs = f.m === "p" ? [f.d] : f.m === "pm" ? [f.d, -f.d] : f.m === "m0" ? [n % 2 ? -f.d : f.d] : [n % 2 ? f.d : -f.d];
      for (var i = 0; i < xs.length; i++) { var x = Math.round((xs[i] + 180 * f.P * n) / k * 1000) / 1000; if (x >= -360 && x < 360 && out.indexOf(x) < 0) out.push(x); }
    }
    return out.sort(function (a, b) { return a - b; }).join(",");
  }
  function gsol(fn, v, k, r) { return gStr(gForm(fn, v, k || 1), r); }
  // noto'g'ri umumiy yechimlar (tipik xatolar); to'plami to'g'ri javobga teng bo'lganlari tashlanadi
  function gsolW(fn, v, k, r) {
    k = k || 1;
    var f = gForm(fn, v, k), key = gKey(f), d = f.d, c = [];
    function add(m, dd, P) { c.push({ m: m, d: dd, P: P, k: k }); }
    if (fn === "sin" || fn === "cos") {
      add("p", d, 1); add("p", d, 2); add("pm", d, 1); add("pm", d, 2); add("m0", d, 1); add("m1", d, 1); add("m0", d, 2);
      add("pm", 180 - d, 2); add("m0", Math.abs(90 - d), 1); add("pm", Math.abs(90 - d), 2); add("p", -d, 2); add("p", 90, 1); add("p", 0, 1); add("p", 0, 2); add("p", 90, 2);
    } else {
      add("p", d, 2); add("p", -d, 1); add("pm", Math.abs(d) || 90, 1); add("p", 90 - d, 1); add("m0", d, 1); add("p", d + 90, 1); add("pm", Math.abs(d) || 90, 2);
    }
    var out = [], seen = {}; seen[key] = 1;
    shuffle(c.slice(0, 4)).concat(shuffle(c.slice(4))).forEach(function (g) {
      var s2 = gStr(g, r), kk = gKey(g); if (!s2 || seen[kk]) return; seen[kk] = 1; out.push(s2);
    });
    return out;
  }
  var LIN = { "1/2": [["2", "1"]], "√2/2": [["2", "√2"], ["√2", "1"]], "√3/2": [["2", "√3"]], "1": [["", "1"], ["3", "3"], ["2", "2"]], "√3": [["", "√3"], ["√3", "3"]], "√3/3": [["√3", "1"], ["3", "√3"]], "0": [["2", "0"], ["5", "0"]] };
  function argX(k) { return k === 1 ? "x" : k + "x"; }
  function linEq(fn, v, k) {
    var ab = v.charAt(0) === "−" ? v.slice(1) : v, o = pick(LIN[ab]), A = o[0], Bv = o[1];
    var As = A === "" ? "" : /√/.test(A) ? A + "·" : A;
    if (Bv === "0") return As + fn + " " + argX(k) + " = 0";
    return As + fn + " " + argX(k) + (v.charAt(0) === "−" ? " + " : " − ") + Bv + " = 0";
  }
  function eqStr(fn, v, k, lin) { return lin ? linEq(fn, v, k) : fn + " " + argX(k) + " = " + v; }
  // [lo; hi] (gradus) oraliqdagi ildizlar: fn(kx) = v
  function roots(fn, v, k, lo, hi) {
    var out = [];
    for (var d = Math.ceil(k * lo / 15) * 15; d <= k * hi; d += 15) if (isTab(d) && fV(fn, d) === v) out.push(d / k);
    return out;
  }
  function vPool(fn) { return fn === "sin" || fn === "cos" ? SV : TV; }
  function eqSteps(fn, v, k, r, lin) {
    var st = [];
    if (lin) st.push(fn + " " + argX(k) + " = " + v);
    st.push(fn === "sin" ? "sin t = a → t = (−1)ⁿ·arcsin a + πn" : fn === "cos" ? "cos t = a → t = ±arccos a + 2πn" : fn === "tg" ? "tg t = a → t = arctg a + πn" : "ctg t = a → t = arcctg a + πn");
    if (k > 1) st.push(k + "x = …, ikkala tomonni " + k + " ga bo'lamiz");
    st.push("Javob: " + gsol(fn, v, k, r));
    return st;
  }
  // fns: ishlatiladigan funksiyalar; L: daraja
  function eqx(fns, L) {
    var k = pick(L === 1 ? [0, 0, 1, 1, 7] : L === 2 ? [1, 2, 2, 3, 3, 4] : [2, 3, 4, 5, 5, 6, 6]);
    var fn = pick(fns), pool = vPool(fn), v = pick(pool), lin = Math.random() < (L === 1 ? .5 : .4), r = Math.random() < .55;
    if (k === 0) { // [0°; 90°] oraliqda
      var vp = pick(pool.filter(function (x) { return x.charAt(0) !== "−"; })), rt = roots(fn, vp, 1, 0, fn === "tg" || fn === "ctg" ? 89 : 90).filter(function (x) { return x > 0 || fn !== "ctg"; });
      if (fn === "ctg") rt = roots(fn, vp, 1, 1, 90);
      if (!rt.length) return null;
      var a0 = deg(rt[0]);
      return Q(eqStr(fn, vp, 1, true) + " tenglamaning (0°; 90°] oraliqdagi yechimini toping.".replace("(0°; 90°]", fn === "tg" ? "[0°; 90°)" : fn === "ctg" ? "(0°; 90°]" : "[0°; 90°]"), a0,
        W(a0, shuffle(["0°", "30°", "45°", "60°", "90°"]).concat(["120°", "150°"])), [fn + " x = " + vp, tf(fn, rt[0]) + " = " + vp, "x = " + a0]);
    }
    if (k === 1 || k === 2) { // umumiy yechim
      var rr = k === 2 || (k === 1 && L === 2 && r);
      var a1 = gsol(fn, v, 1, rr);
      return Q(eqStr(fn, v, 1, lin) + " tenglamaning umumiy yechimini toping.", a1, W(a1, gsolW(fn, v, 1, rr)), eqSteps(fn, v, 1, rr, lin));
    }
    if (k === 3) { // [0°; 360°) dagi ildizlar
      var hi = fn === "tg" || fn === "ctg" ? 359 : 359, rs = roots(fn, v, 1, 0, hi); if (!rs.length) return null;
      function lst(a) { return a.map(function (x) { return ang(x, r); }).join("; "); }
      var a3 = lst(rs), alt = [];
      alt.push(lst(roots(fn, neg(v), 1, 0, hi))); alt.push(lst(roots(CO[fn], v, 1, 0, hi))); alt.push(lst(rs.slice(0, 1))); alt.push(lst(rs.map(function (x) { return nd(-x); }).sort(function (p, q) { return p - q; })));
      alt.push(lst(rs.map(function (x) { return nd(180 - x); }).sort(function (p, q) { return p - q; }))); alt.push(lst(rs.map(function (x) { return nd(x + 90); }).sort(function (p, q) { return p - q; })));
      return Q(eqStr(fn, v, 1, lin) + " tenglamaning " + (r ? "[0; 2π)" : "[0°; 360°)") + " oraliqdagi barcha ildizlarini toping.", a3, W(a3, alt.filter(function (x) { return x; })),
        [fn + " x = " + v, "Birlik aylanada " + rs.length + " ta nuqta", "Javob: " + a3]);
    }
    if (k === 4) { // eng kichik musbat ildiz
      var rp = roots(fn, v, 1, 1, 360); if (!rp.length) return null;
      var a4 = ang(rp[0], r), d0 = arcD(fn, v);
      return Q(eqStr(fn, v, 1, lin) + " tenglamaning eng kichik musbat ildizini toping.", a4,
        W(a4, [ang(d0, r), ang(rp[1] || rp[0] + 180, r), ang(nd(-rp[0]) || 360, r), ang(rp[0] + 360, r), ang(180 - rp[0], r), ang(90 - rp[0] > 0 ? 90 - rp[0] : rp[0] + 90, r)]),
        [fn + " x = " + v, "Ildizlar: " + roots(fn, v, 1, -360, 720).filter(function (x) { return x > -200 && x < 400; }).map(function (x) { return ang(x, r); }).join("; ") + " …", "Eng kichik musbati: " + a4]);
    }
    if (k === 5) { // fn(kx) = v, radianda
      var kk = R(2, 4), a5 = gsol(fn, v, kk, true);
      return Q(eqStr(fn, v, kk, lin) + " tenglamaning umumiy yechimini toping.", a5,
        W(a5, [gsol(fn, v, 1, true)].concat(gsolW(fn, v, kk, true))), eqSteps(fn, v, kk, true, lin));
    }
    if (k === 6) { // ildizlar soni
      var IV = pick([[0, 360, "[0; 2π]"], [0, 540, "[0; 3π]"], [-180, 180, "[−π; π]"], [0, 720, "[0; 4π]"], [-360, 360, "[−2π; 2π]"], [-90, 270, "[−π/2; 3π/2]"], [0, 180, "[0; π]"]]);
      var kk6 = pick([1, 1, 2, 3]), c6 = roots(fn, v, kk6, IV[0], IV[1]).length;
      return Q(eqStr(fn, v, kk6, lin) + " tenglama " + IV[2] + " oraliqda nechta ildizga ega?", c6, W(c6, nearW(c6, 6, 3).filter(function (x) { return x >= 0; })),
        [fn + " " + argX(kk6) + " = " + v, "Ildizlar: " + roots(fn, v, kk6, IV[0], IV[1]).map(function (x) { return rad(x); }).join("; "), "Soni: " + c6]);
    }
    // yechimga ega emas
    var no = pick(["sin x = 1,2", "cos x = √3", "sin x = π/2", "cos x = −1,5", "sin x = √2", "cos x = 4/3", "sin x = −π/3", "cos x = 2", "sin x = −√5/2", "cos x = 1,01"]);
    var yes = shuffle(["sin x = 0,8", "cos x = −√2/2", "sin x = −1", "cos x = 1/3", "sin x = π/4", "cos x = √3/2", "tg x = 5", "ctg x = −7", "cos x = −0,9", "sin x = √3/3", "tg x = π", "sin x = 2/π"]);
    return Q("Qaysi tenglama yechimga ega emas?", no, yes.slice(0, 4), ["sin x va cos x qiymatlari [−1; 1] oralig'ida", "π/2 ≈ 1,57; √2 ≈ 1,41; √3 ≈ 1,73; π/3 ≈ 1,05", no.replace(" = ", " = ") + " — 1 dan katta (yoki −1 dan kichik)"]);
  }
  function t33x(L) { return eqx(["sin", "cos"], L); }
  function t34x(L) {
    if (Math.random() < .25 && L > 1) { // jadvalda yo'q qiymat
      var fn = pick(["tg", "ctg"]), p = RNZ(-9, 9), q = pick([1, 1, 1, 2, 3, 5]); if (gcd(p, q) !== 1 || (Math.abs(p) === 1 && q === 1)) { p = pick([2, 3, 4, 5, -2, -3]); q = 1; }
      var vs = F(Math.abs(p), q), sg = p < 0, arc = (fn === "tg" ? "arctg " : "arcctg ") + vs;
      var a = "x = " + (sg ? (fn === "tg" ? "−" + arc : "π − " + arc) : arc) + " + πn";
      return Q(fn + " x = " + F(p, q) + " tenglamaning umumiy yechimini toping.", a,
        W(a, ["x = " + (sg ? "−" : "") + arc + " + 2πn", "x = ±" + arc + " + πn", "x = (−1)ⁿ·" + (sg ? "(−" + arc + ")" : arc) + " + πn", "x = " + (sg ? "" : "−") + arc + " + πn", "x = " + (fn === "tg" ? "arcctg " : "arctg ") + vs + " + πn"]),
        [fn + " x = a → x = " + (fn === "tg" ? "arctg a" : "arcctg a") + " + πn", sg ? (fn === "tg" ? "arctg(−a) = −arctg a" : "arcctg(−a) = π − arcctg a") : "a = " + vs, "Javob: " + a]);
    }
    return eqx(["tg", "ctg"], L);
  }
  // usullar: kvadrat tenglamaga keltirish, bir jinsli, ko'paytuvchilarga ajratish
  function t35x(L) {
    if (L === 1) return Math.random() < .5 ? eqx(["sin", "cos"], 1) : eqx(["tg", "ctg"], 1);
    var k = pick(L === 2 ? [0, 1, 1, 2] : [0, 0, 1, 2, 3]);
    if (k === 0) { // kvadrat: a·t² + b·t + c = 0, t = sin x yoki cos x
      var fn = pick(["sin", "cos"]), RT = [[1, 2], [-1, 2], [1, 1], [-1, 1], [0, 1], [2, 1], [-2, 1], [3, 2], [-3, 2], [3, 1]];
      var r1 = pick(RT.slice(0, 5)), r2; do { r2 = pick(RT); } while (r2[0] * r1[1] === r1[0] * r2[1]);
      var A2 = r1[1] * r2[1], B2 = -(r1[1] * r2[0] + r2[1] * r1[0]), C2 = r1[0] * r2[0], g = gcd(gcd(A2, B2), C2) || 1; A2 /= g; B2 /= g; C2 /= g;
      if (A2 < 0) { A2 = -A2; B2 = -B2; C2 = -C2; }
      var t = fn + " x", e = (A2 === 1 ? "" : A2) + fn + "²x" + (B2 ? (B2 < 0 ? " − " : " + ") + (Math.abs(B2) === 1 ? "" : Math.abs(B2)) + t : "") + (C2 ? (C2 < 0 ? " − " : " + ") + Math.abs(C2) : "") + " = 0";
      var vals = [r1, r2].filter(function (z) { return Math.abs(z[0]) <= z[1]; }).map(function (z) { return F(z[0], z[1]); });
      var cnt = 0, lst = [];
      vals.forEach(function (vv) { var rr = roots(fn, vv === "0" ? "0" : vv, 1, 0, 359); cnt += rr.length; lst = lst.concat(rr); });
      lst.sort(function (p, q) { return p - q; });
      var ask = Math.random() < .55;
      if (ask) return Q(e + " tenglama [0°; 360°) oraliqda nechta ildizga ega?", cnt, W(cnt, nearW(cnt, 6, 3).filter(function (x) { return x >= 0; })),
        [t + " = t deb belgilaymiz: " + (A2 === 1 ? "" : A2) + "t²" + (B2 ? (B2 < 0 ? " − " : " + ") + (Math.abs(B2) === 1 ? "" : Math.abs(B2)) + "t" : "") + (C2 ? (C2 < 0 ? " − " : " + ") + Math.abs(C2) : "") + " = 0 → t = " + F(r1[0], r1[1]) + "; " + F(r2[0], r2[1]),
          "|t| ≤ 1 shart: " + (vals.length ? t + " = " + vals.join(" yoki ") : "mos ildiz yo'q"), "Ildizlar: " + (lst.length ? lst.map(deg).join("; ") : "yo'q") + " → " + cnt + " ta"]);
      var ta = F(r1[0], r1[1]) + "; " + F(r2[0], r2[1]);
      var good = vals.join("; ") || "yo'q";
      return Q(e + " tenglamada " + t + " qanday qiymat(lar) qabul qiladi?", good,
        W(good, [ta, F(-r1[0], r1[1]) + "; " + F(-r2[0], r2[1]), F(r1[1], r1[0] || 1) + "; " + F(r2[0], r2[1]), "yo'q", F(-r1[0], r1[1]), F(-r2[0], r2[1])]),
        [t + " = t: kvadrat tenglama ildizlari t = " + ta, "−1 ≤ " + t + " ≤ 1 bo'lgani uchun faqat " + (vals.length ? vals.join(" va ") : "hech biri") + " mos"]);
    }
    if (k === 1) { // bir jinsli: a sin x + b cos x = 0 → tg x = −b/a
      var pairs = [["", "√3", "√3", 1], ["√3", "", "√3/3", 1], ["", "", "1", 1], ["√3", "3", "√3", 1], ["3", "√3", "√3/3", 1]];
      var pr = pick(pairs), sgn = pick([1, -1]), vv2 = sgn > 0 ? pr[2] : neg(pr[2]), r = Math.random() < .7;
      // a sin x − sgn·b cos x = 0 → tg x = sgn·b/a
      var e2 = (pr[0] ? pr[0] + (/√/.test(pr[0]) ? "·" : "") : "") + "sin x " + (sgn > 0 ? "−" : "+") + " " + (pr[1] ? pr[1] + (/√/.test(pr[1]) ? "·" : "") : "") + "cos x = 0";
      var a2 = gsol("tg", vv2, 1, r);
      return Q(e2 + " tenglamani yeching.", a2, W(a2, gsolW("tg", vv2, 1, r).concat([gsol("tg", neg(vv2), 1, r), gsol("ctg", vv2, 1, r)])),
        ["cos x ≠ 0, ikkala tomonni cos x ga bo'lamiz", "tg x = " + vv2, "Javob: " + a2]);
    }
    if (k === 2) { // ko'paytma = 0
      var f1 = pick(["sin", "cos"]), f2 = pick(["sin", "cos", "tg"]), v1 = "0", v2 = pick(vPool(f2).filter(function (x) { return x !== "0" && x !== "1" && x !== "−1"; }));
      var e3 = f1 + " x·(" + linEq(f2, v2, 1).replace(" = 0", "") + ") = 0";
      var all = roots(f1, v1, 1, 0, 359).concat(roots(f2, v2, 1, 0, 359)), uq = [];
      all.sort(function (p, q) { return p - q; }).forEach(function (x) { if (uq.indexOf(x) < 0) uq.push(x); });
      if (f2 === "tg") uq = uq.filter(function (x) { return x % 180 !== 90; });
      var c3 = uq.length;
      return Q(e3 + " tenglama [0°; 360°) oraliqda nechta ildizga ega?", c3, W(c3, nearW(c3, 6, 3).filter(function (x) { return x >= 0; })),
        [f1 + " x = 0 yoki " + f2 + " x = " + v2, "Ildizlar: " + uq.map(deg).join("; "), "Soni: " + c3]);
    }
    // ikkilangan burchak: sin 2x = k·sin x ko'rinishi → sin x(2cos x − k) = 0
    var cv = pick(["1", "√2", "√3", "−1", "−√2", "−√3"]), cval = cv.charAt(0) === "−" ? neg(cv.replace("√2", "√2/2").replace("√3", "√3/2").replace(/^1$/, "1/2")) : cv;
    var cvv = { "1": "1/2", "√2": "√2/2", "√3": "√3/2", "−1": "−1/2", "−√2": "−√2/2", "−√3": "−√3/2" }[cv];
    var e4 = "sin 2x " + (cv.charAt(0) === "−" ? "+ " + cv.slice(1) : "− " + cv) + "·sin x = 0";
    var rr4 = roots("sin", "0", 1, 0, 359).concat(roots("cos", cvv, 1, 0, 359)).sort(function (p, q) { return p - q; });
    return Q(e4 + " tenglama [0°; 360°) oraliqda nechta ildizga ega?", rr4.length, W(rr4.length, nearW(rr4.length, 6, 3).filter(function (x) { return x >= 0; })),
      ["sin 2x = 2sin x cos x → sin x·(2cos x " + (cv.charAt(0) === "−" ? "+ " + cv.slice(1) : "− " + cv) + ") = 0", "sin x = 0 yoki cos x = " + cvv, "Ildizlar: " + rr4.map(deg).join("; ") + " → " + rr4.length + " ta"]);
  }

  /* ---------- t36: eng sodda trigonometrik tengsizliklar ---------- */
  var OPS = [">", "<", "≥", "≤"], OPP = { ">": "≤", "<": "≥", "≥": "<", "≤": ">" };
  function cmp(x, op, a) { return op === ">" ? x > a + 1e-9 : op === "<" ? x < a - 1e-9 : op === "≥" ? x > a - 1e-9 : x < a + 1e-9; }
  // [0°; 360°) dagi yechim (fn: sin/cos), oraliqlar ko'rinishida
  function ineqSet(fn, op, v, r) {
    var a = vNum(v), rts = ANG.filter(function (d) { return fV(fn, d) === v; });
    var pts = [0].concat(rts.filter(function (d) { return d !== 0; })).sort(function (p, q) { return p - q; });
    var el = [];
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i], isR = fV(fn, p) === v;
      el.push({ t: "p", x: p, ok: isR ? (op === "≥" || op === "≤") : cmp(fnum(fn, p * Math.PI / 180), op, a) });
      var nx = i + 1 < pts.length ? pts[i + 1] : 360;
      el.push({ t: "o", x: p, y: nx, ok: cmp(fnum(fn, (p + nx) / 2 * Math.PI / 180), op, a) });
    }
    var out = [], cur = null;
    for (var j = 0; j < el.length; j++) {
      var e = el[j];
      if (e.ok) {
        if (!cur) cur = { s: e.x, sb: e.t === "p" ? "[" : "(" };
        cur.e = e.t === "p" ? e.x : e.y; cur.eb = e.t === "p" ? "]" : ")";
      } else if (cur) { out.push(cur); cur = null; }
    }
    if (cur) out.push(cur);
    if (!out.length) return "yechimi yo'q";
    for (var m = 0; m < out.length; m++) if (out[m].s === out[m].e) return null;
    return out.map(function (c) { return c.sb + ang(c.s, r) + "; " + ang(c.e, r) + c.eb; }).join("∪");
  }
  function term2(d, per) { return (d === 0 ? "" : rad(d) + " + ") + per; }
  function ineqGen(fn, op, v) { // umumiy yechim (radianda)
    var st = op === ">" || op === "<", L1 = st ? "(" : "[", R1 = st ? ")" : "]", lo, hi, per = fn === "sin" || fn === "cos" ? "2πn" : "πn", up = op === ">" || op === "≥";
    if (fn === "sin") { var al = arcD("sin", v); if (up) { lo = al; hi = 180 - al; } else { lo = -180 - al; hi = al; } }
    else if (fn === "cos") { var be = arcD("cos", v); if (up) { lo = -be; hi = be; } else { lo = be; hi = 360 - be; } }
    else if (fn === "tg") { var at = arcD("tg", v); if (up) { lo = at; hi = 90; R1 = ")"; } else { lo = -90; hi = at; L1 = "("; } }
    else { var ac = arcD("ctg", v); if (up) { lo = 0; hi = ac; L1 = "("; } else { lo = ac; hi = 180; R1 = ")"; } }
    return L1 + term2(lo, per) + "; " + term2(hi, per) + R1;
  }
  function t36x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 3] : L === 2 ? [0, 1, 1, 3, 2] : [1, 2, 2, 2, 3]);
    var fn = pick(["sin", "cos"]), op = pick(OPS), v = pick(["−√3/2", "−√2/2", "−1/2", "0", "1/2", "√2/2", "√3/2"]);
    if (k === 0) { // berilgan burchaklardan qaysi biri yechim
      var good = [], bad = [];
      ANG.concat([20, 70, 100, 160, 200, 250, 290, 340]).forEach(function (d) { (cmp(fnum(fn, d * Math.PI / 180), op, vNum(v)) && !(fV(fn, d) === v) ? good : fV(fn, d) === v ? [] : bad).push(d); });
      if (!good.length || bad.length < 3) return null;
      var g = pick(good), a0 = deg(g);
      return Q("Qaysi burchak " + fn + " x " + op + " " + v + " tengsizlikni qanoatlantiradi?", a0, W(a0, shuffle(bad).map(deg)),
        [tf(fn, g) + " ≈ " + String(Math.round(fnum(fn, g * Math.PI / 180) * 100) / 100).replace("-", "−").replace(".", ","), v + " ≈ " + String(Math.round(vNum(v) * 100) / 100).replace("-", "−").replace(".", ","), "Shart bajariladi: " + a0]);
    }
    if (k === 1) { // [0°; 360°) dagi yechim
      var r1 = L === 3 && Math.random() < .5, a1 = ineqSet(fn, op, v, r1); if (!a1) return null;
      var alts = [ineqSet(fn, OPP[op], v, r1), ineqSet(CO[fn], op, v, r1), ineqSet(fn, op, neg(v), r1), ineqSet(fn, op === ">" ? "≥" : op === "≥" ? ">" : op === "<" ? "≤" : "<", v, r1), ineqSet(fn, op === ">" ? "<" : op === "<" ? ">" : op === "≥" ? "≤" : "≥", v, r1)];
      return Q(fn + " x " + op + " " + v + " tengsizlikning " + (r1 ? "[0; 2π)" : "[0°; 360°)") + " oraliqdagi yechimini toping.", a1, W(a1, alts.filter(function (x) { return x; })),
        [fn + " x = " + v + ": " + ANG.filter(function (d) { return fV(fn, d) === v; }).map(function (d) { return ang(d, r1); }).join(" va "), "Birlik aylanada " + (fn === "sin" ? "ordinatasi" : "abssissasi") + " " + v + " dan " + (op === ">" || op === "≥" ? "katta" : "kichik") + " bo'lgan yoy", "Javob: " + a1]);
    }
    if (k === 2) { // umumiy yechim
      var f2 = pick(["sin", "cos", "sin", "cos", "tg", "ctg"]), v2 = f2 === "tg" || f2 === "ctg" ? pick(TV) : v, a2 = ineqGen(f2, op, v2);
      var alt2 = [ineqGen(f2, OPP[op], v2), ineqGen(f2, op, neg(v2)), a2.replace(/2πn/g, "πn"), (f2 === "tg" || f2 === "ctg") && v2 === "0" ? "" : ineqGen(CO[f2], op, v2)];
      if (f2 === "tg" || f2 === "ctg") alt2.push(a2.replace(/πn/g, "2πn"));
      return Q(f2 + " x " + op + " " + v2 + " tengsizlikni yeching.", a2, W(a2, alt2),
        [f2 + " x = " + v2 + " → x = " + rad(arcD(f2, v2)) + (f2 === "sin" ? " va π − " + rad(arcD(f2, v2)) : f2 === "cos" ? " va −" + rad(arcD(f2, v2)) : ""), "Davr: " + (f2 === "sin" || f2 === "cos" ? "2π" : "π"), "Javob: " + a2]);
    }
    // tg x op a, (−90°; 90°) da
    var t = pick(TV), at = arcD("tg", t), up = op === ">" || op === "≥", br = op === "≥" || op === "≤";
    var a3 = up ? (br ? "[" : "(") + deg(at) + "; 90°)" : "(−90°; " + deg(at) + (br ? "]" : ")");
    var w3 = [up ? "(−90°; " + deg(at) + (br ? "]" : ")") : (br ? "[" : "(") + deg(at) + "; 90°)", up ? (br ? "(" : "[") + deg(at) + "; 90°)" : "(−90°; " + deg(at) + (br ? ")" : "]"), up ? (br ? "[" : "(") + deg(-at) + "; 90°)" : "(−90°; " + deg(-at) + (br ? "]" : ")"), up ? (br ? "[" : "(") + deg(at) + "; 180°)" : "(0°; " + deg(at) + (br ? "]" : ")"), up ? (br ? "[" : "(") + deg(90 - at) + "; 90°)" : "(−90°; " + deg(90 - at) + (br ? "]" : ")")];
    return Q("tg x " + op + " " + t + " tengsizlikning (−90°; 90°) oraliqdagi yechimini toping.", a3, W(a3, w3),
      ["tg x o'suvchi, " + tf("tg", at) + " = " + t, up ? "x " + (br ? "≥ " : "> ") + deg(at) + " va x < 90°" : "−90° < x " + (br ? "≤ " : "< ") + deg(at), "Javob: " + a3]);
  }

  /* ---------- s9m3: 9-sinf trigonometriya asoslari ---------- */
  function s9m3x(L) {
    var k = pick(L === 1 ? [0, 0, 3, 4] : L === 2 ? [0, 1, 2, 3, 4] : [0, 1, 1, 2, 2, 3]);
    if (k === 0) { // to'g'ri burchakli uchburchakda nisbatlar
      var t = pick(TRI), sc = pick([1, 1, 2, 3]), a = t[0] * sc, b = t[1] * sc, c = t[2] * sc, sw = Math.random() < .5;
      // ∠C = 90°, BC = a (∠A qarshisida), AC = b, AB = c
      var BC = sw ? b : a, AC = sw ? a : b, at = pick(["A", "B"]), fn = pick(["sin", "cos", "tg", "ctg"]);
      var opp = at === "A" ? BC : AC, adj = at === "A" ? AC : BC;
      var ans = fn === "sin" ? F(opp, c) : fn === "cos" ? F(adj, c) : fn === "tg" ? F(opp, adj) : F(adj, opp);
      var giv = L === 1 ? "BC = " + BC + ", AC = " + AC + ", AB = " + c : pick(["BC = " + BC + ", AC = " + AC, "BC = " + BC + ", AB = " + c, "AC = " + AC + ", AB = " + c]);
      return Q("ABC uchburchakda ∠C = 90°, " + giv + ". " + fn + " " + at + " ni toping.", ans, W(ans, [F(adj, c), F(opp, c), F(opp, adj), F(adj, opp), F(c, opp), F(c, adj)]),
        [L === 1 ? "" : "Pifagor: AB² = AC² + BC² → " + "AB = " + c + ", AC = " + AC + ", BC = " + BC, fn === "sin" ? "sin = qarshi katet / gipotenuza" : fn === "cos" ? "cos = yopishgan katet / gipotenuza" : fn === "tg" ? "tg = qarshi katet / yopishgan katet" : "ctg = yopishgan katet / qarshi katet", fn + " " + at + " = " + ans].filter(function (x) { return x; }));
    }
    if (k === 1) { // 30°, 45°, 60° li uchburchak tomonlari
      var n = R(2, 12), typ = R(0, 3), q, a1, w1, st;
      if (typ === 0) { q = "∠C = 90°, ∠A = 30°, AB = " + 2 * n + ". BC ni toping."; a1 = n; w1 = [2 * n, n + "√3", n + "√2", 4 * n]; st = ["30° qarshisidagi katet gipotenuzaning yarmiga teng", "BC = " + 2 * n + " : 2 = " + n]; }
      else if (typ === 1) { q = "∠C = 90°, ∠A = 30°, AB = " + 2 * n + ". AC ni toping."; a1 = n + "√3"; w1 = [n, n + "√2", 2 * n + "√3", n + "√3/2"]; st = ["AC = AB·cos 30° = " + 2 * n + "·√3/2", "AC = " + n + "√3"]; }
      else if (typ === 2) { q = "∠C = 90°, ∠A = 45°, AC = " + n + ". AB ni toping."; a1 = n + "√2"; w1 = [n, 2 * n, n + "√3", n + "√2/2"]; st = ["Teng yonli to'g'ri burchakli uchburchak: BC = AC = " + n, "AB = " + n + "√2"]; }
      else { q = "∠C = 90°, ∠B = 60°, BC = " + n + ". AB ni toping."; a1 = 2 * n; w1 = [n, n + "√3", n + "√2", 3 * n]; st = ["∠A = 30°, BC — 30° qarshisidagi katet", "AB = 2·BC = " + 2 * n]; }
      return Q("ABC uchburchakda " + q, a1, W(a1, w1), st);
    }
    if (k === 2) { // sin α berilgan, o'tkir burchak
      var t2 = tri(), giv2 = pick(["sin", "cos", "tg"]), tar = pick(["sin", "cos", "tg"].filter(function (f) { return f !== giv2; }));
      var V2 = { sin: F(t2[0], t2[2]), cos: F(t2[1], t2[2]), tg: F(t2[0], t2[1]) };
      return Q(giv2 + " α = " + V2[giv2] + " (α — o'tkir burchak). " + tar + " α ni toping.", V2[tar], W(V2[tar], [F(t2[1], t2[0]), V2[giv2], F(t2[2], t2[1]), F(t2[2], t2[0]), "−" + V2[tar], F(t2[1], t2[2]) === V2[tar] ? F(t2[0], t2[2]) : F(t2[1], t2[2])]),
        [giv2 === "tg" ? "1 + tg²α = 1/cos²α" : "sin²α + cos²α = 1", "sin α = " + V2.sin + ", cos α = " + V2.cos, tar + " α = " + V2[tar]]);
    }
    if (k === 3) { // to'ldiruvchi burchak
      var A = R(1, 89), f = pick(["sin", "cos", "tg", "ctg"]);
      var a3 = deg(90 - A);
      return Q(f + " " + A + "° = " + CO[f] + " x bo'lsa, o'tkir burchak x ni toping.", a3, W(a3, [deg(A), deg(180 - A), deg(90 + A), deg(Math.abs(45 - A) || 45), deg(360 - A)]),
        [f + " α = " + CO[f] + "(90° − α)", "x = 90° − " + A + "° = " + a3]);
    }
    // jadval qiymatlaridan ifoda
    var terms = [["sin 30°", 1, 2], ["cos 60°", 1, 2], ["tg 45°", 1, 1], ["sin 90°", 1, 1], ["cos 0°", 1, 1], ["sin²45°", 1, 2], ["cos²30°", 3, 4], ["sin²60°", 3, 4], ["tg²60°", 3, 1], ["tg²30°", 1, 3], ["cos²45°", 1, 2], ["ctg 45°", 1, 1], ["cos 90°", 0, 1], ["sin 0°", 0, 1]];
    var t1 = pick(terms), tt2; do { tt2 = pick(terms); } while (tt2 === t1);
    var c1 = pick([1, 2, 3, 4]), c2 = pick([1, 2, 4, 6]), op = pick([1, -1]);
    var N = c1 * t1[1] * 12 / t1[2] + op * c2 * tt2[1] * 12 / tt2[2], a4 = F(N, 12);
    return Q("Hisoblang: " + (c1 === 1 ? "" : c1) + t1[0] + (op > 0 ? " + " : " − ") + (c2 === 1 ? "" : c2) + tt2[0], a4,
      W(a4, [F(c1 * t1[1] * 12 / t1[2] - op * c2 * tt2[1] * 12 / tt2[2], 12), F(N + 6, 12), F(N - 6, 12), F(N + 12, 12), F(-N, 12)]),
      [t1[0] + " = " + F(t1[1], t1[2]) + ", " + tt2[0] + " = " + F(tt2[1], tt2[2]), "Natija: " + a4]);
  }

  aug("t33", t33x, sh(.85, .7, .7));
  aug("t69", t33x, sh(.85, .7, .7));
  aug("t34", t34x, sh(.85, .8, .8));
  aug("t35", t35x, sh(.75, .65, .65));
  aug("t36", t36x, sh(.88, .88, .88));
  aug("s9m3", s9m3x, sh(.88, .85, .8));

  /* ================= Ko'rsatkichli va logarifmik funksiyalar ================= */
  var SUPC = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "−": "⁻", "+": "⁺", "x": "ˣ", "n": "ⁿ", "(": "⁽", ")": "⁾" };
  var SUBC = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
  function sup(n) { return String(n).replace(/ /g, "").split("").map(function (c) { return SUPC[c] || c; }).join(""); }
  function sub(n) { return String(n).split("").map(function (c) { return SUBC[c] || c; }).join(""); }
  function lg(a) { return a === 10 ? "lg" : "log" + (typeof a === "string" ? "_" + a : sub(a)); }
  function pw(a, n) { return Math.pow(a, n); }
  // a^n ratsional ko'rinishda (n manfiy bo'lsa kasr)
  function pwS(a, n) { return n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n); }
  function base(b) { return b[1] === 1 ? String(b[0]) : "(" + b[0] + "/" + b[1] + ")"; }   // [p, q] → "(p/q)"
  function expo(e) { return e.length === 1 ? sup(e) : "^(" + e + ")"; }
  // ko'rsatkichdagi chiziqli ifoda: mx + b
  function linX(m, b) { return poly([m, b]); }

  function t19x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [1, 2, 3, 3, 4, 5] : [3, 5, 6, 6, 7]);
    if (k === 0) { // daraja qiymati
      var a = R(2, 9), n = L === 1 ? R(-3, 4) : R(-4, 5); if (Math.abs(n) > 3 && a > 5) n = n > 0 ? 3 : -3;
      if (Math.random() < .3) { var p = R(1, 4), q = R(2, 5); if (gcd(p, q) !== 1) p = 1; var m = R(-3, 3);
        var ans0 = m >= 0 ? F(pw(p, m), pw(q, m)) : F(pw(q, -m), pw(p, -m));
        return Q("(" + p + "/" + q + ")" + sup(m) + " ni hisoblang.", ans0, W(ans0, [F(pw(p, Math.abs(m)), pw(q, Math.abs(m))), F(pw(q, Math.abs(m)), pw(p, Math.abs(m))), F(p * Math.abs(m), q), F(-pw(p, Math.abs(m)), pw(q, Math.abs(m))), F(p * m, q * m || 1), "1"]),
          [m < 0 ? "(a/b)⁻ⁿ = (b/a)ⁿ" : m === 0 ? "a⁰ = 1" : "(a/b)ⁿ = aⁿ/bⁿ", "= " + ans0]); }
      var ans = n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n);
      return Q(a + sup(n) + " ni hisoblang.", ans, W(ans, [n >= 0 ? -pw(a, n) : "−" + pw(a, -n), n >= 0 ? a * n : "−1/" + pw(a, -n), n >= 0 ? pw(a, n + 1) : String(-a * -n), n === 0 ? "0" : n > 0 ? pw(a, n - 1) : "1/" + (a * -n), String(a)]),
        [n < 0 ? "a⁻ⁿ = 1/aⁿ" : n === 0 ? "a⁰ = 1" : a + " ni " + n + " marta ko'paytiramiz", "= " + ans]);
    }
    if (k === 1) { // qaysi funksiya o'suvchi / kamayuvchi
      var inc = ["2ˣ", "3ˣ", "(3/2)ˣ", "(5/4)ˣ", "πˣ", "(√2)ˣ", "10ˣ", "(7/3)ˣ", "eˣ", "(1,5)ˣ"], dec = ["(1/2)ˣ", "(2/3)ˣ", "(0,3)ˣ", "(3/5)ˣ", "(1/π)ˣ", "(√2/2)ˣ", "(0,9)ˣ", "(4/7)ˣ", "3⁻ˣ", "(5/8)ˣ"];
      var askInc = Math.random() < .5, A1 = pick(askInc ? inc : dec), oth = shuffle(askInc ? dec : inc).slice(0, 4);
      return Q("Qaysi funksiya " + (askInc ? "o'suvchi" : "kamayuvchi") + "?", "y = " + A1, oth.map(function (x) { return "y = " + x; }),
        ["y = aˣ: a > 1 bo'lsa o'suvchi, 0 < a < 1 bo'lsa kamayuvchi", "Javob: y = " + A1]);
    }
    if (k === 2) { // f(x) = aˣ + b qiymati
      var a2 = R(2, 6), b2 = R(-9, 9), x2 = R(L === 1 ? 0 : -2, 3), v2 = x2 >= 0 ? F(pw(a2, x2) + b2, 1) : F(1 + b2 * pw(a2, -x2), pw(a2, -x2));
      return Q("f(x) = " + a2 + "ˣ" + (b2 > 0 ? " + " + b2 : b2 < 0 ? " − " + (-b2) : "") + " bo'lsa, f(" + ms(x2) + ") ni toping.", v2,
        W(v2, [x2 >= 0 ? F(a2 * x2 + b2, 1) : F(-pw(a2, -x2) + b2, 1), x2 >= 0 ? F(pw(a2, x2 + 1) + b2, 1) : F(b2 - 1, pw(a2, -x2)), x2 >= 0 ? F(pw(a2, x2) - b2, 1) : F(1 - b2 * pw(a2, -x2), pw(a2, -x2)), F(b2 + 1, 1), x2 >= 0 ? F(pw(a2, x2) + b2 + 1, 1) : F(b2, 1)]),
        ["f(" + ms(x2) + ") = " + a2 + sup(x2) + (b2 >= 0 ? " + " + b2 : " − " + (-b2)), a2 + sup(x2) + " = " + pwS(a2, x2), "= " + v2]);
    }
    if (k === 3) { // qiymatlar sohasi / Oy bilan kesishish
      var a3 = R(2, 7), b3 = RNZ(-9, 9), sg = L === 3 && Math.random() < .5 ? -1 : 1, e3 = "y = " + (sg < 0 ? "−" : "") + a3 + "ˣ" + (b3 > 0 ? " + " + b3 : " − " + (-b3));
      if (Math.random() < .5) { var ans3 = sg > 0 ? "(" + ms(b3) + "; +∞)" : "(−∞; " + ms(b3) + ")";
        return Q(e3 + " funksiyaning qiymatlar sohasini toping.", ans3, W(ans3, ["[" + ms(b3) + "; +∞)", "(0; +∞)", sg > 0 ? "(−∞; " + ms(b3) + ")" : "(" + ms(b3) + "; +∞)", "(" + ms(-b3) + "; +∞)", "(" + ms(b3 + 1) + "; +∞)", "(−∞; +∞)"]),
          [a3 + "ˣ > 0 → " + (sg < 0 ? "−" + a3 + "ˣ < 0" : a3 + "ˣ" + (b3 > 0 ? " + " + b3 : " − " + (-b3)) + " > " + ms(b3)), "E(y) = " + ans3]); }
      var yy = sg + b3, ans4 = "(0; " + ms(yy) + ")";
      return Q(e3 + " funksiya grafigi Oy o'qini qaysi nuqtada kesadi?", ans4, W(ans4, ["(0; " + ms(b3) + ")", "(0; " + ms(sg * a3 + b3) + ")", "(" + ms(yy) + "; 0)", "(0; " + ms(yy + 1) + ")", "(1; " + ms(sg * a3 + b3) + ")"]),
        ["x = 0: y = " + (sg < 0 ? "−" : "") + a3 + "⁰" + (b3 > 0 ? " + " + b3 : " − " + (-b3)) + " = " + ms(yy), "Nuqta: " + ans4]);
    }
    if (k === 4) { // grafik nuqtadan o'tadi
      var a5 = R(2, 7), x5 = R(2, 4); if (pw(a5, x5) > 1000) x5 = 2;
      return Q("y = aˣ funksiya grafigi (" + x5 + "; " + pw(a5, x5) + ") nuqtadan o'tadi. a ni toping.", a5, W(a5, [pw(a5, x5) / x5 === Math.round(pw(a5, x5) / x5) ? pw(a5, x5) / x5 : a5 + 2, a5 + 1, a5 - 1 > 1 ? a5 - 1 : a5 + 3, a5 * x5, x5]),
        ["a" + sup(x5) + " = " + pw(a5, x5), "a = " + a5]);
    }
    if (k === 5) { // amallar
      var a6 = R(2, 5), m6 = R(1, 5), n6 = R(-4, -1), c6 = R(0, 1);
      if (c6 === 0) { var e6 = pw(a6, m6 + n6), s6 = m6 + n6 >= 0 ? String(e6) : "1/" + pw(a6, -(m6 + n6)), extra = R(1, 9);
        var full = m6 + n6 >= 0 ? F(e6 + extra, 1) : F(1 + extra * pw(a6, -(m6 + n6)), pw(a6, -(m6 + n6)));
        return Q("Hisoblang: " + a6 + sup(m6) + " · " + a6 + sup(n6) + " + " + extra + "⁰·" + extra, full, W(full, [F(pw(a6, m6 * n6 < 0 ? 0 : m6 * n6) + extra, 1), m6 + n6 >= 0 ? F(e6 + 1, 1) : F(1 + pw(a6, -(m6 + n6)), pw(a6, -(m6 + n6))), F(pw(a6, m6 - n6) + extra, 1), m6 + n6 >= 0 ? F(e6, 1) : s6, F(extra + 1, 1)]),
          ["aᵐ·aⁿ = aᵐ⁺ⁿ: " + a6 + sup(m6 + n6) + " = " + s6, extra + "⁰ = 1", "= " + full]); }
      var mm = R(2, 4), nn = R(2, 3), bb = pw(a6, mm);
      var ans6 = String(pw(a6, mm * nn - mm));
      return Q("Hisoblang: (" + a6 + sup(mm) + ")" + sup(nn) + " : " + bb, ans6, W(ans6, [pw(a6, mm + nn - mm), pw(a6, mm * nn), pw(a6, mm * nn - mm - 1), pw(a6, mm * nn - mm + 1), pw(a6, nn)]),
        ["(aᵐ)ⁿ = aᵐⁿ = " + a6 + sup(mm * nn), bb + " = " + a6 + sup(mm), a6 + sup(mm * nn - mm) + " = " + ans6]);
    }
    if (k === 6) { // eng katta / eng kichik son
      var C = [[2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [5, 1], [6, 1], [7, 1], [10, 1], [2, 4], [11, 1], [3, 3], [5, 2], [2, 5]], sel = [], used = {};
      shuffle(C).forEach(function (c) { var B = pw(c[0], c[1]); if (sel.length < 4 && !used[B]) { used[B] = 1; sel.push(c); } });
      var m7 = pick([10, 15, 20, 25, 30]), big = Math.random() < .5;
      sel.sort(function (p, q) { return pw(p[0], p[1]) - pw(q[0], q[1]); });
      var lab = sel.map(function (c) { return c[0] + sup(c[1] * m7); }), A7 = big ? lab[3] : lab[0];
      return Q("Qaysi son eng " + (big ? "katta" : "kichik") + ": " + shuffle(lab).join(", ") + "?", A7, W(A7, lab),
        ["Barchasini bir xil " + m7 + "-darajaga keltiramiz: " + sel.map(function (c) { return pw(c[0], c[1]) + sup(m7); }).join(", "), "Asosi eng " + (big ? "katta" : "kichik") + "i: " + A7]);
    }
    // f(x) = aˣ xossasi: f(m)·f(n), f(x+1)/f(x)
    var a8 = R(2, 5), m8 = R(1, 4), n8 = R(1, 3);
    if (Math.random() < .5) return Q("f(x) = " + a8 + "ˣ bo'lsa, f(" + m8 + ")·f(" + n8 + ") ni toping.", pw(a8, m8 + n8), W(pw(a8, m8 + n8), [pw(a8, m8 * n8), pw(a8, m8) + pw(a8, n8), pw(a8, m8 + n8 + 1), pw(a8, m8 + n8 - 1), a8 * (m8 + n8)]),
      ["f(m)·f(n) = aᵐ·aⁿ = aᵐ⁺ⁿ", a8 + sup(m8 + n8) + " = " + pw(a8, m8 + n8)]);
    return Q("f(x) = " + a8 + "ˣ bo'lsa, f(x + " + n8 + ") : f(x) ni toping.", pw(a8, n8), W(pw(a8, n8), [a8 * n8, n8, pw(a8, n8 + 1), a8, pw(a8, n8) + 1].filter(function (x) { return x !== pw(a8, n8); })),
      ["f(x + " + n8 + ")/f(x) = " + a8 + "ˣ⁺" + sup(n8) + "/" + a8 + "ˣ = " + a8 + sup(n8), "= " + pw(a8, n8)]);
  }

  var PB = [[2, [2, 4, 8, 16, 32, 64, 128]], [3, [3, 9, 27, 81, 243]], [5, [5, 25, 125, 625]], [7, [7, 49, 343]], [10, [10, 100, 1000, 10000]], [4, [4, 16, 64, 256]], [6, [6, 36, 216]], [9, [9, 81, 729]], [8, [8, 64, 512]]];
  function t20x(L) {
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2, 2, 3] : [2, 3, 4, 4, 5]);
    if (k === 0) { // log qiymati (manfiy va kasr ko'rsatkich bilan)
      var b = pick(PB), a = b[0], n = R(L === 1 ? -2 : -3, b[1].length), arg = n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n);
      if (Math.random() < .2) { arg = "√" + a; n = "1/2"; }
      var inv = Math.random() < .25 && typeof n === "number" && n !== 0;
      if (inv) { var res = -n;
        return Q("log" + sub("1/" + a).replace("/", "/") + " " + arg + " ni hisoblang.".replace("log" + sub("1/" + a), "log_(1/" + a + ")"), res, W(res, [n, res + 1, res - 1, pw(a, Math.abs(n)), 1 / 1 === 1 ? -res * 2 : 0]),
          ["(1/" + a + ")" + sup(res) + " = " + arg, "Javob: " + ms(res)]); }
      return Q(lg(a) + " " + arg + " ni hisoblang.", n, W(n, typeof n === "string" ? ["2", "−1/2", "1", "1/" + a] : [-n, n + 1, n - 1, n === 0 ? 1 : 1 / n === Math.round(1 / n) ? 1 / n + 1 : n * 2, a]),
        [typeof n === "string" ? "√" + a + " = " + a + "^(1/2)" : a + sup(n) + " = " + arg, "Javob: " + ms(typeof n === "string" ? 0 : n).replace("0", typeof n === "string" ? n : "0").replace(/^(−?)(\d+)$/, "$1$2")]);
    }
    if (k === 1) { // grafik nuqtadan o'tadi / funksiya qiymati
      var b1 = pick(PB.slice(0, 5)), a1 = b1[0], i1 = R(1, b1[1].length - 1), x1 = b1[1][i1], y1 = i1 + 1, c1 = R(-6, 6);
      if (Math.random() < .5) return Q("y = logₐ x funksiya grafigi (" + x1 + "; " + y1 + ") nuqtadan o'tadi. a ni toping.", a1, W(a1, [x1 / y1 === Math.round(x1 / y1) ? x1 / y1 : a1 + 1, y1, a1 + 1, a1 * a1 < x1 ? a1 * a1 : a1 + 2, x1]),
        ["logₐ " + x1 + " = " + y1 + " → a" + sup(y1) + " = " + x1, "a = " + a1]);
      var v1 = y1 + c1;
      return Q("f(x) = " + lg(a1) + " x" + (c1 > 0 ? " + " + c1 : c1 < 0 ? " − " + (-c1) : "") + " bo'lsa, f(" + x1 + ") ni toping.", v1, W(v1, [y1 - c1, x1 + c1, v1 + 1, v1 - 1, y1]),
        [lg(a1) + " " + x1 + " = " + y1, "f(" + x1 + ") = " + y1 + (c1 >= 0 ? " + " + c1 : " − " + (-c1)) + " = " + ms(v1)]);
    }
    if (k === 2) { // aniqlanish sohasi
      var a2 = pick([2, 3, 5, 10]), kk = R(1, 5), bb = R(-9, 9), kind = R(0, 2), ans, e, w;
      if (kind === 0) { e = poly([kk, -bb]); ans = "(" + F(bb, kk) + "; +∞)"; w = ["[" + F(bb, kk) + "; +∞)", "(−∞; " + F(bb, kk) + ")", "(" + F(-bb, kk) + "; +∞)", "(" + ms(bb) + "; +∞)", "(0; +∞)"]; }
      else if (kind === 1) { e = poly([-kk, bb]).replace(/^−(\d*)x \+ (\d+)$/, "$2 − $1x").replace(/^−(\d*)x − (\d+)$/, "−$2 − $1x"); ans = "(−∞; " + F(bb, kk) + ")"; w = ["(" + F(bb, kk) + "; +∞)", "(−∞; " + F(bb, kk) + "]", "(−∞; " + F(-bb, kk) + ")", "(0; " + F(Math.abs(bb), kk) + ")", "(−∞; +∞)"]; }
      else { var c = R(1, 7); e = "x² − " + c * c; ans = "(−∞; " + ms(-c) + ")∪(" + c + "; +∞)"; w = ["(" + ms(-c) + "; " + c + ")", "(" + c + "; +∞)", "(−∞; " + ms(-c) + "]∪[" + c + "; +∞)", "(" + c * c + "; +∞)", "(0; +∞)"]; }
      return Q("y = " + lg(a2) + "(" + e + ") funksiyaning aniqlanish sohasini toping.", ans, W(ans, w), [e + " > 0", "D(y) = " + ans]);
    }
    if (k === 3) { // qaysi funksiya kamayuvchi
      var inc = ["log₂ x", "log₃ x", "lg x", "ln x", "log₅ x", "log₇ x", "log₁.₅ x"], dec = ["log₀.₅ x", "log_(1/3) x", "log_(2/5) x", "log_(1/2) x", "log₀.₂ x", "log_(3/4) x"];
      var askInc = Math.random() < .5, A3 = pick(askInc ? inc.slice(0, 6) : dec), oth = shuffle(askInc ? dec : inc.slice(0, 6)).slice(0, 4);
      return Q("Qaysi funksiya " + (askInc ? "o'suvchi" : "kamayuvchi") + "?", "y = " + A3, oth.map(function (x) { return "y = " + x; }),
        ["y = logₐ x: a > 1 → o'suvchi, 0 < a < 1 → kamayuvchi", "Javob: y = " + A3]);
    }
    if (k === 4) { // log_(c^p) c^q = q/p
      var cB = pick([2, 3, 5]), pp = R(1, cB === 2 ? 5 : 3), qq = RNZ(-(cB === 2 ? 5 : 3), cB === 2 ? 6 : 4); if (pp === 1 && Math.random() < .7) pp = 2;
      var A4 = pw(cB, pp), B4 = qq >= 0 ? String(pw(cB, qq)) : "1/" + pw(cB, -qq), ans4 = F(qq, pp);
      return Q("log" + sub(A4) + " " + B4 + " ni hisoblang.", ans4, W(ans4, [F(pp, qq), neg(ans4), F(qq + 1, pp), F(qq, pp + 1), String(qq), F(qq * pp, 1)]),
        [A4 + " = " + cB + sup(pp) + ", " + B4 + " = " + cB + sup(qq), "logₐᵖ aᵠ = q/p = " + ans4]);
    }
    // logarifmlarni taqqoslash: qaysi biri manfiy
    var negs = ["log₂ 0,5", "lg 0,01", "log₃ (1/9)", "log₅ 0,2", "log₀.₅ 4", "log_(1/3) 27", "log₂ (1/8)", "log₇ (1/7)"], pos = ["log₂ 3", "lg 20", "log₀.₅ 0,25", "log₃ 10", "log_(1/2) (1/8)", "log₅ 7", "ln 3", "log₀.₂ 0,04"];
    var askNeg = Math.random() < .5, A5 = pick(askNeg ? negs : pos);
    return Q("Qaysi son " + (askNeg ? "manfiy" : "musbat") + "?", A5, shuffle(askNeg ? pos : negs).slice(0, 4),
      ["logₐ b > 0, agar a va b 1 dan bir tomonda bo'lsa", "logₐ b < 0, agar a va b 1 ning turli tomonida bo'lsa", "Javob: " + A5]);
  }

  function t22x(L) {
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2, 3] : [2, 3, 4, 4, 5]);
    var b = pick(PB.slice(0, 7)), a = b[0];
    if (k === 0) { // aˣ = c (c: daraja, 1, kasr)
      var n = R(-3, b[1].length), rhs = n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n), flip = Math.random() < .3 && n !== 0;
      var bs = flip ? "(1/" + a + ")" : String(a), ans = flip ? -n : n;
      return Q(bs + "ˣ = " + rhs + " tenglamani yeching.", ans, W(ans, [-ans, ans + 1, ans - 1, n >= 0 ? pw(a, n) / a : -pw(a, -n), 2 * ans || 2]),
        [rhs + " = " + bs + sup(ans), "Asoslar teng → x = " + ms(ans)]);
    }
    if (k === 1) { // a^(kx + b) = c
      var kk = pick([1, 2, 3]), x = R(-3, 4), bb = R(-5, 5), e = kk * x + bb, i = 0;
      while ((e < -2 || e >= b[1].length) && i++ < 30) { x = R(-3, 4); bb = R(-5, 5); e = kk * x + bb; }
      if (e < -2 || e >= b[1].length) return null;
      var rhs1 = e >= 0 ? String(pw(a, e)) : "1/" + pw(a, -e);
      return Q(a + expo(linX(kk, bb)) + " = " + rhs1 + " tenglamani yeching.", x, W(x, [e, x + 1, x - 1, -x, (e + bb) / kk === Math.round((e + bb) / kk) ? (e + bb) / kk : x + 2]),
        [rhs1 + " = " + a + sup(e), linX(kk, bb) + " = " + e, "x = " + ms(x)]);
    }
    if (k === 2) { // A^(mx + p) = B^(nx + q), A = c^s, B = c^t
      var c = pick([2, 3, 5]), s = R(1, 3), t = R(1, 3); if (s === t) t = s + 1;
      var A = pw(c, s), B = pw(c, t), m = R(1, 3), nn = R(1, 3), x2 = R(-4, 5), den = s * m - t * nn;
      if (den === 0) { m = m + 1; den = s * m - t * nn; }
      var p = R(-4, 4), q = (s * (m * x2 + p) - t * nn * x2); if (q % t !== 0) { p = p + (t - ((s * (m * x2 + p) - t * nn * x2) % t + t) % t) / 1; q = s * (m * x2 + p) - t * nn * x2; }
      if (q % t !== 0) return null; q = q / t;
      return Q(A + expo(linX(m, p)) + " = " + B + expo(linX(nn, q)) + " tenglamani yeching.", x2, W(x2, [-x2, x2 + 1, x2 - 1, (q - p) / (m - nn || 1) === Math.round((q - p) / (m - nn || 1)) ? (q - p) / (m - nn || 1) : x2 + 2, x2 * 2]),
        [A + " = " + c + sup(s) + ", " + B + " = " + c + sup(t), s + "(" + linX(m, p) + ") = " + t + "(" + linX(nn, q) + ")", "x = " + ms(x2)]);
    }
    if (k === 3) { // a^(x+p) + a^x = M
      var a3 = pick([2, 3, 5]), p3 = R(1, 3), x3 = R(0, 3), coef = pw(a3, p3) + 1, M = coef * pw(a3, x3);
      return Q(a3 + "ˣ⁺" + sup(p3) + " + " + a3 + "ˣ = " + M + " tenglamani yeching.", x3, W(x3, [x3 + 1, x3 + p3, x3 - 1 >= 0 ? x3 - 1 : x3 + 2, M / coef === x3 ? x3 + 3 : M / coef, p3 === x3 ? x3 + 4 : p3]),
        [a3 + "ˣ·(" + a3 + sup(p3) + " + 1) = " + M, a3 + "ˣ = " + M + " : " + coef + " = " + pw(a3, x3), "x = " + x3]);
    }
    if (k === 4) { // kvadrat: a^(2x) − S·aˣ + P = 0 → ildizlar yig'indisi
      var a4 = pick([2, 3]), u = R(0, 3), v = R(0, 3); if (u === v) v = u + 1;
      var t1 = pw(a4, u), t2 = pw(a4, v), S4 = t1 + t2, P4 = t1 * t2;
      return Q(pw(a4, 2) + "ˣ − " + S4 + "·" + a4 + "ˣ + " + P4 + " = 0 tenglama ildizlari yig'indisini toping.", u + v, W(u + v, [S4, P4, u * v, u + v + 1, Math.abs(u - v)]),
        [a4 + "ˣ = t: t² − " + S4 + "t + " + P4 + " = 0 → t = " + t1 + "; " + t2, "x = " + u + " yoki x = " + v, "Yig'indi: " + (u + v)]);
    }
    // (1/a)^(x) = a^(kx + b)
    var a5 = pick([2, 3, 5]), k5 = R(1, 3), x5 = R(-3, 3), b5 = -x5 - k5 * x5;
    return Q("(1/" + a5 + ")ˣ = " + a5 + expo(linX(k5, b5)) + " tenglamani yeching.", x5, W(x5, [-x5, x5 + 1, x5 - 1, b5, x5 + 2]),
      ["(1/" + a5 + ")ˣ = " + a5 + "⁻ˣ", "−x = " + linX(k5, b5), "x = " + ms(x5)]);
  }

  function t23x(L) {
    var k = pick(L === 1 ? [0, 0, 1, 2] : L === 2 ? [0, 2, 3, 3] : [3, 4, 4, 5]);
    var b = pick(PB.slice(0, 5)), a = b[0];
    if (k === 0) { // logₐ x = n (n manfiy yoki 0 ham)
      var n = R(-2, Math.min(4, b[1].length)), ans = n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n);
      return Q(lg(a) + " x = " + ms(n) + " tenglamani yeching.", ans, W(ans, [n >= 0 ? a * n : "−" + pw(a, -n), n >= 0 ? pw(n, a) : "−1/" + pw(a, -n), n >= 0 ? pw(a, n + 1) : String(pw(a, -n)), n === 0 ? "0" : n > 0 ? pw(a, n - 1) : "1/" + (a * -n), String(n + a)]),
        ["x = " + a + sup(n), "x = " + ans]);
    }
    if (k === 1) { // logₓ N = n
      var i = R(1, b[1].length - 1), N = b[1][i], n1 = i + 1;
      return Q("log" + sub("x") .replace("x", "ₓ") + " " + N + " = " + n1 + " tenglamani yeching.", a, W(a, [N / n1 === Math.round(N / n1) ? N / n1 : a + 1, pw(N, 1) === N ? N : 1, a + 1, a * n1, n1]),
        ["x" + sup(n1) + " = " + N + ", x > 0, x ≠ 1", "x = " + a]);
    }
    if (k === 2) { // lg x = n yoki ln
      var n2 = R(-3, 4), ans2 = n2 >= 0 ? String(pw(10, n2)) : "0," + new Array(-n2).join("0") + "1";
      return Q("lg x = " + ms(n2) + " tenglamani yeching.", ans2, W(ans2, [n2 >= 0 ? 10 * n2 : "−" + pw(10, -n2), n2 >= 0 ? pw(10, n2 + 1) : "0," + new Array(-n2 + 1).join("0") + "1", n2 >= 0 ? (n2 ? pw(10, n2 - 1) : 0) : String(pw(10, -n2)), String(n2 + 10)]),
        ["lg x = log₁₀ x", "x = 10" + sup(n2) + " = " + ans2]);
    }
    if (k === 3) { // logₐ(kx + c) = n
      var kk = R(1, 5), n3 = R(0, Math.min(3, b[1].length)), val = pw(a, n3), x3 = R(-6, 9), c3 = val - kk * x3;
      return Q(lg(a) + "(" + poly([kk, c3]) + ") = " + n3 + " tenglamani yeching.", x3, W(x3, [(val + c3) / kk === Math.round((val + c3) / kk) ? (val + c3) / kk : x3 + 2, x3 + 1, x3 - 1, (n3 - c3) / kk === Math.round((n3 - c3) / kk) ? (n3 - c3) / kk : -x3, -x3]),
        [poly([kk, c3]) + " = " + a + sup(n3) + " = " + val, (kk === 1 ? "x" : kk + "x") + " = " + (val - c3), "x = " + ms(x3)]);
    }
    if (k === 4) { // logₐ x = logₐ m + logₐ p − logₐ q
      var m4 = R(2, 9), p4 = R(2, 9), q4 = pick([1, 2, 3, 4, 6]); if ((m4 * p4) % q4) q4 = 1;
      var ans4 = m4 * p4 / q4, a4 = pick([2, 3, 5, 7]);
      var e4 = "log" + sub(a4) + " " + m4 + " + log" + sub(a4) + " " + p4 + (q4 > 1 ? " − log" + sub(a4) + " " + q4 : "");
      return Q("log" + sub(a4) + " x = " + e4 + " tenglamani yeching.", ans4, W(ans4, [m4 + p4 - (q4 > 1 ? q4 : 0), m4 * p4 * q4, q4 > 1 ? m4 * p4 : m4 * p4 + 1, m4 + p4, ans4 + 1]),
        ["logₐ m + logₐ p = logₐ(mp), logₐ m − logₐ q = logₐ(m/q)", "x = " + m4 + "·" + p4 + (q4 > 1 ? " : " + q4 : "") + " = " + ans4]);
    }
    // logₐ x + logₐ(x + d) = logₐ N → x(x + d) = N, x > 0
    var x5 = R(1, 8), d5 = R(1, 6), N5 = x5 * (x5 + d5), a5 = pick([2, 3, 5, 6]);
    return Q("log" + sub(a5) + " x + log" + sub(a5) + "(x + " + d5 + ") = log" + sub(a5) + " " + N5 + " tenglamani yeching.", x5, W(x5, [-(x5 + d5), x5 + 1, N5 - d5 > 0 && N5 / 2 !== x5 ? Math.round(N5 / 2) : x5 + 2, d5 === x5 ? x5 + 3 : d5, x5 + d5]),
      ["x(x + " + d5 + ") = " + N5 + " → x² + " + d5 + "x − " + N5 + " = 0", "x₁ = " + x5 + ", x₂ = " + ms(-(x5 + d5)), "ODZ: x > 0 → x = " + x5]);
  }

  function t26x(L) {
    var k = pick(L === 1 ? [0, 0, 1] : L === 2 ? [0, 1, 2, 2] : [2, 3, 3, 4]);
    var ops = [">", "<", "≥", "≤"];
    function iv(T, op, up) { // up: x > T yo'nalishi (asos > 1 va >)
      var strict = op === ">" || op === "<";
      return up ? (strict ? "(" : "[") + T + "; +∞)" : "(0; " + T + (strict ? ")" : "]");
    }
    if (k === 0 || k === 1) {
      var b = pick(PB.slice(0, 5)), a = b[0], n = R(-2, Math.min(3, b[1].length)), op = pick(ops), small = k === 1;
      var T = small ? (n >= 0 ? (n === 0 ? "1" : "1/" + pw(a, n)) : String(pw(a, -n))) : (n >= 0 ? String(pw(a, n)) : "1/" + pw(a, -n));
      var bs = small ? "_(1/" + a + ")" : "", up = (op === ">" || op === "≥") !== small;
      var ans = iv(T, op, up), lb = small ? "log_(1/" + a + ")" : lg(a);
      return Q(lb + " x " + op + " " + ms(n) + " tengsizlikni yeching.", ans, W(ans, [iv(T, op, !up), "(" + T + "; +∞)" === ans ? "[" + T + "; +∞)" : "(" + T + "; +∞)", "(−∞; " + T + ")", iv(String(n), op, up), iv(T, op === ">" ? "≥" : op === "<" ? "≤" : op === "≥" ? ">" : "<", up)]),
        ["ODZ: x > 0", ms(n) + " = " + lb + " " + T, small ? "Asos 1 dan kichik → ishora almashadi" : "Asos 1 dan katta → ishora saqlanadi", "Javob: " + ans]);
    }
    if (k === 2) { // logₐ(x − p) op n
      var a2 = pick([2, 3, 5]), n2 = R(0, 3), p2 = R(-6, 6), op2 = pick([">", "<"]), V = pw(a2, n2) + p2;
      var ans2 = op2 === ">" ? "(" + ms(V) + "; +∞)" : "(" + ms(p2) + "; " + ms(V) + ")";
      return Q(lg(a2) + "(x " + (p2 >= 0 ? "− " + p2 : "+ " + (-p2)) + ") " + op2 + " " + n2 + " tengsizlikni yeching.", ans2,
        W(ans2, [op2 === ">" ? "(" + ms(p2) + "; " + ms(V) + ")" : "(" + ms(V) + "; +∞)", op2 === ">" ? "(" + ms(pw(a2, n2) - p2) + "; +∞)" : "(−∞; " + ms(V) + ")", op2 === ">" ? "[" + ms(V) + "; +∞)" : "(0; " + ms(V) + ")", op2 === ">" ? "(" + ms(n2 * a2 + p2) + "; +∞)" : "(" + ms(p2) + "; " + ms(n2 * a2 + p2) + ")"]),
        ["ODZ: x > " + ms(p2), "x " + (p2 >= 0 ? "− " + p2 : "+ " + (-p2)) + " " + op2 + " " + a2 + sup(n2) + " = " + pw(a2, n2), "Javob: " + ans2]);
    }
    if (k === 3) { // butun yechimlar soni
      var a3 = pick([2, 3]), n3 = R(1, a3 === 2 ? 4 : 2), p3 = R(-5, 5), V3 = pw(a3, n3) + p3, cnt = V3 - p3 - 1;
      return Q(lg(a3) + "(x " + (p3 >= 0 ? "− " + p3 : "+ " + (-p3)) + ") < " + n3 + " tengsizlikning butun yechimlari nechta?", cnt, W(cnt, [cnt + 1, cnt - 1, cnt + 2, V3, pw(a3, n3)]),
        ["ODZ: x > " + ms(p3), "x < " + ms(V3) + " → (" + ms(p3) + "; " + ms(V3) + ")", "Butun sonlar: " + (p3 + 1) + " … " + (V3 - 1) + " → " + cnt + " ta"]);
    }
    // logₐ(x − p) < logₐ(q − x)
    var p4 = R(-6, 4), q4 = p4 + 2 * R(1, 5), m4 = (p4 + q4) / 2, a4 = pick([2, 3, 5, 10]), bigger = Math.random() < .5;
    var ans4 = bigger ? "(" + ms(m4) + "; " + ms(q4) + ")" : "(" + ms(p4) + "; " + ms(m4) + ")";
    return Q(lg(a4) + "(x " + (p4 >= 0 ? "− " + p4 : "+ " + (-p4)) + ") " + (bigger ? ">" : "<") + " " + lg(a4) + "(" + q4 + " − x) tengsizlikni yeching.".replace("(0 − x)", "(−x)"), ans4,
      W(ans4, [bigger ? "(" + ms(p4) + "; " + ms(m4) + ")" : "(" + ms(m4) + "; " + ms(q4) + ")", bigger ? "(" + ms(m4) + "; +∞)" : "(−∞; " + ms(m4) + ")", "(" + ms(p4) + "; " + ms(q4) + ")", bigger ? "(" + ms(m4) + "; " + ms(q4) + "]" : "[" + ms(p4) + "; " + ms(m4) + ")"]),
      ["ODZ: x > " + ms(p4) + " va x < " + q4, "Asos > 1: x " + (p4 >= 0 ? "− " + p4 : "+ " + (-p4)) + " " + (bigger ? ">" : "<") + " " + q4 + " − x → x " + (bigger ? ">" : "<") + " " + ms(m4), "Javob: " + ans4]);
  }

  aug("t19", t19x, sh(.75, .55, .55));
  aug("t20", t20x, sh(.8, .6, .7));
  aug("t22", t22x, sh(.82, .4, .45));
  aug("t23", t23x, sh(.85, .35, .3));
  aug("t26", t26x, sh(.85, .85, .85));

  /* @@REST@@ */
})();
