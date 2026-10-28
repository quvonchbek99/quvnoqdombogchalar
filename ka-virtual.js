/*!
 * Kuvonch Academy — VIRTUAL o'yinlar (kamera + qo'l kuzatuvi)
 * 67 ta o'yin (47 matematik + poyga + grafik doskasi + 10 ta fizika + 4 ta yugurish + 4 ta mavzuli poyga — ka-yugurish.js). Kamera bir nechta qo'lni (1–4) bir vaqtda sezadi.
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

  /* ======================= SAVOL MAVZULARI (v2 — 5 daraja) ======================= */
  // q(l, boss) -> {q: savol, a: javob, w: [tipik xatolardan tuzilgan variantlar], e: qadamma-qadam yechim}
  // l = 1…5 — daraja (o'yin davomida o'quvchining javoblariga qarab o'zgaradi).
  // Savolda "?" bo'lsa — aynan o'sha joy so'ralyapti; bo'lmasa ekranda oxiriga " = ?" qo'shiladi.
  // g — mavzu odatda o'tiladigan sinf (sinf tanlanganda boshlang'ich daraja shundan hisoblanadi).
  function lv(l) { return Math.max(1, Math.min(5, l | 0 || 2)); }
  function typ(l, tbl) { return pick(tbl[lv(l)]); }
  function dec(x, d) { var p = Math.pow(10, d == null ? 2 : d); return mstr(Math.round(x * p) / p).replace(".", ","); }
  function Qz(q, a, w, e, keepNeg) {
    var seen = {}, out = [], num = typeof a === "number", A = num ? a : 0, intA = num && a === Math.round(a);
    seen[String(a)] = 1;
    (w || []).forEach(function (v) {
      if (v == null || v === "") return;
      if (typeof v === "number") {
        if (!isFinite(v)) return;
        if (num && A >= 0 && v < 0 && !keepNeg) return;  // musbat javobga manfiy variant — juda oson (manfiy sonlar mavzusidan tashqari)
        if (intA && v !== Math.round(v)) return;          // butun javobga kasr variant — juda oson
        v = Math.round(v * 1000) / 1000;
      }
      var k = String(v); if (!seen[k]) { seen[k] = 1; out.push(v); }
    });
    return { q: q, a: a, w: out, e: e };
  }
  var ISM = ["Ali", "Vali", "Zuhra", "Madina", "Sardor", "Nodira", "Jasur", "Malika", "Bobur", "Dilnoza", "Aziz", "Lola", "Sanjar", "Shahzoda"];
  function ism2() { var a = pick(ISM), b = pick(ISM); while (b === a) b = pick(ISM); return [a, b]; }
  var NARSA = ["olma", "yong'oq", "daftar", "qalam", "tanga", "kitob", "marka", "sharcha"];
  function swapD(n) { var s = String(Math.abs(n)); if (s.length < 2 || s[s.length - 1] === s[s.length - 2]) return null; return +(s.slice(0, -2) + s[s.length - 1] + s[s.length - 2]); }
  function fstr(n) { var out = [], p = 2; while (n > 1 && p * p <= n) { var k = 0; while (n % p === 0) { n /= p; k++; } if (k) out.push(p + (k > 1 ? sup(k) : "")); p++; } if (n > 1) out.push(String(n)); return out.join("·") || "1"; }
  function fr(a, b) { if (b < 0) { a = -a; b = -b; } var g = gcd(a, b) || 1; a /= g; b /= g; return b === 1 ? mstr(a) : mstr(a) + "/" + b; }
  function sumAll(a) { return a.reduce(function (s, x) { return s + x; }, 0); }

  var TOPICS = {
    /* ---------------- Qo'shish ---------------- */
    qoshish: { n: "Qo'shish", g: 1, q: function (l) {
      l = lv(l); var a, b, c, t = typ(l, { 1: ["d", "d", "m"], 2: ["d", "d", "m", "s"], 3: ["d", "m", "s", "d"], 4: ["d", "m", "s", "3"], 5: ["d", "s", "3", "m"] });
      if (l === 1) { a = R(1, 10); b = R(1, 10); }
      else if (l === 2) { a = R(11, 89); b = a % 10 ? R(10 - a % 10, 9) : R(1, 9); }
      else if (l === 3) { a = R(12, 89); b = R(12, 89); }
      else if (l === 4) { a = R(105, 899); b = R(16, 399); }
      else { a = R(1050, 8900); b = R(105, 999); }
      var s = a + b, carry = (a % 10) + (b % 10) >= 10;
      var w = [carry ? s - 10 : s + 10, s + 1, s - 1, swapD(s), s + 10, s - 100, Math.abs(a - b)];
      if (t === "3") {
        if (l >= 5) { var k = pick([25, 50, 75, 125, 250]); a = R(11, 99); b = (k === 25 ? 75 : k === 75 ? 25 : k === 125 ? 875 : k === 250 ? 750 : 50); c = R(13, 97); return Qz(k + " + " + c + " + " + b, k + b + c, [k + b + c - 10, k + b + c + 10, k + b + c + 1, k + c], k + " + " + b + " = " + (k + b) + " (avval yaxlit juftlik) → " + (k + b) + " + " + c + " = " + (k + b + c)); }
        c = R(11, 89); var s3 = a + b + c; return Qz(a + " + " + b + " + " + c, s3, [s3 - 10, s3 + 10, s3 + 1, s3 - 1, a + b], a + " + " + b + " = " + (a + b) + " → " + (a + b) + " + " + c + " = " + s3);
      }
      if (t === "m") { if (R(0, 1)) return Qz(a + " + ? = " + s, b, [s + a, b + 1, b - 1, b + 10, b - 10, a], "? = " + s + " − " + a + " = " + b + "   (tekshiruv: " + a + " + " + b + " = " + s + ")"); return Qz("? + " + b + " = " + s, a, [s + b, a + 1, a - 1, a + 10, a - 10, b], "? = " + s + " − " + b + " = " + a); }
      if (t === "s") {
        var n = ism2(), o = pick(NARSA);
        var tx = pick([n[0] + " " + a + " ta, " + n[1] + " " + b + " ta " + o + " yig'di. Jami nechta?", "Kutubxonada " + a + " ta kitob bor edi, yana " + b + " ta keltirildi. Endi nechta?", "Avtobusda " + a + " kishi bor edi, bekatda yana " + b + " kishi mindi. Endi nechta?"]);
        return Qz(tx, s, w, "Jami = " + a + " + " + b + " = " + s);
      }
      return Qz(a + " + " + b, s, w, a >= 10 && b >= 10 ? a + " + " + b + " = " + (a - a % 10) + " + " + (b - b % 10) + " + " + (a % 10) + " + " + (b % 10) + " = " + s : a + " + " + b + " = " + s + (carry ? "   (birliklar " + (a % 10) + " + " + (b % 10) + " = " + ((a % 10) + (b % 10)) + " → 1 o'nlik o'tadi)" : ""));
    } },
    qoshish2: { n: "Ikki xonali qo'shish", g: 2, q: function (l) {
      l = lv(l); var a, b, c, t = typ(l, { 1: ["d"], 2: ["d", "d", "m"], 3: ["d", "m", "s"], 4: ["3", "d", "m"], 5: ["d", "3", "s", "m"] });
      a = R(10, 89); b = R(10, 89);
      if (l === 1) { a = R(1, 7) * 10 + R(0, 4); b = R(1, 8 - Math.floor(a / 10)) * 10 + R(0, 4); }
      if (l === 2) { a = R(13, 69) ; if (a % 10 < 3) a += 3; b = R(1, 2) * 10 + R(10 - a % 10, 9); }
      if (l >= 5) { a = R(105, 899); b = R(16, 99); }
      var s = a + b;
      if (t === "3") { c = R(10, 49); var s3 = s + c; return Qz(a + " + " + b + " + " + c, s3, [s3 - 10, s3 + 10, s3 + 1, s3 - 1], a + " + " + b + " = " + s + " → " + s + " + " + c + " = " + s3); }
      if (t === "m") return Qz(a + " + ? = " + s, b, [b + 10, b - 10, b + 1, b - 1, s + a], "? = " + s + " − " + a + " = " + b);
      if (t === "s") { var n = ism2(); return Qz(n[0] + " " + a + " ta, " + n[1] + " " + b + " ta marka yig'di. Jami nechta?", s, [s - 10, s + 10, s + 1, s - 1], a + " + " + b + " = " + s); }
      return Qz(a + " + " + b, s, [s - 10, s + 10, s + 1, s - 1, swapD(s)], a + " + " + b + " = " + (a - a % 10) + " + " + (b - b % 10) + " + " + (a % 10) + " + " + (b % 10) + " = " + s);
    } },
    /* ---------------- Ayirish ---------------- */
    ayirish: { n: "Ayirish", g: 1, q: function (l) {
      l = lv(l); var a, b, t = typ(l, { 1: ["d", "d", "m"], 2: ["d", "d", "m", "s"], 3: ["d", "m", "s"], 4: ["d", "m", "s", "m2"], 5: ["d", "s", "m2", "m"] });
      if (l === 1) { a = R(5, 20); b = R(1, Math.min(10, a)); }
      else if (l === 2) { a = R(21, 99); if (a % 10 > 7) a -= 3; b = R((a % 10) + 1, 9); }
      else if (l === 3) { a = R(40, 99); b = R(12, a - 5); }
      else if (l === 4) { a = R(300, 999); b = R(105, a - 50); }
      else { a = R(2000, 9999); b = R(1005, a - 100); }
      var d = a - b, bor = (a % 10) < (b % 10);
      var naive = +String(a).split("").reverse().map(function (x, i) { var y = +(String(b).split("").reverse()[i] || 0); return Math.abs(+x - y); }).reverse().join("");
      var w = [bor ? naive : d + 10, d + 10, d - 10, d + 1, d - 1, a + b > 9999 ? null : a + b];
      if (t === "m") return Qz(a + " − ? = " + d, b, [a + d, b + 1, b - 1, b + 10, d], "? = " + a + " − " + d + " = " + b + "   (tekshiruv: " + a + " − " + b + " = " + d + ")");
      if (t === "m2") return Qz("? − " + b + " = " + d, a, [d - b < 0 ? d + 10 : d - b, a + 10, a - 10, a + 1], "? = " + d + " + " + b + " = " + a + "   (kamayuvchi = ayirma + ayriluvchi)");
      if (t === "s") { var n = ism2(), o = pick(NARSA); var tx = pick([n[0] + "da " + a + " ta " + o + " bor edi, " + b + " tasini " + n[1] + "ga berdi. Nechta qoldi?", "Do'konda " + a + " kg un bor edi, " + b + " kg sotildi. Necha kg qoldi?", n[0] + " " + a + " ta, " + n[1] + " " + b + " ta " + o + " yig'di. Farqi nechta?"]); return Qz(tx, d, w, a + " − " + b + " = " + d); }
      return Qz(a + " − " + b, d, w, a + " − " + b + " = " + d + (bor ? "   (birliklar yetmaydi → 1 o'nlik olinadi)" : "") + "   tekshiruv: " + d + " + " + b + " = " + a);
    } },
    /* ---------------- Ko'paytirish ---------------- */
    kopaytirish: { n: "Ko'paytirish", g: 2, q: function (l) {
      l = lv(l); var a, b, t = typ(l, { 1: ["d", "d", "m"], 2: ["d", "d", "m", "s"], 3: ["d", "m", "s", "t"], 4: ["d", "m", "s", "t"], 5: ["d", "t", "s", "m"] });
      if (l === 1) { a = R(2, 5); b = R(1, 10); }
      else if (l === 2) { a = R(3, 9); b = R(3, 9); }
      else if (l === 3) { a = R(12, 19); b = R(3, 9); }
      else if (l === 4) { a = R(21, 69); b = R(3, 9); if (R(0, 2) === 0) { a = pick([12, 15, 25, 11, 14]); b = R(11, 16); } }
      else { a = R(101, 499); b = R(3, 9); if (R(0, 1)) { a = R(21, 49); b = R(21, 39); } }
      var p = a * b;
      var w = [a * (b + 1), a * (b - 1), (a + 1) * b, a + b, p + 10, p - 10, swapD(p)];
      if (t === "t") { var k = pick([99, 101, 49, 51, 19, 21]), m = R(3, 9), r = k * m, base = k > 90 ? 100 : k > 40 ? 50 : 20; return Qz(k + " × " + m, r, [base * m, r + m, r - m, r + 10], k + " × " + m + " = " + base + "·" + m + (k > base ? " + " : " − ") + Math.abs(k - base) + "·" + m + " = " + (base * m) + (k > base ? " + " : " − ") + Math.abs(k - base) * m + " = " + r); }
      if (t === "m") { if (R(0, 1)) return Qz(a + " × ? = " + p, b, [b + 1, b - 1, p - a, p / 2, b + 2], "? = " + p + " : " + a + " = " + b); return Qz("? × " + b + " = " + p, a, [a + 1, a - 1, p - b, a + 10], "? = " + p + " : " + b + " = " + a); }
      if (t === "s") { var o = pick(NARSA); var tx = pick([b + " ta qutining har birida " + a + " ta " + o + ". Jami nechta?", "Zalda " + a + " qator, har qatorda " + b + " ta stul. Jami?", "Bir daftar " + a + " ming so'm. " + b + " ta daftar necha ming so'm?"]); return Qz(tx, p, w, a + " × " + b + " = " + p); }
      return Qz(a + " × " + b, p, w, a >= 10 ? a + " × " + b + " = " + (a - a % 10) + "·" + b + " + " + (a % 10) + "·" + b + " = " + ((a - a % 10) * b) + " + " + ((a % 10) * b) + " = " + p : a + " × " + b + " = " + p + "   (" + Array(Math.min(a, b) + 1).join(Math.max(a, b) + " + ").slice(0, -3) + ")");
    } },
    /* ---------------- Bo'lish ---------------- */
    bolish: { n: "Bo'lish", g: 3, q: function (l) {
      l = lv(l); var b, c, a, t = typ(l, { 1: ["d", "d", "m"], 2: ["d", "m", "s"], 3: ["d", "m", "s"], 4: ["d", "q", "s"], 5: ["d", "q", "s", "m"] });
      if (l === 1) { b = R(2, 5); c = R(1, 10); }
      else if (l === 2) { b = R(3, 9); c = R(3, 9); }
      else if (l === 3) { b = R(2, 9); c = R(11, 25); }
      else if (l === 4) { b = R(3, 9); c = R(21, 120); }
      else { b = R(11, 25); c = R(4, 19); }
      a = b * c;
      var w = [c + 1, c - 1, a - b, c * 10, c + 10, Math.floor(a / (b + 1))];
      if (t === "q") { var r = R(1, b - 1), N = a + r; return Qz(N + " : " + b + " — qoldiq?", r, [r + 1, r - 1, c, b - r, 0], N + " = " + b + "·" + c + " + " + r + "  → qoldiq " + r + " (qoldiq bo'luvchidan kichik: " + r + " < " + b + ")"); }
      if (t === "m") return Qz("? : " + b + " = " + c, a, [a + b, a - b, c + b, b * (c + 1)], "? = " + c + " × " + b + " = " + a + "   (bo'linuvchi = bo'linma × bo'luvchi)");
      if (t === "s") { var n = ism2(), o = pick(NARSA); var tx = pick([a + " ta " + o + " " + b + " bolaga teng bo'lindi. Har biriga nechta?", a + " ta o'quvchi " + b + " tadan guruhlarga bo'lindi. Nechta guruh?", n[0] + " " + a + " ming so'mga " + b + " ta bir xil daftar oldi. Bittasi necha ming?"]); return Qz(tx, c, w, a + " : " + b + " = " + c + "   (tekshiruv: " + c + " × " + b + " = " + a + ")"); }
      return Qz(a + " : " + b, c, w, a + " : " + b + " = " + c + ",  chunki " + b + " × " + c + " = " + a);
    } },
    /* ---------------- Aralash (amallar tartibi) ---------------- */
    aralash: { n: "Aralash misollar", g: 3, q: function (l) {
      l = lv(l);
      if (l <= 2 || R(0, 3) === 0) return TOPICS[pick(["qoshish", "ayirish", "kopaytirish", "bolish"])].q(Math.min(l, 3));
      var a = R(2, 9), b = R(2, 9), c = R(2, 9), d, v, lr, tx, e;
      if (l === 3) {
        if (R(0, 1)) { v = a + b * c; lr = (a + b) * c; tx = a + " + " + b + " × " + c; e = "Avval ko'paytirish: " + b + "×" + c + " = " + (b * c) + " → " + a + " + " + (b * c) + " = " + v; }
        else { var x = b * c + R(1, 9); v = x - b * c; lr = (x - b) * c; tx = x + " − " + b + " × " + c; e = "Avval ko'paytirish: " + b + "×" + c + " = " + (b * c) + " → " + x + " − " + (b * c) + " = " + v; }
        return Qz(tx, v, [lr, v + 1, v - 1, v + 10], e + "   (chapdan o'ngga hisoblasa " + lr + " chiqadi — xato!)");
      }
      if (l === 4) {
        if (R(0, 1)) { v = (a + b) * c; lr = a + b * c; return Qz("(" + a + " + " + b + ") × " + c, v, [lr, v + c, v - c, (a + b) + c], "Avval qavs: " + a + " + " + b + " = " + (a + b) + " → " + (a + b) + " × " + c + " = " + v); }
        var s2 = R(2, 6), u = R(2, 6), q2 = (s2 + u) * R(2, 9); v = q2 / (s2 + u); return Qz(q2 + " : (" + s2 + " + " + u + ")", v, [q2 / s2 + u, v + 1, v - 1, q2 - s2 - u], "Avval qavs: " + s2 + " + " + u + " = " + (s2 + u) + " → " + q2 + " : " + (s2 + u) + " = " + v);
      }
      var m1 = R(2, 9), k1 = m1 * R(2, 9), m2 = R(2, 9), m3 = R(2, 9), sub = R(1, 9);
      v = k1 / m1 + m2 * m3 - sub;
      return Qz(k1 + " : " + m1 + " + " + m2 + " × " + m3 + " − " + sub, v, [(k1 / m1 + m2) * m3 - sub, v + 2, v - 2, v + 10, k1 / m1 + m2 * (m3 - sub)], k1 + " : " + m1 + " = " + (k1 / m1) + ",  " + m2 + " × " + m3 + " = " + (m2 * m3) + " → " + (k1 / m1) + " + " + (m2 * m3) + " − " + sub + " = " + v);
    } },
    /* ---------------- Kvadratlar ---------------- */
    kvadrat: { n: "Kvadratlar", g: 5, q: function (l) {
      l = lv(l); var n, v, t = typ(l, { 1: ["d", "d", "r"], 2: ["d", "d", "r"], 3: ["d", "r", "d"], 4: ["5", "near", "r"], 5: ["dif", "near", "5", "r"] });
      if (t === "5") { n = pick([15, 25, 35, 45, 55, 65, 75, 85, 95]); var k = (n - 5) / 10; v = n * n; return Qz(n + sup(2), v, [k * (k + 1) * 10 + 25, k * k * 100 + 25, v + 100, v - 100, n * 2], n + sup(2) + ": " + k + "·" + (k + 1) + " = " + (k * (k + 1)) + " va oxiriga 25 → " + v); }
      if (t === "near") { var T0 = R(2, 9) * 10, s = pick([1, -1]); n = T0 + s; v = n * n; return Qz(n + sup(2), v, [T0 * T0 + 1, T0 * T0 - 1, v + 2 * T0, v - 2, n * 2], n + sup(2) + " = " + T0 + sup(2) + (s > 0 ? " + " : " − ") + "2·" + T0 + " + 1 = " + (T0 * T0) + (s > 0 ? " + " : " − ") + (2 * T0) + " + 1 = " + v); }
      if (t === "dif") { var A = R(31, 69), B = A - 2 * R(2, 6); v = A * A - B * B; return Qz(A + sup(2) + " − " + B + sup(2), v, [(A - B) * (A - B), v + 10, (A - B) * 2, v - (A - B)], "a² − b² = (a − b)(a + b) = " + (A - B) + " · " + (A + B) + " = " + v); }
      n = l === 1 ? R(2, 10) : l === 2 ? R(11, 15) : l === 3 ? pick([R(16, 25), R(16, 25), R(2, 9) * 10]) : R(11, 25);
      v = n * n;
      if (t === "r") return Qz("?" + sup(2) + " = " + v, n, [v / 2, n + 1, n - 1, n * 2], "√" + v + " = " + n + ",  chunki " + n + " × " + n + " = " + v);
      return Qz(n + sup(2), v, [n * 2, (n + 1) * (n + 1), (n - 1) * (n - 1), v + n, v - 10, v + 10], n + sup(2) + " = " + n + " × " + n + " = " + v + "   (" + n + "·2 = " + (2 * n) + " emas!)");
    } },
    /* ---------------- Kvadrat ildiz ---------------- */
    ildiz: { n: "Kvadrat ildiz", g: 8, q: function (l) {
      l = lv(l); var n, t = typ(l, { 1: ["d"], 2: ["d", "d", "mul"], 3: ["mul", "d", "dec"], 4: ["dec", "mul", "near"], 5: ["near", "dec", "frac", "mul"] });
      if (t === "dec") { n = R(2, 19); if (n === 10) n = 12; var x = n * n / 100, s = dec(n / 10, 1); return Qz("√" + dec(x, 2), s, [dec(n / 100, 2), dec(n, 0), dec(n / 10 + 0.1, 1), dec(x / 2, 2)], "√" + dec(x, 2) + " = " + s + ",  chunki " + s + "² = " + dec(x, 2)); }
      if (t === "frac") { var p = R(1, 9), q = R(p + 1, 12); while (gcd(p, q) !== 1) q = R(p + 1, 12); return Qz("√(" + (p * p) + "/" + (q * q) + ")", p + "/" + q, [(p * p) + "/" + q, p + "/" + (q * q), (q) + "/" + p, (2 * p) + "/" + (2 * q + 1)], "√(" + (p * p) + "/" + (q * q) + ") = √" + (p * p) + " / √" + (q * q) + " = " + p + "/" + q); }
      if (t === "mul") { var a = R(2, 9), b = R(2, 7); while (b === a) b = R(2, 7); return Qz("√(" + (a * a) + " · " + (b * b) + ")", a * b, [a * a + b * b, a + b, a * b * 2, a * b + 1], "√(" + (a * a) + "·" + (b * b) + ") = √" + (a * a) + " · √" + (b * b) + " = " + a + " · " + b + " = " + (a * b)); }
      if (t === "near") { n = R(3, 14); var m = n * n + pick([-3, -2, -1, 1, 2, 3, 4]); var r = Math.round(Math.sqrt(m)); return Qz("√" + m + " qaysi butun songa eng yaqin?", r, [r + 1, r - 1, Math.round(m / 2), m - r * r === 0 ? null : r + 2], (r * r) + " = " + r + "² eng yaqin to'liq kvadrat → √" + m + " ≈ " + r); }
      n = l === 1 ? R(2, 10) : l === 2 ? R(11, 15) : R(16, 25);
      return Qz("√" + (n * n), n, [n + 1, n - 1, n * n / 2, n * 2, n + 10], "√" + (n * n) + " = " + n + ",  chunki " + n + sup(2) + " = " + (n * n));
    } },
    ildizKichik: { n: "Kvadrat ildiz (≤10)", g: 5, q: function (l) {
      l = lv(l); var n = R(0, l <= 1 ? 5 : 10);
      if (l >= 4 && R(0, 1)) { var b = R(0, 10 - n); return Qz("√" + (n * n) + " + " + b, n + b, [], "√" + (n * n) + " = " + n + " → " + n + " + " + b + " = " + (n + b)); }
      return Qz("√" + (n * n), n, [], "√" + (n * n) + " = " + n + ",  chunki " + n + " × " + n + " = " + (n * n));
    } },
    /* ---------------- Darajalar ---------------- */
    daraja: { n: "Darajalar", g: 5, q: function (l) {
      l = lv(l); var b, k, v, t = typ(l, { 1: ["d"], 2: ["d", "d", "z"], 3: ["neg", "z", "d"], 4: ["mul", "div", "pow", "d"], 5: ["mul", "div", "pow", "neg", "base"] });
      if (t === "mul") { b = R(2, 9); var m = R(2, 7), n = R(2, 7); return Qz(b + sup(m) + " · " + b + sup(n) + " = " + b + "ⁿ.  n = ?", m + n, [m * n, Math.abs(m - n), m + n + 1, b * (m + n)], b + sup(m) + " · " + b + sup(n) + " = " + b + sup(m) + "⁺" + sup(n) + " = " + b + sup(m + n) + "  (ko'paytirganda ko'rsatkichlar qo'shiladi)"); }
      if (t === "div") { b = R(2, 9); var m2 = R(5, 12), n2 = R(2, m2 - 1); return Qz(b + sup(m2) + " : " + b + sup(n2) + " = " + b + "ⁿ.  n = ?", m2 - n2, [m2 + n2, Math.round(m2 / n2), m2 - n2 + 1, m2 - n2 - 1], b + sup(m2) + " : " + b + sup(n2) + " = " + b + sup(m2 - n2) + "  (bo'lganda ko'rsatkichlar ayiriladi)"); }
      if (t === "pow") { b = R(2, 9); var p = R(2, 5), q = R(2, 4); return Qz("(" + b + sup(p) + ")" + sup(q) + " = " + b + "ⁿ.  n = ?", p * q, [p + q, p * q + 1, Math.pow(p, q), p * q - 1], "(" + b + sup(p) + ")" + sup(q) + " = " + b + sup(p * q) + "  (darajani darajaga oshirganda ko'paytiriladi)"); }
      if (t === "base") { var pr = pick([[4, 2, 2], [8, 2, 3], [9, 3, 2], [16, 2, 4], [27, 3, 3], [25, 5, 2]]), e1 = R(2, 4); return Qz(pr[0] + sup(e1) + " = " + pr[1] + "ⁿ.  n = ?", pr[2] * e1, [pr[2] + e1, e1, pr[2] * e1 + 1, pr[0] * e1], pr[0] + " = " + pr[1] + sup(pr[2]) + " → " + pr[0] + sup(e1) + " = " + pr[1] + sup(pr[2] * e1)); }
      if (t === "z") { b = R(2, 99); if (R(0, 1)) return Qz(b + "⁰", 1, [0, b, 10, 2], "Har qanday son (0 dan boshqa) ning 0-darajasi 1 ga teng"); return Qz(b + "¹", b, [1, 0, b * b, b + 1], "Birinchi daraja — sonning o'zi: " + b + "¹ = " + b); }
      if (t === "neg") { b = R(2, 5); k = R(2, 4); v = Math.pow(-b, k); if (l >= 5 && R(0, 1)) return Qz("−" + b + sup(2), -b * b, [b * b, -2 * b, 2 * b], "−" + b + sup(2) + " = −(" + b + "·" + b + ") = " + mstr(-b * b) + "   ((−" + b + ")² = " + (b * b) + " bilan adashtirmang)", true); return Qz("(−" + b + ")" + sup(k), v, [-v, Math.pow(b, k), -b * k, b * k], "(−" + b + ")" + sup(k) + " = " + mstr(v) + "   (juft daraja → musbat, toq daraja → manfiy)", true); }
      if (l === 1) { b = R(1, 5); k = pick([2, 3]); if (R(0, 3) === 0) { b = 10; k = 2; } }
      else if (l === 2) { b = pick([2, 2, 3, 10, 5]); k = b === 2 ? R(4, 8) : b === 3 ? R(3, 4) : b === 10 ? R(3, 6) : 3; }
      else { b = pick([2, 3, 4, 5, 6, 7]); k = b === 2 ? R(6, 10) : b === 3 ? R(4, 5) : 3; }
      v = Math.pow(b, k);
      return Qz(b + sup(k), v, [b * k, Math.pow(k, b) === v ? null : Math.pow(k, b), Math.pow(b, k - 1), Math.pow(b, k + 1), v + b], b + sup(k) + " = " + Array(k + 1).join(b + "·").slice(0, -1) + " = " + v + "   (" + b + "·" + k + " = " + (b * k) + " emas!)");
    } },
    /* ---------------- Foizlar ---------------- */
    foiz: { n: "Foizlar", g: 5, q: function (l) {
      l = lv(l); var p, N, v, t = typ(l, { 1: ["d"], 2: ["d", "d", "nc"], 3: ["nc", "d", "inc"], 4: ["inc", "dec", "nc", "s"], 5: ["rev", "seq", "inc", "s"] });
      if (t === "nc") { N = pick([20, 40, 50, 60, 80, 200, 300]); p = pick([10, 20, 25, 50, 75, 5]); v = N * p / 100; if (v !== Math.round(v)) { N = 200; v = N * p / 100; } return Qz(v + " soni " + N + " ning necha foizi?", p, [Math.round(N / v), 100 - p, p * 2, Math.round(v)], v + " : " + N + " · 100% = " + p + "%"); }
      if (t === "inc" || t === "dec") { N = pick([40, 80, 120, 200, 250, 300, 400]); p = pick([10, 20, 25, 50, 5, 15]); var dlt = N * p / 100; if (dlt !== Math.round(dlt)) { N = 200; dlt = 2 * p; } var up = t === "inc"; v = up ? N + dlt : N - dlt; return Qz(N + " ni " + p + "% ga " + (up ? "oshirsak?" : "kamaytirsak?"), v, [up ? N - dlt : N + dlt, dlt, N + p, N - p, v + 10], N + " ning " + p + "% = " + dlt + " → " + N + (up ? " + " : " − ") + dlt + " = " + v); }
      if (t === "s") { N = pick([80, 120, 160, 200, 240, 300]); p = pick([10, 20, 25, 30, 50]); var ch = N * p / 100; v = N - ch; return Qz("Narx " + N + " ming so'm, " + p + "% chegirma. Yangi narx? (ming so'm)", v, [ch, N + ch, N - p, v + 10], "Chegirma: " + N + " · " + p + "/100 = " + ch + " → " + N + " − " + ch + " = " + v); }
      if (t === "rev") { p = pick([10, 20, 25, 30, 40, 50, 75]); v = pick([20, 40, 60, 80, 120, 200]); var part = v * p / 100; if (part !== Math.round(part)) { v = 200; part = 2 * p; } return Qz("Sonning " + p + "% i " + part + " ga teng. Son nechaga teng?", v, [part * p / 100 === Math.round(part * p / 100) ? part * p / 100 : part + p, part + p, part * 2, v + 10], part + " : " + p + " · 100 = " + v + "   (" + p + "% → " + part + ",  100% → " + v + ")"); }
      if (t === "seq") { N = pick([100, 200, 500, 1000]); p = pick([10, 20, 50]); v = N * (10000 - p * p) / 10000; return Qz(N + " avval " + p + "% oshdi, keyin " + p + "% kamaydi. Natija?", v, [N, N + p, N - p, v - 10], N + " · " + dec(1 + p / 100, 2) + " · " + dec(1 - p / 100, 2) + " = " + v + "   (" + N + " ga qaytmaydi!)"); }
      if (l === 1) { p = pick([50, 10, 25, 100]); N = pick([20, 40, 60, 80, 100, 200, 400]); }
      else if (l === 2) { p = pick([20, 5, 75, 1, 30, 40]); N = pick([100, 200, 300, 400, 500, 600]); }
      else { p = pick([15, 35, 12, 8, 60]); N = pick([200, 300, 400, 500, 800]); }
      v = N * p / 100;
      return Qz(N + " ning " + p + "%", v, [N / p === Math.round(N / p) ? N / p : null, N - p, p, v * 10, v + 10, v / 2], N + " ning " + p + "% = " + N + " : 100 × " + p + " = " + dec(N / 100, 2) + " × " + p + " = " + v);
    } },
    /* ---------------- Tenglamalar ---------------- */
    tenglama: { n: "Tenglamalar", g: 6, q: function (l) {
      l = lv(l); var x, a, b, c, t = typ(l, { 1: ["p", "s"], 2: ["k", "b"], 3: ["kb", "kb", "kb2"], 4: ["qavs", "ikki", "kb"], 5: ["neg", "frac", "soz", "ikki"] });
      if (t === "p") { x = R(2, 30); a = R(2, 20); return Qz("x + " + a + " = " + (x + a), x, [x + 2 * a, a, x + 1, x - 1], "x = " + (x + a) + " − " + a + " = " + x); }
      if (t === "s") { x = R(12, 40); a = R(2, x - 2); return Qz("x − " + a + " = " + (x - a), x, [x - 2 * a, x - a, x + 1, a], "x = " + (x - a) + " + " + a + " = " + x); }
      if (t === "k") { x = R(2, 12); a = R(2, 9); return Qz(a + "x = " + (a * x), x, [a * x - a, a * a * x, x + 1, x - 1], "x = " + (a * x) + " : " + a + " = " + x); }
      if (t === "b") { x = R(2, 12); a = R(2, 9); return Qz("x : " + a + " = " + x, a * x, [x + a, x, a * x + a, a * x - a], "x = " + x + " × " + a + " = " + (a * x)); }
      if (t === "kb" || t === "kb2") { x = R(2, 15); a = R(2, 9); b = R(1, 30); var minus = t === "kb2"; c = minus ? a * x - b : a * x + b; if (minus && c <= 0) { b = R(1, a * x - 1); c = a * x - b; } return Qz(a + "x " + (minus ? "− " : "+ ") + b + " = " + c, x, [minus ? (c - b) / a : (c + b) / a, Math.round(c / a), x + 1, x - 1, (minus ? c + b : c - b)], a + "x = " + c + (minus ? " + " : " − ") + b + " = " + (a * x) + "  →  x = " + (a * x) + " : " + a + " = " + x); }
      if (t === "qavs") { x = R(1, 12); b = R(1, 9); a = R(2, 7); c = a * (x + b); return Qz(a + "(x + " + b + ") = " + c, x, [c / a + b, (c - b) / a, x + 1, c - a - b], "x + " + b + " = " + c + " : " + a + " = " + (x + b) + "  →  x = " + (x + b) + " − " + b + " = " + x); }
      if (t === "ikki") { x = R(2, 12); a = R(4, 9); var cc = R(1, a - 1); b = R(1, 20); var d = (a - cc) * x + b; return Qz(a + "x + " + b + " = " + cc + "x + " + d, x, [(d - b) / (a + cc), x + 1, x - 1, d - b], a + "x − " + cc + "x = " + d + " − " + b + "  →  " + (a - cc === 1 ? "" : a - cc) + "x = " + (d - b) + (a - cc === 1 ? "" : "  →  x = " + x)); }
      if (t === "neg") { x = -R(2, 12); a = R(2, 7); b = R(1, 15); c = a * x + b; return Qz(a + "x + " + b + " = " + mstr(c), x, [-x, (c + b) / a, x + 1, x - 1], a + "x = " + mstr(c) + " − " + b + " = " + mstr(a * x) + "  →  x = " + mstr(a * x) + " : " + a + " = " + mstr(x)); }
      if (t === "frac") { x = R(2, 12) * (a = R(2, 6)); b = R(1, 9); c = x / a + b; return Qz("x/" + a + " + " + b + " = " + c, x, [(c - b) / a, (c + b) * a, c * a, x + a], "x/" + a + " = " + c + " − " + b + " = " + (c - b) + "  →  x = " + (c - b) + " · " + a + " = " + x); }
      x = R(3, 15); a = R(2, 6); b = R(2, 20); c = a * x + b;
      return Qz("Bir son " + a + " ga ko'paytirilib, " + b + " qo'shilsa " + c + " chiqadi. Son?", x, [(c + b) / a, c - b, x + 1, x - 1], a + "x + " + b + " = " + c + "  →  " + a + "x = " + (c - b) + "  →  x = " + x);
    } },
    /* ---------------- EKUB ---------------- */
    ekub: { n: "EKUB", g: 6, q: function (l) {
      l = lv(l); var g, a, b, c, t = typ(l, { 1: ["d"], 2: ["d"], 3: ["d", "d", "s"], 4: ["3", "d", "s"], 5: ["3", "s", "d"] });
      var M = l === 1 ? 5 : l === 2 ? 7 : 10;
      g = l === 1 ? pick([2, 3, 4, 5, 6]) : pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 15]);
      var x = R(1, M), y = R(2, M); while (gcd(x, y) !== 1 || x === y) { x = R(1, M); y = R(2, M); }
      if (l >= 5) g = pick([6, 12, 14, 18, 21, 24]);
      a = g * x; b = g * y;
      var w = [lcm(a, b), g / 2 === Math.round(g / 2) ? g / 2 : null, g * 2, Math.min(a, b), Math.abs(a - b), g > 3 && g % 3 === 0 ? g / 3 : null];
      if (t === "3") { var z = R(2, M + 2); while (gcd(gcd(x, y), z) !== 1 || z === x || z === y) z = R(2, M + 2); c = g * z; return Qz("EKUB(" + a + "; " + b + "; " + c + ")", g, w.concat([lcm(lcm(a, b), c) > 9999 ? null : lcm(lcm(a, b), c)]), a + " = " + fstr(a) + ",  " + b + " = " + fstr(b) + ",  " + c + " = " + fstr(c) + "  →  EKUB = " + fstr(g) + " = " + g); }
      if (t === "s") { var o = pick([["olma", "nok"], ["qalam", "daftar"], ["qizil", "ko'k sharcha"]]); return Qz(a + " ta " + o[0] + " va " + b + " ta " + o[1] + " savatlarga teng bo'lindi. Eng ko'pi bilan nechta savat?", g, w, "Savatlar soni ikkala sonni ham bo'lishi kerak → EKUB(" + a + "; " + b + ") = " + g); }
      return Qz("EKUB(" + a + "; " + b + ")", g, w, a + " = " + fstr(a) + ",  " + b + " = " + fstr(b) + "  →  umumiy ko'paytuvchilar: " + (fstr(g) === String(g) ? g : fstr(g) + " = " + g) + "   (EKUK " + lcm(a, b) + " bilan adashtirmang)");
    } },
    /* ---------------- EKUK ---------------- */
    ekuk: { n: "EKUK", g: 6, q: function (l) {
      l = lv(l); var a, b, c, v, t = typ(l, { 1: ["d"], 2: ["d"], 3: ["d", "s"], 4: ["3", "d", "s"], 5: ["3", "s", "d"] });
      var M2 = l === 1 ? 10 : l === 2 ? 15 : l === 3 ? 24 : 30;
      a = R(2, M2); b = R(2, M2); while (a === b || (l >= 3 && gcd(a, b) === 1 && R(0, 1))) { a = R(2, M2); b = R(2, M2); }
      if (l === 1 && R(0, 1)) b = a * R(2, 4);
      v = lcm(a, b);
      var w = [a * b, gcd(a, b), Math.max(a, b), v * 2, v / 2 === Math.round(v / 2) ? v / 2 : null, a + b];
      if (t === "3") { a = R(2, 12); b = R(2, 12); while (b === a) b = R(2, 12); c = R(2, 12); while (c === a || c === b) c = R(2, 12); var v3 = lcm(lcm(a, b), c); return Qz("EKUK(" + a + "; " + b + "; " + c + ")", v3, [a * b * c, v3 * 2, lcm(a, b), Math.max(a, b, c), v3 / 2 === Math.round(v3 / 2) ? v3 / 2 : null], a + " = " + fstr(a) + ",  " + b + " = " + fstr(b) + ",  " + c + " = " + fstr(c) + "  →  EKUK = " + fstr(v3) + " = " + v3); }
      if (t === "s") { a = pick([6, 8, 10, 12, 15, 20]); b = pick([9, 12, 15, 18, 25, 30]); while (b === a) b = pick([9, 14, 16, 18]); v = lcm(a, b); return Qz("Avtobuslar " + a + " va " + b + " daqiqada bir keladi. Birga ketgach, yana necha daqiqadan keyin birga keladi?", v, [a * b === v ? v * 2 : a * b, gcd(a, b), a + b, Math.max(a, b)], "Ikkalasiga bo'linadigan eng kichik son: EKUK(" + a + "; " + b + ") = " + v); }
      return Qz("EKUK(" + a + "; " + b + ")", v, w, a + " = " + fstr(a) + ",  " + b + " = " + fstr(b) + "  →  EKUK = " + fstr(v) + " = " + v + (a * b !== v ? "   (" + a + "·" + b + " = " + (a * b) + " emas!)" : ""));
    } },
    /* ---------------- Kasrlar ---------------- */
    kasr: { n: "Kasrlar", g: 5, q: function (l) {
      l = lv(l); var a, b, c, d, k, t = typ(l, { 1: ["red"], 2: ["red", "red", "sum"], 3: ["sum", "red", "dif"], 4: ["add", "sub", "red"], 5: ["mul", "div", "add", "sub"] });
      function P(n) { var q = R(2, n), p = R(1, q - 1); while (gcd(p, q) !== 1) p = R(1, q - 1); return [p, q]; }
      if (t === "red") { var pq = P(l === 1 ? 5 : 9); k = l === 1 ? pick([2, 3]) : R(2, 9); a = pq[0] * k; b = pq[1] * k; var hk = k % 2 === 0 && k > 2 ? (a / 2) + "/" + (b / 2) : k % 3 === 0 && k > 3 ? (a / 3) + "/" + (b / 3) : null; return Qz(a + "/" + b + " = ?", fr(a, b), [hk, fr(pq[1], pq[0]), (pq[0] + 1) + "/" + pq[1], pq[0] + "/" + (pq[1] + 1)], a + "/" + b + " = (" + a + ":" + k + ")/(" + b + ":" + k + ") = " + fr(a, b) + "   (surat va maxraj " + k + " ga bo'lindi)"); }
      if (t === "sum" || t === "dif") { b = R(4, 12); a = R(1, b - 2); c = R(1, b - 1 - a); if (t === "dif") { a = R(3, b - 1); c = R(1, a - 1); } var nn = t === "sum" ? a + c : a - c; return Qz(a + "/" + b + (t === "sum" ? " + " : " − ") + c + "/" + b, fr(nn, b), [nn + "/" + (2 * b), fr(nn, b) === nn + "/" + b ? fr(nn + 1, b) : nn + "/" + b, fr(a * c, b)], "Maxrajlar bir xil → suratlar " + (t === "sum" ? "qo'shiladi: " : "ayiriladi: ") + a + (t === "sum" ? " + " : " − ") + c + " = " + nn + " → " + nn + "/" + b + (fr(nn, b) === nn + "/" + b ? "" : " = " + fr(nn, b))); }
      var x = P(6), y = P(8); a = x[0]; b = x[1]; c = y[0]; d = y[1];
      if (b === d) d = d + 1 > 9 ? d - 1 : d + 1, c = Math.min(c, d - 1);
      if (t === "add") return Qz(a + "/" + b + " + " + c + "/" + d, fr(a * d + c * b, b * d), [(a + c) + "/" + (b + d), fr(a + c, b * d), fr(a * d + c * b + 1, b * d), (a * d + c * b) + "/" + (b + d)], "Umumiy maxraj " + lcm(b, d) + ": " + fr(a * lcm(b, d) / b, 1) + "/" + lcm(b, d) + " + " + (c * lcm(b, d) / d) + "/" + lcm(b, d) + " = " + fr(a * d + c * b, b * d) + "   ((a+c)/(b+d) — xato usul!)");
      if (t === "sub") { if (a * d < c * b) { var t1 = a; a = c; c = t1; t1 = b; b = d; d = t1; } return Qz(a + "/" + b + " − " + c + "/" + d, fr(a * d - c * b, b * d), [fr(Math.abs(a - c), Math.abs(b - d) || 1), fr(a * d - c * b + 1, b * d), (a - c) + "/" + (b * d), fr(a * d + c * b, b * d)], "Umumiy maxraj " + lcm(b, d) + ": " + (a * lcm(b, d) / b) + "/" + lcm(b, d) + " − " + (c * lcm(b, d) / d) + "/" + lcm(b, d) + " = " + fr(a * d - c * b, b * d)); }
      if (t === "mul") return Qz(a + "/" + b + " · " + c + "/" + d, fr(a * c, b * d), [fr(a * d, b * c), fr(a + c, b + d), (a * c) + "/" + (b + d), fr(a * c * 2, b * d)], "Surat × surat, maxraj × maxraj: " + (a * c) + "/" + (b * d) + " = " + fr(a * c, b * d));
      return Qz(a + "/" + b + " : " + c + "/" + d, fr(a * d, b * c), [fr(a * c, b * d), fr(b * c, a * d), fr(a + d, b + c)], "Bo'lish = teskarisiga ko'paytirish: " + a + "/" + b + " · " + d + "/" + c + " = " + fr(a * d, b * c));
    } },
    /* ---------------- Yuzalar ---------------- */
    yuza: { n: "Yuzalar", g: 5, q: function (l) {
      l = lv(l); var a, b, h, v, t = typ(l, { 1: ["rect", "sq"], 2: ["tri", "rect", "per"], 3: ["par", "trap", "tri", "rhomb"], 4: ["rev", "sqp", "trap", "rect"], 5: ["circ", "comp", "rev", "trap"] });
      a = R(3, 9 + l); b = R(2, 9);
      if (t === "sq") { if (a === 4) a = 5; return Qz("Kvadrat tomoni " + a + ". Yuzi?", a * a, [4 * a, 2 * a, a * a + a], "S = a² = " + a + " · " + a + " = " + (a * a) + "   (perimetr 4a = " + (4 * a) + " — boshqa narsa)"); }
      if (t === "per") return Qz("To'g'ri to'rtburchak " + a + "×" + b + ". Perimetri?", 2 * (a + b), [a * b, a + b, 2 * a + b], "P = 2(a + b) = 2·(" + a + " + " + b + ") = " + (2 * (a + b)) + "   (yuza a·b = " + (a * b) + " — boshqa)");
      if (t === "tri") { h = 2 * R(1, 6); return Qz("Uchburchak: asos " + a + ", balandlik " + h + ". Yuzi?", a * h / 2, [a * h, a + h, a * h / 2 + a], "S = ½ · a · h = ½ · " + a + " · " + h + " = " + (a * h / 2) + "   (½ ni unutmang!)"); }
      if (t === "par") { h = R(2, 9); return Qz("Parallelogramm: asos " + a + ", balandlik " + h + ". Yuzi?", a * h, [a * h / 2 === Math.round(a * h / 2) ? a * h / 2 : null, 2 * (a + h), a + h], "S = a · h = " + a + " · " + h + " = " + (a * h)); }
      if (t === "trap") { var b2 = a + 2 * R(1, 4); h = R(2, 8); v = (a + b2) * h / 2; return Qz("Trapetsiya: asoslar " + a + " va " + b2 + ", balandlik " + h + ". Yuzi?", v, [(a + b2) * h, a * b2, (a + b2) / 2 + h, v + h], "S = (a + b)/2 · h = (" + a + " + " + b2 + ")/2 · " + h + " = " + ((a + b2) / 2) + " · " + h + " = " + v); }
      if (t === "rhomb") { var d1 = 2 * R(2, 7), d2 = R(3, 10); return Qz("Romb diagonallari " + d1 + " va " + d2 + ". Yuzi?", d1 * d2 / 2, [d1 * d2, d1 + d2, 2 * (d1 + d2)], "S = d₁·d₂/2 = " + d1 + "·" + d2 + "/2 = " + (d1 * d2 / 2)); }
      if (t === "rev") { v = a * b; return Qz("To'g'ri to'rtburchak yuzi " + v + ", bir tomoni " + a + ". Ikkinchi tomoni?", b, [v - a, v / 2 === Math.round(v / 2) ? v / 2 : null, b + 1, a], "b = S : a = " + v + " : " + a + " = " + b); }
      if (t === "sqp") return Qz("Kvadrat yuzi " + (a * a) + ". Perimetri?", 4 * a, [a, a * a / 4 === Math.round(a * a / 4) ? a * a / 4 : null, 2 * a, 4 * a + 4], "Tomon = √" + (a * a) + " = " + a + " → P = 4 · " + a + " = " + (4 * a));
      if (t === "circ") { var r = R(2, 10); return Qz("Radiusi " + r + " bo'lgan doira yuzi (π bilan)?", (r * r) + "π", [(2 * r) + "π", (r * r * 2) + "π", (4 * r * r) + "π", r + "π"], "S = π·r² = π·" + r + "² = " + (r * r) + "π   (2πr = " + (2 * r) + "π — aylana uzunligi)"); }
      var A = R(6, 12), c1 = R(2, 4), c2 = R(2, 5); v = A * A - c1 * c2;
      if (t === "comp") return Qz("Kvadrat tomoni " + A + ", ichidan " + c1 + "×" + c2 + " to'rtburchak kesildi. Qolgan yuza?", v, [A * A, A * A - c1 - c2, 4 * A - c1 * c2, v + c1], A + "² − " + c1 + "·" + c2 + " = " + (A * A) + " − " + (c1 * c2) + " = " + v);
      return Qz("To'g'ri to'rtburchak " + a + "×" + b + ". Yuzi?", a * b, [2 * (a + b), a + b, a * b + a, a * b - b], "S = a · b = " + a + " · " + b + " = " + (a * b) + "   (perimetr " + 2 * (a + b) + " — boshqa narsa!)");
    } },
    /* ---------------- Rim raqamlari ---------------- */
    rim: { n: "Rim raqamlari", g: 3, q: function (l) {
      l = lv(l); var max = [0, 20, 50, 100, 1000, 3999][l], n = R(4, max);
      var VAL = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      function naive(s) { return s.split("").reduce(function (t, c) { return t + VAL[c]; }, 0); }
      if (l >= 4 && R(0, 2) === 0) { var x = R(4, max / 4 | 0), y = R(4, max / 4 | 0); return Qz(roman(x) + " + " + roman(y) + " = ?", x + y, [naive(roman(x)) + naive(roman(y)), x + y + 10, x + y - 1, x + y + 1], roman(x) + " = " + x + ",  " + roman(y) + " = " + y + "  →  " + (x + y)); }
      if (l >= 3 && R(0, 2) === 0) { n = pick([4, 9, 14, 19, 40, 44, 49, 90, 94, 99, 400, 490, 900, 949, 1990, 1999]); if (n > max) n = pick([4, 9, 14, 19, 40, 49]); var wr = n === 4 ? "IIII" : n === 9 ? "VIIII" : n === 49 ? "IL" : n === 99 ? "IC" : n === 40 ? "XXXX" : n === 90 ? "LXXXX" : n === 999 ? "IM" : roman(n).replace("IV", "IIII").replace("IX", "VIIII"); return Qz(n + " = ?", roman(n), [wr, roman(n + 1), roman(n - 1), roman(n + 10)], n + " = " + roman(n) + "   (bir xil belgi 3 martadan ko'p yozilmaydi; ayirish faqat I, X, C bilan: IV, IX, XL, XC, CD, CM)"); }
      var s = roman(n), parts = s.match(/CM|CD|XC|XL|IX|IV|M|D|C|L|X|V|I/g);
      if (parts.length === 1) return Qz(s + " = ?", n, [naive(s) === n ? n + 1 : naive(s), n + 10, n - 1, n + 1, n * 2], s + " = " + n + (s.length > 1 ? "   (kichigi kattasidan chapda — ayiriladi)" : ""));
      return Qz(s + " = ?", n, [naive(s), n + 10, n - 10, n + 1, n - 1, n + 5], s + " = " + s.replace(/CM|CD|XC|XL|IX|IV|M|D|C|L|X|V|I/g, function (m) { return "+" + ({ CM: 900, CD: 400, XC: 90, XL: 40, IX: 9, IV: 4 }[m] || VAL[m]); }).slice(1).replace(/\+/g, " + ") + " = " + n + "   (kichigi kattasidan chapda bo'lsa — ayiriladi)");
    } },
    /* ---------------- Yaxlitlash ---------------- */
    yaxlitlash: { n: "Yaxlitlash", g: 4, q: function (l) {
      l = lv(l); var n, v, t = typ(l, { 1: ["10"], 2: ["10", "100"], 3: ["100", "1", "10"], 4: ["01", "1", "1000"], 5: ["01", "1000", "9s", "100"] });
      if (t === "1") { var N1 = R(100, 9990); if (N1 % 10 === 0) N1 += 3; n = N1 / 10; v = Math.round(N1 / 10); var fd = N1 % 10; return Qz(dec(n, 1) + " → butungacha", v, [Math.floor(N1 / 10) === v ? v + 1 : Math.floor(N1 / 10), v + 10, Math.round(N1 / 100) * 10], dec(n, 1) + ": o'ndan biri " + fd + (fd >= 5 ? " ≥ 5 → yuqoriga: " : " < 5 → pastga: ") + v); }
      if (t === "01") { var N2 = R(101, 999); if (N2 % 10 === 0) N2 += 3; n = N2 / 100; var v10 = Math.round(N2 / 10), fl = Math.floor(N2 / 10), hd = N2 % 10; var f1 = function (x) { return (x / 10).toFixed(1).replace(".", ","); }; return Qz(dec(n, 2) + " → o'ndan birgacha", f1(v10), [f1(fl === v10 ? fl + 1 : fl), String(Math.round(N2 / 100)), f1(v10 + 1), f1(v10 - 1)], dec(n, 2) + ": yuzdan biri " + hd + (hd >= 5 ? " ≥ 5 → yuqoriga: " : " < 5 → pastga: ") + f1(v10)); }
      if (t === "9s") { n = pick([R(1, 9) * 1000 + 950 + R(0, 49), R(1, 9) * 100 + 95 + R(0, 4)]); var big = n >= 1000; v = big ? Math.round(n / 100) * 100 : Math.round(n / 10) * 10; return Qz(n + " → " + (big ? "yuzliklargacha" : "o'nliklargacha"), v, [big ? Math.floor(n / 100) * 100 : Math.floor(n / 10) * 10, big ? Math.floor(n / 100) * 100 + 90 : v - 10, v + (big ? 100 : 10)], n + " → " + v + "   (9 + 1 = 10 → keyingi xonaga o'tadi)"); }
      var st = t === "10" ? 10 : t === "100" ? 100 : 1000;
      n = st === 10 ? R(11, l === 1 ? 99 : 989) : st === 100 ? R(111, 9899) : R(1111, 98999);
      if (n % st === 0) n += 7;
      v = Math.round(n / st) * st;
      var low = Math.floor(n / st) * st;
      return Qz(n + " → " + (st === 10 ? "o'nliklargacha" : st === 100 ? "yuzliklargacha" : "minglargacha"), v, [low === v ? v + st : low, v + st, v - st, Math.round(n / (st * 10)) * st * 10, Math.round(n / (st / 10 || 1)) * (st / 10 || 1)], n + ": keyingi xona raqami " + Math.floor((n % st) / (st / 10)) + (n % st >= st / 2 ? " ≥ 5 → yuqoriga: " : " < 5 → pastga: ") + v);
    } },
    /* ---------------- Ketma-ketliklar ---------------- */
    ketma: { n: "Ketma-ketliklar", g: 4, q: function (l) {
      l = lv(l); var s = [], v, e, i, t = typ(l, { 1: ["ar"], 2: ["ar", "ard", "geo2"], 3: ["geo", "sq", "inc"], 4: ["fib", "alt", "tri", "cube"], 5: ["2n1", "nn1", "prime", "sq1", "fib"] });
      if (t === "ar" || t === "ard") { var a = R(1, 20), d = R(2, 4 + l * 2); if (t === "ard") { a = R(40, 90); d = -R(2, 9); } for (i = 0; i < 4; i++) s.push(a + i * d); v = a + 4 * d; e = "Har safar " + (d > 0 ? "+" : "−") + Math.abs(d) + ": " + s[3] + (d > 0 ? " + " : " − ") + Math.abs(d) + " = " + v; return Qz(s.join(", ") + ", ?", v, [v + d, s[3] - d, v + 1, s[3] + 2 * d], e); }
      if (t === "geo" || t === "geo2") { var q = t === "geo2" ? 2 : R(2, 3), b0 = R(1, 4); for (i = 0; i < 4; i++) s.push(b0 * Math.pow(q, i)); v = b0 * Math.pow(q, 4); return Qz(s.join(", ") + ", ?", v, [s[3] + (s[3] - s[2]), v + q, s[3] * (q + 1), v - s[3]], "Har safar ×" + q + ": " + s[3] + " × " + q + " = " + v); }
      if (t === "sq" || t === "cube") { var p = t === "sq" ? 2 : 3, k0 = R(1, t === "sq" ? 6 : 3); for (i = 0; i < 4; i++) s.push(Math.pow(k0 + i, p)); v = Math.pow(k0 + 4, p); return Qz(s.join(", ") + ", ?", v, [s[3] + (s[3] - s[2]), v + 1, v - (k0 + 4), Math.pow(k0 + 4, p === 2 ? 3 : 2)], (t === "sq" ? "Kvadratlar: " : "Kublar: ") + (k0 + 4) + sup(p) + " = " + v); }
      if (t === "inc") { var c0 = R(1, 9), st = R(1, 3); s = [c0]; for (i = 1; i < 5; i++) s.push(s[i - 1] + st + i - 1); v = s[4] + st + 4; return Qz(s.slice(0, 5).join(", ") + ", ?", v, [s[4] + st + 3, s[4] + (s[4] - s[3]), v + 1, v - 1], "Farqlar har safar 1 ga oshadi: +" + st + ", +" + (st + 1) + ", +" + (st + 2) + ", +" + (st + 3) + " → keyingisi +" + (st + 4) + ": " + v); }
      if (t === "fib") { var f1 = R(1, 4), f2 = R(f1, 6); s = [f1, f2]; for (i = 2; i < 6; i++) s.push(s[i - 1] + s[i - 2]); v = s[5]; return Qz(s.slice(0, 5).join(", ") + ", ?", v, [s[4] + (s[4] - s[3]), s[4] * 2, v + 1, v - 1], "Har had oldingi ikkitasining yig'indisi: " + s[3] + " + " + s[4] + " = " + v); }
      if (t === "alt") { var x0 = R(5, 20), up = R(3, 7), dn = R(1, up - 1); s = [x0]; for (i = 1; i < 6; i++) s.push(s[i - 1] + (i % 2 ? up : -dn)); v = s[5]; return Qz(s.slice(0, 5).join(", ") + ", ?", v, [s[4] + up, s[4] - up, v + 1, s[4] + dn], "Navbatma-navbat +" + up + " va −" + dn + ": " + s[4] + (5 % 2 ? " + " + up : " − " + dn) + " = " + v); }
      if (t === "tri") { var n0 = R(1, 4); for (i = 0; i < 5; i++) s.push((n0 + i) * (n0 + i + 1) / 2); v = (n0 + 5) * (n0 + 6) / 2; return Qz(s.join(", ") + ", ?", v, [s[4] + (s[4] - s[3]), v + 1, v - 1, s[4] * 2], "Farqlar: +" + (n0 + 1) + ", +" + (n0 + 2) + ", +" + (n0 + 3) + ", +" + (n0 + 4) + " → " + s[4] + " + " + (n0 + 5) + " = " + v); }
      if (t === "2n1") { var y0 = R(1, 3); s = [y0]; for (i = 1; i < 5; i++) s.push(s[i - 1] * 2 + 1); v = s[4] * 2 + 1; return Qz(s.join(", ") + ", ?", v, [s[4] * 2, s[4] + (s[4] - s[3]), v + 2, v - 1], "Qoida: ×2 + 1 → " + s[4] + " · 2 + 1 = " + v); }
      if (t === "nn1") { var m0 = R(1, 4); for (i = 0; i < 5; i++) s.push((m0 + i) * (m0 + i + 1)); v = (m0 + 5) * (m0 + 6); return Qz(s.join(", ") + ", ?", v, [s[4] + (s[4] - s[3]), v + 2, v - 2, (m0 + 5) * (m0 + 5)], "n·(n+1): " + (m0 + 5) + "·" + (m0 + 6) + " = " + v + "   (farqlar 2 tadan oshadi)"); }
      if (t === "prime") { var P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41], o0 = R(0, 6); s = P.slice(o0, o0 + 5); v = P[o0 + 5]; return Qz(s.join(", ") + ", ?", v, [s[4] + 2, s[4] + (s[4] - s[3]), v + 1, s[4] + 1], "Tub sonlar: " + s[4] + " dan keyingi tub son — " + v); }
      var z0 = R(1, 5); for (i = 0; i < 5; i++) s.push((z0 + i) * (z0 + i) + 1); v = (z0 + 5) * (z0 + 5) + 1;
      return Qz(s.join(", ") + ", ?", v, [s[4] + (s[4] - s[3]), v - 1, v + 1, (z0 + 5) * (z0 + 5)], "Qoida n² + 1: " + (z0 + 5) + "² + 1 = " + v);
    } },
    /* ---------------- Manfiy sonlar ---------------- */
    manfiy: { n: "Manfiy sonlar", g: 6, q: function (l) {
      l = lv(l); var a, b, v, tx, e, t = typ(l, { 1: ["add"], 2: ["add", "sub"], 3: ["mul", "div", "sub"], 4: ["mix", "abs", "mul"], 5: ["pow", "br", "mix"] });
      var M = 6 + l * 3;
      if (t === "add") { a = R(-M, M); b = R(-M, -1); if (R(0, 1)) { var t0 = a; a = b; b = t0; } v = a + b; tx = mstr(a) + " + " + neg(b); e = mstr(a) + " + " + neg(b) + " = " + mstr(v) + (a * b < 0 ? "   (ishoralar har xil → kattasidan kichigi ayriladi, kattasining ishorasi)" : "   (ishoralar bir xil → qo'shiladi)"); return Qz(tx, v, [-v, a - b, v + 1, v - 1], e, true); }
      if (t === "sub") { a = R(-M, M); b = R(-M, -1); v = a - b; return Qz(mstr(a) + " − " + neg(b), v, [a + b, -v, v + 1, v - 1], mstr(a) + " − " + neg(b) + " = " + mstr(a) + " + " + (-b) + " = " + mstr(v) + "   (manfiyni ayirish = musbatni qo'shish)", true); }
      if (t === "mul") { a = R(2, 9) * pick([-1, 1]); b = R(2, 9) * -1; if (R(0, 1)) b = -b, a = -Math.abs(a); v = a * b; return Qz(neg(a) + " · " + neg(b), v, [-v, a + b, Math.abs(v) + 1], neg(a) + " · " + neg(b) + " = " + mstr(v) + (v > 0 ? "   (minus × minus = plyus)" : "   (har xil ishora → minus)"), true); }
      if (t === "div") { b = R(2, 9) * pick([-1, 1]); v = R(2, 9) * pick([-1, 1]); a = b * v; if (a > 0 && b > 0) { a = -a; v = -v; } return Qz(neg(a) + " : " + neg(b), v, [-v, a - b, v * b], neg(a) + " : " + neg(b) + " = " + mstr(v) + (v > 0 ? "   (ishoralar bir xil → plyus)" : "   (ishoralar har xil → minus)"), true); }
      if (t === "abs") { a = -R(3, 15); b = R(1, 12); v = Math.abs(a) - b; return Qz("|" + mstr(a) + "| − " + b, v, [a - b, -v, Math.abs(a) + b], "|" + mstr(a) + "| = " + (-a) + " → " + (-a) + " − " + b + " = " + mstr(v), true); }
      if (t === "mix") { a = -R(2, 6); b = -R(2, 6); var c = R(2, 15); v = a * b - c; return Qz(neg(a) + " · " + neg(b) + " − " + c, v, [-(a * b) - c, a * b + c, v + 2, -v], neg(a) + " · " + neg(b) + " = " + (a * b) + " → " + (a * b) + " − " + c + " = " + mstr(v), true); }
      if (t === "pow") { a = R(2, 5); var k = R(2, 3); if (R(0, 1)) { v = Math.pow(-a, k); return Qz("(−" + a + ")" + sup(k), v, [-v, -a * k, a * k], "(−" + a + ")" + sup(k) + " = " + mstr(v) + (k % 2 ? "   (toq daraja → manfiy)" : "   (juft daraja → musbat)"), true); } v = -a * a; return Qz("−" + a + "² + " + (2 * a * a), a * a, [3 * a * a, -a * a, a * a + 2 * a], "−" + a + "² = −" + (a * a) + " (avval daraja!) → −" + (a * a) + " + " + (2 * a * a) + " = " + (a * a), true); }
      a = R(2, 9); b = R(a + 1, a + 9); var m2 = R(2, 4); v = -(a - b) * m2;
      return Qz("−(" + a + " − " + b + ") · " + m2, v, [-v, (a - b) * m2, -(a + b) * m2], a + " − " + b + " = " + mstr(a - b) + " → −(" + mstr(a - b) + ") = " + (b - a) + " → " + (b - a) + " · " + m2 + " = " + v, true);
    } },
    /* ---------------- 10 gacha (boshlang'ich sinf) ---------------- */
    kichik: { n: "10 gacha qo'shish/ayirish", g: 1, q: function (l) {
      l = lv(l); var a, b, c, t = typ(l, { 1: ["+", "-"], 2: ["+", "-", "+"], 3: ["m+", "m-", "+"], 4: ["3", "m+", "-"], 5: ["s", "3", "m-"] });
      var M = l === 1 ? 5 : 10;
      if (t === "+") { a = R(0, M); b = R(0, M - a); return Qz(a + " + " + b, a + b, [], a + " + " + b + " = " + (a + b)); }
      if (t === "-") { c = R(1, M); b = R(0, c); return Qz(c + " − " + b, c - b, [], c + " − " + b + " = " + (c - b)); }
      if (t === "m+") { a = R(0, 9); c = R(a, 10); return Qz(a + " + ? = " + c, c - a, [], "? = " + c + " − " + a + " = " + (c - a)); }
      if (t === "m-") { c = R(2, 10); b = R(0, c); return Qz(c + " − ? = " + (c - b), b, [], "? = " + c + " − " + (c - b) + " = " + b); }
      if (t === "3") { a = R(1, 4); b = R(1, 3); c = R(0, 10 - a - b); if (R(0, 1)) return Qz(a + " + " + b + " + " + c, a + b + c, [], a + " + " + b + " = " + (a + b) + " → " + (a + b) + " + " + c + " = " + (a + b + c)); var x = R(6, 10), y = R(1, 3), z = R(0, x - y); return Qz(x + " − " + y + " − " + z, x - y - z, [], x + " − " + y + " = " + (x - y) + " → " + (x - y) + " − " + z + " = " + (x - y - z)); }
      var n = pick(ISM); a = R(3, 10); b = R(1, a);
      return Qz(n + "da " + a + " ta olma bor edi, " + b + " tasini yedi. Nechta qoldi?", a - b, [], a + " − " + b + " = " + (a - b));
    } },
    kichikAralash: { n: "10 gacha aralash", g: 2, q: function (l) {
      l = lv(l); var t = typ(l, { 1: ["x", ":"], 2: ["x", ":", "r"], 3: ["mx", "m:", "r"], 4: ["x+", "mx", "r"], 5: ["x+", "x-", "m:"] }), a, b;
      if (t === "x") { a = R(1, 5); b = R(0, Math.floor(10 / Math.max(1, a))); if (l === 1) b = R(1, 2); return Qz(a + " × " + b, a * b, [], a + " × " + b + " = " + (a * b)); }
      if (t === ":") { b = pick([1, 2, 5]); a = R(0, Math.floor(10 / b)) * b; return Qz(a + " : " + b, a / b, [], a + " : " + b + " = " + (a / b) + ",  chunki " + b + " × " + (a / b) + " = " + a); }
      if (t === "r") { a = R(0, 3); return Qz("√" + (a * a), a, [], "√" + (a * a) + " = " + a + ",  chunki " + a + " × " + a + " = " + (a * a)); }
      if (t === "mx") { a = R(1, 5); b = R(1, Math.floor(10 / a)); return Qz(a + " × ? = " + (a * b), b, [], "? = " + (a * b) + " : " + a + " = " + b); }
      if (t === "m:") { b = pick([2, 5]); var c = R(1, Math.floor(10 / b)); return Qz("? : " + b + " = " + c, b * c, [], "? = " + c + " × " + b + " = " + (b * c)); }
      a = R(1, 3); b = R(1, 3); var d = R(0, 10 - a * b);
      if (t === "x-") { d = R(0, a * b); return Qz(a + " × " + b + " − " + d, a * b - d, [], a + " × " + b + " = " + (a * b) + " → " + (a * b) + " − " + d + " = " + (a * b - d)); }
      return Qz(a + " × " + b + " + " + d, a * b + d, [], "Avval ko'paytirish: " + a + " × " + b + " = " + (a * b) + " → " + (a * b) + " + " + d + " = " + (a * b + d));
    } }
  };

  /* ---------- FIZIKA (5 daraja: formula → katta sonlar → teskari formula → birliklar → ikki qadam) ---------- */
  (function () {
    var KMH = [[18, 5], [36, 10], [54, 15], [72, 20], [90, 25], [108, 30]];
    var F = {
      tezlik: { n: "Fizika: tezlik v = s/t", g: 7, q: function (l) {
        l = lv(l); var v, t, s;
        if (l <= 2) { v = l === 1 ? R(2, 10) : R(5, 25); t = l === 1 ? R(2, 5) : R(3, 12); s = v * t; return Qz("s = " + s + " m, t = " + t + " s. v = ? (m/s)", v, [s * t, s - t, v + 1, v - 1, s + t], "v = s / t = " + s + " / " + t + " = " + v + " m/s"); }
        if (l === 3) { v = R(3, 20); t = R(3, 12); s = v * t; return Qz("v = " + v + " m/s, s = " + s + " m. t = ? (s)", t, [s * v, s - v, t + 1, t - 1], "t = s / v = " + s + " / " + v + " = " + t + " s"); }
        if (l === 4) { var k = pick(KMH); if (R(0, 1)) return Qz(k[0] + " km/soat = ? m/s", k[1], [k[0] * 3.6, k[0] * 1000, k[1] * 2, k[1] + 5], k[0] + " km/soat = " + k[0] + " · 1000 m / 3600 s = " + k[0] + " : 3,6 = " + k[1] + " m/s"); return Qz(k[1] + " m/s = ? km/soat", k[0], [k[1] / 3.6, k[1] * 60, k[0] + 18, k[1] * 10], k[1] + " m/s · 3,6 = " + k[0] + " km/soat"); }
        v = R(2, 10); t = pick([5, 10, 15, 20]); s = v * t * 60;
        return Qz("Velosipedchi " + s + " m ni " + t + " daqiqada bosib o'tdi. Tezligi? (m/s)", v, [s / t, v * 60, v + 1, s / t / 10], "t = " + t + " daq = " + (t * 60) + " s → v = " + s + " / " + (t * 60) + " = " + v + " m/s   (daqiqani soniyaga aylantirish shart!)");
      } },
      masofa: { n: "Fizika: masofa s = v·t", g: 7, q: function (l) {
        l = lv(l); var v, t;
        if (l <= 2) { v = l === 1 ? R(2, 10) : R(10, 30); t = l === 1 ? R(2, 6) : R(5, 15); return Qz("v = " + v + " m/s, t = " + t + " s. s = ? (m)", v * t, [v + t, v * t + v, v * t - t, Math.round(v / t) || null], "s = v · t = " + v + " · " + t + " = " + (v * t) + " m"); }
        if (l === 3) { v = R(3, 25); t = R(3, 12); return Qz("s = " + (v * t) + " m, v = " + v + " m/s. t = ? (s)", t, [v * t * v, v * t - v, t + 1, t - 1], "t = s / v = " + (v * t) + " / " + v + " = " + t + " s"); }
        if (l === 4) { var k = pick(KMH); t = R(4, 20); return Qz("v = " + k[0] + " km/soat, t = " + t + " s. s = ? (m)", k[1] * t, [k[0] * t, k[1] + t, k[1] * t * 2, k[0] * t / 10], k[0] + " km/soat = " + k[1] + " m/s → s = " + k[1] + " · " + t + " = " + (k[1] * t) + " m"); }
        if (R(0, 1)) { v = pick([40, 50, 60, 80, 90]); var h = pick([2, 3, 4]) + pick([0, 0.5]); return Qz("Poyezd " + v + " km/soat tezlikda " + dec(h, 1) + " soat yurdi. Masofa? (km)", v * h, [v + h, v * Math.floor(h), v * h * 60, v * (h + 0.5)], "s = " + v + " · " + dec(h, 1) + " = " + (v * h) + " km"); }
        v = R(5, 25); t = pick([2, 3, 4, 5]);
        return Qz("v = " + v + " m/s, t = " + t + " daqiqa. s = ? (m)", v * t * 60, [v * t, v * t * 100, v * t * 6, v * 60], t + " daq = " + (t * 60) + " s → s = " + v + " · " + (t * 60) + " = " + (v * t * 60) + " m");
      } },
      zichlik: { n: "Fizika: zichlik ρ = m/V", g: 7, q: function (l) {
        l = lv(l); var MAT = [["Suv", 1000], ["Muz", 900], ["Alyuminiy", 2700], ["Temir", 7800], ["Mis", 8900], ["Kerosin", 800]];
        if (l === 1) { var r = pick([1, 2, 3, 5]), V = R(2, 6); return Qz("m = " + (r * V) + " kg, V = " + V + " m³. ρ = ? (kg/m³)", r, [r * V * V, r * V - V, r + 1, V], "ρ = m / V = " + (r * V) + " / " + V + " = " + r + " kg/m³"); }
        var M = pick(MAT), V2 = R(2, 5);
        if (l === 2) return Qz("m = " + (M[1] * V2) + " kg, V = " + V2 + " m³. ρ = ? (kg/m³)", M[1], [M[1] * V2 * V2, M[1] / 10, M[1] + 100, M[1] * 2], "ρ = " + (M[1] * V2) + " / " + V2 + " = " + M[1] + " kg/m³ (" + M[0].toLowerCase() + ")");
        if (l === 3) return Qz(M[0] + " (ρ = " + M[1] + " kg/m³), V = " + V2 + " m³. m = ? (kg)", M[1] * V2, [M[1] / V2 === Math.round(M[1] / V2) ? M[1] / V2 : null, M[1] + V2, M[1] * V2 * 10, M[1]], "m = ρ · V = " + M[1] + " · " + V2 + " = " + (M[1] * V2) + " kg");
        if (l === 4) { if (R(0, 1)) { var gV = pick([100, 200, 300, 400, 500]), dd = pick([[2.7, "alyuminiy"], [7.8, "temir"], [1, "suv"], [0.9, "muz"], [8.9, "mis"]]); var mg = Math.round(gV * dd[0]); return Qz("m = " + mg + " g, V = " + gV + " cm³. ρ = ? (g/cm³)", dec(dd[0], 1), [dec(dd[0] * 10, 1), dec(gV / mg, 2), dec(dd[0] * 1000, 0), dec(dd[0] + 1, 1)], "ρ = " + mg + " / " + gV + " = " + dec(dd[0], 1) + " g/cm³ (" + dd[1] + ")"); } var M2 = pick(MAT); return Qz("ρ = " + dec(M2[1] / 1000, 1) + " g/cm³ = ? kg/m³", M2[1], [M2[1] / 10, M2[1] / 1000, M2[1] * 10, M2[1] + 1000], "1 g/cm³ = 1000 kg/m³ → " + dec(M2[1] / 1000, 1) + " · 1000 = " + M2[1] + " kg/m³"); }
        if (R(0, 1)) { var L = pick([2, 3, 5, 10, 20]); return Qz(L + " litr suvning massasi? (kg)", L, [L * 1000, L / 10, L * 10], "1 l = 0,001 m³ → m = 1000 · " + L + " · 0,001 = " + L + " kg"); }
        var vv = pick([0.5, 1.5, 2.5]), MM = pick(MAT);
        return Qz("Hajmi " + dec(vv, 1) + " m³ " + MM[0].toLowerCase() + " (ρ = " + MM[1] + " kg/m³). m = ? (kg)", MM[1] * vv, [MM[1] / vv, MM[1] * Math.ceil(vv), MM[1] + vv, MM[1] * vv * 10], "m = " + MM[1] + " · " + dec(vv, 1) + " = " + (MM[1] * vv) + " kg");
      } },
      kuch: { n: "Fizika: kuch F = m·a", g: 7, q: function (l) {
        l = lv(l); var m, a;
        if (l <= 2) { m = l === 1 ? R(2, 10) : R(10, 50); a = l === 1 ? R(1, 5) : R(2, 9); return Qz("m = " + m + " kg, a = " + a + " m/s². F = ? (N)", m * a, [m + a, m * a + m, Math.round(m / a) || null, m * a - a], "F = m · a = " + m + " · " + a + " = " + (m * a) + " N"); }
        if (l === 3) { m = R(2, 20); a = R(2, 9); if (R(0, 1)) return Qz("F = " + (m * a) + " N, m = " + m + " kg. a = ? (m/s²)", a, [m * a * m, m * a - m, a + 1, a - 1], "a = F / m = " + (m * a) + " / " + m + " = " + a + " m/s²"); return Qz("F = " + (m * a) + " N, a = " + a + " m/s². m = ? (kg)", m, [m * a * a, m * a - a, m + 1, m - 1], "m = F / a = " + (m * a) + " / " + a + " = " + m + " kg"); }
        if (l === 4) { var g = pick([200, 400, 500, 800, 1500, 2500]); a = pick([2, 4, 6, 10]); var Fv = g / 1000 * a; if (Fv !== Math.round(Fv)) { g = 500; a = 4; Fv = 2; } return Qz("m = " + g + " g, a = " + a + " m/s². F = ? (N)", Fv, [g * a, g * a / 100, Fv * 10, Fv + 1], g + " g = " + dec(g / 1000, 1) + " kg → F = " + dec(g / 1000, 1) + " · " + a + " = " + Fv + " N   (grammni kg ga aylantiring!)"); }
        if (R(0, 1)) { m = R(2, 10); var dv = R(2, 6) * 5, t = pick([2, 5, 10]); while (dv % t) dv += 5; a = dv / t; return Qz("m = " + m + " kg jism " + t + " s da tezligini 0 dan " + dv + " m/s gacha oshirdi. F = ? (N)", m * a, [m * dv, m * a + m, a, m * t], "a = " + dv + " / " + t + " = " + a + " m/s² → F = " + m + " · " + a + " = " + (m * a) + " N"); }
        var F1 = R(20, 60), F2 = R(5, F1 - 5); m = pick([2, 3, 4, 5, 6]); var Fn = F1 - F2; while (Fn % m) { F1++; Fn = F1 - F2; }
        return Qz(F1 + " N o'ngga, " + F2 + " N chapga, m = " + m + " kg. a = ? (m/s²)", Fn / m, [(F1 + F2) / m === Math.round((F1 + F2) / m) ? (F1 + F2) / m : null, Fn, Fn / m + 1, Fn / m - 1], "Natijaviy kuch " + F1 + " − " + F2 + " = " + Fn + " N → a = " + Fn + " / " + m + " = " + (Fn / m) + " m/s²");
      } },
      om: { n: "Fizika: Om qonuni I = U/R", g: 8, q: function (l) {
        l = lv(l); var I, Rr, U;
        if (l <= 2) { I = R(1, l === 1 ? 5 : 12); Rr = pick(l === 1 ? [2, 3, 4, 5] : [4, 5, 6, 8, 10, 12, 20]); U = I * Rr; return Qz("U = " + U + " V, R = " + Rr + " Ω. I = ? (A)", I, [U * Rr, U - Rr, I + 1, I - 1], "I = U / R = " + U + " / " + Rr + " = " + I + " A"); }
        if (l === 3) { I = R(2, 9); Rr = pick([2, 3, 4, 5, 6, 8, 10]); U = I * Rr; if (R(0, 1)) return Qz("I = " + I + " A, R = " + Rr + " Ω. U = ? (V)", U, [I + Rr, U + I, U - Rr, Rr - I > 0 ? Rr - I : null], "U = I · R = " + I + " · " + Rr + " = " + U + " V"); return Qz("U = " + U + " V, I = " + I + " A. R = ? (Ω)", Rr, [U * I, U - I, Rr + 1, Rr - 1], "R = U / I = " + U + " / " + I + " = " + Rr + " Ω"); }
        if (l === 4) { var r1 = R(1, 8), r2 = R(2, 12); I = R(1, 6); U = I * (r1 + r2); return Qz("R₁ = " + r1 + " Ω, R₂ = " + r2 + " Ω ketma-ket, U = " + U + " V. I = ? (A)", I, [U / r1 === Math.round(U / r1) ? U / r1 : null, U / r2 === Math.round(U / r2) ? U / r2 : null, I + 1, U - r1 - r2], "Ketma-ket: R = " + r1 + " + " + r2 + " = " + (r1 + r2) + " Ω → I = " + U + " / " + (r1 + r2) + " = " + I + " A"); }
        var pr = pick([[3, 6, 2], [4, 12, 3], [6, 12, 4], [10, 15, 6], [12, 24, 8], [6, 6, 3], [20, 30, 12], [12, 12, 6]]);
        if (R(0, 1)) return Qz("R₁ = " + pr[0] + " Ω va R₂ = " + pr[1] + " Ω parallel. R = ? (Ω)", pr[2], [pr[0] + pr[1], Math.round((pr[0] + pr[1]) / 2), pr[2] + 1, Math.abs(pr[1] - pr[0]) || null], "Parallel: R = R₁·R₂ / (R₁ + R₂) = " + (pr[0] * pr[1]) + " / " + (pr[0] + pr[1]) + " = " + pr[2] + " Ω");
        I = R(1, 4); U = pr[2] * I;
        return Qz(pr[0] + " Ω va " + pr[1] + " Ω parallel, U = " + U + " V. Umumiy I = ? (A)", I, [U / (pr[0] + pr[1]) === Math.round(U / (pr[0] + pr[1])) ? U / (pr[0] + pr[1]) : null, I + 1, I * 2, U], "R = " + (pr[0] * pr[1]) + "/" + (pr[0] + pr[1]) + " = " + pr[2] + " Ω → I = " + U + " / " + pr[2] + " = " + I + " A");
      } },
      ish: { n: "Fizika: ish A = F·s", g: 7, q: function (l) {
        l = lv(l); var F, s;
        if (l <= 2) { F = l === 1 ? R(2, 10) : R(10, 60); s = l === 1 ? R(2, 10) : R(3, 15); return Qz("F = " + F + " N, s = " + s + " m. A = ? (J)", F * s, [F + s, F * s + F, F * s - s, Math.round(F / s) || null], "A = F · s = " + F + " · " + s + " = " + (F * s) + " J"); }
        if (l === 3) { F = R(5, 40); s = R(2, 12); return Qz("A = " + (F * s) + " J, F = " + F + " N. s = ? (m)", s, [F * s * F, F * s - F, s + 1, s - 1], "s = A / F = " + (F * s) + " / " + F + " = " + s + " m"); }
        if (l === 4) { var kN = R(2, 9); s = R(2, 20); if (R(0, 1)) return Qz("F = " + kN + " kN, s = " + s + " m. A = ? (kJ)", kN * s, [kN * s * 1000, kN + s, kN * s / 10, kN * s + s], "A = " + kN + " kN · " + s + " m = " + (kN * s) + " kJ"); return Qz("A = " + (kN * s) + " kJ, s = " + s + " m. F = ? (N)", kN * 1000, [kN, kN * 100, kN * s * 1000, kN * 10000], "F = A / s = " + (kN * s * 1000) + " J / " + s + " m = " + (kN * 1000) + " N"); }
        var m = R(5, 60), h = R(2, 10);
        return Qz("Massasi " + m + " kg yuk " + h + " m balandlikka ko'tarildi (g = 10). A = ? (J)", m * 10 * h, [m * h, m * 10 + h, m * 10 * h * 10, (m + h) * 10], "F = m·g = " + (m * 10) + " N → A = " + (m * 10) + " · " + h + " = " + (m * 10 * h) + " J");
      } },
      quvvat: { n: "Fizika: quvvat P = A/t", g: 7, q: function (l) {
        l = lv(l); var P, t, A;
        if (l <= 2) { P = l === 1 ? R(2, 20) : R(10, 100); t = l === 1 ? R(2, 6) : R(5, 20); A = P * t; return Qz("A = " + A + " J, t = " + t + " s. P = ? (W)", P, [A * t, A - t, P + 1, P - 1], "P = A / t = " + A + " / " + t + " = " + P + " W"); }
        if (l === 3) { P = R(5, 60); t = R(5, 30); return Qz("P = " + P + " W, t = " + t + " s. A = ? (J)", P * t, [P + t, P * t + P, Math.round(P / t) || null, P * t * 10], "A = P · t = " + P + " · " + t + " = " + (P * t) + " J"); }
        if (l === 4) { var J = pick([600, 1200, 1800, 2400, 3000, 3600, 6000]), mn = pick([1, 2]); if ((J / 60 / mn) % 1) mn = 1; var Pv = J / (mn * 60); return Qz("A = " + dec(J / 1000, 1) + " kJ, t = " + mn + " daqiqa. P = ? (W)", Pv, [J / mn, J / 1000 / mn, Pv * 60, Pv + 10], dec(J / 1000, 1) + " kJ = " + J + " J,  " + mn + " daq = " + (mn * 60) + " s → P = " + J + " / " + (mn * 60) + " = " + Pv + " W"); }
        if (R(0, 1)) { var Fq = R(2, 9) * 50, vq = R(2, 6); return Qz("Motor tortish kuchi " + Fq + " N, tezlik " + vq + " m/s. P = ? (W)", Fq * vq, [Fq / vq === Math.round(Fq / vq) ? Fq / vq : null, Fq + vq, Fq * vq * 10], "P = F · v = " + Fq + " · " + vq + " = " + (Fq * vq) + " W"); }
        var m = pick([40, 50, 60, 70]), h = R(2, 6), tt = pick([4, 5, 8, 10]); var Pq = m * 10 * h / tt; if (Pq !== Math.round(Pq)) tt = 10, Pq = m * h;
        return Qz("Massasi " + m + " kg o'quvchi " + h + " m ga " + tt + " s da ko'tarildi (g = 10). P = ? (W)", Pq, [m * 10 * h, m * h, Pq * 10, Pq + 10], "A = m·g·h = " + (m * 10 * h) + " J → P = " + (m * 10 * h) + " / " + tt + " = " + Pq + " W");
      } },
      bosim: { n: "Fizika: bosim p = F/S", g: 7, q: function (l) {
        l = lv(l); var p, S, F;
        if (l <= 2) { p = l === 1 ? R(2, 20) : R(10, 90) * 10; S = l === 1 ? R(2, 5) : R(2, 8); F = p * S; return Qz("F = " + F + " N, S = " + S + " m². p = ? (Pa)", p, [F * S, F - S, p + 10, p - 1], "p = F / S = " + F + " / " + S + " = " + p + " Pa"); }
        if (l === 3) { p = R(10, 90) * 10; S = R(2, 6); return Qz("p = " + p + " Pa, S = " + S + " m². F = ? (N)", p * S, [p + S, p / S === Math.round(p / S) ? p / S : null, p * S * 10, p * S + p], "F = p · S = " + p + " · " + S + " = " + (p * S) + " N"); }
        if (l === 4) { var cm = pick([100, 200, 400, 500]), kPa = R(2, 30); F = kPa * 1000 * cm / 10000; if (F !== Math.round(F)) { cm = 200; F = kPa * 20; } return Qz("F = " + F + " N, S = " + cm + " cm². p = ? (kPa)", kPa, [Math.round(F / cm) || null, kPa * 1000, kPa * 10, F / cm * 100 === Math.round(F / cm * 100) ? F / cm * 100 : null], cm + " cm² = " + dec(cm / 10000, 2) + " m² → p = " + F + " / " + dec(cm / 10000, 2) + " = " + (kPa * 1000) + " Pa = " + kPa + " kPa"); }
        if (R(0, 1)) { var h = R(2, 12); return Qz("Suv ostida " + h + " m chuqurlikda bosim? (kPa; ρ = 1000, g = 10)", h * 10, [h * 1000, h, h * 100, h * 10 + 100], "p = ρ·g·h = 1000 · 10 · " + h + " = " + (h * 10000) + " Pa = " + (h * 10) + " kPa"); }
        var m = pick([32, 40, 48, 56, 60, 64]), S100 = pick([2, 4, 8]); if (m % S100) S100 = 4; var Sm = S100 / 100, pk = m / S100;
        return Qz("Massasi " + m + " kg o'quvchi, tuflilar tagi jami " + dec(Sm, 2) + " m². p = ? (kPa)", pk, [m * 10 * S100, m * 10, pk * 10, pk + 5], "F = m·g = " + (m * 10) + " N → p = " + (m * 10) + " / " + dec(Sm, 2) + " = " + (pk * 1000) + " Pa = " + pk + " kPa");
      } },
      ogirlik: { n: "Fizika: og'irlik P = m·g (g≈10)", g: 7, q: function (l) {
        l = lv(l); var m;
        if (l <= 2) { m = l === 1 ? R(1, 12) : R(13, 120); return Qz("m = " + m + " kg. Og'irlik P = ? (N, g = 10)", m * 10, [m, m * 10 + 10, m * 10 - 10, m * 100], "P = m · g = " + m + " · 10 = " + (m * 10) + " N"); }
        if (l === 3) { m = R(5, 90); return Qz("Og'irligi " + (m * 10) + " N. Massasi? (kg, g = 10)", m, [m * 100, m * 10, m + 10, m - 1], "m = P / g = " + (m * 10) + " / 10 = " + m + " kg"); }
        if (l === 4) { var g = R(1, 30) * 100; return Qz("m = " + g + " g. Og'irlik P = ? (N, g = 10)", g / 100, [g * 10, g / 10, g / 1000, g / 100 + 1], g + " g = " + dec(g / 1000, 1) + " kg → P = " + dec(g / 1000, 1) + " · 10 = " + dec(g / 100, 1) + " N"); }
        m = pick([10, 20, 25, 40, 50, 60, 75, 80]); var Pm = m * 16 / 10;
        if (R(0, 1)) return Qz("Oyda g ≈ 1,6 N/kg. m = " + m + " kg jism og'irligi? (N)", Pm, [m * 10, m * 1.6 * 10, m + 1.6, Pm * 2], "P = m · g_Oy = " + m + " · 1,6 = " + dec(Pm, 1) + " N   (Yerdagidan " + dec(10 / 1.6, 2) + " marta kam)");
        return Qz("Yerda " + (m * 10) + " N bo'lgan jism Oyda (g ≈ 1,6) necha N?", Pm, [m * 10, m * 1.6 * 10, m, (m * 10) / 1.6], "m = " + (m * 10) + " / 10 = " + m + " kg → P_Oy = " + m + " · 1,6 = " + dec(Pm, 1) + " N   (massa o'zgarmaydi, og'irlik o'zgaradi)");
      } },
      issiqlik: { n: "Fizika: Q = c·m·Δt", g: 8, q: function (l) {
        l = lv(l); var c, m, dt, Q;
        if (l === 1) { c = pick([1, 2, 4]); m = R(1, 5); dt = R(2, 10); Q = c * m * dt; return Qz("c = " + c + " kJ/(kg·°C), m = " + m + " kg, Δt = " + dt + " °C. Q = ? (kJ)", Q, [c + m + dt, c * m + dt, Q + 10, m * dt], "Q = c · m · Δt = " + c + " · " + m + " · " + dt + " = " + Q + " kJ"); }
        if (l === 2) { m = R(1, 5); dt = R(1, 8) * 5; Q = Math.round(4.2 * m * dt); return Qz("Suv: m = " + m + " kg, Δt = " + dt + " °C, c = 4,2 kJ/(kg·°C). Q = ? (kJ)", Q, [m * dt, Math.round(4.2 * m), Q * 10, Math.round(4.2 * dt)], "Q = 4,2 · " + m + " · " + dt + " = " + Q + " kJ"); }
        if (l === 3) { m = R(1, 4); dt = R(1, 8) * 5; Q = Math.round(4.2 * m * dt); return Qz("Suvga Q = " + Q + " kJ berildi, m = " + m + " kg (c = 4,2). Δt = ? (°C)", dt, [Math.round(Q / m), Math.round(Q / 4.2), dt + 5, dt * 2], "Δt = Q / (c·m) = " + Q + " / (4,2 · " + m + ") = " + dt + " °C"); }
        if (l === 4) { m = R(1, 3); var t1 = R(1, 4) * 10, t2 = t1 + R(2, 7) * 10; Q = Math.round(4.2 * m * (t2 - t1)); return Qz("Suv " + t1 + " °C dan " + t2 + " °C gacha isitildi, m = " + m + " kg (c = 4,2). Q = ? (kJ)", Q, [Math.round(4.2 * m * t2), Math.round(4.2 * m * (t1 + t2)), Q + 42, Math.round(4.2 * (t2 - t1))], "Δt = " + t2 + " − " + t1 + " = " + (t2 - t1) + " °C → Q = 4,2 · " + m + " · " + (t2 - t1) + " = " + Q + " kJ"); }
        var g, T1, T2 = 100, tries = 0; do { g = pick([250, 500, 750, 1000, 1500, 2000]); T1 = pick([10, 20, 25, 30, 40, 50, 60]); } while ((42 * g * (T2 - T1)) % 10000 && tries++ < 60); Q = 42 * g * (T2 - T1) / 10000;
        return Qz(g + " g suv " + T1 + " °C dan qaynatildi (100 °C, c = 4,2). Q = ? (kJ)", Q, [Math.round(4.2 * g * (T2 - T1)), Math.round(4.2 * g / 1000 * T2), Q * 2, Q + 42], g + " g = " + dec(g / 1000, 2) + " kg,  Δt = " + (T2 - T1) + " → Q = 4,2 · " + dec(g / 1000, 2) + " · " + (T2 - T1) + " = " + Q + " kJ");
      } }
    };
    for (var k in F) TOPICS[k] = F[k];
  })();

  /* ---------- TEXNIKUM MAVZULARI (2026-10): takrorlanuvchi o'yinlar o'rniga yangi mavzular ----------
     qisqaKop, standart, progressiya, proporsiya, kvTenglama, logarifm, barmoqKop, birlik (+ LINES.modul) */
  (function () {
    var SUBN = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
    function sb(n) { return String(n).split("").map(function (c) { return SUBN[c] || c; }).join(""); }
    function supN(n) { return n < 0 ? "⁻" + sup(-n) : sup(n); }
    function sg(n) { return n < 0 ? " − " + (-n) : " + " + n; }                       // " + 3" / " − 3"
    function sgx(k, v) { if (!k) return ""; var a = Math.abs(k); return (k < 0 ? " − " : " + ") + (a === 1 ? "" : a) + v; }
    function kvd(a, b, c) { return (a === 1 ? "" : a === -1 ? "−" : mstr(a)) + "x²" + sgx(b, "x") + (c ? sg(c) : "") + " = 0"; }
    function grp(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }       // 4500000 → "4 500 000"
    function lg(b) { return b === 10 ? "lg " : "log" + sb(b) + " "; }
    function isInt(x) { return x === Math.round(x); }

    var T = {
      /* ---------------- Qisqa ko'paytirish formulalari ---------------- */
      qisqaKop: { n: "Qisqa ko'paytirish formulalari", g: 7, q: function (l) {
        l = lv(l); var a, k, S, P, t = typ(l, { 1: ["kv+", "kv-", "kv+"], 2: ["kv-", "ayir", "oxir"], 3: ["son", "ayir2", "koef", "oxir"], 4: ["koef", "son", "ajrat", "ajrat2"], 5: ["kub", "kubAyir", "ab", "ajrat2"] });
        a = R(2, l <= 1 ? 6 : 9);
        if (t === "kv+") return Qz("(x + " + a + ")² = x² + ?x + " + (a * a), 2 * a, [a, a * a, 4 * a, 2 * a + 1], "(a + b)² = a² + 2ab + b² → 2 · x · " + a + " = " + (2 * a) + "x");
        if (t === "kv-") return Qz("(x − " + a + ")² = x² − " + (2 * a) + "x + ?", a * a, [2 * a, a, 2 * a * a, a * a + 2 * a], "(a − b)² = a² − 2ab + b² → (−" + a + ")² = " + (a * a) + "  (oxirgi had doim musbat!)");
        if (t === "ayir") return Qz("(x − " + a + ")(x + " + a + ") = x² − ?", a * a, [2 * a, a, 2 * a * a, a * a + a], "(a − b)(a + b) = a² − b² → " + a + "² = " + (a * a));
        if (t === "oxir") {
          a = R(3, 9);
          if (R(0, 1)) return Qz("(x + " + a + ")² = ?", "x² + " + (2 * a) + "x + " + (a * a), ["x² + " + (a * a), "x² + " + a + "x + " + (a * a), "x² + " + (2 * a) + "x + " + (2 * a), "x² + " + (a * a) + "x + " + (2 * a)], "(x + " + a + ")² = x² + 2·" + a + "·x + " + a + "² = x² + " + (2 * a) + "x + " + (a * a) + "   (x² + " + (a * a) + " emas!)");
          return Qz("(x + " + a + ")(x − " + a + ") = ?", "x² − " + (a * a), ["x² + " + (a * a), "x² − " + (2 * a), "x² − " + (2 * a) + "x − " + (a * a), "x² − " + (a * a) + "x"], "(a + b)(a − b) = a² − b² → x² − " + (a * a));
        }
        if (t === "son") {
          var T0 = R(3, 9) * 10, s = pick([1, -1]), n = T0 + s;
          if (R(0, 1)) return Qz(n + "²", n * n, [T0 * T0 + 1, n * n + 100, n * n - 2 * T0, n * 2], n + "² = (" + T0 + (s > 0 ? " + " : " − ") + "1)² = " + (T0 * T0) + (s > 0 ? " + " : " − ") + (2 * T0) + " + 1 = " + (n * n));
          return Qz((T0 - 1) + " · " + (T0 + 1), T0 * T0 - 1, [T0 * T0 + 1, T0 * T0, T0 * T0 - 2 * T0 - 1], "(" + T0 + " − 1)(" + T0 + " + 1) = " + T0 + "² − 1² = " + (T0 * T0) + " − 1 = " + (T0 * T0 - 1));
        }
        if (t === "ayir2") { var A = R(56, 89), B = 100 - A; return Qz(A + "² − " + B + "²", (A - B) * 100, [(A - B) * (A - B), (A - B) * 10, (A - B) * 100 + 100], "a² − b² = (a − b)(a + b) = " + (A - B) + " · " + (A + B) + " = " + ((A - B) * 100)); }
        if (t === "koef") { k = R(2, 5); a = R(1, 7); return Qz("(" + k + "x + " + a + ")² = " + (k * k) + "x² + ?x + " + (a * a), 2 * k * a, [k * a, 2 * a, k * k * a, 2 * k * a + a], "2 · " + k + "x · " + a + " = " + (2 * k * a) + "x"); }
        if (t === "ajrat") { if (R(0, 1)) return Qz("x² − " + (a * a) + " = (x − " + a + ")(x + ?)", a, [a * a, 2 * a, a + 1], "x² − " + (a * a) + " = x² − " + a + "² = (x − " + a + ")(x + " + a + ")"); return Qz("x² + " + (2 * a) + "x + " + (a * a) + " = (x + ?)²", a, [2 * a, a * a, a + 1], "x² + 2·" + a + "·x + " + a + "² = (x + " + a + ")²"); }
        if (t === "ajrat2") { k = R(2, 5); a = R(1, 9); while (gcd(k, a) !== 1) a = R(1, 9); return Qz((k * k) + "x² − " + (a * a) + " = (" + k + "x − " + a + ")(" + k + "x + ?)", a, [a * a, k * a, 2 * a], (k * k) + "x² − " + (a * a) + " = (" + k + "x)² − " + a + "² = (" + k + "x − " + a + ")(" + k + "x + " + a + ")"); }
        if (t === "kub") { a = R(1, 4); return Qz("(x + " + a + ")³ = x³ + " + (3 * a) + "x² + ?x + " + (a * a * a), 3 * a * a, [3 * a, a * a, 2 * a * a, 3 * a * a + 3 * a], "(a + b)³ = a³ + 3a²b + 3ab² + b³ → 3 · x · " + a + "² = " + (3 * a * a) + "x"); }
        if (t === "kubAyir") { a = R(2, 5); return Qz("x³ − " + (a * a * a) + " = (x − " + a + ")(x² + ?x + " + (a * a) + ")", a, [2 * a, a * a, 3 * a], "a³ − b³ = (a − b)(a² + ab + b²) → ab = x · " + a + " = " + a + "x"); }
        S = R(4, 12); P = R(2, Math.floor(S * S / 4));
        return Qz("a + b = " + S + ",  a · b = " + P + ".  a² + b² = ?", S * S - 2 * P, [S * S, S * S - P, S * S + 2 * P], "a² + b² = (a + b)² − 2ab = " + (S * S) + " − " + (2 * P) + " = " + (S * S - 2 * P));
      } },

      /* ---------------- Standart shakl a · 10ⁿ ---------------- */
      standart: { n: "Standart shakl a · 10ⁿ", g: 8, q: function (l) {
        l = lv(l); var n, m, k, a, b, c, t = typ(l, { 1: ["p10", "z", "p10"], 2: ["big", "z", "big"], 3: ["kichik", "big", "kichik"], 4: ["mul", "div", "norm", "kichik"], 5: ["mulN", "fiz", "norm", "div"] });
        if (t === "p10") { n = R(2, 7); return Qz("10ⁿ = " + grp(Math.pow(10, n)) + ".  n = ?", n, [n + 1, n - 1, 10 * n], "10ⁿ da n — nollar soni: " + grp(Math.pow(10, n)) + " da " + n + " ta nol → n = " + n); }
        if (t === "z") { c = R(2, 9); n = R(3, 8); return Qz(grp(c * Math.pow(10, n)) + " = " + c + " · 10ⁿ.  n = ?", n, [n + 1, n - 1, c + n], c + " dan keyin " + n + " ta nol → " + c + " · 10" + sup(n)); }
        c = R(11, 99); while (c % 10 === 0) c = R(11, 99);
        var cs = Math.floor(c / 10) + "," + (c % 10);
        if (t === "big") { n = R(3, 8); var big = c * Math.pow(10, n - 1); return Qz(grp(big) + " = " + cs + " · 10ⁿ.  n = ?", n, [n - 1, n + 1, n - 2], "Vergul " + n + " ta xonaga chapga suriladi: " + grp(big) + " = " + cs + " · 10" + sup(n) + "   (nollar soni " + (n - 1) + " — bu n emas!)"); }
        if (t === "kichik") { n = -R(2, 5); var sm = "0," + new Array(-n).join("0") + c; return Qz(sm + " = " + cs + " · 10ⁿ.  n = ?", n, [-n, n + 1, n - 1], "Vergul " + (-n) + " ta xonaga o'ngga suriladi → " + sm + " = " + cs + " · 10" + supN(n) + "   (1 dan kichik son → n manfiy)", true); }
        if (t === "mul") { a = R(1, 4); b = R(1, Math.floor(9 / a)); m = R(2, 6); k = R(2, 6); return Qz("(" + a + " · 10" + sup(m) + ") · (" + b + " · 10" + sup(k) + ") = " + (a * b) + " · 10ⁿ.  n = ?", m + k, [m * k, m + k + 1, m + k - 1], "Sonlar alohida, darajalar alohida: " + a + " · " + b + " = " + (a * b) + ",  10" + sup(m) + " · 10" + sup(k) + " = 10" + sup(m + k) + "   (ko'rsatkichlar qo'shiladi, ko'paytirilmaydi)"); }
        if (t === "div") { b = R(1, 4); a = b * R(1, Math.floor(9 / b)); m = R(5, 9); k = R(2, m - 1); return Qz("(" + a + " · 10" + sup(m) + ") : (" + b + " · 10" + sup(k) + ") = " + (a / b) + " · 10ⁿ.  n = ?", m - k, [m + k, m - k + 1, m - k - 1], a + " : " + b + " = " + (a / b) + ",  10" + sup(m) + " : 10" + sup(k) + " = 10" + sup(m - k) + "   (bo'lganda ko'rsatkichlar ayiriladi)"); }
        if (t === "norm") { m = R(2, 7); return Qz(c + " · 10" + sup(m) + " = " + cs + " · 10ⁿ.  n = ?", m + 1, [m, m - 1, m + 2], c + " = " + cs + " · 10¹ → " + cs + " · 10" + sup(1 + m) + "   (standart shaklda 1 ≤ a < 10)"); }
        if (t === "mulN") { var pr = pick([[5, 4, 2], [5, 6, 3], [4, 5, 2], [2, 5, 1], [8, 5, 4], [6, 5, 3]]); m = R(2, 6); k = R(2, 6); return Qz("(" + pr[0] + " · 10" + sup(m) + ") · (" + pr[1] + " · 10" + sup(k) + ") = " + pr[2] + " · 10ⁿ.  n = ?", m + k + 1, [m + k, m * k, m + k + 2], pr[0] + " · " + pr[1] + " = " + (pr[0] * pr[1]) + " = " + pr[2] + " · 10¹ → " + pr[2] + " · 10" + sup(m + k + 1)); }
        var F = pick([["Yerdan Quyoshgacha 150 000 000 km", "1,5", 8], ["Yorug'lik tezligi 300 000 km/s", "3", 5], ["Yer aholisi ≈ 8 000 000 000 kishi", "8", 9], ["Qum donasi ≈ 0,0005 m", "5", -4], ["Bakteriya ≈ 0,000002 m", "2", -6], ["Bir yilda ≈ 31 500 000 soniya", "3,15", 7], ["Suv molekulasi ≈ 0,0000000003 m", "3", -10]]);
        return Qz(F[0] + " = " + F[1] + " · 10ⁿ.  n = ?", F[2], [-F[2], F[2] + 1, F[2] - 1], F[0] + " = " + F[1] + " · 10" + supN(F[2]) + "   (" + (F[2] > 0 ? "katta son → n musbat" : "1 dan kichik → n manfiy") + ")", true);
      } },

      /* ---------------- Arifmetik va geometrik progressiya (javob doim butun son) ---------------- */
      progressiya: { n: "Progressiyalar", g: 9, q: function (l) {
        l = lv(l); var a1, d, n, b1, q, t = typ(l, { 1: ["d", "nx", "d"], 2: ["an", "nx", "d"], 3: ["dTop", "geo", "an"], 4: ["sum1n", "Sn", "bn"], 5: ["two", "negd", "Sgeo", "Sn"] });
        a1 = R(1, 20); d = R(2, 9);
        if (t === "d") return Qz("Arifmetik progressiya: " + a1 + "; " + (a1 + d) + "; " + (a1 + 2 * d) + "; …  d = ?", d, [a1, a1 + d, d + 1], "d = a" + sb(2) + " − a" + sb(1) + " = " + (a1 + d) + " − " + a1 + " = " + d);
        if (t === "nx") return Qz(a1 + "; " + (a1 + d) + "; " + (a1 + 2 * d) + "; " + (a1 + 3 * d) + "; ?", a1 + 4 * d, [a1 + 4 * d + 1, a1 + 3 * d + 1, a1 + 5 * d], "Har safar +" + d + " → " + (a1 + 3 * d) + " + " + d + " = " + (a1 + 4 * d));
        if (t === "an") { n = R(6, 20); return Qz("a" + sb(1) + " = " + a1 + ",  d = " + d + ".  a" + sb(n) + " = ?", a1 + (n - 1) * d, [a1 + n * d, n * d, a1 * n], "aₙ = a₁ + (n − 1)·d = " + a1 + " + " + (n - 1) + " · " + d + " = " + (a1 + (n - 1) * d) + "   ((n − 1) — n emas!)"); }
        if (t === "dTop") { n = R(4, 9); var an = a1 + (n - 1) * d; return Qz("a" + sb(1) + " = " + a1 + ",  a" + sb(n) + " = " + an + ".  d = ?", d, [(an - a1) % n === 0 ? (an - a1) / n : null, an - a1, d + 1, d - 1], "a" + sb(n) + " = a₁ + " + (n - 1) + "d → " + (n - 1) + "d = " + an + " − " + a1 + " = " + (an - a1) + " → d = " + d); }
        if (t === "geo") { b1 = R(1, 5); q = R(2, 4); return Qz("Geometrik progressiya: " + b1 + "; " + (b1 * q) + "; " + (b1 * q * q) + "; ?", b1 * q * q * q, [b1 * q * q + (b1 * q * q - b1 * q), b1 * q * q + q, b1 * q * q * q * q], "Har safar ×" + q + " → " + (b1 * q * q) + " · " + q + " = " + (b1 * q * q * q) + "   (ayirma emas, bo'linma o'zgarmas)"); }
        if (t === "sum1n") { n = R(10, 40); return Qz("1 + 2 + 3 + … + " + n + " = ?", n * (n + 1) / 2, [n * n / 2 === Math.round(n * n / 2) ? n * n / 2 : null, n * (n - 1) / 2, n * (n + 1)], "Sₙ = (1 + " + n + ") · " + n + " / 2 = " + (n + 1) + " · " + n + " / 2 = " + (n * (n + 1) / 2)); }
        if (t === "Sn") { n = pick([6, 8, 10, 12, 20]); var last = a1 + (n - 1) * d, Sn = (a1 + last) * n / 2; return Qz("a" + sb(1) + " = " + a1 + ",  d = " + d + ".  S" + sb(n) + " = ?", Sn, [(a1 + last) * n, a1 + last, last * n, (a1 + a1 + n * d) * n / 2], "a" + sb(n) + " = " + a1 + " + " + (n - 1) + " · " + d + " = " + last + " → S = (" + a1 + " + " + last + ") · " + n + " / 2 = " + Sn); }
        if (t === "bn") { b1 = R(1, 5); q = pick([2, 2, 3]); n = q === 2 ? R(4, 8) : R(3, 5); var bn = b1 * Math.pow(q, n - 1); return Qz("b" + sb(1) + " = " + b1 + ",  q = " + q + ".  b" + sb(n) + " = ?", bn, [b1 * Math.pow(q, n), b1 * q * (n - 1), b1 + q * (n - 1)], "bₙ = b₁ · qⁿ⁻¹ = " + b1 + " · " + q + sup(n - 1) + " = " + bn); }
        if (t === "two") { var i = R(2, 5), j = i + R(2, 5), kk = j + R(1, 5); d = pick([2, 3, 4, 5, 6, 7, -2, -3]); a1 = R(-5, 25); var ai = a1 + (i - 1) * d, aj = a1 + (j - 1) * d, ak = a1 + (kk - 1) * d; return Qz("a" + sb(i) + " = " + mstr(ai) + ",  a" + sb(j) + " = " + mstr(aj) + ".  a" + sb(kk) + " = ?", ak, [aj + (kk - j) * (aj - ai), a1 + kk * d, ak + d, ak - d], (j - i) + "d = " + mstr(aj) + " − " + neg(ai) + " = " + mstr(aj - ai) + " → d = " + mstr(d) + " → a" + sb(kk) + " = a" + sb(j) + " + " + (kk - j) + "d = " + mstr(ak), true); }
        if (t === "negd") { a1 = R(15, 40); d = -R(2, 6); n = R(6, 15); var v = a1 + (n - 1) * d; return Qz("a" + sb(1) + " = " + a1 + ",  d = " + mstr(d) + ".  a" + sb(n) + " = ?", v, [a1 + n * d, -v, a1 - (n - 1) * d, v + 1], "aₙ = " + a1 + " + " + (n - 1) + " · (" + mstr(d) + ") = " + a1 + " − " + (-(n - 1) * d) + " = " + mstr(v), true); }
        b1 = pick([1, 2, 3]); q = pick([2, 2, 3]); n = q === 2 ? R(4, 7) : R(3, 5); var Sg = b1 * (Math.pow(q, n) - 1) / (q - 1);
        return Qz("b" + sb(1) + " = " + b1 + ",  q = " + q + ".  S" + sb(n) + " = ?", Sg, [b1 * Math.pow(q, n), b1 * Math.pow(q, n - 1), b1 * (Math.pow(q, n) - 1)], "Sₙ = b₁ · (qⁿ − 1) / (q − 1) = " + b1 + " · (" + Math.pow(q, n) + " − 1) / " + (q - 1) + " = " + Sg);
      } },

      /* ---------------- Nisbat va proporsiya ---------------- */
      proporsiya: { n: "Nisbat va proporsiya", g: 6, q: function (l) {
        l = lv(l); var p, q, m1, m2, x, b, c, d, t = typ(l, { 1: ["x4", "simp", "x4"], 2: ["frac", "rev", "simp"], 3: ["dir", "inv", "frac"], 4: ["bol", "mass", "inv"], 5: ["uch", "tez", "bol", "inv"] });
        p = R(1, 6); q = R(2, 9); while (q === p || gcd(p, q) !== 1) { p = R(1, 6); q = R(2, 9); }
        m1 = R(1, 4); m2 = R(2, 6); while (m2 === m1) m2 = R(2, 6);
        if (t === "x4") { x = p * m1; b = q * m1; c = p * m2; d = q * m2; return Qz("x : " + b + " = " + c + " : " + d + ".  x = ?", x, [isInt(b * d / c) ? b * d / c : null, c - d + b > 0 ? c - d + b : null, c, x + 1], "x · " + d + " = " + b + " · " + c + " → x = " + (b * c) + " : " + d + " = " + x + "   (chetki hadlar ko'paytmasi = o'rta hadlar ko'paytmasi)"); }
        if (t === "simp") { var k = R(2, 9); return Qz((p * k) + " : " + (q * k) + " nisbatni qisqartiring", p + " : " + q, [q + " : " + p, (p * 2) + " : " + (q * 2) === (p * k) + " : " + (q * k) ? (p * 3) + " : " + (q * 3) : (p * 2) + " : " + (q * 2), (p + 1) + " : " + (q + 1), "1 : " + q], "Ikkala hadni " + k + " ga bo'lamiz: " + (p * k) + " : " + k + " = " + p + ",  " + (q * k) + " : " + k + " = " + q); }
        if (t === "frac") { var M = R(2, 6); d = q * M; x = p * M; return Qz(p + "/" + q + " = x/" + d + ".  x = ?", x, [d - q + p, M, p * q, x + p], "Maxraj " + q + " → " + d + " (" + M + " marta) → surat ham " + M + " marta: " + p + " · " + M + " = " + x); }
        if (t === "rev") { var M2 = R(2, 6); x = q * M2; return Qz(p + " : " + q + " = " + (p * M2) + " : x.  x = ?", x, [p * M2 + (q - p), p * M2 * p / q === Math.round(p * M2 * p / q) ? p * M2 * p / q : null, q + M2, x + q], p + " · " + M2 + " = " + (p * M2) + " → x = " + q + " · " + M2 + " = " + x); }
        if (t === "dir") { var nar = pick([["kg olma", "ming so'm"], ["daftar", "ming so'm"], ["litr benzin", "ming so'm"], ["metr mato", "ming so'm"]]), pr = R(4, 15), k1 = R(2, 6), k2 = R(k1 + 1, 12); return Qz(k1 + " " + nar[0] + " — " + (pr * k1) + " " + nar[1] + ". " + k2 + " " + nar[0] + " — necha " + nar[1] + "?", pr * k2, [pr * k1 + (k2 - k1), pr * k1 * k2, pr * k2 + pr, pr * (k2 - 1)], "Bittasi: " + (pr * k1) + " : " + k1 + " = " + pr + " → " + pr + " · " + k2 + " = " + (pr * k2) + "   (to'g'ri proporsiya)"); }
        if (t === "inv") {
          var w1, d1, W, cand, w2, tries = 0;
          do { w1 = R(2, 8); d1 = R(3, 12); W = w1 * d1; cand = []; for (var z = 2; z <= 12; z++) if (z !== w1 && W % z === 0) cand.push(z); } while (!cand.length && tries++ < 50);
          w2 = pick(cand); var d2 = W / w2;
          return Qz(w1 + " ishchi ishni " + d1 + " kunda tugatadi. " + w2 + " ishchi necha kunda tugatadi?", d2, [isInt(d1 * w2 / w1) ? d1 * w2 / w1 : null, d1 + (w1 - w2) > 0 ? d1 + (w1 - w2) : null, d1, d2 + 1], "Teskari proporsiya: ishchi × kun o'zgarmas = " + w1 + " · " + d1 + " = " + W + " → " + W + " : " + w2 + " = " + d2 + " kun");
        }
        if (t === "bol") { var mm = R(3, 15), S = (p + q) * mm; return Qz(S + " ni " + p + " : " + q + " nisbatda bo'ling. Katta qismi?", Math.max(p, q) * mm, [isInt(S / 2) ? S / 2 : null, Math.min(p, q) * mm, S - Math.max(p, q), Math.max(p, q) * mm + mm], "Jami " + (p + q) + " ulush: " + S + " : " + (p + q) + " = " + mm + " → katta qism " + Math.max(p, q) + " · " + mm + " = " + (Math.max(p, q) * mm)); }
        if (t === "mass") { var sc = pick([50000, 100000, 200000, 500000]), cm = sc === 50000 ? 2 * R(1, 9) : R(2, 12), km = cm * sc / 100000; return Qz("Masshtab 1 : " + grp(sc) + ". Xaritada " + cm + " cm. Haqiqiy masofa (km)?", km, [km * 10, cm * sc / 100, isInt(km / 10) ? km / 10 : null, cm * sc / 1000], "1 cm → " + grp(sc) + " cm = " + (sc / 100000) + " km → " + cm + " · " + (sc / 100000) + " = " + km + " km"); }
        if (t === "uch") { var r = R(2, 6), mu = R(2, 9), sm = p + q + r, Tt = sm * mu; return Qz("a : b : c = " + p + " : " + q + " : " + r + ",  a + b + c = " + Tt + ".  c = ?", r * mu, [p * mu, q * mu === r * mu ? null : q * mu, Tt - r, r * mu + mu], "Jami " + sm + " ulush: " + Tt + " : " + sm + " = " + mu + " → c = " + r + " · " + mu + " = " + (r * mu)); }
        var v1, t1, v2, cands, tr = 0;
        do { v1 = R(4, 9) * 10; t1 = R(2, 6); cands = []; for (var vv = 30; vv <= 120; vv += 10) if (vv !== v1 && (v1 * t1) % vv === 0) cands.push(vv); } while (!cands.length && tr++ < 50);
        v2 = pick(cands); var t2 = v1 * t1 / v2;
        return Qz(v1 + " km/soat tezlikda yo'l " + t1 + " soat. " + v2 + " km/soat tezlikda necha soat?", t2, [isInt(v2 * t1 / v1) ? v2 * t1 / v1 : null, t1 + 1, t1 > 1 ? t1 - 1 : null, t2 + 1], "Yo'l o'zgarmas: " + v1 + " · " + t1 + " = " + (v1 * t1) + " km → " + (v1 * t1) + " : " + v2 + " = " + t2 + " soat   (tezlik oshsa, vaqt kamayadi)");
      } },

      /* ---------------- Kvadrat tenglama va Viyet teoremasi ---------------- */
      kvTenglama: { n: "Kvadrat tenglama (Viyet)", g: 8, q: function (l) {
        l = lv(l); var r1, r2, s, p, a, b, c, D, t = typ(l, { 1: ["kv", "nol", "kv"], 2: ["yig", "kop", "kv"], 3: ["katta", "yig", "kop"], 4: ["D", "kichik", "katta"], 5: ["q", "p", "c1", "x12", "D"] });
        if (t === "kv") { r1 = R(2, 12); return Qz("x² = " + (r1 * r1) + ",  x > 0.  x = ?", r1, [isInt(r1 * r1 / 2) ? r1 * r1 / 2 : null, r1 + 1, r1 - 1, r1 * r1], "x = √" + (r1 * r1) + " = " + r1 + "   (ikkinchi ildiz −" + r1 + ", lekin x > 0)"); }
        if (t === "nol") { a = R(2, 12); return Qz("x(x − " + a + ") = 0.  Noldan farqli ildiz?", a, [0, a + 1, 2 * a], "Ko'paytma 0 → x = 0 yoki x − " + a + " = 0 → x = " + a); }
        r1 = R(1, 9); r2 = R(1, 9); while (r2 === r1) r2 = R(1, 9);
        if (l >= 3 && R(0, 2) === 0) r1 = -r1;
        s = r1 + r2; p = r1 * r2;
        var eq = kvd(1, -s, p);
        if (t === "yig") return Qz(eq + ".  x₁ + x₂ = ?", s, [-s, p, s + 1], "Viyet: x₁ + x₂ = −b = " + mstr(s) + "   (ildizlar: " + mstr(r1) + " va " + mstr(r2) + ")", true);
        if (t === "kop") return Qz(eq + ".  x₁ · x₂ = ?", p, [-p, s, p + 1], "Viyet: x₁ · x₂ = c = " + mstr(p) + "   (ildizlar: " + mstr(r1) + " va " + mstr(r2) + ")", true);
        if (t === "katta") return Qz(eq + ".  Katta ildiz?", Math.max(r1, r2), [Math.min(r1, r2), s, p, -Math.max(r1, r2)], "x₁ + x₂ = " + mstr(s) + ",  x₁ · x₂ = " + mstr(p) + " → " + mstr(r1) + " va " + mstr(r2) + " → katta: " + mstr(Math.max(r1, r2)), true);
        if (t === "kichik") { r1 = -R(1, 9); r2 = R(1, 9); while (r2 === -r1) r2 = R(1, 9); s = r1 + r2; p = r1 * r2; return Qz(kvd(1, -s, p) + ".  Kichik ildiz?", r1, [-r1, r2, -r2, p], "x₁ + x₂ = " + mstr(s) + ",  x₁ · x₂ = " + mstr(p) + " → ildizlar " + mstr(r1) + " va " + r2 + " → kichigi " + mstr(r1), true); }
        if (t === "D") { a = pick([1, 1, 2, 3]); b = R(-9, 9) || 5; c = R(-9, 9) || -4; D = b * b - 4 * a * c; return Qz(kvd(a, b, c) + ".  D = ?", D, [b * b + 4 * a * c, -D, b * b - 2 * a * c, b - 4 * a * c], "D = b² − 4ac = " + neg(b) + "² − 4 · " + a + " · " + neg(c) + " = " + (b * b) + (4 * a * c > 0 ? " − " + (4 * a * c) : " + " + (-4 * a * c)) + " = " + mstr(D), true); }
        if (t === "q") return Qz("Ildizlari " + mstr(r1) + " va " + mstr(r2) + " bo'lgan x² + px + q = 0 tenglamada q = ?", p, [-p, s, -s], "Viyet: q = x₁ · x₂ = " + neg(r1) + " · " + neg(r2) + " = " + mstr(p), true);
        if (t === "p") return Qz("Ildizlari " + mstr(r1) + " va " + mstr(r2) + " bo'lgan x² + px + q = 0 tenglamada p = ?", -s, [s, p, -p], "Viyet: p = −(x₁ + x₂) = −(" + mstr(s) + ") = " + mstr(-s) + "   (ishorani unutmang!)", true);
        if (t === "c1") { var k = R(2, 9); return Qz("x² − " + (2 * k) + "x + c = 0 bitta ildizga ega.  c = ?", k * k, [2 * k, k, 4 * k * k], "Bitta ildiz → D = 0: " + (2 * k) + "² − 4c = 0 → c = " + (4 * k * k) + " : 4 = " + (k * k) + "   (x² − " + (2 * k) + "x + " + (k * k) + " = (x − " + k + ")²)"); }
        s = R(3, 9); p = R(1, Math.floor(s * s / 4));
        return Qz(kvd(1, -s, p) + " ildizlari x₁, x₂.  x₁² + x₂² = ?", s * s - 2 * p, [s * s + 2 * p, s * s - p, s * s], "x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = " + s + "² − 2 · " + p + " = " + (s * s - 2 * p));
      } },

      /* ---------------- Logarifmlar ---------------- */
      logarifm: { n: "Logarifmlar", g: 10, q: function (l) {
        l = lv(l); var b, k, N, c, t = typ(l, { 1: ["d", "one", "d"], 2: ["d", "lg", "one"], 3: ["neg", "frac", "asos", "d"], 4: ["xos", "ayir", "lgSum", "frac"], 5: ["asosiy", "tengl", "zanj", "ayir"] });
        if (t === "d") { b = pick(l <= 1 ? [2, 3, 10] : [2, 3, 4, 5, 6, 7]); k = b === 2 ? R(2, l <= 1 ? 5 : 8) : b >= 6 ? R(2, 3) : R(2, 4); N = Math.pow(b, k); return Qz(lg(b) + grp(N), k, [isInt(N / b) && N / b !== k ? N / b : null, k + 1, k - 1, b * k], lg(b) + grp(N) + " = " + k + ",  chunki " + b + sup(k) + " = " + grp(N)); }
        if (t === "one") { b = R(2, 9); if (R(0, 1)) return Qz(lg(b) + "1", 0, [1, b, 10], b + "⁰ = 1 → " + lg(b) + "1 = 0"); return Qz(lg(b) + b, 1, [0, b, b * b], b + "¹ = " + b + " → " + lg(b) + b + " = 1"); }
        if (t === "lg") { k = R(1, 5); return Qz("lg " + grp(Math.pow(10, k)), k, [k + 1, Math.pow(10, k - 1) === k ? null : k * 10, k - 1], "lg — o'nli logarifm: 10" + sup(k) + " = " + grp(Math.pow(10, k)) + " → " + k); }
        if (t === "neg") { if (R(0, 1)) { k = R(1, 4); var dd = "0," + new Array(k).join("0") + "1"; return Qz("lg " + dd, -k, [k, -k + 1, -k - 1], "10" + supN(-k) + " = " + dd + " → lg " + dd + " = " + mstr(-k), true); } b = pick([2, 3, 5]); k = b === 2 ? R(1, 5) : R(1, 3); N = Math.pow(b, k); return Qz(lg(b) + "(1/" + N + ")", -k, [k, -k + 1, isInt(N / b) ? -N / b : null], "1/" + N + " = " + b + supN(-k) + " → " + lg(b) + "(1/" + N + ") = " + mstr(-k), true); }
        if (t === "frac") { var F = pick([[4, 2, "1/2"], [8, 2, "1/3"], [9, 3, "1/2"], [27, 3, "1/3"], [16, 2, "1/4"], [4, 8, "3/2"], [9, 27, "3/2"], [16, 8, "3/4"], [8, 4, "2/3"], [25, 5, "1/2"]]); var ws = ["2", "3", "1/2", "1/3", "3/2", "2/3", "4", "1/4"].filter(function (s) { return s !== F[2]; }); return Qz(lg(F[0]) + F[1], F[2], shuffle(ws).slice(0, 4), lg(F[0]) + F[1] + " = " + F[2] + ",  chunki " + F[0] + " ning " + F[2] + "-darajasi " + F[1] + " ga teng"); }
        if (t === "asos") { k = pick([2, 2, 3]); b = R(2, k === 2 ? 9 : 5); N = Math.pow(b, k); return Qz("logₓ " + N + " = " + k + ".  x = ?", b, [isInt(N / k) ? N / k : null, N * k > 999 ? null : N * k, b + 1, Math.pow(k, b) > 999 ? null : Math.pow(k, b)], "x" + sup(k) + " = " + N + " → x = " + b); }
        if (t === "xos") { b = pick([2, 3, 2]); var m = R(1, b === 2 ? 4 : 3), n = R(1, b === 2 ? 4 : 3); return Qz(lg(b) + Math.pow(b, m) + " + " + lg(b) + Math.pow(b, n), m + n, [m * n === m + n ? m + n + 1 : m * n, Math.pow(b, m) + Math.pow(b, n), m + n - 1], lg(b) + "x + " + lg(b) + "y = " + lg(b) + "(xy) = " + lg(b) + Math.pow(b, m + n) + " = " + (m + n)); }
        if (t === "ayir") { b = pick([2, 3, 5]); k = b === 2 ? R(2, 5) : R(2, 3); c = pick([2, 3, 5, 7].filter(function (x) { return x !== b; })); N = Math.pow(b, k) * c; return Qz(lg(b) + N + " − " + lg(b) + c, k, [N - c, isInt(N / c) && N / c < 1000 ? N / c : null, k + 1, k - 1], lg(b) + "x − " + lg(b) + "y = " + lg(b) + "(x/y) = " + lg(b) + (N / c) + " = " + k); }
        if (t === "lgSum") { var P = pick([[25, 4, 2], [50, 2, 2], [20, 5, 2], [250, 4, 3], [125, 8, 3], [2, 500, 3], [40, 25, 3]]); return Qz("lg " + P[0] + " + lg " + P[1], P[2], [P[0] + P[1], P[2] + 1, P[2] - 1, isInt(Math.log10(P[0] + P[1])) ? null : 10 * P[2]], "lg " + P[0] + " + lg " + P[1] + " = lg (" + P[0] + " · " + P[1] + ") = lg " + grp(P[0] * P[1]) + " = " + P[2]); }
        if (t === "asosiy") { b = pick([2, 3, 5, 10]); N = R(2, 9); while (N === b) N = R(2, 9); return Qz(b + "^(" + lg(b).trim() + " " + N + ")", N, [b, b * N, Math.pow(b, N) > 999 ? b + N : Math.pow(b, N)], "Asosiy ayniyat: a^(logₐ x) = x → " + N); }
        if (t === "tengl") { b = pick([2, 3, 5]); k = b === 2 ? R(2, 6) : R(2, 3); N = Math.pow(b, k); if (R(0, 1)) return Qz(lg(b) + "x = " + k + ".  x = ?", N, [b * k, Math.pow(k, b) === N ? N + b : Math.pow(k, b), N / b], "x = " + b + sup(k) + " = " + N); c = R(1, 6); return Qz(lg(b) + "(x − " + c + ") = " + k + ".  x = ?", N + c, [N - c, N, b * k + c], "x − " + c + " = " + b + sup(k) + " = " + N + " → x = " + (N + c)); }
        b = pick([2, 3]); var mid = pick([5, 7, 11].filter(function (x) { return x !== b; })); k = R(2, b === 2 ? 5 : 4); N = Math.pow(b, k);
        return Qz(lg(b) + mid + " · " + lg(mid) + N, k, [k + 1, k - 1, isInt(N / b) ? N / b : null, mid], "logₐ b · log_b c = logₐ c → " + lg(b) + N + " = " + k);
      } },

      /* ---------------- Barmoq bilan ko'paytirish (6–10 va 9 ga) — qo'lda ko'rsatiladi ---------------- */
      barmoqKop: { n: "Barmoq bilan ko'paytirish", g: 3, q: function (l) {
        l = lv(l); var a, b, n, t = typ(l, { 1: ["on1", "on1", "t9L"], 2: ["on", "bir", "t9L", "t9R"], 3: ["bir", "toliq", "t9R", "on"], 4: ["toliq", "t9L", "bir", "toliq9"], 5: ["toliq", "toliq9", "on"] });
        a = R(l <= 2 ? 7 : 6, 9); b = R(l <= 2 ? 7 : 6, 9);
        var ua = a - 5, ub = b - 5, da = 10 - a, db = 10 - b;
        var ex = a + " × " + b + ": ko'tarilgan " + ua + " + " + ub + " = " + (ua + ub) + " o'nlik,  bukilgan " + da + " · " + db + " = " + (da * db) + " → " + ((ua + ub) * 10) + " + " + (da * db) + " = " + (a * b);
        if (t === "on1") return Qz(a + " × " + b + ": chap qo'lda " + a + " − 5, o'ng qo'lda " + b + " − 5 barmoq ko'taring. Jami ?", ua + ub, [], ex);
        if (t === "on") return Qz(a + " × " + b + ": o'nliklar = ko'tarilgan barmoqlar = ?", ua + ub, [], "Har qo'lda (son − 5) ta barmoq: " + ex);
        if (t === "bir") return Qz(a + " × " + b + ": birliklar = bukilgan barmoqlar ko'paytmasi = ?", da * db, [], "Bukilgan: " + da + " va " + db + " → " + ex);
        if (t === "toliq") return Qz(a + " × " + b + " = ?", a * b, [], ex);
        n = R(2, 9);
        var e9 = "9 × " + n + ": chapdan " + n + "-barmoqni buking → chapda " + (n - 1) + ", o'ngda " + (10 - n) + " → " + (9 * n);
        if (t === "t9L") return Qz("9 × " + n + ": chapdan " + n + "-barmoqni buking. Undan chapda nechta barmoq?", n - 1, [], e9);
        if (t === "t9R") return Qz("9 × " + n + ": chapdan " + n + "-barmoqni buking. Undan o'ngda nechta barmoq?", 10 - n, [], e9);
        return Qz("9 × " + n + " = ?", 9 * n, [], e9);
      } },

      /* ---------------- O'lchov birliklari (fizika) ---------------- */
      birlik: { n: "Fizika: o'lchov birliklari", g: 6, q: function (l) {
        l = lv(l); var x, f, t = typ(l, { 1: ["uz", "uz", "vaqt"], 2: ["tes", "vaqt", "uz"], 3: ["tez", "yuza", "tes"], 4: ["hajm", "vaqt2", "yuza", "tez"], 5: ["pref", "hajm", "yuza", "vaqt2"] });
        if (t === "uz") { var U1 = pick([["km", "m", 1000], ["m", "cm", 100], ["kg", "g", 1000], ["m", "mm", 1000], ["t", "kg", 1000], ["l", "ml", 1000], ["cm", "mm", 10]]); x = R(2, 9); return Qz(x + " " + U1[0] + " = ? " + U1[1], x * U1[2], [x * U1[2] / 10, x * U1[2] * 10, x + U1[2]], "1 " + U1[0] + " = " + U1[2] + " " + U1[1] + " → " + x + " · " + U1[2] + " = " + (x * U1[2]) + " " + U1[1]); }
        if (t === "vaqt") { if (R(0, 1)) { x = R(2, 9); return Qz(x + " soat = ? min", x * 60, [x * 100, x * 6, x * 3600], "1 soat = 60 min → " + x + " · 60 = " + (x * 60) + " min   (100 emas!)"); } x = R(2, 9); return Qz(x + " min = ? s", x * 60, [x * 100, x * 10, x * 600], "1 min = 60 s → " + x + " · 60 = " + (x * 60) + " s"); }
        if (t === "tes") {
          if (R(0, 2) === 0) { var hh = pick([0.5, 1.5, 2.5, 3.5]); return Qz((hh * 60) + " min = ? soat", dec(hh, 1), [dec(hh * 60 / 100, 1), dec(hh * 10, 0), dec(hh + 1, 1)], (hh * 60) + " : 60 = " + dec(hh, 1) + " soat   (" + (hh * 60) + " : 100 emas!)"); }
          var U2 = pick([["m", "km", 1000], ["cm", "m", 100], ["g", "kg", 1000], ["mm", "cm", 10]]), x10 = R(11, 99); while (x10 % 10 === 0) x10 = R(11, 99); x = x10 / 10; var big = Math.round(x * U2[2]);
          return Qz(big + " " + U2[0] + " = ? " + U2[1], dec(x, 1), [dec(x * 10, 1), dec(x / 10, 2), dec(big * U2[2], 0)], "1 " + U2[1] + " = " + U2[2] + " " + U2[0] + " → " + big + " : " + U2[2] + " = " + dec(x, 1) + " " + U2[1]);
        }
        if (t === "tez") { var K = pick([[18, 5], [36, 10], [54, 15], [72, 20], [90, 25], [108, 30]]); if (R(0, 1)) return Qz(K[0] + " km/soat = ? m/s", K[1], [K[0] * 3.6 === Math.round(K[0] * 3.6) ? K[0] * 3.6 : null, K[0] * 1000, K[1] * 2, K[0] / 6 === Math.round(K[0] / 6) && K[0] / 6 !== K[1] ? K[0] / 6 : null], K[0] + " km/soat = " + K[0] + " · 1000 m / 3600 s = " + K[0] + " : 3,6 = " + K[1] + " m/s"); return Qz(K[1] + " m/s = ? km/soat", K[0], [K[1] * 60, K[1] * 10, K[0] + 18], K[1] + " m/s · 3,6 = " + K[0] + " km/soat"); }
        if (t === "yuza") { var Y = pick([["m²", "cm²", 100], ["m²", "dm²", 10], ["cm²", "mm²", 10], ["km²", "m²", 1000]]); x = Y[2] === 1000 ? R(1, 3) : R(1, 9); f = Y[2] * Y[2]; return Qz(x + " " + Y[0] + " = ? " + Y[1], x * f, [x * Y[2], x * f * Y[2], x * f / 10], "1 " + Y[0].replace("²", "") + " = " + Y[2] + " " + Y[1].replace("²", "") + " → 1 " + Y[0] + " = " + Y[2] + " · " + Y[2] + " = " + f + " " + Y[1] + " → " + (x * f) + "   (yuzada ko'paytuvchi kvadratga oshadi!)"); }
        if (t === "hajm") { var H = pick([[1, "m³", "l", 1000, "1 m³ = 1000 l"], [2, "m³", "l", 2000, "1 m³ = 1000 l"], [3, "l", "cm³", 3000, "1 l = 1 dm³ = 1000 cm³"], [1, "m³", "dm³", 1000, "1 m = 10 dm → 10³ = 1000"], [1, "m³", "cm³", 1000000, "1 m = 100 cm → 100³ = 1 000 000"], [500, "cm³", "l", "0,5", "1 l = 1000 cm³ → 500 : 1000 = 0,5"], [250, "ml", "l", "0,25", "1 l = 1000 ml → 250 : 1000 = 0,25"]]);
          var wH = typeof H[3] === "number" ? [H[3] / 10, H[3] * 10, H[3] === 1000000 ? 10000 : H[3] / 100] : ["5", "0,05", "50"].concat(H[3] === "0,25" ? ["2,5", "0,025", "25"] : []).filter(function (s) { return s !== H[3]; });
          return Qz(H[0] + " " + H[1] + " = ? " + H[2], H[3], wH, H[4]); }
        if (t === "vaqt2") { var h2 = R(1, 4), mn = R(5, 55); return Qz(h2 + " soat " + mn + " min = ? min", h2 * 60 + mn, [h2 * 100 + mn, h2 + mn, h2 * 60], h2 + " · 60 + " + mn + " = " + (h2 * 60) + " + " + mn + " = " + (h2 * 60 + mn) + " min"); }
        var P = pick([[2, "kW", "W", 2000, "1 kW = 1000 W"], [0.2, "kW", "W", 200, "1 kW = 1000 W → 0,2 · 1000 = 200"], [2.5, "MJ", "kJ", 2500, "1 MJ = 1000 kJ"], [5, "mA", "A", "0,005", "1 mA = 0,001 A → 5 · 0,001 = 0,005"], [3, "kN", "N", 3000, "1 kN = 1000 N"], [450, "g", "kg", "0,45", "1 kg = 1000 g → 450 : 1000 = 0,45"], [1, "g/cm³", "kg/m³", 1000, "1 g/cm³ = 0,001 kg / 0,000001 m³ = 1000 kg/m³"], [1.5, "t", "kg", 1500, "1 t = 1000 kg → 1,5 · 1000 = 1500"], [4, "MW", "kW", 4000, "1 MW = 1000 kW"]]);
        var wP = typeof P[3] === "number" ? [P[3] / 10, P[3] * 10, P[3] / 100] : ["0,5", "0,05", "5", "4,5", "45"].filter(function (s) { return s !== P[3]; }).slice(0, 3);
        return Qz(dec(P[0], 1).replace(/,0$/, "") + " " + P[1] + " = ? " + P[2], P[3], wP, P[4]);
      } }
    };
    for (var k in T) TOPICS[k] = T[k];
  })();
  /* ---- Kengaytma (alohida fayl, masalan ka-yugurish.js): mavzular ---- */
  var EXT = window.KAV_EXT || null;
  if (EXT && EXT.topics) for (var ek in EXT.topics) TOPICS[ek] = EXT.topics[ek];


  // Juftlar (xotira o'yini): [chap, o'ng]
  var PAIRS = {
    kopaytirish: function (l) { l = lv(l); var a = R(2, l <= 1 ? 5 : 9), b = R(2, 9); if (l === 4) a = R(11, 19); if (l >= 5) { a = R(12, 25); b = R(11, 15); } return [a + "×" + b, String(a * b)]; },
    kasrFoiz: function (l) {
      l = lv(l);
      var P1 = [["1/2", "50%"], ["1/4", "25%"], ["3/4", "75%"], ["1/10", "10%"], ["1", "100%"]],
        P2 = [["1/5", "20%"], ["2/5", "40%"], ["3/5", "60%"], ["4/5", "80%"], ["3/10", "30%"], ["7/10", "70%"], ["9/10", "90%"], ["1/20", "5%"]],
        P3 = [["1/8", "12,5%"], ["3/8", "37,5%"], ["5/8", "62,5%"], ["7/8", "87,5%"], ["3/20", "15%"], ["7/20", "35%"], ["9/25", "36%"], ["1/25", "4%"]],
        P4 = [["0,35", "35%"], ["0,08", "8%"], ["1,25", "125%"], ["2", "200%"], ["0,125", "12,5%"], ["1,5", "150%"], ["0,02", "2%"]];
      return pick(l <= 2 ? P1.concat(P2) : l === 3 ? P2.concat(P3) : l === 4 ? P3.concat(P4) : P2.concat(P3, P4));
    },
    tenglama: function (l) {
      l = lv(l); var x = R(1, 12), a = R(2, 6), b = R(1, 9);
      if (l <= 1) return pick([["x + " + a + " = " + (x + a), "x = " + x], ["x − " + a + " = " + x, "x = " + (x + a)]]);
      if (l === 2) return pick([[a + "x = " + (a * x), "x = " + x], ["x : " + a + " = " + x, "x = " + (a * x)]]);
      if (l === 3) return [a + "x + " + b + " = " + (a * x + b), "x = " + x];
      if (l === 4) return pick([[a + "(x − " + b + ") = " + (a * x), "x = " + (x + b)], [a + "x − " + b + " = " + (a * x - b), "x = " + x]]);
      x = -R(1, 9); return [a + "x + " + (b + 10) + " = " + mstr(a * x + b + 10), "x = " + mstr(x)];
    }
  };

  // Qoidalar (kesish, tutish, savat, tartib) — son + shart
  var RULES = {
    tub: { n: "Tub sonlarni kes!", g: 5, gen: function (l) { return R(2, [0, 30, 50, 80, 120, 200][lv(l)]); }, ok: isPrime },
    karra3: { n: "3 ga bo'linuvchilarni kes!", g: 4, gen: function (l) { return R(1, [0, 40, 90, 200, 600, 3000][lv(l)]); }, ok: function (v) { return v % 3 === 0; } },
    kvadratSon: { n: "To'liq kvadratlarni kes!", g: 6, gen: function (l) { l = lv(l); return R(0, 1) ? Math.pow(R(1, Math.min(25, 8 + l * 2)), 2) : R(2, 60 + l * 30); }, ok: function (v) { var r = Math.round(Math.sqrt(v)); return r * r === v; } },
    manfiy: { n: "Faqat manfiy sonlarni ushla!", g: 6, gen: function (l) { l = lv(l); return R(-10 - l * 5, 10 + l * 5); }, ok: function (v) { return v < 0; }, s: mstr },
    karra5: { n: "5 ga karrali sonlarni ushla!", g: 3, gen: function (l) { l = lv(l); return R(0, 1) ? 5 * R(1, 10 + l * 5) : R(1, 50 + l * 25); }, ok: function (v) { return v % 5 === 0; } },
    juft: { n: "Juft sonlarni ushla!", g: 2, gen: function (l) { return R(1, 50 + (l || 2) * 40); }, ok: function (v) { return v % 2 === 0; } }
  };

  // Savat (ikki savatga ajratish)
  var BINS = {
    juftToq: { n: "Juft yoki toq?", g: 2, L: "JUFT", Rt: "TOQ", gen: function (l) { var v = R(1, [0, 30, 100, 1000, 10000, 99999][lv(l)]); return { v: v, s: String(v), left: v % 2 === 0 }; } },
    tubMurakkab: { n: "Tub yoki murakkab?", g: 5, L: "TUB", Rt: "MURAKKAB", gen: function (l) { var v = R(2, [0, 30, 50, 100, 150, 250][lv(l)]); if (lv(l) >= 4 && R(0, 2) === 0) v = pick([51, 57, 87, 91, 111, 119, 133, 143, 161, 169, 187, 209, 221]); return { v: v, s: String(v), left: isPrime(v) }; } },
    yarim: { n: "½ dan kichik yoki katta?", g: 5, L: "< ½", Rt: "> ½", gen: function (l) { l = lv(l); var b = R(3, [0, 8, 12, 20, 30, 40][l]), a = R(1, b - 1); while (2 * a === b) a = R(1, b - 1); if (l >= 4 && R(0, 1)) { a = Math.floor(b / 2) + pick([0, 1]); if (2 * a === b) a++; if (a >= b) a = b - 1; } return { v: a / b, s: a + "/" + b, left: 2 * a < b }; } }
  };

  // Tartiblash (o'sish tartibida bosish)
  var ORDERS = {
    butun: { n: "Kichigidan kattasiga bos!", g: 6, gen: function (l) { l = lv(l); var s = [], N = 4 + Math.min(3, Math.floor(l / 2)); while (s.length < N) { var v = R(-10 - l * 6, 20 + l * 12); if (s.indexOf(v) < 0) s.push(v); } return s.map(function (v) { return { v: v, s: mstr(v) }; }); } },
    kasr: { n: "Kasrlarni o'sish tartibida bos!", g: 5, gen: function (l) { l = lv(l); var s = [], vals = [], N = 3 + Math.min(3, Math.floor(l / 2)); while (s.length < N) { var b = R(2, l <= 2 ? 6 : 12), a = R(1, l <= 2 ? b - 1 : b + 3); var v = a / b; if (vals.some(function (x) { return Math.abs(x - v) < 1e-6; })) continue; vals.push(v); s.push({ v: v, s: a + "/" + b }); } return s; } },
    onli: { n: "O'nli kasrlarni o'sish tartibida bos!", g: 5, gen: function (l) { l = lv(l); var s = [], vals = [], N = 4 + Math.min(3, Math.floor(l / 2)); while (s.length < N) { var v = l <= 2 ? R(1, 99) / 10 : l <= 4 ? R(1, 99) / (R(0, 1) ? 10 : 100) : R(1, 999) / (R(0, 1) ? 100 : 1000); if (vals.indexOf(v) >= 0) continue; vals.push(v); s.push({ v: v, s: String(v).replace(".", ",") }); } return s; } }
  };

  // Son o'qi (nuqtani to'g'ri joyga qo'yish)
  var LINES = {
    onli: { n: "O'nli kasrlar", g: 5, min: 0, max: 10, tol: 0.25, ticks: 1, gen: function (l) { l = lv(l); var v = l <= 2 ? R(1, 99) / 10 : R(101, 999) / 100; if (l >= 4 && R(0, 1)) v = R(1, 99) / 10 + 0.05; v = Math.round(v * 100) / 100; return { v: v, s: String(v).replace(".", ",") }; } },
    kasr: { n: "Oddiy kasrlar", g: 5, min: 0, max: 2, tol: 0.06, ticks: 0.25, gen: function (l) { l = lv(l); var b = pick([[2, 4], [2, 3, 4], [3, 4, 5, 8], [3, 5, 6, 8, 10], [3, 6, 7, 8, 9, 10]][l - 1]), a = R(1, 2 * b - 1); return { v: a / b, s: a + "/" + b }; } },
    ildiz: { n: "Ildizlarni baholash", g: 8, min: 0, max: 10, tol: 0.25, ticks: 1, gen: function (l) { var M = [0, 30, 50, 70, 99, 99][lv(l)], n = R(2, M), r = Math.sqrt(n); while (Math.abs(r - Math.round(r)) < 1e-9) { n = R(2, M); r = Math.sqrt(n); } return { v: r, s: "√" + n }; } },
    // Modul: −10…10 oralig'i. q — maxsus savol matni, t — to'g'ri javob yorlig'i, e — xatodan keyingi tushuntirish
    modul: { n: "Modul son o'qida", g: 6, min: -10, max: 10, tol: 0.3, ticks: 1, gen: function (l) {
      l = lv(l); var n, a, b, x, v, ng, t = typ(l, { 1: ["abs", "abs", "minus"], 2: ["ayir", "minus", "ikki", "abs"], 3: ["tengl", "dec", "ayir", "ikki"], 4: ["tengl2", "masofa", "tengl", "dec"], 5: ["orta", "kx", "tengl2", "masofa"] });
      function xm(c) { return "x" + (c > 0 ? " − " + c : c < 0 ? " + " + (-c) : ""); }   // x − c ni chiroyli yozish
      if (t === "abs") { n = R(1, 9); return { v: n, s: "|−" + n + "|", t: "|−" + n + "| = " + n, e: "|−" + n + "| = " + n + " — modul 0 dan masofa, u doim musbat yoki nol" }; }
      if (t === "minus") { n = R(1, 9); if (R(0, 1)) return { v: -n, s: "−|" + n + "|", t: "−|" + n + "| = −" + n, e: "Avval modul: |" + n + "| = " + n + ", keyin oldidagi minus → −" + n }; return { v: -n, s: "−|−" + n + "|", t: "−|−" + n + "| = −" + n, e: "|−" + n + "| = " + n + " → oldidagi minus → −" + n + "   (minuslar «qisqarmaydi»!)" }; }
      if (t === "ayir") { a = R(0, 9); b = R(0, 9); while (b === a) b = R(0, 9); var lo = Math.min(a, b), hi = Math.max(a, b); return { v: hi - lo, s: "|" + lo + " − " + hi + "|", t: "|" + lo + " − " + hi + "| = " + (hi - lo), e: lo + " − " + hi + " = −" + (hi - lo) + " → |−" + (hi - lo) + "| = " + (hi - lo) }; }
      if (t === "ikki") { a = R(1, 9); b = R(1, 9); v = a - b; return { v: v, s: "|−" + a + "| − |" + b + "|", t: "|−" + a + "| − |" + b + "| = " + mstr(v), e: "|−" + a + "| = " + a + ",  |" + b + "| = " + b + " → " + a + " − " + b + " = " + mstr(v) }; }
      if (t === "tengl") { n = R(1, 9); ng = R(0, 1); v = ng ? -n : n; return { v: v, s: "|x| = " + n, q: "|x| = " + n + " va x " + (ng ? "< 0" : "> 0") + ".  x ni son o'qida ko'rsating", t: "x = " + mstr(v), e: "|x| = " + n + " → x = " + n + " yoki x = −" + n + ";  shart x " + (ng ? "< 0" : "> 0") + " → x = " + mstr(v) }; }
      if (t === "dec") { n = R(1, 9) + 0.5; ng = R(0, 1); v = ng ? -n : n; var ds = String(n).replace(".", ","); return { v: v, s: (ng ? "−|−" : "|−") + ds + "|", t: (ng ? "−|−" : "|−") + ds + "| = " + mstr(v).replace(".", ","), e: "|−" + ds + "| = " + ds + (ng ? " → oldidagi minus → −" + ds : "") }; }
      if (t === "tengl2") { a = R(1, 4) * pick([1, -1]); b = R(2, 6); var o = R(0, 1); x = o ? a + b : a - b; return { v: x, s: "|" + xm(a) + "| = " + b, q: "|" + xm(a) + "| = " + b + " va x " + (o ? "> " : "< ") + mstr(a) + ".  x ni son o'qida ko'rsating", t: "x = " + mstr(x), e: xm(a) + " = " + (o ? b : "−" + b) + " → x = " + mstr(a) + (o ? " + " : " − ") + b + " = " + mstr(x) + "   (" + mstr(a) + " dan " + b + " birlik " + (o ? "o'ngda" : "chapda") + ")" }; }
      if (t === "masofa") { a = -R(1, 5); b = R(1, 10 + a); return { v: b - a, s: "|" + b + " − (" + mstr(a) + ")|", q: mstr(a) + " va " + b + " nuqtalar orasidagi masofani son o'qida ko'rsating", t: "|" + b + " − (" + mstr(a) + ")| = " + (b - a), e: "Masofa = |" + b + " − (" + mstr(a) + ")| = |" + b + " + " + (-a) + "| = " + (b - a) }; }
      if (t === "orta") { a = R(-9, 1); b = R(a + 2, 9); v = (a + b) / 2; var vs = mstr(v).replace(".", ","); return { v: v, s: "|" + xm(a) + "| = |" + xm(b) + "|", q: "|" + xm(a) + "| = |" + xm(b) + "|.  x ni son o'qida ko'rsating", t: "x = " + vs, e: "x — " + mstr(a) + " va " + b + " dan teng uzoqlikda, ya'ni o'rtasi: (" + mstr(a) + " + " + b + ") / 2 = " + vs }; }
      x = -R(1, 4); a = R(1, 8); b = a - 2 * x;
      return { v: x, s: "|2x − " + a + "| = " + b, q: "|2x − " + a + "| = " + b + " va x < 0.  x ni son o'qida ko'rsating", t: "x = " + mstr(x), e: "x < 0 → 2x − " + a + " = −" + b + " → 2x = " + mstr(a - b) + " → x = " + mstr(x) + "   (ikkinchi ildiz " + ((a + b) / 2).toString().replace(".", ",") + " > 0)" };
    } }
  };

  // Burchak
  var ANGLES = {
    burchak: { n: "Burchak yasash", g: 5, gen: function (l) {
      l = lv(l); var a, x, y;
      if (l === 1) { a = pick([30, 45, 60, 90, 120, 135, 150]); return { a: a, q: a + "° burchak yasang" }; }
      if (l === 2) { a = pick([15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165]); return { a: a, q: a + "° burchak yasang" }; }
      if (l === 3) { a = R(1, 17) * 10; return { a: a, q: a + "° burchak yasang" }; }
      if (l === 4) {
        var t = R(0, 2);
        if (t === 0) { x = R(2, 16) * 10; return { a: 180 - x, q: "Qo'shni burchagi " + x + "° bo'lgan burchakni yasang", e: "Qo'shni burchaklar yig'indisi 180°: 180° − " + x + "° = " + (180 - x) + "°" }; }
        if (t === 1) { x = R(1, 8) * 10; return { a: 90 - x, q: x + "° ni to'g'ri burchakkacha to'ldiruvchi burchakni yasang", e: "To'ldiruvchi burchaklar yig'indisi 90°: 90° − " + x + "° = " + (90 - x) + "°" }; }
        var f = pick([[1, 3, 180, "yoyiq"], [2, 3, 180, "yoyiq"], [1, 2, 90, "to'g'ri"], [1, 3, 90, "to'g'ri"], [2, 3, 90, "to'g'ri"], [3, 4, 180, "yoyiq"]]);
        a = f[2] * f[0] / f[1]; return { a: a, q: f[3][0].toUpperCase() + f[3].slice(1) + " burchakning " + f[0] + "/" + f[1] + " qismini yasang", e: f[3] + " burchak " + f[2] + "° → " + f[2] + "° · " + f[0] + "/" + f[1] + " = " + a + "°" };
      }
      var t5 = R(0, 2);
      if (t5 === 0) { x = R(3, 9) * 10; y = R(2, 14 - x / 10) * 10; a = 180 - x - y; if (a <= 0 || a >= 180) { x = 50; y = 70; a = 60; } return { a: a, q: "Uchburchakda ikki burchak " + x + "° va " + y + "°. Uchinchisini yasang", e: "Uchburchak burchaklari yig'indisi 180°: 180° − " + x + "° − " + y + "° = " + a + "°" }; }
      if (t5 === 1) { var h = pick([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]); a = h <= 6 ? 30 * h : 360 - 30 * h; return { a: a, q: "Soat " + h + ":00 da strelkalar orasidagi burchakni yasang", e: "Har soat oralig'i 360° : 12 = 30° → " + (h <= 6 ? h : 12 - h) + " · 30° = " + a + "°" }; }
      var pg = pick([[3, "uchburchak", 60], [4, "kvadrat", 90], [6, "oltiburchak", 120], [5, "beshburchak", 108], [12, "o'n ikkiburchak", 150]]);
      return { a: pg[2], q: "Muntazam " + pg[1] + "ning ichki burchagini yasang", e: "Ichki burchak = 180° · (n − 2) / n = 180° · " + (pg[0] - 2) + " / " + pg[0] + " = " + pg[2] + "°" };
    } },
    trig: { n: "Trigonometriya", g: 9, gen: function (l) {
      l = lv(l);
      var T1 = [{ a: 30, q: "sin α = 1/2" }, { a: 60, q: "cos α = 1/2" }, { a: 90, q: "sin α = 1" }, { a: 0, q: "sin α = 0" }, { a: 45, q: "sin α = √2/2" }, { a: 60, q: "sin α = √3/2" }, { a: 30, q: "cos α = √3/2" }],
        T2 = [{ a: 45, q: "tg α = 1" }, { a: 60, q: "tg α = √3" }, { a: 30, q: "tg α = √3/3" }, { a: 45, q: "ctg α = 1" }, { a: 30, q: "ctg α = √3" }, { a: 90, q: "cos α = 0" }],
        T3 = [{ a: 120, q: "cos α = −1/2" }, { a: 135, q: "tg α = −1" }, { a: 150, q: "cos α = −√3/2" }, { a: 135, q: "cos α = −√2/2" }, { a: 120, q: "tg α = −√3" }, { a: 150, q: "tg α = −√3/3" }],
        T4 = [{ a: 60, q: "sin α = cos 30°" }, { a: 30, q: "cos α = sin 60°" }, { a: 45, q: "sin α = cos α" }, { a: 60, q: "tg α = ctg 30°" }, { a: 120, q: "cos α = −sin 30°" }],
        T5 = [{ a: 60, q: "2·cos α = 1" }, { a: 45, q: "√2·cos α = 1" }, { a: 135, q: "tg α + 1 = 0" }, { a: 120, q: "2·cos α + 1 = 0" }, { a: 30, q: "√3·tg α = 1" }, { a: 150, q: "2·cos α + √3 = 0" }, { a: 90, q: "sin²α = 1" }];
      return pick([T1, T1.concat(T2), T2.concat(T3), T3.concat(T4), T4.concat(T5)][l - 1]);
    } }
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
    burchak: { e: "📐", n: "Burchak", how: "Ikki qo'lning ko'rsatkich barmoqlari bilan chiziq hosil qiling (bitta qo'l bo'lsa — ko'rsatkich barmoq yo'nalishi). Yoki javobni yozing / 🎤 ayting. Chiziq gorizontal bilan kerakli burchak hosil qilsin va 3 soniya ushlab turing — 3·2·1 sanaladi va javob qabul qilinadi." }
  };

  if (EXT && EXT.mech) for (var em in EXT.mech) MECH[em] = EXT.mech[em];
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
    { t: "Chat-bot: qisqa ko'paytirish", m: "pufak", k: "qisqaKop", th: "terminal", i: "Anonim chat" },
    { t: "Saturn: standart shakl", m: "orbita", k: "standart", th: "saturn", i: "Saturn 3D" },
    { t: "Qo'l-qurol: ko'paytirish", m: "nishon", k: "kopaytirish", th: "olov", i: "Hand Tracking Gun Game" },
    { t: "Nur bilan chizish: karralilar", m: "tutash", k: "karrali", th: "neon", i: "3D nuqtali rasm" },
    { t: "Xaker avatar: ildizlar", m: "barmoq", k: "ildizKichik", th: "terminal", i: "Xaker koder avatar" },
    { t: "Neon klaviatura: progressiya", m: "pianino", k: "progressiya", th: "neon", i: "Neon skelet klaviatura" },
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
    { t: "Neon pufak: proporsiya", m: "pufak", k: "proporsiya", th: "neon", i: "Neon Hand Interaction" },
    { t: "Olov uchqunlari: kvadrat tenglama", m: "yomgir", k: "kvTenglama", th: "olov", i: "Realistic Fire Spark" },
    { t: "AR zarralar: yuzalar", m: "pufak", k: "yuza", th: "zarra", i: "Zarrachalar AR" },
    { t: "Kvant galaktika: logarifmlar", m: "orbita", k: "logarifm", th: "galaktika", i: "Quantum Galaxy Pro" },
    { t: "Neon pianino: ketma-ketlik", m: "pianino", k: "ketma", th: "neon", i: "AI Neon Piano" },
    { t: "Neon yurak: barmoq bilan ko'paytirish", m: "barmoq", k: "barmoqKop", th: "yurak", i: "3D Neon yurak" },
    { t: "Oltin skelet: Rim raqamlari", m: "pufak", k: "rim", th: "oltin", i: "Realistic 2D Skeleton — Gold" },
    { t: "Ko'k skelet: kasrlarni tartibla", m: "tartib", k: "kasr", th: "saturn", i: "Realistic 2D Skeleton — Blue" },
    { t: "Kamalak: ½ bilan taqqosla", m: "savat", k: "yarim", th: "kamalak", i: "Kamalak — sezgir tutish" },
    { t: "Rangli lazer: darajalar", m: "nishon", k: "daraja", th: "kamalak", i: "Neon Multi-Color Laser" },
    { t: "Yurak juftlari: kasr = foiz", m: "xotira", k: "kasrFoiz", th: "yurak", i: "Neon yurak animatsiyasi" },
    { t: "Galaktika matni: EKUK", m: "pufak", k: "ekuk", th: "galaktika", i: "3D Galaxy Text Morph" },
    { t: "3D trigonometriya", m: "burchak", k: "trig", th: "zarra", i: "3D qo'l kuzatuvi effekti" },
    { t: "Oltin Saturn: yaxlitlash", m: "orbita", k: "yaxlitlash", th: "oltin", i: "Oltin Saturn" },
    { t: "Neon chang: kvadrat sonlar", m: "kesish", k: "kvadratSon", th: "zarra", i: "Neon chang zarrachalari" },
    { t: "AG: modul son o'qida", m: "sonoq", k: "modul", th: "neon", i: "AG" },
    { t: "Kosmik sayohat: ildiz son o'qida", m: "sonoq", k: "ildiz", th: "galaktika", i: "Kinematik 3D" },
    { t: "Zarra matn: tenglama juftlari", m: "xotira", k: "tenglama", th: "zarra", i: "Particle Text Effect" },
    { t: "Final duel: o'nli kasrlar tartibi", m: "tartib", k: "onli", th: "kamalak", i: "Final", duel: 1 },
    { t: "Sport mashina poygasi", m: "poyga", k: "poyga", th: "olov", i: "Poyga" },
    { t: "Grafik doskasi", m: "grafik", k: "grafik", th: "neon", i: "Grafik doska" },
    /* ---- Fizika o'yinlari (50–59) ---- */
    { t: "Raketa: tezlik v = s/t", m: "pufak", k: "tezlik", th: "galaktika", i: "Fizika — kinematika", fan: "fizika" },
    { t: "Yo'l: o'lchov birliklari", m: "yomgir", k: "birlik", th: "neon", i: "Fizika — birliklar", fan: "fizika" },
    { t: "Suv va temir: zichlik", m: "orbita", k: "zichlik", th: "suv", i: "Fizika — zichlik", fan: "fizika" },
    { t: "Nyuton: kuch F = m·a", m: "nishon", k: "kuch", th: "olov", i: "Fizika — dinamika", fan: "fizika" },
    { t: "Elektr zanjiri: Om qonuni", m: "pianino", k: "om", th: "terminal", i: "Fizika — elektr", fan: "fizika" },
    { t: "Mexanik ish A = F·s", m: "orbita", k: "ish", th: "saturn", i: "Fizika — ish", fan: "fizika" },
    { t: "Quvvat P = A/t", m: "pufak", k: "quvvat", th: "zarra", i: "Fizika — quvvat", fan: "fizika" },
    { t: "Bosim p = F/S", m: "pianino", k: "bosim", th: "tutun", i: "Fizika — bosim", fan: "fizika" },
    { t: "Og'irlik kuchi P = m·g", m: "yomgir", k: "ogirlik", th: "olov", i: "Fizika — og'irlik", fan: "fizika" },
    { t: "Issiqlik miqdori Q = cmΔt", m: "nishon", k: "issiqlik", th: "kamalak", i: "Fizika — issiqlik", fan: "fizika" }
  ];
  if (EXT && EXT.games) GAMES.push.apply(GAMES, EXT.games);
  var SRC = { pufak: TOPICS, yomgir: TOPICS, orbita: TOPICS, nishon: TOPICS, pianino: TOPICS, barmoq: TOPICS, kesish: RULES, tutish: RULES, savat: BINS, tartib: ORDERS, sonoq: LINES, burchak: ANGLES, tutash: CHAINS, poyga: Object.assign({}, TOPICS, { poyga: { n: "Qo'shish va ayirish (tezlik)" } }), grafik: { grafik: { n: "Funksiya grafiklari" } } };
  if (EXT && EXT.src) for (var es in EXT.src) SRC[es] = EXT.src[es];
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


  /* ======================= YUTUQLAR: yulduzlar, nishonlar, kunlik topshiriqlar ======================= */
  // Har bir o'quvchi (akkaunt) uchun alohida saqlanadi — sinfdagi umumiy kompyuterda ham aralashmaydi
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var BADGES = [
    ["ilk", "🌱", "Birinchi qadam", "Birinchi o'yinni oxirigacha o'ynang"],
    ["s10", "🔥", "Olov seriya", "10 ta ketma-ket to'g'ri javob"],
    ["s20", "☄️", "Yonar yulduz", "20 ta ketma-ket to'g'ri javob"],
    ["boss", "👑", "Boss ovchisi", "Birinchi bossni yenging"],
    ["boss3", "🐉", "Ajdar yenguvchi", "Bitta o'yinda 3 ta boss"],
    ["lv5", "🏔", "Cho'qqi", "5-darajaga chiqing"],
    ["aniq", "🎯", "Mergan", "Xatosiz o'yin (kamida 10 ta javob)"],
    ["tez", "⚡", "Chaqmoq", "Bitta o'yinda 5 ta javob 3 soniyadan tez"],
    ["st3", "⭐", "Uch yulduz", "Birinchi marta ★★★ oling"],
    ["usta", "📚", "Mavzu ustasi", "5 xil o'yinda ★★★"],
    ["o10", "🌍", "Sayyoh", "10 xil o'yin o'ynang"],
    ["o30", "🏆", "Kolleksioner", "30 xil o'yin o'ynang"],
    ["fiz", "⚛️", "Yosh fizik", "5 ta fizika o'yinida ★★ va undan yuqori"],
    ["kam", "✋", "Sehrgar qo'l", "Kamera bilan 10 ta o'yin"],
    ["kun3", "📅", "Intizomli", "3 kun ketma-ket kunlik topshiriqlar"],
    ["kun7", "🗓", "Temir iroda", "7 kun ketma-ket kunlik topshiriqlar"]
  ];
  var PR = (function () {
    function uid() { var u = window.__kaCur; if (!u) try { u = localStorage.getItem("ka.joriy.v1"); } catch (e) {} return u || "mehmon"; }
    function key() { return "kav.p." + uid(); }
    function load() { var d; try { d = JSON.parse(localStorage.getItem(key()) || "{}") || {}; } catch (e) { d = {}; } d.st = d.st || {}; d.b = d.b || {}; d.pl = d.pl || {}; d.cam = d.cam || 0; return d; }
    function save(d) { try { localStorage.setItem(key(), JSON.stringify(d)); } catch (e) {} }
    function day(off) { var t = new Date(Date.now() + (off || 0) * 864e5); return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(); }
    function seed(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }
    var POOL = [
      { id: "tj", n: function (k) { return k + " ta to'g'ri javob bering"; }, k: [20, 30, 40] },
      { id: "oy", n: function (k) { return k + " xil o'yin o'ynang"; }, k: [2, 3] },
      { id: "y2", n: function () { return "Bitta o'yinda ★★ yoki ★★★ oling"; }, k: [1] },
      { id: "bs", n: function (k) { return "Bossni " + k + " marta yenging"; }, k: [1, 2, 3] },
      { id: "sr", n: function (k) { return k + " ta ketma-ket to'g'ri javob"; }, k: [5, 7, 10] },
      { id: "fz", n: function () { return "Fizika o'yinini o'ynang"; }, k: [1] },
      { id: "lv", n: function (k) { return k + "-darajaga chiqing"; }, k: [3, 4] },
      { id: "km", n: function () { return "Kamera bilan (qo'l bilan) o'ynang"; }, k: [1] },
      { id: "ko", n: function (k, g) { return "Kun o'yini: «" + g.t + "»"; }, k: [1] }
    ];
    function tasks(dstr) {
      var rnd = seed("kav" + (dstr || day())), pool = POOL.slice(), out = [];
      while (out.length < 3) { var i = Math.floor(rnd() * pool.length), t = pool.splice(i, 1)[0], k = t.k[Math.floor(rnd() * t.k.length)], g = GAMES[Math.floor(rnd() * GAMES.length)]; out.push({ id: t.id, k: k, g: g.id, n: t.n(k, g) }); }
      return out;
    }
    function dayData(d) { var t = day(); if (!d.dy || d.dy.d !== t) d.dy = { d: t, v: { tj: 0, oy: {}, y2: 0, bs: 0, sr: 0, fz: 0, lv: 0, km: 0, ko: {} }, done: {}, all: 0 }; return d.dy; }
    function prog(dy, t) { var v = dy.v; if (t.id === "oy") return Object.keys(v.oy).length; if (t.id === "ko") return v.ko[t.g] ? 1 : 0; return v[t.id] || 0; }
    function starsSum(d) { var s = 0; for (var k in d.st) s += d.st[k]; return s; }
    function rows(newly) {
      var d = load(), dy = dayData(d);
      return tasks().map(function (t) { var p = Math.min(t.k, prog(dy, t)), ok = dy.done[t.id]; return '<div class="' + (ok ? "ok" : "") + '"><span>' + (ok ? "✅ " : "▫️ ") + (t.id === "ko" ? '<a href="virtual-' + t.g + '.html" style="color:inherit">' + esc(t.n) + "</a>" : esc(t.n)) + "</span><span>" + p + "/" + t.k + (newly && newly.some(function (x) { return x.id === t.id; }) ? " · +5 🪙" : "") + "</span></div>"; }).join("");
    }
    return { load: load, save: save, day: day, tasks: tasks, dayData: dayData, prog: prog, starsSum: starsSum, rows: rows };
  })();
  function starsHTML(n, big) { var o = ""; for (var i = 1; i <= 3; i++) o += i <= n ? "<b>⭐</b>" : "<i>⭐</i>"; return big ? '<div class="kv-stars">' + o + "</div>" : o; }
  // Ro'yxat sahifasi (virtual.html) uchun: yulduzlar, kunlik topshiriqlar va nishonlar paneli
  function hubHTML() {
    var d = PR.load(), nb = BADGES.filter(function (b) { return d.b[b[0]]; }).length;
    return '<style>.kvp{background:linear-gradient(135deg,rgba(124,155,255,.12),rgba(94,230,199,.08));border:1px solid rgba(124,155,255,.35);border-radius:18px;padding:14px 16px;margin:14px 0;color:#dfe8ff}' +
      '.kvp-h{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:15px}.kvp-h b{font-size:18px;color:#fff}.kvp-h span{font-weight:800;color:#ffd479}' +
      '.kvp-g{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}@media(max-width:720px){.kvp-g{grid-template-columns:1fr}}' +
      '.kvp-d{background:rgba(0,0,0,.25);border-radius:12px;padding:10px 12px;font-size:14px}.kvp-d>b{display:block;margin-bottom:6px;color:#fff}.kvp-d div{display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px dashed #ffffff18}.kvp-d div.ok{color:#5ee67a}.kvp-d small{display:block;margin-top:6px;color:#9fb0d0;font-size:12px}' +
      '.kvp-b{display:flex;flex-wrap:wrap;gap:6px;align-content:flex-start}.kvp-x{display:inline-flex;align-items:center;gap:5px;font-size:12px;border:1px solid #33456e;border-radius:999px;padding:4px 9px;color:#7f8fb0;filter:grayscale(1);opacity:.6}.kvp-x.on{filter:none;opacity:1;color:#ffe9b0;border-color:#ffd479;background:rgba(255,212,121,.1)}.kvp-x em{font-style:normal;font-size:15px}</style>' +
      '<div class="kvp"><div class="kvp-h"><b>🏅 Mening yutuqlarim</b><span>⭐ ' + PR.starsSum(d) + " / " + GAMES.length * 3 + " &nbsp;·&nbsp; 🏅 " + nb + " / " + BADGES.length + "</span></div>" +
      '<div class="kvp-g"><div class="kvp-d"><b>📅 Bugungi topshiriqlar</b>' + PR.rows() + "<small>Har bir topshiriq +5 🪙, uchalasi bajarilsa yana +10 🪙 (akkauntga kirgan bo'lsangiz)</small></div>" +
      '<div class="kvp-b">' + BADGES.map(function (b) { return '<span class="kvp-x' + (d.b[b[0]] ? " on" : "") + '" title="' + esc(b[3]) + '"><em>' + b[1] + "</em>" + esc(b[2]) + "</span>"; }).join("") + "</div></div></div>";
  }
  window.KAV = { GAMES: GAMES, MECH: MECH, THEMES: THEMES, PR: PR, BADGES: BADGES, hubHTML: hubHTML, starsHTML: starsHTML, stars: function (id) { return PR.load().st[id] || 0; } };
  if (window.KAV_HUB || !window.KAV_ID) return;

  /* =================================================================
   *                         O'YIN DVIGATELI
   * ================================================================= */
  var G = GAMES[(window.KAV_ID | 0) - 1] || GAMES[0];
  var TH = THEMES[G.th] || THEMES.neon;
  var MK = MECH[G.m];
  var FONT = TH.mono ? "'JetBrains Mono','Fira Code',Consolas,monospace" : "'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif";
  var LS_BEST = "kav.best." + G.id;
  var CFG = { hands: 2, duel: false, video: true, time: 60, racers: 1, diff: 2, gmode: "vazifa", sinf: 0 };
  try { var sv = JSON.parse(localStorage.getItem("kav.cfg") || "{}"); for (var k in sv) if (k in CFG && k !== "time") CFG[k] = sv[k]; } catch (e) {}
  if (G.m === "barmoq" && CFG.hands < 2) CFG.hands = 2;
  if (G.duel) CFG.duel = true;
  if (G.m === "grafik") CFG.time = 180;
  if (MK.time) CFG.time = MK.time;
  if (MK.hands) CFG.hands = MK.hands;

  /* ----------------------- DOM ----------------------- */
  var css = [
    "*{box-sizing:border-box}html,body{margin:0;height:100%;overflow:hidden;background:" + TH.bg + ";color:#eef2ff;font-family:" + FONT + ";touch-action:none;-webkit-user-select:none;user-select:none}",
    "#kv-c{position:fixed;inset:0;width:100%;height:100%;display:block}",
    "#kv-v{position:fixed;width:2px;height:2px;opacity:0;pointer-events:none;left:0;top:0}",
    ".kv-hud{position:fixed;top:0;left:0;right:0;display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;padding:10px 14px;gap:10px;pointer-events:none;z-index:5}",
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
    ".kv-seg{display:flex;gap:4px;flex-wrap:wrap}.kv-seg button{flex:1 1 auto;min-width:34px;white-space:nowrap;border:1px solid #33456e;background:transparent;color:#cfe;border-radius:8px;padding:6px 4px;font:inherit;font-weight:700;cursor:pointer}",
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
    ".kv-ans{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:8;display:flex;gap:6px;align-items:center;background:rgba(11,18,32,.82);border:1px solid rgba(124,155,255,.45);border-radius:999px;padding:6px 8px;backdrop-filter:blur(6px)}",
    ".kv-ans input{width:min(44vw,220px);background:transparent;border:0;outline:0;color:#fff;font:800 18px/1.2 ui-monospace,monospace;padding:6px 10px}",
    ".kv-ans input.ok{color:#5ee67a}.kv-ans input.bad{color:#ff6b6b}",
    ".kv-ans button{border:0;border-radius:999px;width:40px;height:40px;font-size:18px;cursor:pointer;background:#1a2540;color:#fff}",
    ".kv-ans button#kv-aok{background:#5ee6c7;color:#06231d;font-weight:900}",
    ".kv-ans button#kv-mic.on{background:#ff5c7a;animation:kvpulse 1s infinite}",
    "@keyframes kvpulse{50%{box-shadow:0 0 0 8px rgba(255,92,122,.25)}}",
    ".kv-banner{position:fixed;left:50%;top:42%;transform:translate(-50%,-50%) scale(.6);opacity:0;font-weight:900;font-size:clamp(26px,6vw,58px);text-shadow:0 0 24px currentColor,0 4px 0 #000;z-index:7;pointer-events:none;transition:transform .3s cubic-bezier(.2,1.6,.4,1),opacity .3s;white-space:normal;text-align:center;max-width:92vw;line-height:1.12}",
    ".kv-banner.on{opacity:1;transform:translate(-50%,-50%) scale(1)}",
    ".kv-rep{display:inline-block;font-size:.45em;vertical-align:middle;background:#ffd479;color:#000;border-radius:999px;padding:3px 10px;text-shadow:none;margin-right:6px}",
    ".kv-miss{text-align:left;background:rgba(255,255,255,.04);border:1px solid #3a2a40;border-radius:12px;padding:10px 12px;margin:10px 0;max-height:190px;overflow:auto;font-size:14px;color:#e8ecff}",
    ".kv-miss div{padding:4px 0;border-bottom:1px dashed #ffffff18}.kv-miss div:last-child{border:0}",
    ".kv-q.boss{color:#ffd479;text-shadow:0 0 22px #ff9100,0 0 6px #ff5c00;animation:kvboss 1s ease-in-out infinite}@keyframes kvboss{50%{filter:brightness(1.4)}}",
    ".kv-pill.lv{border-color:#5ee6c7}.kv-pill.cb{background:linear-gradient(90deg,#ff9100,#ff3d71);border-color:#ffd479;color:#fff}.kv-pill.fz{background:#0b3b5a;border-color:#7fdcff;color:#bff1ff}",
    ".kv-stars{font-size:44px;letter-spacing:6px;margin:2px 0 4px}.kv-stars i,.kv-st i{font-style:normal;filter:grayscale(1) brightness(.4)}.kv-stars b{display:inline-block;animation:kvst .55s cubic-bezier(.2,1.8,.4,1) both}.kv-stars b:nth-child(2){animation-delay:.25s}.kv-stars b:nth-child(3){animation-delay:.5s}@keyframes kvst{from{transform:scale(0) rotate(-120deg)}to{transform:none}}",
    ".kv-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:8px 0}.kv-chips span{background:rgba(255,255,255,.07);border:1px solid #3a4c74;border-radius:999px;padding:4px 10px;font-size:13px;color:#e6eeff}",
    ".kv-nb{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:6px 0}.kv-nb span{background:linear-gradient(135deg,#3b2a00,#5a3d00);border:1px solid #ffd479;border-radius:12px;padding:6px 10px;color:#ffe9b0;font-weight:800;font-size:13px}",
    ".kv-daily{text-align:left;background:rgba(255,255,255,.04);border:1px solid #2a3a5e;border-radius:12px;padding:8px 10px;margin:10px 0 0;font-size:13px;color:#cfd8ef}.kv-daily b{color:#fff}.kv-daily div{display:flex;justify-content:space-between;gap:8px;padding:3px 0}.kv-daily .ok{color:#5ee67a}",
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
  hud.innerHTML = '<a class="kv-pill" href="virtual.html">← Virtual</a><span class="kv-pill" id="kv-s">⭐ 0</span><span class="kv-pill lv" id="kv-lv" title="Daraja: 3 ta to\'g\'ri javob — yuqoriga, 2 ta xato — pastga">📶 1/5</span><span class="kv-pill cb" id="kv-cb" style="display:none"></span><span class="kv-pill" id="kv-t">⏱ 60</span><span class="kv-pill" id="kv-h">✋ 0</span><span class="kv-pill" id="kv-mus" style="cursor:pointer">🎵</span>';
  body.appendChild(hud);
  setTimeout(function () { var mb = document.getElementById("kv-mus"); if (!mb) return; if (G.m === "poyga") { mb.style.display = "none"; return; } var upd = function () { mb.textContent = MUS ? "🎵 Musiqa" : "🔇 Musiqa"; }; upd(); mb.onclick = function () { MUS = !MUS; try { localStorage.setItem("kav.music", MUS ? "1" : "0"); } catch (e) {} upd(); if (MUS) musicStart(); else musicStop(); }; }, 0);
  var qEl = document.createElement("div"); qEl.className = "kv-q"; body.appendChild(qEl);
  // Til tanlagichi va 🎓 IELTS (ka-til.js, ka-ielts.js) chap yuqorida qotirilgan — ⭐ ochko va boshqa yozuvlar ular ostida qolmasin:
  // ular egallagan joyni bo'sh qoldiramiz; tor ekranda yozuvlar 2-qatorga tushadi, savol esa ulardan pastga suriladi
  var hudShift = 0;
  function dockHud() {
    var back = hud.querySelector("a"), right = 0, bottom = 0;
    if (!back) return;
    ["ka-til-box", "ka-ielts"].forEach(function (id) { var e = document.getElementById(id); if (!e) return; var r = e.getBoundingClientRect(); if (r.width && r.top < 60) { right = Math.max(right, r.right); bottom = Math.max(bottom, r.bottom + 8); } });
    back.style.marginRight = "";
    if (right) back.style.marginRight = Math.max(0, Math.ceil(right + 10 - back.getBoundingClientRect().right)) + "px";
    Array.prototype.forEach.call(hud.children, function (c) { var r = c.getBoundingClientRect(); if (r.height) bottom = Math.max(bottom, r.bottom + 12); });
    var top = Math.max(54, Math.round(bottom));
    qEl.style.top = top + "px"; hudShift = top - 54;
  }
  window.addEventListener("resize", dockHud); window.addEventListener("load", dockHud);
  window.addEventListener("ka-til", function () { setTimeout(dockHud, 60); });
  document.addEventListener("DOMContentLoaded", function () { setTimeout(dockHud, 0); setTimeout(dockHud, 700); });
  setTimeout(dockHud, 1600);
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
  var camOn = false, mouseMode = false, handsObj = null, lastRes = null, vw = 1280, vh = 720, pumpN = 0;
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
      // Gibrid rejim: kamera bilan birga sensor/sichqoncha ham ishlaydi (bosib turilganda)
      if (mouse.inside && mouse.down) np.push({ x: mouse.x, y: mouse.y, pinch: true, hand: null, fingers: -1, palm: { x: mouse.x, y: mouse.y }, base: { x: W / 2, y: H }, touch: true });
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
  var busy = false, stream = null, handsP = null;
  // Qo'l modeli start oynasidayoq orqada yuklanadi — "Boshlash" bosilganda odatda tayyor turadi
  function prepHands() {
    if (!handsP) {
      handsP = (window.Hands ? Promise.resolve() : loadScript(MP + "hands.js")).then(function () {
        if (!handsObj) {
          handsObj = new window.Hands({ locateFile: function (f) { return MP + f; } });
          handsObj.setOptions({ maxNumHands: CFG.hands, modelComplexity: /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ? 0 : 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.5 });
          handsObj.onResults(onResults);
        }
        return handsObj.initialize ? handsObj.initialize() : null;
      });
      handsP.catch(function () { handsP = null; handsObj = null; });
    }
    return handsP;
  }
  (function () {
    var c = navigator.connection, slow = !!(c && (c.saveData || /2g/.test(c.effectiveType || "")));
    if (slow) return;
    // Telefonda qo'l modeli (WASM) ishga tushishi asosiy oqimni 1–3 soniya band qiladi va start oynasi qotib qoladi —
    // shuning uchun telefonda model faqat "Kamera bilan" bosilganda yuklanadi (yuklanish oynasi ko'rinib turadi).
    // Kompyuterda esa brauzer bo'sh qolganda oldindan tayyorlab qo'yamiz.
    if (/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) || (navigator.hardwareConcurrency || 8) <= 4) return;
    var go = function () { if (!camOn && !mouseMode) prepHands().catch(function () {}); };
    if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 1500);
  })();
  function startCamera() {
    loadEl.style.display = "flex"; $("kv-lt").textContent = "KAMERA YUKLANMOQDA…";
    var mob = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
    var model = prepHands();   // kamera ruxsati kutilayotganda ham model yuklanishda davom etadi
    // Telefonda 640×480 yetarli — qo'l modeli 2–3 barobar tez ishlaydi
    return navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: mob ? 640 : 1280 }, height: { ideal: mob ? 480 : 720 }, frameRate: { ideal: 30, max: 30 } }, audio: false })
      .then(function (s) { stream = s; video.srcObject = s; return video.play(); })
      .then(function () { $("kv-lt").textContent = "QO'L MODELI YUKLANMOQDA…"; return model; })
      .then(function () {
        handsObj.setOptions({ maxNumHands: CFG.hands });
        camOn = true; loadEl.style.display = "none";
        (function pump() {
          if (!camOn) return;
          pumpN = (pumpN || 0) + 1;
          if (!busy && video.readyState >= 2 && (S.run || S.cd > 0) && !document.hidden && (!mob || pumpN % 2 === 0)) { busy = true; vw = video.videoWidth || vw; vh = video.videoHeight || vh; handsObj.send({ image: video }).then(function () { busy = false; }, function () { busy = false; }); }
          requestAnimationFrame(pump);
        })();
      });
  }

  // Sichqoncha / sensor
  function mpos(e) { var t = e.touches ? e.touches[0] : e; if (t) { mouse.x = t.clientX; mouse.y = t.clientY; } mouse.inside = true; }
  cv.addEventListener("pointermove", mpos); cv.addEventListener("pointerdown", function (e) { mpos(e); mouse.down = true; });
  window.addEventListener("pointerup", function (e) { mouse.down = false; if (e.pointerType !== "mouse") setTimeout(function () { if (!mouse.down) mouse.inside = false; }, 60); }); cv.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") mouse.inside = false; });

  /* ----------------------- O'YIN HOLATI ----------------------- */
  var S = { run: false, score: [0, 0], ok: 0, bad: 0, streak: 0, left: 60, pause: 0, miss: [], retry: [], since: 0, best: 0,
    lv: 1, up: 0, dn: 0, maxLv: 1, qn: 0, bosses: 0, freeze: 0, fifty: 0, fast: 0, qT: 0, curQ: null, base: 0, nb: [], cam: false };
  var HOLD = 0.55;
  // Daraja 1…5: o'yin davomida o'quvchiga moslashadi (3 ta ketma-ket to'g'ri → yuqoriga, 2 ta ketma-ket xato → pastga)
  function lvl() { return S.lv || 1; }
  function topicG() { if (G.m === "xotira") return { kopaytirish: 3, kasrFoiz: 6, tenglama: 6 }[G.k] || 5; if (G.m === "poyga") return (TOPICS[G.k] || {}).g || 2; if (G.m === "grafik") return 8; var t = SRC[G.m] && SRC[G.m][G.k]; return (t && t.g) || 4; }
  // Boshlang'ich daraja: sinf tanlangan bo'lsa — mavzu o'tiladigan sinfga nisbatan, aks holda qiyinlik bo'yicha
  function startLevel() {
    var d = CFG.diff | 0 || 2, sn = CFG.sinf | 0;
    if (!sn) return d === 1 ? 1 : d === 2 ? 2 : 3;
    var b = 1 + Math.floor(((sn >= 11 ? 10 : sn) - topicG()) / 2);
    return clamp(clamp(b, 1, 4) + (d - 2), 1, 5);
  }
  // Variantli o'yinlar (50/50 bonusi shularda ishlaydi)
  var OPTM = { pufak: 1, yomgir: 1, orbita: 1, nishon: 1 };
  function bossSfx() { tone(110, 55, 0.6, "sawtooth", 0.12); tone(220, 110, 0.5, "square", 0.06, 0.1); }
  // Har 5-topshiriq — 👑 BOSS: bir daraja qiyinroq, to'g'ri javob ×3 ochko va +10 soniya
  function bossTurn() { S.qn = (S.qn || 0) + 1; var b = S.qn % 5 === 0; S.curQ = { boss: b }; S.qT = performance.now(); if (b) { banner("👑 BOSS RAUND!", "#ffd479"); bossSfx(); } return b; }
  function bossLv(b) { return b ? Math.min(5, lvl() + 1) : lvl(); }
  // Qiyinlik: harakatlanuvchi o'yinlarda tezlik ko'paytuvchisi
  var MOVE = { yomgir: 1, orbita: 1, kesish: 1, tutish: 1, pufak: 1, nishon: 1 };
  function spd() { return MOVE[G.m] ? [0.72, 1, 1.3][(CFG.diff | 0 || 2) - 1] : 1; }
  function qText(q) { return /\?/.test(q.q) ? q.q : /=/.test(q.q) ? q.q + (/x/.test(q.q) ? ".  x = ?" : "") : q.q + " = ?"; }
  function showQ(q, pre) { setQ((pre || "") + (q.boss ? "👑 " : "") + qText(q), q.rep, q.boss); }
  // To'g'ri javobdan keyin ekranda qisqa ko'rinadigan yozuv: "7 × ? = 56" → "7 × 8 = 56", matnli savol → "… → 8"
  function qDone(q, v) {
    var a = String(v == null ? q.a : v).replace(/^-/, "−");
    if (!/\?/.test(q.q)) return q.q + (/→/.test(q.q) ? ": " : " = ") + a;
    if (/[a-zA-Z'ʻ]{3,}/.test(q.q.replace(/EKUB|EKUK|sin|cos|ctg|tg/g, ""))) return q.q + "  → " + a;
    return q.q.replace("?", a);
  }
  function setQ(t, rep, boss) { qEl.classList.toggle("boss", !!boss); qEl.innerHTML = (rep ? '<span class="kv-rep">🔁 Takror</span> ' : "") + String(t).replace(/</g, "&lt;"); qEl.classList.add("bump"); setTimeout(function () { qEl.classList.remove("bump"); }, 160); }

  /* --- Eslab qolish: xatolar takrorlanadi --- */
  // Xato qilingan savol 2–4 savoldan keyin yana so'raladi
  function askQ(tp, accept) {
    S.since++;
    S.recent = S.recent || [];
    var boss = bossTurn();
    if (!boss && S.retry.length && S.since >= 2 && Math.random() < 0.6) {
      var r = S.retry.shift(); if (!accept || accept(r)) { r.rep = true; r.boss = false; S.since = 0; S.curQ = r; return r; }
    }
    // oxirgi 6 ta savol takrorlanmasin (kichik mavzularda ham xilma-xil bo'lsin)
    var q, t = 0, L = bossLv(boss); do { q = tp.q(L, boss); } while (((accept && !accept(q)) || S.recent.indexOf(q.q) >= 0) && t++ < 60);
    if (q && !q.e) q.e = q.q + " = " + (typeof q.a === "number" ? mstr(q.a) : q.a);
    q.boss = boss; q.rep = false; S.curQ = q; S.recent.push(q.q); if (S.recent.length > 6) S.recent.shift();
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

  /* --- Javob paneli: ⌨️ yozish + 🎤 ovoz (kamera/sensor bilan bir vaqtda) --- */
  var ansBar = document.createElement("div"); ansBar.className = "kv-ans"; ansBar.style.display = "none";
  ansBar.innerHTML = '<input id="kv-ain" type="text" inputmode="decimal" autocomplete="off" placeholder="Javob: yozing yoki 🎤 ayting"><button type="button" id="kv-aok">↵</button><button type="button" id="kv-mic" title="Ovoz bilan javob (uzbek/rus)">🎤</button>';
  body.appendChild(ansBar);
  var ansIn = ansBar.querySelector("#kv-ain"), micBtn = ansBar.querySelector("#kv-mic");
  function submitAns(v) {
    if (!mech || !mech.answer || !S.run) return;
    v = String(v == null ? ansIn.value : v).trim(); if (!v) return;
    var ok = mech.answer(v);
    ansIn.value = ""; ansIn.classList.remove("ok", "bad"); ansIn.classList.add(ok ? "ok" : "bad"); setTimeout(function () { ansIn.classList.remove("ok", "bad"); }, 600);
  }
  ansBar.querySelector("#kv-aok").onclick = function () { submitAns(); };
  ansIn.addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Enter") submitAns(); });
  // sahifaning istalgan joyida raqam bosilsa — javob maydoniga tushadi
  window.addEventListener("keydown", function (e) {
    if (ansBar.style.display === "none" || e.target === ansIn || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[0-9.,-]$/.test(e.key)) { ansIn.focus(); }
  });
  // ovozli raqamlar: o'zbek va rus so'zlari
  var UZN = { nol: 0, bir: 1, ikki: 2, uch: 3, "to'rt": 4, tort: 4, besh: 5, olti: 6, yetti: 7, sakkiz: 8, "to'qqiz": 9, toqqiz: 9, "o'n": 10, on: 10, yigirma: 20, "o'ttiz": 30, ottiz: 30, qirq: 40, ellik: 50, oltmish: 60, yetmish: 70, sakson: 80, "to'qson": 90, toqson: 90, yuz: 100, ming: 1000 };
  var RUN = { ноль: 0, один: 1, одна: 1, два: 2, две: 2, три: 3, четыре: 4, пять: 5, шесть: 6, семь: 7, восемь: 8, девять: 9, десять: 10, одиннадцать: 11, двенадцать: 12, тринадцать: 13, четырнадцать: 14, пятнадцать: 15, шестнадцать: 16, семнадцать: 17, восемнадцать: 18, девятнадцать: 19, двадцать: 20, тридцать: 30, сорок: 40, пятьдесят: 50, шестьдесят: 60, семьдесят: 70, восемьдесят: 80, девяносто: 90, сто: 100, двести: 200, триста: 300, четыреста: 400, пятьсот: 500, тысяча: 1000 };
  function wordsToNum(t) {
    t = t.toLowerCase().replace(/[ʻʼ‘’`]/g, "'").replace(/градус(ов|а)?|gradus|daraja|минус/g, function (m) { return m === "минус" ? " minus " : " "; });
    var m = t.match(/-?\d+([.,]\d+)?/); if (m) return m[0].replace(",", ".");
    var neg = /minus|manfiy/.test(t), total = 0, cur = 0, found = false;
    t.split(/\s+/).forEach(function (w) {
      var v = UZN[w] != null ? UZN[w] : RUN[w];
      if (v == null) return; found = true;
      if (v === 100 || v === 1000) { cur = (cur || 1) * v; if (v === 1000) { total += cur; cur = 0; } }
      else cur += v;
    });
    if (!found) return null; total += cur; return String(neg ? -total : total);
  }
  var rec = null, recOn = false;
  function micToggle() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { teach("Bu brauzerda ovozli kiritish yo'q — Chrome yoki Yandex ishlating", false, 2500); return; }
    if (recOn) { recOn = false; try { rec.stop(); } catch (e) {} micBtn.classList.remove("on"); return; }
    rec = new SR(); rec.lang = (CFG.voiceLang || "ru-RU"); rec.continuous = true; rec.interimResults = false; rec.maxAlternatives = 3;
    rec.onresult = function (e) {
      for (var i = e.resultIndex; i < e.results.length; i++) {
        if (!e.results[i].isFinal) continue;
        var n = null;
        for (var k = 0; k < e.results[i].length && n == null; k++) n = wordsToNum(e.results[i][k].transcript);
        if (n != null) { ansIn.value = n; submitAns(n); } else teach("🎤 Eshitildi: «" + e.results[i][0].transcript + "» — raqam topilmadi", false, 1800);
      }
    };
    rec.onend = function () { if (recOn) { try { rec.start(); } catch (e) {} } };
    rec.onerror = function (e) { if (e.error === "not-allowed") { recOn = false; micBtn.classList.remove("on"); teach("Mikrofonga ruxsat berilmadi", false, 2500); } };
    try { rec.start(); recOn = true; micBtn.classList.add("on"); teach("🎤 Javobni ayting: masalan «o'n besh» yoki «пятнадцать»", "hint", 2500); } catch (e) {}
  }
  micBtn.onclick = micToggle;
  function syncAnsBar() { ansBar.style.display = mech && mech.answer && S.run ? "flex" : "none"; }
  // Bannerlar navbat bilan ko'rsatiladi (bir vaqtda bir nechta yutuq bo'lsa ham hammasi ko'rinadi)
  var bannerT = null, bq = [];
  function bannerShow() {
    if (!bq.length) { bannerEl.className = "kv-banner"; bannerT = null; return; }
    var b = bq.shift(); bannerEl.textContent = b[0]; bannerEl.style.color = b[1] || "#fff"; bannerEl.className = "kv-banner"; void bannerEl.offsetWidth; bannerEl.className = "kv-banner on";
    bannerT = setTimeout(bannerShow, bq.length ? 1000 : 1300);
  }
  function banner(t, c) { if (bq.length > 3) bq.shift(); bq.push([t, c]); if (!bannerT) bannerShow(); }
  // Nishon berish (bir marta): banner + ovoz + 5 🪙 (akkauntga kirgan bo'lsa)
  function award(id) {
    var d = PR.load(); if (d.b[id]) return false;
    var b = BADGES.filter(function (x) { return x[0] === id; })[0]; if (!b) return false;
    d.b[id] = Date.now(); PR.save(d); S.nb.push(b);
    banner("🏅 Yangi nishon: " + b[1] + " " + b[2], "#ffd479"); setTimeout(function () { arp([0, 7, 12, 16, 19], 12, "triangle"); }, 250);
    try { if (window.kaAccount && window.kaAccount.me()) window.kaAccount.addCoins(5, "Nishon: " + b[2]); } catch (e) {}
    return true;
  }
  var STREAK_TXT = { 3: "🔥 3 ketma-ket!", 5: "⚡ 5 ketma-ket! Zo'r!", 8: "🚀 8 ketma-ket!", 10: "🏆 10 ketma-ket! CHEMPION!", 15: "👑 15 ketma-ket! Afsona!", 20: "🌟 20! Matematika ustasi!" };

  function combo() { return S.streak >= 6 ? 3 : S.streak >= 3 ? 2 : 1; }
  function good(x, y, pl, pts, eq) {
    S.ok++; S.streak++; S.best = Math.max(S.best, S.streak);
    var q = S.curQ, boss = !!(q && q.boss), mult = combo(), base = pts || 10;
    var add = base * mult * (boss ? 3 : 1);
    S.base += base * (boss ? 2 : 1);                         // tangalar asosiy ochkodan hisoblanadi (kombo tangani ko'paytirmaydi)
    S.score[pl || 0] += add; burst(x, y, boss ? 70 : 40, boss ? ["#ffd479", "#ff9100", "#fff"] : null, boss ? 1.6 : 1.2); burst(x, y, 6, null, 0.6, TH.tr === "heart" ? "heart" : "star");
    ftext(x, y - 20, "+" + add + (mult > 1 ? "  ×" + mult : ""), mult > 2 || boss ? "#ffd479" : TH.acc);
    if (eq) ftext(x, y + 26, eq, "#ffffff");
    sfxGood(); if (navigator.vibrate) try { navigator.vibrate(boss ? [30, 40, 60] : 20); } catch (e) {}
    if (q && S.qT && performance.now() - S.qT < 3000) { S.fast++; if (S.fast === 5) award("tez"); }
    if (q) q.boss = false;
    if (boss) { S.bosses++; S.left += 10; banner("👑 Boss yengildi! +10 soniya", "#ffd479"); arp([0, 4, 7, 12, 16, 19], 10, "square"); award("boss"); if (S.bosses === 3) award("boss3"); }
    S.up++; S.dn = 0;
    if (S.up >= 3 && S.lv < 5) { S.lv++; S.up = 0; S.maxLv = Math.max(S.maxLv, S.lv); banner("⬆ " + S.lv + "-daraja! Qiyinroq misollar", TH.acc2); arp([0, 5, 9, 12]); if (S.lv === 5) award("lv5"); }
    if (S.streak % 5 === 0) { S.freeze = 5; banner("❄️ Vaqt muzladi — 5 soniya", "#7fdcff"); tone(1200, 2400, 0.3, "sine", 0.08); }
    if (STREAK_TXT[S.streak]) { banner(STREAK_TXT[S.streak], TH.acc); arp([0, 4, 7, 12, 16]); }
    else if (S.streak === 3 || S.streak === 6) banner("🔥 Kombo ×" + mult + "!", "#ff9a3d");
    if (S.streak === 10) award("s10"); if (S.streak === 20) award("s20");
  }
  function bad(x, y, pl, lesson, q) {
    S.bad++; S.streak = 0; S.score[pl || 0] = Math.max(0, S.score[pl || 0] - 5);
    burst(x, y, 18, ["#ff4d4d", "#ff8a80", "#ffffff"], 0.7); ftext(x, y - 20, "−5", "#ff6b6b"); sBad();
    S.dn++; S.up = 0;
    if (S.dn >= 2) {
      S.dn = 0;
      if (S.lv > 1) { S.lv--; banner("⬇ " + S.lv + "-daraja — biroz osonroq", "#ffb36b"); }
      if (OPTM[G.m] && !S.fifty) { S.fifty = 1; banner("🛟 Yordam: keyingi savolda variantlar kamroq", "#7fdcff"); }
    }
    if (lesson || q) { logMiss(q, lesson); teach(lesson || q.e, false); }
  }
  function updHud() {
    $("kv-s").textContent = mech && mech.hud ? mech.hud() : CFG.duel ? "🔵 " + S.score[0] + " : " + S.score[1] + " 🔴" : "⭐ " + S.score[0];
    var tEl = $("kv-t"); tEl.textContent = (S.freeze > 0 ? "❄️ " : "⏱ ") + Math.max(0, Math.ceil(S.left)); tEl.classList.toggle("fz", S.freeze > 0);
    $("kv-lv").textContent = "📶 " + S.lv + "/5";
    var cb = $("kv-cb"), m = combo(); cb.style.display = m > 1 && S.run ? "" : "none"; if (m > 1) cb.textContent = "🔥 ×" + m;
    $("kv-h").textContent = (mouseMode ? "🖱" : "✋ " + hands.length);
  }
  function makeOpts(q, n) {
    if (S.fifty > 0 && n > 2) { n = Math.max(2, Math.ceil(n / 2)); S.fifty = 0; }   // 🛟 50/50 yordam
    var a = String(q.a), out = [a];
    shuffle(q.w || []).forEach(function (w) { w = String(w); if (out.length < n && out.indexOf(w) < 0) out.push(w); });
    if (typeof q.a === "number") near(q.a, 12, 8).forEach(function (w) { w = String(w); if (out.length < n && out.indexOf(w) < 0) out.push(w); });
    return shuffle(out).map(function (s) { return { s: s.replace(/^-/, "−"), ok: s === a }; });
  }
  /* --- Universal javob kanali: klaviatura / ovoz / ekran tugmasi — har qanday rejim bilan birga ishlaydi --- */
  var curQ = null;
  function ansNorm(v) { return String(v).trim().replace(/[−–]/g, "-").replace(/,/g, ".").replace(/\s+/g, "").replace(/°$/, ""); }
  function ansSame(v, a) {
    var A = ansNorm(a).toUpperCase(), B = ansNorm(v).toUpperCase(), num = /^-?\d+(\.\d+)?$/;
    if (!B) return false; if (A === B) return true;
    if (num.test(A) && num.test(B)) return Math.abs(parseFloat(A) - parseFloat(B)) < 1e-9;   // "3/4" ga "3" teng emas!
    return /Π$/.test(A) && B === A.replace(/Π$/, "");                                        // "25π" ga "25" ham to'g'ri
  }
  function genericAnswer(q, v, nq) {
    if (!q || !S.run || S.cd > 0) return false;
    var ok = ansSame(v, q.a);
    if (ok) { good(W / 2, H * 0.4, 0, 0, qDone(q)); if (nq) nq(); }
    else bad(W / 2, H * 0.4, 0, null, q);
    return ok;
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
      q = askQ(tp); showQ(q);
      var o = makeOpts(q, 4), lanes = shuffle([0, 1, 2, 3]), r = Math.max(34, Math.min(W / 10, H / 7.5));
      b = o.map(function (op, i) { var bx = W * (0.14 + lanes[i] * 0.24); return { x: bx, bx: bx, y: H + r + Math.random() * H * 0.35, r: r, s: op.s, ok: op.ok, ph: Math.random() * 6, v: H / (7 - Math.min(3, lvl() * 0.3)) * (0.8 + Math.random() * 0.4) }; });
    }
    return {
      answer: function (v) { return genericAnswer(q, v, nq); },
      start: nq,
      update: function (dt) {
        for (var i = b.length - 1; i >= 0; i--) {
          var t = b[i]; t.y -= t.v * dt; t.x = t.bx + Math.sin(tGlobal * 1.6 + t.ph) * U * 3;
          if (t.y < -t.r) t.y = H + t.r;
          var p = holdPick(t, dt, inCircle(t));
          if (p) { if (t.ok) { good(t.x, t.y, p.player, 0, qDone(q, t.s)); nq(); return; } bad(t.x, t.y, p.player, null, q); b.splice(i, 1); }
        }
      },
      draw: function (dt) { b.forEach(function (t) { var sx = shx(t, dt); drawBall(t.x + sx, t.y, t.r, t.s); drawHoldRing(t.x, t.y, t.r, t.hold); }); }
    };
  };

  // ---------- Son yomg'iri ----------
  M.yomgir = function () {
    var tp = TOPICS[G.k], b = [], q;
    function nq() {
      q = askQ(tp); showQ(q);
      var o = makeOpts(q, 5), lanes = shuffle([0, 1, 2, 3, 4]), r = Math.max(30, Math.min(W / 12, H / 9));
      b = o.map(function (op, i) { return { x: W * (0.12 + lanes[i] * 0.19), y: -r - i * H * 0.16 - Math.random() * 40, r: r, s: op.s, ok: op.ok, v: H / (6.5 - Math.min(3, lvl() * 0.35)) }; });
    }
    return {
      answer: function (v) { return genericAnswer(q, v, nq); },
      start: nq,
      update: function (dt) {
        for (var i = b.length - 1; i >= 0; i--) {
          var t = b[i]; t.y += t.v * dt;
          if (t.y > H + t.r) { if (t.ok) { bad(t.x, H - 30, 0, null, q); nq(); return; } b.splice(i, 1); continue; }
          var p = holdPick(t, dt, inCircle(t, 1.15), false, 0.35);
          if (p) { if (t.ok) { good(t.x, t.y, p.player, 0, qDone(q, t.s)); nq(); return; } bad(t.x, t.y, p.player, null, q); b.splice(i, 1); }
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
    function nq() { q = askQ(tp); showQ(q); var o = makeOpts(q, 5); b = o.map(function (op, i) { return { s: op.s, ok: op.ok, a0: i * Math.PI * 2 / 5, x: 0, y: 0, r: 30 }; }); }
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
      answer: function (v) { return genericAnswer(q, v, nq); },
      start: nq,
      update: function (dt) {
        ang += dt * (0.35 + lvl() * 0.05); var g = geo();
        for (var i = 0; i < b.length; i++) {
          var t = b[i], a = ang + t.a0; t.x = g.cx + Math.cos(a) * g.rx; t.y = g.cy + Math.sin(a) * g.ry; t.z = Math.sin(a); t.r = Math.max(26, Math.min(W, H) * 0.075) * (0.8 + 0.25 * (t.z + 1) / 2);
          var p = holdPick(t, dt, inCircle(t, 1.1));
          if (p) { if (t.ok) { good(t.x, t.y, p.player, 0, qDone(q, t.s)); nq(); return; } bad(t.x, t.y, p.player, null, q); b.splice(i, 1); return; }
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
      q = askQ(tp); showQ(q, "🎯 "); var o = makeOpts(q, 5), r = Math.max(32, Math.min(W / 11, H / 9));
      b = o.map(function (op, i) { var row = i % 3, dir = row % 2 ? -1 : 1; return { s: op.s, ok: op.ok, r: r, x: Math.random() * W, y: H * (0.32 + row * 0.2), v: dir * (W / 9) * (0.7 + Math.random() * 0.6) * (1 + lvl() * 0.08) }; });
    }
    return {
      answer: function (v) { return genericAnswer(q, v, nq); },
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
              if (t.ok) { good(t.x, t.y, p.player, 0, qDone(q, t.s)); nq(); } else { bad(t.x, t.y, p.player, null, q); b.splice(i, 1); }
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
    function nq() { q = askQ(tp, function (x) { return typeof x.a === "number" && x.a === Math.round(x.a); }); ans = mstr(q.a); typed = ""; showQ(q); }
    function press(k, p) {
      k.flash = 0.25; var f = 260 * Math.pow(2, keys.indexOf(k) / 12); beep(f, 0.25, "triangle", 0.1);
      burst(k.x + k.w / 2, k.y, 10, null, 0.5);
      if (k.l === "⌫") typed = typed.slice(0, -1); else if (k.l === "−") { if (!typed) typed = "−"; } else typed += k.l;
      if (typed === ans) { good(W / 2, H * 0.32, p.player, 0, qDone(q, ans)); nq(); }
      else if (typed.replace("−", "").length >= ans.replace("−", "").length && typed.length >= ans.length) { msgT = 1.6; msg = "Siz yozdingiz: " + typed; bad(W / 2, H * 0.32, p.player, null, q); typed = ""; nq(); }
    }
    var msg = "";
    return {
      answer: function (v) { return genericAnswer(q, v, nq); },
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
    function nq() { q = askQ(tp, function (x) { return typeof x.a === "number" && x.a >= 0 && x.a <= maxA() && x.a === Math.round(x.a); }); showQ(q); reset(); wrongT = 0; }
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
      answer: function (v) { var n = parseFloat(ansNorm(v)); if (!isFinite(n) || !q || !S.run) return false; return check(0, n); },
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
      var bs = bossTurn(), c = ch.gen(bossLv(bs)); seq = c.seq; next = 0; path = []; setQ((bs ? "👑 " : "") + c.q, false, bs);
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
      var NPR = [4, 6, 8][(CFG.diff | 0 || 2) - 1]; var guard = 0; while (pairs.length < NPR && guard++ < 400) { var pr = gen(lvl()); if (used[pr[0]] || used[pr[1]]) continue; used[pr[0]] = used[pr[1]] = 1; pairs.push(pr); }
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
      var bs = bossTurn(), list = ord.gen(bossLv(bs)), r = Math.max(32, Math.min(W / 13, H / 9.5)), pos = scatter(list.length, r);
      items = list.map(function (o, i) { return { v: o.v, s: o.s, x: pos[i].x, y: pos[i].y, r: r, n: 0 }; });
      sorted = items.slice().sort(function (a, b) { return a.v - b.v; }); next = 0; setQ((bs ? "👑 " : "") + ord.n, false, bs);
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
    function nq() { var bs = bossTurn(); tg = L.gen(bossLv(bs)); setQ((bs ? "👑 " : "") + (tg.q || tg.s + " sonini son o'qida ko'rsating"), false, bs); still = {}; }
    function submit(p, v) {
      var g = geo(); lastGuess = { x: xOf(v), t: 1.4 }; reveal = 1.4; var rv = tg;
      var fmt = function (x) { return (Math.round(x * 100) / 100).toString().replace(".", ","); };
      var ex = tg.s + " ≈ " + fmt(tg.v);
      if (G.k === "ildiz") { var n = Math.round(tg.v * tg.v), r0 = Math.floor(tg.v); ex = r0 + "² = " + (r0 * r0) + " < " + n + " < " + ((r0 + 1) * (r0 + 1)) + " = " + (r0 + 1) + "²  →  " + tg.s + " ≈ " + fmt(tg.v) + " (" + r0 + " va " + (r0 + 1) + " orasida)"; }
      if (G.k === "kasr") { var pq = tg.s.split("/"); ex = tg.s + " = " + pq[0] + " : " + pq[1] + " = " + fmt(tg.v) + (tg.v > 1 ? "  (1 dan katta — maxraj suratdan kichik)" : ""); }
      if (tg.e) ex = tg.e;
      if (Math.abs(v - tg.v) <= L.tol * [1.6, 1, 0.6][(CFG.diff | 0 || 2) - 1] * (1.15 - 0.07 * lvl())) good(xOf(tg.v), g.y, p.player, 0, tg.t || tg.s + " ≈ " + fmt(tg.v)); else bad(xOf(v), g.y, p.player, ex + "   (siz " + fmt(v) + " ni ko'rsatdingiz)");
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
          if (major && (steps <= 12 || W >= 700 || Math.round(v) % 2 === 0)) { ctx.fillStyle = "#fff"; ctx.font = "700 " + (U * 2.6 + 8) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(mstr(Math.round(v * 100) / 100), x, g.y + 22); }
        }
        // kichik bo'linmalar (o'nliklar)
        if (L.ticks === 1) for (var j = 0; j <= (L.max - L.min) * 10; j++) { if (j % 10 === 0) continue; var xx = xOf(L.min + j / 10); ctx.strokeStyle = "#ffffff33"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xx, g.y - 5); ctx.lineTo(xx, g.y + 5); ctx.stroke(); }
        if (reveal > 0 && lastTarget) { ctx.globalAlpha = Math.min(1, reveal); var tx = xOf(lastTarget.v); ctx.fillStyle = "#5ee67a"; ctx.beginPath(); ctx.moveTo(tx, g.y - 6); ctx.lineTo(tx - 12, g.y - 30); ctx.lineTo(tx + 12, g.y - 30); ctx.fill(); ctx.font = "800 18px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(lastTarget.t || lastTarget.s + " ≈ " + (Math.round(lastTarget.v * 100) / 100).toString().replace(".", ","), tx, g.y - 34); ctx.globalAlpha = 1; }
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
    var A = ANGLES[G.k], tg = null, holdT = 0, cur = null;
    var hintT = 0, offT = 0, inTol = false, lastSec = 0;
    var HOLD_A = 3;   // to'g'ri burchak 3 soniya ushlab turilsa — 3·2·1 sanab, javob qabul qilinadi
    function angDist(a, b) { var d = Math.abs(a - b) % 180; return Math.min(d, 180 - d); }
    function nq() {
      var prev = tg, t = 0, bs = bossTurn();
      do { tg = A.gen(bossLv(bs)); } while (prev && angDist(tg.a, prev.a) < 25 && t++ < 40);   // keyingi burchak oldingisidan sezilarli farq qilsin
      setQ((bs ? "👑 " : "") + tg.q + (G.k === "trig" ? "  →  α ni yasang" : ""), false, bs); holdT = 0; hintT = 0; offT = 0; inTol = false; lastSec = 0;
    }
    function angEx() { if (tg.e) return tg.e + "  →  " + tg.a + "°"; return G.k === "trig" ? tg.q.replace("α", tg.a + "°") + "  →  α = " + tg.a + "°" : tg.a + "°" + (tg.a < 90 ? " — o'tkir burchak (90° dan kichik)" : tg.a === 90 ? " — to'g'ri burchak" : " — o'tmas burchak (90° dan katta)"); }
    var sm = null, needTxt = "";
    function line() {
      var hp = pointers.filter(function (p) { return p.hand; }), tp = pointers.filter(function (p) { return p.touch; });
      if (mouseMode) { if (!pointers[0]) return null; return { a: { x: W / 2, y: H * 0.68 }, b: pointers[0] }; }
      if (hp.length >= 2) { var p = hp.slice().sort(function (x, y) { return x.x - y.x; }); return { a: p[0], b: p[1] }; }
      if (hp.length === 1) { var h = hp[0].hand; return { a: h.pts[5], b: h.pts[8], alt: { a: h.pts[0], b: h.pts[8] } }; }   // ko'rsatkich barmoq: asosidan uchigacha
      if (tp[0]) return { a: { x: W / 2, y: H * 0.68 }, b: tp[0] };   // sensor/sichqoncha (kamera bilan birga ham)
      return null;
    }
    function deg(l) { var d = Math.atan2(-(l.b.y - l.a.y), l.b.x - l.a.x) * 180 / Math.PI; if (d < 0) d += 180; if (d >= 180) d -= 180; return d; }
    function diffTo(c) { return c == null ? 99 : Math.min(Math.abs(c - tg.a), Math.abs(c - tg.a - 180), Math.abs(c - tg.a + 180)); }
    return {
      start: nq,
      answer: function (v) {   // ovoz / klaviatura: "15" yoki "o'n besh"
        var n = parseFloat(ansNorm(v)); if (!isFinite(n) || !S.run) return false;
        if (Math.abs(n - tg.a) < 0.5) { good(W / 2, H * 0.45, 0, 0, angEx()); nq(); return true; }
        bad(W / 2, H * 0.45, 0, tg.a + "° kerak edi. " + angEx()); return false;
      },
      update: function (dt) {
        var l = line(); var raw = l ? deg(l) : null;
        if (raw == null) { sm = null; cur = null; }
        else {
          // silliqlash (EMA) — qo'l titrashini yutadi; 0/180 chegarasida sakrashni oldini olamiz
          if (sm == null || Math.abs(raw - sm) > 90) sm = raw; else sm += (raw - sm) * 0.35;
          cur = sm;
        }
        var tol = Math.max(5, 9 - lvl() * 0.7);          // 8° dan boshlab, daraja oshgani sari 5° gacha
        var diff = diffTo(cur);
        // sanoq boshlangach chegara 3° kengayadi — qo'l biroz titrasa ham sanoq buzilmaydi
        inTol = cur != null && diff <= tol + (holdT > 0 ? 3 : 0);
        if (inTol) {
          offT = 0; holdT += dt;
          if (holdT >= HOLD_A) { var m = l ? { x: (l.a.x + l.b.x) / 2, y: (l.a.y + l.b.y) / 2 } : { x: W / 2, y: H / 2 }; good(m.x, m.y, 0, 0, angEx()); nq(); needTxt = ""; return; }
          var sec = Math.ceil(HOLD_A - holdT);          // 3 → 2 → 1
          if (sec !== lastSec) { lastSec = sec; sTick(440 + (HOLD_A - sec) * 160); }
        } else {
          offT += dt;
          if (offT > 0.35) { holdT = 0; lastSec = 0; }   // qisqa titrash kechiriladi; burchakdan chiqilsa sanoq boshidan
          if (holdT <= 0) { hintT += dt; if (hintT > 10 && hintT < 50) { hintT = 99; logMiss(null, angEx()); teach(angEx() + (G.k === "trig" ? "" : ".  0° — gorizontal, 45° — diagonal, 90° — tik"), "hint", 4000); } }
        }
        needTxt = cur == null ? "" : inTol ? "✔ Ushlab turing: " + Math.max(1, Math.ceil(HOLD_A - holdT)) + " s" : (((tg.a - cur + 180) % 180) < 90 ? "⤴ yana +" : "⤵ yana −") + Math.round(diff) + "°";
      },
      draw: function () {
        var l = line(); if (!l) { ctx.fillStyle = "#cfd8ef"; ctx.font = "600 16px " + FONT; ctx.textAlign = "center"; ctx.fillText(mouseMode ? "Ekranni bosib burchak yasang" : "Qo'lni (yoki ikkala qo'lni) kameraga ko'rsating · ekranga bosish, raqam yozish yoki 🎤 aytish ham mumkin", W / 2, H * 0.5); return; }
        var c = l.a, ang = cur * Math.PI / 180, R0 = Math.max(60, Math.min(W, H) * 0.16);
        var dx = l.b.x - l.a.x, dy = l.b.y - l.a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        ctx.strokeStyle = "#ffffff55"; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(c.x - R0 * 1.6, c.y); ctx.lineTo(c.x + R0 * 1.8, c.y); ctx.stroke(); ctx.setLineDash([]);
        var ok = inTol;
        ctx.strokeStyle = ok ? "#5ee67a" : TH.acc; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 20; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(l.a.x - ux * R0 * 1.5, l.a.y - uy * R0 * 1.5); ctx.lineTo(l.b.x + ux * 40, l.b.y + uy * 40); ctx.stroke(); ctx.shadowBlur = 0;
        // yoy
        ctx.fillStyle = (ok ? "#5ee67a" : TH.acc) + "33"; ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.arc(c.x, c.y, R0 * 0.7, 0, -ang, true); ctx.closePath(); ctx.fill();
        // maqsad burchak — xira chiziq
        var ta = tg.a * Math.PI / 180; ctx.strokeStyle = "#ffffff44"; ctx.lineWidth = 3; ctx.setLineDash([4, 8]); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.cos(ta) * R0 * 1.3, c.y - Math.sin(ta) * R0 * 1.3); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#fff"; ctx.font = "900 " + (U * 5 + 12) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = TH.acc; ctx.shadowBlur = 14;
        ctx.fillText(Math.round(cur) + "°", c.x + Math.cos(ang / 2) * R0 * 1.05, c.y - Math.sin(ang / 2) * R0 * 1.05 - 10); ctx.shadowBlur = 0;
        if (needTxt) { ctx.font = "800 " + (U * 2.4 + 10) + "px " + FONT; ctx.fillStyle = inTol ? "#5ee67a" : "#ffd479"; ctx.fillText(needTxt, c.x, c.y + R0 * 0.95 + 18); }
        // 3·2·1 sanoq: burchak uchida halqa to'lib boradi, ichida qolgan soniya
        if (holdT > 0) {
          var rr = Math.max(24, R0 * 0.34), sec = Math.max(1, Math.ceil(HOLD_A - holdT)), col = inTol ? "#5ee67a" : "#ffd479";
          ctx.fillStyle = "rgba(8,14,28,.78)"; ctx.beginPath(); ctx.arc(c.x, c.y, rr, 0, Math.PI * 2); ctx.fill();
          ctx.lineWidth = 5; ctx.strokeStyle = "#ffffff22"; ctx.beginPath(); ctx.arc(c.x, c.y, rr, 0, Math.PI * 2); ctx.stroke();
          ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(c.x, c.y, rr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, holdT / HOLD_A)); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.fillStyle = "#fff"; ctx.font = "900 " + Math.round(rr * 1.15) + "px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(sec, c.x, c.y + 2);
        }
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
      var bx = Math.max(12, W * 0.03), by = (FREE ? 60 : 118) + hudShift, side = W > 700 ? 150 : 0, bw = W - bx * 2 - side, bh = H - by - (side ? (FREE ? 70 : 18) : (FREE ? 205 : 92));
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
    // Mavzuli poyga: darvozalarda amal emas, savol javoblari (to'g'risi tezlikni oshiradi, noto'g'risi kamaytiradi)
    var TOPIC = G.k !== "poyga" && TOPICS[G.k] ? TOPICS[G.k] : null, lastQ = null;
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
    function opTxt(o) { if (TOPIC) return o.s + (o.ok ? " ✓" : " ✗"); return o.k !== "add" ? o.s : o.s + (/[×:+²(]/.test(o.s.slice(1)) ? " = " + (o.sign > 0 ? "+" : "−") + o.v : ""); }
    function gapNow() { var m = 0; racers.forEach(function (r) { if (r.human) m = Math.max(m, r.sp); }); return 230 + m * 0.45; }
    function makeRow(z) {
      if (TOPIC) { var q = askQ(TOPIC), o3 = makeOpts(q, 3); while (o3.length < 3) o3.push({ s: "?", ok: false }); return { z: z, q: q, ops: o3.slice(0, 3).map(function (x) { return x.ok ? { sign: 1, k: "mul", v: lvl() >= 4 ? 1.5 : 1.3, s: x.s, ok: true } : { sign: -1, k: "div", v: 1.7, s: x.s, ok: false }; }), done: {} }; }
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
          var col = TOPIC && done == null ? "#3b82f6" : o.sign > 0 ? "#22c55e" : "#ef4444";
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
      if (TOPIC && me.i === 0 && nxt && nxt.q !== lastQ) { lastQ = nxt.q; qEl.style.display = ""; showQ(nxt.q); }
      if (TOPIC) top += qEl.offsetHeight + 4;
      if (nxt) {
        var cw = Math.min(118, (V.w - 40) / 3), chh = small ? 30 : 36, x0 = V.x + V.w / 2 - cw * 1.5 - 6;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        nxt.ops.forEach(function (o, li) {
          ctx.fillStyle = TOPIC ? "rgba(59,130,246,.85)" : o.sign > 0 ? "rgba(34,197,94,.85)" : "rgba(239,68,68,.85)"; rr(x0 + li * (cw + 6), top, cw, chh, 9); ctx.fill();
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
        setQ(""); qEl.style.display = "none"; lastQ = null;
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
              if (TOPIC) { if (o.ok) { S.up++; S.dn = 0; if (S.up >= 3 && S.lv < 5) { S.lv++; S.up = 0; S.maxLv = Math.max(S.maxLv, S.lv); banner("⬆ " + S.lv + "-daraja!", TH.acc2); } ftext(cx, cy - 130, qDone(rw.q, o.s), "#fff"); } else { S.dn++; S.up = 0; if (S.dn >= 2) { S.dn = 0; if (S.lv > 1) S.lv--; } logMiss(rw.q); teach((n > 1 ? PNAME[r.i] + ": " : "") + rw.q.e, false); } return; }
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
  // Kengaytma mexanikalari (alohida JS fayl): dvigatel ichki funksiyalariga kirish
  if (EXT && EXT.install) EXT.install(M, {
    get ctx() { return ctx; }, get W() { return W; }, get H() { return H; }, get U() { return U; }, get FONT() { return FONT; }, get TH() { return TH; }, get G() { return G; },
    get CFG() { return CFG; }, get S() { return S; }, get hands() { return hands; }, get pointers() { return pointers; }, get mouseMode() { return mouseMode; }, get t() { return tGlobal; },
    TOPICS: TOPICS, lvl: lvl, askQ: askQ, showQ: showQ, setQ: setQ, makeOpts: makeOpts, good: good, bad: bad, qDone: qDone, beep: beep, tone: tone, burst: burst, ftext: ftext,
    drawBox: drawBox, drawBall: drawBall, fitFont: fitFont, teach: teach, banner: banner, rr: rr, R: R, pick: pick, shuffle: shuffle, clamp: clamp, mstr: mstr, dec: dec, Qz: Qz, typ: typ, lv: lv, esc: esc
  });
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
      else { if (S.freeze > 0) S.freeze -= rdt; else S.left -= rdt; if (S.left <= 0) { S.left = 0; endGame(); } else mech.update(dt * spd()); }
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
        try { localStorage.setItem("kav.cfg", JSON.stringify({ hands: CFG.hands, duel: CFG.duel, video: CFG.video, racers: CFG.racers, diff: CFG.diff, gmode: CFG.gmode, sinf: CFG.sinf })); } catch (er) {}
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
      (function () { var bst = PR.load().st[G.id] || 0; return '<div class="kv-st" style="font-size:22px;letter-spacing:3px" title="Eng yaxshi natija">' + starsHTML(bst) + "</div>"; })() +
      "<p>" + MK.how + "</p>" +
      '<div class="kv-chips"><span>📶 Daraja 1–5: 3 ta to\'g\'ri → ⬆, 2 ta xato → ⬇</span><span>👑 Har 5-savol — boss (×3, +10 s)</span><span>🔥 Kombo ×2 / ×3</span><span>❄️ 5 ketma-ket — vaqt muzlaydi</span></div>' +
      '<p style="font-size:13px;color:#ffd479;margin:6px 0 0">🧠 Xato qilsangiz — to\'g\'ri yechim ko\'rsatiladi va o\'sha misol keyinroq yana so\'raladi. O\'yin oxirida xatolaringiz ro\'yxati chiqadi.</p>' +
      '<div class="kv-opts">' +
      '<div class="kv-opt"><b>✋ Qo\'llar soni (kamera sezadi)</b>' + segHTML("hands", [1, 2, 3, 4], ["1", "2", "3", "4"]) + "</div>" +
      '<div class="kv-opt" style="grid-column:1/-1"><b>🎚 Qiyinlik darajasi</b>' + segHTML("diff", [1, 2, 3], ["🟢 Oson", "🟡 O\'rta", "🔴 Qiyin"]) + "</div>" +
      '<div class="kv-opt" style="grid-column:1/-1"><b>🎓 Sinf — savollar shunga moslab boshlanadi (o\'yin davomida 1–5-daraja o\'zi o\'zgaradi)</b>' + segHTML("sinf", [0, 3, 5, 6, 7, 8, 9, 10, 11], ["Umumiy", "1–4", "5", "6", "7", "8", "9", "10–11", "Texnikum"]) + "</div>" +
      (G.m === "poyga" ? '<div class="kv-opt"><b>🏎 O\'yinchilar soni</b>' + segHTML("racers", [1, 2, 3, 4], ["1", "2", "3", "4"]) + "</div>" : G.m === "grafik" ? '<div class="kv-opt"><b>📝 Doska rejimi</b>' + segHTML("gmode", ["vazifa", "erkin"], ["Vazifa", "Erkin doska"]) + "</div>" : '<div class="kv-opt"><b>👥 Rejim</b>' + segHTML("duel", [false, true], ["Yakka", "Duel (2 kishi)"]) + "</div>") +
      '<div class="kv-opt"><b>📷 Kamera tasviri</b>' + segHTML("video", [true, false], ["Ko'rinsin", "Faqat skelet"]) + "</div>" +
      '<div class="kv-opt"><b>⏱ Vaqt</b>' + (G.m === "poyga" ? segHTML("time", [60, 120, 180], ["60 s", "120 s", "180 s"]) : G.m === "grafik" ? segHTML("time", [120, 180, 300], ["2 daq", "3 daq", "5 daq"]) : segHTML("time", [60, 90, 120], ["60 s", "90 s", "120 s"])) + "</div>" +
      "</div>" +
      (err ? '<div class="kv-err">' + err + "</div>" : "") +
      '<button class="kv-btn" id="kv-go">▶ Kamera bilan boshlash</button>' +
      '<div class="kv-row"><button class="kv-btn gh" id="kv-mouse">🖱 Kamerasiz (sichqoncha/sensor)</button><a class="kv-btn gh" href="virtual.html">📋 Barcha o\'yinlar</a></div>' +
      '<div class="kv-daily"><b>📅 Bugungi topshiriqlar</b>' + PR.rows() + "</div>" +
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
    S.lv = startLevel(); S.maxLv = S.lv; S.up = 0; S.dn = 0; S.qn = 0; S.bosses = 0; S.freeze = 0; S.fifty = 0; S.fast = 0; S.qT = 0; S.curQ = null; S.base = 0; S.nb = []; S.cam = !mouseMode; S.recent = []; bq = [];
    musicStart();
    mech = M[G.m](); mech.start(); subEl.innerHTML = G.m === "grafik" ? "" : MK.how;
    setTimeout(syncAnsBar, 3300);
    setTimeout(function () { subEl.textContent = ""; }, 9000);
    beep(440, 0.1); setTimeout(function () { beep(440, 0.1); }, 1000); setTimeout(function () { beep(440, 0.1); }, 2000); setTimeout(function () { beep(880, 0.3); }, 3000);
  }
  function endGame() {
    S.run = false; if (mech && mech.stop) mech.stop(); musicStop(); teachEl.className = "kv-teach"; syncAnsBar();
    if (recOn) { recOn = false; try { rec.stop(); } catch (e) {} micBtn.classList.remove("on"); } var tot = S.score.reduce(function (a, b) { return a + b; }, 0), b = best(), rec = false;
    var my = CFG.duel ? Math.max(S.score[0], S.score[1]) : S.score[0];
    if (my > b) { rec = true; try { localStorage.setItem(LS_BEST, my); } catch (e) {} }
    // --- yulduzlar, kunlik topshiriqlar, nishonlar ---
    var nAns = S.ok + S.bad, acc = nAns ? S.ok / nAns : 0, stars = 0;
    if (G.m === "grafik") stars = S.ok >= 5 && acc >= 0.8 ? 3 : S.ok >= 3 ? 2 : S.ok >= 1 ? 1 : 0;
    else stars = acc >= 0.9 && S.ok >= 10 && S.maxLv >= 3 ? 3 : acc >= 0.75 && S.ok >= 6 ? 2 : acc >= 0.5 && S.ok >= 3 ? 1 : 0;
    var PD = PR.load(), prevSt = PD.st[G.id] || 0; if (stars > prevSt) PD.st[G.id] = stars;
    PD.pl[G.id] = (PD.pl[G.id] || 0) + 1; if (S.cam) PD.cam = (PD.cam || 0) + 1;
    var DY = PR.dayData(PD), V = DY.v; V.tj += S.ok; V.oy[G.id] = 1; if (stars >= 2) V.y2 = 1; V.bs += S.bosses; V.sr = Math.max(V.sr, S.best); if (G.fan === "fizika") V.fz = 1; V.lv = Math.max(V.lv, S.maxLv); if (S.cam) V.km = 1; V.ko[G.id] = 1;
    var TS = PR.tasks(), newly = [];
    TS.forEach(function (t) { if (!DY.done[t.id] && PR.prog(DY, t) >= t.k) { DY.done[t.id] = 1; newly.push(t); } });
    var allNew = !DY.all && TS.every(function (t) { return DY.done[t.id]; });
    if (allNew) { DY.all = 1; PD.ds = PD.ds && PD.ds.last === PR.day(-1) ? { last: DY.d, n: PD.ds.n + 1 } : PD.ds && PD.ds.last === DY.d ? PD.ds : { last: DY.d, n: 1 }; }
    PR.save(PD);
    award("ilk"); if (acc === 1 && nAns >= 10) award("aniq"); if (stars === 3) award("st3");
    var P2 = PR.load(), n3 = 0, nfz = 0; for (var gk in P2.st) { if (P2.st[gk] === 3) n3++; var gg = GAMES[gk - 1]; if (gg && gg.fan === "fizika" && P2.st[gk] >= 2) nfz++; }
    var npl = Object.keys(P2.pl).length;
    if (n3 >= 5) award("usta"); if (nfz >= 5) award("fiz"); if (npl >= 10) award("o10"); if (npl >= 30) award("o30"); if ((P2.cam || 0) >= 10) award("kam"); if (P2.ds && P2.ds.n >= 3) award("kun3"); if (P2.ds && P2.ds.n >= 7) award("kun7");
    if (newly.length) banner("✅ Kunlik topshiriq bajarildi!" + (allNew ? " Hammasi! 🎉" : ""), "#5ee67a");
    var coins = Math.floor(S.base / 10) + newly.length * 5 + (allNew ? 10 : 0), gave = false;
    try { if (coins > 0 && window.kaAccount && window.kaAccount.me()) gave = window.kaAccount.addCoins(coins, "Virtual: " + G.t); } catch (e) {}
    try { if (window.kaAccount && window.kaAccount.me() && (S.ok + S.bad) > 0) window.kaAccount.sendResult("Virtual: " + G.t, S.ok, S.ok + S.bad); } catch (e) {}
    qEl.textContent = "";
    var res = CFG.duel
      ? '<div class="kv-big">🔵 ' + S.score[0] + " : " + S.score[1] + ' 🔴</div><p style="font-size:20px;font-weight:800;color:#fff">' + (S.score[0] === S.score[1] ? "Durang! 🤝" : (S.score[0] > S.score[1] ? "1-o'yinchi" : "2-o'yinchi") + " g'olib! 🏆") + "</p>"
      : '<div class="kv-big">⭐ ' + S.score[0] + "</div>";
    if (mech && mech.result) { var mres = mech.result(); res = mres.html; if (mres.my > b && !rec) { rec = true; try { localStorage.setItem(LS_BEST, mres.my); } catch (e) {} } my = mres.my; }
    ov.style.display = "flex";
    ov.innerHTML = '<div class="kv-card"><span class="kv-tag">' + G.t + "</span><h1>" + (rec ? "🎉 Yangi rekord!" : "O'yin tugadi") + "</h1>" + res +
      starsHTML(stars, true) +
      '<div class="kv-chips"><span>📶 Eng yuqori daraja: ' + S.maxLv + '/5</span><span>👑 Boss: ' + S.bosses + '</span><span>🎯 Aniqlik: ' + Math.round(acc * 100) + "%</span>" + (stars > prevSt && prevSt ? "<span>🆙 Yulduz rekordi!</span>" : "") + "</div>" +
      (stars < 3 && G.m !== "grafik" ? '<p class="kv-note" style="margin-top:0">★★★ uchun: kamida 10 ta to\'g\'ri javob, 90% aniqlik va 3-darajaga chiqish</p>' : "") +
      "<p>✅ To'g'ri: <b>" + S.ok + "</b> &nbsp; ❌ Xato: <b>" + S.bad + "</b> &nbsp; 🔥 Eng uzun seriya: <b>" + S.best + "</b> &nbsp; 🏅 Rekord: <b>" + Math.max(b, my) + "</b></p>" +
      (S.nb.length ? '<p style="margin:8px 0 0;color:#ffd479;font-weight:800">🏅 Yangi nishonlar</p><div class="kv-nb">' + S.nb.map(function (x) { return "<span>" + x[1] + " " + esc(x[2]) + "</span>"; }).join("") + "</div>" : "") +
      '<div class="kv-daily"><b>📅 Bugungi topshiriqlar' + (allNew ? " — hammasi bajarildi! +10 🪙" : "") + "</b>" + PR.rows(newly) + "</div>" +
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
