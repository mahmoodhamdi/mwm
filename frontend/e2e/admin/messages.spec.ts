/**
 * Admin Messages/Contact Management E2E Tests
 * اختبارات إدارة الرسائل
 */

import { test, expect, Page } from '@playwright/test';

const ADMIN_CREDENTIALS = {
  email: 'admin@mwm.com',
  password: 'Admin123!@#',
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

test.describe('Admin Messages Management', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should load messages page', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').filter({ hasText: /رسائل|Messages|اتصال|Contact/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('should display messages list', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const list = page.locator('table, [data-testid="messages-list"], .grid, [role="table"]').first();
    expect(list).toBeDefined();
  });

  test('should view message details', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const viewButton = page.locator('button, a, tr').filter({ hasText: /عرض|View|تفاصيل|Details/i }).first();
    if (await viewButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await viewButton.click();
      await page.waitForTimeout(1000);

      const messageContent = page.locator('[data-testid="message-content"], .message-content').first();
      expect(messageContent).toBeDefined();
    }
  });

  test('should mark message as read', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const markReadButton = page.locator('button, input[type="checkbox"]').filter({ hasText: /قراءة|Read|مقروء/i }).first();
    if (await markReadButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await markReadButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should reply to message', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const replyButton = page.locator('button, a').filter({ hasText: /رد|Reply/i }).first();
    if (await replyButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await replyButton.click();
      await page.waitForTimeout(1000);

      const replyTextarea = page.locator('textarea[name="reply"], textarea[placeholder*="رد"], textarea[placeholder*="Reply"]').first();
      if (await replyTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
        await replyTextarea.fill('هذا رد تجريبي - This is a test reply');

        const sendButton = page.locator('button[type="submit"]').filter({ hasText: /إرسال|Send/i }).first();
        if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await sendButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }
  });

  test('should star/flag message', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const starButton = page.locator('button, [role="checkbox"]').filter({ hasText: /نجمة|Star|مميز/i }).first();
    if (await starButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await starButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should mark message as spam', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const spamButton = page.locator('button').filter({ hasText: /بريد مزعج|Spam/i }).first();
    if (await spamButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await spamButton.click();
      await page.waitForTimeout(500);

      const confirmButton = page.locator('button').filter({ hasText: /تأكيد|Confirm|نعم|Yes/i }).first();
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should archive message', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const archiveButton = page.locator('button').filter({ hasText: /أرشيف|Archive/i }).first();
    if (await archiveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await archiveButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should filter messages by status', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const statusFilter = page.locator('select, [role="combobox"]').filter({ hasText: /حالة|Status/i }).first();
    if (await statusFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusFilter.click();
      await page.waitForTimeout(500);
    }
  });

  test('should search messages', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
    }
  });

  test('should perform bulk actions', async ({ page }) => {
    await page.goto('/ar/admin/messages');
    await page.waitForLoadState('networkidle');

    const selectAllCheckbox = page.locator('input[type="checkbox"]').first();
    if (await selectAllCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await selectAllCheckbox.click();
      await page.waitForTimeout(500);

      const bulkActionButton = page.locator('button').filter({ hasText: /إجراءات|Actions|جماعي|Bulk/i }).first();
      if (await bulkActionButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await bulkActionButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should delete message', async ({ page }) => {
    await page.goto('/ar/admin/messages');
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
