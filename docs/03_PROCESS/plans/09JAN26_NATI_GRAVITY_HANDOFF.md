# Nati Gravity Browser Extension Handoff
**Date:** January 9, 2026
**Status:** Ready for Development

---

## Project State

### Recent Commits
```
46415eb fix: resolve type errors across codebase
60ed96d feat: complete simulation visualizers (7/7) and doc cleanup
```

### Build Status
- **Type Check:** PASSING
- **Tests:** 1082 passing
- **Build:** Clean

---

## Codebase Overview

### Key Directories
```
components/
├── game/simulations/     # 8 simulation visualizers (100% coverage)
├── constellation/        # Character/skill visualization
├── journal/              # Player stats side panel
└── StatefulGameInterface.tsx  # Main game container

lib/
├── game-store.ts         # Zustand state management
├── dialogue-graph.ts     # Dialogue system types
├── cognitive-domains.ts  # Cognitive assessment (new)
└── simulation-registry.ts # Simulation configs
```

### Active Systems
| System | Status | Files |
|--------|--------|-------|
| Simulations | 100% (20/20 chars) | `components/game/simulations/*` |
| Dialogue | Active | `content/*-dialogue-graph.ts` |
| Patterns | 5 types | `lib/patterns.ts` |
| Skills | 54 defined | `lib/2030-skills-system.ts` |

---

## Browser Extension Context

### Text Processing Pipeline
```
lib/text-processor.ts     # Core text transformation
lib/rich-text-renderer.ts # Effect rendering (shimmer, glow)
lib/voice-utils.ts        # Character voice typography
```

### Key Text Effects
- `shimmer` - Marquee animation for attention
- `glow` - Emphasis on keywords
- `thinking` - Processing indicator
- `warning` - Alert styling

### Character Voice System
Each character has unique typography:
- Typing speed (`lib/character-typing.ts`)
- Voice patterns (`lib/voice-utils.ts`)
- Pattern-specific variations (`content/pattern-voice-library.ts`)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Type check
npm run type-check
```

### Test Page
`/test-pixels` - Avatar verification page

---

## Documentation
- `CLAUDE.md` - Project overview and conventions
- `docs/03_PROCESS/60-simulation-roadmap.md` - Simulation system
- `docs/01_MECHANICS/` - Game mechanics docs

---

## Notes
- Mobile-first design (Birmingham youth 14-24)
- Dialogue-driven like Pokemon/Disco Elysium
- Glass morphic UI with subtle animations
- Respect `prefers-reduced-motion`
