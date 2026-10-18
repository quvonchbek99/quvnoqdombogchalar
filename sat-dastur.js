/*! Kuvonch Academy — SAT Math dasturi: rasmiy 4 bo'lim → kichik mavzular → saytdagi mavzular.
 *  Manbalar (bob va sahifa ko'rsatkichlari):
 *   PP = PrepPros, "The Complete Guide to Digital SAT Math" (2024) — 4 darajali tizim: 1 = asosiy (hamma uchun), 2 = qo'shimcha, 3 = murakkab, 4 = ekspert.
 *   AH = Thomas Hyun, "Acing the New SAT Math" (2016) — 20 bob, har bobda mashq va bob testi; oxirida PSAT + 2 ta to'liq SAT test.
 *  Kitob matni ko'chirilmagan — faqat bob nomlari va sahifalar (o'quvchi kitobdan o'zi o'qiydi).
 *  Har kichik mavzu: { id, uz, en, lvl (PP darajasi), t: [sayt mavzu id'lari], pp: "bob (sahifa)", ah: "bob (sahifa)" }
 *  t bo'sh bo'lsa — saytda hali generator yo'q (keyin qo'shiladi).
 */
window.SAT_DASTUR = {
  vazn: { alg: 35, adv: 35, data: 15, geo: 15 },   // rasmiy taxminiy ulush, %
  bolim: [
    { id: "alg", en: "Algebra", uz: "Algebra", savol: "13–15 savol / test", sub: [
      { id: "lin-eq", uz: "Bir noma'lumli chiziqli tenglamalar", en: "Linear equations in one variable", lvl: 1, t: ["t10", "t14"], pp: "5-bob Algebra Skills (18), 7-bob \"In terms of\" (39)", ah: "1-bob (5), 2-bob 2-1…2-5 (19–27)" },
      { id: "lin-fun", uz: "Chiziqli funksiya va to'g'ri chiziq (qiyalik, kesishma, shakllari)", en: "Linear functions, slope & intercepts", lvl: 1, t: ["t82", "t5", "t6"], pp: "17-bob Lines (141), 18-bob Interpreting Lines (155)", ah: "3-bob 3-2…3-4 (40–44)" },
      { id: "lin-sys", uz: "Chiziqli tenglamalar sistemasi", en: "Systems of linear equations", lvl: 1, t: ["t11", "t58"], pp: "12-bob (93); 32-bob — yechimlar soni (291, 3-daraja)", ah: "3-5 (46), 5-3 (81)" },
      { id: "lin-ineq", uz: "Chiziqli tengsizliklar va sistemalari", en: "Linear inequalities", lvl: 1, t: ["t12", "t13"], pp: "8-bob Inequalities (44)", ah: "4-bob (61–67)" },
      { id: "abs", uz: "Modul (absolyut qiymat)", en: "Absolute value", lvl: 1, t: ["t53"], pp: "29-bob (271)", ah: "3-6 (50), 4-2 (63)" },
      { id: "const", uz: "Konstantani topish: ekvivalent tenglamalar, yechimi yo'q / cheksiz", en: "Solving for constants", lvl: 2, t: ["t11", "t10"], pp: "3-bob Equivalent (9), 31-bob (281)", ah: "2-4 (25)" },
      { id: "word-lin", uz: "So'z masalalari: chiziqli modellar", en: "Linear word problems & models", lvl: 1, t: ["t8", "t56"], pp: "30-bob Word Problems (277), 18-bob (155)", ah: "5-bob (77–83)" }
    ]},
    { id: "adv", en: "Advanced Math", uz: "Ilg'or matematika", savol: "13–15 savol / test", sub: [
      { id: "exp-rules", uz: "Daraja va ildiz qoidalari, ko'phadlar bilan amallar", en: "Exponents, roots & polynomials", lvl: 1, t: ["t21", "a6", "t62", "t18"], pp: "10-bob Exponents and Roots (63)", ah: "10-1, 10-2 (153–156), 13-3 (217)" },
      { id: "factor", uz: "Qisqa ko'paytirish formulalari va ko'paytuvchilarga ajratish", en: "Factoring & special products", lvl: 1, t: ["t51", "t52"], pp: "11-bob Factoring (75); 36-bob Special Quadratics (321, 3-daraja)", ah: "10-3, 10-5 (159–164), 11-2, 11-3 (176–179)" },
      { id: "quad-eq", uz: "Kvadrat tenglamalar: ildizlar, diskriminant, Vyet, formula", en: "Quadratic equations", lvl: 1, t: ["t1", "t2", "t63"], pp: "11-bob (74–92)", ah: "11-4, 11-5 (181–183)" },
      { id: "parab", uz: "Parabola: uchi, 3 shakli, grafik", en: "Parabolas & vertex form", lvl: 1, t: ["t1", "t7"], pp: "11-bob Vertex / 3 Forms (80–85), 35-bob (311)", ah: "11-1 (173)" },
      { id: "fun", uz: "Funksiya: tushuncha, kompozitsiya, teskari funksiya", en: "Functions, composition & inverse", lvl: 1, t: ["t5", "t6", "t9"], pp: "13-bob Functions (102)", ah: "3-1 (37), 12-1 (197)" },
      { id: "shift", uz: "Funksiya grafigini siljitish va almashtirish", en: "Transformations of functions", lvl: 2, t: ["t7"], pp: "28-bob (263)", ah: "11-1 (173)" },
      { id: "expo", uz: "Ko'rsatkichli funksiya: o'sish va kamayish", en: "Exponential growth & decay", lvl: 2, t: ["t19", "t27", "t22", "t25"], pp: "19-bob (164), 35-bob (311)", ah: "12-3, 12-4 (201–203)" },
      { id: "lin-quad", uz: "Chiziqli va kvadratik tenglamalar sistemasi", en: "Linear–quadratic systems", lvl: 2, t: ["t11", "t1"], pp: "12-bob More Complex Systems (96), 32-bob (291)", ah: "11-6 (186)" },
      { id: "rational", uz: "Ratsional ifodalar va tenglamalar", en: "Rational expressions & equations", lvl: 1, t: ["t18", "t10", "t14", "t65"], pp: "6-bob Fractions (30), 34-bob Extraneous (307)", ah: "14-bob (233–240)" },
      { id: "radical", uz: "Ildizli (irratsional) tenglamalar, begona ildizlar", en: "Radical equations & extraneous solutions", lvl: 1, t: ["t15", "t16", "t64"], pp: "34-bob (307), 10-bob (65)", ah: "13-3, 13-4 (217–220)" },
      { id: "poly", uz: "Ko'phad funksiyalar, qoldiq va Bezu teoremasi", en: "Polynomials, remainder & factor theorem", lvl: 3, t: ["t66"], pp: "5-bob Factor by Grouping (26)", ah: "13-1, 13-2 (213–215)" },
      { id: "interp", uz: "Konstantalarni talqin qilish (chiziqli, kvadratik, ko'rsatkichli)", en: "Interpreting constants", lvl: 2, t: ["t8", "t27", "t1"], pp: "35-bob (311), 18-bob (155)", ah: "5-1 (77), 12-4 (203)" },
      { id: "complex", uz: "Kompleks sonlar", en: "Complex numbers", lvl: 4, t: [], pp: "—", ah: "13-5 (222)" }
    ]},
    { id: "data", en: "Problem-Solving & Data Analysis", uz: "Masala yechish va ma'lumotlar tahlili", savol: "5–7 savol / test", sub: [
      { id: "ratio", uz: "Nisbat, proporsiya, birlik tezlik", en: "Ratios, rates & proportions", lvl: 1, t: ["t56"], pp: "23-bob (224)", ah: "6-bob (95–99)" },
      { id: "percent", uz: "Foizlar: o'zgarish, oshish va kamayish", en: "Percentages", lvl: 1, t: ["a5", "t56"], pp: "9-bob (53)", ah: "7-bob (109–113)" },
      { id: "units", uz: "O'lchov birliklari va o'lchamlar tahlili", en: "Unit conversion", lvl: 1, t: ["t98"], pp: "25-bob (241)", ah: "6-1 (95)" },
      { id: "center", uz: "O'rta qiymat, mediana, moda, kenglik", en: "Mean, median, mode & range", lvl: 1, t: ["t57"], pp: "24-bob (230)", ah: "8-1 (121)" },
      { id: "spread", uz: "Standart og'ish, tanlanma, xatolik chegarasi, noxolislik", en: "Standard deviation, sampling & margin of error", lvl: 1, t: [], pp: "22-bob (208)", ah: "8-2, 8-5 (123, 129)" },
      { id: "plots", uz: "Diagrammalar: nuqtali, quti (box), gistogramma", en: "Dot plots, box plots & histograms", lvl: 1, t: [], pp: "22-bob (211–215)", ah: "8-3 (125)" },
      { id: "scatter", uz: "Sochilma diagramma va eng yaxshi moslik chizig'i", en: "Scatter plots & line of best fit", lvl: 1, t: [], pp: "26-bob (248)", ah: "8-4 (127)" },
      { id: "prob", uz: "Ehtimollik va jadvallar, shartli ehtimollik", en: "Probability & two-way tables", lvl: 1, t: ["t92", "t93", "t37", "t39"], pp: "21-bob (197)", ah: "9-2, 9-3 (141–143)" },
      { id: "combo", uz: "Kombinatorika: o'rin almashtirish va guruhlash", en: "Permutations & combinations", lvl: 3, t: ["t90", "t91", "t89", "t38"], pp: "—", ah: "9-1 (139)" },
      { id: "growth", uz: "Chiziqli va ko'rsatkichli o'sishni taqqoslash", en: "Linear vs exponential growth", lvl: 2, t: ["t27", "t8"], pp: "19-bob (164)", ah: "12-4 (203)" }
    ]},
    { id: "geo", en: "Geometry & Trigonometry", uz: "Geometriya va trigonometriya", savol: "5–7 savol / test", sub: [
      { id: "angles", uz: "Burchaklar, parallel to'g'ri chiziqlar, ko'pburchak burchaklari", en: "Angles, parallel lines & polygons", lvl: 1, t: ["t40", "t71", "t74"], pp: "14-bob (110)", ah: "16-bob (267–271), 17-1 (279), 18-3 (299)" },
      { id: "tri", uz: "Uchburchaklar: Pifagor, maxsus to'g'ri burchakli, o'xshashlik, tenglik", en: "Triangles, Pythagorean theorem & similarity", lvl: 1, t: ["t71", "t86", "t85"], pp: "15-bob (120), 16-bob (130)", ah: "17-2, 17-3 (281–283)" },
      { id: "area", uz: "Yuza va perimetr: to'rtburchaklar, ko'pburchaklar", en: "Area & perimeter", lvl: 1, t: ["t72", "t74", "t41"], pp: "15-bob Area (117)", ah: "17-4 (285), 18-bob (295–299)" },
      { id: "circle", uz: "Aylana: tenglamasi, yoy, sektor, ichki chizilgan burchak", en: "Circles, arcs & sectors", lvl: 1, t: ["t73", "t80", "t82"], pp: "27-bob (253); 33-bob Arcs and Sectors (301, 2-daraja)", ah: "19-bob (309–317)" },
      { id: "solid", uz: "Hajm va sirt: prizma, silindr, piramida, konus, shar", en: "Volume & surface area", lvl: 1, t: ["t75", "t77", "t76", "t78", "t79", "t81"], pp: "15-bob Volume (117)", ah: "20-bob (327–331)" },
      { id: "trig", uz: "Trigonometriya: SOH-CAH-TOA, radian, birlik aylana", en: "Right-triangle trig, radians & unit circle", lvl: 1, t: ["t29", "t68", "t3", "t31"], pp: "20-bob (177)", ah: "15-bob (251–255)" },
      { id: "coord", uz: "Koordinata geometriyasi: masofa, o'rta nuqta", en: "Distance & midpoint", lvl: 1, t: ["t82", "t83"], pp: "17-bob Midpoint / Distance (147–148)", ah: "3-3 (42)" }
    ]}
  ],
  // Test-yechish hiylalari (faqat kitobdan o'qiladi, testi yo'q)
  hiyla: [
    { uz: "Backsolving — javob variantlarini tenglamaga qo'yib tekshirish", pp: "1-bob (1)" },
    { uz: "Substitution — noma'lumlar o'rniga qulay son qo'yish", pp: "2-bob (5)" },
    { uz: "Ekvivalent ifodalar — tez taqqoslash usuli", pp: "3-bob (9)" },
    { uz: "Desmos kalkulyator hiylalari (tenglama, sistema, kvadrat tenglama)", pp: "4-bob (14)" },
    { uz: "So'z masalalari uchun 4 qoida", pp: "30-bob (277)" }
  ],
  // Kitobdagi to'liq sinov testlari
  sinov: [
    { uz: "PSAT 10 amaliy test", ah: "341-bet (javoblar 360)" },
    { uz: "SAT amaliy test 1", ah: "367-bet (javoblar 388)" },
    { uz: "SAT amaliy test 2", ah: "399-bet (javoblar 421)" },
    { uz: "Har bobning oxirida bob testi va yechimlari", ah: "har bob" }
  ]
};
