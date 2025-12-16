/**
 * CSRF Protection Middleware
 * وسيط حماية CSRF
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { env } from '../config';
import { ApiError } from '../utils/ApiError';

// CSRF token cookie name
export const CSRF_COOKIE_NAME = 'csrfToken';
export const CSRF_HEADER_NAME = 'x-csrf-token';

// Cookie options for CSRF token (must be readable by JavaScript)
const getCsrfCookieOptions = () => ({
  httpOnly: false, // Must be readable by JavaScript
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite as 'strict' | 'lax' | 'none',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  ...(env.cookie.domain && { domain: env.cookie.domain }),
});

/**
 * Generate a cryptographically secure random token
 */
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * CSRF token generator middleware
 * Generates and sets a CSRF token cookie if not present
 * Always sets the token for consistent behavior
 */
export const csrfTokenGenerator = (req: Request, res: Response, next: NextFunction): void => {
  // Get existing token from cookie or generate new one
  let token = req.cookies?.[CSRF_COOKIE_NAME];

  if (!token) {
    token = generateToken();
    res.cookie(CSRF_COOKIE_NAME, token, getCsrfCookieOptions());
  }

  // Attach token to request for later use
  req.csrfToken = token;

  next();
};

/**
 * CSRF validation middleware
 * Validates CSRF token on state-changing requests
 */
export const csrfValidation = (req: Request, res: Response, next: NextFunction): void => {
  // Skip validation for safe methods
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method.toUpperCase())) {
    return next();
  }

  // Skip CSRF validation in test environment
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  // Get token from cookie
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];

  if (!cookieToken) {
    throw new ApiError(
      403,
      'CSRF_TOKEN_MISSING',
      'CSRF token is missing. Please refresh the page | رمز CSRF مفقود. يرجى تحديث الصفحة'
    );
  }

  // Get token from header or body
  const headerToken = req.headers[CSRF_HEADER_NAME] || req.headers[CSRF_HEADER_NAME.toLowerCase()];
  const bodyToken = req.body?._csrf;
  const submittedToken = headerToken || bodyToken;

  if (!submittedToken) {
    throw new ApiError(
      403,
      'CSRF_TOKEN_NOT_SUBMITTED',
      'CSRF token not provided in request | رمز CSRF غير موجود في الطلب'
    );
  }

  // Validate token using timing-safe comparison
  const tokenBuffer = Buffer.from(cookieToken);
  const submittedBuffer = Buffer.from(submittedToken as string);

  if (
    tokenBuffer.length !== submittedBuffer.length ||
    !crypto.timingSafeEqual(tokenBuffer, submittedBuffer)
  ) {
    throw new ApiError(
      403,
      'CSRF_TOKEN_INVALID',
      'Invalid CSRF token. Please refresh the page | رمز CSRF غير صالح. يرجى تحديث الصفحة'
    );
  }

  next();
};

/**
 * Combined CSRF middleware that generates and validates tokens
 * Use this for routes that need CSRF protection
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  csrfTokenGenerator(req, res, () => {
    csrfValidation(req, res, next);
  });
};

// Extend Express Request type to include csrfToken
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      csrfToken?: string;
    }
  }
}

export const csrfMiddleware = {
  csrfTokenGenerator,
  csrfValidation,
  csrfProtection,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
};

export default csrfMiddleware;
