'use client'

import { useMemo } from 'react'

export type AnimalType = 'fox' | 'owl' | 'raccoon' | 'bear' | 'chameleon' | 'dog' | 'mouse' | 'parrot'

interface PixelAvatarProps {
  animal: AnimalType
  size?: number
  className?: string
}

// v6: Full body with clothing, shadows (10 colors per character)
const PALETTES = {
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
    'T': '#2D3047',  // Tie (unused)
    'R': '#B22222',  // Red tie (firebrick)
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
    'V': '#FFD700',  // Beak center
    'S': '#3B8EA5',  // Blue (suit)
    's': '#2D7086',  // Dark blue
    'R': '#D1495B',  // Red (bowtie)
  },
  // Maya - Raccoon: Clever, resourceful
  raccoon: {
    '.': 'transparent',
    'G': '#8B8B8B',  // Gray (main fur)
    'g': '#5A5A5A',  // Dark gray (shadow)
    'B': '#1A1A1A',  // Black (mask, nose)
    'W': '#F0F0F0',  // White (face, ears)
    'E': '#F0F0F0',  // Eye white
    'P': '#1A1A1A',  // Pupil
    'N': '#3A3A3A',  // Nose
  },
  // Tess - Bear: Warm, nurturing
  bear: {
    '.': 'transparent',
    'B': '#8B5A2B',  // Brown (main fur)
    'b': '#5C3D1E',  // Dark brown (shadow)
    'T': '#D2A679',  // Tan (muzzle, inner ear)
    'N': '#1A1A1A',  // Black (nose)
    'E': '#F0F0F0',  // Eye white
    'P': '#1A1A1A',  // Pupil
  },
  // Jordan - Chameleon: Adaptive, observant
  chameleon: {
    '.': 'transparent',
    'G': '#4CAF50',  // Green (main scales)
    'g': '#2E7D32',  // Dark green (shadow)
    'L': '#8BC34A',  // Light green (belly/highlights)
    'Y': '#FFD700',  // Yellow (eye ring)
    'E': '#F0F0F0',  // Eye white
    'P': '#1A1A1A',  // Pupil
    'C': '#81C784',  // Crest color
  },
  // Kai - Dog (Golden Retriever): Loyal, enthusiastic
  dog: {
    '.': 'transparent',
    'G': '#D4A857',  // Golden (main fur)
    'g': '#A67C3D',  // Dark golden (shadow)
    'T': '#E8C078',  // Light tan (muzzle)
    'N': '#1A1A1A',  // Black (nose)
    'E': '#F0F0F0',  // Eye white
    'P': '#5C4033',  // Pupil (brown)
    'B': '#1A1A1A',  // Black
  },
  // Silas - Mouse: Curious, detail-oriented
  mouse: {
    '.': 'transparent',
    'G': '#A0A0A0',  // Gray (main fur)
    'g': '#707070',  // Dark gray (shadow)
    'P': '#FFB6C1',  // Pink (ears, nose)
    'W': '#F0F0F0',  // White (face)
    'E': '#F0F0F0',  // Eye white
    'B': '#1A1A1A',  // Black (pupil)
  },
  // Yaquin - Parrot: Creative, expressive
  parrot: {
    '.': 'transparent',
    'G': '#2E8B57',  // Green (main feathers)
    'g': '#1E5C3A',  // Dark green (shadow)
    'R': '#E53935',  // Red (head crest)
    'B': '#1976D2',  // Blue (accent)
    'Y': '#FFD700',  // Yellow (beak)
    'E': '#F0F0F0',  // Eye white
    'P': '#1A1A1A',  // Pupil
    'W': '#F0F0F0',  // White (eye ring)
  }
}

