/**
 * StoryValidator - Comprehensive JSON Schema Validation
 *
 * Validates story structure, scene connections, and content quality
 * Ensures data integrity before and after streamlining operations
 */

import { StoryData, Scene, Choice, ValidationResult, getLuxStoryContext } from './lux-story-context'

export interface SchemaValidationResult {
  valid: boolean
  errors: SchemaError[]
  warnings: SchemaWarning[]
  statistics: ValidationStatistics
}

export interface SchemaError {
  code: string
  message: string
  path: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  fixSuggestion?: string
}

export interface SchemaWarning {
  code: string
  message: string
  path: string
  recommendation: string
}

export interface ValidationStatistics {
  totalScenes: number
  totalChoices: number
  averageChoicesPerScene: number
  scenesWithoutText: number
  brokenConnections: number
  orphanedScenes: number
  deadEndScenes: number
  birminghamReferences: number
  characterScenes: Record<string, number>
}

/**
 * Comprehensive story validation system
 */
export class StoryValidator {
  private context = getLuxStoryContext()

  /**
   * Validate complete story structure and content
   */
  async validateStory(storyData?: StoryData): Promise<SchemaValidationResult> {
    const story = storyData || this.context.storyData
    if (!story) {
      throw new Error('No story data available for validation')
    }

    console.log('🔍 Starting comprehensive story validation...')

    const result: SchemaValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      statistics: this.initializeStatistics()
    }

    // Run all validation checks
    await this.validateBasicStructure(story, result)
    await this.validateSceneStructure(story, result)
    await this.validateChoiceStructure(story, result)
    await this.validateConnections(story, result)
    await this.validateContentQuality(story, result)
    await this.validateBirminghamIntegration(story, result)
    await this.calculateStatistics(story, result)

    // Set overall validity
    result.valid = result.errors.filter(e => e.severity === 'critical' || e.severity === 'high').length === 0

