"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { springs, stagger } from '@/lib/animations'
import type { CharacterWithState } from '@/hooks/useConstellationData'
import { CHARACTER_CONNECTIONS, CHARACTER_COLORS } from '@/lib/constellation/character-positions'
import { ResizablePanel } from '@/components/ResizablePanel'

interface PeopleViewProps {
  characters: CharacterWithState[]
  onOpenDetail?: (character: CharacterWithState) => void
}

// Animation variants - all states must have consistent properties
const nodeVariants = {
  unmet: { scale: 0.85, opacity: 0.4 },
  met: { scale: 1, opacity: 0.7 },
  connected: { scale: 1, opacity: 0.9 },
  trusted: { scale: 1.05, opacity: 1 },
  selected: { scale: 1.15, opacity: 1 }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.fast,
      delayChildren: 0.1
    }
  }
}

const itemVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.snappy
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
      {/* SVG Constellation - extra padding top for mobile spacing */}
      <div className="flex-1 relative p-4 pt-6 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800/90 rounded-lg">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-[400px] mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          role="img"
          aria-label={`Character constellation showing ${characters.filter(c => c.hasMet).length} of ${characters.length} characters met`}
        >
          {/* Subtle starfield background */}
          <defs>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* 3D Orb gradients for each character color */}
            <radialGradient id="orb-amber" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#92400E" />
            </radialGradient>
            <radialGradient id="orb-blue" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="40%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </radialGradient>
            <radialGradient id="orb-emerald" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#D1FAE5" />
              <stop offset="40%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#064E3B" />
            </radialGradient>
            <radialGradient id="orb-purple" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#EDE9FE" />
              <stop offset="40%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#4C1D95" />
            </radialGradient>
            <radialGradient id="orb-rose" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFE4E6" />
              <stop offset="40%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
            <radialGradient id="orb-orange" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFEDD5" />
              <stop offset="40%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#7C2D12" />
            </radialGradient>
            <radialGradient id="orb-teal" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#CCFBF1" />
              <stop offset="40%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#134E4A" />
            </radialGradient>
            <radialGradient id="orb-indigo" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E0E7FF" />
              <stop offset="40%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#312E81" />
            </radialGradient>
            <radialGradient id="orb-slate" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="40%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </radialGradient>
            <radialGradient id="orb-cyan" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#CFFAFE" />
              <stop offset="40%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#164E63" />
            </radialGradient>
            <radialGradient id="orb-unmet" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#334155" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          {/* Background stars with twinkling */}
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={`star-${i}`}
              cx={10 + (i * 37) % 80}
              cy={5 + (i * 47) % 90}
              r={0.3 + (i % 3) * 0.2}
              fill="white"
              initial={{ opacity: 0.1 + (i % 5) * 0.05 }}
              animate={{
                opacity: [0.1 + (i % 5) * 0.05, 0.3 + (i % 3) * 0.1, 0.1 + (i % 5) * 0.05]
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
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
                stroke="rgba(251, 191, 36, 0.3)"
                strokeWidth="0.8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            )
          })}

          {/* Character nodes - only show met characters to reduce clutter */}
          {characters.filter(char => char.hasMet).map((char) => {
            const _colors = CHARACTER_COLORS[char.color]
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
                  r={11}
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

                {/* Main circle - 3D Orb (only met characters shown) */}
                <motion.circle
                  cx={char.position.x}
                  cy={char.position.y}
                  r={size}
                  fill={`url(#orb-${char.color})`}
                  style={{
                    filter: 'url(#glow)'
                  }}
                  variants={nodeVariants}
                  initial={char.trustState}
                  animate={isSelected ? 'selected' : char.trustState}
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

                {/* Initial/name text (only met characters shown) */}
                <text
                  x={char.position.x}
                  y={char.position.y + (char.isMajor ? 12 : 10)}
                  textAnchor="middle"
                  className="text-[3px] font-medium fill-slate-300"
                >
                  {char.name}
                </text>
              </motion.g>
            )
          })}
        </motion.svg>
      </div>

      {/* Selected character detail panel - compact */}
      {selectedCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex-shrink-0 bg-slate-800/80 border-t border-slate-700"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          <ResizablePanel
            customKey={selectedCharacter.id}
            transition="crossFade"
            innerClassName="p-3 pr-6"
          >
            {/* Compact header row */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
                  CHARACTER_COLORS[selectedCharacter.color].bg
                )}
              >
                {selectedCharacter.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{selectedCharacter.fullName}</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{selectedCharacter.role}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-mono text-amber-400">{selectedCharacter.trust}/10</span>
              </div>
            </div>

            {/* Trust bar - compact */}
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: selectedCharacter.trust / 10 }}
                transition={springs.smooth}
                style={{ originX: 0, width: '100%' }}
              />
            </div>

            {!selectedCharacter.hasMet ? (
              <p className="text-xs text-slate-500 italic">Not yet met</p>
            ) : onOpenDetail && (
              <button
                onClick={() => onOpenDetail(selectedCharacter)}
                className="w-full py-3 px-4 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 active:bg-amber-500/40 transition-colors min-h-[44px] touch-manipulation"
              >
                View Story →
              </button>
            )}
          </ResizablePanel>
        </motion.div>
      )}
    </div>
  )
}
