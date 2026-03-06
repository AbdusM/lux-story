import type { Page } from '@playwright/test'
import { test, expect } from '../fixtures/game-state-fixtures'
import type { SeedOverrides } from '../fixtures/game-state-fixtures'

type DecisionScenario = {
  characterId: 'dante' | 'devon' | 'isaiah' | 'jordan' | 'nadia'
  nodeId: string
  phase: 2 | 3
  timeLimitSeconds: number
  successNodeId: string
  failNodeId: string
  correctOption: 'A' | 'B' | 'C' | 'D'
  wrongOption: 'A' | 'B' | 'C' | 'D'
  requiredGlobalFlags?: string[]
  requiredKnowledgeFlags?: string[]
}

const decisionScenarios: DecisionScenario[] = [
  {
    characterId: 'dante',
    nodeId: 'dante_simulation_phase2',
    phase: 2,
    timeLimitSeconds: 120,
    successNodeId: 'dante_simulation_phase2_success',
    failNodeId: 'dante_simulation_phase2_fail',
    correctOption: 'C',
    wrongOption: 'A',
  },
  {
    characterId: 'dante',
    nodeId: 'dante_simulation_phase3',
    phase: 3,
    timeLimitSeconds: 90,
    successNodeId: 'dante_simulation_phase3_success',
    failNodeId: 'dante_simulation_phase3_fail',
    correctOption: 'D',
    wrongOption: 'A',
    requiredGlobalFlags: ['dante_vulnerability_revealed'],
    requiredKnowledgeFlags: ['dante_simulation_phase2_complete'],
  },
  {
    characterId: 'devon',
    nodeId: 'devon_simulation_phase2',
    phase: 2,
    timeLimitSeconds: 120,
    successNodeId: 'devon_simulation_phase2_success',
    failNodeId: 'devon_simulation_phase2_fail',
    correctOption: 'A',
    wrongOption: 'B',
  },
  {
    characterId: 'isaiah',
    nodeId: 'isaiah_simulation_phase2',
    phase: 2,
    timeLimitSeconds: 120,
    successNodeId: 'isaiah_simulation_phase2_success',
    failNodeId: 'isaiah_simulation_phase2_fail',
    correctOption: 'B',
    wrongOption: 'A',
  },
  {
    characterId: 'isaiah',
    nodeId: 'isaiah_simulation_phase3',
    phase: 3,
    timeLimitSeconds: 90,
    successNodeId: 'isaiah_simulation_phase3_success',
    failNodeId: 'isaiah_simulation_phase3_fail',
    correctOption: 'B',
    wrongOption: 'A',
    requiredKnowledgeFlags: ['isaiah_simulation_phase2_complete', 'isaiah_vulnerability_revealed'],
  },
  {
    characterId: 'jordan',
    nodeId: 'jordan_simulation_phase2',
    phase: 2,
    timeLimitSeconds: 120,
    successNodeId: 'jordan_simulation_phase2_success',
    failNodeId: 'jordan_simulation_phase2_fail',
    correctOption: 'A',
    wrongOption: 'B',
  },
  {
    characterId: 'jordan',
    nodeId: 'jordan_simulation_phase3',
    phase: 3,
    timeLimitSeconds: 90,
    successNodeId: 'jordan_simulation_phase3_success',
    failNodeId: 'jordan_simulation_phase3_fail',
    correctOption: 'A',
    wrongOption: 'B',
    requiredKnowledgeFlags: ['jordan_simulation_phase2_complete', 'jordan_vulnerability_revealed'],
  },
  {
    characterId: 'nadia',
    nodeId: 'nadia_simulation_phase2',
    phase: 2,
    timeLimitSeconds: 120,
    successNodeId: 'nadia_simulation_phase2_success',
    failNodeId: 'nadia_simulation_phase2_fail',
    correctOption: 'D',
    wrongOption: 'A',
  },
  {
    characterId: 'nadia',
    nodeId: 'nadia_simulation_phase3',
    phase: 3,
    timeLimitSeconds: 90,
    successNodeId: 'nadia_simulation_phase3_success',
    failNodeId: 'nadia_simulation_phase3_fail',
    correctOption: 'A',
    wrongOption: 'B',
    requiredGlobalFlags: ['nadia_vulnerability_revealed'],
    requiredKnowledgeFlags: ['nadia_simulation_phase2_complete'],
  },
]

async function seedSimulationNode(
  page: Page,
  seedState: (state: SeedOverrides) => Promise<void>,
  scenario: DecisionScenario
) {
  const globalFlags = new Set<string>(scenario.requiredGlobalFlags ?? [])

  await seedState({
    currentCharacterId: scenario.characterId,
    currentNodeId: scenario.nodeId,
    globalFlags: Array.from(globalFlags),
    characterTrust: {
      [scenario.characterId]: scenario.phase === 2 ? 5 : 8,
    },
    characterConversationHistory: {
      [scenario.characterId]: [scenario.nodeId],
    },
  })

  await expect(page.getByTestId('simulation-interface')).toBeVisible({ timeout: 10000 })
}

async function assertTimedFooterSuppressed(page: Page) {
  await expect(page.locator('[data-testid="choice-button"]')).toHaveCount(0)
  await expect(page.locator('[data-testid="choice-sheet-trigger"]')).toHaveCount(0)
}

