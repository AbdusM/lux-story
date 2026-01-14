# Polish Sprint Plan: 86% → 95%

## Objective
Eliminate vestigial code, consolidate state management, complete content coverage, and add defensive validation across all systems.

---

## ⚠️ CONTENT PRESERVATION RULES

### NEVER Lose:
1. **Dialogue content** - Every line in `content/*-dialogue-graph.ts` is precious
2. **Consequence echoes** - Character voice is hard to recreate
3. **Pattern sensations** - Atmospheric text took iteration to get right
4. **Trust labels** - Progression language was carefully crafted
5. **Unlock descriptions** - Achievement text is player-facing

### Before ANY Edit:
1. Read the entire section being modified
2. If removing code, archive it first
3. If changing text, preserve original in comment
4. Git commit before each phase

### Content Files (HANDLE WITH CARE):
```
content/
├── samuel-dialogue-graph.ts    # 198KB - Hub character, most content
├── maya-dialogue-graph.ts      # 45KB - Complete arc
├── devon-dialogue-graph.ts     # 45KB - Complete arc
├── marcus-dialogue-graph.ts    # 50KB - Healthcare arc
├── kai-dialogue-graph.ts       # 50KB - Safety arc
├── jordan-dialogue-graph.ts    # 45KB - Career navigation
├── rohan-dialogue-graph.ts     # 40KB - Deep tech
├── tess-dialogue-graph.ts      # 40KB - Education
├── yaquin-dialogue-graph.ts    # 40KB - EdTech
└── intersection-*.ts           # Character crossovers
```

### Voice Files (DO NOT MODIFY without review):
```
lib/
├── consequence-echoes.ts       # Character-specific reactions
├── patterns.ts                 # Pattern sensations
├── trust-labels.ts             # Trust progression language
├── pattern-unlocks.ts          # Achievement descriptions
└── journey-narrative-generator.ts  # Samuel's summary voice
```

---

## Phase 1: Critical Safety (1-2 hours)
*Fix crash risks and type safety issues*

### 1.1 Fix Unsafe Non-Null Assertion
**File:** `lib/identity-system.ts:88`
```typescript
// BEFORE (crash risk)
pattern: extractPatternFromIdentity(t.id)!

// AFTER (safe)
const pattern = extractPatternFromIdentity(t.id)
if (!pattern) {
  console.warn(`Invalid identity thought: ${t.id}`)
  continue
}
```

### 1.2 Create Emotion Type System
**New File:** `lib/emotions.ts`
```typescript
export const EMOTION_TYPES = [
  'neutral', 'anxious', 'worried', 'vulnerable', 'thoughtful',
  'excited', 'hopeful', 'frustrated', 'defensive', 'open',
  'curious', 'hesitant', 'confident', 'reflective', 'determined'
] as const

export type EmotionType = typeof EMOTION_TYPES[number]

export function isValidEmotion(emotion: string): emotion is EmotionType {
  return EMOTION_TYPES.includes(emotion as EmotionType)
}
```

### 1.3 Enforce Pattern Type in Choices
**File:** `components/GameChoices.tsx:72`
```typescript
// BEFORE
pattern?: string

// AFTER
import { type PatternType } from '@/lib/patterns'
pattern?: PatternType
```

**File:** `lib/dialogue-graph.ts` - Update Choice interface similarly

---

## Phase 2: Dead Code Archival (30 mins)
*Archive vestigial features - NEVER DELETE, always preserve*

### ⚠️ PRESERVATION RULE
**NEVER delete code outright. Always archive with clear deprecation markers.**
This protects against losing design intent or future feature revival.

### 2.1 Archive Orb Allocation Stubs
**File:** `lib/orbs.ts`

DO NOT DELETE. Instead, mark with deprecation:
```typescript
/**
 * @deprecated VESTIGIAL - Allocation system was designed but not implemented.
 * Keeping for potential future feature. Do not use in new code.
 * Original design: Players could "spend" orbs on unlocks.
 * Current reality: Orbs are earned-only, no spending mechanism.
 */
// totalAllocated: number  // Always 0
// availableToAllocate: number  // Always 0
```

Create archive file: `lib/archive/orb-allocation-design.ts`
- Move `AllocationTarget` interface there
- Add design notes explaining original intent

