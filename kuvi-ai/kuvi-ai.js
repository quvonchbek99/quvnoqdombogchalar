/*!
 * Kuvi AI — umumiy mijoz moduli (kuvonch.uz va texnikum1son.uz).
 *  - Miya: «Kuvi serveri» /chat (tools/kuvi-ovoz-worker.js) — oqim (SSE); «Fikrlash» yoqilsa model qanday o'ylagani alohida keladi.
 *  - Agentlar va skilllar: kuvi-ai/agentlar.js (window.KUVI_BILIM) — shu modul o'zi yuklaydi.
 *  - To'liq matematik format: markdown + LaTeX formulalar (KaTeX), formulani bosish — LaTeX nusxa.
 *  - Eksport: .tex fayl, Overleaf'da ochish, Word'ga nusxa (MathML).
 *
 * API (window.KuviAI):
 *   bilim() -> Promise<KUVI_BILIM>             tizim(B, {agent, asos, skill, fikrlash, teg, qosh}) -> tizim matni
 *   sora({tizim, xabarlar, fikrlash: 0|1|2, onFikr, onJavob, signal, max}) -> Promise<{javob, fikr, model, ms}>
 *   chiz(el, markdown)  — formulalar bilan chizadi          html(markdown) -> HTML matn
 *   teg(matn) -> {mood, t}  — boshidagi [happy] kabi kayfiyat tegini ajratadi
 *   latex(markdown, sarlavha) -> .tex hujjat matni   overleaf(tex)   yukla(nom, matn, mime)   word(markdown)   nusxa(matn)
 *   ping() -> Promise<{v, fikr, brains}>         server() -> Kuvi serveri manzili
 */
