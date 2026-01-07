# Refactoring Best Practices for Lux Story
**OrbVoice Patterns Applied to Game Architecture**

**Created:** January 7, 2026
**Version:** 1.0
**Purpose:** Apply proven refactoring patterns from OrbVoice to lux-story's narrative game architecture

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architectural Parallels: OrbVoice → Lux Story](#architectural-parallels-orbvoice--lux-story)
3. [UI/Component Refactoring](#uicomponent-refactoring)
4. [State Management Optimization](#state-management-optimization)
5. [Design Token Consolidation](#design-token-consolidation)
6. [Derivative System Architecture](#derivative-system-architecture)
7. [Content Validation & Testing](#content-validation--testing)
8. [Performance Optimization](#performance-optimization)
9. [Code Quality Patterns](#code-quality-patterns)
10. [Migration Roadmap](#migration-roadmap)

---

## Executive Summary

### Your Stack vs OrbVoice

| Aspect | Lux Story | OrbVoice | Similarity |
|--------|-----------|----------|------------|
| **Framework** | Next.js 15 App Router | React Native Expo | Different platforms, same React patterns |
| **State** | Zustand + localStorage | Zustand + Drizzle ORM | ✅ Same core (Zustand) |
| **Styling** | Tailwind + Framer Motion | Nativewind + Reanimated | ✅ Same utility-first approach |
| **Components** | shadcn/ui (Radix) | Custom + Bottom Sheet | Similar composition patterns |
| **Architecture** | Dialogue-driven game | Form-driven medical app | ✅ Both narrative/content-heavy |
| **Testing** | Vitest + Playwright | Detox E2E | Similar coverage goals |

### Key Takeaways

**What Applies Directly:**
1. ✅ **Design Token Migration** - You have `ui-constants.ts`, can consolidate like `design-tokens.ts`
2. ✅ **Component Size Reduction** - `GameChoices.tsx` (24.7K LOC) needs splitting like OrbVoice BottomSheets
3. ✅ **Derivative System Pattern** - Your 7 derivative modules match OrbVoice's pattern perfectly
4. ✅ **State Validation Layer** - Add validation to `GameStateUtils.applyStateChange()`
5. ✅ **Content Schema Validation** - Use Zod for dialogue node validation

**What Needs Adaptation:**
- ❌ Mobile-specific patterns (safe areas, touch targets) - You're web-first
- ⚠️ Database patterns - You use localStorage primarily, not PostgreSQL
- ⚠️ API patterns - Your API is simpler (admin + health checks)

---

## Architectural Parallels: OrbVoice → Lux Story

### Pattern Mapping

| OrbVoice Pattern | Lux Story Equivalent | Refactoring Opportunity |
|------------------|---------------------|------------------------|
| **57 Medical Forms** | **16 Character Dialogues (983 nodes)** | Content validation, schema enforcement |
| **BottomSheet Components** | **DialogueDisplay, ChatPacedDialogue** | Component extraction, shared patterns |
| **Design Tokens (ui.ts)** | **ui-constants.ts + PATTERN_HOVER_STYLES** | Consolidate scattered color/spacing values |
| **8-Layer Architecture** | **Content → State → UI flow** | Formalize layers, add validation |
| **Defensive Coding** | **GameStateUtils validation** | Add comprehensive null safety |
| **Service Layer** | **Derivative Systems (7 modules)** | Consolidate computation, add engine |
| **Zod Validation** | **TypeScript guards** | Add runtime validation schemas |

---

## UI/Component Refactoring

### Priority 1: Component Size Reduction

**Problem:** Large components are hard to test and maintain.

| Component | Current Size | Refactoring Target |
|-----------|-------------|-------------------|
| `GameChoices.tsx` | 24,700 LOC | Split into 8 sub-components |
| `Journal.tsx` | ~17,000 LOC | Extract 5 sections |
| `ChatPacedDialogue.tsx` | Unknown | Assess and split if >1K LOC |

#### GameChoices.tsx Refactoring Plan

**Current Structure:**
```
GameChoices.tsx (24.7K LOC)
├─ Choice rendering logic
├─ Pattern hover styles (lines 19-105)
├─ Animation variants
├─ Visibility conditions
├─ Effect handling
├─ History tracking
└─ Scroll management
```

**Proposed Structure:**
```
components/game/
├── GameChoices.tsx              # Container (500 LOC)
│   └─ Orchestrates choice display, delegates to children
├── ChoiceButton.tsx             # Single choice UI (~300 LOC)
│   └─ Pattern hover styles, click handling
├── ChoicePatternIndicator.tsx   # Pattern preview (~200 LOC)
│   └─ Visual feedback for pattern alignment
├── ChoiceEffects.tsx            # Animation logic (~400 LOC)
│   └─ Framer Motion variants, stagger timing
├── ChoiceConditions.tsx         # Visibility evaluation (~300 LOC)
│   └─ Trust checks, flag checks, pattern unlocks
├── ChoiceHistory.tsx            # History panel (~200 LOC)
│   └─ Past choice review
└── useChoiceLogic.ts            # Business logic hook (~400 LOC)
    └─ handleChoice, effect processing, state updates
```

**Migration Steps:**

```bash
# Step 1: Create new component files
touch components/game/ChoiceButton.tsx
touch components/game/ChoicePatternIndicator.tsx
touch components/game/ChoiceEffects.tsx
touch components/game/ChoiceConditions.tsx
touch components/game/ChoiceHistory.tsx
touch hooks/useChoiceLogic.ts

# Step 2: Extract constants first (safest)
# Move PATTERN_HOVER_STYLES, PATTERN_GLASS_STYLES to lib/pattern-ui-constants.ts

# Step 3: Extract hook (no visual impact)
# Move business logic to useChoiceLogic.ts
# Test: npm test hooks/useChoiceLogic.test.ts

# Step 4: Extract components one-by-one
# Start with ChoiceButton (least dependencies)
# Test each extraction: npm run dev, verify visually

# Step 5: Verify E2E
# npm run test:e2e -- game-choices.spec.ts
```

**Example: Extracting ChoiceButton**

```typescript
// File: components/game/ChoiceButton.tsx
import { type DialogueChoice } from '@/lib/dialogue-graph'
import { type PatternType } from '@/lib/patterns'
import { motion } from 'framer-motion'
import { springs } from '@/lib/animations'
import { PATTERN_HOVER_STYLES, PATTERN_GLASS_STYLES } from '@/lib/pattern-ui-constants'

interface ChoiceButtonProps {
  choice: DialogueChoice
  pattern?: PatternType
  isLocked: boolean
  onClick: () => void
  index: number
  glassMode?: boolean
}

export const ChoiceButton = memo(({
  choice,
  pattern,
  isLocked,
  onClick,
  index,
  glassMode = false
}: ChoiceButtonProps) => {
  const hoverStyle = pattern
    ? (glassMode ? PATTERN_GLASS_STYLES[pattern] : PATTERN_HOVER_STYLES[pattern])
    : DEFAULT_HOVER_STYLE

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ...springs.gentle }}
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        hoverStyle.bg,
        hoverStyle.border,
        hoverStyle.shadow,
        hoverStyle.activeBg,
        isLocked && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-2">
        {isLocked && <Lock className="w-4 h-4" />}
        <span>{choice.text}</span>
      </div>
    </motion.button>
  )
})
```

**Benefits:**
- ✅ Testable in isolation
- ✅ Reusable across different choice contexts
- ✅ Clear separation of concerns
- ✅ Easier to add new hover styles

---

### Priority 2: Journal.tsx Section Extraction

**Current Structure:**
```
Journal.tsx (17K LOC)
├─ Pattern Orbs section
├─ Skill Tracker section
├─ Character Constellation section
├─ Relationship Web section
└─ Accessibility toggles
```

**Proposed Structure:**
```
components/journal/
├── Journal.tsx                  # Container (300 LOC)
│   └─ Tab management, section orchestration
├── JournalPatterns.tsx          # Pattern orbs (~3K LOC)
│   └─ GooeyPatternOrbs integration
├── JournalSkills.tsx            # Skills tracker (~3K LOC)
│   └─ FutureSkillsSupport display
├── JournalRelationships.tsx     # Relationships (~4K LOC)
│   └─ ConstellationView + HarmonicsView
├── JournalAccessibility.tsx     # Settings (~2K LOC)
│   └─ Accessibility profile toggles
└── JournalStats.tsx             # Meta stats (~3K LOC)
    └─ Trust, patterns, progression
```

**Migration Pattern:**

```typescript
// File: components/journal/Journal.tsx (Container)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JournalPatterns } from './JournalPatterns'
import { JournalSkills } from './JournalSkills'
import { JournalRelationships } from './JournalRelationships'
import { JournalAccessibility } from './JournalAccessibility'

export function Journal() {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="patterns" className="flex-1">
        <TabsList>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns">
          <JournalPatterns />
        </TabsContent>

        <TabsContent value="skills">
          <JournalSkills />
        </TabsContent>

        <TabsContent value="relationships">
          <JournalRelationships />
        </TabsContent>

        <TabsContent value="settings">
          <JournalAccessibility />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

**Benefits:**
- ✅ Each section testable independently
- ✅ Lazy loading possible (reduce initial bundle)
- ✅ Clearer responsibility boundaries

---

## State Management Optimization

### Current Architecture Analysis

**Your State Structure (game-store.ts):**
```typescript
interface GameState {
  // Legacy fields (duplicated from coreGameState)
  characterTrust: Record<string, number>
  patterns: PatternTracking

  // Core state (single source of truth)
  coreGameState: SerializableGameState | null
}
```

**Problem:** Duplication between legacy fields and `coreGameState`.

**OrbVoice Parallel:** They had similar issues with state duplication before refactoring.

### Recommended Refactoring

**Phase 1: Add Deprecation Warnings**

```typescript
// File: lib/game-store.ts
export const useGameStore = create<GameState>((set, get) => ({
  // ... existing state

  // Add getter that warns about deprecated usage
  get characterTrust() {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[DEPRECATED] Direct access to characterTrust. Use coreGameState.characters instead.')
    }
    return this._characterTrust || {}
  }
}))
```

**Phase 2: Create Migration Helper**

```typescript
// File: lib/state-migration.ts
export function migrateToCore

GameState(
  legacyState: GameState
): SerializableGameState {
  return {
    saveVersion: '2.1.0',
    playerId: legacyState.coreGameState?.playerId || 'default',
    characters: new Map(
      Object.entries(legacyState.characterTrust).map(([id, trust]) => [
        id,
        {
          characterId: id,
          trust,
          // ... migrate other fields
        }
      ])
    ),
    patterns: legacyState.patterns,
    // ... migrate all fields
  }
}
```

**Phase 3: Gradual Component Migration**

```typescript
// ❌ OLD: Direct access to legacy fields
const trust = useGameStore(s => s.characterTrust['maya'])

// ✅ NEW: Access via coreGameState
const trust = useGameStore(s =>
  s.coreGameState?.characters.get('maya')?.trust ?? 0
)

// ✅ BEST: Use selector hook
const useMayaTrust = () => useGameStore(
  useCallback(s => s.coreGameState?.characters.get('maya')?.trust ?? 0, [])
)
```

**Benefits:**
- ✅ Single source of truth (like OrbVoice's `GameState`)
- ✅ No data synchronization bugs
- ✅ Easier to reason about state changes

---

### State Validation Layer

**OrbVoice Pattern:** All state changes go through validated transforms.

**Apply to Lux Story:**

```typescript
// File: lib/state-validator.ts
import { z } from 'zod'
import { type SerializableGameState } from './character-state'

const TrustSchema = z.number().min(0).max(10)
const PatternScoreSchema = z.number().min(0).max(100)

export const CharacterStateSchema = z.object({
  characterId: z.string(),
  trust: TrustSchema,
  anxiety: z.number().min(0).max(100),
  knowledgeFlags: z.set(z.string()),
  // ... all fields with validation
})

export const GameStateSchema = z.object({
  saveVersion: z.string(),
  playerId: z.string(),
  characters: z.map(z.string(), CharacterStateSchema),
  patterns: z.object({
    analytical: PatternScoreSchema,
    patience: PatternScoreSchema,
    exploring: PatternScoreSchema,
    helping: PatternScoreSchema,
    building: PatternScoreSchema,
  }),
  // ... all fields
})

export interface StateValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateGameState(
  state: SerializableGameState
): StateValidationResult {
  const result = GameStateSchema.safeParse(state)

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(e =>
        `${e.path.join('.')}: ${e.message}`
      ),
      warnings: []
    }
  }

  // Additional business logic validation
  const warnings: string[] = []

  // Warn if trust values are at extremes (possible bugs)
  for (const [id, char] of state.characters) {
    if (char.trust === 10) {
      warnings.push(`${id} trust at maximum (10) - verify intended`)
    }
  }

  return { valid: true, errors: [], warnings }
}
```

**Integration:**

```typescript
// File: lib/character-state.ts (GameStateUtils)
export class GameStateUtils {
  static applyStateChange(
    state: SerializableGameState,
    change: StateChange
  ): SerializableGameState {
    // Apply change (existing logic)
    const newState = { ...state, /* apply change */ }

    // Validate before returning
    const validation = validateGameState(newState)
    if (!validation.valid) {
      console.error('[STATE_VALIDATION] Invalid state change:', validation.errors)
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`Invalid state: ${validation.errors.join(', ')}`)
      }
      return state // Return old state in production
    }

    if (validation.warnings.length > 0) {
      console.warn('[STATE_VALIDATION]', validation.warnings)
    }

    return newState
  }
}
```

**Benefits:**
- ✅ Catch invalid state transitions early
- ✅ Prevent trust going negative or >10
- ✅ Ensure required fields always present
- ✅ Better error messages for debugging

---

## Design Token Consolidation

### Current State Analysis

**Scattered Design Tokens:**

| File | Token Type | Count |
|------|-----------|-------|
| `lib/ui-constants.ts` | Spacing, heights, z-index | ~50 tokens |
| `components/GameChoices.tsx` | Pattern colors (lines 19-105) | ~40 color values |
| `tailwind.config.ts` | Theme extensions | ~80 custom values |
| `app/globals.css` | CSS variables | ~30 variables |

**Total:** ~200 design tokens across 4 files

**OrbVoice Lesson:** They had 150+ scattered hex values, consolidated to 1 file.

### Consolidation Strategy

**Step 1: Create Unified Design System**

```typescript
// File: lib/design-system.ts
/**
 * Lux Story Design System
 * Single source of truth for all design tokens
 *
 * Inspired by OrbVoice design-tokens.ts
 */

// =============================================================================
// COLOR SYSTEM
// =============================================================================

export const colors = {
  // Character Colors (from tailwind.config.ts)
  characters: {
    lux: {
      DEFAULT: '#a855f7',
      light: '#e9d5ff',
      dark: '#581c87',
      glow: 'rgba(168, 85, 247, 0.3)'
    },
    swift: {
      DEFAULT: '#4ade80',
      light: '#bbf7d0',
      dark: '#14532d',
      glow: 'rgba(74, 222, 128, 0.3)'
    },
    sage: {
      DEFAULT: '#3b82f6',
      light: '#bfdbfe',
      dark: '#1e3a8a',
      glow: 'rgba(59, 130, 246, 0.3)'
    },
    buzz: {
      DEFAULT: '#facc15',
      light: '#fef3c7',
      dark: '#713f12',
      glow: 'rgba(250, 204, 21, 0.3)'
    }
  },

  // Pattern Colors
  patterns: {
    analytical: {
      DEFAULT: '#3b82f6', // blue-500
      light: '#93c5fd',   // blue-300
      dark: '#1e40af',    // blue-700
      glow: 'rgba(59, 130, 246, 0.25)',
      hover: {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        shadow: '0_4px_12px_rgba(59,130,246,0.2)'
      }
    },
    patience: {
      DEFAULT: '#10b981', // green-500
      light: '#6ee7b7',
      dark: '#047857',
      glow: 'rgba(16, 185, 129, 0.25)',
      hover: {
        bg: 'bg-green-50',
        border: 'border-green-300',
        shadow: '0_4px_12px_rgba(16,185,129,0.2)'
      }
    },
    exploring: {
      DEFAULT: '#8b5cf6', // purple-500
      light: '#c4b5fd',
      dark: '#6d28d9',
      glow: 'rgba(139, 92, 246, 0.25)',
      hover: {
        bg: 'bg-purple-50',
        border: 'border-purple-300',
        shadow: '0_4px_12px_rgba(139,92,246,0.2)'
      }
    },
    helping: {
      DEFAULT: '#ec4899', // pink-500
      light: '#f9a8d4',
      dark: '#be185d',
      glow: 'rgba(236, 72, 153, 0.25)',
      hover: {
        bg: 'bg-pink-50',
        border: 'border-pink-300',
        shadow: '0_4px_12px_rgba(236,72,153,0.2)'
      }
    },
    building: {
      DEFAULT: '#f59e0b', // amber-500
      light: '#fcd34d',
      dark: '#b45309',
      glow: 'rgba(245, 158, 11, 0.25)',
      hover: {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        shadow: '0_4px_12px_rgba(245,158,11,0.2)'
      }
    }
  },

  // Semantic Colors
  semantic: {
    success: { bg: '#10b981', text: '#ffffff' },
    warning: { bg: '#f59e0b', text: '#ffffff' },
    danger: { bg: '#ef4444', text: '#ffffff' },
    info: { bg: '#3b82f6', text: '#ffffff' },
    neutral: { bg: '#6b7280', text: '#ffffff' }
  },

  // Glass Morphism
  glass: {
    background: 'rgba(10, 12, 16, 0.85)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.37)'
  }
} as const

// =============================================================================
// SPACING SYSTEM (8pt grid)
// =============================================================================

export const spacing = {
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  '2xl': 48,  // 3rem
  '3xl': 64,  // 4rem
} as const

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

export const typography = {
  // Font sizes (from tailwind.config.ts)
  sizes: {
    narration: { size: '1.125rem', lineHeight: '2' },      // Story text
    dialogue: { size: '1rem', lineHeight: '1.625' },       // Character speech
    choice: { size: '0.875rem', lineHeight: '1.5' },       // Decision buttons
    hud: { size: '0.75rem', lineHeight: '1.4' },           // UI labels
    celebration: { size: '1.5rem', lineHeight: '1.3' }     // Achievements
  },

  // Font families
  fonts: {
    sans: 'var(--font-inter)',
    serif: 'var(--font-crimson-pro)',
    mono: 'var(--font-space-mono)',
    slab: 'var(--font-roboto-slab)'
  },

  // Weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
} as const

// =============================================================================
// ANIMATION SYSTEM
// =============================================================================

export const animation = {
  // Durations (from ui-constants.ts)
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
    message: 400,
    page: 500
  },

  // Easings (Framer Motion springs)
  springs: {
    snappy: { type: 'spring', stiffness: 300, damping: 25 },
    smooth: { type: 'spring', stiffness: 200, damping: 20 },
    gentle: { type: 'spring', stiffness: 150, damping: 18 },
    bouncy: { type: 'spring', stiffness: 400, damping: 10 }
  },

  // Stagger timing
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.12
  }
} as const

// =============================================================================
// LAYOUT SYSTEM
// =============================================================================

export const layout = {
  // Container widths
  containers: {
    sm: 384,
    md: 448,
    lg: 512,
    xl: 576,
    '2xl': 672,
    '4xl': 896
  },

  // Touch targets (Apple HIG: 44px minimum)
  touchTargets: {
    sm: 36,
    md: 44,
    lg: 52
  },

  // Z-index scale
  zIndex: {
    behind: -1,
    base: 0,
    dropdown: 50,
    sticky: 60,
    fixed: 70,
    modalBackdrop: 100,
    modal: 110,
    popover: 120,
    tooltip: 130,
    toast: 140,
    cursor: 999
  },

  // Border radius
  radius: {
    sm: 2,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    full: 9999
  }
} as const

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get pattern hover styles for choice buttons
 * Replaces scattered PATTERN_HOVER_STYLES in GameChoices.tsx
 */
export function getPatternHoverStyles(pattern: PatternType, glassMode = false) {
  const patternColors = colors.patterns[pattern]

  if (glassMode) {
    return {
      bg: 'hover:bg-white/10',
      border: `hover:border-${pattern}-400/40`,
      shadow: `hover:shadow-[0_0_20px_${patternColors.glow}]`,
      activeBg: 'active:bg-white/15'
    }
  }

  return patternColors.hover
}

/**
 * Get character color by ID
 */
export function getCharacterColor(characterId: string) {
  const colorMap: Record<string, typeof colors.characters.lux> = {
    'lux': colors.characters.lux,
    'samuel': colors.characters.sage,
    'maya': colors.characters.swift,
    // ... map all 16 characters
  }

  return colorMap[characterId] || colors.characters.lux
}
```

**Step 2: Migrate Components**

```typescript
// File: components/GameChoices.tsx (AFTER migration)
import { getPatternHoverStyles, colors } from '@/lib/design-system'

// ❌ OLD: Hardcoded pattern styles (lines 19-105 deleted)
// const PATTERN_HOVER_STYLES = { ... }

// ✅ NEW: Use design system
const ChoiceButton = ({ pattern, glassMode }: Props) => {
  const hoverStyles = getPatternHoverStyles(pattern, glassMode)

  return (
    <button
      className={cn(
        "base-styles",
        hoverStyles.bg,
        hoverStyles.border,
        hoverStyles.shadow
      )}
    >
      {/* content */}
    </button>
  )
}
```

**Step 3: Update Tailwind Config**

```typescript
// File: tailwind.config.ts
import { colors, spacing, typography, layout } from './lib/design-system'

export default {
  theme: {
    extend: {
      colors: colors.characters, // Character colors
      spacing,                   // Spacing scale
      fontSize: typography.sizes, // Typography
      borderRadius: layout.radius, // Radius
      zIndex: layout.zIndex       // Z-index
    }
  }
}
```

**Benefits:**
- ✅ Single source of truth (200 tokens → 1 file)
- ✅ Type-safe token access
- ✅ Easier to theme/customize
- ✅ Delete ~100 lines of duplicated color values from GameChoices.tsx

---

## Derivative System Architecture

### Current State (Already Excellent!)

Your derivative system **already follows OrbVoice patterns**:

| Lux Story Module | OrbVoice Equivalent | Status |
|-----------------|---------------------|--------|
| `trust-derivatives.ts` | `trust-derivatives.ts` | ✅ Same pattern |
| `pattern-derivatives.ts` | `pattern-derivatives.ts` | ✅ Same pattern |
| `character-derivatives.ts` | `character-derivatives.ts` | ✅ Same pattern |
| `narrative-derivatives.ts` | `narrative-derivatives.ts` | ✅ Same pattern |
| `knowledge-derivatives.ts` | `knowledge-derivatives.ts` | ✅ Same pattern |
| `interrupt-derivatives.ts` | `interrupt-derivatives.ts` | ✅ Same pattern |
| `assessment-derivatives.ts` | `assessment-derivatives.ts` | ✅ Same pattern |

**This is a strength, not a weakness!** You're already doing it right.

### Enhancement: Derivatives Engine

**OrbVoice Pattern:** They proposed (but haven't implemented) a unified derivatives engine.

**Apply to Lux Story:**

```typescript
// File: lib/derivatives-engine.ts
import { type SerializableGameState } from './character-state'
import * as TrustDerivatives from './trust-derivatives'
import * as PatternDerivatives from './pattern-derivatives'
import * as CharacterDerivatives from './character-derivatives'
import * as NarrativeDerivatives from './narrative-derivatives'
import * as KnowledgeDerivatives from './knowledge-derivatives'
import * as InterruptDerivatives from './interrupt-derivatives'
import * as AssessmentDerivatives from './assessment-derivatives'

/**
 * Computed derivatives from game state
 * All properties lazy-loaded via getters
 */
export interface ComputedDerivatives {
  // Trust system
  resonantTrust: ReturnType<typeof TrustDerivatives.calculateResonantTrustChange>
  trustTimeline: ReturnType<typeof TrustDerivatives.getTrustTimeline>
  trustMomentum: ReturnType<typeof TrustDerivatives.getTrustMomentum>

  // Pattern system
  dominantPattern: ReturnType<typeof PatternDerivatives.getDominantPattern>
  patternBalance: ReturnType<typeof PatternDerivatives.getPatternBalance>
  patternUnlocks: ReturnType<typeof PatternDerivatives.getUnlockedPatterns>

  // Character system
  characterAffinity: ReturnType<typeof CharacterDerivatives.getCharacterAffinity>
  relationshipStatus: ReturnType<typeof CharacterDerivatives.getRelationshipStatus>

  // Narrative system
  narrativePhase: ReturnType<typeof NarrativeDerivatives.getNarrativePhase>
  storyProgress: ReturnType<typeof NarrativeDerivatives.getStoryProgress>

  // Knowledge system
  icebergState: ReturnType<typeof KnowledgeDerivatives.getIcebergState>
  knowledgeDepth: ReturnType<typeof KnowledgeDerivatives.getKnowledgeDepth>

  // Interrupt system
  interruptWindows: ReturnType<typeof InterruptDerivatives.getAvailableInterrupts>

  // Assessment system
  skillReadiness: ReturnType<typeof AssessmentDerivatives.getSkillReadiness>
  careerFit: ReturnType<typeof AssessmentDerivatives.getCareerFit>
}

/**
 * Derivatives Engine
 * Lazily computes all derivative properties on-demand
 * Memoizes results to prevent recomputation
 */
export class DerivativesEngine {
  private state: SerializableGameState
  private cache: Partial<ComputedDerivatives> = {}

  constructor(state: SerializableGameState) {
    this.state = state
  }

  /**
   * Get all computed derivatives
   * Only computes properties that are accessed
   */
  get computed(): ComputedDerivatives {
    return {
      // Trust derivatives
      get resonantTrust() {
        return this.cache.resonantTrust ??= TrustDerivatives.calculateResonantTrustChange(
          /* ... */
        )
      },

      // Pattern derivatives
      get dominantPattern() {
        return this.cache.dominantPattern ??= PatternDerivatives.getDominantPattern(
          this.state.patterns
        )
      },

      // ... all other derivatives
    } as ComputedDerivatives
  }

  /**
   * Clear cache when state changes
   */
  invalidate() {
    this.cache = {}
  }
}

/**
 * Hook for using derivatives in components
 */
export function useDerivatives() {
  const coreGameState = useGameStore(s => s.coreGameState)

  if (!coreGameState) return null

  const engine = useMemo(
    () => new DerivativesEngine(coreGameState),
    [coreGameState]
  )

  return engine.computed
}
```

**Usage:**

```typescript
// File: components/Journal.tsx
import { useDerivatives } from '@/lib/derivatives-engine'

export function Journal() {
  const derivatives = useDerivatives()

  if (!derivatives) return <LoadingState />

  return (
    <div>
      <p>Dominant Pattern: {derivatives.dominantPattern}</p>
      <p>Trust Momentum: {derivatives.trustMomentum}</p>
      <p>Narrative Phase: {derivatives.narrativePhase}</p>
      {/* All derivatives in one place */}
    </div>
  )
}
```

**Benefits:**
- ✅ Single import for all derivatives
- ✅ Lazy computation (only what's needed)
- ✅ Memoization prevents redundant calculations
- ✅ Consistent API across components

---

## Content Validation & Testing

### Current State Analysis

**Dialogue Content (983 nodes across 16 characters)**

| Validation Type | Current Status | OrbVoice Equivalent |
|----------------|----------------|---------------------|
| **Node structure** | TypeScript types | ✅ Same (DialogueNode interface) |
| **Runtime validation** | ❌ None | ⚠️ Proposed (Zod schemas) |
| **Content integrity** | ✅ Tests exist | ✅ Similar (tests/content/) |
| **Pre-build checks** | ❌ Limited | ✅ Extensive (validate-*.ts scripts) |

### Enhancement: Content Schema Validation

**OrbVoice Lesson:** They added Zod runtime validation to catch content errors.

**Apply to Lux Story:**

```typescript
// File: lib/dialogue-schema.ts
import { z } from 'zod'
import { type CharacterId, CHARACTER_IDS } from './graph-registry'
import { type PatternType, PATTERN_TYPES } from './patterns'
import { type EmotionType } from './emotions'

/**
 * Zod schemas for runtime dialogue validation
 * Catches content authoring errors at build time
 */

export const StateEffectSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('applyTrust'),
    value: z.number().min(-2).max(2) // Trust changes limited
  }),
  z.object({
    type: z.literal('applyPattern'),
    pattern: z.enum(PATTERN_TYPES),
    value: z.number().min(0).max(10)
  }),
  z.object({
    type: z.literal('addKnowledgeFlag'),
    flag: z.string().min(3)
  }),
  z.object({
    type: z.literal('triggerThought'),
    thoughtId: z.string()
  })
])

