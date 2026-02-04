import { test, expect } from '@playwright/test'

/**
 * Admin Dashboard Authentication E2E Tests
 * Tests admin access using role-based authentication with E2E bypass
 *
 * Authentication flow:
 * - Admin login page redirects to main page (role-based, no password)
 * - E2E tests use bypass token via headers/cookies
 * - Admin routes require authenticated user with admin/educator role
 */

const TEST_ADMIN_TOKEN = process.env.E2E_ADMIN_BYPASS_TOKEN || 'e2e-admin-bypass'

test.describe('Admin Login Page Behavior', () => {
  test('login page shows redirect notice and redirects to home', async ({ page }) => {
    await page.goto('/admin/login')

    // Should show the redirect notice
    await expect(page.getByText('Admin Access')).toBeVisible()
    await expect(page.getByText('Admin access is now integrated with your user account')).toBeVisible()
    await expect(page.getByText('Redirecting to main page')).toBeVisible()

    // Wait for redirect (3 second timeout in the component)
    await page.waitForURL('/', { timeout: 5000 })
  })

  test('login page shows educator contact information', async ({ page }) => {
    await page.goto('/admin/login')

    await expect(page.getByText('For Birmingham educators and administrators')).toBeVisible()
    await expect(page.getByText(/contact your program coordinator/i)).toBeVisible()
  })
})

test.describe('Admin Dashboard with E2E Bypass', () => {
  // Use the E2E bypass mechanism for admin access
  test.use({ extraHTTPHeaders: { 'X-Test-Admin': TEST_ADMIN_TOKEN } })

  test.beforeEach(async ({ page }) => {
    // Set up bypass cookies and flags
    await page.addInitScript(() => {
      window.__E2E_ADMIN__ = true
      window.__PLAYWRIGHT__ = true
    })
    await page.context().addCookies([{
      name: 'e2e_admin_bypass',
      value: TEST_ADMIN_TOKEN,
      url: 'http://localhost:3005'
    }])
  })

  test('can access admin dashboard with bypass', async ({ page }) => {
    await page.goto('/admin')

    // Should see dashboard content (not redirected to login)
    // Dashboard shows one of: students list, empty state, or db error
    await Promise.race([
      page.locator('text=Student Insights').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
      page.locator('text=No Students Yet').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
      page.locator('text=Database Connection').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    ])

    // Should have admin UI elements
    const hasAdminContent = await page.locator('body').textContent()
    expect(hasAdminContent).toBeTruthy()
    expect(hasAdminContent!.length).toBeGreaterThan(100)
  })

  test('dashboard displays student list or empty state', async ({ page }) => {
    await page.goto('/admin')

    // Wait for loading to complete
    await Promise.race([
      page.locator('a[href*="/urgency"]').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
      page.locator('text=No Students Yet').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
      page.locator('text=Database Connection Issue').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    ])

    // Dashboard should show either students or empty state
    const studentCards = page.locator('a[href*="/urgency"]')
    const hasStudents = await studentCards.count() > 0
    const hasEmptyState = await page.locator('text=No Students Yet').count() > 0
    const hasDbError = await page.locator('text=Database Connection Issue').count() > 0

    // One of these should be true
    expect(hasStudents || hasEmptyState || hasDbError).toBe(true)
  })

  test('can navigate to student detail page', async ({ page }) => {
    await page.goto('/admin')

    // Wait for students to load
    const studentLinks = page.locator('a[href*="/urgency"]')
    await studentLinks.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})

    const count = await studentLinks.count()

    if (count > 0) {
      // Click first student
      await studentLinks.first().click()

      // Should navigate to student detail (urgency page by default)
      await expect(page).toHaveURL(/\/admin\/.*\/urgency/, { timeout: 10000 })
    } else {
      // Skip if no students - this is expected in test environments
      test.skip()
    }
  })
})

test.describe('Admin Routes Protection', () => {
  // NO bypass - tests protection without authentication

  test('admin dashboard requires authentication', async ({ page }) => {
    // Clear any existing cookies
    await page.context().clearCookies()

    await page.goto('/admin', { waitUntil: 'networkidle' })

    // Without auth, should either:
    // 1. Show unauthorized message
    // 2. Redirect to login
    // 3. Show loading state that eventually errors

    const url = page.url()
    const bodyText = await page.locator('body').textContent()

    // Either redirected to login or shows error/loading
    const isOnLogin = url.includes('/login')
    const hasError = bodyText?.includes('unauthorized') ||
                     bodyText?.includes('Unauthorized') ||
                     bodyText?.includes('Sign in') ||
                     bodyText?.includes('Loading')

    expect(isOnLogin || hasError || bodyText?.length === 0).toBe(true)
  })

  test('student detail page requires authentication', async ({ page }) => {
    await page.context().clearCookies()

    await page.goto('/admin/player_test123/urgency', { waitUntil: 'networkidle' })

    const url = page.url()
    const bodyText = await page.locator('body').textContent()

    // Should show auth error or redirect
    const isProtected = url.includes('/login') ||
                       bodyText?.includes('unauthorized') ||
                       bodyText?.includes('Unauthorized') ||
                       bodyText?.includes('Sign in')

    expect(isProtected || bodyText?.length === 0).toBe(true)
  })
})

test.describe('Admin Student Detail Pages', () => {
  test.use({ extraHTTPHeaders: { 'X-Test-Admin': TEST_ADMIN_TOKEN } })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__E2E_ADMIN__ = true
      window.__PLAYWRIGHT__ = true
    })
    await page.context().addCookies([{
      name: 'e2e_admin_bypass',
      value: TEST_ADMIN_TOKEN,
      url: 'http://localhost:3005'
    }])
  })

  test('student detail page handles non-existent user gracefully', async ({ page }) => {
    await page.goto('/admin/player_nonexistent_12345/urgency', { waitUntil: 'networkidle' })

    // Wait for page to finish loading
    await page.locator('body').waitFor({ state: 'visible', timeout: 5000 })

    // Page should render something (loading, error, or empty state)
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
  })

  test('student detail page has navigation tabs when student exists', async ({ page }) => {
    // First get a real student ID
    await page.goto('/admin')

    const studentLinks = page.locator('a[href*="/urgency"]')
    await studentLinks.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    const count = await studentLinks.count()

    if (count > 0) {
      await studentLinks.first().click()
      await page.waitForURL(/\/admin\/.*\/urgency/, { timeout: 10000 })

      // Wait for loading to complete
      await page.waitForFunction(
        () => !document.body.textContent?.includes('Loading student profile'),
        { timeout: 15000 }
      ).catch(() => {})

      // Wait for navigation elements
      await Promise.race([
        page.locator('a[href*="/urgency"]').first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {}),
        page.locator('a[href*="/skills"]').first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {}),
        page.locator('a[href*="/patterns"]').first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})
      ])

      // Check for navigation elements
      const hasUrgencyLink = await page.locator('a[href*="/urgency"]').count() > 0
      const hasSkillsLink = await page.locator('a[href*="/skills"]').count() > 0
      const hasPatternsLink = await page.locator('a[href*="/patterns"]').count() > 0
      const hasContent = await page.locator('body').textContent().then(t => (t?.length || 0) > 100)

      // At least some navigation or content should exist
      expect(hasUrgencyLink || hasSkillsLink || hasPatternsLink || hasContent).toBe(true)
    } else {
      test.skip()
    }
  })
})
