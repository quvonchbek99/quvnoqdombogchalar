/*!
 * Kuvonch Academy — avtomatik mashq generatori
 * Har bir mavzuga "🔄 Yangi misollar" bloki qo'shadi: misol turi (ma'nosi) saqlanadi,
 * sonlar har safar yangidan tanlanadi, javob kompyuter tomonidan hisoblanib tekshiriladi.
 * Shuningdek, arifmetik test savollaridagi sonlarni har ochilishda yangilaydi.
 * Internet ham, server ham, API kalit ham kerak emas.
 * Ulash: <script src="mashq-generator.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaGen) return;
  window.__kaGen = true;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function RNZ(a, b) { var v; do { v = R(a, b); } while (v === 0); return v; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function frac(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
  // Ko'phad yozuvi: [a,b,c] -> "2x² − 3x + 1"
  function poly(cs, v) {
    v = v || "x";
    var deg = cs.length - 1, out = "";
    cs.forEach(function (c, i) {
      var p = deg - i;
      if (c === 0) return;
      var sign = c < 0 ? " − " : (out ? " + " : "");
      if (!out && c < 0) sign = "−";
      var ac = Math.abs(c);
      var coef = (ac === 1 && p > 0) ? "" : String(ac);
      var term = p === 0 ? String(ac) : coef + v + (p === 1 ? "" : (p === 2 ? "²" : p === 3 ? "³" : "^" + p));
      out += sign + term;
    });
    return out || "0";
  }
  function sgn(n) { return n < 0 ? "− " + (-n) : "+ " + n; }
  function par(n) { return n < 0 ? "(" + n + ")" : String(n); }

  // ---------- Javobni tekshirish ----------
  function parseNum(s) {
    s = String(s).trim().replace(/,/g, ".").replace(/[−–—]/g, "-").replace(/\s+/g, "");
    if (!s) return NaN;
    var m = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(s);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    if (/^-?\d*\.?\d+$/.test(s)) return parseFloat(s);
    return NaN;
  }
  function splitAns(s) { return String(s).replace(/[()\[\]{}]/g, " ").split(/[;\s]+|,\s+|va/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function near(a, b) { return Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)); }
  // ans: son yoki sonlar massivi; ordered=true bo'lsa tartib muhim (x; y)
  function check(input, ans, ordered) {
    var want = Array.isArray(ans) ? ans : [ans];
    var got = want.length === 1 ? [parseNum(String(input).replace(/^\s*[a-z]\s*=\s*/i, ""))] :
      splitAns(String(input).replace(/[a-z]\s*[₀-₉0-9]*\s*=\s*/gi, " ")).map(parseNum);
    if (got.length !== want.length || got.some(isNaN)) return false;
    if (ordered) return want.every(function (w, i) { return near(got[i], w); });
    var used = [];
    return want.every(function (w) {
      for (var i = 0; i < got.length; i++) if (!used[i] && near(got[i], w)) { used[i] = 1; return true; }
      return false;
    });
  }

  // ---------- Generatorlar ----------
  // Har biri: { q: savol (HTML), a: javob, ordered, hint: javob formati, steps: [yechim qadamlari] }
  var G = {
    vertex: function () {
      var a = pick([1, 1, 2, -1, -2, 3]), x0 = R(-5, 5), y0 = R(-9, 9);
      var b = -2 * a * x0, c = a * x0 * x0 + y0;
      return { q: "y = " + poly([a, b, c]) + " parabola uchining koordinatalarini toping.", a: [x0, y0], ordered: true, hint: "x₀; y₀",
        steps: ["x₀ = −b/(2a) = " + (-b) + "/" + par(2 * a) + " = " + x0, "y₀ = y(" + x0 + ") = " + y0, "Javob: (" + x0 + "; " + y0 + ")"] };
    },
    shift: function () {
      var h = RNZ(-6, 6), k = RNZ(-6, 6), a = pick([1, 2, -1, 3]);
      var f = (a === 1 ? "" : a === -1 ? "−" : a) + "(x " + sgn(-h) + ")² " + sgn(k);
      return { q: "y = " + f + " grafigi y = " + (a === 1 ? "" : a === -1 ? "−" : a) + "x² grafigini siljitishdan hosil bo'lgan. Parabola uchini toping.", a: [h, k], ordered: true, hint: "x₀; y₀",
        steps: ["y = a(x − m)² + n ko'rinishida uch (m; n) nuqtada", "m = " + h + ", n = " + k, "Javob: (" + h + "; " + k + ")"] };
    },
    quadIneq: function () {
      var p = R(-6, 3), q = p + R(2, 7), s = p + q, pr = p * q, lt = Math.random() < 0.6;
      var cnt = lt ? q - p - 1 : null;
      if (lt) return { q: poly([1, -s, pr]) + " < 0 tengsizlikning butun yechimlari nechta?", a: cnt, hint: "son",
        steps: ["Ildizlar: x₁ = " + p + ", x₂ = " + q, "a > 0, demak yechim: " + p + " < x < " + q, "Butun sonlar: " + (q - p - 1) + " ta"] };
      var lo = R(-10, p - 1);
      return { q: poly([1, -s, pr]) + " ≤ 0 tengsizlikning eng katta butun yechimini toping.", a: q, hint: "son",
        steps: ["Ildizlar: x₁ = " + p + ", x₂ = " + q, "Yechim: [" + p + "; " + q + "]", "Eng katta butun yechim: " + q] };
    },
    trig: function () {
      var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
      var k = R(0, 2);
      if (k === 0) return { q: "sin α = " + t[0] + "/" + t[2] + " va α — I chorak burchagi. cos α ni toping.", a: t[1] / t[2], hint: "kasr, masalan 4/5",
        steps: ["cos²α = 1 − sin²α = 1 − " + t[0] * t[0] + "/" + t[2] * t[2] + " = " + t[1] * t[1] + "/" + t[2] * t[2], "I chorakda cos α > 0", "cos α = " + t[1] + "/" + t[2]] };
      if (k === 1) return { q: "cos α = " + t[1] + "/" + t[2] + " va α — I chorak burchagi. tg α ni toping.", a: t[0] / t[1], hint: "kasr",
        steps: ["sin α = √(1 − cos²α) = " + t[0] + "/" + t[2], "tg α = sin α / cos α = " + t[0] + "/" + t[1]] };
      var ang = pick([[30, "sin", 0.5, "1/2"], [60, "cos", 0.5, "1/2"], [45, "tg", 1, "1"], [0, "cos", 1, "1"], [90, "sin", 1, "1"], [180, "cos", -1, "−1"]]);
      var m = R(2, 6), n = R(1, 5);
      return { q: m + "·" + ang[1] + " " + ang[0] + "° + " + n + " ifodaning qiymatini toping.", a: m * ang[2] + n, hint: "son",
        steps: [ang[1] + " " + ang[0] + "° = " + ang[3], m + "·" + ang[3] + " + " + n + " = " + (m * ang[2] + n)] };
    },
    progression: function () {
      var k = R(0, 3);
      if (k === 0) { var a1 = R(-10, 15), d = RNZ(-5, 6), n = R(6, 20), an = a1 + (n - 1) * d;
        return { q: "Arifmetik progressiyada a₁ = " + a1 + ", d = " + d + ". a<sub>" + n + "</sub> ni toping.", a: an, hint: "son",
          steps: ["aₙ = a₁ + (n − 1)d", "a" + n + " = " + a1 + " + " + (n - 1) + "·" + par(d) + " = " + an] }; }
      if (k === 1) { var b1 = R(-5, 12), dd = RNZ(-4, 6), nn = R(5, 15), s = nn * (2 * b1 + (nn - 1) * dd) / 2;
        return { q: "Arifmetik progressiyada a₁ = " + b1 + ", d = " + dd + ". Dastlabki " + nn + " ta hadining yig'indisini toping.", a: s, hint: "son",
          steps: ["Sₙ = (2a₁ + (n − 1)d)·n / 2", "S" + nn + " = (" + 2 * b1 + " + " + (nn - 1) * dd + ")·" + nn + "/2 = " + s] }; }
      if (k === 2) { var g1 = R(1, 5) * pick([1, -1]), qq = pick([2, 3, -2, 2]), m = R(3, 6), gn = g1 * Math.pow(qq, m - 1);
        return { q: "Geometrik progressiyada b₁ = " + g1 + ", q = " + qq + ". b<sub>" + m + "</sub> ni toping.", a: gn, hint: "son",
          steps: ["bₙ = b₁·qⁿ⁻¹", "b" + m + " = " + g1 + "·" + par(qq) + "^" + (m - 1) + " = " + gn] }; }
      var c1 = R(1, 4), q2 = pick([2, 3]), m2 = R(3, 6), s2 = c1 * (Math.pow(q2, m2) - 1) / (q2 - 1);
      return { q: "Geometrik progressiyada b₁ = " + c1 + ", q = " + q2 + ". Dastlabki " + m2 + " ta hadi yig'indisini toping.", a: s2, hint: "son",
        steps: ["Sₙ = b₁(qⁿ − 1)/(q − 1)", "S" + m2 + " = " + c1 + "·(" + Math.pow(q2, m2) + " − 1)/" + (q2 - 1) + " = " + s2] };
    },
    fvalue: function () {
      var a = RNZ(-3, 3), b = R(-6, 6), c = R(-9, 9), x = R(-4, 4), v = a * x * x + b * x + c;
      return { q: "f(x) = " + poly([a, b, c]) + " bo'lsa, f(" + x + ") ni toping.", a: v, hint: "son",
        steps: ["f(" + x + ") = " + a + "·" + par(x) + "² " + sgn(b) + "·" + par(x) + " " + sgn(c), "= " + v] };
    },
    zeros: function () {
      var r1 = R(-6, 6), r2; do { r2 = R(-6, 6); } while (r2 === r1);
      return { q: "f(x) = " + poly([1, -(r1 + r2), r1 * r2]) + " funksiyaning nollarini toping.", a: [r1, r2], hint: "x₁; x₂",
        steps: ["f(x) = 0 tenglamani yechamiz", "(x " + sgn(-r1) + ")(x " + sgn(-r2) + ") = 0", "x₁ = " + r1 + ", x₂ = " + r2] };
    },
    linearModel: function () {
      var A = R(3, 9) * 1000, B = R(2, 6) * 500, n = R(3, 15), T = A + B * n;
      return { q: "Taksi xizmati: chaqiruv " + A + " so'm, har bir km uchun " + B + " so'm. " + n + " km yo'l necha so'm turadi? (y = kx + b model)", a: T, hint: "son",
        steps: ["y = " + B + "x + " + A, "y(" + n + ") = " + B + "·" + n + " + " + A + " = " + T] };
    },
    linEq: function () {
      var x = R(-9, 12), a = RNZ(-6, 8), b = R(-20, 20), c = a * x + b;
      return { q: poly([a, b]) + " = " + c + " tenglamani yeching.", a: x, hint: "x",
        steps: [a + "x = " + c + " " + sgn(-b) + " = " + (c - b), "x = " + (c - b) + " : " + par(a) + " = " + x] };
    },
    ratEq: function () {
      var x, b, c, a;
      do { x = R(-8, 10); b = R(-6, 6); c = RNZ(-3, 4); a = c * (x + b) - x; } while (x + b === 0 || c === 1 || x + a === 0);
      return { q: "(x " + sgn(a) + ") / (x " + sgn(b) + ") = " + c + " tenglamani yeching.", a: x, hint: "x",
        steps: ["Maxraj x " + sgn(b) + " ≠ 0", "x " + sgn(a) + " = " + c + "(x " + sgn(b) + ")", "x − " + par(c) + "x = " + (c * b) + " " + sgn(-a), "x = " + x] };
    },
    system: function () {
      var x = R(-6, 8), y = R(-6, 8), a = RNZ(-3, 4), b = RNZ(-3, 4), c = RNZ(-3, 4), d = RNZ(-3, 4);
      if (a * d - b * c === 0) d = d + 1 || 2;
      if (a * d - b * c === 0) return G.system();
      var e = a * x + b * y, f = c * x + d * y;
      return { q: "Sistemani yeching: { " + poly([a, 0]).replace("x", "x") + " " + (b < 0 ? "− " : "+ ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "y = " + e + " ;  " +
        poly([c, 0]) + " " + (d < 0 ? "− " : "+ ") + (Math.abs(d) === 1 ? "" : Math.abs(d)) + "y = " + f + " }", a: [x, y], ordered: true, hint: "x; y",
        steps: ["Δ = " + a + "·" + par(d) + " − " + par(b) + "·" + par(c) + " = " + (a * d - b * c), "x = " + x + ", y = " + y, "Tekshirish: " + a + "·" + par(x) + " + " + par(b) + "·" + par(y) + " = " + e] };
    },
    ratIneq: function () {
      var p = R(-6, 4), q = p + R(2, 7), cnt = q - p;
      return { q: "(x " + sgn(-p) + ") / (x " + sgn(-q) + ") ≤ 0 tengsizlikning butun yechimlari nechta?", a: cnt, hint: "son",
        steps: ["Nollar: x = " + p + " (kiradi), x = " + q + " (maxraj, kirmaydi)", "Oraliqlar usuli: [" + p + "; " + q + ")", "Butun yechimlar: " + p + ", …, " + (q - 1) + " — " + cnt + " ta"] };
    },
    ineqSystem: function () {
      var a = R(-6, 2), b = a + R(2, 8);
      var k1 = R(2, 5), k2 = R(2, 5);
      return { q: "Sistemaning butun yechimlari nechta: { " + k1 + "x > " + k1 * a + " ;  " + k2 + "x ≤ " + k2 * b + " }", a: b - a, hint: "son",
        steps: ["1-tengsizlik: x > " + a, "2-tengsizlik: x ≤ " + b, "Yechim: (" + a + "; " + b + "]", "Butun sonlar: " + (b - a) + " ta"] };
    },
    vieta: function () {
      var r1 = R(-7, 7), r2 = R(-7, 7), p = -(r1 + r2), q = r1 * r2, k = R(0, 2);
      var eq = poly([1, p, q]) + " = 0";
      if (k === 0) return { q: eq + " tenglama ildizlari yig'indisini toping.", a: r1 + r2, hint: "son", steps: ["Viyet: x₁ + x₂ = −p = " + (r1 + r2)] };
      if (k === 1) return { q: eq + " tenglama ildizlari ko'paytmasini toping.", a: q, hint: "son", steps: ["Viyet: x₁·x₂ = q = " + q] };
      return { q: eq + " tenglama ildizlari kvadratlari yig'indisini toping (x₁² + x₂²).", a: r1 * r1 + r2 * r2, hint: "son",
        steps: ["x₁ + x₂ = " + (r1 + r2) + ", x₁·x₂ = " + q, "x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = " + (r1 + r2) * (r1 + r2) + " − " + par(2 * q) + " = " + (r1 * r1 + r2 * r2)] };
    },
    quadEq: function () {
      var r1 = R(-8, 8), r2 = R(-8, 8), a = pick([1, 1, 2, -1]);
      return { q: poly([a, -a * (r1 + r2), a * r1 * r2]) + " = 0 tenglamani yeching.", a: r1 === r2 ? r1 : [r1, r2], hint: r1 === r2 ? "x" : "x₁; x₂",
        steps: ["D = b² − 4ac = " + (a * a * (r1 - r2) * (r1 - r2)), "x = (−b ± √D)/(2a)", r1 === r2 ? "x = " + r1 : "x₁ = " + r1 + ", x₂ = " + r2] };
    },
    irrational: function () {
      var b = R(1, 9), a = R(-10, 12), x = b * b - a;
      return { q: "√(x " + sgn(a) + ") = " + b + " tenglamani yeching.", a: x, hint: "x",
        steps: ["Ikkala tomonni kvadratga ko'taramiz: x " + sgn(a) + " = " + b * b, "x = " + x, "Tekshirish: √(" + (x + a) + ") = " + b + " ✓"] };
    },
    modulus: function () {
      var a = R(-6, 8), b = R(1, 9), k = R(0, 1);
      if (k === 0) return { q: "|x " + sgn(-a) + "| = " + b + " tenglamani yeching.", a: [a - b, a + b], hint: "x₁; x₂",
        steps: ["x " + sgn(-a) + " = " + b + " yoki x " + sgn(-a) + " = −" + b, "x₁ = " + (a + b) + ", x₂ = " + (a - b)] };
      return { q: "|x " + sgn(-a) + "| < " + b + " tengsizlikning butun yechimlari nechta?", a: 2 * b - 1, hint: "son",
        steps: ["−" + b + " < x " + sgn(-a) + " < " + b, (a - b) + " < x < " + (a + b), "Butun sonlar: " + (2 * b - 1) + " ta"] };
    },
    shortMul: function () {
      var k = R(0, 2), n = pick([10, 20, 30, 50, 100]), d = R(1, 4);
      if (k === 0) { var v = n + d; return { q: v + "² ni qisqa ko'paytirish formulasi yordamida hisoblang.", a: v * v, hint: "son",
        steps: ["(" + n + " + " + d + ")² = " + n + "² + 2·" + n + "·" + d + " + " + d + "²", "= " + n * n + " + " + 2 * n * d + " + " + d * d + " = " + v * v] }; }
      if (k === 1) return { q: (n + d) + "·" + (n - d) + " ni hisoblang.", a: n * n - d * d, hint: "son",
        steps: ["(a + b)(a − b) = a² − b²", n + "² − " + d + "² = " + n * n + " − " + d * d + " = " + (n * n - d * d)] };
      var a = R(2, 9), b = R(1, 9);
      return { q: "(x + " + b + ")² − (x − " + b + ")² ifodani soddalashtiring va x = " + a + " dagi qiymatini toping.", a: 4 * b * a, hint: "son",
        steps: ["(x + b)² − (x − b)² = 4bx = " + 4 * b + "x", "x = " + a + ": " + 4 * b * a] };
    },
    factor: function () {
      var m = RNZ(-8, 8), n = RNZ(-8, 8);
      return { q: poly([1, m + n, m * n]) + " = (x + m)(x + n) ko'rinishda ko'paytuvchilarga ajrating. m va n ni toping.", a: [m, n], hint: "m; n",
        steps: ["m + n = " + (m + n) + ", m·n = " + m * n, "m = " + m + ", n = " + n, poly([1, m + n, m * n]) + " = (x " + sgn(m) + ")(x " + sgn(n) + ")"] };
    },
    percent: function () {
      var k = R(0, 3);
      if (k === 0) { var p = pick([5, 10, 12, 15, 20, 25, 30, 40, 75]), N = R(2, 40) * 20; return { q: N + " ning " + p + "% ini toping.", a: N * p / 100, hint: "son",
        steps: [N + " · " + p + "/100 = " + N * p / 100] }; }
      if (k === 1) { var pr = R(4, 40) * 5000, up = pick([10, 20, 25, 15]); return { q: "Mahsulot narxi " + pr + " so'm edi, " + up + "% ga oshdi. Yangi narx qancha?", a: pr * (100 + up) / 100, hint: "son",
        steps: [pr + " · (1 + " + up / 100 + ") = " + pr * (100 + up) / 100] }; }
      if (k === 2) { var a = R(2, 9), b = R(2, 9), t = (a + b) * R(3, 12); return { q: "Ikki son " + a + " : " + b + " nisbatda, yig'indisi " + t + ". Kattasini toping.", a: t / (a + b) * Math.max(a, b), hint: "son",
        steps: ["1 ulush = " + t + " : " + (a + b) + " = " + t / (a + b), "Kattasi: " + Math.max(a, b) + " · " + t / (a + b) + " = " + t / (a + b) * Math.max(a, b)] }; }
      var x = R(2, 12), y = R(2, 9), z = R(2, 9) * x;
      return { q: "Proporsiyadan x ni toping: " + x + " : " + y + " = " + z + " : x", a: y * z / x, hint: "son",
        steps: ["Chetki hadlar ko'paytmasi = o'rta hadlar ko'paytmasi", x + "·x = " + y + "·" + z, "x = " + y * z / x] };
    },
    means: function () {
      var k = R(0, 1);
      if (k === 0) { var n = R(4, 6), arr = [], s = 0; for (var i = 0; i < n - 1; i++) { var v = R(2, 30); arr.push(v); s += v; }
        var mean = R(8, 25), last = mean * n - s; if (last < 0) return G.means(); arr.push(last);
        return { q: "Sonlarning o'rta arifmetigini toping: " + arr.join("; "), a: mean, hint: "son", steps: ["Yig'indi: " + mean * n, "O'rta arifmetik: " + mean * n + " : " + n + " = " + mean] }; }
      var a = R(1, 6), b = R(1, 6), A = a * a * pick([1, 4]), B = b * b * (A % 4 === 0 ? 1 : 4);
      var gm = Math.sqrt(A * B);
      if (!Number.isInteger(gm)) return G.means();
      return { q: A + " va " + B + " sonlarining o'rta geometrigini toping.", a: gm, hint: "son", steps: ["√(" + A + "·" + B + ") = √" + A * B + " = " + gm] };
    },
    gcdlcm: function () {
      var g = pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 15]), a = g * R(2, 9), b; do { b = g * R(2, 9); } while (b === a);
      if (Math.random() < 0.5) return { q: "EKUB(" + a + "; " + b + ") ni toping.", a: gcd(a, b), hint: "son", steps: ["Tub ko'paytuvchilarga ajrating va umumiylarini oling", "EKUB = " + gcd(a, b)] };
      return { q: "EKUK(" + a + "; " + b + ") ni toping.", a: lcm(a, b), hint: "son", steps: ["EKUK = a·b / EKUB = " + a * b + " / " + gcd(a, b) + " = " + lcm(a, b)] };
    },
    det: function () {
      var a = R(-6, 9), b = R(-6, 9), c = R(-6, 9), d = R(-6, 9);
      return { q: "Determinantni hisoblang: | " + a + "  " + b + " ; " + c + "  " + d + " |", a: a * d - b * c, hint: "son",
        steps: ["Δ = a·d − b·c", "= " + a + "·" + par(d) + " − " + par(b) + "·" + par(c) + " = " + (a * d - b * c)] };
    },
    log: function () {
      var k = R(0, 2), a = pick([2, 3, 5, 10]), n = R(1, a === 2 ? 7 : 4);
      if (k === 0) return { q: "log<sub>" + a + "</sub> " + Math.pow(a, n) + " ni hisoblang.", a: n, hint: "son", steps: [Math.pow(a, n) + " = " + a + "^" + n, "Javob: " + n] };
      if (k === 1) { var m = R(1, a === 2 ? 5 : 3); return { q: "log<sub>" + a + "</sub> " + Math.pow(a, n) + " + log<sub>" + a + "</sub> " + Math.pow(a, m) + " ni hisoblang.", a: n + m, hint: "son", steps: ["logₐx + logₐy = logₐ(xy)", "= " + n + " + " + m + " = " + (n + m)] }; }
      var c = R(1, 3); return { q: "log<sub>" + a + "</sub>(x " + sgn(-c) + ") = " + n + " tenglamani yeching.", a: Math.pow(a, n) + c, hint: "x",
        steps: ["x " + sgn(-c) + " = " + a + "^" + n + " = " + Math.pow(a, n), "x = " + (Math.pow(a, n) + c)] };
    },
    expEq: function () {
      var a = pick([2, 3, 5]), x = R(-3, 5), b = R(-3, 3), c = x + b;
      return { q: a + "<sup>x " + sgn(b) + "</sup> = " + (c >= 0 ? Math.pow(a, c) : "1/" + Math.pow(a, -c)) + " tenglamani yeching.", a: x, hint: "x",
        steps: ["O'ng tomonni " + a + " asosida yozamiz: " + a + "^" + c, "x " + sgn(b) + " = " + c, "x = " + x] };
    },
    power: function () {
      var a = R(2, 5), m = R(2, 6), n = R(1, 4), k = R(0, 1);
      if (k === 0) return { q: a + "<sup>" + m + "</sup> · " + a + "<sup>" + n + "</sup> : " + a + "<sup>" + (m + n - 1) + "</sup> ni hisoblang.", a: a, hint: "son", steps: ["aᵐ·aⁿ : aᵏ = a^(m+n−k) = " + a + "^1 = " + a] };
      var b = R(2, 12); return { q: b + "² − " + (b - 1) + "² ni hisoblang.", a: b * b - (b - 1) * (b - 1), hint: "son", steps: [b * b + " − " + (b - 1) * (b - 1) + " = " + (2 * b - 1)] };
    },
    derivative: function () {
      var a = RNZ(-3, 3), b = R(-5, 5), c = R(-6, 6), x = R(-3, 3), v = 3 * a * x * x + 2 * b * x + c;
      return { q: "f(x) = " + poly([a, b, c, R(-5, 5)]) + " bo'lsa, f′(" + x + ") ni toping.", a: v, hint: "son",
        steps: ["f′(x) = " + poly([3 * a, 2 * b, c]), "f′(" + x + ") = " + v] };
    },
    integral: function () {
      var a = R(1, 4) * 2, b = R(-3, 5), k = R(1, 4), v = a * k * k / 2 + b * k;
      return { q: "∫₀<sup>" + k + "</sup> (" + poly([a, b]) + ") dx ni hisoblang.", a: v, hint: "son",
        steps: ["Boshlang'ich funksiya: F(x) = " + poly([a / 2, b, 0]), "F(" + k + ") − F(0) = " + v] };
    },
    pythag: function () {
      var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]]), m = R(1, 3);
      return { q: "To'g'ri burchakli uchburchak katetlari " + t[0] * m + " va " + t[1] * m + ". Gipotenuzani toping.", a: t[2] * m, hint: "son",
        steps: ["c² = a² + b² = " + t[0] * t[0] * m * m + " + " + t[1] * t[1] * m * m + " = " + t[2] * t[2] * m * m, "c = " + t[2] * m] };
    },
    area: function () {
      var k = R(0, 2), a = R(3, 15), b = R(3, 15);
      if (k === 0) return { q: "Uchburchak asosi " + a * 2 + " sm, balandligi " + b + " sm. Yuzini toping (sm²).", a: a * b, hint: "son", steps: ["S = ½·a·h = ½·" + a * 2 + "·" + b + " = " + a * b] };
      if (k === 1) return { q: "To'g'ri to'rtburchak tomonlari " + a + " va " + b + " sm. Perimetri va yuzini toping.", a: [2 * (a + b), a * b], ordered: true, hint: "P; S",
        steps: ["P = 2(a + b) = " + 2 * (a + b), "S = a·b = " + a * b] };
      var c = R(2, 9); return { q: "Qirrasi " + c + " sm bo'lgan kubning hajmini toping (sm³).", a: c * c * c, hint: "son", steps: ["V = a³ = " + c + "³ = " + c * c * c] };
    },
    comb: function () {
      var k = R(0, 2), n = R(4, 8), r = R(2, Math.min(4, n - 1));
      var f = function (x) { return x <= 1 ? 1 : x * f(x - 1); };
      if (k === 0) return { q: n + "! ni hisoblang.", a: f(n), hint: "son", steps: [n + "! = " + Array.from({ length: n }, function (_, i) { return i + 1; }).join("·") + " = " + f(n)] };
      if (k === 1) return { q: "C<sub>" + n + "</sub><sup>" + r + "</sup> (" + n + " tadan " + r + " tadan kombinatsiyalar) ni hisoblang.", a: f(n) / (f(r) * f(n - r)), hint: "son",
        steps: ["C = n! / (k!(n − k)!)", "= " + f(n) + " / (" + f(r) + "·" + f(n - r) + ") = " + f(n) / (f(r) * f(n - r))] };
      var tot = R(10, 30), fav = R(1, tot - 1);
      return { q: "Qutida " + tot + " ta shar bor, ulardan " + fav + " tasi qizil. Tasodifan olingan shar qizil bo'lish ehtimolini toping.", a: fav / tot, hint: "kasr, masalan 3/10",
        steps: ["P = qulay / hammasi = " + fav + "/" + tot + " = " + frac(fav, tot)] };
    },
    // Asosiy amallar
    add: function () { var a = R(100, 999), b = R(100, 999); return { q: a + " + " + b + " ni hisoblang.", a: a + b, hint: "son", steps: [a + " + " + b + " = " + (a + b)] }; },
    sub: function () { var a = R(-60, 400), b = R(-80, 300); return { q: a + " − " + par(b) + " ni hisoblang.", a: a - b, hint: "son", steps: [a + " − " + par(b) + " = " + (a - b)] }; },
    mul: function () { var a = R(12, 99), b = R(3, 25); return { q: a + " × " + b + " ni hisoblang.", a: a * b, hint: "son", steps: [a + " × " + b + " = " + a * b] }; },
    div: function () { var b = R(3, 25), q = R(4, 60); return { q: b * q + " : " + b + " ni hisoblang.", a: q, hint: "son", steps: [b * q + " : " + b + " = " + q] }; },
    times: function () { var a = R(2, 9), b = R(2, 9); return { q: a + " × " + b + " = ?", a: a * b, hint: "son", steps: [a + " × " + b + " = " + a * b] }; }
  };

  // Mavzu nomi → generatorlar (kalit so'zlar bo'yicha). Birinchi mos kelgan qator olinadi.
  var MAP = [
    [/vi[eé]?t|vyet|viyet/i, ["vieta", "quadEq"]],
    [/irratsional/i, ["irrational"]],
    [/modul/i, ["modulus"]],
    [/determinant|kramer|matritsa/i, ["det", "system"]],
    [/sistema/i, [/tengsizlik/i, "ineqSystem", "system"]],
    [/ratsional\s+tengsizlik/i, ["ratIneq"]],
    [/ratsional\s+tenglama|kasr.*tenglama/i, ["ratEq"]],
    [/kvadrat\s+tengsizlik/i, ["quadIneq"]],
    [/kvadrat\s+tenglama/i, ["quadEq", "vieta"]],
    [/kvadrat\s+funksiya|parabola/i, ["vertex", "zeros", "fvalue"]],
    [/almashtir|siljit/i, ["shift"]],
    [/model/i, ["linearModel", "fvalue"]],
    [/xossa/i, ["zeros", "fvalue"]],
    [/funksiya/i, ["fvalue", "zeros"]],
    [/trigonometr|sinus|kosinus|burchak/i, ["trig"]],
    [/progressiya/i, ["progression"]],
    [/logarifm/i, ["log"]],
    [/ko'rsatkichli|ko‘rsatkichli|daraja/i, ["expEq", "power"]],
    [/hosila/i, ["derivative"]],
    [/integral|boshlang'ich/i, ["integral"]],
    [/qisqa\s+ko'paytirish/i, ["shortMul"]],
    [/ko'paytuvchi/i, ["factor"]],
    [/foiz|nisbat|proporsiya/i, ["percent"]],
    [/o'rta\s+qiymat|o'rtacha|statistik/i, ["means"]],
    [/bo'linish|ekub|ekuk|tub\s+son|natural/i, ["gcdlcm"]],
    [/pifagor|uchburchak/i, ["pythag", "area"]],
    [/yuz|hajm|perimetr|geometri|figura|ko'pburchak|to'rtburchak/i, ["area", "pythag"]],
    [/kombinator|ehtimol|faktorial/i, ["comb"]],
    [/chiziqli\s+tenglama|tenglama/i, ["linEq", "quadEq"]],
    [/tengsizlik/i, ["ineqSystem", "quadIneq"]],
    [/qo'shish/i, ["add"]], [/ayirish/i, ["sub"]], [/karra/i, ["times"]],
    [/ko'paytirish/i, ["mul"]], [/bo'lish/i, ["div"]]
  ];
  function norm(s) { return String(s).toLowerCase().replace(/[ʻʼ‘’`]/g, "'"); }
  function gensFor(title) {
    var t = norm(title);
    for (var i = 0; i < MAP.length; i++) {
      if (!MAP[i][0].test(t)) continue;
      var list = MAP[i][1];
      if (list[0] instanceof RegExp) { list = list[0].test(t) ? [list[1]] : [list[2]]; }
      return list;
    }
    return null;
  }

  // ---------- UI ----------
  var css = `
  .kg-box{margin:18px 0 6px;border:1px solid #2f4a7a;background:linear-gradient(180deg,rgba(124,155,255,.10),rgba(124,155,255,.03));border-radius:16px;padding:14px}
  .kg-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}
  .kg-head b{font-size:16px;color:#eef2ff;margin-right:auto}
  .kg-score{font:700 13px/1 ui-monospace,monospace;color:#5ee6c7;background:#0b1220;border:1px solid #243252;border-radius:999px;padding:6px 10px}
  .kg-btn{background:#111a2e;color:#eef2ff;border:1px solid #243252;border-radius:10px;padding:8px 12px;font:600 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer}
  .kg-btn.primary{background:#7c9bff;color:#0b1220;border-color:transparent}
  .kg-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
  .kg-item{background:#0e1628;border:1px solid #243252;border-radius:12px;padding:10px}
  .kg-item.ok{border-color:#5ee6c7}.kg-item.bad{border-color:#ff8585}
  .kg-q{color:#eef2ff;font-size:15px;line-height:1.45}
  .kg-q .n{color:#7c9bff;font-weight:800;margin-right:6px}
  .kg-row{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;align-items:center}
  .kg-row input{flex:1 1 140px;min-width:0;background:#0b1220;color:#eef2ff;border:1px solid #243252;border-radius:10px;padding:8px 10px;font:600 15px/1 ui-monospace,monospace;outline:none}
  .kg-row input:focus{border-color:#7c9bff}
  .kg-fb{font-size:13px;margin-top:6px;min-height:1em}
  .kg-fb.ok{color:#5ee6c7}.kg-fb.bad{color:#ff8585}
  .kg-steps{margin:6px 0 0;padding-left:18px;color:#c9d4ff;font-size:13.5px;display:none}
  .kg-steps.on{display:block}
  .kg-note{font-size:12px;color:#9fb0d0;margin-top:8px}
  `;
  document.head.appendChild(el("style", null, css));

  var COUNT = 5;
  function buildBox(sec, gens) {
    var box = el("div", { class: "kg-box" });
    box.innerHTML = '<div class="kg-head"><b>🔄 Yangi misollar — har safar boshqa sonlar</b><span class="kg-score">0/' + COUNT + '</span>' +
      '<button class="kg-btn primary" type="button" data-a="new">🔄 Yangi variant</button><button class="kg-btn" type="button" data-a="checkall">✅ Hammasini tekshirish</button></div>' +
      '<ol class="kg-list"></ol><div class="kg-note">Javob formati misol ostida ko\'rsatilgan. Bir nechta javob bo\'lsa nuqtali vergul bilan yozing: 2; −3. Kasrni 3/5 ko\'rinishida yozish mumkin.</div>';
    var list = $(".kg-list", box), score = $(".kg-score", box), items = [];

    function fresh() {
      list.innerHTML = ""; items = [];
      var seen = {};
      for (var i = 0; i < COUNT; i++) {
        var p, tries = 0;
        do { p = G[gens[(i + tries) % gens.length]](); tries++; } while (seen[p.q] && tries < 10);
        seen[p.q] = 1;
        items.push(p);
        var li = el("li", { class: "kg-item" });
        li.innerHTML = '<div class="kg-q"><span class="n">' + (i + 1) + '.</span>' + p.q + '</div>' +
          '<div class="kg-row"><input type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Javob: ' + p.hint + '" aria-label="Javob">' +
          '<button class="kg-btn" type="button" data-a="check">Tekshirish</button><button class="kg-btn" type="button" data-a="steps">💡 Yechim</button>' +
          (window.kaAI ? '<button class="kg-btn" type="button" data-a="ai">🤖</button>' : "") + '</div>' +
          '<div class="kg-fb"></div><ol class="kg-steps">' + p.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>";
        (function (li, p) {
          var inp = $("input", li), fb = $(".kg-fb", li);
          function doCheck() {
            if (!inp.value.trim()) { fb.className = "kg-fb bad"; fb.textContent = "Javobni yozing."; return; }
            var ok = check(inp.value, p.a, p.ordered);
            li.dataset.done = ok ? "1" : "0";
            li.classList.toggle("ok", ok); li.classList.toggle("bad", !ok);
            fb.className = "kg-fb " + (ok ? "ok" : "bad");
            fb.textContent = ok ? "✔ To'g'ri!" : "✘ Noto'g'ri. Qayta urinib ko'ring yoki 💡 Yechim tugmasini bosing.";
            updScore();
          }
          li._check = doCheck;
          $('[data-a="check"]', li).onclick = doCheck;
          inp.addEventListener("keydown", function (e) { if (e.key === "Enter") doCheck(); });
          $('[data-a="steps"]', li).onclick = function () { $(".kg-steps", li).classList.toggle("on"); };
          var aib = $('[data-a="ai"]', li);
          if (aib) aib.onclick = function () {
            var tmp = el("div", null, p.q);
            window.kaAI.open({ topic: sec.id, mode: "check", text: tmp.textContent + "\nMening javobim: " + (inp.value || "…") });
          };
        })(li, p);
        list.appendChild(li);
      }
      updScore();
    }
    function updScore() {
      var ok = $$(".kg-item", list).filter(function (li) { return li.dataset.done === "1"; }).length;
      score.textContent = ok + "/" + COUNT;
    }
    $('[data-a="new"]', box).onclick = fresh;
    $('[data-a="checkall"]', box).onclick = function () { $$(".kg-item", list).forEach(function (li) { li._check(); }); };
    fresh();
    return box;
  }

  var added = [];
  $$("main > section.topic").forEach(function (sec) {
    var h = $("h2", sec), title = h ? h.textContent : "";
    var gens = gensFor(title);
    if (!gens) return;
    var body = $(".topic-body", sec) || sec;
    var box = buildBox(sec, gens);
    var nav = $(".ka-topicnav", body);
    body.insertBefore(box, nav || null);
    added.push(sec.id);
  });
  window.kaGen = { generators: G, check: check, topics: added, gensFor: gensFor };

  // ---------- Test savollaridagi sonlarni yangilash (faqat sof arifmetik savollar) ----------
  // Masalan "356 + 487 ni hisoblang." — sonlar almashtiriladi, javob va variantlar qayta hisoblanadi.
  var ORIG = null;
  function testsObj() { try { return typeof TESTS !== "undefined" ? TESTS : null; } catch (e) { return null; } }
  function sameShape(n) {
    var neg = n < 0, s = String(Math.abs(n)), len = s.length;
    var lo = len === 1 ? 1 : Math.pow(10, len - 1), hi = Math.pow(10, len) - 1;
    var v = R(lo, hi);
    return neg ? -v : v;
  }
  var ARITH = /^\s*(\(?-?\d+\)?)\s*([+\-−×x*·:\/])\s*(\(?-?\d+\)?)\s*(ni\s+hisoblang|=\s*\?)?\s*[.?]?\s*$/i;
  function num(t) { return parseInt(String(t).replace(/[()]/g, ""), 10); }
  function opCalc(a, op, b) {
    if (op === "+") return a + b;
    if (op === "-" || op === "−") return a - b;
    if (op === "×" || op === "x" || op === "*" || op === "·") return a * b;
    if (op === ":" || op === "/") return b !== 0 && a % b === 0 ? a / b : NaN;
    return NaN;
  }
  function fmtN(n, orig) { return /^\(/.test(orig) ? "(" + n + ")" : String(n); }
  function mutateQuestion(q) {
    var m = ARITH.exec(q.q || "");
    if (!m || !Array.isArray(q.options) || typeof q.correct !== "number") return null;
    var a = num(m[1]), op = m[2], b = num(m[3]);
    var orig = opCalc(a, op, b);
    if (isNaN(orig) || String(q.options[q.correct]).replace(/\s/g, "").replace("−", "-") !== String(orig)) return null;
    var na, nb, res, guard = 0;
    do {
      na = sameShape(a); nb = sameShape(b);
      if (op === ":" || op === "/") { var qn = sameShape(orig) || 2; na = nb * qn; }
      res = opCalc(na, op, nb); guard++;
    } while ((isNaN(res) || (na === a && nb === b)) && guard < 30);
    if (isNaN(res)) return null;
    var opts = [res], cand = [res + 1, res - 1, res + 10, res - 10, -res, res + 2, res - 2, res + 100];
    for (var i = 0; opts.length < q.options.length && i < cand.length * 3; i++) {
      var c = cand[R(0, cand.length - 1)];
      if (opts.indexOf(c) < 0 && (res >= 0 ? c >= 0 || Math.random() < 0.3 : true)) opts.push(c);
    }
    while (opts.length < q.options.length) opts.push(res + opts.length * 3);
    for (var j = opts.length - 1; j > 0; j--) { var k = R(0, j), t = opts[j]; opts[j] = opts[k]; opts[k] = t; }
    var src = q.q, i1 = src.indexOf(m[1]), i3 = src.indexOf(m[3], i1 + m[1].length);
    var text = src.slice(0, i1) + fmtN(na, m[1]) + src.slice(i1 + m[1].length, i3) + fmtN(nb, m[3]) + src.slice(i3 + m[3].length);
    return Object.assign({}, q, { q: text, options: opts.map(String), correct: opts.indexOf(res) });
  }
  function refreshTests() {
    var T = testsObj(); if (!T) return;
    if (!ORIG) { ORIG = {}; Object.keys(T).forEach(function (k) { ORIG[k] = JSON.parse(JSON.stringify(T[k])); }); }
    Object.keys(ORIG).forEach(function (k) {
      if (!Array.isArray(ORIG[k])) return;
      var changed = false;
      var next = ORIG[k].map(function (q) { var n = mutateQuestion(q); if (n) { changed = true; return n; } return q; });
      if (changed) { T[k].length = 0; Array.prototype.push.apply(T[k], next); }
    });
  }
  function modalOpen() { var m = document.getElementById("testModal"); if (!m) return false; var cs = getComputedStyle(m); return cs.display !== "none" && cs.visibility !== "hidden" && m.offsetHeight > 0 && !m.hidden; }
  // Test oynasi yopiq paytdagi har bir bosishdan oldin sonlar yangilanadi (test ochilishidan oldin)
  document.addEventListener("click", function (e) {
    if (modalOpen() || (e.target.closest && e.target.closest("#testModal, .test-modal"))) return;
    try { refreshTests(); } catch (err) {}
  }, true);
})();
