// Mille service worker: network-first (always fresh when online), cache fallback (works offline).
// Bump CACHE when the list of files changes.
const CACHE = 'mille-v2-1';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'app/style.css',
  'app/main.js',
  'app/util.js',
  'app/content.js',
  'app/screens/today.js',
  'app/screens/learn.js',
  'app/screens/words.js',
  'app/screens/settings.js',
  'app/screens/placeholder.js',
  'engine/schema.js',
  'engine/storage.js',
  'engine/streak.js',
  'content/levels.json',
  'content/words.json',
  'content/lessons/level-1.json',
  'content/lessons/level-2.json',
  'content/lessons/level-3.json',
  'content/lessons/level-4.json',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(async () => (await caches.match(req)) || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
  );
});
