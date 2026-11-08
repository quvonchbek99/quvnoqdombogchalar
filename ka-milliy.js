/* Kuvonch Academy — «Bolalikdagi o'yinlar» va «Hayotiy hisob-kitoblar» uchun umumiy o'yin dvigateli.
   Har bir sahifa o'z sahnasini (tuval, animatsiya) chizadi, savollarni o'zi tuzadi (gen),
   dvigatel esa: savol paneli, javob variantlari/kiritish, 5 daraja (3 ta to'g'ri javob ketma-ket — daraja oshadi),
   kombo ×2/×3, sirli quti (90% yordam, 10% ochko yo'qotish), qadam-baqadam yechim, natija oynasi,
   Bilimcoin va o'qituvchi jadvaliga natija yuborishni bajaradi.
   Faqat ES2019 (eski Android/iOS ham ochsin). */
(function () {
  "use strict";
  var W = window, D = document;

  /* ---------- yordamchilar ---------- */
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function round(x, d) { var m = Math.pow(10, d || 0); return Math.round(x * m) / m; }
  // O'zbekcha son yozuvi: 12 500,5 (minglik — bo'sh joy, kasr — vergul)
  function nf(x, d) {
    if (typeof x !== "number" || !isFinite(x)) return String(x);
    var s = (d == null ? String(round(x, 6)) : x.toFixed(d)).split(".");
    var neg = s[0].charAt(0) === "-"; if (neg) s[0] = s[0].slice(1);
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + s[0] + (s[1] ? "," + s[1] : "");
  }
  function parseNum(v) {
    if (typeof v === "number") return v;
    var s = String(v == null ? "" : v).trim().replace(/[\s ]/g, "").replace(/−/g, "-").replace(",", ".");
    if (/^-?\d+\/\d+$/.test(s)) { var p = s.split("/"); return +p[1] ? +p[0] / +p[1] : NaN; }
    return s === "" ? NaN : Number(s);
  }
  function same(a, b, tol) {
    if (typeof a === "number") { var n = parseNum(b); return isFinite(n) && Math.abs(n - a) <= (tol == null ? 1e-9 : tol); }
    var f = function (s) { return String(s).toLowerCase().replace(/[\s'’ʻʼ`‘]/g, ""); };
    return f(a) === f(b);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem("ka.milliy." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem("ka.milliy." + k, JSON.stringify(v)); } catch (e) {} }

  // Javob variantlari: to'g'ri javob + odatiy xatolar (mistakes) + kerak bo'lsa yaqin sonlar
  function makeOpts(ans, mistakes, n) {
    n = n || 4; var out = [ans], seen = {}; seen[String(ans)] = 1;
    (mistakes || []).forEach(function (m) { if (out.length < n && m != null && !seen[String(m)] && !(typeof m === "number" && !isFinite(m))) { seen[String(m)] = 1; out.push(m); } });
    if (typeof ans === "number") {
      var step = Math.abs(ans) >= 100 ? (Math.abs(ans) >= 1000 ? 100 : 10) : 1, isInt = Math.round(ans) === ans, tries = 0;
      while (out.length < n && tries++ < 60) {
        var c = isInt ? ans + pick([-1, 1, -2, 2, 10, -10, 3, -3]) * step : round(ans + pick([-1, 1, -2, 2, 0.5, -0.5]) * (Math.abs(ans) > 10 ? 1 : 0.1), 2);
        if (ans >= 0 && c < 0) continue;
        if (!seen[String(c)]) { seen[String(c)] = 1; out.push(c); }
      }
    }
    return shuffle(out);
  }

  /* ---------- ovozlar (WebAudio, fayl kerak emas) ---------- */
  var AC = null, muted = lsGet("mute", false);
  function ac() { if (!AC) { try { var C = W.AudioContext || W.webkitAudioContext; if (C) AC = new C(); } catch (e) {} } if (AC && AC.state === "suspended") { try { AC.resume(); } catch (e) {} } return AC; }
  function tone(f, t, type, vol, when) {
    if (muted) return; var a = ac(); if (!a) return;
    try {
      var o = a.createOscillator(), g = a.createGain(), s = a.currentTime + (when || 0);
      o.type = type || "sine"; o.frequency.setValueAtTime(f, s);
      g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(vol || 0.12, s + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, s + t);
      o.connect(g); g.connect(a.destination); o.start(s); o.stop(s + t + 0.02);
    } catch (e) {}
  }
  var sfx = {
    ok: function () { tone(660, 0.12, "triangle"); tone(990, 0.16, "triangle", 0.1, 0.09); },
    no: function () { tone(220, 0.22, "sawtooth", 0.07); tone(160, 0.25, "sawtooth", 0.06, 0.1); },
    up: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.14, "triangle", 0.1, i * 0.08); }); },
    tap: function () { tone(440, 0.05, "square", 0.04); },
    box: function () { [880, 1175, 1568].forEach(function (f, i) { tone(f, 0.1, "sine", 0.1, i * 0.06); }); },
    end: function () { [392, 523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.18, "triangle", 0.1, i * 0.1); }); },
    hop: function () { tone(520, 0.07, "sine", 0.08); tone(780, 0.06, "sine", 0.06, 0.05); }
  };

  var toastT = 0;
  function toast(msg, ms) {
    var t = D.getElementById("km-toast");
    if (!t) { t = D.createElement("div"); t.id = "km-toast"; t.className = "km-toast"; t.setAttribute("role", "status"); D.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, ms || 2200);
  }

  /* ---------- o'yin ---------- */
  var LV_NAMES = ["", "Oson", "O'rta", "Qiyin", "Murakkab", "Usta"];
  function Game(cfg) {
    this.cfg = cfg; this.id = cfg.id;
    this.N = cfg.rounds || 10;
    this.level = Math.max(1, Math.min(5, lsGet(cfg.id + ".lvl", 1)));
    this.mode = lsGet(cfg.id + ".mode", "mashq");
    this.best = lsGet(cfg.id + ".best", 0);
    this.state = "idle";
    this.build();
  }
  var P = Game.prototype;

  P.build = function () {
    var c = this.cfg, self = this, root = typeof c.mount === "string" ? D.getElementById(c.mount) : c.mount;
    this.root = root;
    root.classList.add("km-game");
    root.innerHTML =
      '<div class="km-bar"><span class="ttl">' + esc(c.barTitle || c.title) + '</span><div class="km-hud">' +
      '<span class="km-pill" title="Daraja">📶 <span class="km-dots" data-k="dots"></span> <span data-k="lvn"></span></span>' +
      '<span class="km-pill" title="Ochko">⭐ <span data-k="score">0</span></span>' +
      '<span class="km-pill combo" data-k="combo" hidden>🔥 ×2</span>' +
      '<span class="km-pill" title="Savol">❓ <span data-k="qn">0</span>/' + this.N + '</span>' +
      '<span class="km-pill" data-k="timeP" hidden>⏱ <span data-k="time">0</span></span>' +
      '<button class="km-icon" type="button" data-k="mute" aria-label="Ovoz">' + (muted ? "🔇" : "🔊") + '</button>' +
      '</div></div>' +
      '<div class="km-stage" data-k="stage"></div>' +
      '<div class="km-panel"><div class="km-q" data-k="q" aria-live="polite"></div><div data-k="ans"></div>' +
      '<div class="km-help" data-k="help"></div>' +
      '<div class="km-fb" data-k="fb" aria-live="polite"></div></div>';
    this.el = {};
    Array.prototype.forEach.call(root.querySelectorAll("[data-k]"), function (e) { self.el[e.getAttribute("data-k")] = e; });
    if (c.scene) this.el.stage.appendChild(c.scene); else this.el.stage.style.display = "none";
    this.el.mute.onclick = function () { muted = !muted; lsSet("mute", muted); this.textContent = muted ? "🔇" : "🔊"; if (!muted) sfx.tap(); };
    // Boshlash oynasi
    var ov = D.createElement("div"); ov.className = "km-ov"; this.el.ov = ov;
    (c.scene ? this.el.stage : root).appendChild(ov);
    if (!c.scene) { root.style.position = "relative"; }
    this.renderHud();
    this.showStart();
  };

  P.renderHud = function () {
    var d = ""; for (var i = 1; i <= 5; i++) d += '<i class="' + (i <= this.level ? "on" : "") + '"></i>';
    this.el.dots.innerHTML = d; this.el.lvn.textContent = LV_NAMES[this.level];
    this.el.score.textContent = this.score || 0;
    this.el.qn.textContent = Math.min(this.N, this.qi || 0);
    var m = this.mult(); this.el.combo.hidden = m < 2; this.el.combo.textContent = "🔥 ×" + m;
  };
  P.mult = function () { var s = this.streak || 0; return s >= 6 ? 3 : s >= 3 ? 2 : 1; };

  P.showStart = function () {
    var self = this, c = this.cfg;
    var lv = ""; for (var i = 1; i <= 5; i++) lv += '<button type="button" data-lv="' + i + '" aria-pressed="' + (i === this.level) + '">' + i + "</button>";
    this.el.ov.innerHTML = '<div class="km-card"><h3>' + esc(c.title) + '</h3><p>' + (c.intro || "") + '</p>' +
      '<div class="km-lbl">Boshlang\'ich daraja</div><div class="km-seg" data-g="lv">' + lv + '</div>' +
      '<div class="km-lbl">Rejim</div><div class="km-seg" data-g="md"><button type="button" data-md="mashq" aria-pressed="' + (this.mode === "mashq") + '">🌿 Mashq</button><button type="button" data-md="vaqt" aria-pressed="' + (this.mode === "vaqt") + '">⏱ ' + (c.timeLimit || 90) + ' soniya</button></div>' +
      (this.best ? '<p>Eng yaxshi natija: <b style="color:var(--amber)">' + this.best + '</b> ochko</p>' : "") +
      '<button class="km-btn pri" type="button" data-go style="min-width:200px;margin-top:6px">▶ Boshlash</button></div>';
    this.el.ov.hidden = false;
    Array.prototype.forEach.call(this.el.ov.querySelectorAll("[data-lv]"), function (b) {
      b.onclick = function () { self.level = +b.getAttribute("data-lv"); lsSet(c.id + ".lvl", self.level); Array.prototype.forEach.call(self.el.ov.querySelectorAll("[data-lv]"), function (x) { x.setAttribute("aria-pressed", x === b); }); self.renderHud(); sfx.tap(); };
    });
    Array.prototype.forEach.call(this.el.ov.querySelectorAll("[data-md]"), function (b) {
      b.onclick = function () { self.mode = b.getAttribute("data-md"); lsSet(c.id + ".mode", self.mode); Array.prototype.forEach.call(self.el.ov.querySelectorAll("[data-md]"), function (x) { x.setAttribute("aria-pressed", x === b); }); sfx.tap(); };
    });
    this.el.ov.querySelector("[data-go]").onclick = function () { ac(); self.start(); };
    this.el.q.innerHTML = '<small>«Boshlash» tugmasini bosing.</small>'; this.el.ans.innerHTML = ""; this.el.help.innerHTML = ""; this.hideFb();
  };

  P.start = function () {
    var c = this.cfg;
    this.el.ov.hidden = true; this.state = "play";
    this.qi = 0; this.score = 0; this.streak = 0; this.wrongRun = 0; this.correct = 0; this.ffLeft = 1; this.skipLeft = 1;
    this.startLevel = this.level; this.maxLevel = this.level; this.log = [];
    clearInterval(this.timer);
    if (this.mode === "vaqt") {
      var self = this; this.tLeft = c.timeLimit || 90; this.el.timeP.hidden = false; this.el.time.textContent = this.tLeft;
      this.timer = setInterval(function () { if (self.state !== "play" && self.state !== "wait") return; self.tLeft--; self.el.time.textContent = Math.max(0, self.tLeft); if (self.tLeft <= 0) self.end(); }, 1000);
    } else this.el.timeP.hidden = true;
    if (c.onStart) c.onStart(this);
    this.next();
  };

  P.next = function () {
    var c = this.cfg, self = this;
    if (this.qi >= this.N) return this.end();
    this.qi++; this.state = "play"; this.hideFb(); this.renderHud();
    var q = c.gen(this.level, this); q.input = q.input || c.answerMode || (q.opts || typeof q.a === "number" ? "opts" : "text");
    this.q = q; this.tries = 0;
    this.el.q.innerHTML = q.q;
    this.renderAnswer(q);
    this.el.help.innerHTML =
      (q.input === "opts" ? '<button class="km-btn" type="button" data-h="ff"' + (this.ffLeft ? "" : " disabled") + '>✂️ 50/50 (' + this.ffLeft + ')</button>' : "") +
      '<button class="km-btn" type="button" data-h="skip"' + (this.skipLeft ? "" : " disabled") + '>⏭ O\'tkazish (' + this.skipLeft + ')</button>';
    var ff = this.el.help.querySelector('[data-h="ff"]'); if (ff) ff.onclick = function () { self.fiftyFifty(); };
    this.el.help.querySelector('[data-h="skip"]').onclick = function () { if (!self.skipLeft || self.state !== "play") return; self.skipLeft--; self.log.push({ q: q, ok: false, skip: true }); self.next(); };
    if (c.onQuestion) c.onQuestion(q, this);
  };

  P.renderAnswer = function (q) {
    var self = this, box = this.el.ans;
    if (q.input === "opts") {
      var opts = q.opts ? shuffle(q.opts.slice()) : makeOpts(q.a, q.mistakes, q.n || 4);
      q.shown = opts;
      box.innerHTML = '<div class="km-opts' + (opts.length === 4 ? " four" : "") + '">' + opts.map(function (o, i) {
        return '<button class="km-opt" type="button" data-i="' + i + '">' + (typeof o === "number" ? nf(o) + (q.unit ? " " + q.unit : "") : o) + "</button>";
      }).join("") + "</div>";
      Array.prototype.forEach.call(box.querySelectorAll(".km-opt"), function (b) {
        b.onclick = function () { self.answer(opts[+b.getAttribute("data-i")], b); };
      });
    } else if (q.input === "num" || q.input === "text") {
      box.innerHTML = '<form class="km-inp" novalidate><input type="text" ' + (q.input === "num" ? 'inputmode="decimal"' : 'autocapitalize="off"') + ' autocomplete="off" aria-label="Javob" placeholder="' + (q.ph || "Javob") + '">' +
        (q.unit ? '<span class="unit">' + q.unit + "</span>" : "") + '<button class="km-btn pri" type="submit">Tekshirish</button></form>';
      var f = box.querySelector("form"), inp = f.querySelector("input");
      f.onsubmit = function (e) { e.preventDefault(); if (inp.value.trim() === "") { inp.focus(); return; } self.answer(inp.value, null); };
      if (!("ontouchstart" in W)) setTimeout(function () { try { inp.focus(); } catch (e) {} }, 50);
    } else box.innerHTML = q.hint ? '<p class="km-q" style="font-size:15px;font-weight:500;color:var(--dim)">' + q.hint + "</p>" : "";
  };

  P.fiftyFifty = function () {
    var q = this.q; if (!this.ffLeft || q.input !== "opts" || this.state !== "play") return;
    this.ffLeft--; var wrong = []; var self = this;
    Array.prototype.forEach.call(this.el.ans.querySelectorAll(".km-opt"), function (b) { var v = q.shown[+b.getAttribute("data-i")]; if (!same(q.a, v, q.tol) && !b.classList.contains("off")) wrong.push(b); });
    shuffle(wrong).slice(0, Math.max(0, wrong.length - 1)).forEach(function (b) { b.classList.add("off"); });
    var ff = this.el.help.querySelector('[data-h="ff"]'); if (ff) { ff.disabled = true; ff.textContent = "✂️ 50/50 (0)"; }
    sfx.tap();
  };

  // Javobni tekshirish: sahna o'zi ham chaqirishi mumkin (G.answer(qiymat))
  P.answer = function (v, btn) {
    if (this.state !== "play") return false;
    var q = this.q, c = this.cfg, ok = q.check ? !!q.check(v) : same(q.a, v, q.tol), self = this;
    this.tries++;
    if (ok) {
      this.state = "wait"; this.correct++; this.streak++; this.wrongRun = 0;
      var gain = 10 * this.level * this.mult(); this.score += gain;
      if (btn) btn.classList.add("ok");
      this.lockOpts(q);
      sfx.ok();
      var up = false;
      if (this.streak > 0 && this.streak % 3 === 0 && this.level < 5) { this.level++; up = true; this.maxLevel = Math.max(this.maxLevel, this.level); lsSet(c.id + ".lvl", this.level); setTimeout(sfx.up, 250); }
      this.log.push({ q: q, ok: true });
      this.showFb(true, "To'g'ri! +" + gain + (this.mult() > 1 ? " (kombo ×" + this.mult() + ")" : "") + (up ? " · 📶 Daraja oshdi: " + LV_NAMES[this.level] : ""), q.okNote ? [q.okNote] : null);
      this.renderHud();
      if (c.onResult) c.onResult(true, q, v, this);
      if (Math.random() < 0.16 && this.qi < this.N) this.offerBox();
      setTimeout(function () { if (self.state === "wait") self.next(); }, c.okDelay || 1300);
    } else {
      if (btn) { btn.classList.add("no"); btn.disabled = true; }
      sfx.no();
      this.streak = 0; this.wrongRun++;
      if (c.onResult) c.onResult(false, q, v, this);
      // Birinchi xatoda — yana bir urinish (variantli savolda), ikkinchisida — yechim
      if (q.input === "opts" && this.tries < 2 && !q.oneTry && (q.shown || []).length > 2) {
        this.showFb(false, "Afsus, bu emas. Yana bir urinib ko'ring!" + (q.hint1 ? " " + q.hint1 : ""), null, true);
        this.renderHud(); return false;
      }
      if (q.input !== "opts" && this.tries < 2 && !q.oneTry) {
        this.showFb(false, "Hali to'g'ri emas — yana bir bor hisoblab ko'ring." + (q.hint1 ? " " + q.hint1 : ""), null, true);
        this.renderHud(); return false;
      }
      this.state = "wait";
      if (this.wrongRun >= 2 && this.level > 1) { this.level--; this.wrongRun = 0; lsSet(c.id + ".lvl", this.level); }
      this.score = Math.max(0, this.score - 0);
      this.lockOpts(q, true);
      this.log.push({ q: q, ok: false });
      this.showFb(false, "To'g'ri javob: " + (typeof q.a === "number" ? nf(q.a) + (q.unit ? " " + q.unit : "") : q.aText || q.a), q.steps, false, true);
      this.renderHud();
    }
    return ok;
  };

  P.lockOpts = function (q, reveal) {
    Array.prototype.forEach.call(this.el.ans.querySelectorAll(".km-opt"), function (b) {
      b.disabled = true; if (reveal && q.shown && same(q.a, q.shown[+b.getAttribute("data-i")], q.tol)) b.classList.add("ok");
    });
    var inp = this.el.ans.querySelector("input"); if (inp) inp.disabled = true;
    var sb = this.el.ans.querySelector('button[type="submit"]'); if (sb) sb.disabled = true;
  };

  P.showFb = function (ok, title, steps, soft, needNext) {
    var self = this, fb = this.el.fb;
    fb.className = "km-fb show " + (ok ? "ok" : "no");
    fb.innerHTML = "<h4>" + (ok ? "✅ " : soft ? "🤔 " : "❌ ") + title + "</h4>" +
      (steps && steps.length ? (ok ? "" : '<div style="font-weight:700;margin-top:6px">Yechim:</div>') + '<ol class="km-steps">' + steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>" : "") +
      (needNext ? '<div class="km-row"><button class="km-btn pri" type="button" data-next>Davom etish ▶</button></div>' : "");
    var nb = fb.querySelector("[data-next]");
    if (nb) { nb.onclick = function () { self.next(); }; setTimeout(function () { try { nb.focus({ preventScroll: true }); } catch (e) {} }, 60); }
  };
  P.hideFb = function () { this.el.fb.className = "km-fb"; this.el.fb.innerHTML = ""; };

  P.offerBox = function () {
    var self = this, host = this.el.stage.style.display === "none" ? this.root : this.el.stage;
    var b = D.createElement("button"); b.type = "button"; b.className = "km-box"; b.textContent = "🎁"; b.setAttribute("aria-label", "Sirli quti");
    host.appendChild(b);
    var gone = setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 6000);
    b.onclick = function () {
      clearTimeout(gone); if (b.parentNode) b.parentNode.removeChild(b); sfx.box();
      if (Math.random() < 0.9) {
        var r = pick(["pts", "ff", "skip", "time"]);
        if (r === "time" && self.mode !== "vaqt") r = "pts";
        if (r === "pts") { self.score += 20; toast("🎁 Sirli quti: +20 ochko!"); }
        else if (r === "ff") { self.ffLeft++; toast("🎁 Sirli quti: yana bitta 50/50 yordam!"); }
        else if (r === "skip") { self.skipLeft++; toast("🎁 Sirli quti: yana bitta «O'tkazish»!"); }
        else { self.tLeft += 15; toast("🎁 Sirli quti: +15 soniya!"); }
      } else { self.score = Math.max(0, self.score - 15); toast("🙈 Omad kelmadi: −15 ochko"); }
      self.renderHud();
    };
  };

  P.end = function () {
    if (this.state === "end") return;
    var c = this.cfg, self = this; this.state = "end"; clearInterval(this.timer);
    var total = this.log.length || this.N, pct = this.correct / Math.max(1, this.N);
    var stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
    var newBest = this.score > this.best; if (newBest) { this.best = this.score; lsSet(c.id + ".best", this.best); }
    var coins = false;
    try { if (stars && W.kaAccount && W.kaAccount.addCoins) coins = W.kaAccount.addCoins(stars, c.coinWhy || ("Milliy o'yin: " + c.title)); } catch (e) {}
    try { if (W.kaAccount && W.kaAccount.sendResult) W.kaAccount.sendResult(c.resultTopic || c.title, this.correct, this.N); } catch (e) {}
    sfx.end();
    var s = ""; for (var i = 1; i <= 3; i++) s += '<span class="' + (i <= stars ? "" : "off") + '">⭐</span>';
    this.el.ov.innerHTML = '<div class="km-card"><h3>' + (stars === 3 ? "Ajoyib!" : stars === 2 ? "Barakalla!" : stars === 1 ? "Yaxshi urinish!" : "Yana mashq qilamiz!") + '</h3>' +
      '<div class="km-stars">' + s + '</div><div class="km-big">' + this.score + ' ochko</div>' +
      '<p>To\'g\'ri javoblar: <b>' + this.correct + "/" + this.N + "</b> · Daraja: " + LV_NAMES[this.startLevel] + " → " + LV_NAMES[this.level] + (newBest ? "<br>🏆 Yangi rekord!" : "") +
      (coins ? "<br>🪙 +" + stars + " Bilimcoin" : (stars && !(W.kaAccount && W.kaAccount.me && W.kaAccount.me()) ? '<br><span style="font-size:13px">Bilimcoin olish uchun akkauntga kiring.</span>' : "")) + "</p>" +
      '<div class="km-row" style="justify-content:center"><button class="km-btn pri" type="button" data-again>🔁 Yana o\'ynash</button><button class="km-btn" type="button" data-menu>⚙️ Daraja tanlash</button></div></div>';
    this.el.ov.hidden = false;
    this.el.ov.querySelector("[data-again]").onclick = function () { self.start(); };
    this.el.ov.querySelector("[data-menu]").onclick = function () { self.showStart(); };
    if (c.onEnd) c.onEnd({ score: this.score, correct: this.correct, total: this.N, stars: stars }, this);
  };

  /* ---------- tuval yordamchisi: o'lcham, DPR, kadrlar ---------- */
  function stage(opt) {
    opt = opt || {};
    var cv = D.createElement("canvas"); cv.setAttribute("aria-label", opt.label || "O'yin maydoni");
    var S = { cv: cv, ctx: cv.getContext("2d"), w: 0, h: 0, dpr: 1, t: 0, draw: opt.draw || function () {}, ratio: opt.ratio || 0.62, minH: opt.minH || 260, maxH: opt.maxH || 460, live: true };
    function fit() {
      var w = cv.clientWidth || (cv.parentNode && cv.parentNode.clientWidth) || 360;
      var h = Math.round(Math.max(S.minH, Math.min(S.maxH, w * S.ratio)));
      var vv = W.visualViewport && W.visualViewport.scale > 1.05 ? W.visualViewport.scale : 1;
      var dpr = Math.min(vv > 1 ? 4 : 2, (W.devicePixelRatio || 1) * vv);
      if (w !== S.w || h !== S.h || dpr !== S.dpr) { S.w = w; S.h = h; S.dpr = dpr; cv.style.height = h + "px"; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); S.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (opt.onResize) opt.onResize(S); }
    }
    var last = 0, raf = 0, vis = true;
    function frame(ts) {
      raf = 0; if (D.hidden || !vis) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 1 / 60; last = ts; S.t += dt;
      fit(); S.ctx.save(); S.draw(S.ctx, S.w, S.h, dt, S.t); S.ctx.restore();
      raf = requestAnimationFrame(frame);
    }
    S.kick = function () { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };
    S.pos = function (e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    W.addEventListener("resize", S.kick);
    if (W.visualViewport) W.visualViewport.addEventListener("resize", S.kick);
    D.addEventListener("visibilitychange", function () { if (!D.hidden) S.kick(); });
    try { var io = new IntersectionObserver(function (en) { vis = en[0].isIntersecting; if (vis) S.kick(); }); io.observe(cv); } catch (e) {}
    setTimeout(S.kick, 0);
    return S;
  }

  // Yumaloq to'rtburchak (roundRect hamma brauzerda yo'q)
  function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function txt(c, s, x, y, col, size, align, weight, font) { c.fillStyle = col || "#fff"; c.font = (weight || 700) + " " + (size || 16) + "px " + (font || '"Golos Text",system-ui,sans-serif'); c.textAlign = align || "center"; c.textBaseline = "middle"; c.fillText(s, x, y); }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  W.KAM = { game: function (cfg) { return new Game(cfg); }, stage: stage, ri: ri, pick: pick, shuffle: shuffle, round: round, nf: nf, parseNum: parseNum, same: same, esc: esc, makeOpts: makeOpts, sfx: sfx, toast: toast, rr: rr, txt: txt, ease: ease, lsGet: lsGet, lsSet: lsSet };
})();
