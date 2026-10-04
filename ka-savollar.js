/*!
 * Kuvonch Academy — mavzu savollari (daraja bo'yicha cheksiz generator)
 * API: window.kaSavol.has(id) / .get(id, level) / .register(id, fn) / .pack(id, level, n)
 *   level: 1 = oson, 2 = o'rta, 3 = murakkab, 0 = aralash
 *   natija: { q, a, hint, steps[], w[] (noto'g'ri variantlar), kind }
 * Hech qanday server, API kalit yoki internet kerak emas.
 */
(function () {
  "use strict";
  if (window.kaSavol) return;

  /* ---------- yordamchilar ---------- */
  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function RNZ(a, b) { var v; do { v = R(a, b); } while (v === 0); return v; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function fr(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
  function ms(n) { return n < 0 ? "−" + (-n) : String(n); }
  function par(n) { return n < 0 ? "(" + ms(n) + ")" : String(n); }
  function poly(cs, v) {
    v = v || "x"; var deg = cs.length - 1, out = "";
    cs.forEach(function (c, i) {
      var p = deg - i; if (c === 0) return;
      var sign = c < 0 ? (out ? " − " : "−") : (out ? " + " : "");
      var ac = Math.abs(c), coef = (ac === 1 && p > 0) ? "" : String(ac);
      out += sign + (p === 0 ? String(ac) : coef + v + (p === 1 ? "" : p === 2 ? "²" : p === 3 ? "³" : "^" + p));
    });
    return out || "0";
  }
  // bitta songa yaqin, takrorlanmas noto'g'ri variantlar
  function nearW(a, n, spread) {
    var out = [], t = 0; spread = spread || Math.max(2, Math.round(Math.abs(a) * .4) + 2);
    while (out.length < n && t++ < 300) { var d = RNZ(-spread, spread), w = a + d; if (out.indexOf(w) < 0 && w !== a) out.push(w); }
    return out;
  }
  function pairW(x, y, n) {
    var out = [], t = 0;
    while (out.length < n && t++ < 300) {
      var s = pick([[y, x], [x, -y], [-x, y], [x + RNZ(-3, 3), y], [x, y + RNZ(-4, 4)], [-x, -y]]);
      var str = "(" + ms(s[0]) + "; " + ms(s[1]) + ")";
      if (s[0] === x && s[1] === y) continue;
      if (out.indexOf(str) < 0) out.push(str);
    }
    return out;
  }
  var H = { R: R, RNZ: RNZ, pick: pick, shuffle: shuffle, gcd: gcd, fr: fr, ms: ms, par: par, poly: poly, nearW: nearW, pairW: pairW };

  /* ================= 1-mavzu: Kvadrat funksiya va uning grafigi ================= */
  function t1(L) {
    var kinds = L === 1 ? [0, 1, 2, 3, 4, 5] : L === 2 ? [0, 2, 3, 6, 7, 8, 9, 10] : [1, 8, 9, 10, 11, 12, 13];
    var k = pick(kinds);
    var a, b, c, x0, y0, x1, x2, D;

    if (k === 0) { // uch abssissasi
      a = pick([1, 1, 2, -1, -2]); x0 = RNZ(-6, 6); y0 = R(-9, 9);
      b = -2 * a * x0; c = a * x0 * x0 + y0;
      return { q: "y = " + poly([a, b, c]) + " parabola uchining <b>abssissasini</b> (x₀) toping.", a: x0, hint: "son",
        w: nearW(x0, 6, 4), kind: "uch-x",
        steps: ["x₀ = −b/(2a)", "x₀ = −(" + ms(b) + ")/(2·" + ms(a) + ") = " + x0] };
    }
    if (k === 1) { // uch koordinatalari
      a = pick([1, 2, -1, -2, 3, -3]); x0 = RNZ(-6, 6); y0 = R(-12, 12);
      b = -2 * a * x0; c = a * x0 * x0 + y0;
      return { q: "y = " + poly([a, b, c]) + " parabola uchining koordinatalarini toping.", a: "(" + ms(x0) + "; " + ms(y0) + ")",
        hint: "(x₀; y₀)", w: pairW(x0, y0, 6), kind: "uch", type: "text",
        steps: ["x₀ = −b/(2a) = −(" + ms(b) + ")/(2·" + ms(a) + ") = " + x0, "y₀ = f(" + ms(x0) + ") = " + y0, "Uchi: (" + ms(x0) + "; " + ms(y0) + ")"] };
    }
    if (k === 2) { // shoxlar yo'nalishi
      a = RNZ(-5, 5); b = RNZ(-8, 8); c = R(-9, 9);
      var up = a > 0;
      return { q: "y = " + poly([a, b, c]) + " parabolaning shoxlari qayerga qaragan?", a: up ? "yuqoriga" : "pastga",
        hint: "yuqoriga / pastga", w: [up ? "pastga" : "yuqoriga", "o'ngga", "chapga"], type: "text", kind: "shox",
        steps: ["Yo'nalish faqat a ning ishorasiga bog'liq", "a = " + ms(a) + (up ? " > 0 → yuqoriga" : " < 0 → pastga")] };
    }
    if (k === 3) { // Oy bilan kesishish
      a = pick([1, 1, 2, -1, -2]); b = RNZ(-8, 8); c = RNZ(-12, 12);
      return { q: "y = " + poly([a, b, c]) + " parabola Oy o'qini qaysi nuqtada kesadi?", a: "(0; " + ms(c) + ")",
        hint: "(0; y)", w: pairW(0, c, 6), type: "text", kind: "oy",
        steps: ["Oy o'qida x = 0", "y = f(0) = " + ms(c), "Nuqta: (0; " + ms(c) + ")"] };
    }
    if (k === 4) { // f(x) qiymati
      a = pick([1, 2, -1, 3]); b = RNZ(-6, 6); c = R(-8, 8);
      var xq = RNZ(-4, 4), val = a * xq * xq + b * xq + c;
      return { q: "f(x) = " + poly([a, b, c]) + " bo'lsa, f(" + ms(xq) + ") ni toping.", a: val, hint: "son",
        w: nearW(val, 6), kind: "qiymat",
        steps: ["f(" + ms(xq) + ") = " + ms(a) + "·" + par(xq) + "² + " + ms(b) + "·" + par(xq) + " + " + ms(c), "= " + val] };
    }
    if (k === 5) { // simmetriya o'qi
      a = pick([1, 2, -1, -2]); x0 = RNZ(-6, 6); b = -2 * a * x0; c = R(-9, 9);
      return { q: "y = " + poly([a, b, c]) + " parabolaning simmetriya o'qi tenglamasini toping.", a: "x = " + ms(x0),
        hint: "x = son", w: nearW(x0, 6, 4).map(function (v) { return "x = " + ms(v); }), type: "text", kind: "simm",
        steps: ["Simmetriya o'qi: x = −b/(2a)", "x = −(" + ms(b) + ")/(2·" + ms(a) + ") = " + x0] };
    }
    if (k === 6) { // nollari
      a = pick([1, 1, -1]); x1 = RNZ(-7, 7); x2 = RNZ(-7, 7); if (x1 === x2) x2 = x1 + pick([1, 2, 3]);
      b = -a * (x1 + x2); c = a * x1 * x2;
      var srt = [x1, x2].sort(function (p, q) { return p - q; });
      return { q: "y = " + poly([a, b, c]) + " funksiyaning nollarini (x o'qi bilan kesishish nuqtalarini) toping.",
        a: ms(srt[0]) + "; " + ms(srt[1]), hint: "x₁; x₂", type: "text", kind: "nol",
        w: shuffle([ms(srt[0]) + "; " + ms(srt[1] + 1), ms(srt[0] - 1) + "; " + ms(srt[1]), ms(-srt[0]) + "; " + ms(-srt[1]), ms(srt[0]) + "; " + ms(srt[1] + 2), ms(srt[0] + 1) + "; " + ms(srt[1] - 1), "nollari yo'q"]).slice(0, 5),
        steps: ["y = 0: " + poly([a, b, c]) + " = 0", "D = " + ms(b) + "² − 4·" + ms(a) + "·" + ms(c) + " = " + (b * b - 4 * a * c), "x₁ = " + ms(srt[0]) + ", x₂ = " + ms(srt[1])] };
    }
    if (k === 7) { // diskriminant va ildizlar soni
      a = pick([1, 2, -1]); b = RNZ(-8, 8); c = RNZ(-8, 8); D = b * b - 4 * a * c;
      var cnt = D > 0 ? 2 : D === 0 ? 1 : 0;
      return { q: "y = " + poly([a, b, c]) + " parabola x o'qini nechta nuqtada kesadi?", a: cnt, hint: "son",
        w: [0, 1, 2, 3].filter(function (v) { return v !== cnt; }), kind: "ildiz-soni",
        steps: ["D = b² − 4ac = " + (b * b) + " − 4·" + ms(a) + "·" + ms(c) + " = " + D, D > 0 ? "D > 0 → 2 nuqta" : D === 0 ? "D = 0 → 1 nuqta" : "D < 0 → kesmaydi (0)"] };
    }
    if (k === 8) { // eng kichik/katta qiymat
      a = pick([1, 2, -1, -2, 3]); x0 = RNZ(-5, 5); y0 = R(-10, 10);
      b = -2 * a * x0; c = a * x0 * x0 + y0;
      var mn = a > 0;
      return { q: "y = " + poly([a, b, c]) + " funksiyaning eng " + (mn ? "kichik" : "katta") + " qiymatini toping.",
        a: y0, hint: "son", w: nearW(y0, 6), kind: "ekstremum",
        steps: ["a = " + ms(a) + (mn ? " > 0 → uchida eng kichik qiymat" : " < 0 → uchida eng katta qiymat"),
          "x₀ = −b/(2a) = " + x0, "y₀ = f(" + ms(x0) + ") = " + y0] };
    }
    if (k === 9) { // kanonik ko'rinish
      a = pick([1, 2, -1, -3]); var m = RNZ(-5, 5), n = R(-9, 9);
      return { q: "y = " + (a === 1 ? "" : a === -1 ? "−" : ms(a)) + "(x " + (m > 0 ? "− " + m : "+ " + (-m)) + ")² " + (n >= 0 ? "+ " + n : "− " + (-n)) + " parabolaning uchini toping.",
        a: "(" + ms(m) + "; " + ms(n) + ")", hint: "(x₀; y₀)", w: pairW(m, n, 6), type: "text", kind: "kanonik",
        steps: ["y = a(x − m)² + n ko'rinishida uchi (m; n)", "Uchi: (" + ms(m) + "; " + ms(n) + ")"] };
    }
    if (k === 10) { // monotonlik
      a = pick([1, 2, -1, -2]); x0 = RNZ(-5, 5); b = -2 * a * x0; c = R(-9, 9);
      var osh = a > 0 ? "[" + ms(x0) + "; +∞)" : "(−∞; " + ms(x0) + "]";
      return { q: "y = " + poly([a, b, c]) + " funksiya qaysi oraliqda <b>o'suvchi</b>?", a: osh, hint: "oraliq", type: "text", kind: "monoton",
        w: [a > 0 ? "(−∞; " + ms(x0) + "]" : "[" + ms(x0) + "; +∞)", "(−∞; +∞)", "[" + ms(-x0) + "; +∞)", "(−∞; " + ms(-x0) + "]"],
        steps: ["x₀ = −b/(2a) = " + x0, a > 0 ? "a > 0 → uchidan o'ngda o'sadi" : "a < 0 → uchidan chapda o'sadi", "Javob: " + osh] };
    }
    if (k === 11) { // qiymatlar sohasi
      a = pick([1, 2, -1, -2]); x0 = RNZ(-5, 5); y0 = R(-9, 9); b = -2 * a * x0; c = a * x0 * x0 + y0;
      var E = a > 0 ? "[" + ms(y0) + "; +∞)" : "(−∞; " + ms(y0) + "]";
      return { q: "y = " + poly([a, b, c]) + " funksiyaning qiymatlar sohasini (E(y)) toping.", a: E, hint: "oraliq", type: "text", kind: "soha",
        w: [a > 0 ? "(−∞; " + ms(y0) + "]" : "[" + ms(y0) + "; +∞)", "(−∞; +∞)", "[" + ms(x0) + "; +∞)", "(−∞; " + ms(-y0) + "]"],
        steps: ["Uchi: (" + x0 + "; " + y0 + ")", a > 0 ? "Shoxlari yuqoriga → y ≥ " + y0 : "Shoxlari pastga → y ≤ " + y0, "E(y) = " + E] };
    }
    if (k === 12) { // nollar bo'yicha funksiya tuzish
      x1 = RNZ(-6, 6); x2 = RNZ(-6, 6); if (x1 === x2) x2 = x1 + 2;
      b = -(x1 + x2); c = x1 * x2;
      return { q: "Nollari x₁ = " + ms(x1) + " va x₂ = " + ms(x2) + " bo'lgan y = x² + bx + c funksiyada b va c ni toping.",
        a: ms(b) + "; " + ms(c), hint: "b; c", type: "text", kind: "tuzish",
        w: shuffle([ms(-b) + "; " + ms(c), ms(b) + "; " + ms(-c), ms(-b) + "; " + ms(-c), ms(x1) + "; " + ms(x2), ms(b + 1) + "; " + ms(c)]).slice(0, 5),
        steps: ["Vyet: x₁ + x₂ = −b → b = −(" + ms(x1) + " + " + ms(x2) + ") = " + ms(b),
          "x₁·x₂ = c → c = " + ms(x1) + "·" + ms(x2) + " = " + ms(c)] };
    }
    // k === 13: f(x) = k tenglamasining ildizlari soni
    a = pick([1, -1, 2, -2]); x0 = RNZ(-4, 4); y0 = R(-8, 8); b = -2 * a * x0; c = a * x0 * x0 + y0;
    var kk = y0 + pick([-3, -1, 0, 0, 2, 5]);
    var n2 = (kk === y0) ? 1 : ((a > 0 && kk > y0) || (a < 0 && kk < y0)) ? 2 : 0;
    return { q: "y = " + poly([a, b, c]) + " bo'lsa, f(x) = " + ms(kk) + " tenglamasi nechta ildizga ega?", a: n2, hint: "son",
      w: [0, 1, 2, 3].filter(function (v) { return v !== n2; }), kind: "kesish",
      steps: ["Uchi: (" + x0 + "; " + y0 + "), a = " + ms(a) + (a > 0 ? " (shoxlar yuqoriga)" : " (shoxlar pastga)"),
        "y = " + ms(kk) + " gorizontal to'g'ri chiziq uch qiymati " + ms(y0) + " bilan solishtiriladi",
        n2 === 1 ? "To'g'ri chiziq uchidan o'tadi → 1 ildiz" : n2 === 2 ? "To'g'ri chiziq parabolani 2 joyda kesadi → 2 ildiz" : "Kesishmaydi → ildiz yo'q (0)"] };
  }

  /* ---------- ro'yxatga olish ---------- */
  var REG = { t1: t1 };
  var TITLES = { t1: "Kvadrat funksiya va uning grafigi" };

  // noto'g'ri variantlarni tozalash: javobga teng yoki takroriy variantlarni olib tashlaymiz
  function clean(p) {
    var A = String(p.a), seen = {}, out = [];
    (p.w || []).forEach(function (w) {
      var s = String(w);
      if (s === A || s === "" || s === "NaN" || s === "undefined" || seen[s]) return;
      seen[s] = 1; out.push(s);
    });
    if (out.length < 3) {
      var base = parseFloat(A);
      if (!isNaN(base) && /^-?\d+(\.\d+)?$/.test(A)) {
        nearW(base, 6).forEach(function (v) {
          var s = String(v); if (out.length >= 5 || s === A || seen[s]) return; seen[s] = 1; out.push(s);
        });
      }
    }
    p.w = out;
    return p;
  }

  function get(id, level) {
    var f = REG[id]; if (!f) return null;
    var L = level ? level : pick([1, 2, 3]);
    var p = clean(f(L)); p.level = L; p.topic = id;
    return p;
  }
  // Yondosh mavzular: mavzuning o'z savollari tugasa, shu guruhdan savol qo'shiladi
  var GROUPS = {
    t3: ["t68", "t31", "t29"], t29: ["t31", "t68", "t3"], t30: ["t33", "t69", "t29"], t31: ["t3", "t68", "t29"],
    t33: ["t69", "t34", "t35"], t34: ["t33", "t69", "t35"], t35: ["t33", "t69", "t36"], t36: ["t33", "t35", "t69"],
    t68: ["t3", "t31", "t29"], t69: ["t33", "t34", "t35"],
    t19: ["t22", "t25", "t21", "a6"], t20: ["t23", "t26", "t67"], t21: ["t28", "t67", "a6"], t22: ["t19", "t25", "t24"],
    t23: ["t20", "t26", "t67"], t24: ["t22", "t23", "t28"], t25: ["t22", "t19", "t26"], t26: ["t23", "t20", "t25"],
    t27: ["t19", "t22", "t56"], t28: ["t21", "t67", "t20"], t67: ["t20", "t23", "t21"],
    t7: ["t1", "t6", "t5"], t16: ["t62", "t64", "t15"], t37: ["t39", "t38"], t38: ["t37", "t39"],
    t41: ["t40", "t44"], t42: ["t43", "t46", "t49"], t43: ["t42", "t48", "t46"], t45: ["t44", "t42"],
    t46: ["t47", "t43", "t42"], t47: ["t46", "t43", "t48"], t48: ["t43", "t49", "t46"], t49: ["t48", "t43", "t42"],
    t50: ["t45", "t42", "t44"], t53: ["t2", "t12", "a8"], t56: ["a5", "t57"], t57: ["t56", "a5"],
    t60: ["t70", "t59"], t62: ["a6", "t16", "t18"], t65: ["t20", "t15", "t6"], t70: ["t60", "t59"],
    a6: ["t19", "t62", "a3"], a7: ["a3", "a4"]
  };

  function pack(id, level, n) {
    var f = REG[id]; if (!f) return [];
    var out = [], seen = {};
    function lvlFor() { return level ? level : (out.length * 3 < n ? 1 : out.length * 3 < 2 * n ? 2 : 3); }
    function tryAdd(fn, src, L) {
      var p = clean(fn(L)); if (seen[p.q]) return false;
      seen[p.q] = 1; p.level = L; p.topic = src; out.push(p); return true;
    }
    var t = 0;
    while (out.length < n && t++ < n * 30) tryAdd(f, id, lvlFor());
    // o'z savollari tugadi — yondosh mavzulardan to'ldiramiz
    var grp = (GROUPS[id] || []).filter(function (g) { return REG[g]; });
    for (var gi = 0; gi < grp.length && out.length < n; gi++) {
      var gf = REG[grp[gi]], t2 = 0;
      while (out.length < n && t2++ < n * 20) tryAdd(gf, grp[gi], lvlFor());
    }
    // hali ham yetmasa — takroriga yo'l qo'yamiz (100 talik test uzilmasligi uchun)
    var t3 = 0;
    while (out.length < n && t3++ < n * 10) {
      var L = lvlFor(), p = clean(f(L)); p.level = L; p.topic = id; out.push(p);
    }
    if (!level) out.sort(function (a, b) { return a.level - b.level; });
    return out;
  }

  // mavzudan nechta <b>har xil</b> savol chiqishi mumkin (taxminiy)
  function sig(id, limit) {
    var f = REG[id]; if (!f) return 0;
    var seen = {}, c = 0;
    for (var i = 0; i < (limit || 400); i++) { var q = f(((i % 3) + 1)).q; if (!seen[q]) { seen[q] = 1; c++; } }
    return c;
  }

  window.kaSavol = {
    H: H,
    has: function (id) { return !!REG[id]; },
    title: function (id) { return TITLES[id] || id; },
    ids: function () { return Object.keys(REG); },
    register: function (id, fn, title) { REG[id] = fn; if (title) TITLES[id] = title; },
    registerAll: function (obj, titles) { for (var k in obj) REG[k] = obj[k]; if (titles) for (var t in titles) TITLES[t] = titles[t]; },
    get: get,
    pack: pack,
    sig: sig
  };
})();
