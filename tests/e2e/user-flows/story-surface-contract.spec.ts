import { test, expect } from '../fixtures/game-state-fixtures'
import { GAMEPLAY_SHELL } from '@/lib/ui-constants'

async function measureShell(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const gameplayShell = document.querySelector('[data-testid="gameplay-shell"]')
    const gameInterface = document.querySelector('[data-testid="game-interface"]')
    const header = document.querySelector('[data-testid="gameplay-header"]')
    const stage = document.querySelector('[data-testid="dialogue-stage"]')
    const dock = document.querySelector('[data-testid="response-dock"]')

    if (!gameplayShell || !gameInterface || !header || !stage || !dock) return null

    const shellBox = gameplayShell.getBoundingClientRect()
    const interfaceBox = gameInterface.getBoundingClientRect()
    const headerBox = header.getBoundingClientRect()
    const stageBox = stage.getBoundingClientRect()
    const dockBox = dock.getBoundingClientRect()

    return {
      headerHeight: headerBox.height,
      stageTopWithinInterface: stageBox.top - interfaceBox.top,
      dockHeight: dockBox.height,
      dockBottomWithinShell: shellBox.bottom - dockBox.bottom,
    }
  })
}

async function advanceStory(page: import('@playwright/test').Page) {
  const trigger = page.getByTestId('choice-sheet-trigger')
  if (await trigger.count()) {
    await trigger.click()
    const sheet = page.getByRole('dialog', { name: /responses|choose a response/i })
    await expect(sheet).toBeVisible({ timeout: 10000 })
    await sheet.getByRole('button').first().click()
    await expect(sheet).not.toBeVisible({ timeout: 10000 })
    return
  }

  const choices = page.locator('[data-testid="choice-button"]')
  await expect(choices.first()).toBeVisible({ timeout: 10000 })
  await choices.first().click()
}

async function expectNoStorySurfaceMeta(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('game-interface')).not.toContainText(/Clinical Audit/i)
  await expect(page.getByTestId('game-interface')).not.toContainText(/Trust\s*[+-]\d+/i)
  await expect(page.getByTestId('game-interface')).not.toContainText(/resonance\s*\+\d+/i)
  await expect(page.getByTestId('game-interface')).not.toContainText(/Sync:/i)
  await expect(page.locator('body')).not.toContainText(/Journal updated/i)
  await expect(page.locator('body')).not.toContainText(/Journey updated/i)
  await expect(page.locator('body')).not.toContainText(/Press\s+\?\s+for keyboard shortcuts/i)
}

test.describe('Story Surface Contract', () => {
  test('normal dialogue preserves shell geometry and hides forbidden story-surface labels', async ({ page, seedState }) => {
    await seedState({ currentCharacterId: 'samuel', currentNodeId: 'samuel_introduction' })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('gameplay-header')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('dialogue-stage')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('response-dock')).toBeVisible({ timeout: 10000 })

    const nodeIdBefore = await page.getByTestId('dialogue-card').getAttribute('data-node-id')
    const before = await measureShell(page)
    expect(before).not.toBeNull()
    if (!before || !nodeIdBefore) return

    await expectNoStorySurfaceMeta(page)

    await advanceStory(page)

    await page.waitForFunction(
      (prevNodeId) => {
        const next = document.querySelector('[data-testid="dialogue-card"]')?.getAttribute('data-node-id')
        return Boolean(next && next !== prevNodeId)
      },
      nodeIdBefore,
      { timeout: 15000 }
    )

    const after = await measureShell(page)
    expect(after).not.toBeNull()
    if (!after) return

    expect(Math.abs(after.stageTopWithinInterface - before.stageTopWithinInterface)).toBeLessThanOrEqual(
      GAMEPLAY_SHELL.geometryThresholdPx.stageTopDrift
    )
    expect(Math.abs(after.dockHeight - before.dockHeight)).toBeLessThanOrEqual(
      GAMEPLAY_SHELL.geometryThresholdPx.responseDockHeightDrift
    )
    expect(after.dockBottomWithinShell).toBeGreaterThanOrEqual(-1)

    await expectNoStorySurfaceMeta(page)
  })
})
