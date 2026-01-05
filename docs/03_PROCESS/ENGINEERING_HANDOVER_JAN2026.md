# Engineering Handover - LUX Story (Grand Central Terminus)

**Date:** January 5, 2026
**Version:** 2.1.1
**Status:** Production-ready with expansion roadmap
**Primary Contact:** Abdus Muwwakkil / Development Team
**Repository:** `/Users/abdusmuwwakkil/Development/30_lux-story`

---

## Executive Summary

LUX Story is a **dialogue-driven career exploration game** disguised as a premium indie narrative experience. The game is fully operational with 11 characters, 16,000+ lines of dialogue, and a comprehensive pattern-tracking system that maps to World Economic Forum 2030 skills.

**Current State:**
- ✅ Production deployment on Vercel: https://lux-story.vercel.app
- ✅ Core gameplay loop complete (dialogue → choice → consequence → revelation)
- ✅ Mobile-first responsive design with 5-7 minute session optimization
- ✅ Admin dashboard with cohort analytics
- ✅ 1,512-feature expansion roadmap documented (INFINITE_CANVAS_FEATURE_CATALOG.md)

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Framer Motion (animations)
- Tailwind CSS
- Vercel deployment
- Zustand + LocalStorage (state)
- Vitest + Playwright (testing)

---

## 1. System Architecture Overview

### 1.1 Core Systems

