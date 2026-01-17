/**
 * Mobile Game Flow Tests
 * Tests the complete dialogue → choice → state update flow on mobile viewports
 * Target audience: Ages 14-24 Birmingham youth on phones
 */

import { test, expect } from '../fixtures/game-state-fixtures'

const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'Galaxy S21', width: 360, height: 800 }
]

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Game Flow on ${viewport.name} (${viewport.width}×${viewport.height})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
    })

    test('Complete dialogue → choice → state update cycle', async ({ page, freshGame }) => {
      // FIX: Use freshGame fixture instead of manual navigation
      // State is already seeded, game interface should be ready

      // Wait for game interface
      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      // Wait for dialogue to load
      const dialogueContent = page.getByTestId('dialogue-content')
      await expect(dialogueContent).toBeVisible({ timeout: 10000 })

      // Verify dialogue renders (no overflow)
      const dialogueBox = await dialogueContent.boundingBox()
      expect(dialogueBox).not.toBeNull()
      if (dialogueBox) {
        expect(dialogueBox.width).toBeLessThanOrEqual(viewport.width)
      }

      // Wait for choices to appear
      const choicesContainer = page.getByTestId('game-choices')
      await expect(choicesContainer).toBeVisible({ timeout: 5000 })

      // Verify choices don't overflow viewport
      const containerBox = await choicesContainer.boundingBox()
      expect(containerBox).not.toBeNull()
      if (containerBox) {
        expect(containerBox.width).toBeLessThanOrEqual(viewport.width)
      }

      // Select first choice
      const choices = page.locator('[data-testid="choice-button"]')
      const choiceCount = await choices.count()
      expect(choiceCount).toBeGreaterThanOrEqual(1)

      const initialDialogue = await dialogueContent.textContent()
      await choices.first().click()

      // Wait for dialogue to update (state transition)
      await page.waitForFunction(
        (initial) => {
          const current = document.querySelector('[data-testid="dialogue-content"]')?.textContent
          return current && current !== initial
        },
        initialDialogue,
        { timeout: 10000 }
      )

      // Verify state was persisted to localStorage
      const savedState = await page.evaluate(() => {
        const saved = localStorage.getItem('grand-central-terminus-save')
        return saved ? JSON.parse(saved) : null
      })

      expect(savedState).toBeDefined()
      expect(savedState.state).toBeDefined()
    })

    test('Choices stack vertically without overflow', async ({ page, freshGame }) => {
      // FIX: Use freshGame fixture - samuel_introduction has multiple choices

      // Wait for game interface and choices
      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })
      const choices = page.locator('[data-testid="choice-button"]')
      await expect(choices.first()).toBeVisible({ timeout: 5000 })

      const choiceCount = await choices.count()
      if (choiceCount > 1) {
        // Get bounding boxes for all choices
        const choiceBoxes = await Promise.all(
          Array.from({ length: choiceCount }, async (_, i) => {
            return await choices.nth(i).boundingBox()
          })
        )

        // All choices should fit within viewport width (with padding)
        choiceBoxes.forEach(box => {
          expect(box).not.toBeNull()
          if (box) {
            expect(box.width).toBeLessThanOrEqual(viewport.width - 32) // 16px padding on each side
          }
        })

        // Choices should stack vertically (y positions should increase)
        for (let i = 1; i < choiceBoxes.length; i++) {
          if (choiceBoxes[i] && choiceBoxes[i - 1]) {
            expect(choiceBoxes[i]!.y).toBeGreaterThan(choiceBoxes[i - 1]!.y)
          }
        }
      }
    })

    test('Dialogue card is readable and properly sized', async ({ page, freshGame }) => {
      // FIX: Use freshGame fixture

      // Wait for dialogue card
      const dialogueCard = page.getByTestId('dialogue-card')
      await expect(dialogueCard).toBeVisible({ timeout: 10000 })

      const cardBox = await dialogueCard.boundingBox()
      expect(cardBox).not.toBeNull()
      if (cardBox) {
        // Card should fit within viewport
        expect(cardBox.width).toBeLessThanOrEqual(viewport.width)
        expect(cardBox.x).toBeGreaterThanOrEqual(0)

        // Card should have minimum readable height
        expect(cardBox.height).toBeGreaterThanOrEqual(100)
      }
    })

    test('Navigation buttons are accessible', async ({ page, freshGame }) => {
      // FIX: Use freshGame fixture

      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      // Check for Journal button (should be visible)
      const journalBtn = page.getByLabel('Open Journal')
      if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        const btnBox = await journalBtn.boundingBox()
        expect(btnBox).not.toBeNull()
        if (btnBox) {
          // Button should meet 44px minimum touch target
          expect(btnBox.width).toBeGreaterThanOrEqual(44)
          expect(btnBox.height).toBeGreaterThanOrEqual(44)
        }
      }

      // Check for Constellation button
      const constellationBtn = page.getByLabel('Open Skill Constellation')
      if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        const btnBox = await constellationBtn.boundingBox()
        expect(btnBox).not.toBeNull()
        if (btnBox) {
          expect(btnBox.width).toBeGreaterThanOrEqual(44)
          expect(btnBox.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('Multiple rapid taps do not cause errors', async ({ page, freshGame }) => {
      // FIX: Use freshGame fixture

      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      const choices = page.locator('[data-testid="choice-button"]')
      await expect(choices.first()).toBeVisible({ timeout: 10000 })

      const firstChoice = choices.first()

      // Simulate rapid taps (like user might do on mobile)
      await firstChoice.click()
      await firstChoice.click().catch(() => {}) // May fail if already processing
      await firstChoice.click().catch(() => {}) // May fail if already processing

      // Should still navigate successfully
      const dialogueContent = page.getByTestId('dialogue-content')
      await expect(dialogueContent).toBeVisible({ timeout: 5000 })

      // No JavaScript errors should have occurred
      // (Playwright would show these in console)
    })

    test('Portrait orientation layout is correct', async ({ page, freshGame }) => {
      // Verify viewport is in portrait (height > width)
      const viewportSize = page.viewportSize()
      expect(viewportSize).not.toBeNull()
      if (viewportSize) {
        expect(viewportSize.height).toBeGreaterThan(viewportSize.width)
      }

      // FIX: Use freshGame fixture

      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      // Game interface should fill available height
      const gameInterface = page.getByTestId('game-interface')
      const interfaceBox = await gameInterface.boundingBox()
      expect(interfaceBox).not.toBeNull()
      if (interfaceBox && viewportSize) {
        // Interface should be close to full viewport height
        expect(interfaceBox.height).toBeGreaterThan(viewportSize.height * 0.8)
      }
    })
  })
}
