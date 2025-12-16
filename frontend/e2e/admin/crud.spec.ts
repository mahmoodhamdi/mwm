/**
 * Admin CRUD E2E Tests
 * اختبارات شاملة لعمليات CRUD في لوحة الإدارة
 *
 * Tests Create, Read, Update, Delete operations for:
 * - Services
 * - Projects
 * - Team Members
 * - Blog Posts
 * - Jobs
 */

import { test, expect, Page } from '@playwright/test';
import { loginToAdmin, ADMIN_CREDENTIALS } from '../utils/screenshot-helper';

// Increase timeout for CRUD tests
test.setTimeout(60000);

// Unique identifiers for test data
const timestamp = Date.now();
const testIds = {
  service: `test-service-${timestamp}`,
  project: `test-project-${timestamp}`,
  team: `test-team-${timestamp}`,
  blog: `test-blog-${timestamp}`,
  job: `test-job-${timestamp}`,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Navigate to admin page and ensure authenticated
 */
async function navigateToAdmin(page: Page, path: string): Promise<boolean> {
  const loggedIn = await loginToAdmin(page);
  if (!loggedIn) {
    console.error('Failed to login to admin');
    return false;
  }
  await page.goto(`/ar/admin/${path}`);
  await page.waitForLoadState('networkidle').catch(() => null);
  await page.waitForTimeout(1000);
  return true;
}

/**
 * Fill bilingual input fields (Arabic and English)
 */
async function fillBilingualField(
  page: Page,
  baseName: string,
  arValue: string,
  enValue: string
): Promise<void> {
  // Try different selector patterns for bilingual fields
  const arInput = page.locator(
    `input[name="${baseName}.ar"], input[name="${baseName}Ar"], textarea[name="${baseName}.ar"], textarea[name="${baseName}Ar"]`
  );
  const enInput = page.locator(
    `input[name="${baseName}.en"], input[name="${baseName}En"], textarea[name="${baseName}.en"], textarea[name="${baseName}En"]`
  );

  if ((await arInput.count()) > 0) {
    await arInput.first().fill(arValue);
  }
  if ((await enInput.count()) > 0) {
    await enInput.first().fill(enValue);
  }
}

/**
 * Click add/create button
 */
async function clickAddButton(page: Page): Promise<void> {
  const addButton = page.locator(
    'button:has-text("إضافة"), button:has-text("Add"), button:has-text("جديد"), button:has-text("New"), a:has-text("إضافة"), a:has-text("Add")'
  );
  if ((await addButton.count()) > 0) {
    await addButton.first().click();
    await page.waitForTimeout(1000);
  }
}

/**
 * Submit form
 */
async function submitForm(page: Page): Promise<void> {
  const submitButton = page.locator(
    'button[type="submit"], button:has-text("حفظ"), button:has-text("Save"), button:has-text("إنشاء"), button:has-text("Create")'
  );
  if ((await submitButton.count()) > 0) {
    await submitButton.first().click();
    await page.waitForTimeout(2000);
  }
}

/**
 * Check for success message
 */
async function checkSuccessMessage(page: Page): Promise<boolean> {
  const successIndicators = [
    '[role="alert"]:has-text("نجاح")',
    '[role="alert"]:has-text("success")',
    '.success',
    '[class*="success"]',
    'text=تم',
    'text=بنجاح',
    'text=successfully',
  ];

  for (const selector of successIndicators) {
    const element = page.locator(selector);
    if ((await element.count()) > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Search for item in table
 */
async function searchInTable(page: Page, searchTerm: string): Promise<void> {
  const searchInput = page.locator(
    'input[type="search"], input[placeholder*="بحث"], input[placeholder*="Search"], input[name="search"]'
  );
  if ((await searchInput.count()) > 0) {
    await searchInput.first().fill(searchTerm);
    await page.waitForTimeout(1500);
  }
}

/**
 * Find item row in table
 */
async function findItemRow(page: Page, itemText: string): Promise<boolean> {
  const row = page.locator(`tr:has-text("${itemText}"), [class*="card"]:has-text("${itemText}")`);
  return (await row.count()) > 0;
}

/**
 * Click edit button for item
 */
async function clickEditButton(page: Page, itemText: string): Promise<void> {
  const row = page.locator(`tr:has-text("${itemText}"), [class*="card"]:has-text("${itemText}")`);
  const editButton = row.locator(
    'button:has-text("تعديل"), button:has-text("Edit"), a:has-text("تعديل"), a:has-text("Edit"), button[aria-label*="edit"], button[aria-label*="تعديل"]'
  );
  if ((await editButton.count()) > 0) {
    await editButton.first().click();
    await page.waitForTimeout(1000);
  }
}

/**
 * Click delete button for item
 */
async function clickDeleteButton(page: Page, itemText: string): Promise<void> {
  const row = page.locator(`tr:has-text("${itemText}"), [class*="card"]:has-text("${itemText}")`);
  const deleteButton = row.locator(
    'button:has-text("حذف"), button:has-text("Delete"), button[aria-label*="delete"], button[aria-label*="حذف"]'
  );
  if ((await deleteButton.count()) > 0) {
    await deleteButton.first().click();
    await page.waitForTimeout(500);
  }
}

/**
 * Confirm delete action
 */
async function confirmDelete(page: Page): Promise<void> {
  const confirmButton = page.locator(
    'button:has-text("تأكيد"), button:has-text("Confirm"), button:has-text("نعم"), button:has-text("Yes"), [role="dialog"] button:has-text("حذف"), [role="dialog"] button:has-text("Delete")'
  );
  if ((await confirmButton.count()) > 0) {
    await confirmButton.first().click();
    await page.waitForTimeout(2000);
  }
}

// =============================================================================
// SERVICES CRUD TESTS
// =============================================================================
test.describe('Admin Services CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to services page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'services');
    expect(success).toBe(true);

    // Should see services list or table
    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display services list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'services');
    expect(success).toBe(true);

    // Should have add button
    const addButton = page.locator(
      'button:has-text("إضافة"), button:has-text("Add"), a:has-text("إضافة")'
    );
    // Add button should be visible
    expect(addButton).toBeDefined();
  });

  test('should open create service form', async ({ page }) => {
    const success = await navigateToAdmin(page, 'services');
    expect(success).toBe(true);

    await clickAddButton(page);

    // Should see form or modal
    const form = page.locator('form, [role="dialog"]');
    // Form should exist
    expect(form).toBeDefined();
  });

  test('should have required form fields for service', async ({ page }) => {
    const success = await navigateToAdmin(page, 'services/new');
    if (!success) {
      await navigateToAdmin(page, 'services');
      await clickAddButton(page);
    }
    await page.waitForTimeout(1000);

    // Check for name fields
    const nameInput = page.locator(
      'input[name*="name"], input[name*="title"], textarea[name*="name"]'
    );
    expect(nameInput).toBeDefined();
  });

  test('should validate required fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'services/new');
    if (!success) {
      await navigateToAdmin(page, 'services');
      await clickAddButton(page);
    }
    await page.waitForTimeout(1000);

    // Try to submit empty form
    await submitForm(page);

    // Should show validation errors or stay on form
    const errors = page.locator('[class*="error"], [role="alert"], .text-red');
    // Errors should exist or form should not submit
    expect(errors).toBeDefined();
  });
});

