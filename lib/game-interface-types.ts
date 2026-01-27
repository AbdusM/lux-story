/**
 * Types and constants for StatefulGameInterface
 *
 * Extracted from SGI to reduce file size and enable reuse across hooks.
 */

import type { GameState } from '@/lib/character-state'
import type { DialogueGraph, DialogueNode, DialogueContent, EvaluatedChoice, InterruptWindow } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import type { JourneyNarrative } from '@/lib/journey-narrative-generator'
import type { MetaAchievement } from '@/lib/meta-achievements'
import type { AmbientEvent } from '@/lib/ambient-events'
import type { PatternType } from '@/lib/patterns'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import type { SessionAnnouncement } from '@/lib/session-structure'
import type { PatternVoiceResult, VoiceConflictResult } from '@/lib/pattern-voices'
import type { ActiveComboState } from '@/lib/interrupt-derivatives'
import type { CharacterWaitingState } from '@/lib/character-waiting'
import type { DelayedGift } from '@/lib/delayed-gifts'
import type { ActiveExperienceState } from '@/lib/experience-engine'
import type { ExperienceSummaryData } from '@/components/ExperienceSummary'

export interface GameInterfaceState {
  gameState: GameState | null
  currentNode: DialogueNode | null
  currentGraph: DialogueGraph
  currentCharacterId: CharacterId
  availableChoices: EvaluatedChoice[]
  currentContent: string
  currentDialogueContent: DialogueContent | null
  useChatPacing: boolean
  isLoading: boolean
  hasStarted: boolean
  selectedChoice: string | null
  showSaveConfirmation: boolean
  skillToast: { skill: string; message: string } | null
  consequenceFeedback: { message: string } | null
  error: { title: string; message: string; severity: 'error' | 'warning' | 'info' } | null
  previousSpeaker: string | null
  recentSkills: string[]
  showExperienceSummary: boolean
  experienceSummaryData: ExperienceSummaryData | null
  showJournal: boolean
  showConstellation: boolean
  pendingFloatingModule: null
  showJourneySummary: boolean
  showReport: boolean
  journeyNarrative: JourneyNarrative | null
  achievementNotification: MetaAchievement | null
  ambientEvent: AmbientEvent | null
  patternSensation: string | null
  consequenceEcho: ConsequenceEcho | null
  sessionBoundary: SessionAnnouncement | null
  previousTotalNodes: number
  showIdentityCeremony: boolean
  ceremonyPattern: PatternType | null
  showPatternEnding: boolean
  endingPattern: PatternType | null
  hasNewTrust: boolean
  hasNewMeeting: boolean
  isProcessing: boolean
  activeInterrupt: InterruptWindow | null
  patternVoice: PatternVoiceResult | null
  voiceConflict: VoiceConflictResult | null
  activeComboChain: ActiveComboState | null
  waitingCharacters: CharacterWaitingState[]
  pendingGift: DelayedGift | null
  isReturningPlayer: boolean
  activeExperience: ActiveExperienceState | null
}

export const characterNames: Record<CharacterId, string> = {
  samuel: 'Samuel Washington',
  maya: 'Maya Chen',
  devon: 'Devon Solis',
  jordan: 'Jordan Kyles',
  marcus: 'Marcus Vance',
  tess: 'Tess O\'Malley',
  yaquin: 'Dr. Yaquin',
  kai: 'Kai',
  alex: 'Alex',
  rohan: 'Rohan',
  silas: 'Silas',
  elena: 'Elena',
  grace: 'Grace',
  asha: 'Asha Patel',
  lira: 'Lira Vance',
  zara: 'Zara El-Amin',
  quinn: 'Quinn Almeida',
  dante: 'Dante Moreau',
  nadia: 'Nadia Petrova',
  isaiah: 'Isaiah Greene',
  station_entry: 'Sector 0',
  grand_hall: 'Sector 1: The Grand Hall',
  market: 'Sector 2: The Asset Exchange',
  deep_station: 'Sector 3: The Core'
}
