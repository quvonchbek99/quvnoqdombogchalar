/*!
 * Kuvonch Academy — jamoaviy o'yin va chempionat uchun umumiy dvigatel
 *  - Xona kodi orqali ulanish (MQTT relay: ochiq brokerlar, shifrlangan xabarlar)
 *  - Har bir o'yin mavzusida savollar generatori (har safar yangi sonlar)
 *  - Natijani o'qituvchining Google jadvaliga yuborish
 * Ulash: <script src="ka-tarmoq.js"></script>
 */
(function () {
  "use strict";
  if (window.KANet) return;

  var SCRIPT_BASE = ((document.currentScript && document.currentScript.src) || "").replace(/[^/?#]*([?#].*)?$/, "");
  var RESULTS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxeBUPBTqpJ8rw9PH4mW8dlonvIJCjeP9ijTfq84R6MrFqCeIjf04uoQsEgVqne2xYBTA/exec";
  var ALPH = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  /* ---------------- yordamchilar ---------------- */
  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sane(m, max) { try { return JSON.stringify(m).length <= max; } catch (e) { return false; } }
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

  /* ---------------- tarmoq (MQTT relay) ----------------
   * Avval PeerJS (WebRTC) ishlatilgan edi: uning bepul serveri ishlamay qolsa yoki mobil internet
   * to'g'ridan-to'g'ri ulanishga yo'l bermasa, o'quvchilar ulana olmasdi.
   * Endi xabarlar ochiq MQTT brokerlari orqali o'tadi (2 ta broker — biri ishlamasa, ikkinchisi).
   * Mavzu nomi xona kodidan SHA-256 bilan olinadi, xabarlar AES-GCM bilan shifrlanadi.
   * Tashqi API o'zgarmagan: host(opts) -> {code, send, broadcast, kick, close}, join(code, hello, opts) -> {id, send, close}. */
  var MQTT_SRC = SCRIPT_BASE + "mqtt.min.js?v=5.16.1";
  var BROKERS = ["wss://broker.emqx.io:8084/mqtt", "wss://broker.hivemq.com:8884/mqtt"];
  var NS = "kuvonch-ka-v2/";
  var mqttLoading = null;
  function loadMqtt() {
    if (window.mqtt && window.mqtt.connect) return Promise.resolve();
    if (mqttLoading) return mqttLoading;
    mqttLoading = new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = MQTT_SRC;
      s.onload = function () { if (window.mqtt && window.mqtt.connect) res(); else { mqttLoading = null; rej(new Error("Tarmoq kutubxonasi yuklanmadi")); } };
      s.onerror = function () { mqttLoading = null; rej(new Error("Internet yo'q yoki kutubxona yuklanmadi")); };
      document.head.appendChild(s);
    });
    return mqttLoading;
  }
  function genCode() { var s = ""; for (var i = 0; i < 5; i++) s += ALPH[Math.floor(Math.random() * ALPH.length)]; return s; }
  function normCode(c) { return String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5); }
  function rid(n) { var a = "abcdefghijkmnpqrstuvwxyz23456789", s = "", r = new Uint8Array(n); crypto.getRandomValues(r); for (var i = 0; i < n; i++) s += a[r[i] % a.length]; return s; }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function b64(u8) { var s = ""; for (var i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }
  function unb64(s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }

  // Xona kodi -> {t: mavzu prefiksi, key: AES kaliti}
  function room(code) {
    if (!(window.crypto && crypto.subtle)) return Promise.reject(new Error("Brauzer eski — yangilang yoki boshqa brauzerda oching"));
    var enc = new TextEncoder();
    return Promise.all([
      crypto.subtle.digest("SHA-256", enc.encode("kuvonch-ka|t|" + code)),
      crypto.subtle.digest("SHA-256", enc.encode("kuvonch-ka|k|" + code))
    ]).then(function (h) {
      return crypto.subtle.importKey("raw", h[1], { name: "AES-GCM" }, false, ["encrypt", "decrypt"]).then(function (key) {
        return { t: NS + hex(h[0]).slice(0, 24), key: key };
      });
    });
  }
  function seal(R, obj) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, R.key, new TextEncoder().encode(JSON.stringify(obj))).then(function (ct) {
      var u = new Uint8Array(12 + ct.byteLength); u.set(iv, 0); u.set(new Uint8Array(ct), 12);
      return "e" + b64(u);
    });
  }
  function unseal(R, str) {
    if (str.charAt(0) !== "e") return Promise.reject(new Error("bad"));
    var u = unb64(str.slice(1));
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.subarray(0, 12) }, R.key, u.subarray(12)).then(function (pt) {
      return JSON.parse(new TextDecoder().decode(pt));
    });
  }
  // Xabarlar tartibi buzilmasin: shifrlash/ochish navbat bilan
  function queue() { var q = Promise.resolve(); return function (fn) { q = q.then(fn).catch(function () {}); }; }
  function mconnect(url, will) {
    var o = { clientId: "ka" + rid(14), clean: true, keepalive: 20, reconnectPeriod: 1500, connectTimeout: 12000, resubscribe: true, protocolVersion: 4 };
    if (will) o.will = will;
    return window.mqtt.connect(url, o);
  }

  // Xona ochish. opts: {onConn(id, hello) -> true/xato matni, onJoin(id, hello), onMsg(id,msg), onLeave(id), onError(e)}
  function host(opts) {
    var code = genCode();
    return loadMqtt().then(function () { return room(code); }).then(function (R) {
      return new Promise(function (res, rej) {
        var clients = [], conns = {}, peers = {}, settled = false, closed = false, hbTimer = 0, infoTimer = 0;
        var outQ = queue(), inQ = queue();
        var api = {
          code: code, conns: conns,
          send: function (id, msg) {
            var p = peers[id]; if (!p || closed) return;
            var c = clients[p.b];
            outQ(function () { return seal(R, msg).then(function (s) { if (c && c.connected) c.publish(R.t + "/p/" + id, s, { qos: 0 }); }); });
          },
          broadcast: function (msg, except) { for (var id in conns) if (id !== except) api.send(id, msg); },
          kick: function (id, why) {
            if (!peers[id]) return;
            api.send(id, { type: "kick", why: why || "" });
            delete conns[id];
            setTimeout(function () { if (!conns[id]) delete peers[id]; }, 1500);
          },
          close: function () {
            if (closed) return;
            outQ(function () {
              closed = true; clearInterval(hbTimer); clearInterval(infoTimer);
              clients.forEach(function (c) {
                if (!c) return;
                try { if (c.connected) { c.publish(R.t + "/a", "~gone", { qos: 0 }); c.publish(R.t + "/i", "", { qos: 0, retain: true }); } } catch (e) {}
                setTimeout(function () { try { c.end(true); } catch (e) {} }, 600);
              });
            });
          }
        };
        function leave(id) {
          if (!peers[id]) return;
          delete peers[id];
          if (conns[id]) { delete conns[id]; if (opts.onLeave) opts.onLeave(id); }
        }
        function info(c) { try { c.publish(R.t + "/i", "~on " + Date.now(), { qos: 0, retain: true }); } catch (e) {} }
        function handle(bi, str) {
          if (closed) return;
          if (str.slice(0, 5) === "~bye ") { // o'quvchi uzildi (broker yoki o'quvchining o'zi yuboradi)
            var a = str.split(" ");
            inQ(function () { var p0 = peers[a[1]]; if (p0 && p0.n === a[2]) leave(a[1]); });
            return;
          }
          if (str.length > 8000) return;
          inQ(function () {
            return unseal(R, str).then(function (env) {
              if (closed || !env || typeof env !== "object" || typeof env.f !== "string" || env.f.length > 40) return;
              var id = env.f, msg = env.m, p = peers[id];
              if (!msg || typeof msg !== "object" || !sane(msg, 4000)) return;
              var nowT = Date.now();
              if (p && p.n !== env.n) { // shu o'quvchi qayta ulandi
                if (msg.type !== "hello") return;
                leave(id); p = null;
              }
              if (!p) {
                if (msg.type !== "hello") return;
                p = peers[id] = { b: bi, n: env.n, ok: false, win: nowT, cnt: 0 };
              }
              p.b = bi;
              if (nowT - p.win > 1000) { p.win = nowT; p.cnt = 0; }
              if (++p.cnt > 30) return; // juda tez-tez xabar — e'tiborsiz
              if (!p.ok) {
                if (msg.type !== "hello") return;
                var ok = opts.onConn ? opts.onConn(id, msg) : true;
                p.ok = true;
                if (ok !== true) {
                  api.send(id, { type: "reject", why: ok });
                  setTimeout(function () { if (peers[id] === p) delete peers[id]; }, 1500);
                  return;
                }
                conns[id] = { peer: id, open: true };
                if (opts.onJoin) opts.onJoin(id, msg);
                return;
              }
              if (msg.type === "hello") return;
              if (opts.onMsg) opts.onMsg(id, msg);
            });
          });
        }
        var to = setTimeout(function () {
          if (settled) return; settled = true; api.close();
          var e = new Error("Tarmoqqa ulanib bo'lmadi"); e.type = "network";
          if (opts.onError) opts.onError(e);
          rej(e);
        }, 20000);
        BROKERS.forEach(function (url, bi) {
          var c;
          try { c = mconnect(url); } catch (e) { return; }
          clients[bi] = c;
          c.on("connect", function () {
            if (closed) return;
            c.subscribe(R.t + "/h", { qos: 0 });
            info(c);
            if (!settled) { settled = true; clearTimeout(to); res(api); }
          });
          c.on("message", function (topic, payload) { handle(bi, payload.toString()); });
          c.on("error", function () {});
        });
        // o'quvchilarga "o'qituvchi ekrani ochiq" signali va xona ma'lumotini yangilab turish
        hbTimer = setInterval(function () { clients.forEach(function (c) { if (c && c.connected) try { c.publish(R.t + "/a", "~hb", { qos: 0 }); } catch (e) {} }); }, 10000);
        infoTimer = setInterval(function () { clients.forEach(function (c) { if (c && c.connected) info(c); }); }, 60000);
        window.addEventListener("pagehide", function () { api.close(); });
      });
    });
  }

  // Xonaga qo'shilish. hello: {name, ...}; opts: {onMsg(msg), onClose()}
  var SELF_KEY = "ka.tarmoq.self.v2";
  function selfId(code) {
    var m = {};
    try { m = JSON.parse(sessionStorage.getItem(SELF_KEY) || "{}") || {}; } catch (e) {}
    if (!m[code]) { m[code] = rid(10); try { sessionStorage.setItem(SELF_KEY, JSON.stringify(m)); } catch (e) {} }
    return m[code];
  }
  function join(code, hello, opts) {
    code = normCode(code);
    return loadMqtt().then(function () { return room(code); }).then(function (R) {
      return new Promise(function (res, rej) {
        var id = selfId(code), n = rid(8), settled = false, dead = false, clients = [], C = null, found = false;
        var lastHost = Date.now(), downSince = 0, watch = 0, probe = 0, outQ = queue(), inQ = queue();
        var hi = Object.assign({ type: "hello" }, hello);
        var TP = R.t + "/p/" + id, TA = R.t + "/a", TI = R.t + "/i";
        function willFor(nn) { return { topic: R.t + "/h", payload: "~bye " + id + " " + nn, qos: 0, retain: false }; }
        function kill() { dead = true; clearInterval(watch); clearTimeout(probe); clients.forEach(function (c) { try { c.end(true); } catch (e) {} }); }
        function fail(msg) { if (settled) return; settled = true; clearTimeout(to); kill(); rej(new Error(msg)); }
        function bye() { if (C && C.connected) try { C.publish(R.t + "/h", "~bye " + id + " " + n, { qos: 0 }); } catch (e) {} }
        function lost() { // aloqa butunlay yo'qoldi
          if (dead) return;
          if (!settled) return fail("Ulanib bo'lmadi: aloqa uzildi");
          bye(); kill(); if (opts.onClose) opts.onClose();
        }
        function send(m) {
          if (dead) return;
          var nn = n;
          outQ(function () { return seal(R, { f: id, n: nn, m: m }).then(function (s) { if (C && C.connected && !dead) C.publish(R.t + "/h", s, { qos: 0 }); }); });
        }
        function onPeerMsg(str) {
          if (dead) return;
          if (str === "~hb") { lastHost = Date.now(); return; }
          if (str === "~gone") { if (settled) lost(); else fail("O'qituvchi xonani yopgan"); return; }
          inQ(function () {
            return unseal(R, str).then(function (msg) {
              if (dead || !msg || typeof msg !== "object" || !sane(msg, 300000)) return;
              lastHost = Date.now();
              if (!settled) {
                if (msg.type === "reject") return fail(msg.why || "Xona qabul qilmadi");
                settled = true; clearTimeout(to);
                res({ id: id, send: send, close: function () { bye(); dead = true; setTimeout(kill, 300); } });
                watch = setInterval(function () {
                  if (dead) return;
                  var t = Date.now();
                  if (!C.connected) { if (!downSince) downSince = t; if (t - downSince > 45000) lost(); }
                  else { downSince = 0; if (t - lastHost > 45000) lost(); } // o'qituvchi ekrani javob bermayapti
                }, 3000);
              }
              if (opts.onMsg) opts.onMsg(msg);
              if (msg.type === "kick") kill();
            });
          });
        }
        function choose(c) { // xona topilgan broker — qolganlarini yopamiz
          if (found) return; found = true; C = c; clearTimeout(probe);
          clients.forEach(function (o) { if (o !== c) try { o.end(true); } catch (e) {} });
          clients = [c];
          c.unsubscribe(TI);
          c.subscribe([TP, TA], { qos: 0 }, function () { send(hi); });
          // internet uzilib qayta ulansa — o'qituvchiga yana salom beramiz (ochkolar saqlanadi)
          c.on("reconnect", function () { n = rid(8); c.options.will = willFor(n); });
          c.on("connect", function () {
            if (dead) return;
            lastHost = Date.now();
            c.subscribe([TP, TA], { qos: 0 }, function () { send(hi); });
          });
        }
        var to = setTimeout(function () {
          fail(found ? "Xona javob bermadi. O'qituvchi ekrani ochiqligini va kodni tekshiring." : "Internetga ulanib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.");
        }, 20000);
        BROKERS.forEach(function (url) {
          var c;
          try { c = mconnect(url, willFor(n)); } catch (e) { return; }
          clients.push(c);
          var first = true;
          c.on("connect", function () {
            if (!first || dead) return; first = false;
            if (found) { if (c !== C) try { c.end(true); } catch (e) {} return; }
            c.subscribe(TI, { qos: 0 });
            if (!probe) probe = setTimeout(function () { if (!found) fail("Bunday kodli xona yo'q. Kodni tekshiring."); }, 7000);
          });
          c.on("message", function (topic, payload) {
            if (dead) return;
            if (topic === TI) { if (!found && payload.toString().slice(0, 4) === "~on ") choose(c); return; }
            if (c === C) onPeerMsg(payload.toString());
          });
          c.on("error", function () {});
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
