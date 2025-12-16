/**
 * Screenshot Helper Utilities
 * أدوات مساعدة لالتقاط الشاشة
 */

import { Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Screenshot output directory
export const SCREENSHOTS_DIR = path.join(__dirname, '../../../docs/screenshots');

// Viewport sizes
export const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

// Admin credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

// Ensure screenshots directory exists
export function ensureScreenshotDir(): void {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
}

// Wait for page to be fully loaded with content
export async function waitForPageReady(page: Page, timeout = 10000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch {
    // Continue if networkidle times out
  }
  // Extra wait for dynamic content
  await page.waitForTimeout(1000);

  // Scroll to trigger lazy loading
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight / 2);
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

// Wait for specific content to appear
export async function waitForContent(page: Page, selectors: string[]): Promise<void> {
  for (const selector of selectors) {
    try {
      await page.waitForSelector(selector, { timeout: 5000, state: 'visible' });
      return;
    } catch {
      // Try next selector
    }
  }
}

// Take a full page screenshot
export async function takeScreenshot(
  page: Page,
  filename: string,
  options: { fullPage?: boolean; viewport?: { width: number; height: number } } = {}
): Promise<void> {
  ensureScreenshotDir();

  if (options.viewport) {
    await page.setViewportSize(options.viewport);
    await page.waitForTimeout(500);
  }

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, filename),
    fullPage: options.fullPage !== false,
  });
}

// Login to admin panel
export async function loginToAdmin(page: Page): Promise<boolean> {
  try {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Check if already logged in (redirected to dashboard)
    if (page.url().includes('/admin') && !page.url().includes('/login')) {
      return true;
    }

    // Fill login form
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    if (await emailInput.isVisible()) {
      await emailInput.fill(ADMIN_CREDENTIALS.email);
      await passwordInput.fill(ADMIN_CREDENTIALS.password);
      await submitButton.click();

      // Wait for redirect
      await page.waitForTimeout(3000);
      return !page.url().includes('/login');
    }

    return false;
  } catch {
    return false;
  }
}

// Save auth state for reuse
export async function saveAuthState(context: BrowserContext, statePath: string): Promise<void> {
  await context.storageState({ path: statePath });
}
