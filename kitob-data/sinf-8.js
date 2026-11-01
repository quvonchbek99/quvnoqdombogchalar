/* Kuvonch Academy — Elektron kitob, 8-sinf: Algebra 8 va Geometriya 8 mundarijalari asosida. */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[8] = {
  sinf: 8, nom: "Algebra va Geometriya", bosqich: "Tayanch o'rta ta'lim",
  kirish: "Algebra 8: algebraik kasrlar, butun ko'rsatkichli daraja, kvadrat ildizlar, kvadrat tenglamalar, tengsizliklar, funksiyalar. Geometriya 8: to'rtburchaklar, Fales teoremasi, simmetriya, yuzlar, Pifagor teoremasi, aylana, vektorlar.",
  pdf: [
    { nom: "Algebra 8", url: "https://static.oliygoh.uz/uploads/darsliklar/8/algebra-8-sinf-uz.pdf" },
    { nom: "Geometriya 8", url: "https://static.oliygoh.uz/uploads/darsliklar/8/geometriya-8-sinf-uz.pdf" }
  ],
  boblar: [
    { nom: "Algebra. 1-bob. Algebraik kasrlar", mavzular: [
      { id: "k8-1", nom: "Algebraik kasr. Aniqlanish sohasi. Qisqartirish", test: ["s8m4", "t65"],
        qoida: ["<b>Algebraik kasr</b> — surat va maxraji ko'phad bo'lgan ifoda: (x + 1)/(x − 3). <b>Aniqlanish sohasi</b> (ODZ): maxraj ≠ 0 → x ≠ 3.", "Kasrning asosiy xossasi: surat va maxrajni bir xil nolga teng bo'lmagan ifodaga ko'paytirish/bo'lish mumkin. Qisqartirish uchun avval surat va maxrajni <b>ko'paytuvchilarga ajratamiz</b>."],
        misol: [["(x² − 9)/(x² + 3x) ni qisqartiring.", "(x − 3)(x + 3) / (x(x + 3)) = (x − 3)/x, x ≠ 0, x ≠ −3."], ["(a² − 2a + 1)/(1 − a) = ?", "(a − 1)² / (−(a − 1)) = −(a − 1) = 1 − a."]],
        mashq: ["ODZ ni toping: 5/(x − 2); (x + 1)/(x² − 4); 3/(x² + 1).", "Qisqartiring: 6a²b/(9ab²); (x² − 4)/(x² − 4x + 4); (2x + 6)/(x² − 9)."] },
      { id: "k8-2", nom: "Algebraik kasrlarni qo'shish, ayirish, ko'paytirish va bo'lish", test: ["s8m4", "t18"],
        qoida: ["Qo'shish/ayirish: umumiy maxraj — maxrajlarning EKUKi (ko'paytuvchilarga ajratib): 1/(x − 1) + 2/(x + 1) = (x + 1 + 2(x − 1)) / ((x − 1)(x + 1)) = (3x − 1)/(x² − 1).", "Ko'paytirish: surat·surat, maxraj·maxraj; bo'lish — teskari kasrga ko'paytirish. Har doim qisqartirish imkonini tekshiramiz."],
        misol: [["a/(a − b) − b/(a + b)", "(a(a + b) − b(a − b)) / ((a − b)(a + b)) = (a² + b²)/(a² − b²)."], ["(x² − 1)/(x + 2) ÷ (x − 1)/(2x + 4)", "(x − 1)(x + 1)/(x + 2) · 2(x + 2)/(x − 1) = 2(x + 1)."]],
        mashq: ["Hisoblang: 3/x + 2/x²; x/(x − 2) − 2/(x + 2); (a + b)/a · a²/(a² − b²); (x² − 4)/(3x) ÷ (x + 2)/x.", "Soddalashtiring: (1 + 1/x)(1 − 1/x)."] },
      { id: "k8-3", nom: "Butun ko'rsatkichli daraja. Sonning standart shakli", test: ["s7m1", "t19"],
        qoida: ["<b>a⁰ = 1</b> (a ≠ 0), <b>a⁻ⁿ = 1/aⁿ</b>: 2⁻³ = 1/8, (2/3)⁻² = (3/2)² = 9/4. Natural ko'rsatkichli daraja xossalari butun ko'rsatkichlar uchun ham o'rinli.", "Standart shakl a·10ⁿ, 1 ≤ a < 10, n — butun: 0,000 045 = 4,5·10⁻⁵. Juda katta va kichik sonlar bilan hisoblash: (3·10⁸)·(2·10⁻³) = 6·10⁵."],
        misol: [["Soddalashtiring: (x⁻²·y³)⁻¹ · x⁻³", "x²·y⁻³·x⁻³ = x⁻¹y⁻³ = 1/(xy³)."], ["5⁻² + 2⁻¹ − 10⁰ = ?", "1/25 + 1/2 − 1 = 0,04 + 0,5 − 1 = −0,46."]],
        mashq: ["Hisoblang: 3⁻³; (−2)⁻⁴; (0,1)⁻²; 4⁻¹ + 4⁰.", "Standart shaklda: 345 000 000; 0,000 0072; 25·10⁵.", "Yer massasi 6·10²⁴ kg, Oy massasi 7,3·10²² kg. Necha marta farq?"] }
    ] },
    { nom: "Algebra. 2-bob. Kvadrat ildizlar", mavzular: [
      { id: "k8-4", nom: "Arifmetik kvadrat ildiz va uning xossalari", test: ["s8m1", "t62"],
        qoida: ["√a (a ≥ 0) — kvadrati a ga teng manfiy bo'lmagan son. (√a)² = a; <b>√(a²) = |a|</b>.", "<b>√(ab) = √a·√b</b>, <b>√(a/b) = √a/√b</b> (a, b ≥ 0). Ildiz ostidan ko'paytuvchini chiqarish: √75 = √(25·3) = 5√3; kiritish: 3√2 = √18. Maxrajdagi irratsionallikdan qutulish: 1/√3 = √3/3."],
        misol: [["√72 − 2√18 + √8 ni soddalashtiring.", "6√2 − 6√2 + 2√2 = 2√2."], ["(√5 − 2)(√5 + 2) = ?", "5 − 4 = 1."]],
        mashq: ["Soddalashtiring: √50; √(16·49); √(0,09); 2√27 − √12.", "Hisoblang: (2√3)²; √12·√3; √98/√2; (√7 + 1)².", "Maxrajni irratsionallikdan qutqaring: 4/√2; 1/(√5 − 2)."] },
      { id: "k8-5", nom: "y = x², y = √x, y = k/x funksiyalari va grafiklari", test: ["t1", "t6"],
        qoida: ["<b>y = x²</b> — parabola, uchi (0; 0), tarmoqlari yuqoriga, Oy ga nisbatan simmetrik (juft funksiya). <b>y = √x</b> — x ≥ 0 da aniqlangan, o'suvchi, parabolaning «yarmi» yotqizilgani.", "<b>y = k/x</b> — giperbola (teskari proporsionallik); k > 0 — I va III choraklarda, k < 0 — II va IV; x ≠ 0, o'qlarga yaqinlashadi, kesishmaydi."],
        misol: [["y = 6/x grafigi (2; 3) nuqtadan o'tadimi? (−3; 2)-chi?", "6/2 = 3 — o'tadi; 6/(−3) = −2 ≠ 2 — o'tmaydi."]],
        mashq: ["y = x², y = √x, y = 4/x grafiklarini jadval tuzib chizing.", "y = k/x grafigi (4; −2) dan o'tadi. k? Grafik qaysi choraklarda?", "√x = 3 va x² = 5 tenglamalarni grafik va analitik yeching."] }
    ] },
    { nom: "Algebra. 3-bob. Kvadrat tenglamalar", mavzular: [
      { id: "k8-6", nom: "Kvadrat tenglama. Chala kvadrat tenglamalar", test: ["s8m2"],
        qoida: ["<b>ax² + bx + c = 0</b> (a ≠ 0). b = 0 yoki c = 0 bo'lsa — <b>chala</b>.", "ax² = 0 → x = 0. ax² + c = 0 → x² = −c/a (manfiy bo'lsa ildiz yo'q): 2x² − 18 = 0 → x = ±3. ax² + bx = 0 → x(ax + b) = 0 → x = 0 yoki x = −b/a."],
        misol: [["3x² − 12x = 0", "3x(x − 4) = 0 → x = 0; x = 4."], ["5x² + 20 = 0", "x² = −4 — haqiqiy ildiz yo'q."]],
        mashq: ["Yeching: x² − 49 = 0; 4x² = 9; x² + 7x = 0; −2x² + 50 = 0; 3x² + 1 = 0.", "Kvadrat tenglamaning a, b, c koeffitsiyentlarini ayting: 2x² − x + 5 = 0; −x² + 3 = 0."] },
      { id: "k8-7", nom: "Diskriminant va ildizlar formulasi", test: ["s8m2", "t2"],
        qoida: ["<b>D = b² − 4ac</b>. D > 0 — ikkita ildiz <b>x = (−b ± √D)/(2a)</b>; D = 0 — bitta ildiz x = −b/(2a); D < 0 — haqiqiy ildiz yo'q.", "b juft bo'lsa: k = b/2, D₁ = k² − ac, x = (−k ± √D₁)/a. Oldin umumiy ko'paytuvchi bilan soddalashtiring (6x² − 12x + 6 = 0 → x² − 2x + 1 = 0)."],
        misol: [["2x² − 5x + 2 = 0", "D = 25 − 16 = 9; x = (5 ± 3)/4 → x₁ = 2, x₂ = 1/2."], ["x² − 6x + 9 = 0", "D = 36 − 36 = 0 → x = 3."]],
        mashq: ["Yeching: x² − 7x + 10 = 0; 3x² + 5x − 2 = 0; x² + 4x + 5 = 0; 4x² − 12x + 9 = 0.", "Qaysi p da x² + px + 16 = 0 tenglama bitta ildizga ega?"] },
      { id: "k8-8", nom: "Vyet teoremasi. Kvadrat uchhadni ko'paytuvchilarga ajratish", test: ["t63", "s8m2"],
        qoida: ["x² + px + q = 0 keltirilgan tenglama uchun <b>x₁ + x₂ = −p, x₁·x₂ = q</b>. Umumiy holda x₁ + x₂ = −b/a, x₁x₂ = c/a. Teskari teorema: yig'indisi −p, ko'paytmasi q bo'lgan sonlar — ildizlar.", "<b>ax² + bx + c = a(x − x₁)(x − x₂)</b>. x² − 5x + 6 = (x − 2)(x − 3). Ildizlar orqali ifodalar: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂."],
        misol: [["x² − 9x + 20 = 0 ildizlarini og'zaki toping.", "Yig'indisi 9, ko'paytmasi 20 → 4 va 5."], ["x² + 3x − 10 = 0 da x₁² + x₂² = ?", "(−3)² − 2(−10) = 9 + 20 = 29."]],
        mashq: ["Vyet bilan: x² − 8x + 15 = 0; x² + 2x − 24 = 0; x² − x − 12 = 0.", "Ajrating: x² − 7x + 12; 2x² + 5x − 3; 3x² − 27.", "Ildizlari 2 va −6 bo'lgan keltirilgan kvadrat tenglama tuzing."] },
      { id: "k8-9", nom: "Kvadrat tenglamaga keltiriladigan tenglamalar va matnli masalalar", test: ["t14", "t10"],
        qoida: ["<b>Bikvadrat</b> ax⁴ + bx² + c = 0 → t = x² almashtirish. Kasr-ratsional tenglama → umumiy maxrajga ko'paytirib ODZ ni tekshiramiz. Ko'paytuvchilarga ajratish: (x² − 1)(x + 2) = 0.", "Masalalar: noma'lumni x deb olib kvadrat tenglama tuzamiz; manfiy yoki mantiqsiz ildizni tashlab yuboramiz (uzunlik, soni manfiy bo'lmaydi)."],
        misol: [["x⁴ − 5x² + 4 = 0", "t² − 5t + 4 = 0 → t = 1; 4 → x = ±1; ±2."], ["To'g'ri to'rtburchak yuzi 60 sm², uzunligi enidan 7 sm ko'p. Tomonlari?", "x(x + 7) = 60 → x² + 7x − 60 = 0 → x = 5 (−12 mos emas). Tomonlari 5 va 12 sm."]],
        mashq: ["Yeching: x⁴ − 13x² + 36 = 0; 12/(x − 1) − 12/x = 1; (x² − 4)(x² − 9) = 0.", "Ikki ketma-ket natural son ko'paytmasi 132. Sonlarni toping.", "Poyezd 300 km masofada tezligini 10 km/soat oshirganda 1 soat kam vaqt sarfladi. Dastlabki tezligi?"] }
    ] },
    { nom: "Algebra. 4-bob. Tengsizliklar", mavzular: [
      { id: "k8-10", nom: "Sonli tengsizliklar xossalari. Chiziqli tengsizliklar", test: ["t12", "t53"],
        qoida: ["a > b bo'lsa: a + c > b + c; c > 0 da ac > bc; <b>c < 0 da ac < bc</b> (manfiy songa ko'paytirganda belgi o'zgaradi!). Bir xil ma'noli tengsizliklarni hadlab qo'shish mumkin.", "Chiziqli tengsizlik ax + b > 0 tenglama kabi yechiladi, faqat manfiyga ko'paytirish/bo'lishda belgi teskarilanadi. Javob — sonli oraliq: x > 2 → (2; +∞); x ≤ −1 → (−∞; −1]."],
        misol: [["3 − 2x ≥ 7 − 4x", "−2x + 4x ≥ 7 − 3 → 2x ≥ 4 → x ≥ 2 → [2; +∞)."], ["5(x − 1) < 2x + 7", "5x − 5 < 2x + 7 → 3x < 12 → x < 4 → (−∞; 4)."]],
        mashq: ["Yeching va oraliqni yozing: 4x − 7 > 9; 2 − 3x ≤ 11; (x + 1)/2 − x/3 ≥ 1; −5x < 20.", "a < b. Taqqoslang: −3a va −3b; a − 4 va b − 4; a/2 va b/2."] },
      { id: "k8-11", nom: "Tengsizliklar sistemasi. Modulli tenglama va tengsizliklar", test: ["t13", "t53"],
        qoida: ["Sistema yechimi — barcha tengsizliklar yechimlarining <b>kesishmasi</b> (son o'qida umumiy qism). {x > 1; x ≤ 5} → (1; 5].", "<b>|x| = a</b> (a > 0) → x = ±a. <b>|x| < a</b> → −a < x < a. <b>|x| > a</b> → x < −a yoki x > a. |x − 3| < 2 → 1 < x < 5."],
        misol: [["{ 2x − 1 > 3; 5 − x ≥ 0 }", "x > 2 va x ≤ 5 → (2; 5]."], ["|2x + 1| = 7", "2x + 1 = 7 → x = 3; 2x + 1 = −7 → x = −4."], ["|x − 4| ≤ 3", "−3 ≤ x − 4 ≤ 3 → 1 ≤ x ≤ 7 → [1; 7]."]],
        mashq: ["Yeching: { 3x + 2 > −4; x − 6 < −1 }; { 2x ≥ 8; x < 3 }.", "|x| = 5; |3x − 6| = 0; |x + 2| = 9; |x − 1| > 4; |2x + 3| < 5.", "x ning qanday butun qiymatlarida −3 < 2x − 1 ≤ 7 bo'ladi?"] }
    ] },
    { nom: "Algebra. 5-bob. Statistika elementlari", mavzular: [
      { id: "k8-12", nom: "Ma'lumotlarni to'plash, jadvallar, diagrammalar. O'rtacha, moda, mediana", test: ["t57", "t99"],
        qoida: ["Tanlanma: ma'lumotlar to'plami. <b>O'rtacha arifmetik</b> = yig'indi ÷ soni. <b>Moda</b> — eng ko'p uchraydigan qiymat. <b>Mediana</b> — tartiblangandagi o'rtadagi qiymat (juft bo'lsa ikki o'rtaning o'rtachasi). <b>Ko'lam</b> = max − min.", "Chastota jadvali va gistogramma. Ustunli, chiziqli, doiraviy diagrammalar — ma'lumotni ko'rgazmali taqdim etish."],
        misol: [["Baholar: 4, 5, 3, 4, 5, 5, 2. O'rtacha, moda, mediana, ko'lam?", "O'rtacha 28/7 = 4; moda 5; tartiblab 2 3 4 4 5 5 5 → mediana 4; ko'lam 3."]],
        mashq: ["7, 12, 9, 7, 15, 10 uchun o'rtacha, moda, mediana.", "Sinfdoshlaringizning bo'yini o'lchab chastota jadvali va gistogramma tuzing.", "5 ta sonning o'rtachasi 8, mediana 7, moda 6. Shunday to'plamga misol keltiring."] }
    ] },
    { nom: "Geometriya. 1-bob. To'rtburchaklar", mavzular: [
      { id: "k8-13", nom: "Ko'pburchaklar. Qavariq ko'pburchak burchaklari yig'indisi", test: ["t74", "s7m4"], pdf: [1, 7],
        qoida: ["n-burchak ichki burchaklari yig'indisi <b>(n − 2)·180°</b>; tashqi burchaklar yig'indisi 360°. Muntazam n-burchak burchagi (n − 2)·180°/n.", "Diagonallar soni n(n − 3)/2."],
        misol: [["Burchaklari yig'indisi 1 440° bo'lgan ko'pburchak nechta tomonli?", "(n − 2)·180 = 1 440 → n = 10."]],
        mashq: ["Yettiburchak burchaklari yig'indisi va diagonallari soni?", "Muntazam ko'pburchak burchagi 150°. n?", "Qavariq beshburchakning to'rtta burchagi 100° dan. Beshinchisi?"] },
      { id: "k8-14", nom: "Parallelogramm, to'g'ri to'rtburchak, romb, kvadrat: xossalari va alomatlari", test: ["t72", "s8m3"], pdf: [1, 14],
        qoida: ["<b>Parallelogramm:</b> qarama-qarshi tomonlar va burchaklar teng, diagonallar kesishish nuqtasida teng ikkiga bo'linadi. Alomatlari: ikki tomoni teng va parallel; qarama-qarshi tomonlari juft-juft teng; diagonallari o'zaro teng bo'linadi.", "<b>To'g'ri to'rtburchak</b> — diagonallari teng; <b>romb</b> — diagonallari perpendikulyar va burchak bissektrisalari; <b>kvadrat</b> — ikkalasining xossalariga ega."],
        misol: [["Parallelogramm perimetri 48 sm, bir tomoni ikkinchisidan 4 sm uzun. Tomonlari?", "2(x + x + 4) = 48 → x = 10; 10 va 14 sm."], ["Romb diagonallari 6 va 8 sm. Tomoni?", "Diagonallar yarmi 3 va 4, to'g'ri burchakli uchburchak → tomon 5 sm."]],
        mashq: ["Parallelogramm burchaklaridan biri 40°. Qolganlari?", "To'g'ri to'rtburchak diagonallari 60° burchak ostida kesishadi, kichik tomoni 5 sm. Diagonali?", "Rombning o'tkir burchagi 60°, tomoni 8. Kichik diagonali?"] },
      { id: "k8-15", nom: "Uchburchak va trapetsiyaning o'rta chizig'i. Trapetsiya", test: ["t72", "t71"], pdf: [1, 27],
        qoida: ["<b>Uchburchak o'rta chizig'i</b> — ikki tomon o'rtalarini tutashtiradi, uchinchi tomonga parallel va uning yarmiga teng.", "<b>Trapetsiya</b> — asoslari parallel. <b>O'rta chizig'i</b> = (a + b)/2 (asoslar yig'indisining yarmi), asoslarga parallel. Teng yonli trapetsiyada asosdagi burchaklar va diagonallar teng."],
        misol: [["Trapetsiya asoslari 7 va 13 sm. O'rta chizig'i?", "(7 + 13)/2 = 10 sm."], ["Uchburchak tomonlari 8, 10, 12. O'rta chiziqlardan hosil bo'lgan uchburchak perimetri?", "(8 + 10 + 12)/2 = 15."]],
        mashq: ["Trapetsiya o'rta chizig'i 9 sm, bir asosi 5 sm. Ikkinchi asosi?", "Teng yonli trapetsiya burchagi 70°. Qolganlari?", "Uchburchakning o'rta chizig'i 6 sm. U parallel bo'lgan tomon?"] },
      { id: "k8-16", nom: "Fales teoremasi. Simmetriya", test: ["t86", "t82"], pdf: [1, 40],
        qoida: ["<b>Fales teoremasi:</b> burchak tomonlarini kesuvchi parallel to'g'ri chiziqlar bir tomonda teng kesmalar ajratsa, ikkinchisida ham teng kesmalar ajratadi. Tatbiqi: kesmani n ta teng bo'lakka bo'lish.", "<b>O'qqa nisbatan simmetriya</b>: nuqta va aksi o'qdan teng masofada, o'qqa perpendikulyar. <b>Markaziy simmetriya</b>: O markaz — kesma o'rtasi. Simmetriya o'qiga ega shakllar (teng yonli uchburchak, romb), markaziy simmetrik shakllar (parallelogramm, aylana)."],
        misol: [["12 sm kesmani 5 teng bo'lakka Fales teoremasi bilan qanday bo'lish mumkin?", "Kesma uchidan ixtiyoriy nur o'tkazib, unga 5 ta teng kesma qo'yamiz; oxirgi nuqtani kesmaning ikkinchi uchiga tutashtirib, qolgan nuqtalardan parallel chiziqlar o'tkazamiz."]],
        mashq: ["Kesmani 3 teng bo'lakka bo'ling (sirkul va chizg'ich).", "Qaysi harflar o'q simmetriyasiga, qaysilari markaziy simmetriyaga ega: H, N, S, T, Z, O?", "A(3; −2) nuqtaning Oy o'qiga va koordinata boshiga nisbatan simmetrik nuqtalari?"] }
    ] },
    { nom: "Geometriya. 2-bob. Yuzlar", mavzular: [
      { id: "k8-17", nom: "Parallelogramm, uchburchak, romb, trapetsiya yuzlari", test: ["t71", "t72", "s8m3"], pdf: [1, 69],
        qoida: ["To'g'ri to'rtburchak S = ab; <b>parallelogramm S = a·h</b>; <b>uchburchak S = ah/2</b>; to'g'ri burchakli uchburchak S = ab/2; <b>romb S = d₁d₂/2</b>; <b>trapetsiya S = (a + b)h/2</b>.", "Tengdosh shakllar — yuzlari teng. Ko'pburchak yuzini uchburchaklarga bo'lib topamiz."],
        misol: [["Trapetsiya asoslari 10 va 16, balandligi 7. Yuzi?", "(10 + 16)·7/2 = 91."], ["Uchburchak tomonlari 13, 14, 15, 14 ga tushirilgan balandlik 12. Yuzi?", "14·12/2 = 84."]],
        mashq: ["Parallelogramm tomoni 12, unga tushirilgan balandlik 5. Yuzi?", "Romb diagonallari 10 va 24. Yuzi va tomoni?", "Teng yonli trapetsiya asoslari 8 va 18, yon tomoni 13. Yuzi? (balandlikni Pifagor bilan toping)"] },
      { id: "k8-18", nom: "Pifagor teoremasi va unga teskari teorema. Geron formulasi", test: ["s8m3", "t71"], pdf: [1, 93],
        qoida: ["<b>c² = a² + b²</b> — gipotenuza kvadrati katetlar kvadratlari yig'indisiga teng. Teskari: a² + b² = c² bo'lsa uchburchak to'g'ri burchakli. Pifagor uchliklari: (3,4,5), (5,12,13), (8,15,17), (7,24,25).", "<b>Geron formulasi:</b> S = √(p(p − a)(p − b)(p − c)), p = (a + b + c)/2. Tomonlariga ko'ra balandlik: h = 2S/a."],
        misol: [["Katetlar 9 va 12. Gipotenuza?", "√(81 + 144) = √225 = 15."], ["Tomonlari 7, 8, 9. Yuzi (Geron)?", "p = 12; S = √(12·5·4·3) = √720 = 12√5."]],
        mashq: ["Gipotenuza 26, katet 10. Ikkinchi katet?", "Tomonlari 6, 8, 10 uchburchak to'g'ri burchaklimi? 5, 6, 8-chi?", "Tomonlari 13, 14, 15 uchburchakning yuzi va 14 ga tushirilgan balandligi?", "Teng yonli uchburchak asosi 16, yon tomoni 17. Balandligi va yuzi?"] }
    ] },
    { nom: "Geometriya. 3-bob. Aylana", mavzular: [
      { id: "k8-19", nom: "Markaziy va ichki chizilgan burchaklar. Vatar, diametr, urinma", test: ["t73"], pdf: [1, 107],
        qoida: ["<b>Markaziy burchak</b> yoyning gradus o'lchoviga teng. <b>Ichki chizilgan burchak</b> tayangan yoyning yarmiga teng; diametrga tayangan burchak 90°; bir yoyga tayangan ichki burchaklar teng.", "Diametr vatarga perpendikulyar bo'lsa, uni teng ikkiga bo'ladi. <b>Urinma</b> radiusga perpendikulyar; bir nuqtadan o'tkazilgan ikki urinma kesmalari teng."],
        misol: [["Ichki chizilgan burchak 35°. Tayangan yoyi va markaziy burchak?", "70° va 70°."], ["Radiusi 10, vatar 16. Markazdan vatargacha masofa?", "Yarim vatar 8; √(100 − 64) = 6."]],
        mashq: ["Yoy 140°. Unga tayangan ichki chizilgan burchak?", "Uchburchak aylanaga ichki chizilgan, bir tomoni diametr, bir burchagi 50°. Qolgan burchaklari?", "Tashqi nuqtadan aylanaga urinmalar 60° burchak ostida o'tkazilgan, radius 6. Nuqtadan markazgacha masofa?"] },
      { id: "k8-20", nom: "Uchburchakka ichki va tashqi chizilgan aylana", test: ["t80"], pdf: [1, 118],
        qoida: ["<b>Ichki chizilgan aylana</b> markazi — bissektrisalar kesishmasi; r = S/p (p — yarim perimetr). To'g'ri burchakli uchburchakda r = (a + b − c)/2.", "<b>Tashqi chizilgan aylana</b> markazi — tomonlar o'rta perpendikulyarlari kesishmasi; R = abc/(4S). To'g'ri burchakli uchburchakda R = c/2 (gipotenuzaning yarmi). To'rtburchakka aylana ichki chizilsa a + c = b + d; tashqi chizilsa qarama-qarshi burchaklar yig'indisi 180°."],
        misol: [["Katetlari 6 va 8. r va R?", "c = 10; r = (6 + 8 − 10)/2 = 2; R = 5."]],
        mashq: ["Teng tomonli uchburchak tomoni 6. r va R? (r = a√3/6, R = a√3/3)", "Tomonlari 5, 12, 13. r va R?", "Aylanaga tashqi chizilgan to'rtburchak tomonlari 4, 7, 9. To'rtinchi tomoni?"] }
    ] },
    { nom: "Geometriya. 4-bob. Vektorlar", mavzular: [
      { id: "k8-21", nom: "Vektor tushunchasi. Vektorlarni qo'shish, ayirish, songa ko'paytirish", test: ["t83"], pdf: [1, 129],
        qoida: ["<b>Vektor</b> — yo'nalishga ega kesma; uzunligi (moduli) |a⃗|. Teng vektorlar — bir yo'nalishli va teng uzunlikli; kollinear — parallel.", "Qo'shish: uchburchak qoidasi (AB⃗ + BC⃗ = AC⃗) va parallelogramm qoidasi. Ayirish: a⃗ − b⃗ = a⃗ + (−b⃗). Songa ko'paytirish: k·a⃗ — uzunligi |k|·|a⃗|, k < 0 da yo'nalish teskari."],
        misol: [["ABCD parallelogrammda AB⃗ + AD⃗ va AB⃗ − AD⃗ ni toping.", "AC⃗ (diagonal) va DB⃗."]],
        mashq: ["ABC uchburchakda AB⃗ + BC⃗ + CA⃗ = ?", "a⃗ va b⃗ berilgan. 2a⃗ − b⃗ ni yasang.", "M — AB o'rtasi. OM⃗ ni OA⃗ va OB⃗ orqali ifodalang."] },
      { id: "k8-22", nom: "Vektor koordinatalari. Skalyar ko'paytma", test: ["t83", "t84"], pdf: [1, 142],
        qoida: ["A(x₁; y₁), B(x₂; y₂) → <b>AB⃗ = (x₂ − x₁; y₂ − y₁)</b>; |AB⃗| = √((x₂ − x₁)² + (y₂ − y₁)²). Koordinatalarda qo'shish, ayirish, songa ko'paytirish koordinatalar bo'yicha bajariladi.", "<b>Skalyar ko'paytma</b> a⃗·b⃗ = |a⃗||b⃗|cos φ = x₁x₂ + y₁y₂. a⃗ ⊥ b⃗ ⇔ a⃗·b⃗ = 0. cos φ = (x₁x₂ + y₁y₂)/(|a⃗||b⃗|)."],
        misol: [["a⃗(3; 4), b⃗(−4; 3). |a⃗|, a⃗·b⃗ va burchak?", "|a⃗| = 5; a⃗·b⃗ = −12 + 12 = 0 → perpendikulyar, 90°."], ["A(1; 2), B(4; 6). AB⃗ va |AB⃗|?", "(3; 4); 5."]],
        mashq: ["a⃗(2; −1), b⃗(−3; 5). a⃗ + b⃗, a⃗ − 2b⃗, a⃗·b⃗ ni toping.", "A(−2; 1), B(3; 1), C(3; 5). Uchburchak to'g'ri burchaklimi? Perimetri?", "a⃗(6; 8) va b⃗(x; −3) perpendikulyar. x?"] }
    ] }
  ]
};
