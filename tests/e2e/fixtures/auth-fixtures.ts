/**
 * Auth Fixtures for E2E Tests
 * Provides reusable authentication state for admin tests
 */

import { test as base } from '@playwright/test'

/**
 * Available auth fixtures
 */
interface AuthFixtures {
  /**
   * Admin authenticated - Automatically logs in as admin
   * Creates reusable auth state to speed up subsequent tests
   */
  adminAuth: void
}

/**
 * Extend Playwright test with auth fixtures
 */
export const test = base.extend<AuthFixtures>({
  adminAuth: async ({ context, page }, use) => {
    // Navigate to admin login
    await page.goto('/admin/login')

    // Get admin password from env or use default
    const adminPassword = process.env.ADMIN_API_TOKEN || 'admin'

    // Fill and submit login form
    await page.fill('input[type="password"]', adminPassword)
    await page.click('button[type="submit"]')

    // Wait for successful redirect to admin dashboard
    await page.waitForURL('/admin', { timeout: 10000 })

    // Store auth cookies for reuse across tests
    await context.storageState({ path: 'tests/e2e/.auth/admin.json' })

    // Fixture is now ready
    await use()
  }
})

export { expect } from '@playwright/test'
