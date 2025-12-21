/**
 * Pre-computed character positions for the People constellation view
 * Positions are normalized 0-100 coordinates, scaled at render time
 */

export type CharacterId = 'samuel' | 'maya' | 'jordan' | 'devon' | 'kai' | 'tess' | 'rohan' | 'silas' | 'marcus' | 'kael' | 'omari'

export interface CharacterNodeData {
  id: CharacterId
  name: string
  fullName: string
  position: { x: number; y: number }
  isMajor: boolean
  color: string // Tailwind color name
  role: string
}

// Layout: Samuel at center hub, majors in inner ring, minors in outer ring
export const CHARACTER_NODES: CharacterNodeData[] = [
  // HUB - Samuel at center (wisdom/mentorship)
  {
    id: 'samuel',
    name: 'Samuel',
    fullName: 'Samuel Washington',
    position: { x: 50, y: 45 },
    isMajor: true,
    color: 'amber',
    role: 'Station Master'
  },

  // INNER RING - Major Characters (12-14 scenes each)
  {
    id: 'maya',
    name: 'Maya',
    fullName: 'Maya Chen',
    position: { x: 50, y: 15 },
    isMajor: true,
    color: 'blue',
    role: 'Tech Innovator'
  },
  {
    id: 'jordan',
    name: 'Jordan',
    fullName: 'Jordan Packard',
    position: { x: 20, y: 60 },
    isMajor: true,
    color: 'purple',
    role: 'Career Navigator'
  },
  {
    id: 'devon',
    name: 'Devon',
    fullName: 'Devon Kumar',
    position: { x: 80, y: 60 },
    isMajor: true,
    color: 'orange',
    role: 'Systems Thinker'
  },

  // OUTER RING - Minor Characters (1-2 scenes each)
  {
    id: 'kai',
    name: 'Kai',
    fullName: 'Kai',
    position: { x: 85, y: 25 },
    isMajor: false,
    color: 'teal',
    role: 'Safety Specialist'
  },
  {
    id: 'tess',
    name: 'Tess',
    fullName: 'Tess',
    position: { x: 15, y: 25 },
    isMajor: false,
    color: 'rose',
    role: 'Education Founder'
  },
  {
    id: 'rohan',
    name: 'Rohan',
    fullName: 'Rohan',
    position: { x: 95, y: 50 },
    isMajor: false,
    color: 'indigo',
    role: 'Deep Tech'
  },
  {
    id: 'silas',
    name: 'Silas',
    fullName: 'Silas',
    position: { x: 5, y: 50 },
    isMajor: false,
    color: 'slate',
    role: 'Crisis Manager'
  },
  {
    id: 'marcus',
    name: 'Marcus',
    fullName: 'Marcus Vance',
    position: { x: 30, y: 85 },
    isMajor: false,
    color: 'cyan',
    role: 'Sonic Architect'
  },
  {
    id: 'kael',
    name: 'Kael',
    fullName: 'Kael Thorne',
    position: { x: 70, y: 85 },
    isMajor: false,
    color: 'emerald',
    role: 'Deep Sea Welder'
  },
  {
    id: 'omari',
    name: 'Omari',
    fullName: 'Omari West',
    position: { x: 50, y: 75 },
    isMajor: false,
    color: 'indigo',
    role: 'Impact Strategist'
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
  ['samuel', 'omari']
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
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-400' }
}