    this.logValidationSummary(result)
    return result
  }

  /**
   * Validate story after streamlining operations
   */
  async validateStreamlinedStory(originalStory: StoryData, streamlinedStory: StoryData): Promise<SchemaValidationResult> {
    console.log('🔍 Validating streamlined story against original...')

    const result = await this.validateStory(streamlinedStory)

    // Additional streamlining-specific validations
    await this.validateStreamliningIntegrity(originalStory, streamlinedStory, result)
    await this.validateEssentialScenesPreserved(originalStory, streamlinedStory, result)
    await this.validateNarrativeCoherence(streamlinedStory, result)

    return result
  }

  /**
   * Quick validation for critical issues only
   */
  async quickValidate(storyData: StoryData): Promise<{ valid: boolean; criticalErrors: string[] }> {
    const errors: string[] = []

    // Check basic structure
    if (!storyData.title || !storyData.chapters || !Array.isArray(storyData.chapters)) {
      errors.push('Invalid basic story structure')
    }

    // Check for scenes
    let totalScenes = 0
    for (const chapter of storyData.chapters || []) {
      if (!chapter.scenes || !Array.isArray(chapter.scenes)) {
        errors.push(`Chapter ${chapter.id} has invalid scenes structure`)
        continue
      }
      totalScenes += chapter.scenes.length
    }

    if (totalScenes === 0) {
      errors.push('Story contains no scenes')
    }

    return {
      valid: errors.length === 0,
      criticalErrors: errors
    }
  }

  // Private validation methods

  private async validateBasicStructure(story: StoryData, result: SchemaValidationResult): Promise<void> {
    // Validate required fields
    if (!story.title) {
      result.errors.push({
        code: 'MISSING_TITLE',
        message: 'Story title is required',
        path: '/title',
        severity: 'high',
        fixSuggestion: 'Add a title property to the story data'
      })
    }

    if (!story.author) {
      result.warnings.push({
        code: 'MISSING_AUTHOR',
        message: 'Story author is recommended',
        path: '/author',
        recommendation: 'Add an author property for better documentation'
      })
    }

    if (!story.version) {
      result.warnings.push({
        code: 'MISSING_VERSION',
        message: 'Story version is recommended for tracking changes',
        path: '/version',
        recommendation: 'Add a version property using semantic versioning (e.g., "1.0.0")'
      })
    }

    // Validate chapters array
    if (!story.chapters || !Array.isArray(story.chapters)) {
      result.errors.push({
        code: 'INVALID_CHAPTERS',
        message: 'Chapters must be an array',
        path: '/chapters',
        severity: 'critical',
        fixSuggestion: 'Ensure chapters is an array of chapter objects'
      })
      return
    }

    if (story.chapters.length === 0) {
      result.errors.push({
        code: 'NO_CHAPTERS',
        message: 'Story must contain at least one chapter',
        path: '/chapters',
        severity: 'critical',
        fixSuggestion: 'Add at least one chapter to the story'
      })
    }

    // Validate chapter IDs are unique
    const chapterIds = new Set<string>()
    story.chapters.forEach((chapter, index) => {
      const chapterId = String(chapter.id)
      if (chapterIds.has(chapterId)) {
        result.errors.push({
          code: 'DUPLICATE_CHAPTER_ID',
          message: `Duplicate chapter ID: ${chapterId}`,
          path: `/chapters[${index}]/id`,
          severity: 'high',
          fixSuggestion: 'Ensure all chapter IDs are unique'
        })
      }
      chapterIds.add(chapterId)
    })
  }

  private async validateSceneStructure(story: StoryData, result: SchemaValidationResult): Promise<void> {
    const sceneIds = new Set<string>()

    for (let chapterIndex = 0; chapterIndex < story.chapters.length; chapterIndex++) {
      const chapter = story.chapters[chapterIndex]

      if (!chapter.scenes || !Array.isArray(chapter.scenes)) {
        result.errors.push({
          code: 'INVALID_SCENES',
          message: `Chapter ${chapter.id} scenes must be an array`,
          path: `/chapters[${chapterIndex}]/scenes`,
          severity: 'critical',
          fixSuggestion: 'Ensure scenes is an array of scene objects'
        })
        continue
      }

      for (let sceneIndex = 0; sceneIndex < chapter.scenes.length; sceneIndex++) {
        const scene = chapter.scenes[sceneIndex]
        const scenePath = `/chapters[${chapterIndex}]/scenes[${sceneIndex}]`

        // Validate required scene fields
        if (!scene.id) {
          result.errors.push({
            code: 'MISSING_SCENE_ID',
            message: 'Scene ID is required',
            path: `${scenePath}/id`,
            severity: 'critical',
            fixSuggestion: 'Add a unique ID to each scene'
          })
        } else {
          // Check for duplicate scene IDs
          if (sceneIds.has(scene.id)) {
            result.errors.push({
              code: 'DUPLICATE_SCENE_ID',
              message: `Duplicate scene ID: ${scene.id}`,
              path: `${scenePath}/id`,
              severity: 'critical',
              fixSuggestion: 'Ensure all scene IDs are unique across the entire story'
            })
          }
          sceneIds.add(scene.id)
        }

        if (!scene.text || scene.text.trim().length === 0) {
          result.warnings.push({
            code: 'EMPTY_SCENE_TEXT',
            message: `Scene ${scene.id} has empty or missing text`,
            path: `${scenePath}/text`,
            recommendation: 'Add meaningful text content to the scene'
          })
        }

        if (!scene.type) {
          result.warnings.push({
            code: 'MISSING_SCENE_TYPE',
            message: `Scene ${scene.id} is missing type field`,
            path: `${scenePath}/type`,
            recommendation: 'Add a type field (e.g., "narrative", "choice", "ending")'
          })
        }

        // Validate text length
        if (scene.text && scene.text.length > 2000) {
          result.warnings.push({
            code: 'LONG_SCENE_TEXT',
            message: `Scene ${scene.id} text is very long (${scene.text.length} characters)`,
            path: `${scenePath}/text`,
            recommendation: 'Consider breaking long scenes into smaller parts for better UX'
          })
        }
      }
    }

    result.statistics.totalScenes = sceneIds.size
  }

  private async validateChoiceStructure(story: StoryData, result: SchemaValidationResult): Promise<void> {
    let totalChoices = 0

    for (let chapterIndex = 0; chapterIndex < story.chapters.length; chapterIndex++) {
      const chapter = story.chapters[chapterIndex]
      if (!chapter.scenes) continue

      for (let sceneIndex = 0; sceneIndex < chapter.scenes.length; sceneIndex++) {
        const scene = chapter.scenes[sceneIndex]
        const scenePath = `/chapters[${chapterIndex}]/scenes[${sceneIndex}]`

        if (scene.choices) {
          if (!Array.isArray(scene.choices)) {
            result.errors.push({
              code: 'INVALID_CHOICES',
              message: `Scene ${scene.id} choices must be an array`,
              path: `${scenePath}/choices`,
              severity: 'high',
              fixSuggestion: 'Ensure choices is an array of choice objects'
            })
            continue
          }

          // Validate each choice
          for (let choiceIndex = 0; choiceIndex < scene.choices.length; choiceIndex++) {
            const choice = scene.choices[choiceIndex]
            const choicePath = `${scenePath}/choices[${choiceIndex}]`

            if (!choice.text || choice.text.trim().length === 0) {
              result.errors.push({
                code: 'EMPTY_CHOICE_TEXT',
                message: `Choice in scene ${scene.id} has empty text`,
                path: `${choicePath}/text`,
                severity: 'high',
                fixSuggestion: 'Add meaningful text to the choice'
              })
            }

            // Check choice text length
            if (choice.text && choice.text.length > 200) {
              result.warnings.push({
                code: 'LONG_CHOICE_TEXT',
                message: `Choice in scene ${scene.id} is very long`,
                path: `${choicePath}/text`,
                recommendation: 'Keep choice text concise for better UI display'
              })
            }

            totalChoices++
          }

          // Check for minimum choices in choice scenes
          if (scene.type === 'choice' && scene.choices.length < 2) {
            result.warnings.push({
              code: 'INSUFFICIENT_CHOICES',
              message: `Choice scene ${scene.id} has only ${scene.choices.length} choice(s)`,
              path: `${scenePath}/choices`,
              recommendation: 'Choice scenes should typically have 2+ options for meaningful player agency'
            })
          }

          // Check for too many choices
          if (scene.choices.length > 6) {
            result.warnings.push({
              code: 'TOO_MANY_CHOICES',
              message: `Scene ${scene.id} has ${scene.choices.length} choices`,
              path: `${scenePath}/choices`,
              recommendation: 'Consider grouping or reducing choices to avoid overwhelming players'
            })
          }
        }
      }
    }

    result.statistics.totalChoices = totalChoices
    result.statistics.averageChoicesPerScene = result.statistics.totalScenes > 0
      ? totalChoices / result.statistics.totalScenes
      : 0
  }

  private async validateConnections(story: StoryData, result: SchemaValidationResult): Promise<void> {
    const allSceneIds = new Set<string>()
    const referencedScenes = new Set<string>()
    let brokenConnections = 0

    // Collect all scene IDs
    for (const chapter of story.chapters) {
      if (chapter.scenes) {
        for (const scene of chapter.scenes) {
          if (scene.id) {
            allSceneIds.add(scene.id)
          }
        }
      }
    }

    // Check all connections
    for (let chapterIndex = 0; chapterIndex < story.chapters.length; chapterIndex++) {
      const chapter = story.chapters[chapterIndex]
      if (!chapter.scenes) continue

      for (let sceneIndex = 0; sceneIndex < chapter.scenes.length; sceneIndex++) {
        const scene = chapter.scenes[sceneIndex]
        const scenePath = `/chapters[${chapterIndex}]/scenes[${sceneIndex}]`

        // Check nextScene connections
        if (scene.nextScene) {
          referencedScenes.add(scene.nextScene)
          if (!allSceneIds.has(scene.nextScene)) {
            result.errors.push({
              code: 'BROKEN_NEXT_SCENE',
              message: `Scene ${scene.id} references non-existent scene: ${scene.nextScene}`,
              path: `${scenePath}/nextScene`,
              severity: 'high',
              fixSuggestion: 'Update nextScene to reference an existing scene ID or remove if not needed'
            })
            brokenConnections++
          }
        }

        // Check choice connections
        if (scene.choices) {
          for (let choiceIndex = 0; choiceIndex < scene.choices.length; choiceIndex++) {
            const choice = scene.choices[choiceIndex]
            const choicePath = `${scenePath}/choices[${choiceIndex}]`

            if (choice.nextScene) {
              referencedScenes.add(choice.nextScene)
              if (!allSceneIds.has(choice.nextScene)) {
                result.errors.push({
                  code: 'BROKEN_CHOICE_CONNECTION',
                  message: `Choice in scene ${scene.id} references non-existent scene: ${choice.nextScene}`,
                  path: `${choicePath}/nextScene`,
                  severity: 'high',
                  fixSuggestion: 'Update nextScene to reference an existing scene ID'
                })
                brokenConnections++
              }
            } else if (scene.type === 'choice') {
              result.warnings.push({
                code: 'CHOICE_WITHOUT_CONNECTION',
                message: `Choice in scene ${scene.id} has no nextScene`,
                path: `${choicePath}/nextScene`,
                recommendation: 'Add a nextScene property to define where this choice leads'
              })
            }
          }
        }
      }
    }

    // Find orphaned scenes (not referenced by any connection)
    const orphanedScenes: string[] = []
    for (const sceneId of allSceneIds) {
      if (!referencedScenes.has(sceneId)) {
        // Check if it's the first scene (typically not referenced)
        const isFirstScene = story.chapters[0]?.scenes?.[0]?.id === sceneId
        if (!isFirstScene) {
          orphanedScenes.push(sceneId)
        }
      }
    }

    if (orphanedScenes.length > 0) {
      result.warnings.push({
        code: 'ORPHANED_SCENES',
        message: `Found ${orphanedScenes.length} unreachable scenes: ${orphanedScenes.join(', ')}`,
        path: '/scenes',
        recommendation: 'Ensure all scenes can be reached through story navigation'
      })
    }

    result.statistics.brokenConnections = brokenConnections
    result.statistics.orphanedScenes = orphanedScenes.length
  }

  private async validateContentQuality(story: StoryData, result: SchemaValidationResult): Promise<void> {
    let scenesWithoutText = 0
    const characterScenes: Record<string, number> = {}

    for (const chapter of story.chapters) {
      if (!chapter.scenes) continue

      for (const scene of chapter.scenes) {
        // Count scenes without meaningful text
        if (!scene.text || scene.text.trim().length < 10) {
          scenesWithoutText++
        }

        // Track character appearances
        if (scene.speaker && scene.speaker !== 'Narrator') {
          const speaker = scene.speaker.split('(')[0].trim()
          characterScenes[speaker] = (characterScenes[speaker] || 0) + 1
        }

        // Check for potential formatting issues
        if (scene.text) {
          // Check for unescaped quotes that might break JSON
          const unescapedQuotes = (scene.text.match(/(?<!\\)"/g) || []).length
          if (unescapedQuotes > 0) {
            result.warnings.push({
              code: 'UNESCAPED_QUOTES',
              message: `Scene ${scene.id} may have unescaped quotes in text`,
              path: `/scenes/${scene.id}/text`,
              recommendation: 'Ensure quotes are properly escaped for JSON compatibility'
            })
          }

          // Check for very short text
          if (scene.text.trim().length < 50 && scene.type !== 'ending') {
            result.warnings.push({
              code: 'SHORT_SCENE_TEXT',
              message: `Scene ${scene.id} has very short text (${scene.text.trim().length} chars)`,
              path: `/scenes/${scene.id}/text`,
              recommendation: 'Consider adding more descriptive content for better player engagement'
            })
          }
        }
      }
    }

    result.statistics.scenesWithoutText = scenesWithoutText
    result.statistics.characterScenes = characterScenes
  }

  private async validateBirminghamIntegration(story: StoryData, result: SchemaValidationResult): Promise<void> {
    if (!this.context.configuration) return

    const birminghamKeywords = this.context.configuration.streamlining.careerKeywords.birmingham
    let birminghamReferences = 0

    for (const chapter of story.chapters) {
      if (!chapter.scenes) continue

      for (const scene of chapter.scenes) {
        if (scene.text) {
          const lowerText = scene.text.toLowerCase()
          const foundKeywords = birminghamKeywords.filter(keyword =>
            lowerText.includes(keyword.toLowerCase())
          )
          birminghamReferences += foundKeywords.length
        }
      }
    }

    result.statistics.birminghamReferences = birminghamReferences

    if (birminghamReferences === 0) {
      result.warnings.push({
        code: 'NO_BIRMINGHAM_REFERENCES',
        message: 'Story contains no Birmingham-specific references',
        path: '/content',
        recommendation: 'Consider adding local Birmingham references for better relevance'
      })
    } else if (birminghamReferences < 5) {
      result.warnings.push({
        code: 'FEW_BIRMINGHAM_REFERENCES',
        message: `Story has only ${birminghamReferences} Birmingham references`,
        path: '/content',
        recommendation: 'Consider adding more local context for Birmingham audience'
      })
    }
  }

  private async validateStreamliningIntegrity(
    original: StoryData,
    streamlined: StoryData,
    result: SchemaValidationResult
  ): Promise<void> {
    const originalScenes = this.getAllSceneIds(original)
    const streamlinedScenes = this.getAllSceneIds(streamlined)
    const removedScenes = originalScenes.filter(id => !streamlinedScenes.includes(id))

    if (removedScenes.length === 0) {
      result.warnings.push({
        code: 'NO_SCENES_REMOVED',
        message: 'Streamlining process removed no scenes',
        path: '/streamlining',
        recommendation: 'Verify streamlining criteria are working correctly'
      })
    }

    const removalPercentage = (removedScenes.length / originalScenes.length) * 100
    if (removalPercentage > 70) {
      result.warnings.push({
        code: 'EXCESSIVE_REMOVAL',
        message: `Streamlining removed ${removalPercentage.toFixed(1)}% of scenes`,
        path: '/streamlining',
        recommendation: 'Review streamlining criteria to ensure story coherence'
      })
    }
  }

  private async validateEssentialScenesPreserved(
    original: StoryData,
    streamlined: StoryData,
    result: SchemaValidationResult
  ): Promise<void> {
    if (!this.context.configuration) return

    const essentialScenes = this.context.configuration.streamlining.essentialScenes.manualList
    const streamlinedScenes = this.getAllSceneIds(streamlined)
    const missingEssential = essentialScenes.filter(id => !streamlinedScenes.includes(id))

    if (missingEssential.length > 0) {
      result.errors.push({
        code: 'MISSING_ESSENTIAL_SCENES',
        message: `Essential scenes removed: ${missingEssential.join(', ')}`,
        path: '/essentialScenes',
        severity: 'critical',
        fixSuggestion: 'Ensure all essential scenes are preserved during streamlining'
      })
    }
  }

  private async validateNarrativeCoherence(story: StoryData, result: SchemaValidationResult): Promise<void> {
    // Check for dead ends (scenes with no way forward)
    const deadEnds: string[] = []

    for (const chapter of story.chapters) {
      if (!chapter.scenes) continue

      for (const scene of chapter.scenes) {
        const hasNextScene = !!scene.nextScene
        const hasChoices = scene.choices && scene.choices.length > 0
        const isEndingScene = scene.type === 'ending'

        if (!hasNextScene && !hasChoices && !isEndingScene) {
          deadEnds.push(scene.id)
        }
      }
    }

    if (deadEnds.length > 0) {
      result.errors.push({
        code: 'NARRATIVE_DEAD_ENDS',
        message: `Found ${deadEnds.length} scenes with no way forward: ${deadEnds.join(', ')}`,
        path: '/narrative',
        severity: 'high',
        fixSuggestion: 'Add connections or mark scenes as ending scenes'
      })
    }

    result.statistics.deadEndScenes = deadEnds.length
  }

  private async calculateStatistics(story: StoryData, result: SchemaValidationResult): Promise<void> {
    // Statistics are calculated during other validation steps
    // This method serves as a final check and summary

    if (result.statistics.totalScenes > 0 && result.statistics.totalChoices > 0) {
      result.statistics.averageChoicesPerScene =
        Number((result.statistics.totalChoices / result.statistics.totalScenes).toFixed(2))
    }
  }

  private initializeStatistics(): ValidationStatistics {
    return {
      totalScenes: 0,
      totalChoices: 0,
      averageChoicesPerScene: 0,
      scenesWithoutText: 0,
      brokenConnections: 0,
      orphanedScenes: 0,
      deadEndScenes: 0,
      birminghamReferences: 0,
      characterScenes: {}
    }
  }

  private getAllSceneIds(story: StoryData): string[] {
    const sceneIds: string[] = []
    for (const chapter of story.chapters) {
      if (chapter.scenes) {
        for (const scene of chapter.scenes) {
          if (scene.id) {
            sceneIds.push(scene.id)
          }
        }
      }
    }
    return sceneIds
  }

  private logValidationSummary(result: SchemaValidationResult): void {
    const { statistics, errors, warnings } = result

    console.log('\n📊 Validation Summary:')
    console.log(`   Scenes: ${statistics.totalScenes}`)
    console.log(`   Choices: ${statistics.totalChoices} (avg: ${statistics.averageChoicesPerScene}/scene)`)
    console.log(`   Birmingham refs: ${statistics.birminghamReferences}`)
    console.log(`   Characters: ${Object.keys(statistics.characterScenes).length}`)

    if (errors.length > 0) {
      console.log(`\n❌ Errors: ${errors.length}`)
      errors.slice(0, 3).forEach(error => {
        console.log(`   ${error.severity.toUpperCase()}: ${error.message}`)
      })
      if (errors.length > 3) {
        console.log(`   ... and ${errors.length - 3} more errors`)
      }
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️ Warnings: ${warnings.length}`)
      warnings.slice(0, 3).forEach(warning => {
        console.log(`   ${warning.message}`)
      })
      if (warnings.length > 3) {
        console.log(`   ... and ${warnings.length - 3} more warnings`)
      }
    }

    if (result.valid) {
      console.log('\n✅ Story validation passed!')
    } else {
      console.log('\n❌ Story validation failed - critical issues found')
    }
  }
}

// Export convenience function
export const createStoryValidator = () => new StoryValidator()