/**
 * Firebase Configuration
 * إعدادات فايربيز
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'auth-pro-33cb9',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | null = null;
let messaging: Messaging | null = null;

/**
 * Initialize Firebase
 * تهيئة فايربيز
 */
export function initializeFirebase(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!getApps().length) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return null;
    }
  } else {
    firebaseApp = getApps()[0];
  }

  return firebaseApp;
}

/**
 * Get Firebase Messaging instance
 * الحصول على مثيل Firebase Messaging
 */
export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = initializeFirebase();
  }

  if (!firebaseApp) {
    return null;
  }

  if (!messaging) {
    try {
      messaging = getMessaging(firebaseApp);
    } catch (error) {
      console.error('Firebase Messaging initialization error:', error);
      return null;
    }
  }

  return messaging;
}

/**
 * Request notification permission and get FCM token
 * طلب إذن الإشعارات والحصول على رمز FCM
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    const firebaseMessaging = getFirebaseMessaging();
    if (!firebaseMessaging) {
      return null;
    }

    // Get FCM token
    const token = await getToken(firebaseMessaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Listen for foreground messages
 * الاستماع للرسائل في المقدمة
 */
export function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): (() => void) | null {
  const firebaseMessaging = getFirebaseMessaging();
  if (!firebaseMessaging) {
    return null;
  }

  return onMessage(firebaseMessaging, callback);
}

/**
 * Show notification
 * عرض إشعار
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!('Notification' in window)) {
    return null;
  }

  if (Notification.permission !== 'granted') {
    return null;
  }

  return new Notification(title, {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    ...options,
  });
}

export default {
  initializeFirebase,
  getFirebaseMessaging,
  requestNotificationPermission,
  onForegroundMessage,
  showNotification,
};
