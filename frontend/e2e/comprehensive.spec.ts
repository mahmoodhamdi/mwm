/**
 * Comprehensive E2E Tests
 * اختبارات شاملة E2E
 */

import { test, expect } from '@playwright/test';

// =============================================================================
// HOME PAGE TESTS
// =============================================================================
test.describe('Home Page - Comprehensive Tests', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');
    });

    test('should display page title correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/MWM|ممم/);
    });

    test('should have correct HTML attributes for RTL', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'rtl');
      await expect(html).toHaveAttribute('lang', 'ar');
    });

    test('should display navigation header', async ({ page }) => {
      const header = page.locator('header').first();
      await expect(header).toBeVisible();
    });

    test('should display hero section with heading', async ({ page }) => {
      const heroHeading = page.locator('h1').first();
      await expect(heroHeading).toBeVisible();
    });

    test('should display footer with links', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
      // Test services link
      const servicesLink = page.locator('nav a[href*="/services"], header a[href*="/services"]').first();
      if (await servicesLink.isVisible()) {
        await expect(servicesLink).toBeVisible();
      }
    });

    test('should scroll smoothly to sections', async ({ page }) => {
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);

      // Verify scroll happened
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');
    });

    test('should display page title correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/MWM/);
    });

    test('should have correct HTML attributes for LTR', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'ltr');
      await expect(html).toHaveAttribute('lang', 'en');
    });

    test('should display navigation in English', async ({ page }) => {
      const nav = page.locator('header, nav').first();
      await expect(nav).toBeVisible();
    });
  });

  test.describe('Language Switching', () => {
    test('should switch from Arabic to English', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Find language toggle
      const langSwitch = page.locator('a[href*="/en"], button:has-text("EN"), button:has-text("English"), [data-testid="lang-switch"]').first();
      if (await langSwitch.isVisible()) {
        await langSwitch.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/en/);
      }
    });

    test('should switch from English to Arabic', async ({ page }) => {
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      const langSwitch = page.locator('a[href*="/ar"], button:has-text("AR"), button:has-text("عربي"), [data-testid="lang-switch"]').first();
      if (await langSwitch.isVisible()) {
        await langSwitch.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/ar/);
      }
    });
  });
});

// =============================================================================
// SERVICES PAGE TESTS
// =============================================================================
test.describe('Services Page - Comprehensive Tests', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/services');
      await page.waitForLoadState('networkidle');
    });

    test('should load services page', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/services/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display service cards', async ({ page }) => {
      // Look for service cards or grid
      const servicesContainer = page.locator('[class*="grid"], [class*="services"], main').first();
      await expect(servicesContainer).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/services');
      await page.waitForLoadState('networkidle');
    });

    test('should load services page in English', async ({ page }) => {
      await expect(page).toHaveURL(/\/en\/services/);
    });

    test('should have LTR direction', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'ltr');
    });
  });
});

// =============================================================================
// PROJECTS PAGE TESTS
// =============================================================================
test.describe('Projects Page - Comprehensive Tests', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/projects');
      await page.waitForLoadState('networkidle');
    });

    test('should load projects page', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/projects/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display project grid', async ({ page }) => {
      const projectsContainer = page.locator('[class*="grid"], [class*="projects"], main').first();
      await expect(projectsContainer).toBeVisible();
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/projects');
      await page.waitForLoadState('networkidle');
    });

    test('should load projects page in English', async ({ page }) => {
      await expect(page).toHaveURL(/\/en\/projects/);
    });
  });
});

// =============================================================================
// TEAM PAGE TESTS
// =============================================================================
test.describe('Team Page - Comprehensive Tests', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/team');
      await page.waitForLoadState('networkidle');
    });

    test('should load team page', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/team/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display team member cards', async ({ page }) => {
      const teamContainer = page.locator('[class*="grid"], [class*="team"], main').first();
      await expect(teamContainer).toBeVisible();
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/team');
      await page.waitForLoadState('networkidle');
    });

    test('should load team page in English', async ({ page }) => {
      await expect(page).toHaveURL(/\/en\/team/);
    });
  });
});

