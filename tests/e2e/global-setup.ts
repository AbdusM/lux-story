/**
 * Playwright Global Setup
 * Runs once before all tests to prepare shared resources.
 *
 * Note: the current admin smoke path uses a Playwright-only bypass cookie rather
 * than a deprecated password form. This file remains optional because
 * `playwright.config.ts` does not currently enable globalSetup.
 */

import { chromium, FullConfig } from '@playwright/test'

const ADMIN_BYPASS_COOKIE = {
  name: 'lux-playwright-admin-bypass',
  value: '1',
  domain: 'localhost',
  path: '/',
}

/**
 * Global setup function
 * Creates reusable authentication state for admin tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🔧 Running global setup...')

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    console.log('🔐 Seeding Playwright admin bypass state...')
    await page.context().addCookies([ADMIN_BYPASS_COOKIE])

    // Save auth state to file for reuse
    await page.context().storageState({ path: 'tests/e2e/.auth/admin.json' })

    console.log('✅ Admin authentication saved to tests/e2e/.auth/admin.json')
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }

  console.log('✅ Global setup complete')
}

export default globalSetup
