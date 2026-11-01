/* Kuvonch Academy — Elektron kitob, 10-sinf: Algebra 10 va Geometriya 10 mundarijalari asosida.
   Har bir mavzu saytning asosiy 1–50 mavzulariga (mashqlar.html#t…) bog'langan — u yerda to'liq tushuntirish, yechilgan misollar va 3 darajali testlar bor. */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[10] = {
  sinf: 10, nom: "Algebra va Geometriya", bosqich: "O'rta ta'lim",
  kirish: "Algebra 10: kvadrat funksiya va tengsizlik, progressiyalar, trigonometrik ayniyatlar, funksiyalar, ratsional va irratsional tenglamalar, ko'rsatkichli va logarifmik funksiyalar, trigonometrik funksiyalar va tenglamalar, ehtimollik. Geometriya 10: planimetriyaning mantiqiy tuzilishi, stereometriya asoslari, ko'pyoqlar, fazoda to'g'ri chiziq va tekisliklar, perpendikulyarlik. Bu sinf saytning asosiy 1–50 mavzulariga to'liq mos keladi.",
  pdf: [
    { nom: "Algebra 10", url: "https://static.oliygoh.uz/uploads/darsliklar/10/algebra-10-sinf-uz.pdf" },
    { nom: "Geometriya 10", url: "https://static.oliygoh.uz/uploads/darsliklar/10/geometriya-10-sinf-uz.pdf" },
    { nom: "Algebra va analiz asoslari, geometriya (1-qism)", url: "https://static.oliygoh.uz/uploads/darsliklar/10/algebra-va-analiz-asoslari-geometriya-10-sinf-uz.pdf" }
  ],
  boblar: [
    { nom: "Algebra. 1-bob. Kvadrat funksiya, tengsizlik, trigonometrik ayniyatlar, progressiyalar", mavzular: [
      { id: "k10-1", nom: "Kvadrat funksiya va uning grafigi", test: ["t1"], mavzu: "t1", pdf: [0, 6],
        qoida: ["y = ax² + bx + c — parabola. a > 0 — tarmoqlar yuqoriga, a < 0 — pastga. Uchi: x₀ = −b/(2a), y₀ = y(x₀). Simmetriya o'qi x = x₀.", "Nollari: ax² + bx + c = 0 ildizlari (D = b² − 4ac). y = a(x − m)² + n ko'rinishi — uchi (m; n)."],
        misol: [["y = x² − 4x + 3 parabolaning uchi va nollari?", "x₀ = 2, y₀ = 4 − 8 + 3 = −1 → uchi (2; −1); nollari x = 1 va x = 3."]],
        mashq: ["y = −2x² + 8x − 5: uchi, simmetriya o'qi, eng katta qiymati.", "y = x² + 6x + 5 grafigini chizing va nollarini toping."] },
      { id: "k10-2", nom: "Kvadrat tengsizlik va uning yechimi", test: ["t2"], mavzu: "t2", pdf: [0, 9],
        qoida: ["ax² + bx + c > 0 (<, ≥, ≤): ildizlarni topamiz, parabola eskizini chizamiz, kerakli ishorali oraliqni olamiz.", "D < 0 bo'lsa: a > 0 da ifoda hamma x da musbat, a < 0 da hamma x da manfiy."],
        misol: [["x² − 5x + 6 < 0", "Ildizlar 2 va 3, a > 0 → ildizlar orasida manfiy: x ∈ (2; 3)."]],
        mashq: ["x² − x − 12 ≥ 0; −x² + 4x > 0; x² + 2x + 5 > 0.", "Qaysi x larda y = x² − 9 funksiya manfiy?"] },
      { id: "k10-3", nom: "Trigonometrik ayniyatlar", test: ["t3", "t68"], mavzu: "t3", pdf: [0, 14],
        qoida: ["sin²α + cos²α = 1, tg α = sin α / cos α, tg α · ctg α = 1, 1 + tg²α = 1/cos²α.", "Qo'shish: sin(α ± β) = sin α cos β ± cos α sin β, cos(α ± β) = cos α cos β ∓ sin α sin β. Ikkilangan: sin 2α = 2 sin α cos α, cos 2α = cos²α − sin²α."],
        misol: [["sin α = 3/5, α — I chorak. cos α, tg α?", "cos α = √(1 − 9/25) = 4/5; tg α = 3/4."], ["sin 2α, agar sin α = 3/5, cos α = 4/5", "2 · 3/5 · 4/5 = 24/25."]],
        mashq: ["cos α = −5/13, α — II chorak. sin α, tg α?", "Soddalashtiring: (1 − cos²α)/sin α; sin 4α / sin 2α.", "cos 75° ni qo'shish formulasi bilan hisoblang."] },
      { id: "k10-4", nom: "Arifmetik va geometrik progressiyalar", test: ["t4", "t54", "t55"], mavzu: "t4", pdf: [0, 20],
        qoida: ["Arifmetik: aₙ = a₁ + (n − 1)d, Sₙ = (a₁ + aₙ)·n/2 = (2a₁ + (n − 1)d)·n/2.", "Geometrik: bₙ = b₁·qⁿ⁻¹, Sₙ = b₁(qⁿ − 1)/(q − 1); |q| < 1 da cheksiz yig'indi S = b₁/(1 − q)."],
        misol: [["a₁ = 5, d = 3. S₂₀ = ?", "a₂₀ = 5 + 19·3 = 62; S = (5 + 62)·20/2 = 670."], ["b₁ = 2, q = 3. b₅?", "2 · 3⁴ = 162."]],
        mashq: ["a₃ = 10, a₇ = 22. a₁, d va S₁₀?", "b₂ = 6, b₄ = 54 (q > 0). b₁ va S₅?", "1 + 1/2 + 1/4 + … cheksiz yig'indi?"] }
    ] },
    { nom: "Algebra. 2-bob. Funksiyalar", mavzular: [
      { id: "k10-5", nom: "Funksiya tushunchasi. Berilish usullari, aniqlanish sohasi va qiymatlar to'plami", test: ["t5", "t65"], mavzu: "t5", pdf: [0, 24],
        qoida: ["Funksiya — har bir x ga bitta y mos qo'yuvchi qoida: formula, jadval, grafik, so'z bilan beriladi. D(f) — aniqlanish sohasi, E(f) — qiymatlar to'plami.", "D(f) ni topish: maxraj ≠ 0, juft daraja ildiz ostidagi ifoda ≥ 0, logarifm ostidagi ifoda > 0."],
        misol: [["y = √(x − 2) / (x − 5) ning D(f)?", "x − 2 ≥ 0 va x ≠ 5 → [2; 5) ∪ (5; +∞)."], ["y = x² + 1 ning E(f)?", "x² ≥ 0 → y ≥ 1: [1; +∞)."]],
        mashq: ["D(f): y = 1/(x² − 4); y = √(3 − x); y = lg(x + 1).", "E(f): y = −x² + 4; y = |x| − 2; y = 3 + √x."] },
      { id: "k10-6", nom: "Funksiya xossalari. Murakkab, teskari, davriy funksiyalar", test: ["t6"], mavzu: "t6", pdf: [0, 32],
        qoida: ["Juft: f(−x) = f(x) (grafik Oy ga simmetrik), toq: f(−x) = −f(x) (koordinata boshiga simmetrik). O'suvchi/kamayuvchi, nollari, ishora o'zgarmaslik oraliqlari.", "Murakkab funksiya f(g(x)); teskari funksiya grafigi y = x ga nisbatan simmetrik; davriy: f(x + T) = f(x)."],
        misol: [["y = x³ − x juftmi, toqmi?", "f(−x) = −x³ + x = −f(x) → toq."], ["f(x) = 2x + 1, g(x) = x². f(g(x)) va g(f(x))?", "f(g(x)) = 2x² + 1; g(f(x)) = (2x + 1)²."]],
        mashq: ["Juft-toqlikni aniqlang: y = x⁴ − 3x²; y = x + 1/x; y = x² + x.", "y = 3x − 6 ga teskari funksiyani toping.", "y = x² − 4x: o'sish-kamayish oraliqlari."] },
      { id: "k10-7", nom: "Funksiya grafigi ustida sodda almashtirishlar", test: ["t7"], mavzu: "t7", pdf: [0, 47],
        qoida: ["y = f(x) + b — yuqoriga b ga, y = f(x − a) — o'ngga a ga siljish. y = −f(x) — Ox ga nisbatan, y = f(−x) — Oy ga nisbatan aks ettirish.", "y = k·f(x) — Oy bo'ylab k marta cho'zish (k > 1) / siqish (0 < k < 1); y = f(kx) — Ox bo'ylab siqish/cho'zish; y = |f(x)|, y = f(|x|)."],
        misol: [["y = (x + 3)² − 2 grafigi y = x² dan qanday hosil bo'ladi?", "Chapga 3 ga, pastga 2 ga siljitib: uchi (−3; −2)."]],
        mashq: ["y = √x dan y = √(x − 1) + 2; y = −√x; y = 2√x grafiklarini tavsiflang.", "y = |x² − 4| grafigini chizing."] },
      { id: "k10-8", nom: "Chiziqli va kvadratik modellashtirish. Loyiha ishi", test: ["t8", "t9"], mavzu: "t8", pdf: [0, 55],
        qoida: ["Chiziqli model y = kx + b: k — o'zgarish tezligi (narx, tezlik), b — boshlang'ich qiymat. Kvadratik model — eng katta/eng kichik qiymat parabola uchida.", "Real hodisani funksiya sifatida ifodalash: o'zgaruvchilarni belgilash, bog'lanishni yozish, modelni tekshirish."],
        misol: [["Taksi: 10 000 so'm + har km 3 000. 12 km?", "y = 3000x + 10000; y(12) = 46 000 so'm."], ["Perimetri 40 m to'g'ri to'rtburchakning eng katta yuzi?", "S = x(20 − x), uchi x = 10 → 100 m² (kvadrat)."]],
        mashq: ["Suv idishi: boshida 5 l, minutiga 2 l quyiladi. Funksiya va 8 minutdan keyingi hajm?", "Tosh yuqoriga: h = 20t − 5t². Eng baland nuqta va yerga tushish vaqti?"] }
    ] },
    { nom: "Algebra. 3-bob. Ratsional va irratsional tenglamalar", mavzular: [
      { id: "k10-9", nom: "Ratsional tenglamalar va ularning sistemasi", test: ["t10", "t11", "t14"], mavzu: "t10", pdf: [0, 61],
        qoida: ["Kasrli tenglama: ODZ (maxraj ≠ 0) → umumiy maxrajga keltirib suratni nolga tenglash → ildizlarni ODZ bo'yicha tekshirish.", "Sistema: o'rniga qo'yish yoki qo'shish usuli; yechim ODZ ga kirishi shart."],
        misol: [["(x + 3)/(x − 1) = 2", "ODZ x ≠ 1; x + 3 = 2x − 2 → x = 5."], ["1/x + 1/(x+2) = 3/4 ... (x > 0)", "4(x + 2) + 4x = 3x(x + 2) → 3x² − 2x − 8 = 0 → x = 2."]],
        mashq: ["(2x − 1)/(x + 2) = 3; x/(x − 3) + 1 = 6/(x − 3).", "Sistema: { x + y = 7; 1/x + 1/y = 7/12 }."] },
      { id: "k10-10", nom: "Ratsional tengsizliklar va ularning sistemasi", test: ["t12", "t13"], mavzu: "t12", pdf: [0, 74],
        qoida: ["Intervallar usuli: hamma hadni bir tomonga, ko'paytuvchilarga ajratish, nollarni (surat va maxraj) son o'qiga qo'yish, ishoralarni aniqlash. Maxraj nollari doim ochiq nuqta.", "Sistema: har bir tengsizlikni alohida yechib kesishmasini olamiz."],
        misol: [["(x − 1)(x + 2)/(x − 4) ≤ 0", "Nollar −2, 1, 4; ishoralar: − + − + → (−∞; −2] ∪ [1; 4)."]],
        mashq: ["(x + 5)/(x − 2) > 0; (x² − 9)/(x + 1) ≤ 0.", "Sistema: { x² − 4 < 0; (x + 1)/x ≥ 0 }."] },
      { id: "k10-11", nom: "Irratsional tenglamalar va sistemalari", test: ["t15", "t16", "t17", "t18"], mavzu: "t15", pdf: [0, 81],
        qoida: ["√f(x) = g(x) ⇔ g(x) ≥ 0 va f(x) = g²(x). Kvadratga ko'tarishdan keyin ildizlarni albatta tekshiramiz (chet ildizlar paydo bo'ladi).", "Ikki ildizli: birini ajratib kvadratga ko'taramiz; ba'zan √f = t almashtirish qulay."],
        misol: [["√(2x + 3) = x", "x ≥ 0; 2x + 3 = x² → x² − 2x − 3 = 0 → x = 3 (x = −1 chet)."], ["√(x + 4) − √(x − 1) = 1", "√(x+4) = 1 + √(x−1) → x + 4 = 1 + 2√(x−1) + x − 1 → √(x−1) = 2 → x = 5."]],
        mashq: ["√(x − 2) = x − 4; √(3x + 1) = x − 1; √(x + 7) + √(x) = 7.", "Sistema: { √x + √y = 5; x − y = 5 }."] }
    ] },
    { nom: "Algebra. 4-bob. Ko'rsatkichli va logarifmik funksiyalar", mavzular: [
      { id: "k10-12", nom: "Ko'rsatkichli funksiya, tenglamalar va tengsizliklar", test: ["t19", "t22", "t25"], mavzu: "t19", pdf: [0, 95],
        qoida: ["y = aˣ (a > 0, a ≠ 1): D = ℝ, E = (0; +∞); a > 1 — o'suvchi, 0 < a < 1 — kamayuvchi; grafik (0; 1) dan o'tadi.", "aᶠ⁽ˣ⁾ = aᵍ⁽ˣ⁾ ⇔ f(x) = g(x). Tengsizlik: a > 1 da ishora saqlanadi, 0 < a < 1 da teskariga o'zgaradi. aˣ = t almashtirish."],
        misol: [["2ˣ⁺¹ = 32", "2ˣ⁺¹ = 2⁵ → x = 4."], ["(1/3)ˣ > 9", "(1/3)ˣ > (1/3)⁻² → x < −2."], ["4ˣ − 5·2ˣ + 4 = 0", "t = 2ˣ: t² − 5t + 4 = 0 → t = 1, 4 → x = 0, 2."]],
        mashq: ["3ˣ⁻² = 81; 5²ˣ = 1/25; 2ˣ + 2ˣ⁺² = 40.", "2ˣ ≤ 16; (0,5)ˣ ≥ 4; 9ˣ − 4·3ˣ + 3 < 0."] },
      { id: "k10-13", nom: "Logarifm tushunchasi. Logarifmik funksiya. Ayniy almashtirishlar", test: ["t20", "t21", "t28", "t67"], mavzu: "t20", pdf: [0, 104],
        qoida: ["logₐb = c ⇔ aᶜ = b (a > 0, a ≠ 1, b > 0). logₐ(xy) = logₐx + logₐy, logₐ(x/y) = logₐx − logₐy, logₐxᵖ = p·logₐx, logₐb = log꜀b / log꜀a.", "y = logₐx: D = (0; +∞), E = ℝ, (1; 0) dan o'tadi; a > 1 — o'suvchi. y = aˣ ga teskari."],
        misol: [["log₂ 32 + log₃ (1/9) = ?", "5 + (−2) = 3."], ["lg 50 + lg 2 = ?", "lg 100 = 2."], ["log₂ 5 = a bo'lsa, log₂ 20 = ?", "log₂ 4 + log₂ 5 = 2 + a."]],
        mashq: ["log₅ 125; log₄ 2; log₀,₅ 8; 2^(log₂ 7).", "Soddalashtiring: log₃ 54 − log₃ 2; (lg 8)/(lg 2); log₆ 2 + log₆ 3.", "D(f): y = log₂(x² − 1)."] },
      { id: "k10-14", nom: "Logarifmik tenglamalar, tengsizliklar va sistemalar", test: ["t23", "t24", "t26"], mavzu: "t23", pdf: [0, 116],
        qoida: ["logₐf(x) = logₐg(x) ⇔ f(x) = g(x) > 0 (ODZ!). logₐf(x) = b ⇔ f(x) = aᵇ.", "Tengsizlik: a > 1 da logₐf > logₐg ⇔ f > g > 0; 0 < a < 1 da ishora o'zgaradi. ODZ ni oxirida kesishtiramiz."],
        misol: [["log₃(2x − 1) = 2", "2x − 1 = 9 → x = 5 (ODZ: x > 1/2 ✓)."], ["log₂(x − 3) < 3", "0 < x − 3 < 8 → 3 < x < 11."]],
        mashq: ["log₂(x + 6) = 4; lg x + lg(x − 3) = 1; log₅(x² − 4) = log₅ 3x.", "log₁/₂(x − 1) > −2; log₃(2x + 1) ≥ 2.", "Sistema: { log₂x + log₂y = 3; x − y = 2 }."] },
      { id: "k10-15", nom: "Ko'rsatkichli va logarifmik funksiyalarning tatbiqi (modellashtirish)", test: ["t27"], mavzu: "t27", pdf: [0, 127],
        qoida: ["Ko'rsatkichli o'sish/kamayish: N = N₀·(1 + p/100)ᵗ (foiz bilan), N = N₀·2^(t/T) (ikkilanish), N = N₀·(1/2)^(t/T) (yarim yemirilish).", "Vaqtni topish uchun logarifm: t = T·log₂(N/N₀)."],
        misol: [["Omonat 10 mln, yiliga 20%. 3 yildan keyin?", "10·1,2³ = 17,28 mln."], ["Bakteriya har 3 soatda 2 marta ko'payadi. 100 tadan 12 soatda?", "100·2⁴ = 1 600."]],
        mashq: ["Mashina narxi yiliga 15% tushadi. 50 mln dan 4 yilda?", "Yarim yemirilish 8 kun. 64 g dan 24 kunda qancha qoladi?", "Aholi yiliga 2% o'sadi. Necha yilda 2 marta ko'payadi? (log 2 / log 1,02 ≈ ?)"] }
    ] },
    { nom: "Algebra. 5-bob. Trigonometrik funksiyalar va tenglamalar", mavzular: [
      { id: "k10-16", nom: "Trigonometrik funksiyalar. Davriy jarayonlar. Teskari trigonometrik funksiyalar", test: ["t29", "t30", "t31", "t32"], mavzu: "t29", pdf: [0, 133],
        qoida: ["y = sin x, y = cos x: D = ℝ, E = [−1; 1], T = 2π; y = tg x: x ≠ π/2 + πn, T = π. sin — toq, cos — juft. y = A sin(ωx + φ) — amplituda A, davr 2π/ω.", "arcsin a ∈ [−π/2; π/2], arccos a ∈ [0; π], arctg a ∈ (−π/2; π/2); arcsin(−a) = −arcsin a, arccos(−a) = π − arccos a."],
        misol: [["y = 3 sin 2x ning amplitudasi, davri, E(f)?", "A = 3, T = π, E = [−3; 3]."], ["arccos(−1/2) = ?", "π − π/3 = 2π/3."]],
        mashq: ["arcsin(√3/2); arctg(−1); arccos 0 + arcsin 1.", "y = 2 cos(x/2): davri va grafigi.", "Mayatnik h = 5 cos(πt) — davri va eng katta og'ish?"] },
      { id: "k10-17", nom: "Trigonometrik tenglamalar va ularni yechish usullari", test: ["t33", "t34", "t35", "t69"], mavzu: "t33", pdf: [0, 148],
        qoida: ["sin x = a: x = (−1)ⁿ arcsin a + πn; cos x = a: x = ±arccos a + 2πn; tg x = a: x = arctg a + πn (n ∈ ℤ). |a| > 1 da sin, cos uchun yechim yo'q.", "Usullar: almashtirish (sin x = t), ko'paytuvchilarga ajratish, bir jinsli (cos x ga bo'lish), ayniyatlar bilan soddalashtirish."],
        misol: [["2 sin x − 1 = 0", "sin x = 1/2 → x = (−1)ⁿ π/6 + πn."], ["2cos²x − cos x − 1 = 0", "t = cos x: t = 1 yoki t = −1/2 → x = 2πn; x = ±2π/3 + 2πn."]],
        mashq: ["cos 2x = √2/2; tg(x − π/4) = √3; sin² x = 1/4.", "sin x cos x = 1/4; 2sin²x + 3 sin x − 2 = 0; sin x + √3 cos x = 0.", "[0; 2π] da sin x = −1/2 ildizlarini toping."] },
      { id: "k10-18", nom: "Trigonometrik tengsizliklar", test: ["t36"], mavzu: "t36", pdf: [0, 157],
        qoida: ["Birlik aylana yoki grafik yordamida: sin x > a — Oy bo'yicha a dan yuqoridagi yoy, cos x > a — Ox bo'yicha a dan o'ngdagi yoy; javob + 2πn.", "tg x > a: (arctg a + πn; π/2 + πn)."],
        misol: [["sin x > 1/2", "π/6 + 2πn < x < 5π/6 + 2πn."], ["cos x ≤ −√2/2", "3π/4 + 2πn ≤ x ≤ 5π/4 + 2πn."]],
        mashq: ["cos x > 1/2; sin x ≤ −√3/2; tg x < 1.", "2 sin x + 1 ≥ 0; cos 2x < 0."] }
    ] },
    { nom: "Algebra. 6-bob. Ehtimollik", mavzular: [
      { id: "k10-19", nom: "Tasodifiy hodisalar. Ehtimollik ta'riflari. Teng ehtimolli hodisalar", test: ["t37", "t39", "t92", "t93"], mavzu: "t37", pdf: [0, 165],
        qoida: ["Muqarrar (P = 1), mumkin bo'lmagan (P = 0), tasodifiy hodisa (0 < P < 1). Klassik ta'rif: P(A) = m/n — qulay hollar soni / barcha teng imkoniyatli hollar soni.", "Statistik ta'rif — chastota W = m/n katta n da ehtimollikka yaqinlashadi. Qarama-qarshi hodisa: P(Ā) = 1 − P(A). Birgalikda bo'lmagan hodisalar: P(A + B) = P(A) + P(B)."],
        misol: [["Ikki kubik tashlanganda yig'indi 7 bo'lish ehtimoli?", "Qulay: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) — 6 ta; n = 36 → 1/6."], ["Kartadan tuz chiqmaslik ehtimoli (36 ta karta)?", "1 − 4/36 = 8/9."]],
        mashq: ["Tanga 3 marta tashlanadi. Rosa 2 ta gerb tushish ehtimoli?", "Qutida 5 oq, 3 qora shar. 2 ta olinganda ikkalasi oq?", "Lotereyada 100 chiptadan 5 tasi yutuqli. Bitta chipta yutmaslik ehtimoli?"] },
      { id: "k10-20", nom: "Ehtimollikni hisoblashda kombinatorika formulalaridan foydalanish", test: ["t38", "t91"], mavzu: "t38", pdf: [0, 168],
        qoida: ["O'rin almashtirish Pₙ = n!, o'rinlashtirish Aₙᵏ = n!/(n − k)!, guruhlash Cₙᵏ = n!/(k!(n − k)!).", "P = Cₘᵏ·C_{n−m}^{r−k} / Cₙʳ — tanlanmadagi hollar."],
        misol: [["7 kitobdan 3 tasini tanlash — necha usul?", "C₇³ = 35."], ["6 ta oq, 4 ta qora shardan 2 ta olindi. Ikkalasi oq ehtimoli?", "C₆²/C₁₀² = 15/45 = 1/3."]],
        mashq: ["5 ta harfdan 3 harfli nechta «so'z»? (takrorsiz)", "8 kishidan 3 kishilik komissiya — nechta usul?", "10 ta lampadan 2 tasi nosoz. 3 ta olinganda hammasi soz ehtimoli?"] }
    ] },
    { nom: "Geometriya 10. 1-bob. Planimetriyaning mantiqiy tuzilishi", mavzular: [
      { id: "k10-21", nom: "Geometriyaning mantiqiy tuzilishi. Geometrik masalalar va ularni yechish usullari", test: ["t40", "t41"], mavzu: "t40", pdf: [1, 8],
        qoida: ["Asosiy tushunchalar (nuqta, to'g'ri chiziq, tekislik) → aksiomalar → ta'riflar → teoremalar (shart, xulosa, isbot). Teskari teorema, zarur va yetarli shart.", "Yechish usullari: algebraik (tenglama), sintetik (teoremalar zanjiri), koordinatalar va vektorlar usuli, yuzalar usuli, qo'shimcha yasashlar."],
        misol: [["«Vertikal burchaklar teng» teoremasining sharti va xulosasi?", "Shart: burchaklar vertikal; xulosa: ular teng."], ["Uchburchak tomonlari 13, 14, 15. Yuzi? (Geron)", "p = 21; S = √(21·8·7·6) = 84."]],
        mashq: ["Pifagor teoremasiga teskari teoremani ifodalang; u to'g'rimi?", "Teng yonli uchburchakda asosga tushirilgan balandlik medianadir — isbotlang.", "Yuzalar usuli bilan: tomonlari 10, 10, 12 uchburchakning 10 ga tushirilgan balandligi?"] }
    ] },
    { nom: "Geometriya 10. 2-bob. Stereometriya asoslari va ko'pyoqlar", mavzular: [
      { id: "k10-22", nom: "Stereometriyaning asosiy tushunchalari. Fazoda to'g'ri chiziqlar va tekisliklar", test: ["t42", "t43"], mavzu: "t42", pdf: [1, 32],
        qoida: ["Stereometriya aksiomalari: bir to'g'ri chiziqda yotmagan 3 nuqta orqali yagona tekislik; to'g'ri chiziqning 2 nuqtasi tekislikda yotsa chiziq ham yotadi; ikki tekislik umumiy nuqtaga ega bo'lsa — umumiy to'g'ri chiziq bo'yicha kesishadi.", "Tekislik: to'g'ri chiziq va undan tashqaridagi nuqta orqali; ikki kesishuvchi yoki ikki parallel to'g'ri chiziq orqali."],
        misol: [["Nega 3 oyoqli stol qimirlamaydi?", "3 nuqta orqali yagona tekislik o'tadi — oyoqlar doim bitta tekislikda."]],
        mashq: ["4 nuqta orqali nechta tekislik o'tishi mumkin? Barcha hollarni ko'rib chiqing.", "Kubning ABCD va A₁B₁C₁D₁ tekisliklari qanday joylashgan? AB va B₁C₁ to'g'ri chiziqlari-chi?"] },
      { id: "k10-23", nom: "Fazoviy geometrik shakllar. Ko'pyoqlar, ularni tasvirlash va modelini yasash. Sodda kesimlar", test: ["t44", "t45", "t75", "t76"], mavzu: "t44", pdf: [1, 44],
        qoida: ["Ko'pyoq — yoqlari ko'pburchaklardan iborat jism: uchlar (V), qirralar (E), yoqlar (F); qavariq ko'pyoq uchun Eyler: V − E + F = 2. Prizma, parallelepiped, kub, piramida, tetraedr; muntazam ko'pyoqlar — 5 ta.", "Tasvirlash — parallel proyeksiya qoidalari (parallel qirralar parallel va nisbatlari saqlanadi). Kesim yasash: bir yoqdagi 2 nuqtani tutashtirish, parallel tekisliklar izlari parallel."],
        misol: [["Oltiburchakli prizmaning uchlari, qirralari, yoqlari?", "V = 12, E = 18, F = 8; 12 − 18 + 8 = 2 ✓."], ["Kubning qirrasi 4. Diagonali?", "d = a√3 = 4√3."]],
        mashq: ["Uchburchakli piramida uchun Eyler formulasini tekshiring.", "Kubning A, C va B₁ uchlari orqali o'tuvchi kesim qanday shakl? Yuzini toping (a = 2).", "Muntazam to'rtburchakli piramidani yoyilmasidan yasang (a = 6, l = 5): yon sirti?"] }
    ] },
    { nom: "Geometriya 10. 3-bob. Fazoda to'g'ri chiziq va tekisliklarning o'zaro joylashuvi", mavzular: [
      { id: "k10-24", nom: "Fazoda to'g'ri chiziqlarning o'zaro joylashuvi. Ayqash to'g'ri chiziqlar", test: ["t46", "t47"], mavzu: "t46", pdf: [1, 88],
        qoida: ["Ikki to'g'ri chiziq: kesishadi (bitta umumiy nuqta, bir tekislikda), parallel (bir tekislikda, umumiy nuqtasiz), ayqash (bir tekislikda yotmaydi). Ayqashlik alomati: biri tekislikda, ikkinchisi uni shu chiziqdan tashqarida kesib o'tsa.", "Ayqash chiziqlar orasidagi burchak — ulardan biriga parallel va ikkinchisini kesuvchi chiziq bilan hosil bo'lgan burchak (0°–90°)."],
        misol: [["Kubda AB va CC₁ qanday joylashgan?", "Ayqash: AB — ABCD tekisligida, CC₁ uni C nuqtada kesadi, C ∉ AB."], ["Kubda AA₁ va BC orasidagi burchak?", "BC ∥ AD, AA₁ ⊥ AD → 90°."]],
        mashq: ["Kubda AD₁ va BC₁ orasidagi burchakni toping.", "Tetraedrda qarama-qarshi qirralar qanday joylashgan? Asoslang.", "Muntazam uchburchakli prizmada AB₁ va BC orasidagi burchak (hamma qirra 1)."] },
      { id: "k10-25", nom: "To'g'ri chiziq va tekislik, tekisliklarning o'zaro joylashuvi. Parallel proyeksiyalash", test: ["t48", "t49", "t50"], mavzu: "t48", pdf: [1, 98],
        qoida: ["To'g'ri chiziq tekislikda yotadi, uni kesadi yoki unga parallel. Parallellik alomati: chiziq tekislikdagi biror chiziqqa parallel bo'lsa. Tekisliklar parallelligi: birining ikki kesishuvchi chizig'i ikkinchisiga parallel bo'lsa.", "Parallel proyeksiyalash xossalari: to'g'ri chiziq → to'g'ri chiziq (yoki nuqta), parallel chiziqlar → parallel, kesmalar nisbati saqlanadi; shakl va yuza umuman saqlanmaydi."],
        misol: [["Kubda A₁B₁ to'g'ri chizig'i va ABCD tekisligi?", "A₁B₁ ∥ AB ⊂ (ABCD) → parallel."], ["Parallel proyeksiyada kvadrat nimaga aylanishi mumkin?", "Parallelogrammga (xususan kvadrat, to'g'ri to'rtburchak, romb) yoki kesmaga."]],
        mashq: ["Trapetsiyaning parallel proyeksiyasi qanday shakl bo'ladi? O'rta chizig'i-chi?", "Kubda (AB₁D₁) va (BDC₁) tekisliklari parallelligini isbotlang.", "Uchburchakning proyeksiyasida medianalar kesishish nuqtasi qayerga tushadi?"] },
      { id: "k10-26", nom: "Fazoda perpendikulyarlik. Perpendikulyar, og'ma va masofa. Uch perpendikulyar teoremasi", test: ["t87", "t84"], mavzu: "t87", pdf: [1, 120],
        qoida: ["Chiziq tekislikka perpendikulyar ⇔ tekislikdagi ikki kesishuvchi chiziqqa perpendikulyar. Perpendikulyar — eng qisqa masofa; og'ma va uning proyeksiyasi: l² = h² + p².", "Uch perpendikulyar teoremasi: og'ma proyeksiyasiga perpendikulyar bo'lgan tekislikdagi chiziq og'maning o'ziga ham perpendikulyar. Ikki yoqli burchak, tekisliklar perpendikulyarligi."],
        misol: [["Tekislikdan 12 masofadagi nuqtadan 13 uzunlikdagi og'ma o'tkazildi. Proyeksiyasi?", "√(169 − 144) = 5."], ["Kubda B₁D va AC perpendikulyarmi?", "B₁D ning (ABC) dagi proyeksiyasi BD ⊥ AC → uch perpendikulyar teoremasi bo'yicha ha."]],
        mashq: ["Nuqtadan tekislikka 2 ta og'ma: 10 va 17, proyeksiyalari farqi 9. Masofani toping.", "Muntazam to'rtburchakli piramidada (a = 6, H = 4) apofemani va yon qirrani toping.", "Kubda A₁C to'g'ri chiziq (BDA₁) tekisligiga perpendikulyarligini isbotlang."] }
    ] }
  ]
};
