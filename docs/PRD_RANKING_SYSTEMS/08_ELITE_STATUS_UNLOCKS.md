# Phase 8: Elite Status Unlocks

**PRD ID:** RANK-008
**Priority:** P2 (Enhancement)
**Commits:** 3-5
**Dependencies:** Phase 1, Phase 3
**Inspired By:** Bleach (Gotei 13 Captain requirements: Bankai mastery, peer nomination, combat trial)

---

## INTEGRATION NOTE

**This PRD uses existing systems for requirement checking.**

**Existing systems as requirement sources:**
- `lib/constants.ts` - `TRUST_THRESHOLDS`: Trust 7+ = "advocate" level
- `lib/character-state.ts` - `GlobalFlags`: `*_vulnerability_revealed`, `*_arc_complete`
- `lib/loyalty-experience.ts` - 20/20 characters have loyalty experiences
- `lib/character-tiers.ts` - Character tier assignments (1-4)
- `lib/skill-combos.ts` - Combo completion as requirement

**Elite Requirement Mapping:**
| PRD Requirement | Existing System | Check |
|-----------------|-----------------|-------|
| Specialist expertise | Career domains (Phase 3) | `level >= 4` |
| Character trust | `CharacterState.trust` | `trust >= 7` |
| Vulnerability arc | `GlobalFlags` | `has('*_vulnerability_revealed')` |
| Assessment complete | `GlobalFlags` | `has('crossroads_trial_complete')` |
| Loyalty experience | `lib/loyalty-experience.ts` | Phase completion |

**Champion Requirements (Existing):**
Per `lib/ranking/career-champions.ts` (Phase 3), Champion already requires:
- minTier: 4 (Specialist)
- minTrust: 7 (Advocate)
- minArcsComplete: 2

Elite Status extends Champion with additional flags.

---

## Target Outcome

Create special designations for players who achieve mastery in specific domains, with tangible benefits. Like Bleach's Captain positions requiring Bankai mastery, elite status requires demonstrated excellence and unlocks exclusive content.

**Success Criteria:**
- [ ] 5 elite designations (one per career domain)
- [ ] Multi-requirement unlock criteria
- [ ] Visible elite badge on profile
- [ ] Exclusive dialogue paths with elite status
- [ ] Samuel formal recognition ceremony

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Elite designations | 5 | Maps to 5 career domains |
| Requirements per elite | 3-4 | Multiple proof points like Bankai+nomination+trial |
| Benefits | Content access, not power | Career exploration, not power fantasy |
| Ceremony | Single moment | Special but not repetitive |

---

## System Design

### 1. Elite Designation Definitions

```typescript
// lib/ranking/elite-status.ts

/**
 * Elite designations - Bleach Captain inspired
 * Special recognition beyond normal progression
 */
export type EliteDesignation =
  | 'tech_pioneer'       // Technology domain elite
  | 'healing_sentinel'   // Healthcare domain elite
  | 'commerce_architect' // Business domain elite
  | 'creative_luminary'  // Creative domain elite
  | 'change_catalyst'    // Social impact domain elite

export interface EliteStatus {
  designation: EliteDesignation
  domain: CareerDomain
  name: string
  description: string
  requirements: EliteRequirement[]
  benefits: EliteBenefit[]
  ceremonyDialogue: string
}

export interface EliteRequirement {
  id: string
  type: 'expertise' | 'trust' | 'arc' | 'flag' | 'assessment'
  description: string
  check: (gameState: GameState, expertise: CareerExpertiseState) => boolean
}

export interface EliteBenefit {
  type: 'dialogue' | 'knowledge' | 'connection' | 'visual'
  description: string
  unlockKey: string
}
```

### 2. Elite Status Registry

