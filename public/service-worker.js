/* eslint-disable no-restricted-globals */

const CACHE_NAME = "pwa-cache-v2";
const STATIC_FILES = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/manifest.json"
];

// Instalación
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES))
  );
  self.skipWaiting();
});

// Activación
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Interceptar fetch
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1️⃣ No interceptar peticiones al backend (API)
  if (url.origin !== self.origin) return;

  // 2️⃣ No interceptar POST u otros métodos
  if (req.method !== "GET") return;

  // 3️⃣ Solo interceptar requests de archivos de frontend
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).catch(() => caches.match("/index.html"));
    })
  );
});
