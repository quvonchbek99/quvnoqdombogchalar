/*! Kuvonch Academy — mavzu slaydlari (har bir mavzu uchun avtomatik).
 *  mashqlar.html dagi mavzu bo'limidan (xossa → formula → namunaviy yechim → mashqlar) slaydlar yasaydi,
 *  oxirida generatorlardan 3 ta tezkor savol. Boshqarish: ← → / Space, telefonda surish, 🧊 3D, ☀ yorug' rejim, ⛶.
 *  Ochish: mavzudagi «📽 Slayd» tugmasi yoki havola: mashqlar.html?slayd=t1 */
(function () {
  "use strict";
  if (window.kaSlayd) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  var css = "" +
    ".ks-ov{position:fixed;inset:0;z-index:99990;display:flex;flex-direction:column;background:radial-gradient(circle at 50% -10%,#1b2750,#070c17 65%);color:#eef2ff;font:16px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow:hidden;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}" +
    ".ks-ov.light{background:#f6f8fc;color:#0b1220}" +
    ".ks-top{display:flex;align-items:center;gap:8px;padding:8px 12px;flex:none}" +
    ".ks-top b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:15px}" +
    ".ks-top button,.ks-nav button{min-width:42px;min-height:40px;border-radius:10px;border:1px solid rgba(127,140,180,.35);background:rgba(127,140,180,.12);color:inherit;font:700 15px/1 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;cursor:pointer;padding:0 10px;touch-action:manipulation}" +
    ".ks-top button[aria-pressed=true]{border-color:#5ee6c7;color:#5ee6c7}" +
    ".ks-bar{height:4px;background:rgba(127,140,180,.2);flex:none}.ks-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#7c9bff,#5ee6c7);transition:width .3s}" +
    ".ks-stage{flex:1;min-height:0;position:relative;perspective:1400px}" +
    ".ks-s{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:3vh 6vw;overflow:auto;backface-visibility:hidden;transition:transform .55s cubic-bezier(.3,.8,.3,1),opacity .45s}" +
    ".ks-s.off{opacity:0;pointer-events:none;transform:translateX(8%)}.ks-s.off.prev{transform:translateX(-8%)}" +
    ".ks-ov.d3 .ks-s{transform-origin:50% 50% -40vw}.ks-ov.d3 .ks-s.off{transform:rotateY(-70deg)}.ks-ov.d3 .ks-s.off.prev{transform:rotateY(70deg)}" +
    ".ks-ov.d3 .ks-card{box-shadow:0 10px 0 rgba(0,0,0,.25),0 28px 50px rgba(0,0,0,.45);transform:rotateX(4deg)}" +
    ".ks-k{font:800 clamp(12px,1.8vmin,16px)/1 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#5ee6c7;margin-bottom:1.4vh}" +
    ".ks-h{font:900 clamp(26px,5.4vmin,64px)/1.15 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;margin:0 0 2vh;max-width:22ch}" +
    ".ks-big{font:900 clamp(60px,16vmin,180px)/1 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;background:linear-gradient(135deg,#5ee6c7,#7c9bff);-webkit-background-clip:text;background-clip:text;color:transparent}" +
    ".ks-card{background:rgba(20,31,56,.92);border:1px solid #2f4174;border-radius:22px;padding:3vh 4vw;max-width:min(1100px,92vw);width:100%;transition:transform .4s}" +
    ".ks-ov.light .ks-card{background:#fff;border-color:#d5dcec;color:#0b1220}" +
    ".ks-f{font:800 clamp(22px,4.6vmin,56px)/1.35 'Cambria Math','Times New Roman',serif;color:#ffd479}.ks-ov.light .ks-f{color:#8a4b00}" +
    ".ks-q{font:700 clamp(19px,3.6vmin,40px)/1.4 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;margin-bottom:2vh}" +
    ".ks-lines{text-align:left;display:inline-block;font:600 clamp(18px,3.2vmin,36px)/1.6 'Cambria Math','Times New Roman',serif}" +
    ".ks-lines div{transition:opacity .35s,transform .35s}.ks-lines div.h{opacity:0;transform:translateY(12px)}" +
    ".ks-ol{text-align:left;font:600 clamp(17px,3vmin,32px)/1.6 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;margin:0;padding-left:1.4em}.ks-ol li{margin:.4em 0}" +
    ".ks-ul{text-align:left;font:700 clamp(17px,3vmin,30px)/1.5 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;margin:0;padding-left:1.2em}.ks-ul li{margin:.35em 0}" +
    ".ks-ops{display:grid;grid-template-columns:1fr 1fr;gap:1.6vmin;width:100%;max-width:1000px}" +
    ".ks-op{border:0;border-radius:16px;padding:2vh 2vw;font:800 clamp(18px,3.4vmin,38px)/1.2 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#fff;cursor:pointer;box-shadow:inset 0 -6px 0 rgba(0,0,0,.22);touch-action:manipulation}" +
    ".ks-op.ok{outline:5px solid #fff;outline-offset:-5px}.ks-op.no{opacity:.35}" +
    ".ks-hint{font-size:clamp(12px,1.7vmin,15px);color:#9fb0d0;margin-top:2vh}" +
    ".ks-nav{display:flex;align-items:center;justify-content:center;gap:10px;padding:8px 12px calc(8px + env(safe-area-inset-bottom));flex:none}" +
    ".ks-nav span{min-width:5em;text-align:center;font:800 14px/1 ui-monospace,monospace;color:#9fb0d0}" +
    ".ks-res{font-size:clamp(16px,2.6vmin,26px);color:inherit;font-weight:700}" +
    "@media (max-width:640px){.ks-ops{grid-template-columns:1fr}.ks-s{padding:2vh 5vw}}" +
    "@media (prefers-reduced-motion:reduce){.ks-s{transition:none}}" +
    ".ks-btn{display:inline-flex;align-items:center;gap:6px;margin-left:8px;padding:10px 16px;border-radius:12px;border:1px solid #7c9bff;background:rgba(124,155,255,.14);color:#eef2ff;font:700 14px/1 -apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;cursor:pointer}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var COL = ["#e5484d", "#2f6fe4", "#c98a00", "#2a9d4b"];

  // Mavzu bo'limidan slaydlar ro'yxati
  function build(sec, id) {
    var h2 = $("h2", sec), num = ((h2 && $(".t-num", h2)) || {}).textContent || "", title = h2 ? h2.textContent.replace(num, "").trim() : id;
    var S = [], xs = $$(".xossa", sec), formulas = [];
    S.push({ k: "Mavzu " + num.replace(/\.$/, ""), html: '<div class="ks-big">' + esc(num.replace(/\.$/, "") || "📘") + '</div><h1 class="ks-h">' + esc(title) + '</h1><div class="ks-hint">Kuvonch Academy · ' + xs.length + " ta xossa · namunaviy yechimlar · tezkor test</div>" });
    if (xs.length > 1) S.push({ k: "Reja", html: '<h2 class="ks-h">Dars rejasi</h2><div class="ks-card"><ol class="ks-ol">' + xs.map(function (x) { return "<li>" + ($("h3", x) ? $("h3", x).innerHTML : "") + "</li>"; }).join("") + "<li>Tezkor test</li></ol></div>" });
    xs.forEach(function (x, i) {
      var h3 = $("h3", x), f = $(".formula", x), nm = $(".namunaviy", x), q = nm && $(".savol", nm), y = nm && $(".yechim", nm), ol = $(".mashqlar", x);
      var head = h3 ? h3.innerHTML : "Xossa " + (i + 1);
      if (f) formulas.push({ h: head, f: f.innerHTML });
      S.push({ k: "Xossa " + (i + 1), html: '<h2 class="ks-h">' + head + '</h2>' + (f ? '<div class="ks-card"><div class="ks-f">' + f.innerHTML + "</div></div>" : "") });
      if (q || y) {
        var lines = y ? y.innerHTML.split(/\n|<br\s*\/?>/i).map(function (l) { return l.trim(); }).filter(Boolean) : [];
        S.push({ k: "Namunaviy yechim", steps: lines.length, html: '<div class="ks-card"><div class="ks-q">' + (q ? q.innerHTML : "") + '</div><div class="ks-lines">' + lines.map(function (l) { return '<div class="h">' + l + "</div>"; }).join("") + "</div></div>" +
          (lines.length ? '<div class="ks-hint">▶ / Space — keyingi qadam</div>' : "") });
      }
      if (ol && $$("li", ol).length) S.push({ k: "Mustaqil ishlang", html: '<h2 class="ks-h">✍️ Mustaqil ishlang</h2><div class="ks-card"><ol class="ks-ol" start="' + (ol.getAttribute("start") || 1) + '">' + $$("li", ol).map(function (li) { return "<li>" + li.innerHTML + "</li>"; }).join("") + "</ol></div>" });
    });
    // Tezkor test — generatordan 3 ta savol (oson → murakkab)
    try {
      if (window.kaSavol && kaSavol.has(id)) kaSavol.pack(id, 0, 3).forEach(function (p, i) {
        var opts = shuffle([String(p.a)].concat((p.w || []).map(String).slice(0, 3)));
        S.push({ k: "Tezkor test " + (i + 1) + "/3", quiz: { a: String(p.a), steps: p.steps || [] }, html: '<div class="ks-card" style="margin-bottom:2vh"><div class="ks-q" style="margin:0">' + p.q + '</div></div><div class="ks-ops">' +
          opts.map(function (o, j) { return '<button type="button" class="ks-op" data-v="' + esc(o) + '" style="background:' + COL[j] + '">' + "▲◆●■"[j] + " " + esc(o) + "</button>"; }).join("") + '</div><div class="ks-hint ks-res"></div>' });
      });
    } catch (e) {}
    if (formulas.length) S.push({ k: "Xulosa", html: '<h2 class="ks-h">📌 Eslab qoling</h2><div class="ks-card"><ul class="ks-ul">' + formulas.map(function (o) { return '<li><span style="color:#9fb0d0">' + o.h.replace(/<[^>]+>/g, "") + ':</span><br><span class="ks-f" style="font-size:clamp(16px,2.6vmin,28px)">' + o.f + "</span></li>"; }).join("") + "</ul></div>" });
    S.push({ k: "Yakun", html: '<div class="ks-big">🎉</div><h2 class="ks-h">' + esc(title) + '</h2><div class="ks-hint">Endi o\'zingizni sinab ko\'ring</div><div style="margin-top:2vh;display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
      (window.kaTest || window.openTest ? '<button type="button" class="ks-btn" data-ks="test">📝 Test topshirish</button>' : "") + '<button type="button" class="ks-btn" data-ks="again">🔁 Boshidan</button></div>' });
    return { title: (num ? num + " " : "") + title, S: S };
  }

  var cur = null;
  function open(id) {
    var sec = document.getElementById(id);
    if (!sec || !sec.classList.contains("topic")) return false;
    if (window.kaSavol && kaSavol.ready) { try { kaSavol.ready(); } catch (e) {} }
    var D = build(sec, id), i = 0, frag = 0;
    var ov = document.createElement("div"); ov.className = "ks-ov" + (ls("ks.3d") === "0" ? "" : " d3") + (ls("ks.light") === "1" ? " light" : "");
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Slaydlar: " + D.title);
    ov.innerHTML = '<div class="ks-top"><b></b><button type="button" data-ks="d3" title="3D o\'tish">🧊</button><button type="button" data-ks="light" title="Yorug\' / qorong\'i">☀</button><button type="button" data-ks="full" title="To\'liq ekran">⛶</button><button type="button" data-ks="close" title="Yopish">✕</button></div>' +
      '<div class="ks-bar"><i></i></div><div class="ks-stage">' + D.S.map(function (s, k) { return '<section class="ks-s off" data-i="' + k + '"><div class="ks-k">' + esc(s.k) + "</div>" + s.html + "</section>"; }).join("") + "</div>" +
      '<div class="ks-nav"><button type="button" data-ks="prev" aria-label="Oldingi">◀</button><span class="ks-n"></span><button type="button" data-ks="next" aria-label="Keyingi">▶</button></div>';
    $(".ks-top b", ov).textContent = "📽 " + D.title;
    document.body.appendChild(ov); document.documentElement.style.overflow = "hidden";
    var slides = $$(".ks-s", ov), bar = $(".ks-bar i", ov), n = $(".ks-n", ov);
    var full = $('[data-ks="full"]', ov), el = document.documentElement;
    if (!(el.requestFullscreen || el.webkitRequestFullscreen)) full.style.display = "none";
    function paintBtns() { $('[data-ks="d3"]', ov).setAttribute("aria-pressed", ov.classList.contains("d3")); $('[data-ks="light"]', ov).textContent = ov.classList.contains("light") ? "🌙" : "☀"; }
    function show(k, dir) {
      i = Math.max(0, Math.min(slides.length - 1, k)); frag = 0;
      slides.forEach(function (s, j) { s.classList.toggle("off", j !== i); s.classList.toggle("prev", j < i); s.setAttribute("aria-hidden", j !== i); });
      $$(".ks-lines div", slides[i]).forEach(function (d) { d.classList.add("h"); });
      bar.style.width = ((i + 1) / slides.length * 100) + "%"; n.textContent = (i + 1) + " / " + slides.length;
      slides[i].scrollTop = 0;
    }
    function next() {
      var hid = $$(".ks-lines div.h", slides[i]);
      if (hid.length) { hid[0].classList.remove("h"); return; } // avval yechim qadamlari birma-bir
      if (i < slides.length - 1) show(i + 1, 1);
    }
    function prev() { if (i > 0) show(i - 1, -1); }
    function close() { document.removeEventListener("keydown", key, true); try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {} ov.remove(); document.documentElement.style.overflow = ""; cur = null; }
    function key(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown" || e.key === "Enter") { e.preventDefault(); e.stopPropagation(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); e.stopPropagation(); prev(); }
      else if (e.key === "Escape") { e.stopPropagation(); close(); }
      else if (e.key === "f" || e.key === "F") full.click();
    }
    document.addEventListener("keydown", key, true);
    ov.addEventListener("click", function (e) {
      var b = e.target.closest("[data-ks]"), op = e.target.closest(".ks-op");
      if (op) { // tezkor test javobi
        var sl = op.closest(".ks-s"), q = D.S[+sl.dataset.i].quiz; if (!q || sl.dataset.done) return; sl.dataset.done = 1;
        var good = op.dataset.v === q.a;
        $$(".ks-op", sl).forEach(function (o) { o.classList.add(o.dataset.v === q.a ? "ok" : "no"); });
        if (!good) op.classList.remove("no");
        $(".ks-res", sl).innerHTML = (good ? "✅ To'g'ri!" : "❌ To'g'ri javob: <b>" + esc(q.a) + "</b>") + (q.steps.length ? '<div style="margin-top:6px;font-size:clamp(14px,2.2vmin,22px)">' + q.steps.join(" → ") + "</div>" : "");
        return;
      }
      if (!b) return;
      var a = b.dataset.ks;
      if (a === "next") next(); else if (a === "prev") prev(); else if (a === "close") close(); else if (a === "again") show(0);
      else if (a === "d3") { ov.classList.toggle("d3"); ls("ks.3d", ov.classList.contains("d3") ? "1" : "0"); paintBtns(); }
      else if (a === "light") { ov.classList.toggle("light"); ls("ks.light", ov.classList.contains("light") ? "1" : "0"); paintBtns(); }
      else if (a === "full") { try { if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document); else (el.requestFullscreen || el.webkitRequestFullscreen).call(el); } catch (x) {} }
      else if (a === "test") { close(); var tb = $(".test-start-btn", sec); if (tb) tb.click(); else if (window.openTest) window.openTest(id, D.title); }
    });
    // telefonda surish
    var sx = 0, sy = 0;
    $(".ks-stage", ov).addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    $(".ks-stage", ov).addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { if (dx < 0) next(); else prev(); }
    }, { passive: true });
    paintBtns(); show(0);
    cur = { next: next, prev: prev, close: close, count: slides.length, index: function () { return i; } };
    return true;
  }

  // Har bir mavzuga «📽 Slayd» tugmasi
  function addButtons() {
    $$("section.topic[id]").forEach(function (sec) {
      if ($(".ks-btn[data-open]", sec)) return;
      var b = document.createElement("button"); b.type = "button"; b.className = "ks-btn"; b.setAttribute("data-open", sec.id);
      b.innerHTML = "📽 Slayd";
      b.title = "Mavzu bo'yicha slaydlar (darsda proyektorga)";
      b.onclick = function () { open(sec.id); };
      var cta = $(".test-cta", sec);
      if (cta) cta.appendChild(b);
      else { var d = document.createElement("div"); d.className = "test-cta"; d.appendChild(b); var back = $(".back-top", sec); if (back) sec.insertBefore(d, back); else sec.appendChild(d); }
    });
  }
  function init() {
    addButtons();
    var m = /[?&]slayd=([a-z0-9]+)/i.exec(location.search);
    if (m) setTimeout(function () { open(m[1]); }, 300);
  }
  window.kaSlayd = { open: open, current: function () { return cur; } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
