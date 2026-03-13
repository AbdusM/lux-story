import { test, expect } from './fixtures/game-state-fixtures'
import type { SeedOverrides } from './fixtures/game-state-fixtures'

async function seedJourneySummaryEnding(
  seedState: (state: SeedOverrides) => Promise<void>
): Promise<void> {
  await seedState({
    currentCharacterId: 'samuel',
    currentNodeId: 'journey_complete_trigger',
    patterns: {
      analytical: 3,
      building: 4,
      helping: 6,
      patience: 4,
      exploring: 4
    },
    globalFlags: [
      'maya_arc_complete',
      'devon_arc_complete',
      'met_maya',
      'met_devon'
    ],
    characterTrust: {
      samuel: 8,
      maya: 6,
      devon: 5
    },
    skillLevels: {
      analytical_reasoning: 2,
      empathy: 2,
      systems_thinking: 2
    }
  })
}

async function openJourneySummary(page: Parameters<typeof test>[0]['page']) {
  await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('The Station Knows You Now')).toBeVisible({ timeout: 5000 })

  const trigger = page.getByRole('button', { name: 'See Your Journey' })
  await expect(trigger).toBeVisible()
  await trigger.click()

  const dialog = page.getByRole('dialog', { name: 'Journey summary' })
  await expect(dialog).toBeVisible({ timeout: 5000 })
  return dialog
}

test.describe('Journey Summary', () => {
  test('Journey Summary button does not appear during regular gameplay', async ({ page, freshGame: _freshGame }) => {
    await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'See Your Journey' })).toHaveCount(0)
  })

  test('Journey Summary opens from a completed terminal state', async ({ page, seedState }) => {
    await seedJourneySummaryEnding(seedState)

    const dialog = await openJourneySummary(page)

    await expect(dialog.getByText("Samuel's Reflection on Your Journey")).toBeVisible()
    await expect(dialog.getByText('The Beginning')).toBeVisible()
    await expect(dialog.getByText(/2 arcs completed/i)).toBeVisible()
    await expect(dialog.getByText(/21 choices made/i)).toBeVisible()
  })

  test('Journey Summary supports navigation through all sections', async ({ page, seedState }) => {
    await seedJourneySummaryEnding(seedState)

    const dialog = await openJourneySummary(page)
    const backButton = dialog.getByRole('button', { name: 'Back' })

    await expect(backButton).toBeDisabled()

    for (const section of [
      'Your Patterns',
      'Connections Made',
      'Skills Demonstrated',
      'Career Paths',
      "Samuel's Wisdom"
    ]) {
      await dialog.getByRole('button', { name: 'Next' }).click()
      await expect(dialog.getByText(section)).toBeVisible({ timeout: 5000 })
    }

    await expect(dialog.getByRole('button', { name: 'Complete Journey' })).toBeVisible()
  })

  test('Journey Summary closes on Escape', async ({ page, seedState }) => {
    await seedJourneySummaryEnding(seedState)

    const dialog = await openJourneySummary(page)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  })

  test('Journey Summary closes on completion', async ({ page, seedState }) => {
    await seedJourneySummaryEnding(seedState)

    const dialog = await openJourneySummary(page)

    for (let step = 0; step < 5; step++) {
      await dialog.getByRole('button', { name: 'Next' }).click()
    }

    await dialog.getByRole('button', { name: 'Complete Journey' }).click()
    await expect(dialog).toHaveCount(0)
  })
})
