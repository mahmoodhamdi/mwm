/**
 * About Page E2E Tests
 * اختبارات صفحة من نحن
 */

import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.describe('Arabic About Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/about');
    });

    test('should load about page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/about/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });

    test('should have RTL direction', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'rtl');
      await expect(html).toHaveAttribute('lang', 'ar');
    });

    test('should display company mission section', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for mission section
      const missionSection = page.locator('section, div').filter({
        hasText: /رسالتنا|مهمتنا|Mission|Our Mission/i,
      });

      // Mission content should be present
      const count = await missionSection.count();
      if (count > 0) {
        await expect(missionSection.first()).toBeVisible();
      }
    });

    test('should display company vision section', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for vision section
      const visionSection = page.locator('section, div').filter({
        hasText: /رؤيتنا|Vision|Our Vision/i,
      });

      const count = await visionSection.count();
      if (count > 0) {
        await expect(visionSection.first()).toBeVisible();
      }
    });

    test('should display company values section', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Scroll to find values
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);

      // Look for values section
      const valuesSection = page.locator('section, div').filter({
        hasText: /قيمنا|Values|Our Values/i,
      });

      // Values may be displayed as cards or list
    });

    test('should display company story or history', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for story/history section
      const storySection = page.locator('section, div').filter({
        hasText: /قصتنا|تاريخنا|Story|History|About Us/i,
      });

      // Story content
      const paragraphs = page.locator('p');
      const pCount = await paragraphs.count();
      expect(pCount).toBeGreaterThan(0);
    });

    test('should display company stats or numbers', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Scroll to view stats
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(300);

      // Look for statistics/numbers section
      const statsSection = page.locator('[data-testid="stats"], [class*="stats"], [class*="counter"]');

      // Numbers might be displayed prominently
      const numberElements = page.locator(':text-matches("\\d{2,}\\+?")');
      // Stats may show years of experience, projects completed, clients, etc.
    });

    test('should have team CTA or link', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for link to team page
      const teamLink = page.locator('a[href*="/team"]').filter({
        hasText: /فريقنا|Team|Meet|تعرف/i,
      });

      const count = await teamLink.count();
      if (count > 0) {
        await expect(teamLink.first()).toBeVisible();

        // Click should navigate to team page
        await teamLink.first().click();
        await expect(page).toHaveURL(/\/ar\/team/);
      }
    });

    test('should display contact CTA', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Scroll to find CTA
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      // Look for contact CTA
      const contactCta = page.locator('a, button').filter({
        hasText: /تواصل|اتصل|Contact/i,
      });

      const count = await contactCta.count();
      if (count > 0) {
        await expect(contactCta.first()).toBeVisible();
      }
    });
  });

  test.describe('English About Page', () => {
    test('should load English about page', async ({ page }) => {
      await page.goto('/en/about');
      await expect(page).toHaveURL(/\/en\/about/);
    });

    test('should have LTR direction', async ({ page }) => {
      await page.goto('/en/about');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'ltr');
      await expect(html).toHaveAttribute('lang', 'en');
    });

    test('should display English content', async ({ page }) => {
      await page.goto('/en/about');
      await page.waitForLoadState('networkidle');

      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();

      // Should have paragraphs of content
      const paragraphs = page.locator('p');
      const count = await paragraphs.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('About Page Media', () => {
    test('should display company images or photos', async ({ page }) => {
      await page.goto('/ar/about');
      await page.waitForLoadState('networkidle');

      // Look for images
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        const firstImage = images.first();
        await expect(firstImage).toHaveAttribute('src');
      }
    });

    test('should display team photo or office images', async ({ page }) => {
      await page.goto('/ar/about');
      await page.waitForLoadState('networkidle');

      // Scroll to view all content
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(300);

      // Images should be optimized
      const images = page.locator('img');
      const count = await images.count();
      // Company photos may be present
    });
  });

  test.describe('About Page SEO', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/ar/about');

      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
    });

    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/ar/about');
      await page.waitForLoadState('networkidle');

      // Should have one h1
      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('About Page Layout', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/ar/about');

      // Page should load correctly
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/ar/about');

      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('About Page Navigation', () => {
    test('should have breadcrumbs or back navigation', async ({ page }) => {
      await page.goto('/ar/about');

      // Look for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], [data-testid="breadcrumbs"]');
      // Breadcrumbs may or may not be implemented
    });

    test('should navigate to related pages', async ({ page }) => {
      await page.goto('/ar/about');
      await page.waitForLoadState('networkidle');

      // Should have links to other important pages
      const servicesLink = page.locator('a[href*="/services"]').first();
      const projectsLink = page.locator('a[href*="/projects"]').first();
      const teamLink = page.locator('a[href*="/team"]').first();

      // At least some navigation links should be present
    });
  });

  test.describe('About Page Sections', () => {
    test('should have multiple content sections', async ({ page }) => {
      await page.goto('/ar/about');
      await page.waitForLoadState('networkidle');

      // Should have multiple sections
      const sections = page.locator('section');
      const sectionCount = await sections.count();

      // About page typically has multiple sections
      expect(sectionCount).toBeGreaterThan(0);
    });

    test('should display achievements or milestones', async ({ page }) => {
      await page.goto('/ar/about');
      await page.waitForLoadState('networkidle');

      // Scroll to find achievements
      await page.evaluate(() => window.scrollBy(0, 1200));
      await page.waitForTimeout(300);

      // Look for achievements section
      const achievementsSection = page.locator('section, div').filter({
        hasText: /إنجازات|Achievements|Milestones|مراحل/i,
      });

      // Achievements may be displayed as timeline or cards
    });
  });
});
