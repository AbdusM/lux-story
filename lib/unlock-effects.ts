/**
 * Unlock Effects System
 *
 * Makes pattern unlocks functionally meaningful by enhancing the rendering
 * of EXISTING content rather than requiring new content authorship.
 *
 * PHILOSOPHY:
 * - Unlocks reveal layers of content that's already there
 * - No new dialogue writing required
 * - Uses existing emotion tags, trust levels, and Birmingham references
 * - Sustainable: New characters/content automatically benefit from unlocks
 */

import type { PatternType } from './patterns'
import type { GameState, CharacterState } from './character-state'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Context provided to unlock effects when evaluating
 */
export interface UnlockContext {
  /** Current game state */
  gameState: GameState

  /** Character being displayed (if any) */
  currentCharacter?: CharacterState

  /** Character's display name */
  characterName?: string

  /** Dialogue text being rendered */
  dialogueText: string

  /** Emotion tag from DialogueContent */
  dialogueEmotion?: string

  /** Check if player has achieved specific unlock */
  hasUnlock: (unlockId: string) => boolean

  /** Player's current pattern fill percentages */
  patternFills: Record<PatternType, number>
}

/**
 * Enhancements applied to content based on unlocks
 */
export interface ContentEnhancement {
  /** Show character's emotion state in header */
  showEmotionTag?: boolean

  /** Show trust level during dialogue */
  showTrustLevel?: boolean

  /** Character trust value (0-10) */
  trustValue?: number

  /** Subtext hint to display below dialogue */
  subtextHint?: string

  /** Birmingham location context tooltip */
  birminghamTooltip?: { location: string; context: string }

  /** Highlight pattern-matching choices */
  highlightPatterns?: PatternType[]

  /** CSS class for choice emphasis */
  choiceEmphasisClass?: string

  /** Pattern insight for Journal */
  journalInsight?: string
}

// ═══════════════════════════════════════════════════════════════
// BIRMINGHAM LOCATION CONTEXT
// ═══════════════════════════════════════════════════════════════

/**
 * Birmingham locations and their context
 * Automatically surfaced when Exploring unlock is achieved
 */
const BIRMINGHAM_LOCATIONS: Record<string, string> = {
  'UAB': '🏛️ University of Alabama at Birmingham - Major medical research hub, 23,000 students',
  'University of Alabama at Birmingham': '🏛️ UAB - Major medical research hub, 23,000 students',
  'Innovation Depot': '💡 Birmingham\'s tech incubator - 100+ startups, $100M+ capital raised',
  'Children\'s of Alabama': '🏥 Alabama\'s only children\'s hospital - 350+ pediatric specialists',
  'Childrens Hospital': '🏥 Children\'s of Alabama - 350+ pediatric specialists',
  'Sloss Furnaces': '🏭 Historic ironworks, symbol of Birmingham\'s industrial heritage',
  'Railroad Park': '🌳 21-acre green space connecting downtown districts',
  'Vulcan Park': '⚒️ World\'s largest cast iron statue overlooking the city',
  'Regions Field': '⚾ Home of the Birmingham Barons, minor league baseball',
  'Woodlawn': '🔨 Emerging maker/arts district with community workshops',
  'Covalence': '💻 Birmingham coding bootcamp in Innovation Depot',
  'Protective Life': '🏢 Insurance company headquartered in downtown Birmingham',
  'Nucor Steel': '🏭 Steel manufacturer in Birmingham, employs 400+ locally',
  'Lawson State': '🎓 Lawson State Community College - vocational and technical training',
  'Mercedes-Benz': '🚗 Mercedes-Benz U.S. International plant in nearby Tuscaloosa'
}

/**
 * Extract Birmingham location from text if present
 */
function extractBirminghamLocation(text: string): { location: string; context: string } | undefined {
  for (const [location, context] of Object.entries(BIRMINGHAM_LOCATIONS)) {
    if (text.includes(location)) {
      return { location, context }
    }
  }
  return undefined
}

// ═══════════════════════════════════════════════════════════════
// EMOTION SUBTEXT MAPPING
// ═══════════════════════════════════════════════════════════════

/**
 * Map character emotions to observable subtext hints
 * These hints make emotions VISIBLE when Analytical unlock achieved
 */
