/**
 * Journey Narrative Generator
 * Creates personalized narrative summaries of a player's complete journey
 * Based on IF audit recommendation: "Procedural Journey Summary"
 *
 * This generates Samuel-narrated text that weaves together:
 * - Demonstrated skills across all character arcs
 * - Dominant behavioral patterns
 * - Key relationships formed
 * - Memorable choice moments
 */

import type { GameState, SerializableGameState } from './character-state'

/**
 * Skill demonstration record from gameplay
 */
interface SkillDemonstration {
  scene: string
  sceneDescription: string
  choice: string
  skillsDemonstrated: string[]
  context: string
  timestamp: number
}

/**
 * Journey narrative data structure
 */
export interface JourneyNarrative {
  openingParagraph: string
  patternReflection: string
  relationshipReflections: RelationshipReflection[]
  skillHighlights: SkillHighlight[]
  closingWisdom: string
  journeyStats: JourneyStats
}

interface RelationshipReflection {
  characterName: string
  characterId: string
  trustLevel: number
  narrativeText: string
}

interface SkillHighlight {
  skill: string
  demonstration: string
  significance: string
}

interface JourneyStats {
  arcsCompleted: number
  totalChoices: number
  dominantPattern: string
  secondaryPattern: string
  averageTrust: number
  timeSpent?: string
}

/**
 * Pattern name mappings for narrative text
 */
const PATTERN_NARRATIVES: Record<string, { name: string; description: string; metaphor: string }> = {
  analytical: {
    name: 'The Observer',
    description: 'You watched. You noticed. You saw what others missed.',
    metaphor: 'like reading between the lines of a story everyone else skimmed'
  },
  helping: {
    name: 'The Supporter',
    description: 'You reached out. You listened. You made space for others.',
    metaphor: 'like a steady hand in uncertain times'
  },
  building: {
    name: 'The Creator',
    description: 'You imagined. You constructed. You brought ideas to life.',
    metaphor: 'like an architect seeing the blueprint in bare ground'
  },
  patience: {
    name: 'The Steady One',
    description: 'You waited. You held space. You trusted the process.',
    metaphor: 'like roots growing deep before the tree reaches high'
  },
  exploring: {
    name: 'The Seeker',
    description: 'You wandered. You questioned. You found paths others overlooked.',
    metaphor: 'like a compass that finds north by trying every direction'
  }
}

/**
 * Character name mappings
 */
const CHARACTER_NAMES: Record<string, string> = {
  samuel: 'Samuel Washington',
  maya: 'Maya Chen',
  devon: 'Devon Kumar',
  jordan: 'Jordan Packard',
  tess: 'Tess',
  yaquin: 'Yaquin',
  kai: 'Kai',
  rohan: 'Rohan',
  silas: 'Silas',
  marcus: 'Marcus'
}

/**
 * Generate the opening paragraph based on journey context
 */
function generateOpening(stats: JourneyStats, _gameState: GameState | SerializableGameState): string {
  const arcsText = stats.arcsCompleted === 1
    ? 'one person'
    : stats.arcsCompleted === 2
      ? 'two people'
      : `${stats.arcsCompleted} people`

  const patternData = PATTERN_NARRATIVES[stats.dominantPattern] || PATTERN_NARRATIVES.helping

  return `*Samuel settles into his chair, a knowing warmth in his eyes.*

"When you first walked into this station, you were looking for something. Maybe you knew what it was. Maybe you didn't. But you stayed. You talked to ${arcsText}. You listened."

*He pauses, considering his words.*

"And somewhere along the way, I started to notice something about you. ${patternData.description} ${patternData.metaphor}."`
}

/**
 * Generate pattern reflection based on dominant and secondary patterns
 */
function generatePatternReflection(stats: JourneyStats): string {
  const primary = PATTERN_NARRATIVES[stats.dominantPattern] || PATTERN_NARRATIVES.helping
  const secondary = PATTERN_NARRATIVES[stats.secondaryPattern] || PATTERN_NARRATIVES.analytical

  return `"They call it '${primary.name}' in some circles. Not a title—more like a way of moving through the world. You've got some '${secondary.name}' in you too. Most interesting people have a mix."

*He leans forward.*

"That's not a test result. That's what I saw, watching you navigate conversations that could've gone a dozen different ways. You chose yours."`
}

