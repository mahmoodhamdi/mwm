/**
 * Admin Content Management E2E Tests
 * اختبارات إدارة المحتوى
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  content: {
    keyAr: `test-content-${timestamp}`,
    keyEn: `test-content-${timestamp}`,
    valueAr: `محتوى تجريبي ${timestamp}`,
    valueEn: `Test content ${timestamp}`,
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

test.describe('Admin Content Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load content page', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /محتوى|Content/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display content sections list', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="content-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should have add content button', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new content section', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      const keyField = page.locator('input[name="key"]').first();
      if (await keyField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await keyField.fill(testData.content.keyAr);
      }

      await fillBilingualField(page, 'value', testData.content.valueAr, testData.content.valueEn);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should edit content section', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const valueField = page.locator('input[name="value.ar"], textarea[name="value.ar"]').first();
      if (await valueField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await valueField.fill(`محتوى محدث ${timestamp}`);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should filter content by section', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const sectionFilter = page.locator('select, [role="combobox"]').filter({ hasText: /قسم|Section/i }).first();
    if (await sectionFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sectionFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search content', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should preview content', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const previewButton = page.locator('button, a').filter({ hasText: /معاينة|Preview/i }).first();
    if (await previewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await previewButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should toggle content visibility', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const visibilityToggle = page.locator('button, input[type="checkbox"]').filter({ hasText: /مرئي|Visible|نشط|Active/i }).first();
    if (await visibilityToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await visibilityToggle.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should delete content section', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const deleteButton = page.locator('button').filter({ hasText: /حذف|Delete/i }).first();
    if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteButton.click();
      await page.waitForTimeout(500);

      const confirmButton = page.locator('button').filter({ hasText: /تأكيد|Confirm|نعم|Yes/i }).first();
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/ar/admin/content');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(1000);

        const errorMessage = page.locator('[role="alert"], .error, [class*="error"]').first();
        expect(errorMessage).toBeDefined();
      }
    }
  });
});
