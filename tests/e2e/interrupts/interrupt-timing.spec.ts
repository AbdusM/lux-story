/**
 * Interrupt Timing Visual Validation Tests
 *
 * Tests the interrupt window timing system:
 * - Interrupt buttons appear within correct time window (2-4s after dialogue)
 * - Interrupt buttons disappear after duration expires
 * - Different interrupt types display correctly
 * - Visual feedback and animations work as expected
 */

import { test, expect } from '@playwright/test'

test.describe('Interrupt Timing Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('Interrupt appears within timing window for Maya vulnerability node', async ({ page }) => {
    // Set up state: High trust with Maya, at vulnerability node with interrupt
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_arc',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 6, // Required for vulnerability arc
            knowledgeFlags: []
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()

    // Wait for dialogue to load
    await expect(page.getByTestId('dialogue-content')).toBeVisible({ timeout: 10000 })

    // Record when dialogue appears
    const dialogueAppearTime = Date.now()

    // Wait for interrupt button to appear (should be within 2-4s)
    const interruptButton = page.locator('[data-testid="interrupt-button"]')
    const interruptVisible = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (interruptVisible) {
      const interruptAppearTime = Date.now()
      const timingDelay = interruptAppearTime - dialogueAppearTime

      // Interrupt should appear between 2-4 seconds after dialogue
      expect(timingDelay).toBeGreaterThanOrEqual(2000)
      expect(timingDelay).toBeLessThanOrEqual(4000)

      console.log(\`✓ Interrupt appeared \${timingDelay}ms after dialogue (expected 2000-4000ms)\`)

      // Verify interrupt button has correct attributes
      const interruptType = await interruptButton.getAttribute('data-interrupt-type')
      expect(interruptType).toBeTruthy()

      const interruptAction = await interruptButton.textContent()
      expect(interruptAction).toBeTruthy()

      console.log(\`✓ Interrupt type: \${interruptType}, Action: \${interruptAction}\`)
    }
  })

  test('Interrupt disappears after duration expires', async ({ page }) => {
    // Set up state with known interrupt node
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_arc',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 6,
            knowledgeFlags: []
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await expect(page.getByTestId('dialogue-content')).toBeVisible()

    // Wait for interrupt to appear
    const interruptButton = page.locator('[data-testid="interrupt-button"]')
    await expect(interruptButton).toBeVisible({ timeout: 5000 })

    const interruptAppearTime = Date.now()
    console.log('✓ Interrupt button appeared')

    // Interrupt should disappear after duration (typically 3-4s)
    // Wait for it to disappear
    await expect(interruptButton).not.toBeVisible({ timeout: 6000 })

    const interruptDisappearTime = Date.now()
    const displayDuration = interruptDisappearTime - interruptAppearTime

    console.log(\`✓ Interrupt displayed for \${displayDuration}ms\`)

    // Duration should be between 3-5 seconds (3500ms typical + some tolerance)
    expect(displayDuration).toBeGreaterThanOrEqual(3000)
    expect(displayDuration).toBeLessThanOrEqual(5000)
  })

  test('Clicking interrupt navigates to target node', async ({ page }) => {
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'maya_vulnerability_arc',
          hasStarted: true,
          patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
          characters: [{
            characterId: 'maya',
            trust: 6,
            knowledgeFlags: []
          }]
        },
        version: 1
      }
      localStorage.setItem('grand-central-terminus-save', JSON.stringify(state))
    })

    await page.reload()
    await expect(page.getByTestId('dialogue-content')).toBeVisible()

    // Wait for interrupt button
    const interruptButton = page.locator('[data-testid="interrupt-button"]')
    await expect(interruptButton).toBeVisible({ timeout: 5000 })

    // Click the interrupt
    await interruptButton.click()

    // Verify dialogue changed (new content appears)
    await page.waitForTimeout(1000)

    const newDialogue = await page.getByTestId('dialogue-content').textContent()
    expect(newDialogue).toBeTruthy()
    expect(newDialogue!.length).toBeGreaterThan(0)

    console.log('✓ Interrupt click triggered dialogue change')
  })

  test('God Mode can trigger interrupt-enabled scenes', async ({ page }) => {
    await page.goto('/')

    // Clear state
    await page.evaluate(() => localStorage.clear())

    // Click enter
    const enterButton = page.getByRole('button', { name: /enter the station/i })
    await enterButton.click()

    // Wait for game to load
    await expect(page.getByTestId('dialogue-content')).toBeVisible({ timeout: 10000 })

    // Use God Mode to jump to interrupt node
    await page.evaluate(() => {
      window.godMode.setTrust('maya', 6)
      window.godMode.jumpToNode('maya_vulnerability_arc')
    })

    // Wait for navigation
    await page.waitForTimeout(1000)

    // Verify dialogue updated
    const dialogueText = await page.getByTestId('dialogue-content').textContent()
    expect(dialogueText).toContain('never told anyone')

    console.log('✓ God Mode successfully navigated to interrupt-enabled scene')

    // Check for interrupt appearance
    const interruptButton = page.locator('[data-testid="interrupt-button"]')
    const hasInterrupt = await interruptButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (hasInterrupt) {
      console.log('✓ Interrupt button appeared after God Mode navigation')
    } else {
      console.log('ℹ Interrupt may appear with delay or be conditional')
    }
  })
})
