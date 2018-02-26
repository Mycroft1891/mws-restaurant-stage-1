// declare cache names
let cacheVersion    = 'v3';
let staticCacheName = 'restaurant-';
let currentCache    = staticCacheName + cacheVersion
let imageCacheName  = 'restaurant-imgs';
let allCaches       = [currentCache, imageCacheName];

// when SW is installing
self.addEventListener('install', event => {
  event.waitUntil(
    // open static cache
    caches.open(staticCacheName)
    .then(cache => {
      // add static assets to cache
      return cache.addAll([
        'css/styles.css',
        'js/main.js',
        'js/restaurant_info.js',
        'js/dbhelper.js',
        'index.html',
        'restaurant.html'
      ]);
    })
  );
});


// when SW is activating
self.addEventListener('activate', event => {
  event.waitUntil(
    // open cache
    caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // find old static cache
          return cacheName.startsWith(staticCacheName) && !allCaches.includes(cacheName);
        }).map(cacheName => {
          // remove old static cache
          return caches.delete(cacheName);
        })
      );
    })
  );
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

  event.respondWith(caches.match(event.request)
    .then(response => {
      return response || fetch(event.request);
    })
  );
});


// fetch and cache images
function servePhoto(request) {
  let imageURL = request.url

  // open image cache
  return caches.open(imageCacheName)
  .then(cache => {
    // search requested image in cache
    return cache.match(imageURL)
    .then(response => {
      // return image if found
      if (response) return response;

      // fetch image if not found
      return fetch(request)
      .then(networkResponse => {
        // cache the fetched image using a clone
        cache.put(imageURL, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
