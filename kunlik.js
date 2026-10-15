/*! Kuvonch Academy — kun maqolasi, ob-havo va USD/UZS kursi */
(function () {
  "use strict";
  var ARTICLES = [
    { t: "Pifagor teoremasi", m: "To'g'ri burchakli uchburchakda gipotenuza kvadrati katetlar kvadratlari yig'indisiga teng: c² = a² + b². Bu teorema qurilish va geodeziyada keng qo'llaniladi." },
    { t: "Pi soni (π)", m: "Aylana uzunligining diametriga nisbati π ≈ 3,14159 ga teng. U irratsional son bo'lib, kasr ko'rinishida to'liq yozib bo'lmaydi." },
    { t: "Fibonachchi ketma-ketligi", m: "1, 1, 2, 3, 5, 8, 13, ... — har bir had o'zidan oldingi ikki hadning yig'indisiga teng. Bu ketma-ketlik tabiatda ham uchraydi." },
    { t: "Tub sonlar cheksiz ko'p", m: "Evklid miloddan avvalgi III asrda tub sonlar cheksiz ko'p ekanini isbotlagan. Bu isbot matematikaning eng qadimgi go'zal dalillaridan biri." },
    { t: "Gauss yig'indisi", m: "1 dan 100 gacha sonlarning yig'indisi 5050 ga teng. Hikoyaga ko'ra, yosh Gauss buni arifmetik progressiya formulasi bilan tez hisoblagan." },
    { t: "Nolning faktoriali", m: "0! = 1. Bu ta'rif kombinatorika formulalarini sodda va izchil qilish uchun qabul qilingan." },
    { t: "Doira yuzi", m: "Doira yuzi S = πr² formulasi bilan topiladi. Radius ikki marta oshsa, yuz to'rt marta oshadi." },
    { t: "Ikkilik sanoq sistemasi", m: "Kompyuterlar barcha ma'lumotni faqat 0 va 1 bilan saqlaydi. Ikkilik sanoq sistemasi shu asosda ishlaydi." }
  ];
  var WMO = { 0: "Ochiq", 1: "Asosan ochiq", 2: "Qisman bulutli", 3: "Bulutli", 45: "Tuman", 48: "Qirovli tuman",
    51: "Mayda yomg'ir", 53: "Yomg'ir", 55: "Kuchli yomg'ir", 61: "Yomg'ir", 63: "Yomg'ir", 65: "Kuchli yomg'ir",
    71: "Qor", 73: "Qor", 75: "Kuchli qor", 80: "Jala", 81: "Jala", 82: "Kuchli jala", 95: "Momaqaldiroq", 96: "Momaqaldiroq", 99: "Kuchli momaqaldiroq" };
  var el = document.getElementById("ka-kunlik");
  if (!el) return;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function dayIndex() {
    var d = new Date(), start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  }
  function card(title, body) {
    return '<div style="flex:1 1 240px;background:#0e1628;border:1px solid #243252;border-radius:14px;padding:14px 16px">' +
      '<div style="font:700 12px/1 inherit;color:#9fb0d0;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">' + title + '</div>' + body + '</div>';
  }
  var art = ARTICLES[dayIndex() % ARTICLES.length];
  var artHTML = card("Kun maqolasi", '<div style="font-weight:700;color:#eef2ff;margin-bottom:6px">' + esc(art.t) + '</div><div style="color:#c9d4ff;font-size:14.5px;line-height:1.5">' + esc(art.m) + '</div>');
  var wID = "ka-kunlik-w", cID = "ka-kunlik-c";
  el.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:12px;max-width:1100px;margin:18px auto;padding:0 16px">' +
    artHTML +
    card("Ob-havo", '<div id="' + wID + '" style="color:#c9d4ff;font-size:14.5px">Joylashuv aniqlanmoqda…</div>') +
    card("Valyuta · USD → so'm", '<div id="' + cID + '" style="color:#c9d4ff;font-size:14.5px">Kurs yuklanmoqda…</div>') +
    '</div>';

  function fmt(n, d) { return Number(n).toLocaleString("ru-RU", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/ /g, " "); }
  function weather(lat, lon, label) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,weather_code&timezone=auto";
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      var c = j.current || {}, box = document.getElementById(wID);
      if (!box || c.temperature_2m == null) return;
      box.innerHTML = '<div style="font-size:26px;font-weight:800;color:#eef2ff">' + Math.round(c.temperature_2m) + '°C</div>' +
        '<div>' + esc(WMO[c.weather_code] || "Ob-havo") + ' · ' + esc(label) + '</div>';
    }).catch(function () { var box = document.getElementById(wID); if (box) box.textContent = "Ob-havo ma'lumoti topilmadi."; });
  }
  function startWeather() {
    var fallback = function () { weather(41.31, 69.24, "Toshkent"); };
    if (!navigator.geolocation) return fallback();
    navigator.geolocation.getCurrentPosition(function (p) {
      weather(p.coords.latitude.toFixed(2), p.coords.longitude.toFixed(2), "sizning joyingiz");
    }, fallback, { timeout: 8000, maximumAge: 1800000 });
  }
  function rate() {
    fetch("https://cbu.uz/ru/arkhiv-kursov-valyut/json/").then(function (r) { return r.json(); }).then(function (list) {
      var u = (list || []).filter(function (x) { return x.Ccy === "USD"; })[0], box = document.getElementById(cID);
      if (!u || !box) return;
      var diff = parseFloat(String(u.Diff).replace(",", ".")) || 0;
      box.innerHTML = '<div style="font-size:26px;font-weight:800;color:#eef2ff">' + fmt(parseFloat(u.Rate), 2) + " so'm</div>" +
        '<div>1 AQSH dollari · ' + (diff >= 0 ? "▲ +" : "▼ ") + fmt(diff, 2) + " · " + esc(u.Date) + '</div>';
    }).catch(function () { var box = document.getElementById(cID); if (box) box.textContent = "Kurs ma'lumoti topilmadi."; });
  }
  startWeather();
  rate();
})();
