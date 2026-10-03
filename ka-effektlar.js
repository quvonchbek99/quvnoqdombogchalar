/*!
 * Kuvonch Academy — sahifa effektlari
 *  1) Pastga surilganda bloklar chiroyli animatsiya bilan paydo bo'ladi + yuqorida o'qish chizig'i
 *  2) "Kuvi" — to'p o'ynab sakrab yuradigan yashil maskot (bosilsa matematik qiziqarli fakt aytadi)
 * Ulash: </body> dan oldin <script src="ka-effektlar.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaFx) return; window.__kaFx = true;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  var css = `
  .ka-prog{position:fixed;left:0;top:0;height:3px;width:0;z-index:99999;background:linear-gradient(90deg,#5ee6c7,#7c9bff,#ff5c7a);box-shadow:0 0 10px rgba(94,230,199,.6);pointer-events:none}
  .ka-rv{opacity:0;transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1),filter .8s;will-change:opacity,transform}
  .ka-rv.up{transform:translateY(46px)}
  .ka-rv.left{transform:translateX(-60px) rotate(-1.5deg)}
  .ka-rv.right{transform:translateX(60px) rotate(1.5deg)}
  .ka-rv.zoom{transform:scale(.86);filter:blur(6px)}
  .ka-rv.flip{transform:perspective(800px) rotateX(18deg) translateY(30px);transform-origin:50% 100%}
  .ka-rv.in{opacity:1;transform:none;filter:none}
  .ka-kuvi{position:fixed;bottom:calc(6px + var(--kb,0px));left:0;width:76px;height:96px;z-index:900;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none}
  .ka-kuvi svg{width:100%;height:100%;overflow:visible;display:block}
  .ka-kuvi .bd{transform-origin:38px 92px}
  .ka-ball{position:fixed;bottom:calc(6px + var(--kb,0px));left:0;width:30px;height:30px;z-index:899;pointer-events:none}
  .ka-shadow{position:fixed;bottom:calc(2px + var(--kb,0px));height:8px;border-radius:50%;background:rgba(0,0,0,.28);z-index:898;pointer-events:none;filter:blur(2px)}
  .ka-say{position:fixed;bottom:calc(112px + var(--kb,0px));max-width:240px;background:#fff;color:#14203a;font:600 14px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:10px 12px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35);z-index:901;opacity:0;transform:translateY(8px) scale(.95);transition:.25s;pointer-events:none}
  .ka-say.on{opacity:1;transform:none}
  .ka-say::after{content:"";position:absolute;bottom:-8px;left:var(--tx,30px);border:8px solid transparent;border-bottom:0;border-top-color:#fff}
  .ka-kx{position:fixed;bottom:calc(96px + var(--kb,0px));width:20px;height:20px;border-radius:50%;border:0;background:rgba(20,31,56,.85);color:#9fb0d0;font-size:12px;line-height:20px;text-align:center;padding:0;z-index:902;cursor:pointer;opacity:0;transition:opacity .2s}
  .ka-kuvi:hover~.ka-kx,.ka-kx:hover{opacity:1}
  .ka-kback{position:fixed;left:10px;bottom:10px;z-index:900;border:1px solid #243252;background:rgba(20,31,56,.9);color:#eef2ff;border-radius:99px;padding:6px 10px;font-size:18px;cursor:pointer}
  @media print{.ka-kuvi,.ka-ball,.ka-shadow,.ka-say,.ka-kx,.ka-kback,.ka-prog{display:none!important}}
  `;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ================= 1) Scroll animatsiyalari ================= */
  var prog = document.createElement("div"); prog.className = "ka-prog"; document.body.appendChild(prog);
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%";
    });
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if (!reduce && "IntersectionObserver" in window) {
    var SEL = ".ev-link,.picker-card,.card,.era-card,.topic-chip,section>h2,section>p,.hero,article,.test-start-btn,main h2,main h3,.timeline-item,.grid>*,.cards>*,figure,blockquote,table";
    var kinds = ["up", "zoom", "left", "right", "flip"];
    var io = new IntersectionObserver(function (ents) {
      var batch = 0;
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var e = en.target; io.unobserve(e);
        e.style.transitionDelay = Math.min(batch++ * 70, 420) + "ms";
        e.classList.add("in");
        setTimeout(function () { e.style.transitionDelay = ""; e.classList.remove("ka-rv", "up", "zoom", "left", "right", "flip", "in"); }, 1400 + batch * 70);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    var n = 0;
    function prepare(root) {
      Array.prototype.forEach.call((root || document).querySelectorAll(SEL), function (e) {
        if (e.__kaRv || e.closest("[role=dialog],.modal,#testModal,.km,.ka-menu,nav,header,footer") || getComputedStyle(e).position === "fixed") return;
        var r = e.getBoundingClientRect();
        e.__kaRv = 1;
        if (r.top < innerHeight * 0.9 && r.bottom > 0) return; // birinchi ekrandagilar darhol ko'rinadi
        var k = e.classList.contains("topic-chip") ? "zoom" : kinds[n++ % kinds.length];
        e.classList.add("ka-rv", k); io.observe(e);
      });
    }
    if (document.readyState === "complete") prepare(); else addEventListener("load", function () { prepare(); });
    // keyin qo'shilgan bloklar (masalan, admin mavzulari) uchun
    if ("MutationObserver" in window) { var mt = 0; new MutationObserver(function () { clearTimeout(mt); mt = setTimeout(function () { prepare(); }, 400); }).observe(document.body, { childList: true, subtree: true }); }
  }

  /* ================= 2) Maskot "Kuvi" ================= */
  var FACTS = [
    "Bilasizmi? 0 sonini hind matematiklari kashf etgan. 🔢",
    "Al-Xorazmiy nomidan “algoritm” so'zi kelib chiqqan! 🇺🇿",
    "1 dan 100 gacha sonlar yig'indisi 5050 — Gauss buni 9 yoshida topgan.",
    "Pi (π) soni hech qachon tugamaydi: 3,14159…",
    "Futbol to'pi 12 ta beshburchak va 20 ta oltiburchakdan tikiladi! ⚽",
    "Asalari uyalari oltiburchak — eng kam mum bilan eng ko'p joy.",
    "Har qanday juft son (2 dan katta) ikki tub son yig'indisi deb taxmin qilinadi.",
    "Kungaboqar urug'lari Fibonachchi spiralida joylashgan: 1, 1, 2, 3, 5, 8…",
    "Bir yilda taxminan 31 536 000 soniya bor. ⏱️",
    "111111111 × 111111111 = 12345678987654321 🤯",
    "Ulug'bek yulduzlar jadvalini 600 yil oldin juda aniq tuzgan. 🔭",
    "Tub sonlar cheksiz ko'p — buni Evklid isbotlagan."
  ];
  if (store("ka.kuvi.off") === "1") { backBtn(); return; }
  startKuvi();

  function backBtn() {
    var b = document.createElement("button"); b.className = "ka-kback"; b.title = "Kuvini qaytarish"; b.textContent = "⚽";
    b.onclick = function () { store("ka.kuvi.off", "0"); b.remove(); startKuvi(); };
    document.body.appendChild(b);
  }

  function startKuvi() {
    var svg = '<svg viewBox="0 0 76 96" aria-hidden="true"><g class="bd">' +
      // oyoqlar (krossovka)
      '<g class="lg1"><rect x="22" y="76" width="7" height="12" rx="3" fill="#2f8f4e"/><path d="M17 88h15a4 4 0 0 1 0 6H17z" fill="#ff5c7a"/><path d="M17 92h17" stroke="#fff" stroke-width="2"/></g>' +
      '<g class="lg2"><rect x="46" y="76" width="7" height="12" rx="3" fill="#2f8f4e"/><path d="M44 88h15a4 4 0 0 1 0 6H44z" fill="#ff5c7a"/><path d="M44 92h17" stroke="#fff" stroke-width="2"/></g>' +
      // tana — dumaloq yashil
      '<ellipse cx="38" cy="54" rx="28" ry="27" fill="#5ed36a"/><ellipse cx="38" cy="62" rx="17" ry="13" fill="#b9f2a8"/>' +
      // antenna
      '<path d="M38 28 Q36 14 44 8" stroke="#3fae52" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="45" cy="7" r="5" fill="#f4c430"/>' +
      // qo'llar
      '<path class="ar1" d="M12 54 Q2 50 4 40" stroke="#4cc25c" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path class="ar2" d="M64 54 Q74 50 72 40" stroke="#4cc25c" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      // ko'zlar
      '<g class="eyes"><ellipse cx="29" cy="45" rx="8" ry="9" fill="#fff"/><ellipse cx="48" cy="45" rx="8" ry="9" fill="#fff"/>' +
      '<circle class="pu" cx="30" cy="46" r="4" fill="#14203a"/><circle class="pu" cx="49" cy="46" r="4" fill="#14203a"/>' +
      '<circle cx="31.5" cy="44" r="1.4" fill="#fff"/><circle cx="50.5" cy="44" r="1.4" fill="#fff"/></g>' +
      // yuz
      '<path d="M28 60 Q38 70 48 60" stroke="#14203a" stroke-width="2.5" fill="#fff" stroke-linecap="round"/>' +
      '<circle cx="21" cy="57" r="3.5" fill="#ff9fb0" opacity=".7"/><circle cx="56" cy="57" r="3.5" fill="#ff9fb0" opacity=".7"/>' +
      // ko'krakdagi belgi
      '<text x="38" y="77" text-anchor="middle" font-size="9" font-weight="800" fill="#2f8f4e" font-family="sans-serif">K</text>' +
      "</g></svg>";
    var ballSvg = '<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="#fff" stroke="#14203a" stroke-width="1.5"/>' +
      '<path d="M15 8l5 3.6-1.9 5.9h-6.2L10 11.6z" fill="#14203a"/>' +
      '<path d="M15 1v7M20 11.6l7-2M18.1 17.5l4 6M11.9 17.5l-4 6M10 11.6l-7-2" stroke="#14203a" stroke-width="1.3"/>' +
      '<text x="15" y="27" text-anchor="middle" font-size="5" font-weight="800" fill="#ff5c7a" font-family="sans-serif">+×</text></svg>';

    var k = document.createElement("div"); k.className = "ka-kuvi"; k.innerHTML = svg; k.title = "Kuvi — meni bosing!";
    var ball = document.createElement("div"); ball.className = "ka-ball"; ball.innerHTML = ballSvg;
    var sh = document.createElement("div"); sh.className = "ka-shadow";
    var say = document.createElement("div"); say.className = "ka-say";
    var x = document.createElement("button"); x.className = "ka-kx"; x.textContent = "✕"; x.title = "Kuvini yashirish";
    document.body.appendChild(sh); document.body.appendChild(ball); document.body.appendChild(k); document.body.appendChild(x); document.body.appendChild(say);

    // pastdagi suzuvchi tugmalar ustidan yursin
    function fitBottom() {
      var mine = [k, ball, sh, say, x], off = 0;
      Array.prototype.forEach.call(document.body.querySelectorAll("body *"), function (e) {
        if (mine.indexOf(e) >= 0 || mine.some(function (m) { return m.contains(e); })) return;
        var cs = getComputedStyle(e); if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") return;
        var r = e.getBoundingClientRect(); if (r.height > 0 && r.height < 120 && r.width < innerWidth * 0.9 && innerHeight - r.bottom < 40) off = Math.max(off, innerHeight - r.top + 4);
      });
      document.documentElement.style.setProperty("--kb", off + "px");
    }
    setTimeout(fitBottom, 1500); setTimeout(fitBottom, 4000); addEventListener("resize", function () { setTimeout(fitBottom, 300); });
    var bd = k.querySelector(".bd"), lg1 = k.querySelector(".lg1"), lg2 = k.querySelector(".lg2"), ar1 = k.querySelector(".ar1"), ar2 = k.querySelector(".ar2"), pus = k.querySelectorAll(".pu");
    var W = innerWidth, px = Math.random() * (W - 120) + 20, dir = 1, speed = 55; // px/s
    var jumpT = -1, jumpH = 0, nextJump = 2 + Math.random() * 3, t = 0, last = performance.now();
    var bx = px + 70, by = 0, bvy = 0, bvx = 0, ballAngle = 0, dribble = true;
    var sayT = 0, stopped = 0;

    function jump(h) { if (jumpT < 0) { jumpT = 0; jumpH = h || 70; kick(); } }
    function kick() { bvy = 520 + Math.random() * 180; dribble = false; }

    addEventListener("resize", function () { W = innerWidth; });
    var lastSY = scrollY, scrollJumpAt = 0;
    addEventListener("scroll", function () {
      var d = scrollY - lastSY; lastSY = scrollY;
      if (Math.abs(d) > 30 && performance.now() - scrollJumpAt > 900) { scrollJumpAt = performance.now(); jump(55 + Math.min(60, Math.abs(d))); }
    }, { passive: true });

    k.addEventListener("click", function () {
      jump(95); stopped = 3.5;
      say.textContent = FACTS[Math.floor(Math.random() * FACTS.length)];
      say.classList.add("on"); sayT = 5;
    });
    x.addEventListener("click", function () { store("ka.kuvi.off", "1"); [k, ball, sh, say, x].forEach(function (e) { e.remove(); }); cancelAnimationFrame(raf); backBtn(); });

    var raf = 0;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      if (document.hidden) return;
      // yurish
      if (stopped > 0) stopped -= dt;
      else if (!reduce) {
        px += dir * speed * dt;
        if (px > W - 90) { px = W - 90; dir = -1; }
        if (px < 6) { px = 6; dir = 1; }
        if (Math.random() < 0.002) dir = -dir;
      }
      // sakrash
      nextJump -= dt; if (nextJump <= 0) { jump(50 + Math.random() * 50); nextJump = 3 + Math.random() * 4; }
      var jy = 0, squash = 1;
      if (jumpT >= 0) {
        jumpT += dt; var D = 0.75, p = jumpT / D;
        if (p >= 1) { jumpT = -1; squash = 0.85; } else jy = Math.sin(p * Math.PI) * jumpH;
      }
      var walk = stopped > 0 || reduce ? 0 : Math.sin(t * 12);
      var bob = jy > 0 ? 0 : Math.abs(walk) * 3;
      k.style.transform = "translate(" + px + "px," + (-jy - bob) + "px)";
      bd.style.transform = (dir < 0 ? "scaleX(-1) " : "") + (jy > 0 ? "rotate(" + (dir * -6) + "deg)" : "scaleY(" + squash + ")");
      lg1.style.transform = "rotate(" + (walk * 14) + "deg)"; lg1.style.transformOrigin = "25px 76px";
      lg2.style.transform = "rotate(" + (-walk * 14) + "deg)"; lg2.style.transformOrigin = "49px 76px";
      var arm = jy > 0 ? -35 : walk * 10;
      ar1.style.transform = "rotate(" + arm + "deg)"; ar1.style.transformOrigin = "12px 54px";
      ar2.style.transform = "rotate(" + (-arm) + "deg)"; ar2.style.transformOrigin = "64px 54px";
      pus.forEach(function (pu) { pu.setAttribute("transform", "translate(" + (dir * 1.5) + "," + (jy > 0 ? -1.5 : 0) + ")"); });
      // to'p: oyoq oldida dribling, sakraganda yuqoriga uchadi
      var targetX = px + (dir > 0 ? 66 : -14);
      bx += (targetX - bx) * Math.min(1, dt * 6);
      bvy -= 1500 * dt; by += bvy * dt;
      if (by <= 0) { by = 0; if (dribble || bvy < -60) { bvy = dribble ? 330 : Math.abs(bvy) * 0.55; if (!dribble && bvy < 200) dribble = true; } else bvy = 0; }
      ballAngle += (stopped > 0 ? 0 : dir * speed * dt / 15 * 57);
      ball.style.transform = "translate(" + bx + "px," + (-by) + "px) rotate(" + ballAngle + "deg)";
      var shw = 50 - Math.min(30, jy / 3);
      sh.style.width = shw + "px"; sh.style.left = (px + 38 - shw / 2) + "px"; sh.style.opacity = String(1 - Math.min(.6, jy / 150));
      x.style.left = (px + 64) + "px";
      if (sayT > 0) {
        sayT -= dt; var sx = Math.max(8, Math.min(W - 250, px - 20)); say.style.left = sx + "px"; say.style.setProperty("--tx", (px + 38 - sx - 8) + "px");
        if (sayT <= 0) say.classList.remove("on");
      }
    }
    raf = requestAnimationFrame(frame);
  }
})();
