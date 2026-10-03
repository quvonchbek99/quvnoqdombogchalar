/*!
 * Kuvonch Academy — "jonli" rasmlar
 *  - Har bir kartadagi rasm sekin harakatlanadi (kamera yaqinlashib-uzoqlashadi), yorug'lik o'tadi,
 *    sichqoncha / telefon egilishiga qarab 3D burilish
 *  - "🔊 Tinglash": o'zbekcha neyron ovoz (ovoz/*.mp3; bo'lmasa brauzer ovozi) kartadagi matnni o'qiydi, rasm "gapirayotgandek" jonlanadi,
 *    pastda subtitr va so'zlar birma-bir yonadi
 *  - "▶ Davrni tinglash": shu davrdagi hamma kartani ketma-ket o'qib beradi
 * Ulash: </body> dan oldin <script src="ka-jonli.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaJonli) return; window.__kaJonli = true;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var synth = window.speechSynthesis;

  var css = `
  .kj-frame{position:relative;overflow:hidden;height:210px;background:#111a2e;isolation:isolate}
  .kj-frame .ev-img{height:100%;transform-origin:var(--ox,50%) var(--oy,40%);animation:kjDrift var(--dur,18s) ease-in-out infinite alternate;will-change:transform}
  @keyframes kjDrift{0%{transform:scale(1.04) translate(var(--x1,0),var(--y1,0))}100%{transform:scale(1.16) translate(var(--x2,0),var(--y2,0))}}
  .kj-frame::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(120% 90% at 50% 35%,transparent 55%,rgba(5,9,20,.55) 100%)}
  .kj-frame::after{content:"";position:absolute;top:-20%;bottom:-20%;width:40%;left:-60%;z-index:2;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(255,255,255,.18),transparent);transform:skewX(-12deg);animation:kjSweep 7s ease-in-out infinite;animation-delay:var(--sd,0s)}
  @keyframes kjSweep{0%,70%{left:-60%}100%{left:130%}}
  .ev-card.kj-tilt{transition:transform .25s ease,border-color .15s;transform-style:preserve-3d}
  .kj-btn{position:absolute;left:10px;bottom:10px;z-index:5;display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:99px;background:rgba(8,14,28,.72);border:1px solid rgba(255,255,255,.25);color:#fff;font:700 13px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:transform .15s,background .15s}
  .kj-btn:hover{transform:scale(1.06);background:rgba(94,230,199,.9);color:#08131f}
  .kj-waves{position:absolute;right:12px;bottom:14px;z-index:5;display:none;gap:3px;align-items:flex-end;height:22px}
  .kj-waves i{width:4px;border-radius:2px;background:#5ee6c7;animation:kjBar .8s ease-in-out infinite}
  .kj-waves i:nth-child(2){animation-delay:.15s}.kj-waves i:nth-child(3){animation-delay:.3s}.kj-waves i:nth-child(4){animation-delay:.45s}
  @keyframes kjBar{0%,100%{height:5px}50%{height:22px}}
  .kj-sub{position:absolute;left:0;right:0;bottom:0;z-index:4;padding:34px 12px 46px;background:linear-gradient(transparent,rgba(5,9,20,.88) 45%);color:#dfe6ff;font:600 14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;opacity:0;transform:translateY(10px);transition:.3s;pointer-events:none}
  .kj-sub b{color:#5ee6c7;font-weight:800}
  .ev-card.kj-talk{border-color:#5ee6c7!important;box-shadow:0 0 0 2px rgba(94,230,199,.35),0 18px 50px rgba(94,230,199,.15)}
  .ev-card.kj-talk .kj-waves{display:flex}
  .ev-card.kj-talk .kj-sub{opacity:1;transform:none}
  .ev-card.kj-talk .ev-img{animation:none;transform:scale(1.17)}
  .ev-card.kj-talk .kj-frame{animation:kjBreath 3.2s ease-in-out infinite}
  @keyframes kjBreath{0%,100%{filter:brightness(1)}50%{filter:brightness(1.12) saturate(1.1)}}
  .ev-card .ev-img.kj-beat{transition:transform .12s ease-out}
  .kj-all{display:inline-flex;align-items:center;gap:8px;margin:0 0 14px;padding:9px 16px;border-radius:12px;border:1px solid rgba(94,230,199,.45);background:rgba(94,230,199,.1);color:#5ee6c7;font:700 14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer}
  .kj-all:hover{background:rgba(94,230,199,.2)}
  @media (prefers-reduced-motion: reduce){.kj-frame .ev-img,.kj-frame::after{animation:none}}
  `;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- ovoz tanlash va transliteratsiya ---------- */
  var voice = null, vmode = "raw";
  function pickVoice() {
    if (!synth) return;
    var vs = synth.getVoices(); if (!vs.length) return;
    function f(p) { for (var i = 0; i < vs.length; i++) if ((vs[i].lang || "").toLowerCase().indexOf(p) === 0) return vs[i]; return null; }
    voice = f("uz"); vmode = "uz";
    if (!voice) { voice = f("tr"); vmode = "tr"; }
    if (!voice) { voice = f("az"); vmode = "tr"; }
    if (!voice) { voice = f("kk") || f("ru"); vmode = "cyr"; }
    if (!voice) { voice = null; vmode = "raw"; }
  }
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }

  var APO = /[ʻʼ‘’`']/g;
  function toTr(s) {
    return s.replace(/[Oo][ʻʼ‘’`']/g, function (m) { return m[0]; })
      .replace(/G[ʻʼ‘’`']/g, "Ğ").replace(/g[ʻʼ‘’`']/g, "ğ")
      .replace(/Sh/g, "Ş").replace(/SH/g, "Ş").replace(/sh/g, "ş").replace(/Ch/g, "Ç").replace(/CH/g, "Ç").replace(/ch/g, "ç")
      .replace(/X/g, "H").replace(/x/g, "h").replace(/Q/g, "K").replace(/q/g, "k").replace(/J/g, "C").replace(/j/g, "c").replace(/W/g, "V").replace(/w/g, "v")
      .replace(APO, "");
  }
  var CYR = [["sh", "ш"], ["ch", "ч"], ["ya", "я"], ["yo", "ё"], ["yu", "ю"], ["ye", "е"], ["o'", "о"], ["g'", "г"],
    ["a", "а"], ["b", "б"], ["d", "д"], ["e", "е"], ["f", "ф"], ["g", "г"], ["h", "х"], ["i", "и"], ["j", "ж"], ["k", "к"], ["l", "л"], ["m", "м"], ["n", "н"], ["o", "о"], ["p", "п"], ["q", "к"], ["r", "р"], ["s", "с"], ["t", "т"], ["u", "у"], ["v", "в"], ["x", "х"], ["y", "й"], ["z", "з"], ["w", "в"], ["c", "к"]];
  function toCyr(s) {
    s = s.replace(/[ʻʼ‘’`]/g, "'");
    var out = "", i = 0;
    while (i < s.length) {
      var lo = s.slice(i).toLowerCase(), hit = null;
      for (var k = 0; k < CYR.length; k++) if (lo.indexOf(CYR[k][0]) === 0) { hit = CYR[k]; break; }
      if (hit) {
        var ch = hit[1]; if (s[i] !== s[i].toLowerCase()) ch = ch.toUpperCase();
        if (hit[0] === "e" && (i === 0 || /[\s"(«-]/.test(s[i - 1]))) ch = s[i] === "E" ? "Э" : "э";
        out += ch; i += hit[0].length;
      } else { out += s[i] === "'" ? "ъ" : s[i]; i++; }
    }
    return out;
  }
  function spoken(s) { return vmode === "tr" ? toTr(s) : vmode === "cyr" ? toCyr(s) : s; }

  // "1596 — 1650", "mil. av. ~570 — 495" -> o'qishga qulay
  function yearText(y) {
    y = y.replace(/mil\.\s*av\./gi, "miloddan avvalgi").replace(/~/g, "taxminan ").replace(/milodiy/gi, "milodiy");
    var m = /^(.*?)(\d{3,4})\s*[—–-]\s*(\d{2,4})(.*)$/.exec(y);
    if (m) y = m[1] + m[2] + "-yildan " + m[3] + "-yilgacha" + m[4];
    return y.replace(/\s+/g, " ").trim();
  }

  /* ---------- kartalarni jonlantirish ---------- */
  var cur = null; // hozir gapirayotgan karta
  function setup(card) {
    if (card.__kj) return; var img = card.querySelector(".ev-img"); if (!img) return; card.__kj = 1;
    var fr = document.createElement("div"); fr.className = "kj-frame";
    img.parentNode.insertBefore(fr, img); fr.appendChild(img);
    var r = function (a) { return (Math.random() * 2 - 1) * a; };
    fr.style.setProperty("--dur", (14 + Math.random() * 10).toFixed(1) + "s");
    fr.style.setProperty("--x1", r(2).toFixed(1) + "%"); fr.style.setProperty("--y1", r(2).toFixed(1) + "%");
    fr.style.setProperty("--x2", r(4).toFixed(1) + "%"); fr.style.setProperty("--y2", r(3).toFixed(1) + "%");
    fr.style.setProperty("--ox", (35 + Math.random() * 30).toFixed(0) + "%"); fr.style.setProperty("--oy", (25 + Math.random() * 30).toFixed(0) + "%");
    fr.style.setProperty("--sd", (Math.random() * 6).toFixed(1) + "s");
    img.style.animationDelay = (-Math.random() * 10).toFixed(1) + "s";
    var sub = document.createElement("div"); sub.className = "kj-sub"; fr.appendChild(sub);
    var wv = document.createElement("div"); wv.className = "kj-waves"; wv.innerHTML = "<i></i><i></i><i></i><i></i>"; fr.appendChild(wv);
    if (true) {
      var b = document.createElement("span"); b.className = "kj-btn"; b.setAttribute("role", "button"); b.tabIndex = 0; b.textContent = "🔊 Tinglash";
      var go = function (e) { e.preventDefault(); e.stopPropagation(); if (cur === card) stop(); else speak(card); };
      b.addEventListener("click", go); b.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") go(e); });
      fr.appendChild(b); card.__btn = b;
    }
    card.__sub = sub; card.__img = img;
    // Rasm yuklanmasa (Wikimedia band bo'lsa) — qayta urinish, bo'lmasa chiroyli belgi
    var tries = 0;
    function onErr() {
      if (tries++ < 2) { var s0 = img.getAttribute("src").replace(/[?&]r=\d+$/, ""); setTimeout(function () { img.src = s0 + (s0.indexOf("?") < 0 ? "?" : "&") + "r=" + tries; }, 1500 * tries); return; }
      var h = card.querySelector("h4"), nm = h ? h.textContent.trim() : "?";
      var ini = nm.split(/\s+/).filter(function (w) { return /^[A-ZА-ЯЎҚҒҲ]/.test(w); }).slice(0, 2).map(function (w) { return w[0]; }).join("") || "∑";
      var ph = document.createElement("div"); ph.className = "ev-img";
      ph.style.cssText = "display:flex;align-items:center;justify-content:center;font:800 64px Georgia,serif;color:#5ee6c7;background:radial-gradient(circle at 50% 40%,#22305a,#0e1630)";
      ph.textContent = ini; img.replaceWith(ph); card.__img = ph;
    }
    img.addEventListener("error", onErr);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) onErr();
    if (!reduce) {
      card.classList.add("kj-tilt");
      card.addEventListener("pointermove", function (e) {
        if (e.pointerType === "touch") return;
        var rc = card.getBoundingClientRect(), px = (e.clientX - rc.left) / rc.width - .5, py = (e.clientY - rc.top) / rc.height - .5;
        card.style.transform = "perspective(900px) rotateY(" + (px * 8) + "deg) rotateX(" + (-py * 8) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    }
  }

  function cardText(card) {
    var h = card.querySelector("h4"), y = card.querySelector(".ev-year"), p = card.querySelector(".ev-body p");
    var parts = [];
    if (h) parts.push(h.textContent.trim().replace(/\s*\(([^)]*)\)/, ", $1,") + ".");
    if (y) parts.push(yearText(y.textContent) + ".");
    if (p) parts.push(p.textContent.trim());
    return parts.join(" ").replace(/\s+/g, " ");
  }

  var queue = [], timer = 0;
  /* ---------- tayyor o'zbekcha ovoz (ovoz/*.mp3, neyron ovoz) ---------- */
  var BASE = (document.currentScript && document.currentScript.src || location.href).replace(/[^/]*$/, "");
  var manP = null, audio = null;
  function manifest() { if (!manP) manP = fetch(BASE + "ovoz/ovoz.json").then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }); return manP; }
  function slug(t) { return t.toLowerCase().replace(/[ʻʼ‘’`']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function wordsHtml(ws, wi) {
    var s = Math.max(0, wi - 6); while (s > 0 && ws[s][0][0] === "-") s--; var e = Math.min(ws.length, s + 14), out = "";
    for (var i = s; i < e; i++) { var w = ws[i][0].replace(/[&<>]/g, ""); out += (w[0] === "-" || i === s ? "" : " ") + (i === wi ? "<b>" + w + "</b>" : w); }
    return out;
  }
  function playAudio(card, ent, key) {
    var a = audio = new Audio(BASE + "ovoz/" + key + ".mp3"); a.preload = "auto";
    var ws = ent.w, shown = -1;
    cur = card; card.classList.add("kj-talk"); if (card.__btn) card.__btn.textContent = "⏹ To'xtatish";
    card.__sub.innerHTML = wordsHtml(ws, 0);
    a.ontimeupdate = function () {
      var ms = a.currentTime * 1000, wi = 0; while (wi + 1 < ws.length && ws[wi + 1][1] <= ms) wi++;
      if (wi === shown) return; shown = wi; card.__sub.innerHTML = wordsHtml(ws, wi);
      var im = card.__img; im.classList.add("kj-beat"); im.style.transform = "scale(1.2) translateY(-1%)";
      setTimeout(function () { im.style.transform = "scale(1.17)"; }, 120);
    };
    a.onended = function () { if (cur !== card) return; finish(card); next(); };
    a.onerror = function () { if (cur !== card) return; finish(card); speakSynth(card); };
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () { if (cur === card) { finish(card); speakSynth(card); } });
  }
  function next() {
    if (queue.length) { var n = queue.shift(); n.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { speak(n, true); }, 700); }
    else updateAllBtns();
  }
  function speak(card, fromQueue) {
    if (!fromQueue) queue = [];
    stop(true);
    var h = card.querySelector("h4"), key = h ? slug(h.textContent.trim()) : "";
    cur = card; card.classList.add("kj-talk"); if (card.__btn) card.__btn.textContent = "⏳";
    manifest().then(function (m) {
      if (cur !== card) return;
      finish(card);
      if (m[key]) playAudio(card, m[key], key); else speakSynth(card);
    });
  }
  function speakSynth(card) {
    if (!synth) { next(); return; }
    if (!voice) pickVoice();
    var text = cardText(card), words = text.split(" "), say = spoken(text);
    var u = new SpeechSynthesisUtterance(say);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = "uz-UZ";
    u.rate = vmode === "uz" ? 0.95 : 0.9; u.pitch = 1;
    cur = card; card.classList.add("kj-talk"); if (card.__btn) card.__btn.textContent = "⏹ To'xtatish";
    var shown = -1, gotBoundary = false;
    function show(wi) {
      if (wi === shown || wi >= words.length) return; shown = wi;
      // joriy gapni ko'rsatamiz, joriy so'z yonadi
      var s = wi, e = wi; while (s > 0 && !/[.!?]$/.test(words[s - 1])) s--; while (e < words.length - 1 && !/[.!?]$/.test(words[e])) e++;
      if (e - s > 22) { s = Math.max(s, wi - 8); e = Math.min(e, wi + 12); }
      card.__sub.innerHTML = words.slice(s, e + 1).map(function (w, k) { var t = w.replace(/[&<>]/g, ""); return s + k === wi ? "<b>" + t + "</b>" : t; }).join(" ");
      var im = card.__img; im.classList.add("kj-beat"); im.style.transform = "scale(1.2) translateY(-1%)";
      setTimeout(function () { im.style.transform = "scale(1.17)"; }, 120);
    }
    u.onboundary = function (ev) {
      if (ev.name && ev.name !== "word") return; gotBoundary = true;
      var before = say.slice(0, ev.charIndex); show(before.split(" ").length - 1);
    };
    u.onstart = function () {
      show(0); var wi = 0, msPerWord = 60000 / (150 * u.rate);
      clearInterval(timer);
      timer = setInterval(function () { if (gotBoundary) { clearInterval(timer); return; } wi++; show(wi); }, msPerWord);
    };
    u.onend = u.onerror = function () {
      if (cur !== card) return;
      finish(card); next();
    };
    synth.speak(u);
    // ba'zi Android brauzerlarida uzun matn o'z-o'zidan to'xtab qolmasligi uchun
    if (synth.paused) synth.resume();
  }
  function finish(card) {
    clearInterval(timer);
    card.classList.remove("kj-talk"); if (card.__btn) card.__btn.textContent = "🔊 Tinglash";
    card.__img.style.transform = ""; card.__img.classList.remove("kj-beat");
    if (cur === card) cur = null;
  }
  function stop(keepQueue) {
    if (!keepQueue) queue = [];
    var c = cur; cur = null; if (c) finish(c);
    if (audio) { try { audio.pause(); } catch (e) {} audio.onended = audio.onerror = audio.ontimeupdate = null; audio = null; }
    if (synth) synth.cancel();
    if (!keepQueue) updateAllBtns();
  }

  /* ---------- "Davrni tinglash" ---------- */
  var allBtns = [];
  function updateAllBtns() { allBtns.forEach(function (b) { b.textContent = b.__on && (cur || queue.length) ? "⏹ To'xtatish" : "▶ Davrni tinglash"; if (!(cur || queue.length)) b.__on = false; }); }
  function setupGrid(g) {
    if (g.__kj) return; g.__kj = 1;
    var cards = g.querySelectorAll(".ev-card"); if (cards.length < 2) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "kj-all"; b.textContent = "▶ Davrni tinglash";
    b.onclick = function () {
      if (b.__on) { b.__on = false; stop(); return; }
      allBtns.forEach(function (x) { x.__on = false; });
      var list = Array.prototype.slice.call(g.querySelectorAll(".ev-card"));
      b.__on = true; list[0].scrollIntoView({ behavior: "smooth", block: "center" });
      speak(list[0]); queue = list.slice(1); updateAllBtns();
    };
    g.parentNode.insertBefore(b, g); allBtns.push(b);
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll(".ev-card"), setup);
    Array.prototype.forEach.call(document.querySelectorAll(".era-grid"), setupGrid);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  addEventListener("pagehide", function () { stop(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); });

  // Telefon egilganda rasmlar biroz siljiydi (Android)
  if (!reduce && "DeviceOrientationEvent" in window && typeof DeviceOrientationEvent.requestPermission !== "function") {
    var raf = 0;
    addEventListener("deviceorientation", function (e) {
      if (raf || e.gamma == null) return;
      raf = requestAnimationFrame(function () {
        raf = 0; var gx = Math.max(-20, Math.min(20, e.gamma)) / 20, gy = Math.max(-20, Math.min(20, (e.beta || 45) - 45)) / 20;
        document.documentElement.style.setProperty("--kj-gx", gx.toFixed(2)); document.documentElement.style.setProperty("--kj-gy", gy.toFixed(2));
      });
    });
    var s2 = document.createElement("style"); s2.textContent = ".kj-frame{transform:translate(calc(var(--kj-gx,0)*-6px),calc(var(--kj-gy,0)*-4px)) scale(1.03)}"; document.head.appendChild(s2);
  }
})();
