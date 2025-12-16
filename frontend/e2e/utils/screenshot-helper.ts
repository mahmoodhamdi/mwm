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

// Login to admin panel using direct API call
export async function loginToAdmin(page: Page): Promise<boolean> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    // Make direct API request to login
    const response = await page.request.post(`${API_URL}/auth/login`, {
      data: {
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok()) {
      console.error('Login API failed:', response.status(), await response.text());
      return false;
    }

    const responseData = await response.json();

    if (!responseData.success || !responseData.data?.accessToken) {
      console.error('Login response invalid:', responseData);
      return false;
    }

    // Get cookies from response and set them in browser context
    const cookies = response.headers()['set-cookie'];
    if (cookies) {
      // Parse and set cookies from response
      const cookieStrings = Array.isArray(cookies) ? cookies : [cookies];
      for (const cookieStr of cookieStrings) {
        const parts = cookieStr.split(';')[0].split('=');
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const value = parts.slice(1).join('=').trim();
          await page.context().addCookies([
            {
              name,
              value,
              domain: 'localhost',
              path: '/',
            },
          ]);
        }
      }
    }

    // Also store auth state in localStorage for frontend
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('domcontentloaded');

    // Set localStorage to indicate authenticated state
    await page.evaluate(() => {
      localStorage.setItem('mwm_auth_state', 'true');
    });

    // Navigate to admin dashboard
    await page.goto('/ar/admin');
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => null);
    await page.waitForTimeout(2000);

    // Check if we're on admin dashboard (not redirected to login)
    const currentUrl = page.url();
    return currentUrl.includes('/admin') && !currentUrl.includes('/login');
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

// Save auth state for reuse
export async function saveAuthState(context: BrowserContext, statePath: string): Promise<void> {
  await context.storageState({ path: statePath });
}
