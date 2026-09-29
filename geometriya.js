/*!
 * Kuvonch Academy — Geometriya: chizmali va grafikli masalalar
 * Har bir masala uchun chizma (SVG) avtomatik chiziladi, sonlar har safar yangi.
 * Bo'limlar: uchburchak burchaklari, Pifagor teoremasi, aylana, yuzalar,
 * parallel to'g'ri chiziqlar, koordinatalar, grafikdan formula topish.
 * Ulash: <script src="geometriya.js"></script>
 */
(function () {
  "use strict";
  if (window.__kaGeoLoaded) return;
  window.__kaGeoLoaded = true;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; }
  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function RNZ(a, b) { var v; do { v = R(a, b); } while (v === 0); return v; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function f1(v) { return Math.round(v * 10) / 10; }

  // ---------- SVG yordamchilari ----------
  var INK = "#dfe6ff", DIM = "#8b9ac0", ACC = "#ffd479", BLUE = "#7c9bff", GREEN = "#5ee6c7";
  function svg(w, h, body) { return '<svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;background:#0e1628;border-radius:12px">' + body + "</svg>"; }
  function line(x1, y1, x2, y2, c, w, dash) { return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + (c || INK) + '" stroke-width="' + (w || 2.5) + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + "/>"; }
  function text(x, y, t, c, size, anchor) { return '<text x="' + f1(x) + '" y="' + f1(y) + '" fill="' + (c || INK) + '" font-size="' + (size || 15) + '" font-family="system-ui,sans-serif" font-weight="700" text-anchor="' + (anchor || "middle") + '" dominant-baseline="middle">' + t + "</text>"; }
  function poly(pts, c, fill) { return '<polygon points="' + pts.map(function (p) { return f1(p[0]) + "," + f1(p[1]); }).join(" ") + '" fill="' + (fill || "rgba(124,155,255,.10)") + '" stroke="' + (c || INK) + '" stroke-width="2.5" stroke-linejoin="round"/>'; }
  function dot(x, y, c) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="4.5" fill="' + (c || ACC) + '"/>'; }
  function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
  function offsetOut(p, c, d) { var dx = p[0] - c[0], dy = p[1] - c[1], L = Math.hypot(dx, dy) || 1; return [p[0] + dx / L * d, p[1] + dy / L * d]; }
  // burchak yoyi A uchida (B va C tomon)
  function arc(A, B, C, r, c) {
    var a1 = Math.atan2(B[1] - A[1], B[0] - A[0]), a2 = Math.atan2(C[1] - A[1], C[0] - A[0]);
    var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    var p1 = [A[0] + r * Math.cos(a1), A[1] + r * Math.sin(a1)], p2 = [A[0] + r * Math.cos(a1 + d), A[1] + r * Math.sin(a1 + d)];
    return '<path d="M' + f1(p1[0]) + " " + f1(p1[1]) + " A" + r + " " + r + " 0 0 " + (d > 0 ? 1 : 0) + " " + f1(p2[0]) + " " + f1(p2[1]) + '" fill="none" stroke="' + (c || ACC) + '" stroke-width="2"/>';
  }
  function arcLabelPos(A, B, C, r) {
    var a1 = Math.atan2(B[1] - A[1], B[0] - A[0]), a2 = Math.atan2(C[1] - A[1], C[0] - A[0]);
    var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    var m = a1 + d / 2; return [A[0] + r * Math.cos(m), A[1] + r * Math.sin(m)];
  }
  function rightMark(P, A, B, s) { // P uchidagi to'g'ri burchak belgisi
    var u = [(A[0] - P[0]), (A[1] - P[1])], v = [(B[0] - P[0]), (B[1] - P[1])];
    var lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]); u = [u[0] / lu * s, u[1] / lu * s]; v = [v[0] / lv * s, v[1] / lv * s];
    return '<path d="M' + f1(P[0] + u[0]) + " " + f1(P[1] + u[1]) + " L" + f1(P[0] + u[0] + v[0]) + " " + f1(P[1] + u[1] + v[1]) + " L" + f1(P[0] + v[0]) + " " + f1(P[1] + v[1]) + '" fill="none" stroke="' + ACC + '" stroke-width="2"/>';
  }
  // Koordinata tekisligi (x,y ∈ [-n, n])
  function grid(n, W, body) {
    var u = W / (2 * n + 1), o = W / 2, g = "";
    for (var i = -n; i <= n; i++) {
      g += line(o + i * u, 6, o + i * u, W - 6, i === 0 ? INK : "rgba(124,155,255,.18)", i === 0 ? 1.6 : 1);
      g += line(6, o - i * u, W - 6, o - i * u, i === 0 ? INK : "rgba(124,155,255,.18)", i === 0 ? 1.6 : 1);
      if (i !== 0 && i % 2 === 0) { g += text(o + i * u, o + 13, i, DIM, 10); g += text(o - 11, o - i * u, i, DIM, 10); }
    }
    g += text(W - 12, o - 12, "x", INK, 13) + text(o + 12, 14, "y", INK, 13) + text(o - 9, o + 11, "0", DIM, 10);
    var P = function (x, y) { return [o + x * u, o - y * u]; };
    return { svg: g, P: P, u: u };
  }

  // ---------- Masala generatorlari ----------
  // Har biri: { cat, svg, q, a, ordered, hint, steps }
  var GEO = {
    angles: function () {
      var A = R(35, 80), B = R(35, 85), C = 180 - A - B;
      if (C < 25) return GEO.angles();
      var base = 230, ax = 35, ay = 185, a = A * Math.PI / 180, b = B * Math.PI / 180;
      var side = base * Math.sin(b) / Math.sin(a + b); // AC
      var P1 = [ax, ay], P2 = [ax + base, ay], P3 = [ax + side * Math.cos(a), ay - side * Math.sin(a)];
      if (P3[1] < 25) { var k = (ay - 25) / (ay - P3[1]); P3 = [ax + (P3[0] - ax) * k, ay - (ay - P3[1]) * k]; }
      var s = poly([P1, P2, P3]) + arc(P1, P2, P3, 26) + arc(P2, P3, P1, 26) + arc(P3, P1, P2, 22, GREEN);
      var l1 = arcLabelPos(P1, P2, P3, 44), l2 = arcLabelPos(P2, P3, P1, 44), l3 = arcLabelPos(P3, P1, P2, 40);
      s += text(l1[0], l1[1], A + "°", ACC, 14) + text(l2[0], l2[1], B + "°", ACC, 14) + text(l3[0], l3[1], "x", GREEN, 16);
      s += text(P1[0] - 12, P1[1] + 12, "A") + text(P2[0] + 12, P2[1] + 12, "B") + text(P3[0], P3[1] - 14, "C");
      return { cat: "Uchburchak", svg: svg(300, 210, s), q: "Chizmadagi ABC uchburchakda ∠A = " + A + "°, ∠B = " + B + "°. x = ∠C ni toping.", a: C, hint: "gradus",
        steps: ["Uchburchak burchaklari yig'indisi 180°", "x = 180° − " + A + "° − " + B + "° = " + C + "°"] };
    },
    pythag: function () {
      var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [12, 16, 20]]), find = R(0, 1);
      var sc = 150 / Math.max(t[0], t[1]), C = [50, 180], A = [50, 180 - t[0] * sc], B = [50 + t[1] * sc, 180];
      if (B[0] > 280) { sc = 230 / t[1]; A = [50, 180 - t[0] * sc]; B = [50 + t[1] * sc, 180]; }
      var s = poly([A, B, C]) + rightMark(C, A, B, 14);
      var mA = mid(A, C), mB = mid(C, B), mH = mid(A, B);
      s += text(mA[0] - 18, mA[1], find ? t[0] : t[0], ACC, 15, "end");
      s += text(mB[0], mB[1] + 18, find ? "x" : t[1], find ? GREEN : ACC, 16);
      s += text(mH[0] + 16, mH[1] - 14, find ? t[2] : "x", find ? ACC : GREEN, 16, "start");
      if (!find) return { cat: "Pifagor teoremasi", svg: svg(300, 210, s), q: "To'g'ri burchakli uchburchak katetlari " + t[0] + " va " + t[1] + ". Gipotenuza x ni toping.", a: t[2], hint: "son",
        steps: ["x² = " + t[0] + "² + " + t[1] + "² = " + (t[0] * t[0] + t[1] * t[1]), "x = " + t[2]] };
      return { cat: "Pifagor teoremasi", svg: svg(300, 210, s), q: "Gipotenuza " + t[2] + ", bir kateti " + t[0] + ". Ikkinchi katet x ni toping.", a: t[1], hint: "son",
        steps: ["x² = " + t[2] + "² − " + t[0] + "² = " + (t[2] * t[2] - t[0] * t[0]), "x = " + t[1]] };
    },
    circle: function () {
      var r = R(2, 12), k = R(0, 2), cx = 150, cy = 105, rr = 78;
      var ang = -R(15, 60) * Math.PI / 180, P = [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)];
      var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="rgba(124,155,255,.08)" stroke="' + INK + '" stroke-width="2.5"/>' + dot(cx, cy, INK);
      if (k === 2) { s += line(cx - rr, cy, cx + rr, cy, ACC, 2.5) + text(cx, cy + 16, "d = " + 2 * r, ACC, 15); }
      else { s += line(cx, cy, P[0], P[1], ACC, 2.5); var m = mid([cx, cy], P); s += text(m[0] - 8, m[1] - 12, "r = " + r, ACC, 15); }
      s += text(cx - 10, cy + 2 + (k === 2 ? -14 : 12), "O", INK, 13);
      if (k === 0) return { cat: "Aylana", svg: svg(300, 210, s), q: "Aylana radiusi r = " + r + ". Aylana uzunligi C = x·π. x ni toping.", a: 2 * r, hint: "son (π siz)", steps: ["C = 2πr = 2·" + r + "·π = " + 2 * r + "π", "x = " + 2 * r] };
      if (k === 1) return { cat: "Doira yuzi", svg: svg(300, 210, s), q: "Doira radiusi r = " + r + ". Yuzi S = x·π. x ni toping.", a: r * r, hint: "son (π siz)", steps: ["S = πr² = π·" + r + "² = " + r * r + "π", "x = " + r * r] };
      return { cat: "Doira yuzi", svg: svg(300, 210, s), q: "Doira diametri d = " + 2 * r + ". Yuzi S = x·π. x ni toping.", a: r * r, hint: "son (π siz)", steps: ["r = d/2 = " + r, "S = πr² = " + r * r + "π", "x = " + r * r] };
    },
    area: function () {
      var k = R(0, 2), s, a, b, h;
      if (k === 0) {
        a = R(3, 14); b = R(3, 10); var W = 200 * a / Math.max(a, b + 4), H = 120 * b / Math.max(b, 4);
        W = Math.max(90, Math.min(230, a * 16)); H = Math.max(60, Math.min(150, b * 14));
        var x0 = 150 - W / 2, y0 = 105 - H / 2;
        s = poly([[x0, y0], [x0 + W, y0], [x0 + W, y0 + H], [x0, y0 + H]]) + text(150, y0 + H + 16, a + " sm", ACC) + text(x0 + W + 12, 105, b + " sm", ACC, 15, "start");
        return { cat: "Yuzalar", svg: svg(300, 210, s), q: "To'g'ri to'rtburchak tomonlari " + a + " sm va " + b + " sm. Yuzini toping (sm²).", a: a * b, hint: "son", steps: ["S = a·b = " + a + "·" + b + " = " + a * b] };
      }
      if (k === 1) {
        a = R(4, 16) * 2; h = R(3, 12); var bx = 40, by = 180, top = [R(90, 200), 180 - Math.min(140, h * 12)];
        s = poly([[bx, by], [bx + 220, by], top]) + line(top[0], top[1], top[0], by, GREEN, 2, "5 4") + rightMark([top[0], by], [bx, by], top, 10);
        s += text(150, by + 16, "a = " + a, ACC) + text(top[0] + 8, (top[1] + by) / 2, "h = " + h, GREEN, 15, "start");
        return { cat: "Yuzalar", svg: svg(300, 210, s), q: "Uchburchak asosi a = " + a + ", balandligi h = " + h + ". Yuzini toping.", a: a * h / 2, hint: "son", steps: ["S = ½·a·h = ½·" + a + "·" + h + " = " + a * h / 2] };
      }
      a = R(6, 16); b = R(2, a - 2); h = R(3, 10);
      if ((a + b) * h % 2) h++;
      var Wd = 230, sc2 = Wd / a, wb = b * sc2, x1 = 35, yb = 180, yt = 180 - Math.min(120, h * 12), xo = x1 + (Wd - wb) / 2;
      s = poly([[x1, yb], [x1 + Wd, yb], [xo + wb, yt], [xo, yt]]) + line(xo, yt, xo, yb, GREEN, 2, "5 4");
      s += text(150, yb + 16, "a = " + a, ACC) + text(150, yt - 14, "b = " + b, ACC) + text(xo + 8, (yt + yb) / 2, "h = " + h, GREEN, 15, "start");
      return { cat: "Yuzalar", svg: svg(300, 210, s), q: "Trapetsiya asoslari a = " + a + ", b = " + b + ", balandligi h = " + h + ". Yuzini toping.", a: (a + b) * h / 2, hint: "son",
        steps: ["S = (a + b)/2 · h", "= (" + a + " + " + b + ")/2 · " + h + " = " + (a + b) * h / 2] };
    },
    parallel: function () {
      var th = R(35, 75), ang = th * Math.PI / 180, y1 = 70, y2 = 150, xc = 150;
      var dx = 80 / Math.tan(ang), P1 = [xc + dx / 2, y1], P2 = [xc - dx / 2, y2];
      var s = line(15, y1, 285, y1) + line(15, y2, 285, y2);
      var ext = 60, ux = Math.cos(ang), uy = -Math.sin(ang);
      s += line(P2[0] - ux * ext, P2[1] - uy * ext, P1[0] + ux * ext, P1[1] + uy * ext, BLUE, 2.5);
      s += text(282, y1 - 10, "a", DIM, 13) + text(282, y2 - 10, "b", DIM, 13) + text(P1[0] + ux * ext + 8, P1[1] + uy * ext, "c", BLUE, 13, "start");
      // pozitsiyalar: TR = th, TL = 180-th, BL = th, BR = 180-th (har ikki kesishishda)
      var POS = ["TR", "TL", "BL", "BR"], val = { TR: th, TL: 180 - th, BL: th, BR: 180 - th };
      function dir(p) { // yorliq joyi
        var right = [1, 0], up = [ux, uy];
        if (p === "TR") return [(right[0] + up[0]) / 1.6, (right[1] + up[1]) / 1.6];
        if (p === "TL") return [(-right[0] + up[0]) / 1.6, (-right[1] + up[1]) / 1.6];
        if (p === "BL") return [(-right[0] - up[0]) / 1.6, (-right[1] - up[1]) / 1.6];
        return [(right[0] - up[0]) / 1.6, (right[1] - up[1]) / 1.6];
      }
      var i1 = R(0, 1), p1 = pick(POS), i2, p2;
      do { i2 = R(0, 1); p2 = pick(POS); } while (i2 === i1 && p2 === p1);
      var I = [P1, P2], d1 = dir(p1), d2 = dir(p2);
      s += text(I[i1][0] + d1[0] * 30, I[i1][1] + d1[1] * 30, val[p1] + "°", ACC, 14) + text(I[i2][0] + d2[0] * 30, I[i2][1] + d2[1] * 30, "x", GREEN, 16);
      s += dot(P1[0], P1[1], INK) + dot(P2[0], P2[1], INK);
      var same = val[p1] === val[p2];
      return { cat: "Parallel to'g'ri chiziqlar", svg: svg(300, 220, s), q: "a ∥ b va c — kesuvchi. Chizmadagi burchaklardan biri " + val[p1] + "°. x ni toping.", a: val[p2], hint: "gradus",
        steps: [same ? "Belgilangan burchaklar vertikal / mos / ichki almashinuvchi burchaklar — ular teng" : "Belgilangan burchaklar qo'shni yoki ichki bir tomonli — yig'indisi 180°",
          same ? "x = " + val[p1] + "°" : "x = 180° − " + val[p1] + "° = " + val[p2] + "°"] };
    },
    distance: function () {
      var t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 3, 5], [8, 6, 10]]), x1 = R(-6, 6 - t[0]), y1 = R(-6, 6 - t[1]);
      var sx = pick([1, -1]); if (x1 + sx * t[0] > 6 || x1 + sx * t[0] < -6) sx = -sx;
      var x2 = x1 + sx * t[0], y2 = y1 + t[1];
      var G = grid(7, 280, ""), A = G.P(x1, y1), B = G.P(x2, y2), Cc = G.P(x2, y1);
      var s = G.svg + line(A[0], A[1], Cc[0], Cc[1], DIM, 1.5, "4 4") + line(Cc[0], Cc[1], B[0], B[1], DIM, 1.5, "4 4") + line(A[0], A[1], B[0], B[1], ACC, 2.8) + dot(A[0], A[1], GREEN) + dot(B[0], B[1], GREEN);
      s += text(A[0] - 10, A[1] + 14, "A") + text(B[0] + 10, B[1] - 12, "B");
      return { cat: "Koordinatalar", svg: svg(280, 280, s), q: "Koordinata tekisligida A(" + x1 + "; " + y1 + ") va B(" + x2 + "; " + y2 + ") nuqtalar berilgan. AB masofani toping.", a: t[2], hint: "son",
        steps: ["AB = √((x₂ − x₁)² + (y₂ − y₁)²)", "= √(" + t[0] * t[0] + " + " + t[1] * t[1] + ") = " + t[2]] };
    },
    lineGraph: function () {
      var k = pick([1, 2, -1, -2, 3, -3, 0.5, -0.5]), b = R(-4, 4), n = 7;
      var xs = [], x; for (x = -n; x <= n; x++) { var y = k * x + b; if (Number.isInteger(y) && Math.abs(y) <= n) xs.push([x, y]); }
      if (xs.length < 2) return GEO.lineGraph();
      var G = grid(n, 280, ""), xa = -n - 0.5, xb = n + 0.5, pa = G.P(xa, k * xa + b), pb = G.P(xb, k * xb + b);
      var s = G.svg + '<clipPath id="kgc"><rect x="4" y="4" width="272" height="272"/></clipPath><g clip-path="url(#kgc)">' + line(pa[0], pa[1], pb[0], pb[1], ACC, 3) + "</g>";
      var m1 = xs[Math.floor(xs.length / 3)], m2 = xs[Math.floor(xs.length * 2 / 3)];
      if (m1 === m2) m2 = xs[xs.length - 1];
      [m1, m2].forEach(function (p) { var q = G.P(p[0], p[1]); s += dot(q[0], q[1], GREEN); });
      var kk = Number.isInteger(k) ? k : (k > 0 ? "1/2" : "−1/2");
      return { cat: "Grafikdan formula", svg: svg(280, 280, s), q: "Grafikda y = kx + b to'g'ri chizig'i tasvirlangan (yashil nuqtalar — butun koordinatali nuqtalar). k va b ni toping.", a: [k, b], ordered: true, hint: "k; b",
        steps: ["Nuqtalar: (" + m1[0] + "; " + m1[1] + ") va (" + m2[0] + "; " + m2[1] + ")", "k = (y₂ − y₁)/(x₂ − x₁) = " + kk, "b — Oy o'qi bilan kesishish: b = " + b] };
    },
    parabolaGraph: function () {
      var h = R(-3, 3), kv = R(-4, 3), a = pick([1, -1]), n = 7;
      if (a < 0) kv = R(-2, 5);
      var G = grid(n, 280, ""), d = "";
      for (var i = 0; i <= 120; i++) { var x = -n - .5 + i * (2 * n + 1) / 120, y = a * (x - h) * (x - h) + kv; var p = G.P(x, y); d += (i ? " L" : "M") + f1(p[0]) + " " + f1(p[1]); }
      var V = G.P(h, kv);
      var s = G.svg + '<clipPath id="kgp"><rect x="4" y="4" width="272" height="272"/></clipPath><g clip-path="url(#kgp)"><path d="' + d + '" fill="none" stroke="' + ACC + '" stroke-width="3"/></g>' + dot(V[0], V[1], GREEN);
      return { cat: "Grafikdan formula", svg: svg(280, 280, s), q: "Grafikda y = " + (a < 0 ? "−" : "") + "(x − m)² + n parabola tasvirlangan. Parabola uchi (m; n) ni toping.", a: [h, kv], ordered: true, hint: "m; n",
        steps: ["Parabola uchi — yashil nuqta", "Uch: (" + h + "; " + kv + ")", "y = " + (a < 0 ? "−" : "") + "(x " + (h < 0 ? "+ " + (-h) : "− " + h) + ")² " + (kv < 0 ? "− " + (-kv) : "+ " + kv)] };
    },
    square: function () {
      var d = pick([2, 4, 6, 8, 10]), k = R(0, 1), x0 = 90, y0 = 45, W = 120;
      var s = poly([[x0, y0], [x0 + W, y0], [x0 + W, y0 + W], [x0, y0 + W]]) + line(x0, y0 + W, x0 + W, y0, ACC, 2.5, "6 4");
      if (k === 0) { s += text(x0 + W / 2 + 14, y0 + W / 2 - 10, "d = " + d + "√2", ACC, 14, "start") ;
        return { cat: "Kvadrat", svg: svg(300, 210, s), q: "Kvadrat diagonali d = " + d + "√2. Kvadrat tomonini toping.", a: d, hint: "son", steps: ["d = a√2", "a = d/√2 = " + d] }; }
      s += text(x0 + W / 2, y0 + W + 16, "a = " + d, ACC);
      return { cat: "Kvadrat", svg: svg(300, 210, s), q: "Kvadrat tomoni a = " + d + ". Diagonali d = x·√2. x ni toping.", a: d, hint: "son", steps: ["d = a√2 = " + d + "√2", "x = " + d] };
    }
  };
  var CATS = [
    ["all", "🎲 Aralash"], ["angles", "🔺 Uchburchak burchaklari"], ["pythag", "📐 Pifagor"], ["circle", "⭕ Aylana va doira"],
    ["area", "▭ Yuzalar"], ["square", "◻ Kvadrat"], ["parallel", "∥ Parallel chiziqlar"], ["distance", "📍 Koordinatalar"],
    ["lineGraph", "📈 Grafik: to'g'ri chiziq"], ["parabolaGraph", "📉 Grafik: parabola"]
  ];
  function problem(cat) {
    var keys = Object.keys(GEO), key = cat && GEO[cat] ? cat : pick(keys);
    return GEO[key]();
  }

  // ---------- Tekshirish ----------
  function check(input, ans, ordered) {
    if (window.kaGen && window.kaGen.check) return window.kaGen.check(input, ans, ordered);
    var n = parseFloat(String(input).replace(",", ".").replace(/[−–]/g, "-"));
    return !Array.isArray(ans) && Math.abs(n - ans) < 1e-6;
  }

  // Test / Arqon tortish uchun 4 variantli savol
  function mcq(cat) {
    var p = problem(cat), m = window.kaBank && window.kaBank.mcqFromGen ? window.kaBank.mcqFromGen(p) : null;
    if (!m) return null;
    m.q = p.svg + '<div style="margin-top:6px">' + p.q + "</div>"; m.html = true; m.key = p.q;
    return m;
  }

  // ---------- Oyna (panel) ----------
  var css = `
  .kgeo{position:fixed;inset:0;z-index:2150;background:#0b1220;color:#eef2ff;display:none;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
  .kgeo.on{display:flex}
  .kgeo-top{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid #243252;flex-wrap:wrap}
  .kgeo-top b{font-size:17px;margin-right:auto}
  .kgeo button,.kgeo select{font:600 14px/1 inherit;color:#eef2ff;background:#111a2e;border:1px solid #243252;border-radius:10px;padding:9px 12px;cursor:pointer}
  .kgeo .pri{background:#7c9bff;color:#0b1220;border-color:transparent}
  .kgeo-cats{display:flex;gap:6px;overflow-x:auto;padding:10px 14px;border-bottom:1px solid #1b2745;scrollbar-width:none}
  .kgeo-cats button{flex:0 0 auto;border-radius:999px;font-size:13px}
  .kgeo-cats button[aria-pressed=true]{background:#7c9bff;color:#0b1220;border-color:transparent}
  .kgeo-body{flex:1;overflow-y:auto;padding:14px}
  .kgeo-list{max-width:980px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
  .kgeo-card{background:#141f38;border:1px solid #243252;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:8px}
  .kgeo-card.ok{border-color:#5ee6c7}.kgeo-card.bad{border-color:#ff8585}
  .kgeo-cat{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9fb0d0;font-weight:700}
  .kgeo-q{font-size:15px;line-height:1.45}
  .kgeo-row{display:flex;gap:6px;flex-wrap:wrap}
  .kgeo-row input{flex:1 1 120px;min-width:0;background:#0b1220;color:#eef2ff;border:1px solid #243252;border-radius:10px;padding:9px 10px;font:600 15px/1 ui-monospace,monospace;outline:none}
  .kgeo-fb{font-size:13px;min-height:1em}.kgeo-fb.ok{color:#5ee6c7}.kgeo-fb.bad{color:#ff8585}
  .kgeo-steps{display:none;margin:0;padding-left:18px;color:#c9d4ff;font-size:13.5px}.kgeo-steps.on{display:block}
  .kgeo-score{font:700 13px/1 ui-monospace,monospace;color:#5ee6c7;background:#0b1220;border:1px solid #243252;border-radius:999px;padding:7px 10px}
  `;
  document.head.appendChild(el("style", null, css));
  var root = null, cat = "all";
  function build() {
    root = el("div", { class: "kgeo", role: "dialog", "aria-label": "Geometriya" });
    root.innerHTML = '<div class="kgeo-top"><b>📐 Geometriya — chizmali masalalar</b><span class="kgeo-score">0/6</span>' +
      '<button class="pri" data-a="new" type="button">🔄 Yangi masalalar</button><button data-a="draw" type="button">✏️ Grafik chizish</button><button data-a="close" type="button">✕</button></div>' +
      '<div class="kgeo-cats">' + CATS.map(function (c) { return '<button type="button" data-c="' + c[0] + '" aria-pressed="' + (c[0] === cat) + '">' + c[1] + "</button>"; }).join("") + "</div>" +
      '<div class="kgeo-body"><div class="kgeo-list"></div></div>';
    document.body.appendChild(root);
    $('[data-a="close"]', root).onclick = close;
    $('[data-a="new"]', root).onclick = fresh;
    $('[data-a="draw"]', root).onclick = function () { close(); if (window.kaGraph) window.kaGraph.open(); };
    $$(".kgeo-cats button", root).forEach(function (b) {
      b.onclick = function () { cat = b.getAttribute("data-c"); $$(".kgeo-cats button", root).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); fresh(); };
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("on")) close(); });
  }
  var seen = {};
  function fresh() {
    var list = $(".kgeo-list", root); list.innerHTML = "";
    for (var i = 0; i < 6; i++) {
      var p, t = 0; do { p = problem(cat === "all" ? null : cat); t++; } while (seen[p.q] && t < 20); seen[p.q] = 1;
      var c = el("div", { class: "kgeo-card" });
      c.innerHTML = '<div class="kgeo-cat">' + p.cat + "</div>" + p.svg + '<div class="kgeo-q">' + (i + 1) + ". " + p.q + "</div>" +
        '<div class="kgeo-row"><input type="text" autocomplete="off" placeholder="Javob: ' + p.hint + '"><button type="button" data-a="c">Tekshirish</button><button type="button" data-a="s">💡</button></div>' +
        '<div class="kgeo-fb"></div><ol class="kgeo-steps">' + p.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>";
      (function (c, p) {
        var inp = $("input", c), fb = $(".kgeo-fb", c);
        function go() {
          if (!inp.value.trim()) return;
          var ok = check(inp.value.replace(/[°π]/g, ""), p.a, p.ordered);
          c.classList.toggle("ok", ok); c.classList.toggle("bad", !ok); c.dataset.done = ok ? "1" : "0";
          fb.className = "kgeo-fb " + (ok ? "ok" : "bad"); fb.textContent = ok ? "✔ To'g'ri!" : "✘ Noto'g'ri — 💡 yechimga qarang.";
          $(".kgeo-score", root).textContent = $$('.kgeo-card[data-done="1"]', root).length + "/6";
        }
        $('[data-a="c"]', c).onclick = go;
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
        $('[data-a="s"]', c).onclick = function () { $(".kgeo-steps", c).classList.toggle("on"); };
      })(c, p);
      list.appendChild(c);
    }
    $(".kgeo-score", root).textContent = "0/6";
  }
  function open(c) {
    if (!root) build();
    if (c) cat = c;
    root.classList.add("on"); document.documentElement.style.overflow = "hidden"; fresh();
    if (history.replaceState) history.replaceState(null, "", "#geometriya");
  }
  function close() {
    if (!root) return; root.classList.remove("on"); document.documentElement.style.overflow = "";
    if (history.replaceState && location.hash === "#geometriya") history.replaceState(null, "", location.pathname + location.search);
  }
  window.kaGeo = { open: open, close: close, problem: problem, mcq: mcq, generators: GEO };

  // ---------- Menyuga ulash ----------
  var nav = $("header nav");
  if (nav) {
    var a = el("a", { href: "#geometriya" }, "📐 Geometriya");
    a.addEventListener("click", function (e) { e.preventDefault(); open(); });
    var admin = $$("a", nav).filter(function (x) { return /admin/i.test(x.textContent); })[0];
    nav.insertBefore(a, admin || null);
  }
  var tabs = $(".ka-tabs");
  if (tabs) { var tb = el("button", { class: "ka-tab ka-graph-tab", type: "button" }, "📐 Geometriya (chizmali)"); tb.onclick = function () { open(); }; tabs.appendChild(tb); }
  var dBody = $(".ka-drawer-body");
  if (dBody) { var db = el("button", { type: "button", class: "ka-drawbtn", style: "width:100%;justify-content:center;margin-top:0" }, "📐 Geometriya — chizmali masalalar"); db.onclick = function () { document.documentElement.classList.remove("ka-open"); open(); }; dBody.insertBefore(db, dBody.children[2] || null); }
  // Geometriyaga oid mavzularga tugma
  $$("main > section.topic").forEach(function (s) {
    var h = $("h2", s); if (!h || !/uchburchak|geometri|planimetr|stereometr|fazo|aylana|doira|yuz|pifagor|to'g'ri chiziq|tekislik|burchak/i.test(h.textContent.replace(/[ʻʼ‘’`]/g, "'"))) return;
    var body = $(".topic-body", s) || s, b = el("button", { type: "button", class: "ka-drawbtn" }, "📐 Chizmali masalalar");
    b.onclick = function () { open(); }; body.insertBefore(b, body.firstChild);
  });
  if (location.hash === "#geometriya") setTimeout(function () { open(); }, 300);
})();