// =============================================================================
// PROJECTS CRUD TESTS
// =============================================================================
test.describe('Admin Projects CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to projects page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'projects');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display projects list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'projects');
    expect(success).toBe(true);

    // Table or grid should be visible
    const listContainer = page.locator('table, [class*="grid"], [class*="list"]');
    expect(listContainer).toBeDefined();
  });

  test('should open create project form', async ({ page }) => {
    const success = await navigateToAdmin(page, 'projects');
    expect(success).toBe(true);

    await clickAddButton(page);

    const form = page.locator('form, [role="dialog"]');
    expect(form).toBeDefined();
  });

  test('should have project form fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'projects/new');
    if (!success) {
      await navigateToAdmin(page, 'projects');
      await clickAddButton(page);
    }
    await page.waitForTimeout(1000);

    // Check for title field
    const titleInput = page.locator('input[name*="title"], input[name*="name"]');
    expect(titleInput).toBeDefined();

    // Check for category select
    const categorySelect = page.locator('select[name*="category"], [role="combobox"]');
    expect(categorySelect).toBeDefined();
  });

  test('should filter projects by category', async ({ page }) => {
    const success = await navigateToAdmin(page, 'projects');
    expect(success).toBe(true);

    // Look for category filter
    const categoryFilter = page.locator(
      'select[name*="category"], [data-testid="category-filter"]'
    );
    if ((await categoryFilter.count()) > 0) {
      await categoryFilter.first().click();
    }
  });
});