### 2.2 Archive Legacy Game State
**File:** `lib/game-state.ts`

PRESERVE by renaming: `lib/archive/game-state.legacy.ts`

Add header:
```typescript
/**
 * @deprecated Legacy state system from Sprint 1.
 *
 * PRESERVED FOR:
 * - Historical reference
 * - PatternTracker class design (may be useful later)
 * - Understanding early architecture decisions
 *
 * CURRENT SYSTEM: lib/character-state.ts
 * DO NOT IMPORT THIS FILE.
 */
```

### 2.3 Create Archive Directory
```
lib/
├── archive/
│   ├── README.md (explains what's here and why)
│   ├── game-state.legacy.ts
│   └── orb-allocation-design.ts
```

**Archive README content:**
```markdown
# Archived Code

This directory contains deprecated code preserved for:
1. Historical reference
2. Design intent documentation
3. Potential future feature revival

## Contents
- `game-state.legacy.ts` - Sprint 1 state system (replaced by character-state.ts)
- `orb-allocation-design.ts` - Designed but unimplemented orb spending system

## Rule
NEVER delete from here. Only add with clear documentation.
```

---

## Phase 3: Centralize Constants (30 mins)
*Single source of truth for magic numbers*

### 3.1 Create Constants File
**New File:** `lib/constants.ts`
```typescript
/**
 * Canonical Constants - Single Source of Truth
 */

// Orb System
export const MAX_ORB_COUNT = 100
export const ORB_UNLOCK_THRESHOLDS = [10, 50, 85] as const

// Trust System
export const MAX_TRUST = 10
export const MIN_TRUST = 0

// Identity System
export const IDENTITY_THRESHOLD = 5
export const INTERNALIZE_BONUS = 0.20

// Session Boundaries
export const SESSION_BOUNDARY_MIN_NODES = 8
export const SESSION_BOUNDARY_MAX_NODES = 12

// Pattern System
export const PATTERN_SENSATION_PROBABILITY = 0.3
```

### 3.2 Update Imports
Replace hardcoded values in:
- `hooks/usePatternUnlocks.ts:75` → `import { MAX_ORB_COUNT }`
- `lib/pattern-unlocks.ts` → Use constants
- `lib/identity-system.ts` → Use `IDENTITY_THRESHOLD`, `INTERNALIZE_BONUS`
- `lib/session-structure.ts` → Use session boundary constants

---

## Phase 4: Complete Echo Coverage (2-3 hours)
*Finish character-specific feedback*

### 4.1 Rohan Echoes
**File:** `lib/consequence-echoes.ts`
```typescript
rohan: {
  up: {
    small: [
      "Rohan's gaze lingers a moment longer.",
      "Something shifts behind those dark eyes.",
      "He nods—barely, but you catch it."
    ],
    medium: [
      "Rohan sets down his coffee. Gives you his full attention.",
      "\"Interesting,\" he says. From him, that's a standing ovation.",
      "The corner of his mouth twitches. Almost a smile."
    ],
    large: [
      "Rohan actually laughs. The sound surprises both of you.",
      "\"You see things clearly,\" he says. \"That's rare.\"",
      "He leans back, genuinely impressed. \"Keep going.\""
    ]
  },
  down: {
    small: ["Rohan's expression doesn't change. But something closes off."],
    medium: ["He looks away. The conversation feels thinner now."],
    large: ["\"I thought you understood,\" he says quietly."]
  },
  patterns: {
    analytical: "Rohan notices your precision. It mirrors his own.",
    patience: "He appreciates that you didn't rush to fill the silence.",
    exploring: "\"Curious mind,\" he observes. Not quite approval. But close.",
    helping: "Your concern seems to unsettle him. He's not used to it.",
    building: "He watches you construct the idea. Nods slowly."
  }
}
```

