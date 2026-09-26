/*!
 * Kuvonch Academy — o'quvchi akkounti va coinlar
 * - Akkount ochish (ism, guruh, rasm yoki avatar, ixtiyoriy 4 xonali PIN)
 * - Test oynasi ochilganda akkount tanlanmagan bo'lsa, avval kirish so'raladi
 * - Testdagi har bir to'g'ri javob uchun +10 coin (har savolga bir marta, birinchi tanlov hisoblanadi)
 * - Tarix, daraja, shu qurilmadagi reyting
 * Ma'lumotlar shu brauzerda (localStorage) saqlanadi — server kerak emas.
 * Ulash: <script src="akkount.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaAcc) return;
  window.__kaAcc = true;

  var COIN_PER_CORRECT = 10;
  var LS = "ka.akkountlar.v1", LS_CUR = "ka.joriy.v1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").replace(/[ʻʼ‘’`]/g, "'").replace(/[−–—]/g, "-").replace(/\s+/g, " ").trim().toLowerCase(); }

  // ---------- Saqlash ----------
  function load() { try { var d = JSON.parse(localStorage.getItem(LS) || "{}"); return d && typeof d === "object" ? d : {}; } catch (e) { return {}; } }
  var DB = load();
  var memOnly = false;
  function save() { try { localStorage.setItem(LS, JSON.stringify(DB)); } catch (e) { memOnly = true; } }
  function curId() { try { return localStorage.getItem(LS_CUR) || ""; } catch (e) { return window.__kaCur || ""; } }
  function setCur(id) { window.__kaCur = id; try { if (id) localStorage.setItem(LS_CUR, id); else localStorage.removeItem(LS_CUR); } catch (e) {} }
  function me() { var id = curId(); return id && DB[id] ? DB[id] : null; }

  async function hashPin(pin) {
    var s = "ka-salt:" + pin;
    try {
      var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    } catch (e) { var h = 0; for (var i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0; return "h" + h; }
  }

  // ---------- Avatarlar ----------
  var AVATARS = [["🦊", "#ff9f43"], ["🐼", "#8395a7"], ["🦁", "#feca57"], ["🐯", "#ff6b6b"], ["🐸", "#1dd1a1"], ["🐧", "#54a0ff"],
    ["🦉", "#a55eea"], ["🐬", "#48dbfb"], ["🚀", "#5f27cd"], ["⭐", "#f6b93b"], ["🧠", "#ff7f9f"], ["📐", "#10ac84"]];
  function avatarHTML(u, size) {
    size = size || 40;
    var st = "width:" + size + "px;height:" + size + "px;font-size:" + Math.round(size * 0.55) + "px";
    if (u && u.photo) return '<span class="acc-av" style="' + st + '"><img src="' + u.photo + '" alt=""></span>';
    var a = AVATARS[(u && u.av) || 0] || AVATARS[0];
    return '<span class="acc-av" style="' + st + ";background:" + a[1] + '">' + a[0] + "</span>";
  }
  function level(c) { return Math.floor((c || 0) / 100) + 1; }
  var TITLES = ["Yangi o'quvchi", "Izlanuvchi", "Hisobchi", "Bilimdon", "Matematik", "Ustoz", "Akademik", "Grossmeyster"];
  function title(c) { return TITLES[Math.min(TITLES.length - 1, level(c) - 1)]; }

  // Rasmni 256×256 ga kichraytirib saqlash
  function readPhoto(file, cb) {
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var S = 256, c = document.createElement("canvas"); c.width = c.height = S;
        var x = c.getContext("2d"), m = Math.min(img.width, img.height);
        x.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { cb(null); };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }

  // ---------- CSS ----------
  var css = `
  .acc-av{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;flex:0 0 auto;line-height:1;box-shadow:0 0 0 2px rgba(255,255,255,.15)}
  .acc-av img{width:100%;height:100%;object-fit:cover}
  .acc-chip{display:inline-flex;align-items:center;gap:8px;background:#141f38;border:1px solid #243252;border-radius:999px;padding:4px 12px 4px 4px;color:#eef2ff;cursor:pointer;font:700 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;white-space:nowrap}
  .acc-chip:hover{border-color:#7c9bff}
  .acc-chip .coin{color:#ffd479}
  .acc-bg{position:fixed;inset:0;z-index:3000;background:rgba(3,7,16,.78);display:none;align-items:flex-start;justify-content:center;overflow-y:auto;padding:24px 12px}
  .acc-bg.on{display:flex}
  .acc-card{width:min(640px,100%);background:#141f38;color:#eef2ff;border:1px solid #243252;border-radius:22px;overflow:hidden;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 30px 80px rgba(0,0,0,.6);margin:auto 0}
  .acc-cover{position:relative;height:110px;background:linear-gradient(120deg,#6a5af9,#8b5cf6 45%,#10a37f)}
  .acc-cover .acc-x{position:absolute;right:10px;top:10px;background:rgba(0,0,0,.25);border:0;color:#fff;font-size:20px;border-radius:50%;width:36px;height:36px;cursor:pointer}
  .acc-top{display:flex;align-items:flex-end;gap:16px;padding:0 20px;margin-top:-56px;position:relative}
  .acc-top .acc-av{box-shadow:0 0 0 5px #141f38}
  .acc-name{padding-bottom:6px;min-width:0}
  .acc-name h3{margin:0;font-size:22px;line-height:1.2;word-break:break-word}
  .acc-name .sub{color:#9fb0d0;font-size:13px}
  .acc-body{padding:16px 20px 20px;display:flex;flex-direction:column;gap:14px}
  .acc-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  @media (max-width:520px){.acc-stats{grid-template-columns:repeat(2,1fr)}}
  .acc-stat{background:#0e1628;border:1px solid #243252;border-radius:14px;padding:10px;text-align:center}
  .acc-stat b{display:block;font:800 22px/1.1 ui-monospace,monospace;font-variant-numeric:tabular-nums}
  .acc-stat span{font-size:11px;color:#9fb0d0;text-transform:uppercase;letter-spacing:.06em}
  .acc-stat.coin b{color:#ffd479}
  .acc-bar{height:10px;border-radius:99px;background:#0b1220;border:1px solid #243252;overflow:hidden}
  .acc-bar i{display:block;height:100%;background:linear-gradient(90deg,#ffd479,#ff9f43)}
  .acc-tabs{display:flex;gap:6px;flex-wrap:wrap}
  .acc-tab{background:#111a2e;border:1px solid #243252;color:#9fb0d0;border-radius:999px;padding:7px 12px;font:600 13px/1 inherit;cursor:pointer}
  .acc-tab[aria-selected=true]{background:#7c9bff;color:#0b1220;border-color:transparent}
  .acc-list{display:flex;flex-direction:column;gap:6px;max-height:300px;overflow-y:auto}
  .acc-row{display:flex;align-items:center;gap:10px;background:#0e1628;border:1px solid #243252;border-radius:12px;padding:8px 10px}
  .acc-row .grow{flex:1;min-width:0}
  .acc-row .t{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .acc-row .d{font-size:12px;color:#9fb0d0}
  .acc-row .c{font:700 14px/1 ui-monospace,monospace;color:#ffd479;white-space:nowrap}
  .acc-row.me{border-color:#7c9bff}
  .acc-empty{color:#9fb0d0;padding:8px 2px}
  .acc-btns{display:flex;gap:8px;flex-wrap:wrap}
  .acc-btn{background:#111a2e;border:1px solid #243252;color:#eef2ff;border-radius:12px;padding:10px 14px;font:600 14px/1 inherit;cursor:pointer}
  .acc-btn.primary{background:linear-gradient(135deg,#6a5af9,#8b5cf6);border-color:transparent;color:#fff}
  .acc-btn.danger{color:#ff8585}
  .acc-form{display:flex;flex-direction:column;gap:10px}
  .acc-form label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:#9fb0d0;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
  .acc-form input{background:#0b1220;border:1px solid #243252;color:#eef2ff;border-radius:10px;padding:10px 12px;font:500 15px/1.2 inherit;text-transform:none;letter-spacing:0;outline:none}
  .acc-form input:focus{border-color:#7c9bff}
  .acc-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  @media (max-width:520px){.acc-grid2{grid-template-columns:1fr}}
  .acc-avpick{display:flex;flex-wrap:wrap;gap:8px}
  .acc-avpick button{border:2px solid transparent;background:none;padding:2px;border-radius:50%;cursor:pointer}
  .acc-avpick button[aria-pressed=true]{border-color:#ffd479}
  .acc-photo{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .acc-msg{min-height:1.2em;font-size:13px;color:#ff8585}
  .acc-msg.ok{color:#5ee6c7}
  .acc-users{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px}
  .acc-user{display:flex;flex-direction:column;align-items:center;gap:6px;background:#0e1628;border:1px solid #243252;border-radius:14px;padding:12px 6px;cursor:pointer;color:#eef2ff;font:600 13px/1.2 inherit;text-align:center}
  .acc-user:hover{border-color:#7c9bff}
  .acc-user small{color:#ffd479;font-weight:700}
  .acc-banner{background:rgba(255,212,121,.12);border:1px solid rgba(255,212,121,.4);color:#ffe4a3;border-radius:12px;padding:10px 12px;font-size:13.5px}
  .acc-toast{position:fixed;left:50%;top:18px;transform:translate(-50%,-30px);z-index:4000;background:#ffd479;color:#2b1d00;font:800 16px/1 -apple-system,BlinkMacSystemFont,sans-serif;padding:10px 16px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.4);opacity:0;transition:all .25s;pointer-events:none}
  .acc-toast.on{opacity:1;transform:translate(-50%,0)}
  .acc-fixed{position:fixed;right:16px;top:12px;z-index:960}
  `;
  document.head.appendChild(el("style", null, css));

  // ---------- Oynalar ----------
  var bg = el("div", { class: "acc-bg", role: "dialog", "aria-label": "Akkount" });
  var card = el("div", { class: "acc-card" });
  bg.appendChild(card);
  document.body.appendChild(bg);
  var gate = null; // test oldidan kirish talab qilinganda
  bg.addEventListener("click", function (e) { if (e.target === bg && !gate) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && bg.classList.contains("on") && !gate) close(); });
  function open() { bg.classList.add("on"); }
  function close() { bg.classList.remove("on"); }

  var toastEl = el("div", { class: "acc-toast" });
  document.body.appendChild(toastEl);
  var toastT;
  function toast(t) { toastEl.textContent = t; toastEl.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("on"); }, 1400); }

  // Header'dagi chip
  var chip = el("button", { class: "acc-chip", type: "button", title: "Akkount" });
  chip.onclick = function () { me() ? showProfile() : showLogin(); };
  var header = $(".wrap > header");
  if (header) header.appendChild(chip); else { chip.classList.add("acc-fixed"); document.body.appendChild(chip); }
  function renderChip() {
    var u = me();
    chip.innerHTML = u ? avatarHTML(u, 28) + '<span>' + esc(u.name.split(" ")[0]) + '</span><span class="coin">🪙 ' + (u.coins || 0) + "</span>"
      : '<span class="acc-av" style="width:28px;height:28px;font-size:15px;background:#243252">👤</span><span>Kirish</span>';
  }

  // Kirish / tanlash oynasi
  function showLogin(msg) {
    var ids = Object.keys(DB).sort(function (a, b) { return (DB[b].last || 0) - (DB[a].last || 0); });
    card.innerHTML = '<div class="acc-cover"><button class="acc-x" type="button" aria-label="Yopish">✕</button></div>' +
      '<div class="acc-body" style="padding-top:18px"><h3 style="margin:0;font-size:22px">👤 Akkountga kirish</h3>' +
      (gate ? '<div class="acc-banner">Test boshlashdan oldin akkountingizni tanlang yoki yangisini oching — to\'g\'ri javoblar uchun coinlar shu akkountga yoziladi (har bir to\'g\'ri javob +' + COIN_PER_CORRECT + ' 🪙).</div>' : "") +
      (msg ? '<div class="acc-msg">' + esc(msg) + "</div>" : "") +
      (ids.length ? '<div class="acc-users">' + ids.map(function (id) { var u = DB[id]; return '<button class="acc-user" type="button" data-id="' + id + '">' + avatarHTML(u, 56) + "<span>" + esc(u.name) + "</span><small>🪙 " + (u.coins || 0) + "</small></button>"; }).join("") + "</div>"
        : '<div class="acc-empty">Bu qurilmada hali akkount yo\'q.</div>') +
      '<div class="acc-btns"><button class="acc-btn primary" type="button" data-a="new">➕ Yangi akkount ochish</button>' +
      (gate ? '<button class="acc-btn" type="button" data-a="skip">Akkountsiz davom etish</button>' : "") + "</div>" +
      (memOnly ? '<div class="acc-banner">Brauzer ma\'lumot saqlashga ruxsat bermayapti (maxfiy oyna?). Akkount sahifa yopilguncha ishlaydi.</div>' : "") +
      "</div>";
    $(".acc-x", card).onclick = function () { gate ? skipGate() : close(); };
    $('[data-a="new"]', card).onclick = function () { showForm(); };
    var sk = $('[data-a="skip"]', card); if (sk) sk.onclick = skipGate;
    $$(".acc-user", card).forEach(function (b) { b.onclick = function () { askPin(b.getAttribute("data-id")); }; });
    open();
  }

  function askPin(id) {
    var u = DB[id];
    if (!u.pin) return login(id);
    card.innerHTML = '<div class="acc-cover"><button class="acc-x" type="button">✕</button></div>' +
      '<div class="acc-top">' + avatarHTML(u, 96) + '<div class="acc-name"><h3>' + esc(u.name) + '</h3><div class="sub">' + esc(u.group || "") + "</div></div></div>" +
      '<div class="acc-body"><form class="acc-form"><label>PIN kod<input type="password" inputmode="numeric" maxlength="4" autocomplete="off" required></label>' +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">Kirish</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div></form></div>';
    var f = $("form", card), inp = $("input", f);
    $(".acc-x", card).onclick = function () { gate ? skipGate() : close(); };
    $('[data-a="back"]', card).onclick = function () { showLogin(); };
    f.onsubmit = async function (e) {
      e.preventDefault();
      if ((await hashPin(inp.value)) === u.pin) login(id);
      else { $(".acc-msg", f).textContent = "PIN noto'g'ri."; inp.value = ""; inp.focus(); }
    };
    setTimeout(function () { inp.focus(); }, 50);
  }

  function login(id) {
    setCur(id); DB[id].last = Date.now(); save(); renderChip();
    toast("Xush kelibsiz, " + DB[id].name.split(" ")[0] + "! 👋");
    if (gate) { var g = gate; gate = null; close(); g(); } else showProfile();
  }
  function logout() { setCur(""); renderChip(); showLogin(); }

  // Yangi akkount / tahrirlash
  function showForm(editId) {
    var u = editId ? DB[editId] : { name: "", group: "", av: Math.floor(Math.random() * AVATARS.length), photo: null };
    var draft = { av: u.av || 0, photo: u.photo || null };
    card.innerHTML = '<div class="acc-cover"><button class="acc-x" type="button">✕</button></div>' +
      '<div class="acc-top"><span class="pv"></span><div class="acc-name"><h3>' + (editId ? "Akkountni tahrirlash" : "Yangi akkount") + '</h3><div class="sub">Rasm yuklang yoki avatar tanlang</div></div></div>' +
      '<div class="acc-body"><form class="acc-form">' +
      '<div class="acc-photo"><label class="acc-btn" style="text-transform:none;letter-spacing:0;font-size:14px;color:#eef2ff;flex-direction:row;cursor:pointer">📷 Rasm yuklash<input type="file" accept="image/*" hidden></label>' +
      '<button class="acc-btn" type="button" data-a="nophoto">Rasmni olib tashlash</button></div>' +
      '<div class="acc-avpick">' + AVATARS.map(function (a, i) { return '<button type="button" data-av="' + i + '" aria-label="Avatar">' + avatarHTML({ av: i }, 40) + "</button>"; }).join("") + "</div>" +
      '<div class="acc-grid2"><label>Ism va familiya<input name="name" maxlength="40" required placeholder="Masalan: Aziza Karimova"></label>' +
      '<label>Guruh<input name="group" maxlength="20" placeholder="Masalan: 05-25"></label></div>' +
      '<label>PIN kod (4 ta raqam, ixtiyoriy)<input name="pin" type="password" inputmode="numeric" maxlength="4" pattern="\\d{4}" autocomplete="new-password" placeholder="' + (editId && u.pin ? "o'zgartirmaslik uchun bo'sh qoldiring" : "boshqalar kira olmasligi uchun") + '"></label>' +
      '<div class="acc-msg"></div><div class="acc-btns"><button class="acc-btn primary" type="submit">' + (editId ? "Saqlash" : "Akkount ochish") + '</button><button class="acc-btn" type="button" data-a="back">← Orqaga</button></div>' +
      "</form></div>";
    var f = $("form", card), pv = $(".pv", card), msg = $(".acc-msg", f);
    f.name.value = u.name || ""; f.group.value = u.group || "";
    function redraw() {
      pv.innerHTML = avatarHTML({ av: draft.av, photo: draft.photo }, 110);
      $$(".acc-avpick button", f).forEach(function (b) { b.setAttribute("aria-pressed", !draft.photo && +b.getAttribute("data-av") === draft.av ? "true" : "false"); });
    }
    redraw();
    $$(".acc-avpick button", f).forEach(function (b) { b.onclick = function () { draft.av = +b.getAttribute("data-av"); draft.photo = null; redraw(); }; });
    $('input[type=file]', f).onchange = function () {
      var file = this.files && this.files[0]; if (!file) return;
      msg.textContent = "";
      readPhoto(file, function (d) { if (d) { draft.photo = d; redraw(); } else msg.textContent = "Rasmni o'qib bo'lmadi."; });
    };
    $('[data-a="nophoto"]', f).onclick = function () { draft.photo = null; redraw(); };
    $(".acc-x", card).onclick = function () { gate ? skipGate() : close(); };
    $('[data-a="back"]', card).onclick = function () { editId ? showProfile() : showLogin(); };
    f.onsubmit = async function (e) {
      e.preventDefault();
      var name = f.name.value.trim().replace(/\s+/g, " "), pin = f.pin.value.trim();
      if (name.length < 2) { msg.textContent = "Ismni yozing."; return; }
      if (pin && !/^\d{4}$/.test(pin)) { msg.textContent = "PIN 4 ta raqamdan iborat bo'lsin."; return; }
      var dup = Object.keys(DB).some(function (id) { return id !== editId && norm(DB[id].name) === norm(name) && norm(DB[id].group) === norm(f.group.value); });
      if (dup) { msg.textContent = "Bu ism va guruh bilan akkount allaqachon bor — ro'yxatdan tanlang."; return; }
      var id = editId || ("u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
      var rec = DB[id] || { coins: 0, correct: 0, answered: 0, tests: 0, history: [], created: Date.now(), done: {} };
      rec.name = name; rec.group = f.group.value.trim(); rec.av = draft.av; rec.photo = draft.photo;
      if (pin) rec.pin = await hashPin(pin);
      DB[id] = rec; save();
      if (editId) { renderChip(); showProfile(); toast("Saqlandi ✅"); }
      else login(id);
    };
    setTimeout(function () { f.name.focus(); }, 50);
    open();
  }

  // Profil (kengaytirilgan akkount sahifasi)
  function showProfile(tab) {
    var u = me(); if (!u) return showLogin();
    tab = tab || "tarix";
    var c = u.coins || 0, lv = level(c), pct = c % 100;
    var acc = u.answered ? Math.round((u.correct || 0) / u.answered * 100) : 0;
    card.innerHTML = '<div class="acc-cover"><button class="acc-x" type="button" aria-label="Yopish">✕</button></div>' +
      '<div class="acc-top">' + avatarHTML(u, 110) + '<div class="acc-name"><h3>' + esc(u.name) + '</h3><div class="sub">' + esc(u.group ? u.group + " guruh · " : "") + lv + "-daraja · " + title(c) + "</div></div></div>" +
      '<div class="acc-body">' +
      '<div class="acc-stats"><div class="acc-stat coin"><b>' + c + '</b><span>🪙 Coin</span></div><div class="acc-stat"><b>' + (u.tests || 0) + '</b><span>Testlar</span></div>' +
      '<div class="acc-stat"><b>' + (u.correct || 0) + '</b><span>To\'g\'ri javob</span></div><div class="acc-stat"><b>' + acc + '%</b><span>Aniqlik</span></div></div>' +
      '<div><div style="display:flex;justify-content:space-between;font-size:12px;color:#9fb0d0;margin-bottom:4px"><span>' + lv + "-daraja</span><span>" + pct + " / 100 🪙 → " + (lv + 1) + "-daraja</span></div>" +
      '<div class="acc-bar"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="acc-tabs"><button class="acc-tab" data-t="tarix" type="button">📜 Tarix</button><button class="acc-tab" data-t="reyting" type="button">🏆 Reyting</button></div>' +
      '<div class="acc-list"></div>' +
      '<div class="acc-btns"><button class="acc-btn" type="button" data-a="edit">✏️ Tahrirlash / rasm</button><button class="acc-btn" type="button" data-a="switch">🔄 Boshqa akkount</button>' +
      '<button class="acc-btn" type="button" data-a="logout">🚪 Chiqish</button><button class="acc-btn danger" type="button" data-a="del">🗑 O\'chirish</button></div>' +
      '<div style="font-size:12px;color:#9fb0d0">Har bir testdagi to\'g\'ri javob uchun +' + COIN_PER_CORRECT + " 🪙. Akkount shu qurilmadagi brauzerda saqlanadi.</div></div>";
    $$(".acc-tab", card).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-t") === tab ? "true" : "false"); b.onclick = function () { showProfile(b.getAttribute("data-t")); }; });
    var list = $(".acc-list", card);
    if (tab === "tarix") {
      var h = (u.history || []).slice().reverse();
      list.innerHTML = h.length ? h.map(function (r) {
        return '<div class="acc-row"><div class="grow"><div class="t">' + esc(r.test) + '</div><div class="d">' + new Date(r.at).toLocaleString("uz-UZ") + " · " + r.correct + "/" + r.answered + ' to\'g\'ri</div></div><div class="c">+' + r.coins + " 🪙</div></div>";
      }).join("") : '<div class="acc-empty">Hali test yechilmagan. Mavzudagi testni oching — har bir to\'g\'ri javob +' + COIN_PER_CORRECT + " 🪙.</div>";
    } else {
      var ids = Object.keys(DB).sort(function (a, b) { return (DB[b].coins || 0) - (DB[a].coins || 0); });
      var medal = ["🥇", "🥈", "🥉"], cid = curId();
      list.innerHTML = ids.map(function (id, i) {
        var x = DB[id];
        return '<div class="acc-row' + (id === cid ? " me" : "") + '"><b style="width:26px;text-align:center">' + (medal[i] || i + 1) + "</b>" + avatarHTML(x, 34) +
          '<div class="grow"><div class="t">' + esc(x.name) + '</div><div class="d">' + esc(x.group || "") + " · " + level(x.coins) + '-daraja</div></div><div class="c">' + (x.coins || 0) + " 🪙</div></div>";
      }).join("");
    }
    $(".acc-x", card).onclick = close;
    $('[data-a="edit"]', card).onclick = function () { showForm(curId()); };
    $('[data-a="switch"]', card).onclick = function () { showLogin(); };
    $('[data-a="logout"]', card).onclick = logout;
    $('[data-a="del"]', card).onclick = function () {
      var b = this;
      if (b.dataset.sure) { delete DB[curId()]; save(); setCur(""); renderChip(); showLogin(); return; }
      b.dataset.sure = "1"; b.textContent = "Rostdan o'chirilsinmi? Yana bosing";
    };
    open();
  }

  // ---------- Test oynasini kuzatish ----------
  var modal = document.getElementById("testModal");
  var session = null; // {title, answered:{}, correct, coins}
  function modalVisible() { if (!modal) return false; var cs = getComputedStyle(modal); return cs.display !== "none" && cs.visibility !== "hidden" && modal.getClientRects().length > 0 && modal.offsetHeight > 0 && !modal.hidden; }
  function testsObj() { try { return typeof TESTS !== "undefined" ? TESTS : null; } catch (e) { return null; } }
  function modalTitle() {
    if (!modal) return "Test";
    var m = /([^\n]{3,90}?)\s+[—-]\s+savol\s+\d+/i.exec(modal.innerText || "");
    if (m) return m[1].trim();
    var h = $("h1,h2,h3,.test-title", modal);
    return h ? h.textContent.replace(/\s+/g, " ").trim().slice(0, 80) : "Test";
  }
  function startSession() {
    if (session) return;
    session = { title: modalTitle(), answered: {}, correct: 0, n: 0, coins: 0, user: curId() };
  }
  function endSession() {
    if (!session) return;
    var s = session; session = null;
    var u = s.user && DB[s.user];
    if (!u || !s.n) return;
    u.tests = (u.tests || 0) + 1;
    u.history = (u.history || []).concat([{ test: s.title, at: Date.now(), answered: s.n, correct: s.correct, coins: s.coins }]).slice(-60);
    save();
  }
  function skipGate() { var g = gate; gate = null; close(); if (g) g(); }

  function onModalChange() {
    var vis = modalVisible();
    if (vis && !session) {
      if (!me() && !gate) {
        // Test ochildi, lekin akkount tanlanmagan — avval kirish
        gate = function () { startSession(); };
        showLogin();
      } else if (!gate) startSession();
    } else if (!vis && session) endSession();
    else if (!vis && gate) { gate = null; close(); }
  }
  if (modal) {
    new MutationObserver(onModalChange).observe(modal, { attributes: true, childList: true, subtree: false, attributeFilter: ["class", "style", "hidden", "open"] });
    setInterval(onModalChange, 800);
  }

  // Javobni aniqlash: bosilgan matn savolning variantlaridan biriga mosmi?
  function stripLabel(t) { return norm(t).replace(/^[a-dа-г]\s*[).:\]]\s*/i, "").replace(/\s*[✓✔✗✘]\s*$/, ""); }
  function findQuestion(target) {
    var T = testsObj(); if (!T) return null;
    var all = [];
    Object.keys(T).forEach(function (k) { if (Array.isArray(T[k])) T[k].forEach(function (q) { if (q && q.q && Array.isArray(q.options)) all.push(q); }); });
    var node = target;
    while (node && node !== modal.parentNode) {
      var txt = norm(node.textContent);
      var hits = all.filter(function (q) { var nq = norm(q.q); return nq.length > 2 && txt.indexOf(nq) > -1; });
      if (hits.length) {
        // eng uzun mos savol (qisqa savol boshqasining ichida bo'lishi mumkin)
        hits.sort(function (a, b) { return norm(b.q).length - norm(a.q).length; });
        return hits[0];
      }
      node = node.parentNode;
    }
    return null;
  }
  document.addEventListener("click", function (e) {
    if (!modal || !session || !modal.contains(e.target)) return;
    var t = e.target.closest("button, li, label, .option, [data-index], [role=button], a, div");
    if (!t) return;
    var chosen = stripLabel(t.textContent);
    if (!chosen || chosen.length > 120) return;
    var q = findQuestion(t);
    if (!q) return;
    var opts = q.options.map(stripLabel), idx = opts.indexOf(chosen);
    if (idx < 0) return;
    var key = norm(q.q);
    if (session.answered[key]) return; // har savolga faqat birinchi tanlov
    session.answered[key] = 1;
    session.n++;
    var u = session.user && DB[session.user];
    var ok = idx === q.correct;
    if (u) {
      u.answered = (u.answered || 0) + 1;
      if (ok) { u.correct = (u.correct || 0) + 1; u.coins = (u.coins || 0) + COIN_PER_CORRECT; session.coins += COIN_PER_CORRECT; }
      save(); renderChip();
    }
    if (ok) { session.correct++; if (u) toast("+" + COIN_PER_CORRECT + " 🪙"); }
  }, true);

  // Boshqa modullar uchun
  window.kaAccount = {
    me: me, open: function () { me() ? showProfile() : showLogin(); },
    addCoins: function (n, why) { var u = me(); if (!u) return false; u.coins = (u.coins || 0) + n; save(); renderChip(); toast("+" + n + " 🪙"); return true; }
  };
  renderChip();
  if (location.hash === "#akkount") setTimeout(function () { window.kaAccount.open(); }, 300);
})();