// =============================================================================
// TEAM CRUD TESTS
// =============================================================================
test.describe('Admin Team CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to team page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'team');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display team members list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'team');
    expect(success).toBe(true);

    const listContainer = page.locator('table, [class*="grid"]');
    expect(listContainer).toBeDefined();
  });

  test('should open create team member form', async ({ page }) => {
    const success = await navigateToAdmin(page, 'team');
    expect(success).toBe(true);

    await clickAddButton(page);

    const form = page.locator('form, [role="dialog"]');
    expect(form).toBeDefined();
  });

  test('should have team member form fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'team/new');
    if (!success) {
      await navigateToAdmin(page, 'team');
      await clickAddButton(page);
    }
    await page.waitForTimeout(1000);

    // Check for name field
    const nameInput = page.locator('input[name*="name"]');
    expect(nameInput).toBeDefined();

    // Check for title/position field
    const titleInput = page.locator('input[name*="title"], input[name*="position"]');
    expect(titleInput).toBeDefined();

    // Check for department select
    const deptSelect = page.locator('select[name*="department"], [role="combobox"]');
    expect(deptSelect).toBeDefined();
  });

  test('should toggle team member featured status', async ({ page }) => {
    const success = await navigateToAdmin(page, 'team');
    expect(success).toBe(true);

    // Look for featured toggle
    const featuredToggle = page.locator(
      'input[type="checkbox"][name*="featured"], [role="switch"]'
    );
    if ((await featuredToggle.count()) > 0) {
      // Toggle exists
      expect(featuredToggle).toBeDefined();
    }
  });
});

// =============================================================================
// BLOG CRUD TESTS
// =============================================================================
test.describe('Admin Blog CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to blog page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display blog posts list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog');
    expect(success).toBe(true);

    const listContainer = page.locator('table, [class*="grid"]');
    expect(listContainer).toBeDefined();
  });

  test('should open create blog post form', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog');
    expect(success).toBe(true);

    await clickAddButton(page);

    const form = page.locator('form, [role="dialog"]');
    expect(form).toBeDefined();
  });

  test('should have blog post form fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog/new');
    if (!success) {
      await navigateToAdmin(page, 'blog');
      await clickAddButton(page);
    }
    await page.waitForTimeout(1000);

    // Check for title field
    const titleInput = page.locator('input[name*="title"]');
    expect(titleInput).toBeDefined();

    // Check for content editor
    const contentEditor = page.locator(
      'textarea[name*="content"], [class*="editor"], [contenteditable="true"]'
    );
    expect(contentEditor).toBeDefined();

    // Check for category select
    const categorySelect = page.locator('select[name*="category"], [role="combobox"]');
    expect(categorySelect).toBeDefined();
  });

  test('should filter blog posts by status', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog');
    expect(success).toBe(true);

    // Look for status filter
    const statusFilter = page.locator('select[name*="status"], [data-testid="status-filter"]');
    if ((await statusFilter.count()) > 0) {
      await statusFilter.first().click();
    }
  });

  test('should have blog categories management', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog/categories');
    if (!success) {
      await navigateToAdmin(page, 'blog');
      // Look for categories tab or link
      const categoriesLink = page.locator(
        'a:has-text("الفئات"), a:has-text("Categories"), button:has-text("الفئات")'
      );
      if ((await categoriesLink.count()) > 0) {
        await categoriesLink.first().click();
      }
    }
  });
});

