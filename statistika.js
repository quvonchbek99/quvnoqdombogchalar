/* Kuvonch Academy — anonim tashrif statistikasi (Google Analytics 4 + Yandex Metrika). Ism/guruh yuborilmaydi. */
/* + Service worker barcha sahifalarda: o'yin modellari (qo'l/ko'z) bir marta yuklangach, keyingi safar keshdan darhol ochiladi */
(function () {
  try {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    var me = document.currentScript && document.currentScript.src;
    var sw = me ? me.replace(/statistika\.js(\?.*)?$/, "sw.js") : "sw.js";
    var reg = function () { navigator.serviceWorker.register(sw).catch(function () {}); };
    if (document.readyState === "complete") reg(); else window.addEventListener("load", reg);
  } catch (e) {}
})();
(function () {
  "use strict";
  var ID = "G-PWVVKHD3ET";
  if (window.__kaGA || /localhost|127\.0\.0\.1/.test(location.hostname)) return;
  window.__kaGA = 1;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", ID, { anonymize_ip: true });
  // Sahifa yuklanib bo'lgach, bo'sh vaqtda ulanadi — foydalanuvchini kuttirmaydi
  function go() { var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID; document.head.appendChild(s); }
  function later() { if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 8000 }); else setTimeout(go, 4000); }
  if (document.readyState === "complete") later(); else window.addEventListener("load", later);
})();

/* Bolalarga mos reklama (Google AdSense) — sozlama va qoidalar reklama.js ichida; ID yozilmaguncha o'chiq */
(function () {
  try {
    if (window.__kaAdsLd || /localhost|127\.0\.0\.1/.test(location.hostname)) return;
    window.__kaAdsLd = 1;
    var me = document.currentScript && document.currentScript.src;
    var s = document.createElement("script"); s.async = true;
    s.src = me ? me.replace(/statistika\.js(\?.*)?$/, "reklama.js") : "/reklama.js";
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
})();

/* Yandex Metrika — hisoblagich raqamini YM_ID ga yozing (metrika.yandex.ru). 0 bo'lsa o'chiq turadi. */
(function () {
  "use strict";
  var YM_ID = 0;
  if (!YM_ID || window.__kaYM || /localhost|127\.0\.0\.1/.test(location.hostname)) return;
  window.__kaYM = 1;
  // Vebvizor yozuvlarida o'quvchi kiritgan matn (ism, javob) saqlanmasin
  function yashir() {
    var el = document.querySelectorAll("input, textarea, [contenteditable]");
    for (var i = 0; i < el.length; i++) el[i].classList.add("ym-disable-keys");
  }
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = 1 * new Date();
  ym(YM_ID, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  function go() {
    yashir();
    try { new MutationObserver(yashir).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    var s = document.createElement("script"); s.async = true; s.src = "https://mc.yandex.ru/metrika/tag.js"; document.head.appendChild(s);
  }
  function later() { if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 8000 }); else setTimeout(go, 4000); }
  if (document.readyState === "complete") later(); else window.addEventListener("load", later);
})();
