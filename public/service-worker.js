/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'pwa-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json'
];

// INSTALL
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (🔥 NO interceptar APIs)
self.addEventListener('fetch', event => {
  const { request } = event;

  // ❌ NO cachear POST
  if (request.method !== 'GET') return;

  // ❌ NO cachear backend
  if (request.url.includes('onrender.com')) return;

  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});
