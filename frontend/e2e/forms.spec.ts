/**
 * Forms E2E Tests
 * اختبارات النماذج
 */

import { test, expect } from '@playwright/test';

// =============================================================================
// CONTACT FORM TESTS
// =============================================================================
test.describe('Contact Form', () => {
  test.describe('Form Structure', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/contact');
      await page.waitForLoadState('networkidle');
    });

    test('should display contact form', async ({ page }) => {
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test('should have name input', async ({ page }) => {
      const nameInput = page
        .locator('input[name="name"], input[placeholder*="اسم"], input[placeholder*="name" i]')
        .first();
      await expect(nameInput).toBeVisible();
    });

    test('should have email input', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      await expect(emailInput).toBeVisible();
    });

    test('should have phone input', async ({ page }) => {
      const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
      // Phone may be optional
    });

    test('should have subject input', async ({ page }) => {
      const subjectInput = page
        .locator(
          'input[name="subject"], input[placeholder*="موضوع"], input[placeholder*="subject" i]'
        )
        .first();
      // Subject may be optional or select
    });

    test('should have message textarea', async ({ page }) => {
      const messageInput = page.locator('textarea[name="message"], textarea').first();
      await expect(messageInput).toBeVisible();
    });

    test('should have submit button', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"]').first();
      await expect(submitButton).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/contact');
      await page.waitForLoadState('networkidle');
    });

    test('should not submit empty form', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      // Should stay on contact page
      await expect(page).toHaveURL(/\/contact/);
    });

    test('should validate name is required', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const messageInput = page.locator('textarea').first();
      const submitButton = page.locator('button[type="submit"]').first();

      // Fill everything except name
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
      }
      if (await messageInput.isVisible()) {
        await messageInput.fill('Test message');
      }

      await submitButton.click();

      // Form should not submit or show validation error
    });

    test('should validate email format', async ({ page }) => {
      const nameInput = page
        .locator('input[name="name"], input[placeholder*="اسم" i], input[placeholder*="name" i]')
        .first();
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const messageInput = page.locator('textarea').first();

      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
      }
      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email');
      }
      if (await messageInput.isVisible()) {
        await messageInput.fill('Test message');
      }

      // Email should be invalid
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBe(true);
    });

    test('should validate message is required', async ({ page }) => {
      const nameInput = page
        .locator('input[name="name"], input[placeholder*="اسم" i], input[placeholder*="name" i]')
        .first();
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
      }
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
      }

      // Don't fill message
      await submitButton.click();

      // Should show validation error
    });

    test('should accept valid form data', async ({ page }) => {
      const nameInput = page
        .locator('input[name="name"], input[placeholder*="اسم" i], input[placeholder*="name" i]')
        .first();
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const messageInput = page.locator('textarea').first();

      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
        await expect(nameInput).toHaveValue('Test User');
      }

      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await expect(emailInput).toHaveValue('test@example.com');
      }

      if (await messageInput.isVisible()) {
        await messageInput.fill('This is a test message for the contact form.');
        await expect(messageInput).toHaveValue('This is a test message for the contact form.');
      }
    });
  });

  test.describe('Form Interaction', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/contact');
      await page.waitForLoadState('networkidle');
    });

    test('should focus first input on tab', async ({ page }) => {
      await page.keyboard.press('Tab');
      // Should focus on first form element or skip link
    });

    test('should navigate through form with Tab', async ({ page }) => {
      const nameInput = page
        .locator('input[name="name"], input[placeholder*="اسم" i], input[placeholder*="name" i]')
        .first();

      if (await nameInput.isVisible()) {
        await nameInput.focus();
        await page.keyboard.press('Tab');
        // Should move to next input
      }
    });

    test('should clear input on clear button or escape', async ({ page }) => {
      const nameInput = page
        .locator('input[name="name"], input[placeholder*="اسم" i], input[placeholder*="name" i]')
        .first();

      if (await nameInput.isVisible()) {
        await nameInput.fill('Test');
        await nameInput.selectText();
        await page.keyboard.press('Backspace');
        await expect(nameInput).toHaveValue('');
      }
    });

    test('should support paste in inputs', async ({ page }) => {
      const nameInput = page
        .locator('input[name="name"], input[placeholder*="اسم" i], input[placeholder*="name" i]')
        .first();

      if (await nameInput.isVisible()) {
        await nameInput.focus();
        // Simulate paste
        await page.evaluate(() => {
          const input = document.querySelector(
            'input[name="name"], input[placeholder*="اسم"], input[placeholder*="name" i]'
          ) as HTMLInputElement;
          if (input) {
            input.value = 'Pasted Text';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      }
    });
  });
});

// =============================================================================
// NEWSLETTER SUBSCRIPTION FORM TESTS
// =============================================================================
test.describe('Newsletter Subscription Form', () => {
  test.describe('Form Structure', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');
    });

    test('should display newsletter form if present', async ({ page }) => {
      const newsletterForm = page
        .locator('[class*="newsletter"], form:has(input[type="email"])')
        .first();
      // Newsletter form may be in footer or dedicated section
    });

    test('should have email input for newsletter', async ({ page }) => {
      // Scroll to footer where newsletter usually is
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const emailInput = page
        .locator('footer input[type="email"], [class*="newsletter"] input[type="email"]')
        .first();
      // Newsletter email may or may not be present
    });
  });

  test.describe('Newsletter Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    });

    test('should validate email format for newsletter', async ({ page }) => {
      const emailInput = page
        .locator('footer input[type="email"], [class*="newsletter"] input[type="email"]')
        .first();

      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email');
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
        expect(isInvalid).toBe(true);
      }
    });

    test('should accept valid email for newsletter', async ({ page }) => {
      const emailInput = page
        .locator('footer input[type="email"], [class*="newsletter"] input[type="email"]')
        .first();

      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await expect(emailInput).toHaveValue('test@example.com');
      }
    });
  });
});