```typescript
// lib/ranking/elite-registry.ts

export const ELITE_STATUSES: Record<EliteDesignation, EliteStatus> = {
  tech_pioneer: {
    designation: 'tech_pioneer',
    domain: 'technology',
    name: 'Tech Pioneer',
    description: 'A recognized leader in technological innovation',
    requirements: [
      {
        id: 'tp_expertise',
        type: 'expertise',
        description: 'Reach Specialist level in Technology',
        check: (_, expertise) => expertise.domains.technology.level >= 4
      },
      {
        id: 'tp_trust',
        type: 'trust',
        description: 'Build deep trust with Maya and Devon (Trust 7+)',
        check: (state) => {
          const maya = state.characters.get('maya')
          const devon = state.characters.get('devon')
          return (maya?.trust ?? 0) >= 7 && (devon?.trust ?? 0) >= 7
        }
      },
      {
        id: 'tp_arc',
        type: 'arc',
        description: 'Complete Maya\'s vulnerability arc',
        check: (state) => state.globalFlags.has('maya_vulnerability_revealed')
      },
      {
        id: 'tp_assessment',
        type: 'assessment',
        description: 'Pass the Crossroads Trial',
        check: (state) => state.globalFlags.has('crossroads_trial_complete')
      }
    ],
    benefits: [
      {
        type: 'dialogue',
        description: 'Exclusive dialogue with tech characters',
        unlockKey: 'elite_tech_dialogue'
      },
      {
        type: 'knowledge',
        description: 'Access to advanced tech career paths',
        unlockKey: 'elite_tech_careers'
      },
      {
        type: 'connection',
        description: 'Introduction to Nadia (AI Strategist)',
        unlockKey: 'nadia_elite_intro'
      }
    ],
    ceremonyDialogue: "The builders of tomorrow have chosen you as one of their own. Maya speaks highly of your potential. Devon trusts your judgment. In the grand tradition of the station, I name you Tech Pioneer."
  },

  healing_sentinel: {
    designation: 'healing_sentinel',
    domain: 'healthcare',
    name: 'Healing Sentinel',
    description: 'A guardian of health and wellbeing',
    requirements: [
      {
        id: 'hs_expertise',
        type: 'expertise',
        description: 'Reach Specialist level in Healthcare',
        check: (_, expertise) => expertise.domains.healthcare.level >= 4
      },
      {
        id: 'hs_trust',
        type: 'trust',
        description: 'Build deep trust with Marcus and Grace (Trust 7+)',
        check: (state) => {
          const marcus = state.characters.get('marcus')
          const grace = state.characters.get('grace')
          return (marcus?.trust ?? 0) >= 7 && (grace?.trust ?? 0) >= 7
        }
      },
      {
        id: 'hs_arc',
        type: 'arc',
        description: 'Complete Marcus\'s vulnerability arc',
        check: (state) => state.globalFlags.has('marcus_vulnerability_revealed')
      },
      {
        id: 'hs_simulation',
        type: 'flag',
        description: 'Navigate a healthcare crisis simulation',
        check: (state) => state.globalFlags.has('healthcare_simulation_complete')
      }
    ],
    benefits: [
      {
        type: 'dialogue',
        description: 'Exclusive dialogue with healthcare characters',
        unlockKey: 'elite_healthcare_dialogue'
      },
      {
        type: 'knowledge',
        description: 'Access to advanced healthcare career paths',
        unlockKey: 'elite_healthcare_careers'
      },
      {
        type: 'visual',
        description: 'Healing Sentinel badge on profile',
        unlockKey: 'healing_sentinel_badge'
      }
    ],
    ceremonyDialogue: "Those who heal carry a special burden. Marcus has seen something in you—a steadiness in crisis, a heart that stays calm when others panic. I name you Healing Sentinel."
  },

  commerce_architect: {
    designation: 'commerce_architect',
    domain: 'business',
    name: 'Commerce Architect',
    description: 'A strategist of value and opportunity',
    requirements: [
      {
        id: 'ca_expertise',
        type: 'expertise',
        description: 'Reach Specialist level in Business',
        check: (_, expertise) => expertise.domains.business.level >= 4
      },
      {
        id: 'ca_trust',
        type: 'trust',
        description: 'Build deep trust with Quinn and Dante (Trust 7+)',
        check: (state) => {
          const quinn = state.characters.get('quinn')
          const dante = state.characters.get('dante')
          return (quinn?.trust ?? 0) >= 7 && (dante?.trust ?? 0) >= 7
        }
      },
      {
        id: 'ca_arc',
        type: 'arc',
        description: 'Complete Quinn\'s vulnerability arc',
        check: (state) => state.globalFlags.has('quinn_vulnerability_revealed')
      },
      {
        id: 'ca_breadth',
        type: 'flag',
        description: 'Explore connections between business and another domain',
        check: (state) => state.globalFlags.has('cross_domain_business')
      }
    ],
    benefits: [
      {
        type: 'dialogue',
        description: 'Exclusive dialogue with business characters',
        unlockKey: 'elite_business_dialogue'
      },
      {
        type: 'knowledge',
        description: 'Access to advanced business career paths',
        unlockKey: 'elite_business_careers'
      },
      {
        type: 'connection',
        description: 'Access to Alex\'s logistics network insights',
        unlockKey: 'alex_elite_insights'
      }
    ],
    ceremonyDialogue: "Value isn't just about money—it's about seeing what others need before they know it themselves. Quinn and Dante both vouch for your vision. I name you Commerce Architect."
  },

  creative_luminary: {
    designation: 'creative_luminary',
    domain: 'creative',
    name: 'Creative Luminary',
    description: 'A visionary who shapes meaning through art',
    requirements: [
      {
        id: 'cl_expertise',
        type: 'expertise',
        description: 'Reach Specialist level in Creative',
        check: (_, expertise) => expertise.domains.creative.level >= 4
      },
      {
        id: 'cl_trust',
        type: 'trust',
        description: 'Build deep trust with Lira and Zara (Trust 7+)',
        check: (state) => {
          const lira = state.characters.get('lira')
          const zara = state.characters.get('zara')
          return (lira?.trust ?? 0) >= 7 && (zara?.trust ?? 0) >= 7
        }
      },
      {
        id: 'cl_arc',
        type: 'arc',
        description: 'Complete Zara\'s vulnerability arc',
        check: (state) => state.globalFlags.has('zara_vulnerability_revealed')
      },
      {
        id: 'cl_expression',
        type: 'flag',
        description: 'Express a personal creative vision',
        check: (state) => state.globalFlags.has('creative_vision_expressed')
      }
    ],
    benefits: [
      {
        type: 'dialogue',
        description: 'Exclusive dialogue with creative characters',
        unlockKey: 'elite_creative_dialogue'
      },
      {
        type: 'knowledge',
        description: 'Access to advanced creative career paths',
        unlockKey: 'elite_creative_careers'
      },
      {
        type: 'visual',
        description: 'Creative Luminary constellation pattern',
        unlockKey: 'creative_luminary_constellation'
      }
    ],
    ceremonyDialogue: "Art is truth told slant. Zara sees in you what she saw in herself—the courage to create even when creation is painful. Lira hears music in your choices. I name you Creative Luminary."
  },

  change_catalyst: {
    designation: 'change_catalyst',
    domain: 'social_impact',
    name: 'Change Catalyst',
    description: 'A force for transformation in communities',
    requirements: [
      {
        id: 'cc_expertise',
        type: 'expertise',
        description: 'Reach Specialist level in Social Impact',
        check: (_, expertise) => expertise.domains.social_impact.level >= 4
      },
      {
        id: 'cc_trust',
        type: 'trust',
        description: 'Build deep trust with Tess and Jordan (Trust 7+)',
        check: (state) => {
          const tess = state.characters.get('tess')
          const jordan = state.characters.get('jordan')
          return (tess?.trust ?? 0) >= 7 && (jordan?.trust ?? 0) >= 7
        }
      },
      {
        id: 'cc_arc',
        type: 'arc',
        description: 'Complete Tess\'s vulnerability arc',
        check: (state) => state.globalFlags.has('tess_vulnerability_revealed')
      },
      {
        id: 'cc_impact',
        type: 'flag',
        description: 'Make a meaningful choice that affects others',
        check: (state) => state.globalFlags.has('community_impact_made')
      }
    ],
    benefits: [
      {
        type: 'dialogue',
        description: 'Exclusive dialogue with social impact characters',
        unlockKey: 'elite_social_dialogue'
      },
      {
        type: 'knowledge',
        description: 'Access to advanced social impact career paths',
        unlockKey: 'elite_social_careers'
      },
      {
        type: 'connection',
        description: 'Introduction to Isaiah\'s network',
        unlockKey: 'isaiah_elite_network'
      }
    ],
    ceremonyDialogue: "Change doesn't happen in buildings—it happens in conversations like the ones you've had here. Tess believes in your vision. Jordan trusts your heart. I name you Change Catalyst."
  }
}
```

