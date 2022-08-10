// Copied from push notification example: https://github.com/shadowwalker/next-pwa/blob/master/examples/web-push/worker/index.js
'use strict';

self.addEventListener('push', function (event) {
  // console.log(event);
  console.log('JSON Parse, json()');
  console.log(JSON.parse(event.data.json()));
  console.log('JSON Parse, text()');
  console.log(JSON.parse(event.data.text()));
  console.log('json()');
  console.log(event.data.json());
  console.log('text()');
  console.log(event.data.text());
  const data = JSON.parse(event.data.text());
  event.waitUntil(
    registration.showNotification(data.title, {
      body: data.message,
      icon: '/android-chrome-192x192.png',
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
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
