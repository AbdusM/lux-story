# Archived Features

> **Last Updated**: 2025-11-25
> **Status**: Documentation of intentionally removed features

This document tracks features that were removed during development simplification. These were deliberate architectural decisions to reduce complexity and focus on core functionality.

---

## Removed in Commit `1e6b90a` (2025-11-25)

### Reason for Removal
These systems were part of an earlier, more complex architecture that included runtime AI-powered psychological analysis. They were removed as part of a "lean enhancement" strategy to:
1. Reduce bundle size
2. Simplify maintenance
3. Focus on core narrative experience
4. Remove unused dependencies

### Components Removed

| File | Purpose | Why Removed |
|------|---------|-------------|
| `components/DevelopmentalPsychologySupport.tsx` | Real-time developmental psychology insights | Never integrated into main game loop |
| `components/EmotionalSupport.tsx` | Emotional state monitoring UI | Replaced by simpler trust labels |
| `components/MetacognitiveScaffolding.tsx` | Metacognitive prompts during gameplay | Over-engineered for target audience |
| `components/NeuroscienceSupport.tsx` | Neuroscience-based learning indicators | Too complex, minimal user value |

### Libraries Removed

| File | Purpose | Why Removed |
|------|---------|-------------|
| `lib/cognitive-development-system.ts` | Piaget-based stage analysis | Runtime AI dependency removed |
| `lib/crisis-system.js` | Crisis detection and intervention | Replaced by simpler urgency scoring |
| `lib/developmental-psychology-system.ts` | Developmental milestone tracking | Merged into skill tracking |
| `lib/emotional-regulation-system.ts` | Emotional regulation prompts | Never fully implemented |
| `lib/neuroscience-system.ts` | Neuroscience-based pattern recognition | Too specialized |

---

## Removed in Commit `b100f34` (Earlier)

### Runtime AI Infrastructure
The application originally included runtime AI for:
- Dynamic dialogue generation
- Semantic similarity matching
- Real-time psychological analysis

These were removed in favor of:
- Pre-authored dialogue graphs
- Static skill mappings (SCENE_SKILL_MAPPINGS)
- Pattern-based behavioral tracking

---

## Removed in Commit `a0b6782` (Earlier)

### Complex Analytics System
Replaced with `lib/simple-analytics.ts`:
- Removed heavy ML-based analytics
- Simplified to count-based skill tracking
- Retained career matching but simplified algorithm

---

## Data Migration

**No data migration required** for these removals because:
1. Components were never deployed to production
2. No user data was stored using these systems
3. Existing skill/pattern tracking in Supabase is unaffected

---

## Restoration

If these features need to be restored:

```bash
# View the deleted files
git show 1e6b90a~1:components/DevelopmentalPsychologySupport.tsx
git show 1e6b90a~1:lib/cognitive-development-system.ts

# Restore a specific file
git checkout 1e6b90a~1 -- components/DevelopmentalPsychologySupport.tsx
```

Note: Restoration would require:
1. Re-adding any removed dependencies
2. Integration with current StatefulGameInterface
3. TypeScript type updates
4. Testing for compatibility with current architecture

---

## Current Architecture

The current system uses:
- **Skill Tracking**: `lib/skill-tracker.ts` with `SCENE_SKILL_MAPPINGS`
- **Pattern Recognition**: Simple counter-based patterns in GameState
- **Urgency Scoring**: `player_urgency_scores` table with narrative explanations
- **Trust System**: Numeric trust levels with text labels ("Ally", "Confidant")

This simpler architecture:
- Loads faster (no ML models)
- Works offline reliably
- Is easier to maintain
- Provides clearer educator insights
