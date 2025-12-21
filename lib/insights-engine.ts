/**
 * Insights Engine
 *
 * Transforms raw game data into interpreted, meaningful insights for players.
 * This is the brain that turns "helping: 7" into "You're a Supportive Helper who
 * consistently shows care for others."
 *
 * DESIGN PRINCIPLE: Never show raw numbers alone. Always provide interpretation.
 */

import { PATTERN_METADATA, PATTERN_TYPES, type PatternType } from './patterns'
import type { PatternTracking, ChoiceRecord } from './game-store'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DecisionStyleInsight {
  primaryPattern: {
    type: PatternType
    label: string
    percentage: number
    description: string
  } | null
  secondaryPattern: {
    type: PatternType
    label: string
    percentage: number
  } | null
  totalChoices: number
}

export interface BehavioralInsight {
  category: 'response_speed' | 'social_orientation' | 'problem_approach'
  label: string
  description: string
  icon: string
}

export interface RelationshipInsight {
  characterId: string
  name: string
  trust: number
  trustLabel: string
  description: string
  color: string
}

export interface RelationshipPatternInsight {
  pattern: string
  description: string
  strongConnections: string[]
  weakConnections: string[]
}

export interface ChoicePatternInsight {
  pattern: string
  description: string
  percentage?: number
}

export interface JourneyInsight {
  stage: 'early' | 'developing' | 'experienced'
  stageLabel: string
  choiceCount: number
  charactersMetCount: number
  description: string
}

// ═══════════════════════════════════════════════════════════════════════════
// CHARACTER DATA
// ═══════════════════════════════════════════════════════════════════════════

