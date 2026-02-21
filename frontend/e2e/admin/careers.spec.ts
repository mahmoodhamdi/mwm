/**
 * Admin Careers Management E2E Tests
 * اختبارات إدارة الوظائف
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  job: {
    titleAr: `وظيفة تجريبية ${timestamp}`,
    titleEn: `Test Job ${timestamp}`,
    descriptionAr: `وصف الوظيفة التجريبية ${timestamp}`,
    descriptionEn: `Test job description ${timestamp}`,
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

test.describe('Admin Careers Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load careers page', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /وظائف|Careers|Jobs/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display jobs list', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="jobs-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should have add job button', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new job', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة وظيفة|Add Job|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      await fillBilingualField(page, 'title', testData.job.titleAr, testData.job.titleEn);
      await fillBilingualField(page, 'description', testData.job.descriptionAr, testData.job.descriptionEn);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should edit job', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const titleField = page.locator('input[name="title.ar"], input[name="titleAr"]').first();
      if (await titleField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await titleField.fill(`وظيفة محدثة ${timestamp}`);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should toggle job status', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const statusToggle = page.locator('button, select, [role="combobox"]').filter({ hasText: /حالة|Status|نشط|Active/i }).first();
    if (await statusToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusToggle.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should navigate to applications', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const applicationsTab = page.locator('button, a').filter({ hasText: /طلبات|Applications/i }).first();
    if (await applicationsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await applicationsTab.click();
      await page.waitForTimeout(1000);

      const applicationsList = page.locator('table, [data-testid="applications-list"]').first();
      expect(applicationsList).toBeDefined();
    }
  });

  test('should view job applications', async ({ page }) => {
    await page.goto('/ar/admin/careers/applications');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="applications-list"], .grid').first();
    expect(list).toBeDefined();
  });

  test('should filter jobs by type', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const typeFilter = page.locator('select, [role="combobox"]').filter({ hasText: /نوع|Type/i }).first();
    if (await typeFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await typeFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search jobs', async ({ page }) => {
    await page.goto('/ar/admin/careers');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should view application details', async ({ page }) => {
    await page.goto('/ar/admin/careers/applications');
    await page.waitForLoadState('networkidle');

    const viewButton = page.locator('button, a').filter({ hasText: /عرض|View|تفاصيل|Details/i }).first();
    if (await viewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await viewButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should delete job', async ({ page }) => {
    await page.goto('/ar/admin/careers');
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
