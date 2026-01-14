# Lux Story - Grand Central Terminus

## Game Design Philosophy

### Core Commandments

1. **Feel Comes First** - The game must feel good within first 30 seconds. Controls intuitive, actions satisfying.

2. **Respect Player Intelligence** - Don't overexplain. Let players discover. Failure teaches, not punishes.

3. **Every Element Serves Multiple Purposes** - Visuals both beautiful and functional. Mechanics reinforce narrative themes. UI informs without interrupting.

4. **Accessible Depth** - Easy to learn, difficult to master. Surface simplicity hiding strategic depth.

5. **Meaningful Choices** - Every decision has visible consequences. No obvious "right" answers—only trade-offs. Choices reflect player identity.

6. **Friction is Failure** - Every moment of confusion is a design failure. Never blame the player. If it needs explanation, redesign it.

7. **Emotion Over Mechanics** - Mechanics serve emotional experience. What players feel matters more than what they do.

8. **Show, Don't Tell** - World communicates narrative. Reduce text/tutorials through visual design.

9. **Juice is Not Optional** - Feedback for every action. Make simple actions feel powerful.

10. **Kill Your Darlings** - Remove features that don't serve core loop. Complexity without value is bloat.

### Red Flags to Avoid

- **The Iceberg Game** - 90% of features hidden. Core value invisible until late game.
- **Developer's Delight** - Features that excite devs but confuse players.
- **Progressive Paralysis** - Hiding features to "reduce overwhelm" but looking broken.
- **Invisible Value Prop** - Players don't understand uniqueness.
- **Tutorial Crutch** - Design by instruction rather than intuition.
- **Feature Graveyard** - Systems nobody uses.

---

## Project Overview

**Grand Central Terminus** - A magical realist career exploration game where a mysterious train station appears between who you were and who you're becoming. Players explore platforms representing career paths through dialogue-driven choices that reveal their patterns.

### Target Audience
- Birmingham youth exploring career paths
- Ages 14-24
- Mobile-first experience

### Core Experience
- Dialogue-driven like a video game (Pokemon, Disco Elysium)
- Characters drive everything + player response and agency
- Choices have visible consequences
- Pattern revelation through action, not statistics

---

## Architecture

### Stack
- Next.js 15 with App Router
- TypeScript strict mode
- Framer Motion for animations
- Tailwind CSS
- Vercel deployment

### Key Files
```
components/
├── StatefulGameInterface.tsx   # Main game container
├── ChatPacedDialogue.tsx       # Dialogue display with thinking indicators
├── CharacterAvatar.tsx         # Character pixel art (32×32)
├── PixelAvatar.tsx             # SVG pixel sprite renderer
├── Journal.tsx                 # Player stats side panel
└── RichTextRenderer.tsx        # Text effects and formatting

lib/
├── patterns.ts                 # 5 pattern types: analytical, patience, exploring, helping, building
├── character-typing.ts         # Per-character typing speeds
├── voice-utils.ts              # Character voice typography
└── interaction-parser.ts       # Visual feedback animations

hooks/
├── useInsights.ts              # Player pattern analysis
├── useConstellationData.ts     # Character relationships
└── useGameState.ts             # Core game state management
```

### Characters (20 Total)
| Character | Animal | Role | Tier |
|-----------|--------|------|------|
| Samuel | Owl | Station keeper, wise mentor (Hub) | Core |
| Maya | Cat | Tech Innovator, family pressure | Core |
| Marcus | Bear | Medical Tech, healthcare | Core |
| Kai | — | Safety Specialist | Core |
| Rohan | Raven | Deep Tech, introspective | Core |
| Devon | Deer | Systems Thinker, engineering | Secondary |
| Tess | Fox | Education Founder | Secondary |
| Yaquin | Rabbit | EdTech Creator | Secondary |
| Grace | — | Healthcare Operations | Secondary |
| Elena | — | Information Science / Archivist | Secondary |
| Alex | Rat | Supply Chain & Logistics | Secondary |
| Jordan | — | Career Navigator | Secondary |
| Silas | — | Advanced Manufacturing | Extended |
| Asha | — | Conflict Resolution / Mediator | Extended |
| Lira | — | Communications / Sound Design | Extended |
| Zara | — | Data Ethics / Artist | Extended |
| Quinn | Hedgehog | Finance Specialist (LinkedIn 2026) | Secondary |
| Dante | Peacock | Sales Strategist (LinkedIn 2026) | Extended |
| Nadia | Barn Owl | AI Strategist (LinkedIn 2026) | Secondary |
| Isaiah | Elephant | Nonprofit Leader (LinkedIn 2026) | Extended |

