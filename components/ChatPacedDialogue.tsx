'use client'

/**
 * ChatPacedDialogue - Thinking indicator for dialogue transitions
 *
 * Shows a brief "Character is thinking..." indicator before new dialogue appears.
 * This creates the iMessage-style "someone is typing" feel that makes
 * conversations feel alive, without the complexity of the old sequential
 * reveal system that caused blank screen bugs.
 *
 * KEY DESIGN DECISIONS (learning from the disabled version):
 * 1. Always render children immediately after thinking completes (no blank screen risk)
 * 2. Single useState for phase (not multiple states that can drift)
 * 3. Controlled by parent via key prop changes (remount = new thinking indicator)
 * 4. Respects prefers-reduced-motion
 *
 * Usage:
 *   <ChatPacedDialogue characterName="Maya" emotion="thoughtful" nodeId={currentNode.nodeId}>
 *     <DialogueDisplay ... />
 *   </ChatPacedDialogue>
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const CHARACTER_MENTAL_STATES: Record<string, string[]> = {
  Maya: ['thinking', 'processing', 'working through something'],
  Devon: ['analyzing', 'computing', 'processing methodically'],
  Marcus: ['considering carefully', 'reflecting', 'thinking it through'],
  Jordan: ['reflecting', 'considering', 'pondering'],
  Rohan: ['contemplating', 'processing deeply', 'weighing options'],
  Samuel: ['remembering', 'considering', 'reflecting'],
  Kai: ['assessing', 'evaluating', 'running scenarios'],
  Tess: ['thinking', 'considering', 'formulating'],
  default: ['thinking', 'considering', 'reflecting'],
}

const EMOTION_STATES: Record<string, string> = {
  anxious: 'considering cautiously',
  vulnerable: 'reflecting thoughtfully',
  excited: 'thinking excitedly',
  conflicted: 'wrestling with something',
  clinical: 'analyzing carefully',
  inspired: 'forming an idea',
}

function getThinkingText(characterName?: string, emotion?: string): string {
  if (emotion && EMOTION_STATES[emotion]) {
    return `${characterName || 'They'} ${EMOTION_STATES[emotion]}...`
  }

  const states = CHARACTER_MENTAL_STATES[characterName || 'default'] || CHARACTER_MENTAL_STATES.default
  const state = states[Math.floor(Math.random() * states.length)]
  return `${characterName || 'They'} ${state}...`
}

interface ChatPacedDialogueProps {
  characterName?: string
  emotion?: string
  /** Change this to trigger a new thinking indicator */
  nodeId: string
  /** Duration of thinking indicator in ms (default: 800) */
  thinkingDuration?: number
  children: React.ReactNode
  /** Disable the thinking indicator entirely */
  disabled?: boolean
}

export function ChatPacedDialogue({
  characterName,
  emotion,
  nodeId,
  thinkingDuration = 800,
  children,
  disabled = false,
}: ChatPacedDialogueProps) {
  const prefersReducedMotion = useReducedMotion()
  // 'thinking' | 'revealed'
  const [phase, setPhase] = useState<'thinking' | 'revealed'>('thinking')
  const prevNodeRef = useRef(nodeId)

  // When nodeId changes, show thinking indicator briefly
  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      setPhase('revealed')
      return
    }

    // Only show thinking on node changes (not initial mount with same node)
    if (nodeId !== prevNodeRef.current) {
      setPhase('thinking')
      prevNodeRef.current = nodeId

      const timer = setTimeout(() => {
        setPhase('revealed')
      }, thinkingDuration)

      return () => clearTimeout(timer)
    } else {
      // Initial mount — show content immediately
      setPhase('revealed')
    }
  }, [nodeId, thinkingDuration, disabled, prefersReducedMotion])

  if (disabled || prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait">
      {phase === 'thinking' ? (
        <motion.div
          key="thinking"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2 py-4 px-2"
        >
          <span className="text-sm text-slate-400 italic">
            {getThinkingText(characterName, emotion)}
          </span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-slate-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </span>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
