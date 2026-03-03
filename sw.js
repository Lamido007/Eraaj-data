// Eraaj-Data Service Worker v1.0
const CACHE_NAME = 'eraaj-data-v1';
const OFFLINE_URL = '/Eraaj-data/';

const CACHE_ASSETS = [
  '/Eraaj-data/',
  '/Eraaj-data/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://js.paystack.co/v1/inline.js'
];

// Install — cache key assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_ASSETS).catch(() => {
        // Silently fail if some assets can't be cached
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch — serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET and Firebase requests (always need fresh data)
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('firebase')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache fresh responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
