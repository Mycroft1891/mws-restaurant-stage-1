let cacheVersion    = '-v4';
let staticCacheName = 'restaurant';
let imageCacheName  = 'restaurant-imgs';
let currentCache    = staticCacheName + cacheVersion;
let currentImages   = imageCacheName + cacheVersion;
let allCaches       = [currentCache, currentImages];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache)
    .then(cache => cache.addAll([
      '/',
      'index.html',
      'restaurant.html'
    ]))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !allCaches.includes(cacheName));
    }).then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          return caches.delete(cacheToDelete);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(requestUrl).then(response => {
        if (response) return response;
        return servePhoto(event.request)
      })
    );
  }
});

function servePhoto(request) {
  let imageURL = request.url

  return caches.open(currentImages)
  .then(cache => {
    return fetch(imageURL)
    .then(networkResponse => {
      return cache.put(imageURL, networkResponse.clone())
      .then(() => {
        return networkResponse;
      });
    });
  });
}
