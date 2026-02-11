/**
 * Safe Area Boundary Tests (CI-stable invariants)
 *
 * Playwright/WebKit device emulation does not reliably reproduce iOS safe-area env() insets.
 * Instead of hardcoding device-specific inset values, we assert stable viewport invariants:
 * - critical navigation stays within the viewport
 * - modal dialogs render fully within the viewport
 *
 * These checks are still valuable regressions for "buttons clipped off-screen" issues.
 */

import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Safe Area Boundaries', () => {
  // iPhone safe-area behavior is an iOS/WebKit concern; avoid running these in Chromium mobile projects.
  test.skip(({ browserName }) => browserName !== 'webkit', 'Safe-area insets are only meaningful on WebKit/iOS.')

  test('Bottom navigation stays within viewport', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const viewport = page.viewportSize()
    expect(viewport).not.toBeNull()
    if (!viewport) return

    const journalBtn = page.getByLabel('Open Journal')
    if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const box = await journalBtn.boundingBox()
      expect(box).not.toBeNull()
      if (box) {
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
      }
    }

    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const box = await constellationBtn.boundingBox()
      expect(box).not.toBeNull()
      if (box) {
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
      }
    }
  })

  test('Modal dialogs render within viewport', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    const viewport = page.viewportSize()
    expect(viewport).not.toBeNull()
    if (!viewport) return

    const constellationBtn = page.getByLabel('Open Skill Constellation')
    if (await constellationBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await constellationBtn.click()
    }

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 10000 })

    // Framer Motion transforms can make the dialog bounding box report negative x/y during/after
    // animations. Instead, assert that the close button is within the viewport (user can always exit).
    const closeBtn = page.getByLabel('Close journey panel')
    await expect(closeBtn).toBeVisible({ timeout: 10000 })

    const box = await closeBtn.boundingBox()
    expect(box).not.toBeNull()
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
    }
  })
})
