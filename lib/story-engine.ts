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
    const [chapterNum] = currentSceneId.split('-')
    
    // Handle special scene IDs that include letters (like 1-7b2)
    const baseSceneId = currentSceneId.replace(/[a-z]\d?$/i, '')
    
    // Try to find if there's a direct continuation (like 1-7b -> 1-7b2)
    const allSceneIds = this.chapters.flatMap(c => c.scenes.map(s => s.id))
    
    // Check for numbered continuation (1-7b2 -> 1-7b3)
    const match = currentSceneId.match(/^(\d+-\d+[a-z]?)(\d+)$/i)
    if (match) {
      const nextId = `${match[1]}${parseInt(match[2]) + 1}`
      if (allSceneIds.includes(nextId)) {
        return nextId
      }
    }
    
    // Check for lettered continuation (1-7b -> 1-7b2)
    const nextId = currentSceneId + '2'
    if (allSceneIds.includes(nextId)) {
      return nextId
    }
    
    // Check for numbered base scene continuation (1-7 -> 1-8)
    const sceneMatch = currentSceneId.match(/^(\d+)-(\d+)/)
    if (sceneMatch) {
      const nextBaseId = `${sceneMatch[1]}-${parseInt(sceneMatch[2]) + 1}`
      if (allSceneIds.includes(nextBaseId)) {
        return nextBaseId
      }
    }
    
    // If we're at the end of a chapter, move to the next chapter
    const currentChapterNum = parseInt(chapterNum)
    const nextChapter = this.chapters.find(c => c.id === currentChapterNum + 1)
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
}