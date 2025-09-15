/**
 * Choice Template System
 * Maps psychological patterns to contextual choice variations
 * Ensures measurement accuracy while providing natural language variety
 */

import type { Choice } from './story-engine'

export interface ChoiceTemplate {
  /** Core psychological pattern this choice measures */
  pattern: 'exploring' | 'helping' | 'building' | 'analyzing' | 'patience' | 'rushing' | 'independence'

  /** Consequence tag for tracking */
  consequence: string

  /** Base choice text variations */
  textVariations: string[]

  /** Context-specific adaptations */
  contextAdaptations: {
    [context: string]: string[]
  }

  /** State changes when choice is made */
  stateChanges: {
    patterns?: Record<string, number>
    careerValues?: Record<string, number>
  }
}

/**
 * Core choice templates based on psychological measurement goals
 */
export const CHOICE_TEMPLATES: ChoiceTemplate[] = [
  // EXPLORING pattern choices
  {
    pattern: 'exploring',
    consequence: 'exploring_1',
    textVariations: [
      'Explore further',
      'Look around more',
      'Investigate the area',
      'See what else is here',
      'Take a closer look'
    ],
    contextAdaptations: {
      'station': [
        'Wander through the station',
        'Check out different platforms',
        'Explore the terminal building'
      ],
      'mystery': [
        'Try to understand what\'s happening',
        'Piece together the clues',
        'Dig deeper into the mystery'
      ],
      'character': [
        'Learn more about them',
        'Ask questions about their story',
        'Try to understand their perspective'
      ]
    },
    stateChanges: {
      patterns: { exploring: 1 },
      careerValues: { exploring: 0.72 }
    }
  },

  {
    pattern: 'exploring',
    consequence: 'exploring_2',
    textVariations: [
      'Discover something new',
      'Find something unexpected',
      'Uncover hidden details',
      'Search for surprises',
      'Look for the unknown'
    ],
    contextAdaptations: {
      'station': [
        'Find hidden areas of the station',
        'Look for secret passages',
        'Discover forgotten corners'
      ],
      'opportunity': [
        'Spot new possibilities',
        'Notice overlooked chances',
        'Find unexpected opportunities'
      ]
    },
    stateChanges: {
      patterns: { exploring: 1 },
      careerValues: { exploring: 0.718 }
    }
  },

  {
    pattern: 'exploring',
    consequence: 'exploring_3',
    textVariations: [
      'Take a risk',
      'Try something bold',
      'Make a leap',
      'Go for it',
      'Take the chance'
    ],
    contextAdaptations: {
      'decision': [
        'Make the bold choice',
        'Go with your gut',
        'Take the uncertain path'
      ],
      'fear': [
        'Push through the fear',
        'Face the unknown',
        'Overcome hesitation'
      ]
    },
    stateChanges: {
      patterns: { exploring: 1 },
      careerValues: { exploring: 0.668 }
    }
  },

  {
    pattern: 'exploring',
    consequence: 'exploring_4',
    textVariations: [
      'Try something different',
      'Change your approach',
      'Do something unexpected',
      'Break the pattern',
      'Think outside the box'
    ],
    contextAdaptations: {
      'problem': [
        'Find a creative solution',
        'Try a new angle',
        'Approach it differently'
      ],
      'routine': [
        'Break from convention',
        'Challenge the norm',
        'Do the unexpected'
      ]
    },
    stateChanges: {
      patterns: { exploring: 1 },
      careerValues: { exploring: 0.855 }
    }
  },

  // HELPING pattern choices
  {
    pattern: 'helping',
    consequence: 'helping_1',
    textVariations: [
      'Help someone',
      'Offer assistance',
      'Lend a hand',
      'Support others',
      'Be there for them'
    ],
    contextAdaptations: {
      'struggle': [
        'Help them through difficulty',
        'Offer support in their struggle',
        'Be there during hard times'
      ],
      'lost': [
        'Give directions',
        'Help them find their way',
        'Guide them forward'
      ],
      'overwhelmed': [
        'Share the burden',
        'Lighten their load',
        'Offer emotional support'
      ]
    },
    stateChanges: {
      patterns: { helping: 1 },
      careerValues: { directImpact: 0.75 }
    }
  },

  {
    pattern: 'helping',
    consequence: 'helping_2',
    textVariations: [
      'Offer support',
      'Provide encouragement',
      'Give comfort',
      'Share strength',
      'Show compassion'
    ],
    contextAdaptations: {
      'anxiety': [
        'Calm their nerves',
        'Ease their worries',
        'Provide reassurance'
      ],
      'doubt': [
        'Boost their confidence',
        'Remind them of their strength',
        'Help them believe in themselves'
      ]
    },
    stateChanges: {
      patterns: { helping: 1 },
      careerValues: { directImpact: 0.68 }
    }
  },

  // BUILDING pattern choices
  {
    pattern: 'building',
    consequence: 'building_1',
    textVariations: [
      'Build something',
      'Create a solution',
      'Construct an answer',
      'Make something new',
      'Put together a plan'
    ],
    contextAdaptations: {
      'problem': [
        'Engineer a fix',
        'Design a solution',
        'Build a bridge over the gap'
      ],
      'community': [
        'Bring people together',
        'Build connections',
        'Create unity'
      ]
    },
    stateChanges: {
      patterns: { building: 1 },
      careerValues: { systemsThinking: 0.72 }
    }
  },

  // ANALYZING pattern choices
  {
    pattern: 'analyzing',
    consequence: 'analyzing_1',
    textVariations: [
      'Think it through',
      'Analyze the situation',
      'Consider all angles',
      'Study the details',
      'Examine carefully'
    ],
    contextAdaptations: {
      'complex': [
        'Break down the complexity',
        'Understand the components',
        'Map out the system'
      ],
      'data': [
        'Look at the patterns',
        'Find insights in the information',
        'Decode what the data means'
      ]
    },
    stateChanges: {
      patterns: { analyzing: 1 },
      careerValues: { dataInsights: 0.71 }
    }
  },

  // PATIENCE pattern choices
  {
    pattern: 'patience',
    consequence: 'patience_1',
    textVariations: [
      'Wait and observe',
      'Take your time',
      'Be patient',
      'Let things unfold',
      'Watch carefully'
    ],
    contextAdaptations: {
      'rushing': [
        'Slow down and think',
        'Don\'t rush the decision',
        'Take a breath'
      ],
      'pressure': [
        'Resist the pressure',
        'Stay calm under stress',
        'Keep your composure'
      ]
    },
    stateChanges: {
      patterns: { patience: 1 },
      careerValues: { futureBuilding: 0.65 }
    }
  }
]

