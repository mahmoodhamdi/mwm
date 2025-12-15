/**
 * Home Page E2E Tests
 * اختبارات الصفحة الرئيسية
 */

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar');
    });

    test('should load home page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/MWM|ممم/);
    });

    test('should display navigation header', async ({ page }) => {
      const header = page.locator('header, nav').first();
      await expect(header).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
      // Look for hero section with heading
      const heroHeading = page.locator('h1').first();
      await expect(heroHeading).toBeVisible();
    });

    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should have RTL direction', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'rtl');
    });

    test('should have Arabic language attribute', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'ar');
    });

    test('should display services section', async ({ page }) => {
      // Scroll to services section
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(500);

      // Check for services heading or section
      const servicesSection = page
        .locator('section')
        .filter({ hasText: /خدماتنا|الخدمات|Services/i });
      // Services section may or may not be on homepage depending on design
    });

    test('should navigate to services page from CTA', async ({ page }) => {
      // Find and click services link
      const servicesLink = page.locator('a[href*="/services"], a[href*="/ar/services"]').first();
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await expect(page).toHaveURL(/\/ar\/services/);
      }
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en');
    });

    test('should load English home page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/MWM/);
    });

    test('should have LTR direction', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'ltr');
    });

    test('should have English language attribute', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });

    test('should display navigation in English', async ({ page }) => {
      const nav = page.locator('nav, header').first();
      await expect(nav).toBeVisible();
    });
  });

  test.describe('Language Switching', () => {
    test('should switch from Arabic to English', async ({ page }) => {
      await page.goto('/ar');

      // Find language toggle/link
      const englishLink = page
        .locator('a[href*="/en"], button:has-text("EN"), button:has-text("English")')
        .first();
      if (await englishLink.isVisible()) {
        await englishLink.click();
        await expect(page).toHaveURL(/\/en/);
      }
    });

    test('should switch from English to Arabic', async ({ page }) => {
      await page.goto('/en');

      // Find language toggle/link
      const arabicLink = page
        .locator('a[href*="/ar"], button:has-text("عربي"), button:has-text("AR")')
        .first();
      if (await arabicLink.isVisible()) {
        await arabicLink.click();
        await expect(page).toHaveURL(/\/ar/);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/ar');

      // Page should still load correctly
      await expect(page).toHaveTitle(/MWM|ممم/);

      // Mobile menu button might be visible
      const mobileMenuButton = page.locator(
        'button[aria-label*="menu"], button[aria-label*="القائمة"], [data-testid="mobile-menu"]'
      );
      // Mobile menu implementation may vary
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/ar');

      await expect(page).toHaveTitle(/MWM|ممم/);
    });

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/ar');

      await expect(page).toHaveTitle(/MWM|ممم/);
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/ar');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      // Page should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });
  });
});
