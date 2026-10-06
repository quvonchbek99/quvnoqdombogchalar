/*!
 * Kuvonch Academy — "Noldan π gacha" bo'limi
 * Khan Academy uslubidagi kurs daraxti + akam.uz uslubidagi mavzuli testlar.
 * Savollar: Google Sheets bazasi (bo'lsa) + mashq-generator.js (har safar yangi sonlar).
 */
(function () {
  "use strict";
  if (window.__kaNP) return; window.__kaNP = true;

  var R = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var RNZ = function (a, b) { var v; do { v = R(a, b); } while (!v); return v; };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = R(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function fr(n, d) { var g = gcd(n, d) || 1; n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : n + "/" + d; }
  function rnd(x, k) { var p = Math.pow(10, k == null ? 2 : k); return Math.round(x * p) / p; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  /* ===================== Qo'shimcha generatorlar ===================== */
  var XG = {
    sanash: function () {
      var t = R(0, 2);
      if (t === 0) { var a = R(3, 12), d = R(2, 5), n = R(4, 7); return { q: a + ", " + (a + d) + ", " + (a + 2 * d) + ", … ketma-ketlikning " + n + "-hadi nechaga teng?", a: a + (n - 1) * d }; }
      if (t === 1) { var b = R(20, 90); return { q: b + " sonidan oldin keladigan son nechaga teng?", a: b - 1 }; }
      var c = R(2, 9), m = R(3, 9); return { q: c + " ta savatning har birida " + m + " tadan olma bor. Hammasi bo'lib nechta olma?", a: c * m };
    },
    olchov: function () {
      var t = R(0, 3);
      if (t === 0) { var m = R(2, 9); return { q: m + " metr necha santimetrga teng?", a: m * 100 }; }
      if (t === 1) { var k = R(2, 9); return { q: k + " kilogramm necha grammga teng?", a: k * 1000 }; }
      if (t === 2) { var s = R(2, 9); return { q: s + " soat necha minutga teng?", a: s * 60 }; }
      var l = R(2, 9); return { q: l + " litr necha millilitrga teng?", a: l * 1000 };
    },
    kasr: function () {
      var a, b, c, d, t = R(0, 3);
      do { a = R(1, 8); b = R(2, 9); } while (a >= b || a % b === 0 || b % a === 0);
      do { c = R(1, 8); d = R(2, 9); } while (c >= d || d % c === 0 || (c === a && d === b));
      if (t === 0) return { q: a + "/" + b + " + " + c + "/" + d + " ni hisoblang (qisqartirilgan holda).", a: a / b + c / d, fmt: fr(a * d + c * b, b * d), nd: [a * d + c * b, b * d] };
      if (t === 1) return { q: a + "/" + b + " − " + c + "/" + d + " ni hisoblang (qisqartirilgan holda).", a: a / b - c / d, fmt: fr(a * d - c * b, b * d), nd: [a * d - c * b, b * d] };
      if (t === 2) return { q: a + "/" + b + " · " + c + "/" + d + " ni hisoblang.", a: (a * c) / (b * d), fmt: fr(a * c, b * d), nd: [a * c, b * d] };
      return { q: "(" + a + "/" + b + ") : (" + c + "/" + d + ") ni hisoblang.", a: (a * d) / (b * c), fmt: fr(a * d, b * c), nd: [a * d, b * c] };
    },
    onli: function () {
      var a = rnd(R(11, 99) / 10, 1), b = rnd(R(11, 99) / 10, 1), t = R(0, 2);
      if (t === 0) return { q: a + " + " + b + " ni hisoblang.", a: rnd(a + b, 2) };
      if (t === 1) return { q: a + " · " + b + " ni hisoblang.", a: rnd(a * b, 2) };
      var c = R(2, 9); return { q: (a * c).toFixed(1) + " : " + c + " ni hisoblang.", a: rnd(a, 2) };
    },
    kophad: function () {
      var a = RNZ(-4, 5), b = RNZ(-6, 6), c = RNZ(-6, 6), x = RNZ(-4, 4), t = R(0, 2);
      function P(k, l, m) { return (k === 1 ? "" : k === -1 ? "−" : k) + "x²" + (l < 0 ? " − " + (-l) : " + " + l) + "x" + (m < 0 ? " − " + (-m) : " + " + m); }
      if (t === 0) return { q: "P(x) = " + P(a, b, c) + " bo'lsa, P(" + x + ") ni toping.", a: a * x * x + b * x + c };
      if (t === 1) { var p = RNZ(-5, 5), q = RNZ(-5, 5); return { q: "(x " + (p < 0 ? "− " + -p : "+ " + p) + ")(x " + (q < 0 ? "− " + -q : "+ " + q) + ") yoyilmasida x ning oldidagi koeffitsiyent nechaga teng?", a: p + q }; }
      return { q: "P(x) = " + P(a, b, c) + " ko'phadning erkin hadi nechaga teng?", a: c };
    },
    ildiz: function () {
      var t = R(0, 2);
      if (t === 0) { var n = pick([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]); return { q: "√" + n + " ni hisoblang.", a: Math.sqrt(n) }; }
      if (t === 1) { var m = pick([8, 27, 64, 125, 216, 343]); return { q: "∛" + m + " ni hisoblang.", a: Math.round(Math.cbrt(m)) }; }
      var a = pick([4, 9, 16, 25, 36]), k = pick([1, 2, 3]); return { q: a + "^(" + k + "/2) ni hisoblang.", a: Math.pow(Math.sqrt(a), k) };
    },
    koordinata: function () {
      var x1 = RNZ(-8, 8), y1 = RNZ(-8, 8), dx = pick([3, 4, 6, 8, 5, 12]), dy = pick([4, 3, 8, 6, 12, 5]);
      var x2 = x1 + dx, y2 = y1 + dy, t = R(0, 2);
      if (t === 0) return { q: "A(" + x1 + "; " + y1 + ") va B(" + x2 + "; " + y2 + ") nuqtalar orasidagi masofani toping.", a: rnd(Math.sqrt(dx * dx + dy * dy), 3) };
      if (t === 1) return { q: "A(" + x1 + "; " + y1 + ") va B(" + x2 + "; " + y2 + ") kesma o'rtasining abssissasini toping.", a: (x1 + x2) / 2 };
      return { q: "A(" + x1 + "; " + y1 + ") va B(" + x2 + "; " + y2 + ") orqali o'tuvchi to'g'ri chiziq burchak koeffitsiyentini toping.", a: rnd(dy / dx, 4) };
    },
    aylana: function () {
      var r = R(2, 12), t = R(0, 2);
      if (t === 0) return { q: "Radiusi " + r + " bo'lgan aylananing uzunligini toping (π ≈ 3,14).", a: rnd(2 * 3.14 * r, 2) };
      if (t === 1) return { q: "Radiusi " + r + " bo'lgan doiraning yuzini toping (π ≈ 3,14).", a: rnd(3.14 * r * r, 2) };
      var g = pick([30, 45, 60, 90, 120, 180]); return { q: "Radiusi " + r + ", markaziy burchagi " + g + "° bo'lgan yoy uzunligini toping (π ≈ 3,14).", a: rnd(2 * 3.14 * r * g / 360, 3) };
    },
    konus: function () {
      var a = RNZ(-6, 6), b = RNZ(-6, 6), r = R(2, 9), t = R(0, 2);
      if (t === 0) return { q: "(x " + (a > 0 ? "− " + a : "+ " + -a) + ")² + (y " + (b > 0 ? "− " + b : "+ " + -b) + ")² = " + (r * r) + " aylananing radiusini toping.", a: r };
      if (t === 1) return { q: "x² + y² " + (a < 0 ? "+ " + -2 * a : "− " + 2 * a) + "x = " + (r * r - a * a) + " aylana markazining abssissasini toping.", a: a };
      var p = R(1, 6); return { q: "y² = " + (4 * p) + "x parabolaning fokusi abssissasini toping.", a: p };
    },
    vektor: function () {
      var x1 = RNZ(-7, 7), y1 = RNZ(-7, 7), x2 = RNZ(-7, 7), y2 = RNZ(-7, 7), t = R(0, 2);
      if (t === 0) { var a = pick([3, 6, 4, 8, 5]), b = pick([4, 8, 3, 6, 12]); return { q: "a(" + a + "; " + b + ") vektorning uzunligini toping.", a: rnd(Math.sqrt(a * a + b * b), 3) }; }
      if (t === 1) return { q: "a(" + x1 + "; " + y1 + ") va b(" + x2 + "; " + y2 + ") vektorlarning skalyar ko'paytmasini toping.", a: x1 * x2 + y1 * y2 };
      return { q: "a(" + x1 + "; " + y1 + ") va b(" + x2 + "; " + y2 + ") bo'lsa, a + b vektorning abssissasini toping.", a: x1 + x2 };
    },
    kompleks: function () {
      var a = RNZ(-6, 6), b = RNZ(-6, 6), c = RNZ(-6, 6), d = RNZ(-6, 6), t = R(0, 2);
      function z(p, q) { return p + (q < 0 ? " − " + -q : " + " + q) + "i"; }
      if (t === 0) return { q: "z = " + z(a, b) + " kompleks sonning moduli |z| ni toping.", a: rnd(Math.sqrt(a * a + b * b), 3) };
      if (t === 1) return { q: "(" + z(a, b) + ") · (" + z(c, d) + ") ko'paytmaning haqiqiy qismini toping.", a: a * c - b * d };
      return { q: "(" + z(a, b) + ") · (" + z(c, d) + ") ko'paytmaning mavhum qismi koeffitsiyentini toping.", a: a * d + b * c };
    },
    oxshashlik: function () {
      var k = pick([2, 3, 4, 5]), a = R(3, 12), t = R(0, 2);
      if (t === 0) return { q: "Ikki o'xshash uchburchakning o'xshashlik koeffitsiyenti " + k + ". Kichigining tomoni " + a + " bo'lsa, kattasining mos tomonini toping.", a: a * k };
      if (t === 1) return { q: "O'xshashlik koeffitsiyenti " + k + " bo'lsa, yuzalar nisbati nechaga teng?", a: k * k };
      var S = R(4, 20); return { q: "Kichik uchburchak yuzi " + S + ", o'xshashlik koeffitsiyenti " + k + ". Katta uchburchak yuzini toping.", a: S * k * k };
    },
    limit: function () {
      var a = RNZ(-5, 5), b = RNZ(-6, 6), t = R(0, 2);
      if (t === 0) return { q: "lim(x→" + a + ") (x² " + (b < 0 ? "− " + -b : "+ " + b) + "x) limitni hisoblang.", a: a * a + b * a };
      if (t === 1) { var c = RNZ(-6, 6); return { q: "lim(x→" + c + ") (x² − " + (c * c) + ")/(x − " + c + ") limitni hisoblang.", a: 2 * c }; }
      var p = RNZ(2, 7), q = RNZ(2, 7); return { q: "lim(x→∞) (" + p + "x² + 3x)/(" + q + "x² − 1) limitni hisoblang.", a: rnd(p / q, 4) };
    },
    algebraAsos: function () {
      var a = RNZ(-6, 6), b = RNZ(-9, 9), x = RNZ(-6, 6), t = R(0, 2);
      if (t === 0) return { q: "x = " + x + " bo'lsa, " + a + "x " + (b < 0 ? "− " + -b : "+ " + b) + " ifodaning qiymatini toping.", a: a * x + b };
      if (t === 1) { var c = RNZ(-5, 5); return { q: a + "x " + (b < 0 ? "− " + -b : "+ " + b) + " " + (c < 0 ? "− " + -c : "+ " + c) + "x ifodani soddalashtirgandagi x oldidagi koeffitsiyent?", a: a + c }; }
      return { q: "x = " + x + " bo'lsa, |" + a + "x " + (b < 0 ? "− " + -b : "+ " + b) + "| ifodaning qiymatini toping.", a: Math.abs(a * x + b) };
    },
    tartib: function () {
      var a = R(1, 9), d = RNZ(2, 7), n = R(5, 15), t = R(0, 1);
      if (t === 0) return { q: "a₁ = " + a + ", d = " + d + " bo'lgan arifmetik progressiyaning " + n + "-hadini toping.", a: a + (n - 1) * d };
      return { q: "a₁ = " + a + ", d = " + d + " bo'lgan arifmetik progressiyaning dastlabki " + n + " ta hadi yig'indisini toping.", a: n * (2 * a + (n - 1) * d) / 2 };
    }
  };

  /* ===================== Kurslar va mavzular ===================== */
  var KURS = [
    { t: "Boshlang'ich matematika", i: "🧮", c: "#f59e0b", d: "Sanashdan 1000 ichida hisoblashgacha", u: [
      ["Sanash", ["sanash"]], ["Qo'shish va ayirish bilan tanishuv", ["add", "sub"]], ["Sonlar xonasi (o'nliklar va yuzliklar)", ["numbers", "add"]],
      ["20 gacha bo'lgan sonlarni qo'shish va ayirish", ["add", "sub"]], ["100 ichida qo'shish va ayirish", ["add", "sub"]],
      ["1 000 ichida sonlarni qo'shish va ayirish", ["add", "sub"]], ["O'lchovlar va ma'lumotlar", ["olchov", "means"]], ["Geometriya", ["area"]] ] },
    { t: "Arifmetika", i: "➗", c: "#10b981", d: "To'rt amal, kasrlar va manfiy sonlar", u: [
      ["Qo'shish va ayirish", ["add", "sub"]], ["Ko'paytirish va bo'lish", ["mul", "div"]], ["Manfiy sonlar", ["add", "sub", "mul"]],
      ["Kasrlar", ["kasr"]], ["O'nli kasrlar", ["onli"]] ] },
    { t: "Boshlang'ich algebra", i: "📐", c: "#06b6d4", d: "Nisbat, foiz, ifoda va tengsizliklar", u: [
      ["Arifmetik xossalar", ["add", "mul"]], ["Bo'luvchilar va karralilar", ["gcdlcm"]], ["Ma'lumotni o'qish va uni talqin qilish", ["means"]],
      ["O'lchovlar", ["olchov"]], ["Kasrlar", ["kasr"]], ["O'nli kasrlar", ["onli"]], ["Manfiy sonlar va koordinatalar tekisligi", ["koordinata"]],
      ["Nisbat, sur'at va proporsiya", ["percent"]], ["Ifoda, tenglama va tengsizliklar", ["linEq", "algebraAsos"]], ["Daraja, ildiz va sonning standart shakli", ["power", "ildiz"]] ] },
    { t: "Algebra I", i: "🔢", c: "#7c9bff", d: "Tenglama, funksiya va kvadrat tenglamalar", u: [
      ["Algebra asoslari", ["algebraAsos"]], ["Tenglamalarni yechish", ["linEq"]], ["Tengsizliklarni yechish", ["quadIneq", "ineqSystem"]],
      ["O'lchov birliklari bilan ishlash", ["olchov"]], ["Chiziqli tenglamalar va grafiklar", ["linEq", "koordinata"]], ["Funksiyalar", ["fvalue", "zeros"]],
      ["Chiziqli funksiyaga oid matnli masalalar", ["linearModel"]], ["Sonli ketma-ketliklar", ["tartib", "progression"]], ["Tenglamalar sistemasi", ["system"]],
      ["Tengsizliklar (sistemalar va grafiklar)", ["ineqSystem"]], ["Absolyut qiymat va bo'lakli funksiyalar", ["modulus"]],
      ["Ratsional ko'rsatkichlar va ildizlar", ["ildiz", "power"]], ["Eksponensial o'sish va kamayish", ["expEq", "power"]],
      ["Ko'phadlar", ["kophad", "shortMul"]], ["Chiziqli funksiyalar ko'paytmasiga yoyish", ["factor"]], ["Kvadrat tenglamalar", ["quadEq", "vieta"]], ["Irratsional sonlar", ["irrational", "ildiz"]] ] },
    { t: "Algebra II", i: "📈", c: "#a78bfa", d: "Logarifm, kompleks sonlar, progressiyalar", u: [
      ["Funksiyalar", ["fvalue", "zeros"]], ["Kompleks sonlar", ["kompleks"]], ["Ko'phadlar ustida arifmetik amallar", ["kophad"]],
      ["Ko'phadlar", ["kophad", "bezu"]], ["Irratsional munosabatlar", ["irrational"]], ["Ratsional munosabatlar", ["ratEq", "ratIneq"]],
      ["Eksponensial o'sish va kamayish", ["expEq"]], ["Ko'rsatkichli funksiyalar va logarifmlar", ["log", "expEq"]], ["Trigonometriya", ["trig"]],
      ["Murakkab tenglamalar va funksiyalar", ["quadEq", "ratEq", "modulus"]], ["Progressiyalar", ["progression", "tartib"]],
      ["Modellashtirish", ["linearModel"]], ["Konus kesimlari", ["konus"]] ] },
    { t: "Geometriya asoslari", i: "📏", c: "#34d399", d: "Burchak, yuza, hajm va Pifagor teoremasi", u: [
      ["To'g'ri chiziqlar", ["koordinata"]], ["Burchaklar", ["trig"]], ["Shakllar", ["area"]], ["Koordinatalar tekisligi", ["koordinata"]],
      ["Yuza va perimetr", ["area"]], ["Hajm va sirt yuzi", ["stereo"]], ["Pifagor teoremasi", ["pythag"]], ["Geometrik almashtirishlar, tenglik va o'xshashlik", ["oxshashlik"]] ] },
    { t: "Geometriya", i: "🔺", c: "#22d3ee", d: "O'xshashlik, trigonometriya, stereometriya", u: [
      ["Almashtirishlarni qo'llash", ["shift"]], ["Almashtirish xossalari", ["shift", "oxshashlik"]], ["Tenglik", ["oxshashlik", "area"]],
      ["O'xshashlik", ["oxshashlik"]], ["To'g'ri burchakli uchburchaklar & trigonometriya", ["pythag", "trig"]],
      ["To'g'ri burchakli bo'lmagan uchburchaklar & trigonometriya", ["trig", "area"]], ["Analitik geometriya", ["koordinata"]],
      ["Konus kesimlari", ["konus"]], ["Aylana", ["aylana"]], ["Stereometriya", ["stereo"]] ] },
    { t: "Trigonometriya", i: "📡", c: "#f472b6", d: "Birlik aylana, grafiklar, ayniyatlar", u: [
      ["To'g'ri burchakli uchburchaklar trigonometriyasi", ["pythag", "trig"]], ["Ixtiyoriy uchburchaklar uchun trigonometriya", ["trig", "area"]],
      ["Birlik aylanada sinus, kosinus va tangenslarning ta'rifi", ["trig"]], ["Trigonometrik funksiyalarning grafiklari", ["trig", "shift"]],
      ["Trigonometrik tenglamalar va ayniyatlar", ["trig"]] ] },
    { t: "Matematik analiz asoslari", i: "∫", c: "#fb923c", d: "Vektor, matritsa, ehtimollik", u: [
      ["Trigonometriya", ["trig"]], ["Konus kesimlari", ["konus"]], ["Vektorlar", ["vektor"]], ["Matritsalar", ["det", "system"]],
      ["Kompleks sonlar", ["kompleks"]], ["Ehtimollik va kombinatorikalar", ["comb"]], ["Progressiyalar", ["progression", "tartib"]] ] },
    { t: "Chiziqli algebra", i: "⬛", c: "#94a3b8", d: "Vektor fazolari va matritsa almashtirishlari", u: [
      ["Vektorlar va fazo", ["vektor"]], ["Matritsa almashtirishlari", ["det"]], ["Muqobil koordinata sistemalari (asoslar)", ["vektor", "koordinata"]] ] },
    { t: "Oliy matematika", i: "🎓", c: "#e879f9", d: "Limit, hosila va integral", u: [
      ["Limitlar", ["limit"]], ["Hosila", ["derivative"]], ["Integral", ["integral"]], ["Funksiyani tekshirish", ["derivative", "zeros"]] ] }
  ];

  function slug(s) {
    return s.toLowerCase().replace(/[ʻʼ‘’'`]/g, "").replace(/[^a-z0-9а-яoʻ]+/gi, "-")
      .replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 32);
  }
  KURS.forEach(function (k, ki) {
    k.id = "k" + (ki + 1);
    k.u = k.u.map(function (u, ui) { return { id: "np-" + (ki + 1) + "-" + slug(u[0]) + "-" + (ui + 1), t: u[0], g: u[1] }; });
  });
  window.kaNPdata = KURS;

  /* ===================== Savollar ===================== */
  function gensOf(u) {
    var K = window.kaGen, out = [];
    (u.g || []).forEach(function (n) {
      if (XG[n]) out.push(XG[n]);
      else if (K && K.generators[n]) out.push(K.generators[n]);
    });
    if (!out.length && K) { var g = K.gensFor(u.t); if (g) g.forEach(function (n) { if (K.generators[n]) out.push(K.generators[n]); }); }
    if (!out.length) out.push(XG.algebraAsos);
    return out;
  }
  function fmtA(p) {
    if (p.fmt) return p.fmt;
    var a = p.a;
    if (Array.isArray(a)) return a.join("; ");
    if (typeof a === "number" && !Number.isInteger(a)) return String(rnd(a, 4)).replace(".", ",");
    return String(a);
  }
  function wrongs(p, n) {
    var right = fmtA(p), key = {}, out = []; key[right] = 1;
    function add(v) { var s = (typeof v === "number" && !Number.isInteger(v)) ? String(rnd(v, 4)).replace(".", ",") : (Array.isArray(v) ? v.join("; ") : String(v)); if (!key[s] && s !== "NaN") { key[s] = 1; out.push(s); } }
    var a = p.a, tries = 0;
    if (p.nd) {
      var N = p.nd[0], D = p.nd[1], t2 = 0;
      while (out.length < n && t2++ < 60) {
        var v2 = pick([[N + D, D], [N - D, D], [D, N], [N, D + 1], [N + 1, D], [-N, D], [N * 2, D], [N, D * 2]]);
        if (v2[1]) add(fr(v2[0], v2[1]));
      }
      while (out.length < n) add(fr(N + out.length + 3, D));
      return out.slice(0, n);
    }
    while (out.length < n && tries++ < 80) {
      if (Array.isArray(a)) { var b = a.slice(), k = R(0, 3); if (k === 0) b = b.map(function (x) { return -x; }); else if (k === 1) b[R(0, b.length - 1)] += RNZ(-3, 3); else if (k === 2 && b.length === 2) b = [b[1], b[0]]; else b = b.map(function (x) { return x + 1; }); add(b); }
      else { var d = pick([1, -1, 2, -2, 3, 10, -10]); var v = R(0, 3) === 0 ? -a : (R(0, 3) === 1 ? a * 2 : a + d); add(v); }
    }
    while (out.length < n) add(Array.isArray(a) ? a.map(function (x) { return x + out.length + 7; }) : a + out.length * 7 + 3);
    return out.slice(0, n);
  }
  function genQ(u) {
    var g = pick(gensOf(u)), p;
    try { p = g(); } catch (e) { p = XG.algebraAsos(); }
    var right = fmtA(p);
    var opts = shuffle([right].concat(wrongs(p, 3)));
    return { q: String(p.q).replace(/<[^>]+>/g, ""), options: opts, correct: opts.indexOf(right), steps: p.steps || null, src: "gen" };
  }
  // Google Sheets (savol-bazasi.js orqali) — mavzu_id ustunida mavzu id'si bo'lsa, shu savollar birinchi bo'ladi
  function sheetQ(u, n) {
    try {
      if (!window.kaBank || !window.kaBank.get) return [];
      var r = window.kaBank.get(u.id, n, { allowSeen: false }) || [];
      return r.filter(function (q) { return q.src === "sheet"; });
    } catch (e) { return []; }
  }
  function makeTest(u, n) {
    var out = sheetQ(u, n).slice(0, n), seen = {};
    out.forEach(function (q) { seen[q.q] = 1; });
    var guard = 0;
    while (out.length < n && guard++ < n * 25) { var q = genQ(u); if (!seen[q.q]) { seen[q.q] = 1; out.push(q); } }
    return shuffle(out).slice(0, n);
  }

  /* ===================== Natijalar (localStorage) ===================== */
  var LS = "ka.np.progress.v1";
  function prog() { try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch (e) { return {}; } }
  function saveProg(p) { try { localStorage.setItem(LS, JSON.stringify(p)); } catch (e) {} }
  function unitProg(id) { return prog()[id] || { best: 0, done: 0, xp: 0 }; }
  function record(id, pct, right) {
    var p = prog(), c = p[id] || { best: 0, done: 0, xp: 0 };
    c.best = Math.max(c.best, pct); c.done++; c.xp += right * 2; p[id] = c; saveProg(p);
  }
  function totalXP() { var p = prog(), s = 0; Object.keys(p).forEach(function (k) { s += p[k].xp || 0; }); return s; }
  function courseAvg(k) {
    var s = 0; k.u.forEach(function (u) { s += unitProg(u.id).best; });
    return Math.round(s / k.u.length);
  }
  window.kaNP = { data: KURS, makeTest: makeTest, unitProg: unitProg, totalXP: totalXP, record: record, courseAvg: courseAvg, genQ: genQ };
})();
