# Quick Context Prompt (Copy-Paste Ready)

**Use this condensed prompt for quick AI agent orientation. For full details, see `AI_AGENT_ONBOARDING_PROMPT.md`**

---

You are working on **Lux Story** (v2.1.1), a dialogue-driven career exploration game in production at https://lux-story.vercel.app.

**Stack:** Next.js 15, TypeScript (strict), Framer Motion, Tailwind, Vercel

**Current State:**
- ✅ 11 characters, 16,000+ dialogue lines, 5 behavioral patterns, trust system
- ✅ Mobile-first UI, admin dashboard, consequence echoes
- 📋 1,512-feature roadmap documented in `docs/01_MECHANICS/INFINITE_CANVAS_FEATURE_CATALOG.md`

**Essential Files to Read First:**
1. `CLAUDE.md` - Project overview, 10 design commandments, quick reference
2. `docs/03_PROCESS/ENGINEERING_HANDOVER_JAN2026.md` - Complete technical reference
3. `docs/01_MECHANICS/INFINITE_CANVAS_FEATURE_CATALOG.md` - Feature roadmap (E-XXX, I-XXX, D-XXX, W-XXX)

**Critical Conventions:**

```typescript
// ✅ ALWAYS: Immutable state mutations
const updatedState = GameStateUtils.applyStateChange(gameState, {
  type: 'trust', characterId: 'samuel', delta: 1
});

// ✅ ALWAYS: Type validators
import { isValidPattern } from '@/lib/patterns';
if (!isValidPattern(input)) throw new Error('Invalid pattern');

// ✅ ALWAYS: Constants (no magic numbers)
import { MAX_TRUST, IDENTITY_THRESHOLD } from '@/lib/constants';

// ✅ ALWAYS: Framer Motion (NOT Tailwind animate-*)
import { motion, useReducedMotion } from 'framer-motion';
import { springs, STAGGER_DELAY } from '@/lib/animations';
const prefersReducedMotion = useReducedMotion();
<motion.div
  initial={!prefersReducedMotion ? { opacity: 0, y: 8 } : false}
  animate={{ opacity: 1, y: 0 }}
  transition={{ ...springs.gentle }}
>

// ❌ NEVER: Direct state mutation
gameState.trust.samuel += 1;

// ❌ NEVER: 'any' types
const state: any = {};

// ❌ NEVER: Magic numbers
if (trust > 10) { ... }
```

**Design Commandments:**
1. Feel Comes First
2. Respect Player Intelligence
3. Every Element Serves Multiple Purposes
4. Accessible Depth
5. Meaningful Choices
6. Friction is Failure
7. Emotion Over Mechanics
8. Show, Don't Tell
9. Juice is Not Optional
10. Kill Your Darlings

**Prioritized Features (Q1 2026):**
- E2-031 to E2-033: Interrupt System
- E2-034 to E2-039: Loyalty Experiences
- E2-021 to E2-024: Extended Character Roster
- E2-061 to E2-065: Vulnerability Arcs

**Common Commands:**
```bash
npm run dev              # Development server
npm test                 # Run tests
npm run build            # Production build
npx tsc --noEmit         # Type check
npm run lint             # Lint check
vercel --prod            # Deploy to production
npx tsx scripts/validate-dialogue-graphs.ts  # Validate content
```

**Critical Files (DO NOT DELETE):**
- `components/StatefulGameInterface.tsx` - Main game container
- `lib/game-logic.ts` - Core game loop
- `lib/character-state.ts` - GameState types + immutable utils
- `lib/patterns.ts` - 5 patterns (Analytical, Patience, Exploring, Helping, Building)
- `lib/archive/*` - Preserved for lessons learned

**Feature Catalog System:**
```
E-XXX = Explicit features
I-XXX = Implicit infrastructure
D-XXX = Derivative features
W-XXX = Wild moonshots
E2-XXX = Document 2 features
```

**Use in PRs:** "feat: Implement Interrupt System (E2-031)"

**Quick Start:**
1. `npm install && npm run dev`
2. Play through Samuel intro at localhost:3000
3. Read `CLAUDE.md` and `ENGINEERING_HANDOVER_JAN2026.md`
4. Pick feature from `INFINITE_CANVAS_FEATURE_CATALOG.md`
5. Code following conventions above

**When Stuck:**
- Check `ENGINEERING_HANDOVER_JAN2026.md` Section 13 (Common Tasks)
- Follow existing code patterns in codebase
- Refer to 10 Design Commandments
- No assumptions - ask questions

---

**Version:** 1.0 | **Updated:** Jan 5, 2026 | **Status:** ✅ Ready
