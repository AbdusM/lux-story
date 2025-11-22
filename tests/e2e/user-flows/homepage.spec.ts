import { test, expect } from '@playwright/test'

/**
 * Homepage - Basic Load Test
 * Verifies the homepage loads and shows initial content
 */

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for page to finish loading
    await page.waitForLoadState('networkidle')

    // Take a screenshot to see what's actually rendered
    await page.screenshot({ path: 'test-results/homepage-loaded.png', fullPage: true })

    // Check for any visible text on the page
    const bodyText = await page.locator('body').textContent()
    console.log('Page text (first 500 chars):', bodyText?.substring(0, 500))

    // Verify we got some content
    expect(bodyText).toBeTruthy()
    expect(bodyText!.length).toBeGreaterThan(10)
  })

  test('should have title', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const title = await page.title()
    console.log('Page title:', title)
    expect(title).toBeTruthy()
  })

  test('should render Birmingham Station or Atmospheric Intro', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for either Birmingham Station (main game) or Atmospheric Intro
    const hasBirmingham = await page.locator('text=Birmingham Station').count() > 0
    const hasAtmospheric = await page.locator('text=threshold').count() > 0

    console.log('Has Birmingham Station:', hasBirmingham)
    console.log('Has Atmospheric content:', hasAtmospheric)

    // Either should be present
    expect(hasBirmingham || hasAtmospheric).toBe(true)
  })
})
