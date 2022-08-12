// Copied from push notification example: https://github.com/shadowwalker/next-pwa/blob/master/examples/web-push/worker/index.js
'use strict';

self.addEventListener('push', function (event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      ...(data?.body && { body: data?.body }),
      ...(data?.image && { image: data?.image }),
      ...(data?.data && { data: data?.data }),
      ...(data?.tag && { tag: data?.tag }),
      ...(data?.requireInteraction && { tag: data?.requireInteraction }),
      icon: '/android-chrome-192x192.png',
      vibrate: [30, 100, 30],
      actions: data?.actions || [],
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  if (event?.action === 'TRANSFERS_OPEN') {
    event.notification.close();
    clients.openWindow('/dashboard/membership/club');
    return;
  }

  if (event?.action === 'dismiss') {
    // in future would want to remove the push notification
    event.notification.close();
    return;
  }

  // if is poc notification, don't close the notification
  if (
    event?.action === '' &&
    event?.notification?.tag === 'experiment-schedule-update'
  ) {
    return;
  }

  event.notification.close();
  const url = event?.notification?.data?.url;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];

          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }

        return clients.openWindow(event?.notification?.data?.url || '/');
      })
  );
});
