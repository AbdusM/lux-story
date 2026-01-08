/**
 * Voice Template Archetypes
 *
 * 10 semantic categories of player utterances with pattern-specific transforms.
 * These templates enable automatic voice variation generation while maintaining
 * authentic pattern differentiation.
 *
 * Pattern Voice Guidelines:
 * - analytical: Precise, systems-focused, logic-seeking
 * - patience: Calm, spacious, warm, unhurried
 * - exploring: Curious, enthusiastic, question-driven
 * - helping: Empathetic, validating, other-focused
 * - building: Pragmatic, action-oriented, constructive
 */

import type { VoiceTemplate, TemplateArchetype } from './template-types'

/**
 * The 10 voice template archetypes
 */
export const VOICE_TEMPLATES: Record<TemplateArchetype, VoiceTemplate> = {
  ASK_FOR_DETAILS: {
    archetype: 'ASK_FOR_DETAILS',
    description: 'Player wants more information about something the NPC mentioned',
    transforms: {
      analytical: "Walk me through {subject}. What's the logic?",
      patience: "Take your time. Tell me about {subject}.",
      exploring: "{subject}? What's the story there?",
      helping: "I can see {subject} matters to you. What happened?",
      building: "How did you build {subject}? What's the structure?"
    },
    slots: ['subject']
  },

  STAY_SILENT: {
    archetype: 'STAY_SILENT',
    description: 'Patience-based choice where player holds space without speaking',
    transforms: {
      analytical: "[Observe. Gather more data before responding.]",
      patience: "[Let the silence do its work.]",
      exploring: "[Wait. See what unfolds in the quiet.]",
      helping: "[Give them space. Your presence is enough.]",
      building: "[Sometimes the best action is none.]"
    }
  },

  ACKNOWLEDGE_EMOTION: {
    archetype: 'ACKNOWLEDGE_EMOTION',
    description: 'Player notices and validates an emotional state',
    transforms: {
      analytical: "That's significant. The emotional data is clear.",
      patience: "I hear that. Take your time with it.",
      exploring: "There's a lot underneath that, isn't there?",
      helping: "That sounds {emotion}. You don't have to carry it alone.",
      building: "Heavy. But feelings are foundations we build on."
    },
    slots: ['emotion']
  },

  EXPRESS_CURIOSITY: {
    archetype: 'EXPRESS_CURIOSITY',
    description: 'Player shows genuine interest in learning more',
    transforms: {
      analytical: "How does {subject} actually work?",
      patience: "Tell me more about {subject}. When you're ready.",
      exploring: "What if we explored {subject}? There might be more there.",
      helping: "You seem passionate about {subject}. Why does it matter to you?",
      building: "How would you build {subject}? What would you make?"
    },
    slots: ['subject']
  },

  OFFER_SUPPORT: {
    archetype: 'OFFER_SUPPORT',
    description: 'Player offers concrete help or emotional support',
    transforms: {
      analytical: "I can help you think through this systematically.",
      patience: "I'm here. No pressure. Take what you need.",
      exploring: "Let's figure this out together. What do you need?",
      helping: "You don't have to face this alone. What can I do?",
      building: "Let me help you fix this. What's the first step?"
    }
  },

  CHALLENGE_ASSUMPTION: {
    archetype: 'CHALLENGE_ASSUMPTION',
    description: 'Player gently pushes back or questions an assumption',
    transforms: {
      analytical: "The premise doesn't hold. Consider the counter-evidence.",
      patience: "Maybe there's another way to see this. No rush.",
      exploring: "What if we're asking the wrong question entirely?",
      helping: "I wonder if this is protecting something. What's underneath?",
      building: "This approach seems flawed. What if we tried differently?"
    }
  },

  SHOW_UNDERSTANDING: {
    archetype: 'SHOW_UNDERSTANDING',
    description: 'Player validates the NPC\'s perspective or experience',
    transforms: {
      analytical: "That follows logically. The pattern is clear.",
      patience: "I understand. These things take time.",
      exploring: "That makes sense now. The picture is forming.",
      helping: "I hear you. That's real.",
      building: "Solid. I can work with that."
    }
  },

  TAKE_ACTION: {
    archetype: 'TAKE_ACTION',
    description: 'Player motivates movement or commits to action',
    transforms: {
      analytical: "Execute. The analysis is complete.",
      patience: "When the moment is right. Now is that moment.",
      exploring: "Let's find out what happens. Adventure awaits.",
      helping: "Let's do this. For them. For you.",
      building: "Time to make it real. Hands on."
    }
  },

  REFLECT_BACK: {
    archetype: 'REFLECT_BACK',
    description: 'Player mirrors what NPC said to show understanding',
    transforms: {
      analytical: "If I parse that correctly: {content}",
      patience: "What I hear, in your time: {content}",
      exploring: "So the real question is: {content}",
      helping: "It sounds like you feel: {content}",
      building: "The core of it: {content}"
    },
    slots: ['content']
  },

  SET_BOUNDARY: {
    archetype: 'SET_BOUNDARY',
    description: 'Player takes space or sets a personal limit',
    transforms: {
      analytical: "I need more data before I can respond to that.",
      patience: "I need time to sit with this.",
      exploring: "That's a lot. Let me explore how I feel about it.",
      helping: "I want to help, but I need to take care of myself first.",
      building: "Let me process this. Then we can build something."
    }
  },

  MAKE_OBSERVATION: {
    archetype: 'MAKE_OBSERVATION',
    description: 'Player makes a direct observation about something they noticed',
    transforms: {
      analytical: "Data point: {observation}. That's significant.",
      patience: "I noticed something. {observation}.",
      exploring: "Wait. {observation}. That's interesting.",
      helping: "I see something. {observation}. Does that resonate?",
      building: "Hold on. {observation}. That changes things."
    },
    slots: ['observation']
  },

  SIMPLE_CONTINUE: {
    archetype: 'SIMPLE_CONTINUE',
    description: 'Player indicates they want to continue or hear more',
    transforms: {
      analytical: "[Processing. Continue.]",
      patience: "[Take your time.]",
      exploring: "[And then?]",
      helping: "[I'm listening.]",
      building: "[Go on.]"
    }
  },

  AFFIRM_CHOICE: {
    archetype: 'AFFIRM_CHOICE',
    description: 'Player commits to something or agrees decisively',
    transforms: {
      analytical: "Confirmed. Proceeding.",
      patience: "Yes. In my own time.",
      exploring: "Let's see where this goes. I'm in.",
      helping: "For you? Absolutely.",
      building: "Done. What's next?"
    }
  },

  SHARE_PERSPECTIVE: {
    archetype: 'SHARE_PERSPECTIVE',
    description: 'Player shares their own viewpoint or experience',
    transforms: {
      analytical: "From my analysis: {perspective}",
      patience: "In my experience, {perspective}",
      exploring: "Here's what I'm thinking: {perspective}",
      helping: "Speaking from the heart: {perspective}",
      building: "My take: {perspective}"
    },
    slots: ['perspective']
  },

  EXPRESS_GRATITUDE: {
    archetype: 'EXPRESS_GRATITUDE',
    description: 'Player expresses thanks or appreciation',
    transforms: {
      analytical: "I appreciate the clarity. That helps.",
      patience: "Thank you. That means something.",
      exploring: "Thanks for sharing that. It opens things up.",
      helping: "Thank you for trusting me with that.",
      building: "Appreciated. That's useful."
    }
  },

  SEEK_CLARIFICATION: {
    archetype: 'SEEK_CLARIFICATION',
    description: 'Player asks for clarification or explanation',
    transforms: {
      analytical: "Can you clarify that? I want to be precise.",
      patience: "I want to make sure I understand. What do you mean?",
      exploring: "I'm not sure I follow. Can you explain?",
      helping: "Help me understand. What do you mean by that?",
      building: "Let me make sure I've got this right. How so?"
    }
  }
}