const EMOTION_SUBTEXT: Record<string, string> = {
  // Anxiety/Uncertainty
  'anxious': '[You notice their hands fidgeting]',
  'nervous': '[They shift their weight nervously]',
  'uncertain': '[Their voice wavers slightly]',
  'conflicted': '[They pause, seeming torn between thoughts]',

  // Positive states
  'hopeful': '[There\'s a brightness in their eyes]',
  'excited': '[They lean forward as they speak]',
  'determined': '[Their jaw sets with resolve]',
  'warm': '[Their expression softens]',
  'proud': '[They stand a little taller]',

  // Guarded/Defensive
  'guarded': '[They\'re choosing words carefully]',
  'defensive': '[Their arms cross slightly]',
  'wary': '[They maintain careful distance]',
  'suspicious': '[Their eyes narrow]',

  // Vulnerable
  'vulnerable': '[Their voice drops to almost a whisper]',
  'raw': '[Emotion cracks through their usual composure]',
  'honest': '[They meet your eyes directly]',
  'open': '[Their shoulders relax]',

  // Neutral/Thinking
  'contemplative': '[They pause to gather their thoughts]',
  'thoughtful': '[They consider before responding]',
  'curious': '[They tilt their head slightly]',
  'focused': '[Their attention sharpens]'
}

/**
 * Get subtext hint for character's emotion
 */
function getEmotionSubtext(emotion?: string): string | undefined {
  if (!emotion) return undefined
  return EMOTION_SUBTEXT[emotion]
}

// ═══════════════════════════════════════════════════════════════
// TRUST-BASED PATTERN INSIGHTS
// ═══════════════════════════════════════════════════════════════

/**
 * Generate pattern insight based on trust delta
 * Used for Analytical unlock level 2
 */
function generateTrustInsight(
  characterName: string,
  currentTrust: number,
  initialTrust: number = 0
): string | undefined {
  const delta = currentTrust - initialTrust

  if (delta >= 3) {
    return `${characterName} has opened up significantly - your approach resonates with them`
  } else if (delta >= 2) {
    return `${characterName} is warming to you - they trust you more than before`
  } else if (delta <= -2) {
    return `${characterName} seems more guarded - they may be protecting something`
  } else if (delta <= -3) {
    return `${characterName} has pulled back - something you said didn't land well`
  }

  return undefined
}

// ═══════════════════════════════════════════════════════════════
// UNLOCK EFFECT EVALUATORS
// ═══════════════════════════════════════════════════════════════

/**
 * Evaluate Analytical unlocks
 */
function evaluateAnalyticalUnlocks(ctx: UnlockContext): Partial<ContentEnhancement> {
  const enhancement: Partial<ContentEnhancement> = {}

  // Level 1 (25%): Read Between Lines - Show emotion subtext
  if (ctx.hasUnlock('analytical-1') && ctx.dialogueEmotion) {
    enhancement.showEmotionTag = true
    enhancement.subtextHint = getEmotionSubtext(ctx.dialogueEmotion)
  }

  // Level 2 (50%): Pattern Recognition - Show trust insights
  if (ctx.hasUnlock('analytical-2') && ctx.currentCharacter && ctx.characterName) {
    // Get initial trust from D-039 trust timeline, or default to 5 (starting trust)
    const initialTrust = ctx.currentCharacter.trustTimeline?.points[0]?.trust ?? 5
    const insight = generateTrustInsight(
      ctx.characterName,
      ctx.currentCharacter.trust,
      initialTrust
    )
    if (insight) {
      enhancement.journalInsight = insight
    }
  }

  // Level 3 (85%): Strategic Insight - Highlight analytical choices
  if (ctx.hasUnlock('analytical-3')) {
    enhancement.highlightPatterns = ['analytical']
    enhancement.choiceEmphasisClass = 'ring-2 ring-indigo-400/30 bg-indigo-50/30'
  }

  return enhancement
}

/**
 * Evaluate Patience unlocks
 */
function evaluatePatienceUnlocks(ctx: UnlockContext): Partial<ContentEnhancement> {
  const enhancement: Partial<ContentEnhancement> = {}

  // Level 1 (25%): Take Your Time - Show timing cues
  if (ctx.hasUnlock('patience-1')) {
    // Subtext hint removed per user feedback (too distracting)
    // if (ctx.dialogueText.includes('pause') || ctx.dialogueText.includes('silence')) {
    //   enhancement.subtextHint = '[You notice they\'re taking time to consider...]'
    // }
  }

  // Level 3 (85%): Measured Response - Highlight patience choices
  if (ctx.hasUnlock('patience-3')) {
    enhancement.highlightPatterns = [...(enhancement.highlightPatterns || []), 'patience']
    enhancement.choiceEmphasisClass = enhancement.choiceEmphasisClass || 'ring-2 ring-sky-400/30 bg-sky-50/30'
  }

  return enhancement
}

/**
 * Evaluate Exploring unlocks
 */
function evaluateExploringUnlocks(ctx: UnlockContext): Partial<ContentEnhancement> {
  const enhancement: Partial<ContentEnhancement> = {}

  // Level 1 (25%): Curiosity Rewarded - Show Birmingham context
  if (ctx.hasUnlock('exploring-1')) {
    const birminghamLocation = extractBirminghamLocation(ctx.dialogueText)
    if (birminghamLocation) {
      enhancement.birminghamTooltip = birminghamLocation
    }
  }

  // Level 3 (85%): Seeker's Intuition - Highlight exploring choices
  if (ctx.hasUnlock('exploring-3')) {
    enhancement.highlightPatterns = [...(enhancement.highlightPatterns || []), 'exploring']
    enhancement.choiceEmphasisClass = enhancement.choiceEmphasisClass || 'ring-2 ring-purple-400/30 bg-purple-50/30'
  }

  return enhancement
}

