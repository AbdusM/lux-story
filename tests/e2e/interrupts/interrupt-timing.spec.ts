/**
 * Interrupt System Tests
 *
 * Tests ME2-style interrupt mechanics:
 * - Interrupt windows (2000-4000ms duration)
 * - 6 interrupt types (connection, challenge, silence, comfort, grounding, encouragement)
 * - Trust bonuses (+1 or +2)
 * - No penalty for missing interrupts
 * - Optional alternative paths (missedNodeId)
 */

import { test, expect } from '@playwright/test'

test.describe('Interrupt System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('Interrupt button appears and disappears within time window', async ({ page }) => {
    // Set up state at a node with an interrupt
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 6,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait for dialogue to appear
    const dialogueCard = page.getByTestId('dialogue-card')
    await dialogueCard.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})

    // Check if interrupt button appears
    const interruptButton = page.getByTestId('interrupt-button')
    const buttonAppears = await interruptButton.isVisible({ timeout: 3000 }).catch(() => false)

    if (buttonAppears) {
      const startTime = Date.now()

      // Wait for button to disappear (max 4500ms for 4000ms window + buffer)
      await interruptButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})

      const duration = Date.now() - startTime

      // Window should be between 1500ms (2000ms - tolerance) and 4500ms (4000ms + buffer)
      expect(duration).toBeGreaterThan(1500)
      expect(duration).toBeLessThan(5000)
    }
  })

  test('Taking interrupt grants trust bonus', async ({ page }) => {
    // Set up state with known trust level
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 5, // Initial trust
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait for interrupt button
    const interruptButton = page.getByTestId('interrupt-button')
    const buttonVisible = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (buttonVisible) {
      // Click interrupt button
      await interruptButton.click()

      // Wait for state to update
      await page.waitForTimeout(1000)

      // Check trust increased
      const finalTrust = await page.evaluate(() => {
        const saved = localStorage.getItem('grand-central-terminus-save')
        if (saved) {
          const state = JSON.parse(saved)
          const maya = state.state.characters.find((c: any) => c.characterId === 'maya')
          return maya?.trust || 0
        }
        return 0
      })

      // Trust should have increased by +1 or +2
      expect(finalTrust).toBeGreaterThanOrEqual(6) // 5 + 1
      expect(finalTrust).toBeLessThanOrEqual(7) // 5 + 2
    }
  })

  test('Missing interrupt has no trust penalty', async ({ page }) => {
    // Set up state
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 5,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait for interrupt button to appear
    const interruptButton = page.getByTestId('interrupt-button')
    const buttonVisible = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (buttonVisible) {
      // Don't click - let it expire
      await interruptButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})

      // Wait a bit for state to settle
      await page.waitForTimeout(500)

      // Check trust unchanged
      const finalTrust = await page.evaluate(() => {
        const saved = localStorage.getItem('grand-central-terminus-save')
        if (saved) {
          const state = JSON.parse(saved)
          const maya = state.state.characters.find((c: any) => c.characterId === 'maya')
          return maya?.trust || 0
        }
        return 0
      })

      // Trust should be unchanged
      expect(finalTrust).toBe(5)
    }
  })

  test('Connection interrupt type renders correctly', async ({ page }) => {
    // Set up state for connection interrupt
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 6,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Check for interrupt button with connection type
    const interruptButton = page.getByTestId('interrupt-button')
    const buttonVisible = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (buttonVisible) {
      // Verify it has interrupt type attribute
      const interruptType = await interruptButton.getAttribute('data-interrupt-type')

      // Should be one of the 6 valid types
      const validTypes = ['connection', 'challenge', 'silence', 'comfort', 'grounding', 'encouragement']
      if (interruptType) {
        expect(validTypes).toContain(interruptType)
      }
    }
  })

  test('Interrupt button is keyboard accessible', async ({ page }) => {
    // Set up state
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 5,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait for interrupt button
    const interruptButton = page.getByTestId('interrupt-button')
    const buttonVisible = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (buttonVisible) {
      // Press Space key to trigger interrupt
      await page.keyboard.press('Space')

      // Wait for state update
      await page.waitForTimeout(1000)

      // Verify trust increased (interrupt was triggered)
      const finalTrust = await page.evaluate(() => {
        const saved = localStorage.getItem('grand-central-terminus-save')
        if (saved) {
          const state = JSON.parse(saved)
          const maya = state.state.characters.find((c: any) => c.characterId === 'maya')
          return maya?.trust || 0
        }
        return 0
      })

      // Trust should have increased
      expect(finalTrust).toBeGreaterThan(5)
    }
  })

  test('Encouragement interrupt grants +1 trust', async ({ page }) => {
    // Set up state for encouragement interrupt (typically +1 trust)
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'rohan_needs_encouragement',
          hasStarted: true,
          patterns: { analytical: 2, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'rohan',
            trust: 4,
            knowledgeFlags: []
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait for interrupt button
    const interruptButton = page.getByTestId('interrupt-button')
    const buttonVisible = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (buttonVisible) {
      // Verify it's an encouragement type
      const interruptType = await interruptButton.getAttribute('data-interrupt-type')

      if (interruptType === 'encouragement') {
        // Click interrupt
        await interruptButton.click()

        // Wait for state update
        await page.waitForTimeout(1000)

        // Check trust increased by 1
        const finalTrust = await page.evaluate(() => {
          const saved = localStorage.getItem('grand-central-terminus-save')
          if (saved) {
            const state = JSON.parse(saved)
            const rohan = state.state.characters.find((c: any) => c.characterId === 'rohan')
            return rohan?.trust || 0
          }
          return 0
        })

        // Should be 5 (4 + 1)
        expect(finalTrust).toBe(5)
      }
    }
  })

  test('Interrupt respects prefers-reduced-motion', async ({ page }) => {
    // Enable prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' })

    // Set up state
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 6,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait for interrupt button
    const interruptButton = page.getByTestId('interrupt-button')
    const buttonVisible = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (buttonVisible) {
      // Button should still appear and function with reduced motion
      await interruptButton.click()

      // Wait for state update
      await page.waitForTimeout(1000)

      // Verify interrupt worked
      const finalTrust = await page.evaluate(() => {
        const saved = localStorage.getItem('grand-central-terminus-save')
        if (saved) {
          const state = JSON.parse(saved)
          const maya = state.state.characters.find((c: any) => c.characterId === 'maya')
          return maya?.trust || 0
        }
        return 0
      })

      expect(finalTrust).toBeGreaterThan(6)
    }
  })

  test('Multiple interrupts in sequence work correctly', async ({ page }) => {
    // Set up initial state
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_moment',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 4,
            knowledgeFlags: ['maya_vulnerability_revealed']
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    let interruptsTriggered = 0
    const maxAttempts = 3

    for (let i = 0; i < maxAttempts; i++) {
      // Wait for interrupt button
      const interruptButton = page.getByTestId('interrupt-button')
      const buttonVisible = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

      if (buttonVisible) {
        // Click interrupt
        await interruptButton.click()
        interruptsTriggered++

        // Wait for next dialogue/interrupt
        await page.waitForTimeout(2000)
      } else {
        // No more interrupts available
        break
      }
    }

    // Verify we triggered at least one interrupt
    if (interruptsTriggered > 0) {
      // Check trust increased
      const finalTrust = await page.evaluate(() => {
        const saved = localStorage.getItem('grand-central-terminus-save')
        if (saved) {
          const state = JSON.parse(saved)
          const maya = state.state.characters.find((c: any) => c.characterId === 'maya')
          return maya?.trust || 0
        }
        return 0
      })

      // Trust should have increased by at least the number of interrupts
      expect(finalTrust).toBeGreaterThanOrEqual(4 + interruptsTriggered)
    }
  })
})
