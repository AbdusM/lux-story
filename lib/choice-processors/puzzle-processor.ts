/**
 * Synthesis Puzzle Processor
 *
 * Phase 4B: Extracted from useChoiceHandler to reduce file size.
 * Handles D-083: Synthesis Puzzle Auto-Checking.
 *
 * Contract:
 * - NO setState calls
 * - NO audio triggers
 * - Returns values only (state changes + optional echo + localStorage writes)
 */

import type { GameState } from '@/lib/character-state'
import { GameStateUtils, type PlayerPatterns } from '@/lib/character-state'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import { SYNTHESIS_PUZZLES } from '@/content/synthesis-puzzles'

export interface PuzzleProcessorInput {
  gameState: GameState
  /** Pre-loaded from localStorage */
  completedPuzzles: Set<string>
  /** Pre-loaded from localStorage */
  hintsShown: Set<string>
}

export interface PuzzleProcessorResult {
  newGameState: GameState
  consequenceEcho: ConsequenceEcho | null
  /** Updated completed puzzles set */
  completedPuzzles: Set<string>
  /** Updated hints shown set */
  hintsShown: Set<string>
  /** localStorage writes to buffer */
  localStorageWrites: Record<string, string>
  logs: Array<{ type: 'complete' | 'hint'; puzzleId: string; data: Record<string, unknown> }>
}

/**
 * Process synthesis puzzles for auto-completion or hints.
 */
export function processSynthesisPuzzles(
  input: PuzzleProcessorInput,
  existingEcho: ConsequenceEcho | null
): PuzzleProcessorResult {
  let newGameState = input.gameState
  let consequenceEcho = existingEcho
  const completedPuzzles = new Set(input.completedPuzzles)
  const hintsShown = new Set(input.hintsShown)
  const localStorageWrites: Record<string, string> = {}
  const logs: PuzzleProcessorResult['logs'] = []

  // Collect all knowledge flags (global + character-specific)
  const allKnowledge = new Set<string>(newGameState.globalFlags)
  newGameState.characters.forEach(char => {
    char.knowledgeFlags.forEach(flag => allKnowledge.add(flag))
  })

  for (const puzzle of SYNTHESIS_PUZZLES) {
    // Skip already completed puzzles
    if (completedPuzzles.has(puzzle.id)) continue
    if (newGameState.globalFlags.has(puzzle.reward.unlockFlag || '')) continue

    // Count how many required flags we have
    const matchingFlags = puzzle.requiredKnowledge.filter(flag => allKnowledge.has(flag))
    const progress = matchingFlags.length / puzzle.requiredKnowledge.length

    // Puzzle complete-all knowledge gathered
    if (progress >= 1.0) {
      // Apply rewards
      if (puzzle.reward.patternBonus) {
        const patternUpdates: Partial<PlayerPatterns> = {}
        for (const [pattern, bonus] of Object.entries(puzzle.reward.patternBonus)) {
          patternUpdates[pattern as keyof PlayerPatterns] = bonus as number
        }
        newGameState = GameStateUtils.applyStateChange(newGameState, { patternChanges: patternUpdates })
      }
      if (puzzle.reward.unlockFlag) {
        newGameState.globalFlags.add(puzzle.reward.unlockFlag)
      }

      // Mark as completed
      completedPuzzles.add(puzzle.id)
      localStorageWrites['lux_completed_synthesis_puzzles'] = JSON.stringify([...completedPuzzles])

      // Show completion echo if no other pending
      if (!consequenceEcho) {
        consequenceEcho = {
          text: `Synthesis complete: "${puzzle.title}"-${puzzle.solution}`,
          emotion: 'revelation',
          timing: 'immediate'
        }
      }

      logs.push({
        type: 'complete',
        puzzleId: puzzle.id,
        data: { title: puzzle.title, unlockFlag: puzzle.reward.unlockFlag }
      })
    }
    // Puzzle partially complete (50%+)-show hint
    else if (progress >= 0.5 && !hintsShown.has(puzzle.id)) {
      hintsShown.add(puzzle.id)
      localStorageWrites['lux_synthesis_hints_shown'] = JSON.stringify([...hintsShown])

      if (!consequenceEcho) {
        consequenceEcho = {
          text: `Something is connecting... "${puzzle.title}"-${puzzle.hint}`,
          emotion: 'curious',
          timing: 'immediate'
        }
      }

      logs.push({
        type: 'hint',
        puzzleId: puzzle.id,
        data: { progress: Math.round(progress * 100) + '%' }
      })
    }
  }

  return {
    newGameState,
    consequenceEcho,
    completedPuzzles,
    hintsShown,
    localStorageWrites,
    logs
  }
}
