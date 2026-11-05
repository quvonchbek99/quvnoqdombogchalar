/* Kuvonch Academy — Elektron kitob, 5-sinf matematika (2024 nashr, 1–2-qism mundarijasi asosida). */
window.KA_KITOB = window.KA_KITOB || {};
window.KA_KITOB[5] = {
  sinf: 5, nom: "Matematika", bosqich: "Tayanch o'rta ta'lim",
  kirish: "5-sinf darsligi 13 bobdan iborat: natural sonlar va to'rt amal, oddiy va o'nli kasrlar, uchburchakning yuzi, hajm, nisbatlar, me'yor, foizlar, o'rtacha qiymat, burchaklar, uchburchak va to'rtburchaklar xossalari.",
  pdf: [
    { nom: "1-qism (1–6-boblar)", url: "https://static.oliygoh.uz/uploads/darsliklar/5/matematika-5-sinf-uz-1-qism.pdf" },
    { nom: "2-qism (7–13-boblar)", url: "https://static.oliygoh.uz/uploads/darsliklar/5/matematika-5-sinf-uz-2-qism.pdf" },
    { nom: "Mashq daftari", url: "https://infoedu.uz/darsliklar/5/5-sinf-matematika-mashq-daftari" }
  ],
  boblar: [
    { nom: "1-bob. Natural sonlar", mavzular: [
      { id: "k5-1", nom: "1 milliongacha va 10 milliongacha bo'lgan sonlar", test: ["s4m1"], pdf: [0, 4],
        qoida: ["Xona jadvali: millionlar | yuz minglar | o'n minglar | minglar | yuzlar | o'nlar | birlar. 53 462 = 50 000 + 3 000 + 400 + 60 + 2 — har bir raqamning <b>qiymati</b> u turgan xonaga bog'liq.", "Sonlarni taqqoslash: xonalari soni ko'p bo'lgan son katta; xonalar soni teng bo'lsa, raqamlar chapdan boshlab xonama-xona taqqoslanadi. Yaxlitlash: tashlanadigan birinchi raqam 5 yoki undan katta bo'lsa, oldingi raqamga 1 qo'shiladi (yuqoriga yaxlitlanadi), 5 dan kichik bo'lsa, oldingi raqam o'zgarmaydi."],
        misol: [["4 708 215 sonida 7 raqamining qiymatini aniqlang.", "7 raqami yuz minglar xonasida turibdi, uning qiymati 700 000."], ["2 965 480 ni o'n minglargacha yaxlitlang.", "Minglar xonasidagi raqam 5, shuning uchun yuqoriga yaxlitlaymiz: 2 970 000."]],
        mashq: ["Raqamlar bilan yozing: to'qqiz million to'rt yuz ming yetti.", "Taqqoslang: 3 050 000 … 3 500 000; 999 999 … 1 000 000.", "7 654 321 ni yuz minglargacha va millionlargacha yaxlitlang."] }
    ] },
    { nom: "2-bob. Sonlar ustida to'rt amal", mavzular: [
      { id: "k5-2", nom: "10, 100, 1000 ga va yaxlit sonlarga ko'paytirish va bo'lish", test: ["s3m3", "s4m2"], pdf: [0, 14],
        qoida: ["10, 100, 1000 ga ko'paytirishda sonning oxiriga mos ravishda 1, 2, 3 ta nol yoziladi: 245 × 100 = 24 500. 10, 100, 1000 ga bo'lishda sonning oxiridan shuncha nol olib tashlanadi: 24 500 ÷ 100 = 245.", "Yaxlit songa ko'paytirish: 36 × 400 = 36 × 4 × 100 = 14 400. Yaxlit songa bo'lish: 4 800 ÷ 60 = 4 800 ÷ 10 ÷ 6 = 480 ÷ 6 = 80."],
        misol: [["520 × 3 000 = ?", "52 × 3 = 156, oxiriga 1 + 3 = 4 ta nol yozamiz: 1 560 000."], ["72 000 ÷ 800 = ?", "Ikkala sondan ikkitadan nol olib tashlaymiz: 720 ÷ 8 = 90."]],
        mashq: ["Hisoblang: 6 400 × 50; 1 250 × 400; 96 000 ÷ 300; 45 000 ÷ 900.", "Chamalang: 2 980 × 41 ko'paytma taxminan nechaga teng?"] },
      { id: "k5-3", nom: "Amallarni bajarish tartibi. Qavsli va qavssiz ifodalar", test: ["s3m1", "s5m1"], pdf: [0, 29],
        qoida: ["Amallar tartibi: 1) qavs ichidagi amallar; 2) ko'paytirish va bo'lish (chapdan o'ngga); 3) qo'shish va ayirish (chapdan o'ngga).", "Qavslar bir nechta bo'lsa, eng ichkaridagi qavsdan boshlanadi: 2 × (30 − (8 + 4)) = 2 × 18 = 36."],
        misol: [["48 ÷ 6 × 2 + 15 − 3 × 4", "48 ÷ 6 = 8; 8 × 2 = 16; 3 × 4 = 12; 16 + 15 − 12 = 19."], ["(48 ÷ (6 × 2) + 15) − 3 × 4", "6 × 2 = 12; 48 ÷ 12 = 4; 4 + 15 = 19; 19 − 12 = 7."]],
        mashq: ["Hisoblang: 100 − 60 ÷ 5 × 3; (100 − 60) ÷ 5 × 3; 7 × (120 − 100 ÷ 4) + 8.", "2 + 3 × 4 − 1 ifodaga qavslar qo'yib, qiymati 19, 13 va 15 ga teng bo'lgan ifodalar hosil qiling."] },
      { id: "k5-4", nom: "Matnli masalalar (bir nechta amalli)", test: ["s4m2", "s2m4"], pdf: [0, 39],
        qoida: ["Masalani <b>chizma</b> (tasma modeli) yordamida tasvirlaymiz: har bir miqdor — bitta tasma; «… ta ko'p (kam)», «… marta ko'p» kabi munosabatlar tasmalar uzunligi orqali ko'rsatiladi.", "Reja tuzamiz: nimani topish kerak → buning uchun nima kerak → amallar ketma-ketligi. Oxirida javob masala savoliga mos kelishini tekshiramiz."],
        misol: [["Do'konga 12 ta qutida 25 kg dan olma va 8 ta qutida 30 kg dan nok keltirildi. Jami necha kilogramm meva keltirildi?", "12 × 25 = 300; 8 × 30 = 240; 300 + 240 = 540 kg."], ["Alida 3 500 so'm bor, Valida undan 2 marta ko'p, Zuhrada esa ikkalasining pulidan birgalikda 1 000 so'm kam. Zuhrada qancha pul bor?", "Valida: 3 500 × 2 = 7 000; ikkalasida: 3 500 + 7 000 = 10 500; Zuhrada: 10 500 − 1 000 = 9 500 so'm."]],
        mashq: ["Zavod kuniga 850 ta detal ishlab chiqaradi. U 6 kunda nechta detal ishlab chiqaradi? Agar kuniga 1 200 tadan ishlab chiqarsa, 6 kunda qancha ko'p detal bo'lar edi?", "Ikki sonning yig'indisi 2 400 ga teng, biri ikkinchisidan 3 marta katta. Sonlarni tasma modeli yordamida toping."] }
    ] },
    { nom: "3-bob. Oddiy kasrlar", mavzular: [
      { id: "k5-5", nom: "Bo'lishni kasr ko'rinishida ifodalash. Oddiy kasrni o'nli kasrga aylantirish", test: ["s5m2", "s5m3"], pdf: [0, 46],
        qoida: ["a ÷ b = <b>a/b</b> (b ≠ 0): 3 ÷ 4 = 3/4. Noto'g'ri kasrni (surat ≥ maxraj) aralash songa aylantirish mumkin: 11/4 = 2 3/4.", "Oddiy kasrni o'nli kasrga aylantirish uchun suratni maxrajga bo'lamiz yoki kasrni 10, 100, … maxrajga keltiramiz: 3/4 = 75/100 = 0,75; 1/5 = 2/10 = 0,2."],
        misol: [["7 ÷ 8 ni oddiy va o'nli kasr ko'rinishida yozing.", "7/8 = 0,875."], ["2 3/5 ni o'nli kasrga aylantiring.", "3/5 = 6/10 = 0,6 → 2,6."]],
        mashq: ["Kasr ko'rinishida yozing: 5 ÷ 6, 9 ÷ 2, 15 ÷ 4 (noto'g'ri kasrlarni aralash son ko'rinishida ham yozing).", "O'nli kasrga aylantiring: 1/4, 7/20, 3 1/2, 9/25.", "4 ta pitsa 6 bolaga teng bo'lib berildi. Har biriga qancha pitsa tegadi?"] },
      { id: "k5-6", nom: "Aralash sonlarni qo'shish va ayirish", test: ["s5m2", "s6m3"], pdf: [0, 58],
        qoida: ["Butun qismlarni alohida, kasr qismlarni alohida qo'shamiz: 2 1/5 + 1 2/5 = 3 3/5. Kasr qismi noto'g'ri kasr bo'lib qolsa, undan butun qismini ajratib, butunlarga qo'shamiz.", "Ayirishda kamayuvchining kasr qismi yetmasa, uning butun qismidan 1 ni «olamiz»: 3 1/4 − 1 3/4 = 2 5/4 − 1 3/4 = 1 2/4 = 1 1/2. Maxrajlar har xil bo'lsa, avval kasrlarni umumiy maxrajga keltiramiz."],
        misol: [["4 2/3 + 2 5/6 = ?", "2/3 = 4/6; 4 4/6 + 2 5/6 = 6 9/6 = 7 3/6 = 7 1/2."], ["5 1/3 − 2 1/2 = ?", "1/3 = 2/6, 1/2 = 3/6; 5 2/6 − 2 3/6 = 4 8/6 − 2 3/6 = 2 5/6."]],
        mashq: ["Hisoblang: 3 3/8 + 1 7/8; 6 1/4 − 2 3/4; 2 2/5 + 3 1/2; 7 − 3 5/9.", "Mato 5 1/2 m edi, undan 2 3/4 m sarflandi. Qancha mato qoldi?"] },
      { id: "k5-7", nom: "Kasrlarni ko'paytirish: kasr × natural son, kasr × kasr, aralash sonlar", test: ["s6m3", "s4m4"], pdf: [0, 65],
        qoida: ["Kasrni natural songa ko'paytirishda uning surati shu songa ko'paytiriladi, maxraji o'zgarmaydi: 3/7 × 2 = 6/7. Kasrni kasrga ko'paytirishda suratlar o'zaro, maxrajlar o'zaro ko'paytiriladi: 2/3 × 4/5 = 8/15. Ko'paytirishdan oldin qisqartirish hisoblashni osonlashtiradi.", "Aralash son avval noto'g'ri kasrga aylantiriladi: 1 1/2 × 4 = 3/2 × 4 = 12/2 = 6. Sonning qismini topish: 2/3 ning 1/4 qismi = 2/3 × 1/4 = 2/12 = 1/6."],
        misol: [["5/8 × 4 = ?", "5/8 × 4 = 20/8 = 2 4/8 = 2 1/2 (yoki avval 4 va 8 ni 4 ga qisqartirib: 5/2 = 2 1/2)."], ["Pulning 3/5 qismi sarflandi, qolganining 1/2 qismi ukasiga berildi. Butun pulning qanday qismi ukasiga tegdi?", "Qolgani: 1 − 3/5 = 2/5; ukasiga: 2/5 × 1/2 = 2/10 = 1/5."]],
        mashq: ["Hisoblang: 2/9 × 3; 3/4 × 2/5; 1 2/3 × 6; 2 1/2 × 1 1/5.", "Kitobning 2/7 qismi 56 betni tashkil etadi. Kitob necha betdan iborat?", "Yo'lning 3/4 qismi bosib o'tildi, qolgan qismining 2/3 qismi tepalikdan iborat. Tepalik butun yo'lning qanday qismini tashkil etadi?"] }
    ] },
    { nom: "4-bob. Uchburchakning yuzi", mavzular: [
      { id: "k5-8", nom: "Uchburchakning asosi va balandligi. Yuzini topish", test: ["s4m4"], pdf: [0, 91],
        qoida: ["Uchburchakning istalgan tomonini <b>asos</b> deb olish mumkin; qarshisidagi uchdan asosga (yoki uning davomiga) tushirilgan perpendikulyar — <b>balandlik</b>. O'tmas burchakli uchburchakda balandlik uchburchakdan tashqarida yotishi mumkin.", "<b>S = (a × h) ÷ 2</b> — uchburchakning yuzi, chunki u tomonlari a va h bo'lgan to'g'ri to'rtburchak yuzining yarmiga teng. Murakkab shakllarning yuzi ularni to'g'ri to'rtburchak va uchburchaklarga bo'lib hisoblanadi."],
        misol: [["Uchburchakning asosi 12 sm, balandligi 5 sm. Yuzini toping.", "S = 12 × 5 ÷ 2 = 30 sm²."], ["Uchburchakning yuzi 36 sm², asosi 9 sm. Balandligini toping.", "h = 36 × 2 ÷ 9 = 8 sm."]],
        mashq: ["Asosi 14 sm, balandligi 6 sm bo'lgan uchburchakning yuzini toping.", "Tomoni 10 sm bo'lgan kvadrat diagonali bilan ikkita uchburchakka bo'lingan. Har bir uchburchakning yuzini toping.", "O'lchamlari 8 sm × 6 sm bo'lgan to'g'ri to'rtburchakdan asosi 8 sm, balandligi 3 sm bo'lgan uchburchak kesib olindi. Qolgan qismning yuzini toping."] }
    ] },
    { nom: "5-bob. Hajm", mavzular: [
      { id: "k5-9", nom: "Fazoviy jismlar hajmi. Kuboid va kub hajmi. Suyuqlik hajmi", test: ["s4m4"], pdf: [0, 111],
        qoida: ["Hajmni birlik kublar (1 sm³) yordamida sanash mumkin. <b>V = a × b × c</b> (kuboid), V = a³ (kub). Birliklar: sm³, m³; 1 l = 1000 sm³ = 1 dm³, 1 ml = 1 sm³.", "Fazoviy jismlarni izometrik panjarada chizish; jismning old, yon va ustdan ko'rinishlari."],
        misol: [["Akvariumning o'lchamlari 40 sm × 25 sm × 30 sm. Unga necha litr suv sig'adi?", "40 × 25 × 30 = 30 000 sm³ = 30 l."], ["Kuboidning hajmi 480 sm³, asosi 8 sm × 6 sm. Balandligini toping.", "480 ÷ (8 × 6) = 10 sm."]],
        mashq: ["Qirrasi 7 sm bo'lgan kubning hajmini toping.", "Qutining o'lchamlari 12 sm × 9 sm × 5 sm. Uning hajmini toping. Qutiga hajmi 1 sm³ bo'lgan nechta kub sig'adi?", "2,5 l suv necha sm³ ga teng? Uni asosi 10 sm × 10 sm bo'lgan idishga quysak, suv sathining balandligi qancha bo'ladi?"] }
    ] },
    { nom: "6-bob. Nisbatlar", mavzular: [
      { id: "k5-10", nom: "Nisbat tushunchasi. Teng kuchli nisbatlar", test: ["s6m1"], pdf: [0, 140],
        qoida: ["<b>a : b</b> yozuvi «a ning b ga nisbati» deb o'qiladi. 6 ta olma va 4 ta nok bo'lsa: olma : nok = 6 : 4 = 3 : 2 (nisbatning ikkala hadini 2 ga bo'lib soddalashtirdik).", "Teng kuchli nisbatlar: 3 : 2 = 6 : 4 = 9 : 6. Nisbat kasr bilan bog'liq: olma : nok = 3 : 2 bo'lsa, olmalar soni noklar sonining 3/2 qismiga teng."],
        misol: [["Sinfda 15 ta qiz va 10 ta o'g'il bola bor. Qizlar sonining o'g'il bolalar soniga nisbatini va qizlar sonining jami o'quvchilar soniga nisbatini toping.", "15 : 10 = 3 : 2; 15 : 25 = 3 : 5."]],
        mashq: ["Nisbatlarni soddalashtiring: 12 : 18; 25 : 100; 8 : 20 : 4.", "45 : 30 nisbatga teng kuchli uchta nisbat yozing."] },
      { id: "k5-11", nom: "Nisbatga ko'ra miqdorlarni topish. Uchta miqdorning nisbati", test: ["s6m1"], pdf: [0, 155],
        qoida: ["Jami miqdor va nisbat berilgan bo'lsa: 35 ta sharni 3 : 4 nisbatda bo'lish uchun jami 3 + 4 = 7 ulush olamiz, bir ulush 35 ÷ 7 = 5 ta; demak, 15 ta va 20 ta.", "Bir miqdor va nisbat berilgan bo'lsa: olma : nok = 2 : 5, olma 8 ta → bir ulush 8 ÷ 2 = 4, nok 4 × 5 = 20 ta. Uchta miqdorning nisbati 2 : 3 : 5 bo'lsa, jami 10 ulush bo'ladi."],
        misol: [["120 000 so'mni aka-uka 5 : 3 nisbatda bo'lishdi. Har biri qancha oldi?", "5 + 3 = 8 ulush; 1 ulush 120 000 ÷ 8 = 15 000; akasi 75 000 so'm, ukasi 45 000 so'm oldi."], ["Uchburchakning tomonlari 3 : 4 : 5 kabi nisbatda, perimetri 60 sm. Tomonlarini toping.", "3 + 4 + 5 = 12 ulush, 1 ulush 60 ÷ 12 = 5 sm; tomonlari 15 sm, 20 sm, 25 sm."]],
        mashq: ["Qizil va ko'k sharlar soni 4 : 7 nisbatda, qizil sharlar 28 ta. Ko'k sharlar nechta? Jami nechta shar bor?", "Qorishmada sement, qum va shag'al 1 : 2 : 3 nisbatda olingan, qorishmaning massasi 240 kg. Har biridan necha kilogramm olingan?", "Sinfda qizlar va o'g'il bolalar soni 5 : 4 nisbatda, o'g'il bolalar qizlardan 3 ta kam. Sinfda nechta o'quvchi bor?"] }
    ] },
    { nom: "7-bob. O'nli kasrlar", mavzular: [
      { id: "k5-12", nom: "O'nli kasrlarni o'qish, yozish, qo'shish va ayirish", test: ["s5m3"], pdf: [1, 2],
        qoida: ["0,134 = 0,1 + 0,03 + 0,004 — o'ndan birlar, yuzdan birlar, mingdan birlar xonalari. Vergul butun qismni kasr qismdan ajratadi.", "Qo'shish va ayirishda <b>vergul vergul ostiga</b> yoziladi, kerak bo'lsa, kasr qismining oxiriga nollar yoziladi: 3,675 + 4,13 = 7,805; 9,056 − 2,484 = 6,572."],
        misol: [["12,4 − 7,85 = ?", "12,40 − 7,85 = 4,55."]],
        mashq: ["Hisoblang: 5,07 + 3,9; 10 − 4,36; 0,8 + 0,25 + 1,075.", "Taqqoslang: 0,5 … 0,50; 2,09 … 2,1; 7,301 … 7,31."] },
      { id: "k5-13", nom: "O'nli kasrni 10, 100, 1000 ga va yaxlit sonlarga ko'paytirish va bo'lish", test: ["s5m3"], pdf: [1, 4],
        qoida: ["O'nli kasrni 10, 100, 1000 ga ko'paytirishda vergul mos ravishda 1, 2, 3 xona o'ngga suriladi: 3,75 × 100 = 375. 10, 100, 1000 ga bo'lishda vergul shuncha xona chapga suriladi: 3,75 ÷ 100 = 0,0375.", "Yaxlit songa ko'paytirish va bo'lish: 2,4 × 300 = 2,4 × 3 × 100 = 720; 8,4 ÷ 20 = 8,4 ÷ 2 ÷ 10 = 0,42."],
        misol: [["Hisoblang: 0,056 × 1000 va 45,2 ÷ 1000.", "56; 0,0452."], ["1,25 × 40 = ?", "1,25 × 4 = 5; 5 × 10 = 50."]],
        mashq: ["Hisoblang: 6,08 × 10; 0,9 × 1000; 73,5 ÷ 100; 0,42 ÷ 10.", "Hisoblang: 3,6 × 50; 0,15 × 200; 96,3 ÷ 30; 7,2 ÷ 400."] },
      { id: "k5-14", nom: "O'lchov birliklarini o'nli kasr yordamida almashtirish", test: ["s2m3", "s5m3"], pdf: [1, 20],
        qoida: ["1 m = 100 sm → 245 sm = 2,45 m; 1 kg = 1000 g → 1 250 g = 1,25 kg; 1 km = 1000 m → 3,6 km = 3 600 m; 1 l = 1000 ml → 0,75 l = 750 ml.", "Kattaroq birlikka o'tishda bo'lamiz, kichikroq birlikka o'tishda ko'paytiramiz."],
        misol: [["4,08 kg necha gramm? 560 sm necha metr?", "4 080 g; 5,6 m."]],
        mashq: ["2,5 km = ? m; 375 ml = ? l; 0,07 m = ? sm; 1 450 kg = ? t.", "Hisoblang: 1,2 kg + 850 g + 0,35 kg = ? kg."] }
    ] },
    { nom: "8-bob. Me'yor (birlik qiymat)", mavzular: [
      { id: "k5-15", nom: "Me'yorni topish, me'yorga ko'ra umumiy miqdor va birliklar sonini topish", test: ["s2m4", "s4m2"], pdf: [1, 34],
        qoida: ["<b>Me'yor</b> — bitta birlikka to'g'ri keladigan miqdor: 5 kg olma 60 000 so'm → 1 kg 12 000 so'm (me'yor); 3 soatda 150 km → soatiga 50 km.", "Umumiy miqdor = me'yor × birliklar soni; birliklar soni = umumiy miqdor ÷ me'yor."],
        misol: [["Mashina 8 l benzin bilan 120 km yuradi. 45 l benzin bilan necha kilometr yuradi?", "Me'yor 120 ÷ 8 = 15 km/l; 15 × 45 = 675 km."], ["Kotiba 1 daqiqada 45 ta so'z teradi. U 630 ta so'zni necha daqiqada teradi?", "630 ÷ 45 = 14 daqiqa."]],
        mashq: ["6 ta daftar 15 000 so'm turadi. 14 ta daftar qancha turadi?", "Nasos 5 daqiqada 400 l suv quyadi. U 1 soatda necha litr suv quyadi?", "Krandan 1 soatda 2,4 m³ suv oqib chiqadi. 18 m³ suv necha soatda oqib chiqadi?"] }
    ] },
    { nom: "9-bob. Foizlar", mavzular: [
      { id: "k5-16", nom: "Foiz tushunchasi. Oddiy kasr, o'nli kasr va foiz", test: ["s5m4"], pdf: [1, 53],
        qoida: ["<b>1 % = 1/100 = 0,01</b>. 45 % = 45/100 = 0,45 = 9/20. Butun miqdor = 100 %.", "Kasrni foizga aylantirish uchun uni 100 maxrajga keltiramiz yoki kasrni 100 ga ko'paytirib, % belgisini qo'yamiz: 3/4 = 75/100 = 75 %; 0,6 = 60 %; 1/8 = 0,125 = 12,5 %."],
        misol: [["7/20 ni foizlarda, 35 % ni o'nli kasr ko'rinishida yozing.", "7/20 = 35/100 = 35 %; 35 % = 0,35."]],
        mashq: ["Foizlarda yozing: 1/2, 2/5, 0,08, 1,2.", "Oddiy kasr va o'nli kasr ko'rinishida yozing: 25 %, 5 %, 150 %.", "Sinf o'quvchilarining 40 % i qizlar. O'g'il bolalar necha foizni tashkil etadi?"] },
      { id: "k5-17", nom: "Miqdorning foizini topish. QQS, chegirma, omonat foizi", test: ["s5m4"], pdf: [1, 62],
        qoida: ["Miqdorning p % i = miqdor × p ÷ 100: 800 ning 15 % i = 800 × 15 ÷ 100 = 120.", "<b>Chegirma</b> 20 % bo'lsa, yangi narx dastlabki narxning 80 % ini tashkil etadi: 50 000 × 0,8 = 40 000. <b>QQS</b> (qo'shilgan qiymat solig'i) 12 % bo'lsa, u narxga qo'shiladi: 50 000 × 1,12 = 56 000. <b>Omonat</b> yiliga 15 % bo'lsa, 1 000 000 so'm 1 yildan keyin 1 150 000 so'm bo'ladi."],
        misol: [["Kurtka 240 000 so'm turadi, unga 25 % chegirma qilindi. Kurtkaning yangi narxini toping.", "240 000 ning 25 % i = 60 000; 240 000 − 60 000 = 180 000 so'm."], ["Bankka 2 000 000 so'm yillik 18 % li omonatga qo'yildi. 1 yildan keyin qancha foyda olinadi?", "2 000 000 × 0,18 = 360 000 so'm."]],
        mashq: ["Toping: 650 ning 30 % ini; 1 200 ning 7,5 % ini; 80 ning 125 % ini.", "Telefon narxi 3 200 000 so'm, QQS 12 %. Telefonning QQS bilan narxini toping.", "Do'konda 15 % chegirma e'lon qilindi. 180 000 so'mlik tovar chegirma bilan qancha turadi?"] }
    ] },
    { nom: "10-bob. O'rtacha qiymat", mavzular: [
      { id: "k5-18", nom: "O'rtacha qiymat. Jami, o'rtacha va soni", test: ["t57", "s4m2"], pdf: [1, 79],
        qoida: ["<b>O'rtacha qiymat = jami ÷ qiymatlar soni</b>. Baholar 4, 5, 3, 4 bo'lsa, o'rtacha qiymat (4 + 5 + 3 + 4) ÷ 4 = 4.", "Jami = o'rtacha qiymat × qiymatlar soni. 5 ta sonning o'rtacha qiymati 12 bo'lsa, ularning yig'indisi 60 ga teng."],
        misol: [["Haftaning 3 kunida 20, 25 va 30 sahifadan kitob o'qildi. Kuniga o'rtacha necha sahifa o'qilgan?", "(20 + 25 + 30) ÷ 3 = 75 ÷ 3 = 25 sahifa."], ["4 ta sonning o'rtacha qiymati 15 ga teng, ulardan uchtasi 12, 18 va 10. To'rtinchi sonni toping.", "Jami: 15 × 4 = 60; 12 + 18 + 10 = 40; 60 − 40 = 20."]],
        mashq: ["7, 9, 11, 13 sonlarining o'rtacha qiymatini toping.", "Avtomobil 3 soat davomida o'rtacha 60 km/soat tezlik bilan yurdi. U qancha masofani bosib o'tdi?", "Alining 4 ta bahosining o'rtacha qiymati 4,25 ga teng. Baholarining yig'indisini toping."] }
    ] },
    { nom: "11-bob. Burchaklar", mavzular: [
      { id: "k5-19", nom: "To'g'ri chiziqdagi, vertikal va nuqta atrofidagi burchaklar", test: ["s5m5"], pdf: [1, 92],
        qoida: ["To'g'ri chiziqdagi (qo'shni) burchaklar yig'indisi <b>180°</b>. Nuqta atrofidagi burchaklar yig'indisi <b>360°</b>.", "Ikki to'g'ri chiziq kesishganda hosil bo'lgan <b>vertikal</b> burchaklar teng."],
        misol: [["Qo'shni burchaklardan biri 115°. Ikkinchisini toping.", "180° − 115° = 65°."], ["Nuqta atrofidagi 3 ta burchak 120°, 95° va x ga teng. x ni toping.", "360° − 120° − 95° = 145°."]],
        mashq: ["Burchak 38° ga teng. Unga qo'shni va vertikal burchaklarni toping.", "Nuqta atrofidagi 4 ta teng burchakning har biri necha gradusga teng?", "To'g'ri chiziqdagi uchta burchak 2 : 3 : 4 kabi nisbatda. Har bir burchakni toping."] }
    ] },
    { nom: "12-bob. Uchburchakning xossalari", mavzular: [
      { id: "k5-20", nom: "Uchburchak turlari, chizish va burchaklari", test: ["s5m5", "s7m4"], pdf: [1, 111],
        qoida: ["Tomonlariga ko'ra: teng tomonli (barcha burchaklari 60°), teng yonli (asosidagi burchaklari teng), turli tomonli. Burchaklariga ko'ra: o'tkir burchakli, to'g'ri burchakli, o'tmas burchakli.", "Uchburchak burchaklarining yig'indisi <b>180°</b>. Tashqi burchak unga qo'shni bo'lmagan ikki ichki burchak yig'indisiga teng. Uchburchakni sirkul, chizg'ich va transportir yordamida yasash."],
        misol: [["Teng yonli uchburchakning uchidagi burchagi 40°. Asosidagi burchaklarini toping.", "(180° − 40°) ÷ 2 = 70°."], ["To'g'ri burchakli uchburchakning bir o'tkir burchagi 35°. Ikkinchi o'tkir burchagini toping.", "90° − 35° = 55°."]],
        mashq: ["Uchburchakning burchaklari 50°, 60° va x. x ni toping va uchburchakning turini aniqlang.", "Teng yonli uchburchakning asosidagi burchagi 72°. Uchidagi burchagini toping.", "Tomonlari 5 sm, 5 sm va 7 sm bo'lgan uchburchakni sirkul va chizg'ich yordamida yasang."] }
    ] },
    { nom: "13-bob. Parallelogramm, romb va trapetsiya", mavzular: [
      { id: "k5-21", nom: "Parallelogramm, romb va trapetsiyaning xossalari. Noma'lum burchaklar", test: ["s8m3", "t72"], pdf: [1, 134],
        qoida: ["<b>Parallelogramm</b>: qarama-qarshi tomonlari parallel va teng, qarama-qarshi burchaklari teng, qo'shni burchaklari yig'indisi 180°. <b>Romb</b> — barcha tomonlari teng parallelogramm; uning diagonallari perpendikulyar va burchaklarini teng ikkiga bo'ladi.", "<b>Trapetsiya</b> — faqat bir juft qarama-qarshi tomoni parallel bo'lgan to'rtburchak; teng yonli trapetsiyada asosdagi burchaklar teng; yon tomonga yopishgan burchaklar yig'indisi 180°. To'rtburchak burchaklarining yig'indisi 360°."],
        misol: [["Parallelogrammning bir burchagi 65°. Qolgan burchaklarini toping.", "Qarama-qarshi burchak 65°, qo'shni burchaklar 180° − 65° = 115° dan."], ["Trapetsiyaning bir asosidagi burchaklari 70° va 55°. Ikkinchi asosidagi burchaklarini toping.", "180° − 70° = 110° va 180° − 55° = 125°."]],
        mashq: ["Rombning bir burchagi 120°. Diagonallarning romb tomonlari bilan hosil qilgan burchaklarini toping.", "Teng yonli trapetsiyaning asosidagi bir burchagi 68°. Qolgan uchta burchagini toping.", "To'rtburchakning burchaklari 90°, 85°, 110° va x. x ni toping."] }
    ] }
  ]
};