/**
 * Generate relationship reflections for each character the player interacted with
 */
function generateRelationshipReflections(gameState: GameState | SerializableGameState): RelationshipReflection[] {
  const reflections: RelationshipReflection[] = []

  // Handle both GameState (Map) and SerializableGameState (array)
  const characters = 'characters' in gameState && gameState.characters instanceof Map
    ? Array.from(gameState.characters.entries())
    : (gameState as SerializableGameState).characters?.map((c: { characterId: string; trust: number }) => [c.characterId, c] as const) || []

  for (const [charId, character] of characters) {
    if (charId === 'samuel') continue // Samuel narrates, doesn't reflect on self

    const trust = character.trust || 0
    if (trust < 2) continue // Skip characters barely interacted with

    const characterName = CHARACTER_NAMES[charId] || charId
    let narrativeText: string

    if (trust >= 8) {
      narrativeText = `"${characterName}... they opened up to you in ways I've rarely seen. That kind of trust isn't given—it's earned, one honest moment at a time. Whatever you said to them? It mattered."`
    } else if (trust >= 6) {
      narrativeText = `"${characterName} felt comfortable with you. That's not nothing. Some people spend years trying to make connections like that."`
    } else if (trust >= 4) {
      narrativeText = `"You and ${characterName} found some common ground. Maybe not everything, but enough to understand each other a little better."`
    } else {
      narrativeText = `"${characterName}—you two circled each other a bit. Sometimes the most important conversations are the ones we're still figuring out how to have."`
    }

    reflections.push({
      characterName,
      characterId: charId as string,
      trustLevel: trust,
      narrativeText
    })
  }

  // Sort by trust level, highest first
  return reflections.sort((a, b) => b.trustLevel - a.trustLevel)
}

/**
 * Generate skill highlights from demonstrations
 */
function generateSkillHighlights(demonstrations: SkillDemonstration[]): SkillHighlight[] {
  if (!demonstrations || demonstrations.length === 0) {
    return [
      {
        skill: 'adaptability',
        demonstration: 'You navigated conversations without a script.',
        significance: 'That flexibility? It translates to any career, any team, any challenge.'
      }
    ]
  }

  // Group by skill and count
  const skillCounts = new Map<string, { count: number; bestContext: string }>()

  for (const demo of demonstrations) {
    for (const skill of demo.skillsDemonstrated) {
      const existing = skillCounts.get(skill)
      if (existing) {
        existing.count++
        if (demo.context.length > existing.bestContext.length) {
          existing.bestContext = demo.context
        }
      } else {
        skillCounts.set(skill, { count: 1, bestContext: demo.context })
      }
    }
  }

  // Get top 3 skills
  const topSkills = Array.from(skillCounts.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 3)

  const skillSignificance: Record<string, string> = {
    emotionalIntelligence: 'Being able to read people—really read them—opens doors that qualifications alone never will.',
    criticalThinking: 'Most people accept the first answer. You dig deeper. That\'s rare.',
    communication: 'Saying the right thing at the right time? That\'s a superpower in any room.',
    problemSolving: 'Breaking down complexity into steps—that\'s how impossible things get done.',
    leadership: 'Leading isn\'t about being in charge. It\'s about helping others find their way.',
    creativity: 'Seeing connections others miss—that\'s where innovation lives.',
    adaptability: 'Changing direction without losing your footing. That\'s survival and success.',
    collaboration: 'Making others feel heard and valued? Teams are built on that.',
    culturalCompetence: 'Understanding where people come from helps you meet them where they are.',
    relationshipBuilding: 'Trust is currency in any career. You know how to earn it.'
  }

  return topSkills.map(([skill, data]) => ({
    skill,
    demonstration: data.bestContext || `You demonstrated ${skill} ${data.count} time${data.count > 1 ? 's' : ''}.`,
    significance: skillSignificance[skill] || 'That\'s a real skill, even if it doesn\'t fit on a resume.'
  }))
}

/**
 * Generate closing wisdom from Samuel
 */
