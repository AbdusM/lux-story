// Use the Grand Central Terminus narrative
import storyData from '@/data/grand-central-story.json'
import { generateDynamicChoices, ChoiceGenerator } from './choice-generator'
import type { GameState } from './game-store'

/**
 * Represents a single scene in the story
 */
export interface Scene {
  /** Unique scene identifier (e.g., '2-3') */
  id: string
  /** Type of scene interaction */
  type: 'narration' | 'dialogue' | 'choice'
  /** Character speaking (optional) */
  speaker?: string
  /** Scene text content */
  text?: string
  /** Available choices for choice scenes */
  choices?: Choice[]
}

/**
 * Orb fill requirement for gated choices (KOTOR-style)
 */
export interface OrbRequirement {
  /** Pattern that must reach the threshold */
  pattern: 'analytical' | 'patience' | 'exploring' | 'helping' | 'building'
  /** Fill percentage required (0-100) */
  threshold: number
}

/**
 * Represents a player choice option - no costs, just text
 */
export interface Choice {
  /** Display text for the choice */
  text: string
  /** Consequence tag for tracking */
  consequence: string
  /** Scene ID to transition to after choice */
  nextScene?: string
  /** State changes to apply when choice is made */
  stateChanges?: unknown
  /** Orb fill requirement - choice is locked until met (KOTOR-style) */
  requiredOrbFill?: OrbRequirement
  [key: string]: unknown // Add index signature
}

/**
 * Simplified story engine - just story, no manipulation
 */
export class StoryEngine {
  private chapters = storyData.chapters

  /**
   * Get a scene by ID with optional dynamic choices
   */
  async getScene(sceneId: string, gameState?: GameState): Promise<Scene | null> {
    const [chapterNum, _sceneNum] = sceneId.split('-').map(Number)
    const chapter = this.chapters.find(c => c.id === chapterNum)
    if (!chapter) return null

    const scene = chapter.scenes.find(s => s.id === sceneId)
    if (!scene) return null

    // Create base scene
    const baseScene: Scene = {
      id: scene.id,
      type: scene.type as Scene['type'],
      speaker: scene.speaker,
      text: scene.text,
      choices: scene.choices?.map(c => ({
        text: c.text,
        consequence: c.consequence,
        nextScene: c.nextScene || '',
        stateChanges: (c as { stateChanges?: unknown }).stateChanges
      }))
    }

    // Apply dynamic choices if game state is provided
    if (gameState && baseScene.choices) {
      try {
        // Generate anonymous player ID for choice generation
        const playerId = 'player_' + Date.now().toString(36)

        const dynamicChoices = await generateDynamicChoices(baseScene, gameState, {
          performanceLevel: this.getPerformanceLevel(gameState),
          platformContext: this.getPlatformContext(baseScene, gameState),
          characterContext: this.getCharacterContext(baseScene, gameState),
          enableLiveAugmentation: true,
          playerId, // Use actual player ID from game state
          liveAugmentationChance: 0.33
        })

        // Use dynamic choices if they were generated
        if (dynamicChoices.length > 0 && ChoiceGenerator.shouldUseDynamicChoices(baseScene)) {
          baseScene.choices = dynamicChoices
        }
      } catch (error) {
        console.warn('Dynamic choice generation failed, using static choices:', error)
        // Graceful fallback to static choices
      }
    }

    return baseScene
  }

