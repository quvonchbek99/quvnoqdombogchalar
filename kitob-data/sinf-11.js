/* Kuvonch Academy — Elektron kitob, 11-sinf: "Matematika 11" (Algebra va analiz asoslari + Geometriya) 1–2-qism mundarijalari asosida.
   Mavzular saytning qo'shimcha mavzulariga (mashqlar.html#t51…t102) bog'langan. */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[11] = {
  sinf: 11, nom: "Matematika (Algebra va analiz asoslari, Geometriya)", bosqich: "O'rta ta'lim",
  kirish: "Algebra va analiz asoslari 11: funksiya limiti, hosila va uning tatbiqlari, boshlang'ich funksiya va integral, kombinatorika va Nyuton binomi, statistika elementlari, ehtimollik va taqsimotlar. Geometriya 11: ko'pyoqlar (prizma, piramida), aylanma jismlar (silindr, konus, shar), sirt yuzi va hajm, fazoda koordinatalar va vektorlar. Bu bilimlar Milliy sertifikat va SAT uchun ham asos.",
  pdf: [
    { nom: "Matematika 11, 1-qism (hosila, integral, prizma, silindr)", url: "https://static.oliygoh.uz/uploads/darsliklar/11/matematika-11-sinf-uz-1-qism.pdf" },
    { nom: "Matematika 11, 2-qism (integral tatbiqlari, kombinatorika, statistika, ehtimollik, piramida, konus, shar)", url: "https://static.oliygoh.uz/uploads/darsliklar/11/matematika-11-sinf-uz-2-qism.pdf" }
  ],
  boblar: [
    { nom: "Algebra. 1-bob. Limit va hosila", mavzular: [
      { id: "k11-1", nom: "Funksiyaning limiti va uzluksizligi", test: ["t59"], mavzu: "t59", pdf: [0, 1],
        qoida: ["lim_{x→a} f(x) = b — x a ga yaqinlashganda f(x) b ga yaqinlashadi. Limit xossalari: yig'indi, ko'paytma, bo'linma limitlari (maxraj limiti ≠ 0).", "0/0 ko'rinishdagi noaniqlik: ko'paytuvchilarga ajratib qisqartiramiz yoki ildizli ifodani qo'shmasiga ko'paytiramiz. Ajoyib limit: lim_{x→0} sin x / x = 1. Uzluksiz funksiya grafigi uzilmaydi."],
        misol: [["lim_{x→2} (x² − 4)/(x − 2)", "= lim (x + 2) = 4."], ["lim_{x→∞} (3x² + 1)/(x² − 5)", "x² ga bo'lamiz: (3 + 1/x²)/(1 − 5/x²) → 3."]],
        mashq: ["lim_{x→3} (x² − 9)/(x − 3); lim_{x→0} sin 5x / x; lim_{x→1} (√x − 1)/(x − 1).", "lim_{x→∞} (2x + 1)/(5x − 3); lim_{x→∞} (x² − x)/(x³ + 1)."] },
      { id: "k11-2", nom: "Hosila ta'rifi, hisoblash qoidalari va formulalari", test: ["t60"], mavzu: "t60", pdf: [0, 1],
        qoida: ["f'(x) = lim_{Δx→0} Δf/Δx — o'zgarish tezligi; geometrik ma'nosi — urinma burchak koeffitsiyenti k = f'(x₀); urinma: y = f(x₀) + f'(x₀)(x − x₀).", "(xⁿ)' = nxⁿ⁻¹, (eˣ)' = eˣ, (ln x)' = 1/x, (sin x)' = cos x, (cos x)' = −sin x; (u ± v)' = u' ± v', (uv)' = u'v + uv', (u/v)' = (u'v − uv')/v², murakkab: (f(g(x)))' = f'(g)·g'."],
        misol: [["f(x) = x³ − 4x² + 5. f'(x) va f'(2)?", "f' = 3x² − 8x; f'(2) = 12 − 16 = −4."], ["y = x² ga x₀ = 1 nuqtada urinma?", "y' = 2x, k = 2: y = 1 + 2(x − 1) = 2x − 1."]],
        mashq: ["Hosila: y = 5x⁴ − 3x + 7; y = x·sin x; y = (2x + 1)⁵; y = x²/(x − 1).", "y = x³ − 3x ga x₀ = 2 nuqtada urinma tenglamasi.", "s(t) = t² + 3t (m). t = 4 s dagi tezlik?"] },
      { id: "k11-3", nom: "Hosilaning tatbiqlari: o'sish-kamayish, ekstremumlar, eng katta va eng kichik qiymat", test: ["t60", "t8"], mavzu: "t60", pdf: [0, 1],
        qoida: ["f' > 0 — o'sadi, f' < 0 — kamayadi. Kritik nuqtalar: f' = 0 yoki mavjud emas. Hosila ishorasi + dan − ga o'tsa — maksimum, − dan + ga — minimum.", "[a; b] da eng katta/eng kichik qiymat: kritik nuqtalar va chetki nuqtalardagi qiymatlarni taqqoslaymiz. Tatbiqi: eng kam material, eng katta yuza va hajm masalalari."],
        misol: [["f(x) = x³ − 3x: ekstremumlar?", "f' = 3x² − 3 = 0 → x = ±1; f(−1) = 2 (max), f(1) = −2 (min)."], ["Perimetri 24 to'g'ri to'rtburchakning eng katta yuzi?", "S = x(12 − x), S' = 12 − 2x = 0 → x = 6, S = 36."]],
        mashq: ["f(x) = 2x³ − 9x² + 12x: o'sish-kamayish oraliqlari va ekstremumlari.", "[−2; 3] da f(x) = x³ − 3x² + 1 ning eng katta va eng kichik qiymati.", "Yuzi 100 m² to'g'ri to'rtburchak uchastkani o'rash uchun eng kam to'siq?"] }
    ] },
    { nom: "Algebra. 2-bob. Integral", mavzular: [
      { id: "k11-4", nom: "Boshlang'ich funksiya va aniqmas integral", test: ["t70"], mavzu: "t70", pdf: [0, 1],
        qoida: ["F'(x) = f(x) bo'lsa F — f ning boshlang'ichi; ∫f(x)dx = F(x) + C. ∫xⁿdx = xⁿ⁺¹/(n + 1) + C (n ≠ −1), ∫dx/x = ln|x| + C, ∫eˣdx = eˣ + C, ∫sin x dx = −cos x + C, ∫cos x dx = sin x + C.", "∫(f ± g) = ∫f ± ∫g, ∫k·f = k∫f; ∫f(kx + b)dx = F(kx + b)/k + C."],
        misol: [["∫(3x² − 4x + 1)dx", "x³ − 2x² + x + C."], ["∫cos 3x dx", "sin 3x / 3 + C."]],
        mashq: ["∫(x⁴ + 2x)dx; ∫(1/x² + √x)dx; ∫e^(2x)dx; ∫sin(x/2)dx.", "f(x) = 2x + 1 ning (1; 5) nuqtadan o'tuvchi boshlang'ichini toping."] },
      { id: "k11-5", nom: "Aniq integral. Nyuton–Leybnits formulasi. Yuza va hajm hisoblash", test: ["t70"], mavzu: "t70", pdf: [1, 3],
        qoida: ["∫ₐᵇ f(x)dx = F(b) − F(a). Egri chiziqli trapetsiya yuzi (f ≥ 0): S = ∫ₐᵇ f(x)dx; ikki grafik orasidagi yuza S = ∫ₐᵇ (f − g)dx.", "Aylanma jism hajmi V = π∫ₐᵇ f²(x)dx. Taqribiy integrallash — trapetsiyalar formulasi. Fizik tatbiq: yo'l = ∫v(t)dt, ish = ∫F(x)dx."],
        misol: [["∫₀² x² dx", "x³/3 |₀² = 8/3."], ["y = x² va y = 4 orasidagi yuza?", "∫₋₂² (4 − x²)dx = 2·(8 − 8/3) = 32/3."]],
        mashq: ["∫₁³ (2x + 1)dx; ∫₀^π sin x dx; ∫₁ᵉ dx/x.", "y = x², y = x chiziqlari bilan chegaralangan yuza.", "y = √x, x = 4, Ox bilan chegaralangan shaklni Ox atrofida aylantirishdan hosil bo'lgan jism hajmi."] }
    ] },
    { nom: "Algebra. 3-bob. Kombinatorika va Nyuton binomi", mavzular: [
      { id: "k11-6", nom: "Kombinatorika masalalari: o'rin almashtirish, o'rinlashtirish, guruhlash", test: ["t89", "t90", "t91"], mavzu: "t90", pdf: [1, 27],
        qoida: ["Qo'shish qoidasi (yoki), ko'paytirish qoidasi (va). n! = 1·2·…·n, 0! = 1. Pₙ = n!, Aₙᵏ = n!/(n − k)! (tartib muhim), Cₙᵏ = n!/(k!(n − k)!) (tartib muhim emas).", "Cₙᵏ = Cₙⁿ⁻ᵏ, Cₙ⁰ = Cₙⁿ = 1, Cₙᵏ + Cₙᵏ⁺¹ = Cₙ₊₁ᵏ⁺¹ (Paskal uchburchagi)."],
        misol: [["5 kishi qatorga necha xil tura oladi?", "5! = 120."], ["10 kishidan rais, o'rinbosar, kotib (har xil lavozim)?", "A₁₀³ = 720."], ["10 kishidan 3 kishilik guruh?", "C₁₀³ = 120."]],
        mashq: ["«KITOB» so'zi harflaridan nechta turli so'z tuziladi?", "1, 2, 3, 4, 5 raqamlaridan takrorlanmas uch xonali nechta son? Juftlari-chi?", "12 ta jamoa o'zaro bir martadan o'ynasa jami nechta o'yin?"] },
      { id: "k11-7", nom: "Nyuton binomi", test: ["t96"], mavzu: "t96", pdf: [1, 33],
        qoida: ["(a + b)ⁿ = Σ Cₙᵏ aⁿ⁻ᵏ bᵏ; umumiy had Tₖ₊₁ = Cₙᵏ aⁿ⁻ᵏ bᵏ. Koeffitsiyentlar yig'indisi 2ⁿ; Paskal uchburchagi qatori.", "(a − b)ⁿ da ishoralar almashinadi. Binom koeffitsiyentlari simmetrik."],
        misol: [["(x + 2)⁴ yoyilmasi", "x⁴ + 8x³ + 24x² + 32x + 16."], ["(2x − 1)⁶ da x⁴ oldidagi koeffitsiyent?", "C₆²·(2x)⁴·(−1)² = 15·16 = 240."]],
        mashq: ["(1 + x)⁵, (a − b)⁵ ni yoying.", "(x + 1/x)⁸ yoyilmasida x dan xoli had?", "(3 + x)¹⁰ koeffitsiyentlari yig'indisi?"] }
    ] },
    { nom: "Algebra. 4-bob. Statistika elementlari", mavzular: [
      { id: "k11-8", nom: "Ma'lumotlarni tasvirlash. O'rta qiymat, mediana, moda, standart chetlanish", test: ["t57", "t99", "t100"], mavzu: "t99", pdf: [1, 37],
        qoida: ["Jadval, gistogramma, quti diagrammasi, nuqtali diagramma. O'rta arifmetik x̄ = Σxᵢ/n; mediana — tartiblangan qatorning o'rtasi; moda — eng ko'p uchraydigan qiymat; o'zgarish kengligi R = max − min.", "Dispersiya D = Σ(xᵢ − x̄)²/n, standart chetlanish σ = √D — qiymatlarning o'rtachadan tarqoqligi."],
        misol: [["4, 7, 7, 9, 13: o'rta, mediana, moda?", "x̄ = 8, mediana 7, moda 7."], ["2, 4, 6, 8 uchun σ?", "x̄ = 5; D = (9 + 1 + 1 + 9)/4 = 5; σ = √5 ≈ 2,24."]],
        mashq: ["Baholar: 3, 5, 4, 4, 5, 2, 4, 5. O'rta, mediana, moda, R.", "Ikki sinfning o'rta ballari teng, lekin σ farqli — bu nimani bildiradi?", "Gistogramma bo'yicha mediana oraliqni aniqlang (ma'lumot: 10–20: 3, 20–30: 7, 30–40: 6, 40–50: 4)."] },
      { id: "k11-9", nom: "Ikki tur ma'lumot o'rtasidagi bog'liqlik. Sochilma diagramma va eng yaxshi moslik chizig'i", test: ["t101"], mavzu: "t101", pdf: [1, 57],
        qoida: ["Sochilma (nuqtali) diagramma: har bir juft (x; y) — nuqta. Bog'liqlik: musbat (birga o'sadi), manfiy, yo'q; kuchli / kuchsiz.", "Eng yaxshi moslik (regressiya) chizig'i y = kx + b — nuqtalarga eng yaqin to'g'ri chiziq; k — x bir birlik o'sganda y qancha o'zgaradi; chiziq bo'yicha bashorat (interpolyatsiya, ekstrapolyatsiya)."],
        misol: [["Dars soati (x) va ball (y): moslik chizig'i y = 6x + 40. 5 soat o'qigan o'quvchi taxminan?", "6·5 + 40 = 70 ball."]],
        mashq: ["Bo'y va og'irlik, harorat va muzqaymoq savdosi, yosh va bolaning uyqusi — bog'liqlik turini ayting.", "Nuqtalar (1; 3), (2; 5), (3; 7), (4; 9) — moslik chizig'i va x = 6 dagi bashorat?"] }
    ] },
    { nom: "Algebra. 5-bob. Ehtimollik va taqsimotlar", mavzular: [
      { id: "k11-10", nom: "Tasodifiy hodisalar ehtimolligi. Amallar, Eyler–Venn diagrammalari, shartli ehtimollik", test: ["t92", "t93", "t94", "t95"], mavzu: "t93", pdf: [1, 68],
        qoida: ["P(A ∪ B) = P(A) + P(B) − P(A ∩ B); birgalikda bo'lmaganda P(A ∩ B) = 0. Bog'liq bo'lmagan hodisalar: P(AB) = P(A)·P(B). Shartli: P(A|B) = P(AB)/P(B).", "Eyler–Venn: to'plamlar kesishmasi, birlashmasi, to'ldiruvchisi; inkluziya–eksklyuziya |A ∪ B| = |A| + |B| − |A ∩ B|."],
        misol: [["30 o'quvchidan 18 tasi futbol, 12 tasi shaxmat, 5 tasi ikkalasini yoqtiradi. Hech birini yoqtirmaydiganlar?", "18 + 12 − 5 = 25 → 30 − 25 = 5."], ["Ikki tanga: kamida bitta gerb?", "1 − P(ikkala raqam) = 1 − 1/4 = 3/4."]],
        mashq: ["P(A) = 0,6, P(B) = 0,5, P(AB) = 0,3. P(A ∪ B), P(A|B)?", "Merganning nishonga tegizish ehtimoli 0,8. 3 o'qdan kamida bittasi tegish ehtimoli?", "40 kishidan 25 tasi ingliz, 20 tasi rus tilini biladi, 8 tasi hech birini. Ikkalasini biladiganlar?"] },
      { id: "k11-11", nom: "Binomial va normal taqsimot haqida tushuncha", test: ["t93", "t99"], mavzu: "t99", pdf: [1, 91],
        qoida: ["Bernulli sxemasi: n ta bog'liq bo'lmagan sinovda muvaffaqiyat ehtimoli p bo'lsa, rosa k ta muvaffaqiyat Pₙ(k) = Cₙᵏ pᵏ(1 − p)ⁿ⁻ᵏ. O'rtacha np, dispersiya np(1 − p).", "Normal taqsimot — qo'ng'iroqsimon egri; 68% qiymat x̄ ± σ, 95% x̄ ± 2σ, 99,7% x̄ ± 3σ oraliqda (3σ qoidasi)."],
        misol: [["Tanga 4 marta: rosa 2 gerb?", "C₄²·(1/2)⁴ = 6/16 = 3/8."], ["Bo'y o'rtacha 170 sm, σ = 5. 165–175 sm oralig'ida taxminan necha %?", "x̄ ± σ → 68%."]],
        mashq: ["Kubik 5 marta tashlanadi. Rosa 2 marta «6» tushish ehtimoli?", "Mahsulotning 10% nosoz. 10 tadan kamida 1 tasi nosoz?", "Test ballari normal taqsimlangan: x̄ = 60, σ = 10. 80 dan yuqori ball olganlar taxminan necha %?"] }
    ] },
    { nom: "Geometriya 11. 1-bob. Ko'pyoqlar: prizma va piramida", mavzular: [
      { id: "k11-12", nom: "Prizma va parallelepiped: sirt yuzi va hajm", test: ["t75"], mavzu: "t75", pdf: [0, 1],
        qoida: ["To'g'ri prizma: yon sirt S_yon = P_asos·h, to'liq sirt S = S_yon + 2S_asos, hajm V = S_asos·h. Og'ma prizmada V = S_asos·h (h — balandlik), S_yon = P_perp.kesim·l.", "To'g'ri burchakli parallelepiped: V = abc, diagonal d² = a² + b² + c²; kub: V = a³, d = a√3, S = 6a²."],
        misol: [["Asosi 3, 4, 5 uchburchak, h = 10 to'g'ri prizma. S_yon va V?", "S_yon = 12·10 = 120; S_asos = 6; V = 60."], ["Kub sirti 54. Hajmi?", "a² = 9, a = 3, V = 27."]],
        mashq: ["Muntazam oltiburchakli prizma: a = 2, h = 5. V va S_to'liq?", "Parallelepiped 3 × 4 × 12. Diagonali va sirti?", "Muntazam uchburchakli prizmaning diagonal kesimi… (a = 4, h = 6) yuzi?"] },
      { id: "k11-13", nom: "Piramida va kesik piramida", test: ["t76"], mavzu: "t76", pdf: [1, 113],
        qoida: ["V = S_asos·H/3. Muntazam piramida: yon yoqlar — teng yonli uchburchaklar, apofema l; S_yon = P·l/2. Yon qirra b, H, apofema, asos elementlari — to'g'ri burchakli uchburchaklar orqali.", "Kesik piramida: V = H(S₁ + S₂ + √(S₁S₂))/3, muntazamda S_yon = (P₁ + P₂)·l/2."],
        misol: [["Muntazam to'rtburchakli piramida: a = 6, H = 4. Apofema, S_yon, V?", "l = √(16 + 9) = 5; S_yon = 24·5/2 = 60; V = 36·4/3 = 48."]],
        mashq: ["Muntazam uchburchakli piramida: a = 6, yon qirra 5. H va V?", "Tetraedr (hamma qirra 2): V?", "Kesik piramida asoslari 4 va 2 (kvadratlar), H = 3. V?"] }
    ] },
    { nom: "Geometriya 11. 2-bob. Aylanma jismlar: silindr, konus, shar", mavzular: [
      { id: "k11-14", nom: "Silindr va konus", test: ["t77", "t78"], mavzu: "t77", pdf: [1, 127],
        qoida: ["Silindr: S_yon = 2πRH, S = 2πR(R + H), V = πR²H; o'q kesimi — to'g'ri to'rtburchak 2R × H.", "Konus: yasovchi l² = R² + H², S_yon = πRl, S = πR(R + l), V = πR²H/3; kesik konus: V = πH(R² + Rr + r²)/3, S_yon = π(R + r)l."],
        misol: [["Silindr R = 3, H = 7. S_yon va V?", "S_yon = 42π; V = 63π."], ["Konus R = 6, H = 8. l, S_yon, V?", "l = 10; S_yon = 60π; V = 96π."]],
        mashq: ["Silindr o'q kesimi — tomoni 8 kvadrat. V?", "Konus yasovchisi 13, R = 5. S_to'liq va V?", "Yoyilmasi — radiusi 10, burchagi 216° sektor bo'lgan konusning R va H?"] },
      { id: "k11-15", nom: "Shar va sfera: hajm, sirt, sharning bo'laklari. Jismlar kombinatsiyasi", test: ["t79", "t81"], mavzu: "t79", pdf: [1, 146],
        qoida: ["V = 4πR³/3, S_sfera = 4πR². Tekislik bilan kesim — doira: r² = R² − d² (d — markazdan tekislikgacha masofa). Shar segmenti V = πh²(R − h/3), sektor V = 2πR²h/3.", "Kombinatsiya: kubga ichki shar R = a/2, tashqi R = a√3/2; silindrga ichki shar R = H/2 = R_sil; konusga ichki/tashqi shar — o'q kesimi uchburchagi orqali."],
        misol: [["R = 3 shar. V va S?", "V = 36π; S = 36π."], ["R = 5 shar markazdan 3 masofada kesildi. Kesim yuzi?", "r = 4; S = 16π."]],
        mashq: ["Sfera sirti 100π. Shar hajmi?", "Qirrasi 6 kubga ichki va tashqi chizilgan sharlar hajmlari nisbati?", "R = 6, H = 8 konusga ichki chizilgan shar radiusi?"] },
      { id: "k11-16", nom: "Fazoda koordinatalar va vektorlar. Burchak va masofalar. Kesimlar", test: ["t84", "t87", "t88"], mavzu: "t84", pdf: [0, 1],
        qoida: ["A(x₁;y₁;z₁), B(x₂;y₂;z₂): AB = √(Δx² + Δy² + Δz²), o'rta nuqta — koordinatalar o'rta arifmetigi. Vektor: koordinatalar bo'yicha qo'shish, skalyar ko'paytma a·b = x₁x₂ + y₁y₂ + z₁z₂ = |a||b|cos φ.", "Chiziqlar orasidagi burchak — yo'naltiruvchi vektorlar orqali; chiziq va tekislik — normal vektor bilan; nuqtadan tekislikkacha masofa |Ax₀ + By₀ + Cz₀ + D|/√(A² + B² + C²)."],
        misol: [["A(1; 2; 3), B(4; 6; 3). AB?", "√(9 + 16 + 0) = 5."], ["a(1; 2; 2), b(2; −1; 2) orasidagi burchak?", "cos φ = (2 − 2 + 4)/(3·3) = 4/9."]],
        mashq: ["A(2; −1; 0), B(0; 3; 4): AB uzunligi, o'rta nuqtasi.", "a(3; 0; 4) va b(0; 5; 0) perpendikulyarmi? |a|?", "M(1; 1; 1) dan 2x + 2y + z − 10 = 0 tekislikkacha masofa."] }
    ] }
  ]
};
