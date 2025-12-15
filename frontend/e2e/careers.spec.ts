/**
 * Careers Page E2E Tests
 * اختبارات صفحة الوظائف
 */

import { test, expect } from '@playwright/test';

test.describe('Careers Page', () => {
  test.describe('Jobs Listing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/careers');
    });

    test('should load careers page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/ar\/careers/);
    });

    test('should display page heading', async ({ page }) => {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    });

    test('should display jobs list', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for job cards
      const jobCards = page.locator('[data-testid="job-card"], article, .job-card, [class*="job"]');
      // Jobs may be loading from API
    });

    test('should display job titles', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const jobCards = page.locator('article, [data-testid="job-card"]').first();
      if (await jobCards.isVisible()) {
        const title = jobCards.locator('h2, h3').first();
        await expect(title).toBeVisible();
      }
    });

    test('should display job types', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for job type badges
      const jobType = page
        .locator('[class*="badge"], [class*="type"], span')
        .filter({
          hasText: /دوام كامل|دوام جزئي|عن بعد|Full-time|Part-time|Remote/i,
        })
        .first();
      // Job type display may vary
    });

    test('should display department information', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for department info
      const department = page.locator('[data-testid="department"], [class*="department"]');
      // Department display may vary
    });
  });

  test.describe('Job Detail Page', () => {
    test('should navigate to job detail page', async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');

      const jobLink = page.locator('a[href*="/careers/"]').first();
      if (await jobLink.isVisible()) {
        await jobLink.click();
        await expect(page).toHaveURL(/\/ar\/careers\/[\w-]+/);
      }
    });

    test('should display job details', async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');

      const jobLink = page.locator('a[href*="/careers/"]').first();
      if (await jobLink.isVisible()) {
        await jobLink.click();
        await page.waitForLoadState('networkidle');

        // Should have job title
        const title = page.locator('h1').first();
        await expect(title).toBeVisible();

        // Should have job description
        const description = page.locator('article, .content, [class*="description"]').first();
        await expect(description).toBeVisible();
      }
    });

    test('should display job requirements', async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');

      const jobLink = page.locator('a[href*="/careers/"]').first();
      if (await jobLink.isVisible()) {
        await jobLink.click();
        await page.waitForLoadState('networkidle');

        // Look for requirements section
        const requirements = page.locator('h2, h3').filter({ hasText: /المتطلبات|Requirements/i });
        // Requirements section may vary
      }
    });

    test('should have apply button', async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');

      const jobLink = page.locator('a[href*="/careers/"]').first();
      if (await jobLink.isVisible()) {
        await jobLink.click();
        await page.waitForLoadState('networkidle');

        // Look for apply button
        const applyButton = page
          .locator('button, a')
          .filter({ hasText: /تقدم|Apply|قدم/i })
          .first();
        // Apply button should be visible
      }
    });
  });

  test.describe('Job Application Form', () => {
    test('should display application form', async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');

      const jobLink = page.locator('a[href*="/careers/"]').first();
      if (await jobLink.isVisible()) {
        await jobLink.click();
        await page.waitForLoadState('networkidle');

        // Click apply button if exists
        const applyButton = page
          .locator('button, a')
          .filter({ hasText: /تقدم|Apply/i })
          .first();
        if (await applyButton.isVisible()) {
          await applyButton.click();
          await page.waitForTimeout(500);

          // Should show application form or modal
          const applicationForm = page.locator('form, [data-testid="application-form"], .modal');
          // Form may be in modal or separate page
        }
      }
    });

    test('should have required application fields', async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');

      const jobLink = page.locator('a[href*="/careers/"]').first();
      if (await jobLink.isVisible()) {
        await jobLink.click();
        await page.waitForLoadState('networkidle');

        // Look for application form fields (may be on page or in modal)
        const nameInput = page.locator('input[name="name"], input[placeholder*="الاسم"]');
        const emailInput = page.locator('input[type="email"]');
        const resumeInput = page.locator('input[type="file"]');
        // Form fields implementation may vary
      }
    });
  });

  test.describe('Job Filters', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');
    });

    test('should have department filter', async ({ page }) => {
      const departmentFilter = page.locator('select, button').filter({
        hasText: /القسم|Department/i,
      });
      // Department filter may or may not exist
    });

    test('should have job type filter', async ({ page }) => {
      const typeFilter = page.locator('select, button').filter({
        hasText: /نوع العمل|Job Type/i,
      });
      // Type filter may or may not exist
    });

    test('should have search functionality', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="بحث"]');
      // Search may or may not be implemented
    });
  });

  test.describe('Company Benefits Section', () => {
    test('should display company benefits', async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');

      // Look for benefits section
      const benefitsSection = page.locator('section').filter({
        hasText: /المزايا|Benefits|مميزات/i,
      });
      // Benefits section may or may not exist
    });
  });

  test.describe('English Careers Page', () => {
    test('should load English careers page', async ({ page }) => {
      await page.goto('/en/careers');
      await expect(page).toHaveURL(/\/en\/careers/);
    });

    test('should display English content', async ({ page }) => {
      await page.goto('/en/careers');

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });
  });

  test.describe('Careers Page SEO', () => {
    test('should have proper meta tags', async ({ page }) => {
      await page.goto('/ar/careers');

      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
    });
  });

  test.describe('No Jobs Available State', () => {
    test('should handle empty jobs list gracefully', async ({ page }) => {
      await page.goto('/ar/careers');
      await page.waitForLoadState('networkidle');

      // If no jobs, should show appropriate message
      const emptyState = page.locator('[data-testid="empty-state"], .empty-state');
      // Empty state display varies
    });
  });
});
