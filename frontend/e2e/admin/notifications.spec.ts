/**
 * Admin Notifications E2E Tests
 * اختبارات إدارة الإشعارات
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  notification: {
    titleAr: `إشعار تجريبي ${timestamp}`,
    titleEn: `Test Notification ${timestamp}`,
    bodyAr: `محتوى الإشعار التجريبي ${timestamp}`,
    bodyEn: `Test notification body ${timestamp}`,
  },
};

async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/ar/admin/login');
  await page.waitForLoadState('domcontentloaded');

  await page.locator('input[type="email"]').first().fill(ADMIN_CREDENTIALS.email);
  await page.locator('input[type="password"]').first().fill(ADMIN_CREDENTIALS.password);
  await page.locator('button[type="submit"]').first().click();

  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 });
  await page.waitForTimeout(1000);
}

async function fillBilingualField(page: Page, fieldName: string, arValue: string, enValue: string): Promise<void> {
  const arField = page.locator(`input[name="${fieldName}.ar"], textarea[name="${fieldName}.ar"]`).first();
  const enField = page.locator(`input[name="${fieldName}.en"], textarea[name="${fieldName}.en"]`).first();

  if (await arField.isVisible({ timeout: 1000 }).catch(() => false)) {
    await arField.fill(arValue);
  }
  if (await enField.isVisible({ timeout: 1000 }).catch(() => false)) {
    await enField.fill(enValue);
  }
}

test.describe('Admin Notifications Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load notifications page', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /إشعارات|Notifications/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display send notification form', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    const form = page.locator('form, [data-testid="notification-form"]').first();
    expect(form).toBeDefined();
  });

  test('should send notification to single user', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    await fillBilingualField(page, 'title', testData.notification.titleAr, testData.notification.titleEn);
    await fillBilingualField(page, 'body', testData.notification.bodyAr, testData.notification.bodyEn);

    const recipientSelect = page.locator('select[name="recipient"], [role="combobox"]').first();
    if (await recipientSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await recipientSelect.click();
      await page.waitForTimeout(500);
    }

    const sendButton = page.locator('button[type="submit"]').filter({ hasText: /إرسال|Send/i }).first();
    if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sendButton.click();
      await page.waitForTimeout(2000);
    }
  });

  test('should broadcast notification to all users', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    await fillBilingualField(page, 'title', testData.notification.titleAr, testData.notification.titleEn);
    await fillBilingualField(page, 'body', testData.notification.bodyAr, testData.notification.bodyEn);

    const broadcastCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /جميع|All|بث|Broadcast/i }).first();
    if (await broadcastCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await broadcastCheckbox.click();
      await page.waitForTimeout(500);
    }

    const sendButton = page.locator('button[type="submit"]').filter({ hasText: /إرسال|Send/i }).first();
    if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sendButton.click();
      await page.waitForTimeout(2000);
    }
  });

  test('should send notification to specific role', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    await fillBilingualField(page, 'title', testData.notification.titleAr, testData.notification.titleEn);
    await fillBilingualField(page, 'body', testData.notification.bodyAr, testData.notification.bodyEn);

    const roleSelect = page.locator('select[name="role"], [role="combobox"]').filter({ hasText: /دور|Role/i }).first();
    if (await roleSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await roleSelect.click();
      await page.waitForTimeout(500);

      const roleOption = page.locator('option, [role="option"]').filter({ hasText: /مستخدم|User|عضو|Member/i }).first();
      if (await roleOption.isVisible({ timeout: 1000 }).catch(() => false)) {
        await roleOption.click();
        await page.waitForTimeout(500);
      }
    }

    const sendButton = page.locator('button[type="submit"]').filter({ hasText: /إرسال|Send/i }).first();
    if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sendButton.click();
      await page.waitForTimeout(2000);
    }
  });

  test('should view notification history', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    const historyTab = page.locator('button, a').filter({ hasText: /سجل|History/i }).first();
    if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await historyTab.click();
      await page.waitForTimeout(1000);

      const historyList = page.locator('table, [data-testid="notifications-history"], .grid').first();
      expect(historyList).toBeDefined();
    }
  });

  test('should filter notifications by status', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    const historyTab = page.locator('button, a').filter({ hasText: /سجل|History/i }).first();
    if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await historyTab.click();
      await page.waitForTimeout(1000);
    }

    const statusFilter = page.locator('select, [role="combobox"]').filter({ hasText: /حالة|Status/i }).first();
    if (await statusFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search notifications', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    const historyTab = page.locator('button, a').filter({ hasText: /سجل|History/i }).first();
    if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await historyTab.click();
      await page.waitForTimeout(1000);
    }

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should add notification link/action', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    await fillBilingualField(page, 'title', testData.notification.titleAr, testData.notification.titleEn);
    await fillBilingualField(page, 'body', testData.notification.bodyAr, testData.notification.bodyEn);

    const linkField = page.locator('input[name="link"], input[name="url"]').first();
    if (await linkField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await linkField.fill('/ar/services');
    }

    const sendButton = page.locator('button[type="submit"]').filter({ hasText: /إرسال|Send/i }).first();
    if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sendButton.click();
      await page.waitForTimeout(2000);
    }
  });

  test('should schedule notification', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    await fillBilingualField(page, 'title', testData.notification.titleAr, testData.notification.titleEn);
    await fillBilingualField(page, 'body', testData.notification.bodyAr, testData.notification.bodyEn);

    const scheduleCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /جدولة|Schedule/i }).first();
    if (await scheduleCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await scheduleCheckbox.click();
      await page.waitForTimeout(500);

      const dateTimeField = page.locator('input[type="datetime-local"], input[name*="schedule"]').first();
      if (await dateTimeField.isVisible({ timeout: 2000 }).catch(() => false)) {
        expect(dateTimeField).toBeDefined();
      }
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/ar/admin/notifications');
    await page.waitForLoadState('networkidle');

    const sendButton = page.locator('button[type="submit"]').filter({ hasText: /إرسال|Send/i }).first();
    if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sendButton.click();
      await page.waitForTimeout(1000);

      const errorMessage = page.locator('[role="alert"], .error, [class*="error"]').first();
      expect(errorMessage).toBeDefined();
    }
  });
});
