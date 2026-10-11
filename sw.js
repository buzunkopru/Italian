// Mille service worker: network-first (always fresh when online), cache fallback (works offline).
// Bump CACHE when the list of files changes.
const CACHE = 'mille-v2-4';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'app/style.css',
  'app/main.js',
  'app/util.js',
  'app/bank.js',
  'app/quiz.js',
  'app/resolve.js',
  'app/content.js',
  'app/screens/today.js',
  'app/screens/learn.js',
  'app/screens/words.js',
  'app/screens/settings.js',
  'app/screens/practice.js',
  'app/screens/session.js',
  'app/screens/progress.js',
  'app/screens/placeholder.js',
  'engine/schema.js',
  'engine/dates.js',
  'engine/srs.js',
  'engine/mastery.js',
  'engine/picker.js',
  'engine/wordq.js',
  'engine/session.js',
  'engine/storage.js',
  'engine/streak.js',
  'content/levels.json',
  'content/topics.json',
  'content/questions/index.json',
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
  event.waitUntil(
    caches.open(CACHE)
      .then(async (c) => {
        await c.addAll(ASSETS);
        // question files are listed in the index so new files never need a sw.js edit
        const idx = await (await fetch('content/questions/index.json', { cache: 'no-store' })).json();
        await c.addAll(idx.files.map((f) => 'content/questions/' + f));
      })
      .then(() => self.skipWaiting())
  );
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
