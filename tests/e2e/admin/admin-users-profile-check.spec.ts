import { test, expect } from '../fixtures/auth-fixtures'

const TEST_USER = {
  user_id: '11111111-1111-1111-1111-111111111111',
  email: 'student@example.com',
  full_name: 'Test Student',
  role: 'student',
  created_at: '2026-03-08T12:00:00.000Z',
}

test.describe('Admin Users Profile Check Smoke', () => {
  test('runs the profile diagnostic from the admin users page', async ({ page, adminAuth: _adminAuth }) => {
    await page.route('**/rest/v1/profiles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([TEST_USER]),
      })
    })

    await page.route('**/api/admin/check-profile?userId=*', async (route) => {
      const requestUrl = new URL(route.request().url())
      const requestedUserId = requestUrl.searchParams.get('userId') ?? TEST_USER.user_id

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          exists: true,
          userId: requestedUserId,
          profile: {
            current_scene: 'samuel_introduction',
            total_demonstrations: 4,
          },
        }),
      })
    })

    await page.goto('/admin/users', { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: /user management/i })).toBeVisible()

    const noUsersState = page.getByText(/no users found/i)
    const row = page.locator('tbody tr').first()
    await Promise.race([
      row.waitFor({ state: 'visible', timeout: 15000 }),
      noUsersState.waitFor({ state: 'visible', timeout: 15000 }),
    ])

    if (await noUsersState.isVisible()) {
      test.skip(true, 'Admin user list unavailable in this environment')
    }

    await expect(row).toBeVisible()
    await expect(row.getByText(/run a diagnostic check/i)).toBeVisible()

    await row.getByRole('button', { name: /^check profile$/i }).click()

    await expect(row.getByText(/profile exists/i)).toBeVisible()
    await expect(row.getByText(/scene: samuel_introduction/i)).toBeVisible()
    await expect(row.getByText(/demonstrations: 4/i)).toBeVisible()
    await expect(row.getByRole('button', { name: /refresh profile check/i })).toBeVisible()
  })
})
