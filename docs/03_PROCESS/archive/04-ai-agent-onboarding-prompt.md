# AI Agent Onboarding Prompt - Lux Story

**Copy this prompt to quickly onboard a new AI agent to the Lux Story codebase.**

---

## Project Context

You are working on **Lux Story (Grand Central Terminus)**, a dialogue-driven career exploration game disguised as a premium indie narrative experience. The game is currently in production (v2.1.1) and deployed at https://lux-story.vercel.app.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Framer Motion for animations
- Tailwind CSS
- Vercel deployment
- Zustand + LocalStorage for state

**Current Status:**
- ✅ Production-ready with 11 characters, 16,000+ dialogue lines
- ✅ 5-pattern behavioral tracking system (Analytical, Patience, Exploring, Helping, Building)
- ✅ Trust system with consequence echoes across all characters
- ✅ Mobile-first responsive design
- ✅ 1,512-feature expansion roadmap documented

---

## Essential Reading (Start Here)

**Before writing any code, read these files in order:**

1. **`CLAUDE.md`** (Root) - Project overview, design philosophy, quick reference
   - Contains 10 design commandments (Feel Comes First, Respect Player Intelligence, etc.)
   - Lists all 11 characters and their roles
   - Explains 5 behavioral patterns
   - Development commands and testing strategy

2. **`docs/03_PROCESS/ENGINEERING_HANDOVER_JAN2026.md`** - Comprehensive technical reference
   - System architecture diagrams
   - Critical file map
   - Code patterns & conventions
   - Testing strategy
   - Common tasks (adding characters, debugging dialogue)
   - Onboarding checklist

3. **`docs/01_MECHANICS/INFINITE_CANVAS_FEATURE_CATALOG.md`** - 1,512-feature roadmap
   - Feature numbering system (E-XXX, I-XXX, D-XXX, W-XXX)
   - Current implementation status
   - Prioritized features for Q1 2026

4. **`docs/01_MECHANICS/STATE_ARCHITECTURE.md`** - State management guide
   - GameState structure
   - Immutable state mutation patterns
   - Type validation

---

## Critical Code Conventions

### 1. Type Safety (Strict Mode - No `any`)

```typescript
// ✅ CORRECT - Use type validators
import { isValidPattern, PatternType } from '@/lib/patterns';
import { isValidCharacterId, CharacterId } from '@/lib/graph-registry';

if (!isValidPattern(input)) {
  throw new Error(`Invalid pattern: ${input}`);
}

// ❌ WRONG - Never use 'any'
const patterns: any = {...}
```

### 2. State Mutations (Always Immutable)

```typescript
// ✅ CORRECT - Use GameStateUtils
import { GameStateUtils } from '@/lib/character-state';

const updatedState = GameStateUtils.applyStateChange(gameState, {
  type: 'trust',
  characterId: 'samuel',
  delta: 1
});

// ❌ WRONG - Direct mutation
gameState.trust.samuel += 1;
```

### 3. Constants (No Magic Numbers)

```typescript
// ✅ CORRECT - Import from constants
import { MAX_TRUST, MIN_TRUST, IDENTITY_THRESHOLD } from '@/lib/constants';

// ❌ WRONG - Magic numbers
if (trust > 10) { ... }
```

### 4. Animations (Framer Motion, Not Tailwind)

```typescript
// ✅ CORRECT - Framer Motion with reduced motion support
import { motion, useReducedMotion } from 'framer-motion';
import { springs, STAGGER_DELAY } from '@/lib/animations';

const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={!prefersReducedMotion ? { opacity: 0, y: 8 } : false}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * STAGGER_DELAY.normal, ...springs.gentle }}
>

// ❌ WRONG - Tailwind animate-*
<div className="animate-fade-in">
```

### 5. UI Standards

```typescript
// Touch targets: 44px minimum (Apple HIG)
import { BUTTON_HEIGHT } from '@/lib/ui-constants';
<button className={cn("...", BUTTON_HEIGHT.md)}>

// Safe areas (mobile)
style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}

// Prevent layout shift
<CardContent className="min-h-[300px]">
  {loading ? <Skeleton /> : <Content />}
</CardContent>
```

---

## Feature Catalog System

When implementing features, always reference by ID:

```
E-XXX  = Explicit features (directly stated in PRD)
I-XXX  = Implicit infrastructure (required supporting systems)
D-XXX  = Derivative features (combinations of existing features)
W-XXX  = Wild moonshots (maximum ambition interpretations)

E2-XXX = Document 2 features (Addendum)
E3-XXX = Document 3 features (World Building)
E4-XXX = Document 4 features (Blackbird MMO)
```

**Example PR titles:**
- "feat: Implement Interrupt System (E2-031 to E2-033)"
- "fix: Trust decay edge case (E-011)"
- "feat: Add Loyalty Experience for Maya (E2-034)"

---

## Critical Files Map

