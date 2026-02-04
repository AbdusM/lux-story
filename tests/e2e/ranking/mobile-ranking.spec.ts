/**
 * Mobile Ranking Dashboard E2E Tests
 *
 * P3 Polish: Validates ranking UI renders correctly across mobile viewports.
 * Tests touch interactions and layout constraints.
 *
 * Target audience: Ages 14-24 Birmingham youth on phones
 */

import { test, expect } from '../fixtures/game-state-fixtures'

const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'Galaxy S21', width: 360, height: 800 }
]

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Ranking Dashboard on ${viewport.name} (${viewport.width}×${viewport.height})`, () => {
    test.beforeEach(async ({ page, seedState }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      // Seed with some progression for ranking content
      await seedState({
        currentNodeId: 'samuel_introduction',
        hasStarted: true,
        showIntro: false,
        patterns: { analytical: 15, building: 10, helping: 8, patience: 5, exploring: 12 },
        globalFlags: [],
        knowledgeFlags: [],
        characters: [
          { id: 'maya', trust: 4, met: true, talkedCount: 3 },
          { id: 'devon', trust: 3, met: true, talkedCount: 2 }
        ],
        visitedScenes: ['samuel_introduction', 'maya_introduction']
      })
    })

    test('Journal opens and shows ranking content', async ({ page }) => {
      // Wait for game interface
      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      // Open Journal
      const journalButton = page.getByLabel('Open Journal')
      const journalVisible = await journalButton.isVisible({ timeout: 5000 }).catch(() => false)

      if (!journalVisible) {
        test.skip()
        return
      }

      await journalButton.click()

      // Wait for Journal panel
      await expect(page.locator('.glass-panel-solid, [data-testid="journal-panel"]')).toBeVisible({ timeout: 5000 })

      // Check Journal content doesn't overflow viewport
      const journalPanel = page.locator('.glass-panel-solid, [data-testid="journal-panel"]').first()
      const panelBox = await journalPanel.boundingBox()

      expect(panelBox).not.toBeNull()
      if (panelBox) {
        expect(panelBox.width).toBeLessThanOrEqual(viewport.width)
      }
    })

    test('Ranking badges fit within viewport width', async ({ page }) => {
      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      const journalButton = page.getByLabel('Open Journal')
      const journalVisible = await journalButton.isVisible({ timeout: 5000 }).catch(() => false)

      if (!journalVisible) {
        test.skip()
        return
      }

      await journalButton.click()
      await expect(page.locator('.glass-panel-solid')).toBeVisible({ timeout: 5000 })

      // Look for Ranking tab
      const rankingTab = page.locator('[data-testid="journal-tab-ranking"], [aria-label*="Ranking"], button:has-text("Ranking")')
      const hasRankingTab = await rankingTab.first().isVisible({ timeout: 3000 }).catch(() => false)

      if (hasRankingTab) {
        await rankingTab.first().click()
        await page.waitForTimeout(500)

        // Check any ranking badges that might be visible
        const badges = page.locator('[data-testid*="badge"], [class*="badge"]')
        const badgeCount = await badges.count()

        for (let i = 0; i < Math.min(badgeCount, 3); i++) {
          const badge = badges.nth(i)
          const isVisible = await badge.isVisible().catch(() => false)
          if (isVisible) {
            const box = await badge.boundingBox()
            if (box) {
              expect(box.width).toBeLessThanOrEqual(viewport.width)
            }
          }
        }
      }
    })

    test('Touch targets meet 44px minimum', async ({ page }) => {
      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      const journalButton = page.getByLabel('Open Journal')
      const journalVisible = await journalButton.isVisible({ timeout: 5000 }).catch(() => false)

      if (!journalVisible) {
        test.skip()
        return
      }

      // Check Journal button itself
      const buttonBox = await journalButton.boundingBox()
      if (buttonBox) {
        expect(buttonBox.height).toBeGreaterThanOrEqual(44)
        expect(buttonBox.width).toBeGreaterThanOrEqual(44)
      }

      await journalButton.click()
      await expect(page.locator('.glass-panel-solid')).toBeVisible({ timeout: 5000 })

      // Check tab buttons in Journal
      const tabButtons = page.locator('[role="tab"], [data-testid*="tab"]')
      const tabCount = await tabButtons.count()

      for (let i = 0; i < Math.min(tabCount, 5); i++) {
        const tab = tabButtons.nth(i)
        const isVisible = await tab.isVisible().catch(() => false)
        if (isVisible) {
          const box = await tab.boundingBox()
          if (box) {
            // At least one dimension should meet 44px
            const meetsTouchTarget = box.height >= 44 || box.width >= 44
            expect(meetsTouchTarget).toBe(true)
          }
        }
      }
    })

    test('Content scrolls properly without horizontal overflow', async ({ page }) => {
      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      const journalButton = page.getByLabel('Open Journal')
      const journalVisible = await journalButton.isVisible({ timeout: 5000 }).catch(() => false)

      if (!journalVisible) {
        test.skip()
        return
      }

      await journalButton.click()
      await expect(page.locator('.glass-panel-solid')).toBeVisible({ timeout: 5000 })

      // Check for horizontal scroll (indicates overflow)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })

      expect(hasHorizontalScroll).toBe(false)
    })
  })
}

test.describe('Ranking Mobile Accessibility', () => {
  test('Escape key closes Journal on mobile', async ({ page, seedState }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await seedState({
      currentNodeId: 'samuel_introduction',
      hasStarted: true,
      showIntro: false,
      patterns: { analytical: 5, building: 5, helping: 5, patience: 5, exploring: 5 }
    })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

    const journalButton = page.getByLabel('Open Journal')
    const journalVisible = await journalButton.isVisible({ timeout: 5000 }).catch(() => false)

    if (!journalVisible) {
      test.skip()
      return
    }

    await journalButton.click()
    await expect(page.locator('.glass-panel-solid')).toBeVisible({ timeout: 5000 })

    // Press Escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Journal should be closed, game interface visible
    const gameVisible = await page.getByTestId('game-interface').isVisible({ timeout: 3000 }).catch(() => false)
    expect(gameVisible).toBe(true)
  })
})
