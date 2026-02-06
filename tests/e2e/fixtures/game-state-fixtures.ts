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
   * Accepts partial game state with legacy field support for migration
   */
  seedState: (state: Record<string, unknown>) => Promise<void>
}

/**
 * Minimal game state template - matches SerializableGameState
 */
const createFreshGameState = () => ({
  saveVersion: '1.0',
  playerId: `test-${Date.now()}`,
  currentNodeId: 'samuel_introduction',
  currentCharacterId: 'samuel',
  patterns: {
    analytical: 0,
    building: 0,
    helping: 0,
    patience: 0,
    exploring: 0
  },
  characters: [],
  globalFlags: [],
  lastSaved: Date.now(),
  thoughts: [],
  episodeNumber: 1,
  sessionStartTime: Date.now(),
  sessionBoundariesCrossed: 0,
  platforms: {},
  careerValues: { directImpact: 0, systemsThinking: 0, dataInsights: 0, futureBuilding: 0, independence: 0 },
  mysteries: { letterSender: 'unknown', platformSeven: 'stable', samuelsPast: 'hidden', stationNature: 'unknown' },
  time: { currentDisplay: '23:47', minutesRemaining: 13, flowRate: 1.0, isStopped: false },
  quietHour: { potential: true, experienced: [] },
  overdensity: 0.3,
  items: { letter: 'kept', discoveredPaths: [] },
  pendingCheckIns: [],
  unlockedAbilities: [],
  archivistState: { collectedRecords: [], verifiedLore: [], sensoryCalibration: {} },
  skillLevels: {},
  skillUsage: []
})

/**
 * Complete journey state template
 * Represents a player who has completed 2 character arcs
 */
const createJourneyCompleteState = () => ({
  saveVersion: '1.0',
  playerId: `test-journey-${Date.now()}`,
  currentNodeId: 'samuel_hub_return', // Valid hub node for returning players
  currentCharacterId: 'samuel',
  patterns: {
    analytical: 3,
    building: 2,
    helping: 4,
    patience: 2,
    exploring: 3
  },
  characters: [
    {
      characterId: 'maya',
      trust: 5,
      anxiety: 50,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: ['maya_family_pressure'],
      relationshipStatus: 'acquaintance',
      conversationHistory: []
    },
    {
      characterId: 'marcus',
      trust: 4,
      anxiety: 60,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: ['marcus_healthcare_mission'],
      relationshipStatus: 'acquaintance',
      conversationHistory: []
    },
    {
      characterId: 'samuel',
      trust: 3,
      anxiety: 70,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: ['samuel_conductor_role'],
      relationshipStatus: 'acquaintance',
      conversationHistory: []
    }
  ],
  globalFlags: [
    'first_journey_complete',
    'met_maya',
    'met_marcus',
    'met_samuel',
    'analytical_threshold_reached',
    'helping_threshold_reached'
  ],
  lastSaved: Date.now(),
  thoughts: [],
  episodeNumber: 2,
  sessionStartTime: Date.now(),
  sessionBoundariesCrossed: 1,
  platforms: {},
  careerValues: { directImpact: 0, systemsThinking: 0, dataInsights: 0, futureBuilding: 0, independence: 0 },
  mysteries: { letterSender: 'unknown', platformSeven: 'stable', samuelsPast: 'hidden', stationNature: 'unknown' },
  time: { currentDisplay: '23:47', minutesRemaining: 13, flowRate: 1.0, isStopped: false },
  quietHour: { potential: true, experienced: [] },
  overdensity: 0.3,
  items: { letter: 'kept', discoveredPaths: [] },
  pendingCheckIns: [],
  unlockedAbilities: [],
  archivistState: { collectedRecords: [], verifiedLore: [], sensoryCalibration: {} },
  skillLevels: { active_listening: 1, systems_thinking: 1, empathy: 1 },
  skillUsage: []
})

/**
 * State with demonstrated skills for constellation
 */
const createDemonstratedSkillsState = () => ({
  saveVersion: '1.0',
  playerId: `test-skills-${Date.now()}`,
  currentNodeId: 'samuel_hub_return', // Valid hub node
  currentCharacterId: 'samuel',
  patterns: {
    analytical: 4,
    building: 3,
    helping: 3,
    patience: 2,
    exploring: 4
  },
  characters: [
    {
      characterId: 'maya',
      trust: 4,
      anxiety: 60,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: ['maya_tech_innovator'],
      relationshipStatus: 'acquaintance',
      conversationHistory: []
    },
    {
      characterId: 'devon',
      trust: 3,
      anxiety: 70,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: ['devon_systems_engineer'],
      relationshipStatus: 'acquaintance',
      conversationHistory: []
    }
  ],
  globalFlags: [
    'constellation_unlocked',
    'skills_revealed',
    'met_maya',
    'met_devon',
    'analytical_threshold_reached'
  ],
  lastSaved: Date.now(),
  thoughts: [],
  episodeNumber: 1,
  sessionStartTime: Date.now(),
  sessionBoundariesCrossed: 0,
  platforms: {},
  careerValues: { directImpact: 0, systemsThinking: 0, dataInsights: 0, futureBuilding: 0, independence: 0 },
  mysteries: { letterSender: 'unknown', platformSeven: 'stable', samuelsPast: 'hidden', stationNature: 'unknown' },
  time: { currentDisplay: '23:47', minutesRemaining: 13, flowRate: 1.0, isStopped: false },
  quietHour: { potential: true, experienced: [] },
  overdensity: 0.3,
  items: { letter: 'kept', discoveredPaths: [] },
  pendingCheckIns: [],
  unlockedAbilities: [],
  archivistState: { collectedRecords: [], verifiedLore: [], sensoryCalibration: {} },
  skillLevels: {
    systems_thinking: 2,
    analytical_reasoning: 2,
    creative_problem_solving: 1,
    technical_communication: 1,
    pattern_recognition: 1,
    active_listening: 1,
    empathy: 1
  },
  skillUsage: []
})

