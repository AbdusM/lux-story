/**
 * Interrupt UI E2E Tests
 *
 * Note: The ME2-style interrupt button is currently disabled in the main UI
 * (see `components/StatefulGameInterface.tsx` where the render block is commented).
 *
 * These tests intentionally assert the current shipped behavior to prevent
 * stale "timing window" tests from flaking or misrepresenting product behavior.
 */

import { test, expect } from '../fixtures/game-state-fixtures'

test.describe('Interrupts (UI Disabled)', () => {
  test('interrupt button is not rendered even when a node defines an interrupt window', async ({ page, seedState }) => {
    // Node `maya_deflect_passion` defines an interrupt window in content, and
    // `challenge` interrupts should be visible for analytical/building >= 2.
    await seedState({
      currentNodeId: 'maya_deflect_passion',
      currentCharacterId: 'maya',
      patterns: { analytical: 3, building: 0, helping: 0, patience: 0, exploring: 0 },
    })

    await expect(page.getByTestId('dialogue-content')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="interrupt-button"]')).toHaveCount(0)
  })
})