### 3. Elite Status Calculator

```typescript
// lib/ranking/elite-calculator.ts

export interface EliteStatusState {
  unlockedDesignations: EliteDesignation[]
  availableDesignations: EliteDesignation[]  // Requirements met
  progressByDesignation: Record<EliteDesignation, EliteProgress>
  activeElite: EliteDesignation | null  // Primary displayed
}

export interface EliteProgress {
  designation: EliteDesignation
  requirementsMet: number
  totalRequirements: number
  metRequirements: string[]  // IDs of met requirements
  unmetRequirements: string[]  // IDs of unmet requirements
  percentComplete: number
}

/**
 * Calculate elite status progress for all designations
 */
export function calculateEliteStatus(
  gameState: GameState,
  expertise: CareerExpertiseState
): EliteStatusState {
  const progressByDesignation = {} as Record<EliteDesignation, EliteProgress>
  const availableDesignations: EliteDesignation[] = []
  const unlockedDesignations: EliteDesignation[] = []

  for (const [designation, status] of Object.entries(ELITE_STATUSES)) {
    const metRequirements: string[] = []
    const unmetRequirements: string[] = []

    for (const req of status.requirements) {
      if (req.check(gameState, expertise)) {
        metRequirements.push(req.id)
      } else {
        unmetRequirements.push(req.id)
      }
    }

    const progress: EliteProgress = {
      designation: designation as EliteDesignation,
      requirementsMet: metRequirements.length,
      totalRequirements: status.requirements.length,
      metRequirements,
      unmetRequirements,
      percentComplete: (metRequirements.length / status.requirements.length) * 100
    }

    progressByDesignation[designation as EliteDesignation] = progress

    if (metRequirements.length === status.requirements.length) {
      availableDesignations.push(designation as EliteDesignation)
    }

    // Check if already unlocked (ceremony completed)
    if (gameState.globalFlags.has(`elite_${designation}_unlocked`)) {
      unlockedDesignations.push(designation as EliteDesignation)
    }
  }

  return {
    unlockedDesignations,
    availableDesignations,
    progressByDesignation,
    activeElite: unlockedDesignations[0] ?? null
  }
}

/**
 * Check if a specific elite dialogue is available
 */
export function isEliteDialogueAvailable(
  eliteStatus: EliteStatusState,
  dialogueKey: string
): boolean {
  for (const designation of eliteStatus.unlockedDesignations) {
    const status = ELITE_STATUSES[designation]
    for (const benefit of status.benefits) {
      if (benefit.type === 'dialogue' && benefit.unlockKey === dialogueKey) {
        return true
      }
    }
  }
  return false
}
```

