/* Kuvonch Academy — Elektron kitob, 6-sinf matematika (2024 nashr, 1–2-qism mundarijasi asosida). */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[6] = {
  sinf: 6, nom: "Matematika", bosqich: "Tayanch o'rta ta'lim",
  kirish: "6-sinf darsligi 10 bob: algebra elementlari, kasrlarni bo'lish, nisbatlar, foizlar (o'sish, kamayish), shakllardagi burchaklar, doira va aylana, tezlik, hajm, doiraviy diagrammalar va fazoviy jismlar yoyilmalari.",
  pdf: [
    { nom: "1-qism (1–6-boblar)", url: "https://static.oliygoh.uz/uploads/darsliklar/6/matematika-6-sinf-uz-1-qism.pdf" },
    { nom: "2-qism (7–10-boblar)", url: "https://static.oliygoh.uz/uploads/darsliklar/6/matematika-6-sinf-uz-2-qism.pdf" },
    { nom: "Mashq daftari", url: "https://infoedu.uz/darsliklar/6/6-sinf-matematika-mashq-daftari" }
  ],
  boblar: [
    { nom: "1-bob. Algebra", mavzular: [
      { id: "k6-1", nom: "Algebraik ifodalar va ularni soddalashtirish", test: ["s7m2", "s6m4"], pdf: [0, 3],
        qoida: ["Noma'lum miqdor harf bilan belgilanadi: «Alida x ta olma, Valida undan 3 ta ko'p» → x + 3. <b>Algebraik ifoda</b> — harf va sonlar amallar bilan bog'langan yozuv: 2x + 5, 3a − b.", "<b>Koeffitsiyent</b> — harf oldidagi son (3a da 3). <b>O'xshash hadlar</b> (bir xil harfli) qo'shiladi: 2x + 5x = 7x; 4a + 3 − a = 3a + 3. x · 1 = x, x + x + x = 3x, x · x = x²."],
        misol: [["Soddalashtiring: 5y + 8 − 2y + 3", "5y − 2y = 3y; 8 + 3 = 11; 3y + 11."], ["Qalam a so'm, daftar undan 2 marta qimmat. 3 ta qalam va 2 ta daftar qancha?", "3a + 2 · 2a = 3a + 4a = 7a so'm."]],
        mashq: ["Soddalashtiring: 7m − 3m + m; 4x + 9 − x − 2; 6a + 2b − 2a + b.", "Ifoda tuzing: n ning 5 ga ko'paytmasidan 7 kam; a va b yig'indisining yarmi."] },
      { id: "k6-2", nom: "Ifodaning qiymatini topish. Tenglamalarni yechish", test: ["s6m4"], pdf: [0, 13],
        qoida: ["Harf o'rniga son qo'yib hisoblaymiz: x = 4 da 3x − 5 = 12 − 5 = 7.", "Tenglama — noma'lumi bor tenglik. Yechish: hadlarni ishorasini o'zgartirib boshqa tomonga o'tkazamiz, so'ng ax = b dan x = b ÷ a. Tekshirish: topilgan sonni qo'yib ikki tomon tengligini ko'ramiz."],
        misol: [["3x + 7 = 25", "3x = 25 − 7 = 18; x = 6. Tekshirish: 18 + 7 = 25 ✓."], ["5x − 4 = 2x + 11", "5x − 2x = 11 + 4; 3x = 15; x = 5."]],
        mashq: ["Yeching: 4x − 9 = 15; 7 + 2x = 19; 6x = 4x + 14; x/3 + 2 = 7.", "a = 2, b = 5 da 3a² + 2b − ab ning qiymati?", "Tenglama tuzib yeching: sonning 4 baravaridan 6 ni ayirsak 30 chiqadi."] }
    ] },
    { nom: "2-bob. Oddiy kasrlarni bo'lish", mavzular: [
      { id: "k6-3", nom: "Kasrni natural songa, natural sonni kasrga, kasrni kasrga bo'lish", test: ["s6m3", "s5m2"], pdf: [0, 28],
        qoida: ["Bo'lish — <b>teskari kasrga ko'paytirish</b>. a/b ning teskarisi b/a. 2/3 ÷ 4 = 2/3 × 1/4 = 2/12 = 1/6.", "6 ÷ 3/4 = 6 × 4/3 = 8 (6 ichida 3/4 lik bo'laklar 8 ta). 3/5 ÷ 2/7 = 3/5 × 7/2 = 21/10 = 2 1/10. Aralash sonlar avval noto'g'ri kasrga."],
        misol: [["4/9 ÷ 2/3 = ?", "4/9 × 3/2 = 12/18 = 2/3."], ["5 1/4 ÷ 1 3/4 = ?", "21/4 ÷ 7/4 = 21/4 × 4/7 = 3."]],
        mashq: ["3/8 ÷ 6; 10 ÷ 5/6; 7/12 ÷ 7/9; 2 2/5 ÷ 4/5.", "3/4 l sharbatni 1/8 l li stakanlarga quysak nechta stakan to'ladi?", "Mato bo'lagi 4 1/2 m. 3/4 m dan nechta bo'lak chiqadi?"] }
    ] },
    { nom: "3-bob. Nisbatlar", mavzular: [
      { id: "k6-4", nom: "Nisbat va kasr. Uch miqdor nisbati. O'zgaruvchan nisbatlar", test: ["s6m1"], pdf: [0, 55],
        qoida: ["a : b nisbat a/b kasr bilan ifodalanadi. Kasrli nisbatlar butunga keltiriladi: 1/2 : 2/3 = 3 : 4 (ikkalasini 6 ga ko'paytirib).", "<b>O'zgaruvchan nisbat</b>: miqdorlar o'zgarsa nisbat o'zgaradi. Boshida qiz : o'g'il = 3 : 2 edi, 4 ta o'g'il qo'shilgach 3 : 4 bo'ldi → ulushlar orqali masala yechiladi."],
        misol: [["A : B = 2 : 3, B : C = 4 : 5. A : B : C ni toping.", "B ni umumiy qilamiz (12): A : B = 8 : 12, B : C = 12 : 15 → 8 : 12 : 15."], ["Qutida qizil va ko'k sharlar 5 : 3 kabi. 6 ta qizil shar olingach 1 : 1 bo'ldi. Boshida nechta shar bor edi?", "5 ulush − 6 = 3 ulush → 2 ulush = 6, 1 ulush = 3; boshida 15 + 9 = 24 ta."]],
        mashq: ["Butun sonli nisbatga keltiring: 0,4 : 1,2; 2/5 : 3/10; 1,5 : 2 : 0,5.", "x : y = 3 : 7, x + y = 80. x va y?", "Akada ukasidan 2 marta ko'p pul bor edi. Aka 20 000 sarflagach pullari tenglashdi. Boshida har birida qancha?"] }
    ] },
    { nom: "4-bob. Foizlar", mavzular: [
      { id: "k6-5", nom: "Foiziga ko'ra sonning o'zini topish. O'sish va kamayish foizi", test: ["s5m4", "t56"], pdf: [0, 87],
        qoida: ["Sonning p % i A bo'lsa, son = A ÷ p × 100: 30 % i 45 → 45 ÷ 30 × 100 = 150.", "<b>O'zgarish foizi = (o'zgarish ÷ dastlabki) × 100 %</b>. 80 dan 100 ga o'sdi → 20 ÷ 80 = 25 % o'sish. 100 dan 80 ga kamaydi → 20 ÷ 100 = 20 % kamayish. p % ga o'sgan miqdor = dastlabki × (100 + p) ÷ 100."],
        misol: [["Tovar 15 % chegirma bilan 170 000 so'm. Chegirmasiz narxi?", "85 % = 170 000 → 100 % = 170 000 ÷ 85 × 100 = 200 000 so'm."], ["Aholi 40 000 dan 46 000 ga oshdi. Necha foizga?", "6 000 ÷ 40 000 × 100 = 15 %."]],
        mashq: ["Sonning 8 % i 36. Son?", "Narx 250 000 dan 300 000 ga oshdi. O'sish foizi?", "Maosh 12 % ga oshirilib 2 800 000 bo'ldi. Avvalgi maosh?", "Tovar avval 20 % ga oshirilib, keyin 20 % ga tushirildi. Narx dastlabkidan necha foizga farq qiladi?"] }
    ] },
    { nom: "5-bob. Geometrik shakllardagi burchaklar", mavzular: [
      { id: "k6-6", nom: "Uchburchak, to'rtburchak va ko'pburchaklardagi noma'lum burchaklar", test: ["s5m5", "s7m4"], pdf: [0, 119],
        qoida: ["Uchburchak burchaklari yig'indisi 180°, to'rtburchak — 360°, n-burchak — (n − 2) × 180°. Muntazam ko'pburchakning har burchagi (n − 2) × 180° ÷ n.", "Masalalarda bir nechta xossa birga ishlatiladi: teng yonli uchburchak, parallel tomonlar, qo'shni va vertikal burchaklar."],
        misol: [["Muntazam oltiburchakning bir burchagi?", "(6 − 2) × 180 ÷ 6 = 120°."], ["Beshburchakning to'rtta burchagi 100°, 110°, 120°, 95°. Beshinchisi?", "540 − 425 = 115°."]],
        mashq: ["Sakkizburchak ichki burchaklari yig'indisi? Muntazam bo'lsa har biri?", "To'rtburchakning burchaklari 2 : 3 : 4 : 6 kabi. Har biri?", "Teng yonli uchburchak va kvadrat umumiy tomonga ega. Uchburchakning uchidagi burchak 40°. Kvadrat burchagi va uchburchak asos burchagi yig'indisi?"] }
    ] },
    { nom: "6-bob. Doira va aylana", mavzular: [
      { id: "k6-7", nom: "Aylana uzunligi. Yarim va chorak doira perimetri", test: ["s9m4", "t73"], pdf: [0, 134],
        qoida: ["Aylana elementlari: markaz, radius r, diametr d = 2r, vatar, yoy. <b>Aylana uzunligi C = πd = 2πr</b>, π ≈ 3,14 (yoki 22/7).", "Yarim doira perimetri = yarim aylana + diametr = πr + 2r; chorak doira perimetri = πr/2 + 2r."],
        misol: [["Radiusi 7 sm aylana uzunligi (π ≈ 22/7)?", "2 × 22/7 × 7 = 44 sm."], ["Diametri 10 sm yarim doira perimetri (π ≈ 3,14)?", "3,14 × 10 ÷ 2 + 10 = 15,7 + 10 = 25,7 sm."]],
        mashq: ["d = 20 sm aylana uzunligi (π ≈ 3,14).", "Aylana uzunligi 62,8 sm. Radiusi?", "Radiusi 14 sm chorak doira perimetri (π ≈ 22/7)."] },
      { id: "k6-8", nom: "Doira yuzi. Murakkab shakllarning yuzi va perimetri", test: ["s9m4"], pdf: [0, 145],
        qoida: ["<b>Doira yuzi S = πr²</b>. Yarim doira yuzi πr²/2, chorak doira πr²/4.", "Murakkab shakllar: to'g'ri to'rtburchak + yarim doira; kvadratdan doira kesilgan va h.k. — qismlarga bo'lib yuzlarni qo'shamiz yoki ayiramiz."],
        misol: [["Radiusi 10 sm doira yuzi (π ≈ 3,14)?", "3,14 × 100 = 314 sm²."], ["Tomoni 14 sm kvadratga ichki chizilgan doira yuzi va burchaklarda qolgan qismning yuzi (π ≈ 22/7)?", "r = 7; doira 22/7 × 49 = 154 sm²; qolgan 196 − 154 = 42 sm²."]],
        mashq: ["r = 5 sm doira yuzi; d = 14 sm yarim doira yuzi.", "Yuzi 78,5 sm² doiraning radiusi?", "Stadion: 100 × 60 m to'g'ri to'rtburchak va ikki yarim doira (d = 60). Perimetri va yuzi?"] }
    ] },
    { nom: "7-bob. Tezlik", mavzular: [
      { id: "k6-9", nom: "Tezlik, masofa, vaqt. O'rtacha tezlik. Ikki jism harakati", test: ["s4m3"], pdf: [1, 7],
        qoida: ["<b>S = v × t</b>, v = S ÷ t, t = S ÷ v. Birliklar: km/soat, m/s; 1 m/s = 3,6 km/soat.", "<b>O'rtacha tezlik = butun masofa ÷ butun vaqt</b> (tezliklarning o'rtachasi emas!). Qarama-qarshi harakat: yaqinlashish tezligi v₁ + v₂; bir tomonga: v₁ − v₂."],
        misol: [["Avtomobil 2 soat 90 km/soat, keyin 3 soat 60 km/soat yurdi. O'rtacha tezligi?", "Masofa 180 + 180 = 360 km; vaqt 5 soat; 360 ÷ 5 = 72 km/soat."], ["Ikki shahar orasi 420 km. 60 va 80 km/soat tezlikdagi avtobuslar bir vaqtda qarama-qarshi chiqdi. Uchrashuv vaqti?", "420 ÷ (60 + 80) = 3 soat."]],
        mashq: ["Poyezd 2,5 soatda 210 km yurdi. Tezligi? Shu tezlikda 336 km ni necha soatda?", "15 m/s necha km/soat?", "Piyoda 4 km/soat bilan chiqdi, 1 soatdan keyin orqasidan velosipedchi 12 km/soat bilan. Necha soatda quvib yetadi?"] }
    ] },
    { nom: "8-bob. Hajm", mavzular: [
      { id: "k6-10", nom: "Kuboid va kubning qirrasini va yoq yuzini topish", test: ["s4m4"], pdf: [1, 29],
        qoida: ["V = a × b × c dan noma'lum qirra: c = V ÷ (a × b). Kub: V = a³ → a = ∛V (a × a × a = V bo'lgan son).", "Yoq yuzi: kuboidning old yog'i a × c, tepa yog'i a × b. To'la sirt = 2(ab + bc + ac); kub — 6a²."],
        misol: [["Hajmi 216 sm³ kubning qirrasi va bir yog'i yuzi?", "6 × 6 × 6 = 216 → a = 6 sm; yoq 36 sm²."], ["Kuboid hajmi 300 sm³, asosi 10 × 6. Balandligi va old yog'i (10 × h) yuzi?", "h = 300 ÷ 60 = 5 sm; 50 sm²."]],
        mashq: ["Hajmi 125 sm³ kub qirrasi.", "Kuboid 8 × 5 × 4 sm. To'la sirti?", "Hovuz 25 × 10 m, hajmi 500 m³. Chuqurligi?"] }
    ] },
    { nom: "9-bob. Doiraviy diagrammalar", mavzular: [
      { id: "k6-11", nom: "Doiraviy diagrammani tuzish va o'qish", test: ["s5m4", "s9m5"], pdf: [1, 54],
        qoida: ["Butun doira = 360° = 100 %. Har qism burchagi = (qism ÷ jami) × 360°. 40 o'quvchidan 10 tasi futbolni yoqtirsa, sektor 10/40 × 360 = 90° (chorak).", "Diagrammani o'qish: sektor foizi yoki burchagi berilgan → haqiqiy miqdor = jami × foiz."],
        misol: [["Oilaning oylik xarajati 4 000 000 so'm: oziq-ovqat 45 %, kommunal 15 %, transport 10 %, qolgani jamg'arma. Jamg'arma qancha va sektori necha gradus?", "100 − 70 = 30 %; 1 200 000 so'm; 0,3 × 360 = 108°."]],
        mashq: ["Sinfda 36 o'quvchi: 12 futbol, 9 shaxmat, 6 suzish, qolgani raqs. Har sektor burchagini toping va diagramma chizing.", "Diagrammada «musiqa» sektori 72°. Bu necha foiz? 50 kishidan nechtasi?"] }
    ] },
    { nom: "10-bob. Fazoviy jismlar va yoyilmalari", mavzular: [
      { id: "k6-12", nom: "Konus, silindr, prizma, piramida. Yoyilmalar", test: ["t75", "t76", "t77", "t78"], pdf: [1, 75],
        qoida: ["<b>Prizma</b> — ikki teng parallel asos (ko'pburchak) va yon yoqlari parallelogramm; <b>piramida</b> — bitta asos va uchda birlashgan uchburchak yoqlar. <b>Silindr</b> — ikki doira asos, <b>konus</b> — bitta doira asos va uch.", "<b>Yoyilma</b> — jismni tekislikka yoyganda hosil bo'lgan shakl: silindr yoyilmasi 2 doira + to'g'ri to'rtburchak; konus — doira + sektor; kub — 6 kvadrat (11 xil yoyilma bor)."],
        misol: [["Uchburchakli prizmaning nechta yog'i, qirrasi va uchi bor?", "5 yoq (2 asos + 3 yon), 9 qirra, 6 uch."], ["Silindr radiusi 5 sm, balandligi 10 sm. Yoyilmadagi to'g'ri to'rtburchakning o'lchamlari?", "Eni = balandlik 10 sm, uzunligi = aylana uzunligi 2 × 3,14 × 5 = 31,4 sm."]],
        mashq: ["To'rtburchakli piramidaning yoqlari, qirralari, uchlari soni?", "Berilgan 6 ta kvadratdan iborat yoyilmalardan qaysilari kub beradi — qog'ozdan qirqib tekshiring.", "Izometrik panjarada 2 × 3 × 2 kuboidni chizing."] }
    ] }
  ]
};
