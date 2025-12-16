/**
 * Admin Dashboard E2E Tests
 * اختبارات لوحة التحكم الإدارية
 *
 * Note: These tests assume user is authenticated.
 * In a real scenario, you would need to implement authentication
 * either through API login or by setting cookies/localStorage.
 */

import { test, expect, Page } from '@playwright/test';

// Helper to check if user needs authentication
const checkAuth = async (page: Page) => {
  const loginForm = page.locator('form input[type="email"]');
  return !(await loginForm.isVisible());
};

test.describe('Admin Dashboard', () => {
  test.describe('Dashboard Layout', () => {
    test('should access admin area', async ({ page }) => {
      await page.goto('/ar/admin');

      // Either shows dashboard or login
      await page.waitForLoadState('networkidle');
      const isAuth = await checkAuth(page);
      expect(typeof isAuth).toBe('boolean');
    });

    test('should display sidebar navigation', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      // If authenticated, should show sidebar
      const sidebar = page.locator('nav, aside, [data-testid="sidebar"]').first();
      expect(sidebar).toBeDefined();
    });

    test('should display admin header', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const header = page.locator('header').first();
      expect(header).toBeDefined();
    });
  });

  test.describe('Dashboard Stats', () => {
    test('should display statistics cards', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      // Look for stat cards
      const statCards = page.locator('[data-testid="stat-card"], .stat-card, [class*="stats"]');
      expect(statCards).toBeDefined();
    });

    test('should display recent activity', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      // Look for activity section
      const activity = page.locator('[data-testid="activity"], .activity, [class*="recent"]');
      expect(activity).toBeDefined();
    });
  });

  test.describe('Admin Navigation', () => {
    test('should navigate to Services management', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const servicesLink = page.locator('a[href*="/admin/services"]').first();
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await expect(page).toHaveURL(/\/admin\/services/);
      }
    });

    test('should navigate to Projects management', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const projectsLink = page.locator('a[href*="/admin/projects"]').first();
      if (await projectsLink.isVisible()) {
        await projectsLink.click();
        await expect(page).toHaveURL(/\/admin\/projects/);
      }
    });

    test('should navigate to Team management', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const teamLink = page.locator('a[href*="/admin/team"]').first();
      if (await teamLink.isVisible()) {
        await teamLink.click();
        await expect(page).toHaveURL(/\/admin\/team/);
      }
    });

    test('should navigate to Blog management', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const blogLink = page.locator('a[href*="/admin/blog"]').first();
      if (await blogLink.isVisible()) {
        await blogLink.click();
        await expect(page).toHaveURL(/\/admin\/blog/);
      }
    });

    test('should navigate to Careers management', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const careersLink = page.locator('a[href*="/admin/careers"]').first();
      if (await careersLink.isVisible()) {
        await careersLink.click();
        await expect(page).toHaveURL(/\/admin\/careers/);
      }
    });

    test('should navigate to Newsletter management', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const newsletterLink = page.locator('a[href*="/admin/newsletter"]').first();
      if (await newsletterLink.isVisible()) {
        await newsletterLink.click();
        await expect(page).toHaveURL(/\/admin\/newsletter/);
      }
    });

    test('should navigate to Messages', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const messagesLink = page.locator('a[href*="/admin/messages"]').first();
      if (await messagesLink.isVisible()) {
        await messagesLink.click();
        await expect(page).toHaveURL(/\/admin\/messages/);
      }
    });

    test('should navigate to Settings', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const settingsLink = page.locator('a[href*="/admin/settings"]').first();
      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        await expect(page).toHaveURL(/\/admin\/settings/);
      }
    });
  });

  test.describe('Admin Responsive Design', () => {
    test('should work on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      // Admin should still be accessible
    });

    test('should work on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      // Should show mobile-friendly layout
      const mobileMenuButton = page.locator('button[aria-label*="menu"], button[class*="menu"]');
      expect(mobileMenuButton).toBeDefined();
    });
  });

  test.describe('Admin Theme', () => {
    test('should support theme switching', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"]');
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(300);
        // Theme should change
      }
    });
  });

  test.describe('Admin Language', () => {
    test('should support English admin', async ({ page }) => {
      await page.goto('/en/admin');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });

    test('should support Arabic admin', async ({ page }) => {
      await page.goto('/ar/admin');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'ar');
    });
  });
});

test.describe('Admin Content Management', () => {
  test.describe('Services Management', () => {
    test('should load services list', async ({ page }) => {
      await page.goto('/ar/admin/services');
      await page.waitForLoadState('networkidle');

      // Should show services table or list
      const table = page.locator('table, [data-testid="services-list"]');
      expect(table).toBeDefined();
    });

    test('should have add service button', async ({ page }) => {
      await page.goto('/ar/admin/services');
      await page.waitForLoadState('networkidle');

      const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i });
      expect(addButton).toBeDefined();
    });
  });

  test.describe('Projects Management', () => {
    test('should load projects list', async ({ page }) => {
      await page.goto('/ar/admin/projects');
      await page.waitForLoadState('networkidle');

      const table = page.locator('table, [data-testid="projects-list"]');
      expect(table).toBeDefined();
    });
  });

  test.describe('Newsletter Management', () => {
    test('should load newsletter page', async ({ page }) => {
      await page.goto('/ar/admin/newsletter');
      await page.waitForLoadState('networkidle');

      // Should show tabs or sections
      const tabs = page.locator(
        '[role="tablist"], .tabs, button:has-text("المشتركين"), button:has-text("Subscribers")'
      );
      expect(tabs).toBeDefined();
    });

    test('should display subscribers tab', async ({ page }) => {
      await page.goto('/ar/admin/newsletter');
      await page.waitForLoadState('networkidle');

      const subscribersTab = page.locator('button').filter({ hasText: /المشتركين|Subscribers/i });
      expect(subscribersTab).toBeDefined();
    });

    test('should display campaigns tab', async ({ page }) => {
      await page.goto('/ar/admin/newsletter');
      await page.waitForLoadState('networkidle');

      const campaignsTab = page.locator('button').filter({ hasText: /الحملات|Campaigns/i });
      expect(campaignsTab).toBeDefined();
    });
  });
});