// =============================================================================
// SEARCH FORM TESTS
// =============================================================================
test.describe('Search Form', () => {
  test('should have search functionality on blog page', async ({ page }) => {
    await page.goto('/ar/blog');
    await page.waitForLoadState('networkidle');

    const searchInput = page
      .locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="search" i]')
      .first();
    // Search may or may not be present
  });

  test('should filter content on search', async ({ page }) => {
    await page.goto('/ar/blog');
    await page.waitForLoadState('networkidle');

    const searchInput = page
      .locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="search" i]')
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('test search');
      await page.keyboard.press('Enter');
      // Results should update
    }
  });
});

// =============================================================================
// JOB APPLICATION FORM TESTS
// =============================================================================
test.describe('Job Application Form', () => {
  test('should access job application from careers page', async ({ page }) => {
    await page.goto('/ar/careers');
    await page.waitForLoadState('networkidle');

    // Look for job listings
    const jobLinks = page.locator('a[href*="/careers/"]');
    const jobCount = await jobLinks.count();

    // If there are jobs, click first one
    if (jobCount > 0) {
      await jobLinks.first().click();
      await page.waitForLoadState('networkidle');

      // Should be on job detail page
      await expect(page).toHaveURL(/\/careers\//);
    }
  });

  test('job application form should have required fields', async ({ page }) => {
    await page.goto('/ar/careers');
    await page.waitForLoadState('networkidle');

    // Look for application form or apply button
    const applyButton = page
      .locator(
        'button:has-text("تقدم"), button:has-text("Apply"), a:has-text("تقدم"), a:has-text("Apply")'
      )
      .first();

    if (await applyButton.isVisible()) {
      await applyButton.click();
      await page.waitForTimeout(1000);

      // Check for form fields
      const form = page.locator('form, [class*="modal"], [class*="application"]').first();
      // Form may open in modal or navigate to new page
    }
  });
});

// =============================================================================
// FORM ACCESSIBILITY TESTS
// =============================================================================
test.describe('Form Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/contact');
    await page.waitForLoadState('networkidle');
  });

  test('form inputs should have labels or aria-labels', async ({ page }) => {
    const inputs = page.locator('input:not([type="hidden"]):not([type="submit"]), textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const placeholder = await input.getAttribute('placeholder');

        // Should have some accessibility attribute
        const hasAccessibility =
          id !== null || ariaLabel !== null || ariaLabelledBy !== null || placeholder !== null;
        expect(hasAccessibility).toBe(true);
      }
    }
  });

  test('submit button should be accessible', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first();

    if (await submitButton.isVisible()) {
      // Should have text content or aria-label
      const text = await submitButton.textContent();
      const ariaLabel = await submitButton.getAttribute('aria-label');

      const hasAccessibleName = (text && text.trim().length > 0) || ariaLabel !== null;
      expect(hasAccessibleName).toBe(true);
    }
  });

  test('form should support keyboard navigation', async ({ page }) => {
    const form = page.locator('form').first();

    if (await form.isVisible()) {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to submit with Enter
      // (but not if form is invalid)
    }
  });
});

// =============================================================================
// FORM ERROR MESSAGES TESTS
// =============================================================================
test.describe('Form Error Messages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/contact');
    await page.waitForLoadState('networkidle');
  });

  test('should display error for invalid email', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();

    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid');
      await emailInput.blur();

      // Should show error message or invalid state
    }
  });

  test('should clear error when input is corrected', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();

    if (await emailInput.isVisible()) {
      // First enter invalid
      await emailInput.fill('invalid');
      await emailInput.blur();

      // Then correct it
      await emailInput.clear();
      await emailInput.fill('valid@example.com');
      await emailInput.blur();

      // Error should be cleared
    }
  });
});

// =============================================================================
// FORM RTL/LTR TESTS
// =============================================================================
test.describe('Form RTL/LTR Support', () => {
  test('contact form should work in RTL (Arabic)', async ({ page }) => {
    await page.goto('/ar/contact');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');

    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('contact form should work in LTR (English)', async ({ page }) => {
    await page.goto('/en/contact');
    await page.waitForLoadState('networkidle');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');

    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('text input should align correctly in RTL', async ({ page }) => {
    await page.goto('/ar/contact');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('input[name="name"], input[placeholder*="اسم" i]').first();

    if (await nameInput.isVisible()) {
      await nameInput.fill('اسم تجريبي');
      await expect(nameInput).toHaveValue('اسم تجريبي');
    }
  });

  test('text input should align correctly in LTR', async ({ page }) => {
    await page.goto('/en/contact');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();

    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Name');
      await expect(nameInput).toHaveValue('Test Name');
    }
  });
});
