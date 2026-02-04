/**
 * UI Patch Builder
 *
 * Phase 4B: Extracts the big setState block into a pure function.
 * This creates a structural seam for future UI coordinator migration.
 *
 * Contract:
 * - NO setState calls (returns patch object)
 * - NO side effects
 * - Caller applies patch to setState
 */

import type { DialogueGraph, DialogueNode, DialogueContent, EvaluatedChoice, InterruptWindow } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import type { JourneyNarrative } from '@/lib/journey-narrative-generator'
import type { MetaAchievement } from '@/lib/meta-achievements'
import type { PatternType } from '@/lib/patterns'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import type { SessionAnnouncement } from '@/lib/session-structure'
import type { PatternVoiceResult, VoiceConflictResult } from '@/lib/pattern-voices'
import type { ActiveComboState } from '@/lib/interrupt-derivatives'
import type { CharacterWaitingState } from '@/lib/character-waiting'
import type { DelayedGift } from '@/lib/delayed-gifts'
import type { ActiveExperienceState } from '@/lib/experience-engine'
import type { ExperienceSummaryData } from '@/components/ExperienceSummary'
import type { GameInterfaceState } from '@/lib/game-interface-types'

/**
 * Input context for building the UI patch
 */
export interface UiPatchContext {
  // Navigation
  nextNode: DialogueNode
  targetGraph: DialogueGraph
  targetCharacterId: CharacterId

  // Content
  newChoices: EvaluatedChoice[]
  reflectedText: string
  reflectedEmotion: string
  dialogueContent: DialogueContent
  useChatPacing: boolean

  // Feedback
  consequenceFeedback: { message: string } | null
  consequenceEcho: ConsequenceEcho | null
  patternSensation: string | null
  patternShiftMsg: string | null

  // Session
  sessionBoundary: SessionAnnouncement | null
  previousTotalNodes: number

  // Identity
  identityCeremonyPattern: PatternType | null
  isJourneyCompleteNode: boolean
  dominantPattern: PatternType | null

  // Trust tracking
  trustDelta: number

  // Skills
  skillsToKeep: string[]

  // Pattern voice
  patternVoice: PatternVoiceResult | null
  voiceConflict: VoiceConflictResult | null

  // Interrupts
  activeInterrupt: InterruptWindow | null

  // Achievements
  achievementNotification: MetaAchievement | null

  // Gifts
  pendingGift: DelayedGift | null

  // First meeting (for Constellation nudge)
  isFirstMeeting: boolean

  // Previous state (for preserved fields)
  previousState: Pick<GameInterfaceState,
    | 'currentNode'
    | 'showJournal'
    | 'showConstellation'
    | 'showJourneySummary'
    | 'journeyNarrative'
    | 'hasNewTrust'
    | 'hasNewMeeting'
    | 'showReport'
    | 'activeComboChain'
    | 'waitingCharacters'
    | 'isReturningPlayer'
    | 'activeExperience'
  >
}

/**
 * The UI patch that will be applied to setState.
 * This is the full GameInterfaceState replacement.
 */
export type ChoiceUiPatch = Omit<GameInterfaceState, never>

/**
 * Build the UI state patch for a completed choice.
 * This consolidates all 35+ fields into a single pure function.
 *
 * Future: This can be split into smaller patches (navigation, feedback, etc.)
 * and applied via a coordinator pattern.
 */
export function buildChoiceUiPatch(ctx: UiPatchContext): ChoiceUiPatch {
  return {
    // Navigation state
    currentNode: ctx.nextNode,
    currentGraph: ctx.targetGraph,
    currentCharacterId: ctx.targetCharacterId,
    availableChoices: ctx.newChoices,

    // Content state
    currentContent: ctx.reflectedText,
    currentDialogueContent: {
      ...ctx.dialogueContent,
      text: ctx.reflectedText,
      emotion: ctx.reflectedEmotion
    },
    useChatPacing: ctx.useChatPacing,

    // Loading state
    isLoading: false,
    hasStarted: true,
    isProcessing: false,

    // Selection state
    selectedChoice: null,

    // Feedback state (disabled features)
    showSaveConfirmation: false,
    skillToast: null,

    // Feedback state (active)
    consequenceFeedback: ctx.consequenceFeedback,
    consequenceEcho: ctx.consequenceEcho,
    patternSensation: ctx.patternShiftMsg || ctx.patternSensation,

    // Error state
    error: null,

    // Speaker tracking
    previousSpeaker: ctx.previousState.currentNode?.speaker || null,

    // Skills
    recentSkills: ctx.skillsToKeep,

    // Experience summary (disabled)
    showExperienceSummary: false,
    experienceSummaryData: null as ExperienceSummaryData | null,
    activeExperience: ctx.previousState.activeExperience,

    // Panel state (preserved)
    showJournal: ctx.previousState.showJournal,
    showConstellation: ctx.previousState.showConstellation,
    showJourneySummary: ctx.previousState.showJourneySummary,
    showReport: ctx.previousState.showReport,
    pendingFloatingModule: null,

    // Journey state (preserved)
    journeyNarrative: ctx.previousState.journeyNarrative,

    // Session boundary
    sessionBoundary: ctx.sessionBoundary,
    previousTotalNodes: ctx.previousTotalNodes,

    // Identity ceremony
    showIdentityCeremony: ctx.identityCeremonyPattern !== null,
    ceremonyPattern: ctx.identityCeremonyPattern,

    // Pattern ending
    showPatternEnding: ctx.isJourneyCompleteNode,
    endingPattern: ctx.dominantPattern,

    // Constellation attention state
    hasNewTrust: ctx.trustDelta !== 0 ? true : ctx.previousState.hasNewTrust,
    hasNewMeeting: ctx.isFirstMeeting ? true : ctx.previousState.hasNewMeeting,

    // Interrupts
    activeInterrupt: ctx.activeInterrupt,

    // Achievements
    achievementNotification: ctx.achievementNotification,

    // Ambient (cleared on player action)
    ambientEvent: null,

    // Pattern voice
    patternVoice: ctx.patternVoice,
    voiceConflict: ctx.voiceConflict,

    // Combo chain (preserved)
    activeComboChain: ctx.previousState.activeComboChain,

    // Engagement loop state (preserved)
    waitingCharacters: ctx.previousState.waitingCharacters,
    pendingGift: ctx.pendingGift,
    isReturningPlayer: ctx.previousState.isReturningPlayer,
  }
}
