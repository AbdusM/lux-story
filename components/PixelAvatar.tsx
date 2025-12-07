'use client'

import { useMemo } from 'react'

export type AnimalType = 'fox' | 'owl' | 'raccoon' | 'bear' | 'chameleon' | 'dog' | 'mouse' | 'parrot' | 'raven' | 'rabbit' | 'butterfly' | 'deer' | 'cat'

interface PixelAvatarProps {
  animal: AnimalType
  size?: number
  className?: string
}

// 32×32 Sprite System - 4× pixel budget for expressive, legible characters
// Design principles:
// - Eyes are 3-4px with visible pupils and highlights
// - Clear silhouettes identifiable at any scale
// - Consistent face positioning (eyes at row 12-15, centered horizontally)
// - 10-12 color palette per character

const PALETTES: Record<AnimalType, Record<string, string>> = {
  // Tess - Fox: Warm, guiding (red-orange fox)
  fox: {
    '.': 'transparent',
    'B': '#1A1A1A',  // Black (outline, nose, pupils)
    'O': '#E86A17',  // Orange (main fur)
    'o': '#B85510',  // Dark orange (shadow)
    'C': '#D45A0A',  // Mid orange (contour)
    'W': '#F5F5F5',  // White (muzzle, eye whites)
    'w': '#E0E0E0',  // Off-white (muzzle shadow)
    'H': '#FFFFFF',  // Highlight
    'I': '#FFE4C4',  // Inner ear
    'N': '#2D2D2D',  // Nose
  },
  // Samuel - Owl: Wise, observant conductor
  owl: {
    '.': 'transparent',
    'B': '#1A1A1A',  // Black (ear tufts, pupils)
    'F': '#6B5344',  // Brown (feathers)
    'f': '#4A3A2F',  // Dark brown (shadow)
    'D': '#5C4639',  // Mid brown (contour)
    'L': '#E8DCC8',  // Light tan (face disk)
    'l': '#D4C8B4',  // Tan shadow
    'W': '#F5F5F5',  // Eye whites
    'H': '#FFFFFF',  // Highlight
    'Y': '#FFD700',  // Yellow (beak)
    'y': '#DAA520',  // Dark yellow
  },
  // Maya - Cat: Clever, resourceful (gray tabby)
  cat: {
    '.': 'transparent',
    'G': '#7A7A7A',  // Gray (main fur)
    'g': '#5A5A5A',  // Dark gray (shadow)
    'M': '#6A6A6A',  // Mid gray
    'S': '#9A9A9A',  // Light gray (stripes)
    'P': '#FFB6C1',  // Pink (nose, inner ear)
    'W': '#F5F5F5',  // White (muzzle, eye whites)
    'w': '#E0E0E0',  // Off-white
    'B': '#1A1A1A',  // Black (pupils)
    'H': '#FFFFFF',  // Highlight
    'E': '#7CB342',  // Green eyes
  },
  // Marcus - Bear: Warm, nurturing
  bear: {
    '.': 'transparent',
    'B': '#8B5A2B',  // Brown (main fur)
    'b': '#5C3D1E',  // Dark brown (shadow)
    'M': '#7A4F26',  // Mid brown
    'T': '#D2A679',  // Tan (muzzle, inner ear)
    't': '#C49568',  // Tan shadow
    'N': '#1A1A1A',  // Black (nose, pupils)
    'W': '#F5F5F5',  // Eye whites
    'H': '#FFFFFF',  // Highlight
  },
  // Devon - Deer: Gentle, thoughtful
  deer: {
    '.': 'transparent',
    'B': '#8B6914',  // Brown (main fur)
    'b': '#6B4F0E',  // Dark brown (shadow)
    'M': '#7A5D12',  // Mid brown
    'T': '#D4B896',  // Tan (face, inner ear)
    't': '#C4A886',  // Tan shadow
    'W': '#F5F5F5',  // White (spots, eye whites)
    'N': '#1A1A1A',  // Black (nose, pupils)
    'H': '#FFFFFF',  // Highlight
    'A': '#5C4033',  // Antler brown
    'a': '#4A3429',  // Dark antler
  },
  // Rohan - Raven: Mysterious, introspective
  raven: {
    '.': 'transparent',
    'B': '#1A1A1A',  // Black (main feathers)
    'b': '#0D0D0D',  // Darker black (shadow)
    'P': '#2D2D4A',  // Purple-black (iridescence)
    'p': '#1A1A30',  // Dark purple
    'G': '#3A3A3A',  // Gray (highlights)
    'W': '#F5F5F5',  // Eye whites
    'H': '#FFFFFF',  // Highlight
    'Y': '#4A4A4A',  // Beak gray
    'y': '#3A3A3A',  // Beak shadow
    'E': '#FFD700',  // Yellow eye ring
  },
  // Yaquin - Rabbit: Gentle, curious
  rabbit: {
    '.': 'transparent',
    'C': '#E8D4C4',  // Cream (main fur)
    'c': '#D4C0B0',  // Dark cream (shadow)
    'B': '#D0B8A8',  // Brown tint
    'P': '#FFB6C1',  // Pink (ears, nose)
    'p': '#E8A0AB',  // Dark pink
    'W': '#F5F5F5',  // White (muzzle, eye whites)
    'w': '#E8E8E8',  // Off-white
    'N': '#1A1A1A',  // Black (pupils)
    'H': '#FFFFFF',  // Highlight
  },
  // Lira - Butterfly: Ethereal, transformative
  butterfly: {
    '.': 'transparent',
    'B': '#1A1A1A',  // Black (body, antennae)
    'P': '#9C27B0',  // Purple (wings)
    'p': '#7B1FA2',  // Dark purple
    'L': '#CE93D8',  // Light purple
    'O': '#FF9800',  // Orange (wing spots)
    'o': '#F57C00',  // Dark orange
    'W': '#F5F5F5',  // White (wing edges)
    'H': '#FFFFFF',  // Highlight
    'Y': '#FFD700',  // Yellow (accents)
    'E': '#1A1A1A',  // Eyes
  },
  // Legacy mappings for backwards compatibility
  raccoon: {
    '.': 'transparent',
    'G': '#8B8B8B',
    'g': '#5A5A5A',
    'M': '#707070',
    'B': '#1A1A1A',
    'b': '#2D2D2D',
    'W': '#F5F5F5',
    'w': '#E0E0E0',
    'H': '#FFFFFF',
    'I': '#FFE4E1',
  },
  chameleon: {
    '.': 'transparent',
    'G': '#4CAF50',
    'g': '#2E7D32',
    'M': '#3D9140',
    'L': '#8BC34A',
    'Y': '#FFD700',
    'y': '#DAA520',
    'W': '#F5F5F5',
    'B': '#1A1A1A',
    'H': '#FFFFFF',
    'C': '#66BB6A',
  },
  dog: {
    '.': 'transparent',
    'G': '#D4A857',
    'g': '#A67C3D',
    'M': '#C49545',
    'T': '#E8C078',
    't': '#D4AC64',
    'N': '#1A1A1A',
    'W': '#F5F5F5',
    'H': '#FFFFFF',
    'P': '#5C4033',
  },
  mouse: {
    '.': 'transparent',
    'G': '#A0A0A0',
    'g': '#707070',
    'M': '#8A8A8A',
    'P': '#FFB6C1',
    'p': '#E8A0AB',
    'W': '#F5F5F5',
    'w': '#E8E8E8',
    'B': '#1A1A1A',
    'H': '#FFFFFF',
  },
  parrot: {
    '.': 'transparent',
    'G': '#2E8B57',
    'g': '#1E5C3A',
    'M': '#268049',
    'R': '#E53935',
    'r': '#C62828',
    'Y': '#FFD700',
    'y': '#DAA520',
    'W': '#F5F5F5',
    'B': '#1A1A1A',
    'H': '#FFFFFF',
  }
}

