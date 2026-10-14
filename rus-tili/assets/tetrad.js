/* ТЕТРАДЬ — umumiy skript: menyu, ovoz, saqlash, mashq dvigateli */
(function(){
  "use strict";
  var T = window.Tetrad = {};

  /* ---------- xavfsiz localStorage ---------- */
  T.load = function(key, def){
    try{ var v = localStorage.getItem('tetrad:' + key); return v === null ? def : JSON.parse(v); }
    catch(e){ return def; }
  };
  T.save = function(key, val){
    try{ localStorage.setItem('tetrad:' + key, JSON.stringify(val)); }catch(e){}
  };

  T.esc = function(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  };

  /* ---------- menyu (mobil) ---------- */
  document.addEventListener('DOMContentLoaded', function(){
    var btn = document.querySelector('.menu-btn');
    var links = document.querySelector('.nav-links');
    if (btn && links){
      btn.addEventListener('click', function(){
        var open = links.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });

  /* ---------- toast ---------- */
  var toastEl, toastTimer;
  T.toast = function(msg){
    if (!toastEl){
      toastEl = document.createElement('div');
      toastEl.className = 'toast'; toastEl.setAttribute('role','status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 2200);
  };

  /* ---------- ruscha ovoz (Web Speech API) ---------- */
  var synth = window.speechSynthesis;
  var ruVoice = null;
  function pickVoice(){
    if (!synth) return;
    var vs = synth.getVoices() || [];
    ruVoice = vs.filter(function(v){ return /^ru(-|_|$)/i.test(v.lang); })[0] || null;
  }
  if (synth){
    pickVoice();
    if (typeof synth.onvoiceschanged !== 'undefined') synth.onvoiceschanged = pickVoice;
  } else {
    document.documentElement.classList.add('no-tts');
  }
  T.clean = function(s){ return String(s).replace(/́/g,''); };
  T.speak = function(text){
    if (!synth) return;
    try{
      synth.cancel();
      var u = new SpeechSynthesisUtterance(T.clean(text).replace(/_{2,}/g,' … '));
      u.lang = 'ru-RU'; u.rate = 0.88;
      if (ruVoice) u.voice = ruVoice;
      synth.speak(u);
    }catch(e){}
  };
  T.SAY_SVG = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 8v4h3l4 3.5v-11L6 8H3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13.5 7a4 4 0 0 1 0 6M15.8 4.8a7 7 0 0 1 0 10.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  T.sayBtn = function(text){
    return '<button type="button" class="say" data-say="' + T.esc(T.clean(text)) + '" aria-label="Tinglash" title="Tinglash">' + T.SAY_SVG + '</button>';
  };
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-say]');
    if (b){ e.preventDefault(); e.stopPropagation(); T.speak(b.getAttribute('data-say')); }
  });

  /* ---------- javobni solishtirish ---------- */
  T.norm = function(s){
    return T.clean(s).toLowerCase()
      .replace(/ё/g,'е')
      .replace(/[.,!?;:«»"()—–-]+/g,' ')
      .replace(/\s+/g,' ').trim();
  };

  /* ---------- kirill klaviaturasi ---------- */
  var KB = 'й ц у к е н г ш щ з х ъ ф ы в а п р о л д ж э я ч с м и т ь б ю ё'.split(' ');

  function shuffle(a){
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  T.shuffle = shuffle;

  function fmtQ(q){
    return T.esc(q).replace(/_{3,}/g, '<span style="border-bottom:2px solid var(--margin);display:inline-block;min-width:3.2em">&nbsp;</span>');
  }

  /*
   * Mashqlar ro'yxatini chizadi.
   *   item = { t:'c', q:'…', o:['a','b'], a:0, h:'izoh' }   — tanlash
   *   item = { t:'i', q:'… ___ …', a:['javob','muqobil'], h:'izoh' } — yozish
   * opts = { key: 'saqlash-kaliti', onScore: fn(ok,total) , showKb: true }
   */
  T.renderExercises = function(root, items, opts){
    opts = opts || {};
    var state = {};
    root.innerHTML = '';
    var list = document.createElement('div');
    list.className = 'ex-list';
    root.appendChild(list);

    items.forEach(function(it, idx){
      var el = document.createElement('div');
      el.className = 'ex';
      var sayTxt = it.say !== undefined ? it.say
        : (/[а-яё]/i.test(it.q) && !/[a-z]{3,}/i.test(it.q.replace(/\([^)]*\)/g, '')) ? it.q.replace(/\([^)]*\)/g, '').replace(/_{3,}/g, (it.t === 'c' ? it.o[it.a] : it.a[0])) : '');
      var html = '<div class="q"><span class="n">' + (idx + 1) + '.</span>' + fmtQ(it.q) + '</div>';
      if (it.h) html += '<div class="hint">' + T.esc(it.h) + '</div>';
      if (it.t === 'c'){
        var order = (opts.noShuffle || it.ns) ? it.o.map(function(_, i){ return i; }) : shuffle(it.o.map(function(_, i){ return i; }));
        html += '<div class="opts">' + order.map(function(i){
          return '<button type="button" class="opt" data-i="' + i + '">' + T.esc(it.o[i]) + '</button>';
        }).join('') + '</div>';
      } else {
        html += '<div class="row"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" lang="ru" aria-label="Javob"><button type="button" class="btn btn-primary btn-sm chk">Tekshirish</button>' +
                (opts.showKb !== false ? '<button type="button" class="btn btn-ghost btn-sm kbt" aria-expanded="false">Аа</button>' : '') + '</div>' +
                '<div class="cyr-kb" hidden>' + KB.map(function(k){ return '<button type="button" data-k="' + k + '">' + k + '</button>'; }).join('') + '<button type="button" data-k=" " style="width:auto;padding:0 10px">␣</button><button type="button" data-k="⌫">⌫</button></div>';
      }
      html += '<div class="fb" aria-live="polite"></div>';
      el.innerHTML = html;
      list.appendChild(el);

      var fb = el.querySelector('.fb');
      function mark(ok, given){
        state[idx] = ok;
        el.classList.toggle('ok', ok); el.classList.toggle('bad', !ok);
        var right = it.t === 'c' ? it.o[it.a] : it.a[0];
        fb.className = 'fb ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = ok ? '✓ To\'g\'ri!' + (it.x ? ' <span class="muted">' + T.esc(it.x) + '</span>' : '')
                          : '✗ To\'g\'ri javob: <span class="ans">' + T.esc(right) + '</span>' + (it.x ? ' — <span class="muted">' + T.esc(it.x) + '</span>' : '');
        if (sayTxt) fb.innerHTML += ' <span style="display:inline-flex;align-items:center;gap:6px;margin-left:6px">' + T.sayBtn(sayTxt) + '<span class="muted" style="font-size:13px">gapni tinglang</span></span>';
        update();
      }

      if (it.t === 'c'){
        el.querySelectorAll('.opt').forEach(function(b){
          b.addEventListener('click', function(){
            if (state[idx] !== undefined) return;
            var i = +b.getAttribute('data-i');
            el.querySelectorAll('.opt').forEach(function(x){
              x.disabled = true;
              if (+x.getAttribute('data-i') === it.a) x.classList.add('right');
            });
            if (i !== it.a) b.classList.add('wrong');
            mark(i === it.a);
          });
        });
      } else {
        var inp = el.querySelector('input');
        var chk = el.querySelector('.chk');
        var kb = el.querySelector('.cyr-kb');
        var kbt = el.querySelector('.kbt');
        function check(){
          if (state[idx] !== undefined) return;
          var v = T.norm(inp.value);
          if (!v){ inp.focus(); return; }
          var ok = it.a.some(function(a){ return T.norm(a) === v; });
          inp.classList.add(ok ? 'right' : 'wrong');
          inp.readOnly = true; chk.disabled = true;
          mark(ok);
        }
        chk.addEventListener('click', check);
        inp.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); check(); } });
        if (kbt){
          kbt.addEventListener('click', function(){
            kb.hidden = !kb.hidden; kbt.setAttribute('aria-expanded', kb.hidden ? 'false' : 'true');
          });
          kb.addEventListener('click', function(e){
            var k = e.target.getAttribute && e.target.getAttribute('data-k');
            if (!k || inp.readOnly) return;
            if (k === '⌫') inp.value = inp.value.slice(0, -1); else inp.value += k;
            inp.focus();
          });
        }
      }
    });

    var sc = document.createElement('div');
    sc.className = 'score';
    sc.innerHTML = '<span>Natija: <b class="sv">0 / ' + items.length + '</b> <span class="muted st"></span></span><button type="button" class="btn btn-ghost btn-sm again">Qaytadan</button>';
    root.appendChild(sc);
    sc.querySelector('.again').addEventListener('click', function(){
      T.renderExercises(root, items, opts);
      root.scrollIntoView({behavior:'smooth', block:'start'});
    });

    function update(){
      var done = Object.keys(state).length;
      var ok = Object.keys(state).filter(function(k){ return state[k]; }).length;
      sc.querySelector('.sv').textContent = ok + ' / ' + items.length;
      sc.querySelector('.st').textContent = done < items.length ? '(' + (items.length - done) + ' ta qoldi)' : (ok / items.length >= 0.8 ? '— A\'lo! 🎉' : ok / items.length >= 0.5 ? '— Yaxshi, yana mashq qiling' : '— Qoidani qayta o\'qing');
      if (done === items.length && typeof opts.onScore === 'function') opts.onScore(ok, items.length);
    }
  };
})();
