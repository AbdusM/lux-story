/**
 * Samuel Dialogue Engine (Client-Side)
 *
 * Generates skill-aware Samuel dialogue by calling the /api/samuel-dialogue route.
 * Samuel "notices" player skills through observation, not explicit reporting.
 *
 * Usage:
 *   const samuel = getSamuelDialogueEngine()
 *   const dialogue = await samuel.generateDialogue(nodeId, persona, gameContext)
 */

import type { PlayerPersona } from './player-persona'

export interface SamuelDialogueRequest {
  nodeId: string
  playerPersona: PlayerPersona
  gameContext: {
    platformsVisited: string[]
    samuelTrust: number
    currentLocation: string
  }
}

export interface SamuelDialogueResponse {
  dialogue: string
  emotion: 'warm' | 'knowing' | 'reflective' | 'gentle'
  confidence: number
  generatedAt: number
  error?: string
  note?: string
}

/**
 * Samuel Dialogue Engine
 * Manages skill-aware dialogue generation and caching
 */
export class SamuelDialogueEngine {
  private cache: Map<string, SamuelDialogueResponse> = new Map()
  private requestInProgress: Map<string, Promise<SamuelDialogueResponse>> = new Map()

  /**
   * Generate skill-aware Samuel dialogue for a specific node
   */
  async generateDialogue(
    nodeId: string,
    playerPersona: PlayerPersona,
    gameContext: {
      platformsVisited: string[]
      samuelTrust: number
      currentLocation: string
    }
  ): Promise<SamuelDialogueResponse> {
    // Generate cache key from node ID and top skills
    const cacheKey = this.getCacheKey(nodeId, playerPersona)

    console.log('💬 [SamuelDialogue] Generating dialogue:', {
      nodeId,
      cacheKey: cacheKey.substring(0, 50) + '...',
      topSkills: playerPersona.topSkills.slice(0, 3).map(s => s.skill),
      cached: this.cache.has(cacheKey)
    })

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached) {
      const cacheAge = Date.now() - cached.generatedAt
      console.log('⚡ [SamuelDialogue] Cache HIT:', {
        nodeId,
        ageSeconds: Math.floor(cacheAge / 1000)
      })
      return cached
    }

    // Check if request already in progress
    const inProgress = this.requestInProgress.get(cacheKey)
    if (inProgress) {
      console.log('⏳ [SamuelDialogue] Request in progress, waiting...')
      return inProgress
    }

    console.log('🌐 [SamuelDialogue] Fetching from API:', { nodeId, cacheKey: cacheKey.substring(0, 30) })

    // Start new request
    const requestPromise = this.generateDialogueInternal(nodeId, playerPersona, gameContext)
    this.requestInProgress.set(cacheKey, requestPromise)