/**
 * High trust with Maya - Vulnerability arc accessible
 */
const createHighTrustState = () => ({
  saveVersion: '1.0',
  playerId: `test-hightrust-${Date.now()}`,
  currentNodeId: 'maya_vulnerability_arc',
  currentCharacterId: 'maya',
  patterns: {
    analytical: 5,
    building: 3,
    helping: 4,
    patience: 3,
    exploring: 2
  },
  characters: [
    {
      characterId: 'maya',
      trust: 6, // Vulnerability threshold
      anxiety: 40,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      knowledgeFlags: ['maya_family_pressure', 'maya_tech_background', 'maya_personal_story'],
      relationshipStatus: 'confidant',
      conversationHistory: []
    }
  ],
  globalFlags: [
    'met_maya',
    'maya_trust_high',
    'vulnerability_arc_accessible',
    'analytical_threshold_reached'
  ],
  lastSaved: Date.now(),
  thoughts: [],
  episodeNumber: 1,
  sessionStartTime: Date.now(),
  sessionBoundariesCrossed: 0,
  platforms: {},
  careerValues: { directImpact: 0, systemsThinking: 0, dataInsights: 0, futureBuilding: 0, independence: 0 },
  mysteries: { letterSender: 'unknown', platformSeven: 'stable', samuelsPast: 'hidden', stationNature: 'unknown' },
  time: { currentDisplay: '23:47', minutesRemaining: 13, flowRate: 1.0, isStopped: false },
  quietHour: { potential: true, experienced: [] },
  overdensity: 0.3,
  items: { letter: 'kept', discoveredPaths: [] },
  pendingCheckIns: [],
  unlockedAbilities: [],
  archivistState: { collectedRecords: [], verifiedLore: [], sensoryCalibration: {} },
  skillLevels: { active_listening: 2, empathy: 2, analytical_reasoning: 1, systems_thinking: 1 },
  skillUsage: []
})

/**
 * Helper to seed state into localStorage
 */
async function seedGameState(page: Page, state: any): Promise<void> {
  // `/` is gated behind either an authenticated Supabase user or the guest-mode
  // cookie. In E2E we generally run unauthenticated, so ensure the cookie is set
  // before navigating to `/` to avoid being redirected to `/welcome`.
  await page.context().addCookies([
    { name: 'lux_guest_mode', value: 'true', url: 'http://127.0.0.1:3005' },
    { name: 'lux_guest_mode', value: 'true', url: 'http://localhost:3005' },
  ])

  // Ensure localStorage access is scoped to the app origin.
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  // Seed localStorage after initial navigation, then reload once to boot from save.
  // This approach supports re-seeding multiple times within a single test (e.g.
  // character-smoke loops), and avoids persistent init scripts that can clobber
  // state during `page.reload()` assertions.
  await page.evaluate(({ stateToSeed, guestModeKey }) => {
    localStorage.clear()
    // Mark as test environment
    // @ts-ignore - injected by e2e harness
    window.__PLAYWRIGHT__ = true
    // Match real guest entry (`/welcome` sets both localStorage + cookie)
    localStorage.setItem(guestModeKey, 'true')
    localStorage.setItem('lux_story_v2_game_save', JSON.stringify(stateToSeed))
  }, { stateToSeed: state, guestModeKey: 'lux_story_v2_guest_mode' })

  await page.reload({ waitUntil: 'domcontentloaded' })

  const gameInterface = page.locator('[data-testid="game-interface"]')

  // Click through the continue screen if it appears
  const continueButton = page.getByRole('button', { name: 'Continue Journey' })
  // The continue screen is rendered client-side, so it can appear a few seconds
  // after `domcontentloaded` on slower machines / cold Next dev server starts.
  const hasContinue = await continueButton
    .waitFor({ state: 'visible', timeout: 15000 })
    .then(() => true)
    .catch(() => false)

  if (hasContinue) {
    await continueButton.click()
  }

  // Wait for game interface with longer timeout for iPad.
  await gameInterface.waitFor({ state: 'visible', timeout: 20000 })
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
    const seedFn = async (customState: Record<string, unknown>) => {
      const baseState = createFreshGameState()
      // Map legacy field names to new structure
      const mappedState = { ...customState }
      if ('currentSceneId' in mappedState) {
        // @ts-ignore - legacy field migration
        mappedState.currentNodeId = mappedState.currentSceneId
        // @ts-ignore
        delete mappedState.currentSceneId
      }
      // Remove legacy fields that don't exist in SerializableGameState
      // @ts-ignore
      delete mappedState.hasStarted
      // @ts-ignore
      delete mappedState.showIntro
      // @ts-ignore
      delete mappedState.visitedScenes
      // @ts-ignore
      delete mappedState.knowledgeFlags

      const mergedState = {
        ...baseState,
        ...mappedState
      }
      await seedGameState(page, mergedState)
    }

    await use(seedFn)
  }
})

export { expect } from '@playwright/test'
