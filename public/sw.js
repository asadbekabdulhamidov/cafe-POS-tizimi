// Choyxona POS Service Worker
const CACHE_NAME = 'choyxona-pos-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let network requests go through normally, with fallback if needed
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