| File | Purpose | DO NOT DELETE |
|------|---------|---------------|
| `components/StatefulGameInterface.tsx` | Main game container | ✅ Core |
| `lib/game-logic.ts` | Core game loop | ✅ Core |
| `lib/dialogue-graph.ts` | Graph navigation engine | ✅ Core |
| `lib/character-state.ts` | GameState types, immutable utils | ✅ Core |
| `lib/patterns.ts` | 5 pattern types + validators | ✅ Core |
| `lib/2030-skills-system.ts` | WEF skill mappings | ✅ Core |
| `lib/experience-engine.ts` | Consequence echoes | ✅ Core |
| `lib/graph-registry.ts` | Character graph registry | ✅ Core |
| `content/*-dialogue-graph.ts` | 11 character dialogue trees | ✅ Content-locked |

**Archived (DO NOT DELETE):**
- `lib/archive/game-state.legacy.ts` - Sprint 1 state system (reference only)
- `lib/archive/orb-allocation-design.ts` - Unused allocation mechanics (lessons learned)

---

## Current Priorities (Q1 2026)

**Prioritized Next:**
1. ⏳ **Interrupt System** (E2-031 to E2-033) - Allow players to interrupt character dialogue
2. ⏳ **Loyalty Experiences** (E2-034 to E2-039) - Signature culmination moments per character
3. ⏳ **Extended Roster** (E2-021 to E2-024) - Elevate 4 characters to full status (Tess, Alex, Jordan, Kai)
4. ⏳ **Vulnerability Arcs** (E2-061 to E2-065) - Add depth to existing characters

**Known Issues:**
- Pattern voice library incomplete (9 characters missing) - E2-066
- Supabase sync not implemented (no cloud backup) - E-120
- Trust decay not implemented - E-011

---

## Development Workflow

### Before Starting Work
```bash
# 1. Ensure environment is up-to-date
npm install

# 2. Run development server
npm run dev

# 3. Run tests to establish baseline
npm test

# 4. Check current git status
git status
```

### While Working
```bash
# Run tests in watch mode
npm test -- --watch

# Type check
npx tsc --noEmit

# Lint check
npm run lint
```

### Before Committing
```bash
# 1. All tests pass
npm test

# 2. Build succeeds
npm run build

# 3. Type checking passes
npx tsc --noEmit

# 4. Lint clean
npm run lint

# 5. Validate dialogue graphs (if content changes)
npx tsx scripts/validate-dialogue-graphs.ts
```

---

## Common Tasks

### Adding New Dialogue

**File**: `content/[character]-dialogue-graph.ts`

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
      patterns: { exploring: 1 }  // Increment Exploring pattern
    },
    {
      id: 'choice_reject',
      text: 'I don't have time for this.',
      nextNodeId: 'samuel_intro_003',
      patterns: { analytical: 1 }  // Increment Analytical pattern
    }
  ],
  stateChanges: [
    { type: 'trust', characterId: 'samuel', delta: 1 }  // Increase trust
  ]
}
```

**Validate with:**
```bash
npx tsx scripts/validate-dialogue-graphs.ts
npm run build  # Type checking
```

### Debugging Dialogue Issues

```typescript
// Enable debug logging in browser console
localStorage.setItem('debug_dialogue', 'true');

// Check current state
console.log('Current node:', gameState.currentNode);
console.log('Transitions:', currentNode.choices);
console.log('State:', JSON.parse(localStorage.getItem('gameState')));
```

### Testing Pattern Changes

```typescript
// 1. Modify pattern logic in lib/patterns.ts
// 2. Run pattern tests
npm test tests/lib/patterns.test.ts

// 3. Verify in-game
// Navigate to character dialogue
// Check pattern increments in DevTools:
JSON.parse(localStorage.getItem('gameState')).patterns
```

---

## Design Philosophy (10 Commandments)

When making design decisions, always reference these principles from `CLAUDE.md`:

1. **Feel Comes First** - Game must feel good within first 30 seconds
2. **Respect Player Intelligence** - Don't overexplain, let players discover
3. **Every Element Serves Multiple Purposes** - No single-purpose features
4. **Accessible Depth** - Easy to learn, difficult to master
5. **Meaningful Choices** - Every decision has visible consequences
6. **Friction is Failure** - Confusion is a design failure, not player error
7. **Emotion Over Mechanics** - Mechanics serve emotional experience
8. **Show, Don't Tell** - World communicates narrative visually
9. **Juice is Not Optional** - Feedback for every action
10. **Kill Your Darlings** - Remove features that don't serve core loop

**Red Flags to Avoid:**
- The Iceberg Game (90% features hidden)
- Tutorial Crutch (design by instruction vs intuition)
- Feature Graveyard (systems nobody uses)
- Progressive Paralysis (hiding features = looking broken)

---

## Documentation Structure

```
docs/
├── 00_CORE/              # Philosophy & Vision
│   ├── DESIGN_PRINCIPLES.md
│   └── LIVING_DESIGN_DOCUMENT.md
│
├── 01_MECHANICS/         # Technical Specifications
│   ├── INFINITE_CANVAS_FEATURE_CATALOG.md  (1,512 features)
│   ├── MASTER_FEATURE_CATALOG.md           (287 features)
│   └── STATE_ARCHITECTURE.md
│
├── 02_WORLD/            # Content (Lore, Characters, Locations)
│   ├── STATION_HISTORY_BIBLE.md
│   ├── 01_LORE/
│   ├── 02_LOCATIONS/
│   └── 03_CHARACTERS/
│
├── 03_PROCESS/          # Execution Plans & Logs
│   ├── ENGINEERING_HANDOVER_JAN2026.md
│   ├── AI_AGENT_ONBOARDING_PROMPT.md  (THIS FILE)
│   ├── HANDOFF_2026_01_05.md
│   └── MASTER_IMPLEMENTATION_INDEX.md
│
└── reference/
    └── source-documents/  (4 ISP extraction source documents)
