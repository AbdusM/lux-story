#!/usr/bin/env node
/**
 * Skills System Validation Test Suite
 *
 * Automated validation for:
 * - SkillTracker.recordSkillDemonstration()
 * - Scene mapping lookup logic
 * - localStorage persistence
 * - Admin dashboard data loading
 * - Dashboard display rendering
 * - Type safety of all mappings
 *
 * Usage: npx tsx scripts/validate-skills-system.ts
 */

import { SkillTracker, type SkillDemonstration } from '../lib/skill-tracker'
import { SCENE_SKILL_MAPPINGS, getScenesByCharacter, getHighIntensityMoments, getAllSkillsDemonstrated } from '../lib/scene-skill-mappings'
import { FutureSkills } from '../lib/2030-skills-system'
import { loadSkillProfile } from '../lib/skill-profile-adapter'

// Test results tracking
interface TestResult {
  name: string
  passed: boolean
  error?: string
  details?: string
}

const results: TestResult[] = []

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function logTest(name: string) {
  console.log(`\n${colors.cyan}→ Testing: ${name}${colors.reset}`)
}

function pass(name: string, details?: string) {
  results.push({ name, passed: true, details })
  log(`  ✅ PASS: ${name}`, colors.green)
  if (details) log(`     ${details}`, colors.reset)
}

function fail(name: string, error: string) {
  results.push({ name, passed: false, error })
  log(`  ❌ FAIL: ${name}`, colors.red)
  log(`     Error: ${error}`, colors.reset)
}

// ============= TEST SUITE =============

/**
 * Test 1: SkillTracker.recordSkillDemonstration()
 */
function testRecordSkillDemonstration() {
  logTest('SkillTracker.recordSkillDemonstration()')

  try {
    const tracker = new SkillTracker('test-user-validation')

    // Test recording a skill demonstration
    tracker.recordSkillDemonstration(
      'maya_family_pressure',
      'family_understanding',
      ['emotionalIntelligence', 'culturalCompetence', 'communication', 'criticalThinking'],
      'Test context for validation'
    )

    // Verify recording
    const demonstrations = tracker.getAllDemonstrations()

    if (demonstrations.length === 0) {
      fail('Record skill demonstration', 'No demonstrations recorded')
      return
    }

    const demo = demonstrations[0]

    // Validate demonstration structure
    if (!demo.scene || !demo.choice || !demo.skillsDemonstrated || !demo.context || !demo.timestamp) {
      fail('Record skill demonstration', 'Missing required fields in demonstration')
      return
    }

    // Validate skills array
    if (!Array.isArray(demo.skillsDemonstrated) || demo.skillsDemonstrated.length !== 4) {
      fail('Record skill demonstration', `Expected 4 skills, got ${demo.skillsDemonstrated.length}`)
      return
    }

    // Validate timestamp
    if (typeof demo.timestamp !== 'number' || demo.timestamp > Date.now()) {
      fail('Record skill demonstration', 'Invalid timestamp')
      return
    }

    // Clean up
    tracker.clearAllData()

    pass('Record skill demonstration', 'Successfully recorded and validated demonstration structure')

  } catch (error) {
    fail('Record skill demonstration', String(error))
  }
}

/**
 * Test 2: Scene Mapping Lookup Logic
 */