    try {
      const response = await requestPromise

      // Cache successful responses
      if (!response.error && response.confidence > 0.7) {
        this.cache.set(cacheKey, response)
        console.log('💾 [SamuelDialogue] Response cached:', {
          nodeId,
          confidence: response.confidence
        })
      }

      return response

    } finally {
      // Clean up request tracking
      this.requestInProgress.delete(cacheKey)
    }
  }

  /**
   * Internal method that makes the actual API call
   */
  private async generateDialogueInternal(
    nodeId: string,
    playerPersona: PlayerPersona,
    gameContext: {
      platformsVisited: string[]
      samuelTrust: number
      currentLocation: string
    }
  ): Promise<SamuelDialogueResponse> {
    const startTime = Date.now()

    try {
      const request: SamuelDialogueRequest = {
        nodeId,
        playerPersona,
        gameContext
      }

      const response = await fetch('/api/samuel-dialogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`Samuel dialogue API error: ${response.status} - ${errorData.error}`)
      }

      const data: SamuelDialogueResponse = await response.json()
      const generationTime = Date.now() - startTime

      console.log('✅ [SamuelDialogue] Dialogue generated:', {
        nodeId,
        dialogueLength: data.dialogue.length,
        emotion: data.emotion,
        confidence: data.confidence,
        generationTimeMs: generationTime,
        preview: data.dialogue.substring(0, 50) + '...'
      })

      return data

    } catch (error: any) {
      console.error('❌ [SamuelDialogue] Generation failed:', {
        nodeId,
        error: error.message,
        timeMs: Date.now() - startTime
      })

      // Return fallback dialogue
      return {
        dialogue: this.getFallbackDialogue(nodeId),
        emotion: 'warm',
        confidence: 0.5,
        generatedAt: Date.now(),
        error: error.message
      }
    }
  }

  /**
   * Generate cache key from node ID and player skills
   * This ensures same node with different skills gets different dialogue
   */
  private getCacheKey(nodeId: string, persona: PlayerPersona): string {
    const topSkills = persona.topSkills
      .slice(0, 3)
      .map(s => `${s.skill}:${s.count}`)
      .join('_')

    return `${nodeId}__${topSkills}`
  }

  /**
   * Get fallback dialogue if API fails
   */
  private getFallbackDialogue(nodeId: string): string {
    const fallbacks: Record<string, string> = {
      'samuel_hub_initial': "Take your time exploring the platforms. Each traveler here has something to teach you about yourself.",

      'samuel_wisdom_validation': "I've watched many travelers come through here feeling uncertain. The fact that you're asking questions means you're on the right path.",

      'samuel_backstory_intro': "I spent twenty-three years as an engineer before I found my way here. Sometimes the path reveals itself through what we help others discover.",

      'samuel_career_bridge': "The skills you're demonstrating - the way you listen, the questions you ask - those matter more than you realize.",

      'samuel_platform_guidance': "Your journey is showing me something about what calls to you. Trust what resonates.",

      'samuel_pattern_observation': "I see someone who creates space for others to find their own answers. That's a foundation you can build many things on.",

      'default': "The station has a way of showing us what we need to see when we're ready to see it. Keep exploring, keep listening."
    }

    return fallbacks[nodeId] || fallbacks['default']
  }

  /**
   * Clear dialogue cache
   * Useful when testing or when player persona significantly changes
   */
  clearCache() {
    this.cache.clear()
    console.log('[SamuelDialogue] Cache cleared')
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedResponses: this.cache.size,
      activeRequests: this.requestInProgress.size
    }
  }

  /**
   * Pre-generate dialogue for common nodes
   * Call this during loading screens or transitions
   */
  async preloadCommonNodes(
    persona: PlayerPersona,
    gameContext: {
      platformsVisited: string[]
      samuelTrust: number
      currentLocation: string
    }
  ) {
    const commonNodes = [
      'samuel_hub_initial',
      'samuel_wisdom_validation',
      'samuel_pattern_observation'
    ]

    console.log('[SamuelDialogue] Preloading', commonNodes.length, 'common nodes')

    // Generate in parallel
    const promises = commonNodes.map(nodeId =>
      this.generateDialogue(nodeId, persona, gameContext).catch(err => {
        console.warn('[SamuelDialogue] Preload failed for', nodeId, ':', err)
        return null
      })
    )

    await Promise.all(promises)

    console.log('[SamuelDialogue] Preload complete')
  }
}

// Singleton instance
let samuelDialogueEngine: SamuelDialogueEngine | null = null

export function getSamuelDialogueEngine(): SamuelDialogueEngine {
  if (!samuelDialogueEngine) {
    samuelDialogueEngine = new SamuelDialogueEngine()
  }
  return samuelDialogueEngine
}

/**
 * Helper function to extract skill summary for AI context
 */
export function getSkillSummaryForAI(persona: PlayerPersona): string {
  if (!persona.topSkills || persona.topSkills.length === 0) {
    return 'No skill demonstrations yet.'
  }

  let summary = 'Recent skill demonstrations:\n'

  const topThree = persona.topSkills.slice(0, 3)
  topThree.forEach(skill => {
    const skillData = persona.skillDemonstrations[skill.skill]
    const formattedName = formatSkillName(skill.skill)

    summary += `- ${formattedName}: ${skill.count}x (${Math.round(skill.percentage)}%)\n`

    if (skillData?.latestContext) {
      summary += `  Latest: "${skillData.latestContext}"\n`
    }
  })

  return summary.trim()
}

/**
 * Format skill name from camelCase to Title Case
 */
