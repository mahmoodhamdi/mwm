/**
 * Firebase Admin Configuration
 * إعدادات فايربيز
 */

import * as admin from 'firebase-admin';
import { logger } from './logger';

// Firebase service account credentials
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID || 'auth-pro-33cb9',
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email:
    process.env.FIREBASE_CLIENT_EMAIL ||
    'firebase-adminsdk-fbsvc@auth-pro-33cb9.iam.gserviceaccount.com',
  client_id: process.env.FIREBASE_CLIENT_ID || '',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CERT_URL || '',
};

let firebaseApp: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK
 * تهيئة Firebase Admin SDK
 */
export function initializeFirebase(): admin.app.App | null {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Check if required credentials are present
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      logger.warn('Firebase credentials not configured - push notifications will be disabled');
      return null;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    logger.info('Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK:', error);
    return null;
  }
}

/**
 * Get Firebase Admin instance
 * الحصول على مثيل Firebase Admin
 */
export function getFirebaseAdmin(): admin.app.App | null {
  return firebaseApp;
}

/**
 * Get Firebase Messaging instance
 * الحصول على مثيل Firebase Messaging
 */
export function getMessaging(): admin.messaging.Messaging | null {
  if (!firebaseApp) {
    return null;
  }
  return admin.messaging(firebaseApp);
}

export default {
  initializeFirebase,
  getFirebaseAdmin,
  getMessaging,
};
