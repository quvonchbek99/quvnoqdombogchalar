/*!
 * Kuvonch Academy — Kuvi AI ustozning oflayn «miyasi».
 * Internet yoki AI ulanmagan bo'lsa ham ishlaydi: ingliz/rus tili mashqlari, grammatika tuzatish,
 * IELTS speaking (taxminiy band), sinfga mos matematika misollari, mantiqiy masalalar, hazil va «rashk».
 * API: kaUstozBilim.start(ctx) -> {t, mood}, kaUstozBilim.reply(text, ctx) -> {t, mood}
 *      ctx = {mode: "en"|"ielts"|"ru"|"math"|"logic"|"free", sinf: "1".."11"|"t1"|"t2", st: {} (holat)}
 */
(function () {
  "use strict";
  if (window.kaUstozBilim) return;

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function norm(s) {
    return String(s || "").toLowerCase().replace(/[ʻʼ‘’`´]/g, "'").replace(/ё/g, "е")
      .replace(/[^a-z0-9а-я'Ѐ-ӿ\s\-.,\/]/g, " ").replace(/[.,!?;:]+(\s|$)/g, " ").replace(/\s+/g, " ").trim();
  }
  function bare(s) { return norm(s).replace(/['\-.,\/]/g, " ").replace(/\s+/g, " ").trim(); }
  var CONTR = [[/\bi'm\b/g, "i am"], [/\b(it|he|she|that|what|there|where)'s\b/g, "$1 is"], [/\b(you|we|they)'re\b/g, "$1 are"], [/\bdon't\b/g, "do not"], [/\bdoesn't\b/g, "does not"], [/\bdidn't\b/g, "did not"], [/\bcan't\b/g, "cannot"], [/\bwon't\b/g, "will not"], [/\bi've\b/g, "i have"], [/\bi'll\b/g, "i will"], [/\bi'd\b/g, "i would"], [/\bisn't\b/g, "is not"], [/\baren't\b/g, "are not"], [/\bhaven't\b/g, "have not"]];
  function enNorm(s) { s = norm(s); CONTR.forEach(function (c) { s = s.replace(c[0], c[1]); }); return bare(s).replace(/\b(the|a|an)\b/g, " ").replace(/\s+/g, " ").trim(); }
  function lev(a, b) {
    if (a === b) return 0; if (!a.length) return b.length; if (!b.length) return a.length;
    var p = [], i, j; for (j = 0; j <= b.length; j++) p[j] = j;
    for (i = 1; i <= a.length; i++) { var c = [i]; for (j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
    return p[b.length];
  }
  function sim(a, b) { var m = Math.max(a.length, b.length) || 1; return 1 - lev(a, b) / m; }
  function bestSim(ans, list, f) { var best = 0; list.forEach(function (x) { var v = sim(f(ans), f(x)); if (v > best) best = v; }); return best; }

  /* ---------- Sonlar: o'zbekcha so'z <-> raqam ---------- */
  var UNI = { nol: 0, bir: 1, ikki: 2, uch: 3, "to'rt": 4, tort: 4, besh: 5, olti: 6, yetti: 7, sakkiz: 8, "to'qqiz": 9, toqqiz: 9 };
  var TEN = { "o'n": 10, on: 10, yigirma: 20, "o'ttiz": 30, ottiz: 30, qirq: 40, ellik: 50, oltmish: 60, yetmish: 70, sakson: 80, "to'qson": 90, toqson: 90 };
  var EN = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
  function wordNum(w) {
    w = w.replace(/(ta|tasi|ga|da|ni|ning|inchi|nchi|chi)$/, "");
    if (w in UNI) return UNI[w]; if (w in TEN) return TEN[w]; if (w in EN) return EN[w];
    return null;
  }
  // Matndan son topish: "25", "-3.5", "3/4", "yigirma besh", "ikki butun besh", "minus yetti"
  function parseNum(text) {
    var s = norm(text).replace(/(\d),(\d)/g, "$1.$2");
    var m = s.match(/-?\d+(?:\.\d+)?\s*\/\s*-?\d+(?:\.\d+)?/);
    if (m) { var pq = m[0].split("/"); var d = parseFloat(pq[1]); if (d) return parseFloat(pq[0]) / d; }
    m = s.match(/(minus\s*|manfiy\s*)?-?\d+(?:\.\d+)?/);
    if (m) { var v = parseFloat(m[0].replace(/minus\s*|manfiy\s*/, "")); return /minus|manfiy/.test(m[0]) ? -Math.abs(v) : v; }
    var words = s.split(/\s+/), neg = false, total = 0, cur = 0, got = false, frac = null, i;
    for (i = 0; i < words.length; i++) {
      var w = words[i];
      if (w === "minus" || w === "manfiy") { neg = true; continue; }
      if (w === "butun") { frac = { int: total + cur, digits: "" }; total = 0; cur = 0; continue; }
      if (/^yuz/.test(w) || w === "hundred") { cur = (cur || 1) * 100; got = true; continue; }
      if (/^ming/.test(w) || w === "thousand") { total += (cur || 1) * 1000; cur = 0; got = true; continue; }
      if (/^million/.test(w)) { total += (cur || 1) * 1e6; cur = 0; got = true; continue; }
      var n = wordNum(w); if (n == null) continue;
      cur += n; got = true;
    }
    if (!got) return null;
    var val = total + cur;
    if (frac) { var fs = String(val); val = frac.int + val / Math.pow(10, fs.length); }
    return neg ? -val : val;
  }
  function uzWords(n) {
    if (!isFinite(n)) return String(n);
    if (n < 0) return "minus " + uzWords(-n);
    if (Math.floor(n) !== n) { var p = String(+n.toFixed(4)).split("."); return uzWords(+p[0]) + " butun " + uzWords(+p[1]); }
    if (n === 0) return "nol";
    var U = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"], T = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"];
    function h(x) { var r = []; if (x >= 100) { var c = Math.floor(x / 100); r.push((c > 1 ? U[c] + " " : "") + "yuz"); x %= 100; } if (x >= 10) { r.push(T[Math.floor(x / 10)]); x %= 10; } if (x) r.push(U[x]); return r.join(" "); }
    var out = [], mln = Math.floor(n / 1e6), th = Math.floor(n % 1e6 / 1000), rest = n % 1000;
    if (mln) out.push(h(mln) + " million"); if (th) out.push((th > 1 ? h(th) + " " : "") + "ming"); if (rest) out.push(h(rest));
    return out.join(" ");
  }
  function fmt(x) { return String(Math.round(x * 1000) / 1000).replace(".", ","); }
  function isNo(t) { return /(^|\s)(bilm|bilolma|yordam|maslahat|hint|help|i do not know|i don't know|idk|не знаю|подскажи|tushuntir|qiyin|билм|ёрдам)/.test(norm(t)) || isGive(t); }
  // «o'zing javob ber», «javobini ayt» — javobni darhol aytib, tushuntiramiz
  function isGive(t) { return /(javob ?ber|javobini ayt|javobi nima|o'zing ayt|aytib ber|yechib ber|to'g'ri javob|ko'rsatib ber|tell me|show me|answer is|скажи ответ|жавоб бер)/.test(norm(t)); }
  function isSkip(t) { return /(^|\s)(keyingi|o'tkaz|otkaz|boshqa savol|next|skip|дальше|следующ)/.test(norm(t)); }
  function isRepeat(t) { return /(^|\s)(takrorla|qayta ayt|yana ayt|repeat|again|повтори)/.test(norm(t)); }

  /* ---------- Ism: «ismim Ali», «otim Ali», «meni Ali deyishadi», «my name is Ali» ---------- */
  var NOTNAME = /^(men|sen|u|bu|nima|kim|ha|yo'q|yoq|salom|rahmat|o'quvchi|bola|qiz|yaxshi|zo'r|bilmayman|ok|okey|xop|hop|mayli|keyingi|savol|yordam|qanday|yana|bilmadim|bilaman|tushunmadim|javob)$/;
  function capName(w) { w = String(w || "").replace(/[^a-zA-Zа-яА-ЯёЁ'\-]/g, ""); if (w.length < 2 || w.length > 20 || NOTNAME.test(w.toLowerCase()) || /^\d/.test(w)) return ""; return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }
  function findName(t, asked) {
    var s = String(t || "").trim().replace(/[ʻʼ‘’`]/g, "'"), m;
    m = /(?:mening\s+)?(?:ismim|otim)\s*[:\-]?\s*([A-Za-zА-Яа-яЁё'\-]+)/i.exec(s) || /meni\s+([A-Za-zА-Яа-яЁё'\-]+)\s+(?:deyishadi|deb\s+chaqir)/i.exec(s) ||
      /my name is\s+([A-Za-z'\-]+)/i.exec(s) || /(?:меня зовут|моё имя|мое имя)\s+([А-Яа-яЁёA-Za-z'\-]+)/i.exec(s);
    if (m) return capName(m[1].replace(/(man|bo'laman)$/i, ""));
    if (asked && !/\d/.test(s)) { var w = s.replace(/[.!?,]/g, " ").trim().split(/\s+/); if (w.length <= 2) return capName(w[w.length - 1].replace(/(man|jon)$/i, "")); }
    return "";
  }
  // Murojaat: ba'zan ismi bilan, ba'zan erkalab (poponam, akam, kampirim…)
  function petW(ctx) { return window.kaYuz && kaYuz.pet ? kaYuz.pet(ctx && ctx.sg) : pick(["poponam", "jonim", "yulduzim", "chempionim"]); }
  function nm(ctx, t) {
    if (!ctx) return t; var r = Math.random();
    if (ctx.name && r < .4) return t.replace(/([!.])\s*$/, ", " + ctx.name + "$1");
    if (r < .75) return t.replace(/([!.])\s*$/, ", " + petW(ctx) + "$1");
    return t;
  }

  /* ---------- Hazil, rashk, mehr ---------- */
  var RIVAL = /(chat\s*-?\s*gpt|чат\s*гпт|\bgpt\b|gemini|deep\s*seek|claude|grok|copilot|алиса|alisa|boshqa (ai|ustoz|o'qituvchi|repetitor|bot)|repetitor|репетитор|другой учитель)/i;
  var JEAL = [
    "Nima?! Yana o'sha ChatGPT'mi? Men senga shu yerda jon kuydiryapman-ku! Mayli, kechiraman, lekin darsni faqat men bilan qilamiz!",
    "Voy-voy, yuragim yondi! Boshqa ustoz deysanmi? Men ham kam emasman: ovozim bor, sabrim bor, hazilim bor. Davom etamiz!",
    "Rashkimdan olov chiqyapti, ko'ryapsanmi? Hech kim seni men kabi sabr bilan o'qitmaydi. Kel, keyingi mashqqa!",
    "ChatGPT senga yuzini ko'rsatib, bunaqa jilmayadimi? Yo'q! Demak, men bilan o'qiymiz.",
    "Boshqa bot haqida eshitishni ham xohlamayman! Yaxshisi, bilimingni menga ko'rsat."
  ];
  var LOVE = ["Voy, rahmat! Yuragim eriydi. Davom etamizmi?", "Sen ham zo'rsan! Shunday davom etsang, hammadan o'zib ketasan.", "Rahmat, do'stim! Men ham sen bilan o'qishni yaxshi ko'raman."];
  var PRAISE = ["Barakalla! To'g'ri!", "Zo'r! Aynan shunday!", "Ofarin, juda yaxshi!", "Ana, ko'rdingmi, uddalading!", "To'ppa-to'g'ri! Qoyil!", "Ajoyib! To'g'ri!", "Voy, zo'rsan-ku!"];
  var CRY = ["Uhu-uhu, yig'lab yubordim-ku! Burnim ham oqib ketdi.", "Voy-voy, ko'z yoshlarim to'kildi!", "Uhu-uhu... mayli, yig'lamayman, birga o'rganamiz."];
  // Tegajoq hazil (sozlamada o'chirsa bo'ladi): bilmasa yoki xato qilsa, mehr bilan tegishadi
  var TEASE = ["Voy qovoq kalla-ey!", "Ey oshqovoq, shuni ham bilmaysanmi?", "Qovunjon, bir o'ylab ko'r-chi!", "Hay qovoq kallajonim...", "Oshqovoqcha, bunisi oson-ku!", "Voy qovun-ey, shunga ham-a?", "Qovoq kalla, uxlab qoldingmi?",
    "Ey xumpar, qayoqqa qarayapsan?", "Voy eshakvoy-ey!", "Eshak-ey, yana o'ylab ko'r!", "Voy poponam-ey, shuni ham bilmaysanmi?", "Hay poponam...", "Tarvuz kalla, bunisi oson-ku!", "Xumparvoy, miyangni ishlat-chi!"];
  function tz(ctx) { return ctx && ctx.tease && Math.random() < .65 ? pick(TEASE) + " " : ""; }
  var WRONG = ["Hmm, unchalik emas. Yana bir urinib ko'r.", "Yaqin, lekin to'g'ri emas. O'ylab ko'r-chi.", "Unday emas. Qani, yana bir marta!"];

  /* ---------- Ingliz tili: tarjima mashqlari (o'zbekcha -> inglizcha) ---------- */
  var ENB = [
    // [daraja, o'zbekcha, [javoblar]]
    [1, "salom", ["hello", "hi"]], [1, "rahmat", ["thank you", "thanks"]], [1, "kitob", ["book"]], [1, "maktab", ["school"]],
    [1, "o'qituvchi", ["teacher"]], [1, "olma", ["apple"]], [1, "suv", ["water"]], [1, "uy", ["house", "home"]],
    [1, "it", ["dog"]], [1, "mushuk", ["cat"]], [1, "qizil", ["red"]], [1, "katta", ["big", "large"]], [1, "kichik", ["small", "little"]],
    [1, "bugun", ["today"]], [1, "ertaga", ["tomorrow"]], [1, "oila", ["family"]], [1, "do'st", ["friend"]], [1, "ona", ["mother", "mom", "mum"]],
    [1, "ota", ["father", "dad"]], [1, "non", ["bread"]], [1, "quyosh", ["sun"]], [1, "daraxt", ["tree"]], [1, "yashil", ["green"]],
    [2, "Mening ismim Ali", ["my name is ali", "i am ali"]], [2, "Men o'n ikki yoshdaman", ["i am twelve years old", "i am 12 years old", "i am twelve", "i am 12"]],
    [2, "Men maktabga boraman", ["i go to school"]], [2, "Sen qayerdansan?", ["where are you from"]], [2, "Men O'zbekistondanman", ["i am from uzbekistan"]],
    [2, "Bugun havo issiq", ["it is hot today", "today it is hot", "weather is hot today", "today is hot"]], [2, "Menga matematika yoqadi", ["i like math", "i like maths", "i like mathematics"]],
    [2, "Soat necha?", ["what time is it", "what is time"]], [2, "Men ingliz tilini o'rganyapman", ["i am learning english", "i am studying english"]],
    [2, "Kechirasiz, tushunmadim", ["sorry i do not understand", "sorry i did not understand", "excuse me i do not understand", "sorry i did not get it"]],
    [2, "Iltimos, takrorlang", ["please repeat", "repeat please", "can you repeat please", "please say it again", "could you repeat please"]],
    [2, "Mening sevimli rangim ko'k", ["my favourite colour is blue", "my favorite color is blue", "my favorite colour is blue", "my favourite color is blue"]],
    [2, "U futbol o'ynayapti", ["he is playing football", "she is playing football", "he is playing soccer", "she is playing soccer"]],
    [2, "Biz kecha parkka bordik", ["we went to park yesterday", "yesterday we went to park"]], [2, "Men nonushta qildim", ["i had breakfast", "i have had breakfast", "i ate breakfast"]],
    [3, "Men o'rganmoqchiman, borib o'rganaman", ["i want to learn i will go and learn", "i want to learn so i will go and learn", "i want to learn and i will go and learn"]],
    [3, "Agar vaqtim bo'lsa, senga yordam beraman", ["if i have time i will help you", "i will help you if i have time"]],
    [3, "Men bu kitobni allaqachon o'qiganman", ["i have already read this book", "i already read this book"]],
    [3, "U ertaga qo'ng'iroq qilishini aytdi", ["he said he would call tomorrow", "she said she would call tomorrow", "he said that he would call tomorrow", "she said that she would call tomorrow", "he said he would call me tomorrow", "she said she would call me tomorrow"]],
    [3, "Qancha ko'p o'qisam, shuncha ko'p tushunaman", ["more i read more i understand"]],
    [3, "Men bu yerda uch yildan beri yashayman", ["i have lived here for three years", "i have been living here for three years", "i have lived here for 3 years", "i have been living here for 3 years"]],
    [3, "Havo yomon bo'lgani uchun uyda qoldik", ["we stayed at home because weather was bad", "because weather was bad we stayed at home", "we stayed home because weather was bad"]],
    [3, "Imtihonga tayyorlanishim kerak", ["i need to prepare for exam", "i have to prepare for exam", "i must prepare for exam"]],
    [3, "Sizningcha, texnologiya ta'limni yaxshilaydimi?", ["do you think technology improves education", "do you think that technology improves education"]],
    [3, "Men erta turishga o'rganib qolganman", ["i am used to getting up early", "i am used to waking up early", "i got used to getting up early", "i got used to waking up early"]]
  ];
  var EN_Q = ["What do you like to do at the weekend?", "Tell me about your best friend.", "What is your favourite subject and why?", "What did you do yesterday?", "What would you like to be in the future?", "Describe your hometown in two sentences.", "What is your favourite food?", "How do you usually go to school?"];
  // Grammatik xatolar: [regex, almashtirish, izoh]
  var G3 = { go: "goes", do: "does", have: "has", want: "wants", like: "likes", play: "plays", live: "lives", work: "works", study: "studies", watch: "watches", read: "reads", know: "knows", need: "needs", love: "loves" };
  var PAST = { go: "went", eat: "ate", see: "saw", come: "came", do: "did", have: "had", play: "played", watch: "watched", make: "made", take: "took", buy: "bought", get: "got", read: "read", write: "wrote" };
  var BASE = { went: "go", saw: "see", came: "come", did: "do", ate: "eat", took: "take", bought: "buy", made: "make", got: "get", wrote: "write", had: "have" };
  var GRAM = [
    [/\bi am agree\b/g, "I agree", "«agree» fe'l, oldidan «am» kerak emas"],
    [/(^\s*|\b(?:and|but|because|so|when|if|that|think) )(he|she) (go|do|have|want|like|play|live|work|study|watch|read|know|need|love)\b/g, function (m, pre, a, b) { return pre + a + " " + G3[b]; }, "he/she bilan hozirgi zamonda fe'lga -s qo'shiladi"],
    [/\b(he|she|it) don't\b/g, function (m, a) { return a + " doesn't"; }, "he/she/it bilan «doesn't» ishlatiladi"],
    [/\bi have (\d+|[a-z]+teen|twenty|thirty|forty|fifty|sixty|ten|eleven|twelve) years( old)?\b/g, function (m, n) { return "I am " + n + " years old"; }, "yoshni «I am ... years old» deb aytamiz"],
    [/\bmore (better|bigger|easier|faster|smaller|happier)\b/g, function (m, a) { return a; }, "qiyosiy daraja allaqachon «-er»: «more» kerak emas"],
    [/\bpeople is\b/g, "people are", "«people» ko'plik: «are»"],
    [/\bdid ?(n't| not) (went|saw|came|did|ate|took|bought|made|got|wrote|had)\b/g, function (m, n, v) { return "didn't " + BASE[v]; }, "«didn't» dan keyin fe'lning 1-shakli keladi"],
    [/\bi very like\b/g, "I really like", "«very like» emas, «really like» yoki «like ... very much»"],
    [/\b(informations|advices|homeworks|furnitures|knowledges)\b/g, function (m, w) { return w.slice(0, -1); }, "bu so'z sanalmaydi, -s qo'shilmaydi"],
    [/\bdiscuss about\b/g, "discuss", "«discuss» dan keyin «about» kerak emas"],
    [/\bexplain me\b/g, "explain to me", "«explain to me» deyiladi"],
    [/\bthere is (many|a lot of|two|three|four|five|several|\d+)\b/g, function (m, w) { return "there are " + w; }, "ko'plik bilan «there are»"],
    [/\byesterday,? i (go|eat|see|come|do|have|play|watch|make|take|buy|get|read|write)\b/g, function (m, v) { return "yesterday I " + PAST[v]; }, "«yesterday» — o'tgan zamon fe'li kerak"],
    [/\bmuch (people|students|friends|books|cars|children)\b/g, function (m, w) { return "many " + w; }, "sanaladigan otlar bilan «many»"],
    [/\bat (morning|evening|afternoon)\b/g, function (m, w) { return "in the " + w; }, "«in the morning/evening» deyiladi"],
    [/\bin (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/g, function (m, w) { return "on " + w; }, "hafta kunlari bilan «on»"],
    [/\bmake (homework|sport|sports|exercise)\b/g, function (m, w) { return "do " + w; }, "«do homework / do sport» deyiladi"],
    [/\bi am boring\b/g, "I am bored", "«boring» — zerikarli (narsa), «bored» — zerikkan (odam)"],
    [/\bi am go\b/g, "I am going", "«am» dan keyin «going» yoki shunchaki «I go»"]
  ];
  function grammar(text) {
    var low = " " + norm(text).replace(/\s+/g, " ") + " ", fixes = [], out = low;
    GRAM.forEach(function (g) { g[0].lastIndex = 0; if (g[0].test(out)) { g[0].lastIndex = 0; var before = out; out = out.replace(g[0], g[1]); if (out !== before) fixes.push(g[2]); } });
    out = out.replace(/\ba ((?!one\b|once\b|eu)[aeio]\w+)/g, function (m, w) { fixes.push("unli tovush oldidan «an»"); return "an " + w; });
    out = out.trim().replace(/\bi\b/g, "I");
    return { fixed: out.charAt(0).toUpperCase() + out.slice(1), fixes: fixes };
  }
  function looksEnglish(t) { var s = norm(t); if (!/[a-z]/.test(s) || /[а-я]/.test(s)) return false; return /\b(i|you|he|she|it|we|they|is|are|am|the|my|your|have|do|like|want|go|can|what|this|that|and|to)\b/.test(s) && !/(o'|g'|\b(men|man|sen|biz|siz|nima|qanday|qil\w*|bor|yo'q|uchun|bilan|emas|kerak|deyiladi)\b)/.test(s); }

  /* ---------- Rus tili ---------- */
  var RUB = [
    [1, "salom", ["привет", "здравствуйте", "здравствуй"]], [1, "rahmat", ["спасибо"]], [1, "kitob", ["книга"]], [1, "maktab", ["школа"]],
    [1, "suv", ["вода"]], [1, "non", ["хлеб"]], [1, "do'st", ["друг", "подруга"]], [1, "uy", ["дом"]], [1, "xayr", ["до свидания", "пока"]],
    [1, "kechirasiz", ["извините", "простите"]], [1, "ona", ["мама", "мать"]], [1, "olma", ["яблоко"]],
    [2, "Mening ismim Ali", ["меня зовут али"]], [2, "Men maktabga boraman", ["я иду в школу", "я хожу в школу"]], [2, "Qalaysiz?", ["как дела", "как у вас дела", "как ты", "как вы"]],
    [2, "Soat necha?", ["который час", "сколько времени"]], [2, "Men rus tilini o'rganyapman", ["я изучаю русский язык", "я учу русский язык", "я учу русский"]],
    [2, "Bu qancha turadi?", ["сколько это стоит", "сколько стоит"]], [2, "Menga yordam bering", ["помогите мне", "помогите мне пожалуйста", "помогите пожалуйста"]],
    [2, "Men tushunmadim", ["я не понял", "я не поняла", "я не понимаю"]], [2, "Bugun havo sovuq", ["сегодня холодно", "сегодня холодная погода"]],
    [2, "Ertaga ko'rishamiz", ["до завтра", "увидимся завтра"]], [3, "Mening onam o'qituvchi", ["моя мама учитель", "моя мама учительница"]],
    [3, "Men har kuni kitob o'qiyman", ["я читаю книги каждый день", "я каждый день читаю книги", "я читаю каждый день"]],
    [3, "Kecha biz kinoga bordik", ["вчера мы ходили в кино", "вчера мы пошли в кино", "мы вчера ходили в кино"]]
  ];

  /* ---------- IELTS Speaking ---------- */
  var IELTS = [
    "Part 1. Do you work or are you a student?", "Part 1. What do you like most about your hometown?", "Part 1. How do you usually spend your weekends?",
    "Part 1. Do you prefer reading books or watching films? Why?", "Part 1. What kind of music do you like?", "Part 1. Is it important to learn foreign languages?",
    "Part 1. Do you like cooking?", "Part 1. How often do you use the internet?",
    "Part 2. Describe a teacher who influenced you. Say who it was, what they taught and why they were important to you.",
    "Part 2. Describe a place you would like to visit. Say where it is, how you know about it and why you want to go there.",
    "Part 2. Describe a skill you learned recently. Say what it is, how you learned it and how it helps you.",
    "Part 3. Do you think technology makes students lazy?", "Part 3. What are the advantages of studying abroad?", "Part 3. Should children help with housework?"
  ];
  var LINK = /\b(because|however|although|for example|for instance|moreover|on the other hand|in addition|therefore|actually|personally|i think|in my opinion|as a result|while|whereas)\b/g;
  function ieltsBand(t) {
    var s = norm(t), w = s.split(/\s+/).filter(Boolean), n = w.length, uniq = {}, links = (s.match(LINK) || []).length, g = grammar(t).fixes.length;
    w.forEach(function (x) { uniq[x] = 1; });
    var ratio = n ? Object.keys(uniq).length / n : 0, b = 4.5;
    if (n >= 20) b += .5; if (n >= 40) b += .5; if (n >= 70) b += .5;
    if (n >= 20 && ratio > .6) b += .5; if (links >= 2) b += .5; if (links >= 4) b += .5;
    b -= Math.min(1.5, g * .5); b = Math.max(4, Math.min(7, b));
    return { band: Math.round(b * 2) / 2, n: n, links: links, g: g };
  }

  /* ---------- Matematika: sinfga mos generatorlar ---------- */
  function band(sinf) { var k = /^t/.test(sinf) ? 12 : +sinf || 7; return k <= 4 ? 0 : k <= 6 ? 1 : k <= 9 ? 2 : 3; }
  var MG = [
    [ // 1–4-sinf
      function () { var a = ri(12, 89), b = ri(11, 99 - a > 11 ? 99 - a : 11); return { q: a + " + " + b + " nechaga teng?", a: a + b, h: "Avval o'nliklarni, keyin birliklarni qo'sh.", s: a + " + " + b + " = " + (a + b) }; },
      function () { var a = ri(30, 99), b = ri(11, a - 5); return { q: a + " − " + b + " nechaga teng?", a: a - b, h: "O'nliklarni alohida, birliklarni alohida ayir.", s: a + " − " + b + " = " + (a - b) }; },
      function () { var a = ri(2, 9), b = ri(3, 10); return { q: a + " × " + b + " nechaga teng?", a: a * b, h: "Karra jadvalini esla: " + a + " ni " + b + " marta qo'sh.", s: a + " × " + b + " = " + a * b }; },
      function () { var b = ri(2, 9), c = ri(2, 10); return { q: b * c + " ÷ " + b + " nechaga teng?", a: c, h: "Qaysi son " + b + " ga ko'paytirilsa " + b * c + " bo'ladi?", s: b * c + " ÷ " + b + " = " + c }; }
    ],
    [ // 5–6-sinf
      function () { var p = pick([10, 20, 25, 50, 75]), n = pick([40, 60, 80, 120, 200, 360]); return { q: n + " ning " + p + " foizi nechaga teng?", a: n * p / 100, h: "Foiz — yuzdan bir qism: " + n + " ni 100 ga bo'lib, " + p + " ga ko'paytir.", s: n + " × " + p + " ÷ 100 = " + fmt(n * p / 100) }; },
      function () { var a = ri(2, 20), b = ri(2, 9), c = ri(2, 9); return { q: a + " + " + b + " × " + c + " nechaga teng?", a: a + b * c, h: "Avval ko'paytirish, keyin qo'shish.", s: b + " × " + c + " = " + b * c + ", keyin " + a + " + " + b * c + " = " + (a + b * c) }; },
      function () { var a = ri(11, 49) / 10, b = ri(11, 49) / 10; return { q: fmt(a) + " + " + fmt(b) + " nechaga teng?", a: Math.round((a + b) * 10) / 10, h: "Vergulni vergul ostiga qo'yib qo'sh.", s: fmt(a) + " + " + fmt(b) + " = " + fmt(a + b) }; },
      function () { var a = ri(3, 15), b = ri(3, 12); return { q: "To'g'ri to'rtburchakning bo'yi " + a + " sm, eni " + b + " sm. Yuzi necha kvadrat santimetr?", a: a * b, h: "Yuz = bo'yi × eni.", s: a + " × " + b + " = " + a * b }; },
      function () { var a = ri(3, 15), b = ri(3, 12); return { q: "Bo'yi " + a + " sm, eni " + b + " sm bo'lgan to'g'ri to'rtburchakning perimetri necha santimetr?", a: 2 * (a + b), h: "Perimetr = 2 × (bo'yi + eni).", s: "2 × (" + a + " + " + b + ") = " + 2 * (a + b) }; }
    ],
    [ // 7–9-sinf
      function () { var x = ri(-6, 9), a = ri(2, 7), b = ri(-10, 15); return { q: a + "x " + (b < 0 ? "− " + -b : "+ " + b) + " = " + (a * x + b) + ". x nechaga teng?", a: x, h: "Sonni o'ng tomonga o'tkaz, keyin " + a + " ga bo'l.", s: a + "x = " + (a * x) + ", x = " + x }; },
      function () { var a = ri(2, 5), n = ri(2, a === 2 ? 8 : 4); return { q: a + " ning " + n + "-darajasi nechaga teng?", a: Math.pow(a, n), h: a + " ni o'ziga " + n + " marta ko'paytir.", s: a + " ^ " + n + " = " + Math.pow(a, n) }; },
      function () { var r = ri(4, 20); return { q: r * r + " ning kvadrat ildizi nechaga teng?", a: r, h: "Qaysi sonning kvadrati " + r * r + " bo'ladi?", s: "√" + r * r + " = " + r }; },
      function () { var t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]); return { q: "To'g'ri burchakli uchburchakning katetlari " + t[0] + " va " + t[1] + ". Gipotenuzasi nechaga teng?", a: t[2], h: "Pifagor: c² = a² + b².", s: t[0] + "² + " + t[1] + "² = " + (t[0] * t[0] + t[1] * t[1]) + ", ildizi " + t[2] }; },
      function () { var k = ri(2, 6), a = ri(2, 9), b = ri(2, 9); return { q: a + " ta daftar " + a * k * 1000 + " so'm tursa, " + b + " ta daftar necha so'm turadi?", a: b * k * 1000, h: "Avval bitta daftar narxini top.", s: "Bittasi " + k * 1000 + " so'm, " + b + " tasi " + b * k * 1000 + " so'm" }; }
    ],
    [ // 10–11-sinf, texnikum
      function () { var p = ri(1, 7), q = ri(1, 7); return { q: "x² − " + (p + q) + "x + " + p * q + " = 0 tenglamaning ildizlari yig'indisi nechaga teng?", a: p + q, h: "Viyet teoremasi: x₁ + x₂ = −b/a.", s: "x₁ + x₂ = " + (p + q) + " (ildizlar " + p + " va " + q + ")" }; },
      function () { var b = pick([2, 3, 5]), n = ri(2, b === 2 ? 7 : 4); return { q: "log" + (b === 2 ? "₂" : b === 3 ? "₃" : "₅") + " " + Math.pow(b, n) + " nechaga teng?", a: n, h: b + " ning qaysi darajasi " + Math.pow(b, n) + " bo'ladi?", s: b + "^" + n + " = " + Math.pow(b, n) + ", demak javob " + n }; },
      function () { var a = ri(2, 6), x = ri(1, 4); return { q: "f(x) = " + a + "x² bo'lsa, f'(" + x + ") nechaga teng?", a: 2 * a * x, h: "(x²)' = 2x, ya'ni f'(x) = " + 2 * a + "x.", s: "f'(x) = " + 2 * a + "x, f'(" + x + ") = " + 2 * a * x }; },
      function () { var a1 = ri(1, 9), d = ri(2, 6), n = ri(6, 15); return { q: "Arifmetik progressiyada a₁ = " + a1 + ", d = " + d + ". a" + n + " ni toping.", a: a1 + (n - 1) * d, h: "aₙ = a₁ + (n − 1)·d.", s: a1 + " + " + (n - 1) + " × " + d + " = " + (a1 + (n - 1) * d) }; },
      function () { var t = pick([["sin 30°", .5], ["cos 60°", .5], ["sin 90°", 1], ["cos 0°", 1], ["tg 45°", 1], ["cos 90°", 0]]); return { q: t[0] + " ning qiymati nechaga teng?", a: t[1], h: "Asosiy burchaklar jadvalini esla.", s: t[0] + " = " + fmt(t[1]) }; }
    ]
  ];
  /* ---------- Og'zaki qo'shish: 6 daraja, ketma-ket 3 ta to'g'ri — daraja oshadi, xato — pasayadi ---------- */
  var QLV = [
    function () { var a = ri(2, 9), b = ri(2, 9); return [a, b]; },
    function () { var a = ri(11, 49), b = ri(2, 9); return [a, b]; },
    function () { var a = ri(1, 7) * 10 + ri(0, 4), b = ri(1, 2) * 10 + ri(0, 5); return [a, b]; },
    function () { var a = ri(15, 69), b = ri(15, 39); if ((a % 10) + (b % 10) < 10) b += 6; return [a, b]; },
    function () { return Math.random() < .5 ? [ri(110, 480), ri(15, 99)] : [ri(11, 49), ri(11, 39), ri(5, 19)]; },
    function () { return Math.random() < .5 ? [ri(120, 590), ri(110, 390)] : [ri(15, 69), ri(15, 49), ri(15, 49), ri(5, 19)]; }
  ];
  var QTIP = ["Barmoqlaringda sanab ko'r yoki kattarog'idan boshlab sana.", "Avval birliklarni qo'sh, o'nliklar o'zgarmaydi.", "O'nliklarni alohida, birliklarni alohida qo'sh.",
    "Birliklar 10 dan oshsa, bitta o'nlik yuqoriga o'tadi. Masalan, kichigini o'nlikka yaxlitlab ol.", "Sonlarni o'nlik va birliklarga ajratib, bosqichma-bosqich qo'sh.", "Avval yuzliklarni, keyin o'nliklarni, oxirida birliklarni qo'sh."];
  function qoshQ(st) {
    var lv = st.qlvl || 1;
    if (st.qseen !== (st.cnt || 0)) {
      st.qseen = st.cnt || 0; st.qup = 0;
      var last = (st.log || [])[st.log ? st.log.length - 1 : 0];
      if (last && last.t === "Og'zaki qo'shish") {
        if (last.ok) { st.qrun = (st.qrun || 0) + 1; if (st.qrun >= 3 && lv < QLV.length) { lv++; st.qrun = 0; st.qup = 1; } }
        else { st.qrun = 0; if (lv > 1) lv--; }
      }
    }
    st.qlvl = lv;
    var n = QLV[lv - 1](), sum = 0, i; for (i = 0; i < n.length; i++) sum += n[i];
    return { q: n.join(" + ") + " = ?", a: sum, h: QTIP[lv - 1], s: n.join(" + ") + " = " + sum, lv: lv };
  }
  function mathQ(sinf) { var b = band(sinf); if (b > 0 && Math.random() < .25) b--; return pick(MG[b])(); }

  /* ---------- Mantiqiy masalalar ---------- */
  var LOGIC = [
    ["Uchta olma bor edi, ikkitasini sen olding. Senda nechta olma bor?", 2, "Sen olgan ikkitasi senda-da!"],
    ["Bitta g'isht 1 kilogramm va yana yarim g'isht keladi. Bitta g'isht necha kilogramm?", 2, "Yarim g'isht 1 kg bo'lsa, butuni 2 kg."],
    ["5 ta mashina 5 daqiqada 5 ta detal yasaydi. 100 ta mashina 100 ta detalni necha daqiqada yasaydi?", 5, "Har bir mashina 5 daqiqada bitta detal yasaydi."],
    ["Ko'ldagi nilufar barglari har kuni ikki baravar ko'payadi va 48 kunda ko'l to'ladi. Ko'lning yarmi necha kunda to'ladi?", 47, "Ertasiga ikki baravar bo'ladi, demak bir kun oldin yarmi edi."],
    ["Davom ettir: 2, 4, 8, 16. Keyingi son?", 32, "Har safar ikki baravar."],
    ["Davom ettir: 1, 1, 2, 3, 5, 8. Keyingi son?", 13, "Oldingi ikkitasining yig'indisi: 5 + 8."],
    ["Arqonni 5 bo'lakka bo'lish uchun necha marta kesish kerak?", 4, "Har kesish bittadan bo'lak qo'shadi: 1 + 4 = 5."],
    ["3 ta mushuk 3 ta sichqonni 3 daqiqada tutadi. 100 ta mushuk 100 ta sichqonni necha daqiqada tutadi?", 3, "Har mushuk bitta sichqonni 3 daqiqada tutadi."],
    ["Soat roppa-rosa 3:00. Soat va minut millari orasidagi burchak necha gradus?", 90, "Siferblat 12 bo'lak, har biri 30 gradus: 3 × 30."],
    ["Xonaning 4 burchagida bittadan mushuk o'tiribdi, har bir mushuk ro'parasida 3 ta mushukni ko'radi. Xonada nechta mushuk bor?", 4, "Ular bir-birini ko'ryapti, xolos."],
    ["9 + 9 × 0 nechaga teng?", 9, "Avval ko'paytirish: 9 × 0 = 0."],
    ["Oilada 6 ta aka-uka bor, har birining bitta singlisi bor. Oilada nechta farzand?", 7, "Singil hammasi uchun bitta."],
    ["Qaysi sonni 3 ga ko'paytirib, 4 qo'shsak 25 chiqadi?", 7, "25 − 4 = 21, 21 ÷ 3 = 7."],
    ["Velosipedchi 1 soatda 15 km yuradi. 3 soatda necha km yuradi?", 45, "15 × 3 = 45."],
    ["Toq sonlar: 1, 3, 5, 7 va hokazo. O'ninchi toq son qaysi?", 19, "n-toq son 2n − 1 ga teng."],
    ["Stolda 10 ta sham yonib turibdi, 3 tasini o'chirdik. Oxirida nechta sham qoladi?", 3, "Yonayotganlari erib tugaydi, o'chirilganlari qoladi."],
    ["Bir yilda nechta oyda 28 kun bor?", 12, "Hamma oylarda kamida 28 kun bor!"],
    ["Ikki ota va ikki o'g'il 3 ta olmani bo'lishdi, har biriga bittadan tegdi. Ular necha kishi?", 3, "Bobo, ota va o'g'il: ota ham ota, ham o'g'il."]
  ];

  /* ---------- Kichik bilim bazasi (erkin rejim) ---------- */
  var FACTS = [
    [/pifagor/, "Pifagor teoremasi: to'g'ri burchakli uchburchakda gipotenuzaning kvadrati katetlar kvadratlarining yig'indisiga teng, ya'ni c² = a² + b²."],
    [/nyuton|newton/, "Nyutonning ikkinchi qonuni: kuch massa bilan tezlanishning ko'paytmasiga teng, F = m × a."],
    [/fotosintez/, "Fotosintez — o'simliklar quyosh nurida karbonat angidrid va suvdan glyukoza hosil qilib, kislorod chiqaradigan jarayon."],
    [/poytaxt/, "O'zbekistonning poytaxti — Toshkent shahri."],
    [/amir temur|temur/, "Amir Temur 1336-yilda Keshda tug'ilgan, Temuriylar davlatiga asos solgan buyuk sarkarda va davlat arbobi."],
    [/al-?xorazmiy|xorazmiy/, "Al-Xorazmiy — algebra faniga asos solgan buyuk olim. «Algoritm» so'zi uning nomidan kelib chiqqan."],
    [/ulug'?bek/, "Mirzo Ulug'bek — astronom va matematik, Samarqandda rasadxona qurdirgan, mashhur «Ziji jadidi Ko'ragoniy» yulduzlar jadvali muallifi."],
    [/\bpi\b|π/, "π soni taxminan 3,14 ga teng: aylana uzunligining diametrga nisbati."],
    [/yorug'lik tezligi/, "Yorug'likning vakuumdagi tezligi sekundiga taxminan 300 ming kilometr."],
    [/suvning formulasi|h2o/, "Suvning kimyoviy formulasi H₂O: ikki vodorod va bir kislorod atomi."],
    [/kuvonch|sayt/, "kuvonch.uz da matematika mashqlari, sinf bo'yicha darslar, viktorina, virtual o'yinlar, ingliz va rus tili bo'limlari bor. Men esa ovozli ustozingizman."]
  ];

  /* ---------- Asosiy mantiq ---------- */
  function bankFor(list, sinf) {
    var b = band(sinf), lv = b <= 0 ? [1] : b === 1 ? [1, 2] : b === 2 ? [2, 3] : [2, 3];
    return list.filter(function (x) { return lv.indexOf(x[0]) >= 0; });
  }
  function nextItem(st, key, list) {
    st.used = st.used || {}; st.used[key] = st.used[key] || [];
    var free = list.filter(function (x, i) { return st.used[key].indexOf(i) < 0; });
    if (!free.length) { st.used[key] = []; free = list; }
    var it = pick(free), idx = list.indexOf(it); st.used[key].push(idx); return it;
  }
  function askNew(ctx) { var q = askNew0(ctx); if (ctx.st.cur) ctx.st.cur.m = ctx.mode; return q; }
  var LET = ["A", "B", "C", "D"];
  function plain(h) {
    return String(h == null ? "" : h).replace(/<br\s*\/?>/gi, ". ").replace(/<sub>(.*?)<\/sub>/gi, "$1").replace(/<sup>(.*?)<\/sup>/gi, "^$1").replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/\s+/g, " ").replace(/\?\s*\./g, "?").replace(/\.\s*\./g, ".").trim();
  }
  // ctx.bank — shu rejim uchun saytdagi tayyor savollar mavzulari (viktorina bilan umumiy)
  function bankQ(ctx) {
    var S = window.kaSavol, st = ctx.st; if (!S || !ctx.bank || !ctx.bank.length) return null;
    st.lvl = Math.max(1, Math.min(3, st.lvl || 1)); st.seen = st.seen || [];
    for (var k = 0; k < 12; k++) {
      var tid = pick(ctx.bank), p = null;
      try { p = S.get(tid, st.lvl); } catch (e) { p = null; }
      if (!p || p.q == null || p.a == null || p.g || p.gs) continue;
      var q = plain(p.q), a = plain(p.a), key = tid + "|" + q;
      if (!q || q.length > 260 || (st.seen.indexOf(key) >= 0 && k < 10)) continue;
      var w = shuffle((p.w || []).map(plain).filter(function (x) { return x && x !== a; })).slice(0, 3), opts = shuffle([a].concat(w));
      st.seen.push(key); if (st.seen.length > 60) st.seen = st.seen.slice(-60);
      var stp = (Array.isArray(p.steps) ? p.steps : p.steps ? [p.steps] : []).map(plain).filter(Boolean).slice(0, 3);
      st.tries = 0;
      st.cur = { k: "mc", q: q, opts: opts, ci: opts.indexOf(a), a: a, s: stp.join(". "), tid: tid };
      return q + " " + opts.map(function (o, i) { return LET[i] + ") " + o; }).join("; ") + ".";
    }
    return null;
  }
  function choiceOf(t, c) {
    var s = norm(t), raw = String(t || "").trim(), m, i;
    m = /^(?:javob\s*)?([abcdабвг])(?:\s*(?:variant|javob)\w*)?[.)!]?$/i.exec(s) || /(?:^|\s)([abcd])\s*(?:variant|javob)/i.exec(s) || /(?:variant|javob)\w*\s+([abcd])(?:\s|$)/i.exec(s) || /^([ABCD])\b/.exec(raw);
    if (m) { var L = m[1].toLowerCase(); i = "abcd".indexOf(L); if (i < 0) i = "абвг".indexOf(L); if (i >= 0 && i < c.opts.length) return i; }
    var ord = [/birinchi|1-chi|первый/, /ikkinchi|2-chi|второй/, /uchinchi|3-chi|третий/, /to'rtinchi|tortinchi|4-chi|четв[её]ртый/];
    for (i = 0; i < c.opts.length; i++) if (ord[i].test(s)) return i;
    var best = -1, bs = 0, n1 = parseNum(t);
    for (i = 0; i < c.opts.length; i++) {
      var o = norm(c.opts[i]), v = sim(bare(s), bare(o));
      if (o && (s === o || (o.length > 2 && s.indexOf(o) >= 0))) v = Math.max(v, .95);
      var n2 = parseNum(c.opts[i]); if (n1 != null && n2 != null && Math.abs(n1 - n2) < 1e-9 && !/[a-zа-я]{4,}/i.test(c.opts[i])) v = Math.max(v, .97);
      if (v > bs) { bs = v; best = i; }
    }
    return bs >= .72 ? best : -1;
  }
  function askNew0(ctx) {
    var st = ctx.st, m = ctx.mode, it;
    if (m === "xato") {
      var L0 = (ctx.xato || []).slice().sort(function (a, b) { return (b.n || 1) - (a.n || 1) || a.ts - b.ts; }), x = null;
      for (var xi = 0; xi < L0.length; xi++) if (L0[xi].id !== st.lastX || L0.length === 1) { x = L0[xi]; break; }
      if (!x) { st.cur = null; return ""; }
      st.lastX = x.id; st.tries = 0;
      if (x.o && x.o.length >= 2 && x.o.indexOf(x.a) >= 0) { var o2 = shuffle(x.o); st.cur = { k: "mc", q: x.q, opts: o2, ci: o2.indexOf(x.a), a: x.a, s: x.s, t: x.t, xid: x.id }; return "Xatolar daftaringdan: " + x.q + " " + o2.map(function (o, i) { return LET[i] + ") " + o; }).join("; ") + "."; }
      if (parseNum(x.a) != null && /^[\s\d.,\/\-−]+$/.test(x.a)) { st.cur = { k: "num", q: x.q, a: parseNum(x.a), h: x.s || "Avvalgi xatoingni esla.", s: x.a + (x.s ? ". " + x.s : ""), t: x.t, xid: x.id }; return "Xatolar daftaringdan: " + x.q; }
      st.cur = { k: "tr", q: x.q, a: [x.a], f: bare, lang: "uz", t: x.t, xid: x.id }; return "Xatolar daftaringdan: " + x.q;
    }
    st.tries = 0;
    if (m === "en") { it = nextItem(st, "en" + band(ctx.sinf), bankFor(ENB, ctx.sinf)); st.cur = { k: "tr", q: it[1], a: it[2], f: enNorm, lang: "en" }; return "Inglizchada qanday deyiladi: «" + it[1] + "»?"; }
    if (m === "ru") { it = nextItem(st, "ru" + band(ctx.sinf), bankFor(RUB, ctx.sinf)); st.cur = { k: "tr", q: it[1], a: it[2], f: bare, lang: "ru" }; return "Ruschada qanday deyiladi: «" + it[1] + "»?"; }
    if (m === "ielts") { it = nextItem(st, "ielts", IELTS); st.cur = { k: "ielts", q: it }; return "Mana savol: \"" + it + "\" Javobni inglizcha, kamida uch-to'rt gap bilan ayting."; }
    var bq = (m !== "qosh" && ctx.bank && ctx.bank.length && (m === "math" || m === "fan" || Math.random() < .55)) ? bankQ(ctx) : null;
    if (bq) return bq;
    if (m === "math") { it = mathQ(ctx.sinf); st.cur = { k: "num", q: it.q, a: it.a, h: it.h, s: it.s }; return it.q; }
    if (m === "qosh") { it = qoshQ(st); st.cur = { k: "num", q: it.q, a: it.a, h: it.h, s: it.s, t: "Og'zaki qo'shish", ts: Date.now() + 1800 }; return it.q; }
    if (m === "logic") { it = nextItem(st, "logic", LOGIC); st.cur = { k: "num", q: it[0], a: it[1], h: "Shoshilma, savolni yana bir bor o'qib chiq.", s: it[2] }; return it[0]; }
    st.cur = null; return "";
  }
  var INTRO = {
    en: "Salom! Men Kuvi, ingliz tili ustozingman. Tarjima mashqidan boshlaymiz.",
    ielts: "Hello! Men Kuvi, IELTS Speaking murabbiyingman. Savol beraman, siz javob berasiz, men taxminiy band aytaman.",
    ru: "Salom! Men Kuvi. Rus tilini birga mashq qilamiz.",
    math: "Salom! Men Kuvi, matematika ustozingman. Qani, bitta misol!",
    qosh: "Salom! Men Kuvi. Og'zaki qo'shish mashqi: men misol aytaman, sen javobni ovoz chiqarib aytasan. Tez va to'g'ri topsang, daraja oshadi!",
    logic: "Salom! Men Kuvi. Miyangni charxlaymiz: mantiqiy masala!",
    free: "Salom! Men Kuvi, kuvonch.uz ning ovozli ustoziman. Istalgan fandan savol bering yoki yuqoridan rejim tanlang.",
    xato: "Salom! Bu — xatolar daftaring. Avval xato qilgan savollaringni qayta yechamiz: har birini ikki marta to'g'ri topsang, daftardan o'chadi."
  };

  function start(ctx) {
    ctx.st = ctx.st || {};
    if (!ctx.name && ctx.mode !== "xato") { ctx.st.askName = 1; ctx.st.cur = null; return { t: INTRO[ctx.mode].replace(/ (Qani|Tarjima|Rus tilini|Miyangni|Savol beraman|Istalgan)[\s\S]*$/, "") + " Avval tanishib olaylik: isming nima?", mood: "happy" }; }
    if (ctx.mode === "xato" && !(ctx.xato || []).length) return { t: "Xatolar daftaring hozircha bo'sh — demak xato yo'q, qoyil! Viktorina yoki mashqda xato qilsang, shu yerga yozib qo'yaman va keyin birga tuzatamiz.", mood: "love" };
    var q = askNew(ctx);
    return { t: INTRO[ctx.mode].replace("Salom!", "Salom, " + ctx.name + "!").replace("Hello!", "Hello, " + ctx.name + "!") + (q ? " " + q : ""), mood: "happy", opts: optsOf(ctx.st) };
  }

  function social(t) {
    var s = norm(t), p = " " + s + " ";
    if (RIVAL.test(t)) return { t: pick(JEAL), mood: "jealous" };
    if (/ (rahmat|raxmat|thank|спасибо|zo'r|zor |ajoyib|yaxshi ko'raman|love you|super|молодец)/.test(p) && s.split(" ").length <= 6) return { t: pick(LOVE), mood: "love" };
    if (/ (sen kimsan|kimsan|isming nima|who are you|кто ты|seni kim)/.test(p)) return { t: "Men Kuvi — kuvonch.uz saytining ovozli ustoziman. Internet va AI ulangan bo'lsa Google Gemini yordamida gaplashaman, bo'lmasa oflayn mashqlar bilan o'qitaman.", mood: "happy" };
    if (/^(salom|assalomu? alaykum|hello|hi|hey|привет|здравствуй)/.test(s)) return { t: "Va alaykum assalom! Kayfiyatlar qalay? Qani, boshladik!", mood: "happy" };
    if (/ (zerikdim|charchadim|qiyin|i am tired|bored|устал)/.test(p)) return { t: "Tushunaman, ba'zan qiyin bo'ladi. Keling, bitta osonroq savol bilan davom etamiz, keyin dam olasiz!", mood: "sad" };
    return null;
  }

  // xato bo'lgan savol — «Xatolar daftari» uchun
  function wr(c, ch) { return { q: c.q, a: c.k === "mc" ? c.a : c.k === "tr" ? c.a[0] : fmt(c.a), o: c.k === "mc" ? c.opts : null, s: c.s || c.h || "", t: c.t || c.tid || "", ch: ch == null ? "bilmadi" : String(ch) }; }
  function tally(st, ok, c, ch) {
    st.cnt = (st.cnt || 0) + 1; if (ok) st.okN = (st.okN || 0) + 1;
    st.log = (st.log || []).concat([{ ok: !!ok, q: c.q, a: c.k === "mc" ? c.a : c.k === "tr" ? c.a[0] : fmt(c.a), ch: ch == null ? "" : String(ch), t: c.t || c.tid || "" }]).slice(-12);
  }
  function optsOf(st) { return st.cur && st.cur.k === "mc" ? st.cur.opts.map(function (o, i) { return LET[i] + ") " + o; }) : null; }
  function checkAnswer(t, ctx) {
    var st = ctx.st, c = st.cur, nx, nc = ctx.mode === "free" && c.m && c.m !== "free" ? { mode: c.m, sinf: ctx.sinf, st: st, tease: ctx.tease, bank: ctx.bank, name: ctx.name } : ctx;
    if (isRepeat(t)) return { t: c.k === "tr" ? "Takrorlayman: «" + c.q + "»" : c.q, mood: "neutral" };
    if (isSkip(t)) { var ans = c.k === "num" ? fmt(c.a) : c.k === "tr" ? "\"" + c.a[0] + "\"" : ""; nx = askNew(nc); return { t: (ans ? "Javob: " + ans + ". " : "") + "Keyingisi: " + nx, mood: "neutral" }; }
    if (c.k === "mc") {
      var ch = choiceOf(t, c), right = LET[c.ci] + ") " + c.a;
      if (ch < 0 && isNo(t)) {
        st.tries++;
        if (isGive(t) || st.tries >= 2) { st.lvl = Math.max(1, (st.lvl || 1) - 1); tally(st, false, c, null); nx = askNew(nc); return { t: tz(ctx) + "To'g'ri javob: " + right + "." + (c.s ? " " + c.s.replace(/[.!]+$/, "") + "." : "") + " Keyingisi: " + nx, mood: "think" }; }
        var wrongs = []; for (var z = 0; z < c.opts.length; z++) if (z !== c.ci) wrongs.push(z);
        var drop = pick(wrongs); c.bad = 1; return { t: tz(ctx) + "Yordam: " + LET[drop] + " variant noto'g'ri. Qolganlaridan birini tanlang.", mood: "think" };
      }
      if (ch < 0) return { t: "Variantlardan birini ayting: A, B, C yoki D. Bilmasangiz, «bilmayman» deng. " + c.q, mood: "think" };
      if (ch === c.ci) {
        tally(st, !c.bad, c, c.opts[ch]);
        st.ok = (st.ok || 0) + 1; st.run = (st.run || 0) + 1; if (st.run >= 2) { st.lvl = Math.min(3, (st.lvl || 1) + 1); st.run = 0; }
        nx = askNew(nc);
        return { t: nm(ctx, pick(PRAISE)) + " " + right + ". " + (st.ok % 5 === 0 ? "Ketma-ket " + st.ok + " ta to'g'ri, ofarin! " : "") + "Keyingisi: " + nx, mood: st.ok % 5 === 0 ? "love" : "happy" };
      }
      st.run = 0; st.lvl = Math.max(1, (st.lvl || 1) - 1); tally(st, false, c, c.opts[ch]);
      var s3 = c.s; nx = askNew(nc);
      return { t: tz(ctx) + "Afsus, " + LET[ch] + " emas. To'g'ri javob: " + right + "." + (s3 ? " " + s3.replace(/[.!]+$/, "") + "." : "") + " Keyingisi: " + nx, mood: "strict" };
    }
    if (c.k === "num") {
      var v0 = parseNum(t);
      if (v0 != null && !/bilm|билм/.test(norm(t))) { /* javob — pastda tekshiramiz */ }
      else if (isGive(t)) { var sg = String(c.s).replace(/[.!]+$/, ""); tally(st, false, c, null); nx = askNew(nc); return { t: "Mayli, aytaman: " + sg + ". Keyingi savol: " + nx, mood: "think" }; }
      else if (isNo(t)) {
        st.tries++;
        if (st.tries >= 2) { var s1 = String(c.s).replace(/[.!]+$/, ""); tally(st, false, c, null); nx = askNew(nc); return { t: "Mayli, tushuntiraman: " + s1 + ". Keyingi savol: " + nx, mood: "think" }; }
        c.bad = 1; return { t: tz(ctx) + "Yordam: " + c.h, mood: "think" };
      }
      var v = v0;
      if (v == null) return { t: "Javobni son bilan ayting, yoki «bilmayman» deng — tushuntiraman. Savol: " + c.q, mood: "think" };
      if (Math.abs(v - c.a) < 1e-6 || Math.abs(v - c.a) <= Math.abs(c.a) * 1e-3) {
        tally(st, !c.bad, c, fmt(v));
        st.ok = (st.ok || 0) + 1;
        var sp = ctx.mode === "qosh" && c.ts ? Math.max(.6, (Date.now() - c.ts) / 1000) : 0, fast = sp && sp < 7;
        nx = askNew(nc);
        var big = st.ok % 5 === 0, md5 = big ? (Math.random() < .5 ? "laugh" : "love") : fast && sp < 4.5 ? "wink" : "happy";
        return { t: (md5 === "laugh" ? "Ha-ha-ha! " : "") + nm(ctx, pick(PRAISE)) + " " + fmt(v) + ". " + (fast ? "Chaqmoqdek tez — " + String(Math.round(sp * 10) / 10).replace(".", ",") + " soniya! " : "") +
          (big ? "Ketma-ket " + st.ok + " ta to'g'ri javob, ofarin! " : "") + (ctx.mode === "qosh" && st.qup ? "Endi qiyinroq misollar! " : "") + "Keyingisi: " + nx, mood: md5 };
      }
      st.tries++;
      if (st.tries >= 2) { var s2 = String(c.s).replace(/[.!]+$/, ""), cr = Math.random() < .4; tally(st, false, c, fmt(v)); nx = askNew(nc); return { t: (cr ? pick(CRY) + " " : tz(ctx)) + "To'g'ri javob: " + s2 + ". Xafa bo'lmang, " + petW(ctx) + ", keyingisini albatta topasiz: " + nx, mood: cr ? "cry" : "sad" }; }
      c.bad = 1; return { t: tz(ctx) + pick(WRONG) + " Maslahat: " + c.h, mood: "strict" };
    }
    if (c.k === "tr") {
      if (isNo(t)) { var a0 = c.a[0]; tally(st, false, c, null); nx = askNew(nc); return { t: tz(ctx) + "To'g'ri javob: \"" + a0 + "\". Takrorlab ko'ring! Keyingisi: " + nx, mood: "think" }; }
      if (c.lang === "en" && !/[a-z]/.test(norm(t))) return { t: "Javobni inglizcha ayting. Mikrofon tilini EN ga qo'ying. Savol: «" + c.q + "»", mood: "think" };
      if (c.lang === "ru" && !/[а-я]/.test(norm(t))) return { t: "Javobni ruscha ayting. Mikrofon tilini RU ga qo'ying. Savol: «" + c.q + "»", mood: "think" };
      var sc = bestSim(t, c.a, c.f);
      if (sc < .6 && c.lang === "en") { var gg = grammar(t); if (gg.fixes.length) return { t: "Kichik xato: " + gg.fixes[0] + ". To'g'ri: \"" + gg.fixed + "\". Endi savolimga javob bering: «" + c.q + "»", mood: "strict" }; }
      if (sc >= .84) { tally(st, !c.bad, c, t); st.ok = (st.ok || 0) + 1; nx = askNew(nc); return { t: nm(ctx, pick(PRAISE)) + (sc < .99 ? " Aniqrog'i: \"" + c.a[0] + "\"." : "") + " Keyingisi: " + nx, mood: "happy" }; }
      st.tries++;
      if (sc >= .55 || st.tries >= 2) { var a1 = c.a[0]; tally(st, false, c, t); nx = askNew(nc); return { t: (sc >= .55 ? "Deyarli! " : "") + "To'g'ri variant: \"" + a1 + "\". Takrorlab qo'ying. Keyingisi: " + nx, mood: sc >= .55 ? "think" : "strict" }; }
      c.bad = 1; return { t: tz(ctx) + pick(WRONG) + " «" + c.q + "»", mood: "strict" };
    }
    if (c.k === "ielts") {
      if (!looksEnglish(t)) return { t: "IELTS'da javob inglizcha bo'lishi kerak. Mikrofon tilini EN ga qo'yib, qayta ayting: \"" + c.q + "\"", mood: "strict" };
      var r = ieltsBand(t), g = grammar(t), tips = [];
      if (r.n < 25) tips.push("javobni uzaytiring, sabab va misol qo'shing");
      if (r.links < 2) tips.push("«because», «for example», «however» kabi bog'lovchilarni ishlating");
      if (g.fixes.length) tips.push("grammatika: " + g.fixes[0]);
      nx = askNew(nc);
      return { t: "Taxminiy band: " + r.band.toFixed(1).replace(".", ",") + ". " + (tips.length ? "Maslahat: " + tips.join("; ") + "." : "Juda yaxshi, ravon javob!") + (g.fixes.length ? " Yaxshiroq variant: \"" + g.fixed + "\"." : "") + " Keyingi savol: " + nx.replace(/^Mana savol: /, ""), mood: r.band >= 6 ? "happy" : "think" };
    }
    return null;
  }

  function reply(text, ctx) {
    ctx.st = ctx.st || {};
    var t = String(text || "").trim(), st = ctx.st;
    if (!t) return { t: "Eshitmadim. Yana bir bor ayting.", mood: "think" };
    var nmx = findName(t, st.askName && !st.cur);
    if (nmx) {
      st.askName = 0; ctx.name = nmx;
      var had = !!st.cur, q0 = had ? (st.cur.k === "tr" ? "«" + st.cur.q + "»" : st.cur.q) : askNew(ctx);
      return { t: "Tanishganimdan xursandman, " + nmx + "! Endi seni ismingdan chaqiraman. " + (had ? "Qani, savolga qaytamiz: " : "Qani, boshladik: ") + q0, mood: "love", name: nmx, opts: optsOf(st) };
    }
    var sx = norm(t);
    if (/(^|\s)(men )?(qiz ?bola(man)?|qizman)(\s|$)/.test(sx)) return { t: "Tushundim, endi siz bilan erkak ovozida gaplashaman!" + (st.cur ? " Savolga qaytamiz: " + (st.cur.k === "tr" ? "«" + st.cur.q + "»" : st.cur.q) : ""), mood: "happy", sg: "girl", opts: optsOf(st) };
    if (/(^|\s)(men )?(o'g'il ?bola(man)?|o'g'lonman|bolaman)(\s|$)/.test(sx) && !/bo'laman/.test(sx)) return { t: "Tushundim, endi sen bilan ayol ovozida gaplashaman!" + (st.cur ? " Savolga qaytamiz: " + (st.cur.k === "tr" ? "«" + st.cur.q + "»" : st.cur.q) : ""), mood: "happy", sg: "boy", opts: optsOf(st) };
    if (/(isming nima|ismimni bilasanmi|men kimman|ismimni ayt)/.test(norm(t))) return { t: ctx.name ? "Sen " + ctx.name + "san-ku! Unutmayman." : "Hali aytmading-ku! Isming nima?", mood: ctx.name ? "love" : "think" };
    var so = social(t);
    if (so) { if (st.cur && so.mood !== "jealous") so.t += " Endi savolga qaytamiz: " + (st.cur.k === "tr" ? "«" + st.cur.q + "»" : st.cur.q); return so; }
    if (st.cur && ctx.mode === "free" && parseNum(t) == null) {
      var sn = norm(t);
      for (var f = 0; f < FACTS.length; f++) if (FACTS[f][0].test(sn)) return { t: FACTS[f][1] + " Endi savolga qaytamiz: " + st.cur.q, mood: "happy" };
    }
    if (st.cur) {
      var c0 = st.cur, cnt0 = st.cnt || 0, ok0 = st.okN || 0, bad0 = !!c0.bad, r = checkAnswer(t, ctx);
      if (r) {
        if (r.opts === undefined) r.opts = optsOf(st);
        if ((st.cnt || 0) > cnt0) {
          var okNow = (st.okN || 0) > ok0;
          if (!okNow && !bad0 && ctx.mode !== "xato") r.wrong = wr(c0, (st.log[st.log.length - 1] || {}).ch);
          if (c0.xid) r.xhit = { id: c0.xid, ok: okNow };
          if (st.cnt % 10 === 0) { var lg = st.log.slice(-10), okc = lg.filter(function (x) { return x.ok; }).length; r.summary = { n: lg.length, ok: okc, wrongs: lg.filter(function (x) { return !x.ok; }) }; r.t += " Oxirgi " + lg.length + " ta savoldan " + okc + " tasini to'g'ri topding" + (okc >= 8 ? " — zo'r natija!" : okc >= 5 ? " — yaxshi, lekin hali o'sish bor." : " — keling, xatolar ustida ishlaymiz."); }
        }
        if (!bad0 && c0.bad && (st.cnt || 0) === cnt0) { if (ctx.mode !== "xato") r.wrong = wr(c0, t); if (c0.xid) r.xhit = { id: c0.xid, ok: false }; }
        if (ctx.mode === "xato" && !st.cur && /Keyingisi: $|Keyingi savol: $/.test(r.t)) r.t = r.t.replace(/(Keyingisi|Keyingi savol): $/, "Xatolar daftaring bo'shadi — barchasini tuzatding, qoyil!");
        return r;
      }
    }
    // Erkin inglizcha gap: grammatikani tekshirish
    if ((ctx.mode === "en" || ctx.mode === "free") && looksEnglish(t)) {
      var g = grammar(t);
      if (g.fixes.length) return { t: "Kichik xato: " + g.fixes[0] + ". To'g'ri variant: \"" + g.fixed + "\". " + "Endi javob bering: \"" + pick(EN_Q) + "\"", mood: "strict" };
      return { t: "Zo'r gap, xato yo'q! Davom etamiz: \"" + pick(EN_Q) + "\"", mood: "happy" };
    }
    var s = norm(t);
    // Oddiy hisob: "25 * 4", "12 ko'paytir 3"
    var ex = String(t).toLowerCase().replace(/[ʻʼ‘’`´]/g, "'").replace(/×/g, "*").replace(/÷/g, "/").replace(/(\d),(\d)/g, "$1.$2").replace(/ko'paytir\w*|marta/g, "*").replace(/bo'l\w*/g, "/").replace(/qo'sh\w*|plyus|plus/g, "+").replace(/ayir\w*|minus/g, "-").replace(/x(?=\s*\d)/g, "*");
    var mm = ex.match(/^(?:[\w' ]*?)(-?\d+(?:\.\d+)?)\s*([+\-*\/])\s*(-?\d+(?:\.\d+)?)/);
    if (mm) { var A = +mm[1], B = +mm[3], R = mm[2] === "+" ? A + B : mm[2] === "-" ? A - B : mm[2] === "*" ? A * B : B ? A / B : NaN; if (isFinite(R)) return { t: A + " " + { "+": "+", "-": "−", "*": "×", "/": "÷" }[mm[2]] + " " + B + " = " + fmt(R) + ". Yana misol beraymi?", mood: "happy" }; }
    if (/\b(bugun|sana|nechanchi|soat necha|vaqt)\b/.test(s) && ctx.mode === "free") {
      var d = new Date(), M = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
      return { t: "Bugun " + d.getDate() + "-" + M[d.getMonth()] + ", soat " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2) + ".", mood: "neutral" };
    }
    for (var i = 0; i < FACTS.length; i++) if (FACTS[i][0].test(s)) return { t: FACTS[i][1] + " Yana nima qiziq?", mood: "happy" };
    var q;
    if (ctx.mode !== "free") { q = askNew(ctx); if (q) return { t: "Qani, mashq qilamiz! " + q, mood: "happy", opts: optsOf(st) }; }
    // Erkin rejim, oflayn: suhbatni to'xtatmaymiz — matematika yoki mantiqdan savol beramiz
    var sub = ctx.bank && ctx.bank.length ? "fan" : Math.random() < .5 ? "math" : "logic", c2 = { mode: sub, sinf: ctx.sinf, st: st, bank: ctx.bank, name: ctx.name };
    q = askNew(c2);
    var first = !st.offNote && !ctx.aiOn; if (!ctx.aiOn) st.offNote = 1;
    return { t: (first ? "Hozir internetdagi AI ulanmagan, shuning uchun erkin savollarga to'liq javob bera olmayman. Lekin zerikmaymiz! " : "Qani, yana bittasi! ") + (sub === "math" ? "Misol: " : sub === "logic" ? "Mantiqiy masala: " : "Savol: ") + q, mood: first ? "think" : "happy", opts: optsOf(st) };
  }

  // Bu xabarni AI'siz, shu yerning o'zida tez hal qilsa bo'ladimi? (savolga javob, «keyingi», «bilmayman», ism)
  function local(text, ctx) {
    var t = String(text || ""), st = ctx.st || {}, s = norm(t);
    if (findName(t, st.askName && !st.cur)) return true;
    if (/(^|\s)(savol ber|misol ber|mashq ber|test ber|menga mashq|keyingi|boshqa savol|yana savol|yana bitta)/.test(s)) return true;
    var c = st.cur; if (!c) return false;
    if (isSkip(t) || isRepeat(t) || isNo(t)) return true;
    if (c.k === "mc") return choiceOf(t, c) >= 0;
    if (c.k === "num") return parseNum(t) != null && s.split(" ").length <= 6;
    if (c.k === "tr") return s.split(" ").length <= 12 && bestSim(t, c.a, c.f) >= .55;
    return false;
  }
  window.kaUstozBilim = { local: local, findName: findName, start: start, reply: reply, parseNum: parseNum, uzWords: uzWords, grammar: grammar, ieltsBand: ieltsBand, rival: RIVAL, jealous: JEAL };
})();
