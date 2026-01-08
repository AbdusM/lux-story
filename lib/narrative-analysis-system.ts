/**
 * Narrative Analysis & Completion Tracker
 * Sub-Agent 1: Analyzes story arcs, consistency, pacing, and character journeys
 */

export interface StoryArc {
  id: string
  name: string
  type: 'main' | 'subplot' | 'character'
  status: 'setup' | 'development' | 'climax' | 'resolution' | 'complete'
  completionPercentage: number
  keyScenes: string[]
  unresolvedElements: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface CharacterJourney {
  characterId: string
  name: string
  emotionalState: string
  progression: {
    start: string
    current: string
    target: string
  }
  keyMoments: string[]
  unresolved: string[]
  alignment: 'on-track' | 'needs-adjustment' | 'off-track'
}

export interface NarrativeConsistency {
  issue: string
  type: 'contradiction' | 'plot-hole' | 'unresolved-setup' | 'timeline' | 'character' | 'pacing'
  severity: 'critical' | 'major' | 'minor'
  location: string
  description: string
  suggestedFix: string
}

export interface PacingAnalysis {
  chapter: string
  intensity: 'low' | 'medium' | 'high'
  revelationCount: number
  quietMoments: number
  balance: 'good' | 'too-intense' | 'too-slow'
  suggestions: string[]
}

export class NarrativeAnalysisSystem {
  private storyArcs: Map<string, StoryArc>
  private characterJourneys: Map<string, CharacterJourney>
  private consistencyIssues: NarrativeConsistency[]
  private pacingAnalysis: Map<string, PacingAnalysis>

  constructor() {
    this.storyArcs = new Map()
    this.characterJourneys = new Map()
    this.consistencyIssues = []
    this.pacingAnalysis = new Map()
    this.initializeAnalysis()
  }

  private initializeAnalysis() {
    // Main story arcs
    this.storyArcs.set('mysterious-letter', {
      id: 'mysterious-letter',
      name: 'The Mysterious Letter Arrival',
      type: 'main',
      status: 'setup',
      completionPercentage: 100,
      keyScenes: ['1-1', '1-2'],
      unresolvedElements: [],
      priority: 'high'
    })

    this.storyArcs.set('platform-discovery', {
      id: 'platform-discovery',
      name: 'Platform 7 Discovery and Career Exploration',
      type: 'main',
      status: 'development',
      completionPercentage: 85,
      keyScenes: ['1-8', '2-1', '2-5', '2-8'],
      unresolvedElements: ['Platform 7 purpose', 'Samuel\'s role'],
      priority: 'high'
    })

    this.storyArcs.set('character-crises', {
      id: 'character-crises',
      name: 'Character Personal Crises and Growth',
      type: 'subplot',
      status: 'development',
      completionPercentage: 70,
      keyScenes: ['2-3a2', '2-12', '3-2a', '3-2b', '3-2c'],
      unresolvedElements: ['Maya\'s final decision', 'Jordan\'s path clarity'],
      priority: 'medium'
    })

    this.storyArcs.set('birmingham-integration', {
      id: 'birmingham-integration',
      name: 'Birmingham Career Path Integration',
      type: 'main',
      status: 'climax',
      completionPercentage: 90,
      keyScenes: ['3-2a', '3-2b', '3-2c', '3-2d', '3-5', '3-8'],
      unresolvedElements: ['Final career choice impact'],
      priority: 'high'
    })

    // Character journeys
    this.characterJourneys.set('maya', {
      characterId: 'maya',
      name: 'Maya - Healthcare Path',
      emotionalState: 'struggling but determined',
      progression: {
        start: 'Lost job at Target, behind on bills',
        current: 'Exploring healthcare options, considering community college',
        target: 'Clear path to healthcare career with financial stability'
      },
      keyMoments: ['Job loss crisis', 'UAB exploration', 'Community college consideration'],
      unresolved: ['Final career decision', 'Financial aid application'],
      alignment: 'on-track'
    })

    this.characterJourneys.set('jordan', {
      characterId: 'jordan',
      name: 'Jordan - Trades Path',
      emotionalState: 'confident but seeking validation',
      progression: {
        start: 'Proud of trade skills, frustrated with college pressure',
        current: 'Exploring construction management and leadership roles',
        target: 'Leadership position in sustainable construction'
      },
      keyMoments: ['Trade school pride', 'Construction site visit', 'Leadership discussion'],
      unresolved: ['Specific trade specialization', 'Leadership development path'],
      alignment: 'on-track'
    })

    this.characterJourneys.set('devon', {
      characterId: 'devon',
      name: 'Devon - Technology Path',
      emotionalState: 'passionate but uncertain about path',
      progression: {
        start: 'Self-taught coder, frustrated with degree requirements',
        current: 'Exploring bootcamp options and alternative paths',
        target: 'Tech career without traditional degree path'
      },
      keyMoments: ['Coding passion reveal', 'Innovation Depot visit', 'Bootcamp exploration'],
      unresolved: ['Specific tech specialization', 'Portfolio development'],
      alignment: 'needs-adjustment'
    })

    this.characterJourneys.set('alex', {
      characterId: 'alex',
      name: 'Alex - Creative/Business Path',
      emotionalState: 'hopeful but grieving family history',
      progression: {
        start: 'Grieving father\'s steel job loss, seeking new opportunities',
        current: 'Exploring creative and business opportunities in changing Birmingham',
        target: 'Creative business that honors family while building future'
      },
      keyMoments: ['Family history reveal', 'Creative exploration', 'Business opportunity discussion'],
      unresolved: ['Specific creative direction', 'Business plan development'],
      alignment: 'on-track'
    })

    // Consistency issues
    this.consistencyIssues = [
      {
        issue: 'Samuel\'s temporal paradoxes may confuse Birmingham youth',
        type: 'character',
        severity: 'major',
        location: 'Multiple scenes with Samuel',
        description: 'Samuel speaks in confusing time paradoxes that may alienate working-class youth',
        suggestedFix: 'Simplify Samuel\'s language while keeping train conductor metaphor'
      },
      {
        issue: 'Platform 7 purpose unclear',
        type: 'plot-hole',
        severity: 'critical',
        location: 'Discovery scenes',
        description: 'Players may not understand why Platform 7 exists or what it represents',
        suggestedFix: 'Clarify Platform 7 as career exploration space'
      },
      {
        issue: 'Career path transitions feel abrupt',
        type: 'pacing',
        severity: 'minor',
        location: 'Chapter 2 to 3 transition',
        description: 'Jump from character crises to career exploration feels sudden',
        suggestedFix: 'Add transitional scenes that bridge personal struggles to career opportunities'
      }
    ]

    // Pacing analysis
    this.pacingAnalysis.set('chapter-1', {
      chapter: 'Chapter 1: Arrival',
      intensity: 'medium',
      revelationCount: 3,
      quietMoments: 2,
      balance: 'good',
      suggestions: ['Maintain mystery while building familiarity']
    })

    this.pacingAnalysis.set('chapter-2', {
      chapter: 'Chapter 2: Discovery',
      intensity: 'high',
      revelationCount: 5,
      quietMoments: 1,
      balance: 'too-intense',
      suggestions: ['Add more quiet character moments', 'Space out revelations']
    })

    this.pacingAnalysis.set('chapter-3', {
      chapter: 'Chapter 3: Integration',
      intensity: 'high',
      revelationCount: 4,
      quietMoments: 2,
      balance: 'good',
      suggestions: ['Maintain current pace for climax']
    })
  }