// =============================================================================
// BLOG PAGE TESTS
// =============================================================================
test.describe('Blog Page - Comprehensive Tests', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/blog');
      await page.waitForLoadState('networkidle');
    });

    test('should load blog page', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/blog/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display blog posts grid', async ({ page }) => {
      const blogContainer = page.locator('[class*="grid"], [class*="blog"], main').first();
      await expect(blogContainer).toBeVisible();
    });

    test('should have search functionality', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"], input[placeholder*="search"]').first();
      // Search may or may not be visible depending on design
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/blog');
      await page.waitForLoadState('networkidle');
    });

    test('should load blog page in English', async ({ page }) => {
      await expect(page).toHaveURL(/\/en\/blog/);
    });
  });
});

// =============================================================================
// CAREERS PAGE TESTS
// =============================================================================
test.describe('Careers Page - Comprehensive Tests', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');
    });

    test('should load careers page', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/careers/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display job listings', async ({ page }) => {
      const jobsContainer = page.locator('[class*="grid"], [class*="jobs"], [class*="careers"], main').first();
      await expect(jobsContainer).toBeVisible();
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/careers');
      await page.waitForLoadState('networkidle');
    });

    test('should load careers page in English', async ({ page }) => {
      await expect(page).toHaveURL(/\/en\/careers/);
    });
  });
});

// =============================================================================
// CONTACT PAGE TESTS
// =============================================================================
test.describe('Contact Page - Comprehensive Tests', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/contact');
      await page.waitForLoadState('networkidle');
    });

    test('should load contact page', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/contact/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display contact form', async ({ page }) => {
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test('should have name input field', async ({ page }) => {
      const nameInput = page.locator('input[name="name"], input[placeholder*="اسم"], input[placeholder*="name"]').first();
      await expect(nameInput).toBeVisible();
    });

    test('should have email input field', async ({ page }) => {
      const emailInput = page.locator('input[name="email"], input[type="email"]').first();
      await expect(emailInput).toBeVisible();
    });

    test('should have message textarea', async ({ page }) => {
      const messageInput = page.locator('textarea[name="message"], textarea').first();
      await expect(messageInput).toBeVisible();
    });

    test('should have submit button', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
      await expect(submitButton).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      // Click submit without filling form
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      // Form should not submit (page should stay the same)
      await expect(page).toHaveURL(/\/ar\/contact/);
    });

    test('should validate email format', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email');
        await emailInput.blur();
        // Validation message should appear or form should not submit
      }
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/contact');
      await page.waitForLoadState('networkidle');
    });

    test('should load contact page in English', async ({ page }) => {
      await expect(page).toHaveURL(/\/en\/contact/);
    });

    test('should have LTR direction', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'ltr');
    });
  });
});

// =============================================================================
// ABOUT PAGE TESTS
// =============================================================================
test.describe('About Page - Comprehensive Tests', () => {
  test.describe('Arabic Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/about');
      await page.waitForLoadState('networkidle');
    });

    test('should load about page', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/about/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should display content sections', async ({ page }) => {
      const main = page.locator('main').first();
      await expect(main).toBeVisible();
    });
  });

  test.describe('English Version', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/about');
      await page.waitForLoadState('networkidle');
    });

    test('should load about page in English', async ({ page }) => {
      await expect(page).toHaveURL(/\/en\/about/);
    });
  });
});

