# Phase 3: Sentient Glass UI Integration
## Applying JARVIS Principles to Lux Story

**Date:** December 25, 2025
**Status:** Planning
**Philosophy:** "The UI IS the game state"

---

## 1. Design Philosophy Translation

### JARVIS → Lux Story Mapping

| JARVIS (Clinical) | Lux Story (Game) | Meaning |
|-------------------|------------------|---------|
| Trust Within One Encounter | Trust Within First 30 Seconds | First impression is only impression |
| Friction is Clinical Time | Friction is Immersion Death | Every extra tap breaks story flow |
| Ambient Presence | Characters as Presence | NPCs feel alive without blocking |
| Safety Cannot Be Hidden | Pattern Milestones Visible | Progress always visible |
| Show, Then Verify | Choices Have Visible Consequences | Actions create visible change |
| Juice is Personality | Station Has Soul | Orb breathes, room responds |
| Escalating Visibility | Narrative Intensity | Ambient → Visible → Dramatic |
| Reversibility Always | Story Continues | No dead ends, always forward |
| Design for Interruption | Session State Preserved | Resume from any point |
| Less is More | Dialogue-Driven, Not UI-Driven | Story > Stats |

---

## 2. Current State vs Target State

### Current Visual Language

```
┌─────────────────────────────────────────────────────────────┐
│  CURRENT: Card-Based Design                                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [Character Header Card]                              │   │
│  │  Name • Trust Label                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [Dialogue Card]                                      │   │
│  │  "Text here..."                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [Choices Card]                                       │   │
│  │  "Your Response" header                               │   │
│  │  > Choice 1                                           │   │
│  │  > Choice 2                                           │   │
│  │  > Choice 3                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Background: bg-gradient-to-b from-slate-950 to-slate-900  │
└─────────────────────────────────────────────────────────────┘
```

### Target Visual Language: "Sentient Glass"

```
┌─────────────────────────────────────────────────────────────┐
│                  ATMOSPHERIC BACKGROUND                      │
│  (Full-screen, character-reactive environment)              │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    CONTENT LAYER                     │   │
│   │                                                      │   │
│   │   ╭─────────────────────────────────────────────╮   │   │
│   │   │ Glass Panel - Dialogue                       │   │   │
│   │   │ (backdrop-blur, subtle border, spring in)   │   │   │
│   │   │                                              │   │   │
│   │   │    "The station remembers you..."           │   │   │
│   │   │                                              │   │   │
│   │   │   [Samuel - Owl Avatar]                     │   │   │
│   │   ╰─────────────────────────────────────────────╯   │   │
│   │                                                      │   │
│   │   ╭─────────────────────────────────────────────╮   │   │
│   │   │ Glass Panel - Choices (float from bottom)   │   │   │
│   │   │                                              │   │   │
│   │   │   ▸ "Tell me more about the letter"        │   │   │
│   │   │   ▸ "I should explore on my own"           │   │   │
│   │   ╰─────────────────────────────────────────────╯   │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   [Orb] ← Bottom right, breathing glow                      │
│   [Grid Overlay]  [Vignette]                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Color System: Character-Reactive Atmosphere

### Atmosphere Colors (Background shifts with character)

| Character | Atmosphere | Glow Color | Personality |
|-----------|------------|------------|-------------|
| **Samuel** (Owl) | `#08050d` (deep violet-black) | Violet 5% | Wise, mysterious |
| **Maya** (Cat) | `#05070d` (dark indigo) | Indigo 5% | Tech, innovative |
| **Devon** (Deer) | `#050d08` (forest black) | Emerald 4% | Systems, nature |
| **Marcus** (Bear) | `#0d0808` (warm black) | Amber 4% | Medical, caring |
| **Tess** (Fox) | `#0d0a05` (copper-black) | Orange 4% | Education, clever |

### State Colors (Consistent with JARVIS)

```
PRIMARY STATES:
  Violet  #8b5cf6  - AI/System active (thinking, processing)
  Green   #10b981  - Ready, success, trust milestone
  Indigo  #6366f1  - Processing, waiting
  Gold    #eab308  - Complete, achievement
  Amber   #f59e0b  - Pattern recognition, insight

DANGER (Reserved):
  Red     #ef4444  - ONLY for identity ceremony, critical moments
```

### Glass Panel Colors

```css
/* Sentient Glass Card */
background: rgba(10, 12, 16, 0.75);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

---

## 4. Implementation Plan

### Phase 3.1: CSS Foundation (Low Risk)

**File:** `app/globals.css`

Add Sentient Glass CSS variables and keyframes:

```css
:root {
  /* Atmosphere Colors */
  --atmosphere-void: #05070a;
  --atmosphere-samuel: #08050d;
  --atmosphere-maya: #05070d;
  --atmosphere-devon: #050d08;
  --atmosphere-marcus: #0d0808;
  --atmosphere-tess: #0d0a05;

  /* Glass Panel */
  --glass-bg: rgba(10, 12, 16, 0.75);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: 16px;

  /* Spring Physics */
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Breathing animation for orbs */
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

/* Atmosphere glow */
@keyframes atmosphere-pulse {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.06; }
}
```

### Phase 3.2: Atmospheric Background Component

**New File:** `components/AtmosphericGameBackground.tsx`

```tsx
interface AtmosphericGameBackgroundProps {
  characterId: CharacterId | null
  isProcessing: boolean
  children: React.ReactNode
}

// Background shifts color based on current character
// Grid overlay, vignette, radial glow from center
```

### Phase 3.3: SentientGlassCard Component

**New File:** `components/ui/sentient-glass-card.tsx`

```tsx
interface SentientGlassCardProps {
  children: React.ReactNode
  variant?: 'dialogue' | 'choices' | 'floating'
  entrance?: 'left' | 'right' | 'bottom' | 'scale'
  glowColor?: string
  className?: string
}