---

## UI Components

### 4. Elite Status Badge

```typescript
// components/ranking/EliteStatusBadge.tsx

interface EliteStatusBadgeProps {
  designation: EliteDesignation
  size?: 'sm' | 'md' | 'lg'
}

const ELITE_COLORS: Record<EliteDesignation, string> = {
  tech_pioneer: 'from-blue-500 to-cyan-500',
  healing_sentinel: 'from-green-500 to-emerald-500',
  commerce_architect: 'from-amber-500 to-yellow-500',
  creative_luminary: 'from-purple-500 to-pink-500',
  change_catalyst: 'from-red-500 to-orange-500'
}

export function EliteStatusBadge({ designation, size = 'md' }: EliteStatusBadgeProps) {
  const status = ELITE_STATUSES[designation]
  const colorGradient = ELITE_COLORS[designation]

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium text-white",
        "bg-gradient-to-r",
        colorGradient,
        sizeClasses[size]
      )}
    >
      <span className="opacity-80">✦</span>
      <span>{status.name}</span>
    </div>
  )
}
```

### 5. Elite Progress Card

```typescript
// components/ranking/EliteProgressCard.tsx

interface EliteProgressCardProps {
  designation: EliteDesignation
  progress: EliteProgress
  onCeremony?: () => void  // Available when all requirements met
}

export function EliteProgressCard({
  designation,
  progress,
  onCeremony
}: EliteProgressCardProps) {
  const status = ELITE_STATUSES[designation]
  const isComplete = progress.percentComplete === 100

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      isComplete
        ? "bg-amber-900/20 border-amber-400/30"
        : "bg-slate-800/50 border-slate-700"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-white">{status.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{status.domain}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-white">
            {progress.requirementsMet}/{progress.totalRequirements}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-300 mb-4">{status.description}</p>

      {/* Requirements checklist */}
      <div className="space-y-2 mb-4">
        {status.requirements.map(req => {
          const isMet = progress.metRequirements.includes(req.id)
          return (
            <div key={req.id} className="flex items-start gap-2">
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                isMet ? "bg-green-500/20 text-green-400" : "bg-slate-700"
              )}>
                {isMet && <Check className="w-3 h-3" />}
              </div>
              <span className={cn(
                "text-sm",
                isMet ? "text-slate-300" : "text-slate-500"
              )}>
                {req.description}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-700 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentComplete}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Ceremony button when complete */}
      {isComplete && onCeremony && (
        <Button
          onClick={onCeremony}
          className="w-full bg-amber-600 hover:bg-amber-500"
        >
          Begin Recognition Ceremony
        </Button>
      )}

      {/* Benefits preview */}
      {!isComplete && (
        <div className="pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-2">Unlocks:</p>
          <div className="flex flex-wrap gap-2">
            {status.benefits.map((benefit, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400"
              >
                {benefit.description}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Career Expertise | Specialist requirement | Input |
| Trust System | Character trust requirements | Input |
| Vulnerability Arcs | Arc completion requirement | Input |
| Assessment Arc | Trial completion requirement | Input |
| Dialogue System | Elite-gated content | Output |
| Samuel Dialogue | Recognition ceremony | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 8.1 | Define elite types | 5 designations with requirements | `lib/ranking/elite-status.ts` |
| 8.2 | Create status registry | All requirements + benefits | `lib/ranking/elite-registry.ts` |
| 8.3 | Implement calculator | Progress tracking | `lib/ranking/elite-calculator.ts` |
| 8.4 | Create badge component | Visual elite indicator | `components/ranking/EliteStatusBadge.tsx` |
| 8.5 | Add progress card | Requirements checklist | `components/ranking/EliteProgressCard.tsx` |

---

## Tests & Verification

```typescript
describe('Elite Status System', () => {
  describe('Requirement Checking', () => {
    it('detects met expertise requirement', () => {
      const expertise = createMockExpertise({ technology: { level: 4 } })
      const req = ELITE_STATUSES.tech_pioneer.requirements[0]
      expect(req.check(createMockGameState(), expertise)).toBe(true)
    })

    it('detects unmet trust requirement', () => {
      const state = createMockGameState({
        characters: new Map([['maya', { trust: 5 }]])  // Below 7
      })
      const req = ELITE_STATUSES.tech_pioneer.requirements[1]
      expect(req.check(state, createMockExpertise())).toBe(false)
    })
  })

  describe('Progress Calculation', () => {
    it('calculates correct percentage', () => {
      const status = calculateEliteStatus(
        createMockGameState({
          characters: new Map([['maya', { trust: 8 }], ['devon', { trust: 7 }]]),
          globalFlags: new Set(['maya_vulnerability_revealed'])
        }),
        createMockExpertise({ technology: { level: 4 } })
      )
      // 3 of 4 requirements met for tech_pioneer
      expect(status.progressByDesignation.tech_pioneer.percentComplete).toBe(75)
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `calculateEliteStatus()` | <5ms |
| `isEliteDialogueAvailable()` | <1ms |
| Badge render | <5ms |
| Progress card render | <8ms |

---

## Bleach Captain Principles Applied

| Bleach Principle | Lux Story Application |
|------------------|----------------------|
| Bankai mastery required | Specialist expertise required |
| Captain nomination by peers | Character trust requirements |
| Combat trial | Assessment completion |
| Division specialization | Domain-specific designations |
| Captain-exclusive techniques | Elite-exclusive dialogue |
| Formal ceremony | Samuel recognition ceremony |