### Pattern System
5 behavioral patterns tracked through choices:
- **Analytical** - Logic, data-driven decisions
- **Patience** - Taking time, careful consideration
- **Exploring** - Curiosity, discovery-oriented
- **Helping** - Supporting others, empathy
- **Building** - Creating, constructive action

---

## UX Principles

### Dialogue-Driven Immersion
- Text/dialogue historically and consistently shows in narrative container
- Everything stays dialogue-driven like a video game
- Characters drive everything + response and user agency
- Non-dialogue elements in narrative container break immersion

### Less is More
- Thinking indicators: Show once at message start, then let dialogue flow
- Avatars: Only in side menu (Journal), not main screen header
- Choice container: Fixed height (140px) with scroll, no layout shifts

### Visual Feedback
- 32×32 pixel art avatars (Zootopia-style animals)
- Interaction animations (shake, nod, bloom, etc.)
- Voice typography per character

### UI State Nuances
Clean, simple UI nuances indicate different situations without words:

**Container Differentiation:**
- NPC dialogue: Standard container (rgba white, subtle border)
- Narrative text: Slightly different color + marquee shimmer effect + larger font
- No center-justification for narrative—keep left-aligned for readability

**Attention Direction (Game Research Pattern):**
- When player earns something → Nav bar button highlights with marquee shimmer
- Visual cue says "navigate here to see what changed"
- When they navigate there → They discover the change
- Reinforces: action → visual feedback → discovery loop

**Animation Philosophy:**
- Synchronized symmetrical disposition for shimmer effects
- Two-layer marquee (forward + reverse) creates depth/reverberation
- Subtle enough to attract attention, not distract from gameplay
- Respects `prefers-reduced-motion` for accessibility

---

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
vercel --prod        # Deploy to production
```

### Testing
```bash
npm test                        # Run all tests
npm test tests/lib              # Run lib tests only
npm test -- --watch             # Watch mode
```

- Vitest for unit testing
- Playwright for E2E browser automation
- Test page: `/test-pixels` for avatar verification

### Git Commits
Keep commit messages concise. No generated footers or co-author tags.
```bash
# Format
<type>: <description>

# Types: feat, fix, docs, refactor, test, chore