(function () {
  "use strict";
  if (window.KuviAI) return;
  var VER = "2026-11-22";
  var SRC = (document.currentScript && document.currentScript.src) || "https://kuvonch.uz/kuvi-ai/kuvi-ai.js";
  var BASE = SRC.replace(/[?#].*$/, "").replace(/[^\/]*$/, "");
  var SERVER = "https://kuvi-ovoz.quvonchmash12.workers.dev";
  var KATEX = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/";

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function server() {
    var u = ""; try { u = localStorage.getItem("ka.az.url") || ""; } catch (e) {}
    return String(u || SERVER).replace(/^"|"$/g, "").replace(/\/+$/, "");
  }

  /* ---------- Agentlar va skilllar ---------- */
  var bilimP = null;
  function bilim() {
    if (window.KUVI_BILIM) return Promise.resolve(window.KUVI_BILIM);
    if (!bilimP) bilimP = new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = BASE + "agentlar.js?v=" + VER; s.async = true;
      s.onload = function () { if (window.KUVI_BILIM) res(window.KUVI_BILIM); else { bilimP = null; rej(new Error("agentlar yuklanmadi")); } };
      s.onerror = function () { bilimP = null; rej(new Error("agentlar yuklanmadi")); };
      document.head.appendChild(s);
    });
    return bilimP;
  }
  // tizim matni = agent (yoki sayt bergan «asos») + skilllar + fikrlash qoidalari + kayfiyat tegi + qo'shimcha kontekst
  function tizim(B, o) {
    o = o || {}; B = B || window.KUVI_BILIM || { agent: {}, skill: {} };
    var a = B.agent && B.agent[o.agent], p = [];
    p.push(o.asos || (a && a.tizim) || "Sen — Kuvi, mehribon matematik AI ustozsan.");
    (o.skill || (a && a.skill) || ["formula"]).forEach(function (k) { if (B.skill && B.skill[k]) p.push(B.skill[k]); });
    if (o.fikrlash && B.fikrlash) p.push(B.fikrlash);
    if (o.teg && B.teg) p.push(B.teg);
    if (o.qosh) p.push(o.qosh);
    return p.join("\n\n");
  }

  /* ---------- Miya bilan suhbat (oqim) ---------- */
  function xato(st, m) {
    m = String(m || "");
    if (st === 429 || /429|limit|band/i.test(m)) return "Kuvi hozir band (bepul limit tugadi) — birozdan keyin qayta urinib ko‘ring";
    if (st === 403) return "Kuvi serveri bu sayt uchun hali ochilmagan (serverni yangilash kerak)";
    if (st === 401) return "serverdagi AI kaliti ishlamayapti";
    if (/kalit yo'q|ulanmagan|sozlanmagan/.test(m)) return "Kuvi miyasi ulanmagan (serverda AI kaliti yo‘q)";
    return "server xatosi " + st + (m ? ": " + m.slice(0, 140) : "");
  }
  // <think>…</think> matn ichida kelsa (ba'zi modellar) — fikr va javobga ajratamiz
  function ajrat(raw) {
    if (/^\s*<(t(h(i(n(k)?)?)?)?)?$/.test(raw)) return { f: "", j: "" }; // teg hali chala kelgan
    var m = /^\s*<think>([\s\S]*?)(<\/think>|$)([\s\S]*)$/.exec(raw);
    return m ? { f: m[1], j: m[2] ? m[3] : "" } : { f: "", j: raw };
  }
  function sora(o) {
    o = o || {};
    var t0 = Date.now(), lv = +o.fikrlash || 0;
    var msgs = [{ role: "system", content: o.tizim || "" }].concat(o.xabarlar || []);
    // 🧠🧠 (lv 2) — «to'liq chuqur o'ylash»: server avval yechadi, keyin mustaqil tekshiradi, xato bo'lsa tuzatadi
    var body = { messages: msgs, deep: lv > 0, chuqur: lv > 1, effort: lv > 1 ? "high" : lv ? "medium" : "low", max: o.max || (lv > 1 ? 6000 : lv ? 4000 : 1600), fikr: lv > 0 || !!o.fikr, stream: true };
    if (!window.fetch) return Promise.reject(new Error("brauzer eski"));
    return fetch(server() + "/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: o.signal })
      .then(function (r) {
        if (!r.ok) return r.json()["catch"](function () { return {}; }).then(function (j) { var e = new Error(xato(r.status, j.error)); e.status = r.status; throw e; });
        var model = r.headers.get("X-Kuvi-Model") || "", ct = r.headers.get("Content-Type") || "";
        var done = function (x) { x.model = x.model || model; x.ms = Date.now() - t0; return x; };
        if (!r.body || !r.body.getReader || !/event-stream/.test(ct)) {
          return r.json().then(function (j) {
            var s = ajrat(String(j.text || "")), f = String(j.fikr || "") + s.f;
            if (f && o.onFikr) o.onFikr(f); if (o.onJavob) o.onJavob(s.j);
            return done({ javob: s.j.trim(), fikr: f.trim(), model: j.model || "" });
          });
        }
        return oqim(r.body, o).then(done);
      });
  }
  function oqim(stream, o) {
    var rd = stream.getReader(), dec = new TextDecoder(), buf = "", raw = "", rf = "", err = "";
    var last = { f: "", j: "" };
    function chiq() {
      var s = ajrat(raw), f = rf + s.f;
      if (f !== last.f) { last.f = f; if (o.onFikr) o.onFikr(f); }
      if (s.j !== last.j) { last.j = s.j; if (o.onJavob) o.onJavob(s.j); }
    }
    function satr(l) {
      if (l.indexOf("data:") !== 0) return;
      var d = l.slice(5).trim(); if (!d || d === "[DONE]") return;
      var j; try { j = JSON.parse(d); } catch (e) { return; }
      if (j.error) { err = (j.error && (j.error.message || j.error)) || "xato"; return; }
      var ch = j.choices && j.choices[0], x = ch && (ch.delta || ch.message); if (!x) return;
      var r = x.reasoning != null ? x.reasoning : x.reasoning_content;
      if (typeof r === "string" && r) rf += r;
      if (typeof x.content === "string" && x.content) raw += x.content;
    }
    function pump() {
      return rd.read().then(function (s) {
        if (s.done) { if (buf) satr(buf); chiq(); return; }
        buf += dec.decode(s.value, { stream: true });
        var L = buf.split(/\r?\n/); buf = L.pop();
        for (var i = 0; i < L.length; i++) satr(L[i]);
        chiq();
        return pump();
      });
    }
    return pump().then(function () {
      var s = ajrat(raw);
      if (!s.j.trim() && err) throw new Error(xato(0, String(err)));
      return { javob: s.j.trim(), fikr: (rf + s.f).trim() };
    });
  }
  function ping() {
    return fetch(server() + "/ping").then(function (r) { return r.json(); });
  }
  // Boshidagi kayfiyat tegi: [happy] … — yuz uchun; oqim paytida chala teg ham yashiriladi
  var MOODS = /^\s*\[(neutral|happy|love|think|strict|jealous|sad|wow|laugh|cry|shy|wink|sleepy)\]\s*/i;
  function teg(t) {
    t = String(t || ""); var m = MOODS.exec(t);
    if (m) return { mood: m[1].toLowerCase(), t: t.replace(MOODS, "") };
    if (/^\s*\[[a-z]{0,8}$/i.test(t)) return { mood: "", t: "" };
    return { mood: "", t: t };
  }

  /* ---------- Formulalarni ajratish: $…$, $$…$$, \(…\), \[…\] (kod bloklari ichiga tegilmaydi) ---------- */
  var PH = "\u0001", PHD = "\u0003"; // qator ichidagi va alohida (display) formula belgilari
  var PHR_S = "[" + PH + PHD + "](\\d+)[" + PH + PHD + "]";
  function mathAjrat(src) {
    var s = String(src || ""), out = "", M = [], i = 0, n = s.length;
    function put(tex, d) { M.push({ tex: tex.trim(), d: d }); var c = d ? PHD : PH; out += c + (M.length - 1) + c; }
    while (i < n) {
      var c = s[i];
      if (c === "`") { // kod: ```…``` yoki `…`
        var f = s.slice(i, i + 3) === "```" ? "```" : "`", e = s.indexOf(f, i + f.length);
        if (e < 0) { out += s.slice(i); break; }
        out += s.slice(i, e + f.length); i = e + f.length; continue;
      }
      if (c === "\\" && (s[i + 1] === "[" || s[i + 1] === "(")) {
        var cl = s[i + 1] === "[" ? "\\]" : "\\)", e2 = s.indexOf(cl, i + 2);
        if (e2 > i) { put(s.slice(i + 2, e2), s[i + 1] === "["); i = e2 + 2; continue; }
      }
      if (c === "\\" && s[i + 1] === "$") { out += "$"; i += 2; continue; }
      if (c === "$") {
        if (s[i + 1] === "$") {
          var e3 = s.indexOf("$$", i + 2);
          if (e3 > i + 2) { put(s.slice(i + 2, e3), true); i = e3 + 2; continue; }
        } else if (s[i + 1] && !/\s/.test(s[i + 1])) {
          var j = i + 1, ok = -1;
          while (j < n) {
            if (s[j] === "\\") { j += 2; continue; }
            if (s[j] === "\n" && s[j + 1] === "\n") break;
            if (s[j] === "$") { if (!/\s/.test(s[j - 1]) && !/\d/.test(s[j + 1] || "")) ok = j; break; }
            j++;
          }
          if (ok > 0) { put(s.slice(i + 1, ok), false); i = ok + 1; continue; }
        }
      }
      out += c; i++;
    }
    return { s: out, m: M };
  }

  /* ---------- KaTeX (kerak bo'lganda yuklanadi) ---------- */
  var kxP = null;
  function css(href) { if (document.querySelector('link[href="' + href + '"]')) return; var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l); }
  function js(src) { return new Promise(function (res, rej) { var s = document.createElement("script"); s.src = src; s.async = false; s.onload = res; s.onerror = function () { rej(new Error("yuklanmadi: " + src)); }; document.head.appendChild(s); }); }
  function katex() {
    if (window.katex && window.katex.__kvChem) return Promise.resolve(window.katex);
    if (!kxP) {
      css(KATEX + "katex.min.css");
      kxP = (window.katex ? Promise.resolve() : js(KATEX + "katex.min.js")).then(function () {
        return js(KATEX + "contrib/mhchem.min.js")["catch"](function () {});
      }).then(function () { window.katex.__kvChem = 1; return window.katex; });
      kxP["catch"](function () { kxP = null; });
    }
    return kxP;
  }
  function formula(m, katexOk) {
    var h;
    if (katexOk && window.katex) {
      try { h = window.katex.renderToString(m.tex, { displayMode: m.d, throwOnError: false, strict: "ignore", trust: false, output: "htmlAndMathml" }); }
      catch (e) { h = '<code class="kf-x">' + esc(m.tex) + "</code>"; }
    } else h = '<code class="kf-x">' + esc(m.tex) + "</code>";
    return m.d ? '<span class="kf kf-d" data-tex="' + esc(m.tex) + '" data-d="1" title="Bosing — LaTeX nusxa">' + h + "</span>"
      : '<span class="kf" data-tex="' + esc(m.tex) + '" title="Bosing — LaTeX nusxa">' + h + "</span>";
  }

  /* ---------- Markdown -> HTML (sarlavha, ro'yxat, jadval, kod, iqtibos, qalin/kursiv) ---------- */
  function inl(t) {
    return esc(t)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+?)\*\*/g, "<b>$1</b>")
      .replace(/(^|[\s(>«"])\*(?!\s)([^*]+?)\*(?=[\s).,!?:;»"<]|$)/g, "$1<i>$2</i>")
      .replace(/(^|[\s(>«"])_(?!\s)([^_]+?)_(?=[\s).,!?:;»"<]|$)/g, "$1<i>$2</i>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener nofollow">$1</a>');
  }
  var KOD_TIL = { latex: 1, tex: 1 };
  var HR = /^\s*([-*_])(\s*\1){2,}\s*$/;
  var BR_D1 = new RegExp("<br>(?=" + PHD + ")", "g"), BR_D2 = new RegExp("(" + PHD + "\\d+" + PHD + ")<br>", "g");
  function blok(s) { // s — formulalari o'rnida belgi turgan matn; natija — HTML (belgilar keyin almashtiriladi)
    var L = String(s).replace(/\r/g, "").split("\n"), out = [], i = 0, m;
    var soloD = new RegExp("^\\s*" + PHR_S + "\\s*$");
    while (i < L.length) {
      var l = L[i];
      if ((m = /^\s*```\s*([\w+-]*)\s*$/.exec(l))) { // kod bloki
        var lang = m[1].toLowerCase(), code = []; i++;
        while (i < L.length && !/^\s*```\s*$/.test(L[i])) { code.push(L[i]); i++; }
        i++;
        out.push('<div class="kv-kod" data-lang="' + esc(lang) + '"><div class="kv-kod-h"><span>' + esc(lang || "kod") + '</span><button type="button" data-kv="kod-nusxa">Nusxa</button>' +
          (KOD_TIL[lang] ? '<button type="button" data-kv="kod-overleaf">Overleaf</button>' : "") + "</div><pre><code>" + esc(code.join("\n")) + "</code></pre></div>");
        continue;
      }
      if (/^\s*\|.*\|\s*$/.test(l) && i + 1 < L.length && /^\s*\|?\s*:?-{2,}/.test(L[i + 1])) { // jadval
        var row = function (x) { return x.trim().replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); }); };
        var h = row(l), body = []; i += 2;
        while (i < L.length && /^\s*\|.*\|\s*$/.test(L[i])) { body.push(row(L[i])); i++; }
        out.push('<div class="kv-tbl"><table><thead><tr>' + h.map(function (c) { return "<th>" + inl(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          body.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inl(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>");
        continue;
      }
      if ((m = /^\s*(#{1,6})\s+(.*)$/.exec(l))) { out.push(m[1].length <= 2 ? "<h3>" + inl(m[2]) + "</h3>" : "<h4>" + inl(m[2]) + "</h4>"); i++; continue; }
      if (HR.test(l)) { out.push("<hr>"); i++; continue; }
      if (/^\s*>\s?/.test(l)) {
        var q = []; while (i < L.length && /^\s*>\s?/.test(L[i])) { q.push(L[i].replace(/^\s*>\s?/, "")); i++; }
        out.push("<blockquote>" + blok(q.join("\n")) + "</blockquote>"); continue;
      }
      if (/^\s*([-*•+]|\d+[.)])\s+/.test(l)) { // ro'yxat (ichki qatorlar — chekinish bilan)
        var ol = /^\s*\d/.test(l), items = [];
        while (i < L.length && /^\s*([-*•+]|\d+[.)])\s+/.test(L[i])) {
          var ind = /^\s*/.exec(L[i])[0].length, it = L[i].replace(/^\s*([-*•+]|\d+[.)])\s+/, ""); i++;
          while (i < L.length && L[i].trim() && !/^\s*([-*•+]|\d+[.)])\s+/.test(L[i]) && /^\s{2,}/.test(L[i])) { it += "<br>" + inl(L[i].trim()); i++; }
          items.push("<li" + (ind >= 2 ? ' class="ich"' : "") + ">" + inlKeep(it) + "</li>");
        }
        out.push((ol ? "<ol>" : "<ul>") + items.join("") + (ol ? "</ol>" : "</ul>")); continue;
      }
      if (!l.trim()) { i++; continue; }
      if ((m = soloD.exec(l))) { out.push('<div class="kf-q">' + PH + m[1] + PH + "</div>"); i++; continue; } // alohida qatordagi formula — blok
      var p = [];
      while (i < L.length && L[i].trim() && !/^\s*(#{1,6}\s|[-*•+]\s|\d+[.)]\s|>|```|\|)/.test(L[i]) && !soloD.test(L[i])) { p.push(inl(L[i])); i++; }
      // display formuladan oldin/keyin qator ko'chirish shart emas (formula o'zi alohida qatorda turadi)
      if (p.length) out.push("<p>" + p.join("<br>").replace(BR_D1, "").replace(BR_D2, "$1") + "</p>"); else { out.push("<p>" + inl(l) + "</p>"); i++; }
    }
    return out.join("");
  }
  // ro'yxat bandi: birinchi qism inl() dan o'tadi, «<br>»dan keyingilari allaqachon o'tgan
  function inlKeep(t) { var k = t.indexOf("<br>"); return k < 0 ? inl(t) : inl(t.slice(0, k)) + t.slice(k); }
  function html(md, katexOk) {
    var a = mathAjrat(md), h = blok(a.s);
    if (katexOk === undefined) katexOk = !!window.katex;
    return h.replace(new RegExp(PHR_S, "g"), function (x, k) { var m = a.m[+k]; return m ? formula(m, katexOk) : ""; });
  }
  // keyin(el) — har chizilgandan keyin (KaTeX kechroq yuklansa, qayta chizilganda ham) chaqiriladi
  function chiz(el, md, keyin) {
    if (!el) return;
    stil(); el.classList.add("kv-md");
    var t = String(md || "");
    el.__kvMd = t;
    el.innerHTML = html(t, !!window.katex);
    if (keyin) keyin(el);
    if (!window.katex || !window.katex.__kvChem) {
      katex().then(function () { if (el.__kvMd === t) { el.innerHTML = html(t, true); if (keyin) keyin(el); } }, function () {});
    }
  }

  /* ---------- Eksport: LaTeX hujjat, Overleaf, Word, nusxa ---------- */
  var UNI = { "ʻ": "'", "ʼ": "'", "‘": "'", "’": "'", "“": "``", "”": "''", "…": "\\ldots{}", "•": "\\textbullet{}", "№": "No.", "°": "$^\\circ$", "×": "$\\times$", "÷": "$\\div$",
    "≤": "$\\le$", "≥": "$\\ge$", "≠": "$\\ne$", "≈": "$\\approx$", "−": "-", "±": "$\\pm$", "∞": "$\\infty$", "→": "$\\to$", "⇒": "$\\Rightarrow$", "√": "$\\surd$", "π": "$\\pi$", "∠": "$\\angle$", "△": "$\\triangle$" };
  function tx(t, cyr) { // oddiy matnni LaTeX uchun xavfsiz qilish
    return String(t)
      .replace(/\\/g, "\u0002").replace(/([#%&_{}])/g, "\\$1").replace(/\$/g, "\\$").replace(/\^/g, "\\^{}").replace(/~/g, "\\~{}").replace(/\u0002/g, "\\textbackslash{}")
      .replace(/[ʻʼ‘’“”…•№°×÷≤≥≠≈−±∞→⇒√π∠△]/g, function (c) { return UNI[c]; })
      .replace(cyr ? /[^\u0000-\u017f\u0400-\u04ff\u2013\u2014«»]/g : /[^\u0000-\u017f\u2013\u2014«»]/g, "");
  }
  function txInl(t, cyr) {
    var o = [], re = /(\*\*[^*]+?\*\*|`[^`]+`|\*[^*\s][^*]*?\*)/g, k = 0, m;
    while ((m = re.exec(t))) {
      o.push(tx(t.slice(k, m.index), cyr)); var x = m[0];
      if (x.slice(0, 2) === "**") o.push("\\textbf{" + tx(x.slice(2, -2), cyr) + "}");
      else if (x[0] === "`") o.push("\\texttt{" + tx(x.slice(1, -1), cyr) + "}");
      else o.push("\\emph{" + tx(x.slice(1, -1), cyr) + "}");
      k = m.index + x.length;
    }
    o.push(tx(t.slice(k), cyr)); return o.join("");
  }
  function latex(md, sarlavha) {
    md = String(md || "").replace(MOODS, "");
    // javobda to'liq LaTeX hujjat (```latex … \documentclass … \end{document}) bo'lsa — aynan o'shani beramiz
    var full = /```(?:latex|tex)[^\n]*\n([\s\S]*?\\documentclass[\s\S]*?\\end\{document\})\s*\n?```/.exec(md);
    if (full) return full[1].trim() + "\n";
    var cyr = /[\u0400-\u04ff]/.test(md + (sarlavha || "")), a = mathAjrat(md), L = a.s.replace(/\r/g, "").split("\n"), out = [], i = 0, m;
    var PHR = new RegExp(PHR_S, "g");
    function mth(s) { return s.replace(PHR, function (x, k) { var f = a.m[+k]; return !f ? "" : f.d ? "\n\\[\n" + f.tex + "\n\\]\n" : "\\(" + f.tex + "\\)"; }); }
    function ln(s) { return mth(txInl(s, cyr)); }
    while (i < L.length) {
      var l = L[i];
      if ((m = /^\s*```\s*([\w+-]*)\s*$/.exec(l))) {
        var lang = m[1].toLowerCase(), code = []; i++;
        while (i < L.length && !/^\s*```\s*$/.test(L[i])) { code.push(L[i]); i++; } i++;
        var raw = code.join("\n").replace(PHR, function (x, k) { var f = a.m[+k]; return f ? (f.d ? "$$" + f.tex + "$$" : "$" + f.tex + "$") : ""; });
        if (KOD_TIL[lang]) { var bd = /\\begin\{document\}([\s\S]*?)\\end\{document\}/.exec(raw); out.push(bd ? bd[1].trim() : raw.replace(/\\documentclass[\s\S]*?\n|\\usepackage.*\n/g, "")); }
        else out.push("\\begin{verbatim}\n" + raw + "\n\\end{verbatim}");
        continue;
      }
      if (/^\s*\|.*\|\s*$/.test(l) && i + 1 < L.length && /^\s*\|?\s*:?-{2,}/.test(L[i + 1])) {
        var row = function (x) { return x.trim().replace(/^\||\|$/g, "").split("|").map(function (c) { return ln(c.trim()); }); };
        var h = row(l), rows = []; i += 2;
        while (i < L.length && /^\s*\|.*\|\s*$/.test(L[i])) { var rr = row(L[i]).slice(0, h.length); while (rr.length < h.length) rr.push(""); rows.push(rr); i++; }
        out.push("\\begin{center}\n\\begin{tabular}{|" + h.map(function () { return "l"; }).join("|") + "|}\n\\hline\n" + h.map(function (c) { return "\\textbf{" + c + "}"; }).join(" & ") + " \\\\\n\\hline\n" +
          rows.map(function (r) { return r.join(" & ") + " \\\\"; }).join("\n") + "\n\\hline\n\\end{tabular}\n\\end{center}");
        continue;
      }
      if ((m = /^\s*(#{1,6})\s+(.*)$/.exec(l))) { out.push((m[1].length <= 1 ? "\\section*{" : m[1].length === 2 ? "\\subsection*{" : "\\subsubsection*{") + ln(m[2]) + "}"); i++; continue; }
      if (/^\s*([-*•+]|\d+[.)])\s+/.test(l)) {
        var ol = /^\s*\d/.test(l), it = [];
        while (i < L.length && /^\s*([-*•+]|\d+[.)])\s+/.test(L[i])) { it.push("  \\item " + ln(L[i].replace(/^\s*([-*•+]|\d+[.)])\s+/, ""))); i++; }
        out.push((ol ? "\\begin{enumerate}\n" : "\\begin{itemize}\n") + it.join("\n") + (ol ? "\n\\end{enumerate}" : "\n\\end{itemize}")); continue;
      }
      if (HR.test(l)) { out.push("\\medskip\\hrule\\medskip"); i++; continue; }
      if (/^\s*>\s?/.test(l)) { var q = []; while (i < L.length && /^\s*>\s?/.test(L[i])) { q.push(ln(L[i].replace(/^\s*>\s?/, ""))); i++; } out.push("\\begin{quote}\n" + q.join("\n") + "\n\\end{quote}"); continue; }
      if (!l.trim()) { out.push(""); i++; continue; }
      out.push(ln(l)); i++;
    }
    var chem = a.m.some(function (f) { return /\\ce\{/.test(f.tex); });
    return "% Kuvi AI (kuvonch.uz) — Overleaf yoki istalgan LaTeX muharririda oching (pdfLaTeX)\n" +
      "\\documentclass[12pt,a4paper]{article}\n" +
      (cyr ? "\\usepackage[T2A]{fontenc}\n" : "\\usepackage[T1]{fontenc}\n") +
      "\\usepackage[utf8]{inputenc}\n\\usepackage{lmodern}\n\\usepackage[margin=2cm]{geometry}\n" +
      "\\usepackage{amsmath,amssymb,amsthm,mathtools}\n" + (chem ? "\\usepackage[version=4]{mhchem}\n" : "") +
      "\\usepackage[hidelinks]{hyperref}\n\\setlength{\\parindent}{0pt}\n\\setlength{\\parskip}{6pt}\n" +
      "\\begin{document}\n" + (sarlavha ? "\\section*{" + txInl(sarlavha, cyr) + "}\n\n" : "") +
      out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n\\end{document}\n";
  }
  function overleaf(tex) {
    // sahifa xavfsizlik siyosati (CSP form-action) Overleaf'ga yuborishni to'xtatsa — .tex faylni yuklab beramiz
    var tusdi = false, kuz = function (e) {
      if (!tusdi && /form-action/.test(e.violatedDirective || e.effectiveDirective || "")) {
        tusdi = true; yukla("kuvi-ai.tex", tex, "application/x-tex");
        toast("Overleaf'ga to‘g‘ridan-to‘g‘ri ochib bo‘lmadi — .tex yuklandi: Overleaf → New Project → Upload Project");
      }
    };
    document.addEventListener("securitypolicyviolation", kuz);
    setTimeout(function () { document.removeEventListener("securitypolicyviolation", kuz); }, 3000);
    var f = document.createElement("form");
    f.method = "post"; f.action = "https://www.overleaf.com/docs"; f.target = "_blank"; f.style.display = "none";
    [["encoded_snip", encodeURIComponent(tex)], ["snip_name", "kuvi-ai.tex"], ["engine", "pdflatex"]].forEach(function (p) {
      var x = document.createElement("input"); x.type = "hidden"; x.name = p[0]; x.value = p[1]; f.appendChild(x);
    });
    document.body.appendChild(f); f.submit(); setTimeout(function () { f.remove(); }, 1000);
  }
  function yukla(nom, matn, mime) {
    var b = new Blob([matn], { type: (mime || "text/plain") + ";charset=utf-8" }), u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u; a.download = nom; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 1500);
  }
  function nusxa(t) {
    t = String(t || "");
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t)["catch"](function () { return eskiNusxa(t); });
    return Promise.resolve(eskiNusxa(t));
  }
  function eskiNusxa(t) {
    var a = document.createElement("textarea"); a.value = t; a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select();
    try { document.execCommand("copy"); } catch (e) {} a.remove();
  }
  // Word: formulalar MathML ko'rinishida (Word ularni tenglamaga aylantiradi), qolgani oddiy HTML
  function word(md) {
    md = String(md || "").replace(MOODS, "");
    return katex()["catch"](function () {}).then(function () {
      var a = mathAjrat(md), h = blok(a.s).replace(new RegExp(PHR_S, "g"), function (x, k) {
        var f = a.m[+k]; if (!f) return "";
        try { return window.katex.renderToString(f.tex, { displayMode: f.d, throwOnError: false, strict: "ignore", output: "mathml" }); } catch (e) { return esc(f.tex); }
      }).replace(/<div class="kv-kod-h">[\s\S]*?<\/div>/g, "");
      var doc = "<html><body>" + h + "</body></html>";
      if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        return navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([doc], { type: "text/html" }), "text/plain": new Blob([md], { type: "text/plain" }) })]).then(function () { return "html"; }, function () { return nusxa(md).then(function () { return "matn"; }); });
      }
      return nusxa(md).then(function () { return "matn"; });
    });
  }

  /* ---------- Kichik bildirishnoma va formulani bosib nusxalash ---------- */
  var toastT = null;
  function toast(t) {
    stil(); var el = document.querySelector(".kv-toast");
    if (!el) { el = document.createElement("div"); el.className = "kv-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = t; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove("on"); }, 2600);
  }
  var bosildi = false;
  function tinglash() {
    if (bosildi) return; bosildi = true;
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target : null; if (!t) return;
      var f = t.closest(".kv-md .kf[data-tex]");
      if (f && !t.closest("a,button")) { nusxa(f.getAttribute("data-d") ? "$$" + f.getAttribute("data-tex") + "$$" : "$" + f.getAttribute("data-tex") + "$").then(function () { toast("LaTeX nusxalandi — Word: Alt+= → LaTeX → joylang"); }); return; }
      var b = t.closest(".kv-md [data-kv]"); if (!b) return;
      var box = b.closest(".kv-kod"), code = box ? box.querySelector("code").textContent : "";
      if (b.getAttribute("data-kv") === "kod-nusxa") nusxa(code).then(function () { toast("Kod nusxalandi"); });
      if (b.getAttribute("data-kv") === "kod-overleaf") overleaf(/\\documentclass/.test(code) ? code : latex("```latex\n" + code + "\n```", ""));
    });
  }

  /* ---------- Uslub (bir marta qo'shiladi) ---------- */
  var stilBor = false;
  function stil() {
    if (stilBor) return; stilBor = true; tinglash();
    var s = document.createElement("style"); s.id = "kv-ai-stil";
    s.textContent =
      ".kv-md{line-height:1.6;overflow-wrap:anywhere}.kv-md p{margin:.35em 0}.kv-md h3{font-size:1.08em;margin:.7em 0 .3em}.kv-md h4{font-size:1em;margin:.6em 0 .25em}" +
      ".kv-md ul,.kv-md ol{margin:.3em 0 .3em 1.25em;padding:0}.kv-md li{margin:.15em 0}.kv-md li.ich{margin-left:1.1em}" +
      ".kv-md blockquote{margin:.4em 0;padding:.2em .8em;border-left:3px solid #94a3b8;color:inherit;opacity:.9}" +
      ".kv-md hr{border:0;border-top:1px solid rgba(127,127,127,.35);margin:.8em 0}" +
      ".kv-md code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.9em;background:rgba(127,127,127,.12);padding:.05em .3em;border-radius:4px}" +
      ".kv-md .kf{cursor:copy}.kv-md .kf:hover{background:rgba(34,197,94,.1);border-radius:4px}" +
      ".kv-md .kf-d{display:block;overflow-x:auto;overflow-y:hidden;padding:.15em 0;margin:.35em 0}.kv-md .kf-d .katex-display{margin:.2em 0}" +
      ".kv-md .kf-x{white-space:pre-wrap}.kv-md .katex{font-size:1.08em}" +
      ".kv-md .kv-tbl{overflow-x:auto;margin:.4em 0}.kv-md table{border-collapse:collapse;font-size:.95em}.kv-md th,.kv-md td{border:1px solid rgba(127,127,127,.35);padding:.3em .55em;text-align:left;vertical-align:top}" +
      ".kv-md th{background:rgba(127,127,127,.1)}" +
      ".kv-md .kv-kod{border:1px solid rgba(127,127,127,.3);border-radius:10px;margin:.5em 0;overflow:hidden}.kv-md .kv-kod-h{display:flex;gap:6px;align-items:center;font-size:.78em;padding:.25em .6em;background:rgba(127,127,127,.1)}" +
      ".kv-md .kv-kod-h span{flex:1;opacity:.75}.kv-md .kv-kod-h button{font:inherit;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;border-radius:6px;padding:.1em .5em;cursor:pointer}" +
      ".kv-md pre{margin:0;padding:.6em .7em;overflow-x:auto;font-size:.86em;line-height:1.45}.kv-md pre code{background:none;padding:0}" +
      ".kv-fikr{margin:.2em 0 .5em;border:1px dashed rgba(124,58,237,.45);border-radius:10px;background:rgba(124,58,237,.05)}" +
      ".kv-fikr>summary{cursor:pointer;padding:.35em .7em;font-size:.86em;font-weight:600;color:inherit;opacity:.92;list-style:none}.kv-fikr>summary::-webkit-details-marker{display:none}" +
      ".kv-fikr>summary:before{content:'🧠 '}.kv-fikr.on>summary:after{content:'';display:inline-block;width:.5em;height:.5em;margin-left:.45em;border-radius:50%;background:#7c3aed;animation:kvp 1s infinite}" +
      ".kv-fikr .kv-md{padding:0 .8em .6em;font-size:.88em;opacity:.85;max-height:320px;overflow:auto}@keyframes kvp{50%{opacity:.2}}" +
      ".kv-amal{display:flex;flex-wrap:wrap;gap:6px;margin-top:.45em}.kv-amal button{font:inherit;font-size:.78em;border:1px solid rgba(127,127,127,.35);background:transparent;color:inherit;border-radius:999px;padding:.2em .7em;cursor:pointer}" +
      ".kv-amal button:hover{border-color:#22c55e}.kv-model{font-size:.72em;opacity:.55;margin-top:.3em}" +
      ".kv-toast{position:fixed;left:50%;bottom:22px;transform:translate(-50%,20px);background:#111827;color:#fff;padding:.55em 1em;border-radius:10px;font-size:14px;opacity:0;pointer-events:none;transition:.25s;z-index:2147483000;max-width:92vw;text-align:center}" +
      ".kv-toast.on{opacity:1;transform:translate(-50%,0)}";
    document.head.appendChild(s);
  }

  /* ---------- Tayyor bo'laklar: «Kuvi qanday fikrladi» paneli va amal tugmalari ---------- */
  function fikrPanel(joy) {
    stil();
    var d = document.createElement("details"); d.className = "kv-fikr on"; d.open = true;
    d.innerHTML = "<summary>Kuvi fikrlamoqda…</summary><div></div>";
    joy.appendChild(d);
    var sm = d.querySelector("summary"), ich = d.querySelector("div"), t0 = Date.now(), bor = false, yop = false;
    var sek = function () { return Math.max(1, Math.round((Date.now() - t0) / 1000)); };
    var tm = setInterval(function () { sm.textContent = "Kuvi fikrlamoqda… " + sek() + " s"; }, 1000);
    return {
      el: d,
      yangila: function (t) { bor = !!t; chiz(ich, t); ich.scrollTop = ich.scrollHeight; },
      // javob yozila boshlaganda fikrlash oynasi yig'iladi (bosib qayta ochish mumkin)
      yigil: function () { if (!yop) { yop = true; d.open = false; } },
      tugadi: function (t) {
        clearInterval(tm); d.classList.remove("on"); d.open = false;
        if (t) { chiz(ich, t); sm.textContent = "Kuvi qanday fikrladi · " + sek() + " soniya"; }
        else { sm.textContent = "Kuvi chuqur o‘yladi · " + sek() + " soniya"; if (!bor) chiz(ich, "_Bu safargi miya fikrlash jarayonini ko‘rsatmadi — faqat yakuniy javob keldi._"); }
      }
    };
  }
  function amallar(joy, md, o) {
    stil(); o = o || {};
    var w = document.createElement("div"); w.className = "kv-amal";
    w.innerHTML = '<button type="button" data-a="nusxa">📋 Nusxa</button><button type="button" data-a="word">📝 Word</button><button type="button" data-a="tex">⬇ .tex</button><button type="button" data-a="overleaf">🌿 Overleaf</button>';
    w.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var a = b.getAttribute("data-a"), t = typeof md === "function" ? md() : md;
      if (a === "nusxa") nusxa(String(t).replace(MOODS, "")).then(function () { toast("Javob nusxalandi (formulalar LaTeX'da)"); });
      if (a === "word") word(t).then(function (k) { toast(k === "html" ? "Word'ga joylang (Ctrl+V) — formulalar tenglama bo‘ladi" : "Matn nusxalandi"); });
      if (a === "tex") yukla("kuvi-ai.tex", latex(t, o.sarlavha || ""), "application/x-tex");
      if (a === "overleaf") overleaf(latex(t, o.sarlavha || ""));
    });
    joy.appendChild(w); return w;
  }

  window.KuviAI = {
    v: VER, base: BASE, server: server, bilim: bilim, tizim: tizim, sora: sora, ping: ping, teg: teg,
    chiz: chiz, html: html, katex: katex, latex: latex, overleaf: overleaf, yukla: yukla, word: word, nusxa: nusxa, toast: toast,
    fikrPanel: fikrPanel, amallar: amallar, stil: stil,
    _t: { mathAjrat: mathAjrat, ajrat: ajrat, blok: blok, xato: xato }
  };
})();