  /**
   * Analyze story arc completion
   */
  analyzeStoryArcs(): StoryArc[] {
    return Array.from(this.storyArcs.values())
  }

  /**
   * Get character journey analysis
   */
  analyzeCharacterJourneys(): CharacterJourney[] {
    return Array.from(this.characterJourneys.values())
  }

  /**
   * Get consistency issues
   */
  getConsistencyIssues(): NarrativeConsistency[] {
    return this.consistencyIssues
  }

  /**
   * Get pacing analysis
   */
  getPacingAnalysis(): PacingAnalysis[] {
    return Array.from(this.pacingAnalysis.values())
  }

  /**
   * Get critical issues that need immediate attention
   */
  getCriticalIssues(): NarrativeConsistency[] {
    return this.consistencyIssues.filter(issue => issue.severity === 'critical')
  }

  /**
   * Get narrative completion status
   */
  getNarrativeCompletionStatus(): {
    overallCompletion: number
    mainArcsComplete: number
    subplotsComplete: number
    characterArcsComplete: number
  } {
    const arcs = Array.from(this.storyArcs.values())
    const mainArcs = arcs.filter(arc => arc.type === 'main')
    const subplots = arcs.filter(arc => arc.type === 'subplot')
    const characterArcs = arcs.filter(arc => arc.type === 'character')

    const overallCompletion = arcs.reduce((sum, arc) => sum + arc.completionPercentage, 0) / arcs.length
    const mainArcsComplete = mainArcs.reduce((sum, arc) => sum + arc.completionPercentage, 0) / mainArcs.length
    const subplotsComplete = subplots.reduce((sum, arc) => sum + arc.completionPercentage, 0) / subplots.length
    const characterArcsComplete = characterArcs.reduce((sum, arc) => sum + arc.completionPercentage, 0) / characterArcs.length

    return {
      overallCompletion: Math.round(overallCompletion),
      mainArcsComplete: Math.round(mainArcsComplete),
      subplotsComplete: Math.round(subplotsComplete),
      characterArcsComplete: Math.round(characterArcsComplete)
    }
  }

  /**
   * Get priority fixes needed
   */
  getPriorityFixes(): {
    critical: NarrativeConsistency[]
    major: NarrativeConsistency[]
    minor: NarrativeConsistency[]
  } {
    return {
      critical: this.consistencyIssues.filter(issue => issue.severity === 'critical'),
      major: this.consistencyIssues.filter(issue => issue.severity === 'major'),
      minor: this.consistencyIssues.filter(issue => issue.severity === 'minor')
    }
  }

  /**
   * Update story arc status
   */
  updateStoryArc(arcId: string, updates: Partial<StoryArc>): void {
    const arc = this.storyArcs.get(arcId)
    if (arc) {
      Object.assign(arc, updates)
    }
  }

  /**
   * Update character journey
   */
  updateCharacterJourney(characterId: string, updates: Partial<CharacterJourney>): void {
    const journey = this.characterJourneys.get(characterId)
    if (journey) {
      Object.assign(journey, updates)
    }
  }

  /**
   * Add new consistency issue
   */
  addConsistencyIssue(issue: NarrativeConsistency): void {
    this.consistencyIssues.push(issue)
  }

  /**
   * Resolve consistency issue
   */
  resolveConsistencyIssue(issueIndex: number): void {
    this.consistencyIssues.splice(issueIndex, 1)
  }
}

// Singleton instance
let narrativeAnalysisSystem: NarrativeAnalysisSystem | null = null

export function getNarrativeAnalysisSystem(): NarrativeAnalysisSystem {
  if (!narrativeAnalysisSystem) {
    narrativeAnalysisSystem = new NarrativeAnalysisSystem()
  }
  return narrativeAnalysisSystem
}