async function selectDecision(page: Page, option: 'A' | 'B' | 'C' | 'D') {
  await page.getByRole('button', { name: new RegExp(`^Option ${option}:`, 'i') }).click()
  await page.getByRole('button', { name: /lock in your response/i }).click()
}

async function readCurrentNodeId(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('grand-central-terminus-save')
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return typeof parsed?.currentNodeId === 'string' ? parsed.currentNodeId : null
    } catch {
      return null
    }
  })
}

async function waitForRoutedNode(page: Page, expectedNodeId: string) {
  await page.waitForFunction((nodeId) => {
    const raw = localStorage.getItem('grand-central-terminus-save')
    if (!raw) return false
    try {
      const parsed = JSON.parse(raw)
      return parsed?.currentNodeId === nodeId
    } catch {
      return false
    }
  }, expectedNodeId, { timeout: 15000 })

  await expect(page.getByTestId('simulation-interface')).toHaveCount(0)
  await expect(page.locator('[data-testid="choice-button"]').first()).toBeVisible({ timeout: 10000 })
}

async function waitForTimerReady(page: Page) {
  await expect(page.getByLabel('Time remaining')).toHaveText(/\d+:\d{2}/, {
    timeout: 10000,
  })
}

async function enableFastSimulationTimeouts(page: Page, scale = 0.01) {
  await page.addInitScript((nextScale) => {
    window.__LUX_E2E_SIM_TIME_SCALE__ = nextScale
  }, scale)
}

test.describe('Manual Audit: Phase 2/3 Timed Simulations', () => {
  test.describe.configure({ mode: 'serial' })

  test('correct and wrong decisions route to expected nodes without footer bypass', async ({ page, seedState }) => {
    test.setTimeout(180000)

    for (const scenario of decisionScenarios) {
      await test.step(`${scenario.nodeId}: correct decision`, async () => {
        await seedSimulationNode(page, seedState, scenario)
        await assertTimedFooterSuppressed(page)
        await selectDecision(page, scenario.correctOption)
        await waitForRoutedNode(page, scenario.successNodeId)
        await expect.poll(() => readCurrentNodeId(page)).toBe(scenario.successNodeId)
      })

      await test.step(`${scenario.nodeId}: wrong decision`, async () => {
        await seedSimulationNode(page, seedState, scenario)
        await assertTimedFooterSuppressed(page)
        await selectDecision(page, scenario.wrongOption)
        await waitForRoutedNode(page, scenario.failNodeId)
        await expect.poll(() => readCurrentNodeId(page)).toBe(scenario.failNodeId)
      })
    }
  })

  test('dante phase 2 timeout routes to fail node', async ({ page, seedState }) => {
    test.setTimeout(60000)

    const scenario = decisionScenarios.find((candidate) => candidate.nodeId === 'dante_simulation_phase2')!

    await enableFastSimulationTimeouts(page)
    await seedSimulationNode(page, seedState, scenario)
    await assertTimedFooterSuppressed(page)
    await waitForTimerReady(page)
    await waitForRoutedNode(page, scenario.failNodeId)
    await expect.poll(() => readCurrentNodeId(page)).toBe(scenario.failNodeId)
  })

  test('dante phase 3 timeout routes to fail node', async ({ page, seedState }) => {
    test.setTimeout(60000)

    const scenario = decisionScenarios.find((candidate) => candidate.nodeId === 'dante_simulation_phase3')!

    await enableFastSimulationTimeouts(page)
    await seedSimulationNode(page, seedState, scenario)
    await assertTimedFooterSuppressed(page)
    await waitForTimerReady(page)
    await waitForRoutedNode(page, scenario.failNodeId)
    await expect.poll(() => readCurrentNodeId(page)).toBe(scenario.failNodeId)
  })

  test('devon phase 3 remains playable through native sim UI with no footer bypass', async ({ page, seedState }) => {
    test.setTimeout(60000)

    await seedState({
      currentCharacterId: 'devon',
      currentNodeId: 'devon_simulation_phase3',
      globalFlags: ['devon_vulnerability_revealed'],
      characterTrust: { devon: 8 },
      characterConversationHistory: { devon: ['devon_simulation_phase3'] },
    })

    await expect(page.getByTestId('simulation-interface')).toBeVisible({ timeout: 10000 })
    await assertTimedFooterSuppressed(page)

    await page.getByRole('button', { name: /\[debug\]\s*auto\s*-\s*design/i }).click()
    await waitForRoutedNode(page, 'devon_simulation_phase3_success')
    await expect.poll(() => readCurrentNodeId(page)).toBe('devon_simulation_phase3_success')
  })

  test('devon phase 3 timeout routes to fail node', async ({ page, seedState }) => {
    test.setTimeout(60000)

    await enableFastSimulationTimeouts(page)
    await seedState({
      currentCharacterId: 'devon',
      currentNodeId: 'devon_simulation_phase3',
      globalFlags: ['devon_vulnerability_revealed'],
      characterTrust: { devon: 8 },
      characterConversationHistory: { devon: ['devon_simulation_phase3'] },
    })

    await expect(page.getByTestId('simulation-interface')).toBeVisible({ timeout: 10000 })
    await assertTimedFooterSuppressed(page)
    await waitForTimerReady(page)
    await waitForRoutedNode(page, 'devon_simulation_phase3_fail')
    await expect.poll(() => readCurrentNodeId(page)).toBe('devon_simulation_phase3_fail')
  })
})
