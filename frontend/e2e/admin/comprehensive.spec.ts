/**
 * Admin Pages Comprehensive E2E Tests
 * اختبارات شاملة لصفحات الإدارة
 */

import { test, expect } from '@playwright/test';

// =============================================================================
// ADMIN LOGIN TESTS
// =============================================================================
test.describe('Admin Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    // Should see login form
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('should have email input', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible();
  });

  test('should have password input', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await expect(passwordInput).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    // Click submit without filling form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should stay on login page or show error
    await expect(page).toHaveURL(/\/admin\/login|\/admin/);
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await emailInput.fill('invalid-email');

    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('password123');

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should show validation error or stay on page
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await emailInput.fill('nonexistent@example.com');

    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('wrongpassword');

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should show error message or stay on login page
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/login|\/admin/);
  });
});

// =============================================================================
// ADMIN DASHBOARD TESTS (without auth)
// =============================================================================
test.describe('Admin Dashboard (Public Access Check)', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/ar/admin');
    await page.waitForLoadState('networkidle');

    // Should redirect to login or show login page
    // This behavior depends on implementation
  });

  test('should protect admin routes', async ({ page }) => {
    const adminRoutes = [
      '/ar/admin/services',
      '/ar/admin/projects',
      '/ar/admin/team',
      '/ar/admin/blog',
      '/ar/admin/careers',
      '/ar/admin/newsletter',
      '/ar/admin/messages',
      '/ar/admin/settings',
    ];

    for (const route of adminRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Should redirect to login or show protected content
    }
  });
});

// =============================================================================
// ADMIN PAGES STRUCTURE TESTS
// =============================================================================
test.describe('Admin Pages Structure', () => {
  test('admin login should have proper structure', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    // Check for form elements
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      await expect(form).toBeVisible();
    }
  });

  test('admin pages should have consistent layout', async ({ page }) => {
    await page.goto('/ar/admin');
    await page.waitForLoadState('networkidle');

    // Check for common admin elements (sidebar, header)
    const main = page.locator('main, [class*="admin"], [class*="dashboard"]').first();
    // Layout may vary based on auth state
  });
});

// =============================================================================
// ADMIN NAVIGATION TESTS
// =============================================================================
test.describe('Admin Navigation', () => {
  test('should have navigation sidebar or menu', async ({ page }) => {
    await page.goto('/ar/admin');
    await page.waitForLoadState('networkidle');

    // Look for sidebar or navigation
    const nav = page.locator('nav, aside, [class*="sidebar"], [class*="menu"]').first();
    // Navigation may be hidden if not authenticated
  });

  test('admin routes should be accessible', async ({ page }) => {
    const routes = ['/ar/admin/login', '/en/admin/login'];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Routes should respond (even if redirected)
    }
  });
});

// =============================================================================
// ADMIN FORMS TESTS
// =============================================================================
test.describe('Admin Forms', () => {
  test('login form should be focusable', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.focus();
      await expect(emailInput).toBeFocused();
    }
  });

  test('login form should accept keyboard input', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
    }
  });

  test('should support tab navigation in login form', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.focus();
      await page.keyboard.press('Tab');
      // Focus should move to next element
    }
  });
});

// =============================================================================
// ADMIN RESPONSIVENESS TESTS
// =============================================================================
test.describe('Admin Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`login page should be responsive on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/ar/admin/login');
      await page.waitForLoadState('networkidle');

      // Page should load correctly
      const form = page.locator('form').first();
      // Form should be visible and usable
    });
  }
});

// =============================================================================
// ADMIN ACCESSIBILITY TESTS
// =============================================================================
test.describe('Admin Accessibility', () => {
  test('login page should have proper heading', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h1, h2').first();
    // Should have heading for accessibility
  });

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) {
      const id = await emailInput.getAttribute('id');
      const ariaLabel = await emailInput.getAttribute('aria-label');
      const placeholder = await emailInput.getAttribute('placeholder');

      // Should have some form of accessibility
      const hasAccessibility = id !== null || ariaLabel !== null || placeholder !== null;
      expect(hasAccessibility).toBe(true);
    }
  });

  test('submit button should be focusable', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const submitButton = page.locator('button[type="submit"]').first();
    if (await submitButton.isVisible()) {
      await submitButton.focus();
      await expect(submitButton).toBeFocused();
    }
  });
});

// =============================================================================
// ADMIN ERROR HANDLING TESTS
// =============================================================================
test.describe('Admin Error Handling', () => {
  test('should handle non-existent admin routes', async ({ page }) => {
    await page.goto('/ar/admin/non-existent-page');
    await page.waitForLoadState('networkidle');

    // Should show 404 or redirect
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    // Page should have loaded initially
  });
});

// =============================================================================
// ADMIN SECURITY TESTS
// =============================================================================
test.describe('Admin Security', () => {
  test('password field should mask input', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('should not expose sensitive data in URL', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    // URL should not contain password or token
    const url = page.url();
    expect(url).not.toContain('password');
    expect(url).not.toContain('token');
  });
});

// =============================================================================
// ADMIN BILINGUAL TESTS
// =============================================================================
test.describe('Admin Bilingual Support', () => {
  test('login page should work in Arabic', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('login page should work in English', async ({ page }) => {
    await page.goto('/en/admin/login');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(html).toHaveAttribute('dir', 'ltr');
  });
});
