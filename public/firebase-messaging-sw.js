importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyC8jULh0qK38F_as4v87aCM8oGJbAx458g",
  authDomain: "push-test-abbd7.firebaseapp.com",
  projectId: "push-test-abbd7",
  storageBucket: "push-test-abbd7.firebasestorage.app",
  messagingSenderId: "57785707953",
  appId: "1:577857079539:web:b7d6434ac1e2ba8c228f8",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener('push', function(event) {
  if (!event.data) return;

  const payload = event.data.json();
  const notificationData = payload.data;
  const notificationTitle = notificationData.title;
  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon || '/firebase-logo.png',
    badge: '/badge-icon.png',
    data: {
      url: notificationData.url || '/'
    },
    tag: Date.now().toString(),
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
      .then(function(clientList) {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});
