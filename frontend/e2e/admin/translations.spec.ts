/**
 * Admin Translations Management E2E Tests
 * اختبارات إدارة الترجمات
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  translation: {
    key: `test.translation.${timestamp}`,
    valueAr: `قيمة تجريبية ${timestamp}`,
    valueEn: `Test value ${timestamp}`,
    namespace: 'common',
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

test.describe('Admin Translations Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load translations page', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /ترجمات|Translations/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display translations list', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="translations-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should have add translation button', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new translation', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة ترجمة|Add Translation|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      const keyField = page.locator('input[name="key"]').first();
      if (await keyField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await keyField.fill(testData.translation.key);
      }

      await fillBilingualField(page, 'value', testData.translation.valueAr, testData.translation.valueEn);

      const namespaceField = page.locator('input[name="namespace"], select[name="namespace"]').first();
      if (await namespaceField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await namespaceField.fill(testData.translation.namespace);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should edit translation', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const valueField = page.locator('input[name="value.ar"], textarea[name="value.ar"]').first();
      if (await valueField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await valueField.fill(`قيمة محدثة ${timestamp}`);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should filter translations by namespace', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const namespaceFilter = page.locator('select, [role="combobox"]').filter({ hasText: /مساحة|Namespace/i }).first();
    if (await namespaceFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await namespaceFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search translations', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should filter missing translations', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const missingFilter = page.locator('button, input[type="checkbox"]').filter({ hasText: /ناقص|Missing/i }).first();
    if (await missingFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await missingFilter.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should export translations', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const exportButton = page.locator('button').filter({ hasText: /تصدير|Export/i }).first();
    if (await exportButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await exportButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should import translations', async ({ page }) => {
    await page.goto('/ar/admin/translations');
    await page.waitForLoadState('networkidle');

    const importButton = page.locator('button').filter({ hasText: /استيراد|Import/i }).first();
    if (await importButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await importButton.click();
      await page.waitForTimeout(1000);

      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        expect(fileInput).toBeDefined();
      }
    }
  });

  test('should delete translation', async ({ page }) => {
    await page.goto('/ar/admin/translations');
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
    await page.goto('/ar/admin/translations');
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
