/*!
 * Kuvonch Academy — mavzu testlari (20 / 30 / 50 / 100 savol, 3 daraja)
 * Savollar ka-savollar.js generatorlaridan olinadi — har safar yangi, takrorlanmaydi.
 * Ulash: <script src="ka-savollar.js"></script><script src="ka-test.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaTest) return; window.__kaTest = true;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(t, a, h) { var e = document.createElement(t); if (a) for (var k in a) { if (k === "class") e.className = a[k]; else e.setAttribute(k, a[k]); } if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fmt(v) { return String(v).replace(/-/g, "−"); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mmss(s) { var m = Math.floor(s / 60), x = s % 60; return m + ":" + (x < 10 ? "0" : "") + x; }

  /* ---------- javobni tekshirish ---------- */
  function norm(s) {
    return String(s).trim().toLowerCase()
      .replace(/[−–—]/g, "-").replace(/[ʻʼ‘’`]/g, "'").replace(/,/g, ".")
      .replace(/\s+/g, "").replace(/;$/, "");
  }
  function same(inp, ans) {
    // "b = 0, c = −1" ↔ "0; −1" (tartib muhim)
    if (/^[a-z]\s*=.*,\s*[a-z]\s*=/i.test(String(ans).trim())) {
      var lab = function (v) { return String(v).toLowerCase().replace(/[−–—]/g, "-").replace(/[a-z]\s*=\s*/g, "").replace(/\s+/g, "").replace(/[,;]/g, ";"); };
      return !!String(inp).trim() && lab(ans) === lab(inp);
    }
    var A = norm(ans), B = norm(inp);
    if (!B) return false;
    if (A === B) return true;
    // sonli javob
    var na = parseFloat(A), nb = parseFloat(B);
    if (/^-?\d+(\.\d+)?$/.test(A) && /^-?\d+(\.\d+)?$/.test(B)) return Math.abs(na - nb) < 1e-9;
    // ildizlar ro'yxati x1; x2 — tartib muhim emas (qavsli juftlik/oraliqda tartib muhim: (2; 3) ≠ (3; 2))
    if (A.indexOf(";") > 0 && !/[(\[]/.test(A)) {
      var pa = A.replace(/[()\[\]]/g, "").split(";").map(function (x) { return x.trim(); }).sort();
      var pb = B.replace(/[()\[\]]/g, "").split(";").map(function (x) { return x.trim(); }).sort();
      if (pa.length === pb.length && pa.join("|") === pb.join("|")) return true;
    }
    // "x = 3" ↔ "3"
    var sa = A.replace(/^[a-z]\s*=/, ""), sb = B.replace(/^[a-z]\s*=/, "");
    if (sa === sb) return true;
    return false;
  }

  /* ---------- CSS ---------- */
  var css = `
  .kt-box{margin:18px 0 6px;border:1px solid #3a5a9a;border-radius:16px;padding:14px;background:linear-gradient(180deg,rgba(94,230,199,.08),rgba(124,155,255,.04))}
  .kt-box h4{margin:0 0 10px;font-weight:800;font-size:16px;line-height:1.3;font-family:inherit;color:#eef2ff}
  .kt-grp{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:8px 0}
  .kt-grp>span{font-weight:700;font-size:12px;line-height:1;font-family:inherit;color:#9fb0d0;min-width:78px;letter-spacing:.04em;text-transform:uppercase}
  .kt-b{background:#111a2e;color:#eef2ff;border:1px solid #243252;border-radius:10px;padding:8px 13px;font-weight:700;font-size:13px;line-height:1;font-family:inherit;cursor:pointer}
  .kt-b.on{background:#7c9bff;color:#0b1220;border-color:transparent}
  .kt-b.go{background:#5ee6c7;color:#06231d;border-color:transparent;font-size:14px;padding:11px 20px}
  .kt-b:disabled{opacity:.5;cursor:default}
  .kt-note{font-size:12px;color:#9fb0d0;margin-top:8px}
  .kt-last{font-weight:700;font-size:12px;line-height:1.4;font-family:inherit;color:#5ee6c7;margin-top:6px}
  .kt-ov{position:fixed;inset:0;z-index:99999;background:#070c17;display:flex;flex-direction:column;overflow:hidden}
  .kt-top{display:flex;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid #1b2a46;background:#0b1220;flex-wrap:wrap}
  .kt-top b{color:#eef2ff;font-size:14px;margin-right:auto;max-width:48ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .kt-pill{font:800 12px/1 ui-monospace,monospace;color:#5ee6c7;background:#0e1628;border:1px solid #243252;border-radius:999px;padding:7px 11px}
  .kt-pill.t{color:#ffd479}.kt-pill.x{color:#ff8585}
  .kt-bar{height:4px;background:#121c32}.kt-bar i{display:block;height:100%;background:linear-gradient(90deg,#7c9bff,#5ee6c7);width:0;transition:width .25s}
  .kt-main{flex:1;overflow:auto;padding:18px 14px 90px;max-width:760px;margin:0 auto;width:100%;box-sizing:border-box}
  .kt-lv{display:inline-block;font-weight:800;font-size:11px;line-height:1;font-family:inherit;padding:5px 9px;border-radius:999px;margin-bottom:12px;letter-spacing:.05em;text-transform:uppercase}
  .kt-lv.l1{background:rgba(94,230,199,.16);color:#5ee6c7}.kt-lv.l2{background:rgba(255,212,121,.16);color:#ffd479}.kt-lv.l3{background:rgba(255,133,133,.16);color:#ff8585}
  .kt-q{color:#eef2ff;font-weight:600;font-size:21px;line-height:1.5;font-family:inherit;margin-bottom:18px;word-wrap:break-word}
  .kt-opts{display:grid;gap:9px}
  .kt-opt{text-align:left;background:#0e1628;color:#eef2ff;border:1.5px solid #243252;border-radius:12px;padding:14px 16px;font-weight:600;font-size:17px;line-height:1.3;font-family:inherit;cursor:pointer;display:flex;gap:11px;align-items:center}
  .kt-opt span{width:26px;height:26px;flex:0 0 26px;border-radius:8px;background:#1a2540;color:#9fb0d0;font:800 13px/26px ui-monospace,monospace;text-align:center}
  .kt-opt:hover{border-color:#7c9bff}
  .kt-opt.ok{border-color:#5ee6c7;background:rgba(42,157,75,.38);color:#fff}
  .kt-opt.ok span{background:#2a9d4b;color:#fff}
  .kt-opt.bad{border-color:#ff5c5c;background:rgba(229,72,77,.42);color:#fff;text-decoration:line-through;text-decoration-color:rgba(255,255,255,.6)}
  .kt-opt.bad span{background:#e5484d;color:#fff}
  .kt-why{margin-top:12px;padding:11px 13px;border-radius:12px;background:rgba(229,72,77,.12);border:1px solid rgba(255,92,92,.55);color:#ffd6d6;font-weight:600;font-size:14.5px;line-height:1.55;font-family:inherit}
  .kt-why b{color:#ff9c9c}
  .kt-cd{display:inline-block;min-width:1.6em;margin-left:8px;padding:2px 6px;border-radius:999px;background:rgba(6,35,29,.22);font-variant-numeric:tabular-nums}
  .kt-b.hold{font-size:14px;padding:11px 14px}
  .kt-ov.d3::before{content:"";position:absolute;left:-50%;right:-50%;bottom:-12%;height:60%;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(94,230,199,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(124,155,255,.16) 1px,transparent 1px);background-size:60px 60px;transform:perspective(520px) rotateX(64deg);transform-origin:50% 100%;animation:kt3floor 5s linear infinite;-webkit-mask-image:linear-gradient(to top,#000 15%,transparent 88%);mask-image:linear-gradient(to top,#000 15%,transparent 88%)}
  @keyframes kt3floor{to{background-position:0 60px}}
  .kt-ov.d3 .kt-top,.kt-ov.d3 .kt-bar,.kt-ov.d3 .kt-main,.kt-ov.d3 .kt-bot{position:relative;z-index:1}
  .kt-ov.d3 .kt-bot{position:fixed}
  .kt-ov.d3 .kt-main{perspective:1000px;perspective-origin:50% 20%}
  .kt-ov.d3 .kt-q{background:#0e1628;border:1px solid #2f4174;border-radius:16px;padding:16px 18px;box-shadow:0 8px 0 #0a1120,0 22px 34px rgba(0,0,0,.5);transform:rotateX(5deg);animation:kt3in .55s cubic-bezier(.2,.9,.3,1.25) backwards}
  @keyframes kt3in{from{transform:rotateX(80deg) translateZ(-240px);opacity:0}}
  .kt-ov.d3 .kt-opts{transform-style:preserve-3d;pointer-events:none}.kt-ov.d3 .kt-opts .kt-opt{pointer-events:auto}
  .kt-ov.d3 .kt-opt{box-shadow:0 6px 0 #0a1120,0 14px 22px rgba(0,0,0,.42);transition:transform .25s,box-shadow .25s;animation:kt3opt .5s cubic-bezier(.2,.9,.3,1.3) backwards}
  .kt-ov.d3 .kt-opt:nth-child(2){animation-delay:.07s}.kt-ov.d3 .kt-opt:nth-child(3){animation-delay:.14s}.kt-ov.d3 .kt-opt:nth-child(4){animation-delay:.21s}
  @keyframes kt3opt{from{transform:translateZ(-260px) rotateX(-60deg);opacity:0}}
  @media (hover:hover){.kt-ov.d3 .kt-opt:not(:disabled):hover{transform:translateZ(18px)}}
  .kt-ov.d3 .kt-opt:not(:disabled):active{transform:translateY(5px);box-shadow:0 1px 0 #0a1120,0 4px 8px rgba(0,0,0,.4)}
  .kt-ov.d3 .kt-opt.ok{transform:translateZ(36px) scale(1.02);box-shadow:0 0 0 2px #5ee6c7,0 0 30px rgba(94,230,199,.45),0 18px 28px rgba(0,0,0,.5)}
  .kt-ov.d3 .kt-opt.bad{animation:kt3bad .65s both}
  @keyframes kt3bad{0%{transform:none}25%{transform:rotateY(24deg) translateZ(-16px)}55%{transform:rotateY(-14deg)}100%{transform:translateZ(-28px) rotateX(8deg)}}
  .kt-ov.d3 .kt-why,.kt-ov.d3 .kt-fb.ok{animation:kt3in .45s backwards}
  @media (prefers-reduced-motion:reduce){.kt-ov.d3::before,.kt-ov.d3 .kt-q,.kt-ov.d3 .kt-opt,.kt-ov.d3 .kt-opt.bad,.kt-ov.d3 .kt-why{animation:none}}
  .kt-opt:disabled{cursor:default}
  .kt-inrow{display:flex;gap:8px;flex-wrap:wrap}
  .kt-inrow input{flex:1 1 180px;min-width:0;background:#0b1220;color:#eef2ff;border:1.5px solid #243252;border-radius:12px;padding:14px 16px;font:700 18px/1 ui-monospace,monospace;outline:none}
  .kt-inrow input:focus{border-color:#7c9bff}
  .kt-fb{margin-top:14px;font-weight:700;font-size:15px;line-height:1.5;font-family:inherit;min-height:1.4em}
  .kt-fb.ok{color:#5ee6c7}.kt-fb.bad{color:#ff8585}
  .kt-steps{margin:10px 0 0;padding-left:20px;color:#c9d4ff;font-weight:500;font-size:14.5px;line-height:1.6;font-family:inherit}
  .kt-bot{position:fixed;left:0;right:0;bottom:0;padding:12px 14px;background:#0b1220;border-top:1px solid #1b2a46;display:flex;gap:8px;justify-content:center}
  .kt-res{text-align:center;padding:10px 0 20px}
  .kt-big{font-weight:900;font-size:64px;line-height:1;font-family:inherit;color:#5ee6c7;margin:6px 0}
  .kt-big.mid{color:#ffd479}.kt-big.low{color:#ff8585}
  .kt-sub{color:#9fb0d0;font-weight:600;font-size:15px;line-height:1.6;font-family:inherit}
  .kt-rev{margin-top:22px;text-align:left}
  .kt-rev h5{color:#eef2ff;font-weight:800;font-size:15px;line-height:1.3;font-family:inherit;margin:0 0 10px}
  .kt-rev li{background:#0e1628;border:1px solid #33405f;border-left:3px solid #ff8585;border-radius:10px;padding:11px 13px;margin-bottom:9px;list-style:none;color:#eef2ff;font-weight:500;font-size:14.5px;line-height:1.55;font-family:inherit}
  .kt-rev li b{color:#5ee6c7}.kt-rev li i{color:#ff8585;font-style:normal}
  .kt-in{width:74px;background:#0b1220;color:#eef2ff;border:1px solid #243252;border-radius:10px;padding:7px 9px;font-weight:700;font-size:13px;line-height:1;font-family:inherit;outline:none}
  .kt-in:focus{border-color:#7c9bff}
  .kt-pill.t.warn{color:#ff8585;animation:ktblink 1s infinite}
  @keyframes ktblink{50%{opacity:.4}}
  .kt-auto{font-weight:600;font-size:12px;line-height:1;font-family:inherit;color:#9fb0d0;margin-left:8px}
  .kt-diag{margin-top:10px;padding:12px 14px;border-radius:12px;background:rgba(124,155,255,.1);border:1px solid #3a5a9a;color:#eef2ff;font-weight:600;font-size:14px;line-height:1.5;font-family:inherit}
  .kt-diag b{color:#5ee6c7}
  .kt-b.diag{background:linear-gradient(135deg,#a78bfa,#7c9bff);color:#0b1220;border-color:transparent}
  .kt-resume{position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:9000;background:#0e1628;border:1px solid #7c9bff;border-radius:14px;padding:10px 14px;color:#eef2ff;font-weight:600;font-size:14px;line-height:1.4;font-family:inherit;display:flex;gap:10px;align-items:center;flex-wrap:wrap;box-shadow:0 12px 30px rgba(0,0,0,.45);max-width:calc(100vw - 24px)}
  .kt-resume b{color:#5ee6c7}
  .kt-weak{margin-top:22px;text-align:left}
  .kt-weak h5{color:#eef2ff;font-weight:800;font-size:15px;line-height:1.3;font-family:inherit;margin:0 0 10px}
  .kt-weak .w{background:#0e1628;border:1px solid #33405f;border-left:3px solid #ffd479;border-radius:10px;padding:11px 13px;margin-bottom:9px;color:#eef2ff;font-weight:500;font-size:14.5px;line-height:1.55;font-family:inherit}
  .kt-weak .w b{color:#ffd479}
  .kt-weak .w .acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
  .kt-weak .w .acts a,.kt-weak .w .acts button{font-weight:700;font-size:12px;line-height:1;font-family:inherit;color:#eef2ff;background:#1a2540;border:1px solid #33405f;border-radius:999px;padding:7px 10px;text-decoration:none;cursor:pointer}
  .kt-weak .ok{color:#5ee6c7;font-weight:600;font-size:14.5px;line-height:1.5;font-family:inherit}
  .kt-lvbar{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}
  .kt-lvbar span{font-weight:700;font-size:12px;line-height:1;font-family:inherit;padding:7px 10px;border-radius:999px;background:#0e1628;border:1px solid #243252;color:#9fb0d0}
  .kt-lvbar span.bad{border-color:#ff8585;color:#ff8585}.kt-lvbar span.good{border-color:#5ee6c7;color:#5ee6c7}
  .kt-snd{background:transparent;border:1px solid #243252;color:#9fb0d0;border-radius:10px;padding:7px 9px;cursor:pointer;font-weight:700;font-size:13px;line-height:1;font-family:inherit}
  @media(min-width:761px){.kt-ov.kd-on .kt-main,.kt-ov.kd-on .kt-bot{padding-right:min(46vw,560px)}}
  @media(max-width:520px){.kt-q{font-size:18px}.kt-opt{font-size:15.5px;padding:12px 13px}.kt-big{font-size:52px}}
  `;
  document.head.appendChild(el("style", null, css));

  /* inglizcha (SAT) — faqat shu faylda qo'shilgan yangi matnlar uchun; qolganini ka-til.js tarjima qiladi */
  var EN = { "Keyingi savol →": "Next question →", "Natijani ko'rish →": "See results →", "⏸️ To'xtat": "⏸️ Stop", "▶ Davom": "▶ Continue",
    "❓ Nima uchun xato?": "❓ Why is it wrong?", "Siz tanladingiz": "You chose", "Yechim:": "Solution:", "3D rejim": "3D mode",
    "✔ To'g'ri!": "✔ Correct!", "✘ Noto'g'ri. To'g'ri javob: ": "✘ Incorrect. Correct answer: ", "avtomatik…": "auto…" };
  function enMode(id) {
    try { if (document.documentElement.getAttribute("data-til-force") === "en") return true; if (/^sat/.test(id || "")) return true; return !!(window.kaTil && kaTil.get() === "en"); } catch (e) { return false; }
  }
  var curEn = false;
  function T(s) { return curEn && EN[s] ? EN[s] : s; }
  // SAT testi o'zbekcha sahifada ochilsa ham oyna to'liq inglizcha bo'lsin: ka-til-en.js lug'ati bilan shu oynani o'giramiz
  var ENDICT = null, enLoading = false;
  function needOwnEn() { return curEn && !(window.kaTil && kaTil.get && kaTil.get() === "en"); }
  function loadEnDict(cb) {
    if (ENDICT) return cb();
    if (window.KA_TR && KA_TR.en && Object.keys(KA_TR.en).length > 500) { ENDICT = KA_TR.en; return cb(); }
    if (enLoading) return; enLoading = true;
    var sc = document.createElement("script"); sc.src = "ka-til-en.js";
    sc.onload = function () { ENDICT = (window.KA_TR && KA_TR.en) || {}; cb(); }; sc.onerror = function () { ENDICT = {}; };
    document.head.appendChild(sc);
  }
  function enTr(src) {
    var k = String(src).replace(/\s+/g, " ").trim(); if (!k || !ENDICT) return null;
    if (ENDICT[k] != null) return ENDICT[k];
    if (/\d/.test(k)) { var nums = k.match(/\d+/g), t = ENDICT[k.replace(/\d+/g, "#")]; if (t != null && (t.match(/#/g) || []).length === nums.length) { var i = 0; return t.replace(/#/g, function () { return nums[i++]; }); } }
    return null;
  }
  function enWalk(root) {
    if (!root || !ENDICT) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (n) { var t = enTr(n.data); if (t != null) { var lead = /^\s*/.exec(n.data)[0], trail = /\s*$/.exec(n.data)[0]; if (n.data !== lead + t + trail) n.data = lead + t + trail; } });
    Array.prototype.forEach.call(root.querySelectorAll ? root.querySelectorAll("[title],[placeholder]") : [], function (el) { ["title", "placeholder"].forEach(function (a) { var v = el.getAttribute(a), t = v && enTr(v); if (t != null && t !== v) el.setAttribute(a, t); }); });
  }
  function enWatch(ov) {
    if (!needOwnEn() || !window.MutationObserver) return;
    loadEnDict(function () {
      enWalk(ov);
      var tm = 0, mo = new MutationObserver(function () { if (!tm) tm = setTimeout(function () { tm = 0; mo.disconnect(); enWalk(ov); mo.observe(ov, { childList: true, subtree: true, characterData: true }); }, 30); });
      mo.observe(ov, { childList: true, subtree: true, characterData: true });
    });
  }
  function d3on() { try { return localStorage.getItem("kt.3d") !== "0"; } catch (e) { return true; } }
  function d3set(v) { try { localStorage.setItem("kt.3d", v ? "1" : "0"); } catch (e) {} }

  var LV = [[1, "Oson"], [2, "O'rta"], [3, "Murakkab"], [0, "Aralash (oson→murakkab)"]];
  var CNT = [10, 20, 30, 40, 50];
  var TPQ = [[1, "1 daq"], [2, "2 daq"], [4, "4 daq"], [6, "6 daq"], [0, "Vaqtsiz"]];

  /* ---------- Ovoz (WebAudio, fayl kerak emas) ---------- */
  var Snd = (function () {
    var ctx = null;
    function on() { try { return localStorage.getItem("kt.snd") !== "0"; } catch (e) { return true; } }
    function set(v) { try { localStorage.setItem("kt.snd", v ? "1" : "0"); } catch (e) {} }
    function ac() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } } if (ctx && ctx.state === "suspended") ctx.resume(); return ctx; }
    function tone(f, t0, d, type, g) {
      var c = ac(); if (!c) return;
      var o = c.createOscillator(), v = c.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(f, c.currentTime + t0);
      v.gain.setValueAtTime(0.0001, c.currentTime + t0);
      v.gain.exponentialRampToValueAtTime(g || 0.25, c.currentTime + t0 + 0.02);
      v.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + d);
      o.connect(v); v.connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + d + 0.05);
    }
    return {
      on: on, set: set,
      ok: function () { if (!on()) return; tone(660, 0, 0.12); tone(880, 0.12, 0.16); tone(1320, 0.28, 0.22); },
      bad: function () { if (!on()) return; tone(220, 0, 0.22, "square", 0.12); tone(160, 0.2, 0.3, "square", 0.12); },
      tick: function () { if (!on()) return; tone(1000, 0, 0.05, "sine", 0.08); },
      done: function () { if (!on()) return; [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.13, 0.25); }); },
      unlock: ac
    };
  })();

  /* ---------- Holatni saqlash (brauzer yopilsa ham davom etadi) ---------- */
  var SKEY = "kt.state";
  function saveState(st) { try { localStorage.setItem(SKEY, JSON.stringify(st)); } catch (e) {} }
  function loadState() { try { return JSON.parse(localStorage.getItem(SKEY) || "null"); } catch (e) { return null; } }
  function clearState() { try { localStorage.removeItem(SKEY); } catch (e) {} }
  function topicTitle(id) { var h = $("#" + id + " h2"); if (h) return h.textContent.replace(/^\s*\d+\.\s*/, "").trim(); try { var t = window.kaSavol && window.kaSavol.title(id); if (t && t !== id) return t; } catch (e) {} return (window.KA_MAVZULAR || []).filter(function (m) { return m.id === id; }).map(function (m) { return m.n; })[0] || id; }
  function topicHref(id) { return (/mashqlar\.html$/.test(location.pathname) ? "" : "mashqlar.html") + "#" + id; }
  function lvName(l) { return l === 1 ? "Oson" : l === 2 ? "O'rta" : l === 3 ? "Murakkab" : "Aralash"; }

  /* ---------- Test o'ynash ---------- */
  function run(topicId, title, level, count, mode, opts) {
    opts = opts || {};
    var qs, rs = opts.resume || null;
    if (rs) qs = rs.qs;
    else if (opts.diag) {
      // Darajani aniqlash: 1 oson + 1 o'rta + 1 murakkab
      qs = [].concat(window.kaSavol.pack(topicId, 1, 1), window.kaSavol.pack(topicId, 2, 1), window.kaSavol.pack(topicId, 3, 1));
    } else qs = window.kaSavol.pack(topicId, level, count);
    if (!qs.length) return;
    count = qs.length;
    var count0 = opts.count0 || count || 20;
    var perQ = opts.perQ == null ? 4 : +opts.perQ;            // daqiqa / 1 savol (0 = vaqtsiz)
    var limit = perQ > 0 ? Math.round(perQ * 60 * count) : 0;  // umumiy soniya
    var i = 0, ok = 0, wrong = [], t0 = Date.now(), timer, autoT = null, cdT = 0, answered = false;
    var WRONG_WAIT = 9; // xato javobdan keyin tushuntirishni o'qish uchun soniya
    if (rs) { i = rs.i; ok = rs.ok; wrong = rs.wrong || []; t0 = Date.now() - (rs.elapsed || 0) * 1000; perQ = rs.perQ; limit = perQ > 0 ? Math.round(perQ * 60 * count) : 0; }
    function persist() {
      if (opts.diag) return;
      saveState({ topicId: topicId, title: title, level: level, count: count, mode: mode, perQ: perQ, qs: qs, i: i, ok: ok, wrong: wrong, elapsed: Math.round((Date.now() - t0) / 1000), d: Date.now() });
    }
    Snd.unlock();

    var ov = el("div", { class: "kt-ov" });
    ov.innerHTML =
      '<div class="kt-top"><b></b><span class="kt-pill n">1/' + count + '</span><span class="kt-pill">✔ 0</span>' +
      '<span class="kt-pill t">' + (limit ? "⏳ " + mmss(limit) : "0:00") + '</span>' +
      '<button class="kt-snd" data-a="snd" type="button" title="Ovoz">' + (Snd.on() ? "🔊" : "🔇") + '</button>' +
      '<button class="kt-snd" data-a="d3" type="button" title="3D" aria-pressed="false">🧊 3D</button>' +
      ((opts.desmos || (opts.desmos !== false && /^sat/.test(topicId))) ? '<button class="kt-snd" data-a="desmos" type="button" title="Desmos grafik kalkulyator (SAT\'da ruxsat etilgan)">🧮 Desmos</button>' : "") +
      '<button class="kt-b" data-a="quit" type="button">✕</button></div>' +
      '<div class="kt-bar"><i></i></div><div class="kt-main"></div><div class="kt-bot"></div>';
    $(".kt-top b", ov).textContent = (opts.diag ? "🎯 Darajani aniqlash — " : "") + title;
    var main = $(".kt-main", ov), bot = $(".kt-bot", ov), bar = $(".kt-bar i", ov);
    var pN = $(".kt-pill.n", ov), pOk = $$(".kt-pill", ov)[1], pT = $(".kt-pill.t", ov);
    document.body.appendChild(ov);
    document.documentElement.style.overflow = "hidden";
    timer = setInterval(function () {
      var sec = Math.round((Date.now() - t0) / 1000);
      if (limit) {
        var left = limit - sec;
        if (left <= 0) { pT.textContent = "⏳ 0:00"; return timeUp(); }
        pT.textContent = "⏳ " + mmss(left);
        pT.classList.toggle("warn", left <= 30);
        if (left <= 10) Snd.tick();
      } else pT.textContent = mmss(sec);
    }, 1000);
    $('[data-a="snd"]', ov).onclick = function () { Snd.set(!Snd.on()); this.textContent = Snd.on() ? "🔊" : "🔇"; if (Snd.on()) Snd.ok(); };
    curEn = enMode(topicId);
    var d3b = $('[data-a="d3"]', ov);
    function paint3d() { var on = d3on(); ov.classList.toggle("d3", on); d3b.setAttribute("aria-pressed", on ? "true" : "false"); d3b.style.color = on ? "#5ee6c7" : ""; d3b.style.borderColor = on ? "#5ee6c7" : ""; d3b.title = T("3D rejim"); }
    d3b.onclick = function () { d3set(!d3on()); paint3d(); };
    paint3d();
    enWatch(ov);

    function quit() { clearInterval(timer); clearTimeout(autoT); clearInterval(cdT); if (window.kaDesmos) window.kaDesmos.destroy(); ov.remove(); document.documentElement.style.overflow = ""; }
    var dBtn = $('[data-a="desmos"]', ov);
    if (dBtn) dBtn.onclick = function () {
      var go = function () { window.kaDesmos.toggle(ov).then(function () { ov.classList.toggle("kd-on", window.kaDesmos.isOpen()); }); };
      if (window.kaDesmos) return go();
      var sc = document.createElement("script"); sc.src = "ka-desmos.js"; sc.onload = go; sc.onerror = function () { dBtn.textContent = "Desmos yo\'q"; }; document.head.appendChild(sc);
    };
    // ✕ bosilsa holat saqlanib qoladi — keyin "Davom etish" chiqadi
    function timeUp() {
      if (i >= count) return;
      // javob berilmagan savollar xato hisoblanadi
      for (var k = i + (answered ? 1 : 0); k < count; k++) wrong.push({ p: qs[k], got: "— (vaqt tugadi)" });
      i = count; Snd.bad(); finish(true);
    }
    $('[data-a="quit"]', ov).onclick = function () {
      if (i < count) { if (!opts.diag) { persist(); quit(); showResume(); return; } if (!confirm("Darajani aniqlashni to'xtatasizmi?")) return; }
      quit();
    };
    window.addEventListener("beforeunload", function onUnload() { if (i < count) persist(); });

    function show() {
      clearTimeout(autoT); clearInterval(cdT); answered = false;
      if (i >= count) return finish();
      persist();
      var p = qs[i];
      pN.textContent = (i + 1) + "/" + count;
      bar.style.width = (i / count * 100) + "%";
      var lv = p.level || 2;
      var opts = null;
      if (mode === "variant") {
        var ws = (p.w || []).map(String).slice(0, 3);
        opts = shuffle([String(p.a)].concat(ws));
      }
      main.scrollTop = 0;
      main.innerHTML = '<span class="kt-lv l' + lv + '">' + (lv === 1 ? "Oson" : lv === 2 ? "O\'rta" : "Murakkab") + '</span>' +
        '<div class="kt-q">' + p.q + '</div>' +
        (opts ? '<div class="kt-opts">' + opts.map(function (o, j) {
          return '<button class="kt-opt" type="button" data-v="' + esc(o) + '"><span>' + "ABCD"[j] + '</span>' + fmt(esc(o)) + '</button>';
        }).join("") + '</div>'
          : '<div class="kt-inrow"><input type="text" autocomplete="off" spellcheck="false" placeholder="Javob: ' + esc(p.hint || "son") + '"><button class="kt-b go" data-a="ok" type="button">Tekshirish</button></div>') +
        '<div class="kt-fb"></div>';
      bot.innerHTML = "";
      var fb = $(".kt-fb", main);

      function answer(val, btn) {
        if (answered) return; answered = true;
        var good = same(val, p.a);
        if (good) { ok++; pOk.textContent = "✔ " + ok; Snd.ok(); } else { wrong.push({ p: p, got: val }); Snd.bad(); }
        persist();
        if (opts) {
          $$(".kt-opt", main).forEach(function (b) {
            b.disabled = true;
            if (same(b.dataset.v, p.a)) b.classList.add("ok");
            else if (b === btn) b.classList.add("bad");
          });
        } else {
          $("input", main).disabled = true; $('[data-a="ok"]', main).disabled = true;
        }
        fb.className = "kt-fb " + (good ? "ok" : "bad");
        fb.innerHTML = good ? T("✔ To'g'ri!") : T("✘ Noto'g'ri. To'g'ri javob: ") + "<b>" + fmt(esc(String(p.a))) + "</b>";
        if (!good) {
          var why = "";
          try { why = window.kaSavol && kaSavol.why ? kaSavol.why(p, val, curEn ? "en" : "uz") : ""; } catch (e) {}
          fb.innerHTML += '<div class="kt-why"><b>' + T("❓ Nima uchun xato?") + "</b> " + (opts || val ? T("Siz tanladingiz") + ": <b>" + fmt(esc(String(val))) + "</b>. " : "") + esc(why) +
            (p.steps ? '<div style="margin-top:6px;color:#c9d4ff">' + T("Yechim:") + '</div><ol class="kt-steps">' + p.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>" : "") + "</div>";
        }
        var nextLbl = T(i + 1 >= count ? "Natijani ko'rish →" : "Keyingi savol →");
        bot.innerHTML = '<button class="kt-b go" data-a="next" type="button">' + nextLbl + '<span class="kt-cd"></span></button>' +
          (good ? "" : '<button class="kt-b hold" data-a="hold" type="button">' + T("⏸️ To'xtat") + "</button>");
        var nx = function () { clearTimeout(autoT); clearInterval(cdT); i++; show(); };
        var nb = $('[data-a="next"]', bot), cd = $(".kt-cd", bot), hb = $('[data-a="hold"]', bot);
        nb.onclick = nx;
        nb.focus({ preventScroll: true });
        // to'g'ri — 1 soniyada keyingisiga; xato — qizil + sababi, o'qish uchun WRONG_WAIT soniya, keyin o'zi o'tadi
        var left = good ? 1 : WRONG_WAIT, end = Date.now() + left * 1000;
        var tick = function () {
          var l = Math.max(0, Math.ceil((end - Date.now()) / 1000));
          if (cd) cd.textContent = l;
          if (Date.now() >= end) nx();
        };
        if (good) { cd.style.display = "none"; autoT = setTimeout(nx, 1000); }
        else { tick(); cdT = setInterval(tick, 250); }
        if (hb) hb.onclick = function () {
          if (cdT) { clearInterval(cdT); cdT = 0; left = Math.max(0, end - Date.now()); cd.textContent = "⏸"; hb.textContent = T("▶ Davom"); }
          else { end = Date.now() + Math.max(2000, left); hb.textContent = T("⏸️ To'xtat"); tick(); cdT = setInterval(tick, 250); }
        };
      }

      if (opts) $$(".kt-opt", main).forEach(function (b) { b.onclick = function () { answer(b.dataset.v, b); }; });
      else {
        var inp = $("input", main);
        var go = function () { if (inp.value.trim()) answer(inp.value, null); };
        $('[data-a="ok"]', main).onclick = go;
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
        inp.focus();
      }
    }

    function weakReport() {
      // qaysi bo'limlarni mustahkamlash kerak: mavzu va daraja bo'yicha xatolar
      var byT = {}, byL = { 1: [0, 0], 2: [0, 0], 3: [0, 0] };
      qs.forEach(function (q) { var L = q.level || 2; byL[L][1]++; var t = q.topic || topicId; byT[t] = byT[t] || { n: 0, w: 0, lv: { 1: 0, 2: 0, 3: 0 } }; byT[t].n++; });
      wrong.forEach(function (w) { var L = w.p.level || 2; byL[L][0]++; var t = w.p.topic || topicId; byT[t].w++; byT[t].lv[L]++; });
      var lvHtml = '<div class="kt-lvbar">' + [1, 2, 3].map(function (L) {
        if (!byL[L][1]) return ""; var r = byL[L][0] / byL[L][1];
        return '<span class="' + (r >= 0.5 ? "bad" : r === 0 ? "good" : "") + '">' + lvName(L) + ": " + (byL[L][1] - byL[L][0]) + "/" + byL[L][1] + "</span>";
      }).join("") + "</div>";
      var items = Object.keys(byT).filter(function (t) { return byT[t].w > 0; }).sort(function (a, b) { return byT[b].w - byT[a].w; });
      var advice = [];
      if (!wrong.length) advice.push("Hammasi to'g'ri — bu mavzu mustahkam. Keyingi darajaga yoki keyingi mavzuga o'ting.");
      else {
        var hardR = byL[3][1] ? byL[3][0] / byL[3][1] : 0, midR = byL[2][1] ? byL[2][0] / byL[2][1] : 0, easyR = byL[1][1] ? byL[1][0] / byL[1][1] : 0;
        if (easyR >= 0.4) advice.push("Oson savollarda ham xato bor — avval mavzuning <b>xossalari va namunaviy yechimlarini</b> qayta o'qing, so'ng «Oson» testni 10 ta savol bilan takrorlang.");
        else if (midR >= 0.4) advice.push("Asos bor, lekin <b>o'rta</b> darajadagi misollar qiyinchilik tug'diryapti — «O'rta» testni 20 ta savol bilan qayta ishlang.");
        else if (hardR >= 0.4) advice.push("<b>Murakkab</b> misollar — mustahkamlash kerak bo'lgan asosiy joy. Xatolar tahlilidagi yechim qadamlarini daftarga ko'chirib chiqing.");
        else advice.push("Xatolar kam va tarqoq — xatolar tahlilini ko'rib, «Yangi variant» bilan bir marta takrorlang.");
      }
      var html = '<div class="kt-weak"><h5>📌 Nimani mustahkamlash kerak</h5>' + lvHtml + '<div class="w" style="border-left-color:#7c9bff">' + advice.join(" ") + "</div>";
      items.forEach(function (t) {
        var o = byT[t], lvs = [1, 2, 3].filter(function (L) { return o.lv[L]; }).map(function (L) { return lvName(L) + " " + o.lv[L]; }).join(" · ");
        var tt = topicTitle(t);
        if (curEn) { var tx = window.kaTil && kaTil.t ? kaTil.t(tt) : tt; tt = tx !== tt ? tx : title; } // SAT: o'zbekcha mavzu nomi o'rniga test nomi
        html += '<div class="w"><b>' + esc(tt) + "</b> — " + o.w + "/" + o.n + " xato (" + lvs + ")" +
          '<div class="acts"><a href="' + topicHref(t) + '" data-a="goto">📖 Xossalarni o\'qish</a><button type="button" data-a="easy" data-t="' + t + '">🟢 Oson test (10 ta)</button>' +
          (window.KA_OYINLAR ? '<a href="mashqlar.html#' + t + '" data-a="goto">🎮 Mos o\'yinlar</a>' : "") + "</div></div>";
      });
      return html + (items.length ? "" : '<div class="ok">🎉 Hech qaysi bo\'limda xato yo\'q.</div>') + "</div>";
    }
    function finish(timedOut) {
      clearInterval(timer); clearTimeout(autoT);
      clearState();
      bar.style.width = "100%";
      var sec = Math.round((Date.now() - t0) / 1000), pc = Math.round(ok / count * 100);
      if (!timedOut) Snd.done();
      if (opts.diag) {
        // 3 savol: oson/o'rta/murakkab — qaysi darajagacha to'g'ri?
        var r = qs.map(function (q) { return wrong.every(function (w) { return w.p !== q; }); }); // [oson, o'rta, murakkab]
        var lvl = r[2] && r[1] ? 3 : r[1] || (r[0] && r[2]) ? 2 : 1;
        var lvlName = lvl === 3 ? "Murakkab" : lvl === 2 ? "O'rta" : "Oson";
        var msg = lvl === 3 ? "Ajoyib! Siz murakkab darajadasiz — <b>Murakkab</b> testdan boshlang." :
                  lvl === 2 ? "Yaxshi. Asos bor, murakkab misollarda qiynalyapsiz — <b>O'rta</b> testdan boshlang." :
                  "Avval mavzuning xossalari va namunaviy yechimlarini ko'rib chiqing — <b>Oson</b> testdan boshlang.";
        main.innerHTML = '<div class="kt-res"><div class="kt-sub">Darajani aniqlash natijasi</div><div class="kt-big' + (lvl === 3 ? "" : lvl === 2 ? " mid" : " low") + '">' + lvlName + '</div>' +
          '<div class="kt-sub">Oson: ' + (r[0] ? "✔" : "✘") + " · O'rta: " + (r[1] ? "✔" : "✘") + " · Murakkab: " + (r[2] ? "✔" : "✘") + '</div><div class="kt-diag">' + msg + "</div></div>" +
          (wrong.length ? '<div class="kt-rev"><h5>Xatolar (' + wrong.length + ' ta)</h5><ul style="padding:0;margin:0">' + wrong.map(function (w) {
            return "<li>" + w.p.q + "<br>Sizning javobingiz: <i>" + fmt(esc(String(w.got))) + "</i> · To'g'ri: <b>" + fmt(esc(String(w.p.a))) + "</b>" +
              (w.p.steps ? '<ol class="kt-steps">' + w.p.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>" : "") + "</li>"; }).join("") + "</ul></div>" : "");
        bot.innerHTML = '<button class="kt-b go" data-a="go" type="button">▶ ' + lvlName + ' testni boshlash (' + count0 + ' ta)</button><button class="kt-b" data-a="close" type="button">Yopish</button>';
        $('[data-a="go"]', bot).onclick = function () { quit(); if (opts.onLevel) opts.onLevel(lvl); run(topicId, title, lvl, count0, mode, { perQ: perQ, onLevel: opts.onLevel }); };
        $('[data-a="close"]', bot).onclick = function () { quit(); if (opts.onLevel) opts.onLevel(lvl); };
        try { localStorage.setItem("kt.lvl." + topicId, String(lvl)); } catch (e) {}
        return;
      }
      var cls = pc >= 80 ? "" : pc >= 50 ? " mid" : " low";
      var baho = pc >= 90 ? "5 (a'lo)" : pc >= 75 ? "4 (yaxshi)" : pc >= 60 ? "3 (qoniqarli)" : "2 (yana mashq qiling)";
      main.innerHTML = '<div class="kt-res"><div class="kt-sub">' + (timedOut ? "⏳ Vaqt tugadi — natija" : "Natija") + '</div><div class="kt-big' + cls + '">' + pc + '%</div>' +
        '<div class="kt-sub">' + ok + ' / ' + count + " to'g'ri · vaqt " + mmss(sec) + " · baho: <b>" + baho + "</b></div></div>" +
        weakReport() +
        (wrong.length ? '<div class="kt-rev"><h5>Xatolar tahlili (' + wrong.length + ' ta)</h5><ul style="padding:0;margin:0">' +
          wrong.map(function (w) {
            return "<li>" + w.p.q + "<br>Sizning javobingiz: <i>" + fmt(esc(String(w.got))) + "</i> · To'g'ri: <b>" + fmt(esc(String(w.p.a))) + "</b>" +
              (w.p.steps ? '<ol class="kt-steps">' + w.p.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>" : "") + "</li>";
          }).join("") + "</ul></div>" : '<div class="kt-res kt-sub">🎉 Birorta ham xato yo\'q — ajoyib!</div>');
      $$('[data-a="goto"]', main).forEach(function (a) { a.onclick = function () { quit(); }; });
      $$('[data-a="easy"]', main).forEach(function (b) { b.onclick = function () { var t = b.dataset.t; quit(); run(t, topicTitle(t), 1, 10, mode, { perQ: perQ }); }; });
      bot.innerHTML = '<button class="kt-b go" data-a="again" type="button">🔄 Yangi variant</button><button class="kt-b" data-a="close" type="button">Yopish</button>';
      $('[data-a="again"]', bot).onclick = function () { quit(); run(topicId, title, level, count, mode, opts); };
      $('[data-a="close"]', bot).onclick = quit;
      try {
        var key = "kt.best." + topicId + "." + level + "." + count;
        var best = +(localStorage.getItem(key) || 0);
        if (pc > best) localStorage.setItem(key, pc);
        localStorage.setItem("kt.last." + topicId, JSON.stringify({ pc: pc, ok: ok, n: count, t: sec, d: Date.now(), level: level }));
        var hist = JSON.parse(localStorage.getItem("kt.hist") || "[]");
        hist.unshift({ topic: topicId, title: title, pc: pc, ok: ok, n: count, level: level, t: sec, d: Date.now(), weak: wrong.slice(0, 30).map(function (w) { return { t: w.p.topic || topicId, l: w.p.level || 2 }; }) });
        localStorage.setItem("kt.hist", JSON.stringify(hist.slice(0, 100)));
      } catch (e) {}
      try { if (window.kaAccount) { window.kaAccount.addCoins(Math.round(ok / 2), "Test: " + title); window.kaAccount.sendResult("Test: " + title + " (" + count + " ta)", ok, count); } } catch (e) {}
      document.dispatchEvent(new CustomEvent("ka:test-done", { detail: { topic: topicId, pc: pc, ok: ok, n: count } }));
    }
    show();
  }
  function showResume() {
    var st = loadState(); if (!st || !st.qs || st.i >= st.count) { clearState(); return; }
    var old = $(".kt-resume"); if (old) old.remove();
    var box = el("div", { class: "kt-resume" });
    box.innerHTML = "⏸ Tugallanmagan test: <b>" + esc(st.title) + "</b> — " + st.i + "/" + st.count + " savol, " + st.ok + " ✔" +
      '<button class="kt-b go" type="button" data-a="cont">▶ Davom etish</button><button class="kt-b" type="button" data-a="drop">Bekor</button>';
    $('[data-a="cont"]', box).onclick = function () { box.remove(); run(st.topicId, st.title, st.level, st.count, st.mode, { perQ: st.perQ, resume: st }); };
    $('[data-a="drop"]', box).onclick = function () { clearState(); box.remove(); };
    document.body.appendChild(box);
  }
  window.kaTest = { run: run, same: same, resume: showResume };

  /* ---------- Panelni mavzularga qo'shish ---------- */
  function panel(sec, title) {
    var id = sec.id, level = 0, count = 20, mode = "variant", perQ = 4;
    try { var sl = +localStorage.getItem("kt.lvl." + id); if (sl >= 1 && sl <= 3) level = sl; } catch (e) {}
    var box = el("div", { class: "kt-box" });
    box.innerHTML = '<h4>📝 Mavzu testi</h4>' +
      '<div class="kt-grp"><button class="kt-b diag" type="button" data-a="diag">🎯 Darajani aniqlash (3 savol: oson · o\'rta · murakkab)</button><span class="kt-diag-res" style="min-width:0;text-transform:none;letter-spacing:0"></span></div>' +
      '<div class="kt-grp"><span>Daraja</span>' + LV.map(function (l) { return '<button class="kt-b" type="button" data-k="l" data-v="' + l[0] + '">' + l[1] + '</button>'; }).join("") + '</div>' +
      '<div class="kt-grp"><span>Savollar</span>' + CNT.map(function (c) { return '<button class="kt-b" type="button" data-k="c" data-v="' + c + '">' + c + ' ta</button>'; }).join("") +
        '<input class="kt-in" type="number" min="3" max="200" placeholder="o\'zim" data-k="cin" title="O\'zingiz kiriting (3–200)"></div>' +
      '<div class="kt-grp"><span>Vaqt / savol</span>' + TPQ.map(function (t) { return '<button class="kt-b" type="button" data-k="t" data-v="' + t[0] + '">' + t[1] + '</button>'; }).join("") +
        '<input class="kt-in" type="number" min="0.5" max="30" step="0.5" placeholder="daq" data-k="tin" title="Bir savolga necha daqiqa"></div>' +
      '<div class="kt-grp"><span>Rejim</span><button class="kt-b" type="button" data-k="m" data-v="variant">Variantli (A–D)</button><button class="kt-b" type="button" data-k="m" data-v="yoz">Javobni yozish</button></div>' +
      '<div class="kt-grp"><button class="kt-b go" type="button" data-a="start">▶ Testni boshlash</button>' +
      '<button class="kt-b" type="button" data-a="oyin">🎮 Kamerali qo\'l o\'yini</button>' +
      '<button class="kt-b" type="button" data-a="aqlli">🧠 Aqlli kontrol (ovoz · ko\'z · barmoq · puflash)</button>' +
      '<button class="kt-b" type="button" data-a="chiz">✍️ Qo\'l bilan chizish</button></div>' +
      '<div class="kt-note">Savollar har safar qaytadan tuziladi. To\'g\'ri javob — 🔊 ovoz va avtomatik keyingi savol; xato bo\'lsa — boshqa ovoz, yechim ko\'rsatiladi, «Keyingi savol»ni bosasiz. Vaqt tugasa test o\'zi yakunlanadi.</div>' +
      '<div class="kt-note kt-tot"></div><div class="kt-last"></div>';
    function sync() {
      $$('button[data-k]', box).forEach(function (b) {
        var v = b.dataset.v, on = (b.dataset.k === "l" && +v === level) || (b.dataset.k === "c" && +v === count) || (b.dataset.k === "m" && v === mode) || (b.dataset.k === "t" && +v === perQ);
        b.classList.toggle("on", !!on);
      });
      var tot = perQ > 0 ? Math.round(perQ * count) : 0;
      $(".kt-tot", box).textContent = tot ? "Jami vaqt: " + tot + " daqiqa" : "Vaqt chegarasi yo'q";
    }
    $$('button[data-k]', box).forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.k === "l") level = +b.dataset.v;
        else if (b.dataset.k === "c") { count = +b.dataset.v; $('[data-k="cin"]', box).value = ""; }
        else if (b.dataset.k === "t") { perQ = +b.dataset.v; $('[data-k="tin"]', box).value = ""; }
        else mode = b.dataset.v;
        sync();
      };
    });
    $('[data-k="cin"]', box).oninput = function () { var v = parseInt(this.value, 10); if (v >= 3 && v <= 200) count = v; sync(); };
    $('[data-k="tin"]', box).oninput = function () { var v = parseFloat(this.value); if (v >= 0.5 && v <= 30) perQ = v; sync(); };
    var diagRes = $(".kt-diag-res", box);
    function showLvl(l) { diagRes.textContent = l ? "Sizning darajangiz: " + (l === 3 ? "Murakkab" : l === 2 ? "O'rta" : "Oson") : ""; }
    showLvl(level);
    sync();
    $('[data-a="diag"]', box).onclick = function () { run(id, title, 0, 3, mode, { diag: true, perQ: perQ, count0: count, onLevel: function (l) { level = l; showLvl(l); sync(); } }); };
    $('[data-a="start"]', box).onclick = function () { run(id, title, level, count, mode, { perQ: perQ }); };
    $('[data-a="oyin"]', box).onclick = function () { location.href = "mavzu-oyin.html?mavzu=" + encodeURIComponent(id) + "&daraja=" + level; };
    $('[data-a="aqlli"]', box).onclick = function () { location.href = "aqlli-oyin.html?mavzu=" + encodeURIComponent(id) + "&daraja=" + level; };
    $('[data-a="chiz"]', box).onclick = function () { location.href = "mavzu-chizish.html?mavzu=" + encodeURIComponent(id); };
    $(".kt-note", box).innerHTML += " Savol turi kam bo'lgan mavzularda 100 ta tanlansa, yondosh mavzulardan ham savol qo'shiladi.";
    try {
      var last = JSON.parse(localStorage.getItem("kt.last." + id) || "null");
      if (last) {
        var dt = new Date(last.d);
        $(".kt-last", box).innerHTML = "Oxirgi natija: <b>" + last.pc + "%</b> (" + last.ok + "/" + last.n + (last.level ? ", " + lvName(last.level) : "") + ") · " +
          dt.getDate() + "." + (dt.getMonth() + 1) + "." + dt.getFullYear();
        var hist = JSON.parse(localStorage.getItem("kt.hist") || "[]").filter(function (h) { return h.topic === id; }).slice(0, 5);
        if (hist.length > 1) $(".kt-last", box).innerHTML += " · Tarix: " + hist.map(function (h) { return h.pc + "%"; }).join(" → ");
      }
    } catch (e) {}
    return box;
  }

  function init() {
    if (!window.kaSavol) return;
    $$("main > section.topic").forEach(function (sec) {
      if (!window.kaSavol.has(sec.id)) return;
      var h = $("h2", sec), title = h ? h.textContent.replace(/^\s*\d+\.\s*/, "").trim() : sec.id;
      var body = $(".topic-body", sec) || sec;
      body.insertBefore(panel(sec, title), $(".ka-topicnav", body) || null);
    });
  }
  function init2() { init(); setTimeout(showResume, 600); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init2); else init2();
})();
