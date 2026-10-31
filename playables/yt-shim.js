/* Kuvonch Academy — YouTube Playables shim
   Bu fayl o'yin sahifasida akkount.js, statistika.js, ka-bulut.js va ka-boshqaruv.js
   o'rnini bosadi (tashqi so'rovsiz), hamda YouTube Playables SDK (window.ytgame)
   bilan bog'laydi. Oddiy brauzerda ham xavfsiz ishlaydi. */
(function () {
  "use strict";
  var noop = function () {};
  var resolved = function () { return Promise.resolve({ ok: true, json: function () { return Promise.resolve({}); }, text: function () { return Promise.resolve(""); } }); };

  /* --- akkount.js o'rnini bosuvchi stub --- */
  if (!window.kaAccount) {
    window.kaAccount = {
      me: function () { return null; },
      open: noop, close: noop,
      addCoins: noop,
      sendResult: function () { return Promise.resolve(false); },
      onChange: noop
    };
  }
  window.__kaAcc = null;
  window.__kaCur = null;
  window.changeIdentity = noop;

  /* --- statistika.js (GA / Yandex / AdSense) o'rnini bosuvchi stub --- */
  window.gtag = noop; window.ym = noop; window.dataLayer = window.dataLayer || [];
  window.__kaGA = null; window.__kaYM = null; window.__kaAdsLd = true;

  /* --- ka-boshqaruv.js (kamera/mikrofon boshqaruvi) — Playables'da yo'q --- */
  if (!window.kaControl) {
    window.kaControl = {
      preload: noop,
      start: function () { return Promise.reject(new Error("Bu rejim YouTube Playables'da mavjud emas")); },
      stop: noop
    };
  }

  /* --- Google Sheets natija yuborish — o'chirilgan --- */
  window.__ytNoFetch = resolved;

  /* --- Playables SDK bog'lanishi --- */
  var yt = window.ytgame;
  var audioOn = true;
  function setAudio(on) {
    audioOn = !!on;
    window.__ytAudioEnabled = audioOn;
    try {
      var els = document.querySelectorAll("audio,video");
      for (var i = 0; i < els.length; i++) els[i].muted = !audioOn;
    } catch (e) {}
    try { window.dispatchEvent(new CustomEvent("yt-audio", { detail: { enabled: audioOn } })); } catch (e) {}
  }
  function fire(name) {
    try { window.dispatchEvent(new CustomEvent(name)); } catch (e) {}
  }
  if (yt && yt.system) {
    try {
      if (yt.system.onPause) yt.system.onPause(function () { window.__ytPaused = true; fire("yt-pause"); });
      if (yt.system.onResume) yt.system.onResume(function () { window.__ytPaused = false; fire("yt-resume"); });
      if (yt.system.onAudioEnabledChange) yt.system.onAudioEnabledChange(setAudio);
      if (yt.system.isAudioEnabled) setAudio(yt.system.isAudioEnabled());
    } catch (e) {}
  }
  /* Saqlash: localStorage o'rniga SDK saqlovi (bo'lsa) */
  window.ytSave = {
    load: function () {
      if (yt && yt.game && yt.game.loadData) return yt.game.loadData().then(function (s) { try { return s ? JSON.parse(s) : {}; } catch (e) { return {}; } });
      try { return Promise.resolve(JSON.parse(localStorage.getItem("ka-yt-save") || "{}")); } catch (e) { return Promise.resolve({}); }
    },
    save: function (obj) {
      var s = JSON.stringify(obj || {});
      if (yt && yt.game && yt.game.saveData) return yt.game.saveData(s);
      try { localStorage.setItem("ka-yt-save", s); } catch (e) {}
      return Promise.resolve();
    }
  };
  /* O'yin yuklandi — YouTube'ga xabar */
  function ready() {
    try { if (yt && yt.game && yt.game.gameReady) yt.game.gameReady(); } catch (e) {}
    try { if (yt && yt.game && yt.game.firstFrameReady) yt.game.firstFrameReady(); } catch (e) {}
  }
  if (document.readyState === "complete") setTimeout(ready, 0);
  else window.addEventListener("load", function () { setTimeout(ready, 0); });
})();
