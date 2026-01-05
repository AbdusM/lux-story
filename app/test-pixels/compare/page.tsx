'use client'

import { useMemo } from 'react'

// All historical versions of sprites for comparison

// v5-v6: Full body with clothing, complex palettes
const V6_PALETTES = {
  fox: {
    '.': 'transparent',
    'B': '#1A1A1A',  // Black (outline, nose)
    'O': '#E86A17',  // Orange (main fur)
    'o': '#B85510',  // Dark orange (shadow)
    'W': '#F0F0F0',  // White (muzzle, sclera)
    'E': '#F0F0F0',  // Eye white (sclera)
    'P': '#1A1A1A',  // Pupil
    'G': '#4C9F70',  // Green (shirt)
    'g': '#3D8259',  // Dark green
    'T': '#2D3047',  // Tie
  },
  owl: {
    '.': 'transparent',
    'B': '#1A1A1A',  // Black (ear tufts)
    'F': '#6B5344',  // Brown (feathers)
    'f': '#4A3A2F',  // Dark brown
    'L': '#E8DCC8',  // Light tan (face disk)
    'E': '#F0F0F0',  // Eye white
    'P': '#1A1A1A',  // Pupil
    'Y': '#FFD700',  // Yellow (beak)
    'S': '#3B8EA5',  // Blue (suit)
    's': '#2D7086',  // Dark blue
    'R': '#D1495B',  // Red (bowtie)
  }
}

const V6_SPRITES = {
  fox: [
    "..BO....OB......",
    "..OOO..OOO......",
    "..oOOOOOOo......",
    "..OOOOOOOO......",
    "..oPEOOEPo......",
    "..oEEOOEEo......",
    "...oWWWWo.......",
    "....WBBW........",
    "....oWWo........",
    "....gGGg........",
    "...gGGGGg.......",
    "...GGTGGG.......",
    "..gGGGGGGg......",
    "................",
    "................",
    "................",
  ],
  owl: [
    "...BB....BB.....",
    "..fFFf..fFFf....",
    "..fFFFFFFFFf....",
    "..FLLLLLLLLF....",
    "..FLPEOOLPELF...",
    "..FLEEYVEELF....",
    "...FLLYYLLF.....",
    "....fFFFFf......",
    "....sSSSs.......",
    "...sSSSSSSs.....",
    "...SSSRRSSS.....",
    "..sSSSSSSSs.....",
    "................",
    "................",
    "................",
    "................",
  ]
}

