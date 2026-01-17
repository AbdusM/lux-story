/**
 * Safe Area Boundary Tests
 * Ensures critical UI elements don't get hidden by iPhone notch, home indicator, or rounded corners
 * Reference: https://webkit.org/blog/7929/designing-websites-for-iphone-x/
 */

import { test, expect } from '@playwright/test'

test.describe('Safe Area Boundaries', () => {
  test('Bottom navigation clears iPhone notch/home indicator (Pro Max)', async ({ page }) => {
    // iPhone 14 Pro Max has largest safe area insets
    await page.setViewportSize({ width: 430, height: 932 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Check Journal button position
    const journalBtn = page.getByLabel('Open Journal')
    if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const btnBox = await journalBtn.boundingBox()
      expect(btnBox).not.toBeNull()
      if (btnBox) {
        // Button must be above bottom safe area (34px on Pro models)
        const bottomSafeArea = 34
        const bottomEdge = btnBox.y + btnBox.height
        expect(bottomEdge).toBeLessThan(932 - bottomSafeArea)
      }
    }

    // Check Constellation button position
    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const btnBox = await constellationBtn.boundingBox()
      expect(btnBox).not.toBeNull()
      if (btnBox) {
        const bottomSafeArea = 34
        const bottomEdge = btnBox.y + btnBox.height
        expect(bottomEdge).toBeLessThan(932 - bottomSafeArea)
      }
    }
  })

  test('Bottom navigation clears iPhone home indicator (standard models)', async ({ page }) => {
    // iPhone 14 standard (smaller safe area than Pro Max)
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Check navigation buttons
    const journalBtn = page.getByLabel('Open Journal')
    if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const btnBox = await journalBtn.boundingBox()
      expect(btnBox).not.toBeNull()
      if (btnBox) {
        // Standard models also have ~34px bottom safe area
        const bottomSafeArea = 34
        const bottomEdge = btnBox.y + btnBox.height
        expect(bottomEdge).toBeLessThan(844 - bottomSafeArea)
      }
    }
  })

  test('Dialogue content clears iPhone notch at top (Pro Max)', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    // Wait for dialogue card
    const dialogueCard = page.getByTestId('dialogue-card')
    await expect(dialogueCard).toBeVisible({ timeout: 10000 })

    const cardBox = await dialogueCard.boundingBox()
    expect(cardBox).not.toBeNull()
    if (cardBox) {
      // Card must start below top safe area (59px on Pro models with Dynamic Island)
      const topSafeArea = 59
      expect(cardBox.y).toBeGreaterThan(topSafeArea)
    }
  })

  test('Dialogue content clears status bar on standard iPhone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    // Wait for dialogue card
    const dialogueCard = page.getByTestId('dialogue-card')
    await expect(dialogueCard).toBeVisible({ timeout: 10000 })

    const cardBox = await dialogueCard.boundingBox()
    expect(cardBox).not.toBeNull()
    if (cardBox) {
      // Card must start below status bar (~47px on standard notch models)
      const topSafeArea = 47
      expect(cardBox.y).toBeGreaterThan(topSafeArea)
    }
  })

  test('Choice buttons remain visible with keyboard on iOS', async ({ page }) => {
    // Simulate scenario where on-screen keyboard appears
    // On iOS, viewport height reduces when keyboard is shown
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Wait for choices
    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 10000 })

    // Simulate reduced viewport (keyboard shown - approximately 260px on iPhone)
    await page.setViewportSize({ width: 375, height: 407 }) // 667 - 260

    // Choices should still be visible (scrollable if needed)
    await expect(choices.first()).toBeVisible({ timeout: 3000 })

    // User should be able to scroll to see all choices if needed
    const choiceCount = await choices.count()
    if (choiceCount > 0) {
      const lastChoice = choices.last()
      await lastChoice.scrollIntoViewIfNeeded()
      await expect(lastChoice).toBeVisible({ timeout: 3000 })
    }
  })

  test('Choices stay above mobile browser chrome (bottom bar)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 5000 })

    // Simulate Chrome bottom bar (~56px) by reducing viewport height
    const bottomChromeHeight = 56
    await page.setViewportSize({ width: 390, height: 844 - bottomChromeHeight })

    const lastChoice = choices.last()
    await lastChoice.scrollIntoViewIfNeeded()
    const box = await lastChoice.boundingBox()
    expect(box).not.toBeNull()
    if (box) {
      const viewport = page.viewportSize()
      const viewportHeight = viewport?.height ?? 788
      const bottomEdge = box.y + box.height
      expect(bottomEdge).toBeLessThanOrEqual(viewportHeight)
    }
  })

  test('Content does not get cut off at rounded corners (Pro Max)', async ({ page }) => {
    // iPhone 14 Pro Max has significant corner radius
    await page.setViewportSize({ width: 430, height: 932 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Check that game interface has appropriate horizontal padding
    // to avoid content in rounded corners
    const gameInterface = page.getByTestId('game-interface')
    const interfaceBox = await gameInterface.boundingBox()
    expect(interfaceBox).not.toBeNull()
    if (interfaceBox) {
      // Should have at least 8px padding from edges to avoid corner radius
      expect(interfaceBox.x).toBeGreaterThanOrEqual(8)
      expect(interfaceBox.x + interfaceBox.width).toBeLessThanOrEqual(430 - 8)
    }
  })

  test('Modal dialogs respect safe areas', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 }) // Pro Max

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Open constellation panel (modal dialog)
    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await constellationBtn.click()

      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible({ timeout: 5000 })

      const dialogBox = await dialog.boundingBox()
      expect(dialogBox).not.toBeNull()
      if (dialogBox) {
        // Dialog should respect top safe area (59px)
        const topSafeArea = 59
        expect(dialogBox.y).toBeGreaterThan(topSafeArea)

        // Dialog should respect bottom safe area (34px)
        const bottomSafeArea = 34
        const bottomEdge = dialogBox.y + dialogBox.height
        expect(bottomEdge).toBeLessThan(932 - bottomSafeArea)
      }
    }
  })

  test('Fixed navigation remains in safe area during scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Simulate scrolling (if content is scrollable)
    await page.evaluate(() => {
      window.scrollBy(0, 100)
    })

    // Navigation buttons should still be in safe area
    const journalBtn = page.getByLabel('Open Journal')
    if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const btnBox = await journalBtn.boundingBox()
      expect(btnBox).not.toBeNull()
      if (btnBox) {
        const bottomSafeArea = 34
        const bottomEdge = btnBox.y + btnBox.height
        expect(bottomEdge).toBeLessThan(844 - bottomSafeArea)
      }
    }
  })
})
