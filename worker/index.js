// Copied from push notification example: https://github.com/shadowwalker/next-pwa/blob/master/examples/web-push/worker/index.js
'use strict';

self.addEventListener('push', function (event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/android-chrome-192x192.png',
      vibrate: [30, 100, 30],
      actions: data?.actions || [],
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'TRANSFERS_OPEN') {
    clients.openWindow('/dashboard/membership/club');
    return;
  }

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow('/');
      })
  );
});
