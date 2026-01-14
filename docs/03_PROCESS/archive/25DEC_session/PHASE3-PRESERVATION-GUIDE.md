# Phase 3: UI Preservation Guide
## Features to Carry Over to Sentient Glass

**Date:** December 25, 2025
**Purpose:** Document valuable current features before dark theme migration

---

## Critical Features (MUST Preserve)

### 1. Navigation Attention Marquee System

**Location:** `app/globals.css:210-347`

**What It Does:**
- Dual-layer shimmer effect (forward + reverse gradient sweep)
- Draws attention to nav buttons when player earns something
- Amber variant for Journal (new orbs)
- Purple variant for Constellation (new trust)

**Why It Matters:**
- "When player earns something → visual cue → navigate to discover change"
- Reinforces action-feedback loop without obtrusive popups
- Core to the game research pattern

**Migration Path:**
- KEEP the dual-layer technique
- ADAPT colors for dark theme (brighter/neon accents)
- TEST visibility against dark backgrounds

```css
/* Current - adapt for dark theme */
.nav-attention-marquee::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(251, 191, 36, 0.15) 25%,
    rgba(251, 191, 36, 0.3) 50%,
    rgba(251, 191, 36, 0.15) 75%,
    transparent 100%
  );
  animation: marqueeSlide 2s linear infinite;
}
```

---

### 2. Pattern Color System (Canonical)

**Location:** `lib/patterns.ts:25-92`

**The 5 Patterns (DO NOT CHANGE COLORS):**

| Pattern | Hex | Name | Character Trait |
|---------|-----|------|-----------------|
| Analytical | `#3B82F6` | The Weaver | Logical, data-driven |
| Patience | `#10B981` | The Anchor | Careful, measured |
| Exploring | `#8B5CF6` | The Voyager | Curious, discovery |
| Helping | `#EC4899` | The Harmonic | Empathetic, supportive |
| Building | `#F59E0B` | The Architect | Constructive, creative |

**Why It Matters:**
- Cognitive mapping - players learn to associate colors with decision styles
- Breaking this mapping destroys mental model built over gameplay

**Migration Path:**
- KEEP exact hex colors
- ADAPT glow opacity for dark backgrounds (may need brighter variants)
- TEST accessibility contrast ratios

---

### 3. Touch Target Standards (44px+)

**Location:** `lib/ui-constants.ts:26-41`

**Standards:**
- Choice buttons: 60px mobile, 56px desktop
- Nav buttons: 36px minimum (9x9 grid)
- Menu buttons: 56px (14h)

**Why It Matters:**
- Birmingham youth use phones in various contexts (bus, walking)
- Smaller targets = frustration and errors
- Apple HIG compliance

**Migration Path:** KEEP exact values in all glass components

---

### 4. Spring Physics (Framer Motion)

**Location:** `lib/animations.ts:14-26`

**Tuned Springs (DO NOT CHANGE):**
```typescript
springs.snappy:  { stiffness: 400, damping: 25 }  // Buttons
springs.smooth:  { stiffness: 300, damping: 30 }  // Panels
springs.gentle:  { stiffness: 200, damping: 25 }  // Fades
springs.quick:   { stiffness: 500, damping: 30 }  // Micro
```

**Why It Matters:**
- Values tuned through user testing
- Create the "juice" that makes interactions satisfying
- Generic easing curves feel mechanical

**Migration Path:** KEEP exact values for all glass animations

---

### 5. Staggered Text Reveal

**Location:** `components/RichTextRenderer.tsx:87-161`

**Philosophy:** "Kill the Typewriter"
- Paragraph-based progressive reveal (not character-by-character)
- Humans read by word shapes (saccades), not letters
- Character typing tested poorly - felt patronizing

**Features:**
- Split by `|` separator or `\n\n`
- Delay based on character personality
- Click-to-skip instant completion
- Respects reduced motion

**Migration Path:** KEEP as-is (works with any background)

---

### 6. Safe Area Handling (iOS)

**Location:** `app/globals.css:22-34`, `lib/ui-constants.ts:73-85`

```css
--safe-area-bottom: max(16px, env(safe-area-inset-bottom, 0px));
```

**Why It Matters:**
- Prevents content under iPhone X+ notches
- Birmingham youth heavily use iPhones

