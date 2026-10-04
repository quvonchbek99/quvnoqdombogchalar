/*! Kuvonch Academy — savol zaxirasini kengaytirish: stereometriya tushunchalari va trigonometrik tenglamalar */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, ms = H.ms, nearW = H.nearW;
  function wT(r, l) { return l.filter(function (x) { return x !== r; }); }

  /* ================= Stereometriya: tushunchalar zaxirasi ================= */
  // [savol, javob, [noto'g'ri variantlar], [yechim qadamlari]]
  var ST = [
    ["Bir to'g'ri chiziqda yotmaydigan uch nuqta orqali nechta tekislik o'tadi?", "1", ["0", "2", "3", "cheksiz ko'p"], ["Stereometriya aksiomasi: faqat bitta tekislik"]],
    ["To'g'ri chiziq va unda yotmaydigan nuqta orqali nechta tekislik o'tadi?", "1", ["0", "2", "3", "cheksiz ko'p"], ["Bitta tekislik o'tadi"]],
    ["Kesishuvchi ikki to'g'ri chiziq orqali nechta tekislik o'tadi?", "1", ["0", "2", "cheksiz ko'p", "3"], ["Kesishuvchi chiziqlar yagona tekislikni aniqlaydi"]],
    ["Parallel ikki to'g'ri chiziq orqali nechta tekislik o'tadi?", "1", ["0", "2", "cheksiz ko'p", "3"], ["Parallel chiziqlar ham yagona tekislikni aniqlaydi"]],
    ["Bitta to'g'ri chiziq orqali nechta tekislik o'tishi mumkin?", "cheksiz ko'p", ["1", "2", "3", "0"], ["To'g'ri chiziq atrofida tekisliklar cheksiz ko'p"]],
    ["Ikki tekislik kesishsa, kesishmasi nima bo'ladi?", "to'g'ri chiziq", ["nuqta", "kesma", "tekislik", "aylana"], ["Aksioma: kesishma — to'g'ri chiziq"]],
    ["Fazoda ikki to'g'ri chiziq nechta xil holatda joylashadi?", "3", ["1", "2", "4", "5"], ["Kesishuvchi, parallel, ayqash"]],
    ["Fazoda ikki tekislik nechta xil holatda joylashadi?", "2", ["1", "3", "4", "5"], ["Parallel yoki kesishuvchi"]],
    ["To'g'ri chiziq va tekislik nechta xil holatda joylashadi?", "3", ["1", "2", "4", "5"], ["Tekislikda yotadi, parallel, kesishadi"]],
    ["Bir tekislikda yotmaydigan to'g'ri chiziqlar qanday nomlanadi?", "ayqash", ["parallel", "kesishuvchi", "ustma-ust"], ["Ta'rif bo'yicha — ayqash to'g'ri chiziqlar"]],
    ["Ayqash to'g'ri chiziqlarning umumiy nuqtasi bormi?", "yo'q", ["ha"], ["Ayqash chiziqlar kesishmaydi va parallel ham emas"]],
    ["Parallel to'g'ri chiziqlar bir tekislikda yotadimi?", "ha", ["yo'q"], ["Parallellik ta'rifi bir tekislikda bo'lishni talab qiladi"]],
    ["To'g'ri chiziq tekislikka parallel bo'lsa, umumiy nuqtalari soni nechta?", "0", ["1", "2", "cheksiz ko'p", "3"], ["Parallel — umumiy nuqta yo'q"]],
    ["To'g'ri chiziq tekislikda yotsa, umumiy nuqtalari soni nechta?", "cheksiz ko'p", ["0", "1", "2", "3"], ["Barcha nuqtalari tekislikka tegishli"]],
    ["To'g'ri chiziq tekislikni kessa, umumiy nuqtalari soni nechta?", "1", ["0", "2", "3", "cheksiz ko'p"], ["Faqat bitta kesishish nuqtasi"]],
    ["Parallel tekisliklarning umumiy nuqtalari soni nechta?", "0", ["1", "2", "cheksiz ko'p", "3"], ["Parallel tekisliklar kesishmaydi"]],
    ["Uchinchi tekislik ikki parallel tekislikni kessa, kesishma chiziqlari qanday bo'ladi?", "parallel", ["ayqash", "kesishuvchi", "perpendikulyar"], ["Teorema: kesishma chiziqlari parallel"]],
    ["To'g'ri chiziq tekislikka parallel bo'lishi uchun yetarli shart nima?", "tekislikdagi biror to'g'ri chiziqqa parallel bo'lishi", ["tekislikka tegishi", "tekislikda yotishi", "perpendikulyar bo'lishi"], ["Parallellik belgisi"]],
    ["To'g'ri chiziq tekislikka perpendikulyar bo'lishi uchun nima kerak?", "tekislikdagi kesishuvchi ikki to'g'ri chiziqqa perpendikulyar bo'lishi", ["bitta chiziqqa perpendikulyar bo'lishi", "tekislikka parallel bo'lishi", "tekislikda yotishi"], ["Perpendikulyarlik belgisi"]],
    ["Ikki tekislik parallel bo'lishi uchun yetarli shart nima?", "birining kesishuvchi ikki chizig'i ikkinchisiga parallel bo'lishi", ["bitta chizig'i parallel bo'lishi", "umumiy nuqtasi bo'lishi", "perpendikulyar bo'lishi"], ["Tekisliklar parallelligi belgisi"]],
    ["Ayqash to'g'ri chiziqlar orasidagi burchak qanday topiladi?", "biriga parallel chiziq o'tkazib, kesishuvchi burchak o'lchanadi", ["uzunliklari taqqoslanadi", "har doim 90° olinadi", "0° deb olinadi"], ["Bitta nuqtadan ikkisiga parallel chiziqlar o'tkaziladi"]],
    ["Kubda bitta qirra bilan ayqash bo'lgan qirralar soni nechta?", "4", ["2", "3", "6", "8"], ["4 ta kesishuvchi, 3 ta parallel, 4 ta ayqash"]],
    ["Kubda nechta qirra bor?", "12", ["6", "8", "16", "24"], ["Kubda 8 uch, 12 qirra, 6 yoq"]],
    ["Kubda nechta yoq bor?", "6", ["4", "8", "12", "10"], ["Kub — 6 ta kvadrat yoq"]],
    ["Kubda nechta uch (vertex) bor?", "8", ["6", "12", "4", "10"], ["Kubda 8 ta uch"]],
    ["Tetraedrda nechta yoq bor?", "4", ["3", "5", "6", "8"], ["4 ta uchburchak yoq"]],
    ["Tetraedrda nechta qirra bor?", "6", ["4", "5", "8", "12"], ["Tetraedrda 6 qirra"]],
    ["Eyler formulasi qanday yoziladi (U — uch, Q — qirra, Y — yoq)?", "U − Q + Y = 2", ["U + Q + Y = 2", "U − Q − Y = 2", "U + Q − Y = 0"], ["Ko'pyoqlar uchun Eyler formulasi"]],
    ["Parallel proyeksiyalashda to'g'ri chiziqning proyeksiyasi nima bo'ladi?", "to'g'ri chiziq", ["nuqta", "aylana", "egri chiziq", "kesma"], ["To'g'ri chiziq to'g'ri chiziqqa o'tadi"]],
    ["Parallel proyeksiyalashda parallel kesmalarning nisbati saqlanadimi?", "ha", ["yo'q"], ["Nisbatlar saqlanadi"]],
    ["Parallel proyeksiyalashda burchak kattaligi har doim saqlanadimi?", "yo'q", ["ha"], ["Burchaklar o'zgarishi mumkin"]],
    ["Chizmada ko'rinmas qirralar qanday chiziq bilan ko'rsatiladi?", "punktir (uzuq) chiziq", ["qalin to'liq chiziq", "qizil chiziq", "ikki qatorli chiziq"], ["Ko'rinmas qirralar punktir bilan"]],
    ["Perpendikulyar va og'ma bir nuqtadan tushirilgan bo'lsa, qaysi biri qisqa?", "perpendikulyar", ["og'ma", "ikkisi teng", "aniqlanmaydi"], ["Perpendikulyar — eng qisqa masofa"]],
    ["Nuqtadan tekislikkacha masofa nima bilan o'lchanadi?", "perpendikulyar uzunligi", ["og'ma uzunligi", "proyeksiya uzunligi", "qirra uzunligi"], ["Masofa — perpendikulyar kesma uzunligi"]],
    ["Uch perpendikulyar teoremasi nima haqida?", "tekislikdagi chiziqqa og'ma va uning proyeksiyasi perpendikulyarligi haqida", ["uchburchak yuzi haqida", "parallel tekisliklar haqida", "prizma hajmi haqida"], ["Uch perpendikulyar teoremasi"]],
    ["Ikki yoqli burchak nima bilan o'lchanadi?", "chiziqli burchagi bilan", ["qirra uzunligi bilan", "yoq yuzi bilan", "hajmi bilan"], ["Qirraga perpendikulyar kesimdagi burchak"]],
    ["To'g'ri prizmaning yon qirralari asosga qanday joylashgan?", "perpendikulyar", ["parallel", "og'ma", "ayqash"], ["To'g'ri prizmada yon qirra asosga perpendikulyar"]],
    ["Muntazam piramidaning asosi qanday ko'pburchak bo'ladi?", "muntazam ko'pburchak", ["ixtiyoriy uchburchak", "trapetsiya", "ixtiyoriy to'rtburchak"], ["Muntazam piramida ta'rifi"]],
    ["Silindrning yon sirti yoyilmasi qanday shakl bo'ladi?", "to'rtburchak", ["uchburchak", "doira", "sektor"], ["Silindr yon sirti yoyilganda to'rtburchak"]],
    ["Konusning yon sirti yoyilmasi qanday shakl bo'ladi?", "doira sektori", ["to'rtburchak", "uchburchak", "to'liq doira"], ["Konus yon sirti — sektor"]],
    ["Sharning har qanday kesimi qanday shakl bo'ladi?", "doira", ["ellips", "to'rtburchak", "uchburchak"], ["Shar tekislik bilan doira bo'yicha kesiladi"]],
    ["Fazoda uchta tekislik ko'pi bilan nechta to'g'ri chiziq bo'yicha kesishadi?", "3", ["1", "2", "4", "6"], ["Har juft tekislik bitta chiziq beradi: 3 juft → 3 chiziq"]]
  ];
  // Parametrik stereometriya savollari (sonli)
  function stNum(L) {
    var k = pick(L === 1 ? [0, 1, 2] : [0, 1, 2, 3, 4, 5]);
    var n = R(3, L === 3 ? 12 : 8);
    if (k === 0) return { q: n + " burchakli prizmada nechta qirra bor?", a: 3 * n, hint: "son", w: [2 * n, 4 * n, n + 2, 3 * n + 2],
      steps: [2 * n + " ta asos qirrasi + " + n + " ta yon qirra = " + 3 * n] };
    if (k === 1) return { q: n + " burchakli prizmada nechta uch bor?", a: 2 * n, hint: "son", w: [n, 3 * n, n + 2, 2 * n + 2],
      steps: ["Ikki asosda " + n + " + " + n + " = " + 2 * n] };
    if (k === 2) return { q: n + " burchakli piramidada nechta yoq bor?", a: n + 1, hint: "son", w: [n, 2 * n, n + 2, 3 * n],
      steps: [n + " ta yon yoq + 1 ta asos = " + (n + 1)] };
    if (k === 3) return { q: n + " burchakli piramidada nechta qirra bor?", a: 2 * n, hint: "son", w: [n, 3 * n, n + 1, 2 * n + 1],
      steps: [n + " ta asos qirrasi + " + n + " ta yon qirra = " + 2 * n] };
    if (k === 4) { var U = R(4, 12), Q = R(U + 2, U + 14), Y = 2 - U + Q;
      return { q: "Ko'pyoqda " + U + " uch va " + Q + " qirra bor. Eyler formulasi bo'yicha yoqlar sonini toping.", a: Y, hint: "son",
        w: nearW(Y, 4, 3).filter(function (x) { return x > 0; }), steps: ["U − Q + Y = 2 → Y = 2 − " + U + " + " + Q + " = " + Y] }; }
    var s = R(2, 12);
    return { q: "Qirrasi " + s + " bo'lgan kubning to'liq sirtini toping.", a: 6 * s * s, hint: "yuz",
      w: [s * s * s, 4 * s * s, s * s, 12 * s], steps: ["S = 6a² = 6·" + s * s + " = " + 6 * s * s] };
  }
  function stereo(L) {
    if (Math.random() < .45) return stNum(L);
    var it = pick(ST);
    return { q: it[0], a: it[1], hint: "javob", type: "text", w: it[2].slice(0, 4), steps: it[3] };
  }
  ["t42", "t43", "t46", "t47", "t48", "t49", "t50", "t45"].forEach(function (id) {
    var own = null;
    S.register(id, function (L) { return stereo(L); });
  });

  /* ================= Trigonometrik tenglamalar: kengaytirilgan zaxira ================= */
  var SIN = [["0", 0], ["1/2", 30], ["√2/2", 45], ["√3/2", 60], ["1", 90], ["−1/2", -30], ["−√2/2", -45], ["−√3/2", -60], ["−1", -90]];
  var COS = [["1", 0], ["√3/2", 30], ["√2/2", 45], ["1/2", 60], ["0", 90], ["−1/2", 120], ["−√2/2", 135], ["−√3/2", 150], ["−1", 180]];
  var TG = [["0", 0], ["√3/3", 30], ["1", 45], ["√3", 60], ["−√3/3", -30], ["−1", -45], ["−√3", -60]];

  function trigEq(L) {
    var k = pick(L === 1 ? [0, 1, 2] : L === 2 ? [0, 1, 2, 3, 4, 5] : [3, 4, 5, 6, 7, 8]);
    if (k === 0) { var r = pick(SIN.slice(0, 5));
      return { q: "sin x = " + r[0] + " tenglamaning [0°; 90°] dagi yechimini toping.", a: r[1] + "°", hint: "gradus", type: "text",
        w: wT(r[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["sin " + r[1] + "° = " + r[0]] }; }
    if (k === 1) { var c = pick(COS.slice(0, 5));
      return { q: "cos x = " + c[0] + " tenglamaning [0°; 90°] dagi yechimini toping.", a: c[1] + "°", hint: "gradus", type: "text",
        w: wT(c[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["cos " + c[1] + "° = " + c[0]] }; }
    if (k === 2) { var t = pick(TG.slice(0, 4));
      return { q: "tg x = " + t[0] + " tenglamaning [0°; 90°) dagi yechimini toping.", a: t[1] + "°", hint: "gradus", type: "text",
        w: wT(t[1] + "°", ["0°", "30°", "45°", "60°"]).slice(0, 3), steps: ["tg " + t[1] + "° = " + t[0]] }; }
    if (k === 3) { var c2 = pick(COS);
      return { q: "cos x = " + c2[0] + " tenglamaning [0°; 180°] dagi yechimini toping.", a: c2[1] + "°", hint: "gradus", type: "text",
        w: wT(c2[1] + "°", ["0°", "30°", "45°", "60°", "90°", "120°", "135°", "150°", "180°"]).slice(0, 4),
        steps: ["arccos " + c2[0] + " = " + c2[1] + "°"] }; }
    if (k === 4) { var s2 = pick(SIN);
      return { q: "sin x = " + s2[0] + " tenglamaning [−90°; 90°] dagi yechimini toping.", a: s2[1] + "°", hint: "gradus", type: "text",
        w: wT(s2[1] + "°", ["0°", "30°", "45°", "60°", "90°", "−30°", "−45°", "−60°", "−90°"]).slice(0, 4),
        steps: ["arcsin " + s2[0] + " = " + s2[1] + "°"] }; }
    if (k === 5) { var big = pick([2, 3, 5, -2, -4, 7]);
      var fn = pick(["sin", "cos"]);
      return { q: fn + " x = " + ms(big) + " tenglama yechimga egami?", a: "yo'q", hint: "ha / yo'q", type: "text", w: ["ha"],
        steps: ["−1 ≤ " + fn + " x ≤ 1", ms(big) + " bu oraliqda emas → yechimi yo'q"] }; }
    if (k === 6) { var cnt = pick([["sin x = 0", 2, "0°; 180°"], ["cos x = 0", 2, "90°; 270°"], ["sin x = 1", 1, "90°"], ["cos x = 1", 1, "0°"], ["sin x = −1", 1, "270°"], ["sin x = 1/2", 2, "30°; 150°"], ["cos x = 1/2", 2, "60°; 300°"], ["tg x = 1", 2, "45°; 225°"]]);
      return { q: cnt[0] + " tenglama [0°; 360°) oraliqda nechta yechimga ega?", a: cnt[1], hint: "son", w: [0, 1, 2, 3, 4].filter(function (v) { return v !== cnt[1]; }).slice(0, 4),
        steps: ["Yechimlar: " + cnt[2], "Soni: " + cnt[1]] }; }
    if (k === 7) { var g = pick(SIN.slice(0, 5));
      return { q: "sin x = " + g[0] + " tenglamaning umumiy yechimini yozing.", a: "x = (−1)ⁿ·" + g[1] + "° + 180°n", hint: "umumiy yechim", type: "text",
        w: ["x = ±" + g[1] + "° + 360°n", "x = " + g[1] + "° + 180°n", "x = " + g[1] + "° + 360°n", "x = ±" + g[1] + "° + 180°n"],
        steps: ["sin x = a → x = (−1)ⁿ arcsin a + 180°n"] }; }
    var g2 = pick(COS.slice(0, 5));
    return { q: "cos x = " + g2[0] + " tenglamaning umumiy yechimini yozing.", a: "x = ±" + g2[1] + "° + 360°n", hint: "umumiy yechim", type: "text",
      w: ["x = (−1)ⁿ·" + g2[1] + "° + 180°n", "x = " + g2[1] + "° + 180°n", "x = " + g2[1] + "° + 360°n", "x = ±" + g2[1] + "° + 180°n"],
      steps: ["cos x = a → x = ±arccos a + 360°n"] };
  }
  function tgEq(L) {
    var k = pick(L === 1 ? [0, 1] : [0, 1, 2, 3]);
    var t = pick(TG);
    if (k === 0) return { q: "tg x = " + t[0] + " tenglamaning (−90°; 90°) dagi yechimini toping.", a: t[1] + "°", hint: "gradus", type: "text",
      w: wT(t[1] + "°", ["0°", "30°", "45°", "60°", "−30°", "−45°", "−60°"]).slice(0, 4), steps: ["arctg " + t[0] + " = " + t[1] + "°"] };
    if (k === 1) { var c = pick([["√3", 30], ["1", 45], ["√3/3", 60], ["0", 90]]);
      return { q: "ctg x = " + c[0] + " tenglamaning (0°; 90°] dagi yechimini toping.", a: c[1] + "°", hint: "gradus", type: "text",
        w: wT(c[1] + "°", ["0°", "30°", "45°", "60°", "90°"]).slice(0, 4), steps: ["ctg " + c[1] + "° = " + c[0]] }; }
    if (k === 2) return { q: "tg x = " + t[0] + " tenglamaning umumiy yechimini yozing.", a: "x = " + t[1] + "° + 180°n", hint: "umumiy yechim", type: "text",
      w: ["x = " + t[1] + "° + 360°n", "x = ±" + t[1] + "° + 360°n", "x = (−1)ⁿ·" + t[1] + "° + 180°n", "x = " + t[1] + "° + 90°n"],
      steps: ["tg davri 180° → x = arctg a + 180°n"] };
    return { q: "tg x funksiya qaysi nuqtalarda aniqlanmagan?", a: "x = 90° + 180°n", hint: "shart", type: "text",
      w: ["x = 180°n", "x = 90°n", "x = 360°n", "hamma joyda aniqlangan"], steps: ["cos x = 0 bo'lgan nuqtalarda tg aniqlanmagan: x = 90° + 180°n"] };
  }
  function trigIneq(L) {
    var k = pick([0, 1, 2, 3, 4]);
    if (k === 0) return { q: "sin x > 0 tengsizlikning [0°; 360°) dagi yechimini toping.", a: "(0°; 180°)", hint: "oraliq", type: "text",
      w: ["(180°; 360°)", "(0°; 90°)", "(90°; 270°)", "[0°; 180°]"], steps: ["Yuqori yarim aylanada sin musbat"] };
    if (k === 1) return { q: "sin x < 0 tengsizlikning [0°; 360°) dagi yechimini toping.", a: "(180°; 360°)", hint: "oraliq", type: "text",
      w: ["(0°; 180°)", "(90°; 270°)", "(270°; 360°)", "[180°; 360°]"], steps: ["Pastki yarim aylanada sin manfiy"] };
    if (k === 2) return { q: "cos x > 0 tengsizlikning [0°; 360°) dagi yechimini toping.", a: "[0°; 90°)∪(270°; 360°)", hint: "oraliq", type: "text",
      w: ["(0°; 180°)", "(90°; 270°)", "(180°; 360°)", "(0°; 90°)"], steps: ["O'ng yarim aylanada cos musbat"] };
    if (k === 3) return { q: "cos x < 0 tengsizlikning [0°; 360°) dagi yechimini toping.", a: "(90°; 270°)", hint: "oraliq", type: "text",
      w: ["(0°; 180°)", "(180°; 360°)", "[0°; 90°)", "(270°; 360°)"], steps: ["Chap yarim aylanada cos manfiy"] };
    var f = pick([["sin x > 1", "yo'q"], ["sin x ≥ −1", "ha"], ["cos x < −1", "yo'q"], ["cos x ≤ 1", "ha"], ["sin x > 2", "yo'q"]]);
    return { q: f[0] + " tengsizlik yechimga egami?", a: f[1], hint: "ha / yo'q", type: "text", w: [f[1] === "ha" ? "yo'q" : "ha"],
      steps: ["−1 ≤ sin x, cos x ≤ 1 ekanini tekshiramiz", "Javob: " + f[1]] };
  }
  S.register("t33", trigEq); S.register("t69", trigEq);
  S.register("t34", tgEq);
  S.register("t35", function (L) { return Math.random() < .6 ? trigEq(L) : tgEq(L); });
  S.register("t36", trigIneq);
})();
