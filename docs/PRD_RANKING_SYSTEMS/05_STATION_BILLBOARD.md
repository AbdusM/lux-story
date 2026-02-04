# Phase 5: Station Billboard

**PRD ID:** RANK-005
**Priority:** P2 (Enhancement)
**Commits:** 3-5
**Dependencies:** Phase 1, Phase 2, Phase 3
**Inspired By:** One Punch Man (Hero Association Classes S/A/B/C, merit points, public rankings)

---

## INTEGRATION NOTE

**This PRD aggregates from existing progression systems.**

**Existing systems as data sources:**
- `lib/orbs.ts` - `OrbBalance.totalEarned`: Primary merit point source
- `lib/character-state.ts` - `GameState.visitedScenes`: Conversation count
- `lib/character-state.ts` - `CharacterState.trust`: Trust totals
- `lib/patterns.ts` - `PlayerPatterns`: Pattern point totals
- `lib/character-state.ts` - `GlobalFlags`: Arc completion flags

**Merit Point Mapping to Existing Data:**
| Merit Source | Existing System | Calculation |
|--------------|-----------------|-------------|
| Conversations | `visitedScenes.size` | 1 point each |
| Trust Built | Sum of all `trust` values | 2× multiplier |
| Patterns | Sum of `PlayerPatterns` | 5× multiplier |
| Arc Completion | Flags ending `_arc_complete` | 15 points each |
| Orbs Earned | `OrbBalance.totalEarned` | 1 point each |

**Note:** Merit is a VIEW over existing data, not new tracking.

---

## Target Outcome

Create a public-facing recognition system where player achievements are displayed on a "Station Billboard" - visible progress markers that other characters reference. Like OPM's hero rankings, this creates social context for player progression.

**Success Criteria:**
- [ ] 4 recognition tiers (Newcomer → Notable → Established → Luminary)
- [ ] Merit point accumulation system
- [ ] Billboard UI component showing current standing
- [ ] NPCs reference billboard standing in dialogue
- [ ] Weekly "ranking update" moment with Samuel

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Tiers | 4 | OPM's S/A/B/C simplified for career context |
| Merit sources | 5 | Conversations, trust, patterns, arcs, discoveries |
| Display | Station-themed | "Station arrivals board" aesthetic |
| Updates | Per-session | Not real-time like OPM, but meaningful moments |

---

## System Design

### 1. Station Standing Tiers

```typescript
// lib/ranking/station-standing.ts

/**
 * Station standing - OPM-inspired public recognition
 * The station's "arrivals board" showing notable travelers
 */
export type StationStandingTier = 'newcomer' | 'notable' | 'established' | 'luminary'

export const STATION_STANDING_TIERS: RankTier[] = [
  {
    id: 'ss_newcomer',
    category: 'station_standing',
    level: 0,
    name: 'Newcomer',
    threshold: 0,
    description: 'Just arrived at the station',
    colorToken: 'slate-400'
  },
  {
    id: 'ss_notable',
    category: 'station_standing',
    level: 1,
    name: 'Notable',
    threshold: 25,
    description: 'The station has noticed your presence',
    colorToken: 'blue-400'
  },
  {
    id: 'ss_established',
    category: 'station_standing',
    level: 2,
    name: 'Established',
    threshold: 75,
    description: 'A recognized figure in the station community',
    colorToken: 'indigo-400'
  },
  {
    id: 'ss_luminary',
    category: 'station_standing',
    level: 3,
    name: 'Luminary',
    threshold: 150,
    description: 'Your light guides others through the station',
    colorToken: 'amber-400'
  }
]
```

### 2. Merit Point Calculator

```typescript
// lib/ranking/merit-calculator.ts

export interface MeritBreakdown {
  conversations: number      // Points from dialogue nodes visited
  trustBuilt: number        // Points from cumulative trust
  patternsRevealed: number  // Points from pattern development
  arcsCompleted: number     // Points from character arcs
  discoveries: number       // Points from knowledge flags
  total: number
}

/**
 * Calculate merit points from game state
 * OPM principle: Merit from action, not just existing
 */
export function calculateMeritPoints(gameState: GameState): MeritBreakdown {
  // Conversations: 1 point per unique node visited
  const conversations = gameState.visitedScenes.size

  // Trust: 2 points per trust level across all characters
  const trustBuilt = Array.from(gameState.characters.values())
    .reduce((sum, char) => sum + (char.trust * 2), 0)

  // Patterns: 5 points per pattern point
  const patternsRevealed = Object.values(gameState.patterns)
    .reduce((sum, val) => sum + (val * 5), 0)

  // Arcs: 15 points per completed arc
  const arcsCompleted = Array.from(gameState.globalFlags)
    .filter(f => f.endsWith('_arc_complete')).length * 15

  // Discoveries: 1 point per knowledge flag
  const discoveries = gameState.globalFlags.size -
    Array.from(gameState.globalFlags).filter(f => f.endsWith('_arc_complete')).length

  return {
    conversations,
    trustBuilt,
    patternsRevealed,
    arcsCompleted,
    discoveries,
    total: conversations + trustBuilt + patternsRevealed + arcsCompleted + discoveries
  }
}

/**
 * Get current station standing from merit points
 */
export function getStationStanding(meritPoints: number): {
  tier: StationStandingTier
  tierName: string
  pointsToNext: number
  percentToNext: number
} {
  const tier = getTierForPoints('station_standing', meritPoints)
  const progress = calculateProgress('station_standing', meritPoints)

  return {
    tier: tier.id.replace('ss_', '') as StationStandingTier,
    tierName: tier.name,
    pointsToNext: progress.toNext,
    percentToNext: progress.percent
  }
}
```

