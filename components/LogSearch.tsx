'use client'

/**
 * LogSearch - Searchable conversation history
 *
 * Allows players to search through past dialogues with characters.
 * "What did Marcus say about..."
 *
 * ISP Principle: Player agency through discovery without interruption.
 */

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Search, X, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameSelectors } from '@/lib/game-store'
import { DIALOGUE_GRAPHS, CharacterId } from '@/lib/graph-registry'
import type { DialogueNode } from '@/lib/dialogue-graph'

interface LogSearchProps {
  className?: string
}

interface SearchResult {
  nodeId: string
  characterId: CharacterId
  speaker: string
  text: string
  matchStart: number
  matchEnd: number
}

// Character display names
const CHARACTER_NAMES: Record<CharacterId, string> = {
  samuel: 'Samuel Washington',
  maya: 'Maya Chen',
  devon: 'Devon Brooks',
  jordan: 'Jordan Pierce',
  marcus: 'Marcus Johnson',
  tess: 'Tess Rivera',
  yaquin: 'Yaquin Valdez',
  kai: 'Kai Tanaka',
  alex: 'Alex Morgan',
  rohan: 'Rohan Mehta',
  silas: 'Silas Webb',
  elena: 'Elena Vasquez',
  grace: 'Grace Kim',
  asha: 'Asha Okonkwo',
  lira: 'Lira Santos',
  zara: 'Zara Oduya',
  station_entry: 'Station Entry',
  grand_hall: 'Grand Hall',
  market: 'Market',
  deep_station: 'Deep Station'
}

// Get text from DialogueContent (handles arrays and variations)
function getNodeText(node: DialogueNode): string {
  if (!node.content || node.content.length === 0) return ''
  // Use first variation for search
  const firstContent = node.content[0]
  return firstContent.text || ''
}

export function LogSearch({ className = '' }: LogSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const coreGameState = useGameSelectors.useCoreGameState()

  // Build index of all visited dialogue nodes
  const visitedNodes = useMemo(() => {
    if (!coreGameState?.characters) return []

    const nodes: Array<{
      nodeId: string
      characterId: CharacterId
      node: DialogueNode
    }> = []

    // Iterate through all characters
    for (const [charIdStr, charState] of Object.entries(coreGameState.characters)) {
      const charId = charIdStr as CharacterId
      if (!charState?.conversationHistory) continue

      // Get all nodes this player has visited with this character
      for (const nodeId of charState.conversationHistory) {
        // Search all graphs for this node
        for (const graphKey of Object.keys(DIALOGUE_GRAPHS)) {
          const graph = DIALOGUE_GRAPHS[graphKey as keyof typeof DIALOGUE_GRAPHS]
          const node = graph?.nodes?.get(nodeId)
          if (node) {
            nodes.push({ nodeId, characterId: charId, node })
            break // Found it, no need to check other graphs
          }
        }
      }
    }

    return nodes
  }, [coreGameState?.characters])

  // Search through visited nodes
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    for (const { nodeId, characterId, node } of visitedNodes) {
      const text = getNodeText(node)
      const lowerText = text.toLowerCase()
      const matchIndex = lowerText.indexOf(query)

      if (matchIndex !== -1) {
        results.push({
          nodeId,
          characterId,
          speaker: node.speaker || CHARACTER_NAMES[characterId] || characterId,
          text,
          matchStart: matchIndex,
          matchEnd: matchIndex + query.length
        })
      }
    }

    // Limit to 20 results
    return results.slice(0, 20)
  }, [searchQuery, visitedNodes])

  const handleClear = useCallback(() => {
    setSearchQuery('')
  }, [])

  const hasVisitedContent = visitedNodes.length > 0

  if (!hasVisitedContent) {
    return null // Don't show search if no conversations yet
  }

  return (
    <div className={cn('relative', className)}>
      {/* Search Toggle / Input */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/30 border-b border-white/5">
        <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (!isExpanded && e.target.value) setIsExpanded(true)
          }}
          onFocus={() => setIsExpanded(true)}
          placeholder="Search conversations..."
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Results Panel */}
      <AnimatePresence>
        {isExpanded && searchQuery.length >= 2 && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto bg-slate-900/50">
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-slate-500 text-sm">
                  No matches found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {searchResults.map((result, idx) => (
                    <SearchResultItem key={`${result.nodeId}-${idx}`} result={result} />
                  ))}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
            >
              Close search
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SearchResultItem({ result }: { result: SearchResult }) {
  // Highlight the matched portion
  const { text, matchStart, matchEnd, speaker } = result

  // Get context around the match (50 chars before and after)
  const contextStart = Math.max(0, matchStart - 50)
  const contextEnd = Math.min(text.length, matchEnd + 50)

  const prefix = contextStart > 0 ? '...' : ''
  const suffix = contextEnd < text.length ? '...' : ''

  const beforeMatch = text.slice(contextStart, matchStart)
  const matchedText = text.slice(matchStart, matchEnd)
  const afterMatch = text.slice(matchEnd, contextEnd)

  return (
    <div className="px-4 py-3 hover:bg-white/5 transition-colors">
      {/* Speaker */}
      <div className="flex items-center gap-2 mb-1">
        <User className="w-3 h-3 text-amber-500" />
        <span className="text-xs font-medium text-amber-400">{speaker}</span>
      </div>

      {/* Text with highlighted match */}
      <p className="text-sm text-slate-300 leading-relaxed">
        {prefix}
        <span className="text-slate-400">{beforeMatch}</span>
        <mark className="bg-amber-500/30 text-amber-200 px-0.5 rounded">{matchedText}</mark>
        <span className="text-slate-400">{afterMatch}</span>
        {suffix}
      </p>
    </div>
  )
}
