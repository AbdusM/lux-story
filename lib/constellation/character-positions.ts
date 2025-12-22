/**
 * Pre-computed character positions for the People constellation view
 * Positions are normalized 0-100 coordinates, scaled at render time
 */

export type CharacterId = 'samuel' | 'maya' | 'jordan' | 'devon' | 'kai' | 'tess' | 'rohan' | 'silas' | 'marcus' | 'kael' | 'omari' | 'yaquin'

export interface CharacterNodeData {
  id: CharacterId
  name: string
  fullName: string
  position: { x: number; y: number }
  isMajor: boolean
  color: string // Tailwind color name
  role: string
}

// Layout: Perfect Radial Symmetry (Jobsian Purity)
// Samuel at Center (50, 50)
// 8 Spokes radiating outward
export const CHARACTER_NODES: CharacterNodeData[] = [
  // HUB
  {
    id: 'samuel',
    name: 'Samuel',
    fullName: 'Samuel Washington',
    position: { x: 50, y: 50 },
    isMajor: true,
    color: 'amber',
    role: 'Station Master'
  },

  // RADIATING SPOKES (Clockwise starting from Top)
  {
    id: 'maya',
    name: 'Maya',
    fullName: 'Maya Chen',
    position: { x: 50, y: 15 }, // Top (12 o'clock)
    isMajor: true,
    color: 'blue',
    role: 'Tech Innovator'
  },
  {
    id: 'kai',
    name: 'Kai',
    fullName: 'Kai',
    position: { x: 75, y: 25 }, // Top Right (1:30)
    isMajor: false,
    color: 'teal',
    role: 'Safety Specialist'
  },
  {
    id: 'devon',
    name: 'Devon',
    fullName: 'Devon Kumar',
    position: { x: 85, y: 50 }, // Right (3 o'clock)
    isMajor: true,
    color: 'orange',
    role: 'Systems Thinker'
  },
  {
    id: 'kael',
    name: 'Kael',
    fullName: 'Kael Thorne',
    position: { x: 75, y: 75 }, // Bottom Right (4:30)
    isMajor: false,
    color: 'emerald',
    role: 'Deep Sea Welder'
  },
  {
    id: 'marcus',
    name: 'Marcus',
    fullName: 'Marcus Vance',
    position: { x: 50, y: 85 }, // Bottom (6 o'clock)
    isMajor: false,
    color: 'cyan',
    role: 'Sonic Architect'
  },
  {
    id: 'omari',
    name: 'Omari',
    fullName: 'Omari West',
    position: { x: 25, y: 75 }, // Bottom Left (7:30)
    isMajor: false,
    color: 'indigo',
    role: 'Impact Strategist'
  },
  {
    id: 'jordan',
    name: 'Jordan',
    fullName: 'Jordan Packard',
    position: { x: 15, y: 50 }, // Left (9 o'clock)
    isMajor: true,
    color: 'purple',
    role: 'Career Navigator'
  },
  {
    id: 'tess',
    name: 'Tess',
    fullName: 'Tess',
    position: { x: 25, y: 25 }, // Top Left (10:30)
    isMajor: false,
    color: 'rose',
    role: 'Education Founder'
  },

  // ORBITS (Extra nodes if needed, tucked away or concentric)
  {
    id: 'rohan',
    name: 'Rohan',
    fullName: 'Rohan',
    position: { x: 65, y: 35 }, // Inner Orbit Top-Right
    isMajor: false,
    color: 'indigo',
    role: 'Deep Tech'
  },
  {
    id: 'silas',
    name: 'Silas',
    fullName: 'Silas',
    position: { x: 35, y: 65 }, // Inner Orbit Bottom-Left
    isMajor: false,
    color: 'slate',
    role: 'Crisis Manager'
  },
  // Added Yaquin to complete the inner symmetry (Triangle? or just balanced)
  {
    id: 'yaquin',
    name: 'Yaquin',
    fullName: 'Yaquin',
    position: { x: 35, y: 35 }, // Inner Orbit Top-Left (Balancing Rohan/Silas)
    isMajor: false,
    color: 'sky',
    role: 'Cultural Architect'
  }
]

// Connection lines from Samuel to other characters (rendered when character is met)
export const CHARACTER_CONNECTIONS: [CharacterId, CharacterId][] = [
  ['samuel', 'maya'],
  ['samuel', 'jordan'],
  ['samuel', 'devon'],
  ['samuel', 'kai'],
  ['samuel', 'tess'],
  ['samuel', 'rohan'],
  ['samuel', 'silas'],
  ['samuel', 'marcus'],
  ['samuel', 'kael'],
  ['samuel', 'omari'],
  ['samuel', 'yaquin']
]

// Helper to get character by ID
export function getCharacterById(id: CharacterId): CharacterNodeData | undefined {
  return CHARACTER_NODES.find(c => c.id === id)
}

// Color mapping for Tailwind classes
export const CHARACTER_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-400' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', ring: 'ring-blue-400' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600', ring: 'ring-purple-400' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-600', ring: 'ring-orange-400' },
  teal: { bg: 'bg-teal-500', text: 'text-teal-600', ring: 'ring-teal-400' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-400' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', ring: 'ring-indigo-400' },
  slate: { bg: 'bg-slate-500', text: 'text-slate-600', ring: 'ring-slate-400' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', ring: 'ring-cyan-400' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-400' },
  sky: { bg: 'bg-sky-500', text: 'text-sky-600', ring: 'ring-sky-400' }
}
