var CACHE_NAME = 'ezremind-v3';

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

// ---- REMINDER SYSTEM ----
// Store reminders persistently so they survive SW restarts
var reminders = {};

self.addEventListener('message', function(event) {
  var data = event.data || {};
  var type = data.type;
  var payload = data.payload;

  if (type === 'SCHEDULE_NOTIFICATION') {
    var r = payload;
    reminders[r.id] = {
      text: r.text,
      startTime: Date.now() + r.delayMs,
      intervalMs: r.intervalMs,
      urgent: r.urgent || false,
      lastFired: 0
    };
    startLoop();
  }

  if (type === 'CANCEL_NOTIFICATION') {
    delete reminders[payload.id];
  }

  if (type === 'UPDATE_URGENCY') {
    // Only update text and urgency, keep timing intact
    var existing = reminders[payload.id];
    if (existing) {
      existing.text = payload.text;
      existing.urgent = payload.urgent || false;
    }
  }
});

var loopRunning = false;

function startLoop() {
  if (loopRunning) return;
  loopRunning = true;
  checkReminders();
}

function checkReminders() {
  var now = Date.now();
  var hasActive = false;

  for (var id in reminders) {
    var r = reminders[id];
    hasActive = true;

    if (now < r.startTime) continue;

    // Should we fire?
    if (r.lastFired === 0 || (now - r.lastFired) >= r.intervalMs) {
      r.lastFired = now;
      showNotification(r.text, r.urgent);
    }
  }

  if (hasActive) {
    // Check every 30 seconds — this keeps the SW alive
    setTimeout(function() { checkReminders(); }, 30000);
  } else {
    loopRunning = false;
  }
}

function showNotification(text, urgent) {
  var options = {
    body: text,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: urgent ? [300, 100, 300, 100, 300] : [200, 100, 200],
    tag: 'reminder-' + Date.now(),
    renotify: true,
    requireInteraction: true,
    silent: false
  };

  self.registration.showNotification('EZ Remind', options);
}

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