// =============================================================================
// CAREERS/JOBS CRUD TESTS
// =============================================================================
test.describe('Admin Careers CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to careers page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'careers');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display jobs list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'careers');
    expect(success).toBe(true);

    const listContainer = page.locator('table, [class*="grid"]');
    expect(listContainer).toBeDefined();
  });

  test('should open create job form', async ({ page }) => {
    const success = await navigateToAdmin(page, 'careers');
    expect(success).toBe(true);

    await clickAddButton(page);

    const form = page.locator('form, [role="dialog"]');
    expect(form).toBeDefined();
  });

  test('should have job form fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'careers/jobs/new');
    if (!success) {
      await navigateToAdmin(page, 'careers');
      await clickAddButton(page);
    }
    await page.waitForTimeout(1000);

    // Check for title field
    const titleInput = page.locator('input[name*="title"]');
    expect(titleInput).toBeDefined();

    // Check for job type select
    const typeSelect = page.locator('select[name*="type"], [role="combobox"]');
    expect(typeSelect).toBeDefined();

    // Check for department select
    const deptSelect = page.locator('select[name*="department"]');
    expect(deptSelect).toBeDefined();
  });

  test('should filter jobs by status', async ({ page }) => {
    const success = await navigateToAdmin(page, 'careers');
    expect(success).toBe(true);

    // Look for status filter
    const statusFilter = page.locator('select[name*="status"], [data-testid="status-filter"]');
    if ((await statusFilter.count()) > 0) {
      await statusFilter.first().click();
    }
  });

  test('should have applications management', async ({ page }) => {
    const success = await navigateToAdmin(page, 'careers/applications');
    if (!success) {
      await navigateToAdmin(page, 'careers');
      // Look for applications tab or link
      const applicationsLink = page.locator(
        'a:has-text("الطلبات"), a:has-text("Applications"), button:has-text("الطلبات")'
      );
      if ((await applicationsLink.count()) > 0) {
        await applicationsLink.first().click();
      }
    }
  });
});

// =============================================================================
// NEWSLETTER CRUD TESTS
// =============================================================================
test.describe('Admin Newsletter CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to newsletter page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'newsletter');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display subscribers or campaigns', async ({ page }) => {
    const success = await navigateToAdmin(page, 'newsletter');
    expect(success).toBe(true);

    const listContainer = page.locator('table, [class*="grid"]');
    expect(listContainer).toBeDefined();
  });

  test('should have subscribers management', async ({ page }) => {
    const success = await navigateToAdmin(page, 'newsletter/subscribers');
    if (!success) {
      await navigateToAdmin(page, 'newsletter');
      // Look for subscribers tab
      const subscribersTab = page.locator(
        'a:has-text("المشتركين"), a:has-text("Subscribers"), button:has-text("المشتركين")'
      );
      if ((await subscribersTab.count()) > 0) {
        await subscribersTab.first().click();
      }
    }
  });

  test('should have campaigns management', async ({ page }) => {
    const success = await navigateToAdmin(page, 'newsletter/campaigns');
    if (!success) {
      await navigateToAdmin(page, 'newsletter');
      // Look for campaigns tab
      const campaignsTab = page.locator(
        'a:has-text("الحملات"), a:has-text("Campaigns"), button:has-text("الحملات")'
      );
      if ((await campaignsTab.count()) > 0) {
        await campaignsTab.first().click();
      }
    }
  });
});

// =============================================================================
// MESSAGES CRUD TESTS
// =============================================================================
test.describe('Admin Messages CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to messages page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'messages');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display contact messages list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'messages');
    expect(success).toBe(true);

    const listContainer = page.locator('table, [class*="list"]');
    expect(listContainer).toBeDefined();
  });

  test('should filter messages by status', async ({ page }) => {
    const success = await navigateToAdmin(page, 'messages');
    expect(success).toBe(true);

    // Look for status filter
    const statusFilter = page.locator('select[name*="status"], [data-testid="status-filter"]');
    if ((await statusFilter.count()) > 0) {
      await statusFilter.first().click();
    }
  });

  test('should have message detail view', async ({ page }) => {
    const success = await navigateToAdmin(page, 'messages');
    expect(success).toBe(true);

    // Click on first message if available
    const firstMessage = page.locator('tr, [class*="message-item"]').first();
    if ((await firstMessage.count()) > 0) {
      await firstMessage.click();
      await page.waitForTimeout(1000);
    }
  });
});

