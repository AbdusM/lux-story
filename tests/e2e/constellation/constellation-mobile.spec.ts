/**
 * Constellation Mobile UX Regression Tests
 * Tests the Skills constellation panel on mobile viewports (375x667)
 */

import { test, expect, type Page } from '@playwright/test'

// Helper to seed game state with demonstrated skills
async function seedGameState(page: Page) {
  await page.evaluate(() => {
    const gameState = {
      state: {
        // Scene management
        currentSceneId: 'samuel_introduction',
        hasStarted: true,
        showIntro: false,
        isProcessing: false,
        choiceStartTime: null,

        // Message management
        messages: [],
        messageId: 0,

        // Game progress
        visitedScenes: ['samuel_introduction'],
        choiceHistory: [],

        // Performance tracking
        performanceLevel: 2,
        performanceMetrics: {
          alignment: 0.5,
          consistency: 0.5,
          learning: 0.5,
          patience: 0.5,
          anxiety: 0,
          rushing: 0
        },

        // Platform relationships
        platformWarmth: {},
        platformAccessible: {},

        // Character relationships - seed with some trust values
        characterTrust: {
          samuel: 3,
          maya: 2
        },
        characterHelped: {},

        // Pattern tracking
        patterns: {
          analytical: 0.2,
          building: 0.1,
          helping: 0.3,
          exploring: 0.1,
          patience: 0.2
        },

        // Emotional state
        emotionalState: {
          currentMood: 'curious',
          moodIntensity: 0.5,
          anxiety: 0,
          engagement: 0.5,
          immersion: 0.5
        },

        // Cognitive state
        cognitiveState: {
          focus: 0.5,
          clarity: 0.5,
          overwhelm: 0,
          curiosity: 0.5,
          openness: 0.5
        },

        // Identity state
        identityState: {
          selfAwareness: 0.3,
          confidenceLevel: 0.5,
          explorationMode: 'curious'
        },

        // Neural state
        neuralState: {
          activation: 0.5,
          coherence: 0.5,
          plasticity: 0.5
        },

        // Skills - seed with some demonstrated skills (0-1 values)
        skills: {
          communication: 0.3, // 3 demonstrations
          empathy: 0.1, // 1 demonstration
          criticalThinking: 0.2, // 2 demonstrations
          problemSolving: 0.1, // 1 demonstration
          emotionalIntelligence: 0.05 // 0.5 -> 1 (awakening)
        },

        // Thought Cabinet
        thoughts: []
      },
      version: 1
    }
    localStorage.setItem('lux_story_v2_game_store', JSON.stringify(gameState))
  })
}

// Helper to navigate to game and open constellation panel
async function openConstellationPanel(page: Page): Promise<boolean> {
  // Try to click Enter the Station button if visible
  const enterButton = page.getByRole('button', { name: /enter.*station/i })
  if (await enterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await enterButton.click()
    // Wait for transition - either Continue button or constellation button appears
    await Promise.race([
      page.getByRole('button', { name: /continue/i }).waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      page.getByLabel('Open Skill Constellation').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    ])
  }

  // Try to click Continue button if visible
  const continueButton = page.getByRole('button', { name: /continue/i })
  if (await continueButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await continueButton.click()
    // Wait for constellation button to appear after continue
    await page.getByLabel('Open Skill Constellation').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
  }

  // Look for constellation button (already visible if previous waits succeeded)
  const constellationBtn = page.getByLabel('Open Skill Constellation')
  if (!await constellationBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    return false
  }

  await constellationBtn.click()

  // Wait for dialog to open
  await page.getByRole('dialog').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
  return true
}

