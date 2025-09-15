/**
 * Dynamic Choice Generation Engine
 * Replaces repetitive static choices with contextual, meaningful options
 */

import { generateContextualChoices, detectContext } from './choice-templates'
import { getLiveChoiceEngine, type LiveChoiceRequest } from './live-choice-engine'
import { getPersonaTracker } from './player-persona'
import { filterSimilarChoices } from './semantic-similarity'
import type { Choice, Scene } from './story-engine'
import type { GameState } from './game-store'

export interface ChoiceGenerationOptions {
  /** Override default pattern selection */
  requiredPatterns?: string[]

  /** Character relationship modifiers */
  characterContext?: {
    characterId: string
    trustLevel: number
    relationship: 'stranger' | 'acquaintance' | 'friend' | 'close'
  }

  /** Platform warmth affects choice tone */
  platformContext?: {
    platformId: string
    warmth: number
    accessible: boolean
  }

  /** Player performance affects complexity */
  performanceLevel?: 'struggling' | 'learning' | 'mastering'

  /** Force specific choice variation for testing */
  forceVariation?: number

  /** Enable live augmentation with AI */
  enableLiveAugmentation?: boolean

  /** Player ID for persona tracking */
  playerId?: string

  /** Live augmentation probability (0-1) */
  liveAugmentationChance?: number
}

/**
 * Enhanced choice generator that creates contextual choices
 */
export class ChoiceGenerator {
  /**
   * Determine if a scene should use dynamic choices
   */
  static shouldUseDynamicChoices(scene: Scene): boolean {
    // Use dynamic choices for scenes with generic/repetitive options
    if (!scene.choices || scene.choices.length === 0) return false

    const genericTexts = [
      'explore further',
      'discover something new',
      'take a risk',
      'try something different',
      'help someone',
      'offer support'
    ]

    const hasGenericChoices = scene.choices.some(choice =>
      genericTexts.some(generic =>
        choice.text.toLowerCase().includes(generic)
      )
    )

    return hasGenericChoices
  }

  /**
   * Generate dynamic choices for a scene with optional live augmentation
   */
  static async generateChoices(
    scene: Scene,
    gameState: GameState,
    options: ChoiceGenerationOptions = {}
  ): Promise<Choice[]> {
    const sceneText = scene.text || ''
    const contexts = detectContext(sceneText, gameState)

    // Determine patterns based on scene progression and context
    const patterns = this.selectPatterns(scene, gameState, contexts, options)

    // Generate base choices
    let choices = generateContextualChoices(sceneText, gameState, patterns)

    // Apply character relationship modifiers
    if (options.characterContext) {
      choices = this.applyCharacterModifiers(choices, options.characterContext, contexts)
    }

    // Apply platform warmth modifiers
    if (options.platformContext) {
      choices = this.applyPlatformModifiers(choices, options.platformContext)
    }

    // Apply performance level modifiers
    if (options.performanceLevel) {
      choices = this.applyPerformanceModifiers(choices, options.performanceLevel)
    }

    // Preserve original nextScene routing
    if (scene.choices && scene.choices.length > 0) {
      choices.forEach((choice, index) => {
        if (scene.choices![index]) {
          choice.nextScene = scene.choices![index].nextScene
        }
      })
    }

    // Layer 2: Live Augmentation Engine
    if (options.enableLiveAugmentation && options.playerId) {
      await this.applyLiveAugmentation(scene, gameState, choices, options)
    }

    // Layer 3: Semantic Similarity Filtering
    if (choices.length > 1) {
      console.log(`🔍 Applying semantic similarity filter to ${choices.length} choices...`)
      const threshold = parseFloat(process.env.CHOICE_SIMILARITY_THRESHOLD || '0.85')

      try {
        const filteredChoices = await filterSimilarChoices(choices, threshold)

        if (filteredChoices.length < choices.length) {
          console.log(`📊 Semantic filter: ${choices.length} → ${filteredChoices.length} choices`)
        }

        return filteredChoices as Choice[]
      } catch (error) {
        console.error('❌ Semantic filtering failed, returning original choices:', error)
        return choices
      }
    }

    return choices
  }

