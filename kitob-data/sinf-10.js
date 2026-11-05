/* Kuvonch Academy — Elektron kitob, 10-sinf: Algebra 10 va Geometriya 10 mundarijalari asosida.
   Har bir mavzu saytning asosiy 1–50 mavzulariga (mashqlar.html#t…) bog'langan — u yerda to'liq tushuntirish, yechilgan misollar va 3 darajali testlar bor. */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[10] = {
  sinf: 10, nom: "Algebra va Geometriya", bosqich: "O'rta ta'lim",
  kirish: "Algebra 10: kvadrat funksiya va kvadrat tengsizlik, progressiyalar, trigonometrik ayniyatlar, funksiyalar, ratsional va irratsional tenglamalar, ko'rsatkichli va logarifmik funksiyalar, trigonometrik funksiyalar va tenglamalar, ehtimollik. Geometriya 10: planimetriyaning mantiqiy tuzilishi, stereometriya asoslari, ko'pyoqlar, fazoda to'g'ri chiziq va tekisliklar, perpendikulyarlik. Bu sinf saytning asosiy 1–50 mavzulariga to'liq mos keladi.",
  pdf: [
    { nom: "Algebra 10", url: "https://static.oliygoh.uz/uploads/darsliklar/10/algebra-10-sinf-uz.pdf" },
    { nom: "Geometriya 10", url: "https://static.oliygoh.uz/uploads/darsliklar/10/geometriya-10-sinf-uz.pdf" },
    { nom: "Algebra va analiz asoslari, geometriya (1-qism)", url: "https://static.oliygoh.uz/uploads/darsliklar/10/algebra-va-analiz-asoslari-geometriya-10-sinf-uz.pdf" }
  ],
  boblar: [
    { nom: "Algebra. 1-bob. Kvadrat funksiya, tengsizlik, trigonometrik ayniyatlar, progressiyalar", mavzular: [
      { id: "k10-1", nom: "Kvadrat funksiya va uning grafigi", test: ["t1"], mavzu: "t1", pdf: [0, 6],
        qoida: ["y = ax² + bx + c (a ≠ 0) funksiyaning grafigi — parabola. a > 0 da tarmoqlari yuqoriga, a < 0 da pastga yo'nalgan. Uchi: x₀ = −b/(2a), y₀ = y(x₀). Simmetriya o'qi: x = x₀.", "Nollari — ax² + bx + c = 0 tenglamaning ildizlari (D = b² − 4ac). y = a(x − m)² + n ko'rinishda parabolaning uchi — (m; n)."],
        misol: [["y = x² − 4x + 3 parabolaning uchini va nollarini toping.", "x₀ = 2, y₀ = 4 − 8 + 3 = −1 → uchi (2; −1); nollari x = 1 va x = 3."]],
        mashq: ["y = −2x² + 8x − 5 funksiya grafigining uchini, simmetriya o'qini va funksiyaning eng katta qiymatini toping.", "y = x² + 6x + 5 grafigini chizing va nollarini toping."] },
      { id: "k10-2", nom: "Kvadrat tengsizlik va uning yechimi", test: ["t2"], mavzu: "t2", pdf: [0, 9],
        qoida: ["ax² + bx + c > 0 (<, ≥, ≤) tengsizlikni yechish: kvadrat uchhadning ildizlarini topamiz, parabolaning eskizini chizamiz va ifoda kerakli ishorani qabul qiladigan oraliqlarni olamiz.", "D < 0 bo'lsa, a > 0 da ifoda barcha x da musbat, a < 0 da barcha x da manfiy."],
        misol: [["x² − 5x + 6 < 0", "Ildizlari 2 va 3; a > 0, demak, ifoda ildizlar orasida manfiy. Javob: x ∈ (2; 3)."]],
        mashq: ["Yeching: x² − x − 12 ≥ 0; −x² + 4x > 0; x² + 2x + 5 > 0.", "x ning qanday qiymatlarida y = x² − 9 funksiya manfiy qiymatlar qabul qiladi?"] },
      { id: "k10-3", nom: "Trigonometrik ayniyatlar", test: ["t3", "t68"], mavzu: "t3", pdf: [0, 14],
        qoida: ["sin²α + cos²α = 1, tg α = sin α / cos α, tg α · ctg α = 1, 1 + tg²α = 1/cos²α.", "Qo'shish formulalari: sin(α ± β) = sin α cos β ± cos α sin β, cos(α ± β) = cos α cos β ∓ sin α sin β. Ikkilangan burchak formulalari: sin 2α = 2 sin α cos α, cos 2α = cos²α − sin²α."],
        misol: [["sin α = 3/5, α — I chorak burchagi. cos α va tg α ni toping.", "cos α = √(1 − 9/25) = 4/5; tg α = 3/4."], ["sin α = 3/5, cos α = 4/5 bo'lsa, sin 2α ni toping.", "sin 2α = 2 · 3/5 · 4/5 = 24/25."]],
        mashq: ["cos α = −5/13, α — II chorak burchagi. sin α va tg α ni toping.", "Soddalashtiring: (1 − cos²α)/sin α; sin 4α/sin 2α.", "cos 75° ni qo'shish formulasi bilan hisoblang."] },
      { id: "k10-4", nom: "Arifmetik va geometrik progressiyalar", test: ["t4", "t54", "t55"], mavzu: "t4", pdf: [0, 20],
        qoida: ["Arifmetik progressiya: aₙ = a₁ + (n − 1)d, Sₙ = (a₁ + aₙ)·n/2 = (2a₁ + (n − 1)d)·n/2.", "Geometrik progressiya: bₙ = b₁·qⁿ⁻¹, Sₙ = b₁(qⁿ − 1)/(q − 1) (q ≠ 1); |q| < 1 bo'lganda cheksiz kamayuvchi geometrik progressiyaning yig'indisi S = b₁/(1 − q)."],
        misol: [["a₁ = 5, d = 3. S₂₀ = ?", "a₂₀ = 5 + 19·3 = 62; S₂₀ = (5 + 62)·20/2 = 670."], ["b₁ = 2, q = 3. b₅ ni toping.", "b₅ = 2 · 3⁴ = 162."]],
        mashq: ["a₃ = 10, a₇ = 22. a₁, d va S₁₀ ni toping.", "b₂ = 6, b₄ = 54 (q > 0). b₁ va S₅ ni toping.", "1 + 1/2 + 1/4 + … cheksiz kamayuvchi geometrik progressiyaning yig'indisini toping."] }
    ] },
    { nom: "Algebra. 2-bob. Funksiyalar", mavzular: [
      { id: "k10-5", nom: "Funksiya tushunchasi. Berilish usullari, aniqlanish sohasi va qiymatlar to'plami", test: ["t5", "t65"], mavzu: "t5", pdf: [0, 24],
        qoida: ["Funksiya — har bir x ga yagona y qiymatni mos qo'yuvchi qoida; u formula, jadval, grafik yoki so'zlar bilan beriladi. D(f) — aniqlanish sohasi, E(f) — qiymatlar sohasi (to'plami).", "D(f) ni topishda: maxraj ≠ 0, juft darajali ildiz ostidagi ifoda ≥ 0, logarifm belgisi ostidagi ifoda > 0."],
        misol: [["y = √(x − 2)/(x − 5) funksiyaning aniqlanish sohasini toping.", "x − 2 ≥ 0 va x ≠ 5 → D(f) = [2; 5) ∪ (5; +∞)."], ["y = x² + 1 funksiyaning qiymatlar sohasini toping.", "x² ≥ 0 → y ≥ 1, E(f) = [1; +∞)."]],
        mashq: ["Aniqlanish sohasini toping: y = 1/(x² − 4); y = √(3 − x); y = lg(x + 1).", "Qiymatlar sohasini toping: y = −x² + 4; y = |x| − 2; y = 3 + √x."] },
      { id: "k10-6", nom: "Funksiya xossalari. Murakkab, teskari, davriy funksiyalar", test: ["t6"], mavzu: "t6", pdf: [0, 32],
        qoida: ["Juft funksiya: f(−x) = f(x) (grafigi Oy o'qiga nisbatan simmetrik), toq funksiya: f(−x) = −f(x) (grafigi koordinatalar boshiga nisbatan simmetrik); bunda D(f) koordinatalar boshiga nisbatan simmetrik bo'lishi kerak. Boshqa xossalar: o'suvchi/kamayuvchi, nollari, ishorasi saqlanadigan oraliqlar.", "Murakkab funksiya: f(g(x)); o'zaro teskari funksiyalarning grafiklari y = x to'g'ri chiziqqa nisbatan simmetrik; davriy funksiya: f(x + T) = f(x) (T ≠ 0)."],
        misol: [["y = x³ − x funksiya juftmi yoki toqmi?", "D(f) = ℝ; f(−x) = −x³ + x = −f(x), demak, funksiya toq."], ["f(x) = 2x + 1, g(x) = x². f(g(x)) va g(f(x)) ni toping.", "f(g(x)) = 2x² + 1; g(f(x)) = (2x + 1)²."]],
        mashq: ["Funksiyaning juft yoki toqligini aniqlang: y = x⁴ − 3x²; y = x + 1/x; y = x² + x.", "y = 3x − 6 ga teskari funksiyani toping.", "y = x² − 4x funksiyaning o'sish va kamayish oraliqlarini toping."] },
      { id: "k10-7", nom: "Funksiya grafigi ustida sodda almashtirishlar", test: ["t7"], mavzu: "t7", pdf: [0, 47],
        qoida: ["y = f(x) + b — grafikni b birlik yuqoriga (b > 0), y = f(x − a) — a birlik o'ngga (a > 0) siljitish. y = −f(x) — Ox o'qiga nisbatan, y = f(−x) — Oy o'qiga nisbatan simmetrik akslantirish.", "k > 1 bo'lsa, y = k·f(x) — Oy o'qi bo'ylab k marta cho'zish, y = f(kx) — Ox o'qi bo'ylab k marta siqish; 0 < k < 1 bo'lsa, aksincha, mos ravishda 1/k marta siqish va 1/k marta cho'zish. y = |f(x)| va y = f(|x|) grafiklari ham y = f(x) grafigidan hosil qilinadi."],
        misol: [["y = (x + 3)² − 2 funksiyaning grafigi y = x² grafigidan qanday hosil bo'ladi?", "y = x² parabolani 3 birlik chapga va 2 birlik pastga siljitib hosil qilinadi; uchi (−3; −2)."]],
        mashq: ["y = √x grafigidan y = √(x − 1) + 2, y = −√x, y = 2√x grafiklari qanday hosil bo'lishini tushuntiring.", "y = |x² − 4| grafigini chizing."] },
      { id: "k10-8", nom: "Chiziqli va kvadratik modellashtirish. Loyiha ishi", test: ["t8", "t9"], mavzu: "t8", pdf: [0, 55],
        qoida: ["Chiziqli model y = kx + b: k — o'zgarish tezligi (narx, tezlik), b — boshlang'ich qiymat. Kvadratik modelda eng katta yoki eng kichik qiymatga parabolaning uchida erishiladi.", "Real jarayonni funksiya orqali ifodalash bosqichlari: o'zgaruvchilarni belgilash, ular orasidagi bog'lanishni yozish, modelni tekshirish."],
        misol: [["Taksi narxi: 10 000 so'm va har bir km uchun 3 000 so'm. 12 km yo'l necha so'm turadi?", "y = 3 000x + 10 000; y(12) = 46 000 so'm."], ["Perimetri 40 m bo'lgan to'g'ri to'rtburchakning eng katta yuzini toping.", "S = x(20 − x); parabolaning uchi x = 10 da: S = 100 m² (kvadrat)."]],
        mashq: ["Idishda dastlab 5 l suv bor, unga har minutda 2 l suv quyiladi. Suv hajmining vaqtga bog'liqlik funksiyasini yozing va 8 minutdan keyingi hajmni toping.", "Yuqoriga otilgan toshning balandligi h = 20t − 5t² (m) qonun bo'yicha o'zgaradi. Toshning eng katta balandligini va yerga tushish vaqtini toping."] }
    ] },
    { nom: "Algebra. 3-bob. Ratsional va irratsional tenglamalar", mavzular: [
      { id: "k10-9", nom: "Ratsional tenglamalar va ularning sistemasi", test: ["t10", "t11", "t14"], mavzu: "t10", pdf: [0, 61],
        qoida: ["Kasr-ratsional tenglama: aniqlanish sohasi (maxraj ≠ 0) → umumiy maxrajga keltirib, suratni nolga tenglash → ildizlarni aniqlanish sohasi bo'yicha tekshirish.", "Sistemalar o'rniga qo'yish yoki qo'shish usuli bilan yechiladi; yechim aniqlanish sohasiga tegishli bo'lishi shart."],
        misol: [["(x + 3)/(x − 1) = 2", "x ≠ 1; x + 3 = 2x − 2 → x = 5."], ["1/x + 1/(x + 2) = 3/4 (x > 0)", "4(x + 2) + 4x = 3x(x + 2) → 3x² − 2x − 8 = 0 → x = 2 (x = −4/3 — x > 0 shartni qanoatlantirmaydi)."]],
        mashq: ["Yeching: (2x − 1)/(x + 2) = 3; x/(x − 3) + 1 = 6/(x − 3).", "Sistemani yeching: { x + y = 7; 1/x + 1/y = 7/12 }."] },
      { id: "k10-10", nom: "Ratsional tengsizliklar va ularning sistemasi", test: ["t12", "t13"], mavzu: "t12", pdf: [0, 74],
        qoida: ["Intervallar usuli: barcha hadlarni bir tomonga o'tkazish, ko'paytuvchilarga ajratish, surat va maxraj nollarini son o'qiga qo'yish, oraliqlardagi ishoralarni aniqlash. Maxraj nollari har doim yechimga kirmaydi (bo'yalmagan nuqta).", "Tengsizliklar sistemasida har bir tengsizlikni alohida yechib, yechimlar kesishmasini olamiz."],
        misol: [["(x − 1)(x + 2)/(x − 4) ≤ 0", "Nollari −2, 1, 4 (x = 4 — maxraj noli); ishoralar chapdan o'ngga: −, +, −, +. Javob: (−∞; −2] ∪ [1; 4)."]],
        mashq: ["Yeching: (x + 5)/(x − 2) > 0; (x² − 9)/(x + 1) ≤ 0.", "Sistemani yeching: { x² − 4 < 0; (x + 1)/x ≥ 0 }."] },
      { id: "k10-11", nom: "Irratsional tenglamalar va sistemalari", test: ["t15", "t16", "t17", "t18"], mavzu: "t15", pdf: [0, 81],
        qoida: ["√f(x) = g(x) ⇔ g(x) ≥ 0 va f(x) = g²(x). Kvadratga ko'tarishdan keyin ildizlarni albatta tekshiramiz (chet ildizlar paydo bo'lishi mumkin).", "Ikkita ildiz qatnashgan tenglamada ildizlardan birini yakkalab, kvadratga ko'taramiz; ba'zan √f = t almashtirish qulay."],
        misol: [["√(2x + 3) = x", "x ≥ 0; 2x + 3 = x² → x² − 2x − 3 = 0 → x = 3 (x = −1 — chet ildiz)."], ["√(x + 4) − √(x − 1) = 1", "√(x + 4) = 1 + √(x − 1) → x + 4 = 1 + 2√(x − 1) + x − 1 → √(x − 1) = 2 → x = 5."]],
        mashq: ["Yeching: √(x − 2) = x − 4; √(3x + 1) = x − 1; √(x + 7) + √x = 7.", "Sistemani yeching: { √x + √y = 5; x − y = 5 }."] }
    ] },
    { nom: "Algebra. 4-bob. Ko'rsatkichli va logarifmik funksiyalar", mavzular: [
      { id: "k10-12", nom: "Ko'rsatkichli funksiya, tenglamalar va tengsizliklar", test: ["t19", "t22", "t25"], mavzu: "t19", pdf: [0, 95],
        qoida: ["y = aˣ (a > 0, a ≠ 1): D = ℝ, E = (0; +∞); a > 1 da o'suvchi, 0 < a < 1 da kamayuvchi; grafigi (0; 1) nuqtadan o'tadi.", "aᶠ⁽ˣ⁾ = aᵍ⁽ˣ⁾ ⇔ f(x) = g(x). Ko'pincha aˣ = t (t > 0) almashtirish qo'llanadi. Tengsizliklarda: a > 1 bo'lsa, tengsizlik belgisi saqlanadi, 0 < a < 1 bo'lsa, qarama-qarshisiga o'zgaradi."],
        misol: [["2ˣ⁺¹ = 32", "2ˣ⁺¹ = 2⁵ → x = 4."], ["(1/3)ˣ > 9", "(1/3)ˣ > (1/3)⁻²; asos 1/3 < 1, shuning uchun belgi o'zgaradi: x < −2."], ["4ˣ − 5·2ˣ + 4 = 0", "t = 2ˣ (t > 0): t² − 5t + 4 = 0 → t = 1, t = 4 → x = 0, x = 2."]],
        mashq: ["Yeching: 3ˣ⁻² = 81; 5²ˣ = 1/25; 2ˣ + 2ˣ⁺² = 40.", "Tengsizliklarni yeching: 2ˣ ≤ 16; (0,5)ˣ ≥ 4; 9ˣ − 4·3ˣ + 3 < 0."] },
      { id: "k10-13", nom: "Logarifm tushunchasi. Logarifmik funksiya. Ayniy almashtirishlar", test: ["t20", "t21", "t28", "t67"], mavzu: "t20", pdf: [0, 104],
        qoida: ["logₐ b = c ⇔ aᶜ = b (a > 0, a ≠ 1, b > 0). x > 0, y > 0 da: logₐ(xy) = logₐ x + logₐ y, logₐ(x/y) = logₐ x − logₐ y, logₐ xᵖ = p·logₐ x; yangi asosga o'tish: logₐ b = logₖ b / logₖ a (k > 0, k ≠ 1).", "y = logₐ x: D = (0; +∞), E = ℝ, grafigi (1; 0) nuqtadan o'tadi; a > 1 da o'suvchi, 0 < a < 1 da kamayuvchi. U y = aˣ funksiyaga teskari funksiya."],
        misol: [["log₂ 32 + log₃ (1/9) = ?", "log₂ 32 = 5, log₃ (1/9) = −2; 5 + (−2) = 3."], ["lg 50 + lg 2 = ?", "lg 50 + lg 2 = lg 100 = 2."], ["log₂ 5 = a bo'lsa, log₂ 20 ni a orqali ifodalang.", "log₂ 20 = log₂ 4 + log₂ 5 = 2 + a."]],
        mashq: ["Hisoblang: log₅ 125; log₄ 2; log₀,₅ 8; 2^(log₂ 7).", "Hisoblang: log₃ 54 − log₃ 2; (lg 8)/(lg 2); log₆ 2 + log₆ 3.", "y = log₂(x² − 1) funksiyaning aniqlanish sohasini toping."] },
      { id: "k10-14", nom: "Logarifmik tenglamalar, tengsizliklar va sistemalar", test: ["t23", "t24", "t26"], mavzu: "t23", pdf: [0, 116],
        qoida: ["logₐ f(x) = logₐ g(x) ⇔ f(x) = g(x) > 0 (aniqlanish sohasini hisobga olamiz!). logₐ f(x) = b ⇔ f(x) = aᵇ.", "Tengsizliklar: a > 1 da logₐ f > logₐ g ⇔ f > g > 0; 0 < a < 1 da tengsizlik belgisi qarama-qarshisiga o'zgaradi (f va g musbat bo'lishi shart). Yechimni aniqlanish sohasi bilan albatta kesishtiramiz."],
        misol: [["log₃(2x − 1) = 2", "2x − 1 = 9 → x = 5 (aniqlanish sohasi: x > 1/2 ✓)."], ["log₂(x − 3) < 3", "0 < x − 3 < 8 → 3 < x < 11."]],
        mashq: ["Yeching: log₂(x + 6) = 4; lg x + lg(x − 3) = 1; log₅(x² − 4) = log₅ 3x.", "Tengsizliklarni yeching: log₁/₂(x − 1) > −2; log₃(2x + 1) ≥ 2.", "Sistemani yeching: { log₂ x + log₂ y = 3; x − y = 2 }."] },
      { id: "k10-15", nom: "Ko'rsatkichli va logarifmik funksiyalarning tatbiqi (modellashtirish)", test: ["t27"], mavzu: "t27", pdf: [0, 127],
        qoida: ["Ko'rsatkichli o'sish va kamayish: N = N₀·(1 + p/100)ᵗ (murakkab foizlar), N = N₀·2^(t/T) (T — ikkilanish davri), N = N₀·(1/2)^(t/T) (T — yarim yemirilish davri).", "Vaqtni topishda logarifmdan foydalaniladi, masalan, ikkilanishda: t = T·log₂(N/N₀)."],
        misol: [["Omonatga 10 mln so'm yillik 20% murakkab foiz bilan qo'yildi. 3 yildan keyin omonat qancha bo'ladi?", "10·1,2³ = 17,28 mln so'm."], ["Bakteriyalar soni har 3 soatda 2 marta ortadi. 100 ta bakteriyadan 12 soatda nechta bo'ladi?", "12 : 3 = 4; 100·2⁴ = 1 600."]],
        mashq: ["Avtomobil narxi har yili 15% ga kamayadi. 50 mln so'mlik avtomobil 4 yildan keyin qancha turadi?", "Moddaning yarim yemirilish davri 8 kun. 64 g moddadan 24 kundan keyin qancha qoladi?", "Aholi soni har yili 2% ga ortadi. Necha yilda aholi soni 2 marta ko'payadi? (t = lg 2 / lg 1,02 ni hisoblang.)"] }
    ] },
    { nom: "Algebra. 5-bob. Trigonometrik funksiyalar va tenglamalar", mavzular: [
      { id: "k10-16", nom: "Trigonometrik funksiyalar. Davriy jarayonlar. Teskari trigonometrik funksiyalar", test: ["t29", "t30", "t31", "t32"], mavzu: "t29", pdf: [0, 133],
        qoida: ["y = sin x, y = cos x: D = ℝ, E = [−1; 1], T = 2π; y = tg x: x ≠ π/2 + πn (n ∈ ℤ), T = π. sin x — toq, cos x — juft funksiya. y = A sin(ωx + φ) (A > 0, ω > 0): amplitudasi A, davri T = 2π/ω.", "arcsin a ∈ [−π/2; π/2], arccos a ∈ [0; π] (|a| ≤ 1), arctg a ∈ (−π/2; π/2); arcsin(−a) = −arcsin a, arccos(−a) = π − arccos a."],
        misol: [["y = 3 sin 2x funksiyaning amplitudasini, davrini va qiymatlar sohasini toping.", "A = 3, T = 2π/2 = π, E(f) = [−3; 3]."], ["arccos(−1/2) = ?", "arccos(−1/2) = π − arccos(1/2) = π − π/3 = 2π/3."]],
        mashq: ["Hisoblang: arcsin(√3/2); arctg(−1); arccos 0 + arcsin 1.", "y = 2 cos(x/2) funksiyaning davrini toping va grafigini chizing.", "Mayatnikning og'ishi h = 5 cos(πt) qonun bo'yicha o'zgaradi. Tebranish davrini va eng katta og'ishni toping."] },
      { id: "k10-17", nom: "Trigonometrik tenglamalar va ularni yechish usullari", test: ["t33", "t34", "t35", "t69"], mavzu: "t33", pdf: [0, 148],
        qoida: ["sin x = a (|a| ≤ 1): x = (−1)ⁿ arcsin a + πn; cos x = a (|a| ≤ 1): x = ±arccos a + 2πn; tg x = a: x = arctg a + πn (n ∈ ℤ). |a| > 1 da sin x = a va cos x = a tenglamalar yechimga ega emas.", "Yechish usullari: yangi o'zgaruvchi kiritish (sin x = t), ko'paytuvchilarga ajratish, bir jinsli tenglamani cos x ga bo'lish (cos x ≠ 0 bo'lganda), ayniyatlar yordamida soddalashtirish."],
        misol: [["2 sin x − 1 = 0", "sin x = 1/2 → x = (−1)ⁿ π/6 + πn, n ∈ ℤ."], ["2 cos²x − cos x − 1 = 0", "t = cos x: 2t² − t − 1 = 0 → t = 1 yoki t = −1/2 → x = 2πn; x = ±2π/3 + 2πn, n ∈ ℤ."]],
        mashq: ["Yeching: cos 2x = √2/2; tg(x − π/4) = √3; sin²x = 1/4.", "Yeching: sin x cos x = 1/4; 2 sin²x + 3 sin x − 2 = 0; sin x + √3 cos x = 0.", "sin x = −1/2 tenglamaning [0; 2π] kesmadagi ildizlarini toping."] },
      { id: "k10-18", nom: "Trigonometrik tengsizliklar", test: ["t36"], mavzu: "t36", pdf: [0, 157],
        qoida: ["Tengsizliklar birlik aylana yoki grafik yordamida yechiladi: sin x > a — birlik aylananing ordinatasi a dan katta bo'lgan nuqtalari yoyi, cos x > a — abssissasi a dan katta bo'lgan nuqtalari yoyi; javobga davr qo'shiladi: + 2πn, n ∈ ℤ.", "tg x > a: x ∈ (arctg a + πn; π/2 + πn), n ∈ ℤ."],
        misol: [["sin x > 1/2", "π/6 + 2πn < x < 5π/6 + 2πn."], ["cos x ≤ −√2/2", "3π/4 + 2πn ≤ x ≤ 5π/4 + 2πn."]],
        mashq: ["Yeching: cos x > 1/2; sin x ≤ −√3/2; tg x < 1.", "Yeching: 2 sin x + 1 ≥ 0; cos 2x < 0."] }
    ] },
    { nom: "Algebra. 6-bob. Ehtimollik", mavzular: [
      { id: "k10-19", nom: "Tasodifiy hodisalar. Ehtimollik ta'riflari. Teng ehtimolli hodisalar", test: ["t37", "t39", "t92", "t93"], mavzu: "t37", pdf: [0, 165],
        qoida: ["Muqarrar hodisa (P = 1), mumkin bo'lmagan hodisa (P = 0), tasodifiy hodisa (0 < P < 1). Klassik ta'rif: P(A) = m/n, bu yerda m — qulay hollar soni, n — barcha teng imkoniyatli hollar soni.", "Statistik ta'rif: nisbiy chastota W = m/n sinovlar soni n katta bo'lganda ehtimollikka yaqinlashadi. Qarama-qarshi hodisa: P(Ā) = 1 − P(A). Birgalikda bo'lmagan hodisalar: P(A + B) = P(A) + P(B)."],
        misol: [["Ikkita o'yin soqqasi tashlanganda tushgan ochkolar yig'indisi 7 ga teng bo'lish ehtimolini toping.", "Qulay hollar: (1; 6), (2; 5), (3; 4), (4; 3), (5; 2), (6; 1) — m = 6; n = 36 → P = 6/36 = 1/6."], ["36 talik karta dastasidan tasodifan bitta karta olindi. Uning tuz bo'lmaslik ehtimolini toping.", "P = 1 − 4/36 = 8/9."]],
        mashq: ["Tanga 3 marta tashlanadi. Rosa 2 marta gerb tushish ehtimolini toping.", "Qutida 5 ta oq va 3 ta qora shar bor. Tasodifan 2 ta shar olinganda ikkalasi ham oq bo'lish ehtimolini toping.", "Lotereyadagi 100 ta chiptadan 5 tasi yutuqli. Sotib olingan bitta chiptaning yutuqsiz bo'lish ehtimolini toping."] },
      { id: "k10-20", nom: "Ehtimollikni hisoblashda kombinatorika formulalaridan foydalanish", test: ["t38", "t91"], mavzu: "t38", pdf: [0, 168],
        qoida: ["O'rin almashtirish Pₙ = n!, o'rinlashtirish Aₙᵏ = n!/(n − k)!, guruhlash Cₙᵏ = n!/(k!(n − k)!).", "n ta buyumdan m tasi belgilangan bo'lsa, tasodifan olingan r tasidan rosa k tasi belgilangan bo'lish ehtimoli: P = Cₘᵏ·C_{n−m}^{r−k} / Cₙʳ."],
        misol: [["7 ta kitobdan 3 tasini necha usulda tanlash mumkin?", "C₇³ = 35."], ["6 ta oq va 4 ta qora shardan tasodifan 2 tasi olindi. Ikkalasi ham oq bo'lish ehtimolini toping.", "C₆²/C₁₀² = 15/45 = 1/3."]],
        mashq: ["5 ta turli harfdan (harflarni takrorlamasdan) nechta 3 harfli «so'z» tuzish mumkin?", "8 kishidan 3 kishilik komissiyani necha usulda tuzish mumkin?", "10 ta lampadan 2 tasi nosoz. Tasodifan olingan 3 ta lampaning hammasi soz bo'lish ehtimolini toping."] }
    ] },
    { nom: "Geometriya 10. 1-bob. Planimetriyaning mantiqiy tuzilishi", mavzular: [
      { id: "k10-21", nom: "Geometriyaning mantiqiy tuzilishi. Geometrik masalalar va ularni yechish usullari", test: ["t40", "t41"], mavzu: "t40", pdf: [1, 8],
        qoida: ["Asosiy tushunchalar (nuqta, to'g'ri chiziq, tekislik) → aksiomalar → ta'riflar → teoremalar (shart, xulosa, isbot). Teskari teorema, zarur va yetarli shart.", "Yechish usullari: algebraik (tenglama), sintetik (teoremalar zanjiri), koordinatalar va vektorlar usuli, yuzlar usuli, qo'shimcha yasashlar."],
        misol: [["«Vertikal burchaklar teng» teoremasining sharti va xulosasini ayting.", "Shart: burchaklar vertikal; xulosa: ular teng."], ["Uchburchakning tomonlari 13, 14, 15. Geron formulasi yordamida uning yuzini toping.", "p = 21; S = √(21·8·7·6) = 84."]],
        mashq: ["Pifagor teoremasiga teskari teoremani ifodalang; u to'g'rimi?", "Teng yonli uchburchakda asosga tushirilgan balandlik mediana ham bo'lishini isbotlang.", "Yuzlar usuli bilan tomonlari 10, 10, 12 bo'lgan uchburchakning 10 ga teng tomoniga tushirilgan balandligini toping."] }
    ] },
    { nom: "Geometriya 10. 2-bob. Stereometriya asoslari va ko'pyoqlar", mavzular: [
      { id: "k10-22", nom: "Stereometriyaning asosiy tushunchalari. Fazoda to'g'ri chiziqlar va tekisliklar", test: ["t42", "t43"], mavzu: "t42", pdf: [1, 32],
        qoida: ["Stereometriya aksiomalari: bir to'g'ri chiziqda yotmagan 3 nuqta orqali yagona tekislik o'tadi; to'g'ri chiziqning ikki nuqtasi tekislikda yotsa, to'g'ri chiziqning o'zi ham shu tekislikda yotadi; ikki turli tekislik umumiy nuqtaga ega bo'lsa, ular shu nuqtadan o'tuvchi to'g'ri chiziq bo'yicha kesishadi.", "Tekislik yagona ravishda aniqlanadi: to'g'ri chiziq va unda yotmagan nuqta orqali; ikkita kesishuvchi yoki ikkita parallel to'g'ri chiziq orqali."],
        misol: [["Nima uchun uch oyoqli stol qimirlamaydi?", "Bir to'g'ri chiziqda yotmagan 3 nuqta orqali yagona tekislik o'tadi — oyoqlarning uchlari doim bitta tekislikda yotadi."]],
        mashq: ["4 nuqta orqali nechta tekislik o'tishi mumkin? Barcha hollarni ko'rib chiqing.", "Kubning ABCD va A₁B₁C₁D₁ tekisliklari qanday joylashgan? AB va B₁C₁ to'g'ri chiziqlari-chi?"] },
      { id: "k10-23", nom: "Fazoviy geometrik shakllar. Ko'pyoqlar, ularni tasvirlash va modelini yasash. Sodda kesimlar", test: ["t44", "t45", "t75", "t76"], mavzu: "t44", pdf: [1, 44],
        qoida: ["Ko'pyoq — sirti chekli sondagi ko'pburchaklardan (yoqlardan) iborat jism; uchlari soni V, qirralari soni E, yoqlari soni F. Qavariq ko'pyoq uchun Eyler teoremasi: V − E + F = 2. Prizma, parallelepiped, kub, piramida, tetraedr; muntazam ko'pyoqlarning 5 turi bor.", "Fazoviy shakllar parallel proyeksiyalash qoidalari asosida tasvirlanadi (parallel qirralar parallel bo'lib tasvirlanadi, parallel kesmalar nisbati saqlanadi). Kesim yasash: bir yoqda yotgan ikki nuqtani tutashtiramiz; kesuvchi tekislikning parallel yoqlardagi izlari parallel bo'ladi."],
        misol: [["Oltiburchakli prizmaning uchlari, qirralari va yoqlari sonini toping.", "V = 12, E = 18, F = 8; 12 − 18 + 8 = 2 ✓."], ["Kubning qirrasi 4. Uning diagonalini toping.", "d = a√3 = 4√3."]],
        mashq: ["Uchburchakli piramida uchun Eyler formulasini tekshiring.", "Kubning A, C va B₁ uchlari orqali o'tuvchi kesimi qanday shakl bo'ladi? Uning yuzini toping (a = 2).", "Muntazam to'rtburchakli piramidaning modelini yoyilmasidan yasang (a = 6, apofemasi l = 5) va yon sirti yuzini toping."] }
    ] },
    { nom: "Geometriya 10. 3-bob. Fazoda to'g'ri chiziq va tekisliklarning o'zaro joylashuvi", mavzular: [
      { id: "k10-24", nom: "Fazoda to'g'ri chiziqlarning o'zaro joylashuvi. Ayqash to'g'ri chiziqlar", test: ["t46", "t47"], mavzu: "t46", pdf: [1, 88],
        qoida: ["Fazodagi ikki to'g'ri chiziq kesishadi (bitta umumiy nuqtaga ega, bir tekislikda yotadi), parallel (bir tekislikda yotadi va umumiy nuqtaga ega emas) yoki ayqash (bir tekislikda yotmaydi). Ayqashlik alomati: to'g'ri chiziqlardan biri tekislikda yotsa, ikkinchisi esa bu tekislikni birinchi to'g'ri chiziqda yotmagan nuqtada kesib o'tsa, ular ayqash bo'ladi.", "Ayqash to'g'ri chiziqlar orasidagi burchak — ulardan biri bilan uni kesib o'tuvchi va ikkinchisiga parallel to'g'ri chiziq orasidagi burchak (0° < φ ≤ 90°)."],
        misol: [["Kubda AB va CC₁ to'g'ri chiziqlar qanday joylashgan?", "Ayqash: AB — ABCD tekisligida, CC₁ uni C nuqtada kesadi, C ∉ AB."], ["Kubda AA₁ va BC to'g'ri chiziqlar orasidagi burchakni toping.", "BC ∥ AD, AA₁ ⊥ AD → 90°."]],
        mashq: ["Kubda AD₁ va BC₁ orasidagi burchakni toping.", "Tetraedrda qarama-qarshi qirralar qanday joylashgan? Asoslang.", "Barcha qirralari 1 ga teng muntazam uchburchakli prizmada AB₁ va BC to'g'ri chiziqlar orasidagi burchakni toping."] },
      { id: "k10-25", nom: "To'g'ri chiziq va tekislik, tekisliklarning o'zaro joylashuvi. Parallel proyeksiyalash", test: ["t48", "t49", "t50"], mavzu: "t48", pdf: [1, 98],
        qoida: ["To'g'ri chiziq tekislikda yotadi, uni kesib o'tadi yoki unga parallel bo'ladi. To'g'ri chiziq va tekislikning parallellik alomati: tekislikda yotmagan to'g'ri chiziq shu tekislikdagi biror to'g'ri chiziqqa parallel bo'lsa, u tekislikka parallel. Tekisliklarning parallellik alomati: bir tekislikdagi ikkita kesishuvchi to'g'ri chiziq ikkinchi tekislikka parallel bo'lsa, tekisliklar parallel.", "Parallel proyeksiyalash xossalari: to'g'ri chiziq → to'g'ri chiziq (yoki nuqta), parallel to'g'ri chiziqlar → parallel (yoki ustma-ust tushuvchi) to'g'ri chiziqlar, bir to'g'ri chiziqda yoki parallel to'g'ri chiziqlarda yotgan kesmalar nisbati saqlanadi; shakl va yuz, umuman olganda, saqlanmaydi."],
        misol: [["Kubda A₁B₁ to'g'ri chiziq va ABCD tekislik qanday joylashgan?", "A₁B₁ ∥ AB ⊂ (ABCD) → parallel."], ["Kvadratning parallel proyeksiyasi qanday shakl bo'lishi mumkin?", "Parallelogramm (xususan, kvadrat, to'g'ri to'rtburchak, romb) yoki kesma."]],
        mashq: ["Trapetsiyaning parallel proyeksiyasi qanday shakl bo'ladi? O'rta chizig'i-chi?", "Kubda (AB₁D₁) va (BDC₁) tekisliklarning parallelligini isbotlang.", "Uchburchakning parallel proyeksiyasida uning medianalari kesishish nuqtasi qayerga tushadi?"] },
      { id: "k10-26", nom: "Fazoda perpendikulyarlik. Perpendikulyar, og'ma va masofa. Uch perpendikulyar teoremasi", test: ["t87", "t84"], mavzu: "t87", pdf: [1, 120],
        qoida: ["To'g'ri chiziq tekislikka perpendikulyar ⇔ u tekislikdagi ikkita kesishuvchi to'g'ri chiziqqa perpendikulyar. Perpendikulyar uzunligi — nuqtadan tekislikkacha masofa (u shu nuqtadan o'tkazilgan har qanday og'madan qisqa); og'ma l, perpendikulyar h va og'maning proyeksiyasi p uchun: l² = h² + p².", "Uch perpendikulyar teoremasi: tekislikda yotib, og'maning proyeksiyasiga perpendikulyar bo'lgan to'g'ri chiziq og'maning o'ziga ham perpendikulyar. Shuningdek: ikki yoqli burchak, tekisliklarning perpendikulyarligi."],
        misol: [["Tekislikdan 12 ga teng masofadagi nuqtadan uzunligi 13 bo'lgan og'ma o'tkazildi. Og'maning proyeksiyasini toping.", "p = √(169 − 144) = 5."], ["Kubda B₁D va AC perpendikulyarmi?", "B₁D ning (ABC) tekislikdagi proyeksiyasi BD va BD ⊥ AC, demak, uch perpendikulyar teoremasiga ko'ra B₁D ⊥ AC. Javob: ha."]],
        mashq: ["Nuqtadan tekislikka uzunliklari 10 va 17 bo'lgan ikkita og'ma o'tkazilgan, ularning proyeksiyalari ayirmasi 9 ga teng. Nuqtadan tekislikkacha masofani toping.", "Muntazam to'rtburchakli piramidada (a = 6, H = 4) apofemani va yon qirrani toping.", "Kubda AC₁ to'g'ri chiziq (BDA₁) tekislikka perpendikulyar ekanini isbotlang."] }
    ] }
  ]
};
