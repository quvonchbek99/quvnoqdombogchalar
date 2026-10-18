/*! Kuvonch Academy — Desmos grafik kalkulyatori paneli (Digital SAT'dagi kabi test ichida)
 *  API: window.kaDesmos.open(host?, expressions?) / .close() / .toggle(host?) / .set(expressions) / .calc()
 *  Kalit: window.KA_DESMOS_KEY (desmos.com/my-api dan olinadi). Bo'lmasa — Desmos'ning sinov (demo) kaliti ishlatiladi.
 */
(function () {
  "use strict";
  if (window.kaDesmos) return;
  var KEY = window.KA_DESMOS_KEY || "dcb31709b452b1cf9dc26972add0fda6";
  var SRC = "https://www.desmos.com/api/v1.11/calculator.js?apiKey=" + KEY;
  var panel = null, calc = null, loading = null;

  var css = "" +
    ".kd-panel{position:fixed;right:0;top:0;bottom:0;width:min(46vw,560px);z-index:2147483000;background:#0b1220;border-left:1px solid #243252;display:flex;flex-direction:column;box-shadow:-10px 0 30px rgba(0,0,0,.45)}" +
    ".kd-top{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid #243252;background:#0e1628;color:#eef2ff;font:700 13px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}" +
    ".kd-top b{margin-right:auto}.kd-top button{background:#1a2a52;border:1px solid #7c9bff;color:#eef2ff;border-radius:9px;padding:7px 10px;font:700 12px/1 inherit;cursor:pointer}" +
    ".kd-body{flex:1;min-height:0;background:#fff}.kd-body>div{width:100%;height:100%}" +
    ".kd-note{padding:6px 10px;color:#9fb0d0;font:500 11.5px/1.4 inherit;border-top:1px solid #243252;background:#0e1628}" +
    "@media(max-width:760px){.kd-panel{left:0;right:0;top:auto;width:auto;height:62vh;border-left:0;border-top:1px solid #243252;border-radius:16px 16px 0 0}}";

  function style() { if (document.getElementById("kd-css")) return; var s = document.createElement("style"); s.id = "kd-css"; s.textContent = css; document.head.appendChild(s); }
  function load() {
    if (window.Desmos) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (ok, bad) {
      var s = document.createElement("script"); s.src = SRC; s.async = true;
      s.onload = function () { ok(); }; s.onerror = function () { loading = null; bad(new Error("desmos")); };
      document.head.appendChild(s);
    });
    return loading;
  }
  function build(host) {
    style();
    panel = document.createElement("div"); panel.className = "kd-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Desmos kalkulyator");
    panel.innerHTML = '<div class="kd-top"><b>🧮 Desmos — grafik kalkulyator</b><button type="button" data-k="clear">Tozalash</button><button type="button" data-k="close">✕ Yopish</button></div><div class="kd-body"><div></div></div><div class="kd-note">Digital SAT\'da Desmos ruxsat etilgan: tenglamani y = … ko\'rinishida kiriting, kesishma nuqtasini bosing. <a href="desmos.html" target="_blank" rel="noopener" style="color:#7c9bff">O\'rganish →</a></div>';
    (host || document.body).appendChild(panel);
    panel.querySelector('[data-k="close"]').onclick = close;
    panel.querySelector('[data-k="clear"]').onclick = function () { if (calc) calc.setBlank(); };
    var mount = panel.querySelector(".kd-body > div");
    mount.textContent = "Yuklanmoqda…"; mount.style.cssText = "display:flex;align-items:center;justify-content:center;color:#555;font:600 14px/1 system-ui";
    return load().then(function () {
      mount.textContent = ""; mount.style.cssText = "";
      calc = window.Desmos.GraphingCalculator(mount, { expressions: true, settingsMenu: false, zoomButtons: true, keypad: true, border: false, language: "en" });
    }).catch(function () { mount.textContent = "Desmos yuklanmadi (internet kerak)."; });
  }
  function open(host, exprs) {
    if (!panel) { var p = build(host); if (exprs) p.then(function () { set(exprs); }); return p; }
    panel.style.display = "flex"; if (exprs) set(exprs); return Promise.resolve();
  }
  function close() { if (panel) panel.style.display = "none"; }
  function isOpen() { return !!panel && panel.style.display !== "none"; }
  function toggle(host) { return isOpen() ? (close(), Promise.resolve()) : open(host); }
  function set(exprs) {
    if (!calc) return;
    calc.setBlank();
    (exprs || []).forEach(function (e, i) { calc.setExpression(typeof e === "string" ? { id: "e" + i, latex: e } : e); });
  }
  function destroy() { if (calc) { try { calc.destroy(); } catch (e) {} calc = null; } if (panel) { panel.remove(); panel = null; } }
  window.kaDesmos = { open: open, close: close, toggle: toggle, set: set, isOpen: isOpen, destroy: destroy, calc: function () { return calc; }, load: load };
})();
