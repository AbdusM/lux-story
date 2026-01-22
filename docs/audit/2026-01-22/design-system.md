# Design System Architecture

**Project:** Grand Central Terminus
**Last Updated:** January 22, 2026

---

## Overview

The design system is organized into three primary token libraries plus CSS layers:

```
lib/
├── ui-constants.ts    # Layout, spacing, z-index, glass morphism
├── patterns.ts        # Pattern colors (CANONICAL SOURCE)
├── animations.ts      # Framer Motion springs and variants
│
app/
├── globals.css        # CSS variables, keyframe animations
│
styles/
├── grand-central.css  # Game-specific visual feedback
```

---

## Key Token Files

### 1. `lib/ui-constants.ts` (345 lines)

**Purpose:** Centralized design tokens for layout and styling.

#### Exported Constants

| Constant | Purpose | Example Values |
|----------|---------|----------------|
| `CONTAINERS` | Max-width classes | `sm: 'max-w-sm'` (384px) |
| `BUTTON_HEIGHT` | Touch target sizes | `md: 'min-h-[44px]'` (Apple HIG) |
| `BUTTON_HEIGHT_PX` | Numeric button heights | `md: 44` |
| `SPACING` | Responsive padding/gaps | `mobile.padding: 'p-4'` |
| `SAFE_AREA` | iOS safe area insets | `bottom: 'max(16px, env(...))` |
| `ANIMATION_DURATION` | Timing in milliseconds | `normal: 200`, `slow: 300` |
| `MIN_HEIGHT` | Layout stability heights | `chart: 'min-h-[160px]'` |
| `Z_INDEX` | Stacking context scale | `modal: 110`, `toast: 140` |
| `RADIUS` | Border radius classes | `xl: 'rounded-xl'` |
| `URGENCY_COLORS` | Admin dashboard colors | `critical: { bg: 'bg-red-100' }` |
| `SKILL_STATE_COLORS` | Skill visualization | `emerging: { bg: 'bg-blue-200' }` |
| `BREAKPOINTS` | Tailwind breakpoint values | `sm: 640`, `md: 768` |
| `TEXT_SIZE` | Typography scale | `body: 'text-sm'` (14px) |
| `TEXT_CONTAINER_WIDTH` | Max-width for text | `standard: 'max-w-[280px]'` |
| `OPACITY` | Visibility scale | `disabled: 'opacity-50'` |
| `CONNECTION_OPACITY` | Graph line opacity | `normal: 'opacity-80'` |
| `GLASS_OPACITY` | Glass morphism opacity | `solid: 'bg-slate-900/85'` |
| `GLASS_STYLES` | Glass styling fragments | `base`, `hover`, `text`, `shadow` |
| `GLASS_BUTTON` | Complete glass button style | Combined fragments |
| `CHOICE_CONTAINER_HEIGHT` | Choice button containers | `mobileSm: 'max-h-[240px]'` |

#### Usage Example

```tsx
import { BUTTON_HEIGHT, Z_INDEX, GLASS_BUTTON } from '@/lib/ui-constants'

<button className={cn(GLASS_BUTTON, BUTTON_HEIGHT.md)}>
  Click me
</button>
```

---

### 2. `lib/patterns.ts` (549 lines)

**Purpose:** Single source of truth for the 5 behavioral patterns.

**CRITICAL:** This is the CANONICAL source for pattern colors. All other files MUST import from here.

#### Pattern Types

```typescript
export const PATTERN_TYPES = [
  'analytical',  // Blue  - #3B82F6
  'patience',    // Green - #10B981
  'exploring',   // Purple - #8B5CF6
  'helping',     // Pink  - #EC4899
  'building'     // Amber - #F59E0B
] as const
```

#### `PATTERN_METADATA` Structure

```typescript
export const PATTERN_METADATA: Record<PatternType, {
  label: string           // 'The Weaver'
  shortLabel: string      // 'Weaver'
  description: string     // Player-facing description
  contextDescription: string  // For records
  color: string           // '#3B82F6' - HEX COLOR
  tailwindBg: string      // 'bg-blue-500'
  tailwindText: string    // 'text-blue-600'
  skills: string[]        // Related WEF 2030 skills
}>
```

#### Color Palette (Default)

| Pattern | Color | Hex | Tailwind |
|---------|-------|-----|----------|
| analytical | Blue | `#3B82F6` | `bg-blue-500` |
| patience | Green | `#10B981` | `bg-green-500` |
| exploring | Purple | `#8B5CF6` | `bg-purple-500` |
| helping | Pink | `#EC4899` | `bg-pink-500` |
| building | Amber | `#F59E0B` | `bg-amber-500` |

#### Color Blind Palettes

The system includes 4 alternative palettes for accessibility:
- `protanopia` - Red-blind optimized
- `deuteranopia` - Green-blind optimized
- `tritanopia` - Blue-blind optimized
- `highContrast` - Maximum contrast

