"use client"

import React, { useMemo } from 'react'
import { Bell, Users } from 'lucide-react'

import type { GameState } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'
import type { CharacterWaitingState } from '@/lib/character-waiting'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function prettyName(characterId: CharacterId): string {
  return characterId === 'station_entry'
    ? 'Sector 0'
    : characterId.charAt(0).toUpperCase() + characterId.slice(1)
}

type ReturnHookKind = 'messages' | 'waiting' | 'none'

function computeKind(gameState: GameState, waitingCharacters: CharacterWaitingState[]): ReturnHookKind {
  const hasMessages = gameState.pendingCheckIns.some((c) => c.sessionsRemaining <= 0)
  if (hasMessages) return 'messages'
  if (waitingCharacters.length > 0) return 'waiting'
  return 'none'
}

export interface ReturnHookPromptProps {
  gameState: GameState
  isReturningPlayer: boolean
  waitingCharacters: CharacterWaitingState[]
  onOpenJourney: () => void
  onVisitCharacter?: (characterId: CharacterId) => void
  onDismiss: () => void
  className?: string
}

export function ReturnHookPrompt({
  gameState,
  isReturningPlayer,
  waitingCharacters,
  onOpenJourney,
  onVisitCharacter,
  onDismiss,
  className,
}: ReturnHookPromptProps) {
  const kind = useMemo(() => computeKind(gameState, waitingCharacters), [gameState, waitingCharacters])
  const leadWaitingCharacter = waitingCharacters[0] ?? null

  const primaryCharacterId = useMemo(() => {
    if (kind === 'messages') {
      const ready = gameState.pendingCheckIns.find((c) => c.sessionsRemaining <= 0)
      return (ready?.characterId || null) as CharacterId | null
    }
    if (kind === 'waiting') {
      return (waitingCharacters[0]?.characterId || null) as CharacterId | null
    }
    return null
  }, [kind, gameState.pendingCheckIns, waitingCharacters])

  if (!isReturningPlayer) return null
  if (kind === 'none') return null

  const title = 'The station held your place'
  const primary = kind === 'messages'
    ? (primaryCharacterId
      ? `${prettyName(primaryCharacterId)} has something new to share.`
      : 'Something in the station shifted while you were gone.')
    : (
      leadWaitingCharacter?.waitingMessage
      || (primaryCharacterId
        ? `${prettyName(primaryCharacterId)} noticed your absence.`
        : 'Someone has been keeping your place in mind.')
    )

  const secondary = kind === 'messages'
    ? 'You can follow what changed when you are ready.'
    : (waitingCharacters.length > 1
      ? `${waitingCharacters.length - 1} more voices are holding their place.`
      : 'You can step back into the conversation when you are ready.')

  const icon = kind === 'messages'
    ? <Bell className="h-4 w-4 text-amber-300" />
    : <Users className="h-4 w-4 text-emerald-300" />

  return (
    <div
      data-testid="return-hook"
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{title}</div>
          <div className="mt-1 text-sm font-semibold text-white" data-testid="return-hook-primary">
            {primary}
          </div>
          <div className="mt-0.5 text-xs text-slate-400" data-testid="return-hook-secondary">
            {secondary}
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onOpenJourney}
              data-testid="return-hook-open-journey"
            >
              See what changed
            </Button>
            {primaryCharacterId && onVisitCharacter && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onVisitCharacter(primaryCharacterId)}
                data-testid="return-hook-visit-character"
              >
                Go to {prettyName(primaryCharacterId)}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="ml-auto text-slate-400 hover:text-slate-200"
              data-testid="return-hook-dismiss"
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
