import { test, expect } from '@playwright/test'

/**
 * Admin Dashboard Authentication E2E Tests
 *
 * Admin access is now role-based (no password form).
 * In CI we validate:
 * - /admin redirects unauthenticated users to /admin/login
 * - deep admin routes preserve a redirect param
 * - /admin/login is an informational redirect screen that routes back to /
 */

test.describe('Admin Authentication', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('redirects unauthenticated /admin to /admin/login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login(\?|$)/)

    await expect(page.getByRole('heading', { name: /admin access/i })).toBeVisible()
    await expect(page.getByText(/redirecting to login/i)).toBeVisible()
  })

  test('preserves redirect param for deep admin routes', async ({ page }) => {
    await page.goto('/admin/player_123456/urgency')
    await expect(page).toHaveURL(/\/admin\/login\?redirect=/)
  })

  test('admin login page redirects to main page', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.getByRole('heading', { name: /admin access/i })).toBeVisible()

    // The page redirects after 3s; keep buffer for CI.
    await page.waitForURL('/', { timeout: 7000 })
  })
})

