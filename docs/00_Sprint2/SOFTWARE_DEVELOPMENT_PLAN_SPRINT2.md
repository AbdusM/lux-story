# Sprint 2: Chat Polish & Visual Identity

> "The station is a mirror. It shows you what you're looking for."

---

## Executive Summary

Sprint 2 focuses on **chat experience refinement** and **visual identity consolidation**. The ambient events system ("Station Breathes") is complete. Now we polish the conversation feel and establish the pixel avatar direction.

### Sprint 2 Priorities (Ranked)

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| **P0** | Character Typing Speeds | High | Low |
| **P0** | Internal Monologue Styling | High | Low |
| **P1** | Framer Motion Phase 1 | Medium | Medium |
| **P1** | Pixel Avatar Decision (32×32) | High | Design |
| **P2** | Framer Motion Phase 2 | Medium | Medium |
| **P3** | Half-Life Narrative Intro | Low | High |

---

## 1. Chat Polish (P0)

### 1.1 Character Typing Speeds

Each character should have a distinct "voice" through typing rhythm.

```typescript
// lib/character-config.ts
export const CHARACTER_TYPING: Record<string, {
  baseDelay: number    // ms between characters
  variance: number     // random variance ±
  pauseOnPunctuation: number  // extra delay after . , ! ?
}> = {
  samuel: { baseDelay: 45, variance: 15, pauseOnPunctuation: 300 },  // Slow, deliberate
  maya: { baseDelay: 25, variance: 20, pauseOnPunctuation: 150 },    // Quick, restless
  devon: { baseDelay: 35, variance: 5, pauseOnPunctuation: 200 },    // Precise, consistent
  jordan: { baseDelay: 30, variance: 25, pauseOnPunctuation: 100 },  // Casual, flowing
  marcus: { baseDelay: 50, variance: 10, pauseOnPunctuation: 350 },  // Measured, careful
  kai: { baseDelay: 40, variance: 20, pauseOnPunctuation: 400 },     // Thoughtful pauses
  tess: { baseDelay: 28, variance: 8, pauseOnPunctuation: 150 },     // Organized, efficient
  yaquin: { baseDelay: 38, variance: 30, pauseOnPunctuation: 250 },  // Dreamy, variable
}
```

**Implementation:**
1. Create `useCharacterTyping` hook
2. Integrate with existing dialogue display
3. Test feel with each character

### 1.2 Internal Monologue Styling

Player thoughts should be visually distinct from character speech.

```css
/* Existing dialogue */
.dialogue-character {
  @apply text-slate-800;
}

/* Player internal monologue */
.dialogue-internal {
  @apply text-slate-500 italic;
  font-size: 0.95em;
}

/* Pattern sensations (already implemented) */
.pattern-sensation {
  @apply text-amber-600/80 text-sm italic;
}
```

**Visual hierarchy:**
1. **Character speech**: Normal weight, full opacity
2. **Player thoughts**: Italic, muted, slightly smaller
3. **Ambient events**: Serif italic, atmospheric
4. **Pattern sensations**: Brief, warm accent color

---

## 2. Framer Motion Enhancements (P1-P2)

### Phase 1: Quick Wins (P1)

#### 2.1 Staggered Choice Animations

```typescript
// components/GameChoices.tsx
const choiceVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
}

// Usage
{choices.map((choice, i) => (
  <motion.button
    key={choice.id}
    custom={i}
    variants={choiceVariants}
    initial="hidden"
    animate="visible"
    whileHover={{ scale: 1.02, x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
    {choice.text}
  </motion.button>
))}
```

#### 2.2 Journal Tab Transitions

```typescript
// components/Journal.tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {tabContent}
  </motion.div>
</AnimatePresence>
```

#### 2.3 Constellation Panel Entrance

```typescript
// components/constellation/ConstellationPanel.tsx
const panelVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.05
    }
  }
}
```

### Phase 2: Medium Impact (P2)

#### 2.4 Thought Cabinet Drag-to-Dismiss

```typescript
// components/ThoughtCabinet.tsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.y > 100) onClose()
  }}
>
```

#### 2.5 Layout Animations for Lists

```typescript
// Any list that reorders
<motion.ul layout>
  {items.map(item => (
    <motion.li
      key={item.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  ))}
</motion.ul>
```

---

## 3. Pixel Avatar Direction (P1)

### Current State: Critical Issues

From `docs/PIXEL_AVATAR_SPECIFICATIONS.md`:

| Issue | Problem |
|-------|---------|
| Palette Overload | 9 colors in 256 pixels |
| Competing Focal Points | Ear tufts vs eyes |
| Undersized Eyes | 2×2 (should be 15-20% face) |
| Beak Dominance | Wrong focal point |
| Silhouette Complexity | Illegible at small scales |

### Recommended Direction: Path B (32×32)

**Rationale:**
- 4× the pixel budget (1024 vs 256)
- Eyes can be 4×4 with highlight
- Room for character expression
- Still distinctly pixel art
- Future-proof for animations

### Design Sprint Tasks

1. **Design**: Create 32×32 Samuel prototype
2. **Review**: Compare with 16×16 at all display sizes
3. **Iterate**: Apply style guide to remaining 8 characters
4. **Implement**: Update `CharacterAvatar.tsx` component

### Style Consistency Rules

From `docs/01_Sprint1/PIXEL_AVATAR_REVISION_PLAN.md`:

- **Eyes**: 3×3 minimum with 1px highlight
- **Outline**: 1px black, no anti-aliasing
- **Palette**: Max 10 colors per character
- **Silhouette**: Must read at 24px display size

---

## 4. Half-Life Narrative Intro (P3)

### Concept: "Arrival"

Before character selection, a brief arrival sequence:

```
[Train sounds, darkness]
[Light grows, station materializes]
[Brief environmental exposition]
[Samuel appears]
"Welcome to Grand Central Terminus."
```

### Why P3?

- High effort (new dialogue, animations, audio)
- Current flow works
- Can ship without it
- Revisit after core polish complete

### Design Principles (from Half-Life analysis)

| Principle | Application |
|-----------|-------------|
| Environmental Storytelling | Let station details speak |
| Show Don't Tell | Actions reveal character |
| Functional Design | Every element serves narrative |
| Player Agency | Constrained but meaningful choices |

---

## 5. Implementation Sequence

### Week 1: Chat Polish

```
Day 1-2: Character typing speeds
  - Create CHARACTER_TYPING config
  - Build useCharacterTyping hook
  - Integrate with DialogueDisplay
  - Test all 8 characters

Day 3-4: Internal monologue styling
  - Add CSS classes
  - Update dialogue renderer
  - Test visual hierarchy

Day 5: QA & refinement
```

### Week 2: Framer Motion Phase 1

```
Day 1: GameChoices stagger
Day 2: Journal tab transitions
Day 3: ConstellationPanel entrance
Day 4: PeopleView/SkillsView item stagger
Day 5: QA mobile performance
```

### Week 3: Avatar & Phase 2

```
Day 1-2: Pixel avatar design review
Day 3: ThoughtCabinet drag
Day 4: Layout animations
Day 5: Integration testing
```

---

## 6. Success Metrics

| Feature | Success Criteria |
|---------|------------------|
| Typing Speeds | Each character "feels" different |
| Internal Monologue | Clear visual hierarchy |
| Stagger Animations | Choices appear naturally |
| Drag Dismiss | Works on iOS Safari |
| Avatar | Reads clearly at 32px |

---

## 7. Dependencies & Risks

### Dependencies
- Framer Motion already installed
- Tailwind configured
- Ambient events system complete

### Risks
| Risk | Mitigation |
|------|------------|
| Animation performance on mobile | Test early, use GPU-accelerated properties |
| Typing speed feels artificial | A/B test with users |
| Avatar redesign scope creep | Strict 32×32, 10 color limit |

---

## 8. Files to Modify

### Chat Polish
- `lib/character-config.ts` (new)
- `hooks/useCharacterTyping.ts` (new)
- `components/DialogueDisplay.tsx`
- `styles/globals.css`

### Framer Motion
- `components/GameChoices.tsx`
- `components/Journal.tsx`
- `components/ThoughtCabinet.tsx`
- `components/constellation/ConstellationPanel.tsx`
- `components/constellation/PeopleView.tsx`
- `components/constellation/SkillsView.tsx`

### Avatar
- `components/CharacterAvatar.tsx`
- `public/avatars/*.png`

---

## Appendix: Completed Sprint 1 Items

- [x] Character switching fix
- [x] Build warnings resolved
- [x] Dialogue graph expansion
- [x] SkillTracker Zustand bridge
- [x] Insights engine
- [x] Ambient events system ("Station Breathes")
- [x] Pattern sensations
- [x] Design principles documentation

---

*Document created: 2025-12-07*
*Sprint 2 target completion: 3 weeks*