// v7: Portrait Mode (head only, no body/clothing)
const SPRITES = {
  fox: [
    "..BO....OB......",  // 0: Ear tips
    "..OOO..OOO......",  // 1: Ear bodies
    "..oOOOOOOo......",  // 2: Head top
    "..OOOOOOOO......",  // 3: Forehead
    "..oPEOOEPo......",  // 4: Eyes (pupils inward)
    "..oEEOOEEo......",  // 5: Eyes bottom
    "...oWWWWo.......",  // 6: Muzzle
    "....WBBW........",  // 7: Nose
    "....oWWo........",  // 8: Chin
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  owl: [
    "...BB....BB.....",  // 0: Ear tufts
    "..fFFf..fFFf....",  // 1: Tufts shaded
    "..fFFFFFFFFf....",  // 2: Head
    "..FLLLLLLLLF....",  // 3: Face disk
    "..FLPEOOLPELF...",  // 4: Eyes
    "..FLEEYVEELF....",  // 5: Eyes + beak
    "...FLLYYLLF.....",  // 6: Beak
    "....fFFFFf......",  // 7: Chin
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  // Maya - Raccoon (bandit mask, pointy face)
  raccoon: [
    "..GW....WG......",  // 0: Ear tips (white inside)
    "..GGG..GGG......",  // 1: Ear bodies
    "..gGGGGGGg......",  // 2: Head top
    "..GGGGGGGG......",  // 3: Forehead
    "..BEPGGPEB......",  // 4: BANDIT MASK + eyes
    "..BEEWWEEB......",  // 5: Mask bottom + white cheeks
    "...gWWWWg.......",  // 6: Muzzle
    "....WNNW........",  // 7: Nose
    "....gWWg........",  // 8: Chin
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  // Tess - Bear (round ears, friendly)
  bear: [
    "..bBb..bBb......",  // 0: Round ears
    "..BBB..BBB......",  // 1: Ear bodies
    "..bBBBBBBb......",  // 2: Head top
    "..BBBBBBBB......",  // 3: Forehead
    "..bPEBBEPb......",  // 4: Eyes
    "..bEETTEEb......",  // 5: Eyes + tan muzzle
    "...bTTTTb.......",  // 6: Muzzle
    "....TNNT........",  // 7: Nose
    "....bTTb........",  // 8: Chin
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  // Jordan - Chameleon (big eyes, crest)
  chameleon: [
    "....CCCC........",  // 0: Head crest
    "...CGGGC........",  // 1: Crest base
    "..gGGGGGGg......",  // 2: Head
    "..GGGGGGGGG.....",  // 3: Wide head
    ".YEPGGGPEY......",  // 4: BIG eyes (yellow ring)
    ".YEPGGGPEY......",  // 5: Eyes continue
    "..gGGGGGGg......",  // 6: Snout
    "...gLLLLg.......",  // 7: Mouth/chin
    "....gGGg........",  // 8: Neck
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  // Kai - Dog/Golden Retriever (floppy ears)
  dog: [
    "..GG....GG......",  // 0: Ear tops
    ".gGGG..GGGg.....",  // 1: Floppy ears
    ".gGGGGGGGGg.....",  // 2: Head + ears
    "..GGGGGGGG......",  // 3: Forehead
    "..gPEGGEPg......",  // 4: Eyes (brown pupils)
    "..gEETTEEg......",  // 5: Eyes + tan muzzle
    "...gTTTTg.......",  // 6: Muzzle
    "....TNNT........",  // 7: Nose
    "....gTTg........",  // 8: Chin
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  // Silas - Mouse (big round ears, small face)
  mouse: [
    ".PPP....PPP.....",  // 0: Big pink ears
    ".PGPP..PPGP.....",  // 1: Ear detail
    "..GGGGGGGG......",  // 2: Head
    "..gGGGGGGg......",  // 3: Head shadow
    "..gBEGGEBg......",  // 4: Eyes
    "..gEEWWEEg......",  // 5: Eyes + white snout
    "....WWWW........",  // 6: Snout
    "....WPWW........",  // 7: Pink nose
    ".....WW.........",  // 8: Chin
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  // Yaquin - Parrot (crest, curved beak)
  parrot: [
    "....RRR.........",  // 0: Red crest
    "...RRRR.........",  // 1: Crest wider
    "..gGGGGGg.......",  // 2: Head
    "..GGGGGGGG......",  // 3: Green head
    "..WPEGGEPW......",  // 4: Eyes (white ring)
    "..WEEYGEEW......",  // 5: Eyes + beak start
    "...GYYYBG.......",  // 6: Yellow curved beak
    "....gYYg........",  // 7: Beak tip
    "....gGGg........",  // 8: Chin
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ]
}

export function PixelAvatar({ animal, size = 64, className = '' }: PixelAvatarProps) {
  const grid = useMemo(() => SPRITES[animal].map(row => row.split('')), [animal])
  const palette = PALETTES[animal]

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
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