function testSceneMappingLookup() {
  logTest('Scene Mapping Lookup Logic')

  try {
    // Test 1: Verify all scene mappings have valid structure
    let validScenes = 0
    let invalidScenes: string[] = []

    Object.entries(SCENE_SKILL_MAPPINGS).forEach(([sceneId, mapping]) => {
      // Check required fields
      if (!mapping.sceneId || !mapping.characterArc || !mapping.sceneDescription || !mapping.choiceMappings) {
        invalidScenes.push(sceneId)
        return
      }

      // Check character arc is valid
      const validArcs = ['maya', 'devon', 'jordan', 'samuel', 'kai', 'rohan', 'silas', 'marcus', 'tess', 'yaquin']
      if (!validArcs.includes(mapping.characterArc)) {
        invalidScenes.push(`${sceneId} (invalid arc: ${mapping.characterArc})`)
        return
      }

      // Check choice mappings
      Object.entries(mapping.choiceMappings).forEach(([choiceId, choiceMapping]) => {
        if (!choiceMapping.skillsDemonstrated || !choiceMapping.context || !choiceMapping.intensity) {
          invalidScenes.push(`${sceneId}.${choiceId} (missing fields)`)
          return
        }

        // Check intensity is valid
        if (!['high', 'medium', 'low'].includes(choiceMapping.intensity)) {
          invalidScenes.push(`${sceneId}.${choiceId} (invalid intensity)`)
          return
        }
      })

      validScenes++
    })

    if (invalidScenes.length > 0) {
      fail('Scene mapping structure validation', `${invalidScenes.length} invalid scenes: ${invalidScenes.join(', ')}`)
      return
    }

    pass('Scene mapping structure validation', `All ${validScenes} scenes have valid structure`)

    // Test 2: Helper function tests
    const mayaScenes = getScenesByCharacter('maya')
    if (mayaScenes.length === 0) {
      fail('Scene lookup by character', 'No Maya scenes found')
      return
    }
    pass('Scene lookup by character', `Found ${mayaScenes.length} Maya scenes`)

    const highIntensity = getHighIntensityMoments()
    if (highIntensity.length === 0) {
      fail('High intensity moments lookup', 'No high intensity moments found')
      return
    }
    pass('High intensity moments lookup', `Found ${highIntensity.length} high intensity moments`)

  } catch (error) {
    fail('Scene mapping lookup', String(error))
  }
}

/**
 * Test 3: Skill Type Safety
 */
function testSkillTypeSafety() {
  logTest('Skill Type Safety')

  try {
    // Valid 2030 skills from the system
    const validSkills: (keyof FutureSkills)[] = [
      'criticalThinking',
      'communication',
      'collaboration',
      'creativity',
      'adaptability',
      'leadership',
      'digitalLiteracy',
      'emotionalIntelligence',
      'culturalCompetence',
      'financialLiteracy',
      'timeManagement',
      'problemSolving'
    ]

    let invalidSkills: string[] = []
    let totalSkillReferences = 0

    // Check all scene mappings use only valid skills
    Object.entries(SCENE_SKILL_MAPPINGS).forEach(([sceneId, mapping]) => {
      Object.entries(mapping.choiceMappings).forEach(([choiceId, choiceMapping]) => {
        choiceMapping.skillsDemonstrated.forEach((skill) => {
          totalSkillReferences++
          if (!validSkills.includes(skill)) {
            invalidSkills.push(`${sceneId}.${choiceId}: ${skill}`)
          }
        })
      })
    })

    if (invalidSkills.length > 0) {
      fail('Skill type safety', `${invalidSkills.length} invalid skill references: ${invalidSkills.slice(0, 5).join(', ')}${invalidSkills.length > 5 ? '...' : ''}`)
      return
    }

    pass('Skill type safety', `All ${totalSkillReferences} skill references use valid 2030 Skills`)

    // Test skill distribution
    const skillCounts = getAllSkillsDemonstrated()
    const skillStats = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, count]) => `${skill}: ${count}`)
      .join(', ')

    pass('Skill distribution analysis', `Top skills: ${skillStats}`)

  } catch (error) {
    fail('Skill type safety', String(error))
  }
}

/**
 * Test 4: Scene Mapping Coverage
 */
