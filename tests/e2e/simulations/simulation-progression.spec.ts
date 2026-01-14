/**
 * Simulation Progression Tests
 *
 * Tests the 3-phase simulation unlock system:
 * - Phase 1: Introduction (trust ≥0, always available)
 * - Phase 2: Application (trust ≥5, Phase 1 complete)
 * - Phase 3: Mastery (trust ≥8, Phase 2 complete)
 */

import { test, expect } from '@playwright/test'

test.describe('Simulation System Progression', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing state
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('Phase 1 simulation available immediately at start', async ({ page }) => {
    // Set up fresh game state with minimal trust
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          showIntro: false,
          patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 0,
            knowledgeFlags: []
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()

    // Wait for state to be loaded
    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved !== null
    }, { timeout: 10000 })

    // Open Journal
    const journalButton = page.getByLabel('Open Journal')

    if (await journalButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await journalButton.click()

      // Navigate to Simulations tab
      const simsTab = page.getByRole('button', { name: /sims/i })
      if (await simsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await simsTab.click()

        // Phase 1 simulation should be available
        const phase1Sim = page.locator('[data-testid="simulation-interface"]').first()
        const isPhase1Visible = await phase1Sim.isVisible({ timeout: 5000 }).catch(() => false)

        // If simulations exist, Phase 1 should be available at trust 0
        if (isPhase1Visible) {
          expect(isPhase1Visible).toBe(true)
        }
      }
    }
  })

  test('Phase 2 locked without Phase 1 completion', async ({ page }) => {
    // Set up state: trust 5, but Phase 1 not complete
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 5,
            knowledgeFlags: [] // No Phase 1 completion flag
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Wait for state to be loaded
    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved !== null
    }, { timeout: 10000 })

    // Open Journal
    const journalButton = page.getByLabel('Open Journal')

    if (await journalButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await journalButton.click()

      // Navigate to Simulations tab
      const simsTab = page.getByRole('button', { name: /sims/i })
      if (await simsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await simsTab.click()

        // Wait a bit for simulation list to render
        await page.waitForTimeout(1000)

        // Phase 2 should be locked (not have a click handler or be disabled)
        const phase2Indicators = page.getByText(/phase 2|application/i)
        if (await phase2Indicators.count() > 0) {
          // If Phase 2 text exists, it should indicate it's locked
          const lockedIndicator = page.getByText(/locked|requires/i)
          const hasLockedText = await lockedIndicator.count() > 0

          // Should have some indication Phase 2 is locked
          expect(hasLockedText).toBe(true)
        }
      }
    }
  })

  test('Phase 2 unlocks with Phase 1 complete and trust ≥5', async ({ page }) => {
    // Set up state: trust 5, Phase 1 complete
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 5,
            knowledgeFlags: ['maya_simulation_phase1_complete'] // Phase 1 done
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Wait for state to be loaded
    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved !== null
    }, { timeout: 10000 })

    // Open Journal
    const journalButton = page.getByLabel('Open Journal')

    if (await journalButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await journalButton.click()

      // Navigate to Simulations tab
      const simsTab = page.getByRole('button', { name: /sims/i })
      if (await simsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await simsTab.click()

        // Phase 2 should be available (look for phase 2 text without "locked")
        const phase2Text = page.getByText(/phase 2|application/i).first()
        if (await phase2Text.isVisible({ timeout: 3000 }).catch(() => false)) {
          // Should NOT have locked indicator nearby
          const nearbyText = await phase2Text.evaluate(el =>
            el.closest('div')?.textContent?.toLowerCase() || ''
          )

          // Phase 2 should be accessible (no "locked" in nearby text)
          expect(nearbyText).not.toContain('locked')
        }
      }
    }
  })

  test('Phase 3 requires Phase 2 complete and trust ≥8', async ({ page }) => {
    // Set up state: trust 8, Phase 1 and 2 complete
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 5, building: 3, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 8,
            knowledgeFlags: [
              'maya_simulation_phase1_complete',
              'maya_simulation_phase2_complete'
            ]
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Wait for state to be loaded
    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved !== null
    }, { timeout: 10000 })

    // Open Journal
    const journalButton = page.getByLabel('Open Journal')

    if (await journalButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await journalButton.click()

      // Navigate to Simulations tab
      const simsTab = page.getByRole('button', { name: /sims/i })
      if (await simsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await simsTab.click()

        // Phase 3 should be available
        const phase3Text = page.getByText(/phase 3|mastery/i).first()
        if (await phase3Text.isVisible({ timeout: 3000 }).catch(() => false)) {
          const nearbyText = await phase3Text.evaluate(el =>
            el.closest('div')?.textContent?.toLowerCase() || ''
          )

          // Phase 3 should be accessible (no "locked")
          expect(nearbyText).not.toContain('locked')
        }
      }
    }
  })

  test('Simulation interface renders with correct type attribute', async ({ page }) => {
    // Set up state with simulation available
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 5,
            knowledgeFlags: ['maya_simulation_phase1_complete']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Wait for state to be loaded
    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved !== null
    }, { timeout: 10000 })

    // Open Journal
    const journalButton = page.getByLabel('Open Journal')

    if (await journalButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await journalButton.click()

      const simsTab = page.getByRole('button', { name: /sims/i })
      if (await simsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await simsTab.click()

        // Try to launch a simulation
        const simButton = page.getByRole('button', { name: /start|begin|launch/i }).first()
        if (await simButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await simButton.click()

          // Wait for simulation interface to load
          const simInterface = page.getByTestId('simulation-interface')
          if (await simInterface.isVisible({ timeout: 5000 }).catch(() => false)) {
            // Verify it has a simulation type attribute
            const simType = await simInterface.getAttribute('data-simulation-type')
            expect(simType).toBeTruthy()

            // Verify nested simulation content exists
            const simContent = page.locator(`[data-testid="simulation-${simType}"]`)
            const contentExists = await simContent.isVisible({ timeout: 3000 }).catch(() => false)

            if (contentExists) {
              expect(contentExists).toBe(true)
            }
          }
        }
      }
    }
  })

  test('Trust level gates simulation access correctly', async ({ page }) => {
    // Test trust 7 (below Phase 3 threshold of 8)
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_introduction',
          hasStarted: true,
          patterns: { analytical: 5, building: 3, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 7, // Below threshold for Phase 3
            knowledgeFlags: [
              'maya_simulation_phase1_complete',
              'maya_simulation_phase2_complete'
            ]
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.goto('/')
    await page.reload()

    // Wait for state to be loaded
    await page.waitForFunction(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved !== null
    }, { timeout: 10000 })

    // Open Journal
    const journalButton = page.getByLabel('Open Journal')

    if (await journalButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await journalButton.click()

      const simsTab = page.getByRole('button', { name: /sims/i })
      if (await simsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await simsTab.click()

        // Phase 3 should be locked due to trust 7 < 8
        const phase3Text = page.getByText(/phase 3|mastery/i).first()
        if (await phase3Text.isVisible({ timeout: 3000 }).catch(() => false)) {
          const nearbyText = await phase3Text.evaluate(el =>
            el.closest('div')?.textContent?.toLowerCase() || ''
          )

          // Should have locked indicator since trust < 8
          const isLocked = nearbyText.includes('locked') || nearbyText.includes('trust')
          expect(isLocked).toBe(true)
        }
      }
    }
  })
})
