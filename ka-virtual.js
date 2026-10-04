/*!
 * Kuvonch Academy — VIRTUAL o'yinlar (kamera + qo'l kuzatuvi)
 * 48 ta matematik o'yin (47 + poyga). Kamera bir nechta qo'lni (1–4) bir vaqtda sezadi.
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
    qoshish: { n: "Qo'shish", q: function (l) { var m = 10 + l * 8, a = R(1, m), b = R(1, m); return { q: a + " + " + b, a: a + b, w: near(a + b, 6) }; } },
    qoshish2: { n: "Ikki xonali qo'shish", q: function (l) { var a = R(10, 49 + l * 5), b = R(10, 49); return { q: a + " + " + b, a: a + b, w: near(a + b, 6, 11) }; } },
    ayirish: { n: "Ayirish", q: function (l) { var m = 15 + l * 8, a = R(5, m), b = R(1, a); return { q: a + " − " + b, a: a - b, w: near(a - b, 6) }; } },
    kopaytirish: { n: "Ko'paytirish jadvali", q: function (l) { var a = R(2, Math.min(9, 4 + l)), b = R(2, 9); return { q: a + " × " + b, a: a * b, w: near(a * b, 6, Math.max(a, b) + 2) }; } },
    bolish: { n: "Bo'lish", q: function (l) { var b = R(2, 9), c = R(2, Math.min(12, 5 + l)); return { q: (b * c) + " : " + b, a: c, w: near(c, 6, 4) }; } },
    kvadrat: { n: "Kvadratlar", q: function (l) { var n = R(2, Math.min(20, 9 + l * 2)); return { q: n + sup(2), a: n * n, w: [(n - 1) * (n - 1), (n + 1) * (n + 1), n * 2, n * n + n, n * n - 1, n * n + 10] }; } },
    ildiz: { n: "Kvadrat ildiz", q: function (l) { var n = R(2, Math.min(20, 9 + l * 2)); return { q: "√" + (n * n), a: n, w: near(n, 6, 4) }; } },
    ildizKichik: { n: "Kvadrat ildiz (≤10)", q: function () { var n = R(0, 10); return { q: "√" + (n * n), a: n, w: [] }; } },
    daraja: { n: "Darajalar", q: function (l) { var b = pick([2, 2, 3, 3, 4, 5, 10]), k = b === 2 ? R(2, Math.min(10, 5 + l)) : b === 10 ? R(1, 4) : R(2, b === 3 ? 4 : 3); var v = Math.pow(b, k); return { q: b + sup(k), a: v, w: [b * k, Math.pow(b, k - 1), Math.pow(b, k + 1), v + b, v - b].filter(function (x) { return x !== v && x > 0; }) }; } },
    foiz: { n: "Foizlar", q: function (l) { var p = pick([10, 20, 25, 50, 75, 5, 30, 40]), N = pick([20, 40, 60, 80, 100, 120, 200, 300, 400, 500]); var v = N * p / 100; if (v !== Math.round(v)) { N = 100; v = p; } return { q: N + " ning " + p + "%", a: v, w: near(v, 6, Math.max(5, Math.round(v / 2))) }; } },
    tenglama: { n: "Tenglamalar", q: function (l) { var x = R(1, 9 + l), a = R(2, Math.min(9, 3 + l)), b = R(1, 20); return { q: a + "x + " + b + " = " + (a * x + b), a: x, w: near(x, 6, 4) }; } },
    ekub: { n: "EKUB", q: function () { var g = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), a = g * R(1, 6), b = g * R(1, 6); while (gcd(a / g, b / g) !== 1 || a === b) { a = g * R(1, 6); b = g * R(2, 7); } return { q: "EKUB(" + a + "; " + b + ")", a: g, w: near(g, 6, 4).concat([a, b]) }; } },
    ekuk: { n: "EKUK", q: function () { var a = R(2, 12), b = R(2, 12); while (a === b) b = R(2, 12); var v = lcm(a, b); return { q: "EKUK(" + a + "; " + b + ")", a: v, w: [a * b, gcd(a, b), v * 2, v + a, Math.max(a, b)].filter(function (x) { return x !== v; }) }; } },
    kasr: { n: "Kasrni qisqartirish", q: function () { var b = R(2, 9), a = R(1, b - 1); while (gcd(a, b) !== 1) a = R(1, b - 1); var k = R(2, 6); var w = []; for (var i = 0; i < 8; i++) { var bb = R(2, 9), aa = R(1, bb - 1); var s = frac(aa, bb); if (s !== a + "/" + b && w.indexOf(s) < 0) w.push(s); } return { q: (a * k) + "/" + (b * k) + " = ?", a: a + "/" + b, w: w }; } },
    yuza: { n: "Yuzalar", q: function (l) { var t = R(0, 2), a = R(2, 9 + l), b = R(2, 9); if (t === 0) return { q: "To'rtburchak " + a + "×" + b + " yuzi", a: a * b, w: [2 * (a + b), a + b, a * b + a, a * b - b].filter(function (x) { return x !== a * b; }) }; if (t === 1) return { q: "Kvadrat tomoni " + a + ", yuzi", a: a * a, w: [4 * a, 2 * a, a * a + a, (a + 1) * (a + 1)] }; var h = 2 * R(1, 6); return { q: "Uchburchak: asos " + a + ", balandlik " + h + ", yuzi", a: a * h / 2, w: [a * h, a + h, a * h / 2 + a, a * h / 2 - 2].filter(function (x) { return x > 0; }) }; } },
    rim: { n: "Rim raqamlari", q: function (l) { var n = R(4, 30 + l * 20); return { q: roman(n) + " = ?", a: n, w: near(n, 6, 6) }; } },
    yaxlitlash: { n: "Yaxlitlash", q: function () { var t = R(0, 1); if (t) { var n = R(11, 989); var v = Math.round(n / 10) * 10; return { q: n + " → o'nliklargacha", a: v, w: [v + 10, v - 10, Math.floor(n / 10) * 10 === v ? v + 10 : Math.floor(n / 10) * 10, Math.round(n / 100) * 100].filter(function (x) { return x !== v && x >= 0; }) }; } var d = R(10, 99) / 10 + R(0, 9); d = Math.round(d * 10) / 10; var r = Math.round(d); return { q: String(d).replace(".", ",") + " → butungacha", a: r, w: [r + 1, r - 1, Math.floor(d) === r ? r + 1 : Math.floor(d), r + 2].filter(function (x) { return x !== r && x >= 0; }) }; } },
    ketma: { n: "Ketma-ketliklar", q: function (l) { var t = R(0, 2), a = R(1, 9), d = R(2, 4 + l), s = []; if (t === 2) { d = R(2, 3); a = R(1, 3); for (var i = 0; i < 4; i++) s.push(a * Math.pow(d, i)); return { q: s.join(", ") + ", ?", a: a * Math.pow(d, 4), w: near(a * Math.pow(d, 4), 6, 10) }; } if (t === 1) { a = R(40, 90); for (var j = 0; j < 4; j++) s.push(a - d * j); return { q: s.join(", ") + ", ?", a: a - 4 * d, w: near(a - 4 * d, 6, 5) }; } for (var k = 0; k < 4; k++) s.push(a + d * k); return { q: s.join(", ") + ", ?", a: a + 4 * d, w: near(a + 4 * d, 6, 5) }; } },
    manfiy: { n: "Manfiy sonlar", q: function (l) { var a = R(-15, 15), b = R(-15, 15), o = R(0, 1); var v = o ? a + b : a - b; return { q: mstr(a) + (o ? " + " : " − ") + neg(b), a: v, w: near(v, 6, 6).concat([-v]) }; } },
    aralash: { n: "Aralash misollar", q: function (l) { return TOPICS[pick(["qoshish", "ayirish", "kopaytirish", "bolish"])].q(l); } },
    kichik: { n: "10 gacha qo'shish/ayirish", q: function () { if (R(0, 1)) { var a = R(0, 10), b = R(0, 10 - a); return { q: a + " + " + b, a: a + b, w: [] }; } var c = R(1, 10), d = R(0, c); return { q: c + " − " + d, a: c - d, w: [] }; } },
    kichikAralash: { n: "10 gacha aralash", q: function () { var t = R(0, 3); if (t === 0) { var a = R(1, 5), b = R(1, 2); return { q: a + " × " + b, a: a * b, w: [] }; } if (t === 1) { var n = R(1, 10), d = pick([1, 2]); return { q: (n * d) + " : " + d, a: n, w: [] }; } if (t === 2) { var r = R(0, 3); return { q: "√" + (r * r), a: r, w: [] }; } return TOPICS.kichik.q(); } }
  };

  // Juftlar (xotira o'yini): [chap, o'ng]
  var PAIRS = {
    kopaytirish: function () { var a = R(2, 9), b = R(2, 9); return [a + "×" + b, String(a * b)]; },
    kasrFoiz: function () { return pick([["1/2", "50%"], ["1/4", "25%"], ["3/4", "75%"], ["1/5", "20%"], ["2/5", "40%"], ["3/5", "60%"], ["4/5", "80%"], ["1/10", "10%"], ["3/10", "30%"], ["7/10", "70%"], ["9/10", "90%"], ["1/20", "5%"], ["1", "100%"], ["1/8", "12,5%"]]); },
    tenglama: function () { var x = R(1, 12), a = R(2, 6); return pick([[a + "x = " + (a * x), "x = " + x], ["x + " + a + " = " + (x + a), "x = " + x], ["x − " + a + " = " + (x - a), "x = " + x]]); }
  };

  // Qoidalar (kesish, tutish, savat, tartib) — son + shart
  var RULES = {
    tub: { n: "Tub sonlarni kes!", gen: function () { return R(2, 60); }, ok: isPrime },
    karra3: { n: "3 ga bo'linuvchilarni kes!", gen: function () { return R(1, 60); }, ok: function (v) { return v % 3 === 0; } },
    kvadratSon: { n: "To'liq kvadratlarni kes!", gen: function () { return R(0, 1) ? Math.pow(R(1, 12), 2) : R(2, 120); }, ok: function (v) { var r = Math.round(Math.sqrt(v)); return r * r === v; } },
    manfiy: { n: "Faqat manfiy sonlarni ushla!", gen: function () { return R(-20, 20); }, ok: function (v) { return v < 0; }, s: mstr },
    karra5: { n: "5 ga karrali sonlarni ushla!", gen: function () { return R(0, 1) ? 5 * R(1, 20) : R(1, 99); }, ok: function (v) { return v % 5 === 0; } },
    juft: { n: "Juft sonlarni ushla!", gen: function () { return R(1, 99); }, ok: function (v) { return v % 2 === 0; } }
  };

  // Savat (ikki savatga ajratish)
  var BINS = {
    juftToq: { n: "Juft yoki toq?", L: "JUFT", Rt: "TOQ", gen: function () { var v = R(1, 199); return { v: v, s: String(v), left: v % 2 === 0 }; } },
    tubMurakkab: { n: "Tub yoki murakkab?", L: "TUB", Rt: "MURAKKAB", gen: function () { var v = R(2, 80); return { v: v, s: String(v), left: isPrime(v) }; } },
    yarim: { n: "½ dan kichik yoki katta?", L: "< ½", Rt: "> ½", gen: function () { var b = R(3, 12), a = R(1, b - 1); while (2 * a === b) a = R(1, b - 1); return { v: a / b, s: a + "/" + b, left: 2 * a < b }; } }
  };

  // Tartiblash (o'sish tartibida bosish)
  var ORDERS = {
    butun: { n: "Kichigidan kattasiga bos!", gen: function () { var s = []; while (s.length < 6) { var v = R(-30, 60); if (s.indexOf(v) < 0) s.push(v); } return s.map(function (v) { return { v: v, s: mstr(v) }; }); } },
    kasr: { n: "Kasrlarni o'sish tartibida bos!", gen: function () { var s = [], vals = []; while (s.length < 5) { var b = R(2, 10), a = R(1, b + 3); var v = a / b; if (vals.some(function (x) { return Math.abs(x - v) < 1e-6; })) continue; vals.push(v); s.push({ v: v, s: a + "/" + b }); } return s; } },
    onli: { n: "O'nli kasrlarni o'sish tartibida bos!", gen: function () { var s = [], vals = []; while (s.length < 6) { var v = R(1, 99) / (R(0, 1) ? 10 : 100); if (vals.indexOf(v) >= 0) continue; vals.push(v); s.push({ v: v, s: String(v).replace(".", ",") }); } return s; } }
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
    karrali: { n: "Karralilarni tartib bilan tutashtir", gen: function () { var k = R(3, 9), s = []; for (var i = 1; i <= 6; i++) s.push(k * i); var w = []; while (w.length < 3) { var x = R(k + 1, k * 6); if (x % k && w.indexOf(x) < 0) w.push(x); } return { q: k + " ga karralilarni o'sish tartibida tutashtiring: " + k + ", " + (2 * k) + ", …", seq: s, wrong: w }; } }
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
    barmoq: { e: "✋", n: "Barmoq bilan sanash", how: "Javobni barmoqlaringiz bilan ko'rsating! Ikki qo'l = 10 gacha. Kamerada barcha qo'llar barmoqlari qo'shib sanaladi." },
    kesish: { e: "⚔️", n: "Kesish", how: "Sonlar uchib chiqadi. Shartga mos sonlarni qo'lni tez silkitib kesing, mos kelmaganlariga tegmang." },
    tutish: { e: "🧺", n: "Savat bilan tutish", how: "Har bir qo'l — alohida savat. Shartga mos sonlarni tuting, mos kelmaganlaridan qoching." },
    savat: { e: "📦", n: "Ajratish", how: "Sonni chimdab (bosh+ko'rsatkich) ushlang va to'g'ri savatga olib borib qo'yib yuboring. Ikki qo'l bilan ikkita sonni bir vaqtda olsa bo'ladi." },
    tutash: { e: "✏️", n: "Tutashtirish", how: "Nuqtalarni to'g'ri tartibda barmoq bilan tekkizib tutashtiring. Ortiqcha sonlarga tegmang." },
    xotira: { e: "🃏", n: "Xotira juftlari", how: "Kartani barmoq bilan tekkizib oching. Bir-biriga teng juftlarni toping." },
    tartib: { e: "📶", n: "Tartiblash", how: "Sonlarni kichigidan kattasiga qarab ketma-ket barmoq bilan bosing." },
    sonoq: { e: "📏", n: "Son o'qi", how: "Barmog'ingizni son o'qi ustida yurgizing va berilgan sonning joyida ushlab turing." },
    poyga: { e: "🏎️", n: "Poyga", how: "Qo'lingizni chapga-o'ngga suring — mashina shunday yuradi. Yo'ldagi yashil <b>+</b> darvozalar tezlikni oshiradi, qizil <b>−</b> darvozalar kamaytiradi: misolni tez yechib, eng katta qo'shuvli darvozani tanlang! Musht qilsangiz — tormoz. Kamerasiz: ← → tugmalari (2-o'yinchi A / D)." },
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
    { t: "Sport mashina poygasi", m: "poyga", k: "poyga", th: "olov", i: "Poyga" }
  ];
  var SRC = { pufak: TOPICS, yomgir: TOPICS, orbita: TOPICS, nishon: TOPICS, pianino: TOPICS, barmoq: TOPICS, kesish: RULES, tutish: RULES, savat: BINS, tartib: ORDERS, sonoq: LINES, burchak: ANGLES, tutash: CHAINS, poyga: { poyga: { n: "Qo'shish va ayirish (tezlik)" } } };
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
  var CFG = { hands: 2, duel: false, video: true, time: 60 };
  try { var sv = JSON.parse(localStorage.getItem("kav.cfg") || "{}"); for (var k in sv) if (k in CFG && k !== "time") CFG[k] = sv[k]; } catch (e) {}
  if (G.m === "barmoq" && CFG.hands < 2) CFG.hands = 2;
  if (G.duel) CFG.duel = true;

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
  hud.innerHTML = '<a class="kv-pill" href="virtual.html">← Virtual</a><span class="kv-pill" id="kv-s">⭐ 0</span><span class="kv-pill" id="kv-t">⏱ 60</span><span class="kv-pill" id="kv-h">✋ 0</span>';
  body.appendChild(hud);
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
  var sBad = function () { beep(180, 0.25, "sawtooth", 0.08); };
  var sTick = function (f) { beep(f || 520, 0.06, "square", 0.05); };

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
  var S = { run: false, score: [0, 0], ok: 0, bad: 0, streak: 0, left: 60, lvl: 1 };
  var HOLD = 0.55;
  function lvl() { return 1 + Math.floor(S.ok / 5); }
  function setQ(t) { qEl.textContent = t; qEl.classList.add("bump"); setTimeout(function () { qEl.classList.remove("bump"); }, 160); }
  function good(x, y, pl, pts) {
    S.ok++; S.streak++; var add = (pts || 10) + Math.min(10, Math.max(0, S.streak - 2) * 2);
    S.score[pl || 0] += add; burst(x, y, 40, null, 1.2); burst(x, y, 6, null, 0.6, TH.tr === "heart" ? "heart" : "star");
    ftext(x, y - 20, "+" + add, TH.acc); sGood(); if (navigator.vibrate) try { navigator.vibrate(20); } catch (e) {}
  }
  function bad(x, y, pl) { S.bad++; S.streak = 0; S.score[pl || 0] = Math.max(0, S.score[pl || 0] - 5); burst(x, y, 18, ["#ff4d4d", "#ff8a80", "#ffffff"], 0.7); ftext(x, y - 20, "−5", "#ff6b6b"); sBad(); }
  function updHud() {
    $("kv-s").textContent = CFG.duel ? "🔵 " + S.score[0] + " : " + S.score[1] + " 🔴" : "⭐ " + S.score[0];
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
      q = tp.q(lvl()); setQ(q.q + " = ?");
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
          if (p) { if (t.ok) { good(t.x, t.y, p.player); nq(); return; } bad(t.x, t.y, p.player); b.splice(i, 1); }
        }
      },
      draw: function (dt) { b.forEach(function (t) { var sx = shx(t, dt); drawBall(t.x + sx, t.y, t.r, t.s); drawHoldRing(t.x, t.y, t.r, t.hold); }); }
    };
  };

  // ---------- Son yomg'iri ----------
  M.yomgir = function () {
    var tp = TOPICS[G.k], b = [], q;
    function nq() {
      q = tp.q(lvl()); setQ(q.q + " = ?");
      var o = makeOpts(q, 5), lanes = shuffle([0, 1, 2, 3, 4]), r = Math.max(30, Math.min(W / 12, H / 9));
      b = o.map(function (op, i) { return { x: W * (0.12 + lanes[i] * 0.19), y: -r - i * H * 0.16 - Math.random() * 40, r: r, s: op.s, ok: op.ok, v: H / (6.5 - Math.min(3, lvl() * 0.35)) }; });
    }
    return {
      start: nq,
      update: function (dt) {
        for (var i = b.length - 1; i >= 0; i--) {
          var t = b[i]; t.y += t.v * dt;
          if (t.y > H + t.r) { if (t.ok) { bad(t.x, H - 30, 0); nq(); return; } b.splice(i, 1); continue; }
          var p = holdPick(t, dt, inCircle(t, 1.15), false, 0.35);
          if (p) { if (t.ok) { good(t.x, t.y, p.player); nq(); return; } bad(t.x, t.y, p.player); b.splice(i, 1); }
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
    function nq() { q = tp.q(lvl()); setQ(q.q + " = ?"); var o = makeOpts(q, 5); b = o.map(function (op, i) { return { s: op.s, ok: op.ok, a0: i * Math.PI * 2 / 5, x: 0, y: 0, r: 30 }; }); }
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
          if (p) { if (t.ok) { good(t.x, t.y, p.player); nq(); return; } bad(t.x, t.y, p.player); b.splice(i, 1); return; }
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
      q = tp.q(lvl()); setQ("🎯 " + q.q + " = ?"); var o = makeOpts(q, 5), r = Math.max(32, Math.min(W / 11, H / 9));
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
          lasers.push({ a: from, b: { x: aim.x, y: aim.y }, l: 0.25, c: p.col }); beep(900, 0.05, "square", 0.05);
          for (var i = 0; i < b.length; i++) {
            var t = b[i]; if (Math.hypot(aim.x - t.x, aim.y - t.y) < t.r * 1.25) {
              if (t.ok) { good(t.x, t.y, p.player); nq(); } else { bad(t.x, t.y, p.player); b.splice(i, 1); }
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
    function nq() { q = tp.q(lvl()); ans = mstr(q.a); typed = ""; setQ(q.q + " = ?"); }
    function press(k, p) {
      k.flash = 0.25; var f = 260 * Math.pow(2, keys.indexOf(k) / 12); beep(f, 0.25, "triangle", 0.1);
      burst(k.x + k.w / 2, k.y, 10, null, 0.5);
      if (k.l === "⌫") typed = typed.slice(0, -1); else if (k.l === "−") { if (!typed) typed = "−"; } else typed += k.l;
      if (typed === ans) { good(W / 2, H * 0.32, p.player); nq(); }
      else if (typed.replace("−", "").length >= ans.replace("−", "").length && typed.length >= ans.length) { bad(W / 2, H * 0.32, p.player); msgT = 1.2; msg = "Javob: " + ans; typed = ""; nq(); }
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
    var tp = TOPICS[G.k], q, holdT = [0, 0], btns = [], maxA = 10;
    function nq() { maxA = mouseMode ? 10 : Math.min(10, CFG.hands * 5); var t = 0; do { q = tp.q(lvl()); } while ((q.a > maxA || q.a < 0) && t++ < 50); setQ(q.q + " = ?"); holdT = [0, 0]; }
    function counts() { var c = [0, 0]; hands.forEach(function (h) { var pl = CFG.duel && h.pts[0].x >= W / 2 ? 1 : 0; c[pl] += h.fingers; }); return c; }
    function layout() { var n = 11, w = Math.min(70, W * 0.9 / n); btns = []; for (var i = 0; i < n; i++) btns.push({ v: i, x: W / 2 - w * n / 2 + i * w + 3, y: H - w - 50, w: w - 6, h: w - 6 }); }
    return {
      start: function () { layout(); nq(); }, resize: layout,
      update: function (dt) {
        if (mouseMode) {
          pointers.forEach(function (p) { if (!p.pinchStart) return; btns.forEach(function (b) { if (p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h) { if (b.v === q.a) { good(b.x + b.w / 2, b.y, 0); nq(); } else bad(b.x + b.w / 2, b.y, 0); } }); });
          return;
        }
        var c = counts();
        for (var pl = 0; pl < (CFG.duel ? 2 : 1); pl++) {
          if (c[pl] === q.a && hands.length) { holdT[pl] += dt; if (holdT[pl] > 0.9) { good(CFG.duel ? (pl ? W * 0.75 : W * 0.25) : W / 2, H * 0.45, pl); nq(); return; } }
          else holdT[pl] = Math.max(0, holdT[pl] - dt * 2);
        }
      },
      draw: function () {
        if (!q) return;
        if (mouseMode) { btns.forEach(function (b) { drawBox(b.x, b.y, b.w, b.h, String(b.v)); }); ctx.fillStyle = "#cfd8ef"; ctx.font = "600 14px " + FONT; ctx.textAlign = "center"; ctx.fillText("Kamerasiz rejim: javob tugmasini bosing", W / 2, H - 24); return; }
        hands.forEach(function (h) { var x = h.pts[0].x, y = Math.min(h.pts[12].y, h.pts[8].y) - 40; ctx.font = "900 " + (U * 7 + 10) + "px " + FONT; ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.shadowColor = TH.acc; ctx.shadowBlur = 18; ctx.fillText(h.fingers, x, y); ctx.shadowBlur = 0; });
        var c = counts();
        for (var pl = 0; pl < (CFG.duel ? 2 : 1); pl++) {
          var cx = CFG.duel ? (pl ? W * 0.75 : W * 0.25) : W / 2, cy = H - 90, r = 52;
          drawBall(cx, cy, r, String(c[pl]), { c: CFG.duel ? (pl ? "#ff5c8a" : "#4dd2ff") : TH.acc, max: 48 });
          drawHoldRing(cx, cy, r, holdT[pl], 0.9);
          ctx.fillStyle = "#cfd8ef"; ctx.font = "600 13px " + FONT; ctx.textAlign = "center"; ctx.fillText(CFG.duel ? (pl ? "2-o'yinchi" : "1-o'yinchi") + " barmoqlari" : "Jami barmoqlar", cx, cy - r - 12);
        }
        if (CFG.duel) { ctx.strokeStyle = "#ffffff33"; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(W / 2, 100); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]); }
      }
    };
  };

  // ---------- Kesish ----------
  M.kesish = function () {
    var rule = RULES[G.k], items = [], spawnT = 0, halves = [];
    function spawn() {
      var v = rule.gen(), r = Math.max(30, Math.min(W / 13, H / 9)), g = H * 1.25, h = H * (0.5 + Math.random() * 0.3), x = W * (0.15 + Math.random() * 0.7);
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
              if (t.ok) good(t.x, t.y, p.player); else bad(t.x, t.y, p.player);
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
        spawnT -= dt; if (spawnT <= 0) { var v = rule.gen(), r = Math.max(26, Math.min(W / 16, H / 11)); items.push({ v: v, s: (rule.s || String)(v), ok: rule.ok(v), x: W * (0.08 + Math.random() * 0.84), y: -r, r: r, vy: H / (4.8 - Math.min(2.2, lvl() * 0.2)) * (0.8 + Math.random() * 0.4) }); spawnT = Math.max(0.45, 1.1 - lvl() * 0.06); }
        var by = H - 9 * U - 40, bw = basketW();
        for (var i = items.length - 1; i >= 0; i--) {
          var t = items[i], py = t.y; t.y += t.vy * dt;
          if (py < by && t.y >= by) {
            for (var j = 0; j < pointers.length; j++) { var p = pointers[j]; if (Math.abs(t.x - p.palm.x) < bw / 2 + t.r * 0.4) { if (t.ok) good(t.x, by, p.player); else bad(t.x, by, p.player); items.splice(i, 1); break; } }
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
      while (items.length < n) { var g = bin.gen(), hx = W * (n === 1 ? 0.5 : items.length ? 0.62 : 0.38); items.push({ g: g, s: g.s, hx: hx, hy: H * 0.38, x: hx, y: -r, r: r, held: null }); }
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
            if (inb) { var pl = p ? p.player : 0; if (inb.left === t.g.left) { good(t.x, t.y, pl); items.splice(i, 1); spawn(); continue; } bad(t.x, t.y, pl); shake(t); }
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
      var c = ch.gen(); seq = c.seq; next = 0; path = []; setQ(c.q);
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
            if (d.v === seq[next]) { d.done = true; path.push(d); next++; sTick(400 + next * 80); burst(d.x, d.y, 14, null, 0.6); if (next === seq.length) { good(d.x, d.y, p.player, 30); setTimeout(nq, 500); next = -99; } }
            else { bad(d.x, d.y, p.player); shake(d); }
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
      while (pairs.length < 6) { var pr = gen(); if (used[pr[0]] || used[pr[1]]) continue; used[pr[0]] = used[pr[1]] = 1; pairs.push(pr); }
      var list = []; pairs.forEach(function (pr, i) { list.push({ s: pr[0], id: i }, { s: pr[1], id: i }); });
      list = shuffle(list); var port = H > W, cols = port ? 3 : 4, rows = port ? 4 : 3;
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
              if (open[0].id === open[1].id) { open.forEach(function (o) { o.st = 2; }); good(c.x + c.w / 2, c.y + c.h / 2, p.player); open = []; matched++; if (matched === 6) { ftext(W / 2, H / 2, "ZO'R! +20", TH.acc); S.score[p.player] += 20; setTimeout(nq, 900); } }
              else { waitT = 0.9; S.streak = 0; }
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
      var list = ord.gen(), r = Math.max(32, Math.min(W / 13, H / 9.5)), pos = scatter(list.length, r);
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
            if (Math.abs(t.v - sorted[next].v) < 1e-9) { next++; t.n = next; sTick(400 + next * 90); burst(t.x, t.y, 14, null, 0.6); if (next === sorted.length) { good(t.x, t.y, p.player, 25); setTimeout(nq, 600); } }
            else { bad(t.x, t.y, p.player); shake(t); }
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
      if (Math.abs(v - tg.v) <= L.tol) good(xOf(tg.v), g.y, p.player); else bad(xOf(v), g.y, p.player);
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
    function nq() { tg = A.gen(); setQ(tg.q + (G.k === "trig" ? "  →  α ni yasang" : "")); holdT = 0; }
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
        if (diff <= tol) { holdT += dt; if (holdT > 1) { var m = l ? { x: (l.a.x + l.b.x) / 2, y: (l.a.y + l.b.y) / 2 } : { x: W / 2, y: H / 2 }; good(m.x, m.y, 0); nq(); } }
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

  // ---------- Poyga (sport mashina, V12 ovozi) ----------
  M.poyga = function () {
    var LANES = [-0.62, 0, 0.62], CAMD = 9, VIEW = 320, GAP = 230;
    var racers = [], rows = [], keys = {}, engines = [], stopped = false;
    var COLORS = ["#e10600", "#1e88ff", "#ffd400", "#22c55e", "#ff6ad5"];
    function mkRacer(i, human, sp, d) { return { i: i, human: human, x: human ? 0 : LANES[i % 3], tx: 0, sp: sp, dist: d, col: COLORS[i % COLORS.length], gear: 1, boost: 0, hit: 0, last: null, nextRow: GAP }; }
    function nPlayers() { return CFG.duel && !mouseMode ? 2 : 1; }
    // Yo'ldagi amal: belgi, matn, qiymat
    function op(l, sign) {
      var v, s;
      if (l < 2) { v = R(2, 6) * 5; s = String(v); }
      else if (l < 4) { var a = R(2, 9), b = R(2, 6); v = a * b; s = a + "×" + b; }
      else { var t = R(0, 2); if (t === 0) { var c = R(2, 9), d = R(2, 9); v = c + d; s = c + "+" + d; } else if (t === 1) { var e = R(2, 9), f = R(2, 9); v = e * f; s = e + "×" + f; } else { var g = R(2, 9), h = R(2, 9); v = g * h / g * 1; s = (g * h) + ":" + g; v = h; } }
      return { sign: sign, v: v, s: (sign > 0 ? "+" : "−") + (s.length > 2 ? "(" + s + ")" : s) };
    }
    function makeRow(z) {
      var l = lvl(), ops = [op(l, 1), op(l, R(0, 2) ? -1 : 1), op(l, -1)];
      return { z: z, ops: shuffle(ops), done: {} };
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
        return { out: out, lp: lp, o1: o1, o2: o2, o3: o3, lfo: lfo, set: function (rpm, load) {
          var t = AC.currentTime, f = rpm / 10; // V12: rpm*12/120
          o1.frequency.setTargetAtTime(f, t, 0.04); o2.frequency.setTargetAtTime(f / 2, t, 0.04); o3.frequency.setTargetAtTime(f * 2.005, t, 0.04);
          lfo.frequency.setTargetAtTime(f / 12, t, 0.05);
          lp.frequency.setTargetAtTime(600 + rpm * 0.55 + load * 900, t, 0.05);
          out.gain.setTargetAtTime(SND ? 0.05 + 0.06 * load + rpm / 9000 * 0.06 : 0, t, 0.08);
        }, stop: function () { try { out.gain.setTargetAtTime(0, AC.currentTime, 0.1); var self = this; setTimeout(function () { [self.o1, self.o2, self.o3, self.lfo].forEach(function (o) { try { o.stop(); } catch (e) {} }); out.disconnect(); }, 500); } catch (e) {} } };
      } catch (e) { return null; }
    }
    var GEARS = [0, 60, 110, 160, 210, 260, 310, 999];
    function rpmOf(r) {
      var g = 1; while (g < 7 && r.sp > GEARS[g]) g++;
      if (g !== r.gear) { r.shift = 0.12; r.gear = g; }
      var lo = GEARS[g - 1], hi = Math.min(GEARS[g], 380), k = clamp((r.sp - lo) / (hi - lo), 0, 1);
      var rpm = 3500 + k * 5200; if (r.shift > 0) rpm -= 1800 * r.shift / 0.12;
      return rpm;
    }
    function whoosh(up) { beep(up ? 520 : 300, 0.12, "triangle", 0.1); setTimeout(function () { beep(up ? 880 : 180, 0.18, up ? "triangle" : "sawtooth", 0.08); }, 70); }

    // ---- chizish yordamchilari ----
    function curveAt(r, z) { return Math.sin((r.dist + z) / 900) * 0.000012 * z * z + Math.sin((r.dist + z) / 370) * 0.000004 * z * z; }
    function proj(V, r, wx, z) { var p = CAMD / (Math.max(0.1, z) + CAMD), hy = V.y + V.h * 0.4; return { x: V.x + V.w / 2 + (wx + curveAt(r, z) - r.x * 0.75) * p * V.w * 0.62, y: hy + p * (V.h - (V.h * 0.4)) * 1.0, p: p }; }
    function drawCar(cx, cy, s, col, me) {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
      ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.beginPath(); ctx.ellipse(0, 6, 62, 10, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#111"; rrc(-60, -16, 22, 26, 5); rrc(38, -16, 22, 26, 5);            // g'ildiraklar
      var gr = ctx.createLinearGradient(0, -48, 0, 8); gr.addColorStop(0, "#fff"); gr.addColorStop(0.12, col); gr.addColorStop(1, shade(col));
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(-54, 4); ctx.lineTo(-56, -14); ctx.quadraticCurveTo(-50, -30, -30, -34); ctx.lineTo(-20, -50); ctx.quadraticCurveTo(0, -56, 20, -50); ctx.lineTo(30, -34); ctx.quadraticCurveTo(50, -30, 56, -14); ctx.lineTo(54, 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#0b1020"; ctx.beginPath(); ctx.moveTo(-17, -47); ctx.quadraticCurveTo(0, -52, 17, -47); ctx.lineTo(24, -35); ctx.lineTo(-24, -35); ctx.closePath(); ctx.fill(); // orqa oyna
      ctx.fillStyle = "#151515"; rrc(-58, -40, 116, 6, 2); ctx.fillRect(-40, -36, 4, 6); ctx.fillRect(36, -36, 4, 6);       // qanot
      ctx.fillStyle = "#ff2a2a"; ctx.shadowColor = "#ff0000"; ctx.shadowBlur = me && keyBrake ? 25 : 10;
      [-44, -32, 32, 44].forEach(function (x) { ctx.beginPath(); ctx.arc(x, -20, 5, 0, 7); ctx.fill(); }); ctx.shadowBlur = 0;
      ctx.fillStyle = "#222"; rrc(-30, -12, 60, 12, 3);
      ctx.fillStyle = "#999"; [-12, -5, 5, 12].forEach(function (x) { ctx.beginPath(); ctx.arc(x, -2, 2.6, 0, 7); ctx.fill(); });           // 4 ta chiqindi quvur
      ctx.restore();
    }
    var keyBrake = false;
    function rrc(x, y, w, h, r) { rr(x, y, w, h, r); ctx.fill(); }
    function shade(c) { var n = parseInt(c.slice(1), 16), r = (n >> 16) * 0.45 | 0, g = ((n >> 8) & 255) * 0.45 | 0, b = (n & 255) * 0.45 | 0; return "rgb(" + r + "," + g + "," + b + ")"; }

    function views() { var n = nPlayers(); return n === 1 ? [{ x: 0, y: 0, w: W, h: H }] : [{ x: 0, y: 0, w: W / 2, h: H }, { x: W / 2, y: 0, w: W / 2, h: H }]; }

    function renderView(V, me) {
      ctx.save(); ctx.beginPath(); ctx.rect(V.x, V.y, V.w, V.h); ctx.clip();
      var hy = V.y + V.h * 0.4;
      // osmon
      var sk = ctx.createLinearGradient(0, V.y, 0, hy); sk.addColorStop(0, "#0b1330"); sk.addColorStop(0.7, "#ff6a3d"); sk.addColorStop(1, "#ffb36b");
      ctx.fillStyle = sk; ctx.fillRect(V.x, V.y, V.w, hy - V.y);
      var sx = V.x + V.w / 2 - Math.sin(me.dist / 900) * V.w * 0.3;
      ctx.fillStyle = "#ffe08a"; ctx.shadowColor = "#ffcf5a"; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(sx, hy - V.h * 0.07, V.h * 0.06, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      // tog'lar
      ctx.fillStyle = "#3a1d3f"; ctx.beginPath(); ctx.moveTo(V.x, hy); for (var i = 0; i <= 24; i++) { var mx = V.x + i * V.w / 24; ctx.lineTo(mx, hy - V.h * (0.04 + 0.05 * Math.abs(Math.sin(i * 1.7 + me.dist / 2500)))); } ctx.lineTo(V.x + V.w, hy); ctx.fill();
      // o't
      ctx.fillStyle = "#123d1d"; ctx.fillRect(V.x, hy, V.w, V.y + V.h - hy);
      // yo'l bo'laklari (uzoqdan yaqinga)
      var seg = 8, off = me.dist % (seg * 2);
      for (var z = VIEW; z > -2; z -= seg) {
        var z1 = z - off, z2 = z1 + seg; if (z2 < 0) continue;
        var a1 = proj(V, me, -1.1, Math.max(z1, 0)), b1 = proj(V, me, 1.1, Math.max(z1, 0)), a2 = proj(V, me, -1.1, z2), b2 = proj(V, me, 1.1, z2);
        var alt = Math.floor((me.dist + z1 + 1000) / seg) % 2;
        ctx.fillStyle = alt ? "#165a28" : "#124a21"; ctx.fillRect(V.x, a2.y, V.w, a1.y - a2.y + 1);
        // bordyur
        var k1 = proj(V, me, -1.22, Math.max(z1, 0)), k2 = proj(V, me, -1.22, z2), l1 = proj(V, me, 1.22, Math.max(z1, 0)), l2 = proj(V, me, 1.22, z2);
        ctx.fillStyle = alt ? "#e10600" : "#f2f2f2";
        quad(k1.x, k1.y, a1.x, a1.y, a2.x, a2.y, k2.x, k2.y); quad(b1.x, b1.y, l1.x, l1.y, l2.x, l2.y, b2.x, b2.y);
        ctx.fillStyle = alt ? "#34373d" : "#3b3f46"; quad(a1.x, a1.y, b1.x, b1.y, b2.x, b2.y, a2.x, a2.y);
        if (alt) [-0.31, 0.31].forEach(function (lx) { var c1 = proj(V, me, lx - 0.012, Math.max(z1, 0)), d1 = proj(V, me, lx + 0.012, Math.max(z1, 0)), c2 = proj(V, me, lx - 0.012, z2), d2 = proj(V, me, lx + 0.012, z2); ctx.fillStyle = "#eaeaea"; quad(c1.x, c1.y, d1.x, d1.y, d2.x, d2.y, c2.x, c2.y); });
      }
      // obyektlar: amal darvozalari va boshqa mashinalar (uzoqdan yaqinga)
      var objs = [];
      rows.forEach(function (rw) { var z = rw.z - me.dist; if (z > 1 && z < VIEW) objs.push({ z: z, row: rw }); });
      racers.forEach(function (o) { if (o === me) return; var z = o.dist - me.dist; if (z > 2 && z < VIEW) objs.push({ z: z, car: o }); });
      objs.sort(function (a, b) { return b.z - a.z; });
      objs.forEach(function (ob) {
        if (ob.row) ob.row.ops.forEach(function (o, li) {
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
        else { var P = proj(V, me, ob.car.x, ob.z); drawCar(P.x, P.y, P.p * V.w / 380, ob.car.col, false); if (ob.car.human && P.p > 0.08) { ctx.fillStyle = "#fff"; ctx.font = "800 12px " + FONT; ctx.textAlign = "center"; ctx.fillText(ob.car.i ? "2-o'yinchi" : "1-o'yinchi", P.x, P.y - P.p * V.w / 380 * 60); } }
      });
      // o'yinchi mashinasi
      var mp = proj(V, me, me.x, 3.2), sh = me.hit > 0 ? Math.sin(tGlobal * 60) * 6 : 0;
      keyBrake = me.braking;
      drawCar(mp.x + sh, mp.y, mp.p * V.w / 380, me.col, true);
      if (me.boost > 0) for (var f = 0; f < 3; f++) addP({ x: mp.x + (Math.random() - 0.5) * 20 * mp.p * V.w / 380, y: mp.y, vx: (Math.random() - 0.5) * 40, vy: 80 + Math.random() * 80, life: 0, max: 0.35, r: 3 + Math.random() * 3, c: pick(["#ff9100", "#ffd600", "#4dd2ff"]), g: 0, t: "dot" });
      // tezlik o'lchagich
      var gx = V.x + V.w - 92, gy = V.y + V.h - 92, gr2 = 70;
      ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.beginPath(); ctx.arc(gx, gy, gr2 + 10, 0, 7); ctx.fill();
      ctx.lineWidth = 8; ctx.strokeStyle = "#ffffff22"; ctx.beginPath(); ctx.arc(gx, gy, gr2, Math.PI * 0.75, Math.PI * 2.25); ctx.stroke();
      var fr = clamp(me.sp / 400, 0, 1); ctx.strokeStyle = fr > 0.75 ? "#ff3d00" : fr > 0.45 ? "#ffd400" : "#22c55e"; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(gx, gy, gr2, Math.PI * 0.75, Math.PI * 0.75 + fr * Math.PI * 1.5); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "900 30px " + FONT; ctx.fillText(Math.round(me.sp), gx, gy - 4);
      ctx.font = "700 11px " + FONT; ctx.fillStyle = "#cfd8ef"; ctx.fillText("km/soat · " + me.gear + "-uzatma", gx, gy + 20);
      // o'rin va masofa
      var place = 1 + racers.filter(function (o) { return o !== me && o.dist > me.dist; }).length;
      ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = "900 " + (V.w < 500 ? 22 : 28) + "px " + FONT; ctx.shadowColor = "#000"; ctx.shadowBlur = 8;
      ctx.fillText(place + "-o'rin / " + racers.length, V.x + 16, V.y + V.h - 64);
      ctx.font = "700 15px " + FONT; ctx.fillText("🏁 " + (me.dist / 1000).toFixed(2) + " km", V.x + 16, V.y + V.h - 36); ctx.shadowBlur = 0;
      if (nPlayers() === 2) { ctx.fillStyle = me.i ? "#ff5c8a" : "#4dd2ff"; ctx.font = "800 14px " + FONT; ctx.textAlign = "center"; ctx.fillText(me.i ? "2-o'yinchi (o'ng qo'l tomoni)" : "1-o'yinchi (chap qo'l tomoni)", V.x + V.w / 2, V.y + 96); }
      ctx.restore();
    }
    function quad(x1, y1, x2, y2, x3, y3, x4, y4) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath(); ctx.fill(); }

    function onKey(e) { keys[e.key.toLowerCase()] = e.type === "keydown"; if (["arrowleft", "arrowright", "arrowdown", "arrowup", " "].indexOf(e.key.toLowerCase()) >= 0) e.preventDefault(); }
    window.addEventListener("keydown", onKey); window.addEventListener("keyup", onKey);

    return {
      start: function () {
        racers = []; rows = [];
        var n = nPlayers();
        for (var i = 0; i < n; i++) racers.push(mkRacer(i, true, 120, 0));
        [[170, 60], [205, 140], [235, 230]].forEach(function (a, j) { racers.push(mkRacer(n + j, false, a[0], a[1])); });
        for (var z = 160; z < 160 + GAP * 6; z += GAP) rows.push(makeRow(z));
        engines = []; for (var e = 0; e < n; e++) engines.push(mkEngine(n === 2 ? (e ? 0.6 : -0.6) : 0));
        setQ(""); qEl.style.display = "none";
        if (!$("kv-snd")) { var sb = document.createElement("span"); sb.className = "kv-pill"; sb.id = "kv-snd"; sb.style.cursor = "pointer"; sb.textContent = "🔊 Motor"; sb.onclick = function () { SND = !SND; sb.textContent = SND ? "🔊 Motor" : "🔇 Motor"; }; hud.appendChild(sb); }
      },
      stop: function () { stopped = true; engines.forEach(function (en) { en && en.stop(); }); engines = []; window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); qEl.style.display = ""; },
      update: function (dt) {
        var n = nPlayers(), l = lvl();
        racers.forEach(function (r) {
          if (r.human) {
            // boshqaruv: shu o'yinchiga tegishli qo'l
            var my = pointers.filter(function (p) { return n === 1 || p.player === r.i; })[0];
            var V = views()[r.i];
            r.braking = false;
            if (my) {
              r.tx = clamp(((my.palm.x - V.x) / V.w - 0.5) * 2.6, -1.15, 1.15);
              if (my.hand && my.hand.fingers === 0 && my.hand.fingersStable > 3) r.braking = true;
            } else {
              var L = r.i ? keys.a : keys.arrowleft, Rk = r.i ? keys.d : keys.arrowright;
              if (L) r.tx = clamp(r.tx - dt * 2.4, -1.15, 1.15); if (Rk) r.tx = clamp(r.tx + dt * 2.4, -1.15, 1.15);
              if (r.i ? keys.s : keys.arrowdown) r.braking = true;
            }
            r.x += (r.tx - r.x) * Math.min(1, dt * 6);
            if (r.braking) r.sp -= 90 * dt;
            if (Math.abs(r.x) > 1.05) r.sp -= 70 * dt;           // yo'ldan chiqsa sekinlashadi
            r.sp += (r.sp < 100 ? 12 : 2) * dt;                   // sekin tezlanish
          } else {
            r.sp += (Math.min(330, (r.base = r.base || r.sp) + l * 12) - r.sp) * dt * 0.3;
            r.x += (LANES[(Math.floor(r.dist / 600) + r.i) % 3] - r.x) * dt * 0.8;
          }
          r.sp = clamp(r.sp, 40, 400);
          if (r.boost > 0) r.boost -= dt; if (r.hit > 0) r.hit -= dt; if (r.shift > 0) r.shift -= dt;
          var prev = r.dist; r.dist += r.sp / 3.6 * dt;
          if (!r.human) return;
          S.score[r.i] = Math.round(r.dist / 10);
          // darvozadan o'tish
          rows.forEach(function (rw) {
            if (rw.done[r.i] != null) return;
            if (prev + 3.2 <= rw.z && r.dist + 3.2 > rw.z) {
              var li = 0, bd = 9; LANES.forEach(function (lx, k) { var d = Math.abs(r.x - lx); if (d < bd) { bd = d; li = k; } });
              rw.done[r.i] = li;
              if (bd > 0.36) return; // darvozalar orasidan o'tdi
              var o = rw.ops[li], V = views()[r.i], P = proj(V, r, r.x, 6);
              r.sp = clamp(r.sp + o.sign * o.v, 40, 400);
              if (o.sign > 0) { S.ok++; S.streak++; r.boost = 0.9; whoosh(true); burst(P.x, P.y - 40, 30, ["#22c55e", "#b6ff00", "#ffffff"], 1); }
              else { S.bad++; S.streak = 0; r.hit = 0.4; whoosh(false); burst(P.x, P.y - 40, 20, ["#ef4444", "#ff8a80"], 0.8); }
              ftext(P.x, P.y - 90, o.s + " → " + Math.round(r.sp) + " km/soat", o.sign > 0 ? "#5ee67a" : "#ff6b6b");
            }
          });
          // raqib mashinaga urilish
          racers.forEach(function (o) { if (o === r || o.human) return; var dz = o.dist - r.dist; if (dz > -1 && dz < 4 && Math.abs(o.x - r.x) < 0.38 && r.hit <= 0) { r.sp *= 0.72; r.hit = 0.6; sBad(); var V = views()[r.i]; ftext(V.x + V.w / 2, V.h * 0.6, "Urildingiz! −28%", "#ff6b6b"); } });
          if (engines[r.i]) engines[r.i].set(rpmOf(r), r.boost > 0 ? 1 : r.braking ? 0.1 : 0.6);
        });
        // yangi darvozalar
        var minD = Math.min.apply(null, racers.filter(function (r) { return r.human; }).map(function (r) { return r.dist; }));
        var maxD = Math.max.apply(null, racers.filter(function (r) { return r.human; }).map(function (r) { return r.dist; }));
        rows = rows.filter(function (rw) { return rw.z > minD - 20; });
        var lastZ = rows.length ? rows[rows.length - 1].z : maxD + 100;
        while (lastZ < maxD + VIEW + GAP) { lastZ += GAP; rows.push(makeRow(lastZ)); }
      },
      draw: function () {
        if (!racers.length) return;
        var V = views();
        V.forEach(function (v, i) { renderView(v, racers[i]); });
        if (V.length === 2) { ctx.fillStyle = "#000"; ctx.fillRect(W / 2 - 2, 0, 4, H); }
        if (!S.run && S.cd > 0) racers.forEach(function (r, i) { if (r.human && engines[i]) engines[i].set(2500 + Math.random() * 400, 0.2); });
      }
    };
  };
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
      S.left -= rdt; if (S.left <= 0) { S.left = 0; endGame(); }
      else mech.update(dt);
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
        CFG[k] = v === "true" ? true : v === "false" ? false : +v;
        Array.prototype.forEach.call(sg.children, function (x) { x.classList.toggle("on", x === b); });
        try { localStorage.setItem("kav.cfg", JSON.stringify({ hands: CFG.hands, duel: CFG.duel, video: CFG.video })); } catch (er) {}
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
      '<div class="kv-opts">' +
      '<div class="kv-opt"><b>✋ Qo\'llar soni (kamera sezadi)</b>' + segHTML("hands", [1, 2, 3, 4], ["1", "2", "3", "4"]) + "</div>" +
      '<div class="kv-opt"><b>👥 Rejim</b>' + segHTML("duel", [false, true], ["Yakka", "Duel (2 kishi)"]) + "</div>" +
      '<div class="kv-opt"><b>📷 Kamera tasviri</b>' + segHTML("video", [true, false], ["Ko'rinsin", "Faqat skelet"]) + "</div>" +
      '<div class="kv-opt"><b>⏱ Vaqt</b>' + segHTML("time", [60, 90, 120], ["60 s", "90 s", "120 s"]) + "</div>" +
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
    S.score = [0, 0]; S.ok = 0; S.bad = 0; S.streak = 0; S.left = CFG.time; S.run = false; S.cd = 3.2;
    mech = M[G.m](); mech.start(); subEl.innerHTML = MK.how;
    setTimeout(function () { subEl.textContent = ""; }, 9000);
    beep(440, 0.1); setTimeout(function () { beep(440, 0.1); }, 1000); setTimeout(function () { beep(440, 0.1); }, 2000); setTimeout(function () { beep(880, 0.3); }, 3000);
  }
  function endGame() {
    S.run = false; if (mech && mech.stop) mech.stop(); var tot = S.score[0] + S.score[1], b = best(), rec = false;
    var my = CFG.duel ? Math.max(S.score[0], S.score[1]) : S.score[0];
    if (my > b) { rec = true; try { localStorage.setItem(LS_BEST, my); } catch (e) {} }
    var coins = Math.floor(tot / 10), gave = false;
    try { if (coins > 0 && window.kaAccount && window.kaAccount.me()) gave = window.kaAccount.addCoins(coins, "Virtual: " + G.t); } catch (e) {}
    qEl.textContent = "";
    var res = CFG.duel
      ? '<div class="kv-big">🔵 ' + S.score[0] + " : " + S.score[1] + ' 🔴</div><p style="font-size:20px;font-weight:800;color:#fff">' + (S.score[0] === S.score[1] ? "Durang! 🤝" : (S.score[0] > S.score[1] ? "1-o'yinchi" : "2-o'yinchi") + " g'olib! 🏆") + "</p>"
      : '<div class="kv-big">⭐ ' + S.score[0] + "</div>";
    ov.style.display = "flex";
    ov.innerHTML = '<div class="kv-card"><span class="kv-tag">' + G.t + "</span><h1>" + (rec ? "🎉 Yangi rekord!" : "O'yin tugadi") + "</h1>" + res +
      "<p>✅ To'g'ri: <b>" + S.ok + "</b> &nbsp; ❌ Xato: <b>" + S.bad + "</b> &nbsp; 🏅 Rekord: <b>" + Math.max(b, my) + "</b></p>" +
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
