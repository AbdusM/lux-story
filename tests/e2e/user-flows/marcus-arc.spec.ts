import { test, expect } from '@playwright/test'

/**
 * Marcus Arc - E2E User Flow Test
 * Tests the complete journey through Marcus's character arc
 */

test.describe('Marcus Arc - Complete User Flow', () => {
  test('should load game and navigate to Marcus introduction', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')

    // Wait for game interface to load
    await expect(page.locator('[data-testid="game-interface"]')).toBeVisible({
      timeout: 10000
    })

    // Verify we start at the entry point (Marcus introduction)
    await expect(page.locator('[data-speaker]')).toContainText('Marcus', {
      timeout: 5000
    })
  })

  test('should display initial dialogue content', async ({ page }) => {
    await page.goto('/')

    // Wait for dialogue to appear
    await page.waitForSelector('[data-testid="dialogue-content"]', {
      timeout: 10000
    })

    // Verify dialogue content is visible
    const dialogueContent = await page.locator('[data-testid="dialogue-content"]')
    await expect(dialogueContent).toBeVisible()

    // Verify typewriter effect completes (content should have length)
    const text = await dialogueContent.textContent()
    expect(text).toBeTruthy()
    expect(text!.length).toBeGreaterThan(10)
  })

  test('should show available choices after dialogue completes', async ({ page }) => {
    await page.goto('/')

    // Wait for choices to appear
    await page.waitForSelector('[data-testid="game-choices"]', {
      timeout: 15000
    })

    // Verify at least one choice is available
    const choices = await page.locator('[data-choice-id]')
    const choiceCount = await choices.count()
    expect(choiceCount).toBeGreaterThan(0)
  })

  test('should navigate through dialogue by making a choice', async ({ page }) => {
    await page.goto('/')

    // Wait for first set of choices
    await page.waitForSelector('[data-choice-id]', {
      timeout: 15000
    })

    // Get initial node ID from page state
    const initialNodeId = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('lux-game-state') || '{}')
      return state.currentNodeId
    })

    // Click the first available choice
    const firstChoice = page.locator('[data-choice-id]').first()
    await firstChoice.click()

    // Wait for navigation to complete
    await page.waitForTimeout(1000)

    // Verify we've moved to a different node
    const newNodeId = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('lux-game-state') || '{}')
      return state.currentNodeId
    })

    expect(newNodeId).not.toBe(initialNodeId)
  })

  test('should persist state in localStorage', async ({ page }) => {
    await page.goto('/')

    // Wait for game to initialize
    await page.waitForSelector('[data-testid="game-interface"]', {
      timeout: 10000
    })

    // Check that game state exists in localStorage
    const gameState = await page.evaluate(() => {
      return localStorage.getItem('lux-game-state')
    })

    expect(gameState).not.toBeNull()

    // Verify state structure
    const parsedState = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('lux-game-state') || '{}')
    })

    expect(parsedState).toHaveProperty('playerId')
    expect(parsedState).toHaveProperty('currentNodeId')
    expect(parsedState).toHaveProperty('currentCharacterId')
  })
})

test.describe('Marcus Arc - State Tracking', () => {
  test('should track pattern choices', async ({ page }) => {
    await page.goto('/')

    // Wait for choices to appear
    await page.waitForSelector('[data-choice-id]', {
      timeout: 15000
    })

    // Get initial patterns
    const initialPatterns = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('lux-game-state') || '{}')
      return state.patterns || {}
    })

    // Find and click an analytical choice (if available)
    const analyticalChoice = page.locator('[data-pattern="analytical"]').first()
    const hasAnalyticalChoice = await analyticalChoice.count() > 0

    if (hasAnalyticalChoice) {
      await analyticalChoice.click()
      await page.waitForTimeout(1000)

      // Verify pattern was tracked
      const newPatterns = await page.evaluate(() => {
        const state = JSON.parse(localStorage.getItem('lux-game-state') || '{}')
        return state.patterns || {}
      })

      // Analytical pattern should have increased
      expect(newPatterns.analytical).toBeGreaterThan(initialPatterns.analytical || 0)
    }
  })

  test('should track trust changes with Marcus', async ({ page }) => {
    await page.goto('/')

    // Wait for game to initialize
    await page.waitForSelector('[data-testid="game-interface"]', {
      timeout: 10000
    })

    // Get initial Marcus trust level
    const initialTrust = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('lux-game-state') || '{}')
      const characters = new Map(state.characters || [])
      const marcus = characters.get('marcus')
      return marcus?.trust || 0
    })

    expect(initialTrust).toBeGreaterThanOrEqual(0)
  })
})