/**
 * Context detection from scene content
 */
export function detectContext(sceneText: string, gameState: any): string[] {
  const contexts: string[] = []
  const text = sceneText.toLowerCase()

  // Location contexts
  if (text.includes('platform') || text.includes('station') || text.includes('terminal')) {
    contexts.push('station')
  }

  // Emotional contexts
  if (text.includes('lost') || text.includes('confused') || text.includes('direction')) {
    contexts.push('lost')
  }
  if (text.includes('anxious') || text.includes('nervous') || text.includes('worried')) {
    contexts.push('anxiety')
  }
  if (text.includes('overwhelmed') || text.includes('too much') || text.includes('burden')) {
    contexts.push('overwhelmed')
  }

  // Situation contexts
  if (text.includes('mystery') || text.includes('strange') || text.includes('unusual')) {
    contexts.push('mystery')
  }
  if (text.includes('problem') || text.includes('challenge') || text.includes('difficulty')) {
    contexts.push('problem')
  }
  if (text.includes('opportunity') || text.includes('chance') || text.includes('possibility')) {
    contexts.push('opportunity')
  }

  // Character contexts
  if (text.includes('person') || text.includes('someone') || text.includes('they ') || text.includes('character')) {
    contexts.push('character')
  }

  return contexts
}

/**
 * Generate contextual choices from templates
 */
export function generateContextualChoices(
  sceneText: string,
  gameState: any,
  requiredPatterns?: string[]
): Choice[] {
  const contexts = detectContext(sceneText, gameState)
  const choices: Choice[] = []

  // Default to exploring patterns if none specified
  const patterns = requiredPatterns || ['exploring', 'helping', 'building', 'analyzing']

  patterns.forEach((pattern, index) => {
    const templates = CHOICE_TEMPLATES.filter(t => t.pattern === pattern)
    if (templates.length === 0) return

    // Rotate through templates to avoid repetition
    const template = templates[index % templates.length]

    // Choose text variation based on context
    let choiceText = template.textVariations[0] // default

    for (const context of contexts) {
      if (template.contextAdaptations[context]) {
        const adaptations = template.contextAdaptations[context]
        choiceText = adaptations[Math.floor(Math.random() * adaptations.length)]
        break
      }
    }

    // If no context match, use random variation
    if (choiceText === template.textVariations[0] && template.textVariations.length > 1) {
      choiceText = template.textVariations[Math.floor(Math.random() * template.textVariations.length)]
    }

    choices.push({
      text: choiceText,
      consequence: template.consequence,
      nextScene: 'next', // Will be overridden by story engine
      stateChanges: template.stateChanges
    })
  })

  return choices
}