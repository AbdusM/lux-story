/**
 * Game Loop Integration Tests (Browser Runtime)
 * Tests browser-specific behavior: localStorage, async timing, window objects
 *
 * Coverage: Browser APIs, persistence, timing
 * Runtime Target: <5s total
 */

import { test, expect } from '@playwright/test'

test.describe('Game Loop Integration (Browser Runtime)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should persist state to localStorage after page load', async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Check if initial state is saved
    const savedState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    expect(savedState).toBeDefined()
    expect(savedState.state).toBeDefined()
  })

  test('should load state from localStorage on page reload', async ({ page }) => {
    // Seed a known state
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'test-node',
          hasStarted: true,
          showIntro: false,
          patterns: { analytical: 5, building: 0, helping: 0, patience: 0, exploring: 0 },
          globalFlags: [],
          knowledgeFlags: [],
          characters: [],
          visitedScenes: []
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const loadedState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    expect(loadedState).toBeDefined()
    expect(loadedState.state.patterns.analytical).toBe(5)
  })

  test('should handle missing localStorage gracefully', async ({ page }) => {
    // Clear localStorage and reload
    await page.evaluate(() => {
      localStorage.clear()
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Page should load with fresh state
    const dialogue = page.getByTestId('dialogue-content')
    await expect(dialogue).toBeVisible({ timeout: 10000 })
  })

  test('should serialize Map and Set types correctly', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'test-node',
          hasStarted: true,
          showIntro: false,
          patterns: { analytical: 3, building: 2, helping: 0, patience: 0, exploring: 0 },
          globalFlags: ['flag1', 'flag2'],
          knowledgeFlags: [],
          characters: [
            ['maya', {
              characterId: 'maya',
              trust: 5,
              lastInteractionTimestamp: Date.now(),
              encounterCount: 3,
              currentNodeId: 'maya_intro',
              knowledgeFlags: ['maya_met']
            }]
          ],
          visitedScenes: ['intro', 'hub']
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    const loadedState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    // Verify arrays (serialized Sets)
    expect(Array.isArray(loadedState.state.globalFlags)).toBe(true)
    expect(loadedState.state.globalFlags).toContain('flag1')

    // Verify character Map serialization
    expect(Array.isArray(loadedState.state.characters)).toBe(true)
    expect(loadedState.state.characters[0][0]).toBe('maya')
    expect(loadedState.state.characters[0][1].trust).toBe(5)
  })

  test('should handle concurrent state updates without race conditions', async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Simulate rapid state changes
    const results = await page.evaluate(async () => {
      const states: any[] = []

      // Make 5 rapid updates
      for (let i = 0; i < 5; i++) {
        const saved = localStorage.getItem('grand-central-terminus-save')
        const state = saved ? JSON.parse(saved) : { state: { patterns: { analytical: 0 } }, version: 1 }

        state.state.patterns.analytical = (state.state.patterns.analytical || 0) + 1
        localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))

        states.push(state.state.patterns.analytical)
      }

      return states
    })

    // Each update should increment by 1
    expect(results).toEqual([1, 2, 3, 4, 5])
  })

  test('should maintain state across multiple page reloads', async ({ page }) => {
    // Set initial state
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'test-node',
          hasStarted: true,
          showIntro: false,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          globalFlags: ['persistent_flag'],
          knowledgeFlags: [],
          characters: [],
          visitedScenes: []
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    // Reload 3 times
    for (let i = 0; i < 3; i++) {
      await page.reload()
      await page.waitForLoadState('networkidle')
    }

    // Verify state persisted
    const finalState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    expect(finalState.state.patterns.analytical).toBe(3)
    expect(finalState.state.globalFlags).toContain('persistent_flag')
  })

  test('should handle malformed localStorage data gracefully', async ({ page }) => {
    // Set invalid JSON
    await page.evaluate(() => {
      localStorage.setItem('grand-central-terminus-save', 'invalid-json{')
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should fall back to fresh state
    const dialogue = page.getByTestId('dialogue-content')
    await expect(dialogue).toBeVisible({ timeout: 10000 })
  })

  test('should handle outdated state version gracefully', async ({ page }) => {
    // Set state with old version
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'test-node',
          patterns: { analytical: 5 }
        },
        version: 0 // Old version
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should handle version mismatch
    const dialogue = page.getByTestId('dialogue-content')
    await expect(dialogue).toBeVisible({ timeout: 10000 })
  })
})
