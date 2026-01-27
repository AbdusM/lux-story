'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GameState } from '@/lib/character-state'
import { isJourneyComplete } from '@/lib/journey-narrative-generator'

interface EndingPanelProps {
  gameState: GameState | null
  onSeeJourney: () => void
  onExportProfile: () => void
  onContinueExploring: () => void
  onReturnToStation: () => void
}

export function EndingPanel({
  gameState,
  onSeeJourney,
  onExportProfile,
  onContinueExploring,
  onReturnToStation,
}: EndingPanelProps) {
  return (
    <Card className={cn(
      "mt-4 rounded-xl shadow-md",
      gameState && isJourneyComplete(gameState) ? "bg-gradient-to-b from-amber-50 to-white border-amber-200" : ""
    )}>
      <CardContent className="p-4 sm:p-6 text-center">
        {gameState && isJourneyComplete(gameState) ? (
          <>
            {/* Journey Complete-Full celebration */}
            <div className="mb-4">
              <Compass className="w-10 h-10 mx-auto text-amber-600 mb-2" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                The Station Knows You Now
              </h3>
              <p className="text-sm text-slate-600 italic mb-4">
                Your journey through Terminus is complete.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={onSeeJourney}
                className="w-full min-h-[48px] bg-amber-600 hover:bg-amber-700 text-white"
              >
                See Your Journey
              </Button>
              <Button
                variant="secondary"
                onClick={onExportProfile}
                className="w-full min-h-[48px] bg-slate-900 text-white hover:bg-slate-700 border border-slate-700"
              >
                Export Career Profile
              </Button>
              <Button
                variant="outline"
                onClick={onContinueExploring}
                className="w-full min-h-[48px] active:scale-[0.98] transition-transform"
              >
                Continue Exploring
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Conversation Complete-but journey continues */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
              Conversation Complete
            </h3>
            <Button
              variant="outline"
              onClick={onReturnToStation}
              className="w-full min-h-[48px] active:scale-[0.98] transition-transform"
            >
              Return to Station
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
