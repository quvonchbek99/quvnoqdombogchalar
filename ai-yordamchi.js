/*!
 * Kuvonch Academy — AI yordamchi (ChatGPT orqali)
 * API kalit kerak emas: savol tayyor ko'rsatma bilan chatgpt.com'da ochiladi.
 * Ulash: mashqlar.html faylida kuvonch-menyu.js dan keyin:
 *   <script src="ai-yordamchi.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaAI) return;
  window.__kaAI = true;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function clean(t) { return String(t || "").replace(/\s+/g, " ").trim(); }

  var css = `
  .ai-fab{position:fixed;left:16px;bottom:18px;z-index:950;border:0;cursor:pointer;border-radius:999px;padding:13px 16px;
    background:#10a37f;color:#fff;font:700 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45)}
  .ai-fab:hover{filter:brightness(1.08)}
  .ai-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2200;display:none}
  .ai-bg.on{display:block}
  .ai-panel{position:fixed;z-index:2201;left:50%;top:50%;transform:translate(-50%,-50%);width:min(560px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow-y:auto;
    background:#141f38;color:#eef2ff;border:1px solid #243252;border-radius:18px;padding:16px;display:none;flex-direction:column;gap:10px;
    font:14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .ai-panel.on{display:flex}
  .ai-head{display:flex;align-items:center;gap:8px}
  .ai-head b{font-size:17px;margin-right:auto}
  .ai-x{background:none;border:0;color:#9fb0d0;font-size:22px;cursor:pointer;padding:2px 8px}
  .ai-topic{font-size:13px;color:#9fb0d0}
  .ai-topic select{width:100%;margin-top:4px;background:#0b1220;color:#eef2ff;border:1px solid #243252;border-radius:10px;padding:8px;font:inherit}
  .ai-modes{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  @media (max-width:460px){.ai-modes{grid-template-columns:1fr}}
  .ai-mode{text-align:left;background:#111a2e;border:1px solid #243252;color:#eef2ff;border-radius:12px;padding:9px 10px;cursor:pointer;font:600 13px/1.3 inherit}
  .ai-mode small{display:block;color:#9fb0d0;font-weight:400;margin-top:2px}
  .ai-mode[aria-pressed=true]{border-color:#10a37f;background:rgba(16,163,127,.16)}
  .ai-panel textarea{width:100%;box-sizing:border-box;min-height:90px;resize:vertical;background:#0b1220;color:#eef2ff;border:1px solid #243252;border-radius:12px;padding:10px;font:15px/1.4 inherit;outline:none}
  .ai-panel textarea:focus{border-color:#7c9bff}
  .ai-row{display:flex;gap:8px;flex-wrap:wrap}
  .ai-go{flex:1 1 200px;background:#10a37f;color:#fff;border:0;border-radius:12px;padding:12px 14px;font:700 15px/1 inherit;cursor:pointer}
  .ai-copy{flex:0 0 auto;background:#111a2e;color:#eef2ff;border:1px solid #243252;border-radius:12px;padding:12px 14px;font:600 14px/1 inherit;cursor:pointer}
  .ai-note{font-size:12px;color:#9fb0d0}
  .ai-msg{font-size:13px;color:#5ee6c7;min-height:1em}
  .ai-topicbtn{display:inline-flex;align-items:center;gap:6px;margin:10px 8px 10px 0;background:rgba(16,163,127,.14);border:1px solid #10a37f;color:#5ee6c7;border-radius:12px;padding:9px 14px;font:600 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer}
  .ai-mini{margin-left:8px;vertical-align:middle;background:rgba(16,163,127,.14);border:1px solid #10a37f;color:#5ee6c7;border-radius:8px;padding:3px 8px;font:600 12px/1.2 -apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer}
  @media print{.ai-fab,.ai-topicbtn,.ai-mini{display:none}}
  `;
  document.head.appendChild(el("style", null, css));

  var MODES = [
    { id: "explain", t: "📖 Mavzuni tushuntir", s: "sodda tilda, misollar bilan" },
    { id: "solve", t: "🧮 Misolni yechib ber", s: "bosqichma-bosqich" },
    { id: "check", t: "✅ Yechimimni tekshir", s: "xatomni ko'rsat, javobni aytma" },
    { id: "practice", t: "📝 O'xshash misollar", s: "5 ta mashq + javoblari oxirida" },
    { id: "hint", t: "💡 Faqat maslahat ber", s: "o'zim yechishim uchun" },
    { id: "free", t: "💬 Erkin savol", s: "istalgan savol" }
  ];

  function buildPrompt(mode, topic, text) {
    var base = "Sen tajribali matematika o'qituvchisisan. Men kollej (11-sinf) o'quvchisiman. " +
      "Faqat o'zbek tilida (lotin yozuvida), sodda va aniq javob ber. Formulalarni oddiy matnda yoz (masalan x^2, sqrt(x)).";
    var tp = topic ? " Mavzu: \"" + topic + "\"." : "";
    var q = clean(text);
    var tasks = {
      explain: "Shu mavzuni menga tushuntirib ber: asosiy ta'rif va qoidalar, 2 ta namunaviy misolning bosqichma-bosqich yechimi va eng ko'p uchraydigan xatolar." + (q ? " Ayniqsa shu joyi tushunarsiz: " + q : ""),
      solve: "Quyidagi misolni bosqichma-bosqich yechib ber, har bir qadamda qaysi qoida ishlatilganini ayt, oxirida javobni tekshir:\n" + (q || "(misolni yozaman)"),
      check: "Men quyidagi misolni yechdim. Yechimimni tekshir: to'g'ri bo'lsa ayt, xato bo'lsa qaysi qadamda xato qilganimni ko'rsat va nima uchun xatoligini tushuntir, lekin to'g'ri javobni darhol aytma — o'zim tuzatib ko'ray:\n" + (q || "(misol va yechimimni yozaman)"),
      practice: "Shu mavzu bo'yicha 5 ta mashq tuz (osondan qiyinga). Javoblarni faqat oxirida, alohida \"Javoblar\" bo'limida ber." + (q ? " Qo'shimcha talab: " + q : ""),
      hint: "Quyidagi misolni o'zim yechmoqchiman. Menga to'liq yechimni aytma, faqat birinchi qadam uchun maslahat (yo'naltiruvchi savol) ber:\n" + (q || "(misolni yozaman)"),
      free: q || "Menga shu mavzu bo'yicha yordam kerak."
    };
    return base + tp + "\n\n" + tasks[mode];
  }

  // Sahifadagi mavzular
  function topics() {
    return $$("main > section.topic").map(function (s) {
      var h = $("h2", s); return { id: s.id, name: clean(h ? h.textContent : s.id), el: s };
    });
  }
  function currentTopicId() {
    var open = $$("main > section.topic:not(.collapsed)");
    if (open.length === 1) return open[0].id;
    var h = (location.hash || "").slice(1);
    return h && document.getElementById(h) ? h : "";
  }

  // Panel
  var bg = el("div", { class: "ai-bg" });
  var panel = el("div", { class: "ai-panel", role: "dialog", "aria-label": "AI yordamchi" });
  panel.innerHTML =
    '<div class="ai-head"><b>🤖 AI yordamchi</b><button class="ai-x" type="button" aria-label="Yopish">✕</button></div>' +
    '<label class="ai-topic">Mavzu<select id="ai-topic"><option value="">— Umumiy savol —</option></select></label>' +
    '<div class="ai-modes"></div>' +
    '<textarea id="ai-text" placeholder="Misol yoki savolingizni yozing. Masalan: x^2 - 5x + 6 = 0 tenglamani yeching"></textarea>' +
    '<div class="ai-row"><button class="ai-go" type="button">ChatGPT\'da so\'rash ↗</button><button class="ai-copy" type="button">📋 Nusxa</button></div>' +
    '<div class="ai-msg"></div>' +
    '<div class="ai-note">Savol tayyor ko\'rsatma bilan ChatGPT\'da yangi oynada ochiladi. AI ham xato qilishi mumkin — javobni darslikdagi qoidalar bilan solishtiring.</div>';
  document.body.append(bg, panel);

  var sel = $("#ai-topic", panel), ta = $("#ai-text", panel), msg = $(".ai-msg", panel), modesEl = $(".ai-modes", panel);
  var mode = "explain";
  MODES.forEach(function (m) {
    var b = el("button", { class: "ai-mode", type: "button", "data-m": m.id, "aria-pressed": m.id === mode ? "true" : "false" }, m.t + "<small>" + m.s + "</small>");
    b.onclick = function () { setMode(m.id); ta.focus(); };
    modesEl.appendChild(b);
  });
  function setMode(m) {
    mode = m;
    $$(".ai-mode", panel).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-m") === m ? "true" : "false"); });
  }
  function fillTopics() {
    sel.length = 1;
    topics().forEach(function (t) { sel.appendChild(el("option", { value: t.id }, t.name.replace(/</g, "&lt;"))); });
  }

  function open(opts) {
    opts = opts || {};
    fillTopics();
    sel.value = opts.topic != null ? opts.topic : currentTopicId();
    if (opts.mode) setMode(opts.mode);
    if (opts.text != null) ta.value = opts.text;
    msg.textContent = "";
    bg.classList.add("on"); panel.classList.add("on");
    setTimeout(function () { ta.focus(); }, 50);
  }
  function close() { bg.classList.remove("on"); panel.classList.remove("on"); }
  window.kaAI = { open: open, close: close };

  function topicName() { var o = sel.options[sel.selectedIndex]; return sel.value ? clean(o.textContent) : ""; }
  function prompt() { return buildPrompt(mode, topicName(), ta.value); }
  function ask(p) {
    var url = "https://chatgpt.com/?q=" + encodeURIComponent(p);
    var w = window.open(url, "_blank", "noopener");
    if (!w) location.href = url;
  }
  function copy(p) {
    function done() { msg.textContent = "Nusxa olindi ✅ — ChatGPT yoki boshqa AI'ga joylashtiring (Ctrl+V)."; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(p).then(done, fallback);
    else fallback();
    function fallback() {
      var t = el("textarea"); t.value = p; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch (e) { msg.textContent = "Nusxa olinmadi."; }
      t.remove();
    }
  }
  $(".ai-go", panel).onclick = function () {
    if ((mode === "solve" || mode === "check" || mode === "hint") && !clean(ta.value)) {
      msg.textContent = "Avval misolni yozing ✏️"; ta.focus(); return;
    }
    ask(prompt());
  };
  $(".ai-copy", panel).onclick = function () { copy(prompt()); };
  $(".ai-x", panel).onclick = close;
  bg.onclick = close;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) $(".ai-go", panel).click(); });

  // Suzuvchi tugma (chap pastda)
  var fab = el("button", { class: "ai-fab", type: "button", title: "AI yordamchi (ChatGPT)" }, "🤖 AI yordamchi");
  fab.onclick = function () { open(); };
  document.body.appendChild(fab);

  // Har bir mavzuga tugma + namunaviy misollarga "🤖" tugmasi
  topics().forEach(function (t) {
    var body = $(".topic-body", t.el) || t.el;
    var b = el("button", { class: "ai-topicbtn", type: "button" }, "🤖 AI'dan so'rash");
    b.onclick = function () { open({ topic: t.id, mode: "explain", text: "" }); };
    var draw = $(".ka-drawbtn", body);
    if (draw && draw.parentNode === body) body.insertBefore(b, draw.nextSibling);
    else body.insertBefore(b, body.firstChild);

    $$(".savol", body).forEach(function (p) {
      var m = el("button", { class: "ai-mini", type: "button", title: "Shu misolni AI bilan tahlil qilish" }, "🤖");
      m.onclick = function () {
        var txt = clean(p.textContent.replace(/^\s*\d+\s*-\s*misol\s*:\s*/i, ""));
        open({ topic: t.id, mode: "hint", text: txt });
      };
      p.appendChild(m);
    });
  });

  // Yon menyu va header'ga havola
  var dBody = $(".ka-drawer-body");
  if (dBody) {
    var db = el("button", { type: "button", class: "ka-drawbtn", style: "width:100%;justify-content:center;margin-top:0;border-color:#10a37f;color:#5ee6c7" }, "🤖 AI yordamchi (ChatGPT)");
    db.onclick = function () { document.documentElement.classList.remove("ka-open"); open(); };
    var after = dBody.children[1] || null;
    dBody.insertBefore(db, after ? after.nextSibling : null);
  }
  var nav = $("header nav");
  if (nav) {
    var a = el("a", { href: "#ai" }, "🤖 AI yordamchi");
    a.addEventListener("click", function (e) { e.preventDefault(); open(); });
    var admin = $$("a", nav).filter(function (x) { return /admin/i.test(x.textContent); })[0];
    nav.insertBefore(a, admin || null);
  }
  if (location.hash === "#ai") setTimeout(function () { open(); }, 300);
})();
