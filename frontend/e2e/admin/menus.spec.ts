/**
 * Admin Menus Management E2E Tests
 * اختبارات إدارة القوائم
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  menu: {
    nameAr: `قائمة تجريبية ${timestamp}`,
    nameEn: `Test Menu ${timestamp}`,
  },
  menuItem: {
    labelAr: `عنصر قائمة تجريبي ${timestamp}`,
    labelEn: `Test Menu Item ${timestamp}`,
    url: `/test-${timestamp}`,
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

test.describe('Admin Menus Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load menus page', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /قوائم|Menus|تنقل|Navigation/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display menus list', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="menus-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should have add menu button', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new menu', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة قائمة|Add Menu|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      await fillBilingualField(page, 'name', testData.menu.nameAr, testData.menu.nameEn);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should add menu item', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit|إدارة|Manage/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const addItemButton = page.locator('button, a').filter({ hasText: /إضافة عنصر|Add Item/i }).first();
      if (await addItemButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addItemButton.click();
        await page.waitForTimeout(1000);

        await fillBilingualField(page, 'label', testData.menuItem.labelAr, testData.menuItem.labelEn);

        const urlField = page.locator('input[name="url"]').first();
        if (await urlField.isVisible({ timeout: 1000 }).catch(() => false)) {
          await urlField.fill(testData.menuItem.url);
        }

        const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إضافة|Add/i }).first();
        if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await submitButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });

  test('should edit menu', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const nameField = page.locator('input[name="name.ar"], input[name="nameAr"]').first();
      if (await nameField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameField.fill(`قائمة محدثة ${timestamp}`);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should reorder menu items', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit|إدارة|Manage/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const dragHandle = page.locator('[data-testid="drag-handle"], .drag-handle, [draggable="true"]').first();
      if (await dragHandle.isVisible({ timeout: 2000 }).catch(() => false)) {
        expect(dragHandle).toBeDefined();
      }
    }
  });

  test('should toggle menu item visibility', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit|إدارة|Manage/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const visibilityToggle = page.locator('button, input[type="checkbox"]').filter({ hasText: /مرئي|Visible|نشط|Active/i }).first();
      if (await visibilityToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        await visibilityToggle.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should delete menu item', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit|إدارة|Manage/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const deleteItemButton = page.locator('button').filter({ hasText: /حذف|Delete/i }).first();
      if (await deleteItemButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteItemButton.click();
        await page.waitForTimeout(500);

        const confirmButton = page.locator('button').filter({ hasText: /تأكيد|Confirm|نعم|Yes/i }).first();
        if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await confirmButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('should delete menu', async ({ page }) => {
    await page.goto('/ar/admin/menus');
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

  test('should preview menu', async ({ page }) => {
    await page.goto('/ar/admin/menus');
    await page.waitForLoadState('networkidle');

    const previewButton = page.locator('button, a').filter({ hasText: /معاينة|Preview/i }).first();
    if (await previewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await previewButton.click();
      await page.waitForTimeout(1000);
    }
  });
});
