/**
 * Cookie Utilities
 * أدوات الكوكيز
 */

import { Response, CookieOptions } from 'express';
import { env } from '../config';

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  CSRF_TOKEN: 'csrfToken',
} as const;

// Cookie max ages (in milliseconds)
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get base cookie options
 */
const getBaseCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  path: '/',
  ...(env.cookie.domain && { domain: env.cookie.domain }),
});

/**
 * Set authentication cookies
 */
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const baseOptions = getBaseCookieOptions();

  // Set access token cookie
  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...baseOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  // Set refresh token cookie
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...baseOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (res: Response): void => {
  const baseOptions = getBaseCookieOptions();

  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, baseOptions);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, baseOptions);
};

/**
 * Set CSRF token cookie (readable by JavaScript)
 */
export const setCsrfCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAMES.CSRF_TOKEN, token, {
    httpOnly: false, // Must be readable by JavaScript
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    ...(env.cookie.domain && { domain: env.cookie.domain }),
  });
};

export const cookieUtils = {
  COOKIE_NAMES,
  setAuthCookies,
  clearAuthCookies,
  setCsrfCookie,
};

export default cookieUtils;
