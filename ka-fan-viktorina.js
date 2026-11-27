/*! Kuvonch Academy — fan sahifasidagi «Viktorina» tezkor bloki.
   <div data-fan-viktorina="mat" data-root=""></div> — shu fan bilan viktorinani bir bosishda boshlaydi. */
(function () {
  "use strict";
  var NAMES = { mat: "Matematika", ingliz: "Ingliz tili", rus: "Rus tili", fizika: "Fizika" };
  var ICONS = { mat: "📐", ingliz: "🇬🇧", rus: "🇷🇺", fizika: "⚛️" };
  var css = ".kfv{box-sizing:border-box;max-width:1100px;margin:22px auto;padding:18px 20px;border-radius:20px;border:1px solid rgba(124,155,255,.28);background:linear-gradient(135deg,#16224a,#10203a 60%,#0e2f33);box-shadow:0 14px 34px -18px rgba(15,24,48,.7);color:#eef2ff;font-family:inherit;display:flex;flex-wrap:wrap;gap:14px;align-items:center}" +
    ".kfv *{box-sizing:border-box}.kfv-i{font-size:34px;line-height:1}.kfv-t{flex:1 1 220px;min-width:0}.kfv-t b{display:block;font-size:19px;font-weight:800}.kfv-t span{font-size:13.5px;color:#b9c6e6}" +
    ".kfv-c{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.kfv-c button,.kfv-c a{font:inherit;cursor:pointer;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid rgba(124,155,255,.4);background:#0b1226;color:#eef2ff;font-weight:700;font-size:15px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none}" +
    ".kfv-c button[aria-pressed=true]{background:#7c9bff;color:#0a1020;border-color:#7c9bff}.kfv-c .kfv-go{background:linear-gradient(135deg,#5ee6c7,#7c9bff);color:#07101f;border:0;padding:0 22px}" +
    ".kfv-c input{width:84px;min-height:44px;border-radius:12px;border:1px solid rgba(124,155,255,.4);background:#0b1226;color:#eef2ff;padding:0 10px;font-size:16px;text-align:center}";
  function mount(el) {
    var fan = el.getAttribute("data-fan-viktorina") || "mat", root = el.getAttribute("data-root") || "", n = 20;
    if (!document.getElementById("kfv-css")) { var s = document.createElement("style"); s.id = "kfv-css"; s.textContent = css; document.head.appendChild(s); }
    el.className = "kfv";
    el.innerHTML = '<div class="kfv-i" aria-hidden="true">' + (ICONS[fan] || "⚡") + '</div>' +
      '<div class="kfv-t"><b>' + (NAMES[fan] || "Fan") + ' viktorinasi</b><span>Savollar soni tanlang — viktorina shu fan bilan darhol boshlanadi</span></div>' +
      '<div class="kfv-c"><span class="kfv-p"></span><input type="number" min="1" max="300" value="20" inputmode="numeric" aria-label="Savollar soni"><button type="button" class="kfv-go">Boshlash ▶</button><a href="' + root + 'live/">🔴 Live xona</a></div>';
    var box = el.querySelector(".kfv-p"), inp = el.querySelector("input");
    [10, 20, 30, 50].forEach(function (v) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = v; b.setAttribute("aria-pressed", v === n);
      b.onclick = function () { inp.value = v; sync(); }; box.appendChild(b);
    });
    function sync() { Array.prototype.forEach.call(box.children, function (b) { b.setAttribute("aria-pressed", String(b.textContent === String(inp.value))); }); }
    inp.addEventListener("input", sync);
    el.querySelector(".kfv-go").onclick = function () {
      var v = Math.max(1, Math.min(300, parseInt(inp.value, 10) || 20));
      location.href = root + "viktorina.html?fan=" + encodeURIComponent(fan) + "&soni=" + v;
    };
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll("[data-fan-viktorina]"), mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
