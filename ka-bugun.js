/*! Kuvonch Academy — "Bugun" bloki (bosh sahifa)
 *  Sana va hafta kuni, yilning nechanchi kuni, yil tugashiga qolgan vaqt (jonli),
 *  oxirgi va keyingi tengkunlik (Meeus, "Astronomical Algorithms", 27-bob — xatolik bir necha daqiqa),
 *  shu kuni tug'ilgan matematik, fizik va boshqa olimlar (olimlar/MM.json, Wikidata asosida).
 *  Joylar: #bugun-chip (hero ichidagi qisqa qator) va #bugun (to'liq blok).
 */
(function () {
  "use strict";
  if (window.kaBugun) return;

  /* ---------------- Tillar ---------------- */
  var L = {
    uz: {
      mon: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
      wd: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
      date: function (d, m, y) { return d + "-" + m + (y ? ", " + y + "-yil" : ""); },
      today: "Bugun", doy: "Yilning {n}-kuni", week: "{n}-hafta", left: "Yil tugashiga", passed: "Yilning {p}% o'tdi",
      u: ["kun", "soat", "daqiqa", "soniya"], newYear: "Yangi yil muborak! 🎉",
      lastEq: "Oxirgi tengkunlik", next: "Keyingi", ago: "{n} kun oldin", inN: "{n} kun qoldi", todayEv: "bugun",
      ev: ["Bahorgi tengkunlik", "Yozgi quyosh turishi", "Kuzgi tengkunlik", "Qishki quyosh turishi"],
      eqNote: "Tengkunlikda kun va tun deyarli teng bo'ladi — taxminan 12 soatdan. Vaqt sizning soat mintaqangizda.",
      sci: "Shu kuni tug'ilgan olimlar", tabs: ["Hammasi", "Matematiklar", "Fiziklar", "Boshqa olimlar"],
      yearsAgo: "{n} yil oldin", anniv: "{n} yilligi", more: "Batafsil", prev: "Oldingi kun", nextDay: "Keyingi kun", back: "Bugunga qaytish",
      empty: "Bu kun uchun ma'lumot hozircha yo'q.", loadErr: "Ma'lumotni yuklab bo'lmadi. Internetni tekshiring.",
      src: "Manba: Wikidata va Vikipediya", chipLeft: "yil tugashiga {n} kun",
      role: { mat: "matematik", fiz: "fizik", ast: "astronom", kim: "kimyogar", bio: "biolog", inf: "informatik", ixt: "ixtirochi", geo: "geolog", bot: "botanik", gen: "genetik", bk: "biokimyogar", tab: "tabiatshunos", zoo: "zoolog", olim: "olim", muh: "muhandis", sta: "statistik", fay: "faylasuf", tab2: "shifokor" }
    },
    ru: {
      mon: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      wd: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      date: function (d, m, y) { return d + " " + m + (y ? " " + y + " г." : ""); },
      today: "Сегодня", doy: "{n}-й день года", week: "{n}-я неделя", left: "До конца года", passed: "Прошло {p}% года",
      u: ["дн", "ч", "мин", "с"], newYear: "С Новым годом! 🎉",
      lastEq: "Последнее равноденствие", next: "Следующее", ago: "{n} дн. назад", inN: "через {n} дн.", todayEv: "сегодня",
      ev: ["Весеннее равноденствие", "Летнее солнцестояние", "Осеннее равноденствие", "Зимнее солнцестояние"],
      eqNote: "В равноденствие день и ночь почти равны — примерно по 12 часов. Время указано в вашем часовом поясе.",
      sci: "Учёные, родившиеся в этот день", tabs: ["Все", "Математики", "Физики", "Другие учёные"],
      yearsAgo: "{n} назад", anniv: "{n}-летие", more: "Подробнее", prev: "Предыдущий день", nextDay: "Следующий день", back: "Вернуться к сегодня",
      empty: "Для этого дня пока нет данных.", loadErr: "Не удалось загрузить данные. Проверьте интернет.",
      src: "Источник: Викиданные и Википедия", chipLeft: "до конца года {n} дн.",
      role: { mat: "математик", fiz: "физик", ast: "астроном", kim: "химик", bio: "биолог", inf: "информатик", ixt: "изобретатель", geo: "геолог", bot: "ботаник", gen: "генетик", bk: "биохимик", tab: "естествоиспытатель", zoo: "зоолог", olim: "учёный", muh: "инженер", sta: "статистик", fay: "философ", tab2: "врач" }
    },
    en: {
      mon: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      wd: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      date: function (d, m, y) { return m + " " + d + (y ? ", " + y : ""); },
      today: "Today", doy: "Day {n} of the year", week: "Week {n}", left: "Until the end of the year", passed: "{p}% of the year has passed",
      u: ["d", "h", "min", "s"], newYear: "Happy New Year! 🎉",
      lastEq: "Last equinox", next: "Next", ago: "{n} days ago", inN: "in {n} days", todayEv: "today",
      ev: ["Spring equinox", "Summer solstice", "Autumn equinox", "Winter solstice"],
      eqNote: "At an equinox day and night are almost equal — about 12 hours each. Times are in your time zone.",
      sci: "Scientists born on this day", tabs: ["All", "Mathematicians", "Physicists", "Other scientists"],
      yearsAgo: "{n} years ago", anniv: "{n}th anniversary", more: "Read more", prev: "Previous day", nextDay: "Next day", back: "Back to today",
      empty: "No data for this day yet.", loadErr: "Could not load the data. Check your connection.",
      src: "Source: Wikidata and Wikipedia", chipLeft: "{n} days left this year",
      role: { mat: "mathematician", fiz: "physicist", ast: "astronomer", kim: "chemist", bio: "biologist", inf: "computer scientist", ixt: "inventor", geo: "geologist", bot: "botanist", gen: "geneticist", bk: "biochemist", tab: "naturalist", zoo: "zoologist", olim: "scientist", muh: "engineer", sta: "statistician", fay: "philosopher", tab2: "physician" }
    },
    kk: {
      mon: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"],
      wd: ["Жексенбі", "Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі"],
      date: function (d, m, y) { return (y ? y + " жылғы " : "") + d + " " + m; },
      today: "Бүгін", doy: "Жылдың {n}-күні", week: "{n}-апта", left: "Жыл соңына дейін", passed: "Жылдың {p}% өтті",
      u: ["күн", "сағ", "мин", "сек"], newYear: "Жаңа жылыңызбен! 🎉",
      lastEq: "Соңғы күн мен түннің теңелуі", next: "Келесі", ago: "{n} күн бұрын", inN: "{n} күн қалды", todayEv: "бүгін",
      ev: ["Көктемгі күн мен түннің теңелуі", "Жазғы күн тоқырауы", "Күзгі күн мен түннің теңелуі", "Қысқы күн тоқырауы"],
      eqNote: "Бұл күні күн мен түн шамамен тең — 12 сағаттан. Уақыт сіздің уақыт белдеуіңізде.",
      sci: "Осы күні туған ғалымдар", tabs: ["Барлығы", "Математиктер", "Физиктер", "Басқа ғалымдар"],
      yearsAgo: "{n} жыл бұрын", anniv: "{n} жылдығы", more: "Толығырақ", prev: "Алдыңғы күн", nextDay: "Келесі күн", back: "Бүгінге оралу",
      empty: "Бұл күн үшін әзірге дерек жоқ.", loadErr: "Деректі жүктеу мүмкін болмады.",
      src: "Дереккөз: Уикидеректер және Уикипедия", chipLeft: "жыл соңына {n} күн",
      role: { mat: "математик", fiz: "физик", ast: "астроном", kim: "химик", bio: "биолог", inf: "информатик", ixt: "өнертапқыш", geo: "геолог", bot: "ботаник", gen: "генетик", bk: "биохимик", tab: "жаратылыстанушы", zoo: "зоолог", olim: "ғалым", muh: "инженер", sta: "статистик", fay: "философ", tab2: "дәрігер" }
    },
    ky: {
      mon: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      wd: ["Жекшемби", "Дүйшөмбү", "Шейшемби", "Шаршемби", "Бейшемби", "Жума", "Ишемби"],
      date: function (d, m, y) { return (y ? y + "-жылдын " : "") + d + "-" + m; },
      today: "Бүгүн", doy: "Жылдын {n}-күнү", week: "{n}-жума", left: "Жылдын аягына чейин", passed: "Жылдын {p}% өттү",
      u: ["күн", "саат", "мүн", "сек"], newYear: "Жаңы жылыңыз менен! 🎉",
      lastEq: "Акыркы күн менен түндүн теңелиши", next: "Кийинки", ago: "{n} күн мурун", inN: "{n} күн калды", todayEv: "бүгүн",
      ev: ["Жазгы күн менен түндүн теңелиши", "Жайкы күн токтоосу", "Күзгү күн менен түндүн теңелиши", "Кышкы күн токтоосу"],
      eqNote: "Бул күнү күн менен түн дээрлик бирдей — 12 сааттан. Убакыт сиздин убакыт алкагыңызда.",
      sci: "Ушул күнү туулган окумуштуулар", tabs: ["Баары", "Математиктер", "Физиктер", "Башка окумуштуулар"],
      yearsAgo: "{n} жыл мурун", anniv: "{n} жылдыгы", more: "Кененирээк", prev: "Мурунку күн", nextDay: "Кийинки күн", back: "Бүгүнгө кайтуу",
      empty: "Бул күн үчүн азырынча маалымат жок.", loadErr: "Маалыматты жүктөө мүмкүн болгон жок.",
      src: "Булак: Уикимаалыматтар жана Уикипедия", chipLeft: "жылдын аягына {n} күн",
      role: { mat: "математик", fiz: "физик", ast: "астроном", kim: "химик", bio: "биолог", inf: "информатик", ixt: "ойлоп табуучу", geo: "геолог", bot: "ботаник", gen: "генетик", bk: "биохимик", tab: "табият таануучу", zoo: "зоолог", olim: "окумуштуу", muh: "инженер", sta: "статистик", fay: "философ", tab2: "дарыгер" }
    }
  };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function lang() {
    var l = window.kaTil && window.kaTil.get ? window.kaTil.get() : null;
    if (!l) { var q = /[?&]til=(uz|ru|en|kk|ky)\b/.exec(location.search); l = (q && q[1]) || store("ka.til") || "uz"; }
    return L[l] ? l : "uz";
  }
  function fmt(s, o) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ""; }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ruYears(n) { var a = n % 10, b = n % 100; return n + " " + (a === 1 && b !== 11 ? "год" : a >= 2 && a <= 4 && (b < 12 || b > 14) ? "года" : "лет"); }

  /* ---------------- Kalendar hisoblari ---------------- */
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function dayOfYear(d) { return Math.round((startOfDay(d) - new Date(d.getFullYear(), 0, 1)) / 864e5) + 1; }
  function isoWeek(d) {
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), wd = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - wd);
    return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7);
  }
  function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 864e5); }

  /* ---------------- Tengkunlik va quyosh turishi (Meeus) ---------------- */
  var TERMS = [[485, 324.96, 1934.136], [203, 337.23, 32964.467], [199, 342.08, 20.186], [182, 27.85, 445267.112], [156, 73.14, 45036.886], [136, 171.52, 22518.443], [77, 222.54, 65928.934], [74, 296.72, 3034.906], [70, 243.58, 9037.513], [58, 119.81, 33718.147], [52, 297.17, 150.678], [50, 21.02, 2281.226], [45, 247.54, 29929.562], [44, 325.15, 31555.956], [29, 60.93, 4443.417], [18, 155.12, 67555.328], [17, 288.79, 4562.452], [16, 198.04, 62894.029], [14, 199.76, 31436.921], [12, 95.39, 14577.848], [12, 287.11, 31931.756], [12, 320.81, 34777.259], [9, 227.73, 1222.114], [8, 15.45, 16859.074]];
  var BASE = [
    [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
    [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030],
    [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
    [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032]
  ];
  var RAD = Math.PI / 180;
  // k: 0 — bahorgi tengkunlik, 1 — yozgi quyosh turishi, 2 — kuzgi tengkunlik, 3 — qishki quyosh turishi
  function season(year, k) {
    var Y = (year - 2000) / 1000, c = BASE[k];
    var jde0 = c[0] + c[1] * Y + c[2] * Y * Y + c[3] * Y * Y * Y + c[4] * Y * Y * Y * Y;
    var T = (jde0 - 2451545) / 36525, W = (35999.373 * T - 2.47) * RAD;
    var dl = 1 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W), S = 0;
    for (var i = 0; i < TERMS.length; i++) S += TERMS[i][0] * Math.cos((TERMS[i][1] + TERMS[i][2] * T) * RAD);
    var jde = jde0 + 0.00001 * S / dl;
    var t = year - 2000, dT = 62.92 + 0.32217 * t + 0.005589 * t * t;   // ΔT (soniya), 2005–2050 yillar uchun yaqinlashma
    return new Date((jde - dT / 86400 - 2440587.5) * 864e5);
  }
  function seasons(now) {
    var y = now.getFullYear(), list = [];
    [y - 1, y, y + 1].forEach(function (yy) { for (var k = 0; k < 4; k++) list.push({ k: k, t: season(yy, k) }); });
    return list;
  }

  /* ---------------- Ko'rinish ---------------- */
  var CSS = [
    ".bg-chip{display:inline-flex;align-items:center;gap:10px;flex-wrap:nowrap;max-width:100%;padding:10px 16px 10px 12px;border-radius:999px;text-decoration:none;color:var(--chalk,#f3f5ff);background:rgba(16,26,58,.72);border:1px solid var(--line,#1d2850);font:500 15px/1.3 var(--body,system-ui);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:border-color .2s,transform .2s}",
    ".bg-chip:hover{border-color:var(--teal,#35f0c4);transform:translateY(-2px)}",
    ".bg-chip .bg-ci{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font:800 15px/1 var(--display,system-ui);color:#060a1a;background:linear-gradient(135deg,var(--teal,#35f0c4),var(--violet,#a27bff))}",
    ".bg-chip>span:last-child{min-width:0}.bg-chip .bg-ci{flex:none}.bg-chip b{font-weight:700}.bg-chip span.dim{color:var(--haze,#93a3cc)}",
    ".bugun{max-width:1180px;margin:0 auto;padding:40px 20px 6px}",
    ".bugun h2{font:700 clamp(22px,2.6vw,30px)/1.15 var(--display,system-ui);letter-spacing:-.02em;margin:0 0 6px}",
    ".bg-grid{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.25fr);gap:16px}",
    ".bg-card{position:relative;border-radius:22px;padding:22px;background:linear-gradient(180deg,rgba(53,240,196,.07),rgba(12,19,48,.7) 45%),rgba(8,13,34,.8);border:1px solid var(--line,#1d2850);overflow:hidden}",
    ".bg-card.sci{background:linear-gradient(180deg,rgba(162,123,255,.09),rgba(12,19,48,.7) 45%),rgba(8,13,34,.8)}",
    ".bg-kick{display:inline-block;font:700 12px/1 var(--body,system-ui);letter-spacing:.12em;text-transform:uppercase;color:var(--teal,#35f0c4);margin-bottom:12px}",
    ".bg-date{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap}",
    ".bg-num{font:800 clamp(64px,9vw,96px)/.85 var(--display,system-ui);letter-spacing:-.05em;background:linear-gradient(160deg,#fff 30%,#b9a6ff);-webkit-background-clip:text;background-clip:text;color:transparent}",
    ".bg-my{display:flex;flex-direction:column;gap:4px;padding-bottom:4px}",
    ".bg-my b{font:700 clamp(20px,2.4vw,26px)/1.1 var(--display,system-ui);letter-spacing:-.02em}",
    ".bg-my span{color:var(--haze,#93a3cc);font-size:15px}",
    ".bg-wd{margin:14px 0 4px;font:700 20px/1.2 var(--body,system-ui);color:var(--amber,#ffc23d)}",
    ".bg-meta{display:flex;flex-wrap:wrap;gap:6px 14px;color:#c5cef0;font-size:14.5px;margin:0 0 18px}",
    ".bg-meta span::before{content:'•';margin-right:6px;color:var(--line,#3a4878)}.bg-meta span:first-child::before{content:none}",
    ".bg-left{font-size:14px;color:var(--haze,#93a3cc);margin:0 0 8px}",
    ".bg-cd{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:0 0 10px}",
    ".bg-cd div{border-radius:14px;padding:10px 6px 8px;text-align:center;background:rgba(6,10,26,.6);border:1px solid var(--line,#1d2850)}",
    ".bg-cd b{display:block;font:700 clamp(22px,3vw,30px)/1 var(--display,system-ui);font-variant-numeric:tabular-nums;letter-spacing:-.02em}",
    ".bg-cd small{display:block;margin-top:5px;color:var(--haze,#93a3cc);font-size:12px}",
    ".bg-bar{position:relative;height:10px;border-radius:999px;background:rgba(6,10,26,.7);border:1px solid var(--line,#1d2850);overflow:hidden}",
    ".bg-bar i{position:absolute;inset:0 auto 0 0;border-radius:inherit;background:linear-gradient(90deg,var(--teal,#35f0c4),var(--violet,#a27bff),var(--rose,#ff5e8e))}",
    ".bg-pct{margin:6px 0 18px;font-size:13px;color:var(--haze,#93a3cc)}",
    ".bg-eq{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;align-items:center;padding:14px;border-radius:16px;background:rgba(255,194,61,.06);border:1px solid rgba(255,194,61,.28)}",
    ".bg-eq .ico{grid-row:span 3;width:52px;height:52px}",
    ".bg-eq small{color:var(--amber,#ffc23d);font-weight:700;font-size:12.5px;letter-spacing:.04em;text-transform:uppercase}",
    ".bg-eq b{font:700 16px/1.3 var(--body,system-ui)}",
    ".bg-eq span{color:#c5cef0;font-size:14px}",
    ".bg-nx{margin:10px 0 0;padding:0;list-style:none;display:grid;gap:6px;font-size:14px;color:#c5cef0}",
    ".bg-nx li{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;border-top:1px dashed var(--line,#1d2850);padding-top:6px}",
    ".bg-nx li em{font-style:normal;color:var(--haze,#93a3cc)}",
    ".bg-note{margin:10px 0 0;color:var(--haze,#93a3cc);font-size:12.5px}",
    ".bg-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px}",
    ".bg-head h3{margin:0;font:700 19px/1.2 var(--display,system-ui);letter-spacing:-.01em}",
    ".bg-nav{display:flex;align-items:center;gap:6px}",
    ".bg-nav button{min-width:40px;height:40px;padding:0 12px;border-radius:12px;border:1px solid var(--line,#1d2850);background:#0f1834;color:var(--chalk,#f3f5ff);font:600 14px/1 var(--body,system-ui);cursor:pointer}",
    ".bg-nav button:hover{border-color:var(--violet,#a27bff)}",
    ".bg-nav button[hidden]{display:none}",
    ".bg-day{font:600 14px/1.2 var(--body,system-ui);color:var(--haze,#93a3cc);min-width:7.5em;text-align:center}",
    ".bg-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -4px 12px;padding:2px 4px}",
    ".bg-tabs::-webkit-scrollbar{display:none}",
    ".bg-tabs button{flex:0 0 auto;height:36px;padding:0 13px;border-radius:999px;border:1px solid var(--line,#1d2850);background:transparent;color:var(--haze,#93a3cc);font:600 13.5px/1 var(--body,system-ui);cursor:pointer}",
    ".bg-tabs button[aria-pressed=true]{color:#081019;background:linear-gradient(135deg,var(--teal,#35f0c4),var(--violet,#a27bff));border-color:transparent}",
    ".bg-tabs button .n{opacity:.7;margin-left:4px;font-weight:500}",
    ".bg-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}",
    ".bg-item{--c:var(--teal,#35f0c4);display:grid;grid-template-columns:auto 1fr;gap:4px 14px;padding:14px;border-radius:16px;background:rgba(6,10,26,.55);border:1px solid var(--line,#1d2850);border-left:3px solid var(--c)}",
    ".bg-item.fiz{--c:var(--violet,#a27bff)}.bg-item.bosh{--c:var(--amber,#ffc23d)}",
    ".bg-item .yr{grid-row:span 3;align-self:start;min-width:58px;text-align:center;padding:8px 6px;border-radius:12px;background:color-mix(in srgb,var(--c) 14%,transparent);border:1px solid color-mix(in srgb,var(--c) 40%,transparent);font:700 17px/1 var(--display,system-ui);letter-spacing:-.02em}",
    ".bg-item .yr small{display:block;margin-top:5px;font:500 11px/1.2 var(--body,system-ui);color:var(--haze,#93a3cc);letter-spacing:0}",
    ".bg-item .nm{font:700 16.5px/1.3 var(--body,system-ui)}",
    ".bg-item .nm .an{display:inline-block;margin-left:6px;font-size:11.5px;font-weight:700;color:#1b1200;background:var(--amber,#ffc23d);border-radius:999px;padding:2px 8px;vertical-align:2px}",
    ".bg-item .rl{color:var(--c);font-size:13px;font-weight:600}",
    ".bg-item p{margin:2px 0 0;color:#c5cef0;font-size:14px;line-height:1.45}",
    ".bg-item a{color:var(--teal,#35f0c4);font-size:13px;font-weight:600;text-decoration:none;white-space:nowrap}",
    ".bg-item a:hover{text-decoration:underline}",
    ".bg-item .ju{display:block;color:var(--haze,#93a3cc);font-size:12.5px;margin-top:2px}",
    ".bg-msg{color:var(--haze,#93a3cc);padding:14px;border-radius:14px;border:1px dashed var(--line,#1d2850)}",
    ".bg-src{margin:10px 0 0;color:var(--haze,#93a3cc);font-size:12px}",
    ".bg-more{margin-top:10px;width:100%;height:42px;border-radius:12px;border:1px solid var(--line,#1d2850);background:#0f1834;color:var(--chalk,#f3f5ff);font:600 14px/1 var(--body,system-ui);cursor:pointer}",
    ".bg-more:hover{border-color:var(--teal,#35f0c4)}",
    "@media (max-width:980px){.bg-grid{grid-template-columns:1fr}}",
    "@media (max-width:560px){.bugun{padding:30px 16px 4px}.bg-card{padding:16px;border-radius:18px}.bg-cd{gap:6px}.bg-cd div{padding:9px 2px 7px}.bg-item{padding:12px;gap:4px 10px}.bg-item .yr{min-width:50px;font-size:15px}.bg-chip{font-size:14px}}"
  ].join("\n");

  // Tengkunlik belgisi: yarmi yorug', yarmi qorong'i doira
  var EQ_SVG = '<svg class="ico" viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="bgq" x1="0" x2="1"><stop offset=".5" stop-color="#ffc23d"/><stop offset=".5" stop-color="#1d2850"/></linearGradient></defs><circle cx="26" cy="26" r="17" fill="url(#bgq)" stroke="#ffc23d" stroke-width="2"/><g stroke="#ffc23d" stroke-width="2.4" stroke-linecap="round"><path d="M26 2v5M26 45v5M2 26h5M45 26h5M9 9l3.5 3.5M39.5 39.5L43 43M9 43l3.5-3.5M39.5 12.5L43 9"/></g></svg>';

  var root, chip, state = { off: 0, tab: "all", all: false, data: {}, tick: null };

  function render() {
    var l = lang(), T = L[l], now = new Date(), y = now.getFullYear();
    var doy = dayOfYear(now), len = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
    var mon = T.mon[now.getMonth()], wd = T.wd[now.getDay()];
    var left = Math.ceil((new Date(y + 1, 0, 1) - startOfDay(now)) / 864e5) - 1;

    if (chip) {
      chip.innerHTML = '<span class="bg-ci" aria-hidden="true">' + now.getDate() + '</span><span><b>' + esc(wd) + "</b>, " + esc(T.date(now.getDate(), mon)) + ' <span class="dim">· ' + esc(fmt(T.chipLeft, { n: left })) + "</span></span>";
      chip.setAttribute("aria-label", T.today + ": " + wd + ", " + T.date(now.getDate(), mon, y));
    }
    if (!root) return;

    // tengkunliklar
    var ss = seasons(now), lastEq = null, nextEq = null, nextAny = null;
    ss.forEach(function (s) {
      if (s.t <= now && (s.k === 0 || s.k === 2)) lastEq = s;
      if (s.t > now && !nextEq && (s.k === 0 || s.k === 2)) nextEq = s;
      if (s.t > now && !nextAny) nextAny = s;
    });
    function when(t) { return T.date(t.getDate(), T.mon[t.getMonth()], t.getFullYear()) + ", " + ("0" + t.getHours()).slice(-2) + ":" + ("0" + t.getMinutes()).slice(-2); }
    function rel(t) { var d = daysBetween(now, t); return d === 0 ? T.todayEv : d < 0 ? fmt(T.ago, { n: -d }) : fmt(T.inN, { n: d }); }
    var nx = [nextAny];
    if (nextEq && nextEq !== nextAny) nx.push(nextEq);

    var h = '<div class="bg-grid">' +
      '<div class="bg-card cal">' +
      '<span class="bg-kick">' + esc(T.today) + "</span>" +
      '<div class="bg-date"><span class="bg-num">' + now.getDate() + '</span><span class="bg-my"><b>' + esc(l === "uz" ? mon.charAt(0).toUpperCase() + mon.slice(1) : mon) + "</b><span>" + y + "</span></span></div>" +
      '<div class="bg-wd">' + esc(wd) + "</div>" +
      '<p class="bg-meta"><span>' + esc(fmt(T.doy, { n: doy })) + " / " + len + "</span><span>" + esc(fmt(T.week, { n: isoWeek(now) })) + "</span></p>" +
      '<p class="bg-left">' + esc(T.left) + ":</p>" +
      '<div class="bg-cd" id="bg-cd" aria-live="off"></div>' +
      '<div class="bg-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" id="bg-bar"><i></i></div><p class="bg-pct" id="bg-pct"></p>' +
      (lastEq ? '<div class="bg-eq">' + EQ_SVG + "<small>" + esc(T.lastEq) + "</small><b>" + esc(T.ev[lastEq.k]) + " — " + esc(when(lastEq.t)) + "</b><span>" + esc(rel(lastEq.t)) + "</span></div>" : "") +
      '<ul class="bg-nx">' + nx.map(function (s) { return "<li><span>" + esc(T.next) + ": <b>" + esc(T.ev[s.k]) + "</b></span><em>" + esc(when(s.t)) + " · " + esc(rel(s.t)) + "</em></li>"; }).join("") + "</ul>" +
      '<p class="bg-note">' + esc(T.eqNote) + "</p>" +
      "</div>" +
      '<div class="bg-card sci"><div class="bg-head"><h3>' + esc(T.sci) + '</h3><div class="bg-nav"><button type="button" data-d="-1" aria-label="' + esc(T.prev) + '">‹</button><span class="bg-day" id="bg-day"></span><button type="button" data-d="1" aria-label="' + esc(T.nextDay) + '">›</button><button type="button" data-d="0" id="bg-back" title="' + esc(T.back) + '" hidden>↺</button></div></div>' +
      '<div class="bg-tabs" role="group" id="bg-tabs"></div><div id="bg-sci"></div><p class="bg-src">' + esc(T.src) + "</p></div>" +
      "</div>";
    root.innerHTML = h;
    root.querySelectorAll(".bg-nav button").forEach(function (b) {
      b.addEventListener("click", function () { var d = +b.getAttribute("data-d"); state.off = d === 0 ? 0 : state.off + d; state.all = false; sci(); });
    });
    tick();
    sci();
  }

  function tick() {
    var cd = document.getElementById("bg-cd"); if (!cd) return;
    var l = lang(), T = L[l], now = new Date(), y = now.getFullYear();
    var start = new Date(y, 0, 1), end = new Date(y + 1, 0, 1), ms = end - now;
    var p = (now - start) / (end - start) * 100;
    if (ms <= 1000) { cd.innerHTML = '<div style="grid-column:1/-1"><b>' + esc(T.newYear) + "</b></div>"; return; }
    var s = Math.floor(ms / 1000), d = Math.floor(s / 86400); s -= d * 86400;
    var hh = Math.floor(s / 3600); s -= hh * 3600; var mm = Math.floor(s / 60); s -= mm * 60;
    var v = [d, hh, mm, s];
    cd.innerHTML = v.map(function (x, i) { return "<div><b>" + (i ? ("0" + x).slice(-2) : x) + "</b><small>" + esc(T.u[i]) + "</small></div>"; }).join("");
    var bar = document.getElementById("bg-bar"); if (bar) { bar.firstChild.style.width = p.toFixed(2) + "%"; bar.setAttribute("aria-valuenow", p.toFixed(1)); }
    var pc = document.getElementById("bg-pct"); if (pc) pc.textContent = fmt(T.passed, { p: p.toFixed(1).replace(".", l === "en" ? "." : ",") });
  }

  /* ---------------- Olimlar ---------------- */
  var CAT = { all: 0, mat: 1, fiz: 2, bosh: 3 };
  // Bir olim bir nechta bo'limda bo'lishi mumkin (masalan, Nyuton — ham matematik, ham fizik)
  function inCat(p, c) {
    var f = p.f || [], m = f.indexOf("mat") >= 0 || f.indexOf("sta") >= 0, z = f.indexOf("fiz") >= 0;
    return c === "mat" ? m : c === "fiz" ? z : !m && !z;
  }
  function shownDate() { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + state.off); return d; }
  function load(mm) {
    if (state.data[mm]) return state.data[mm];
    state.data[mm] = fetch("olimlar/" + mm + ".json", { cache: "default" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    state.data[mm].catch(function () { delete state.data[mm]; });
    return state.data[mm];
  }
  function sci() {
    var box = document.getElementById("bg-sci"); if (!box) return;
    var l = lang(), T = L[l], d = shownDate(), mm = ("0" + (d.getMonth() + 1)).slice(-2), key = mm + "-" + ("0" + d.getDate()).slice(-2);
    var dl = document.getElementById("bg-day"); if (dl) dl.textContent = state.off === 0 ? T.today : T.date(d.getDate(), T.mon[d.getMonth()]);
    var back = document.getElementById("bg-back"); if (back) back.hidden = state.off === 0;
    load(mm).then(function (data) {
      if (shownDate().getMonth() !== d.getMonth() || shownDate().getDate() !== d.getDate()) return;   // foydalanuvchi boshqa kunga o'tib bo'lgan
      var list = (data[key] || []).slice();
      var cnt = { all: list.length, mat: 0, fiz: 0, bosh: 0 };
      list.forEach(function (p) { ["mat", "fiz", "bosh"].forEach(function (c) { if (inCat(p, c)) cnt[c]++; }); });
      var tabs = document.getElementById("bg-tabs");
      if (tabs) {
        tabs.innerHTML = ["all", "mat", "fiz", "bosh"].map(function (c) { return '<button type="button" data-c="' + c + '" aria-pressed="' + (state.tab === c) + '">' + esc(T.tabs[CAT[c]]) + '<span class="n">' + cnt[c] + "</span></button>"; }).join("");
        tabs.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { state.tab = b.getAttribute("data-c"); state.all = false; sci(); }); });
      }
      var items = list.filter(function (p) { return state.tab === "all" || inCat(p, state.tab); });
      if (!items.length) { box.innerHTML = '<p class="bg-msg">' + esc(T.empty) + "</p>"; return; }
      var LIM = 6, more = items.length > LIM && !state.all;
      var yNow = new Date().getFullYear();
      box.innerHTML = '<ol class="bg-list">' + items.slice(0, more ? LIM : items.length).map(function (p) {
        var ago = yNow - p.y, an = ago > 0 && ago % 25 === 0;
        var name = l === "uz" ? p.n : l === "en" ? (p.e || p.n) : (p.r || p.n);
        var roles = (p.f || [p.c === "bosh" ? "olim" : p.c]).map(function (r) { return T.role[r] || r; }).join(", ");
        var desc = l === "uz" ? p.t : l === "en" ? p.d : "";
        var agoTxt = l === "ru" ? ruYears(ago) + " назад" : fmt(T.yearsAgo, { n: ago });
        var url = l === "uz" ? (p.wu || p.we) : l === "ru" ? (p.wr || p.we) : p.we;
        return '<li class="bg-item ' + esc(p.c) + '"><span class="yr">' + p.y + "<small>" + (p.dy ? "– " + p.dy : "") + "</small></span>" +
          '<span class="nm">' + esc(name) + (an ? '<span class="an">🎉 ' + esc(l === "ru" ? ago + "-летие" : fmt(T.anniv, { n: ago })) + "</span>" : "") + "</span>" +
          '<span class="rl">' + esc(roles) + " · " + esc(agoTxt) + "</span>" +
          "<p>" + (desc ? esc(desc) + " " : "") + (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(T.more) + " ↗</a>" : "") +
          (p.j && l === "uz" ? '<span class="ju">' + esc(p.j) + "</span>" : "") + "</p></li>";
      }).join("") + "</ol>" + (more ? '<button type="button" class="bg-more" id="bg-more">+ ' + (items.length - LIM) + "</button>" : "");
      var mb = document.getElementById("bg-more"); if (mb) mb.addEventListener("click", function () { state.all = true; sci(); });
    }).catch(function () { box.innerHTML = '<p class="bg-msg">' + esc(T.loadErr) + "</p>"; });
  }

  function init() {
    root = document.getElementById("bugun"); chip = document.getElementById("bugun-chip");
    if (!root && !chip) return;
    if (!document.getElementById("ka-bugun-css")) { var st = document.createElement("style"); st.id = "ka-bugun-css"; st.textContent = CSS; document.head.appendChild(st); }
    render();
    var day = new Date().getDate();
    state.tick = setInterval(function () {
      if (document.hidden) return;
      if (new Date().getDate() !== day) { day = new Date().getDate(); state.off = 0; render(); return; }   // yarim tunda yangi kun
      tick();
    }, 1000);
    window.addEventListener("ka-til", function () { render(); });
  }
  window.kaBugun = { season: season, render: render };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
