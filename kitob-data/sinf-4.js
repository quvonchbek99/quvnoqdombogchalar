/* Kuvonch Academy — Elektron kitob, 4-sinf matematika (2026 yangi nashr 1-qism va amaldagi dastur asosida). */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[4] = {
  sinf: 4, nom: "Matematika", bosqich: "Boshlang'ich ta'lim",
  kirish: "4-sinfda boshlang'ich sinflar matematikasi yakunlanadi. Unda millionlar sinfi, ko'p xonali sonlar ustida to'rt amal, amallar tartibi, kasr tushunchasi, yuza va hajm, harakatga va narxga doir masalalar, tenglamalar va diagrammalar o'rganiladi.",
  pdf: [
    { nom: "1-qism (2026)", url: "https://static.oliygoh.uz/uploads/darsliklar/4/matematika-4-sinf-uz-1-qism.pdf" },
    { nom: "2–4-qism", url: "https://infoedu.uz/darsliklar/4/4-sinf-matematika-2-qism" }
  ],
  boblar: [
    { nom: "1-bob. Millionlar sinfi", mavzular: [
      { id: "k4-1", nom: "Ko'p xonali sonlar: minglar va millionlar sinfi", test: ["s4m1"],
        qoida: ["1 000 ming = 1 <b>million</b> (1 000 000). Sinflar: birlar, minglar, millionlar, milliardlar sinfi; har bir sinfda uchta xona bor.", "7 305 418 — «yetti million uch yuz besh ming to'rt yuz o'n sakkiz». Ko'p xonali sonni sinflarga ajratib o'qiymiz, yozganda esa sinflar orasida bo'sh joy qoldiramiz."],
        misol: [["24 006 150 sonida nechta million, nechta ming va nechta birlik bor?", "24 million, 6 ming, 150 birlik. 24 006 150 = 24 000 000 + 6 000 + 150."]],
        mashq: ["Raqamlar bilan yozing: besh million o'ttiz ming; o'n ikki million yetti.", "Taqqoslang: 999 999 … 1 000 000; 3 040 000 … 3 400 000.", "8 000 000 dan 1 ga kichik sonni yozing."] },
      { id: "k4-2", nom: "Sonlarni yaxlitlash. Xona birliklari", test: ["s4m1"],
        qoida: ["Yaxlitlashda yaxlitlanayotgan xonadan keyingi raqamga qaraymiz: u 0, 1, 2, 3 yoki 4 bo'lsa, xona raqami o'zgarmaydi; 5, 6, 7, 8 yoki 9 bo'lsa, xona raqami 1 ga oshadi. Keyingi barcha raqamlar o'rniga 0 yoziladi. 4 738 ≈ 4 700 (yuzlargacha), 4 738 ≈ 5 000 (minglargacha).", "Yaxlitlash chamalashda yordam beradi: 49 · 21 ≈ 50 · 20 = 1 000."],
        misol: [["36 489 sonini o'nlargacha, yuzlargacha va minglargacha yaxlitlang.", "36 489 ≈ 36 490; 36 489 ≈ 36 500; 36 489 ≈ 36 000."]],
        mashq: ["Minglargacha yaxlitlang: 2 499; 7 501; 45 950.", "Natijani chamalab toping: 198 + 403; 61 · 39; 1 198 : 4."] }
    ] },
    { nom: "2-bob. To'rt amal", mavzular: [
      { id: "k4-3", nom: "Qo'shish va ayirish. Xossalari", test: ["s3m2", "s4m1"],
        qoida: ["Ko'p xonali sonlar ustun usulida 3-sinfdagidek qo'shiladi va ayiriladi, faqat sonlarda xonalar va sinflar ko'proq bo'ladi.", "Xossalar: a + b = b + a; (a + b) + c = a + (b + c); a − (b + c) = a − b − c; (a + b) − c = (a − c) + b."],
        misol: [["Qulay usulda hisoblang: 4 870 + 2 999.", "2 999 = 3 000 − 1, shuning uchun 4 870 + 3 000 − 1 = 7 870 − 1 = 7 869."]],
        mashq: ["Ustun usulida hisoblang: 358 406 + 71 985; 1 000 000 − 364 275.", "Qulay usulda hisoblang: 25 + 398 + 75 + 2."] },
      { id: "k4-4", nom: "Ko'p xonali sonlarni ko'paytirish", test: ["s4m2"],
        qoida: ["Ikki va uch xonali songa ustun usulida ko'paytiramiz. Nol bilan tugaydigan sonlarni ko'paytirishda avval nollarsiz ko'paytirib, so'ng natija oxiriga nollarni yozamiz: 230 · 40 ni topish uchun 23 · 4 = 92, oxiriga ikkita nol yozamiz: 9 200.", "Ko'paytirishning xossalari: a · b = b · a; (a · b) · c = a · (b · c); (a + b) · c = a · c + b · c (taqsimot)."],
        misol: [["4 206 · 35 = ?", "4 206 · 5 = 21 030; 4 206 · 30 = 126 180; 21 030 + 126 180 = 147 210. Javob: 147 210."]],
        mashq: ["Ustun usulida hisoblang: 1 785 · 46; 3 004 · 207; 560 · 320.", "Taqsimot xossasidan foydalanib hisoblang: 48 · 25 = (40 + 8) · 25."] },
      { id: "k4-5", nom: "Ko'p xonali sonlarni bo'lish", test: ["s4m2"],
        qoida: ["Ikki va uch xonali songa burchakli bo'lishda bo'linmaning har bir raqamini chamalab topamiz: bo'luvchini yaxlitlab, u to'liqsiz bo'linuvchida necha marta borligini aniqlaymiz.", "Nol bilan tugaydigan sonlarga bo'lish: 7 200 : 300 = 72 : 3 = 24. Qoldiqli bo'lishda qoldiq doim bo'luvchidan kichik bo'ladi."],
        misol: [["18 972 : 34 = ?", "189 : 34 = 5 (34 · 5 = 170, qoldiq 19); 197 : 34 = 5 (34 · 5 = 170, qoldiq 27); 272 : 34 = 8. Javob: 558."]],
        mashq: ["Burchakli bo'lish usulida hisoblang: 9 384 : 23; 61 200 : 150; 40 015 : 5.", "Ko'paytirish yordamida tekshiring: 558 · 34 = 18 972 tengligi to'g'rimi?"] },
      { id: "k4-6", nom: "Amallar tartibi. Qavsli va qavssiz ifodalar", test: ["s3m1", "s5m1"],
        qoida: ["Qavssiz ifodada avval <b>ko'paytirish va bo'lish</b> (chapdan o'ngga tartib bilan), keyin <b>qo'shish va ayirish</b> (chapdan o'ngga tartib bilan) bajariladi.", "Qavsli ifodada avval qavs ichidagi amallar, keyin qolgan amallar bajariladi."],
        misol: [["Hisoblang: 36 + 24 : 6 · 2 − 10.", "24 : 6 = 4, 4 · 2 = 8, 36 + 8 = 44, 44 − 10 = 34. Javob: 34."], ["Hisoblang: (36 + 24) : (6 · 2) − 1.", "36 + 24 = 60, 6 · 2 = 12, 60 : 12 = 5, 5 − 1 = 4. Javob: 4."]],
        mashq: ["Hisoblang: 100 − 72 : 8 · 3; (100 − 72) : 4 · 3; 5 · (18 + 12) : 10.", "Amallarning bajarilish tartibini raqamlar bilan belgilang va hisoblang: 240 : 4 + 15 · 2 − (8 + 7)."] }
    ] },
    { nom: "3-bob. Kattaliklar va masalalar", mavzular: [
      { id: "k4-7", nom: "Kattaliklar jadvali: uzunlik, massa, vaqt, yuz, hajm", test: ["s2m3"],
        qoida: ["Uzunlik: 1 km = 1000 m, 1 m = 100 sm, 1 sm = 10 mm. Massa: 1 t = 10 s (sentner) = 1000 kg, 1 kg = 1000 g. Vaqt: 1 sutka = 24 soat, 1 soat = 60 min, 1 min = 60 sekund, 1 yil = 12 oy = 365 (366) kun, 1 asr = 100 yil.", "Yuz: 1 km² = 100 ga, 1 ga = 100 a, 1 a = 100 m², 1 m² = 10 000 sm². Hajm: 1 m³ = 1000 dm³, 1 dm³ = 1 l = 1000 sm³."],
        misol: [["2 soat 15 minut necha minutga teng? 3 ga 50 a necha arga teng?", "2 soat 15 min = 120 min + 15 min = 135 min; 3 ga 50 a = 300 a + 50 a = 350 a."]],
        mashq: ["Ifodalang: 5 km 60 m = ? m; 3 t 7 s = ? kg; 2 sutka 6 soat = ? soat.", "Taqqoslang: 1 ga … 9 999 m²; 1 asr … 99 yil."] },
      { id: "k4-8", nom: "Harakatga doir masalalar: qarama-qarshi va bir tomonga", test: ["s4m3"],
        qoida: ["S = v · t. Ikki jism bir-biriga qarab (<b>qarama-qarshi</b>) harakat qilsa, ularning <b>yaqinlashish tezligi</b> v₁ + v₂ ga teng; uchrashish vaqti = masofa : (v₁ + v₂).", "<b>Bir tomonga</b> harakatda orqadagi jism oldindagisini quvib yetadi (v₁ > v₂): yaqinlashish tezligi v₁ − v₂ ga teng; quvib yetish vaqti = masofa : (v₁ − v₂)."],
        misol: [["Ikki shahar orasidagi masofa 360 km. Bu shaharlardan bir vaqtda bir-biriga qarab ikki avtomobil yo'lga chiqdi. Ularning tezliklari 70 km/soat va 50 km/soat. Avtomobillar necha soatdan keyin uchrashadi?", "Yaqinlashish tezligi: 70 + 50 = 120 km/soat. Uchrashish vaqti: 360 : 120 = 3 soat. Javob: 3 soatdan keyin."]],
        mashq: ["Velosipedchi 12 km/soat, piyoda 4 km/soat tezlik bilan bir joydan qarama-qarshi tomonlarga yo'lga chiqdi. 2 soatdan keyin ular orasidagi masofa qancha bo'ladi?", "Poyezd 80 km/soat tezlik bilan ketmoqda. Undan 120 km orqada xuddi shu yo'nalishda yengil mashina 110 km/soat tezlik bilan ketmoqda. Mashina poyezdni necha soatda quvib yetadi?"] },
      { id: "k4-9", nom: "Narx, miqdor, qiymat. Ish va unumdorlik. Taqqoslash masalalari", test: ["s2m4", "s4m2"],
        qoida: ["Qiymat = narx · miqdor; ish hajmi = unumdorlik · vaqt. Ikki xaridni taqqoslab narxni topish: 3 kg olma va 2 kg nok 52 000 so'm, 3 kg olma va 4 kg nok 76 000 so'm turadi. Ikkinchi xaridda 2 kg nok ortiq, demak, 2 kg nok 76 000 − 52 000 = 24 000 so'm turadi.", "Ikki sonni yig'indisi va ayirmasi bo'yicha topish: ikki sonning yig'indisi 50, ayirmasi 10 bo'lsa, kichik son (50 − 10) : 2 = 20, katta son 20 + 10 = 30."],
        misol: [["Ikki tokchada 48 ta kitob bor. Birinchi tokchada ikkinchisidan 8 ta ko'p kitob bor. Har bir tokchada nechta kitob bor?", "Ikkinchi tokchada: (48 − 8) : 2 = 20 ta; birinchi tokchada: 20 + 8 = 28 ta kitob."]],
        mashq: ["5 m mato 150 000 so'm turadi. Xuddi shunday 8 m mato necha so'm turadi?", "Usta 6 soatda 42 ta buyum yasaydi. U xuddi shunday ishlab, 70 ta buyumni necha soatda yasaydi?", "Yig'indisi 90, ayirmasi 14 bo'lgan ikki sonni toping."] }
    ] },
    { nom: "4-bob. Kasrlar", mavzular: [
      { id: "k4-10", nom: "Ulush va kasr. Surat va maxraj", test: ["s4m4", "s5m2"],
        qoida: ["Butunni 4 ta teng bo'lakka bo'lsak, har bir bo'lak <b>1/4</b> (chorak) bo'ladi. <b>3/4</b> «to'rtdan uch» deb o'qiladi. Kasr chizig'ining ostida <b>maxraj</b> (butun nechta teng bo'lakka bo'linganini), ustida <b>surat</b> (shunday bo'laklardan nechtasi olinganini) ko'rsatadi.", "Sonning qismini topish: 20 ning 3/4 qismi = 20 : 4 · 3 = 15. Qismiga ko'ra sonni topish: sonning 3/4 qismi 15 bo'lsa, son = 15 : 3 · 4 = 20."],
        misol: [["Sinfda 28 o'quvchi bor, ularning 5/7 qismi qizlar. Sinfda nechta qiz bor?", "28 : 7 · 5 = 20. Javob: 20 ta qiz."], ["Yo'lning 2/5 qismi 40 km ga teng. Butun yo'l necha kilometr?", "40 : 2 · 5 = 100. Javob: 100 km."]],
        mashq: ["Toping: 36 ning 2/9 qismini; 100 ning 7/10 qismini.", "Sonning 1/3 qismi 15 ga teng. Shu sonni toping.", "Maxrajlari bir xil kasrlarni taqqoslang: 3/8 … 5/8; 7/10 … 2/10."] },
      { id: "k4-11", nom: "Bir xil maxrajli kasrlarni qo'shish va ayirish", test: ["s5m2"],
        qoida: ["Maxrajlari bir xil kasrlarni qo'shishda (ayirishda) suratlarini qo'shamiz (ayiramiz), maxraj esa o'zgarmaydi: 2/7 + 3/7 = 5/7.", "Surati maxrajiga teng kasr 1 butunga teng: 7/7 = 1. Shuning uchun 1 − 3/7 = 7/7 − 3/7 = 4/7."],
        misol: [["Bog'ning 2/9 qismiga olma, 4/9 qismiga nok ekildi. Bog'ning qancha qismiga daraxt ekildi? Qancha qismi bo'sh qoldi?", "Ekilgan qismi: 2/9 + 4/9 = 6/9. Bo'sh qismi: 9/9 − 6/9 = 3/9 (bu 1/3 ga teng)."]],
        mashq: ["Hisoblang: 5/12 + 4/12; 9/10 − 3/10; 1 − 5/8.", "Masalani oxirigacha tuzing va yeching: «Pirogning 3/8 qismi yeyildi…»"] }
    ] },
    { nom: "5-bob. Geometriya, tenglamalar va ma'lumotlar", mavzular: [
      { id: "k4-12", nom: "Yuza: to'g'ri to'rtburchak, kvadrat, murakkab shakllar", test: ["s4m4", "s3m4"],
        qoida: ["To'g'ri to'rtburchakning yuzi S = a · b, kvadratning yuzi S = a · a. Murakkab shaklning yuzini topish uchun uni to'g'ri to'rtburchaklarga bo'lib, ularning yuzlarini qo'shamiz yoki katta shakl yuzidan kesib olingan qism yuzini ayiramiz.", "Perimetr va yuzaning birliklari har xil: perimetr sm, m larda, yuza esa sm², m² larda o'lchanadi."],
        misol: [["L shaklidagi maydon o'lchamlari 10 m va 6 m bo'lgan to'g'ri to'rtburchakdan hosil qilingan: uning burchagidan o'lchamlari 4 m va 3 m bo'lgan to'g'ri to'rtburchak kesib olingan. Maydonning yuzini toping.", "S = 10 · 6 − 4 · 3 = 60 − 12 = 48 m². Javob: 48 m²."]],
        mashq: ["Tomonlari 12 sm va 7 sm bo'lgan to'g'ri to'rtburchakning yuzini va perimetrini toping.", "Yuzi 144 sm² bo'lgan kvadratning tomonini va perimetrini toping.", "Xonaning uzunligi 5 m, eni 4 m. Gilamning 1 m² 80 000 so'm turadi. Xona polini to'liq qoplaydigan gilam necha so'm turadi?"] },
      { id: "k4-13", nom: "Burchaklar. Uchburchak turlari", test: ["s5m5"],
        qoida: ["Burchaklar <b>transportir</b> yordamida gradus (°) larda o'lchanadi: to'g'ri burchak 90° ga teng, o'tkir burchak < 90°, o'tmas burchak > 90° (lekin 180° dan kichik), yoyiq burchak 180° ga teng.", "Uchburchaklar burchaklariga ko'ra o'tkir burchakli, to'g'ri burchakli va o'tmas burchakli bo'ladi; tomonlariga ko'ra teng tomonli, teng yonli va turli tomonli bo'ladi. Har qanday uchburchak burchaklarining yig'indisi 180° ga teng."],
        misol: [["Uchburchakning ikki burchagi 60° va 70°. Uning uchinchi burchagini toping. Bu qanday uchburchak?", "180° − 60° − 70° = 50°. Uchala burchak ham 90° dan kichik, demak, bu o'tkir burchakli uchburchak."]],
        mashq: ["Transportir yordamida 45°, 90° va 120° li burchaklar chizing.", "Burchaklari 90°, 45° va 45° bo'lgan uchburchak burchaklariga ko'ra qanday uchburchak bo'ladi?"] },
      { id: "k4-14", nom: "Tenglamalar va tengsizliklar", test: ["s6m4"],
        qoida: ["Tenglamalar 3-sinfda o'rganilgan noma'lum komponentni topish qoidalari yordamida yechiladi. Tarkibli tenglamaga misol: (x + 35) · 4 = 200; x + 35 = 200 : 4 = 50; x = 50 − 35 = 15.", "Harfli ifodalar: a + b, 3 · c, (a − b) : 2. Harflar o'rniga sonlarni qo'yib, ifodaning qiymatini topamiz."],
        misol: [["Masalani tenglama tuzib yeching: Zuhrada bir necha so'm pul bor edi. U 3 500 so'mga daftar oldi va unda 2 800 so'm qoldi. Zuhrada qancha pul bor edi?", "Zuhradagi pulni x bilan belgilaymiz: x − 3 500 = 2 800; x = 2 800 + 3 500 = 6 300. Javob: 6 300 so'm."]],
        mashq: ["Tenglamalarni yeching: (x − 12) · 6 = 90; 480 : x = 16; x · 25 = 1 000.", "a = 12, b = 4 bo'lganda (a + b) · (a − b) ifodaning qiymatini toping."] },
      { id: "k4-15", nom: "Jadvallar va diagrammalar", test: ["s9m5"],
        qoida: ["Ma'lumotlarni <b>jadval</b>, <b>ustunli diagramma</b> (ustunning balandligi miqdorni ko'rsatadi) va <b>chiziqli diagramma</b> ko'rinishida tasvirlash mumkin.", "Diagramma yordamida savollarga javob topamiz: qaysi miqdor eng ko'p yoki eng kam, ular orasidagi farq qancha, jami qancha."],
        misol: [["O'quvchi bir haftada quyidagicha sahifa o'qidi: dushanba — 12, seshanba — 8, chorshanba — 15, payshanba — 10, juma — 5. U jami necha sahifa o'qidi? Eng ko'p sahifani qaysi kuni o'qidi?", "12 + 8 + 15 + 10 + 5 = 50. Jami 50 sahifa o'qidi. Eng ko'p sahifani chorshanba kuni (15 sahifa) o'qidi."]],
        mashq: ["Sinfdoshlaringizdan sevimli fanlarini so'rang, javoblar bo'yicha jadval va ustunli diagramma tuzing.", "Tuzgan diagrammangiz bo'yicha eng baland ikki ustun ko'rsatgan sonlarning farqini toping."] }
    ] }
  ]
};
