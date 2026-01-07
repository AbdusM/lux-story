/**
 * Story Arc System
 * Feature ID: D-061
 *
 * Manages multi-session narrative threads that span multiple characters
 * and track progress over time parallel to the main graph.
 */

import { GameState, PlayerPatterns } from './character-state'
import type { CharacterId } from './graph-registry'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A major narrative arc spanning multiple sessions/characters
 */
export interface StoryArc {
  id: string
  title: string
  description: string
  chapters: StoryChapter[]
  requiredCharacters: string[]
  unlockCondition?: {
    minTrust?: Record<string, number>
    requiredFlags?: string[]
    minPatterns?: Partial<PlayerPatterns>
  }
}

/**
 * A single chapter within a story arc
 */
export interface StoryChapter {
  id: string
  title: string
  description: string
  nodeIds: string[]           // Dialogue nodes involved in this chapter
  completionFlag: string      // Flag set when chapter completes
  nextChapterTrigger?: string // What unlocks next chapter (optional)
  rewards?: {
    trustBonus?: Record<string, number>
    patternBonus?: Partial<PlayerPatterns>
  }
}

/**
 * State of all story arcs for a player
 */
export interface StoryArcState {
  activeArcs: Set<string>        // IDs of arcs currently in progress
  completedArcs: Set<string>     // IDs of fully completed arcs
  chapterProgress: Map<string, number> // Arc ID -> Current Chapter Index
  completedChapters: Set<string> // IDs of all completed chapters (arcId_chapterId)
}

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create initial empty story arc state
 */
export function createStoryArcState(): StoryArcState {
  return {
    activeArcs: new Set(),
    completedArcs: new Set(),
    chapterProgress: new Map(),
    completedChapters: new Set()
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGIC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a story arc should unlock
 */
export function checkArcUnlock(
  arc: StoryArc,
  gameState: GameState
): boolean {
  if (!arc.unlockCondition) return true

  // Check flags
  if (arc.unlockCondition.requiredFlags) {
    const hasFlags = arc.unlockCondition.requiredFlags.every(flag =>
      gameState.globalFlags.has(flag)
    )
    if (!hasFlags) return false
  }

  // Check trust
  if (arc.unlockCondition.minTrust) {
    for (const [charId, min] of Object.entries(arc.unlockCondition.minTrust)) {
      const charState = gameState.characters.get(charId as CharacterId)
      const charTrust = charState?.trust || 0
      if (charTrust < min) return false
    }
  }

  // Check patterns
  if (arc.unlockCondition.minPatterns) {
    for (const [pattern, min] of Object.entries(arc.unlockCondition.minPatterns)) {
      if ((gameState.patterns[pattern as keyof PlayerPatterns] || 0) < (min || 0)) {
        return false
      }
    }
  }

  return true
}

/**
 * Start a story arc
 */
export function startStoryArc(
  state: StoryArcState,
  arcId: string
): StoryArcState {
  if (state.activeArcs.has(arcId) || state.completedArcs.has(arcId)) {
    return state
  }

  const newActive = new Set(state.activeArcs)
  newActive.add(arcId)

  const newProgress = new Map(state.chapterProgress)
  newProgress.set(arcId, 0) // Start at chapter 0

  return {
    ...state,
    activeArcs: newActive,
    chapterProgress: newProgress
  }
}

/**
 * Complete a chapter in an arc
 */
export function completeChapter(
  state: StoryArcState,
  arc: StoryArc,
  chapterId: string
): { newState: StoryArcState; arcCompleted: boolean } {
  const currentChapterIndex = state.chapterProgress.get(arc.id)
  if (currentChapterIndex === undefined) return { newState: state, arcCompleted: false }

  const chapter = arc.chapters.find(c => c.id === chapterId)
  if (!chapter) return { newState: state, arcCompleted: false }

  // Record chapter completion
  const newCompletedChapters = new Set(state.completedChapters)
  newCompletedChapters.add(`${arc.id}_${chapterId}`)

  // Advancement logic
  let newChapterIndex = currentChapterIndex
  // Only advance if this was the current chapter
  if (arc.chapters[currentChapterIndex].id === chapterId) {
    newChapterIndex++
  }

  const arcCompleted = newChapterIndex >= arc.chapters.length
  
  const newActive = new Set(state.activeArcs)
  const newCompletedArcs = new Set(state.completedArcs)
  const newProgress = new Map(state.chapterProgress)

  if (arcCompleted) {
    newActive.delete(arc.id)
    newCompletedArcs.add(arc.id)
    newProgress.delete(arc.id)
  } else {
    newProgress.set(arc.id, newChapterIndex)
  }

  return {
    newState: {
      activeArcs: newActive,
      completedArcs: newCompletedArcs,
      chapterProgress: newProgress,
      completedChapters: newCompletedChapters
    },
    arcCompleted
  }
}

/**
 * Get current active chapter for an arc
 */
export function getCurrentChapter(
  state: StoryArcState,
  arc: StoryArc
): StoryChapter | null {
  if (!state.activeArcs.has(arc.id)) return null
  
  const index = state.chapterProgress.get(arc.id)
  if (index === undefined || index >= arc.chapters.length) return null

  return arc.chapters[index]
}