# Examples
feat: Add Maya simulation
docs: Update system coverage
fix: Resolve trust calculation bug
```

---

## State Architecture

See `lib/STATE_ARCHITECTURE.md` for full documentation.

### Core State (`lib/character-state.ts`)
- `GameState` - Master state container
- `GameStateUtils.applyStateChange()` - Immutable state transformations

### Type Validation
- `lib/patterns.ts` - `isValidPattern()`, `PatternType`
- `lib/emotions.ts` - `isValidEmotion()`, `EmotionType`
- `lib/graph-registry.ts` - `isValidCharacterId()`, `CharacterId`

### Constants (`lib/constants.ts`)
All magic numbers centralized:
- Trust bounds: `MAX_TRUST=10`, `MIN_TRUST=0`
- Identity threshold: `IDENTITY_THRESHOLD=5`
- Internalization bonus: `INTERNALIZE_BONUS=0.20`

### Archived Code (`lib/archive/`)
Deprecated code preserved for reference:
- `game-state.legacy.ts` - Sprint 1 state system
- `orb-allocation-design.ts` - Unused allocation mechanics

---

## Current Status (January 13, 2026)

### Feature Catalog
- **Total Features Documented:** 572 (in INFINITE_CANVAS_FEATURE_CATALOG.md)
- **Implementation Status:** ~20% complete, ~6% partial, ~30% planned, ~44% future/moonshot
- **Tests:** 1,120 passing (44 test files, 100% pass rate)
- **Dialogue Nodes:** 1,542 total (1,367 base + 175 LinkedIn 2026)
- **Choices:** 2,694 total

### Core Systems at 100% (20/20 Characters)
| System | Coverage | Location |
|--------|----------|----------|
| Interrupt System | 20/20 | `content/*-dialogue-graph.ts` (interrupt blocks) |
| Vulnerability Arcs | 20/20 | `content/*-dialogue-graph.ts` (vulnerability_arc nodes) |
| Consequence Echoes | 20/20 | `lib/consequence-echoes.ts` |
| Pattern Voices | 20/20 | `content/pattern-voice-library.ts` |
| Relationship Web | 20/20, 68 edges | `lib/character-relationships.ts` |
| Derivatives System | 7/7 | `lib/*-derivatives.ts` (239 tests) |

### Complete Enhancement Systems
| System | Coverage | Location |
|--------|----------|----------|
| Loyalty Experiences | 20/20 (100%) | `lib/loyalty-experience.ts` |
| Pattern Unlocks | 17/20 | Pattern-gated dialogue nodes |

### Partially Complete Systems
| System | Coverage | Location |
|--------|----------|----------|
| Simulations (3-Phase) | 5/20 complete (25%) | `content/*-dialogue-graph.ts` (Complete: Devon, Jordan, Dante, Nadia, Isaiah) |

### Meta-Cognitive Systems
| System | Defined | Used | Status |
|--------|---------|------|--------|
| Patterns | 5 | 5 | ✅ Optimal variability |
| Skills | 54 | 54 | ✅ All skills formalized (8 added, 7 renamed) |
| Emotions | 392 primary | 563 unique, 1,612 refs | ✅ Compound emotions validated (100% pass rate) |
| Knowledge Flags | — | 210 | ✅ Rich state tracking |

### Adaptive Content Coverage
| Feature | Coverage | Notes |
|---------|----------|-------|
| Pattern Reflections | 113 total | NPC dialogue varies by player pattern |
| Voice Variations | 20/20 chars | All tiers meet targets (178 total) |
| Conditional Choices | 132 total | visibleCondition gated |
| Trust-Gated Nodes | 107 total | 8 trust levels |

### Character Dialogue Depth (1158 Total Nodes)
| Character | Nodes | Tier | Status |
|-----------|-------|------|--------|
| Samuel | 205 | Hub | Hub ✅ |
| Devon | 84 | 1 | Deep ✅ |
| Elena | 83 | 3 | Deep ✅ |
| Maya | 82 | 1 | Deep ✅ |
| Zara | 77 | 4 | Deep ✅ |
| Marcus | 76 | 2 | Deep ✅ |
| Lira | 69 | 4 | Deep ✅ |
| Rohan | 58 | 2 | Standard ✅ |
| Kai | 51 | 2 | Standard ✅ |
| Asha | 51 | 4 | Standard ✅ |
| Tess | 50 | 2 | Standard ✅ |
| Alex | 49 | 3 | Standard ✅ |
| Nadia | 48 | 2 | Standard ✅ (LinkedIn 2026) |
| Quinn | 45 | 2 | Standard ✅ (LinkedIn 2026) |
| Yaquin | 43 | 3 | Standard ✅ |
| Isaiah | 42 | 3 | Standard ✅ (LinkedIn 2026) |
| Silas | 40 | 4 | Core ✅ |
| Dante | 40 | 3 | Core ✅ (LinkedIn 2026) |
| Jordan | 39 | 4 | Core ✅ |
| Grace | 38 | 3 | Core ⚠️ (-2) |

### Key Documentation
- `docs/03_PROCESS/META_COGNITIVE_SYSTEMS_AUDIT.md` - Pattern/skill/emotion coverage
- `docs/03_PROCESS/10-system-coverage.md` - System coverage audit
- `docs/03_PROCESS/11-feature-progress-tracker.md` - All 572 features mapped
- `docs/01_MECHANICS/21-infinite-canvas-feature-catalog.md` - Full feature catalog

### Recently Completed (January 2026)
- **Simulation Implementation (Jan 13)** - 5 characters with complete 3-phase simulations (Devon, Jordan, Dante, Nadia, Isaiah) - 60 nodes, ~2,154 lines
- **Emotion System Expansion (Jan 13)** - Added 2 primary emotions (`afraid`, `peace`), validated all 1,612 emotion references (100% pass rate)
- **Content Gap Analysis (Jan 13)** - Comprehensive audit of all 20 characters across 4 core systems (documented in `CONTENT_GAP_ANALYSIS_2026JAN.md`)
- **Test Suite Stability (Jan 13)** - All 1,120 tests passing across 44 test files (100% pass rate)
- **LinkedIn 2026 Career Expansion** - 4 new characters (Quinn, Dante, Nadia, Isaiah) with 175 dialogue nodes
- **Voice Variations 20/20** - All characters meet tier targets (+12 for new characters)
- **Pixel Sprites** - New animal types: hedgehog, peacock, barnowl, elephant
- **Relationship Web** - 20 new edges connecting new characters to existing cast (68 total edges)
- **Skill System Cleanup** - 8 new skills defined, 7 renamed to standard forms, all 54 skills formalized
- **Pattern Unlock Nodes** - 12 pattern-gated nodes across 5 characters
- **Conditional Choice Wiring** - Pattern unlocks reachable via introduction choices
- **Meta-Cognitive Audit** - Full analysis of patterns, skills, emotions coverage
- **Loyalty Experiences 20/20** - All characters have complete loyalty experience definitions
- **Derivatives System** - 7 modules (trust, pattern, character, narrative, knowledge, interrupt, assessment)
- **Dialogue Expansion** - 983 → 1,158 nodes (+18%) from LinkedIn 2026 expansion

### Content Gaps (January 13, 2026)

See `docs/03_PROCESS/16-content-gap-analysis-jan2026.md` for full analysis.

**Summary:**
- ✅ **Critical systems:** All complete (Vulnerability Arcs 20/20, Relationship Web 68 edges, Loyalty Experiences 20/20)
- ⚠️ **Enhancement systems:** Partial coverage
  - Simulations (3-Phase): 5/20 complete (25%) - Devon, Jordan, Dante, Nadia, Isaiah
  - Simulations (Partial): 14/20 have stub implementations
  - Quinn: Missing structured 3-phase simulation

**No blocking issues for production release.**

### Q1 2026 Priority Tasks ✅ ALL COMPLETE
1. ~~**Voice Variations**~~ ✅ COMPLETE - All tiers meet targets (Tier 1: 15, Tier 2: 10, Tier 3-4: 6)
2. ~~**Pattern Reflections**~~ ✅ COMPLETE - Alex (5), Grace (5), Silas (5) all at target
3. ~~**Skill System Cleanup**~~ ✅ COMPLETE - 8 skills added, 7 renamed to standard forms
4. ~~**LinkedIn 2026 Expansion**~~ ✅ COMPLETE - Quinn, Dante, Nadia, Isaiah fully integrated
5. ~~**Simulation Suite**~~ ✅ PARTIAL - 5/20 complete (Devon, Jordan, Dante, Nadia, Isaiah)
6. ~~**Emotion Validation**~~ ✅ COMPLETE - All 1,612 emotion references validated

### Production
- URL: https://lux-story.vercel.app
- Deployment: Vercel (auto-deploy on push to main)

---

## Design Reviews

When analyzing the game, use Five Lenses:

1. **Player's Lens** - What do players actually experience vs. what was designed?
2. **Systems Lens** - Which features are visible vs. buried?
3. **Business Lens** - Is value proposition clear in 30 seconds?
4. **Emotion Lens** - Where does frustration replace fun?
5. **Time Lens** - What's visible at minute 1, 5, 30, 60?

### Key Questions
- Can someone have fun just moving through the game?
- Remove all tutorials—can players still figure it out?
- Would two players make different choices?
- Watch someone play silently—where do they hesitate?
- What will players remember a year from now?

---

## Quick Orientation (New Session)

### Key Directories
```
components/
├── game/                    # Core gameplay (game-choice, game-message)
├── constellation/           # Character/skill constellation views
├── admin/                   # Admin dashboard sections
│   └── skeletons/           # Loading skeleton components
└── ui/                      # shadcn/ui components

lib/
├── animations.ts            # Framer Motion springs, stagger, variants
├── ui-constants.ts          # Design tokens (spacing, touch targets, colors)
├── springs.ts               # Additional spring configs
└── admin-*.ts               # Admin dashboard helpers

app/
├── globals.css              # CSS variables, safe areas, fonts
└── (routes)                 # Next.js app router pages
```

### Important Files for UI Work
- `lib/ui-constants.ts` - Centralized design tokens
- `lib/animations.ts` - All animation constants (springs, stagger, variants)
- `app/globals.css` - CSS variables, safe areas
- `SOFTWARE-DEVELOPMENT-PLAN.md` - UI stability implementation plan

---

## UI Best Practices (December 2024)

### Layout Stability
**Prevent layout shift during data loading:**
```tsx
// Use min-height on containers
<CardContent className="min-h-[300px]">
  {loading ? <Skeleton /> : <Content />}
</CardContent>

// Use skeleton components during load
import { DashboardSkeleton } from '@/components/admin/skeletons'
```

### Animation Patterns
**Use Framer Motion with springs (not Tailwind animate-in):**
```tsx
import { motion, useReducedMotion } from 'framer-motion'
import { springs, STAGGER_DELAY } from '@/lib/animations'

const prefersReducedMotion = useReducedMotion()

<motion.div
  initial={!prefersReducedMotion ? { opacity: 0, y: 8 } : false}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * STAGGER_DELAY.normal, ...springs.gentle }}
>
```

**Progress bars - use width, not scaleX:**
```tsx
// ✅ Correct - no rendering artifacts
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress * 100}%` }}
  transition={springs.smooth}
/>

// ❌ Avoid - can cause subpixel artifacts
initial={{ scaleX: 0 }}
animate={{ scaleX: progress }}
style={{ originX: 0 }}
```

**Expand/collapse animations:**
```tsx
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={springs.smooth}
      className="overflow-hidden"
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

### Touch Targets
**Apple HIG: 44px minimum for touch targets:**
```tsx
// Use the constant
import { BUTTON_HEIGHT } from '@/lib/ui-constants'

<button className={cn("...", BUTTON_HEIGHT.md)}>

// Or inline
<button className="min-h-[44px] min-w-[44px]">
```

### Safe Areas (Mobile)
**Use consistent safe area padding:**
```tsx
// Standard pattern
style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}

// Or use CSS variable from globals.css
style={{ paddingBottom: 'var(--safe-area-bottom)' }}
```

### Scrollbar Stability
**Prevent layout shift when scrollbar appears:**
```tsx
<div
  className="overflow-y-auto"
  style={{ scrollbarGutter: 'stable' }}
>
```

### Responsive Patterns
**Mobile-first sizing:**
```tsx
// Avatar: 48px mobile, 64px tablet+
className="w-12 h-12 sm:w-16 sm:h-16"

// SVG: wrap in aspect-ratio container
<div className="aspect-square w-full max-w-[400px] mx-auto">
  <svg viewBox="0 0 100 100" className="w-full h-full">
```

### Animation Durations (Consistency)
| Use Case | Spring | Duration |
|----------|--------|----------|
| Buttons, micro-interactions | `springs.snappy` | ~150ms |
| Panels, modals | `springs.smooth` | ~300ms |
| Fades, reveals | `springs.gentle` | ~250ms |
| Stagger delay | `STAGGER_DELAY.normal` | 80ms between items |

### CSS Variables (globals.css)
```css
:root {
  --shadow-amber-dark: #92400e;
  --shadow-amber-glow: rgba(146, 64, 14, 0.3);
  --safe-area-bottom: max(16px, env(safe-area-inset-bottom, 0px));
}
```

---

## Glass Morphic Stability Rules (December 2024)

**Core principle:** Beautiful AND stable. The Sentient Glass design system must not sacrifice usability for aesthetics.

### What to KEEP (Localized Effects)
| Effect | Where | Why OK |
|--------|-------|--------|
| Marquee shimmer | Nav buttons (Journal/Constellation) | Localized, doesn't affect layout |
| Border pulse | Nav badges for new content | Small area, attention-grabbing |
| Pattern glow | Choice button hover | User-initiated, immediate feedback |
| Breathing animation | Dormant orbs in Journal | Background only, respect reduced-motion |
| Glass blur/shadow | All glass-panel elements | Core aesthetic, no layout impact |

### What to AVOID (Full-Screen Effects)
| Effect | Problem | Alternative |
|--------|---------|-------------|
| Full-screen color overlays | Distracting, "flashing" | Use localized glows |
| Animated background transitions | "Fading" confusion | Instant color change |
| Position animations on containers | Layout jumping | Opacity-only transitions |
| Processing pulses | Battery drain, distraction | Static or localized indicator |
| Container color transitions | Color jumping | No transitions on containers |

### Container Rules (Claude/ChatGPT Pattern)
```
┌─────────────────────────────────────────┐
│ HEADER (flex-shrink-0) - Never moves    │
├─────────────────────────────────────────┤
│ MAIN (flex-1, overflow-y-auto)          │
│   └─ Dialogue Card: solid bg (85%+)     │
├─────────────────────────────────────────┤
│ FOOTER (flex-shrink-0) - Never moves    │
└─────────────────────────────────────────┘
```

### Animation Rules
```tsx
// ✅ ALLOWED
initial={{ opacity: 0 }}           // Opacity fade
animate={{ opacity: 1 }}
whileTap={{ scale: 0.98 }}         // Scale on interaction
// Localized glows/pulses on hover

// ❌ NOT ALLOWED
initial={{ y: 20 }}                // Position changes on containers
animate={{ y: 0 }}
transition={{ background: '2s' }}  // Background color transitions
// Full-screen overlays
```

### Glass Panel Best Practices
```tsx
// Dialogue containers need solid backgrounds for readability
<Card
  className="glass-panel"
  style={{ background: 'rgba(10, 12, 16, 0.85)' }}  // 85%+ opacity
>
  <p className="text-white">Readable text</p>
</Card>

// No transitions on glass-panel (prevents color jumping)
// Pattern glow via data-pattern attribute on hover only
```

---

## Admin Dashboard Architecture

### Section Components (`components/admin/sections/`)
Each section follows the pattern:
```tsx
interface SectionProps {
  userId: string
  profile: SkillProfile
  adminViewMode: 'family' | 'research'
}
```

### View Modes
- **family** - Friendly language for parents/guardians
- **research** - Technical language with raw data

### Shared Layout
`SharedDashboardLayout.tsx` provides:
- Profile loading with skeleton
- Navigation between sections
- View mode toggle
- Context provider for child sections

---

## Context Recovery (If Auto-Compacted)

**If you lose context mid-session, read these files to get oriented:**

### Quick Status Check
```bash
# Run tests to verify state
npm test

# Check recent commits
git log --oneline -10

# Count dialogue nodes per character
for f in content/*-dialogue-graph.ts; do
  echo "$(basename "$f" -dialogue-graph.ts): $(grep -c 'nodeId:' "$f")"
done
```

### Document Control Philosophy

**Core Principle:** Git-tracked plans are source of truth. Session artifacts are temporary.

| Location | Purpose | Lifecycle |
|----------|---------|-----------|
| `~/.claude/plans/` | Working drafts, session artifacts | Ephemeral |
| `docs/03_PROCESS/plans/` | Handoffs, active plans | Permanent |
| `docs/03_PROCESS/archive/` | Superseded plans | Historical |

**Naming Convention:**
- Stable docs: `XX-descriptive-name.md` (numbered by purpose)
- Time-sensitive: `DDMMMYY_DESCRIPTIVE_NAME.md` (dated)

### Context Recovery (Priority Reading)
1. `docs/03_PROCESS/plans/*_HANDOFF.md` - Latest session state
2. `docs/03_PROCESS/META_COGNITIVE_SYSTEMS_AUDIT.md` - Pattern/skill/emotion coverage
3. `docs/03_PROCESS/10-system-coverage.md` - What's done vs missing
4. `docs/03_PROCESS/11-feature-progress-tracker.md` - Full feature status
5. This file (CLAUDE.md) - Current Status section

### Handoff Pattern
At session end, create: `docs/03_PROCESS/plans/DDMMMYY_HANDOFF.md`

Required sections:
- Session Summary - What was done (with commit hashes)
- Current State - Tests, coverage metrics
- Remaining Gaps - What's incomplete
- Next Steps - Prioritized actions
- Quick Context Recovery - Commands to run

### Q1 2026 Priority Tasks
1. ~~**Loyalty Experiences** (20/20)~~ ✅ COMPLETE - All characters have loyalty experience definitions
2. ~~**Simulations** (5/20)~~ ⚠️ PARTIAL - 5 complete (Devon, Jordan, Dante, Nadia, Isaiah), 14 stub implementations
3. ~~**Expand Shallow Characters**~~ ✅ COMPLETE - All dialogue targets exceeded

### Key Type Definitions
- `lib/dialogue-graph.ts` - DialogueNode, InterruptWindow, DialogueChoice
- `lib/loyalty-experience.ts` - LoyaltyExperience, LoyaltyExperiencePhase
- `lib/patterns.ts` - PatternType (analytical, patience, exploring, helping, building)

### Content File Pattern
Each character has a dialogue graph at `content/{name}-dialogue-graph.ts` with:
- Introduction nodes
- Simulation nodes (if applicable)
- Interrupt target nodes
- Vulnerability arc nodes (Trust ≥ 6 gated)

### Interrupt Types (6 total)
`connection`, `challenge`, `silence`, `comfort`, `grounding`, `encouragement`

### Vulnerability Arc Pattern
```typescript
{
  nodeId: '{character}_vulnerability_arc',
  requiredState: { trust: { min: 6 } },
  onEnter: [{ characterId: '{id}', addKnowledgeFlags: ['{char}_vulnerability_revealed'] }],
  content: [{ text: '...', emotion: '...', richEffectContext: 'warning' }],
  choices: [...] // 2-3 response options with patterns
}
```

---

## Claude Code Skills

### /terminus - Engineering Principles
Use `/terminus` to review core engineering philosophies:
- **The Ten Commandments** - Feel First, Friction is Failure, Never Break What Works, etc.
- **Development Philosophy** - Surgical Enhancement, Risk Tiers
- **Document Control** - Numbered prefixes, status tracking
- **PRD Process** - Worldbuilding-first, Trojan Horse philosophy
- **Quality Gates** - Pre-commit, pre-PR, pre-release checklists

Location: `.claude/commands/terminus.md`

### /orb - Development Best Practices
Managed skill for project-specific guidance.

### /orbStatus - Stabilization Progress
Quick status check for ongoing work.

---

**Last Updated:** January 6, 2026
