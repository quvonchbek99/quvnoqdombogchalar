/*!
 * Kuvonch Academy — «Kuvi» personaji: kayfiyatga qarab shakli va yuzi o'zgaradigan kichik SVG
 * hamda vaziyatga mos gaplar (maqtov, tegajoq hazil, sinfga murojaat). ES5 — eski telefonlarda ham ishlaydi.
 * API: kaKuvi.svg(mood, cls) -> SVG matni
 *      kaKuvi.react(kind, {tz, n}) -> {mood, text, html}   kind: ok | bad | timeout | cGood | cMid | cBad
 *      kaKuvi.tease() -> tegajoq hazil yoqilganmi (AI ustoz sozlamasi bilan umumiy)
 */
(function () {
  "use strict";
  if (window.kaKuvi) return;

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function poly(cx, cy, R, r, n, rot) {
    var d = "", k, cnt = r ? n * 2 : n;
    for (k = 0; k < cnt; k++) {
      var a = (rot == null ? -90 : rot) * Math.PI / 180 + k * Math.PI * 2 / cnt, rr = r && k % 2 ? r : R;
      d += (k ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1) + " ";
    }
    return d + "Z";
  }
  // [shakl, rang, ko'z, og'iz, olov]
  var M = {
    neutral: ["pill", "#3b82f6", "normal", "smile"], happy: ["circle", "#22c55e", "happy", "grin"], love: ["pill", "#ec4899", "love", "smile"],
    think: ["hex", "#8b5cf6", "think", "smirk"], strict: ["star", "#f59e0b", "angry", "flat"], jealous: ["pill", "#f97316", "angry", "flat", 1],
    sad: ["tri", "#64748b", "sad", "frown"], wow: ["star", "#06b6d4", "wow", "o"]
  };
  var SHP = {
    pill: '<rect x="42" y="86" width="236" height="132" rx="66"/>', rsq: '<rect x="68" y="58" width="184" height="184" rx="46"/>',
    circle: '<circle cx="160" cy="150" r="100"/>', star: '<path d="' + poly(160, 160, 126, 62, 5) + '"/>',
    hex: '<path d="' + poly(160, 150, 112, 0, 6, 0) + '"/>', tri: '<path d="M160 46 L268 236 L52 236 Z"/>'
  };
  var DY = { pill: 0, rsq: 0, circle: 0, hex: 2, star: 16, tri: 34 };
  var HEART = 'd="M0 8 C-14 -2 -16 -14 -8 -18 C-3 -20 0 -16 0 -12 C0 -16 3 -20 8 -18 C16 -14 14 -2 0 8 Z"';
  var EYES = {
    normal: '<ellipse cx="126" cy="146" rx="13" ry="18"/><ellipse cx="194" cy="146" rx="13" ry="18"/>',
    happy: '<path class="ln" d="M110 152 Q126 130 142 152"/><path class="ln" d="M178 152 Q194 130 210 152"/>',
    angry: '<path d="M104 132 L148 148 Q147 168 127 168 Q105 168 104 146 Z"/><path d="M216 132 L172 148 Q173 168 193 168 Q215 168 216 146 Z"/>',
    love: '<path transform="translate(126 150) scale(1.7)" ' + HEART + '/><path transform="translate(194 150) scale(1.7)" ' + HEART + '/>',
    think: '<ellipse cx="134" cy="138" rx="11" ry="15"/><ellipse cx="200" cy="138" rx="11" ry="15"/><path class="ln" d="M118 116 L146 110"/>',
    sad: '<ellipse cx="126" cy="152" rx="12" ry="14"/><ellipse cx="194" cy="152" rx="12" ry="14"/><path class="ln" d="M110 132 L142 122"/><path class="ln" d="M178 122 L210 132"/>',
    wow: '<circle cx="126" cy="146" r="17"/><circle cx="194" cy="146" r="17"/><circle class="hl" cx="132" cy="139" r="5"/><circle class="hl" cx="200" cy="139" r="5"/>'
  };
  var MOUTH = {
    smile: '<path class="ln" d="M146 184 Q160 191 174 184"/>', grin: '<path class="ln" d="M136 178 Q160 206 184 178"/>',
    smirk: '<path class="ln" d="M148 189 Q164 183 176 190"/>', flat: '<path class="ln" d="M142 186 L178 186"/>',
    frown: '<path class="ln" d="M144 193 Q160 180 176 193"/>', o: '<ellipse cx="160" cy="186" rx="10" ry="11"/>'
  };
  var FL = ["M88 100 C70 88 70 62 84 40 C86 58 96 60 100 50 C108 68 104 90 88 100Z", "M122 96 C102 82 104 50 122 24 C124 46 136 50 140 36 C150 60 142 86 122 96Z",
    "M160 94 C138 78 140 40 160 10 C164 34 176 38 180 24 C190 52 182 82 160 94Z", "M198 96 C178 86 180 56 196 30 C200 50 212 52 216 40 C224 64 216 88 198 96Z",
    "M232 100 C216 92 216 70 228 48 C232 62 240 64 244 56 C250 74 246 94 232 100Z"];
  var uid = 0;
  function svg(mood, cls) {
    var m = M[mood] || M.neutral, id = "kvg" + (++uid), fire = "";
    if (m[4]) {
      fire = '<defs><linearGradient id="' + id + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".55" stop-color="#f97316"/><stop offset="1" stop-color="#facc15"/></linearGradient></defs><g class="kvf">';
      for (var i = 0; i < FL.length; i++) fire += '<path d="' + FL[i] + '" fill="url(#' + id + ')"/>';
      fire += "</g>";
    }
    return '<svg class="kuvi ' + (cls || "") + '" viewBox="0 -14 320 290" aria-hidden="true" style="--kc:' + m[1] + '"><g class="kvo"><g class="kvb">' + fire +
      '<g class="kvs">' + SHP[m[0]] + '</g><g class="kve" transform="translate(0 ' + DY[m[0]] + ')">' + EYES[m[2]] + MOUTH[m[3]] + "</g></g></g></svg>";
  }

  var L = {
    ok: ["Barakalla!", "Zo'r, aynan shunday!", "Ofarin, miyang charxlangan!", "Qoyil, to'ppa-to'g'ri!", "Ana, ko'rdingmi, uddalading!", "Super! Shunday davom et!"],
    streak: ["Ketma-ket {n} ta! Yonib ketyapsan!", "{n} ta ketma-ket — bugun sen yulduzsan!", "Voy-voy, {n} ta ketma-ket! Hech kim to'xtata olmaydi!"],
    bad: ["Afsus, bu safar xato. Keyingisida albatta topasan!", "Hmm, unchalik emas. Yechimga bir qara-chi.", "Xato, lekin xatodan o'rganamiz!", "Bu safar o'xshamadi. Yechimni o'qib ol!"],
    tease: ["Voy qovoq kalla-ey!", "Ey oshqovoq, shuni ham bilmaysanmi?", "Qovunjon, bir o'ylab ko'r-chi!", "Hay qovoq kallajonim...", "Oshqovoqcha, bunisi oson-ku!",
      "Voy qovun-ey, shunga ham-a?", "Ey xumpar, qayoqqa qarayapsan?", "Voy eshakvoy-ey!", "Voy poponam-ey, shuni ham bilmaysanmi?", "Tarvuz kalla, bunisi oson-ku!", "Xumparvoy, miyangni ishlat-chi!"],
    timeout: ["Vaqt tugadi-ku! Keyingisida tezroq bo'l.", "Soatga qara, do'stim! Ulgurmay qolding."],
    timeoutT: ["Voy uyquchi-ey, vaqt tugadi-ku!", "Poponam, tezroq bo'l-da!", "Xumpar, soatga qara!", "Qovoq kalla, uxlab qoldingmi?"],
    cGood: ["Barakalla, sinf! Deyarli hamma topdi!", "Zo'r sinf! Ofarin hammangizga!", "Qoyil! Bu sinf — chempionlar sinfi!"],
    cMid: ["Yomon emas! Lekin yarmingiz yana o'ylab ko'ring.", "Yarmingiz topdi — keyingisida hammangiz topasiz!", "Hmm, o'rtacha. Yechimga diqqat bilan qarang!"],
    cBad: ["Bu savol qiyin bo'ldi. Keling, yechimini birga ko'ramiz.", "Ko'pchilik topa olmadi. Yechimga diqqat qiling!"],
    cBadT: ["Voy, butun sinf qovoq kalla bo'lib qoldimi?! Mayli, yechimni birga ko'ramiz.", "Eshakvoylarim-ey, shunga ham-a? Yechimga qaranglar!", "Oshqovoqlarim-ey, qani, yechimni o'qiylik!", "Xumparlar-ey, uyg'oninglar! Yechimga qarang."]
  };
  function tease() { try { var c = JSON.parse(localStorage.getItem("ka.ustoz.cfg") || "{}"); return c.tease !== false; } catch (e) { return true; } }
  function react(kind, o) {
    o = o || {}; var tz = o.tz == null ? tease() : !!o.tz, n = o.n | 0, t, mood;
    if (kind === "ok") { if (n >= 3) { t = pick(L.streak).replace("{n}", n); mood = "love"; } else { t = pick(L.ok); mood = "happy"; } }
    else if (kind === "bad") { if (tz && Math.random() < .7) { t = pick(L.tease) + " " + pick(L.bad); mood = Math.random() < .5 ? "jealous" : "strict"; } else { t = pick(L.bad); mood = "sad"; } }
    else if (kind === "timeout") { t = pick(tz ? L.timeoutT : L.timeout); mood = "wow"; }
    else if (kind === "cGood") { t = pick(L.cGood); mood = Math.random() < .5 ? "love" : "happy"; }
    else if (kind === "cMid") { t = pick(L.cMid); mood = "think"; }
    else { t = pick(tz ? L.cBadT : L.cBad); mood = tz ? "jealous" : "strict"; }
    return { mood: mood, text: t, html: '<div class="kvr kvr-' + mood + '">' + svg(mood) + '<div class="kvq">' + t.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }) + "</div></div>" };
  }

  /* ---------- Ovoz: kayfiyatga mos ohang va jins (odatda muloyim ayol, jahli chiqqanda erkak) ---------- */
  // r — tezlik, p — ohang balandligi, g — f (ayol) / m (erkak)
  var PROS = { neutral: { r: .96, p: 1.1, g: "f" }, happy: { r: 1.06, p: 1.24, g: "f" }, love: { r: .9, p: 1.16, g: "f" }, think: { r: .9, p: 1.02, g: "f" },
    strict: { r: .98, p: .78, g: "m" }, jealous: { r: 1.06, p: .7, g: "m" }, sad: { r: .84, p: .9, g: "f" }, wow: { r: 1.04, p: 1.34, g: "f" }, listen: { r: .96, p: 1.1, g: "f" } };
  var FEM = /(zira|irina|madina|svetlana|dariya|aria|jenny|michelle|samantha|karen|victoria|anna|elena|ekaterina|milena|yelda|emel|filiz|seda|natasha|hazel|susan|libby|sonia|\bava\b|emma|tatyana|alena|aigul|aylin|google us english|google русский|google türkçe)/i;
  var MAL = /(david|mark|pavel|sardor|dmitry|\bguy\b|ryan|davis|tony|ahmet|yuri|maxim|\balex\b|daniel|fred|thomas|george|james|andrew|brian|christopher|eric|roger|tolga|daulet|google uk english male)/i;
  function gOf(v) { var n = v && v.name || ""; if (/female|woman/i.test(n)) return "f"; if (/\bmale\b|\bman\b/i.test(n)) return "m"; if (FEM.test(n)) return "f"; if (MAL.test(n)) return "m"; return "?"; }
  function voices() { try { return window.speechSynthesis ? speechSynthesis.getVoices() || [] : []; } catch (e) { return []; } }
  // l: "uz" | "en" | "ru" | "tr"; g: "f" | "m" | "" — tabiiyroq (Natural/Online/Google) va kerakli jinsdagi ovozni tanlaydi
  function voice(l, g) {
    var c = voices().filter(function (v) { return String(v.lang || "").toLowerCase().replace("_", "-").indexOf(l) === 0; });
    if (!c.length) return null;
    function sc(v) { var n = v.name || "", s = 0, vg = gOf(v); if (/natural|neural|online/i.test(n)) s += 6; if (/google/i.test(n)) s += 3; if (/premium|enhanced/i.test(n)) s += 3; if (l === "en" && /en-us/i.test(v.lang)) s += 1; if (g) s += vg === g ? 5 : vg === "?" ? 1 : 0; return s; }
    c.sort(function (a, b) { return sc(b) - sc(a); });
    return c[0];
  }
  function pros(mood, pref) { var p = PROS[mood] || PROS.neutral, g = pref === "f" || pref === "m" ? pref : p.g, pt = p.p; if (pref === "f" && pt < .9) pt = .9; if (pref === "m" && pt > 1.05) pt = 1 + (pt - 1) * .4; return { r: p.r, p: pt, g: g }; }
  function toTr(t) { return t.replace(/([Oo])['ʻʼ‘’`]/g, "$1").replace(/([Gg])['ʻʼ‘’`]/g, "$1").replace(/sh/g, "ş").replace(/S[hH]/g, "Ş").replace(/ch/g, "ç").replace(/C[hH]/g, "Ç").replace(/q/g, "k").replace(/Q/g, "K").replace(/x/g, "h").replace(/X/g, "H").replace(/j/g, "c").replace(/J/g, "C").replace(/['ʻʼ‘’`]/g, ""); }
  function toCyr(t) {
    var s = String(t).toLowerCase().replace(/[ʻʼ‘’`]/g, "'"), R = [[/o'/g, "у"], [/g'/g, "г"], [/sh/g, "ш"], [/ch/g, "ч"], [/\bye/g, "е"], [/ya/g, "я"], [/yo/g, "ё"], [/yu/g, "ю"], [/\be/g, "э"]], i;
    for (i = 0; i < R.length; i++) s = s.replace(R[i][0], R[i][1]);
    var A = { a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "х", i: "и", j: "дж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "к", r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з", c: "к", w: "в", "'": "" };
    return s.replace(/[a-z']/g, function (c) { return A[c] != null ? A[c] : c; });
  }
  // O'zbekcha matnni kayfiyatga mos ovozda o'qiydi (o'zbek ovozi bo'lmasa turkcha, keyin ruscha ovoz bilan)
  var lastCancel = 0;
  function say(text, mood, pref, onend) {
    var sy = window.speechSynthesis; if (!sy || !text) { if (onend) onend(); return; }
    var pr = pros(mood, pref), t = String(text).replace(/[«»“”"]/g, ""), v = voice("uz", pr.g);
    if (!v) { v = voice("tr", pr.g); if (v) t = toTr(t); else { v = voice("ru", pr.g); if (v) t = toCyr(t); } }
    try {
      var u = new SpeechSynthesisUtterance(t);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "uz-UZ";
      u.rate = pr.r; u.pitch = pr.p; u.volume = 1;
      if (onend) { u.onend = onend; u.onerror = onend; }
      sy.cancel(); lastCancel = Date.now();
      setTimeout(function () { try { if (sy.resume) sy.resume(); sy.speak(u); } catch (e) {} }, 90);
    } catch (e) { if (onend) onend(); }
  }

  var css = ".kuvi{display:block;width:120px;height:auto;overflow:visible}" +
    ".kuvi .kvs *{fill:#fff;stroke:var(--kc);stroke-width:15;stroke-linejoin:round}" +
    ".kuvi .kve *{fill:#1d2230}.kuvi .kve .ln{fill:none;stroke:#1d2230;stroke-width:9;stroke-linecap:round}.kuvi .kve .hl{fill:#fff}" +
    ".kuvi .kvo{animation:kvbob 3s ease-in-out .5s infinite}" +
    ".kuvi .kvb{transform-origin:160px 150px;animation:kvpop .55s cubic-bezier(.34,1.56,.64,1) both;filter:drop-shadow(0 0 12px var(--kc))}" +
    ".kuvi .kvf path{transform-box:fill-box;transform-origin:50% 100%;animation:kvfl .5s ease-in-out infinite alternate}" +
    ".kuvi .kvf path:nth-child(2n){animation-duration:.42s;animation-delay:-.2s}" +
    "@keyframes kvbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}" +
    "@keyframes kvpop{from{transform:scale(.3) rotate(-25deg);opacity:0}to{transform:none;opacity:1}}" +
    "@keyframes kvfl{from{transform:scaleY(.86) skewX(-4deg)}to{transform:scaleY(1.12) skewX(5deg)}}" +
    ".kvr{display:flex;flex-direction:column;align-items:center;gap:8px;margin:0 auto 4px}" +
    ".kvq{position:relative;background:#fff;color:#1d2230;font-weight:700;font-size:15px;line-height:1.35;padding:9px 14px;border-radius:16px;max-width:300px;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.25)}" +
    ".kvq:before{content:'';position:absolute;left:50%;top:-7px;margin-left:-7px;border:7px solid transparent;border-top:0;border-bottom-color:#fff}" +
    "@media (prefers-reduced-motion:reduce){.kuvi .kvo,.kuvi .kvb,.kuvi .kvf path{animation:none}}";
  try { var st = document.createElement("style"); st.id = "ka-kuvi-css"; st.appendChild(document.createTextNode(css)); (document.head || document.documentElement).appendChild(st); } catch (e) {}

  window.kaKuvi = { svg: svg, react: react, tease: tease, lines: L, moods: M, voice: voice, pros: pros, say: say, gender: gOf };
})();