export const DialogueContentSchema = z.object({
  text: z.string().min(1).max(2000), // Max length prevents accidental paste errors
  emotion: z.string().optional(), // TODO: Use EmotionType enum
  voiceIndicators: z.array(z.string()).optional(),
  richEffectContext: z.enum(['success', 'warning', 'danger', 'neutral']).optional()
})

export const DialogueChoiceSchema = z.object({
  choiceId: z.string().min(3),
  text: z.string().min(1).max(500),
  effects: z.array(StateEffectSchema),
  nextNodeId: z.string(),
  pattern: z.enum(PATTERN_TYPES).optional(),
  visibleCondition: z.function().optional(), // Can't validate function, just presence
  richEffectContext: z.enum(['success', 'warning', 'danger', 'neutral']).optional()
})

export const InterruptWindowSchema = z.object({
  targetNodeId: z.string(),
  type: z.enum(['connection', 'challenge', 'silence', 'comfort', 'grounding', 'encouragement']),
  triggerAfterDelay: z.number().min(0).max(10000), // Max 10s delay
  duration: z.number().min(1000).max(30000), // 1-30s window
  successChoice: z.object({
    text: z.string(),
    effects: z.array(StateEffectSchema),
    nextNodeId: z.string()
  }),
  missChoice: z.object({
    text: z.string(),
    effects: z.array(StateEffectSchema),
    nextNodeId: z.string()
  })
})