  /**
   * Select appropriate patterns based on scene context and progression
   */
  private static selectPatterns(
    scene: Scene,
    gameState: GameState,
    contexts: string[],
    options: ChoiceGenerationOptions
  ): string[] {
    if (options.requiredPatterns) {
      return options.requiredPatterns
    }

    const patterns: string[] = []
    const sceneId = scene.id
    const [chapter, sceneNum] = sceneId.split('-').map(Number)

    // Early game: focus on exploration
    if (chapter === 1 && sceneNum < 5) {
      patterns.push('exploring', 'exploring', 'helping', 'analyzing')
    }
    // Character interaction scenes: include helping
    else if (contexts.includes('character') || contexts.includes('lost')) {
      patterns.push('helping', 'exploring', 'building', 'patience')
    }
    // Problem/challenge scenes: include building and analyzing
    else if (contexts.includes('problem') || contexts.includes('mystery')) {
      patterns.push('analyzing', 'building', 'exploring', 'helping')
    }
    // Platform/career scenes: balanced approach
    else if (contexts.includes('station') || contexts.includes('opportunity')) {
      patterns.push('exploring', 'building', 'analyzing', 'helping')
    }
    // Default: exploration focused
    else {
      patterns.push('exploring', 'exploring', 'helping', 'patience')
    }

    return patterns.slice(0, 4) // Limit to 4 choices
  }

  /**
   * Apply character relationship modifiers to choice text
   */
  private static applyCharacterModifiers(
    choices: Choice[],
    characterContext: NonNullable<ChoiceGenerationOptions['characterContext']>,
    contexts: string[]
  ): Choice[] {
    const { trustLevel, relationship } = characterContext

    return choices.map(choice => {
      let modifiedText = choice.text

      // High trust = more personal/direct language
      if (trustLevel > 7 && choice.consequence.includes('helping')) {
        if (modifiedText.includes('help')) {
          modifiedText = modifiedText.replace('help', 'be there for')
        }
        if (modifiedText.includes('support')) {
          modifiedText = modifiedText.replace('support', 'stand by')
        }
      }

      // Low trust = more cautious language
      if (trustLevel < 3 && choice.consequence.includes('helping')) {
        if (modifiedText.includes('help')) {
          modifiedText = 'Offer to ' + modifiedText.toLowerCase()
        }
      }

      // Relationship-specific prefixes
      if (relationship === 'close' && contexts.includes('character')) {
        if (choice.consequence.includes('exploring') && Math.random() > 0.5) {
          modifiedText = 'Together, ' + modifiedText.toLowerCase()
        }
      }

      return {
        ...choice,
        text: modifiedText
      }
    })
  }

  /**
   * Apply platform warmth modifiers
   */
  private static applyPlatformModifiers(
    choices: Choice[],
    platformContext: NonNullable<ChoiceGenerationOptions['platformContext']>
  ): Choice[] {
    const { warmth, accessible } = platformContext

    return choices.map(choice => {
      let modifiedText = choice.text

      // Warm platforms = more inviting language
      if (warmth > 5) {
        if (choice.consequence.includes('exploring')) {
          modifiedText = modifiedText.replace('explore', 'discover')
          modifiedText = modifiedText.replace('investigate', 'explore')
        }
      }

      // Cold/inaccessible platforms = more cautious language
      if (warmth < 3 || !accessible) {
        if (choice.consequence.includes('exploring')) {
          modifiedText = 'Carefully ' + modifiedText.toLowerCase()
        }
      }

      return {
        ...choice,
        text: modifiedText
      }
    })
  }

  /**
   * Apply performance level modifiers
   */
  private static applyPerformanceModifiers(
    choices: Choice[],
    performanceLevel: NonNullable<ChoiceGenerationOptions['performanceLevel']>
  ): Choice[] {
    return choices.map(choice => {
      let modifiedText = choice.text

      // Struggling players = simpler, more direct language
      if (performanceLevel === 'struggling') {
        modifiedText = modifiedText.replace('investigate', 'look at')
        modifiedText = modifiedText.replace('analyze', 'think about')
        modifiedText = modifiedText.replace('construct', 'make')
      }

      // Mastering players = more sophisticated language
      if (performanceLevel === 'mastering') {
        modifiedText = modifiedText.replace('look at', 'examine')
        modifiedText = modifiedText.replace('help', 'collaborate with')
        modifiedText = modifiedText.replace('make', 'craft')
      }

      return {
        ...choice,
        text: modifiedText
      }
    })
  }