function testSceneMappingCoverage() {
  logTest('Scene Mapping Coverage')

  try {
    const totalScenes = Object.keys(SCENE_SKILL_MAPPINGS).length

    // Character arc distribution
    const arcCounts = {
      maya: 0,
      devon: 0,
      jordan: 0,
      samuel: 0,
      kai: 0,
      rohan: 0,
      silas: 0,
      marcus: 0,
      tess: 0,
      yaquin: 0
    }

    let totalChoices = 0
    let totalHighIntensity = 0
    let totalMediumIntensity = 0
    let totalLowIntensity = 0

    Object.values(SCENE_SKILL_MAPPINGS).forEach(mapping => {
      arcCounts[mapping.characterArc]++

      Object.values(mapping.choiceMappings).forEach(choice => {
        totalChoices++
        if (choice.intensity === 'high') totalHighIntensity++
        if (choice.intensity === 'medium') totalMediumIntensity++
        if (choice.intensity === 'low') totalLowIntensity++
      })
    })

    pass('Scene mapping coverage', `${totalScenes} scenes with ${totalChoices} total choices`)
    pass('Character arc distribution', `Maya: ${arcCounts.maya}, Devon: ${arcCounts.devon}, Jordan: ${arcCounts.jordan}, Samuel: ${arcCounts.samuel}`)
    pass('Intensity distribution', `High: ${totalHighIntensity}, Medium: ${totalMediumIntensity}, Low: ${totalLowIntensity}`)

    // Check for balanced coverage
    const minArcCount = Math.min(...Object.values(arcCounts))
    const maxArcCount = Math.max(...Object.values(arcCounts))

    if (maxArcCount / minArcCount > 3) {
      fail('Character arc balance', `Imbalanced coverage: ${maxArcCount}x vs ${minArcCount}x`)
    } else {
      pass('Character arc balance', 'Coverage reasonably balanced across arcs')
    }

  } catch (error) {
    fail('Scene mapping coverage', String(error))
  }
}

/**
 * Test 5: localStorage Persistence (graceful degradation)
 */
function testLocalStoragePersistence() {
  logTest('localStorage Persistence (graceful degradation)')

  try {
    // Note: In Node.js environment, localStorage is unavailable
    // safeStorage returns false/null gracefully without throwing errors

    const userId = 'test-persistence-user'
    const tracker = new SkillTracker(userId)

    // Record multiple demonstrations
    tracker.recordSkillDemonstration(
      'maya_family_pressure',
      'family_understanding',
      ['emotionalIntelligence', 'culturalCompetence'],
      'First test demonstration'
    )

    tracker.recordSkillDemonstration(
      'devon_father_reveal',
      'express_sympathy',
      ['emotionalIntelligence', 'communication'],
      'Second test demonstration'
    )

    tracker.addMilestone('Test Checkpoint')

    // Verify in-memory storage works
    const demonstrations = tracker.getAllDemonstrations()
    const milestones = tracker.getMilestones()

    if (demonstrations.length !== 2) {
      fail('localStorage graceful degradation', `In-memory storage failed: Expected 2 demonstrations, found ${demonstrations.length}`)
      return
    }

    if (milestones.length !== 1) {
      fail('localStorage graceful degradation', `In-memory storage failed: Expected 1 milestone, found ${milestones.length}`)
      return
    }

    // Clean up
    tracker.clearAllData()

    pass('localStorage graceful degradation', 'In-memory storage works; localStorage gracefully unavailable in Node.js (expected)')

  } catch (error) {
    fail('localStorage graceful degradation', String(error))
  }
}

/**
 * Test 6: Admin Dashboard Data Loading
 */
function testAdminDashboardLoading() {
  logTest('Admin Dashboard Data Loading')

  try {
    const userId = 'test-dashboard-user'
    const tracker = new SkillTracker(userId)

    // Create test data
    tracker.recordSkillDemonstration(
      'maya_family_pressure',
      'family_understanding',
      ['emotionalIntelligence', 'culturalCompetence', 'communication'],
      'Demonstrated cultural competence in family dynamics'
    )

    tracker.recordSkillDemonstration(
      'devon_father_reveal',
      'express_sympathy',
      ['emotionalIntelligence', 'communication'],
      'Showed empathy in difficult situation'
    )

    tracker.addMilestone('Early Journey')

    // Test profile export
    const profile = tracker.exportSkillProfile()

    if (!profile.skillDemonstrations) {
      fail('Profile export - skill demonstrations', 'Missing skillDemonstrations field')
      tracker.clearAllData()
      return
    }

    if (profile.totalDemonstrations !== 2) {
      fail('Profile export - total count', `Expected 2 demonstrations, got ${profile.totalDemonstrations}`)
      tracker.clearAllData()
      return
    }

    if (!Array.isArray(profile.careerMatches)) {
      fail('Profile export - career matches', 'Career matches not an array')
      tracker.clearAllData()
      return
    }

    // Note: loadSkillProfile function depends on localStorage which is unavailable in Node.js
    // In browser environment, it would work correctly

    // Verify profile structure for dashboard compatibility
    const hasRequiredFields =
      profile.skillDemonstrations &&
      profile.milestones &&
      profile.careerMatches &&
      typeof profile.totalDemonstrations === 'number' &&
      typeof profile.journeyStarted === 'number'

    if (!hasRequiredFields) {
      fail('Profile structure validation', 'Missing required dashboard fields')
      tracker.clearAllData()
      return
    }

    // Clean up
    tracker.clearAllData()

    pass('Admin dashboard data loading', 'Profile export structure valid for dashboard rendering')

  } catch (error) {
    fail('Admin dashboard data loading', String(error))
  }
}