```
┌─────────────────────────────────────────────────────────────┐
│ PLAYER INTERFACE (StatefulGameInterface.tsx)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Dialogue   │  │   Choices    │  │   Journal       │  │
│  │   Display    │  │  Container   │  │  (Side Panel)   │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ GAME STATE LAYER                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GameStateManager ──> DialogueGraphNavigator               │
│       │                      │                              │
│       │                      │                              │
│       ├──> SkillTracker      └──> StateConditionEvaluator  │
│       │                                                     │
│       └──> TrustSystem                                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ DATA LAYER                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  content/*.dialogue-graph.ts ──> Graph Registry            │
│  lib/patterns.ts ──> Pattern definitions                   │
│  lib/2030-skills-system.ts ──> WEF skill mappings          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Critical File Map

| File | Purpose | Status |
|------|---------|--------|
| `components/StatefulGameInterface.tsx` | Main game container, orchestrates all systems | ✅ Stable |
| `lib/game-logic.ts` | Core game loop, state transitions | ✅ Stable |
| `lib/dialogue-graph.ts` | Graph navigation engine | ✅ Stable |
| `lib/character-state.ts` | GameState type definitions, immutable utils | ✅ Stable |
| `lib/patterns.ts` | 5 pattern types (Analytical, Patience, etc.) | ✅ Stable |
| `lib/2030-skills-system.ts` | WEF 2030 skill mappings, career paths | ✅ Stable |
| `lib/experience-engine.ts` | Consequence echoes, pattern sensations | ✅ Stable |
| `content/*-dialogue-graph.ts` | 11 character dialogue trees | ✅ Content-locked |
| `lib/graph-registry.ts` | Central character graph registry | ✅ Stable |

### 1.3 State Architecture

See `docs/01_MECHANICS/STATE_ARCHITECTURE.md` for full documentation.

**GameState Structure:**
```typescript
interface GameState {
  patterns: Record<PatternType, number>;        // 5 patterns: 0-15 scale
  trust: Record<CharacterId, number>;           // Per-character: 0-10 scale
  knowledgeFlags: Set<string>;                  // Unlocked information
  completedArcs: string[];                      // Finished storylines
  currentNode: string;                          // Active dialogue node
  sessionHistory: ChoiceRecord[];               // Full choice log
  currentCharacter: CharacterId;
  visitedCharacters: Set<CharacterId>;
  lastPlayedTimestamp: number;
}
```

**Immutability:**
- All state changes via `GameStateUtils.applyStateChange()`
- No direct mutation of GameState
- Changes are atomic and traceable

---

## 2. Feature Catalog & Roadmap

### 2.1 INFINITE_CANVAS_FEATURE_CATALOG.md

**Location:** `docs/01_MECHANICS/INFINITE_CANVAS_FEATURE_CATALOG.md`

This is the **master specification document** containing 1,512 features extracted via Infinite Solutions Protocol (ISP):

- **Document 1 (PRD):** 375 core game features
- **Document 2 (Addendum):** 187 extended features (competitive analysis, 15 characters, systems)
- **Document 3 (Worldbuilding):** 250 production methodologies
- **Document 4 (Blackbird):** 700 design patterns + failure avoidance lessons

**Feature Numbering System:**
```
E-XXX  = Explicit (directly stated)
I-XXX  = Implicit (infrastructure)
D-XXX  = Derivative (combinations)
W-XXX  = Wild (moonshots)

E2-XXX = Document 2
E3-XXX = Document 3
W2-XXX = Document 2 wild features
```

**Usage:**
- Reference feature IDs in PRs/issues (e.g., "Implements E-042: Trust decay")
- Prioritize using impact × effort matrix
- Use as specification source for AI-assisted development

### 2.2 Current Implementation Status

**Completed (v2.1.1):**
- ✅ 5-pattern system with threshold unlocks (E-004, E-005, E-006)
- ✅ Trust system with consequence echoes (E-008)
- ✅ 11 characters with full dialogue graphs (E-038)
- ✅ Admin dashboard with cohort analytics (E-097)
- ✅ Mobile-first responsive UI (E-144)
- ✅ Pattern sensations (atmospheric feedback) (E-006)
- ✅ 32×32 pixel avatars (E-040)
- ✅ Dialogue pacing with character-specific typing (E-017)

**In Progress:**
- 🟡 Extended character roster (4 characters pending: E2-021 to E2-024)
- 🟡 Vulnerability arcs for core cast (E2-061 to E2-065)
- 🟡 Pattern voice expansion to 9 additional characters (E2-066)
- 🟡 Overdensity mechanics (Crowd Surge) in Market sector

**Prioritized Next (Q1 2026):**
- ⏳ Interrupt system (E2-031 to E2-033)
- ⏳ Loyalty experiences ("The Demo", "The Breach", etc.) (E2-034 to E2-039)
- ⏳ Sector 2 (Market) full implementation
- ⏳ New Game+ (Sector 3: Deep Station)

---

## 3. Development Setup

### 3.1 Environment Setup

```bash
# Prerequisites
node --version  # v18+ required
npm --version   # v9+ required

# Install dependencies
npm install

# Development server
npm run dev     # http://localhost:3000

# Production build
npm run build
npm run start

# Testing
npm test                    # All tests
npm test tests/lib          # Unit tests only
npm test -- --watch         # Watch mode

# Deployment
vercel --prod              # Deploy to production
```

### 3.2 Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build + type checking |
| `npm run lint` | ESLint + type validation |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm test` | Run Vitest unit tests |
| `npx playwright test` | Run E2E browser tests |

### 3.3 Environment Variables

**Required:**
- None (currently offline-first with LocalStorage)

**Optional (for Supabase sync - planned):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 4. Code Patterns & Conventions

### 4.1 Type Safety

**Strict TypeScript enabled** - no `any` types allowed.

**Use centralized type validators:**
```typescript
import { isValidPattern, PatternType } from '@/lib/patterns';
import { isValidEmotion, EmotionType } from '@/lib/emotions';
import { isValidCharacterId, CharacterId } from '@/lib/graph-registry';

// Always validate external input
if (!isValidPattern(input)) {
  throw new Error(`Invalid pattern: ${input}`);
}
```

### 4.2 Constants

**Never use magic numbers** - all values in `lib/constants.ts`:
```typescript
import { MAX_TRUST, MIN_TRUST, IDENTITY_THRESHOLD } from '@/lib/constants';
```

### 4.3 State Mutations

**Always use immutable utils:**
```typescript
// ❌ WRONG
gameState.trust.samuel += 1;

// ✅ CORRECT
const updatedState = GameStateUtils.applyStateChange(gameState, {
  type: 'trust',
  characterId: 'samuel',
  delta: 1
});
```

### 4.4 Animation Standards

**Use Framer Motion, not Tailwind animate-***
```typescript
import { motion, useReducedMotion } from 'framer-motion';
import { springs, STAGGER_DELAY } from '@/lib/animations';

const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={!prefersReducedMotion ? { opacity: 0, y: 8 } : false}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * STAGGER_DELAY.normal, ...springs.gentle }}
>
```

**Duration standards:**
- Buttons, micro-interactions: `springs.snappy` (~150ms)
- Panels, modals: `springs.smooth` (~300ms)
- Fades, reveals: `springs.gentle` (~250ms)
- Stagger delay: `STAGGER_DELAY.normal` (80ms between items)

### 4.5 UI Best Practices

**Touch targets:** 44px minimum (Apple HIG)
```typescript
import { BUTTON_HEIGHT } from '@/lib/ui-constants';

<button className={cn("...", BUTTON_HEIGHT.md)}>
```

**Safe areas (mobile):**
```typescript
style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
```

**Prevent layout shift:**
```typescript
// Use min-height on containers
<CardContent className="min-h-[300px]">
  {loading ? <Skeleton /> : <Content />}
</CardContent>
```

---

## 5. Testing Strategy

### 5.1 Test Coverage Goals

| System | Coverage Target | Current |
|--------|----------------|---------|
| Core game logic | 90% | 85% |
| Pattern system | 100% | 100% |
| Trust system | 100% | 95% |
| Dialogue navigation | 90% | 80% |
| UI components | 70% | 60% |

### 5.2 Critical Test Files

```
tests/
├── lib/
│   ├── patterns.test.ts           # Pattern validation
│   ├── dialogue-graph.test.ts     # Graph navigation
│   ├── character-state.test.ts    # State immutability
│   └── experience-engine.test.ts  # Consequence echoes
│
└── browser-runtime/
    └── pixel-avatar.spec.ts       # E2E avatar rendering
```

### 5.3 Running Tests

```bash
# Unit tests (fast)
npm test

# E2E tests (slower, requires browser)
npx playwright test

# Specific test file
npm test tests/lib/patterns.test.ts

# Watch mode during development
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## 6. Content Management

### 6.1 Adding New Dialogue

**Location:** `content/[character]-dialogue-graph.ts`

**Process:**
1. Define nodes following existing pattern
2. Add to character's graph registry entry
3. Validate with `npm run build` (type checking)
4. Test with validation script: `npx tsx scripts/validate-dialogue-graphs.ts`

**Example Node:**
```typescript
{
  id: 'samuel_intro_001',
  speakerId: 'samuel',
  text: 'Welcome to Grand Central Terminus.',
  choices: [
    {
      id: 'choice_accept',
      text: 'Tell me more.',
      nextNodeId: 'samuel_intro_002',
      patterns: { exploring: 1 }
    },
    {
      id: 'choice_reject',
      text: 'I don't have time for this.',
      nextNodeId: 'samuel_intro_003',
      patterns: { analytical: 1 }
    }
  ],
  stateChanges: [
    { type: 'trust', characterId: 'samuel', delta: 1 }
  ]
}
```

### 6.2 Character Voice Consistency

**Reference:** `docs/02_WORLD/03_CHARACTERS/`

Each character has defined:
- Speech patterns
- Vocabulary preferences
- Typing speed
- Personality archetype

**Voice validation tool:** (planned - see I2-011 in catalog)

### 6.3 Content Locking

**Narrative structure locked at Beta** for voice recording and localization.

**Process:**
1. Draft → Review → Approved → Implemented
2. Track status in `content/STATUS.md` (create if needed)
3. Voice recording requires 6-12 months lead time
4. German text ~30% longer; Chinese ~30% shorter

---

## 7. Deployment

### 7.1 Production Environment

**URL:** https://lux-story.vercel.app
**Platform:** Vercel
**Auto-deploy:** Push to `main` branch
**Build command:** `npm run build`
**Output directory:** `.next`

### 7.2 Deployment Checklist

```bash
# 1. Ensure all tests pass
npm test
npx playwright test

# 2. Build succeeds
npm run build

# 3. Type checking passes
npx tsc --noEmit

# 4. Lint clean
npm run lint

# 5. Deploy to preview
vercel

# 6. Deploy to production (after testing preview)
vercel --prod
```

### 7.3 Rollback Procedure

```bash
# Via Vercel CLI
vercel rollback [deployment-url]

# Via Vercel Dashboard
# 1. Go to https://vercel.com/dashboard
# 2. Select project
# 3. Go to Deployments
# 4. Click "..." on previous deployment
# 5. Select "Promote to Production"
```

---

## 8. Known Issues & Technical Debt

### 8.1 High Priority

| Issue | Impact | Tracking |
|-------|--------|----------|
| Pattern voice library incomplete | 9 characters missing voices | E2-066 |
| Vulnerability arcs missing | 13 characters lack depth | E2-060 |
| Supabase sync not implemented | No cloud backup | E-120 |
| Interrupt system not built | Missing moment-to-moment agency | E2-031 |

### 8.2 Medium Priority

| Issue | Impact | Tracking |
|-------|--------|----------|
| Trust decay not implemented | No consequence for absence | E-011 |
| Loyalty experiences incomplete | Only 5 of 15 characters have them | E2-034 |
| Session boundary announcements basic | Needs polish | See SessionBoundaryAnnouncement.tsx |

### 8.3 Low Priority (Polish)

| Issue | Impact | Tracking |
|-------|--------|----------|
| Choice container scroll shadows | Visual polish | UI-001 |
| Pattern glow transitions | Animation smoothness | UI-002 |
| Journal tab animations | Polish | UI-003 |

### 8.4 Archived Code

**Location:** `lib/archive/`

- `game-state.legacy.ts` - Sprint 1 state system (replaced)
- `orb-allocation-design.ts` - Unused allocation mechanics (preserved for reference)

**Do not delete** - contains lessons learned and alternative approaches.

---

## 9. Security & Privacy

### 9.1 Data Handling

**Current:** Offline-first with LocalStorage only
- No server-side storage
- No PII collection
- No authentication required
- All data client-side only

**Planned (Supabase integration):**
- Row-level security (RLS) policies
- Encrypted at rest and in transit
- OAuth 2.0 for admin access
- COPPA compliance for users under 13 (parental consent flow)

### 9.2 Security Best Practices

**Input validation:**
- All external input validated via type guards
- Pattern/emotion/character ID validation before state mutations
- Trust/pattern bounds checking (0-10, 0-15 respectively)

**XSS Prevention:**
- React auto-escapes by default
- Rich text rendered via controlled component (RichTextRenderer.tsx)
- No `dangerouslySetInnerHTML` usage

---

## 10. Performance Targets

### 10.1 Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Initial load (4G) | <3s | ~2.1s | ✅ |
| Dialogue transition | <100ms | ~50ms | ✅ |
| Choice feedback | <16ms (60fps) | ~16ms | ✅ |
| Build time | <60s | ~45s | ✅ |
| Bundle size | <500KB | ~380KB | ✅ |

### 10.2 Optimization Notes

**Code splitting:**
- Admin dashboard lazy-loaded
- Character avatars lazy-loaded
- Constellation view lazy-loaded

**Image optimization:**
- All PNGs optimized via Next.js Image
- SVG pixel avatars (small file size)
- No unoptimized images in `public/`

---

## 11. Monitoring & Analytics

### 11.1 Current Monitoring

**Production:**
- Vercel Analytics (basic)
- No custom error tracking (yet)

**Planned:**
- Sentry for error tracking
- PostHog for product analytics
- Custom event tracking for:
  - Choice selection rates (identify fake choices)
  - Character completion rates
  - Session duration
  - Drop-off points

### 11.2 Key Metrics to Track

**Engagement KPIs (from PRD):**
- First session completion: >60% target
- D1 return rate: >40% target
- Character arc completion: >25% target
- Average session length: 5-7 minutes target

**Assessment Quality KPIs:**
- Pattern distribution: No pattern >40% of population
- Choice diversity: No option >70% selection rate
- Career path coverage: All 6 paths recommended

---

## 12. Documentation Index

### 12.1 Core Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| CLAUDE.md | Project overview, quick reference | `/CLAUDE.md` |
| INFINITE_CANVAS_FEATURE_CATALOG.md | 1,512-feature roadmap | `docs/01_MECHANICS/` |
| STATE_ARCHITECTURE.md | State management guide | `docs/01_MECHANICS/` |
| DESIGN_PRINCIPLES.md | 10 design commandments | `docs/00_CORE/` |
| LIVING_DESIGN_DOCUMENT.md | Active design decisions | `docs/00_CORE/` |

### 12.2 Process Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| HANDOFF_2026_01_04.md | Latest session handoff | `docs/03_PROCESS/` |
| MASTER_IMPLEMENTATION_INDEX.md | Current roadmap | `docs/03_PROCESS/` |
| 01-testing.md | Testing strategy | `docs/03_PROCESS/` |
| 02-methodology.md | Development methodology | `docs/03_PROCESS/` |

### 12.3 World Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| STATION_HISTORY_BIBLE.md | Lore foundation | `docs/02_WORLD/` |
| Character files | 11 character profiles | `docs/02_WORLD/03_CHARACTERS/` |
| Location files | Grand Hall, Market, etc. | `docs/02_WORLD/02_LOCATIONS/` |

---

## 13. Common Tasks

### 13.1 Adding a New Character

```bash
# 1. Create dialogue graph
touch content/[character]-dialogue-graph.ts

# 2. Add to graph registry
# Edit: lib/graph-registry.ts

# 3. Add character profile
touch docs/02_WORLD/03_CHARACTERS/[character].md

# 4. Create pixel avatar
# Add SVG to: components/PixelAvatar.tsx

# 5. Add to 2030 skills system
# Edit: lib/2030-skills-system.ts

# 6. Validate
npx tsx scripts/validate-dialogue-graphs.ts
npm run build
```

### 13.2 Debugging Dialogue Issues

```typescript
// Enable debug logging
localStorage.setItem('debug_dialogue', 'true');

// Check current node
console.log('Current node:', gameState.currentNode);

// Check available transitions
console.log('Transitions:', currentNode.choices);

// Check condition evaluation
console.log('Conditions:', currentNode.conditions);
```

### 13.3 Testing Pattern Changes

```bash
# 1. Modify pattern logic
# Edit: lib/patterns.ts

# 2. Run pattern tests
npm test tests/lib/patterns.test.ts

# 3. Verify in-game
npm run dev
# Navigate to character dialogue
# Check pattern increments in browser DevTools:
# localStorage.getItem('gameState')
```

---

## 14. Emergency Contacts

### 14.1 Critical Issues

**Production Down:**
1. Check Vercel status: https://vercel.com/status
2. Check build logs: `vercel logs [deployment-url]`
3. Rollback if needed: `vercel rollback`

**Data Loss:**
1. LocalStorage only - player-side issue
2. Advise: "Check browser data/privacy settings"
3. Future: Supabase sync will prevent this

**Build Failures:**
1. Check TypeScript errors: `npx tsc --noEmit`
2. Check dependency issues: `npm ci` (clean install)
3. Check Next.js version compatibility

### 14.2 Support Resources

| Resource | URL/Contact |
|----------|-------------|
| Next.js Docs | https://nextjs.org/docs |
| Framer Motion Docs | https://www.framer.com/motion/ |
| Vercel Support | https://vercel.com/support |
| TypeScript Handbook | https://www.typescriptlang.org/docs/ |

---

## 15. Onboarding Checklist

### New Engineer - Day 1

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npm run dev` and access localhost:3000
- [ ] Create account and play through Samuel introduction
- [ ] Read `CLAUDE.md` (project overview)
- [ ] Read `docs/00_CORE/DESIGN_PRINCIPLES.md`
- [ ] Review this handover document

### New Engineer - Week 1

- [ ] Read `docs/01_MECHANICS/STATE_ARCHITECTURE.md`
- [ ] Skim `INFINITE_CANVAS_FEATURE_CATALOG.md` (1,512 features)
- [ ] Review one character dialogue graph (`content/samuel-dialogue-graph.ts`)
- [ ] Run test suite: `npm test`
- [ ] Make a small code change (fix a typo, improve a comment)
- [ ] Build and deploy to Vercel preview

### New Engineer - Month 1

- [ ] Complete one feature from catalog (low complexity)
- [ ] Add test coverage for new feature
- [ ] Review production deployment process
- [ ] Understand admin dashboard architecture
- [ ] Read worldbuilding docs (`docs/02_WORLD/`)

---

## 16. Quick Reference

### 16.1 Frequently Used Commands

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy to production
vercel --prod

# Type check
npx tsc --noEmit

# Validate dialogue
npx tsx scripts/validate-dialogue-graphs.ts

# Check bundle size
npx next build --analyze
```

### 16.2 Important Constants

```typescript
// Pattern thresholds
EMERGING = 3      // Pattern voice whispers
DEVELOPING = 6    // Pattern voice urges
FLOURISHING = 9   // Pattern voice commands

// Trust levels
MIN_TRUST = 0     // Stranger
MAX_TRUST = 10    // Confidant
IDENTITY_THRESHOLD = 5  // Trust level for identity formation

// Pattern scoring
MIN_PATTERN = 0
MAX_PATTERN = 15
```

### 16.3 Feature Catalog Quick Links

| Feature Category | Catalog Range | Priority |
|-----------------|---------------|----------|
| Core patterns | E-001 to E-015 | ✅ Complete |
| Trust system | E-008 to E-013 | ✅ Complete |
| Dialogue system | E-016 to E-024 | ✅ Complete |
| Extended characters | E2-021 to E2-024 | 🟡 In progress |
| Interrupt system | E2-031 to E2-033 | ⏳ Planned Q1 |
| Loyalty experiences | E2-034 to E2-039 | ⏳ Planned Q1 |
| Wild moonshots | W-001 to W-030 | 💡 Future |

---

## 17. Success Criteria

### 17.1 Definition of Done

**For any feature:**
- [ ] Code written following conventions
- [ ] TypeScript types complete (no `any`)
- [ ] Unit tests written (if applicable)
- [ ] E2E tests updated (if UI change)
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] Deployed to preview environment
- [ ] Tested on mobile (responsive)
- [ ] Tested with `prefers-reduced-motion`
- [ ] Merged to main
- [ ] Deployed to production

### 17.2 Code Review Checklist

- [ ] Follows type safety patterns
- [ ] Uses constants instead of magic numbers
- [ ] State mutations are immutable
- [ ] Animations respect reduced motion
- [ ] Touch targets ≥44px
- [ ] No layout shift during loading
- [ ] Mobile-first responsive design
- [ ] Accessibility considered

---

## 18. Appendix

### 18.1 Glossary

| Term | Definition |
|------|------------|
| **Pattern** | Behavioral tendency tracked through choices (5 types: Analytical, Patience, Exploring, Helping, Building) |
| **Trust** | Bilateral relationship metric (0-10) between player and character |
| **Knowledge Flag** | Boolean flag indicating player has unlocked information |
| **Consequence Echo** | Character reference to player's past choices |
| **Pattern Sensation** | Atmospheric feedback text when player leans into pattern |
| **Pattern Voice** | Internal monologue from one of 5 pattern archetypes |
| **Loyalty Experience** | Signature culmination experience per character |
| **ISP** | Infinite Solutions Protocol - feature extraction methodology |
| **Iceberg Architecture** | 90% implied lore supporting 10% visible content |

### 18.2 Acronyms

| Acronym | Full Name |
|---------|-----------|
| WEF | World Economic Forum |
| PRD | Product Requirements Document |
| DAG | Directed Acyclic Graph |
| RLS | Row-Level Security |
| COPPA | Children's Online Privacy Protection Act |
| HIG | Human Interface Guidelines |
| SME | Subject Matter Expert |
| E2E | End-to-End |

### 18.3 External Resources

- **Design Inspiration:** Disco Elysium, Mass Effect, Pok茅mon
- **Dialogue Framework:** Inkle (80 Days, Heaven's Vault)
- **Worldbuilding Reference:** ZA/UM (Disco Elysium), Larian (Baldur's Gate 3)
- **Production Methodology:** `docs/reference/source-documents/world building.md`

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Jan 5, 2026 | Initial handover document | Development Team |

---

**Document Status:** ✅ Ready for Engineering Team
**Next Review:** February 2026 or upon major architecture change

---

**Questions?** Refer to:
1. This document first
2. `CLAUDE.md` for quick reference
3. `docs/01_MECHANICS/INFINITE_CANVAS_FEATURE_CATALOG.md` for feature details
4. `docs/00_CORE/DESIGN_PRINCIPLES.md` for design philosophy
