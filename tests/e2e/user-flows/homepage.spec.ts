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

  test('should render game interface or intro screen', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for dynamic content by checking for one of the expected elements
    await Promise.race([
      page.getByTestId('game-interface').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Samuel').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Birmingham').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Enter the Station').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Welcome').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    ])

    // Check for game content - could be intro screen or main game interface
    const hasGameInterface = await page.getByTestId('game-interface').count() > 0
    const hasSamuel = await page.locator('text=Samuel').count() > 0
    const hasBirmingham = await page.locator('text=Birmingham').count() > 0
    const hasEnterStation = await page.locator('text=Enter the Station').count() > 0
    const hasWelcome = await page.locator('text=Welcome').count() > 0

    console.log('Has game interface:', hasGameInterface)
    console.log('Has Samuel:', hasSamuel)
    console.log('Has Birmingham:', hasBirmingham)
    console.log('Has Enter Station:', hasEnterStation)
    console.log('Has Welcome:', hasWelcome)

    // At least one of these should be present
    expect(hasGameInterface || hasSamuel || hasBirmingham || hasEnterStation || hasWelcome).toBe(true)
  })
})