#### Helper Functions

| Function | Returns | Example |
|----------|---------|---------|
| `getPatternColor(pattern)` | Hex color | `'#3B82F6'` |
| `getPatternBgClass(pattern)` | Tailwind class | `'bg-blue-500'` |
| `formatPatternName(pattern)` | Short label | `'Weaver'` |
| `getPatternLabel(pattern)` | Full label | `'The Weaver'` |
| `getAccessiblePatternColor(pattern, mode)` | Accessible hex | `'#0077BB'` |
| `isValidPattern(string)` | Type guard | `true/false` |

#### Usage Example

```tsx
import { PATTERN_METADATA, getPatternColor } from '@/lib/patterns'

// Direct access
const blueHex = PATTERN_METADATA.analytical.color // '#3B82F6'

// Function access
const color = getPatternColor('analytical') // '#3B82F6'
```

---

### 3. `lib/animations.ts` (372 lines)

**Purpose:** Centralized Framer Motion animation configuration.

#### Spring Configurations

```typescript
export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 25 }, // Buttons
  smooth: { type: 'spring', stiffness: 300, damping: 30 }, // Panels/modals
  gentle: { type: 'spring', stiffness: 200, damping: 25 }, // Fades/reveals
  quick: { type: 'spring', stiffness: 500, damping: 30 },  // Micro-interactions
}
```

#### Duration Presets (seconds)

```typescript
export const durations = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  dramatic: 0.6,
}
```

**Note:** These differ slightly from `ANIMATION_DURATION` in `ui-constants.ts` which uses milliseconds:
- `ui-constants.ts`: `normal: 200` (0.2s)
- `animations.ts`: `normal: 0.25` (0.25s)

#### Stagger Configurations

```typescript
export const stagger = {
  fast: 0.05,    // 50ms between items
  normal: 0.08,  // 80ms between items
  slow: 0.12,    // 120ms between items
}
```

#### Pre-built Variants

| Variant | Animation | Use Case |
|---------|-----------|----------|
| `fadeInUp` | Opacity + y | Cards, list items |
| `fadeInLeft` | Opacity + x | Slide-in elements |
| `scaleFade` | Opacity + scale | Modals, popovers |
| `staggerContainer` | Children stagger | Wrapping lists |
| `staggerItem` | Individual item | Inside container |
| `panelFromRight` | x: 100% to 0 | Side panels |
| `panelFromBottom` | y: 100% to 0 | Bottom sheets |
| `backdrop` | Opacity | Overlays |

#### Gesture Presets

```typescript
export const buttonGestures = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springs.quick,
}
```

#### Signature Choice Animation

The "30% budget" animation for choice commitment:

```typescript
export const signatureChoice = {
  timing: {
    tapScale: 0.95,
    fadeOutDuration: 0.15,
    anticipationPause: 0.3,
    flyUpDuration: 0.4,
    silenceBeats: 0.6,
  },
  flyUpSpring: { type: 'spring', stiffness: 200, damping: 20 },
  // ... variants
}
```

---

### 4. `app/globals.css` (1556 lines)

**Purpose:** CSS variables, keyframe animations, utility classes.

#### Root Variables

```css
:root {
  --vh-fallback: 100vh;
  --dvh: 100dvh;
  --shadow-amber-dark: #92400e;
  --shadow-amber-glow: rgba(146, 64, 14, 0.3);
  --safe-area-bottom: max(16px, env(safe-area-inset-bottom, 0px));

  /* WCAG AA Text Colors */
  --text-primary: #E5E7EB;
  --text-secondary: #B8B8B8;
  --text-muted: #9CA3AF;
  --text-dim: #6B7280;
}
```

#### Keyframe Animations

| Animation | Duration | Use Case |
|-----------|----------|----------|
| `fadeIn` | 0.3s | General fade in |
| `slideInFromBottom` | 0.3s | Modal entry |
| `zoomIn` | 0.3s | Scale entry |
| `navMarqueeShimmer` | 2s infinite | Nav attention |
| `haloGlow` | 2s infinite | Attention halo |
| `marquee-flow` | 2s infinite | Choice hover |
| `orbBreathe` | 4s infinite | Journal orbs |
| `glassFloatIn` | 0.5s | Glass panel entry |

#### Utility Classes

| Class | Purpose |
|-------|---------|
| `.pb-safe-mobile` | Bottom padding with safe area |
| `.narrative-text` | Text shadow for readability |
| `.reading-width` | 32ch max-width |
| `.text-readable` | WCAG AA compliant #B8B8B8 |
| `.reader-mode` | Sans-serif font option |
| `.nav-attention-marquee` | Shimmer effect for nav |
| `.marquee-border` | Gradient border on hover |
| `.glass-float-in` | Panel entrance animation |

---

### 5. `styles/grand-central.css` (~800 lines)

