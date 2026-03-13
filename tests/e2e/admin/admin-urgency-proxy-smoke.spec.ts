import { test, expect } from '../fixtures/auth-fixtures'

test.describe('Admin Urgency Proxy Smoke', () => {
  test('browser reaches the real urgency proxy without route stubs', async ({ page, adminAuth: _adminAuth }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const result = await page.evaluate(async () => {
      const response = await fetch('/api/admin-proxy/urgency?level=all-students', {
        credentials: 'include',
      })

      return {
        status: response.status,
        body: await response.json(),
      }
    })

    expect(result.status).toBe(200)
    expect(Array.isArray(result.body?.students)).toBe(true)
  })
})
