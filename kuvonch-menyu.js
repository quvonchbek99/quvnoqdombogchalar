/*!
 * Kuvonch Academy — qulay navigatsiya + "Grafik chizish" taxtasi
 * Ulash: mashqlar.html faylida </body> dan oldin qo'shing:
 *   <script src="kuvonch-menyu.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaMenu) return;
  window.__kaMenu = true;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* ============================ CSS ============================ */
  var css = `
  :root{--ka-font:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;--ka-bg:var(--bg,#0b1220);--ka-card:var(--card,#141f38);--ka-soft:var(--bg-soft,#111a2e);--ka-border:var(--border,#243252);
    --ka-text:var(--text,#eef2ff);--ka-dim:var(--text-dim,#9fb0d0);--ka-acc:var(--accent,#5ee6c7);--ka-acc2:var(--accent-2,#7c9bff);--ka-bad:var(--bad,#ff8585)}
  html{scroll-behavior:smooth;scroll-padding-top:70px}
  /* Header: bitta qatorli, yopishqoq */
  .wrap>header.ka-sticky{position:sticky;top:0;z-index:900;background:rgba(11,18,32,.88);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
    border-bottom:1px solid var(--ka-border);margin-left:-20px;margin-right:-20px;padding-left:20px;padding-right:20px}
  @media (max-width:760px){
    .wrap>header.ka-sticky{display:flex;flex-wrap:nowrap!important;align-items:center;gap:10px;padding-top:8px;padding-bottom:8px}
    .wrap>header.ka-sticky nav{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto;gap:6px;scrollbar-width:none;-webkit-mask-image:linear-gradient(90deg,#000 85%,transparent);min-width:0;flex:1 1 auto}
    .wrap>header.ka-sticky nav::-webkit-scrollbar{display:none}
    .wrap>header.ka-sticky nav a{white-space:nowrap;flex:0 0 auto;margin-left:0!important;padding:6px 4px}
    .wrap>header.ka-sticky .brand{flex:0 0 auto}
    .wrap>header.ka-sticky .brand{font-size:0}
    .wrap>header.ka-sticky .brand .brand-badge{font-size:18px}
    .hero{padding-top:18px!important;padding-bottom:10px!important}
    .hero h1{font-size:26px!important}
    .hero .lead{font-size:14px!important}
  }
  /* Markaz (hub) */
  .ka-hub{background:var(--ka-card);border:1px solid var(--ka-border);border-radius:18px;padding:14px;margin:12px 0 18px}
  .ka-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
  .ka-tabs::-webkit-scrollbar{display:none}
  .ka-tab{flex:0 0 auto;border:1px solid var(--ka-border);background:var(--ka-soft);color:var(--ka-dim);padding:8px 12px;border-radius:999px;font:600 13px/1 var(--ka-font);cursor:pointer;white-space:nowrap}
  .ka-tab[aria-selected=true]{background:linear-gradient(135deg,#6a5af9,#8b5cf6);color:#fff;border-color:transparent}
  .ka-tab.ka-graph-tab{border-color:var(--ka-acc);color:var(--ka-acc)}
  .ka-search{display:flex;gap:8px;margin:10px 0 4px}
  .ka-search input{flex:1;min-width:0;background:var(--ka-bg);border:1px solid var(--ka-border);color:var(--ka-text);border-radius:12px;padding:10px 12px;font-size:15px;outline:none}
  .ka-search input:focus{border-color:var(--ka-acc2)}
  .ka-continue{display:none;margin-top:8px;font-size:13px;color:var(--ka-dim)}
  .ka-continue a{color:var(--ka-acc);font-weight:600;text-decoration:none}
  .ka-hidden{display:none!important}
  /* Mavzu tugmalarini ixchamlashtirish */
  .ka-compact .picker-card{padding:14px!important}
  .ka-compact .topic-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))!important;gap:6px!important;padding:0!important;margin:8px 0 0!important}
  .ka-compact .topic-grid>li{min-width:0;margin:0!important}
  .ka-compact .topic-chip{min-width:0;overflow:hidden;box-sizing:border-box;width:100%}
  @media (max-width:520px){.ka-compact .topic-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
  .ka-compact .topic-chip{padding:8px 10px!important;min-height:0!important;border-radius:10px!important;font-size:13px!important;gap:6px!important;display:flex!important;align-items:center!important}
  .ka-compact .topic-chip .ico{font-size:15px!important;width:auto!important;height:auto!important;background:none!important;margin:0!important}
  .ka-compact .tc-name{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-width:0;line-height:1.25;white-space:normal}
  .ka-hub .picker-wrap{max-height:min(58vh,520px);overflow-y:auto;overscroll-behavior:contain;margin:0!important;padding:0!important;border-radius:12px}
  .ka-hub .picker-wrap::-webkit-scrollbar{width:6px}.ka-hub .picker-wrap::-webkit-scrollbar-thumb{background:var(--ka-border);border-radius:6px}
  .ka-compact .bolim-group-title{margin:12px 0 2px!important;font-size:13px!important}
  .ka-compact h2{font-size:17px!important;margin:0 0 4px!important}
  .ka-compact .sub{font-size:13px!important;margin:0!important}
  .ka-noresult{color:var(--ka-dim);font-size:14px;padding:10px 2px}
  /* Mavzu oxiridagi navigatsiya */
  .ka-topicnav{display:flex;gap:8px;margin-top:18px;padding-top:14px;border-top:1px dashed var(--ka-border);flex-wrap:wrap}
  .ka-topicnav button{flex:1 1 30%;min-width:0;background:var(--ka-soft);border:1px solid var(--ka-border);color:var(--ka-text);border-radius:12px;padding:10px;font:600 13px/1.2 var(--ka-font);cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ka-topicnav button:disabled{opacity:.35;cursor:default}
  .ka-topicnav .ka-mid{flex:0 0 auto}
  .ka-drawbtn{display:inline-flex;align-items:center;gap:6px;margin:10px 0;background:rgba(94,230,199,.12);border:1px solid var(--ka-acc);color:var(--ka-acc);border-radius:12px;padding:9px 14px;font:600 14px/1 var(--ka-font);cursor:pointer}
  /* Suzuvchi tugmalar */
  .ka-fab{position:fixed;right:16px;bottom:18px;z-index:950;display:flex;flex-direction:column;gap:10px;align-items:flex-end}
  .ka-fab button{border:0;cursor:pointer;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.45);font:700 14px/1 var(--ka-font)}
  .ka-fab .ka-menu-btn{background:linear-gradient(135deg,#6a5af9,#8b5cf6);color:#fff;padding:14px 18px}
  .ka-fab .ka-graph-btn{background:var(--ka-acc);color:#0b1220;padding:12px 16px}
  .ka-fab .ka-top-btn{background:var(--ka-card);color:var(--ka-text);border:1px solid var(--ka-border);width:44px;height:44px;opacity:0;pointer-events:none;transition:opacity .2s}
  .ka-fab .ka-top-btn.show{opacity:1;pointer-events:auto}
  /* Yon menyu (drawer) */
  .ka-drawer-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:980;opacity:0;pointer-events:none;transition:opacity .2s}
  .ka-drawer{position:fixed;top:0;right:0;bottom:0;width:min(380px,92vw);background:var(--ka-bg);border-left:1px solid var(--ka-border);z-index:990;
    transform:translateX(100%);transition:transform .25s ease;display:flex;flex-direction:column}
  .ka-open .ka-drawer{transform:none}.ka-open .ka-drawer-bg{opacity:1;pointer-events:auto}
  .ka-drawer-head{padding:14px 14px 8px;border-bottom:1px solid var(--ka-border)}
  .ka-drawer-head .row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .ka-drawer-head b{font-size:16px;color:var(--ka-text)}
  .ka-x{background:none;border:0;color:var(--ka-dim);font-size:22px;cursor:pointer;padding:4px 8px}
  .ka-drawer-body{overflow-y:auto;padding:6px 8px 80px;flex:1}
  .ka-grp{margin:6px 0}
  .ka-grp>summary{list-style:none;cursor:pointer;padding:10px 8px;color:var(--ka-acc2);font-weight:700;font-size:14px;border-radius:10px;display:flex;justify-content:space-between}
  .ka-grp>summary::-webkit-details-marker{display:none}
  .ka-grp>summary::after{content:"▾";color:var(--ka-dim)}
  .ka-grp:not([open])>summary::after{content:"▸"}
  .ka-sub{color:var(--ka-dim);font-size:12px;font-weight:700;padding:8px 10px 2px;text-transform:uppercase;letter-spacing:.03em}
  .ka-link{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:10px;color:var(--ka-text);text-decoration:none;font-size:14px;line-height:1.3}
  .ka-link:hover,.ka-link:focus{background:var(--ka-soft);outline:none}
  .ka-link.cur{background:rgba(124,155,255,.18);color:#fff}
  .ka-link .i{flex:0 0 22px;text-align:center}
  /* ===================== Grafik taxtasi ===================== */
  .ka-g{position:fixed;inset:0;z-index:2000;background:var(--ka-bg);display:none;flex-direction:column;color:var(--ka-text);font-family:inherit}
  .ka-g.on{display:flex}
  .ka-g-top{display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid var(--ka-border);overflow-x:auto;scrollbar-width:none;flex:0 0 auto}
  .ka-g-top::-webkit-scrollbar{display:none}
  .ka-g-top .ttl{font-weight:800;margin-right:6px;white-space:nowrap}
  .ka-g button,.ka-g select{font:600 13px/1 var(--ka-font);color:var(--ka-text);background:var(--ka-soft);border:1px solid var(--ka-border);border-radius:10px;padding:8px 10px;cursor:pointer;white-space:nowrap;flex:0 0 auto}
  .ka-g button.act{background:linear-gradient(135deg,#6a5af9,#8b5cf6);border-color:transparent;color:#fff}
  .ka-g .sep{width:1px;align-self:stretch;background:var(--ka-border);flex:0 0 1px;margin:0 2px}
  .ka-g .sw{width:26px;height:26px;border-radius:50%;padding:0;border:2px solid transparent}
  .ka-g .sw.act{border-color:#fff;box-shadow:0 0 0 2px var(--ka-acc2)}
  .ka-g-stage{position:relative;flex:1;min-height:0;touch-action:none}
  .ka-g-desmos{position:absolute;inset:0;display:none;background:#fff;z-index:3}
  .ka-g.desmos .ka-g-desmos{display:block}
  .ka-g.desmos .ka-g-coord{display:none}
  .ka-g-top button[data-act="desmos"].act{background:#5ee6c7;color:#06231d}
  .ka-g-dload{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#0b1220;font:600 15px/1.4 var(--ka-font);background:#fff}
  /* ---- Guruhli tab (Qo'shimcha mavzular) ---- */
  .ka-subtabs{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}
  .ka-subtab{border:1px solid var(--ka-border);background:var(--ka-soft);color:var(--ka-dim);padding:7px 11px;border-radius:999px;font:600 13px/1 var(--ka-font);cursor:pointer}
  .ka-subtab[aria-selected="true"]{background:rgba(167,139,250,.2);color:#e9d5ff;border-color:#a78bfa}
  .ka-group-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 10px}
  .ka-group-head h2{margin:0;font-size:20px}
  .ka-sortbtn{border:1px solid var(--ka-border);background:var(--ka-soft);color:var(--ka-text);padding:7px 11px;border-radius:10px;font:600 12px/1 var(--ka-font);cursor:pointer}
  .ka-sub-hidden{display:none !important}
  .ka-numlist{list-style:none;margin:0;padding:0}
  /* ---- O'yinlar qidiruv natijalari ---- */
  .ka-gres{display:none;margin:0 0 12px}
  .ka-gres.on{display:block}
  .ka-gres .ttl{font:700 13px/1 var(--ka-font);color:var(--ka-dim);text-transform:uppercase;letter-spacing:.04em;margin:0 0 8px}
  .ka-gres ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
  .ka-gres a{display:flex;gap:8px;align-items:center;padding:10px 12px;border:1px solid var(--ka-border);border-radius:12px;background:var(--ka-card);color:var(--ka-text);text-decoration:none;font-size:14px}
  .ka-gres a:hover{border-color:var(--ka-acc)}
  .ka-gres a small{color:var(--ka-dim);font-size:12px;margin-left:auto;white-space:nowrap}
  .ka-g-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  .ka-g-coord{position:absolute;left:10px;top:10px;background:rgba(20,31,56,.85);border:1px solid var(--ka-border);border-radius:8px;padding:4px 8px;font:600 12px/1.2 ui-monospace,monospace;pointer-events:none}
  .ka-g-bot{border-top:1px solid var(--ka-border);padding:8px 10px;display:flex;flex-direction:column;gap:6px;flex:0 0 auto;background:var(--ka-card)}
  .ka-g-bot .row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .ka-g-bot label{font-weight:700;color:var(--ka-dim);font-size:14px}
  .ka-g-bot input[type=text]{flex:1 1 160px;min-width:120px;background:var(--ka-bg);border:1px solid var(--ka-border);color:var(--ka-text);border-radius:10px;padding:9px 10px;font:600 15px/1 ui-monospace,monospace;outline:none}
  .ka-g-bot input[type=text]:focus{border-color:var(--ka-acc2)}
  .ka-g-msg{font-size:13px;color:var(--ka-dim);min-height:18px}
  .ka-g-msg.good{color:var(--ka-acc)}.ka-g-msg.bad{color:var(--ka-bad)}
  .ka-g-task{font-weight:700;color:#ffd479}
  .ka-g .primary{background:var(--ka-acc);color:#0b1220;border-color:transparent}
  .ka-g-help{font-size:12px;color:var(--ka-dim)}
  `;
  document.head.appendChild(el("style", { id: "ka-style" }, css));

  /* ======================= NAVIGATSIYA ======================= */
  var header = $(".wrap > header");
  if (header) header.classList.add("ka-sticky");

  var main = $("main");
  var sections = $$("main > section.topic");
  var byId = {};
  sections.forEach(function (s) { byId[s.id] = s; });

  function titleOf(sec) {
    var h = $("h2", sec);
    return h ? h.textContent.replace(/\s+/g, " ").trim() : sec.id;
  }

  // Mavzuni ochish: faqat shu mavzu ochiq, qolganlari yig'iladi
  function openTopic(id, scroll) {
    var sec = byId[id];
    if (!sec) return false;
    sections.forEach(function (s) {
      var h = $("h2", s);
      if (s === sec) { s.classList.remove("collapsed"); if (h) h.setAttribute("aria-expanded", "true"); }
      else if (!s.classList.contains("collapsed")) { s.classList.add("collapsed"); if (h) h.setAttribute("aria-expanded", "false"); }
    });
    store("ka-last", id);
    markCurrent(id);
    if (scroll !== false) {
      requestAnimationFrame(function () {
        var y = sec.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight + 8 : 8);
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    }
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    return true;
  }
  window.kaOpenTopic = openTopic;

  // Barcha ichki mavzu havolalarini ushlash
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (byId[id]) { e.preventDefault(); closeDrawer(); openTopic(id); }
    else if (id && document.getElementById(id) && a.closest(".ka-drawer")) { closeDrawer(); }
  }, true);

  // Mavzu oxiriga: oldingi / menyu / keyingi
  sections.forEach(function (sec, i) {
    var body = $(".topic-body", sec) || sec;
    var prev = sections[i - 1], next = sections[i + 1];
    var nav = el("div", { class: "ka-topicnav" });
    var bp = el("button", { type: "button", title: prev ? titleOf(prev) : "" }, "← " + (prev ? "Oldingi" : "—"));
    var bm = el("button", { type: "button", class: "ka-mid" }, "☰ Mavzular");
    var bn = el("button", { type: "button", title: next ? titleOf(next) : "" }, (next ? "Keyingi" : "—") + " →");
    if (!prev) bp.disabled = true;
    if (!next) bn.disabled = true;
    bp.onclick = function () { prev && openTopic(prev.id); };
    bn.onclick = function () { next && openTopic(next.id); };
    bm.onclick = openDrawer;
    nav.append(bp, bm, bn);
    body.appendChild(nav);

    // Grafikka oid mavzularga "qo'lda chizish" tugmasi
    if (/grafik|funksiya|parabola/i.test(titleOf(sec))) {
      var db = el("button", { type: "button", class: "ka-drawbtn" }, "📐 Grafikni qo'lda chizish");
      db.onclick = function () { Graph.open(); };
      var dd = el("button", { type: "button", class: "ka-drawbtn", style: "margin-left:8px;border-color:#a78bfa;color:#e9d5ff;background:rgba(167,139,250,.12)" }, "📈 Desmos'da ochish");
      dd.onclick = function () { Graph.open({ desmos: true }); };
      body.insertBefore(dd, body.firstChild);
      body.insertBefore(db, body.firstChild);
    }
  });

  // ---- Markaz: barcha menyu bloklarini tablarga yig'ish ----
  var pickers = $$(".wrap > .picker-wrap");
  // data-group="..." bo'lgan bloklarni bitta tab (guruh) ichiga yig'ish — ichida sub-tablar
  (function groupPickers() {
    var groups = {};
    pickers.forEach(function (p) {
      var g = p.getAttribute("data-group"); if (!g) return;
      if (!groups[g]) {
        var wrap = el("div", { class: "picker-wrap ka-group", id: "grp-" + g, "data-tab": p.getAttribute("data-group-label") || g });
        var card = el("div", { class: "picker-card" });
        var head = el("div", { class: "ka-group-head" });
        head.appendChild(el("h2", {}, p.getAttribute("data-group-label") || g));
        var sortBtn = el("button", { class: "ka-sortbtn", type: "button" }, "📚 Boblar bo'yicha ko'rsatish");
        head.appendChild(sortBtn);
        card.appendChild(head);
        var sub = el("div", { class: "ka-subtabs", role: "tablist" });
        card.appendChild(sub);
        wrap.appendChild(card);
        p.parentNode.insertBefore(wrap, p);
        groups[g] = { wrap: wrap, card: card, sub: sub, items: [], sortBtn: sortBtn, numeric: true };
      }
      var G = groups[g];
      var h = $("h2", p);
      var label = p.getAttribute("data-subtab") || (h ? h.textContent.trim() : "Bo'lim");
      // raqam bo'yicha tartiblangan tekis ro'yxat (ichidagi barcha chiplardan)
      var chips = $$("a.topic-chip", p).map(function (a) { return a.cloneNode(true); });
      chips.sort(function (a, b) {
        var na = parseInt((a.textContent.match(/(\d+)\./) || [0, 0])[1], 10), nb = parseInt((b.textContent.match(/(\d+)\./) || [0, 0])[1], 10);
        return na - nb;
      });
      var numWrap = el("div", { class: "ka-numlist-wrap" });
      var ul = el("ul", { class: "topic-grid ka-numlist" });
      chips.forEach(function (a) { var li = el("li"); li.appendChild(a); ul.appendChild(li); });
      numWrap.appendChild(ul);
      var orig = el("div", { class: "ka-orig-wrap ka-sub-hidden" });
      // asl blokning ichki tarkibini (h2 dan tashqari) ko'chiramiz
      var pc = $(".picker-card", p) || p;
      Array.prototype.slice.call(pc.children).forEach(function (c) { if (c.tagName !== "H2") orig.appendChild(c); });
      var sect = el("div", { class: "ka-subpane", id: p.id });
      sect.appendChild(numWrap); sect.appendChild(orig);
      p.parentNode.removeChild(p);
      G.card.appendChild(sect);
      var st = el("button", { class: "ka-subtab", role: "tab", type: "button" }, label);
      G.sub.appendChild(st);
      G.items.push({ tab: st, pane: sect, num: numWrap, orig: orig });
    });
    Object.keys(groups).forEach(function (g) {
      var G = groups[g];
      function selectSub(i) {
        G.items.forEach(function (it, j) {
          it.tab.setAttribute("aria-selected", j === i ? "true" : "false");
          it.pane.classList.toggle("ka-sub-hidden", j !== i);
        });
        store("ka-sub-" + g, String(i));
      }
      G.items.forEach(function (it, i) { it.tab.onclick = function () { selectSub(i); }; });
      G.sortBtn.onclick = function () {
        G.numeric = !G.numeric;
        G.sortBtn.textContent = G.numeric ? "📚 Boblar bo'yicha ko'rsatish" : "🔢 Raqam bo'yicha ko'rsatish";
        G.items.forEach(function (it) { it.num.classList.toggle("ka-sub-hidden", !G.numeric); it.orig.classList.toggle("ka-sub-hidden", G.numeric); });
      };
      var sv = parseInt(store("ka-sub-" + g), 10);
      var want = sv >= 0 && sv < G.items.length ? sv : 0;
      G.items.forEach(function (it, i) { if (location.hash === "#" + it.pane.id) want = i; });
      selectSub(want);
      G.wrap.__showAll = function (all) { G.items.forEach(function (it, i) { it.pane.classList.toggle("ka-sub-hidden", !all && it.tab.getAttribute("aria-selected") !== "true"); }); };
      G.wrap.__subIds = G.items.map(function (it) { return it.pane.id; });
    });
    pickers = $$(".wrap > .picker-wrap");
  })();
  var hub = null, panes = [];
  if (pickers.length) {
    hub = el("div", { class: "ka-hub", id: "ka-hub" });
    var tabs = el("div", { class: "ka-tabs", role: "tablist" });
    var search = el("div", { class: "ka-search" },
      '<input type="search" placeholder="🔎 Mavzu yoki o\'yin qidirish (masalan: logarifm, 63, poyga, pufak)…" aria-label="Mavzu yoki o\'yin qidirish">');
    var cont = el("div", { class: "ka-continue" });
    var gres = el("div", { class: "ka-gres" });
    hub.append(tabs, search, cont, gres);
    pickers[0].parentNode.insertBefore(hub, pickers[0]);

    pickers.forEach(function (p, i) {
      var h = $("h2", p);
      var label = p.getAttribute("data-tab") || (h ? h.textContent.trim() : "Bo'lim " + (i + 1));
      var tab = el("button", { class: "ka-tab", role: "tab", type: "button" }, label);
      tab.onclick = function () { selectPane(i); };
      tabs.appendChild(tab);
      p.classList.add("ka-compact");
      hub.appendChild(p);
      panes.push({ pane: p, tab: tab });
    });
    var gtab = el("button", { class: "ka-tab ka-graph-tab", type: "button" }, "📐 Grafik chizish");
    gtab.onclick = function () { Graph.open(); };
    tabs.appendChild(gtab);
    var dtab = el("button", { class: "ka-tab ka-graph-tab", type: "button", style: "border-color:#a78bfa;color:#e9d5ff" }, "📈 Desmos");
    dtab.onclick = function () { Graph.open({ desmos: true }); };
    tabs.appendChild(dtab);
    var ttab = el("button", { class: "ka-tab ka-graph-tab", type: "button" }, "🪢 Arqon tortish");
    ttab.onclick = function () { Tug.open(); };
    tabs.appendChild(ttab);

    var noRes = el("div", { class: "ka-noresult ka-hidden" }, "Hech narsa topilmadi.");
    hub.appendChild(noRes);

    var cur = 0;
    function selectPane(i) {
      cur = i;
      panes.forEach(function (o, j) {
        o.tab.setAttribute("aria-selected", j === i ? "true" : "false");
        o.pane.classList.toggle("ka-hidden", j !== i);
      });
      store("ka-tab", String(i));
      doFilter();
    }
    var inp = $("input", search);
    function norm(s) { return s.toLowerCase().replace(/[ʻʼ‘’`']/g, "'").replace(/\s+/g, " "); }
    function visible(a) { return !a.closest(".ka-hidden"); }
    function visCount(n) { return $$("a", n).filter(visible).length; }
    function gameResults(q) {
      var list = (window.KA_OYINLAR || []);
      if (!q) { gres.className = "ka-gres"; gres.innerHTML = ""; return 0; }
      var hits = list.filter(function (g) { return norm(g.n + " " + (g.t || "")).indexOf(q) > -1; }).slice(0, 24);
      if (!hits.length) { gres.className = "ka-gres"; gres.innerHTML = ""; return 0; }
      gres.className = "ka-gres on";
      gres.innerHTML = '<p class="ttl">🎮 O\'yinlar — ' + hits.length + ' ta</p><ul>' + hits.map(function (g) {
        return '<li><a href="' + g.u.replace(/[?&]mavzu=\{id\}/, "") + '"><span>' + (g.e || "🎮") + '</span><span>' + g.n + '</span><small>' + (g.t || "") + '</small></a></li>';
      }).join("") + "</ul>";
      return hits.length;
    }
    function doFilter() {
      var q = norm(inp.value.trim());
      var any = gameResults(q) > 0;
      panes.forEach(function (o, j) {
        if (o.pane.__showAll) o.pane.__showAll(!!q);
        if (q) o.pane.classList.remove("ka-hidden");
        else o.pane.classList.toggle("ka-hidden", j !== cur);
        var shownInPane = 0;
        $$("li, a.topic-chip", o.pane).forEach(function (it) {
          if (it.tagName === "A" && it.parentNode.tagName === "LI") return;
          var ok = !q || norm(it.textContent).indexOf(q) > -1;
          it.classList.toggle("ka-hidden", !ok);
          if (ok) shownInPane++;
        });
        // bob sarlavhalari — ostida natija bo'lmasa yashirish
        $$(".bolim-group-title", o.pane).forEach(function (t) {
          if (!q) { t.classList.remove("ka-hidden"); var g0 = t.closest(".bolim-group"); if (g0) g0.classList.remove("ka-hidden"); return; }
          var g = t.closest(".bolim-group");
          if (g) { g.classList.remove("ka-hidden"); g.classList.toggle("ka-hidden", !visCount(g)); return; }
          var n = t.nextElementSibling, has = false;
          while (n && !n.classList.contains("bolim-group-title")) { if ((n.matches("a") && visible(n)) || visCount(n)) { has = true; break; } n = n.nextElementSibling; }
          t.classList.toggle("ka-hidden", !has);
        });
        var chips = $$("a", o.pane).length;
        if (q && chips && !shownInPane) o.pane.classList.add("ka-hidden");
        if (q && !chips) o.pane.classList.add("ka-hidden");
        if (shownInPane) any = true;
      });
      noRes.classList.toggle("ka-hidden", !q || any);
      tabs.style.opacity = q ? ".45" : "1";
    }
    inp.addEventListener("input", doFilter);
    var saved = parseInt(store("ka-tab"), 10);
    selectPane(saved >= 0 && saved < panes.length ? saved : 0);
    panes.forEach(function (o, i) {
      var subHit = o.pane.__subIds && location.hash && o.pane.__subIds.indexOf(location.hash.slice(1)) > -1;
      if (location.hash && (location.hash === "#" + o.pane.id || subHit)) {
        selectPane(i);
        setTimeout(function () { hub.scrollIntoView({ behavior: "smooth", block: "start" }); }, 300);
      }
    });

    // Header'dagi #toc... havolalari endi tab'ni ochadi
    $$("header nav a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      panes.forEach(function (o, i) {
        if (href === "#" + o.pane.id) {
          a.addEventListener("click", function (e) {
            e.preventDefault(); selectPane(i);
            hub.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      });
    });

    // Davom ettirish
    var last = store("ka-last");
    if (last && byId[last]) {
      cont.style.display = "block";
      cont.innerHTML = '⏱ Oxirgi o\'qilgan: <a href="#' + last + '">' + titleOf(byId[last]) + "</a>";
    }
  }

  // Header'ga qo'shimcha havola qo'shilmaydi — Grafik, Desmos va Arqon tortish pastdagi tablarda (menyu ixcham qoladi)
  // Agar #grafik yoki #arqon hash bilan kelinsa, mos oyna ochiladi
  if (location.hash === "#arqon") setTimeout(function () { Tug.open(); }, 300);

  // ---- Yon menyu (drawer) ----
  var drawerBg = el("div", { class: "ka-drawer-bg" });
  var drawer = el("aside", { class: "ka-drawer", "aria-label": "Mavzular menyusi" });
  drawer.innerHTML = '<div class="ka-drawer-head"><div class="row"><b>☰ Barcha mavzular</b><button class="ka-x" type="button" aria-label="Yopish">✕</button></div>' +
    '<div class="ka-search" style="margin:0"><input type="search" placeholder="🔎 Qidirish…"></div></div><div class="ka-drawer-body"></div>';
  document.body.append(drawerBg, drawer);
  var dBody = $(".ka-drawer-body", drawer);

  function linkFor(a) {
    var href = a.getAttribute("href");
    var ico = $(".ico", a), nm = $(".tc-name", a);
    var l = el("a", { class: "ka-link", href: href },
      '<span class="i">' + (ico ? ico.textContent : "•") + "</span><span>" + (nm ? nm.textContent : a.textContent).trim() + "</span>");
    return l;
  }
  function buildDrawer() {
    dBody.innerHTML = "";
    var gb = el("button", { type: "button", class: "ka-drawbtn", style: "width:100%;justify-content:center" }, "📐 Grafik chizish taxtasi");
    gb.onclick = function () { closeDrawer(); Graph.open(); };
    dBody.appendChild(gb);
    var tb = el("button", { type: "button", class: "ka-drawbtn", style: "width:100%;justify-content:center;margin-top:0" }, "🪢 Arqon tortish o'yini");
    tb.onclick = function () { closeDrawer(); Tug.open(); };
    dBody.appendChild(tb);
    panes.forEach(function (o, i) {
      var links = $$("a[href^='#']", o.pane);
      if (!links.length) return;
      var d = el("details", { class: "ka-grp" });
      if (i === 0) d.open = true;
      d.appendChild(el("summary", null, ($("h2", o.pane) || {}).textContent + ' <span style="color:var(--ka-dim);font-weight:500">(' + links.length + ")</span>"));
      $$(".bolim-group-title, a[href^='#']", o.pane).forEach(function (n) {
        if (n.classList.contains("bolim-group-title")) d.appendChild(el("div", { class: "ka-sub" }, n.textContent));
        else d.appendChild(linkFor(n));
      });
      dBody.appendChild(d);
    });
    // Picker'da yo'q, lekin sahifada bor mavzular (masalan, admin qo'shganlari)
    var listed = {};
    $$(".ka-link", dBody).forEach(function (l) { listed[l.getAttribute("href").slice(1)] = 1; });
    var rest = sections.filter(function (s) { return !listed[s.id]; });
    if (rest.length) {
      var d2 = el("details", { class: "ka-grp" });
      d2.appendChild(el("summary", null, "📚 Boshqa mavzular (" + rest.length + ")"));
      rest.forEach(function (s) { d2.appendChild(el("a", { class: "ka-link", href: "#" + s.id }, '<span class="i">•</span><span>' + titleOf(s) + "</span>")); });
      dBody.appendChild(d2);
    }
  }
  buildDrawer();
  var dInp = $("input", drawer);
  dInp.addEventListener("input", function () {
    var q = dInp.value.toLowerCase().trim();
    $$(".ka-grp", dBody).forEach(function (d) {
      var n = 0;
      $$(".ka-link", d).forEach(function (l) { var ok = !q || l.textContent.toLowerCase().indexOf(q) > -1; l.classList.toggle("ka-hidden", !ok); if (ok) n++; });
      $$(".ka-sub", d).forEach(function (s) { s.classList.toggle("ka-hidden", !!q); });
      d.classList.toggle("ka-hidden", !n);
      if (q) d.open = true;
    });
  });
  function markCurrent(id) {
    $$(".ka-link", dBody).forEach(function (l) { l.classList.toggle("cur", l.getAttribute("href") === "#" + id); });
  }
  function openDrawer() {
    document.documentElement.classList.add("ka-open");
    var c = $(".ka-link.cur", dBody);
    if (c) { var g = c.closest("details"); if (g) g.open = true; c.scrollIntoView({ block: "center" }); }
    setTimeout(function () { if (window.innerWidth > 700) dInp.focus(); }, 250);
  }
  function closeDrawer() { document.documentElement.classList.remove("ka-open"); }
  drawerBg.onclick = closeDrawer;
  $(".ka-x", drawer).onclick = closeDrawer;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDrawer(); Graph.close(); Tug.close(); } });

  // ---- Suzuvchi tugmalar ----
  var fab = el("div", { class: "ka-fab" });
  var topBtn = el("button", { class: "ka-top-btn", type: "button", "aria-label": "Yuqoriga" }, "↑");
  var gBtn = el("button", { class: "ka-graph-btn", type: "button" }, "📐 Grafik");
  var mBtn = el("button", { class: "ka-menu-btn", type: "button" }, "☰ Mavzular");
  topBtn.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
  gBtn.onclick = function () { Graph.open(); };
  mBtn.onclick = openDrawer;
  fab.append(topBtn, gBtn, mBtn);
  document.body.appendChild(fab);
  window.addEventListener("scroll", function () { topBtn.classList.toggle("show", window.scrollY > 600); }, { passive: true });

  // URL'da #t12 bo'lsa — shu mavzuni ochish
  if (location.hash && byId[location.hash.slice(1)]) setTimeout(function () { openTopic(location.hash.slice(1)); }, 300);
  if (location.hash === "#grafik") setTimeout(function () { Graph.open(); }, 300);
  if (location.hash === "#arqon") setTimeout(function () { Tug.open(); }, 300);

  /* ================= FORMULA PARSER (xavfsiz, eval'siz) ================= */
  var FUN = {
    sin: Math.sin, cos: Math.cos, tg: Math.tan, tan: Math.tan,
    ctg: function (x) { return 1 / Math.tan(x); }, cot: function (x) { return 1 / Math.tan(x); },
    sqrt: Math.sqrt, abs: Math.abs, ln: Math.log, lg: Math.log10, log: Math.log10, exp: Math.exp,
    arcsin: Math.asin, arccos: Math.acos, arctg: Math.atan, arctan: Math.atan
  };
  function parseFormula(src) {
    var s = String(src).trim()
      .replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=\s*/i, "")
      .replace(/,/g, ".").replace(/[·×∙]/g, "*").replace(/[÷:]/g, "/").replace(/[−–—]/g, "-")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/√/g, "sqrt").replace(/π/g, "pi").replace(/\*\*/g, "^").toLowerCase();
    // tokenlash
    var t = [], i = 0, m, absDepth = 0;
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if ((m = /^\d*\.?\d+(e[+-]?\d+)?/.exec(s.slice(i))) && m[0] !== "") { t.push({ k: "n", v: parseFloat(m[0]) }); i += m[0].length; continue; }
      if ((m = /^[a-z]+/.exec(s.slice(i)))) {
        var w = m[0], j = 0;
        // so'zni bo'laklash: "sinx" -> sin, x ; "2pix" -> pi, x
        while (j < w.length) {
          var found = null;
          var names = Object.keys(FUN).concat(["pi", "e", "x"]).sort(function (a, b) { return b.length - a.length; });
          for (var q = 0; q < names.length; q++) if (w.substr(j, names[q].length) === names[q]) { found = names[q]; break; }
          if (!found) throw new Error("Noma'lum belgi: " + w.slice(j));
          if (found === "x") t.push({ k: "x" });
          else if (found === "pi") t.push({ k: "n", v: Math.PI });
          else if (found === "e") t.push({ k: "n", v: Math.E });
          else t.push({ k: "f", v: found });
          j += found.length;
        }
        i += w.length; continue;
      }
      if (c === "|") {
        var prev = t[t.length - 1];
        var closing = prev && (prev.k === "n" || prev.k === "x" || prev.v === ")") && absDepth > 0;
        if (closing) { t.push({ k: "p", v: ")" }); absDepth--; }
        else { t.push({ k: "f", v: "abs" }); t.push({ k: "p", v: "(" }); absDepth++; }
        i++; continue;
      }
      if ("+-*/^()".indexOf(c) > -1) { t.push({ k: "p", v: c }); i++; continue; }
      throw new Error("Noma'lum belgi: " + c);
    }
    // oshkor bo'lmagan ko'paytirish: 2x, 3(x+1), x(x-1), )( , 2sin x
    var T = [];
    for (var a = 0; a < t.length; a++) {
      var A = t[a], B = t[a + 1];
      T.push(A);
      if (!B) continue;
      var endA = A.k === "n" || A.k === "x" || (A.k === "p" && A.v === ")");
      var startB = B.k === "n" || B.k === "x" || B.k === "f" || (B.k === "p" && B.v === "(");
      if (endA && startB) T.push({ k: "p", v: "*" });
    }
    var pos = 0;
    function peek() { return T[pos]; }
    function isP(v) { var p = T[pos]; return p && p.k === "p" && p.v === v; }
    function expr() {
      var l = term();
      while (isP("+") || isP("-")) { var op = T[pos++].v, r = term(); l = op === "+" ? add(l, r) : sub(l, r); }
      return l;
    }
    function term() {
      var l = unary();
      while (isP("*") || isP("/")) { var op = T[pos++].v, r = unary(); l = op === "*" ? mul(l, r) : dv(l, r); }
      return l;
    }
    function unary() {
      if (isP("-")) { pos++; var u = unary(); return function (x) { return -u(x); }; }
      if (isP("+")) { pos++; return unary(); }
      return power();
    }
    function power() {
      var b = primary();
      if (isP("^")) { pos++; var e = unary(); return function (x) { return powr(b(x), e(x)); }; }
      return b;
    }
    function primary() {
      var p = peek();
      if (!p) throw new Error("Formula tugallanmagan");
      if (p.k === "n") { pos++; var v = p.v; return function () { return v; }; }
      if (p.k === "x") { pos++; return function (x) { return x; }; }
      if (p.k === "f") {
        pos++; var f = FUN[p.v];
        var arg;
        if (isP("(")) { pos++; arg = expr(); if (!isP(")")) throw new Error("')' yetishmayapti"); pos++; }
        else arg = power();
        var fn = function (x) { return f(arg(x)); };
        if (isP("^")) { pos++; var e2 = unary(); return function (x) { return powr(fn(x), e2(x)); }; }
        return fn;
      }
      if (isP("(")) { pos++; var inner = expr(); if (!isP(")")) throw new Error("')' yetishmayapti"); pos++; return inner; }
      throw new Error("Kutilmagan belgi: " + p.v);
    }
    function add(a, b) { return function (x) { return a(x) + b(x); }; }
    function sub(a, b) { return function (x) { return a(x) - b(x); }; }
    function mul(a, b) { return function (x) { return a(x) * b(x); }; }
    function dv(a, b) { return function (x) { return a(x) / b(x); }; }
    function powr(b, e) {
      // manfiy son ning kasr darajasi: toq maxrajli bo'lsa (masalan, 1/3) haqiqiy ildiz
      if (b < 0 && !Number.isInteger(e)) {
        for (var d = 3; d <= 9; d += 2) { var n = Math.round(e * d); if (Math.abs(n / d - e) < 1e-9) return (n % 2 ? -1 : 1) * Math.pow(-b, e); }
        return NaN;
      }
      return Math.pow(b, e);
    }
    if (!T.length) throw new Error("Formula bo'sh");
    var F = expr();
    if (pos < T.length) throw new Error("Ortiqcha belgi: " + (T[pos].v || T[pos].k));
    return F;
  }
  window.kaParse = parseFormula;

  /* ======================= GRAFIK TAXTASI ======================= */
  var Graph = (function () {
    var root = null, bg, fg, bctx, fctx, coordEl, msgEl, inpEl, taskEl;
    var W = 0, H = 0, DPR = 1;
    var R = 10;               // ko'rinadigan radius (birlik)
    var cx = 0, cy = 0;       // markaz (siljitish)
    var tool = "pen", color = "#5ee6c7", width = 3, snap = true;
    var strokes = [], undoS = [], redoS = [];
    var drawing = null, pointers = {}, pinch = null;
    var answer = null, answerSrc = "", showAnswer = false, hiddenTask = false;
    var COLORS = ["#5ee6c7", "#ff8585", "#ffd479", "#7c9bff", "#ffffff"];
    var TASKS = [
      "2x - 1", "-x + 3", "0.5x + 2", "x^2", "x^2 - 4", "-x^2 + 4", "(x - 2)^2", "x^2 - 4x + 3",
      "-x^2 + 2x + 3", "(x + 1)^2 - 2", "|x|", "|x - 2|", "3 - |x|", "sqrt(x)", "sqrt(x + 4)",
      "1/x", "2/x", "1/(x - 1)", "x^3", "2^x", "(1/2)^x", "sin(x)", "cos(x)", "2sin(x)", "log(x)", "ln(x)"
    ];

    function unit() { return Math.min(W, H) / (2 * R); }
    function toPx(x, y) { var u = unit(); return [W / 2 + (x - cx) * u, H / 2 - (y - cy) * u]; }
    function toMath(px, py) { var u = unit(); return [(px - W / 2) / u + cx, -(py - H / 2) / u + cy]; }
    function niceStep(u) { var target = 40 / u, p = Math.pow(10, Math.floor(Math.log10(target))); var r = target / p; return (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * p; }
    function fmt(v) { return Math.abs(v) < 1e-9 ? "0" : (+v.toFixed(2)).toString(); }

    function build() {
      root = el("div", { class: "ka-g", role: "dialog", "aria-label": "Grafik chizish" });
      root.innerHTML =
        '<div class="ka-g-top">' +
          '<span class="ttl">📐 Grafik</span>' +
          '<button data-tool="pen" class="act" title="Qalam — erkin chizish">✏️ Qalam</button>' +
          '<button data-tool="line" title="To\'g\'ri chiziq (kesma)">📏 Chiziq</button>' +
          '<button data-tool="point" title="Nuqta qo\'yish">⚫ Nuqta</button>' +
          '<button data-tool="erase" title="O\'chirg\'ich — chiziq ustidan yurgizing">🧽 O\'chirish</button>' +
          '<button data-tool="pan" title="Tekislikni surish">✋ Surish</button>' +
          '<span class="sep"></span>' +
          COLORS.map(function (c, i) { return '<button class="sw' + (i === 0 ? " act" : "") + '" data-color="' + c + '" style="background:' + c + '" aria-label="Rang"></button>'; }).join("") +
          '<select data-w title="Qalinlik"><option value="2">ingichka</option><option value="3" selected>o\'rtacha</option><option value="5">qalin</option></select>' +
          '<span class="sep"></span>' +
          '<button data-act="undo" title="Orqaga">↶</button><button data-act="redo" title="Oldinga">↷</button>' +
          '<button data-act="clear" title="Hammasini tozalash">🗑</button>' +
          '<select data-r title="Masshtab"><option value="5">±5</option><option value="10" selected>±10</option><option value="20">±20</option><option value="50">±50</option></select>' +
          '<button data-act="snap" class="act" title="Nuqtalarni katakka yopishtirish">🧲 Katak</button>' +
          '<button data-act="center" title="Markazga qaytarish">⌖</button>' +
          '<button data-act="png" title="Rasm sifatida saqlash">💾 PNG</button>' +
          '<button data-act="desmos" title="Desmos grafik kalkulyatori">📈 Desmos</button>' +
          '<button data-act="desmos-send" title="Qo\'lda chizganingizni Desmos\'ga nuqtalar sifatida yuborish">➡️ Chizmani Desmos\'ga</button>' +
          '<button data-act="close" title="Yopish (Esc)">✕</button>' +
        "</div>" +
        '<div class="ka-g-stage"><canvas class="bg"></canvas><canvas class="fg"></canvas><div class="ka-g-coord">x: 0 · y: 0</div><div class="ka-g-desmos"></div></div>' +
        '<div class="ka-g-bot">' +
          '<div class="row"><span class="ka-g-task"></span></div>' +
          '<div class="row"><label>y =</label><input type="text" placeholder="masalan: x^2 - 4x + 3" autocomplete="off" spellcheck="false">' +
            '<button data-act="check" class="primary">✅ Tekshirish</button>' +
            '<button data-act="show">👁 Grafikni ko\'rsat</button>' +
            '<button data-act="task">🎲 Topshiriq</button></div>' +
          '<div class="ka-g-msg"></div>' +
          '<div class="ka-g-help">Maslahat: avval qo\'lda chizing, keyin formulani yozib «Tekshirish»ni bosing. Belgilar: x^2, sqrt(x), |x|, sin(x), 1/x, 2^x. Ikki barmoq bilan kattalashtirish mumkin. «📈 Desmos» — aniq grafik, jadval va slayderlar; «Grafikni ko\'rsat» Desmos rejimida formulani Desmos\'da chizadi.</div>' +
        "</div>";
      document.body.appendChild(root);
      bg = $("canvas.bg", root); fg = $("canvas.fg", root);
      bctx = bg.getContext("2d"); fctx = fg.getContext("2d");
      coordEl = $(".ka-g-coord", root); msgEl = $(".ka-g-msg", root);
      inpEl = $("input[type=text]", root); taskEl = $(".ka-g-task", root);

      $$("[data-tool]", root).forEach(function (b) {
        b.onclick = function () { tool = b.dataset.tool; $$("[data-tool]", root).forEach(function (x) { x.classList.toggle("act", x === b); }); fg.style.cursor = tool === "pan" ? "grab" : "crosshair"; };
      });
      $$("[data-color]", root).forEach(function (b) {
        b.onclick = function () { color = b.dataset.color; $$("[data-color]", root).forEach(function (x) { x.classList.toggle("act", x === b); }); if (tool === "erase" || tool === "pan") $('[data-tool="pen"]', root).click(); };
      });
      $("[data-w]", root).onchange = function () { width = +this.value; };
      $("[data-r]", root).onchange = function () { R = +this.value; render(); };
      $$("[data-act]", root).forEach(function (b) { b.onclick = function () { act(b.dataset.act, b); }; });
      inpEl.addEventListener("keydown", function (e) { if (e.key === "Enter") act("check"); });

      fg.addEventListener("pointerdown", down);
      fg.addEventListener("pointermove", move);
      fg.addEventListener("pointerup", up);
      fg.addEventListener("pointercancel", up);
      fg.addEventListener("pointerleave", function () { coordEl.style.opacity = ".5"; });
      fg.addEventListener("wheel", function (e) {
        e.preventDefault();
        R = Math.max(1, Math.min(200, R * (e.deltaY > 0 ? 1.12 : 1 / 1.12)));
        render();
      }, { passive: false });
      window.addEventListener("resize", function () { if (root.classList.contains("on")) resize(); });
      fg.style.cursor = "crosshair";
    }

    function resize() {
      var st = $(".ka-g-stage", root), r = st.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2.5);
      W = r.width; H = r.height;
      [bg, fg].forEach(function (c) { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); });
      bctx.setTransform(DPR, 0, 0, DPR, 0, 0); fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      render();
    }

    function drawGrid(ctx) {
      var u = unit(), step = niceStep(u);
      ctx.fillStyle = "#0e1628"; ctx.fillRect(0, 0, W, H);
      var tl = toMath(0, 0), br = toMath(W, H);
      // mayda katak (1 birlik yoki step/2)
      var minor = step / (step >= 2 ? (step === 2 ? 2 : 5) : 2);
      if (minor * u >= 8) {
        ctx.strokeStyle = "rgba(124,155,255,.08)"; ctx.lineWidth = 1; ctx.beginPath();
        for (var x = Math.ceil(tl[0] / minor) * minor; x <= br[0]; x += minor) { var px = toPx(x, 0)[0]; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
        for (var y = Math.ceil(br[1] / minor) * minor; y <= tl[1]; y += minor) { var py = toPx(0, y)[1]; ctx.moveTo(0, py); ctx.lineTo(W, py); }
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(124,155,255,.22)"; ctx.beginPath();
      for (x = Math.ceil(tl[0] / step) * step; x <= br[0]; x += step) { px = toPx(x, 0)[0]; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
      for (y = Math.ceil(br[1] / step) * step; y <= tl[1]; y += step) { py = toPx(0, y)[1]; ctx.moveTo(0, py); ctx.lineTo(W, py); }
      ctx.stroke();
      // o'qlar
      var o = toPx(0, 0), ax = Math.max(0, Math.min(W, o[0])), ay = Math.max(0, Math.min(H, o[1]));
      ctx.strokeStyle = "#c9d4ff"; ctx.lineWidth = 1.6; ctx.beginPath();
      ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.moveTo(ax, 0); ctx.lineTo(ax, H); ctx.stroke();
      ctx.fillStyle = "#c9d4ff"; ctx.beginPath();
      ctx.moveTo(W - 2, ay); ctx.lineTo(W - 12, ay - 5); ctx.lineTo(W - 12, ay + 5);
      ctx.moveTo(ax, 2); ctx.lineTo(ax - 5, 12); ctx.lineTo(ax + 5, 12); ctx.fill();
      ctx.font = "italic 700 14px Georgia,serif";
      ctx.fillText("x", W - 16, ay - 10); ctx.fillText("y", ax + 10, 16);
      // raqamlar
      ctx.font = "11px ui-monospace,monospace"; ctx.fillStyle = "#8b9ac0";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (x = Math.ceil(tl[0] / step) * step; x <= br[0]; x += step) {
        if (Math.abs(x) < 1e-9) continue; px = toPx(x, 0)[0];
        ctx.fillText(fmt(x), px, Math.min(H - 14, ay + 4));
        ctx.fillRect(px - .5, ay - 3, 1, 6);
      }
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (y = Math.ceil(br[1] / step) * step; y <= tl[1]; y += step) {
        if (Math.abs(y) < 1e-9) continue; py = toPx(0, y)[1];
        ctx.fillText(fmt(y), Math.max(24, ax - 5), py);
        ctx.fillRect(ax - 3, py - .5, 6, 1);
      }
      ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText("0", ax - 4, ay + 4);
    }

    function drawFunc(ctx, f, col, dash) {
      var tl = toMath(0, 0), br = toMath(W, H), n = Math.ceil(W * 2);
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.setLineDash(dash || []);
      ctx.beginPath();
      var pen = false, prevY = null, span = tl[1] - br[1];
      for (var i = 0; i <= n; i++) {
        var x = tl[0] + (br[0] - tl[0]) * i / n, y = f(x);
        if (!isFinite(y) || Math.abs(y - cy) > span * 4 || (prevY !== null && Math.abs(y - prevY) > span * 1.5)) { pen = false; prevY = isFinite(y) ? y : null; continue; }
        var p = toPx(x, y);
        if (pen) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
        pen = true; prevY = y;
      }
      ctx.stroke(); ctx.restore();
    }

    function drawStroke(ctx, s) {
      ctx.strokeStyle = ctx.fillStyle = s.c; ctx.lineWidth = s.w; ctx.lineCap = ctx.lineJoin = "round";
      if (s.t === "point") {
        var p = toPx(s.p[0][0], s.p[0][1]);
        ctx.beginPath(); ctx.arc(p[0], p[1], s.w + 2.5, 0, 7); ctx.fill();
        ctx.font = "600 11px ui-monospace,monospace"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText("(" + fmt(s.p[0][0]) + "; " + fmt(s.p[0][1]) + ")", p[0] + 7, p[1] - 4);
        return;
      }
      ctx.beginPath();
      s.p.forEach(function (m, i) { var q = toPx(m[0], m[1]); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
      if (s.p.length === 1) { var q = toPx(s.p[0][0], s.p[0][1]); ctx.lineTo(q[0] + .1, q[1]); }
      ctx.stroke();
    }

    function render() {
      if (!W) return;
      drawGrid(bctx);
      if (answer && showAnswer) drawFunc(bctx, answer, "rgba(255,212,121,.9)", [8, 6]);
      fctx.clearRect(0, 0, W, H);
      strokes.forEach(function (s) { drawStroke(fctx, s); });
      if (drawing && drawing.t !== "erase") drawStroke(fctx, drawing);
    }

    function snapPt(m) {
      if (!snap) return m;
      var g = R <= 5 ? 0.5 : R <= 20 ? 1 : 5;
      var sx = Math.round(m[0] / g) * g, sy = Math.round(m[1] / g) * g;
      var d = Math.hypot(toPx(sx, sy)[0] - toPx(m[0], m[1])[0], toPx(sx, sy)[1] - toPx(m[0], m[1])[1]);
      return d < 14 ? [sx, sy] : m;
    }
    function evtPt(e) { var r = fg.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function pushUndo() { undoS.push(JSON.stringify(strokes)); if (undoS.length > 80) undoS.shift(); redoS = []; }

    function eraseAt(px) {
      var hit = false, rr = 12;
      strokes = strokes.filter(function (s) {
        var pts = s.p.map(function (m) { return toPx(m[0], m[1]); });
        for (var i = 0; i < pts.length; i++) {
          var a = pts[i], b = pts[i + 1] || a;
          if (segDist(px, a, b) < rr + s.w) { hit = true; return false; }
        }
        return true;
      });
      return hit;
    }
    function segDist(p, a, b) {
      var dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
      var t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0;
      return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
    }

    function down(e) {
      e.preventDefault();
      fg.setPointerCapture && fg.setPointerCapture(e.pointerId);
      pointers[e.pointerId] = evtPt(e);
      var ids = Object.keys(pointers);
      if (ids.length === 2) { // pinch-zoom
        drawing = null;
        var a = pointers[ids[0]], b = pointers[ids[1]];
        pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), R: R, cx: cx, cy: cy, mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
        render(); return;
      }
      var px = evtPt(e), m = toMath(px[0], px[1]);
      if (tool === "pan") { drawing = { t: "pan", s: px, cx: cx, cy: cy }; fg.style.cursor = "grabbing"; return; }
      if (tool === "erase") { pushUndo(); drawing = { t: "erase", any: false }; if (eraseAt(px)) drawing.any = true; render(); return; }
      if (tool === "point") { pushUndo(); strokes.push({ t: "point", c: color, w: width, p: [snapPt(m)] }); render(); drawing = null; return; }
      if (tool === "line") { var s0 = snapPt(m); drawing = { t: "line", c: color, w: width, p: [s0, s0] }; return; }
      drawing = { t: "pen", c: color, w: width, p: [m] };
    }
    function move(e) {
      var px = evtPt(e), m = toMath(px[0], px[1]);
      coordEl.style.opacity = "1";
      coordEl.textContent = "x: " + fmt(m[0]) + " · y: " + fmt(m[1]);
      if (pointers[e.pointerId]) pointers[e.pointerId] = px;
      if (pinch) {
        var ids = Object.keys(pointers); if (ids.length < 2) return;
        var a = pointers[ids[0]], b = pointers[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        R = Math.max(1, Math.min(200, pinch.R * pinch.d / Math.max(d, 10)));
        render(); return;
      }
      if (!drawing) return;
      e.preventDefault();
      if (drawing.t === "pan") {
        var u = unit(); cx = drawing.cx - (px[0] - drawing.s[0]) / u; cy = drawing.cy + (px[1] - drawing.s[1]) / u; render(); return;
      }
      if (drawing.t === "erase") { if (eraseAt(px)) { drawing.any = true; render(); } return; }
      if (drawing.t === "line") { drawing.p[1] = snapPt(m); render(); return; }
      var last = toPx(drawing.p[drawing.p.length - 1][0], drawing.p[drawing.p.length - 1][1]);
      if (Math.hypot(px[0] - last[0], px[1] - last[1]) < 1.5) return;
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      evs.forEach(function (ce) { var q = evtPt(ce); drawing.p.push(toMath(q[0], q[1])); });
      fctx.lineCap = "round"; fctx.strokeStyle = drawing.c; fctx.lineWidth = drawing.w;
      render();
    }
    function up(e) {
      delete pointers[e.pointerId];
      if (pinch) { if (Object.keys(pointers).length < 2) pinch = null; return; }
      if (!drawing) return;
      if (drawing.t === "pan") { fg.style.cursor = "grab"; }
      else if (drawing.t === "erase") { if (!drawing.any) undoS.pop(); }
      else if (drawing.t === "line") { if (drawing.p[0][0] !== drawing.p[1][0] || drawing.p[0][1] !== drawing.p[1][1]) { pushUndo(); strokes.push(drawing); } }
      else { pushUndo(); strokes.push(smooth(drawing)); }
      drawing = null; render();
    }
    function smooth(s) {
      if (s.p.length < 5) return s;
      var out = [s.p[0]];
      for (var i = 1; i < s.p.length - 1; i++) out.push([(s.p[i - 1][0] + 2 * s.p[i][0] + s.p[i + 1][0]) / 4, (s.p[i - 1][1] + 2 * s.p[i][1] + s.p[i + 1][1]) / 4]);
      out.push(s.p[s.p.length - 1]); s.p = out; return s;
    }

    function setMsg(t, cls) { msgEl.className = "ka-g-msg" + (cls ? " " + cls : ""); msgEl.innerHTML = t; }

    function score(f) {
      // chizilgan nuqtalar (kesmalar zichlashtiriladi)
      var pts = [];
      strokes.forEach(function (s) {
        if (s.t === "point") { pts.push(s.p[0]); return; }
        for (var i = 0; i < s.p.length; i++) {
          pts.push(s.p[i]);
          var b = s.p[i + 1]; if (!b) continue;
          var a = s.p[i], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / (R / 60));
          for (var k = 1; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
        }
      });
      if (pts.length < 5) return null;
      var tol = R * 0.06, good = 0;
      pts.forEach(function (p) {
        // nuqtadan egri chiziqqacha eng yaqin masofa (yaqin x'larda qidirish)
        var best = Infinity;
        for (var dx = -tol * 2; dx <= tol * 2; dx += tol / 6) { var y = f(p[0] + dx); if (isFinite(y)) best = Math.min(best, Math.hypot(dx, y - p[1])); }
        if (best <= tol) good++;
      });
      var acc = good / pts.length;
      // qamrov: ko'rinadigan grafik bo'laklarini chizganmi
      var tl = toMath(0, 0), br = toMath(W, H), bins = 30, need = 0, hit = 0;
      for (var b = 0; b < bins; b++) {
        var x0 = tl[0] + (br[0] - tl[0]) * b / bins, x1 = tl[0] + (br[0] - tl[0]) * (b + 1) / bins, xm = (x0 + x1) / 2, ym = f(xm);
        if (!isFinite(ym) || ym > tl[1] || ym < br[1]) continue;
        need++;
        for (var j = 0; j < pts.length; j++) if (pts[j][0] >= x0 && pts[j][0] <= x1 && Math.abs(pts[j][1] - f(pts[j][0])) <= tol * 1.5) { hit++; break; }
      }
      var cov = need ? hit / need : 0;
      return { acc: acc, cov: cov, total: Math.round(100 * (0.6 * acc + 0.4 * cov)) };
    }

    /* ---------- Desmos integratsiyasi ---------- */
    var dsCalc = null, dsLoading = false, dsQueue = [];
    var DESMOS_URL = "https://www.desmos.com/api/v1.10/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0dda6";
    function toLatex(src) {
      var t = String(src).replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=\s*/i, "").replace(/\s+/g, "");
      t = t.replace(/[−–—]/g, "-").replace(/[·×∙]/g, "*").replace(/[÷:]/g, "/").replace(/²/g, "^2").replace(/³/g, "^3").replace(/\*\*/g, "^");
      // sqrt(...) -> \sqrt{...}  (balans bilan)
      function balanced(str, i) { var d = 0; for (var k = i; k < str.length; k++) { if (str[k] === "(") d++; else if (str[k] === ")") { d--; if (!d) return k; } } return -1; }
      var out = "", i = 0;
      while (i < t.length) {
        var mm = /^(sqrt|√)\(/.exec(t.slice(i));
        if (mm) { var j = balanced(t, i + mm[0].length - 1); if (j > 0) { out += "\\sqrt{" + toLatex(t.slice(i + mm[0].length, j)) + "}"; i = j + 1; continue; } }
        out += t[i]; i++;
      }
      t = out.replace(/√(\w+)/g, "\\sqrt{$1}");
      t = t.replace(/\|([^|]+)\|/g, "\\left|$1\\right|");
      t = t.replace(/\b(arcsin|arccos|arctg|arctan|sin|cos|tg|tan|ctg|cot|ln|lg|log|exp)\b/g, function (f) {
        return ({ tg: "\\tan", tan: "\\tan", ctg: "\\cot", cot: "\\cot", lg: "\\log", log: "\\log", arctg: "\\arctan", arctan: "\\arctan" })[f] || ("\\" + f);
      });
      t = t.replace(/\bpi\b|π/g, "\\pi").replace(/\*/g, "\\cdot ");
      return t;
    }
    function ensureDesmos(cb) {
      if (dsCalc) { cb(dsCalc); return; }
      dsQueue.push(cb);
      if (dsLoading) return;
      dsLoading = true;
      var box = $(".ka-g-desmos", root);
      box.innerHTML = '<div class="ka-g-dload">📈 Desmos yuklanmoqda…</div>';
      function init() {
        box.innerHTML = "";
        try {
          dsCalc = window.Desmos.GraphingCalculator(box, { language: "ru", keypad: true, expressions: true, settingsMenu: true, zoomButtons: true, border: false });
          dsCalc.setMathBounds({ left: -R, right: R, bottom: -R, top: R });
        } catch (e) { box.innerHTML = '<div class="ka-g-dload">⚠️ Desmos yuklanmadi (internet kerak)</div>'; dsLoading = false; dsQueue = []; return; }
        dsQueue.forEach(function (f) { f(dsCalc); }); dsQueue = [];
      }
      if (window.Desmos) { init(); return; }
      var sc = document.createElement("script"); sc.src = DESMOS_URL; sc.async = true;
      sc.onload = init;
      sc.onerror = function () { box.innerHTML = '<div class="ka-g-dload">⚠️ Desmos yuklanmadi — internetni tekshiring</div>'; dsLoading = false; dsQueue = []; };
      document.head.appendChild(sc);
    }
    function desmosOn() { return root && root.classList.contains("desmos"); }
    function desmosSet(src) {
      ensureDesmos(function (c) {
        var lx = toLatex(src);
        try { c.setExpression({ id: "ka-y", latex: "y=" + lx, color: "#2d70b3" }); } catch (e) {}
      });
    }
    function desmosSendStrokes() {
      if (!strokes.length) { setMsg("Avval qo'lda biror narsa chizing ✏️", "bad"); return; }
      ensureDesmos(function (c) {
        var n = 0;
        strokes.forEach(function (st, idx) {
          var pts = st.p || [];
          if (pts.length < 1) return;
          var step = Math.max(1, Math.ceil(pts.length / 80));
          var xs = [], ys = [];
          for (var k = 0; k < pts.length; k += step) { xs.push(String(+pts[k][0].toFixed(3))); ys.push(String(+pts[k][1].toFixed(3))); }
          if (pts.length > 1 && (pts.length - 1) % step) { xs.push(String(+pts[pts.length - 1][0].toFixed(3))); ys.push(String(+pts[pts.length - 1][1].toFixed(3))); }
          n++;
          c.setExpression({ type: "table", id: "ka-chizma-" + idx, columns: [
            { latex: "x_{" + (idx + 1) + "}", values: xs },
            { latex: "y_{" + (idx + 1) + "}", values: ys, lines: st.t !== "point", points: st.t === "point" || xs.length < 3, color: st.c || "#5ee6c7" }
          ] });
        });
        root.classList.add("desmos"); $('[data-act="desmos"]', root).classList.add("act");
        c.resize();
        setMsg("➡️ " + n + " ta chizma Desmos'ga jadval sifatida yuborildi. Endi formulani yozib taqqoslang.");
      });
    }
    function toggleDesmos(on) {
      var want = on == null ? !desmosOn() : !!on;
      root.classList.toggle("desmos", want);
      $('[data-act="desmos"]', root).classList.toggle("act", want);
      if (want) ensureDesmos(function (c) { c.resize(); var v = inpEl.value.trim(); if (v) desmosSet(v); });
    }

    function act(a, btn) {
      if (a === "close") return close();
      if (a === "undo") { if (undoS.length) { redoS.push(JSON.stringify(strokes)); strokes = JSON.parse(undoS.pop()); render(); } return; }
      if (a === "redo") { if (redoS.length) { undoS.push(JSON.stringify(strokes)); strokes = JSON.parse(redoS.pop()); render(); } return; }
      if (a === "clear") { if (!strokes.length) return; pushUndo(); strokes = []; showAnswer = false; setMsg(""); render(); return; }
      if (a === "snap") { snap = !snap; btn.classList.toggle("act", snap); return; }
      if (a === "center") { cx = cy = 0; R = +$("[data-r]", root).value; render(); return; }
      if (a === "desmos") { toggleDesmos(); return; }
      if (a === "desmos-send") { desmosSendStrokes(); return; }
      if (a === "png") {
        var c = document.createElement("canvas"); c.width = bg.width; c.height = bg.height;
        var x = c.getContext("2d"); x.drawImage(bg, 0, 0); x.drawImage(fg, 0, 0);
        x.setTransform(DPR, 0, 0, DPR, 0, 0); x.fillStyle = "#9fb0d0"; x.font = "12px sans-serif"; x.textAlign = "right"; x.textBaseline = "bottom";
        x.fillText((answerSrc ? "y = " + answerSrc + "  ·  " : "") + "Kuvonch Academy", W - 8, H - 6);
        var l = document.createElement("a"); l.download = "grafik.png"; l.href = c.toDataURL("image/png"); l.click(); return;
      }
      if (a === "task") {
        var t = TASKS[Math.floor(Math.random() * TASKS.length)];
        hiddenTask = true; answerSrc = t; answer = parseFormula(t); showAnswer = false;
        pushUndo(); strokes = []; cx = cy = 0; render();
        taskEl.innerHTML = "📝 Topshiriq: <b>y = " + t + "</b> funksiya grafigini qo'lda chizing, so'ng «Tekshirish»ni bosing.";
        inpEl.value = t; setMsg("Chizishni boshlang ✏️"); return;
      }
      if (a === "show" || a === "check") {
        var src = inpEl.value.trim();
        if (!src) { setMsg("Avval formulani yozing, masalan: x^2 - 4x + 3", "bad"); inpEl.focus(); return; }
        try { answer = parseFormula(src); answerSrc = src.replace(/^\s*y\s*=\s*/i, ""); }
        catch (err) { setMsg("⚠️ " + err.message, "bad"); return; }
        showAnswer = true;
        if (desmosOn()) { desmosSet(src); if (a === "show") { setMsg("📈 y = " + answerSrc + " Desmos'da chizildi."); return; } }
        if (a === "show") { render(); setMsg("Sariq uzuq chiziq — y = " + answerSrc + " ning to'g'ri grafigi."); return; }
        var sc = score(answer); render();
        if (!sc) { setMsg("Avval grafikni qo'lda chizing ✏️ — so'ng tekshiramiz.", "bad"); return; }
        var t2 = sc.total >= 85 ? "🌟 A'lo!" : sc.total >= 65 ? "👍 Yaxshi!" : sc.total >= 40 ? "🙂 Yomon emas, yana urinib ko'ring." : "❌ Grafik mos kelmadi — xossalarni qayta ko'rib chiqing.";
        setMsg("<b>" + t2 + " Natija: " + sc.total + "%</b> · aniqlik " + Math.round(sc.acc * 100) + "%, to'liqlik " + Math.round(sc.cov * 100) + "%. Sariq uzuq chiziq — to'g'ri javob.", sc.total >= 65 ? "good" : sc.total < 40 ? "bad" : "");
        return;
      }
    }

    function open(opts) {
      if (!root) build();
      root.classList.add("on");
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(resize);
      if (history.replaceState) history.replaceState(null, "", "#grafik");
      if (opts && opts.desmos) toggleDesmos(true);
      if (opts && opts.formula) { inpEl.value = opts.formula; if (opts.desmos) desmosSet(opts.formula); }
    }
    function close() {
      if (!root || !root.classList.contains("on")) return;
      root.classList.remove("on");
      document.documentElement.style.overflow = "";
      if (history.replaceState && location.hash === "#grafik") history.replaceState(null, "", location.pathname + location.search);
    }
    return { open: open, close: close };
  })();
  window.kaGraph = Graph;

  /* ======================= ARQON TORTISH O'YINI =======================
   * O'yin alohida sahifada: arqon.html (har bir mavzu, 1–10 jamoa, 3 daraja + o'sib boruvchi).
   * Bu yerda faqat o'sha sahifaga yo'naltiriladi — ochiq turgan mavzu bilan.
   */
  var Tug = {
    open: function (tid) {
      if (!tid) {
        var open = sections.filter(function (s) { return !s.classList.contains("collapsed"); })[0];
        tid = open ? open.id : "";
      }
      location.href = "arqon.html" + (tid && /^[a-z]\d+$/.test(tid) ? "?mavzu=" + tid : "");
    },
    close: function () {}
  };
  window.kaTug = Tug;
})();
