// declare cache names
let cacheVersion    = '-v4';
let staticCacheName = 'restaurant';
let currentCache    = staticCacheName + cacheVersion;
let imageCacheName  = 'restaurant-imgs';
let currentImages   = imageCacheName + cacheVersion;
let allCaches       = [currentCache, currentImages];

// when SW is installing
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache)
    .then(cache => {
      return cache.addAll([
        '/',
        'js/prod/index.min.js',
        'js/prod/restaurant.min.js',
        'index.html',
        'restaurant.html',
        'img/map-image.png'
      ]);
    })
  );
});


// when SW is activating
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          console.log('Cache Name:', cacheName);
          return cacheName.startsWith(staticCacheName) && !allCaches.includes(cacheName);
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('error', e => {
  console.log(e);
});


// when the client requests something
self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.endsWith('jpg')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }
  event.respondWith(
		caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


// fetch and cache images
function servePhoto(request) {
  let imageURL = request.url

  return caches.open(currentImages)
  .then(cache => {
    return cache.match(imageURL)
    .then(response => {
      if (response) return response;
      return fetch(request)
      .then(networkResponse => {
        cache.put(imageURL, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
