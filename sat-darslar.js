/*! Kuvonch Academy — SAT Math darslari (o'zbekcha, original matn). Kalit: sat-dastur.js dagi kichik mavzu id'si.
 *  Har dars: { nima: "nima so'raladi", g: [asosiy g'oyalar/formulalar], m: [[savol, yechim], ...], tuzoq: [SAT tuzoqlari], desmos: "maslahat" } */
window.SAT_DARSLAR = {
  /* ================= ALGEBRA ================= */
  "lin-eq": {
    nima: "Bir noma'lumli chiziqli tenglamani yechish, berilgan ifodadan noma'lumni ajratish (\"x ni a va b orqali ifodalang\"), tenglamaning yechimlar soni.",
    g: ["Ikkala tomonga bir xil amal: qo'shish, ayirish, ko'paytirish, bo'lish (0 ga emas).", "Qavslarni oching, o'xshash hadlarni jamlang, noma'lumlarni bir tomonga, sonlarni ikkinchi tomonga.", "Kasrli tenglama — umumiy maxrajga ko'paytirib kasrdan qutuling.", "ax + b = cx + d: a = c va b ≠ d bo'lsa yechim yo'q; a = c va b = d bo'lsa cheksiz ko'p; a ≠ c bo'lsa bitta yechim.", "\"In terms of\": so'ralgan harfni yolg'iz qoldiring, qolganlari o'ng tomonda."],
    m: [["3(x − 4) + 5 = 2x + 9. x = ?", "3x − 12 + 5 = 2x + 9 → 3x − 7 = 2x + 9 → x = 16."],
        ["(x + 2)/3 − (x − 1)/4 = 1. x = ?", "12 ga ko'paytiramiz: 4(x + 2) − 3(x − 1) = 12 → 4x + 8 − 3x + 3 = 12 → x = 1."],
        ["P = 2l + 2w. l ni P va w orqali ifodalang.", "2l = P − 2w → l = (P − 2w)/2 = P/2 − w."],
        ["kx + 6 = 4x + 6 tenglama cheksiz ko'p yechimga ega bo'lsa k = ?", "Ikki tomon bir xil bo'lishi kerak → k = 4."]],
    tuzoq: ["Savol x ni emas, 2x + 1 yoki x − 3 ni so'rashi mumkin — oxirida nima so'ralganini qayta o'qing.", "Manfiy songa ko'paytirganda ishoralarni hammasiga qo'llang: −(x − 3) = −x + 3.", "Yechim yo'q / cheksiz ko'p savollarida koeffitsiyentlarni taqqoslang, yechishga urinmang."],
    desmos: "Chap tomonni y = …, o'ng tomonni y = … deb kiriting — kesishma x koordinatasi yechim."
  },
  "lin-fun": {
    nima: "To'g'ri chiziq tenglamasi, qiyalik va kesishmalar, grafikdan tenglama tuzish, parallel/perpendikulyar chiziqlar.",
    g: ["y = mx + b: m — qiyalik (x 1 ga oshganda y qanchaga o'zgaradi), b — y-kesishma (0; b).", "Qiyalik ikki nuqtadan: m = (y₂ − y₁)/(x₂ − x₁).", "x-kesishma: y = 0 qo'yib x ni toping. y-kesishma: x = 0.", "Nuqta-qiyalik: y − y₁ = m(x − x₁). Standart: Ax + By = C → m = −A/B, y-kesishma C/B.", "Parallel: qiyaliklar teng. Perpendikulyar: m₁ · m₂ = −1 (teskari va qarama-qarshi ishorali).", "m > 0 o'suvchi, m < 0 kamayuvchi, m = 0 gorizontal; vertikal chiziq x = a."],
    m: [["(2; 5) va (6; 13) dan o'tgan chiziq tenglamasi?", "m = (13 − 5)/(6 − 2) = 2; 5 = 2·2 + b → b = 1; y = 2x + 1."],
        ["3x + 4y = 24 chiziqning x- va y-kesishmalari?", "y = 0 → x = 8; x = 0 → y = 6. (8; 0) va (0; 6)."],
        ["y = −½x + 7 ga perpendikulyar va (4; 1) dan o'tuvchi chiziq?", "m = 2; 1 = 2·4 + b → b = −7; y = 2x − 7."]],
    tuzoq: ["Standart ko'rinishda qiyalik −A/B, A/B emas.", "Grafikdagi o'qlar masshtabi har xil bo'lishi mumkin — kataklarni sanashda sonlarni o'qing.", "\"Qiyalik nimani bildiradi\" — birliklar bilan javob bering: \"har 1 soatda 15 so'm\"."],
    desmos: "Tenglamani kiritib, o'qlar bilan kesishma nuqtalarini bosing; ikki nuqtadan chiziq uchun jadval + y₁ ~ mx₁ + b."
  },
  "lin-sys": {
    nima: "Ikki noma'lumli ikki chiziqli tenglama sistemasi: yechim (x; y), yechimlar soni, so'z masalasini sistemaga aylantirish.",
    g: ["Qo'shish (eliminatsiya): bir noma'lumning koeffitsiyentlarini qarama-qarshi qiling, tenglamalarni qo'shing.", "O'rniga qo'yish: bir tenglamadan y ni ifodalab, ikkinchisiga qo'ying.", "Grafik ma'nosi: yechim — ikki chiziq kesishmasi. Parallel (bir xil qiyalik, har xil kesishma) → yechim yo'q; bir xil chiziq → cheksiz ko'p.", "a₁x + b₁y = c₁, a₂x + b₂y = c₂: a₁/a₂ = b₁/b₂ ≠ c₁/c₂ → yechim yo'q; hammasi teng → cheksiz; a₁/a₂ ≠ b₁/b₂ → bitta.", "SAT ko'pincha x + y yoki x − y ni so'raydi — ba'zan tenglamalarni shunchaki qo'shish/ayirish kifoya."],
    m: [["2x + 3y = 12, x − y = 1. x + y = ?", "x = y + 1 → 2(y + 1) + 3y = 12 → 5y = 10 → y = 2, x = 3; x + y = 5."],
        ["kx + 6y = 9 va 2x + 4y = 7 sistemasi yechimga ega bo'lmasa k = ?", "Parallel: k/2 = 6/4 → k = 3 (9/7 ≠ 3/2 — haqiqatan yechim yo'q)."],
        ["3 ta daftar va 2 ta ruchka 11 000, 1 daftar va 4 ruchka 12 000 so'm. Daftar narxi?", "3d + 2r = 11000, d + 4r = 12000 → d = 12000 − 4r → 36000 − 12r + 2r = 11000 → r = 2500, d = 2000."]],
    tuzoq: ["Yechim yo'q/cheksiz savollarida tenglamalarni bir xil ko'rinishga keltiring (y ni chapga, hammasini bir tartibda).", "Javob (x; y) juftlik emas, ko'pincha bitta son (masalan, faqat y yoki 2x + y)."],
    desmos: "Ikkala tenglamani o'zgartirmasdan kiriting, kesishma nuqtasini bosing. Chiziqlar kesishmasa — yechim yo'q."
  },
  "lin-ineq": {
    nima: "Chiziqli tengsizliklarni yechish, ularning grafigi (bo'yalgan soha), tengsizliklar sistemasi, so'z masalasini tengsizlikka aylantirish.",
    g: ["Tengsizlikni manfiy songa ko'paytirganda/bo'lganda belgi teskari aylanadi: −2x > 6 → x < −3.", "y > mx + b — chiziqdan yuqoridagi soha; y < — pastdagi. \"≥, ≤\" — chiziq ham kiradi (tutash), \"<, >\" — kirmaydi (punktir).", "Sistema yechimi — ikkala soha kesishmasi. Nuqta yechimmi? — ikkala tengsizlikka qo'yib tekshiring.", "So'z masalasida: \"kamida\" ≥, \"ko'pi bilan\" ≤, \"dan ko'p\" >, \"dan kam\" <.", "Butun yechimlar soni: chegaralarni toping, butun sonlarni sanang."],
    m: [["5 − 3x ≤ 2x + 20. x ning eng kichik qiymati?", "−5x ≤ 15 → x ≥ −3. Eng kichik: −3."],
        ["(1; 4) nuqta y > 2x + 1 va y ≤ −x + 6 sistemasining yechimimi?", "4 > 3 ✔, 4 ≤ 5 ✔ → ha."],
        ["Bir kunda ko'pi bilan 8 soat ishlab, soatiga 20 000 so'm oladi; kamida 120 000 so'm topmoqchi. Soatlar x uchun tengsizlik?", "20000x ≥ 120000 va x ≤ 8 → 6 ≤ x ≤ 8."]],
    tuzoq: ["Belgini aylantirishni faqat manfiy songa ko'paytirish/bo'lishda qiling, tomonlarni almashtirganda ham (a < b ↔ b > a).", "Grafikda qaysi tomon bo'yalganini (0; 0) nuqtani qo'yib tekshiring."],
    desmos: "Tengsizlikni to'g'ridan-to'g'ri kiriting (y < 2x + 1) — soha bo'yaladi; ikkitasini kiritsangiz kesishma qoraroq ko'rinadi."
  },
  "abs": {
    nima: "Modulli tenglama va tengsizliklar, |x − a| ning masofa ma'nosi, yechimlar soni.",
    g: ["|a| = a (a ≥ 0), |a| = −a (a < 0). |x − a| — x dan a gacha masofa.", "|ifoda| = c (c > 0) → ifoda = c yoki ifoda = −c. c < 0 bo'lsa yechim yo'q; c = 0 bo'lsa bitta.", "|ifoda| < c → −c < ifoda < c. |ifoda| > c → ifoda < −c yoki ifoda > c.", "y = |x| grafigi \"V\"; y = a|x − h| + k — uchi (h; k)."],
    m: [["|2x − 5| = 7. Yechimlar yig'indisi?", "2x − 5 = 7 → x = 6; 2x − 5 = −7 → x = −1. Yig'indi 5."],
        ["|x − 3| ≤ 4 ning butun yechimlari nechta?", "−1 ≤ x ≤ 7 → 9 ta."],
        ["|x + 1| + 3 = 2 tenglama nechta yechimga ega?", "|x + 1| = −1 — modul manfiy bo'lmaydi → 0 ta."]],
    tuzoq: ["Avval modulni yolg'iz qoldiring (qo'shimchalarni boshqa tomonga o'tkazing), keyin ikki holga ajrating.", "\"Yechimlar yig'indisi\" so'ralganda ikkala ildizni qo'shing."],
    desmos: "y = |2x − 5| va y = 7 — kesishmalar ikkita; abs(x) deb ham yozish mumkin."
  },
  "const": {
    nima: "Ikki tomoni teng (ayniyat) bo'lgan tenglamalardan noma'lum konstantani topish; sistemaning yechimlar soniga qarab konstanta.",
    g: ["Ayniyatda x ning har bir darajasi oldidagi koeffitsiyentlar teng bo'ladi: ax² + bx + c ≡ dx² + ex + f → a = d, b = e, c = f.", "Ko'paytmani oching, o'xshash hadlarni jamlang, keyin koeffitsiyentlarni taqqoslang.", "Bir noma'lumli chiziqli tenglamada yechim yo'q → x oldidagi koeffitsiyentlar teng, ozod hadlar har xil.", "Ikki tenglama bir xil chiziq bo'lsa — barcha nisbatlar teng."],
    m: [["(x + a)(x + 3) = x² + 8x + b. a + b = ?", "x² + (3 + a)x + 3a → 3 + a = 8 → a = 5; b = 15. Yig'indi 20."],
        ["cx − 4 = 7x + d tenglama yechimga ega bo'lmasa, c va d?", "c = 7, d ≠ −4."],
        ["2x + ky = 10 va 6x + 9y = 30 bir xil chiziq bo'lsa k = ?", "6/2 = 9/k = 30/10 → k = 3."]],
    tuzoq: ["Taqqoslashdan oldin ikkala tomonni bir xil tartibga (x², x, son) keltiring.", "Konstantani topgach, savol konstantaning o'zini so'raganini yoki boshqa narsani (a + b, ab) tekshiring."],
    desmos: "Noma'lum konstantaga slider qo'ying va grafiklar ustma-ust tushgunicha suring."
  },
  "word-lin": {
    nima: "Matnli masala bo'yicha chiziqli model tuzish: boshlang'ich qiymat + o'zgarish × vaqt, tarif, narx, sur'at; modelni talqin qilish.",
    g: ["Model: y = (boshlang'ich) + (bir birlikdagi o'zgarish) · x. Qiyalik = sur'at, y-kesishma = boshlang'ich.", "Kamayish — manfiy qiyalik (yoqilg'i, qarz, balandlik).", "\"Qancha vaqtda … ga yetadi\" → tenglama tuzib x ni toping.", "Birliklarni tekshiring: soat–daqiqa, so'm–ming so'm.", "Jadval berilsa, ikki qatordan qiyalikni hisoblang."],
    m: [["Taksi: 8 000 so'm boshlang'ich + har km 1 500. 12 km narxi?", "8000 + 1500·12 = 26 000 so'm."],
        ["Bakda 48 l yoqilg'i, soatiga 6 l sarflanadi. Yoqilg'i y(t) = ? Necha soatda tugaydi?", "y = 48 − 6t; 48 − 6t = 0 → t = 8 soat."],
        ["Jadval: 2 kunda 350, 5 kunda 500 dona. Modelni tuzing.", "m = 150/3 = 50; 350 = 50·2 + b → b = 250; y = 50x + 250."]],
    tuzoq: ["\"Boshlang'ich\" so'ralsa x = 0 dagi qiymat; \"sur'at\" so'ralsa qiyalik.", "Model qaysi oraliqda o'rinli — manfiy vaqt yoki manfiy miqdor bo'lmaydi."],
    desmos: "y = 48 − 6x va y = 0 kesishmasi — tugash vaqti."
  },

  /* ================= ADVANCED MATH ================= */
  "exp-rules": {
    nima: "Daraja va ildiz qoidalari bilan ifodalarni soddalashtirish, ko'phadlarni qo'shish/ayirish/ko'paytirish, ratsional ko'rsatkich.",
    g: ["aᵐ · aⁿ = aᵐ⁺ⁿ; aᵐ / aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; (ab)ⁿ = aⁿbⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ.", "a^(m/n) = ⁿ√(aᵐ): x^(1/2) = √x, x^(3/2) = x√x.", "√(ab) = √a·√b; √a + √b ≠ √(a + b)!", "√50 = √(25·2) = 5√2; ³√(x⁶) = x².", "Ko'phadlar: o'xshash hadlar — bir xil o'zgaruvchi va bir xil daraja; (a + b)(c + d) — har hadni har had bilan.", "Ko'rsatkichli tenglama: asoslarni tenglashtiring: 2^(x+1) = 8 → 2^(x+1) = 2³ → x = 2."],
    m: [["(2x³y)² · 3x = ?", "4x⁶y² · 3x = 12x⁷y²."],
        ["x^(5/2) / x^(1/2) = ?", "x^(5/2 − 1/2) = x²."],
        ["√72 − √18 = ?", "6√2 − 3√2 = 3√2."],
        ["4^(x) = 8^(x−1). x = ?", "2^(2x) = 2^(3x−3) → 2x = 3x − 3 → x = 3."]],
    tuzoq: ["(x + y)² = x² + 2xy + y², x² + y² emas.", "Manfiy ko'rsatkich sonni manfiy qilmaydi: 2⁻³ = 1/8.", "Ildizlarni faqat ko'paytma/bo'linmada ajratish mumkin, yig'indida emas."],
    desmos: "Ikki ifodani y = … deb kiriting — teng bo'lsa grafiklar ustma-ust tushadi (ekvivalentlik tekshiruvi)."
  },
  "factor": {
    nima: "Qisqa ko'paytirish formulalari, kvadrat uchhadni ko'paytuvchilarga ajratish, umumiy ko'paytuvchi, guruhlash.",
    g: ["a² − b² = (a − b)(a + b); a² ± 2ab + b² = (a ± b)².", "x² + bx + c = (x + p)(x + q), bunda p + q = b, p·q = c.", "ax² + bx + c (a ≠ 1): ac ni topib, yig'indisi b bo'lgan ikki songa bo'ling, guruhlang.", "Avval umumiy ko'paytuvchini chiqaring: 3x² − 12 = 3(x² − 4) = 3(x − 2)(x + 2).", "Guruhlash: x³ + 2x² − 5x − 10 = x²(x + 2) − 5(x + 2) = (x² − 5)(x + 2)."],
    m: [["x² − 7x + 12 ni ajrating.", "p + q = −7, pq = 12 → (x − 3)(x − 4)."],
        ["2x² + 7x + 3 ni ajrating.", "ac = 6, yig'indi 7 → 6 va 1: 2x² + 6x + x + 3 = 2x(x + 3) + (x + 3) = (2x + 1)(x + 3)."],
        ["9x² − 25 = ?", "(3x − 5)(3x + 5)."],
        ["x² − 10x + k to'liq kvadrat bo'lsa k = ?", "(x − 5)² → k = 25."]],
    tuzoq: ["a² + b² ko'paytuvchilarga ajralmaydi (haqiqiy sonlarda).", "Ishoralar: c > 0 bo'lsa p va q bir xil ishorali (b ning ishorasida), c < 0 bo'lsa har xil."],
    desmos: "Asl ifoda va ajratilgan ko'rinishni ikki grafik qilib kiriting — ustma-ust tushsa to'g'ri."
  },
  "quad-eq": {
    nima: "Kvadrat tenglamani yechish (ko'paytuvchilar, formula, to'liq kvadrat), ildizlar soni, Vyet teoremasi, ildizlar yig'indisi/ko'paytmasi.",
    g: ["ax² + bx + c = 0: x = (−b ± √D)/(2a), D = b² − 4ac.", "D > 0 → 2 ta haqiqiy ildiz; D = 0 → 1 ta (ikki karrali); D < 0 → haqiqiy ildiz yo'q.", "Vyet: x₁ + x₂ = −b/a, x₁·x₂ = c/a — ildizlarni topmasdan yig'indi/ko'paytma.", "To'liq kvadrat: x² + 6x + 2 = (x + 3)² − 7.", "Grafik: ildizlar — parabolaning x o'qi bilan kesishmalari."],
    m: [["x² − 5x − 14 = 0 ning ildizlari?", "(x − 7)(x + 2) = 0 → 7 va −2."],
        ["2x² + 3x − 1 = 0 ildizlari yig'indisi va ko'paytmasi?", "Vyet: −3/2 va −1/2."],
        ["x² + kx + 16 = 0 bitta ildizga ega bo'lsa k ning musbat qiymati?", "D = k² − 64 = 0 → k = 8."],
        ["3x² − 2x + 5 = 0 nechta haqiqiy ildizga ega?", "D = 4 − 60 < 0 → 0 ta."]],
    tuzoq: ["Formulada −b: b manfiy bo'lsa −b musbat bo'ladi.", "\"Ildizlar yig'indisi\" so'ralsa Vyet orqali 5 soniyada: −b/a.", "Tenglamani avval = 0 ko'rinishiga keltiring."],
    desmos: "y = ax² + bx + c kiriting, x o'qi bilan kesishmalarni bosing — ildizlar; kesishmasa haqiqiy ildiz yo'q."
  },
  "parab": {
    nima: "Parabolaning uchi, simmetriya o'qi, eng katta/kichik qiymat, uchta ko'rinish orasida o'tish, grafik bo'yicha koeffitsiyent ishorasi.",
    g: ["Standart: y = ax² + bx + c — y-kesishma c; uchi x = −b/(2a).", "Uch (vertex) ko'rinishi: y = a(x − h)² + k — uchi (h; k), simmetriya o'qi x = h.", "Ildizli ko'rinish: y = a(x − r₁)(x − r₂) — ildizlar r₁, r₂; uchi x = (r₁ + r₂)/2.", "a > 0 — yuqoriga ochiq (minimum k); a < 0 — pastga (maksimum k). |a| katta — tor.", "\"Eng katta balandlik\" / \"eng kam xarajat\" — uchning y koordinatasi."],
    m: [["y = x² − 6x + 11 ning uchi?", "x = 6/2 = 3; y = 9 − 18 + 11 = 2 → (3; 2)."],
        ["y = −2(x + 1)² + 8 ning eng katta qiymati va simmetriya o'qi?", "8; x = −1."],
        ["Ildizlari 2 va 8 bo'lgan parabolaning simmetriya o'qi?", "x = (2 + 8)/2 = 5."],
        ["h(t) = −5t² + 20t + 1 — to'p qaysi vaqtda eng balandda?", "t = −20/(−10) = 2 s; h = 21 m."]],
    tuzoq: ["Uch ko'rinishida (x − h)²: y = (x + 3)² bo'lsa h = −3.", "Savol uchning x sini (vaqt) yoki y sini (balandlik) so'rayotganini ajrating."],
    desmos: "Parabolani kiriting, eng past/baland nuqtani bosing — uchi ko'rinadi."
  },
  "fun": {
    nima: "Funksiya qiymatini hisoblash, jadval/grafikdan f(a) ni o'qish, kompozitsiya f(g(x)), teskari funksiya, aniqlanish sohasi.",
    g: ["f(x) — x ga mos qoida; f(3) — x o'rniga 3 qo'ying (hamma joyda, qavs bilan).", "f(g(2)): avval g(2), so'ng natijani f ga qo'ying — ichkaridan tashqariga.", "Grafikda f(a) = b ↔ (a; b) nuqta grafikda. f(x) = 0 ildizlari — x o'qi bilan kesishma.", "Teskari f⁻¹: x va y o'rnini almashtirib y ni toping. f(a) = b ↔ f⁻¹(b) = a.", "Aniqlanish sohasi: maxraj ≠ 0, ildiz ostidagi ≥ 0."],
    m: [["f(x) = 2x² − 3x. f(−2) = ?", "2·4 − 3·(−2) = 8 + 6 = 14."],
        ["f(x) = x + 5, g(x) = x². g(f(1)) va f(g(1))?", "f(1) = 6 → g = 36; g(1) = 1 → f = 6."],
        ["Jadval: f(1) = 4, f(2) = 7, f(4) = 1. f(f(1)) = ?", "f(1) = 4 → f(4) = 1."],
        ["f(x) = 3x − 6 ning teskarisi?", "y = 3x − 6 → x = (y + 6)/3 → f⁻¹(x) = (x + 6)/3."]],
    tuzoq: ["f(x + 1) ≠ f(x) + 1: butun ifodani x o'rniga qo'ying.", "Kompozitsiya tartibi muhim: f(g(x)) ≠ g(f(x)) odatda."],
    desmos: "f(x) = … deb kiriting, keyin f(g(x)) yoki f(3) ni alohida qatorga yozing — Desmos qiymatni ko'rsatadi."
  },
  "shift": {
    nima: "Funksiya grafigini siljitish, aks ettirish, cho'zish: f(x) + k, f(x − h), −f(x), f(−x), a·f(x).",
    g: ["f(x) + k — yuqoriga k (k < 0 pastga). f(x − h) — o'ngga h (f(x + h) — chapga!).", "−f(x) — x o'qiga nisbatan aks (teskari ag'dariladi); f(−x) — y o'qiga nisbatan.", "a·f(x): |a| > 1 vertikal cho'ziladi, 0 < |a| < 1 siqiladi.", "Uch/nuqta ham shunday siljiydi: (h; k) → (h + 3; k − 2) va h.k.", "y = (x − 2)² + 5: y = x² ni o'ngga 2, yuqoriga 5."],
    m: [["y = x² grafigi chapga 3, pastga 4 siljitilsa tenglama?", "y = (x + 3)² − 4."],
        ["g(x) = f(x − 1) + 2 va f ning uchi (0; 0). g ning uchi?", "(1; 2)."],
        ["y = f(x) da (2; 5) nuqta bor. y = −f(x) + 1 da mos nuqta?", "(2; −5 + 1) = (2; −4)."]],
    tuzoq: ["x ichidagi siljish \"teskari\": (x − 3) → o'ngga, (x + 3) → chapga.", "Amallar tartibi: avval aks/cho'zish, keyin siljitish."],
    desmos: "f(x) = x² kiriting, keyin f(x − a) + b ni slider bilan — siljishni jonli ko'ring."
  },
  "expo": {
    nima: "Ko'rsatkichli o'sish/kamayish modeli, foizli o'sish, ikkilanish/yarim yemirilish, grafik va asos ma'nosi.",
    g: ["y = a·bˣ: a — boshlang'ich (x = 0), b — har qadamdagi ko'paytuvchi. b > 1 o'sish, 0 < b < 1 kamayish.", "r % o'sish: b = 1 + r/100; r % kamayish: b = 1 − r/100. 12% o'sish → b = 1,12.", "Vaqt birligi boshqa bo'lsa: y = a(1 + r)^(t/k) — har k birlikda bir marta.", "Ikkilanish: y = a·2^(t/T); yarim yemirilish: y = a·(½)^(t/T).", "Chiziqli — bir xil son qo'shiladi; ko'rsatkichli — bir xil songa ko'paytiriladi."],
    m: [["Aholisi 50 000, yiliga 3% o'sadi. 4 yildan keyin? (model)", "P = 50000·1,03⁴ ≈ 56 275."],
        ["Mashina 30 mln, har yili 15% arzonlashadi. 2 yildan keyin?", "30·0,85² = 21,675 mln."],
        ["y = 200·(1,5)ˣ da boshlang'ich qiymat va o'sish foizi?", "200; har qadamda 50%."],
        ["Bakteriya har 3 soatda ikkilanadi, boshlang'ich 400. 12 soatdan keyin?", "400·2^(12/3) = 400·16 = 6 400."]],
    tuzoq: ["b = 1,05 → 5% o'sish, 105% emas. b = 0,8 → 20% kamayish.", "Ko'rsatkich t/k — \"har 3 soatda\" bo'lsa t/3."],
    desmos: "y = 50000·1.03^x va y = 60000 kesishmasi — qachon 60 000 ga yetadi."
  },
  "lin-quad": {
    nima: "Chiziq va parabola sistemasi: kesishma nuqtalari, kesishmalar soni, urinma holati.",
    g: ["y ni tenglashtiring: mx + b = ax² + bx + c → kvadrat tenglama; ildizlar — kesishmalarning x lari.", "Yechimlar soni = diskriminant: D > 0 ikki, D = 0 bitta (urinma), D < 0 yo'q.", "Aylana va chiziq ham shunday: (x − a)² + (y − b)² = r² ga y = … ni qo'ying."],
    m: [["y = x² − 2x va y = x + 4 kesishma nuqtalari?", "x² − 3x − 4 = 0 → x = 4, −1 → (4; 8), (−1; 3)."],
        ["y = x² + 3 va y = 2x + k faqat bir nuqtada kesishsa k = ?", "x² − 2x + 3 − k = 0, D = 4 − 4(3 − k) = 0 → k = 2."]],
    tuzoq: ["Savol ko'pincha nuqtaning faqat bitta koordinatasini yoki ularning yig'indisini so'raydi.", "\"Kesishmaydi\" — D < 0 shart."],
    desmos: "Ikkala grafikni kiriting, kesishma nuqtalarini bosing; k uchun slider."
  },
  "rational": {
    nima: "Algebraik kasrlarni soddalashtirish, qo'shish, bo'lish; kasrli tenglamalar; maxraj nolga aylanmasligi.",
    g: ["Surat va maxrajni ko'paytuvchilarga ajrating, umumiy ko'paytuvchini qisqartiring: (x² − 9)/(x − 3) = x + 3 (x ≠ 3).", "Qo'shish — umumiy maxraj: 1/x + 1/y = (x + y)/(xy).", "Bo'lish — teskarisiga ko'paytirish.", "Kasrli tenglama: umumiy maxrajga ko'paytirib yeching, so'ng maxrajni 0 qiladigan ildizlarni chiqarib tashlang.", "(x² + 5x + 6)/(x + 2) ni bo'lish: ko'paytuvchi (x + 2)(x + 3) → x + 3."],
    m: [["(2x² − 8)/(x² − 4x + 4) ni soddalashtiring.", "2(x − 2)(x + 2)/(x − 2)² = 2(x + 2)/(x − 2)."],
        ["3/(x − 1) = 2/(x + 2). x = ?", "3(x + 2) = 2(x − 1) → 3x + 6 = 2x − 2 → x = −8."],
        ["(x + 1)/x − 1/(x + 1) = ?", "[(x + 1)² − x]/[x(x + 1)] = (x² + x + 1)/[x(x + 1)]."]],
    tuzoq: ["Maxrajni 0 qiladigan x javob bo'la olmaydi — tekshiring.", "Faqat ko'paytuvchi qisqaradi, qo'shiluvchi emas: (x + 3)/x ≠ 3."],
    desmos: "Ifodani y = … deb kiriting; vertikal asimptota — maxraj 0 bo'lgan joy."
  },
  "radical": {
    nima: "Ildizli tenglamalar, ikki tomonni kvadratga ko'tarish, begona (extraneous) ildizlarni tekshirish.",
    g: ["Avval ildizni yolg'iz qoldiring, keyin ikkala tomonni kvadratga ko'taring.", "Kvadratga ko'tarish yangi \"soxta\" ildizlar qo'shishi mumkin — HAR BIR ildizni asl tenglamaga qo'yib tekshiring.", "√(ifoda) manfiy bo'la olmaydi: √(x + 2) = −3 → yechim yo'q.", "Ildiz ostidagi ifoda ≥ 0 — aniqlanish sohasi.", "Testda: variantlarni asl tenglamaga qo'yib ko'rish (backsolving) eng tez usul."],
    m: [["√(2x + 7) = x + 2. x = ?", "2x + 7 = x² + 4x + 4 → x² + 2x − 3 = 0 → x = 1 yoki −3. Tekshir: x = 1: √9 = 3 ✔; x = −3: √1 = 1, −1 ✘. Javob: 1."],
        ["√(x − 1) + 5 = 2 nechta yechimga ega?", "√(x − 1) = −3 → 0 ta."],
        ["√(3x + 1) = 4. x = ?", "3x + 1 = 16 → x = 5. Tekshir: √16 = 4 ✔."]],
    tuzoq: ["Kvadratga ko'tarishdan oldin ildizni yolg'iz qoldiring, (a + √b)² ni to'g'ri oching.", "\"Yechimlar to'plami\" savolida begona ildizni chiqarib tashlang."],
    desmos: "Chap va o'ng tomonlarni alohida grafik qiling — faqat haqiqiy kesishmalar yechim (begona ildizlar kesishmaydi)."
  },
  "poly": {
    nima: "Ko'phad grafigi: ildizlar, karrali ildizlar, uchlar soni; qoldiq teoremasi; ko'paytuvchi teoremasi; bo'lish.",
    g: ["Ko'phadning ildizlari — grafik x o'qini kesgan/urgan joylar; (x − a) ko'paytuvchi ↔ a ildiz ↔ p(a) = 0.", "Juft karrali ildiz — grafik o'qqa urinib qaytadi; toq — kesib o'tadi.", "Qoldiq teoremasi: p(x) ni (x − a) ga bo'lgandagi qoldiq = p(a).", "n-darajali ko'phadda ko'pi bilan n ta ildiz va n − 1 ta uch.", "Bosh koeffitsiyent va daraja — uchlarning yo'nalishini beradi."],
    m: [["p(x) = x³ − 4x² + x + 6 ni (x − 2) ga bo'lgandagi qoldiq?", "p(2) = 8 − 16 + 2 + 6 = 0 → qoldiq 0, (x − 2) — ko'paytuvchi."],
        ["p(x) = (x + 1)²(x − 3). Ildizlari va grafik x = −1 da nima qiladi?", "−1 (ikki karrali — urinib qaytadi), 3 (kesib o'tadi)."],
        ["p(1) = 5 bo'lsa, p(x) ni (x − 1) ga bo'lganda qoldiq?", "5."]],
    tuzoq: ["Jadvalda p(a) = 0 bo'lgan a lar — ildizlar; (x + 2) ko'paytuvchi ↔ ildiz −2.", "Qoldiq teoremasi faqat (x − a) ko'rinishidagi bo'luvchi uchun."],
    desmos: "Ko'phadni kiritib ildizlarni va uchlarni bosing; p(2) ni alohida qatorda hisoblang."
  },
  "interp": {
    nima: "Chiziqli, kvadratik va ko'rsatkichli modeldagi sonlar nimani bildiradi: boshlang'ich qiymat, sur'at, foiz, uch, ildiz.",
    g: ["y = mx + b: b — boshlang'ich (x = 0), m — har birlikdagi o'zgarish.", "y = a·bˣ: a — boshlang'ich, b — ko'paytuvchi (b − 1 → foiz).", "y = a(x − h)² + k: k — eng katta/kichik qiymat, h — qachon.", "y = a(x − r₁)(x − r₂): r lar — y = 0 bo'lgan paytlar (yerga tushish, foyda nol).", "Shakl o'zgartirilsa ma'no ko'rinadi: ko'paytuvchi ko'rinishi — ildizlar, uch ko'rinishi — maksimum."],
    m: [["C(n) = 120n + 2 500 — n ta mahsulot xarajati. 2 500 nima?", "Doimiy (boshlang'ich) xarajat, mahsulot soniga bog'liq emas."],
        ["V(t) = 18 000·(0,92)ᵗ. 0,92 nima?", "Har yili qiymat 92% qoladi, ya'ni 8% kamayadi."],
        ["h(t) = −5(t − 3)² + 50. 3 va 50?", "3 s da eng baland nuqta 50 m."]],
    tuzoq: ["\"Nimani bildiradi\" savollarida variantlardan birlikka mos kelganini tanlang.", "Foizni ko'paytuvchidan ayirib oling: 1,08 → 8% o'sish."],
    desmos: "Modelni kiritib, x = 0 va uch nuqtalarini bosing — sonlar grafikda qayerda ekanini ko'ring."
  },
  "complex": {
    nima: "i bilan amallar: qo'shish, ko'paytirish, i ning darajalari, qo'shma son, bo'lish.",
    g: ["i² = −1, i³ = −i, i⁴ = 1 — har 4 ta takrorlanadi.", "(a + bi) + (c + di) = (a + c) + (b + d)i.", "(a + bi)(c + di) = (ac − bd) + (ad + bc)i.", "Qo'shma: a − bi; (a + bi)(a − bi) = a² + b².", "Bo'lish: surat va maxrajni maxrajning qo'shmasiga ko'paytiring."],
    m: [["(2 + 3i)(4 − i) = ?", "8 − 2i + 12i − 3i² = 8 + 10i + 3 = 11 + 10i."],
        ["i¹⁰ = ?", "10 = 4·2 + 2 → i² = −1."],
        ["(3 + i)/(1 − i) = ?", "(3 + i)(1 + i)/2 = (3 + 3i + i + i²)/2 = (2 + 4i)/2 = 1 + 2i."]],
    tuzoq: ["i² ni −1 ga almashtirishni unutmang.", "Javobni a + bi ko'rinishida yozing; haqiqiy qism va mavhum qism ajratilgan."],
    desmos: "Desmos'da i bilan to'g'ridan-to'g'ri hisoblash yo'q — qo'lda; faqat i ning darajasi uchun qoldiqni hisoblang."
  },

  /* ================= PROBLEM-SOLVING & DATA ================= */
  "ratio": {
    nima: "Nisbat, proporsiya, birlik tezlik (narx/dona, km/soat), nisbat bo'yicha bo'lish, masshtab.",
    g: ["a : b nisbat — a/b. Umumiy k bo'lak: a = 3k, b = 5k → jami 8k.", "Proporsiya a/b = c/d → ad = bc (ko'ndalang ko'paytirish).", "Birlik tezlik: jami / miqdor. Solishtirishda bir xil birlikka keltiring.", "Masshtab 1 : n — chizmadagi 1 birlik haqiqatda n birlik; yuza n², hajm n³ marta.", "Nisbatni o'zgartirish: \"3 : 5 bo'lishi uchun nechta qo'shish kerak\" → tenglama."],
    m: [["Sinfda qizlar : o'g'illar = 4 : 3, jami 35. Qizlar?", "7k = 35 → k = 5 → 20."],
        ["3 kg olma 24 000 so'm. 5 kg?", "8 000/kg → 40 000."],
        ["x/12 = 7/4. x = ?", "4x = 84 → x = 21."],
        ["Xaritada 1 : 50 000; 6 sm — haqiqatda?", "300 000 sm = 3 km."]],
    tuzoq: ["\"a ning b ga nisbati\" — a/b, teskarisi emas.", "Qism : qism va qism : jami ni aralashtirmang."],
    desmos: "Oddiy hisob — to'rt amal rejimi yetarli; proporsiya uchun 7/4·12."
  },
  "percent": {
    nima: "Foizni topish, foizli o'zgarish, ketma-ket o'zgarishlar, boshlang'ich qiymatni qaytarish, foiz nuqtasi.",
    g: ["p% dan a → a·p/100. \"a ning necha foizi b\" → b/a·100.", "p% oshirish → ×(1 + p/100); kamaytirish → ×(1 − p/100).", "O'zgarish foizi = (yangi − eski)/eski · 100.", "Ketma-ket: 20% oshib, 20% kamaysa — 1,2·0,8 = 0,96 → 4% kam.", "Boshlang'ich qiymat: yangi / ko'paytuvchi. 30% chegirma bilan 56 000 → 56 000/0,7 = 80 000."],
    m: [["Narx 80 000 dan 92 000 ga oshdi. Necha foiz?", "12 000/80 000 = 15%."],
        ["Mahsulot 25% chegirma bilan 45 000. Asl narxi?", "45 000/0,75 = 60 000."],
        ["150 ning 40% ining 30% i?", "150·0,4·0,3 = 18."],
        ["Aholi 2 yil ketma-ket 10% o'sdi. Umumiy o'sish?", "1,1² = 1,21 → 21%."]],
    tuzoq: ["Foizlar qo'shilmaydi: ketma-ket o'zgarishni ko'paytiring.", "\"Necha foiz ko'p\" — farq / kichikroq (asos) ga bo'linadi.", "Foiz nuqtasi (percentage point) — foizlar ayirmasi, foiz o'zgarishi emas."],
    desmos: "45000/0.75 kabi hisoblar; ko'p qadamli o'zgarish uchun 80000·1.1²."
  },
  "units": {
    nima: "Birliklarni o'tkazish (uzunlik, vaqt, massa, tezlik), o'lchamlar tahlili, kvadrat/kub birliklar, berilgan nisbat bilan konvertatsiya.",
    g: ["Kasr zanjiri: 72 km/soat = 72 km/soat · 1000 m/km · 1 soat/3600 s = 20 m/s — birliklar qisqaradi.", "Kvadrat birlik: 1 m² = 10 000 sm²; kub: 1 m³ = 1 000 000 sm³ = 1 000 l.", "Berilgan kurs/nisbat bilan: 1 dyuym = 2,54 sm → 10 dyuym = 25,4 sm.", "Tezlik·vaqt = masofa; birliklar mos bo'lsin (daqiqa → soat)."],
    m: [["90 km/soat = ? m/s", "90·1000/3600 = 25 m/s."],
        ["2,5 m² = ? sm²", "25 000 sm²."],
        ["Mashina 45 daqiqada 60 km yurdi. Tezligi km/soat?", "60/(0,75) = 80."],
        ["1 funt ≈ 0,45 kg. 20 kg ≈ ? funt", "20/0,45 ≈ 44,4."]],
    tuzoq: ["Kvadrat va kub birlikda ko'paytuvchini ham kvadrat/kubga ko'taring.", "Daqiqani soatga o'tkazmasdan tezlikni hisoblamang."],
    desmos: "90·1000/3600 — oddiy hisob; birliklarni kasr zanjirida yozib tekshiring."
  },
  "center": {
    nima: "O'rta arifmetik, mediana, moda, kenglik; jadval va chastota bo'yicha; yangi qiymat qo'shilganda o'zgarish; o'rtacha orqali yo'qolgan sonni topish.",
    g: ["O'rtacha = yig'indi / soni → yig'indi = o'rtacha · soni (eng foydali ko'rinish).", "Mediana — tartiblangan qatorning o'rtasi; juft bo'lsa o'rtadagi ikkitasining o'rtasi.", "Moda — eng ko'p uchraydigan; kenglik = max − min.", "Chastota jadvalida: yig'indi = Σ(qiymat · chastota).", "Katta chetki qiymat o'rtachani kuchli siljitadi, medianani deyarli yo'q."],
    m: [["5 ta sonning o'rtachasi 12; oltinchi son 24 qo'shildi. Yangi o'rtacha?", "(60 + 24)/6 = 14."],
        ["4 ta test o'rtachasi 78. 5-testda necha olsa o'rtacha 80 bo'ladi?", "400 − 312 = 88."],
        ["{3, 7, 7, 10, 15, 20} medianasi?", "(7 + 10)/2 = 8,5."],
        ["To'plamga juda katta son qo'shilsa o'rtacha va mediana?", "O'rtacha sezilarli oshadi, mediana deyarli o'zgarmaydi."]],
    tuzoq: ["Medianadan oldin tartiblang!", "O'rtacha savollarida avval yig'indini toping, keyin ishlang."],
    desmos: "L = [3,7,7,10,15,20]; mean(L), median(L) — bir qatorda."
  },
  "spread": {
    nima: "Standart og'ish ma'nosi va taqqoslash, tasodifiy tanlanma va natijani butun guruhga ko'chirish, xatolik chegarasi, noxolis tanlanma.",
    g: ["Standart og'ish (σ) — qiymatlar o'rtachadan o'rtacha qancha uzoq. Zich → kichik σ, tarqoq → katta σ. SAT'da hisoblash emas, taqqoslash.", "Hamma qiymatga son qo'shish σ ni o'zgartirmaydi; k ga ko'paytirish σ ni k marta oshiradi.", "Tasodifiy tanlanma → natija butun populyatsiyaga: taxmin = N · p.", "Xatolik chegarasi ±m: haqiqiy qiymat p − m … p + m oralig'ida (ishonch bilan). Tanlanma katta → m kichik.", "Noxolislik: ixtiyoriylar, bitta guruh, qulay joydan so'rash — xulosa faqat shu guruhga tegishli."],
    m: [["A = {10, 11, 12}, B = {5, 11, 17}. Qaysi birining σ si katta?", "B — qiymatlar o'rtachadan uzoq."],
        ["3 000 talabadan tasodifiy 150 tasi so'raldi, 40% kutubxonadan foydalanadi. Taxmin?", "3000·0,4 = 1 200."],
        ["So'rov: 52% ± 3%. Oraliq?", "49% – 55%."],
        ["Sport zalda so'rov o'tkazib \"shahar aholisining 80% sport bilan shug'ullanadi\" deyish to'g'rimi?", "Yo'q — tanlanma noxolis, faqat zalga kelganlar."]],
    tuzoq: ["\"Qaysi xulosa to'g'ri\" savollarida tanlanma kimdan olinganini tekshiring — xulosa faqat shu populyatsiyaga.", "Xatolik chegarasi kichik bo'lishi uchun tanlanma katta bo'lishi kerak, populyatsiya emas."],
    desmos: "stdevp([10,11,12]) va stdevp([5,11,17]) — taqqoslab ko'ring."
  },
  "plots": {
    nima: "Nuqtali diagramma, gistogramma, quti diagrammasi va jadvallardan ma'lumot o'qish: soni, moda, mediana, IQR, foizlar.",
    g: ["Nuqtali: har nuqta — 1 ta ma'lumot; mediana — tartibdagi o'rtadagi nuqta; moda — eng baland ustun.", "Gistogramma: ustun = oraliqdagi chastota; aniq qiymatlar noma'lum, faqat soni.", "Quti: min — Q1 — mediana — Q3 — max; quti ichida 50%; IQR = Q3 − Q1; har bo'lakda ≈25%.", "Ikki quti diagrammasini taqqoslash: mediana (markaz), IQR/kenglik (tarqoqlik).", "Jadval (two-way): qator va ustun yig'indilari, \"… lar ichida … ning ulushi\"."],
    m: [["Nuqtali: 2 → 3 ta, 3 → 5 ta, 4 → 2 ta. Mediana?", "10 ta; 5- va 6- ikkalasi 3 → 3."],
        ["Quti: min 10, Q1 15, med 20, Q3 28, max 40. IQR va 28 dan katta ulush?", "13; ≈25%."],
        ["Gistogramma: 0–5: 4, 5–10: 9, 10–15: 7. Jami va mediana oralig'i?", "20; 10,5-qiymat → 5–10."]],
    tuzoq: ["Gistogrammadan o'rtachani aniq hisoblab bo'lmaydi — faqat baholash.", "Quti diagrammada quti uzunligi — IQR, kenglik emas."],
    desmos: "boxplot([...]) va histogram([...]) — ro'yxatni kiritib diagrammani ko'ring."
  },
  "scatter": {
    nima: "Sochilma diagramma, moslik chizig'i tenglamasi, bashorat, qiyalik va kesishma ma'nosi, qoldiq, bog'lanish turi (musbat/manfiy, chiziqli/ko'rsatkichli).",
    g: ["Moslik chizig'i y = mx + b: m — x bir birlik oshganda y ning o'rtacha o'zgarishi; b — x = 0 dagi bashorat.", "Bashorat: x ni chiziqqa qo'ying. Haqiqiy nuqta chiziqdan yuqorida — bashoratdan katta.", "Qoldiq = haqiqiy − bashorat.", "Nuqtalar yuqoriga ketsa — musbat bog'lanish, pastga — manfiy; egri bo'lsa — ko'rsatkichli/kvadratik model.", "Chiziqdan eng uzoq nuqta — eng katta qoldiq."],
    m: [["y = 2,5x + 10 (x — soat, y — ball). x = 6 da bashorat; haqiqiy 28. Qoldiq?", "25; 28 − 25 = +3 (chiziqdan yuqorida)."],
        ["Qiyalik 2,5 nimani bildiradi?", "Har qo'shimcha soat o'qish o'rtacha 2,5 ball qo'shadi."],
        ["Chiziq (2; 14) va (6; 26) dan o'tadi. Tenglama?", "m = 3; b = 8; y = 3x + 8."]],
    tuzoq: ["Bashorat uchun chiziqni ishlating, eng yaqin nuqtani emas.", "y-kesishma grafikda ko'rinmasa ham tenglamadan oling; o'q 0 dan boshlanmagan bo'lishi mumkin."],
    desmos: "Jadvalga nuqtalarni kiriting, y₁ ~ mx₁ + b — m va b chiqadi; qoldiqlarni ham ko'rsatadi."
  },
  "prob": {
    nima: "Klassik ehtimollik, jadval (two-way table) bo'yicha ehtimollik, shartli ehtimollik \"… bo'lganlar ichida\", qo'shish va ko'paytirish qoidalari.",
    g: ["P = qulay / jami (0 dan 1 gacha).", "Jadvalda: \"tasodifiy tanlangan kishi A bo'lish ehtimoli\" = A qatori yig'indisi / umumiy.", "Shartli: \"A bo'lganlar ichida B\" → maxraj — faqat A qatori/ustuni yig'indisi.", "\"Yoki\" (birga bo'lmasa) → qo'shish; \"va\" (bog'liqsiz) → ko'paytirish.", "Qarama-qarshi: P(bo'lmaydi) = 1 − P."],
    m: [["Jadval: o'g'illar — sport 12, sport emas 8; qizlar — sport 9, sport emas 11. Tasodifiy o'quvchi sportchi bo'lish ehtimoli?", "21/40."],
        ["O'sha jadvalda qizlar ichidan sportchi?", "9/20."],
        ["Tangani 2 marta tashlaganda ikkalasi gerb?", "½·½ = ¼."],
        ["Qutida 5 qizil, 3 ko'k. Birinchi qizil, qaytarmasdan ikkinchi ko'k?", "5/8·3/7 = 15/56."]],
    tuzoq: ["Shartli ehtimollikda maxraj — shartga mos guruh, umumiy jami emas.", "Qaytarmasdan olishda ikkinchi ehtimolda jami 1 ga kamayadi."],
    desmos: "Kasrlarni hisoblash: 5/8·3/7 — natijani kasr ko'rinishida ham ko'rsatadi."
  },
  "combo": {
    nima: "Sanash qoidalari: ko'paytirish qoidasi, o'rin almashtirish (tartib muhim), guruhlash (tartib muhim emas).",
    g: ["Ko'paytirish qoidasi: n₁ · n₂ · … (har qadamdagi tanlovlar).", "n! = n·(n−1)·…·1; 0! = 1.", "Joylashtirish P(n, k) = n!/(n − k)! — tartib muhim.", "Guruhlash C(n, k) = n!/(k!(n − k)!) — tartib muhim emas; C(n, k) = C(n, n − k).", "\"Komissiya, jamoa\" → C; \"parol, saf, mukofot joylari\" → P."],
    m: [["4 ta harf va 3 ta raqamdan 2 harf + 1 raqam kod (takror mumkin)?", "4·4·3 = 48."],
        ["7 kishidan 3 kishilik komissiya?", "C(7,3) = 35."],
        ["5 kitobni javonga necha xil terish mumkin?", "5! = 120."]],
    tuzoq: ["Tartib muhimmi? — bu savolga javob berib keyin formula tanlang.", "SAT'da bu mavzu kam; asosan ko'paytirish qoidasi."],
    desmos: "nCr(7,3), nPr(5,2), 5! — Desmos tushunadi."
  },
  "growth": {
    nima: "Jadval yoki tavsifdan chiziqli va ko'rsatkichli modelni ajratish, mos modelni tanlash.",
    g: ["Chiziqli: teng qadamda bir xil son qo'shiladi (ayirma doimiy).", "Ko'rsatkichli: teng qadamda bir xil songa ko'paytiriladi (nisbat doimiy).", "\"Har yili 500 ga\" → chiziqli; \"har yili 5% ga\" → ko'rsatkichli.", "Uzoq muddatda ko'rsatkichli o'sish har qanday chiziqlini ortda qoldiradi."],
    m: [["Jadval: 100, 150, 225, 337,5. Model?", "Nisbat 1,5 doimiy → ko'rsatkichli y = 100·1,5ˣ."],
        ["Jadval: 40, 55, 70, 85. Model?", "Ayirma 15 → chiziqli y = 40 + 15x."]],
    tuzoq: ["Ikki qo'shni qiymatning ham ayirmasini, ham nisbatini tekshiring.", "Foiz bilan o'sish — hamisha ko'rsatkichli."],
    desmos: "Jadvalga kiriting; y₁ ~ mx₁ + b va y₁ ~ a·bˣ¹ — qaysi biri nuqtalarga yaxshi tushadi."
  },

  /* ================= GEOMETRY & TRIG ================= */
  "angles": {
    nima: "Kesishuvchi va parallel chiziqlar burchaklari, uchburchak burchaklari, tashqi burchak, ko'pburchak ichki burchaklari yig'indisi.",
    g: ["Vertikal burchaklar teng; qo'shni burchaklar 180°.", "Parallel chiziqlar va kesuvchi: mos, ichki almashinuvchi burchaklar teng; bir tomonli ichki — 180°.", "Uchburchak burchaklari yig'indisi 180°; tashqi burchak = ikki ichki (unga qo'shni bo'lmagan) yig'indisi.", "n-burchak: ichki yig'indi (n − 2)·180°; muntazam — har biri (n − 2)·180°/n; tashqi yig'indi hamisha 360°.", "Teng yonli uchburchakda asos burchaklari teng; teng tomonlida hammasi 60°."],
    m: [["Parallel chiziqlar, kesuvchi bilan 65° burchak. Unga bir tomonli ichki burchak?", "180 − 65 = 115°."],
        ["Uchburchakda 48° va 71°. Uchinchi va unga tashqi burchak?", "61°; 119°."],
        ["Muntazam 8-burchakning bitta ichki burchagi?", "6·180/8 = 135°."],
        ["Teng yonli uchburchakda uch burchagi 40°. Asos burchagi?", "(180 − 40)/2 = 70°."]],
    tuzoq: ["Chizma masshtabda bo'lmasligi mumkin — faqat yozilgan sonlarga tayaning (\"not drawn to scale\").", "Tashqi burchakni qo'shni ichki bilan emas, qolgan ikkitasi bilan bog'lang."],
    desmos: "Geometriya kalkulyatori (desmos.com/geometry) burchaklarni o'lchash uchun; testda qog'ozda chizish tezroq."
  },
  "tri": {
    nima: "Pifagor teoremasi, Pifagor uchliklari, 45-45-90 va 30-60-90 uchburchaklar, o'xshash uchburchaklar va proporsiya, tenglik belgilari.",
    g: ["a² + b² = c² (c — gipotenuza). Uchliklar: 3-4-5, 5-12-13, 8-15-17, 7-24-25 va karralari.", "45-45-90: katetlar x, gipotenuza x√2. 30-60-90: 30° qarshisi x, 60° qarshisi x√3, gipotenuza 2x.", "O'xshash uchburchaklar: burchaklar teng, tomonlar proporsional; mos tomonlar nisbati k, yuzalar nisbati k².", "Uchburchak tengsizligi: har tomon qolgan ikkitasining yig'indisidan kichik, ayirmasidan katta.", "Tenglik belgilari: TTT, TBT, BTB; o'xshashlik: BB, TBT (proporsiya), TTT."],
    m: [["Katetlar 9 va 12. Gipotenuza?", "3·(3-4-5) → 15."],
        ["45-45-90 da gipotenuza 10. Katet?", "10/√2 = 5√2."],
        ["30-60-90 da qisqa katet 4. Gipotenuza va uzun katet?", "8 va 4√3."],
        ["O'xshash uchburchaklar tomonlari 6 va 9 ga mos. Kichikning yuzi 20 bo'lsa kattaniki?", "k = 1,5 → 20·2,25 = 45."]],
    tuzoq: ["Gipotenuza — eng uzun tomon, to'g'ri burchak qarshisida; c² ga faqat uni qo'ying.", "30-60-90 da x√3 60° qarshisida, 30° emas."],
    desmos: "sqrt(9²+12²) kabi hisoblar; proporsiyani 6/9 = 20/x ko'rinishida yeching."
  },
  "area": {
    nima: "To'rtburchak, kvadrat, parallelogramm, trapetsiya, uchburchak, muntazam ko'pburchak yuzi va perimetri; murakkab shakllarni bo'lish; soyali qism.",
    g: ["To'rtburchak ab; kvadrat a²; parallelogramm a·h; trapetsiya (a + b)/2·h; uchburchak ½ah.", "Muntazam ko'pburchak: ½ · perimetr · apofema.", "Murakkab shakl — oddiylarga bo'ling yoki kattadan kichikni ayiring (soyali qism).", "Tomonlar k marta o'zgarsa yuza k² marta.", "Perimetr — chegara uzunligi; yuza — ichki maydon; birliklarga e'tibor."],
    m: [["Trapetsiya asoslari 8 va 14, balandligi 5. Yuzi?", "(8 + 14)/2·5 = 55."],
        ["Kvadrat ichiga diametri tomoniga teng aylana chizilgan, tomon 6. Soyali (burchak) qism?", "36 − 9π ≈ 7,7."],
        ["To'rtburchak tomonlari 2 marta oshirilsa yuza?", "4 marta."]],
    tuzoq: ["Parallelogrammda yon tomon balandlik emas.", "Yuza so'ralganda perimetrni hisoblab qo'ymang (va aksincha)."],
    desmos: "Arifmetika; π bilan hisoblarda aniq (9π) yoki taxminiy (28,27) so'ralganini tekshiring."
  },
  "circle": {
    nima: "Aylana uzunligi va doira yuzi, yoy uzunligi va sektor yuzi, markaziy/ichki chizilgan burchak, aylana tenglamasi, to'liq kvadratga keltirish.",
    g: ["C = 2πr, S = πr². Yoy = (θ/360)·2πr; sektor = (θ/360)·πr² (θ gradusda); radianda yoy = rθ.", "Ichki chizilgan burchak — o'sha yoyga tiralgan markaziy burchakning yarmi; diametrga tiralgan burchak 90°.", "Urinma radiusga perpendikulyar.", "Tenglama: (x − a)² + (y − b)² = r², markaz (a; b).", "x² + y² + Dx + Ey + F = 0 → to'liq kvadratga keltiring: (x + D/2)² + (y + E/2)² = D²/4 + E²/4 − F."],
    m: [["r = 6, markaziy burchak 60°. Yoy va sektor?", "2π; 6π."],
        ["x² + y² − 4x + 6y − 12 = 0 ning markazi va radiusi?", "(x − 2)² + (y + 3)² = 25 → (2; −3), r = 5."],
        ["Diametri AB bo'lgan aylanada C nuqta. ∠ACB = ?", "90°."],
        ["Markazi (1; 2), (4; 6) dan o'tadi. Tenglama?", "r² = 9 + 16 = 25 → (x − 1)² + (y − 2)² = 25."]],
    tuzoq: ["Tenglamada (x − a): x + 3 bo'lsa markaz −3.", "r² ni r bilan almashtirib qo'ymang: = 25 → r = 5.", "Yoy uzunligi (uzunlik) va sektor yuzi (maydon) — turli formulalar."],
    desmos: "Aylana tenglamasini kiriting — markaz va o'qlar bilan kesishmalarni bosing."
  },
  "solid": {
    nima: "Prizma, silindr, piramida, konus, shar hajmi va sirti; o'lchamlar o'zgarganda hajm; jismlar kombinatsiyasi; zichlik.",
    g: ["Prizma/silindr: V = S_asos · h (silindr πr²h). Piramida/konus: V = ⅓·S_asos·h (konus ⅓πr²h). Shar: V = ⁴⁄₃πr³, sirt 4πr².", "Kub: V = a³, sirt 6a². To'g'ri parallelepiped: abc, sirt 2(ab + bc + ca).", "O'lcham k marta oshsa hajm k³, sirt k² marta.", "Zichlik = massa / hajm.", "Silindr yon sirti 2πrh; konus yon sirti πrl (l — yasovchi)."],
    m: [["Silindr r = 3, h = 10. Hajm?", "90π."],
        ["Konus r = 4, h = 9. Hajm?", "⅓·π·16·9 = 48π."],
        ["Radius 2 marta oshsa shar hajmi?", "8 marta."],
        ["Kub sirti 54. Hajmi?", "a² = 9 → a = 3 → 27."]],
    tuzoq: ["Piramida va konusda ⅓ ni unutmang.", "Diametr berilgan bo'lsa radiusga aylantiring.", "Formulalar SAT'da ma'lumotnomada beriladi — lekin qaysi biri qachon kerakligini bilish kerak."],
    desmos: "4/3·π·2³ kabi hisoblar; π li aniq javob so'ralsa π ni ajratib yozing."
  },
  "trig": {
    nima: "To'g'ri burchakli uchburchakda sin, cos, tan; tomon va burchak topish; sin x = cos(90° − x); radian; birlik aylana va asosiy qiymatlar.",
    g: ["sin = qarshi/gipotenuza, cos = yonma-yon/gipotenuza, tan = qarshi/yonma-yon (SOH-CAH-TOA).", "sin A = cos B (A + B = 90°) — to'ldiruvchi burchaklar; sin²x + cos²x = 1; tan = sin/cos.", "O'xshash uchburchaklarda bir xil burchakning sinusi bir xil — kattaroq uchburchakdan ham olish mumkin.", "Radian: 180° = π; gradus → radian ·π/180. 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2.", "Asosiy qiymatlar: sin 30° = ½, cos 60° = ½, sin 45° = cos 45° = √2/2, sin 60° = √3/2, tan 45° = 1.", "Birlik aylanada nuqta (cos θ; sin θ); II chorakda cos < 0, sin > 0."],
    m: [["Katetlar 5 va 12, gipotenuza 13. 12 ga qarshi burchakning sin, cos, tan?", "12/13, 5/13, 12/5."],
        ["sin(x) = cos(2x + 15°) bo'lsa x = ?", "x + 2x + 15 = 90 → x = 25°."],
        ["150° necha radian?", "5π/6."],
        ["Gipotenuza 20, burchak 30°. Qarshi katet?", "20·sin 30° = 10."]],
    tuzoq: ["tan — gipotenuzasiz; sin/cos maxrajida gipotenuza.", "Kalkulyator rejimi: gradus/radian — Desmos'da sozlamadan tekshiring.", "cos 60° = ½, sin 60° emas."],
    desmos: "sin(30°) deb gradus belgisi bilan yozish mumkin; sozlamada (g'ildirak) gradus/radian rejimi."
  },
  "coord": {
    nima: "Ikki nuqta orasidagi masofa, o'rta nuqta, koordinata tekisligida shakllar (uchburchak yuzi, parallelogram uchi), aylana bilan bog'liq masofa.",
    g: ["Masofa d = √((x₂ − x₁)² + (y₂ − y₁)²) — Pifagor.", "O'rta nuqta ((x₁ + x₂)/2; (y₁ + y₂)/2).", "O'rta nuqta va bitta uch berilsa ikkinchi uch: x₂ = 2m − x₁.", "Nuqta aylana ichida ↔ markazgacha masofa < r.", "Koordinatalarda uchburchak yuzi — to'rtburchakdan ortiqcha uchburchaklarni ayirish."],
    m: [["(−1; 2) va (5; 10) orasidagi masofa?", "√(36 + 64) = 10."],
        ["(3; −4) va (−5; 8) ning o'rta nuqtasi?", "(−1; 2)."],
        ["Kesma o'rtasi (2; 3), bir uchi (−1; 7). Ikkinchi uchi?", "(5; −1)."],
        ["(4; 5) nuqta markazi (1; 1), r = 5 aylananing ichidami?", "d = 5 = r → aylana ustida."]],
    tuzoq: ["Masofada ayirmalar kvadratini qo'shing, ayirmang; ildizni unutmang.", "O'rta nuqta — yig'indi/2, ayirma emas."],
    desmos: "Nuqtalarni (−1,2), (5,10) deb kiriting; distance((−1,2),(5,10)) va midpoint(...) funksiyalari bor."
  }
};