**Migration Path:** KEEP as-is, apply to glass panels

---

### 7. Reduced Motion Support

**Location:** `app/globals.css:339-347, 685-703`

```css
@media (prefers-reduced-motion: reduce) {
  .nav-attention-marquee::before { animation: none; }
  .pattern-orb { animation: none !important; opacity: 1; }
  .glass-float-in { opacity: 1; transform: none; }
}
```

**Why It Matters:**
- Accessibility for vestibular disorders
- UK Equality Act 2010 requirement

**Migration Path:** EXTEND to all new glass animations

---

## High-Priority Features (Should Preserve)

### 8. Character Avatars (32x32 Pixel Art)

**Location:** `components/CharacterAvatar.tsx:30-46`

**Mappings:**
- Samuel → Owl (wise)
- Maya → Cat (clever)
- Devon → Deer (gentle)
- Marcus → Bear (nurturing)
- Tess → Fox (guiding)
- Rohan → Raven (mysterious)
- Yaquin → Rabbit (curious)

**Migration Path:**
- ADAPT contrast for dark backgrounds
- Consider white outlines or glow for visibility
- TEST readability at 32px on glass panels

---

### 9. Inline Interaction Animations

**Location:** `lib/interaction-parser.ts`

**Markup Tags:**
- `<shake>text</shake>` - Horizontal jitter
- `<nod>text</nod>` - Vertical bounce
- `<ripple>text</ripple>` - Scale pulse
- `<bloom>text</bloom>` - Gentle grow
- `<jitter>text</jitter>` - Nervous vibration

**Why It Matters:**
- Emotional expressiveness without voice acting
- Writers can direct emphasis

**Migration Path:** KEEP as-is (works with any color)

---

### 10. Keyboard Navigation

**Location:** `components/GameChoices.tsx:104-179`

**Shortcuts:**
- `1-9` - Direct choice selection
- `↓` or `j` - Next choice
- `↑` or `k` - Previous choice
- `Enter/Space` - Select focused
- `Esc` - Clear focus

**Migration Path:**
- KEEP exact logic
- UPDATE focus ring color for dark theme

---

### 11. Orb-Gated Choices (KOTOR-style)

**Location:** `components/GameChoices.tsx:63-82, 226-243`

**Features:**
- Lock icon + required pattern label
- Grayed out, disabled cursor
- Mercy unlock when ALL choices locked

**Migration Path:**
- ADAPT lock visual to frosted glass style
- KEEP lock icon and pattern label
- TEST mercy unlock edge cases

---

### 12. Narrative Gravity (Choice Sorting)

**Location:** `components/GameChoices.tsx:434-441`

**Weights:**
- Attracted: 1.5 (top, green glow)
- Neutral: 1.0 (standard)
- Repelled: 0.6 (bottom, dimmed)

**Migration Path:**
- KEEP sorting logic exactly
- ENHANCE attract glow for dark theme (neon green?)
- TEST repel dimming on glass panels

---

### 13. Mobile Stagger Optimization

**Location:** `components/GameChoices.tsx:184-205`

**Desktop:** 80ms stagger, y-offset slide
**Mobile:** 40ms stagger (2x faster), opacity-only (no CLS)

**Why It Matters:**
- Performance on budget Android devices
- Prevents jank

**Migration Path:** KEEP exact timings for glass panels

---

## Medium-Priority Features (Adapt)

### 14. Trust Labels

**Location:** `lib/trust-labels.ts`

**Current Colors (need dark theme adaptation):**
- Kindred Spirit: `text-purple-600`
- Confidant: `text-indigo-600`
- Ally: `text-blue-600`
- Acquaintance/Observer/Stranger: `text-slate-*`

**Migration Path:**
- SHIFT to lighter variants (`text-*-400` or `text-*-300`)
- ADD subtle text-shadow or glow
- CONSIDER neon for "Kindred Spirit"

---

### 15. Hero Badge

**Location:** `components/HeroBadge.tsx:49-96`

**Current:** White badge with pattern color accents

**Migration Path:**
- SWITCH to glass panel styling
- INCREASE glow opacity for pattern border
- TEST against all 11 atmosphere colors

---

### 16. Limbic System Overlay

