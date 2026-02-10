'use client'

import { AnimatePresence } from 'framer-motion'
import { GameChoices } from '@/components/GameChoices'
import { filterChoicesByLoad, type CognitiveLoadLevel } from '@/lib/cognitive-load'
import { getVoicedChoiceText } from '@/lib/consequence-echoes'
import type { EvaluatedChoice } from '@/lib/dialogue-graph'
import type { DialogueNode } from '@/lib/dialogue-graph'
import type { GameState } from '@/lib/character-state'
import type { OrbFillLevels } from '@/lib/choice-adapter'
import type { OutcomeCardData } from '@/lib/outcome-card'
import type { PrismTabId } from '@/lib/prism-tabs'
import { OutcomeCard } from '@/components/game/OutcomeCard'
import type { RewardFeedItem } from '@/lib/reward-feed'
import { RewardFeed } from '@/components/game/RewardFeed'
import { getPrimaryQuest, getQuestPrismTab } from '@/lib/quest-system'
import { isEnabled } from '@/lib/feature-flags'

interface GameFooterProps {
  isEnding: boolean
  availableChoices: EvaluatedChoice[]
  currentNode: DialogueNode | null
  gameState: GameState | null
  isProcessing: boolean
  outcomeCard: OutcomeCardData | null
  rewardFeed: RewardFeedItem[]
  onDismissOutcome: () => void
  onDismissRewardItem: (id: string) => void
  onOpenPrismTab: (tab: PrismTabId) => void
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
  outcomeCard,
  rewardFeed,
  onDismissOutcome,
  onDismissRewardItem,
  onOpenPrismTab,
  orbFillLevels,
  cognitiveLoad,
  onChoice,
}: GameFooterProps) {
  const primaryQuest = gameState ? getPrimaryQuest(gameState) : null
  const objectiveTab: PrismTabId | null = primaryQuest ? getQuestPrismTab(primaryQuest) : null

  return (
    <AnimatePresence mode="wait">
      {!isEnding && (
        <footer
          className="flex-shrink-0 sticky bottom-0 glass-panel max-w-4xl mx-auto w-full px-3 sm:px-4 z-20"
          style={{
            paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))'
          }}
        >
          {outcomeCard && (
            <div className="px-4 sm:px-6 pt-2">
              <OutcomeCard
                card={outcomeCard}
                onDismiss={onDismissOutcome}
                onOpenPrismTab={onOpenPrismTab}
              />
            </div>
          )}
          {rewardFeed && rewardFeed.length > 0 && (
            <div className="px-4 sm:px-6 pt-2">
              <RewardFeed
                items={rewardFeed}
                onDismissItem={onDismissRewardItem}
                onOpenPrismTab={onOpenPrismTab}
              />
            </div>
          )}

          {primaryQuest && (
            <div className="px-4 sm:px-6 pt-2">
              <div
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm flex items-start justify-between gap-3"
                data-testid="objective-pin"
              >
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
                    Objective
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-200 truncate">
                    {primaryQuest.title}
                  </div>
                  {primaryQuest.description && (
                    <div className="mt-0.5 text-[11px] text-slate-400 line-clamp-2">
                      {primaryQuest.description}
                    </div>
                  )}
                </div>
                {objectiveTab && (
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                    onClick={() => onOpenPrismTab(objectiveTab)}
                    data-testid="objective-view"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          )}

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

                    const presented = filterChoicesByLoad(
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
                        id: c.choice.choiceId,
                        text: voicedText,
                        pattern: c.choice.pattern,
                        gravity: c.gravity,
                        feedback: c.choice.interaction === 'shake' ? ('shake' as const) : undefined,
                        pivotal: isNodePivotal,
                        enabled: c.enabled,
                        disabledReason: c.reason || null,
                        disabledReasonCode: c.reason_code || null,
                        disabledReasonDetails: c.reason_details || null,
                        requiredOrbFill: c.choice.requiredOrbFill,
                        next: String(originalIndex)
                      }
                    })
                    return presented
                  })()}
                  isProcessing={isProcessing}
                  orbFillLevels={orbFillLevels}
                  onChoice={(c) => {
                    const index = parseInt(c.next || '0', 10)
                    const original = availableChoices[index]
                    if (original) onChoice(original)
                  }}
                  compactMaxShown={(() => {
                    const nodeTags = currentNode?.tags || []
                    const isNodePivotal = nodeTags.some(tag =>
                      ['pivotal', 'defining_moment', 'final_choice', 'climax', 'revelation', 'introduction'].includes(tag)
                    )
                    if (isNodePivotal) return undefined
                    if (!isEnabled('CHOICE_COMPACT_MODE')) return undefined
                    return 4
                  })()}
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