export const DialogueNodeSchema = z.object({
  nodeId: z.string().min(3),
  characterId: z.enum(CHARACTER_IDS),
  content: z.array(DialogueContentSchema).min(1),
  choices: z.array(DialogueChoiceSchema).min(1).max(6), // Max 6 choices prevents overwhelm
  requiredState: z.object({
    trust: z.object({
      min: z.number().min(0).max(10),
      max: z.number().min(0).max(10).optional()
    }).optional(),
    pattern: z.enum(PATTERN_TYPES).optional(),
    knowledgeFlags: z.array(z.string()).optional()
  }).optional(),
  interrupt: InterruptWindowSchema.optional(),
  onEnter: z.array(StateEffectSchema).optional(),
  onExit: z.array(StateEffectSchema).optional()
})

export const DialogueGraphSchema = z.object({
  nodes: z.array(DialogueNodeSchema)
})

/**
 * Validate a dialogue graph
 */
export function validateDialogueGraph(
  graph: unknown,
  characterId: CharacterId
): { valid: boolean; errors: string[] } {
  const result = DialogueGraphSchema.safeParse(graph)

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(e =>
        `${characterId} - ${e.path.join('.')}: ${e.message}`
      )
    }
  }

  // Additional business logic validation
  const errors: string[] = []

  // Check for orphaned nodes (nodes with no incoming choices)
  const nodeIds = new Set(result.data.nodes.map(n => n.nodeId))
  const reachableIds = new Set<string>()

  for (const node of result.data.nodes) {
    for (const choice of node.choices) {
      reachableIds.add(choice.nextNodeId)

      // Check if nextNodeId exists
      if (!nodeIds.has(choice.nextNodeId)) {
        errors.push(`${characterId} - ${node.nodeId}: Choice points to non-existent node "${choice.nextNodeId}"`)
      }
    }
  }

  // Warn about unreachable nodes (except introduction)
  for (const node of result.data.nodes) {
    if (!reachableIds.has(node.nodeId) && !node.nodeId.includes('introduction')) {
      errors.push(`${characterId} - ${node.nodeId}: Unreachable node (no choices point to it)`)
    }
  }

  return { valid: errors.length === 0, errors }
}
```

**Integration (Pre-Build Validation):**

```typescript
// File: scripts/validate-dialogue-graphs.ts (ENHANCED)
import { validateDialogueGraph } from '@/lib/dialogue-schema'
import { MAYA_DIALOGUE_GRAPH } from '@/content/maya-dialogue-graph'
import { SAMUEL_DIALOGUE_GRAPH } from '@/content/samuel-dialogue-graph'
// ... import all 16 character graphs

