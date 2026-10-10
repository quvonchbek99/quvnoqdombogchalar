/*! Kuvonch Academy — til tanlagich (uz / ru / en / kk / ky) */
(function () {
  "use strict";
  if (window.kaTil) return;
  var LANGS = [["uz", "O'zbekcha"], ["ru", "Русский"], ["en", "English"], ["kk", "Қазақша"], ["ky", "Кыргызча"]];
  var SR = { uz: "uz-UZ", ru: "ru-RU", en: "en-US", kk: "kk-KZ", ky: "ky-KG" };
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, NOSCRIPT: 1, SVG: 1 };
  var lang = "uz", dict = null, obs = null, timer = null, busy = false;
  var tmap = new WeakMap(), amap = new WeakMap();

  try { var q = /[?&]til=(uz|ru|en|kk|ky)\b/.exec(location.search); lang = (q && q[1]) || localStorage.getItem("ka.til") || "uz"; } catch (e) {}
  if (!SR[lang]) lang = "uz";

  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function tr(s) {
    if (!dict) return null;
    var k = norm(s); if (!k) return null;
    if (dict[k] != null) return dict[k];
    var m = /^((?:\d+|[IVXL]+)\.\s*)(.+)$/.exec(k);
    if (m && dict[m[2]] != null) return m[1] + dict[m[2]];
    return null;
  }
  function textNode(n) {
    var rec = tmap.get(n), cur = n.data, src = cur;
    if (rec && norm(cur) === rec.tr) src = rec.orig; // o'zimiz o'zgartirgan matn
    var t = lang === "uz" ? null : tr(src);
    if (t == null) { if (src !== cur) n.data = src; if (rec && lang === "uz") tmap.delete(n); else if (rec && src === cur) tmap.delete(n); return; }
    var lead = /^\s*/.exec(src)[0], trail = /\s*$/.exec(src)[0];
    var out = lead + t + trail;
    if (n.data !== out) n.data = out;
    tmap.set(n, { orig: src, tr: norm(t) });
  }
  function attrs(el) {
    var rec = amap.get(el) || {};
    ATTRS.forEach(function (a) {
      var v = el.getAttribute && el.getAttribute(a); if (v == null) return;
      var r = rec[a], src = v;
      if (r && norm(v) === r.tr) src = r.orig;
      var t = lang === "uz" ? null : tr(src);
      if (t == null) { if (src !== v) el.setAttribute(a, src); delete rec[a]; return; }
      if (v !== t) el.setAttribute(a, t);
      rec[a] = { orig: src, tr: norm(t) };
    });
    amap.set(el, rec);
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { textNode(root); return; }
    if (root.nodeType !== 1 || SKIP[root.tagName && root.tagName.toUpperCase()]) return;
    if (root.id === "ka-til-box") return;
    attrs(root);
    for (var c = root.firstChild; c; c = c.nextSibling) walk(c);
  }
  function apply(root) {
    busy = true;
    try { walk(root || document.body); if (!root || root === document.body) { document.documentElement.lang = lang; if (!window.__kaTitle) window.__kaTitle = document.title; var t = lang === "uz" ? null : tr(window.__kaTitle); document.title = t || window.__kaTitle; } }
    finally { busy = false; }
  }
  function watch() {
    if (obs) return;
    obs = new MutationObserver(function (ms) {
      if (busy || lang === "uz" && !dict) return;
      clearTimeout(timer);
      timer = setTimeout(function () { apply(document.body); }, 60);
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function loadDict(l) {
    return new Promise(function (ok) {
      if (l === "uz") { dict = null; return ok(); }
      window.KA_TR = window.KA_TR || {};
      if (window.KA_TR[l]) { dict = window.KA_TR[l]; return ok(); }
      var s = document.createElement("script"); s.src = "ka-til-" + l + ".js";
      s.onload = function () { dict = window.KA_TR[l] || null; ok(); };
      s.onerror = function () { dict = null; ok(); };
      document.head.appendChild(s);
    });
  }
  function set(l) {
    if (!SR[l]) return Promise.resolve();
    lang = l; try { localStorage.setItem("ka.til", l); } catch (e) {}
    return loadDict(l).then(function () { apply(document.body); var sel = document.getElementById("ka-til-sel"); if (sel) sel.value = l; try { window.dispatchEvent(new CustomEvent("ka-til", { detail: l })); } catch (e) {} });
  }
  function ui() {
    var box = document.createElement("div"); box.id = "ka-til-box";
    box.style.cssText = "position:fixed;left:112px;top:8px;z-index:961;";
    var sel = document.createElement("select"); sel.id = "ka-til-sel"; sel.setAttribute("aria-label", "Til / Language");
    sel.style.cssText = "background:#141f38;color:#eef2ff;border:1px solid #243252;border-radius:999px;padding:7px 8px;font:700 13px/1 -apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);height:38px;max-width:140px";
    LANGS.forEach(function (x) { var o = document.createElement("option"); o.value = x[0]; o.textContent = "🌐 " + x[1]; sel.appendChild(o); });
    sel.value = lang; sel.onchange = function () { set(sel.value); };
    box.appendChild(sel); document.body.appendChild(box);
  }
  function init() {
    ui(); watch();
    if (lang !== "uz") loadDict(lang).then(function () { apply(document.body); }); else apply(document.body);
  }
  window.kaTil = { get: function () { return lang; }, set: set, speech: function () { return SR[lang]; }, t: function (s) { return lang === "uz" ? s : (tr(s) || s); }, apply: function () { apply(document.body); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
