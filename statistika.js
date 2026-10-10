/* Kuvonch Academy — anonim tashrif statistikasi (Google Analytics 4). Ism/guruh yuborilmaydi. */
(function () {
  "use strict";
  var ID = "G-PWVVKHD3ET";
  if (window.__kaGA || /localhost|127\.0\.0\.1/.test(location.hostname)) return;
  window.__kaGA = 1;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", ID, { anonymize_ip: true });
  var s = document.createElement("script");
  s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
  document.head.appendChild(s);
})();
