"use client"

import { useState } from 'react'
import type { CharacterWithState } from '@/hooks/useConstellationData'
import { ConstellationGraph } from './ConstellationGraph'
import { CharacterListView } from './CharacterListView'
import { Network, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hapticFeedback } from '@/lib/haptic-feedback'

interface PeopleViewProps {
  characters: CharacterWithState[]
  onOpenDetail?: (character: CharacterWithState) => void
  onTravel?: (characterId: string) => void
}

type ViewMode = 'graph' | 'list'

export function PeopleView({ characters, onOpenDetail, onTravel }: PeopleViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('graph')

  const handleOpenDetail = (char: CharacterWithState) => {
    onOpenDetail?.(char)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    hapticFeedback.light()
    setViewMode(mode)
  }

  return (
    <div className="h-full flex flex-col">
      {/* View mode toggle */}
      <div className="flex-shrink-0 flex items-center justify-end px-3 py-2 border-b border-slate-800/50">
        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
          <button
            onClick={() => handleViewModeChange('graph')}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors",
              viewMode === 'graph'
                ? "bg-amber-500/20 text-amber-400"
                : "text-slate-500 hover:text-slate-300"
            )}
            aria-pressed={viewMode === 'graph'}
            title="Constellation view"
          >
            <Network className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Graph</span>
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors",
              viewMode === 'list'
                ? "bg-amber-500/20 text-amber-400"
                : "text-slate-500 hover:text-slate-300"
            )}
            aria-pressed={viewMode === 'list'}
            title="List view (accessible)"
          >
            <List className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">List</span>
          </button>
        </div>
      </div>

      {/* View content */}
      <div className="flex-1 relative rounded-lg overflow-hidden bg-slate-900">
        {viewMode === 'graph' ? (
          <ConstellationGraph
            characters={characters}
            onOpenDetail={handleOpenDetail}
            onTravel={onTravel}
            width={400}
            height={400}
          />
        ) : (
          <CharacterListView
            characters={characters}
            onOpenDetail={handleOpenDetail}
            onTravel={onTravel}
          />
        )}
      </div>
    </div>
  )
}
