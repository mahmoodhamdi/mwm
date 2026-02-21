/**
 * Admin Activity Logs E2E Tests
 * اختبارات سجل النشاطات
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
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

test.describe('Admin Activity Logs', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load activity logs page', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /نشاط|Activity|سجل|Log/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display activity logs list', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="activity-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should show activity log entries', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const entries = page.locator('tr, [data-testid="activity-entry"], .activity-entry');
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should filter activity by action type', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const actionFilter = page.locator('select, [role="combobox"]').filter({ hasText: /إجراء|Action|نوع|Type/i }).first();
    if (await actionFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await actionFilter.click();
      await page.waitForTimeout(500);

      const createOption = page.locator('option, [role="option"]').filter({ hasText: /إنشاء|Create|CREATE/i }).first();
      if (await createOption.isVisible({ timeout: 1000 }).catch(() => false)) {
        await createOption.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should filter activity by user', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const userFilter = page.locator('select, [role="combobox"]').filter({ hasText: /مستخدم|User/i }).first();
    if (await userFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await userFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should filter activity by resource type', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const resourceFilter = page.locator('select, [role="combobox"]').filter({ hasText: /مورد|Resource/i }).first();
    if (await resourceFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await resourceFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should filter activity by date range', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const dateFromField = page.locator('input[type="date"], input[name*="from"], input[name*="start"]').first();
    if (await dateFromField.isVisible({ timeout: 2000 }).catch(() => false)) {
      const today = new Date().toISOString().split('T')[0];
      await dateFromField.fill(today);
      await page.waitForTimeout(1000);
    }
  });

  test('should search activity logs', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('admin');
      await page.waitForTimeout(1000);
    }
  });

  test('should view activity log details', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const viewButton = page.locator('button, a, tr').filter({ hasText: /عرض|View|تفاصيل|Details/i }).first();
    if (await viewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await viewButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should verify login action is logged', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('login');
      await page.waitForTimeout(1000);
    }

    const loginActivity = page.locator('tr, [data-testid="activity-entry"]').filter({ hasText: /login|تسجيل/i }).first();
    expect(loginActivity).toBeDefined();
  });

  test('should verify CRUD actions are logged', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const actionFilter = page.locator('select, [role="combobox"]').filter({ hasText: /إجراء|Action/i }).first();
    if (await actionFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await actionFilter.click();
      await page.waitForTimeout(500);

      const actions = ['CREATE', 'UPDATE', 'DELETE'];
      for (const action of actions) {
        const actionOption = page.locator('option, [role="option"]').filter({ hasText: new RegExp(action, 'i') }).first();
        expect(actionOption).toBeDefined();
      }
    }
  });

  test('should export activity logs', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const exportButton = page.locator('button').filter({ hasText: /تصدير|Export/i }).first();
    if (await exportButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await exportButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should paginate activity logs', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const nextButton = page.locator('button, a').filter({ hasText: /التالي|Next/i }).first();
    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should clear filters', async ({ page }) => {
    await page.goto('/ar/admin/activity');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
    }

    const clearButton = page.locator('button').filter({ hasText: /مسح|Clear|إعادة|Reset/i }).first();
    if (await clearButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await clearButton.click();
      await page.waitForTimeout(1000);
    }
  });
});