/**
 * Detection patterns for each archetype
 * These regex patterns help auto-detect the archetype from base choice text
 */
const ARCHETYPE_PATTERNS: Record<TemplateArchetype, RegExp> = {
  ASK_FOR_DETAILS: /tell me (more|about)|walk me through|what('s| is| are| was| made| happened| patterns| do you)|how (did|does|do|can|would)|why (did|do|does|is|are)|explain|describe|show me|is (it|that|this|there|learning) .+\?|^have you |your .+ (sounds?|seems?)|^who (is|are|was|were)|^where (did|does|do|is|are|can)|^did you/i,
  STAY_SILENT: /say nothing|stay silent|don't respond|remain quiet|just listen|\[silence\]|\[wait\]|\[pause\]/i,
  ACKNOWLEDGE_EMOTION: /that sounds|that must be|that seems|I (can )?(hear|see|feel|sense|notice)|you (seem|look|sound|appear)|^you'?r?e? (really|still|clearly|obviously)|you've been|thank you for (sharing|telling|opening|trusting)/i,
  EXPRESS_CURIOSITY: /curious|wonder|interesting|fascinated|intrigued|what if|I'd like to (know|understand|learn)|^can you (tell|show|explain|describe)|^could you|^would you (mind|be able|tell)|^I'm curious|^I wonder/i,
  OFFER_SUPPORT: /help|support|here for you|you're not alone|I('m| am) (with you|here)|can I (do|help)|let me/i,
  CHALLENGE_ASSUMPTION: /but what if|however|on the other hand|that doesn't|are you sure|have you considered|what about|^but (isn't|can't|won't|shouldn't|wouldn't|maybe|still)|^still,? |^even (so|if|though)|^and yet|couldn't (you|we|it|that)/i,
  SHOW_UNDERSTANDING: /makes sense|I understand|got it|I see|I get it|that's (clear|fair|right)|of course/i,
  TAKE_ACTION: /let's (do|go|try|start|move|begin)|ready|time to|we should|I'll|let me|^\[let (him|her|them|it|the|this)|^\[take |^\[go |^\[try /i,
  REFLECT_BACK: /so you're saying|what I hear|sounds like you|if I understand|in other words|you mean/i,
  SET_BOUNDARY: /need (time|to think|space|a moment)|give me|not ready|hold on|wait|I can't (yet|right now)/i,
  MAKE_OBSERVATION: /I noticed|you said|you mentioned|that's (different|not what|telling)|but you|interesting that|wait,|^so (you|it|that|the|this|there)|^so,? |it (sounds|seems|looks) like/i,
  SIMPLE_CONTINUE: /^\[continue\]$|^go on$|^and then\??$|^continue$|^next$|^\[next\]$|^return to |^\[let the (conversation|moment|silence)|leave (for now|the conversation)/i,
  AFFIRM_CHOICE: /^yes\.?$|^okay\.?$|^I'll do it|^count me in|^I'm in|^absolutely|^definitely|^agreed|^yes[,.!]|deal|^alright|^yeah[,.!]?$|^yeah,? (that|I|it|we)|^right\.|^exactly|^true|^fair enough/i,
  SHARE_PERSPECTIVE: /^I think|^for me|^in my (view|experience|opinion)|^personally|^from where I stand|^my take|^I (like|want|prefer|believe|feel that)|^the (best|right|key)|^sometimes|^maybe |^perhaps|^honestly|^I've (found|learned|seen|noticed)|^in my world|^I (tend to|usually|always|never|try to)|^I take|^I need to/i,
  EXPRESS_GRATITUDE: /^thank you|^thanks[,.!]?$|^thanks for|^I appreciate|^grateful|appreciate (that|you|this)|thank you for (seeing|understanding|sharing|telling|being)/i,
  SEEK_CLARIFICATION: /^do you mean|^can you explain|^what do you mean|^how so|^in what way|^clarify|^I don't follow|^I'm not sure I understand/i
}

/**
 * Priority order for archetype detection
 * More specific patterns should be checked before general ones
 */
const DETECTION_PRIORITY: TemplateArchetype[] = [
  'STAY_SILENT',           // Most specific - has unique markers like [silence]
  'SIMPLE_CONTINUE',       // Very specific - [Continue] markers
  'AFFIRM_CHOICE',         // Specific affirmations
  'REFLECT_BACK',          // Specific structure "so you're saying"
  'SET_BOUNDARY',          // Specific phrases about needing space
  'MAKE_OBSERVATION',      // "I noticed", "you said"
  'SHARE_PERSPECTIVE',     // "I think", "for me"
  'EXPRESS_GRATITUDE',     // "thank you", "I appreciate"
  'SEEK_CLARIFICATION',    // "do you mean", "can you explain"
  'CHALLENGE_ASSUMPTION',  // "but what if" is distinctive
  'ACKNOWLEDGE_EMOTION',   // Emotion-focused phrases
  'ASK_FOR_DETAILS',       // Question patterns
  'EXPRESS_CURIOSITY',     // Wonder/curious
  'OFFER_SUPPORT',         // Help/support - broad but distinctive
  'SHOW_UNDERSTANDING',    // Agreement phrases
  'TAKE_ACTION'            // Action phrases - most general
]

/**
 * Detect the archetype of a base choice text
 *
 * @param baseText - The original choice text
 * @returns The detected archetype or null if no match
 */
export function detectArchetype(baseText: string): TemplateArchetype | null {
  const text = baseText.toLowerCase().trim()

  // Check in priority order
  for (const archetype of DETECTION_PRIORITY) {
    if (ARCHETYPE_PATTERNS[archetype].test(text)) {
      return archetype
    }
  }

  return null
}

/**
 * Extract slot values from base text for template filling
 *
 * @param baseText - The original choice text
 * @param archetype - The detected archetype
 * @returns Object with slot values extracted from the text
 */
export function extractSlotValues(
  baseText: string,
  archetype: TemplateArchetype
): Record<string, string> {
  const slots: Record<string, string> = {}
  const template = VOICE_TEMPLATES[archetype]

  if (!template.slots || template.slots.length === 0) {
    return slots
  }

  // Extract {subject} slot
  if (template.slots.includes('subject')) {
    // Try to extract subject from "about X" or before "?"
    const aboutMatch = baseText.match(/about\s+(.+?)[\?\.]?\s*$/i)
    if (aboutMatch) {
      slots.subject = aboutMatch[1].trim()
    } else {
      // Use first noun phrase as fallback
      const nounMatch = baseText.match(/(?:the|this|that|your|their)\s+(\w+(?:\s+\w+)?)/i)
      if (nounMatch) {
        slots.subject = nounMatch[1]
      } else {
        slots.subject = 'this'
      }
    }
  }

  // Extract {emotion} slot
  if (template.slots.includes('emotion')) {
    const emotionMatch = baseText.match(/(hard|difficult|heavy|exciting|scary|overwhelming|exhausting|frustrating|confusing|painful|lonely|anxious|worried)/i)
    if (emotionMatch) {
      slots.emotion = emotionMatch[1].toLowerCase()
    } else {
      slots.emotion = 'heavy'
    }
  }

  // Extract {content} slot
  if (template.slots.includes('content')) {
    const contentMatch = baseText.match(/saying[:\s]+(.+)$|like[:\s]+(.+)$/i)
    if (contentMatch) {
      slots.content = (contentMatch[1] || contentMatch[2]).trim()
    } else {
      // Use most of the text after removing prefix
      const cleaned = baseText.replace(/^(so you're saying|what I hear is|sounds like)/i, '').trim()
      slots.content = cleaned || baseText
    }
  }

  // Extract {observation} slot
  if (template.slots.includes('observation')) {
    // Try to extract what was observed after "I noticed", "you said", etc.
    const obsMatch = baseText.match(/(?:I noticed|you said|you mentioned|that's)\s+(.+?)\.?$/i)
    if (obsMatch) {
      slots.observation = obsMatch[1].trim()
    } else {
      // Use the main part of the text
      const cleaned = baseText.replace(/^(I noticed|you said|you mentioned|wait,?)\s*/i, '').trim()
      slots.observation = cleaned || 'something'
    }
  }

  // Extract {perspective} slot
  if (template.slots.includes('perspective')) {
    // Extract what comes after "I think", "for me", etc.
    const perspMatch = baseText.match(/(?:I think|for me|in my (?:view|experience|opinion)|personally|my take is?)\s*,?\s*(.+?)\.?$/i)
    if (perspMatch) {
      slots.perspective = perspMatch[1].trim()
    } else {
      // Use the text itself as the perspective
      const cleaned = baseText.replace(/^(I think|for me|personally)\s*,?\s*/i, '').trim()
      slots.perspective = cleaned || baseText
    }
  }

  return slots
}

/**
 * Fill template slots with extracted values
 *
 * @param template - Template string with {slot} placeholders
 * @param slots - Object with slot values
 * @returns Filled template string
 */
export function fillSlots(
  template: string,
  slots: Record<string, string>
): string {
  let result = template

  for (const [key, value] of Object.entries(slots)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }

  // Clean up any remaining unfilled slots with sensible defaults
  result = result.replace(/\{subject\}/g, 'this')
  result = result.replace(/\{emotion\}/g, 'heavy')
  result = result.replace(/\{content\}/g, 'that')
  result = result.replace(/\{observation\}/g, 'something')
  result = result.replace(/\{perspective\}/g, 'that')

  return result
}

/**
 * Get all archetype names for validation
 */
export function getArchetypeNames(): TemplateArchetype[] {
  return Object.keys(VOICE_TEMPLATES) as TemplateArchetype[]
}

/**
 * Validate that an archetype name is valid
 */
export function isValidArchetype(name: string): name is TemplateArchetype {
  return name in VOICE_TEMPLATES
}
