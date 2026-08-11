/* Service worker for Road to Tomorrow.
   Two jobs: make the app installable, and keep it usable without a connection.
   Bump VERSION to retire old caches on the next visit. */

const VERSION = 'v1';
const SHELL = 'rtt-shell-' + VERSION;
const ART = 'rtt-art-' + VERSION;

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== ART).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Poster art lives on Wikimedia. Keep a copy of each one after it is first
  // seen, so the posters still appear when the device goes offline.
  if (url.hostname === 'upload.wikimedia.org') {
    event.respondWith((async () => {
      const cache = await caches.open(ART);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
      } catch (e) {
        return new Response('', { status: 504, statusText: 'poster unavailable offline' });
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;

  // The page itself: always prefer a fresh copy so updates land immediately,
  // and fall back to the cached one when there is no connection.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(SHELL);
        cache.put('./index.html', res.clone());
        return res;
      } catch (e) {
        return (await caches.match('./index.html')) ||
               (await caches.match('./')) ||
               new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  // Everything else we serve ourselves: cache first, then network.
  event.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    const cache = await caches.open(SHELL);
    cache.put(req, res.clone());
    return res;
  })());
});