// Glass morphism card with spring entrance animations
// Respects prefers-reduced-motion
```

### Phase 3.4: Update GameChoice Component

**File:** `components/game/game-choice.tsx`

Changes:
- Remove chevron icons (JARVIS: Less is More)
- Add glass morphism styling
- Add subtle glow on pattern-aligned choices
- Touch target remains 44px+

```tsx
// Pattern-aligned glow
const patternGlow = choice.pattern ? {
  boxShadow: `0 0 20px ${PATTERN_COLORS[choice.pattern]}20`
} : {}
```

### Phase 3.5: Update DialogueDisplay

**File:** `components/DialogueDisplay.tsx`

Changes:
- Wrap in SentientGlassCard
- Character avatar floats outside card (ambient presence)
- Text animation: word-by-word fade-in
- Emotion affects card glow color

### Phase 3.6: Update StatefulGameInterface

**File:** `components/StatefulGameInterface.tsx`

Changes:
- Replace bg-gradient with AtmosphericGameBackground
- Remove Card wrappers, use SentientGlassCard
- Journal/Constellation panels use glass morphism
- Add breathing orb indicator (pattern-reactive)

---

## 5. Pattern Orb - The Station's Soul

### Concept

Small orb in corner that reflects player's dominant pattern. Not interactive - purely ambient.

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                        [dialogue]                            │
│                                                              │
│                                                              │
│                                                          ◉   │ ← Breathing orb
│                                                    [pattern] │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Size: 40-60px (ambient, not hero)
- Color: Dominant pattern color
- Animation: Breathing pulse (4s cycle)
- On pattern milestone: Bright pulse + ring expansion

**Implementation:**

```tsx
// components/PatternOrb.tsx
const PATTERN_COLORS = {
  analytical: '#6366f1', // Indigo
  helping: '#10b981',    // Emerald
  building: '#eab308',   // Gold
  patience: '#8b5cf6',   // Violet
  exploring: '#f59e0b',  // Amber
}
```

---

## 6. Migration Strategy

### Incremental Rollout

| Step | Change | Risk |
|------|--------|------|
| 1 | Add CSS variables + keyframes | None |
| 2 | Create SentientGlassCard component | None |
| 3 | Create AtmosphericGameBackground | None |
| 4 | Apply to new AtmosphericIntro | Low |
| 5 | Apply to dialogue cards | Low |
| 6 | Apply to choices | Medium |
| 7 | Replace full interface background | Medium |
| 8 | Add PatternOrb | Low |

### Backwards Compatibility

- Keep existing Card component for admin pages
- New glass components are additive
- Feature flag: `useGlassMorphism` (localStorage)

---

## 7. Performance Considerations

### Backdrop Filter

`backdrop-filter: blur()` is GPU-intensive. Mitigations:

```tsx
// Use usePerformance hook
const perf = usePerformance()

// Fallback for low-end devices
const glassStyle = perf.canUseBlur
  ? { backdropFilter: 'blur(16px)' }
  : { backgroundColor: 'rgba(10, 12, 16, 0.95)' }
```

### Animation Budget

- Max 3 simultaneous spring animations
- Use `will-change: transform` sparingly
- Respect `prefers-reduced-motion`

---

## 8. Accessibility

### Reduced Motion

```tsx
const prefersReducedMotion = useReducedMotion()

const animation = prefersReducedMotion
  ? false  // No animation
  : 'visible'  // Spring animation
```

### Contrast Ratios

Glass panels maintain WCAG AA contrast:
- Text: `#f1f5f9` on `rgba(10, 12, 16, 0.75)` → 11.5:1
- Muted text: `#94a3b8` on same → 6.8:1

### Focus States

All interactive elements maintain visible focus:
```css
focus-visible:ring-2 focus-visible:ring-violet-400
```

---

## 9. Files to Create

| File | Purpose |
|------|---------|
| `components/AtmosphericGameBackground.tsx` | Character-reactive full-screen background |
| `components/ui/sentient-glass-card.tsx` | Glass morphism card with spring animations |
| `components/PatternOrb.tsx` | Breathing ambient orb |
| `styles/sentient-glass.css` | Glass morphism CSS variables and keyframes |
| `hooks/usePerformance.ts` | GPU detection for blur fallback |

---

## 10. Files to Modify

| File | Changes |
|------|---------|
| `app/globals.css` | Add CSS variables and keyframes |
| `lib/ui-constants.ts` | Add glass morphism tokens |
| `components/game/game-choice.tsx` | Glass styling, remove chevrons |
| `components/DialogueDisplay.tsx` | Glass card wrapper |
| `components/StatefulGameInterface.tsx` | Replace background, apply glass theme |
| `components/Journal.tsx` | Glass panel styling |
| `components/constellation/ConstellationPanel.tsx` | Glass panel styling |

---

## 11. Success Criteria

- [ ] Background shifts color based on current character
- [ ] Dialogue and choice cards use glass morphism
- [ ] Spring physics on card entrances
- [ ] Pattern orb breathes in corner
- [ ] Performance degrades gracefully on low-end devices
- [ ] Reduced motion preference respected
- [ ] WCAG AA contrast maintained
- [ ] Mobile touch targets remain 44px+
- [ ] "Feels like a game, not a UI" (user feedback)

---

## 12. Visual Reference

### The Signature Style

> **"The station feels alive."**

- Background subtly shifts with each character
- Glass panels float above the atmosphere
- The orb breathes in rhythm with the story
- Pattern milestones create visible ripples
- Less UI, more presence

---

*"The UI IS the game state."*