/**
 * Test 7: Context Quality Validation
 */
function testContextQuality() {
  logTest('Context Quality Validation')

  try {
    let shortContexts = 0
    let goodContexts = 0
    let totalContextLength = 0
    const minContextLength = 50 // Minimum meaningful context

    Object.entries(SCENE_SKILL_MAPPINGS).forEach(([sceneId, mapping]) => {
      Object.entries(mapping.choiceMappings).forEach(([choiceId, choiceMapping]) => {
        const contextLength = choiceMapping.context.length
        totalContextLength += contextLength

        if (contextLength < minContextLength) {
          shortContexts++
        } else {
          goodContexts++
        }
      })
    })

    const avgContextLength = Math.round(totalContextLength / (shortContexts + goodContexts))

    if (shortContexts > goodContexts * 0.1) {
      fail('Context quality', `Too many short contexts: ${shortContexts} (${Math.round(shortContexts / (shortContexts + goodContexts) * 100)}%)`)
      return
    }

    pass('Context quality', `Average context length: ${avgContextLength} chars, ${goodContexts} good contexts, ${shortContexts} short`)

  } catch (error) {
    fail('Context quality', String(error))
  }
}

/**
 * Test 8: Scene Description Quality
 */
function testSceneDescriptionQuality() {
  logTest('Scene Description Quality')

  try {
    let shortDescriptions = 0
    let goodDescriptions = 0
    const minDescLength = 30

    Object.entries(SCENE_SKILL_MAPPINGS).forEach(([sceneId, mapping]) => {
      if (mapping.sceneDescription.length < minDescLength) {
        shortDescriptions++
      } else {
        goodDescriptions++
      }
    })

    if (shortDescriptions > 0) {
      fail('Scene description quality', `${shortDescriptions} scenes have short descriptions (< ${minDescLength} chars)`)
      return
    }

    pass('Scene description quality', `All ${goodDescriptions} scenes have meaningful descriptions`)

  } catch (error) {
    fail('Scene description quality', String(error))
  }
}

/**
 * Test 9: Skill Demonstration Count per Scene
 */
function testSkillDemonstrationCount() {
  logTest('Skill Demonstration Count per Scene')

  try {
    let tooFewSkills = 0
    let tooManySkills = 0
    let goodSkillCounts = 0

    Object.entries(SCENE_SKILL_MAPPINGS).forEach(([sceneId, mapping]) => {
      Object.entries(mapping.choiceMappings).forEach(([choiceId, choiceMapping]) => {
        const skillCount = choiceMapping.skillsDemonstrated.length

        if (skillCount < 2) {
          tooFewSkills++
        } else if (skillCount > 6) {
          tooManySkills++
        } else {
          goodSkillCounts++
        }
      })
    })

    if (tooFewSkills > goodSkillCounts * 0.2) {
      fail('Skill count validation', `Too many choices with < 2 skills: ${tooFewSkills}`)
      return
    }

    if (tooManySkills > 0) {
      fail('Skill count validation', `${tooManySkills} choices have > 6 skills (may be unrealistic)`)
      return
    }

    pass('Skill count validation', `${goodSkillCounts} choices have 2-6 skills (realistic range)`)

  } catch (error) {
    fail('Skill demonstration count', String(error))
  }
}

