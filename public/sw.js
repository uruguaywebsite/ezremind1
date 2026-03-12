/// <reference lib="webworker" />

const CACHE_NAME = 'recordatorios-v1';

// Install: skip waiting immediately
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// Activate: claim clients and clean old caches
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

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  // Skip chrome-extension and non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Only cache valid responses
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

// Listen for messages from the main app
self.addEventListener('message', function(event) {
  var data = event.data || {};
  var type = data.type;
  var payload = data.payload;

  if (type === 'SCHEDULE_NOTIFICATION') {
    scheduleRepeating(payload.id, payload.text, payload.delayMs, payload.intervalMs);
  }

  if (type === 'CANCEL_NOTIFICATION') {
    cancelReminder(payload.id);
  }
});

// In-memory timer store (service worker lifetime)
var timers = {};

function scheduleRepeating(id, text, delayMs, intervalMs) {
  cancelReminder(id);

  var firstTimeout = setTimeout(function() {
    showNotification(text);
    var interval = setInterval(function() {
      showNotification(text);
    }, intervalMs);
    timers[id] = { timerType: 'interval', ref: interval };
  }, delayMs);

  timers[id] = { timerType: 'timeout', ref: firstTimeout };
}

function cancelReminder(id) {
  var timer = timers[id];
  if (!timer) return;
  if (timer.timerType === 'timeout') clearTimeout(timer.ref);
  if (timer.timerType === 'interval') clearInterval(timer.ref);
  delete timers[id];
}

function showNotification(text) {
  self.registration.showNotification('Recordatorios', {
    body: '🔔 ' + text,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'reminder-' + Date.now(),
    renotify: true,
    requireInteraction: true,
  });
}

// Handle notification click: focus the app
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
