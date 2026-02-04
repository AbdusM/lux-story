# Phase 11: Samuel's Ceremonies

**PRD ID:** RANK-011
**Priority:** P2 (Enhancement)
**Commits:** 3-4
**Dependencies:** Phase 1, Phase 2, Phase 3, Phase 8
**Inspired By:** Original (combining anime rank reveal moments with Samuel's mentor role)

---

## INTEGRATION NOTE

**This PRD triggers ceremonies at EXISTING progression thresholds.**

**Existing trigger sources:**
- `lib/orbs.ts` - `ORB_TIERS`: Ceremonies at tier transitions (10, 30, 60, 100 orbs)
- `lib/patterns.ts` - `PATTERN_THRESHOLDS`: EMERGING=3, DEVELOPING=6, FLOURISHING=9
- `lib/character-state.ts` - `GlobalFlags`: Arc completion, elite unlock flags

**⚠️ CRITICAL: Milestone Celebrations ALREADY EXIST (lib/milestone-celebrations.ts)**
```typescript
// 9 celebration types ALREADY TRIGGERING at these thresholds:
// first_meeting, trust_milestone (5, 10), pattern_emerging (3),
// pattern_developing (6), pattern_flourishing (9), arc_complete,
// achievement, full_trust, identity_formed

// Celebrations already fire at the SAME thresholds ceremonies would use!
```

**⚠️ CRITICAL: IdentityCeremony Component ALREADY EXISTS (components/IdentityCeremony.tsx)**
- Full-screen ceremony presentation
- Pattern internalization dialogue
- Particle effects and animations
- Player response tracking

**Implementation Strategy:**
1. EXTEND existing `IdentityCeremony` component, DO NOT create new `CeremonyPresentation.tsx`
2. ADD Samuel dialogue content to existing celebration triggers
3. USE existing milestone detection, DO NOT recreate trigger logic

**Ceremony-to-Threshold Mapping:**
| Ceremony | Existing Trigger | Threshold |
|----------|------------------|-----------|
| ceremony_passenger | OrbTier = 'emerging' | 10 orbs |
| ceremony_regular | OrbTier = 'developing' | 30 orbs |
| ceremony_conductor | OrbTier = 'flourishing' | 60 orbs |
| ceremony_stationmaster | OrbTier = 'mastered' | 100 orbs |
| ceremony_elite_* | GlobalFlag | `elite_*_unlocked` |

**Existing Samuel Dialogue System:**
Ceremonies use the same dialogue format as `content/samuel-dialogue-graph.ts`:
- `DialogueNode` with `content`, `choices`
- Pattern tracking via `choice.patterns`
- State mutations via `onEnter`, `addKnowledgeFlags`

**Flag Convention:**
```typescript
// Ceremonies set flags in existing GlobalFlags
'ceremony_passenger_complete'  // Not new schema, uses existing Set
```

**This PRD adds (CONTENT ONLY):**
- Samuel spoken dialogue for each ceremony type
- Extended presentation options for IdentityCeremony
- Ceremony history tracking in Journal

**This PRD does NOT add:**
- New trigger infrastructure (use milestone-celebrations.ts)
- New ceremony component (extend IdentityCeremony.tsx)
- New threshold calculations (use existing orb/pattern systems)

---

## Target Outcome

Create memorable recognition moments where Samuel formally acknowledges player progression. These ceremonies serve as emotional anchors in the player's journey, transforming invisible progression into visible narrative moments.

**Success Criteria:**
- [ ] 5 ceremony types for different progressions
- [ ] Unique dialogue for each ceremony
- [ ] Visual presentation distinct from normal dialogue
- [ ] Ceremonies trigger at appropriate moments
- [ ] Player can view ceremony history in Journal

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Ceremony types | 5 | Cover major progression systems |
| Duration | 30-60 seconds | Impactful but not tedious |
| Frequency | Max 1 per session | Special, not routine |
| Interruptible | Yes | Player agency preserved |

---

## System Design

### 1. Ceremony Types

```typescript
// lib/ranking/ceremonies.ts

/**
 * Ceremony types - recognition moments delivered by Samuel
 * Each maps to a specific progression system
 */
export type CeremonyType =
  | 'rank_promotion'       // Pattern mastery tier up
  | 'expertise_milestone'  // Career expertise level
  | 'elite_recognition'    // Elite status unlock
  | 'star_award'           // Skill star earned
  | 'assessment_complete'  // Assessment arc finished

export interface Ceremony {
  id: string
  type: CeremonyType
  trigger: CeremonyTrigger
  presentation: CeremonyPresentation
  dialogue: CeremonyDialogue
  rewards?: CeremonyReward
}

export interface CeremonyTrigger {
  condition: (gameState: GameState, rankings: RankingState) => boolean
  priority: number  // Higher = more important (for queue management)
  oneTime: boolean  // Can only trigger once
  flagOnComplete: string  // Flag to set when ceremony completes
}

export interface CeremonyPresentation {
  backdrop: 'station_platform' | 'private_office' | 'grand_hall' | 'constellation_view'
  lighting: 'warm' | 'cool' | 'dramatic' | 'soft'
  music?: string  // Audio cue ID
  duration: number  // Expected seconds
}

export interface CeremonyDialogue {
  opening: string
  recognition: string
  reflection: string
  blessing: string
  playerResponse?: CeremonyResponse[]
}

export interface CeremonyResponse {
  text: string
  samuelReply: string
  patterns?: PatternType[]
}

export interface CeremonyReward {
  type: 'pattern_bonus' | 'expertise_bonus' | 'flag' | 'visual'
  value: string | number
}
```

### 2. Ceremony Registry

```typescript
// lib/ranking/ceremony-registry.ts

export const CEREMONIES: Ceremony[] = [
  // Pattern Mastery Promotions
  {
    id: 'ceremony_passenger',
    type: 'rank_promotion',
    trigger: {
      condition: (_, rankings) =>
        rankings.ranks.pattern_mastery.currentTierId === 'pm_passenger' &&
        !rankings.ceremonies.includes('ceremony_passenger'),
      priority: 80,
      oneTime: true,
      flagOnComplete: 'ceremony_passenger_complete'
    },
    presentation: {
      backdrop: 'station_platform',
      lighting: 'warm',
      duration: 45
    },
    dialogue: {
      opening: "Wait. Stop for a moment.",
      recognition: "I've been watching you, you know. The way you move through this place. The questions you ask. The choices you make.",
      reflection: "Most people who come here—they rush. They want answers before they understand the questions. But you... you're finding your rhythm.",
      blessing: "You're not just passing through anymore. You're becoming a Passenger. That means something here.",
      playerResponse: [
        {
          text: "What does it mean?",
          samuelReply: "It means the station has noticed you. And when this place notices someone... things start to happen.",
          patterns: ['exploring']
        },
        {
          text: "I'm just trying to figure things out.",
          samuelReply: "That's exactly it. Most people think they already know. You're willing to discover.",
          patterns: ['patience']
        },
        {
          text: "I appreciate you saying that.",
          samuelReply: "I don't say things I don't mean. Remember that.",
          patterns: ['helping']
        }
      ]
    }
  },

  {
    id: 'ceremony_regular',
    type: 'rank_promotion',
    trigger: {
      condition: (_, rankings) =>
        rankings.ranks.pattern_mastery.currentTierId === 'pm_regular' &&
        !rankings.ceremonies.includes('ceremony_regular'),
      priority: 85,
      oneTime: true,
      flagOnComplete: 'ceremony_regular_complete'
    },
    presentation: {
      backdrop: 'private_office',
      lighting: 'soft',
      duration: 50
    },
    dialogue: {
      opening: "Come in. Close the door.",
      recognition: "I've seen a lot of travelers pass through this station. Most of them, I forget. Some of them, I remember. You? I remember.",
      reflection: "The Regulars... they're different. They don't just visit—they belong. They understand that this place isn't about destinations. It's about the journey of becoming.",
      blessing: "Welcome to the Regulars. You've earned this. Now... the real work begins.",
      playerResponse: [
        {
          text: "What real work?",
          samuelReply: "Helping others find their way. The station gives, but it also asks.",
          patterns: ['helping']
        },
        {
          text: "I'm ready.",
          samuelReply: "I believe you are. That's rare.",
          patterns: ['building']
        },
        {
          text: "Thank you for believing in me.",
          samuelReply: "I don't believe in you. I see you. There's a difference.",
          patterns: ['patience']
        }
      ]
    }
  },

  {
    id: 'ceremony_conductor',
    type: 'rank_promotion',
    trigger: {
      condition: (_, rankings) =>
        rankings.ranks.pattern_mastery.currentTierId === 'pm_conductor' &&
        !rankings.ceremonies.includes('ceremony_conductor'),
      priority: 90,
      oneTime: true,
      flagOnComplete: 'ceremony_conductor_complete'
    },
    presentation: {
      backdrop: 'grand_hall',
      lighting: 'dramatic',
      duration: 60
    },
    dialogue: {
      opening: "Follow me. There's something I want to show you.",
      recognition: "This hall... most people never see it. The Conductors built it, generations ago. A reminder that the journey matters more than any destination.",
      reflection: "You guide your own journey now. But more than that—you're learning to guide others. That's what a Conductor does.",
      blessing: "Take this knowing: You've earned a place here that few ever reach. Use it wisely.",
      playerResponse: [
        {
          text: "I'll try to live up to it.",
          samuelReply: "Don't try. Do. You're past trying.",
          patterns: ['building', 'patience']
        },
        {
          text: "How do I guide others?",
          samuelReply: "The same way you found your own path. By listening. By being present. By asking the right questions.",
          patterns: ['helping', 'exploring']
        },
        {
          text: "This is... a lot to take in.",
          samuelReply: "It should be. Growth that feels easy wasn't growth at all.",
          patterns: ['analytical', 'patience']
        }
      ]
    }
  },

  {
    id: 'ceremony_stationmaster',
    type: 'rank_promotion',
    trigger: {
      condition: (_, rankings) =>
        rankings.ranks.pattern_mastery.currentTierId === 'pm_stationmaster' &&
        !rankings.ceremonies.includes('ceremony_stationmaster'),
      priority: 100,
      oneTime: true,
      flagOnComplete: 'ceremony_stationmaster_complete'
    },
    presentation: {
      backdrop: 'constellation_view',
      lighting: 'cool',
      duration: 75
    },
    dialogue: {
      opening: "Look up. Do you see them? The constellations above the station?",
      recognition: "Every light up there... someone who came through this place and left their mark. Someone who became more than they were when they arrived.",
      reflection: "Station Master. It's not a title I give often. Some say I've only given it a handful of times in all my years here.",
      blessing: "This place is part of you now. You are part of it. What you do next... that's between you and the universe.",
      playerResponse: [
        {
          text: "I don't know what to say.",
          samuelReply: "You don't have to say anything. Your actions have already spoken.",
          patterns: ['patience']
        },
        {
          text: "What happens now?",
          samuelReply: "Now? Now you live it. Every day, every choice. The station doesn't end here.",
          patterns: ['exploring', 'building']
        },
        {
          text: "Thank you, Samuel. For everything.",
          samuelReply: "*Samuel simply nods, a rare smile crossing his face*",
          patterns: ['helping']
        }
      ]
    }
  },

  // Elite Recognition Ceremony
  {
    id: 'ceremony_elite_tech',
    type: 'elite_recognition',
    trigger: {
      condition: (state) =>
        state.globalFlags.has('elite_tech_pioneer_unlocked') &&
        !state.globalFlags.has('ceremony_elite_tech_complete'),
      priority: 95,
      oneTime: true,
      flagOnComplete: 'ceremony_elite_tech_complete'
    },
    presentation: {
      backdrop: 'grand_hall',
      lighting: 'dramatic',
      duration: 60
    },
    dialogue: {
      opening: "The builders of tomorrow have spoken. They've chosen you.",
      recognition: "Maya told me about your conversations. The way you think about technology—not just what it can do, but what it should do. Devon sees it too.",
      reflection: "Tech Pioneer. It's not about the code or the systems. It's about the vision. You understand that now.",
      blessing: "Go. Build things that matter. The station will always be here when you need to return.",
      playerResponse: [
        {
          text: "I'll make them proud.",
          samuelReply: "Make yourself proud. That's what they'd want.",
          patterns: ['building']
        },
        {
          text: "This means a lot.",
          samuelReply: "It should. You earned it.",
          patterns: ['helping']
        }
      ]
    }
  }
  // ... additional ceremonies for other elite statuses, assessments, etc.
]
```

### 3. Ceremony Manager

```typescript
// lib/ranking/ceremony-manager.ts

export interface CeremonyState {
  completedCeremonies: string[]  // Ceremony IDs
  pendingCeremony: string | null  // Next ceremony to show
  ceremonyHistory: CeremonyRecord[]
  lastCeremonyAt: number | null
}

export interface CeremonyRecord {
  ceremonyId: string
  completedAt: number
  playerResponseId?: string
}

/**
 * Check for pending ceremonies
 *
 * @param gameState - Current game state
 * @param rankings - Current ranking state
 * @param ceremonyState - Ceremony tracking state
 * @param now - Current timestamp for cooldown check (default: Date.now())
 */
export function checkPendingCeremonies(
  gameState: GameState,
  rankings: RankingState,
  ceremonyState: CeremonyState,
  now: number = Date.now()
): Ceremony | null {
  // Don't trigger if ceremony happened recently (cooldown)
  const CEREMONY_COOLDOWN = 5 * 60 * 1000  // 5 minutes
  if (ceremonyState.lastCeremonyAt &&
      now - ceremonyState.lastCeremonyAt < CEREMONY_COOLDOWN) {
    return null
  }

  // Find eligible ceremonies
  const eligible = CEREMONIES.filter(ceremony => {
    // Skip completed one-time ceremonies
    if (ceremony.trigger.oneTime &&
        ceremonyState.completedCeremonies.includes(ceremony.id)) {
      return false
    }

    // Check trigger condition
    return ceremony.trigger.condition(gameState, rankings)
  })

  if (eligible.length === 0) return null

  // Return highest priority
  return eligible.sort((a, b) => b.trigger.priority - a.trigger.priority)[0]
}

/**
 * Complete a ceremony
 *
 * @param ceremony - The ceremony to complete
 * @param playerResponseId - Optional player response ID
 * @param now - Timestamp for completion (default: Date.now())
 */
export function completeCeremony(
  ceremony: Ceremony,
  playerResponseId?: string,
  now: number = Date.now()
): Partial<CeremonyState> {
  return {
    completedCeremonies: [ceremony.id],
    pendingCeremony: null,
    ceremonyHistory: [{
      ceremonyId: ceremony.id,
      completedAt: now,  // Use passed timestamp for determinism
      playerResponseId
    }],
    lastCeremonyAt: now  // Use passed timestamp for determinism
  }
}
```

---

## UI Components

### 4. Ceremony Presentation

```typescript
// components/ranking/CeremonyPresentation.tsx

interface CeremonyPresentationProps {
  ceremony: Ceremony
  onComplete: (responseId?: string) => void
  onSkip: () => void
}

export function CeremonyPresentation({
  ceremony,
  onComplete,
  onSkip
}: CeremonyPresentationProps) {
  const [phase, setPhase] = useState<'opening' | 'recognition' | 'reflection' | 'blessing' | 'response'>('opening')
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)

  const prefersReducedMotion = useReducedMotion()

  const backdropStyles: Record<string, string> = {
    station_platform: 'bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900/20',
    private_office: 'bg-gradient-to-b from-slate-900 to-amber-950/30',
    grand_hall: 'bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-900/30',
    constellation_view: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900'
  }

  const lightingStyles: Record<string, string> = {
    warm: 'from-amber-500/10',
    cool: 'from-blue-500/10',
    dramatic: 'from-purple-500/20',
    soft: 'from-slate-500/10'
  }

  const phases = ['opening', 'recognition', 'reflection', 'blessing', 'response'] as const

  const advancePhase = () => {
    const currentIndex = phases.indexOf(phase)
    if (currentIndex < phases.length - 1) {
      setPhase(phases[currentIndex + 1])
    }
  }

  const handleResponse = (responseId: string) => {
    setSelectedResponse(responseId)
  }

  const handleComplete = () => {
    onComplete(selectedResponse ?? undefined)
  }

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-50 flex flex-col",
        backdropStyles[ceremony.presentation.backdrop]
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Lighting overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-radial pointer-events-none",
        lightingStyles[ceremony.presentation.lighting]
      )} />

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-sm"
      >
        Skip
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Samuel avatar */}
        <motion.div
          className="w-24 h-24 mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CharacterAvatar character="samuel" size="lg" />
        </motion.div>

        {/* Dialogue */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md text-center"
          >
            {phase === 'opening' && (
              <p className="text-lg text-amber-100 italic">
                "{ceremony.dialogue.opening}"
              </p>
            )}
            {phase === 'recognition' && (
              <p className="text-base text-slate-200">
                "{ceremony.dialogue.recognition}"
              </p>
            )}
            {phase === 'reflection' && (
              <p className="text-base text-slate-300">
                "{ceremony.dialogue.reflection}"
              </p>
            )}
            {phase === 'blessing' && (
              <p className="text-lg text-amber-200 font-medium">
                "{ceremony.dialogue.blessing}"
              </p>
            )}
            {phase === 'response' && ceremony.dialogue.playerResponse && (
              <div className="space-y-3">
                {ceremony.dialogue.playerResponse.map(response => (
                  <button
                    key={response.text}
                    onClick={() => handleResponse(response.text)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors",
                      selectedResponse === response.text
                        ? "bg-amber-900/50 border border-amber-500/50"
                        : "bg-slate-800/50 border border-slate-700 hover:border-slate-600"
                    )}
                  >
                    <p className="text-sm text-white">"{response.text}"</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Continue / Complete buttons */}
        <div className="mt-8">
          {phase !== 'response' && (
            <Button
              onClick={advancePhase}
              variant="ghost"
              className="text-amber-400 hover:text-amber-300"
            >
              Continue
            </Button>
          )}
          {phase === 'response' && selectedResponse && (
            <Button
              onClick={handleComplete}
              className="bg-amber-600 hover:bg-amber-500"
            >
              Complete Ceremony
            </Button>
          )}
        </div>
      </div>

      {/* Phase indicator */}
      <div className="flex justify-center gap-1 pb-6">
        {phases.map((p, i) => (
          <div
            key={p}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              phases.indexOf(phase) >= i ? "bg-amber-400" : "bg-slate-600"
            )}
          />
        ))}
      </div>
    </motion.div>
  )
}
```

### 5. Ceremony History

```typescript
// components/ranking/CeremonyHistory.tsx

interface CeremonyHistoryProps {
  history: CeremonyRecord[]
}

export function CeremonyHistory({ history }: CeremonyHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">
        No ceremonies yet. Your journey is just beginning.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {history.map(record => {
        const ceremony = CEREMONIES.find(c => c.id === record.ceremonyId)
        if (!ceremony) return null

        return (
          <div
            key={record.ceremonyId}
            className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {getCeremonyTitle(ceremony)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(record.completedAt).toLocaleDateString()}
                </p>
              </div>
              <CeremonyTypeIcon type={ceremony.type} />
            </div>
            {record.playerResponseId && (
              <p className="text-xs text-slate-500 mt-2 italic">
                You said: "{record.playerResponseId}"
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Pattern Mastery | Rank promotion triggers | Input |
| Elite Status | Elite recognition triggers | Input |
| Assessment Arc | Completion triggers | Input |
| Skill Stars | Star award triggers | Input |
| Game State | Ceremony flags | Both |
| Journal UI | History display | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 11.1 | Define ceremony types | 5 types with structure | `lib/ranking/ceremonies.ts` |
| 11.2 | Create ceremony registry | All ceremonies with dialogue | `lib/ranking/ceremony-registry.ts` |
| 11.3 | Implement ceremony manager | Trigger + complete logic | `lib/ranking/ceremony-manager.ts` |
| 11.4 | Build presentation component | Visual ceremony flow | `components/ranking/CeremonyPresentation.tsx` |
| 11.5 | Add history display | Journal integration | `components/ranking/CeremonyHistory.tsx` |

---

## Tests & Verification

```typescript
describe("Samuel's Ceremonies", () => {
  describe('Trigger Detection', () => {
    it('detects passenger rank ceremony', () => {
      const rankings = createMockRankings({
        pattern_mastery: { currentTierId: 'pm_passenger' }
      })
      const ceremony = checkPendingCeremonies(
        createMockGameState(),
        rankings,
        { completedCeremonies: [] }
      )
      expect(ceremony?.id).toBe('ceremony_passenger')
    })

    it('respects cooldown period', () => {
      const ceremony = checkPendingCeremonies(
        createMockGameState(),
        createMockRankings(),
        { lastCeremonyAt: Date.now() - 1000 }  // 1 second ago
      )
      expect(ceremony).toBeNull()
    })
  })

  describe('Ceremony Completion', () => {
    it('records ceremony in history', () => {
      const result = completeCeremony(CEREMONIES[0], 'response_a')
      expect(result.ceremonyHistory?.[0].playerResponseId).toBe('response_a')
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| `checkPendingCeremonies()` | <3ms |
| Ceremony render | <16ms |
| Phase transition | <300ms |
| History render | <8ms |

---

## Design Principles

| Principle | Application |
|-----------|-------------|
| Feel over mechanics | Ceremonies are emotional moments |
| Show, don't tell | Visual presentation over exposition |
| Player agency | Response choices reflect patterns |
| Respect time | Skippable, reasonable duration |
| Meaningful moments | Triggered by real achievement |
