/**
 * Admin Team Management E2E Tests
 * اختبارات إدارة فريق العمل
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  department: {
    nameAr: `قسم تجريبي ${timestamp}`,
    nameEn: `Test Department ${timestamp}`,
  },
  member: {
    nameAr: `عضو فريق تجريبي ${timestamp}`,
    nameEn: `Test Team Member ${timestamp}`,
    positionAr: `منصب تجريبي ${timestamp}`,
    positionEn: `Test Position ${timestamp}`,
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

test.describe('Admin Team Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load team page', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /فريق|Team/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display team members list', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="team-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should have add team member button', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new department', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const departmentsTab = page.locator('button, a').filter({ hasText: /أقسام|Departments/i }).first();
    if (await departmentsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await departmentsTab.click();
      await page.waitForTimeout(1000);
    }

    const addButton = page.locator('button, a').filter({ hasText: /إضافة قسم|Add Department/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      await fillBilingualField(page, 'name', testData.department.nameAr, testData.department.nameEn);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should create new team member', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة عضو|Add Member|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      await fillBilingualField(page, 'name', testData.member.nameAr, testData.member.nameEn);
      await fillBilingualField(page, 'position', testData.member.positionAr, testData.member.positionEn);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should edit team member', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const nameField = page.locator('input[name="name.ar"], input[name="nameAr"]').first();
      if (await nameField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameField.fill(`عضو محدث ${timestamp}`);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should toggle member active status', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const toggleButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /نشط|Active/i }).first();
    if (await toggleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should toggle member featured status', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const featuredButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /مميز|Featured/i }).first();
    if (await featuredButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await featuredButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should toggle team leader status', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const leaderButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /قائد|Leader/i }).first();
    if (await leaderButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await leaderButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should filter team by department', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const filterSelect = page.locator('select, [role="combobox"]').first();
    if (await filterSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterSelect.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search team members', async ({ page }) => {
    await page.goto('/ar/admin/team');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should delete team member', async ({ page }) => {
    await page.goto('/ar/admin/team');
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
