import type { CharacterWithState } from '@/hooks/useConstellationData'
import { ConstellationGraph } from './ConstellationGraph'

interface PeopleViewProps {
  characters: CharacterWithState[]
  onOpenDetail?: (character: CharacterWithState) => void
  onTravel?: (characterId: string) => void
}

export function PeopleView({ characters, onOpenDetail, onTravel }: PeopleViewProps) {

  const handleOpenDetail = (char: CharacterWithState) => {
    onOpenDetail?.(char)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Dynamic Force Graph - extra padding top for mobile spacing */}
      <div className="flex-1 relative rounded-lg overflow-hidden bg-slate-900">
        <ConstellationGraph
          characters={characters}
          onOpenDetail={handleOpenDetail}
          onTravel={onTravel}
          width={400} // responsive wrapper handles actual size, this sets coordinate system
          height={400}
        />
      </div>
    </div>
  )
}
