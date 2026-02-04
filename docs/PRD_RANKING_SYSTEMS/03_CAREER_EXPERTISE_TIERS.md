# Phase 3: Career Expertise Tiers

**PRD ID:** RANK-003
**Priority:** P1 (Core Feature)
**Commits:** 5-7
**Dependencies:** Phase 1 (Core Types)
**Inspired By:** Demon Slayer (Corps Ranks: Mizunoto → Kinoe + Hashira)

---

## INTEGRATION NOTE

**This PRD uses existing trust and skill systems as data sources.**

**Existing systems to reference (DO NOT REPLACE):**
- `lib/constants.ts` - `TRUST_THRESHOLDS`: stranger(0)→bonded(10)
- `lib/trust-derivatives.ts` - `VoiceTone`, trust asymmetry detection
- `lib/skill-combos.ts` - 12 skill combinations with Tier 1/2
- `lib/character-tiers.ts` - Character tier assignments (1-4)
- `lib/loyalty-experience.ts` - 20/20 character loyalty experiences

**This PRD adds:**
- Career domain aggregation across character clusters
- Champion status (requires trust 7+ with 2+ domain characters)
- Domain-specific expertise visualization

---

## Target Outcome

Create a career expertise tier system where players progress from "just exploring" to "ready to lead" in career domains. Uses **existing trust levels** as primary input, with skill combo completion as secondary.

**Success Criteria:**
- [ ] 6 expertise tiers with traditional/meaningful names
- [ ] Per-career-domain tracking (Tech, Healthcare, Business, Creative, Social Impact)
- [ ] "Hashira" equivalent: Career Champions for deep expertise
- [ ] Visible in Career Recommendations UI
- [ ] Samuel recognizes expertise milestones

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Career domains | 5 | Matches character cluster areas |
| Tiers per domain | 6 | Demon Slayer has 10; we simplify |
| Champion threshold | Top tier + conditions | Hashira requires more than just points |
| Display | Evidence-based, not scores | Career exploration, not achievement grinding |

---

## System Design

### 1. Career Domain Definitions

```typescript
// lib/ranking/career-domains.ts

/**
 * Career domains map to character clusters and skill families
 * Inspired by Demon Slayer's corps structure
 */
export type CareerDomain =
  | 'technology'      // Maya, Devon, Rohan, Nadia
  | 'healthcare'      // Marcus, Grace, Kai
  | 'business'        // Quinn, Dante, Alex
  | 'creative'        // Lira, Zara, Asha
  | 'social_impact'   // Tess, Isaiah, Jordan, Elena

/**
 * CAREER_DOMAIN_METADATA: Maps all 20 characters to exactly one career domain.
 *
 * CHARACTER ASSIGNMENTS (all 20 covered):
 * - technology (5): maya, devon, rohan, nadia, silas
 * - healthcare (3): marcus, grace, kai
 * - business (3): quinn, dante, alex
 * - creative (3): lira, zara, yaquin
 * - social_impact (6): tess, isaiah, jordan, elena, asha
 *
 * Excluded from domains: samuel (hub NPC), station_entry, grand_hall, market, deep_station (locations)
 */
export const CAREER_DOMAIN_METADATA: Record<CareerDomain, {
  name: string
  description: string
  coreSkills: string[]
  characters: CharacterId[]
}> = {
  technology: {
    name: 'Technology & Innovation',
    description: 'Building the future through code, systems, and digital solutions',
    coreSkills: ['systems_thinking', 'technical_literacy', 'data_analysis', 'ai_collaboration'],
    characters: ['maya', 'devon', 'rohan', 'nadia', 'silas']  // +silas (Advanced Manufacturing)
  },
  healthcare: {
    name: 'Healthcare & Wellness',
    description: 'Caring for people through medicine, safety, and wellbeing',
    coreSkills: ['empathy', 'attention_to_detail', 'crisis_management', 'ethical_reasoning'],
    characters: ['marcus', 'grace', 'kai']
  },
  business: {
    name: 'Business & Finance',
    description: 'Creating value through commerce, strategy, and operations',
    coreSkills: ['financial_literacy', 'negotiation', 'strategic_thinking', 'leadership'],
    characters: ['quinn', 'dante', 'alex']
  },
  creative: {
    name: 'Creative & Arts',
    description: 'Expressing ideas through design, media, and artistic vision',
    coreSkills: ['creativity', 'communication', 'cultural_awareness', 'storytelling'],
    characters: ['lira', 'zara', 'yaquin']  // +yaquin (EdTech Creator - creative tech), -asha (to social_impact)
  },
  social_impact: {
    name: 'Social Impact & Education',
    description: 'Changing communities through teaching, advocacy, and service',
    coreSkills: ['mentorship', 'community_building', 'research', 'advocacy'],
    characters: ['tess', 'isaiah', 'jordan', 'elena', 'asha']  // +asha (Conflict Resolution/Mediator)
  }
}
```

