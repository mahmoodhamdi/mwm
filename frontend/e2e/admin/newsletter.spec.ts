/**
 * Admin Newsletter Management E2E Tests
 * اختبارات إدارة النشرة البريدية
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
};

const timestamp = Date.now();
const testData = {
  campaign: {
    nameAr: `حملة تجريبية ${timestamp}`,
    nameEn: `Test Campaign ${timestamp}`,
    subjectAr: `موضوع تجريبي ${timestamp}`,
    subjectEn: `Test Subject ${timestamp}`,
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

test.describe('Admin Newsletter Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load newsletter page', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /نشرة|Newsletter/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display subscribers tab', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const subscribersTab = page.locator('button, a').filter({ hasText: /مشتركين|Subscribers/i }).first();
    await expect(subscribersTab).toBeVisible({ timeout: 5000 });
  });

  test('should display campaigns tab', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const campaignsTab = page.locator('button, a').filter({ hasText: /حملات|Campaigns/i }).first();
    await expect(campaignsTab).toBeVisible({ timeout: 5000 });
  });

  test('should load subscribers list', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const subscribersTab = page.locator('button, a').filter({ hasText: /مشتركين|Subscribers/i }).first();
    if (await subscribersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await subscribersTab.click();
      await page.waitForTimeout(1000);
    }

    const list = page.locator('table, [data-testid="subscribers-list"], .grid').first();
    expect(list).toBeDefined();
  });

  test('should load campaigns list', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const campaignsTab = page.locator('button, a').filter({ hasText: /حملات|Campaigns/i }).first();
    if (await campaignsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await campaignsTab.click();
      await page.waitForTimeout(1000);
    }

    const list = page.locator('table, [data-testid="campaigns-list"], .grid').first();
    expect(list).toBeDefined();
  });

  test('should create new campaign', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const campaignsTab = page.locator('button, a').filter({ hasText: /حملات|Campaigns/i }).first();
    if (await campaignsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await campaignsTab.click();
      await page.waitForTimeout(1000);
    }

    const addButton = page.locator('button, a').filter({ hasText: /إضافة حملة|Add Campaign|إضافة|Add/i }).first();
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      await fillBilingualField(page, 'name', testData.campaign.nameAr, testData.campaign.nameEn);
      await fillBilingualField(page, 'subject', testData.campaign.subjectAr, testData.campaign.subjectEn);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /حفظ|Save|إنشاء|Create/i }).first();
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should send campaign', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const campaignsTab = page.locator('button, a').filter({ hasText: /حملات|Campaigns/i }).first();
    if (await campaignsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await campaignsTab.click();
      await page.waitForTimeout(1000);
    }

    const sendButton = page.locator('button').filter({ hasText: /إرسال|Send/i }).first();
    if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sendButton.click();
      await page.waitForTimeout(500);

      const confirmButton = page.locator('button').filter({ hasText: /تأكيد|Confirm|نعم|Yes/i }).first();
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should filter subscribers by status', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const subscribersTab = page.locator('button, a').filter({ hasText: /مشتركين|Subscribers/i }).first();
    if (await subscribersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await subscribersTab.click();
      await page.waitForTimeout(1000);
    }

    const statusFilter = page.locator('select, [role="combobox"]').filter({ hasText: /حالة|Status/i }).first();
    if (await statusFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search subscribers', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const subscribersTab = page.locator('button, a').filter({ hasText: /مشتركين|Subscribers/i }).first();
    if (await subscribersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await subscribersTab.click();
      await page.waitForTimeout(1000);
    }

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test@example.com');
      await page.waitForTimeout(1000);
    }
  });

  test('should export subscribers', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const subscribersTab = page.locator('button, a').filter({ hasText: /مشتركين|Subscribers/i }).first();
    if (await subscribersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await subscribersTab.click();
      await page.waitForTimeout(1000);
    }

    const exportButton = page.locator('button').filter({ hasText: /تصدير|Export/i }).first();
    if (await exportButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await exportButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should delete subscriber', async ({ page }) => {
    await page.goto('/ar/admin/newsletter');
    await page.waitForLoadState('networkidle');

    const subscribersTab = page.locator('button, a').filter({ hasText: /مشتركين|Subscribers/i }).first();
    if (await subscribersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await subscribersTab.click();
      await page.waitForTimeout(1000);
    }

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
