/*!
 * Kuvonch Academy — sinf o'yinlari uchun umumiy dvigatel (ka-sinf-oyin.js)
 * Ishlatadigan sahifalar: kataklar.html (Sirli kataklar), shoh-savol.html (Shoh savol doskasi),
 * oltin-sandiq.html (Oltin sandiq), moslashtir.html, mol-ur.html, omad-gildiragi.html
 *
 *  KSO.TOPICS / GROUPS / FANS     — viktorina bilan bir xil mavzular katalogi (grafikli savollarsiz)
 *  KSO.picker(el, sel, onChange)  — fan → mavzu tanlash paneli (qidiruv, guruhlar, "Hammasi")
 *  KSO.prep(ids) -> Promise        — kerakli generator fayllarini (faqat tanlangan fanlar) yuklaydi
 *  KSO.ask(ids, lvl, seen, o)      — {q, a, opts[], ci, steps[], tid, L, r} — har safar yangi savol
 *  KSO.askModal(o)                 — savol oynasi: 4 variant, taymer, yechim qadamlari
 *  KSO.teamsUI / podium / confetti / snd / toast / fit / full
 *  KSO.room                        — telefon rejimi: xona (kod + QR), o'quvchilar ro'yxati, telefon tomoni
 * Savollar: ka-savollar.js (kaSavol) + fan generatorlari. ES5 — eski telefonlarda ham ishlaydi.
 */