### 4.2 Yaquin Echoes
```typescript
yaquin: {
  up: {
    small: [
      "Yaquin's ears perk up slightly.",
      "A gentle smile crosses her face.",
      "She tilts her head, interested."
    ],
    medium: [
      "\"Oh!\" Yaquin brightens visibly.",
      "She claps her hands together softly. \"Yes, exactly!\"",
      "Her whole demeanor warms."
    ],
    large: [
      "Yaquin practically bounces. \"I knew you'd understand!\"",
      "\"This is why I wanted to talk to you,\" she beams.",
      "She reaches out, almost touches your arm. \"Thank you.\""
    ]
  },
  down: {
    small: ["Yaquin's smile falters for just a moment."],
    medium: ["She wraps her arms around herself. Smaller now."],
    large: ["\"Oh,\" she says softly. \"I thought...\" She doesn't finish."]
  },
  patterns: {
    analytical: "She watches you think it through. Waits patiently.",
    patience: "Your calm steadies her. She breathes easier.",
    exploring: "\"You ask the best questions,\" she says, delighted.",
    helping: "Your kindness makes her eyes shine.",
    building: "She loves watching you create. It inspires her."
  }
}
```

### 4.3 Kai Echoes
```typescript
kai: {
  up: {
    small: [
      "Kai's posture relaxes—just slightly.",
      "He uncrosses his arms.",
      "A brief nod. Acknowledgment."
    ],
    medium: [
      "\"Solid,\" Kai says. High praise from him.",
      "He actually makes eye contact. Holds it.",
      "\"You've thought this through. I respect that.\""
    ],
    large: [
      "Kai grins—full and genuine. \"Now we're talking.\"",
      "\"You'd make a good safety officer,\" he says. \"That's not nothing.\"",
      "He extends his hand. \"Partners on this one?\""
    ]
  },
  down: {
    small: ["Kai's jaw tightens almost imperceptibly."],
    medium: ["He steps back. Creates distance."],
    large: ["\"That's exactly the kind of thinking that gets people hurt.\""]
  },
  patterns: {
    analytical: "Kai appreciates your risk assessment instincts.",
    patience: "\"Good. Don't rush into danger,\" he approves.",
    exploring: "He's wary of your curiosity. But intrigued too.",
    helping: "\"Wanting to help is step one. Step two is not making it worse.\"",
    building: "\"Build it safe or don't build it. Simple.\""
  }
}
```

---

## Phase 5: Validation Layer (1-2 hours)
*Add defensive checks throughout*

### 5.1 Character ID Validation
**File:** `lib/character-state.ts`
```typescript
import { CharacterId, isValidCharacterId } from '@/lib/graph-registry'

// Add to applyStateChange or relevant functions
if (characterId && !isValidCharacterId(characterId)) {
  console.error(`Invalid characterId: ${characterId}`)
  return state // Return unchanged
}
```

### 5.2 Trust Bounds Checking
**File:** `lib/character-state.ts`
```typescript
// In trust change logic
const newTrust = Math.max(MIN_TRUST, Math.min(MAX_TRUST, currentTrust + delta))
```

### 5.3 Pattern Value Validation
**File:** `lib/patterns.ts` - Add to helper functions
```typescript
export function getPatternColor(pattern: PatternType | string): string {
  if (!isValidPattern(pattern)) {
    console.warn(`Invalid pattern: ${pattern}, using default`)
    return '#6B7280' // gray fallback
  }
  return PATTERN_METADATA[pattern].color
}
```

---

## Phase 6: State Consolidation (1-2 hours)
*Clarify source of truth*

### 6.1 Document State Ownership
**New File:** `lib/STATE_ARCHITECTURE.md`
```markdown
# State Architecture

## Sources of Truth

| Data | Owner | File | Consumers |
|------|-------|------|-----------|
| Player patterns | character-state.ts | GameState.patterns | Journal, Unlocks |
| Character trust | character-state.ts | GameState.characters[x].trust | Constellation |
| Orb balance | useOrbs hook | localStorage | Journal |
| Skills | game-store.ts | Zustand | Journey Summary |
| Scene history | game-store.ts | Zustand | Navigation |

## Sync Flow
1. Player makes choice → StatefulGameInterface
2. Update GameState → character-state.ts
3. Serialize to Zustand → game-store.ts
4. Persist to localStorage → useOrbs, etc.
```

### 6.2 Remove game-store Duplicates
**File:** `lib/game-store.ts`

Either:
- Remove duplicate `characterTrust` field (use character-state only)
- OR document clearly that game-store is the canonical source

---