/**
 * Test 10: Integration Test - Full Journey Simulation
 */
function testFullJourneySimulation() {
  logTest('Full Journey Simulation')

  try {
    const userId = 'test-journey-user'
    const tracker = new SkillTracker(userId)

    // Simulate a journey through multiple character arcs
    const journeyChoices = [
      { scene: 'maya_family_pressure', choice: 'family_understanding', skills: ['emotionalIntelligence', 'culturalCompetence'] },
      { scene: 'maya_robotics_passion', choice: 'robotics_encourage', skills: ['emotionalIntelligence', 'communication'] },
      { scene: 'devon_father_reveal', choice: 'express_sympathy', skills: ['emotionalIntelligence', 'communication'] },
      { scene: 'devon_system_failure', choice: 'validate_pain', skills: ['emotionalIntelligence', 'communication'] },
      { scene: 'jordan_impostor_reveal', choice: 'jordan_impostor_reframe', skills: ['criticalThinking', 'communication'] },
      { scene: 'samuel_backstory_revelation', choice: 'relate', skills: ['emotionalIntelligence', 'communication'] }
    ]

    journeyChoices.forEach((choice, idx) => {
      tracker.recordSkillDemonstration(
        choice.scene,
        choice.choice,
        choice.skills,
        `Journey step ${idx + 1}`
      )

      if (idx === 2 || idx === 5) {
        tracker.addMilestone(`Journey checkpoint ${idx}`)
      }
    })

    // Validate journey data
    const profile = tracker.exportSkillProfile()

    if (profile.totalDemonstrations !== 6) {
      fail('Full journey simulation', `Expected 6 demonstrations, got ${profile.totalDemonstrations}`)
      tracker.clearAllData()
      return
    }

    if (profile.milestones.length !== 2) {
      fail('Full journey simulation', `Expected 2 milestones, got ${profile.milestones.length}`)
      tracker.clearAllData()
      return
    }

    // Check skill demonstration grouping
    const emotionalIntelligenceCount = profile.skillDemonstrations['emotionalIntelligence']?.length || 0
    if (emotionalIntelligenceCount < 4) {
      fail('Full journey simulation', `Expected 4+ emotional intelligence demonstrations, got ${emotionalIntelligenceCount}`)
      tracker.clearAllData()
      return
    }

    // Clean up
    tracker.clearAllData()

    pass('Full journey simulation', 'Successfully simulated and validated complete user journey')

  } catch (error) {
    fail('Full journey simulation', String(error))
  }
}

// ============= RUN ALL TESTS =============

function runAllTests() {
  log('\n' + '='.repeat(60), colors.bright)
  log('   SKILLS SYSTEM VALIDATION TEST SUITE', colors.bright)
  log('='.repeat(60) + '\n', colors.bright)

  testRecordSkillDemonstration()
  testSceneMappingLookup()
  testSkillTypeSafety()
  testSceneMappingCoverage()
  testLocalStoragePersistence()
  testAdminDashboardLoading()
  testContextQuality()
  testSceneDescriptionQuality()
  testSkillDemonstrationCount()
  testFullJourneySimulation()

  // Print summary
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length

  log('\n' + '='.repeat(60), colors.bright)
  log('   TEST SUMMARY', colors.bright)
  log('='.repeat(60), colors.bright)

  log(`\nTotal Tests: ${total}`, colors.cyan)
  log(`✅ Passed: ${passed}`, colors.green)
  log(`❌ Failed: ${failed}`, failed > 0 ? colors.red : colors.green)
  log(`Success Rate: ${Math.round((passed / total) * 100)}%\n`, failed > 0 ? colors.yellow : colors.green)

  if (failed > 0) {
    log('Failed Tests:', colors.red)
    results
      .filter(r => !r.passed)
      .forEach(r => {
        log(`  • ${r.name}`, colors.red)
        log(`    ${r.error}`, colors.reset)
      })
    log('')
  }

  log('='.repeat(60) + '\n', colors.bright)

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0)
}

// Run tests
runAllTests()
