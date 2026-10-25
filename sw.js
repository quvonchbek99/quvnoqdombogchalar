/* Kuvonch Academy — service worker v4
   - HTML va sayt kodi (JS/CSS/JSON): avval tarmoq (3 soniya kutadi), bo'lmasa kesh — yangilanishdan keyin
     eski va yangi fayllar aralashib qolmaydi (oldin shu sabab ba'zi sahifalar xato berib qotardi)
   - Rasm/shrift: keshdan darhol, orqada yangilanadi
   - MediaPipe qo'l modeli va @versiyali CDN fayllari: bir marta yuklangach keshdan (o'zgarmaydi)
   - Audio/video/APK/ZIP/PDF: service worker ishlatmaydi (iPhone'da ovoz to'xtab qolmasin, xotira to'lmasin) */
const CACHE = 'ka-v4';
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
    const net = fetch(req);
    net.then(r => put(req, r), () => {});
    e.respondWith(
      Promise.race([net, timeout(isHTML ? 6000 : 3000)])
        .catch(() => caches.match(req).then(hit => hit || net.catch(() => isHTML ? caches.match('/index.html').then(r => r || Response.error()) : Response.error())))
    );
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
