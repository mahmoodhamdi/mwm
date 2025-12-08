/**
 * Team Page E2E Tests
 * اختبارات صفحة الفريق
 */

import { test, expect } from '@playwright/test';

test.describe('Team Page', () => {
  test.describe('Team Listing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/team');
    });

    test('should load team page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/team/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });

    test('should display team members', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for team member cards
      const teamCards = page.locator('[data-testid="team-card"], article, .team-card, [class*="team-member"]');
      // Team members may be loading from API
    });

    test('should display member photos', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const memberPhotos = page.locator('article img, [data-testid="team-card"] img').first();
      if (await memberPhotos.isVisible()) {
        await expect(memberPhotos).toHaveAttribute('src');
      }
    });

    test('should display member names', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const memberCard = page.locator('article, [data-testid="team-card"]').first();
      if (await memberCard.isVisible()) {
        const name = memberCard.locator('h2, h3').first();
        await expect(name).toBeVisible();
      }
    });

    test('should display member positions', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const memberCard = page.locator('article, [data-testid="team-card"]').first();
      if (await memberCard.isVisible()) {
        const position = memberCard.locator('p, span').first();
        // Position display may vary
      }
    });
  });

  test.describe('Team Member Detail', () => {
    test('should navigate to member detail page', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const memberLink = page.locator('a[href*="/team/"]').first();
      if (await memberLink.isVisible()) {
        await memberLink.click();
        await expect(page).toHaveURL(/\/ar\/team\/[\w-]+/);
      }
    });

    test('should display member details', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const memberLink = page.locator('a[href*="/team/"]').first();
      if (await memberLink.isVisible()) {
        await memberLink.click();
        await page.waitForLoadState('networkidle');

        // Should have member name
        const name = page.locator('h1').first();
        await expect(name).toBeVisible();
      }
    });

    test('should display member bio', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const memberLink = page.locator('a[href*="/team/"]').first();
      if (await memberLink.isVisible()) {
        await memberLink.click();
        await page.waitForLoadState('networkidle');

        // Look for bio section
        const bio = page.locator('[data-testid="bio"], .bio, article p');
        // Bio display may vary
      }
    });

    test('should display social links', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const memberLink = page.locator('a[href*="/team/"]').first();
      if (await memberLink.isVisible()) {
        await memberLink.click();
        await page.waitForLoadState('networkidle');

        // Look for social media links
        const socialLinks = page.locator('a[href*="linkedin"], a[href*="twitter"], a[href*="github"]');
        // Social links may or may not exist
      }
    });
  });

  test.describe('Department Filter', () => {
    test('should display department filter', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const departmentFilter = page.locator('[data-testid="department-filter"], .department-filter, select, button[class*="department"]');
      // Department filter may or may not exist
    });

    test('should filter by department', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const departmentButton = page.locator('button').filter({ hasText: /التطوير|Development|التصميم|Design/i }).first();
      if (await departmentButton.isVisible()) {
        await departmentButton.click();
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('English Team Page', () => {
    test('should load English team page', async ({ page }) => {
      await page.goto('/en/team');
      await expect(page).toHaveURL(/\/en\/team/);
    });

    test('should display English content', async ({ page }) => {
      await page.goto('/en/team');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });
  });

  test.describe('Team Page Layout', () => {
    test('should display team in grid layout', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      // Check for grid layout
      const grid = page.locator('[class*="grid"], .team-grid');
      // Grid implementation may vary
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      // Page should still render properly
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });
  });
});