  /**
   * Get the next scene ID in sequence
   */
  getNextScene(currentSceneId: string): string | null {
    // First, try to find the current scene and check if it has an explicit nextScene
    for (const chapter of this.chapters) {
      const scene = chapter.scenes.find(s => s.id === currentSceneId)
      if (scene && typeof scene === 'object' && scene !== null) {
        const sceneObj = scene as Record<string, unknown>
        if (typeof sceneObj.nextScene === 'string') {
          return sceneObj.nextScene
        }
      }
    }

    // Fallback to pattern-based logic for scenes without explicit nextScene
    // Extract chapter and scene number (handles patterns like 2-3a1, 2-9a-12, etc.)
    const match = currentSceneId.match(/^(\d+)-(\d+)([a-z]?)(?:-(\d+))?(\d*)$/)
    if (!match) {
      return null
    }

    const [, chapterNum, sceneNum, letter, dashNum, suffixNum] = match
    const chapter = parseInt(chapterNum)
    const scene = parseInt(sceneNum)

    // Get all scene IDs for this chapter
    const currentChapter = this.chapters.find(c => c.id === chapter)
    if (!currentChapter) return null

    const allSceneIds = currentChapter.scenes.map(s => s.id)

    // For simple numeric scenes (like 1-1), try the next number (1-2)
    if (!letter && !dashNum && !suffixNum) {
      const nextSimpleId = `${chapter}-${scene + 1}`
      if (allSceneIds.includes(nextSimpleId)) {
        return nextSimpleId
      }
    }

    // For scenes like 2-3a1 -> 2-3a2
    if (letter && suffixNum) {
      const nextSuffixId = `${chapter}-${scene}${letter}${parseInt(suffixNum) + 1}`
      if (allSceneIds.includes(nextSuffixId)) {
        return nextSuffixId
      }
    }

    // For scenes like 2-9a-11 -> 2-9a-12
    if (letter && dashNum && suffixNum) {
      const nextDashId = `${chapter}-${scene}${letter}-${dashNum}${parseInt(suffixNum) + 1}`
      if (allSceneIds.includes(nextDashId)) {
        return nextDashId
      }
    }

    // For lettered scenes (like 1-3a), try with number (1-3a -> 1-4a if exists, or next sequence)
    if (letter && !suffixNum && !dashNum) {
      // Try next number with same letter first
      const nextLetteredId = `${chapter}-${scene + 1}${letter}`
      if (allSceneIds.includes(nextLetteredId)) {
        return nextLetteredId
      }

      // Try next simple number
      const nextSimpleId = `${chapter}-${scene + 1}`
      if (allSceneIds.includes(nextSimpleId)) {
        return nextSimpleId
      }
    }

    // If we're at the end of a chapter, move to the next chapter
    const nextChapter = this.chapters.find(c => c.id === chapter + 1)
    if (nextChapter && nextChapter.scenes.length > 0) {
      return nextChapter.scenes[0].id
    }

    return null
  }

  /**
   * Get all available chapters
   */
  getChapters() {
    return this.chapters.map(c => ({
      id: c.id,
      title: c.title
    }))
  }

  /**
   * Get performance level from game state
   */
  private getPerformanceLevel(gameState: GameState): 'struggling' | 'learning' | 'mastering' {
    const level = gameState.performanceLevel || 0
    if (level < 0.3) return 'struggling'
    if (level < 0.7) return 'learning'
    return 'mastering'
  }

  /**
   * Get platform context from game state
   */
  private getPlatformContext(scene: Scene, gameState: GameState) {
    const sceneText = (scene.text || '').toLowerCase()

    // Detect platform references in scene
    if (sceneText.includes('platform 1')) {
      return {
        platformId: 'p1',
        warmth: gameState.platformWarmth?.p1 || 0,
        accessible: gameState.platformAccessible?.p1 !== false
      }
    }
    if (sceneText.includes('platform 3')) {
      return {
        platformId: 'p3',
        warmth: gameState.platformWarmth?.p3 || 0,
        accessible: gameState.platformAccessible?.p3 !== false
      }
    }
    if (sceneText.includes('platform 7')) {
      return {
        platformId: 'p7',
        warmth: gameState.platformWarmth?.p7 || 0,
        accessible: gameState.platformAccessible?.p7 !== false
      }
    }

    return undefined
  }

  /**
   * Get character context from game state
   */
  private getCharacterContext(scene: Scene, gameState: GameState) {
    const speaker = scene.speaker?.toLowerCase()

    if (speaker === 'samuel') {
      const trust = gameState.characterTrust?.samuel || 0
      const relationship: 'stranger' | 'acquaintance' | 'friend' | 'close' =
        trust > 7 ? 'close' : trust > 4 ? 'friend' : trust > 1 ? 'acquaintance' : 'stranger'

      return {
        characterId: 'samuel',
        trustLevel: trust,
        relationship
      }
    }
    if (speaker === 'maya') {
      const trust = gameState.characterTrust?.maya || 0
      const relationship: 'stranger' | 'acquaintance' | 'friend' | 'close' =
        trust > 7 ? 'close' : trust > 4 ? 'friend' : trust > 1 ? 'acquaintance' : 'stranger'

      return {
        characterId: 'maya',
        trustLevel: trust,
        relationship
      }
    }

    return undefined
  }
}