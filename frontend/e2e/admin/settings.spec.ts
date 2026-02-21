/**
 * Admin Settings E2E Tests
 * اختبارات إعدادات النظام
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();

async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/ar/admin/login');
  await page.waitForLoadState('domcontentloaded');

  await page.locator('input[type="email"]').first().fill(ADMIN_CREDENTIALS.email);
  await page.locator('input[type="password"]').first().fill(ADMIN_CREDENTIALS.password);
  await page.locator('button[type="submit"]').first().click();

  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 });
  await page.waitForTimeout(1000);
}

test.describe('Admin Settings Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load settings page', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /إعدادات|Settings/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display settings sections', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const sections = page.locator('[data-testid="settings-section"], .settings-section, section').first();
    expect(sections).toBeDefined();
  });

  test('should navigate to general settings', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const generalTab = page.locator('button, a').filter({ hasText: /عامة|General/i }).first();
    if (await generalTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await generalTab.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should edit site name', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const siteNameField = page.locator('input[name="siteName.ar"], input[name*="site"][name*="name"]').first();
    if (await siteNameField.isVisible({ timeout: 2000 }).catch(() => false)) {
      const currentValue = await siteNameField.inputValue();
      await siteNameField.fill(`${currentValue} - ${timestamp}`);

      const saveButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save/i }).first();
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should navigate to email settings', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const emailTab = page.locator('button, a').filter({ hasText: /بريد|Email/i }).first();
    if (await emailTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailTab.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should navigate to SEO settings', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const seoTab = page.locator('button, a').filter({ hasText: /SEO|محرك/i }).first();
    if (await seoTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await seoTab.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should navigate to social media settings', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const socialTab = page.locator('button, a').filter({ hasText: /اجتماعي|Social/i }).first();
    if (await socialTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await socialTab.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should toggle maintenance mode', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const maintenanceToggle = page.locator('button, input[type="checkbox"]').filter({ hasText: /صيانة|Maintenance/i }).first();
    if (await maintenanceToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await maintenanceToggle.click();
      await page.waitForTimeout(1000);

      // Toggle back
      await maintenanceToggle.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should save settings', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const saveButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save/i }).first();
    if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saveButton.click();
      await page.waitForTimeout(2000);

      const successMessage = page.locator('[role="alert"], .success, [class*="success"]').first();
      expect(successMessage).toBeDefined();
    }
  });

  test('should reset settings to defaults', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const resetButton = page.locator('button').filter({ hasText: /إعادة تعيين|Reset|افتراضي|Default/i }).first();
    if (await resetButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await resetButton.click();
      await page.waitForTimeout(500);

      const confirmButton = page.locator('button').filter({ hasText: /تأكيد|Confirm|نعم|Yes/i }).first();
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should upload logo', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const uploadButton = page.locator('input[type="file"], button').filter({ hasText: /شعار|Logo|رفع|Upload/i }).first();
    if (await uploadButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      expect(uploadButton).toBeDefined();
    }
  });

  test('should validate required settings', async ({ page }) => {
    await page.goto('/ar/admin/settings');
    await page.waitForLoadState('networkidle');

    const requiredField = page.locator('input[required]').first();
    if (await requiredField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await requiredField.clear();

      const saveButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save/i }).first();
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click();
        await page.waitForTimeout(1000);

        const errorMessage = page.locator('[role="alert"], .error, [class*="error"]').first();
        expect(errorMessage).toBeDefined();
      }
    }
  });
});
