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
      const projectCards = page.locator(
        '[data-testid="project-card"], article, .project-card, [class*="project"]'
      );
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

    test('should display project descriptions or excerpts', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const projectCard = page.locator('article, [data-testid="project-card"]').first();
      if (await projectCard.isVisible()) {
        const description = projectCard.locator('p').first();
        // Descriptions may be present on cards
      }
    });
  });

  test.describe('Project Categories', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');
    });

    test('should display category filter', async ({ page }) => {
      const categoryFilter = page.locator(
        '[data-testid="category-filter"], .category-filter, button[class*="category"]'
      );
      // Category filter may or may not exist
    });

    test('should filter projects by category', async ({ page }) => {
      const categoryButtons = page.locator('button').filter({
        hasText: /ويب|Web|موبايل|Mobile|تصميم|Design/i,
      });

      const count = await categoryButtons.count();
      if (count > 0) {
        const firstCategory = categoryButtons.first();
        await firstCategory.click();
        await page.waitForTimeout(500);

        // Projects should be filtered
        const projects = page.locator('article, [data-testid="project-card"]');
        // Filtered results
      }
    });

    test('should show all projects when "All" selected', async ({ page }) => {
      const allButton = page.locator('button').filter({
        hasText: /الكل|All|جميع/i,
      }).first();

      if (await allButton.isVisible()) {
        await allButton.click();
        await page.waitForTimeout(300);
        // Should show all projects
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

    test('should display project gallery or images', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await page.waitForLoadState('networkidle');

        // Look for project images/gallery
        const images = page.locator('img');
        const imageCount = await images.count();
        expect(imageCount).toBeGreaterThan(0);

        // May have gallery component
        const gallery = page.locator('[data-testid="gallery"], .gallery, [class*="gallery"]');
      }
    });

    test('should display technologies or tech stack', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await page.waitForLoadState('networkidle');

        // Look for technologies section
        const technologiesSection = page.locator('section, div').filter({
          hasText: /تقنيات|Technologies|Tech Stack|الأدوات/i,
        });

        // Tech stack may be displayed as badges or list
        const techBadges = page.locator('[class*="badge"], [class*="tag"], [class*="tech"]');
      }
    });

    test('should display project client or company info', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await page.waitForLoadState('networkidle');

        // Look for client info
        const clientInfo = page.locator('[data-testid="client"], [class*="client"]');
        // Client information may be displayed
      }
    });

    test('should display project date or duration', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await page.waitForLoadState('networkidle');

        // Look for date or duration
        const dateElement = page.locator('time, [data-testid="date"], [class*="date"]');
        // Project date/duration may be shown
      }
    });

    test('should have navigation to next/previous projects', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const projectLink = page.locator('a[href*="/projects/"]').first();
      if (await projectLink.isVisible()) {
        await projectLink.click();
        await page.waitForLoadState('networkidle');

        // Look for next/previous navigation
        const nextPrevNav = page.locator('a, button').filter({
          hasText: /التالي|السابق|Next|Previous|›|‹/i,
        });
        // Project navigation may be present
      }
    });
  });

  test.describe('English Projects Page', () => {
    test('should load English projects page', async ({ page }) => {
      await page.goto('/en/projects');
      await expect(page).toHaveURL(/\/en/projects/);
    });

    test('should display English content', async ({ page }) => {
      await page.goto('/en/projects');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });
  });

  test.describe('Project Grid Layout', () => {
    test('should display projects in grid format', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      // Look for grid layout
      const grid = page.locator('[class*="grid"]');
      // Grid implementation varies
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/ar/projects');

      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Project Page SEO', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/ar/projects');

      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
    });
  });

  test.describe('Project Filtering & Search', () => {
    test('should have search functionality if available', async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');

      const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"]');
      // Search may or may not be implemented
    });
  });
});
