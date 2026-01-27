'use client'

import { AnimatePresence } from 'framer-motion'
import { GameChoices } from '@/components/GameChoices'
import { filterChoicesByLoad, type CognitiveLoadLevel } from '@/lib/cognitive-load'
import { getVoicedChoiceText } from '@/lib/consequence-echoes'
import type { EvaluatedChoice } from '@/lib/dialogue-graph'
import type { DialogueNode } from '@/lib/dialogue-graph'
import type { GameState } from '@/lib/character-state'
import type { OrbFillLevels } from '@/lib/choice-adapter'

interface GameFooterProps {
  isEnding: boolean
  availableChoices: EvaluatedChoice[]
  currentNode: DialogueNode | null
  gameState: GameState | null
  isProcessing: boolean
  orbFillLevels: OrbFillLevels
  cognitiveLoad: CognitiveLoadLevel
  onChoice: (choice: EvaluatedChoice) => void
}

export function GameFooter({
  isEnding,
  availableChoices,
  currentNode,
  gameState,
  isProcessing,
  orbFillLevels,
  cognitiveLoad,
  onChoice,
}: GameFooterProps) {
  return (
    <AnimatePresence mode="wait">
      {!isEnding && (
        <footer
          className="flex-shrink-0 sticky bottom-0 glass-panel max-w-4xl mx-auto w-full px-3 sm:px-4 z-20"
          style={{
            paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))'
          }}
        >
          {/* Response label - compact on mobile */}
          <div className="px-4 sm:px-6 pt-2 pb-0.5 text-center">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-[0.1em]">
              Your Response
            </span>
          </div>

          <div className="px-4 sm:px-6 pt-1 pb-2">
            {/* Scrollable choices container with scroll indicator */}
            <div className="relative w-full">
              {/* SINGLE SCROLL REFACTOR: Removed nested scroll - choices expand naturally */}
              {/* For >3 choices, TICKET-002 will add bottom sheet */}
              <div
                id="choices-container"
                className="w-full"
              >
                <GameChoices
                  choices={(() => {
                    // Hoist pivotal check effectively
                    const nodeTags = currentNode?.tags || []
                    const isNodePivotal = nodeTags.some(tag =>
                      ['pivotal', 'defining_moment', 'final_choice', 'climax', 'revelation', 'introduction'].includes(tag)
                    )

                    return filterChoicesByLoad(
                      availableChoices,
                      cognitiveLoad,
                      undefined, // Todo: Pass dominant pattern
                      isNodePivotal // Bypass filtering for pivotal moments
                    ).map((c) => {
                      // Find original index for the callback
                      const originalIndex = availableChoices.indexOf(c)

                      const voicedText = gameState ? getVoicedChoiceText(
                        c.choice.text,
                        c.choice.voiceVariations,
                        gameState.patterns
                      ) : c.choice.text
                      return {
                        text: voicedText,
                        pattern: c.choice.pattern,
                        feedback: c.choice.interaction === 'shake' ? 'shake' : undefined,
                        pivotal: isNodePivotal,
                        requiredOrbFill: c.choice.requiredOrbFill,
                        next: String(originalIndex)
                      }
                    })
                  })()}
                  isProcessing={isProcessing}
                  orbFillLevels={orbFillLevels}
                  onChoice={(c) => {
                    const index = parseInt(c.next || '0', 10)
                    const original = availableChoices[index]
                    if (original) onChoice(original)
                  }}
                  // FIX: Always use glass mode for dark theme (prevents white background issue)
                  glass={true}
                  playerPatterns={gameState?.patterns}
                  cognitiveLoad={cognitiveLoad}
                />
              </div>

              {/* Scroll indicator removed based on user feedback (often unnecessary) */}
            </div>
          </div>
        </footer>
      )}
    </AnimatePresence>
  )
}
