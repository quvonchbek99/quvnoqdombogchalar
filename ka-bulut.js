/*!
 * Kuvonch Academy — bulut moduli (Firebase Auth + Firestore)
 * Akkaunt, tanga va reytingni serverda saqlaydi: boshqa qurilmadan kirish mumkin.
 * Himoya Firestore qoidalarida (firestore.rules). Bu yerdagi kalitlar ochiq bo'lishi mo'ljallangan.
 * Sayt bu modulsiz ham ishlaydi (akkaunt faqat shu qurilmada saqlanadi).
 */
(function () {
  "use strict";
  if (window.kaCloud) return;

  var CFG = {
    apiKey: "AIzaSyAw1lBVzTYqbMfkXeWv5fzKX-ORgsGCXtc",
    authDomain: "kuvonch-academy.firebaseapp.com",
    projectId: "kuvonch-academy",
    storageBucket: "kuvonch-academy.firebasestorage.app",
    messagingSenderId: "135195218981",
    appId: "1:135195218981:web:661a5a028614a9eded5bcc"
  };
  var BASE = "https://www.gstatic.com/firebasejs/13.0.0/";
  var P = null;

  function load() {
    if (!P) {
      P = Promise.all([import(BASE + "firebase-app.js"), import(BASE + "firebase-auth.js"), import(BASE + "firebase-firestore.js")])
        .then(function (m) {
          var app = m[0].initializeApp(CFG);
          return { A: m[1], F: m[2], auth: m[1].getAuth(app), db: m[2].getFirestore(app) };
        });
      P.catch(function () { P = null; });
    }
    return P;
  }

  function norm(s) { return String(s || "").replace(/[ʻʼ‘’`]/g, "'").replace(/[−–—]/g, "-").replace(/\s+/g, " ").trim().toLowerCase(); }

  // Ism+guruhdan maxfiy bo'lmagan "email" (ismni serverga email sifatida yozmaymiz)
  async function emailFor(name, group) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("ka|" + norm(name) + "|" + norm(group)));
    var h = Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("").slice(0, 28);
    return "u" + h + "@kuvonch.academy";
  }

  function uzError(e) {
    var c = (e && e.code) || "";
    if (c === "auth/email-already-in-use") return "Bu ism va guruh bilan akkount allaqachon bor. «Boshqa qurilmadan kirish» orqali parol bilan kiring.";
    if (c === "auth/invalid-credential" || c === "auth/wrong-password" || c === "auth/user-not-found" || c === "auth/invalid-login-credentials") return "Ism, guruh yoki parol noto'g'ri.";
    if (c === "auth/weak-password") return "Parol kamida 6 ta belgidan iborat bo'lsin.";
    if (c === "auth/too-many-requests") return "Juda ko'p urinish. Bir ozdan keyin qayta urinib ko'ring.";
    if (c === "auth/network-request-failed" || c === "unavailable") return "Internet bilan aloqa yo'q. Keyinroq urinib ko'ring.";
    if (c === "auth/operation-not-allowed") return "Parol bilan kirish hali yoqilmagan.";
    if (c === "permission-denied") return "Ruxsat yo'q.";
    return "Xatolik yuz berdi. Qayta urinib ko'ring.";
  }

  function clean(p, F) {
    return {
      name: String(p.name || "").slice(0, 40),
      group: String(p.group || "").slice(0, 20),
      av: Math.max(0, Math.min(11, p.av | 0)),
      coins: Math.max(0, p.coins | 0),
      correct: Math.max(0, p.correct | 0),
      answered: Math.max(0, p.answered | 0),
      tests: Math.max(0, p.tests | 0),
      updated: F.serverTimestamp()
    };
  }

  // Profilni serverga yozish. Qoida: tanga bir yozuvda ko'pi bilan +200 va yozuvlar orasida 2 soniya,
  // shuning uchun katta o'sish bo'laklarga bo'linadi.
  var cloudState = null;   // serverda hozir turgan qiymatlar
  var pushing = false;
  async function push(p) {
    var c = await load(), u = c.auth.currentUser;
    if (!u) return false;
    if (pushing) return false;
    pushing = true;
    try {
      var ref = c.F.doc(c.db, "users", u.uid);
      var target = clean(p, c.F);
      if (!cloudState) {
        var snap = await c.F.getDoc(ref);
        if (snap.exists()) { var d = snap.data(); cloudState = { coins: d.coins | 0, correct: d.correct | 0, answered: d.answered | 0, tests: d.tests | 0 }; }
      }
      if (!cloudState) {
        var first = clean(p, c.F); first.coins = Math.min(first.coins, 5000);
        await c.F.setDoc(ref, first);
        cloudState = { coins: first.coins, correct: first.correct, answered: first.answered, tests: first.tests };
      }
      for (var guard = 0; guard < 60; guard++) {
        var next = clean(p, c.F);
        next.coins = Math.min(target.coins, cloudState.coins + 200);
        next.correct = Math.max(next.correct, cloudState.correct);
        next.answered = Math.max(next.answered, cloudState.answered);
        next.tests = Math.max(next.tests, cloudState.tests);
        next.coins = Math.max(next.coins, cloudState.coins);
        await c.F.setDoc(ref, next);
        var gain = next.coins !== cloudState.coins;
        cloudState = { coins: next.coins, correct: next.correct, answered: next.answered, tests: next.tests };
        if (next.coins >= target.coins) break;
        if (gain) await new Promise(function (r) { setTimeout(r, 2200); });
      }
      return true;
    } catch (e) {
      cloudState = null;
      return false;
    } finally { pushing = false; }
  }

  window.kaCloud = {
    ready: function () { return load().then(function () { return true; }, function () { return false; }); },
    uzError: uzError,
    uid: function () { return P && window.__kaCloudAuth && window.__kaCloudAuth.currentUser ? window.__kaCloudAuth.currentUser.uid : null; },
    // Sahifa ochilganda oldingi sessiya tiklanishini kutish; kirgan bo'lsa uid qaytaradi
    session: function () {
      return load().then(function (c) {
        window.__kaCloudAuth = c.auth;
        return c.auth.authStateReady().then(function () { return c.auth.currentUser ? c.auth.currentUser.uid : null; });
      }, function () { return null; });
    },
    // Yangi akkount: Firebase foydalanuvchisi + profil hujjati
    register: async function (p, password) {
      var c = await load();
      var email = await emailFor(p.name, p.group);
      var cred = await c.A.createUserWithEmailAndPassword(c.auth, email, password);
      window.__kaCloudAuth = c.auth; cloudState = null;
      var first = clean(p, c.F); first.coins = Math.min(first.coins, 5000);
      await c.F.setDoc(c.F.doc(c.db, "users", cred.user.uid), first);
      cloudState = { coins: first.coins, correct: first.correct, answered: first.answered, tests: first.tests };
      return cred.user.uid;
    },
    // Kirish (boshqa qurilmadan ham): profilni serverdan oladi
    login: async function (name, group, password) {
      var c = await load();
      var email = await emailFor(name, group);
      var cred = await c.A.signInWithEmailAndPassword(c.auth, email, password);
      window.__kaCloudAuth = c.auth; cloudState = null;
      var snap = await c.F.getDoc(c.F.doc(c.db, "users", cred.user.uid));
      return { uid: cred.user.uid, data: snap.exists() ? snap.data() : null };
    },
    signOut: async function () { try { var c = await load(); cloudState = null; await c.A.signOut(c.auth); } catch (e) {} },
    push: push,
    // Reyting: eng ko'p tanga to'plaganlar (guruh bo'yicha mijoz tomonda saralanadi)
    top: async function (n) {
      var c = await load();
      var q = c.F.query(c.F.collection(c.db, "users"), c.F.orderBy("coins", "desc"), c.F.limit(n || 50));
      var s = await c.F.getDocs(q), out = [];
      s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, name: x.name, group: x.group, av: x.av, coins: x.coins | 0 }); });
      return out;
    },
    // O'qituvchi jadvali uchun: natijani serverga yozish
    sendResult: async function (topic, correct, total, profile) {
      try {
        var c = await load(), u = c.auth.currentUser; if (!u || !total) return false;
        await c.F.addDoc(c.F.collection(c.db, "results"), {
          uid: u.uid, name: String(profile.name || "").slice(0, 40), group: String(profile.group || "").slice(0, 20),
          topic: String(topic || "").slice(0, 120), correct: correct | 0, total: Math.min(200, total | 0), at: c.F.serverTimestamp()
        });
        return true;
      } catch (e) { return false; }
    },
    deleteProfile: async function () {
      try { var c = await load(), u = c.auth.currentUser; if (u) await c.F.deleteDoc(c.F.doc(c.db, "users", u.uid)); } catch (e) {}
    },
    // O'qituvchi: admins/{uid} hujjati bormi
    isAdmin: async function () {
      try { var c = await load(), u = c.auth.currentUser; if (!u) return false; var s = await c.F.getDoc(c.F.doc(c.db, "admins", u.uid)); return s.exists(); } catch (e) { return false; }
    },
    listResults: async function (n) {
      var c = await load();
      var q = c.F.query(c.F.collection(c.db, "results"), c.F.orderBy("at", "desc"), c.F.limit(n || 500));
      var s = await c.F.getDocs(q), out = [];
      s.forEach(function (d) { var x = d.data(); out.push({ id: d.id, name: x.name, group: x.group, topic: x.topic, correct: x.correct | 0, total: x.total | 0, at: x.at && x.at.toDate ? x.at.toDate() : null }); });
      return out;
    }
  };
})();