**Purpose:** Game-specific visual feedback and theming.

#### Station Atmosphere

```css
.grand-central-terminus {
  --station-warmth: 0;
  --birmingham-earth: 15, 12%, 8%;
  --birmingham-stone: 25, 8%, 12%;
}
```

#### Platform States

| Class | Visual Effect |
|-------|---------------|
| `.platform-cold` | Blue tint, reduced brightness |
| `.platform-neutral` | Default state |
| `.platform-warm` | Amber warmth, subtle glow |
| `.platform-resonant` | Purple resonance, pulse |

#### Character Dialogue

```css
.speaker-maya .story-text {
  --accent: #5C8FD6;
  color: rgba(92, 143, 214, 0.95);
}
```

---

## Token Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    CANONICAL SOURCES                        │
├─────────────────────────────────────────────────────────────┤
│  lib/patterns.ts         → Pattern colors (5 patterns)      │
│  lib/ui-constants.ts     → Layout, spacing, z-index         │
│  lib/animations.ts       → Motion timing, springs           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CSS LAYER                                │
├─────────────────────────────────────────────────────────────┤
│  app/globals.css         → CSS variables, keyframes         │
│  styles/grand-central.css → Game theming                    │
│  tailwind.config.ts      → Tailwind extensions              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENTS                               │
├─────────────────────────────────────────────────────────────┤
│  Should import from canonical sources                       │
│  NOT define local color/timing constants                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Best Practices

### DO

1. **Import pattern colors from `lib/patterns.ts`**
   ```tsx
   import { PATTERN_METADATA, getPatternColor } from '@/lib/patterns'
   const blue = PATTERN_METADATA.analytical.color
   ```

2. **Use animation springs from `lib/animations.ts`**
   ```tsx
   import { springs, stagger } from '@/lib/animations'
   transition={{ ...springs.snappy }}
   ```

3. **Reference layout constants from `lib/ui-constants.ts`**
   ```tsx
   import { Z_INDEX, BUTTON_HEIGHT } from '@/lib/ui-constants'
   style={{ zIndex: Z_INDEX.modal }}
   ```

4. **Use CSS variables for runtime theming**
   ```tsx
   style={{ color: 'var(--text-primary)' }}
   ```

### DON'T

1. **Hardcode hex colors in components**
   ```tsx
   // BAD
   color: '#3B82F6'

   // GOOD
   color: PATTERN_METADATA.analytical.color
   ```

2. **Define local timing constants**
   ```tsx
   // BAD
   const FADE_DURATION = 0.3

   // GOOD
   import { durations } from '@/lib/animations'
   transition={{ duration: durations.normal }}
   ```

3. **Use magic numbers for dimensions**
   ```tsx
   // BAD
   style={{ height: 120 }}

   // GOOD
   import { MIN_HEIGHT } from '@/lib/ui-constants'
   className={MIN_HEIGHT.chart}
   ```

---

## Missing Tokens (Audit Findings)

The following tokens should be added to complete the system:

### 1. Pattern Hover Colors

```typescript
// Proposed addition to lib/ui-constants.ts
export const PATTERN_SHADOW_COLORS: Record<PatternType, string> = {
  analytical: `rgba(59, 130, 246, 0.2)`,   // blue
  patience: `rgba(16, 185, 129, 0.2)`,     // green
  exploring: `rgba(139, 92, 246, 0.2)`,    // purple
  helping: `rgba(236, 72, 153, 0.2)`,      // pink
  building: `rgba(245, 158, 11, 0.2)`,     // amber
}

// Or derive from PATTERN_METADATA
export function getPatternShadowColor(pattern: PatternType, opacity = 0.2): string {
  const hex = PATTERN_METADATA[pattern].color
  // Convert hex to rgba with opacity
}
```

### 2. Chart Dimensions

```typescript
// Proposed addition to lib/ui-constants.ts
export const CHART_DIMENSIONS = {
  sm: { height: 120, padding: 40 },
  md: { height: 160, padding: 48 },
  lg: { height: 200, padding: 56 },
} as const
```

### 3. CSS Duration Variables

```css
/* Proposed addition to globals.css */
:root {
  --duration-fast: 0.15s;
  --duration-normal: 0.25s;
  --duration-slow: 0.4s;
  --duration-dramatic: 0.6s;
}
```

---

## File Line Counts

| File | Lines | Purpose |
|------|-------|---------|
| `lib/ui-constants.ts` | 345 | Design tokens |
| `lib/patterns.ts` | 549 | Pattern system |
| `lib/animations.ts` | 372 | Motion configs |
| `app/globals.css` | 1556 | CSS variables & utilities |
| `styles/grand-central.css` | ~800 | Game theming |
| `tailwind.config.ts` | ~200 | Tailwind extensions |

---

**Document Status:** COMPLETE
**Last Verified:** January 22, 2026
