/*!
 * Kuvonch Academy — umumiy AI moduli (butun sayt uchun)
 *  - Gemini: Firebase AI Logic + App Check (reCAPTCHA, faqat kuvonch.uz uchun)
 *  - Bulut ovozi: Gemini TTS — telefonda o'zbekcha ovoz bo'lmasa ham tabiiy ayol (Kore) va erkak (Charon) ovozi
 * Eski brauzerlarda xato bermaydi (import() faqat ichkarida chaqiriladi), shunchaki ishlamaydi.
 * API: kaAI.load() -> Promise; kaAI.speak(text, mood, g) -> Promise (ovoz tugaganda); kaAI.stop(); kaAI.usable()
 */
(function () {
  "use strict";
  if (window.kaAI) return;
  var BASE = "https://www.gstatic.com/firebasejs/13.0.0/";
  var CFG = { apiKey: "AIzaSyAw1lBVzTYqbMfkXeWv5fzKX-ORgsGCXtc", authDomain: "kuvonch-academy.firebaseapp.com", projectId: "kuvonch-academy", storageBucket: "kuvonch-academy.firebasestorage.app", messagingSenderId: "135195218981", appId: "1:135195218981:web:661a5a028614a9eded5bcc" };
  var RECAPTCHA_KEY = "6Ld1sBkuAAAAANmZqRdMg6WXBQuE0sYGmX67i5kj"; // ochiq sayt kaliti (maxfiy emas)
  var imp = null; try { imp = new Function("u", "return import(u)"); } catch (e) { imp = null; }
  var S = { M: null, ai: null, off: 0, err: "" }, P = null;
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function load() {
    if (!imp || !window.Promise) return Promise.reject(new Error("brauzer eski"));
    if (!P) {
      P = Promise.all([imp(BASE + "firebase-app.js"), imp(BASE + "firebase-ai.js"), imp(BASE + "firebase-app-check.js")]).then(function (m) {
        var A = m[0], app = A.getApps().length ? A.getApp() : A.initializeApp(CFG);
        if (!window.__kaAppCheck) { try { m[2].initializeAppCheck(app, { provider: new m[2].ReCaptchaEnterpriseProvider(RECAPTCHA_KEY), isTokenAutoRefreshEnabled: true }); window.__kaAppCheck = 1; } catch (e) {} }
        S.M = m[1]; S.ai = m[1].getAI(app, { backend: new m[1].GoogleAIBackend() }); return S;
      });
      P["catch"](function () { P = null; });
    }
    return P;
  }

  /* ---------- Bulut ovozi (Gemini TTS) ---------- */
  var MODELS = ["gemini-3.8-flash-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];
  var VOICE = { f: "Kore", m: "Charon" };
  var STYLE = { neutral: "warm, friendly and gentle", happy: "cheerful and excited", love: "very warm and affectionate", think: "calm and thoughtful", strict: "firm, stern and a little angry", jealous: "dramatic and playfully jealous", sad: "soft and a little sad", wow: "surprised and amazed" };
  var DAY_LIMIT = 300, mi = Math.min(+lsGet("ka.tts.m", 0) || 0, MODELS.length - 1), cache = {};
  function today() { return new Date(Date.now() + 5 * 3600000).toISOString().slice(0, 10); }
  function dayN() { var d = lsGet("ka.tts.day", {}) || {}; return d.d === today() ? d.n | 0 : 0; }
  function dayInc() { lsSet("ka.tts.day", { d: today(), n: dayN() + 1 }); }
  function usable() { return !!imp && !!window.Promise && S.off <= Date.now() && dayN() < DAY_LIMIT && !!(window.AudioContext || window.webkitAudioContext); }
  var AC = null;
  function actx() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
    if (AC && AC.state === "suspended") { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  function bytes(b) { var s = atob(b), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  function pcm(by, rate) { var ac = actx(), n = by.length >> 1, buf = ac.createBuffer(1, n, rate), d = buf.getChannelData(0), dv = new DataView(by.buffer, by.byteOffset, by.byteLength); for (var i = 0; i < n; i++) d[i] = dv.getInt16(i * 2, true) / 32768; return buf; }
  function fail(e) {
    var m = String((e && ((e.code || "") + " " + (e.message || ""))) || e); S.err = m;
    S.off = Date.now() + (/429|quota|RESOURCE_EXHAUSTED|rate/i.test(m) ? 10 : 30) * 60000;
    try { console.warn("[Kuvi] TTS:", m); } catch (x) {}
  }
  function tryModel(text, mood, g, i) {
    var model = S.M.getGenerativeModel(S.ai, { model: MODELS[i], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE[g] || VOICE.f } } } } });
    var prompt = "Read the following text aloud in its own language (it is Uzbek unless it is clearly English or Russian). Speak in a " + (STYLE[mood] || STYLE.neutral) + " tone, at a natural, lively human pace, like a kind teacher talking to a student:\n" + text;
    return model.generateContent(prompt).then(function (r) {
      var resp = r.response, c = resp && resp.candidates && resp.candidates[0], parts = (c && c.content && c.content.parts) || [], p = null;
      for (var k = 0; k < parts.length; k++) if (parts[k].inlineData && parts[k].inlineData.data) { p = parts[k]; break; }
      if (!p) throw new Error("audio yo'q");
      if (i !== mi) { mi = i; lsSet("ka.tts.m", i); }
      var mt = p.inlineData.mimeType || "", by = bytes(p.inlineData.data), ac = actx();
      if (/wav|mpeg|mp3|ogg|webm/i.test(mt) || (by[0] === 0x52 && by[1] === 0x49 && by[2] === 0x46)) {
        return new Promise(function (res, rej) { ac.decodeAudioData(by.buffer.slice(by.byteOffset, by.byteOffset + by.byteLength), res, rej); });
      }
      return pcm(by, +((/rate=(\d+)/.exec(mt) || [])[1] || 24000));
    }, function (e) {
      var m = String((e && ((e.code || "") + " " + (e.message || ""))) || e);
      if (/404|not found|not supported|unknown model|does not support/i.test(m) && i < MODELS.length - 1) return tryModel(text, mood, g, i + 1);
      throw e;
    });
  }
  // matn -> AudioBuffer (bir xil gap qayta so'ralsa — xotiradan)
  function tts(text, mood, g) {
    var k = (g || "f") + "|" + (mood || "") + "|" + text;
    if (cache[k]) return cache[k];
    if (!usable()) return Promise.reject(new Error("bulut ovozi hozir yo'q"));
    dayInc();
    cache[k] = load().then(function () { if (!actx()) throw new Error("AudioContext yo'q"); return tryModel(text, mood, g, mi); });
    cache[k]["catch"](function (e) { delete cache[k]; fail(e); });
    return cache[k];
  }
  var cur = null;
  function play(buf) {
    return new Promise(function (res) {
      var ac = actx(); if (!ac) { res(); return; }
      stop();
      var src = ac.createBufferSource(), done = false; src.buffer = buf; src.connect(ac.destination); cur = src;
      function end() { if (done) return; done = true; if (cur === src) cur = null; res(); }
      src.onended = end; setTimeout(end, buf.duration * 1000 + 1500);
      try { src.start(0); } catch (e) { end(); }
    });
  }
  function stop() { if (cur) { var c = cur; cur = null; try { c.stop(); } catch (e) {} } }
  var gen = 0;
  // Gapni bulut ovozida aytadi; uzun matnni gaplarga bo'lib, hammasini birdaniga tayyorlaydi (uzilishsiz)
  function speak(text, mood, g) {
    var my = ++gen; stop();
    var parts = String(text || "").match(/[^.!?…]+[.!?…]*["»”]?\s*/g) || [String(text || "")], chunks = [], acc = "";
    for (var i = 0; i < parts.length; i++) { acc += parts[i]; if (acc.trim().length >= 28 || i === parts.length - 1) { if (acc.trim()) chunks.push(acc.trim()); acc = ""; } }
    var bufs = chunks.map(function (c) { return tts(c, mood, g); });
    var chain = Promise.resolve();
    bufs.forEach(function (bp) { chain = chain.then(function () { if (my !== gen) return; return bp.then(function (b) { if (my !== gen) return; return play(b); }); }); });
    return chain;
  }
  function cancel() { gen++; stop(); }

  /* ---------- Matn: qisqa izoh va tahlil (Gemini) ---------- */
  var TXT = ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-2.5-flash-lite"];
  function text(prompt, sys, i) {
    i = i || 0;
    return load().then(function () {
      var o = { model: TXT[i] }; if (sys) o.systemInstruction = sys;
      return S.M.getGenerativeModel(S.ai, o).generateContent(prompt).then(function (r) { return r.response.text(); });
    })["catch"](function (e) {
      var m = String((e && ((e.code || "") + " " + (e.message || ""))) || e);
      if (/404|not found|not supported/i.test(m) && i < TXT.length - 1) return text(prompt, sys, i + 1);
      throw e;
    });
  }
  window.kaAI = { text: text, load: load, tts: tts, speak: speak, stop: cancel, play: play, actx: actx, usable: usable, state: S };
})();
