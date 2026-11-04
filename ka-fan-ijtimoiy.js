/*! Kuvonch Academy — viktorina: Biologiya, Geografiya, Tarix, Ona tili savollari
 *  b1–b3 Biologiya · g1–g3 Geografiya · h1–h3 Tarix · o1–o3 Ona tili
 *  Har bir mavzu: daraja bo'yicha savollar banki + protsedura (ro'yxatdan) generatorlar.
 *  Banki elementi: [daraja(1-3), savol, javob, [noto'g'ri variantlar], "qisqa izoh"] */
(function () {
  "use strict";
  var S = window.kaSavol; if (!S) return;
  var H = S.H, R = H.R, pick = H.pick, shuffle = H.shuffle;

  /* ---------- yordamchilar ---------- */
  function Q(q, a, w, steps) {
    a = String(a);
    var seenW = {}, ws = [];
    seenW[a.toLowerCase()] = 1;
    (w || []).forEach(function (x) { x = String(x); var k = x.toLowerCase(); if (!seenW[k] && x !== "") { seenW[k] = 1; ws.push(x); } });
    return { q: q, a: a, w: ws, steps: steps || [], lang: S.lang() };
  }
  var REC = {};
  function seen(id, q) { return (REC[id] || []).indexOf(q) > -1; }
  function remember(id, q) { var r = REC[id] || (REC[id] = []); r.push(q); if (r.length > 24) r.shift(); }
  // L darajadagi elementlar (bo'lmasa — eng yaqin daraja)
  function lvPool(items, L) {
    for (var d = 0; d < 3; d++) {
      var o = items.filter(function (it) { return Math.abs(it[0] - L) === d; });
      if (o.length) return o;
    }
    return items;
  }
  function fromBank(id, items, L) {
    var pool = lvPool(items, L), fr = pool.filter(function (it) { return !seen(id, it[1]); });
    var it = pick(fr.length ? fr : pool);
    return Q(it[1], it[2], shuffle(it[3]), it[4] ? [it[4]] : []);
  }
  // ro'yxatdan n ta tasodifiy element (a dan farqli)
  function others(list, a, n) {
    return shuffle(list.filter(function (x) { return x !== a; })).slice(0, n);
  }
  // gens: [{p: ehtimol, fn: function(L){ return Q(...) | null }}, ...]
  function topic(id, title, items, gens) {
    S.register(id, function (L) {
      L = L === 2 || L === 3 ? L : 1;
      var p = null, t = 0;
      do {
        p = null;
        var r = Math.random(), acc = 0;
        for (var i = 0; gens && i < gens.length; i++) {
          acc += gens[i].p;
          if (r < acc) { p = gens[i].fn(L); break; }
        }
        if (!p) p = fromBank(id, items, L);
      } while (seen(id, p.q) && ++t < 15);
      remember(id, p.q);
      return p;
    }, title);
  }
  function lv(L, a, b, c) { return L === 1 ? a : L === 2 ? b : c; }

  /* ================= b1 Biologiya · Hujayra va tirik organizmlar ================= */
  var B1 = [
    [1, "Hujayraning \"energiya stansiyasi\" deb qaysi organoid ataladi?", "Mitoxondriya", ["Ribosoma", "Vakuola", "Yadro", "Xloroplast"], "Mitoxondriyada oziq moddalar parchalanib, energiya hosil bo'ladi."],
    [1, "O'simlik hujayrasida fotosintez qaysi organoidda boradi?", "Xloroplast", ["Mitoxondriya", "Ribosoma", "Yadro", "Vakuola"], "Xloroplastda yashil pigment — xlorofill bor."],
    [1, "Hujayrada irsiy axborot asosan qayerda saqlanadi?", "Yadroda", ["Vakuolada", "Hujayra po'stida", "Xloroplastda"], "Yadroda xromosomalar (DNK) joylashgan."],
    [1, "Hujayrani birinchi bo'lib mikroskopda kuzatib, \"hujayra\" deb atagan olim kim?", "Robert Guk", ["Charlz Darvin", "Gregor Mendel", "Lui Paster"], "Robert Guk 1665-yilda po'kak kesmasini mikroskopda kuzatgan."],
    [1, "Fotosintez jarayonida o'simlik havoga qaysi gazni chiqaradi?", "Kislorod", ["Karbonat angidrid", "Azot", "Vodorod"], "Fotosintezda karbonat angidrid va suvdan glyukoza hosil bo'lib, kislorod ajraladi."],
    [1, "Fotosintez uchun o'simlik havodan qaysi gazni yutadi?", "Karbonat angidrid", ["Kislorod", "Azot", "Geliy"], "O'simlik CO₂ ni yutib, undan organik modda hosil qiladi."],
    [1, "Penitsillinni kim kashf etgan?", "Aleksandr Fleming", ["Lui Paster", "Robert Guk", "Charlz Darvin"], "Aleksandr Fleming penitsillinni 1928-yilda kashf etgan."],
    [1, "Tirik organizmlarning eng kichik tuzilish va hayot birligi nima?", "Hujayra", ["To'qima", "Organ", "Molekula"], "Barcha tirik organizmlar hujayralardan tuzilgan."],
    [1, "Qaysi organoid faqat o'simlik hujayrasida bo'ladi?", "Xloroplast", ["Yadro", "Mitoxondriya", "Ribosoma"], "Yadro, mitoxondriya va ribosoma hayvon hujayrasida ham bor."],
    [1, "Fotosintez uchun qaysi energiya manbai zarur?", "Quyosh nuri", ["Shamol", "Tuproq issiqligi", "Oy nuri"], "Fotosintez faqat yorug'likda boradi."],
    [1, "Hujayrani o'rab turuvchi va moddalar o'tishini boshqaruvchi qism nima?", "Hujayra membranasi", ["Yadro", "Vakuola", "Xloroplast"], "Membrana hujayraga kerakli moddalarni o'tkazadi."],
    [1, "Evolyutsiya nazariyasi asoschisi, \"Turlarning kelib chiqishi\" asari muallifi kim?", "Charlz Darvin", ["Gregor Mendel", "Robert Guk", "Aleksandr Fleming"], "Darvin bu asarni 1859-yilda nashr ettirgan."],
    [1, "O'simliklarga yashil rang beruvchi pigment qaysi?", "Xlorofill", ["Gemoglobin", "Melanin", "Karotin"], "Xlorofill xloroplastlarda joylashgan."],
    [1, "Hujayrani kattalashtirib ko'rish uchun qaysi asbobdan foydalaniladi?", "Mikroskop", ["Teleskop", "Barometr", "Termometr"], "Mikroskop mayda obyektlarni ko'p marta kattalashtiradi."],
    [2, "Hujayrada oqsil sintezi qaysi organoidda boradi?", "Ribosoma", ["Lizosoma", "Vakuola", "Xloroplast"], "Ribosomalarda aminokislotalardan oqsil yig'iladi."],
    [2, "Odamning tana (somatik) hujayralarida nechta xromosoma bor?", "46", ["23", "44", "48"], "Odamda 23 juft — 46 ta xromosoma bor."],
    [2, "Odamning jinsiy hujayralarida nechta xromosoma bor?", "23", ["46", "22", "92"], "Jinsiy hujayralarda xromosomalar soni ikki marta kam — 23 ta."],
    [2, "Shakllangan yadrosi bo'lmagan organizmlar qanday ataladi?", "Prokariotlar", ["Eukariotlar", "Viruslar", "Zamburug'lar"], "Bakteriyalar — prokariotlar: ularda shakllangan yadro yo'q."],
    [2, "Quyidagilardan qaysi biri prokariot organizm?", "Bakteriya", ["Achitqi zamburug'i", "Amyoba", "Xlorella"], "Bakteriya hujayrasida shakllangan yadro bo'lmaydi."],
    [2, "Hujayraviy tuzilishga ega bo'lmagan hayot shakli qaysi?", "Virus", ["Bakteriya", "Zamburug'", "Suvo'ti"], "Viruslar faqat tirik hujayra ichida ko'payadi."],
    [2, "Irsiyat qonunlarini no'xat ustida tajriba o'tkazib kashf etgan olim kim?", "Gregor Mendel", ["Charlz Darvin", "Lui Paster", "Robert Guk"], "Mendel — genetika fanining asoschisi."],
    [2, "Quturishga qarshi vaksina yaratgan fransuz olimi kim?", "Lui Paster", ["Aleksandr Fleming", "Gregor Mendel", "Robert Guk"], "Lui Paster — mikrobiologiya asoschilaridan biri."],
    [2, "O'simlik hujayrasida hujayra shirasi to'plangan bo'shliq nima deb ataladi?", "Vakuola", ["Yadro", "Ribosoma", "Mitoxondriya"], "Vakuolada suv va unda erigan moddalar to'planadi."],
    [2, "Nafas olish jarayonida hujayradan qaysi gaz ajralib chiqadi?", "Karbonat angidrid", ["Kislorod", "Azot", "Vodorod"], "Glyukoza kislorod ishtirokida parchalanib, CO₂, suv va energiya hosil bo'ladi."],
    [2, "Fotosintez natijasida qaysi organik modda hosil bo'ladi?", "Glyukoza", ["Oqsil", "Mochevina", "Gemoglobin"], "6CO₂ + 6H₂O → glyukoza + 6O₂ (yorug'likda)."],
    [2, "Irsiy axborotni saqlovchi molekula qisqacha qanday ataladi?", "DNK", ["ATF", "Glyukoza", "Gemoglobin"], "DNK — dezoksiribonuklein kislota."],
    [2, "Qo'ziqorinlar qaysi dunyoga kiradi?", "Zamburug'lar", ["O'simliklar", "Hayvonlar", "Bakteriyalar"], "Zamburug'lar alohida dunyo hisoblanadi."],
    [2, "Faqat bitta hujayradan iborat organizm qaysi?", "Amyoba", ["Qurbaqa", "Qayin", "Chumoli"], "Amyoba — bir hujayrali organizm."],
    [2, "Mendel tajribalarida qaysi o'simlikdan foydalangan?", "No'xat", ["Bug'doy", "Makkajo'xori", "Kartoshka"], "Mendel no'xatning belgilari irsiylanishini o'rgangan."],
    [2, "Antibiotiklar asosan qaysi kasallik qo'zg'atuvchilariga qarshi ishlatiladi?", "Bakteriyalarga", ["Viruslarga", "Allergiyaga", "Vitamin yetishmasligiga"], "Antibiotiklar viruslarga ta'sir qilmaydi."],
    [3, "DNK molekulasi qanday tuzilishga ega?", "Qo'sh spiral", ["Bir zanjirli halqa", "Uch zanjirli spiral", "Tekis qatlam"], "Uotson va Krik 1953-yilda DNKning qo'sh spiral tuzilishini aniqlagan."],
    [3, "Qaysi azotli asos DNK tarkibida bo'lmaydi?", "Uratsil", ["Adenin", "Timin", "Guanin", "Sitozin"], "Uratsil RNKda bo'ladi, DNKda uning o'rnida timin."],
    [3, "Komplementarlik qoidasiga ko'ra DNKda adenin qaysi asos bilan juftlashadi?", "Timin", ["Guanin", "Sitozin", "Uratsil"], "DNKda A — T, G — S juftlashadi."],
    [3, "DNKda guanin qaysi asos bilan juftlashadi?", "Sitozin", ["Adenin", "Timin", "Uratsil"], "DNKda A — T, G — S juftlashadi."],
    [3, "Tana hujayralari qaysi usulda bo'linadi (xromosomalar soni saqlanadi)?", "Mitoz", ["Meyoz", "Kurtaklanish", "Konyugatsiya"], "Mitozda yangi hujayralar ona hujayradagi kabi xromosomaga ega bo'ladi."],
    [3, "Jinsiy hujayralar qaysi bo'linish natijasida hosil bo'ladi?", "Meyoz", ["Mitoz", "Amitoz", "Kurtaklanish"], "Meyozda xromosomalar soni ikki marta kamayadi."],
    [3, "Fotosintezda ajraladigan kislorod qaysi moddaning parchalanishidan hosil bo'ladi?", "Suv", ["Karbonat angidrid", "Glyukoza", "Xlorofill"], "Yorug'lik bosqichida suv parchalanadi (fotoliz) va O₂ ajraladi."],
    [3, "Hujayrada moddalarni parchalovchi fermentlarga boy organoid qaysi?", "Lizosoma", ["Ribosoma", "Xloroplast", "Hujayra markazi"], "Lizosoma — hujayraning \"hazm qilish\" organoidi."],
    [3, "Oqsillarning monomerlari nima?", "Aminokislotalar", ["Nukleotidlar", "Glyukoza", "Yog' kislotalari"], "Oqsil molekulasi aminokislotalardan tuzilgan."],
    [3, "DNK va RNKning monomerlari nima?", "Nukleotidlar", ["Aminokislotalar", "Glyukoza", "Glitserin"], "Nuklein kislotalar nukleotidlardan tuzilgan."],
    [3, "Odamda erkak jinsini belgilovchi jinsiy xromosomalar qaysi?", "XY", ["XX", "YY", "XO"], "Ayollarda XX, erkaklarda XY jinsiy xromosomalar."],
    [3, "Hujayraning tuzilishi va faoliyatini o'rganuvchi fan qaysi?", "Sitologiya", ["Genetika", "Ekologiya", "Anatomiya"], "Sitologiya — hujayra haqidagi fan."],
    [3, "Irsiyat va o'zgaruvchanlikni o'rganuvchi fan qaysi?", "Genetika", ["Sitologiya", "Botanika", "Ekologiya"], "Genetika asoslarini Gregor Mendel yaratgan."],
    [3, "Glyukozaning kislorodsiz parchalanish bosqichi nima deb ataladi?", "Glikoliz", ["Fotoliz", "Fotosintez", "Transkripsiya"], "Glikoliz sitoplazmada kislorodsiz boradi."],
    [3, "DNKdagi axborotning RNKga ko'chirilishi nima deb ataladi?", "Transkripsiya", ["Translyatsiya", "Replikatsiya", "Mutatsiya"], "Transkripsiya — DNK asosida RNK sintezi."]
  ];
  topic("b1", "Biologiya · Hujayra va tirik organizmlar", B1);

  /* ================= b2 Biologiya · Odam anatomiyasi va salomatlik ================= */
  var B2 = [
    [1, "Katta yoshli odam skeletida nechta suyak bor?", "206", ["106", "300", "186", "256"], "Chaqaloqda suyaklar ko'proq, o'sgan sari ba'zilari qo'shilib ketadi."],
    [1, "Odam tanasidagi eng uzun suyak qaysi?", "Son suyagi", ["Yelka suyagi", "Katta boldir suyagi", "Umurtqa pog'onasi"], "Son suyagi — odam skeletidagi eng uzun va mustahkam suyak."],
    [1, "Odam yuragi necha kamerali?", "4", ["2", "3", "5"], "Yurak 2 ta bo'lmacha va 2 ta qorinchadan iborat."],
    [1, "Qonda kislorodni qaysi hujayralar tashiydi?", "Eritrotsitlar", ["Leykotsitlar", "Trombotsitlar", "Neyronlar"], "Eritrotsitlardagi gemoglobin kislorodni biriktiradi."],
    [1, "Organizmni mikroblardan himoya qiluvchi qon hujayralari qaysi?", "Leykotsitlar", ["Eritrotsitlar", "Trombotsitlar", "Neyronlar"], "Leykotsitlar — oq qon tanachalari."],
    [1, "Qonning ivishida qaysi qon hujayralari qatnashadi?", "Trombotsitlar", ["Eritrotsitlar", "Leykotsitlar", "Neyronlar"], "Trombotsitlar jarohatdan qon oqishini to'xtatadi."],
    [1, "C vitamini yetishmasa qaysi kasallik kelib chiqadi?", "Singa (tsinga)", ["Raxit", "Shabko'rlik", "Beri-beri"], "C vitamini limon, na'matak, sabzavotlarda ko'p."],
    [1, "Bolalarda D vitamini yetishmasa qaysi kasallik rivojlanadi?", "Raxit", ["Singa (tsinga)", "Shabko'rlik", "Kamqonlik"], "D vitamini suyaklarning to'g'ri o'sishi uchun zarur."],
    [1, "Odam qaysi organ yordamida nafas oladi?", "O'pka", ["Jigar", "Buyrak", "Oshqozon"], "O'pkada qon kislorod bilan to'yinadi."],
    [1, "Qonni butun tana bo'ylab haydovchi organ qaysi?", "Yurak", ["O'pka", "Jigar", "Buyrak"], "Yurak to'xtovsiz qisqarib, qonni tomirlarga haydaydi."],
    [1, "Qonni tozalab, siydik hosil qiluvchi organ qaysi?", "Buyrak", ["Jigar", "O'pka", "Taloq"], "Buyraklar qondan ortiqcha suv va zararli moddalarni chiqaradi."],
    [1, "Odam tanasidagi eng katta organ qaysi?", "Teri", ["Jigar", "O'pka", "Bosh miya"], "Teri butun tanani qoplab, uni himoya qiladi."],
    [1, "Ta'mni qaysi sezgi organi orqali bilamiz?", "Til", ["Burun", "Quloq", "Teri"], "Tilda ta'm bilish so'rg'ichlari bor."],
    [1, "Sog'lom odam tanasining me'yoriy harorati taxminan qancha?", "36,6 °C", ["34,5 °C", "38,5 °C", "40 °C"], "37 °C dan yuqori harorat ko'pincha kasallik belgisi."],
    [1, "Katta yoshli odamda nechta doimiy tish bo'ladi?", "32", ["20", "28", "36"], "Bolalarda 20 ta sut tishi bo'ladi."],
    [1, "Tez tibbiy yordamni chaqirish uchun O'zbekistonda qaysi raqam teriladi?", "103", ["101", "102", "104"], "101 — yong'in, 102 — militsiya, 103 — tez yordam, 104 — gaz xizmati."],
    [1, "Odamda nechta qon guruhi ajratiladi (AB0 tizimi)?", "4", ["2", "3", "6"], "I (0), II (A), III (B), IV (AB) guruhlar."],
    [2, "Ovqat hazm qilish qaysi bo'limda boshlanadi?", "Og'iz bo'shlig'ida", ["Oshqozonda", "Ingichka ichakda", "Yo'g'on ichakda"], "Og'izda ovqat chaynaladi va so'lak bilan namlanadi."],
    [2, "Oziq moddalar qonga asosan qayerda so'riladi?", "Ingichka ichakda", ["Oshqozonda", "Qizilo'ngachda", "Og'iz bo'shlig'ida"], "Ingichka ichak devoridagi so'rg'ichlar moddalarni so'radi."],
    [2, "O't suyuqligi (safro) qaysi organda ishlab chiqariladi?", "Jigarda", ["Oshqozonda", "Buyrakda", "Taloqda"], "O't suyuqligi o't pufagida to'planadi va yog'larni hazm qilishga yordam beradi."],
    [2, "Insulin gormoni qaysi bezda ishlab chiqariladi?", "Oshqozon osti bezida", ["Qalqonsimon bezda", "Jigarda", "Buyrak usti bezida"], "Insulin qondagi glyukoza miqdorini kamaytiradi."],
    [2, "Insulin yetishmasligidan qaysi kasallik kelib chiqadi?", "Qandli diabet", ["Raxit", "Buqoq", "Singa (tsinga)"], "Qandli diabetda qondagi glyukoza miqdori oshib ketadi."],
    [2, "Ovqatda yod yetishmasa qaysi bez kattalashadi (buqoq)?", "Qalqonsimon bez", ["Oshqozon osti bezi", "So'lak bezi", "Ter bezi"], "Qalqonsimon bez gormonlari tarkibida yod bor."],
    [2, "Eritrotsitlarga qizil rang beruvchi modda qaysi?", "Gemoglobin", ["Xlorofill", "Melanin", "Insulin"], "Gemoglobin tarkibida temir bor."],
    [2, "Gemoglobin tarkibiga qaysi kimyoviy element kiradi?", "Temir", ["Kalsiy", "Yod", "Natriy"], "Temir yetishmasa, kamqonlik (anemiya) rivojlanadi."],
    [2, "Qonni yurakdan organlarga olib boruvchi tomirlar qanday ataladi?", "Arteriyalar", ["Venalar", "Kapillyarlar", "Limfa tomirlari"], "Venalar qonni yurakka qaytaradi."],
    [2, "Odam tanasidagi eng katta arteriya qaysi?", "Aorta", ["O'pka venasi", "Kovak vena", "Uyqu arteriyasi"], "Aorta yurakning chap qorinchasidan chiqadi."],
    [2, "Nerv sistemasining asosiy hujayrasi qanday ataladi?", "Neyron", ["Eritrotsit", "Nefron", "Alveola"], "Neyronlar nerv impulslarini o'tkazadi."],
    [2, "Harakatlar muvozanati va uyg'unligini boshqaruvchi miya qismi qaysi?", "Miyacha", ["Uzunchoq miya", "Orqa miya", "Oraliq miya"], "Miyacha shikastlansa, harakat muvozanati buziladi."],
    [2, "Muvozanat sezgisi organi qaysi sezgi organi tarkibida joylashgan?", "Quloq", ["Ko'z", "Burun", "Til"], "Ichki quloqda muvozanat a'zosi joylashgan."],
    [2, "O'rta quloqda nechta eshitish suyakchasi bor?", "3", ["2", "4", "6"], "Bolg'acha, sandon va uzangi."],
    [2, "Odam tanasidagi eng kichik suyak qaysi?", "Uzangi", ["Bolg'acha", "To'sh suyagi", "Bilak suyagi"], "Uzangi — o'rta quloqdagi eshitish suyakchasi."],
    [2, "Ko'krak va qorin bo'shlig'ini ajratib turuvchi nafas muskuli qaysi?", "Diafragma", ["Yurak muskuli", "Ikki boshli muskul", "Qovurg'alar"], "Diafragma qisqarganda o'pkaga havo kiradi."],
    [2, "Odamda necha juft qovurg'a bor?", "12", ["10", "14", "8"], "12 juft qovurg'a ko'krak qafasini hosil qiladi."],
    [2, "Qo'l-oyoqdan arteriyadan qon ketganda jgut qayerga qo'yiladi?", "Jarohatdan yuqoriga", ["Jarohatdan pastga", "Jarohatning ustiga", "Bo'yinga"], "Arteriya qoni yurakdan keladi, shuning uchun jgut yaradan yuqoriga qo'yiladi."],
    [2, "Terining ozroq kuygan joyiga birinchi yordam sifatida nima qilinadi?", "Sovuq suvda sovutiladi", ["Moy surtiladi", "Issiq suv quyiladi", "Qattiq ishqalanadi"], "Kuygan joy toza sovuq suv bilan bir necha daqiqa sovutiladi."],
    [3, "Qon guruhlarini kashf etgan olim kim?", "Karl Landshteyner", ["Lui Paster", "Uilyam Garvey", "Ivan Pavlov"], "Landshteyner qon guruhlarini XX asr boshida aniqlagan."],
    [3, "Qon aylanishini birinchi bo'lib ilmiy asoslab bergan ingliz olimi kim?", "Uilyam Garvey", ["Karl Landshteyner", "Edvard Jenner", "Robert Guk"], "Garvey qonning berk doira bo'ylab aylanishini isbotlagan."],
    [3, "Chechakka qarshi birinchi emlashni kim o'tkazgan?", "Edvard Jenner", ["Lui Paster", "Aleksandr Fleming", "Uilyam Garvey"], "Jenner 1796-yilda chechakka qarshi emlash usulini qo'llagan."],
    [3, "Shartli reflekslar haqidagi ta'limot muallifi kim?", "Ivan Pavlov", ["Charlz Darvin", "Edvard Jenner", "Karl Landshteyner"], "Pavlov itlar ustida tajribalar o'tkazgan."],
    [3, "Buyrakning tuzilish va faoliyat birligi nima deb ataladi?", "Nefron", ["Neyron", "Alveola", "Akson"], "Har bir buyrakda juda ko'p nefronlar bor."],
    [3, "O'pkada gaz almashinuvi qaysi tuzilmalarda boradi?", "Alveolalarda", ["Bronxlarda", "Traxeyada", "Hiqildoqda"], "Alveolalar kapillyarlar bilan o'ralgan pufakchalar."],
    [3, "Kichik qon aylanish doirasi yurakning qaysi bo'limidan boshlanadi?", "O'ng qorinchadan", ["Chap qorinchadan", "O'ng bo'lmachadan", "Chap bo'lmachadan"], "Kichik doira: o'ng qorincha → o'pka → chap bo'lmacha."],
    [3, "Katta qon aylanish doirasi yurakning qaysi bo'limidan boshlanadi?", "Chap qorinchadan", ["O'ng qorinchadan", "O'ng bo'lmachadan", "Chap bo'lmachadan"], "Chap qorinchadan aorta orqali qon butun tanaga boradi."],
    [3, "So'lak tarkibidagi ferment qaysi moddani parchalay boshlaydi?", "Kraxmalni", ["Oqsilni", "Yog'ni", "Suvni"], "So'lakdagi amilaza kraxmalni parchalaydi."],
    [3, "Oshqozon shirasi tarkibida qaysi kislota bor?", "Xlorid kislota", ["Sulfat kislota", "Nitrat kislota", "Sirka kislota"], "Xlorid kislota mikroblarni o'ldiradi va fermentlarni faollashtiradi."],
    [3, "Eritrotsitlar qayerda hosil bo'ladi?", "Qizil suyak ko'migida", ["Jigarda", "Yurakda", "Buyrakda"], "Qizil suyak ko'migi — qon hosil qiluvchi organ."],
    [3, "Ko'zning nurni sezuvchi hujayralari qaysi qavatda joylashgan?", "To'r pardada", ["Shox pardada", "Rangdor pardada", "Ko'z gavharida"], "To'r pardada tayoqcha va kolbacha hujayralar bor."],
    [3, "Qon ivishida ishtirok etuvchi vitamin qaysi?", "K vitamini", ["C vitamini", "D vitamini", "A vitamini"], "K vitamini yetishmasa, qon yomon iviydi."],
    [3, "A vitamini yetishmasa qaysi holat kuzatiladi?", "Shabko'rlik", ["Raxit", "Singa (tsinga)", "Buqoq"], "Shabko'rlikda odam qorong'ida yomon ko'radi."],
    [3, "B₁ vitamini yetishmasligidan qaysi kasallik kelib chiqadi?", "Beri-beri", ["Raxit", "Singa (tsinga)", "Shabko'rlik"], "Beri-berida nerv sistemasi zararlanadi."],
    [3, "Qaysi qon guruhi \"universal donor\" hisoblanadi?", "I (0) guruh", ["II (A) guruh", "III (B) guruh", "IV (AB) guruh"], "IV (AB) guruh egasi esa universal retsipiyent hisoblanadi."],
    [3, "Ichki sekretsiya bezlari ishlab chiqaradigan biologik faol moddalar nima deyiladi?", "Gormonlar", ["Fermentlar", "Vitaminlar", "Antitanalar"], "Gormonlar to'g'ridan-to'g'ri qonga chiqariladi."]
  ];
  topic("b2", "Biologiya · Odam anatomiyasi va salomatlik", B2);

  /* ================= b3 Biologiya · O'simliklar va hayvonlar dunyosi ================= */
  var SINF = ["Sutemizuvchilar", "Qushlar", "Sudralib yuruvchilar", "Suvda hamda quruqlikda yashovchilar", "Baliqlar", "Hasharotlar", "O'rgimchaksimonlar"];
  var SINF_Q = ["Sutemizuvchilar", "Qushlar", "Sudralib yuruvchilar", "Amfibiyalar", "Baliqlar", "Hasharotlar", "O'rgimchaksimonlar"];
  // [hayvon, sinf indeksi, daraja] — 1: oddiy, 2–3: ko'pincha adashtiriladigan
  var HAYVON = [
    ["Sigir", 0, 1], ["Ot", 0, 1], ["Tuya", 0, 1], ["Fil", 0, 1], ["Sher", 0, 1], ["Bo'ri", 0, 1], ["Quyon", 0, 1],
    ["Delfin", 0, 2], ["Kit", 0, 2], ["Ko'rshapalak", 0, 2], ["Tyulen", 0, 3], ["Ornitorinx", 0, 3], ["Kenguru", 0, 2],
    ["Burgut", 1, 1], ["Kaptar", 1, 1], ["Chumchuq", 1, 1], ["Tovuq", 1, 1], ["Laylak", 1, 1], ["Pingvin", 1, 2], ["Tuyaqush", 1, 2], ["Kivi", 1, 3],
    ["Toshbaqa", 2, 1], ["Timsoh", 2, 1], ["Kaltakesak", 2, 1], ["Ilon", 2, 1], ["Echkemar", 2, 2], ["Xameleon", 2, 2], ["Bo'g'ma ilon", 2, 2],
    ["Qurbaqa", 3, 1], ["Baqa", 3, 1], ["Salamandra", 3, 3],
    ["Laqqa baliq", 4, 1], ["Zog'ora baliq", 4, 1], ["Akula", 4, 2], ["Dengiz oti", 4, 3], ["Osyotr", 4, 3],
    ["Chumoli", 5, 1], ["Asalari", 5, 1], ["Kapalak", 5, 1], ["Ninachi", 5, 1], ["Chigirtka", 5, 2], ["Pashsha", 5, 1], ["Xonqizi", 5, 2],
    ["O'rgimchak", 6, 1], ["Chayon", 6, 2], ["Kana", 6, 3]
  ];
  function genSinf(L) {
    var pool = HAYVON.filter(function (h) { return h[2] === L; });
    if (!pool.length) pool = HAYVON;
    var h = pick(pool), a = SINF_Q[h[1]];
    return Q("<b>" + h[0] + "</b> hayvonlarning qaysi sinfiga kiradi?", a, others(SINF_Q, a, 4),
      [h[0] + " — " + SINF[h[1]].toLowerCase() + " sinfiga kiradi."]);
  }
  function genSinfTop(L) {
    var ci = R(0, 6), cls = SINF_Q[ci];
    var own = HAYVON.filter(function (h) { return h[1] === ci && (L > 1 || h[2] === 1); });
    var oth = HAYVON.filter(function (h) { return h[1] !== ci && (L > 1 || h[2] === 1); });
    if (!own.length) return null;
    var h = pick(own), w = shuffle(oth).slice(0, 4).map(function (x) { return x[0]; });
    return Q("Qaysi hayvon <b>" + cls.toLowerCase() + "</b> sinfiga kiradi?", h[0], w,
      [h[0] + " — " + SINF[ci].toLowerCase() + " sinfiga kiradi."]);
  }
  var B3 = [
    [1, "Hasharotlarning nechta oyog'i bor?", "6", ["4", "8", "10"], "Hasharotlarda 3 juft — 6 ta oyoq bo'ladi."],
    [1, "O'rgimchakning nechta oyog'i bor?", "8", ["6", "10", "4"], "O'rgimchaksimonlarda 4 juft — 8 ta oyoq bo'ladi."],
    [1, "O'simlik tuproqdan suv va mineral moddalarni qaysi organi orqali so'radi?", "Ildiz", ["Barg", "Gul", "Meva"], "Ildiz o'simlikni tuproqqa mahkamlaydi va suv so'radi."],
    [1, "O'simlikning qaysi organida fotosintez asosan boradi?", "Barg", ["Ildiz", "Gul", "Urug'"], "Barg hujayralarida xloroplastlar ko'p."],
    [1, "Gulli o'simliklarda urug' qayerda yetiladi?", "Meva ichida", ["Ildizda", "Bargda", "Poyada"], "Urug' tugunchadan hosil bo'lgan meva ichida joylashadi."],
    [1, "Changni guldan gulga ko'p tashiydigan hasharot qaysi?", "Asalari", ["Chivin", "Chumoli", "Suvarak"], "Asalarilar gul shirasini yig'ib, changlatishga yordam beradi."],
    [1, "Gulning changchisida nima hosil bo'ladi?", "Chang", ["Urug'", "Meva", "Shira"], "Chang urug'chiga tushsa, changlanish sodir bo'ladi."],
    [1, "Qaysi hayvon yirtqich hisoblanadi?", "Bo'ri", ["Qo'y", "Quyon", "Sigir"], "Yirtqichlar boshqa hayvonlar bilan oziqlanadi."],
    [1, "Qaysi hayvon o'txo'r hisoblanadi?", "Qo'y", ["Bo'ri", "Sher", "Tulki"], "O'txo'rlar o'simliklar bilan oziqlanadi."],
    [1, "Baliqlar suvda qaysi organi yordamida nafas oladi?", "Jabra", ["O'pka", "Teri", "Traxeya"], "Jabralar suvda erigan kislorodni o'zlashtiradi."],
    [1, "Qaysi hayvon bolasini sut bilan boqadi?", "Delfin", ["Akula", "Pingvin", "Toshbaqa"], "Delfin — sutemizuvchi."],
    [1, "Itbaliq qaysi hayvonning lichinkasi?", "Qurbaqa", ["Baliq", "Ilon", "Kapalak"], "Qurbaqa suvga uvildiriq qo'yadi, undan itbaliq chiqadi."],
    [1, "Oziq zanjiri odatda nimadan boshlanadi?", "Yashil o'simlikdan", ["Yirtqichdan", "Zamburug'dan", "O'txo'r hayvondan"], "Yashil o'simliklar quyosh energiyasidan organik modda hosil qiladi."],
    [2, "Oziq zanjiridagi bo'sh joyni toping: o't → chigirtka → ? → ilon", "Qurbaqa", ["Sigir", "Bug'doy", "Quyon"], "Qurbaqa chigirtka bilan oziqlanadi, ilon qurbaqani yeydi."],
    [2, "Oziq zanjiridagi bo'sh joyni toping: o't → ? → bo'ri", "Quyon", ["Tulki", "Burgut", "Ilon"], "Quyon o'txo'r, bo'ri esa uni ovlaydi."],
    [2, "Organik qoldiqlarni parchalab, tuproqqa qaytaruvchi organizmlar qaysi?", "Bakteriya va zamburug'lar", ["Yirtqich hayvonlar", "Qushlar", "Baliqlar"], "Ular oziq zanjirida redutsentlar vazifasini bajaradi."],
    [2, "Kapalakning rivojlanish bosqichlarining to'g'ri tartibi qaysi?", "Tuxum → qurt → g'umbak → kapalak", ["Tuxum → g'umbak → qurt → kapalak", "Qurt → tuxum → g'umbak → kapalak", "G'umbak → tuxum → qurt → kapalak"], "Kapalak to'liq o'zgarish bilan rivojlanadi."],
    [2, "Bug'doy qanday ildiz tizimiga ega?", "Popuk ildiz", ["O'q ildiz", "Ildizmeva", "Ildiz tugunagi"], "Bir pallali o'simliklarda popuk ildiz bo'ladi."],
    [2, "Bir pallali o'simlik qaysi?", "Bug'doy", ["Loviya", "No'xat", "O'rik"], "Bug'doy, makkajo'xori, piyoz — bir pallali o'simliklar."],
    [2, "Ikki pallali o'simlik qaysi?", "Loviya", ["Bug'doy", "Makkajo'xori", "Sholi"], "Loviya urug'ida ikkita urug' pallasi bor."],
    [2, "Kartoshkaning yeyiladigan tuganagi o'simlikning qaysi organi?", "Shakli o'zgargan poya", ["Ildiz", "Meva", "Barg"], "Tuganak — yer ostidagi shakli o'zgargan poya."],
    [2, "Sabzining yeyiladigan qismi qaysi organ?", "Ildizmeva", ["Poya", "Meva", "Tuganak"], "Sabzi, lavlagi, sholg'om — ildizmevali o'simliklar."],
    [2, "Qaysi o'simlikda gul va urug' bo'lmaydi, u spora bilan ko'payadi?", "Qirqquloq", ["Olma", "Bug'doy", "Qarag'ay"], "Qirqquloq, mox va qirqbo'g'imlar spora bilan ko'payadi."],
    [2, "Qarag'ay va archa o'simliklarning qaysi bo'limiga kiradi?", "Ochiq urug'lilar", ["Yopiq urug'lilar", "Yo'sinlar", "Suvo'tlari"], "Ochiq urug'lilarning urug'i qubba qipiqlarida ochiq joylashadi."],
    [2, "Suvda hamda quruqlikda yashovchilarning boshqa nomi nima?", "Amfibiyalar", ["Reptiliyalar", "Sutemizuvchilar", "Bo'g'imoyoqlilar"], "Amfibiyalar: qurbaqa, baqa, salamandra."],
    [2, "Sudralib yuruvchilarning ilmiy nomi qaysi?", "Reptiliyalar", ["Amfibiyalar", "Sutemizuvchilar", "Bo'g'imoyoqlilar"], "Reptiliyalar: ilon, kaltakesak, toshbaqa, timsoh."],
    [2, "Qaysi qush ucha olmaydi?", "Tuyaqush", ["Laylak", "Burgut", "Qaldirg'och"], "Tuyaqush — eng yirik qush, u ucha olmaydi, lekin juda tez yuguradi."],
    [2, "Yer yuzidagi eng yirik hayvon qaysi?", "Ko'k kit", ["Afrika fili", "Jirafa", "Oq akula"], "Ko'k kit — sutemizuvchi."],
    [2, "Ko'rshapalak qaysi sinfga mansub va qanday harakatlanadi?", "Sutemizuvchi, uchadi", ["Qush, uchadi", "Hasharot, uchadi", "Sutemizuvchi, ucha olmaydi"], "Ko'rshapalak — ucha oladigan yagona sutemizuvchilar guruhi."],
    [3, "Gul changining urug'chi tumshuqchasiga tushishi nima deb ataladi?", "Changlanish", ["Urug'lanish", "Unib chiqish", "Bo'linish"], "Changlanishdan keyin urug'lanish sodir bo'ladi."],
    [3, "Gulli o'simliklardagi qo'sh urug'lanishni kim kashf etgan?", "S. G. Navashin", ["Gregor Mendel", "Charlz Darvin", "Robert Guk"], "Navashin 1898-yilda qo'sh urug'lanishni aniqlagan."],
    [3, "Gulning qaysi qismidan meva rivojlanadi?", "Tugunchadan", ["Changdondan", "Gultojibargdan", "Kosachabargdan"], "Urug'langan tugunchadan meva, urug'kurtakdan urug' hosil bo'ladi."],
    [3, "Barg og'izchalari asosan qanday vazifani bajaradi?", "Gaz almashinuvi va suv bug'latish", ["Changlanish", "Suv so'rish", "Urug' hosil qilish"], "Og'izchalar orqali CO₂, O₂ va suv bug'i o'tadi."],
    [3, "O'simliklarning suvni bug'latishi nima deyiladi?", "Transpiratsiya", ["Fotosintez", "Changlanish", "Fermentatsiya"], "Transpiratsiya asosan barg og'izchalari orqali boradi."],
    [3, "Turli tirik organizmlarning o'zaro va muhit bilan munosabatini o'rganuvchi fan qaysi?", "Ekologiya", ["Sitologiya", "Anatomiya", "Genetika"], "Ekologiya atamasini E. Gekkel kiritgan."],
    [3, "Hayvonlarni o'rganuvchi fan qanday ataladi?", "Zoologiya", ["Botanika", "Mikologiya", "Sitologiya"], "Botanika — o'simliklarni, mikologiya — zamburug'larni o'rganadi."],
    [3, "Zamburug'larni o'rganuvchi fan qanday ataladi?", "Mikologiya", ["Zoologiya", "Botanika", "Virusologiya"], "Mikologiya — zamburug'lar haqidagi fan."],
    [3, "Kamyob va yo'qolib ketish xavfi ostidagi turlar qaysi kitobga kiritiladi?", "Qizil kitob", ["Yashil kitob", "Oq kitob", "Ko'k kitob"], "O'zbekistonda ham Qizil kitob mavjud."],
    [3, "Orolning qurishi bilan bog'liq muammo qaysi turdagi muammo hisoblanadi?", "Ekologik muammo", ["Genetik muammo", "Sitologik muammo", "Anatomik muammo"], "Orol fojiasi — mintaqaning eng yirik ekologik muammosi."],
    [3, "Ornitorinx qaysi xususiyati bilan boshqa sutemizuvchilardan ajralib turadi?", "Tuxum qo'yadi", ["Jabra bilan nafas oladi", "Bolasini sut bilan boqmaydi", "Tanasi tangacha bilan qoplangan"], "Ornitorinx — tuxum qo'yuvchi sutemizuvchi, Avstraliyada yashaydi."],
    [3, "Hasharotlar tanasi qaysi uch bo'limdan iborat?", "Bosh, ko'krak, qorin", ["Bosh, bo'yin, dum", "Boshko'krak va qorin", "Bosh, tana, dum"], "O'rgimchaksimonlarda esa boshko'krak va qorin bo'ladi."],
    [3, "O'rgimchaksimonlarning tanasi qaysi bo'limlardan iborat?", "Boshko'krak va qorin", ["Bosh, ko'krak, qorin", "Bosh va dum", "Bosh, bo'yin, tana"], "O'rgimchaksimonlarda mo'ylov bo'lmaydi."]
  ];
  topic("b3", "Biologiya · O'simliklar va hayvonlar dunyosi", B3, [{ p: 0.3, fn: genSinf }, { p: 0.15, fn: genSinfTop }]);

  /* ================= g1 Geografiya · Davlatlar va poytaxtlar ================= */
  // [davlat, poytaxt, mintaqa, daraja, dunyo qismi (aniq bo'lsa)]
  // mintaqa: mo — Markaziy Osiyo va qo'shnilar, ev — Yevropa, os — Osiyo, ys — Yaqin Sharq, af — Afrika, am — Amerika, ok — Okeaniya
  var DAV = [
    ["O'zbekiston", "Toshkent", "mo", 1, "Osiyo"], ["Qozog'iston", "Astana", "mo", 1, ""], ["Qirg'iziston", "Bishkek", "mo", 1, "Osiyo"],
    ["Tojikiston", "Dushanbe", "mo", 1, "Osiyo"], ["Turkmaniston", "Ashxobod", "mo", 1, "Osiyo"], ["Afg'oniston", "Kobul", "mo", 1, "Osiyo"],
    ["Rossiya", "Moskva", "ev", 1, ""], ["Turkiya", "Anqara", "ys", 2, ""], ["Xitoy", "Pekin", "os", 1, "Osiyo"], ["Yaponiya", "Tokio", "os", 1, "Osiyo"],
    ["Hindiston", "Nyu-Dehli", "os", 1, "Osiyo"], ["AQSH", "Vashington", "am", 1, "Amerika"], ["Kanada", "Ottava", "am", 2, "Amerika"],
    ["Braziliya", "Braziliya", "am", 3, "Amerika"], ["Avstraliya", "Kanberra", "ok", 3, "Avstraliya va Okeaniya"], ["Misr", "Qohira", "af", 1, ""],
    ["Germaniya", "Berlin", "ev", 1, "Yevropa"], ["Fransiya", "Parij", "ev", 1, "Yevropa"], ["Buyuk Britaniya", "London", "ev", 1, "Yevropa"],
    ["Italiya", "Rim", "ev", 1, "Yevropa"], ["Ispaniya", "Madrid", "ev", 1, "Yevropa"], ["Janubiy Koreya", "Seul", "os", 2, "Osiyo"],
    ["Eron", "Tehron", "ys", 2, "Osiyo"], ["Pokiston", "Islomobod", "os", 2, "Osiyo"], ["Saudiya Arabistoni", "Ar-Riyod", "ys", 2, "Osiyo"],
    ["BAA", "Abu-Dabi", "ys", 2, "Osiyo"], ["Malayziya", "Kuala-Lumpur", "os", 3, "Osiyo"], ["Argentina", "Buenos-Ayres", "am", 2, "Amerika"],
    ["Meksika", "Mexiko", "am", 2, "Amerika"], ["Polsha", "Varshava", "ev", 2, "Yevropa"], ["Ukraina", "Kiyev", "ev", 1, "Yevropa"],
    ["Ozarbayjon", "Boku", "mo", 1, ""], ["Gruziya", "Tbilisi", "mo", 2, ""], ["Armaniston", "Yerevan", "mo", 2, ""],
    ["Belarus", "Minsk", "ev", 2, "Yevropa"], ["Mo'g'uliston", "Ulan-Bator", "os", 2, "Osiyo"], ["Norvegiya", "Oslo", "ev", 2, "Yevropa"],
    ["Shvetsiya", "Stokgolm", "ev", 2, "Yevropa"], ["Finlandiya", "Xelsinki", "ev", 3, "Yevropa"], ["Niderlandiya", "Amsterdam", "ev", 3, "Yevropa"],
    ["Belgiya", "Bryussel", "ev", 2, "Yevropa"], ["Shveytsariya", "Bern", "ev", 3, "Yevropa"], ["Avstriya", "Vena", "ev", 2, "Yevropa"],
    ["Gretsiya", "Afina", "ev", 2, "Yevropa"], ["Portugaliya", "Lissabon", "ev", 2, "Yevropa"], ["Chexiya", "Praga", "ev", 2, "Yevropa"],
    ["Vengriya", "Budapesht", "ev", 2, "Yevropa"], ["Nigeriya", "Abuja", "af", 3, "Afrika"], ["Keniya", "Nayrobi", "af", 3, "Afrika"],
    ["Tailand", "Bangkok", "os", 2, "Osiyo"], ["Vyetnam", "Xanoy", "os", 3, "Osiyo"], ["Filippin", "Manila", "os", 3, "Osiyo"],
    ["Bangladesh", "Dakka", "os", 3, "Osiyo"], ["Kuba", "Gavana", "am", 2, "Amerika"], ["Chili", "Santyago", "am", 3, "Amerika"],
    ["Peru", "Lima", "am", 3, "Amerika"], ["Kolumbiya", "Bogota", "am", 3, "Amerika"], ["Yangi Zelandiya", "Vellington", "ok", 3, "Avstraliya va Okeaniya"],
    ["Irlandiya", "Dublin", "ev", 3, "Yevropa"], ["Daniya", "Kopengagen", "ev", 2, "Yevropa"], ["Qatar", "Doha", "ys", 3, "Osiyo"],
    ["Kuvayt", "Kuvayt", "ys", 3, "Osiyo"], ["Iroq", "Bag'dod", "ys", 2, "Osiyo"], ["Suriya", "Damashq", "ys", 2, "Osiyo"],
    ["Iordaniya", "Ammon", "ys", 3, "Osiyo"], ["Marokash", "Rabat", "af", 3, "Afrika"], ["Jazoir", "Jazoir", "af", 3, "Afrika"],
    ["Tunis", "Tunis", "af", 3, "Afrika"], ["Efiopiya", "Addis-Abeba", "af", 3, "Afrika"]
  ];
  var QITA = ["Osiyo", "Yevropa", "Afrika", "Amerika", "Avstraliya va Okeaniya", "Antarktida"];
  function davPool(L) {
    var p = DAV.filter(function (d) { return L === 1 ? d[3] === 1 : L === 2 ? d[3] === 2 || (d[3] === 1 && Math.random() < 0.3) : d[3] >= 2; });
    return p.length ? p : DAV;
  }
  // bir mintaqadan, keyin boshqalardan
  function capW(d, idx, n) {
    var near = shuffle(DAV.filter(function (x) { return x[2] === d[2] && x[idx] !== d[idx]; })).map(function (x) { return x[idx]; });
    var far = shuffle(DAV.filter(function (x) { return x[2] !== d[2] && x[idx] !== d[idx]; })).map(function (x) { return x[idx]; });
    var out = [];
    near.concat(far).forEach(function (v) { if (out.length < n && out.indexOf(v) < 0) out.push(v); });
    return out;
  }
  function genPoyt(L) {
    var d = pick(davPool(L));
    return Q("<b>" + d[0] + "</b> davlatining poytaxti qaysi shahar?", d[1], capW(d, 1, 4), [d[0] + " poytaxti — " + d[1] + "."]);
  }
  function genDav(L) {
    var d = pick(davPool(L));
    if (d[0] === d[1]) return null;
    return Q("<b>" + d[1] + "</b> shahri qaysi davlatning poytaxti?", d[0], capW(d, 0, 4), [d[1] + " — " + d[0] + " poytaxti."]);
  }
  function genQita(L) {
    var p = DAV.filter(function (d) { return d[4] && (L === 1 ? d[3] <= 2 : true); }), d = pick(p);
    return Q("<b>" + d[0] + "</b> dunyoning qaysi qismida joylashgan?", d[4], others(QITA, d[4], 4), [d[0] + " — " + d[4] + "da joylashgan."]);
  }
  var G1 = [
    [1, "Dunyodagi maydoni eng katta davlat qaysi?", "Rossiya", ["Kanada", "Xitoy", "AQSH"], "Rossiya maydoni 17 mln km² dan ortiq."],
    [1, "Qaysi davlat O'zbekiston bilan chegaradosh emas?", "Eron", ["Qozog'iston", "Tojikiston", "Afg'oniston"], "O'zbekiston 5 davlat bilan chegaradosh: Qozog'iston, Qirg'iziston, Tojikiston, Turkmaniston, Afg'oniston."],
    [2, "Qaysi davlat bir vaqtning o'zida ham davlat, ham materik hisoblanadi?", "Avstraliya", ["Grenlandiya", "Braziliya", "Kanada"], "Avstraliya — butun bir materikni egallagan davlat."],
    [2, "Qaysi davlatning poytaxti davlat nomi bilan bir xil?", "Kuvayt", ["Iroq", "Eron", "Turkiya"], "Kuvaytning poytaxti — Kuvayt shahri."],
    [3, "Dunyodagi maydoni eng kichik davlat qaysi?", "Vatikan", ["Monako", "San-Marino", "Lixtenshteyn"], "Vatikan Rim shahri ichida joylashgan."]
  ];
  topic("g1", "Geografiya · Davlatlar va poytaxtlar", G1, [{ p: 0.55, fn: genPoyt }, { p: 0.3, fn: genDav }, { p: 0.12, fn: genQita }]);

  /* ================= g2 Geografiya · O'zbekiston geografiyasi ================= */
  var VIL = [
    ["Andijon viloyati", "Andijon"], ["Buxoro viloyati", "Buxoro"], ["Farg'ona viloyati", "Farg'ona"], ["Jizzax viloyati", "Jizzax"],
    ["Xorazm viloyati", "Urganch"], ["Namangan viloyati", "Namangan"], ["Navoiy viloyati", "Navoiy"], ["Qashqadaryo viloyati", "Qarshi"],
    ["Samarqand viloyati", "Samarqand"], ["Sirdaryo viloyati", "Guliston"], ["Surxondaryo viloyati", "Termiz"], ["Toshkent viloyati", "Nurafshon"],
    ["Qoraqalpog'iston Respublikasi", "Nukus"]
  ];
  var VIL_HARD = { "Xorazm viloyati": 1, "Qashqadaryo viloyati": 1, "Sirdaryo viloyati": 1, "Surxondaryo viloyati": 1, "Toshkent viloyati": 1, "Qoraqalpog'iston Respublikasi": 1 };
  function genVil(L) {
    var pool = VIL.filter(function (v) { return L === 1 ? v[0].indexOf(v[1]) === 0 || v[0] === "Qoraqalpog'iston Respublikasi" : VIL_HARD[v[0]]; });
    if (L === 3) pool = VIL;
    var v = pick(pool), cs = VIL.map(function (x) { return x[1]; });
    if (Math.random() < 0.6 || L === 1) {
      var w = others(cs, v[1], 4);
      if (v[0] === "Toshkent viloyati") w[0] = "Toshkent";
      return Q("<b>" + v[0] + "</b>ning markazi qaysi shahar?", v[1], w, [v[0] + " markazi — " + v[1] + "."]);
    }
    return Q("<b>" + v[1] + "</b> shahri qaysi hududning markazi?", v[0], others(VIL.map(function (x) { return x[0]; }), v[0], 4), [v[1] + " — " + v[0] + " markazi."]);
  }
  var G2 = [
    [1, "O'zbekiston nechta davlat bilan chegaradosh?", "5", ["4", "6", "3", "7"], "Qozog'iston, Qirg'iziston, Tojikiston, Turkmaniston va Afg'oniston."],
    [1, "O'zbekiston poytaxti qaysi shahar?", "Toshkent", ["Samarqand", "Buxoro", "Namangan"], "Toshkent — O'zbekistonning poytaxti va eng katta shahri."],
    [1, "O'zbekistonda nechta viloyat bor?", "12", ["13", "14", "11", "10"], "12 viloyat, Qoraqalpog'iston Respublikasi va Toshkent shahri."],
    [1, "O'zbekiston tarkibidagi respublika qaysi?", "Qoraqalpog'iston", ["Xorazm", "Navoiy", "Surxondaryo"], "Qoraqalpog'iston Respublikasining poytaxti — Nukus."],
    [1, "O'rta Osiyodagi eng sersuv daryo qaysi?", "Amudaryo", ["Zarafshon", "Chirchiq", "Qashqadaryo"], "Amudaryo Orol dengizi havzasiga oqadi."],
    [1, "O'zbekiston hududining katta qismini egallagan cho'l qaysi?", "Qizilqum", ["Qoraqum", "Sahroi Kabir", "Gobi"], "Qizilqum Amudaryo va Sirdaryo oralig'ida joylashgan."],
    [1, "Samarqand va Buxoro shaharlari qaysi daryo vodiysida joylashgan?", "Zarafshon", ["Chirchiq", "Sirdaryo", "Surxondaryo"], "Zarafshon daryosi Samarqand va Buxoro vohalarini sug'oradi."],
    [1, "Toshkent vohasini sug'oruvchi asosiy daryo qaysi?", "Chirchiq", ["Zarafshon", "Amudaryo", "Qashqadaryo"], "Chirchiq daryosi Sirdaryoning irmog'i."],
    [1, "Andijon, Namangan va Farg'ona viloyatlari qaysi vodiyda joylashgan?", "Farg'ona vodiysi", ["Zarafshon vodiysi", "Chirchiq vodiysi", "Surxon vodiysi"], "Farg'ona vodiysi tog'lar bilan o'ralgan."],
    [1, "O'zbekistonning eng janubiy viloyati qaysi?", "Surxondaryo", ["Qashqadaryo", "Xorazm", "Navoiy"], "Surxondaryo viloyati Afg'oniston bilan chegaradosh."],
    [1, "Afg'oniston bilan chegaradosh O'zbekiston viloyati qaysi?", "Surxondaryo", ["Qashqadaryo", "Samarqand", "Jizzax"], "Termiz shahri Amudaryo bo'yida joylashgan."],
    [2, "O'zbekistonning eng baland nuqtasi qaysi?", "Hazrat Sulton cho'qqisi", ["Chimyon", "Katta Chimyon", "Bobotog'"], "Hazrat Sulton cho'qqisi Hisor tizmasida joylashgan."],
    [2, "Hazrat Sulton cho'qqisining balandligi qancha?", "4643 m", ["3643 m", "5643 m", "4134 m", "4846 m"], "Hazrat Sulton — O'zbekistonning eng baland nuqtasi."],
    [2, "O'zbekiston maydoni taxminan qancha?", "448,9 ming km²", ["248,9 ming km²", "648,9 ming km²", "1 mln km²"], "O'zbekiston maydoni taxminan 448,9 ming km²."],
    [2, "O'zbekiston qaysi vaqt mintaqasida joylashgan?", "UTC+5", ["UTC+3", "UTC+4", "UTC+6"], "Toshkent vaqti Grinvich vaqtidan 5 soat oldinda."],
    [2, "Amudaryo va Sirdaryo qaysi suv havzasiga quyiladi?", "Orol dengizi", ["Kaspiy dengizi", "Qora dengiz", "Balxash ko'li"], "Daryolar suvi sug'orishga ko'p sarflanishi Orolning qurishiga olib keldi."],
    [2, "Sirdaryo qaysi ikki daryoning qo'shilishidan hosil bo'ladi?", "Norin va Qoradaryo", ["Vaxsh va Panj", "Chirchiq va Ohangaron", "Zarafshon va Qashqadaryo"], "Norin va Qoradaryo Farg'ona vodiysida qo'shiladi."],
    [2, "Amudaryo qaysi ikki daryoning qo'shilishidan hosil bo'ladi?", "Vaxsh va Panj", ["Norin va Qoradaryo", "Chirchiq va Ohangaron", "Surxon va Sherobod"], "Amudaryo Vaxsh va Panj daryolari qo'shilishidan boshlanadi."],
    [2, "O'zbekistonning qaysi hududi Orol dengizi bo'yida joylashgan?", "Qoraqalpog'iston", ["Xorazm", "Navoiy", "Buxoro"], "Orolning janubiy qismi Qoraqalpog'iston hududida."],
    [2, "Orol dengizining qurigan tubida hosil bo'lgan yangi cho'l qanday ataladi?", "Orolqum", ["Qizilqum", "Qoraqum", "Mirzacho'l"], "Orolqum tuz va qum bo'ronlari manbaiga aylangan."],
    [2, "Sirdaryo va Jizzax viloyatlarida o'zlashtirilgan cho'l qanday ataladi?", "Mirzacho'l", ["Qizilqum", "Orolqum", "Ustyurt"], "Mirzacho'l (Mirzacho'l dashti) sug'orilib, paxtazorga aylantirilgan."],
    [2, "Qoraqalpog'iston g'arbida joylashgan keng plato qaysi?", "Ustyurt", ["Pomir", "Tyanshan", "Hisor"], "Ustyurt platosi Qozog'iston va Turkmaniston bilan tutashadi."],
    [3, "O'zbekiston kabi \"ikki karra dengizga chiqa olmaydigan\" davlat yana qaysi?", "Lixtenshteyn", ["Shveytsariya", "Avstriya", "Mo'g'uliston"], "Dunyoda faqat ikkita shunday davlat bor: O'zbekiston va Lixtenshteyn."],
    [3, "Okeanga chiqish uchun O'zbekistondan kamida nechta davlat hududini kesib o'tish kerak?", "2", ["1", "3", "4"], "O'zbekiston ham, uning barcha qo'shnilari ham okeanga chiqa olmaydi."],
    [3, "Chorvoq suv ombori qaysi viloyatda joylashgan?", "Toshkent viloyati", ["Namangan viloyati", "Jizzax viloyati", "Samarqand viloyati"], "Chorvoq suv ombori Chirchiq daryosida qurilgan."],
    [3, "Chimyon va Beldersoy dam olish maskanlari qaysi tog'larda joylashgan?", "G'arbiy Tyanshan", ["Pomir", "Hisor", "Zarafshon tizmasi"], "Chotqol va Ugom tizmalari G'arbiy Tyanshan tarkibiga kiradi."],
    [3, "Hazrat Sulton cho'qqisi qaysi tog' tizmasida joylashgan?", "Hisor tizmasi", ["Chotqol tizmasi", "Turkiston tizmasi", "Nurota tog'lari"], "Hisor tizmasi O'zbekiston va Tojikiston chegarasida."],
    [3, "O'zbekistonning maydoni bo'yicha eng katta hududiy birligi qaysi?", "Qoraqalpog'iston", ["Navoiy viloyati", "Buxoro viloyati", "Qashqadaryo viloyati"], "Qoraqalpog'iston Respublikasi mamlakat hududining uchdan biridan ko'prog'ini egallaydi."],
    [3, "Muruntov oltin koni qaysi viloyatda joylashgan?", "Navoiy viloyati", ["Samarqand viloyati", "Buxoro viloyati", "Jizzax viloyati"], "Muruntov — Qizilqumdagi yirik oltin koni."],
    [3, "Sirdaryo qaysi davlat hududida Orol dengiziga quyiladi?", "Qozog'iston", ["O'zbekiston", "Turkmaniston", "Tojikiston"], "Sirdaryo O'zbekiston va Tojikistondan o'tib, Qozog'istonda Orolga quyiladi."],
    [3, "O'zbekistonda iqlim qanday?", "Keskin kontinental", ["Mussonli", "Ekvatorial", "Dengiz iqlimi"], "Yozi issiq va quruq, qishi nisbatan sovuq."]
  ];
  topic("g2", "Geografiya · O'zbekiston geografiyasi", G2, [{ p: 0.4, fn: genVil }]);

  /* ================= g3 Geografiya · Materiklar, okeanlar va tabiat ================= */
  function kmW(a) {
    var c = [a * 10, a / 10, a * 2, a + Math.max(1, Math.round(a / 2)), a / 2, a * 100], out = [];
    c.forEach(function (x) { x = Math.round(x * 100) / 100; if (x > 0 && x !== a && out.indexOf(x) < 0) out.push(x); });
    return out.slice(0, 4).map(function (x) { return String(x).replace(".", ",") + " km"; });
  }
  function genMasshtab(L) {
    var M = pick(lv(L, [100000, 200000, 500000], [100000, 200000, 250000, 500000, 1000000], [25000, 50000, 200000, 250000, 2500000])), sm = 1 + R(0, lv(L, 0, 6, 9));
    var kmPerSm = M / 100000, km = Math.round(sm * kmPerSm * 100) / 100, fmt = String(M).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    var ks = String(kmPerSm).replace(".", ",");
    if (L === 1 || sm === 1) return Q("Xarita masshtabi 1 : " + fmt + ". Xaritadagi 1 sm joyda necha km ga teng?", ks + " km", kmW(kmPerSm), ["1 sm = " + fmt + " sm = " + ks + " km."]);
    return Q("Masshtabi 1 : " + fmt + " bo'lgan xaritada ikki shahar orasi " + sm + " sm. Joydagi masofa necha km?", String(km).replace(".", ",") + " km", kmW(km),
      ["1 sm = " + ks + " km.", sm + " × " + ks + " = " + String(km).replace(".", ",") + " km."]);
  }
  // [shahar, UTC farqi] — doimiy (yozgi vaqtga o'tmaydigan) shaharlar
  var VAQT = [["Toshkent", 5], ["Moskva", 3], ["Tokio", 9], ["Pekin", 8], ["Dubay", 4], ["Bishkek", 6], ["Ashxobod", 5], ["Dushanbe", 5], ["Seul", 9], ["Bangkok", 7]];
  function genVaqt(L) {
    var a = VAQT[0], b = pick(VAQT.filter(function (x) { return x[1] !== 5; }));
    var h = R(6, 18), d = b[1] - a[1], t = h + d;
    if (L === 2 || Math.random() < 0.4) {
      var dd = Math.abs(d), ans = dd + " soat", w = [1, 2, 3, 4, 5, 6].filter(function (x) { return x !== dd; }).map(function (x) { return x + " soat"; });
      return Q("Toshkent vaqti UTC+5, " + b[0] + " vaqti UTC" + (b[1] >= 0 ? "+" : "") + b[1] + ". Ular orasidagi vaqt farqi necha soat?", ans, shuffle(w).slice(0, 4), ["|" + b[1] + " − 5| = " + dd + " soat."]);
    }
    var hh = function (x) { x = ((x % 24) + 24) % 24; return (x < 10 ? "0" : "") + x + ":00"; };
    var ws = [t + 1, t - 1, h - d, t + 2, t - 2].map(hh).filter(function (x) { return x !== hh(t); });
    return Q("Toshkentda (UTC+5) soat " + hh(h) + ". " + b[0] + "da (UTC" + (b[1] >= 0 ? "+" : "") + b[1] + ") soat necha bo'ladi?", hh(t), ws,
      [b[0] + " Toshkentdan " + Math.abs(d) + " soat " + (d > 0 ? "oldinda" : "orqada") + ": " + hh(h) + (d > 0 ? " + " : " − ") + Math.abs(d) + " = " + hh(t) + "."]);
  }
  var G3 = [
    [1, "Yer yuzida nechta materik bor?", "6", ["5", "7", "4"], "Yevrosiyo, Afrika, Shimoliy Amerika, Janubiy Amerika, Avstraliya, Antarktida."],
    [1, "Eng katta materik qaysi?", "Yevrosiyo", ["Afrika", "Shimoliy Amerika", "Antarktida"], "Yevrosiyo Yer quruqligining qariyb uchdan bir qismini egallaydi."],
    [1, "Eng kichik materik qaysi?", "Avstraliya", ["Antarktida", "Janubiy Amerika", "Afrika"], "Avstraliya — eng kichik materik."],
    [1, "Eng katta va eng chuqur okean qaysi?", "Tinch okeani", ["Atlantika okeani", "Hind okeani", "Shimoliy Muz okeani"], "Tinch okeanida eng chuqur joy — Mariana botig'i."],
    [1, "Eng kichik okean qaysi?", "Shimoliy Muz okeani", ["Hind okeani", "Atlantika okeani", "Tinch okeani"], "Shimoliy Muz okeani yilning ko'p qismida muz bilan qoplangan."],
    [1, "Dunyodagi eng baland cho'qqi qaysi?", "Everest (Jomolungma)", ["Kilimanjaro", "Elbrus", "Monblan"], "Everest Himolay tog'larida joylashgan."],
    [1, "Everest (Jomolungma) cho'qqisi qaysi tog'larda joylashgan?", "Himolay", ["Alp", "And", "Pomir"], "Himolay — dunyodagi eng baland tog' tizimi."],
    [1, "Afrikaning eng uzun daryosi qaysi?", "Nil", ["Kongo", "Niger", "Zambezi"], "Nil O'rta yer dengiziga quyiladi."],
    [1, "Dunyodagi eng chuqur ko'l qaysi?", "Baykal", ["Kaspiy", "Viktoriya", "Issiqko'l"], "Baykal Rossiyada, Sibirda joylashgan."],
    [1, "Dunyodagi maydoni eng katta ko'l qaysi?", "Kaspiy", ["Baykal", "Viktoriya", "Orol"], "Kaspiy ko'li sho'r suvli bo'lgani uchun dengiz deb ham ataladi."],
    [1, "Yer o'z o'qi atrofida taxminan qancha vaqtda bir marta aylanadi?", "24 soatda", ["12 soatda", "365 kunda", "30 kunda"], "Yerning o'z o'qi atrofida aylanishi kecha va kunduz almashinuviga sabab bo'ladi."],
    [1, "Yer Quyosh atrofini taxminan qancha vaqtda bir marta aylanib chiqadi?", "365 kunda", ["24 soatda", "30 kunda", "100 kunda"], "Yerning Quyosh atrofida aylanishi fasllar almashinuviga sabab bo'ladi."],
    [1, "Geografik xaritada yuqori tomon odatda qaysi tomonni bildiradi?", "Shimolni", ["Janubni", "Sharqni", "G'arbni"], "Xaritada yuqori — shimol, pastki — janub, o'ng — sharq, chap — g'arb."],
    [1, "Quyosh qaysi tomondan chiqadi?", "Sharqdan", ["G'arbdan", "Shimoldan", "Janubdan"], "Yer g'arbdan sharqqa aylangani uchun Quyosh sharqdan chiqadi."],
    [1, "Yer sharini Shimoliy va Janubiy yarimsharlarga ajratuvchi chiziq qaysi?", "Ekvator", ["Bosh meridian", "Tropik", "Qutb doirasi"], "Ekvatorning kengligi 0°."],
    [1, "Eng sovuq materik qaysi?", "Antarktida", ["Yevrosiyo", "Shimoliy Amerika", "Avstraliya"], "Antarktida deyarli butunlay muz bilan qoplangan."],
    [2, "Everest cho'qqisining balandligi taxminan qancha?", "8848 m", ["7848 m", "6962 m", "9848 m"], "Everest — dunyodagi eng baland cho'qqi."],
    [2, "Dunyodagi eng katta issiq cho'l qaysi?", "Sahroi Kabir", ["Gobi", "Qizilqum", "Atakama"], "Sahroi Kabir Shimoliy Afrikada joylashgan."],
    [2, "Qutbdan qutbga o'tkazilgan chiziqlar nima deyiladi?", "Meridianlar", ["Parallellar", "Ekvator", "Gorizontallar"], "Meridianlar Shimoliy va Janubiy qutblarni tutashtiradi."],
    [2, "Ekvatorga parallel o'tkazilgan chiziqlar nima deyiladi?", "Parallellar", ["Meridianlar", "Gorizontallar", "Izobaralar"], "Parallellar bo'yicha geografik kenglik aniqlanadi."],
    [2, "Ekvatorning geografik kengligi necha gradus?", "0°", ["90°", "180°", "45°"], "Kenglik ekvatordan qutblarga qarab 0° dan 90° gacha o'zgaradi."],
    [2, "Shimoliy qutbning geografik kengligi qancha?", "90° sh.k.", ["0°", "180° sh.k.", "45° sh.k."], "Qutblar kengligi — 90°."],
    [2, "Geografik uzunlik qaysi chiziqdan boshlab hisoblanadi?", "Bosh (Grinvich) meridiani", ["Ekvator", "Shimoliy tropik", "Qutb doirasi"], "Bosh meridian London yaqinidagi Grinvichdan o'tadi."],
    [2, "Atmosferaning Yer yuzasiga eng yaqin quyi qatlami qaysi?", "Troposfera", ["Stratosfera", "Mezosfera", "Termosfera"], "Bulutlar va ob-havo hodisalari asosan troposferada kuzatiladi."],
    [2, "Ozon qatlami atmosferaning qaysi qatlamida joylashgan?", "Stratosfera", ["Troposfera", "Mezosfera", "Ekzosfera"], "Ozon qatlami Quyoshning ultrabinafsha nurlaridan himoya qiladi."],
    [2, "Havo tarkibida qaysi gaz eng ko'p?", "Azot", ["Kislorod", "Karbonat angidrid", "Argon"], "Havoning taxminan 78% i azot, 21% i kislorod."],
    [2, "Ekvator qaysi okeanni kesib o'tmaydi?", "Shimoliy Muz okeani", ["Tinch okeani", "Atlantika okeani", "Hind okeani"], "Shimoliy Muz okeani shimoliy qutb atrofida joylashgan."],
    [2, "Faqat janubiy yarimsharda joylashgan materik qaysi?", "Avstraliya", ["Afrika", "Janubiy Amerika", "Yevrosiyo"], "Avstraliya va Antarktida butunlay janubiy yarimsharda."],
    [2, "Shimol va sharq oralig'idagi tomon qanday ataladi?", "Shimoli-sharq", ["Janubi-sharq", "Shimoli-g'arb", "Janubi-g'arb"], "Oraliq tomonlar: shimoli-sharq, janubi-sharq, janubi-g'arb, shimoli-g'arb."],
    [2, "Janub va g'arb oralig'idagi tomon qanday ataladi?", "Janubi-g'arb", ["Shimoli-g'arb", "Janubi-sharq", "Shimoli-sharq"], "Oraliq tomonlar: shimoli-sharq, janubi-sharq, janubi-g'arb, shimoli-g'arb."],
    [3, "Dunyo okeanidagi eng chuqur joy qaysi?", "Mariana botig'i", ["Puerto-Riko botig'i", "Yava botig'i", "Baykal ko'li"], "Mariana botig'i Tinch okeanida, chuqurligi 11 km ga yaqin."],
    [3, "Yer sharida nechta asosiy iqlim mintaqasi ajratiladi?", "7", ["4", "5", "13"], "Ekvatorial, 2 tropik, 2 mo''tadil, arktik va antarktik — 7 ta asosiy, yana 6 ta oraliq mintaqa bor."],
    [3, "Quruqlikdagi eng uzun tog' tizimi qaysi?", "And", ["Himolay", "Alp", "Ural"], "And tog'lari Janubiy Amerikaning g'arbiy qirg'og'i bo'ylab cho'zilgan."],
    [3, "Yevropa va Osiyo orasidagi an'anaviy chegara qaysi tog'lardan o'tadi?", "Ural tog'lari", ["Alp tog'lari", "Karpat tog'lari", "Pomir"], "Chegara Ural tog'lari va Ural daryosi bo'ylab o'tkaziladi."],
    [3, "Afrikadagi eng baland cho'qqi qaysi?", "Kilimanjaro", ["Everest", "Elbrus", "Akonkagua"], "Kilimanjaro — so'ngan vulqon."],
    [3, "Janubiy Amerikadagi eng baland cho'qqi qaysi?", "Akonkagua", ["Kilimanjaro", "Everest", "Monblan"], "Akonkagua And tog'larida, Argentinada joylashgan."],
    [3, "Kenglik va uzunlik birgalikda nima deb ataladi?", "Geografik koordinatalar", ["Masshtab", "Azimut", "Izogipsa"], "Koordinatalar orqali Yer yuzasidagi istalgan nuqtaning o'rni aniqlanadi."],
    [3, "Amazonka va Kongo havzalarida qanday o'rmonlar keng tarqalgan?", "Nam ekvatorial o'rmonlar", ["Tayga", "Tundra", "Dasht"], "Bu o'rmonlarda yil bo'yi issiq va ko'p yog'in yog'adi."],
    [3, "Ignabargli o'rmonlar zonasi qanday ataladi?", "Tayga", ["Tundra", "Savanna", "Dasht"], "Tayga Yevrosiyo va Shimoliy Amerikaning mo''tadil mintaqasida."],
    [3, "Afrikaning baland o'tlar va siyrak daraxtlar o'sadigan tabiat zonasi qanday ataladi?", "Savanna", ["Tayga", "Tundra", "Cho'l"], "Savannada sher, zebra, jirafa kabi hayvonlar yashaydi."],
    [3, "Yer qobig'ining yuqori qattiq qatlami nima deb ataladi?", "Litosfera", ["Gidrosfera", "Atmosfera", "Biosfera"], "Gidrosfera — suv qobig'i, atmosfera — havo qobig'i."],
    [3, "Yerning suv qobig'i qanday ataladi?", "Gidrosfera", ["Litosfera", "Atmosfera", "Biosfera"], "Gidrosferaga okean, dengiz, daryo, ko'l va muzliklar kiradi."]
  ];
  topic("g3", "Geografiya · Materiklar, okeanlar va tabiat", G3, [{ p: 0.15, fn: function (L) { return L === 1 ? null : genMasshtab(L); } }, { p: 0.12, fn: function (L) { return L === 1 ? null : genVaqt(L); } }, { p: 0.06, fn: function (L) { return L === 1 ? genMasshtab(1) : null; } }]);

  /* ================= h1 Tarix · O'zbekiston tarixi: muhim sanalar ================= */
  var H1 = [
    [1, "O'zbekistonda Mustaqillik kuni qachon nishonlanadi?", "1-sentabr", ["31-avgust", "8-dekabr", "21-mart", "9-may"], "1991-yil 31-avgustda mustaqillik e'lon qilingan, 1-sentabr Mustaqillik kuni deb belgilangan."],
    [1, "O'zbekiston Konstitutsiyasi kuni qachon nishonlanadi?", "8-dekabr", ["1-sentabr", "10-dekabr", "2-iyul", "18-noyabr"], "Konstitutsiya 1992-yil 8-dekabrda qabul qilingan."],
    [1, "O'zbekiston mustaqilligi qaysi yili e'lon qilingan?", "1991", ["1990", "1992", "1989", "1994"], "1991-yil 31-avgustda davlat mustaqilligi e'lon qilingan."],
    [1, "Amir Temur qaysi yili tug'ilgan?", "1336", ["1326", "1346", "1370", "1405"], "Amir Temur 1336-yil 9-aprelda tug'ilgan."],
    [1, "Amir Temur davlatining poytaxti qaysi shahar bo'lgan?", "Samarqand", ["Buxoro", "Shahrisabz", "Xiva", "Toshkent"], "Amir Temur Samarqandni poytaxt qilib, uni obod qilgan."],
    [1, "Amir Temur qayerda tug'ilgan?", "Shahrisabz yaqinida", ["Buxoro yaqinida", "Xiva yaqinida", "Andijon yaqinida"], "Amir Temur Kesh (Shahrisabz) yaqinidagi Xo'ja Ilg'or qishlog'ida tug'ilgan."],
    [1, "Zahiriddin Muhammad Bobur qaysi shaharda tug'ilgan?", "Andijon", ["Samarqand", "Buxoro", "Hirot", "Qo'qon"], "Bobur 1483-yilda Andijonda tug'ilgan."],
    [1, "Mirzo Ulug'bek rasadxonasi qaysi shaharda joylashgan?", "Samarqand", ["Buxoro", "Xiva", "Toshkent", "Termiz"], "Rasadxona XV asrda Samarqand yaqinidagi Ko'hak tepaligida qurilgan."],
    [1, "Ichan qal'a qaysi shaharda joylashgan?", "Xiva", ["Buxoro", "Samarqand", "Qo'qon", "Nukus"], "Ichan qal'a — Xivaning ichki shahri."],
    [1, "Registon maydoni qaysi shaharda joylashgan?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"], "Registonda Ulug'bek, Sherdor va Tillakori madrasalari bor."],
    [1, "Oqsaroy saroyi qaysi shaharda qurilgan?", "Shahrisabz", ["Samarqand", "Buxoro", "Xiva"], "Oqsaroy Amir Temur davrida qurilgan."],
    [1, "Minorai Kalon qaysi shaharda joylashgan?", "Buxoro", ["Samarqand", "Xiva", "Toshkent"], "Minorai Kalon — Buxoroning ramzlaridan biri."],
    [1, "Go'ri Amir maqbarasi qaysi shaharda joylashgan?", "Samarqand", ["Shahrisabz", "Buxoro", "Hirot"], "Go'ri Amirda Amir Temur va temuriylar dafn etilgan."],
    [1, "Kalta minor qaysi shaharda joylashgan?", "Xiva", ["Buxoro", "Samarqand", "Qo'qon"], "Kalta minor Ichan qal'a hududida joylashgan."],
    [1, "Navro'z bayrami qachon nishonlanadi?", "21-mart", ["1-sentabr", "8-mart", "9-may", "1-yanvar"], "Navro'z — bahor va yangi yil bayrami."],
    [1, "Xotira va qadrlash kuni qachon nishonlanadi?", "9-may", ["1-may", "21-mart", "1-oktabr", "8-dekabr"], "9-may — Xotira va qadrlash kuni."],
    [1, "O'qituvchi va murabbiylar kuni qachon nishonlanadi?", "1-oktabr", ["1-sentabr", "21-oktabr", "8-dekabr", "9-may"], "1-oktabr — O'qituvchi va murabbiylar kuni."],
    [1, "Buyuk Ipak yo'li qaysi mintaqalarni bog'lagan?", "Xitoy va Yevropani", ["Hindiston va Afrikani", "Rossiya va Eronni", "Amerika va Yevropani"], "Ipak yo'li O'rta Osiyo orqali Sharq va G'arbni bog'lagan."],
    [1, "Somoniylar davlatining poytaxti qaysi shahar bo'lgan?", "Buxoro", ["Samarqand", "Xiva", "Termiz"], "Somoniylar davrida Buxoro yirik ilm-fan markaziga aylangan."],
    [2, "O'zbekiston mustaqilligi qachon e'lon qilingan?", "1991-yil 31-avgust", ["1991-yil 1-sentabr", "1990-yil 31-avgust", "1992-yil 31-avgust", "1991-yil 18-noyabr"], "Oliy Kengash sessiyasida mustaqillik e'lon qilingan; 1-sentabr — Mustaqillik kuni."],
    [2, "O'zbekiston Konstitutsiyasi qachon qabul qilingan?", "1992-yil 8-dekabr", ["1991-yil 8-dekabr", "1992-yil 10-dekabr", "1993-yil 8-dekabr", "1992-yil 2-iyul"], "8-dekabr — Konstitutsiya kuni."],
    [2, "O'zbekiston BMTga qachon a'zo bo'lgan?", "1992-yil 2-mart", ["1991-yil 2-mart", "1992-yil 1-sentabr", "1993-yil 2-mart", "1992-yil 8-dekabr"], "O'zbekiston 1992-yil 2-martda BMTga a'zo bo'lgan."],
    [2, "O'zbekiston Davlat bayrog'i qachon qabul qilingan?", "1991-yil 18-noyabr", ["1992-yil 18-noyabr", "1991-yil 31-avgust", "1992-yil 2-iyul", "1991-yil 8-dekabr"], "Davlat bayrog'i 1991-yil 18-noyabrda qabul qilingan."],
    [2, "O'zbekiston Davlat gerbi qachon qabul qilingan?", "1992-yil 2-iyul", ["1991-yil 2-iyul", "1992-yil 10-dekabr", "1991-yil 18-noyabr", "1993-yil 2-iyul"], "Davlat gerbi 1992-yil 2-iyulda qabul qilingan."],
    [2, "O'zbekiston Davlat madhiyasi qachon qabul qilingan?", "1992-yil 10-dekabr", ["1992-yil 8-dekabr", "1991-yil 10-dekabr", "1992-yil 2-iyul", "1993-yil 10-dekabr"], "Madhiya so'zlari — Abdulla Oripov, musiqasi — Mutal Burhonov."],
    [2, "Milliy valyuta — so'm qachon muomalaga kiritilgan?", "1994-yil 1-iyul", ["1993-yil 1-iyul", "1994-yil 1-yanvar", "1992-yil 1-iyul", "1995-yil 1-iyul"], "1994-yil 1-iyuldan so'm to'liq muomalaga kiritilgan."],
    [2, "Amir Temur qaysi yili vafot etgan?", "1405", ["1404", "1395", "1415", "1370"], "Amir Temur 1405-yilda O'trorda vafot etgan."],
    [2, "Mirzo Ulug'bek yashagan yillar qaysi?", "1394–1449", ["1336–1405", "1441–1501", "1483–1530", "1404–1459"], "Ulug'bek — Amir Temurning nevarasi, olim va hukmdor."],
    [2, "Zahiriddin Muhammad Bobur yashagan yillar qaysi?", "1483–1530", ["1394–1449", "1441–1501", "1336–1405", "1473–1520"], "Bobur — shoir, tarixchi va Boburiylar davlati asoschisi."],
    [2, "Bobur Hindistonda qaysi yili o'z davlatiga asos solgan?", "1526", ["1504", "1530", "1483", "1556"], "1526-yilgi Panipat jangidan so'ng Boburiylar davlati tashkil topgan."],
    [2, "Bobur 1526-yilda qaysi jangda g'alaba qozongan?", "Panipat jangi", ["Anqara jangi", "Talas jangi", "Kosovo jangi"], "Panipat jangidan keyin Bobur Dehlini egallagan."],
    [2, "Amir Temur 1402-yilda Usmonli sultoni Boyazidni qaysi jangda yenggan?", "Anqara jangi", ["Panipat jangi", "Talas jangi", "Kulikovo jangi"], "Anqara jangi 1402-yilda bo'lib o'tgan."],
    [2, "Amir Temur qaysi yili hokimiyatni qo'lga olgan?", "1370", ["1336", "1360", "1380", "1405"], "1370-yilda Balxdagi qurultoyda Amir Temur hukmdor deb e'lon qilingan."],
    [2, "\"Temur tuzuklari\" kimga nisbat beriladi?", "Amir Temur", ["Mirzo Ulug'bek", "Bobur", "Shohrux Mirzo"], "Asarda davlatni boshqarish qoidalari bayon etilgan."],
    [2, "O'zbek tiliga davlat tili maqomi qachon berilgan?", "1989-yil 21-oktabr", ["1991-yil 21-oktabr", "1989-yil 1-sentabr", "1992-yil 21-oktabr", "1990-yil 21-oktabr"], "21-oktabr — O'zbek tili bayrami kuni."],
    [2, "Ismoil Somoniy maqbarasi qaysi shaharda joylashgan?", "Buxoro", ["Samarqand", "Termiz", "Xiva"], "Maqbara Somoniylar davrida qurilgan."],
    [2, "Shohizinda ansambli qaysi shaharda joylashgan?", "Samarqand", ["Buxoro", "Xiva", "Shahrisabz"], "Shohizinda — maqbaralar majmuasi."],
    [2, "Bibixonim masjidi qaysi shaharda joylashgan?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"], "Masjid Amir Temur davrida qurilgan."],
    [3, "O'zbekistondagi qaysi obyekt birinchi bo'lib YuNESKO Butunjahon merosi ro'yxatiga kiritilgan?", "Xivadagi Ichan qal'a", ["Buxoro tarixiy markazi", "Samarqand", "Shahrisabz tarixiy markazi"], "Ichan qal'a 1990-yilda ro'yxatga kiritilgan."],
    [3, "Ichan qal'a YuNESKO ro'yxatiga qaysi yili kiritilgan?", "1990", ["1993", "2000", "2001", "1997"], "Buxoro — 1993, Shahrisabz — 2000, Samarqand — 2001-yilda kiritilgan."],
    [3, "Buxoro tarixiy markazi YuNESKO ro'yxatiga qaysi yili kiritilgan?", "1993", ["1990", "2000", "2001", "1991"], "Ichan qal'a — 1990, Buxoro — 1993-yilda kiritilgan."],
    [3, "Samarqand shahri YuNESKO ro'yxatiga qaysi yili kiritilgan?", "2001", ["1990", "1993", "2000", "2007"], "Samarqand \"Madaniyatlar chorrahasi\" sifatida 2001-yilda kiritilgan."],
    [3, "Mustaqillik Deklaratsiyasi qachon qabul qilingan?", "1990-yil 20-iyun", ["1991-yil 20-iyun", "1990-yil 31-avgust", "1991-yil 31-avgust", "1989-yil 20-iyun"], "Deklaratsiya mustaqillik sari muhim qadam bo'lgan."],
    [3, "Lotin yozuviga asoslangan o'zbek alifbosi qaysi yili qabul qilingan?", "1993", ["1991", "1995", "1989", "2000"], "Alifbo 1993-yil 2-sentabrda qonun bilan qabul qilingan."],
    [3, "Amir Temur qayerda vafot etgan?", "O'trorda", ["Samarqandda", "Shahrisabzda", "Hirotda"], "Amir Temur Xitoyga yurish paytida, 1405-yilda O'trorda vafot etgan."],
    [3, "Mirzo Ulug'bek kimning o'g'li bo'lgan?", "Shohrux Mirzo", ["Amir Temur", "Umarshayx Mirzo", "Bobur"], "Ulug'bek — Shohrux Mirzoning o'g'li, Amir Temurning nevarasi."],
    [3, "Shohrux Mirzo davrida Temuriylar davlatining poytaxti qaysi shahar bo'lgan?", "Hirot", ["Samarqand", "Buxoro", "Balx"], "Shohrux Mirzo poytaxtni Hirotga ko'chirgan."],
    [3, "Ulug'bek rasadxonasi qoldiqlarini 1908-yilda kim topgan?", "V. L. Vyatkin", ["A. Navoiy", "Ali Qushchi", "M. Behbudiy"], "Arxeolog Vyatkin rasadxona sekstantining qoldiqlarini topgan."],
    [3, "Qaysi madrasa Samarqanddagi Registon ansambliga kirmaydi?", "Ko'kaldosh madrasasi", ["Ulug'bek madrasasi", "Sherdor madrasasi", "Tillakori madrasasi"], "Registon ansambli: Ulug'bek, Sherdor va Tillakori madrasalari."],
    [3, "XIX asrda O'zbekiston hududidagi uch davlat: Buxoro amirligi, Xiva xonligi va …?", "Qo'qon xonligi", ["Toshkent xonligi", "Samarqand amirligi", "Termiz xonligi"], "Bu davlatlar tarixda \"uch xonlik\" deb ham ataladi."],
    [3, "Afrosiyob nima?", "Qadimgi Samarqand xarobalari", ["Buxorodagi madrasa", "Xivadagi minora", "Toshkentdagi bozor"], "Afrosiyobda qadimgi devoriy suratlar topilgan."],
    [3, "Samarqand shahrining 2750 yillik yubileyi qaysi yili nishonlangan?", "2007", ["2001", "1997", "2009", "1991"], "Samarqand — dunyodagi eng qadimgi shaharlardan biri."],
    [3, "Xorazmshohlar davlatining poytaxti qaysi shahar bo'lgan?", "Gurganj (Urganch)", ["Buxoro", "Samarqand", "Termiz"], "Gurganj — hozirgi Ko'hna Urganch."]
  ];
  topic("h1", "Tarix · O'zbekiston tarixi: muhim sanalar", H1);

  /* ================= h2 Tarix · Buyuk allomalar va ularning asarlari ================= */
  // [muallif, asar, daraja]
  var ASAR = [
    ["Al-Xorazmiy", "Al-jabr va-l-muqobala", 2], ["Abu Rayhon Beruniy", "Qadimgi xalqlardan qolgan yodgorliklar", 2], ["Abu Rayhon Beruniy", "Hindiston", 3],
    ["Abu Ali ibn Sino", "Tib qonunlari", 1], ["Abu Ali ibn Sino", "Kitob ash-shifo", 3], ["Mirzo Ulug'bek", "Ziji jadidi Ko'ragoniy", 2],
    ["Alisher Navoiy", "Xamsa", 1], ["Alisher Navoiy", "Xazoyin ul-maoniy", 2], ["Alisher Navoiy", "Muhokamat ul-lug'atayn", 2],
    ["Alisher Navoiy", "Mahbub ul-qulub", 3], ["Alisher Navoiy", "Lison ut-tayr", 3], ["Zahiriddin Muhammad Bobur", "Boburnoma", 1],
    ["Mahmud Koshg'ariy", "Devonu lug'otit turk", 2], ["Yusuf Xos Hojib", "Qutadg'u bilig", 2], ["Ahmad Yugnakiy", "Hibat ul-haqoyiq", 3],
    ["Imom al-Buxoriy", "Al-Jome' as-sahih", 2], ["Abu Nasr Forobiy", "Fozil odamlar shahri", 3], ["Abdulla Qodiriy", "O'tkan kunlar", 1],
    ["Abdulla Qodiriy", "Mehrobdan chayon", 2], ["Cho'lpon", "Kecha va kunduz", 2], ["Oybek", "Qutlug' qon", 3],
    ["G'afur G'ulom", "Shum bola", 1], ["Abdulla Qahhor", "O'tmishdan ertaklar", 2], ["Abdulla Qahhor", "Sarob", 3],
    ["Mahmudxo'ja Behbudiy", "Padarkush", 3], ["Abdulla Avloniy", "Turkiy guliston yoxud axloq", 3], ["Hamza Hakimzoda Niyoziy", "Boy ila xizmatchi", 3],
    ["Erkin Vohidov", "Ruhlar isyoni", 3], ["Said Ahmad", "Kelinlar qo'zg'oloni", 2], ["Xudoyberdi To'xtaboyev", "Sariq devni minib", 1],
    ["O'tkir Hoshimov", "Dunyoning ishlari", 2], ["Pirimqul Qodirov", "Yulduzli tunlar", 2], ["Hamid Olimjon", "Oygul bilan Baxtiyor", 3]
  ];
  function genAsar(L) {
    var pool = ASAR.filter(function (x) { return x[2] === L; });
    if (L === 3) pool = pool.concat(ASAR.filter(function (x) { return x[2] === 2; }));
    var it = pick(pool);
    var authors = []; ASAR.forEach(function (x) { if (x[0] !== it[0] && authors.indexOf(x[0]) < 0) authors.push(x[0]); });
    if (Math.random() < 0.6) {
      return Q("\"<b>" + it[1] + "</b>\" asarining muallifi kim?", it[0], shuffle(authors).slice(0, 4), ["\"" + it[1] + "\" — " + it[0] + " asari."]);
    }
    var works = ASAR.filter(function (x) { return x[0] !== it[0]; }).map(function (x) { return x[1]; });
    return Q("Quyidagilardan qaysi biri <b>" + it[0] + "</b> asari?", it[1], shuffle(works).slice(0, 4), ["\"" + it[1] + "\" — " + it[0] + " asari."]);
  }
  var H2 = [
    [1, "Algebra fanining asoschisi deb qaysi olim tan olingan?", "Al-Xorazmiy", ["Ibn Sino", "Beruniy", "Ulug'bek"], "Uning \"Al-jabr va-l-muqobala\" asaridan \"algebra\" so'zi kelib chiqqan."],
    [1, "\"Algoritm\" so'zi qaysi olim nomidan kelib chiqqan?", "Al-Xorazmiy", ["Al-Farg'oniy", "Ibn Sino", "Forobiy"], "Al-Xorazmiy nomi lotinchada \"Algoritmi\" deb yozilgan."],
    [1, "Abu Ali ibn Sino asosan qaysi soha bilan mashhur?", "Tibbiyot", ["Astronomiya", "Tilshunoslik", "Me'morchilik"], "\"Tib qonunlari\" asrlar davomida tibbiyot darsligi bo'lgan."],
    [1, "Mirzo Ulug'bek qaysi fan bilan mashhur?", "Astronomiya", ["Tibbiyot", "Tilshunoslik", "Kimyo"], "Ulug'bek Samarqandda rasadxona qurdirgan."],
    [1, "Alisher Navoiy qaysi shaharda tug'ilgan?", "Hirot", ["Samarqand", "Buxoro", "Andijon"], "Navoiy 1441-yilda Hirotda tug'ilgan."],
    [1, "Alisher Navoiy yashagan yillar qaysi?", "1441–1501", ["1394–1449", "1483–1530", "1336–1405"], "Navoiy — o'zbek mumtoz adabiyotining asoschisi."],
    [1, "Navoiyning \"Xamsa\" asari nechta dostondan iborat?", "5", ["3", "4", "7"], "\"Xamsa\" so'zi \"beshlik\" degan ma'noni bildiradi."],
    [1, "O'zbekiston Davlat madhiyasi so'zlari muallifi kim?", "Abdulla Oripov", ["Erkin Vohidov", "G'afur G'ulom", "Hamid Olimjon"], "Madhiya musiqasi muallifi — Mutal Burhonov."],
    [1, "O'zbekiston Davlat madhiyasi musiqasi muallifi kim?", "Mutal Burhonov", ["Abdulla Oripov", "Yunus Rajabiy", "Muxtor Ashrafiy"], "Madhiya so'zlari muallifi — Abdulla Oripov."],
    [1, "Birinchi o'zbek romani qaysi?", "O'tkan kunlar", ["Kecha va kunduz", "Shum bola", "Boburnoma"], "\"O'tkan kunlar\" muallifi — Abdulla Qodiriy."],
    [1, "Abu Ali ibn Sino Yevropada qanday nom bilan mashhur?", "Avitsenna", ["Alfraganus", "Algoritmi", "Alfarabius"], "Uning asarlari lotin tiliga tarjima qilingan."],
    [2, "Ahmad al-Farg'oniy Yevropada qanday nom bilan mashhur?", "Alfraganus", ["Avitsenna", "Algoritmi", "Averroes"], "Al-Farg'oniyning astronomiyaga oid asari Yevropada keng o'qilgan."],
    [2, "Ahmad al-Farg'oniy qaysi fan bilan mashhur?", "Astronomiya", ["Tibbiyot", "Tarix", "Tilshunoslik"], "U Nil daryosi suvini o'lchaydigan inshootni ham loyihalagan."],
    [2, "Mahmud Koshg'ariyning \"Devonu lug'otit turk\" asari qaysi sohaga oid?", "Tilshunoslik", ["Tibbiyot", "Astronomiya", "Matematika"], "Bu — turkiy so'zlar lug'ati."],
    [2, "Navoiy \"Muhokamat ul-lug'atayn\" asarida qaysi ikki tilni qiyoslagan?", "Turkiy va forsiy", ["Arab va forsiy", "Turkiy va arab", "Turkiy va xitoy"], "Navoiy turkiy tilning boyligini isbotlagan."],
    [2, "Navoiy forsiy tildagi she'rlarida qaysi taxallusni qo'llagan?", "Foniy", ["Navoiy", "Zahiriddin", "Mashrab"], "Turkiy she'rlarida \"Navoiy\", forsiylarida \"Foniy\" taxallusini qo'llagan."],
    [2, "\"Xazoyin ul-maoniy\" nechta devondan iborat?", "4", ["2", "3", "5"], "To'rt devon inson umrining to'rt fasliga mos keladi."],
    [2, "Qaysi doston Navoiyning \"Xamsa\"siga kirmaydi?", "Lison ut-tayr", ["Farhod va Shirin", "Layli va Majnun", "Sab'ai sayyor", "Saddi Iskandariy"], "\"Lison ut-tayr\" — Navoiyning alohida dostoni."],
    [2, "Qaysi doston \"Xamsa\"ning birinchi dostoni hisoblanadi?", "Hayrat ul-abror", ["Farhod va Shirin", "Layli va Majnun", "Saddi Iskandariy"], "\"Xamsa\": Hayrat ul-abror, Farhod va Shirin, Layli va Majnun, Sab'ai sayyor, Saddi Iskandariy."],
    [2, "Abdulla Qodiriy qaysi taxallus bilan ham hajviy asarlar yozgan?", "Julqunboy", ["Cho'lpon", "Foniy", "Hamza"], "Qodiriy \"Julqunboy\" taxallusi bilan hajviyalar yozgan."],
    [2, "Imom al-Buxoriy qaysi shaharda tug'ilgan?", "Buxoro", ["Samarqand", "Termiz", "Xiva"], "Uning nisbasi \"al-Buxoriy\" tug'ilgan shahridan olingan."],
    [2, "Ogahiy qaysi shaharda yashab ijod qilgan?", "Xiva", ["Qo'qon", "Buxoro", "Toshkent"], "Ogahiy — Xorazmlik shoir, tarixchi va tarjimon."],
    [2, "Muqimiy qaysi shaharda yashab ijod qilgan?", "Qo'qon", ["Xiva", "Samarqand", "Buxoro"], "Muqimiy — Qo'qonlik shoir, hajviy she'rlari bilan mashhur."],
    [2, "Furqat qaysi shaharda tug'ilgan?", "Qo'qon", ["Xiva", "Samarqand", "Buxoro"], "Zokirjon Furqat — Qo'qonda tug'ilgan shoir."],
    [2, "Bobur ota tomonidan kimning avlodi bo'lgan?", "Amir Temur", ["Chingizxon", "Shayboniyxon", "Ismoil Somoniy"], "Bobur ota tomonidan temuriylar sulolasiga mansub."],
    [2, "Kamoliddin Behzod qaysi san'at turi bilan mashhur?", "Miniatyura (rassomlik)", ["Musiqa", "Me'morchilik", "Xattotlik"], "Behzod Hirotda ijod qilgan."],
    [3, "Abu Nasr Forobiy qanday faxriy nom bilan ulug'langan?", "Ikkinchi muallim", ["Shayx ur-rais", "Mulk ul-kalom", "Birinchi muallim"], "\"Birinchi muallim\" deb Arastu (Aristotel) atalgan."],
    [3, "Ibn Sino qanday faxriy nom bilan ulug'langan?", "Shayx ur-rais", ["Ikkinchi muallim", "Mulk ul-kalom", "Sulton ul-ulamo"], "\"Shayx ur-rais\" — \"olimlar boshlig'i\" degani."],
    [3, "Navoiy qanday faxriy nom bilan ulug'langan?", "Mulk ul-kalom", ["Shayx ur-rais", "Ikkinchi muallim", "Sohibqiron"], "\"Mulk ul-kalom\" — \"so'z mulkining sultoni\"."],
    [3, "Amir Temur qanday faxriy unvon bilan atalgan?", "Sohibqiron", ["Mulk ul-kalom", "Shayx ur-rais", "Ikkinchi muallim"], "\"Sohibqiron\" — baxtli yulduzlar ostida tug'ilgan degani."],
    [3, "Ibn Sino qaysi qishloqda tug'ilgan?", "Afshona", ["Kat", "Xartang", "Vobkent"], "Afshona Buxoro yaqinida joylashgan."],
    [3, "Beruniy qayerda tug'ilgan?", "Kat (Xorazm)", ["Afshona (Buxoro)", "Hirot", "Termiz"], "Beruniy 973-yilda Xorazmning Kat shahrida tug'ilgan."],
    [3, "Al-Xorazmiy qaysi ilmiy markazda faoliyat yuritgan?", "Bag'doddagi \"Bayt ul-hikma\"", ["Samarqand rasadxonasi", "Ma'mun akademiyasi (Xorazm)", "Qohira universiteti"], "\"Bayt ul-hikma\" — \"Donishmandlik uyi\"."],
    [3, "Ali Qushchi kimning shogirdi va safdoshi bo'lgan?", "Mirzo Ulug'bek", ["Alisher Navoiy", "Ibn Sino", "Bobur"], "Ali Qushchi Ulug'bek rasadxonasida ishlagan astronom."],
    [3, "Cho'lponning asl ismi nima?", "Abdulhamid", ["Abdulla", "Muso", "Zokirjon"], "Abdulhamid Sulaymon o'g'li Cho'lpon."],
    [3, "Oybekning asl ismi nima?", "Muso Toshmuhammad o'g'li", ["Abdulhamid Sulaymon o'g'li", "Zokirjon Xolmuhammad o'g'li", "Abdulla Qodiriy"], "Oybek — \"Navoiy\" va \"Qutlug' qon\" romanlari muallifi."],
    [3, "Birinchi o'zbek dramasi \"Padarkush\" muallifi kim?", "Mahmudxo'ja Behbudiy", ["Abdulla Avloniy", "Hamza", "Fitrat"], "\"Padarkush\" XX asr boshida yozilgan."],
    [3, "Navoiyning \"Muhokamat ul-lug'atayn\" asari qaysi yili yozilgan?", "1499", ["1469", "1483", "1501"], "Navoiy bu asarni umrining oxirlarida yozgan."],
    [3, "Yusuf Xos Hojib \"Qutadg'u bilig\" asarini qaysi asrda yozgan?", "XI asr", ["IX asr", "XIII asr", "XV asr"], "Asar 1069–1070-yillarda yozilgan."]
  ];
  topic("h2", "Tarix · Buyuk allomalar va ularning asarlari", H2, [{ p: 0.4, fn: genAsar }]);

  /* ================= h3 Tarix · Jahon tarixi ================= */
  function rim(n) {
    var v = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], out = "";
    for (var i = 0; i < v.length; i++) while (n >= v[i][0]) { out += v[i][1]; n -= v[i][0]; }
    return out;
  }
  function genAsr(L) {
    var y = L === 1 ? R(2, 20) * 100 - R(1, 98) : R(101, 2025), c = Math.ceil(y / 100);
    if (L === 3 && Math.random() < 0.5) { c = R(5, 20); y = c * 100; }
    if (L >= 2 && Math.random() < 0.35) {
      var c2 = R(3, 20), lo = (c2 - 1) * 100 + 1, hi = c2 * 100;
      return Q("<b>" + rim(c2) + " asr</b> qaysi yillarni o'z ichiga oladi?", lo + "–" + hi, [(lo - 1) + "–" + (hi - 1), (lo + 100) + "–" + (hi + 100), (lo - 100) + "–" + (hi - 100), (lo - 1) + "–" + hi],
        [rim(c2) + " asr: " + lo + "-yildan " + hi + "-yilgacha."]);
    }
    var w = [c - 1, c + 1, c - 2, c + 2, c - 3].filter(function (x) { return x > 0 && x <= 22; }).map(function (x) { return rim(x) + " asr"; });
    return Q("<b>" + y + "</b>-yil qaysi asrga to'g'ri keladi?", rim(c) + " asr", w,
      [y % 100 === 0 ? y + "-yil — " + rim(c) + " asrning oxirgi yili." : "Yuzliklar soni + 1: " + Math.floor(y / 100) + " + 1 = " + c + " → " + rim(c) + " asr."]);
  }
  var H3 = [
    [1, "Xristofor Kolumb Amerikaga qaysi yili yetib borgan?", "1492", ["1498", "1519", "1453", "1501"], "Kolumb Ispaniya qiroli xizmatida g'arbga suzgan."],
    [1, "Insoniyat tarixidagi birinchi kosmonavt kim?", "Yuriy Gagarin", ["Nil Armstrong", "German Titov", "Aleksey Leonov"], "Gagarin 1961-yil 12-aprelda koinotga uchgan."],
    [1, "Inson birinchi marta koinotga qaysi yili uchgan?", "1961", ["1957", "1969", "1965", "1959"], "1961-yil 12-aprel — Yuriy Gagarin parvozi."],
    [1, "Oyga birinchi bo'lib qadam qo'ygan inson kim?", "Nil Armstrong", ["Yuriy Gagarin", "Bazz Oldrin", "Aleksey Leonov"], "Armstrong 1969-yilda \"Apollon-11\" ekspeditsiyasida Oyga tushgan."],
    [1, "Inson birinchi marta Oyga qaysi yili qadam qo'ygan?", "1969", ["1961", "1972", "1965", "1957"], "1969-yil iyulda \"Apollon-11\" Oyga qo'ngan."],
    [1, "Ikkinchi jahon urushi qaysi yillarda bo'lgan?", "1939–1945", ["1914–1918", "1941–1944", "1937–1943", "1945–1950"], "Urush 1939-yil 1-sentabrda boshlangan."],
    [1, "Birinchi jahon urushi qaysi yillarda bo'lgan?", "1914–1918", ["1939–1945", "1905–1910", "1912–1916", "1918–1922"], "Urush 1918-yil noyabrda tugagan."],
    [1, "Misr piramidalarini qadimda qaysi xalq qurgan?", "Qadimgi misrliklar", ["Qadimgi rimliklar", "Qadimgi yunonlar", "Mayyalar"], "Eng mashhurlari — Gizadagi piramidalar."],
    [1, "Telefonni kim ixtiro qilgan?", "Aleksandr Bell", ["Tomas Edison", "Aka-uka Raytlar", "Isaak Nyuton"], "Bell telefonga 1876-yilda patent olgan."],
    [1, "Birinchi boshqariladigan motorli samolyotni kimlar uchirgan?", "Aka-uka Raytlar", ["Aka-uka Lyumerlar", "Aleksandr Bell", "Tomas Edison"], "Raytlar 1903-yilda birinchi parvozni amalga oshirgan."],
    [1, "Cho'g'lanma lampani takomillashtirib, keng tarqatgan ixtirochi kim?", "Tomas Edison", ["Aleksandr Bell", "Isaak Nyuton", "Aka-uka Raytlar"], "Edison 1879-yilda uzoq yonadigan lampa yaratgan."],
    [1, "Butunjahon tortishish qonunini kim kashf etgan?", "Isaak Nyuton", ["Galileo Galiley", "Albert Eynshteyn", "Tomas Edison"], "Nyuton qonuni XVII asrda e'lon qilingan."],
    [1, "BMT (Birlashgan Millatlar Tashkiloti) qaysi yili tashkil topgan?", "1945", ["1939", "1948", "1919", "1991"], "BMT Ikkinchi jahon urushidan keyin tashkil topgan."],
    [1, "Rim imperiyasining poytaxti qaysi shahar bo'lgan?", "Rim", ["Afina", "Qohira", "Parij"], "Imperiya nomi poytaxt nomidan olingan."],
    [2, "Aka-uka Raytlar birinchi samolyotni qaysi yili uchirgan?", "1903", ["1899", "1910", "1908", "1913"], "Parvoz 1903-yil dekabrda AQShda bo'lgan."],
    [2, "Fransuz inqilobi qaysi yili boshlangan?", "1789", ["1776", "1812", "1848", "1799"], "1789-yil 14-iyulda Bastiliya qamoqxonasi egallangan."],
    [2, "Sovet Ittifoqi qaysi yili parchalangan?", "1991", ["1989", "1990", "1992", "1993"], "1991-yil oxirida SSSR rasman tarqatib yuborilgan."],
    [2, "Magellan ekspeditsiyasi dunyo bo'ylab birinchi sayohatni qaysi yillarda amalga oshirgan?", "1519–1522", ["1492–1495", "1498–1502", "1577–1580", "1519–1525"], "Magellanning o'zi safar davomida halok bo'lgan."],
    [2, "Vasko da Gama Yevropadan Hindistonga dengiz yo'lini qaysi yili ochgan?", "1498", ["1492", "1519", "1488", "1453"], "U Afrikani aylanib o'tib, Hindistonga yetib borgan."],
    [2, "Kitob bosish dastgohini Yevropada kim ixtiro qilgan?", "Iogann Gutenberg", ["Tomas Edison", "Leonardo da Vinchi", "Isaak Nyuton"], "Gutenberg dastgohi XV asr o'rtalarida yaratilgan."],
    [2, "Gutenbergning bosma dastgohi qaysi asrda yaratilgan?", "XV asr", ["XIII asr", "XVII asr", "XIX asr"], "Taxminan 1440–1450-yillarda."],
    [2, "Birinchi sun'iy yo'ldosh qaysi yili uchirilgan?", "1957", ["1961", "1969", "1949", "1965"], "1957-yil 4-oktabrda SSSR birinchi sun'iy yo'ldoshni uchirgan."],
    [2, "Ochiq koinotga birinchi chiqqan inson kim?", "Aleksey Leonov", ["Yuriy Gagarin", "Nil Armstrong", "German Titov"], "Leonov 1965-yilda ochiq koinotga chiqqan."],
    [2, "Radioaktivlik sohasidagi tadqiqotlari uchun ikki marta Nobel mukofoti olgan olima kim?", "Mariya Kyuri", ["Ada Lavleys", "Valentina Tereshkova", "Florens Naytingeyl"], "Mariya Kyuri fizika (1903) va kimyo (1911) bo'yicha Nobel mukofoti olgan."],
    [2, "Koinotga uchgan birinchi ayol kim?", "Valentina Tereshkova", ["Mariya Kyuri", "Svetlana Savitskaya", "Salli Rayd"], "Tereshkova 1963-yilda koinotga uchgan."],
    [2, "Nisbiylik nazariyasini kim yaratgan?", "Albert Eynshteyn", ["Isaak Nyuton", "Nikola Tesla", "Mariya Kyuri"], "Eynshteyn XX asr boshida bu nazariyani ishlab chiqqan."],
    [2, "Elementlar davriy jadvalini kim yaratgan?", "Dmitriy Mendeleyev", ["Mariya Kyuri", "Isaak Nyuton", "Lui Paster"], "Mendeleyev davriy qonunni 1869-yilda kashf etgan."],
    [2, "Konstantinopolni Usmonlilar qaysi yili egallagan?", "1453", ["1492", "1402", "1517", "1389"], "Shundan so'ng shahar Istanbul nomi bilan Usmonli poytaxtiga aylangan."],
    [2, "Olimpiya o'yinlari qadimda qaysi mamlakatda boshlangan?", "Qadimgi Yunoniston", ["Qadimgi Rim", "Qadimgi Misr", "Qadimgi Xitoy"], "Zamonaviy Olimpiada o'yinlari 1896-yilda Afinada qayta tiklangan."],
    [2, "Zamonaviy Olimpiya o'yinlari qaysi yili qayta tiklangan?", "1896", ["1900", "1886", "1912", "1924"], "Birinchi zamonaviy Olimpiada Afinada o'tkazilgan."],
    [3, "G'arbiy Rim imperiyasi qaysi yili qulagan?", "476", ["395", "1453", "410", "527"], "476-yil an'anaviy ravishda Antik davrning oxiri hisoblanadi."],
    [3, "Rim imperiyasi qaysi yili G'arbiy va Sharqiy qismlarga bo'lingan?", "395", ["476", "330", "1054", "1453"], "Sharqiy Rim imperiyasi Vizantiya nomi bilan 1453-yilgacha yashagan."],
    [3, "Gizadagi Xeops (Xufu) piramidasi qaysi qadimgi davlatda qurilgan?", "Qadimgi Misr", ["Qadimgi Bobil", "Qadimgi Yunoniston", "Qadimgi Rim"], "Xeops piramidasi — antik dunyoning yetti mo''jizasidan saqlanib qolgan yagonasi."],
    [3, "Antik dunyoning yetti mo''jizasidan bugungacha saqlanib qolgani qaysi?", "Xeops piramidasi", ["Rodos Kolossi", "Bobil osma bog'lari", "Iskandariya mayog'i"], "Qolgan mo''jizalar vayron bo'lgan."],
    [3, "Amerika Qo'shma Shtatlari mustaqilligi qaysi yili e'lon qilingan?", "1776", ["1789", "1812", "1607", "1865"], "Mustaqillik Deklaratsiyasi 1776-yil 4-iyulda qabul qilingan."],
    [3, "Bug' mashinasini takomillashtirib, sanoat inqilobiga hissa qo'shgan ixtirochi kim?", "Jeyms Uatt", ["Tomas Edison", "Aleksandr Bell", "Nikola Tesla"], "Quvvat birligi \"vatt\" uning nomi bilan atalgan."],
    [3, "Sanoat inqilobi birinchi bo'lib qaysi mamlakatda boshlangan?", "Angliya", ["Fransiya", "Germaniya", "AQSH"], "Sanoat inqilobi XVIII asrning ikkinchi yarmida Angliyada boshlangan."],
    [3, "Berlin devori qaysi yili qulagan?", "1989", ["1991", "1985", "1961", "1990"], "1989-yil noyabrda devor buzilgan, 1990-yilda Germaniya birlashgan."],
    [3, "Germaniya qaysi yili birlashgan?", "1990", ["1989", "1991", "1945", "1971"], "Berlin devori 1989-yilda qulagan, birlashuv 1990-yilda bo'lgan."],
    [3, "Yevropa Ittifoqi qaysi shartnoma asosida tashkil topgan?", "Maastrixt shartnomasi", ["Versal shartnomasi", "Vestfaliya shartnomasi", "Tordesilyas shartnomasi"], "Maastrixt shartnomasi 1992-yilda imzolangan."],
    [3, "Birinchi jahon urushidan keyin 1919-yilda imzolangan tinchlik shartnomasi qaysi?", "Versal shartnomasi", ["Maastrixt shartnomasi", "Vestfaliya shartnomasi", "Parij shartnomasi (1856)"], "Versal shartnomasi Germaniya bilan tuzilgan."],
    [3, "Penitsillin qaysi yili kashf etilgan?", "1928", ["1918", "1945", "1938", "1908"], "Penitsillinni Aleksandr Fleming kashf etgan."],
    [3, "Qaysi ixtirochi o'zgaruvchan tok tizimlari bilan mashhur?", "Nikola Tesla", ["Tomas Edison", "Jeyms Uatt", "Aleksandr Bell"], "Magnit induksiya birligi \"tesla\" uning nomi bilan atalgan."],
    [3, "Pyotr I qaysi shaharga asos solgan?", "Sankt-Peterburg", ["Moskva", "Novgorod", "Kiyev"], "Sankt-Peterburg 1703-yilda asos solingan."]
  ];
  topic("h3", "Tarix · Jahon tarixi", H3, [{ p: 0.25, fn: function (L) { return L === 3 && Math.random() < 0.5 ? null : genAsr(L); } }]);

  /*@@ DAVOMI @@*/
})();