// v7: Portrait mode (head only, no body)
const V7_SPRITES = {
  fox: [
    "..BO....OB......",
    "..OOO..OOO......",
    "..oOOOOOOo......",
    "..OOOOOOOO......",
    "..oPEOOEPo......",
    "..oEEOOEEo......",
    "...oWWWWo.......",
    "....WBBW........",
    "....oWWo........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  owl: [
    "...BB....BB.....",
    "..fFFf..fFFf....",
    "..fFFFFFFFFf....",
    "..FLLLLLLLLF....",
    "..FLPEOOLPELF...",
    "..FLEEYVEELF....",
    "...FLLYYLLF.....",
    "....fFFFFf......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ]
}

// v8: Cleaned up with highlights on ear tufts
const V8_PALETTES = {
  fox: {
    ...V6_PALETTES.fox,
    'H': '#F4A030',  // Highlight
  },
  owl: {
    ...V6_PALETTES.owl,
    'H': '#8B7355',  // Warm gray highlight (for tufts)
  }
}

const V8_SPRITES = {
  fox: [
    "..BH...HB.......",
    "..BOO..OOB......",
    "...OOOOOO.......",
    "..OOOOOOOO......",
    "..OPEOOEPOO.....",
    "..OEEOOEEOO.....",
    "...OOWWOO.......",
    "....WBBW........",
    "....WWWW........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  owl: [
    "..HBB..BBH......",
    "..FFFF..FFFF....",
    "...FFFFFFFF.....",
    "..FLLLLLLLLF....",
    "..FLPEOOLPELF...",
    "..FLEEYYEELF....",
    "...FLLYYLLF.....",
    "....FFFFFF......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ]
}

// v9: Simplified icon mode (ghost-icon style)
const V9_PALETTES = {
  fox: {
    '.': 'transparent',
    'O': '#E86A17',  // Orange
    'o': '#B85510',  // Dark orange
    'W': '#F0F0F0',  // White muzzle
    'B': '#1A1A1A',  // Black (nose, eyes)
  },
  owl: {
    '.': 'transparent',
    'F': '#6B5344',  // Brown
    'f': '#4A3A2F',  // Dark brown
    'L': '#E8DCC8',  // Face disk
    'Y': '#FFD700',  // Beak
    'B': '#1A1A1A',  // Black (eyes)
  }
}

const V9_SPRITES = {
  fox: [
    "..OO....OO......",
    ".OOOO..OOOO.....",
    ".oOOOOOOOOo.....",
    ".OOOOOOOOOO.....",
    ".OO.BB.BB.OO....",
    "..OOWWWWOO......",
    "...OWBWO........",
    "....OWWO........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  owl: [
    "....FFFFFF......",
    "..FFFFFFFFFF....",
    ".fFFFFFFFFFFf...",
    ".FFLLLLLLLLFF...",
    ".FFL.BB.BB.LFF..",
    "..FLLLYYLLLF....",
    "...FLLYYLFFF....",
    "....FFFFFF......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ]
}

// v10: Ultra-minimal (Claude-icon style)
const V10_PALETTES = {
  fox: {
    '.': 'transparent',
    'O': '#E86A17',  // Orange
    'B': '#1A1A1A',  // Black (eyes)
  },
  owl: {
    '.': 'transparent',
    'F': '#6B5344',  // Brown
    'B': '#1A1A1A',  // Black (eyes)
  }
}

const V10_SPRITES = {
  fox: [
    "..OO......OO....",
    ".OOOO....OOOO...",
    ".OOOOOOOOOOOO...",
    ".OOO.BB.BB.OOO..",
    "..OOOOOOOOOO....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  owl: [
    "....FFFFFFFF....",
    "..FFFFFFFFFFFF..",
    "..FFF.BB.BB.FFF.",
    "...FFFFFFFFFF...",
    ".....FFFFFF.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ]
}

// Generic renderer component
function SpriteRenderer({
  sprites,
  palette,
  size = 64
}: {
  sprites: string[]
  palette: Record<string, string>
  size?: number
}) {
  const grid = useMemo(() => sprites.map(row => row.split('')), [sprites])

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 16 16" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
        {grid.map((row, y) =>
          row.map((char, x) => {
            if (char === '.') return null
            const color = palette[char as keyof typeof palette]
            if (!color) return null
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={color}
              />
            )
          })
        )}
      </svg>
    </div>
  )
}

// Version card component
function VersionCard({
  version,
  description,
  foxSprites,
  owlSprites,
  foxPalette,
  owlPalette,
  colors
}: {
  version: string
  description: string
  foxSprites: string[]
  owlSprites: string[]
  foxPalette: Record<string, string>
  owlPalette: Record<string, string>
  colors: number
}) {
  return (
    <div className="bg-stone-900 p-4 rounded-lg">
      <div className="mb-3">
        <h3 className="text-stone-100 font-bold">{version}</h3>
        <p className="text-stone-500 text-xs">{description}</p>
        <p className="text-stone-600 text-xs">{colors} colors per character</p>
      </div>

      <div className="flex gap-6 justify-center mb-4">
        <div className="text-center">
          <SpriteRenderer sprites={foxSprites} palette={foxPalette} size={64} />
          <p className="text-xs text-stone-500 mt-1">Fox</p>
        </div>
        <div className="text-center">
          <SpriteRenderer sprites={owlSprites} palette={owlPalette} size={64} />
          <p className="text-xs text-stone-500 mt-1">Owl</p>
        </div>
      </div>

      {/* Small size test */}
      <div className="flex gap-4 justify-center border-t border-stone-800 pt-3">
        <div className="text-center">
          <SpriteRenderer sprites={foxSprites} palette={foxPalette} size={32} />
          <p className="text-2xs text-stone-600">32px</p>
        </div>
        <div className="text-center">
          <SpriteRenderer sprites={owlSprites} palette={owlPalette} size={32} />
          <p className="text-2xs text-stone-600">32px</p>
        </div>
      </div>
    </div>
  )
}

export default function CompareVersionsPage() {
  return (
    <div className="min-h-screen bg-stone-950 p-8">
      <h1 className="text-2xl font-bold text-stone-100 mb-2">Pixel Avatar Version Comparison</h1>
      <p className="text-stone-500 mb-8">All iterations from v6 → v10</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VersionCard
          version="v6: Full Body"
          description="Complete character with clothing, shadows"
          foxSprites={V6_SPRITES.fox}
          owlSprites={V6_SPRITES.owl}
          foxPalette={V6_PALETTES.fox}
          owlPalette={V6_PALETTES.owl}
          colors={10}
        />

        <VersionCard
          version="v7: Portrait Mode"
          description="Head only, removed body/clothing"
          foxSprites={V7_SPRITES.fox}
          owlSprites={V7_SPRITES.owl}
          foxPalette={V6_PALETTES.fox}
          owlPalette={V6_PALETTES.owl}
          colors={8}
        />

        <VersionCard
          version="v8: Cleaned Up"
          description="Removed noise, added highlights"
          foxSprites={V8_SPRITES.fox}
          owlSprites={V8_SPRITES.owl}
          foxPalette={V8_PALETTES.fox}
          owlPalette={V8_PALETTES.owl}
          colors={6}
        />

        <VersionCard
          version="v9: Icon Mode"
          description="Ghost-icon style, simplified features"
          foxSprites={V9_SPRITES.fox}
          owlSprites={V9_SPRITES.owl}
          foxPalette={V9_PALETTES.fox}
          owlPalette={V9_PALETTES.owl}
          colors={4}
        />

        <VersionCard
          version="v10: Ultra-Minimal"
          description="Claude-style: shape + 2 dot eyes"
          foxSprites={V10_SPRITES.fox}
          owlSprites={V10_SPRITES.owl}
          foxPalette={V10_PALETTES.fox}
          owlPalette={V10_PALETTES.owl}
          colors={2}
        />
      </div>

      <div className="mt-8 text-stone-600 text-xs">
        <p>Progression: Complex → Simple</p>
        <p>Goal: Instant recognition at 32px with minimal visual noise</p>
      </div>
    </div>
  )
}
