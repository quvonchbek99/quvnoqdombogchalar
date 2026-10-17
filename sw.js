/* Kuvonch Academy — service worker v3
   - Sayt fayllari: avval kesh (tez), orqada yangilanadi (stale-while-revalidate)
   - MediaPipe qo'l modeli (jsdelivr) va CDN kutubxonalari: bir marta yuklangach keshdan — o'yin ikkinchi safar darhol ochiladi
   - HTML: tarmoq birinchi, oflayn bo'lsa kesh
   - Versiyalangan og'ir fayllar (MediaPipe wasm/model, ko'z/qo'l modeli storage.googleapis.com dan):
     keshda bo'lsa — tarmoqqa umuman chiqilmaydi (ular o'zgarmaydi), 2-safardan o'yin darhol ochiladi */
const CACHE = 'ka-v3';
const CDN = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'www.desmos.com', 'storage.googleapis.com'];
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === location.origin, cdn = CDN.includes(url.hostname);
  if (!own && !cdn) return;
  if (url.pathname.endsWith('.apk')) return;
  if (url.hostname === 'storage.googleapis.com' && !url.pathname.startsWith('/mediapipe-models/')) return;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (own && isHTML) {
    e.respondWith(fetch(req).then(r => { if (r.ok) caches.open(CACHE).then(c => c.put(req, r.clone())); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  // MediaPipe wasm/model va @versiyali CDN fayllari o'zgarmaydi — keshda bo'lsa qayta yuklanmaydi
  if (cdn && (url.hostname === 'storage.googleapis.com' || /@\d/.test(url.pathname) || /\.(wasm|data|tflite|task|binarypb)$/.test(url.pathname))) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const r = await fetch(req);
      if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone());
      return r;
    }));
    return;
  }
  // JS/CSS/rasm: keshdan darhol, orqada yangilash
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req);
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || Response.error();
  }));
});
