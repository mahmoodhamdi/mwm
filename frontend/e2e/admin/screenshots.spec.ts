/**
 * Admin Screenshots E2E Tests
 * اختبارات التقاط صور لوحة التحكم
 *
 * Captures screenshots for all 17 admin pages
 * in 3 viewports (desktop, tablet, mobile) and 2 themes (light, dark)
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SCREENSHOTS_DIR = path.join(__dirname, '../../../docs/screenshots/admin');
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

const ADMIN_PAGES = [
  { path: '/ar/admin', name: 'dashboard', title: 'Dashboard' },
  { path: '/ar/admin/users', name: 'users', title: 'Users Management' },
  { path: '/ar/admin/services', name: 'services', title: 'Services' },
  { path: '/ar/admin/projects', name: 'projects', title: 'Projects' },
  { path: '/ar/admin/team', name: 'team', title: 'Team Members' },
  { path: '/ar/admin/blog', name: 'blog', title: 'Blog Posts' },
  { path: '/ar/admin/blog/categories', name: 'blog-categories', title: 'Blog Categories' },
  { path: '/ar/admin/careers', name: 'careers', title: 'Job Listings' },
  { path: '/ar/admin/careers/applications', name: 'applications', title: 'Job Applications' },
  { path: '/ar/admin/messages', name: 'messages', title: 'Contact Messages' },
  { path: '/ar/admin/newsletter', name: 'newsletter', title: 'Newsletter' },
  { path: '/ar/admin/settings', name: 'settings', title: 'Settings' },
  { path: '/ar/admin/content', name: 'content', title: 'Content Management' },
  { path: '/ar/admin/menus', name: 'menus', title: 'Menu Management' },
  { path: '/ar/admin/translations', name: 'translations', title: 'Translations' },
  { path: '/ar/admin/activity', name: 'activity', title: 'Activity Logs' },
  { path: '/ar/admin/analytics', name: 'analytics', title: 'Analytics' },
];

// Ensure screenshots directory exists
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Wait for page to be ready
async function waitForPageReady(page: Page): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  } catch {
    // Continue if timeout
  }
  await page.waitForTimeout(1500);
}

// Login to admin panel
async function loginToAdmin(page: Page): Promise<boolean> {
  try {
    // Try direct API login
    const response = await page.request.post(`${API_URL}/auth/login`, {
      data: {
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok()) {
      const data = await response.json();
      if (data.success && data.data?.accessToken) {
        // Store token in localStorage
        await page.goto('/ar/admin/login');
        await page.waitForLoadState('domcontentloaded');

        await page.evaluate((token) => {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('mwm_auth_state', 'true');
        }, data.data.accessToken);

        // Set cookies if present
        const cookies = response.headers()['set-cookie'];
        if (cookies) {
          const cookieStrings = Array.isArray(cookies) ? cookies : [cookies];
          for (const cookieStr of cookieStrings) {
            const parts = cookieStr.split(';')[0].split('=');
            if (parts.length >= 2) {
              await page.context().addCookies([
                {
                  name: parts[0].trim(),
                  value: parts.slice(1).join('=').trim(),
                  domain: 'localhost',
                  path: '/',
                },
              ]);
            }
          }
        }

        await page.goto('/ar/admin');
        await page.waitForTimeout(2000);
        return !page.url().includes('/login');
      }
    }

    // Fallback: UI login
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[name="email"], input[type="email"]', ADMIN_CREDENTIALS.email);
    await page.fill('input[name="password"], input[type="password"]', ADMIN_CREDENTIALS.password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(3000);
    return !page.url().includes('/login');
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

// Set theme
async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.evaluate((t) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(t);
    localStorage.setItem('theme', t);
  }, theme);
  await page.waitForTimeout(500);
}

// Take screenshot
async function takeScreenshot(
  page: Page,
  name: string,
  viewport: keyof typeof VIEWPORTS,
  theme: 'light' | 'dark'
): Promise<void> {
  ensureDir(SCREENSHOTS_DIR);

  await page.setViewportSize(VIEWPORTS[viewport]);
  await setTheme(page, theme);
  await page.waitForTimeout(500);

  const filename = `${name}-${viewport}-${theme}.png`;
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, filename),
    fullPage: true,
  });
}

// ============================================
// ADMIN SCREENSHOTS TEST SUITE
// ============================================

test.describe('Admin Panel Screenshots', () => {
  test.setTimeout(300000); // 5 minutes for all screenshots

  test.beforeAll(async () => {
    ensureDir(SCREENSHOTS_DIR);
  });

  test('Capture all admin pages screenshots', async ({ page }) => {
    // Login first
    const loggedIn = await loginToAdmin(page);

    if (!loggedIn) {
      // Still capture login page
      await page.goto('/ar/admin/login');
      await waitForPageReady(page);

      for (const viewport of Object.keys(VIEWPORTS) as Array<keyof typeof VIEWPORTS>) {
        for (const theme of ['light', 'dark'] as const) {
          await takeScreenshot(page, 'login', viewport, theme);
        }
      }

      console.log('Login failed - captured login page only');
      return;
    }

    // Capture all admin pages
    let capturedCount = 0;

    for (const adminPage of ADMIN_PAGES) {
      console.log(`Capturing: ${adminPage.title} (${adminPage.path})`);

      try {
        await page.goto(adminPage.path);
        await waitForPageReady(page);

        // Skip if redirected to login
        if (page.url().includes('/login')) {
          console.log(`  Skipped (requires re-auth): ${adminPage.name}`);
          continue;
        }

        for (const viewport of Object.keys(VIEWPORTS) as Array<keyof typeof VIEWPORTS>) {
          for (const theme of ['light', 'dark'] as const) {
            await takeScreenshot(page, adminPage.name, viewport, theme);
            capturedCount++;
          }
        }

        console.log(`  ✓ Captured ${adminPage.name} (6 variants)`);
      } catch (error) {
        console.error(`  ✗ Failed to capture ${adminPage.name}:`, error);
      }
    }

    console.log(`\n✅ Total screenshots captured: ${capturedCount}`);
    expect(capturedCount).toBeGreaterThan(0);
  });
});

// ============================================
// INDIVIDUAL PAGE TESTS (for parallel execution)
// ============================================

test.describe('Admin Pages - Desktop Light', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
  });

  for (const adminPage of ADMIN_PAGES) {
    test(`${adminPage.title}`, async ({ page }) => {
      await page.goto(adminPage.path);
      await waitForPageReady(page);

      if (!page.url().includes('/login')) {
        await takeScreenshot(page, adminPage.name, 'desktop', 'light');
      }
    });
  }
});
