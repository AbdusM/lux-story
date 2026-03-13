import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Final QA Smoke', () => {
  test('landing page renders the intro contract and primary CTA', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('intro-title')).toHaveText('Terminus', { timeout: 10000 })
    await expect(
      page.getByText(/The board has already changed once tonight\./i)
    ).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('intro-cta')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /begin your journey at terminus/i })).toBeEnabled()
  })

  test('seeded game renders dialogue shell and player controls', async ({ page, seedState }) => {
    await seedState({ currentCharacterId: 'samuel', currentNodeId: 'samuel_introduction' })

    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('gameplay-header')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('dialogue-card')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('dialogue-content')).toBeVisible({ timeout: 10000 })
    await expect(page.getByLabel('Open Journal')).toBeVisible({ timeout: 10000 })

    const inlineChoicesVisible = await page.getByTestId('game-choices').isVisible({ timeout: 1500 }).catch(() => false)
    const bottomSheetTriggerVisible = await page.getByTestId('choice-sheet-trigger').isVisible({ timeout: 1500 }).catch(() => false)

    expect(inlineChoicesVisible || bottomSheetTriggerVisible).toBe(true)
  })
})
