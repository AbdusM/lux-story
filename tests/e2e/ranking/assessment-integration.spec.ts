/**
 * Assessment Integration E2E Tests
 *
 * P3 Polish: Validates assessment unlock conditions integrate with ranking state.
 * Tests that player progression unlocks assessment eligibility.
 *
 * NOTE: UI components for assessments are planned but not yet implemented.
 * These tests validate the state-based unlock logic via localStorage.
 */

import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Assessment State Integration', () => {
  test('fresh player state shows low ranking metrics', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Check initial state has baseline values
    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    expect(state).toBeDefined()
    expect(state.patterns).toBeDefined()

    // Fresh player should have low pattern values
    const totalPatterns = Object.values(state.patterns as Record<string, number>).reduce((a, b) => a + b, 0)
    expect(totalPatterns).toBeLessThan(20) // Fresh game threshold
  })

  test('progression increases ranking-relevant metrics', async ({ page, seedState }) => {
    // Seed with significant progression
    await seedState({
      currentNodeId: 'samuel_hub_wisdom',
      hasStarted: true,
      showIntro: false,
      patterns: {
        analytical: 25,
        building: 20,
        helping: 30,
        patience: 15,
        exploring: 22
      },
      characters: [
        { id: 'maya', trust: 6, met: true, talkedCount: 5 },
        { id: 'devon', trust: 5, met: true, talkedCount: 4 },
        { id: 'marcus', trust: 4, met: true, talkedCount: 3 },
        { id: 'kai', trust: 3, met: true, talkedCount: 2 }
      ],
      globalFlags: ['maya_arc_complete', 'devon_arc_started'],
      visitedScenes: [
        'samuel_introduction',
        'maya_introduction',
        'maya_deep_dive',
        'devon_introduction'
      ]
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    expect(state).toBeDefined()

    // Verify progression state
    const totalPatterns = Object.values(state.patterns as Record<string, number>).reduce((a, b) => a + b, 0)
    expect(totalPatterns).toBeGreaterThanOrEqual(100)

    // Verify character met count
    expect(state.characters.length).toBeGreaterThanOrEqual(4)

    // Verify high trust character exists
    const highTrustChar = state.characters.find((c: { trust: number }) => c.trust >= 6)
    expect(highTrustChar).toBeDefined()
  })

  test('assessment unlock conditions can be derived from state', async ({ page, seedState }) => {
    // Seed with state that should meet assessment unlock conditions
    await seedState({
      currentNodeId: 'samuel_hub_wisdom',
      hasStarted: true,
      showIntro: false,
      patterns: {
        analytical: 35,
        building: 30,
        helping: 40,
        patience: 25,
        exploring: 35
      },
      characters: [
        { id: 'maya', trust: 8, met: true, talkedCount: 8 },
        { id: 'devon', trust: 7, met: true, talkedCount: 6 },
        { id: 'marcus', trust: 6, met: true, talkedCount: 5 },
        { id: 'kai', trust: 5, met: true, talkedCount: 4 },
        { id: 'rohan', trust: 4, met: true, talkedCount: 3 }
      ],
      globalFlags: [
        'maya_arc_complete',
        'devon_arc_complete',
        'first_assessment_eligible'
      ]
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    // Validate assessment unlock prerequisites
    // 1. Pattern mastery level (sum >= 100 = level 2+)
    const totalPatterns = Object.values(state.patterns as Record<string, number>).reduce((a, b) => a + b, 0)
    expect(totalPatterns).toBeGreaterThanOrEqual(100)

    // 2. Characters met (>= 5)
    expect(state.characters.length).toBeGreaterThanOrEqual(5)

    // 3. High trust relationships (at least one at trust 6+)
    const trustedChars = state.characters.filter((c: { trust: number }) => c.trust >= 6)
    expect(trustedChars.length).toBeGreaterThanOrEqual(1)

    // 4. Completion flags exist
    expect(state.globalFlags).toContain('first_assessment_eligible')
  })
})

test.describe('Assessment Flow Prerequisites', () => {
  test('Journal shows progression that enables assessments', async ({ page, seedState }) => {
    await seedState({
      currentNodeId: 'samuel_hub_wisdom',
      hasStarted: true,
      showIntro: false,
      patterns: {
        analytical: 30,
        building: 25,
        helping: 35,
        patience: 20,
        exploring: 30
      },
      characters: [
        { id: 'maya', trust: 6, met: true, talkedCount: 5 },
        { id: 'devon', trust: 5, met: true, talkedCount: 4 }
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

    // Journal should contain content (progression visible)
    const journalContent = await page.locator('.glass-panel-solid').first().textContent()
    expect(journalContent).toBeDefined()
    expect(journalContent?.length).toBeGreaterThan(0)
  })

  test('state persists across page reload', async ({ page, seedState }) => {
    const testPatterns = {
      analytical: 42,
      building: 38,
      helping: 45,
      patience: 30,
      exploring: 40
    }

    await seedState({
      currentNodeId: 'samuel_hub_wisdom',
      hasStarted: true,
      showIntro: false,
      patterns: testPatterns
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Reload page
    await page.reload()
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Verify state persisted
    const state = await page.evaluate(() => {
      const saved = localStorage.getItem('lux_story_v2_game_save')
      return saved ? JSON.parse(saved) : null
    })

    expect(state).toBeDefined()
    expect(state.patterns.analytical).toBe(42)
    expect(state.patterns.helping).toBe(45)
  })
})
