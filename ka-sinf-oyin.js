/*!
 * Kuvonch Academy — sinf o'yinlari uchun umumiy dvigatel (ka-sinf-oyin.js)
 * Ishlatadigan sahifalar: kataklar.html (Sirli kataklar), shoh-savol.html (Shoh savol doskasi),
 * oltin-sandiq.html (Oltin sandiq), moslashtir.html, mol-ur.html, omad-gildiragi.html
 *
 *  KSO.TOPICS / GROUPS / FANS     — viktorina bilan bir xil mavzular katalogi (grafikli savollarsiz)
 *  KSO.picker(el, sel, onChange)  — fan → mavzu tanlash paneli (qidiruv, guruhlar, "Hammasi")
 *  KSO.prep(ids) -> Promise        — kerakli generator fayllarini (faqat tanlangan fanlar) yuklaydi
 *  KSO.ask(ids, lvl, seen, o)      — {q, a, opts[], ci, steps[], tid, L, r} — har safar yangi savol
 *  KSO.askModal(o)                 — savol oynasi: 4 variant, taymer, yechim qadamlari
 *  KSO.teamsUI / podium / confetti / snd / toast / fit / full
 *  KSO.room                        — telefon rejimi: xona (kod + QR), o'quvchilar ro'yxati, telefon tomoni
 * Savollar: ka-savollar.js (kaSavol) + fan generatorlari. ES5 — eski telefonlarda ham ishlaydi.
 */
