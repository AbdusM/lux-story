# Lux Story Design Principles
## The Visual Language of Grand Central Terminus

> **Purpose**: Framework-agnostic design principles that define the product's visual identity. Use this document to maintain design consistency across implementations, framework migrations, and team onboarding.

---

## Table of Contents
1. [Philosophy](#philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Motion Language](#motion-language)
5. [Spatial Hierarchy](#spatial-hierarchy)
6. [State Visualization](#state-visualization)
7. [Signature Elements](#signature-elements)
8. [Accessibility](#accessibility)
9. [What to Keep vs Remove](#what-to-keep-vs-remove)

---

## Philosophy

### Core Design Commandments

These principles transcend implementation details:

1. **Feel Comes First** - The experience must feel good within the first 30 seconds. Controls intuitive, actions satisfying.

2. **The UI IS the Game State** - Visual feedback communicates meaning. Players should understand state through aesthetics, not labels.

3. **Friction is Failure** - Every moment of confusion is a design failure. If it needs explanation, redesign it.

4. **Juice is Not Optional** - Feedback for every action. Make simple actions feel powerful.

5. **Emotion Over Mechanics** - Mechanics serve emotional experience. What players feel matters more than what they do.

6. **Show, Don't Tell** - The world communicates narrative. Reduce text/tutorials through visual design.

### The Sentient Glass Philosophy

The UI is "alive" - it responds to player patterns, character presence, and narrative moments. The station notices you.

```
Visual Metaphor: A train station at dusk
- Warm amber glows guide attention
- Glass panels float with depth
- Subtle breathing animations suggest life
- Colors shift with character presence
```

---

## Color System

### Pattern Colors (The Five Archetypes)

These colors represent core player behavioral patterns. They are **semantically meaningful** - not decorative.

| Pattern | Archetype Name | Hex | RGB | Meaning |
|---------|---------------|-----|-----|---------|
| **Analytical** | The Weaver | `#3B82F6` | `59, 130, 246` | Logic, data-driven, connections |
| **Patience** | The Anchor | `#10B981` | `16, 185, 129` | Stillness, careful consideration |
| **Exploring** | The Voyager | `#8B5CF6` | `139, 92, 246` | Curiosity, discovery, unknown |
| **Helping** | The Harmonic | `#EC4899` | `236, 72, 153` | Empathy, connection, support |
| **Building** | The Architect | `#F59E0B` | `245, 158, 11` | Creation, construction, action |

**Usage Rules:**
- Pattern colors appear on hover states, choice highlights, and orb fills
- Never use pattern colors for decorative purposes - they carry meaning
- Glow intensity scales with pattern strength (0-100%)

### Character Colors

Each character has a unique color identity that subtly influences the atmosphere:

| Character | Role | Primary Color | Atmosphere Hint |
|-----------|------|---------------|-----------------|
| Samuel | Station Keeper | Gold/Amber `#FFD87A` | Wise, warm |
| Maya | Tech Innovator | Blue `#5C8FD6` | Cool, innovative |
| Devon | Systems Thinker | Orange `#E6A965` | Practical, grounded |
| Jordan | Career Navigator | Purple `#A96CC8` | Creative, guiding |
| Marcus | Medical Tech | Green `#50BE5A` | Caring, steady |
| Kai | Safety Specialist | Teal `#32B4D2` | Present, protective |
| Tess | Education Founder | Coral `#E67846` | Organized, clever |
| Yaquin | EdTech Creator | Gold `#DCC050` | Artistic, innovative |

**Implementation:**
```css
/* Character atmosphere tints the background */
--atmosphere-samuel: #08050d;  /* Deep violet-black */
--atmosphere-maya: #05070d;    /* Dark indigo */
--atmosphere-devon: #050d08;   /* Forest black */
```

### Glass Panel Colors

The "Sentient Glass" design system uses translucent panels:

```css
--glass-bg: rgba(10, 12, 16, 0.60);        /* Base transparency */
--glass-bg-solid: rgba(10, 12, 16, 0.92);  /* For readability */
--glass-border: rgba(255, 255, 255, 0.08);
--glass-blur: 20px;
```

**Critical Rule:** Dialogue containers need **85%+ opacity** for text readability.

### Attention Colors

| Use Case | Color | Purpose |
|----------|-------|---------|
| Primary Attention | Amber `#FBF524` | New content, discoveries |
| Secondary Attention | Purple `#8B5CF6` | Trust changes, relationships |
| Success | Green `#22C55E` | Completions, achievements |
| Warning | Amber `#F59E0B` | Caution states |
| Critical | Red `#EF4444` | Errors, locked content |

---

## Typography

### Font Stack

```css
--font-sans: 'Inter', system-ui, sans-serif;      /* UI elements */
--font-serif: 'Crimson Pro', Georgia, serif;       /* Narrative text */
--font-mono: 'Space Mono', ui-monospace, monospace; /* Terminal/code feel */
--font-slab: 'Roboto Slab', serif;                 /* Headers, emphasis */
```

### Text Hierarchy

| Use Case | Size | Line Height | Letter Spacing |
|----------|------|-------------|----------------|
| Narration | 1.125rem (18px) | 2 | 0.05em |
| Dialogue | 1rem (16px) | 1.625 | 0.025em |
| Choices | 0.875rem (14px) | 1.5 | 0.01em |
| HUD/Labels | 0.75rem (12px) | 1.4 | 0.05em |
| Celebration | 1.5rem (24px) | 1.3 | 0 |

### Dialogue Text Color

```css
/* WCAG AA compliant on dark backgrounds */
--text-dialogue: rgba(235, 205, 160, 0.93);
```

This warm cream color provides excellent readability on the dark glass panels while maintaining the atmospheric quality.

### Character Voice Styling

Each character has distinct typography treatment:
- **Samuel**: Measured, slightly slower typing speed
- **Maya**: Quick, technical cadence
- **Devon**: Steady, methodical

> **Implementation Note (Dec 2024):** Character voice differentiation was simplified to
> unified monospace typography for stability. Rationale documented in `lib/voice-utils.ts`:
> - Text-game heritage (Zork aesthetic)
> - Predictable character tracking reduces eye strain
> - Field notes aesthetic for Birmingham career exploration
>
> **Stability Note:** ChatPacedDialogue is globally disabled (`shouldUseChatPacing = false`
> in `DialogueDisplay.tsx`) due to rendering bugs causing blank screens. Character typing
> speeds are not currently active.

---

## Motion Language

### Spring Physics

All animations use spring physics, not linear timing. This creates organic, natural movement.

```typescript
// Canonical spring configurations
springs.snappy  // { stiffness: 400, damping: 25 } - Buttons, micro-interactions
springs.smooth  // { stiffness: 300, damping: 30 } - Panels, modals
springs.gentle  // { stiffness: 200, damping: 25 } - Fades, reveals
springs.quick   // { stiffness: 500, damping: 30 } - Micro-interactions
```

### Duration Guidelines

| Use Case | Duration | Spring |
|----------|----------|--------|
| Button press | ~100ms | `springs.quick` |
| Micro-interactions | ~150ms | `springs.snappy` |
| Panel transitions | ~300ms | `springs.smooth` |
| Page transitions | ~500ms | `springs.smooth` |
| Atmospheric effects | 2-8s | CSS keyframes |

### Stagger Patterns

Sequential reveals use staggered timing:

```typescript
stagger.fast   = 0.05  // 50ms between items
stagger.normal = 0.08  // 80ms between items (default)
stagger.slow   = 0.12  // 120ms for dramatic reveals
```

### Signature Animations

#### 1. Fox Theatre Marquee
Chase-light effect inspired by Birmingham's Fox Theatre. Used for attention-grabbing moments.

```css
/* Rotating conic gradient creates the "chase" effect */
background: conic-gradient(
  from var(--border-angle),
  rgba(var(--marquee-color), 0.1) 0%,
  rgba(var(--marquee-color), 1) 15%,
  transparent 30%
);
animation: border-spin 2s linear infinite;
```

**When to use:**
- Intro CTA button
- Pivotal choice moments
- New content notifications
- Trust milestones

#### 2. Orb Breathing
Pattern orbs "breathe" with subtle scale/opacity changes:

```css
@keyframes orbBreathe {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
}
```

#### 3. Kinetic Typography
Text effects for emphasis:
- **Wave**: Letters bounce sequentially
- **Shadow Pulse**: Glowing text shadows
- **Weight Shift**: Bold animation
- **Glitch**: Error/tension moments

#### 4. Narrative Interactions (iPhone Message Style)
One-shot emphasis animations:
- `big` - Scale up (importance)
- `small` - Scale down (diminishment)
- `shake` - Horizontal shake (disagreement, tension)
- `nod` - Vertical bob (agreement)
- `ripple` - Ripple out (resonance)
- `bloom` - Scale + rotate (revelation)
- `jitter` - Subtle shake (nervousness)

### What NOT to Animate

**Avoid these effects - they cause visual instability:**

| Effect | Problem |
|--------|---------|
| Full-screen color overlays | Distracting, "flashing" |
| Background transitions on containers | Color jumping |
| Position animations on main containers | Layout shift |
| Processing pulses on large areas | Battery drain |

---

## Spatial Hierarchy

### Container Widths

```css
max-w-sm   // 384px - Compact cards
max-w-md   // 448px - Standard cards
max-w-lg   // 512px - Large cards
max-w-xl   // 576px - Wide content
max-w-2xl  // 672px - Full-width panels
max-w-4xl  // 896px - Desktop layouts
```

### Touch Targets

Following Apple HIG and Material Design guidelines:

```css
/* Minimum touch targets */
min-h-[36px]  // Small (icon-only, compact)
min-h-[44px]  // Default - Apple HIG minimum
min-h-[52px]  // Large CTAs
```

### Spacing Scale

```css
/* Mobile-first spacing */
p-4   // 16px - Base mobile padding
p-6   // 24px - Tablet padding
p-8   // 32px - Desktop padding

/* Game-specific spacing */
--game-xs: 0.375rem   // 6px
--game-sm: 0.75rem    // 12px
--game-md: 1.5rem     // 24px
--game-lg: 3rem       // 48px
```

### Layout Structure

The game uses a Card-based composition pattern within a flex container:

```
┌─────────────────────────────────────────┐
│ HEADER - Navigation + Menu (fixed)      │
├─────────────────────────────────────────┤
│ SCROLLABLE AREA                         │
│   └─ Dialogue Card (glass-panel, 85%+)  │
│   └─ [Ending state when complete]       │
├─────────────────────────────────────────┤
│ CHOICES FOOTER (glass-panel, fixed)     │
│   └─ Scroll overflow for many choices   │
└─────────────────────────────────────────┘
```

**Critical:** Header and footer use `flex-shrink-0`. Only main content scrolls.

> **Implementation Note (Dec 2024):** The actual implementation in `StatefulGameInterface.tsx`
> uses Card components with glass-panel styling rather than raw flex layout. The diagram
> above reflects the current architecture. Touch targets exceed spec at 56-60px for better
> mobile accessibility.

### Safe Areas (Mobile)

```css
/* iOS safe area handling */
padding-bottom: max(16px, env(safe-area-inset-bottom));
```

---

## State Visualization

### How States Manifest Visually

The UI communicates state through aesthetics, not labels:

| State | Visual Treatment |
|-------|------------------|
| **Processing** | Typing indicator, contextual state text |
| **Choice Available** | Buttons appear with stagger animation |
| **New Content** | Nav button glows with marquee effect |
| **Pattern Growing** | Orb pulses, glow intensifies |
| **Trust Milestone** | Dialogue card gets marquee border |
| **Locked Choice** | Dimmed, lock icon, requirement shown |
| **Character Speaking** | Avatar visible, atmosphere tints |

### Platform Warmth States

The environment responds to player patterns:

```css
.platform-cold    /* Blue tint, dimmed */
.platform-neutral /* Default state */
.platform-warm    /* Golden glow */
.platform-resonant /* Full color, pulsing */
```

### Trust Visualization

Trust level affects character name styling:

```css
.trust-low    /* opacity: 0.7 */
.trust-medium /* opacity: 0.9, font-weight: 500 */
.trust-high   /* opacity: 1, font-weight: 600, text-shadow glow */
```

### Environmental Response

The station "breathes" based on player behavior:

```css
/* High patience pattern */
animation: calm-breathe 6s ease-in-out infinite;

/* High rushing pattern */
animation: anxiety-shake 0.5s ease-in-out infinite;
```

---

## Signature Elements

### Elements That Define the Product

Keep these - they ARE the product's visual identity:

#### 1. Fox Theatre Marquee Effect
The chase-light border effect on pivotal moments. Inspired by Birmingham's Fox Theatre.

#### 2. Pattern Orbs
Five colored orbs representing player archetypes. They breathe, pulse, and fill based on choices.

#### 3. Glass Morphism Panels
Translucent, blurred panels with subtle inner edge lighting create depth.

#### 4. Character Atmosphere
Each character subtly tints the background color when speaking.

#### 5. Thinking Indicators
Contextual states like "reflecting...", "considering..." with character-specific variations.

#### 6. 32×32 Pixel Art Avatars
Zootopia-style animal characters in pixel art. Only shown in side menus, not main dialogue.

#### 7. Theatre Stars Background
Subtle twinkling star field for atmospheric moments (Quiet Hour).

---

## Accessibility

### Non-Negotiable Requirements

1. **Reduced Motion Support**
   ```css
   @media (prefers-reduced-motion: reduce) {
     animation: none !important;
   }
   ```
   Every animation must have a reduced-motion fallback.

2. **Minimum Touch Targets**
   44×44px minimum for all interactive elements.

3. **Color Contrast**
   - Text on glass panels: 8:1 ratio minimum
   - `--text-dialogue: rgba(235, 205, 160, 0.93)` achieves this

4. **Dynamic Type Support**
   ```css
   html { font-size: 100%; } /* Respects browser/system settings */
   ```

5. **High Contrast Mode**
   ```css
   [data-contrast="high"] {
     --bg-primary: black;
     --text-primary: white;
     --accent-color: yellow;
   }
   ```

### Keyboard Navigation

All interactive elements must be keyboard accessible:
- Arrow keys for choice navigation
- Number keys (1-9) for direct selection
- Enter/Space for activation
- Escape to dismiss

---

## What to Keep vs Remove

### ✅ KEEP (Defines Product Identity)

| Element | Reason |
|---------|--------|
| Fox Theatre marquee | Signature attention effect |
| Pattern orbs with breathing | Core game mechanic visualization |
| Glass morphism panels | Establishes atmospheric depth |
| Character atmosphere tints | Subtle immersion enhancement |
| Kinetic typography | Narrative emphasis |
| Spring physics animations | Natural, organic feel |
| Warm amber attention color | Guides without alarming |
| Thinking indicators | Human-like character presence |

### ❌ REMOVE (Causes Problems)

| Element | Problem |
|---------|---------|
| Full-screen color transitions | Distracting, jarring |
| Processing pulses on large areas | Battery drain, visual noise |
| Position animations on containers | Layout shift |
| Center-aligned narrative text | Hard to read |
| Monospace fonts in narrative | Reduces readability |
| Low-contrast text (<60% opacity) | Accessibility failure |
| Auto-playing looping animations | Distracting, battery drain |

### ⚠️ USE SPARINGLY

| Element | Guidance |
|---------|----------|
| Marquee effects | Only for pivotal moments, trust milestones |
| Shake animations | Only for tension/disagreement |
| Character atmosphere | Subtle tint only, no dramatic shifts |
| Glitch effects | Error states only |

---

## Implementation Checklist

When implementing this design system in any framework:

### Colors
- [ ] Pattern colors match hex values exactly
- [ ] Character colors used for their designated characters only
- [ ] Glass panels at 85%+ opacity for dialogue
- [ ] Attention colors follow semantic meaning

### Typography
- [ ] Font stack falls back appropriately
- [ ] Line heights match specifications
- [ ] Dialogue text uses warm cream color
- [ ] Character voice styles implemented

### Motion
- [ ] Spring physics, not linear timing
- [ ] Stagger delays for sequential reveals
- [ ] Reduced motion support for all animations
- [ ] No layout-shifting animations on containers

### Layout
- [ ] Touch targets minimum 44px
- [ ] Safe area handling for mobile
- [ ] Fixed header/footer, scrolling main content
- [ ] Consistent spacing scale

### States
- [ ] Pattern colors appear on relevant interactions
- [ ] Trust levels visualized through styling
- [ ] New content triggers attention effects
- [ ] Processing states show thinking indicators

---

## Code Evidence

This document was extracted from:

```
styles/
├── grand-central.css      # Core theme, character colors, platform states
├── game-juice.css         # Interaction feedback, hover states
├── kinetic-typography.css # Text animations
├── narrative-interactions.css # Message-style animations
├── environmental-response.css # Player pattern reactions
├── scroll-animations.css  # Scroll-driven effects
└── accessibility.css      # A11y overrides

lib/
├── animations.ts          # Spring configs, variants
├── ui-constants.ts        # Spacing, touch targets, z-index
├── patterns.ts            # Pattern metadata, colors
└── voice-utils.ts         # Character typography

app/
└── globals.css            # CSS variables, glass morphism, atmosphere

tailwind.config.ts         # Design tokens
```

---

*Last updated: December 2024*
*Version: 1.0*
