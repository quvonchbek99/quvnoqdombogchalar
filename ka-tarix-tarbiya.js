/* Kuvonch Academy — «Tarix va Tarbiya» umumiy menyusi.
 * Ibrohim tarix + 9, 10, 11-sinf tarbiya sahifalarini bitta menyuga birlashtiradi.
 * Har bir sahifaning birinchi ekrani (#sSet) tepasiga tablar qo'yadi.
 * «Boshqa sinflar» ichida avval menyuda ko'rinmagan 1, 3, 5, 6, 7, 8-sinf tarbiya sahifalari ham bor. */
(function () {
  var ASOSIY = [
    ['ibrohim-tarix.html', '📜', 'Tarix', '6-sinf · Ibrohim tarix'],
    ['tarbiya-9.html', '🌱', '9-sinf', 'Tarbiya'],
    ['tarbiya-10.html', '🌱', '10-sinf', 'Tarbiya'],
    ['tarbiya-11.html', '🌱', '11-sinf', 'Tarbiya']
  ];
  var BOSHQA = [
    ['tarbiya-1.html', '1-sinf tarbiya'], ['tarbiya-3.html', '3-sinf tarbiya'],
    ['tarbiya-5.html', '5-sinf tarbiya'], ['tarbiya-6.html', '6-sinf tarbiya'],
    ['tarbiya-7.html', '7-sinf tarbiya'], ['tarbiya-8.html', '8-sinf tarbiya'],
    ['umida-huquq.html', '⚖️ 8-sinf huquq']
  ];
  var joriy = (location.pathname.split('/').pop() || '').toLowerCase();

  var css = '.ttm{display:flex;flex-wrap:wrap;gap:8px;align-items:stretch;margin:10px 0 2px;padding:6px;border-radius:16px;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.12)}' +
    '.ttm-h{display:flex;align-items:center;padding:0 8px;font-weight:900;font-size:14px;color:#ffd25a;white-space:nowrap}' +
    '.ttm a,.ttm summary{display:flex;flex-direction:column;justify-content:center;gap:1px;min-height:46px;padding:6px 14px;border-radius:12px;text-decoration:none;color:inherit;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);font-weight:800;font-size:15px;line-height:1.15;cursor:pointer}' +
    '.ttm a small{font-weight:600;font-size:11px;opacity:.75}' +
    '.ttm a:hover,.ttm summary:hover{filter:brightness(1.25)}' +
    '.ttm a.on{background:linear-gradient(180deg,#ffcf55,#f39a1d);color:#2a1700;border-color:transparent}' +
    '.ttm details{position:relative}' +
    '.ttm summary{list-style:none}.ttm summary::-webkit-details-marker{display:none}' +
    '.ttm .ttm-p{position:absolute;z-index:50;top:calc(100% + 6px);right:0;min-width:200px;display:grid;gap:6px;padding:8px;border-radius:14px;background:#0d2a23;border:1px solid rgba(255,255,255,.18);box-shadow:0 10px 30px rgba(0,0,0,.45)}' +
    '.ttm .ttm-p a{min-height:40px}' +
    '@media(max-width:600px){.ttm a,.ttm summary{flex:1 1 40%;align-items:center;text-align:center}.ttm-h{flex-basis:100%;padding:2px 4px}.ttm .ttm-p{left:0;right:auto}}' +
    '@media print{.ttm{display:none}}';

  function qur() {
    if (document.querySelector('.ttm')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var nav = document.createElement('nav'); nav.className = 'ttm'; nav.setAttribute('aria-label', 'Tarix va Tarbiya bo\'limlari');
    var h = '<span class="ttm-h">📚 Tarix va Tarbiya</span>';
    ASOSIY.forEach(function (x) {
      h += '<a href="' + x[0] + '"' + (x[0] === joriy ? ' class="on" aria-current="page"' : '') + '>' + x[1] + ' ' + x[2] + '<small>' + x[3] + '</small></a>';
    });
    var boshqaOn = BOSHQA.some(function (x) { return x[0] === joriy; });
    var bJoriy = BOSHQA.filter(function (x) { return x[0] === joriy; })[0];
    h += '<details><summary' + (boshqaOn ? ' style="background:linear-gradient(180deg,#ffcf55,#f39a1d);color:#2a1700"' : '') + '>' + (bJoriy ? bJoriy[1] : '➕ Boshqa sinflar') + ' ▾</summary><div class="ttm-p">';
    BOSHQA.forEach(function (x) {
      h += '<a href="' + x[0] + '"' + (x[0] === joriy ? ' class="on"' : '') + '>' + x[1] + '</a>';
    });
    h += '</div></details>';
    nav.innerHTML = h;
    var ekran = document.getElementById('sSet') || document.body;
    var top = ekran.querySelector('.top');
    if (top && top.parentNode === ekran) top.insertAdjacentElement('afterend', nav);
    else ekran.insertBefore(nav, ekran.firstChild);
    document.addEventListener('click', function (e) {
      var d = nav.querySelector('details');
      if (d && d.open && !d.contains(e.target)) d.open = false;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', qur); else qur();
})();
