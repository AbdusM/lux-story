export type AnimalType = 'fox' | 'owl' | 'raccoon' | 'bear' | 'chameleon' | 'dog' | 'mouse' | 'parrot' | 'raven' | 'rabbit' | 'butterfly' | 'deer' | 'cat' | 'player' | 'hedgehog' | 'peacock' | 'barnowl' | 'elephant'

// 32×32 Sprite System - 4× pixel budget for expressive, legible characters
// Design principles:
// - Eyes are 3-4px with visible pupils and highlights
// - Clear silhouettes identifiable at any scale
// - Consistent face positioning (eyes at row 12-15, centered horizontally)
// - 10-12 color palette per character

export const PALETTES: Record<AnimalType, Record<string, string>> = {
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
    // Player - Human silhouette (gender-neutral, warm tones)
    player: {
        '.': 'transparent',
        'B': '#1A1A1A',  // Black (outline, eyes)
        'S': '#D4A574',  // Skin tone (warm neutral)
        's': '#C49464',  // Skin shadow
        'H': '#5C4033',  // Hair (brown)
        'h': '#4A3429',  // Hair shadow
        'W': '#F5F5F5',  // Eye whites
        'E': '#FFFFFF',  // Eye highlight
        'C': '#6366F1',  // Clothing (indigo - matches app theme)
        'c': '#4F46E5',  // Clothing shadow
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
    },
    // Quinn - Hedgehog: Careful, protective (amber/copper tones)
    hedgehog: {
        '.': 'transparent',
        'B': '#1A1A1A',  // Black (eyes, nose)
        'S': '#8B6914',  // Brown spines
        's': '#6B4F0E',  // Dark spines (shadow)
        'T': '#D4A857',  // Tan (face, belly)
        't': '#C49545',  // Tan shadow
        'W': '#F5F5F5',  // Eye whites
        'H': '#FFFFFF',  // Highlight
        'N': '#2D2D2D',  // Nose
        'P': '#FFB6C1',  // Pink (inner ear)
    },
    // Dante - Peacock: Charismatic, bold (blue/teal/gold)
    peacock: {
        '.': 'transparent',
        'B': '#1A1A1A',  // Black (eye outline)
        'U': '#1E90FF',  // Blue (main feathers)
        'u': '#0066CC',  // Dark blue (shadow)
        'T': '#20B2AA',  // Teal (neck)
        't': '#178B8B',  // Dark teal
        'G': '#FFD700',  // Gold (accents)
        'g': '#DAA520',  // Dark gold
        'W': '#F5F5F5',  // Eye whites
        'H': '#FFFFFF',  // Highlight
        'N': '#4A4A4A',  // Beak gray
    },
    // Nadia - Barn Owl: Wise, watchful (cream/tan/teal)
    barnowl: {
        '.': 'transparent',
        'B': '#1A1A1A',  // Black (pupils)
        'C': '#F5E6D3',  // Cream (face disk)
        'c': '#E8D4C4',  // Cream shadow
        'T': '#D4A857',  // Tan (feathers)
        't': '#B8934A',  // Dark tan
        'W': '#F5F5F5',  // Eye whites
        'H': '#FFFFFF',  // Highlight
        'Y': '#2D2D2D',  // Beak dark
        'E': '#20B2AA',  // Teal eyes (unique)
    },
    // Isaiah - Elephant: Community-minded, memorable (gray/green)
    elephant: {
        '.': 'transparent',
        'B': '#1A1A1A',  // Black (pupils)
        'G': '#808080',  // Gray (main)
        'g': '#606060',  // Dark gray (shadow)
        'L': '#A0A0A0',  // Light gray (highlights)
        'P': '#FFB6C1',  // Pink (inner ear)
        'E': '#2E8B57',  // Green (eyes - wisdom)
        'W': '#F5F5F5',  // Eye whites
        'H': '#FFFFFF',  // Highlight
        'T': '#707070',  // Trunk gray
    }
}

