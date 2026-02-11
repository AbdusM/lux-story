/**
 * Constellation Mobile UX Regression Tests
 * Runs on Desktop Chrome with a small viewport to catch layout regressions.
 */

import { test, expect } from '../fixtures/game-state-fixtures'
import type { Page } from '@playwright/test'

const VIEWPORT = { width: 375, height: 667 } // iPhone SE-ish

async function openConstellation(page: Page) {
  await page.setViewportSize(VIEWPORT)
  await expect(page.getByTestId('game-interface')).toBeVisible({ timeout: 20000 })

  const constellationBtn = page.getByLabel('Open Skill Constellation')
  await expect(constellationBtn).toBeVisible({ timeout: 15000 })
  await constellationBtn.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible({ timeout: 15000 })
  return dialog
}

test.describe('Constellation Mobile UX', () => {
  test('Panel opens from game interface', async ({ page, withDemonstratedSkills }) => {
    const dialog = await openConstellation(page)
    await expect(dialog).toBeVisible()

    // Verify header shows "Your Journey" (stable copy)
    await expect(page.getByText('Your Journey')).toBeVisible()
  })

  test('Skills tab renders SVG constellation', async ({ page, withDemonstratedSkills }) => {
    await openConstellation(page)

    const skillsTab = page.getByRole('tab', { name: /skills/i })
    await expect(skillsTab).toBeVisible({ timeout: 15000 })
    await skillsTab.click()
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true', { timeout: 5000 })

    const svg = page.locator('svg[role="img"]')
    await expect(svg).toBeVisible({ timeout: 15000 })
  })

  test('Cluster filter chips are visible', async ({ page, withDemonstratedSkills }) => {
    await openConstellation(page)

    const skillsTab = page.getByRole('tab', { name: /skills/i })
    await skillsTab.click()
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true', { timeout: 5000 })

    await expect(page.getByRole('button', { name: 'All' })).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'Mind' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Heart' })).toBeVisible()
  })

  test('Cluster filter changes visible skills', async ({ page, withDemonstratedSkills }) => {
    await openConstellation(page)

    const skillsTab = page.getByRole('tab', { name: /skills/i })
    await skillsTab.click()
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true', { timeout: 5000 })

    const allChip = page.getByRole('button', { name: 'All' })
    const mindChip = page.getByRole('button', { name: 'Mind' })

    await expect(allChip).toHaveAttribute('aria-pressed', 'true')
    await mindChip.click()
    await expect(mindChip).toHaveAttribute('aria-pressed', 'true')
    await expect(allChip).toHaveAttribute('aria-pressed', 'false')
  })
})