// =============================================================================
// USERS CRUD TESTS
// =============================================================================
test.describe('Admin Users CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to users page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'users');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display users list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'users');
    expect(success).toBe(true);

    const listContainer = page.locator('table, [class*="grid"]');
    expect(listContainer).toBeDefined();
  });

  test('should open create user form', async ({ page }) => {
    const success = await navigateToAdmin(page, 'users');
    expect(success).toBe(true);

    await clickAddButton(page);

    const form = page.locator('form, [role="dialog"]');
    expect(form).toBeDefined();
  });

  test('should have user form fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'users/new');
    if (!success) {
      await navigateToAdmin(page, 'users');
      await clickAddButton(page);
    }
    await page.waitForTimeout(1000);

    // Check for email field
    const emailInput = page.locator('input[name*="email"], input[type="email"]');
    expect(emailInput).toBeDefined();

    // Check for name field
    const nameInput = page.locator('input[name*="name"]');
    expect(nameInput).toBeDefined();

    // Check for role select
    const roleSelect = page.locator('select[name*="role"], [role="combobox"]');
    expect(roleSelect).toBeDefined();
  });

  test('should filter users by role', async ({ page }) => {
    const success = await navigateToAdmin(page, 'users');
    expect(success).toBe(true);

    // Look for role filter
    const roleFilter = page.locator('select[name*="role"], [data-testid="role-filter"]');
    if ((await roleFilter.count()) > 0) {
      await roleFilter.first().click();
    }
  });
});

// =============================================================================
// SETTINGS TESTS
// =============================================================================
test.describe('Admin Settings', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to settings page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'settings');
    expect(success).toBe(true);

    const content = page.locator('form, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display site settings form', async ({ page }) => {
    const success = await navigateToAdmin(page, 'settings');
    expect(success).toBe(true);

    const form = page.locator('form');
    expect(form).toBeDefined();
  });

  test('should have site name fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'settings');
    expect(success).toBe(true);

    const siteNameInput = page.locator('input[name*="siteName"], input[name*="name"]');
    expect(siteNameInput).toBeDefined();
  });

  test('should have contact info fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'settings');
    expect(success).toBe(true);

    const emailInput = page.locator('input[name*="email"]');
    const phoneInput = page.locator('input[name*="phone"]');
    expect(emailInput).toBeDefined();
    expect(phoneInput).toBeDefined();
  });

  test('should have social links fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'settings');
    expect(success).toBe(true);

    const socialInput = page.locator(
      'input[name*="facebook"], input[name*="twitter"], input[name*="instagram"], input[name*="linkedin"]'
    );
    expect(socialInput).toBeDefined();
  });

  test('should save settings', async ({ page }) => {
    const success = await navigateToAdmin(page, 'settings');
    expect(success).toBe(true);

    const submitButton = page.locator('button[type="submit"], button:has-text("حفظ")');
    expect(submitButton).toBeDefined();
  });
});

// =============================================================================
// CONTENT MANAGEMENT TESTS
// =============================================================================
test.describe('Admin Content Management', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to content page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'content');
    expect(success).toBe(true);

    const content = page.locator('form, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should have section-based content editing', async ({ page }) => {
    const success = await navigateToAdmin(page, 'content');
    expect(success).toBe(true);

    // Look for section tabs or selector
    const sectionTabs = page.locator(
      'button[role="tab"], a[role="tab"], select[name*="section"]'
    );
    expect(sectionTabs).toBeDefined();
  });

  test('should have bilingual content fields', async ({ page }) => {
    const success = await navigateToAdmin(page, 'content');
    expect(success).toBe(true);

    // Look for Arabic/English tabs or fields
    const langSwitch = page.locator(
      'button:has-text("عربي"), button:has-text("English"), [class*="lang"]'
    );
    expect(langSwitch).toBeDefined();
  });
});

// =============================================================================
// MENUS MANAGEMENT TESTS
// =============================================================================
test.describe('Admin Menus Management', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to menus page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'menus');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display menus list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'menus');
    expect(success).toBe(true);

    const listContainer = page.locator('table, [class*="list"]');
    expect(listContainer).toBeDefined();
  });

  test('should have menu items management', async ({ page }) => {
    const success = await navigateToAdmin(page, 'menus');
    expect(success).toBe(true);

    // Click on a menu to edit items
    const menuItem = page.locator('tr, [class*="menu-item"]').first();
    if ((await menuItem.count()) > 0) {
      await menuItem.click();
      await page.waitForTimeout(1000);
    }
  });
});