const graphs = [
  { id: 'maya', graph: MAYA_DIALOGUE_GRAPH },
  { id: 'samuel', graph: SAMUEL_DIALOGUE_GRAPH },
  // ... all 16
]

let totalErrors = 0

for (const { id, graph } of graphs) {
  const validation = validateDialogueGraph(graph, id)

  if (!validation.valid) {
    console.error(`\n❌ ${id} dialogue graph has errors:`)
    validation.errors.forEach(err => console.error(`  - ${err}`))
    totalErrors += validation.errors.length
  } else {
    console.log(`✅ ${id} dialogue graph valid`)
  }
}

if (totalErrors > 0) {
  console.error(`\n🚨 ${totalErrors} total validation errors`)
  process.exit(1)
}

console.log('\n✨ All dialogue graphs validated successfully')
```

**Benefits:**
- ✅ Catch authoring errors at build time
- ✅ Prevent broken node references
- ✅ Validate trust bounds, pattern types
- ✅ Identify unreachable content
- ✅ Enforce max text lengths

---

## Performance Optimization

### Current Opportunities

**Based on OrbVoice Lessons:**

| Optimization | Lux Story Applicability | Priority |
|-------------|------------------------|----------|
| **Parallel API Calls** | ✅ Admin dashboard data fetching | High |
| **Lazy Loading** | ✅ Journal sections, character dialogues | High |
| **Code Splitting** | ✅ Admin dashboard routes | Medium |
| **Memoization** | ✅ Derivative calculations | Medium |
| **Virtual Scrolling** | ⚠️ Not needed (dialogue is paginated) | Low |

### 1. Lazy Load Journal Sections

**Current:** All Journal sections loaded upfront (~17K LOC)

**Optimization:**

```typescript
// File: components/journal/Journal.tsx
import { lazy, Suspense } from 'react'
import { JournalSkeleton } from './JournalSkeleton'

