'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BookOpen, Stars } from 'lucide-react'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { HeroBadge } from '@/components/HeroBadge'
import { UnifiedMenu } from '@/components/UnifiedMenu'
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator'
import { StationStatusBadge } from '@/components/StationStatusBadge'
import { characterNames } from '@/lib/game-interface-types'
import { useGameSelectors } from '@/lib/game-store'
import type { GameState } from '@/lib/character-state'
import type { DialogueNode } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'

interface GameHeaderProps {
  gameState: GameState | null
  currentCharacterId: CharacterId
  currentNode: DialogueNode | null
  hasCurrentCharacter: boolean
  hasNewOrbs: boolean
  hasNewTrust: boolean
  hasNewMeeting: boolean
  audio: {
    isMuted: boolean
    audioVolume: number
    toggleMute: () => void
    setVolume: (v: number) => void
  }
  onShowJournal: () => void
  onShowConstellation: () => void
  onShowReport: () => void
}

export function GameHeader({
  gameState,
  currentCharacterId,
  currentNode,
  hasCurrentCharacter,
  hasNewOrbs,
  hasNewTrust,
  hasNewMeeting,
  audio,
  onShowJournal,
  onShowConstellation,
  onShowReport,
}: GameHeaderProps) {
  // TD-001 Step 2: Read patterns directly from Zustand (single source of truth)
  // This removes dependency on gameState prop for patterns
  const corePatterns = useGameSelectors.useCorePatterns()
  const coreGameState = useGameSelectors.useCoreGameState()

  // Use Zustand patterns (preferred) or fallback to prop for backward compatibility
  const patterns = corePatterns
  const playerId = coreGameState?.playerId ?? gameState?.playerId

  return (
    <header
      className="relative flex-shrink-0 glass-panel border-b border-white/10 z-10"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Top Row-Title and Navigation */}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <Link href="/" className="text-sm font-semibold text-slate-100 hover:text-white transition-colors truncate min-w-0 flex flex-col">
            <span>Terminus</span>
            {/* Station Status-Always visible compact dashboard */}
            <StationStatusBadge gameState={gameState} />
          </Link>
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Hero Badge-Player Identity (TD-001: reads from Zustand now) */}
            {coreGameState && (
              <HeroBadge
                patterns={patterns}
                compact={true}
                className="mr-2 hidden sm:flex"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowJournal}
              className={cn(
                "relative h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-md",
                hasNewOrbs ? "text-amber-400 nav-attention-halo nav-attention-halo-amber" : ""
              )}
              title="The Prism"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowConstellation}
              className={cn(
                "relative h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-md",
                (hasNewTrust || hasNewMeeting) ? "text-purple-400 nav-attention-marquee nav-attention-halo nav-attention-halo-purple" : ""
              )}
              title="Your Journey"
            >
              <Stars className="h-4 w-4" />
            </Button>

            {/* Unified Settings Menu - Consolidates game settings, accessibility, and account */}
            <UnifiedMenu
              onShowReport={onShowReport}
              isMuted={audio.isMuted}
              onToggleMute={audio.toggleMute}
              volume={audio.audioVolume}
              onVolumeChange={audio.setVolume}
              playerId={playerId}
            />

            {/* Connection Status Indicator */}
            <SyncStatusIndicator />
          </div>
        </div>
        {/* Character Info Row-extra vertical padding for mobile touch */}
        {/* Only show if current node has a speaker (hide for atmospheric narration) */}
        {hasCurrentCharacter && currentNode?.speaker && (
          <div
            className="flex items-center justify-between py-3 sm:py-2"
            data-testid="character-header"
            data-character-id={currentCharacterId}
          >
            <div className="flex items-center gap-2 font-medium text-slate-200 text-sm sm:text-base">
              <CharacterAvatar
                characterName={characterNames[currentCharacterId]}
                size="sm"
              />
              <span data-testid="speaker-name" className="truncate max-w-[150px] sm:max-w-none">{characterNames[currentCharacterId]}</span>
            </div>
            <div className="flex flex-col items-end">
              {/* Trust Label hidden for immersion */}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
