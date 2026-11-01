/* Kuvonch Academy — Elektron kitob, 7-sinf matematika (2026 nashr "Matematika 7" 1-qism + Algebra 7, Geometriya 7 mundarijalari asosida). */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[7] = {
  sinf: 7, nom: "Matematika (Algebra va Geometriya)", bosqich: "Tayanch o'rta ta'lim",
  kirish: "7-sinf: sonning ko'paytuvchilari va karralilari, manfiy va haqiqiy sonlar, yaxlitlash, algebra asoslari, chiziqli tenglamalar, darajalar va ko'phadlar, qisqa ko'paytirish formulalari, chiziqli funksiya va tenglamalar sistemasi; geometriyada burchaklar, parallel chiziqlar, uchburchaklar tengligi.",
  pdf: [
    { nom: "Matematika 7, 1-qism (2026)", url: "https://static.oliygoh.uz/uploads/darsliklar/7/matematika-7-sinf-uz-1-qism.pdf" },
    { nom: "Algebra 7 (2022)", url: "https://static.oliygoh.uz/uploads/darsliklar/7/algebra-7-sinf-uz.pdf" },
    { nom: "Geometriya 7 (2022)", url: "https://static.oliygoh.uz/uploads/darsliklar/7/geometriya-7-sinf-uz.pdf" }
  ],
  boblar: [
    { nom: "1-bob. Sonning ko'paytuvchilari va karralilari", mavzular: [
      { id: "k7-1", nom: "Tub sonlar, tub ko'paytuvchilarga ajratish va daraja", test: ["s5m1", "t61"], pdf: [0, 2],
        qoida: ["<b>Tub son</b> — faqat 1 ga va o'ziga bo'linadi: 2, 3, 5, 7, 11, 13, 17, 19, 23… <b>Murakkab son</b> — ikkitadan ko'p bo'luvchisi bor. 1 — na tub, na murakkab.", "Har qanday murakkab son tub ko'paytuvchilarga yagona usulda ajraladi: 360 = 2 × 2 × 2 × 3 × 3 × 5 = <b>2³ × 3² × 5</b> (daraja ko'rinishida)."],
        misol: [["504 ni tub ko'paytuvchilarga ajrating.", "504 ÷ 2 = 252, ÷ 2 = 126, ÷ 2 = 63, ÷ 3 = 21, ÷ 3 = 7. 504 = 2³ × 3² × 7."]],
        mashq: ["Tub ko'paytuvchilarga ajrating: 120, 225, 1 000, 2 310.", "50 dan 70 gacha bo'lgan tub sonlarni yozing.", "2⁴ × 3 × 5² qanday son?"] },
      { id: "k7-2", nom: "EKUB va EKUK", test: ["s5m1", "t61"], pdf: [0, 9],
        qoida: ["<b>EKUB</b> — eng katta umumiy bo'luvchi: umumiy tub ko'paytuvchilarning eng kichik darajalari ko'paytmasi. 72 = 2³·3², 60 = 2²·3·5 → EKUB = 2²·3 = 12.", "<b>EKUK</b> — eng kichik umumiy karrali: barcha tub ko'paytuvchilarning eng katta darajalari: EKUK(72; 60) = 2³·3²·5 = 360. Xossa: EKUB × EKUK = a × b."],
        misol: [["EKUB(84; 126) va EKUK(84; 126)", "84 = 2²·3·7, 126 = 2·3²·7. EKUB = 2·3·7 = 42; EKUK = 2²·3²·7 = 252."], ["Ikki avtobus bekatdan 12 va 18 daqiqada bir marta jo'naydi. Birga jo'nagach yana qachon birga jo'naydi?", "EKUK(12; 18) = 36 daqiqadan keyin."]],
        mashq: ["EKUB va EKUK: (48; 180), (35; 49), (24; 36; 60).", "Uzunligi 96 sm va 72 sm lentalarni teng va eng uzun bo'laklarga bo'lish kerak. Bo'lak uzunligi?", "a·b = 1 800, EKUB(a; b) = 15. EKUK(a; b)?"] },
      { id: "k7-3", nom: "Sonning kvadrat ildizi va kub ildizi", test: ["s8m1", "t62"], pdf: [0, 21],
        qoida: ["<b>√a</b> — kvadrati a ga teng bo'lgan manfiy bo'lmagan son: √49 = 7, chunki 7² = 49. <b>∛a</b> — kubi a ga teng son: ∛125 = 5.", "To'la kvadratlar: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225. To'la kublar: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000. Tub ko'paytuvchilar orqali: √1 764 = √(2²·3²·7²) = 2·3·7 = 42."],
        misol: [["√2 025 ni tub ko'paytuvchilar orqali toping.", "2 025 = 3⁴ × 5² → √ = 3² × 5 = 45."], ["∛1 728 = ?", "1 728 = 2⁶ × 3³ → ∛ = 2² × 3 = 12."]],
        mashq: ["√256, √1 296, ∛343, ∛2 744.", "Yuzi 196 m² kvadrat maydonning tomoni va perimetri?", "√50 qaysi ikki butun son orasida?"] }
    ] },
    { nom: "2-bob. Haqiqiy sonlar", mavzular: [
      { id: "k7-4", nom: "Manfiy sonlar va sonlar o'qi. Modul", test: ["s6m2"], pdf: [0, 32],
        qoida: ["0 dan kichik sonlar — <b>manfiy</b> (−5, −0,3), 0 dan katta — musbat. Son o'qida manfiy sonlar 0 dan chapda. −7 < −2 (chapda turgan kichik).", "<b>Modul |a|</b> — sonning 0 dan masofasi: |−6| = 6, |6| = 6, |0| = 0. Qarama-qarshi sonlar: 5 va −5."],
        misol: [["Taqqoslang: −3,5 va −3,2; −1 va 0,1", "−3,5 < −3,2; −1 < 0,1."], ["|−8| − |3| = ?", "8 − 3 = 5."]],
        mashq: ["O'sish tartibida yozing: 2; −7; 0; −1,5; 4; −10.", "|−12|, |7 − 10|, −|−4| ni hisoblang.", "Harorat −4° dan 3° ga ko'tarildi. Necha gradusga?"] },
      { id: "k7-5", nom: "Butun sonlarni qo'shish, ayirish, ko'paytirish va bo'lish", test: ["s6m2"], pdf: [0, 37],
        qoida: ["<b>Qo'shish:</b> bir xil ishorali — modullari qo'shiladi, ishora saqlanadi: (−3) + (−5) = −8. Har xil ishorali — katta moduldan kichigi ayriladi, ishora kattasiniki: (−9) + 4 = −5.", "<b>Ayirish:</b> a − b = a + (−b): 3 − 7 = 3 + (−7) = −4; −2 − (−6) = −2 + 6 = 4.", "<b>Ko'paytirish, bo'lish:</b> bir xil ishora → +, har xil → −: (−4)·(−5) = 20, (−4)·5 = −20, (−18) ÷ 3 = −6, (−2)³ = −8, (−2)⁴ = 16."],
        misol: [["(−6) + 14 − (−3) − 8", "8 + 3 − 8 = 3."], ["(−3)² · (−2) − (−10) ÷ 5", "9 · (−2) = −18; (−10) ÷ 5 = −2; −18 − (−2) = −16."]],
        mashq: ["Hisoblang: −15 + 9; −7 − 12; 6 − (−4); (−8)·(−7); 56 ÷ (−8); (−1)⁷.", "−3·(−2)² + (−5 + 3)³ ni hisoblang.", "Firma yanvarda 12 mln zarar, fevralda 20 mln foyda, martda 5 mln zarar ko'rdi. Chorak natijasi?"] },
      { id: "k7-6", nom: "Ratsional, irratsional va haqiqiy sonlar", test: ["s8m1", "s6m3"], pdf: [0, 51],
        qoida: ["<b>Ratsional son</b> — p/q ko'rinishida yoziladigan son (butunlar, kasrlar, chekli va davriy o'nli kasrlar: 0,333… = 1/3). <b>Irratsional son</b> — cheksiz davriy bo'lmagan o'nli kasr: √2 = 1,41421…, π = 3,14159…", "Ratsional va irratsional sonlar birgalikda <b>haqiqiy sonlar</b> to'plamini tashkil etadi. Haqiqiy sonlar ustida amallar oddiy qoidalar bilan bajariladi; irratsional sonlar taqribiy qiymat bilan hisoblanadi."],
        misol: [["Qaysilari irratsional: √9, √10, 0,(7), π, 2,5?", "√10 va π irratsional; √9 = 3, 0,(7) = 7/9, 2,5 = 5/2 — ratsional."]],
        mashq: ["Ratsional yoki irratsional: √16, √17, 1/7, 0,101001000…, ∛27.", "√3 ≈ 1,73 deb olib 2√3 − 1 ni hisoblang.", "Sonlar o'qida √2 va −√2 ni taxminan belgilang."] }
    ] },
    { nom: "3-bob. Sonlarni yaxlitlash va chamalash", mavzular: [
      { id: "k7-7", nom: "Xonasigacha va ahamiyatli raqamgacha yaxlitlash. Chamalash", test: ["s4m1", "s5m3"], pdf: [0, 66],
        qoida: ["Xonasigacha: 3,4567 ≈ 3,46 (yuzdan birgacha). <b>Ahamiyatli raqamlar</b> — chapdagi birinchi noldan farqli raqamdan boshlab sanaladi: 0,004 56 → 3 ta ahamiyatli raqam; 2 ta ahamiyatli raqamgacha 0,0046.", "<b>Chamalash</b> — har bir sonni 1 ahamiyatli raqamgacha yaxlitlab taxminiy hisoblash: 4,87 × 19,6 ≈ 5 × 20 = 100. Hisoblash xatosini tekshirish uchun qulay."],
        misol: [["38 472 ni 2 ahamiyatli raqamgacha yaxlitlang.", "38 000."], ["Chamalang: 0,51 × 7 980 ÷ 4,1", "0,5 × 8 000 ÷ 4 = 1 000."]],
        mashq: ["0,06 075 ni 1, 2, 3 ahamiyatli raqamgacha yaxlitlang.", "Chamalab tekshiring: 29,8 × 4,12 ≈ ?", "Dumaloq stol diametri 1,2 m. π ≈ 3 deb aylana uzunligini chamalang."] }
    ] },
    { nom: "4-bob. Algebra asoslari va algebraik almashtirishlar", mavzular: [
      { id: "k7-8", nom: "Algebraga kirish. Chiziqli ifodalarni soddalashtirish va qavslarni ochish", test: ["s7m2", "s6m4"], pdf: [0, 90],
        qoida: ["<b>Chiziqli ifoda</b> — harflar birinchi darajada: 3x − 2y + 7. O'xshash hadlarni jamlaymiz.", "<b>Qavslarni ochish:</b> a(b + c) = ab + ac; qavs oldida minus bo'lsa ichidagi ishoralar o'zgaradi: −(x − 4) = −x + 4; 2(3x − 1) − 3(x + 2) = 6x − 2 − 3x − 6 = 3x − 8."],
        misol: [["Soddalashtiring: 5(2a − 3) − 2(4a − 7)", "10a − 15 − 8a + 14 = 2a − 1."], ["x = −2 da 3(x + 4) − (2x − 1) ning qiymati", "3x + 12 − 2x + 1 = x + 13 = 11."]],
        mashq: ["Qavslarni ochib soddalashtiring: 4(x + 3) − 2x; −(5y − 2) + 3(y + 1); 2(a − b) − 3(b − a).", "To'g'ri to'rtburchakning tomonlari (x + 2) va 3. Perimetri va yuzini ifoda bilan yozing."] },
      { id: "k7-9", nom: "Umumiy ko'paytuvchini qavsdan tashqariga chiqarish", test: ["t52", "s7m2"], pdf: [0, 114],
        qoida: ["Qavs ochishga teskari amal: 6x + 9 = <b>3(2x + 3)</b>; 4a² − 6a = 2a(2a − 3). Umumiy ko'paytuvchi — koeffitsiyentlar EKUBi va umumiy harfning eng kichik darajasi.", "Tekshirish: qavsni qayta ochib asl ifoda chiqishini ko'ramiz."],
        misol: [["12x²y − 18xy² ni ko'paytuvchilarga ajrating.", "EKUB(12; 18) = 6, umumiy: xy → 6xy(2x − 3y)."]],
        mashq: ["Ajrating: 5a + 10; 7x² − 14x; 3ab − 6a²b + 9ab²; x(a + b) + y(a + b).", "Hisoblang qulay usulda: 37·48 + 37·52."] },
      { id: "k7-10", nom: "Natural ko'rsatkichli daraja va uning xossalari", test: ["s7m1"], pdf: [1, 26],
        qoida: ["<b>aⁿ = a·a·…·a</b> (n marta). a¹ = a. (−2)⁴ = 16, −2⁴ = −16 (ishoraga e'tibor!).", "Xossalar: <b>aᵐ·aⁿ = aᵐ⁺ⁿ</b>; <b>aᵐ ÷ aⁿ = aᵐ⁻ⁿ</b>; <b>(aᵐ)ⁿ = aᵐⁿ</b>; <b>(ab)ⁿ = aⁿbⁿ</b>; (a/b)ⁿ = aⁿ/bⁿ. Sonning standart shakli: a × 10ⁿ, 1 ≤ a < 10: 3 400 000 = 3,4 × 10⁶."],
        misol: [["Soddalashtiring: (x³)²·x⁴ ÷ x⁵", "x⁶·x⁴ = x¹⁰; x¹⁰ ÷ x⁵ = x⁵."], ["2⁸ ÷ 2⁵ + 3²·3 = ?", "2³ + 3³ = 8 + 27 = 35."]],
        mashq: ["a⁵·a²; b⁷ ÷ b³; (c²)⁵; (2x)³; (3a²b)².", "Standart shaklda: 0,000 72; 56 000 000.", "5¹⁰ ÷ 5⁸ · 5 ni hisoblang."] },
      { id: "k7-11", nom: "Birhad va ko'phad. Ko'phadlarni qo'shish, ayirish, ko'paytirish", test: ["s7m2"], pdf: [1, 34],
        qoida: ["<b>Birhad</b> — sonlar va harflar ko'paytmasi; standart shakli: koeffitsiyent oldinda, harflar alifbo tartibida: 3·x·y·2·x = 6x²y. Darajasi — ko'rsatkichlar yig'indisi.", "<b>Ko'phad</b> — birhadlar yig'indisi. Qo'shish/ayirish — o'xshash hadlarni jamlash (ayirishda qavs ichidagi ishoralar o'zgaradi). Ko'paytirish: har bir hadni har bir hadga: (x + 2)(x − 3) = x² − 3x + 2x − 6 = x² − x − 6."],
        misol: [["(2x² − 3x + 1) − (x² + 4x − 5)", "2x² − 3x + 1 − x² − 4x + 5 = x² − 7x + 6."], ["(3a − 2)(a + 4)", "3a² + 12a − 2a − 8 = 3a² + 10a − 8."]],
        mashq: ["Standart shaklga keltiring: 4a·(−3)·b·a; 2x·y·x·y.", "(x² + x − 2) + (3x² − x + 5); (y − 3)(y + 7); 2a(a² − 3a + 4).", "Ko'paytiring va soddalashtiring: (x + 1)(x + 2) − x(x + 3)."] },
      { id: "k7-12", nom: "Qisqa ko'paytirish formulalari", test: ["t51", "s7m2"], pdf: [1, 57],
        qoida: ["<b>(a + b)² = a² + 2ab + b²</b>; <b>(a − b)² = a² − 2ab + b²</b>; <b>a² − b² = (a − b)(a + b)</b>.", "<b>(a + b)³ = a³ + 3a²b + 3ab² + b³</b>; (a − b)³ = a³ − 3a²b + 3ab² − b³; <b>a³ + b³ = (a + b)(a² − ab + b²)</b>; a³ − b³ = (a − b)(a² + ab + b²).", "Tatbiqi: og'zaki hisoblash (51² = (50 + 1)² = 2 601; 48·52 = 50² − 2² = 2 496) va ko'paytuvchilarga ajratish."],
        misol: [["(3x − 2y)² ni oching.", "9x² − 12xy + 4y²."], ["x² − 16 va 4a² − 12a + 9 ni ko'paytuvchilarga ajrating.", "(x − 4)(x + 4); (2a − 3)²."]],
        mashq: ["Oching: (x + 5)²; (2a − 1)²; (3m + n)(3m − n); (y + 2)³.", "Ajrating: 25 − y²; a² + 10a + 25; x³ − 8; 16x² − 81.", "Og'zaki: 99², 101·99, 35² − 25²."] },
      { id: "k7-13", nom: "Ko'phadni ko'paytuvchilarga ajratish usullari", test: ["t52"], pdf: [1, 69],
        qoida: ["1) umumiy ko'paytuvchini chiqarish; 2) <b>guruhlash</b>: ax + ay + bx + by = a(x + y) + b(x + y) = (a + b)(x + y); 3) qisqa ko'paytirish formulalari; 4) usullarni birgalikda qo'llash.", "Avval umumiy ko'paytuvchi, keyin formula: 2x² − 8 = 2(x² − 4) = 2(x − 2)(x + 2)."],
        misol: [["x³ − x² − 4x + 4 ni ajrating.", "x²(x − 1) − 4(x − 1) = (x − 1)(x² − 4) = (x − 1)(x − 2)(x + 2)."], ["3a² + 6ab + 3b² = ?", "3(a² + 2ab + b²) = 3(a + b)²."]],
        mashq: ["Ajrating: 5x² − 45; ab − 2a + 3b − 6; x⁴ − 1; 2y³ − 4y² + 2y.", "Tenglamani yeching: x² − 9x = 0; (x − 3)² − 25 = 0."] }
    ] },
    { nom: "5-bob. Bir o'zgaruvchili tenglamalar", mavzular: [
      { id: "k7-14", nom: "Chiziqli tenglamalar: qavsli, kasrli, kasr-chiziqli", test: ["s6m4", "t10"], pdf: [0, 124],
        qoida: ["<b>ax + b = 0</b> — chiziqli tenglama. Algoritm: qavslarni ochish → kasrlardan qutulish (EKUK ga ko'paytirish) → noma'lumlarni chapga, sonlarni o'ngga → o'xshashlarni jamlash → bo'lish.", "a = 0, b ≠ 0 bo'lsa yechim yo'q (0·x = 5); a = 0, b = 0 bo'lsa cheksiz ko'p yechim (0·x = 0). Kasr-chiziqli: (x + 1)/(x − 2) = 3 → x − 2 ≠ 0 sharti bilan x + 1 = 3(x − 2)."],
        misol: [["(x + 2)/3 − (x − 1)/4 = 2", "EKUK 12: 4(x + 2) − 3(x − 1) = 24 → 4x + 8 − 3x + 3 = 24 → x = 13."], ["3(2x − 1) = 2(3x + 4)", "6x − 3 = 6x + 8 → 0·x = 11 → yechim yo'q."]],
        mashq: ["Yeching: 5(x − 2) = 3x + 6; x/2 + x/3 = 10; (2x − 1)/5 = (x + 3)/2; 7 − 2(x + 1) = 4(x − 1) + 1.", "(x − 4)/(x + 1) = 2 ni yeching (ODZ ni yozing)."] },
      { id: "k7-15", nom: "Matnli masalalarni tenglama yordamida yechish", test: ["s6m4", "t8"], pdf: [0, 137],
        qoida: ["Noma'lumni x deb belgilaymiz → shart bo'yicha ifodalar tuzamiz → tenglik hosil qilamiz → yechamiz → javobni masala sharti bilan tekshiramiz.", "Harakat: S = vt; ish: A = pt; aralashma: moddaning miqdori = konsentratsiya × massa; yosh masalalari: n yildan keyin hamma n yoshga ulg'ayadi."],
        misol: [["Otaning yoshi o'g'lidan 4 marta katta. 5 yildan keyin 3 marta katta bo'ladi. Hozir o'g'li necha yoshda?", "x — o'g'il, 4x — ota. 4x + 5 = 3(x + 5) → x = 10."], ["Ikki shahar orasi 300 km. Mashina A dan 70 km/soat, poyezd B dan 80 km/soat bir vaqtda qarama-qarshi chiqdi. Qachon uchrashadi?", "70t + 80t = 300 → t = 2 soat."]],
        mashq: ["Ketma-ket uchta juft son yig'indisi 78. Sonlarni toping.", "To'g'ri to'rtburchak uzunligi enidan 3 sm ko'p, perimetri 26 sm. Tomonlari?", "Birinchi ishchi ishni 6 kunda, ikkinchisi 12 kunda bajaradi. Birga necha kunda?"] }
    ] },
    { nom: "6-bob. Chiziqli funksiya va tenglamalar sistemasi", mavzular: [
      { id: "k7-16", nom: "Koordinatalar tekisligi. Funksiya tushunchasi", test: ["s6m5", "t5"], pdf: [1, 112],
        qoida: ["Dekart koordinatalari: Ox — abssissa, Oy — ordinata; A(x; y). Choraklar I (+;+), II (−;+), III (−;−), IV (+;−).", "<b>Funksiya</b> — har bir x ga yagona y ni mos qo'yuvchi qoida: y = f(x). Berilish usullari: formula, jadval, grafik. y = x² da f(3) = 9."],
        misol: [["f(x) = 2x − 5. f(0), f(4), f(−1) ni toping; qaysi x da f(x) = 7?", "−5; 3; −7; 2x − 5 = 7 → x = 6."]],
        mashq: ["A(−3; 2), B(4; −1), C(0; −5) ni belgilang, choragini ayting.", "y = x² − 1 uchun x = −2, −1, 0, 1, 2 da jadval tuzing va grafikni chizing.", "f(x) = 10 − 3x. f(x) = −2 bo'ladigan x?"] },
      { id: "k7-17", nom: "Chiziqli funksiya y = kx + b va uning grafigi", test: ["t8", "t7"], pdf: [1, 120],
        qoida: ["<b>y = kx + b</b> grafigi — to'g'ri chiziq. b — Oy o'qi bilan kesishish nuqtasi (0; b). <b>k — burchak koeffitsiyenti</b>: k > 0 — o'suvchi, k < 0 — kamayuvchi, k = 0 — gorizontal.", "y = kx (b = 0) — to'g'ri proporsionallik, koordinata boshidan o'tadi. Ikki to'g'ri chiziq k lari teng bo'lsa parallel. Grafikni chizish uchun 2 ta nuqta yetarli."],
        misol: [["y = −2x + 3 grafigini chizing. Ox bilan kesishish nuqtasi?", "(0; 3) va (1; 1) nuqtalar. Ox: y = 0 → x = 1,5 → (1,5; 0)."], ["(2; 7) va (0; 3) nuqtalardan o'tuvchi to'g'ri chiziq tenglamasi?", "b = 3; 7 = 2k + 3 → k = 2; y = 2x + 3."]],
        mashq: ["y = 3x − 2, y = −x + 4, y = 0,5x grafiklarini bitta tekislikda chizing.", "y = 4x + b grafigi (1; 6) dan o'tadi. b?", "Qaysi juftlik parallel: y = 2x + 1, y = −2x + 1, y = 2x − 5?"] },
      { id: "k7-18", nom: "Chiziqli tenglamalar sistemasi va uni yechish usullari", test: ["s7m3", "t11"], pdf: [1, 131],
        qoida: ["Sistema — ikki noma'lumli ikki tenglama; yechim — ikkalasini ham qanoatlantiruvchi (x; y) juftlik. <b>O'rniga qo'yish:</b> bir tenglamadan bir noma'lumni ifodalab ikkinchisiga qo'yamiz.", "<b>Qo'shish usuli:</b> koeffitsiyentlarni tenglashtirib tenglamalarni qo'shamiz (ayiramiz). <b>Grafik usul:</b> yechim — to'g'ri chiziqlar kesishish nuqtasi (parallel — yechim yo'q, ustma-ust — cheksiz ko'p)."],
        misol: [["{ 2x + y = 7; 3x − y = 8 }", "Qo'shamiz: 5x = 15, x = 3; y = 7 − 6 = 1. Javob (3; 1)."], ["{ x − 2y = 4; 3x + 4y = 2 }", "x = 4 + 2y → 3(4 + 2y) + 4y = 2 → 12 + 10y = 2 → y = −1, x = 2."]],
        mashq: ["Yeching: { x + y = 10; x − y = 4 }; { 3x + 2y = 12; x − y = −1 }; { 2x + 3y = 13; 4x − y = 5 }.", "Grafik usulda: { y = x + 1; y = −x + 3 }.", "5 ta daftar va 3 ta ruchka 29 000 so'm, 2 ta daftar va 3 ta ruchka 20 000 so'm. Narxlarini toping."] }
    ] },
    { nom: "7-bob. Kombinatorika elementlari", mavzular: [
      { id: "k7-19", nom: "Kombinatorikaning asosiy qoidalari. Masalalar turlari", test: ["t90", "t89"], pdf: [1, 146],
        qoida: ["<b>Yig'indi qoidasi:</b> A ni m usul, B ni n usul bilan tanlash mumkin bo'lsa, «A yoki B» — m + n usul. <b>Ko'paytma qoidasi:</b> «A va B» ketma-ket — m × n usul.", "Daraxt diagrammasi, jadval va sanab chiqish usullari. n ta narsani qatorga tartiblash: n! = 1·2·…·n (3 ta kitob — 6 usul)."],
        misol: [["Menyuda 4 xil sho'rva va 5 xil ikkinchi taom. Tushlikni necha usulda tanlash mumkin?", "4 × 5 = 20."], ["1, 2, 3, 4 raqamlaridan takrorlanmaydigan nechta uch xonali son tuzish mumkin?", "4 × 3 × 2 = 24."]],
        mashq: ["3 ta ko'ylak va 4 ta shim — nechta kiyinish usuli?", "5 kishi bir qatorga necha usulda o'tira oladi?", "0, 1, 2, 5 raqamlaridan nechta ikki xonali son tuziladi (raqamlar takrorlanmasin)?"] }
    ] },
    { nom: "8-bob. Geometriya: burchaklar va parallel to'g'ri chiziqlar", mavzular: [
      { id: "k7-20", nom: "Nuqta, to'g'ri chiziq, tekislik. Kesma va burchak. Burchak turlari", test: ["s5m5"], pdf: [0, 146],
        qoida: ["Asosiy tushunchalar: nuqta, to'g'ri chiziq, tekislik. Ikki nuqtadan faqat bitta to'g'ri chiziq o'tadi. Kesma uzunligi, burchak gradus o'lchovi; bissektrisa burchakni teng ikkiga bo'ladi.", "Burchaklar: o'tkir (< 90°), to'g'ri (90°), o'tmas (90°–180°), yoyiq (180°). Qo'shni burchaklar yig'indisi 180°, vertikal burchaklar teng. Perpendikulyar to'g'ri chiziqlar 90° hosil qiladi."],
        misol: [["Burchak bissektrisasi uni 180° li yoyiq burchakning 1/3 qismiga teng burchaklarga bo'ldi. Burchak?", "Har qism 60°, burchak 120°."]],
        mashq: ["Qo'shni burchaklar 1 : 4 kabi. Ularni toping.", "Ikki to'g'ri chiziq kesishganda hosil bo'lgan burchaklardan biri 37°. Qolgan uchtasi?", "AB = 12 sm, C — o'rtasi, D — AC ning o'rtasi. DB?"] },
      { id: "k7-21", nom: "Parallel to'g'ri chiziqlar va kesuvchi. Parallellik alomatlari", test: ["s7m4"], pdf: [0, 156],
        qoida: ["Kesuvchi ikki to'g'ri chiziqni kesganda: <b>mos</b>, <b>ichki almashinuvchi</b>, <b>bir tomonli ichki</b> burchaklar. Chiziqlar parallel ⇔ mos burchaklar teng ⇔ almashinuvchi burchaklar teng ⇔ bir tomonli burchaklar yig'indisi 180°.", "Parallellik aksiomasi: berilgan nuqtadan berilgan to'g'ri chiziqqa parallel faqat bitta to'g'ri chiziq o'tkazish mumkin."],
        misol: [["a ∥ b, kesuvchi bilan hosil bo'lgan bir burchak 125°. Qolgan 7 ta burchakni toping.", "To'rttasi 125°, to'rttasi 55°."]],
        mashq: ["Ichki almashinuvchi burchaklar 3x va x + 40. x? (chiziqlar parallel)", "Bir tomonli ichki burchaklar 2 : 7 kabi. Ularni toping.", "Rasmda mos burchaklar 70° va 72°. Chiziqlar parallelmi?"] }
    ] },
    { nom: "9-bob. Uchburchaklar, to'rtburchaklar va ko'pburchaklar", mavzular: [
      { id: "k7-22", nom: "Uchburchak elementlari. Burchaklar yig'indisi. Tashqi burchak. Tomonlar tengsizligi", test: ["s7m4", "t71"], pdf: [0, 168],
        qoida: ["Elementlar: tomonlar, burchaklar, mediana (uchni qarshi tomon o'rtasi bilan tutashtiradi), bissektrisa, balandlik. Burchaklar yig'indisi 180°; tashqi burchak = unga qo'shni bo'lmagan ikki ichki burchak yig'indisi.", "<b>Uchburchak tengsizligi:</b> har tomon qolgan ikkitasining yig'indisidan kichik. Katta tomon qarshisida katta burchak yotadi. To'g'ri burchakli uchburchakda o'tkir burchaklar yig'indisi 90°; 30° qarshisidagi katet gipotenuzaning yarmi."],
        misol: [["Tomonlari 3, 4, 8 bo'lgan uchburchak mavjudmi?", "3 + 4 = 7 < 8 — mavjud emas."], ["Uchburchak burchaklari 2 : 3 : 4 kabi. Eng katta tashqi burchagi?", "20°, 60°, 80° → eng katta tashqi 180 − 20 = 160°."]],
        mashq: ["Burchaklari 48° va 73°. Uchinchisi va tashqi burchaklari?", "Teng yonli uchburchak perimetri 32 sm, asosi 12 sm. Yon tomoni?", "To'g'ri burchakli uchburchakda gipotenuza 18 sm, bir burchagi 30°. Kichik katet?"] },
      { id: "k7-23", nom: "Uchburchaklar tengligining alomatlari. Teng yonli uchburchak xossalari", test: ["t71"], pdf: [2, 79],
        qoida: ["<b>I alomat:</b> ikki tomon va ular orasidagi burchak; <b>II alomat:</b> tomon va unga yopishgan ikki burchak; <b>III alomat:</b> uchta tomon bo'yicha teng.", "Teng yonli uchburchakda asosdagi burchaklar teng; uchidan tushirilgan bissektrisa ham mediana, ham balandlikdir. Teng tomonli uchburchakning har burchagi 60°."],
        misol: [["ABC uchburchakda AB = AC, ∠B = 65°. ∠A?", "∠C = 65°, ∠A = 180 − 130 = 50°."], ["AB = CD, ∠BAC = ∠DCA bo'lsa ABC va CDA uchburchaklari tengligini isbotlang.", "AC — umumiy tomon, AB = CD, oradagi burchaklar teng → I alomat bo'yicha teng."]],
        mashq: ["Teng yonli uchburchakning uchidagi burchak 100°. Asosdagilar?", "Ikki uchburchakda 5 sm, 7 sm tomonlar va ular orasidagi 40° burchak teng. Qaysi alomat?", "Teng tomonli uchburchakning bissektrisasi asos bilan qanday burchak hosil qiladi?"] },
      { id: "k7-24", nom: "To'rtburchaklar va ko'pburchaklar. Yasashga doir masalalar", test: ["t72", "s8m3"], pdf: [0, 179],
        qoida: ["To'rtburchak burchaklari yig'indisi 360°; n-burchak — (n − 2)·180°; qavariq ko'pburchak tashqi burchaklari yig'indisi 360°.", "Parallelogramm, to'g'ri to'rtburchak, romb, kvadrat, trapetsiya xossalari. Sirkul va chizg'ich bilan yasash: kesmaga teng kesma, burchakka teng burchak, bissektrisa, perpendikulyar, uch tomoni bo'yicha uchburchak."],
        misol: [["Muntazam ko'pburchakning tashqi burchagi 36°. Nechta tomoni bor?", "360 ÷ 36 = 10 ta."], ["Parallelogramm qo'shni burchaklari 2 : 3 kabi. Burchaklarini toping.", "72° va 108°."]],
        mashq: ["Burchaklari 85°, 95°, 110° bo'lgan to'rtburchakning to'rtinchi burchagi.", "Muntazam 12-burchakning ichki burchagi?", "Sirkul-chizg'ich bilan: tomonlari 4, 5, 6 sm uchburchak; 60° burchak; 90° burchak yasang."] }
    ] }
  ]
};
