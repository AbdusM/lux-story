/**
 * Game State Fixtures for E2E Tests
 * Provides reusable game state templates to eliminate boilerplate
 */

import { test as base, Page } from '@playwright/test'
import { GameStateUtils } from '@/lib/character-state'
import type { GameState, SerializableGameState } from '@/lib/character-state'

// Keep the fixture API JSON-friendly: tests can pass plain objects/arrays, and we
// convert them into a valid, schema-checked SerializableGameState for the app.
export type SeedOverrides = {
  currentNodeId?: string
  currentCharacterId?: GameState['currentCharacterId']
  patterns?: Partial<GameState['patterns']>
  globalFlags?: string[]
  characterTrust?: Record<string, number>
  skillLevels?: Record<string, number>
}

/**
 * Available game state fixtures
 */
interface GameStateFixtures {
  /**
   * Fresh game - New player at station entrance
   * - currentSceneId: samuel_introduction
   * - hasStarted: true
   * - All patterns at 0
   */
  freshGame: void

  /**
   * Journey complete - Player has completed 2 character arcs
   * - 20+ choices made
   * - Multiple patterns developed (2-4 range)
   * - Trust with 2+ characters at level 3-5
   */
  journeyComplete: void

  /**
   * With demonstrated skills - Skills unlocked for constellation view
   * - 5+ skills demonstrated
   * - Patterns at threshold levels (3+)
   */
  withDemonstratedSkills: void

  /**
   * High trust with Maya - Vulnerability arc unlocked
   * - Maya trust at 6
   * - Met Maya multiple times
   */
  withHighTrust: void

  /**
   * Seed custom state - Generic state seeding utility
   */
  seedState: (state: SeedOverrides) => Promise<void>
}

/**
 * Convert overrides into a valid GameState (then serialize it for storage).
 */
function applySeedOverrides(base: GameState, overrides: SeedOverrides): GameState {
  if (overrides.currentNodeId) base.currentNodeId = overrides.currentNodeId
  if (overrides.currentCharacterId) base.currentCharacterId = overrides.currentCharacterId

  if (overrides.patterns) base.patterns = { ...base.patterns, ...overrides.patterns }
  if (overrides.globalFlags) base.globalFlags = new Set(overrides.globalFlags)
  if (overrides.skillLevels) base.skillLevels = { ...base.skillLevels, ...overrides.skillLevels }

  if (overrides.characterTrust) {
    for (const [characterId, trust] of Object.entries(overrides.characterTrust)) {
      const cs = base.characters.get(characterId)
      if (cs) {
        cs.trust = trust
        cs.lastInteractionTimestamp = Date.now() - 60_000
      }
    }
  }

  base.lastSaved = Date.now()
  return base
}

function buildSerializableState(playerId: string, overrides: SeedOverrides): SerializableGameState {
  const gs = GameStateUtils.createNewGameState(playerId)
  applySeedOverrides(gs, overrides)
  return GameStateUtils.serialize(gs)
}

/**
 * Minimal game state template (fresh game, already inside the dialogue loop)
 */
const createFreshGameState = (): SerializableGameState =>
  buildSerializableState('player_e2e_fresh', {
    currentCharacterId: 'samuel',
    currentNodeId: 'samuel_introduction',
    patterns: { analytical: 0, building: 0, helping: 0, patience: 0, exploring: 0 }
  })

/**
 * Complete journey state template
 * Represents a player who has completed 2 character arcs
 */
const createJourneyCompleteState = (): SerializableGameState =>
  buildSerializableState('player_e2e_journey_complete', {
    currentCharacterId: 'samuel',
    currentNodeId: 'station_hub',
    patterns: { analytical: 3, building: 2, helping: 4, patience: 2, exploring: 3 },
    globalFlags: [
      'first_journey_complete',
      'met_maya',
      'met_marcus',
      'met_samuel',
      'analytical_threshold_reached',
      'helping_threshold_reached'
    ],
    characterTrust: { maya: 5, marcus: 4, samuel: 3 }
  })

/**
 * State with demonstrated skills for constellation
 */
