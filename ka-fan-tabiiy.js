/*! Kuvonch Academy — viktorina: Fizika, Kimyo, Informatika savollari
 *  f1–f5 Fizika · k1–k3 Kimyo · i1–i5 Informatika va robototexnika.
 *  Hisoblash savollari har safar yangi sonlar bilan, tushuncha savollari — bankdan. ES5. */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle;
  function Q(q, a, w, steps) { return { q: q, a: String(a), w: w.map(String), steps: steps || [], lang: S.lang() }; }
  function lv(L, a, b, c) { return L === 1 ? a : L === 2 ? b : c; }
  // son yozuvi: 6 xonagacha yaxlitlash, manfiy son "−" bilan
  function f(x) { var r = Math.round(Math.abs(x) * 1e6) / 1e6; return (x < 0 && r !== 0 ? "−" : "") + String(r); }
  function nf(x) { return Math.abs(x) >= 1000 ? Math.round(x) : Number(x.toPrecision(4)); }
  function un(unit) { return unit ? (unit === "%" ? "%" : " " + unit) : ""; }
  // noto'g'ri variantlar: takrorsiz, javobga teng emas; sonlar o'sha birlik bilan yoziladi
  function W(a, cands, unit, neg, n) {
    n = n || 4;
    var u = un(unit), A = String(a), out = [], seen = {}, i; seen[A] = 1;
    function add(v) {
      if (out.length >= n || v === null || v === undefined) return;
      if (typeof v === "number") { if (!isFinite(v) || v === 0 || (v < 0 && !neg)) return; v = f(nf(v)) + u; }
      v = String(v); if (seen[v]) return; seen[v] = 1; out.push(v);
    }
    for (i = 0; i < cands.length; i++) add(cands[i]);
    var b = parseFloat(A.replace("−", "-")), k = [2, 0.5, 10, 0.1, 3, 1.5, 4, 0.25, 5, 0.2];
    if (!isNaN(b) && b !== 0) for (i = 0; i < k.length; i++) add(b * k[i]);
    if (!isNaN(b)) for (i = 1; i < 60; i++) { add(b + i); add(b - i); }
    return shuffle(out);
  }
  function NQ(q, val, unit, cands, steps, neg) { var a = f(val) + un(unit); return Q(q, a, W(a, cands, unit, neg), steps); }
  function TQ(q, a, w, steps) { return Q(q, a, shuffle(w), steps); }
  // bank: [daraja, savol, javob, [noto'g'ri...], izoh]
  function bank(items) {
    var by = { 1: [], 2: [], 3: [] };
    for (var i = 0; i < items.length; i++) by[items[i][0]].push(items[i]);
    return function (L) {
      var arr = by[L] && by[L].length ? by[L] : items, it = pick(arr);
      return Q(it[1], it[2], shuffle(it[3]), it[4] ? [it[4]] : []);
    };
  }
  function mix(bk, pr, p) { return function (L) { return Math.random() < p ? bk(L) : pr(L); }; }
  function others(arr, x, n) { return shuffle(arr.filter(function (y) { return y !== x; })).slice(0, n || 3); }

  /* ================= f1 Mexanika: tezlik, kuch, bosim ================= */
  var B1 = bank([
    [1, "Tashqi ta'sir bo'lmaganda jismning o'z tezligini saqlash hodisasi nima deyiladi?", "Inertsiya", ["Gravitatsiya", "Ishqalanish", "Deformatsiya"], "Jism tezligini saqlash hodisasi — inertsiya."],
    [1, "Kuchning SI dagi birligi qaysi?", "Nyuton (N)", ["Joul (J)", "Paskal (Pa)", "Vatt (Vt)"], "Kuch nyutonlarda (N) o'lchanadi."],
    [1, "Tezlikning SI dagi birligi qaysi?", "m/s", ["km/soat", "m/s²", "m·s"], "SI da tezlik metr taqsim sekund (m/s) da o'lchanadi."],
    [1, "Bosimning SI dagi birligi qaysi?", "Paskal (Pa)", ["Nyuton (N)", "Joul (J)", "Vatt (Vt)"], "1 Pa = 1 N/m²."],
    [1, "Kuchni o'lchaydigan asbob qaysi?", "Dinamometr", ["Barometr", "Spidometr", "Termometr"], "Kuch dinamometr bilan o'lchanadi."],
    [1, "Avtomobil tezligini ko'rsatadigan asbob qaysi?", "Spidometr", ["Dinamometr", "Manometr", "Ampermetr"], "Spidometr — tezlik o'lchagich."],
    [1, "Yerning jismlarni o'ziga tortish kuchi nima deyiladi?", "Og'irlik kuchi", ["Elastiklik kuchi", "Ishqalanish kuchi", "Arximed kuchi"], "Og'irlik kuchi F = m·g."],
    [1, "1 soat necha sekund?", "3600 s", ["60 s", "360 s", "1000 s"], "1 soat = 60 min = 60 · 60 s = 3600 s."],
    [1, "Teng vaqt oraliqlarida teng masofalarni bosib o'tadigan harakat qanday ataladi?", "Tekis harakat", ["Tezlanuvchan harakat", "Tebranma harakat", "Aylanma harakat"], "Tezlik o'zgarmas bo'lsa — tekis harakat."],
    [1, "Tezlik formulasi qaysi?", "v = s/t", ["v = s·t", "v = t/s", "v = m·a"], "Tezlik = yo'l : vaqt."],
    [2, "Inertsiya qonuni Nyutonning nechanchi qonuni?", "Birinchi qonuni", ["Ikkinchi qonuni", "Uchinchi qonuni", "Tortishish qonuni"], "Nyutonning 1-qonuni — inertsiya qonuni."],
    [2, "F = m·a formulasi qaysi qonunni ifodalaydi?", "Nyutonning 2-qonuni", ["Nyutonning 1-qonuni", "Nyutonning 3-qonuni", "Guk qonuni"], "Kuch = massa · tezlanish — Nyutonning 2-qonuni."],
    [2, "\"Ta'sir aks ta'sirga teng va qarama-qarshi yo'nalgan\" — bu qaysi qonun?", "Nyutonning 3-qonuni", ["Nyutonning 1-qonuni", "Nyutonning 2-qonuni", "Paskal qonuni"], "Nyutonning 3-qonuni: F₁ = −F₂."],
    [2, "Tezlanishning SI dagi birligi qaysi?", "m/s²", ["m/s", "m²/s", "km/soat"], "a = Δv/t, ya'ni (m/s)/s = m/s²."],
    [2, "Ishqalanish kuchini kamaytirish usuli qaysi?", "Sirtlarni moylash", ["Sirtni g'adir-budir qilish", "Bosim kuchini oshirish", "Qum sepish"], "Moylash ishqalanishni kamaytiradi."],
    [2, "Kuch o'zgarmaganda bosimni oshirish uchun nima qilish kerak?", "Tayanch yuzasini kichraytirish", ["Tayanch yuzasini kattalashtirish", "Massani kamaytirish", "Tezlikni oshirish"], "p = F/S: S kichik bo'lsa p katta."],
    [2, "Guk qonuniga ko'ra elastiklik kuchi nimaga proporsional?", "Cho'zilish (deformatsiya)ga", ["Jism massasiga", "Tezlikka", "Vaqtga"], "F = k·x, x — deformatsiya."],
    [2, "Jismning og'irligi qaysi birlikda o'lchanadi?", "Nyuton (N)", ["Kilogramm (kg)", "Joul (J)", "Paskal (Pa)"], "Og'irlik — kuch, shuning uchun nyutonda."],
    [2, "Yer sirtida erkin tushish tezlanishi taxminan qancha?", "9.8 m/s²", ["9.8 m/s", "98 m/s²", "1 m/s²"], "g ≈ 9.8 m/s² (masalalarda ko'pincha 10 m/s²)."],
    [2, "Raketaning reaktiv harakati qaysi qonunga asoslangan?", "Impulsning saqlanish qonuni", ["Arximed qonuni", "Paskal qonuni", "Om qonuni"], "Gaz orqaga otilib, raketa oldinga harakatlanadi — impuls saqlanadi."],
    [3, "Jism impulsi formulasi qaysi?", "p = m·v", ["p = m·a", "p = F/S", "p = m·g"], "Impuls = massa · tezlik."],
    [3, "Impulsning SI dagi birligi qaysi?", "kg·m/s", ["kg·m/s²", "N/m²", "J/s"], "p = m·v ⇒ kg·m/s."],
    [3, "Aylana bo'ylab tekis harakatda tezlanish qayerga yo'nalgan?", "Aylana markaziga", ["Tezlik yo'nalishida", "Markazdan tashqariga", "Tezlanish nolga teng"], "Markazga intilma tezlanish a = v²/R."],
    [3, "Butun olam tortishish qonunini kim kashf etgan?", "Isaak Nyuton", ["Galileo Galiley", "Iogann Kepler", "Albert Eynshteyn"], "F = G·m₁·m₂/r² — Nyuton qonuni."],
    [3, "Ikki jism orasidagi masofa 2 marta oshsa, tortishish kuchi qanday o'zgaradi?", "4 marta kamayadi", ["2 marta kamayadi", "4 marta ortadi", "O'zgarmaydi"], "F ~ 1/r²: r 2 marta ⇒ F 4 marta kichik."],
    [3, "Havosiz idishda (vakuumda) pat va tosh bir balandlikdan tashlansa nima bo'ladi?", "Bir vaqtda tushadi", ["Tosh oldin tushadi", "Pat oldin tushadi", "Pat tushmaydi"], "Vakuumda barcha jismlar bir xil tezlanish bilan tushadi."],
    [3, "Gravitatsiya doimiysi G taxminan nimaga teng?", "6.67·10⁻¹¹ N·m²/kg²", ["6.67·10¹¹ N·m²/kg²", "9.8·10⁻¹¹ N·m²/kg²", "3·10⁸ N·m²/kg²"], "G ≈ 6.67·10⁻¹¹ N·m²/kg²."],
    [3, "Sirpanish ishqalanish kuchi formulasi qaysi?", "F = μ·N", ["F = k·x", "F = ρ·g·V", "F = m·v"], "μ — ishqalanish koeffitsienti, N — tayanch reaksiya kuchi."],
    [3, "Yer uchun birinchi kosmik tezlik taxminan qancha?", "7.9 km/s", ["11.2 km/s", "16.7 km/s", "340 m/s"], "7.9 km/s — birinchi, 11.2 km/s — ikkinchi kosmik tezlik."],
    [3, "Tekis tezlanuvchan harakatda yo'l formulasi qaysi?", "s = v₀t + at²/2", ["s = v·t²", "s = v₀ + at", "s = at"], "s = v₀t + at²/2."],
    [3, "Lift yuqoriga tezlanish bilan ko'tarilganda undagi odamning og'irligi qanday o'zgaradi?", "Ortadi", ["Kamayadi", "O'zgarmaydi", "Nolga teng bo'ladi"], "P = m(g + a) > m·g."]
  ]);
  function P1(L) {
    var k = pick(lv(L, [0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 3, 4], [11, 12, 13, 14, 15, 16]));
    var v, t, s, m, a, F, p, kmh, ms, v0, v1, Sx, F1, F2, sm, Ff, h;
    if (k === 0) { v = R(2, 25); t = R(4, 40); s = v * t;
      return NQ("Jism " + s + " m masofani " + t + " s da tekis bosib o'tdi. Uning tezligi necha m/s?", v, "m/s", [s * t, v * 2, v / 2, v + R(1, 3)], ["v = s / t = " + s + " : " + t + " = " + v + " m/s"]); }
    if (k === 1) { v = pick([40, 50, 60, 70, 80, 90, 100]); t = R(2, 6); s = v * t;
      return NQ("Avtomobil " + v + " km/soat tezlik bilan " + t + " soat yurdi. U necha km yo'l bosdi?", s, "km", [v / t, v + t, s * 2, s / 2], ["s = v · t = " + v + " · " + t + " = " + s + " km"]); }
    if (k === 2) { v = pick([4, 5, 6, 10, 12, 15, 20]); t = R(2, 6); s = v * t;
      return NQ("Velosipedchi " + s + " km yo'lni " + v + " km/soat tezlik bilan necha soatda bosib o'tadi?", t, "soat", [s * v, s - v, t + 1, t * 2], ["t = s / v = " + s + " : " + v + " = " + t + " soat"]); }
    if (k === 3) { kmh = pick([18, 36, 54, 72, 90, 108, 126, 144]); ms = kmh * 5 / 18;
      return NQ("Tezlik " + kmh + " km/soat. Uni m/s da ifodalang.", ms, "m/s", [kmh, kmh * 3.6, kmh / 10, ms * 2], ["1 km/soat = 1000 m : 3600 s = 1/3.6 m/s", kmh + " : 3.6 = " + ms + " m/s"]); }
    if (k === 4) { ms = pick([5, 10, 15, 20, 25, 30, 35, 40]); kmh = ms * 18 / 5;
      return NQ("Tezlik " + ms + " m/s. Uni km/soat da ifodalang.", kmh, "km/soat", [ms, ms / 3.6, kmh / 2, kmh + 18], ["1 m/s = 3.6 km/soat", ms + " · 3.6 = " + kmh + " km/soat"]); }
    if (k === 5) { m = R(2, 80);
      return NQ("Massasi " + m + " kg bo'lgan jismga ta'sir etuvchi og'irlik kuchi necha N? (g = 10 N/kg)", m * 10, "N", [m, m / 10, m * 100, m + 10], ["F = m · g = " + m + " · 10 = " + m * 10 + " N"]); }
    if (k === 6) { v0 = R(0, 10); a = R(1, 5); t = R(2, 10); v1 = v0 + a * t;
      return NQ((v0 ? "Avtomobil tezligi " + t + " s da " + v0 + " m/s dan " + v1 + " m/s gacha ortdi." : "Avtomobil tinch holatdan " + t + " s da " + v1 + " m/s tezlikka erishdi.") + " Tezlanishi necha m/s²?", a, "m/s²",
        [v0 ? v1 / t : v1, (v1 - v0) * t, a + 1, a * 2], ["a = (v − v₀) / t = (" + v1 + " − " + v0 + ") : " + t + " = " + a + " m/s²"]); }
    if (k === 7) { m = pick([2, 4, 5, 10, 20, 50, 100, 500, 1000, 1200, 1500]); a = pick([0.5, 1.5, 2, 3, 4, 5]); F = m * a;
      return NQ("Massasi " + m + " kg bo'lgan jismga " + a + " m/s² tezlanish berish uchun necha N kuch kerak?", F, "N", [m / a, m + a, F * 10, F / 2], ["F = m · a = " + m + " · " + a + " = " + f(F) + " N"]); }
    if (k === 8) { do { F = pick([100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000]); Sx = pick([0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.5, 2]); p = F / Sx; } while (Math.abs(p - Math.round(p)) > 1e-6);
      return NQ(F + " N kuch " + Sx + " m² yuzaga tik ta'sir qilmoqda. Hosil bo'lgan bosim necha Pa?", Math.round(p), "Pa", [F * Sx, p * 10, p / 10, p / 100], ["p = F / S = " + F + " : " + Sx + " = " + Math.round(p) + " Pa"]); }
    if (k === 9) { m = R(2, 90);
      return NQ("Jismning og'irligi " + m * 10 + " N. Uning massasi necha kg? (g = 10 N/kg)", m, "kg", [m * 100, m * 10, m * 2, m + 10], ["m = P / g = " + m * 10 + " : 10 = " + m + " kg"]); }
    if (k === 10) { F1 = R(10, 60); F2 = R(2, F1 - 2); var same = R(0, 1), Rz = same ? F1 + F2 : F1 - F2;
      return NQ("Jismga bir to'g'ri chiziq bo'ylab " + (same ? "bir xil" : "qarama-qarshi") + " yo'nalgan " + F1 + " N va " + F2 + " N kuchlar ta'sir qilmoqda. Teng ta'sir etuvchi kuch necha N?", Rz, "N",
        [same ? F1 - F2 : F1 + F2, F1 * F2, F1, (F1 + F2) / 2], [same ? "Bir yo'nalishda: R = F₁ + F₂ = " + Rz + " N" : "Qarama-qarshi: R = F₁ − F₂ = " + F1 + " − " + F2 + " = " + Rz + " N"]); }
    if (k === 11) { do { m = pick([40, 45, 48, 50, 54, 60, 64, 72, 75, 80]); sm = pick([150, 200, 250, 300, 400, 480, 500, 600]); } while ((m * 1000) % sm !== 0);
      p = m * 100 / sm;
      return NQ("Massasi " + m + " kg odam tik turibdi, poyabzallarining tayanch yuzasi jami " + sm + " sm². Uning polga bosimi necha kPa? (g = 10 N/kg)", p, "kPa", [p / 10, p * 10, p * 100, p * 2],
        ["S = " + sm + " sm² = " + f(sm / 10000) + " m², F = m·g = " + m * 10 + " N", "p = F / S = " + f(p * 1000) + " Pa = " + f(p) + " kPa"]); }
    if (k === 12) { v0 = R(1, 15); a = R(1, 4); t = R(2, 10); v = v0 + a * t;
      return NQ("Jism " + v0 + " m/s boshlang'ich tezlik bilan harakatlanib, " + a + " m/s² tezlanish oldi. " + t + " s dan keyin tezligi necha m/s bo'ladi?", v, "m/s", [v0 + a, a * t, v0 * a * t, v0 + a * t * t], ["v = v₀ + a·t = " + v0 + " + " + a + " · " + t + " = " + v + " m/s"]); }
    if (k === 13) { v0 = R(0, 10); a = pick([2, 4, 6]); t = R(2, 8); s = v0 * t + a * t * t / 2;
      return NQ("Jism " + (v0 ? v0 + " m/s boshlang'ich tezlik bilan" : "tinch holatdan") + " " + a + " m/s² tezlanish bilan harakatlanmoqda. " + t + " s da necha metr yo'l bosadi?", s, "m",
        [v0 * t + a * t * t, v0 * t, v0 ? a * t * t / 2 : a * t, (v0 + a * t) * t], ["s = v₀t + at²/2 = " + v0 + " · " + t + " + " + a + " · " + t + "² : 2 = " + s + " m"]); }
    if (k === 14) { kmh = pick([36, 54, 72, 90, 108]); ms = kmh * 5 / 18; t = R(5, 30); s = ms * t;
      return NQ("Avtomobil " + kmh + " km/soat tezlik bilan " + t + " s yurdi. U necha metr yo'l bosdi?", s, "m", [kmh * t, s * 2, ms + t, s / 2], [kmh + " km/soat = " + ms + " m/s", "s = v · t = " + ms + " · " + t + " = " + s + " m"]); }
    if (k === 15) { m = pick([2, 4, 5, 10, 20]); a = R(1, 5); Ff = m * R(1, 4); F = m * a + Ff;
      return NQ("Massasi " + m + " kg aravachani " + F + " N kuch bilan tortishmoqda, ishqalanish kuchi " + Ff + " N. Aravachaning tezlanishi necha m/s²?", a, "m/s²", [F / m, (F + Ff) / m, F - Ff, a + 1], ["a = (F − Fishq) / m = (" + F + " − " + Ff + ") : " + m + " = " + a + " m/s²"]); }
    t = R(1, 6); h = 5 * t * t;
    return NQ("Jism tinch holatdan erkin tushmoqda (g = 10 m/s², havo qarshiligi yo'q). U " + t + " s da necha metr masofani o'tadi?", h, "m", [10 * t * t, 10 * t, 5 * t, 5 * (t + 1) * (t + 1)], ["h = g·t²/2 = 10 · " + t + "² : 2 = " + h + " m"]);
  }
  S.register("f1", mix(B1, P1, 0.4), "Fizika · Mexanika: tezlik, kuch, bosim");

  /* ================= f2 Ish, quvvat va energiya ================= */
  var B2 = bank([
    [1, "Mexanik ishning SI dagi birligi qaysi?", "Joul (J)", ["Vatt (Vt)", "Nyuton (N)", "Paskal (Pa)"], "1 J = 1 N · 1 m."],
    [1, "Quvvatning SI dagi birligi qaysi?", "Vatt (Vt)", ["Joul (J)", "Nyuton (N)", "Amper (A)"], "1 Vt = 1 J/s."],
    [1, "Harakatlanayotgan jism qanday mexanik energiyaga ega?", "Kinetik energiya", ["Potensial energiya", "Issiqlik miqdori", "Bosim"], "Harakat energiyasi — kinetik energiya."],
    [1, "Yerdan ko'tarilgan jism qanday mexanik energiyaga ega?", "Potensial energiya", ["Kinetik energiya", "Elektr energiya", "Yorug'lik energiyasi"], "Ep = m·g·h."],
    [1, "Jism kuch ta'sirida joyidan siljimasa (s = 0), mexanik ish qancha bo'ladi?", "Nolga teng", ["Kuchga teng", "Massaga teng", "Cheksiz katta"], "A = F·s, s = 0 ⇒ A = 0."],
    [1, "1 kJ necha joul?", "1000 J", ["100 J", "10 J", "1 000 000 J"], "kilo = 1000."],
    [1, "1 kVt necha vatt?", "1000 Vt", ["100 Vt", "10 Vt", "1 000 000 Vt"], "kilo = 1000."],
    [1, "Quvvat formulasi qaysi?", "N = A/t", ["N = A·t", "N = F·s", "N = m·g"], "Quvvat — vaqt birligida bajarilgan ish."],
    [1, "Mexanik ish formulasi qaysi?", "A = F·s", ["A = F/s", "A = m·a", "A = F·t"], "Ish = kuch · yo'l."],
    [1, "Kinetik energiya formulasi qaysi?", "Ek = m·v²/2", ["Ek = m·v", "Ek = m·g·h", "Ek = m·v/2"], "Ek = m·v²/2."],
    [2, "Ishqalanish bo'lmaganda yopiq sistemaning to'liq mexanik energiyasi qanday o'zgaradi?", "O'zgarmaydi", ["Ortadi", "Kamayadi", "Nolga teng bo'ladi"], "Mexanik energiyaning saqlanish qonuni: Ek + Ep = const."],
    [2, "Erkin tushayotgan jismda energiya qanday aylanadi?", "Potensial → kinetik", ["Kinetik → potensial", "Elektr → kinetik", "Kinetik → kimyoviy"], "Balandlik kamayadi, tezlik ortadi."],
    [2, "Jism tezligi 2 marta ortsa, kinetik energiyasi qanday o'zgaradi?", "4 marta ortadi", ["2 marta ortadi", "8 marta ortadi", "O'zgarmaydi"], "Ek ~ v²."],
    [2, "Tezlik o'zgarmay, massa 3 marta ortsa, kinetik energiya qanday o'zgaradi?", "3 marta ortadi", ["9 marta ortadi", "O'zgarmaydi", "3 marta kamayadi"], "Ek ~ m."],
    [2, "Jism balandligi 2 marta ortsa, potensial energiyasi qanday o'zgaradi?", "2 marta ortadi", ["4 marta ortadi", "O'zgarmaydi", "2 marta kamayadi"], "Ep ~ h."],
    [2, "Real mexanizmning foydali ish koeffitsienti (FIK) qanday bo'ladi?", "100% dan kichik", ["100% dan katta", "Aniq 100%", "Doim 50%"], "Ishqalanish tufayli foydali ish sarflangan ishdan kichik."],
    [2, "Oddiy mexanizmlar ishdan yutuq beradimi?", "Yo'q, ishdan yutuq bermaydi", ["Ha, 2 marta", "Ha, 4 marta", "Faqat richag beradi"], "Mexanikaning oltin qoidasi: kuchdan yutsak, yo'ldan yutqazamiz."],
    [2, "Qo'zg'aluvchan blok kuchdan necha marta yutuq beradi?", "2 marta", ["Yutuq bermaydi", "3 marta", "4 marta"], "Qo'zg'aluvchan blok kuchdan 2 marta yutuq beradi."],
    [2, "Qo'zg'almas blok nima beradi?", "Kuch yo'nalishini o'zgartiradi", ["Kuchdan 2 marta yutuq", "Ishdan yutuq", "Yo'ldan yutuq"], "Qo'zg'almas blok faqat yo'nalishni o'zgartiradi."],
    [2, "Richagning muvozanat sharti qaysi?", "F₁·l₁ = F₂·l₂", ["F₁ + F₂ = l₁ + l₂", "F₁/l₁ = F₂/l₂", "F₁·F₂ = l₁·l₂"], "Kuch momentlari teng: F₁l₁ = F₂l₂."],
    [3, "Cho'zilgan prujinaning potensial energiyasi formulasi qaysi?", "E = k·x²/2", ["E = k·x", "E = m·g·h", "E = m·v²/2"], "Elastik deformatsiya energiyasi E = kx²/2."],
    [3, "1 kVt·soat necha joul?", "3.6·10⁶ J", ["1000 J", "3600 J", "3.6·10³ J"], "1000 Vt · 3600 s = 3 600 000 J."],
    [3, "Kuch jism harakatiga qarama-qarshi yo'nalsa, uning ishi qanday bo'ladi?", "Manfiy", ["Musbat", "Nolga teng", "Cheksiz"], "A = F·s·cos 180° = −F·s."],
    [3, "Kuch ko'chishga perpendikulyar bo'lsa, bajarilgan ish qancha?", "Nolga teng", ["F·s ga teng", "Maksimal", "Manfiy"], "cos 90° = 0 ⇒ A = 0."],
    [3, "Kuch ko'chish bilan α burchak hosil qilsa, ish formulasi qaysi?", "A = F·s·cos α", ["A = F·s·sin α", "A = F·s·tg α", "A = F·cos α / s"], "Ishni kuchning ko'chish yo'nalishidagi tashkil etuvchisi bajaradi."],
    [3, "Tekis harakatda quvvatni tezlik orqali ifodalovchi formula qaysi?", "N = F·v", ["N = F/v", "N = m·v", "N = F·v²"], "N = A/t = F·s/t = F·v."],
    [3, "Ishqalanish kuchining ishi mexanik energiyani nimaga aylantiradi?", "Ichki (issiqlik) energiyaga", ["Potensial energiyaga", "Kinetik energiyaga", "Elektr energiyaga"], "Ishqalanishda jismlar qiziydi."],
    [3, "Noelastik to'qnashuvda qaysi kattalik saqlanadi?", "Impuls", ["Kinetik energiya", "Tezlik", "Hech narsa"], "Impuls saqlanadi, kinetik energiyaning bir qismi ichki energiyaga o'tadi."],
    [3, "v tezlik bilan tik yuqoriga otilgan jismning maksimal balandligi formulasi qaysi?", "h = v²/(2g)", ["h = v/(2g)", "h = 2g/v²", "h = v·g"], "m·v²/2 = m·g·h ⇒ h = v²/(2g)."],
    [3, "Kuch momenti formulasi qaysi?", "M = F·l", ["M = F/l", "M = m·v", "M = F·t"], "Kuch momenti = kuch · yelka."]
  ]);
  function P2(L) {
    var k = pick(lv(L, [0, 1, 2, 3], [4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14]));
    var F, s, A, N, t, m, h, v, E, eta, At, Af, kmh, ms, kk, x;
    if (k === 0) { F = R(2, 60) * 5; s = R(2, 25); A = F * s;
      return NQ("Jism " + F + " N kuch ta'sirida kuch yo'nalishida " + s + " m ko'chdi. Bajarilgan ish necha J?", A, "J", [F / s, F + s, A * 10, A / 2], ["A = F · s = " + F + " · " + s + " = " + A + " J"]); }
    if (k === 1) { N = R(2, 50) * 10; t = R(2, 20); A = N * t;
      return NQ("Dvigatel " + t + " s da " + A + " J ish bajardi. Uning quvvati necha Vt?", N, "Vt", [A * t, A - t, N * 2, N / 2], ["N = A / t = " + A + " : " + t + " = " + N + " Vt"]); }
    if (k === 2) { m = R(1, 30); h = R(2, 20); E = 10 * m * h;
      return NQ("Massasi " + m + " kg jism yerdan " + h + " m balandlikda turibdi. Uning potensial energiyasi necha J? (g = 10 N/kg)", E, "J", [m * h, E * 2, E / 2, 10 * (m + h)], ["Ep = m·g·h = " + m + " · 10 · " + h + " = " + E + " J"]); }
    if (k === 3) { m = pick([20, 50, 100, 200, 250, 500]); h = R(2, 15); A = 10 * m * h;
      return NQ("Kran " + m + " kg yukni " + h + " m balandlikka tekis ko'tardi. Bajarilgan ish necha J? (g = 10 N/kg)", A, "J", [m * h, A * 10, A / 2, 10 * m + h], ["F = m·g = " + 10 * m + " N", "A = F·h = " + 10 * m + " · " + h + " = " + A + " J"]); }
    if (k === 4) { m = pick([2, 4, 6, 8, 10, 20, 50, 60, 80]); v = R(2, 20); E = m * v * v / 2;
      return NQ("Massasi " + m + " kg jism " + v + " m/s tezlik bilan harakatlanmoqda. Uning kinetik energiyasi necha J?", E, "J", [m * v, m * v * v, m * v / 2, E + m], ["Ek = m·v²/2 = " + m + " · " + v + "² : 2 = " + E + " J"]); }
    if (k === 5) { F = pick([200, 500, 800, 1000, 1500, 2000, 3000]); v = R(2, 25); N = F * v;
      return NQ("Avtomobil " + v + " m/s tezlikda tekis harakatlanib, " + F + " N tortish kuchi hosil qilmoqda. Dvigatel quvvati necha Vt?", N, "Vt", [F / v, F + v, N * 10, N / 10], ["N = F · v = " + F + " · " + v + " = " + N + " Vt"]); }
    if (k === 6) { N = pick([0.5, 1, 1.5, 2, 3, 5]); t = pick([2, 5, 10, 20, 30]); A = N * 60 * t;
      return NQ("Quvvati " + N + " kVt bo'lgan dvigatel " + t + " minut ishladi. U necha kJ ish bajardi?", A, "kJ", [N * t, N * t * 1000, A / 10, A * 60], [N + " kVt = " + N * 1000 + " Vt, " + t + " min = " + t * 60 + " s", "A = N·t = " + f(A * 1000) + " J = " + f(A) + " kJ"]); }
    if (k === 7) { eta = pick([40, 50, 60, 75, 80, 90]); At = pick([200, 400, 500, 800, 1000, 1200, 2000, 4000]); Af = At * eta / 100;
      return NQ("Mexanizmga " + At + " J ish sarflandi, foydali ish " + Af + " J. Mexanizmning FIK necha foiz?", eta, "%", [Math.round(At / Af * 100), 100 - eta, eta + 10, eta / 2], ["η = A_f / A_s · 100% = " + Af + " : " + At + " · 100% = " + eta + "%"]); }
    if (k === 8) { m = R(1, 20); h = R(2, 15); E = 10 * m * h;
      return NQ("Massasi " + m + " kg jismning yerga nisbatan potensial energiyasi " + E + " J. U qanday balandlikda turibdi? (g = 10 N/kg, m da)", h, "m", [E / m, h * 10, h * 2, h + 5], ["h = Ep / (m·g) = " + E + " : " + 10 * m + " = " + h + " m"]); }
    if (k === 9) { v = pick([10, 20, 30, 40, 50, 60]); h = v * v / 20;
      return NQ("Jism " + h + " m balandlikdan erkin tushdi (g = 10 m/s², havo qarshiligi yo'q). Yerga urilish oldidagi tezligi necha m/s?", v, "m/s", [20 * h, v * 2, v / 2, v + 10], ["m·g·h = m·v²/2 ⇒ v = √(2gh)", "v = √(2 · 10 · " + h + ") = √" + 20 * h + " = " + v + " m/s"]); }
    if (k === 10) { v = pick([10, 20, 30, 40]); h = v * v / 20;
      return NQ("Jism yerdan tik yuqoriga " + v + " m/s tezlik bilan otildi (g = 10 m/s², havo qarshiligi yo'q). U necha metr balandlikka ko'tariladi?", h, "m", [v * v / 10, v * v, v / 2, h * 4], ["h = v²/(2g) = " + v + "² : 20 = " + h + " m"]); }
    if (k === 11) { m = pick([1000, 1200, 1600, 2000]); kmh = pick([36, 72, 108]); ms = kmh / 3.6; ms = Math.round(ms); E = m * ms * ms / 2000;
      return NQ("Massasi " + m + " kg avtomobil " + kmh + " km/soat tezlikda harakatlanmoqda. Uning kinetik energiyasi necha kJ?", E, "kJ", [m * kmh * kmh / 2000, E * 2, m * ms / 2000, E / 10], [kmh + " km/soat = " + ms + " m/s", "Ek = m·v²/2 = " + m + " · " + ms + "² : 2 = " + f(E * 1000) + " J = " + E + " kJ"]); }
    if (k === 12) { do { m = pick([10, 20, 40, 50, 60, 100]); h = pick([2, 3, 4, 5, 6, 10]); eta = pick([50, 60, 75, 80, 90]); Af = 10 * m * h; At = Af * 100 / eta; } while (At !== Math.round(At));
      return NQ("Yuk ko'targich " + m + " kg yukni " + h + " m balandlikka ko'tarib, " + At + " J ish sarfladi. Uning FIK necha foiz? (g = 10 N/kg)", eta, "%", [Math.round(At / Af * 100), eta / 10, 100 - eta, eta + 5],
        ["Foydali ish: A_f = m·g·h = " + Af + " J", "η = " + Af + " : " + At + " · 100% = " + eta + "%"]); }
    if (k === 13) { do { m = pick([50, 100, 200, 300, 500]); h = R(2, 12); t = pick([5, 10, 20, 25, 50]); N = 10 * m * h / t; } while (N !== Math.round(N));
      return NQ("Kran " + m + " kg yukni " + t + " s da " + h + " m balandlikka tekis ko'tardi. Kranning quvvati necha Vt? (g = 10 N/kg)", N, "Vt", [m * h / t, 10 * m * h, N * 2, N * t], ["A = m·g·h = " + 10 * m * h + " J", "N = A / t = " + 10 * m * h + " : " + t + " = " + N + " Vt"]); }
    kk = pick([100, 200, 400, 500, 1000]); x = pick([0.02, 0.05, 0.1, 0.2]); E = kk * x * x / 2;
    return NQ("Bikrligi " + kk + " N/m bo'lgan prujina " + x + " m ga cho'zildi. Uning potensial energiyasi necha J?", E, "J", [kk * x, kk * x * x, kk * x / 2, E * 10], ["E = k·x²/2 = " + kk + " · " + x + "² : 2 = " + f(E) + " J"]);
  }
  S.register("f2", mix(B2, P2, 0.4), "Fizika · Ish, quvvat va energiya");

  /*@END*/
})();