// Lazy load each section
const JournalPatterns = lazy(() => import('./JournalPatterns'))
const JournalSkills = lazy(() => import('./JournalSkills'))
const JournalRelationships = lazy(() => import('./JournalRelationships'))
const JournalAccessibility = lazy(() => import('./JournalAccessibility'))

export function Journal() {
  const [activeTab, setActiveTab] = useState('patterns')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="patterns">Patterns</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="relationships">Relationships</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="patterns">
        <Suspense fallback={<JournalSkeleton />}>
          <JournalPatterns />
        </Suspense>
      </TabsContent>

      {/* ... other tabs */}
    </Tabs>
  )
}
```

**Impact:** ~70% reduction in initial bundle (only load active tab)

### 2. Parallel Admin API Fetches

**Current:** Sequential fetches in admin dashboard

**Optimization:**

```typescript
// File: app/admin/page.tsx
export default async function AdminDashboard({ userId }: Props) {
  // ❌ OLD: Sequential (slow)
  // const profile = await fetchProfile(userId)
  // const skills = await fetchSkills(userId)
  // const relationships = await fetchRelationships(userId)

  // ✅ NEW: Parallel (fast)
  const [profile, skills, relationships] = await Promise.all([
    fetchProfile(userId),
    fetchSkills(userId),
    fetchRelationships(userId)
  ])

  return (
    <div>
      <ProfileSection profile={profile} />
      <SkillsSection skills={skills} />
      <RelationshipsSection relationships={relationships} />
    </div>
  )
}
```

**Impact:** 3x faster admin dashboard load (if 3 API calls)

### 3. Memoize Derivative Calculations

**Current:** Derivatives recalculated on every render

**Optimization:**

```typescript
// File: lib/pattern-derivatives.ts
import { memoize } from './utils'

