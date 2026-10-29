/*! Kuvonch Academy — bosh sahifa "nur va prizma" sahnasi
 *  Oq nur π-prizmaga tushadi va 4 rangli nurga bo'linib, har bir bo'lim eshigiga boradi.
 *  Sichqoncha / barmoq nur manbasini boshqaradi; nur qaysi eshikka to'g'ri tushsa, o'sha eshik yonadi.
 *  Tashqaridan: window.kaNur.flare()  — nurni bir lahzaga kuchaytiradi (intro, salomlashuv).
 *  Unumdorlik: sahna ko'rinmasa yoki tab yashirin bo'lsa chizish to'xtaydi; "kamroq harakat" sozlamasida statik.
 */
(function () {
  "use strict";
  var stage = document.getElementById("sahna"), cv = document.getElementById("nur");
  if (!stage || !cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  if (!ctx) return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COLORS = ["53,240,196", "162,123,255", "255,94,142", "255,194,61"];
  var doors = Array.prototype.slice.call(document.querySelectorAll("#eshiklar .door"));
  var spot = document.getElementById("prizmaJoy"), copy = stage.querySelector(".hero-copy");

  var W = 0, H = 0, dpr = 1, P = { x: 0, y: 0 }, R = 60, T = [], small = false;
  var S = { x: 0, y: 0 }, Sgoal = { x: 0, y: 0 }, pointerOn = false, lastPointer = 0;
  var hoverIdx = -1, litIdx = -1, flareT = 0, ringT = 1, running = false, visible = true, raf = 0, frameN = 0, t0 = performance.now();
  var motes = [];

  function measure() {
    var sr = stage.getBoundingClientRect();
    W = Math.max(1, sr.width); H = Math.max(1, sr.height);
    small = W < 980;
    dpr = Math.min(window.devicePixelRatio || 1, W < 560 ? 1 : small ? 1.5 : 2); // telefonda yumshoq nur uchun 1x yetarli — 2 barobar tez
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    var sp = spot && spot.getBoundingClientRect();
    if (sp && sp.width > 40 && getComputedStyle(spot).display !== "none") {
      P.x = sp.left - sr.left + sp.width * 0.5; P.y = sp.top - sr.top + sp.height * 0.46;
      R = Math.max(70, Math.min(150, sp.height * 0.36, sp.width * 0.36));
    } else {
      var cr = copy ? copy.getBoundingClientRect() : sr;
      P.x = W * (W < 560 ? 0.76 : 0.7); P.y = cr.bottom - sr.top - (W < 560 ? 66 : 74);
      R = W < 560 ? 40 : 54;
    }
    T = doors.map(function (d) {
      var r = d.getBoundingClientRect();
      return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + 1, w: r.width };
    });
    if (!lastPointer) { home(); S.x = Sgoal.x; S.y = Sgoal.y; }
    if (!motes.length) for (var i = 0; i < (small ? 26 : 46); i++) motes.push({ r: (i % 5), t: Math.random(), s: 0.04 + Math.random() * 0.08, o: Math.random() * 6.28 });
  }
  // Nur manbasining "uy" nuqtasi: prizmaning yuqori o'ng tomoni, sekin aylanadi
  function home(now) {
    var a = (now || 0) / 5200;
    var bx = small ? W * 0.98 : P.x + R * 2.4, by = small ? P.y - 150 : Math.max(10, P.y - R * 2.6);
    Sgoal.x = bx + Math.cos(a) * (small ? 14 : 40); Sgoal.y = by + Math.sin(a * 1.3) * (small ? 10 : 26);
  }

  function beam(x1, y1, w1, x2, y2, w2, grad) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    ctx.beginPath();
    ctx.moveTo(x1 + nx * w1, y1 + ny * w1); ctx.lineTo(x2 + nx * w2, y2 + ny * w2);
    ctx.lineTo(x2 - nx * w2, y2 - ny * w2); ctx.lineTo(x1 - nx * w1, y1 - ny * w1);
    ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
  }
  function lin(x1, y1, x2, y2, stops) {
    var g = ctx.createLinearGradient(x1, y1, x2, y2);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }

  function draw(now) {
    var t = (now - t0) / 1000;
    if (!lastPointer || now - lastPointer > 2600) { pointerOn = false; home(now); }
    var k = reduce ? 1 : 0.085;
    S.x += (Sgoal.x - S.x) * k; S.y += (Sgoal.y - S.y) * k;
    var dxs = P.x - S.x, dys = P.y - S.y, Ls = Math.hypot(dxs, dys) || 1;
    if (Ls < R * 0.9) { S.x = P.x - dxs / Ls * R * 0.9; S.y = P.y - dys / Ls * R * 0.9; dxs = P.x - S.x; dys = P.y - S.y; Ls = R * 0.9; }
    var vx = dxs / Ls, vy = dys / Ls;
    if (flareT > 0) flareT = Math.max(0, flareT - 0.012);
    if (ringT < 1) ringT = Math.min(1, ringT + 0.016);
    var boost = 1 + flareT * 1.4;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    // 1) Kiruvchi oq nur
    var wIn = R * 0.26;
    beam(S.x, S.y, 2, P.x, P.y, wIn * 2.2, lin(S.x, S.y, P.x, P.y, [[0, "rgba(255,255,255,0)"], [1, "rgba(220,230,255," + (0.12 * boost) + ")"]]));
    beam(S.x, S.y, 1, P.x, P.y, wIn, lin(S.x, S.y, P.x, P.y, [[0, "rgba(255,255,255,0.05)"], [1, "rgba(255,255,255," + Math.min(1, 0.55 * boost) + ")"]]));

    // 2) Har bir eshikka rangli nur
    var best = -1, bestS = -2;
    for (var i = 0; i < T.length; i++) {
      var tx = T[i].x, ty = T[i].y, ux = tx - P.x, uy = ty - P.y, Lu = Math.hypot(ux, uy) || 1;
      var score = (vx * ux + vy * uy) / Lu; // nur yo'nalishiga qanchalik mos
      if (score > bestS) { bestS = score; best = i; }
      var focus = hoverIdx >= 0 ? (hoverIdx === i ? 1.7 : 0.45) : (pointerOn ? 0.55 + Math.max(0, score) * 0.9 : 0.85);
      var shim = reduce ? 1 : 0.86 + 0.14 * Math.sin(t * 1.7 + i * 1.9);
      var a = Math.min(1, 0.34 * focus * shim * boost), c = COLORS[i % 4];
      var off = (i - (T.length - 1) / 2) * (R * 0.06);
      var sx = P.x + off * -vy * 0.4, sy = P.y + R * 0.28 + off * 0.2;
      var wEnd = Math.max(26, T[i].w * (small ? 0.3 : 0.34));
      beam(sx, sy, R * 0.07, tx, ty, wEnd, lin(sx, sy, tx, ty, [[0, "rgba(" + c + "," + Math.min(1, a * 2.1) + ")"], [0.5, "rgba(" + c + "," + (a * 0.7) + ")"], [1, "rgba(" + c + "," + (a * 0.95) + ")"]]));
      // ingichka yorqin o'zak
      ctx.strokeStyle = lin(sx, sy, tx, ty, [[0, "rgba(255,255,255," + Math.min(1, a * 1.6) + ")"], [0.4, "rgba(" + c + "," + Math.min(1, a * 1.5) + ")"], [1, "rgba(" + c + ",0)"]]);
      ctx.lineWidth = small ? 1.5 : 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke();
      // eshik ustidagi yorug' dog'
      var gl = ctx.createRadialGradient(tx, ty, 0, tx, ty, wEnd * 1.4);
      gl.addColorStop(0, "rgba(" + c + "," + Math.min(1, a * 1.3) + ")"); gl.addColorStop(1, "rgba(" + c + ",0)");
      ctx.fillStyle = gl; ctx.fillRect(tx - wEnd * 1.4, ty - wEnd * 1.4, wEnd * 2.8, wEnd * 2.8);
    }

    // 3) Prizma yonidagi kichik kamalak yelpig'i
    var base = Math.atan2(vy, vx);
    for (var j = 0; j < 6; j++) {
      var ang = base + (j - 2.5) * 0.07, len = R * (1.5 + 0.15 * Math.sin(t * 2 + j));
      var col = ["255,80,110", "255,170,60", "255,236,90", "60,240,170", "80,170,255", "170,110,255"][j];
      ctx.strokeStyle = lin(P.x, P.y, P.x + Math.cos(ang) * len, P.y + Math.sin(ang) * len, [[0, "rgba(" + col + "," + (0.5 * boost) + ")"], [1, "rgba(" + col + ",0)"]]);
      ctx.lineWidth = small ? 2 : 3; ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(P.x + Math.cos(ang) * len, P.y + Math.sin(ang) * len); ctx.stroke();
    }

    // 4) Nur ichidagi chang zarralari
    if (!reduce) for (var m = 0; m < motes.length; m++) {
      var q = motes[m]; q.t += q.s / 60; if (q.t > 1) q.t -= 1;
      var tg = q.r === 4 ? null : T[q.r];
      var x0 = q.r === 4 ? S.x : P.x, y0 = q.r === 4 ? S.y : P.y, x1 = tg ? tg.x : P.x, y1 = tg ? tg.y : P.y;
      var px = x0 + (x1 - x0) * q.t + Math.sin(t + q.o) * 8, py = y0 + (y1 - y0) * q.t + Math.cos(t * 0.8 + q.o) * 6;
      var al = 0.5 * Math.sin(q.t * Math.PI) * (0.6 + 0.4 * Math.sin(t * 3 + q.o));
      ctx.fillStyle = "rgba(" + (tg ? COLORS[q.r] : "255,255,255") + "," + al + ")";
      ctx.beginPath(); ctx.arc(px, py, small ? 1.2 : 1.6, 0, 6.283); ctx.fill();
    }

    // 5) Prizma: shishadek π
    var halo = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, R * 1.6);
    halo.addColorStop(0, "rgba(255,255,255," + Math.min(0.55, 0.22 * boost) + ")"); halo.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = halo; ctx.fillRect(P.x - R * 1.6, P.y - R * 1.6, R * 3.2, R * 3.2);
    ctx.globalCompositeOperation = "source-over";
    ctx.font = "800 " + Math.round(R * 2) + "px Unbounded, 'Golos Text', system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var gp = ctx.createLinearGradient(P.x - R, P.y - R, P.x + R, P.y + R);
    gp.addColorStop(0, "rgba(255,255,255,.78)"); gp.addColorStop(0.45, "rgba(214,222,255,.42)"); gp.addColorStop(1, "rgba(170,186,255,.28)");
    ctx.fillStyle = gp; ctx.fillText("π", P.x, P.y - R * 0.06);
    ctx.lineWidth = small ? 1.2 : 1.8;
    ctx.strokeStyle = lin(P.x - R, P.y, P.x + R, P.y, [[0, "rgba(53,240,196,.9)"], [0.35, "rgba(162,123,255,.9)"], [0.7, "rgba(255,94,142,.9)"], [1, "rgba(255,194,61,.9)"]]);
    ctx.strokeText("π", P.x, P.y - R * 0.06);

    // 6) Flare halqasi (intro yoki salomlashuvdan keyin)
    if (ringT < 1) {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(255,255,255," + (0.6 * (1 - ringT)) + ")"; ctx.lineWidth = 3 * (1 - ringT) + 0.5;
      ctx.beginPath(); ctx.arc(P.x, P.y, R * (0.8 + ringT * 5), 0, 6.283); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";

    // nur to'g'ri tushgan eshik yonadi
    var want = (pointerOn && hoverIdx < 0 && bestS > 0.9) ? best : -1;
    if (want !== litIdx) { if (litIdx >= 0 && doors[litIdx]) doors[litIdx].classList.remove("lit"); litIdx = want; if (litIdx >= 0) doors[litIdx].classList.add("lit"); }
    if (++frameN % 45 === 0) remeasureIfMoved();
  }

  var lastSig = "";
  function remeasureIfMoved() {
    var r = doors[0] && doors[0].getBoundingClientRect(), s = stage.getBoundingClientRect();
    var sig = r ? [Math.round(r.top - s.top), Math.round(r.width), Math.round(s.width), Math.round(s.height)].join() : "";
    if (sig !== lastSig) { lastSig = sig; measure(); }
  }

  var lastDraw = 0;
  function loop(now) {
    raf = 0; if (!running) return;
    // tejamkor: nur barmoq/sichqonchaga ergashganda 60, o'zi suzganda 30 (telefonda 24) kadr/s
    var calm = now - lastPointer > 8000; // uzoq tegilmasa — sekin, tejamkor suzish
    var minDt = pointerOn || flareT > 0 || ringT < 1 ? 0 : calm ? (small ? 80 : 50) : small ? 41 : 32;
    if (now - lastDraw >= minDt) { lastDraw = now; draw(now); }
    raf = requestAnimationFrame(loop);
  }
  function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
  function sync() { if (visible && !document.hidden) start(); else stop(); }
  function once() { draw(performance.now()); }

  function setPointer(x, y) {
    var sr = stage.getBoundingClientRect();
    Sgoal.x = x - sr.left; Sgoal.y = y - sr.top; pointerOn = true; lastPointer = performance.now();
    if (reduce) { S.x = Sgoal.x; S.y = Sgoal.y; once(); }
  }
  stage.addEventListener("pointermove", function (e) { if (e.pointerType !== "touch") setPointer(e.clientX, e.clientY); }, { passive: true });
  stage.addEventListener("touchmove", function (e) { var q = e.touches && e.touches[0]; if (q) setPointer(q.clientX, q.clientY); }, { passive: true });
  stage.addEventListener("touchstart", function (e) { var q = e.touches && e.touches[0]; if (q) setPointer(q.clientX, q.clientY); }, { passive: true });
  stage.addEventListener("pointerleave", function () { lastPointer = performance.now() - 2000; });
  doors.forEach(function (d, i) {
    d.addEventListener("pointerenter", function () { hoverIdx = i; if (reduce) once(); });
    d.addEventListener("pointerleave", function () { hoverIdx = -1; if (reduce) once(); });
    d.addEventListener("focus", function () { hoverIdx = i; if (reduce) once(); });
    d.addEventListener("blur", function () { hoverIdx = -1; if (reduce) once(); });
  });

  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; sync(); }, { rootMargin: "80px" }).observe(stage);
  document.addEventListener("visibilitychange", sync);
  var rt = 0;
  function onResize() { clearTimeout(rt); rt = setTimeout(function () { measure(); if (reduce) once(); }, 120); }
  if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(stage); else addEventListener("resize", onResize);

  window.kaNur = {
    flare: function () { flareT = 1; ringT = 0; if (reduce) once(); }
  };

  measure();
  if (reduce) once(); else sync();
  // shrift yuklangach π ni qayta o'lchab chizamiz
  if (document.fonts && document.fonts.load) document.fonts.load("800 100px Unbounded").then(function () { measure(); if (reduce) once(); }, function () {});
})();
