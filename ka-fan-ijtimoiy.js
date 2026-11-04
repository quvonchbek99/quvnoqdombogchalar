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

  /*@@ DAVOMI @@*/
})();
