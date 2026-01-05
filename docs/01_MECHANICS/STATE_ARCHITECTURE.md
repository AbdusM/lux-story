# State Architecture

## Overview

Grand Central Terminus uses a layered state management architecture that separates concerns across game logic, persistence, and UI reactivity.

## Sources of Truth

| Data | Owner | File | Consumers |
|------|-------|------|-----------|
| Player patterns | `character-state.ts` | `GameState.patterns` | Journal, Pattern Unlocks |
| Character trust | `character-state.ts` | `GameState.characters[x].trust` | Constellation, Echoes |
| Orb balance | `useOrbs` hook | localStorage | Journal |
| Skills earned | `game-store.ts` | Zustand store | Journey Summary |
| Scene history | `game-store.ts` | Zustand store | Navigation |
| Current dialogue node | `character-state.ts` | `GameState.currentNodeId` | StatefulGameInterface |
| Active thoughts | `character-state.ts` | `GameState.thoughts` | Thought Cabinet |
| Global flags | `character-state.ts` | `GameState.globalFlags` | Conditional content |

## State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Player Makes Choice                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              StatefulGameInterface.handleChoice()             │
│   - Reads choice's StateChange                                │
│   - Calculates trust changes with pattern affinity            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              GameStateUtils.applyStateChange()                │
│   - Validates inputs (characterId, patternType)               │
│   - Applies pattern changes                                   │
│   - Applies trust changes with bounds checking                │
│   - Updates relationship status                               │
│   - Triggers thought cabinet                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Persistence Layer                           │
│   - game-store.ts (Zustand) for session state                 │
│   - localStorage for orbs, progress                           │
│   - Supabase for user profiles (optional)                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     UI Updates                                │
│   - React state triggers re-render                            │
│   - Consequence echoes display                                │
│   - Attention indicators update                               │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

### Core State (`lib/character-state.ts`)
- `GameState` interface - Master state container
- `GameStateUtils` class - Immutable state transformations
- `NARRATIVE_CONSTANTS` - Trust bounds, defaults

### Validation (`lib/graph-registry.ts`, `lib/patterns.ts`, `lib/emotions.ts`)
- `isValidCharacterId()` - Character ID validation
- `isValidPattern()` - Pattern type validation
- `isValidEmotion()` - Emotion type validation

### Constants (`lib/constants.ts`)
- Centralized magic numbers
- Trust bounds, pattern thresholds
- Animation timings

### Persistence (`lib/game-store.ts`)
- Zustand store for session state
- Hydrates from localStorage on mount

### Hooks
- `useOrbs` - Orb balance and transactions
- `useGameState` - Core state hook
- `useConstellationData` - Character relationship data

## State Ownership Rules

1. **Never mutate state directly** - Always use `GameStateUtils.applyStateChange()`
2. **Trust is bounded** - Always 0-10, enforced by `NARRATIVE_CONSTANTS`
3. **Patterns are validated** - Only 5 valid patterns allowed
4. **Character IDs are validated** - Only registered characters allowed
5. **Immutable updates** - `applyStateChange` returns new object

## Migration Notes

### Vestigial Code (Archived)
- `lib/archive/game-state.legacy.ts` - Sprint 1 scene-based system
- `lib/archive/orb-allocation-design.ts` - Unused allocation mechanics

### Deprecated Fields
- `OrbBalance.totalAllocated` - Always 0
- `OrbBalance.availableToAllocate` - Always 0

## Adding New State

1. Add field to `GameState` interface in `character-state.ts`
2. Add to `createNewGameState()` initialization
3. Add to `cloneGameState()` if complex type
4. Add handling in `applyStateChange()` if mutable
5. Create validation function if needed
6. Document in this file