// ❌ OLD: Recalculates every time
export function getDominantPattern(patterns: PlayerPatterns): PatternType {
  // Expensive calculation
}

// ✅ NEW: Memoized (caches results)
export const getDominantPattern = memoize(
  (patterns: PlayerPatterns): PatternType => {
    // Expensive calculation
  },
  // Cache key: serialize patterns object
  (patterns) => JSON.stringify(patterns)
)
```

**Utility:**

```typescript
// File: lib/utils.ts
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = keyFn(...args)
    if (cache.has(key)) return cache.get(key)!

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}
```

**Impact:** ~80% reduction in derivative computation time

---

## Code Quality Patterns

### 1. Null Safety (OrbVoice Defensive Coding)

**Current Risk Areas:**

```typescript
// lib/game-store.ts - coreGameState can be null
coreGameState: SerializableGameState | null

// Potential crashes if accessed without check
const trust = state.coreGameState.characters.get('maya').trust // ❌ CRASH if null!
```

**Enhancement:**

```typescript
// File: lib/game-store-selectors.ts
/**
 * Type-safe selectors for game state
 * Handles null checks automatically
 */

export const selectCharacterTrust = (
  state: GameState,
  characterId: CharacterId
): number => {
  return state.coreGameState?.characters.get(characterId)?.trust ?? 0
}

