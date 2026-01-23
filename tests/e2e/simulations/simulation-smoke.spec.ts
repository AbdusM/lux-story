/**
 * Simulation Smoke Tests (God Mode)
 * Mount each simulation via the God Mode panel and ensure it renders.
 */

import { test, expect } from '../fixtures/game-state-fixtures'
import { SIMULATION_REGISTRY } from '@/content/simulation-registry'

test.describe('Simulation Smoke', () => {
  // TODO: God Mode tab not visible in Playwright test environment.
  // Needs investigation - the tab should show in dev mode but
  // process.env.NODE_ENV check may not work correctly in test context.
  // Issue: Only 3 tabs (Network, Skills, Quests) visible instead of 7.
  test.skip('All simulations mount via God Mode', async ({ page, seedState }) => {
    test.setTimeout(180000)

    for (const sim of SIMULATION_REGISTRY) {
      await seedState({
        currentNodeId: 'samuel_introduction',
        currentCharacterId: 'samuel'
      })

      // Wait for either game interface or continue journey button
      const gameInterface = page.getByTestId('game-interface')
      const continueBtn = page.getByRole('button', { name: 'Continue Journey' })

      // Click through welcome screen if present
      if (await continueBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await continueBtn.click()
        await page.waitForLoadState('networkidle')
      }

      await expect(gameInterface).toBeVisible({ timeout: 15000 })

      // Open the Journal panel (labeled "Your Journey" in UI)
      const journalBtn = page.getByRole('button', { name: /Your Journey/i })
      await expect(journalBtn).toBeVisible({ timeout: 5000 })
      await journalBtn.click()

      // Wait for panel to open
      await page.waitForTimeout(500)

      // Look for God Mode tab (only visible in dev mode)
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
