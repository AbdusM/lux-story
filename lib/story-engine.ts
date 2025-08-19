// Use the Grand Central Terminus narrative
import storyData from '@/data/grand-central-story.json'

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
  /** State changes to apply when choice is made */
  stateChanges?: any
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
        nextScene: c.nextScene,
        stateChanges: (c as any).stateChanges
      }))
    }
  }
  
  /**
   * Get the next scene ID in sequence
   */
  getNextScene(currentSceneId: string): string | null {
    // For Grand Central Terminus, most scenes are choice-driven
    // Only simple sequential scenes should auto-advance
    
    // Extract chapter and scene number
    const match = currentSceneId.match(/^(\d+)-(\d+)([a-z]?)(\d*)$/)
    if (!match) {
      return null
    }
    
    const [, chapterNum, sceneNum, letter, subNum] = match
    const chapter = parseInt(chapterNum)
    const scene = parseInt(sceneNum)
    
    // Get all scene IDs for this chapter
    const currentChapter = this.chapters.find(c => c.id === chapter)
    if (!currentChapter) return null
    
    const allSceneIds = currentChapter.scenes.map(s => s.id)
    
    // For simple numeric scenes (like 1-1), try the next number (1-2)
    if (!letter && !subNum) {
      const nextSimpleId = `${chapter}-${scene + 1}`
      if (allSceneIds.includes(nextSimpleId)) {
        return nextSimpleId
      }
    }
    
    // For lettered scenes (like 1-3a), try with number (1-3a -> 1-4a if exists, or next sequence)
    if (letter && !subNum) {
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
    
    // For numbered sub-scenes (like 1-7b2), try next number
    if (letter && subNum) {
      const nextSubId = `${chapter}-${scene}${letter}${parseInt(subNum) + 1}`
      if (allSceneIds.includes(nextSubId)) {
        return nextSubId
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
}