(function () {
  "use strict";
  if (window.KSO) return;

  var DATA = {"t":[["a1","A1. Qo'shish amali",0],["a2","A2. Ayirish amali",0],["a3","A3. Ko'paytirish amali",0],["a4","A4. Bo'lish amali",0],["a5","A5. Foizlar bilan amallar",0],["a6","A6. Darajaga ko'tarish amali",0],["a7","A7. Ko'paytirish (karra) jadvali",0],["a8","A8. Sonlar",0],["t1","1. Kvadrat funksiya va uning grafigi",1],["t2","2. Kvadrat tengsizlik va uning yechimi",1],["t3","3. Trigonometrik ayniyatlar",1],["t4","4. Arifmetik va geometrik progressiya",1],["t5","5. Funksiya tushunchasi",1],["t6","6. Funksiya xossalari",1],["t7","7. Funksiya grafiklarini sodda almashtirish",1],["t8","8. Chiziqli va kvadratik modellashtirish",1],["t9","9. Loyiha ishi. Munosabatlar va funksiyalar",1],["t10","10. Sodda ratsional tenglamalar",1],["t11","11. Sodda ratsional tenglamalar sistemasi",1],["t12","12. Sodda ratsional tengsizliklar",1],["t13","13. Sodda ratsional tengsizliklar sistemasi",1],["t14","14. Ratsional tenglamalarga doir misollar yechish",1],["t15","15. Sodda irratsional tenglamalar",1],["t16","16. Irratsional tenglamalarga doir misollar yechish",1],["t17","17. Sodda irratsional tenglamalar sistemasi",1],["t18","18. Ratsional va irratsional ifodalarga doir misollar",1],["t19","19. Ko'rsatkichli funksiya",1],["t20","20. Logarifmik funksiya",1],["t21","21. Ko'rsatkichli va logarifmik ifodalarni soddalashtirish",1],["t22","22. Sodda ko'rsatkichli tenglamalar",1],["t23","23. Sodda logarifmik tenglamalar",1],["t24","24. Ko'rsatkichli va logarifmik tenglamalar sistemasi",1],["t25","25. Sodda ko'rsatkichli tengsizliklar",1],["t26","26. Sodda logarifmik tengsizliklar",1],["t27","27. Ko'rsatkichli modellashtirish",1],["t28","28. Ko'rsatkichli va logarifmik ifodalarga doir misollar",1],["t29","29. Trigonometrik funksiyalar",1],["t30","30. Teskari trigonometrik funksiyalar",1],["t31","31. Trigonometrik funksiyalarga doir misollar",1],["t32","32. STEM topshiriq",1],["t33","33. sin x = a, cos x = a trigonometrik tenglamalar",1],["t34","34. tg x = a, ctg x = a trigonometrik tenglamalar",1],["t35","35. Trigonometrik tenglamalarni yechish",1],["t36","36. Eng sodda trigonometrik tengsizliklar",1],["t37","37. Tasodifiy hodisalar",1],["t38","38. Ehtimollikni hisoblashda kombinatorika formulalaridan foydalanish",1],["t39","39. Teng ehtimolli hodisalar",1],["t40","40. Planimetriyaning mantiqiy tuzilishi",1],["t41","41. Geometrik masalalar va ularni yechish usullari",1],["t42","42. Stereometriyaning asosiy tushunchalari",1],["t43","43. Fazoda to'g'ri chiziqlar va tekisliklar",1],["t44","44. Fazoviy geometrik shakllar. Ko'pyoqlar",1],["t45","45. Ko'pyoqlarni tasvirlash va modelini yasash",1],["t46","46. Fazoda to'g'ri chiziqlarning o'zaro joylashuvi",1],["t47","47. Ayqash to'g'ri chiziqlar",1],["t48","48. Fazoda to'g'ri chiziqlar va tekisliklarning o'zaro joylashuvi",1],["t49","49. Fazoda tekisliklarning o'zaro joylashuvi",1],["t50","50. Fazoda parallel proyeksiyalash",1],["t51","51. Qisqa ko'paytirish formulalari",2],["t52","52. Ko'phadni ko'paytuvchilarga ajratish",2],["t53","53. Modulli tenglamalar va tengsizliklar",2],["t54","54. Arifmetik progressiya",2],["t55","55. Geometrik progressiya",2],["t56","56. Nisbat, proporsiya va foizli masalalar",2],["t57","57. O'rta qiymatlar (arifmetik, geometrik, garmonik)",2],["t58","58. Determinantlar va Kramer usuli",2],["t59","59. Funksiyaning limiti asoslari",2],["t60","60. Hosila va uning tatbiqlari (asosiy formulalar)",2],["t61","61. Bo'linish belgilari, EKUB va EKUK",2],["t62","62. Kvadrat ildiz va ratsional ko'rsatkichli daraja",2],["t63","63. Vyet teoremasi",2],["t64","64. Irratsional tenglamalar",2],["t65","65. Funksiyaning aniqlanish sohasi",2],["t66","66. Gorner sxemasi va Bezu teoremasi",2],["t67","67. Logarifm xossalari va sodda logarifmik tenglamalar",2],["t68","68. Asosiy trigonometrik ayniyatlar va keltirish formulalari",2],["t69","69. Sodda trigonometrik tenglamalar (sin x = a, cos x = a)",2],["t70","70. Aniqmas integral asoslari",2],["t71","71. Uchburchak va uning xossalari",3],["t72","72. To'rtburchaklar va ularning xossalari",3],["t73","73. Aylana va doira",3],["t74","74. Muntazam ko'pburchaklar",3],["t75","75. Prizma va parallelepiped",3],["t76","76. Piramida",3],["t77","77. Silindr",3],["t78","78. Konus",3],["t79","79. Shar va sfera",3],["t80","80. Ichki va tashqi chizilgan shakllar",3],["t81","81. Jismlar kombinatsiyasi (shar, silindr, konus, prizma)",3],["t82","82. Dekart koordinatalari (tekislikda)",3],["t83","83. Vektorlar (tekislikda)",3],["t84","84. Fazoda koordinatalar va vektorlar",3],["t85","85. Sinuslar va kosinuslar teoremalari",3],["t86","86. Shakllar o'xshashligi",3],["t87","87. Fazoda burchak va masofalar",3],["t88","88. Jismlarning kesimlari",3],["t89","89. Faktorial",4],["t90","90. Kombinatorikaning asosiy qoidalari",4],["t91","91. O'rin almashtirish, o'rinlashtirish va guruhlash",4],["t92","92. Ehtimollik: klassik ta'rif",4],["t93","93. Ehtimollik qoidalari",4],["t94","94. To'plamlar nazariyasi asoslari",4],["t95","95. Eyler–Venn doiralari va kiritish-chiqarish formulasi",4],["t96","96. Nyuton binomi",4],["t97","97. Fizika uchun matematika: formulalar bilan ishlash",5],["t98","98. O'lchov birliklari va shkala",5],["t99","99. O'rtacha kvadratik chetlanish, tanlanma va xatolik chegarasi",6],["t100","100. Diagrammalar: nuqtali, quti diagrammasi, gistogramma",6],["t101","101. Sochilma diagramma va eng yaxshi moslik chizig'i",6],["t102","102. Kompleks sonlar",6],["s1","1-sinf savollari (daraja testi)",7],["s2","2-sinf savollari (daraja testi)",7],["s3","3-sinf savollari (daraja testi)",7],["s4","4-sinf savollari (daraja testi)",7],["s5","5-sinf savollari (daraja testi)",7],["s6","6-sinf savollari (daraja testi)",7],["s7","7-sinf savollari (daraja testi)",7],["s8","8-sinf savollari (daraja testi)",7],["s9","9-sinf savollari (daraja testi)",7],["s10","10-sinf savollari (daraja testi)",7],["s11","11-sinf savollari (daraja testi)",7],["s1m1","1-sinf · 1 dan 20 gacha sonlar",8],["s1m2","1-sinf · 10 ichida qo'shish va ayirish",8],["s1m3","1-sinf · 20 ichida o'nlikdan o'tib qo'shish va ayirish",8],["s1m4","1-sinf · Shakllar va sodda masalalar",8],["s2m1","2-sinf · 100 ichida qo'shish va ayirish",8],["s2m2","2-sinf · Ko'paytirish va bo'lish jadvali (2–5)",8],["s2m3","2-sinf · Uzunlik, vaqt, massa birliklari",8],["s2m4","2-sinf · Matnli masalalar: narx, «marta ko'p»",8],["s3m1","3-sinf · Ko'paytirish va bo'lish jadvali (to'liq)",8],["s3m2","3-sinf · 1000 ichida qo'shish va ayirish",8],["s3m3","3-sinf · Jadvaldan tashqari ko'paytirish va bo'lish",8],["s3m4","3-sinf · Perimetr va ikki amalli masalalar",8],["s4m1","4-sinf · Ko'p xonali sonlar",8],["s4m2","4-sinf · Ustun ko'paytirish va burchakli bo'lish",8],["s4m3","4-sinf · Tezlik, vaqt, masofa",8],["s4m4","4-sinf · Yuza va ulushlar (kasr tushunchasi)",8],["s5m1","5-sinf · Natural sonlar va bo'linish",8],["s5m2","5-sinf · Oddiy kasrlar",8],["s5m3","5-sinf · O'nli kasrlar",8],["s5m4","5-sinf · Foizlar",8],["s5m5","5-sinf · Burchaklar va uchburchak",8],["s6m1","6-sinf · Nisbat va proporsiya",8],["s6m2","6-sinf · Butun sonlar",8],["s6m3","6-sinf · Ratsional sonlar ustida amallar",8],["s6m4","6-sinf · Chiziqli tenglamalar",8],["s6m5","6-sinf · Koordinata tekisligi",8],["s7m1","7-sinf · Natural ko'rsatkichli daraja",8],["s7m2","7-sinf · Ko'phadlar va qisqa ko'paytirish formulalari",8],["s7m3","7-sinf · Chiziqli tenglamalar sistemasi",8],["s7m4","7-sinf · Uchburchaklar va parallel to'g'ri chiziqlar",8],["s8m1","8-sinf · Kvadrat ildizlar",8],["s8m2","8-sinf · Kvadrat tenglamalar",8],["s8m3","8-sinf · To'rtburchaklar va Pifagor teoremasi",8],["s8m4","8-sinf · Algebraik kasrlar",8],["s9m1","9-sinf · Kvadrat funksiya va kvadrat tengsizliklar",8],["s9m2","9-sinf · Arifmetik va geometrik progressiya",8],["s9m3","9-sinf · Trigonometriya asoslari",8],["s9m4","9-sinf · Aylana, doira va o'xshashlik",8],["s9m5","9-sinf · Ehtimollik elementlari",8],["m1","Mantiq · Sonli ketma-ketliklar",9],["m2","Mantiq · Ortiqchasini toping",9],["m3","Mantiq · Harflar, kunlar, oylar va soat",9],["m4","Mantiq · Mantiqiy xulosa (sillogizmlar)",9],["m5","Mantiq · Tartiblash va taqqoslash",9],["m6","Mantiq · Mantiqiy masalalar",9],["m7","Mantiq · Rostgo'y va yolg'onchi",9],["m8","Mantiq · Kim qaysi kasbda? (mantiqiy jadval)",9],["m9","Mantiq · Sehrli kvadrat va sonli jumboqlar",9],["m10","Mantiq · Ezop masallari",9],["m11","Mantiq · Sherlock tergov ishlari",9],["e1","Ingliz tili · Lug'at A1 (4000 Essential Words 1)",10],["e2","Ingliz tili · Lug'at A2 (4000 Essential Words 2)",10],["e3","Ingliz tili · Lug'at B1 (4000 Essential Words 3)",10],["e4","Ingliz tili · Lug'at B1+ (4000 Essential Words 4)",10],["e5","Ingliz tili · Lug'at B2 (4000 Essential Words 5)",10],["e6","Ingliz tili · Lug'at C1 (4000 Essential Words 6)",10],["e7","Ingliz tili · To be va Present Simple",10],["e8","Ingliz tili · Noto'g'ri fe'llar (V2, V3)",10],["e9","Ingliz tili · Artikllar, ko'plik, predloglar",10],["e10","Ingliz tili · Sifat darajalari va zamonlar",10],["r1","Rus tili · Lug'at: ruscha → o'zbekcha",11],["r2","Rus tili · Lug'at: o'zbekcha → ruscha",11],["r3","Rus tili · Olmoshlar kelishiklarda",11],["r4","Rus tili · Otlarning jinsi (м, ж, ср)",11],["r5","Rus tili · Sonlar, hafta kunlari va oylar",11],["r6","Rus tili · Kundalik iboralar",11],["f1","Fizika · Mexanika: tezlik, kuch, bosim",12],["f2","Fizika · Ish, quvvat va energiya",12],["f3","Fizika · Elektr: Om qonuni, quvvat",12],["f4","Fizika · Issiqlik, zichlik, Arximed kuchi",12],["f5","Fizika · Kattaliklar, birliklar va olimlar",12],["k1","Kimyo · Kimyoviy elementlar va belgilar",13],["k2","Kimyo · Molyar massa va modda miqdori",13],["k3","Kimyo · Asosiy tushunchalar va reaksiyalar",13],["b1","Biologiya · Hujayra va tirik organizmlar",14],["b2","Biologiya · Odam anatomiyasi va salomatlik",14],["b3","Biologiya · O'simliklar va hayvonlar dunyosi",14],["g1","Geografiya · Davlatlar va poytaxtlar",15],["g2","Geografiya · O'zbekiston geografiyasi",15],["g3","Geografiya · Materiklar, okeanlar va tabiat",15],["h1","Tarix · O'zbekiston tarixi: muhim sanalar",16],["h2","Tarix · Buyuk allomalar va ularning asarlari",16],["h3","Tarix · Jahon tarixi",16],["i1","Informatika · Sanoq sistemalari",17],["i2","Informatika · Axborot birliklari",17],["i3","Informatika · Kompyuter, internet va dasturlash",17],["i4","Informatika · Mantiqiy amallar va algoritmlar",17],["i5","Informatika · Robototexnika asoslari",17],["o1","Ona tili · Kelishiklar va qo'shimchalar",18],["o2","Ona tili · So'z turkumlari",18],["o3","Ona tili · Fonetika va imlo",18],["at0","Avtotest · Barcha mavzular (aralash)",20],["at1","Avtotest · Umumiy qoidalar va atamalar",20],["at2","Avtotest · Yo'l belgilari",20],["at3","Avtotest · Yo'l chiziqlari",20],["at4","Avtotest · Svetofor va tartibga soluvchi ishoralari",20],["at5","Avtotest · Harakatni boshlash va manevr",20],["at6","Avtotest · Tezlik, quvib o'tish, oraliq",20],["at7","Avtotest · To'xtash va to'xtab turish",20],["at8","Avtotest · Chorrahalar",20],["at9","Avtotest · Piyodalar, bekatlar, temir yo'l, avtomagistral",20],["at10","Avtotest · Yoritish asboblari va signallar",20],["at11","Avtotest · Shatakka olish, odam va yuk tashish",20],["at12","Avtotest · Texnik holat va jihozlar",20],["at13","Avtotest · Birinchi tibbiy yordam",20],["zk1","Zakovat · Fan va texnika",30],["zk2","Zakovat · Tarix, madaniyat va san'at",30],["zk3","Zakovat · Til, adabiyot va topishmoqlar",30],["zk4","Zakovat · Qora quti: qutida nima bor?",30],["zk5","Zakovat · Matematik zakovat",30],["ad1","Adabiyot · O'zbek adiblari va ularning asarlari",21],["ad2","Adabiyot · Adabiyot nazariyasi: tur, janr va tasvir vositalari",21],["ad3","Adabiyot · Jahon adabiyoti",21],["hq1","Huquq · Konstitutsiya va davlat tuzilishi",22],["hq2","Huquq · Inson huquqlari, erkinliklari va burchlari",22],["hq3","Huquq · Huquq sohalari: mehnat, oila, ma'muriy va jinoyat huquqi asoslari",22],["iq1","Iqtisodiyot · Asosiy tushunchalar: ehtiyoj, talab, taklif, bozor",23],["iq2","Iqtisodiyot · Pul, bank va soliqlar",23],["iq3","Iqtisodiyot · Moliyaviy savodxonlik: byudjet, jamg'arma, kredit va foiz",23],["as1","Astronomiya · Quyosh sistemasi",24],["as2","Astronomiya · Yulduzlar, galaktikalar va koinot",24],["as3","Astronomiya · Astronomiya tarixi va kosmonavtika",24],["cz1","Chizmachilik · Chizma asboblari, formatlar va chiziq turlari",25],["cz2","Chizmachilik · Proyeksiyalar va ko'rinishlar",25],["cz3","Chizmachilik · Masshtab, o'lchamlar va kesimlar",25],["ek1","Ekologiya · Ekotizimlar va oziq zanjiri",26],["ek2","Ekologiya · Ekologik muammolar: Orol, iqlim, ifloslanish",26],["ek3","Ekologiya · Tabiatni muhofaza qilish",26],["tb1","Tarbiya · Odob-axloq va muomala madaniyati",27],["tb2","Tarbiya · Vatan, davlat ramzlari va milliy bayramlar",27],["tb3","Tarbiya · Sog'lom turmush, xavfsiz internet va kasb tanlash",27],["cq1","ChQBT · Birinchi tibbiy yordam",28],["cq2","ChQBT · Fuqaro muhofazasi va favqulodda vaziyatlar",28],["cq3","ChQBT · Qurolli Kuchlar va harbiy xizmat asoslari",28],["jt1","Jismoniy tarbiya · Sport turlari va o'yin qoidalari",29],["jt2","Jismoniy tarbiya · Olimpiya o'yinlari va o'zbek sportchilari",29],["jt3","Jismoniy tarbiya · Sog'liq, gigiyena va mashqlar",29]],"g":["🧮 Asosiy amallar","📘 Mavzular (1–50)","🎓 Algebra · Milliy sertifikat (51–70)","📐 Geometriya (71–88)","🎲 Kombinatorika va ehtimollik (89–96)","⚛️ Fizika uchun matematika (97–98)","📊 SAT statistika (99–102)","🎯 Sinflar bo'yicha — daraja testi (1–11-sinf)","🏫 1–9-sinf modullari","🧠 Mantiq","🇬🇧 Ingliz tili","🇷🇺 Rus tili","⚛️ Fizika","🧪 Kimyo","🧬 Biologiya","🌍 Geografiya","📜 Tarix","💻 Informatika va robototexnika","📝 Ona tili","📈 Grafiklar (chizmali savollar)","🚗 Avtotest (prava imtihoni)","📖 Adabiyot","⚖️ Huquq","💰 Iqtisodiyot","🔭 Astronomiya","✏️ Chizmachilik","🌱 Ekologiya","🤝 Tarbiya","🎖️ ChQBT (chaqiruvgacha tayyorgarlik)","🏃 Jismoniy tarbiya","🦉 Zakovat (bilimdonlar savollari)"],"f":[["all","🌐 Hammasi",null],["mat","📐 Matematika",[19,0,1,2,3,4,5,6,7,8]],["mantiq","🧠 Mantiq",[9]],["zakovat","🦉 Zakovat",[30]],["ingliz","🇬🇧 Ingliz tili",[10]],["rus","🇷🇺 Rus tili",[11]],["fizika","⚛️ Fizika",[12,5]],["kimyo","🧪 Kimyo",[13]],["biologiya","🧬 Biologiya",[14]],["geografiya","🌍 Geografiya",[15]],["tarix","📜 Tarix",[16]],["informatika","💻 Informatika",[17]],["ona","📝 Ona tili",[18]],["adabiyot","📖 Adabiyot",[21]],["huquq","⚖️ Huquq",[22]],["iqtisod","💰 Iqtisodiyot",[23]],["astronomiya","🔭 Astronomiya",[24]],["chizma","✏️ Chizmachilik",[25]],["ekologiya","🌱 Ekologiya",[26]],["tarbiya","🤝 Tarbiya",[27]],["chqbt","🎖️ ChQBT",[28]],["sport","🏃 Jismoniy tarbiya",[29]],["avto","🚗 Avtotest",[20]]]};
  var TOPICS = DATA.t, GROUPS = DATA.g, FANS = DATA.f;
  var TITLE = {}; TOPICS.forEach(function (t) { TITLE[t[0]] = t[1]; });
  var BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/?#]*([?#].*)?$/, "");
  var V = "?v=20261117a";

  /* ---------------- yordamchilar ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // Generator matnlari ichki (ishonchli) — faqat oddiy formatlash teglari qoldiriladi
  function safe(h) {
    return String(h == null ? "" : h).replace(/<(?!\/?(b|i|sup|sub|br|span|small|strong|em|u|table|tbody|tr|td)\b)[^>]*>/gi, "")
      .replace(/<(b|i|sup|sub|span|small|strong|em|u|table|tbody|tr|td)\s[^>]*>/gi, "<$1>")
      .replace(/(^|[\s(;=:,\[{·])-(?=\d)/g, "$1−");
  }
  function plain(h) { var d = document.createElement("div"); d.innerHTML = safe(h); return (d.textContent || "").replace(/\s+/g, " ").trim(); }
  function vib(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function load(key, def) {
    var o = {}; for (var k in def) o[k] = def[k];
    try { var s = JSON.parse(localStorage.getItem(key) || "null"); if (s) for (var k2 in s) if (k2 in o) o[k2] = s[k2]; } catch (e) {}
    return o;
  }
  function save(key, o) { try { localStorage.setItem(key, JSON.stringify(o)); } catch (e) {} }
  function toast(t, ms) {
    var el = $("#ksToast");
    if (!el) { el = document.createElement("div"); el.id = "ksToast"; el.className = "ks-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("on"); }, ms || 2400);
  }
  function mmss(s) { s = Math.max(0, Math.ceil(s)); var m = Math.floor(s / 60), x = s % 60; return m + ":" + (x < 10 ? "0" : "") + x; }
  // matnni katakka sig'diradi (eng katta shrift)
  function fit(el, max, min) {
    if (!el || !el.clientHeight || !el.clientWidth) return 0;
    var lo = min || 12, hi = Math.max(lo, max), best = lo;
    for (var i = 0; i < 9; i++) {
      var mid = (lo + hi) / 2; el.style.fontSize = mid + "px";
      if (el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1) { best = mid; lo = mid; } else hi = mid;
    }
    el.style.fontSize = Math.floor(best) + "px";
    return Math.floor(best);
  }
  function full(on) {
    var d = document, el = d.documentElement;
    try {
      if (on === false) { if (d.fullscreenElement && d.exitFullscreen) d.exitFullscreen(); return; }
      if (!d.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(function () {});
    } catch (e) {}
  }
  var wakeLock = null;
  function wake(on) {
    try { document.body.classList.toggle("ks-play", !!on); } catch (e) {}
    try {
      if (on && navigator.wakeLock && !wakeLock) navigator.wakeLock.request("screen").then(function (w) { wakeLock = w; w.addEventListener("release", function () { wakeLock = null; }); }).catch(function () {});
      if (!on && wakeLock) { wakeLock.release(); wakeLock = null; }
    } catch (e) {}
  }

  /* ---------------- ovozlar ---------------- */
  var AC = null, soundOn = true;
  try { soundOn = localStorage.getItem("ka.kso.sound") !== "0"; } catch (e) {}
  function snd(kind) {
    if (!soundOn) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var seq = {
        ok: [[660, .09], [880, .13]], bad: [[220, .18], [160, .22]], win: [[523, .12], [659, .12], [784, .12], [1046, .32]],
        tick: [[1000, .03]], coin: [[988, .06], [1319, .16]], boom: [[120, .1], [80, .25]], pop: [[520, .05]], open: [[392, .07], [523, .07], [659, .12]],
        whack: [[300, .04], [180, .06]], swap: [[440, .08], [330, .08], [440, .08]], steal: [[700, .06], [500, .06], [300, .1]], click: [[800, .025]]
      }[kind] || [];
      var t = AC.currentTime, saw = kind === "bad" || kind === "boom" || kind === "whack";
      seq.forEach(function (s) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = saw ? "sawtooth" : kind === "coin" ? "square" : "triangle"; o.frequency.value = s[0];
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(kind === "coin" ? .08 : .16, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + s[1]);
        o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + s[1] + .02); t += s[1] * .9;
      });
    } catch (e) {}
  }
  function setSound(on) { soundOn = !!on; try { localStorage.setItem("ka.kso.sound", on ? "1" : "0"); } catch (e) {} }

  /* ---------------- generatorlar ---------------- */
  var MATH = ["ka-savollar-2.js", "ka-savollar-3.js", "ka-savollar-4.js", "ka-savollar-5.js", "ka-savollar-6.js", "ka-savollar-7.js", "ka-savollar-8.js", "ka-savollar-9.js", "ka-savollar-10.js", "ka-savollar-11.js", "ka-savollar-12.js", "ka-savol-qoshimcha.js"];
  var GEN = [
    [/^(a\d+|t\d+)$/, MATH],
    [/^s\d+(m\d+)?$/, MATH.concat(["ka-sinf-modullar.js"])],
    [/^(m|e|r)\d+$/, ["ka-savollar-fanlar.js"]],
    [/^(f|k|i)\d+$/, ["ka-fan-tabiiy.js"]],
    [/^(b|g|h|o)\d+$/, ["ka-fan-ijtimoiy.js"]],
    [/^at\d+$/, ["ka-fan-avtotest.js"]],
    [/^(ad|hq|iq|as|cz|ek|tb|cq|jt)\d+$/, ["ka-fan-maktab.js"]],
    [/^zk\d+$/, ["ka-fan-zakovat.js"]]
  ];
  var loaded = {};
  function addJs(src) {
    if (loaded[src]) return loaded[src];
    return (loaded[src] = new Promise(function (ok) {
      var s = document.createElement("script"); s.src = BASE + src + V;
      s.onload = ok; s.onerror = function () { delete loaded[src]; ok(); };
      document.head.appendChild(s);
    }));
  }
  function filesFor(ids) {
    var out = [];
    GEN.forEach(function (g) { if (ids.some(function (id) { return g[0].test(id); })) g[1].forEach(function (f) { if (out.indexOf(f) < 0) out.push(f); }); });
    return out;
  }
  // Tanlangan mavzular generatorlari (ketma-ket) + lug'at/savol banklari. Natija: ishlaydigan mavzular ro'yxati
  function prep(ids) {
    var p = window.kaSavol ? Promise.resolve() : addJs("ka-savollar.js");
    return p.then(function () {
      return filesFor(ids).reduce(function (q, f) { return q.then(function () { return addJs(f); }); }, Promise.resolve());
    }).then(function () {
      var ps = [];
      if (window.kaFan && window.kaFan.prep) ps.push(window.kaFan.prep(ids));
      if (window.kaAvto && ids.some(window.kaAvto.isAt)) ps.push(window.kaAvto.load());
      return Promise.race([Promise.all(ps), new Promise(function (ok) { setTimeout(ok, 20000); })]);
    }).catch(function () {}).then(function () {
      return ids.filter(function (id) { return window.kaSavol && window.kaSavol.has(id); });
    });
  }
  // Bitta savol. lvl: 1 | 2 | 3 | "mix"; seen — takrorlanmasin; o.maxQ / o.maxA — qisqa savol kerak bo'lsa (Moslashtir, Mol ur)
  function ask(ids, lvl, seen, o) {
    o = o || {}; seen = seen || {};
    var best = null, tries = o.maxQ || o.maxA ? 40 : 18;
    for (var i = 0; i < tries; i++) {
      var tid = pick(ids), L = lvl === "mix" || !lvl ? rnd(1, 3) : +lvl, p = null;
      try { p = window.kaSavol.get(tid, L); } catch (e) { p = null; }
      if (!p || p.q == null || p.a == null) continue;
      var key = tid + "|" + p.q + "|" + p.a + (p.r ? JSON.stringify(p.r) : "");
      if (seen[key] && i < tries - 3) continue;
      var cand = { p: p, tid: tid, L: L, key: key };
      if ((o.maxQ && plain(p.q).length > o.maxQ) || (o.maxA && plain(p.a).length > o.maxA) || (o.noImg && p.r)) { if (!best) best = cand; continue; }
      best = cand; break;
    }
    if (!best) return null;
    seen[best.key] = 1;
    var p2 = best.p, right = String(p2.a), seenW = {}, wr = [];
    seenW[right] = 1;
    (p2.w || []).forEach(function (w) { w = String(w); if (!seenW[w] && w !== "") { seenW[w] = 1; wr.push(w); } });
    wr = shuffle(wr).slice(0, (o.nOpts || 4) - 1);
    var opts = shuffle([right].concat(wr));
    var steps = Array.isArray(p2.steps) ? p2.steps.map(String) : p2.steps ? [String(p2.steps)] : [];
    return { q: p2.q, a: right, opts: opts, ci: opts.indexOf(right), steps: steps, tid: best.tid, L: best.L, r: p2.r || null, wrong: wr };
  }
  function qHtml(q) { return (q && q.r && window.kaAvto ? window.kaAvto.img(q.r) : "") + safe(q ? q.q : ""); }

  /* ---------------- mavzu tanlash paneli ---------------- */
  // sel — tanlangan id lar massivi (joyida o'zgaradi); onChange(sel)
  function picker(el, sel, onChange) {
    var fan = "all";
    var fq = (/[?&]fan=([a-z]+)/i.exec(location.search) || [])[1];
    if (fq && FANS.some(function (f) { return f[0] === fq; })) fan = fq;
    el.innerHTML =
      '<div class="ks-fans" role="toolbar" aria-label="Fanlar">' + FANS.map(function (f) { return '<button type="button" data-f="' + f[0] + '">' + esc(f[1]) + "</button>"; }).join("") + "</div>" +
      '<input class="ks-field ks-tsearch" type="search" placeholder="🔎 Mavzu qidirish: kasr, logarifm, lug\'at, poytaxt, Om qonuni…" aria-label="Mavzu qidirish" autocomplete="off">' +
      '<div class="ks-chips" aria-live="polite"></div>' +
      '<div class="ks-tlist">' + GROUPS.map(function (gn, gi) {
        var rows = TOPICS.filter(function (t) { return t[2] === gi; });
        if (!rows.length) return "";
        return '<details class="ks-tg" data-g="' + gi + '"><summary><span>' + esc(gn) + '</span><span class="cnt"></span><button type="button" class="all">Hammasi</button></summary><div class="ks-trows">' +
          rows.map(function (t) { return '<label class="ks-trow" data-id="' + t[0] + '" data-s="' + esc(t[1].toLowerCase()) + '"><input type="checkbox" value="' + t[0] + '"><span>' + esc(t[1]) + "</span></label>"; }).join("") + "</div></details>";
      }).join("") + "</div>";
    var list = $(".ks-tlist", el), chips = $(".ks-chips", el), search = $(".ks-tsearch", el);
    function norm(s) { return String(s).toLowerCase().replace(/[ʻʼ‘’`]/g, "'"); }
    function filter() {
      var q = norm(search.value.trim()), f = FANS.filter(function (x) { return x[0] === fan; })[0], gs = f && f[2];
      $$(".ks-fans button", el).forEach(function (b) { b.classList.toggle("on", b.dataset.f === fan); });
      $$(".ks-tg", list).forEach(function (tg) {
        var gi = +tg.dataset.g, okG = !gs || gs.indexOf(gi) > -1, any = false;
        $$(".ks-trow", tg).forEach(function (r) { var ok = okG && (!q || norm(r.dataset.s).indexOf(q) > -1); r.style.display = ok ? "" : "none"; if (ok) any = true; });
        tg.style.display = any ? "" : "none";
        if (q && any) tg.open = true;
      });
    }
    function sync() {
      $$(".ks-trow", list).forEach(function (r) { var on = sel.indexOf(r.dataset.id) > -1; r.classList.toggle("on", on); $("input", r).checked = on; });
      $$(".ks-tg", list).forEach(function (tg) {
        var rows = $$(".ks-trow", tg), on = rows.filter(function (r) { return r.classList.contains("on"); }).length;
        $(".cnt", tg).textContent = on ? on + " / " + rows.length : rows.length + " ta";
        tg.classList.toggle("has", on > 0);
      });
      chips.innerHTML = sel.length ? sel.map(function (id) { return '<span class="ks-chip">' + esc(TITLE[id] || id) + '<button type="button" data-id="' + id + '" aria-label="Olib tashlash">×</button></span>'; }).join("") +
        '<button type="button" class="ks-chipclr">Tozalash</button>' : '<span class="ks-dim">Hali mavzu tanlanmagan — quyidan bitta yoki bir nechtasini belgilang.</span>';
      if (onChange) onChange(sel);
    }
    list.addEventListener("change", function (e) {
      var c = e.target; if (!c || c.type !== "checkbox") return;
      var i = sel.indexOf(c.value);
      if (c.checked && i < 0) sel.push(c.value); if (!c.checked && i > -1) sel.splice(i, 1);
      sync();
    });
    list.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".all"); if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var tg = b.closest(".ks-tg"), ids = $$(".ks-trow", tg).filter(function (r) { return r.style.display !== "none"; }).map(function (r) { return r.dataset.id; });
      var allOn = ids.every(function (id) { return sel.indexOf(id) > -1; });
      ids.forEach(function (id) { var i = sel.indexOf(id); if (allOn && i > -1) sel.splice(i, 1); if (!allOn && i < 0) sel.push(id); });
      sync();
    });
    chips.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button"); if (!b) return;
      if (b.classList.contains("ks-chipclr")) sel.splice(0, sel.length);
      else { var i = sel.indexOf(b.dataset.id); if (i > -1) sel.splice(i, 1); }
      sync();
    });
    $(".ks-fans", el).addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("button"); if (b) { fan = b.dataset.f; filter(); } });
    search.addEventListener("input", filter);
    // tanlangan mavzular guruhi ochiq tursin
    $$(".ks-tg", list).forEach(function (tg) { if ($$(".ks-trow", tg).some(function (r) { return sel.indexOf(r.dataset.id) > -1; })) tg.open = true; });
    filter(); sync();
    return { sync: sync };
  }
  // ?mavzu=a1,t5 havolasidan
  function urlTopics() {
    var m = /[?&]mavzu=([a-z0-9,]+)/i.exec(location.search);
    return m ? m[1].split(",").filter(function (id) { return TITLE[id]; }) : null;
  }

  /* ---------------- jamoalar ---------------- */
  var TEAMS = [["🦁", "Sherlar"], ["🐺", "Bo'rilar"], ["🦅", "Burgutlar"], ["🐯", "Yo'lbarslar"], ["🐻", "Ayiqlar"], ["🦊", "Tulkilar"], ["🐬", "Delfinlar"], ["🐎", "Tulporlar"], ["🐝", "Arilar"], ["🦉", "Boyqushlar"]];
  var COLORS = ["#7c9bff", "#ff8585", "#5ee6c7", "#ffd479", "#c18bff", "#ff9f6b", "#6fd3ff", "#ff7ac8", "#a6e36b", "#e3e8f5"];
  // jamoa soni + nomlari. st = {n, names:[]}; min/max
  function teamsUI(el, st, min, max, onChange) {
    function draw() {
      var h = '<div class="ks-nbtns" role="group" aria-label="Jamoalar soni">';
      for (var n = min; n <= max; n++) h += '<button type="button" data-n="' + n + '"' + (n === st.n ? ' class="on"' : "") + ">" + n + "</button>";
      h += '</div><div class="ks-tnames">';
      for (var i = 0; i < st.n; i++) h += '<label style="--tc:' + COLORS[i] + '"><span>' + TEAMS[i][0] + '</span><input class="ks-field" data-i="' + i + '" maxlength="18" placeholder="' + esc(TEAMS[i][1]) + '" value="' + esc(st.names[i] || "") + '"></label>';
      el.innerHTML = h + "</div>";
    }
    el.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-n]"); if (b) { st.n = +b.dataset.n; draw(); if (onChange) onChange(); } });
    el.addEventListener("input", function (e) { var i = e.target.dataset && e.target.dataset.i; if (i != null) { st.names[+i] = e.target.value; if (onChange) onChange(); } });
    draw();
  }
  function makeTeams(st) {
    var out = [];
    for (var i = 0; i < st.n; i++) out.push({ i: i, emoji: TEAMS[i][0], name: (st.names[i] || "").trim() || TEAMS[i][1], color: COLORS[i], score: 0, ok: 0, no: 0 });
    return out;
  }
  // tanlov tugmalari guruhi: <div data-k="lvl"><button data-v="2">…
  function opts(el, st, onChange) {
    $$("[data-k]", el).forEach(function (g) {
      var k = g.dataset.k;
      function sync() { $$("button[data-v]", g).forEach(function (b) { b.classList.toggle("on", String(st[k]) === b.dataset.v); }); }
      g.addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest("button[data-v]"); if (!b) return;
        var v = b.dataset.v; st[k] = /^-?\d+$/.test(v) ? +v : v === "true" ? true : v === "false" ? false : v;
        sync(); if (onChange) onChange();
      });
      sync();
    });
  }

  /* ---------------- savol oynasi ---------------- */
  // o: {q, title, color, value, time (s, 0 — cheksiz), disabled:[idx], onDone({ok, idx, timeout}), extra:[{t, cls, fn}] (natijadan keyin), steal: bool}
  var LET = ["A", "B", "C", "D", "E", "F"];
  var modal = null;
  function closeModal() { if (modal) { clearInterval(modal.timer); document.removeEventListener("keydown", modal.key); modal.el.remove(); modal = null; } }
  function askModal(o) {
    closeModal();
    var q = o.q, el = document.createElement("div");
    el.className = "ks-ov ks-ask";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.innerHTML = '<div class="ks-qbox" style="--tc:' + (o.color || "#7c9bff") + '">' +
      '<div class="ks-qhead">' + (o.title ? '<span class="ks-qteam">' + esc(o.title) + "</span>" : "") + (o.value != null ? '<span class="ks-qval">' + esc(o.value) + "</span>" : "") +
      '<span class="ks-qtime" hidden></span><button type="button" class="ks-x" aria-label="Yopish">✕</button></div>' +
      (o.topic !== false ? '<div class="ks-qtopic">' + esc((TITLE[q.tid] || "") + "  ·  " + "★★★".slice(0, q.L || 2)) + "</div>" : "") +
      '<div class="ks-qtext"><div>' + qHtml(q) + "</div></div>" +
      '<div class="ks-opts n' + q.opts.length + '">' + q.opts.map(function (t, i) {
        return '<button type="button" class="ks-opt c' + i + '" data-i="' + i + '"' + (o.disabled && o.disabled.indexOf(i) > -1 ? " disabled" : "") + '><b>' + LET[i] + "</b><span>" + safe(t) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="ks-qfoot"></div></div>';
    document.body.appendChild(el);
    var m = modal = { el: el, done: false, timer: 0 };
    var tEl = $(".ks-qtime", el), foot = $(".ks-qfoot", el), left = o.time || 0;
    requestAnimationFrame(function () { fit($(".ks-qtext", el), 46, 15); $$(".ks-opt span", el).forEach(function (s) { s.style.fontSize = ""; }); });
    function finish(idx, timeout) {
      if (m.done) return; m.done = true; clearInterval(m.timer);
      var ok = idx === q.ci;
      $$(".ks-opt", el).forEach(function (b, i) { b.disabled = true; if (i === q.ci) b.classList.add("right"); else if (i === idx) b.classList.add("wrong"); else b.classList.add("dim"); });
      snd(ok ? "ok" : "bad"); vib(ok ? 30 : [60, 40, 60]);
      var h = '<div class="ks-verdict ' + (ok ? "ok" : "no") + '">' + (ok ? "✅ To'g'ri!" : timeout ? "⏰ Vaqt tugadi" : "❌ Noto'g'ri") + (ok ? "" : ' — to\'g\'ri javob: <b>' + safe(q.a) + "</b>") + "</div>";
      if (!ok && q.steps.length) h += '<details class="ks-steps" open><summary>💡 Yechim</summary><ol>' + q.steps.slice(0, 6).map(function (s) { return "<li>" + safe(s) + "</li>"; }).join("") + "</ol></details>";
      h += '<div class="ks-qbtns">';
      (o.extra || []).forEach(function (x, i) { if (!x.when || x.when === (ok ? "ok" : "no")) h += '<button type="button" class="ks-btn ' + (x.cls || "") + '" data-x="' + i + '">' + esc(x.t) + "</button>"; });
      h += '<button type="button" class="ks-btn primary" data-go="1">Davom ▶</button></div>';
      foot.innerHTML = h;
      var res = { ok: ok, idx: idx, timeout: !!timeout };
      foot.onclick = function (e) {
        var b = e.target.closest && e.target.closest("button"); if (!b) return;
        if (b.dataset.go) { closeModal(); if (o.onDone) o.onDone(res); }
        else if (b.dataset.x != null) { var x = o.extra[+b.dataset.x]; closeModal(); if (x.fn) x.fn(res); }
      };
      setTimeout(function () { var g = $("[data-go]", foot); if (g) try { g.focus({ preventScroll: true }); } catch (e) {} }, 60);
      if (o.onAnswer) o.onAnswer(res);
    }
    $(".ks-opts", el).addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".ks-opt"); if (b && !b.disabled) finish(+b.dataset.i); });
    $(".ks-x", el).onclick = function () { if (m.done) { var g = $("[data-go]", foot); if (g) g.click(); return; } closeModal(); if (o.onCancel) o.onCancel(); };
    m.key = function (e) {
      if (m.done) { if (e.key === "Enter" || e.key === " ") { var g = $("[data-go]", foot); if (g && document.activeElement !== g) { e.preventDefault(); g.click(); } } return; }
      var k = String(e.key).toUpperCase(), i = LET.indexOf(k); if (i < 0) i = ["1", "2", "3", "4", "5", "6"].indexOf(k);
      if (i > -1 && i < q.opts.length) { var b = $$(".ks-opt", el)[i]; if (b && !b.disabled) { e.preventDefault(); finish(i); } }
      if (e.key === "Escape") { closeModal(); if (o.onCancel) o.onCancel(); }
    };
    document.addEventListener("keydown", m.key);
    if (left > 0) {
      tEl.hidden = false; tEl.textContent = mmss(left);
      var end = Date.now() + left * 1000;
      m.timer = setInterval(function () {
        var s = (end - Date.now()) / 1000; tEl.textContent = mmss(s);
        tEl.classList.toggle("low", s <= 5);
        if (s <= 5 && s > 0 && Math.abs(s - Math.round(s)) < .13) snd("tick");
        if (s <= 0) finish(-1, true);
      }, 250);
    }
    return { close: closeModal, el: el };
  }

  /* ---------------- tanlash va e'lon oynalari ---------------- */
  // items: [{label, color, sub, value}] -> cb(index) ; o.cancel — "Bekor qilish" matni (bo'lmasa — majburiy tanlov)
  function choose(title, items, cb, o) {
    o = o || {};
    var el = document.createElement("div"); el.className = "ks-ov ks-choose";
    el.innerHTML = '<div class="ks-cbox"><h2>' + esc(title) + "</h2>" + (o.text ? '<p class="ks-dim">' + esc(o.text) + "</p>" : "") + '<div class="ks-citems">' +
      items.map(function (t, i) { return '<button type="button" class="ks-citem" data-i="' + i + '" style="--tc:' + (t.color || "#7c9bff") + '"' + (t.disabled ? " disabled" : "") + '><span>' + esc(t.label) + "</span>" + (t.sub != null ? "<b>" + esc(t.sub) + "</b>" : "") + "</button>"; }).join("") +
      "</div>" + (o.cancel ? '<div class="ks-qbtns"><button type="button" class="ks-btn" data-c="1">' + esc(o.cancel) + "</button></div>" : "") + "</div>";
    document.body.appendChild(el);
    el.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button"); if (!b || b.disabled) return;
      el.remove(); snd("click");
      if (b.dataset.c) { if (o.onCancel) o.onCancel(); return; }
      cb(+b.dataset.i);
    });
    return el;
  }
  // katta e'lon: belgi + sarlavha + matn, "Davom" tugmasi
  function notice(icon, title, text, cb, cls) {
    var el = document.createElement("div"); el.className = "ks-ov ks-notice " + (cls || "");
    el.innerHTML = '<div class="ks-nbox"><div class="ks-nicon">' + icon + "</div><h2>" + esc(title) + "</h2>" + (text ? "<p>" + text + "</p>" : "") + '<div class="ks-qbtns"><button type="button" class="ks-btn primary big">Davom ▶</button></div></div>';
    document.body.appendChild(el);
    var b = $("button", el);
    function go() { if (!el.parentNode) return; el.remove(); document.removeEventListener("keydown", kd); if (cb) cb(); }
    function kd(e) { if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); go(); } }
    b.onclick = go; document.addEventListener("keydown", kd);
    setTimeout(function () { try { b.focus({ preventScroll: true }); } catch (e) {} }, 50);
    return el;
  }

  /* ---------------- natija: podium + konfetti ---------------- */
  function confetti(ms) {
    var c = document.createElement("canvas"); c.className = "ks-confetti"; document.body.appendChild(c);
    var x = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight, P = [], t0 = Date.now(), dur = ms || 3500;
    var cols = ["#ffd479", "#5ee6c7", "#7c9bff", "#ff8585", "#c18bff", "#ff9f6b"];
    for (var i = 0; i < 160; i++) P.push({ x: Math.random() * W, y: -20 - Math.random() * H * .6, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, r: 4 + Math.random() * 6, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: pick(cols) });
    (function f() {
      x.clearRect(0, 0, W, H);
      P.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
      if (Date.now() - t0 < dur) requestAnimationFrame(f); else c.remove();
    })();
  }
  // list: [{emoji, name, score, color, sub}] — kamayish tartibida bo'lishi shart emas
  function podium(list, unit, title, btns) {
    closeModal();
    var L = list.slice().sort(function (a, b) { return b.score - a.score; });
    var el = document.createElement("div"); el.className = "ks-ov ks-pod";
    var top = [L[1], L[0], L[2]];
    var rank = 0, prev = null;
    var ranks = L.map(function (t, i) { if (t.score !== prev) { rank = i + 1; prev = t.score; } return rank; });
    el.innerHTML = '<div class="ks-podbox"><h2>' + esc(title || "🏆 G'oliblar") + '</h2><div class="ks-podium">' + top.map(function (t, i) {
      if (!t) return '<div class="ks-pcol empty"></div>';
      var place = [2, 1, 3][i];
      return '<div class="ks-pcol p' + place + '" style="--tc:' + (t.color || "#7c9bff") + '"><div class="ks-pemoji">' + esc(t.emoji || "") + '</div><div class="ks-pname">' + esc(t.name) + '</div><div class="ks-pscore">' + esc(t.score) + " " + esc(unit || "") + '</div><div class="ks-pbar"><b>' + ["🥈", "🥇", "🥉"][i] + "</b></div></div>";
    }).join("") + "</div>" +
      (L.length > 3 ? '<ol class="ks-rest" start="4">' + L.slice(3).map(function (t, i) { return "<li><span>" + ranks[i + 3] + ".</span> " + esc((t.emoji || "") + " " + t.name) + "<b>" + esc(t.score) + "</b></li>"; }).join("") + "</ol>" : "") +
      '<div class="ks-qbtns">' + (btns || []).map(function (b, i) { return '<button type="button" class="ks-btn ' + (b.cls || "") + '" data-b="' + i + '">' + esc(b.t) + "</button>"; }).join("") + "</div></div>";
    document.body.appendChild(el);
    el.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-b]"); if (b) { var x = btns[+b.dataset.b]; if (!x.keep) el.remove(); if (x.fn) x.fn(); } });
    snd("win"); confetti();
    return el;
  }

  /* ---------------- telefon rejimi: xona ---------------- */
  var QR_SRCS = ["vendor/qrcode-1.4.4.min.js", "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"];
  function loadQr() {
    if (window.qrcode) return Promise.resolve();
    var i = 0;
    return new Promise(function (ok) {
      (function next() {
        if (i >= QR_SRCS.length) return ok();
        var s = document.createElement("script"), src = QR_SRCS[i++]; s.src = /^https?:/.test(src) ? src : BASE + src;
        s.onload = function () { ok(); }; s.onerror = next; document.head.appendChild(s);
      })();
    });
  }
  function qrSvg(text) { try { var q = window.qrcode(0, "M"); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); } catch (e) { return ""; } }
  function codeParam() { var m = /[?&]kod=([A-Za-z0-9]{5})/.exec(location.search); return m ? m[1].toUpperCase() : ""; }

  // O'qituvchi tomoni. o: {kind, page, el, title, max, onJoin(p), onRejoin(p), onLeave(p), onMsg(p, msg), onStart()}
  // Qaytaradi: Promise<R> — R.players (id -> {id, name, ...}), R.send(id,msg), R.cast(msg), R.beat(st), R.close(), R.list()
  function roomHost(o) {
    var N = window.KANet; if (!N) return Promise.reject(new Error("Tarmoq moduli yuklanmadi"));
    var players = {}, order = [], R = null, max = o.max || 80;
    var el = o.el;
    el.innerHTML = '<div class="ks-lobby"><div class="ks-lcode"><div class="ks-dim">Telefonda <b>kuvonch.uz/live</b> oching va kodni yozing</div><div class="ks-code">⏳</div><div class="ks-qr"></div><button type="button" class="ks-btn ks-qrbig">🔍 Kattalashtirish</button></div>' +
      '<div class="ks-lpl"><div class="ks-lhead"><b class="ks-lcount">0</b> o\'quvchi kirdi<span class="ks-dim"> · ismi ustiga bossangiz — chiqarib yuboriladi</span></div><div class="ks-plist"></div>' +
      '<div class="ks-qbtns"><button type="button" class="ks-btn" data-a="close">✖ Xonani yopish</button><button type="button" class="ks-btn primary" data-a="start" disabled>▶ O\'yinni boshlash</button></div></div></div>';
    var plist = $(".ks-plist", el), count = $(".ks-lcount", el), startB = $('[data-a="start"]', el);
    function draw() {
      var ids = order.filter(function (id) { return players[id]; });
      count.textContent = ids.length;
      plist.innerHTML = ids.length ? ids.map(function (id) { var p = players[id]; return '<button type="button" class="ks-pchip' + (p.off ? " off" : "") + '" data-id="' + id + '">' + esc(p.name) + "</button>"; }).join("") : '<span class="ks-dim">Hali hech kim yo\'q. Kod yoki QR orqali kirishadi…</span>';
      startB.disabled = !ids.length;
    }
    plist.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-id]"); if (!b || !R) return;
      var id = b.dataset.id, p = players[id]; if (!p) return;
      R.kick(id, "O'qituvchi sizni xonadan chiqardi"); delete players[id]; draw(); if (o.onLeave) o.onLeave(p);
    });
    $('[data-a="close"]', el).onclick = function () { if (R) R.close(); if (o.onClose) o.onClose(); };
    startB.onclick = function () { if (o.onStart) o.onStart(); };
    $(".ks-qrbig", el).onclick = function () { el.classList.toggle("big"); };
    return Promise.all([N.host({
      kind: o.kind,
      onConn: function (id, hello) {
        var name = String(hello.name || "").trim().slice(0, 24);
        if (!name) return "Ismingizni yozing";
        if (!players[id] && order.length >= max) return "Xona to'lgan (" + max + " kishi)";
        if (!players[id] && o.locked && o.locked()) return "O'yin boshlanib bo'ldi — keyingi o'yinni kuting";
        var same = false; for (var k in players) if (k !== id && players[k].name.toLowerCase() === name.toLowerCase()) same = true;
        if (same) return "Bu ism band — boshqa ism (masalan familiya bilan) yozing";
        return true;
      },
      onJoin: function (id, hello) {
        var p = players[id] || (players[id] = { id: id, name: String(hello.name).trim().slice(0, 24) });
        p.off = false; if (order.indexOf(id) < 0) order.push(id);
        draw(); snd("pop"); if (o.onJoin) o.onJoin(p);
      },
      onRejoin: function (id) { var p = players[id]; if (p) { p.off = false; draw(); if (o.onRejoin) o.onRejoin(p); } },
      onLeave: function (id) { var p = players[id]; if (p) { p.off = true; draw(); if (o.onLeave) o.onLeave(p); } },
      onMsg: function (id, msg) { var p = players[id]; if (p && o.onMsg) o.onMsg(p, msg); }
    }), loadQr()]).then(function (r) {
      R = r[0];
      var url = N.joinUrl(o.page, R.code);
      $(".ks-code", el).textContent = R.code;
      $(".ks-qr", el).innerHTML = qrSvg(url);
      return {
        code: R.code, url: url, players: players,
        list: function () { return order.filter(function (id) { return players[id]; }).map(function (id) { return players[id]; }); },
        send: function (id, m, all) { R.send(id, m, all); },
        cast: function (m) { R.cast(m); },
        beat: function (s) { R.beat(s); },
        close: function () { R.close(); },
        redraw: draw
      };
    });
  }

  // O'quvchi tomoni. o: {el, code, title, onMsg(msg, api), onReady(api), onClose(why)}
  function roomJoin(o) {
    var N = window.KANet, el = o.el, idn = N && N.identity ? N.identity() : { name: "" };
    el.innerHTML = '<div class="ks-join"><div class="ks-jcode">Xona: <b>' + esc(o.code) + '</b></div><h2>' + esc(o.title || "O'yinga kirish") + '</h2>' +
      '<form class="ks-jform"><input class="ks-field" name="n" maxlength="24" autocomplete="nickname" placeholder="Ismingiz" value="' + esc(idn.name || "") + '" required>' +
      '<button class="ks-btn primary" type="submit">Kirish ▶</button></form><div class="ks-jerr" role="alert"></div></div>';
    var f = $(".ks-jform", el), err = $(".ks-jerr", el);
    $("input", f).focus();
    return new Promise(function (resolve) {
      f.onsubmit = function (e) {
        e.preventDefault();
        var name = $("input", f).value.trim().replace(/\s+/g, " ");
        if (name.length < 2) { err.textContent = "Ismingizni to'liq yozing"; return; }
        var bn = N.badName && N.badName(name); if (bn) { err.textContent = bn; return; }
        err.textContent = ""; $("button", f).disabled = true; $("button", f).textContent = "⏳ Ulanmoqda…";
        try { N.saveIdentity(name, idn.group || ""); } catch (x) {}
        var api = null;
        N.join(o.code, { name: name }, {
          onMsg: function (m) {
            if (m.type === "reject") { err.textContent = m.why || "Kirib bo'lmadi"; $("button", f).disabled = false; $("button", f).textContent = "Kirish ▶"; return; }
            if (m.type === "kick") { if (o.onClose) o.onClose(m.why || "Xonadan chiqarildingiz"); return; }
            if (o.onMsg) o.onMsg(m, api);
          },
          onClose: function (why) { if (o.onClose) o.onClose(why === "gone" ? "O'qituvchi xonani yopdi" : "Aloqa uzildi"); }
        }).then(function (a) { api = a; api.name = name; resolve(api); if (o.onReady) o.onReady(api); }).catch(function (x) {
          err.textContent = (x && x.message) || "Ulanib bo'lmadi — internetni tekshiring";
          $("button", f).disabled = false; $("button", f).textContent = "Kirish ▶";
        });
      };
    });
  }
  // o'qituvchi ekrani uchun jonli reyting (top N)
  function board(el, list, unit, n) {
    var L = list.slice().sort(function (a, b) { return b.score - a.score; }), top = L.slice(0, n || 12), mx = Math.max(1, top.length ? top[0].score : 1);
    el.innerHTML = top.map(function (p, i) {
      return '<div class="ks-brow' + (p.off ? " off" : "") + '"><span class="ks-brank">' + (i + 1) + '</span><span class="ks-bname">' + esc(p.name) + '</span><span class="ks-bbar"><i style="width:' + Math.max(2, Math.round(Math.max(0, p.score) / mx * 100)) + '%"></i></span><b>' + esc(p.score) + " " + esc(unit || "") + "</b></div>";
    }).join("") + (L.length > top.length ? '<div class="ks-dim" style="text-align:center">… yana ' + (L.length - top.length) + " kishi</div>" : "");
  }
  /* ---------------- telefon musobaqasi (Mol ur, Moslashtir): har kim o'zida o'ynaydi, ball yuboradi ---------------- */
  // O'qituvchi: o = {kind, page, title, unit, min, payload, onExit}
  function liveHost(o) {
    var el = document.createElement("div"); el.className = "ks-game";
    el.innerHTML = '<div class="ks-top"><span class="ks-title">' + esc(o.title) + ' · telefonlar</span><span class="ks-dim lv-code"></span><button type="button" class="ks-btn lv-full" aria-label="To\'liq ekran">⛶</button><button type="button" class="ks-btn lv-end">⏹ Tugatish</button></div>' +
      '<div class="lv-lobby" style="flex:1;min-height:0;overflow:auto"></div>' +
      '<div class="lv-play" hidden style="flex:1;min-height:0;overflow:auto"><div style="display:flex;align-items:baseline;gap:12px;margin-bottom:8px"><span class="lv-clock" style="font:900 clamp(30px,5vw,56px)/1 ui-monospace,monospace;color:var(--gold)">0:00</span><span class="ks-dim lv-stat"></span></div><div class="ks-board lv-board"></div></div>';
    document.body.appendChild(el); full(); wake(true);
    var S = { ph: "wait", end: 0, R: null, timer: 0 };
    function q(s) { return $(s, el); }
    function exit() { clearInterval(S.timer); try { if (S.R) S.R.close(); } catch (e) {} el.remove(); full(false); wake(false); if (o.onExit) o.onExit(); }
    function st(p) {
      if (!S.R) return;
      S.R.send(p.id, { type: "st", ph: S.ph, rem: Math.max(0, Math.round((S.end - Date.now()) / 1000)), cfg: o.payload }, true);
    }
    var rdT = 0;
    function redraw() {
      if (rdT) return;
      rdT = setTimeout(function () {
        rdT = 0; if (!S.R) return;
        var list = S.R.list(), ok = 0, no = 0; list.forEach(function (p) { if (p.score == null) { p.score = 0; p.ok = 0; p.no = 0; } ok += p.ok; no += p.no; });
        board(q(".lv-board"), list, o.unit || "ball", 15);
        q(".lv-stat").textContent = list.length + " o'quvchi · " + ok + " to'g'ri · " + no + " xato";
      }, 250);
    }
    function start() {
      if (!S.R || S.ph === "play") return;
      S.ph = "play"; S.end = Date.now() + o.min * 60000;
      q(".lv-lobby").hidden = true; q(".lv-play").hidden = false;
      q(".lv-code").textContent = "Kod: " + S.R.code + " · kech qolganlar ham kira oladi";
      S.R.list().forEach(st); redraw();
      S.timer = setInterval(function () { var s = (S.end - Date.now()) / 1000; q(".lv-clock").textContent = mmss(s); if (s <= 0) finish(); }, 500);
    }
    function finish() {
      if (S.ph === "end" || !S.R) return;
      clearInterval(S.timer); S.ph = "end";
      var list = S.R.list().slice().sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
      list.forEach(function (p, i) { S.R.send(p.id, { type: "fin", rank: i + 1, n: list.length, score: p.score || 0 }, true); });
      podium(list.map(function (p) { return { emoji: "", name: p.name, score: p.score || 0, color: COLORS[0] }; }), o.unit || "ball", o.title + " — natijalar", [
        { t: "📥 CSV (Excel)", keep: true, fn: function () { csv(o.kind + "-" + new Date().toISOString().slice(0, 10) + ".csv", [["O'rin", "Ism", "Ball", "To'g'ri", "Xato"]].concat(list.map(function (p, i) { return [i + 1, p.name, p.score || 0, p.ok || 0, p.no || 0]; }))); } },
        { t: "✖ Xonani yopish", cls: "primary", fn: exit }
      ]);
    }
    q(".lv-full").onclick = function () { if (document.fullscreenElement) full(false); else full(); };
    q(".lv-end").onclick = function () { if (S.ph === "play") finish(); else exit(); };
    roomHost({
      kind: o.kind, page: o.page, el: q(".lv-lobby"), max: 80,
      onJoin: function (p) { if (p.score == null) { p.score = 0; p.ok = 0; p.no = 0; } st(p); redraw(); },
      onRejoin: st,
      onMsg: function (p, m) { if (m.type === "sc" && S.ph === "play") { p.score = Math.max(0, Math.min(1e6, +m.s || 0)); p.ok = +m.ok || 0; p.no = +m.no || 0; redraw(); } },
      onStart: start, onClose: function () { S.R = null; exit(); }
    }).then(function (R) { S.R = R; q(".lv-code").textContent = "Kod: " + R.code; }).catch(function (e) { toast((e && e.message) || "Xona ochilmadi — internetni tekshiring", 5000); exit(); });
  }
  // O'quvchi: o = {code, title, onPlay(cfg, api) — o'yinni boshlaydi; api.report(score, ok, no), api.left() — qolgan soniya}
  function livePhone(o) {
    var box = document.createElement("div"); box.className = "ks-phone"; document.body.appendChild(box);
    var P = { ph: "wait", end: 0, api: null, started: false, last: 0, pend: null, t: 0 };
    var api = {
      left: function () { return Math.max(0, (P.end - Date.now()) / 1000); },
      report: function (s, ok, no) {
        P.pend = { type: "sc", s: s, ok: ok, no: no };
        var wait = 700 - (Date.now() - P.last);
        clearTimeout(P.t);
        P.t = setTimeout(function () { if (P.api && P.pend) { P.api.send(P.pend); P.pend = null; P.last = Date.now(); } }, Math.max(0, wait));
      },
      box: box, playing: function () { return P.ph === "play" && api.left() > 0; }, done: function () { return P.ph === "end"; }
    };
    function msg(h) { box.innerHTML = '<div class="ks-join" style="font-size:20px;font-weight:800"><div style="font-size:64px">' + h[0] + "</div>" + h[1] + "</div>"; }
    roomJoin({
      el: box, code: o.code, title: o.title,
      onMsg: function (m) {
        if (m.type === "st") {
          P.ph = m.ph; P.end = Date.now() + (m.rem || 0) * 1000;
          if (m.ph === "play" && !P.started) { P.started = true; box.innerHTML = ""; box.classList.add("playing"); wake(true); o.onPlay(m.cfg || {}, api); }
          else if (m.ph === "wait") msg(["⏳", "Salom, " + esc(P.api ? P.api.name : "") + "!<br>O'qituvchi o'yinni boshlashini kuting…"]);
        }
        if (m.type === "fin") {
          P.ph = "end"; P.end = Date.now(); box.classList.remove("playing"); wake(false); if (P.pend && P.api) P.api.send(P.pend); P.pend = null; clearTimeout(P.t);
          closeModal();
          msg([m.rank <= 3 ? ["🥇", "🥈", "🥉"][m.rank - 1] : "🏁", "O'yin tugadi!<br><b style=\"font-size:34px;color:var(--gold)\">" + m.rank + "-o'rin</b> / " + m.n + "<br>" + m.score + " ball"]);
          if (m.rank <= 3) confetti();
        }
      },
      onClose: function (why) { box.innerHTML = '<div class="ks-join"><div style="font-size:60px">👋</div>' + esc(why) + '<p><a class="ks-btn primary" href="live/">Boshqa xonaga kirish</a></p></div>'; }
    }).then(function (a) { P.api = a; if (P.ph === "wait") msg(["⏳", "Salom, " + esc(a.name) + "!<br>O'qituvchi o'yinni boshlashini kuting…"]); });
    return api;
  }

  function csv(name, rows) {
    var s = "﻿" + rows.map(function (r) { return r.map(function (c) { c = String(c == null ? "" : c); return /[",;\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(";"); }).join("\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([s], { type: "text/csv;charset=utf-8" })); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  window.KSO = {
    TOPICS: TOPICS, GROUPS: GROUPS, FANS: FANS, TITLE: TITLE, TEAMS: TEAMS, COLORS: COLORS,
    $: $, $$: $$, esc: esc, safe: safe, plain: plain, rnd: rnd, pick: pick, shuffle: shuffle, mmss: mmss, vib: vib, load: load, save: save,
    toast: toast, fit: fit, full: full, wake: wake, snd: snd, setSound: setSound, sound: function () { return soundOn; },
    prep: prep, ask: ask, qHtml: qHtml, picker: picker, urlTopics: urlTopics, teamsUI: teamsUI, makeTeams: makeTeams, opts: opts,
    askModal: askModal, closeModal: closeModal, podium: podium, confetti: confetti, choose: choose, notice: notice,
    room: { host: roomHost, join: roomJoin, code: codeParam, board: board, qrSvg: qrSvg, loadQr: loadQr, liveHost: liveHost, livePhone: livePhone }, csv: csv
  };
})();
