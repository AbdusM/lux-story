import type { CharacterWithState } from '@/hooks/useConstellationData'
import { ConstellationGraph } from './ConstellationGraph'

interface PeopleViewProps {
  characters: CharacterWithState[]
  onOpenDetail?: (character: CharacterWithState) => void
}

export function PeopleView({ characters, onOpenDetail }: PeopleViewProps) {

  const handleOpenDetail = (char: CharacterWithState) => {
    onOpenDetail?.(char)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Dynamic Force Graph - extra padding top for mobile spacing */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800/90 rounded-lg overflow-hidden">
        <ConstellationGraph
          characters={characters}
          onOpenDetail={handleOpenDetail}
          width={400} // responsive wrapper handles actual size, this sets coordinate system
          height={400}
        />
      </div>
    </div>
  )
}
