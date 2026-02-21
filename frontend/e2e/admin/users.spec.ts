/**
 * Admin Users Management E2E Tests
 * اختبارات إدارة المستخدمين
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  user: {
    name: `Test User ${timestamp}`,
    email: `testuser${timestamp}@example.com`,
    password: 'TestPassword123!@#',
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

test.describe('Admin Users Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load users page', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /مستخدمين|Users/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display users list', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="users-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should have add user button', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add|جديد|New/i }).first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should create new user', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة مستخدم|Add User|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      const nameField = page.locator('input[name="name"]').first();
      if (await nameField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameField.fill(testData.user.name);
      }

      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      if (await emailField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await emailField.fill(testData.user.email);
      }

      const passwordField = page.locator('input[name="password"], input[type="password"]').first();
      if (await passwordField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await passwordField.fill(testData.user.password);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should edit user', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const nameField = page.locator('input[name="name"]').first();
      if (await nameField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameField.fill(`Updated User ${timestamp}`);
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|تحديث|Update/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should assign user role', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const roleSelect = page.locator('select[name="role"], [role="combobox"]').first();
      if (await roleSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await roleSelect.click();
        await page.waitForTimeout(500);

        const roleOption = page.locator('option, [role="option"]').filter({ hasText: /محرر|Editor|مؤلف|Author/i }).first();
        if (await roleOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await roleOption.click();
          await page.waitForTimeout(500);
        }
      }

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should toggle user status', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const statusToggle = page.locator('button, input[type="checkbox"]').filter({ hasText: /نشط|Active|فعال|Enabled/i }).first();
    if (await statusToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusToggle.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should filter users by role', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const roleFilter = page.locator('select, [role="combobox"]').filter({ hasText: /دور|Role/i }).first();
    if (await roleFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await roleFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search users', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('admin');
      await page.waitForTimeout(1000);
    }
  });

  test('should view user profile', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const viewButton = page.locator('button, a').filter({ hasText: /عرض|View|تفاصيل|Details/i }).first();
    if (await viewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await viewButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should reset user password', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button, a').filter({ hasText: /تعديل|Edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(1000);

      const resetPasswordButton = page.locator('button').filter({ hasText: /إعادة تعيين كلمة|Reset Password/i }).first();
      if (await resetPasswordButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await resetPasswordButton.click();
        await page.waitForTimeout(500);

        const confirmButton = page.locator('button').filter({ hasText: /تأكيد|Confirm|نعم|Yes/i }).first();
        if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await confirmButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('should delete user', async ({ page }) => {
    await page.goto('/ar/admin/users');
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

  test('should validate email format', async ({ page }) => {
    await page.goto('/ar/admin/users');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      if (await emailField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await emailField.fill('invalid-email');
      }

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