function formatSkillName(skill: string): string {
  return skill
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Test helper: Generate Samuel responses for different skill profiles
 */
export async function testSamuelDialogue() {
  const engine = getSamuelDialogueEngine()

  // Test Profile 1: High emotional_intelligence + communication
  const helperProfile: PlayerPersona = {
    playerId: 'test_helper',
    dominantPatterns: ['helping', 'patience'],
    patternCounts: { helping: 5, patience: 3 },
    patternPercentages: { helping: 0.62, patience: 0.38 },
    responseSpeed: 'moderate',
    stressResponse: 'calm',
    socialOrientation: 'helper',
    problemApproach: 'intuitive',
    culturalAlignment: 0.8,
    localReferences: ['UAB Medical', 'Children\'s Hospital'],
    communicationStyle: 'thoughtful',
    recentSkills: ['emotional_intelligence', 'communication', 'adaptability'],
    skillDemonstrations: {
      'emotional_intelligence': {
        count: 5,
        latestContext: 'Validated Maya\'s family pressure without rushing to fix it. Sat with her pain before offering perspective.',
        latestScene: 'maya_family_love',
        timestamp: Date.now()
      },
      'communication': {
        count: 3,
        latestContext: 'Asked Devon about his systems thinking without judgment, creating space for vulnerability.',
        latestScene: 'devon_technical_sharing',
        timestamp: Date.now()
      }
    },
    topSkills: [
      { skill: 'emotional_intelligence', count: 5, percentage: 50 },
      { skill: 'communication', count: 3, percentage: 30 },
      { skill: 'adaptability', count: 2, percentage: 20 }
    ],
    summaryText: 'Helper pattern with strong emotional intelligence',
    lastUpdated: Date.now(),
    totalChoices: 10
  }

  // Test Profile 2: High critical_thinking + problem_solving
  const analyzerProfile: PlayerPersona = {
    ...helperProfile,
    playerId: 'test_analyzer',
    dominantPatterns: ['analytical', 'building'],
    socialOrientation: 'independent',
    problemApproach: 'analytical',
    recentSkills: ['critical_thinking', 'problem_solving', 'creativity'],
    skillDemonstrations: {
      'critical_thinking': {
        count: 6,
        latestContext: 'Helped Maya see that biomedical engineering bridges both her passions and family expectations.',
        latestScene: 'maya_uab_bridge',
        timestamp: Date.now()
      },
      'problem_solving': {
        count: 4,
        latestContext: 'Identified the false binary in Devon\'s "logic OR emotion" thinking pattern.',
        latestScene: 'devon_breakthrough',
        timestamp: Date.now()
      }
    },
    topSkills: [
      { skill: 'critical_thinking', count: 6, percentage: 55 },
      { skill: 'problem_solving', count: 4, percentage: 36 },
      { skill: 'creativity', count: 1, percentage: 9 }
    ]
  }

  // Test Profile 3: High creativity + adaptability
  const explorerProfile: PlayerPersona = {
    ...helperProfile,
    playerId: 'test_explorer',
    dominantPatterns: ['exploring', 'building'],
    socialOrientation: 'collaborator',
    problemApproach: 'creative',
    recentSkills: ['creativity', 'adaptability', 'collaboration'],
    skillDemonstrations: {
      'creativity': {
        count: 5,
        latestContext: 'Suggested Platform 7½ - unexpected career combinations that blend multiple interests.',
        latestScene: 'jordan_unexpected_paths',
        timestamp: Date.now()
      },
      'adaptability': {
        count: 4,
        latestContext: 'Navigated between three different platforms, building connections across career paths.',
        latestScene: 'platform_exploration',
        timestamp: Date.now()
      }
    },
    topSkills: [
      { skill: 'creativity', count: 5, percentage: 50 },
      { skill: 'adaptability', count: 4, percentage: 40 },
      { skill: 'collaboration', count: 1, percentage: 10 }
    ]
  }

  const gameContext = {
    platformsVisited: ['Platform 1', 'Platform 3'],
    samuelTrust: 5,
    currentLocation: 'samuel_hub'
  }

  console.log('\n=== TESTING SAMUEL SKILL-AWARE DIALOGUE ===\n')

  // Test each profile
  for (const [profileName, profile] of [
    ['Helper (Emotional Intelligence)', helperProfile],
    ['Analyzer (Critical Thinking)', analyzerProfile],
    ['Explorer (Creativity)', explorerProfile]
  ]) {
    console.log(`\n--- Testing ${profileName} Profile ---`)

    try {
      const response = await engine.generateDialogue(
        'samuel_pattern_observation',
        profile,
        gameContext
      )

      console.log('\nSamuel\'s Response:')
      console.log(`"${response.dialogue}"`)
      console.log(`\nEmotion: ${response.emotion}`)
      console.log(`Confidence: ${response.confidence}`)

      if (response.note) {
        console.log(`Note: ${response.note}`)
      }

    } catch (error) {
      console.error(`Error testing ${profileName}:`, error)
    }
  }

  console.log('\n=== TEST COMPLETE ===\n')
}
