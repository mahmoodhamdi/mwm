/**
 * Screenshot Tests - Capture all app pages
 * اختبارات لقطات الشاشة - التقاط جميع صفحات التطبيق
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Screenshot output directory
const SCREENSHOTS_DIR = path.join(__dirname, '../../docs/screenshots');

// Ensure screenshots directory exists
test.beforeAll(async () => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
});

test.describe('Public Pages Screenshots - Arabic', () => {
  test.use({ locale: 'ar' });

  test('Home Page - Arabic', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'home-ar.png'),
      fullPage: true,
    });
    // Page loaded successfully
  });

  test('About Page - Arabic', async ({ page }) => {
    await page.goto('/ar/about');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'about-ar.png'),
      fullPage: true,
    });
  });

  test('Services Page - Arabic', async ({ page }) => {
    await page.goto('/ar/services');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'services-ar.png'),
      fullPage: true,
    });
  });

  test('Projects Page - Arabic', async ({ page }) => {
    await page.goto('/ar/projects');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'projects-ar.png'),
      fullPage: true,
    });
  });

  test('Team Page - Arabic', async ({ page }) => {
    await page.goto('/ar/team');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'team-ar.png'),
      fullPage: true,
    });
  });

  test('Blog Page - Arabic', async ({ page }) => {
    await page.goto('/ar/blog');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'blog-ar.png'),
      fullPage: true,
    });
  });

  test('Careers Page - Arabic', async ({ page }) => {
    await page.goto('/ar/careers');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'careers-ar.png'),
      fullPage: true,
    });
  });

  test('Contact Page - Arabic', async ({ page }) => {
    await page.goto('/ar/contact');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'contact-ar.png'),
      fullPage: true,
    });
  });
});

test.describe('Public Pages Screenshots - English', () => {
  test.use({ locale: 'en' });

  test('Home Page - English', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'home-en.png'),
      fullPage: true,
    });
    // Page loaded successfully
  });

  test('About Page - English', async ({ page }) => {
    await page.goto('/en/about');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'about-en.png'),
      fullPage: true,
    });
  });

  test('Services Page - English', async ({ page }) => {
    await page.goto('/en/services');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'services-en.png'),
      fullPage: true,
    });
  });

  test('Projects Page - English', async ({ page }) => {
    await page.goto('/en/projects');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'projects-en.png'),
      fullPage: true,
    });
  });

  test('Team Page - English', async ({ page }) => {
    await page.goto('/en/team');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'team-en.png'),
      fullPage: true,
    });
  });

  test('Blog Page - English', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'blog-en.png'),
      fullPage: true,
    });
  });

  test('Careers Page - English', async ({ page }) => {
    await page.goto('/en/careers');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'careers-en.png'),
      fullPage: true,
    });
  });

  test('Contact Page - English', async ({ page }) => {
    await page.goto('/en/contact');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'contact-en.png'),
      fullPage: true,
    });
  });
});

test.describe('Mobile Screenshots', () => {
  test.use({
    viewport: { width: 375, height: 667 },
  });

  test('Home Page - Mobile Arabic', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'home-mobile-ar.png'),
      fullPage: true,
    });
  });

  test('Home Page - Mobile English', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'home-mobile-en.png'),
      fullPage: true,
    });
  });

  test('Services Page - Mobile', async ({ page }) => {
    await page.goto('/ar/services');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'services-mobile.png'),
      fullPage: true,
    });
  });

  test('Contact Page - Mobile', async ({ page }) => {
    await page.goto('/ar/contact');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'contact-mobile.png'),
      fullPage: true,
    });
  });
});

test.describe('Admin Pages Screenshots', () => {
  test('Admin Login Page', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-login.png'),
      fullPage: true,
    });
  });

  // Note: Admin pages require authentication
  // These tests will capture the login redirect or login page
  test('Admin Dashboard (requires auth)', async ({ page }) => {
    await page.goto('/ar/admin');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-dashboard.png'),
      fullPage: true,
    });
  });

  test('Admin Services (requires auth)', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-services.png'),
      fullPage: true,
    });
  });

  test('Admin Projects (requires auth)', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-projects.png'),
      fullPage: true,
    });
  });

  test('Admin Blog (requires auth)', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-blog.png'),
      fullPage: true,
    });
  });

  test('Admin Careers (requires auth)', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-careers.png'),
      fullPage: true,
    });
  });

  test('Admin Newsletter (requires auth)', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-newsletter.png'),
      fullPage: true,
    });
  });

  test('Admin Settings (requires auth)', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'admin-settings.png'),
      fullPage: true,
    });
  });
});
