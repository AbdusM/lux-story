"use client"

import React, { useMemo } from 'react'
import { Bell, Users } from 'lucide-react'

import type { GameState } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'
import type { CharacterWaitingState } from '@/lib/character-waiting'
import { characterNames } from '@/lib/game-interface-types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function firstName(characterId: CharacterId): string {
  const full = characterNames[characterId] || characterId
  const first = full.split(' ')[0]
  return first || full
}

type ReturnHookKind = 'messages' | 'waiting' | 'none'

function computeReturnHookKind(gameState: GameState, waitingCharacters: CharacterWaitingState[]): ReturnHookKind {
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
  const kind = useMemo(() => computeReturnHookKind(gameState, waitingCharacters), [gameState, waitingCharacters])

  const primaryCharacterId = useMemo(() => {
    if (kind === 'messages') {
      const ready = gameState.pendingCheckIns.find((c) => c.sessionsRemaining <= 0)
      return (ready?.characterId || null) as CharacterId | null
    }
    if (kind === 'waiting') {
      return (waitingCharacters[0]?.characterId || null) as CharacterId | null
    }
    return null
  }, [kind, gameState, waitingCharacters])

  if (!isReturningPlayer) return null
  if (kind === 'none') return null

  const title = 'While you were away'
  const primary = kind === 'messages'
    ? (primaryCharacterId ? `New message from ${firstName(primaryCharacterId)}.` : 'New messages are waiting.')
    : (primaryCharacterId ? `${firstName(primaryCharacterId)} has been waiting.` : 'Someone has been waiting.')

  const secondary = kind === 'messages'
    ? 'Check-ins are ready.'
    : (waitingCharacters.length > 1 ? `Plus ${waitingCharacters.length - 1} more.` : 'Return when you want.')

  const icon = kind === 'messages' ? <Bell className="h-4 w-4 text-amber-300" /> : <Users className="h-4 w-4 text-emerald-300" />

  return (
    <div
      data-testid="return-hook"
      className={cn(
        "mx-3 sm:mx-4 mt-3 rounded-xl border border-white/10 bg-black/20 backdrop-blur-md p-3",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-widest text-slate-400">{title}</div>
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
              Open Journey
            </Button>
            {primaryCharacterId && onVisitCharacter && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onVisitCharacter(primaryCharacterId)}
                data-testid="return-hook-visit-character"
              >
                Visit {firstName(primaryCharacterId)}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="ml-auto text-slate-400 hover:text-slate-200"
              data-testid="return-hook-dismiss"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

