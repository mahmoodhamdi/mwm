/**
 * Firebase Messaging Service Worker
 * عامل خدمة Firebase Messaging
 */

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase configuration
firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'auth-pro-33cb9.firebaseapp.com',
  projectId: 'auth-pro-33cb9',
  storageBucket: 'auth-pro-33cb9.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: payload.data?.type || 'default',
    data: payload.data,
    requireInteraction: payload.data?.type === 'error' || payload.data?.type === 'warning',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  console.log('[firebase-messaging-sw.js] Notification click:', event.notification);

  event.notification.close();

  // Get the link from notification data
  const link = event.notification.data?.link || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Try to focus an existing window
      for (const client of clientList) {
        if (client.url === link && 'focus' in client) {
          return client.focus();
        }
      }
      // Open a new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(link);
      }
    })
  );
});
