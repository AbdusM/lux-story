/**
 * Overlay smoothness benchmark (local/reviewer lane).
 *
 * Purpose:
 * - Validate settings open/close responsiveness in both render modes:
 *   desktop anchored panel and mobile host bottom sheet.
 * - Measure under CPU throttle to catch regressions before playtest.
 */

import { test, expect } from '../fixtures/game-state-fixtures'

async function measureFps(page: import('@playwright/test').Page, durationMs = 700): Promise<number> {
  return page.evaluate(async (duration) => {
    let frames = 0
    const start = performance.now()

    return new Promise<number>((resolve) => {
      const tick = () => {
        frames += 1
        if (performance.now() - start < duration) {
          requestAnimationFrame(tick)
          return
        }

        const fps = frames / (duration / 1000)
        resolve(fps)
      }

      requestAnimationFrame(tick)
    })
  }, durationMs)
}

test.describe('Overlay Smoothness', () => {
  test('settings open/close stays responsive under CPU throttle (desktop + mobile)', async ({ page, freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })

    // Chromium-only CDP throttle (project is Desktop Chrome).
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })

    try {
      const settingsButton = page.getByRole('button', { name: /settings menu/i })
      await expect(settingsButton).toBeVisible({ timeout: 5000 })

      // Desktop anchored mode.
      await page.setViewportSize({ width: 1280, height: 900 })
      const desktopPanel = page.locator('[data-menu-panel]')

      const desktopOpenStart = Date.now()
      const desktopOpenFpsPromise = measureFps(page)
      await settingsButton.click()
      await expect(desktopPanel).toBeVisible({ timeout: 3000 })
      const desktopOpenMs = Date.now() - desktopOpenStart
      const desktopOpenFps = await desktopOpenFpsPromise

      // CI-safe threshold: keep as responsiveness guard, not strict FPS gate.
      expect(desktopOpenMs).toBeLessThan(2500)

      const desktopCloseStart = Date.now()
      const desktopCloseFpsPromise = measureFps(page)
      await page.keyboard.press('Escape')
      await expect(desktopPanel).toHaveCount(0, { timeout: 3000 })
      const desktopCloseMs = Date.now() - desktopCloseStart
      const desktopCloseFps = await desktopCloseFpsPromise

      expect(desktopCloseMs).toBeLessThan(2500)

      // Mobile host mode.
      await page.setViewportSize({ width: 390, height: 844 })
      const mobileDialog = page.getByRole('dialog', { name: /settings/i })
      const host = page.locator('[data-testid="overlay-host"]')

      const mobileOpenStart = Date.now()
      const mobileOpenFpsPromise = measureFps(page)
      await settingsButton.click()
      await expect(host).toBeVisible({ timeout: 3000 })
      await expect(mobileDialog).toBeVisible({ timeout: 3000 })
      const mobileOpenMs = Date.now() - mobileOpenStart
      const mobileOpenFps = await mobileOpenFpsPromise

      expect(mobileOpenMs).toBeLessThan(2500)

      const mobileCloseStart = Date.now()
      const mobileCloseFpsPromise = measureFps(page)
      await page.keyboard.press('Escape')
      await expect(mobileDialog).not.toBeVisible({ timeout: 3000 })
      const mobileCloseMs = Date.now() - mobileCloseStart
      const mobileCloseFps = await mobileCloseFpsPromise

      expect(mobileCloseMs).toBeLessThan(2500)

      // Keep metric output in test logs for evidence snapshots.
      console.log(
        JSON.stringify({
          desktop: {
            openMs: desktopOpenMs,
            closeMs: desktopCloseMs,
            openFps: Number(desktopOpenFps.toFixed(1)),
            closeFps: Number(desktopCloseFps.toFixed(1)),
          },
          mobile: {
            openMs: mobileOpenMs,
            closeMs: mobileCloseMs,
            openFps: Number(mobileOpenFps.toFixed(1)),
            closeFps: Number(mobileCloseFps.toFixed(1)),
          },
          cpuThrottleRate: 4,
        })
      )
    } finally {
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })
      await cdp.detach()
    }
  })
})
