/*! Kuvonch Academy — IELTS havolasi (til tanlagichi yonida) */
(function () {
  "use strict";
  if (document.getElementById("ka-ielts")) return;
  var HREF = "https://goprep.gg/uz?ref=solodevs.pro";
  var TITLE = "IELTS bo'yicha orzu qilgan ballni birinchi urinishda oling — GoPrep";
  function add() {
    if (document.getElementById("ka-ielts")) return;
    var a = document.createElement("a");
    a.id = "ka-ielts";
    a.href = HREF;
    a.target = "_blank";
    a.rel = "noopener sponsored";
    a.title = TITLE;
    a.setAttribute("aria-label", TITLE);
    a.textContent = "🎓 IELTS";
    a.style.cssText = "position:fixed;left:262px;top:8px;z-index:961;display:inline-flex;align-items:center;height:38px;padding:0 14px;box-sizing:border-box;border-radius:999px;background:#141f38;color:#ffd479;border:1px solid #243252;font:700 13px/1 -apple-system,BlinkMacSystemFont,sans-serif;text-decoration:none;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.35)";
    document.body.appendChild(a);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