/**
 * Evaluate Helping unlocks
 */
function evaluateHelpingUnlocks(ctx: UnlockContext): Partial<ContentEnhancement> {
  const enhancement: Partial<ContentEnhancement> = {}

  // Level 1 (25%): Empathy Sense - Show emotion tag and trust
  if (ctx.hasUnlock('helping-1')) {
    enhancement.showEmotionTag = true
    enhancement.showTrustLevel = true
    // Include trust value from current character if available
    if (ctx.currentCharacter) {
      enhancement.trustValue = ctx.currentCharacter.trust
    }
  }

  // Level 3 (85%): Heart to Heart - Highlight helping choices
  if (ctx.hasUnlock('helping-3')) {
    enhancement.highlightPatterns = [...(enhancement.highlightPatterns || []), 'helping']
    enhancement.choiceEmphasisClass = enhancement.choiceEmphasisClass || 'ring-2 ring-emerald-400/30 bg-emerald-50/30'
  }

  return enhancement
}

/**
 * Evaluate Building unlocks
 */
function evaluateBuildingUnlocks(ctx: UnlockContext): Partial<ContentEnhancement> {
  const enhancement: Partial<ContentEnhancement> = {}

  // Level 3 (85%): Architect's Vision - Highlight building choices
  if (ctx.hasUnlock('building-3')) {
    enhancement.highlightPatterns = [...(enhancement.highlightPatterns || []), 'building']
    enhancement.choiceEmphasisClass = enhancement.choiceEmphasisClass || 'ring-2 ring-amber-400/30 bg-amber-50/30'
  }

  return enhancement
}

/**
 * Evaluate new Ability Registry unlocks
 */
function evaluateAbilityUnlocks(ctx: UnlockContext): Partial<ContentEnhancement> {
  const enhancement: Partial<ContentEnhancement> = {}
  const unlocked = new Set(ctx.gameState.unlockedAbilities || [])

  // ABILITY: Subtext Reader (Emotional Resonance)
  if (unlocked.has('subtext_reader') && ctx.dialogueEmotion) {
    // enhancement.showEmotionTag = true // Maybe? Or just the subtext.
    enhancement.subtextHint = getEmotionSubtext(ctx.dialogueEmotion)
  }

  // ABILITY: Pattern Preview
  // Only relevant if we are also highlighting choices based on pattern
  // But wait, highlightPatterns logic in this file is about highlighting analytical choices if you are analytical.
  // The 'pattern_preview' ability might be broader.
  // For now, let's assume it empowers the highlight logic.

  return enhancement
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

/**
 * Get all active content enhancements based on player's unlocks
 *
 * This is the main function components call to enhance content
 */
export function getContentEnhancements(context: UnlockContext): ContentEnhancement {
  // Evaluate all pattern unlock categories
  const analyticalEnhancements = evaluateAnalyticalUnlocks(context)
  const patienceEnhancements = evaluatePatienceUnlocks(context)
  const exploringEnhancements = evaluateExploringUnlocks(context)
  const helpingEnhancements = evaluateHelpingUnlocks(context)
  const buildingEnhancements = evaluateBuildingUnlocks(context)

  // New Ability System
  const abilityEnhancements = evaluateAbilityUnlocks(context)

  // Merge all enhancements (later ones take precedence for conflicts)
  // First merge all the enhancement objects
  const merged: ContentEnhancement = {
    showEmotionTag: false,
    showTrustLevel: false,
    ...analyticalEnhancements,
    ...patienceEnhancements,
    ...exploringEnhancements,
    ...helpingEnhancements,
    ...buildingEnhancements,
    ...abilityEnhancements
  }

  // Then combine highlight patterns from all sources
  merged.highlightPatterns = [
    ...(analyticalEnhancements.highlightPatterns || []),
    ...(patienceEnhancements.highlightPatterns || []),
    ...(exploringEnhancements.highlightPatterns || []),
    ...(helpingEnhancements.highlightPatterns || []),
    ...(buildingEnhancements.highlightPatterns || [])
  ]

  return merged
}

/**
 * Check if any content enhancements are active
 * Useful for performance optimization
 */
export function hasActiveEnhancements(enhancements: ContentEnhancement): boolean {
  return !!(
    enhancements.showEmotionTag ||
    enhancements.showTrustLevel ||
    enhancements.subtextHint ||
    enhancements.birminghamTooltip ||
    enhancements.journalInsight ||
    (enhancements.highlightPatterns && enhancements.highlightPatterns.length > 0)
  )
}