  /**
   * Apply live augmentation using AI generation
   */
  private static async applyLiveAugmentation(
    scene: Scene,
    gameState: GameState,
    choices: Choice[],
    options: ChoiceGenerationOptions
  ): Promise<void> {
    const liveEngine = getLiveChoiceEngine()
    const personaTracker = getPersonaTracker()

    // Determine if we should trigger live augmentation
    const augmentationChance = options.liveAugmentationChance || 0.33
    const shouldTrigger = Math.random() < augmentationChance || choices.length < 3

    if (!shouldTrigger) {
      console.log('🎯 Live augmentation skipped this time (probabilistic)')
      return
    }

    console.log('🚀 Triggering live augmentation...')

    // Get player persona
    const persona = personaTracker.getPersona(options.playerId!)

    // Select a pattern to augment (prefer less represented patterns)
    const existingPatterns = choices.map(c => c.consequence.split('_')[0])
    const availablePatterns = ['exploring', 'helping', 'building', 'analyzing', 'patience']

    // Find patterns not well represented
    const underrepresentedPatterns = availablePatterns.filter(pattern => {
      const count = existingPatterns.filter(p => p === pattern).length
      return count === 0 || (count === 1 && choices.length >= 4)
    })

    const targetPattern = underrepresentedPatterns.length > 0
      ? underrepresentedPatterns[Math.floor(Math.random() * underrepresentedPatterns.length)]
      : availablePatterns[Math.floor(Math.random() * availablePatterns.length)]

    // Prepare request
    const request: LiveChoiceRequest = {
      sceneContext: scene.text || '',
      pattern: targetPattern,
      playerPersona: persona.summaryText,
      existingChoices: choices.map(c => c.text),
      sceneId: scene.id,
      playerId: options.playerId
    }

    try {
      // Generate choice
      const liveResponse = await liveEngine.generateChoice(request)

      if (liveResponse && liveResponse.confidenceScore > 0.75) {
        // Create new choice
        const newChoice: Choice = {
          text: liveResponse.text,
          consequence: `${targetPattern}_live_generated`,
          nextScene: scene.choices?.[0]?.nextScene || 'next',
          stateChanges: {
            patterns: { [targetPattern]: 1 }
          }
        }

        // Add to choices array
        choices.push(newChoice)

        // Add to review queue
        liveEngine.addToReviewQueue(request, liveResponse)

        console.log('✨ Live choice generated:', liveResponse.text, `(confidence: ${liveResponse.confidenceScore})`)
      } else {
        console.log('⚠️ Live generation confidence too low or failed')
      }
    } catch (error) {
      console.error('❌ Live augmentation failed:', error)
      // Graceful fallback - system continues with curated choices
    }
  }

  /**
   * Enhanced choice generation that includes Birmingham context
   */
  static async generateBirminghamChoices(
    scene: Scene,
    gameState: GameState,
    options: ChoiceGenerationOptions = {}
  ): Promise<Choice[]> {
    const choices = await this.generateChoices(scene, gameState, options)

    // Add subtle Birmingham context for certain scenes
    const sceneText = (scene.text || '').toLowerCase()

    if (sceneText.includes('platform') && Math.random() > 0.7) {
      // Occasionally reference Birmingham transit
      choices.forEach(choice => {
        if (choice.consequence.includes('exploring')) {
          const birminghamRefs = [
            'like exploring downtown Birmingham',
            'similar to UAB campus exploration',
            'reminds you of discovering local spots'
          ]
          if (Math.random() > 0.8) {
            choice.text += ' (' + birminghamRefs[Math.floor(Math.random() * birminghamRefs.length)] + ')'
          }
        }
      })
    }

    return choices
  }
}

/**
 * Utility function for quick choice generation
 */
export async function generateDynamicChoices(
  scene: Scene,
  gameState: GameState,
  options?: ChoiceGenerationOptions
): Promise<Choice[]> {
  if (ChoiceGenerator.shouldUseDynamicChoices(scene)) {
    return await ChoiceGenerator.generateBirminghamChoices(scene, gameState, options)
  }

  return scene.choices || []
}