/*!
 * Kuvonch Academy — viktorina uchun fanlar: Mantiq, Ingliz tili, Rus tili
 * kaSavol.register(id, fn, title) orqali ulanadi (ka-savollar.js dan keyin yuklanadi).
 * Ingliz va rus tili lug'atlari saytning o'z ma'lumotlaridan olinadi (english/assets, rus-tili/assets) —
 * ular faqat shu mavzu tanlanganda yuklanadi: kaFan.prep(["e1","r1"]).then(...)
 * ES5 — eski telefonlarda ham ishlaydi.
 */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle;
  function Q(q, a, w, steps) {
    a = String(a);
    var seen = {}, out = []; seen[a] = 1;
    (w || []).forEach(function (x) { x = String(x); if (!seen[x] && x !== "") { seen[x] = 1; out.push(x); } });
    return { q: q, a: a, w: out, steps: steps ? [].concat(steps) : [], lang: S.lang() };
  }
  // son javob uchun yaqin noto'g'ri variantlar (musbat bo'lsa musbat)
  function nw(a, extra, spread) {
    var out = (extra || []).filter(function (x) { return x !== a && !(a > 0 && x <= 0); });
    H.nearW(a, 8, spread).forEach(function (x) { if (out.length < 5 && out.indexOf(x) < 0 && x !== a && !(a > 0 && x <= 0)) out.push(x); });
    return out;
  }
  function seq(t) { return "Keyingi sonni toping:<br><b>" + t.join(", ") + ", ?</b>"; }
  // so'nggi savollar takrorlanmasin (bank uchun)
  var RECENT = {};
  function pickFresh(key, arr, n) {
    var r = RECENT[key] || (RECENT[key] = []), lim = Math.min(n || 12, Math.floor(arr.length / 2)), it, g = 0;
    do { it = pick(arr); g++; } while (r.indexOf(it) > -1 && g < 30);
    r.push(it); if (r.length > lim) r.shift();
    return it;
  }
  // bank: [daraja, savol, javob, [noto'g'rilar], izoh]
  function bank(key, items, L) {
    var lv = items.filter(function (b) { return b[0] === L; });
    if (lv.length < 3) lv = items.filter(function (b) { return Math.abs(b[0] - L) <= 1; });
    var b = pickFresh(key + L, lv.length ? lv : items);
    return Q(b[1], b[2], shuffle(b[3]), b[4] ? [b[4]] : []);
  }

  /* =====================================================================
   *  🧠 MANTIQ
   * ===================================================================== */
  // m1 — sonli ketma-ketliklar
  function m1(L) {
    var kinds = L === 1 ? ["ar", "geo", "ar", "sq", "dec"] : L === 2 ? ["alt", "fib", "sq", "geo", "ar2", "cube"] : ["diff2", "muladd", "fib", "prime", "alt3", "cube", "sqk"];
    var k = pick(kinds), t = [], a, ex, i, s, d;
    if (k === "ar") { d = R(2, 9); s = R(1, 20); for (i = 0; i < 5; i++) t.push(s + d * i); a = s + 5 * d; ex = "Har safar " + d + " qo'shiladi: " + t[4] + " + " + d + " = " + a + "."; return Q(seq(t), a, nw(a, [a + d, a - d, a + 1]), ex); }
    if (k === "dec") { d = R(2, 7); s = R(40, 90); for (i = 0; i < 5; i++) t.push(s - d * i); a = s - 5 * d; ex = "Har safar " + d + " ayriladi: " + t[4] + " − " + d + " = " + a + "."; return Q(seq(t), a, nw(a, [a - d, a + d, a - 1]), ex); }
    if (k === "ar2") { d = R(11, 25); s = R(5, 60); for (i = 0; i < 5; i++) t.push(s + d * i); a = s + 5 * d; ex = "Ayirma doimiy: " + d + ". " + t[4] + " + " + d + " = " + a + "."; return Q(seq(t), a, nw(a, [a + d, a - d, a + 10]), ex); }
    if (k === "geo") { var r = L === 1 ? pick([2, 3]) : pick([2, 3, 4, 5]); s = R(1, L === 1 ? 4 : 6); for (i = 0; i < 4; i++) t.push(s * Math.pow(r, i)); a = t[3] * r; ex = "Har safar " + r + " ga ko'paytiriladi: " + t[3] + " · " + r + " = " + a + "."; return Q(seq(t), a, nw(a, [a + r, t[3] + r, a * r, a - t[3]]), ex); }
    if (k === "alt") { var x = R(1, 5), y = R(6, 12); s = R(1, 9); t = [s]; for (i = 1; i < 6; i++) t.push(t[i - 1] + (i % 2 ? x : y)); a = t[5] + y; ex = "Ayirmalar navbatma-navbat +" + x + ", +" + y + ": " + t[5] + " + " + y + " = " + a + "."; return Q(seq(t), a, nw(a, [t[5] + x, a + x, a - 1]), ex); }
    if (k === "alt3") { var p1 = R(2, 3), q1 = R(1, 6); s = R(1, 5); t = [s]; for (i = 1; i < 6; i++) t.push(i % 2 ? t[i - 1] * p1 : t[i - 1] + q1); a = t[5] + q1; ex = "Navbat bilan: ×" + p1 + ", +" + q1 + ". Oxirgisi " + t[5] + " + " + q1 + " = " + a + "."; return Q(seq(t), a, nw(a, [t[5] * p1, a + q1, a - 1]), ex); }
    if (k === "fib") { var f1 = R(1, 6), f2 = R(2, 9); t = [f1, f2]; for (i = 2; i < (L === 3 ? 7 : 6); i++) t.push(t[i - 1] + t[i - 2]); a = t[t.length - 1] + t[t.length - 2]; ex = "Har bir son oldingi ikkitasining yig'indisi: " + t[t.length - 2] + " + " + t[t.length - 1] + " = " + a + "."; return Q(seq(t), a, nw(a, [t[t.length - 1] * 2, a + 1, a - t[0]]), ex); }
    if (k === "sq" || k === "sqk") { var kk = k === "sqk" ? R(-3, 6) : 0, o = R(1, 4); for (i = o; i < o + 4; i++) t.push(i * i + kk); a = (o + 4) * (o + 4) + kk; ex = "Sonlar n²" + (kk ? (kk > 0 ? " + " + kk : " − " + (-kk)) : "") + " ko'rinishida: " + (o + 4) + "²" + (kk ? (kk > 0 ? " + " + kk : " − " + (-kk)) : "") + " = " + a + "."; return Q(seq(t), a, nw(a, [a + 1, a - 1, t[3] + 2 * (o + 3), a + 2]), ex); }
    if (k === "cube") { var c0 = R(1, 3); for (i = c0; i < c0 + 4; i++) t.push(i * i * i); a = Math.pow(c0 + 4, 3); ex = "Sonlar kublar: " + (c0 + 4) + "³ = " + a + "."; return Q(seq(t), a, nw(a, [Math.pow(c0 + 4, 2), a + 1, Math.pow(c0 + 5, 3), a - 10]), ex); }
    if (k === "prime") { var P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61], st0 = R(0, 10); t = P.slice(st0, st0 + 5); a = P[st0 + 5]; ex = "Bular ketma-ket tub sonlar: " + t[4] + " dan keyingi tub son " + a + "."; return Q(seq(t), a, nw(a, [a + 2, a - 2, a + 1, t[4] + 2]), ex); }
    if (k === "diff2") { s = R(1, 8); d = R(1, 3); t = [s]; var c = d; for (i = 1; i < 5; i++) { t.push(t[i - 1] + c); c++; } a = t[4] + c; ex = "Ayirmalar 1 ga ortib boradi: " + d + ", " + (d + 1) + ", " + (d + 2) + ", " + (d + 3) + ", keyingisi " + c + ". " + t[4] + " + " + c + " = " + a + "."; return Q(seq(t), a, nw(a, [t[4] + c - 1, a + 1, a + c]), ex); }
    var m = pick([2, 3]), cc = pick([1, -1, 2]); s = R(cc < 0 ? 2 : 1, 4); t = [s]; for (i = 1; i < 4; i++) t.push(t[i - 1] * m + cc); a = t[3] * m + cc;
    ex = "Qoida: oldingi son · " + m + (cc > 0 ? " + " + cc : " − " + (-cc)) + ". " + t[3] + " → " + a + ".";
    return Q(seq(t), a, nw(a, [t[3] * m, a + 1, t[3] + t[2]]), ex);
  }

  // m2 — ortiqchasini toping
  var CATS = {
    "mevalar": ["olma", "nok", "o'rik", "shaftoli", "uzum", "anor", "gilos", "olcha", "behi", "xurmo"],
    "sabzavotlar": ["sabzi", "kartoshka", "piyoz", "karam", "bodring", "sholg'om", "lavlagi", "turp"],
    "uy hayvonlari": ["sigir", "qo'y", "echki", "ot", "tuya", "eshak"],
    "qushlar": ["chumchuq", "burgut", "laylak", "musicha", "qarg'a", "kaptar", "lochin"],
    "geometrik shakllar": ["kvadrat", "uchburchak", "romb", "trapetsiya", "to'rtburchak", "beshburchak"],
    "transport vositalari": ["avtobus", "poyezd", "samolyot", "velosiped", "tramvay", "kema"],
    "musiqa asboblari": ["dutor", "rubob", "g'ijjak", "nay", "tanbur", "karnay", "pianino"],
    "fasllar": ["bahor", "yoz", "kuz", "qish"],
    "kasblar": ["shifokor", "o'qituvchi", "haydovchi", "oshpaz", "duradgor", "muhandis"],
    "ranglar": ["qizil", "yashil", "sariq", "ko'k", "oq", "qora"],
    "matematik amallar": ["qo'shish", "ayirish", "ko'paytirish", "bo'lish"],
    "o'lchov birliklari (uzunlik)": ["metr", "santimetr", "kilometr", "millimetr", "detsimetr"]
  };
  var CAT_KEYS = Object.keys(CATS);
  function m2(L) {
    var v = L === 1 ? R(0, 2) : L === 2 ? R(0, 4) : R(2, 5), nums, a, ex, k;
    if (v === 0 || v === 1) { // so'zlar
      var c1 = pick(CAT_KEYS.filter(function (x) { return CATS[x].length >= 4 || v === 0; })), c2;
      do { c2 = pick(CAT_KEYS); } while (c2 === c1);
      var three = shuffle(CATS[c1]).slice(0, 3); a = pick(CATS[c2]);
      var o = shuffle(three.concat([a]));
      return { q: "Qaysi so'z ortiqcha?<br><b>" + o.join(", ") + "</b>", a: a, w: three, steps: [three.join(", ") + " — " + c1 + "; " + a + " esa " + c2 + " guruhidan."], lang: S.lang() };
    }
    if (v === 2) { k = pick([3, 4, 6, 7, 9]); nums = shuffle([2, 3, 4, 5, 6, 7, 8, 9, 11, 12]).slice(0, 3).map(function (x) { return x * k; }); a = R(10, 70); while (a % k === 0) a++; ex = a + " soni " + k + " ga bo'linmaydi, qolganlari bo'linadi."; }
    else if (v === 3) { nums = shuffle([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53]).slice(0, 3); a = pick([15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 57, 91]); ex = a + " tub emas (" + (function (n) { for (var i = 3; i < n; i++) if (n % i === 0) return i + " · " + (n / i); return ""; })(a) + "), qolganlari tub sonlar."; }
    else if (v === 4) { nums = shuffle([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]).slice(0, 3); a = pick([12, 20, 32, 40, 50, 60, 72, 90]); ex = a + " to'la kvadrat emas, qolganlari kvadrat sonlar."; }
    else { // juft/toq + xonali
      var odd = Math.random() < 0.5; nums = []; while (nums.length < 3) { var n0 = R(11, 99); if ((n0 % 2 === 1) === odd && nums.indexOf(n0) < 0) nums.push(n0); }
      a = R(11, 99); if ((a % 2 === 1) === odd) a++; ex = a + (odd ? " juft" : " toq") + " son, qolganlari " + (odd ? "toq." : "juft.");
    }
    var all = shuffle(nums.concat([a]));
    return { q: "Qaysi son boshqalaridan farq qiladi?<br><b>" + all.join(", ") + "</b>", a: String(a), w: nums.map(String), steps: [ex], lang: S.lang() };
  }

  // m3 — harflar, kunlar va soat
  var DAYS = ["dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba", "yakshanba"];
  var MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  var ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function letW(i, offs) { var o = []; offs.forEach(function (x) { var c = ABC[i + x]; if (c && o.indexOf(c) < 0) o.push(c); }); return o; }
  function hhmm(m) { m = ((m % 1440) + 1440) % 1440; var h = Math.floor(m / 60), mm = m % 60; return h + ":" + (mm < 10 ? "0" : "") + mm; }
  function m3(L) {
    var v = L === 1 ? pick(["let", "day", "mon"]) : L === 2 ? pick(["let", "day", "clock", "mon", "day"]) : pick(["day2", "clock2", "let2", "mon2"]);
    var a, i, t = [];
    if (v === "let" || v === "let2") {
      var d = v === "let" ? pick([1, 2, 3]) : pick([2, 3, 4]), s0 = R(0, 23 - 4 * d);
      if (v === "let2" && Math.random() < 0.5) { // kamayib boruvchi
        s0 = R(4 * d + 1, 25); for (i = 0; i < 4; i++) t.push(ABC[s0 - d * i]); a = ABC[s0 - 4 * d];
        return Q("Harflar qatorini davom ettiring:<br><b>" + t.join(", ") + ", ?</b>", a, letW(s0 - 4 * d, [1, -1, 2, -2, d]), ["Har safar lotin alifbosida " + d + " harf orqaga: " + t[3] + " → " + a + "."]);
      }
      for (i = 0; i < 4; i++) t.push(ABC[s0 + d * i]); a = ABC[s0 + 4 * d];
      return Q("Harflar qatorini davom ettiring:<br><b>" + t.join(", ") + ", ?</b>", a, letW(s0 + 4 * d, [1, -1, 2, -2, -d]), ["Har safar lotin alifbosida " + d + " harf oldinga: " + t[3] + " → " + a + "."]);
    }
    if (v === "day" || v === "day2") {
      var dd = R(0, 6), n = v === "day" ? R(2, 20) : R(25, 200), back = v === "day2" && Math.random() < 0.4;
      a = DAYS[((dd + (back ? -n : n)) % 7 + 7) % 7];
      var wd = [1, 2, 3, 6].map(function (x) { return DAYS[((dd + (back ? -n : n) + x) % 7 + 7) % 7]; });
      return Q("Bugun <b>" + DAYS[dd] + "</b>. " + n + " kun" + (back ? " oldin" : "dan keyin") + " haftaning qaysi kuni " + (back ? "bo'lgan" : "bo'ladi") + "?", a, wd, [n + " = 7 · " + Math.floor(n / 7) + " + " + (n % 7) + " — to'liq haftalar kunni o'zgartirmaydi, faqat " + (n % 7) + " kun " + (back ? "orqaga" : "oldinga") + " sanaymiz."]);
    }
    if (v === "mon" || v === "mon2") {
      var mi = R(0, 11), k = v === "mon" ? R(2, 11) : R(13, 40);
      a = MONTHS[(mi + k) % 12];
      return Q("Hozir <b>" + MONTHS[mi] + "</b>. " + k + " oydan keyin qaysi oy bo'ladi?", a, [1, 2, 11, 10].map(function (x) { return MONTHS[(mi + k + x) % 12]; }), [k + " oy = " + Math.floor(k / 12) + " yil + " + (k % 12) + " oy: " + MONTHS[mi] + "dan " + (k % 12) + " oy oldinga."]);
    }
    if (v === "clock") {
      var st = R(6, 20) * 60 + pick([0, 10, 15, 20, 30, 40, 45, 50]), dur = R(1, 3) * 60 + pick([5, 15, 20, 25, 35, 40, 50]);
      a = hhmm(st + dur);
      return Q("Dars soat <b>" + hhmm(st) + "</b> da boshlandi va " + Math.floor(dur / 60) + " soat " + (dur % 60) + " daqiqa davom etdi. Qachon tugadi?", a, [hhmm(st + dur + 60), hhmm(st + dur - 10), hhmm(st + dur + 10), hhmm(st + Math.floor(dur / 60) * 100 % 1440)], [hhmm(st) + " + " + Math.floor(dur / 60) + " soat = " + hhmm(st + Math.floor(dur / 60) * 60) + ", yana " + (dur % 60) + " daqiqa → " + a + "."]);
    }
    // clock2 — soat millari orasidagi burchak (butun soatda) yoki ikki vaqt orasidagi farq
    if (Math.random() < 0.5) {
      var h = R(1, 11), ang = Math.min(h * 30, 360 - h * 30);
      return Q("Soat aynan <b>" + h + ":00</b> ni ko'rsatmoqda. Soat va daqiqa millari orasidagi kichik burchak necha gradus?", ang + "°", [(ang + 30) + "°", Math.abs(ang - 30) + "°", (h * 6) + "°", (360 - ang) + "°"].filter(function (x) { return x !== ang + "°" && x !== "0°"; }), ["Har bir soat oralig'i 360° : 12 = 30°. " + h + " oraliq → " + (h * 30) + "°" + (h > 6 ? ", kichigi 360° − " + (h * 30) + "° = " + ang + "°" : "") + "."]);
    }
    var s1 = R(7, 12) * 60 + pick([0, 15, 20, 30, 45]), s2 = s1 + R(2, 9) * 60 + pick([10, 25, 35, 50]), df = s2 - s1;
    a = Math.floor(df / 60) + " soat " + (df % 60) + " daqiqa";
    return Q("Poyezd <b>" + hhmm(s1) + "</b> da jo'nab, <b>" + hhmm(s2) + "</b> da yetib keldi. Yo'lda qancha vaqt bo'ldi?", a, [(Math.floor(df / 60) + 1) + " soat " + (df % 60) + " daqiqa", Math.floor(df / 60) + " soat " + ((df % 60 + 10) % 60) + " daqiqa", (Math.floor(df / 60) - 1) + " soat " + (df % 60) + " daqiqa", Math.floor(df / 60) + " soat " + (60 - df % 60) + " daqiqa"].filter(function (x) { return !/^-|^0 soat 0/.test(x); }), [hhmm(s2) + " − " + hhmm(s1) + " = " + a + "."]);
  }

  // m4 — mantiqiy xulosa (sillogizmlar)
  var SYL = [ // [guruh (ko'plik), birlik, xususiyat, misol, guruhga kirmaydigan]
    ["qushlar", "qush", "tuxum qo'yadi", "laylak", "mushuk"], ["sutemizuvchilar", "sutemizuvchi", "bolasini sut bilan boqadi", "delfin", "timsoh"],
    ["metallar", "metall", "elektr tokini o'tkazadi", "mis", "shisha"], ["kvadratlar", "kvadrat", "to'rtta teng tomonga ega", "ABCD", "uchburchak"],
    ["juft sonlar", "juft son", "2 ga bo'linadi", "48", "37"], ["daraxtlar", "daraxt", "ildizga ega", "chinor", "tosh"],
    ["baliqlar", "baliq", "jabra bilan nafas oladi", "zog'ora baliq", "kit"], ["hasharotlar", "hasharot", "oltita oyoqqa ega", "chumoli", "o'rgimchak"],
    ["yulduzlar", "yulduz", "o'zidan yorug'lik chiqaradi", "Quyosh", "Oy"], ["tub sonlar", "tub son", "faqat 1 ga va o'ziga bo'linadi", "13", "15"]
  ];
  var SOME = [["o'quvchilar", "o'quvchi", "shaxmat o'ynaydi", "Aziz"], ["sportchilar", "sportchi", "suzishni biladi", "Kamola"], ["shifokorlar", "shifokor", "ingliz tilini biladi", "Doniyor"], ["haydovchilar", "haydovchi", "Samarqandda yashaydi", "Rustam"], ["talabalar", "talaba", "kutubxonaga boradi", "Malika"]];
  var LOGIC_BANK = [
    [1, "Yomg'ir yog'sa, yer ho'l bo'ladi. Bugun yomg'ir yog'di. Xulosa?", "Yer ho'l", ["Yer quruq", "Yomg'ir to'xtamaydi", "Hech narsa deyib bo'lmaydi"], "«Agar A bo'lsa, B» va A bajarilsa — B ham bajariladi."],
    [2, "Yomg'ir yog'sa, yer ho'l bo'ladi. Yer ho'l emas. Xulosa?", "Yomg'ir yog'magan", ["Yomg'ir yog'gan", "Yer ho'l bo'ladi", "Aniq emas"], "Natija bo'lmasa, sabab ham bo'lmagan (kontrapozitsiya)."],
    [3, "Yomg'ir yog'sa, yer ho'l bo'ladi. Yer ho'l. Xulosa?", "Yomg'ir yog'gan bo'lishi shart emas", ["Albatta yomg'ir yog'gan", "Yomg'ir yog'magan", "Yer quruq"], "Yer boshqa sababdan (masalan, sug'orishdan) ham ho'l bo'lishi mumkin."],
    [1, "A = B va B = C bo'lsa, A va C haqida nima deyish mumkin?", "A = C", ["A > C", "A < C", "Aniq emas"], "Tenglik tranzitiv: A = B = C."],
    [2, "A > B va B > C bo'lsa, qaysi biri to'g'ri?", "A > C", ["C > A", "A = C", "B > A"], "A > B > C."],
    [2, "Hamma mushuklar hayvon. Ba'zi hayvonlar uyda yashaydi. Qaysi xulosa albatta to'g'ri?", "Albatta to'g'ri xulosa yo'q", ["Hamma mushuk uyda yashaydi", "Hech bir mushuk uyda yashamaydi", "Hamma hayvon mushuk"], "«Ba'zi hayvonlar» ichida mushuklar bo'lishi shart emas."],
    [3, "«Hamma o'quvchilar sport bilan shug'ullanadi» degan gapning inkori qaysi?", "Kamida bitta o'quvchi sport bilan shug'ullanmaydi", ["Hech bir o'quvchi sport bilan shug'ullanmaydi", "Hamma o'quvchi sportni yoqtiradi", "Ba'zi o'quvchilar sport bilan shug'ullanadi"], "«Hamma» ning inkori — «kamida bittasi … emas»."],
    [3, "«Ba'zi talabalar a'lochi» gapining inkori qaysi?", "Hech bir talaba a'lochi emas", ["Hamma talabalar a'lochi", "Ba'zi talabalar a'lochi emas", "Bitta talaba a'lochi"], "«Ba'zi … » (kamida bittasi) ning inkori — «hech biri … emas»."],
    [1, "Sanjar Akmaldan baland, Akmal Bekzoddan baland. Eng past kim?", "Bekzod", ["Sanjar", "Akmal", "Aniq emas"], "Sanjar > Akmal > Bekzod."],
    [2, "Qutida faqat qizil va ko'k qalamlar bor. Qizil qalam olinmasa, qanday qalam olingan?", "Ko'k", ["Qizil", "Sariq", "Aniq emas"], "Faqat ikki tur bor — biri bo'lmasa, ikkinchisi."],
    [3, "Bir kishi: «Men hozir yolg'on gapiryapman» dedi. Bu gap haqida nima deyish mumkin?", "Bu paradoks — rost ham, yolg'on ham deb bo'lmaydi", ["Rost", "Yolg'on", "Har doim rost"], "Rost desak — yolg'on bo'ladi, yolg'on desak — rost bo'ladi (yolg'onchi paradoksi)."],
    [2, "To'g'ri chiziqlar a ∥ b va b ∥ c. a va c qanday joylashgan?", "a ∥ c", ["a ⊥ c", "kesishadi", "aniq emas"], "Parallellik tranzitiv."],
    [3, "Har bir juft son 2 ga bo'linadi. 2 ga bo'linadigan son albatta juftmi?", "Ha", ["Yo'q", "Ba'zan", "Faqat musbat bo'lsa"], "2 ga bo'linish va juftlik — bir xil xossa (teng kuchli)."],
    [3, "Har bir kvadrat — romb. Har bir romb kvadratmi?", "Yo'q", ["Ha", "Faqat katta romb", "Aniq emas"], "Burchaklari to'g'ri bo'lmagan romb kvadrat emas."]
  ];
  function m4(L) {
    var v = L === 1 ? R(0, 2) : L === 2 ? R(0, 3) : R(1, 4);
    if (v >= 3 || (L > 1 && v === 1 && Math.random() < 0.5)) return bank("m4", LOGIC_BANK, L);
    if (v === 2) {
      var o = pick(SOME);
      return Q("Ba'zi " + o[0] + " " + o[2] + ". " + o[3] + " — " + o[1] + ". " + o[3] + " haqida qaysi xulosa to'g'ri?", "Aniq xulosa chiqarib bo'lmaydi", [o[3] + " albatta " + o[2], o[3] + " " + neg(o[2]), o[3] + " " + o[1] + " emas"], ["«Ba'zi» — hammasi emas. " + o[3] + " o'sha «ba'zi»lar ichida bo'lishi ham, bo'lmasligi ham mumkin."]);
    }
    var y = pick(SYL);
    if (v === 0) return Q("Barcha " + y[0] + " " + y[2] + ". " + cap(y[3]) + " — " + y[0] + "dan biri. Xulosa?", cap(y[3]) + " " + y[2], [cap(y[3]) + " " + neg(y[2]), "Hech narsa deyib bo'lmaydi", cap(y[3]) + " " + y[1] + " emas"], ["Umumiy qoida guruhning har bir a'zosiga tegishli."]);
    return Q("Barcha " + y[0] + " " + y[2] + ". " + cap(y[4]) + " " + neg(y[2]) + ". Xulosa?", cap(y[4]) + " " + y[1] + " emas", [cap(y[4]) + " " + y[1], "Aniq xulosa yo'q", cap(y[4]) + " " + y[2]], ["Agar " + y[4] + " " + y[1] + " bo'lganida, bu xossaga ega bo'lardi. Xossa yo'q — demak, " + y[1] + " emas (kontrapozitsiya)."]);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function neg(p) { // "tuxum qo'yadi" -> "tuxum qo'ymaydi"
    var w = p.split(" "), last = w.pop(), n = last;
    if (/adi$/.test(last)) n = last.replace(/adi$/, "maydi"); else if (/ydi$/.test(last)) n = last.replace(/ydi$/, "ymaydi"); else if (/ega$/.test(last)) n = last + " emas"; else n = last + " emas";
    if (/ga ega$/.test(p)) return p.replace(/ga ega$/, "ga ega emas");
    if (/ega$/.test(last)) return w.concat([last, "emas"]).join(" ");
    return w.concat([n]).join(" ");
  }

  // m5 — tartiblash va taqqoslash
  var NAMES = ["Ali", "Vali", "Sami", "Hasan", "Dilnoza", "Bobur", "Zafar", "Laylo", "Madina", "Jasur", "Nodira", "Sardor"];
  var REL = [["baland", "past", "Eng baland", "Eng past"], ["katta (yoshi)", "kichik (yoshi)", "Eng katta", "Eng kichik"], ["og'ir", "yengil", "Eng og'ir", "Eng yengil"], ["tez yuguradi", "sekin yuguradi", "Eng tez", "Eng sekin"]];
  function m5(L) {
    var n = L === 1 ? 3 : L === 2 ? 4 : 5, nm = shuffle(NAMES).slice(0, n), r = pick(REL), st = [], i;
    // nm[0] eng ... (r[0]) — tartib: nm[0] > nm[1] > ...
    for (i = 0; i < n - 1; i++) st.push(Math.random() < 0.5 || L === 1 ? nm[i] + " " + nm[i + 1] + "dan " + r[0].replace(/ \(yoshi\)/, "") + "." : nm[i + 1] + " " + nm[i] + "dan " + r[1].replace(/ \(yoshi\)/, "") + ".");
    var askTop = Math.random() < 0.5, askMid = L === 3 && Math.random() < 0.4, a, ex = nm.join(" > ");
    var label = r[0].indexOf("yoshi") > -1 ? "yoshi " : "";
    if (askMid) { a = nm[2]; return Q(shuffle(st).join(" ") + "<br>Tartibda o'rtada kim turadi?", a, nm.filter(function (x) { return x !== a; }), ["Tartib: " + ex + " → o'rtada " + a + "."]); }
    a = askTop ? nm[0] : nm[n - 1];
    return Q(shuffle(st).join(" ") + "<br><b>" + (askTop ? r[2] : r[3]) + "</b> kim?", a, nm.filter(function (x) { return x !== a; }).concat(["Aniqlab bo'lmaydi"]), ["Tartib" + (label ? " (yoshi bo'yicha)" : "") + ": " + ex + "."]);
  }

  // m6 — mantiqiy masalalar
  function m6(L) {
    var v = L === 1 ? pick(["legs", "stairs", "cut", "age"]) : L === 2 ? pick(["legs2", "hand", "age", "cut2", "pages"]) : pick(["legs2", "hand", "age3", "pages", "socks", "train"]);
    var a;
    if (v === "legs") { var c = R(2, 9), d = R(2, 9); a = c * 2 + d * 4; return Q("Hovlida " + c + " ta tovuq va " + d + " ta quyon bor. Ularning hammasida jami nechta oyoq bor?", a, nw(a, [(c + d) * 4, (c + d) * 2, c * 4 + d * 2]), [c + " · 2 + " + d + " · 4 = " + a + "."]); }
    if (v === "legs2") { var hh = R(8, 20), q2 = R(2, hh - 2), legs = (hh - q2) * 2 + q2 * 4; return Q("Hovlida tovuqlar va quyonlar bor: jami " + hh + " ta bosh va " + legs + " ta oyoq. Nechta quyon bor?", q2, nw(q2, [hh - q2, q2 + 1, q2 - 1, q2 + 2]), ["Hammasi tovuq bo'lsa: " + hh + " · 2 = " + (hh * 2) + " oyoq. Ortiqcha " + (legs - hh * 2) + " oyoq — har quyonda +2: " + (legs - hh * 2) + " : 2 = " + q2 + "."]); }
    if (v === "stairs") { var f = R(3, 9), fl = R(2, f - 1); return Q("Uyda " + fl + "-qavatga chiqish uchun 1-qavatdan " + (fl - 1) * 18 + " ta zinapoya bosiladi. " + f + "-qavatga chiqish uchun nechta zinapoya bosiladi?", (f - 1) * 18, [f * 18, (f - 2) * 18, (f + 1) * 18, Math.round(18 * (fl - 1) * f / fl)].filter(function (x) { return x !== (f - 1) * 18 && x > 0; }), ["Har qavat oralig'i: " + (fl - 1) * 18 + " : " + (fl - 1) + " = 18 zinapoya. " + f + "-qavatgacha " + (f - 1) + " oraliq: " + (f - 1) + " · 18 = " + ((f - 1) * 18) + "."]); }
    if (v === "cut" || v === "cut2") { var p = v === "cut" ? R(3, 9) : R(6, 15), m = R(2, 6); a = (p - 1) * m; return Q("Yog'ochni bir marta arralash " + m + " daqiqa davom etadi. Uni " + p + " bo'lakka ajratish uchun necha daqiqa kerak?", a, nw(a, [p * m, (p + 1) * m, (p - 2) * m], m), [p + " bo'lak uchun " + (p - 1) + " ta kesish kerak: " + (p - 1) + " · " + m + " = " + a + " daqiqa."]); }
    if (v === "age") { var s = R(5, 14), k = R(3, 5), sum = s * (k + 1); return Q("Ota o'g'lidan " + k + " marta katta. Ularning yoshlari yig'indisi " + sum + ". O'g'il necha yoshda?", s, nw(s, [sum / k, s * k, s + 2]), ["O'g'il x yosh, ota " + k + "x: x + " + k + "x = " + sum + " → x = " + s + "."]); }
    if (v === "age3") { var son = R(5, 12), dad = son + R(22, 32), y = (dad - 2 * son); if (y <= 0) { son = 6; dad = 34; y = 22; } return Q("Ota " + dad + " yoshda, o'g'li " + son + " yoshda. Necha yildan keyin ota o'g'lidan 2 marta katta bo'ladi?", y, nw(y, [y + 2, dad - son, y - 1]), [dad + " + x = 2 · (" + son + " + x) → x = " + dad + " − 2 · " + son + " = " + y + "."]); }
    if (v === "hand") { var n = R(4, L === 3 ? 14 : 9); a = n * (n - 1) / 2; return Q("Uchrashuvda " + n + " kishi har biri qolganlar bilan bir martadan qo'l berib ko'rishdi. Jami necha marta qo'l berib ko'rishildi?", a, nw(a, [n * (n - 1), n * n, n * (n + 1) / 2]), ["Har kishi " + (n - 1) + " kishi bilan ko'rishadi, har juftlik ikki marta sanalmasligi uchun: " + n + " · " + (n - 1) + " : 2 = " + a + "."]); }
    if (v === "pages") { var pg = R(L === 3 ? 100 : 20, L === 3 ? 400 : 99), dig = pg <= 9 ? pg : pg <= 99 ? 9 + (pg - 9) * 2 : 9 + 180 + (pg - 99) * 3; return Q("Kitob sahifalari 1 dan " + pg + " gacha raqamlangan. Raqamlashda jami nechta raqam yozilgan?", dig, nw(dig, [pg * 2, pg * 3, dig - 9], 12), ["1–9: 9 ta" + (pg > 9 ? ", 10–" + Math.min(pg, 99) + ": " + (Math.min(pg, 99) - 9) + " · 2 = " + (Math.min(pg, 99) - 9) * 2 : "") + (pg > 99 ? ", 100–" + pg + ": " + (pg - 99) + " · 3 = " + (pg - 99) * 3 : "") + ". Jami " + dig + "."]); }
    if (v === "socks") { var col = R(2, 6); a = col + 1; return Q("Qorong'i xonadagi qutida " + col + " xil rangdagi ko'p paypoqlar bor. Bir xil rangli juftlik albatta chiqishi uchun kamida nechta paypoq olish kerak?", a, [col, col * 2, col + 2, 2], ["Har rangdan bittadan " + col + " ta olinishi mumkin; keyingisi (" + a + "-chi) albatta biror rang bilan juft bo'ladi (Dirixle prinsipi)."]); }
    var v1 = R(4, 9) * 10, v2 = R(3, 8) * 10, t = R(2, 5), dist = (v1 + v2) * t;
    return Q("Ikki shahar orasidagi masofa " + dist + " km. Ulardan bir vaqtda bir-biriga qarab ikki avtomobil chiqdi: " + v1 + " km/soat va " + v2 + " km/soat tezlik bilan. Necha soatdan keyin uchrashadi?", t, nw(t, [t + 1, Math.max(1, t - 1), dist / v1].map(function (x) { return Math.round(x * 10) / 10; })), ["Yaqinlashish tezligi " + v1 + " + " + v2 + " = " + (v1 + v2) + " km/soat. " + dist + " : " + (v1 + v2) + " = " + t + " soat."]);
  }

  S.register("m1", m1, "Mantiq · Sonli ketma-ketliklar");
  S.register("m2", m2, "Mantiq · Ortiqchasini toping");
  S.register("m3", m3, "Mantiq · Harflar, kunlar, oylar va soat");
  S.register("m4", m4, "Mantiq · Mantiqiy xulosa (sillogizmlar)");
  S.register("m5", m5, "Mantiq · Tartiblash va taqqoslash");
  S.register("m6", m6, "Mantiq · Mantiqiy masalalar");

  /* =====================================================================
   *  🇬🇧 INGLIZ TILI
   * ===================================================================== */
  var BOOK_LV = ["", "A1", "A2", "B1", "B1+", "B2", "C1"];
  function enWords(b) {
    var B = window.EN_WORDS && window.EN_WORDS[b]; if (!B) return null;
    if (B._flat) return B._flat;
    var out = [];
    B.forEach(function (u) { (u.w || []).forEach(function (w) { if (w && w.w && w.uz) out.push(w); }); });
    B._flat = out; return out;
  }
  function shortUz(s) {
    s = String(s).replace(/\s*\([^)]*\)/g, "").split(";")[0];
    var parts = s.split(","), r = parts[0].trim();
    if (parts[1] && (r + ", " + parts[1].trim()).length <= 30) r += ", " + parts[1].trim();
    return r.length > 40 ? r.slice(0, 38) + "…" : r;
  }
  function enVocab(b) {
    return function (L) {
      var W = enWords(b); if (!W || W.length < 8) return null;
      var w = pickFresh("en" + b, W, 40), same = W.filter(function (x) { return x.ps === w.ps && x.w !== w.w; });
      if (same.length < 6) same = W.filter(function (x) { return x.w !== w.w; });
      var others = shuffle(same).slice(0, 8), mode = L === 1 ? pick([0, 0, 1]) : L === 2 ? pick([0, 1, 1, 2]) : pick([1, 2, 2]);
      var re = new RegExp("\\b" + w.w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      if (mode === 2 && w.ex && re.test(w.ex)) {
        var gap = w.ex.replace(re, "_____");
        return Q("Gapni to'ldiring:<br><i>" + gap + "</i>", w.w, others.map(function (x) { return x.w; }).filter(function (x) { return !new RegExp("\\b" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(gap); }), [w.ex + " — " + (w.exu || "")]);
      }
      var uz = shortUz(w.uz);
      if (mode === 1) return Q("«<b>" + uz + "</b>» inglizcha qanday bo'ladi?", w.w, others.map(function (x) { return x.w; }), [w.w + " " + (w.ip || "") + " — " + uz + (w.ex ? ". " + w.ex : "")]);
      var wu = []; others.forEach(function (x) { var s = shortUz(x.uz); if (s !== uz && wu.indexOf(s) < 0) wu.push(s); });
      return Q("<b>" + w.w + "</b> " + (w.ip || "") + " so'zining tarjimasi?", uz, wu, [w.w + " — " + uz + (w.ex ? ". " + w.ex + " — " + (w.exu || "") : "")]);
    };
  }
  for (var bk = 1; bk <= 6; bk++) S.register("e" + bk, enVocab(bk), "Ingliz tili · Lug'at " + BOOK_LV[bk] + " (4000 Essential Words " + bk + ")");

  // e7 — to be va Present Simple
  var SUBJ = [["I", "am", "do", 1], ["You", "are", "do", 2], ["He", "is", "does", 3], ["She", "is", "does", 3], ["It", "is", "does", 3], ["We", "are", "do", 2], ["They", "are", "do", 2], ["My brother", "is", "does", 3], ["Our teachers", "are", "do", 2], ["The cat", "is", "does", 3], ["Ali and Vali", "are", "do", 2], ["My mother", "is", "does", 3]];
  var VERBS = [["play", "plays", "football"], ["read", "reads", "books"], ["watch", "watches", "TV"], ["go", "goes", "to school"], ["do", "does", "homework"], ["study", "studies", "English"], ["work", "works", "in a bank"], ["drink", "drinks", "tea"], ["wash", "washes", "the dishes"], ["fly", "flies", "kites"], ["have", "has", "breakfast"], ["cook", "cooks", "plov"], ["teach", "teaches", "maths"], ["speak", "speaks", "Uzbek"], ["fix", "fixes", "cars"]];
  var BE_REST = ["a student", "at home", "happy", "from Tashkent", "in the classroom", "tired", "very kind", "ready"];
  function e7(L) {
    var s = pick(SUBJ), v = pick(VERBS), k = L === 1 ? pick(["be", "be", "ps"]) : L === 2 ? pick(["ps", "neg", "q", "be"]) : pick(["neg", "q", "ps3", "beq"]);
    var rest = pick(BE_REST);
    if (k === "be") return Q(s[0] + " _____ " + rest + ".", s[1], ["am", "is", "are", "be"].filter(function (x) { return x !== s[1]; }), [s[0] + " → " + s[1] + " (I am; he/she/it is; we/you/they are)."]);
    if (k === "beq") return Q("_____ " + s[0].toLowerCase().replace(/^i$/, "I") + " " + rest + "?", cap(s[1]), ["Am", "Is", "Are", "Do", "Does"].filter(function (x) { return x !== cap(s[1]); }), ["So'roq gapda to be oldinga chiqadi: " + cap(s[1]) + " " + (s[0] === "I" || /^[A-Z][a-z]+ and/.test(s[0]) ? s[0] : s[0].charAt(0).toLowerCase() + s[0].slice(1)) + " …?"]);
    var form = s[3] === 3 ? v[1] : v[0];
    if (k === "ps" || k === "ps3") return Q(s[0] + " _____ (" + v[0] + ") " + v[2] + " every day.", form, [v[0], v[1], v[0] + "ing", v[0] === "have" ? "had" : v[0] + "ed", "is " + v[0] + "ing"].filter(function (x) { return x !== form; }), ["Present Simple: " + (s[3] === 3 ? "he/she/it + fe'l + -s/-es → " : "I/you/we/they + fe'l → ") + form + "."]);
    if (k === "neg") return Q(s[0] + " _____ " + v[0] + " " + v[2] + " on Sundays.", s[2] + "n't", ["don't", "doesn't", "isn't", "aren't", "not"].filter(function (x) { return x !== s[2] + "n't"; }), ["Inkor: " + (s[3] === 3 ? "he/she/it + doesn't" : "I/you/we/they + don't") + " + fe'l (o'zak)."]);
    return Q("_____ " + (s[0] === "I" ? "I" : s[0].charAt(0).toLowerCase() + s[0].slice(1)).replace(/^ali/, "Ali").replace(/^i$/, "I") + " " + v[0] + " " + v[2] + "?", cap(s[2]), ["Do", "Does", "Is", "Are", "Am"].filter(function (x) { return x !== cap(s[2]); }), ["So'roq: " + (s[3] === 3 ? "Does + he/she/it" : "Do + I/you/we/they") + " + fe'l?"]);
  }
  S.register("e7", e7, "Ingliz tili · To be va Present Simple");

  // e8 — noto'g'ri fe'llar (Past Simple / V3)
  var IRR = [["be", "was/were", "been", "bo'lmoq"], ["begin", "began", "begun", "boshlamoq"], ["break", "broke", "broken", "sindirmoq"], ["bring", "brought", "brought", "olib kelmoq"], ["build", "built", "built", "qurmoq"], ["buy", "bought", "bought", "sotib olmoq"], ["catch", "caught", "caught", "tutmoq"], ["choose", "chose", "chosen", "tanlamoq"], ["come", "came", "come", "kelmoq"], ["cost", "cost", "cost", "turmoq (narx)"], ["cut", "cut", "cut", "kesmoq"], ["do", "did", "done", "qilmoq"], ["draw", "drew", "drawn", "chizmoq"], ["drink", "drank", "drunk", "ichmoq"], ["drive", "drove", "driven", "haydamoq"], ["eat", "ate", "eaten", "yemoq"], ["fall", "fell", "fallen", "yiqilmoq"], ["feel", "felt", "felt", "his qilmoq"], ["find", "found", "found", "topmoq"], ["fly", "flew", "flown", "uchmoq"], ["forget", "forgot", "forgotten", "unutmoq"], ["get", "got", "got", "olmoq"], ["give", "gave", "given", "bermoq"], ["go", "went", "gone", "bormoq"], ["grow", "grew", "grown", "o'smoq"], ["have", "had", "had", "ega bo'lmoq"], ["hear", "heard", "heard", "eshitmoq"], ["keep", "kept", "kept", "saqlamoq"], ["know", "knew", "known", "bilmoq"], ["leave", "left", "left", "tark etmoq"], ["lose", "lost", "lost", "yo'qotmoq"], ["make", "made", "made", "yasamoq"], ["meet", "met", "met", "uchratmoq"], ["pay", "paid", "paid", "to'lamoq"], ["put", "put", "put", "qo'ymoq"], ["read", "read", "read", "o'qimoq"], ["ride", "rode", "ridden", "minmoq"], ["run", "ran", "run", "yugurmoq"], ["say", "said", "said", "aytmoq"], ["see", "saw", "seen", "ko'rmoq"], ["sell", "sold", "sold", "sotmoq"], ["send", "sent", "sent", "jo'natmoq"], ["sing", "sang", "sung", "kuylamoq"], ["sit", "sat", "sat", "o'tirmoq"], ["sleep", "slept", "slept", "uxlamoq"], ["speak", "spoke", "spoken", "gapirmoq"], ["spend", "spent", "spent", "sarflamoq"], ["stand", "stood", "stood", "turmoq"], ["swim", "swam", "swum", "suzmoq"], ["take", "took", "taken", "olmoq"], ["teach", "taught", "taught", "o'rgatmoq"], ["tell", "told", "told", "aytib bermoq"], ["think", "thought", "thought", "o'ylamoq"], ["understand", "understood", "understood", "tushunmoq"], ["wear", "wore", "worn", "kiymoq"], ["win", "won", "won", "yutmoq"], ["write", "wrote", "written", "yozmoq"]];
  function ed(v) { return /e$/.test(v) ? v + "d" : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + "ied" : v + "ed"; }
  function e8(L) {
    var v = pickFresh("e8", IRR, 20), k = L === 1 ? "v2" : L === 2 ? pick(["v2", "sent", "v3"]) : pick(["v3", "sent", "sent3"]);
    var others = shuffle(IRR.filter(function (x) { return x !== v; })).slice(0, 2);
    if (v[0] === "be" && k !== "v2") k = "v2";
    if (k === "v2") return Q("<b>" + v[0] + "</b> (" + v[3] + ") fe'lining Past Simple (V2) shakli?", v[1], [ed(v[0]), v[2], v[0] + "s", v[0] + "ing", others[0][1]], [v[0] + " — " + v[1] + " — " + v[2]]);
    if (k === "v3") return Q("<b>" + v[0] + "</b> fe'lining uchinchi shakli (V3, Past Participle)?", v[2], [ed(v[0]), v[1], v[0] + "en", v[0] + "ing", others[0][2]], [v[0] + " — " + v[1] + " — " + v[2]]);
    var who = pick(["I", "She", "We", "My father", "They", "He"]);
    if (k === "sent") return Q("Yesterday " + who.replace(/^(?!I\b)\w/, function (c) { return c.toLowerCase(); }) + " _____ (" + v[0] + ").", v[1], [ed(v[0]), v[2], v[0] + "s", v[0], "will " + v[0]], ["«Yesterday» — Past Simple: " + v[0] + " → " + v[1] + "."]);
    return Q(who + " " + (who === "I" || who === "We" || who === "They" ? "have" : "has") + " just _____ (" + v[0] + ").", v[2], [v[1], ed(v[0]), v[0] + "s", v[0] + "ing", v[0], others[0][2]], ["Present Perfect: have/has + V3 → " + v[2] + "."]);
  }
  S.register("e8", e8, "Ingliz tili · Noto'g'ri fe'llar (V2, V3)");

  // e9 — artikl, ko'plik, predloglar
  var AN = ["apple", "egg", "orange", "umbrella", "elephant", "hour", "honest man", "idea", "ice cream", "old car", "English book", "island", "uncle", "artist", "engineer"];
  var A_ = ["book", "car", "university", "uniform", "European city", "house", "one-way street", "dog", "teacher", "banana", "useful tip", "pen", "window", "year", "horse"];
  var PLUR = [["child", "children"], ["man", "men"], ["woman", "women"], ["tooth", "teeth"], ["foot", "feet"], ["mouse", "mice"], ["sheep", "sheep"], ["box", "boxes"], ["city", "cities"], ["knife", "knives"], ["leaf", "leaves"], ["wife", "wives"], ["potato", "potatoes"], ["tomato", "tomatoes"], ["baby", "babies"], ["boy", "boys"], ["bus", "buses"], ["watch", "watches"], ["day", "days"], ["glass", "glasses"], ["goose", "geese"], ["dish", "dishes"]];
  var TIME_P = [["in", "July"], ["in", "2010"], ["in", "winter"], ["in", "the morning"], ["in", "the evening"], ["on", "Monday"], ["on", "Friday"], ["on", "5 May"], ["on", "my birthday"], ["at", "7 o'clock"], ["at", "night"], ["at", "noon"], ["at", "half past six"], ["in", "the 21st century"], ["on", "Sunday morning"]];
  var PLACE_P = [["in", "the box", "qutining ichida"], ["on", "the table", "stol ustida"], ["under", "the bed", "karavot tagida"], ["next to", "the door", "eshik yonida"], ["between", "the two chairs", "ikki stul orasida"], ["behind", "the house", "uy orqasida"], ["in front of", "the school", "maktab oldida"]];
  function plWrong(s, p) { var w = [s + "s", s + "es", p + "s"]; if (s === p) w.push(s + "ies", s + "en"); if (/y$/.test(s)) w.push(s.slice(0, -1) + "ies"); if (/f$|fe$/.test(s)) w.push(s.replace(/fe?$/, "ves")); return w.filter(function (x) { return x !== p; }); }
  function e9(L) {
    var k = L === 1 ? pick(["art", "plur", "place"]) : L === 2 ? pick(["art", "plur", "time", "place"]) : pick(["art2", "plur", "time", "time"]);
    if (k === "art" || k === "art2") {
      var isAn = Math.random() < 0.5, nn = pick(isAn ? AN : A_), hard = /^(hour|honest|university|uniform|European|one-way|useful)/.test(nn);
      if (k === "art2" && !hard) { nn = pick(["hour", "honest man", "university", "uniform", "European city", "one-way street", "useful tip"]); isAn = /^(hour|honest)/.test(nn); }
      var ans = isAn ? "an" : "a";
      return Q("Noaniq artikl qaysi biri: ___ <b>" + nn + "</b>?", ans, ["a", "an", "ikkalasi ham to'g'ri", "artikl qo'yilmaydi"].filter(function (x) { return x !== ans; }), [/^(hour|honest)/.test(nn) ? "«h» o'qilmaydi — unli tovush bilan boshlanadi → an." : /^(university|uniform|European|one-way|useful)/.test(nn) ? "Unli harf bo'lsa ham undosh tovush ([j]/[w]) bilan boshlanadi → a." : "Unli tovush oldidan — an, undosh tovush oldidan — a."]);
    }
    if (k === "plur") { var p = pick(L === 1 ? PLUR.slice(9) : PLUR); return Q("<b>" + p[0] + "</b> so'zining ko'plik shakli?", p[1], plWrong(p[0], p[1]).concat([p[0]]).filter(function (x) { return x !== p[1]; }), [p[0] + " → " + p[1]]); }
    if (k === "time") { var t = pick(TIME_P); return Q("Predlogni tanlang: I was born ___ <b>" + t[1] + "</b>.", t[0], ["in", "on", "at", "to"].filter(function (x) { return x !== t[0]; }), ["in — oy, yil, fasl, kun qismi; on — hafta kuni, sana; at — aniq vaqt, night, noon."]); }
    var pl = pick(PLACE_P);
    return Q("«Mushuk " + pl[2] + "» — inglizchasi: The cat is ___ " + pl[1] + ".", pl[0], shuffle(PLACE_P.map(function (x) { return x[0]; }).filter(function (x) { return x !== pl[0]; })).slice(0, 5), ["The cat is " + pl[0] + " " + pl[1] + " — mushuk " + pl[2] + "."]);
  }
  S.register("e9", e9, "Ingliz tili · Artikllar, ko'plik, predloglar");

  // e10 — sifat darajalari va zamonlar
  var ADJ = [["big", "bigger", "the biggest"], ["small", "smaller", "the smallest"], ["tall", "taller", "the tallest"], ["hot", "hotter", "the hottest"], ["happy", "happier", "the happiest"], ["easy", "easier", "the easiest"], ["good", "better", "the best"], ["bad", "worse", "the worst"], ["beautiful", "more beautiful", "the most beautiful"], ["interesting", "more interesting", "the most interesting"], ["expensive", "more expensive", "the most expensive"], ["fast", "faster", "the fastest"], ["long", "longer", "the longest"], ["cold", "colder", "the coldest"], ["difficult", "more difficult", "the most difficult"], ["young", "younger", "the youngest"], ["many", "more", "the most"], ["little", "less", "the least"]];
  var TENSES = [["She is reading a book now.", "Present Continuous"], ["I have already finished my homework.", "Present Perfect"], ["They played football yesterday.", "Past Simple"], ["He will come tomorrow.", "Future Simple"], ["We were watching TV at 8 pm yesterday.", "Past Continuous"], ["She had left before we arrived.", "Past Perfect"], ["I get up at 7 every day.", "Present Simple"], ["Look! It is raining.", "Present Continuous"], ["Have you ever been to Samarkand?", "Present Perfect"], ["My father works in a hospital.", "Present Simple"], ["I saw him last week.", "Past Simple"], ["They will travel to London next year.", "Future Simple"]];
  var MARK = [["every day", "Present Simple"], ["now", "Present Continuous"], ["at the moment", "Present Continuous"], ["yesterday", "Past Simple"], ["last year", "Past Simple"], ["tomorrow", "Future Simple"], ["next week", "Future Simple"], ["already", "Present Perfect"], ["ever / never", "Present Perfect"], ["usually", "Present Simple"], ["two days ago", "Past Simple"]];
  var TN = ["Present Simple", "Present Continuous", "Present Perfect", "Past Simple", "Past Continuous", "Past Perfect", "Future Simple"];
  function e10(L) {
    var k = L === 1 ? pick(["cmp", "mark"]) : L === 2 ? pick(["cmp", "sup", "mark", "tense"]) : pick(["sup", "tense", "tense", "cmp"]);
    if (k === "cmp" || k === "sup") {
      var a = pick(ADJ), ans = k === "cmp" ? a[1] : a[2];
      var w = k === "cmp" ? [a[0] + "er", "more " + a[0], a[2], a[0] + "est"] : ["the " + a[0] + "est", "the more " + a[0], a[1], "most " + a[0]];
      return Q((k === "cmp" ? "Qiyosiy daraja: " : "Orttirma daraja: ") + "<b>" + a[0] + "</b> → ?", ans, w.filter(function (x) { return x !== ans; }), [a[0] + " — " + a[1] + " — " + a[2]]);
    }
    if (k === "mark") { var m = pick(MARK); return Q("«<b>" + m[0] + "</b>» so'zi odatda qaysi zamon bilan ishlatiladi?", m[1], shuffle(TN.filter(function (x) { return x !== m[1]; })).slice(0, 4), [m[0] + " → " + m[1]]); }
    var t = pick(TENSES);
    return Q("Gap qaysi zamonda?<br><i>" + t[0] + "</i>", t[1], shuffle(TN.filter(function (x) { return x !== t[1]; })).slice(0, 4), [t[0] + " — " + t[1]]);
  }
  S.register("e10", e10, "Ingliz tili · Sifat darajalari va zamonlar");

  /* =====================================================================
   *  🇷🇺 RUS TILI
   * ===================================================================== */
  function ruWords() {
    var D = window.TETRAD_DAYS; if (!D) return null;
    if (D._flat) return D._flat;
    var out = [];
    D.forEach(function (d) { String(d.w || "").split("\n").forEach(function (ln) { var p = ln.split("|"); if (p.length === 3 && p[0].trim() && p[2].trim()) out.push({ ru: p[0].trim(), tr: p[1].trim(), uz: p[2].trim(), g: (/\((м|ж|ср)\)/.exec(p[2]) || [])[1] || "" }); }); });
    D._flat = out; return out;
  }
  function uzOf(x) { return shortUz(x.uz); }
  function ruPlain(s) { return s.replace(/́/g, ""); }
  function ruVocab(dir) {
    return function (L) {
      var W = ruWords(); if (!W || W.length < 8) return null;
      var w = pickFresh("ru" + dir, W, 40), ou = shuffle(W.filter(function (x) { return x !== w && !!x.g === !!w.g; })).slice(0, 8);
      if (dir === "uz") {
        var opts = []; ou.forEach(function (x) { var s = uzOf(x); if (s !== uzOf(w) && opts.indexOf(s) < 0) opts.push(s); });
        return Q("<b>" + w.ru + "</b> (" + w.tr + ") — tarjimasi?", uzOf(w), opts, [w.ru + " — " + uzOf(w)]);
      }
      var useTr = L === 1;
      return Q("«<b>" + uzOf(w) + "</b>» ruscha qanday bo'ladi?", useTr ? w.ru + " (" + w.tr + ")" : w.ru, ou.map(function (x) { return useTr ? x.ru + " (" + x.tr + ")" : x.ru; }), [w.ru + " [" + w.tr + "] — " + uzOf(w)]);
    };
  }
  S.register("r1", ruVocab("uz"), "Rus tili · Lug'at: ruscha → o'zbekcha");
  S.register("r2", ruVocab("ru"), "Rus tili · Lug'at: o'zbekcha → ruscha");

  // r3 — olmoshlar kelishiklarda
  var PR = { // [qaratqich/tushum (у ..., вижу ...), jo'nalish (дам ...), vosita (с ...), predl (о ...)]
    "я": { gen: "меня", acc: "меня", dat: "мне", ins: "мной", prep: "мне" },
    "ты": { gen: "тебя", acc: "тебя", dat: "тебе", ins: "тобой", prep: "тебе" },
    "он": { gen: "него", acc: "его", dat: "ему", ins: "ним", prep: "нём" },
    "она": { gen: "неё", acc: "её", dat: "ей", ins: "ней", prep: "ней" },
    "мы": { gen: "нас", acc: "нас", dat: "нам", ins: "нами", prep: "нас" },
    "вы": { gen: "вас", acc: "вас", dat: "вам", ins: "вами", prep: "вас" },
    "они": { gen: "них", acc: "их", dat: "им", ins: "ними", prep: "них" }
  };
  var PR_T = [
    ["gen", "У ___ есть новый телефон.", "Родительный падеж (кого?): у + "],
    ["acc", "Я хорошо знаю ___.", "Винительный падеж (кого?): "],
    ["acc", "Мама ждёт ___ дома.", "Винительный падеж (кого?): "],
    ["dat", "Учитель дал ___ книгу.", "Дательный падеж (кому?): "],
    ["dat", "Позвони ___ вечером!", "Дательный падеж (кому?): "],
    ["ins", "Мы пойдём в кино вместе с ___.", "Творительный падеж (с кем?): с + "],
    ["prep", "Все говорят о ___.", "Предложный падеж (о ком?): о + "]
  ];
  var PR_ALL = ["меня", "мне", "мной", "тебя", "тебе", "тобой", "его", "него", "ему", "ним", "нём", "её", "неё", "ей", "ней", "нас", "нам", "нами", "вас", "вам", "вами", "их", "них", "им", "ими", "ними"];
  function prForms(base) { var f = PR[base], o = []; if (!f) return o; for (var k in f) if (o.indexOf(f[k]) < 0) o.push(f[k]); return o; }
  function r3(L) {
    var P = window.TETRAD_PRON;
    if (P && L >= 2 && Math.random() < 0.6) {
      if (L === 3 && P.ex2 && P.ex2.length && Math.random() < 0.4) {
        var c = pickFresh("r3c", P.ex2, 6), right = c.o[c.a];
        return Q(c.q, right, c.o.filter(function (x) { return x !== right; }).concat(shuffle(PR_ALL.filter(function (x) { return c.o.indexOf(x) < 0; })).slice(0, 2)), [c.h || ""]);
      }
      var it = pickFresh("r3i", P.ex1, 12), base = (/\((я|ты|он|она|оно|мы|вы|они)\)\s*$/.exec(it.q) || [])[1], ans = it.a[0];
      var wr = prForms(base === "оно" ? "он" : base).concat(base ? [base] : []).filter(function (x) { return it.a.indexOf(x) < 0; });
      while (wr.length < 3) { var z = pick(PR_ALL); if (it.a.indexOf(z) < 0 && wr.indexOf(z) < 0) wr.push(z); }
      return Q(it.q, ans, wr, [it.h || ""]);
    }
    var t = pick(PR_T), keys = Object.keys(PR).filter(function (k) { return !(t[0] === "prep" && k === "я"); }), b = pick(keys), a = PR[b][t[0]];
    var w = prForms(b).concat([b]).filter(function (x) { return x !== a; });
    if (t[0] === "acc" && (b === "он" || b === "она" || b === "они")) w = w.filter(function (x) { return x !== PR[b].gen; }).concat([PR[b].gen === a ? "" : PR[b].gen]).filter(Boolean);
    return Q(t[1] + " <b>(" + b + ")</b>", a, w, [t[2] + a]);
  }
  S.register("r3", r3, "Rus tili · Olmoshlar kelishiklarda");

  // r4 — otlarning jinsi
  var GEN = { "м": "мужской род (м)", "ж": "женский род (ж)", "ср": "средний род (ср)" };
  function r4(L) {
    var W = ruWords(); if (!W) return null;
    var nouns = W.filter(function (x) { return x.g && x.ru.split(" ").length === 1; });
    if (L === 1) nouns = nouns.filter(function (x) { var p = ruPlain(x.ru); return x.g === "м" ? /[бвгджзклмнпрстфхцчшщ]$/.test(p) : x.g === "ж" ? /[ая]$/.test(p) : /[оеё]$/.test(p); });
    if (!nouns.length) return null;
    var n = pickFresh("r4" + L, nouns, 30), a = GEN[n.g];
    return Q("<b>" + n.ru + "</b> (" + uzOf(n) + ") — qaysi jinsda?", a, ["мужской род (м)", "женский род (ж)", "средний род (ср)", "общий род"].filter(function (x) { return x !== a; }), [ruPlain(n.ru) + " — " + a + ". Odatda: undosh/-й → м; -а/-я → ж; -о/-е → ср; -ь — ikkalasi ham bo'lishi mumkin."]);
  }
  S.register("r4", r4, "Rus tili · Otlarning jinsi (м, ж, ср)");

  // r5 — sonlar, hafta kunlari, oylar
  var RU_N = { 0: "ноль", 1: "один", 2: "два", 3: "три", 4: "четыре", 5: "пять", 6: "шесть", 7: "семь", 8: "восемь", 9: "девять", 10: "десять", 11: "одиннадцать", 12: "двенадцать", 13: "тринадцать", 14: "четырнадцать", 15: "пятнадцать", 16: "шестнадцать", 17: "семнадцать", 18: "восемнадцать", 19: "девятнадцать", 20: "двадцать", 30: "тридцать", 40: "сорок", 50: "пятьдесят", 60: "шестьдесят", 70: "семьдесят", 80: "восемьдесят", 90: "девяносто", 100: "сто", 200: "двести", 300: "триста", 400: "четыреста", 500: "пятьсот", 600: "шестьсот", 700: "семьсот", 800: "восемьсот", 900: "девятьсот" };
  function ruNum(n) {
    if (RU_N[n] != null) return RU_N[n];
    var h = Math.floor(n / 100) * 100, r = n % 100, out = [];
    if (h) out.push(RU_N[h]);
    if (r) { if (RU_N[r] != null) out.push(RU_N[r]); else { out.push(RU_N[Math.floor(r / 10) * 10]); if (r % 10) out.push(RU_N[r % 10]); } }
    return out.join(" ");
  }
  var RU_D = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
  var RU_M = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  function r5(L) {
    var k = L === 1 ? pick(["n1", "day", "mon"]) : L === 2 ? pick(["n2", "day", "mon", "n2"]) : pick(["n3", "n3", "n2r"]);
    if (k === "day") { var i = R(0, 6), dir = Math.random() < 0.5; return dir ? Q("<b>" + RU_D[i] + "</b> — qaysi kun?", DAYS[i], shuffle(DAYS.filter(function (x, j) { return j !== i; })).slice(0, 4), [RU_D[i] + " — " + DAYS[i]]) : Q("«<b>" + DAYS[i] + "</b>» ruscha?", RU_D[i], shuffle(RU_D.filter(function (x, j) { return j !== i; })).slice(0, 4), [DAYS[i] + " — " + RU_D[i]]); }
    if (k === "mon") { var m = R(0, 11); return Q("Yilning " + (m + 1) + "-oyi ruscha qanday ataladi?", RU_M[m], shuffle(RU_M.filter(function (x, j) { return j !== m; })).slice(0, 4), [(m + 1) + "-oy — " + MONTHS[m] + " — " + RU_M[m]]); }
    var n = k === "n1" ? R(1, 20) : k === "n2" || k === "n2r" ? R(21, 99) : R(101, 999);
    var cand = [n + 1, n - 1, n + 10, n - 10, n + 100, n + 2].filter(function (x) { return x > 0 && x < 1000 && x !== n; });
    if (k === "n2r" || (k === "n3" && Math.random() < 0.5)) return Q("<b>" + ruNum(n) + "</b> — qaysi son?", n, shuffle(cand).slice(0, 4), [ruNum(n) + " = " + n]);
    return Q("<b>" + n + "</b> soni ruscha qanday yoziladi?", ruNum(n), shuffle(cand).slice(0, 4).map(ruNum), [n + " — " + ruNum(n)]);
  }
  S.register("r5", r5, "Rus tili · Sonlar, hafta kunlari va oylar");

  // r6 — kundalik iboralar
  var RU_PH = [["Здравствуйте!", "Assalomu alaykum! (rasmiy)", "Здравствуйте, Анна Ивановна!", "Assalomu alaykum, Anna Ivanovna!"], ["Спасибо!", "Rahmat!", "Спасибо за помощь!", "Yordam uchun rahmat!"], ["Извините", "Kechirasiz", "Извините, я опоздал.", "Kechirasiz, kechikdim."], ["До свидания!", "Xayr! (rasmiy)", "До свидания, до завтра!", "Xayr, ertagacha!"], ["Как дела?", "Ishlaring qalay?", "Привет! Как дела?", "Salom! Ishlaring qalay?"], ["Меня зовут …", "Mening ismim …", "Меня зовут Азиз.", "Mening ismim Aziz."], ["Сколько стоит?", "Qancha turadi?", "Сколько стоит эта книга?", "Bu kitob qancha turadi?"], ["Я не понимаю", "Men tushunmayapman", "Извините, я не понимаю.", "Kechirasiz, men tushunmayapman."], ["Доброе утро!", "Xayrli tong!", "Доброе утро, мама!", "Xayrli tong, oyi!"], ["Спокойной ночи!", "Xayrli tun!", "Спокойной ночи, дети!", "Xayrli tun, bolalar!"], ["Который час?", "Soat necha?", "Скажите, пожалуйста, который час?", "Ayting-chi, soat necha?"], ["Приятного аппетита!", "Yoqimli ishtaha!", "Приятного аппетита всем!", "Hammaga yoqimli ishtaha!"], ["С днём рождения!", "Tug'ilgan kuning bilan!", "С днём рождения, друг!", "Tug'ilgan kuning bilan, do'stim!"], ["Не за что", "Arzimaydi", "— Спасибо! — Не за что.", "— Rahmat! — Arzimaydi."], ["Удачи!", "Omad!", "Удачи на экзамене!", "Imtihonda omad!"], ["Где находится …?", "… qayerda joylashgan?", "Где находится вокзал?", "Vokzal qayerda joylashgan?"]];
  function r6(L) {
    var P = window.TETRAD_PRON, ALL = RU_PH.concat(P && P.phrases ? P.phrases : []);
    var ph = pickFresh("r6", ALL, 10), others = shuffle(ALL.filter(function (x) { return x !== ph; })).slice(0, 4);
    if (L === 1 || (L === 2 && Math.random() < 0.5)) return Q("«<b>" + ph[0] + "</b>» iborasining ma'nosi?", shortUz(ph[1]), others.map(function (x) { return shortUz(x[1]); }), [ph[2] + " — " + ph[3]]);
    return Q("«<b>" + shortUz(ph[1]) + "</b>» ruscha qanday aytiladi?", ph[0], others.map(function (x) { return x[0]; }), [ph[2] + " — " + ph[3]]);
  }
  S.register("r6", r6, "Rus tili · Kundalik iboralar");

  /* =====================================================================
   *  Ma'lumot fayllarini kerak bo'lganda yuklash
   * ===================================================================== */
  var BASE = (function () {
    try { var sc = document.currentScript || document.querySelector('script[src*="ka-savollar-fanlar.js"]'); return sc && sc.src ? sc.src.replace(/[^\/]*$/, "") : ""; } catch (e) { return ""; }
  })();
  var NEED = {
    e1: ["english/assets/words-b1.js"], e2: ["english/assets/words-b2.js"], e3: ["english/assets/words-b3.js"],
    e4: ["english/assets/words-b4.js"], e5: ["english/assets/words-b5.js"], e6: ["english/assets/words-b6.js"],
    r1: ["rus-tili/assets/lugat-data.js"], r2: ["rus-tili/assets/lugat-data.js"], r4: ["rus-tili/assets/lugat-data.js"],
    r3: ["rus-tili/assets/mashq-data.js"], r6: ["rus-tili/assets/mashq-data.js"]
  };
  var LOADED = {};
  function addJs(src) {
    if (LOADED[src]) return LOADED[src];
    LOADED[src] = new Promise(function (ok) { var s = document.createElement("script"); s.src = BASE + src; s.onload = ok; s.onerror = function () { delete LOADED[src]; ok(); }; document.head.appendChild(s); });
    return LOADED[src];
  }
  window.kaFan = {
    need: function (ids) { var o = []; (ids || []).forEach(function (id) { (NEED[id] || []).forEach(function (f) { if (o.indexOf(f) < 0) o.push(f); }); }); return o; },
    prep: function (ids) { return Promise.all(window.kaFan.need(ids).map(addJs)); },
    // node testlari uchun
    loadNode: function (root, vm, ctx, fs) { var all = {}; for (var k in NEED) NEED[k].forEach(function (f) { all[f] = 1; }); for (var f in all) vm.runInContext(fs.readFileSync(root + "/" + f, "utf8"), ctx, { filename: f }); }
  };
})();
