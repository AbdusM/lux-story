/**
 * Pattern Resonance Paths
 *
 * IDEA 004: Pattern Resonance Paths
 *
 * Your dominant pattern reveals hidden connections on the constellation.
 * Analytical players see different character relationship lines than Helping players.
 * Creates natural replayability through pattern-divergent discovery.
 *
 * These paths only appear when player reaches threshold in the associated pattern.
 */

import type { PatternType } from '../patterns'
import type { CharacterId } from '../graph-registry'

/**
 * A resonance path - a hidden connection revealed by pattern alignment
 */
export interface ResonancePath {
  /** Unique identifier */
  id: string

  /** The pattern that reveals this path */
  requiredPattern: PatternType

  /** Minimum pattern level to reveal (default: 6 = DEVELOPING threshold) */
  threshold: number

  /** Start character */
  fromCharacterId: CharacterId

  /** End character */
  toCharacterId: CharacterId

  /** Description of why these characters resonate */
  resonanceReason: string

  /** Visual styling */
  style: {
    color: string
    dashArray?: string
    opacity?: number
  }
}

/**
 * Pattern resonance paths - hidden connections revealed by pattern alignment
 */
export const PATTERN_RESONANCE_PATHS: ResonancePath[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ANALYTICAL PATHS - Logic and data connections
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'analytical_maya_rohan',
    requiredPattern: 'analytical',
    threshold: 6,
    fromCharacterId: 'maya',
    toCharacterId: 'rohan',
    resonanceReason: 'Both approach problems through systematic analysis',
    style: { color: '#3B82F6', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'analytical_rohan_nadia',
    requiredPattern: 'analytical',
    threshold: 7,
    fromCharacterId: 'rohan',
    toCharacterId: 'nadia',
    resonanceReason: 'Deep tech meets AI strategy - data speaks to both',
    style: { color: '#3B82F6', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'analytical_maya_quinn',
    requiredPattern: 'analytical',
    threshold: 8,
    fromCharacterId: 'maya',
    toCharacterId: 'quinn',
    resonanceReason: 'Tech innovation and financial modeling share a language',
    style: { color: '#3B82F6', dashArray: '1 3', opacity: 0.6 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPING PATHS - Empathy and service connections
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'helping_marcus_grace',
    requiredPattern: 'helping',
    threshold: 6,
    fromCharacterId: 'marcus',
    toCharacterId: 'grace',
    resonanceReason: 'Healthcare hearts - they see patients, not problems',
    style: { color: '#EC4899', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'helping_grace_asha',
    requiredPattern: 'helping',
    threshold: 7,
    fromCharacterId: 'grace',
    toCharacterId: 'asha',
    resonanceReason: 'Operations and mediation - both smooth the path for others',
    style: { color: '#EC4899', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'helping_asha_isaiah',
    requiredPattern: 'helping',
    threshold: 8,
    fromCharacterId: 'asha',
    toCharacterId: 'isaiah',
    resonanceReason: 'Conflict resolution and nonprofit leadership share a mission',
    style: { color: '#EC4899', dashArray: '1 3', opacity: 0.6 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BUILDING PATHS - Creation and construction connections
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'building_devon_silas',
    requiredPattern: 'building',
    threshold: 6,
    fromCharacterId: 'devon',
    toCharacterId: 'silas',
    resonanceReason: 'Systems thinking meets advanced manufacturing',
    style: { color: '#F59E0B', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'building_silas_alex',
    requiredPattern: 'building',
    threshold: 7,
    fromCharacterId: 'silas',
    toCharacterId: 'alex',
    resonanceReason: 'Making things and moving things - the supply chain of creation',
    style: { color: '#F59E0B', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'building_devon_maya',
    requiredPattern: 'building',
    threshold: 8,
    fromCharacterId: 'devon',
    toCharacterId: 'maya',
    resonanceReason: 'Hardware and software - different materials, same builder spirit',
    style: { color: '#F59E0B', dashArray: '1 3', opacity: 0.6 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPLORING PATHS - Discovery and curiosity connections
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'exploring_elena_zara',
    requiredPattern: 'exploring',
    threshold: 6,
    fromCharacterId: 'elena',
    toCharacterId: 'zara',
    resonanceReason: 'Information science and data ethics - both dig for truth',
    style: { color: '#8B5CF6', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'exploring_zara_lira',
    requiredPattern: 'exploring',
    threshold: 7,
    fromCharacterId: 'zara',
    toCharacterId: 'lira',
    resonanceReason: 'Data art and sound design - sensory explorers',
    style: { color: '#8B5CF6', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'exploring_jordan_elena',
    requiredPattern: 'exploring',
    threshold: 8,
    fromCharacterId: 'jordan',
    toCharacterId: 'elena',
    resonanceReason: 'Career navigation and information architecture - mapping unknowns',
    style: { color: '#8B5CF6', dashArray: '1 3', opacity: 0.6 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATIENCE PATHS - Stillness and wisdom connections
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'patience_tess_yaquin',
    requiredPattern: 'patience',
    threshold: 6,
    fromCharacterId: 'tess',
    toCharacterId: 'yaquin',
    resonanceReason: 'Education founders - growth takes time, they know this',
    style: { color: '#10B981', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'patience_marcus_kai',
    requiredPattern: 'patience',
    threshold: 7,
    fromCharacterId: 'marcus',
    toCharacterId: 'kai',
    resonanceReason: 'Medical care and safety - patience saves lives',
    style: { color: '#10B981', dashArray: '2 2', opacity: 0.7 },
  },
  {
    id: 'patience_tess_isaiah',
    requiredPattern: 'patience',
    threshold: 8,
    fromCharacterId: 'tess',
    toCharacterId: 'isaiah',
    resonanceReason: 'Education and nonprofit - the long game of change',
    style: { color: '#10B981', dashArray: '1 3', opacity: 0.6 },
  },
]

/**
 * Get resonance paths visible to a player based on their pattern levels
 */
export function getVisibleResonancePaths(
  patterns: Record<PatternType, number>
): ResonancePath[] {
  return PATTERN_RESONANCE_PATHS.filter(path =>
    patterns[path.requiredPattern] >= path.threshold
  )
}

/**
 * Get resonance paths for a specific pattern at a specific level
 */
export function getResonancePathsForPattern(
  pattern: PatternType,
  level: number
): ResonancePath[] {
  return PATTERN_RESONANCE_PATHS.filter(path =>
    path.requiredPattern === pattern && path.threshold <= level
  )
}

/**
 * Check if a specific path is visible
 */
export function isPathVisible(
  path: ResonancePath,
  patterns: Record<PatternType, number>
): boolean {
  return patterns[path.requiredPattern] >= path.threshold
}

/**
 * Get the dominant pattern from pattern levels
 */
export function getDominantPattern(
  patterns: Record<PatternType, number>
): PatternType {
  const entries = Object.entries(patterns) as [PatternType, number][]
  const sorted = entries.sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || 'patience'
}
