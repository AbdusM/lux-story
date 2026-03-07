/**
 * Auth Fixtures for E2E Tests
 * Provides reusable authentication state for admin tests
 */

import { test as base } from '@playwright/test'

const ADMIN_BYPASS_COOKIE = {
  name: 'lux-playwright-admin-bypass',
  value: '1',
  domain: 'localhost',
  path: '/',
}

/**
 * Available auth fixtures
 */
interface AuthFixtures {
  /**
   * Admin authenticated for Playwright smoke coverage.
   * Uses the cookie-scoped Playwright bypass instead of a deprecated password form.
   */
  adminAuth: void
}

/**
 * Extend Playwright test with auth fixtures
 */
export const test = base.extend<AuthFixtures>({
  adminAuth: async ({ context, page }, use) => {
    await context.addCookies([ADMIN_BYPASS_COOKIE])
    await page.addInitScript(() => {
      ;(window as Window & { __PLAYWRIGHT__?: boolean }).__PLAYWRIGHT__ = true
    })

    await context.storageState({ path: 'tests/e2e/.auth/admin.json' })
    await use()
  }
})

export { expect } from '@playwright/test'
