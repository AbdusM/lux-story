/**
 * Desktop E2E: Settings overlay parity across breakpoints
 *
 * Contract:
 * - Desktop (>= 640px): settings renders as anchored panel near the trigger.
 * - Mobile (< 640px): settings renders inside OverlayHost as a bottom sheet.
 * - Resizing across the breakpoint while open must not leave orphan state
 *   (ghost backdrops, stuck focus, or "open but not rendered" overlays).
 */

import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Settings Overlay Parity', () => {
  test('settings re-renders cleanly when resizing across breakpoint while open', async ({ page, freshGame }) => {
    // Ensure we're in desktop mode for the initial open (anchored panel).
    await page.setViewportSize({ width: 900, height: 720 })

    const settingsButton = page.getByRole('button', { name: /settings menu/i })
    await expect(settingsButton).toBeVisible({ timeout: 15000 })

    await settingsButton.click()

    const anchoredPanel = page.locator('[data-menu-panel]')
    await expect(anchoredPanel).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="overlay-host"]')).toHaveCount(0)

    // Focus should live inside an overlay surface (trap active).
    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const active = document.activeElement as HTMLElement | null
          if (!active) return false
          return Boolean(active.closest('[data-overlay-surface]'))
        })
      })
      .toBe(true)

    // Resize to mobile width while still open: should swap to host-rendered sheet.
    await page.setViewportSize({ width: 390, height: 844 })

    await expect(anchoredPanel).toHaveCount(0)

    const host = page.locator('[data-testid="overlay-host"]')
    await expect(host).toBeVisible({ timeout: 10000 })

    const settingsDialog = page.getByRole('dialog', { name: /settings/i })
    await expect(settingsDialog).toBeVisible({ timeout: 10000 })

    // Focus should still be within the overlay surface after mode swap.
    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const active = document.activeElement as HTMLElement | null
          if (!active) return false
          return Boolean(active.closest('[data-overlay-surface]'))
        })
      })
      .toBe(true)

    // Escape should close deterministically (global dispatcher + overlay-store).
    await page.keyboard.press('Escape')
    await expect(settingsDialog).not.toBeVisible({ timeout: 10000 })
  })
})

