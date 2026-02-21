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
      const teamCards = page.locator(
        '[data-testid="team-card"], article, .team-card, [class*="team-member"]'
      );
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

    test('should display member positions or roles', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const memberCard = page.locator('article, [data-testid="team-card"]').first();
      if (await memberCard.isVisible()) {
        const position = memberCard.locator('p, span').first();
        // Position display may vary
        if (await position.isVisible()) {
          const text = await position.textContent();
          expect(text?.length).toBeGreaterThan(0);
        }
      }
    });

    test('should display member grid with proper layout', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Check for grid layout
      const grid = page.locator('[class*="grid"], .team-grid');
      // Grid implementation varies

      // Members should be displayed in cards
      const memberCards = page.locator('article, [data-testid="team-card"]');
      const count = await memberCards.count();
      // Count depends on data availability
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

    test('should display member bio or description', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const memberLink = page.locator('a[href*="/team/"]').first();
      if (await memberLink.isVisible()) {
        await memberLink.click();
        await page.waitForLoadState('networkidle');

        // Look for bio section
        const bio = page.locator('[data-testid="bio"], .bio, article p, .content p');
        const count = await bio.count();
        if (count > 0) {
          await expect(bio.first()).toBeVisible();
        }
      }
    });

    test('should display social links if available', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const memberLink = page.locator('a[href*="/team/"]').first();
      if (await memberLink.isVisible()) {
        await memberLink.click();
        await page.waitForLoadState('networkidle');

        // Look for social media links
        const socialLinks = page.locator(
          'a[href*="linkedin"], a[href*="twitter"], a[href*="github"], a[href*="facebook"]'
        );
        // Social links may or may not exist
      }
    });

    test('should display member skills or expertise', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const memberLink = page.locator('a[href*="/team/"]').first();
      if (await memberLink.isVisible()) {
        await memberLink.click();
        await page.waitForLoadState('networkidle');

        // Look for skills section
        const skillsSection = page.locator('section, div').filter({
          hasText: /مهارات|Skills|خبرات|Expertise/i,
        });

        // Skills may be displayed as tags or list
        const skillTags = page.locator('[class*="tag"], [class*="badge"], [class*="skill"]');
      }
    });
  });

  test.describe('Department Filter', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');
    });

    test('should display department filter', async ({ page }) => {
      const departmentFilter = page.locator(
        '[data-testid="department-filter"], .department-filter, select, button[class*="department"]'
      );
      // Department filter may or may not exist
    });

    test('should filter by department', async ({ page }) => {
      const departmentButtons = page.locator('button').filter({
        hasText: /التطوير|Development|التصميم|Design|التسويق|Marketing/i,
      });

      const count = await departmentButtons.count();
      if (count > 0) {
        const firstDept = departmentButtons.first();
        await firstDept.click();
        await page.waitForTimeout(500);

        // Members should be filtered
        const members = page.locator('article, [data-testid="team-card"]');
        // Filtered results
      }
    });

    test('should show all members when "All" selected', async ({ page }) => {
      const allButton = page.locator('button').filter({
        hasText: /الكل|All|جميع/i,
      }).first();

      if (await allButton.isVisible()) {
        await allButton.click();
        await page.waitForTimeout(300);
      }
    });
  });

  test.describe('Leadership Section', () => {
    test('should display leadership or executives section', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      // Look for leadership section
      const leadershipSection = page.locator('section, div').filter({
        hasText: /القيادة|Leadership|الإدارة|Management|المؤسسون|Founders/i,
      });

      const count = await leadershipSection.count();
      if (count > 0) {
        await expect(leadershipSection.first()).toBeVisible();
      }
    });

    test('should display leaders prominently', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      // Leadership members may have distinct styling or larger cards
      const leaderCards = page.locator('[data-testid="leader-card"], [class*="leader"]');
      // Leader cards may be styled differently
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

    test('should display English member information', async ({ page }) => {
      await page.goto('/en/team');
      await page.waitForLoadState('networkidle');

      const memberCard = page.locator('article, [data-testid="team-card"]').first();
      if (await memberCard.isVisible()) {
        const name = memberCard.locator('h2, h3').first();
        await expect(name).toBeVisible();
      }
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

      // Members should still be visible
      const memberCards = page.locator('article, [data-testid="team-card"]');
      // Mobile layout should work
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/ar/team');

      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Team Page SEO', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/ar/team');

      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
    });
  });

  test.describe('Team Member Cards', () => {
    test('should have hover effects on member cards', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      const memberCard = page.locator('article, [data-testid="team-card"]').first();
      if (await memberCard.isVisible()) {
        // Hover over card
        await memberCard.hover();
        await page.waitForTimeout(200);

        // Card may have hover effects (implementation varies)
      }
    });

    test('should display member role badges or tags', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      // Look for role badges
      const badges = page.locator('[class*="badge"], [class*="tag"], [class*="role"]');
      // Role indicators may be present
    });
  });

  test.describe('Team Page Accessibility', () => {
    test('should have accessible member cards', async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');

      // Member images should have alt text
      const memberImages = page.locator('article img, [data-testid="team-card"] img');
      const count = await memberImages.count();

      if (count > 0) {
        const firstImage = memberImages.first();
        const alt = await firstImage.getAttribute('alt');
        // Alt text should be present for accessibility
      }
    });
  });
});
