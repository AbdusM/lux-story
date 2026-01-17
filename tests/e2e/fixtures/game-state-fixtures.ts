/**
 * Game State Fixtures for E2E Tests
 * Provides reusable game state templates to eliminate boilerplate
 */

import { test as base, Page } from '@playwright/test'
import type { GameState } from '@/lib/character-state'

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
  seedState: (state: Partial<GameState>) => Promise<void>
}

/**
 * Minimal game state template
 */
const createFreshGameState = () => ({
  state: {
    currentSceneId: 'samuel_introduction',
    hasStarted: true,
    showIntro: false,
    patterns: {
      analytical: 0,
      building: 0,
      helping: 0,
      patience: 0,
      exploring: 0
    },
    characters: new Map(),
    globalFlags: [],
    knowledgeFlags: [],
    visitedScenes: ['samuel_introduction']
  },
  version: 1
})

/**
 * Complete journey state template
 * Represents a player who has completed 2 character arcs
 */
const createJourneyCompleteState = () => ({
  state: {
    currentSceneId: 'station_hub',
    hasStarted: true,
    showIntro: false,
    patterns: {
      analytical: 3,
      building: 2,
      helping: 4,
      patience: 2,
      exploring: 3
    },
    characters: new Map([
      ['maya', {
        characterId: 'maya',
        trust: 5,
        lastInteractionTimestamp: Date.now() - 3600000, // 1 hour ago
        encounterCount: 8,
        currentNodeId: 'maya_pattern_reflection_analytical_3'
      }],
      ['marcus', {
        characterId: 'marcus',
        trust: 4,
        lastInteractionTimestamp: Date.now() - 7200000, // 2 hours ago
        encounterCount: 6,
        currentNodeId: 'marcus_trust_4'
      }],
      ['samuel', {
        characterId: 'samuel',
        trust: 3,
        lastInteractionTimestamp: Date.now() - 1800000, // 30 min ago
        encounterCount: 12,
        currentNodeId: 'samuel_hub_wisdom'
      }]
    ]),
    globalFlags: [
      'first_journey_complete',
      'met_maya',
      'met_marcus',
      'met_samuel',
      'analytical_threshold_reached',
      'helping_threshold_reached'
    ],
    knowledgeFlags: [
      'maya_family_pressure',
      'marcus_healthcare_mission',
      'samuel_conductor_role'
    ],
    visitedScenes: [
      'samuel_introduction',
      'station_hub',
      'maya_introduction',
      'maya_tech_discussion',
      'marcus_introduction',
      'marcus_healthcare_vision'
    ],
    demonstratedSkills: [
      'active_listening',
      'systems_thinking',
      'empathy',
      'analytical_reasoning',
      'problem_solving',
      'patience'
    ]
  },
  version: 1
})

/**
 * State with demonstrated skills for constellation
 */
const createDemonstratedSkillsState = () => ({
  state: {
    currentSceneId: 'station_hub',
    hasStarted: true,
    showIntro: false,
    patterns: {
      analytical: 4,
      building: 3,
      helping: 3,
      patience: 2,
      exploring: 4
    },
    characters: new Map([
      ['maya', {
        characterId: 'maya',
        trust: 4,
        lastInteractionTimestamp: Date.now() - 3600000,
        encounterCount: 5,
        currentNodeId: 'maya_pattern_reflection_analytical_3'
      }],
      ['devon', {
        characterId: 'devon',
        trust: 3,
        lastInteractionTimestamp: Date.now() - 5400000,
        encounterCount: 4,
        currentNodeId: 'devon_systems_thinking'
      }]
    ]),
    globalFlags: [
      'constellation_unlocked',
      'skills_revealed',
      'met_maya',
      'met_devon',
      'analytical_threshold_reached'
    ],
    knowledgeFlags: [
      'maya_tech_innovator',
      'devon_systems_engineer'
    ],
    visitedScenes: [
      'samuel_introduction',
      'station_hub',
      'maya_introduction',
      'devon_introduction'
    ],
    demonstratedSkills: [
      'systems_thinking',
      'analytical_reasoning',
      'creative_problem_solving',
      'technical_communication',
      'pattern_recognition',
      'active_listening',
      'empathy'
    ]
  },
  version: 1
})

/**
 * High trust with Maya - Vulnerability arc accessible
 */
const createHighTrustState = () => ({
  state: {
    currentSceneId: 'maya_vulnerability_setup',
    hasStarted: true,
    showIntro: false,
    patterns: {
      analytical: 5,
      building: 3,
      helping: 4,
      patience: 3,
      exploring: 2
    },
    characters: new Map([
      ['maya', {
        characterId: 'maya',
        trust: 6, // Vulnerability threshold
        lastInteractionTimestamp: Date.now() - 1800000,
        encounterCount: 10,
        currentNodeId: 'maya_trust_6'
      }]
    ]),
    globalFlags: [
      'met_maya',
      'maya_trust_high',
      'vulnerability_arc_accessible',
      'analytical_threshold_reached'
    ],
    knowledgeFlags: [
      'maya_family_pressure',
      'maya_tech_background',
      'maya_personal_story'
    ],
    visitedScenes: [
      'samuel_introduction',
      'station_hub',
      'maya_introduction',
      'maya_tech_discussion',
      'maya_deep_conversation'
    ],
    demonstratedSkills: [
      'active_listening',
      'empathy',
      'analytical_reasoning',
      'systems_thinking'
    ]
  },
  version: 1
})

/**
 * Helper to seed state into localStorage
 */
async function seedGameState(page: Page, state: any): Promise<void> {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')

  await page.evaluate((stateToSeed) => {
    // Clear existing state
    localStorage.clear()

    // Mark as test environment
    window.__PLAYWRIGHT__ = true

    // Set new state
    localStorage.setItem('grand-central-terminus-save', JSON.stringify(stateToSeed))
  }, state)

  await page.reload()
  await page.waitForLoadState('networkidle')

  // Click through the welcome screen if it appears
  const continueButton = page.getByRole('button', { name: 'Continue Journey' })
  if (await continueButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await continueButton.click()
    await page.waitForLoadState('networkidle')
    // Wait for game interface with longer timeout for iPad
    await page.waitForSelector('[data-testid="game-interface"]', { timeout: 20000 })
  } else {
    // If no continue button, game interface should already be visible
    await page.waitForSelector('[data-testid="game-interface"]', { timeout: 20000 })
  }
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
    const seedFn = async (customState: Partial<GameState>) => {
      const baseState = createFreshGameState()
      const mergedState = {
        ...baseState,
        state: {
          ...baseState.state,
          ...customState
        }
      }
      await seedGameState(page, mergedState)
    }

    await use(seedFn)
  }
})

export { expect } from '@playwright/test'
