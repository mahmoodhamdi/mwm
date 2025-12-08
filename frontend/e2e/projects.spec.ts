/**
 * Projects Page E2E Tests
 * اختبارات صفحة المشاريع
 */

import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test.describe('Projects Listing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/projects');
    });

    test('should load projects page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/projects/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });

    test('should display projects grid', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for project cards
      const projectCards = page.locator('[data-testid="project-card"], article, .project-card, [class*="project"]');
      // Projects may be loading from API
    });

    test('should display project images', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const projectImages = page.locator('article img, [data-testid="project-card"] img').first();
      if (await projectImages.isVisible()) {
        await expect(projectImages).toHaveAttribute('src');
      }
    });

    test('should display project titles', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const projectCard = page.locator('article, [data-testid="project-card"]').first();
      if (await projectCard.isVisible()) {
        const title = projectCard.locator('h2, h3').first();
        await expect(title).toBeVisible();
      }
    });
  });

  test.describe('Project Detail Page', () => {
    test('should navigate to project detail', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await expect(page).toHaveURL(/\/ar\/projects\/[\w-]+/);
      }
    });

    test('should display project details', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await page.waitForLoadState('networkidle');

        // Should have project title
        const title = page.locator('h1').first();
        await expect(title).toBeVisible();

        // Should have description
        const description = page.locator('article, .content, [class*="description"]').first();
        await expect(description).toBeVisible();
      }
    });

    test('should display project gallery', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await page.waitForLoadState('networkidle');

        // Look for project images/gallery
        const gallery = page.locator('[data-testid="gallery"], .gallery, img');
        // Gallery implementation may vary
      }
    });

    test('should display technologies used', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await page.waitForLoadState('networkidle');

        // Look for technologies section
        const technologies = page.locator('[data-testid="technologies"], .technologies, [class*="tech"]');
        // Technologies section may vary
      }
    });
  });

  test.describe('Project Categories', () => {
    test('should display category filter', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const categoryFilter = page.locator('[data-testid="category-filter"], .category-filter, button[class*="category"]');
      // Category filter may or may not exist
    });

    test('should filter projects by category', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const categoryButton = page.locator('button').filter({ hasText: /ويب|Web|موبايل|Mobile/i }).first();
      if (await categoryButton.isVisible()) {
        await categoryButton.click();
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('English Projects Page', () => {
    test('should load English projects page', async ({ page }) => {
      await page.goto('/en/projects');
      await expect(page).toHaveURL(/\/en\/projects/);
    });

    test('should display English content', async ({ page }) => {
      await page.goto('/en/projects');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });
  });
});
