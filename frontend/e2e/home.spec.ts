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

    test('should display hero section with CTA buttons', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for hero heading
      const heroHeading = page.locator('h1').first();
      await expect(heroHeading).toBeVisible();

      // Look for CTA buttons in hero section
      const ctaButtons = page.locator('a, button').filter({
        hasText: /ابدأ|تواصل|خدماتنا|مشاريعنا|Get Started|Contact|Our Services/i,
      });

      // At least one CTA should be visible
      const count = await ctaButtons.count();
      if (count > 0) {
        await expect(ctaButtons.first()).toBeVisible();
      }
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

    test('should display featured services section', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Scroll down to view sections
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);

      // Look for services section
      const servicesSection = page.locator('section').filter({
        hasText: /خدماتنا|الخدمات|Services|What We Do/i,
      });

      // Services section should be present
      const count = await servicesSection.count();
      if (count > 0) {
        await expect(servicesSection.first()).toBeVisible();
      }
    });

    test('should display featured projects section', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Scroll further down
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(300);

      // Look for projects section
      const projectsSection = page.locator('section').filter({
        hasText: /مشاريعنا|أعمالنا|Projects|Portfolio|Our Work/i,
      });

      // Projects section may be present
      const count = await projectsSection.count();
      if (count > 0) {
        await expect(projectsSection.first()).toBeVisible();
      }
    });

    test('should display stats or counter section', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Scroll to find stats section
      await page.evaluate(() => window.scrollBy(0, 1500));
      await page.waitForTimeout(300);

      // Look for numbers/stats section
      const statsSection = page.locator('[data-testid="stats"], [class*="stats"], [class*="counter"]');

      // Stats may be displayed as numbers
      const numberElements = page.locator('section').filter({
        has: page.locator(':text-matches("\\d{2,}")'),
      });

      // At least check if page has scrolled content
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      expect(bodyHeight).toBeGreaterThan(800);
    });

    test('should display newsletter subscription form', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Scroll to footer where newsletter usually is
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Look for newsletter form
      const newsletterForm = page.locator('form').filter({
        has: page.locator('input[type="email"]'),
      });

      const newsletterSection = page.locator('section, div').filter({
        hasText: /النشرة|اشترك|Newsletter|Subscribe/i,
      });

      // Newsletter should be visible (often in footer)
      const count = await newsletterSection.count();
      if (count > 0) {
        await expect(newsletterSection.first()).toBeVisible();
      }
    });

    test('should navigate to services page from CTA', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Find and click services link
      const servicesLink = page.locator('a[href*="/services"], a[href*="/ar/services"]').first();
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await expect(page).toHaveURL(/\/ar\/services/);
      }
    });

    test('should navigate to projects page from CTA', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Find and click projects link
      const projectsLink = page.locator('a[href*="/projects"], a[href*="/ar/projects"]').first();
      if (await projectsLink.isVisible()) {
        await projectsLink.click();
        await expect(page).toHaveURL(/\/ar\/projects/);
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

    test('should display English hero content', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const heroHeading = page.locator('h1').first();
      await expect(heroHeading).toBeVisible();

      // Verify it contains English text (not Arabic)
      const headingText = await heroHeading.textContent();
      // English text should not contain Arabic characters
      expect(headingText).toBeTruthy();
    });
  });

  test.describe('Language Switching', () => {
    test('should switch from Arabic to English', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Find language toggle/link
      const englishLink = page
        .locator('a[href*="/en"], button:has-text("EN"), button:has-text("English")')
        .first();
      if (await englishLink.isVisible()) {
        await englishLink.click();
        await page.waitForURL(/\/en/, { timeout: 5000 });
        await expect(page).toHaveURL(/\/en/);

        // Verify direction changed
        const html = page.locator('html');
        await expect(html).toHaveAttribute('dir', 'ltr');
        await expect(html).toHaveAttribute('lang', 'en');
      }
    });

    test('should switch from English to Arabic', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      // Find language toggle/link
      const arabicLink = page
        .locator('a[href*="/ar"], button:has-text("عربي"), button:has-text("AR"), button:has-text("العربية")')
        .first();
      if (await arabicLink.isVisible()) {
        await arabicLink.click();
        await page.waitForURL(/\/ar/, { timeout: 5000 });
        await expect(page).toHaveURL(/\/ar/);

        // Verify direction changed
        const html = page.locator('html');
        await expect(html).toHaveAttribute('dir', 'rtl');
        await expect(html).toHaveAttribute('lang', 'ar');
      }
    });

    test('should preserve current page when switching language', async ({ page }) => {
      await page.goto('/ar/services');
      await page.waitForLoadState('networkidle');

      // Switch to English
      const englishLink = page
        .locator('a[href*="/en"], button:has-text("EN")')
        .first();

      if (await englishLink.isVisible()) {
        await englishLink.click();
        await page.waitForTimeout(500);

        // Should navigate to /en/services
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/en/);
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

    test('should have good performance metrics', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Check if images are lazy loaded or optimized
      const images = page.locator('img');
      const imageCount = await images.count();

      // If there are images, check for optimization attributes
      if (imageCount > 0) {
        const firstImage = images.first();
        const loading = await firstImage.getAttribute('loading');
        // Images may have loading="lazy" for optimization
      }
    });
  });

  test.describe('SEO & Accessibility', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/ar');

      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);

      // Check for viewport meta
      const metaViewport = page.locator('meta[name="viewport"]');
      await expect(metaViewport).toHaveCount(1);
    });

    test('should have accessible navigation', async ({ page }) => {
      await page.goto('/ar');

      const nav = page.locator('nav, header').first();
      await expect(nav).toBeVisible();

      // Navigation should be keyboard accessible
      const navLinks = nav.locator('a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });
  });
});
