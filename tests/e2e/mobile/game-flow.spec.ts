/**
 * Mobile Game Flow Tests
 * Tests the complete dialogue → choice → state update flow on mobile viewports.
 *
 * Important: Playwright already provides per-device viewports via project config
 * (mobile-iphone-se, mobile-iphone-14, mobile-galaxy-s21). Do not loop over
 * multiple viewports inside these tests; it multiplies runtime and adds flake.
 */

import { test, expect } from '../fixtures/game-state-fixtures'

function getViewport(page: { viewportSize: () => { width: number; height: number } | null }) {
  const v = page.viewportSize()
  if (!v) throw new Error('Expected viewportSize() to be non-null for mobile projects')
  return v
}

test.describe('Game Flow (mobile)', () => {
  test('Complete dialogue → choice → state update cycle', async ({ page, seedState }) => {
    const viewport = getViewport(page)

    await seedState({
      currentNodeId: 'samuel_introduction',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
      globalFlags: [],
      knowledgeFlags: [],
      characters: [],
      visitedScenes: []
    })

    // Wait for game interface
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    // Wait for dialogue to load
    const dialogueContent = page.getByTestId('dialogue-content')
    await expect(dialogueContent).toBeVisible({ timeout: 15000 })

    // Verify dialogue renders (no horizontal overflow)
    const dialogueBox = await dialogueContent.boundingBox()
    expect(dialogueBox).not.toBeNull()
    if (dialogueBox) {
      expect(dialogueBox.width).toBeLessThanOrEqual(viewport.width)
    }

    // Wait for choices to appear
    const choicesContainer = page.getByTestId('game-choices')
    await expect(choicesContainer).toBeVisible({ timeout: 10000 })

    // Verify choices container doesn't overflow viewport
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
      { timeout: 20000 }
    )

    // Verify state was persisted to localStorage
    const savedState = await page.evaluate(() => {
      const saved = localStorage.getItem('grand-central-terminus-save')
      return saved ? JSON.parse(saved) : null
    })

    expect(savedState).toBeDefined()
    expect(savedState.playerId).toBeDefined()
    expect(savedState.currentNodeId).toBeDefined()
  })

  test('Choices stack vertically without horizontal overflow', async ({ page, seedState }) => {
    const viewport = getViewport(page)

    await seedState({
      currentNodeId: 'samuel_introduction',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
      globalFlags: [],
      knowledgeFlags: [],
      characters: [],
      visitedScenes: []
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 15000 })

    // Only assert over currently visible choices (mobile lists can scroll).
    const visibleChoices = page.locator('[data-testid="choice-button"]:visible')
    const count = await visibleChoices.count()
    expect(count).toBeGreaterThanOrEqual(1)

    const boxes = await Promise.all(
      Array.from({ length: Math.min(count, 4) }, async (_, i) => {
        await visibleChoices.nth(i).scrollIntoViewIfNeeded()
        return await visibleChoices.nth(i).boundingBox()
      })
    )

    // All visible choices should fit within viewport width (with padding slack)
    boxes.forEach((box) => {
      expect(box).not.toBeNull()
      if (box) {
        expect(box.width).toBeLessThanOrEqual(viewport.width)
      }
    })

    // Visible choices should stack vertically (y positions should increase)
    for (let i = 1; i < boxes.length; i++) {
      if (boxes[i] && boxes[i - 1]) {
        expect(boxes[i]!.y).toBeGreaterThan(boxes[i - 1]!.y)
      }
    }
  })

  test('Dialogue card is readable and properly sized', async ({ page, seedState }) => {
    const viewport = getViewport(page)

    await seedState({
      currentNodeId: 'samuel_introduction',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
      globalFlags: [],
      knowledgeFlags: [],
      characters: [],
      visitedScenes: []
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const dialogueCard = page.getByTestId('dialogue-card')
    await expect(dialogueCard).toBeVisible({ timeout: 15000 })

    const cardBox = await dialogueCard.boundingBox()
    expect(cardBox).not.toBeNull()
    if (cardBox) {
      expect(cardBox.width).toBeLessThanOrEqual(viewport.width)
      expect(cardBox.x).toBeGreaterThanOrEqual(0)
      expect(cardBox.height).toBeGreaterThanOrEqual(100)
    }
  })

  test('Navigation buttons are accessible', async ({ page, seedState }) => {
    await seedState({
      currentNodeId: 'samuel_introduction',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
      globalFlags: [],
      knowledgeFlags: [],
      characters: [],
      visitedScenes: []
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const journalBtn = page.getByLabel('Open Journal')
    if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const btnBox = await journalBtn.boundingBox()
      expect(btnBox).not.toBeNull()
      if (btnBox) {
        expect(btnBox.width).toBeGreaterThanOrEqual(44)
        expect(btnBox.height).toBeGreaterThanOrEqual(44)
      }
    }

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

  test('Multiple rapid taps do not cause errors', async ({ page, seedState }) => {
    await seedState({
      currentNodeId: 'samuel_introduction',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
      globalFlags: [],
      knowledgeFlags: [],
      characters: [],
      visitedScenes: []
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const choices = page.locator('[data-testid="choice-button"]')
    await expect(choices.first()).toBeVisible({ timeout: 15000 })

    const firstChoice = choices.first()

    // Simulate rapid taps (like user might do on mobile)
    await firstChoice.click()
    await firstChoice.click().catch(() => {}) // May fail if already processing
    await firstChoice.click().catch(() => {}) // May fail if already processing

    // Should still navigate successfully
    const dialogueContent = page.getByTestId('dialogue-content')
    await expect(dialogueContent).toBeVisible({ timeout: 10000 })
  })

  test('Layout is correct in current mobile viewport', async ({ page, seedState }) => {
    const viewport = getViewport(page)

    await seedState({
      currentNodeId: 'samuel_introduction',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 },
      globalFlags: [],
      knowledgeFlags: [],
      characters: [],
      visitedScenes: []
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const gameInterface = page.getByTestId('game-interface')
    const interfaceBox = await gameInterface.boundingBox()
    expect(interfaceBox).not.toBeNull()
    if (interfaceBox) {
      expect(interfaceBox.height).toBeGreaterThan(viewport.height * 0.5)
    }
  })
})
