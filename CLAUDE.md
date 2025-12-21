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

### Characters (11 Total)
| Character | Animal | Role |
|-----------|--------|------|
| Samuel | Owl | Station keeper, wise mentor (Hub) |
| Maya | Cat | Tech Innovator, family pressure |
| Devon | Deer | Systems Thinker, engineering |
| Jordan | — | Career Navigator |
| Marcus | Bear | Medical Tech, healthcare |
| Tess | Fox | Education Founder |
| Yaquin | Rabbit | EdTech Creator |
| Kai | — | Safety Specialist |
| Rohan | Raven | Deep Tech, introspective |
| Alex | — | Extra character |
| Silas | — | Crisis Manager |

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

## Current Status (December 2024)

### Recently Completed (December 2024)
- **Polish Sprint** (86% → 95%)
  - Type safety: `PatternType`, `EmotionType` enforced
  - Centralized constants in `lib/constants.ts`
  - Complete consequence echoes for all 11 characters
  - Validation layer with bounds checking
  - State architecture documented
  - Test coverage for core systems (33 tests)
- Documentation consolidation (120 docs → 10 docs)
- Philosophy Foundation document
- Engineering Synthesis document (comprehensive SDP)
- ISP Analysis (dormant capabilities, syntheses, futures)
- Fake choice audit and fixes
- 32×32 pixel avatar upgrade for all characters
- UI consolidation (7 elements max)

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
