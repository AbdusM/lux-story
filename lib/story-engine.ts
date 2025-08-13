// Use the contemplative narrative instead of crisis narrative
import storyData from '@/data/contemplative-story.json'

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
 * Represents a player choice option - no costs, just text
 */
export interface Choice {
  /** Display text for the choice */
  text: string
  /** Consequence tag for tracking */
  consequence: string
  /** Scene ID to transition to after choice */
  nextScene: string
}

/**
 * Simplified story engine - just story, no manipulation
 */
export class StoryEngine {
  private chapters = storyData.chapters
  
  /**
   * Get a scene by ID
   */
  getScene(sceneId: string): Scene | null {
    const [chapterNum, sceneNum] = sceneId.split('-').map(Number)
    const chapter = this.chapters.find(c => c.id === chapterNum)
    if (!chapter) return null
    
    const scene = chapter.scenes.find(s => s.id === sceneId)
    if (!scene) return null
    
    // Return scene without any modifications or enhancements
    return {
      id: scene.id,
      type: scene.type as Scene['type'],
      speaker: scene.speaker,
      text: scene.text,
      choices: scene.choices?.map(c => ({
        text: c.text,
        consequence: c.consequence,
        nextScene: c.nextScene
      }))
    }
  }
  
  /**
   * Get the next scene ID in sequence
   */
  getNextScene(currentSceneId: string): string | null {
    const [chapterNum, sceneNum] = currentSceneId.split('-').map(Number)
    const chapter = this.chapters.find(c => c.id === chapterNum)
    if (!chapter) return null
    
    const currentIndex = chapter.scenes.findIndex(s => s.id === currentSceneId)
    if (currentIndex === -1 || currentIndex === chapter.scenes.length - 1) {
      return null
    }
    
    return chapter.scenes[currentIndex + 1].id
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
}