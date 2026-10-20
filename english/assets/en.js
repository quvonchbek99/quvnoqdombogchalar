/* Kuvonch Academy — English bo'limi: umumiy yordamchilar */
(function () {
  "use strict";
  var P = "ka-en:";
  function load(k, d) { try { var v = localStorage.getItem(P + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var voice = null;
  function pickVoice() {
    try {
      var vs = speechSynthesis.getVoices() || [];
      voice = vs.filter(function (v) { return /^en[-_](US|GB)/i.test(v.lang); })[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
    } catch (e) {}
  }
  try { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
  function say(t, rate) {
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g, ""));
      u.lang = "en-US"; if (voice) u.voice = voice; u.rate = rate || 0.92;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function tabs(root, onChange) {
    var bs = root.querySelectorAll("[data-tab]");
    bs.forEach(function (b) {
      b.addEventListener("click", function () {
        bs.forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); var s = document.getElementById("tab-" + x.dataset.tab); if (s) s.hidden = x !== b; });
        if (onChange) onChange(b.dataset.tab);
      });
    });
  }
  window.EN = { load: load, save: save, esc: esc, say: say, shuffle: shuffle, tabs: tabs };
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
})();

/* navigatsiya: faol bo'limni ko'rinadigan joyga surish (telefonda) */
(function(){try{var a=document.querySelector("header.en nav [aria-current]");if(a){var n=a.parentNode;n.scrollLeft=Math.max(0,a.offsetLeft-n.clientWidth/2+a.offsetWidth/2)}}catch(e){}})();
