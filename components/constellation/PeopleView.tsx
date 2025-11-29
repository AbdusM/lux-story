"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CharacterWithState } from '@/hooks/useConstellationData'
import { CHARACTER_CONNECTIONS, CHARACTER_COLORS } from '@/lib/constellation/character-positions'

interface PeopleViewProps {
  characters: CharacterWithState[]
  onOpenDetail?: (character: CharacterWithState) => void
}

// Animation variants
const nodeVariants = {
  unmet: { scale: 0.85, opacity: 0.4 },
  met: { scale: 1, opacity: 0.7 },
  connected: { scale: 1, opacity: 0.9 },
  trusted: { scale: 1.05, opacity: 1 },
  selected: { scale: 1.15 }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const itemVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
}

export function PeopleView({ characters, onOpenDetail }: PeopleViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedCharacter = characters.find(c => c.id === selectedId)

  // Get character by ID for connection lines
  const getCharPos = (id: string) => characters.find(c => c.id === id)?.position

  // Filter connections to only show met characters
  const metCharacterIds = new Set(characters.filter(c => c.hasMet).map(c => c.id))
  const visibleConnections = CHARACTER_CONNECTIONS.filter(
    ([from, to]) => metCharacterIds.has(from) && metCharacterIds.has(to)
  )

  return (
    <div className="h-full flex flex-col">
      {/* SVG Constellation */}
      <div className="flex-1 relative p-4">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-[400px] mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          role="img"
          aria-label={`Character constellation showing ${characters.filter(c => c.hasMet).length} of ${characters.length} characters met`}
        >
          {/* Connection lines (behind nodes) */}
          {visibleConnections.map(([from, to]) => {
            const fromPos = getCharPos(from)
            const toPos = getCharPos(to)
            if (!fromPos || !toPos) return null

            return (
              <motion.line
                key={`${from}-${to}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="rgba(148, 163, 184, 0.3)"
                strokeWidth="0.3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            )
          })}

          {/* Character nodes */}
          {characters.map((char) => {
            const colors = CHARACTER_COLORS[char.color]
            const isSelected = selectedId === char.id
            const size = char.isMajor ? 7 : 5

            return (
              <motion.g
                key={char.id}
                variants={itemVariants}
                animate={isSelected ? 'selected' : char.trustState}
                className="cursor-pointer"
                onClick={() => setSelectedId(isSelected ? null : char.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                role="button"
                aria-label={`${char.fullName}, ${char.role}. ${char.hasMet ? `Trust level ${char.trust} of 10, ${char.trustState}` : 'Not yet met'}. ${isSelected ? 'Selected' : 'Tap to select'}`}
                aria-pressed={isSelected}
              >
                {/* Invisible hit area (44px equivalent in viewbox units) */}
                <circle
                  cx={char.position.x}
                  cy={char.position.y}
                  r={8}
                  fill="transparent"
                  className="touch-manipulation"
                />

                {/* Outer glow ring for connected/trusted */}
                {(char.trustState === 'connected' || char.trustState === 'trusted') && (
                  <motion.circle
                    cx={char.position.x}
                    cy={char.position.y}
                    r={size + 2}
                    fill="none"
                    stroke={char.trustState === 'trusted' ? '#FBBF24' : 'rgba(148, 163, 184, 0.5)'}
                    strokeWidth="0.5"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}

                {/* Main circle */}
                <motion.circle
                  cx={char.position.x}
                  cy={char.position.y}
                  r={size}
                  className={cn(
                    char.hasMet ? colors.bg : 'fill-slate-700',
                    'transition-colors duration-300'
                  )}
                  style={{
                    filter: char.hasMet ? 'none' : 'grayscale(100%)'
                  }}
                  variants={nodeVariants}
                />

                {/* Selection ring */}
                {isSelected && (
                  <motion.circle
                    cx={char.position.x}
                    cy={char.position.y}
                    r={size + 1.5}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="0.8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  />
                )}

                {/* Initial/name text */}
                <text
                  x={char.position.x}
                  y={char.position.y + (char.isMajor ? 12 : 10)}
                  textAnchor="middle"
                  className={cn(
                    "text-[3px] font-medium",
                    char.hasMet ? "fill-slate-300" : "fill-slate-600"
                  )}
                >
                  {char.name}
                </text>
              </motion.g>
            )
          })}
        </motion.svg>
      </div>

      {/* Selected character detail panel */}
      {selectedCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex-shrink-0 p-4 bg-slate-800/80 border-t border-slate-700"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                CHARACTER_COLORS[selectedCharacter.color].bg
              )}
            >
              {selectedCharacter.name[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{selectedCharacter.fullName}</h3>
              <p className="text-sm text-slate-400">{selectedCharacter.role}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-mono text-amber-400">
                Trust: {selectedCharacter.trust}/10
              </div>
              <div className="text-xs text-slate-500 capitalize">
                {selectedCharacter.trustState}
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${selectedCharacter.trust * 10}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {!selectedCharacter.hasMet ? (
            <p className="text-sm text-slate-500 mt-3 text-center italic">
              You haven't met {selectedCharacter.name} yet
            </p>
          ) : onOpenDetail && (
            <button
              onClick={() => onOpenDetail(selectedCharacter)}
              className="mt-3 w-full py-2.5 px-4 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors min-h-[44px]"
            >
              View {selectedCharacter.name}'s Story
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
