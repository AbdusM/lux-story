import { test, expect } from '@playwright/test'

const PAGE_SIZE = 100
const TOTAL_USERS = 120
const TEST_ADMIN_TOKEN = process.env.E2E_ADMIN_BYPASS_TOKEN || 'e2e-admin-bypass'

test.describe('Admin Users Pagination', () => {
  test.use({ extraHTTPHeaders: { 'X-Test-Admin': TEST_ADMIN_TOKEN } })

  test('loads more users without duplicates', async ({ page }) => {
    await page.addInitScript(() => {
      window.__E2E_ADMIN__ = true
      window.__PLAYWRIGHT__ = true
    })
    await page.context().addCookies([
      { name: 'e2e_admin_bypass', value: TEST_ADMIN_TOKEN, url: 'http://127.0.0.1:3005' },
      { name: 'e2e_admin_bypass', value: TEST_ADMIN_TOKEN, url: 'http://localhost:3005' },
    ])

    const users = Array.from({ length: TOTAL_USERS }, (_, index) => ({
      user_id: `user-${String(index).padStart(3, '0')}`,
      email: `user-${String(index).padStart(3, '0')}@example.com`,
      full_name: `User ${index}`,
      role: index % 20 === 0 ? 'admin' : index % 7 === 0 ? 'educator' : 'student',
      created_at: new Date(Date.now() - index * 1000).toISOString()
    }))

    await page.route('**/rest/v1/profiles*', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const roleFilter = url.searchParams.get('role')
      const rangeHeader = request.headers()['range']

      if (request.method() === 'HEAD') {
        let count = TOTAL_USERS
        if (roleFilter?.includes('educator')) {
          count = users.filter(u => u.role === 'educator').length
        } else if (roleFilter?.includes('admin')) {
          count = users.filter(u => u.role === 'admin').length
        }

        await route.fulfill({
          status: 200,
          headers: {
            'Content-Range': `0-0/${count}`
          }
        })
        return
      }

      let from = 0
      let to = PAGE_SIZE - 1

      if (rangeHeader) {
        const raw = rangeHeader.includes('=') ? rangeHeader.split('=')[1] : rangeHeader
        const [fromStr, toStr] = raw.split('-')
        from = Number(fromStr)
        to = Number(toStr)
      } else if (url.searchParams.get('offset')) {
        from = Number(url.searchParams.get('offset'))
        to = from + Number(url.searchParams.get('limit') || PAGE_SIZE) - 1
      }

      let pageUsers = users.slice(from, to + 1)
      if (from >= PAGE_SIZE) {
        pageUsers = users.slice(90, 120) // overlap to validate duplicate guard
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Content-Range': `${from}-${to}/${TOTAL_USERS}`
        },
        body: JSON.stringify(pageUsers)
      })
    })

    await page.goto('/admin/users')
    await expect(page).toHaveURL(/\/admin\/users/)
    await expect(page.getByRole('heading', { name: 'Users', exact: true })).toBeVisible()

    const rows = page.locator('table tbody tr')
    await expect(rows).toHaveCount(PAGE_SIZE)

    await page.getByRole('button', { name: 'Load more' }).click()
    await expect(rows).toHaveCount(TOTAL_USERS)

    const uniqueEmails = await page.$$eval('table tbody tr td:first-child', (cells) => {
      const emails = cells.map(cell => cell.textContent?.trim()).filter(Boolean) as string[]
      return Array.from(new Set(emails))
    })

    expect(uniqueEmails.length).toBe(TOTAL_USERS)
  })
})
