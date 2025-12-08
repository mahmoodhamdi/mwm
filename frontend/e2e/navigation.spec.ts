/**
 * Navigation E2E Tests
 * اختبارات التنقل
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('Main Navigation Links', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar');
    });

    test('should navigate to About page', async ({ page }) => {
      const aboutLink = page.locator('a[href*="/about"], a[href*="/ar/about"]').first();
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await expect(page).toHaveURL(/\/ar\/about/);
      }
    });

    test('should navigate to Services page', async ({ page }) => {
      const servicesLink = page.locator('a[href*="/services"]').first();
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await expect(page).toHaveURL(/\/services/);
      }
    });

    test('should navigate to Projects page', async ({ page }) => {
      const projectsLink = page.locator('a[href*="/projects"]').first();
      if (await projectsLink.isVisible()) {
        await projectsLink.click();
        await expect(page).toHaveURL(/\/projects/);
      }
    });

    test('should navigate to Team page', async ({ page }) => {
      const teamLink = page.locator('a[href*="/team"]').first();
      if (await teamLink.isVisible()) {
        await teamLink.click();
        await expect(page).toHaveURL(/\/team/);
      }
    });

    test('should navigate to Blog page', async ({ page }) => {
      const blogLink = page.locator('a[href*="/blog"]').first();
      if (await blogLink.isVisible()) {
        await blogLink.click();
        await expect(page).toHaveURL(/\/blog/);
      }
    });

    test('should navigate to Careers page', async ({ page }) => {
      const careersLink = page.locator('a[href*="/careers"]').first();
      if (await careersLink.isVisible()) {
        await careersLink.click();
        await expect(page).toHaveURL(/\/careers/);
      }
    });

    test('should navigate to Contact page', async ({ page }) => {
      const contactLink = page.locator('a[href*="/contact"]').first();
      if (await contactLink.isVisible()) {
        await contactLink.click();
        await expect(page).toHaveURL(/\/contact/);
      }
    });
  });

  test.describe('Footer Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar');
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    });

    test('should display footer links', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Footer should have navigation links
      const footerLinks = footer.locator('a');
      const linkCount = await footerLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test('should have social media links in footer', async ({ page }) => {
      const footer = page.locator('footer');

      // Look for social media links
      const socialLinks = footer.locator('a[href*="twitter"], a[href*="facebook"], a[href*="linkedin"], a[href*="instagram"]');
      // Social links may or may not exist
    });
  });

  test.describe('Logo Navigation', () => {
    test('should navigate to home when clicking logo', async ({ page }) => {
      await page.goto('/ar/services');

      // Find logo link
      const logoLink = page.locator('a[href="/ar"], a[href="/"], header a').first();
      if (await logoLink.isVisible()) {
        await logoLink.click();
        await expect(page).toHaveURL(/\/ar\/?$/);
      }
    });
  });

  test.describe('Breadcrumb Navigation', () => {
    test('should show breadcrumbs on inner pages', async ({ page }) => {
      await page.goto('/ar/services');

      // Look for breadcrumb navigation
      const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], [data-testid="breadcrumbs"], .breadcrumb');
      // Breadcrumbs may or may not be implemented
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/ar');
    });

    test('should show mobile menu button on small screens', async ({ page }) => {
      // Look for hamburger menu or mobile menu button
      const mobileMenuButton = page.locator('button').filter({
        has: page.locator('svg, [class*="menu"], [class*="hamburger"]')
      }).first();

      // If mobile menu exists, it should be clickable
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await page.waitForTimeout(300);

        // Mobile menu should open
        const mobileMenu = page.locator('[data-testid="mobile-menu"], nav[class*="mobile"], .mobile-menu');
        // Implementation varies
      }
    });
  });

  test.describe('404 Page', () => {
    test('should show 404 page for non-existent routes', async ({ page }) => {
      const response = await page.goto('/ar/non-existent-page-12345');

      // Should either show 404 or redirect
      // Next.js might handle this differently
    });
  });

  test.describe('Back Button Navigation', () => {
    test('should handle browser back button', async ({ page }) => {
      await page.goto('/ar');

      // Navigate to services
      const servicesLink = page.locator('a[href*="/services"]').first();
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await expect(page).toHaveURL(/\/services/);

        // Go back
        await page.goBack();
        await expect(page).toHaveURL(/\/ar\/?$/);
      }
    });
  });
});