### 2. Expertise Tier Definitions

```typescript
// lib/ranking/career-expertise.ts

/**
 * Career expertise tiers - Demon Slayer inspired naming
 * Uses journey metaphor for station context
 */
export const CAREER_EXPERTISE_TIERS: RankTier[] = [
  {
    id: 'ce_curious',
    category: 'career_expertise',
    level: 0,
    name: 'Curious',
    threshold: 0,
    description: 'Just beginning to explore this path',
    colorToken: 'slate-400'
  },
  {
    id: 'ce_exploring',
    category: 'career_expertise',
    level: 1,
    name: 'Exploring',
    threshold: 3,
    description: 'Actively investigating what this domain offers',
    colorToken: 'blue-400'
  },
  {
    id: 'ce_apprentice',
    category: 'career_expertise',
    level: 2,
    name: 'Apprentice',
    threshold: 8,
    description: 'Learning the fundamentals with growing confidence',
    colorToken: 'green-400'
  },
  {
    id: 'ce_practitioner',
    category: 'career_expertise',
    level: 3,
    name: 'Practitioner',
    threshold: 15,
    description: 'Capable of real contribution in this field',
    colorToken: 'indigo-400'
  },
  {
    id: 'ce_specialist',
    category: 'career_expertise',
    level: 4,
    name: 'Specialist',
    threshold: 25,
    description: 'Deep expertise recognized by others',
    colorToken: 'purple-400'
  },
  {
    id: 'ce_champion',
    category: 'career_expertise',
    level: 5,
    name: 'Champion',
    threshold: 35,  // Reduced from 40 to be achievable (max ~72 points, realistic ~36)
    description: 'A guiding light for others in this domain',
    colorToken: 'amber-400'
  }
]
```

### 3. Expertise Calculator

