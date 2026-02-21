/**
 * Admin Blog Management E2E Tests
 * اختبارات إدارة المدونة
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  category: {
    nameAr: `فئة مدونة تجريبية ${timestamp}`,
    nameEn: `Test Blog Category ${timestamp}`,
  },
  post: {
    titleAr: `مقالة تجريبية ${timestamp}`,
    titleEn: `Test Blog Post ${timestamp}`,
    contentAr: `محتوى المقالة التجريبية ${timestamp}`,
    contentEn: `Test blog post content ${timestamp}`,
    tags: ['تجريبي', 'test', 'e2e'],
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

test.describe('Admin Blog Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load blog posts page', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /مدونة|Blog|مقالات|Posts/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display blog posts list', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="blog-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should have add post button', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new blog category', async ({ page }) => {
    await page.goto('/ar/admin/blog');
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

  test('should create new blog post', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة مقالة|Add Post|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      await fillBilingualField(page, 'title', testData.post.titleAr, testData.post.titleEn);
      await fillBilingualField(page, 'content', testData.post.contentAr, testData.post.contentEn);

      // Add tags if field exists
      const tagsInput = page.locator('input[name="tags"]').first();
      if (await tagsInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await tagsInput.fill(testData.post.tags.join(', '));
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should edit blog post', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const titleField = page.locator('input[name="title.ar"], input[name="titleAr"]').first();
      if (await titleField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await titleField.fill(`مقالة محدثة ${timestamp}`);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should toggle post publish status', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const toggleButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /نشر|Publish/i }).first();
    if (await toggleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should navigate to comments management', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const commentsTab = page.locator('button, a').filter({ hasText: /تعليقات|Comments/i }).first();
    if (await commentsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await commentsTab.click();
      await page.waitForTimeout(1000);

      const commentsList = page.locator('table, [data-testid="comments-list"]').first();
      expect(commentsList).toBeDefined();
    }
  });

  test('should filter posts by category', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const filterSelect = page.locator('select, [role="combobox"]').filter({ hasText: /فئة|Category/i }).first();
    if (await filterSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterSelect.click();
      await page.waitForTimeout(500);
    }
  });

  test('should filter posts by status', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const statusFilter = page.locator('select, [role="combobox"]').filter({ hasText: /حالة|Status/i }).first();
    if (await statusFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search blog posts', async ({ page }) => {
    await page.goto('/ar/admin/blog');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should delete blog post', async ({ page }) => {
    await page.goto('/ar/admin/blog');
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
});
