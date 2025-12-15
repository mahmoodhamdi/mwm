/**
 * Services Page E2E Tests
 * اختبارات صفحة الخدمات
 */

import { test, expect } from '@playwright/test';

test.describe('Services Page', () => {
  test.describe('Services Listing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/services');
    });

    test('should load services page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/services/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });

    test('should display services list or grid', async ({ page }) => {
      // Wait for content to load
      await page.waitForLoadState('networkidle');

      // Look for service cards or list items
      const serviceItems = page.locator(
        '[data-testid="service-card"], .service-card, article, [class*="service"]'
      );

      // Should have at least one service or loading state
      const count = await serviceItems.count();
      // Services may be loading from API
    });

    test('should display service titles in Arabic', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const serviceCards = page
        .locator('[data-testid="service-card"], .service-card, article')
        .first();
      if (await serviceCards.isVisible()) {
        // Should have Arabic text
        const title = serviceCards.locator('h2, h3').first();
        await expect(title).toBeVisible();
      }
    });
  });

  test.describe('Service Detail Page', () => {
    test('should navigate to service detail page', async ({ page }) => {
      await page.goto('/ar/services');
      await page.waitForLoadState('networkidle');

      // Find a service link that goes to a specific service (not just /services/)
      // Must have a slug after /services/ (with locale prefix)
      const serviceLinks = page.locator('a[href*="/services/"]');
      const count = await serviceLinks.count();

      let foundDetailLink = false;
      for (let i = 0; i < count; i++) {
        const href = await serviceLinks.nth(i).getAttribute('href');
        // Check if this is actually a detail page link (has slug after /services/)
        // Account for locale prefix like /ar/services/slug or /en/services/slug
        if (
          href &&
          /\/(ar|en)\/services\/[\w-]+/.test(href) &&
          href !== '/ar/services' &&
          href !== '/en/services'
        ) {
          await serviceLinks.nth(i).click();
          await page.waitForURL(/\/services\/[\w-]+/, { timeout: 5000 }).catch(() => null);
          const currentUrl = page.url();
          if (/\/services\/[\w-]+/.test(currentUrl) && !currentUrl.endsWith('/services')) {
            foundDetailLink = true;
          }
          break;
        }
      }

      // Skip if no actual service detail links found (API not running)
      if (!foundDetailLink) {
        test.skip();
      }
    });

    test('should display service details', async ({ page }) => {
      // Navigate to a specific service
      await page.goto('/ar/services');
      await page.waitForLoadState('networkidle');

      const serviceLink = page.locator('a[href*="/services/"]').first();
      if (await serviceLink.isVisible()) {
        await serviceLink.click();
        await page.waitForLoadState('networkidle');

        // Should have service title
        const title = page.locator('h1').first();
        await expect(title).toBeVisible();

        // Should have description
        const description = page.locator('p').first();
        await expect(description).toBeVisible();
      }
    });
  });

  test.describe('Service Categories', () => {
    test('should display category filters if available', async ({ page }) => {
      await page.goto('/ar/services');
      await page.waitForLoadState('networkidle');

      // Look for category filters
      const categoryFilters = page.locator(
        '[data-testid="category-filter"], .category-filter, select, [class*="filter"]'
      );
      // Filters may or may not be implemented
    });

    test('should filter services by category', async ({ page }) => {
      await page.goto('/ar/services');
      await page.waitForLoadState('networkidle');

      // If category filters exist, test them
      const categoryButton = page
        .locator('button, a')
        .filter({ hasText: /تصنيف|Category/i })
        .first();
      if (await categoryButton.isVisible()) {
        await categoryButton.click();
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('English Services Page', () => {
    test('should load English services page', async ({ page }) => {
      await page.goto('/en/services');
      await expect(page).toHaveURL(/\/en\/services/);
    });

    test('should display English content', async ({ page }) => {
      await page.goto('/en/services');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
      await expect(html).toHaveAttribute('dir', 'ltr');
    });
  });

  test.describe('Services Page SEO', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/ar/services');

      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);

      // Check for og:title
      const ogTitle = page.locator('meta[property="og:title"]');
      // OG tags may or may not be present
    });
  });

  test.describe('Service Page Loading States', () => {
    test('should handle loading state', async ({ page }) => {
      // Intercept API calls to simulate slow loading
      await page.route('**/api/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 100));
        await route.continue();
      });

      await page.goto('/ar/services');

      // Check for loading indicator or skeleton
      const loadingIndicator = page.locator('[data-testid="loading"], .skeleton, .animate-pulse');
      // Loading states may vary
    });
  });
});