```typescript
// lib/ranking/career-expertise-calculator.ts

export interface CareerExpertiseState {
  domains: Record<CareerDomain, DomainExpertise>
  primaryDomain: CareerDomain | null    // Highest expertise
  championDomains: CareerDomain[]       // Domains at Champion tier
  breadth: 'narrow' | 'moderate' | 'broad'  // How many domains explored
}

export interface DomainExpertise {
  domain: CareerDomain
  tierId: string
  tierName: string
  level: number
  points: number
  percentToNext: number
  isChampion: boolean
  evidence: ExpertiseEvidence[]         // Skills demonstrated, characters met
}

export interface ExpertiseEvidence {
  type: 'skill_demonstrated' | 'character_met' | 'arc_completed' | 'trust_built'
  description: string
  timestamp: number
}

/**
 * Calculate expertise from game state
 * Points from: skills demonstrated, characters trusted, arcs completed
 *
 * DETERMINISM: Evidence timestamps derived from gameState events, not Date.now()
 *
 * @param gameState - Current game state (source of truth)
 * @param now - Timestamp for calculations (default: Date.now() for production)
 */
export function calculateCareerExpertise(
  gameState: GameState,
  now: number = Date.now()
): CareerExpertiseState {
  const domains = {} as Record<CareerDomain, DomainExpertise>

  // Import trust threshold constant
  const TRUST_THRESHOLD_FOR_POINTS = TRUST_THRESHOLDS.trusted  // = 6

  for (const domain of Object.keys(CAREER_DOMAIN_METADATA) as CareerDomain[]) {
    const metadata = CAREER_DOMAIN_METADATA[domain]
    let points = 0
    const evidence: ExpertiseEvidence[] = []

    // Points from skills (2 per demonstrated skill)
    for (const skill of metadata.coreSkills) {
      const level = gameState.skillLevels[skill] || 0
      if (level > 0.1) {
        points += Math.floor(level * 10) // Max ~10 points per skill
        evidence.push({
          type: 'skill_demonstrated',
          description: `Demonstrated ${skill}`,
          timestamp: gameState.lastUpdated || now  // Use event timestamp, not wall clock
        })
      }
    }

    // Points from character trust (3 per character at trusted threshold)
    for (const charId of metadata.characters) {
      const charState = gameState.characters.get(charId)
      if (charState && charState.trust >= TRUST_THRESHOLD_FOR_POINTS) {
        points += 3
        evidence.push({
          type: 'trust_built',
          description: `Built trust with ${charId}`,
          timestamp: gameState.lastUpdated || now  // Use event timestamp, not wall clock
        })
      }
    }

    // Points from completed arcs (5 per arc)
    for (const charId of metadata.characters) {
      if (gameState.globalFlags.has(`${charId}_arc_complete`)) {
        points += 5
        evidence.push({
          type: 'arc_completed',
          description: `Completed ${charId}'s arc`,
          timestamp: gameState.lastUpdated || now  // Use event timestamp, not wall clock
        })
      }
    }

    const tier = getTierForPoints('career_expertise', points)
    const progress = calculateProgress('career_expertise', points)

    // Champion requires: Specialist tier + ALL domain characters met + 2+ arcs complete
    const charactersMet = metadata.characters.filter(c =>
      gameState.characters.has(c) && (gameState.characters.get(c)?.trust || 0) > 0
    ).length
    const arcsComplete = metadata.characters.filter(c =>
      gameState.globalFlags.has(`${c}_arc_complete`)
    ).length

    const isChampion = tier.level >= 4 &&
                       charactersMet === metadata.characters.length &&
                       arcsComplete >= 2

    domains[domain] = {
      domain,
      tierId: tier.id,
      tierName: isChampion ? 'Champion' : tier.name,
      level: isChampion ? 5 : tier.level,
      points,
      percentToNext: progress.percent,
      isChampion,
      evidence
    }
  }

  // Determine primary domain
  let primaryDomain: CareerDomain | null = null
  let maxPoints = 0
  for (const [domain, expertise] of Object.entries(domains)) {
    if (expertise.points > maxPoints) {
      maxPoints = expertise.points
      primaryDomain = domain as CareerDomain
    }
  }

  // Find champion domains
  const championDomains = Object.entries(domains)
    .filter(([_, e]) => e.isChampion)
    .map(([d]) => d as CareerDomain)

  // Calculate breadth
  const exploredCount = Object.values(domains).filter(d => d.level >= 1).length
  const breadth = exploredCount <= 1 ? 'narrow' :
                  exploredCount <= 3 ? 'moderate' : 'broad'

  return {
    domains,
    primaryDomain,
    championDomains,
    breadth
  }
}
```

### 4. Champion Recognition (Hashira Equivalent)

```typescript
// lib/ranking/career-champions.ts

/**
 * Career Champions are the "Hashira" of Lux Story
 * Special recognition beyond normal tier progression
 */
export interface ChampionStatus {
  domain: CareerDomain
  title: string           // "Technology Champion"
  earnedAt: number
  mentorCharacter: CharacterId  // Primary mentor in that domain
  specialDialogue: string       // Samuel's recognition
}

/**
 * Champion requirements use TRUST_THRESHOLDS.close (= 8)
 * This is a higher bar than the 'trusted' threshold used for point awards.
 *
 * NOTE: minTrust uses TRUST_THRESHOLDS.close constant (not hardcoded value)
 * to ensure alignment with lib/constants.ts trust system.
 */
export const CHAMPION_REQUIREMENTS: Record<CareerDomain, {
  minTier: number
  requiredCharacters: CharacterId[]
  minArcsComplete: number
  minTrust: number  // Must be TRUST_THRESHOLDS.close = 8
}> = {
  technology: {
    minTier: 4,
    requiredCharacters: ['maya', 'devon'],
    minArcsComplete: 2,
    minTrust: TRUST_THRESHOLDS.close  // = 8 (aligned with lib/constants.ts)
  },
  healthcare: {
    minTier: 4,
    requiredCharacters: ['marcus', 'grace'],
    minArcsComplete: 2,
    minTrust: TRUST_THRESHOLDS.close  // = 8
  },
  business: {
    minTier: 4,
    requiredCharacters: ['quinn', 'dante'],
    minArcsComplete: 2,
    minTrust: TRUST_THRESHOLDS.close  // = 8
  },
  creative: {
    minTier: 4,
    requiredCharacters: ['lira', 'zara'],
    minArcsComplete: 2,
    minTrust: TRUST_THRESHOLDS.close  // = 8
  },
  social_impact: {
    minTier: 4,
    requiredCharacters: ['tess', 'jordan'],
    minArcsComplete: 2,
    minTrust: TRUST_THRESHOLDS.close  // = 8
  }
}