const createDemonstratedSkillsState = (): SerializableGameState =>
  buildSerializableState('player_e2e_skills', {
    currentCharacterId: 'samuel',
    currentNodeId: 'station_hub',
    patterns: { analytical: 4, building: 3, helping: 3, patience: 2, exploring: 4 },
    globalFlags: ['constellation_unlocked', 'skills_revealed', 'met_maya', 'met_devon', 'analytical_threshold_reached'],
    characterTrust: { maya: 4, devon: 3 },
    skillLevels: {
      systems_thinking: 2,
      analytical_reasoning: 2,
      creative_problem_solving: 2,
      technical_communication: 2,
      pattern_recognition: 2,
      active_listening: 2,
      empathy: 2
    }
  })

/**
 * High trust with Maya - Vulnerability arc accessible
 */
const createHighTrustState = (): SerializableGameState =>
  buildSerializableState('player_e2e_high_trust', {
    currentCharacterId: 'maya',
    currentNodeId: 'maya_trust_6',
    patterns: { analytical: 5, building: 3, helping: 4, patience: 3, exploring: 2 },
    globalFlags: ['met_maya', 'maya_trust_high', 'vulnerability_arc_accessible', 'analytical_threshold_reached'],
    characterTrust: { maya: 6 },
    skillLevels: { active_listening: 2, empathy: 2, analytical_reasoning: 2, systems_thinking: 2 }
  })

/**
 * Helper to seed state into localStorage
 */
async function seedGameState(page: Page, state: SerializableGameState): Promise<void> {
  // Seed state before app code executes (CI-stable). The previous "goto -> eval -> reload"
  // approach was prone to flake on mobile Chromium/WebKit in CI due to redirects/onboarding
  // screens executing before localStorage was updated.
  //
  // Note: `addInitScript` stacks if `seedGameState` is called multiple times. That's OK for
  // our usage (one seed per test). If that changes, consider using a dedicated storageState.
  await page.goto('about:blank')
  await page.addInitScript((stateToSeed) => {
    localStorage.clear()
    ;(window as any).__PLAYWRIGHT__ = true
    localStorage.setItem('grand-central-terminus-save', JSON.stringify(stateToSeed))
  }, state)

  // Avoid `networkidle` on WebKit/mobile: the app can keep connections open which makes it flaky.
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const gameInterface = page.locator('[data-testid="game-interface"]')
  const continueButton = page.getByRole('button', { name: /continue journey|continue your journey/i })
  // The intro CTA uses an aria-label ("Begin your journey at Terminus"), so match that too.
  const enterStationButton = page.getByRole('button', { name: /enter( the)? station|begin your journey/i })
  const beginExploringButton = page.getByRole('button', { name: /begin exploring/i })

  const tryClick = async (locator: ReturnType<Page['getByRole']>) => {
    try {
      await locator.click({ timeout: 750 })
      return true
    } catch {
      return false
    }
  }

  // Some routes show a welcome/intro screen even when a save is present; click through if needed.
  for (let attempt = 0; attempt < 20; attempt++) {
    if (await gameInterface.isVisible({ timeout: 500 }).catch(() => false)) break

    if (await tryClick(continueButton)) {
      await page.waitForTimeout(250)
      continue
    }

    if (await tryClick(beginExploringButton)) {
      await page.waitForTimeout(250)
      continue
    }

    if (await tryClick(enterStationButton)) {
      await page.waitForTimeout(250)
      continue
    }

    await page.waitForTimeout(250)
  }

  // CI runs can be slow; prefer a generous wait over flake.
  await gameInterface.waitFor({ state: 'visible', timeout: 60000 })
}

/**
 * Extend Playwright test with game state fixtures
 */
export const test = base.extend<GameStateFixtures>({
  freshGame: async ({ page }, use) => {
    const state = createFreshGameState()
    await seedGameState(page, state)
    await use()
  },

  journeyComplete: async ({ page }, use) => {
    const state = createJourneyCompleteState()
    await seedGameState(page, state)
    await use()
  },

  withDemonstratedSkills: async ({ page }, use) => {
    const state = createDemonstratedSkillsState()
    await seedGameState(page, state)
    await use()
  },

  withHighTrust: async ({ page }, use) => {
    const state = createHighTrustState()
    await seedGameState(page, state)
    await use()
  },

  seedState: async ({ page }, use) => {
    const seedFn = async (custom: SeedOverrides) => {
      const merged: SeedOverrides = {
        currentCharacterId: 'samuel',
        currentNodeId: 'samuel_introduction',
        ...custom
      }
      const state = buildSerializableState('player_e2e_seed', merged)
      await seedGameState(page, state)
    }

    await use(seedFn)
  }
})

export { expect } from '@playwright/test'
