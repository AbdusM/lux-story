/**
 * Example: PlayerPersona Skills Integration
 *
 * This example demonstrates how to use the enhanced PlayerPersona system
 * with 2030 skills tracking for AI personalization.
 */

import { getPersonaTracker } from '@/lib/player-persona'
import { createSkillTracker } from '@/lib/skill-tracker'

// Example 1: Track skill demonstration when choice is made
export function exampleTrackSkillFromChoice() {
  const playerId = 'user_123'
  const personaTracker = getPersonaTracker()

  // Simulate a choice with skills metadata
  const choice = {
    id: 'maya_advice_robotics',
    text: 'What about medical robotics? Best of both worlds.',
    skills: ['criticalThinking', 'creativity', 'problemSolving'],
    context: `Demonstrated helping pattern in Maya arc (building confidence). Player chose to suggest medical robotics as a bridge between family expectations and personal passion, showing ability to synthesize conflicting needs into creative solution. This choice revealed Maya's true interests while respecting her family's medical career hopes.`
  }

  // Track the skill demonstration
  const updatedPersona = personaTracker.addSkillDemonstration(
    playerId,
    choice.skills,
    choice.context,
    'maya_revelation'
  )

  console.log('Updated Persona:', {
    recentSkills: updatedPersona.recentSkills,
    topSkills: updatedPersona.topSkills,
    totalChoices: updatedPersona.totalChoices
  })
}

// Example 2: Sync persona with SkillTracker data
export function exampleSyncWithSkillTracker() {
  const playerId = 'user_123'
  const skillTracker = createSkillTracker(playerId)
  const personaTracker = getPersonaTracker()

  // Get all skill demonstrations from SkillTracker
  const allDemonstrations = skillTracker.getAllDemonstrations()

  // Sync to persona
  const syncedPersona = personaTracker.syncFromSkillTracker(playerId, allDemonstrations)

  console.log('Synced Persona:', {
    skillDemonstrationsCount: Object.keys(syncedPersona.skillDemonstrations).length,
    topSkills: syncedPersona.topSkills,
    recentSkills: syncedPersona.recentSkills
  })
}

// Example 3: Generate AI-friendly skill summary
export function exampleGenerateSkillSummaryForAI() {
  const playerId = 'user_123'
  const personaTracker = getPersonaTracker()

  // Get AI-friendly summary
  const skillSummary = personaTracker.getSkillSummaryForAI(playerId)

  console.log('Skill Summary for AI:', skillSummary)
  // Output example:
  // "Recent skills: Critical Thinking (7x), Empathy (5x), Creativity (4x).
  //  Critical Thinking: Demonstrated helping pattern in Maya arc (building confidence).
  //  Empathy: Demonstrated patience pattern in Samuel arc (earning trust).
  //  Creativity: Demonstrated exploring pattern in Devon scene."
}

// Example 4: Use in AI prompt generation
export function exampleUseInAIPrompt() {
  const playerId = 'user_123'
  const personaTracker = getPersonaTracker()

  const persona = personaTracker.getPersona(playerId)
  const skillSummary = personaTracker.getSkillSummaryForAI(playerId)

  // Construct AI prompt for Samuel's reflective dialogue
  const aiPrompt = `
Generate Samuel's dialogue based on what he's observed about the player:

PLAYER PROFILE:
${persona.summaryText}

SKILLS SAMUEL HAS NOTICED:
${skillSummary}

Samuel should subtly reference these observations in his wisdom. Instead of
explicitly naming skills, he should show he's paying attention. For example:
- Instead of "You show critical thinking," say "You have a way of seeing
  solutions others miss."
- Instead of "You demonstrate empathy," say "I notice how you listen, really
  listen, when people speak."

Scene context: Player just helped Maya find her path. Samuel wants to
acknowledge their growth.

Generate Samuel's reflective line (1-2 sentences, authentic Birmingham wisdom):
`

  console.log('AI Prompt:', aiPrompt)

  return aiPrompt
}

// Example 5: Integration in choice processing (useSimpleGame pattern)
export function exampleIntegrateInChoiceProcessing(
  playerId: string,
  choice: any,
  currentSceneId: string
) {
  const personaTracker = getPersonaTracker()
  const skillTracker = createSkillTracker(playerId)

  // 1. Record to SkillTracker (if has skills)
  if (choice.skills && choice.skills.length > 0) {
    skillTracker.recordSkillDemonstration(
      currentSceneId,
      choice.id || choice.text,
      choice.skills,
      choice.context || choice.text
    )
  }

  // 2. Also update Persona directly
  if (choice.skills && choice.skills.length > 0) {
    personaTracker.addSkillDemonstration(
      playerId,
      choice.skills,
      choice.context || choice.text,
      currentSceneId
    )
  }

  // 3. Get updated persona for next AI generation
  const updatedPersona = personaTracker.getPersona(playerId)

  return {
    persona: updatedPersona,
    skillSummary: personaTracker.getSkillSummaryForAI(playerId)
  }
}

// Example 6: Inspect persona insights
export function exampleGetPersonaInsights() {
  const playerId = 'user_123'
  const personaTracker = getPersonaTracker()

  const insights = personaTracker.getPersonaInsights(playerId)

  console.log('Persona Insights:', insights)
  // Output example:
  // [
  //   {
  //     category: 'Pattern',
  //     insight: 'Strong helping tendency (47%)',
  //     confidence: 0.47,
  //     examples: ['7 of 15 choices']
  //   },
  //   {
  //     category: 'Skills',
  //     insight: 'Strong Critical Thinking pattern',
  //     confidence: 0.35,
  //     examples: ['7 demonstrations (35%)']
  //   },
  //   {
  //     category: 'Response Style',
  //     insight: 'deliberate decision maker',
  //     confidence: 0.8,
  //     examples: ['They carefully consider choices before deciding.']
  //   }
  // ]

  return insights
}

// Example 7: Full workflow - Choice to AI Generation
export async function exampleFullWorkflow(playerId: string) {
  const personaTracker = getPersonaTracker()
  const skillTracker = createSkillTracker(playerId)

  // 1. Player makes a choice
  const playerChoice = {
    id: 'samuel_listen_deeply',
    text: 'Tell me about your journey to becoming the station keeper.',
    skills: ['empathy', 'communication', 'emotionalIntelligence'],
    context: `Demonstrated patience pattern in Samuel arc (earning trust). Player took time to listen to Samuel's story about his transition from Southern Company engineer to station keeper, recognizing the emotional weight of his journey and showing genuine interest in his personal narrative.`
  }

  // 2. Track the skill demonstration
  personaTracker.addSkillDemonstration(
    playerId,
    playerChoice.skills,
    playerChoice.context,
    'samuel_deepening_trust'
  )

  // 3. Get enriched persona
  const persona = personaTracker.getPersona(playerId)
  const skillSummary = personaTracker.getSkillSummaryForAI(playerId)

  // 4. Use in next AI generation
  console.log('Enriched Persona for AI:', {
    summaryText: persona.summaryText,
    topSkills: persona.topSkills,
    recentSkills: persona.recentSkills,
    skillSummary
  })

  // 5. This enriched data flows into LiveChoiceEngine
  // The AI now knows:
  // - Player demonstrates empathy (5x)
  // - Player is a deliberate decision maker
  // - Player shows patience and active listening
  // - Recent focus on emotional intelligence

  return {
    persona,
    skillSummary,
    readyForAIGeneration: true
  }
}