export const SAMUEL_CHAMPION_DIALOGUE: Record<CareerDomain, string> = {
  technology: "The builders of tomorrow recognize one of their own. You're not just learning tech—you're shaping it.",
  healthcare: "Healers and helpers... they see something in you. The kind of person who makes hard choices so others don't have to.",
  business: "Money moves the world, but people move money. You understand that now.",
  creative: "Art is truth told slant, someone said. You've learned to tell your truth.",
  social_impact: "Change doesn't happen in buildings. It happens in conversations like the ones you've had here."
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────┐
│                   GameState                      │
│  (skills, trust per character, completed arcs)  │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│         calculateCareerExpertise()              │
│  - Sum points per domain from skills/trust/arcs │
│  - Check Champion requirements                   │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│            CareerExpertiseState                 │
│  - domains: Record<CareerDomain, DomainExpertise>│
│  - primaryDomain, championDomains, breadth       │
└─────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│    Career Recommendations UI / Journal Tab      │
└─────────────────────────────────────────────────┘
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Skill Tracker | Read skill levels | Input |
| Trust System | Read character trust | Input |
| Arc Completion | Check global flags | Input |
| Career Recommendations UI | Display expertise | Output |
| Samuel Dialogue | Champion recognition | Output |
| Meta-Achievements | Champion triggers | Both |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 3.1 | Define domain metadata | 5 domains with skills/characters | `lib/ranking/career-domains.ts` |
| 3.2 | Define expertise tiers | 6 tiers, evidence-based | `lib/ranking/career-expertise.ts` |
| 3.3 | Implement calculator | Points from skills/trust/arcs | `lib/ranking/career-expertise-calculator.ts` |
| 3.4 | Add Champion logic | Requirements + recognition | `lib/ranking/career-champions.ts` |
| 3.5 | Create expertise badge | Visual component | `components/ranking/CareerExpertiseBadge.tsx` |
| 3.6 | Integrate with Career UI | Show in recommendations | `components/career/CareerRecommendationsView.tsx` |
| 3.7 | Add Samuel Champion dialogue | Recognition moment | `content/samuel-dialogue-graph.ts` |

---

## Tests & Verification

```typescript
describe('Career Expertise System', () => {
  it('calculates domain points from skills', () => {
    const state = createMockGameState({
      skillLevels: { systems_thinking: 0.5, technical_literacy: 0.3 }
    })
    const expertise = calculateCareerExpertise(state)
    expect(expertise.domains.technology.points).toBeGreaterThan(0)
  })

  it('awards Champion status when requirements met', () => {
    const state = createMockGameState({
      skillLevels: { systems_thinking: 1, technical_literacy: 1, data_analysis: 1 },
      characters: new Map([
        ['maya', { trust: 8 }],
        ['devon', { trust: 8 }],
        ['rohan', { trust: 6 }],
        ['nadia', { trust: 6 }]
      ]),
      globalFlags: new Set(['maya_arc_complete', 'devon_arc_complete'])
    })
    const expertise = calculateCareerExpertise(state)
    expect(expertise.domains.technology.isChampion).toBe(true)
  })

  it('identifies primary domain correctly', () => {
    const state = createMockGameState({
      skillLevels: { empathy: 1, crisis_management: 0.8 },
      characters: new Map([['marcus', { trust: 7 }]])
    })
    const expertise = calculateCareerExpertise(state)
    expect(expertise.primaryDomain).toBe('healthcare')
  })
})
```

---

## Rollout & Backout

**Rollout:**
1. Deploy calculator + domain definitions (backend only)
2. Add expertise to Career Recommendations behind flag
3. Enable Samuel Champion dialogue
4. Remove flag after verification

**Backout:**
- Calculator: No visible impact
- UI: Disable flag
- Dialogue: Soft-remove Champion nodes

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `calculateCareerExpertise()` | <5ms |
| Champion check | <1ms |
| Evidence collection | <3ms |
| Expertise badge render | <8ms |

---

## Demon Slayer Design Principles Applied

| Demon Slayer Principle | Lux Story Application |
|-----------------------|----------------------|
| 10 traditional rank names | 6 journey-metaphor tiers |
| Hashira as elite above ranks | Career Champions with extra requirements |
| Kill count determines rank | Skills + Trust + Arcs determine tier |
| Tsuguko (successor) concept | Mentorship evidence in tracking |
| Secretive rank reveal | Expertise revealed through dialogue, not numbers |
