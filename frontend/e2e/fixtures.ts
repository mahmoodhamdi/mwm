/**
 * Playwright Test Fixtures
 * ملفات اختبار Playwright
 */

import { test as base, expect } from '@playwright/test';

// Extend base test with custom fixtures
export const test = base.extend({
  // Auto-navigate to Arabic locale by default
  page: async ({ page }, use) => {
    // Set default language header for Arabic
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ar',
    });
    await use(page);
  },
});

export { expect };

// Test data
export const testData = {
  locales: ['ar', 'en'] as const,

  // Contact form data
  contactForm: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+966501234567',
    subject: 'Test Inquiry',
    message: 'This is a test message for E2E testing purposes.',
  },

  // Newsletter subscription
  newsletter: {
    email: 'newsletter@example.com',
  },

  // Admin credentials
  admin: {
    email: 'admin@mwm.com',
    password: 'Admin123!@#',
  },
};

// Common page selectors
export const selectors = {
  // Navigation
  navbar: 'nav, header',
  navLinks: 'nav a, header a',
  languageToggle: '[data-testid="language-toggle"], button:has-text("EN"), button:has-text("عربي")',
  themeToggle: '[data-testid="theme-toggle"]',

  // Footer
  footer: 'footer',

  // Common elements
  loadingSpinner: '[data-testid="loading"], .animate-spin',
  errorMessage: '[role="alert"], .error, .text-red',
  successMessage: '.success, .text-green',

  // Forms
  submitButton: 'button[type="submit"]',
  inputError: '.error, [aria-invalid="true"]',
};

// Helper functions
export const helpers = {
  // Wait for page to be fully loaded
  async waitForPageLoad(page: ReturnType<typeof base.extend>['page'] extends Promise<infer P> ? P : never) {
    await page.waitForLoadState('networkidle');
  },

  // Check if element is visible
  async isVisible(page: ReturnType<typeof base.extend>['page'] extends Promise<infer P> ? P : never, selector: string) {
    const element = page.locator(selector).first();
    return await element.isVisible();
  },

  // Get current locale from URL
  getLocaleFromUrl(url: string): 'ar' | 'en' {
    if (url.includes('/en/') || url.endsWith('/en')) {
      return 'en';
    }
    return 'ar';
  },
};