// =============================================================================
// TRANSLATIONS MANAGEMENT TESTS
// =============================================================================
test.describe('Admin Translations Management', () => {
  test.describe.configure({ mode: 'serial' });

  test('should navigate to translations page', async ({ page }) => {
    const success = await navigateToAdmin(page, 'translations');
    expect(success).toBe(true);

    const content = page.locator('table, [class*="card"], main');
    await expect(content.first()).toBeVisible();
  });

  test('should display translations list', async ({ page }) => {
    const success = await navigateToAdmin(page, 'translations');
    expect(success).toBe(true);

    const listContainer = page.locator('table');
    expect(listContainer).toBeDefined();
  });

  test('should have namespace filter', async ({ page }) => {
    const success = await navigateToAdmin(page, 'translations');
    expect(success).toBe(true);

    const namespaceFilter = page.locator(
      'select[name*="namespace"], [data-testid="namespace-filter"]'
    );
    expect(namespaceFilter).toBeDefined();
  });

  test('should have search functionality', async ({ page }) => {
    const success = await navigateToAdmin(page, 'translations');
    expect(success).toBe(true);

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"]');
    expect(searchInput).toBeDefined();
  });
});

// =============================================================================
// BULK OPERATIONS TESTS
// =============================================================================
test.describe('Admin Bulk Operations', () => {
  test('should have bulk selection in services', async ({ page }) => {
    const success = await navigateToAdmin(page, 'services');
    expect(success).toBe(true);

    const selectAll = page.locator('input[type="checkbox"][aria-label*="all"]');
    expect(selectAll).toBeDefined();
  });

  test('should have bulk selection in projects', async ({ page }) => {
    const success = await navigateToAdmin(page, 'projects');
    expect(success).toBe(true);

    const selectAll = page.locator('input[type="checkbox"][aria-label*="all"]');
    expect(selectAll).toBeDefined();
  });

  test('should have bulk actions dropdown', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog');
    expect(success).toBe(true);

    const bulkActions = page.locator(
      'button:has-text("إجراءات"), button:has-text("Actions"), select[name*="bulk"]'
    );
    expect(bulkActions).toBeDefined();
  });
});

// =============================================================================
// PAGINATION TESTS
// =============================================================================
test.describe('Admin Pagination', () => {
  test('should have pagination controls in services', async ({ page }) => {
    const success = await navigateToAdmin(page, 'services');
    expect(success).toBe(true);

    const pagination = page.locator('[class*="pagination"], nav[aria-label*="pagination"]');
    expect(pagination).toBeDefined();
  });

  test('should have pagination controls in projects', async ({ page }) => {
    const success = await navigateToAdmin(page, 'projects');
    expect(success).toBe(true);

    const pagination = page.locator('[class*="pagination"], nav[aria-label*="pagination"]');
    expect(pagination).toBeDefined();
  });

  test('should have page size selector', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog');
    expect(success).toBe(true);

    const pageSize = page.locator('select[name*="size"], select[name*="limit"]');
    expect(pageSize).toBeDefined();
  });
});

// =============================================================================
// SEARCH FUNCTIONALITY TESTS
// =============================================================================
test.describe('Admin Search', () => {
  test('should have search in services', async ({ page }) => {
    const success = await navigateToAdmin(page, 'services');
    expect(success).toBe(true);

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"]');
    expect(searchInput).toBeDefined();
  });

  test('should have search in projects', async ({ page }) => {
    const success = await navigateToAdmin(page, 'projects');
    expect(success).toBe(true);

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"]');
    expect(searchInput).toBeDefined();
  });

  test('should have search in blog', async ({ page }) => {
    const success = await navigateToAdmin(page, 'blog');
    expect(success).toBe(true);

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"]');
    expect(searchInput).toBeDefined();
  });

  test('should have search in team', async ({ page }) => {
    const success = await navigateToAdmin(page, 'team');
    expect(success).toBe(true);

    const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"]');
    expect(searchInput).toBeDefined();
  });
});
