/*!
 * Kuvonch Academy — savollar bazasi (Google Sheets) va takrorlanmaydigan testlar
 * - Savollar Google Sheets jadvalidan olinadi (o'qituvchi jadvalga qator qo'shsa, saytda darhol chiqadi)
 * - Jadval ochilmasa: mavzu generatori yangi savollar yaratadi (internet shart emas)
 * - Har bir o'quvchi (akkount) uchun ko'rilgan savollar eslab qolinadi — takror chiqmaydi
 * - Test ochilganda o'quvchi savollar sonini tanlaydi (20 / 30 / 50); Arqon tortish ham shu bazadan foydalanadi
 * Ulash: mashq-generator.js dan keyin <script src="savol-bazasi.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaBank) return;
  window.__kaBank = true;

  // Google Sheets jadvali (ustunlar: id | mavzu_id | mavzu | savol | A | B | C | D | togri)
  var SHEET_ID = "1xleCHy1Wo0mZnnmftHwMJI2BLvC3UiHLpdQUKKEdTL0";
  var SHEET_NAME = ""; // bo'sh = birinchi varaq
  var SHEET_GID = ""; // bo'sh = birinchi varaq
  var PER_TEST = 20;
  var COUNTS = [20, 30, 50]; // test boshlashdan oldin tanlanadigan savollar soni
  var LS_COUNT = "ka.test.count.v1";
  var LS_BANK = "ka.bank.cache.v1", LS_SEEN = "ka.bank.seen.v1";

  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = R(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function norm(s) { return String(s || "").replace(/<[^>]+>/g, "").replace(/[ʻʼ‘’`]/g, "'").replace(/\s+/g, " ").trim().toLowerCase(); }
  function stripHtml(s) {
    return String(s || "").replace(/<sup>(.*?)<\/sup>/g, "^$1").replace(/<sub>(.*?)<\/sub>/g, "_$1").replace(/<[^>]+>/g, "");
  }

  // ---------- Son → chiroyli yozuv (kasr bo'lsa 3/5) ----------
  function fmt(v) {
    if (Number.isInteger(v)) return String(v);
    for (var d = 2; d <= 60; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return n + "/" + d; }
    return String(+v.toFixed(3));
  }
  function fmtAns(a, ordered) {
    if (!Array.isArray(a)) return fmt(a);
    var arr = ordered ? a : a.slice().sort(function (x, y) { return x - y; });
    return (ordered ? "(" : "") + arr.map(fmt).join("; ") + (ordered ? ")" : "");
  }
  // Noto'g'ri variantlar
  function distractors(a, ordered, n) {
    var out = [], key = {}, right = fmtAns(a, ordered);
    key[right] = 1;
    function add(v) { var s = fmtAns(v, ordered); if (!key[s]) { key[s] = 1; out.push(s); } }
    var tries = 0;
    while (out.length < n && tries++ < 60) {
      if (Array.isArray(a)) {
        var b = a.slice(), k = R(0, 4);
        if (k === 0) b = b.map(function (x) { return -x; });
        else if (k === 1) { var i = R(0, b.length - 1); b[i] += R(1, 3) * (Math.random() < .5 ? -1 : 1); }
        else if (k === 2 && b.length === 2) b = [b[1], b[0]];
        else if (k === 3) b = b.map(function (x) { return x + 1; });
        else { var j = R(0, b.length - 1); b[j] = -b[j]; }
        add(b);
      } else {
        var t = R(0, 6), v;
        if (Number.isInteger(a)) v = [a + 1, a - 1, a + 2, a - 2, -a, a + 10, a * 2][t];
        else v = [a + 1, a - 1, a * 3, -a, a * 2, a / 2, a + .5][t];
        if (isFinite(v) && !(a > 0 && v < 0)) add(v);
      }
    }
    while (out.length < n) add(Array.isArray(a) ? a.map(function (x) { return x + out.length + 5; }) : a + out.length * 7 + 3);
    return out;
  }
  // Generatordan test savoli (4 variantli)
  function mcqFromGen(p) {
    var right = fmtAns(p.a, p.ordered);
    var opts = shuffle([right].concat(distractors(p.a, p.ordered, 3)));
    return { q: stripHtml(p.q), options: opts, correct: opts.indexOf(right), steps: p.steps, src: "gen" };
  }
  function genMCQ(topicTitle) {
    var K = window.kaGen; if (!K) return null;
    var gens = K.gensFor(topicTitle); if (!gens) return null;
    return mcqFromGen(K.generators[gens[R(0, gens.length - 1)]]());
  }

  // ---------- Google Sheets'dan yuklash ----------
  var BANK = null; // { topicId: [ {id,q,options,correct} ] }
  function parseCSV(text) {
    var rows = [], row = [], cell = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else if (c !== "\r") cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }
  function buildBank(rows) {
    var head = rows.shift() || [], idx = {};
    head.forEach(function (h, i) { idx[norm(h)] = i; });
    var col = function (r, name) { var i = idx[name]; return i == null ? "" : (r[i] || "").trim().replace(/^'/, "").replace(/\u2044/g, "/"); };
    var bank = {};
    rows.forEach(function (r, n) {
      var tid = col(r, "mavzu_id"), q = col(r, "savol"), opts = ["a", "b", "c", "d"].map(function (k) { return col(r, k); }).filter(Boolean);
      var t = col(r, "togri").toUpperCase().replace(/[^A-D]/g, ""), ci = "ABCD".indexOf(t);
      if (!tid || !q || opts.length < 2 || ci < 0 || ci >= opts.length) return;
      (bank[tid] = bank[tid] || []).push({ id: col(r, "id") || (tid + "-" + n), q: q, options: opts, correct: ci, src: "sheet" });
    });
    return bank;
  }
  function loadCached() { try { var c = JSON.parse(localStorage.getItem(LS_BANK) || "null"); if (c && c.bank) BANK = c.bank; } catch (e) {} }
  function loadSheet() {
    if (!SHEET_ID || SHEET_ID.indexOf("__") === 0) return Promise.resolve(null);
    var base = "https://docs.google.com/spreadsheets/d/" + SHEET_ID;
    var urls = [base + "/export?format=csv" + (SHEET_GID ? "&gid=" + SHEET_GID : ""),
                base + "/gviz/tq?tqx=out:csv" + (SHEET_NAME ? "&sheet=" + encodeURIComponent(SHEET_NAME) : "") + "&_=" + Date.now()];
    function tryUrl(i) {
      if (i >= urls.length) return Promise.reject(new Error("no source"));
      return fetch(urls[i]).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (t) { if (/^\s*</.test(t)) throw new Error("not csv"); return t; })
        .catch(function () { return tryUrl(i + 1); });
    }
    return tryUrl(0).then(function (t) {
      var b = buildBank(parseCSV(t));
      if (Object.keys(b).length) { BANK = b; try { localStorage.setItem(LS_BANK, JSON.stringify({ at: Date.now(), bank: b })); } catch (e) {} }
      return b;
    }).catch(function () { return null; });
  }
  loadCached();
  var ready = loadSheet();

  // ---------- Ko'rilgan savollar (akkount bo'yicha) ----------
  function who() { try { var u = window.kaAccount && window.kaAccount.me(); return u ? "u:" + u.name + "|" + (u.group || "") : "device"; } catch (e) { return "device"; } }
  function seenAll() { try { return JSON.parse(localStorage.getItem(LS_SEEN) || "{}"); } catch (e) { return {}; } }
  function seenSet(topicId) { var a = seenAll(), k = who() + "|" + topicId; return { all: a, key: k, set: a[k] || {} }; }
  function markSeen(topicId, qs) {
    var s = seenSet(topicId);
    qs.forEach(function (q) { s.set[norm(q.q)] = 1; });
    var keys = Object.keys(s.set); if (keys.length > 3000) keys.slice(0, keys.length - 3000).forEach(function (k) { delete s.set[k]; });
    s.all[s.key] = s.set;
    try { localStorage.setItem(LS_SEEN, JSON.stringify(s.all)); } catch (e) {}
  }

  function titleOf(topicId) {
    var sec = document.getElementById(topicId), h = sec && sec.querySelector("h2");
    return h ? h.textContent.replace(/\s+/g, " ").trim() : "";
  }
  // n ta yangi (ko'rilmagan) savol: avval Google jadvalidan, keyin saytning asl testlaridan, oxirida generatordan
  function getQuestions(topicId, n, opts) {
    opts = opts || {};
    n = n || PER_TEST;
    var seen = seenSet(topicId).set, out = [], used = {};
    function take(q) { var k = norm(q.q); if (!k || used[k] || (!opts.allowSeen && seen[k])) return false; used[k] = 1; out.push({ q: q.q, options: q.options.slice(), correct: q.correct, steps: q.steps, html: !!q.html, src: q.src || "site" }); return true; }
    var pools = [];
    if (BANK && BANK[topicId]) pools.push(shuffle(BANK[topicId].slice()));
    var orig = (window.__kaOrigTests || {})[topicId];
    if (orig) pools.push(shuffle(orig.slice()));
    pools.forEach(function (p) { for (var i = 0; i < p.length && out.length < n; i++) take(p[i]); });
    var title = titleOf(topicId), guard = 0;
    while (out.length < n && guard++ < 200) { var g = topicId === "geo" ? (window.kaGeo ? window.kaGeo.mcq() : null) : genMCQ(title); if (!g) break; take(g); }
    if (out.length < n && !opts.allowSeen) {
      // Barcha savollar ko'rilgan va generator yo'q — yangi aylana boshlanadi
      var s = seenSet(topicId); s.all[s.key] = {}; try { localStorage.setItem(LS_SEEN, JSON.stringify(s.all)); } catch (e) {}
      var rest = getQuestions(topicId, n - out.length, { allowSeen: true });
      rest.forEach(function (q) { if (!used[norm(q.q)]) out.push(q); });
    }
    // variantlarni aralashtirish (to'g'ri javob saqlanadi)
    out.forEach(function (q) {
      var right = q.options[q.correct]; q.options = shuffle(q.options); q.correct = q.options.indexOf(right);
    });
    return out.slice(0, n);
  }
  // Arqon tortish kabi o'yinlar uchun: mavzu nomi bo'yicha
  function topicList() {
    return Array.prototype.slice.call(document.querySelectorAll("main > section.topic")).map(function (s) {
      var h = s.querySelector("h2"); return { id: s.id, title: h ? h.textContent.replace(/\s+/g, " ").trim() : s.id };
    });
  }

  // ---------- Saytdagi testni ulash ----------
  function snapshotOrig() {
    if (window.__kaOrigTests) return;
    try {
      if (typeof TESTS === "undefined") return;
      var o = {}; Object.keys(TESTS).forEach(function (k) { o[k] = JSON.parse(JSON.stringify(TESTS[k])); });
      window.__kaOrigTests = o;
    } catch (e) {}
  }
  snapshotOrig();
  // ---------- Savollar sonini tanlash oynasi (20 / 30 / 50) ----------
  function lastCount() { try { var v = +localStorage.getItem(LS_COUNT); return COUNTS.indexOf(v) >= 0 ? v : PER_TEST; } catch (e) { return PER_TEST; } }
  function injectCss() {
    if (document.getElementById("ka-count-css")) return;
    var st = document.createElement("style"); st.id = "ka-count-css";
    st.textContent = ".ka-count{position:fixed;inset:0;z-index:200;background:rgba(5,8,14,.72);display:flex;align-items:center;justify-content:center;padding:16px}" +
      ".ka-count-card{background:#151a24;color:#e8eefc;border:1px solid #2f4a7a;border-radius:18px;padding:24px 20px;max-width:420px;width:100%;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.45)}" +
      ".ka-count-card h3{margin:0 0 6px;font-size:20px}.ka-count-card p{margin:0 0 18px;color:#9fb0cf;font-size:14px}" +
      ".ka-count-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}" +
      ".ka-count-row button{flex:1 1 90px;min-height:64px;border:none;border-radius:14px;cursor:pointer;font-weight:800;font-size:22px;color:#08131f;background:linear-gradient(135deg,#5ee6c7,#7c9bff)}" +
      ".ka-count-row button small{display:block;font-size:12px;font-weight:700;opacity:.8}" +
      ".ka-count-row button.last{outline:3px solid #ffd166;outline-offset:2px}" +
      ".ka-count-x{margin-top:16px;background:none;border:none;color:#9fb0cf;cursor:pointer;font-size:14px;text-decoration:underline}";
    document.head.appendChild(st);
  }
  function askCount(title, cb) {
    injectCss();
    var old = document.getElementById("ka-count"); if (old) old.remove();
    var last = lastCount(), box = document.createElement("div");
    box.className = "ka-count"; box.id = "ka-count";
    box.innerHTML = '<div class="ka-count-card" role="dialog" aria-modal="true"><h3>📝 Nechta savol?</h3><p></p><div class="ka-count-row">' +
      COUNTS.map(function (c) { return '<button type="button" data-n="' + c + '"' + (c === last ? ' class="last"' : "") + ">" + c + "<small>ta savol</small></button>"; }).join("") +
      '</div><button type="button" class="ka-count-x">Bekor qilish</button></div>';
    box.querySelector("p").textContent = title || "";
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-n]");
      if (b) { var n = +b.getAttribute("data-n"); try { localStorage.setItem(LS_COUNT, String(n)); } catch (er) {} box.remove(); cb(n); return; }
      if (e.target === box || e.target.classList.contains("ka-count-x")) box.remove();
    });
    document.body.appendChild(box);
  }
  function fill(topicId, n) {
    try {
      if (typeof TESTS !== "undefined" && (TESTS[topicId] || titleOf(topicId))) {
        var qs = getQuestions(topicId, n);
        if (qs.length) { TESTS[topicId] = qs; markSeen(topicId, qs); pushToBank(topicId, qs); }
      }
    } catch (e) {}
  }
  // Generator yaratgan yangi savollarni Google jadvaliga (savollar bazasiga) yuborish — baza o'sib boradi
  function pushToBank(topicId, qs) {
    try {
      var url = typeof RESULTS_ENDPOINT !== "undefined" ? RESULTS_ENDPOINT : "";
      if (!url || !/^[a-z0-9]{1,8}$/i.test(topicId)) return;
      var inBank = {};
      ((BANK && BANK[topicId]) || []).forEach(function (q) { inBank[norm(q.q)] = 1; });
      var fresh = qs.filter(function (q) { return q.src === "gen" && q.options.length === 4 && !inBank[norm(q.q)]; })
        .map(function (q) { return { topicId: topicId, topic: titleOf(topicId), q: q.q, options: q.options, correct: q.correct }; });
      if (!fresh.length) return;
      fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "addQuestions", questions: fresh }) }).catch(function () {});
    } catch (e) {}
  }
  var chosen = PER_TEST;
  if (typeof window.openTest === "function") {
    var origOpen = window.openTest;
    window.openTest = function (topicId, topicTitle) {
      var self = this, args = arguments;
      askCount(topicTitle || titleOf(topicId), function (n) { chosen = n; fill(topicId, n); origOpen.apply(self, args); });
    };
    if (typeof window.retakeTest === "function") {
      var origRetake = window.retakeTest;
      window.retakeTest = function () {
        try { var ct = typeof currentTest !== "undefined" ? currentTest : null; if (ct && ct.topicId) fill(ct.topicId, chosen); } catch (e) {}
        return origRetake.apply(this, arguments);
      };
    }
  }

  window.kaBank = {
    get: getQuestions, markSeen: markSeen, topics: topicList, ready: ready,
    reload: loadSheet, sheetId: SHEET_ID, mcqFromGen: mcqFromGen, genMCQ: genMCQ,
    size: function () { var n = 0; if (BANK) Object.keys(BANK).forEach(function (k) { n += BANK[k].length; }); return n; }
  };
})();
