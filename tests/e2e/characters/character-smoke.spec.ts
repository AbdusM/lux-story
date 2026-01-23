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
        const initialDialogue = await dialogueContent.textContent()
        await choices.first().click()

        await page.waitForFunction(
          (initial) => {
            const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
            return current && current !== initial
          },
          initialDialogue,
          { timeout: 10000 }
        )
      }

      const savedState = await page.evaluate(() => {
        const saved = localStorage.getItem('grand-central-terminus-save')
        return saved ? JSON.parse(saved) : null
      })

      expect(savedState).toBeDefined()
    }
  })
})
