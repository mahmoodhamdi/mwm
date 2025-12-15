/**
 * reCAPTCHA Service
 * خدمة التحقق من reCAPTCHA
 */

import axios from 'axios';
import { env, logger } from '../config';

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

interface RecaptchaResult {
  success: boolean;
  score: number;
  errorCodes?: string[];
  skipped?: boolean;
}

// Track if we've logged the startup warning
let hasLoggedStartupWarning = false;

/**
 * Log startup warning about reCAPTCHA configuration
 * تسجيل تحذير بدء التشغيل حول إعدادات reCAPTCHA
 */
function logRecaptchaWarning(): void {
  if (hasLoggedStartupWarning) return;
  hasLoggedStartupWarning = true;

  if (env.isProd) {
    logger.warn(
      '⚠️ SECURITY WARNING: reCAPTCHA is not configured in production. ' +
        'Contact form submissions will be accepted without bot protection. ' +
        'Set RECAPTCHA_SECRET_KEY to enable protection.'
    );
  } else {
    logger.info('reCAPTCHA not configured - verification will be skipped in development/test');
  }
}

/**
 * Check if reCAPTCHA is configured
 * التحقق مما إذا كان reCAPTCHA مُعدًا
 */
export function isRecaptchaConfigured(): boolean {
  return !!env.recaptchaSecretKey;
}

/**
 * Verify reCAPTCHA token
 * التحقق من رمز reCAPTCHA
 */
export async function verifyRecaptcha(token: string): Promise<RecaptchaResult> {
  // If no secret key is configured, handle appropriately
  if (!env.recaptchaSecretKey) {
    logRecaptchaWarning();
    return { success: true, score: 1.0, skipped: true };
  }

  try {
    const response = await axios.post<RecaptchaResponse>(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: env.recaptchaSecretKey,
          response: token,
        },
      }
    );

    const { success, score, 'error-codes': errorCodes } = response.data;

    if (!success) {
      logger.warn('reCAPTCHA verification failed:', errorCodes);
    }

    return {
      success,
      score: score || 0,
      errorCodes,
    };
  } catch (error) {
    logger.error('reCAPTCHA verification error:', error);
    // Return failure on error
    return {
      success: false,
      score: 0,
      errorCodes: ['network-error'],
    };
  }
}

export default {
  verifyRecaptcha,
  isRecaptchaConfigured,
};
