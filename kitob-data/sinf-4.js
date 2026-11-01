/* Kuvonch Academy — Elektron kitob, 4-sinf matematika (2026 yangi nashr 1-qism va amaldagi dastur asosida). */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[4] = {
  sinf: 4, nom: "Matematika", bosqich: "Boshlang'ich ta'lim",
  kirish: "4-sinf — boshlang'ich matematikaning yakuni: millionlar sinfi, to'rt amal ustida mukammal ko'nikma, amallar tartibi, kasr tushunchasi, yuza va hajm, harakat va narx masalalari, tenglamalar, diagrammalar.",
  pdf: [
    { nom: "1-qism (2026)", url: "https://static.oliygoh.uz/uploads/darsliklar/4/matematika-4-sinf-uz-1-qism.pdf" },
    { nom: "2–4-qism", url: "https://infoedu.uz/darsliklar/4/4-sinf-matematika-2-qism" }
  ],
  boblar: [
    { nom: "1-bob. Millionlar sinfi", mavzular: [
      { id: "k4-1", nom: "Ko'p xonali sonlar: minglar va millionlar sinfi", test: ["s4m1"],
        qoida: ["1 000 ming = 1 <b>million</b> (1 000 000). Sinflar: birlar, minglar, millionlar, milliardlar — har birida uchta xona.", "7 305 418 — «yetti million uch yuz besh ming to'rt yuz o'n sakkiz». Sinflarga ajratib o'qiymiz va bo'sh joy bilan yozamiz."],
        misol: [["24 006 150 sonida nechta million, ming va birlik bor?", "24 million, 6 ming, 150 birlik. 24 006 150 = 24 000 000 + 6 000 + 150."]],
        mashq: ["Yozing: besh million o'ttiz ming; o'n ikki million yetti.", "Taqqoslang: 999 999 … 1 000 000; 3 040 000 … 3 400 000.", "8 000 000 dan 1 ta kam sonni yozing."] },
      { id: "k4-2", nom: "Sonlarni yaxlitlash. Xona birliklari", test: ["s4m1"],
        qoida: ["Yaxlitlashda keyingi raqamga qaraymiz: 0–4 bo'lsa pastga, 5–9 bo'lsa yuqoriga. 4 738 ≈ 4 700 (yuzliklarga), ≈ 5 000 (mingliklarga).", "Yaxlitlash chamalashda yordam beradi: 49 · 21 ≈ 50 · 20 = 1 000."],
        misol: [["36 489 ni o'nliklar, yuzliklar va mingliklargacha yaxlitlang.", "36 490; 36 500; 36 000."]],
        mashq: ["Mingliklarga yaxlitlang: 2 499; 7 501; 45 950.", "Chamalab toping: 198 + 403; 61 · 39; 1 198 : 4."] }
    ] },
    { nom: "2-bob. To'rt amal", mavzular: [
      { id: "k4-3", nom: "Qo'shish va ayirish. Xossalari", test: ["s3m2", "s4m1"],
        qoida: ["Ustun usulida ko'p xonali sonlarni qo'shish va ayirish (3-sinfdagidek, lekin sinflar ko'proq).", "Xossalar: a + b = b + a; (a + b) + c = a + (b + c); a − (b + c) = a − b − c; (a + b) − c = (a − c) + b."],
        misol: [["Qulay usulda: 4 870 + 2 999", "2 999 = 3 000 − 1 → 4 870 + 3 000 − 1 = 7 869."]],
        mashq: ["Ustun usulida: 358 406 + 71 985; 1 000 000 − 364 275.", "Qulay usulda: 25 + 398 + 75 + 2."] },
      { id: "k4-4", nom: "Ko'p xonali sonlarni ko'paytirish", test: ["s4m2"],
        qoida: ["Ikki va uch xonali songa ustun usulida ko'paytirish; nol bilan tugaydigan sonlarni ko'paytirishda nollar oxirida qo'shiladi: 230 · 40 = 23 · 4 = 92 → 9 200.", "Ko'paytirishning xossalari: a · b = b · a; (a · b) · c = a · (b · c); (a + b) · c = a · c + b · c (taqsimot)."],
        misol: [["4 206 · 35 = ?", "4 206 · 5 = 21 030; 4 206 · 30 = 126 180; yig'indi 147 210."]],
        mashq: ["Ustun usulida: 1 785 · 46; 3 004 · 207; 560 · 320.", "Taqsimot xossasi bilan: 48 · 25 = (40 + 8) · 25."] },
      { id: "k4-5", nom: "Ko'p xonali sonlarni bo'lish", test: ["s4m2"],
        qoida: ["Burchakli bo'lish ikki va uch xonali songa: har safar bo'luvchining «sig'ish» sonini chamalab topamiz (yaxlitlab).", "Nol bilan tugaydigan sonlarga bo'lish: 7 200 : 300 = 72 : 3 = 24. Qoldiqli bo'lishda qoldiq bo'luvchidan kichik."],
        misol: [["18 972 : 34 = ?", "189 : 34 = 5 (170, qoldiq 19); 197 : 34 = 5 (170, qoldiq 27); 272 : 34 = 8. Javob: 558."]],
        mashq: ["Burchakli bo'ling: 9 384 : 23; 61 200 : 150; 40 015 : 5.", "Tekshiring: 558 · 34 = 18 972 mi?"] },
      { id: "k4-6", nom: "Amallar tartibi. Qavsli va qavssiz ifodalar", test: ["s3m1", "s5m1"],
        qoida: ["Qavssiz ifodada avval <b>ko'paytirish va bo'lish</b> (chapdan o'ngga), keyin <b>qo'shish va ayirish</b> (chapdan o'ngga).", "Qavsli ifodada avval qavs ichidagi amallar bajariladi."],
        misol: [["36 + 24 : 6 · 2 − 10", "24 : 6 = 4, 4 · 2 = 8, 36 + 8 = 44, 44 − 10 = 34."], ["(36 + 24) : (6 · 2) − 1", "60 : 12 = 5, 5 − 1 = 4."]],
        mashq: ["Hisoblang: 100 − 72 : 8 · 3; (100 − 72) : 4 · 3; 5 · (18 + 12) : 10.", "Amallar tartibini raqamlab chiqing: 240 : 4 + 15 · 2 − (8 + 7)."] }
    ] },
    { nom: "3-bob. Kattaliklar va masalalar", mavzular: [
      { id: "k4-7", nom: "Kattaliklar jadvali: uzunlik, massa, vaqt, yuz, hajm", test: ["s2m3"],
        qoida: ["Uzunlik: 1 km = 1000 m, 1 m = 100 sm, 1 sm = 10 mm. Massa: 1 t = 10 s = 1000 kg, 1 kg = 1000 g. Vaqt: 1 sutka = 24 soat, 1 soat = 60 min, 1 min = 60 s, 1 yil = 12 oy = 365 (366) kun, 1 asr = 100 yil.", "Yuz: 1 km² = 100 ga, 1 ga = 100 a, 1 a = 100 m², 1 m² = 10 000 sm². Hajm: 1 m³ = 1000 dm³, 1 dm³ = 1 l = 1000 sm³."],
        misol: [["2 soat 15 min necha minut? 3 ga 50 a necha ar?", "135 min; 350 a."]],
        mashq: ["5 km 60 m = ? m; 3 t 7 s = ? kg; 2 sutka 6 soat = ? soat.", "Taqqoslang: 1 ga … 9 999 m²; 1 asr … 99 yil."] },
      { id: "k4-8", nom: "Harakatga doir masalalar: qarama-qarshi va bir tomonga", test: ["s4m3"],
        qoida: ["S = v · t. Ikki jism <b>qarama-qarshi</b> harakat qilsa, <b>yaqinlashish tezligi</b> = v₁ + v₂; uchrashuv vaqti = masofa : (v₁ + v₂).", "<b>Bir tomonga</b> harakatda quvib yetish: tezliklar ayirmasi v₁ − v₂; vaqt = masofa : (v₁ − v₂)."],
        misol: [["Ikki shahar orasi 360 km. Ikki avtomobil bir vaqtda qarama-qarshi yo'lga chiqdi: 70 km/soat va 50 km/soat. Necha soatdan keyin uchrashadi?", "Yaqinlashish tezligi 70 + 50 = 120 km/soat. 360 : 120 = 3 soat."]],
        mashq: ["Velosipedchi 12 km/soat, piyoda 4 km/soat tezlik bilan bir nuqtadan qarama-qarshi tomonga yo'l oldi. 2 soatdan keyin orasidagi masofa?", "Poyezd 80 km/soat, undan 120 km orqada yengil mashina 110 km/soat. Mashina necha soatda quvib yetadi?"] },
      { id: "k4-9", nom: "Narx, miqdor, qiymat. Ish va unumdorlik. Taqqoslash masalalari", test: ["s2m4", "s4m2"],
        qoida: ["Qiymat = narx · miqdor; ish = unumdorlik · vaqt. Ikki qism bo'yicha bitta narsani topish: 3 kg olma va 2 kg nok 52 000 so'm, 3 kg olma va 4 kg nok 76 000 — ayirmadan 2 kg nok 24 000.", "«Yig'indi va ayirmasi bo'yicha» masalalar: ikki son yig'indisi 50, ayirmasi 10 → kichigi (50 − 10) : 2 = 20, kattasi 30."],
        misol: [["Ikki rafda 48 ta kitob, birinchisida ikkinchisidan 8 ta ko'p. Har rafda nechta?", "Ikkinchi: (48 − 8) : 2 = 20; birinchi: 28."]],
        mashq: ["5 m mato 150 000 so'm. 8 m mato necha so'm?", "Usta 6 soatda 42 ta buyum yasaydi. 70 ta buyumni necha soatda yasaydi?", "Yig'indisi 90, ayirmasi 14 bo'lgan ikki sonni toping."] }
    ] },
    { nom: "4-bob. Kasrlar", mavzular: [
      { id: "k4-10", nom: "Ulush va kasr. Surat va maxraj", test: ["s4m4", "s5m2"],
        qoida: ["Butunni 4 teng bo'lakka bo'lsak, har biri <b>1/4</b> (chorak). <b>3/4</b> — to'rtdan uch. Kasr chizig'i ostida <b>maxraj</b> (nechta bo'lakka bo'lingani), ustida <b>surat</b> (nechta bo'lak olingani).", "Sonning kasrini topish: 20 ning 3/4 qismi = 20 : 4 · 3 = 15. Kasriga ko'ra sonni topish: 3/4 qismi 15 bo'lsa, son = 15 : 3 · 4 = 20."],
        misol: [["Sinfda 28 o'quvchi, ularning 5/7 qismi qiz. Nechta qiz?", "28 : 7 · 5 = 20 ta qiz."], ["Yo'lning 2/5 qismi 40 km. Butun yo'l?", "40 : 2 · 5 = 100 km."]],
        mashq: ["36 ning 2/9 qismi; 100 ning 7/10 qismi.", "Sonning 1/3 qismi 15 ga teng. Sonning o'zi?", "Maxraji bir xil kasrlarni taqqoslang: 3/8 … 5/8; 7/10 … 2/10."] },
      { id: "k4-11", nom: "Bir xil maxrajli kasrlarni qo'shish va ayirish", test: ["s5m2"],
        qoida: ["Maxrajlar bir xil bo'lsa suratlarni qo'shamiz (ayiramiz), maxraj o'zgarmaydi: 2/7 + 3/7 = 5/7.", "Surat maxrajga teng bo'lsa — butun: 7/7 = 1. 1 − 3/7 = 4/7."],
        misol: [["Bog'ning 2/9 qismiga olma, 4/9 qismiga nok ekildi. Jami qancha qismi ekildi? Qanchasi bo'sh?", "2/9 + 4/9 = 6/9; bo'sh: 9/9 − 6/9 = 3/9 (= 1/3)."]],
        mashq: ["5/12 + 4/12; 9/10 − 3/10; 1 − 5/8.", "Masala tuzing: pirogning 3/8 qismi yeyildi…"] }
    ] },
    { nom: "5-bob. Geometriya, tenglamalar va ma'lumotlar", mavzular: [
      { id: "k4-12", nom: "Yuza: to'g'ri to'rtburchak, kvadrat, murakkab shakllar", test: ["s4m4", "s3m4"],
        qoida: ["S = a · b (to'g'ri to'rtburchak), S = a² (kvadrat). Murakkab shaklni to'g'ri to'rtburchaklarga bo'lib yuzlarini qo'shamiz yoki katta shakldan kesilgan qismni ayiramiz.", "Perimetr va yuza birliklari har xil: P — sm, S — sm²."],
        misol: [["L shaklidagi maydon: 10 × 6 m to'g'ri to'rtburchakdan 4 × 3 m burchagi kesilgan. Yuzi?", "10 · 6 − 4 · 3 = 60 − 12 = 48 m²."]],
        mashq: ["Tomonlari 12 sm va 7 sm to'g'ri to'rtburchakning yuzi va perimetri.", "Yuzi 144 sm² kvadratning tomoni va perimetri.", "Xona 5 m × 4 m. 1 m² gilam 80 000 so'm. Gilam necha so'm?"] },
      { id: "k4-13", nom: "Burchaklar. Uchburchak turlari", test: ["s5m5"],
        qoida: ["Burchaklar <b>transportir</b> bilan gradusda o'lchanadi: to'g'ri burchak 90°, o'tkir < 90°, o'tmas > 90°, yoyiq 180°.", "Uchburchaklar burchaklariga ko'ra: o'tkir burchakli, to'g'ri burchakli, o'tmas burchakli; tomonlariga ko'ra: teng tomonli, teng yonli, turli tomonli. Burchaklar yig'indisi 180°."],
        misol: [["Uchburchakning ikki burchagi 60° va 70°. Uchinchisi? Turi?", "180 − 60 − 70 = 50°. Hamma burchak 90° dan kichik — o'tkir burchakli."]],
        mashq: ["Transportir bilan 45°, 90°, 120° burchaklar chizing.", "Burchaklari 90°, 45°, 45° bo'lgan uchburchak qanday uchburchak?"] },
      { id: "k4-14", nom: "Tenglamalar va tengsizliklar", test: ["s6m4"],
        qoida: ["Noma'lum hadni topish qoidalari (3-sinf) + tarkibli tenglamalar: (x + 35) · 4 = 200 → x + 35 = 50 → x = 15.", "Harfli ifodalar: a + b, 3 · c, (a − b) : 2 — harf o'rniga son qo'yib qiymatini topamiz."],
        misol: [["Masalani tenglama bilan yeching: Zuhra x so'm bor edi, 3 500 so'mga daftar oldi, 2 800 so'm qoldi.", "x − 3 500 = 2 800; x = 2 800 + 3 500 = 6 300 so'm."]],
        mashq: ["Yeching: (x − 12) · 6 = 90; 480 : x = 16; x · 25 = 1 000.", "a = 12, b = 4 bo'lganda (a + b) · (a − b) ning qiymati?"] },
      { id: "k4-15", nom: "Jadvallar va diagrammalar", test: ["s9m5"],
        qoida: ["Ma'lumotlarni <b>jadval</b>da, <b>ustunli diagramma</b>da (ustun balandligi — miqdor) va <b>chiziqli diagramma</b>da tasvirlash mumkin.", "Diagrammadan savollarga javob topish: eng ko'p/eng kam qaysi, farqi qancha, jami qancha."],
        misol: [["Haftada o'qilgan sahifalar: du 12, se 8, cho 15, pa 10, ju 5. Jami? Eng ko'p qaysi kuni?", "12 + 8 + 15 + 10 + 5 = 50 sahifa. Eng ko'p — chorshanba (15)."]],
        mashq: ["Sinfdoshlaringizning sevimli fanlarini so'rab jadval va ustunli diagramma tuzing.", "Diagrammadan: ikki eng katta ustun farqi qancha?"] }
    ] }
  ]
};
