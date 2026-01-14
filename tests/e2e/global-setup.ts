/**
 * Playwright Global Setup
 * Runs once before all tests to prepare shared resources
 */

import { chromium, FullConfig } from '@playwright/test'

/**
 * Global setup function
 * Creates reusable authentication state for admin tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🔧 Running global setup...')

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Navigate to admin login
    console.log('🔐 Authenticating as admin...')
    await page.goto('http://localhost:3005/admin/login')

    // Get admin password from env or use default
    const adminPassword = process.env.ADMIN_API_TOKEN || 'admin'

    // Fill and submit login form
    await page.fill('input[type="password"]', adminPassword)
    await page.click('button[type="submit"]')

    // Wait for successful redirect to admin dashboard
    await page.waitForURL('/admin', { timeout: 10000 })

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
