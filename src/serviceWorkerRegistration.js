/* eslint-disable no-restricted-globals */
/* ======================================================
   Service Worker - PWA seguro (CRA + Render API)
   - Mantiene PWA
   - Cachea solo assets del frontend
   - NO intercepta POST
   - NO intercepta API externa
====================================================== */

const STATIC_CACHE = 'static-cache-v1';

/* =========================
   INSTALL
========================= */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

/* =========================
   ACTIVATE
========================= */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE) {
            return caches.delete(cache);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* =========================
   FETCH
========================= */
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 🚫 NO interceptar API externa (Render)
  if (request.url.startsWith('https://backend-cc-ui7i.onrender.com')) {
    return;
  }

  // 🚫 NO interceptar métodos distintos de GET
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 🚫 NO interceptar peticiones cross-origin
  if (url.origin !== self.location.origin) {
    return;
  }

  // ✅ Cache-first SOLO para assets del frontend
  event.respondWith(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      })
    )
  );
});
