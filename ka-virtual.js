/*!
 * Kuvonch Academy — VIRTUAL o'yinlar (kamera + qo'l kuzatuvi)
 * 49 ta matematik o'yin (47 + poyga + grafik doskasi). Kamera bir nechta qo'lni (1–4) bir vaqtda sezadi.
 * Qo'l kuzatuvi: MediaPipe Hands (brauzerda ishlaydi, video hech qayerga yuborilmaydi).
 * O'yin sahifasi:  <script>window.KAV_ID=5</script><script src="ka-virtual.js"></script>
 * Ro'yxat sahifasi: <script>window.KAV_HUB=1</script><script src="ka-virtual.js"></script>
 */
(function () {
  "use strict";

  /* ======================= YORDAMCHI ======================= */
  var R = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  var lcm = function (a, b) { return a / gcd(a, b) * b; };
  var isPrime = function (n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  var sup = function (n) { return String(n).split("").map(function (c) { return SUP[c] || c; }).join(""); };
  var neg = function (n) { return n < 0 ? "(−" + (-n) + ")" : String(n); };
  var mstr = function (n) { return n < 0 ? "−" + (-n) : String(n); };
  function roman(n) { var v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1], s = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"], r = ""; for (var i = 0; i < v.length; i++) while (n >= v[i]) { r += s[i]; n -= v[i]; } return r; }
  function frac(a, b) { var g = gcd(a, b); return (a / g) + "/" + (b / g); }
  // To'g'ri javobga yaqin, takrorlanmaydigan noto'g'ri variantlar
  function near(a, n, spread) {
    var out = [], tries = 0; spread = spread || Math.max(3, Math.round(Math.abs(a) * 0.25));
    while (out.length < n && tries++ < 200) {
      var d = R(-spread, spread); if (!d) continue; var w = a + d;
      if (a >= 0 && w < 0) continue; if (out.indexOf(w) < 0) out.push(w);
    }
    return out;
  }

  /* ======================= SAVOL MAVZULARI ======================= */
  // q(lvl) -> {q: savol matni, a: to'g'ri javob, w: [noto'g'ri variantlar]}
  var TOPICS = {
    qoshish: { n: "Qo'shish", q: function (l) { var m = 10 + l * 8, a = R(1, m), b = R(1, m); return { q: a + " + " + b, a: a + b, w: near(a + b, 6), e: a + " + " + b + " = " + (a + b) + (a > 9 && b > 9 ? "  (o'nliklar: " + (a - a % 10) + "+" + (b - b % 10) + "=" + (a - a % 10 + b - b % 10) + ", birliklar: " + (a % 10) + "+" + (b % 10) + "=" + (a % 10 + b % 10) + ")" : "") }; } },
    qoshish2: { n: "Ikki xonali qo'shish", q: function (l) { var a = R(10, 49 + l * 5), b = R(10, 49); return { q: a + " + " + b, a: a + b, w: near(a + b, 6, 11), e: a + " + " + b + " = " + (a - a % 10) + " + " + (b - b % 10) + " + " + (a % 10) + " + " + (b % 10) + " = " + (a + b) }; } },
    ayirish: { n: "Ayirish", q: function (l) { var m = 15 + l * 8, a = R(5, m), b = R(1, a); return { q: a + " − " + b, a: a - b, w: near(a - b, 6), e: a + " − " + b + " = " + (a - b) + "   tekshiruv: " + (a - b) + " + " + b + " = " + a }; } },
    kopaytirish: { n: "Ko'paytirish jadvali", q: function (l) { var a = R(2, Math.min(9, 4 + l)), b = R(2, 9); return { q: a + " × " + b, a: a * b, w: near(a * b, 6, Math.max(a, b) + 2), e: a + " × " + b + " = " + (a * b) + "   (" + Array(a + 1).join(b + "+").slice(0, -1).replace(/\+/g, " + ") + ")" }; } },
    bolish: { n: "Bo'lish", q: function (l) { var b = R(2, 9), c = R(2, Math.min(12, 5 + l)); return { q: (b * c) + " : " + b, a: c, w: near(c, 6, 4), e: (b * c) + " : " + b + " = " + c + ",  chunki " + b + " × " + c + " = " + (b * c) }; } },
    kvadrat: { n: "Kvadratlar", q: function (l) { var n = R(2, Math.min(20, 9 + l * 2)); return { q: n + sup(2), a: n * n, w: [(n - 1) * (n - 1), (n + 1) * (n + 1), n * 2, n * n + n, n * n - 1, n * n + 10], e: n + sup(2) + " = " + n + " × " + n + " = " + (n * n) + (n !== 2 ? "   (" + n + "·2 = " + (2 * n) + " emas!)" : "") }; } },
    ildiz: { n: "Kvadrat ildiz", q: function (l) { var n = R(2, Math.min(20, 9 + l * 2)); return { q: "√" + (n * n), a: n, w: near(n, 6, 4), e: "√" + (n * n) + " = " + n + ",  chunki " + n + sup(2) + " = " + (n * n) }; } },
    ildizKichik: { n: "Kvadrat ildiz (≤10)", q: function () { var n = R(0, 10); return { q: "√" + (n * n), a: n, w: [], e: "√" + (n * n) + " = " + n + ",  chunki " + n + " × " + n + " = " + (n * n) }; } },
    daraja: { n: "Darajalar", q: function (l) { var b = pick([2, 2, 3, 3, 4, 5, 10]), k = b === 2 ? R(2, Math.min(10, 5 + l)) : b === 10 ? R(1, 4) : R(2, b === 3 ? 4 : 3); var v = Math.pow(b, k); return { q: b + sup(k), a: v, w: [b * k, Math.pow(b, k - 1), Math.pow(b, k + 1), v + b, v - b].filter(function (x) { return x !== v && x > 0; }), e: b + sup(k) + " = " + Array(k + 1).join(b + "·").slice(0, -1) + " = " + v + (b * k !== v ? "   (" + b + "×" + k + " = " + (b * k) + " emas!)" : "") }; } },
    foiz: { n: "Foizlar", q: function (l) { var p = pick([10, 20, 25, 50, 75, 5, 30, 40]), N = pick([20, 40, 60, 80, 100, 120, 200, 300, 400, 500]); var v = N * p / 100; if (v !== Math.round(v)) { N = 100; v = p; } return { q: N + " ning " + p + "%", a: v, w: near(v, 6, Math.max(5, Math.round(v / 2))), e: N + " ning " + p + "% = " + N + " : 100 × " + p + " = " + (N / 100) + " × " + p + " = " + v }; } },
    tenglama: { n: "Tenglamalar", q: function (l) { var x = R(1, 9 + l), a = R(2, Math.min(9, 3 + l)), b = R(1, 20); return { q: a + "x + " + b + " = " + (a * x + b), a: x, w: near(x, 6, 4), e: a + "x = " + (a * x + b) + " − " + b + " = " + (a * x) + "  →  x = " + (a * x) + " : " + a + " = " + x }; } },
    ekub: { n: "EKUB", q: function () { var g = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), a = g * R(1, 6), b = g * R(1, 6); while (gcd(a / g, b / g) !== 1 || a === b) { a = g * R(1, 6); b = g * R(2, 7); } return { q: "EKUB(" + a + "; " + b + ")", a: g, w: near(g, 6, 4).concat([a, b]), e: a + " = " + g + "·" + (a / g) + ",  " + b + " = " + g + "·" + (b / g) + "  →  eng katta umumiy bo'luvchi " + g }; } },
    ekuk: { n: "EKUK", q: function (l) { var M2 = Math.min(20, 6 + (l || 2) * 2), a = R(2, M2), b = R(2, M2); while (a === b) b = R(2, M2); var v = lcm(a, b); return { q: "EKUK(" + a + "; " + b + ")", a: v, w: [a * b, gcd(a, b), v * 2, v + a, Math.max(a, b)].filter(function (x) { return x !== v; }), e: a + " ning karralilari: " + [1, 2, 3, 4].map(function (k) { return a * k; }).join(", ") + "…  →  " + b + " ga bo'linadigan eng kichigi " + v }; } },
    kasr: { n: "Kasrni qisqartirish", q: function (l) { var b = R(2, 9), a = R(1, b - 1); while (gcd(a, b) !== 1) a = R(1, b - 1); var k = R(2, Math.min(15, 3 + (l || 2))); var w = []; for (var i = 0; i < 8; i++) { var bb = R(2, 9), aa = R(1, bb - 1); var s = frac(aa, bb); if (s !== a + "/" + b && w.indexOf(s) < 0) w.push(s); } return { q: (a * k) + "/" + (b * k) + " = ?", a: a + "/" + b, w: w, e: (a * k) + "/" + (b * k) + " = " + (a * k) + ":" + k + " / " + (b * k) + ":" + k + " = " + a + "/" + b + "   (surat va maxraj " + k + " ga bo'lindi)" }; } },
    yuza: { n: "Yuzalar", q: function (l) { var t = R(0, 2), a = R(2, 9 + l), b = R(2, 9); if (t === 0) return { q: "To'rtburchak " + a + "×" + b + " yuzi", a: a * b, w: [2 * (a + b), a + b, a * b + a, a * b - b].filter(function (x) { return x !== a * b; }), e: "S = a · b = " + a + " · " + b + " = " + (a * b) + "   (perimetr " + 2 * (a + b) + " — boshqa narsa!)" }; if (t === 1) return { q: "Kvadrat tomoni " + a + ", yuzi", a: a * a, w: [4 * a, 2 * a, a * a + a, (a + 1) * (a + 1)], e: "S = a² = " + a + " · " + a + " = " + (a * a) }; var h = 2 * R(1, 6); return { q: "Uchburchak: asos " + a + ", balandlik " + h + ", yuzi", a: a * h / 2, w: [a * h, a + h, a * h / 2 + a, a * h / 2 - 2].filter(function (x) { return x > 0; }), e: "S = ½ · a · h = ½ · " + a + " · " + h + " = " + (a * h / 2) }; } },
    rim: { n: "Rim raqamlari", q: function (l) { var n = R(4, 30 + l * 20); return { q: roman(n) + " = ?", a: n, w: near(n, 6, 6), e: roman(n) + " = " + n + "   (I=1, V=5, X=10, L=50, C=100; kichigi chapda bo'lsa ayiriladi: IV=4, IX=9, XL=40)" }; } },
    yaxlitlash: { n: "Yaxlitlash", q: function () { var t = R(0, 1); if (t) { var n = R(11, 989); var v = Math.round(n / 10) * 10; return { q: n + " → o'nliklargacha", a: v, w: [v + 10, v - 10, Math.floor(n / 10) * 10 === v ? v + 10 : Math.floor(n / 10) * 10, Math.round(n / 100) * 100].filter(function (x) { return x !== v && x >= 0; }), e: n + ": birlik raqami " + (n % 10) + (n % 10 >= 5 ? " ≥ 5 → yuqoriga: " : " < 5 → pastga: ") + v }; } var d = R(10, 99) / 10 + R(0, 9); d = Math.round(d * 10) / 10; var r = Math.round(d); return { q: String(d).replace(".", ",") + " → butungacha", a: r, w: [r + 1, r - 1, Math.floor(d) === r ? r + 1 : Math.floor(d), r + 2].filter(function (x) { return x !== r && x >= 0; }), e: String(d).replace(".", ",") + ": o'ndan biri " + Math.round((d % 1) * 10) + (Math.round((d % 1) * 10) >= 5 ? " ≥ 5 → yuqoriga: " : " < 5 → pastga: ") + r }; } },
    ketma: { n: "Ketma-ketliklar", q: function (l) { var t = R(0, 2), a = R(1, 9), d = R(2, 4 + l), s = []; if (t === 2) { d = R(2, 3); a = R(1, 3); for (var i = 0; i < 4; i++) s.push(a * Math.pow(d, i)); return { q: s.join(", ") + ", ?", a: a * Math.pow(d, 4), w: near(a * Math.pow(d, 4), 6, 10), e: "Har safar " + d + " ga ko'paytiriladi: " + s[3] + " × " + d + " = " + a * Math.pow(d, 4) }; } if (t === 1) { a = R(40, 90); for (var j = 0; j < 4; j++) s.push(a - d * j); return { q: s.join(", ") + ", ?", a: a - 4 * d, w: near(a - 4 * d, 6, 5), e: "Har safar " + d + " ayiriladi: " + s[3] + " − " + d + " = " + (a - 4 * d) }; } for (var k = 0; k < 4; k++) s.push(a + d * k); return { q: s.join(", ") + ", ?", a: a + 4 * d, w: near(a + 4 * d, 6, 5), e: "Har safar " + d + " qo'shiladi: " + s[3] + " + " + d + " = " + (a + 4 * d) }; } },
    manfiy: { n: "Manfiy sonlar", q: function (l) { var a = R(-15, 15), b = R(-15, 15), o = R(0, 1); var v = o ? a + b : a - b; return { q: mstr(a) + (o ? " + " : " − ") + neg(b), a: v, w: near(v, 6, 6).concat([-v]), e: mstr(a) + (o ? " + " : " − ") + neg(b) + " = " + (o ? mstr(a) + (b < 0 ? " − " + (-b) : " + " + b) : mstr(a) + (b < 0 ? " + " + (-b) : " − " + b)) + " = " + mstr(v) + (o ? "" : "   (minus × minus = plyus)") }; } },
    aralash: { n: "Aralash misollar", q: function (l) { return TOPICS[pick(["qoshish", "ayirish", "kopaytirish", "bolish"])].q(l); } },
    kichik: { n: "10 gacha qo'shish/ayirish", q: function () { if (R(0, 1)) { var a = R(0, 10), b = R(0, 10 - a); return { q: a + " + " + b, a: a + b, w: [], e: a + " + " + b + " = " + (a + b) }; } var c = R(1, 10), d = R(0, c); return { q: c + " − " + d, a: c - d, w: [], e: c + " − " + d + " = " + (c - d) }; } },
    kichikAralash: { n: "10 gacha aralash", q: function () { var t = R(0, 3); if (t === 0) { var a = R(1, 5), b = R(1, 2); return { q: a + " × " + b, a: a * b, w: [], e: a + " × " + b + " = " + (a * b) }; } if (t === 1) { var n = R(1, 10), d = pick([1, 2]); return { q: (n * d) + " : " + d, a: n, w: [], e: (n * d) + " : " + d + " = " + n }; } if (t === 2) { var r = R(0, 3); return { q: "√" + (r * r), a: r, w: [], e: "√" + (r * r) + " = " + r + ", chunki " + r + "·" + r + " = " + (r * r) }; } return TOPICS.kichik.q(); } }
  };

  // Juftlar (xotira o'yini): [chap, o'ng]
  var PAIRS = {
    kopaytirish: function () { var a = R(2, 9), b = R(2, 9); return [a + "×" + b, String(a * b)]; },
    kasrFoiz: function () { return pick([["1/2", "50%"], ["1/4", "25%"], ["3/4", "75%"], ["1/5", "20%"], ["2/5", "40%"], ["3/5", "60%"], ["4/5", "80%"], ["1/10", "10%"], ["3/10", "30%"], ["7/10", "70%"], ["9/10", "90%"], ["1/20", "5%"], ["1", "100%"], ["1/8", "12,5%"]]); },
    tenglama: function () { var x = R(1, 12), a = R(2, 6); return pick([[a + "x = " + (a * x), "x = " + x], ["x + " + a + " = " + (x + a), "x = " + x], ["x − " + a + " = " + (x - a), "x = " + x]]); }
  };

  // Qoidalar (kesish, tutish, savat, tartib) — son + shart
  var RULES = {
    tub: { n: "Tub sonlarni kes!", gen: function (l) { return R(2, 20 + (l || 2) * 15); }, ok: isPrime },
    karra3: { n: "3 ga bo'linuvchilarni kes!", gen: function (l) { return R(1, 30 + (l || 2) * 20); }, ok: function (v) { return v % 3 === 0; } },
    kvadratSon: { n: "To'liq kvadratlarni kes!", gen: function (l) { l = l || 2; return R(0, 1) ? Math.pow(R(1, Math.min(25, 8 + l * 2)), 2) : R(2, 60 + l * 30); }, ok: function (v) { var r = Math.round(Math.sqrt(v)); return r * r === v; } },
    manfiy: { n: "Faqat manfiy sonlarni ushla!", gen: function (l) { l = l || 2; return R(-10 - l * 5, 10 + l * 5); }, ok: function (v) { return v < 0; }, s: mstr },
    karra5: { n: "5 ga karrali sonlarni ushla!", gen: function (l) { l = l || 2; return R(0, 1) ? 5 * R(1, 10 + l * 5) : R(1, 50 + l * 25); }, ok: function (v) { return v % 5 === 0; } },
    juft: { n: "Juft sonlarni ushla!", gen: function (l) { return R(1, 50 + (l || 2) * 40); }, ok: function (v) { return v % 2 === 0; } }
  };

  // Savat (ikki savatga ajratish)
  var BINS = {
    juftToq: { n: "Juft yoki toq?", L: "JUFT", Rt: "TOQ", gen: function (l) { var v = R(1, 50 + (l || 2) * 60); return { v: v, s: String(v), left: v % 2 === 0 }; } },
    tubMurakkab: { n: "Tub yoki murakkab?", L: "TUB", Rt: "MURAKKAB", gen: function (l) { var v = R(2, 30 + (l || 2) * 15); return { v: v, s: String(v), left: isPrime(v) }; } },
    yarim: { n: "½ dan kichik yoki katta?", L: "< ½", Rt: "> ½", gen: function (l) { var b = R(3, Math.min(20, 6 + (l || 2) * 2)), a = R(1, b - 1); while (2 * a === b) a = R(1, b - 1); return { v: a / b, s: a + "/" + b, left: 2 * a < b }; } }
  };

  // Tartiblash (o'sish tartibida bosish)
  var ORDERS = {
    butun: { n: "Kichigidan kattasiga bos!", gen: function (l) { l = l || 2; var s = [], N = 4 + Math.min(3, Math.floor(l / 2)); while (s.length < N) { var v = R(-10 - l * 6, 20 + l * 12); if (s.indexOf(v) < 0) s.push(v); } return s.map(function (v) { return { v: v, s: mstr(v) }; }); } },
    kasr: { n: "Kasrlarni o'sish tartibida bos!", gen: function (l) { var s = [], vals = [], N = 3 + Math.min(3, Math.floor((l || 2) / 2)); while (s.length < N) { var b = R(2, 10), a = R(1, b + 3); var v = a / b; if (vals.some(function (x) { return Math.abs(x - v) < 1e-6; })) continue; vals.push(v); s.push({ v: v, s: a + "/" + b }); } return s; } },
    onli: { n: "O'nli kasrlarni o'sish tartibida bos!", gen: function (l) { var s = [], vals = [], N = 4 + Math.min(3, Math.floor((l || 2) / 2)); while (s.length < N) { var v = R(1, 99) / (R(0, 1) ? 10 : 100); if (vals.indexOf(v) >= 0) continue; vals.push(v); s.push({ v: v, s: String(v).replace(".", ",") }); } return s; } }
  };

  // Son o'qi (nuqtani to'g'ri joyga qo'yish)
  var LINES = {
    onli: { n: "O'nli kasrlar", min: 0, max: 10, tol: 0.25, ticks: 1, gen: function () { var v = R(1, 99) / 10; return { v: v, s: String(v).replace(".", ",") }; } },
    kasr: { n: "Oddiy kasrlar", min: 0, max: 2, tol: 0.06, ticks: 0.25, gen: function () { var b = pick([2, 3, 4, 5, 8]), a = R(1, 2 * b - 1); return { v: a / b, s: a + "/" + b }; } },
    ildiz: { n: "Ildizlarni baholash", min: 0, max: 10, tol: 0.25, ticks: 1, gen: function () { var n = R(2, 99); var r = Math.sqrt(n); while (Math.abs(r - Math.round(r)) < 1e-9) { n = R(2, 99); r = Math.sqrt(n); } return { v: r, s: "√" + n }; } }
  };

  // Burchak
  var ANGLES = {
    burchak: { n: "Burchak yasash", gen: function () { var a = pick([15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165]); return { a: a, q: a + "° burchak yasang" }; } },
    trig: { n: "Trigonometriya", gen: function () { return pick([{ a: 30, q: "sin α = 1/2" }, { a: 60, q: "cos α = 1/2" }, { a: 45, q: "tg α = 1" }, { a: 60, q: "sin α = √3/2" }, { a: 30, q: "cos α = √3/2" }, { a: 45, q: "sin α = √2/2" }, { a: 90, q: "sin α = 1" }, { a: 0, q: "sin α = 0" }, { a: 60, q: "tg α = √3" }, { a: 30, q: "tg α = √3/3" }, { a: 120, q: "cos α = −1/2" }, { a: 135, q: "tg α = −1" }]); } }
  };

  // Ketma-ket tutashtirish
  var CHAINS = {
    karrali: { n: "Karralilarni tartib bilan tutashtir", gen: function (l) { var k = R(3, Math.min(19, 5 + (l || 2) * 2)), s = []; for (var i = 1; i <= 6; i++) s.push(k * i); var w = []; while (w.length < 3) { var x = R(k + 1, k * 6); if (x % k && w.indexOf(x) < 0) w.push(x); } return { q: k + " ga karralilarni o'sish tartibida tutashtiring: " + k + ", " + (2 * k) + ", …", seq: s, wrong: w }; } }
  };


  /* ---- Tushuntirishlar (xatodan keyin ko'rsatiladi — esda qolishi uchun) ---- */
  function divisor(v) { for (var d = 2; d * d <= v; d++) if (v % d === 0) return d; return 0; }
  function dsum(v) { return String(Math.abs(v)).split("").reduce(function (a, c) { return a + (+c); }, 0); }
  var EXR = {
    tub: function (v) { var d = divisor(v); return d ? v + " = " + d + " · " + (v / d) + " → tub emas (murakkab)" : v + " — tub son: faqat 1 ga va o'ziga bo'linadi"; },
    karra3: function (v) { var s = dsum(v); return v + ": raqamlar yig'indisi " + String(v).split("").join("+") + " = " + s + (s % 3 ? " → 3 ga bo'linmaydi" : " → 3 ga bo'linadi"); },
    kvadratSon: function (v) { var r = Math.floor(Math.sqrt(v)); return r * r === v ? v + " = " + r + "² → to'liq kvadrat" : r + "² = " + (r * r) + " < " + v + " < " + ((r + 1) * (r + 1)) + " = " + (r + 1) + "² → to'liq kvadrat emas"; },
    manfiy: function (v) { return v < 0 ? mstr(v) + " < 0 → manfiy son" : v + (v === 0 ? " — na musbat, na manfiy" : " > 0 → musbat son"); },
    karra5: function (v) { return v + ": oxirgi raqami " + (v % 10) + (v % 5 ? " → 5 ga bo'linmaydi (0 yoki 5 bo'lishi kerak)" : " → 5 ga bo'linadi"); },
    juft: function (v) { return v + ": oxirgi raqami " + (v % 10) + (v % 2 ? " → toq" : " → juft"); },
    juftToq: function (g) { return g.v + ": oxirgi raqami " + (g.v % 10) + (g.v % 2 ? " → TOQ (2 ga bo'linmaydi)" : " → JUFT (2 ga bo'linadi)"); },
    tubMurakkab: function (g) { var d = divisor(g.v); return d ? g.v + " = " + d + " · " + (g.v / d) + " → MURAKKAB" : g.v + " faqat 1 va o'ziga bo'linadi → TUB"; },
    yarim: function (g) { var p = g.s.split("/"); return g.s + " va ½ ni solishtiramiz: 2·" + p[0] + " = " + (2 * p[0]) + (2 * p[0] < +p[1] ? " < " : " > ") + p[1] + " → " + g.s + (2 * p[0] < +p[1] ? " < ½" : " > ½"); }
  };

  /* ======================= MAVZULAR (VIZUAL) ======================= */
  var THEMES = {
    neon: { n: "Neon ko'k", bg: "#02040a", sk: "#00e5ff", acc: "#00e5ff", acc2: "#7c9bff", p: ["#00e5ff", "#7cf6ff", "#ffffff", "#3d7bff"], tr: "neon", fx: "grid" },
    oltin: { n: "Oltin", bg: "#0a0702", sk: "#ffd34d", acc: "#ffcc33", acc2: "#ff9f1a", p: ["#ffd34d", "#ffb300", "#fff1b8", "#ff8f00"], tr: "spark", fx: "dust" },
    olov: { n: "Olov", bg: "#0a0302", sk: "#ff7a1a", acc: "#ff9100", acc2: "#ff3d00", p: ["#ff3d00", "#ff9100", "#ffd600", "#ff6e40"], tr: "fire", fx: "embers" },
    galaktika: { n: "Galaktika", bg: "#05020c", sk: "#c084fc", acc: "#c084fc", acc2: "#60a5fa", p: ["#c084fc", "#60a5fa", "#f472b6", "#ffffff"], tr: "star", fx: "stars" },
    kamalak: { n: "Kamalak", bg: "#040406", sk: "rainbow", acc: "#ffe14d", acc2: "#4dd2ff", p: ["#ff4d4d", "#ffa64d", "#ffe14d", "#5ee67a", "#4dd2ff", "#a64dff"], tr: "rainbow", fx: "stars" },
    yurak: { n: "Yurak", bg: "#0a0207", sk: "#ff4d8d", acc: "#ff4d8d", acc2: "#ff9ec4", p: ["#ff4d8d", "#ff9ec4", "#ff1f5a", "#ffffff"], tr: "heart", fx: "dust" },
    tutun: { n: "Ko'k tutun", bg: "#020509", sk: "#6ec6ff", acc: "#6ec6ff", acc2: "#b3e5ff", p: ["#6ec6ff", "#b3e5ff", "#3a8fd6", "#ffffff"], tr: "smoke", fx: "fog" },
    suv: { n: "Suv", bg: "#01060c", sk: "#4fc3f7", acc: "#4fc3f7", acc2: "#80deea", p: ["#4fc3f7", "#80deea", "#e1f5fe", "#0288d1"], tr: "water", fx: "water" },
    terminal: { n: "Terminal", bg: "#000300", sk: "#00ff66", acc: "#00ff66", acc2: "#b6ff00", p: ["#00ff66", "#b6ff00", "#ccffdd", "#00aa44"], tr: "neon", fx: "matrix", mono: 1 },
    zarra: { n: "Zarralar", bg: "#020707", sk: "#5ee6c7", acc: "#5ee6c7", acc2: "#7c9bff", p: ["#5ee6c7", "#7c9bff", "#ffffff", "#2dd4bf"], tr: "spark", fx: "stars" },
    saturn: { n: "Saturn", bg: "#01030a", sk: "#4da3ff", acc: "#4da3ff", acc2: "#9fd0ff", p: ["#4da3ff", "#9fd0ff", "#ffffff", "#1e6fd9"], tr: "neon", fx: "stars" }
  };

  /* ======================= MEXANIKALAR (TA'RIF) ======================= */
  var MECH = {
    pufak: { e: "🫧", n: "Pufaklar", how: "Savolning to'g'ri javobi yozilgan pufakka ko'rsatkich barmog'ingizni tekkizib turing (yoki bosh va ko'rsatkich barmoqni chimdang)." },
    yomgir: { e: "🌧️", n: "Son yomg'iri", how: "Javoblar yuqoridan tushadi. To'g'ri javob pastga tushib ketmasidan unga barmog'ingizni tekkizing." },
    orbita: { e: "🪐", n: "Orbita", how: "Javoblar sayyora atrofida aylanadi. To'g'ri javobni barmoq bilan ushlang (tekkizib turing yoki chimdang)." },
    nishon: { e: "🎯", n: "Snayper", how: "Ko'rsatkich barmoq — nishon. To'g'ri javobni mo'ljalga oling va bosh barmoq bilan ko'rsatkichni chimdab o'q uzing." },
    pianino: { e: "🎹", n: "Klaviatura", how: "Havodagi klaviaturadan raqamlarni barmoq bilan bosib javobni yozing. Javob to'g'ri bo'lsa o'zi qabul qilinadi." },
    barmoq: { e: "✋", n: "Barmoq bilan sanash", how: "Javobni barmoqlaringiz bilan ko'rsating! 10 gacha — barcha barmoqlar qo'shib sanaladi. <b>10 dan katta javob</b> xona-xona ko'rsatiladi: avval o'nliklar raqamini (masalan 37 → 3 barmoq), 1 soniya ushlang, keyin birliklarni (7 barmoq). Musht = 0. O'rta va Qiyin darajada misollar 99 / 999 gacha." },
    kesish: { e: "⚔️", n: "Kesish", how: "Sonlar uchib chiqadi. Shartga mos sonlarni qo'lni tez silkitib kesing, mos kelmaganlariga tegmang." },
    tutish: { e: "🧺", n: "Savat bilan tutish", how: "Har bir qo'l — alohida savat. Shartga mos sonlarni tuting, mos kelmaganlaridan qoching." },
    savat: { e: "📦", n: "Ajratish", how: "Sonni chimdab (bosh+ko'rsatkich) ushlang va to'g'ri savatga olib borib qo'yib yuboring. Ikki qo'l bilan ikkita sonni bir vaqtda olsa bo'ladi." },
    tutash: { e: "✏️", n: "Tutashtirish", how: "Nuqtalarni to'g'ri tartibda barmoq bilan tekkizib tutashtiring. Ortiqcha sonlarga tegmang." },
    xotira: { e: "🃏", n: "Xotira juftlari", how: "Kartani barmoq bilan tekkizib oching. Bir-biriga teng juftlarni toping." },
    tartib: { e: "📶", n: "Tartiblash", how: "Sonlarni kichigidan kattasiga qarab ketma-ket barmoq bilan bosing." },
    sonoq: { e: "📏", n: "Son o'qi", how: "Barmog'ingizni son o'qi ustida yurgizing va berilgan sonning joyida ushlab turing." },
    poyga: { e: "🏎️", n: "Poyga", how: "Qo'lingizni chapga-o'ngga suring — mashina shunday yuradi. Yashil <b>+</b> / <b>×2</b> darvozalar tezlikni oshiradi, qizil <b>−</b> / <b>:2</b> kamaytiradi — tezlikning <b>chegarasi yo'q</b>! Yo'ldagi 🔶 konus, ⛔ to'siq, 🛢 moy dog'i va chuqurlardan qoching, ⚡ ko'k yo'lak tezlashtiradi. Ketma-ket 3 ta to'g'ri darvoza = 🔥 nitro (chimdang 🤏). Musht — tormoz. <b>1–4 o'yinchi</b>: kamera kengligi o'yinchilar soniga teng bo'laklarga bo'linadi. Klaviatura: ←→↓↑ · A D S W · J L K I · 4 6 5 8." },
    grafik: { e: "📈", n: "Grafik doskasi", how: "Koordinata doskasida funksiya grafigini barmoq bilan chizing: <b>☝ ko'rsatkich barmoqni</b> ko'tarib yurgizing (yoki 🤏 chimdang) — chiziladi, <b>✋ ochiq kaft</b> — o'chirg'ich. Tugmalarni 0,8 s ushlab turib bosing. <b>Vazifa</b> rejimida aniqlik foizda baholanadi va to'g'ri grafik ko'rsatiladi; <b>Erkin doska</b>da xohlagancha chizasiz va formulani yozib (masalan x^2−3) grafigini doskaga chiqarasiz." },
    burchak: { e: "📐", n: "Burchak", how: "Ikki qo'lning ko'rsatkich barmoqlari bilan chiziq hosil qiling (bitta qo'l bo'lsa — bilakdan barmoq uchigacha). Chiziq gorizontal bilan kerakli burchak hosil qilsin va ushlab turing." }
  };

  /* ======================= 47 TA O'YIN ======================= */
  // m — mexanika, k — mavzu kaliti, th — vizual mavzu, i — ilhom manbai (asl sahifa nomi)
  var GAMES = [
    { t: "Zarra pufaklari", m: "pufak", k: "qoshish", th: "zarra", i: "3D Particle & Bone Gestures" },
    { t: "Skelet yomg'iri", m: "yomgir", k: "ayirish", th: "neon", i: "3D Particle & Bone Gestures II" },
    { t: "Terminal: ko'paytirish", m: "pianino", k: "kopaytirish", th: "terminal", i: "Terminal Animation" },
    { t: "Xaker: tenglama", m: "pianino", k: "tenglama", th: "terminal", i: "Terminal Animation II" },
    { t: "Kod buzish: bo'lish", m: "pianino", k: "bolish", th: "terminal", i: "Terminal Animation III" },
    { t: "Globus: foizlar", m: "orbita", k: "foiz", th: "galaktika", i: "Komandali 3D dunyo" },
    { t: "Barmoq qushi", m: "barmoq", k: "kichik", th: "neon", i: "Barmoq qushi — skelet" },
    { t: "Birlashtirish: ko'paytma juftlari", m: "xotira", k: "kopaytirish", th: "oltin", i: "Tezkor birlashish tizimi" },
    { t: "Parchalanish: tub sonlar", m: "kesish", k: "tub", th: "zarra", i: "Zarralar parchalanishi" },
    { t: "Magnit sharlar: juft-toq", m: "savat", k: "juftToq", th: "neon", i: "Magnit sharlar" },
    { t: "Chat-bot: kvadratlar", m: "pufak", k: "kvadrat", th: "terminal", i: "Anonim chat" },
    { t: "Saturn: darajalar", m: "orbita", k: "daraja", th: "saturn", i: "Saturn 3D" },
    { t: "Qo'l-qurol: ko'paytirish", m: "nishon", k: "kopaytirish", th: "olov", i: "Hand Tracking Gun Game" },
    { t: "Nur bilan chizish: karralilar", m: "tutash", k: "karrali", th: "neon", i: "3D nuqtali rasm" },
    { t: "Xaker avatar: ildizlar", m: "barmoq", k: "ildizKichik", th: "terminal", i: "Xaker koder avatar" },
    { t: "Neon klaviatura", m: "pianino", k: "qoshish2", th: "neon", i: "Neon skelet klaviatura" },
    { t: "Ko'k Saturn: EKUB", m: "orbita", k: "ekub", th: "saturn", i: "3D Ko'k Saturn" },
    { t: "Tashish: tub yoki murakkab", m: "savat", k: "tubMurakkab", th: "galaktika", i: "Qo'l bilan boshqariladigan 3D dunyo" },
    { t: "Shakl almashinuvi: kasrlar", m: "pufak", k: "kasr", th: "zarra", i: "3D Particle Morphing" },
    { t: "Kelajak: o'nli kasrlar o'qi", m: "sonoq", k: "onli", th: "terminal", i: "Kelajakka nazar" },
    { t: "Fragmentlar: kasr son o'qida", m: "sonoq", k: "kasr", th: "oltin", i: "Cinematic Fragments" },
    { t: "Yashirin daraja: aralash", m: "yomgir", k: "aralash", th: "galaktika", i: "Yashirin sahifa" },
    { t: "Energiya: manfiy sonlar", m: "tutish", k: "manfiy", th: "olov", i: "Qo'l energiya effekti" },
    { t: "Kiborg: burchak yasash", m: "burchak", k: "burchak", th: "neon", i: "Cybernetic Symbiote" },
    { t: "Neon zarralar: tartiblash", m: "tartib", k: "butun", th: "zarra", i: "3D Neon zarrachalar" },
    { t: "Ko'k tutun: 3 ga karrali", m: "kesish", k: "karra3", th: "tutun", i: "Realistik ko'k tutun" },
    { t: "Suv tomchilari: 5 ga karrali", m: "tutish", k: "karra5", th: "suv", i: "Suv simulyatsiyasi" },
    { t: "Lazer: tenglamalar", m: "nishon", k: "tenglama", th: "neon", i: "Neon Blue Skeleton Laser" },
    { t: "Neon pufak: bo'lish", m: "pufak", k: "bolish", th: "neon", i: "Neon Hand Interaction" },
    { t: "Olov uchqunlari: ko'paytirish", m: "yomgir", k: "kopaytirish", th: "olov", i: "Realistic Fire Spark" },
    { t: "AR zarralar: yuzalar", m: "pufak", k: "yuza", th: "zarra", i: "Zarrachalar AR" },
    { t: "Kvant galaktika: ildizlar", m: "orbita", k: "ildiz", th: "galaktika", i: "Quantum Galaxy Pro" },
    { t: "Neon pianino: ketma-ketlik", m: "pianino", k: "ketma", th: "neon", i: "AI Neon Piano" },
    { t: "Neon yurak: barmoqlar", m: "barmoq", k: "kichikAralash", th: "yurak", i: "3D Neon yurak" },
    { t: "Oltin skelet: Rim raqamlari", m: "pufak", k: "rim", th: "oltin", i: "Realistic 2D Skeleton — Gold" },
    { t: "Ko'k skelet: kasrlarni tartibla", m: "tartib", k: "kasr", th: "saturn", i: "Realistic 2D Skeleton — Blue" },
    { t: "Kamalak: ½ bilan taqqosla", m: "savat", k: "yarim", th: "kamalak", i: "Kamalak — sezgir tutish" },
    { t: "Rangli lazer: darajalar", m: "nishon", k: "daraja", th: "kamalak", i: "Neon Multi-Color Laser" },
    { t: "Yurak juftlari: kasr = foiz", m: "xotira", k: "kasrFoiz", th: "yurak", i: "Neon yurak animatsiyasi" },
    { t: "Galaktika matni: EKUK", m: "pufak", k: "ekuk", th: "galaktika", i: "3D Galaxy Text Morph" },
    { t: "3D trigonometriya", m: "burchak", k: "trig", th: "zarra", i: "3D qo'l kuzatuvi effekti" },
    { t: "Oltin Saturn: yaxlitlash", m: "orbita", k: "yaxlitlash", th: "oltin", i: "Oltin Saturn" },
    { t: "Neon chang: kvadrat sonlar", m: "kesish", k: "kvadratSon", th: "zarra", i: "Neon chang zarrachalari" },
    { t: "AG: manfiy sonlar", m: "yomgir", k: "manfiy", th: "neon", i: "AG" },
    { t: "Kosmik sayohat: ildiz son o'qida", m: "sonoq", k: "ildiz", th: "galaktika", i: "Kinematik 3D" },
    { t: "Zarra matn: tenglama juftlari", m: "xotira", k: "tenglama", th: "zarra", i: "Particle Text Effect" },
    { t: "Final duel: o'nli kasrlar tartibi", m: "tartib", k: "onli", th: "kamalak", i: "Final", duel: 1 },
    { t: "Sport mashina poygasi", m: "poyga", k: "poyga", th: "olov", i: "Poyga" },
    { t: "Grafik doskasi", m: "grafik", k: "grafik", th: "neon", i: "Grafik doska" }
  ];
  var SRC = { pufak: TOPICS, yomgir: TOPICS, orbita: TOPICS, nishon: TOPICS, pianino: TOPICS, barmoq: TOPICS, kesish: RULES, tutish: RULES, savat: BINS, tartib: ORDERS, sonoq: LINES, burchak: ANGLES, tutash: CHAINS, poyga: { poyga: { n: "Qo'shish va ayirish (tezlik)" } }, grafik: { grafik: { n: "Funksiya grafiklari" } } };
  var PAIRN = { kopaytirish: "Ko'paytma juftlari", kasrFoiz: "Kasr = foiz", tenglama: "Tenglama = yechim" };
  GAMES.forEach(function (g, i) {
    g.id = i + 1;
    g.topic = g.m === "xotira" ? PAIRN[g.k] : (SRC[g.m][g.k] || {}).n || g.k;
  });

  /* --- Mavzu uchun maxsus o'yin (mavzu-oyin.html) --- */
  if (window.KAV_TOPIC && typeof window.KAV_TOPIC.q === "function") {
    TOPICS.mavzu = { n: window.KAV_TOPIC.n || "Mavzu savollari", q: window.KAV_TOPIC.q };
  }
  if (window.KAV_GAME) {
    var cg = window.KAV_GAME;
    cg.k = cg.k || "mavzu"; cg.m = cg.m || "pufak"; cg.th = cg.th || "neon";
    cg.id = GAMES.length + 1;
    cg.topic = ((SRC[cg.m] || {})[cg.k] || {}).n || cg.k;
    GAMES.push(cg);
    window.KAV_ID = cg.id;
  }

  window.KAV = { GAMES: GAMES, MECH: MECH, THEMES: THEMES };
  if (window.KAV_HUB || !window.KAV_ID) return;

  /* =================================================================
   *                         O'YIN DVIGATELI
   * ================================================================= */
  var G = GAMES[(window.KAV_ID | 0) - 1] || GAMES[0];
  var TH = THEMES[G.th] || THEMES.neon;
  var MK = MECH[G.m];
  var FONT = TH.mono ? "'JetBrains Mono','Fira Code',Consolas,monospace" : "'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif";
  var LS_BEST = "kav.best." + G.id;
  var CFG = { hands: 2, duel: false, video: true, time: 60, racers: 1, diff: 2, gmode: "vazifa" };
  try { var sv = JSON.parse(localStorage.getItem("kav.cfg") || "{}"); for (var k in sv) if (k in CFG && k !== "time") CFG[k] = sv[k]; } catch (e) {}
  if (G.m === "barmoq" && CFG.hands < 2) CFG.hands = 2;
  if (G.duel) CFG.duel = true;
  if (G.m === "grafik") CFG.time = 180;

  /* ----------------------- DOM ----------------------- */
  var css = [
    "*{box-sizing:border-box}html,body{margin:0;height:100%;overflow:hidden;background:" + TH.bg + ";color:#eef2ff;font-family:" + FONT + ";touch-action:none;-webkit-user-select:none;user-select:none}",
    "#kv-c{position:fixed;inset:0;width:100%;height:100%;display:block}",
    "#kv-v{position:fixed;width:2px;height:2px;opacity:0;pointer-events:none;left:0;top:0}",
    ".kv-hud{position:fixed;top:0;left:0;right:0;display:flex;align-items:flex-start;justify-content:space-between;padding:10px 14px;gap:10px;pointer-events:none;z-index:5}",
    ".kv-pill{pointer-events:auto;background:rgba(0,0,0,.45);border:1px solid " + TH.acc + "55;border-radius:999px;padding:6px 14px;font-weight:700;font-size:15px;color:#fff;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);white-space:nowrap;text-decoration:none}",
    ".kv-q{position:fixed;top:54px;left:50%;transform:translateX(-50%);max-width:94vw;text-align:center;font-weight:800;font-size:clamp(22px,4.6vw,44px);color:#fff;text-shadow:0 0 18px " + TH.acc + ",0 0 4px " + TH.acc + ";pointer-events:none;z-index:5;line-height:1.2;transition:transform .15s}",
    ".kv-q.bump{transform:translateX(-50%) scale(1.12)}",
    ".kv-sub{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);font-size:13px;color:#cfd8ef;opacity:.8;pointer-events:none;z-index:5;text-align:center;max-width:94vw}",
    ".kv-ov{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 30%," + TH.acc + "22,rgba(0,0,0,.92) 70%);padding:16px;overflow:auto}",
    ".kv-card{width:min(560px,100%);background:rgba(10,14,26,.92);border:1px solid " + TH.acc + "66;border-radius:22px;padding:22px 20px;box-shadow:0 0 40px " + TH.acc + "33;text-align:center}",
    ".kv-card h1{margin:4px 0 6px;font-size:clamp(22px,5vw,30px);color:#fff;text-shadow:0 0 14px " + TH.acc + "}",
    ".kv-tag{display:inline-block;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:" + TH.acc + ";border:1px solid " + TH.acc + "66;border-radius:999px;padding:3px 10px;margin:2px}",
    ".kv-card p{color:#c8d3ee;line-height:1.5;margin:10px 0}",
    ".kv-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0;text-align:left}",
    ".kv-opt{background:rgba(255,255,255,.05);border:1px solid #2a3a5e;border-radius:12px;padding:8px 10px;font-size:13px;color:#aab8d8}",
    ".kv-opt b{display:block;color:#fff;font-size:12px;margin-bottom:6px}",
    ".kv-seg{display:flex;gap:4px;flex-wrap:wrap}.kv-seg button{flex:1;min-width:34px;border:1px solid #33456e;background:transparent;color:#cfe;border-radius:8px;padding:6px 4px;font:inherit;font-weight:700;cursor:pointer}",
    ".kv-seg button.on{background:" + TH.acc + ";color:#000;border-color:" + TH.acc + "}",
    ".kv-btn{display:block;width:100%;margin:8px 0 0;border:0;border-radius:14px;padding:14px;font:inherit;font-weight:800;font-size:17px;cursor:pointer;background:linear-gradient(135deg," + TH.acc + "," + TH.acc2 + ");color:#000;text-decoration:none}",
    ".kv-btn.gh{background:transparent;border:1px solid #3a4c74;color:#dfe8ff;font-weight:700;font-size:15px;padding:11px}",
    ".kv-row{display:flex;gap:8px}.kv-row>*{flex:1}",
    ".kv-big{font-size:56px;font-weight:900;color:#fff;text-shadow:0 0 24px " + TH.acc + ";margin:6px 0}",
    ".kv-note{font-size:12px;color:#8fa0c4;margin-top:10px}",
    ".kv-err{color:#ff9a9a;font-size:14px;margin-top:8px}",
    ".kv-load{position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:15;color:" + TH.acc + ";font-weight:700;letter-spacing:2px;font-size:14px;pointer-events:none;flex-direction:column;gap:12px}",
    ".kv-spin{width:46px;height:46px;border-radius:50%;border:3px solid " + TH.acc + "33;border-top-color:" + TH.acc + ";animation:kvs 1s linear infinite}@keyframes kvs{to{transform:rotate(360deg)}}",
    ".acc-fixed{display:none!important}",
    ".kv-teach{position:fixed;left:50%;bottom:58px;transform:translate(-50%,30px);opacity:0;max-width:min(760px,94vw);padding:12px 18px;border-radius:16px;font-weight:700;font-size:clamp(15px,2.4vw,21px);line-height:1.35;text-align:center;z-index:8;pointer-events:none;transition:.25s;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}",
    ".kv-teach.on{opacity:1;transform:translate(-50%,0)}",
    ".kv-teach.no{background:rgba(40,8,12,.88);border:2px solid #ff6b6b;color:#fff;box-shadow:0 0 30px #ff6b6b55}",
    ".kv-teach.ok{background:rgba(6,30,18,.85);border:2px solid #5ee67a;color:#eafff0}",
    ".kv-teach b{color:#ffd479}",
    ".kv-teach.hint{background:rgba(40,32,6,.88);border:2px solid #ffd479;color:#fff}",
    ".kv-banner{position:fixed;left:50%;top:42%;transform:translate(-50%,-50%) scale(.6);opacity:0;font-weight:900;font-size:clamp(26px,6vw,58px);text-shadow:0 0 24px currentColor,0 4px 0 #000;z-index:7;pointer-events:none;transition:transform .3s cubic-bezier(.2,1.6,.4,1),opacity .3s;white-space:nowrap}",
    ".kv-banner.on{opacity:1;transform:translate(-50%,-50%) scale(1)}",
    ".kv-rep{display:inline-block;font-size:.45em;vertical-align:middle;background:#ffd479;color:#000;border-radius:999px;padding:3px 10px;text-shadow:none;margin-right:6px}",
    ".kv-miss{text-align:left;background:rgba(255,255,255,.04);border:1px solid #3a2a40;border-radius:12px;padding:10px 12px;margin:10px 0;max-height:190px;overflow:auto;font-size:14px;color:#e8ecff}",
    ".kv-miss div{padding:4px 0;border-bottom:1px dashed #ffffff18}.kv-miss div:last-child{border:0}",
    "@media(max-width:520px){.kv-opts{grid-template-columns:1fr}.kv-pill{font-size:13px;padding:5px 10px}}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  if (!document.querySelector('meta[name=viewport]')) { var mv = document.createElement("meta"); mv.name = "viewport"; mv.content = "width=device-width,initial-scale=1"; document.head.appendChild(mv); }
  document.title = G.id + ". " + G.t + " — Virtual | Kuvonch Academy";

  var body = document.body;
  var cv = document.createElement("canvas"); cv.id = "kv-c"; body.appendChild(cv);
  var ctx = cv.getContext("2d");
  var video = document.createElement("video"); video.id = "kv-v"; video.setAttribute("playsinline", ""); video.muted = true; video.autoplay = true; body.appendChild(video);
  var hud = document.createElement("div"); hud.className = "kv-hud";
  hud.innerHTML = '<a class="kv-pill" href="virtual.html">← Virtual</a><span class="kv-pill" id="kv-s">⭐ 0</span><span class="kv-pill" id="kv-t">⏱ 60</span><span class="kv-pill" id="kv-h">✋ 0</span><span class="kv-pill" id="kv-mus" style="cursor:pointer">🎵</span>';
  body.appendChild(hud);
  setTimeout(function () { var mb = document.getElementById("kv-mus"); if (!mb) return; if (G.m === "poyga") { mb.style.display = "none"; return; } var upd = function () { mb.textContent = MUS ? "🎵 Musiqa" : "🔇 Musiqa"; }; upd(); mb.onclick = function () { MUS = !MUS; try { localStorage.setItem("kav.music", MUS ? "1" : "0"); } catch (e) {} upd(); if (MUS) musicStart(); else musicStop(); }; }, 0);
  var qEl = document.createElement("div"); qEl.className = "kv-q"; body.appendChild(qEl);
  var subEl = document.createElement("div"); subEl.className = "kv-sub"; body.appendChild(subEl);
  var loadEl = document.createElement("div"); loadEl.className = "kv-load"; loadEl.innerHTML = '<div class="kv-spin"></div><div id="kv-lt">KAMERA YUKLANMOQDA…</div>'; body.appendChild(loadEl);
  var ov = document.createElement("div"); ov.className = "kv-ov"; body.appendChild(ov);
  var $ = function (id) { return document.getElementById(id); };

  var W = 0, H = 0, DPR = 1, U = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight; U = Math.min(W, H) / 100;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (mech && mech.resize) mech.resize();
  }
  window.addEventListener("resize", resize);

  /* ----------------------- OVOZ ----------------------- */
  var AC = null;
  function beep(f, d, type, vol) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain(); o.type = type || "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(vol || 0.12, AC.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + (d || 0.15));
      o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + (d || 0.15));
    } catch (e) {}
  }
  var sGood = function () { beep(660, 0.1, "triangle"); setTimeout(function () { beep(990, 0.16, "triangle"); }, 80); };
  var sBad = function () { beep(180, 0.25, "sawtooth", 0.08); setTimeout(function () { beep(140, 0.3, "sawtooth", 0.07); }, 120); };
  var sTick = function (f) { beep(f || 520, 0.06, "square", 0.05); };
  function ac() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); return AC; } catch (e) { return null; } }
  // f0→f1 chastota siljishi bilan ton
  function tone(f0, f1, d, type, vol, delay) {
    var A = ac(); if (!A) return; var t = A.currentTime + (delay || 0);
    var o = A.createOscillator(), g = A.createGain(); o.type = type || "sine";
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(A.destination); o.start(t); o.stop(t + d + 0.05);
  }
  var NOISE = null;
  function noise(d, type, f0, f1, vol, delay) {
    var A = ac(); if (!A) return; var t = A.currentTime + (delay || 0);
    if (!NOISE) { NOISE = A.createBuffer(1, A.sampleRate, A.sampleRate); var ch = NOISE.getChannelData(0); for (var i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
    var s = A.createBufferSource(), f = A.createBiquadFilter(), g = A.createGain(); s.buffer = NOISE; f.type = type || "bandpass"; f.Q.value = 2;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + d);
    g.gain.setValueAtTime(vol || 0.2, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(f); f.connect(g); g.connect(A.destination); s.start(t); s.stop(t + d + 0.05);
  }
  var NOTE = function (n) { return 440 * Math.pow(2, (n - 9) / 12); }; // n=0 → C4
  function arp(steps, base, type) { (steps || [0, 4, 7]).forEach(function (s, i) { tone(NOTE((base || 12) + s), NOTE((base || 12) + s), 0.18, type || "triangle", 0.09, i * 0.07); }); }
  // Har bir o'yin turiga mos "to'g'ri" ovozi
  var SFX = {
    pufak: function () { noise(0.08, "highpass", 2500, 6000, 0.25); tone(900, 1800, 0.12, "sine", 0.12); arp([0, 7], 19); },
    yomgir: function () { tone(1400, 300, 0.18, "sine", 0.18); tone(700, 1400, 0.15, "triangle", 0.08, 0.12); },
    orbita: function () { tone(523, 523, 0.6, "sine", 0.1); tone(659, 659, 0.6, "sine", 0.08, 0.08); tone(784, 790, 0.8, "sine", 0.08, 0.16); noise(0.6, "bandpass", 4000, 800, 0.05); },
    nishon: function () { noise(0.4, "lowpass", 2000, 80, 0.4); tone(160, 40, 0.35, "sawtooth", 0.12); arp([0, 4, 7], 14, "square"); },
    pianino: function () { [0, 4, 7, 12].forEach(function (s) { tone(NOTE(12 + s), NOTE(12 + s), 0.5, "triangle", 0.07); }); },
    barmoq: function () { arp([0, 4, 7, 12, 7, 12], 12); },
    kesish: function () { noise(0.18, "bandpass", 800, 5000, 0.3); tone(1800, 2400, 0.25, "sine", 0.08, 0.05); },
    tutish: function () { tone(300, 600, 0.08, "sine", 0.15); tone(1300, 1300, 0.12, "square", 0.05, 0.06); tone(1700, 1700, 0.2, "square", 0.05, 0.12); },
    savat: function () { noise(0.12, "lowpass", 600, 100, 0.35); tone(1300, 1300, 0.12, "square", 0.05, 0.08); tone(1700, 1700, 0.25, "square", 0.05, 0.16); },
    tutash: function () { arp([0, 4, 7, 11, 14, 19], 12, "sine"); },
    xotira: function () { noise(0.05, "highpass", 3000, 3000, 0.15); arp([0, 7, 12], 17, "sine"); },
    tartib: function () { arp([0, 2, 4, 5, 7, 9, 11, 12], 12, "triangle"); },
    sonoq: function () { tone(1046, 1046, 0.4, "sine", 0.12); tone(1568, 1568, 0.5, "sine", 0.07, 0.1); },
    burchak: function () { noise(0.03, "highpass", 4000, 4000, 0.2); arp([0, 4, 7, 12], 14, "sine"); },
    poyga: function () { arp([0, 7, 12], 19); }
  };
  function sfxGood() { (SFX[G.m] || sGood)(); }

  /* --- Fon musiqasi (har bir mavzuga mos sokin sintez) --- */
  var MUS = (function () { try { return localStorage.getItem("kav.music") !== "0"; } catch (e) { return true; } })();
  var SCALES = { neon: [0, 3, 7, 10, 12, 15], terminal: [0, 3, 5, 7, 10, 12], olov: [0, 1, 4, 5, 7, 8], oltin: [0, 2, 4, 7, 9, 12], galaktika: [0, 2, 7, 9, 11, 14], saturn: [0, 2, 7, 9, 14, 16], kamalak: [0, 4, 7, 9, 12, 16], yurak: [0, 4, 7, 11, 12, 16], tutun: [0, 3, 7, 8, 12, 15], suv: [0, 2, 4, 7, 9, 12], zarra: [0, 2, 5, 7, 9, 12] };
  var musT = null, musStep = 0;
  function musicStart() {
    musicStop(); if (!MUS || G.m === "poyga") return;
    var sc = SCALES[G.th] || SCALES.neon, chords = [0, 5, 3, 7], bpm = 96 + (G.m === "kesish" || G.m === "yomgir" ? 20 : 0);
    musT = setInterval(function () {
      if (!S.run && !(S.cd > 0)) return;
      var bar = Math.floor(musStep / 8) % 4, root = chords[bar], st = musStep % 8;
      if (st === 0 || st === 4) tone(NOTE(root - 24), NOTE(root - 24), 0.5, "triangle", 0.05);
      var n = sc[(st * 3 + bar) % sc.length] + root;
      if (st % 2 === 0 || Math.random() < 0.35) tone(NOTE(n), NOTE(n), 0.22, "sine", 0.022 + (S.left < 10 ? 0.01 : 0));
      if (S.left < 10 && S.run && st % 2 === 0) noise(0.03, "highpass", 6000, 6000, 0.04);
      musStep++;
    }, 60000 / bpm / 2);
  }
  function musicStop() { if (musT) clearInterval(musT); musT = null; }

  /* ----------------------- ZARRACHALAR ----------------------- */
  var parts = [];
  function addP(p) { if (parts.length > 700) parts.shift(); parts.push(p); }
  function burst(x, y, n, colors, spd, type) {
    colors = colors || TH.p;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = (spd || 1) * (60 + Math.random() * 260);
      addP({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 0.6 + Math.random() * 0.7, r: 1.5 + Math.random() * 3, c: pick(colors), g: 200, t: type || "dot" });
    }
  }
  function ftext(x, y, s, c) { addP({ x: x, y: y, vx: 0, vy: -60, life: 0, max: 1.1, r: 0, c: c || "#fff", g: 0, t: "text", s: s }); }
  function heartPath(c, x, y, r) { c.beginPath(); c.moveTo(x, y + r * 0.35); c.bezierCurveTo(x - r, y - r * 0.4, x - r * 0.4, y - r, x, y - r * 0.35); c.bezierCurveTo(x + r * 0.4, y - r, x + r, y - r * 0.4, x, y + r * 0.35); c.closePath(); }
  function starPath(c, x, y, r) { c.beginPath(); for (var i = 0; i < 10; i++) { var a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }
  function drawParts(dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i]; p.life += dt; if (p.life >= p.max) { parts.splice(i, 1); continue; }
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.t !== "text") { p.vx *= 0.985; p.vy *= 0.985; }
      var k = 1 - p.life / p.max;
      ctx.globalAlpha = Math.max(0, k);
      if (p.t === "text") { ctx.globalAlpha = Math.min(1, k * 1.5); ctx.fillStyle = p.c; ctx.font = "900 " + (4.2 * U + 10) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = p.c; ctx.shadowBlur = 14; ctx.fillText(p.s, p.x, p.y); ctx.shadowBlur = 0; }
      else if (p.t === "smoke") { var rr = p.r * (1 + (1 - k) * 3); var gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr); gr.addColorStop(0, p.c + "55"); gr.addColorStop(1, p.c + "00"); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 7); ctx.fill(); }
      else if (p.t === "ring") { ctx.strokeStyle = p.c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + (1 - k) * 40, 0, 7); ctx.stroke(); }
      else if (p.t === "heart") { ctx.fillStyle = p.c; heartPath(ctx, p.x, p.y, p.r * 2.4); ctx.fill(); }
      else if (p.t === "star") { ctx.fillStyle = p.c; starPath(ctx, p.x, p.y, p.r * 2.2); ctx.fill(); }
      else { ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.4 + k * 0.6), 0, 7); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }

  /* ----------------------- FON EFFEKTLARI ----------------------- */
  var bgs = [];
  function initBg() {
    bgs = []; var n = TH.fx === "matrix" ? Math.ceil(W / 18) : 120;
    for (var i = 0; i < n; i++) bgs.push({ x: TH.fx === "matrix" ? i * 18 : Math.random() * W, y: Math.random() * H, s: Math.random(), v: 20 + Math.random() * 80, c: String.fromCharCode(48 + R(0, 9)) });
  }
  var tGlobal = 0;
  function drawBg(dt) {
    var fx = TH.fx, i, b;
    if (fx === "grid") {
      ctx.strokeStyle = TH.acc + "22"; ctx.lineWidth = 1; var hy = H * 0.55, off = (tGlobal * 40) % 40;
      for (i = 0; i < 16; i++) { var yy = hy + Math.pow((i * 40 + off) / 640, 2) * (H - hy) * 1.0; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
      for (i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 20, hy); ctx.lineTo(W / 2 + i * W * 0.12, H); ctx.stroke(); }
    } else if (fx === "matrix") {
      ctx.font = "14px monospace"; ctx.textAlign = "center";
      for (i = 0; i < bgs.length; i++) { b = bgs[i]; b.y += b.v * dt * 2; if (b.y > H + 20) { b.y = -20; } if (Math.random() < 0.05) b.c = String.fromCharCode(48 + R(0, 9)); ctx.fillStyle = "rgba(0,255,102," + (0.08 + b.s * 0.22) + ")"; ctx.fillText(b.c, b.x, b.y); ctx.fillStyle = "rgba(0,255,102," + (0.04 + b.s * 0.1) + ")"; ctx.fillText(String((i * 7 + (b.y | 0)) % 10), b.x, b.y - 16); }
    } else if (fx === "embers") {
      for (i = 0; i < bgs.length; i++) { b = bgs[i]; b.y -= b.v * dt; b.x += Math.sin(tGlobal + i) * 0.3; if (b.y < -10) { b.y = H + 10; b.x = Math.random() * W; } ctx.fillStyle = "rgba(255," + (90 + (b.s * 120 | 0)) + ",0," + (0.15 + b.s * 0.4) + ")"; ctx.beginPath(); ctx.arc(b.x, b.y, 1 + b.s * 2, 0, 7); ctx.fill(); }
    } else if (fx === "fog") {
      for (i = 0; i < 14; i++) { b = bgs[i]; b.x += (b.s - 0.5) * 12 * dt; if (b.x < -200) b.x = W + 200; if (b.x > W + 200) b.x = -200; var rr = 120 + b.s * 200; var gr = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rr); gr.addColorStop(0, "rgba(110,198,255,.07)"); gr.addColorStop(1, "rgba(110,198,255,0)"); ctx.fillStyle = gr; ctx.fillRect(b.x - rr, b.y - rr, rr * 2, rr * 2); }
    } else if (fx === "water") {
      for (var w = 0; w < 5; w++) { ctx.strokeStyle = "rgba(79,195,247," + (0.06 + w * 0.03) + ")"; ctx.lineWidth = 2; ctx.beginPath(); for (var x = 0; x <= W; x += 12) { var y = H * (0.72 + w * 0.06) + Math.sin(x / 80 + tGlobal * (1 + w * 0.3)) * 8; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    } else {
      for (i = 0; i < bgs.length; i++) { b = bgs[i]; if (fx === "dust") { b.y -= b.v * dt * 0.2; if (b.y < 0) b.y = H; } else { b.x -= b.v * dt * 0.05; if (b.x < 0) b.x = W; } var tw = 0.3 + 0.7 * Math.abs(Math.sin(tGlobal * (0.5 + b.s) + i)); ctx.fillStyle = fx === "dust" ? TH.acc : "#fff"; ctx.globalAlpha = (0.15 + b.s * 0.5) * tw; ctx.fillRect(b.x, b.y, 1 + b.s * 1.6, 1 + b.s * 1.6); }
      ctx.globalAlpha = 1;
    }
  }

  /* ----------------------- QO'L KUZATUVI ----------------------- */
  var CONN = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
  var HAND_COL = TH.sk === "rainbow" ? ["#ff4d4d", "#4dd2ff", "#ffe14d", "#a64dff"] : [TH.sk, TH.acc2, "#ffffff", TH.p[3] || TH.acc];
  var hands = [];        // [{pts:[{x,y}], fingers, pinch, ...}]
  var pointers = [];     // o'yin uchun ko'rsatkichlar
  var prevPtr = [];
  var camOn = false, mouseMode = false, handsObj = null, lastRes = null, vw = 1280, vh = 720;
  var mouse = { x: -999, y: -999, down: false, inside: false };

  function mapLm(lm) {
    var sc = Math.max(W / vw, H / vh), dw = vw * sc, dh = vh * sc, ox = (W - dw) / 2, oy = (H - dh) / 2;
    return { x: ox + (1 - lm.x) * dw, y: oy + lm.y * dh, z: lm.z || 0 };
  }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function analyzeHand(pts, smooth) {
    if (smooth) for (var i = 0; i < 21; i++) { pts[i].x = smooth[i].x + (pts[i].x - smooth[i].x) * 0.6; pts[i].y = smooth[i].y + (pts[i].y - smooth[i].y) * 0.6; }
    var size = dist(pts[0], pts[9]) || 1, f = 0;
    if (dist(pts[4], pts[9]) / size > 0.78 && dist(pts[4], pts[17]) > dist(pts[3], pts[17]) * 1.05) f++;
    [[8, 6], [12, 10], [16, 14], [20, 18]].forEach(function (q) { if (dist(pts[q[0]], pts[0]) > dist(pts[q[1]], pts[0]) * 1.12) f++; });
    var pd = dist(pts[4], pts[8]) / size;
    return { pts: pts, size: size, fingers: f, pinchD: pd };
  }
  function onResults(res) {
    lastRes = res;
    if (res.image && res.image.width) { vw = res.image.width; vh = res.image.height; }
    var list = res.multiHandLandmarks || [], nh = [];
    for (var i = 0; i < list.length; i++) {
      var pts = list[i].map(mapLm);
      // eng yaqin oldingi qo'lni topib silliqlash
      var best = null, bd = 1e9;
      hands.forEach(function (h) { var d = dist(h.pts[0], pts[0]); if (d < bd) { bd = d; best = h; } });
      var h = analyzeHand(pts, best && bd < 150 ? best.pts : null);
      // chimdash (gisterezis bilan)
      var was = best && bd < 150 ? best.pinch : false;
      h.pinch = was ? h.pinchD < 0.5 : h.pinchD < 0.33;
      h.fingersStable = best && bd < 150 && best.fingers === h.fingers ? (best.fingersStable || 0) + 1 : 0;
      nh.push(h);
    }
    // chapdan o'ngga tartiblash — o'yinchilar barqaror bo'lishi uchun
    nh.sort(function (a, b) { return a.pts[0].x - b.pts[0].x; });
    hands = nh;
  }
  function buildPointers(dt) {
    var np = [];
    if (mouseMode) {
      if (mouse.inside) np.push({ x: mouse.x, y: mouse.y, pinch: mouse.down, hand: null, fingers: -1, palm: { x: mouse.x, y: mouse.y }, base: { x: W / 2, y: H } });
    } else {
      hands.forEach(function (h) { np.push({ x: h.pts[8].x, y: h.pts[8].y, pinch: h.pinch, hand: h, fingers: h.fingers, palm: h.pts[9], base: h.pts[0] }); });
    }
    np.forEach(function (p, i) {
      var pr = null, bd = 1e9;
      prevPtr.forEach(function (q) { var d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; pr = q; } });
      if (pr && bd < 260) { p.px = pr.x; p.py = pr.y; p.pinchStart = p.pinch && !pr.pinch; p.pinchEnd = !p.pinch && pr.pinch; p.trail = pr.trail; p.grab = pr.grab; p.id = pr.id; }
      else { p.px = p.x; p.py = p.y; p.pinchStart = p.pinch; p.pinchEnd = false; p.trail = []; p.id = Math.random(); }
      p.speed = dt > 0 ? Math.hypot(p.x - p.px, p.y - p.py) / dt : 0;
      p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > 18) p.trail.shift();
      p.player = CFG.duel ? (p.x < W / 2 ? 0 : 1) : 0;
      p.col = CFG.duel ? (p.player ? "#ff5c8a" : "#4dd2ff") : HAND_COL[i % HAND_COL.length];
    });
    // yo'qolgan ko'rsatkich ushlab turgan narsani tashlaydi
    prevPtr.forEach(function (q) { if (q.grab && np.every(function (p) { return p.grab !== q.grab; })) q.grab.held = null; });
    prevPtr = np; pointers = np;
  }

  function drawHands() {
    hands.forEach(function (h, hi) {
      var col = CFG.duel ? (h.pts[0].x < W / 2 ? "#4dd2ff" : "#ff5c8a") : HAND_COL[hi % HAND_COL.length];
      ctx.lineCap = "round"; ctx.shadowBlur = 16;
      CONN.forEach(function (c, ci) {
        var a = h.pts[c[0]], b = h.pts[c[1]];
        var cc = TH.sk === "rainbow" && !CFG.duel ? "hsl(" + ((ci * 17 + tGlobal * 120) % 360) + ",100%,60%)" : col;
        ctx.strokeStyle = cc; ctx.shadowColor = cc; ctx.lineWidth = Math.max(2, h.size * 0.035);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      ctx.shadowBlur = 10;
      h.pts.forEach(function (p, i) { ctx.fillStyle = [4, 8, 12, 16, 20].indexOf(i) >= 0 ? "#fff" : col; ctx.shadowColor = col; ctx.beginPath(); ctx.arc(p.x, p.y, [4, 8, 12, 16, 20].indexOf(i) >= 0 ? Math.max(3, h.size * 0.05) : Math.max(2, h.size * 0.03), 0, 7); ctx.fill(); });
      ctx.shadowBlur = 0;
      if (h.pinch) { var m = { x: (h.pts[4].x + h.pts[8].x) / 2, y: (h.pts[4].y + h.pts[8].y) / 2 }; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(m.x, m.y, 12, 0, 7); ctx.stroke(); }
    });
  }
  function drawPointers() {
    pointers.forEach(function (p) {
      var tr = p.trail, t = TH.tr;
      if (tr.length > 1 && (t === "neon" || t === "rainbow")) {
        for (var i = 1; i < tr.length; i++) {
          var k = i / tr.length; ctx.strokeStyle = t === "rainbow" ? "hsl(" + ((i * 20 + tGlobal * 200) % 360) + ",100%,60%)" : p.col;
          ctx.globalAlpha = k; ctx.lineWidth = 1 + k * 6; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.moveTo(tr[i - 1].x, tr[i - 1].y); ctx.lineTo(tr[i].x, tr[i].y); ctx.stroke();
        }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }
      var mv = Math.min(1, p.speed / 600);
      if (t === "spark" && Math.random() < 0.3 + mv) addP({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 120, vy: (Math.random() - 0.5) * 120, life: 0, max: 0.5, r: 1.5 + Math.random() * 2, c: pick(TH.p), g: 60, t: "dot" });
      if (t === "fire") for (var f = 0; f < 2; f++) addP({ x: p.x + (Math.random() - 0.5) * 8, y: p.y, vx: (Math.random() - 0.5) * 60, vy: -80 - Math.random() * 120, life: 0, max: 0.5 + Math.random() * 0.4, r: 2 + Math.random() * 3, c: pick(TH.p), g: -40, t: "dot" });
      if (t === "smoke" && Math.random() < 0.6) addP({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 30, vy: -30 - Math.random() * 30, life: 0, max: 1.4, r: 10 + Math.random() * 10, c: pick(["#6ec6ff", "#9fd8ff", "#3a8fd6"]), g: -10, t: "smoke" });
      if (t === "heart" && Math.random() < 0.15 + mv * 0.5) addP({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 40, vy: -40 - Math.random() * 40, life: 0, max: 1, r: 3 + Math.random() * 3, c: pick(TH.p), g: -10, t: "heart" });
      if (t === "star" && Math.random() < 0.2 + mv * 0.6) addP({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 80, vy: (Math.random() - 0.5) * 80, life: 0, max: 0.8, r: 2 + Math.random() * 2, c: pick(TH.p), g: 0, t: "star" });
      if (t === "water" && Math.random() < 0.08 + mv * 0.4) addP({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0, max: 0.9, r: 4, c: pick(TH.p), g: 0, t: "ring" });
      // ko'rsatkich nuqtasi
      ctx.fillStyle = "#fff"; ctx.shadowColor = p.col; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(p.x, p.y, mouseMode ? 7 : 6, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      if (CFG.duel) { ctx.fillStyle = p.col; ctx.font = "800 13px " + FONT; ctx.textAlign = "center"; ctx.fillText(p.player ? "2-o'yinchi" : "1-o'yinchi", p.x, p.y - 22); }
    });
  }

  function loadScript(src) {
    return new Promise(function (ok, bad) { var s = document.createElement("script"); s.src = src; s.crossOrigin = "anonymous"; s.onload = ok; s.onerror = function () { bad(new Error("Yuklanmadi: " + src)); }; document.head.appendChild(s); });
  }
  var MP = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/";
  var busy = false, stream = null;
  function startCamera() {
    loadEl.style.display = "flex"; $("kv-lt").textContent = "KAMERA YUKLANMOQDA…";
    return navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then(function (s) { stream = s; video.srcObject = s; return video.play(); })
      .then(function () { $("kv-lt").textContent = "QO'L MODELI YUKLANMOQDA…"; return window.Hands ? null : loadScript(MP + "hands.js"); })
      .then(function () {
        handsObj = new window.Hands({ locateFile: function (f) { return MP + f; } });
        handsObj.setOptions({ maxNumHands: CFG.hands, modelComplexity: /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ? 0 : 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.5 });
        handsObj.onResults(onResults);
        return handsObj.initialize ? handsObj.initialize() : null;
      })
      .then(function () {
        camOn = true; loadEl.style.display = "none";
        (function pump() {
          if (!camOn) return;
          if (!busy && video.readyState >= 2) { busy = true; vw = video.videoWidth || vw; vh = video.videoHeight || vh; handsObj.send({ image: video }).then(function () { busy = false; }, function () { busy = false; }); }
          requestAnimationFrame(pump);
        })();
      });
  }

  // Sichqoncha / sensor
  function mpos(e) { var t = e.touches ? e.touches[0] : e; if (t) { mouse.x = t.clientX; mouse.y = t.clientY; } mouse.inside = true; }
  cv.addEventListener("pointermove", mpos); cv.addEventListener("pointerdown", function (e) { mpos(e); mouse.down = true; });
  window.addEventListener("pointerup", function (e) { mouse.down = false; if (e.pointerType !== "mouse") setTimeout(function () { if (!mouse.down) mouse.inside = false; }, 60); }); cv.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") mouse.inside = false; });

  /* ----------------------- O'YIN HOLATI ----------------------- */
  var S = { run: false, score: [0, 0], ok: 0, bad: 0, streak: 0, left: 60, lvl: 1, pause: 0, miss: [], retry: [], since: 0, best: 0 };
  var HOLD = 0.55;
  function lvl() { var d = CFG.diff | 0 || 2; return d === 1 ? Math.min(2, 1 + Math.floor(S.ok / 10)) : d === 2 ? 1 + Math.floor(S.ok / 5) : 4 + Math.floor(S.ok / 4); }
  // Qiyinlik: harakatlanuvchi o'yinlarda tezlik ko'paytuvchisi
  var MOVE = { yomgir: 1, orbita: 1, kesish: 1, tutish: 1, pufak: 1, nishon: 1 };
  function spd() { return MOVE[G.m] ? [0.72, 1, 1.3][(CFG.diff | 0 || 2) - 1] : 1; }
  function setQ(t, rep) { qEl.innerHTML = (rep ? '<span class="kv-rep">🔁 Takror</span> ' : "") + String(t).replace(/</g, "&lt;"); qEl.classList.add("bump"); setTimeout(function () { qEl.classList.remove("bump"); }, 160); }

  /* --- Eslab qolish: xatolar takrorlanadi --- */
  // Xato qilingan savol 2–4 savoldan keyin yana so'raladi
  function askQ(tp, accept) {
    S.since++;
    if (S.retry.length && S.since >= 2 && Math.random() < 0.6) {
      var r = S.retry.shift(); if (!accept || accept(r)) { r.rep = true; S.since = 0; return r; }
    }
    var q, t = 0; do { q = tp.q(lvl()); } while (accept && !accept(q) && t++ < 60);
    if (q && !q.e) q.e = q.q + " = " + (typeof q.a === "number" ? mstr(q.a) : q.a);
    return q;
  }
  function logMiss(q, e) {
    if (q && S.retry.indexOf(q) < 0 && S.retry.length < 6) { S.retry.push(q); S.since = 0; }
    var line = e || (q ? q.e : "");
    if (line && !S.miss.some(function (m) { return m === line; })) S.miss.push(line);
  }

  /* --- Dars kartasi (xatodan keyin to'g'ri yechim) --- */
  var teachEl = document.createElement("div"); teachEl.className = "kv-teach"; body.appendChild(teachEl);
  var teachT = null;
  function teach(txt, ok, ms) {
    if (!txt) return;
    teachEl.className = "kv-teach on " + (ok === "hint" ? "hint" : ok ? "ok" : "no");
    teachEl.innerHTML = (ok === "hint" ? "💡 <b>Maslahat:</b> " : ok ? "✅ " : "💡 <b>To'g'risi:</b> ") + String(txt).replace(/</g, "&lt;");
    clearTimeout(teachT); teachT = setTimeout(function () { teachEl.className = "kv-teach"; }, ms || (ok ? 1400 : 3200));
    if (!ok) S.pause = Math.max(S.pause, 1.5);
  }

  /* --- Ketma-ketlik va daraja e'lonlari --- */
  var bannerEl = document.createElement("div"); bannerEl.className = "kv-banner"; body.appendChild(bannerEl);
  var bannerT = null;
  function banner(t, c) { bannerEl.textContent = t; bannerEl.style.color = c || "#fff"; bannerEl.className = "kv-banner on"; clearTimeout(bannerT); bannerT = setTimeout(function () { bannerEl.className = "kv-banner"; }, 1300); }
  var STREAK_TXT = { 3: "🔥 3 ketma-ket!", 5: "⚡ 5 ketma-ket! Zo'r!", 8: "🚀 8 ketma-ket!", 10: "🏆 10 ketma-ket! CHEMPION!", 15: "👑 15 ketma-ket! Afsona!", 20: "🌟 20! Matematika ustasi!" };

  function good(x, y, pl, pts, eq) {
    var L0 = lvl();
    S.ok++; S.streak++; S.best = Math.max(S.best, S.streak);
    var add = (pts || 10) + Math.min(10, Math.max(0, S.streak - 2) * 2);
    S.score[pl || 0] += add; burst(x, y, 40, null, 1.2); burst(x, y, 6, null, 0.6, TH.tr === "heart" ? "heart" : "star");
    ftext(x, y - 20, "+" + add, TH.acc);
    if (eq) ftext(x, y + 26, eq, "#ffffff");
    sfxGood(); if (navigator.vibrate) try { navigator.vibrate(20); } catch (e) {}
    if (STREAK_TXT[S.streak]) { banner(STREAK_TXT[S.streak], TH.acc); arp([0, 4, 7, 12, 16]); }
    else if (lvl() > L0) { banner("⬆ " + lvl() + "-daraja! Misollar qiyinlashdi", TH.acc2); arp([0, 5, 9, 12]); }
  }
  function bad(x, y, pl, lesson, q) {
    S.bad++; S.streak = 0; S.score[pl || 0] = Math.max(0, S.score[pl || 0] - 5);
    burst(x, y, 18, ["#ff4d4d", "#ff8a80", "#ffffff"], 0.7); ftext(x, y - 20, "−5", "#ff6b6b"); sBad();
    if (lesson || q) { logMiss(q, lesson); teach(lesson || q.e, false); }
  }
  function updHud() {
    $("kv-s").textContent = mech && mech.hud ? mech.hud() : CFG.duel ? "🔵 " + S.score[0] + " : " + S.score[1] + " 🔴" : "⭐ " + S.score[0];
    $("kv-t").textContent = "⏱ " + Math.max(0, Math.ceil(S.left));
    $("kv-h").textContent = (mouseMode ? "🖱" : "✋ " + hands.length);
  }
  function makeOpts(q, n) {
    var a = String(q.a), out = [a];
    shuffle(q.w || []).forEach(function (w) { w = String(w); if (out.length < n && out.indexOf(w) < 0) out.push(w); });
    if (typeof q.a === "number") near(q.a, 12, 8).forEach(function (w) { w = String(w); if (out.length < n && out.indexOf(w) < 0) out.push(w); });
    return shuffle(out).map(function (s) { return { s: s.replace(/^-/, "−"), ok: s === a }; });
  }
  function fitFont(txt, r, max) { return Math.min(max || r * 0.8, (r * 1.7) / Math.max(1.6, String(txt).length * 0.62)); }

  // Nishonga barmoq tekkizib turish / chimdash
  function holdPick(t, dt, inside, needPinch, holdT) {
    var hit = null;
    pointers.forEach(function (p) { if (inside(p)) { if (!hit) hit = p; if (p.pinchStart || (mouseMode && p.pinchStart)) t._pp = p; } });
    if (t._pp) { var pp = t._pp; t._pp = null; t.hold = 0; return pp; }
    if (hit && !needPinch) { t.hold = (t.hold || 0) + dt; if (t.hold >= (holdT || HOLD)) { t.hold = 0; return hit; } }
    else t.hold = Math.max(0, (t.hold || 0) - dt * 2);
    return null;
  }
  function inCircle(t, extra) { return function (p) { return Math.hypot(p.x - t.x, p.y - t.y) < t.r * (extra || 1.05); }; }
  function drawHoldRing(x, y, r, h, holdT) {
    if (!h) return; ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.shadowColor = TH.acc; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(x, y, r + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, h / (holdT || HOLD))); ctx.stroke(); ctx.shadowBlur = 0;
  }
  function drawBall(x, y, r, label, opt) {
    opt = opt || {};
    var c1 = opt.c || TH.acc, gr = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
    gr.addColorStop(0, "rgba(255,255,255,.55)"); gr.addColorStop(0.35, c1 + "88"); gr.addColorStop(1, c1 + "22");
    ctx.fillStyle = gr; ctx.shadowColor = c1; ctx.shadowBlur = opt.glow == null ? 22 : opt.glow;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = c1; ctx.stroke(); ctx.shadowBlur = 0;
    if (label != null) { ctx.fillStyle = "#fff"; ctx.font = "800 " + fitFont(label, r, opt.max) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = "#000"; ctx.shadowBlur = 6; ctx.fillText(label, x, y + 1); ctx.shadowBlur = 0; }
  }
  function drawBox(x, y, w, h, label, opt) {
    opt = opt || {}; var c1 = opt.c || TH.acc;
    ctx.fillStyle = opt.fill || "rgba(0,0,0,.45)"; ctx.strokeStyle = c1; ctx.lineWidth = opt.lw || 2; ctx.shadowColor = c1; ctx.shadowBlur = opt.glow == null ? 14 : opt.glow;
    rr(x, y, w, h, Math.min(16, h * 0.25)); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    if (label != null) { ctx.fillStyle = opt.tc || "#fff"; ctx.font = "800 " + (opt.fs || Math.min(h * 0.45, w / Math.max(2, String(label).length * 0.62))) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, x + w / 2, y + h / 2 + 1); }
  }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function scatter(n, r, area) {
    var pts = [], tries = 0; area = area || { x0: 0.08, x1: 0.92, y0: 0.24, y1: 0.9 };
    while (pts.length < n && tries++ < 3000) {
      var x = W * area.x0 + r + Math.random() * (W * (area.x1 - area.x0) - 2 * r), y = H * area.y0 + r + Math.random() * (H * (area.y1 - area.y0) - 2 * r);
      var gap = tries < 1500 ? 2.3 : 1.9;
      if (pts.every(function (p) { return Math.hypot(p.x - x, p.y - y) > r * gap; })) pts.push({ x: x, y: y });
    }
    while (pts.length < n) pts.push({ x: W * (0.1 + Math.random() * 0.8), y: H * (0.3 + Math.random() * 0.6) });
    return pts;
  }
  function shake(t) { t.shk = 0.4; }
  function shx(t, dt) { if (t.shk > 0) { t.shk -= dt; return Math.sin(t.shk * 60) * 8; } return 0; }

  /* ======================= MEXANIKALAR ======================= */
  var M = {};

  // ---------- Pufaklar ----------
  M.pufak = function () {
    var tp = TOPICS[G.k], b = [], q;
    function nq() {
      q = askQ(tp); setQ(q.q + " = ?", q.rep);
      var o = makeOpts(q, 4), lanes = shuffle([0, 1, 2, 3]), r = Math.max(34, Math.min(W / 10, H / 7.5));
      b = o.map(function (op, i) { var bx = W * (0.14 + lanes[i] * 0.24); return { x: bx, bx: bx, y: H + r + Math.random() * H * 0.35, r: r, s: op.s, ok: op.ok, ph: Math.random() * 6, v: H / (7 - Math.min(3, lvl() * 0.3)) * (0.8 + Math.random() * 0.4) }; });
    }
    return {
      start: nq,
      update: function (dt) {
        for (var i = b.length - 1; i >= 0; i--) {
          var t = b[i]; t.y -= t.v * dt; t.x = t.bx + Math.sin(tGlobal * 1.6 + t.ph) * U * 3;
          if (t.y < -t.r) t.y = H + t.r;
          var p = holdPick(t, dt, inCircle(t));
          if (p) { if (t.ok) { good(t.x, t.y, p.player, 0, q.q + " = " + t.s); nq(); return; } bad(t.x, t.y, p.player, null, q); b.splice(i, 1); }
        }
      },
      draw: function (dt) { b.forEach(function (t) { var sx = shx(t, dt); drawBall(t.x + sx, t.y, t.r, t.s); drawHoldRing(t.x, t.y, t.r, t.hold); }); }
    };
  };

  // ---------- Son yomg'iri ----------
  M.yomgir = function () {
    var tp = TOPICS[G.k], b = [], q;
    function nq() {
      q = askQ(tp); setQ(q.q + " = ?", q.rep);
      var o = makeOpts(q, 5), lanes = shuffle([0, 1, 2, 3, 4]), r = Math.max(30, Math.min(W / 12, H / 9));
      b = o.map(function (op, i) { return { x: W * (0.12 + lanes[i] * 0.19), y: -r - i * H * 0.16 - Math.random() * 40, r: r, s: op.s, ok: op.ok, v: H / (6.5 - Math.min(3, lvl() * 0.35)) }; });
    }
    return {
      start: nq,
      update: function (dt) {
        for (var i = b.length - 1; i >= 0; i--) {
          var t = b[i]; t.y += t.v * dt;
          if (t.y > H + t.r) { if (t.ok) { bad(t.x, H - 30, 0, null, q); nq(); return; } b.splice(i, 1); continue; }
          var p = holdPick(t, dt, inCircle(t, 1.15), false, 0.35);
          if (p) { if (t.ok) { good(t.x, t.y, p.player, 0, q.q + " = " + t.s); nq(); return; } bad(t.x, t.y, p.player, null, q); b.splice(i, 1); }
        }
      },
      draw: function () {
        b.forEach(function (t) {
          ctx.strokeStyle = TH.acc + "55"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(t.x, t.y - t.r - 60); ctx.lineTo(t.x, t.y - t.r); ctx.stroke();
          drawBall(t.x, t.y, t.r, t.s); drawHoldRing(t.x, t.y, t.r, t.hold, 0.35);
        });
      }
    };
  };

  // ---------- Orbita (Saturn) ----------
  M.orbita = function () {
    var tp = TOPICS[G.k], b = [], q, ang = 0;
    function geo() { var cx = W / 2, cy = H * 0.56, R0 = Math.min(W * 0.42, H * 0.62), rx = R0, ry = R0 * 0.36, pr = Math.min(W, H) * 0.12; return { cx: cx, cy: cy, rx: rx, ry: ry, pr: pr }; }
    function nq() { q = askQ(tp); setQ(q.q + " = ?", q.rep); var o = makeOpts(q, 5); b = o.map(function (op, i) { return { s: op.s, ok: op.ok, a0: i * Math.PI * 2 / 5, x: 0, y: 0, r: 30 }; }); }
    function planet(g) {
      var gr = ctx.createRadialGradient(g.cx - g.pr * 0.4, g.cy - g.pr * 0.4, g.pr * 0.1, g.cx, g.cy, g.pr);
      gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.25, TH.acc); gr.addColorStop(1, TH.acc2 + "44");
      ctx.fillStyle = gr; ctx.shadowColor = TH.acc; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(g.cx, g.cy, g.pr, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = "#000"; ctx.globalAlpha = 0.65; ctx.font = "900 " + Math.min(g.pr * 0.42, g.pr * 2.4 / Math.max(3, q.q.length * 0.6)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(q.q, g.cx, g.cy); ctx.globalAlpha = 1;
    }
    function ring(g, front) {
      ctx.lineWidth = 3; for (var k = 0; k < 3; k++) { ctx.strokeStyle = TH.acc + (k ? "33" : "77"); ctx.beginPath(); ctx.ellipse(g.cx, g.cy, g.rx * (1 - k * 0.07), g.ry * (1 - k * 0.07), 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); ctx.stroke(); }
    }
    return {
      start: nq,
      update: function (dt) {
        ang += dt * (0.35 + lvl() * 0.05); var g = geo();
        for (var i = 0; i < b.length; i++) {
          var t = b[i], a = ang + t.a0; t.x = g.cx + Math.cos(a) * g.rx; t.y = g.cy + Math.sin(a) * g.ry; t.z = Math.sin(a); t.r = Math.max(26, Math.min(W, H) * 0.075) * (0.8 + 0.25 * (t.z + 1) / 2);
          var p = holdPick(t, dt, inCircle(t, 1.1));
          if (p) { if (t.ok) { good(t.x, t.y, p.player, 0, q.q + " = " + t.s); nq(); return; } bad(t.x, t.y, p.player, null, q); b.splice(i, 1); return; }
        }
      },
      draw: function () {
        if (!q) return; var g = geo();
        ring(g, false); b.filter(function (t) { return t.z < 0; }).forEach(function (t) { ctx.globalAlpha = 0.75; drawBall(t.x, t.y, t.r, t.s, { c: TH.acc2 }); ctx.globalAlpha = 1; drawHoldRing(t.x, t.y, t.r, t.hold); });
        planet(g); ring(g, true);
        b.filter(function (t) { return t.z >= 0; }).forEach(function (t) { drawBall(t.x, t.y, t.r, t.s); drawHoldRing(t.x, t.y, t.r, t.hold); });
      }
    };
  };

  // ---------- Snayper ----------
  M.nishon = function () {
    var tp = TOPICS[G.k], b = [], q, lasers = [];
    function nq() {
      q = askQ(tp); setQ("🎯 " + q.q + " = ?", q.rep); var o = makeOpts(q, 5), r = Math.max(32, Math.min(W / 11, H / 9));
      b = o.map(function (op, i) { var row = i % 3, dir = row % 2 ? -1 : 1; return { s: op.s, ok: op.ok, r: r, x: Math.random() * W, y: H * (0.32 + row * 0.2), v: dir * (W / 9) * (0.7 + Math.random() * 0.6) * (1 + lvl() * 0.08) }; });
    }
    return {
      start: nq,
      update: function (dt) {
        b.forEach(function (t) { t.x += t.v * dt; if (t.x > W + t.r) t.x = -t.r; if (t.x < -t.r) t.x = W + t.r; });
        pointers.forEach(function (p) {
          if (!p.pinchStart) return;
          var aim = p.hand ? { x: p.hand.pts[7].x, y: p.hand.pts[7].y } : p;
          var from = CFG.duel ? { x: p.player ? W * 0.85 : W * 0.15, y: H } : { x: W / 2, y: H };
          lasers.push({ a: from, b: { x: aim.x, y: aim.y }, l: 0.25, c: p.col }); tone(1600, 180, 0.18, "square", 0.06);
          for (var i = 0; i < b.length; i++) {
            var t = b[i]; if (Math.hypot(aim.x - t.x, aim.y - t.y) < t.r * 1.25) {
              if (t.ok) { good(t.x, t.y, p.player, 0, q.q + " = " + t.s); nq(); } else { bad(t.x, t.y, p.player, null, q); b.splice(i, 1); }
              return;
            }
          }
        });
      },
      draw: function (dt) {
        b.forEach(function (t) {
          ctx.lineWidth = 3; [1, 0.72, 0.44].forEach(function (k, j) { ctx.strokeStyle = j % 2 ? "#ffffff88" : TH.acc; ctx.beginPath(); ctx.arc(t.x, t.y, t.r * k, 0, 7); ctx.stroke(); });
          drawBall(t.x, t.y, t.r * 0.8, t.s, { glow: 8 });
        });
        pointers.forEach(function (p) {
          var a = p.hand ? p.hand.pts[7] : p; ctx.strokeStyle = p.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(a.x, a.y, 20, 0, 7);
          ctx.moveTo(a.x - 30, a.y); ctx.lineTo(a.x - 10, a.y); ctx.moveTo(a.x + 10, a.y); ctx.lineTo(a.x + 30, a.y); ctx.moveTo(a.x, a.y - 30); ctx.lineTo(a.x, a.y - 10); ctx.moveTo(a.x, a.y + 10); ctx.lineTo(a.x, a.y + 30); ctx.stroke();
        });
        for (var i = lasers.length - 1; i >= 0; i--) { var L = lasers[i]; L.l -= dt; if (L.l <= 0) { lasers.splice(i, 1); continue; } ctx.strokeStyle = L.c; ctx.shadowColor = L.c; ctx.shadowBlur = 20; ctx.lineWidth = 5 * L.l / 0.25; ctx.beginPath(); ctx.moveTo(L.a.x, L.a.y); ctx.lineTo(L.b.x, L.b.y); ctx.stroke(); ctx.shadowBlur = 0; }
      }
    };
  };

  // ---------- Klaviatura ----------
  M.pianino = function () {
    var tp = TOPICS[G.k], keys = [], q, typed = "", ans = "", msgT = 0;
    var labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "⌫"];
    function layout() {
      var two = W < 700, cols = two ? 6 : 12, kw = Math.min(two ? (W * 0.94) / 6 : (W * 0.94) / 12, 100), kh = Math.min(kw * 1.35, H * (two ? 0.17 : 0.26));
      var x0 = (W - kw * cols) / 2, y0 = two ? H * 0.5 : H * 0.58;
      keys = labels.map(function (l, i) { var c = i % cols, r = Math.floor(i / cols); return { l: l, x: x0 + c * kw + 3, y: y0 + r * (kh + 8), w: kw - 6, h: kh, hold: 0, lock: false, flash: 0, hue: i * 30 }; });
    }
    function nq() { q = askQ(tp); ans = mstr(q.a); typed = ""; setQ(q.q + " = ?", q.rep); }
    function press(k, p) {
      k.flash = 0.25; var f = 260 * Math.pow(2, keys.indexOf(k) / 12); beep(f, 0.25, "triangle", 0.1);
      burst(k.x + k.w / 2, k.y, 10, null, 0.5);
      if (k.l === "⌫") typed = typed.slice(0, -1); else if (k.l === "−") { if (!typed) typed = "−"; } else typed += k.l;
      if (typed === ans) { good(W / 2, H * 0.32, p.player, 0, q.q + " = " + ans); nq(); }
      else if (typed.replace("−", "").length >= ans.replace("−", "").length && typed.length >= ans.length) { msgT = 1.6; msg = "Siz yozdingiz: " + typed; bad(W / 2, H * 0.32, p.player, null, q); typed = ""; nq(); }
    }
    var msg = "";
    return {
      start: function () { layout(); nq(); }, resize: layout,
      update: function (dt) {
        keys.forEach(function (k) {
          var inside = function (p) { return p.x > k.x && p.x < k.x + k.w && p.y > k.y && p.y < k.y + k.h; };
          var any = pointers.some(inside);
          if (!any) { k.lock = false; k.hold = 0; return; }
          if (k.lock) return;
          var p = holdPick(k, dt, inside, false, 0.28);
          if (p) { k.lock = true; press(k, p); }
        });
        if (msgT > 0) msgT -= dt;
      },
      draw: function (dt) {
        var bw = Math.min(W * 0.6, 360), bh = Math.min(70, H * 0.1);
        drawBox(W / 2 - bw / 2, H * 0.26, bw, bh, typed || "…", { fs: bh * 0.6, tc: typed ? "#fff" : "#ffffff55" });
        if (msgT > 0) { ctx.fillStyle = "#ff8a8a"; ctx.font = "700 18px " + FONT; ctx.textAlign = "center"; ctx.fillText(msg, W / 2, H * 0.26 + bh + 24); }
        keys.forEach(function (k) {
          var c = TH.sk === "rainbow" || G.th === "neon" && G.m === "pianino" && G.k === "ketma" ? "hsl(" + k.hue + ",100%,60%)" : TH.acc;
          if (k.flash > 0) k.flash -= dt;
          drawBox(k.x, k.y + (k.flash > 0 ? 6 : 0), k.w, k.h, k.l, { c: c, fill: k.flash > 0 ? c + "88" : "rgba(0,0,0,.5)", glow: k.flash > 0 ? 30 : 12, fs: Math.min(k.w * 0.5, k.h * 0.4) });
          if (k.hold > 0 && !k.lock) { ctx.fillStyle = "#ffffff55"; ctx.fillRect(k.x, k.y + k.h - 6, k.w * Math.min(1, k.hold / 0.28), 6); }
        });
      }
    };
  };

  // ---------- Barmoq bilan sanash ----------
  M.barmoq = function () {
    // 10 dan katta javoblar "xona-xona" ko'rsatiladi: avval o'nliklar (0–9 barmoq), keyin birliklar.
    var BIG = { kichik: "qoshish", ildizKichik: "ildiz", kichikAralash: "aralash" };
    var tp = TOPICS[(CFG.diff > 1 && BIG[G.k]) || G.k], q, st = [], btns = [], typed = "", wrongT = 0;
    var XONA = ["birliklar", "o'nliklar", "yuzliklar"];
    function NP() { return CFG.duel && !mouseMode ? 2 : 1; }
    function maxA() { return CFG.diff === 1 ? 10 : CFG.diff === 2 ? 99 : 999; }
    function reset() { st = []; for (var i = 0; i < 2; i++) st.push({ dg: [], hold: 0, last: -1, cool: 0 }); typed = ""; }
    function nq() { q = askQ(tp, function (x) { return typeof x.a === "number" && x.a >= 0 && x.a <= maxA() && x.a === Math.round(x.a); }); setQ(q.q + " = ?", q.rep); reset(); wrongT = 0; }
    function digitMode() { return q && (q.a > 10 || (mouseMode && CFG.diff > 1)); }
    function plOf(h) { return CFG.duel && h.pts[0].x >= W / 2 ? 1 : 0; }
    function counts() { var c = [0, 0], n = [0, 0]; hands.forEach(function (h) { var pl = plOf(h); c[pl] += h.fingers; n[pl]++; }); return { c: c, n: n }; }
    function cxOf(pl) { return CFG.duel ? (pl ? W * 0.75 : W * 0.25) : W / 2; }
    function layout() {
      var vals = CFG.diff === 1 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1];
      var n = vals.length, w = Math.min(70, W * 0.9 / n); btns = [];
      vals.forEach(function (v, i) { btns.push({ v: v, x: W / 2 - w * n / 2 + i * w + 3, y: H - w - 50, w: w - 6, h: w - 6 }); });
    }
    function check(pl, val) {
      if (val === q.a) { good(cxOf(pl), H * 0.45, pl, q.a > 10 ? 15 : 0, q.e); nq(); return true; }
      bad(cxOf(pl), H * 0.45, pl, null, q); st[pl].dg = []; typed = ""; return false;
    }
    return {
      start: function () { layout(); nq(); }, resize: layout,
      update: function (dt) {
        if (mouseMode) {
          pointers.forEach(function (p) {
            if (!p.pinchStart) return;
            btns.forEach(function (b) {
              if (!(p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h)) return;
              if (!digitMode()) { if (b.v === q.a) { good(b.x + b.w / 2, b.y, 0, 0, q.e); nq(); } else bad(b.x + b.w / 2, b.y, 0, null, q); return; }
              if (b.v < 0) { typed = typed.slice(0, -1); return; }
              typed += b.v; beep(520 + b.v * 30, 0.05);
              if (typed.length >= String(q.a).length) check(0, +typed);
            });
          });
          return;
        }
        var C = counts();
        for (var pl = 0; pl < NP(); pl++) {
          var s = st[pl], v = C.c[pl];
          if (!digitMode()) {
            if (v === q.a && C.n[pl]) { s.hold += dt; if (s.hold > 0.9) { check(pl, v); return; } }
            else s.hold = Math.max(0, s.hold - dt * 2);
            continue;
          }
          // xona-xona kiritish
          if (s.cool > 0) { s.cool -= dt; s.hold = 0; continue; }
          if (C.n[pl] && v <= 9 && v === s.last) {
            s.hold += dt;
            if (s.hold > 1.1) {
              s.dg.push(v); s.hold = 0; s.last = -1; s.cool = 0.7; beep(600 + v * 40, 0.08, "triangle");
              ftext(cxOf(pl), H - 200, String(v), TH.acc);
              if (s.dg.length >= String(q.a).length) { if (check(pl, +s.dg.join(""))) return; }
            }
          } else { s.hold = 0; s.last = C.n[pl] && v <= 9 ? v : -1; }
        }
        wrongT += dt;
        if (wrongT > 10) {
          wrongT = -99;
          var D = String(q.a);
          teach(q.e + (D.length > 1 ? " → avval " + D.split("").map(function (d, i) { return d + " ta (" + XONA[D.length - 1 - i] + ")"; }).join(", keyin ") + " barmoq ko'rsating" : " → " + q.a + " ta barmoq ko'rsating"), "hint", 4500);
          logMiss(q);
        }
      },
      draw: function () {
        if (!q) return;
        var D = String(q.a), dm = digitMode();
        if (mouseMode) {
          btns.forEach(function (b) { drawBox(b.x, b.y, b.w, b.h, b.v < 0 ? "⌫" : String(b.v)); });
          if (dm) { var sw = 56, x0 = W / 2 - D.length * (sw + 8) / 2; for (var i = 0; i < D.length; i++) drawBox(x0 + i * (sw + 8), H * 0.42, sw, sw * 1.2, typed[i] != null ? typed[i] : "", { c: i === typed.length ? TH.acc2 : TH.acc, fs: 34 }); }
          ctx.fillStyle = "#cfd8ef"; ctx.font = "600 14px " + FONT; ctx.textAlign = "center"; ctx.fillText(dm ? "Kamerasiz rejim: javob raqamlarini ketma-ket bosing" : "Kamerasiz rejim: javob tugmasini bosing", W / 2, H - 24); return;
        }
        hands.forEach(function (h) { var x = h.pts[0].x, y = Math.min(h.pts[12].y, h.pts[8].y) - 40; ctx.font = "900 " + (U * 7 + 10) + "px " + FONT; ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.shadowColor = TH.acc; ctx.shadowBlur = 18; ctx.fillText(h.fingers, x, y); ctx.shadowBlur = 0; });
        var C = counts();
        for (var pl = 0; pl < NP(); pl++) {
          var cx = cxOf(pl), cy = H - 90, r = 52, s = st[pl], pc = CFG.duel ? (pl ? "#ff5c8a" : "#4dd2ff") : TH.acc;
          drawBall(cx, cy, r, String(C.c[pl]), { c: C.c[pl] > 9 && dm ? "#ff6b6b" : pc, max: 48 });
          drawHoldRing(cx, cy, r, s.hold, dm ? 1.1 : 0.9);
          ctx.fillStyle = "#cfd8ef"; ctx.font = "600 13px " + FONT; ctx.textAlign = "center";
          ctx.fillText((CFG.duel ? (pl ? "2-o'yinchi" : "1-o'yinchi") + " barmoqlari" : "Jami barmoqlar"), cx, cy - r - 12);
          if (dm) {
            var k = s.dg.length, sw = Math.min(64, W * 0.08), x0 = cx - D.length * (sw + 8) / 2 + 4, y0 = cy - r - 40 - sw * 1.25;
            for (var i = 0; i < D.length; i++) drawBox(x0 + i * (sw + 8), y0, sw, sw * 1.2, s.dg[i] != null ? String(s.dg[i]) : (i === k && C.n[pl] && C.c[pl] <= 9 ? String(C.c[pl]) : "?"), { c: i === k ? TH.acc2 : i < k ? "#5ee67a" : "#556", fs: sw * 0.6, tc: i === k && s.dg[i] == null ? "#ffffff88" : "#fff" });
            ctx.fillStyle = "#fff"; ctx.font = "800 " + (U * 1.6 + 9) + "px " + FONT; ctx.shadowColor = "#000"; ctx.shadowBlur = 6;
            ctx.fillText(k < D.length ? "👉 " + XONA[D.length - 1 - k] + " xonasini ko'rsating (0–9) · " + D.length + " xonali son" : "", cx, y0 - 14);
            if (C.c[pl] > 9) ctx.fillText("Bitta xonaga 0–9 barmoq! (musht = 0)", cx, cy + r + 22);
            ctx.shadowBlur = 0;
          }
        }
        if (CFG.duel) { ctx.strokeStyle = "#ffffff33"; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(W / 2, 100); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]); }
      }
    };
  };

  // ---------- Kesish ----------
  M.kesish = function () {
    var rule = RULES[G.k], items = [], spawnT = 0, halves = [];
    function spawn() {
      var v = rule.gen(lvl()), r = Math.max(30, Math.min(W / 13, H / 9)), g = H * 1.25, h = H * (0.5 + Math.random() * 0.3), x = W * (0.15 + Math.random() * 0.7);
      items.push({ v: v, s: (rule.s || String)(v), ok: rule.ok(v), x: x, y: H + r, vx: (W / 2 - x) * (0.2 + Math.random() * 0.3), vy: -Math.sqrt(2 * g * h), g: g, r: r, rot: 0, vr: (Math.random() - 0.5) * 3 });
    }
    function segDist(px, py, ax, ay, bx, by) { var dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1, t = clamp(((px - ax) * dx + (py - ay) * dy) / l, 0, 1); return Math.hypot(px - (ax + t * dx), py - (ay + t * dy)); }
    return {
      start: function () { setQ(rule.n); },
      update: function (dt) {
        spawnT -= dt; if (spawnT <= 0) { spawn(); if (Math.random() < 0.3 + lvl() * 0.05) spawn(); spawnT = Math.max(0.55, 1.2 - lvl() * 0.07); }
        for (var i = items.length - 1; i >= 0; i--) {
          var t = items[i]; t.vy += t.g * dt; t.x += t.vx * dt; t.y += t.vy * dt; t.rot += t.vr * dt;
          if (t.y > H + t.r * 2 && t.vy > 0) { items.splice(i, 1); continue; }
          for (var j = 0; j < pointers.length; j++) {
            var p = pointers[j], fast = mouseMode ? (mouse.down && p.speed > 250) : p.speed > 650;
            if (fast && segDist(t.x, t.y, p.px, p.py, p.x, p.y) < t.r) {
              if (t.ok) good(t.x, t.y, p.player, 0, t.s + " ✓"); else bad(t.x, t.y, p.player, EXR[G.k](t.v));
              var ang = Math.atan2(p.y - p.py, p.x - p.px);
              halves.push({ x: t.x, y: t.y, vx: -Math.sin(ang) * 120 + t.vx * 0.3, vy: -100, s: t.s, r: t.r, side: -1, a: ang, l: 0.9, ok: t.ok }, { x: t.x, y: t.y, vx: Math.sin(ang) * 120 + t.vx * 0.3, vy: -60, s: t.s, r: t.r, side: 1, a: ang, l: 0.9, ok: t.ok });
              items.splice(i, 1); break;
            }
          }
        }
      },
      draw: function (dt) {
        items.forEach(function (t) { ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.rot * 0.15); drawBall(0, 0, t.r, t.s); ctx.restore(); });
        for (var i = halves.length - 1; i >= 0; i--) {
          var h = halves[i]; h.l -= dt; if (h.l <= 0) { halves.splice(i, 1); continue; } h.vy += H * 1.2 * dt; h.x += h.vx * dt; h.y += h.vy * dt;
          ctx.save(); ctx.globalAlpha = Math.min(1, h.l * 2); ctx.translate(h.x, h.y); ctx.rotate(h.a); ctx.beginPath(); ctx.rect(-h.r * 1.2, h.side < 0 ? -h.r * 1.2 : 0, h.r * 2.4, h.r * 1.2); ctx.clip(); ctx.rotate(-h.a); drawBall(0, 0, h.r, h.s, { c: h.ok ? TH.acc : "#ff4d4d" }); ctx.restore();
        }
        pointers.forEach(function (p) { if (p.speed > (mouseMode ? 250 : 650) && (!mouseMode || mouse.down)) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.shadowColor = TH.acc; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.shadowBlur = 0; } });
      }
    };
  };

  // ---------- Savat bilan tutish ----------
  M.tutish = function () {
    var rule = RULES[G.k], items = [], spawnT = 0;
    function basketW() { return Math.max(110, W * 0.16); }
    return {
      start: function () { setQ(rule.n); },
      update: function (dt) {
        spawnT -= dt; if (spawnT <= 0) { var v = rule.gen(lvl()), r = Math.max(26, Math.min(W / 16, H / 11)); items.push({ v: v, s: (rule.s || String)(v), ok: rule.ok(v), x: W * (0.08 + Math.random() * 0.84), y: -r, r: r, vy: H / (4.8 - Math.min(2.2, lvl() * 0.2)) * (0.8 + Math.random() * 0.4) }); spawnT = Math.max(0.45, 1.1 - lvl() * 0.06); }
        var by = H - 9 * U - 40, bw = basketW();
        for (var i = items.length - 1; i >= 0; i--) {
          var t = items[i], py = t.y; t.y += t.vy * dt;
          if (py < by && t.y >= by) {
            for (var j = 0; j < pointers.length; j++) { var p = pointers[j]; if (Math.abs(t.x - p.palm.x) < bw / 2 + t.r * 0.4) { if (t.ok) good(t.x, by, p.player, 0, t.s + " ✓"); else bad(t.x, by, p.player, EXR[G.k](t.v)); items.splice(i, 1); break; } }
            continue;
          }
          if (t.y > H + t.r) items.splice(i, 1);
        }
      },
      draw: function () {
        items.forEach(function (t) { drawBall(t.x, t.y, t.r, t.s); });
        var by = H - 9 * U - 40, bw = basketW();
        pointers.forEach(function (p) {
          var x = clamp(p.palm.x, bw / 2, W - bw / 2); ctx.strokeStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 20; ctx.lineWidth = 5; ctx.fillStyle = p.col + "22";
          ctx.beginPath(); ctx.moveTo(x - bw / 2, by); ctx.lineTo(x - bw * 0.38, by + 60); ctx.lineTo(x + bw * 0.38, by + 60); ctx.lineTo(x + bw / 2, by); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.lineWidth = 1; ctx.strokeStyle = p.col + "77"; for (var k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(x - bw / 2 + k * bw / 5, by); ctx.lineTo(x - bw * 0.38 + k * bw * 0.76 / 5, by + 60); ctx.stroke(); }
        });
      }
    };
  };

  // ---------- Ajratish (2 savat) ----------
  M.savat = function () {
    var bin = BINS[G.k], items = [];
    function bins() { var w = W * 0.3, h = H * 0.3; return [{ x: W * 0.03, y: H - h - 20, w: w, h: h, l: bin.L, left: true }, { x: W * 0.97 - w, y: H - h - 20, w: w, h: h, l: bin.Rt, left: false }]; }
    function spawn() {
      var n = Math.max(1, Math.min(2, mouseMode ? 1 : CFG.hands)); var r = Math.max(34, Math.min(W / 12, H / 9));
      while (items.length < n) { var g = bin.gen(lvl()), hx = W * (n === 1 ? 0.5 : items.length ? 0.62 : 0.38); items.push({ g: g, s: g.s, hx: hx, hy: H * 0.38, x: hx, y: -r, r: r, held: null }); }
    }
    function ptrById(id) { for (var i = 0; i < pointers.length; i++) if (pointers[i].id === id) return pointers[i]; return null; }
    return {
      start: function () { setQ(bin.n + " — ushlab savatga tashlang"); spawn(); },
      update: function (dt) {
        var B = bins();
        pointers.forEach(function (p) {
          if (p.pinchStart && !p.grab) { for (var i = 0; i < items.length; i++) { var t = items[i]; if (!t.held && Math.hypot(p.x - t.x, p.y - t.y) < t.r * 1.4) { t.held = p.id; p.grab = t; beep(500, 0.05); break; } } }
        });
        for (var i = items.length - 1; i >= 0; i--) {
          var t = items[i], p = t.held ? ptrById(t.held) : null;
          if (t.held && p && p.pinch) { var tx = p.hand ? (p.hand.pts[4].x + p.hand.pts[8].x) / 2 : p.x, ty = p.hand ? (p.hand.pts[4].y + p.hand.pts[8].y) / 2 : p.y; t.x += (tx - t.x) * 0.6; t.y += (ty - t.y) * 0.6; continue; }
          if (t.held) { // qo'yib yuborildi
            if (p) p.grab = null; t.held = null;
            var inb = null; B.forEach(function (b) { if (t.x > b.x && t.x < b.x + b.w && t.y > b.y - t.r && t.y < b.y + b.h) inb = b; });
            if (inb) { var pl = p ? p.player : 0; if (inb.left === t.g.left) { good(t.x, t.y, pl, 0, t.s + " → " + inb.l); items.splice(i, 1); spawn(); continue; } bad(t.x, t.y, pl, EXR[G.k](t.g)); shake(t); }
          }
          t.x += (t.hx - t.x) * Math.min(1, dt * 3); t.y += (t.hy + Math.sin(tGlobal * 2 + i) * 6 - t.y) * Math.min(1, dt * 3);
        }
      },
      draw: function (dt) {
        bins().forEach(function (b, i) {
          var hot = items.some(function (t) { return t.held && t.x > b.x && t.x < b.x + b.w && t.y > b.y - t.r; });
          drawBox(b.x, b.y, b.w, b.h, null, { c: i ? TH.acc2 : TH.acc, fill: hot ? (i ? TH.acc2 : TH.acc) + "33" : "rgba(0,0,0,.4)", glow: hot ? 30 : 12, lw: 3 });
          ctx.fillStyle = "#fff"; ctx.font = "900 " + Math.min(b.h * 0.25, b.w / Math.max(4, b.l.length * 0.65)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(b.l, b.x + b.w / 2, b.y + b.h / 2);
        });
        items.forEach(function (t) { var sx = shx(t, dt); drawBall(t.x + sx, t.y, t.r * (t.held ? 1.1 : 1), t.s, { glow: t.held ? 40 : 20 }); });
      }
    };
  };

  // ---------- Tutashtirish ----------
  M.tutash = function () {
    var ch = CHAINS[G.k], dots = [], seq, next = 0, path = [];
    function nq() {
      var c = ch.gen(lvl()); seq = c.seq; next = 0; path = []; setQ(c.q);
      var vals = shuffle(c.seq.map(function (v) { return { v: v, ok: true }; }).concat(c.wrong.map(function (v) { return { v: v, ok: false }; })));
      var r = Math.max(28, Math.min(W / 16, H / 11)), pos = scatter(vals.length, r);
      dots = vals.map(function (o, i) { return { v: o.v, s: String(o.v), x: pos[i].x, y: pos[i].y, r: r, done: false }; });
    }
    return {
      start: nq,
      update: function (dt) {
        if (next < 0) return;
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i]; if (d.done) continue;
          var p = holdPick(d, dt, inCircle(d, 1.1), false, 0.35);
          if (p) {
            if (d.v === seq[next]) { d.done = true; path.push(d); next++; sTick(400 + next * 80); burst(d.x, d.y, 14, null, 0.6); if (next === seq.length) { good(d.x, d.y, p.player, 30, seq.join(" → ")); setTimeout(nq, 500); next = -99; } }
            else { bad(d.x, d.y, p.player, d.v + (d.v % seq[0] ? " " + seq[0] + " ga bo'linmaydi" : " — hali erta") + ". Navbatdagisi: " + seq[next] + " = " + seq[0] + " × " + (next + 1)); shake(d); }
          }
        }
      },
      draw: function (dt) {
        if (path.length) { ctx.strokeStyle = TH.acc; ctx.shadowColor = TH.acc; ctx.shadowBlur = 20; ctx.lineWidth = 6; ctx.beginPath(); path.forEach(function (d, i) { i ? ctx.lineTo(d.x, d.y) : ctx.moveTo(d.x, d.y); }); if (pointers[0] && next >= 0 && next < seq.length) { ctx.globalAlpha = 0.4; } ctx.stroke(); ctx.globalAlpha = 1; ctx.shadowBlur = 0; }
        dots.forEach(function (d) { var sx = shx(d, dt); drawBall(d.x + sx, d.y, d.r, d.s, { c: d.done ? "#ffffff" : TH.acc, glow: d.done ? 30 : 16 }); drawHoldRing(d.x, d.y, d.r, d.hold, 0.35); });
      }
    };
  };

  // ---------- Xotira juftlari ----------
  M.xotira = function () {
    var gen = PAIRS[G.k], cards = [], open = [], waitT = 0, matched = 0;
    function nq() {
      var pairs = [], used = {};
      var NPR = [4, 6, 8][(CFG.diff | 0 || 2) - 1]; while (pairs.length < NPR) { var pr = gen(); if (used[pr[0]] || used[pr[1]]) continue; used[pr[0]] = used[pr[1]] = 1; pairs.push(pr); }
      var list = []; pairs.forEach(function (pr, i) { list.push({ s: pr[0], id: i }, { s: pr[1], id: i }); });
      list = shuffle(list); var port = H > W, cols = port ? (list.length > 12 ? 4 : list.length > 8 ? 3 : 2) : 4, rows = Math.ceil(list.length / cols);
      var aw = W * 0.92, ah = H * 0.72, cw = Math.min(aw / cols, ah / rows * 1.3), chh = Math.min(ah / rows, cw / 1.3);
      var x0 = (W - cw * cols) / 2, y0 = H * 0.22 + (ah - chh * rows) / 2;
      cards = list.map(function (c, i) { return { s: c.s, id: c.id, x: x0 + (i % cols) * cw + 5, y: y0 + Math.floor(i / cols) * chh + 5, w: cw - 10, h: chh - 10, st: 0, flip: 0 }; });
      open = []; matched = 0; setQ("Teng juftlarni toping");
    }
    return {
      start: nq, resize: function () {},
      update: function (dt) {
        if (waitT > 0) { waitT -= dt; if (waitT <= 0) { open.forEach(function (c) { c.st = 0; }); open = []; } return; }
        cards.forEach(function (c) {
          if (c.st) return;
          var inside = function (p) { return p.x > c.x && p.x < c.x + c.w && p.y > c.y && p.y < c.y + c.h; };
          var p = holdPick(c, dt, inside, false, 0.4);
          if (p && open.length < 2) {
            c.st = 1; open.push(c); sTick(600);
            if (open.length === 2) {
              if (open[0].id === open[1].id) { open.forEach(function (o) { o.st = 2; }); good(c.x + c.w / 2, c.y + c.h / 2, p.player, 0, open[0].s + "  =  " + open[1].s); teach(open[0].s + "  =  " + open[1].s, true, 1500); open = []; matched++; if (matched === 6) { ftext(W / 2, H / 2, "ZO'R! +20", TH.acc); S.score[p.player] += 20; setTimeout(nq, 900); } }
              else { waitT = 1.1; S.streak = 0; tone(300, 200, 0.2, "triangle", 0.07); teach(open[0].s + "  ≠  " + open[1].s + " — eslab qoling, qayerda turganini!", "hint", 1500); }
            }
          }
        });
      },
      draw: function (dt) {
        cards.forEach(function (c) {
          c.flip += ((c.st ? 1 : 0) - c.flip) * Math.min(1, dt * 10);
          var sx = Math.abs(Math.cos(c.flip * Math.PI)), face = c.flip > 0.5, cx = c.x + c.w / 2;
          ctx.save(); ctx.translate(cx, 0); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-cx, 0);
          if (face) drawBox(c.x, c.y, c.w, c.h, c.s, { c: c.st === 2 ? "#5ee67a" : TH.acc, fill: c.st === 2 ? "rgba(94,230,122,.2)" : "rgba(0,0,0,.6)", fs: Math.min(c.h * 0.36, c.w / Math.max(2.5, c.s.length * 0.6)) });
          else { drawBox(c.x, c.y, c.w, c.h, "?", { c: TH.acc2, fill: TH.acc2 + "22", fs: c.h * 0.4, tc: TH.acc2 }); }
          ctx.restore();
          if (!c.st && c.hold > 0) { ctx.fillStyle = "#ffffff66"; ctx.fillRect(c.x, c.y + c.h - 6, c.w * Math.min(1, c.hold / 0.4), 6); }
        });
      }
    };
  };

  // ---------- Tartiblash ----------
  M.tartib = function () {
    var ord = ORDERS[G.k], items = [], sorted = [], next = 0;
    function nq() {
      var list = ord.gen(lvl()), r = Math.max(32, Math.min(W / 13, H / 9.5)), pos = scatter(list.length, r);
      items = list.map(function (o, i) { return { v: o.v, s: o.s, x: pos[i].x, y: pos[i].y, r: r, n: 0 }; });
      sorted = items.slice().sort(function (a, b) { return a.v - b.v; }); next = 0; setQ(ord.n);
    }
    return {
      start: nq,
      update: function (dt) {
        if (next >= sorted.length) return;
        for (var i = 0; i < items.length; i++) {
          var t = items[i]; if (t.n) continue;
          var p = holdPick(t, dt, inCircle(t, 1.1), false, 0.4);
          if (p) {
            if (Math.abs(t.v - sorted[next].v) < 1e-9) { next++; t.n = next; sTick(400 + next * 90); burst(t.x, t.y, 14, null, 0.6); if (next === sorted.length) { good(t.x, t.y, p.player, 25); teach(sorted.map(function (o) { return o.s; }).join("  <  "), true, 2200); setTimeout(nq, 600); } }
            else { bad(t.x, t.y, p.player, t.s + " emas — navbatdagisi " + sorted[next].s + ".  Tartib: " + sorted.map(function (o) { return o.s; }).join(" < ") + (G.k === "kasr" ? "  (kasrni bo'lib solishtiring: " + sorted[next].s + " = " + (Math.round(sorted[next].v * 100) / 100).toString().replace(".", ",") + ")" : "")); shake(t); }
          }
        }
      },
      draw: function (dt) {
        var done = items.filter(function (t) { return t.n; }).sort(function (a, b) { return a.n - b.n; });
        if (done.length > 1) { ctx.strokeStyle = TH.acc + "aa"; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); done.forEach(function (t, i) { i ? ctx.lineTo(t.x, t.y) : ctx.moveTo(t.x, t.y); }); ctx.stroke(); ctx.setLineDash([]); }
        items.forEach(function (t) {
          var sx = shx(t, dt); drawBall(t.x + sx, t.y, t.r, t.s, { c: t.n ? "#5ee67a" : TH.acc }); drawHoldRing(t.x, t.y, t.r, t.hold, 0.4);
          if (t.n) { ctx.fillStyle = "#5ee67a"; ctx.beginPath(); ctx.arc(t.x + t.r * 0.8, t.y - t.r * 0.8, 13, 0, 7); ctx.fill(); ctx.fillStyle = "#000"; ctx.font = "900 14px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t.n, t.x + t.r * 0.8, t.y - t.r * 0.8); }
        });
      }
    };
  };

  // ---------- Son o'qi ----------
  M.sonoq = function () {
    var L = LINES[G.k], tg, still = {}, reveal = 0, lastGuess = null;
    function geo() { return { x0: W * 0.07, x1: W * 0.93, y: H * 0.6 }; }
    function val(x) { var g = geo(); return L.min + clamp((x - g.x0) / (g.x1 - g.x0), 0, 1) * (L.max - L.min); }
    function xOf(v) { var g = geo(); return g.x0 + (v - L.min) / (L.max - L.min) * (g.x1 - g.x0); }
    function nq() { tg = L.gen(); setQ(tg.s + " sonini son o'qida ko'rsating"); still = {}; }
    function submit(p, v) {
      var g = geo(); lastGuess = { x: xOf(v), t: 1.4 }; reveal = 1.4; var rv = tg;
      var fmt = function (x) { return (Math.round(x * 100) / 100).toString().replace(".", ","); };
      var ex = tg.s + " ≈ " + fmt(tg.v);
      if (G.k === "ildiz") { var n = Math.round(tg.v * tg.v), r0 = Math.floor(tg.v); ex = r0 + "² = " + (r0 * r0) + " < " + n + " < " + ((r0 + 1) * (r0 + 1)) + " = " + (r0 + 1) + "²  →  " + tg.s + " ≈ " + fmt(tg.v) + " (" + r0 + " va " + (r0 + 1) + " orasida)"; }
      if (G.k === "kasr") { var pq = tg.s.split("/"); ex = tg.s + " = " + pq[0] + " : " + pq[1] + " = " + fmt(tg.v) + (tg.v > 1 ? "  (1 dan katta — maxraj suratdan kichik)" : ""); }
      if (Math.abs(v - tg.v) <= L.tol * [1.6, 1, 0.6][(CFG.diff | 0 || 2) - 1]) good(xOf(tg.v), g.y, p.player, 0, tg.s + " ≈ " + fmt(tg.v)); else bad(xOf(v), g.y, p.player, ex + "   (siz " + fmt(v) + " ni ko'rsatdingiz)");
      lastTarget = rv; nq();
    }
    var lastTarget = null;
    return {
      start: nq,
      update: function (dt) {
        var g = geo();
        if (reveal > 0) reveal -= dt;
        pointers.forEach(function (p) {
          if (Math.abs(p.y - g.y) > H * 0.28 || p.x < g.x0 - 30 || p.x > g.x1 + 30) { still[p.id] = 0; return; }
          var v = val(p.x);
          if (p.pinchStart) { submit(p, v); return; }
          if (p.speed < 70) still[p.id] = (still[p.id] || 0) + dt; else still[p.id] = Math.max(0, (still[p.id] || 0) - dt * 3);
          if (still[p.id] > 1.3) { still[p.id] = 0; submit(p, v); }
        });
      },
      draw: function () {
        var g = geo();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.shadowColor = TH.acc; ctx.shadowBlur = 16; ctx.beginPath(); ctx.moveTo(g.x0, g.y); ctx.lineTo(g.x1, g.y); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.moveTo(g.x1 + 18, g.y); ctx.lineTo(g.x1 + 2, g.y - 9); ctx.lineTo(g.x1 + 2, g.y + 9); ctx.fillStyle = "#fff"; ctx.fill();
        var steps = Math.round((L.max - L.min) / L.ticks);
        for (var i = 0; i <= steps; i++) {
          var v = L.min + i * L.ticks, x = xOf(v), major = Math.abs(v - Math.round(v)) < 1e-9;
          ctx.strokeStyle = major ? "#fff" : "#ffffff88"; ctx.lineWidth = major ? 3 : 2; ctx.beginPath(); ctx.moveTo(x, g.y - (major ? 16 : 9)); ctx.lineTo(x, g.y + (major ? 16 : 9)); ctx.stroke();
          if (major) { ctx.fillStyle = "#fff"; ctx.font = "700 " + (U * 2.6 + 8) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(String(v), x, g.y + 22); }
        }
        // kichik bo'linmalar (o'nliklar)
        if (L.ticks === 1) for (var j = 0; j <= (L.max - L.min) * 10; j++) { if (j % 10 === 0) continue; var xx = xOf(L.min + j / 10); ctx.strokeStyle = "#ffffff33"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xx, g.y - 5); ctx.lineTo(xx, g.y + 5); ctx.stroke(); }
        if (reveal > 0 && lastTarget) { ctx.globalAlpha = Math.min(1, reveal); var tx = xOf(lastTarget.v); ctx.fillStyle = "#5ee67a"; ctx.beginPath(); ctx.moveTo(tx, g.y - 6); ctx.lineTo(tx - 12, g.y - 30); ctx.lineTo(tx + 12, g.y - 30); ctx.fill(); ctx.font = "800 18px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(lastTarget.s + " ≈ " + (Math.round(lastTarget.v * 100) / 100).toString().replace(".", ","), tx, g.y - 34); ctx.globalAlpha = 1; }
        pointers.forEach(function (p) {
          if (Math.abs(p.y - g.y) > H * 0.28) return; var x = clamp(p.x, g.x0, g.x1);
          ctx.strokeStyle = p.col; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(x, p.y); ctx.lineTo(x, g.y); ctx.stroke(); ctx.setLineDash([]);
          drawBall(x, g.y, 14, null, { c: p.col }); drawHoldRing(x, g.y, 14, still[p.id] || 0, 1.3);
        });
      }
    };
  };

  // ---------- Burchak ----------
  M.burchak = function () {
    var A = ANGLES[G.k], tg, holdT = 0, cur = null;
    var hintT = 0;
    function nq() { tg = A.gen(); setQ(tg.q + (G.k === "trig" ? "  →  α ni yasang" : "")); holdT = 0; hintT = 0; }
    function angEx() { return G.k === "trig" ? tg.q.replace("α", tg.a + "°") + "  →  α = " + tg.a + "°" : tg.a + "°" + (tg.a < 90 ? " — o'tkir burchak (90° dan kichik)" : tg.a === 90 ? " — to'g'ri burchak" : " — o'tmas burchak (90° dan katta)"); }
    function line() {
      if (mouseMode) { if (!pointers[0]) return null; return { a: { x: W / 2, y: H * 0.68 }, b: pointers[0] }; }
      if (pointers.length >= 2) { var p = pointers.slice().sort(function (x, y) { return x.x - y.x; }); return { a: p[0], b: p[1] }; }
      if (pointers[0] && pointers[0].hand) return { a: pointers[0].hand.pts[0], b: pointers[0].hand.pts[8] };
      return null;
    }
    function deg(l) { var d = Math.atan2(-(l.b.y - l.a.y), l.b.x - l.a.x) * 180 / Math.PI; if (d < 0) d += 180; if (d >= 180) d -= 180; return d; }
    return {
      start: nq,
      update: function (dt) {
        var l = line(); cur = l ? deg(l) : null;
        var tol = Math.max(3, 6 - lvl() * 0.5);
        var diff = cur == null ? 99 : Math.min(Math.abs(cur - tg.a), Math.abs(cur - tg.a - 180), Math.abs(cur - tg.a + 180));
        if (diff <= tol) { holdT += dt; if (holdT > 1) { var m = l ? { x: (l.a.x + l.b.x) / 2, y: (l.a.y + l.b.y) / 2 } : { x: W / 2, y: H / 2 }; good(m.x, m.y, 0, 0, angEx()); nq(); } }
        hintT += dt; if (hintT > 10 && hintT < 50) { hintT = 99; logMiss(null, angEx()); teach(angEx() + (G.k === "trig" ? "" : ".  0° — gorizontal, 45° — diagonal, 90° — tik"), "hint", 4000); }
        else holdT = Math.max(0, holdT - dt * 2);
      },
      draw: function () {
        var l = line(); if (!l) { ctx.fillStyle = "#cfd8ef"; ctx.font = "600 16px " + FONT; ctx.textAlign = "center"; ctx.fillText("Ikkala qo'lni kameraga ko'rsating", W / 2, H * 0.5); return; }
        var c = l.a, ang = cur * Math.PI / 180, R0 = Math.max(60, Math.min(W, H) * 0.16);
        var dx = l.b.x - l.a.x, dy = l.b.y - l.a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        ctx.strokeStyle = "#ffffff55"; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(c.x - R0 * 1.6, c.y); ctx.lineTo(c.x + R0 * 1.8, c.y); ctx.stroke(); ctx.setLineDash([]);
        var ok = holdT > 0;
        ctx.strokeStyle = ok ? "#5ee67a" : TH.acc; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 20; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(l.a.x - ux * R0 * 1.5, l.a.y - uy * R0 * 1.5); ctx.lineTo(l.b.x + ux * 40, l.b.y + uy * 40); ctx.stroke(); ctx.shadowBlur = 0;
        // yoy
        ctx.fillStyle = (ok ? "#5ee67a" : TH.acc) + "33"; ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.arc(c.x, c.y, R0 * 0.7, 0, -ang, true); ctx.closePath(); ctx.fill();
        // maqsad burchak — xira chiziq
        var ta = tg.a * Math.PI / 180; ctx.strokeStyle = "#ffffff44"; ctx.lineWidth = 3; ctx.setLineDash([4, 8]); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.cos(ta) * R0 * 1.3, c.y - Math.sin(ta) * R0 * 1.3); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#fff"; ctx.font = "900 " + (U * 5 + 12) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = TH.acc; ctx.shadowBlur = 14;
        ctx.fillText(Math.round(cur) + "°", c.x + Math.cos(ang / 2) * R0 * 1.05, c.y - Math.sin(ang / 2) * R0 * 1.05 - 10); ctx.shadowBlur = 0;
        drawHoldRing(c.x, c.y, 18, holdT, 1);
      }
    };
  };

  // ---------- Grafik doskasi (barmoq bilan chizish) ----------
  M.grafik = function () {
    var FREE = CFG.gmode === "erkin";
    var strokes = [], live = {}, task = null, showT = 0, idleT = 0, hintT = 0, plots = [], penCol = 0, lastRes = null;
    var PENS = ["#ffd400", "#4dd2ff", "#ff5c8a", "#5ee67a", "#ffffff"], PLOTC = ["#22c55e", "#4dd2ff", "#ff9100", "#c084fc", "#ff5c8a"];
    var BT = { chk: { l: "✔ Tekshirish" }, clr: { l: "🗑 Tozalash" }, undo: { l: "↩ Bekor" }, col: { l: "🎨 Rang" } };
    // --- geometriya: doska va koordinatalar ---
    function geo() {
      var bx = Math.max(12, W * 0.03), by = FREE ? 60 : 118, side = W > 700 ? 150 : 0, bw = W - bx * 2 - side, bh = H - by - (side ? (FREE ? 70 : 18) : (FREE ? 205 : 92));
      var u = Math.min(bw / 12, bh / 10); if (u * 10 > bh) u = bh / 10;
      var X = bw / u / 2, Y = bh / u / 2;
      return { x: bx, y: by, w: bw, h: bh, u: u, cx: bx + bw / 2, cy: by + bh / 2, X: X, Y: Y, side: side };
    }
    function sx(g, x) { return g.cx + x * g.u; } function sy(g, y) { return g.cy - y * g.u; }
    function wx(g, X) { return (X - g.cx) / g.u; } function wy(g, Y) { return (g.cy - Y) / g.u; }
    function btnRects(g) {
      var keys = FREE ? ["undo", "clr", "col"] : ["chk", "clr", "undo"], out = [];
      keys.forEach(function (k, i) {
        var r = g.side ? { x: g.x + g.w + 12, y: g.y + i * 74, w: g.side - 18, h: 62 } : { x: g.x + i * (g.w / keys.length), y: g.y + g.h + 14, w: g.w / keys.length - 8, h: 58 };
        r.k = k; out.push(r);
      });
      return out;
    }
    // --- funksiyalar (daraja bo'yicha) ---
    function fmtK(k) { return k === 1 ? "" : k === -1 ? "−" : k === 0.5 ? "½" : k === -0.5 ? "−½" : mstr(k); }
    function lin(k, b) { return { f: function (x) { return k * x + b; }, s: "y = " + (k ? fmtK(k) + "x" : "") + (b ? (k ? (b > 0 ? " + " : " − ") + Math.abs(b) : mstr(b)) : (k ? "" : "0")), kp: [[0, b], [k === 0.5 || k === -0.5 ? 2 : 1, k * (k === 0.5 || k === -0.5 ? 2 : 1) + b]], ex: "Chiziqli funksiya: x = 0 da y = " + mstr(b) + ", x ga 1 qo'shilsa y " + (k >= 0 ? k + " ga oshadi" : (-k) + " ga kamayadi") + ". Ikki nuqtani belgilab, to'g'ri chiziq o'tkazing." }; }
    function sh(a) { return a ? (a > 0 ? "(x − " + a + ")" : "(x + " + (-a) + ")") : "x"; }
    function tail(b) { return b ? (b > 0 ? " + " + b : " − " + (-b)) : ""; }
    function newTask() {
      var d = CFG.diff | 0 || 2, l = lvl(), t;
      if (d === 1) { t = R(0, 5) ? lin(pick([-2, -1, 1, 2]), R(-3, 3)) : lin(0, R(-4, 4)); }
      else if (d === 2) {
        var c = R(0, 3);
        if (c === 0) t = lin(pick([-3, -2, -1, -0.5, 0.5, 1, 2, 3]), R(-4, 4));
        else if (c === 1) { var b = R(-4, 2); t = { f: function (x) { return x * x + b; }, s: "y = x²" + tail(b), kp: [[0, b], [1, 1 + b], [-1, 1 + b], [2, 4 + b], [-2, 4 + b]], ex: "Parabola: uchi (0; " + mstr(b) + "), x = ±1 da y = " + mstr(1 + b) + ", x = ±2 da y = " + mstr(4 + b) + ". Shoxlari yuqoriga." }; }
        else if (c === 2) { var b2 = R(-3, 2); t = { f: function (x) { return Math.abs(x) + b2; }, s: "y = |x|" + tail(b2), kp: [[0, b2], [2, 2 + b2], [-2, 2 + b2]], ex: "y = |x| — «V» shakli: uchi (0; " + mstr(b2) + "), ikki tomonga 45° bilan ko'tariladi." }; }
        else { var b3 = R(0, 4); t = { f: function (x) { return -x * x + b3; }, s: "y = −x²" + tail(b3), kp: [[0, b3], [1, b3 - 1], [-1, b3 - 1], [2, b3 - 4], [-2, b3 - 4]], ex: "y = −x² — shoxlari pastga qaragan parabola, uchi (0; " + b3 + ")." }; }
      } else {
        var c2 = R(0, 4 + (l > 6 ? 1 : 0)), a = R(-3, 3), bb = R(-3, 3);
        if (c2 === 0) t = { f: function (x) { return (x - a) * (x - a) + bb; }, s: "y = " + sh(a) + "²" + tail(bb), kp: [[a, bb], [a + 1, bb + 1], [a - 1, bb + 1], [a + 2, bb + 4], [a - 2, bb + 4]], ex: "y = (x − a)² + b: y = x² grafigi " + (a ? (a > 0 ? "o'ngga " + a : "chapga " + (-a)) : "") + (a && bb ? " va " : "") + (bb ? (bb > 0 ? "yuqoriga " + bb : "pastga " + (-bb)) : "") + " birlik suriladi. Uchi (" + mstr(a) + "; " + mstr(bb) + ")." };
        else if (c2 === 1) t = { f: function (x) { return -(x - a) * (x - a) + bb; }, s: "y = −" + sh(a) + "²" + tail(bb), kp: [[a, bb], [a + 1, bb - 1], [a - 1, bb - 1], [a + 2, bb - 4], [a - 2, bb - 4]], ex: "Shoxlari pastga qaragan parabola, uchi (" + mstr(a) + "; " + mstr(bb) + ")." };
        else if (c2 === 2) t = { f: function (x) { return Math.abs(x - a) + bb; }, s: "y = |" + (a ? sh(a).slice(1, -1) : "x") + "|" + tail(bb), kp: [[a, bb], [a + 2, bb + 2], [a - 2, bb + 2]], ex: "«V» shakli, uchi (" + mstr(a) + "; " + mstr(bb) + ")." };
        else if (c2 === 3) t = { f: function (x) { return 0.5 * x * x + bb; }, s: "y = ½x²" + tail(bb), kp: [[0, bb], [2, bb + 2], [-2, bb + 2], [4, bb + 8], [-4, bb + 8]], ex: "y = ½x² — keng parabola: x = ±2 da y = " + mstr(bb + 2) + "." };
        else if (c2 === 4) t = { f: function (x) { return x * x * x / 4; }, s: "y = x³/4", kp: [[0, 0], [2, 2], [-2, -2]], ex: "Kubik parabola: (0;0) nuqtadan o'tadi, x = 2 da y = 2, x = −2 da y = −2." };
        else t = lin(pick([-3, -2, 2, 3, -0.5, 0.5]), R(-5, 5));
      }
      task = t; strokes = []; live = {}; showT = 0; idleT = 0; hintT = 0; lastRes = null;
      setQ(t.s + "  grafigini chizing");
    }
    // --- formulani xavfsiz o'qish (erkin doska) ---
    function parseF(src) {
      var s = String(src || "").toLowerCase().replace(/\s+/g, "").replace(/^y=/, "").replace(/,/g, ".").replace(/−/g, "-").replace(/×/g, "*").replace(/÷|:/g, "/").replace(/²/g, "^2").replace(/³/g, "^3").replace(/√/g, "sqrt");
      if (!s || !/^(?:[0-9x+\-*/^().|]|sin|cos|tan|sqrt|abs|log|pi)+$/.test(s)) return null;
      s = s.replace(/\|([^|]+)\|/g, "abs($1)");
      if (/\|/.test(s)) return null;
      s = s.replace(/(\d|x|\))(?=(x|\(|sin|cos|tan|sqrt|abs|log|pi))/g, "$1*").replace(/(x|pi)(?=\d)/g, "$1*");
      s = s.replace(/\^/g, "**").replace(/(sin|cos|tan|sqrt|abs|log)/g, "Math.$1").replace(/pi/g, "Math.PI");
      try { var f = new Function("x", "return " + s + ";"); f(1); return f; } catch (e) { return null; }
    }
    function addPlot(src) { var f = parseF(src); if (!f) return false; plots.push({ f: f, s: "y = " + String(src).replace(/^\s*y\s*=\s*/i, ""), c: PLOTC[plots.length % PLOTC.length] }); return true; }
    var ui = null;
    function mkUI() {
      ui = document.createElement("div");
      ui.style.cssText = "position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:6;display:flex;gap:6px;align-items:center;background:rgba(0,0,0,.6);border:1px solid " + TH.acc + "66;border-radius:14px;padding:6px 8px;width:min(640px,96vw);flex-wrap:wrap;justify-content:center";
      ui.innerHTML = '<b style="color:#fff">y =</b><input id="kg-f" placeholder="2x+1,  x^2-3,  |x|,  sin(x)" style="flex:1 1 150px;min-width:0;font:inherit;font-size:16px;padding:7px 10px;border-radius:9px;border:1px solid #3a4c74;background:#0b1220;color:#fff">' +
        '<button id="kg-add" class="kv-pill" style="cursor:pointer">📈 Grafik</button><button id="kg-pclr" class="kv-pill" style="cursor:pointer">✖ Grafiklarni o\'chirish</button>';
      body.appendChild(ui);
      var inp = $("kg-f");
      function go() { if (addPlot(inp.value)) { inp.value = ""; inp.style.borderColor = "#3a4c74"; } else { inp.style.borderColor = "#ff6b6b"; teach("Formulani tushunmadim. Misollar: 2x+1, x^2-3, |x-2|, sqrt(x), sin(x)", "hint", 2600); } }
      $("kg-add").onclick = go; inp.addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Enter") go(); });
      $("kg-pclr").onclick = function () { plots = []; };
    }
    // --- baholash ---
    function evaluate() {
      var g = geo(), f = task.f, pts = [];
      strokes.forEach(function (s) { s.p.forEach(function (p) { pts.push(p); }); });
      // ko'rinadigan oraliq (y doskada bo'lgan x lar)
      var bins = {}, total = 0, step = 0.5;
      for (var x = -g.X; x <= g.X; x += step) { var y = f(x); if (isFinite(y) && Math.abs(y) < g.Y) { total++; bins[Math.round(x / step)] = 0; } }
      var err = 0, n = 0;
      pts.forEach(function (p) { var y = f(p.x); if (!isFinite(y)) return; var e = Math.min(3, Math.abs(p.y - y)); err += e; n++; var k = Math.round(p.x / step); if (k in bins && e < 1.2) bins[k] = 1; });
      var cov = total ? Object.keys(bins).filter(function (k) { return bins[k]; }).length / total : 0, me = n ? err / n : 9;
      var acc = Math.max(0, 1 - me / 1.4) * Math.min(1, cov / 0.75);
      return { acc: acc, cov: cov, me: me };
    }
    function finish() {
      if (!strokes.length) { teach("Avval grafikni chizing: ko'rsatkich barmoqni ko'tarib (☝) yurgizing yoki chimdang 🤏", "hint", 2500); return; }
      var r = evaluate(), g = geo(), pc = Math.round(r.acc * 100); lastRes = r;
      if (r.acc >= 0.55) { good(g.cx, g.cy, 0, 5 + Math.round(r.acc * 20), task.s + " ✓ aniqlik " + pc + "%"); }
      else { bad(g.cx, g.cy, 0, task.s + ": " + task.ex + "  (aniqlik " + pc + "%" + (r.cov < 0.5 ? ", grafikning katta qismi chizilmagan" : "") + ")"); }
      showT = 2.6;
    }
    function penOf(p) {
      if (mouseMode) return mouse.down ? "pen" : null;
      var h = p.hand; if (!h) return null;
      if (h.fingers >= 5 && h.fingersStable > 2) return "erase";
      if (p.pinch || (h.fingers === 1 && h.fingersStable > 1)) return "pen";
      return null;
    }
    function penXY(p) { if (p.hand && p.pinch) return { x: (p.hand.pts[4].x + p.hand.pts[8].x) / 2, y: (p.hand.pts[4].y + p.hand.pts[8].y) / 2 }; return { x: p.x, y: p.y }; }
    function plotCurve(g, f, col, w, dash) {
      ctx.save(); ctx.beginPath(); ctx.rect(g.x, g.y, g.w, g.h); ctx.clip();
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.shadowColor = col; ctx.shadowBlur = 10; if (dash) ctx.setLineDash(dash);
      ctx.beginPath(); var pen = false, st = 1 / g.u * 2;
      for (var x = -g.X; x <= g.X + st; x += st) { var y = f(x); if (!isFinite(y) || Math.abs(y) > g.Y * 3) { pen = false; continue; } var X = sx(g, x), Y = sy(g, y); if (pen) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); pen = true; }
      ctx.stroke(); ctx.restore();
    }
    return {
      start: function () {
        window.__KAV_GRAF = function () { return { task: task, geo: geo() }; };
        if (FREE) { S.left = 3600; qEl.style.display = "none"; mkUI(); setQ(""); }
        else newTask();
      },
      stop: function () { if (ui) { ui.remove(); ui = null; } qEl.style.display = ""; },
      update: function (dt) {
        var g = geo(), seen = {}, drew = false;
        if (showT > 0) { showT -= dt; if (showT <= 0 && !FREE) newTask(); return; }
        pointers.forEach(function (p) {
          seen[p.id] = 1;
          var m = penOf(p), q = penXY(p), L = live[p.id] || (live[p.id] = { sx: q.x, sy: q.y, s: null });
          L.sx += (q.x - L.sx) * 0.55; L.sy += (q.y - L.sy) * 0.55;
          var inB = L.sx > g.x && L.sx < g.x + g.w && L.sy > g.y && L.sy < g.y + g.h;
          if (m === "pen" && inB) {
            var P = { x: wx(g, L.sx), y: wy(g, L.sy) };
            if (!L.s) { L.s = { p: [], c: FREE ? PENS[penCol] : TH.acc }; strokes.push(L.s); }
            var lp = L.s.p[L.s.p.length - 1];
            if (!lp || Math.hypot(lp.x - P.x, lp.y - P.y) > 0.04) L.s.p.push(P);
            drew = true;
          } else L.s = null;
          if (m === "erase" && inB) {
            var E = { x: wx(g, p.palm.x), y: wy(g, p.palm.y) }, rad = 0.8;
            strokes.forEach(function (s) { s.p = s.p.filter(function (pt) { return Math.hypot(pt.x - E.x, pt.y - E.y) > rad; }); });
            strokes = strokes.filter(function (s) { return s.p.length > 1 || s === L.s; });
          }
        });
        Object.keys(live).forEach(function (k) { if (!seen[k]) delete live[k]; });
        // tugmalar
        btnRects(g).forEach(function (b) {
          var t = BT[b.k], pk = holdPick(t, dt, function (p) { return p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h; }, false, 0.8);
          if (!pk) return; beep(700, 0.06);
          if (b.k === "chk") finish();
          else if (b.k === "clr") { strokes = []; live = {}; }
          else if (b.k === "undo") strokes.pop();
          else if (b.k === "col") penCol = (penCol + 1) % PENS.length;
        });
        if (FREE || !task) return;
        // avto-tekshirish: grafik deyarli to'liq chizilib, qalam 1.6 s ko'tarilsa
        idleT = drew ? 0 : idleT + dt; hintT += dt;
        if (strokes.length && idleT > 1.6) { var r = evaluate(); if (r.cov > 0.85) finish(); idleT = -99; }
        if (drew) idleT = 0;
      },
      draw: function () {
        var g = geo();
        // doska
        ctx.fillStyle = "rgba(6,14,24,.88)"; ctx.strokeStyle = TH.acc + "88"; ctx.lineWidth = 2; rr(g.x, g.y, g.w, g.h, 14); ctx.fill(); ctx.stroke();
        ctx.save(); ctx.beginPath(); ctx.rect(g.x, g.y, g.w, g.h); ctx.clip();
        ctx.lineWidth = 1;
        for (var i = Math.ceil(-g.X); i <= g.X; i++) { ctx.strokeStyle = i ? "#ffffff14" : "#ffffffaa"; ctx.lineWidth = i ? 1 : 2; ctx.beginPath(); ctx.moveTo(sx(g, i), g.y); ctx.lineTo(sx(g, i), g.y + g.h); ctx.stroke(); }
        for (var j = Math.ceil(-g.Y); j <= g.Y; j++) { ctx.strokeStyle = j ? "#ffffff14" : "#ffffffaa"; ctx.lineWidth = j ? 1 : 2; ctx.beginPath(); ctx.moveTo(g.x, sy(g, j)); ctx.lineTo(g.x + g.w, sy(g, j)); ctx.stroke(); }
        ctx.fillStyle = "#9fb0d0"; ctx.font = "600 " + Math.round(clamp(g.u * 0.32, 9, 13)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "top";
        for (i = Math.ceil(-g.X); i <= g.X; i++) if (i) ctx.fillText(mstr(i), sx(g, i), sy(g, 0) + 3);
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        for (j = Math.ceil(-g.Y); j <= g.Y; j++) if (j) ctx.fillText(mstr(j), sx(g, 0) - 4, sy(g, j));
        ctx.fillStyle = "#fff"; ctx.font = "800 15px " + FONT; ctx.fillText("x", g.x + g.w - 8, sy(g, 0) - 12); ctx.textAlign = "left"; ctx.fillText("y", sx(g, 0) + 8, g.y + 14);
        ctx.restore();
        // erkin doskadagi formulalar
        plots.forEach(function (pl, k) { plotCurve(g, pl.f, pl.c, 3); ctx.fillStyle = pl.c; ctx.font = "800 15px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(pl.s, g.x + 10, g.y + 10 + k * 20); });
        // yordamchi nuqtalar: oson — darhol, o'rta — 8 s dan keyin
        if (task && !FREE && (CFG.diff === 1 || (CFG.diff === 2 && hintT > 8) || showT > 0)) task.kp.forEach(function (k) { if (Math.abs(k[0]) > g.X || Math.abs(k[1]) > g.Y) return; ctx.fillStyle = showT > 0 ? "#22c55e" : "#ffd47999"; ctx.beginPath(); ctx.arc(sx(g, k[0]), sy(g, k[1]), 6, 0, 7); ctx.fill(); ctx.fillStyle = "#ffd479"; ctx.font = "700 11px " + FONT; ctx.textAlign = "left"; ctx.fillText("(" + mstr(k[0]) + "; " + mstr(k[1]) + ")", sx(g, k[0]) + 8, sy(g, k[1]) - 10); });
        // chizilgan chiziqlar
        ctx.save(); ctx.beginPath(); ctx.rect(g.x, g.y, g.w, g.h); ctx.clip(); ctx.lineCap = "round"; ctx.lineJoin = "round";
        strokes.forEach(function (s) { if (s.p.length < 2) return; ctx.strokeStyle = s.c; ctx.shadowColor = s.c; ctx.shadowBlur = 12; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx(g, s.p[0].x), sy(g, s.p[0].y)); for (var k = 1; k < s.p.length; k++) ctx.lineTo(sx(g, s.p[k].x), sy(g, s.p[k].y)); ctx.stroke(); });
        ctx.shadowBlur = 0; ctx.restore();
        // natija: to'g'ri grafik
        if (showT > 0 && task) { plotCurve(g, task.f, "#22c55e", 4, [12, 8]); if (lastRes) { ctx.fillStyle = "#fff"; ctx.font = "900 " + Math.round(U * 4 + 14) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = "#000"; ctx.shadowBlur = 10; ctx.fillText("Aniqlik: " + Math.round(lastRes.acc * 100) + "%", g.cx, g.y + 40); ctx.shadowBlur = 0; } }
        // qalam kursorlari
        pointers.forEach(function (p) { var m = penOf(p), L = live[p.id]; if (!L) return; if (m === "erase") { ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.palm.x, p.palm.y, 0.8 * g.u, 0, 7); ctx.stroke(); ctx.fillStyle = "#ff6b6b"; ctx.font = "700 12px " + FONT; ctx.textAlign = "center"; ctx.fillText("🧽 o'chirg'ich", p.palm.x, p.palm.y - 0.8 * g.u - 8); } else { ctx.fillStyle = m === "pen" ? (FREE ? PENS[penCol] : TH.acc) : "#ffffff66"; ctx.beginPath(); ctx.arc(L.sx, L.sy, m === "pen" ? 7 : 5, 0, 7); ctx.fill(); } });
        // tugmalar
        btnRects(g).forEach(function (b) { var t = BT[b.k]; drawBox(b.x, b.y, b.w, b.h, b.k === "col" ? "🎨" : t.l, { c: b.k === "chk" ? "#22c55e" : b.k === "clr" ? "#ff6b6b" : TH.acc, fs: Math.min(16, b.h * 0.3) }); if (b.k === "col") { ctx.fillStyle = PENS[penCol]; ctx.beginPath(); ctx.arc(b.x + b.w * 0.72, b.y + b.h / 2, 9, 0, 7); ctx.fill(); } drawHoldRing(b.x + b.w / 2, b.y + b.h / 2, Math.min(b.w, b.h) / 2 - 4, t.hold, 0.8); });
        // yo'riqnoma
        ctx.fillStyle = "#cfd8ef"; ctx.font = "600 12px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillText(mouseMode ? "🖱 Sichqonchani bosib chizing" : "☝ ko'rsatkich barmoq yoki 🤏 chimdash — chizish · ✋ ochiq kaft — o'chirg'ich · tugmani 0,8 s ushlab turing", g.x + 6, g.y + g.h - 8);
      }
    };
  };

  // ---------- Poyga (sport mashina, V12 ovozi) — 1–4 o'yinchi, tezlik cheklovsiz, yo'lda to'siqlar ----------
  M.poyga = function () {
    var LANES = [-0.62, 0, 0.62], CAMD = 9, VIEW = 320, MINSP = 30;
    var racers = [], rows = [], obs = [], keys = {}, engines = [], kbT = [0, 0, 0, 0], elapsed = 0;
    var PCOL = ["#e10600", "#1e88ff", "#ffd400", "#22c55e"], ACOL = ["#ff6ad5", "#ff8a00", "#a855f7"];
    var PEMO = ["🔴", "🔵", "🟡", "🟢"];
    var PNAME = ["1-o'yinchi", "2-o'yinchi", "3-o'yinchi", "4-o'yinchi"];
    var KEYS = [{ l: "arrowleft", r: "arrowright", b: "arrowdown", n: "arrowup" }, { l: "a", r: "d", b: "s", n: "w" }, { l: "j", r: "l", b: "k", n: "i" }, { l: "4", r: "6", b: "5", n: "8" }];
    var KEYTXT = ["← → · ↓ tormoz · ↑ nitro", "A D · S tormoz · W nitro", "J L · K tormoz · I nitro", "4 6 · 5 tormoz · 8 nitro"];
    var OBN = { konus: "Konus! −15%", moy: "Moy dog'i! Sirpanish", tosiq: "To'siq! −40%", chuqur: "Chuqur! −20%" };
    function nPlayers() { return clamp(CFG.racers | 0 || 1, 1, 4); }
    function humans() { return racers.filter(function (r) { return r.human; }); }
    function mkRacer(i, human, sp, d, x, col) { return { i: i, human: human, x: x, tx: x, sp: sp, dist: d, col: col, gear: 1, boost: 0, hit: 0, shift: 0, braking: false, nitro: 0, shield: 0, streak: 0, slide: 0, slideV: 0, bump: 0, zk: 1, gm: 400, maxSp: sp, lane: 1, base: sp }; }

    // ---- yo'ldagi amal (darvoza): qo'shish/ayirish, yuqori darajada ×2 va :2 ----
    function op(l, sign) {
      if (l >= 3 && Math.random() < 0.2) return sign > 0 ? { sign: 1, k: "mul", v: 2, s: "×2" } : { sign: -1, k: "div", v: 2, s: ":2" };
      var v, s, a, b, c, t;
      if (l < 2) { v = R(2, 6) * 5; s = String(v); }
      else if (l < 4) { a = R(2, 9); b = R(2, 6); v = a * b; s = a + "×" + b; }
      else if (l < 6) { t = R(0, 2); a = R(2, 9); b = R(2, 9); if (t === 0) { v = a + b; s = a + "+" + b; } else if (t === 1) { v = a * b; s = a + "×" + b; } else { v = b; s = (a * b) + ":" + a; } }
      else { t = R(0, 3); a = R(6, 15); b = R(3, 9); c = R(2, 9);
        if (t === 0) { v = a * b; s = a + "×" + b; } else if (t === 1) { v = a * c + b; s = a + "×" + c + "+" + b; } else if (t === 2) { v = a * a; s = a + "²"; } else { v = a; s = (a * c) + ":" + c; } }
      return { sign: sign, k: "add", v: v, s: (sign > 0 ? "+" : "−") + (s.length > 2 ? "(" + s + ")" : s) };
    }
    function applyOp(o, sp) { return Math.max(MINSP, o.k === "mul" ? sp * o.v : o.k === "div" ? sp / o.v : sp + o.sign * o.v); }
    function opTxt(o) { return o.k !== "add" ? o.s : o.s + (/[×:+²(]/.test(o.s.slice(1)) ? " = " + (o.sign > 0 ? "+" : "−") + o.v : ""); }
    function gapNow() { var m = 0; racers.forEach(function (r) { if (r.human) m = Math.max(m, r.sp); }); return 230 + m * 0.45; }
    function makeRow(z) {
      var l = lvl(), ops = [op(l, 1), op(l, R(0, 2) ? -1 : 1), op(l, -1)];
      return { z: z, ops: shuffle(ops), done: {} };
    }
    // to'siqlar to'plami: har doim kamida bitta yo'lak bo'sh qoladi
    function makeObstacles(z0, gap) {
      var l = lvl(), n = Math.min(2, 1 + (l >= 3 ? 1 : 0) + (Math.random() < 0.3 ? 1 : 0));
      var waves = l >= 5 ? 2 : 1;
      for (var wv = 0; wv < waves; wv++) {
        var z = z0 + gap * (waves === 1 ? 0.5 : 0.33 + wv * 0.34) + (Math.random() - 0.5) * gap * 0.12;
        var ln = shuffle([0, 1, 2]);
        for (var k = 0; k < n; k++) {
          var t = pick(l < 2 ? ["konus", "konus", "chuqur"] : ["konus", "moy", "tosiq", "chuqur", "tosiq"]);
          var w = { konus: 0.16, moy: 0.42, tosiq: 0.5, chuqur: 0.32 }[t];
          obs.push({ t: t, z: z + (t === "konus" ? R(-6, 6) : 0), x: LANES[ln[k]] + (Math.random() - 0.5) * 0.18, w: w, done: {} });
          if (t === "konus" && Math.random() < 0.6) obs.push({ t: "konus", z: z + 9, x: LANES[ln[k]] + (Math.random() < 0.5 ? -0.2 : 0.2), w: 0.16, done: {} });
        }
        if (Math.random() < 0.35) obs.push({ t: "nitro", z: z + R(-10, 10), x: LANES[ln[2]], w: 0.36, done: {} }); // bo'sh yo'lakda nitro yo'lagi
      }
    }

    // ---- V12 dvigatel ovozi (WebAudio sintez) ----
    function mkEngine(pan) {
      try {
        AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume();
        var out = AC.createGain(); out.gain.value = 0;
        var pn = AC.createStereoPanner ? AC.createStereoPanner() : null; if (pn) { pn.pan.value = pan; out.connect(pn); pn.connect(AC.destination); } else out.connect(AC.destination);
        var lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 4; lp.connect(out);
        var ws = AC.createWaveShaper(), cur = new Float32Array(1024); for (var i = 0; i < 1024; i++) { var x = i / 512 - 1; cur[i] = Math.tanh(x * 2.4); } ws.curve = cur; ws.connect(lp);
        var o1 = AC.createOscillator(), o2 = AC.createOscillator(), o3 = AC.createOscillator(), g1 = AC.createGain(), g2 = AC.createGain(), g3 = AC.createGain();
        o1.type = "sawtooth"; o2.type = "square"; o3.type = "sawtooth"; g1.gain.value = 0.5; g2.gain.value = 0.25; g3.gain.value = 0.18;
        o1.connect(g1); o2.connect(g2); o3.connect(g3); g1.connect(ws); g2.connect(ws); g3.connect(ws);
        var lfo = AC.createOscillator(), lg = AC.createGain(); lfo.frequency.value = 28; lg.gain.value = 6; lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o3.frequency);
        [o1, o2, o3, lfo].forEach(function (o) { o.start(); });
        var vol = 1 / Math.sqrt(Math.max(1, nPlayers()));
        return { out: out, lp: lp, o1: o1, o2: o2, o3: o3, lfo: lfo, set: function (rpm, load) {
          var t = AC.currentTime, f = rpm / 10; // V12: rpm*12/120
          o1.frequency.setTargetAtTime(f, t, 0.04); o2.frequency.setTargetAtTime(f / 2, t, 0.04); o3.frequency.setTargetAtTime(f * 2.005, t, 0.04);
          lfo.frequency.setTargetAtTime(f / 12, t, 0.05);
          lp.frequency.setTargetAtTime(600 + rpm * 0.55 + load * 900, t, 0.05);
          out.gain.setTargetAtTime(SND ? (0.05 + 0.06 * load + rpm / 9000 * 0.06) * vol : 0, t, 0.08);
        }, stop: function () { try { out.gain.setTargetAtTime(0, AC.currentTime, 0.1); var self = this; setTimeout(function () { [self.o1, self.o2, self.o3, self.lfo].forEach(function (o) { try { o.stop(); } catch (e) {} }); out.disconnect(); }, 500); } catch (e) {} } };
      } catch (e) { return null; }
    }
    // uzatmalar: 310 km/soatdan keyin har 150 km/soatda yangi uzatma — cheksiz
    var GEARS = [0, 60, 110, 160, 210, 260, 310];
    function rpmOf(r) {
      var g, lo, hi;
      if (r.sp <= 310) { g = 1; while (g < 6 && r.sp > GEARS[g]) g++; lo = GEARS[g - 1]; hi = GEARS[g]; }
      else { g = 7 + Math.floor((r.sp - 310) / 150); lo = 310 + (g - 7) * 150; hi = lo + 150; }
      if (g !== r.gear) { r.shift = 0.12; r.gear = g; }
      var k = clamp((r.sp - lo) / (hi - lo), 0, 1), rpm = 3500 + k * 5200; if (r.shift > 0) rpm -= 1800 * r.shift / 0.12;
      return rpm;
    }
    function whoosh(up) { beep(up ? 520 : 300, 0.12, "triangle", 0.1); setTimeout(function () { beep(up ? 880 : 180, 0.18, up ? "triangle" : "sawtooth", 0.08); }, 70); }

    // ---- ko'rinishlar: 1 → to'liq, 2 → ikki ustun, 3–4 → ustunlar (keng ekran) yoki 2×2 ----
    function views() {
      var n = nPlayers(), out = [], i;
      if (n === 1) return [{ x: 0, y: 0, w: W, h: H }];
      if (n === 2 || W / n >= H * 0.42) { for (i = 0; i < n; i++) out.push({ x: i * W / n, y: 0, w: W / n, h: H }); return out; }
      for (i = 0; i < n; i++) out.push({ x: (i % 2) * W / 2, y: Math.floor(i / 2) * H / 2, w: W / 2, h: H / 2 });
      return out;
    }
    function isGrid() { var n = nPlayers(); return n > 2 && W / n < H * 0.42; }

    // ---- chizish yordamchilari ----
    function curveAt(r, z, zv) { return Math.sin((r.dist + z) / 900) * 0.000012 * zv * zv + Math.sin((r.dist + z) / 370) * 0.000004 * zv * zv; }
    function proj(V, r, wx, z) { var zv = Math.max(0, z) * r.zk, p = CAMD / (Math.max(0.1, zv) + CAMD), hy = V.y + V.h * 0.4; return { x: V.x + V.w / 2 + (wx + curveAt(r, z, zv) - r.x * 0.75) * p * V.w * 0.62, y: hy + p * V.h * 0.6, p: p }; }
    function carScale(V, p) { return p * Math.min(V.w, V.h * 1.5) / 380; }
    function drawCar(cx, cy, s, col, brake, shield) {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
      ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.beginPath(); ctx.ellipse(0, 6, 62, 10, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#111"; rrc(-60, -16, 22, 26, 5); rrc(38, -16, 22, 26, 5);            // g'ildiraklar
      var gr = ctx.createLinearGradient(0, -48, 0, 8); gr.addColorStop(0, "#fff"); gr.addColorStop(0.12, col); gr.addColorStop(1, shade(col));
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(-54, 4); ctx.lineTo(-56, -14); ctx.quadraticCurveTo(-50, -30, -30, -34); ctx.lineTo(-20, -50); ctx.quadraticCurveTo(0, -56, 20, -50); ctx.lineTo(30, -34); ctx.quadraticCurveTo(50, -30, 56, -14); ctx.lineTo(54, 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#0b1020"; ctx.beginPath(); ctx.moveTo(-17, -47); ctx.quadraticCurveTo(0, -52, 17, -47); ctx.lineTo(24, -35); ctx.lineTo(-24, -35); ctx.closePath(); ctx.fill(); // orqa oyna
      ctx.fillStyle = "#151515"; rrc(-58, -40, 116, 6, 2); ctx.fillRect(-40, -36, 4, 6); ctx.fillRect(36, -36, 4, 6);       // qanot
      ctx.fillStyle = "#ff2a2a"; ctx.shadowColor = "#ff0000"; ctx.shadowBlur = brake ? 25 : 10;
      [-44, -32, 32, 44].forEach(function (x) { ctx.beginPath(); ctx.arc(x, -20, 5, 0, 7); ctx.fill(); }); ctx.shadowBlur = 0;
      ctx.fillStyle = "#222"; rrc(-30, -12, 60, 12, 3);
      ctx.fillStyle = "#999"; [-12, -5, 5, 12].forEach(function (x) { ctx.beginPath(); ctx.arc(x, -2, 2.6, 0, 7); ctx.fill(); });           // 4 ta chiqindi quvur
      if (shield) { ctx.strokeStyle = "rgba(77,210,255," + (0.5 + 0.3 * Math.sin(tGlobal * 20)) + ")"; ctx.lineWidth = 5; ctx.shadowColor = "#4dd2ff"; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(0, -22, 78, 46, 0, 0, 7); ctx.stroke(); ctx.shadowBlur = 0; }
      ctx.restore();
    }
    function rrc(x, y, w, h, r) { rr(x, y, w, h, r); ctx.fill(); }
    function shade(c) { var n = parseInt(c.slice(1), 16), r = (n >> 16) * 0.45 | 0, g = ((n >> 8) & 255) * 0.45 | 0, b = (n & 255) * 0.45 | 0; return "rgb(" + r + "," + g + "," + b + ")"; }
    function quad(x1, y1, x2, y2, x3, y3, x4, y4) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath(); ctx.fill(); }

    function drawObstacle(V, me, ob, z) {
      var L = proj(V, me, ob.x - ob.w / 2, z), Rr = proj(V, me, ob.x + ob.w / 2, z), w = Rr.x - L.x, cx = (L.x + Rr.x) / 2, y = L.y;
      if (w < 1.5) return;
      if (ob.t === "konus") {
        ctx.fillStyle = "#ff7a00"; ctx.beginPath(); ctx.moveTo(cx, y - w * 1.6); ctx.lineTo(cx + w * 0.45, y); ctx.lineTo(cx - w * 0.45, y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.fillRect(cx - w * 0.24, y - w * 0.85, w * 0.48, w * 0.2);
        ctx.fillStyle = "#cc5200"; ctx.fillRect(cx - w * 0.55, y - w * 0.08, w * 1.1, w * 0.12);
      } else if (ob.t === "moy") {
        ctx.fillStyle = "#07070a"; ctx.beginPath(); ctx.ellipse(cx, y - w * 0.04, w * 0.5, Math.max(1, w * 0.13), 0, 0, 7); ctx.fill();
        ctx.fillStyle = "rgba(140,90,255,.45)"; ctx.beginPath(); ctx.ellipse(cx - w * 0.12, y - w * 0.07, w * 0.18, Math.max(1, w * 0.04), 0, 0, 7); ctx.fill();
        ctx.fillStyle = "rgba(80,220,255,.35)"; ctx.beginPath(); ctx.ellipse(cx + w * 0.15, y - w * 0.03, w * 0.12, Math.max(1, w * 0.03), 0, 0, 7); ctx.fill();
      } else if (ob.t === "tosiq") {
        var h = w * 0.42, st = 6;
        ctx.fillStyle = "#555"; ctx.fillRect(cx - w * 0.42, y - h * 0.5, w * 0.06, h * 0.5); ctx.fillRect(cx + w * 0.36, y - h * 0.5, w * 0.06, h * 0.5);
        for (var s = 0; s < st; s++) { ctx.fillStyle = s % 2 ? "#fff" : "#e10600"; ctx.fillRect(cx - w / 2 + s * w / st, y - h * 1.1, w / st + 0.5, h * 0.6); }
        ctx.strokeStyle = "#000"; ctx.lineWidth = Math.max(1, w * 0.01); ctx.strokeRect(cx - w / 2, y - h * 1.1, w, h * 0.6);
        if (w > 30) { ctx.fillStyle = "#ffd400"; ctx.shadowColor = "#ffd400"; ctx.shadowBlur = 10; [cx - w * 0.4, cx + w * 0.4].forEach(function (lx) { ctx.beginPath(); ctx.arc(lx, y - h * 1.18, w * 0.03, 0, 7); ctx.fill(); }); ctx.shadowBlur = 0; }
      } else if (ob.t === "chuqur") {
        ctx.fillStyle = "#1a1410"; ctx.beginPath(); ctx.ellipse(cx, y - w * 0.04, w * 0.5, Math.max(1, w * 0.12), 0, 0, 7); ctx.fill();
        ctx.strokeStyle = "#5a4a3a"; ctx.lineWidth = Math.max(1, w * 0.025); ctx.stroke();
      } else if (ob.t === "nitro") {
        ctx.fillStyle = "rgba(0,180,255,.35)"; quad(L.x, y, Rr.x, y, Rr.x, y - w * 0.3, L.x, y - w * 0.3);
        ctx.strokeStyle = "#7fe3ff"; ctx.lineWidth = Math.max(1, w * 0.05); ctx.shadowColor = "#4dd2ff"; ctx.shadowBlur = 12;
        for (var c = 0; c < 2; c++) { var yy = y - w * (0.08 + c * 0.12) - (tGlobal * w * 0.3) % (w * 0.12); ctx.beginPath(); ctx.moveTo(cx - w * 0.3, yy); ctx.lineTo(cx, yy - w * 0.08); ctx.lineTo(cx + w * 0.3, yy); ctx.stroke(); }
        ctx.shadowBlur = 0;
      }
    }

    function renderView(V, me) {
      ctx.save(); ctx.beginPath(); ctx.rect(V.x, V.y, V.w, V.h); ctx.clip();
      var hy = V.y + V.h * 0.4, VR = VIEW / me.zk;
      // osmon
      var sk = ctx.createLinearGradient(0, V.y, 0, hy); sk.addColorStop(0, "#0b1330"); sk.addColorStop(0.7, "#ff6a3d"); sk.addColorStop(1, "#ffb36b");
      ctx.fillStyle = sk; ctx.fillRect(V.x, V.y, V.w, hy - V.y);
      var sx = V.x + V.w / 2 - Math.sin(me.dist / 900) * V.w * 0.3;
      ctx.fillStyle = "#ffe08a"; ctx.shadowColor = "#ffcf5a"; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(sx, hy - V.h * 0.07, V.h * 0.06, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      // tog'lar
      ctx.fillStyle = "#3a1d3f"; ctx.beginPath(); ctx.moveTo(V.x, hy); for (var i = 0; i <= 24; i++) { var mx = V.x + i * V.w / 24; ctx.lineTo(mx, hy - V.h * (0.04 + 0.05 * Math.abs(Math.sin(i * 1.7 + me.dist / 2500)))); } ctx.lineTo(V.x + V.w, hy); ctx.fill();
      // o't
      ctx.fillStyle = "#123d1d"; ctx.fillRect(V.x, hy, V.w, V.y + V.h - hy);
      // yo'l bo'laklari (uzoqdan yaqinga); tezlikda kamera "uzoqroq" ko'radi
      var seg = 8 * Math.pow(2, Math.round(Math.log(1 / me.zk) / Math.LN2)), off = me.dist % (seg * 2);
      for (var z = VR; z > -seg; z -= seg) {
        var z1 = z - off, z2 = z1 + seg; if (z2 < 0) continue;
        var a1 = proj(V, me, -1.1, z1), b1 = proj(V, me, 1.1, z1), a2 = proj(V, me, -1.1, z2), b2 = proj(V, me, 1.1, z2);
        var alt = Math.floor((me.dist + z1 + 100000) / seg) % 2;
        ctx.fillStyle = alt ? "#165a28" : "#124a21"; ctx.fillRect(V.x, a2.y, V.w, a1.y - a2.y + 1);
        var k1 = proj(V, me, -1.22, z1), k2 = proj(V, me, -1.22, z2), l1 = proj(V, me, 1.22, z1), l2 = proj(V, me, 1.22, z2);
        ctx.fillStyle = alt ? "#e10600" : "#f2f2f2";
        quad(k1.x, k1.y, a1.x, a1.y, a2.x, a2.y, k2.x, k2.y); quad(b1.x, b1.y, l1.x, l1.y, l2.x, l2.y, b2.x, b2.y);
        ctx.fillStyle = alt ? "#34373d" : "#3b3f46"; quad(a1.x, a1.y, b1.x, b1.y, b2.x, b2.y, a2.x, a2.y);
        if (alt) [-0.31, 0.31].forEach(function (lx) { var c1 = proj(V, me, lx - 0.012, z1), d1 = proj(V, me, lx + 0.012, z1), c2 = proj(V, me, lx - 0.012, z2), d2 = proj(V, me, lx + 0.012, z2); ctx.fillStyle = "#eaeaea"; quad(c1.x, c1.y, d1.x, d1.y, d2.x, d2.y, c2.x, c2.y); });
      }
      // obyektlar: chiroq ustunlari, to'siqlar, darvozalar, boshqa mashinalar
      var objs = [], PS = seg * 6, po = me.dist % PS;
      for (var pz = PS - po; pz < VR; pz += PS) { objs.push({ z: pz, post: -1 }); objs.push({ z: pz, post: 1 }); }
      obs.forEach(function (ob) { var z = ob.z - me.dist; if (z > 1 && z < VR && !ob.done[me.i]) objs.push({ z: z, ob: ob }); });
      rows.forEach(function (rw) { var z = rw.z - me.dist; if (z > 1 && z < VR) objs.push({ z: z, row: rw }); });
      racers.forEach(function (o) { if (o === me) return; var z = o.dist - me.dist; if (z > 2 && z < VR) objs.push({ z: z, car: o }); });
      objs.sort(function (a, b) { return b.z - a.z; });
      objs.forEach(function (ob) {
        if (ob.post) {
          var P0 = proj(V, me, ob.post * 1.45, ob.z), hh = P0.p * V.h * 0.9;
          if (hh < 2) return;
          ctx.fillStyle = "#2b2f38"; ctx.fillRect(P0.x - Math.max(1, hh * 0.025), P0.y - hh, Math.max(2, hh * 0.05), hh);
          ctx.fillRect(P0.x - (ob.post > 0 ? hh * 0.22 : 0), P0.y - hh, hh * 0.22, Math.max(1, hh * 0.03));
          ctx.fillStyle = "#fff6c0"; ctx.shadowColor = "#ffe08a"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(P0.x - ob.post * hh * 0.2, P0.y - hh + hh * 0.03, Math.max(1, hh * 0.035), 0, 7); ctx.fill(); ctx.shadowBlur = 0;
        } else if (ob.ob) drawObstacle(V, me, ob.ob, ob.z);
        else if (ob.row) ob.row.ops.forEach(function (o, li) {
          var L = proj(V, me, LANES[li] - 0.27, ob.z), Rr = proj(V, me, LANES[li] + 0.27, ob.z), hgt = (Rr.x - L.x) * 0.55, done = ob.row.done[me.i];
          if (done === li) return;
          ctx.globalAlpha = done != null ? 0.35 : 1;
          var col = o.sign > 0 ? "#22c55e" : "#ef4444";
          ctx.fillStyle = "#ddd"; ctx.fillRect(L.x - 2, L.y - hgt * 1.6, Math.max(2, (Rr.x - L.x) * 0.04), hgt * 1.6); ctx.fillRect(Rr.x - Math.max(2, (Rr.x - L.x) * 0.04) + 2, Rr.y - hgt * 1.6, Math.max(2, (Rr.x - L.x) * 0.04), hgt * 1.6);
          ctx.fillStyle = col + "cc"; ctx.strokeStyle = "#fff"; ctx.lineWidth = Math.max(1, hgt * 0.05); rr(L.x, L.y - hgt * 1.6, Rr.x - L.x, hgt * 0.75, Math.max(2, hgt * 0.12)); ctx.fill(); ctx.stroke();
          ctx.fillStyle = col + "33"; ctx.fillRect(L.x, L.y - hgt * 0.85, Rr.x - L.x, hgt * 0.85);
          if (hgt > 6) { ctx.fillStyle = "#fff"; ctx.font = "900 " + Math.min(hgt * 0.55, (Rr.x - L.x) / Math.max(3, o.s.length * 0.6)) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.s, (L.x + Rr.x) / 2, L.y - hgt * 1.22); }
          ctx.globalAlpha = 1;
        });
        else { var P = proj(V, me, ob.car.x, ob.z), cs = carScale(V, P.p); drawCar(P.x, P.y, cs, ob.car.col, ob.car.braking, ob.car.shield > 0); if (ob.car.human && P.p > 0.06) { ctx.fillStyle = "#fff"; ctx.font = "800 12px " + FONT; ctx.textAlign = "center"; ctx.fillText(PNAME[ob.car.i], P.x, P.y - cs * 62); } }
      });
      // tezlik chiziqlari
      if (me.sp > 380) {
        var cnt = Math.min(40, (me.sp - 380) / 15), vx = V.x + V.w / 2, vy = hy;
        ctx.strokeStyle = "rgba(255,255,255," + Math.min(0.5, (me.sp - 380) / 1200) + ")"; ctx.lineWidth = 2;
        for (var q = 0; q < cnt; q++) { var an = Math.random() * Math.PI * 2, r0 = (0.25 + Math.random() * 0.4) * Math.max(V.w, V.h), r1 = r0 + 40 + Math.random() * 120; ctx.beginPath(); ctx.moveTo(vx + Math.cos(an) * r0, vy + Math.sin(an) * r0 * 0.7); ctx.lineTo(vx + Math.cos(an) * r1, vy + Math.sin(an) * r1 * 0.7); ctx.stroke(); }
      }
      // o'yinchi mashinasi
      var mp = proj(V, me, me.x, 3.2 / me.zk), ms = carScale(V, CAMD / (3.2 + CAMD)), sh = me.hit > 0 ? Math.sin(tGlobal * 60) * 6 : 0;
      mp.y = hy + CAMD / (3.2 + CAMD) * V.h * 0.6; mp.x = V.x + V.w / 2 + (me.x * 0.25) * (CAMD / (3.2 + CAMD)) * V.w * 0.62;
      ctx.save(); ctx.translate(mp.x + sh, mp.y); if (me.slide > 0) ctx.rotate(Math.sin(tGlobal * 18) * 0.12 * me.slide); ctx.translate(-(mp.x + sh), -mp.y);
      drawCar(mp.x + sh, mp.y, ms, me.col, me.braking, me.shield > 0); ctx.restore();
      if (me.boost > 0) for (var f = 0; f < 3; f++) addP({ x: mp.x + (Math.random() - 0.5) * 20 * ms, y: mp.y, vx: (Math.random() - 0.5) * 40, vy: 80 + Math.random() * 80, life: 0, max: 0.35, r: 3 + Math.random() * 3, c: pick(["#ff9100", "#ffd600", "#4dd2ff"]), g: 0, t: "dot" });
      // keyingi darvoza — oldindan yechish uchun
      var nxt = null; rows.forEach(function (rw) { var z = rw.z - me.dist; if (z > 3.2 && rw.done[me.i] == null && (!nxt || rw.z < nxt.z)) nxt = rw; });
      var top = V.y + (V.y < 10 ? 54 : 10), small = V.w < 520;
      if (nxt) {
        var cw = Math.min(118, (V.w - 40) / 3), chh = small ? 30 : 36, x0 = V.x + V.w / 2 - cw * 1.5 - 6;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        nxt.ops.forEach(function (o, li) {
          ctx.fillStyle = o.sign > 0 ? "rgba(34,197,94,.85)" : "rgba(239,68,68,.85)"; rr(x0 + li * (cw + 6), top, cw, chh, 9); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "900 " + Math.min(small ? 15 : 19, cw / Math.max(3, o.s.length * 0.62)) + "px " + FONT; ctx.fillText(o.s, x0 + li * (cw + 6) + cw / 2, top + chh / 2 + 1);
        });
        ctx.fillStyle = "#fff"; ctx.font = "700 12px " + FONT; ctx.shadowColor = "#000"; ctx.shadowBlur = 6; ctx.fillText("↑ keyingi darvoza: " + Math.max(0, Math.round(nxt.z - me.dist - 3.2)) + " m", V.x + V.w / 2, top + chh + 12); ctx.shadowBlur = 0;
      }
      // tezlik o'lchagich — chegarasiz: shkala avtomatik kattalashadi
      var gr2 = clamp(Math.min(V.w, V.h) * 0.12, 38, 70), gx = V.x + V.w - gr2 - 22, gy = V.y + V.h - gr2 - 22;
      ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.beginPath(); ctx.arc(gx, gy, gr2 + 10, 0, 7); ctx.fill();
      ctx.lineWidth = gr2 * 0.11; ctx.strokeStyle = "#ffffff22"; ctx.beginPath(); ctx.arc(gx, gy, gr2, Math.PI * 0.75, Math.PI * 2.25); ctx.stroke();
      var fr = clamp(me.sp / me.gm, 0, 1); ctx.strokeStyle = me.sp > 1000 ? "hsl(" + ((tGlobal * 300) % 360) + ",100%,60%)" : fr > 0.75 ? "#ff3d00" : fr > 0.45 ? "#ffd400" : "#22c55e"; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(gx, gy, gr2, Math.PI * 0.75, Math.PI * 0.75 + fr * Math.PI * 1.5); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "900 " + Math.round(gr2 * (me.sp >= 1000 ? 0.36 : 0.43)) + "px " + FONT; ctx.fillText(Math.round(me.sp), gx, gy - 4);
      ctx.font = "700 " + Math.round(clamp(gr2 * 0.16, 9, 11)) + "px " + FONT; ctx.fillStyle = "#cfd8ef"; ctx.fillText("km/soat · " + me.gear + "-uzatma", gx, gy + gr2 * 0.3);
      ctx.fillStyle = "#8fa0c4"; ctx.fillText("shkala " + me.gm, gx, gy + gr2 * 0.55);
      // o'rin, masofa, nitro
      var place = 1 + racers.filter(function (o) { return o !== me && o.dist > me.dist; }).length, fs = small ? 20 : 28;
      ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = "900 " + fs + "px " + FONT; ctx.shadowColor = "#000"; ctx.shadowBlur = 8;
      ctx.fillText(place + "-o'rin / " + racers.length, V.x + 14, V.y + V.h - 70);
      ctx.font = "700 " + (small ? 13 : 15) + "px " + FONT; ctx.fillText("🏁 " + (me.dist / 1000).toFixed(2) + " km", V.x + 14, V.y + V.h - 46);
      ctx.fillText("🔥 Nitro: " + (me.nitro ? new Array(me.nitro + 1).join("● ") : "—") + (me.shield > 0 ? "  🛡" : ""), V.x + 14, V.y + V.h - 24);
      ctx.shadowBlur = 0;
      if (nPlayers() > 1) {
        ctx.strokeStyle = me.col; ctx.lineWidth = 4; ctx.strokeRect(V.x + 2, V.y + 2, V.w - 4, V.h - 4);
        ctx.fillStyle = me.col; ctx.font = "900 " + (small ? 13 : 15) + "px " + FONT; ctx.textAlign = "center"; ctx.shadowColor = "#000"; ctx.shadowBlur = 6;
        var ty = nxt ? top + (small ? 30 : 36) + 30 : top + 10;
        ctx.shadowBlur = 0; ctx.fillStyle = "rgba(0,0,0,.6)"; rr(V.x + V.w / 2 - 95, ty - 12, 190, 40, 10); ctx.fill(); ctx.fillStyle = me.col;
        ctx.fillText(PEMO[me.i] + " " + PNAME[me.i], V.x + V.w / 2, ty);
        ctx.font = "700 11px " + FONT; ctx.fillStyle = "#e8ecff"; ctx.fillText(mouseMode || !camOn ? KEYTXT[me.i] : "Kamerada chapdan " + (me.i + 1) + "-qism", V.x + V.w / 2, ty + 16); ctx.shadowBlur = 0;
      }
      ctx.restore();
    }

    function onKey(e) {
      var k = e.key.toLowerCase(), dn = e.type === "keydown"; keys[k] = dn;
      if (dn) KEYS.forEach(function (K, i) { if (k === K.l || k === K.r || k === K.b || k === K.n) kbT[i] = 1.5; if (k === K.n && !e.repeat) fireNitro(racers[i]); });
      if (["arrowleft", "arrowright", "arrowdown", "arrowup", " "].indexOf(k) >= 0) e.preventDefault();
    }
    window.addEventListener("keydown", onKey); window.addEventListener("keyup", onKey);

    function fireNitro(r) {
      if (!r || !r.human || !S.run || r.nitro <= 0) return;
      r.nitro--; var add = 40 + r.sp * 0.1; r.sp += add; r.boost = 1.6; r.shield = 2.2; whoosh(true);
      var V = views()[r.i]; if (V) { ftext(V.x + V.w / 2, V.y + V.h * 0.55, "🔥 NITRO! +" + Math.round(add) + " · 🛡", "#4dd2ff"); burst(V.x + V.w / 2, V.y + V.h * 0.8, 30, ["#4dd2ff", "#ffffff", "#ffd600"], 1.2); }
    }
    function hitObstacle(r, ob) {
      var V = views()[r.i], cx = V.x + V.w / 2, cy = V.y + V.h * 0.62;
      if (ob.t === "nitro") { r.sp *= 1.12; r.boost = 1.2; whoosh(true); ftext(cx, cy, "⚡ Tezlik yo'lagi +12%", "#4dd2ff"); burst(cx, cy + 30, 20, ["#4dd2ff", "#fff"], 1); return; }
      if (r.shield > 0) { ftext(cx, cy, "🛡 Qalqon saqladi!", "#4dd2ff"); beep(900, 0.08, "triangle", 0.08); return; }
      if (ob.t === "konus") { r.sp *= 0.85; r.hit = 0.3; burst(cx, cy + 20, 14, ["#ff7a00", "#ffffff"], 0.9); }
      else if (ob.t === "moy") { r.sp *= 0.92; r.slide = 1.1; r.slideV = (Math.random() < 0.5 ? -1 : 1) * 1.3; burst(cx, cy + 30, 12, ["#222", "#8c5aff"], 0.5); }
      else if (ob.t === "tosiq") { r.sp *= 0.6; r.hit = 0.8; burst(cx, cy + 20, 26, ["#e10600", "#ffffff", "#ffd400"], 1.1); }
      else if (ob.t === "chuqur") { r.sp *= 0.8; r.hit = 0.45; burst(cx, cy + 30, 12, ["#5a4a3a", "#999"], 0.6); }
      r.sp = Math.max(MINSP, r.sp); r.streak = 0; sBad(); ftext(cx, cy, OBN[ob.t], "#ff9a6b");
    }
    function blocked(lane, from, to) { return obs.some(function (ob) { return ob.t !== "nitro" && ob.z > from && ob.z < to && Math.abs(ob.x - LANES[lane]) < ob.w / 2 + 0.22; }); }

    return {
      start: function () {
        racers = []; rows = []; obs = []; elapsed = 0; kbT = [0, 0, 0, 0];
        var n = nPlayers(), SX = [[0], [-0.45, 0.45], [-0.62, 0.62, 0], [-0.62, 0.62, -0.25, 0.25]][n - 1];
        for (var i = 0; i < n; i++) racers.push(mkRacer(i, true, 120, i < 2 ? 0 : -8, SX[i], PCOL[i]));
        [[170, 60], [205, 140], [235, 230]].forEach(function (a, j) { var r = mkRacer(n + j, false, a[0], a[1], LANES[j], ACOL[j]); r.lane = j; r.rb = [0.88, 0.96, 1.04][j]; racers.push(r); });
        var z = 160; for (var k = 0; k < 6; k++) { rows.push(makeRow(z)); if (k) makeObstacles(z, GAP0); z += GAP0; }
        S.score = [0, 0, 0, 0]; window.__KAV_RACE = function () { return { racers: racers, obs: obs, rows: rows }; };
        if (!mouseMode && CFG.hands < n) { CFG.hands = n; try { if (handsObj) handsObj.setOptions({ maxNumHands: n }); } catch (e) {} }
        engines = []; for (var e = 0; e < n; e++) engines.push(mkEngine(n === 1 ? 0 : -0.7 + 1.4 * e / (n - 1)));
        setQ(""); qEl.style.display = "none";
        if (!$("kv-snd")) { var sb = document.createElement("span"); sb.className = "kv-pill"; sb.id = "kv-snd"; sb.style.cursor = "pointer"; sb.textContent = "🔊 Motor"; sb.onclick = function () { SND = !SND; sb.textContent = SND ? "🔊 Motor" : "🔇 Motor"; }; hud.appendChild(sb); }
      },
      stop: function () { engines.forEach(function (en) { en && en.stop(); }); engines = []; window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); qEl.style.display = ""; },
      update: function (dt) {
        var n = nPlayers(), l = lvl(), VS = views(), stripW = W / n; elapsed += dt;
        // kamera qo'llarini o'yinchilarga taqsimlash: ekran chapdan o'ngga n ta bo'lakka bo'linadi
        var mine = [];
        pointers.forEach(function (p) { var k = n === 1 ? 0 : clamp(Math.floor(p.palm.x / stripW), 0, n - 1); if (!mine[k]) mine[k] = p; });
        var hs = humans(), avgSp = 0, minD = 1e9, maxD = -1e9;
        hs.forEach(function (h) { avgSp += h.sp / hs.length; minD = Math.min(minD, h.dist); maxD = Math.max(maxD, h.dist); });
        racers.forEach(function (r) {
          if (r.human) {
            var my = kbT[r.i] > 0 ? null : mine[r.i], K = KEYS[r.i];
            if (kbT[r.i] > 0) kbT[r.i] -= dt;
            r.braking = false;
            if (my) {
              var sx0 = n === 1 ? 0 : r.i * stripW, sw = n === 1 ? W : stripW;
              r.tx = clamp(((my.palm.x - sx0) / sw - 0.5) * 2.6, -1.15, 1.15);
              if (my.hand && my.hand.fingers === 0 && my.hand.fingersStable > 3) r.braking = true;
              if (my.pinchStart) fireNitro(r);
            } else {
              if (keys[K.l]) r.tx = clamp(r.tx - dt * 2.4, -1.15, 1.15); if (keys[K.r]) r.tx = clamp(r.tx + dt * 2.4, -1.15, 1.15);
              if (keys[K.b]) r.braking = true;
            }
            var grip = r.slide > 0 ? 0.25 : 1;
            r.x += (r.tx - r.x) * Math.min(1, dt * 6 * grip);
            if (r.slide > 0) { r.x += r.slideV * dt * r.slide; r.slide -= dt; }
            if (r.braking) r.sp -= (90 + r.sp * 0.35) * dt;
            if (Math.abs(r.x) > 1.05) { r.sp -= (40 + r.sp * 0.35) * dt; if (Math.random() < 0.3) { var V0 = VS[r.i]; addP({ x: V0.x + V0.w / 2 + (Math.random() - 0.5) * 60, y: V0.y + V0.h * 0.85, vx: (Math.random() - 0.5) * 80, vy: -40 - Math.random() * 60, life: 0, max: 0.6, r: 3, c: pick(["#6b4f2a", "#2f6b2a"]), g: 120, t: "dot" }); } }
            r.x = clamp(r.x, -1.4, 1.4);
            r.sp += (r.sp < 100 ? 12 : 2) * dt;                   // sekin tezlanish — yuqori chegara yo'q!
            r.zk += (clamp(360 / Math.max(1, r.sp), 0.2, 1) - r.zk) * Math.min(1, dt * 1.5);
            r.gm = r.sp <= 380 ? 400 : 400 * Math.pow(2, Math.ceil(Math.log(r.sp / 380) / Math.LN2));
            if (r.shield > 0) r.shield -= dt; if (r.bump > 0) r.bump -= dt;
          } else {
            // raqiblar: tezligi o'yinchilarga moslashadi (chegarasiz)
            var T = Math.max(r.base + l * 14 + elapsed * 1.5, avgSp * r.rb);
            if (r.dist < minD - 250) T *= 1.3; if (r.dist > maxD + 600) T *= 0.8;
            r.sp += (T - r.sp) * dt * 0.4;
            var look = r.sp / 3.6 * 1.3 + 40;
            if (blocked(r.lane, r.dist + 5, r.dist + look)) { var fl = [0, 1, 2].filter(function (k) { return !blocked(k, r.dist + 5, r.dist + look); }); if (fl.length) r.lane = fl.sort(function (a, b) { return Math.abs(a - r.lane) - Math.abs(b - r.lane); })[0]; }
            else if (Math.random() < dt * 0.15) r.lane = R(0, 2);
            r.x += (LANES[r.lane] - r.x) * Math.min(1, dt * 2.2);
          }
          r.sp = Math.max(MINSP, r.sp); if (r.sp > (r.maxSp || 0)) r.maxSp = r.sp;
          if (r.boost > 0) r.boost -= dt; if (r.hit > 0) r.hit -= dt; if (r.shift > 0) r.shift -= dt;
          var prev = r.dist; r.dist += r.sp / 3.6 * dt;
          if (!r.human) return;
          S.score[r.i] = Math.round(r.dist / 10);
          var V = VS[r.i];
          // darvozadan o'tish
          rows.forEach(function (rw) {
            if (rw.done[r.i] != null) return;
            if (prev + 3.2 <= rw.z && r.dist + 3.2 > rw.z) {
              var li = 0, bd = 9; LANES.forEach(function (lx, k) { var d = Math.abs(r.x - lx); if (d < bd) { bd = d; li = k; } });
              rw.done[r.i] = li;
              if (bd > 0.36) return; // darvozalar orasidan o'tdi
              var o = rw.ops[li], cx = V.x + V.w / 2, cy = V.y + V.h * 0.7, old = r.sp;
              r.sp = applyOp(o, r.sp);
              if (o.sign > 0) { S.ok++; S.streak++; S.best = Math.max(S.best, S.streak); r.streak++; r.boost = 0.9; whoosh(true); burst(cx, cy - 40, 30, ["#22c55e", "#b6ff00", "#ffffff"], 1); if (r.streak % 3 === 0 && r.nitro < 3) { r.nitro++; ftext(cx, cy - 140, "🔥 +1 nitro! " + (mouseMode || !camOn ? "(" + KEYTXT[r.i].split("· ")[2] + ")" : "(chimdang 🤏)"), "#4dd2ff"); } }
              else { S.bad++; S.streak = 0; r.streak = 0; r.hit = 0.4; whoosh(false); burst(cx, cy - 40, 20, ["#ef4444", "#ff8a80"], 0.8); }
              ftext(cx, cy - 90, opTxt(o) + " → " + Math.round(r.sp) + " km/soat", o.sign > 0 ? "#5ee67a" : "#ff6b6b");
              var bestOp = rw.ops.reduce(function (a, b) { return applyOp(a, old) >= applyOp(b, old) ? a : b; });
              if (bestOp !== o && applyOp(bestOp, old) > r.sp + 0.5) { var bx = opTxt(bestOp); teach((n > 1 ? PNAME[r.i] + ": " : "") + "Eng yaxshisi " + bx + " edi (" + Math.round(old) + " → " + Math.round(applyOp(bestOp, old)) + ")" + (o.sign < 0 ? ", siz " + o.s + " ni oldingiz" : ""), "hint", 2200); if (o.sign < 0) logMiss(null, Math.round(old) + " km/soatda " + o.s + " tezlikni kamaytiradi; eng yaxshisi " + bx); }
            }
          });
          // to'siqlar
          obs.forEach(function (ob) {
            if (ob.done[r.i]) return;
            if (prev + 3.2 <= ob.z && r.dist + 3.2 > ob.z) { if (Math.abs(r.x - ob.x) < ob.w / 2 + 0.17) { ob.done[r.i] = 1; hitObstacle(r, ob); } }
          });
          // raqib mashinaga urilish
          racers.forEach(function (o) {
            if (o === r) return; var dz = o.dist - r.dist;
            if (!o.human) { if (dz > -1 && dz < 4 && Math.abs(o.x - r.x) < 0.38 && r.hit <= 0) { if (r.shield > 0) { o.sp *= 0.8; ftext(V.x + V.w / 2, V.y + V.h * 0.6, "🛡 Itarib o'tdingiz!", "#4dd2ff"); r.hit = 0.3; } else { r.sp *= 0.72; r.hit = 0.6; sBad(); ftext(V.x + V.w / 2, V.y + V.h * 0.6, "Urildingiz! −28%", "#ff6b6b"); } } }
            else if (o.i > r.i && Math.abs(dz) < 3.5 && Math.abs(o.x - r.x) < 0.36 && r.bump <= 0) { var sg = r.x < o.x ? -1 : 1; r.slide = 0.35; r.slideV = sg * 2.2; o.slide = 0.35; o.slideV = -sg * 2.2; r.bump = o.bump = 0.6; beep(160, 0.12, "square", 0.08); }
          });
          if (engines[r.i]) engines[r.i].set(rpmOf(r), r.boost > 0 ? 1 : r.braking ? 0.1 : 0.6);
        });
        // yangi darvozalar va to'siqlar (oraliq tezlikka qarab kattalashadi)
        var reach = 0; hs.forEach(function (h) { reach = Math.max(reach, h.dist + VIEW / h.zk); });
        rows = rows.filter(function (rw) { return rw.z > minD - 20; });
        obs = obs.filter(function (ob) { return ob.z > minD - 20; });
        var lastZ = rows.length ? rows[rows.length - 1].z : maxD + 100;
        while (lastZ < reach + 300) { var g = gapNow(); makeObstacles(lastZ, g); lastZ += g; rows.push(makeRow(lastZ)); }
      },
      draw: function () {
        if (!racers.length) return;
        var V = views(), n = nPlayers();
        V.forEach(function (v, i) { renderView(v, racers[i]); });
        if (n === 3 && isGrid()) { // bo'sh chorakda reyting
          var Q = { x: W / 2, y: H / 2, w: W / 2, h: H / 2 }; ctx.fillStyle = "#0b1220"; ctx.fillRect(Q.x, Q.y, Q.w, Q.h);
          ctx.fillStyle = "#fff"; ctx.font = "900 22px " + FONT; ctx.textAlign = "center"; ctx.fillText("🏁 Jonli reyting", Q.x + Q.w / 2, Q.y + 40);
          racers.slice().sort(function (a, b) { return b.dist - a.dist; }).forEach(function (r, k) { ctx.fillStyle = r.col; ctx.font = "800 17px " + FONT; ctx.fillText((k + 1) + ". " + (r.human ? PNAME[r.i] : "Raqib") + " — " + (r.dist / 1000).toFixed(2) + " km · " + Math.round(r.sp) + " km/soat", Q.x + Q.w / 2, Q.y + 80 + k * 28); });
        }
        ctx.fillStyle = "#000"; V.forEach(function (v) { if (v.x > 0) ctx.fillRect(v.x - 2, v.y, 4, v.h); if (v.y > 0) ctx.fillRect(v.x, v.y - 2, v.w, 4); });
        if (n === 3 && isGrid()) { ctx.fillRect(W / 2 - 2, H / 2, 4, H / 2); ctx.fillRect(W / 2, H / 2 - 2, W / 2, 4); }
        // kamera rejimida: qo'llarning qaysi o'yinchiga tegishliligi
        if (!mouseMode && n > 1) {
          if (isGrid()) { ctx.strokeStyle = "#ffffff55"; ctx.setLineDash([10, 10]); ctx.lineWidth = 2; for (var s = 1; s < n; s++) { ctx.beginPath(); ctx.moveTo(s * W / n, 0); ctx.lineTo(s * W / n, H); ctx.stroke(); } ctx.setLineDash([]); }
          pointers.forEach(function (p) { var k = clamp(Math.floor(p.palm.x / (W / n)), 0, n - 1); ctx.fillStyle = PCOL[k]; ctx.font = "900 14px " + FONT; ctx.textAlign = "center"; ctx.shadowColor = "#000"; ctx.shadowBlur = 6; ctx.fillText(PEMO[k] + " " + PNAME[k], p.palm.x, p.palm.y - 30); ctx.shadowBlur = 0; });
        }
        if (!S.run && S.cd > 0) racers.forEach(function (r, i) { if (r.human && engines[i]) engines[i].set(2500 + Math.random() * 400, 0.2); });
      },
      hud: function () { var n = nPlayers(); if (n === 1) return "⭐ " + S.score[0]; var s = []; for (var i = 0; i < n; i++) s.push(PEMO[i] + " " + S.score[i]); return s.join("  "); },
      result: function () {
        var hs = humans().slice().sort(function (a, b) { return b.dist - a.dist; }), MED = ["🥇", "🥈", "🥉", "4️⃣"];
        var my = Math.max.apply(null, hs.map(function (r) { return S.score[r.i]; }));
        var html = hs.length === 1
          ? '<div class="kv-big">⭐ ' + S.score[0] + '</div><p>🏁 ' + (hs[0].dist / 1000).toFixed(2) + " km · 🚀 eng yuqori tezlik: <b>" + Math.round(hs[0].maxSp) + " km/soat</b></p>"
          : '<p style="font-size:22px;font-weight:900;color:#fff;margin:6px 0">' + PEMO[hs[0].i] + " " + PNAME[hs[0].i] + " g'olib! 🏆</p>" +
            '<div class="kv-miss" style="max-height:none">' + hs.map(function (r, k) { return '<div style="color:' + r.col + ';font-weight:800">' + MED[k] + " " + PNAME[r.i] + ' — <span style="color:#fff">' + S.score[r.i] + " ochko · " + (r.dist / 1000).toFixed(2) + " km · max " + Math.round(r.maxSp) + " km/soat</span></div>"; }).join("") + "</div>";
        return { my: my, html: html };
      }
    };
  };
  var GAP0 = 230;
  var SND = true;

  /* ======================= ASOSIY TSIKL ======================= */
  var mech = null, last = performance.now();
  function frame(now) {
    var rdt = Math.min(0.5, Math.max(0, (now - last) / 1000)), dt = Math.min(0.05, rdt); last = now; tGlobal += dt;
    ctx.fillStyle = TH.bg; ctx.fillRect(0, 0, W, H);
    if (camOn && CFG.video && video.readyState >= 2) {
      var sc = Math.max(W / vw, H / vh), dw = vw * sc, dh = vh * sc;
      ctx.save(); ctx.globalAlpha = 0.33; ctx.translate(W, 0); ctx.scale(-1, 1); ctx.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh); ctx.restore();
      ctx.fillStyle = TH.bg + "66"; ctx.fillRect(0, 0, W, H);
    }
    drawBg(dt);
    buildPointers(dt);
    if (S.run && mech) {
      if (S.pause > 0) { S.pause -= rdt; }
      else { S.left -= rdt; if (S.left <= 0) { S.left = 0; endGame(); } else mech.update(dt * spd()); }
    }
    if (mech && (S.run || S.cd > 0)) mech.draw(dt);
    drawHands(); drawPointers(); drawParts(dt);
    if (S.cd > 0) {
      S.cd -= rdt; var n = Math.ceil(S.cd);
      ctx.fillStyle = "#fff"; ctx.font = "900 " + (U * 22) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = TH.acc; ctx.shadowBlur = 40;
      ctx.globalAlpha = S.cd - Math.floor(S.cd); ctx.fillText(n > 0 ? n : "", W / 2, H / 2); ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      if (S.cd <= 0) { S.run = true; }
    }
    if (camOn && !mouseMode && S.run && !hands.length) { ctx.fillStyle = "#ffffffaa"; ctx.font = "700 " + (U * 2.6 + 10) + "px " + FONT; ctx.textAlign = "center"; ctx.fillText("✋ Qo'lingizni kameraga ko'rsating", W / 2, H * 0.92); }
    updHud();
    requestAnimationFrame(frame);
  }

  /* ======================= EKRANLAR ======================= */
  function segHTML(key, vals, labels) {
    return '<div class="kv-seg" data-k="' + key + '">' + vals.map(function (v, i) { return '<button type="button" data-v="' + v + '" class="' + (String(CFG[key]) === String(v) ? "on" : "") + '">' + labels[i] + "</button>"; }).join("") + "</div>";
  }
  function bindSegs(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".kv-seg"), function (sg) {
      sg.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return; var k = sg.getAttribute("data-k"), v = b.getAttribute("data-v");
        CFG[k] = v === "true" ? true : v === "false" ? false : isNaN(+v) ? v : +v;
        Array.prototype.forEach.call(sg.children, function (x) { x.classList.toggle("on", x === b); });
        try { localStorage.setItem("kav.cfg", JSON.stringify({ hands: CFG.hands, duel: CFG.duel, video: CFG.video, racers: CFG.racers, diff: CFG.diff, gmode: CFG.gmode })); } catch (er) {}
        if (k === "hands" && handsObj) handsObj.setOptions({ maxNumHands: CFG.hands });
      });
    });
  }
  function best() { try { return +localStorage.getItem(LS_BEST) || 0; } catch (e) { return 0; } }
  function showStart(err) {
    ov.style.display = "flex";
    ov.innerHTML = '<div class="kv-card">' +
      '<span class="kv-tag">Virtual · ' + G.id + '/' + GAMES.length + '</span><span class="kv-tag">' + MK.e + " " + MK.n + '</span><span class="kv-tag">' + G.topic + "</span>" +
      "<h1>" + G.t + "</h1>" +
      "<p>" + MK.how + "</p>" +
      '<p style="font-size:13px;color:#ffd479;margin:6px 0 0">🧠 Xato qilsangiz — to\'g\'ri yechim ko\'rsatiladi va o\'sha misol keyinroq yana so\'raladi. O\'yin oxirida xatolaringiz ro\'yxati chiqadi.</p>' +
      '<div class="kv-opts">' +
      '<div class="kv-opt"><b>✋ Qo\'llar soni (kamera sezadi)</b>' + segHTML("hands", [1, 2, 3, 4], ["1", "2", "3", "4"]) + "</div>" +
      '<div class="kv-opt" style="grid-column:1/-1"><b>🎚 Qiyinlik darajasi</b>' + segHTML("diff", [1, 2, 3], ["🟢 Oson", "🟡 O\'rta", "🔴 Qiyin"]) + "</div>" +
      (G.m === "poyga" ? '<div class="kv-opt"><b>🏎 O\'yinchilar soni</b>' + segHTML("racers", [1, 2, 3, 4], ["1", "2", "3", "4"]) + "</div>" : G.m === "grafik" ? '<div class="kv-opt"><b>📝 Doska rejimi</b>' + segHTML("gmode", ["vazifa", "erkin"], ["Vazifa", "Erkin doska"]) + "</div>" : '<div class="kv-opt"><b>👥 Rejim</b>' + segHTML("duel", [false, true], ["Yakka", "Duel (2 kishi)"]) + "</div>") +
      '<div class="kv-opt"><b>📷 Kamera tasviri</b>' + segHTML("video", [true, false], ["Ko'rinsin", "Faqat skelet"]) + "</div>" +
      '<div class="kv-opt"><b>⏱ Vaqt</b>' + (G.m === "poyga" ? segHTML("time", [60, 120, 180], ["60 s", "120 s", "180 s"]) : G.m === "grafik" ? segHTML("time", [120, 180, 300], ["2 daq", "3 daq", "5 daq"]) : segHTML("time", [60, 90, 120], ["60 s", "90 s", "120 s"])) + "</div>" +
      "</div>" +
      (err ? '<div class="kv-err">' + err + "</div>" : "") +
      '<button class="kv-btn" id="kv-go">▶ Kamera bilan boshlash</button>' +
      '<div class="kv-row"><button class="kv-btn gh" id="kv-mouse">🖱 Kamerasiz (sichqoncha/sensor)</button><a class="kv-btn gh" href="virtual.html">📋 Barcha o\'yinlar</a></div>' +
      '<div class="kv-note">Rekord: ' + best() + " · Duel rejimida ekran ikkiga bo'linadi: chap tomon — 1-o'yinchi, o'ng tomon — 2-o'yinchi. Video faqat sizning qurilmangizda qayta ishlanadi, hech qayerga yuborilmaydi.</div>" +
      "</div>";
    bindSegs(ov);
    $("kv-go").onclick = function () {
      mouseMode = false;
      if (camOn) { begin(); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { showStart("Bu brauzer kamerani qo'llab-quvvatlamaydi. Chrome yoki Yandex brauzerdan oching."); return; }
      ov.style.display = "none";
      startCamera().then(begin).catch(function (e) {
        loadEl.style.display = "none";
        var m = (e && e.name === "NotAllowedError") ? "Kameraga ruxsat berilmadi. Manzil satridagi 🔒 belgisidan kameraga ruxsat bering va qayta urinib ko'ring." : "Kamerani ishga tushirib bo'lmadi: " + (e && e.message || e);
        showStart(m);
      });
    };
    $("kv-mouse").onclick = function () { mouseMode = true; CFG.duel = CFG.duel && false; begin(); };
  }
  function begin() {
    if (mech && mech.stop) mech.stop();
    ov.style.display = "none"; parts = [];
    S.score = [0, 0]; S.ok = 0; S.bad = 0; S.streak = 0; S.best = 0; S.left = CFG.time; S.run = false; S.cd = 3.2; S.pause = 0; S.miss = []; S.retry = []; S.since = 0;
    musicStart();
    mech = M[G.m](); mech.start(); subEl.innerHTML = G.m === "grafik" ? "" : MK.how;
    setTimeout(function () { subEl.textContent = ""; }, 9000);
    beep(440, 0.1); setTimeout(function () { beep(440, 0.1); }, 1000); setTimeout(function () { beep(440, 0.1); }, 2000); setTimeout(function () { beep(880, 0.3); }, 3000);
  }
  function endGame() {
    S.run = false; if (mech && mech.stop) mech.stop(); musicStop(); teachEl.className = "kv-teach"; var tot = S.score.reduce(function (a, b) { return a + b; }, 0), b = best(), rec = false;
    var my = CFG.duel ? Math.max(S.score[0], S.score[1]) : S.score[0];
    if (my > b) { rec = true; try { localStorage.setItem(LS_BEST, my); } catch (e) {} }
    var coins = Math.floor(tot / 10), gave = false;
    try { if (coins > 0 && window.kaAccount && window.kaAccount.me()) gave = window.kaAccount.addCoins(coins, "Virtual: " + G.t); } catch (e) {}
    try { if (window.kaAccount && window.kaAccount.me() && (S.ok + S.bad) > 0) window.kaAccount.sendResult("Virtual: " + G.t, S.ok, S.ok + S.bad); } catch (e) {}
    qEl.textContent = "";
    var res = CFG.duel
      ? '<div class="kv-big">🔵 ' + S.score[0] + " : " + S.score[1] + ' 🔴</div><p style="font-size:20px;font-weight:800;color:#fff">' + (S.score[0] === S.score[1] ? "Durang! 🤝" : (S.score[0] > S.score[1] ? "1-o'yinchi" : "2-o'yinchi") + " g'olib! 🏆") + "</p>"
      : '<div class="kv-big">⭐ ' + S.score[0] + "</div>";
    if (mech && mech.result) { var mres = mech.result(); res = mres.html; if (mres.my > b && !rec) { rec = true; try { localStorage.setItem(LS_BEST, mres.my); } catch (e) {} } my = mres.my; }
    ov.style.display = "flex";
    ov.innerHTML = '<div class="kv-card"><span class="kv-tag">' + G.t + "</span><h1>" + (rec ? "🎉 Yangi rekord!" : "O'yin tugadi") + "</h1>" + res +
      "<p>✅ To'g'ri: <b>" + S.ok + "</b> &nbsp; ❌ Xato: <b>" + S.bad + "</b> &nbsp; 🔥 Eng uzun seriya: <b>" + S.best + "</b> &nbsp; 🏅 Rekord: <b>" + Math.max(b, my) + "</b></p>" +
      (S.miss.length ? '<p style="margin:12px 0 0;color:#ffd479;font-weight:800">📒 Esda tuting — xato qilgan misollaringiz:</p><div class="kv-miss">' + S.miss.slice(0, 10).map(function (m) { return "<div>" + String(m).replace(/</g, "&lt;") + "</div>"; }).join("") + "</div>" : (S.ok ? '<p style="color:#5ee67a;font-weight:800">🌟 Birorta ham xato yo\'q — barakalla!</p>' : "")) +
      (gave ? "<p>🪙 Akkountingizga <b>+" + coins + "</b> coin yozildi</p>" : (coins > 0 ? '<p class="kv-note">Coin yig\'ish uchun bosh sahifada akkountga kiring.</p>' : "")) +
      '<button class="kv-btn" id="kv-again">🔁 Yana o\'ynash</button>' +
      '<div class="kv-row">' + (G.id < GAMES.length ? '<a class="kv-btn gh" href="virtual-' + (G.id + 1) + '.html">➡ Keyingi o\'yin</a>' : "") + '<a class="kv-btn gh" href="virtual.html">📋 Barcha o\'yinlar</a></div>' +
      '<button class="kv-btn gh" id="kv-set">⚙️ Sozlamalar</button></div>';
    sGood();
    $("kv-again").onclick = begin; $("kv-set").onclick = function () { showStart(); };
  }

  resize(); initBg(); showStart(); requestAnimationFrame(frame);
  window.addEventListener("resize", initBg);
  document.addEventListener("visibilitychange", function () { last = performance.now(); });
  window.__KAV_DEBUG = { S: S, CFG: CFG, get hands() { return hands; }, setHands: function (h) { onResults({ multiHandLandmarks: h }); }, begin: begin, setMouse: function (b) { mouseMode = b; } };
})();