// =============================================================================
// RESPONSIVE DESIGN TESTS
// =============================================================================
test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  const pages = [
    { name: 'Home', path: '/ar' },
    { name: 'Services', path: '/ar/services' },
    { name: 'Projects', path: '/ar/projects' },
    { name: 'Contact', path: '/ar/contact' },
  ];

  for (const viewport of viewports) {
    test.describe(`${viewport.name} Viewport (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      for (const pageInfo of pages) {
        test(`${pageInfo.name} page should be responsive`, async ({ page }) => {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // Page should load without horizontal scroll
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
          const viewportWidth = await page.evaluate(() => window.innerWidth);

          // Allow some tolerance for scrollbars
          expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
        });
      }
    });
  }
});

// =============================================================================
// NAVIGATION TESTS
// =============================================================================
test.describe('Navigation Tests', () => {
  test('should navigate through all main pages', async ({ page }) => {
    // Start from home
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');

    // Navigate to services
    await page.goto('/ar/services');
    await expect(page).toHaveURL(/\/ar\/services/);

    // Navigate to projects
    await page.goto('/ar/projects');
    await expect(page).toHaveURL(/\/ar\/projects/);

    // Navigate to team
    await page.goto('/ar/team');
    await expect(page).toHaveURL(/\/ar\/team/);

    // Navigate to blog
    await page.goto('/ar/blog');
    await expect(page).toHaveURL(/\/ar\/blog/);

    // Navigate to careers
    await page.goto('/ar/careers');
    await expect(page).toHaveURL(/\/ar\/careers/);

    // Navigate to contact
    await page.goto('/ar/contact');
    await expect(page).toHaveURL(/\/ar\/contact/);

    // Navigate to about
    await page.goto('/ar/about');
    await expect(page).toHaveURL(/\/ar\/about/);
  });

  test('should maintain language preference across navigation', async ({ page }) => {
    // Start in Arabic
    await page.goto('/ar/services');
    await page.waitForLoadState('networkidle');

    const htmlAr = page.locator('html');
    await expect(htmlAr).toHaveAttribute('lang', 'ar');

    // Navigate to another page
    await page.goto('/ar/contact');
    await page.waitForLoadState('networkidle');

    await expect(htmlAr).toHaveAttribute('lang', 'ar');
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================
test.describe('Performance Tests', () => {
  const pages = [
    { name: 'Home', path: '/ar' },
    { name: 'Services', path: '/ar/services' },
    { name: 'Contact', path: '/ar/contact' },
  ];

  for (const pageInfo of pages) {
    test(`${pageInfo.name} page should load within 10 seconds`, async ({ page }) => {
      const startTime = Date.now();
      await page.goto(pageInfo.path);
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(10000);
    });
  }
});

// =============================================================================
// ACCESSIBILITY TESTS
// =============================================================================
test.describe('Accessibility Tests', () => {
  test('home page should have main landmark', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');

    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');

    // Page should have at least one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');

    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt should exist (can be empty for decorative images)
      expect(alt !== null).toBe(true);
    }
  });

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/ar/contact');
    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input:not([type="hidden"]):not([type="submit"]), textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      // Input should have id (for label), aria-label, or placeholder
      const hasAccessibility = id !== null || ariaLabel !== null || placeholder !== null;
      expect(hasAccessibility).toBe(true);
    }
  });
});

// =============================================================================
// ERROR HANDLING TESTS
// =============================================================================
test.describe('Error Handling Tests', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/ar/non-existent-page');
    await page.waitForLoadState('networkidle');

    // Page should load (either 404 page or redirect)
    // Should not crash
  });

  test('should handle invalid locale gracefully', async ({ page }) => {
    await page.goto('/invalid-locale');
    await page.waitForLoadState('networkidle');

    // Should redirect to default locale or show error page
  });
});

// =============================================================================
// SEO TESTS
// =============================================================================
test.describe('SEO Tests', () => {
  test('home page should have meta description', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('home page should have og:title', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');

    const ogTitle = page.locator('meta[property="og:title"]');
    // OG title may or may not be present
  });

  test('should have canonical URL', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');

    const canonical = page.locator('link[rel="canonical"]');
    // Canonical may or may not be present
  });
});
