/**
 * Max Unlock State Generator
 * Programmatically creates maximally unlocked game state for visual testing
 *
 * Usage:
 *   await createMaxUnlockState(page, { trustLevel: 10, patternLevel: 10 })
 */

import { Page } from '@playwright/test'

export interface MaxUnlockConfig {
  trustLevel: number          // 0-10 (default: 10)
  patternLevel: number        // 0-10+ (default: 10)
  skillDemonstrations: number // per skill (default: 5)
  unlockSimulations: boolean  // (default: true)
  unlockAllFlags: boolean     // (default: true)
}

/**
 * Main orchestrator - creates maximally unlocked game state
 */
export async function createMaxUnlockState(
  page: Page,
  config: Partial<MaxUnlockConfig> = {}
): Promise<void> {
  const defaults: MaxUnlockConfig = {
    trustLevel: 10,
    patternLevel: 10,
    skillDemonstrations: 5,
    unlockSimulations: true,
    unlockAllFlags: true
  }

  const cfg = { ...defaults, ...config }

  console.log('🔓 Creating max unlock state...')

  // 1. Unlock all 20 characters
  await unlockAllCharacters(page, cfg.trustLevel)

  // 2. Max all 5 patterns
  await unlockAllPatterns(page, cfg.patternLevel)

  // 3. Demonstrate all skills
  await demonstrateAllSkills(page, cfg.skillDemonstrations)

  // 4. Unlock all 20 simulations
  if (cfg.unlockSimulations) {
    await unlockAllSimulations(page)
  }

  // 5. Set all knowledge flags
  if (cfg.unlockAllFlags) {
    await setAllKnowledgeFlags(page)
    await unlockAllMysteries(page)
    await unlockAllPlatforms(page)
  }

  console.log('✅ Max unlock state created')
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Unlock all 20 characters at specified trust level
 */
async function unlockAllCharacters(page: Page, trustLevel: number) {
  const count = await page.evaluate(({ trust }) => {
    const godMode = (window as any).godMode
    const characterIds = godMode.listCharacters()

    for (const charId of characterIds) {
      godMode.setTrust(charId, trust)
      // Add vulnerability flags
      godMode.addKnowledgeFlag(charId, `${charId}_vulnerability_revealed`)
      godMode.addKnowledgeFlag(charId, `${charId}_depth_unlocked`)
    }

    return characterIds.length
  }, { trust: trustLevel })

  console.log(`  ✓ ${count} characters at trust=${trustLevel}`)
}

/**
 * Max all 5 patterns to specified level
 */
async function unlockAllPatterns(page: Page, level: number) {
  await page.evaluate(({ lvl }) => {
    const godMode = (window as any).godMode
    godMode.setAllPatterns(lvl)
  }, { lvl: level })

  console.log(`  ✓ All 5 patterns at level ${level}`)
}

/**
 * Demonstrate all skills with specified count
 */
async function demonstrateAllSkills(page: Page, count: number) {
  const skillCount = await page.evaluate(({ c }) => {
    const godMode = (window as any).godMode
    const skills = [
      // Core cognitive skills
      'critical_thinking', 'problem_solving', 'systems_thinking',
      'digital_literacy', 'technical_literacy', 'information_literacy',
      'strategic_thinking',

      // Emotional intelligence
      'emotional_intelligence', 'empathy', 'patience',
      'cultural_competence', 'mentorship', 'encouragement',

      // Collaboration
      'collaboration', 'communication', 'active_listening',
      'public_speaking',

      // Personal effectiveness
      'adaptability', 'resilience', 'self_awareness',
      'time_management', 'organization', 'project_management',

      // Leadership & influence
      'decision_making', 'conflict_resolution', 'negotiation',
      'persuasion', 'networking', 'leadership', 'delegation',
      'coaching', 'vision_casting',

      // Innovation
      'innovation', 'creativity', 'design_thinking',
      'prototyping', 'iteration',

      // Analysis & research
      'research', 'data_analysis', 'critical_evaluation',
      'synthesis',

      // Communication & presentation
      'presentation', 'storytelling', 'technical_writing',
      'visual_design'
    ]

    for (const skill of skills) {
      godMode.demonstrateSkill(skill, c)
    }

    return skills.length
  }, { c: count })

  console.log(`  ✓ ${skillCount} skills demonstrated (count: ${count})`)
}

/**
 * Unlock all 20 simulations
 */
async function unlockAllSimulations(page: Page) {
  await page.evaluate(() => {
    const godMode = (window as any).godMode
    godMode.unlockAllSimulations()
  })

  console.log(`  ✓ All simulations unlocked`)
}

/**
 * Set all character and global knowledge flags
 */
async function setAllKnowledgeFlags(page: Page) {
  const flagCount = await page.evaluate(() => {
    const godMode = (window as any).godMode
    const flags = [
      // Character vulnerability flags (20 total)
      'maya_vulnerability_revealed', 'marcus_vulnerability_revealed',
      'devon_vulnerability_revealed', 'rohan_vulnerability_revealed',
      'kai_vulnerability_revealed', 'tess_vulnerability_revealed',
      'yaquin_vulnerability_revealed', 'grace_vulnerability_revealed',
      'elena_vulnerability_revealed', 'alex_vulnerability_revealed',
      'jordan_vulnerability_revealed', 'silas_vulnerability_revealed',
      'asha_vulnerability_revealed', 'lira_vulnerability_revealed',
      'zara_vulnerability_revealed', 'quinn_vulnerability_revealed',
      'dante_vulnerability_revealed', 'nadia_vulnerability_revealed',
      'isaiah_vulnerability_revealed', 'samuel_depth_revealed',

      // Global story flags
      'first_journey_complete', 'constellation_unlocked',
      'skills_revealed', 'analytical_threshold_reached',
      'patterns_discovered', 'journal_unlocked'
    ]

    for (const flag of flags) {
      godMode.addGlobalFlag(flag)
    }

    return flags.length
  })

  console.log(`  ✓ ${flagCount} knowledge flags set`)
}

/**
 * Unlock all 4 mysteries
 */
async function unlockAllMysteries(page: Page) {
  await page.evaluate(() => {
    const godMode = (window as any).godMode
    godMode.setMystery('letterSender', 'self_revealed')
    godMode.setMystery('platformSeven', 'revealed')
    godMode.setMystery('samuelsPast', 'revealed')
    godMode.setMystery('stationNature', 'mastered')
  })

  console.log(`  ✓ All 4 mysteries unlocked`)
}

/**
 * Unlock all 5 platforms at max resonance
 */
async function unlockAllPlatforms(page: Page) {
  const platformCount = await page.evaluate(() => {
    const godMode = (window as any).godMode
    const platforms = ['p1', 'p3', 'p7', 'p9', 'forgotten']

    for (const platform of platforms) {
      godMode.setPlatform(platform, true, 10)
    }

    return platforms.length
  })

  console.log(`  ✓ ${platformCount} platforms at resonance=10`)
}
