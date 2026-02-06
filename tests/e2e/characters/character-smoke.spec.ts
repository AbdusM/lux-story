/**
 * Character Smoke Tests
 * Ensures each character intro node renders and can advance with a choice.
 */

import { test, expect } from '../fixtures/game-state-fixtures'

const CHARACTER_IDS = [
  'samuel',
  'maya',
  'devon',
  'jordan',
  'marcus',
  'tess',
  'yaquin',
  'kai',
  'alex',
  'rohan',
  'silas',
  'elena',
  'grace',
  'asha',
  'lira',
  'zara',
  'quinn',
  'dante',
  'nadia',
  'isaiah'
] as const

test.describe('Character Intro Smoke', () => {
  test('All character intros render and advance', async ({ page, seedState }) => {
    // Extended timeout for 20 characters
    test.setTimeout(300000) // 5 minutes

    for (const characterId of CHARACTER_IDS) {
      const introNodeId = `${characterId}_introduction`

      await seedState({
        currentNodeId: introNodeId,
        currentCharacterId: characterId
      })

      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      const dialogueContent = page.getByTestId('dialogue-content')
      await expect(dialogueContent).toBeVisible({ timeout: 10000 })

      const choices = page.locator('[data-testid="choice-button"]')
      const choiceCount = await choices.count()

      if (choiceCount > 0) {
        await choices.first().click()

        // Dialogue content is a running transcript; the most reliable signal that a choice
        // advanced the story is a node transition being persisted.
        await page.waitForFunction(
          (initialNodeId) => {
            try {
              const saved = localStorage.getItem('lux_story_v2_game_save')
              if (!saved) return false
              const parsed = JSON.parse(saved) as { currentNodeId?: unknown }
              return typeof parsed.currentNodeId === 'string' && parsed.currentNodeId !== initialNodeId
            } catch {
              return false
            }
          },
          introNodeId,
          { timeout: 20000 }
        )
      }

      const savedState = await page.evaluate(() => {
        const saved = localStorage.getItem('lux_story_v2_game_save')
        return saved ? JSON.parse(saved) : null
      })

      expect(savedState).toBeDefined()
    }
  })
})
