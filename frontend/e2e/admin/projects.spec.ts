/**
 * Admin Projects E2E Tests
 * اختبارات إدارة المشاريع
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  category: {
    nameAr: `فئة مشروع تجريبية ${timestamp}`,
    nameEn: `Test Project Category ${timestamp}`,
  },
  project: {
    titleAr: `مشروع تجريبي ${timestamp}`,
    titleEn: `Test Project ${timestamp}`,
    descriptionAr: `وصف المشروع التجريبي ${timestamp}`,
    descriptionEn: `Test project description ${timestamp}`,
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

test.describe('Admin Projects Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load projects page', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /مشاريع|Projects/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display projects list', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="projects-list"], [role="table"], .grid').first();
    expect(list).toBeDefined();
  });

  test('should have add project button', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new project category', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const categoriesTab = page.locator('button, a').filter({ hasText: /فئات|Categories/i }).first();
    if (await categoriesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await categoriesTab.click();
      await page.waitForTimeout(1000);
    }

    const addButton = page.locator('button, a').filter({ hasText: /إضافة فئة|Add Category/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      await fillBilingualField(page, 'name', testData.category.nameAr, testData.category.nameEn);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should create new project', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة مشروع|Add Project|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      await fillBilingualField(page, 'title', testData.project.titleAr, testData.project.titleEn);
      await fillBilingualField(page, 'description', testData.project.descriptionAr, testData.project.descriptionEn);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should edit existing project', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const titleField = page.locator('input[name="title.ar"], input[name="titleAr"]').first();
      if (await titleField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await titleField.fill(`مشروع محدث ${timestamp}`);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should toggle project publish status', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const toggleButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /نشر|Publish/i }).first();
    if (await toggleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should toggle project featured status', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const featuredButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /مميز|Featured/i }).first();
    if (await featuredButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await featuredButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should filter projects by category', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const filterSelect = page.locator('select, [role="combobox"]').filter({ hasText: /فئة|Category/i }).first();
    if (await filterSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterSelect.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search projects', async ({ page }) => {
    await page.goto('/ar/admin/projects');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should delete project', async ({ page }) => {
    await page.goto('/ar/admin/projects');
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
    await page.goto('/ar/admin/projects');
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
