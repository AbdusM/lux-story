"use client"

import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs, STAGGER_DELAY } from '@/lib/animations'
import { CROSS_CHARACTER_ECHOES } from '@/lib/cross-character-echoes'

interface EchoLogProps {
  completedArcs: Set<string>
  className?: string
}

interface DisplayEcho {
  sourceCharacter: string
  targetCharacter: string
  text: string
  sourceFlag: string
}

/**
 * EchoLog - Shows how the player's choices have rippled through relationships
 *
 * ISP Invisible Depth: Player sees impact of their choices reflected
 * in how characters talk about each other.
 */
export function EchoLog({ completedArcs, className }: EchoLogProps) {
  // Filter echoes to only show ones where source flag is in completed arcs
  const displayEchoes: DisplayEcho[] = CROSS_CHARACTER_ECHOES
    .filter(echo => completedArcs.has(echo.sourceFlag))
    .map(echo => ({
      sourceCharacter: echo.sourceCharacter,
      targetCharacter: echo.targetCharacter,
      text: echo.echo.text,
      sourceFlag: echo.sourceFlag
    }))

  // Group by source character
  const groupedBySource = displayEchoes.reduce((acc, echo) => {
    if (!acc[echo.sourceCharacter]) {
      acc[echo.sourceCharacter] = []
    }
    acc[echo.sourceCharacter].push(echo)
    return acc
  }, {} as Record<string, DisplayEcho[]>)

  if (displayEchoes.length === 0) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-400">
          Complete character arcs to see how your choices ripple through the station.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4 p-4", className)}>
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
        <MessageCircle className="w-4 h-4" />
        <span>How your choices have echoed</span>
      </div>

      {Object.entries(groupedBySource).map(([source, echoes], groupIdx) => (
        <motion.div
          key={source}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIdx * STAGGER_DELAY.normal, ...springs.gentle }}
          className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-amber-400 capitalize">
              {source}{"'"}s story
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-400">
              Echoed to {echoes.length} character{echoes.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-2">
            {echoes.map((echo, idx) => (
              <div key={`${echo.targetCharacter}-${idx}`} className="pl-3 border-l border-slate-600">
                <p className="text-xs text-slate-500 mb-1 capitalize">
                  {echo.targetCharacter} said:
                </p>
                <p className="text-sm text-slate-300 italic">
                  "{echo.text}"
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