function generateClosingWisdom(stats: JourneyStats): string {
  const closings = [
    `"Here's what I know after all these years at this station: the people who figure out their path aren't the ones with all the answers. They're the ones willing to have the conversations. You had yours."`,

    `"I've seen a lot of people pass through here. Some rush through, some linger. But the ones who grow? They're the ones who show up—really show up—for the people they meet. You did that."`,

    `"Career counselors will give you assessments and percentages. But what I saw here? That's evidence. Not what you think you might do—what you actually did when it mattered."`,

    `"Don't let anyone tell you these conversations were just a game. The way you listened, the choices you made—that's who you are when you're not performing for an interview. That's the real you."`
  ]

  // Select based on a hash of the journey stats for consistency
  const index = (stats.arcsCompleted + stats.totalChoices) % closings.length

  return `*Samuel stands, extending his hand.*

${closings[index]}

*He smiles.*

"The station's always here if you want to come back. But I think you're ready to find your own way now."`
}

/**
 * Calculate journey statistics from game state
 */
function calculateStats(gameState: GameState | SerializableGameState): JourneyStats {
  // Get patterns
  const patterns = gameState.patterns
  const patternEntries = Object.entries(patterns) as [string, number][]
  const sortedPatterns = patternEntries.sort(([, a], [, b]) => b - a)

  // Count completed arcs
  const globalFlags = 'globalFlags' in gameState && gameState.globalFlags instanceof Set
    ? gameState.globalFlags
    : new Set(gameState.globalFlags || [])

  let arcsCompleted = 0
  if (globalFlags.has('maya_arc_complete')) arcsCompleted++
  if (globalFlags.has('devon_arc_complete')) arcsCompleted++
  if (globalFlags.has('jordan_arc_complete')) arcsCompleted++
  if (globalFlags.has('yaquin_arc_complete')) arcsCompleted++
  if (globalFlags.has('tess_arc_complete')) arcsCompleted++
  if (globalFlags.has('kai_arc_complete')) arcsCompleted++
  if (globalFlags.has('rohan_arc_complete')) arcsCompleted++
  if (globalFlags.has('silas_arc_complete')) arcsCompleted++

  // Calculate average trust
  const characters = 'characters' in gameState && gameState.characters instanceof Map
    ? Array.from(gameState.characters.values())
    : (gameState as SerializableGameState).characters || []

  const trusts = characters.map((c: { trust?: number }) => c.trust || 0).filter((t: number) => t > 0)
  const averageTrust = trusts.length > 0
    ? trusts.reduce((a: number, b: number) => a + b, 0) / trusts.length
    : 0

  // Estimate total choices from pattern values
  const totalChoices = patternEntries.reduce((sum, [, val]) => sum + val, 0)

  return {
    arcsCompleted: Math.max(1, arcsCompleted), // At least 1 if they're seeing this
    totalChoices: Math.max(1, totalChoices),
    dominantPattern: sortedPatterns[0]?.[0] || 'helping',
    secondaryPattern: sortedPatterns[1]?.[0] || 'analytical',
    averageTrust: Math.round(averageTrust * 10) / 10
  }
}

/**
 * Main function: Generate complete journey narrative
 */
export function generateJourneyNarrative(
  gameState: GameState | SerializableGameState,
  demonstrations?: SkillDemonstration[]
): JourneyNarrative {
  const stats = calculateStats(gameState)

  return {
    openingParagraph: generateOpening(stats, gameState),
    patternReflection: generatePatternReflection(stats),
    relationshipReflections: generateRelationshipReflections(gameState),
    skillHighlights: generateSkillHighlights(demonstrations || []),
    closingWisdom: generateClosingWisdom(stats),
    journeyStats: stats
  }
}

/**
 * Check if the journey is "complete" enough for a summary
 * Requires at least 2 arcs completed or significant interaction
 */
export function isJourneyComplete(gameState: GameState | SerializableGameState): boolean {
  const stats = calculateStats(gameState)

  // Journey is complete if:
  // - 2+ arcs completed, OR
  // - 20+ choices made across patterns, OR
  // - Global flag "journey_complete" is set
  const globalFlags = 'globalFlags' in gameState && gameState.globalFlags instanceof Set
    ? gameState.globalFlags
    : new Set(gameState.globalFlags || [])

  return (
    stats.arcsCompleted >= 2 ||
    stats.totalChoices >= 20 ||
    globalFlags.has('journey_complete')
  )
}