export const selectDominantPattern = (
  state: GameState
): PatternType | null => {
  if (!state.coreGameState) return null
  return getDominantPattern(state.coreGameState.patterns)
}

export const selectKnowledgeFlags = (
  state: GameState
): Set<string> => {
  return state.coreGameState?.globalFlags ?? new Set()
}

// Usage in components
const trust = useGameStore(selectCharacterTrust, 'maya')
const pattern = useGameStore(selectDominantPattern)
```

**Benefits:**
- ✅ No crashes from null dereference
- ✅ Consistent fallback values
- ✅ Easier to test (pure functions)

### 2. Error Boundaries

**OrbVoice Pattern:** Multiple error boundary levels

**Apply to Lux Story:**

```typescript
// File: components/ErrorBoundary.tsx (ENHANCED)
import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  level: 'game' | 'ui' | 'page'
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    console.error(`[ErrorBoundary:${this.props.level}]`, error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">
            {this.props.level === 'game' ? 'Game Error' : 'Something went wrong'}
          </h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={this.handleReset}>
            {this.props.level === 'game' ? 'Restart Game' : 'Try Again'}
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Usage (Nested Boundaries):**

```typescript
// File: app/layout.tsx
export default function RootLayout({ children }: Props) {
  return (
    <ErrorBoundary level="page">
      <GameProviders>
        <ErrorBoundary level="game">
          {children}
        </ErrorBoundary>
      </GameProviders>
    </ErrorBoundary>
  )
}

// File: components/Journal.tsx
export function Journal() {
  return (
    <ErrorBoundary level="ui" fallback={<JournalErrorFallback />}>
      {/* Journal content */}
    </ErrorBoundary>
  )
}
```

**Benefits:**
- ✅ Graceful degradation (UI errors don't crash game)
- ✅ Better error messages per context
- ✅ Centralized error logging

---

## Migration Roadmap

### Phase 1: Foundation (Week 1)

**Goal:** Consolidate design tokens, add validation

| Task | Effort | Impact | Files |
|------|--------|--------|-------|
| Create `lib/design-system.ts` | 4h | High | 1 new, 4 updated |
| Migrate `GameChoices.tsx` patterns | 2h | Medium | 1 updated |
| Add `lib/dialogue-schema.ts` | 3h | High | 1 new |
| Enhance `validate-dialogue-graphs.ts` | 2h | High | 1 updated |
| Run validation + fix errors | 2h | High | 16 content files |

**Total:** 13 hours

**Deliverables:**
- ✅ 200 design tokens consolidated
- ✅ Runtime dialogue validation
- ✅ Pre-build content checks

### Phase 2: Component Refactoring (Week 2-3)

**Goal:** Split large components

| Task | Effort | Impact | Files |
|------|--------|--------|-------|
| Extract `ChoiceButton.tsx` | 3h | Medium | 1 new |
| Extract `ChoicePatternIndicator.tsx` | 2h | Low | 1 new |
| Extract `ChoiceEffects.tsx` | 3h | Medium | 1 new |
| Extract `useChoiceLogic.ts` | 4h | High | 1 new |
| Test choice system | 3h | High | 4 test files |
| Extract `JournalPatterns.tsx` | 4h | Medium | 1 new |
| Extract `JournalSkills.tsx` | 4h | Medium | 1 new |
| Extract `JournalRelationships.tsx` | 4h | Medium | 1 new |
| Test journal sections | 3h | High | 3 test files |

**Total:** 30 hours

**Deliverables:**
- ✅ `GameChoices.tsx`: 24.7K → 500 LOC
- ✅ `Journal.tsx`: 17K → 300 LOC
- ✅ 95% test coverage on extracted components

### Phase 3: State & Performance (Week 4)

**Goal:** Optimize state management

| Task | Effort | Impact | Files |
|------|--------|--------|-------|
| Add state validation layer | 4h | High | 1 new |
| Create derivatives engine | 5h | Medium | 1 new |
| Add lazy loading (Journal) | 2h | High | 5 updated |
| Memoize derivative calculations | 3h | Medium | 7 updated |
| Parallel admin API fetches | 2h | Medium | 3 updated |
| Performance testing | 3h | High | Lighthouse audits |

**Total:** 19 hours

**Deliverables:**
- ✅ State validation prevents bugs
- ✅ 70% bundle size reduction (lazy loading)
- ✅ 3x faster admin dashboard

### Phase 4: Polish & Documentation (Week 5)

**Goal:** Document patterns, improve DX

| Task | Effort | Impact | Files |
|------|--------|--------|-------|
| Document design system usage | 2h | Medium | 1 doc |
| Create component migration guide | 2h | Medium | 1 doc |
| Add JSDoc comments | 3h | Low | All files |
| Refactor admin dashboard (bonus) | 8h | Low | 10 files |

**Total:** 15 hours

**Deliverables:**
- ✅ Comprehensive refactoring guide
- ✅ Improved code documentation
- ✅ Easier onboarding for new developers

---

## Summary: Top 5 Priority Refactorings

### 1. Design Token Consolidation (13h)
**Why:** Scattered tokens cause inconsistency, hard to theme
**Impact:** 200 tokens → 1 file, easier theming
**Files:** `lib/design-system.ts`, `GameChoices.tsx`, `tailwind.config.ts`

### 2. GameChoices.tsx Component Split (15h)
**Why:** 24.7K LOC is untestable, hard to maintain
**Impact:** 95% code reduction, better testing
**Files:** 6 new components, 1 hook

### 3. Content Schema Validation (5h)
**Why:** Prevent content authoring errors
**Impact:** Catch broken nodes at build time
**Files:** `lib/dialogue-schema.ts`, `scripts/validate-dialogue-graphs.ts`

### 4. State Validation Layer (4h)
**Why:** Prevent invalid game states
**Impact:** Fewer bugs, better error messages
**Files:** `lib/state-validator.ts`, `lib/character-state.ts`

### 5. Journal Lazy Loading (2h)
**Why:** 17K LOC loaded upfront slows initial render
**Impact:** 70% bundle reduction, faster load
**Files:** `components/journal/*.tsx`

---

**Total Estimated Effort:** 77 hours (2 weeks full-time, 4 weeks part-time)

**Expected Benefits:**
- ✅ 40K+ LOC reduced through extraction
- ✅ 200 design tokens consolidated
- ✅ 70% faster initial load (lazy loading)
- ✅ 95% test coverage on core components
- ✅ Zero content authoring errors (validation)
- ✅ Easier onboarding (better structure)

---

**Version:** 1.0
**Last Updated:** January 7, 2026
**Status:** Living document - update as refactoring progresses

---

## Appendix: Quick Reference

### OrbVoice → Lux Story Pattern Map

| Pattern | OrbVoice File | Lux Story Application |
|---------|--------------|---------------------|
| Design Tokens | `apps/expo/src/lib/design-tokens.ts` | Create `lib/design-system.ts` |
| Component Extraction | `components/ui/OrbSection.tsx` | Extract from `GameChoices.tsx` |
| State Validation | `lib/game-store.ts` validation | Add to `GameStateUtils.applyStateChange()` |
| Content Schema | Proposed Zod schemas | `lib/dialogue-schema.ts` |
| Derivative Engine | Proposed consolidation | `lib/derivatives-engine.ts` |
| Error Boundaries | Multiple levels | Enhance existing `ErrorBoundary.tsx` |
| Testing Strategy | Vitest + Detox | Already using Vitest + Playwright ✅ |

### Commands Reference

```bash
# Development
npm run dev                          # Start dev server (port 3005)
npm run build                        # Production build

# Testing
npm test                             # Run Vitest tests
npm run test:coverage                # Coverage report
npm run test:e2e                     # Playwright E2E

# Validation
npm run validate-graphs              # Dialogue integrity
npm run validate-skills              # Skills system
npm run validate-env                 # Environment vars
npm run check-typewriter             # Typewriter compliance

# Type Checking
npm run type-check                   # TypeScript compilation check
```

### File Structure After Refactoring

```
lib/
├── design-system.ts             # NEW: Unified design tokens
├── pattern-ui-constants.ts      # NEW: Pattern hover styles
├── state-validator.ts           # NEW: Zod state validation
├── dialogue-schema.ts           # NEW: Content validation
├── derivatives-engine.ts        # NEW: Unified derivatives
├── game-store-selectors.ts      # NEW: Type-safe selectors
└── [existing files]

components/
├── game/
│   ├── GameChoices.tsx          # REFACTORED: 500 LOC (was 24.7K)
│   ├── ChoiceButton.tsx         # NEW: Extracted
│   ├── ChoicePatternIndicator.tsx  # NEW: Extracted
│   ├── ChoiceEffects.tsx        # NEW: Extracted
│   ├── ChoiceConditions.tsx     # NEW: Extracted
│   └── ChoiceHistory.tsx        # NEW: Extracted
│
├── journal/
│   ├── Journal.tsx              # REFACTORED: 300 LOC (was 17K)
│   ├── JournalPatterns.tsx      # NEW: Extracted
│   ├── JournalSkills.tsx        # NEW: Extracted
│   ├── JournalRelationships.tsx # NEW: Extracted
│   └── JournalAccessibility.tsx # NEW: Extracted
│
└── [existing files]

hooks/
├── useChoiceLogic.ts            # NEW: Business logic extraction
├── useDerivatives.ts            # NEW: Unified derivatives hook
└── [existing files]
```

🤖 *Generated with Claude Code - Refactoring patterns from OrbVoice applied to lux-story*
