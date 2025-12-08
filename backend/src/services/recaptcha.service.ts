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
}

/**
 * Verify reCAPTCHA token
 * التحقق من رمز reCAPTCHA
 */
export async function verifyRecaptcha(token: string): Promise<RecaptchaResult> {
  // If no secret key is configured, skip verification
  if (!env.recaptchaSecretKey) {
    logger.warn('reCAPTCHA secret key not configured - skipping verification');
    return { success: true, score: 1.0 };
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
};