// 32×32 Sprites - Portrait mode with expressive features
export const SPRITES: Record<AnimalType, string[]> = {
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
        "...BPPbBBBBBBBBBBBBbPPB.........",  // 7
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
        "..PPPLPPPPPPLPPP..............",  // 20
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
    // Player - Human silhouette (gender-neutral, friendly)
    player: [
        "................................",  // 0
        "................................",  // 1
        "..........HHHHHH...............",  // 2: Hair top
        ".........HHHHHHHH..............",  // 3
        "........HHHhHHHHHH.............",  // 4
        "........HHhHHHHHHH.............",  // 5
        ".......HHhSSSSSSHHH............",  // 6: Hair meets face
        ".......HhSSSSSSSShH............",  // 7
        ".......HSSSSSSSSSSH............",  // 8
        ".......HSSSSSSSSSSH............",  // 9
        ".......SSSsSSSsSSSS............",  // 10
        ".......SSsSSSSSsSSS............",  // 11
        ".......SsSSSSSSSsSS............",  // 12
        ".......SsWEBSBEWsSS............",  // 13: Eyes
        ".......SsWWBSBWWsSS............",  // 14
        ".......SsSSSSSSSsSS............",  // 15
        "........SsSSSSsSS..............",  // 16: Cheeks
        "........SsSSSSSsS..............",  // 17
        ".........SsSSsSS...............",  // 18
        ".........SsSsSS................",  // 19: Chin
        "..........sSsS.................",  // 20
        "..........CCCC.................",  // 21: Neck/collar
        ".........CCCCCC................",  // 22
        "........CCCcCCCC...............",  // 23: Shoulders
        ".......CCCccCCCCC..............",  // 24
        "......CCCCccCCCCCC.............",  // 25
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
    ],
    // Quinn - Hedgehog: Rounded body with spines, small face
    hedgehog: [
        "................................",  // 0
        "................................",  // 1
        ".........SSSSSSSS..............",  // 2: Spine tips
        "........SSSsSSSsSS.............",  // 3
        ".......SSsSSsSSsSSS............",  // 4
        "......SSsSSSsSSSsSSS...........",  // 5
        ".....SSsSSSSSSSSsSSSS..........",  // 6
        "....SSsSSSSSSSSSSsSSSS.........",  // 7
        "...SSsSSSSSSSSSSSSSsSSSS.......",  // 8
        "...SsSSSSSSSSSSSSSSSSsSSS......",  // 9
        "..SSSSSTTTTTTTTTTSSSSSSSS......",  // 10: Face starts
        "..SSSSTTTTTTTTTTTTTTsSSS.......",  // 11
        "..SSSTTTTTTTTTTTTTTTTsSS.......",  // 12
        "..SSTTTWHBTTTTTTBHWTTsS........",  // 13: Eyes
        "..SSTTTWWBTTTTTTBWWTTsS........",  // 14
        "..SSTTTTTTTTTTTTTTTTTsS........",  // 15
        "...STTTTTTTTTTTTTTTTsS.........",  // 16
        "...STTTTTTTNNTTTTTTsS..........",  // 17: Nose
        "....STTTTTTNNTTTTTsS...........",  // 18
        "....sTTTTTTTTTTTTsS............",  // 19
        ".....sTTTTTTTTTTsS.............",  // 20
        "......ssTTTTTTssS..............",  // 21
        ".......SssssssSS...............",  // 22
        "........SSSSSS.................",  // 23
        "................................",  // 24
        "................................",  // 25
        "................................",  // 26
        "................................",  // 27
        "................................",  // 28
        "................................",  // 29
        "................................",  // 30
        "................................",  // 31
    ],
    // Dante - Peacock: Elegant crest, colorful display
    peacock: [
        "................................",  // 0
        "........GgGgGgG................",  // 1: Crest feathers (gold)
        ".......GGGGGGGGG...............",  // 2
        "......GGGGGGGGGGG..............",  // 3
        ".......UUUUUUUUU...............",  // 4: Head (blue)
        "......UUUUUUUUUUU..............",  // 5
        ".....UUUUUuUUuUUUU.............",  // 6
        ".....UUUUuUUUUuUUUU............",  // 7
        "....UUUUuUUUUUUuUUUU...........",  // 8
        "....UUUuTTTTTTTTuUUU...........",  // 9: Neck (teal)
        "....UUuTTTTTTTTTTuUU...........",  // 10
        "....UuTTTTTTTTTTTTuU...........",  // 11
        "....uTTTTTTTTTTTTTTu...........",  // 12
        "....uTTWHBTTTTBHWTTu...........",  // 13: Eyes
        "....uTTWWBTTTTBWWTTu...........",  // 14
        "....uTTTTTTTTTTTTTTu...........",  // 15
        ".....uTTTTTTTTTTTTu............",  // 16
        ".....uTTTTNNNTTTTu.............",  // 17: Beak
        "......uTTTNNNTTTu..............",  // 18
        "......uTTTTTTTTu...............",  // 19
        ".......uTTTTTTu................",  // 20
        "........uTTTTu.................",  // 21
        ".........uTTu..................",  // 22
        "..........uu...................",  // 23
        "................................",  // 24
        "................................",  // 25
        "................................",  // 26
        "................................",  // 27
        "................................",  // 28
        "................................",  // 29
        "................................",  // 30
        "................................",  // 31
    ],
    // Nadia - Barn Owl: Heart-shaped face, large eyes
    barnowl: [
        "................................",  // 0
        "................................",  // 1
        ".....TTTT........TTTT..........",  // 2: Ear tufts (tan)
        "....TTTTT........TTTTT.........",  // 3
        "....TTTtTT......TTtTTT.........",  // 4
        "...TTTTtTTT....TTTtTTTT........",  // 5
        "...TTTtTTTTTTTTTTTtTTTT........",  // 6
        "..TTTtTTTTTTTTTTTTtTTTT........",  // 7
        "..TTtTTCCCCCCCCCCTTtTTT........",  // 8: Face disk (cream)
        "..TtTCCCCCCCCCCCCCCTtTT........",  // 9
        "..TtCCCCCCCCCCCCCCCCtTT........",  // 10
        "..TtCCCCCCCCCCCCCCCCtTT........",  // 11
        "..TtCCCCCCCCCCCCCCCCtTT........",  // 12
        "..TtCCWHBCCCCCCBHWCCtT.........",  // 13: Eyes (teal)
        "..TtCCWEBCCCCCCBEWCCtT.........",  // 14: Teal eyes
        "..TtCCCCCCCCCCCCCCCCtT.........",  // 15
        "...TtCCCCCCCCCCCCCCtT..........",  // 16
        "...TtCCCCCYYYCCCCCtT...........",  // 17: Beak
        "....TtCCCCYYYCCCCtT............",  // 18
        "....TtCCCCCYCCCCtT.............",  // 19
        ".....TtCCCCCCCCtT..............",  // 20
        "......TtCCCCCCtT...............",  // 21
        ".......TtCCCCtT................",  // 22
        "........TttttT.................",  // 23
        ".........TTTT..................",  // 24
        "................................",  // 25
        "................................",  // 26
        "................................",  // 27
        "................................",  // 28
        "................................",  // 29
        "................................",  // 30
        "................................",  // 31
    ],
    // Isaiah - Elephant: Large ears, trunk, wise expression
    elephant: [
        "................................",  // 0
        "................................",  // 1
        "...GGGG..........GGGG..........",  // 2: Ears
        "..GGGPGG........GGPGGG.........",  // 3: Pink inner ear
        ".GGGPPGGG......GGGPPGGG........",  // 4
        ".GGGPPGGG......GGGPPGGG........",  // 5
        ".GGGPGGGG......GGGGPGGG........",  // 6
        ".GGGGGGGGGGGGGGGGGGGGGG........",  // 7: Head
        "..GGGGGGGGGGGGGGGGGGgGG........",  // 8
        "..GGGGGgGGGGGGGGGgGGgGG........",  // 9
        "..GGGGgGGGGGGGGGGgGGgGG........",  // 10
        "..GGGgGGGGGGGGGGGGgGgGG........",  // 11
        "..GGgGGGGGGGGGGGGGGgGG.........",  // 12
        "..GgGGWHBGGGGGGBHWGgGG.........",  // 13: Eyes (green)
        "..GgGGWEBGGGGGGBEWGgGG.........",  // 14: Green eyes
        "..GgGGGGGGGGGGGGGGGgGG.........",  // 15
        "...GgGGGGGTTTTGGGGgGG..........",  // 16: Trunk starts
        "...GgGGGGTTTTTTGGGgGG..........",  // 17
        "....GgGGTTTTTTTTGgGG...........",  // 18
        "....GgGGTTTTTTTTGgGG...........",  // 19
        ".....GgGGTTTTTTGgGG............",  // 20
        ".....GgGGGTTTTGGgGG............",  // 21
        "......GgGGTTTGGgG..............",  // 22
        ".......GgGTTGgG................",  // 23
        "........GgTgG..................",  // 24
        ".........GTG...................",  // 25
        "................................",  // 26
        "................................",  // 27
        "................................",  // 28
        "................................",  // 29
        "................................",  // 30
        "................................",  // 31
    ]
}
