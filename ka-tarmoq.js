/*!
 * Kuvonch Academy — jamoaviy o'yin va chempionat uchun umumiy dvigatel
 *  - Xona kodi orqali ulanish (PeerJS / WebRTC, server kerak emas)
 *  - Har bir o'yin mavzusida savollar generatori (har safar yangi sonlar)
 *  - Natijani o'qituvchining Google jadvaliga yuborish
 * Ulash: <script src="ka-tarmoq.js"></script>
 */
(function () {
  "use strict";
  if (window.KANet) return;

  var PEER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.5/peerjs.min.js";
  var PREFIX = "kuvonch-ka-v1-";
  var RESULTS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxeBUPBTqpJ8rw9PH4mW8dlonvIJCjeP9ijTfq84R6MrFqCeIjf04uoQsEgVqne2xYBTA/exec";
  var ALPH = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  /* ---------------- yordamchilar ---------------- */
  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function isP(n) { if (n < 2) return false; for (var p = 2; p * p <= n; p++) if (n % p === 0) return false; return true; }
  function factor(n) { var f = [], m = n; for (var p = 2; p * p <= m; p++) while (m % p === 0) { f.push(p); m /= p; } if (m > 1) f.push(m); return f; }
  function divCount(n) { var c = 0; for (var i = 1; i <= n; i++) if (n % i === 0) c++; return c; }

  // To'g'ri javob + chalg'ituvchilar -> {q, opts, a}
  function mcq(q, right, wrongs) {
    right = String(right);
    var seen = {}; seen[right] = 1; var w = [];
    for (var i = 0; i < wrongs.length && w.length < 3; i++) { var s = String(wrongs[i]); if (!seen[s]) { seen[s] = 1; w.push(s); } }
    var guard = 0;
    while (w.length < 3 && guard++ < 50) { var n = parseFloat(right); var s2 = isNaN(n) ? right + "?" : String(n + R(-9, 9) || n + 11); if (!seen[s2]) { seen[s2] = 1; w.push(s2); } }
    var opts = shuffle([right].concat(w));
    return { q: q, opts: opts, a: opts.indexOf(right) };
  }
  function near(n, k) { var out = []; k = k || 3; var d = [1, -1, 2, -2, 10, -10, 3, 5]; for (var i = 0; out.length < 6 && i < d.length; i++) out.push(n + d[i]); return shuffle(out); }

  /* ---------------- savol generatorlari ---------------- */
  var GAMES = {
    tub: {
      name: "Tub Sonlar Poygasi", icon: "🏁", color: "#ff7a59",
      gen: function () {
        var t = R(1, 4);
        if (t === 1) {
          var p; do { p = R(11, 199); } while (!isP(p));
          var comp = []; while (comp.length < 3) { var c = R(9, 199); if (!isP(c) && c % 2 === 1 && c % 5 !== 0 && comp.indexOf(c) < 0) comp.push(c); }
          return mcq("Qaysi son tub?", p, comp);
        }
        if (t === 2) {
          var cp; do { cp = R(21, 221); } while (isP(cp) || cp % 2 === 0 || cp % 5 === 0);
          var pr = []; while (pr.length < 3) { var x = R(11, 211); if (isP(x) && pr.indexOf(x) < 0) pr.push(x); }
          return mcq("Qaysi son tub EMAS?", cp, pr);
        }
        if (t === 3) {
          var n = R(20, 180), nx = n + 1; while (!isP(nx)) nx++;
          var nx2 = nx + 1; while (!isP(nx2)) nx2++;
          var pv = n; while (!isP(pv)) pv--;
          return mcq(n + " dan katta eng kichik tub son?", nx, [nx2, pv, nx + 2, nx - 1]);
        }
        var m; do { m = R(12, 300); } while (isP(m) || factor(m).length < 2);
        var f = factor(m), right = f.join("·");
        var fake1 = f.slice(0, -1).concat([f[f.length - 1] + 2]).join("·");
        var fake2 = [2].concat(f.slice(1)).join("·") === right ? f.concat([2]).join("·") : [2].concat(f.slice(1)).join("·");
        var fake3 = (f.length > 2 ? [f[0] * f[1]].concat(f.slice(2)) : [1, m]).join("·");
        return mcq(m + " ni tub ko'paytuvchilarga ajrating", right, [fake1, fake2, fake3]);
      }
    },
    snayper: {
      name: "Matematik Snayper", icon: "🎯", color: "#f4c430",
      gen: function () {
        var op = R(1, 4), a, b, r, q;
        if (op === 1) { a = R(12, 99); b = R(12, 99); r = a + b; q = a + " + " + b; }
        else if (op === 2) { a = R(30, 150); b = R(10, a - 1); r = a - b; q = a + " − " + b; }
        else if (op === 3) { a = R(3, 15); b = R(3, 12); r = a * b; q = a + " × " + b; }
        else { b = R(2, 12); r = R(2, 15); a = b * r; q = a + " ÷ " + b; }
        return mcq(q + " = ?", r, near(r));
      }
    },
    shakl: {
      name: "Shakl Ovchisi", icon: "📐", color: "#4cc9f0",
      gen: function () {
        var t = R(1, 7), a, b;
        if (t === 1) { a = R(3, 15); b = R(2, 12); return mcq("To'g'ri to'rtburchak: " + a + " sm va " + b + " sm. Perimetri?", 2 * (a + b), [a * b, a + b, 2 * a + b, 2 * (a + b) + 2]); }
        if (t === 2) { a = R(3, 15); b = R(2, 12); return mcq("To'g'ri to'rtburchak: " + a + " sm va " + b + " sm. Yuzi (sm²)?", a * b, [2 * (a + b), a * b + a, a * b - b, (a + 1) * b]); }
        if (t === 3) { a = R(30, 90); b = R(20, 150 - a); return mcq("Uchburchakning ikki burchagi " + a + "° va " + b + "°. Uchinchisi?", 180 - a - b, [180 - a, 90 - a + b, 360 - a - b, 180 - a - b + 10]); }
        if (t === 4) { a = R(2, 9); return mcq("Qirrasi " + a + " sm bo'lgan kubning hajmi (sm³)?", a * a * a, [a * a, 6 * a * a, 3 * a, a * a * a + a]); }
        if (t === 5) { a = R(4, 10); return mcq("Qavariq " + a + "-burchak ichki burchaklari yig'indisi?", (a - 2) * 180 + "°", [a * 180 + "°", (a - 1) * 180 + "°", (a - 3) * 180 + "°", a * 90 + "°"]); }
        if (t === 6) { a = R(2, 12); return mcq("Kvadratning perimetri " + 4 * a + " sm. Yuzi (sm²)?", a * a, [4 * a, 2 * a, a * a * 2, (a + 1) * (a + 1)]); }
        var facts = [
          ["Kubning nechta qirrasi bor?", 12, [6, 8, 10]], ["Kubning nechta uchi bor?", 8, [6, 12, 4]],
          ["To'rtburchakli piramidaning nechta yog'i bor?", 5, [4, 6, 8]], ["Uchburchakli prizmaning nechta yog'i bor?", 5, [6, 3, 9]],
          ["Muntazam oltiburchakning ichki burchagi?", "120°", ["108°", "135°", "90°"]], ["Silindrning nechta asosi bor?", 2, [1, 3, 0]],
          ["Konusning nechta uchi bor?", 1, [0, 2, 3]], ["To'g'ri burchak necha gradus?", "90°", ["180°", "45°", "60°"]]
        ];
        var f = pick(facts); return mcq(f[0], f[1], f[2]);
      }
    },
    savat: {
      name: "Sonlar Savati", icon: "🧺", color: "#3fbf7f",
      gen: function () {
        var t = R(1, 5), k, x, w;
        if (t === 1) { k = R(3, 9); x = k * R(4, 20); w = []; while (w.length < 3) { var y = R(10, 180); if (y % k && w.indexOf(y) < 0) w.push(y); } return mcq("Qaysi son " + k + " ga karrali?", x, w); }
        if (t === 2) { var s = R(4, 15); x = s * s; return mcq("Qaysi son to'liq kvadrat?", x, [x + 1, x - 2, (s * s + (s + 1) * (s + 1)) >> 1 | 1]); }
        if (t === 3) { var a = R(1, 5), q = R(2, 4); return mcq("Geometrik progressiya: " + a + ", " + a * q + ", " + a * q * q + ", ?", a * q * q * q, [a * q * q + a * q, a * q * q * 2 + 1, a * q * q * q + q]); }
        if (t === 4) { x = pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 60, 72]); var d = divCount(x); return mcq(x + " sonining nechta natural bo'luvchisi bor?", d, [d - 1, d + 1, d + 2, d - 2]); }
        x = 6 * R(3, 30); w = []; while (w.length < 3) { var z = R(10, 180); if (z % 6 && w.indexOf(z) < 0 && (z % 2 === 0 || z % 3 === 0)) w.push(z); }
        return mcq("Qaysi son ham juft, ham 3 ga karrali?", x, w);
      }
    },
    funksiya: {
      name: "Funksiya Ovchisi", icon: "📈", color: "#a78bfa",
      gen: function () {
        var t = R(1, 6), k, b, m;
        if (t === 1) { k = R(-5, 5) || 2; b = R(-9, 9); m = R(-4, 6); var y = k * m + b; return mcq("y = " + (k === 1 ? "" : k === -1 ? "−" : k < 0 ? "−" + (-k) : k) + "x " + (b < 0 ? "− " + (-b) : "+ " + b) + ", x = " + m + " bo'lsa, y = ?", y, near(y)); }
        if (t === 2) { var c = R(2, 9); return mcq("y = x² − " + c * c + " funksiyaning nollari?", "±" + c, ["±" + c * c, c + " va 0", "±" + (c + 1)]); }
        if (t === 3) { return mcq("Qaysi funksiya kamayuvchi?", pick(["y = −3x + 1", "y = (1/2)ˣ", "y = −x + 5"]), ["y = 2x − 3", "y = 3ˣ", "y = log₂x", "y = √x"]); }
        if (t === 4) { return mcq("Qaysi funksiya juft?", pick(["y = x²", "y = cos x", "y = |x|"]), ["y = x³", "y = sin x", "y = x + 1", "y = tg x"]); }
        if (t === 5) { var p = R(-5, 5), q = R(-5, 5); return mcq("y = (x " + (p < 0 ? "+ " + (-p) : "− " + p) + ")² " + (q < 0 ? "− " + (-q) : "+ " + q) + " parabolaning uchi?", "(" + p + "; " + q + ")", ["(" + (-p) + "; " + q + ")", "(" + q + "; " + p + ")", "(" + p + "; " + (-q) + ")"]); }
        var tr = pick([["sin 30°", "1/2", ["√3/2", "1", "0"]], ["cos 60°", "1/2", ["√3/2", "0", "1"]], ["tg 45°", "1", ["0", "√3", "1/2"]], ["cos 0°", "1", ["0", "−1", "1/2"]], ["log₂ 8", "3", ["4", "2", "8"]], ["log₃ 81", "4", ["3", "27", "9"]], ["√144", "12", ["14", "72", "11"]]]);
        return mcq(tr[0] + " = ?", tr[1], tr[2]);
      }
    },
    arqon: {
      name: "Arqon tortish", icon: "🪢", color: "#ff5c7a",
      gen: function () {
        var t = R(1, 4), a, b;
        if (t === 1) { a = R(2, 9) * 10; b = R(1, 9) * 10; return mcq(b + " ning " + a + "% i = ?", a * b / 100, [a * b / 10, a + b, a * b / 100 + 1]); }
        if (t === 2) { a = R(2, 5); b = R(2, 4); var p = Math.pow(a, b); return mcq(a + (b === 2 ? "²" : b === 3 ? "³" : "⁴") + " = ?", p, [a * b, p + a, Math.pow(a, b - 1)]); }
        if (t === 3) { a = R(3, 12); b = R(3, 12); var c = R(2, 20); return mcq(a + " × " + b + " + " + c + " = ?", a * b + c, [a * (b + c), a * b - c, a * b + c + 10]); }
        return GAMES.snayper.gen();
      }
    }
  };

  function makeQuestions(gameId, n) {
    var g = GAMES[gameId] || GAMES.snayper, out = [], keys = {};
    var guard = 0;
    while (out.length < n && guard++ < n * 20) { var q = g.gen(); if (!keys[q.q]) { keys[q.q] = 1; out.push(q); } }
    return out;
  }

  /* ---------------- tarmoq (PeerJS) ---------------- */
  var peerLoading = null;
  function loadPeer() {
    if (window.Peer) return Promise.resolve();
    if (peerLoading) return peerLoading;
    peerLoading = new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = PEER_SRC; s.onload = res;
      s.onerror = function () { peerLoading = null; rej(new Error("Internet yo'q yoki kutubxona yuklanmadi")); };
      document.head.appendChild(s);
    });
    return peerLoading;
  }
  function genCode() { var s = ""; for (var i = 0; i < 5; i++) s += ALPH[Math.floor(Math.random() * ALPH.length)]; return s; }
  function normCode(c) { return String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5); }
  var PEER_OPTS = { debug: 0, config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478" }] } };

  // Xona ochish. opts: {onConn(conn, hello) -> true/xato matni, onMsg(id,msg), onLeave(id)}
  function host(opts) {
    return loadPeer().then(function () {
      return new Promise(function (res, rej) {
        var tries = 0;
        (function attempt() {
          var code = genCode(), peer = new window.Peer(PREFIX + code, PEER_OPTS), conns = {};
          var api = {
            code: code, peer: peer, conns: conns,
            send: function (id, msg) { var c = conns[id]; if (c && c.open) try { c.send(msg); } catch (e) {} },
            broadcast: function (msg, except) { for (var id in conns) if (id !== except) api.send(id, msg); },
            kick: function (id, why) { var c = conns[id]; if (!c) return; api.send(id, { type: "kick", why: why || "" }); setTimeout(function () { try { c.close(); } catch (e) {} }, 300); delete conns[id]; },
            close: function () { try { peer.destroy(); } catch (e) {} }
          };
          peer.on("open", function () { res(api); });
          peer.on("error", function (e) {
            if (e && e.type === "unavailable-id" && tries++ < 5) { try { peer.destroy(); } catch (x) {} attempt(); return; }
            if (opts.onError) opts.onError(e);
            rej(e);
          });
          peer.on("disconnected", function () { try { peer.reconnect(); } catch (e) {} });
          peer.on("connection", function (conn) {
            var helloed = false;
            conn.on("data", function (msg) {
              if (!msg || typeof msg !== "object") return;
              if (!helloed) {
                if (msg.type !== "hello") return;
                var ok = opts.onConn ? opts.onConn(conn.peer, msg) : true;
                if (ok !== true) { try { conn.send({ type: "reject", why: ok }); } catch (e) {} setTimeout(function () { try { conn.close(); } catch (e) {} }, 400); return; }
                helloed = true; conns[conn.peer] = conn;
                if (opts.onJoin) opts.onJoin(conn.peer, msg);
                return;
              }
              if (opts.onMsg) opts.onMsg(conn.peer, msg);
            });
            var gone = function () { if (conns[conn.peer]) { delete conns[conn.peer]; if (opts.onLeave) opts.onLeave(conn.peer); } };
            conn.on("close", gone); conn.on("error", gone);
          });
        })();
      });
    });
  }

  // Xonaga qo'shilish. hello: {name, group, ...}; opts: {onMsg(msg), onClose()}
  function join(code, hello, opts) {
    code = normCode(code);
    return loadPeer().then(function () {
      return new Promise(function (res, rej) {
        var peer = new window.Peer(PEER_OPTS), settled = false;
        var to = setTimeout(function () { if (!settled) { settled = true; try { peer.destroy(); } catch (e) {} rej(new Error("Xona topilmadi yoki javob bermadi. Kodni tekshiring.")); } }, 15000);
        peer.on("error", function (e) {
          if (settled) { if (opts.onClose) opts.onClose(); return; }
          settled = true; clearTimeout(to); try { peer.destroy(); } catch (x) {}
          rej(new Error(e && e.type === "peer-unavailable" ? "Bunday kodli xona yo'q. Kodni tekshiring." : "Ulanib bo'lmadi: " + (e && e.type || e)));
        });
        peer.on("open", function () {
          var conn = peer.connect(PREFIX + code, { reliable: true });
          conn.on("open", function () { conn.send(Object.assign({ type: "hello" }, hello)); });
          conn.on("data", function (msg) {
            if (!msg || typeof msg !== "object") return;
            if (!settled) {
              if (msg.type === "reject") { settled = true; clearTimeout(to); try { peer.destroy(); } catch (e) {} rej(new Error(msg.why || "Xona qabul qilmadi")); return; }
              settled = true; clearTimeout(to);
              res({ id: peer.id, send: function (m) { if (conn.open) try { conn.send(m); } catch (e) {} }, close: function () { try { peer.destroy(); } catch (e) {} } });
            }
            if (opts.onMsg) opts.onMsg(msg);
          });
          conn.on("close", function () { if (settled && opts.onClose) opts.onClose(); });
        });
      });
    });
  }

  /* ---------------- shaxs va natija ---------------- */
  function identity() {
    var n = "", g = "";
    try { var idn = JSON.parse(localStorage.getItem("mq_identity") || "null"); if (idn) { n = idn.name || ""; g = idn.group || ""; } } catch (e) {}
    try { var id = localStorage.getItem("ka.joriy.v1"); var db = JSON.parse(localStorage.getItem("ka.akkountlar.v1") || "{}"); if (id && db[id]) { n = db[id].name || n; g = db[id].group || g; } } catch (e) {}
    return { name: n, group: g };
  }
  function saveIdentity(name, group) { try { localStorage.setItem("mq_identity", JSON.stringify({ name: name, group: group })); } catch (e) {} }
  function postResult(p) {
    return fetch(RESULTS_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(p) }).catch(function () {});
  }
  function joinUrl(page, code) { var u = location.href.split("#")[0].split("?")[0]; u = u.replace(/[^/]*$/, page); return u + "?kod=" + code; }

  window.KANet = {
    GAMES: GAMES, makeQuestions: makeQuestions, host: host, join: join, normCode: normCode,
    identity: identity, saveIdentity: saveIdentity, postResult: postResult, esc: esc, shuffle: shuffle, joinUrl: joinUrl
  };
})();
