/**
 * Generate Test User Data for Dashboard Testing
 * Run with: npx tsx scripts/generate-test-user.ts
 */

import { SkillTracker } from '../lib/skill-tracker'

const TEST_USER_ID = 'test_jamal_2025'

console.log('🎭 Generating test user data for dashboard...\n')

const tracker = new SkillTracker(TEST_USER_ID)

// Simulate 15 skill demonstrations across multiple scenes
const testDemonstrations = [
  {
    sceneId: 'maya_family_pressure',
    choiceId: 'family_understanding',
    skills: ['emotionalIntelligence', 'culturalCompetence', 'communication', 'criticalThinking'],
    context: 'Reframed parental sacrifice from obligation to investment in authentic success'
  },
  {
    sceneId: 'maya_robotics_passion',
    choiceId: 'encourage_passion',
    skills: ['emotionalIntelligence', 'communication'],
    context: 'Validated authentic passion for robotics despite family pressure for medicine'
  },
  {
    sceneId: 'devon_father_reveal',
    choiceId: 'express_sympathy',
    skills: ['emotionalIntelligence', 'communication'],
    context: 'Showed empathy for grief while respecting Devon\'s coping mechanism'
  },
  {
    sceneId: 'devon_uab_systems_engineering',
    choiceId: 'affirm_systems',
    skills: ['problemSolving', 'communication'],
    context: 'Recognized systems thinking as legitimate intellectual framework'
  },
  {
    sceneId: 'jordan_mentor_context',
    choiceId: 'reframe_learning',
    skills: ['criticalThinking', 'communication', 'adaptability'],
    context: 'Reframed seven jobs as learning journey, not failure pattern'
  },
  {
    sceneId: 'jordan_impostor_reveal',
    choiceId: 'normalize_impostor',
    skills: ['emotionalIntelligence', 'communication'],
    context: 'Normalized impostor syndrome as sign of growth, not inadequacy'
  },
  {
    sceneId: 'samuel_backstory_revelation',
    choiceId: 'ask_why_teach',
    skills: ['criticalThinking', 'emotionalIntelligence'],
    context: 'Asked about motivation for teaching, uncovering meaning-making purpose'
  },
  {
    sceneId: 'samuel_reflect_on_influence',
    choiceId: 'reflect_patterns',
    skills: ['criticalThinking', 'emotionalIntelligence', 'adaptability'],
    context: 'Recognized pattern: helping others clarify paths while exploring own'
  },
  {
    sceneId: 'maya_actionable_path',
    choiceId: 'uab_bridge',
    skills: ['problemSolving', 'communication', 'digitalLiteracy'],
    context: 'Suggested UAB biomedical engineering as bridge between medicine and robotics'
  },
  {
    sceneId: 'devon_crossroads',
    choiceId: 'crossroads_vulnerability',
    skills: ['leadership', 'emotionalIntelligence', 'communication'],
    context: 'Committed to vulnerability in relationship with brother despite fear'
  },
  {
    sceneId: 'jordan_crossroads',
    choiceId: 'crossroads_internal',
    skills: ['leadership', 'emotionalIntelligence', 'criticalThinking', 'adaptability'],
    context: 'Chose internal validation over external metrics for career decisions'
  },
  {
    sceneId: 'maya_crossroads',
    choiceId: 'crossroads_robotics',
    skills: ['leadership', 'communication', 'adaptability'],
    context: 'Supported Maya\'s choice to pursue authentic passion despite family pressure'
  },
  {
    sceneId: 'samuel_teaching_witnessing',
    choiceId: 'witness_acknowledge',
    skills: ['emotionalIntelligence', 'adaptability', 'communication'],
    context: 'Embraced "holding space" as active contribution, not passive default'
  },
  {
    sceneId: 'jordan_chooses_birmingham',
    choiceId: 'jordan_birmingham_affirm',
    skills: ['communication', 'creativity', 'culturalCompetence', 'leadership'],
    context: 'Validated place-based identity narrative and geographic career metaphor'
  },
  {
    sceneId: 'samuel_pattern_observation',
    choiceId: 'accept',
    skills: ['emotionalIntelligence', 'collaboration'],
    context: 'Received Samuel\'s observation with gratitude and presence'
  }
]

testDemonstrations.forEach(demo => {
  tracker.recordSkillDemonstration(
    demo.sceneId,
    demo.choiceId,
    demo.skills as any[],
    demo.context
  )
})

// Add some milestones
tracker.addMilestone('Completed Maya\'s arc - Family dynamics exploration')
tracker.addMilestone('Completed Devon\'s arc - Systems thinking and vulnerability')
tracker.addMilestone('Completed Jordan\'s arc - Non-linear career paths')
tracker.addMilestone('Completed Samuel\'s arc - Pattern recognition and mentorship')

console.log('✅ Test user created successfully!\n')
console.log(`📊 User ID: ${TEST_USER_ID}`)
console.log(`📈 Total demonstrations: ${testDemonstrations.length}`)
console.log(`🎯 Skills demonstrated: ${new Set(testDemonstrations.flatMap(d => d.skills)).size} unique skills`)
console.log(`🏆 Milestones: 4\n`)

console.log('🌐 View dashboard at:')
console.log(`   http://localhost:3003/admin/skills?userId=${TEST_USER_ID}`)
console.log(`   http://localhost:3003/admin (to see user list)\n`)
