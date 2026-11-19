/* Kuvonch Academy — service worker v5
   - HTML (sahifalar): avval tarmoq. Tarmoq xato bersa — 1 marta qayta urinadi, keyin shu sahifaning o'z
     saqlangan nusxasi, u ham bo'lmasa — «Sahifa yuklanmadi» oynasi (Qayta urinish tugmasi, internet qaytsa o'zi
     ochiladi). Boshqa sahifa o'rniga bosh sahifa HECH QACHON ko'rsatilmaydi: v4 da internet uzilsa yoki ulanish
     xato bersa, hali ochilmagan (yangi) sahifalar o'rniga keshdagi bosh sahifa chiqib qolardi — yangi bo'limlar
     «bosh sahifaga qaytarib yuborayotgandek» ko'rinardi.
   - Sayt kodi (JS/CSS/JSON): avval tarmoq (8 soniyagacha kutadi), bo'lmasa kesh — sekin internetda yangi sahifa
     eski keshdagi skript bilan aralashib qolmasin
   - Rasm/shrift: keshdan darhol, orqada yangilanadi
   - MediaPipe qo'l modeli va @versiyali CDN fayllari: bir marta yuklangach keshdan (o'zgarmaydi)
   - Audio/video/APK/ZIP/PDF: service worker ishlatmaydi (iPhone'da ovoz to'xtab qolmasin, xotira to'lmasin) */
const CACHE = 'ka-v8';
const MAX_ITEMS = 400;
const CDN = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'www.desmos.com', 'storage.googleapis.com'];
const SKIP = /\.(mp3|mp4|m4a|wav|ogg|webm|apk|zip|pdf)$/i;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function put(req, res) {
  if (!res || res.status !== 200 && res.type !== 'opaque') return;
  const copy = res.clone();
  caches.open(CACHE).then(c => c.put(req, copy).then(() => trim(c))).catch(() => {});
}
let trimming = false;
function trim(c) {
  if (trimming) return; trimming = true;
  c.keys().then(ks => Promise.all(ks.slice(0, Math.max(0, ks.length - MAX_ITEMS)).map(k => c.delete(k)))).finally(() => { trimming = false; });
}
function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)); }
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
function fromNet(req) { return fetch(req).then(r => { put(req, r); return r; }); }

// Sahifa (navigatsiya): tarmoq → bo'lmasa shu sahifaning o'z nusxasi → nusxa yo'q bo'lsa yana 1 marta urinish
// → «Sahifa yuklanmadi». Bosh sahifa boshqa sahifaning o'rniga hech qachon berilmaydi.
async function page(req) {
  const net = fromNet(req);
  try {
    return await Promise.race([net, timeout(8000)]);
  } catch (err) {
    const hit = await caches.match(req);
    if (hit) { net.catch(() => {}); return hit; }      // sekin/uzilgan internet: shu sahifaning eski nusxasi
    try { return await net; } catch (e) {}              // nusxa yo'q — tarmoqni oxirigacha kutamiz
    try {                                                // ulanish uzilgan bo'lsa — yana bir urinish (HTTP keshsiz)
      await sleep(1500);
      return await fromNet(new Request(req.url, { credentials: 'same-origin', cache: 'reload', redirect: 'manual' }));
    } catch (e) {}
    return offline();
  }
}
// O'z kodimiz (JS/CSS/JSON): tarmoq birinchi; kesh faqat tarmoq ishlamasa yoki 8 soniyadan ko'p kechiksa
async function code(req) {
  const net = fromNet(req);
  try {
    return await Promise.race([net, timeout(8000)]);
  } catch (err) {
    const hit = await caches.match(req);
    if (hit) { net.catch(() => {}); return hit; }
    return net;
  }
}
function offline() {
  const html = `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Sahifa yuklanmadi — Kuvonch Academy</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1220;color:#eef2ff;font:16px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;text-align:center;padding:24px}
main{max-width:460px}.ic{font-size:56px}h1{font-size:24px;margin:8px 0;color:#5ee6c7}p{color:#c7d2fe}
button,a{display:inline-block;margin:6px;padding:12px 18px;border-radius:12px;background:#141f38;border:1px solid #243252;color:#eef2ff;text-decoration:none;font:inherit;font-weight:700;cursor:pointer}
button{background:#5ee6c7;color:#0b1220;border-color:transparent}small{display:block;margin-top:14px;color:#8892b0}</style></head>
<body><main><div class="ic">📡</div><h1>Sahifa yuklanmadi</h1>
<p>Internet aloqasi uzildi yoki juda sekin. Bu sahifa hali qurilmangizga saqlanmagan, shuning uchun uni internetsiz ochib bo'lmaydi.</p>
<button type="button" onclick="location.reload()">🔄 Qayta urinish</button><a href="/">🏠 Bosh sahifa</a>
<small id="h">Internet qaytishi bilan sahifa o'zi ochiladi.</small></main>
<script>(function(){var k='ka.sw.retry:'+location.pathname,n=0;try{n=+sessionStorage.getItem(k)||0}catch(e){}
function go(){try{sessionStorage.setItem(k,n+1)}catch(e){}location.reload()}
addEventListener('online',go);
if(n<5){var t=0,iv=setInterval(function(){t++;if(t>40){clearInterval(iv);return}
fetch(location.href,{method:'HEAD',cache:'no-store'}).then(function(){clearInterval(iv);go()},function(){})},4000)}
else document.getElementById('h').textContent="Sahifa bir necha marta ochilmadi. Internetni tekshirib, «Qayta urinish»ni bosing.";})();</script>
</body></html>`;
  return new Response(html, { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  const own = url.origin === location.origin, cdn = CDN.includes(url.hostname);
  if (!own && !cdn) return;
  if (SKIP.test(url.pathname)) return;
  if (url.hostname === 'storage.googleapis.com' && !url.pathname.startsWith('/mediapipe-models/')) return;

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  const isCode = own && /\.(js|css|json)$/i.test(url.pathname);

  // HTML va o'z kodimiz: tarmoq birinchi
  if (own && (isHTML || isCode)) {
    e.respondWith(isHTML ? page(req) : code(req));
    return;
  }
  // MediaPipe wasm/model va @versiyali CDN fayllari o'zgarmaydi — keshda bo'lsa qayta yuklanmaydi
  if (cdn && (url.hostname === 'storage.googleapis.com' || /@\d/.test(url.pathname) || /\.(wasm|data|tflite|task|binarypb)$/.test(url.pathname))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { put(req, r); return r; })));
    return;
  }
  // Rasm, shrift va boshqalar: keshdan darhol, orqada yangilash
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => { put(req, r); return r; }).catch(() => null);
    return hit || net.then(r => r || Response.error());
  }));
});

// Viktorina: «…, viktorinaga qayting!» bildirishnomasi bosilganda — ochiq viktorina varag'iga qaytaramiz
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const want = new URL((e.notification.data && e.notification.data.url) || 'viktorina.html', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) if (new URL(c.url).pathname.endsWith('/viktorina.html') && 'focus' in c) return c.focus();
    return self.clients.openWindow ? self.clients.openWindow(want) : null;
  }));
});
