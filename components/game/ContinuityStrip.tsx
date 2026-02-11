'use client'

import { cn } from '@/lib/utils'
import type { GameState } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'
import { characterNames } from '@/lib/game-interface-types'
import { getTrustTrend } from '@/lib/trust-derivatives'

type ContinuityStripProps = {
  gameState: GameState | null
  characterId: CharacterId
  className?: string
}

function formatTimeAgoShort(nowMs: number, thenMs: number): string {
  const deltaMs = Math.max(0, nowMs - thenMs)
  const minutes = Math.floor(deltaMs / (1000 * 60))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 48) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function isLocationGraph(characterId: CharacterId): boolean {
  return characterId === 'station_entry' || characterId === 'grand_hall' || characterId === 'market' || characterId === 'deep_station'
}

export function ContinuityStrip({ gameState, characterId, className }: ContinuityStripProps) {
  if (!gameState) return null
  if (isLocationGraph(characterId)) return null

  const cs = gameState.characters.get(characterId)
  if (!cs) return null

  const now = Date.now()
  const checkInReady = gameState.pendingCheckIns.some((c) => c.characterId === characterId && c.sessionsRemaining <= 0)

  // “Met” can be represented either by explicit met_* flags or by any conversation history.
  const metFlag = `met_${characterId}`
  const isRemeet = gameState.globalFlags.has(metFlag) || cs.conversationHistory.length > 0

  // Keep this seam quiet: show nothing unless we have a strong continuity cue.
  // Priority order:
  // 1) Check-in ready (primary)
  // 2) Re-meet with recency/trend (primary)
  if (!checkInReady && !isRemeet) return null

  let primary: string | null = null
  let secondary: string | null = null

  if (checkInReady) {
    primary = `New message from ${characterNames[characterId]}`
    secondary = 'Check-in ready'
  } else if (isRemeet) {
    if (typeof cs.lastInteractionTimestamp === 'number') {
      primary = `Last spoke ${formatTimeAgoShort(now, cs.lastInteractionTimestamp)}`
    } else {
      primary = 'You have met before'
    }

    const timeline = cs.trustTimeline
    if (timeline) {
      const trend = getTrustTrend(timeline, 5)
      secondary = trend === 'improving' ? 'Trust: growing' : trend === 'declining' ? 'Trust: strained' : 'Trust: steady'
    }
  }

  if (!primary) return null

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 pb-2',
        className,
      )}
      data-testid="continuity-strip"
      data-character-id={characterId}
    >
      <div className="min-w-0 flex items-center gap-2">
        <div className="text-xs text-slate-200/90 truncate" data-testid="continuity-primary">
          {primary}
        </div>
        {secondary && (
          <div
            className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-200/80 whitespace-nowrap"
            data-testid="continuity-secondary"
          >
            {secondary}
          </div>
        )}
      </div>
    </div>
  )
}

