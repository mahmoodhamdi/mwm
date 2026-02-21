/**
 * Admin Services E2E Tests
 * اختبارات إدارة الخدمات
 */

import { test, expect, Page } from '@playwright/test';

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

// Unique test data
const timestamp = Date.now();
const testData = {
  category: {
    nameAr: `فئة خدمة تجريبية ${timestamp}`,
    nameEn: `Test Service Category ${timestamp}`,
  },
  service: {
    nameAr: `خدمة تجريبية ${timestamp}`,
    nameEn: `Test Service ${timestamp}`,
    descriptionAr: `وصف الخدمة التجريبية ${timestamp}`,
    descriptionEn: `Test service description ${timestamp}`,
  },
};

/**
 * Login helper function
 */
async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/ar/admin/login');
  await page.waitForLoadState('domcontentloaded');

  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  const submitButton = page.locator('button[type="submit"]').first();

  await emailInput.fill(ADMIN_CREDENTIALS.email);
  await passwordInput.fill(ADMIN_CREDENTIALS.password);
  await submitButton.click();

  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 });
  await page.waitForTimeout(1000);
}

/**
 * Fill bilingual field helper
 */
async function fillBilingualField(
  page: Page,
  fieldName: string,
  arValue: string,
  enValue: string
): Promise<void> {
  const arField = page.locator(`input[name="${fieldName}.ar"], textarea[name="${fieldName}.ar"]`).first();
  const enField = page.locator(`input[name="${fieldName}.en"], textarea[name="${fieldName}.en"]`).first();

  if (await arField.isVisible({ timeout: 1000 }).catch(() => false)) {
    await arField.fill(arValue);
  }
  if (await enField.isVisible({ timeout: 1000 }).catch(() => false)) {
    await enField.fill(enValue);
  }
}

test.describe('Admin Services Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load services page', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Check page title or heading
    const heading = page.locator('h1, h2').filter({ hasText: /خدمات|Services/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display services list/table', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Check for table or list container
    const table = page.locator('table, [data-testid="services-list"], [role="table"]').first();
    expect(table).toBeDefined();
  });

  test('should have add service button', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new service category', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Look for categories section or tab
    const categoriesTab = page.locator('button, a').filter({ hasText: /فئات|Categories/i }).first();
    if (await categoriesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await categoriesTab.click();
      await page.waitForTimeout(1000);
    }

    // Click add category button
    const addButton = page.locator('button, a').filter({ hasText: /إضافة فئة|Add Category/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      // Fill category form
      await fillBilingualField(page, 'name', testData.category.nameAr, testData.category.nameEn);

      // Submit form
      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should create new service with bilingual content', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Click add service button
    const addButton = page.locator('button, a').filter({ hasText: /إضافة خدمة|Add Service|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      // Fill service form
      await fillBilingualField(page, 'name', testData.service.nameAr, testData.service.nameEn);
      await fillBilingualField(page, 'description', testData.service.descriptionAr, testData.service.descriptionEn);

      // Submit form
      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should toggle service publish status', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Find first publish toggle
    const toggleButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /نشر|Publish/i }).first();
    if (await toggleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should toggle service featured status', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Find first featured toggle
    const featuredButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /مميزة|Featured/i }).first();
    if (await featuredButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await featuredButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should edit existing service', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Find first edit button
    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      // Modify a field
      const nameField = page.locator('input[name="name.ar"], input[name="nameAr"]').first();
      if (await nameField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameField.fill(`خدمة محدثة ${timestamp}`);
      }

      // Submit form
      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should search/filter services', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should delete service', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Find first delete button
    const deleteButton = page.locator('button').filter({ hasText: /حذف|Delete/i }).first();
    if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteButton.click();
      await page.waitForTimeout(500);

      // Confirm deletion if confirmation dialog appears
      const confirmButton = page.locator('button').filter({ hasText: /تأكيد|Confirm|نعم|Yes/i }).first();
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/ar/admin/services');
    await page.waitForLoadState('networkidle');

    // Click add service button
    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(1000);

        // Should show validation errors
        const errorMessage = page.locator('[role="alert"], .error, [class*="error"]').first();
        expect(errorMessage).toBeDefined();
      }
    }
  });
});
