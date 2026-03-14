var CACHE_NAME = 'ezremind-v4';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});

// Simple notification display - called from the page
self.addEventListener('message', function(event) {
  var data = event.data || {};

  if (data.type === 'SHOW_NOTIFICATION') {
    var p = data.payload;
    self.registration.showNotification('EZ Remind', {
      body: p.text,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: p.urgent ? [300, 100, 300, 100, 300] : [200, 100, 200],
      tag: 'ezremind-' + (p.id || Date.now()),
      renotify: true,
      requireInteraction: true,
      silent: false
    });
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function(clients) {
      if (clients.length > 0) {
        return clients[0].focus();
      } else {
        return self.clients.openWindow('/');
      }
    })
  );
});
