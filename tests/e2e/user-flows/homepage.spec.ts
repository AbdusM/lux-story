import { test, expect } from '@playwright/test'

/**
 * Homepage - Basic Load Test
 * Verifies the homepage loads and shows initial content
 */

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Avoid waiting for full `load`/`networkidle` in dev:
    // - Next dev keeps connections open (HMR)
    // - external resources (fonts, analytics) can be slow/blocked in CI
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Take a screenshot to see what's actually rendered
    await page.screenshot({ path: test.info().outputPath('homepage-loaded.png'), fullPage: true })

    // Check for any visible text on the page
    const bodyText = await page.locator('body').textContent()
    console.log('Page text (first 500 chars):', bodyText?.substring(0, 500))

    // Verify we got some content
    expect(bodyText).toBeTruthy()
    expect(bodyText!.length).toBeGreaterThan(10)
  })

  test('should have title', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const title = await page.title()
    console.log('Page title:', title)
    expect(title).toBeTruthy()
  })

  test('should render game interface or intro screen', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Wait for dynamic content by checking for one of the expected elements
    await Promise.race([
      page.getByTestId('game-interface').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.getByRole('button', { name: 'Begin Exploring', exact: true }).waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.getByRole('button', { name: 'Continue Journey', exact: true }).waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Samuel').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Birmingham').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Enter the Station').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Grand Central').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.locator('text=Terminus').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
    ])

    // Check for game content - could be intro screen or main game interface
    const hasGameInterface = await page.getByTestId('game-interface').count() > 0
    const hasBeginExploring = await page.getByRole('button', { name: 'Begin Exploring', exact: true }).count() > 0
    const hasContinueJourney = await page.getByRole('button', { name: 'Continue Journey', exact: true }).count() > 0
    const hasSamuel = await page.locator('text=Samuel').count() > 0
    const hasBirmingham = await page.locator('text=Birmingham').count() > 0
    const hasEnterStation = await page.locator('text=Enter the Station').count() > 0
    const hasGrandCentral = await page.locator('text=Grand Central').count() > 0
    const hasTerminus = await page.locator('text=Terminus').count() > 0

    console.log('Has game interface:', hasGameInterface)
    console.log('Has Begin Exploring:', hasBeginExploring)
    console.log('Has Continue Journey:', hasContinueJourney)
    console.log('Has Samuel:', hasSamuel)
    console.log('Has Birmingham:', hasBirmingham)
    console.log('Has Enter Station:', hasEnterStation)
    console.log('Has Grand Central:', hasGrandCentral)
    console.log('Has Terminus:', hasTerminus)

    // At least one of these should be present
    expect(
      hasGameInterface ||
      hasBeginExploring ||
      hasContinueJourney ||
      hasSamuel ||
      hasBirmingham ||
      hasEnterStation ||
      hasGrandCentral ||
      hasTerminus
    ).toBe(true)
  })
})
