// Офлайн-режим: файлы сайта сохраняются в браузере, документы никуда не отправляются.
const CACHE = 'raspishis-1519e1fc50';
const PRECACHE = [
  "/",
  "/privacy.html",
  "/site.webmanifest",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  "/assets/app.css?v=80855b66",
  "/assets/app.js?v=053962ef",
  "/assets/sw-register.js",
  "/assets/fonts/fonts.css",
  "/assets/vendor/pdf.min.js",
  "/assets/vendor/pdf.worker.min.js",
  "/assets/vendor/pdf-lib.min.js",
  "/assets/fonts/bad-script-400-cyrillic.woff2",
  "/assets/fonts/bad-script-400-latin.woff2",
  "/assets/fonts/caveat-600-cyrillic.woff2",
  "/assets/fonts/caveat-600-latin.woff2",
  "/assets/fonts/golos-text-400-cyrillic.woff2",
  "/assets/fonts/golos-text-400-latin.woff2",
  "/assets/fonts/golos-text-500-cyrillic.woff2",
  "/assets/fonts/golos-text-500-latin.woff2",
  "/assets/fonts/golos-text-600-cyrillic.woff2",
  "/assets/fonts/golos-text-600-latin.woff2",
  "/assets/fonts/golos-text-700-cyrillic.woff2",
  "/assets/fonts/golos-text-700-latin.woff2",
  "/assets/fonts/jetbrains-mono-500-cyrillic.woff2",
  "/assets/fonts/jetbrains-mono-500-latin.woff2",
  "/assets/fonts/marck-script-400-cyrillic.woff2",
  "/assets/fonts/marck-script-400-latin.woff2"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // Pages: fresh from the network, cached copy when offline
    e.respondWith(fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('/'))));
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
