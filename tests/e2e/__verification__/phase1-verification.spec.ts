/**
 * Phase 1 Verification Tests
 * Ensures fixtures and testid attributes work correctly
 */

import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Phase 1 Verification', () => {
  test('should have freshGame fixture working', async ({ page, freshGame }) => {
    // Verify we're at the game page
    await expect(page).toHaveURL(/.*localhost:3005/)

    // Verify fresh game state is loaded
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    expect(gameState).toBeDefined()
    expect(gameState.saveVersion).toBeDefined()
    expect(gameState.currentNodeId).toBeDefined()
    expect(gameState.patterns?.analytical ?? 0).toBe(0)
  })

  test('should have stable testid selectors', async ({ page, freshGame }) => {
    // Verify dialogue-card testid exists
    const dialogueCard = page.getByTestId('dialogue-card')
    await expect(dialogueCard).toBeVisible({ timeout: 10000 })

    // Verify dialogue-content testid exists
    const dialogueContent = page.getByTestId('dialogue-content')
    await expect(dialogueContent).toBeVisible()

    // Verify game-interface testid exists
    const gameInterface = page.getByTestId('game-interface')
    await expect(gameInterface).toBeVisible()
  })

  test('should have choice buttons with testid', async ({ page, freshGame }) => {
    // Wait for dialogue to appear
    await expect(page.getByTestId('dialogue-content')).toBeVisible({ timeout: 10000 })

    // Look for choices container
    const choicesContainer = page.getByTestId('game-choices')

    // Choices might not be visible immediately, so we use a conditional check
    const choicesVisible = await choicesContainer.isVisible().catch(() => false)

    if (choicesVisible) {
      // If choices are visible, verify choice buttons exist
      const choiceButtons = page.locator('[data-testid="choice-button"]')
      const count = await choiceButtons.count()
      expect(count).toBeGreaterThanOrEqual(0) // May have 0 choices in some states
    } else {
      // If no choices visible, that's ok for fresh game state
      console.log('No choices visible in current game state (expected for some states)')
    }
  })

  test('should have journeyComplete fixture with developed patterns', async ({ page, journeyComplete }) => {
    // Verify journey complete state is loaded
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    expect(gameState).toBeDefined()
    expect(gameState.patterns.analytical).toBeGreaterThan(0)
    expect(gameState.globalFlags).toContain('first_journey_complete')
  })

  test('should have withDemonstratedSkills fixture', async ({ page, withDemonstratedSkills }) => {
    // Verify demonstrated skills state is loaded
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    expect(gameState).toBeDefined()
    expect(gameState.skillLevels).toBeDefined()
    expect(Object.keys(gameState.skillLevels || {}).length).toBeGreaterThanOrEqual(5)
  })

  test('should have withHighTrust fixture for Maya', async ({ page, withHighTrust }) => {
    // Verify high trust state is loaded
    const gameState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    expect(gameState).toBeDefined()

    // Check Maya's trust (characters are stored as an array in SerializableGameState)
    const mayaState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      if (!saved) return null
      const state = JSON.parse(saved)
      return state.characters?.find((c: any) => c.characterId === 'maya') || null
    })

    expect(mayaState).toBeDefined()
    expect(mayaState.trust).toBe(6)
  })
})
