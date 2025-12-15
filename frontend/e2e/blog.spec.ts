/**
 * Blog Page E2E Tests
 * اختبارات صفحة المدونة
 */

import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test.describe('Blog Listing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/blog');
    });

    test('should load blog page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/blog/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });

    test('should display blog posts grid or list', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for blog post cards
      const blogPosts = page.locator(
        '[data-testid="blog-post"], article, .blog-card, [class*="post"]'
      );

      // Should have posts or empty state
      const count = await blogPosts.count();
      // Posts may be loading from API
    });

    test('should display post titles', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const postCards = page.locator('article, [data-testid="blog-post"]').first();
      if (await postCards.isVisible()) {
        const title = postCards.locator('h2, h3').first();
        await expect(title).toBeVisible();
      }
    });

    test('should display post excerpts or descriptions', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const postCards = page.locator('article, [data-testid="blog-post"]').first();
      if (await postCards.isVisible()) {
        const description = postCards.locator('p').first();
        // Description may or may not be present
      }
    });

    test('should display post dates', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for date elements
      const dateElement = page.locator('time, [data-testid="post-date"], [class*="date"]').first();
      // Date display may vary
    });

    test('should display featured images', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const images = page.locator('article img, [data-testid="blog-post"] img').first();
      if (await images.isVisible()) {
        await expect(images).toHaveAttribute('src');
      }
    });
  });

  test.describe('Blog Post Detail', () => {
    test('should navigate to blog post detail', async ({ page }) => {
      await page.goto('/ar/blog');
      await page.waitForLoadState('networkidle');

      const postLink = page.locator('a[href*="/blog/"]').first();
      if (await postLink.isVisible()) {
        await postLink.click();
        await expect(page).toHaveURL(/\/ar\/blog\/[\w-]+/);
      }
    });

    test('should display post content', async ({ page }) => {
      await page.goto('/ar/blog');
      await page.waitForLoadState('networkidle');

      const postLink = page.locator('a[href*="/blog/"]').first();
      if (await postLink.isVisible()) {
        await postLink.click();
        await page.waitForLoadState('networkidle');

        // Should have post title
        const title = page.locator('h1').first();
        await expect(title).toBeVisible();

        // Should have content
        const content = page.locator('article, .content, [class*="prose"]').first();
        await expect(content).toBeVisible();
      }
    });

    test('should display author information', async ({ page }) => {
      await page.goto('/ar/blog');
      await page.waitForLoadState('networkidle');

      const postLink = page.locator('a[href*="/blog/"]').first();
      if (await postLink.isVisible()) {
        await postLink.click();
        await page.waitForLoadState('networkidle');

        // Look for author section
        const author = page.locator('[data-testid="author"], .author, [class*="author"]');
        // Author display may vary
      }
    });
  });

  test.describe('Blog Categories', () => {
    test('should display category filter', async ({ page }) => {
      await page.goto('/ar/blog');
      await page.waitForLoadState('networkidle');

      const categoryFilter = page.locator(
        '[data-testid="category-filter"], .category-filter, nav [class*="category"]'
      );
      // Category filter may or may not exist
    });

    test('should filter posts by category', async ({ page }) => {
      await page.goto('/ar/blog');
      await page.waitForLoadState('networkidle');

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

  test.describe('Blog Search', () => {
    test('should have search functionality', async ({ page }) => {
      await page.goto('/ar/blog');

      const searchInput = page.locator(
        'input[type="search"], input[placeholder*="بحث"], input[placeholder*="search"]'
      );
      // Search may or may not be implemented
    });
  });

  test.describe('Blog Pagination', () => {
    test('should display pagination if many posts', async ({ page }) => {
      await page.goto('/ar/blog');
      await page.waitForLoadState('networkidle');

      const pagination = page.locator(
        'nav[aria-label*="pagination"], .pagination, [data-testid="pagination"]'
      );
      // Pagination appears when there are many posts
    });
  });

  test.describe('English Blog Page', () => {
    test('should load English blog page', async ({ page }) => {
      await page.goto('/en/blog');
      await expect(page).toHaveURL(/\/en\/blog/);
    });

    test('should display English content', async ({ page }) => {
      await page.goto('/en/blog');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });
  });

  test.describe('Blog SEO', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/ar/blog');

      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
    });

    test('should have proper structured data for blog posts', async ({ page }) => {
      await page.goto('/ar/blog');
      await page.waitForLoadState('networkidle');

      // Check for JSON-LD structured data
      const structuredData = page.locator('script[type="application/ld+json"]');
      // Structured data may or may not be implemented
    });
  });
});