```

---

## Quick Answers to Common Questions

**Q: Where do I start?**
A: Read `CLAUDE.md` first, then `ENGINEERING_HANDOVER_JAN2026.md`, then pick a feature from `INFINITE_CANVAS_FEATURE_CATALOG.md`

**Q: How do I add a new character?**
A: See Section 13.1 in `ENGINEERING_HANDOVER_JAN2026.md` - 6-step process with validation

**Q: Can I modify GameState directly?**
A: **NO.** Always use `GameStateUtils.applyStateChange()` for immutable mutations

**Q: Should I use Tailwind `animate-*` classes?**
A: **NO.** Always use Framer Motion with `prefers-reduced-motion` support

**Q: Where are the tests?**
A: `tests/lib/` for unit tests, `tests/browser-runtime/` for E2E tests

**Q: How do I deploy?**
A: Push to `main` branch triggers auto-deploy to Vercel. Use `vercel --prod` for manual deploy.

**Q: What's the difference between INFINITE_CANVAS and MASTER_FEATURE_CATALOG?**
A:
- `MASTER_FEATURE_CATALOG.md` = Original 287 features (reference)
- `INFINITE_CANVAS_FEATURE_CATALOG.md` = ISP extraction 1,512 features (active roadmap)

**Q: Can I delete files in `lib/archive/`?**
A: **NO.** These contain lessons learned and alternative approaches for reference.

**Q: How do I handle mobile safe areas?**
A: Use `style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}`

**Q: What are the 5 patterns?**
A: Analytical, Patience, Exploring, Helping, Building (see `lib/patterns.ts`)

---

## Emergency Procedures

### Production is Down
```bash
# 1. Check Vercel status
open https://vercel.com/status

# 2. Check deployment logs
vercel logs [deployment-url]

# 3. Rollback to previous deployment
vercel rollback [deployment-url]
```

### Build Failing
```bash
# 1. Check TypeScript errors
npx tsc --noEmit

# 2. Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Check Next.js version compatibility
npm list next
```

### Tests Failing
```bash
# 1. Run specific failing test
npm test tests/lib/[filename].test.ts

# 2. Check for state mutation bugs (most common)
# Look for direct gameState.* = assignments

# 3. Verify type validators are used
# Check for isValidPattern(), isValidCharacterId(), etc.
```

---

## Success Criteria (Definition of Done)

Before marking any feature complete:

- [ ] Code follows conventions (type safety, immutable state, constants)
- [ ] TypeScript types complete (no `any`)
- [ ] Unit tests written (if applicable)
- [ ] E2E tests updated (if UI change)
- [ ] Documentation updated
- [ ] Tested on mobile (responsive)
- [ ] Tested with `prefers-reduced-motion`
- [ ] Build succeeds (`npm run build`)
- [ ] Type checking passes (`npx tsc --noEmit`)
- [ ] Lint clean (`npm run lint`)
- [ ] Deployed to preview and tested
- [ ] PR reviewed and approved
- [ ] Deployed to production

---

## Ready to Start?

**Your first action should be:**

1. Run `npm install` and `npm run dev`
2. Open http://localhost:3000 and play through Samuel's introduction
3. Read `CLAUDE.md` for project overview
4. Read `ENGINEERING_HANDOVER_JAN2026.md` for technical details
5. Pick a feature from `INFINITE_CANVAS_FEATURE_CATALOG.md` and start coding

**When in doubt:**
- Refer to existing code patterns in the codebase
- Check `ENGINEERING_HANDOVER_JAN2026.md` Section 13 (Common Tasks)
- Follow the 10 Design Commandments
- Ask questions before assuming

---

**Version:** 1.0
**Last Updated:** January 5, 2026
**Status:** ✅ Ready for AI Agent Onboarding
