/* Kuvonch Academy — Elektron kitob, 6-sinf matematika (2024 nashr, 1–2-qism mundarijasi asosida). */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[6] = {
  sinf: 6, nom: "Matematika", bosqich: "Tayanch o'rta ta'lim",
  kirish: "6-sinf darsligi 10 bobdan iborat: algebra elementlari, kasrlarni bo'lish, nisbatlar, foizlar (o'sish, kamayish), shakllardagi burchaklar, doira va aylana, tezlik, hajm, doiraviy diagrammalar va fazoviy jismlarning yoyilmalari.",
  pdf: [
    { nom: "1-qism (1–6-boblar)", url: "https://static.oliygoh.uz/uploads/darsliklar/6/matematika-6-sinf-uz-1-qism.pdf" },
    { nom: "2-qism (7–10-boblar)", url: "https://static.oliygoh.uz/uploads/darsliklar/6/matematika-6-sinf-uz-2-qism.pdf" },
    { nom: "Mashq daftari", url: "https://infoedu.uz/darsliklar/6/6-sinf-matematika-mashq-daftari" }
  ],
  boblar: [
    { nom: "1-bob. Algebra", mavzular: [
      { id: "k6-1", nom: "Algebraik ifodalar va ularni soddalashtirish", test: ["s7m2", "s6m4"], pdf: [0, 3],
        qoida: ["Noma'lum miqdor harf bilan belgilanadi: «Alida x ta olma bor, Valida undan 3 ta ko'p» → Valida x + 3 ta olma bor. <b>Algebraik ifoda</b> — harflar va sonlar amal belgilari bilan bog'langan yozuv: 2x + 5, 3a − b.", "<b>Koeffitsiyent</b> — harf oldidagi son (3a da 3). <b>O'xshash hadlar</b> (harfiy qismi bir xil bo'lgan hadlar) jamlanadi: 2x + 5x = 7x; 4a + 3 − a = 3a + 3. x · 1 = x, x + x + x = 3x, x · x = x²."],
        misol: [["Soddalashtiring: 5y + 8 − 2y + 3", "5y − 2y = 3y; 8 + 3 = 11; 3y + 11."], ["Qalam a so'm, daftar undan 2 marta qimmat turadi. 3 ta qalam va 2 ta daftar qancha turadi?", "3a + 2 · 2a = 3a + 4a = 7a so'm."]],
        mashq: ["Soddalashtiring: 7m − 3m + m; 4x + 9 − x − 2; 6a + 2b − 2a + b.", "Ifoda tuzing: n ning 5 ga ko'paytmasidan 7 ga kichik son; a va b yig'indisining yarmi."] },
      { id: "k6-2", nom: "Ifodaning qiymatini topish. Tenglamalarni yechish", test: ["s6m4"], pdf: [0, 13],
        qoida: ["Ifodaning qiymatini topish uchun harf o'rniga uning qiymatini qo'yib hisoblaymiz: x = 4 bo'lganda 3x − 5 = 12 − 5 = 7.", "Tenglama — noma'lum son qatnashgan tenglik. Yechish: hadlarni qarama-qarshi ishora bilan tenglamaning bir qismidan ikkinchi qismiga o'tkazamiz, so'ng ax = b dan x = b ÷ a (a ≠ 0). Tekshirish: topilgan sonni tenglamaga qo'yib, ikkala qismining tengligini ko'ramiz."],
        misol: [["3x + 7 = 25", "3x = 25 − 7 = 18; x = 18 ÷ 3 = 6. Tekshirish: 3 · 6 + 7 = 25 ✓."], ["5x − 4 = 2x + 11", "5x − 2x = 11 + 4; 3x = 15; x = 5. Tekshirish: 25 − 4 = 10 + 11 ✓."]],
        mashq: ["Yeching: 4x − 9 = 15; 7 + 2x = 19; 6x = 4x + 14; x/3 + 2 = 7.", "a = 2, b = 5 bo'lganda 3a² + 2b − ab ifodaning qiymatini toping.", "Tenglama tuzib yeching: agar sonni 4 ga ko'paytirib, natijadan 6 ni ayirsak, 30 hosil bo'ladi. Shu sonni toping."] }
    ] },
    { nom: "2-bob. Oddiy kasrlarni bo'lish", mavzular: [
      { id: "k6-3", nom: "Kasrni natural songa, natural sonni kasrga, kasrni kasrga bo'lish", test: ["s6m3", "s5m2"], pdf: [0, 28],
        qoida: ["Kasrga bo'lish — <b>unga teskari kasrga ko'paytirish</b>. a/b ning teskarisi b/a (a ≠ 0, b ≠ 0). 2/3 ÷ 4 = 2/3 × 1/4 = 2/12 = 1/6.", "6 ÷ 3/4 = 6 × 4/3 = 8 (6 da 3/4 lik bo'laklar 8 ta bor). 3/5 ÷ 2/7 = 3/5 × 7/2 = 21/10 = 2 1/10. Aralash sonlar avval noto'g'ri kasrga aylantiriladi."],
        misol: [["4/9 ÷ 2/3 = ?", "4/9 × 3/2 = 12/18 = 2/3."], ["5 1/4 ÷ 1 3/4 = ?", "21/4 ÷ 7/4 = 21/4 × 4/7 = 3."]],
        mashq: ["Hisoblang: 3/8 ÷ 6; 10 ÷ 5/6; 7/12 ÷ 7/9; 2 2/5 ÷ 4/5.", "3/4 l sharbatni sig'imi 1/8 l bo'lgan stakanlarga quysak, nechta stakan to'ladi?", "Mato bo'lagining uzunligi 4 1/2 m. Undan uzunligi 3/4 m dan bo'lgan nechta bo'lak qirqib olish mumkin?"] }
    ] },
    { nom: "3-bob. Nisbatlar", mavzular: [
      { id: "k6-4", nom: "Nisbat va kasr. Uch miqdor nisbati. O'zgaruvchan nisbatlar", test: ["s6m1"], pdf: [0, 55],
        qoida: ["a : b nisbat a/b kasr ko'rinishida yoziladi. Kasrli nisbatlar butun sonlar nisbatiga keltiriladi: 1/2 : 2/3 = 3 : 4 (nisbatning ikkala hadini 6 ga ko'paytirdik).", "<b>O'zgaruvchan nisbat</b>: miqdorlar o'zgarsa, nisbat ham o'zgaradi. Masalan, boshida qizlar va o'g'il bolalar soni 3 : 2 nisbatda edi, 4 ta o'g'il bola qo'shilgach, nisbat 3 : 4 bo'ldi. Bunday masalalar ulushlar orqali yechiladi."],
        misol: [["A : B = 2 : 3 va B : C = 4 : 5. A : B : C nisbatni toping.", "B ga mos hadlarni tenglashtiramiz (EKUK(3; 4) = 12): A : B = 8 : 12, B : C = 12 : 15 → A : B : C = 8 : 12 : 15."], ["Qutidagi qizil va ko'k sharlar soni 5 : 3 nisbatda. 6 ta qizil shar olingach, nisbat 1 : 1 bo'ldi. Boshida qutida nechta shar bor edi?", "5 ulush − 6 = 3 ulush → 2 ulush = 6, 1 ulush = 3; boshida 15 + 9 = 24 ta shar bor edi."]],
        mashq: ["Butun sonlar nisbatiga keltiring: 0,4 : 1,2; 2/5 : 3/10; 1,5 : 2 : 0,5.", "x : y = 3 : 7 va x + y = 80. x va y ni toping.", "Akada ukasidan 2 marta ko'p pul bor edi. Aka 20 000 so'm sarflagach, ularning pullari tenglashdi. Boshida har birida qancha pul bor edi?"] }
    ] },
    { nom: "4-bob. Foizlar", mavzular: [
      { id: "k6-5", nom: "Foiziga ko'ra sonning o'zini topish. O'sish va kamayish foizi", test: ["s5m4", "t56"], pdf: [0, 87],
        qoida: ["Sonning p % i A ga teng bo'lsa, son = A ÷ p × 100. Masalan, sonning 30 % i 45 ga teng → son 45 ÷ 30 × 100 = 150.", "<b>O'zgarish foizi = (o'zgarish ÷ dastlabki qiymat) × 100 %</b>. Miqdor 80 dan 100 ga o'sdi → 20 ÷ 80 × 100 % = 25 % o'sish. 100 dan 80 ga kamaydi → 20 ÷ 100 × 100 % = 20 % kamayish. p % ga o'sgan miqdor = dastlabki qiymat × (100 + p) ÷ 100."],
        misol: [["Tovar 15 % chegirma bilan 170 000 so'm turadi. Uning chegirmasiz narxini toping.", "Yangi narx dastlabki narxning 100 % − 15 % = 85 % i: 85 % — 170 000 → 100 % = 170 000 ÷ 85 × 100 = 200 000 so'm."], ["Aholi soni 40 000 dan 46 000 ga oshdi. Aholi soni necha foizga oshgan?", "6 000 ÷ 40 000 × 100 = 15 %."]],
        mashq: ["Sonning 8 % i 36 ga teng. Shu sonni toping.", "Narx 250 000 so'mdan 300 000 so'mga oshdi. Narx necha foizga oshgan?", "Maosh 12 % ga oshirilib, 2 800 000 so'm bo'ldi. Avvalgi maosh qancha bo'lgan?", "Tovar narxi avval 20 % ga oshirilib, keyin 20 % ga tushirildi. Oxirgi narx dastlabki narxdan necha foizga farq qiladi?"] }
    ] },
    { nom: "5-bob. Geometrik shakllardagi burchaklar", mavzular: [
      { id: "k6-6", nom: "Uchburchak, to'rtburchak va ko'pburchaklardagi noma'lum burchaklar", test: ["s5m5", "s7m4"], pdf: [0, 119],
        qoida: ["Uchburchak burchaklarining yig'indisi 180°, to'rtburchakniki — 360°, qavariq n-burchakniki — (n − 2) × 180°. Muntazam n-burchakning har bir burchagi (n − 2) × 180° ÷ n.", "Masalalarda bir nechta xossadan birgalikda foydalaniladi: teng yonli uchburchak xossasi, parallel tomonlar, qo'shni va vertikal burchaklar."],
        misol: [["Muntazam oltiburchakning bir burchagini toping.", "(6 − 2) × 180 ÷ 6 = 120°."], ["Qavariq beshburchakning to'rtta burchagi 100°, 110°, 120° va 95°. Beshinchi burchagini toping.", "(5 − 2) × 180° = 540°; 540° − 425° = 115°."]],
        mashq: ["Qavariq sakkizburchak ichki burchaklarining yig'indisini toping. Agar u muntazam bo'lsa, har bir burchagi necha gradus?", "To'rtburchakning burchaklari 2 : 3 : 4 : 6 kabi nisbatda. Har bir burchagini toping.", "Teng yonli uchburchak va kvadrat umumiy tomonga ega. Uchburchakning uchidagi burchagi 40°. Kvadrat burchagi va uchburchakning asosidagi burchagi yig'indisini toping."] }
    ] },
    { nom: "6-bob. Doira va aylana", mavzular: [
      { id: "k6-7", nom: "Aylana uzunligi. Yarim va chorak doira perimetri", test: ["s9m4", "t73"], pdf: [0, 134],
        qoida: ["Aylananing elementlari: markaz, radius r, diametr d = 2r, vatar, yoy. <b>Aylana uzunligi C = πd = 2πr</b>, π ≈ 3,14 (yoki 22/7).", "Yarim doiraning perimetri = yarim aylana uzunligi + diametr = πr + 2r; chorak doiraning perimetri = πr/2 + 2r."],
        misol: [["Radiusi 7 sm bo'lgan aylananing uzunligini toping (π ≈ 22/7).", "2 × 22/7 × 7 = 44 sm."], ["Diametri 10 sm bo'lgan yarim doiraning perimetrini toping (π ≈ 3,14).", "3,14 × 10 ÷ 2 + 10 = 15,7 + 10 = 25,7 sm."]],
        mashq: ["Diametri d = 20 sm bo'lgan aylananing uzunligini toping (π ≈ 3,14).", "Aylananing uzunligi 62,8 sm. Uning radiusini toping (π ≈ 3,14).", "Radiusi 14 sm bo'lgan chorak doiraning perimetrini toping (π ≈ 22/7)."] },
      { id: "k6-8", nom: "Doira yuzi. Murakkab shakllarning yuzi va perimetri", test: ["s9m4"], pdf: [0, 145],
        qoida: ["<b>Doira yuzi S = πr²</b>. Yarim doiraning yuzi πr²/2, chorak doiraniki πr²/4.", "Murakkab shakllar (to'g'ri to'rtburchak va yarim doira; doira kesib olingan kvadrat va h.k.) yuzini topish uchun ularni qismlarga bo'lib, yuzlarni qo'shamiz yoki ayiramiz."],
        misol: [["Radiusi 10 sm bo'lgan doiraning yuzini toping (π ≈ 3,14).", "S = 3,14 × 10² = 3,14 × 100 = 314 sm²."], ["Tomoni 14 sm bo'lgan kvadratga doira ichki chizilgan. Doiraning yuzini va kvadrat burchaklarida qolgan qismning yuzini toping (π ≈ 22/7).", "r = 14 ÷ 2 = 7 sm; doiraning yuzi 22/7 × 49 = 154 sm²; kvadratning yuzi 196 sm²; qolgan qism 196 − 154 = 42 sm²."]],
        mashq: ["Radiusi r = 5 sm bo'lgan doiraning yuzini va diametri d = 14 sm bo'lgan yarim doiraning yuzini toping.", "Yuzi 78,5 sm² bo'lgan doiraning radiusini toping (π ≈ 3,14).", "Stadion 100 m × 60 m o'lchamli to'g'ri to'rtburchak va uning qisqa tomonlariga yopishgan diametri 60 m bo'lgan ikkita yarim doiradan iborat. Stadionning perimetrini va yuzini toping (π ≈ 3,14)."] }
    ] },
    { nom: "7-bob. Tezlik", mavzular: [
      { id: "k6-9", nom: "Tezlik, masofa, vaqt. O'rtacha tezlik. Ikki jism harakati", test: ["s4m3"], pdf: [1, 7],
        qoida: ["<b>S = v × t</b>, v = S ÷ t, t = S ÷ v. Tezlik birliklari: km/soat, m/s; 1 m/s = 3,6 km/soat.", "<b>O'rtacha tezlik = butun masofa ÷ butun vaqt</b> (tezliklarning o'rta arifmetigi emas!). Qarama-qarshi yo'nalishda harakatlanganda yaqinlashish tezligi v₁ + v₂; bir yo'nalishda harakatlanganda yaqinlashish (uzoqlashish) tezligi v₁ − v₂ (v₁ > v₂)."],
        misol: [["Avtomobil 2 soat 90 km/soat tezlik bilan, keyin 3 soat 60 km/soat tezlik bilan yurdi. Uning o'rtacha tezligini toping.", "Masofa: 2 × 90 + 3 × 60 = 180 + 180 = 360 km; vaqt: 2 + 3 = 5 soat; 360 ÷ 5 = 72 km/soat."], ["Ikki shahar orasidagi masofa 420 km. Bu shaharlardan bir vaqtda bir-biriga qarab 60 km/soat va 80 km/soat tezlik bilan ikkita avtobus yo'lga chiqdi. Ular necha soatdan keyin uchrashadi?", "420 ÷ (60 + 80) = 3 soat."]],
        mashq: ["Poyezd 2,5 soatda 210 km yurdi. Uning tezligini toping. Shu tezlik bilan u 336 km ni necha soatda bosib o'tadi?", "15 m/s necha km/soatga teng?", "Piyoda 4 km/soat tezlik bilan yo'lga chiqdi, 1 soatdan keyin uning ortidan velosipedchi 12 km/soat tezlik bilan yo'lga chiqdi. Velosipedchi piyodani necha soatda quvib yetadi?"] }
    ] },
    { nom: "8-bob. Hajm", mavzular: [
      { id: "k6-10", nom: "Kuboid va kubning qirrasini va yoq yuzini topish", test: ["s4m4"], pdf: [1, 29],
        qoida: ["V = a × b × c formuladan noma'lum qirra topiladi: c = V ÷ (a × b). Kub uchun: V = a³ → a = ∛V (a × a × a = V bo'ladigan son).", "Yoqning yuzi: kuboidning old yog'i yuzi a × c, ustki yog'i yuzi a × b. To'la sirt yuzi = 2(ab + bc + ac); kubniki — 6a²."],
        misol: [["Hajmi 216 sm³ bo'lgan kubning qirrasini va bir yog'ining yuzini toping.", "6 × 6 × 6 = 216 → a = 6 sm; yoqning yuzi 6 × 6 = 36 sm²."], ["Kuboidning hajmi 300 sm³, asosi 10 sm × 6 sm. Uning balandligini va old yog'i (10 × h) yuzini toping.", "h = 300 ÷ (10 × 6) = 5 sm; old yog'ining yuzi 10 × 5 = 50 sm²."]],
        mashq: ["Hajmi 125 sm³ bo'lgan kubning qirrasini toping.", "Kuboidning o'lchamlari 8 sm × 5 sm × 4 sm. Uning to'la sirt yuzini toping.", "Hovuzning uzunligi 25 m, eni 10 m, hajmi 500 m³. Hovuzning chuqurligini toping."] }
    ] },
    { nom: "9-bob. Doiraviy diagrammalar", mavzular: [
      { id: "k6-11", nom: "Doiraviy diagrammani tuzish va o'qish", test: ["s5m4", "s9m5"], pdf: [1, 54],
        qoida: ["Butun doira 360° ga, ya'ni 100 % ga mos keladi. Har bir qismga mos sektor burchagi = (qism ÷ jami) × 360°. 40 o'quvchidan 10 tasi futbolni yoqtirsa, sektor burchagi 10/40 × 360° = 90° (doiraning choragi).", "Diagrammani o'qish: sektorning foizi yoki burchagi berilgan bo'lsa, haqiqiy miqdor = jami × foiz ÷ 100 (yoki jami × burchak ÷ 360°)."],
        misol: [["Oilaning oylik daromadi 4 000 000 so'm: oziq-ovqatga 45 %, kommunal to'lovlarga 15 %, transportga 10 % sarflanadi, qolgani jamg'ariladi. Jamg'arma qancha va unga mos sektor necha gradus?", "100 % − (45 + 15 + 10) % = 30 %; 4 000 000 × 0,3 = 1 200 000 so'm; 0,3 × 360° = 108°."]],
        mashq: ["Sinfda 36 o'quvchi bor: 12 tasi futbolni, 9 tasi shaxmatni, 6 tasi suzishni, qolganlari raqsni tanladi. Har bir sektor burchagini toping va doiraviy diagramma chizing.", "Diagrammada «musiqa» sektori 72° ga teng. Bu necha foizni tashkil etadi? So'rovda 50 kishi qatnashgan bo'lsa, ulardan nechtasi musiqani tanlagan?"] }
    ] },
    { nom: "10-bob. Fazoviy jismlar va yoyilmalari", mavzular: [
      { id: "k6-12", nom: "Konus, silindr, prizma, piramida. Yoyilmalar", test: ["t75", "t76", "t77", "t78"], pdf: [1, 75],
        qoida: ["<b>Prizma</b> — ikkita teng va parallel asosi (ko'pburchak) bor, yon yoqlari parallelogrammlardan iborat jism; <b>piramida</b> — bitta asosi bor, yon yoqlari bir uchda tutashgan uchburchaklardan iborat jism. <b>Silindrning</b> ikkita doira shaklidagi asosi bor, <b>konusning</b> bitta doira shaklidagi asosi va uchi bor.", "<b>Yoyilma</b> — jism sirtini tekislikka yoyganda hosil bo'lgan shakl: silindr yoyilmasi — 2 ta doira va to'g'ri to'rtburchak; konusniki — doira va doiraviy sektor; kubniki — 6 ta kvadrat (kubning 11 xil yoyilmasi bor)."],
        misol: [["Uchburchakli prizmaning nechta yog'i, nechta qirrasi va nechta uchi bor?", "5 yoq (2 asos + 3 yon), 9 qirra, 6 uch."], ["Silindrning radiusi 5 sm, balandligi 10 sm. Uning yoyilmasidagi to'g'ri to'rtburchakning o'lchamlarini toping (π ≈ 3,14).", "Eni silindr balandligiga teng: 10 sm; uzunligi asos aylanasining uzunligiga teng: 2 × 3,14 × 5 = 31,4 sm."]],
        mashq: ["To'rtburchakli piramidaning yoqlari, qirralari va uchlari sonini toping.", "6 ta kvadratdan iborat bir nechta shakl chizing va ulardan qaysilari kubning yoyilmasi bo'lishini qog'ozdan qirqib, buklab tekshiring.", "Izometrik panjarada o'lchamlari 2 × 3 × 2 bo'lgan kuboidni chizing."] }
    ] }
  ]
};