const CHARACTER_INFO: Record<string, {
  name: string
  color: string
  role: string
  archetype: 'analytical' | 'creative' | 'social' | 'practical' | 'mentor'
  description: string
}> = {
  samuel: {
    name: 'Samuel',
    color: 'text-amber-600',
    role: 'Station Master',
    archetype: 'mentor',
    description: 'shares wisdom about discovering who you are'
  },
  maya: {
    name: 'Maya',
    color: 'text-blue-600',
    role: 'Tech Innovator',
    archetype: 'practical',
    description: 'shows how passion and practicality coexist'
  },
  devon: {
    name: 'Devon',
    color: 'text-orange-600',
    role: 'Community Builder',
    archetype: 'social',
    description: 'integrates analytical thinking with emotional awareness'
  },
  jordan: {
    name: 'Jordan',
    color: 'text-purple-600',
    role: 'Creative Spirit',
    archetype: 'creative',
    description: 'reveals how transferable skills connect experiences'
  },
  kai: {
    name: 'Kai',
    color: 'text-teal-600',
    role: 'Problem Solver',
    archetype: 'practical',
    description: 'demonstrates courage in high-stakes moments'
  },
  tess: {
    name: 'Tess',
    color: 'text-rose-600',
    role: 'Educator',
    archetype: 'mentor',
    description: 'teaches leadership through meaningful impact'
  },
  rohan: {
    name: 'Rohan',
    color: 'text-indigo-600',
    role: 'Analyst',
    archetype: 'analytical',
    description: 'embodies ground-truth thinking'
  },
  silas: {
    name: 'Silas',
    color: 'text-slate-600',
    role: 'Systems Thinker',
    archetype: 'analytical',
    description: 'manages complexity under pressure'
  },
  yaquin: {
    name: 'Yaquin',
    color: 'text-emerald-600',
    role: 'Guide',
    archetype: 'creative',
    description: 'creates experiences that reach learners where they are'
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// DECISION STYLE INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate insight about player's decision-making style based on patterns
 */
export function generateDecisionStyleInsight(patterns: PatternTracking): DecisionStyleInsight {
  // Only consider the 5 canonical patterns
  const canonicalPatterns = PATTERN_TYPES.filter(p => p in patterns)

  // Calculate total and percentages
  const total = canonicalPatterns.reduce((sum, p) => sum + (patterns[p] || 0), 0)

  if (total === 0) {
    return {
      primaryPattern: null,
      secondaryPattern: null,
      totalChoices: 0
    }
  }

  // Sort patterns by count
  const sortedPatterns = canonicalPatterns
    .map(p => ({ type: p as PatternType, count: patterns[p] || 0 }))
    .filter(p => p.count > 0)
    .sort((a, b) => b.count - a.count)

  const primary = sortedPatterns[0]
  const secondary = sortedPatterns[1]

  return {
    primaryPattern: primary ? {
      type: primary.type,
      label: PATTERN_METADATA[primary.type].label,
      percentage: Math.round((primary.count / total) * 100),
      description: PATTERN_METADATA[primary.type].description
    } : null,
    secondaryPattern: secondary ? {
      type: secondary.type,
      label: PATTERN_METADATA[secondary.type].shortLabel,
      percentage: Math.round((secondary.count / total) * 100)
    } : null,
    totalChoices: total
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONSHIP INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate insight for a single character relationship
 */
export function generateRelationshipInsight(
  characterId: string,
  trust: number
): RelationshipInsight | null {
  const info = CHARACTER_INFO[characterId.toLowerCase()]
  if (!info) return null

  const trustLabel = getTrustLabel(trust)
  const description = info.description

  return {
    characterId,
    name: info.name,
    trust,
    trustLabel,
    description,
    color: info.color
  }
}

/**
 * Analyze relationship patterns across all characters
 */
export function generateRelationshipPatternInsight(
  characterTrust: Record<string, number>
): RelationshipPatternInsight | null {
  const entries = Object.entries(characterTrust).filter(([_, trust]) => trust > 0)

  if (entries.length < 2) return null

  // Group by archetype
  const archetypeScores: Record<string, { total: number; count: number; names: string[] }> = {}

  for (const [charId, trust] of entries) {
    const info = CHARACTER_INFO[charId.toLowerCase()]
    if (!info) continue

    if (!archetypeScores[info.archetype]) {
      archetypeScores[info.archetype] = { total: 0, count: 0, names: [] }
    }
    archetypeScores[info.archetype].total += trust
    archetypeScores[info.archetype].count++
    archetypeScores[info.archetype].names.push(info.name)
  }

  // Find strongest and weakest archetypes
  const archetypeEntries = Object.entries(archetypeScores)
    .map(([type, data]) => ({
      type,
      avgTrust: data.total / data.count,
      names: data.names
    }))
    .sort((a, b) => b.avgTrust - a.avgTrust)

  if (archetypeEntries.length === 0) return null

  const strongest = archetypeEntries[0]
  const weakest = archetypeEntries[archetypeEntries.length - 1]

  const archetypeDescriptions: Record<string, string> = {
    analytical: 'systematic thinkers who value evidence',
    creative: 'creative spirits who embrace unconventional paths',
    social: 'community builders focused on connection',
    practical: 'hands-on problem solvers',
    mentor: 'wise guides who share experience'
  }

  return {
    pattern: `You connect best with ${archetypeDescriptions[strongest.type] || strongest.type}`,
    description: strongest.avgTrust > 5
      ? `Your deepest bonds are with ${strongest.names.join(' and ')}.`
      : `You're building connections with ${strongest.names.join(' and ')}.`,
    strongConnections: strongest.names,
    weakConnections: strongest.type !== weakest.type ? weakest.names : []
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHOICE PATTERN INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyze choice history to find behavioral patterns
 */
export function generateChoicePatternInsights(
  choiceHistory: ChoiceRecord[]
): ChoicePatternInsight[] {
  if (choiceHistory.length < 3) return []

  const insights: ChoicePatternInsight[] = []
  const choiceTexts = choiceHistory.map(c => c.choice.toLowerCase())

  // Detect question-asking pattern
  const questionCount = choiceTexts.filter(t =>
    t.includes('?') ||
    t.includes('why') ||
    t.includes('how') ||
    t.includes('what') ||
    t.includes('tell me more') ||
    t.includes('learn more')
  ).length

  const questionPercentage = Math.round((questionCount / choiceTexts.length) * 100)
  if (questionPercentage > 30) {
    insights.push({
      pattern: 'Seeker of Truths',
      description: 'You do not accept the surface reality. You dig until you find the root.',
      percentage: questionPercentage
    })
  }

  // Detect helping pattern
  const helpingCount = choiceTexts.filter(t =>
    t.includes('help') ||
    t.includes('support') ||
    t.includes('for you') ||
    t.includes('together')
  ).length

  const helpingPercentage = Math.round((helpingCount / choiceTexts.length) * 100)
  if (helpingPercentage > 25) {
    insights.push({
      pattern: 'Guardian of Others',
      description: 'Your instinct is to shield and uplift. You are the safety net.',
      percentage: helpingPercentage
    })
  }

  // Detect caution pattern
  const cautiousCount = choiceTexts.filter(t =>
    t.includes('careful') ||
    t.includes('think about') ||
    t.includes('consider') ||
    t.includes('wait') ||
    t.includes('not sure')
  ).length

  const cautiousPercentage = Math.round((cautiousCount / choiceTexts.length) * 100)
  if (cautiousPercentage > 20) {
    insights.push({
      pattern: 'Watcher at the Gate',
      description: 'You measure the cost before paying the price. Wisdom is your shield.',
      percentage: cautiousPercentage
    })
  }

  // Detect action pattern
  const actionCount = choiceTexts.filter(t =>
    t.includes('let\'s') ||
    t.includes('i\'ll') ||
    t.includes('do it') ||
    t.includes('try') ||
    t.includes('start')
  ).length

  const actionPercentage = Math.round((actionCount / choiceTexts.length) * 100)
  if (actionPercentage > 30) {
    insights.push({
      pattern: 'Spark of Motion',
      description: 'You are the catalyst. When the world freezes, you ignite it.',
      percentage: actionPercentage
    })
  }

  return insights.slice(0, 3) // Return top 3 insights
}

// ═══════════════════════════════════════════════════════════════════════════
// JOURNEY INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate insight about player's overall journey progress
 */
export function generateJourneyInsight(
  choiceCount: number,
  characterTrust: Record<string, number>
): JourneyInsight {
  const charactersMetCount = Object.values(characterTrust).filter(t => t > 0).length

  let stage: 'early' | 'developing' | 'experienced'
  let stageLabel: string
  let description: string

  if (choiceCount < 10) {
    stage = 'early'
    stageLabel = 'Beginning'
    description = charactersMetCount === 0
      ? 'Your journey is just starting. Talk to Samuel to meet your first character.'
      : `You've met ${charactersMetCount} character${charactersMetCount > 1 ? 's' : ''}. Keep exploring!`
  } else if (choiceCount < 30) {
    stage = 'developing'
    stageLabel = 'Developing'
    description = `You've made ${choiceCount} choices and are building connections with ${charactersMetCount} characters.`
  } else {
    stage = 'experienced'
    stageLabel = 'Experienced'
    description = `With ${choiceCount} choices and ${charactersMetCount} character connections, your story is taking shape.`
  }

  return {
    stage,
    stageLabel,
    choiceCount,
    charactersMetCount,
    description
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getTrustLabel(trust: number): string {
  if (trust >= 8) return 'Deep Trust'
  if (trust >= 5) return 'Growing Connection'
  if (trust >= 2) return 'Getting Acquainted'
  if (trust > 0) return 'Just Met'
  if (trust < 0) return 'Tension'
  return 'Unknown'
}

/**
 * Get all insights combined for easy consumption
 */
export interface CombinedInsights {
  decisionStyle: DecisionStyleInsight
  journey: JourneyInsight
  relationshipPattern: RelationshipPatternInsight | null
  choicePatterns: ChoicePatternInsight[]
  topRelationships: RelationshipInsight[]
}

export function generateCombinedInsights(
  patterns: PatternTracking,
  characterTrust: Record<string, number>,
  choiceHistory: ChoiceRecord[]
): CombinedInsights {
  // Generate decision style insight
  const decisionStyle = generateDecisionStyleInsight(patterns)

  // Generate journey insight
  const journey = generateJourneyInsight(choiceHistory.length, characterTrust)

  // Generate relationship pattern insight
  const relationshipPattern = generateRelationshipPatternInsight(characterTrust)

  // Generate choice pattern insights
  const choicePatterns = generateChoicePatternInsights(choiceHistory)

  // Generate top relationship insights
  const topRelationships = Object.entries(characterTrust)
    .filter(([_, trust]) => trust > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([charId, trust]) => generateRelationshipInsight(charId, trust))
    .filter((r): r is RelationshipInsight => r !== null)

  return {
    decisionStyle,
    journey,
    relationshipPattern,
    choicePatterns,
    topRelationships
  }
}