**Location:** `components/StatefulGameInterface.tsx:1731-1764`

**States:**
- Ventral Vagal (connection): No overlay
- Sympathetic (anxiety): Amber/red vignette
- Dorsal Vagal (shutdown): Gray vignette + grayscale

**Migration Path:**
- KEEP exact implementation
- ADJUST opacity for dark backgrounds
- ENSURE `pointer-events: none`

---

### 17. Layout Stability (CLS Prevention)

**Location:** `lib/ui-constants.ts:111-120`

**Min-Heights:**
```typescript
MIN_HEIGHT = {
  card: 'min-h-[200px]',
  cardLarge: 'min-h-[300px]',
  section: 'min-h-[400px]',
  chart: 'min-h-[160px]',
  list: 'min-h-[300px]',
}
```

**Migration Path:** APPLY to all glass panels

---

### 18. Scrollbar Gutter Stability

```tsx
<div style={{ scrollbarGutter: 'stable' }}>
```

**Migration Path:** APPLY to all scrollable glass areas

---

### 19. Battery-Aware Animation Timing

**Location:** `app/globals.css:330-336`

```css
/* Desktop: 2s */
/* Mobile: 3s (33% slower) */
```

**Migration Path:** APPLY to glass panel animations

---

## Features to Replace (Handled by Glass System)

### 20. Opaque Card Backgrounds
**Current:** `bg-amber-50/95`, `bg-slate-100/95`
**Replace with:** `var(--glass-bg)` + `backdrop-filter: blur(16px)`

### 21. Light Gradients
**Current:** `bg-gradient-to-b from-slate-50 to-slate-100`
**Replace with:** Character atmosphere backgrounds

### 22. Gray Shadows
**Current:** `shadow-sm`, `shadow-md`
**Replace with:** `var(--glass-shadow)` + colored glows

---

## Migration Checklist

### Phase 1: Color Adaptation
- [ ] Test pattern colors on dark backgrounds
- [ ] Create neon variants if needed
- [ ] Adjust trust label contrast
- [ ] Update choice hover glows (increase opacity)
- [ ] Validate WCAG AA ratios

### Phase 2: Component Styling
- [ ] Replace cards with glass panels
- [ ] Apply backdrop-filter blur
- [ ] Preserve spring physics exactly
- [ ] Keep touch targets (44px+)
- [ ] Test avatar visibility

### Phase 3: Animation Preservation
- [ ] Keep nav attention marquee (adapt colors)
- [ ] Preserve staggered text reveal
- [ ] Maintain mobile stagger (40ms)
- [ ] Keep orb breathing
- [ ] Extend reduced motion support

### Phase 4: Interaction Patterns
- [ ] Keep keyboard navigation (update focus ring)
- [ ] Preserve orb-gated choices (frosted lock)
- [ ] Maintain narrative gravity
- [ ] Keep inline animations
- [ ] Preserve click-to-skip

### Phase 5: Performance
- [ ] Enforce min-heights
- [ ] Apply scrollbar-gutter
- [ ] Battery-aware timing
- [ ] Test low-end Android
- [ ] Zero CLS target

### Phase 6: Accessibility
- [ ] Reduced motion testing
- [ ] Safe area handling
- [ ] Touch target validation
- [ ] Keyboard navigation testing
- [ ] Screen reader compatibility

---

## Summary

**CRITICAL (Must Preserve Exactly):**
1. Nav attention marquee (dual-layer shimmer)
2. Pattern colors (exact hex values)
3. Touch targets (44px+)
4. Spring physics values
5. Safe area handling
6. Reduced motion support

**HIGH (Keep Logic, Adapt Styling):**
7. Character avatars
8. Inline animations
9. Keyboard navigation
10. Orb-gated choices
11. Narrative gravity
12. Staggered text reveal
13. Mobile stagger optimization

**MEDIUM (Adapt for Dark Theme):**
14. Trust labels
15. Hero badge
16. Limbic overlay
17. Layout stability
18. Scrollbar gutter
19. Battery-aware timing

**REPLACE (Glass System Handles):**
20. Opaque backgrounds → Glass panels
21. Light gradients → Atmospheres
22. Gray shadows → Colored glows

---

*"The UI IS the game state."*