## Phase 7: Test Coverage (2-3 hours)
*Verify core systems work correctly*

### 7.1 Pattern System Tests
**New File:** `tests/lib/patterns.test.ts`
```typescript
import {
  PATTERN_TYPES,
  isValidPattern,
  getPatternColor,
  getPatternSensation
} from '@/lib/patterns'

describe('Pattern System', () => {
  test('all patterns have metadata', () => {
    PATTERN_TYPES.forEach(pattern => {
      expect(getPatternColor(pattern)).toBeDefined()
      expect(getPatternSensation(pattern)).toBeDefined()
    })
  })

  test('isValidPattern rejects invalid input', () => {
    expect(isValidPattern('invalid')).toBe(false)
    expect(isValidPattern('analytical')).toBe(true)
  })
})
```

### 7.2 Orb System Tests
**New File:** `tests/lib/orbs.test.ts`
```typescript
import { getOrbTier, getStreakBonus } from '@/lib/orbs'

describe('Orb System', () => {
  test('tiers progress correctly', () => {
    expect(getOrbTier(0)).toBe('nascent')
    expect(getOrbTier(10)).toBe('emerging')
    expect(getOrbTier(30)).toBe('developing')
    expect(getOrbTier(60)).toBe('flourishing')
    expect(getOrbTier(100)).toBe('mastered')
  })

  test('streak bonuses accumulate', () => {
    expect(getStreakBonus(1)).toBe(0)
    expect(getStreakBonus(3)).toBeGreaterThan(0)
    expect(getStreakBonus(5)).toBeGreaterThan(getStreakBonus(3))
  })
})
```

### 7.3 Identity System Tests
**New File:** `tests/lib/identity-system.test.ts`
```typescript
import { calculatePatternGain, isIdentityThought } from '@/lib/identity-system'

describe('Identity System', () => {
  test('internalized patterns get bonus', () => {
    const stateWithIdentity = {
      internalizedThoughts: [{ id: 'identity-analytical', internalized: true }]
    }
    const gain = calculatePatternGain(1, 'analytical', stateWithIdentity)
    expect(gain).toBe(1.2) // 1 + 20% bonus
  })

  test('non-internalized patterns get no bonus', () => {
    const gain = calculatePatternGain(1, 'analytical', { internalizedThoughts: [] })
    expect(gain).toBe(1)
  })
})
```

---

## Phase 8: Documentation (1 hour)
*Update docs to match reality*

### 8.1 Update CLAUDE.md
- Add "State Architecture" section
- Update character list (remove Lira, confirm current roster)
- Document emotion types
- Add testing instructions

### 8.2 Update PRD
- Mark Capstone System as "Future Roadmap"
- Add Identity Offering to feature list
- Add Consequence Echoes to feature list
- Reconcile terminology (nanostem vs dialogue graph)

---

## Execution Timeline

| Phase | Time | Impact | Priority |
|-------|------|--------|----------|
| 1. Critical Safety | 1-2h | Prevents crashes | **DO FIRST** |
| 2. Dead Code | 30m | Code clarity | High |
| 3. Constants | 30m | Maintainability | High |
| 4. Echo Coverage | 2-3h | Content completeness | High |
| 5. Validation | 1-2h | Robustness | Medium |
| 6. State Consolidation | 1-2h | Architecture clarity | Medium |
| 7. Test Coverage | 2-3h | Confidence | Medium |
| 8. Documentation | 1h | Knowledge transfer | Low |

**Total Estimated Time:** 10-14 hours

---

## Success Criteria

### From 86% → 95%

| Metric | Before | After |
|--------|--------|-------|
| Type safety | Loose strings | Strict unions |
| Vestigial code | 4 systems | 0 systems |
| Echo coverage | 3/8 characters | 8/8 characters |
| Constants | 4 duplicated | 1 canonical |
| Test coverage | Core systems untested | Core systems tested |
| Crash risks | 2 identified | 0 |

### Definition of Done
- [ ] All `PatternType` usages are type-safe
- [ ] All emotion tags validated
- [ ] No vestigial allocation code
- [ ] All 8 characters have complete echoes
- [ ] Constants centralized in one file
- [ ] Core systems have test coverage
- [ ] State architecture documented
- [ ] Zero unsafe non-null assertions
