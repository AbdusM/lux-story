"use client"

import React, { useMemo } from 'react'

import type { GameState } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'
import { cn } from '@/lib/utils'

function toHoursSince(ms: number): string {
  const hrs = Math.max(0, Math.round(ms / (1000 * 60 * 60)))
  if (hrs === 0) return 'just now'
  if (hrs === 1) return '1h ago'
  return `${hrs}h ago`
}

function prettyName(characterId: CharacterId): string {
  // Lightweight: keep consistent with IDs without importing large UI maps.
  // (If we want full names later, pass them in.)
  return characterId === 'station_entry'
    ? 'Sector 0'
    : characterId.charAt(0).toUpperCase() + characterId.slice(1)
}

export interface ContinuityStripProps {
  gameState: GameState
  characterId: CharacterId
  className?: string
}

/**
 * Quiet continuity seam:
 * - Shows only when useful: check-in ready OR re-meet with recency signal.
 * - Does not attempt to narrate outcomes; it just orients the player.
 */
export function ContinuityStrip({ gameState, characterId, className }: ContinuityStripProps) {
  const checkInReady = useMemo(() => {
    return gameState.pendingCheckIns.some((c) => c.characterId === characterId && c.sessionsRemaining <= 0)
  }, [gameState.pendingCheckIns, characterId])

  const isRemeet = useMemo(() => {
    const cs = gameState.characters.get(characterId)
    if (!cs) return false
    return (cs.conversationHistory?.length || 0) > 0
  }, [gameState.characters, characterId])

  const lastSpoke = useMemo(() => {
    const cs = gameState.characters.get(characterId)
    const ts = cs?.lastInteractionTimestamp
    if (typeof ts !== 'number') return null
    return toHoursSince(Date.now() - ts)
  }, [gameState.characters, characterId])

  if (!checkInReady && !isRemeet) return null

  const name = prettyName(characterId)

  const primary = checkInReady
    ? `New message from ${name}.`
    : (lastSpoke ? `Last spoke ${lastSpoke}.` : `Back with ${name}.`)

  const secondary = checkInReady
    ? 'Check-in ready'
    : 'Re-meet'

  return (
    <div
      data-testid="continuity-strip"
      className={cn(
        "mt-2 rounded-xl border border-white/10 bg-black/20 backdrop-blur-md px-3 py-2",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 text-xs text-slate-200" data-testid="continuity-primary">
          {primary}
        </div>
        <div className="flex-shrink-0 text-[10px] uppercase tracking-widest text-slate-400" data-testid="continuity-secondary">
          {secondary}
        </div>
      </div>
    </div>
  )
}

