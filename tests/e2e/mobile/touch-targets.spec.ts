/**
 * Touch Target Validation Tests
 * Validates that all interactive elements meet the 44px minimum touch target size
 * Reference: Apple Human Interface Guidelines
 * https://developer.apple.com/design/human-interface-guidelines/layout
 */

import { test, expect } from '@playwright/test'

const MINIMUM_TOUCH_TARGET = 44 // Apple HIG recommendation

test.describe('Touch Target Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Test on smallest viewport (worst case)
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Choice buttons meet 44px minimum', async ({ page }) => {
    // Clear state and enter game
    await page.evaluate(() => localStorage.removeItem('grand-central-terminus-save'))
    await page.reload()
    await page.waitForLoadState('networkidle')

    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    // Wait for game interface and choices
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })
    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 10000 })

    const choiceCount = await choices.count()
    expect(choiceCount).toBeGreaterThan(0)

    // Check each choice button
    for (let i = 0; i < choiceCount; i++) {
      const choiceBox = await choices.nth(i).boundingBox()
      expect(choiceBox).not.toBeNull()
      if (choiceBox) {
        expect(choiceBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
        expect(choiceBox.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }
    }
  })

  test('Navigation buttons meet 44px minimum', async ({ page }) => {
    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Check Journal button
    const journalBtn = page.getByLabel('Open Journal')
    if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const btnBox = await journalBtn.boundingBox()
      expect(btnBox).not.toBeNull()
      if (btnBox) {
        expect(btnBox.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
        expect(btnBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }
    }

    // Check Constellation button
    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const btnBox = await constellationBtn.boundingBox()
      expect(btnBox).not.toBeNull()
      if (btnBox) {
        expect(btnBox.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
        expect(btnBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }
    }
  })

  test('Enter Station button meets 44px minimum', async ({ page }) => {
    // Check the initial entry button
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      const btnBox = await enterButton.boundingBox()
      expect(btnBox).not.toBeNull()
      if (btnBox) {
        expect(btnBox.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
        expect(btnBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }
    }
  })

  test('Constellation panel close button meets 44px minimum', async ({ page }) => {
    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Open constellation panel
    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await constellationBtn.click()

      // Wait for dialog to open
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible({ timeout: 5000 })

      // Check close button
      const closeBtn = page.getByLabel(/close/i)
      const closeBtnBox = await closeBtn.boundingBox()
      expect(closeBtnBox).not.toBeNull()
      if (closeBtnBox) {
        expect(closeBtnBox.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
        expect(closeBtnBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }
    }
  })

  test('Constellation tab buttons meet 44px minimum', async ({ page }) => {
    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Open constellation panel
    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await constellationBtn.click()

      // Wait for dialog to open
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible({ timeout: 5000 })

      // Check People tab
      const peopleTab = page.getByRole('tab', { name: /people/i })
      const peopleTabBox = await peopleTab.boundingBox()
      expect(peopleTabBox).not.toBeNull()
      if (peopleTabBox) {
        expect(peopleTabBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }

      // Check Skills tab
      const skillsTab = page.getByRole('tab', { name: /skills/i })
      const skillsTabBox = await skillsTab.boundingBox()
      expect(skillsTabBox).not.toBeNull()
      if (skillsTabBox) {
        expect(skillsTabBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }
    }
  })

  test('Cluster filter chips meet 44px minimum', async ({ page }) => {
    // Seed state with demonstrated skills
    await page.evaluate(() => {
      const state = {
        state: {
          currentNodeId: 'samuel_introduction',
          hasStarted: true,
          showIntro: false,
          patterns: { analytical: 3, building: 2, helping: 0, patience: 0, exploring: 0 },
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

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Open constellation panel
    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await constellationBtn.click()

      // Wait for dialog and switch to Skills tab
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible({ timeout: 5000 })

      const skillsTab = page.getByRole('tab', { name: /skills/i })
      await skillsTab.click()
      await expect(skillsTab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 })

      // Check filter chips
      const allChip = page.getByRole('button', { name: 'All' })
      await expect(allChip).toBeVisible({ timeout: 3000 })

      const chipBox = await allChip.boundingBox()
      expect(chipBox).not.toBeNull()
      if (chipBox) {
        expect(chipBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }

      // Check Mind chip
      const mindChip = page.getByRole('button', { name: 'Mind' })
      const mindChipBox = await mindChip.boundingBox()
      expect(mindChipBox).not.toBeNull()
      if (mindChipBox) {
        expect(mindChipBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
      }
    }
  })

  test('Journal panel close button meets 44px minimum', async ({ page }) => {
    // Enter the game
    const enterButton = page.getByRole('button', { name: /enter.*station/i })
    if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await enterButton.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    // Open journal panel
    const journalBtn = page.getByLabel('Open Journal')
    if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await journalBtn.click()

      // Wait for journal to open
      const journal = page.locator('[role="dialog"]').or(page.locator('[data-testid="journal"]'))
      await expect(journal.first()).toBeVisible({ timeout: 5000 })

      // Check close button
      const closeBtn = page.getByLabel(/close/i).first()
      if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        const closeBtnBox = await closeBtn.boundingBox()
        expect(closeBtnBox).not.toBeNull()
        if (closeBtnBox) {
          expect(closeBtnBox.width).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
          expect(closeBtnBox.height).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET)
        }
      }
    }
  })
})