### 3. Billboard State

```typescript
// lib/ranking/billboard-state.ts

export interface BillboardEntry {
  category: string
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'stable'
}

export interface BillboardState {
  standing: StationStandingTier
  standingName: string
  meritPoints: number
  meritBreakdown: MeritBreakdown
  highlights: BillboardEntry[]
  lastUpdated: number
}

/**
 * Generate billboard display data
 *
 * @param gameState - Current game state (source of truth)
 * @param now - Timestamp for lastUpdated (default: Date.now() for production)
 */
export function generateBillboardState(
  gameState: GameState,
  now: number = Date.now()
): BillboardState {
  const meritBreakdown = calculateMeritPoints(gameState)
  const standing = getStationStanding(meritBreakdown.total)

  // Generate highlights (notable achievements)
  const highlights: BillboardEntry[] = []

  // Add most-developed pattern
  const patterns = Object.entries(gameState.patterns)
  const topPattern = patterns.sort((a, b) => b[1] - a[1])[0]
  if (topPattern && topPattern[1] > 0) {
    highlights.push({
      category: 'Pattern',
      label: `${topPattern[0].charAt(0).toUpperCase() + topPattern[0].slice(1)} Tendency`,
      value: topPattern[1]
    })
  }

  // Add deepest relationship
  const characters = Array.from(gameState.characters.entries())
  const topRelationship = characters.sort((a, b) => b[1].trust - a[1].trust)[0]
  if (topRelationship && topRelationship[1].trust > 3) {
    highlights.push({
      category: 'Connection',
      label: `Bond with ${topRelationship[0]}`,
      value: `Trust ${topRelationship[1].trust}`
    })
  }

  // Add completed arcs count
  const arcsComplete = Array.from(gameState.globalFlags)
    .filter(f => f.endsWith('_arc_complete')).length
  if (arcsComplete > 0) {
    highlights.push({
      category: 'Journeys',
      label: 'Completed Arcs',
      value: arcsComplete
    })
  }

  return {
    standing: standing.tier,
    standingName: standing.tierName,
    meritPoints: meritBreakdown.total,
    meritBreakdown,
    highlights,
    lastUpdated: now  // Use passed timestamp for determinism
  }
}
```

---

## UI Components

### 4. Station Billboard Display

