/* Kuvonch Academy — Elektron kitob, 5-sinf matematika (2024 nashr, 1–2-qism mundarijasi asosida). */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[5] = {
  sinf: 5, nom: "Matematika", bosqich: "Tayanch o'rta ta'lim",
  kirish: "5-sinf darsligi 13 bobdan iborat: natural sonlar va to'rt amal, oddiy va o'nli kasrlar, uchburchak yuzi va hajm, nisbatlar, me'yor, foizlar, o'rtacha qiymat, burchaklar, uchburchak va to'rtburchaklar xossalari.",
  pdf: [
    { nom: "1-qism (1–6-boblar)", url: "https://static.oliygoh.uz/uploads/darsliklar/5/matematika-5-sinf-uz-1-qism.pdf" },
    { nom: "2-qism (7–13-boblar)", url: "https://static.oliygoh.uz/uploads/darsliklar/5/matematika-5-sinf-uz-2-qism.pdf" },
    { nom: "Mashq daftari", url: "https://infoedu.uz/darsliklar/5/5-sinf-matematika-mashq-daftari" }
  ],
  boblar: [
    { nom: "1-bob. Natural sonlar", mavzular: [
      { id: "k5-1", nom: "1 milliongacha va 10 milliongacha bo'lgan sonlar", test: ["s4m1"], pdf: [0, 4],
        qoida: ["Xona jadvali: millionlar | yuz minglar | o'n minglar | minglar | yuzlar | o'nlar | birlar. 53 462 = 50 000 + 3 000 + 400 + 60 + 2 — har raqamning <b>qiymati</b> uning xonasiga bog'liq.", "Sonlarni taqqoslash: xonalar soni ko'p bo'lsa katta; teng bo'lsa chapdan boshlab raqamlar taqqoslanadi. Yaxlitlash: keyingi raqam 5 va undan katta — yuqoriga."],
        misol: [["4 708 215 sonida 7 raqamining qiymati?", "7 — yuz minglar xonasida, qiymati 700 000."], ["2 965 480 ni o'n minglargacha yaxlitlang.", "Minglar xonasida 5 → yuqoriga: 2 970 000."]],
        mashq: ["Yozing: to'qqiz million to'rt yuz ming yetti.", "Taqqoslang: 3 050 000 … 3 500 000; 999 999 … 1 000 000.", "7 654 321 ni yuz minglargacha va millionlargacha yaxlitlang."] }
    ] },
    { nom: "2-bob. Sonlar ustida to'rt amal", mavzular: [
      { id: "k5-2", nom: "10, 100, 1000 ga va yaxlit sonlarga ko'paytirish va bo'lish", test: ["s3m3", "s4m2"], pdf: [0, 14],
        qoida: ["× 10, 100, 1000 — oxiriga 1, 2, 3 ta nol: 245 × 100 = 24 500. ÷ 10, 100, 1000 — nollar olinadi: 24 500 ÷ 100 = 245.", "Yaxlit songa ko'paytirish: 36 × 400 = 36 × 4 × 100 = 14 400. Bo'lish: 4 800 ÷ 60 = 4 800 ÷ 10 ÷ 6 = 480 ÷ 6 = 80."],
        misol: [["520 × 3 000 = ?", "52 × 3 = 156, nollar: 1 + 3 = 4 ta → 1 560 000."], ["72 000 ÷ 800 = ?", "720 ÷ 8 = 90."]],
        mashq: ["6 400 × 50; 1 250 × 400; 96 000 ÷ 300; 45 000 ÷ 900.", "Chamalang: 2 980 × 41 taxminan?"] },
      { id: "k5-3", nom: "Amallarni bajarish tartibi. Qavsli va qavssiz ifodalar", test: ["s3m1", "s5m1"], pdf: [0, 29],
        qoida: ["1) qavs ichi, 2) ko'paytirish va bo'lish chapdan o'ngga, 3) qo'shish va ayirish chapdan o'ngga.", "Bir nechta qavs bo'lsa ichkaridagidan boshlanadi: 2 × (30 − (8 + 4)) = 2 × 18 = 36."],
        misol: [["48 ÷ 6 × 2 + 15 − 3 × 4", "8 × 2 = 16; 3 × 4 = 12; 16 + 15 − 12 = 19."], ["(48 ÷ (6 × 2) + 15) − 3 × 4", "6 × 2 = 12; 48 ÷ 12 = 4; 4 + 15 = 19; 19 − 12 = 7."]],
        mashq: ["Hisoblang: 100 − 60 ÷ 5 × 3; (100 − 60) ÷ 5 × 3; 7 × (120 − 100 ÷ 4) + 8.", "Qavs qo'yib 2 + 3 × 4 − 1 ifodadan 19, 13 va 15 chiqaring."] },
      { id: "k5-4", nom: "Matnli masalalar (bir nechta amalli)", test: ["s4m2", "s2m4"], pdf: [0, 39],
        qoida: ["Masalani <b>chizma</b> (polosa modeli) bilan tasvirlash: har bir miqdor — bitta polosa; ko'p/kam, marta ko'p — polosa uzunligi orqali.", "Reja tuzamiz: nimani topish kerak → buning uchun nima kerak → amallar ketma-ketligi. Oxirida javobni savolga mos tekshiramiz."],
        misol: [["Do'konga 12 ta qutida 25 kg dan olma va 8 ta qutida 30 kg dan nok keltirildi. Jami necha kg meva?", "12 × 25 = 300; 8 × 30 = 240; 300 + 240 = 540 kg."], ["Alida 3 500 so'm, Valida undan 2 marta ko'p, Zuhrada ikkalasinikidan 1 000 so'm kam. Zuhrada qancha?", "Vali: 7 000; ikkalasi: 10 500; Zuhra: 9 500 so'm."]],
        mashq: ["Zavod kuniga 850 ta detal, 6 kunda nechta? Agar 1 200 tadan ishlab chiqarsa qancha ko'p bo'lar edi?", "Ikki son yig'indisi 2 400, biri ikkinchisidan 3 marta katta. Sonlarni toping (polosa modeli bilan)."] }
    ] },
    { nom: "3-bob. Oddiy kasrlar", mavzular: [
      { id: "k5-5", nom: "Bo'lishni kasr ko'rinishida ifodalash. Oddiy kasrni o'nli kasrga aylantirish", test: ["s5m2", "s5m3"], pdf: [0, 46],
        qoida: ["a ÷ b = <b>a/b</b>: 3 ÷ 4 = 3/4. Noto'g'ri kasr (surat ≥ maxraj) aralash songa: 11/4 = 2 3/4.", "Oddiy kasrni o'nli kasrga: suratni maxrajga bo'lamiz yoki maxrajni 10, 100 ga keltiramiz: 3/4 = 75/100 = 0,75; 1/5 = 2/10 = 0,2."],
        misol: [["7 ÷ 8 ni oddiy va o'nli kasr ko'rinishida yozing.", "7/8 = 0,875."], ["2 3/5 ni o'nli kasrga aylantiring.", "3/5 = 6/10 = 0,6 → 2,6."]],
        mashq: ["Kasr ko'rinishida: 5 ÷ 6, 9 ÷ 2, 15 ÷ 4 (aralash son).", "O'nli kasrga: 1/4, 7/20, 3 1/2, 9/25.", "4 ta pitsani 6 bolaga teng bo'lsa har biriga qancha?"] },
      { id: "k5-6", nom: "Aralash sonlarni qo'shish va ayirish", test: ["s5m2", "s6m3"], pdf: [0, 58],
        qoida: ["Butun qismlarni alohida, kasr qismlarni alohida qo'shamiz: 2 1/5 + 1 2/5 = 3 3/5. Kasr qismi 1 dan oshsa butunga o'tkazamiz.", "Ayirishda kasr qismi yetmasa butundan 1 «olamiz»: 3 1/4 − 1 3/4 = 2 5/4 − 1 3/4 = 1 2/4 = 1 1/2. Turli maxrajda avval umumiy maxrajga keltiramiz."],
        misol: [["4 2/3 + 2 5/6 = ?", "2/3 = 4/6; 4 4/6 + 2 5/6 = 6 9/6 = 7 3/6 = 7 1/2."], ["5 1/3 − 2 1/2 = ?", "1/3 = 2/6, 1/2 = 3/6; 5 2/6 − 2 3/6 = 4 8/6 − 2 3/6 = 2 5/6."]],
        mashq: ["3 3/8 + 1 7/8; 6 1/4 − 2 3/4; 2 2/5 + 3 1/2; 7 − 3 5/9.", "Mato 5 1/2 m edi, 2 3/4 m sarflandi. Qancha qoldi?"] },
      { id: "k5-7", nom: "Kasrlarni ko'paytirish: kasr × natural son, kasr × kasr, aralash sonlar", test: ["s6m3", "s4m4"], pdf: [0, 65],
        qoida: ["Kasrni natural songa: surat ko'paytiriladi, maxraj o'zgarmaydi: 3/7 × 2 = 6/7. Kasrni kasrga: surat × surat, maxraj × maxraj: 2/3 × 4/5 = 8/15. Oldin qisqartirish ishni osonlashtiradi.", "Aralash sonni avval noto'g'ri kasrga: 1 1/2 × 4 = 3/2 × 4 = 12/2 = 6. «Qolgan qismning qismi»: 2/3 ning 1/4 qismi = 2/3 × 1/4 = 1/6."],
        misol: [["5/8 × 4 = ?", "20/8 = 2 4/8 = 2 1/2 (yoki avval 4 va 8 ni 4 ga qisqartirib 5/2)."], ["Pulning 3/5 qismi sarflandi, qolganining 1/2 qismi ukasiga berildi. Jami pulning qanday qismi ukasiga tegdi?", "Qolgan 2/5; 2/5 × 1/2 = 2/10 = 1/5."]],
        mashq: ["2/9 × 3; 3/4 × 2/5; 1 2/3 × 6; 2 1/2 × 1 1/5.", "Kitobning 2/7 qismi 56 bet. Kitob necha bet?", "Yo'lning 3/4 qismi bosib o'tildi, qolganining 2/3 qismi — tepalik. Tepalik yo'lning qanday qismi?"] }
    ] },
    { nom: "4-bob. Uchburchakning yuzi", mavzular: [
      { id: "k5-8", nom: "Uchburchakning asosi va balandligi. Yuzini topish", test: ["s4m4"], pdf: [0, 91],
        qoida: ["Uchburchakning istalgan tomoni <b>asos</b>, qarshi uchidan asosga tushirilgan perpendikulyar — <b>balandlik</b>. O'tmas burchakli uchburchakda balandlik tashqarida bo'lishi mumkin.", "<b>S = (a × h) ÷ 2</b> — uchburchak yuzi, chunki u to'g'ri to'rtburchakning yarmi. Murakkab shakllar yuzi — to'g'ri to'rtburchak va uchburchaklarga bo'lib hisoblanadi."],
        misol: [["Asosi 12 sm, balandligi 5 sm. Yuzi?", "S = 12 × 5 ÷ 2 = 30 sm²."], ["Yuzi 36 sm², asosi 9 sm. Balandligi?", "h = 36 × 2 ÷ 9 = 8 sm."]],
        mashq: ["Asosi 14 sm, balandligi 6 sm uchburchakning yuzi.", "Kvadrat tomoni 10 sm, diagonali bilan ikki uchburchakka bo'lingan. Har birining yuzi?", "To'g'ri to'rtburchak 8 × 6 sm dan uchburchak 8 × 3 kesib olindi. Qolgan yuza?"] }
    ] },
    { nom: "5-bob. Hajm", mavzular: [
      { id: "k5-9", nom: "Fazoviy jismlar hajmi. Kuboid va kub hajmi. Suyuqlik hajmi", test: ["s4m4"], pdf: [0, 111],
        qoida: ["Birlik kubiklar (1 sm³) bilan hajmni sanash. <b>V = a × b × c</b> (kuboid), V = a³ (kub). Birliklar: sm³, m³; 1 l = 1000 sm³ = 1 dm³, 1 ml = 1 sm³.", "Uch o'lchamli (izometrik) panjarada jismlarni chizish; old, yon va tepa ko'rinishlari."],
        misol: [["Akvarium 40 sm × 25 sm × 30 sm. Necha litr suv sig'adi?", "40 × 25 × 30 = 30 000 sm³ = 30 l."], ["Hajmi 480 sm³, asosi 8 × 6 sm. Balandligi?", "480 ÷ (8 × 6) = 10 sm."]],
        mashq: ["Qirrasi 7 sm kub hajmi.", "Quti 12 × 9 × 5 sm. Hajmi? Unga nechta 1 sm³ kubik sig'adi?", "2,5 l suv necha sm³? Uni 10 × 10 sm asosli idishga quysak balandligi?"] }
    ] },
    { nom: "6-bob. Nisbatlar", mavzular: [
      { id: "k5-10", nom: "Nisbat tushunchasi. Teng kuchli nisbatlar", test: ["s6m1"], pdf: [0, 140],
        qoida: ["<b>a : b</b> — a ning b ga nisbati (o'qiladi «a ning b ga»). 6 ta olma va 4 ta nok: olma : nok = 6 : 4 = 3 : 2 (ikkalasini 2 ga bo'lib soddalashtirdik).", "Teng kuchli nisbatlar: 3 : 2 = 6 : 4 = 9 : 6. Nisbat kasr bilan bog'liq: 3 : 2 — olmalar noklarning 3/2 qismi."],
        misol: [["Sinfda 15 qiz, 10 o'g'il. Qiz : o'g'il nisbati? Qiz : jami?", "15 : 10 = 3 : 2; 15 : 25 = 3 : 5."]],
        mashq: ["Soddalashtiring: 12 : 18; 25 : 100; 8 : 20 : 4.", "45 : 30 nisbatga teng kuchli uchta nisbat yozing."] },
      { id: "k5-11", nom: "Nisbatga ko'ra miqdorlarni topish. Uchta miqdorning nisbati", test: ["s6m1"], pdf: [0, 155],
        qoida: ["Jami miqdor va nisbat berilgan: 35 ta sharni 3 : 4 nisbatda bo'lish — jami 3 + 4 = 7 ulush, bir ulush 35 ÷ 7 = 5, demak 15 va 20.", "Bir miqdor va nisbat berilgan: olma : nok = 2 : 5, olma 8 ta → bir ulush 8 ÷ 2 = 4, nok 20 ta. Uchta miqdor: 2 : 3 : 5 — jami 10 ulush."],
        misol: [["120 000 so'mni aka-uka 5 : 3 nisbatda bo'lishdi. Har biri qancha oldi?", "8 ulush; 1 ulush 15 000; 75 000 va 45 000 so'm."], ["Uchburchak tomonlari 3 : 4 : 5 kabi, perimetri 60 sm. Tomonlarini toping.", "12 ulush, 1 ulush 5 sm: 15, 20, 25 sm."]],
        mashq: ["Qizil : ko'k = 4 : 7, qizil 28 ta. Ko'k nechta? Jami?", "Qorishma 1 : 2 : 3 (sement : qum : shag'al), jami 240 kg. Har biri?", "Sinfda qiz : o'g'il = 5 : 4, o'g'illar qizlardan 3 ta kam. Sinfda nechta o'quvchi?"] }
    ] },
    { nom: "7-bob. O'nli kasrlar", mavzular: [
      { id: "k5-12", nom: "O'nli kasrlarni o'qish, yozish, qo'shish va ayirish", test: ["s5m3"], pdf: [1, 2],
        qoida: ["0,134 = 0,1 + 0,03 + 0,004 — o'ndan bir, yuzdan bir, mingdan bir xonalari. Vergul butun va kasr qismni ajratadi.", "Qo'shish va ayirishda <b>vergul vergul ostiga</b> yoziladi, kerak bo'lsa o'ngdan nol qo'shiladi: 3,675 + 4,13 = 7,805; 9,056 − 2,484 = 6,572."],
        misol: [["12,4 − 7,85 = ?", "12,40 − 7,85 = 4,55."]],
        mashq: ["5,07 + 3,9; 10 − 4,36; 0,8 + 0,25 + 1,075.", "Taqqoslang: 0,5 … 0,50; 2,09 … 2,1; 7,301 … 7,31."] },
      { id: "k5-13", nom: "O'nli kasrni 10, 100, 1000 ga va yaxlit sonlarga ko'paytirish va bo'lish", test: ["s5m3"], pdf: [1, 4],
        qoida: ["× 10, 100, 1000 — vergul o'ngga 1, 2, 3 xona suriladi: 3,75 × 100 = 375. ÷ 10, 100, 1000 — vergul chapga: 3,75 ÷ 100 = 0,0375.", "Yaxlit songa: 2,4 × 300 = 2,4 × 3 × 100 = 720; 8,4 ÷ 20 = 8,4 ÷ 2 ÷ 10 = 0,42."],
        misol: [["0,056 × 1000 va 45,2 ÷ 1000", "56; 0,0452."], ["1,25 × 40 = ?", "1,25 × 4 = 5; × 10 = 50."]],
        mashq: ["6,08 × 10; 0,9 × 1000; 73,5 ÷ 100; 0,42 ÷ 10.", "3,6 × 50; 0,15 × 200; 96,3 ÷ 30; 7,2 ÷ 400."] },
      { id: "k5-14", nom: "O'lchov birliklarini o'nli kasr yordamida almashtirish", test: ["s2m3", "s5m3"], pdf: [1, 20],
        qoida: ["1 m = 100 sm → 245 sm = 2,45 m; 1 kg = 1000 g → 1 250 g = 1,25 kg; 1 km = 1000 m → 3,6 km = 3 600 m; 1 l = 1000 ml → 0,75 l = 750 ml.", "Katta birlikka o'tishda ÷, kichikka o'tishda ×."],
        misol: [["4,08 kg necha gramm? 560 sm necha metr?", "4 080 g; 5,6 m."]],
        mashq: ["2,5 km = ? m; 375 ml = ? l; 0,07 m = ? sm; 1 450 kg = ? t.", "Masala: 1,2 kg + 850 g + 0,35 kg = ? kg."] }
    ] },
    { nom: "8-bob. Me'yor (birlik qiymat)", mavzular: [
      { id: "k5-15", nom: "Me'yorni topish, me'yorga ko'ra umumiy miqdor va birliklar sonini topish", test: ["s2m4", "s4m2"], pdf: [1, 34],
        qoida: ["<b>Me'yor</b> — bitta birlikka to'g'ri keladigan miqdor: 5 kg olma 60 000 so'm → 1 kg 12 000 so'm (me'yor); 3 soatda 150 km → soatiga 50 km.", "Umumiy = me'yor × birliklar soni; birliklar soni = umumiy ÷ me'yor."],
        misol: [["Mashina 8 l benzin bilan 120 km yuradi. 45 l bilan qancha yuradi?", "Me'yor 120 ÷ 8 = 15 km/l; 15 × 45 = 675 km."], ["1 daqiqada 45 so'z teradi. 630 so'zni necha daqiqada?", "630 ÷ 45 = 14 daqiqa."]],
        mashq: ["6 ta daftar 15 000 so'm. 14 ta daftar?", "Nasos 5 daqiqada 400 l suv quyadi. 1 soatda qancha?", "Kran 1 soatda 2,4 m³. 18 m³ ni necha soatda?"] }
    ] },
    { nom: "9-bob. Foizlar", mavzular: [
      { id: "k5-16", nom: "Foiz tushunchasi. Oddiy kasr, o'nli kasr va foiz", test: ["s5m4"], pdf: [1, 53],
        qoida: ["<b>1 % = 1/100 = 0,01</b>. 45 % = 45/100 = 0,45 = 9/20. Butun = 100 %.", "Kasrni foizga: maxrajni 100 ga keltiramiz yoki 100 ga ko'paytiramiz: 3/4 = 75/100 = 75 %; 0,6 = 60 %; 1/8 = 0,125 = 12,5 %."],
        misol: [["7/20 ni foizda, 35 % ni o'nli kasrda yozing.", "7/20 = 35/100 = 35 %; 35 % = 0,35."]],
        mashq: ["Foizda yozing: 1/2, 2/5, 0,08, 1,2.", "Kasr va o'nli kasrda: 25 %, 5 %, 150 %.", "Sinfning 40 % i qizlar. O'g'illar necha foiz?"] },
      { id: "k5-17", nom: "Miqdorning foizini topish. QQS, chegirma, omonat foizi", test: ["s5m4"], pdf: [1, 62],
        qoida: ["Miqdorning p % i = miqdor × p ÷ 100: 800 ning 15 % i = 800 × 15 ÷ 100 = 120.", "<b>Chegirma</b> 20 % — narx 80 % ga tushadi: 50 000 × 0,8 = 40 000. <b>QQS</b> 12 % — narxga qo'shiladi: 50 000 × 1,12 = 56 000. <b>Omonat</b> yiliga 15 %: 1 000 000 so'm 1 yildan keyin 1 150 000."],
        misol: [["Kurtka 240 000 so'm, 25 % chegirma. Yangi narxi?", "25 % = 60 000; 240 000 − 60 000 = 180 000 so'm."], ["Bankka 2 000 000 so'm yiliga 18 % bilan qo'yildi. 1 yildan keyin foyda?", "2 000 000 × 0,18 = 360 000 so'm."]],
        mashq: ["650 ning 30 % i; 1 200 ning 7,5 % i; 80 ning 125 % i.", "Telefon 3 200 000 so'm, QQS 12 %. QQS bilan narxi?", "Do'konda 15 % chegirma. 180 000 so'mlik tovar qancha turadi?"] }
    ] },
    { nom: "10-bob. O'rtacha qiymat", mavzular: [
      { id: "k5-18", nom: "O'rtacha qiymat. Jami, o'rtacha va soni", test: ["t57", "s4m2"], pdf: [1, 79],
        qoida: ["<b>O'rtacha = jami ÷ soni</b>. Baholar 4, 5, 3, 4 → o'rtacha (4 + 5 + 3 + 4) ÷ 4 = 4.", "Jami = o'rtacha × soni. 5 ta sonning o'rtachasi 12 bo'lsa, jami 60."],
        misol: [["Haftada 3 kun 20, 25, 30 sahifa o'qildi. O'rtacha?", "75 ÷ 3 = 25 sahifa."], ["4 ta sonning o'rtachasi 15, ulardan uchtasi 12, 18, 10. To'rtinchisi?", "Jami 60; 60 − 40 = 20."]],
        mashq: ["7, 9, 11, 13 ning o'rtachasi.", "O'rtacha tezlik 60 km/soat, 3 soat yurdi. Masofa?", "Alining 4 ta bahosi o'rtachasi 4,25. Jami ball?"] }
    ] },
    { nom: "11-bob. Burchaklar", mavzular: [
      { id: "k5-19", nom: "To'g'ri chiziqdagi, vertikal va nuqta atrofidagi burchaklar", test: ["s5m5"], pdf: [1, 92],
        qoida: ["To'g'ri chiziqdagi (qo'shni) burchaklar yig'indisi <b>180°</b>. Nuqta atrofidagi burchaklar yig'indisi <b>360°</b>.", "Ikki to'g'ri chiziq kesishganda hosil bo'lgan <b>vertikal</b> burchaklar teng."],
        misol: [["Qo'shni burchaklardan biri 115°. Ikkinchisi?", "180 − 115 = 65°."], ["Nuqta atrofida 3 ta burchak: 120°, 95°, x. x?", "360 − 120 − 95 = 145°."]],
        mashq: ["Burchak 38°. Unga qo'shni va vertikal burchaklar?", "Nuqta atrofidagi 4 ta teng burchak necha gradusdan?", "To'g'ri chiziqdagi uchta burchak 2 : 3 : 4 kabi. Har biri?"] }
    ] },
    { nom: "12-bob. Uchburchakning xossalari", mavzular: [
      { id: "k5-20", nom: "Uchburchak turlari, chizish va burchaklari", test: ["s5m5", "s7m4"], pdf: [1, 111],
        qoida: ["Tomonlariga ko'ra: teng tomonli (hamma burchak 60°), teng yonli (asosdagi burchaklar teng), turli tomonli. Burchaklariga ko'ra: o'tkir, to'g'ri, o'tmas burchakli.", "Burchaklar yig'indisi <b>180°</b>. Tashqi burchak unga qo'shni bo'lmagan ikki ichki burchak yig'indisiga teng. Sirkul-chizg'ich va transportir bilan yasash."],
        misol: [["Teng yonli uchburchakning uchidagi burchak 40°. Asosdagi burchaklar?", "(180 − 40) ÷ 2 = 70°."], ["To'g'ri burchakli uchburchakda bir o'tkir burchak 35°. Ikkinchisi?", "90 − 35 = 55°."]],
        mashq: ["Burchaklari 50°, 60°, x. x? Turi?", "Teng yonli uchburchakning asosdagi burchagi 72°. Uchidagi?", "Tomonlari 5 sm, 5 sm, 7 sm uchburchak chizing (sirkul bilan)."] }
    ] },
    { nom: "13-bob. Parallelogramm, romb va trapetsiya", mavzular: [
      { id: "k5-21", nom: "Parallelogramm, romb va trapetsiyaning xossalari. Noma'lum burchaklar", test: ["s8m3", "t72"], pdf: [1, 134],
        qoida: ["<b>Parallelogramm</b>: qarama-qarshi tomonlar parallel va teng, qarama-qarshi burchaklar teng, qo'shni burchaklar yig'indisi 180°. <b>Romb</b> — hamma tomonlari teng parallelogramm, diagonallari perpendikulyar va burchaklarni teng ikkiga bo'ladi.", "<b>Trapetsiya</b> — faqat bir juft qarama-qarshi tomoni parallel; teng yonli trapetsiyada asosdagi burchaklar teng; yon tomon bo'yidagi burchaklar yig'indisi 180°. To'rtburchak burchaklari yig'indisi 360°."],
        misol: [["Parallelogrammning bir burchagi 65°. Qolganlari?", "Qarama-qarshi 65°, qo'shnilari 180 − 65 = 115°, 115°."], ["Trapetsiyaning asosdagi burchaklari 70° va 55°. Yuqoridagilari?", "110° va 125°."]],
        mashq: ["Rombning bir burchagi 120°. Diagonal bilan hosil bo'lgan burchaklar?", "Teng yonli trapetsiyaning asosdagi burchagi 68°. Qolgan uchtasi?", "To'rtburchak burchaklari 90°, 85°, 110°, x. x?"] }
    ] }
  ]
};
