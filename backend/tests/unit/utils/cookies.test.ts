/**
 * Cookie Utilities Unit Tests
 * اختبارات وحدة أدوات الكوكيز
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['COOKIE_SECURE'] = 'false';
process.env['COOKIE_SAME_SITE'] = 'lax';

import { Response } from 'express';
import {
  COOKIE_NAMES,
  setAuthCookies,
  clearAuthCookies,
  setCsrfCookie,
} from '../../../src/utils/cookies';

// Mock config
jest.mock('../../../src/config', () => ({
  env: {
    cookie: {
      secure: false,
      sameSite: 'lax',
      domain: undefined,
    },
  },
}));

describe('Cookie Utilities', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
  });

  describe('COOKIE_NAMES', () => {
    it('should define all cookie name constants', () => {
      expect(COOKIE_NAMES.ACCESS_TOKEN).toBe('accessToken');
      expect(COOKIE_NAMES.REFRESH_TOKEN).toBe('refreshToken');
      expect(COOKIE_NAMES.CSRF_TOKEN).toBe('csrfToken');
    });
  });

  describe('setAuthCookies', () => {
    it('should set both access and refresh token cookies', () => {
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';

      setAuthCookies(mockResponse as Response, accessToken, refreshToken);

      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);

      // Check access token cookie
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        COOKIE_NAMES.ACCESS_TOKEN,
        accessToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000, // 15 minutes
        })
      );

      // Check refresh token cookie
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        COOKIE_NAMES.REFRESH_TOKEN,
        refreshToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
      );
    });

    it('should use httpOnly for security', () => {
      setAuthCookies(mockResponse as Response, 'access', 'refresh');

      const calls = (mockResponse.cookie as jest.Mock).mock.calls;

      calls.forEach(call => {
        const options = call[2];
        expect(options.httpOnly).toBe(true);
      });
    });

    it('should set correct path for all cookies', () => {
      setAuthCookies(mockResponse as Response, 'access', 'refresh');

      const calls = (mockResponse.cookie as jest.Mock).mock.calls;

      calls.forEach(call => {
        const options = call[2];
        expect(options.path).toBe('/');
      });
    });
  });

  describe('clearAuthCookies', () => {
    it('should clear both access and refresh token cookies', () => {
      clearAuthCookies(mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        COOKIE_NAMES.ACCESS_TOKEN,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
        })
      );
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        COOKIE_NAMES.REFRESH_TOKEN,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
        })
      );
    });

    it('should use same options as setAuthCookies for clearing', () => {
      clearAuthCookies(mockResponse as Response);

      const calls = (mockResponse.clearCookie as jest.Mock).mock.calls;

      calls.forEach(call => {
        const options = call[1];
        expect(options).toMatchObject({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
        });
      });
    });
  });

  describe('setCsrfCookie', () => {
    it('should set CSRF token cookie', () => {
      const csrfToken = 'test-csrf-token';

      setCsrfCookie(mockResponse as Response, csrfToken);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        COOKIE_NAMES.CSRF_TOKEN,
        csrfToken,
        expect.objectContaining({
          httpOnly: false, // Must be readable by JavaScript
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        })
      );
    });

    it('should set httpOnly to false for CSRF cookie', () => {
      setCsrfCookie(mockResponse as Response, 'csrf-token');

      const call = (mockResponse.cookie as jest.Mock).mock.calls[0];
      const options = call[2];

      expect(options.httpOnly).toBe(false);
    });

    it('should set correct maxAge for CSRF cookie', () => {
      setCsrfCookie(mockResponse as Response, 'csrf-token');

      const call = (mockResponse.cookie as jest.Mock).mock.calls[0];
      const options = call[2];

      expect(options.maxAge).toBe(24 * 60 * 60 * 1000);
    });
  });

  describe('cookie options with domain', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock('../../../src/config', () => ({
        env: {
          cookie: {
            secure: true,
            sameSite: 'strict',
            domain: 'example.com',
          },
        },
      }));
    });

    afterEach(() => {
      jest.resetModules();
    });

    it('should include domain when configured', () => {
      jest.isolateModules(() => {
        const {
          setAuthCookies: setAuthCookiesWithDomain,
        } = require('../../../src/utils/cookies');

        const mockRes = {
          cookie: jest.fn(),
        } as Partial<Response>;

        setAuthCookiesWithDomain(mockRes as Response, 'access', 'refresh');

        const calls = (mockRes.cookie as jest.Mock).mock.calls;

        calls.forEach(call => {
          const options = call[2];
          expect(options.domain).toBe('example.com');
        });
      });
    });
  });

  describe('cookie options in production', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock('../../../src/config', () => ({
        env: {
          cookie: {
            secure: true,
            sameSite: 'strict',
            domain: undefined,
          },
        },
      }));
    });

    afterEach(() => {
      jest.resetModules();
    });

    it('should use secure cookies in production', () => {
      jest.isolateModules(() => {
        const {
          setAuthCookies: setAuthCookiesSecure,
        } = require('../../../src/utils/cookies');

        const mockRes = {
          cookie: jest.fn(),
        } as Partial<Response>;

        setAuthCookiesSecure(mockRes as Response, 'access', 'refresh');

        const calls = (mockRes.cookie as jest.Mock).mock.calls;

        calls.forEach(call => {
          const options = call[2];
          expect(options.secure).toBe(true);
          expect(options.sameSite).toBe('strict');
        });
      });
    });
  });
});