```typescript
// components/ranking/StationBillboard.tsx

interface StationBillboardProps {
  state: BillboardState
  expanded?: boolean
}

export function StationBillboard({ state, expanded = false }: StationBillboardProps) {
  const standingTier = STATION_STANDING_TIERS.find(t => t.id === `ss_${state.standing}`)

  return (
    <div className="bg-slate-900/80 border border-amber-900/30 rounded-lg overflow-hidden">
      {/* Header - Arrivals Board Style */}
      <div className="bg-slate-800/50 px-4 py-2 border-b border-amber-900/20">
        <h3 className="text-xs uppercase tracking-wider text-amber-400/70">
          Station Bulletin
        </h3>
      </div>

      {/* Standing Display */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-slate-400">Current Standing</p>
            <p className={cn("text-lg font-medium", `text-${standingTier?.colorToken}`)}>
              {state.standingName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{state.meritPoints}</p>
            <p className="text-xs text-slate-500">merit points</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {state.standing !== 'luminary' && (
          <div className="mb-4">
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full", `bg-${standingTier?.colorToken}`)}
                initial={{ width: 0 }}
                animate={{ width: `${getStationStanding(state.meritPoints).percentToNext}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Highlights */}
        {expanded && state.highlights.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-slate-700">
            {state.highlights.map((highlight, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-400">{highlight.label}</span>
                <span className="text-white">{highlight.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

### 5. Merit Breakdown Tooltip

```typescript
// components/ranking/MeritBreakdown.tsx

interface MeritBreakdownProps {
  breakdown: MeritBreakdown
}

export function MeritBreakdownTooltip({ breakdown }: MeritBreakdownProps) {
  const sources = [
    { label: 'Conversations', value: breakdown.conversations, icon: '💬' },
    { label: 'Trust Built', value: breakdown.trustBuilt, icon: '🤝' },
    { label: 'Patterns Revealed', value: breakdown.patternsRevealed, icon: '✨' },
    { label: 'Arcs Completed', value: breakdown.arcsCompleted, icon: '🏆' },
    { label: 'Discoveries', value: breakdown.discoveries, icon: '🔍' },
  ]

  return (
    <div className="p-3 space-y-2">
      {sources.map(source => (
        <div key={source.label} className="flex justify-between gap-4 text-sm">
          <span className="text-slate-400">
            {source.icon} {source.label}
          </span>
          <span className="text-white font-medium">+{source.value}</span>
        </div>
      ))}
      <div className="pt-2 border-t border-slate-700 flex justify-between font-medium">
        <span className="text-slate-300">Total</span>
        <span className="text-amber-400">{breakdown.total}</span>
      </div>
    </div>
  )
}
```

---

## NPC Integration

### 6. Standing-Aware Dialogue

```typescript
// lib/ranking/standing-dialogue.ts

/**
 * Get Samuel's commentary on player standing
 */
export const SAMUEL_STANDING_COMMENTARY: Record<StationStandingTier, string[]> = {
  newcomer: [
    "The station is still learning your face. Give it time.",
    "Every journey begins with a single conversation."
  ],
  notable: [
    "Word spreads in a station like this. People are noticing you.",
    "You're becoming part of the rhythm here."
  ],
  established: [
    "The regulars nod when you pass. That means something.",
    "You've earned your place on the board. Don't let it go to your head."
  ],
  luminary: [
    "New arrivals ask about you now. How does that feel?",
    "Some say you could run this place. I just smile."
  ]
}

/**
 * Get NPC greeting variation based on player standing
 */
export function getStandingAwareGreeting(
  characterId: CharacterId,
  standing: StationStandingTier
): string | null {
  // Characters acknowledge higher standing players differently
  if (standing === 'luminary') {
    return `I've heard about you from others at the station.`
  }
  if (standing === 'established') {
    return `Good to see a familiar face around here.`
  }
  return null // Use default greeting
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Pattern Mastery | Merit point contribution | Input |
| Career Expertise | Merit point contribution | Input |
| Trust System | Merit point contribution | Input |
| Samuel Dialogue | Standing commentary | Output |
| NPC Greetings | Standing-aware variations | Output |
| Journal UI | Billboard display | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 5.1 | Define standing tiers | 4 tiers with thresholds | `lib/ranking/station-standing.ts` |
| 5.2 | Implement merit calculator | 5 merit sources | `lib/ranking/merit-calculator.ts` |
| 5.3 | Create billboard state | Aggregates all merit data | `lib/ranking/billboard-state.ts` |
| 5.4 | Build billboard component | Arrivals board aesthetic | `components/ranking/StationBillboard.tsx` |
| 5.5 | Add Samuel commentary | Standing-based dialogue | `lib/ranking/standing-dialogue.ts` |

---

## Tests & Verification

```typescript
describe('Station Billboard', () => {
  describe('Merit Calculator', () => {
    it('calculates points from conversations', () => {
      const state = createMockGameState({ visitedScenes: new Set(['a', 'b', 'c']) })
      const merit = calculateMeritPoints(state)
      expect(merit.conversations).toBe(3)
    })

    it('calculates points from trust', () => {
      const state = createMockGameState({
        characters: new Map([['maya', { trust: 5 }], ['marcus', { trust: 3 }]])
      })
      const merit = calculateMeritPoints(state)
      expect(merit.trustBuilt).toBe(16) // (5+3) * 2
    })
  })

  describe('Standing Calculation', () => {
    it('returns newcomer for 0 points', () => {
      const standing = getStationStanding(0)
      expect(standing.tier).toBe('newcomer')
    })

    it('returns luminary for 150+ points', () => {
      const standing = getStationStanding(200)
      expect(standing.tier).toBe('luminary')
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `calculateMeritPoints()` | <3ms |
| `generateBillboardState()` | <5ms |
| Billboard render | <8ms |
| Merit breakdown tooltip | <5ms |

---

## OPM Design Principles Applied

| OPM Principle | Lux Story Application |
|---------------|----------------------|
| Public rankings (S/A/B/C) | Station standing tiers (4 levels) |
| Merit points accumulation | 5 merit sources tracked |
| Rankings update ceremony | Session-based billboard updates |
| Heroes reference each other's rank | NPCs acknowledge standing |
| Satirical bureaucracy | "Station Bulletin" aesthetic |
