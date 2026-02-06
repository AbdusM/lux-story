import { test, expect } from '@playwright/test'

const TEST_ADMIN_TOKEN = process.env.E2E_ADMIN_BYPASS_TOKEN || 'e2e-admin-bypass'

test.describe('Admin Telemetry', () => {
  test.use({ extraHTTPHeaders: { 'X-Test-Admin': TEST_ADMIN_TOKEN } })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__E2E_ADMIN__ = true
      window.__PLAYWRIGHT__ = true
    })
    await page.context().addCookies([
      { name: 'e2e_admin_bypass', value: TEST_ADMIN_TOKEN, url: 'http://127.0.0.1:3005' },
      { name: 'e2e_admin_bypass', value: TEST_ADMIN_TOKEN, url: 'http://localhost:3005' },
    ])
  })

  test('telemetry page loads and renders', async ({ page }) => {
    await page.goto('/admin/telemetry')

    await expect(page.getByRole('heading', { name: 'Telemetry', exact: true })).toBeVisible({ timeout: 10000 })
    // Avoid strict-mode ambiguity (table may render "No interaction events..." which also matches /Interaction Events/i).
    await expect(page.getByText(/^Interaction Events:/i)).toBeVisible()

    // Page should render either:
    // - metrics, or
    // - "DB not configured" banner, or
    // - an error message.
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
    expect(bodyText!.length).toBeGreaterThan(100)
  })
})
