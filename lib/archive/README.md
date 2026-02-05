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

### dev-tools.legacy.ts
**Origin:** Sprint 1 developer tools
**Replaced by:** `lib/dev-tools/god-mode-api.ts`
**Why archived:** Original dev tools replaced with role-gated God Mode system (TD-010).

### state-selectors.legacy.ts
**Origin:** Sprint 1 state selectors
**Replaced by:** `lib/game-store.ts` Zustand selectors
**Why archived:** React Context selectors replaced with Zustand-based architecture.

### narrative-bridge.legacy.ts
**Origin:** Early narrative system bridge
**Replaced by:** `lib/narrative-derivatives.ts`
**Why archived:** Original bridge pattern superseded by derivatives system.

### thought-system.legacy.ts (archived 2026-02-04)
**Origin:** Thought unlock system for pattern-gated content
**Status:** Never integrated into gameplay
**Why archived:** Feature was designed but never wired up. Zero imports detected.

### simple-analytics.legacy.ts (archived 2026-02-04)
**Origin:** Basic analytics interface
**Replaced by:** `lib/comprehensive-user-tracker.ts`
**Why archived:** Interface defined but never instantiated. Superseded by comprehensive tracker.

### performance-monitor.legacy.ts (archived 2026-02-04)
**Origin:** Performance monitoring system
**Status:** Never integrated
**Why archived:** Monitoring code designed but never connected to gameplay loop.

### student-insights-parser.legacy.ts (archived 2026-02-04)
**Origin:** Parser for skill profiles into human-readable insights
**Status:** Never called
**Why archived:** Utility parser was never integrated with UI components.

## Rules

1. **NEVER delete from here** - Only add with clear documentation
2. **DO NOT import from archive** - These files are reference only
3. **Add migration notes** - When archiving, document why and what replaced it
