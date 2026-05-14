const CACHE_NAME = 'ruralmed-v1.0.2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/logo.png',
  '/icons.svg'
];

// Install Event - Pre-cache core assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching core assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate Event - Cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event - Stale-While-Revalidate Strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests and non-GET requests
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Cache the new version
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Fallback if network fails
          return response;
        });

        // Return cached version immediately if available, else wait for network
        return response || fetchPromise;
      });
    })
  );
});
