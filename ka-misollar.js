/*! Kuvonch Academy — «Misol va masalalar yechish»: har bir matematika mavzusi uchun 40 ta tayyor misol/masala
 *  (oson → o'rta → murakkab), har birining javobi va yechimi bilan. Ma'lumot: misollar/<mavzu>.json
 *  (saytning savol generatorlaridan oldindan tuzilgan — tools: /home/claude/gen/misollar.js uslubida).
 *  Ulanish: mashqlar.html — har bir <section class="topic" id="t5"> ga o'zi qo'shiladi;
 *           kitob.html va boshqa sahifalar — <div class="ka-ms-slot" data-t="s4m1"></div> qo'yilsa yetarli. */
(function () {
  "use strict";
  if (window.kaMisollar) return;
  var V = "20261116m";
  var IDS = {};
  "a1 a2 a3 a4 a5 a6 a7 a8".split(" ").forEach(function (x) { IDS[x] = 1; });
  for (var i = 1; i <= 102; i++) IDS["t" + i] = 1;
  [[1, 4], [2, 4], [3, 4], [4, 4], [5, 5], [6, 5], [7, 4], [8, 4], [9, 5]].forEach(function (g) { for (var m = 1; m <= g[1]; m++) IDS["s" + g[0] + "m" + m] = 1; });
  var base = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^\/]*(\?.*)?$/, "") : ""; })();
  var LV = ["", "oson", "o'rta", "murakkab"];
  var LS = "ka.misollar.v1";
  function st() { try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(LS, JSON.stringify(o)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // javobni solishtirish: bo'shliq, minus belgilari, vergul/nuqta, katta-kichik harf farq qilmaydi
  function norm(s) {
    return String(s == null ? "" : s).replace(/<[^>]+>/g, "").toLowerCase().replace(/[−–—]/g, "-").replace(/,(\d)/g, ".$1").replace(/\s+/g, "").replace(/[;]/g, ",").replace(/°/g, "").replace(/^x=/, "");
  }
  function same(a, b) {
    var x = norm(a), y = norm(b); if (!x) return false; if (x === y) return true;
    var nx = parseFloat(x), ny = parseFloat(y);
    if (!isNaN(nx) && !isNaN(ny) && /^-?[\d.]+$/.test(x) && /^-?[\d.]+$/.test(y)) return Math.abs(nx - ny) < 1e-6;
    // kasr: 3/4 = 0.75
    var fr = /^(-?\d+)\/(\d+)$/, a1 = fr.exec(x), b1 = fr.exec(y);
    var vx = a1 ? a1[1] / a1[2] : nx, vy = b1 ? b1[1] / b1[2] : ny;
    return (a1 || b1) && !isNaN(vx) && !isNaN(vy) && Math.abs(vx - vy) < 1e-6;
  }

  var css = ".ka-ms{margin:14px 0 6px;border:1px solid var(--border,rgba(127,140,170,.35));border-radius:14px;background:rgba(124,155,255,.05);padding:0 14px}" +
    ".ka-ms>summary{cursor:pointer;list-style:none;padding:12px 0;font-weight:800;font-size:15px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}" +
    ".ka-ms>summary::-webkit-details-marker{display:none}.ka-ms>summary:before{content:'▸';transition:transform .2s;color:var(--accent-2,#7c9bff)}.ka-ms[open]>summary:before{transform:rotate(90deg)}" +
    ".ka-ms>summary small{font-weight:600;color:var(--text-dim,#9fb0d0);font-size:12.5px}.ka-ms .ka-ms-pr{margin-left:auto;font-size:12.5px;color:var(--good,var(--accent,#5ee6c7))}" +
    ".ka-ms-tools{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}.ka-ms-tools button{border:1px solid var(--border,rgba(127,140,170,.35));background:var(--bg-soft,rgba(0,0,0,.15));color:inherit;border-radius:999px;padding:6px 11px;font:600 13px/1.2 inherit;cursor:pointer}" +
    ".ka-ms-tools button[aria-pressed=true]{background:var(--accent-2,#7c9bff);color:#0b1220;border-color:transparent}.ka-ms-tools .sp{flex:1}" +
    ".ka-ms-list{margin:0 0 12px;padding-left:26px}.ka-ms-list>li{margin:0 0 10px;padding:8px 0 0;border-top:1px dashed var(--border,rgba(127,140,170,.3));font-size:14.5px;line-height:1.55}.ka-ms-list>li:first-child{border-top:0}" +
    ".ka-ms-lv{display:inline-block;font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;padding:1px 7px;border-radius:999px;margin-right:6px;vertical-align:1px;color:#0b1220}" +
    ".ka-ms-lv.l1{background:#5ee6c7}.ka-ms-lv.l2{background:#ffd479}.ka-ms-lv.l3{background:#ffa36b}" +
    ".ka-ms-row{display:flex;gap:6px;align-items:center;margin-top:6px;flex-wrap:wrap}.ka-ms-row input{width:150px;max-width:50%;border:1px solid var(--border,rgba(127,140,170,.4));background:var(--bg,transparent);color:inherit;border-radius:9px;padding:6px 9px;font:600 14px inherit}" +
    ".ka-ms-row button{border:1px solid var(--border,rgba(127,140,170,.4));background:var(--bg-soft,rgba(0,0,0,.12));color:inherit;border-radius:9px;padding:6px 10px;font:700 13px inherit;cursor:pointer}" +
    ".ka-ms-fb{font-size:13px;font-weight:700}.ka-ms-fb.ok{color:var(--good,#5ee6c7)}.ka-ms-fb.bad{color:var(--bad,#ff8585)}" +
    ".ka-ms-sol{margin:6px 0 2px;padding:8px 10px;border-radius:10px;background:rgba(94,230,199,.07);border:1px solid rgba(94,230,199,.22);font-size:14px}.ka-ms-sol ol{margin:4px 0 0;padding-left:20px;color:var(--text-dim,#c9d4ff)}" +
    ".ka-ms-list>li.done>.ka-ms-q:after{content:' ✔';color:var(--good,#5ee6c7);font-weight:900}" +
    "@media print{.ka-ms{display:none!important}}";
  function css1() { if (document.getElementById("ka-ms-css")) return; var s = document.createElement("style"); s.id = "ka-ms-css"; s.textContent = css; document.head.appendChild(s); }

  var CACHE = {};
  function load(id) {
    if (!CACHE[id]) CACHE[id] = fetch(base + "misollar/" + id + ".json?v=" + V).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    return CACHE[id];
  }
  function progText(id) { var o = st()[id]; var n = o ? Object.keys(o).length : 0; return n ? "✔ " + n + "/40" : ""; }

  function render(box, D) {
    var id = D.id, solved = st()[id] || {};
    var h = '<div class="ka-ms-tools"><button type="button" data-f="0" aria-pressed="true">Hammasi</button><button type="button" data-f="1" aria-pressed="false">🟢 Oson</button><button type="button" data-f="2" aria-pressed="false">🟡 O\'rta</button><button type="button" data-f="3" aria-pressed="false">🟠 Murakkab</button><span class="sp"></span>' +
      '<button type="button" data-a="all">👁 Hamma javoblar</button><button type="button" data-a="print">🖨 Chop etish</button></div><ol class="ka-ms-list">';
    D.q.forEach(function (x, k) {
      h += '<li data-l="' + x[0] + '" data-k="' + k + '"' + (solved[k] ? ' class="done"' : "") + '><span class="ka-ms-lv l' + x[0] + '">' + LV[x[0]] + '</span><span class="ka-ms-q">' + x[1] + "</span>" +
        '<div class="ka-ms-row"><input type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="Javobingiz" aria-label="Javobingiz"><button type="button" data-a="chk">Tekshirish</button><button type="button" data-a="show">Javob va yechim</button><span class="ka-ms-fb"></span></div>' +
        '<div class="ka-ms-sol" hidden><b>Javob:</b> ' + x[2] + (x[3] && x[3].length ? '<ol>' + x[3].map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>" : "") + "</div></li>";
    });
    box.innerHTML = h + "</ol>";
    var list = box.querySelector(".ka-ms-list");
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || !box.contains(b)) return;
      if (b.hasAttribute("data-f")) {
        var f = +b.getAttribute("data-f");
        box.querySelectorAll("[data-f]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        list.querySelectorAll(":scope>li").forEach(function (li) { li.hidden = f && +li.getAttribute("data-l") !== f; });
        return;
      }
      var a = b.getAttribute("data-a");
      if (a === "all") { var anyHidden = list.querySelector(".ka-ms-sol[hidden]"); list.querySelectorAll(".ka-ms-sol").forEach(function (s) { s.hidden = !anyHidden; }); b.textContent = anyHidden ? "🙈 Javoblarni yashirish" : "👁 Hamma javoblar"; return; }
      if (a === "print") { printSet(D); return; }
      var li = b.closest("li[data-k]"); if (!li) return;
      var sol = li.querySelector(".ka-ms-sol"), fb = li.querySelector(".ka-ms-fb"), k = +li.getAttribute("data-k");
      if (a === "show") { sol.hidden = !sol.hidden; return; }
      if (a === "chk") check(li, D, k, sol, fb);
    });
    box.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || !e.target.matches(".ka-ms-row input")) return;
      e.preventDefault(); var li = e.target.closest("li[data-k]"), k = +li.getAttribute("data-k");
      check(li, D, k, li.querySelector(".ka-ms-sol"), li.querySelector(".ka-ms-fb"));
    });
  }
  function check(li, D, k, sol, fb) {
    var inp = li.querySelector("input"), v = inp.value.trim(); if (!v) { inp.focus(); return; }
    var ok = same(v, D.q[k][2]);
    li.__t = (li.__t || 0) + 1;
    fb.className = "ka-ms-fb " + (ok ? "ok" : "bad");
    if (ok) {
      fb.textContent = "✔ To'g'ri!"; sol.hidden = false; li.classList.add("done");
      var o = st(); o[D.id] = o[D.id] || {}; o[D.id][k] = 1; save(o);
      var pr = li.closest(".ka-ms").querySelector(".ka-ms-pr"); if (pr) pr.textContent = progText(D.id);
    } else {
      fb.textContent = li.__t >= 2 ? "✘ Noto'g'ri — yechimni ko'ring" : "✘ Noto'g'ri, yana urinib ko'ring";
      if (li.__t >= 2) sol.hidden = false;
    }
  }
  // Oq-qora printerga mos varaq: avval 40 ta savol, keyin javoblar (rangli fon yo'q)
  function printSet(D) {
    var w = window.open("", "_blank"); if (!w) { alert("Chop etish oynasini ochishga ruxsat bering (pop-up)."); return; }
    var qs = D.q.map(function (x, k) { return "<li>" + x[1] + ' <span class="lv">(' + LV[x[0]] + ")</span></li>"; }).join("");
    var as = D.q.map(function (x) { return "<li><b>" + x[2] + "</b>" + (x[3] && x[3].length ? " — " + x[3].join("; ") : "") + "</li>"; }).join("");
    w.document.write('<!DOCTYPE html><html lang="uz"><head><meta charset="utf-8"><title>' + esc(D.n) + ' — 40 ta misol va masala</title><style>' +
      'body{font:14px/1.5 "Times New Roman",serif;color:#000;background:#fff;margin:18mm 16mm}h1{font-size:18px;margin:0 0 4px}p.s{margin:0 0 12px;font-size:12px}' +
      'ol{padding-left:24px}li{margin:0 0 9px}.lv{font-size:11px}.ans{page-break-before:always}.ans li{margin:0 0 5px;font-size:13px}@page{margin:12mm}' +
      '</style></head><body><h1>' + esc(D.n) + '</h1><p class="s">Kuvonch Academy · kuvonch.uz · 40 ta misol va masala (oson → murakkab). Ism: ____________________  Sana: ___________</p>' +
      "<ol>" + qs + '</ol><div class="ans"><h1>Javoblar va yechimlar</h1><ol>' + as + "</ol></div></body></html>");
    w.document.close(); setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 400);
  }

  function mount(host, id, label) {
    if (!IDS[id] || host.__kaMs) return; host.__kaMs = 1; css1();
    var d = document.createElement("details"); d.className = "ka-ms";
    d.innerHTML = "<summary>✍️ Misol va masalalar yechish — 40 ta <small>" + esc(label || "javobi va yechimi bilan, oson → murakkab") + '</small><span class="ka-ms-pr">' + progText(id) + '</span></summary><div class="ka-ms-body"><p style="color:var(--text-dim,#9fb0d0);font-size:13.5px">Yuklanmoqda…</p></div>';
    host.appendChild(d);
    d.addEventListener("toggle", function () {
      if (!d.open || d.__ok) return; d.__ok = 1;
      var body = d.querySelector(".ka-ms-body");
      load(id).then(function (D) { render(body, D); }).catch(function () { d.__ok = 0; body.innerHTML = '<p style="color:var(--bad,#ff8585)">Yuklab bo\'lmadi — internetni tekshirib, qayta oching.</p>'; });
    });
    return d;
  }
  function scan(root) {
    root = root || document;
    // mashqlar.html: har bir mavzu bo'limi — test tugmasidan oldin
    root.querySelectorAll("section.topic[id]").forEach(function (sec) {
      if (sec.__kaMs || !IDS[sec.id]) return;
      var cta = sec.querySelector(".test-cta"), slot = document.createElement("div");
      if (cta) sec.insertBefore(slot, cta); else sec.appendChild(slot);
      sec.__kaMs = 1; mount(slot, sec.id);
    });
    // boshqa sahifalar: <div class="ka-ms-slot" data-t="s4m1" data-label="…">
    root.querySelectorAll(".ka-ms-slot[data-t]").forEach(function (el) { mount(el, el.getAttribute("data-t"), el.getAttribute("data-label")); });
  }
  window.kaMisollar = { mount: mount, scan: scan, has: function (id) { return !!IDS[id]; } };
  function boot() {
    scan();
    // sahifa keyin chizsa (kitob.html) — yangi joylarni ham topamiz (tez-tez emas: 300 ms da bir marta)
    var tq = 0;
    if (window.MutationObserver) new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) if (ms[i].addedNodes.length) { clearTimeout(tq); tq = setTimeout(scan, 300); break; } }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
