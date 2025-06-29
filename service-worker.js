const CACHE_NAME = 'dndbeyond-wrapper-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png'
    // Note: D&D Beyond's content is NOT cached here.
    // Only the wrapper's own files.
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // This service worker will only cache and serve its own wrapper files.
    // It will NOT intercept requests for dndbeyond.com.
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // If not in cache, fetch from network
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
