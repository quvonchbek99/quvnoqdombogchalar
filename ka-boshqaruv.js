/* Kuvonch Academy — o'yinlar uchun "aqlli boshqaruv" (yo'lak tanlash).
   Ovoz / ko'z qarashi / qo'l holati / puflash yordamida 2–5 ta yo'lakdan birini tanlaydi.
   Ishlatish:
     kaControl.start("eye", { lanes: 3, onLane: function (i) {...}, onStatus: function (txt) {...} })
       .then(function () { ... }, function (err) { ... });
     kaControl.stop();
   Kamera/mikrofon ma'lumoti qurilmadan chiqmaydi. */
(function () {
  "use strict";
  var VISION = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
  var MODEL = "https://storage.googleapis.com/mediapipe-models/";
  var visionP = null;
  var cur = null;

  function loadVision() {
    if (!visionP) visionP = import(VISION + "/vision_bundle.mjs").then(function (m) {
      return m.FilesetResolver.forVisionTasks(VISION + "/wasm").then(function (fs) { return { m: m, fs: fs }; });
    });
    return visionP;
  }
  function el(tag, css, parent) {
    var e = document.createElement(tag); if (css) e.style.cssText = css; (parent || document.body).appendChild(e); return e;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---- kamera oynasi (burchakda) ---- */
  function camView(stream) {
    var box = el("div", "position:fixed;right:10px;bottom:10px;width:132px;aspect-ratio:4/3;border-radius:12px;overflow:hidden;border:2px solid #7c9bff;background:#000;z-index:50");
    var v = el("video", "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scaleX(-1)", box);
    v.setAttribute("playsinline", ""); v.muted = true; v.srcObject = stream;
    var c = el("canvas", "position:absolute;inset:0;width:100%;height:100%;transform:scaleX(-1)", box);
    v.play().catch(function () {});
    return { box: box, video: v, canvas: c, ctx: c.getContext("2d") };
  }
  function getCam() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("Kamera qo'llab-quvvatlanmaydi"));
    return navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
  }

  /* ---- kalibrovka oynasi ---- */
  function calibUI() {
    var o = el("div", "position:fixed;inset:0;background:rgba(5,9,18,.92);z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:20px;color:#eef2ff;font:16px system-ui,sans-serif");
    var dot = el("div", "position:absolute;width:34px;height:34px;border-radius:50%;background:#ffd479;box-shadow:0 0 0 8px rgba(255,212,121,.25)", o);
    var h = el("h2", "margin:0", o); h.textContent = "👁 Ko'zni sozlash";
    var p = el("p", "color:#9fb0d0;max-width:420px;margin:0", o);
    return { box: o, dot: dot, text: p, close: function () { o.remove(); } };
  }

  /* ================= USULLAR ================= */
  var M = {};

  M.voice = function (o) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null, on = true;
    if (!SR) return Promise.reject(new Error("Bu brauzer ovozni tanimaydi (Chrome/Edge kerak)"));
    var n = o.lanes;
    var W = [
      [["chap", "chapga", "chapda", "left", "лево", "налево", "левый", "birinchi", "bir", "1", "one"]],
      [["o'rta", "orta", "o'rtaga", "markaz", "markazga", "center", "centre", "центр", "ikkinchi", "ikki", "2", "two"]],
      [["o'ng", "ong", "o'ngga", "ongga", "right", "право", "направо", "правый", "uchinchi", "uch", "3", "three"]]
    ];
    function norm(s) { return s.toLowerCase().replace(/[‘’`ʻʼ]/g, "'").replace(/[.,!?]/g, "").trim(); }
    function lane(word) {
      var idx = -1;
      for (var i = 0; i < 3; i++) if (W[i][0].indexOf(word) > -1) idx = i;
      if (idx < 0 && /^[4-9]$/.test(word)) idx = +word - 1;
      if (idx < 0) return -1;
      if (n === 3) return idx;
      if (n === 2) return idx === 0 ? 0 : (idx === 2 ? 1 : -1);
      return idx < n ? idx : -1;
    }
    rec = new SR(); rec.lang = o.lang || "uz-UZ"; rec.continuous = true; rec.interimResults = true;
    rec.onresult = function (ev) {
      var t = ""; for (var i = ev.resultIndex; i < ev.results.length; i++) t += ev.results[i][0].transcript + " ";
      var words = norm(t).split(/\s+/), hit = -1;
      for (var j = words.length - 1; j >= 0; j--) { var l = lane(words[j]); if (l > -1) { hit = l; break; } }
      if (o.onStatus) o.onStatus("🎙 “" + t.trim().slice(0, 24) + "”");
      if (hit > -1) o.onLane(hit);
    };
    rec.onerror = function (e) { if (e.error === "not-allowed" || e.error === "service-not-allowed") { on = false; if (o.onStatus) o.onStatus("Mikrofon ruxsati berilmadi"); } };
    rec.onend = function () { if (on) { try { rec.start(); } catch (e) {} } };
    try { rec.start(); } catch (e) { return Promise.reject(e); }
    if (o.onStatus) o.onStatus("🎙 Ayting: “chap”, “o'rta” yoki “o'ng”");
    return Promise.resolve({ stop: function () { on = false; try { rec.stop(); } catch (e) {} } });
  };

  M.puff = function (o) {
    var n = o.lanes;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("Mikrofon qo'llab-quvvatlanmaydi"));
    return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(function (s) {
      var ac = new (window.AudioContext || window.webkitAudioContext)(), src = ac.createMediaStreamSource(s), an = ac.createAnalyser();
      an.fftSize = 1024; src.connect(an); var buf = new Float32Array(an.fftSize), raf = 0, samples = [], calib = true, thr = 0.1, hi = false, last = 0, lane = o.start != null ? o.start : Math.floor(n / 2);
      function rms() { an.getFloatTimeDomainData(buf); var q = 0; for (var i = 0; i < buf.length; i++) q += buf[i] * buf[i]; return Math.sqrt(q / buf.length); }
      function loop() {
        raf = requestAnimationFrame(loop); var v = rms(), now = performance.now();
        if (calib) { samples.push(v); return; }
        if (v > thr && !hi && now - last > 320) { hi = true; last = now; lane = (lane + 1) % n; o.onLane(lane); if (o.onStatus) o.onStatus("💨 Puflandi → " + (lane + 1) + "-yo'lak"); }
        if (v < thr * 0.6) hi = false;
      }
      raf = requestAnimationFrame(loop);
      if (o.onStatus) o.onStatus("💨 Mikrofon sozlanmoqda… jim turing");
      return new Promise(function (res) {
        setTimeout(function () {
          calib = false; samples.sort(function (a, b) { return a - b; });
          var base = samples.length ? samples[Math.floor(samples.length * 0.9)] : 0.02; thr = Math.max(0.07, base * 4);
          if (o.onStatus) o.onStatus("💨 Mikrofonga puflang — mashina bir yo'lak o'ngga suriladi (oxirgisidan keyin yana chapga)");
          res({ stop: function () { cancelAnimationFrame(raf); try { s.getTracks().forEach(function (t) { t.stop(); }); ac.close(); } catch (e) {} } });
        }, 1300);
      });
    });
  };

  M.hand = function (o) {
    var n = o.lanes, stream, view, lm, loop = true, raf = 0;
    return getCam().then(function (s) { stream = s; view = camView(s); return loadVision(); }).then(function (v) {
      return v.m.HandLandmarker.createFromOptions(v.fs, { baseOptions: { modelAssetPath: MODEL + "hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task" }, runningMode: "VIDEO", numHands: 1 });
    }).then(function (h) {
      lm = h; var lastLane = -1, sx = null;
      function frame() {
        if (!loop) return; raf = requestAnimationFrame(frame);
        if (view.video.readyState < 2) return;
        view.canvas.width = view.video.videoWidth; view.canvas.height = view.video.videoHeight;
        var r; try { r = lm.detectForVideo(view.video, performance.now()); } catch (e) { return; }
        var c = view.ctx; c.clearRect(0, 0, view.canvas.width, view.canvas.height);
        if (r && r.landmarks && r.landmarks[0]) {
          var hnd = r.landmarks[0], x = 0; hnd.forEach(function (p) { x += p.x; }); x /= hnd.length;
          x = 1 - x; // ko'zgudagi ko'rinish
          sx = sx == null ? x : sx * 0.6 + x * 0.4;
          var lane = clamp(Math.floor(clamp((sx - 0.15) / 0.7, 0, 0.999) * n), 0, n - 1);
          c.fillStyle = "#5ee6c7"; hnd.forEach(function (p) { c.beginPath(); c.arc(p.x * view.canvas.width, p.y * view.canvas.height, 3, 0, 7); c.fill(); });
          if (lane !== lastLane) { lastLane = lane; o.onLane(lane); }
          if (o.onStatus) o.onStatus("✋ Qo'l → " + (lane + 1) + "-yo'lak");
        } else if (o.onStatus) o.onStatus("✋ Qo'lingizni kameraga ko'rsating va chapga-o'ngga suring");
      }
      frame();
      return { stop: function () { loop = false; cancelAnimationFrame(raf); try { lm.close(); } catch (e) {} stream.getTracks().forEach(function (t) { t.stop(); }); view.box.remove(); } };
    }).catch(function (e) { try { stream && stream.getTracks().forEach(function (t) { t.stop(); }); view && view.box.remove(); } catch (x) {} throw e; });
  };

  M.eye = function (o) {
    var n = o.lanes, stream, view, fl, loop = true, raf = 0, collecting = null, sm = null, cal = null, ui = null;
    function feat(L) {
      function rx(i, a, b) { return (L[i].x - L[a].x) / ((L[b].x - L[a].x) || 1e-6); }
      var ix = (rx(468, 33, 133) + rx(473, 362, 263)) / 2;
      var hx = (L[1].x - L[234].x) / ((L[454].x - L[234].x) || 1e-6);
      return (1 - ix) + (1 - hx) * 1.6;
    }
    return getCam().then(function (s) { stream = s; view = camView(s); return loadVision(); }).then(function (v) {
      return v.m.FaceLandmarker.createFromOptions(v.fs, { baseOptions: { modelAssetPath: MODEL + "face_landmarker/face_landmarker/float16/1/face_landmarker.task" }, runningMode: "VIDEO", numFaces: 1 });
    }).then(function (f) {
      fl = f; var lastLane = -1;
      function frame() {
        if (!loop) return; raf = requestAnimationFrame(frame);
        if (view.video.readyState < 2) return;
        view.canvas.width = view.video.videoWidth; view.canvas.height = view.video.videoHeight;
        var r; try { r = fl.detectForVideo(view.video, performance.now()); } catch (e) { return; }
        view.ctx.clearRect(0, 0, view.canvas.width, view.canvas.height);
        if (!r || !r.faceLandmarks || !r.faceLandmarks[0] || r.faceLandmarks[0].length < 478) { if (!collecting && cal && o.onStatus) o.onStatus("👁 Yuz ko'rinmayapti"); return; }
        var L = r.faceLandmarks[0], x = feat(L);
        sm = sm == null ? x : sm * 0.6 + x * 0.4;
        if (collecting) { collecting.push(x); return; }
        if (!cal) return;
        var t = (sm - cal.lo) / (cal.hi - cal.lo || 1e-6);
        var lane = clamp(Math.floor(clamp(t, 0, 0.999) * n), 0, n - 1);
        if (lane !== lastLane) { lastLane = lane; o.onLane(lane); }
        if (o.onStatus) o.onStatus("👁 Qarash → " + (lane + 1) + "-yo'lak");
      }
      frame();
      ui = calibUI();
      var pts = [["Chap chetga qarang", 0.06], ["O'ng chetga qarang", 0.94]], out = [], chain = Promise.resolve();
      pts.forEach(function (p, i) {
        chain = chain.then(function () {
          ui.dot.style.left = "calc(" + (p[1] * 100) + "% - 17px)"; ui.dot.style.top = "calc(50% - 17px)";
          ui.text.textContent = p[0] + " (" + (i + 1) + "/" + pts.length + "). Boshingizni ham biroz buring.";
          return new Promise(function (res) { setTimeout(function () { collecting = []; setTimeout(function () { out.push(collecting); collecting = null; res(); }, 1500); }, 1000); });
        });
      });
      return chain.then(function () {
        ui.close(); ui = null;
        if (out.some(function (a) { return a.length < 6; })) throw new Error("Yuz aniqlanmadi — yorug'roq joyda urinib ko'ring");
        function mean(a) { var s = 0; a.forEach(function (v) { s += v; }); return s / a.length; }
        var a = mean(out[0]), b = mean(out[1]);
        if (Math.abs(b - a) < 0.02) throw new Error("Ko'z harakati sezilmadi");
        cal = { lo: a, hi: b };
        return { stop: function () { loop = false; cancelAnimationFrame(raf); try { fl.close(); } catch (e) {} stream.getTracks().forEach(function (t) { t.stop(); }); view.box.remove(); } };
      });
    }).catch(function (e) { loop = false; try { ui && ui.close(); stream && stream.getTracks().forEach(function (t) { t.stop(); }); view && view.box.remove(); } catch (x) {} throw e; });
  };

  window.kaControl = {
    modes: { tap: "Teginish / klaviatura", voice: "Ovoz", eye: "Ko'z qarashi", hand: "Qo'l holati", puff: "Puflash" },
    start: function (mode, opts) {
      window.kaControl.stop();
      if (!mode || mode === "tap" || !M[mode]) return Promise.resolve();
      return M[mode](opts).then(function (h) { cur = h; });
    },
    stop: function () { if (cur) { try { cur.stop(); } catch (e) {} cur = null; } }
  };
})();