// 32×32 Sprites - Portrait mode with expressive features
const SPRITES: Record<AnimalType, string[]> = {
  // Tess - Fox: Pointed ears, warm expression, white muzzle
  fox: [
    "................................",  // 0
    "................................",  // 1
    "....BO..............OB.........",  // 2: Ear tips
    "...BOO..............OOB........",  // 3
    "...BOIO............OIOB........",  // 4: Ear with inner
    "..BOOIO............OIOOB.......",  // 5
    "..BOOIOO........OOOOIOOB.......",  // 6
    ".BOOOoOOO......OOOoOOOOB.......",  // 7
    ".BOOOoOOOO....OOOOoOOOOB.......",  // 8
    ".BOOOoOOOOOOOOOOOOoOOOOB.......",  // 9
    "..BOOoOOOOOOOOOOOOoOOB.........",  // 10
    "..BOOoOOOOOOOOOOOOoOOB.........",  // 11
    "..BOoOOOOOOOOOOOOOOoOB.........",  // 12
    "..BoOOOWHBOOOOBHWOOOoB.........",  // 13: Eyes
    "..BoOOOWWBOOOOBWWOOOoB.........",  // 14: Eyes
    "..BoOOOOOOOOOOOOOOOOoB.........",  // 15
    "...BoOOOOWWWWWWOOOOoB..........",  // 16: Muzzle start
    "...BoOOOWWWWWWWWOOOoB..........",  // 17
    "....BoOOWWWWWWWWOOoB...........",  // 18
    "....BoOOWWWNNWWWOOoB...........",  // 19: Nose
    ".....BoOOWWNNWWOOoB............",  // 20
    ".....BoOOOWWWWOOOoB............",  // 21
    "......BoOOOOOOOOoB.............",  // 22
    ".......BooOOOOooB..............",  // 23
    "........BBBBBBBB...............",  // 24
    "................................",  // 25
    "................................",  // 26
    "................................",  // 27
    "................................",  // 28
    "................................",  // 29
    "................................",  // 30
    "................................",  // 31
  ],
  // Samuel - Owl: Ear tufts, large expressive eyes, face disk
  owl: [
    "................................",  // 0
    "......BB........BB.............",  // 1: Ear tufts
    ".....BFFB......BFFB............",  // 2
    ".....BFFfB....BfFFB............",  // 3
    "....BFFffB....BffFFB...........",  // 4
    "...BFFFfFFFFFFFFfFFFB..........",  // 5
    "...BFFFfFFFFFFFFfFFFB..........",  // 6
    "..BFFFFfFFFFFFFFfFFFFB.........",  // 7
    "..BFFFfFFFFFFFFFfFFFFB.........",  // 8
    "..BFFFfFFFFFFFFFFFfFFB.........",  // 9
    "..BFFFLLLLLLLLLLLLfFFB.........",  // 10: Face disk
    "..BFFLLLLLLLLLLLLLLfFB.........",  // 11
    "..BFFLLLLLLLLLLLLLLfFB.........",  // 12
    "..BFLLWHBLLLLLBHWLLFB..........",  // 13: Eyes
    "..BFLLWWBLLLLLBWWLLFB..........",  // 14
    "..BFLLLLLLLLLLLLLLLfB..........",  // 15
    "..BFfLLLLLYYYLLLLLfFB..........",  // 16: Beak start
    "...BFfLLLLYYYLLLLfFB...........",  // 17
    "...BFfLLLLLYLLLLLfFB...........",  // 18
    "....BFfLLLLLLLLLfFB............",  // 19
    "....BFFfLLLLLLLfFFB............",  // 20
    ".....BFFffLLLffFFB.............",  // 21
    "......BFFFfffFFFB..............",  // 22
    ".......BFFFFFFFB...............",  // 23
    "........BBBBBBB................",  // 24
    "................................",  // 25
    "................................",  // 26
    "................................",  // 27
    "................................",  // 28
    "................................",  // 29
    "................................",  // 30
    "................................",  // 31
  ],
  // Maya - Cat: Pointed ears, whiskers, clever expression
  cat: [
    "................................",  // 0
    "................................",  // 1
    "....BG..............GB.........",  // 2: Ear tips
    "...BGG..............GGB........",  // 3
    "...BGPG............GPGB........",  // 4: Ear with pink inner
    "..BGPGG............GGPGB.......",  // 5
    "..BGPGGG........GGGPGGB.......",  // 6
    ".BGGGgGGG......GGGgGGGGB.......",  // 7
    ".BGGGgGGGG....GGGGgGGGGB.......",  // 8
    ".BGGGgGGGGGGGGGGGGgGGGGB.......",  // 9
    "..BGGgGGGGGGGGGGGGgGGB.........",  // 10
    "..BGGgGGGGGGGGGGGGgGGB.........",  // 11
    "..BGgGGGGGGGGGGGGGGgGB.........",  // 12
    "..BgGGGWHBGGGGBHWGGGgB.........",  // 13: Eyes (green)
    "..BgGGGWEBGGGGBEWGGGgB.........",  // 14: Eyes
    "..BgGGGGGGGGGGGGGGGGgB.........",  // 15
    "...BgGGGGWWWWWWGGGGgB..........",  // 16: Muzzle start
    "...BgGGGWWWWWWWWGGGgB..........",  // 17
    "....BgGGWWWWWWWWGGgB...........",  // 18
    "....BgGGWWWPPWWWGGgB...........",  // 19: Pink nose
    ".....BgGGWWPPWWGGgB............",  // 20
    ".....BgGGGWWWWGGGgB............",  // 21
    "......BgGGGGGGGGgB.............",  // 22
    ".......BggGGGGggB..............",  // 23
    "........BBBBBBBB...............",  // 24
    "................................",  // 25
    "................................",  // 26
    "................................",  // 27
    "................................",  // 28
    "................................",  // 29
    "................................",  // 30
    "................................",  // 31
  ],
  // Marcus - Bear: Round ears, broad face, gentle expression
  bear: [
    "................................",  // 0
    "................................",  // 1
    "....bBBb........bBBb...........",  // 2: Round ears
    "...bBTTBb......bBTTBb..........",  // 3
    "...bBTTBb......bBTTBb..........",  // 4
    "..bBBBBBBB....BBBBBBBb.........",  // 5
    "..bBBbBBBB....BBBBbBBb.........",  // 6
    ".bBBBbBBBBB..BBBBBbBBBb........",  // 7
    ".bBBBbBBBBBBBBBBBBbBBBb........",  // 8
    ".bBBBbBBBBBBBBBBBBbBBBb........",  // 9
    "..BBBbBBBBBBBBBBBBbBBB.........",  // 10
    "..BBBbBBBBBBBBBBBBbBBB.........",  // 11
    "..BBbBBBBBBBBBBBBBBbBB.........",  // 12
    "..BbBBWHNBBBBBBNHWBBbB.........",  // 13: Eyes
    "..BbBBWWNBBBBBBNWWBBbB.........",  // 14
    "..BbBBBBBBBBBBBBBBBBbB.........",  // 15
    "...BbBBBBTTTTTTBBBBbB..........",  // 16: Muzzle
    "...BbBBTTTTTTTTTTBBbB..........",  // 17
    "....BbBTTTTTTTTTTBbB...........",  // 18
    "....BbBTTTTNNTTTTBbB...........",  // 19: Nose
    ".....BbBTTTNNTTTBbB............",  // 20
    ".....BbBBTTTTTTBBbB............",  // 21
    "......BbBBBBBBBBbB.............",  // 22
    ".......BbbBBBBbbB..............",  // 23
    "........BBBBBBBB...............",  // 24
    "................................",  // 25
    "................................",  // 26
    "................................",  // 27
    "................................",  // 28
    "................................",  // 29
    "................................",  // 30
    "................................",  // 31
  ],
  // Devon - Deer: Gentle eyes, small antlers, spotted
  deer: [
    "................................",  // 0
    "....aA..............Aa.........",  // 1: Antler tips
    "...aAA..............AAa........",  // 2
    "...aAAa............aAAa........",  // 3
    "..aAABB............BBAaa.......",  // 4: Antlers meet head
    "..BBBBB............BBBBB.......",  // 5
    "..BBTBB............BBTBB.......",  // 6: Ear with tan inner
    ".BBBBbBBB......BBBbBBBBB.......",  // 7
    ".BBBBbBBBB....BBBBbBBBBB.......",  // 8
    ".BBBBbBBBBBBBBBBBBbBBBBB.......",  // 9
    "..BBBbBBBBBBBBBBBBbBBB.........",  // 10
    "..BBBbBBWBBBBBBWBBbBBB.........",  // 11: Spots
    "..BBbBBBBBBBBBBBBBBbBB.........",  // 12
    "..BbBBWHNBBBBBBNHWBBbB.........",  // 13: Eyes
    "..BbBBWWNBBBBBBNWWBBbB.........",  // 14
    "..BbBBBBBBBBBBBBBBBBbB.........",  // 15
    "...BbBBBBTTTTTTBBBBbB..........",  // 16: Muzzle
    "...BbBBTTTTTTTTTTBBbB..........",  // 17
    "....BbBTTTTTTTTTTBbB...........",  // 18
    "....BbBTTTTNNTTTTBbB...........",  // 19: Nose
    ".....BbBTTTNNTTTBbB............",  // 20
    ".....BbBBTTTTTTBBbB............",  // 21
    "......BbBBBBBBBBbB.............",  // 22
    ".......BbbBBBBbbB..............",  // 23
    "........BBBBBBBB...............",  // 24
    "................................",  // 25
    "................................",  // 26
    "................................",  // 27
    "................................",  // 28
    "................................",  // 29
    "................................",  // 30
    "................................",  // 31
  ],
  // Rohan - Raven: Sleek black feathers, intelligent eyes, sharp beak
  raven: [
    "................................",  // 0
    "................................",  // 1
    "......BB........BB.............",  // 2: Head crest
    ".....BPPB......BPPB............",  // 3: Purple iridescence
    "....BPPPbB....BbPPPB...........",  // 4
    "...BPPPbBBBBBBBBbPPPB..........",  // 5
    "...BPPbBBBBBBBBBBbPPB..........",  // 6
    "..BPPbBBBBBBBBBBBBbPPB.........",  // 7
    "..BPbBBBBBBBBBBBBBBbPB.........",  // 8
    "..BPbBBBBBBBBBBBBBBbPB.........",  // 9
    "..BbBBBBBBBBBBBBBBBBbB.........",  // 10
    "..BbBBBBBBBBBBBBBBBBbB.........",  // 11
    "..BbBBBBBBBBBBBBBBBBbB.........",  // 12
    "..BbBEWHBBBBBBBBBHWEbB.........",  // 13: Eyes with yellow ring
    "..BbBEWWBBBBBBBBBWWEbB.........",  // 14
    "..BbBBBBBBBBBBBBBBBBbB.........",  // 15
    "...BbBBBBBYYYBBBBBbB...........",  // 16: Beak start
    "...BbBBBBYYYYYBBBBbB...........",  // 17
    "....BbBBBYYYYYBBBbB............",  // 18
    "....BbBBBBYYYBBBBbB............",  // 19
    ".....BbBBBBYBBBBbB.............",  // 20
    ".....BbBBBBBBBBBbB.............",  // 21
    "......BbBBBBBBBbB..............",  // 22
    ".......BbbBBBbbB...............",  // 23
    "........BBBBBBB................",  // 24
    "................................",  // 25
    "................................",  // 26
    "................................",  // 27
    "................................",  // 28
    "................................",  // 29
    "................................",  // 30
    "................................",  // 31
  ],
  // Yaquin - Rabbit: Long upright ears, gentle expression
  rabbit: [
    "................................",  // 0
    "....CP..............PC.........",  // 1: Ear tips (pink inner)
    "...CPP..............PPC........",  // 2
    "...CPPC............CPPC........",  // 3
    "..CPPCC............CCPPC.......",  // 4
    "..CPPCC............CCPPC.......",  // 5
    "..CPPCC............CCPPC.......",  // 6
    ".CCPPCC............CCPPCC......",  // 7
    ".CCPPCC............CCPPCC......",  // 8
    ".CCCCcCCC......CCCcCCCCC.......",  // 9: Ears meet head
    "..CCCcCCCC....CCCCcCCC.........",  // 10
    "..CCCcCCCCCCCCCCCCcCCC.........",  // 11
    "..CCcCCCCCCCCCCCCCCcCC.........",  // 12
    "..CcCCWHNCCCCCCNHWCCcC.........",  // 13: Eyes
    "..CcCCWWNCCCCCCNWWCCcC.........",  // 14
    "..CcCCCCCCCCCCCCCCCCcC.........",  // 15
    "...CcCCCCWWWWWWCCCCcC..........",  // 16: Muzzle
    "...CcCCCWWWWWWWWCCCcC..........",  // 17
    "....CcCCWWWWWWWWCCcC...........",  // 18
    "....CcCCWWWPPWWWCCcC...........",  // 19: Pink nose
    ".....CcCCWWPPWWCCcC............",  // 20
    ".....CcCCCWWWWCCCcC............",  // 21
    "......CcCCCCCCCCcC.............",  // 22
    ".......CccCCCCccC..............",  // 23
    "........CCCCCCCC...............",  // 24
    "................................",  // 25
    "................................",  // 26
    "................................",  // 27
    "................................",  // 28
    "................................",  // 29
    "................................",  // 30
    "................................",  // 31
  ],
  // Lira - Butterfly: Delicate wings, ethereal presence (symmetrical, connected)
  butterfly: [
    "................................",  // 0
    "................................",  // 1
    ".......B........B..............",  // 2: Antennae
    "......BB........BB.............",  // 3
    ".....B..B......B..B............",  // 4: Antennae curl
    "................................",  // 5
    "....PPPPP..PPPPP...............",  // 6: Upper wings connected
    "...PPPLPPPPPPLPPP..............",  // 7
    "..PPPLOPPPPPPOLPPP.............",  // 8: Wing pattern with orange
    "..PPPLPPPPPPPLPPP..............",  // 9
    "..PPPOPPBBBBOPPPP..............",  // 10: Body center
    "..PPPLPPBBBBPPLPPP.............",  // 11
    "...PPPPPBBBBPPPPP..............",  // 12
    "....PPPPBEEBPPPP...............",  // 13: Eyes on body
    "....PPPPBEEBPPPP...............",  // 14
    "...PPPPPBBBBPPPPP..............",  // 15
    "..PPPLPPBBBBPPLPPP.............",  // 16
    "..PPPOPPBBBBOPPPP..............",  // 17: Lower wings
    "..PPPLPPPPPPPLPPP..............",  // 18
    "..PPPLOPPPPPPOLPPP.............",  // 19
    "...PPPLPPPPPPLPPP..............",  // 20
    "....PPPPP..PPPPP...............",  // 21
    "................................",  // 22
    "................................",  // 23
    "................................",  // 24
    "................................",  // 25
    "................................",  // 26
    "................................",  // 27
    "................................",  // 28
    "................................",  // 29
    "................................",  // 30
    "................................",  // 31
  ],
  // Legacy sprites for backwards compatibility
  raccoon: [
    "................................",
    "................................",
    "....GI..............IG.........",
    "...GGI..............IGG........",
    "...GGGI............IGGG........",
    "..GGGGI............IGGGG.......",
    "..GGGGgGG......GGgGGGGG........",
    ".GGGGGgGGG....GGGgGGGGGG.......",
    ".GGGGGgGGGG..GGGGgGGGGGG.......",
    ".GGGGGgGGGGGGGGGGgGGGGGG.......",
    "..GGGgGGGGGGGGGGGGgGGG.........",
    "..GGGbBBBGGGGGGBBBbGGG.........",
    "..GGbBBBBGGGGGGBBBBbGG.........",
    "..GGBBWHBGGGGGGBHWBBgG.........",
    "..GGBBWWBGGGGGGBWWBBgG.........",
    "..GgBBBBBGGGGGGBBBBBgG.........",
    "...GgBBBWWWWWWWWBBBgG..........",
    "...GgGGWWWWWWWWWWGGgG..........",
    "....GgGWWWWWWWWWWGgG...........",
    "....GgGWWWWBBWWWWGgG...........",
    ".....GgGWWWBBWWWGgG............",
    ".....GgGGWWWWWWGGgG............",
    "......GgGGGGGGGGgG.............",
    ".......GggGGGGggG..............",
    "........GGGGGGGG...............",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
  ],
  chameleon: [
    "................................",
    "........CCCCCC..................",
    ".......CCCCCCC..................",
    "......CCGGGGGCC.................",
    ".....CGGGGGGGGGC................",
    "....CGGGGGGGGGGGC...............",
    "...CGGGGgGGGGGgGGGC.............",
    "...GGGGGgGGGGGgGGGG.............",
    "..GGGGGGgGGGGGGgGGGG............",
    "..GGGGGgGGGGGGGGgGGGG...........",
    "..GGGGgGGGGGGGGGGgGGG...........",
    ".YYYGgGGGGGGGGGGGgGYYY..........",
    ".YWHBgGGGGGGGGGGGgBHWY..........",
    ".YWWBgGGGGGGGGGGGgBWWY..........",
    ".YYYGgGGGGGGGGGGGgGYYY..........",
    "..GGGgGGGGGGGGGGGGgGGG..........",
    "..GGGgGGGGGGGGGGGGgGGG..........",
    "...GGgGGGGLLLLGGGGgGG...........",
    "...GGgGGGLLLLLLGGGgGG...........",
    "....GgGGGLLLLLLGGGgG............",
    "....GgGGGGLLLLGGGGgG............",
    ".....GgGGGGGGGGGGgG.............",
    "......GgGGGGGGGGgG..............",
    ".......GggGGGGggG...............",
    "........GGGGGGGG................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
  ],
  dog: [
    "................................",
    "................................",
    "....GG..............GG.........",
    "...gGGG............GGGg........",
    "..gGGGGG..........GGGGGg.......",
    ".gGGGGGGG........GGGGGGGg......",
    ".gGGGGGGGG......GGGGGGGGg......",
    ".gGGGGGGGGG....GGGGGGGGGg......",
    ".gGGGGgGGGGG..GGGGGgGGGGg......",
    ".gGGGGgGGGGGGGGGGGGgGGGGg......",
    "..GGGGgGGGGGGGGGGGGgGGGG.......",
    "..GGGGgGGGGGGGGGGGGgGGGG.......",
    "..GGGgGGGGGGGGGGGGGGgGGG.......",
    "..GGgGGWHPGGGGGGPHWGGgGG.......",
    "..GGgGGWWPGGGGGGPWWGGgGG.......",
    "..GGgGGGGGGGGGGGGGGGGgGG.......",
    "...GgGGGGTTTTTTTGGGGgG.........",
    "...GgGGGTTTTTTTTTGGGgG.........",
    "....GgGGTTTTTTTTTGGgG..........",
    "....GgGGTTTTNNTTTGGgG..........",
    ".....GgGTTTTNNTTTGgG...........",
    ".....GgGGTTTTTTTGGgG...........",
    "......GgGGGGGGGGGgG............",
    ".......GggGGGGggG..............",
    "........GGGGGGGG...............",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
  ],
  mouse: [
    "................................",
    "...PPPP..........PPPP..........",
    "..PPPPPP........PPPPPP.........",
    ".PPpPPPPP......PPPPPpPP........",
    ".PPppPPPP......PPPPppPP........",
    ".PPppPPPPP....PPPPPppPP........",
    "..PPPPGGGG....GGGGPPPP.........",
    "...PPGGGGG....GGGGGPP..........",
    "....GGGGGGG..GGGGGGG...........",
    "....GGGGGGgGGgGGGGGG...........",
    "....GGGGGgGGGGgGGGGG...........",
    "....GGGGgGGGGGGgGGGG...........",
    "....GGGgGGGGGGGGgGGG...........",
    "....GGgGWHBGGGBHWGgGG..........",
    "....GGgGWWBGGGBWWGgGG..........",
    "....GGgGGGGGGGGGGGgGG..........",
    ".....GgGGWWWWWWWGGgG...........",
    ".....GgGWWWWWWWWWGgG...........",
    "......GgWWWWWWWWWgG............",
    "......GgWWWWPWWWWgG............",
    ".......GgWWWPWWWgG.............",
    ".......GgGWWWWWGgG.............",
    "........GgGGGGGgG..............",
    ".........GggggG................",
    "..........GGGG.................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
  ],
  parrot: [
    "................................",
    ".......RRRRRR..................",
    "......RRRRRRR..................",
    ".....RRRrRRRRR.................",
    ".....RRrGGGGRR.................",
    "....RrGGGGGGGGr................",
    "....GGGGGGGGGGG................",
    "...GGGGGgGGGgGGGG..............",
    "...GGGGGgGGGGgGGGG.............",
    "...GGGGgGGGGGGgGGGG............",
    "...GGGgGGGGGGGGgGGG............",
    "...GGgGGGGGGGGGGgGGG...........",
    "...GGgGGGGGGGGGGgGGG...........",
    "...GgGWHBGGGGGBHWGgG...........",
    "...GgGWWBGGGGGBWWGgG...........",
    "...GgGGGGGGGGGGGGGgG...........",
    "....GgGGGGYYYGGGGgG............",
    "....GgGGGYYYYYGGGgG............",
    ".....GgGGYYYYYGGgG.............",
    ".....GgGGGYYYGGGgG.............",
    "......GgGGGYGGGgG..............",
    "......GgGGGGGGGgG..............",
    ".......GgGGGGGgG...............",
    "........GggggG.................",
    ".........GGGG..................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
  ]
}

export function PixelAvatar({ animal, size = 64, className = '' }: PixelAvatarProps) {
  const grid = useMemo(() => SPRITES[animal].map(row => row.split('')), [animal])
  const palette = PALETTES[animal]

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
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
