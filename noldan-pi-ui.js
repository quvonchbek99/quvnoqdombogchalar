/*! Kuvonch Academy — "Noldan π gacha" interfeysi */
(function () {
  "use strict";
  var NP = window.kaNP; if (!NP) return;
  var $ = function (s) { return document.querySelector(s); };
  function el(t, a, h) { var e = document.createElement(t); if (a) for (var k in a) { if (k === "class") e.className = a[k]; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().replace(/[ʻʼ‘’'`]/g, "").replace(/\s+/g, " ").trim(); }
  var LS_LAST = "ka.np.last.v1";

  /* --- Google Sheets uchun mavzular ro'yxati --- */
  var bank = $("#np-bank");
  if (bank) NP.data.forEach(function (k) {
    k.u.forEach(function (u) {
      var s = el("section", { class: "topic", id: u.id });
      s.appendChild(el("h2", null, esc(u.t)));
      bank.appendChild(s);
    });
  });

  /* --- Kurslar ro'yxati --- */
  var LEVELS = [
    { n: 10, t: "Oson", d: "10 ta savol · tez sinov" },
    { n: 20, t: "O'rta", d: "20 ta savol · standart" },
    { n: 30, t: "Qiyin", d: "30 ta savol · chuqur" },
    { n: 50, t: "Olimpiada", d: "50 ta savol · marafon" }
  ];
  var cur = null, curLevel = 20;

  function mastery(u) {
    var p = NP.unitProg(u.id), b = p.best;
    if (!p.done) return { cls: "", txt: "—" };
    return { cls: b >= 80 ? "ok" : b >= 50 ? "mid" : "", txt: b + "%" };
  }

  function render(filter) {
    var box = $("#courses"); box.innerHTML = ""; var f = norm(filter), shown = 0;
    NP.data.forEach(function (k) {
      var units = f ? k.u.filter(function (u) { return norm(u.t).indexOf(f) >= 0 || norm(k.t).indexOf(f) >= 0; }) : k.u;
      if (!units.length) return;
      shown += units.length;
      var avg = NP.courseAvg(k);
      var c = el("div", { class: "course" + (f ? " open" : "") });
      c.style.setProperty("--cc", k.c);
      var head = el("div", { class: "chead" });
      head.appendChild(el("div", { class: "cico" }, k.i));
      head.appendChild(el("div", null, "<h2>" + esc(k.t) + "</h2><div class='sub'>" + esc(k.d) + " · " + k.u.length + " mavzu</div>"));
      head.appendChild(el("div", { class: "ring" }, "<span class='pct'>" + avg + "%</span><span class='arw'>›</span>"));
      head.addEventListener("click", function () { c.classList.toggle("open"); });
      c.appendChild(head);
      var bar = el("div", { class: "bar" }); var fill = el("i"); fill.style.width = avg + "%"; bar.appendChild(fill); c.appendChild(bar);
      var ul = el("div", { class: "units" });
      units.forEach(function (u) {
        var m = mastery(u);
        var b = el("button", { class: "unit", type: "button" },
          "<span class='n'>" + esc(u.t) + "</span><span class='m " + m.cls + "'>" + m.txt + "</span>");
        b.addEventListener("click", function () { openUnit(k, u); });
        ul.appendChild(b);
      });
      c.appendChild(ul);
      box.appendChild(c);
    });
    $("#nores").style.display = shown ? "none" : "";
    refreshStats();
  }

  function refreshStats() {
    var all = 0, sum = 0;
    NP.data.forEach(function (k) { k.u.forEach(function (u) { all++; sum += NP.unitProg(u.id).best; }); });
    $("#s-mavzu").textContent = all;
    $("#s-kurs").textContent = NP.data.length;
    $("#s-xp").textContent = NP.totalXP();
    $("#s-pct").textContent = Math.round(sum / all) + "%";
    try {
      var last = JSON.parse(localStorage.getItem(LS_LAST) || "null");
      if (last) {
        var btn = $("#btn-cont");
        btn.textContent = "▶ Davom ettirish: " + last.t;
        btn.style.display = "";
        btn.onclick = function () {
          NP.data.forEach(function (k) { k.u.forEach(function (u) { if (u.id === last.id) openUnit(k, u); }); });
        };
      }
    } catch (e) {}
  }

  /* --- Mavzu oynasi --- */
  function openUnit(k, u) {
    cur = { k: k, u: u };
    $("#m-kurs").textContent = k.i + "  " + k.t;
    $("#m-title").textContent = u.t;
    var p = NP.unitProg(u.id);
    $("#m-meta").innerHTML = "<span>⭐ Eng yaxshi: <b>" + p.best + "%</b></span><span>🔁 Urinishlar: <b>" + p.done + "</b></span><span>💎 <b>" + p.xp + " XP</b></span>";
    var lv = $("#m-levels"); lv.innerHTML = "";
    LEVELS.forEach(function (L) {
      var b = el("button", { class: "lv", type: "button", "aria-pressed": L.n === curLevel ? "true" : "false" },
        L.t + "<small>" + L.d + "</small>");
      b.addEventListener("click", function () {
        curLevel = L.n;
        Array.prototype.forEach.call(lv.children, function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
      });
      lv.appendChild(b);
    });
    $("#ov").classList.add("on");
  }
  $("#m-close").addEventListener("click", function () { $("#ov").classList.remove("on"); });
  $("#ov").addEventListener("click", function (e) { if (e.target === $("#ov")) $("#ov").classList.remove("on"); });

  /* --- Test --- */
  var T = null;
  $("#m-start").addEventListener("click", function () {
    if (!cur) return;
    $("#ov").classList.remove("on");
    try { localStorage.setItem(LS_LAST, JSON.stringify({ id: cur.u.id, t: cur.u.t })); } catch (e) {}
    startTest(cur.k, cur.u, curLevel);
  });

  function startTest(k, u, n) {
    var qs = NP.makeTest(u, n);
    T = { k: k, u: u, qs: qs, i: 0, right: 0, answered: false, sel: -1, wrong: [] };
    $("#t-title").textContent = u.t;
    $("#test").classList.add("on");
    document.body.style.overflow = "hidden";
    showQ();
  }
  function endTestUI() { $("#test").classList.remove("on"); document.body.style.overflow = ""; T = null; render($("#q").value); }
  $("#t-exit").addEventListener("click", function () { if (confirm("Testdan chiqasizmi? Natija saqlanmaydi.")) endTestUI(); });

  function showQ() {
    var q = T.qs[T.i];
    T.answered = false; T.sel = -1;
    $("#t-cnt").textContent = (T.i + 1) + "/" + T.qs.length;
    $("#t-bar").style.width = (T.i / T.qs.length * 100) + "%";
    var inner = $("#t-inner"); inner.innerHTML = "";
    inner.appendChild(el("div", { class: "q" }, esc(q.q)));
    var opts = el("div", { class: "opts" });
    q.options.forEach(function (o, i) {
      var b = el("button", { class: "opt", type: "button", "aria-pressed": "false" },
        "<span class='k'>" + "abcd".charAt(i) + "</span><span>" + esc(o) + "</span>");
      b.addEventListener("click", function () {
        if (T.answered) return;
        T.sel = i;
        Array.prototype.forEach.call(opts.children, function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        $("#t-next").disabled = false;
      });
      opts.appendChild(b);
    });
    inner.appendChild(opts);
    var sol = el("div", { class: "sol", id: "t-sol" }); inner.appendChild(sol);
    $("#t-next").disabled = true;
    $("#t-next").textContent = "Tekshirish";
    $("#t-foot").style.display = "";
    $(".tbody").scrollTop = 0;
  }

  $("#t-next").addEventListener("click", function () {
    if (!T) return;
    if (!T.answered) {
      var q = T.qs[T.i], opts = $("#t-inner").querySelectorAll(".opt");
      T.answered = true;
      Array.prototype.forEach.call(opts, function (b, i) {
        b.disabled = true;
        if (i === q.correct) b.classList.add("ok");
        else if (i === T.sel) b.classList.add("no");
      });
      if (T.sel === q.correct) T.right++;
      else T.wrong.push({ q: q.q, mine: q.options[T.sel], right: q.options[q.correct] });
      var sol = $("#t-sol");
      if (q.steps && q.steps.length) { sol.innerHTML = "<b>Yechim:</b><br>" + q.steps.map(esc).join("<br>"); sol.classList.add("on"); }
      else if (T.sel !== q.correct) { sol.innerHTML = "<b>To'g'ri javob:</b> " + esc(q.options[q.correct]); sol.classList.add("on"); }
      $("#t-next").textContent = (T.i + 1 >= T.qs.length) ? "Natijani ko'rish →" : "Keyingi →";
      $("#t-next").disabled = false;
      $("#t-bar").style.width = ((T.i + 1) / T.qs.length * 100) + "%";
    } else {
      T.i++;
      if (T.i >= T.qs.length) finish(); else showQ();
    }
  });
  $("#t-fin").addEventListener("click", function () { if (T && confirm("Testni shu yerda yakunlaysizmi?")) finish(); });

  function finish() {
    var total = T.i + (T.answered ? 1 : 0); if (!total) total = 1;
    var pct = Math.round(T.right / T.qs.length * 100);
    NP.record(T.u.id, pct, T.right);
    var inner = $("#t-inner"); inner.innerHTML = "";
    var face = pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📚";
    var res = el("div", { class: "res" },
      "<div style='font-size:46px'>" + face + "</div>" +
      "<div class='big'>" + pct + "%</div>" +
      "<div class='lbl'>" + T.qs.length + " ta savoldan <b>" + T.right + "</b> tasi to'g'ri</div>" +
      "<div class='xp'>+" + (T.right * 2) + " XP</div>");
    inner.appendChild(res);
    if (T.wrong.length) {
      var rev = el("div", { class: "review" });
      rev.appendChild(el("div", { style: "font-weight:800;margin-bottom:2px" }, "Xatolar ustida ishlash"));
      T.wrong.forEach(function (w) {
        rev.appendChild(el("div", { class: "rv" },
          esc(w.q) + "<br><span class='a1'>Sizning javobingiz: " + esc(w.mine == null ? "—" : w.mine) + "</span><br><span class='a2'>To'g'ri: " + esc(w.right) + "</span>"));
      });
      inner.appendChild(rev);
    }
    var k = T.k, u = T.u, n = T.qs.length;
    var row = el("div", { class: "row", style: "margin-top:20px" });
    var again = el("button", { class: "btn pri", type: "button" }, "🔄 Yana urinish");
    again.addEventListener("click", function () { startTest(k, u, n); });
    var back = el("button", { class: "btn", type: "button" }, "← Mavzularga");
    back.addEventListener("click", endTestUI);
    row.appendChild(back); row.appendChild(again);
    inner.appendChild(row);
    $("#t-foot").style.display = "none";
    $("#t-bar").style.width = "100%";
    $(".tbody").scrollTop = 0;
  }

  /* --- Qidiruv va tasodifiy --- */
  var tmr;
  $("#q").addEventListener("input", function () { clearTimeout(tmr); var v = this.value; tmr = setTimeout(function () { render(v); }, 150); });
  $("#btn-rand").addEventListener("click", function () {
    var k = NP.data[Math.floor(Math.random() * NP.data.length)];
    openUnit(k, k.u[Math.floor(Math.random() * k.u.length)]);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if ($("#ov").classList.contains("on")) $("#ov").classList.remove("on"); }
    if (T && $("#test").classList.contains("on")) {
      var i = "abcd".indexOf((e.key || "").toLowerCase());
      if (i >= 0) { var b = $("#t-inner").querySelectorAll(".opt")[i]; if (b && !b.disabled) b.click(); }
      if (e.key === "Enter" && !$("#t-next").disabled) $("#t-next").click();
    }
  });

  render("");
})();
