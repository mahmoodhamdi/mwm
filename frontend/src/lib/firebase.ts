/**
 * Firebase Configuration
 * إعدادات فايربيز
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  Auth,
  UserCredential,
  signOut as firebaseSignOut,
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | null = null;
let messaging: Messaging | null = null;
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();

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

/**
 * Get Firebase Auth instance
 * الحصول على مثيل Firebase Auth
 */
export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = initializeFirebase();
  }

  if (!firebaseApp) {
    return null;
  }

  if (!auth) {
    try {
      auth = getAuth(firebaseApp);
    } catch (error) {
      console.error('Firebase Auth initialization error:', error);
      return null;
    }
  }

  return auth;
}

/**
 * Sign in with Google
 * تسجيل الدخول بجوجل
 */
export async function signInWithGoogle(): Promise<UserCredential | null> {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    console.error('Firebase Auth not initialized');
    return null;
  }

  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    return result;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

/**
 * Get ID token from current user
 * الحصول على توكن المستخدم الحالي
 */
export async function getIdToken(): Promise<string | null> {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth || !firebaseAuth.currentUser) {
    return null;
  }

  try {
    const token = await firebaseAuth.currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

/**
 * Sign out from Firebase
 * تسجيل الخروج من Firebase
 */
export async function signOut(): Promise<void> {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    return;
  }

  try {
    await firebaseSignOut(firebaseAuth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

export default {
  initializeFirebase,
  getFirebaseMessaging,
  requestNotificationPermission,
  onForegroundMessage,
  showNotification,
  getFirebaseAuth,
  signInWithGoogle,
  getIdToken,
  signOut,
};
