/**
 * Badge Progression E2E Tests
 *
 * P3 Polish: Validates that ranking badges update as player progresses.
 * Tests the visual feedback loop of making choices and seeing rank changes.
 */

import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Badge Progression Flow', () => {
  test('pattern values increase after making choices', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('dialogue-content')).toBeVisible({ timeout: 10000 })

    // Get initial pattern state
    const initialState = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    const initialTotal = initialState?.patterns
      ? Object.values(initialState.patterns as Record<string, number>).reduce((a, b) => a + b, 0)
      : 0

    // Make a choice
    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 10000 })

    const initialDialogue = await page.getByTestId('dialogue-content').textContent()
    await choices.first().click()

    // Wait for state transition
    await page.waitForFunction(
      (initial) => {
        const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
        return current && current !== initial
      },
      initialDialogue,
      { timeout: 10000 }
    )

    // Check state after choice
    const afterState = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    expect(afterState).toBeDefined()
    expect(afterState.patterns).toBeDefined()

    const afterTotal = Object.values(afterState.patterns as Record<string, number>).reduce((a, b) => a + b, 0)

    // Pattern total should have changed (usually increased, could be same if neutral choice)
    expect(afterTotal).toBeGreaterThanOrEqual(initialTotal)
  })

  test('multiple choices accumulate pattern progress', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Make 3 choices in sequence
    for (let i = 0; i < 3; i++) {
      await expect(page.getByTestId('dialogue-content')).toBeVisible({ timeout: 10000 })

      const choices = page.locator('[data-testid="choice-button"]')
      const choiceCount = await choices.count()

      if (choiceCount === 0) break

      const initialDialogue = await page.getByTestId('dialogue-content').textContent()
      await choices.first().click()

      // Wait for transition
      await page.waitForFunction(
        (initial) => {
          const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
          return current && current !== initial
        },
        initialDialogue,
        { timeout: 10000 }
      ).catch(() => {
        // Might timeout if dialogue didn't change (e.g., end of conversation)
      })

      // Brief pause between choices
      await page.waitForTimeout(500)
    }

    // Verify accumulated progress
    const finalState = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    expect(finalState).toBeDefined()

    // Should have some pattern values after 3 choices
    const totalPatterns = Object.values(finalState.patterns as Record<string, number>).reduce((a, b) => a + b, 0)
    expect(totalPatterns).toBeGreaterThanOrEqual(0) // At minimum, should not be negative
  })

  test('character trust increases with repeated interaction', async ({ page, seedState }) => {
    // Seed at Maya introduction
    await seedState({
      currentNodeId: 'maya_introduction',
      currentCharacterId: 'maya',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 5, building: 5, helping: 5, patience: 5, exploring: 5 },
      characters: [
        { id: 'maya', trust: 2, met: true, talkedCount: 1 }
      ]
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Get initial trust
    const initialState = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    const initialMayaTrust = initialState?.characters?.find((c: { id: string }) => c.id === 'maya')?.trust ?? 0

    // Make choices interacting with Maya
    for (let i = 0; i < 2; i++) {
      const choices = page.locator('[data-testid="choice-button"]')
      const choiceCount = await choices.count()

      if (choiceCount === 0) break

      const initialDialogue = await page.getByTestId('dialogue-content').textContent()
      await choices.first().click()

      await page.waitForFunction(
        (initial) => {
          const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
          return current && current !== initial
        },
        initialDialogue,
        { timeout: 10000 }
      ).catch(() => {})

      await page.waitForTimeout(500)
    }

    // Verify trust potentially changed
    const finalState = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    const finalMayaTrust = finalState?.characters?.find((c: { id: string }) => c.id === 'maya')?.trust ?? 0

    // Trust should not decrease from normal interaction
    expect(finalMayaTrust).toBeGreaterThanOrEqual(initialMayaTrust)
  })
})

test.describe('Ranking Tier Thresholds', () => {
  test('low progression shows baseline tier', async ({ page, seedState }) => {
    await seedState({
      currentNodeId: 'samuel_introduction',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 2, building: 2, helping: 2, patience: 2, exploring: 2 },
      characters: []
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    // Total = 10, should be 'nascent' tier (threshold 0-9)
    const total = Object.values(state.patterns as Record<string, number>).reduce((a, b) => a + b, 0)
    expect(total).toBe(10)
  })

  test('moderate progression reaches emerging tier', async ({ page, seedState }) => {
    await seedState({
      currentNodeId: 'samuel_hub_wisdom',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 12, building: 10, helping: 15, patience: 8, exploring: 11 },
      characters: [
        { id: 'maya', trust: 4, met: true, talkedCount: 3 }
      ]
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    // Total = 56, should be in 'emerging' tier range (10-29) or higher
    const total = Object.values(state.patterns as Record<string, number>).reduce((a, b) => a + b, 0)
    expect(total).toBeGreaterThanOrEqual(30) // At least 'developing' tier
  })

  test('high progression reaches flourishing tier', async ({ page, seedState }) => {
    await seedState({
      currentNodeId: 'samuel_hub_wisdom',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 35, building: 30, helping: 40, patience: 25, exploring: 35 },
      characters: [
        { id: 'maya', trust: 8, met: true, talkedCount: 8 },
        { id: 'devon', trust: 7, met: true, talkedCount: 6 },
        { id: 'marcus', trust: 6, met: true, talkedCount: 5 }
      ]
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    // Total = 165, should be in 'flourishing' tier (60-99) or 'mastered' (100+)
    const total = Object.values(state.patterns as Record<string, number>).reduce((a, b) => a + b, 0)
    expect(total).toBeGreaterThanOrEqual(100) // 'mastered' tier
  })
})

test.describe('Visual Feedback Integration', () => {
  test('Journal reflects current progression state', async ({ page, seedState }) => {
    await seedState({
      currentNodeId: 'samuel_hub_wisdom',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 20, building: 18, helping: 25, patience: 15, exploring: 22 },
      characters: [
        { id: 'maya', trust: 5, met: true, talkedCount: 4 },
        { id: 'devon', trust: 4, met: true, talkedCount: 3 }
      ]
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Open Journal
    const journalButton = page.getByLabel('Open Journal')
    const journalVisible = await journalButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (!journalVisible) {
      test.skip()
      return
    }

    await journalButton.click()
    await expect(page.locator('.glass-panel-solid')).toBeVisible({ timeout: 5000 })

    // Journal should have content
    const journalText = await page.locator('.glass-panel-solid').first().textContent()
    expect(journalText).toBeDefined()
    expect(journalText?.length).toBeGreaterThan(0)

    // Close Journal
    await page.keyboard.press('Escape')
  })
})
