/*!
 * Kuvonch Academy — "Noldan π gacha": mavzular bo'yicha darslar
 * Har bir mavzu: nima haqida, asosiy tushunchalar, qoidalar/formulalar,
 * yechib ko'rsatilgan misol, ko'p uchraydigan xatolar, tarix va hissa qo'shgan olimlar.
 * Kalit — mavzu nomi (noldan-pi.js dagi KURS ro'yxati bilan bir xil).
 *
 * Maydonlar:
 *   n  — mavzu nima haqida (matn)
 *   tu — tushunchalar: [[atama, ta'rif], ...]
 *   q  — qoidalar va formulalar: ["...", ...]
 *   m  — misollar: [{ s: shart, y: [qadamlar], j: javob }, ...]
 *   x  — ko'p uchraydigan xatolar: ["...", ...]
 *   h  — tarix (matn)
 *   o  — olimlar: [[ism, yillar, hissasi], ...]
 */
(function () {
  "use strict";
  var L = {};

  /* ======================= BOSHLANG'ICH MATEMATIKA ======================= */
  L["Sanash"] = {
    n: "Sanash — matematikaning eng birinchi qadami. Narsalar sonini aniqlash, sonlarni tartib bilan aytish, bir sondan oldin va keyin keladigan sonni topish, teng guruhlarni sanash (masalan, savatlardagi olmalar) shu mavzuga kiradi.",
    tu: [
      ["Natural son", "Sanashda ishlatiladigan sonlar: 1, 2, 3, 4, … Eng kichik natural son — 1."],
      ["Oldingi son", "Berilgan sondan 1 ta kam son. 31 dan oldin 30 keladi."],
      ["Keyingi son", "Berilgan sondan 1 ta ko'p son. 31 dan keyin 32 keladi."],
      ["Ketma-ketlik", "Ma'lum qoida bo'yicha tartiblangan sonlar: 3, 5, 7, 9, … (har safar 2 qo'shiladi)."],
      ["Teng guruhlar", "Har birida bir xil miqdor bo'lgan guruhlar. Ularni qo'shish o'rniga ko'paytirib sanash mumkin."]
    ],
    q: [
      "Oldingi son = n − 1,   keyingi son = n + 1",
      "Har birida m tadan bo'lgan c ta guruh: jami = c × m",
      "Ketma-ketlik a, a+d, a+2d, … ning n-hadi = a + (n − 1)·d"
    ],
    m: [
      { s: "9 ta savatning har birida 4 tadan olma bor. Hammasi bo'lib nechta olma?", y: ["Har bir savatda bir xil — 4 tadan.", "Demak 4 ni 9 marta qo'shamiz yoki 9 × 4 ni hisoblaymiz.", "9 × 4 = 36"], j: "36 ta olma" },
      { s: "3, 7, 11, … ketma-ketlikning 5-hadi nechaga teng?", y: ["Har bir keyingi had oldingisidan 4 ga katta (d = 4).", "5-had = 3 + (5 − 1)·4 = 3 + 16"], j: "19" }
    ],
    x: ["Ketma-ketlikda n-hadni topishda (n − 1) o'rniga n ga ko'paytirib yuborish.", "Oldingi sonni so'rashganda keyingi sonni aytish."],
    h: "Odamlar yozuv paydo bo'lishidan ancha oldin sanay boshlagan. Kongodan topilgan Ishango suyagidagi kesiklar taxminan 20 000 yil avval qilingan va sanoqning eng qadimgi izlaridan biri hisoblanadi. Bobilliklar 60 lik, misrliklar o'nlik sanoq tizimidan foydalangan. Bugungi 0–9 raqamlari Hindistonda paydo bo'lib, Muhammad al-Xorazmiy asarlari orqali Yaqin Sharq va Yevropaga tarqalgan.",
    o: [
      ["Muhammad al-Xorazmiy", "~780–850", "Hind raqamlari va o'nli pozitsion sanoq haqidagi asari orqali bu tizimni dunyoga tanitdi."],
      ["Braxmagupta", "598–668", "Nolni alohida son sifatida qarab, u bilan amallar qoidalarini yozdi."],
      ["Leonardo Fibonachchi", "~1170–1250", "\"Liber Abaci\" (1202) kitobi bilan hind-arab raqamlarini Yevropaga olib kirdi."]
    ]
  };

  L["Qo'shish va ayirish bilan tanishuv"] = {
    n: "Qo'shish — miqdorlarni birlashtirish, ayirish — bir miqdordan qismini olib tashlash. Bu mavzuda ikki va uch sonli ifodalarni hisoblash, manfiy son qo'shilganda nima bo'lishi va ustun usulida hisoblash o'rganiladi.",
    tu: [
      ["Qo'shiluvchilar va yig'indi", "a + b = c tenglikda a va b — qo'shiluvchilar, c — yig'indi."],
      ["Kamayuvchi, ayriluvchi, ayirma", "a − b = c tenglikda a — kamayuvchi, b — ayriluvchi, c — ayirma."],
      ["Ustun usuli", "Sonlarni xonalari bir-birining tagiga to'g'ri keladigan qilib yozib, birliklardan boshlab hisoblash."],
      ["O'tkazish (zayom)", "Xona yig'indisi 10 dan oshsa, 1 o'nlik keyingi xonaga o'tadi; ayirishda yetmasa, keyingi xonadan 1 o'nlik olinadi."]
    ],
    q: [
      "a + b = b + a   (o'rin almashtirish)",
      "(a + b) + c = a + (b + c)   (guruhlash)",
      "a − b − c = a − (b + c)",
      "a + (−b) = a − b",
      "Tekshirish: ayirma + ayriluvchi = kamayuvchi"
    ],
    m: [
      { s: "616 − 94 − 52 ni hisoblang.", y: ["Ikki ayriluvchini avval qo'shamiz: 94 + 52 = 146.", "616 − 146 = 470."], j: "470" },
      { s: "25 + (−60) ni hisoblang.", y: ["Manfiy son qo'shish — ayirish demak: 25 − 60.", "Kichikdan katta ayrilyapti, javob manfiy: −(60 − 25) = −35."], j: "−35" }
    ],
    x: ["Ustun usulida o'tkazilgan 1 ni unutish.", "a − b − c ni a − (b − c) deb hisoblash."],
    h: "Qo'shish va ayirish qadimgi Misr va Bobilda savdo, soliq va qurilish hisoblarida qo'llangan. Hisob-kitobni tezlashtirish uchun abak (cho'tga) ixtiro qilingan. \"+\" va \"−\" belgilari ancha kech — 1489-yilda nemis matematigi Yoxann Vidman kitobida bosma shaklda paydo bo'ldi.",
    o: [
      ["Yoxann Vidman", "~1462–1498", "\"+\" va \"−\" belgilarini birinchilardan bo'lib bosma kitobda ishlatdi (1489)."],
      ["Robert Rekord", "~1512–1558", "Tenglik belgisi \"=\" ni kiritdi (1557)."]
    ]
  };

  L["Sonlar xonasi (o'nliklar va yuzliklar)"] = {
    n: "Har bir raqamning qiymati u turgan xonaga bog'liq: 7731 sonidagi birinchi 7 — 7 ming, ikkinchisi — 7 yuz. Bu mavzuda xonalar, xona birliklari, sonlarni yaxlitlash, juft va toq sonlar o'rganiladi.",
    tu: [
      ["Xona", "Raqamning sondagi o'rni: birlar, o'nlar, yuzlar, minglar, …"],
      ["Xona birligi", "1, 10, 100, 1000, … Har bir keyingi xona birligi oldingisidan 10 marta katta."],
      ["Yaxlitlash", "Sonni unga yaqin \"yumaloq\" songa almashtirish: 1984 ≈ 2000 (minglargacha)."],
      ["Juft son", "2 ga qoldiqsiz bo'linadigan son: oxirgi raqami 0, 2, 4, 6, 8."],
      ["Toq son", "2 ga bo'linmaydigan son: oxirgi raqami 1, 3, 5, 7, 9."]
    ],
    q: [
      "abcd = a·1000 + b·100 + c·10 + d   (xona birliklari yig'indisi)",
      "Yaxlitlash: keyingi raqam 0–4 bo'lsa — pastga, 5–9 bo'lsa — yuqoriga",
      "a dan b gacha butun sonlar soni = b − a + 1",
      "Ketma-ket sonlarning yarmi juft, yarmi toq (oraliq juft sonli bo'lsa)"
    ],
    m: [
      { s: "1984 sonini minglar xonasigacha yaxlitlang.", y: ["Minglar xonasi — 1. Undan keyingi (yuzlar) raqami — 9.", "9 ≥ 5, demak yuqoriga yaxlitlaymiz: 1 → 2, qolganlari 0."], j: "2000" },
      { s: "10 dan 49 gacha (ikkalasi ham kiradi) nechta toq son bor?", y: ["Jami sonlar: 49 − 10 + 1 = 40 ta.", "10 juft bilan boshlanib, 49 toq bilan tugaydi — juft va toq sonlar teng: 40 : 2."], j: "20 ta" }
    ],
    x: ["Yaxlitlashda kerakli xonadan emas, oxirgi raqamdan qaror qilish.", "Oraliqdagi sonlarni sanashda +1 ni unutish."],
    h: "O'nli pozitsion sanoq tizimi Hindistonda shakllangan: unda bitta raqam turgan joyiga qarab birlik, o'nlik yoki yuzlikni bildiradi, bo'sh xona esa nol bilan belgilanadi. Bu g'oyani al-Xorazmiy IX asrda kitob holiga keltirdi. Bobilliklar ham pozitsion tizim yaratgan, lekin 60 lik edi — uning izi bugun ham soatdagi 60 minut va burchakdagi 60 sekundda saqlanib qolgan.",
    o: [
      ["Aryabxata", "476–550", "Hind astronomi; pozitsion sanoq asosida katta sonlar bilan hisob-kitob qilgan."],
      ["Muhammad al-Xorazmiy", "~780–850", "\"Hind hisobi haqida kitob\" orqali o'nli pozitsion tizimni tarqatdi."],
      ["G'iyosiddin Jamshid al-Koshiy", "~1380–1429", "Samarqandda o'nli kasrlarni tizimli qo'llab, juda aniq hisob-kitoblar qildi."]
    ]
  };

  L["20 gacha bo'lgan sonlarni qo'shish va ayirish"] = {
    n: "20 gacha sonlarni tez qo'shish va ayirish — keyingi barcha hisoblarning poydevori. Bu yerda \"10 ga to'ldirish\" usuli, qo'shish va ayirishning bog'liqligi hamda shu ko'nikmalarni katta sonlarda (ustun usulida) qo'llash o'rganiladi.",
    tu: [
      ["10 ga to'ldirish", "8 + 5 = 8 + 2 + 3 = 10 + 3 = 13 — avval 10 gacha yetkazib, qolganini qo'shish."],
      ["Teskari amal", "Ayirish qo'shishga teskari: 13 − 5 = 8, chunki 8 + 5 = 13."],
      ["Son tarkibi", "Sonni ikki qismga ajratish: 7 = 5 + 2 = 4 + 3 = 6 + 1."]
    ],
    q: [
      "a + b = c  ⇔  c − b = a  ⇔  c − a = b",
      "9 + n = 10 + (n − 1)   (9 ga qo'shish yo'li)",
      "Katta sonlarda: har bir xonada 20 gacha qo'shish + o'tkazish"
    ],
    m: [
      { s: "946 + 212 ni hisoblang.", y: ["Birlar: 6 + 2 = 8.", "O'nlar: 4 + 1 = 5.", "Yuzlar: 9 + 2 = 11 → 1 yozamiz, 1 ming o'tadi."], j: "1158" },
      { s: "401 − 27 − 43 ni hisoblang.", y: ["27 + 43 = 70.", "401 − 70 = 331."], j: "331" }
    ],
    x: ["8 + 7 kabi 10 dan o'tadigan yig'indilarda 1 ni xato o'tkazish.", "Ayirishda kamayuvchi va ayriluvchining o'rnini almashtirib yuborish."],
    h: "Bolalarni sanashga o'rgatishda barmoqlar, toshchalar va cho'tlardan qadimdan foydalanilgan. Rus cho'ti (schyoti), Xitoy suanpani va Yaponiya sorobani 10 lik guruhlash g'oyasiga asoslangan — \"10 ga to'ldirish\" usuli aynan shu asboblardan kelib chiqqan.",
    o: [
      ["Ahmes (Misr kotibi)", "mil. av. ~1650", "Rind papirusini ko'chirgan; unda qo'shish-ayirishga oid amaliy masalalar bor."],
      ["Leonardo Fibonachchi", "~1170–1250", "Yevropada raqamlar bilan qog'ozda hisoblash usullarini ommalashtirdi."]
    ]
  };

  L["100 ichida qo'shish va ayirish"] = {
    n: "Ikki va uch xonali sonlarni qo'shish-ayirish: o'nliklar va birliklarni alohida qo'shish, o'tkazish bilan hisoblash, qavslarni ochish va ifodani qulay tartibda hisoblash.",
    tu: [
      ["Razryadlab qo'shish", "47 + 35 = (40 + 30) + (7 + 5) = 70 + 12 = 82."],
      ["Qulay juftlar", "Yig'indisi yumaloq son beradigan qo'shiluvchilar: 27 + 73 = 100."],
      ["Og'zaki hisob", "Sonni qulay qismlarga bo'lib, yozmasdan hisoblash."]
    ],
    q: [
      "a − b − c = a − (b + c)",
      "a − b + c = a + c − b",
      "Yumaloqlash: 98 + 47 = 100 + 47 − 2 = 145"
    ],
    m: [
      { s: "422 − 27 − 73 ni hisoblang.", y: ["27 + 73 = 100 — qulay juft!", "422 − 100 = 322."], j: "322" },
      { s: "914 + 976 ni hisoblang.", y: ["976 ≈ 1000 − 24.", "914 + 1000 = 1914; 1914 − 24 = 1890."], j: "1890" }
    ],
    x: ["Bir nechta ayirishni qavs bilan noto'g'ri birlashtirish: a − b − c ≠ a − (b − c)."],
    h: "Og'zaki hisobning qulay usullari asrlar davomida savdogarlar orasida rivojlangan. O'rta asrlarda Yevropada \"abakistlar\" (cho'tda hisoblovchilar) va \"algoristlar\" (al-Xorazmiy usulida qog'ozda hisoblovchilar) o'rtasida raqobat bo'lgan — oxir-oqibat qog'ozda yozib hisoblash g'olib chiqdi. \"Algoritm\" so'zi ham al-Xorazmiy nomidan kelib chiqqan.",
    o: [
      ["Muhammad al-Xorazmiy", "~780–850", "Ustun usulida qo'shish-ayirish qoidalarini kitobda bayon qildi; \"algoritm\" so'zi uning nomidan."],
      ["Karl Fridrix Gauss", "1777–1855", "Bolaligida 1 dan 100 gacha sonlar yig'indisini qulay juftlar usulida bir zumda topgani mashhur."]
    ]
  };

  L["1 000 ichida sonlarni qo'shish va ayirish"] = {
    n: "Ko'p xonali sonlarni ustun usulida qo'shish va ayirish, natijani tekshirish va taxminan baholash. Bu ko'nikma pul hisoblash, o'lchov va boshqa amaliy masalalarda kerak bo'ladi.",
    tu: [
      ["Ustun usuli", "Sonlarni xonalar bo'yicha bir-birining tagiga yozish va o'ngdan chapga hisoblash."],
      ["Taxminiy baholash", "Natijani oldindan yaxlitlab tekshirish: 7980 + 1681 ≈ 8000 + 1700 = 9700."],
      ["Tekshirish", "Qo'shishni ayirish bilan, ayirishni qo'shish bilan tekshirish."]
    ],
    q: [
      "Har bir xonada: yig'indi ≥ 10 → 1 keyingi xonaga o'tadi",
      "Ayirishda xona raqami yetmasa → yuqori xonadan 1 olinadi (+10)",
      "Tekshiruv: (a − b) + b = a"
    ],
    m: [
      { s: "7980 + 1681 ni hisoblang.", y: ["Birlar: 0 + 1 = 1.", "O'nlar: 8 + 8 = 16 → 6, 1 o'tadi.", "Yuzlar: 9 + 6 + 1 = 16 → 6, 1 o'tadi.", "Minglar: 7 + 1 + 1 = 9."], j: "9661" },
      { s: "696 − 86 − 57 ni hisoblang.", y: ["86 + 57 = 143.", "696 − 143 = 553."], j: "553" }
    ],
    x: ["Xonalarni noto'g'ri tekislab yozish (masalan, 345 + 37 da 7 ni o'nlar tagiga yozish).", "Ketma-ket bir nechta o'tkazishni unutish."],
    h: "Ustun usulida hisoblash Hindistonda nolli pozitsion yozuv paydo bo'lganidan keyin mumkin bo'ldi. Arab dunyosida al-Uqlidisiy (X asr) qog'ozda siyoh bilan hisoblash usullarini yozgan. Yevropada bu usul XV–XVI asrlarda bosma darsliklar orqali hamma joyga tarqaldi.",
    o: [
      ["Abul Hasan al-Uqlidisiy", "X asr", "Hind raqamlarida qog'ozda hisoblash usullarini tushuntirgan; o'nli kasrlardan ham foydalangan."],
      ["Muhammad al-Xorazmiy", "~780–850", "Pozitsion tizimda arifmetik amallarni bajarish qoidalarini tizimlashtirdi."]
    ]
  };

  L["O'lchovlar va ma'lumotlar"] = {
    n: "O'lchash — miqdorni tanlangan birlik bilan solishtirish. Bu mavzuda uzunlik, massa, vaqt, hajm birliklarini bir-biriga aylantirish va ma'lumotlarni tavsiflovchi o'rta qiymatlar (o'rta arifmetik, o'rta geometrik) o'rganiladi.",
    tu: [
      ["O'lchov birligi", "Solishtirish uchun olingan miqdor: metr, kilogramm, soniya, litr."],
      ["O'rta arifmetik", "Sonlar yig'indisining ularning soniga nisbati."],
      ["O'rta geometrik", "Ikki musbat son ko'paytmasidan olingan kvadrat ildiz: √(a·b)."]
    ],
    q: [
      "1 m = 100 sm = 1000 mm;   1 km = 1000 m",
      "1 kg = 1000 g;   1 t = 1000 kg",
      "1 soat = 60 min = 3600 s",
      "1 l = 1000 ml = 1 dm³",
      "O'rta arifmetik = (a₁ + a₂ + … + aₙ) / n",
      "O'rta geometrik = √(a · b)"
    ],
    m: [
      { s: "3 soat necha minutga teng?", y: ["1 soat = 60 minut.", "3 × 60 = 180."], j: "180 minut" },
      { s: "16 va 4 sonlarining o'rta geometrigini toping.", y: ["16 · 4 = 64.", "√64 = 8."], j: "8" }
    ],
    x: ["Kattaroq birlikdan kichigiga o'tishda bo'lish (aslida ko'paytirish kerak).", "O'rta geometrikda ildiz olishni unutish."],
    h: "Qadimda o'lchov birliklari tana a'zolariga bog'liq bo'lgan: tirsak, qadam, qarich. Shu sabab har yurtda har xil edi. 1790-yillarda Fransiyada metrik tizim yaratildi: metr Yer meridiani choragining o'n milliondan biri deb olindi. 1960-yilda Xalqaro birliklar tizimi (SI) qabul qilindi. O'rta qiymatlar esa qadimgi yunonlarda, xususan Pifagor maktabida o'rganilgan.",
    o: [
      ["Pifagorchilar", "mil. av. VI–V asr", "O'rta arifmetik, o'rta geometrik va o'rta garmonik qiymatlarni o'rgangan."],
      ["Abu Rayhon Beruniy", "973–1048", "Yer radiusini o'lchash usulini yaratdi; turli moddalar zichligini aniq o'lchadi."],
      ["Jozef Lui Lagranj", "1736–1813", "Metrik tizimni ishlab chiqqan Fransiya komissiyasi a'zosi bo'lgan."]
    ]
  };

  L["Geometriya"] = {
    n: "Boshlang'ich geometriya — shakllarni tanish va o'lchash: to'g'ri to'rtburchak, kvadrat, uchburchakning perimetri va yuzi, kubning hajmi.",
    tu: [
      ["Perimetr", "Shakl barcha tomonlari uzunliklarining yig'indisi (atrofini aylanib chiqish yo'li)."],
      ["Yuza", "Shakl egallagan tekislik qismi; kvadrat birliklarda o'lchanadi (sm²)."],
      ["Hajm", "Jism egallagan fazo qismi; kub birliklarda o'lchanadi (sm³)."],
      ["Balandlik", "Uchburchak uchidan qarama-qarshi tomonga (asosga) tushirilgan perpendikulyar."]
    ],
    q: [
      "To'g'ri to'rtburchak: P = 2(a + b),  S = a · b",
      "Kvadrat: P = 4a,  S = a²",
      "Uchburchak: S = ½ · a · h",
      "Kub: V = a³;   to'g'ri burchakli parallelepiped: V = a · b · c"
    ],
    m: [
      { s: "Uchburchak asosi 16 sm, balandligi 14 sm. Yuzini toping.", y: ["S = ½ · a · h", "S = ½ · 16 · 14 = 8 · 14 = 112."], j: "112 sm²" },
      { s: "To'g'ri to'rtburchak tomonlari 8 va 11 sm. Perimetri va yuzini toping.", y: ["P = 2(8 + 11) = 38 sm.", "S = 8 · 11 = 88 sm²."], j: "P = 38 sm, S = 88 sm²" }
    ],
    x: ["Uchburchak yuzida ½ ni unutish.", "Perimetr va yuzani aralashtirish; birliklarni (sm va sm²) noto'g'ri yozish."],
    h: "\"Geometriya\" yunoncha \"yer o'lchash\" degani. Qadimgi Misrda Nil daryosi har yili toshib, dalalar chegarasini yuvib ketardi — yer o'lchovchilar maydonlarni qayta o'lchashi kerak edi. Misr va Bobil yuzalarni hisoblash qoidalarini bilgan, yunonlar esa ularni isbotlashni boshlagan. Evklidning \"Negizlar\" asari 2000 yildan ortiq geometriya darsligi bo'lib xizmat qildi.",
    o: [
      ["Evklid", "mil. av. ~300", "\"Negizlar\" (13 kitob) — geometriyani aksiomalar va isbotlar asosida qurdi."],
      ["Arximed", "mil. av. 287–212", "Doira yuzi, shar hajmi va sirtini hisobladi."],
      ["Abu Rayhon Beruniy", "973–1048", "Geometriyani astronomiya va geodeziyada qo'llagan."]
    ]
  };

  /* ======================= ARIFMETIKA ======================= */
  L["Qo'shish va ayirish"] = {
    n: "Arifmetikada qo'shish va ayirish katta sonlar, bir nechta qo'shiluvchi va qavsli ifodalar bilan bajariladi. Amallarning xossalari hisobni tezlashtiradi va xatolarni kamaytiradi.",
    tu: [
      ["O'rin almashtirish xossasi", "Qo'shiluvchilarning o'rni almashganda yig'indi o'zgarmaydi."],
      ["Guruhlash xossasi", "Bir nechta sonni qo'shishda ularni istalgan tartibda guruhlash mumkin."],
      ["Nol xossasi", "a + 0 = a,  a − 0 = a,  a − a = 0."]
    ],
    q: [
      "a + b = b + a",
      "(a + b) + c = a + (b + c)",
      "a − (b + c) = a − b − c;   a − (b − c) = a − b + c",
      "Ko'p sonlarni qo'shishda yumaloq son beradigan juftlarni birlashtiring"
    ],
    m: [
      { s: "74 + 55 + 77 ni hisoblang.", y: ["74 + 55 = 129.", "129 + 77 = 206."], j: "206" },
      { s: "6354 + 5758 ni hisoblang.", y: ["Birlar: 4 + 8 = 12 → 2, 1 o'tadi.", "O'nlar: 5 + 5 + 1 = 11 → 1, 1 o'tadi.", "Yuzlar: 3 + 7 + 1 = 11 → 1, 1 o'tadi.", "Minglar: 6 + 5 + 1 = 12."], j: "12112" }
    ],
    x: ["Qavs oldida minus bo'lsa, qavs ichidagi ishoralarni almashtirmay ochish."],
    h: "Arifmetika (yunoncha \"arithmos\" — son) eng qadimgi fanlardan biri. Al-Xorazmiyning hisob haqidagi kitobi lotin tiliga \"Algoritmi de numero Indorum\" deb tarjima qilingan va Yevropada asrlar davomida darslik bo'lgan.",
    o: [
      ["Muhammad al-Xorazmiy", "~780–850", "Arifmetik amallarni o'nli pozitsion tizimda bajarish qoidalarini yozdi."],
      ["Yoxann Vidman", "~1462–1498", "\"+\" va \"−\" belgilarini kiritgan."]
    ]
  };

  L["Ko'paytirish va bo'lish"] = {
    n: "Ko'paytirish — bir xil qo'shiluvchilarni qo'shishning qisqa yo'li, bo'lish esa unga teskari amal. Mavzuda ko'paytirish jadvali, ko'p xonali sonni bir xonaliga ko'paytirish va bo'lish, qoldiqli bo'lish o'rganiladi.",
    tu: [
      ["Ko'paytuvchilar va ko'paytma", "a · b = c: a, b — ko'paytuvchilar, c — ko'paytma."],
      ["Bo'linuvchi, bo'luvchi, bo'linma", "a : b = c: a — bo'linuvchi, b — bo'luvchi, c — bo'linma."],
      ["Qoldiqli bo'lish", "a = b · q + r, bunda 0 ≤ r < b (r — qoldiq)."]
    ],
    q: [
      "a · b = b · a;   (a · b) · c = a · (b · c)",
      "a · (b + c) = a·b + a·c   (taqsimot qonuni)",
      "a : b = c  ⇔  b · c = a",
      "Nolga bo'lish mumkin emas!"
    ],
    m: [
      { s: "537 × 5 ni hisoblang.", y: ["537 = 500 + 30 + 7.", "500·5 = 2500, 30·5 = 150, 7·5 = 35.", "2500 + 150 + 35 = 2685."], j: "2685" },
      { s: "108 : 3 ni hisoblang.", y: ["108 = 90 + 18.", "90 : 3 = 30, 18 : 3 = 6.", "30 + 6 = 36. Tekshiruv: 36 · 3 = 108."], j: "36" }
    ],
    x: ["Taqsimot qonunida ikkinchi qo'shiluvchini ko'paytirishni unutish.", "Bo'linmada o'rtadagi nolni tushirib qoldirish (624 : 6 = 104, 14 emas)."],
    h: "Misrliklar ko'paytirishni sonni ketma-ket ikkilantirish orqali bajarishgan — Rind papirusida shunday misollar bor. Ko'paytirish jadvali Pifagor nomi bilan bog'lanadi. \"×\" belgisini 1631-yilda ingliz matematigi Uilyam Otred, \"·\" va \":\" belgilarini esa Gotfrid Leybnits kiritgan.",
    o: [
      ["Uilyam Otred", "1574–1660", "Ko'paytirish belgisi \"×\" ni kiritdi (1631)."],
      ["Gotfrid Leybnits", "1646–1716", "Ko'paytirish uchun nuqta \"·\" va bo'lish uchun \":\" belgisini ishlatdi."],
      ["Yoxann Ran", "1622–1676", "Bo'lish belgisi \"÷\" ni kiritdi (1659)."]
    ]
  };

  L["Manfiy sonlar"] = {
    n: "Manfiy sonlar noldan kichik sonlar: −1, −2, −3, … Ular qarz, past harorat, dengiz sathidan pastlik kabi miqdorlarni ifodalaydi. Mavzuda manfiy sonlar bilan qo'shish, ayirish va ko'paytirish qoidalari o'rganiladi.",
    tu: [
      ["Butun sonlar", "…, −3, −2, −1, 0, 1, 2, 3, … — natural sonlar, ularga qarama-qarshi sonlar va nol."],
      ["Qarama-qarshi sonlar", "Yig'indisi 0 ga teng sonlar: 5 va −5."],
      ["Modul", "Sonning noldan masofasi: |−7| = 7, |7| = 7."]
    ],
    q: [
      "a − b < 0, agar b > a:   44 − 73 = −(73 − 44) = −29",
      "(−a) + (−b) = −(a + b)",
      "a − (−b) = a + b",
      "(+)·(+) = +,   (−)·(−) = +,   (+)·(−) = −"
    ],
    m: [
      { s: "44 − 73 ni hisoblang.", y: ["Kichikdan katta ayrilyapti — natija manfiy.", "Kattasidan kichigini ayiramiz: 73 − 44 = 29.", "Oldiga minus qo'yamiz."], j: "−29" },
      { s: "(−13) · 4 ni hisoblang.", y: ["13 · 4 = 52.", "Ishoralar har xil → natija manfiy."], j: "−52" }
    ],
    x: ["Ikki manfiy sonning ko'paytmasini manfiy deb yozish.", "a − (−b) da ishorani o'zgartirmaslik."],
    h: "Manfiy sonlarni birinchi bo'lib xitoyliklar qo'llagan: \"Matematika san'atining to'qqiz bobi\" (mil. av. II–I asrlar) kitobida musbat sonlar qizil, manfiylari qora cho'plar bilan belgilangan. VII asrda hind matematigi Braxmagupta manfiy sonlar bilan amallar qoidalarini aniq yozdi va ularni \"qarz\", musbatlarni \"mulk\" deb atadi. Yevropada manfiy sonlar faqat XVII–XVIII asrlarda to'liq tan olindi.",
    o: [
      ["Braxmagupta", "598–668", "Manfiy sonlar va nol bilan amallar qoidalarini birinchi bo'lib tizimli yozdi."],
      ["Liu Xuy", "III asr", "\"To'qqiz bob\"ga sharh yozib, musbat va manfiy sonlar qoidalarini tushuntirdi."],
      ["Rene Dekart", "1596–1650", "Koordinatalar tizimida manfiy sonlarga geometrik ma'no berdi."]
    ]
  };

  L["Kasrlar"] = {
    n: "Kasr — butunning bir qismi: 3/4 — butunni 4 ta teng bo'lakka bo'lib, 3 tasini olish. Mavzuda kasrlarni qisqartirish, umumiy maxrajga keltirish, qo'shish, ayirish, ko'paytirish va bo'lish o'rganiladi.",
    tu: [
      ["Surat va maxraj", "a/b kasrda a — surat (nechta bo'lak olingan), b — maxraj (butun nechta bo'lakka bo'lingan)."],
      ["Qisqartirish", "Surat va maxrajni bir xil songa bo'lish: 6/8 = 3/4."],
      ["Umumiy maxraj", "Ikkala maxrajga bo'linadigan son; eng qulayi — EKUK."],
      ["Teskari kasr", "a/b ga teskari kasr — b/a. Ularning ko'paytmasi 1."]
    ],
    q: [
      "a/b + c/d = (a·d + c·b) / (b·d)",
      "a/b − c/d = (a·d − c·b) / (b·d)",
      "a/b · c/d = (a·c) / (b·d)",
      "a/b : c/d = a/b · d/c = (a·d) / (b·c)",
      "Javobni har doim qisqartirilgan holda yozing"
    ],
    m: [
      { s: "(5/6) : (2/9) ni hisoblang.", y: ["Bo'lishni teskari kasrga ko'paytirish bilan almashtiramiz: 5/6 · 9/2.", "= 45/12.", "3 ga qisqartiramiz: 15/4."], j: "15/4 = 3¾" },
      { s: "4/5 − 7/8 ni hisoblang.", y: ["Umumiy maxraj 40: 4/5 = 32/40, 7/8 = 35/40.", "32/40 − 35/40 = −3/40."], j: "−3/40" }
    ],
    x: ["Qo'shishda suratni suratga, maxrajni maxrajga qo'shish (1/2 + 1/3 ≠ 2/5).", "Bo'lishda ikkinchi kasrni emas, birinchisini aylantirish."],
    h: "Misrliklar asosan suratlari 1 ga teng bo'lgan kasrlardan (1/2, 1/3, 1/7 …) foydalangan — Rind papirusida 2/n kasrlarni shunday yoyish jadvali bor. Bobilliklar 60 lik kasrlarni qo'llagan. Kasr chizig'i arab matematiklari (XII asr, al-Hassor) asarlarida paydo bo'lib, Fibonachchi orqali Yevropaga o'tgan.",
    o: [
      ["Ahmes", "mil. av. ~1650", "Rind papirusida misrcha kasrlar jadvali va masalalarini qoldirgan."],
      ["Al-Hassor", "XII asr", "Kasrni surat va maxraj orasida gorizontal chiziq bilan yozish usulini qo'llagan."],
      ["Leonardo Fibonachchi", "~1170–1250", "Kasr chizig'ini Yevropada ommalashtirdi."]
    ]
  };

  L["O'nli kasrlar"] = {
    n: "O'nli kasr — maxraji 10, 100, 1000, … bo'lgan kasrning vergul bilan yozilishi: 2,7 = 27/10. Ular bilan amallar xuddi butun sonlardagidek bajariladi, faqat vergul o'rnini to'g'ri qo'yish kerak.",
    tu: [
      ["Butun qism va kasr qism", "8,9 da 8 — butun qism, 9 — o'ndan birlar."],
      ["Xonalar", "Verguldan keyin: o'ndan birlar, yuzdan birlar, mingdan birlar."],
      ["Vergul va nuqta", "O'zbekistonda vergul (2,7), ko'p mamlakatlarda nuqta (2.7) ishlatiladi."]
    ],
    q: [
      "Qo'shish/ayirish: vergulni vergul tagiga yozing",
      "Ko'paytirish: vergulsiz ko'paytiring, so'ng ikkala sondagi kasr xonalari yig'indisicha xonani ajrating",
      "Bo'lish: bo'linuvchini butun songa bo'lishda vergul bo'linmada ham o'sha joyda qo'yiladi",
      "× 10 → vergul 1 xona o'ngga;   : 10 → 1 xona chapga"
    ],
    m: [
      { s: "2,7 · 2,4 ni hisoblang.", y: ["27 · 24 = 648.", "Kasr xonalari: 1 + 1 = 2.", "6,48."], j: "6,48" },
      { s: "27,6 : 6 ni hisoblang.", y: ["276 : 6 = 46.", "Bo'linuvchida 1 ta kasr xona bor → 4,6."], j: "4,6" }
    ],
    x: ["Ko'paytirishda verguldan keyingi xonalarni noto'g'ri sanash.", "8,9 + 2,1 = 10,10 deb yozish (to'g'risi 11,0)."],
    h: "O'nli kasrlarni birinchilardan bo'lib al-Uqlidisiy (X asr) qo'llagan. Samarqandlik olim G'iyosiddin Jamshid al-Koshiy 1427-yilgi \"Hisob kaliti\" asarida o'nli kasrlarni tizimli bayon qildi va π sonini 16 ta xona aniqligida hisobladi. Yevropada Simon Stevin 1585-yilda \"O'ndan bir\" risolasini yozdi, verguli/nuqtali yozuvni esa Jon Neper ommalashtirdi.",
    o: [
      ["G'iyosiddin Jamshid al-Koshiy", "~1380–1429", "Ulug'bek rasadxonasi olimi; o'nli kasrlar nazariyasini yaratdi, π ni 16 xonagacha hisobladi."],
      ["Simon Stevin", "1548–1620", "\"De Thiende\" (1585) — o'nli kasrlarni Yevropada targ'ib qildi."],
      ["Jon Neper", "1550–1617", "O'nli kasrlarda ajratuvchi nuqta/vergulni keng qo'lladi."]
    ]
  };

  /* ======================= BOSHLANG'ICH ALGEBRA ======================= */
  L["Arifmetik xossalar"] = {
    n: "Arifmetik xossalar — qo'shish va ko'paytirishning har doim to'g'ri bo'ladigan qonunlari. Ular yordamida ifodalarni qulay tartibda hisoblash va keyinchalik algebraik ifodalarni soddalashtirish mumkin.",
    tu: [
      ["Kommutativlik", "O'rin almashtirish: a + b = b + a,  a·b = b·a."],
      ["Assotsiativlik", "Guruhlash: (a + b) + c = a + (b + c)."],
      ["Distributivlik", "Taqsimot: a(b + c) = ab + ac."],
      ["Neytral elementlar", "a + 0 = a,  a · 1 = a,  a · 0 = 0."]
    ],
    q: [
      "a + b = b + a;   ab = ba",
      "(a + b) + c = a + (b + c);   (ab)c = a(bc)",
      "a(b + c) = ab + ac;   a(b − c) = ab − ac",
      "(−a)·b = −ab;   (−a)(−b) = ab"
    ],
    m: [
      { s: "25 · 37 · 4 ni qulay usulda hisoblang.", y: ["O'rnini almashtiramiz: (25 · 4) · 37.", "25 · 4 = 100.", "100 · 37 = 3700."], j: "3700" },
      { s: "(−13) · 9 ni hisoblang.", y: ["13 · 9 = 117.", "Ishoralar har xil — natija manfiy."], j: "−117" }
    ],
    x: ["Ayirish va bo'lishda ham o'rin almashtirish mumkin deb o'ylash (a − b ≠ b − a)."],
    h: "Bu xossalardan qadimdan foydalanilgan, lekin ularga nom berilishi XIX asrga to'g'ri keladi. \"Distributiv\" va \"kommutativ\" atamalarini 1814-yilda fransuz matematigi Fransua Servua, \"assotsiativ\"ni esa Uilyam Gamilton 1840-yillarda kiritgan. Bu xossalar keyinchalik abstrakt algebraning (guruh, halqa, maydon) asosiy aksiomalariga aylandi.",
    o: [
      ["Fransua Servua", "1767–1847", "\"Kommutativ\" va \"distributiv\" atamalarini kiritdi (1814)."],
      ["Uilyam Rouen Gamilton", "1805–1865", "\"Assotsiativ\" atamasini kiritdi; kvaternionlarda ko'paytirish kommutativ emasligini ko'rsatdi."],
      ["Jorj Pikok", "1791–1858", "Algebrani amallar xossalariga asoslangan fan sifatida qurishni taklif qildi."]
    ]
  };

  L["Bo'luvchilar va karralilar"] = {
    n: "Bir son ikkinchisiga qoldiqsiz bo'linsa, ikkinchisi birinchisining bo'luvchisi, birinchisi esa ikkinchisining karralisi bo'ladi. Mavzuda bo'linish belgilari, tub va murakkab sonlar, EKUB va EKUK o'rganiladi.",
    tu: [
      ["Bo'luvchi", "a ni qoldiqsiz bo'ladigan son. 12 ning bo'luvchilari: 1, 2, 3, 4, 6, 12."],
      ["Karrali", "a ga qoldiqsiz bo'linadigan son. 4 ning karralilari: 4, 8, 12, 16, …"],
      ["Tub son", "Faqat 1 ga va o'ziga bo'linadigan, 1 dan katta son: 2, 3, 5, 7, 11, …"],
      ["EKUB", "Eng katta umumiy bo'luvchi."],
      ["EKUK", "Eng kichik umumiy karrali."]
    ],
    q: [
      "2 ga: oxirgi raqam juft;  5 ga: oxirgi raqam 0 yoki 5;  10 ga: oxirgi raqam 0",
      "3 ga (9 ga): raqamlar yig'indisi 3 ga (9 ga) bo'linadi",
      "EKUB(a; b) · EKUK(a; b) = a · b",
      "Agar b | a bo'lsa: EKUB(a; b) = b,  EKUK(a; b) = a",
      "Evklid algoritmi: EKUB(a; b) = EKUB(b; a mod b)"
    ],
    m: [
      { s: "EKUB(40; 32) ni toping.", y: ["40 = 2³ · 5,  32 = 2⁵.", "Umumiy tub ko'paytuvchilar kichik darajada: 2³ = 8."], j: "8" },
      { s: "EKUK(32; 16) ni toping.", y: ["32 soni 16 ga bo'linadi.", "Demak EKUK kattaroq songa teng."], j: "32" }
    ],
    x: ["EKUB va EKUKni almashtirib yuborish.", "1 ni tub son deb hisoblash (1 tub ham, murakkab ham emas)."],
    h: "Tub sonlar va bo'linishni qadimgi yunonlar chuqur o'rgangan. Evklid \"Negizlar\"ning VII–IX kitoblarida EKUBni topish algoritmini va tub sonlar cheksiz ko'p ekanini isbotladi. Eratosfen tub sonlarni topishning \"g'alvir\" usulini o'ylab topdi. Tub sonlar bugun internet xavfsizligi (shifrlash)ning asosida yotadi.",
    o: [
      ["Evklid", "mil. av. ~300", "EKUB algoritmi va tub sonlarning cheksizligini isbotladi."],
      ["Eratosfen", "mil. av. ~276–194", "Tub sonlarni ajratish \"g'alvirini\" yaratdi; Yer aylanasini o'lchadi."],
      ["Per Ferma", "1601–1665", "Tub sonlar va bo'linish haqida mashhur teoremalar (Fermaning kichik teoremasi) qoldirdi."]
    ]
  };

  L["Ma'lumotni o'qish va uni talqin qilish"] = {
    n: "Statistika ma'lumotlarni yig'ish, tartiblash va ular haqida xulosa chiqarish bilan shug'ullanadi. Bu yerda o'rta arifmetik, o'rta geometrik, mediana va moda kabi ko'rsatkichlar hamda jadval va diagrammalarni o'qish o'rganiladi.",
    tu: [
      ["O'rta arifmetik", "Barcha qiymatlar yig'indisi / qiymatlar soni."],
      ["Mediana", "Tartiblangan qatorning o'rtasidagi qiymat (juft sonli bo'lsa, ikki o'rtadagisining o'rta arifmetigi)."],
      ["Moda", "Eng ko'p takrorlangan qiymat."],
      ["Qamrov (razmax)", "Eng katta va eng kichik qiymatlar ayirmasi."]
    ],
    q: [
      "x̄ = (x₁ + x₂ + … + xₙ) / n",
      "O'rta geometrik (ikki son uchun) = √(a · b)",
      "Qamrov = max − min",
      "Mediana uchun avval sonlarni o'sish tartibida yozing"
    ],
    m: [
      { s: "Sonlarning o'rta arifmetigini toping: 16; 2; 23; 21; 6; 46", y: ["Yig'indi: 16 + 2 + 23 + 21 + 6 + 46 = 114.", "Sonlar soni: 6.", "114 : 6 = 19."], j: "19" },
      { s: "16 va 9 sonlarining o'rta geometrigini toping.", y: ["16 · 9 = 144.", "√144 = 12."], j: "12" }
    ],
    x: ["Yig'indini sonlar soniga emas, boshqa songa bo'lish.", "Medianani tartiblamasdan topish."],
    h: "Davlatlar qadimdan aholi va hosilni ro'yxatga olgan. Zamonaviy statistika 1662-yilda ingliz Jon Graunt London aholisining tug'ilish va o'lim ma'lumotlarini tahlil qilishi bilan boshlangan. Keyinchalik Gauss va Laplas o'lchash xatolari nazariyasini, Florens Naytingeyl esa diagrammalarni tibbiyotda qo'lladi.",
    o: [
      ["Jon Graunt", "1620–1674", "Aholi ma'lumotlarini birinchi bo'lib statistik tahlil qildi (1662)."],
      ["Karl Fridrix Gauss", "1777–1855", "Normal taqsimot va eng kichik kvadratlar usulini rivojlantirdi."],
      ["Florens Naytingeyl", "1820–1910", "Statistik diagrammalar yordamida kasalxonalardagi o'limni kamaytirishga erishdi."]
    ]
  };

  L["O'lchovlar"] = {
    n: "O'lchov birliklarini bir-biriga aylantirish: uzunlik, massa, vaqt va hajm. Bunda katta birlikdan kichigiga o'tishda ko'paytiriladi, kichikdan kattasiga o'tishda bo'linadi.",
    tu: [
      ["Asosiy SI birliklari", "metr (uzunlik), kilogramm (massa), sekund (vaqt) va boshqalar."],
      ["Old qo'shimchalar", "kilo- = 1000,  santi- = 1/100,  milli- = 1/1000."],
      ["Kvadrat va kub birliklar", "1 m² = 10 000 sm²,  1 m³ = 1 000 000 sm³."]
    ],
    q: [
      "1 m = 100 sm;  1 km = 1000 m",
      "1 kg = 1000 g;  1 t = 1000 kg",
      "1 soat = 60 min;  1 min = 60 s;  1 sutka = 24 soat",
      "1 l = 1000 ml = 1 dm³",
      "Katta → kichik: ko'paytiring;  kichik → katta: bo'ling"
    ],
    m: [
      { s: "7 litr necha millilitrga teng?", y: ["1 l = 1000 ml.", "7 · 1000 = 7000."], j: "7000 ml" },
      { s: "9 soat necha minutga teng?", y: ["1 soat = 60 minut.", "9 · 60 = 540."], j: "540 minut" }
    ],
    x: ["Vaqtni o'nli tizim deb hisoblash (1,5 soat = 1 soat 50 min emas, 1 soat 30 min).", "Kvadrat birliklarda 100 o'rniga 10 ga ko'paytirish."],
    h: "Metrik tizim Fransiya inqilobi davrida (1790-yillar) yaratildi va 1875-yilgi \"Metr konvensiyasi\" bilan xalqaro bo'ldi. Hozir barcha asosiy birliklar tabiat doimiylari orqali aniqlanadi: masalan, 2019-yildan kilogramm Plank doimiysi orqali belgilanadi.",
    o: [
      ["Jan-Sharl de Borda va Lagranj", "XVIII asr", "Metrik tizimni ishlab chiqqan komissiyada ishlagan."],
      ["Abu Rayhon Beruniy", "973–1048", "Moddalarning solishtirma og'irligini katta aniqlikda o'lchagan."]
    ]
  };
  L["O'lchov birliklari bilan ishlash"] = { ref: "O'lchovlar" };

  L["Manfiy sonlar va koordinatalar tekisligi"] = {
    n: "Koordinatalar tekisligi — ikki perpendikulyar son o'qi (Ox va Oy) yordamida har bir nuqtaning o'rnini ikki son bilan aniqlash usuli. Mavzuda nuqtalar orasidagi masofa, kesma o'rtasi va to'g'ri chiziqning burchak koeffitsiyenti topiladi.",
    tu: [
      ["Koordinatalar", "A(x; y): x — abssissa (gorizontal), y — ordinata (vertikal)."],
      ["Choraklar", "O'qlar tekislikni 4 ta chorakka bo'ladi; I chorakda x > 0, y > 0."],
      ["Burchak koeffitsiyenti", "To'g'ri chiziqning qiyaligi: x 1 ga oshganda y qanchaga o'zgarishi."]
    ],
    q: [
      "AB = √((x₂ − x₁)² + (y₂ − y₁)²)",
      "Kesma o'rtasi: ((x₁ + x₂)/2;  (y₁ + y₂)/2)",
      "Burchak koeffitsiyenti: k = (y₂ − y₁) / (x₂ − x₁)"
    ],
    m: [
      { s: "A(2; −8) va B(8; −5) nuqtalar orasidagi masofani toping.", y: ["x₂ − x₁ = 8 − 2 = 6,  y₂ − y₁ = −5 − (−8) = 3.", "AB = √(36 + 9) = √45 ≈ 6,708."], j: "√45 = 3√5 ≈ 6,708" },
      { s: "A(−6; 7) va B(−1; 19) orqali o'tuvchi to'g'ri chiziq burchak koeffitsiyentini toping.", y: ["k = (19 − 7) / (−1 − (−6))", "= 12 / 5 = 2,4."], j: "2,4" }
    ],
    x: ["Manfiy koordinatani ayirishda ishorani yo'qotish: −5 − (−8) = 3, −13 emas.", "Burchak koeffitsiyentida surat va maxrajni almashtirib yuborish."],
    h: "Koordinatalar usulini 1637-yilda Rene Dekart \"Geometriya\" asarida va undan mustaqil ravishda Per Ferma yaratgan. Bu kashfiyot geometriya va algebrani birlashtirdi: endi chiziqlarni tenglamalar bilan, tenglamalarni esa chiziqlar bilan tasvirlash mumkin bo'ldi. Dekart sharafiga to'g'ri burchakli koordinatalar \"dekart koordinatalari\" deb ataladi.",
    o: [
      ["Rene Dekart", "1596–1650", "Analitik geometriyaga asos soldi (1637)."],
      ["Per Ferma", "1601–1665", "Dekartdan mustaqil ravishda koordinatalar usulini yaratdi."],
      ["Nikolay Orem", "~1320–1382", "Miqdorlarning o'zgarishini grafik ko'rinishda tasvirlashni birinchilardan bo'lib qo'llagan."]
    ]
  };

  L["Nisbat, sur'at va proporsiya"] = {
    n: "Nisbat ikki miqdorni solishtiradi (3 : 2), proporsiya — ikki nisbatning tengligi. Foiz esa yuzdan bir qism. Bu mavzu narx o'zgarishi, chegirma, retsept, xarita masshtabi kabi kundalik masalalarda ishlatiladi.",
    tu: [
      ["Nisbat", "a : b — a son b dan necha marta katta yoki uning qanday qismi ekanini ko'rsatadi."],
      ["Proporsiya", "a : b = c : d. Asosiy xossasi: a·d = b·c."],
      ["Foiz", "1% = 1/100. p% = p/100."],
      ["Sur'at", "Birlik vaqtdagi o'zgarish: km/soat, so'm/kg."]
    ],
    q: [
      "a : b = c : d  ⇔  a · d = b · c",
      "S ning p% i = S · p / 100",
      "p% ga oshsa: S · (1 + p/100);   p% ga kamaysa: S · (1 − p/100)",
      "Yig'indi S bo'lgan, m : n nisbatdagi sonlar: S·m/(m+n) va S·n/(m+n)"
    ],
    m: [
      { s: "Ikki son 9 : 3 nisbatda, yig'indisi 36. Kattasini toping.", y: ["Jami qismlar: 9 + 3 = 12.", "Bir qism: 36 : 12 = 3.", "Kattasi: 9 · 3 = 27."], j: "27" },
      { s: "Mahsulot narxi 120 000 so'm edi, 10% ga oshdi. Yangi narx qancha?", y: ["10% = 0,1.", "Oshgan qism: 120 000 · 0,1 = 12 000.", "120 000 + 12 000 = 132 000."], j: "132 000 so'm" }
    ],
    x: ["Avval 20% oshib, keyin 20% kamaysa, narx joyiga qaytadi deb o'ylash (aslida 4% kamayadi).", "Nisbatda qismlar sonini qo'shishni unutish."],
    h: "Proporsiyalar nazariyasini qadimgi yunon matematigi Evdoks yaratgan, u Evklidning \"Negizlar\" V kitobida bayon qilingan. \"Foiz\" lotincha \"per centum\" (yuzdan) so'zidan kelib chiqqan; % belgisi Italiyadagi savdo hujjatlarida \"per cento\"ning qisqartmasidan asta-sekin shakllangan.",
    o: [
      ["Kniddik Evdoks", "mil. av. ~408–355", "Proporsiyalar nazariyasini yaratdi."],
      ["Leonardo Fibonachchi", "~1170–1250", "Savdo masalalarida foiz va proporsiya hisoblarini keng qo'lladi."]
    ]
  };

  L["Ifoda, tenglama va tengsizliklar"] = {
    n: "Algebraik ifodada sonlar o'rniga harflar (o'zgaruvchilar) qatnashadi. Ifodaning qiymatini topish, o'xshash hadlarni ixchamlash, chiziqli tenglama va tengsizliklarni yechish — algebraning birinchi qadamlari.",
    tu: [
      ["O'zgaruvchi", "Har xil qiymat qabul qila oladigan harf: x, y, a."],
      ["O'xshash hadlar", "Bir xil harfiy qismga ega hadlar: −2x va 3x."],
      ["Tenglama", "Noma'lum qatnashgan tenglik; ildizi — tenglikni to'g'ri qiladigan son."],
      ["Modul", "|a| — sonning noldan masofasi, har doim ≥ 0."]
    ],
    q: [
      "ax + bx = (a + b)x",
      "ax + b = c  ⇒  x = (c − b) / a,  a ≠ 0",
      "Tenglamaning ikki tomoniga bir xil son qo'shish/ayirish, nol bo'lmagan songa ko'paytirish mumkin",
      "Tengsizlikni manfiy songa ko'paytirsangiz, belgi teskarisiga o'zgaradi"
    ],
    m: [
      { s: "7x − 13 = 43 tenglamani yeching.", y: ["Ikki tomonga 13 qo'shamiz: 7x = 56.", "7 ga bo'lamiz: x = 8.", "Tekshiruv: 7·8 − 13 = 43 ✓"], j: "x = 8" },
      { s: "x = −1 bo'lsa, |−4x − 7| ning qiymatini toping.", y: ["−4·(−1) − 7 = 4 − 7 = −3.", "|−3| = 3."], j: "3" }
    ],
    x: ["Hadni tenglikning narigi tomoniga o'tkazganda ishorasini o'zgartirmaslik.", "Tengsizlikni manfiy songa bo'lganda belgini almashtirmaslik."],
    h: "\"Algebra\" so'zi al-Xorazmiyning \"Al-jabr va al-muqobala\" (~820) kitobi nomidan kelib chiqqan: \"al-jabr\" — hadni tenglikning bir tomonidan ikkinchisiga o'tkazish, \"al-muqobala\" — o'xshash hadlarni ixchamlash. Noma'lumlarni harflar bilan belgilashni Fransua Viyet (1591) boshlagan, x, y, z ni esa Dekart ommalashtirgan. \"<\" va \">\" belgilarini Tomas Xeriot kiritgan.",
    o: [
      ["Muhammad al-Xorazmiy", "~780–850", "Algebrani alohida fan sifatida asosladi."],
      ["Fransua Viyet", "1540–1603", "Algebrada harfiy belgilashni tizimli qo'lladi."],
      ["Tomas Xeriot", "1560–1621", "\"<\" va \">\" belgilarini kiritgan (1631-yilda nashr etilgan)."]
    ]
  };

  L["Daraja, ildiz va sonning standart shakli"] = {
    n: "Daraja — bir xil ko'paytuvchilar ko'paytmasining qisqa yozuvi: 3⁴ = 3·3·3·3. Kvadrat ildiz esa darajaga ko'tarishga teskari amal. Juda katta va juda kichik sonlar standart shaklda (a · 10ⁿ) yoziladi.",
    tu: [
      ["Asos va ko'rsatkich", "aⁿ da a — asos, n — daraja ko'rsatkichi."],
      ["Kvadrat ildiz", "√a — kvadrati a ga teng bo'lgan manfiy bo'lmagan son: √49 = 7."],
      ["Standart shakl", "a · 10ⁿ, bunda 1 ≤ a < 10. Masalan, 3 500 000 = 3,5 · 10⁶."]
    ],
    q: [
      "aᵐ · aⁿ = aᵐ⁺ⁿ;   aᵐ : aⁿ = aᵐ⁻ⁿ",
      "(aᵐ)ⁿ = aᵐⁿ;   a⁰ = 1;   a⁻ⁿ = 1/aⁿ",
      "(ab)ⁿ = aⁿbⁿ",
      "a² − b² = (a − b)(a + b)",
      "√(a·b) = √a · √b;   (√a)² = a"
    ],
    m: [
      { s: "3⁴ · 3¹ : 3⁴ ni hisoblang.", y: ["Asoslar bir xil — ko'rsatkichlarni qo'shamiz/ayiramiz: 4 + 1 − 4 = 1.", "3¹ = 3."], j: "3" },
      { s: "4² − 3² ni hisoblang.", y: ["16 − 9 = 7.", "Yoki: (4 − 3)(4 + 3) = 1 · 7 = 7."], j: "7" }
    ],
    x: ["aᵐ · aⁿ = aᵐⁿ deb yozish (ko'rsatkichlar qo'shiladi, ko'paytirilmaydi).", "2³ ni 2·3 = 6 deb hisoblash (to'g'risi 8)."],
    h: "Arximed \"Qum donalarini hisoblash\" asarida koinotni to'ldiradigan qum donalari sonini baholash uchun katta sonlarni darajalar orqali yozish usulini taklif qilgan — bu standart shaklning ilk ko'rinishi. Daraja ko'rsatkichini yuqoriga kichik qilib yozishni 1637-yilda Rene Dekart joriy qildi. Ildiz belgisi \"√\" ni 1525-yilda nemis matematigi Kristof Rudolf kiritgan.",
    o: [
      ["Arximed", "mil. av. 287–212", "Juda katta sonlarni darajalar yordamida ifodalash g'oyasini ilgari surdi."],
      ["Kristof Rudolf", "1499–1545", "Kvadrat ildiz belgisi \"√\" ni kiritdi (1525)."],
      ["Rene Dekart", "1596–1650", "Daraja ko'rsatkichining zamonaviy yozuvini (a³) joriy qildi."]
    ]
  };

  /* ======================= ALGEBRA I ======================= */
  L["Algebra asoslari"] = {
    n: "Algebra asoslarida o'zgaruvchili ifodalar bilan ishlash o'rganiladi: harf o'rniga son qo'yib qiymat topish, o'xshash hadlarni ixchamlash, qavslarni ochish va modulli ifodalarni hisoblash.",
    tu: [
      ["Ifoda", "Sonlar, harflar va amal belgilaridan tuzilgan yozuv: −2x − 6."],
      ["Koeffitsiyent", "Had oldidagi son ko'paytuvchi: −3x da koeffitsiyent −3."],
      ["Ozod had", "Harfsiz son had: 3x + 5 da 5."],
      ["Ifodaning qiymati", "Harf o'rniga berilgan sonni qo'yib hisoblangan natija."]
    ],
    q: [
      "ax + bx = (a + b)x",
      "a(b + c) = ab + ac;   −(b − c) = −b + c",
      "|a| = a, agar a ≥ 0;   |a| = −a, agar a < 0",
      "Manfiy sonni qo'yishda uni qavsga oling: −2·(−6)"
    ],
    m: [
      { s: "x = −6 bo'lsa, −2x − 6 ifodaning qiymatini toping.", y: ["−2 · (−6) = 12.", "12 − 6 = 6."], j: "6" },
      { s: "−2x + 1 − 3x ni soddalashtiring. x oldidagi koeffitsiyent nechaga teng?", y: ["O'xshash hadlar: −2x va −3x.", "−2x − 3x = −5x. Ifoda: −5x + 1."], j: "−5" }
    ],
    x: ["Manfiy sonni qavssiz qo'yib, ishorani yo'qotish: −2·−6 ni −12 deb hisoblash.", "Ozod hadni x li had bilan qo'shib yuborish."],
    h: "Qadimgi Misr va Bobilda noma'lum son \"to'da\" yoki \"uyum\" deb so'z bilan ifodalangan. Diofant (III asr) noma'lumni maxsus belgi bilan yozishni boshladi. Al-Xorazmiy noma'lumni \"shay\" (narsa) deb atagan; olimlarning fikricha, bu so'z ispan tilidagi \"xei\" orqali keyinchalik x harfiga aylangan bo'lishi mumkin.",
    o: [
      ["Diofant Aleksandriyskiy", "III asr", "\"Arifmetika\" asarida noma'lumlar uchun qisqartma belgilardan foydalangan."],
      ["Muhammad al-Xorazmiy", "~780–850", "Tenglamalarni yechishning umumiy usullarini yaratdi."],
      ["Fransua Viyet", "1540–1603", "Ma'lum va noma'lum miqdorlarni harflar bilan belgilashni joriy qildi."]
    ]
  };

  L["Tenglamalarni yechish"] = {
    n: "Chiziqli tenglama ax + b = c ko'rinishida bo'ladi. Uni yechish — noma'lumni bir tomonda yolg'iz qoldirish. Har bir qadamda tenglikning ikkala tomoni bilan bir xil amal bajariladi.",
    tu: [
      ["Ildiz (yechim)", "Tenglamaga qo'yilganda to'g'ri tenglik hosil qiladigan son."],
      ["Teng kuchli tenglamalar", "Bir xil ildizlarga ega tenglamalar."],
      ["Ko'chirish", "Hadni tenglikning boshqa tomoniga qarama-qarshi ishora bilan o'tkazish."]
    ],
    q: [
      "ax + b = c  ⇒  ax = c − b  ⇒  x = (c − b)/a",
      "a = 0, c − b ≠ 0 bo'lsa — ildiz yo'q;  a = 0, c = b bo'lsa — cheksiz ko'p ildiz",
      "Har doim tekshiring: topilgan x ni tenglamaga qo'ying"
    ],
    m: [
      { s: "2x + 19 = 7 tenglamani yeching.", y: ["19 ni o'ngga o'tkazamiz: 2x = 7 − 19 = −12.", "x = −12 : 2 = −6."], j: "x = −6" },
      { s: "−3x − 12 = 0 tenglamani yeching.", y: ["−3x = 12.", "x = 12 : (−3) = −4."], j: "x = −4" }
    ],
    x: ["Ko'chirishda ishorani o'zgartirmaslik.", "−3x = 12 dan x = 4 deb yozish (manfiy koeffitsiyentga bo'lishni unutish)."],
    h: "Chiziqli tenglamalarni misrliklar \"soxta faraz\" usuli bilan yechgan: avval tasodifiy javob tanlab, keyin uni to'g'rilashgan (Rind papirusi). Al-Xorazmiy \"al-jabr\" (ko'chirish) va \"al-muqobala\" (ixchamlash) amallarini tenglama yechishning asosiy qoidalari sifatida bayon qildi — biz hozir ham aynan shu qadamlarni bajaramiz.",
    o: [
      ["Ahmes", "mil. av. ~1650", "Rind papirusida chiziqli tenglamalarga keltiriladigan masalalar yechilgan."],
      ["Muhammad al-Xorazmiy", "~780–850", "\"Al-jabr\" va \"al-muqobala\" qoidalarini yaratdi."],
      ["Robert Rekord", "~1512–1558", "\"=\" belgisini kiritib, tenglamalarni qisqa yozishga imkon berdi."]
    ]
  };

  L["Tengsizliklarni yechish"] = {
    n: "Tengsizlik — ikki ifodaning qaysi biri katta ekanini ko'rsatuvchi munosabat. Chiziqli, kvadrat tengsizliklar va tengsizliklar sistemasi yechimi odatda son oralig'i bo'ladi; ko'pincha undagi butun sonlarni sanash so'raladi.",
    tu: [
      ["Qat'iy tengsizlik", "< yoki >: chegara son yechimga kirmaydi."],
      ["Noqat'iy tengsizlik", "≤ yoki ≥: chegara son yechimga kiradi."],
      ["Oraliqlar usuli", "Ifodaning nollarini son o'qiga qo'yib, har bir oraliqda ishorani aniqlash."],
      ["Sistema", "Bir vaqtda bajarilishi kerak bo'lgan tengsizliklar; yechim — ularning umumiy qismi."]
    ],
    q: [
      "Manfiy songa ko'paytirish/bo'lishda belgi teskarisiga o'zgaradi",
      "x² + bx + c < 0 (a > 0): yechim — ildizlar orasidagi oraliq (x₁; x₂)",
      "x² + bx + c > 0 (a > 0): yechim — ildizlardan tashqarida",
      "(m; n) oraliqdagi butun sonlar soni: n − m − 1 (m, n butun bo'lsa)"
    ],
    m: [
      { s: "x² − x − 6 < 0 tengsizlikning butun yechimlari nechta?", y: ["x² − x − 6 = 0 ⇒ x₁ = −2, x₂ = 3.", "a > 0, belgi \"<\" — yechim ildizlar orasida: (−2; 3).", "Butun sonlar: −1, 0, 1, 2."], j: "4 ta" },
      { s: "Sistema: { 3x > 6;  5x ≤ 20 }. Butun yechimlari nechta?", y: ["3x > 6 ⇒ x > 2.", "5x ≤ 20 ⇒ x ≤ 4.", "2 < x ≤ 4: butun sonlar 3 va 4."], j: "2 ta" }
    ],
    x: ["Qat'iy tengsizlikda chegara sonni ham sanab qo'yish.", "Kvadrat tengsizlikda yechimni ildizlar \"tashqarisida\" deb olish (a > 0, < 0 bo'lsa ichkarida)."],
    h: "Tengsizliklar qadimdan baholashda ishlatilgan: Arximed π sonini 3 10/71 < π < 3 1/7 tengsizlik bilan chegaralagan. \"<\" va \">\" belgilarini ingliz olimi Tomas Xeriot kiritgan, \"≤\" va \"≥\" ni esa 1734-yilda fransuz Per Buger qo'llagan. XIX asrda Koshi va Chebishev mashhur tengsizliklarni isbotladi.",
    o: [
      ["Arximed", "mil. av. 287–212", "π ni ikki tomondan tengsizliklar bilan baholadi."],
      ["Tomas Xeriot", "1560–1621", "\"<\" va \">\" belgilarini kiritdi."],
      ["Ogyusten Lui Koshi", "1789–1857", "O'rta arifmetik va o'rta geometrik orasidagi tengsizlikni va boshqa muhim tengsizliklarni isbotladi."]
    ]
  };

  L["Chiziqli tenglamalar va grafiklar"] = {
    n: "y = kx + b ko'rinishidagi tenglamaning grafigi — to'g'ri chiziq. k — chiziqning qiyaligi (burchak koeffitsiyenti), b — chiziqning Oy o'qini kesib o'tgan nuqtasi. Ikki nuqta orqali o'tuvchi chiziqni topish va tenglamani yechish shu mavzuga kiradi.",
    tu: [
      ["Burchak koeffitsiyenti k", "x 1 ga oshganda y ning o'zgarishi. k > 0 — chiziq o'sadi, k < 0 — kamayadi."],
      ["Ozod had b", "x = 0 dagi y qiymati — Oy o'qi bilan kesishish nuqtasi (0; b)."],
      ["Parallel chiziqlar", "Burchak koeffitsiyentlari teng: k₁ = k₂."]
    ],
    q: [
      "y = kx + b",
      "k = (y₂ − y₁) / (x₂ − x₁)",
      "Ox o'qi bilan kesishish: y = 0 ⇒ x = −b/k",
      "ax + b = c tenglama ildizi — y = ax + b chiziq y = c chiziqni kesgan nuqtaning abssissasi"
    ],
    m: [
      { s: "A(−7; 1) va B(1; 9) orqali o'tuvchi chiziqning burchak koeffitsiyentini toping.", y: ["k = (9 − 1) / (1 − (−7))", "= 8 / 8 = 1."], j: "1" },
      { s: "7x + 8 = 15 tenglamani yeching.", y: ["7x = 15 − 8 = 7.", "x = 1."], j: "x = 1" }
    ],
    x: ["k ni hisoblaganda x va y ayirmalarini o'rnini almashtirish.", "b ni Ox o'qi bilan kesishish nuqtasi deb o'ylash."],
    h: "Chiziqli bog'lanishlarni grafik tarzda tasvirlash g'oyasi XIV asrda Nikolay Oremda uchraydi, lekin to'liq ko'rinishga Dekart va Fermaning analitik geometriyasi (1637) bilan ega bo'ldi. Bugun chiziqli modellar iqtisod, fizika va dasturlashda eng ko'p qo'llanadigan vositalardan biri.",
    o: [
      ["Rene Dekart", "1596–1650", "Tenglamalarni koordinatalar tekisligida chiziq sifatida tasvirladi."],
      ["Per Ferma", "1601–1665", "To'g'ri chiziq tenglamasini birinchilardan bo'lib yozdi."]
    ]
  };

  L["Funksiyalar"] = {
    n: "Funksiya — har bir x qiymatiga bitta y qiymatini mos qo'yuvchi qoida: y = f(x). Mavzuda funksiyaning qiymatini hisoblash, nollarini topish, aniqlanish sohasi va grafigini o'qish o'rganiladi.",
    tu: [
      ["Argument va qiymat", "x — argument (erkli o'zgaruvchi), f(x) — funksiyaning qiymati."],
      ["Aniqlanish sohasi D(f)", "Funksiya ma'noga ega bo'lgan barcha x lar. 1/x uchun x ≠ 0."],
      ["Funksiyaning nollari", "f(x) = 0 bo'ladigan x lar — grafik Ox o'qini kesadigan nuqtalar."],
      ["Qiymatlar sohasi E(f)", "Funksiya qabul qiladigan barcha qiymatlar."]
    ],
    q: [
      "f(a) ni topish: formulada x o'rniga a ni qo'ying (qavs bilan!)",
      "Nollar: f(x) = 0 tenglamani yeching",
      "Kvadrat funksiya y = ax² + bx + c ning nollari: x = (−b ± √D) / 2a,  D = b² − 4ac",
      "Maxraj ≠ 0;  juft darajali ildiz ostidagi ifoda ≥ 0"
    ],
    m: [
      { s: "f(x) = x² − 5x + 3 bo'lsa, f(4) ni toping.", y: ["f(4) = 4² − 5·4 + 3", "= 16 − 20 + 3 = −1."], j: "−1" },
      { s: "f(x) = x² − 3x − 18 funksiyaning nollarini toping.", y: ["x² − 3x − 18 = 0.", "Viyet: x₁ + x₂ = 3, x₁·x₂ = −18 ⇒ 6 va −3."], j: "x = −3; x = 6" }
    ],
    x: ["Manfiy argumentni qavssiz qo'yish: (−4)² = 16, lekin −4² = −16.", "Funksiyaning nolini f(0) bilan adashtirish."],
    h: "\"Funksiya\" atamasini 1673–1692 yillarda Gotfrid Leybnits kiritgan. f(x) yozuvini 1734-yilda Leonard Eyler ishlatgan. Zamonaviy ta'rifni — har bir x ga bitta y mos kelishi, qoida qanday bo'lishidan qat'iy nazar — 1837-yilda Piter Dirixle bergan.",
    o: [
      ["Gotfrid Leybnits", "1646–1716", "\"Funksiya\" so'zini matematikaga kiritdi."],
      ["Leonard Eyler", "1707–1783", "f(x) belgisini joriy qildi va funksiyalarni tizimli o'rgandi."],
      ["Piter Gustav Lejyon Dirixle", "1805–1859", "Funksiyaning zamonaviy umumiy ta'rifini berdi."]
    ]
  };

  L["Chiziqli funksiyaga oid matnli masalalar"] = {
    n: "Ko'p hayotiy jarayonlar chiziqli model y = kx + b bilan ifodalanadi: taksi narxi (chaqiruv + har km uchun to'lov), telefon tarifi, suv hisoblagichi. k — o'zgarish tezligi, b — boshlang'ich qiymat.",
    tu: [
      ["Model", "Hayotiy vaziyatni matematik formula bilan ifodalash."],
      ["Boshlang'ich qiymat b", "x = 0 bo'lganda to'lanadigan summa (chaqiruv narxi)."],
      ["O'zgarish tezligi k", "x bir birlikka oshganda y ning o'sishi (1 km narxi)."]
    ],
    q: [
      "y = kx + b",
      "k = (y₂ − y₁)/(x₂ − x₁)  — ikkita ma'lum holat bo'yicha",
      "x ni topish: x = (y − b)/k"
    ],
    m: [
      { s: "Taksi: chaqiruv 6000 so'm, har bir km uchun 1500 so'm. 13 km yo'l necha so'm turadi?", y: ["Model: y = 1500x + 6000.", "x = 13: y = 1500·13 + 6000 = 19 500 + 6000."], j: "25 500 so'm" },
      { s: "Shu taksida 18 000 so'm to'landi. Necha km yurilgan?", y: ["1500x + 6000 = 18 000.", "1500x = 12 000 ⇒ x = 8."], j: "8 km" }
    ],
    x: ["Boshlang'ich to'lovni har bir km ga qo'shib yuborish.", "k va b ning o'rnini almashtirish."],
    h: "Matematik modellashtirish — tabiat va jamiyatdagi jarayonlarni tenglamalar bilan ifodalash — Galiley va Nyuton davrida shakllangan. Galiley jismlarning tushishini, Nyuton harakat qonunlarini formulalar bilan yozdi. Chiziqli modellar eng sodda, ammo eng ko'p qo'llanadigan modellardir.",
    o: [
      ["Galileo Galiley", "1564–1642", "Tabiat qonunlarini matematik tilda ifodalash kerakligini ta'kidladi."],
      ["Isaak Nyuton", "1643–1727", "Fizik jarayonlarning matematik modellarini yaratdi."]
    ]
  };
  L["Modellashtirish"] = { ref: "Chiziqli funksiyaga oid matnli masalalar" };

  L["Sonli ketma-ketliklar"] = {
    n: "Ketma-ketlik — tartiblangan sonlar qatori: a₁, a₂, a₃, … Eng muhimlari arifmetik progressiya (har safar bir xil son qo'shiladi) va geometrik progressiya (har safar bir xil songa ko'paytiriladi).",
    tu: [
      ["Arifmetik progressiya", "aₙ₊₁ = aₙ + d; d — ayirma."],
      ["Geometrik progressiya", "bₙ₊₁ = bₙ · q; q — maxraj (q ≠ 0)."],
      ["n-had formulasi", "Istalgan hadni oldingilarini hisoblamasdan topish formulasi."]
    ],
    q: [
      "aₙ = a₁ + (n − 1)d",
      "Sₙ = (a₁ + aₙ)·n/2 = (2a₁ + (n − 1)d)·n/2",
      "bₙ = b₁ · qⁿ⁻¹",
      "Sₙ = b₁(qⁿ − 1)/(q − 1),  q ≠ 1"
    ],
    m: [
      { s: "a₁ = 1, d = 5. a₈ ni toping.", y: ["a₈ = a₁ + 7d = 1 + 7·5", "= 1 + 35 = 36."], j: "36" },
      { s: "b₁ = −1, q = −2. b₅ ni toping.", y: ["b₅ = b₁ · q⁴ = −1 · (−2)⁴", "= −1 · 16 = −16."], j: "−16" }
    ],
    x: ["aₙ formulasida (n − 1) o'rniga n ishlatish.", "Manfiy maxrajni juft darajaga ko'targanda ishorani xato aniqlash."],
    h: "Progressiyalar qadimgi Misr va Bobil masalalarida uchraydi. Arximed geometrik progressiya yig'indisini hisoblagan. Mashhur rivoyatga ko'ra, yosh Gauss o'qituvchi bergan 1 dan 100 gacha sonlar yig'indisini juftlab (1+100, 2+99, …) bir zumda 5050 deb topgan. Fibonachchi 1202-yilda o'z nomidagi ketma-ketlikni (1, 1, 2, 3, 5, 8, …) tasvirlagan.",
    o: [
      ["Arximed", "mil. av. 287–212", "Cheksiz geometrik progressiya yig'indisini topgan."],
      ["Leonardo Fibonachchi", "~1170–1250", "Quyonlar masalasi orqali Fibonachchi ketma-ketligini tasvirladi."],
      ["Karl Fridrix Gauss", "1777–1855", "Arifmetik progressiya yig'indisini juftlash usuli bilan bog'liq mashhur hikoya qahramoni."]
    ]
  };

  L["Tenglamalar sistemasi"] = {
    n: "Ikki noma'lumli ikkita chiziqli tenglama sistemasi — ikki to'g'ri chiziqning kesishish nuqtasini topish masalasi. O'rniga qo'yish va qo'shish (ayirish) usullari bilan yechiladi.",
    tu: [
      ["Sistema yechimi", "Ikkala tenglamani ham qanoatlantiradigan (x; y) juftlik."],
      ["O'rniga qo'yish usuli", "Bir tenglamadan bir noma'lumni ifodalab, ikkinchisiga qo'yish."],
      ["Qo'shish usuli", "Tenglamalarni songa ko'paytirib, qo'shganda bir noma'lum yo'qoladigan qilish."]
    ],
    q: [
      "Bitta yechim: chiziqlar kesishadi (k₁ ≠ k₂)",
      "Yechim yo'q: chiziqlar parallel",
      "Cheksiz ko'p yechim: chiziqlar ustma-ust tushadi",
      "Kramer: Δ = a₁b₂ − a₂b₁,  x = Δx/Δ,  y = Δy/Δ"
    ],
    m: [
      { s: "{ x + 3y = 10;  3x + 2y = 23 } sistemani yeching.", y: ["Birinchidan: x = 10 − 3y.", "Ikkinchiga qo'yamiz: 3(10 − 3y) + 2y = 23 ⇒ 30 − 7y = 23 ⇒ y = 1.", "x = 10 − 3 = 7."], j: "(7; 1)" },
      { s: "{ 3x + 2y = 14;  −3x − 3y = −21 } sistemani yeching.", y: ["Tenglamalarni qo'shamiz: −y = −7 ⇒ y = 7.", "3x + 14 = 14 ⇒ x = 0."], j: "(0; 7)" }
    ],
    x: ["Bitta noma'lumni topib, ikkinchisini topishni unutish.", "Qo'shish usulida faqat bir tomonni ko'paytirish."],
    h: "Chiziqli tenglamalar sistemasini yechishning hozirgi \"Gauss usuli\"ga juda o'xshash usuli 2000 yil avval Xitoyning \"To'qqiz bob\" kitobida bayon qilingan. 1750-yilda Gabriel Kramer determinantlar yordamida yechish formulasini e'lon qildi. Bugun kompyuterlar millionlab noma'lumli sistemalarni shu g'oyalar asosida yechadi.",
    o: [
      ["\"To'qqiz bob\" mualliflari", "mil. av. II–I asr", "Sistemalarni jadval ko'rinishida yo'qotish usuli bilan yechgan."],
      ["Gabriel Kramer", "1704–1752", "Kramer qoidasini e'lon qildi (1750)."],
      ["Karl Fridrix Gauss", "1777–1855", "Ketma-ket yo'qotish usulini astronomik hisoblarda tizimli qo'lladi."]
    ]
  };

  L["Tengsizliklar (sistemalar va grafiklar)"] = {
    n: "Tengsizliklar sistemasining yechimi har bir tengsizlik yechimlarining umumiy qismi (kesishmasi). Uni son o'qida yoki koordinatalar tekisligida soha sifatida tasvirlash mumkin.",
    tu: [
      ["Kesishma", "Ikkala to'plamga ham tegishli elementlar."],
      ["Son oralig'i", "(a; b) — a va b kirmaydi, [a; b] — kiradi."],
      ["Yarim tekislik", "y > kx + b tengsizlikning yechimi — chiziqdan yuqoridagi soha."]
    ],
    q: [
      "x > a va x ≤ b ⇒ a < x ≤ b",
      "(a; b] oraliqdagi butun sonlar: b − a ta (a, b butun bo'lsa)",
      "Kesishma bo'sh bo'lsa — sistema yechimga ega emas"
    ],
    m: [
      { s: "{ 3x > −18;  4x ≤ 0 } sistemaning butun yechimlari nechta?", y: ["3x > −18 ⇒ x > −6.", "4x ≤ 0 ⇒ x ≤ 0.", "−6 < x ≤ 0: −5, −4, −3, −2, −1, 0."], j: "6 ta" },
      { s: "{ 4x > 8;  5x ≤ 35 } sistemaning butun yechimlari nechta?", y: ["x > 2 va x ≤ 7.", "Butun sonlar: 3, 4, 5, 6, 7."], j: "5 ta" }
    ],
    x: ["Qat'iy va noqat'iy belgilarni farqlamaslik.", "Kesishma o'rniga birlashmani olish."],
    h: "Chiziqli tengsizliklar sistemasini o'rganish XX asrda \"chiziqli dasturlash\" fanini tug'dirdi: 1939-yilda Leonid Kantorovich ishlab chiqarishni rejalashtirish uchun bu usulni taklif qildi, 1947-yilda Jorj Dansig simpleks usulini yaratdi. Kantorovich bu ishlari uchun 1975-yilda iqtisodiyot bo'yicha Nobel mukofotiga sazovor bo'ldi.",
    o: [
      ["Leonid Kantorovich", "1912–1986", "Chiziqli dasturlashga asos soldi; Nobel mukofoti sohibi."],
      ["Jorj Dansig", "1914–2005", "Simpleks usulini yaratdi (1947)."]
    ]
  };

  L["Absolyut qiymat va bo'lakli funksiyalar"] = {
    n: "Sonning moduli (absolyut qiymati) — uning son o'qida noldan masofasi. Modulli tenglama va tengsizliklar masofa tili bilan oson yechiladi: |x − a| — x va a orasidagi masofa.",
    tu: [
      ["Modul", "|a| = a (a ≥ 0);  |a| = −a (a < 0)."],
      ["Masofa", "|x − a| — son o'qida x va a nuqtalar orasidagi masofa."],
      ["Bo'lakli funksiya", "Har xil oraliqlarda har xil formula bilan berilgan funksiya; y = |x| shunday funksiya."]
    ],
    q: [
      "|x − a| = b (b > 0)  ⇒  x = a + b yoki x = a − b",
      "|x − a| < b  ⇒  a − b < x < a + b",
      "|x − a| > b  ⇒  x < a − b yoki x > a + b",
      "|x| ≥ 0;  |−a| = |a|;  |ab| = |a|·|b|"
    ],
    m: [
      { s: "|x + 3| = 9 tenglamani yeching.", y: ["x + 3 = 9 yoki x + 3 = −9.", "x = 6 yoki x = −12."], j: "x = 6; x = −12" },
      { s: "|x − 1| < 4 tengsizlikning butun yechimlari nechta?", y: ["−4 < x − 1 < 4 ⇒ −3 < x < 5.", "Butun sonlar: −2, −1, 0, 1, 2, 3, 4."], j: "7 ta" }
    ],
    x: ["|x + 3| = 9 da faqat bitta (musbat) holatni ko'rish.", "Modulni oddiy qavs deb ochib yuborish."],
    h: "Modul tushunchasi XIX asrda matematik analizning qat'iy asoslanishi bilan muhim bo'ldi. |x| belgisini 1841-yilda nemis matematigi Karl Veyershtrass kiritgan. \"Modul\" atamasini ingliz olimi Rojer Kouts (XVIII asr) taklif qilgan, Koshi esa uni keng qo'llagan.",
    o: [
      ["Karl Veyershtrass", "1815–1897", "|x| belgisini kiritdi (1841)."],
      ["Jan-Robert Argan", "1768–1822", "Kompleks son modulini geometrik masofa sifatida talqin qildi."]
    ]
  };

  L["Ratsional ko'rsatkichlar va ildizlar"] = {
    n: "n-darajali ildiz va kasr ko'rsatkichli daraja bir narsaning ikki xil yozuvi: a^(m/n) = ⁿ√(aᵐ). Mavzuda kub ildiz, kasr ko'rsatkichli darajalarni hisoblash va daraja xossalari o'rganiladi.",
    tu: [
      ["n-darajali ildiz", "ⁿ√a — n-darajasi a ga teng son. ∛64 = 4, chunki 4³ = 64."],
      ["Kasr ko'rsatkich", "a^(1/n) = ⁿ√a;  a^(m/n) = (ⁿ√a)ᵐ."],
      ["Arifmetik ildiz", "Juft darajali ildiz faqat a ≥ 0 uchun aniqlangan va natijasi ≥ 0."]
    ],
    q: [
      "a^(1/2) = √a;   a^(1/3) = ∛a",
      "a^(m/n) = (ⁿ√a)ᵐ = ⁿ√(aᵐ)",
      "aᵐ · aⁿ = aᵐ⁺ⁿ;   aᵐ : aⁿ = aᵐ⁻ⁿ  (ratsional ko'rsatkichlar uchun ham)",
      "ⁿ√(ab) = ⁿ√a · ⁿ√b"
    ],
    m: [
      { s: "∛64 ni hisoblang.", y: ["Qaysi sonning kubi 64?", "4³ = 4·4·4 = 64."], j: "4" },
      { s: "5³ · 5⁴ : 5⁶ ni hisoblang.", y: ["Ko'rsatkichlar: 3 + 4 − 6 = 1.", "5¹ = 5."], j: "5" }
    ],
    x: ["a^(1/2) ni a/2 deb o'ylash.", "∛(−8) mavjud emas deb hisoblash (aslida −2; toq darajali ildiz manfiy sondan ham olinadi)."],
    h: "Kasr ko'rsatkichlar g'oyasi XIV asrda fransuz olimi Nikolay Oremda uchraydi. 1676-yilda Isaak Nyuton a^(m/n) yozuvini ishonch bilan qo'llay boshladi va binom formulasini kasr ko'rsatkichlar uchun umumlashtirdi. Kub ildizni topish masalalari qadimgi Bobil jadvallarida va Umar Xayyom asarlarida uchraydi.",
    o: [
      ["Nikolay Orem", "~1320–1382", "Kasr ko'rsatkichli darajalar haqida birinchilardan bo'lib yozdi."],
      ["Isaak Nyuton", "1643–1727", "Kasr va manfiy ko'rsatkichlarni zamonaviy ko'rinishda qo'lladi."],
      ["Umar Xayyom", "1048–1131", "Ildiz chiqarish usullari va kubik tenglamalarni o'rgandi."]
    ]
  };

  L["Eksponensial o'sish va kamayish"] = {
    n: "Eksponensial jarayonda miqdor har bir teng vaqt oralig'ida bir xil marta o'zgaradi: bakteriyalar ko'payishi, bankdagi murakkab foiz, radioaktiv yemirilish. Ko'rsatkichli tenglamalar (2ˣ = 8 kabi) asoslarni tenglashtirish orqali yechiladi.",
    tu: [
      ["Ko'rsatkichli funksiya", "y = aˣ (a > 0, a ≠ 1). a > 1 da o'sadi, 0 < a < 1 da kamayadi."],
      ["Murakkab foiz", "Har davrda foiz avvalgi summaga emas, yig'ilgan summaga qo'shiladi."],
      ["Yarim yemirilish davri", "Moddaning yarmi parchalanadigan vaqt."]
    ],
    q: [
      "aˣ = aᵇ  ⇔  x = b",
      "Murakkab foiz: S = S₀ · (1 + p/100)ⁿ",
      "Ikkilanish: N = N₀ · 2^(t/T)",
      "a⁻ⁿ = 1/aⁿ:  1/8 = 2⁻³"
    ],
    m: [
      { s: "2ˣ⁻³ = 1/8 tenglamani yeching.", y: ["1/8 = 2⁻³.", "2ˣ⁻³ = 2⁻³ ⇒ x − 3 = −3.", "x = 0."], j: "x = 0" },
      { s: "5² · 5³ : 5⁴ ni hisoblang.", y: ["2 + 3 − 4 = 1.", "5¹ = 5."], j: "5" }
    ],
    x: ["2ˣ = 8 dan x = 4 deb yozish (8 : 2). To'g'risi: 8 = 2³ ⇒ x = 3.", "Manfiy ko'rsatkichni manfiy son deb o'ylash: 2⁻³ ≠ −8."],
    h: "Rivoyatga ko'ra, shaxmat ixtirochisi mukofotga birinchi katakka 1 ta, keyingisiga 2 ta, so'ng 4 ta bug'doy donini so'ragan — 64-katakda 2⁶³ ta don bo'lib, bu butun dunyo hosilidan ko'p. 1683-yilda Yakob Bernulli murakkab foizni o'rganib, e ≈ 2,718 soniga duch keldi; Eyler bu sonni e harfi bilan belgiladi.",
    o: [
      ["Yakob Bernulli", "1655–1705", "Murakkab foiz orqali e sonini kashf etdi (1683)."],
      ["Leonard Eyler", "1707–1783", "e sonini belgiladi va ko'rsatkichli funksiyani chuqur o'rgandi."],
      ["Tomas Maltus", "1766–1834", "Aholining eksponensial o'sishi haqidagi mashhur g'oyani ilgari surdi."]
    ]
  };

  L["Ko'phadlar"] = {
    n: "Ko'phad — birhadlar yig'indisi: P(x) = ax² + bx + c. Ko'phadning qiymatini topish, qisqa ko'paytirish formulalari, ko'phadlarni qo'shish, ko'paytirish va Bezu teoremasi shu mavzuda o'rganiladi.",
    tu: [
      ["Birhad", "Son va harflar ko'paytmasi: −3x²."],
      ["Ko'phad darajasi", "Eng katta daraja: 2x³ − x + 1 — uchinchi darajali."],
      ["Erkin had", "x qatnashmagan had; P(0) ga teng."],
      ["Bezu teoremasi", "P(x) ni (x − a) ga bo'lgandagi qoldiq P(a) ga teng."]
    ],
    q: [
      "(a + b)² = a² + 2ab + b²;   (a − b)² = a² − 2ab + b²",
      "(a − b)(a + b) = a² − b²",
      "(a ± b)³ = a³ ± 3a²b + 3ab² ± b³",
      "a³ ± b³ = (a ± b)(a² ∓ ab + b²)",
      "P(a) = 0  ⇔  (x − a) — P(x) ning bo'luvchisi"
    ],
    m: [
      { s: "104 · 96 ni hisoblang.", y: ["104 · 96 = (100 + 4)(100 − 4).", "= 100² − 4² = 10 000 − 16."], j: "9984" },
      { s: "P(x) = −x² − 5x + 5 bo'lsa, P(−4) ni toping.", y: ["−(−4)² − 5·(−4) + 5", "= −16 + 20 + 5 = 9."], j: "9" }
    ],
    x: ["(a + b)² = a² + b² deb yozish (2ab ni unutish).", "−x² da x = −4 bo'lganda −(−4)² = −16 emas, 16 deb olish."],
    h: "Qisqa ko'paytirish formulalari dastlab geometrik shaklda bo'lgan: Evklid (a + b)² ni kvadratni to'rt bo'lakka bo'lib isbotlagan. Ko'phadlar nazariyasi Viyet, Dekart va Nyuton ishlarida rivojlandi. Fransuz matematigi Etyen Bezu XVIII asrda ko'phadlar bo'linishi haqidagi teoremasi bilan mashhur.",
    o: [
      ["Evklid", "mil. av. ~300", "\"Negizlar\" II kitobida qisqa ko'paytirish formulalarining geometrik isbotlarini bergan."],
      ["Etyen Bezu", "1730–1783", "Ko'phad qoldig'i haqidagi teoremani o'rgandi."],
      ["Uilyam Xorner", "1786–1837", "Ko'phad qiymatini tez hisoblash (Xorner sxemasi) usulini e'lon qildi."]
    ]
  };

  L["Chiziqli funksiyalar ko'paytmasiga yoyish"] = {
    n: "Kvadrat uchhadni ko'paytuvchilarga ajratish: x² + bx + c = (x + m)(x + n). Buning uchun yig'indisi b ga, ko'paytmasi c ga teng ikki son m va n topiladi.",
    tu: [
      ["Ko'paytuvchilarga ajratish", "Ifodani ko'paytma ko'rinishiga keltirish."],
      ["Umumiy ko'paytuvchi", "ab + ac = a(b + c)."],
      ["Uchhad", "Uch haddan iborat ko'phad: x² + 11x + 30."]
    ],
    q: [
      "x² + bx + c = (x + m)(x + n),  bunda m + n = b,  m · n = c",
      "ax² + bx + c = a(x − x₁)(x − x₂),  x₁, x₂ — ildizlar",
      "a² − b² = (a − b)(a + b)",
      "c > 0 bo'lsa m, n bir xil ishorali; c < 0 bo'lsa har xil"
    ],
    m: [
      { s: "x² + 11x + 30 ni (x + m)(x + n) ko'rinishga keltiring.", y: ["m · n = 30, m + n = 11.", "30 = 5 · 6, 5 + 6 = 11 ✓."], j: "(x + 5)(x + 6)" },
      { s: "x² − 4x − 32 ni ko'paytuvchilarga ajrating.", y: ["m · n = −32, m + n = −4.", "4 · (−8) = −32, 4 + (−8) = −4 ✓."], j: "(x + 4)(x − 8)" }
    ],
    x: ["Ishoralarni adashtirish: x² − 9x + 8 da m, n ikkalasi manfiy (−1 va −8).", "Faqat ko'paytmani tekshirib, yig'indini tekshirmaslik."],
    h: "Kvadrat ifodalarni ko'paytuvchilarga ajratish g'oyasi Viyetning ildizlar va koeffitsiyentlar orasidagi bog'lanish haqidagi teoremasidan kelib chiqadi. Tomas Xeriot ko'phadni (x − a)(x − b)… ko'rinishida yozish usulini ommalashtirdi. Algebraning asosiy teoremasi (har bir ko'phad kompleks sonlarda chiziqli ko'paytuvchilarga ajraladi) 1799-yilda Gauss tomonidan isbotlangan.",
    o: [
      ["Fransua Viyet", "1540–1603", "Ildizlar va koeffitsiyentlar orasidagi bog'lanishni topdi."],
      ["Tomas Xeriot", "1560–1621", "Ko'phadlarni chiziqli ko'paytuvchilar ko'paytmasi sifatida yozdi."],
      ["Karl Fridrix Gauss", "1777–1855", "Algebraning asosiy teoremasini isbotladi (1799)."]
    ]
  };

  L["Kvadrat tenglamalar"] = {
    n: "ax² + bx + c = 0 (a ≠ 0) — kvadrat tenglama. U diskriminant formulasi yoki Viyet teoremasi yordamida yechiladi. Ildizlar soni diskriminant ishorasiga bog'liq.",
    tu: [
      ["Diskriminant", "D = b² − 4ac."],
      ["Keltirilgan tenglama", "a = 1 bo'lgan tenglama: x² + px + q = 0."],
      ["To'liqsiz tenglama", "b = 0 yoki c = 0 bo'lgan tenglama: 2x² − 2x = 0."]
    ],
    q: [
      "x₁,₂ = (−b ± √D) / 2a",
      "D > 0 — ikki ildiz;  D = 0 — bitta ildiz;  D < 0 — haqiqiy ildiz yo'q",
      "Viyet: x₁ + x₂ = −b/a,   x₁ · x₂ = c/a",
      "ax² + bx = 0  ⇒  x(ax + b) = 0  ⇒  x = 0 yoki x = −b/a"
    ],
    m: [
      { s: "x² + 7x + 10 = 0 tenglamani yeching.", y: ["Viyet: x₁ + x₂ = −7, x₁ · x₂ = 10.", "−2 va −5: yig'indisi −7, ko'paytmasi 10 ✓."], j: "x = −2; x = −5" },
      { s: "x² − 5x + 4 = 0 tenglama ildizlari ko'paytmasini toping.", y: ["Viyet: x₁ · x₂ = c/a = 4/1."], j: "4" }
    ],
    x: ["Viyet teoremasida yig'indini −b emas, b deb olish.", "x² = 2x tenglamani x ga bo'lib, x = 0 ildizini yo'qotib qo'yish."],
    h: "Kvadrat tenglamalarni bobilliklar 4000 yil avval gil lavhalarda yechgan. Al-Xorazmiy olti turdagi kvadrat tenglamalarni geometrik \"kvadratni to'ldirish\" usuli bilan yechib, isbotlab berdi. Braxmagupta 628-yilda umumiy formulaga yaqin qoidani yozgan. Viyet ildizlar va koeffitsiyentlar orasidagi bog'lanishni topdi.",
    o: [
      ["Bobil matematiklari", "mil. av. ~1800", "Kvadrat tenglamalarga keltiriladigan masalalarni yechish usullarini yaratgan."],
      ["Muhammad al-Xorazmiy", "~780–850", "Kvadrat tenglamalarni turlarga ajratib, geometrik isbot bilan yechdi."],
      ["Fransua Viyet", "1540–1603", "Viyet teoremasini kashf etdi."]
    ]
  };

  L["Irratsional sonlar"] = {
    n: "Irratsional son — ikki butun son nisbati (kasr) ko'rinishida yozib bo'lmaydigan son: √2, π, e. Ularning o'nli yozuvi cheksiz va davriy emas. Mavzuda ildizlarni hisoblash va soddalashtirish, irratsional tenglamalarni yechish o'rganiladi.",
    tu: [
      ["Ratsional son", "p/q ko'rinishidagi son (p butun, q natural)."],
      ["Irratsional son", "Ratsional bo'lmagan haqiqiy son: √2 ≈ 1,41421…"],
      ["Haqiqiy sonlar", "Ratsional va irratsional sonlarning birlashmasi."],
      ["Irratsional tenglama", "Noma'lum ildiz ostida qatnashgan tenglama: √(x + 11) = 6."]
    ],
    q: [
      "√(a²) = |a|;   (√a)² = a, a ≥ 0",
      "√(ab) = √a · √b;   √(a/b) = √a / √b",
      "√(f(x)) = c (c ≥ 0)  ⇒  f(x) = c²",
      "Irratsional tenglamani kvadratga ko'targandan keyin ildizni albatta tekshiring"
    ],
    m: [
      { s: "√(x + 11) = 6 tenglamani yeching.", y: ["Ikkala tomonni kvadratga ko'taramiz: x + 11 = 36.", "x = 25. Tekshiruv: √36 = 6 ✓."], j: "x = 25" },
      { s: "√36 ni hisoblang.", y: ["6² = 36, 6 ≥ 0."], j: "6" }
    ],
    x: ["√(a + b) = √a + √b deb yozish (bu noto'g'ri!).", "Kvadratga ko'targandan keyin begona ildizni tekshirmaslik."],
    h: "Rivoyatga ko'ra, Pifagor maktabi a'zosi Gippas kvadrat diagonali uning tomoni bilan umumiy o'lchovga ega emasligini (√2 irratsionalligini) kashf etgan — bu \"hamma narsa son nisbati\" degan qarashni larzaga keltirgan. 1761-yilda Lambert π irratsional ekanini isbotladi. Haqiqiy sonlarning qat'iy nazariyasini 1872-yilda Dedekind va Kantor yaratdi.",
    o: [
      ["Metapontlik Gippas", "mil. av. V asr", "Irratsional kattaliklarni kashf etgan deb hisoblanadi."],
      ["Iogann Lambert", "1728–1777", "π ning irratsionalligini isbotladi (1761)."],
      ["Rixard Dedekind", "1831–1916", "\"Dedekind kesimlari\" orqali haqiqiy sonlarni qat'iy asosladi."]
    ]
  };

  /* ======================= ALGEBRA II ======================= */
  L["Kompleks sonlar"] = {
    n: "Kompleks son z = a + bi ko'rinishida yoziladi, bunda i² = −1. Ular manfiy sondan kvadrat ildiz olish zarurati tufayli paydo bo'lgan va bugun elektrotexnika, signal tahlili, kvant fizikasida keng qo'llanadi.",
    tu: [
      ["Mavhum birlik", "i — kvadrati −1 ga teng son: i² = −1."],
      ["Haqiqiy va mavhum qism", "z = a + bi da a = Re z, b = Im z."],
      ["Modul", "|z| = √(a² + b²) — kompleks tekislikda nuqtaning koordinata boshidan masofasi."],
      ["Qo'shma son", "z = a + bi ga qo'shma: z̄ = a − bi."]
    ],
    q: [
      "(a + bi) + (c + di) = (a + c) + (b + d)i",
      "(a + bi)(c + di) = (ac − bd) + (ad + bc)i",
      "|z| = √(a² + b²);   z · z̄ = a² + b²",
      "i¹ = i, i² = −1, i³ = −i, i⁴ = 1"
    ],
    m: [
      { s: "z = 5 + i kompleks sonning modulini toping.", y: ["|z| = √(5² + 1²) = √26.", "≈ 5,099."], j: "√26 ≈ 5,099" },
      { s: "(−1 − 5i)(2 + i) ko'paytmaning haqiqiy qismini toping.", y: ["ac − bd = (−1)·2 − (−5)·1", "= −2 + 5 = 3."], j: "3" }
    ],
    x: ["i² ni 1 deb olish — ko'paytmaning haqiqiy qismida ishora xatosi.", "Modulni a + b deb hisoblash."],
    h: "1545-yilda Jerolamo Kardano \"Buyuk san'at\" kitobida kubik tenglamani yechayotganda manfiy sonlarning ildizlariga duch keldi. Rafael Bombelli 1572-yilda ular bilan amallar qoidalarini yozdi. i belgisini 1777-yilda Eyler kiritdi. Kaspar Vessel (1799) va Jan-Robert Argan (1806) kompleks sonlarni tekislikdagi nuqta sifatida tasvirladi, \"kompleks son\" atamasini esa Gauss ommalashtirdi.",
    o: [
      ["Jerolamo Kardano", "1501–1576", "Kubik tenglamalar formulasida manfiy son ildizlariga birinchi duch kelgan."],
      ["Rafael Bombelli", "1526–1572", "Kompleks sonlar bilan amallar qoidalarini yaratdi."],
      ["Leonard Eyler", "1707–1783", "i belgisini kiritdi; e^(iπ) + 1 = 0 formulasining muallifi."],
      ["Karl Fridrix Gauss", "1777–1855", "Kompleks tekislik va \"kompleks son\" atamasini ommalashtirdi."]
    ]
  };

  L["Ko'phadlar ustida arifmetik amallar"] = {
    n: "Ko'phadlarni qo'shish, ayirish va ko'paytirish — o'xshash hadlarni guruhlash va har bir hadni har biriga ko'paytirish. Natijada yangi ko'phad hosil bo'ladi, uning koeffitsiyentlari va qiymatlari so'raladi.",
    tu: [
      ["O'xshash hadlar", "Bir xil darajadagi x qatnashgan hadlar."],
      ["Yoyish", "Qavslarni ochib, ko'phadni standart ko'rinishga keltirish."],
      ["Standart ko'rinish", "Hadlar daraja kamayishi tartibida: ax² + bx + c."]
    ],
    q: [
      "(x + p)(x + q) = x² + (p + q)x + pq",
      "Ko'paytirishda: birinchi qavsdagi har bir hadni ikkinchisidagi har bir hadga",
      "Qo'shishda: faqat o'xshash hadlarning koeffitsiyentlari qo'shiladi",
      "deg(P·Q) = deg P + deg Q"
    ],
    m: [
      { s: "(x + 4)(x − 1) yoyilmasida x oldidagi koeffitsiyent nechaga teng?", y: ["(x + p)(x + q) da x oldidagi koeffitsiyent p + q.", "4 + (−1) = 3."], j: "3" },
      { s: "P(x) = −4x² − 2x − 4 bo'lsa, P(3) ni toping.", y: ["−4·9 − 2·3 − 4", "= −36 − 6 − 4 = −46."], j: "−46" }
    ],
    x: ["(x + 4)(x − 1) da faqat x·x va 4·(−1) ni ko'paytirib, o'rta hadlarni unutish."],
    h: "Ko'phadlar bilan amallar arab matematigi al-Karajiy (X–XI asr) asarlarida harflarsiz, so'zlar va jadvallar yordamida bajarilgan. U ko'phadlarni ko'paytirish va bo'lish qoidalarini hamda binom koeffitsiyentlari jadvalini (keyinchalik Paskal uchburchagi deb ataldi) bergan. Harfiy yozuv bilan amallar Viyet va Dekartdan keyin odatiy bo'ldi.",
    o: [
      ["Abu Bakr al-Karajiy", "953–1029", "Ko'phadlar arifmetikasini algebrada tizimli qo'lladi."],
      ["As-Samav'al", "~1130–1180", "Ko'phadlarni bo'lish usullarini rivojlantirdi."]
    ]
  };

  L["Irratsional munosabatlar"] = {
    n: "Irratsional tenglamada noma'lum ildiz belgisi ostida bo'ladi. Uni yechish uchun ildiz yolg'iz qoldiriladi va ikkala tomon darajaga ko'tariladi, so'ng begona ildizlar tekshiruv bilan chiqarib tashlanadi.",
    tu: [
      ["Ruxsat etilgan qiymatlar (ODZ)", "Juft darajali ildiz ostidagi ifoda ≥ 0 bo'lishi kerak."],
      ["Begona ildiz", "Kvadratga ko'tarishda paydo bo'lib, asl tenglamani qanoatlantirmaydigan son."],
      ["Teng kuchli o'tish", "√f = g  ⇔  f = g² va g ≥ 0."]
    ],
    q: [
      "√(f(x)) = c, c ≥ 0  ⇒  f(x) = c²",
      "√(f(x)) = c, c < 0  ⇒  yechim yo'q",
      "√f = g  ⇔  { f = g²;  g ≥ 0 }",
      "Javobni har doim asl tenglamaga qo'yib tekshiring"
    ],
    m: [
      { s: "√(x + 4) = 3 tenglamani yeching.", y: ["x + 4 = 9.", "x = 5. Tekshiruv: √9 = 3 ✓."], j: "x = 5" },
      { s: "√(x + 5) = 1 tenglamani yeching.", y: ["x + 5 = 1.", "x = −4. Tekshiruv: √1 = 1 ✓."], j: "x = −4" }
    ],
    x: ["√(x + 4) = 3 dan x + 4 = 3 deb yozish (kvadratga ko'tarishni unutish).", "Tekshiruvsiz begona ildizni javobga yozish."],
    h: "Ildiz qatnashgan tenglamalar qadimdan geometrik masalalarda (masalan, tomoni berilgan kvadrat diagonalini topishda) uchragan. Ularni algebraik usullar bilan yechish O'rta Osiyo va arab matematiklari, keyinchalik Yevropa algebraistlari asarlarida tizimlashdi.",
    o: [
      ["Umar Xayyom", "1048–1131", "Algebra risolasida ildizlar va darajalar bilan bog'liq tenglamalarni o'rgandi."],
      ["Muhammad al-Xorazmiy", "~780–850", "Ildizlar bilan amallar bajarish qoidalarini bayon qildi."]
    ]
  };

  L["Ratsional munosabatlar"] = {
    n: "Ratsional ifoda — ikki ko'phad nisbati. Ratsional tenglama va tengsizliklarda maxraj nolga teng bo'lmasligi kerak. Tengsizliklar oraliqlar usuli bilan yechiladi.",
    tu: [
      ["Ratsional ifoda", "P(x)/Q(x), Q(x) ≠ 0."],
      ["Oraliqlar usuli", "Surat va maxraj nollarini o'qqa qo'yib, oraliqlardagi ishorani aniqlash."],
      ["Teshilgan nuqta", "Maxrajni nolga aylantiradigan nuqta — u hech qachon yechimga kirmaydi."]
    ],
    q: [
      "P(x)/Q(x) = 0  ⇔  P(x) = 0 va Q(x) ≠ 0",
      "(x − a)/(x − b) ≤ 0, a < b  ⇒  a ≤ x < b",
      "(x − a)/(x − b) ≥ 0, a < b  ⇒  x ≤ a yoki x > b",
      "a/b = c  ⇒  a = c·b (b ≠ 0)"
    ],
    m: [
      { s: "(x − 1)/(x − 7) ≤ 0 tengsizlikning butun yechimlari nechta?", y: ["Nollar: x = 1 (surat), x = 7 (maxraj, kirmaydi).", "Ishoralar: (1; 7) oralig'ida manfiy.", "Yechim: 1 ≤ x < 7 → 1, 2, 3, 4, 5, 6."], j: "6 ta" },
      { s: "(x + 7)/x = 2 tenglamani yeching.", y: ["x ≠ 0. x + 7 = 2x.", "x = 7."], j: "x = 7" }
    ],
    x: ["Maxrajning nolini yechimga qo'shib qo'yish (≤ bo'lsa ham u kirmaydi).", "Tengsizlikni maxrajga ko'paytirib yuborish (maxraj ishorasi noma'lum!)."],
    h: "Oraliqlar usuli funksiyaning uzluksizligiga asoslanadi: uzluksiz funksiya nolga aylanmasdan ishorasini o'zgartira olmaydi. Bu xossani 1817-yilda Bernard Bolsano qat'iy isbotlagan. Ratsional funksiyalarni o'rganish XVII–XVIII asrlarda analiz rivoji bilan birga chuqurlashdi.",
    o: [
      ["Bernard Bolsano", "1781–1848", "Uzluksiz funksiyaning oraliq qiymatlar haqidagi teoremasini isbotladi."],
      ["Ogyusten Lui Koshi", "1789–1857", "Uzluksizlik va limit tushunchalarini qat'iy asosladi."]
    ]
  };

  L["Ko'rsatkichli funksiyalar va logarifmlar"] = {
    n: "Logarifm — darajaga teskari amal: log_a b = c, agar aᶜ = b bo'lsa. Ko'rsatkichli va logarifmik tenglamalar asoslarni tenglashtirish yoki logarifm ta'rifidan foydalanib yechiladi.",
    tu: [
      ["Logarifm", "log_a b — a ni b hosil qilish uchun qanday darajaga ko'tarish kerakligi."],
      ["Asos", "a > 0, a ≠ 1."],
      ["O'nli va natural logarifm", "lg b = log₁₀ b;  ln b = log_e b."]
    ],
    q: [
      "log_a b = c  ⇔  aᶜ = b",
      "log_a(xy) = log_a x + log_a y;   log_a(x/y) = log_a x − log_a y",
      "log_a(xⁿ) = n · log_a x;   log_a a = 1;   log_a 1 = 0",
      "aˣ = aᵇ  ⇔  x = b"
    ],
    m: [
      { s: "log₅(x − 1) = 2 tenglamani yeching.", y: ["Ta'rif bo'yicha: x − 1 = 5².", "x − 1 = 25 ⇒ x = 26."], j: "x = 26" },
      { s: "3ˣ⁺² = 2187 tenglamani yeching.", y: ["2187 = 3⁷.", "x + 2 = 7 ⇒ x = 5."], j: "x = 5" }
    ],
    x: ["log(x + y) = log x + log y deb yozish (noto'g'ri!).", "Logarifm ostidagi ifoda musbat bo'lishini tekshirmaslik."],
    h: "Logarifmlarni 1614-yilda shotland olimi Jon Neper kashf etdi — ular ko'paytirishni qo'shishga aylantirib, astronomlarning ishini oylab qisqartirdi. Genri Briggs o'nli logarifmlar jadvallarini tuzdi. Laplas aytganidek, logarifmlar \"astronomlar umrini ikki baravar uzaytirdi\". Logarifmik chizg'ich 1970-yillargacha muhandislarning asosiy hisoblash asbobi edi.",
    o: [
      ["Jon Neper", "1550–1617", "Logarifmlarni kashf etdi (1614)."],
      ["Genri Briggs", "1561–1630", "O'nli logarifmlar jadvallarini tuzdi."],
      ["Leonard Eyler", "1707–1783", "Logarifmni ko'rsatkichli funksiyaga teskari funksiya sifatida ta'rifladi."]
    ]
  };

  L["Trigonometriya"] = {
    n: "Trigonometriya burchaklar va uchburchak tomonlari orasidagi bog'lanishlarni o'rganadi. sin, cos, tg funksiyalari, asosiy trigonometrik ayniyat va maxsus burchaklar (0°, 30°, 45°, 60°, 90°, 180°) qiymatlari — bu mavzuning yadrosi.",
    tu: [
      ["Sinus", "To'g'ri burchakli uchburchakda qarama-qarshi katetning gipotenuzaga nisbati."],
      ["Kosinus", "Yopishgan katetning gipotenuzaga nisbati."],
      ["Tangens", "Qarama-qarshi katetning yopishgan katetga nisbati: tg α = sin α / cos α."],
      ["Choraklar", "I chorakda (0°–90°) sin, cos, tg — hammasi musbat."]
    ],
    q: [
      "sin²α + cos²α = 1",
      "tg α = sin α / cos α;   1 + tg²α = 1/cos²α",
      "sin 30° = 1/2,  cos 60° = 1/2,  sin 45° = cos 45° = √2/2,  tg 45° = 1",
      "sin 0° = 0, cos 0° = 1;  sin 90° = 1, cos 90° = 0;  cos 180° = −1",
      "Pifagor uchliklari: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25)"
    ],
    m: [
      { s: "sin α = 8/17, α — I chorak burchagi. cos α ni toping.", y: ["cos²α = 1 − (8/17)² = 1 − 64/289 = 225/289.", "I chorakda cos α > 0: cos α = 15/17."], j: "15/17 ≈ 0,882" },
      { s: "4·cos 180° + 2 ni hisoblang.", y: ["cos 180° = −1.", "4·(−1) + 2 = −2."], j: "−2" }
    ],
    x: ["sin²α ni sin(α²) deb tushunish.", "cos 180° = 1 deb olish (aslida −1)."],
    h: "Trigonometriya astronomiyadan tug'ildi. Gipparx (mil. av. II asr) birinchi \"vatarlar\" jadvalini tuzdi, Ptolemey uni \"Almagest\"da rivojlantirdi. Hind olimi Aryabxata yarim vatar — sinusni kiritdi. O'rta Osiyo olimlari Abul Vafo, Beruniy va Nasriddin Tusiy trigonometriyani astronomiyadan ajralgan mustaqil fanga aylantirdi. Zamonaviy belgilarni Eyler joriy qildi.",
    o: [
      ["Gipparx", "mil. av. ~190–120", "\"Trigonometriyaning otasi\" — birinchi trigonometrik jadvalni tuzdi."],
      ["Aryabxata", "476–550", "Sinus tushunchasini va sinuslar jadvalini kiritdi."],
      ["Abul Vafo Buzjoniy", "940–998", "Tangens funksiyasini va sinuslar teoremasining isbotini berdi."],
      ["Nasriddin Tusiy", "1201–1274", "Trigonometriyani alohida fan sifatida bayon qildi."]
    ]
  };

  L["Murakkab tenglamalar va funksiyalar"] = {
    n: "Bu mavzuda turli tenglamalar birgalikda uchraydi: to'liq va to'liqsiz kvadrat tenglamalar, kasr-ratsional tenglamalar, modulli tenglamalar. Asosiy qadam — tenglama turini aniqlab, mos usulni tanlash.",
    tu: [
      ["To'liqsiz kvadrat tenglama", "ax² + bx = 0 yoki ax² + c = 0."],
      ["Kasr-ratsional tenglama", "Noma'lum maxrajda qatnashgan tenglama."],
      ["Almashtirish usuli", "Murakkab ifodani yangi o'zgaruvchi bilan belgilab, oddiyroq tenglamaga keltirish."]
    ],
    q: [
      "ax² + bx = 0  ⇒  x(ax + b) = 0",
      "D = b² − 4ac,  x = (−b ± √D)/2a",
      "Kasrli tenglamada avval maxraj ≠ 0 shartini yozing",
      "|f(x)| = a (a ≥ 0)  ⇒  f(x) = a yoki f(x) = −a"
    ],
    m: [
      { s: "2x² + 4x − 6 = 0 tenglamani yeching.", y: ["2 ga bo'lamiz: x² + 2x − 3 = 0.", "Viyet: 1 va −3 (yig'indi −2, ko'paytma −3)."], j: "x = 1; x = −3" },
      { s: "2x² − 2x = 0 tenglamani yeching.", y: ["2x(x − 1) = 0.", "x = 0 yoki x = 1."], j: "x = 0; x = 1" }
    ],
    x: ["To'liqsiz tenglamada x ga bo'lib, x = 0 ildizini yo'qotish.", "Kasrli tenglamada maxrajni nolga aylantiradigan sonni javobga yozish."],
    h: "Uchinchi va to'rtinchi darajali tenglamalar formulalari XVI asrda italiyalik Tartalya, Kardano va Ferrari tomonidan topildi. Beshinchi va undan yuqori darajali tenglamalar uchun umumiy formula yo'qligini Abel (1824) isbotladi, Galua esa qaysi tenglamalar ildizlar orqali yechilishini aniqlab beruvchi nazariyani yaratdi.",
    o: [
      ["Nikkolo Tartalya", "1499–1557", "Kubik tenglamani yechish usulini topdi."],
      ["Lodoviko Ferrari", "1522–1565", "To'rtinchi darajali tenglama yechimini topdi."],
      ["Evarist Galua", "1811–1832", "Tenglamalarning yechiluvchanligi nazariyasini (Galua nazariyasi) yaratdi."]
    ]
  };

  L["Progressiyalar"] = {
    n: "Arifmetik va geometrik progressiyalar: n-hadni topish, dastlabki n ta had yig'indisini hisoblash va hayotiy masalalarda (oylik jamg'arma, zinapoya, bakteriyalar ko'payishi) qo'llash.",
    tu: [
      ["Arifmetik progressiya", "Har bir had oldingisidan bir xil d songa farq qiladi."],
      ["Geometrik progressiya", "Har bir had oldingisidan bir xil q marta katta."],
      ["Xarakteristik xossa", "Arifmetik: aₙ = (aₙ₋₁ + aₙ₊₁)/2; geometrik: bₙ² = bₙ₋₁·bₙ₊₁."]
    ],
    q: [
      "aₙ = a₁ + (n − 1)d;   Sₙ = (2a₁ + (n − 1)d)·n / 2",
      "bₙ = b₁·qⁿ⁻¹;   Sₙ = b₁(qⁿ − 1)/(q − 1)",
      "Cheksiz kamayuvchi geometrik progressiya (|q| < 1): S = b₁/(1 − q)"
    ],
    m: [
      { s: "a₁ = −9, d = −5. a₆ ni toping.", y: ["a₆ = a₁ + 5d = −9 + 5·(−5)", "= −9 − 25 = −34."], j: "−34" },
      { s: "a₁ = 7, d = 7. Dastlabki 5 ta had yig'indisini toping.", y: ["S₅ = (2·7 + 4·7)·5/2", "= (14 + 28)·5/2 = 42·5/2 = 105."], j: "105" }
    ],
    x: ["Yig'indi formulasida 2a₁ o'rniga a₁ yozish.", "d manfiy bo'lganda ishorani yo'qotish."],
    h: "Arifmetik va geometrik progressiyalar Rind papirusida va Bobil lavhalarida uchraydi. Arximed parabola segmenti yuzini cheksiz geometrik progressiya yig'indisi orqali topgan. Hind matematigi Aryabxata arifmetik progressiya yig'indisi formulasini bergan.",
    o: [
      ["Arximed", "mil. av. 287–212", "Cheksiz geometrik progressiya yig'indisidan geometriyada foydalandi."],
      ["Aryabxata", "476–550", "Progressiyalar yig'indisi formulalarini bayon qildi."],
      ["Karl Fridrix Gauss", "1777–1855", "1 + 2 + … + 100 yig'indisini juftlash usulida topgani bilan mashhur."]
    ]
  };

  L["Konus kesimlari"] = {
    n: "Konus kesimlari — konusni tekislik bilan kesishdan hosil bo'ladigan egri chiziqlar: aylana, ellips, parabola va giperbola. Mavzuda aylana tenglamasidan radius va markazni topish, parabolaning fokusini aniqlash o'rganiladi.",
    tu: [
      ["Aylana", "Markazdan bir xil (r) masofadagi nuqtalar: (x − a)² + (y − b)² = r²."],
      ["Ellips", "Ikki fokusgacha masofalar yig'indisi o'zgarmas bo'lgan nuqtalar."],
      ["Parabola", "Fokus va direktrisadan teng uzoqlikdagi nuqtalar: y² = 4px, fokus (p; 0)."],
      ["Giperbola", "Ikki fokusgacha masofalar ayirmasi moduli o'zgarmas bo'lgan nuqtalar."]
    ],
    q: [
      "(x − a)² + (y − b)² = r²:  markaz (a; b), radius r",
      "x² + y² − 2ax − 2by + c = 0  ⇒  markaz (a; b),  r² = a² + b² − c",
      "y² = 4px:  fokus (p; 0),  direktrisa x = −p",
      "x²/a² + y²/b² = 1 — ellips;   x²/a² − y²/b² = 1 — giperbola"
    ],
    m: [
      { s: "(x + 1)² + (y + 6)² = 25 aylananing radiusini toping.", y: ["r² = 25.", "r = 5."], j: "5" },
      { s: "x² + y² − 4x = 60 aylana markazining abssissasini toping.", y: ["To'la kvadrat ajratamiz: x² − 4x = (x − 2)² − 4.", "(x − 2)² + y² = 64 ⇒ markaz (2; 0)."], j: "2" }
    ],
    x: ["r² = 25 dan r = 25 deb yozish.", "(x + 1)² dan markaz abssissasini +1 deb olish (to'g'risi −1)."],
    h: "Konus kesimlarini mil. av. IV asrda Menexm kubni ikkilantirish masalasini yechish uchun kashf etgan. Apolloniy Pergskiy \"Konus kesimlari\" (8 kitob) asarida ularni to'liq o'rganib, ellips, parabola, giperbola nomlarini bergan. Umar Xayyom kubik tenglamalarni konus kesimlari kesishuvi orqali yechgan. 1609-yilda Kepler sayyoralar Quyosh atrofida ellips bo'ylab aylanishini ochdi.",
    o: [
      ["Menexm", "mil. av. ~380–320", "Konus kesimlarini birinchi bo'lib kashf etgan."],
      ["Apolloniy Pergskiy", "mil. av. ~262–190", "\"Konus kesimlari\" asarini yozib, egri chiziqlarga nom berdi."],
      ["Umar Xayyom", "1048–1131", "Kubik tenglamalarni konus kesimlari yordamida yechdi."],
      ["Iogann Kepler", "1571–1630", "Sayyoralar orbitasi ellips ekanini aniqladi (1609)."]
    ]
  };

  /* ======================= GEOMETRIYA ASOSLARI ======================= */
  L["To'g'ri chiziqlar"] = {
    n: "To'g'ri chiziq — geometriyaning asosiy tushunchalaridan biri. Koordinatalar tekisligida u y = kx + b tenglama bilan beriladi. Mavzuda kesma o'rtasi, kesma uzunligi, chiziq qiyaligi, parallel va perpendikulyar chiziqlar o'rganiladi.",
    tu: [
      ["Kesma", "To'g'ri chiziqning ikki nuqta bilan chegaralangan qismi."],
      ["Nur", "Bir tomondan chegaralangan, ikkinchi tomonga cheksiz davom etuvchi qism."],
      ["Parallel chiziqlar", "Kesishmaydigan to'g'ri chiziqlar: k₁ = k₂."],
      ["Perpendikulyar chiziqlar", "90° ostida kesishuvchi chiziqlar: k₁ · k₂ = −1."]
    ],
    q: [
      "Kesma o'rtasi: ((x₁ + x₂)/2; (y₁ + y₂)/2)",
      "Kesma uzunligi: √((x₂ − x₁)² + (y₂ − y₁)²)",
      "k = (y₂ − y₁)/(x₂ − x₁)",
      "Ikki nuqtadan faqat bitta to'g'ri chiziq o'tadi"
    ],
    m: [
      { s: "A(5; 7) va B(8; 10) kesma o'rtasining abssissasini toping.", y: ["x = (5 + 8)/2 = 13/2."], j: "6,5" },
      { s: "A(−7; −2) va B(−3; 10) nuqtalar orasidagi masofani toping.", y: ["Δx = 4, Δy = 12.", "√(16 + 144) = √160 ≈ 12,649."], j: "√160 = 4√10 ≈ 12,649" }
    ],
    x: ["Kesma o'rtasida koordinatalarni 2 ga bo'lishni unutish.", "Masofa formulasida kvadratga ko'tarishni unutish."],
    h: "Evklid \"Negizlar\"ni nuqta, chiziq va tekislik ta'riflari hamda beshta postulat bilan boshlagan; beshinchi (parallellar) postulati 2000 yil davomida bahs-munozaraga sabab bo'ldi. XIX asrda Lobachevskiy, Boyai va Gauss bu postulat bajarilmaydigan noyevklid geometriyani yaratishdi.",
    o: [
      ["Evklid", "mil. av. ~300", "To'g'ri chiziq va parallellik haqidagi aksiomalarni bayon qildi."],
      ["Nikolay Lobachevskiy", "1792–1856", "Noyevklid geometriyasini yaratdi."],
      ["Rene Dekart", "1596–1650", "To'g'ri chiziqni tenglama orqali ifodalashni boshlab berdi."]
    ]
  };

  L["Burchaklar"] = {
    n: "Burchak — bir nuqtadan chiqqan ikki nurdan hosil bo'lgan shakl. Burchaklar gradusda o'lchanadi. Mavzuda burchak turlari, qo'shni va vertikal burchaklar hamda maxsus burchaklarning trigonometrik qiymatlari o'rganiladi.",
    tu: [
      ["O'tkir burchak", "0° dan katta, 90° dan kichik."],
      ["To'g'ri burchak", "Aynan 90°."],
      ["O'tmas burchak", "90° dan katta, 180° dan kichik."],
      ["Qo'shni burchaklar", "Yig'indisi 180° ga teng."],
      ["Vertikal burchaklar", "O'zaro teng."]
    ],
    q: [
      "Uchburchak burchaklari yig'indisi = 180°",
      "n burchakli ko'pburchak burchaklari yig'indisi = 180°·(n − 2)",
      "sin 90° = 1,  cos 0° = 1,  cos 180° = −1,  tg 45° = 1,  cos 60° = 1/2",
      "1 radian = 180°/π ≈ 57,3°"
    ],
    m: [
      { s: "5·tg 45° + 5 ni hisoblang.", y: ["tg 45° = 1.", "5·1 + 5 = 10."], j: "10" },
      { s: "Uchburchakning ikki burchagi 50° va 70°. Uchinchisini toping.", y: ["180° − 50° − 70° = 60°."], j: "60°" }
    ],
    x: ["Qo'shni va vertikal burchaklarni adashtirish.", "tg 45° ni 0,5 deb olish."],
    h: "To'liq aylanani 360 gradusga bo'lish an'anasi Bobildan keladi — ular 60 lik sanoq tizimidan foydalangan va yil taxminan 360 kun deb hisoblangan. Fales (mil. av. VI asr) vertikal burchaklar tengligini isbotlagan birinchi olimlardan. Radian o'lchovi XVIII asrda Rojer Kouts ishlarida paydo bo'lgan.",
    o: [
      ["Fales Miletskiy", "mil. av. ~624–546", "Vertikal burchaklar tengligi va boshqa teoremalarni isbotladi."],
      ["Bobil astronomlari", "mil. av. II ming yillik", "Aylanani 360 qismga bo'lish an'anasini boshladi."],
      ["Rojer Kouts", "1682–1716", "Radian o'lchoviga asos solgan."]
    ]
  };

  L["Shakllar"] = {
    n: "Tekislikdagi asosiy shakllar: uchburchak, to'g'ri to'rtburchak, kvadrat, parallelogramm, trapetsiya, doira. Har birining perimetri va yuzini hisoblash formulalari bor.",
    tu: [
      ["Ko'pburchak", "Kesmalardan tuzilgan yopiq shakl."],
      ["Parallelogramm", "Qarama-qarshi tomonlari parallel to'rtburchak."],
      ["Trapetsiya", "Faqat ikki tomoni parallel to'rtburchak."],
      ["Muntazam ko'pburchak", "Barcha tomonlari va burchaklari teng ko'pburchak."]
    ],
    q: [
      "To'g'ri to'rtburchak: P = 2(a + b),  S = ab",
      "Uchburchak: S = ½·a·h",
      "Parallelogramm: S = a·h",
      "Trapetsiya: S = (a + b)/2 · h",
      "Doira: S = πr²,  C = 2πr"
    ],
    m: [
      { s: "To'g'ri to'rtburchak tomonlari 9 va 7 sm. Perimetri va yuzini toping.", y: ["P = 2(9 + 7) = 32 sm.", "S = 9 · 7 = 63 sm²."], j: "P = 32 sm, S = 63 sm²" },
      { s: "Uchburchak asosi 10 sm, balandligi 13 sm. Yuzini toping.", y: ["S = ½ · 10 · 13 = 65."], j: "65 sm²" }
    ],
    x: ["Parallelogramm yuzini qo'shni tomonlar ko'paytmasi deb hisoblash (balandlik kerak!)."],
    h: "Misrliklar va bobilliklar dala, omborxona va piramidalar uchun yuza va hajm formulalarini amalda qo'llagan. Yunon olimlari esa ularni isbotladi. Geron Aleksandriyskiy (I asr) uchburchak yuzini uch tomoni orqali topish formulasini bergan.",
    o: [
      ["Evklid", "mil. av. ~300", "Shakllar xossalarini aksiomatik tarzda isbotladi."],
      ["Geron Aleksandriyskiy", "~10–70", "Uchburchak yuzi uchun Geron formulasini berdi."]
    ]
  };

  L["Koordinatalar tekisligi"] = {
    n: "Koordinatalar tekisligida nuqtaning o'rni (x; y) juftlik bilan beriladi. Bu yerda ikki nuqta orasidagi masofa, kesma o'rtasi va ikki nuqtadan o'tuvchi chiziqning qiyaligi topiladi.",
    tu: [
      ["Abssissa", "Nuqtaning x koordinatasi (Ox o'qi bo'yicha)."],
      ["Ordinata", "Nuqtaning y koordinatasi (Oy o'qi bo'yicha)."],
      ["Koordinata boshi", "O(0; 0) — o'qlarning kesishish nuqtasi."]
    ],
    q: [
      "AB = √((x₂ − x₁)² + (y₂ − y₁)²)",
      "O'rta nuqta: ((x₁ + x₂)/2; (y₁ + y₂)/2)",
      "k = (y₂ − y₁)/(x₂ − x₁)"
    ],
    m: [
      { s: "A(−8; −1) va B(−3; 5) orqali o'tuvchi chiziq burchak koeffitsiyentini toping.", y: ["k = (5 − (−1))/(−3 − (−8))", "= 6/5 = 1,2."], j: "1,2" },
      { s: "A(−2; −7) va B(10; −3) kesma o'rtasining abssissasini toping.", y: ["(−2 + 10)/2 = 8/2 = 4."], j: "4" }
    ],
    x: ["Ayirishda manfiy koordinatani noto'g'ri qo'yish."],
    h: "Koordinatalar usuli Dekart va Ferma tomonidan XVII asrda yaratilgan. Qadimda ham shunga o'xshash g'oyalar bo'lgan: Apolloniy konus kesimlarini o'qlarga nisbatan masofalar orqali o'rgangan, geograflar esa joylarni kenglik va uzunlik bilan belgilashgan.",
    o: [
      ["Rene Dekart", "1596–1650", "Analitik geometriyaning asoschisi."],
      ["Klavdiy Ptolemey", "~100–170", "Xaritalarda kenglik va uzunlik koordinatalaridan foydalangan."]
    ]
  };

  L["Yuza va perimetr"] = {
    n: "Perimetr — shaklning chegarasi uzunligi, yuza — u egallagan sirt. Ular turli birliklarda o'lchanadi (sm va sm²). Mavzuda to'g'ri to'rtburchak, kvadrat, uchburchak va kubga oid hisoblar bor.",
    tu: [
      ["Perimetr P", "Barcha tomonlar yig'indisi; chiziqli birliklarda (sm, m)."],
      ["Yuza S", "Kvadrat birliklarda (sm², m²)."],
      ["Hajm V", "Kub birliklarda (sm³)."]
    ],
    q: [
      "Kvadrat: P = 4a,  S = a²",
      "To'g'ri to'rtburchak: P = 2(a + b),  S = ab",
      "Kub: V = a³,  to'la sirt S = 6a²",
      "1 m² = 10 000 sm²"
    ],
    m: [
      { s: "To'g'ri to'rtburchak tomonlari 8 va 13 sm. Perimetri va yuzini toping.", y: ["P = 2(8 + 13) = 42 sm.", "S = 8 · 13 = 104 sm²."], j: "P = 42 sm, S = 104 sm²" },
      { s: "Qirrasi 2 sm bo'lgan kubning hajmini toping.", y: ["V = 2³ = 8."], j: "8 sm³" }
    ],
    x: ["Bir xil perimetrli shakllarning yuzalari ham teng deb o'ylash (aslida teng emas)."],
    h: "Bir xil perimetrdagi shakllar ichida eng katta yuzaga ega bo'lgani doira ekanini qadimgi yunonlar bilgan (izoperimetrik masala). Rivoyatga ko'ra, malika Didona Karfagenni qurganda buqa terisidan kesilgan ip bilan iloji boricha katta yerni o'rab olish uchun yarim aylana shaklini tanlagan.",
    o: [
      ["Zenodor", "mil. av. II asr", "Izoperimetrik shakllar haqida asar yozgan."],
      ["Arximed", "mil. av. 287–212", "Doira va boshqa egri chiziqli shakllar yuzini hisobladi."]
    ]
  };

  L["Hajm va sirt yuzi"] = {
    n: "Fazoviy jismlar — kub, parallelepiped, prizma, silindr, konus, shar — uchun hajm va sirt yuzi formulalari. Hajm jism ichiga sig'adigan miqdorni, sirt yuzi esa uni o'rash uchun kerak bo'lgan materialni ko'rsatadi.",
    tu: [
      ["To'g'ri burchakli parallelepiped", "Barcha yoqlari to'g'ri to'rtburchak bo'lgan jism (g'isht, quti)."],
      ["Yon sirt", "Asoslardan tashqari barcha yoqlar yuzasi."],
      ["To'la sirt", "Yon sirt + asoslar yuzasi."]
    ],
    q: [
      "Parallelepiped: V = abc,  S = 2(ab + bc + ac)",
      "Kub: V = a³,  S = 6a²",
      "Silindr: V = πr²h,  S_yon = 2πrh",
      "Konus: V = ⅓πr²h",
      "Shar: V = ⁴⁄₃πr³,  S = 4πr²"
    ],
    m: [
      { s: "Parallelepiped o'lchamlari 7, 8 va 2 sm. Hajmini toping.", y: ["V = 7 · 8 · 2 = 112."], j: "112 sm³" },
      { s: "Shu parallelepipedning to'la sirtini toping.", y: ["S = 2(7·8 + 8·2 + 7·2)", "= 2(56 + 16 + 14) = 2 · 86 = 172."], j: "172 sm²" }
    ],
    x: ["Konus hajmida ⅓ ni unutish.", "Hajm birligini sm² deb yozish."],
    h: "Misrning Moskva papirusida (mil. av. ~1850) kesik piramida hajmi to'g'ri hisoblangan. Arximed shar hajmi unga tashqi chizilgan silindr hajmining 2/3 qismiga teng ekanini isbotladi va bu kashfiyotni qabr toshiga o'yib qo'yishni vasiyat qilgan. XVII asrda Kavaleri hajmlarni \"kesimlar\" orqali solishtirish tamoyilini yaratdi.",
    o: [
      ["Arximed", "mil. av. 287–212", "Shar va silindr hajmlari, sirtlari orasidagi nisbatni topdi."],
      ["Bonaventura Kavaleri", "1598–1647", "Kavaleri tamoyilini yaratdi."],
      ["Leonard Eyler", "1707–1783", "Ko'pyoqlar uchun V − E + F = 2 formulasini topdi."]
    ]
  };

  L["Pifagor teoremasi"] = {
    n: "To'g'ri burchakli uchburchakda gipotenuza kvadrati katetlar kvadratlari yig'indisiga teng: c² = a² + b². Bu teorema masofalarni hisoblashning asosi — koordinatalar, qurilish, navigatsiyada qo'llanadi.",
    tu: [
      ["Katetlar", "To'g'ri burchakni hosil qiluvchi tomonlar (a, b)."],
      ["Gipotenuza", "To'g'ri burchak qarshisidagi eng uzun tomon (c)."],
      ["Pifagor uchligi", "a² + b² = c² ni qanoatlantiradigan natural sonlar: (3, 4, 5), (5, 12, 13), (8, 15, 17)."]
    ],
    q: [
      "c² = a² + b²   ⇒   c = √(a² + b²)",
      "a = √(c² − b²)",
      "Teskari teorema: a² + b² = c² bo'lsa, uchburchak to'g'ri burchakli",
      "Uchlikni k ga ko'paytirsangiz ham uchlik: (6, 8, 10), (27, 36, 45)"
    ],
    m: [
      { s: "Katetlar 6 va 8. Gipotenuzani toping.", y: ["c² = 36 + 64 = 100.", "c = 10."], j: "10" },
      { s: "Katetlar 27 va 36. Gipotenuzani toping.", y: ["27 = 9·3, 36 = 9·4 — bu (3, 4, 5) uchlikning 9 baravari.", "c = 9 · 5 = 45."], j: "45" }
    ],
    x: ["c = a + b deb hisoblash.", "Katetni topishda kvadratlarni qo'shish (ayirish kerak)."],
    h: "Teorema Pifagordan ancha oldin ma'lum bo'lgan: Bobilning Plimpton 322 lavhasida (mil. av. ~1800) Pifagor uchliklari jadvali bor, Xitoyda u \"gougu\" teoremasi deb atalgan. Ammo uni umumiy holda isbotlash an'anasi Pifagor maktabi (mil. av. VI asr) bilan bog'lanadi. Evklid \"Negizlar\"ning I kitobida (47-taklif) isbot keltirgan. Bugun bu teoremaning 300 dan ortiq isboti ma'lum.",
    o: [
      ["Pifagor Samosskiy", "mil. av. ~570–495", "Teoremani isbotlagan maktab asoschisi."],
      ["Evklid", "mil. av. ~300", "\"Negizlar\"da klassik isbotini keltirdi."],
      ["Bobil matematiklari", "mil. av. ~1800", "Plimpton 322 lavhasida Pifagor uchliklari jadvalini qoldirdi."]
    ]
  };

  L["Geometrik almashtirishlar, tenglik va o'xshashlik"] = {
    n: "Shaklni siljitish, burish, simmetrik aks ettirish uning o'lchamlarini o'zgartirmaydi (teng shakllar), gomotetiya esa o'lchamlarni k marta o'zgartiradi (o'xshash shakllar). O'xshash shakllarda tomonlar k marta, yuzalar k² marta, hajmlar k³ marta o'zgaradi.",
    tu: [
      ["Harakat", "Masofalarni saqlaydigan almashtirish: parallel ko'chirish, burish, simmetriya."],
      ["Teng shakllar", "Harakat yordamida ustma-ust tushiriladigan shakllar."],
      ["O'xshashlik koeffitsiyenti k", "Mos tomonlar nisbati."]
    ],
    q: [
      "a₂ = k · a₁",
      "S₂ / S₁ = k²",
      "V₂ / V₁ = k³",
      "Perimetrlar nisbati = k"
    ],
    m: [
      { s: "O'xshashlik koeffitsiyenti 5 bo'lsa, yuzalar nisbati nechaga teng?", y: ["S₂/S₁ = k² = 5²."], j: "25" },
      { s: "Koeffitsiyent 2, kichik uchburchak tomoni 5. Katta uchburchakning mos tomoni?", y: ["5 · 2 = 10."], j: "10" }
    ],
    x: ["Yuzalar nisbatini k deb olish (k² bo'lishi kerak)."],
    h: "Fales Misrda piramida balandligini uning soyasi va o'z tayog'ining soyasini solishtirib — o'xshash uchburchaklar yordamida — o'lchagan. 1872-yilda Feliks Kleyn \"Erlangen dasturi\"da geometriyani \"almashtirishlarda o'zgarmay qoladigan xossalarni o'rganuvchi fan\" deb ta'rifladi.",
    o: [
      ["Fales Miletskiy", "mil. av. ~624–546", "O'xshashlik yordamida piramida balandligini o'lchagan."],
      ["Feliks Kleyn", "1849–1925", "Geometriyalarni almashtirishlar guruhlari orqali tasnifladi."]
    ]
  };

  /* ======================= GEOMETRIYA ======================= */
  L["Almashtirishlarni qo'llash"] = {
    n: "Grafiklarni almashtirish: y = f(x) grafigini o'ngga-chapga, yuqoriga-pastga surish, cho'zish va aks ettirish. Masalan, y = (x − 5)² + 3 — bu y = x² parabolaning 5 birlik o'ngga va 3 birlik yuqoriga surilgani; uchi (5; 3).",
    tu: [
      ["Parallel ko'chirish", "Har bir nuqtani bir xil vektor bo'yicha surish."],
      ["Gorizontal siljish", "y = f(x − a): a > 0 bo'lsa o'ngga, a < 0 bo'lsa chapga."],
      ["Vertikal siljish", "y = f(x) + b: b > 0 bo'lsa yuqoriga."],
      ["Parabola uchi", "y = a(x − m)² + n parabolaning uchi — (m; n)."]
    ],
    q: [
      "y = f(x − m) + n:  grafik m birlik o'ngga, n birlik yuqoriga suriladi",
      "y = a(x − m)² + n  ⇒  uch (m; n)",
      "y = −f(x) — Ox o'qiga nisbatan simmetriya",
      "y = f(−x) — Oy o'qiga nisbatan simmetriya"
    ],
    m: [
      { s: "y = (x − 5)² + 3 parabolaning uchini toping.", y: ["Ko'rinish y = (x − m)² + n: m = 5, n = 3."], j: "(5; 3)" },
      { s: "y = 2(x + 4)² − 1 parabolaning uchini toping.", y: ["x + 4 = x − (−4) ⇒ m = −4.", "n = −1."], j: "(−4; −1)" }
    ],
    x: ["y = (x + 4)² ni 4 birlik o'ngga surilgan deb o'ylash (aslida chapga)."],
    h: "Grafiklarni almashtirish g'oyasi analitik geometriya bilan birga paydo bo'ldi. XIX asrda Kleyn geometriyani almashtirishlar orqali umumlashtirdi; bugun bu g'oyalar kompyuter grafikasi, animatsiya va o'yinlarda har soniyada ishlatiladi.",
    o: [
      ["Feliks Kleyn", "1849–1925", "Erlangen dasturida geometriyani almashtirishlar orqali tasnifladi."],
      ["Sofus Li", "1842–1899", "Uzluksiz almashtirishlar guruhlari (Li guruhlari) nazariyasini yaratdi."]
    ]
  };

  L["Almashtirish xossalari"] = {
    n: "Har bir almashtirish shaklning qaysi xossalarini saqlaydi? Harakatlar (siljitish, burish, simmetriya) masofa va burchaklarni saqlaydi; o'xshashlik almashtirishi burchaklarni saqlaydi, masofalarni esa k marta o'zgartiradi.",
    tu: [
      ["Izometriya (harakat)", "Masofalarni saqlaydi: shakl va o'lcham o'zgarmaydi."],
      ["Gomotetiya", "Markazdan k marta cho'zish yoki siqish."],
      ["Invariant", "Almashtirishda o'zgarmay qoladigan xossa."]
    ],
    q: [
      "Harakatda: uzunliklar, burchaklar, yuzalar saqlanadi",
      "O'xshashlikda: burchaklar saqlanadi, uzunliklar × k, yuzalar × k²",
      "y = a(x − m)² + n: uch (m; n)"
    ],
    m: [
      { s: "Kichik uchburchak yuzi 15, o'xshashlik koeffitsiyenti 3. Katta uchburchak yuzi?", y: ["S₂ = S₁ · k² = 15 · 9."], j: "135" },
      { s: "Koeffitsiyent 5, kichik uchburchak tomoni 8. Kattasining mos tomoni?", y: ["8 · 5 = 40."], j: "40" }
    ],
    x: ["Yuzani k ga ko'paytirish (k² kerak)."],
    h: "Simmetriya va almashtirishlar qadimdan san'at va me'morchilikda qo'llangan — Samarqand va Buxoro yodgorliklaridagi girih naqshlari bunga yorqin misol. XIX–XX asrlarda matematiklar tekislikdagi naqshlarning faqat 17 xil simmetriya guruhi borligini isbotladilar.",
    o: [
      ["Feliks Kleyn", "1849–1925", "Geometriyani invariantlar nazariyasi sifatida qaradi."],
      ["Yevgraf Fyodorov", "1853–1919", "Kristallar va naqshlar simmetriya guruhlarini tasnifladi."]
    ]
  };

  L["Tenglik"] = {
    n: "Teng uchburchaklar — harakat bilan ustma-ust tushadigan uchburchaklar. Ularning tenglik alomatlari (TBT, BTB, TTT) va o'xshash uchburchaklarning yuzalari orasidagi bog'lanish shu mavzuda o'rganiladi.",
    tu: [
      ["I alomat (TBT)", "Ikki tomon va ular orasidagi burchak teng bo'lsa, uchburchaklar teng."],
      ["II alomat (BTB)", "Bir tomon va unga yopishgan ikki burchak teng bo'lsa."],
      ["III alomat (TTT)", "Uch tomoni mos ravishda teng bo'lsa."]
    ],
    q: [
      "Teng uchburchaklarda mos elementlar (tomon, burchak, balandlik, yuza) teng",
      "O'xshash uchburchaklar: S₂/S₁ = k²",
      "Uchburchak yuzi: S = ½ah"
    ],
    m: [
      { s: "Kichik uchburchak yuzi 5, o'xshashlik koeffitsiyenti 2. Katta uchburchak yuzi?", y: ["S = 5 · 2² = 5 · 4."], j: "20" },
      { s: "Uchburchak asosi 18 sm, balandligi 6 sm. Yuzi?", y: ["S = ½ · 18 · 6 = 54."], j: "54 sm²" }
    ],
    x: ["Ikki tomon va ular orasida bo'lmagan burchak tengligidan uchburchaklar tengligini chiqarish (bu alomat emas)."],
    h: "Uchburchaklar tengligining alomatlari Evklid \"Negizlar\"ida (I kitob, 4-, 8-, 26-takliflar) isbotlangan. Fales BTB alomatidan dengizdagi kemagacha masofani aniqlashda foydalangan deb hikoya qilinadi.",
    o: [
      ["Evklid", "mil. av. ~300", "Uchburchaklar tengligi alomatlarini isbotladi."],
      ["Fales Miletskiy", "mil. av. ~624–546", "Tenglik alomatidan amaliy o'lchashda foydalangan."]
    ]
  };

  L["O'xshashlik"] = {
    n: "O'xshash shakllar — bir xil ko'rinishdagi, lekin o'lchami har xil shakllar. Mos burchaklari teng, mos tomonlari proporsional. Xarita masshtabi, maketlar, fotosuratni kattalashtirish — o'xshashlikning amaliy misollari.",
    tu: [
      ["O'xshashlik koeffitsiyenti", "k = a₂/a₁ = b₂/b₁ = c₂/c₁."],
      ["BB alomati", "Ikki burchagi teng uchburchaklar o'xshash."],
      ["Masshtab", "Xaritadagi masofaning haqiqiy masofaga nisbati."]
    ],
    q: [
      "a₂ = k · a₁;   P₂ = k · P₁",
      "S₂ = k² · S₁",
      "V₂ = k³ · V₁ (jismlar uchun)"
    ],
    m: [
      { s: "O'xshashlik koeffitsiyenti 4 bo'lsa, yuzalar nisbati?", y: ["k² = 4² = 16."], j: "16" },
      { s: "Kichik uchburchak yuzi 10, k = 4. Katta uchburchak yuzi?", y: ["10 · 16 = 160."], j: "160" }
    ],
    x: ["Hajm nisbatini k² deb olish (k³ bo'lishi kerak)."],
    h: "O'xshashlik g'oyasidan qadimgi Misr quruvchilari va Fales foydalangan. Evklid \"Negizlar\"ning VI kitobini o'xshash shakllarga bag'ishlagan. Galiley o'xshashlik sababli hayvonlar o'lchami cheksiz katta bo'la olmasligini tushuntirgan: o'lcham k marta oshsa, og'irlik k³, suyak kesimi esa faqat k² marta oshadi.",
    o: [
      ["Fales Miletskiy", "mil. av. ~624–546", "O'xshash uchburchaklar yordamida balandliklarni o'lchagan."],
      ["Evklid", "mil. av. ~300", "\"Negizlar\" VI kitobida o'xshashlik nazariyasini bayon qilgan."],
      ["Galileo Galiley", "1564–1642", "O'xshashlik qonunlarini jismlar mustahkamligiga qo'llagan."]
    ]
  };

  L["To'g'ri burchakli uchburchaklar trigonometriyasi"] = {
    n: "To'g'ri burchakli uchburchakda o'tkir burchakning sinusi, kosinusi va tangensi tomonlar nisbati orqali aniqlanadi. Pifagor teoremasi bilan birga ular noma'lum tomon va burchaklarni topishga imkon beradi.",
    tu: [
      ["sin α", "qarama-qarshi katet / gipotenuza."],
      ["cos α", "yopishgan katet / gipotenuza."],
      ["tg α", "qarama-qarshi katet / yopishgan katet."]
    ],
    q: [
      "sin²α + cos²α = 1",
      "cos α = √(1 − sin²α)  (o'tkir burchak uchun)",
      "tg α = sin α / cos α",
      "c² = a² + b²",
      "Uchliklar: (3, 4, 5), (5, 12, 13), (8, 15, 17)"
    ],
    m: [
      { s: "sin α = 5/13, α — o'tkir burchak. cos α ni toping.", y: ["(5, 12, 13) uchligi: qarama-qarshi katet 5, gipotenuza 13 ⇒ yopishgan katet 12.", "cos α = 12/13."], j: "12/13 ≈ 0,923" },
      { s: "Katetlar 8 va 15. Gipotenuzani toping.", y: ["c² = 64 + 225 = 289.", "c = 17."], j: "17" }
    ],
    x: ["Qarama-qarshi va yopishgan katetlarni adashtirish.", "sin α > 1 bo'lishi mumkin deb o'ylash."],
    h: "Qadimgi Misr va Bobilda qiyaliklarni o'lchash uchun tomonlar nisbatlaridan foydalanilgan (Rind papirusidagi \"seqed\" — piramida qiyaligi). O'rta Osiyo olimlari Abul Vafo, Beruniy va Nasriddin Tusiy oltita trigonometrik funksiyani to'liq o'rganib chiqdi. Regiomontan \"Uchburchaklar haqida\" (1464) kitobi bilan bu bilimlarni Yevropaga tarqatdi.",
    o: [
      ["Abu Rayhon Beruniy", "973–1048", "Trigonometriyadan geodeziya va astronomiyada foydalanib, Yer radiusini hisobladi."],
      ["Nasriddin Tusiy", "1201–1274", "\"To'rtburchak haqida risola\"da trigonometriyani mustaqil fan sifatida bayon qildi."],
      ["Regiomontan", "1436–1476", "\"De triangulis\" asari bilan Yevropada trigonometriyani rivojlantirdi."]
    ]
  };
  L["To'g'ri burchakli uchburchaklar & trigonometriya"] = { ref: "To'g'ri burchakli uchburchaklar trigonometriyasi" };

  L["Ixtiyoriy uchburchaklar uchun trigonometriya"] = {
    n: "Istalgan uchburchakni yechish uchun sinuslar va kosinuslar teoremalari ishlatiladi. Ular uchburchakning tomon va burchaklari orasidagi bog'lanishni beradi. Maxsus burchaklar qiymatlarini bilish hisobni tezlashtiradi.",
    tu: [
      ["Sinuslar teoremasi", "Tomonlar qarshisidagi burchaklar sinuslariga proporsional."],
      ["Kosinuslar teoremasi", "Pifagor teoremasining umumlashmasi."],
      ["Uchburchakni yechish", "Berilgan elementlar bo'yicha qolgan tomon va burchaklarni topish."]
    ],
    q: [
      "a / sin A = b / sin B = c / sin C = 2R",
      "c² = a² + b² − 2ab·cos C",
      "S = ½ab·sin C",
      "cos 60° = 1/2,  cos 90° = 0,  cos 120° = −1/2,  cos 180° = −1"
    ],
    m: [
      { s: "4·cos 60° + 1 ni hisoblang.", y: ["cos 60° = 1/2.", "4 · 1/2 + 1 = 2 + 1 = 3."], j: "3" },
      { s: "a = 5, b = 8, C = 60°. c tomonni toping.", y: ["c² = 25 + 64 − 2·5·8·½ = 89 − 40 = 49.", "c = 7."], j: "7" }
    ],
    x: ["Kosinuslar teoremasida \"−2ab·cos C\" ni unutish yoki ishorasini xato olish."],
    h: "Kosinuslar teoremasining geometrik shakli Evklidda (II kitob, 12–13-takliflar) bor. Uni trigonometrik ko'rinishda birinchi bo'lib Samarqandlik al-Koshiy aniq bayon qilgan — shuning uchun Fransiyada u hozir ham \"al-Koshiy teoremasi\" deb ataladi. Sinuslar teoremasi Abul Vafo va Nasriddin Tusiy asarlarida isbotlangan.",
    o: [
      ["G'iyosiddin Jamshid al-Koshiy", "~1380–1429", "Kosinuslar teoremasini trigonometrik shaklda bayon qildi."],
      ["Abul Vafo Buzjoniy", "940–998", "Sfera va tekislik uchun sinuslar teoremasini isbotladi."],
      ["Nasriddin Tusiy", "1201–1274", "Uchburchaklarni yechishning barcha hollarini tizimlashtirdi."]
    ]
  };
  L["To'g'ri burchakli bo'lmagan uchburchaklar & trigonometriya"] = { ref: "Ixtiyoriy uchburchaklar uchun trigonometriya" };

  L["Analitik geometriya"] = {
    n: "Analitik geometriya — geometrik masalalarni koordinatalar va tenglamalar yordamida yechish. Nuqtalar sonlar juftligi, chiziqlar tenglamalar bilan ifodalanadi, masofa va burchaklar esa formulalar bilan hisoblanadi.",
    tu: [
      ["To'g'ri chiziq tenglamasi", "y = kx + b yoki ax + by + c = 0."],
      ["Ikki nuqtadan o'tuvchi chiziq", "(y − y₁)/(y₂ − y₁) = (x − x₁)/(x₂ − x₁)."],
      ["Nuqtadan chiziqgacha masofa", "d = |ax₀ + by₀ + c| / √(a² + b²)."]
    ],
    q: [
      "AB = √((x₂ − x₁)² + (y₂ − y₁)²)",
      "k = (y₂ − y₁)/(x₂ − x₁)",
      "O'rta nuqta: ((x₁ + x₂)/2; (y₁ + y₂)/2)",
      "Perpendikulyarlik: k₁ · k₂ = −1"
    ],
    m: [
      { s: "A(−1; 4) va B(2; 10) orasidagi masofani toping.", y: ["Δx = 3, Δy = 6.", "√(9 + 36) = √45 ≈ 6,708."], j: "3√5 ≈ 6,708" },
      { s: "A(3; 7) va B(11; 11) orqali o'tuvchi chiziq qiyaligi?", y: ["k = (11 − 7)/(11 − 3) = 4/8."], j: "0,5" }
    ],
    x: ["k ni topishda x lar ayirmasini suratga yozish."],
    h: "1637-yilda Dekart \"Metod haqida mulohaza\" kitobining ilovasi \"Geometriya\"da koordinatalar usulini e'lon qildi. Ferma shu g'oyani mustaqil ravishda biroz oldinroq ishlab chiqqan, ammo kech nashr ettirgan. Bu kashfiyot keyinchalik Nyuton va Leybnitsning differensial va integral hisobini yaratishiga yo'l ochdi.",
    o: [
      ["Rene Dekart", "1596–1650", "\"Geometriya\" (1637) — analitik geometriyaning asosi."],
      ["Per Ferma", "1601–1665", "Koordinatalar usulini mustaqil yaratgan."],
      ["Leonard Eyler", "1707–1783", "Analitik geometriyani fazoga kengaytirdi va tizimlashtirdi."]
    ]
  };

  L["Aylana"] = {
    n: "Aylana — markazdan bir xil masofada joylashgan nuqtalar to'plami. Uning uzunligi, doira yuzi, yoy uzunligi va sektor yuzi π soni orqali hisoblanadi.",
    tu: [
      ["Radius r", "Markazdan aylanagacha masofa."],
      ["Diametr d", "d = 2r — aylananing eng uzun vatari."],
      ["π soni", "Aylana uzunligining diametrga nisbati ≈ 3,14159…"],
      ["Markaziy burchak", "Uchi aylana markazida bo'lgan burchak."]
    ],
    q: [
      "C = 2πr = πd",
      "S = πr²",
      "Yoy uzunligi: l = 2πr · α/360°",
      "Sektor yuzi: S = πr² · α/360°"
    ],
    m: [
      { s: "Radiusi 7 bo'lgan aylana uzunligini toping (π ≈ 3,14).", y: ["C = 2 · 3,14 · 7 = 43,96."], j: "43,96" },
      { s: "Radius 5, markaziy burchak 30°. Yoy uzunligini toping (π ≈ 3,14).", y: ["l = 2 · 3,14 · 5 · 30/360", "= 31,4 / 12 ≈ 2,617."], j: "≈ 2,617" }
    ],
    x: ["Aylana uzunligi va doira yuzi formulalarini adashtirish.", "Yoy uzunligida 360 ga bo'lishni unutish."],
    h: "Arximed muntazam 96-burchaklar yordamida 3 10/71 < π < 3 1/7 ekanini isbotladi. 1424-yilda Samarqandda G'iyosiddin Jamshid al-Koshiy π ni 16 o'nli xona aniqligida hisobladi — bu rekord 180 yil davomida hech kim tomonidan yangilanmadi. π belgisini 1706-yilda Uilyam Jons kiritgan, Eyler uni ommalashtirgan. 1882-yilda Lindeman π transsendent son ekanini isbotladi — shu bilan \"doirani kvadratlash\" masalasi yechimsiz ekani ma'lum bo'ldi.",
    o: [
      ["Arximed", "mil. av. 287–212", "π ni ikki tomondan baholadi; doira yuzi formulasini isbotladi."],
      ["G'iyosiddin Jamshid al-Koshiy", "~1380–1429", "π ni 16 o'nli xona aniqlikda hisobladi (1424)."],
      ["Uilyam Jons", "1675–1749", "π belgisini kiritdi (1706)."],
      ["Ferdinand fon Lindeman", "1852–1939", "π ning transsendentligini isbotladi (1882)."]
    ]
  };

  L["Stereometriya"] = {
    n: "Stereometriya — fazodagi shakllar geometriyasi. Unda ko'pyoqlar (kub, prizma, piramida) va aylanish jismlari (silindr, konus, shar), ularning hajmi, sirti va diagonallari o'rganiladi.",
    tu: [
      ["Ko'pyoq", "Ko'pburchaklar bilan chegaralangan jism."],
      ["Diagonal", "Parallelepipedning qarama-qarshi uchlarini tutashtiruvchi kesma."],
      ["Aylanish jismi", "Tekis shaklni o'q atrofida aylantirishdan hosil bo'lgan jism."]
    ],
    q: [
      "Parallelepiped: V = abc,  diagonal d = √(a² + b² + c²)",
      "Prizma: V = S_asos · h;   Piramida: V = ⅓ · S_asos · h",
      "Silindr: V = πr²h;   Konus: V = ⅓πr²h;   Shar: V = ⁴⁄₃πr³",
      "Eyler formulasi: Uchlar − Qirralar + Yoqlar = 2"
    ],
    m: [
      { s: "Parallelepiped o'lchamlari 2, 6 va 9. Diagonalini toping.", y: ["d² = 4 + 36 + 81 = 121.", "d = 11."], j: "11" },
      { s: "O'lchamlari 7, 8 va 5 sm bo'lgan parallelepiped hajmi?", y: ["V = 7 · 8 · 5 = 280."], j: "280 sm³" }
    ],
    x: ["Diagonalda faqat ikki o'lchamni olish (yoq diagonali bilan adashtirish)."],
    h: "Platon (mil. av. IV asr) beshta muntazam ko'pyoqni koinot unsurlari bilan bog'lagan — ular \"Platon jismlari\" deb ataladi. Evklid \"Negizlar\"ning so'nggi uch kitobini stereometriyaga bag'ishlab, faqat beshta muntazam ko'pyoq borligini isbotladi. 1752-yilda Eyler ko'pyoqlar uchun V − E + F = 2 formulasini e'lon qildi.",
    o: [
      ["Platon", "mil. av. ~428–348", "Muntazam ko'pyoqlarni falsafiy asarlarida tasvirlagan."],
      ["Evklid", "mil. av. ~300", "Faqat 5 ta muntazam ko'pyoq mavjudligini isbotladi."],
      ["Leonard Eyler", "1707–1783", "Ko'pyoqlar uchun Eyler formulasini topdi."]
    ]
  };

  /* ======================= TRIGONOMETRIYA ======================= */
  L["Birlik aylanada sinus, kosinus va tangenslarning ta'rifi"] = {
    n: "Birlik aylana (radiusi 1, markazi koordinata boshida) yordamida sin, cos va tg istalgan burchak uchun aniqlanadi: burchakka mos nuqtaning abssissasi — cos α, ordinatasi — sin α. Bu ta'rif o'tmas, manfiy va 360° dan katta burchaklar uchun ham ishlaydi.",
    tu: [
      ["Birlik aylana", "x² + y² = 1."],
      ["cos α", "Aylanadagi nuqtaning abssissasi (x)."],
      ["sin α", "Aylanadagi nuqtaning ordinatasi (y)."],
      ["Ishoralar", "I chorak: hammasi +;  II: faqat sin +;  III: faqat tg +;  IV: faqat cos +."]
    ],
    q: [
      "P(α) = (cos α; sin α)",
      "sin²α + cos²α = 1",
      "tg α = sin α / cos α  (cos α ≠ 0)",
      "−1 ≤ sin α ≤ 1;  −1 ≤ cos α ≤ 1",
      "sin(α + 360°) = sin α;  cos(−α) = cos α;  sin(−α) = −sin α"
    ],
    m: [
      { s: "cos α = 12/13, α — I chorak. tg α ni toping.", y: ["sin α = √(1 − 144/169) = √(25/169) = 5/13.", "tg α = (5/13) : (12/13) = 5/12."], j: "5/12 ≈ 0,4167" },
      { s: "sin α = 8/17, α — I chorak. cos α ni toping.", y: ["cos α = √(1 − 64/289) = √(225/289) = 15/17."], j: "15/17" }
    ],
    x: ["II chorakda cos ni musbat deb olish.", "tg ni cos/sin deb hisoblash."],
    h: "Trigonometrik funksiyalarni birlik aylana orqali aniqlash — to'g'ri burchakli uchburchakdan tashqariga chiqish — XVIII asrda Leonard Eyler tomonidan tizimli bayon qilindi. U trigonometrik funksiyalarni burchakning emas, sonning (radianning) funksiyasi sifatida ko'rib chiqdi va sin, cos, tg belgilarini hozirgi ko'rinishga keltirdi.",
    o: [
      ["Leonard Eyler", "1707–1783", "Trigonometrik funksiyalarning zamonaviy ta'rifi va belgilarini joriy qildi."],
      ["Abul Vafo Buzjoniy", "940–998", "Birlik radiusli aylanada trigonometrik chiziqlarni qarab chiqqan."]
    ]
  };

  L["Trigonometrik funksiyalarning grafiklari"] = {
    n: "y = sin x va y = cos x grafiklari — to'lqin (sinusoida), y = tg x esa takrorlanuvchi shoxlar. Grafiklarni siljitish, cho'zish (amplituda, davr) va maxsus qiymatlarni bilish tebranishlar, tovush va yorug'lik to'lqinlarini tushunishga yordam beradi.",
    tu: [
      ["Davr", "Grafik takrorlanadigan eng kichik oraliq: sin va cos uchun 2π (360°), tg uchun π (180°)."],
      ["Amplituda", "y = A·sin x da |A| — to'lqin balandligi."],
      ["Siljish", "y = f(x − m) + n — grafikni m o'ngga, n yuqoriga surish."]
    ],
    q: [
      "y = A·sin(kx + b) + c:  amplituda |A|,  davr 2π/|k|",
      "sin x qiymatlari: [−1; 1];   tg x qiymatlari: (−∞; +∞)",
      "y = a(x − m)² + n:  uch (m; n)  (siljitish qoidasi barcha funksiyalar uchun bir xil)",
      "tg 45° = 1;  sin 90° = 1;  cos 180° = −1"
    ],
    m: [
      { s: "y = 2(x + 2)² + 4 parabolaning uchini toping.", y: ["m = −2, n = 4."], j: "(−2; 4)" },
      { s: "6·tg 45° + 1 ni hisoblang.", y: ["tg 45° = 1.", "6 + 1 = 7."], j: "7" }
    ],
    x: ["y = sin 2x ning davrini 4π deb olish (aslida π).", "Gorizontal siljish yo'nalishini adashtirish."],
    h: "Jozef Furye 1807-yilda har qanday davriy jarayonni sinus va kosinuslar yig'indisi sifatida ifodalash mumkinligini ko'rsatdi. Bu g'oya (Furye qatorlari) bugun musiqa yozish, rasm siqish (JPEG), mobil aloqa va tibbiy tomografiyaning asosida yotadi.",
    o: [
      ["Jozef Furye", "1768–1830", "Davriy funksiyalarni sinuslar yig'indisiga yoyishni taklif qildi."],
      ["Leonard Eyler", "1707–1783", "Trigonometrik funksiyalarni analiz funksiyalari sifatida o'rgandi."]
    ]
  };

  L["Trigonometrik tenglamalar va ayniyatlar"] = {
    n: "Trigonometrik ayniyatlar — har qanday burchak uchun to'g'ri bo'ladigan tengliklar. Ular yordamida ifodalar soddalashtiriladi va tenglamalar yechiladi. Asosiy ayniyat, ikkilangan burchak va qo'shish formulalari eng ko'p ishlatiladi.",
    tu: [
      ["Ayniyat", "O'zgaruvchining barcha ruxsat etilgan qiymatlarida to'g'ri tenglik."],
      ["Eng sodda tenglama", "sin x = a, cos x = a, tg x = a."],
      ["Davriylik", "Trigonometrik tenglamalar cheksiz ko'p yechimga ega: x = x₀ + 2πn."]
    ],
    q: [
      "sin²α + cos²α = 1",
      "sin 2α = 2 sin α cos α;   cos 2α = cos²α − sin²α",
      "sin(α ± β) = sin α cos β ± cos α sin β",
      "cos(α ± β) = cos α cos β ∓ sin α sin β",
      "cos x = 1 ⇒ x = 2πn;   sin x = 0 ⇒ x = πn"
    ],
    m: [
      { s: "2·cos 180° + 5 ni hisoblang.", y: ["cos 180° = −1.", "2·(−1) + 5 = 3."], j: "3" },
      { s: "cos α = 12/13 (I chorak). tg α ni toping.", y: ["sin α = 5/13.", "tg α = 5/12."], j: "5/12" }
    ],
    x: ["sin 2α = 2 sin α deb yozish.", "Tenglamaning faqat bitta yechimini yozib, davriylikni unutish."],
    h: "Qo'shish formulalari Ptolemeyning \"Almagest\" asarida vatarlar tilida ifodalangan. Abul Vafo ularni sinuslar uchun isbotladi. XVIII asrda Eyler e^(ix) = cos x + i·sin x formulasini topib, barcha trigonometrik ayniyatlarni bitta qoidadan keltirib chiqarish imkonini berdi.",
    o: [
      ["Klavdiy Ptolemey", "~100–170", "Vatarlar uchun qo'shish formulalarini isbotladi."],
      ["Abul Vafo Buzjoniy", "940–998", "Sinus uchun qo'shish va ikkilangan burchak formulalarini berdi."],
      ["Leonard Eyler", "1707–1783", "Eyler formulasi orqali trigonometriyani kompleks sonlar bilan bog'ladi."]
    ]
  };

  /* ======================= MATEMATIK ANALIZ ASOSLARI ======================= */
  L["Vektorlar"] = {
    n: "Vektor — yo'nalishga ega kesma; u kuch, tezlik, siljish kabi miqdorlarni ifodalaydi. Koordinatalarda a(x; y) ko'rinishida yoziladi. Vektorlarni qo'shish, songa ko'paytirish, uzunligini va skalyar ko'paytmasini topish shu mavzuda o'rganiladi.",
    tu: [
      ["Vektor koordinatalari", "a(x; y) — boshidan oxirigacha x va y bo'yicha siljish."],
      ["Uzunlik (modul)", "|a| = √(x² + y²)."],
      ["Skalyar ko'paytma", "a · b = x₁x₂ + y₁y₂ — natijasi son."],
      ["Perpendikulyar vektorlar", "a · b = 0."]
    ],
    q: [
      "a + b = (x₁ + x₂; y₁ + y₂)",
      "k · a = (kx; ky)",
      "|a| = √(x² + y²)",
      "a · b = x₁x₂ + y₁y₂ = |a|·|b|·cos φ"
    ],
    m: [
      { s: "a(−7; −6) va b(−1; 1) vektorlarning skalyar ko'paytmasini toping.", y: ["(−7)(−1) + (−6)(1)", "= 7 − 6 = 1."], j: "1" },
      { s: "a(3; 12) vektorning uzunligini toping.", y: ["√(9 + 144) = √153 ≈ 12,369."], j: "√153 ≈ 12,369" }
    ],
    x: ["Skalyar ko'paytmani vektor deb yozish (u son!).", "Uzunlikda ildiz olishni unutish."],
    h: "Kuchlarni parallelogramm qoidasi bilan qo'shishni Simon Stevin va Nyuton qo'llagan. Vektorlar algebrasi XIX asrda shakllandi: Uilyam Gamilton 1843-yilda kvaternionlarni, German Grassman 1844-yilda ko'p o'lchamli fazolar nazariyasini yaratdi. 1880-yillarda Jozaya Gibbs va Oliver Xevisayd bugungi vektor hisobini ishlab chiqdi.",
    o: [
      ["Uilyam Rouen Gamilton", "1805–1865", "Kvaternionlarni kashf etdi; \"vektor\" atamasini kiritdi."],
      ["German Grassman", "1809–1877", "Ko'p o'lchamli vektor fazolari g'oyasini yaratdi."],
      ["Jozaya Uillard Gibbs", "1839–1903", "Zamonaviy vektor hisobini ishlab chiqdi."]
    ]
  };

  L["Matritsalar"] = {
    n: "Matritsa — sonlarning to'g'ri to'rtburchakli jadvali. 2×2 matritsaning determinanti uning muhim soni: u tenglamalar sistemasi yagona yechimga egami yoki yo'qligini ko'rsatadi va Kramer qoidasida ishlatiladi.",
    tu: [
      ["Matritsa", "m qator va n ustundan iborat sonlar jadvali."],
      ["Determinant", "Kvadrat matritsaga mos keluvchi son: |a b; c d| = ad − bc."],
      ["Xos bo'lmagan matritsa", "Determinanti nolga teng bo'lmagan matritsa — teskarisi mavjud."]
    ],
    q: [
      "|a  b; c  d| = a·d − b·c",
      "Δ ≠ 0  ⇔  sistema yagona yechimga ega",
      "Kramer: x = Δx/Δ,  y = Δy/Δ",
      "Matritsalarni ko'paytirish: qator × ustun"
    ],
    m: [
      { s: "|3  7; 5  0| determinantni hisoblang.", y: ["3·0 − 7·5", "= 0 − 35 = −35."], j: "−35" },
      { s: "|−1  −3; −2  9| determinantni hisoblang.", y: ["(−1)·9 − (−3)·(−2)", "= −9 − 6 = −15."], j: "−15" }
    ],
    x: ["ad − bc o'rniga ab − cd yoki ad + bc hisoblash.", "Ishoralarni manfiy sonlarda yo'qotish."],
    h: "Determinant g'oyasi 1683-yilda yapon matematigi Seki Takakadzu va 1693-yilda Leybnits tomonidan mustaqil ravishda topilgan. 1750-yilda Kramer o'z qoidasini e'lon qildi. \"Matritsa\" atamasini 1850-yilda Jeyms Silvestr kiritgan, Artur Keli esa 1858-yilda matritsalar algebrasini yaratdi. Bugun matritsalar kompyuter grafikasi va sun'iy intellektning asosiy vositasi.",
    o: [
      ["Seki Takakadzu", "~1642–1708", "Determinantlarni birinchilardan bo'lib qo'llagan (1683)."],
      ["Gotfrid Leybnits", "1646–1716", "Yevropada determinant g'oyasini ilgari surgan."],
      ["Jeyms Silvestr", "1814–1897", "\"Matritsa\" atamasini kiritdi."],
      ["Artur Keli", "1821–1895", "Matritsalar algebrasini yaratdi (1858)."]
    ]
  };

  L["Ehtimollik va kombinatorikalar"] = {
    n: "Kombinatorika \"nechta usulda?\" degan savolga javob beradi: tartiblash, tanlash, joylashtirish. Ehtimollik esa tasodifiy hodisa ro'y berish imkoniyatini 0 dan 1 gacha son bilan baholaydi.",
    tu: [
      ["Faktorial", "n! = 1 · 2 · 3 · … · n;  0! = 1."],
      ["O'rin almashtirishlar", "n ta elementni tartiblash usullari soni: Pₙ = n!."],
      ["Kombinatsiyalar", "n tadan k tasini tartibsiz tanlash: C(n, k)."],
      ["Klassik ehtimollik", "P = qulay hollar soni / barcha teng imkoniyatli hollar soni."]
    ],
    q: [
      "n! = n · (n − 1)!",
      "C(n, k) = n! / (k!·(n − k)!)",
      "A(n, k) = n! / (n − k)!  (tartib muhim)",
      "P(A) = m / n,   0 ≤ P(A) ≤ 1",
      "P(A emas) = 1 − P(A)"
    ],
    m: [
      { s: "C(5, 3) ni hisoblang.", y: ["C(5, 3) = 5! / (3!·2!) = 120 / (6·2)", "= 120 / 12 = 10."], j: "10" },
      { s: "Qutida 11 ta shar, 2 tasi qizil. Tasodifan olingan shar qizil bo'lish ehtimoli?", y: ["P = 2/11 ≈ 0,1818."], j: "2/11" }
    ],
    x: ["Tartib muhim bo'lmaganda A o'rniga C ni ishlatmaslik.", "Ehtimollikni 1 dan katta son deb chiqarish."],
    h: "Ehtimollar nazariyasi 1654-yilda Blez Paskal va Per Fermaning qimor o'yinidagi tikishni adolatli bo'lish haqidagi yozishmalarida tug'ildi. Gyuygens 1657-yilda birinchi kitobni yozdi, Yakob Bernulli \"Taxminlar san'ati\" (1713)da katta sonlar qonunini isbotladi. Binomial koeffitsiyentlar jadvalini Paskaldan oldin al-Karajiy, Umar Xayyom va xitoylik Yan Xuy bilgan. 1933-yilda Kolmogorov ehtimollarning aksiomatik asosini yaratdi.",
    o: [
      ["Blez Paskal", "1623–1662", "Ferma bilan ehtimollar nazariyasiga asos soldi; Paskal uchburchagi."],
      ["Per Ferma", "1601–1665", "Ehtimolliklarni kombinatorik hisoblashni rivojlantirdi."],
      ["Yakob Bernulli", "1655–1705", "Katta sonlar qonunini isbotladi."],
      ["Andrey Kolmogorov", "1903–1987", "Ehtimollar nazariyasining aksiomalarini yaratdi (1933)."]
    ]
  };

  /* ======================= CHIZIQLI ALGEBRA ======================= */
  L["Vektorlar va fazo"] = {
    n: "Vektor fazo — vektorlarni qo'shish va songa ko'paytirish mumkin bo'lgan to'plam. Tekislik (2 o'lchamli), fazo (3 o'lchamli) va undan ko'p o'lchamli fazolarda vektorlar bilan amallar, skalyar ko'paytma va uzunliklar o'rganiladi.",
    tu: [
      ["Vektor fazo", "Qo'shish va songa ko'paytirishga nisbatan yopiq to'plam (8 ta aksioma bajariladi)."],
      ["Chiziqli kombinatsiya", "c₁a₁ + c₂a₂ + … + cₙaₙ."],
      ["O'lcham", "Fazoni hosil qiluvchi chiziqli erkli vektorlar soni."],
      ["Ortogonallik", "Skalyar ko'paytma nolga teng: vektorlar perpendikulyar."]
    ],
    q: [
      "a + b = (x₁ + x₂; y₁ + y₂)",
      "a · b = x₁x₂ + y₁y₂ (+ z₁z₂ fazoda)",
      "|a| = √(a · a)",
      "cos φ = (a · b) / (|a|·|b|)"
    ],
    m: [
      { s: "a(−6; 2) va b(−4; −2) skalyar ko'paytmasi?", y: ["(−6)(−4) + 2·(−2) = 24 − 4."], j: "20" },
      { s: "a(−1; −6) va b(−5; 1) bo'lsa, a + b ning abssissasi?", y: ["−1 + (−5) = −6."], j: "−6" }
    ],
    x: ["Vektorlarni qo'shishda koordinatalarni aralashtirish (x ni y ga qo'shish)."],
    h: "Vektor fazoning aksiomatik ta'rifini 1888-yilda italyan matematigi Juzeppe Peano bergan, uning g'oyalari Grassmanning 1844-yilgi asariga asoslangan. XX asrda cheksiz o'lchamli fazolar (Gilbert fazolari) kvant mexanikasining tiliga aylandi.",
    o: [
      ["German Grassman", "1809–1877", "Chiziqli algebra g'oyalarini birinchi bo'lib umumiy shaklda bayon qildi."],
      ["Juzeppe Peano", "1858–1932", "Vektor fazoning aksiomatik ta'rifini berdi (1888)."],
      ["Devid Gilbert", "1862–1943", "Cheksiz o'lchamli fazolar nazariyasini rivojlantirdi."]
    ]
  };

  L["Matritsa almashtirishlari"] = {
    n: "Har bir 2×2 matritsa tekislikning chiziqli almashtirishini beradi: burish, cho'zish, aks ettirish, siljitish (qiyshaytirish). Determinant bu almashtirishda yuzalar necha marta o'zgarishini ko'rsatadi, ishorasi esa yo'nalish saqlanadimi-yo'qmi, shuni bildiradi.",
    tu: [
      ["Chiziqli almashtirish", "To'g'ri chiziqlarni to'g'ri chiziqqa, koordinata boshini o'ziga o'tkazuvchi almashtirish."],
      ["Determinantning ma'nosi", "|det A| — yuzalarning o'zgarish koeffitsiyenti."],
      ["Degenerat almashtirish", "det A = 0: tekislik chiziqqa yoki nuqtaga \"yassilanadi\"."]
    ],
    q: [
      "det |a  b; c  d| = ad − bc",
      "Burish (φ burchakka): |cos φ  −sin φ; sin φ  cos φ|,  det = 1",
      "S' = |det A| · S",
      "det(AB) = det A · det B"
    ],
    m: [
      { s: "|−4  2; −3  3| determinantni hisoblang.", y: ["(−4)·3 − 2·(−3)", "= −12 + 6 = −6."], j: "−6" },
      { s: "|5  5; −4  −4| determinantni hisoblang.", y: ["5·(−4) − 5·(−4) = −20 + 20 = 0.", "Qatorlar proporsional — almashtirish tekislikni chiziqqa yassilaydi."], j: "0" }
    ],
    x: ["Determinant nol bo'lsa ham teskari matritsa bor deb o'ylash."],
    h: "Matritsalarni almashtirishlar sifatida qarash Artur Keli (1858) va keyinchalik Kamil Jordan ishlarida shakllandi. Bugun kompyuter o'yinlari va 3D grafikada har bir burilish, kattalashtirish va proyeksiya matritsalarni ko'paytirish orqali bajariladi.",
    o: [
      ["Artur Keli", "1821–1895", "Matritsalarni ko'paytirishni almashtirishlar kompozitsiyasi sifatida kiritdi."],
      ["Kamil Jordan", "1838–1922", "Matritsalarning Jordan normal shaklini yaratdi."]
    ]
  };

  L["Muqobil koordinata sistemalari (asoslar)"] = {
    n: "Bazis — fazodagi har bir vektorni yagona usulda ifodalashga imkon beruvchi vektorlar to'plami. Standart bazis i(1; 0), j(0; 1) dan boshqa bazis tanlansa, vektor koordinatalari o'zgaradi, lekin vektorning o'zi o'zgarmaydi.",
    tu: [
      ["Bazis", "Chiziqli erkli va butun fazoni hosil qiluvchi vektorlar."],
      ["Koordinatalar", "Vektorni bazis vektorlarning chiziqli kombinatsiyasi sifatida yozgandagi koeffitsiyentlar."],
      ["Ortonormal bazis", "O'zaro perpendikulyar va uzunligi 1 ga teng bazis vektorlari."]
    ],
    q: [
      "v = x·e₁ + y·e₂",
      "Standart bazisda: a(x; y) = x·i + y·j",
      "|a| = √(x² + y²) — faqat ortonormal bazisda",
      "a · b = x₁x₂ + y₁y₂ — ortonormal bazisda"
    ],
    m: [
      { s: "a(6; 8) vektorning uzunligini toping.", y: ["√(36 + 64) = √100 = 10."], j: "10" },
      { s: "a(3; −4) va b(3; −2) skalyar ko'paytmasi?", y: ["3·3 + (−4)(−2) = 9 + 8."], j: "17" }
    ],
    x: ["Ixtiyoriy (ortonormal bo'lmagan) bazisda ham uzunlikni √(x² + y²) bilan hisoblash."],
    h: "Bazis va koordinatalarni almashtirish g'oyasi Grassman va keyinchalik Peano ishlarida aniq shaklga keldi. Fizikada qutb, silindrik va sferik koordinatalar, kristallografiyada qiyshiq bazislar ishlatiladi. Kompyuterda tasvirni siqish (masalan, JPEG) ham ma'lumotni qulay bazisga o'tkazishga asoslangan.",
    o: [
      ["German Grassman", "1809–1877", "Bazis va o'lcham tushunchalarini kiritdi."],
      ["Juzeppe Peano", "1858–1932", "Vektor fazolar va bazislarning qat'iy nazariyasini berdi."]
    ]
  };

  /* ======================= OLIY MATEMATIKA ======================= */
  L["Limitlar"] = {
    n: "Limit — x biror songa yaqinlashganda funksiya qiymati qaysi songa intilishini bildiradi. Uzluksiz funksiyada limit oddiygina f(a) ga teng; 0/0 holatida esa ifodani soddalashtirish kerak. Cheksizlikdagi limitlarda eng katta darajali hadlar hal qiladi.",
    tu: [
      ["Limit", "lim(x→a) f(x) = L: x a ga yaqinlashganda f(x) L ga yaqinlashadi."],
      ["Uzluksizlik", "lim(x→a) f(x) = f(a)."],
      ["Aniqmaslik", "0/0, ∞/∞ — to'g'ridan-to'g'ri qo'yib bo'lmaydigan holatlar."]
    ],
    q: [
      "Ko'phad uchun: lim(x→a) P(x) = P(a)",
      "lim(x→a) (x² − a²)/(x − a) = lim(x→a) (x + a) = 2a",
      "lim(x→∞) (px² + …)/(qx² + …) = p/q",
      "lim(x→0) sin x / x = 1"
    ],
    m: [
      { s: "lim(x→4) (x² − 16)/(x − 4) ni hisoblang.", y: ["x = 4 da 0/0.", "x² − 16 = (x − 4)(x + 4) ⇒ qisqartiramiz: x + 4.", "4 + 4 = 8."], j: "8" },
      { s: "lim(x→∞) (3x² + 3x)/(3x² − 1) ni hisoblang.", y: ["Eng katta darajali hadlar koeffitsiyentlari nisbati: 3/3."], j: "1" }
    ],
    x: ["0/0 ni 0 yoki 1 deb yozish.", "Cheksizlikda kichik darajali hadlar ham ta'sir qiladi deb o'ylash."],
    h: "Zenonning paradokslari (mil. av. V asr) cheksiz bo'linish muammosini qo'ygan edi. Arximed \"tugatish usuli\" bilan limit g'oyasiga juda yaqinlashgan. Nyuton va Leybnits cheksiz kichik miqdorlar bilan ishlagan, ammo ularni qat'iy asoslay olmagan. 1821-yilda Koshi limit tushunchasini analizning asosi qildi, Veyershtrass esa ε–δ ta'rifini berdi.",
    o: [
      ["Arximed", "mil. av. 287–212", "Tugatish usuli — limit g'oyasining ilk ko'rinishi."],
      ["Ogyusten Lui Koshi", "1789–1857", "\"Analiz kursi\" (1821)da limitlarni analiz asosiga qo'ydi."],
      ["Karl Veyershtrass", "1815–1897", "Limitning qat'iy ε–δ ta'rifini berdi."]
    ]
  };

  L["Hosila"] = {
    n: "Hosila — funksiyaning o'zgarish tezligi: grafikka urinmaning burchak koeffitsiyenti. Fizikada tezlik — yo'lning hosilasi, iqtisodda chegaraviy xarajat — xarajatning hosilasi. Mavzuda asosiy hosila formulalari va hosilaning nuqtadagi qiymatini topish o'rganiladi.",
    tu: [
      ["Hosila", "f′(x) = lim(Δx→0) (f(x + Δx) − f(x)) / Δx."],
      ["Geometrik ma'no", "f′(a) — x = a nuqtada urinmaning qiyaligi."],
      ["Fizik ma'no", "Yo'lning vaqt bo'yicha hosilasi — tezlik."]
    ],
    q: [
      "(xⁿ)′ = n·xⁿ⁻¹;   (c)′ = 0;   (kx)′ = k",
      "(u ± v)′ = u′ ± v′;   (c·u)′ = c·u′",
      "(u·v)′ = u′v + uv′;   (u/v)′ = (u′v − uv′)/v²",
      "(sin x)′ = cos x;   (cos x)′ = −sin x;   (eˣ)′ = eˣ"
    ],
    m: [
      { s: "f(x) = 2x³ + 5x² − 2x + 1 bo'lsa, f′(−3) ni toping.", y: ["f′(x) = 6x² + 10x − 2.", "f′(−3) = 6·9 + 10·(−3) − 2 = 54 − 30 − 2."], j: "22" },
      { s: "f(x) = x³ + 5x² − x + 2 bo'lsa, f′(−1)?", y: ["f′(x) = 3x² + 10x − 1.", "3 − 10 − 1 = −8."], j: "−8" }
    ],
    x: ["(x³)′ = 3x³ deb yozish (daraja bittaga kamayishi kerak).", "O'zgarmas sonning hosilasini nol qilishni unutish."],
    h: "Hosilani XVII asrda bir-biridan mustaqil ravishda Isaak Nyuton (\"flyuksiyalar\", 1660-yillar) va Gotfrid Leybnits (1684-yilda nashr etgan) kashf etdi. Ular o'rtasida kim birinchi ekani haqida uzoq bahs bo'lgan. dy/dx yozuvi Leybnitsga, f′(x) yozuvi esa Lagranjga tegishli. Ferma bundan oldinroq urinma va ekstremumlarni topish usulini qo'llagan.",
    o: [
      ["Isaak Nyuton", "1643–1727", "Flyuksiyalar usulini yaratdi — differensial hisobning asoschilaridan."],
      ["Gotfrid Leybnits", "1646–1716", "Differensial hisobni nashr etdi; dy/dx belgisini kiritdi."],
      ["Jozef Lui Lagranj", "1736–1813", "f′(x) belgisini joriy qildi."],
      ["Per Ferma", "1601–1665", "Urinma va ekstremumlarni topishning dastlabki usulini yaratdi."]
    ]
  };

  L["Integral"] = {
    n: "Aniq integral — egri chiziq ostidagi yuza. Uni hisoblash uchun boshlang'ich funksiya topiladi va Nyuton–Leybnits formulasi qo'llanadi. Integral yuza, hajm, bajarilgan ish va bosib o'tilgan yo'lni hisoblashda ishlatiladi.",
    tu: [
      ["Boshlang'ich funksiya", "F′(x) = f(x) bo'ladigan F(x)."],
      ["Aniqmas integral", "∫f(x)dx = F(x) + C."],
      ["Aniq integral", "∫ₐᵇ f(x)dx = F(b) − F(a)."]
    ],
    q: [
      "∫xⁿ dx = xⁿ⁺¹/(n + 1) + C  (n ≠ −1)",
      "∫k dx = kx + C",
      "∫ₐᵇ f(x)dx = F(b) − F(a)   (Nyuton–Leybnits)",
      "∫₀ᵇ (kx + m) dx = k·b²/2 + m·b"
    ],
    m: [
      { s: "∫₀³ (4x + 1) dx ni hisoblang.", y: ["Boshlang'ich: F(x) = 2x² + x.", "F(3) − F(0) = (18 + 3) − 0."], j: "21" },
      { s: "∫₀⁴ 8x dx ni hisoblang.", y: ["F(x) = 4x².", "F(4) − F(0) = 64."], j: "64" }
    ],
    x: ["Boshlang'ich funksiyada darajani oshirib, unga bo'lishni unutish.", "F(b) − F(a) o'rniga F(a) − F(b) olish."],
    h: "Arximed parabola segmentining yuzini \"tugatish usuli\" bilan topgan — bu integralning ilk ko'rinishi. Kavaleri va Ferma XVII asrda yuzalarni hisoblash usullarini rivojlantirdi. Leybnits 1675-yilda ∫ belgisini (lotincha summa so'zining birinchi harfi S ni cho'zib) kiritdi. Nyuton va Leybnits integral va hosila o'zaro teskari amallar ekanini kashf etdi. Riman 1854-yilda integralning qat'iy ta'rifini berdi.",
    o: [
      ["Arximed", "mil. av. 287–212", "Parabola segmenti yuzini hisobladi."],
      ["Gotfrid Leybnits", "1646–1716", "∫ belgisini kiritdi (1675)."],
      ["Isaak Nyuton", "1643–1727", "Integral va hosila orasidagi bog'lanishni kashf etdi."],
      ["Bernxard Riman", "1826–1866", "Integralning qat'iy ta'rifini berdi (1854)."]
    ]
  };

  L["Funksiyani tekshirish"] = {
    n: "Funksiyani hosila yordamida tekshirish: nollarini, o'sish va kamayish oraliqlarini, maksimum va minimum nuqtalarini topish. Bu natijalar asosida grafik chiziladi va optimallash masalalari (eng katta foyda, eng kam xarajat) yechiladi.",
    tu: [
      ["Funksiya nollari", "f(x) = 0 bo'lgan nuqtalar."],
      ["Kritik nuqta", "f′(x) = 0 yoki f′ mavjud bo'lmagan nuqta."],
      ["O'sish/kamayish", "f′(x) > 0 — o'sadi, f′(x) < 0 — kamayadi."],
      ["Ekstremum", "Hosila ishorasi +dan −ga o'zgarsa — maksimum, −dan +ga — minimum."]
    ],
    q: [
      "1) D(f);  2) f(x) = 0;  3) f′(x);  4) f′(x) = 0;  5) ishoralar jadvali;  6) grafik",
      "(xⁿ)′ = n·xⁿ⁻¹",
      "Kvadrat funksiya y = ax² + bx + c ekstremumi: x₀ = −b/2a",
      "x² − a² = 0 ⇒ x = ±a"
    ],
    m: [
      { s: "f(x) = x² − 16 funksiyaning nollarini toping.", y: ["x² = 16.", "x = 4 yoki x = −4."], j: "x = −4; x = 4" },
      { s: "f(x) = −3x³ + x + 5 bo'lsa, f′(1)?", y: ["f′(x) = −9x² + 1.", "f′(1) = −9 + 1 = −8."], j: "−8" }
    ],
    x: ["x² = 16 dan faqat x = 4 ni yozish.", "f′(x) = 0 bo'lgan har bir nuqtani albatta ekstremum deb hisoblash (masalan, y = x³ da x = 0 ekstremum emas)."],
    h: "Per Ferma XVII asrda maksimum va minimumlarni topish usulini yaratgan (hozirgi f′(x) = 0 sharti). 1696-yilda Lopital birinchi differensial hisob darsligini nashr etdi. Funksiyani hosila orqali to'liq tekshirish sxemasi XVIII–XIX asrlarda Eyler, Lagranj va Koshi asarlarida shakllandi.",
    o: [
      ["Per Ferma", "1601–1665", "Ekstremumlarni topish usulini yaratdi."],
      ["Giyom de Lopital", "1661–1704", "Birinchi differensial hisob darsligini yozdi (1696)."],
      ["Jozef Lui Lagranj", "1736–1813", "O'rta qiymat teoremasi va optimallash usullarini rivojlantirdi."]
    ]
  };

  // ref — boshqa mavzu bilan bir xil dars
  Object.keys(L).forEach(function (k) { if (L[k].ref && L[L[k].ref]) L[k] = L[L[k].ref]; });
  window.kaNPDars = L;
})();