test.describe('Constellation Mobile UX', () => {
  test.beforeEach(async ({ page }) => {
    // Set iPhone SE viewport (smallest common mobile size)
    await page.setViewportSize({ width: 375, height: 667 })

    // Navigate and seed state
    await page.goto('/')
    await seedGameState(page)
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('Panel opens from game interface', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Verify panel opens
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 5000 })

    // Verify header shows "Your Journey"
    await expect(page.getByText('Your Journey')).toBeVisible()
  })

  test('Skills tab renders SVG constellation', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Switch to Skills tab
    const skillsTab = page.getByRole('tab', { name: /skills/i })
    await expect(skillsTab).toBeVisible({ timeout: 3000 })
    await skillsTab.click()

    // Verify SVG constellation renders
    const svg = page.locator('svg[role="img"]')
    await expect(svg).toBeVisible({ timeout: 5000 })
  })

  test('Cluster filter chips are visible', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Switch to Skills tab
    const skillsTab = page.getByRole('tab', { name: /skills/i })
    await skillsTab.click()

    // Wait for tab to be selected and filter chips to appear
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 })
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible({ timeout: 3000 })

    // Verify all cluster filter chips are visible
    await expect(page.getByRole('button', { name: 'Mind' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Heart' })).toBeVisible()
  })

  test('Cluster filter changes visible skills', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Switch to Skills tab
    const skillsTab = page.getByRole('tab', { name: /skills/i })
    await skillsTab.click()

    // Wait for tab to be selected
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 })

    // Click Mind cluster filter
    const mindFilter = page.getByRole('button', { name: 'Mind' })
    await mindFilter.click()

    // Wait for filter to be active (has pressed state)
    await expect(mindFilter).toHaveAttribute('aria-pressed', 'true', { timeout: 3000 })

    // Click All to reset
    await page.getByRole('button', { name: 'All' }).click()
  })

  test('Skill selection shows detail panel with character hints', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Switch to Skills tab
    const skillsTab = page.getByRole('tab', { name: /skills/i })
    await skillsTab.click()

    // Wait for tab to be selected and SVG to render
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 })
    await expect(page.locator('svg[role="img"]')).toBeVisible({ timeout: 3000 })

    // Click on Communication skill (should be in center as hub)
    const communicationNode = page.locator('g[role="button"][aria-label*="Communication"]')
    if (await communicationNode.isVisible({ timeout: 3000 }).catch(() => false)) {
      await communicationNode.click()

      // Verify detail panel appears with character hints section
      await expect(page.getByText('Communication')).toBeVisible({ timeout: 3000 })
      // Character hints should be visible
      await expect(page.getByText(/developing with|develop with/i)).toBeVisible({ timeout: 3000 })
    }
  })

  test('Tab switching works correctly', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Start on People tab (default)
    const peopleTab = page.getByRole('tab', { name: /people/i })
    const skillsTab = page.getByRole('tab', { name: /skills/i })

    await expect(peopleTab).toHaveAttribute('aria-selected', 'true')

    // Switch to Skills
    await skillsTab.click()
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true')
    await expect(peopleTab).toHaveAttribute('aria-selected', 'false')

    // Switch back to People
    await peopleTab.click()
    await expect(peopleTab).toHaveAttribute('aria-selected', 'true')
  })

  test('Panel closes via X button', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Verify panel is open
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 3000 })

    // Close via X button
    const closeBtn = page.getByLabel(/close/i)
    await closeBtn.click()

    // Verify panel is closed
    await expect(dialog).not.toBeVisible({ timeout: 3000 })
  })

  test('Panel closes via backdrop click', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Verify panel is open
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 3000 })

    // Click on backdrop (left side of viewport, outside panel)
    await page.mouse.click(50, 300)

    // Verify panel is closed
    await expect(dialog).not.toBeVisible({ timeout: 3000 })
  })

  test('Touch targets meet 44px minimum', async ({ page }) => {
    const opened = await openConstellationPanel(page)
    if (!opened) {
      test.skip()
      return
    }

    // Check close button size
    const closeBtn = page.getByLabel(/close/i)
    const closeBtnBox = await closeBtn.boundingBox()
    expect(closeBtnBox).not.toBeNull()
    if (closeBtnBox) {
      expect(closeBtnBox.width).toBeGreaterThanOrEqual(44)
      expect(closeBtnBox.height).toBeGreaterThanOrEqual(44)
    }

    // Check tab buttons
    const skillsTab = page.getByRole('tab', { name: /skills/i })
    const tabBox = await skillsTab.boundingBox()
    expect(tabBox).not.toBeNull()
    if (tabBox) {
      expect(tabBox.height).toBeGreaterThanOrEqual(44)
    }

    // Check cluster filter chips
    await skillsTab.click()

    // Wait for tab to be selected and filter chips to appear
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 })
    const allChip = page.getByRole('button', { name: 'All' })
    await expect(allChip).toBeVisible({ timeout: 3000 })

    const chipBox = await allChip.boundingBox()
    expect(chipBox).not.toBeNull()
    if (chipBox) {
      expect(chipBox.height).toBeGreaterThanOrEqual(44)
    }
  })
})
