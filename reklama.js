/*!
 * Kuvonch Academy — BOLALARGA MOS REKLAMA (Google AdSense)
 *  statistika.js orqali barcha sahifalarga avtomatik ulanadi — HTML'ga hech narsa qo'shish shart emas.
 *
 *  Qoidalar:
 *   - Faqat o'quv/o'qish sahifalarida, sahifa oxirida (footer oldidan) BITTA reklama bloki.
 *   - O'yin, test, kamera (Virtual), akkaunt, Pro, o'qituvchi paneli sahifalarida reklama YO'Q —
 *     bola tasodifan bosib yubormasligi uchun (AdSense qoidasi ham shuni talab qiladi).
 *   - Android ilovada (WebView) reklama YO'Q — AdSense ilova ichida ruxsat etilmaydi.
 *   - Har bir so'rov "bola" deb belgilanadi (data-tag-for-age-treatment="1"):
 *     shaxsiylashtirilgan reklama va remarketing o'chadi, bolalar uchun himoya qo'llanadi.
 *   - Reklama to'lmasa (unfilled) — blok butunlay yashiriladi.
 *
 *  ======================= SOZLAMA =======================
 *  PUB  — AdSense nashriyotchi ID: "ca-pub-1234567890123456"
 *         (AdSense → Hisob → Hisob ma'lumotlari → Nashriyotchi ID)
 *  SLOT — displey reklama bloki raqami: "1234567890"
 *         (AdSense → Reklamalar → Reklama bloki bo'yicha → Displey reklama → kod ichidagi data-ad-slot)
 *  PUB bo'sh bo'lsa — butunlay o'chiq. Faqat PUB bo'lsa — AdSense tekshiruvi uchun kutubxona yuklanadi.
 *  =======================================================
 */
(function () {
  "use strict";
  var PUB = "";
  var SLOT = "";

  if (window.__kaAds) return; window.__kaAds = 1;
  if (!/^ca-pub-\d{10,20}$/.test(PUB)) return;
  if (/localhost|127\.0\.0\.1/.test(location.hostname)) return;
  if (/KuvonchAcademyApp/.test(navigator.userAgent)) return;

  // Reklama ruxsat etilgan sahifalar (qolganlarida — yo'q)
  var RUXSAT = /^\/(index\.html)?$|^\/(mashqlar|noldan-pigacha|qollanma|sat-dars|desmos|sertifikat|yonalish|era-\d+)\.html$|^\/(english|rus-tili)\/([a-z0-9-]+\.html)?$/;
  if (!RUXSAT.test(location.pathname)) return;

  var LABEL = { uz: "Reklama", ru: "Реклама", en: "Advertisement", kk: "Жарнама", ky: "Жарнама" };
  var til = "uz"; try { til = localStorage.getItem("ka.til") || "uz"; } catch (e) {}

  function kutubxona() {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    var s = document.createElement("script");
    s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + PUB;
    document.head.appendChild(s);
  }

  function blok() {
    if (!/^\d{6,12}$/.test(SLOT) || document.querySelector(".ka-rek")) return;
    var css = document.createElement("style");
    css.textContent =
      ".ka-rek{max-width:1080px;margin:36px auto 0;padding:0 16px;box-sizing:border-box}" +
      ".ka-rek-t{font:600 11px/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#7f8db0;margin:0 0 6px 2px}" +
      ".ka-rek ins{display:block;min-height:90px;border-radius:12px;overflow:hidden}" +
      ".ka-rek:has(ins[data-ad-status='unfilled']){display:none}";
    document.head.appendChild(css);

    var box = document.createElement("aside");
    box.className = "ka-rek";
    box.setAttribute("aria-label", LABEL[til] || LABEL.uz);
    box.innerHTML =
      '<div class="ka-rek-t">' + (LABEL[til] || LABEL.uz) + "</div>" +
      '<ins class="adsbygoogle" data-ad-client="' + PUB + '" data-ad-slot="' + SLOT + '"' +
      ' data-ad-format="auto" data-full-width-responsive="true" data-tag-for-age-treatment="1"></ins>';

    var foot = document.querySelector("footer");
    if (foot && foot.parentNode) foot.parentNode.insertBefore(box, foot); else document.body.appendChild(box);

    // To'lmagan blok eski brauzerlarda ham yashirilsin (:has() bo'lmasa)
    var ins = box.querySelector("ins");
    try {
      new MutationObserver(function () {
        if (ins.getAttribute("data-ad-status") === "unfilled") box.style.display = "none";
      }).observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    } catch (e) {}

    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  // Sahifa to'liq yuklanib bo'lgach, bo'sh vaqtda — o'quvchini kuttirmaydi
  function go() { kutubxona(); blok(); }
  function later() { if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 8000 }); else setTimeout(go, 3000); }
  if (document.readyState === "complete") later(); else window.addEventListener("load", later);
})();
