# Archived Code

This directory contains deprecated code preserved for:
1. Historical reference
2. Design intent documentation
3. Potential future feature revival

## Contents

### game-state.legacy.ts
**Origin:** Sprint 1 state system
**Replaced by:** `lib/character-state.ts`
**Why archived:** The original scene-based state management was replaced with the dialogue graph system. The PatternTracker class may be useful for future analytics features.

### orb-allocation-design.ts
**Origin:** Early orb economy design
**Status:** Designed but not implemented
**Why archived:** Original design included orb spending/allocation mechanics (like Diablo's attribute system). Current implementation is earn-only. Preserved for potential future gamification features.

## Rules

1. **NEVER delete from here** - Only add with clear documentation
2. **DO NOT import from archive** - These files are reference only
3. **Add migration notes** - When archiving, document why and what replaced it
