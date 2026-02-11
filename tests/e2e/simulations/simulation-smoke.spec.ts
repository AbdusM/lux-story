/**
 * Simulation Smoke Tests (God Mode)
 * Mount each simulation via the God Mode panel and ensure it renders.
 */

import { test, expect } from '../fixtures/game-state-fixtures'
import { SIMULATION_REGISTRY } from '@/content/simulation-registry'

test.describe('Simulation Smoke', () => {
  test('All simulations mount via God Mode', async ({ page, seedState }) => {
    test.setTimeout(180000)

    for (const sim of SIMULATION_REGISTRY) {
      await seedState({
        currentCharacterId: 'samuel',
        currentNodeId: 'samuel_introduction'
      })

      await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 10000 })

      const journalBtn = page.getByLabel('Open Journal')
      if (await journalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await journalBtn.click()
      }

      const godModeTab = page.getByRole('button', { name: /god mode/i })
      await expect(godModeTab).toBeVisible({ timeout: 10000 })
      await godModeTab.click()

      const simHeading = page.getByRole('heading', { name: sim.title })
      await expect(simHeading).toBeVisible({ timeout: 10000 })

      const simCard = simHeading.locator('..').locator('..')
      const mountButton = simCard.getByRole('button', { name: /mount context/i })
      await mountButton.click()

      const readyButton = page.getByRole('button', { name: /ready when you are/i })
      await expect(readyButton).toBeVisible({ timeout: 10000 })
      await readyButton.click()

      const simulationInterface = page.getByTestId('simulation-interface')
      await expect(simulationInterface).toBeVisible({ timeout: 10000 })
      await expect(simulationInterface).toHaveAttribute('data-simulation-type', sim.type)

      await page.reload()
    }
  })
})
