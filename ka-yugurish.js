/*!
 * Kuvonch Academy — YUGURISH (Temple Run / Danger Dash uslubidagi kamera o'yini)
 * ka-virtual.js dvigateliga kengaytma: alohida fayl, sahifada ka-virtual.js dan OLDIN ulanadi.
 * Harakatga doir masalalar: har o'yin bitta mavzuga bog'langan (tezlik-masofa-vaqt, uchrashuv va quvish,
 * daryo oqimi, tezlanish va erkin tushish). Savol tepada, javob variantlari yo'ldagi 3 ta darvozada —
 * to'g'ri darvozadan yugurib o'tasiz. Yo'lda to'siqlar: past to'siq — sakrang, baland to'siq — egiling,
 * devor — yo'lakni almashtiring. Tangalar — qo'shimcha ochko.
 */
(function () {
  "use strict";
  var R = function (a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var isInt = function (x) { return x === Math.round(x); };
  function mstr(n) { return n < 0 ? "−" + (-n) : String(n); }
  function dec(x, d) { var p = Math.pow(10, d == null ? 1 : d); return mstr(Math.round(x * p) / p).replace(".", ","); }

  /* ======================= MAVZULAR (5 daraja, harakatga doir) ======================= */
  var KMH = [[18, 5], [36, 10], [54, 15], [72, 20], [90, 25], [108, 30]];
  function Qz(q, a, w, e) { var seen = { }, out = []; seen[String(a)] = 1; (w || []).forEach(function (v) { if (v == null || v === "" || (typeof v === "number" && (!isFinite(v) || v < 0 || (isInt(+a) && !isInt(v))))) return; var k = String(v); if (!seen[k]) { seen[k] = 1; out.push(v); } }); return { q: q, a: a, w: out, e: e }; }
  function lv(l) { return Math.max(1, Math.min(5, l | 0 || 2)); }
  function typ(l, t) { return pick(t[lv(l)]); }
  var OBJ = [["Yuguruvchi", "m/s"], ["Velosipedchi", "m/s"], ["Mashina", "km/soat"], ["Poyezd", "km/soat"], ["Avtobus", "km/soat"]];

  var TOPICS = {
    /* ---- Tezlik, masofa, vaqt ---- */
    harakat: { n: "Tezlik, masofa, vaqt", g: 6, q: function (l) {
      l = lv(l); var v, t, s, o, t_ = typ(l, { 1: ["s", "s", "v"], 2: ["s", "v", "t"], 3: ["v", "t", "min", "s"], 4: ["min", "kmh", "t", "qoldi"], 5: ["kmh", "ikki", "qoldi", "min"] });
      o = pick(OBJ);
      if (t_ === "s") { v = l === 1 ? R(2, 9) : R(10, 90); t = l === 1 ? R(2, 6) : R(2, 9); return Qz(o[0] + " " + v + " " + o[1] + " tezlikda " + t + " " + (o[1] === "m/s" ? "s" : "soat") + " yurdi. Masofa?", v * t, [v + t, v * t + v, v * t - t, Math.round(v / t)], "s = v · t = " + v + " · " + t + " = " + (v * t)); }
      if (t_ === "v") { v = l <= 2 ? R(2, 12) : R(5, 25); t = R(2, 9); s = v * t; return Qz("s = " + s + " m, t = " + t + " s. Tezlik? (m/s)", v, [s * t, s - t, v + 1, v - 1], "v = s / t = " + s + " / " + t + " = " + v + " m/s"); }
      if (t_ === "t") { v = R(3, 20); t = R(2, 12); s = v * t; return Qz(o[0] + " " + v + " " + o[1] + " tezlikda " + s + " " + (o[1] === "m/s" ? "m" : "km") + " yurdi. Vaqt?", t, [s * v, s - v, t + 1, t - 1], "t = s / v = " + s + " / " + v + " = " + t); }
      if (t_ === "min") { v = R(2, 10); t = pick([2, 3, 5, 10]); s = v * t * 60; return Qz("Yuguruvchi " + s + " m ni " + t + " daqiqada bosdi. Tezligi? (m/s)", v, [s / t, v * 60, v + 1, Math.round(s / t / 10)], t + " daq = " + (t * 60) + " s → v = " + s + " / " + (t * 60) + " = " + v + " m/s   (daqiqani soniyaga aylantiring!)"); }
      if (t_ === "kmh") { var k = pick(KMH); t = R(4, 20); return Qz("Mashina " + k[0] + " km/soat tezlikda " + t + " s yurdi. Masofa? (m)", k[1] * t, [k[0] * t, k[1] + t, k[1] * t * 2, k[0] * t / 10], k[0] + " km/soat = " + k[1] + " m/s → s = " + k[1] + " · " + t + " = " + (k[1] * t) + " m"); }
      if (t_ === "qoldi") { v = pick([40, 50, 60, 80, 90]); t = R(2, 5); var D = v * t + pick([20, 30, 40, 50, 100]); return Qz("Yo'l " + D + " km. Mashina " + v + " km/soat bilan " + t + " soat yurdi. Qancha qoldi? (km)", D - v * t, [v * t, D - v, D - t, D - v * t + 10], "Yurdi: " + v + " · " + t + " = " + (v * t) + " km → qoldi: " + D + " − " + (v * t) + " = " + (D - v * t) + " km"); }
      var v1 = pick([40, 50, 60]), t1 = R(1, 3), v2 = pick([70, 80, 90]), t2 = R(1, 3);
      return Qz("Mashina avval " + v1 + " km/soat bilan " + t1 + " soat, keyin " + v2 + " km/soat bilan " + t2 + " soat yurdi. Jami yo'l? (km)", v1 * t1 + v2 * t2, [(v1 + v2) * (t1 + t2), v1 * t1, v2 * t2, (v1 + v2) * t1], v1 + "·" + t1 + " + " + v2 + "·" + t2 + " = " + (v1 * t1) + " + " + (v2 * t2) + " = " + (v1 * t1 + v2 * t2) + " km");
    } },
    /* ---- Uchrashuv va quvish ---- */
    uchrashuv: { n: "Uchrashuv va quvish", g: 7, q: function (l) {
      l = lv(l); var v1, v2, t, d, t_ = typ(l, { 1: ["yaqin", "yaqin", "uzoq"], 2: ["uchr", "yaqin", "uzoq"], 3: ["uchr", "quv", "masofa"], 4: ["quv", "uchr2", "masofa"], 5: ["quv2", "uchr2", "oraliq"] });
      v1 = pick([40, 50, 60, 70]); v2 = pick([30, 40, 50, 60, 80]);
      if (t_ === "yaqin") return Qz("Ikki mashina bir-biriga qarab " + v1 + " va " + v2 + " km/soat bilan yuradi. Yaqinlashish tezligi?", v1 + v2, [Math.abs(v1 - v2), Math.max(v1, v2), v1 * v2 / 100], "Qarama-qarshi harakatda tezliklar qo'shiladi: " + v1 + " + " + v2 + " = " + (v1 + v2) + " km/soat");
      if (t_ === "uzoq") return Qz("Ikki velosipedchi bir nuqtadan qarama-qarshi tomonga " + (v1 / 5) + " va " + (v2 / 5) + " km/soat bilan ketdi. 1 soatdan keyin oradagi masofa? (km)", (v1 + v2) / 5, [Math.abs(v1 - v2) / 5, Math.max(v1, v2) / 5, (v1 + v2) / 5 + 1], "Uzoqlashish tezligi " + (v1 / 5) + " + " + (v2 / 5) + " = " + ((v1 + v2) / 5) + " km/soat → 1 soatda " + ((v1 + v2) / 5) + " km");
      if (t_ === "uchr") { t = R(2, 5); d = (v1 + v2) * t; return Qz("Shaharlar orasi " + d + " km. Ikki mashina bir vaqtda " + v1 + " va " + v2 + " km/soat bilan qarab yo'lga chiqdi. Necha soatda uchrashadi?", t, [isInt(d / v1) ? d / v1 : null, isInt(d / Math.abs(v1 - v2)) ? d / Math.abs(v1 - v2) : null, t + 1, t - 1], "t = s / (v₁ + v₂) = " + d + " / (" + v1 + " + " + v2 + ") = " + d + " / " + (v1 + v2) + " = " + t + " soat"); }
      if (t_ === "masofa") { t = R(2, 4); return Qz("Ikki poyezd bir-biriga qarab " + v1 + " va " + v2 + " km/soat bilan yuradi. " + t + " soatda oradagi masofa qanchaga kamayadi? (km)", (v1 + v2) * t, [Math.abs(v1 - v2) * t, v1 * t, v2 * t, (v1 + v2) * (t + 1)], "(" + v1 + " + " + v2 + ") · " + t + " = " + (v1 + v2) + " · " + t + " = " + ((v1 + v2) * t) + " km"); }
      if (t_ === "quv") { var a = pick([40, 50, 60]), b = a + pick([10, 20, 30]); t = R(2, 5); d = (b - a) * t; return Qz("Velosipedchi " + a + " km/soat, " + d + " km orqadan motorchi " + b + " km/soat bilan quvdi. Necha soatda yetib oladi?", t, [isInt(d / a) ? d / a : null, isInt(d / (a + b)) ? d / (a + b) : null, t + 1, t - 1], "Quvib yetish: t = s / (v₂ − v₁) = " + d + " / (" + b + " − " + a + ") = " + d + " / " + (b - a) + " = " + t + " soat   (tezliklar ayiriladi!)"); }
      if (t_ === "uchr2") { t = R(2, 4); var dd = R(1, 3); d = (v1 + v2) * t + v1 * dd; return Qz(d + " km. 1-mashina " + v1 + " km/soat bilan chiqdi, " + dd + " soatdan keyin unga qarab 2-mashina " + v2 + " km/soat bilan. 2-mashina necha soatda uchrashadi?", t, [isInt(d / (v1 + v2)) ? d / (v1 + v2) : null, t + dd, t + 1, t - 1], "Avval birinchisi " + v1 + "·" + dd + " = " + (v1 * dd) + " km yurdi → qoldi " + (d - v1 * dd) + " km → t = " + (d - v1 * dd) + " / " + (v1 + v2) + " = " + t + " soat"); }
      if (t_ === "quv2") { var va = pick([50, 60, 70]), vb = va + pick([10, 20, 25]), dt = pick([1, 2]); t = (va * dt) / (vb - va); var tries = 0; while (!isInt(t) && tries++ < 30) { vb = va + pick([10, 20, 25, 30]); dt = pick([1, 2, 3]); t = (va * dt) / (vb - va); } if (!isInt(t)) { va = 50; vb = 75; dt = 1; t = 2; } return Qz("Avtobus " + va + " km/soat bilan chiqdi. " + dt + " soatdan keyin shu yo'ldan mashina " + vb + " km/soat bilan chiqdi. Necha soatda quvib yetadi?", t, [dt, t + dt, t + 1, isInt(va / (vb - va)) ? va / (vb - va) + 1 : null], "Oraliq: " + va + "·" + dt + " = " + (va * dt) + " km → t = " + (va * dt) + " / (" + vb + " − " + va + ") = " + t + " soat"); }
      t = R(1, 3); var D2 = (v1 + v2) * (t + R(1, 2)); return Qz("Masofa " + D2 + " km. Ikki mashina qarab " + v1 + " va " + v2 + " km/soat bilan chiqdi. " + t + " soatdan keyin oraliq? (km)", D2 - (v1 + v2) * t, [(v1 + v2) * t, D2 - v1 * t, D2 - v2 * t, D2 - (v1 + v2) * t + 10], D2 + " − (" + v1 + " + " + v2 + ")·" + t + " = " + D2 + " − " + ((v1 + v2) * t) + " = " + (D2 - (v1 + v2) * t) + " km");
    } },
    /* ---- Daryo oqimi ---- */
    daryo: { n: "Daryo oqimi bo'ylab va qarshi", g: 7, q: function (l) {
      l = lv(l); var v, c, t, t_ = typ(l, { 1: ["boylab", "qarshi"], 2: ["boylab", "qarshi", "sol"], 3: ["sol", "oqim", "vaqt"], 4: ["oqim", "vaqt", "ikki"], 5: ["ikki", "orta", "vaqt2"] });
      v = R(8, 20); c = R(1, Math.min(5, v - 3));
      if (t_ === "boylab") return Qz("Qayiq tinch suvda " + v + " km/soat, oqim " + c + " km/soat. Oqim bo'ylab tezligi?", v + c, [v - c, v, v * c], "Oqim bo'ylab: v + c = " + v + " + " + c + " = " + (v + c) + " km/soat");
      if (t_ === "qarshi") return Qz("Qayiq tinch suvda " + v + " km/soat, oqim " + c + " km/soat. Oqimga qarshi tezligi?", v - c, [v + c, v, c], "Oqimga qarshi: v − c = " + v + " − " + c + " = " + (v - c) + " km/soat");
      if (t_ === "sol") { var sl = pick([5, 6, 8, 10]); return Qz("Sol (o'zi suzmaydi) " + c + " km/soat oqimda " + sl + " soat suzdi. Masofa? (km)", c * sl, [c + sl, c * sl * 2, sl], "Sol oqim tezligida suzadi: s = " + c + " · " + sl + " = " + (c * sl) + " km"); }
      if (t_ === "oqim") return Qz("Qayiq oqim bo'ylab " + (v + c) + " km/soat, oqimga qarshi " + (v - c) + " km/soat. Oqim tezligi?", c, [v, 2 * c, v + c - 1], "c = (" + (v + c) + " − " + (v - c) + ") / 2 = " + (2 * c) + " / 2 = " + c + " km/soat;  qayiq: (" + (v + c) + " + " + (v - c) + ") / 2 = " + v);
      if (t_ === "vaqt") { t = R(2, 5); var s = (v + c) * t; return Qz("Qayiq " + v + " km/soat, oqim " + c + " km/soat. Oqim bo'ylab " + s + " km necha soatda?", t, [isInt(s / v) ? s / v : null, isInt(s / (v - c)) ? s / (v - c) : null, t + 1], "t = s / (v + c) = " + s + " / " + (v + c) + " = " + t + " soat"); }
      if (t_ === "ikki") { var vv = pick([10, 12, 15, 20]), cc = pick([2, 3, 5]); if (cc >= vv) cc = 2; var S0 = (vv + cc) * (vv - cc); while (S0 > 400) { vv = 10; cc = 2; S0 = 96; } var tb = S0 / (vv + cc), tq = S0 / (vv - cc); return Qz("Qayiq " + vv + " km/soat, oqim " + cc + " km/soat. " + S0 + " km borib-qaytish uchun jami vaqt? (soat)", tb + tq, [2 * S0 / vv, tb, tq, tb + tq + 1], "Borish: " + S0 + " / " + (vv + cc) + " = " + tb + " soat, qaytish: " + S0 + " / " + (vv - cc) + " = " + tq + " soat → jami " + (tb + tq)); }
      if (t_ === "orta") { var P = pick([[60, 40, 48], [30, 60, 40], [40, 60, 48], [20, 30, 24], [60, 30, 40], [12, 6, 8]]); return Qz("Qayiq borishda " + P[0] + " km/soat, qaytishda " + P[1] + " km/soat (bir xil yo'l). O'rtacha tezlik?", P[2], [(P[0] + P[1]) / 2, P[0] - P[1], P[2] + 2], "O'rtacha tezlik = 2·" + P[0] + "·" + P[1] + " / (" + P[0] + " + " + P[1] + ") = " + P[2] + "   (" + ((P[0] + P[1]) / 2) + " emas — vaqtlar har xil!)"); }
      t = R(2, 4); var s2 = (v - c) * t; return Qz("Qayiq " + v + " km/soat, oqim " + c + " km/soat. Oqimga qarshi " + s2 + " km — necha soat?", t, [isInt(s2 / (v + c)) ? s2 / (v + c) : null, isInt(s2 / v) ? s2 / v : null, t + 1, t - 1], "t = s / (v − c) = " + s2 + " / " + (v - c) + " = " + t + " soat");
    } },
    /* ---- Tezlanish va erkin tushish ---- */
    tezlanish: { n: "Tezlanish va erkin tushish", g: 9, q: function (l) {
      l = lv(l); var a, t, v0, v, t_ = typ(l, { 1: ["a", "v"], 2: ["a", "v", "gt"], 3: ["v", "gt", "tormoz", "t"], 4: ["tormoz", "h", "s", "t"], 5: ["s", "h", "vs", "tormoz2"] });
      if (t_ === "a") { a = R(1, 5); t = R(2, 10); v0 = R(0, 10); v = v0 + a * t; return Qz("Tezlik " + t + " s da " + v0 + " m/s dan " + v + " m/s ga oshdi. Tezlanish? (m/s²)", a, [v - v0, Math.round(v / t), a + 1, a - 1 || null], "a = (v − v₀) / t = (" + v + " − " + v0 + ") / " + t + " = " + a + " m/s²"); }
      if (t_ === "v") { a = R(1, 4); t = R(2, 10); v0 = R(0, 12); return Qz("v₀ = " + v0 + " m/s, a = " + a + " m/s², t = " + t + " s. Tezlik? (m/s)", v0 + a * t, [v0 + a, a * t, v0 * t + a, v0 + a * t + a], "v = v₀ + a·t = " + v0 + " + " + a + "·" + t + " = " + (v0 + a * t) + " m/s"); }
      if (t_ === "gt") { t = R(1, 6); return Qz("Jism tinch holatdan erkin tushmoqda (g = 10). " + t + " s dan keyingi tezligi? (m/s)", 10 * t, [5 * t * t, t, 10 * t + 10], "v = g·t = 10 · " + t + " = " + (10 * t) + " m/s"); }
      if (t_ === "tormoz") { a = R(1, 5); t = R(2, 8); v0 = a * t; return Qz("Mashina " + v0 + " m/s dan " + a + " m/s² tezlanish bilan tormozlandi. Necha soniyada to'xtaydi?", t, [v0 * a, v0 - a, t + 1, t - 1], "t = v₀ / a = " + v0 + " / " + a + " = " + t + " s"); }
      if (t_ === "t") { a = R(1, 4); t = R(2, 9); v = a * t; return Qz("Tinch holatdan a = " + a + " m/s² bilan harakat boshlandi. Qancha vaqtda tezlik " + v + " m/s bo'ladi? (s)", t, [v * a, v - a, t + 1], "t = v / a = " + v + " / " + a + " = " + t + " s"); }
      if (t_ === "h") { t = R(1, 5); return Qz("Jism " + t + " s erkin tushdi (g = 10). Bosib o'tgan balandlik? (m)", 5 * t * t, [10 * t, 10 * t * t, 5 * t], "h = g·t² / 2 = 10 · " + t + "² / 2 = " + (5 * t * t) + " m"); }
      if (t_ === "s") { a = pick([2, 4]); t = R(2, 6); v0 = R(0, 5) * 2; var s = v0 * t + a * t * t / 2; return Qz("v₀ = " + v0 + " m/s, a = " + a + " m/s², t = " + t + " s. Yo'l? (m)", s, [v0 * t + a * t * t, (v0 + a * t) * t, v0 * t, s + a], "s = v₀·t + a·t²/2 = " + v0 + "·" + t + " + " + a + "·" + t + "²/2 = " + (v0 * t) + " + " + (a * t * t / 2) + " = " + s + " m"); }
      if (t_ === "vs") { a = pick([1, 2, 5]); v = pick([10, 20, 30]); var ss = v * v / (2 * a); if (!isInt(ss)) { a = 2; v = 20; ss = 100; } return Qz("Tinch holatdan a = " + a + " m/s² bilan " + ss + " m yurdi. Tezligi? (m/s)", v, [ss / a, 2 * ss / a, v + 10, v - 5], "v² = 2·a·s = 2 · " + a + " · " + ss + " = " + (v * v) + " → v = " + v + " m/s"); }
      a = R(2, 5); t = R(1, 3) * 2; v0 = a * t; return Qz("Mashina " + v0 + " m/s tezlikdan " + a + " m/s² bilan to'xtaguncha tormozlandi. Tormoz yo'li? (m)", v0 * t / 2, [v0 * t, v0 * v0 / a, v0 / a, v0 * t / 2 + a], "t = " + v0 + " / " + a + " = " + t + " s → s = v₀·t / 2 = " + v0 + " · " + t + " / 2 = " + (v0 * t / 2) + " m   (yoki s = v₀² / 2a)");
    } }
  };

  /* ======================= DVIGATELGA RO'YXAT ======================= */
  var HOW = "Qo'lingizni chapga-o'ngga suring — yuguruvchi 3 yo'lakdan birini tanlaydi. <b>Qo'lni yuqoriga ko'taring</b> yoki 🤏 chimdang — sakraydi (past to'siq 🪵), <b>musht</b> ✊ — egilib o'tadi (baland to'siq 🚧). Devor ⛔ dan yo'lakni almashtirib qoching. Savol tepada — javobi yozilgan <b>darvozadan</b> o'ting. 🪙 tangalar +2. Klaviatura: ← → · ↑ sakrash · ↓ egilish. Sichqoncha: ekran yuqori yarmini bosish — sakrash, pastki yarmini — egilish.";
  window.KAV_EXT = {
    topics: TOPICS,
    mech: { yugurish: { e: "🏃", n: "Yugurish", how: HOW, time: 90, hands: 1 } },
    src: { yugurish: TOPICS },   // poyga mavzulari dvigatelning TOPICS ro'yxatidan olinadi
    games: [
      { t: "Ma'bad yo'li: tezlik, masofa, vaqt", m: "yugurish", k: "harakat", th: "oltin", i: "Temple Run" },
      { t: "Xavfli yugurish: uchrashuv va quvish", m: "yugurish", k: "uchrashuv", th: "olov", i: "Danger Dash" },
      { t: "Daryo bo'yi: oqim bo'ylab va qarshi", m: "yugurish", k: "daryo", th: "suv", i: "River Run" },
      { t: "Kosmik yugurish: tezlanish", m: "yugurish", k: "tezlanish", th: "galaktika", i: "Space Run" },
      /* Mavzuli poyga (ka-virtual.js dagi poyga mexanikasi, darvozalarda savol javoblari) */
      { t: "Poyga: ko'paytirish jadvali", m: "poyga", k: "kopaytirish", th: "olov", i: "Poyga" },
      { t: "Poyga: tenglamalar", m: "poyga", k: "tenglama", th: "neon", i: "Poyga" },
      { t: "Poyga: kasrlar", m: "poyga", k: "kasr", th: "suv", i: "Poyga" },
      { t: "Poyga: manfiy sonlar", m: "poyga", k: "manfiy", th: "galaktika", i: "Poyga" }
    ],
    install: function (M, X) {
      var st = document.createElement("style"); st.textContent = ".kv-q{font-size:clamp(17px,3.1vw,30px)!important;top:50px}.kv-sub{display:none}"; document.head.appendChild(st);
      M.yugurish = function () {
        var ctx, W, H; var LANE = [-1, 0, 1], CAMD = 9, VIEW = 150;
        var player = { lane: 1, x: 0, jump: 0, slide: 0, stumble: 0, dist: 0, sp: 34, hitT: 0 };
        var objs = [], q = null, gateZ = 0, nextGateD = 90, coins = 0, keys = {}, raise = 0, fistT = 0, lastMouseDown = false, spawnZ = 40, shakeT = 0;
        var tp = X.TOPICS[X.G.k];
        function sync() { ctx = X.ctx; W = X.W; H = X.H; }
        function HZ() { return H * 0.40; }
        function proj(lane, z, dy) {        // 3D → ekran: k — masshtab (1 — oldimizda, 0 — ufqda)
          var k = CAMD / (CAMD + z), y = HZ() + (H * 0.86 - HZ()) * k - (dy || 0) * k;
          return { x: W / 2 + lane * W * 0.26 * k, y: y, k: k, w: W * 0.24 * k };
        }
        function nq() {
          q = X.askQ(tp); X.showQ(q);
          var o = X.makeOpts(q, 3), ln = X.shuffle([0, 1, 2]);
          var z = Math.max(spawnZ, 55) + 25; gateZ = z;
          o.forEach(function (op, i) { objs.push({ t: "gate", lane: ln[i], z: z, s: op.s, ok: op.ok, q: q }); });
          spawnZ = z + 22;
        }
        function spawnRun() {
          while (spawnZ < VIEW) {
            if (spawnZ >= gateZ - 14 && spawnZ <= gateZ + 6) { spawnZ = gateZ + 22; continue; }   // darvoza atrofi bo'sh
            var l = X.lvl(), r = Math.random();
            var lane = R(0, 2);
            if (r < 0.26) objs.push({ t: "low", lane: lane, z: spawnZ });
            else if (r < 0.46) objs.push({ t: "high", lane: lane, z: spawnZ });
            else if (r < 0.62 + l * 0.03) objs.push({ t: "wall", lane: lane, z: spawnZ });
            else for (var c = 0; c < 4; c++) objs.push({ t: "coin", lane: lane, z: spawnZ + c * 4 });
            if (l >= 3 && Math.random() < 0.35) objs.push({ t: Math.random() < 0.5 ? "low" : "wall", lane: (lane + 1 + R(0, 1)) % 3, z: spawnZ + 2 });
            spawnZ += 24 - Math.min(8, l * 1.5) + Math.random() * 8;
          }
        }
        function stumble(msg, col) { player.stumble = 0.9; player.sp = Math.max(22, player.sp * 0.6); shakeT = 0.4; X.beep(120, 0.25, "sawtooth", 0.2); if (msg) X.banner(msg, col || "#ff6b6b"); if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) {} }
        function onKey(e) { var k = e.key.toLowerCase(), dn = e.type === "keydown"; keys[k] = dn; if (dn && !e.repeat) { if (k === "arrowleft" || k === "a") player.lane = Math.max(0, player.lane - 1); if (k === "arrowright" || k === "d") player.lane = Math.min(2, player.lane + 1); if ((k === "arrowup" || k === "w" || k === " ") && !player.jump) player.jump = 0.75; if ((k === "arrowdown" || k === "s") && !player.slide) player.slide = 0.7; } }
        window.addEventListener("keydown", onKey); window.addEventListener("keyup", onKey);
        function control(dt) {
          var p = X.pointers[0];
          if (!p) return;
          if (X.mouseMode || p.touch) {
            player.lane = p.x < W / 3 ? 0 : p.x < W * 2 / 3 ? 1 : 2;
            if (p.pinchStart) { if (p.y < H * 0.5) { if (!player.jump) player.jump = 0.75; } else if (!player.slide) player.slide = 0.7; }
            return;
          }
          var h = p.hand;
          player.lane = h.pts[9].x < W / 3 ? 0 : h.pts[9].x < W * 2 / 3 ? 1 : 2;
          var up = h.pts[9].y < H * 0.33 || p.pinch;
          if (up && !raise) { if (!player.jump) player.jump = 0.75; } raise = up ? 1 : 0;
          if (h.fingers === 0) { fistT += dt; if (fistT > 0.12 && !player.slide) player.slide = 0.7; } else fistT = 0;
        }
        return {
          start: function () { sync(); objs = []; player = { lane: 1, x: 0, jump: 0, slide: 0, stumble: 0, dist: 0, sp: 34, hitT: 0 }; coins = 0; spawnZ = 40; nq(); spawnRun(); },
          resize: sync,
          hud: function () { return "⭐ " + X.S.score[0] + " · 🏃 " + Math.round(player.dist) + " m · 🪙 " + coins; },
          answer: function (v) { if (!q) return false; var ok = String(v).trim().replace(/,/g, ".") === String(q.a).replace(/,/g, "."); if (ok) { X.good(W / 2, H * 0.5, 0, 0, X.qDone(q)); objs = objs.filter(function (o) { return o.t !== "gate"; }); nq(); } else X.bad(W / 2, H * 0.5, 0, null, q); return ok; },
          stop: function () { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); },
          update: function (dt) {
            sync(); control(dt);
            var l = X.lvl(), target = 34 + l * 5 + Math.min(20, player.dist / 60);
            if (player.stumble > 0) player.stumble -= dt; else player.sp += (target - player.sp) * dt * 0.8;
            if (player.jump > 0) player.jump -= dt; if (player.slide > 0) player.slide -= dt; if (player.hitT > 0) player.hitT -= dt; if (shakeT > 0) shakeT -= dt;
            player.x += (LANE[player.lane] - player.x) * Math.min(1, dt * 10);
            var mv = player.sp * dt; player.dist += mv; spawnZ -= mv; gateZ -= mv;
            var inAir = player.jump > 0.12 && player.jump < 0.66, down = player.slide > 0;
            for (var i = objs.length - 1; i >= 0; i--) {
              var o = objs[i]; o.z -= mv;
              if (o.z < -4) { if (o.t === "gate" && !o.done && o.ok && o.q === q) { /* to'g'ri darvoza o'tkazib yuborildi */ X.bad(W / 2, H * 0.55, 0, null, q); objs = objs.filter(function (g) { return g.t !== "gate"; }); nq(); break; } objs.splice(i, 1); continue; }
              if (o.done || o.z > 1.5 || o.z < -1.5) continue;
              var sameLane = Math.abs(player.x - LANE[o.lane]) < 0.55;
              if (!sameLane) continue;
              o.done = true;
              var P = proj(LANE[o.lane], 0);
              if (o.t === "coin") { coins++; X.S.score[0] += 2; X.burst(P.x, P.y - 40, 8, ["#ffd400", "#fff"], 0.6); X.beep(900 + coins % 5 * 60, 0.06, "square", 0.08); }
              else if (o.t === "low") { if (!inAir) { stumble("🪵 To'siq! Sakrash kerak edi (qo'lni ko'taring)"); X.S.score[0] = Math.max(0, X.S.score[0] - 3); } }
              else if (o.t === "high") { if (!down) { stumble("🚧 Baland to'siq! Egilish kerak edi (musht)"); X.S.score[0] = Math.max(0, X.S.score[0] - 3); } }
              else if (o.t === "wall") { stumble("⛔ Devor! Yo'lakni almashtiring"); X.S.score[0] = Math.max(0, X.S.score[0] - 3); }
              else if (o.t === "gate") {
                if (o.q !== q) continue;
                objs.forEach(function (g) { if (g.t === "gate") g.done = true; });
                if (o.ok) { X.good(P.x, P.y - 60, 0, 0, X.qDone(q, o.s)); player.sp += 6; } else { X.bad(P.x, P.y - 60, 0, null, q); stumble(null); }
                objs = objs.filter(function (g) { return g.t !== "gate"; }); nq();
                break;
              }
            }
            spawnRun();
          },
          draw: function (dt) {
            sync(); var hz = HZ(), T = X.TH, acc = T.acc;
            ctx.save(); if (shakeT > 0) ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6);
            // yo'l (trapetsiya) va yo'laklar
            var g0 = ctx.createLinearGradient(0, hz, 0, H); g0.addColorStop(0, acc + "10"); g0.addColorStop(1, acc + "30");
            var pl = proj(-1.55, 0), pr = proj(1.55, 0), fl = proj(-1.55, VIEW), fr = proj(1.55, VIEW);
            ctx.fillStyle = g0; ctx.beginPath(); ctx.moveTo(pl.x, pl.y); ctx.lineTo(pr.x, pr.y); ctx.lineTo(fr.x, fr.y); ctx.lineTo(fl.x, fl.y); ctx.closePath(); ctx.fill();
            // xavf chetlari (lava / suv)
            ctx.fillStyle = T.th === "suv" ? "#0ea5e955" : "#ff3d0055"; ctx.fillRect(0, hz, W, H - hz);
            ctx.fillStyle = T.bg; ctx.beginPath(); ctx.moveTo(pl.x, pl.y); ctx.lineTo(pr.x, pr.y); ctx.lineTo(fr.x, fr.y); ctx.lineTo(fl.x, fl.y); ctx.closePath(); ctx.fill();
            ctx.fillStyle = g0; ctx.fill();
            ctx.strokeStyle = acc + "88"; ctx.lineWidth = 2;
            [-1.55, -0.5, 0.5, 1.55].forEach(function (lx) { var a = proj(lx, 0), b = proj(lx, VIEW); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
            // harakatlanuvchi ko'ndalang chiziqlar
            for (var z = (player.dist % 12); z < VIEW; z += 12) { var a1 = proj(-1.55, z), b1 = proj(1.55, z); ctx.strokeStyle = "#ffffff" + (z < 60 ? "22" : "11"); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y); ctx.stroke(); }
            // uzoqdan yaqinga chizish
            var sorted = objs.slice().sort(function (a, b) { return b.z - a.z; });
            sorted.forEach(function (o) {
              if (o.z > VIEW || o.z < -3) return;
              var P = proj(LANE[o.lane], o.z), k = P.k, w = P.w, hgt;
              if (o.done && o.t !== "gate") return;
              if (o.t === "coin") { X.drawBall(P.x, P.y - 22 * k - Math.sin(X.t * 6 + o.z) * 4 * k, 12 * k + 2, null, { c: "#ffd400", glow: 10 }); }
              else if (o.t === "low") { hgt = 34 * k; X.drawBox(P.x - w / 2, P.y - hgt, w, hgt, k > 0.4 ? "🪵" : null, { c: "#c08040", fill: "#5a3a1acc", glow: 4 }); }
              else if (o.t === "high") { hgt = 60 * k; X.drawBox(P.x - w / 2, P.y - 150 * k, w, hgt, k > 0.4 ? "🚧" : null, { c: "#ff4d4d", fill: "#5a1a1acc", glow: 6 }); ctx.strokeStyle = "#ff4d4d88"; ctx.beginPath(); ctx.moveTo(P.x - w / 2, P.y - 90 * k); ctx.lineTo(P.x - w / 2, P.y); ctx.moveTo(P.x + w / 2, P.y - 90 * k); ctx.lineTo(P.x + w / 2, P.y); ctx.stroke(); }
              else if (o.t === "wall") { hgt = 120 * k; X.drawBox(P.x - w / 2, P.y - hgt, w, hgt, k > 0.35 ? "⛔" : null, { c: "#9ca3af", fill: "#1f2937dd", glow: 2 }); }
              else if (o.t === "gate") { hgt = 110 * k; X.drawBox(P.x - w / 2, P.y - hgt, w, hgt, o.s, { c: o.done ? (o.ok ? "#5ee67a" : "#ff6b6b") : acc, fill: "rgba(0,0,0,.55)", fs: Math.min(hgt * 0.42, w / Math.max(2, String(o.s).length * 0.6)), glow: 16 }); }
            });
            // yuguruvchi
            var Pp = proj(player.x, 0), jh = player.jump > 0 ? Math.sin(Math.min(1, player.jump / 0.75) * Math.PI) * 110 : 0;
            var em = player.slide > 0 ? "🧎" : player.stumble > 0 ? "🤸" : "🏃";
            ctx.save(); ctx.translate(Pp.x, Pp.y - jh); ctx.scale(-1, 1); // chapga emas, oldinga qaragan bo'lsin
            ctx.font = (player.slide > 0 ? 58 : 76) + "px " + X.FONT; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.shadowColor = acc; ctx.shadowBlur = 18;
            ctx.fillText(em, 0, 0); ctx.restore();
            ctx.fillStyle = "#00000055"; ctx.beginPath(); ctx.ellipse(Pp.x, Pp.y + 4, 34 - jh * 0.15, 8, 0, 0, 7); ctx.fill();
            ctx.restore();
          }
        };
      };
    }
  };
})();
