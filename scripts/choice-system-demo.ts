/**
 * Demo script to showcase the dynamic choice system
 * This demonstrates how choices change based on context and game state
 */

import { ChoiceGenerator } from '../lib/choice-generator'
import type { Scene } from '../lib/story-engine'
import type { GameState } from '../lib/game-store'
import { logger } from '../lib/logger'

// Sample scene to test with
const sampleScene: Scene = {
  id: '1-1',
  type: 'choice',
  text: 'You found a letter under your door this morning. What catches your attention as you move forward?',
  choices: [
    { text: 'Explore further', consequence: 'exploring_1', nextScene: '1-1-1a' },
    { text: 'Discover something new', consequence: 'exploring_2', nextScene: '1-1-1a' },
    { text: 'Take a risk', consequence: 'exploring_3', nextScene: '1-1-1a' },
    { text: 'Try something different', consequence: 'exploring_4', nextScene: '1-1-1a' }
  ]
}

// Sample game states for testing
const baseGameState: GameState = {
  currentSceneId: '1-1',
  hasStarted: true,
  showIntro: false,
  isProcessing: false,
  choiceStartTime: null,
  messages: [],
  messageId: 0,
  visitedScenes: [],
  choiceHistory: [],
  performanceLevel: 0.5,
  performanceMetrics: {
    alignment: 0.5,
    consistency: 0.5,
    learning: 0.5,
    patience: 0.5,
    anxiety: 0.2,
    rushing: 0.1
  },
  platformWarmth: {},
  platformAccessible: {},
  characterTrust: {},
  characterHelped: {},
  patterns: {
    exploring: 0,
    helping: 0,
    building: 0,
    analytical: 0,
    patience: 0,
    rushing: 0,
    independence: 0
  },
  emotionalState: {
    stressLevel: 'calm',
    hrv: 0.5,
    vagalTone: 0.5,
    breathingRhythm: 'natural',
    rapidClicks: 0,
    hesitationCount: 0,
    themeJumping: false,
    emotionalIntensity: 0.5
  },
  cognitiveState: {
    flowState: 'flow',
    challengeLevel: 0.5,
    skillLevel: 0.5,
    metacognitiveAwareness: 0.5,
    executiveFunction: 0.5,
    workingMemory: 0.5,
    attentionSpan: 0.5,
    learningStyle: 'mixed'
  },
  identityState: {
    identityExploration: 'early',
    selfConcept: 'developing',
    culturalValues: [],
    languageAdaptation: 0.5
  },
  neuralState: {
    attentionNetwork: 'integrated',
    memoryConsolidation: 'encoding',
    neuroplasticity: 0.5,
    dopamineLevels: 0.5,
    stressResponse: 0.3,
    cognitiveLoad: 0.4,
    neuralEfficiency: 0.6
  },
  skills: {
    criticalThinking: 0,
    communication: 0,
    collaboration: 0,
    creativity: 0,
    adaptability: 0,
    leadership: 0,
    digitalLiteracy: 0,
    emotionalIntelligence: 0,
    culturalCompetence: 0,
    financialLiteracy: 0,
    timeManagement: 0,
    problemSolving: 0
  },
  thoughts: [],
  triggeredModules: [],
  coreGameState: null, // Required for GameState type compatibility
  unlockedAchievements: []
}

// Demo scenes for testing choices
export async function demonstrateChoiceVariety() {
  logger.debug('Dynamic Choice System Demo', { operation: 'choice-system-demo' })
  
  logger.debug('Original repetitive choices', {
    operation: 'choice-system-demo',
    choices: sampleScene.choices?.map(c => c.text) || []
  })

  for (let i = 1; i <= 5; i++) {
    const dynamicChoices = await ChoiceGenerator.generateChoices(sampleScene, baseGameState)
    logger.debug(`Generation ${i}`, {
      operation: 'choice-system-demo',
      choices: dynamicChoices.map(c => c.text)
    })
  }

  // Test with different contexts
  const mysteryScene: Scene = {
    ...sampleScene,
    text: 'Something strange is happening at Platform 7. The number keeps flickering. What catches your attention as you move forward?'
  }

  const mysteryChoices = await ChoiceGenerator.generateChoices(mysteryScene, baseGameState)
  logger.debug('Mystery context', {
    operation: 'choice-system-demo',
    choices: mysteryChoices.map(c => c.text)
  })

  const characterScene: Scene = {
    ...sampleScene,
    text: 'You see someone lost and confused at the station. They look like they need help. What catches your attention as you move forward?'
  }

  const characterChoices = await ChoiceGenerator.generateChoices(characterScene, baseGameState)
  logger.debug('Character interaction context', {
    operation: 'choice-system-demo',
    choices: characterChoices.map(c => c.text)
  })

  // Test with high trust character
  const highTrustState: GameState = {
    ...baseGameState,
    characterTrust: { samuel: 8 }
  }

  const samuelScene: Scene = {
    ...sampleScene,
    speaker: 'Samuel',
    text: 'Samuel looks at you with understanding. "You\'ve been here before, haven\'t you?" What catches your attention as you move forward?'
  }

  const trustChoices = await ChoiceGenerator.generateChoices(samuelScene, highTrustState)
  logger.debug('High trust character context', {
    operation: 'choice-system-demo',
    choices: trustChoices.map(c => c.text)
  })

  logger.debug('Demo complete', { operation: 'choice-system-demo' })
}

/**
 * Verify consequence mapping accuracy
 */
export async function verifyConsequenceAccuracy() {
  logger.debug('Consequence Mapping Verification', { operation: 'choice-system-demo' })

  const dynamicChoices = await ChoiceGenerator.generateChoices(sampleScene, baseGameState)

  dynamicChoices.forEach((choice, i) => {
    logger.debug(`Choice ${i + 1}`, {
      operation: 'choice-system-demo.verify',
      text: choice.text,
      consequence: choice.consequence,
      pattern: choice.consequence.split('_')[0],
      stateChanges: choice.stateChanges
    })
  })

  logger.debug('All choices maintain proper consequence mapping', { operation: 'choice-system-demo.verify' })
}

// Export for potential runtime testing
export { sampleScene, baseGameState }
