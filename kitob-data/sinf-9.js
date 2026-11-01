/* Kuvonch Academy — Elektron kitob, 9-sinf: Algebra 9 va Geometriya 9 mundarijalari asosida. */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[9] = {
  sinf: 9, nom: "Algebra va Geometriya", bosqich: "Tayanch o'rta ta'lim",
  kirish: "Algebra 9: kvadrat funksiya va tengsizliklar, ikkinchi darajali tenglamalar sistemasi, progressiyalar, trigonometriya elementlari, ehtimollik. Geometriya 9: o'xshashlik, geometrik almashtirishlar, sinuslar va kosinuslar teoremalari, muntazam ko'pburchaklar, aylana uzunligi va doira yuzi, proporsional kesmalar.",
  pdf: [
    { nom: "Algebra 9", url: "https://static.oliygoh.uz/uploads/darsliklar/9/algebra-9-sinf-uz.pdf" },
    { nom: "Geometriya 9", url: "https://static.oliygoh.uz/uploads/darsliklar/9/geometriya-9-sinf-uz.pdf" }
  ],
  boblar: [
    { nom: "Algebra. 1-bob. Kvadrat funksiya", mavzular: [
      { id: "k9-1", nom: "y = ax² + bx + c funksiya va grafigi (parabola)", test: ["s9m1", "t1"],
        qoida: ["Grafik — <b>parabola</b>; a > 0 — tarmoqlar yuqoriga, a < 0 — pastga. <b>Uchi:</b> x₀ = −b/(2a), y₀ = f(x₀). Simmetriya o'qi x = x₀.", "Nollari: ax² + bx + c = 0 ildizlari (D ga bog'liq). Oy bilan kesishish: (0; c). Chizish: uch, nollar, (0; c) va simmetrik nuqtalar. y = a(x − m)² + n — uchi (m; n)."],
        misol: [["y = x² − 4x + 3: uchi, nollari, chizing.", "x₀ = 2, y₀ = 4 − 8 + 3 = −1; nollar x = 1, x = 3; (0; 3). Uchi (2; −1), tarmoqlar yuqoriga."], ["y = −2x² + 8x ning eng katta qiymati?", "x₀ = 2, y₀ = −8 + 16 = 8 — eng katta qiymat 8."]],
        mashq: ["Uchi va nollarini toping, chizing: y = x² − 2x − 8; y = −x² + 6x − 5; y = 2x² + 4x + 5.", "y = (x + 3)² − 4 parabolaning uchi? Qaysi parabola siljitilgan?", "Kvadrat funksiya (0; 3), (1; 0), (3; 0) nuqtalardan o'tadi. Formulasini toping."] },
      { id: "k9-2", nom: "Kvadrat tengsizliklar. Intervallar usuli", test: ["s9m1", "t2", "t12"],
        qoida: ["ax² + bx + c > 0 (<, ≥, ≤) — parabola orqali: nollarni topib, tarmoqlar yo'nalishiga qarab qaysi oraliqda ishora kerakligini aniqlaymiz. D < 0 bo'lsa: a > 0 da ifoda doim musbat, a < 0 da doim manfiy.", "<b>Intervallar usuli:</b> ko'paytuvchilarga ajratib nollarni son o'qiga qo'yamiz, eng o'ngda ishorani aniqlab, har nolda (toq darajali) ishorani almashtiramiz."],
        misol: [["x² − x − 6 < 0", "Nollar −2, 3; a > 0 → ildizlar orasida manfiy: (−2; 3)."], ["(x − 1)(x + 4)(x − 5) ≥ 0", "Nollar −4, 1, 5. O'ngda +, keyin −, +, −. Javob: [−4; 1] ∪ [5; +∞)."]],
        mashq: ["Yeching: x² − 5x + 4 ≥ 0; −x² + 4x > 0; x² + 2x + 3 < 0; 2x² − 3x − 2 ≤ 0.", "Intervallar usulida: (x + 2)(x − 3) > 0; x(x − 1)(x + 1) ≤ 0; (x − 2)/(x + 5) < 0.", "Qaysi m da x² − mx + 9 > 0 barcha x uchun o'rinli?"] }
    ] },
    { nom: "Algebra. 2-bob. Tenglamalar va tengsizliklar sistemalari", mavzular: [
      { id: "k9-3", nom: "Ikkinchi darajali tenglamalar sistemasi", test: ["t11", "s7m3"],
        qoida: ["Bir tenglama chiziqli bo'lsa — <b>o'rniga qo'yish</b>: y ni ifodalab ikkinchisiga qo'yamiz, kvadrat tenglama hosil bo'ladi.", "Simmetrik sistemalar: {x + y = s; xy = p} → Vyet teoremasi bo'yicha x, y — t² − st + p = 0 ning ildizlari. Grafik ma'no: egri chiziqlar kesishish nuqtalari."],
        misol: [["{ x + y = 5; xy = 6 }", "t² − 5t + 6 = 0 → 2, 3. Javob: (2; 3), (3; 2)."], ["{ y = x − 1; x² + y² = 25 }", "x² + (x − 1)² = 25 → 2x² − 2x − 24 = 0 → x² − x − 12 = 0 → x = 4, −3; y = 3, −4. Javob: (4; 3), (−3; −4)."]],
        mashq: ["Yeching: { x − y = 2; x² − y² = 12 }; { x + y = 7; x² + y² = 25 }; { y = x²; y = 2x + 3 }.", "To'g'ri to'rtburchak perimetri 28, diagonali 10. Tomonlari?", "Ikki son yig'indisi 11, kvadratlari ayirmasi 33. Sonlarni toping."] }
    ] },
    { nom: "Algebra. 3-bob. Progressiyalar", mavzular: [
      { id: "k9-4", nom: "Sonli ketma-ketlik. Arifmetik progressiya", test: ["s9m2", "t54"],
        qoida: ["<b>Arifmetik progressiya</b>: har had oldingisidan d (ayirma) ga farq qiladi: aₙ₊₁ = aₙ + d. <b>aₙ = a₁ + (n − 1)d</b>. Xarakteristik xossa: aₙ = (aₙ₋₁ + aₙ₊₁)/2.", "<b>Sₙ = (a₁ + aₙ)·n/2 = (2a₁ + (n − 1)d)·n/2</b>. Gauss usuli: 1 + 2 + … + 100 = 101·50 = 5 050."],
        misol: [["a₁ = 3, d = 4. a₁₀ va S₁₀?", "a₁₀ = 3 + 36 = 39; S₁₀ = (3 + 39)·5 = 210."], ["a₅ = 12, a₉ = 24. d va a₁?", "4d = 12 → d = 3; a₁ = 12 − 12 = 0."]],
        mashq: ["7, 11, 15, … progressiyaning a₂₀ va S₂₀.", "a₃ = 10, a₇ = 22. a₁, d, S₁₀?", "1 dan 200 gacha 3 ga bo'linuvchi sonlar yig'indisi?", "Teatr zalida birinchi qatorda 20 o'rin, har keyingi qatorda 2 ta ko'p, 15 qator. Jami o'rin?"] },
      { id: "k9-5", nom: "Geometrik progressiya. Cheksiz kamayuvchi geometrik progressiya", test: ["s9m2", "t55"],
        qoida: ["<b>Geometrik progressiya</b>: har had oldingisini q (maxraj) ga ko'paytirganda: <b>bₙ = b₁·qⁿ⁻¹</b>. Xossa: bₙ² = bₙ₋₁·bₙ₊₁.", "<b>Sₙ = b₁(qⁿ − 1)/(q − 1)</b> (q ≠ 1). |q| < 1 bo'lsa cheksiz kamayuvchi, yig'indisi <b>S = b₁/(1 − q)</b>. 0,(3) = 3/10 + 3/100 + … = 0,3/(1 − 0,1) = 1/3."],
        misol: [["b₁ = 2, q = 3. b₆ va S₆?", "b₆ = 2·243 = 486; S₆ = 2(729 − 1)/2 = 728."], ["1 + 1/2 + 1/4 + … = ?", "1/(1 − 1/2) = 2."]],
        mashq: ["3, 6, 12, … ning b₈ va S₈.", "b₂ = 6, b₄ = 54. b₁ va q (q > 0)?", "0,(7) va 0,(27) ni oddiy kasrga aylantiring.", "Bakteriya har soatda 2 marta ko'payadi. 1 tadan 10 soatda nechta bo'ladi?"] }
    ] },
    { nom: "Algebra. 4-bob. Trigonometriya elementlari", mavzular: [
      { id: "k9-6", nom: "Burchakning radian o'lchovi. Istalgan burchakning sinusi, kosinusi, tangensi", test: ["s9m3", "t68"],
        qoida: ["<b>π rad = 180°</b>; 1 rad ≈ 57,3°; 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2. Gradusdan radianga: × π/180.", "Birlik aylanada burchak α ga mos nuqta (cos α; sin α). tg α = sin α/cos α, ctg α = cos α/sin α. Ishoralari choraklar bo'yicha: I (+,+), II (sin +, cos −), III (−,−), IV (sin −, cos +). Jadval: sin 30° = 1/2, cos 30° = √3/2, sin 45° = cos 45° = √2/2, sin 60° = √3/2, tg 45° = 1."],
        misol: [["150° ni radianda yozing; 3π/4 ni gradusda.", "150·π/180 = 5π/6; 3·180/4 = 135°."], ["sin 150°, cos 120°, tg 135°", "sin 150° = sin 30° = 1/2; cos 120° = −cos 60° = −1/2; tg 135° = −1."]],
        mashq: ["Radianga: 210°, 300°, 18°. Gradusga: π/12, 7π/6, 2π.", "Ishorasini aniqlang: sin 200°, cos 290°, tg 100°.", "sin 120°, cos 225°, tg 300°, ctg 150° ni toping."] },
      { id: "k9-7", nom: "Asosiy trigonometrik ayniyatlar. Keltirish formulalari", test: ["t68", "t3", "s9m3"],
        qoida: ["<b>sin²α + cos²α = 1</b>; tg α·ctg α = 1; 1 + tg²α = 1/cos²α; 1 + ctg²α = 1/sin²α.", "<b>Keltirish formulalari:</b> sin(180° − α) = sin α, cos(180° − α) = −cos α; sin(90° − α) = cos α, cos(90° − α) = sin α; sin(−α) = −sin α, cos(−α) = cos α; sin(α + 360°) = sin α. Qoida: 90°, 270° da funksiya nomi o'zgaradi, 180°, 360° da o'zgarmaydi; ishora — dastlabki chorak bo'yicha."],
        misol: [["sin α = 3/5, α — II chorak. cos α va tg α?", "cos α = −√(1 − 9/25) = −4/5; tg α = −3/4."], ["Soddalashtiring: sin(90° + α)·cos(180° − α) + sin²α", "cos α·(−cos α) + sin²α = sin²α − cos²α = −cos 2α."]],
        mashq: ["cos α = −5/13, α — III chorak. sin α, tg α, ctg α?", "Soddalashtiring: (1 − cos²α)/sin α; sin(π − α) + sin(π + α); tg α·cos α.", "Isbotlang: (sin α + cos α)² = 1 + 2 sin α cos α."] }
    ] },
    { nom: "Algebra. 5-bob. Ehtimollik va statistika elementlari", mavzular: [
      { id: "k9-8", nom: "Kombinatorika va ehtimollikning klassik ta'rifi", test: ["s9m5", "t92", "t90"],
        qoida: ["Ko'paytma qoidasi; o'rin almashtirish Pₙ = n!; o'rinlashtirish Aₙᵏ = n!/(n − k)!; guruhlash Cₙᵏ = n!/(k!(n − k)!).", "<b>P(A) = m/n</b> — qulay hollar soni ÷ barcha teng imkoniyatli hollar soni. 0 ≤ P ≤ 1. Qarama-qarshi hodisa: P(Ā) = 1 − P(A)."],
        misol: [["Ikki o'yin kubigi tashlandi. Yig'indi 7 bo'lish ehtimoli?", "n = 36; qulay: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 → 6/36 = 1/6."], ["10 kishidan 3 kishilik jamoa necha usulda?", "C₁₀³ = 120."]],
        mashq: ["Tanga 3 marta tashlandi. Kamida bitta gerb tushish ehtimoli?", "Qutida 5 oq, 3 qora shar. Ikkita shar olinganda ikkalasi oq bo'lish ehtimoli?", "«MATEMATIKA» so'zidan tasodifiy harf olinganda unli bo'lish ehtimoli?"] }
    ] },
    { nom: "Geometriya. 1-bob. Uchburchaklar o'xshashligi", mavzular: [
      { id: "k9-9", nom: "O'xshash uchburchaklar va o'xshashlik alomatlari", test: ["t86", "s9m4"], pdf: [1, 28],
        qoida: ["Uchburchaklar <b>o'xshash</b> — burchaklari mos ravishda teng, tomonlari proporsional (k — o'xshashlik koeffitsiyenti). Perimetrlar nisbati k, <b>yuzalar nisbati k²</b>.", "Alomatlari: <b>I</b> — ikki burchak bo'yicha; <b>II</b> — ikki tomon proporsional va ular orasidagi burchak teng; <b>III</b> — uch tomon proporsional. To'g'ri burchakli uchburchaklar bitta o'tkir burchagi bo'yicha o'xshash."],
        misol: [["Tomonlari 6, 8, 10 va 9, 12, 15 uchburchaklar o'xshashmi?", "6/9 = 8/12 = 10/15 = 2/3 — III alomat bo'yicha o'xshash, k = 2/3."], ["Daraxt soyasi 12 m, shu vaqtda 1,5 m li tayoq soyasi 2 m. Daraxt bo'yi?", "x/12 = 1,5/2 → x = 9 m."]],
        mashq: ["Uchburchak tomonlari 4, 5, 6; unga o'xshash uchburchak eng katta tomoni 18. Qolgan tomonlari?", "O'xshash uchburchaklar yuzalari 16 va 36 sm², birinchining tomoni 8. Ikkinchisining mos tomoni?", "ABC da MN ∥ AC (M ∈ AB, N ∈ BC), BM = 4, MA = 6, MN = 5. AC?"] },
      { id: "k9-10", nom: "Geometrik almashtirishlar: harakat, simmetriya, burish, gomotetiya", test: ["t82"], pdf: [1, 48],
        qoida: ["<b>Harakat</b> — masofani saqlovchi almashtirish: parallel ko'chirish, o'qqa nisbatan simmetriya, markaziy simmetriya, burish. Harakatda shakl o'ziga teng shaklga o'tadi.", "<b>Gomotetiya</b> (markaz O, koeffitsiyent k): har X nuqtaga OX' = k·OX bo'lgan X' mos. Shaklni k marta kattalashtiradi/kichraytiradi — o'xshash shakl beradi."],
        misol: [["A(2; 3) nuqtani Ox ga nisbatan, keyin koordinata boshiga nisbatan akslantiring.", "(2; −3) → (−2; 3)."], ["Markazi O(0; 0), k = 2 gomotetiyada A(1; −3) qayerga o'tadi?", "(2; −6)."]],
        mashq: ["A(−1; 4) ni a⃗(3; −2) ga parallel ko'chiring; Oy ga nisbatan simmetrik nuqtasi?", "Kvadratni markazi atrofida 90° ga bursak o'z-o'ziga o'tadimi? Uchburchak-chi?", "Tomoni 4 bo'lgan uchburchakka k = 1/2 gomotetiya qo'llansa yuzi necha marta kamayadi?"] }
    ] },
    { nom: "Geometriya. 2-bob. Uchburchaklarni yechish", mavzular: [
      { id: "k9-11", nom: "Uchburchak yuzi sinus orqali. Sinuslar va kosinuslar teoremalari", test: ["t85"], pdf: [1, 82],
        qoida: ["<b>S = ½·ab·sin C</b>. <b>Sinuslar teoremasi:</b> a/sin A = b/sin B = c/sin C = 2R. <b>Kosinuslar teoremasi:</b> c² = a² + b² − 2ab·cos C (Pifagorning umumlashmasi).", "Uchburchakni yechish — berilgan 3 element bo'yicha qolganlarini topish: ikki tomon va burchak (kosinuslar), tomon va ikki burchak (sinuslar), uch tomon (kosinuslar bilan burchaklar)."],
        misol: [["a = 5, b = 8, C = 60°. c va S?", "c² = 25 + 64 − 80·½ = 49 → c = 7; S = ½·5·8·(√3/2) = 10√3."], ["a = 10, A = 30°, B = 45°. b?", "b = a·sin B/sin A = 10·(√2/2)/(½) = 10√2."]],
        mashq: ["Tomonlari 7, 8, 9. Eng katta burchakning kosinusi?", "a = 6, b = 10, C = 120°. c?", "Tomonlari 5 va 12, orasidagi burchak 150°. Yuzi?", "A = 45°, C = 60°, AC = 12. BC? (sinuslar teoremasi)"] }
    ] },
    { nom: "Geometriya. 3-bob. Muntazam ko'pburchaklar, aylana va doira", mavzular: [
      { id: "k9-12", nom: "Muntazam ko'pburchaklar. Ichki va tashqi chizilgan aylanalar", test: ["t74", "t80"], pdf: [1, 108],
        qoida: ["Muntazam n-burchak: hamma tomoni va burchagi teng; har doim ichki va tashqi aylana chizish mumkin, markazlari bitta. Burchagi (n − 2)·180°/n.", "aₙ = 2R·sin(180°/n); r = R·cos(180°/n). Uchburchak: a₃ = R√3, r = R/2. Kvadrat: a₄ = R√2, r = R√2/2. Oltiburchak: a₆ = R, r = R√3/2."],
        misol: [["Muntazam oltiburchak tomoni 6. R, r va yuzi?", "R = 6; r = 3√3; S = 6·(6²√3/4) = 54√3."]],
        mashq: ["Kvadratga tashqi chizilgan aylana radiusi 4. Tomoni va ichki aylana radiusi?", "Muntazam uchburchak ichki aylanasi radiusi 2. Tomoni va yuzi?", "R = 10 aylanaga ichki chizilgan muntazam 12-burchak tomoni? (sin 15° ≈ 0,259)"] },
      { id: "k9-13", nom: "Aylana uzunligi, yoy uzunligi, doira va sektor yuzi", test: ["s9m4", "t73"], pdf: [1, 116],
        qoida: ["<b>C = 2πR</b>; yoy uzunligi l = πRα/180° (α — gradusda) yoki l = Rα (radianda). <b>S = πR²</b>; sektor yuzi S = πR²α/360°; segment yuzi = sektor − uchburchak.", "Burchakning radian o'lchovi — radiusga teng yoyga tayangan markaziy burchak 1 rad."],
        misol: [["R = 6, α = 60°. Yoy uzunligi va sektor yuzi?", "l = π·6·60/180 = 2π; S = π·36·60/360 = 6π."], ["Aylana uzunligi 10π. Doira yuzi?", "R = 5; S = 25π."]],
        mashq: ["R = 9, markaziy burchak 40°. Yoy uzunligi va sektor yuzi?", "Doira yuzi 49π. Aylana uzunligi?", "R = 4, α = 90° segment yuzi?", "G'ildirak diametri 70 sm. 1 km da necha marta aylanadi? (π ≈ 3,14)"] },
      { id: "k9-14", nom: "Proporsional kesmalar. To'g'ri burchakli uchburchakdagi proporsional kesmalar", test: ["t86", "t71"], pdf: [1, 130],
        qoida: ["To'g'ri burchakli uchburchakda gipotenuzaga tushirilgan balandlik: <b>h² = a_c·b_c</b> (katetlar proyeksiyalari ko'paytmasi); <b>a² = c·a_c</b>, b² = c·b_c; h = ab/c.", "Aylanada: kesishuvchi vatarlar kesmalari ko'paytmalari teng (AE·EB = CE·ED); tashqi nuqtadan kesuvchi va urinma: urinma² = kesuvchi·tashqi qismi."],
        misol: [["Katetlar proyeksiyalari 4 va 9. Balandlik va katetlar?", "h = 6; a = √(13·4) = 2√13; b = √(13·9) = 3√13."], ["Vatarlar kesishgan: AE = 3, EB = 8, CE = 4. ED?", "3·8 = 4·ED → ED = 6."]],
        mashq: ["Gipotenuza 25, bir katet 15. Shu katetning proyeksiyasi va balandlik?", "Urinma 6, kesuvchining tashqi qismi 4. Kesuvchining butun uzunligi?", "Balandlik 12, katetlar proyeksiyalari farqi 7. Proyeksiyalarni toping."] }
    ] }
  ]
};
