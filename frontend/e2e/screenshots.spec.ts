/**
 * Comprehensive Screenshot Tests
 * اختبارات شاملة لالتقاط الشاشة لجميع صفحات التطبيق
 *
 * This file captures screenshots for documentation purposes.
 * Screenshots are saved to docs/screenshots/ directory.
 */

import { test, expect } from '@playwright/test';
import {
  VIEWPORTS,
  ensureScreenshotDir,
  takeScreenshot,
  waitForPageReady,
  waitForContent,
  loginToAdmin,
  ADMIN_CREDENTIALS,
} from './utils/screenshot-helper';

// Increase timeout for screenshot tests
test.setTimeout(90000);

// Ensure screenshots directory exists before all tests
test.beforeAll(async () => {
  ensureScreenshotDir();
});

// ============================================
// PUBLIC PAGES - ARABIC (RTL)
// ============================================
test.describe('Public Pages - Arabic', () => {
  test.describe.configure({ mode: 'serial' });

  test('Home Page - Arabic', async ({ page }) => {
    await page.goto('/ar');
    // Wait for hero section or main content
    await waitForContent(page, ['section', '.hero', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'home-ar.png');
  });

  test('About Page - Arabic', async ({ page }) => {
    await page.goto('/ar/about');
    await waitForContent(page, ['section', '.about', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'about-ar.png');
  });

  test('Services Page - Arabic', async ({ page }) => {
    await page.goto('/ar/services');
    await waitForContent(page, ['.service', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'services-ar.png');
  });

  test('Projects Page - Arabic', async ({ page }) => {
    await page.goto('/ar/projects');
    await waitForContent(page, ['.project', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'projects-ar.png');
  });

  test('Team Page - Arabic', async ({ page }) => {
    await page.goto('/ar/team');
    await waitForContent(page, ['.team', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'team-ar.png');
  });

  test('Blog Page - Arabic', async ({ page }) => {
    await page.goto('/ar/blog');
    await waitForContent(page, ['.blog', 'article', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'blog-ar.png');
  });

  test('Careers Page - Arabic', async ({ page }) => {
    await page.goto('/ar/careers');
    await waitForContent(page, ['.job', '.career', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'careers-ar.png');
  });

  test('Contact Page - Arabic', async ({ page }) => {
    await page.goto('/ar/contact');
    await waitForContent(page, ['form', '.contact', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'contact-ar.png');
  });
});

// ============================================
// PUBLIC PAGES - ENGLISH (LTR)
// ============================================
test.describe('Public Pages - English', () => {
  test.describe.configure({ mode: 'serial' });

  test('Home Page - English', async ({ page }) => {
    await page.goto('/en');
    await waitForContent(page, ['section', '.hero', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'home-en.png');
  });

  test('About Page - English', async ({ page }) => {
    await page.goto('/en/about');
    await waitForContent(page, ['section', '.about', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'about-en.png');
  });

  test('Services Page - English', async ({ page }) => {
    await page.goto('/en/services');
    await waitForContent(page, ['.service', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'services-en.png');
  });

  test('Projects Page - English', async ({ page }) => {
    await page.goto('/en/projects');
    await waitForContent(page, ['.project', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'projects-en.png');
  });

  test('Team Page - English', async ({ page }) => {
    await page.goto('/en/team');
    await waitForContent(page, ['.team', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'team-en.png');
  });

  test('Blog Page - English', async ({ page }) => {
    await page.goto('/en/blog');
    await waitForContent(page, ['.blog', 'article', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'blog-en.png');
  });

  test('Careers Page - English', async ({ page }) => {
    await page.goto('/en/careers');
    await waitForContent(page, ['.job', '.career', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'careers-en.png');
  });

  test('Contact Page - English', async ({ page }) => {
    await page.goto('/en/contact');
    await waitForContent(page, ['form', '.contact', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'contact-en.png');
  });
});

// ============================================
// MOBILE SCREENSHOTS
// ============================================
test.describe('Mobile Screenshots', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
  });

  test('Home Mobile - Arabic', async ({ page }) => {
    await page.goto('/ar');
    await waitForContent(page, ['section', '.hero', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'home-mobile-ar.png', { viewport: VIEWPORTS.mobile });
  });

  test('Home Mobile - English', async ({ page }) => {
    await page.goto('/en');
    await waitForContent(page, ['section', '.hero', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'home-mobile-en.png', { viewport: VIEWPORTS.mobile });
  });

  test('Services Mobile', async ({ page }) => {
    await page.goto('/ar/services');
    await waitForContent(page, ['.service', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'services-mobile.png', { viewport: VIEWPORTS.mobile });
  });

  test('Blog Mobile', async ({ page }) => {
    await page.goto('/ar/blog');
    await waitForContent(page, ['.blog', 'article', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'blog-mobile.png', { viewport: VIEWPORTS.mobile });
  });

  test('Contact Mobile', async ({ page }) => {
    await page.goto('/ar/contact');
    await waitForContent(page, ['form', '.contact', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'contact-mobile.png', { viewport: VIEWPORTS.mobile });
  });

  test('Careers Mobile', async ({ page }) => {
    await page.goto('/ar/careers');
    await waitForContent(page, ['.job', '.career', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'careers-mobile.png', { viewport: VIEWPORTS.mobile });
  });
});

// ============================================
// ADMIN PAGES
// Note: Admin pages require valid user credentials in the database.
// These tests capture the login page or redirect state.
// For authenticated screenshots, seed the database with a test user first.
// ============================================
test.describe('Admin Pages', () => {
  test.describe.configure({ mode: 'serial' });

  test('Admin Login Page', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await waitForContent(page, ['form', 'input[type="email"]', 'button[type="submit"]']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-login.png');
  });

  // Authenticated admin tests - require valid user in database
  test('Admin Dashboard', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin');
    await waitForContent(page, ['[class*="stat"]', '[class*="card"]', 'main', 'h1', 'h2']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-dashboard.png');
  });

  test('Admin Services', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/services');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-services.png');
  });

  test('Admin Projects', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/projects');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-projects.png');
  });

  test('Admin Team', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/team');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-team.png');
  });

  test('Admin Blog', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/blog');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-blog.png');
  });

  test('Admin Careers', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/careers');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-careers.png');
  });

  test('Admin Newsletter', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/newsletter');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-newsletter.png');
  });

  test('Admin Messages', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/messages');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-messages.png');
  });

  test('Admin Users', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/users');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-users.png');
  });

  test('Admin Settings', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/settings');
    await waitForContent(page, ['form', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-settings.png');
  });

  test('Admin Content', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/content');
    await waitForContent(page, ['form', 'textarea', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-content.png');
  });

  test('Admin Menus', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/menus');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-menus.png');
  });

  test('Admin Translations', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/translations');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-translations.png');
  });

  test('Admin Activity', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/activity');
    await waitForContent(page, ['table', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-activity.png');
  });

  test('Admin Analytics', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/analytics');
    await waitForContent(page, ['[class*="chart"]', '[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-analytics.png');
  });

  test('Admin Notifications', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin/notifications');
    await waitForContent(page, ['[class*="card"]', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-notifications.png');
  });
});

// ============================================
// UI STATES
// ============================================
test.describe('UI States', () => {
  test('Dark Mode - Home', async ({ page }) => {
    await page.goto('/ar');
    await waitForContent(page, ['section', '.hero', 'main', 'h1']);
    await waitForPageReady(page);

    // Try to find and click dark mode toggle
    const themeToggle = page.locator('button[aria-label*="dark"], button[aria-label*="mode"]').first();

    if ((await themeToggle.count()) > 0) {
      await themeToggle.scrollIntoViewIfNeeded();
      await themeToggle.click({ force: true });
      await page.waitForTimeout(1000);
    }

    await takeScreenshot(page, 'home-dark.png');
  });

  test('404 Page', async ({ page }) => {
    await page.goto('/ar/nonexistent-page-404');
    await waitForPageReady(page);
    await takeScreenshot(page, '404-page.png');
  });

  test('Contact Form Validation', async ({ page }) => {
    await page.goto('/ar/contact');
    await waitForContent(page, ['form', '.contact', 'main', 'h1']);
    await waitForPageReady(page);

    // Try to submit empty form to trigger validation
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }

    await takeScreenshot(page, 'form-validation.png');
  });
});

// ============================================
// TABLET SCREENSHOTS
// ============================================
test.describe('Tablet Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
  });

  test('Home Tablet - Arabic', async ({ page }) => {
    await page.goto('/ar');
    await waitForContent(page, ['section', '.hero', 'main', 'h1']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'home-tablet-ar.png', { viewport: VIEWPORTS.tablet });
  });

  test('Admin Dashboard Tablet', async ({ page }) => {
    const loggedIn = await loginToAdmin(page);
    expect(loggedIn).toBe(true);
    await page.goto('/ar/admin');
    await waitForContent(page, ['[class*="stat"]', '[class*="card"]', 'main', 'h1', 'h2']);
    await waitForPageReady(page);
    await takeScreenshot(page, 'admin-dashboard-tablet.png', { viewport: VIEWPORTS.tablet });
  });
});