(function () {
  "use strict";
  if (window.KSO) return;

  var M = window.KA_MAVZU; if (!M) { console.error("ka-mavzular.js ulanmagan"); return; }
  var TOPICS = M.TOPICS, GROUPS = M.GROUPS, FANS = M.FANS, TITLE = M.TITLE;
  var BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/?#]*([?#].*)?$/, "");
  var V = "?v=20261117a";

  /* ---------------- yordamchilar ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // Generator matnlari ichki (ishonchli) — faqat oddiy formatlash teglari qoldiriladi
  function safe(h) {
    return String(h == null ? "" : h).replace(/<(?!\/?(b|i|sup|sub|br|span|small|strong|em|u|table|tbody|tr|td)\b)[^>]*>/gi, "")
      .replace(/<(b|i|sup|sub|span|small|strong|em|u|table|tbody|tr|td)\s[^>]*>/gi, "<$1>")
      .replace(/(^|[\s(;=:,\[{·])-(?=\d)/g, "$1−");
  }
  function plain(h) { var d = document.createElement("div"); d.innerHTML = safe(h); return (d.textContent || "").replace(/\s+/g, " ").trim(); }
  function vib(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function load(key, def) {
    var o = {}; for (var k in def) o[k] = def[k];
    try { var s = JSON.parse(localStorage.getItem(key) || "null"); if (s) for (var k2 in s) if (k2 in o) o[k2] = s[k2]; } catch (e) {}
    return o;
  }
  function save(key, o) { try { localStorage.setItem(key, JSON.stringify(o)); } catch (e) {} }
  function toast(t, ms) {
    var el = $("#ksToast");
    if (!el) { el = document.createElement("div"); el.id = "ksToast"; el.className = "ks-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("on"); }, ms || 2400);
  }
  function mmss(s) { s = Math.max(0, Math.ceil(s)); var m = Math.floor(s / 60), x = s % 60; return m + ":" + (x < 10 ? "0" : "") + x; }
  // matnni katakka sig'diradi (eng katta shrift)
  function fit(el, max, min) {
    if (!el || !el.clientHeight || !el.clientWidth) return 0;
    var lo = min || 12, hi = Math.max(lo, max), best = lo;
    for (var i = 0; i < 9; i++) {
      var mid = (lo + hi) / 2; el.style.fontSize = mid + "px";
      if (el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1) { best = mid; lo = mid; } else hi = mid;
    }
    el.style.fontSize = Math.floor(best) + "px";
    return Math.floor(best);
  }
  function full(on) {
    var d = document, el = d.documentElement;
    try {
      if (on === false) { if (d.fullscreenElement && d.exitFullscreen) d.exitFullscreen(); return; }
      if (!d.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(function () {});
    } catch (e) {}
  }
  var wakeLock = null;
  function wake(on) {
    try { document.body.classList.toggle("ks-play", !!on); } catch (e) {}
    try {
      if (on && navigator.wakeLock && !wakeLock) navigator.wakeLock.request("screen").then(function (w) { wakeLock = w; w.addEventListener("release", function () { wakeLock = null; }); }).catch(function () {});
      if (!on && wakeLock) { wakeLock.release(); wakeLock = null; }
    } catch (e) {}
  }

  /* ---------------- ovozlar ---------------- */
  var AC = null, soundOn = true;
  try { soundOn = localStorage.getItem("ka.kso.sound") !== "0"; } catch (e) {}
  function snd(kind) {
    if (!soundOn) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var seq = {
        ok: [[660, .09], [880, .13]], bad: [[220, .18], [160, .22]], win: [[523, .12], [659, .12], [784, .12], [1046, .32]],
        tick: [[1000, .03]], coin: [[988, .06], [1319, .16]], boom: [[120, .1], [80, .25]], pop: [[520, .05]], open: [[392, .07], [523, .07], [659, .12]],
        whack: [[300, .04], [180, .06]], swap: [[440, .08], [330, .08], [440, .08]], steal: [[700, .06], [500, .06], [300, .1]], click: [[800, .025]]
      }[kind] || [];
      var t = AC.currentTime, saw = kind === "bad" || kind === "boom" || kind === "whack";
      seq.forEach(function (s) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = saw ? "sawtooth" : kind === "coin" ? "square" : "triangle"; o.frequency.value = s[0];
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(kind === "coin" ? .08 : .16, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + s[1]);
        o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + s[1] + .02); t += s[1] * .9;
      });
    } catch (e) {}
  }
  function setSound(on) { soundOn = !!on; try { localStorage.setItem("ka.kso.sound", on ? "1" : "0"); } catch (e) {} }

  /* ---------------- generatorlar: ka-mavzular.js ---------------- */
  function prep(ids) { return M.prep(ids); }
  // Bitta savol. lvl: 1 | 2 | 3 | "mix"; seen — takrorlanmasin; o.maxQ / o.maxA — qisqa savol kerak bo'lsa (Moslashtir, Mol ur)
  function ask(ids, lvl, seen, o) {
    o = o || {}; seen = seen || {};
    var best = null, tries = o.maxQ || o.maxA ? 40 : 18;
    for (var i = 0; i < tries; i++) {
      var tid = pick(ids), L = lvl === "mix" || !lvl ? rnd(1, 3) : +lvl, p = null;
      try { p = window.kaSavol.get(tid, L); } catch (e) { p = null; }
      if (!p || p.q == null || p.a == null) continue;
      var key = tid + "|" + p.q + "|" + p.a + (p.r ? JSON.stringify(p.r) : "");
      if (seen[key] && i < tries - 3) continue;
      var cand = { p: p, tid: tid, L: L, key: key };
      if ((o.maxQ && plain(p.q).length > o.maxQ) || (o.maxA && plain(p.a).length > o.maxA) || (o.noImg && p.r)) { if (!best) best = cand; continue; }
      best = cand; break;
    }
    if (!best) return null;
    seen[best.key] = 1;
    var p2 = best.p, right = String(p2.a), seenW = {}, wr = [];
    seenW[right] = 1;
    (p2.w || []).forEach(function (w) { w = String(w); if (!seenW[w] && w !== "") { seenW[w] = 1; wr.push(w); } });
    wr = shuffle(wr).slice(0, (o.nOpts || 4) - 1);
    var opts = shuffle([right].concat(wr));
    var steps = Array.isArray(p2.steps) ? p2.steps.map(String) : p2.steps ? [String(p2.steps)] : [];
    return { q: p2.q, a: right, opts: opts, ci: opts.indexOf(right), steps: steps, tid: best.tid, L: best.L, r: p2.r || null, wrong: wr };
  }
  function qHtml(q) { return (q && q.r ? M.img(q.r) : "") + safe(q ? q.q : ""); }

  /* ---------------- mavzu tanlash paneli ---------------- */
  // sel — tanlangan id lar massivi (joyida o'zgaradi); onChange(sel)
  function picker(el, sel, onChange) {
    var fan = "all";
    var fq = (/[?&]fan=([a-z]+)/i.exec(location.search) || [])[1];
    if (fq && FANS.some(function (f) { return f[0] === fq; })) fan = fq;
    el.innerHTML =
      '<div class="ks-fans" role="toolbar" aria-label="Fanlar">' + FANS.map(function (f) { return '<button type="button" data-f="' + f[0] + '">' + esc(f[1]) + "</button>"; }).join("") + "</div>" +
      '<input class="ks-field ks-tsearch" type="search" placeholder="🔎 Mavzu qidirish: kasr, logarifm, lug\'at, poytaxt, Om qonuni…" aria-label="Mavzu qidirish" autocomplete="off">' +
      '<div class="ks-chips" aria-live="polite"></div>' +
      '<div class="ks-tlist">' + GROUPS.map(function (gn, gi) {
        var rows = TOPICS.filter(function (t) { return t[2] === gi; });
        if (!rows.length) return "";
        return '<details class="ks-tg" data-g="' + gi + '"><summary><span>' + esc(gn) + '</span><span class="cnt"></span><button type="button" class="all">Hammasi</button></summary><div class="ks-trows">' +
          rows.map(function (t) { return '<label class="ks-trow" data-id="' + t[0] + '" data-s="' + esc(t[1].toLowerCase()) + '"><input type="checkbox" value="' + t[0] + '"><span>' + esc(t[1]) + "</span></label>"; }).join("") + "</div></details>";
      }).join("") + "</div>";
    var list = $(".ks-tlist", el), chips = $(".ks-chips", el), search = $(".ks-tsearch", el);
    function norm(s) { return String(s).toLowerCase().replace(/[ʻʼ‘’`]/g, "'"); }
    function filter() {
      var q = norm(search.value.trim()), f = FANS.filter(function (x) { return x[0] === fan; })[0], gs = f && f[2];
      $$(".ks-fans button", el).forEach(function (b) { b.classList.toggle("on", b.dataset.f === fan); });
      $$(".ks-tg", list).forEach(function (tg) {
        var gi = +tg.dataset.g, okG = !gs || gs.indexOf(gi) > -1, any = false;
        $$(".ks-trow", tg).forEach(function (r) { var ok = okG && (!q || norm(r.dataset.s).indexOf(q) > -1); r.style.display = ok ? "" : "none"; if (ok) any = true; });
        tg.style.display = any ? "" : "none";
        if (q && any) tg.open = true;
      });
      var none = $(".ks-oznone", el);
      if (fan === "oz" && !TOPICS.some(function (t) { return t[2] === M.OZ_G; })) {
        if (!none) { none = document.createElement("p"); none.className = "ks-dim ks-oznone"; none.innerHTML = "Hali o'z savolingiz yo'q. <a href=\"viktorina.html\">⚡ Viktorina</a> sahifasida «✏️ Testni tahrirlash» orqali savol yozing yoki testni 💾 saqlang — u shu yerda va barcha sinf o'yinlarida chiqadi."; list.parentNode.insertBefore(none, list); }
      } else if (none) none.remove();
    }
    function sync() {
      $$(".ks-trow", list).forEach(function (r) { var on = sel.indexOf(r.dataset.id) > -1; r.classList.toggle("on", on); $("input", r).checked = on; });
      $$(".ks-tg", list).forEach(function (tg) {
        var rows = $$(".ks-trow", tg), on = rows.filter(function (r) { return r.classList.contains("on"); }).length;
        $(".cnt", tg).textContent = on ? on + " / " + rows.length : rows.length + " ta";
        tg.classList.toggle("has", on > 0);
      });
      chips.innerHTML = sel.length ? sel.map(function (id) { return '<span class="ks-chip">' + esc(TITLE[id] || id) + '<button type="button" data-id="' + id + '" aria-label="Olib tashlash">×</button></span>'; }).join("") +
        '<button type="button" class="ks-chipclr">Tozalash</button>' : '<span class="ks-dim">Hali mavzu tanlanmagan — quyidan bitta yoki bir nechtasini belgilang.</span>';
      if (onChange) onChange(sel);
    }
    list.addEventListener("change", function (e) {
      var c = e.target; if (!c || c.type !== "checkbox") return;
      var i = sel.indexOf(c.value);
      if (c.checked && i < 0) sel.push(c.value); if (!c.checked && i > -1) sel.splice(i, 1);
      sync();
    });
    list.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".all"); if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var tg = b.closest(".ks-tg"), ids = $$(".ks-trow", tg).filter(function (r) { return r.style.display !== "none"; }).map(function (r) { return r.dataset.id; });
      var allOn = ids.every(function (id) { return sel.indexOf(id) > -1; });
      ids.forEach(function (id) { var i = sel.indexOf(id); if (allOn && i > -1) sel.splice(i, 1); if (!allOn && i < 0) sel.push(id); });
      sync();
    });
    chips.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button"); if (!b) return;
      if (b.classList.contains("ks-chipclr")) sel.splice(0, sel.length);
      else { var i = sel.indexOf(b.dataset.id); if (i > -1) sel.splice(i, 1); }
      sync();
    });
    $(".ks-fans", el).addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("button"); if (b) { fan = b.dataset.f; filter(); } });
    search.addEventListener("input", filter);
    // tanlangan mavzular guruhi ochiq tursin
    $$(".ks-tg", list).forEach(function (tg) { if ($$(".ks-trow", tg).some(function (r) { return sel.indexOf(r.dataset.id) > -1; })) tg.open = true; });
    filter(); sync();
    return { sync: sync };
  }
  // ?mavzu=a1,t5 havolasidan
  function urlTopics() {
    var m = /[?&]mavzu=([a-z0-9,]+)/i.exec(location.search);
    return m ? m[1].split(",").filter(function (id) { return TITLE[id]; }) : null;
  }

  /* ---------------- jamoalar ---------------- */
  var TEAMS = [["🦁", "Sherlar"], ["🐺", "Bo'rilar"], ["🦅", "Burgutlar"], ["🐯", "Yo'lbarslar"], ["🐻", "Ayiqlar"], ["🦊", "Tulkilar"], ["🐬", "Delfinlar"], ["🐎", "Tulporlar"], ["🐝", "Arilar"], ["🦉", "Boyqushlar"]];
  var COLORS = ["#7c9bff", "#ff8585", "#5ee6c7", "#ffd479", "#c18bff", "#ff9f6b", "#6fd3ff", "#ff7ac8", "#a6e36b", "#e3e8f5"];
  // jamoa soni + nomlari. st = {n, names:[]}; min/max
  function teamsUI(el, st, min, max, onChange) {
    function draw() {
      var h = '<div class="ks-nbtns" role="group" aria-label="Jamoalar soni">';
      for (var n = min; n <= max; n++) h += '<button type="button" data-n="' + n + '"' + (n === st.n ? ' class="on"' : "") + ">" + n + "</button>";
      h += '</div><div class="ks-tnames">';
      for (var i = 0; i < st.n; i++) h += '<label style="--tc:' + COLORS[i] + '"><span>' + TEAMS[i][0] + '</span><input class="ks-field" data-i="' + i + '" maxlength="18" placeholder="' + esc(TEAMS[i][1]) + '" value="' + esc(st.names[i] || "") + '"></label>';
      el.innerHTML = h + "</div>";
    }
    el.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-n]"); if (b) { st.n = +b.dataset.n; draw(); if (onChange) onChange(); } });
    el.addEventListener("input", function (e) { var i = e.target.dataset && e.target.dataset.i; if (i != null) { st.names[+i] = e.target.value; if (onChange) onChange(); } });
    draw();
  }
  function makeTeams(st) {
    var out = [];
    for (var i = 0; i < st.n; i++) out.push({ i: i, emoji: TEAMS[i][0], name: (st.names[i] || "").trim() || TEAMS[i][1], color: COLORS[i], score: 0, ok: 0, no: 0 });
    return out;
  }
  // tanlov tugmalari guruhi: <div data-k="lvl"><button data-v="2">…
  function opts(el, st, onChange) {
    $$("[data-k]", el).forEach(function (g) {
      var k = g.dataset.k;
      function sync() { $$("button[data-v]", g).forEach(function (b) { b.classList.toggle("on", String(st[k]) === b.dataset.v); }); }
      g.addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest("button[data-v]"); if (!b) return;
        var v = b.dataset.v; st[k] = /^-?\d+$/.test(v) ? +v : v === "true" ? true : v === "false" ? false : v;
        sync(); if (onChange) onChange();
      });
      sync();
    });
  }

  /* ---------------- 📷 kartalar (Plickers kabi): butun sinf qog'oz karta ko'taradi, kamera o'qiydi ---------------- */
  // st: {ans: "ekran"|"kart", kr: guruh kaliti, kn: kartalar soni (ro'yxatsiz)}
  function cardsUI(el, st, onChange, fixed) {
    var KK = window.KKarta;
    function draw() {
      var rs = KK ? KK.rosters() : [];
      if (st.kr && !rs.some(function (r) { return r.key === st.kr; })) st.kr = "";
      el.innerHTML = (fixed ? "" : '<div class="ks-lbl">Javob berish usuli</div><div class="ks-seg" data-k="ans"><button data-v="ekran">🖱 Ekranda — jamoa vakili bosadi</button><button data-v="kart">📷 Kartalar — butun sinf, kamera o\'qiydi</button></div>') +
        (fixed || st.ans === "kart" ? '<div class="ks-grid2"><div><div class="ks-lbl">Guruh ro\'yxati</div><select class="ks-field" data-r="1"><option value="">Ro\'yxatsiz — karta raqamlari bo\'yicha</option>' +
          rs.map(function (r) { return '<option value="' + esc(r.key) + '"' + (r.key === st.kr ? " selected" : "") + ">" + esc(r.name) + " · " + r.list.length + " o'quvchi</option>"; }).join("") + "</select></div>" +
          (st.kr ? "" : '<div><div class="ks-lbl">Sinfda nechta o\'quvchi (kartalar 1 dan …)</div><input class="ks-field" data-n="1" type="number" min="2" max="40" value="' + (st.kn || 30) + '"></div>') + "</div>" +
          '<p class="ks-dim" style="margin:6px 0 0">Har o\'quvchi o\'z raqamli kartasini ko\'taradi — tepadagi harf (A, B, C, D) javobi. Jamoalar karta raqamlari bo\'yicha ketma-ket bo\'linadi. Kartalarni <a href="kartalar.html" target="_blank" rel="noopener">🃏 Kuvonch kartalar</a> sahifasidan chop eting; Davomat ro\'yxatini ham o\'sha yerda ulaysiz. Kamera — shu kompyuterniki yoki o\'qituvchi telefoni.</p>' : "");
      opts(el, st, function () { draw(); if (onChange) onChange(); });
      var sel = $("[data-r]", el); if (sel) sel.onchange = function () { st.kr = sel.value; draw(); if (onChange) onChange(); };
      var n = $("[data-n]", el); if (n) n.oninput = function () { st.kn = Math.max(2, Math.min(40, +n.value || 30)); if (onChange) onChange(); };
    }
    draw();
  }
  // sinf: o'quvchilar soni va ismlari (ro'yxat bo'lsa)
  function cardClass(st) {
    var KK = window.KKarta, r = st.kr && KK ? KK.roster(st.kr) : null;
    var n = r ? Math.min(r.list.length, KK.MAX) : Math.max(2, Math.min(40, +st.kn || 30));
    return { roster: r, n: n, name: function (s) { return r ? KK.shortName(r.list[s]) : "Karta " + (s + 1); },
      person: function (card) { return r ? KK.studentOf(r.key, n, card) : card >= 1 && card <= n ? card - 1 : -1; } };
  }
  // jamoalarga ketma-ket bo'lish (t.from..t.to — o'quvchi tartib raqami 0 dan)
  function cardTeams(teams, cls) {
    var T = teams.length;
    teams.forEach(function (t, i) { t.from = Math.ceil(i * cls.n / T); t.to = Math.ceil((i + 1) * cls.n / T) - 1; t.range = (t.from + 1) + "–" + (t.to + 1); });
    return function (s) { if (s < 0) return -1; for (var i = 0; i < T; i++) if (s >= teams[i].from && s <= teams[i].to) return i; return -1; };
  }
  var KC = null, sink = null;
  function cardsOpen(title) {
    if (!window.KKarta) { toast("Skaner moduli yuklanmadi — sahifani yangilang"); return null; }
    if (KC) return KC;
    KC = window.KKarta.open({ title: title, onCard: function (c, L) { if (sink) sink(c, L); }, onClose: function () { KC = null; },
      onReady: function () { if (!modal) setTimeout(function () { if (KC && !modal) KC.min(true); }, 1500); } }); // savol yo'q paytda yig'ilib turadi
    return KC;
  }
  function cardsClose() { if (KC) KC.close(); KC = null; sink = null; }

  /* ---------------- savol oynasi ---------------- */
  // o: {q, title, color, value, time (s, 0 — cheksiz), disabled:[idx], onDone({ok, idx, timeout}), extra:[{t, cls, fn}] (natijadan keyin), steal: bool}
  var LET = ["A", "B", "C", "D", "E", "F"];
  var modal = null;
  function closeModal() { sink = null; if (KC && modal && modal.cards) KC.min(true); if (modal) { clearInterval(modal.timer); document.removeEventListener("keydown", modal.key); modal.el.remove(); modal = null; } }
  function askModal(o) {
    closeModal();
    var q = o.q, el = document.createElement("div");
    el.className = "ks-ov ks-ask";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.innerHTML = '<div class="ks-qbox" style="--tc:' + (o.color || "#7c9bff") + '">' +
      '<div class="ks-qhead">' + (o.title ? '<span class="ks-qteam">' + esc(o.title) + "</span>" : "") + (o.value != null ? '<span class="ks-qval">' + esc(o.value) + "</span>" : "") +
      '<span class="ks-qtime" hidden></span><button type="button" class="ks-x" aria-label="Yopish">✕</button></div>' +
      (o.topic !== false ? '<div class="ks-qtopic">' + esc((TITLE[q.tid] || "") + "  ·  " + "★★★".slice(0, q.L || 2)) + "</div>" : "") +
      '<div class="ks-qtext"><div>' + qHtml(q) + "</div></div>" +
      '<div class="ks-opts n' + q.opts.length + '">' + q.opts.map(function (t, i) {
        return '<button type="button" class="ks-opt c' + i + '" data-i="' + i + '"' + (o.disabled && o.disabled.indexOf(i) > -1 ? " disabled" : "") + '><b>' + LET[i] + "</b><span>" + safe(t) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="ks-qfoot"></div></div>';
    document.body.appendChild(el);
    var m = modal = { el: el, done: false, timer: 0, cards: !!o.cards };
    var tEl = $(".ks-qtime", el), foot = $(".ks-qfoot", el), left = o.time || 0;
    requestAnimationFrame(function () { fit($(".ks-qtext", el), 46, 15); $$(".ks-opt span", el).forEach(function (s) { s.style.fontSize = ""; }); });
    function finish(idx, timeout) {
      if (m.done) return; m.done = true; clearInterval(m.timer);
      var ok = idx === q.ci;
      $$(".ks-opt", el).forEach(function (b, i) { b.disabled = true; if (i === q.ci) b.classList.add("right"); else if (i === idx) b.classList.add("wrong"); else b.classList.add("dim"); });
      snd(ok ? "ok" : "bad"); vib(ok ? 30 : [60, 40, 60]);
      var h = '<div class="ks-verdict ' + (ok ? "ok" : "no") + '">' + (ok ? "✅ To'g'ri!" : timeout ? "⏰ Vaqt tugadi" : "❌ Noto'g'ri") + (ok ? "" : ' — to\'g\'ri javob: <b>' + safe(q.a) + "</b>") + "</div>";
      if (!ok && q.steps.length) h += '<details class="ks-steps" open><summary>💡 Yechim</summary><ol>' + q.steps.slice(0, 6).map(function (s) { return "<li>" + safe(s) + "</li>"; }).join("") + "</ol></details>";
      h += '<div class="ks-qbtns">';
      (o.extra || []).forEach(function (x, i) { if (!x.when || x.when === (ok ? "ok" : "no")) h += '<button type="button" class="ks-btn ' + (x.cls || "") + '" data-x="' + i + '">' + esc(x.t) + "</button>"; });
      h += '<button type="button" class="ks-btn primary" data-go="1">Davom ▶</button></div>';
      foot.innerHTML = h;
      var res = { ok: ok, idx: idx, timeout: !!timeout };
      foot.onclick = function (e) {
        var b = e.target.closest && e.target.closest("button"); if (!b) return;
        if (b.dataset.go) { closeModal(); if (o.onDone) o.onDone(res); }
        else if (b.dataset.x != null) { var x = o.extra[+b.dataset.x]; closeModal(); if (x.fn) x.fn(res); }
      };
      setTimeout(function () { var g = $("[data-go]", foot); if (g) try { g.focus({ preventScroll: true }); } catch (e) {} }, 60);
      if (o.onAnswer) o.onAnswer(res);
    }
    /* 📷 kartalar rejimi: hamma kartani ko'taradi, «Javobni ochish» yoki vaqt tugashi bilan natija */
    if (o.cards) {
      var C = o.cards, ans = {}, kc = cardsOpen(o.cardsTitle || "Kartalar");
      if (kc) { kc.min(false); kc.reset(Math.min(4, q.opts.length)); kc.setNote("▶ Kartalarni ko'taring!" + (q.opts.length < 4 ? " (faqat " + "ABCD".slice(0, q.opts.length).split("").join(", ") + ")" : "")); }
      $$(".ks-opt", el).forEach(function (b) { b.style.cursor = "default"; b.insertAdjacentHTML("beforeend", '<i class="ks-cnt"></i>'); });
      foot.innerHTML = '<div class="ks-live"></div><div class="ks-qbtns"><button type="button" class="ks-btn gold big" data-rev="1">✅ Javobni ochish</button></div>';
      var draw = function () {
        var per = C.teams.map(function () { return 0; }), tot = 0;
        for (var c in ans) { tot++; if (ans[c].t > -1) per[ans[c].t]++; }
        $(".ks-live", foot).innerHTML = "📷 <b>" + tot + "</b> ta javob" + (C.teams.length > 1 ? " · " + C.teams.map(function (t, i) { return '<span style="color:' + t.color + '">' + t.emoji + " " + per[i] + "</span>"; }).join(" · ") : "");
      };
      sink = function (card, L) {
        if (m.done) return;
        var j = "ABCD".indexOf(L); if (j < 0 || j >= q.opts.length) return;
        var s = C.cls.person(card); if (s < 0) return;
        ans[card] = { j: j, s: s, t: C.teamOf ? C.teamOf(s) : 0 }; draw();
      };
      draw();
      var reveal = function () {
        if (m.done) return; m.done = true; clearInterval(m.timer); sink = null;
        var cnt = q.opts.map(function () { return 0; }), st = C.teams.map(function () { return { n: 0, ok: 0 }; }), people = [];
        for (var c in ans) { var a = ans[c]; cnt[a.j]++; if (a.t > -1) { st[a.t].n++; if (a.j === q.ci) st[a.t].ok++; } people.push({ s: a.s, ok: a.j === q.ci, t: a.t }); }
        var tot = people.length, okN = people.filter(function (x) { return x.ok; }).length;
        $$(".ks-opt", el).forEach(function (b, i) { b.disabled = true; $(".ks-cnt", b).textContent = cnt[i]; if (i === q.ci) b.classList.add("right"); else b.classList.add("dim"); });
        snd(okN * 2 >= tot && tot ? "ok" : "bad");
        var res = { ok: tot > 0 && okN * 2 >= tot, idx: -1, cards: true, tot: tot, okN: okN, st: st, people: people };
        var h = '<div class="ks-verdict ' + (res.ok ? "ok" : "no") + '">✅ To\'g\'ri javob: <b>' + safe(q.a) + "</b> · " + okN + " / " + tot + " to'g'ri</div>";
        if (C.teams.length > 1) h += '<div class="ks-tstat">' + C.teams.map(function (t, i) { var x = st[i]; return '<span style="--tc:' + t.color + '">' + t.emoji + " " + esc(t.name) + ": <b>" + x.ok + "/" + x.n + "</b></span>"; }).join("") + "</div>";
        if (okN < tot && q.steps.length) h += '<details class="ks-steps"><summary>💡 Yechim</summary><ol>' + q.steps.slice(0, 6).map(function (s) { return "<li>" + safe(s) + "</li>"; }).join("") + "</ol></details>";
        var extraH = o.onReveal ? o.onReveal(res) || "" : "";
        foot.innerHTML = h + extraH + '<div class="ks-qbtns"><button type="button" class="ks-btn primary" data-go="1">Davom ▶</button></div>';
        if (kc) kc.setNote("✅ Natija ekranda. Keyingi savolda kartalarni yana ko'taring.");
        foot.onclick = function (e) { var b = e.target.closest && e.target.closest("[data-go]"); if (b) { closeModal(); if (o.onDone) o.onDone(res); } };
        if (o.onAnswer) o.onAnswer(res);
      };
      foot.onclick = function (e) { var b = e.target.closest && e.target.closest("[data-rev]"); if (b) reveal(); };
      m.reveal = reveal;
    }
    $(".ks-opts", el).addEventListener("click", function (e) { if (o.cards) return; var b = e.target.closest && e.target.closest(".ks-opt"); if (b && !b.disabled) finish(+b.dataset.i); });
    $(".ks-x", el).onclick = function () { if (m.done) { var g = $("[data-go]", foot); if (g) g.click(); return; } closeModal(); if (o.onCancel) o.onCancel(); };
    m.key = function (e) {
      if (o.cards) { if (e.key === "Enter") { e.preventDefault(); if (!m.done) m.reveal(); else { var g0 = $("[data-go]", foot); if (g0) g0.click(); } } return; }
      if (m.done) { if (e.key === "Enter" || e.key === " ") { var g = $("[data-go]", foot); if (g && document.activeElement !== g) { e.preventDefault(); g.click(); } } return; }
      var k = String(e.key).toUpperCase(), i = LET.indexOf(k); if (i < 0) i = ["1", "2", "3", "4", "5", "6"].indexOf(k);
      if (i > -1 && i < q.opts.length) { var b = $$(".ks-opt", el)[i]; if (b && !b.disabled) { e.preventDefault(); finish(i); } }
      if (e.key === "Escape") { closeModal(); if (o.onCancel) o.onCancel(); }
    };
    document.addEventListener("keydown", m.key);
    if (left > 0) {
      tEl.hidden = false; tEl.textContent = mmss(left);
      var end = Date.now() + left * 1000;
      m.timer = setInterval(function () {
        var s = (end - Date.now()) / 1000; tEl.textContent = mmss(s);
        tEl.classList.toggle("low", s <= 5);
        if (s <= 5 && s > 0 && Math.abs(s - Math.round(s)) < .13) snd("tick");
        if (s <= 0) { if (m.reveal) m.reveal(); else finish(-1, true); }
      }, 250);
    }
    return { close: closeModal, el: el };
  }

  /* ---------------- tanlash va e'lon oynalari ---------------- */
  // items: [{label, color, sub, value}] -> cb(index) ; o.cancel — "Bekor qilish" matni (bo'lmasa — majburiy tanlov)
  function choose(title, items, cb, o) {
    o = o || {};
    var el = document.createElement("div"); el.className = "ks-ov ks-choose";
    el.innerHTML = '<div class="ks-cbox"><h2>' + esc(title) + "</h2>" + (o.text ? '<p class="ks-dim">' + esc(o.text) + "</p>" : "") + '<div class="ks-citems">' +
      items.map(function (t, i) { return '<button type="button" class="ks-citem" data-i="' + i + '" style="--tc:' + (t.color || "#7c9bff") + '"' + (t.disabled ? " disabled" : "") + '><span>' + esc(t.label) + "</span>" + (t.sub != null ? "<b>" + esc(t.sub) + "</b>" : "") + "</button>"; }).join("") +
      "</div>" + (o.cancel ? '<div class="ks-qbtns"><button type="button" class="ks-btn" data-c="1">' + esc(o.cancel) + "</button></div>" : "") + "</div>";
    document.body.appendChild(el);
    el.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button"); if (!b || b.disabled) return;
      el.remove(); snd("click");
      if (b.dataset.c) { if (o.onCancel) o.onCancel(); return; }
      cb(+b.dataset.i);
    });
    return el;
  }
  // katta e'lon: belgi + sarlavha + matn, "Davom" tugmasi
  function notice(icon, title, text, cb, cls) {
    var el = document.createElement("div"); el.className = "ks-ov ks-notice " + (cls || "");
    el.innerHTML = '<div class="ks-nbox"><div class="ks-nicon">' + icon + "</div><h2>" + esc(title) + "</h2>" + (text ? "<p>" + text + "</p>" : "") + '<div class="ks-qbtns"><button type="button" class="ks-btn primary big">Davom ▶</button></div></div>';
    document.body.appendChild(el);
    var b = $("button", el);
    function go() { if (!el.parentNode) return; el.remove(); document.removeEventListener("keydown", kd); if (cb) cb(); }
    function kd(e) { if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); go(); } }
    b.onclick = go; document.addEventListener("keydown", kd);
    setTimeout(function () { try { b.focus({ preventScroll: true }); } catch (e) {} }, 50);
    return el;
  }

  /* ---------------- natija: podium + konfetti ---------------- */
  function confetti(ms) {
    var c = document.createElement("canvas"); c.className = "ks-confetti"; document.body.appendChild(c);
    var x = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight, P = [], t0 = Date.now(), dur = ms || 3500;
    var cols = ["#ffd479", "#5ee6c7", "#7c9bff", "#ff8585", "#c18bff", "#ff9f6b"];
    for (var i = 0; i < 160; i++) P.push({ x: Math.random() * W, y: -20 - Math.random() * H * .6, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, r: 4 + Math.random() * 6, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: pick(cols) });
    (function f() {
      x.clearRect(0, 0, W, H);
      P.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
      if (Date.now() - t0 < dur) requestAnimationFrame(f); else c.remove();
    })();
  }
  // list: [{emoji, name, score, color, sub}] — kamayish tartibida bo'lishi shart emas
  function podium(list, unit, title, btns) {
    closeModal();
    var L = list.slice().sort(function (a, b) { return b.score - a.score; });
    var el = document.createElement("div"); el.className = "ks-ov ks-pod";
    var top = [L[1], L[0], L[2]];
    var rank = 0, prev = null;
    var ranks = L.map(function (t, i) { if (t.score !== prev) { rank = i + 1; prev = t.score; } return rank; });
    el.innerHTML = '<div class="ks-podbox"><h2>' + esc(title || "🏆 G'oliblar") + '</h2><div class="ks-podium">' + top.map(function (t, i) {
      if (!t) return '<div class="ks-pcol empty"></div>';
      var place = [2, 1, 3][i];
      return '<div class="ks-pcol p' + place + '" style="--tc:' + (t.color || "#7c9bff") + '"><div class="ks-pemoji">' + esc(t.emoji || "") + '</div><div class="ks-pname">' + esc(t.name) + '</div><div class="ks-pscore">' + esc(t.score) + " " + esc(unit || "") + '</div><div class="ks-pbar"><b>' + ["🥈", "🥇", "🥉"][i] + "</b></div></div>";
    }).join("") + "</div>" +
      (L.length > 3 ? '<ol class="ks-rest" start="4">' + L.slice(3).map(function (t, i) { return "<li><span>" + ranks[i + 3] + ".</span> " + esc((t.emoji || "") + " " + t.name) + "<b>" + esc(t.score) + "</b></li>"; }).join("") + "</ol>" : "") +
      '<div class="ks-qbtns">' + (btns || []).map(function (b, i) { return '<button type="button" class="ks-btn ' + (b.cls || "") + '" data-b="' + i + '">' + esc(b.t) + "</button>"; }).join("") + "</div></div>";
    document.body.appendChild(el);
    el.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-b]"); if (b) { var x = btns[+b.dataset.b]; if (!x.keep) el.remove(); if (x.fn) x.fn(); } });
    snd("win"); confetti();
    return el;
  }

  /* ---------------- telefon rejimi: xona ---------------- */
  var QR_SRCS = ["vendor/qrcode-1.4.4.min.js", "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"];
  function loadQr() {
    if (window.qrcode) return Promise.resolve();
    var i = 0;
    return new Promise(function (ok) {
      (function next() {
        if (i >= QR_SRCS.length) return ok();
        var s = document.createElement("script"), src = QR_SRCS[i++]; s.src = /^https?:/.test(src) ? src : BASE + src;
        s.onload = function () { ok(); }; s.onerror = next; document.head.appendChild(s);
      })();
    });
  }
  function qrSvg(text) { try { var q = window.qrcode(0, "M"); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); } catch (e) { return ""; } }
  function codeParam() { var m = /[?&]kod=([A-Za-z0-9]{5})/.exec(location.search); return m ? m[1].toUpperCase() : ""; }

  // O'qituvchi tomoni. o: {kind, page, el, title, max, onJoin(p), onRejoin(p), onLeave(p), onMsg(p, msg), onStart()}
  // Qaytaradi: Promise<R> — R.players (id -> {id, name, ...}), R.send(id,msg), R.cast(msg), R.beat(st), R.close(), R.list()
  function roomHost(o) {
    var N = window.KANet; if (!N) return Promise.reject(new Error("Tarmoq moduli yuklanmadi"));
    var players = {}, order = [], R = null, max = o.max || 80;
    var el = o.el;
    el.innerHTML = '<div class="ks-lobby"><div class="ks-lcode"><div class="ks-dim">Telefonda <b>kuvonch.uz/live</b> oching va kodni yozing</div><div class="ks-code">⏳</div><div class="ks-qr"></div><button type="button" class="ks-btn ks-qrbig">🔍 Kattalashtirish</button></div>' +
      '<div class="ks-lpl"><div class="ks-lhead"><b class="ks-lcount">0</b> o\'quvchi kirdi<span class="ks-dim"> · ismi ustiga bossangiz — chiqarib yuboriladi</span></div><div class="ks-plist"></div>' +
      '<div class="ks-qbtns"><button type="button" class="ks-btn" data-a="close">✖ Xonani yopish</button><button type="button" class="ks-btn primary" data-a="start">▶ Baribir boshlash</button></div></div></div>';
    var plist = $(".ks-plist", el), count = $(".ks-lcount", el), startB = $('[data-a="start"]', el);
    function draw() {
      var ids = order.filter(function (id) { return players[id]; });
      count.textContent = ids.length;
      plist.innerHTML = ids.length ? ids.map(function (id) { var p = players[id]; return '<button type="button" class="ks-pchip' + (p.off ? " off" : "") + '" data-id="' + id + '">' + esc(p.name) + "</button>"; }).join("") : '<span class="ks-dim">Hali hech kim yo\'q. Kod yoki QR orqali kirishadi… Baribir boshlash mumkin — kech qolganlar o\'yin davomida kiradi.</span>';
      startB.textContent = ids.length ? "▶ O'yinni boshlash" : "▶ Baribir boshlash";
    }
    plist.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-id]"); if (!b || !R) return;
      var id = b.dataset.id, p = players[id]; if (!p) return;
      R.kick(id, "O'qituvchi sizni xonadan chiqardi"); delete players[id]; draw(); if (o.onLeave) o.onLeave(p);
    });
    $('[data-a="close"]', el).onclick = function () { if (R) R.close(); if (o.onClose) o.onClose(); };
    startB.onclick = function () { if (o.onStart) o.onStart(); };
    $(".ks-qrbig", el).onclick = function () { el.classList.toggle("big"); };
    return Promise.all([N.host({
      kind: o.kind,
      onConn: function (id, hello) {
        var name = String(hello.name || "").trim().slice(0, 24);
        if (!name) return "Ismingizni yozing";
        if (!players[id] && order.length >= max) return "Xona to'lgan (" + max + " kishi)";
        if (!players[id] && o.locked && o.locked()) return "O'yin boshlanib bo'ldi — keyingi o'yinni kuting";
        var same = false; for (var k in players) if (k !== id && players[k].name.toLowerCase() === name.toLowerCase()) same = true;
        if (same) return "Bu ism band — boshqa ism (masalan familiya bilan) yozing";
        return true;
      },
      onJoin: function (id, hello) {
        var p = players[id] || (players[id] = { id: id, name: String(hello.name).trim().slice(0, 24) });
        p.off = false; if (order.indexOf(id) < 0) order.push(id);
        draw(); snd("pop"); if (o.onJoin) o.onJoin(p);
      },
      onRejoin: function (id) { var p = players[id]; if (p) { p.off = false; draw(); if (o.onRejoin) o.onRejoin(p); } },
      onLeave: function (id) { var p = players[id]; if (p) { p.off = true; draw(); if (o.onLeave) o.onLeave(p); } },
      onMsg: function (id, msg) { var p = players[id]; if (p && o.onMsg) o.onMsg(p, msg); }
    }), loadQr()]).then(function (r) {
      R = r[0];
      var url = N.joinUrl(o.page, R.code);
      $(".ks-code", el).textContent = R.code;
      $(".ks-qr", el).innerHTML = qrSvg(url);
      return {
        code: R.code, url: url, players: players,
        list: function () { return order.filter(function (id) { return players[id]; }).map(function (id) { return players[id]; }); },
        send: function (id, m, all) { R.send(id, m, all); },
        cast: function (m) { R.cast(m); },
        beat: function (s) { R.beat(s); },
        close: function () { R.close(); },
        redraw: draw
      };
    });
  }

  // O'quvchi tomoni. o: {el, code, title, onMsg(msg, api), onReady(api), onClose(why)}
  function roomJoin(o) {
    var N = window.KANet, el = o.el, idn = N && N.identity ? N.identity() : { name: "" };
    el.innerHTML = '<div class="ks-join"><div class="ks-jcode">Xona: <b>' + esc(o.code) + '</b></div><h2>' + esc(o.title || "O'yinga kirish") + '</h2>' +
      '<form class="ks-jform"><input class="ks-field" name="n" maxlength="24" autocomplete="nickname" placeholder="Ismingiz" value="' + esc(idn.name || "") + '" required>' +
      '<button class="ks-btn primary" type="submit">Kirish ▶</button></form><div class="ks-jerr" role="alert"></div></div>';
    var f = $(".ks-jform", el), err = $(".ks-jerr", el);
    $("input", f).focus();
    return new Promise(function (resolve) {
      f.onsubmit = function (e) {
        e.preventDefault();
        var name = $("input", f).value.trim().replace(/\s+/g, " ");
        if (name.length < 2) { err.textContent = "Ismingizni to'liq yozing"; return; }
        var bn = N.badName && N.badName(name); if (bn) { err.textContent = bn; return; }
        err.textContent = ""; $("button", f).disabled = true; $("button", f).textContent = "⏳ Ulanmoqda…";
        try { N.saveIdentity(name, idn.group || ""); } catch (x) {}
        var api = null;
        N.join(o.code, { name: name }, {
          onMsg: function (m) {
            if (m.type === "reject") { err.textContent = m.why || "Kirib bo'lmadi"; $("button", f).disabled = false; $("button", f).textContent = "Kirish ▶"; return; }
            if (m.type === "kick") { if (o.onClose) o.onClose(m.why || "Xonadan chiqarildingiz"); return; }
            if (o.onMsg) o.onMsg(m, api);
          },
          onClose: function (why) { if (o.onClose) o.onClose(why === "gone" ? "O'qituvchi xonani yopdi" : "Aloqa uzildi"); }
        }).then(function (a) { api = a; api.name = name; resolve(api); if (o.onReady) o.onReady(api); }).catch(function (x) {
          err.textContent = (x && x.message) || "Ulanib bo'lmadi — internetni tekshiring";
          $("button", f).disabled = false; $("button", f).textContent = "Kirish ▶";
        });
      };
    });
  }
  // o'qituvchi ekrani uchun jonli reyting (top N)
  function board(el, list, unit, n) {
    var L = list.slice().sort(function (a, b) { return b.score - a.score; }), top = L.slice(0, n || 12), mx = Math.max(1, top.length ? top[0].score : 1);
    el.innerHTML = top.map(function (p, i) {
      return '<div class="ks-brow' + (p.off ? " off" : "") + '"><span class="ks-brank">' + (i + 1) + '</span><span class="ks-bname">' + esc(p.name) + '</span><span class="ks-bbar"><i style="width:' + Math.max(2, Math.round(Math.max(0, p.score) / mx * 100)) + '%"></i></span><b>' + esc(p.score) + " " + esc(unit || "") + "</b></div>";
    }).join("") + (L.length > top.length ? '<div class="ks-dim" style="text-align:center">… yana ' + (L.length - top.length) + " kishi</div>" : "");
  }
  /* ---------------- telefon musobaqasi (Mol ur, Moslashtir): har kim o'zida o'ynaydi, ball yuboradi ---------------- */
  // O'qituvchi: o = {kind, page, title, unit, min, payload, onExit}
  function liveHost(o) {
    var el = document.createElement("div"); el.className = "ks-game";
    el.innerHTML = '<div class="ks-top"><span class="ks-title">' + esc(o.title) + ' · telefonlar</span><span class="ks-dim lv-code"></span><button type="button" class="ks-btn lv-full" aria-label="To\'liq ekran">⛶</button><button type="button" class="ks-btn lv-end">⏹ Tugatish</button></div>' +
      '<div class="lv-lobby" style="flex:1;min-height:0;overflow:auto"></div>' +
      '<div class="lv-play" hidden style="flex:1;min-height:0;overflow:auto"><div style="display:flex;align-items:baseline;gap:12px;margin-bottom:8px"><span class="lv-clock" style="font:900 clamp(30px,5vw,56px)/1 ui-monospace,monospace;color:var(--gold)">0:00</span><span class="ks-dim lv-stat"></span></div><div class="ks-board lv-board"></div></div>';
    document.body.appendChild(el); full(); wake(true);
    var S = { ph: "wait", end: 0, R: null, timer: 0 };
    function q(s) { return $(s, el); }
    function exit() { clearInterval(S.timer); try { if (S.R) S.R.close(); } catch (e) {} el.remove(); full(false); wake(false); if (o.onExit) o.onExit(); }
    function st(p) {
      if (!S.R) return;
      S.R.send(p.id, { type: "st", ph: S.ph, rem: Math.max(0, Math.round((S.end - Date.now()) / 1000)), cfg: o.payload }, true);
    }
    var rdT = 0;
    function redraw() {
      if (rdT) return;
      rdT = setTimeout(function () {
        rdT = 0; if (!S.R) return;
        var list = S.R.list(), ok = 0, no = 0; list.forEach(function (p) { if (p.score == null) { p.score = 0; p.ok = 0; p.no = 0; } ok += p.ok; no += p.no; });
        board(q(".lv-board"), list, o.unit || "ball", 15);
        q(".lv-stat").textContent = list.length + " o'quvchi · " + ok + " to'g'ri · " + no + " xato";
      }, 250);
    }
    function start() {
      if (!S.R || S.ph === "play") return;
      S.ph = "play"; S.end = Date.now() + o.min * 60000;
      q(".lv-lobby").hidden = true; q(".lv-play").hidden = false;
      q(".lv-code").textContent = "Kod: " + S.R.code + " · kech qolganlar ham kira oladi";
      S.R.list().forEach(st); redraw();
      S.timer = setInterval(function () { var s = (S.end - Date.now()) / 1000; q(".lv-clock").textContent = mmss(s); if (s <= 0) finish(); }, 500);
    }
    function finish() {
      if (S.ph === "end" || !S.R) return;
      clearInterval(S.timer); S.ph = "end";
      var list = S.R.list().slice().sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
      list.forEach(function (p, i) { S.R.send(p.id, { type: "fin", rank: i + 1, n: list.length, score: p.score || 0 }, true); });
      podium(list.map(function (p) { return { emoji: "", name: p.name, score: p.score || 0, color: COLORS[0] }; }), o.unit || "ball", o.title + " — natijalar", [
        { t: "📥 CSV (Excel)", keep: true, fn: function () { csv(o.kind + "-" + new Date().toISOString().slice(0, 10) + ".csv", [["O'rin", "Ism", "Ball", "To'g'ri", "Xato"]].concat(list.map(function (p, i) { return [i + 1, p.name, p.score || 0, p.ok || 0, p.no || 0]; }))); } },
        { t: "✖ Xonani yopish", cls: "primary", fn: exit }
      ]);
    }
    q(".lv-full").onclick = function () { if (document.fullscreenElement) full(false); else full(); };
    q(".lv-end").onclick = function () { if (S.ph === "play") finish(); else exit(); };
    roomHost({
      kind: o.kind, page: o.page, el: q(".lv-lobby"), max: 80,
      onJoin: function (p) { if (p.score == null) { p.score = 0; p.ok = 0; p.no = 0; } st(p); redraw(); },
      onRejoin: st,
      onMsg: function (p, m) { if (m.type === "sc" && S.ph === "play") { p.score = Math.max(0, Math.min(1e6, +m.s || 0)); p.ok = +m.ok || 0; p.no = +m.no || 0; redraw(); } },
      onStart: start, onClose: function () { S.R = null; exit(); }
    }).then(function (R) { S.R = R; q(".lv-code").textContent = "Kod: " + R.code; }).catch(function (e) { toast((e && e.message) || "Xona ochilmadi — internetni tekshiring", 5000); exit(); });
  }
  // O'quvchi: o = {code, title, onPlay(cfg, api) — o'yinni boshlaydi; api.report(score, ok, no), api.left() — qolgan soniya}
  function livePhone(o) {
    var box = document.createElement("div"); box.className = "ks-phone"; document.body.appendChild(box);
    var P = { ph: "wait", end: 0, api: null, started: false, last: 0, pend: null, t: 0 };
    var api = {
      left: function () { return Math.max(0, (P.end - Date.now()) / 1000); },
      report: function (s, ok, no) {
        P.pend = { type: "sc", s: s, ok: ok, no: no };
        var wait = 700 - (Date.now() - P.last);
        clearTimeout(P.t);
        P.t = setTimeout(function () { if (P.api && P.pend) { P.api.send(P.pend); P.pend = null; P.last = Date.now(); } }, Math.max(0, wait));
      },
      box: box, playing: function () { return P.ph === "play" && api.left() > 0; }, done: function () { return P.ph === "end"; }
    };
    function msg(h) { box.innerHTML = '<div class="ks-join" style="font-size:20px;font-weight:800"><div style="font-size:64px">' + h[0] + "</div>" + h[1] + "</div>"; }
    roomJoin({
      el: box, code: o.code, title: o.title,
      onMsg: function (m) {
        if (m.type === "st") {
          P.ph = m.ph; P.end = Date.now() + (m.rem || 0) * 1000;
          if (m.ph === "play" && !P.started) { P.started = true; box.innerHTML = ""; box.classList.add("playing"); wake(true); o.onPlay(m.cfg || {}, api); }
          else if (m.ph === "wait") msg(["⏳", "Salom, " + esc(P.api ? P.api.name : "") + "!<br>O'qituvchi o'yinni boshlashini kuting…"]);
        }
        if (m.type === "fin") {
          P.ph = "end"; P.end = Date.now(); box.classList.remove("playing"); wake(false); if (P.pend && P.api) P.api.send(P.pend); P.pend = null; clearTimeout(P.t);
          closeModal();
          msg([m.rank <= 3 ? ["🥇", "🥈", "🥉"][m.rank - 1] : "🏁", "O'yin tugadi!<br><b style=\"font-size:34px;color:var(--gold)\">" + m.rank + "-o'rin</b> / " + m.n + "<br>" + m.score + " ball"]);
          if (m.rank <= 3) confetti();
        }
      },
      onClose: function (why) { box.innerHTML = '<div class="ks-join"><div style="font-size:60px">👋</div>' + esc(why) + '<p><a class="ks-btn primary" href="live/">Boshqa xonaga kirish</a></p></div>'; }
    }).then(function (a) { P.api = a; if (P.ph === "wait") msg(["⏳", "Salom, " + esc(a.name) + "!<br>O'qituvchi o'yinni boshlashini kuting…"]); });
    return api;
  }

  function csv(name, rows) {
    var s = "﻿" + rows.map(function (r) { return r.map(function (c) { c = String(c == null ? "" : c); return /[",;\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(";"); }).join("\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([s], { type: "text/csv;charset=utf-8" })); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  window.KSO = {
    TOPICS: TOPICS, GROUPS: GROUPS, FANS: FANS, TITLE: TITLE, TEAMS: TEAMS, COLORS: COLORS,
    $: $, $$: $$, esc: esc, safe: safe, plain: plain, rnd: rnd, pick: pick, shuffle: shuffle, mmss: mmss, vib: vib, load: load, save: save,
    toast: toast, fit: fit, full: full, wake: wake, snd: snd, setSound: setSound, sound: function () { return soundOn; },
    prep: prep, ask: ask, qHtml: qHtml, picker: picker, urlTopics: urlTopics, teamsUI: teamsUI, makeTeams: makeTeams, opts: opts,
    askModal: askModal, closeModal: closeModal, cardsUI: cardsUI, cardClass: cardClass, cardTeams: cardTeams, cardsOpen: cardsOpen, cardsClose: cardsClose, podium: podium, confetti: confetti, choose: choose, notice: notice,
    room: { host: roomHost, join: roomJoin, code: codeParam, board: board, qrSvg: qrSvg, loadQr: loadQr, liveHost: liveHost, livePhone: livePhone }, csv: csv
  };
})();
