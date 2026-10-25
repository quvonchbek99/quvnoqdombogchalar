/*! Kuvonch Academy — ovozli kirish (intro)
 *  Rangli nurlar sahnasi + "Xush kelibsiz" ovozi (5 tilda: ovoz/intro/{uz,ru,en,kk,ky}.mp3).
 *  Brauzerlar ovozni faqat bosishdan keyin ruxsat beradi, shuning uchun "Kirish" tugmasi bor.
 *  Bir kunda bir marta ko'rsatiladi (?intro=1 — majburan). Esc yoki "Ovozsiz kirish" — o'tkazib yuborish.
 *  window.kaSalom.play() — salomlashuvni qayta eshittirish (bosh sahifadagi tugma).
 */
(function () {
  "use strict";
  if (window.kaSalom) return;
  var LANGS = { uz: 1, ru: 1, en: 1, kk: 1, ky: 1 };
  var TXT = {
    uz: { go: "Kirish", mute: "Ovozsiz kirish", say: "Assalomu alaykum! Kuvonch Academy'ga xush kelibsiz! Bugun birga nimani o'rganamiz?", tag: "Bepul ta'lim — o'zbek tilida", label: "Xush kelibsiz" },
    ru: { go: "Войти", mute: "Войти без звука", say: "Здравствуйте! Добро пожаловать в Kuvonch Academy! Что будем изучать сегодня?", tag: "Бесплатное обучение", label: "Добро пожаловать" },
    en: { go: "Enter", mute: "Enter without sound", say: "Hello! Welcome to Kuvonch Academy! What shall we learn today?", tag: "Free learning platform", label: "Welcome" },
    kk: { go: "Кіру", mute: "Дыбыссыз кіру", say: "Сәлеметсіз бе! Kuvonch Academy-ге қош келдіңіз! Бүгін не үйренеміз?", tag: "Тегін білім платформасы", label: "Қош келдіңіз" },
    ky: { go: "Кирүү", mute: "Үнсүз кирүү", say: "Саламатсызбы! Kuvonch Academy-ге кош келиңиз! Бүгүн эмнени үйрөнөбүз?", tag: "Акысыз билим платформасы", label: "Кош келиңиз" }
  };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function sstore(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function lang() {
    var l = window.kaTil && window.kaTil.get ? window.kaTil.get() : null;
    if (!l) { var q = /[?&]til=(uz|ru|en|kk|ky)\b/.exec(location.search); l = (q && q[1]) || store("ka.til") || "uz"; }
    return LANGS[l] ? l : "uz";
  }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Ovoz: sintez qilingan qo'ng'iroqcha + ovozli salomlashuv ---------- */
  var AC = null;
  function chime() {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var now = AC.currentTime + 0.02, out = AC.createGain(); out.gain.value = 0.16; out.connect(AC.destination);
      var echo = AC.createDelay(); echo.delayTime.value = 0.18; var fb = AC.createGain(); fb.gain.value = 0.32;
      echo.connect(fb); fb.connect(echo); echo.connect(out);
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = i % 2 ? "triangle" : "sine"; o.frequency.value = f;
        var t = now + i * 0.085;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.7, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
        o.connect(g); g.connect(out); g.connect(echo); o.start(t); o.stop(t + 1.6);
      });
      // yumshoq "shuv" — nur ochilishi
      var len = Math.floor(AC.sampleRate * 0.9), buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      var n = AC.createBufferSource(), bp = AC.createBiquadFilter(), ng = AC.createGain();
      n.buffer = buf; bp.type = "bandpass"; bp.Q.value = 1.4; bp.frequency.setValueAtTime(300, now); bp.frequency.exponentialRampToValueAtTime(5200, now + 0.8);
      ng.gain.value = 0.22; n.connect(bp); bp.connect(ng); ng.connect(out); n.start(now);
    } catch (e) {}
  }
  var voice = null, voiceLang = "";
  function getVoice(l) {
    if (!voice || voiceLang !== l) { try { voice = new Audio("ovoz/intro/" + l + ".mp3"); voice.preload = "auto"; voiceLang = l; } catch (e) { voice = null; } }
    return voice;
  }
  var btnHero = null;
  function speak(l) {
    var a = getVoice(l);
    if (!a) return;
    try { a.currentTime = 0; } catch (e) {}
    if (btnHero) btnHero.classList.add("on");
    var done = function () { if (btnHero) btnHero.classList.remove("on"); };
    a.onended = done; a.onerror = done;
    var p = a.play(); if (p && p.catch) p.catch(done);
  }

  window.kaSalom = {
    play: function () { chime(); var l = lang(); setTimeout(function () { speak(l); }, 260); if (window.kaNur) window.kaNur.flare(); }
  };

  function hookHeroButton() {
    btnHero = document.getElementById("salomBtn");
    if (btnHero) btnHero.addEventListener("click", function () { window.kaSalom.play(); });
  }

  /* ---------- Intro sahnasi ---------- */
  function shouldShow() {
    if (/[?&]intro=1\b/.test(location.search)) return true;
    if (/[?&]intro=0\b/.test(location.search)) return false;
    if (/KuvonchAcademyApp/.test(navigator.userAgent) && sstore("ka-intro")) return false;
    if (sstore("ka-intro")) return false;
    var t = +store("ka.intro.t") || 0;
    return Date.now() - t > 20 * 3600 * 1000;
  }

  var CSS = [
    "@property --kir{syntax:'<percentage>';inherits:false;initial-value:0%}",
    "#ka-intro{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;overflow:hidden;background:#04071a;color:#f3f5ff;font-family:'Golos Text',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-tap-highlight-color:transparent}",
    "#ka-intro .ki-aur{position:absolute;inset:-20%;background:radial-gradient(40% 35% at 25% 30%,rgba(53,240,196,.28),transparent 70%),radial-gradient(38% 34% at 78% 28%,rgba(162,123,255,.32),transparent 70%),radial-gradient(42% 36% at 70% 82%,rgba(255,94,142,.24),transparent 70%),radial-gradient(36% 30% at 22% 80%,rgba(255,194,61,.2),transparent 70%);filter:blur(24px);animation:kiAur 14s ease-in-out infinite alternate}",
    "@keyframes kiAur{to{transform:translate(3%,-2%) scale(1.08) rotate(6deg)}}",
    "#ka-intro .ki-rays{position:absolute;left:50%;top:44%;width:240vmax;height:240vmax;margin:-120vmax 0 0 -120vmax;pointer-events:none;mix-blend-mode:screen;will-change:transform;",
    "-webkit-mask:radial-gradient(circle,transparent 0 2.5%,#000 5%,rgba(0,0,0,.5) 22%,transparent 46%);mask:radial-gradient(circle,transparent 0 2.5%,#000 5%,rgba(0,0,0,.5) 22%,transparent 46%)}",
    "#ka-intro .ki-rays.a{background:conic-gradient(from 0deg,transparent 0 4deg,rgba(53,240,196,.75) 7deg,transparent 11deg 44deg,rgba(162,123,255,.75) 48deg,transparent 53deg 92deg,rgba(255,94,142,.7) 96deg,transparent 101deg 137deg,rgba(255,194,61,.7) 141deg,transparent 146deg 183deg,rgba(53,240,196,.6) 187deg,transparent 191deg 228deg,rgba(162,123,255,.6) 232deg,transparent 237deg 274deg,rgba(255,94,142,.6) 278deg,transparent 283deg 318deg,rgba(255,194,61,.6) 322deg,transparent 327deg)}",
    "#ka-intro .ki-rays.b{opacity:.6;filter:blur(6px);background:conic-gradient(from 20deg,transparent 0 10deg,rgba(255,255,255,.55) 14deg,transparent 20deg 70deg,rgba(53,240,196,.5) 76deg,transparent 84deg 150deg,rgba(255,255,255,.5) 155deg,transparent 162deg 230deg,rgba(162,123,255,.55) 236deg,transparent 244deg 300deg,rgba(255,194,61,.5) 305deg,transparent 312deg)}",
    "#ka-intro .ki-core{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px;max-width:640px}",
    "#ka-intro .ki-pi{font:800 clamp(120px,30vmin,250px)/1 Unbounded,'Golos Text',system-ui,sans-serif;letter-spacing:-.05em;background:linear-gradient(160deg,#fff 20%,#d9defe 55%,#b6a3ff 100%);-webkit-background-clip:text;background-clip:text;color:transparent;",
    "filter:drop-shadow(0 0 24px rgba(255,255,255,.45)) drop-shadow(0 0 60px rgba(162,123,255,.5));animation:kiPulse 3.2s ease-in-out infinite;margin-bottom:6px;transition:filter .5s,transform .8s cubic-bezier(.2,.8,.2,1)}",
    "@keyframes kiPulse{50%{filter:drop-shadow(0 0 34px rgba(255,255,255,.6)) drop-shadow(0 0 90px rgba(53,240,196,.45))}}",
    "#ka-intro .ki-name{font:700 clamp(24px,5vw,40px)/1.1 Unbounded,'Golos Text',system-ui,sans-serif;letter-spacing:-.02em;white-space:nowrap}",
    "#ka-intro .ki-name span{display:inline-block;opacity:0;transform:translateY(14px);filter:blur(6px);animation:kiIn .7s cubic-bezier(.2,.8,.2,1) forwards}",
    "@keyframes kiIn{to{opacity:1;transform:none;filter:none}}",
    "#ka-intro .ki-tag{margin:10px 0 30px;color:#b9c3ea;font-size:16px;opacity:0;animation:kiIn .8s .9s forwards}",
    "#ka-intro .ki-say{min-height:3.2em;margin:-12px 0 18px;font-size:clamp(16px,2.4vw,19px);color:#fff;max-width:34ch;opacity:0;transform:translateY(8px);transition:opacity .5s,transform .5s}",
    "#ka-intro.go .ki-say{opacity:1;transform:none}",
    "#ka-intro .ki-go{position:relative;display:inline-flex;align-items:center;gap:12px;border:0;cursor:pointer;font:700 18px/1 'Golos Text',system-ui,sans-serif;color:#060a1a;background:#fff;padding:18px 30px 18px 22px;border-radius:999px;box-shadow:0 0 0 6px rgba(255,255,255,.12),0 20px 60px -10px rgba(162,123,255,.8);opacity:0;animation:kiIn .7s 1.2s forwards;transition:transform .2s}",
    "#ka-intro .ki-go:hover{transform:scale(1.04)}",
    "#ka-intro .ki-go::after{content:'';position:absolute;inset:-6px;border-radius:inherit;border:2px solid rgba(255,255,255,.55);animation:kiRing 1.8s 2s ease-out infinite;opacity:0}",
    "@keyframes kiRing{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(1.35)}}",
    "#ka-intro .ki-go svg{flex-shrink:0}",
    "#ka-intro .ki-mute{margin-top:16px;background:none;border:0;color:#9fb0d0;font:500 14.5px/1.4 'Golos Text',system-ui,sans-serif;cursor:pointer;text-decoration:underline;text-underline-offset:3px;opacity:0;animation:kiIn .6s 1.5s forwards}",
    "#ka-intro .ki-mute:hover{color:#fff}",
    "#ka-intro :focus-visible{outline:2px solid #ffc23d;outline-offset:4px}",
    "#ka-intro.go .ki-go,#ka-intro.go .ki-mute{pointer-events:none;opacity:0!important;transition:opacity .3s;animation:none}",
    "#ka-intro.go .ki-pi{transform:scale(1.12);filter:drop-shadow(0 0 40px #fff) drop-shadow(0 0 120px rgba(53,240,196,.8))}",
    "#ka-intro.out{-webkit-mask:radial-gradient(circle at 50% 44%,transparent var(--kir),#000 calc(var(--kir) + 10%));mask:radial-gradient(circle at 50% 44%,transparent var(--kir),#000 calc(var(--kir) + 10%));animation:kiIris 1.15s cubic-bezier(.7,0,.25,1) forwards;transition:opacity .5s .75s;opacity:0}",
    "@keyframes kiIris{to{--kir:160%}}",
    "@media (prefers-reduced-motion:reduce){#ka-intro *{animation:none!important;opacity:1!important;transform:none!important;filter:none!important}#ka-intro.out{animation:none;transition:opacity .3s}}"
  ].join("\n");

  function show() {
    var l = lang(), t = TXT[l];
    sstore("ka-intro", "1"); store("ka.intro.t", String(Date.now()));
    var st = document.createElement("style"); st.id = "ka-intro-css"; st.textContent = CSS; document.head.appendChild(st);
    var o = document.createElement("div");
    o.id = "ka-intro"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", t.label); o.setAttribute("lang", l);
    var name = "Kuvonch Academy".split("").map(function (ch, i) { return '<span style="animation-delay:' + (0.25 + i * 0.045).toFixed(3) + 's">' + (ch === " " ? "&nbsp;" : ch) + "</span>"; }).join("");
    o.innerHTML =
      '<div class="ki-aur" aria-hidden="true"></div><div class="ki-rays a" aria-hidden="true"></div><div class="ki-rays b" aria-hidden="true"></div>' +
      '<div class="ki-core"><div class="ki-pi" aria-hidden="true">π</div><div class="ki-name">' + name + '</div>' +
      '<div class="ki-tag"></div><p class="ki-say" aria-live="polite"></p>' +
      '<button class="ki-go" type="button"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span></span></button>' +
      '<button class="ki-mute" type="button"></button></div>';
    o.querySelector(".ki-tag").textContent = t.tag;
    o.querySelector(".ki-go span").textContent = t.go;
    o.querySelector(".ki-mute").textContent = t.mute;
    var say = o.querySelector(".ki-say");
    document.body.appendChild(o);
    var root = document.documentElement, prevOv = root.style.overflow; root.style.overflow = "hidden";
    getVoice(l); // oldindan yuklab qo'yamiz

    // nurlarning aylanishi: JS bilan — bosilganda silliq tezlashadi
    var ra = o.querySelector(".ki-rays.a"), rb = o.querySelector(".ki-rays.b"), ang = 0, spd = 0.06, target = 0.06, live = true;
    (function spin() {
      if (!live) return;
      spd += (target - spd) * 0.04; ang += spd;
      if (!reduce) { ra.style.transform = "rotate(" + ang + "deg)"; rb.style.transform = "rotate(" + (-ang * 0.7) + "deg) scale(" + (1 + Math.min(0.3, (spd - 0.06) * 0.08)) + ")"; }
      requestAnimationFrame(spin);
    })();

    var gone = false;
    function close(withSound) {
      if (gone) return; gone = true;
      if (withSound) { chime(); setTimeout(function () { speak(l); }, 380); }
      o.classList.add("go"); target = 3.4; say.textContent = withSound ? t.say : "";
      setTimeout(function () {
        o.classList.add("out");
        if (window.kaNur) window.kaNur.flare();
        setTimeout(function () { live = false; o.remove(); st.remove(); root.style.overflow = prevOv; try { if (document.activeElement && o.contains(document.activeElement)) document.activeElement.blur(); } catch (e) {} }, 1250);
      }, withSound ? 1500 : 350);
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) { if (e.key === "Escape") close(false); }
    o.querySelector(".ki-go").addEventListener("click", function () { close(true); });
    o.querySelector(".ki-mute").addEventListener("click", function () { close(false); });
    document.addEventListener("keydown", onKey);
    setTimeout(function () { try { o.querySelector(".ki-go").focus({ preventScroll: true }); } catch (e) {} }, 1300);
  }

  function init() { hookHeroButton(); if (shouldShow()) show(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
