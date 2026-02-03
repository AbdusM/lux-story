/**
 * Story Arc Processor
 *
 * Phase 4B: Extracted from useChoiceHandler to reduce file size.
 * Handles D-061: Story Arc Progression (unlock + chapter completion).
 *
 * Contract:
 * - NO setState calls
 * - NO audio triggers
 * - Returns values only (state changes + optional echo)
 */

import type { GameState } from '@/lib/character-state'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import type { DialogueNode } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import { checkArcUnlock, startStoryArc, completeChapter, getCurrentChapter, createStoryArcState } from '@/lib/story-arcs'
import { ALL_STORY_ARCS, getArcById } from '@/content/story-arcs'

export interface StoryArcProcessorInput {
  gameState: GameState
  nextNode: DialogueNode
  targetCharacterId: CharacterId
  currentConversationHistory: string[]
}

export interface StoryArcProcessorResult {
  newGameState: GameState
  consequenceEcho: ConsequenceEcho | null
  logs: Array<{ type: 'unlock' | 'chapter'; data: Record<string, unknown> }>
}

/**
 * Process story arc progression for a node visit.
 * Checks for new arc unlocks and chapter completions.
 */
export function processStoryArcProgression(
  input: StoryArcProcessorInput,
  existingEcho: ConsequenceEcho | null
): StoryArcProcessorResult {
  let newGameState = input.gameState
  let consequenceEcho = existingEcho
  const logs: StoryArcProcessorResult['logs'] = []

  // Initialize story arc state if missing
  if (!newGameState.storyArcState) {
    newGameState = {
      ...newGameState,
      storyArcState: createStoryArcState()
    }
  }

  // Check for newly unlockable arcs
  for (const arc of ALL_STORY_ARCS) {
    const arcState = newGameState.storyArcState!
    if (!arcState.activeArcs.has(arc.id) && !arcState.completedArcs.has(arc.id)) {
      if (checkArcUnlock(arc, newGameState)) {
        newGameState = {
          ...newGameState,
          storyArcState: startStoryArc(arcState, arc.id)
        }
        // Generate unlock echo if no other echo pending
        if (!consequenceEcho) {
          consequenceEcho = {
            text: `A new thread emerges: "${arc.title}"-${arc.description}`,
            emotion: 'intrigued',
            timing: 'immediate'
          }
        }
        logs.push({
          type: 'unlock',
          data: { arcId: arc.id, title: arc.title }
        })
      }
    }
  }

  // Check if current node advances any active arc chapters
  const arcState = newGameState.storyArcState!
  for (const arcId of arcState.activeArcs) {
    const arc = getArcById(arcId)
    if (!arc) continue

    const currentChapter = getCurrentChapter(arcState, arc)
    if (!currentChapter) continue

    // Check if visited node is in current chapter's nodeIds
    if (currentChapter.nodeIds.includes(input.nextNode.nodeId)) {
      // Mark chapter complete if this was the last required node
      const visitedChapterNodes = currentChapter.nodeIds.filter(nodeId =>
        input.currentConversationHistory.includes(nodeId) || nodeId === input.nextNode.nodeId
      )

      if (visitedChapterNodes.length >= currentChapter.nodeIds.length) {
        // Complete the chapter
        const { newState: updatedArcState, arcCompleted } = completeChapter(arcState, arc, currentChapter.id)
        newGameState = {
          ...newGameState,
          storyArcState: updatedArcState
        }

        // Set the chapter completion flag
        newGameState.globalFlags.add(currentChapter.completionFlag)

        // Show completion echo if no other echo pending
        if (!consequenceEcho) {
          if (arcCompleted) {
            consequenceEcho = {
              text: `Story complete: "${arc.title}"-The threads have woven together.`,
              emotion: 'satisfied',
              timing: 'immediate'
            }
          } else {
            consequenceEcho = {
              text: `Chapter complete: "${currentChapter.title}"-The story continues...`,
              emotion: 'curious',
              timing: 'immediate'
            }
          }
        }

        logs.push({
          type: 'chapter',
          data: {
            arcId: arc.id,
            chapterId: currentChapter.id,
            completionFlag: currentChapter.completionFlag,
            arcCompleted
          }
        })
      }
    }
  }

  return { newGameState, consequenceEcho, logs }
}
