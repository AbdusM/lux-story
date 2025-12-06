# Framer Motion Enhancement Plan

> Comprehensive guide to implementing advanced animations across the Lux Story platform

## Table of Contents
1. [Current Implementation](#current-implementation)
2. [Feature Overview](#feature-overview)
3. [Component-Specific Enhancements](#component-specific-enhancements)
4. [Interaction Patterns](#interaction-patterns)
5. [Advanced Techniques](#advanced-techniques)
6. [Implementation Priorities](#implementation-priorities)
7. [Code Examples](#code-examples)

---

## Current Implementation

### What We're Using Now
| Feature | Usage | Files |
|---------|-------|-------|
| `motion.div` | Basic animations | Throughout |
| `AnimatePresence` | Mount/unmount | Panels, Modals |
| `spring` transitions | Panel slides | Journal, Constellation, ThoughtCabinet |
| `variants` | State-based animations | Panel states |

### Current Animation Values
```typescript
// Standard spring config used across app
{ type: "spring", stiffness: 300, damping: 30 }
```

---

## Feature Overview

### Framer Motion Capabilities

| Feature | Description | Complexity | Impact |
|---------|-------------|------------|--------|
| `whileHover` | Hover state animations | Low | Medium |
| `whileTap` | Press/click feedback | Low | Medium |
| `whileInView` | Scroll-triggered animations | Low | High |
| `whileDrag` | Drag interaction states | Medium | Medium |
| `layout` | Automatic layout animations | Medium | High |
| `layoutId` | Shared element transitions | Medium | Very High |
| `useScroll` | Scroll-linked values | Medium | High |
| `useTransform` | Value transformations | Medium | High |
| `useSpring` | Spring-based motion values | Medium | Medium |
| `useMotionValue` | Imperative animation control | Medium | Medium |
| `staggerChildren` | Sequenced child animations | Low | High |
| `AnimatePresence` | Exit animations | Low | High |
| `LayoutGroup` | Coordinated layout animations | High | Very High |

---

## Component-Specific Enhancements

### 1. Dialogue System

#### DialogueDisplay.tsx
**Current:** Text appears with RichTextRenderer effects
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Character avatar pulse on new message | `animate` with keyframes | Medium |
| Dialogue card entrance | `whileInView` + stagger | High |
| Emotion indicator transitions | `layout` + color spring | Medium |
| Speaker name slide-in | `initial`/`animate` | Low |

```typescript
// Dialogue card entrance
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
>
```

#### GameChoices.tsx
**Current:** Basic motion.div wrapper
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Staggered choice appearance | `staggerChildren` | High |
| Hover lift + shadow | `whileHover` | High |
| Tap feedback | `whileTap` | High |
| Selected state pulse | `animate` loop | Medium |
| Disabled state fade | `animate` opacity | Low |

```typescript
// Staggered choices
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
}

// Choice button interactions
<motion.button
  variants={item}
  whileHover={{
    scale: 1.02,
    y: -2,
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
  }}
  whileTap={{ scale: 0.98 }}
>
```

### 2. Constellation System

#### ConstellationPanel.tsx
**Current:** Slide-in panel with spring
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Tab switching animation | `layout` | High |
| Background star parallax | `useScroll` + `useTransform` | Medium |
| Panel resize animation | `layout` | Low |

#### PeopleView.tsx
**Current:** SVG nodes with hover states
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Node → Modal shared transition | `layoutId` | Very High |
| Trust level pulse animation | `animate` keyframes | High |
| Connection lines draw-in | SVG `pathLength` | High |
| Unlock celebration burst | `AnimatePresence` + particles | Medium |
| Hover tooltip spring | `whileHover` + scale | Medium |

```typescript
// Shared element transition for character
// In PeopleView (constellation node)
<motion.circle
  layoutId={`character-${character.id}`}
  cx={character.x}
  cy={character.y}
  r={nodeRadius}
  onClick={() => setSelectedCharacter(character)}
/>

// In DetailModal (expanded view)
<motion.div
  layoutId={`character-${character.id}`}
  className="w-24 h-24 rounded-full"
/>
```

#### SkillsView.tsx
**Current:** SVG skill nodes
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Skill unlock ripple effect | Keyframe animation | High |
| Cluster grouping animation | `LayoutGroup` | Medium |
| Progress ring animation | SVG `pathLength` | High |
| Dormant → Active transition | `layout` + color | High |

```typescript
// Skill progress ring
<motion.circle
  initial={{ pathLength: 0 }}
  animate={{ pathLength: skill.progress }}
  transition={{ duration: 1, ease: "easeOut" }}
  style={{
    strokeDasharray: "1 1",
    strokeDashoffset: 0
  }}
/>
```

#### DetailModal.tsx
**Current:** Bottom sheet with spring
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Shared element from node | `layoutId` | Very High |
| Content stagger | `staggerChildren` | Medium |
| Drag to dismiss | `drag` + `dragConstraints` | High |
| Progress bar animation | `animate` width | Medium |

```typescript
// Drag to dismiss
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={{ top: 0, bottom: 0.5 }}
  onDragEnd={(_, info) => {
    if (info.offset.y > 100) onClose()
  }}
>
```

### 3. Side Panels

#### Journal.tsx
**Current:** Slide-in panel
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Section expand/collapse | `layout` + `AnimatePresence` | High |
| Insight cards scroll reveal | `whileInView` | High |
| Pattern badge animations | `layout` | Medium |
| Swipe to close | `drag` | Medium |

```typescript
// Scroll-triggered insight reveal
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  <InsightCard />
</motion.div>
```

#### ThoughtCabinet.tsx
**Current:** Slide-in panel with expand/collapse
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Thought progress bar animation | `animate` width | High |
| Developing → Internalized transition | `layoutId` | Very High |
| Thought card expand | `layout` | Medium |
| Icon morph on state change | `animate` | Low |

```typescript
// Thought moving between sections
// In "Developing" section
<motion.div layoutId={`thought-${thought.id}`}>
  <ThoughtCard thought={thought} />
</motion.div>

// In "Internalized" section (same layoutId = smooth transition)
<motion.div layoutId={`thought-${thought.id}`}>
  <ThoughtCard thought={thought} internalized />
</motion.div>
```

### 4. Character System

#### CharacterAvatar.tsx
**Current:** Pixel art rendering
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Speaking pulse animation | `animate` scale loop | High |
| Emotion transition | `animate` + color shift | Medium |
| Entrance animation | `initial`/`animate` | Medium |

```typescript
// Speaking indicator pulse
<motion.div
  animate={isSpeaking ? {
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 1.5 }
  } : {}}
>
  <PixelAvatar />
</motion.div>
```

### 5. Navigation & UI

#### Menu Bar Icons
**Current:** Static icons with click handlers
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Hover bounce | `whileHover` scale | High |
| Active state pulse | `animate` loop | Medium |
| Notification badge pop | `AnimatePresence` | Medium |
| Icon morphing | `animate` path | Low |

```typescript
// Menu icon interaction
<motion.button
  whileHover={{ scale: 1.1, rotate: 5 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  <Icon />
</motion.button>
```

#### Progress Indicators
**Current:** Static percentage display
**Opportunities:**

| Enhancement | Feature | Priority |
|-------------|---------|----------|
| Progress ring animation | SVG `pathLength` | High |
| Number count-up | `useSpring` + `useTransform` | Medium |
| Milestone celebration | Keyframe burst | Medium |

```typescript
// Animated progress percentage
const springValue = useSpring(progress, { stiffness: 100, damping: 30 })
const display = useTransform(springValue, v => `${Math.round(v)}%`)

<motion.span>{display}</motion.span>
```

---

## Interaction Patterns

### Micro-Interactions Library

#### Button States
```typescript
const buttonVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 17 }
  },
  tap: { scale: 0.98 },
  disabled: { opacity: 0.5, scale: 1 }
}
```

#### Card Interactions
```typescript
const cardVariants = {
  idle: {
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  tap: {
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
  }
}
```

#### List Item Stagger
```typescript
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
}
```

### Gesture Patterns

#### Swipe to Dismiss
```typescript
const swipeToDismiss = {
  drag: "x" as const,
  dragConstraints: { left: 0, right: 0 },
  dragElastic: { left: 0.5, right: 0.5 },
  onDragEnd: (_, info) => {
    if (Math.abs(info.offset.x) > 100) {
      onDismiss()
    }
  }
}
```

#### Pull to Refresh
```typescript
const pullToRefresh = {
  drag: "y" as const,
  dragConstraints: { top: 0, bottom: 0 },
  dragElastic: { top: 0.5, bottom: 0 },
  onDragEnd: (_, info) => {
    if (info.offset.y > 80) {
      onRefresh()
    }
  }
}
```

---

## Advanced Techniques

### 1. Shared Element Transitions with LayoutGroup

```typescript
import { LayoutGroup, motion } from "framer-motion"

function ConstellationWithModal() {
  const [selected, setSelected] = useState(null)

  return (
    <LayoutGroup>
      {/* Constellation nodes */}
      {characters.map(char => (
        <motion.div
          key={char.id}
          layoutId={`char-${char.id}`}
          onClick={() => setSelected(char)}
        />
      ))}

      {/* Detail modal - same layoutId creates smooth morph */}
      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId={`char-${selected.id}`}
            className="modal"
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}
```

### 2. Scroll-Linked Parallax

```typescript
import { useScroll, useTransform, motion } from "framer-motion"

function ParallaxConstellation() {
  const { scrollYProgress } = useScroll()

  // Stars move at different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

  return (
    <>
      <motion.div style={{ y: y1 }} className="stars-layer-1" />
      <motion.div style={{ y: y2 }} className="stars-layer-2" />
      <motion.div style={{ opacity }} className="content" />
    </>
  )
}
```

### 3. SVG Path Animations

```typescript
// Skill connection lines drawing in
<motion.path
  d={connectionPath}
  initial={{ pathLength: 0, opacity: 0 }}
  animate={{ pathLength: 1, opacity: 1 }}
  transition={{ duration: 1.5, ease: "easeInOut" }}
  stroke="currentColor"
  strokeWidth={2}
  fill="none"
/>

// Progress ring
<motion.circle
  cx={50}
  cy={50}
  r={40}
  stroke="currentColor"
  strokeWidth={4}
  fill="none"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: progress }}
  style={{ rotate: -90, transformOrigin: "center" }}
/>
```

### 4. Orchestrated Sequences

```typescript
import { useAnimate, stagger } from "framer-motion"

function CelebrationSequence() {
  const [scope, animate] = useAnimate()

  async function playCelebration() {
    // Burst particles outward
    await animate(
      ".particle",
      { scale: [0, 1.5, 0], opacity: [1, 1, 0] },
      { duration: 0.6, delay: stagger(0.05) }
    )

    // Main element pulse
    await animate(
      ".main",
      { scale: [1, 1.2, 1] },
      { duration: 0.4, type: "spring" }
    )

    // Text fade in
    await animate(
      ".text",
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.3 }
    )
  }

  return <div ref={scope}>...</div>
}
```

### 5. Physics-Based Dragging

```typescript
import { useMotionValue, useSpring, useTransform } from "framer-motion"

function DraggablePanel() {
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })

  // Rotation based on drag velocity
  const rotate = useTransform(x, [-200, 200], [-10, 10])

  // Opacity based on drag distance
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])

  return (
    <motion.div
      drag="x"
      style={{ x: springX, rotate, opacity }}
      dragConstraints={{ left: -200, right: 200 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          // Dismiss
        }
      }}
    />
  )
}
```

---

## Implementation Priorities

### Phase 1: Quick Wins (1-2 days)
High impact, low complexity

| Component | Enhancement | Effort |
|-----------|-------------|--------|
| GameChoices | Staggered appearance | 2 hours |
| GameChoices | whileHover/whileTap | 1 hour |
| Menu icons | Hover animations | 1 hour |
| Journal | whileInView for insights | 2 hours |

### Phase 2: Medium Impact (3-5 days)
Moderate complexity, significant UX improvement

| Component | Enhancement | Effort |
|-----------|-------------|--------|
| DetailModal | Drag to dismiss | 3 hours |
| ThoughtCabinet | layout for expand/collapse | 4 hours |
| SkillsView | Progress ring animation | 3 hours |
| PeopleView | Trust level pulse | 2 hours |

### Phase 3: Advanced (1-2 weeks)
High complexity, transformative UX

| Component | Enhancement | Effort |
|-----------|-------------|--------|
| Constellation | layoutId shared transitions | 1 day |
| ThoughtCabinet | layoutId for thought movement | 1 day |
| PeopleView | SVG connection line draw | 4 hours |
| Full app | Scroll-linked parallax | 1 day |

---

## Code Examples

### Complete: Animated Choice Button

```typescript
// components/AnimatedChoiceButton.tsx
import { motion } from "framer-motion"

interface AnimatedChoiceButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  pattern?: string
}

const patternColors = {
  helping: "hover:border-emerald-400",
  analytical: "hover:border-blue-400",
  building: "hover:border-amber-400",
  exploring: "hover:border-purple-400",
  patience: "hover:border-rose-400"
}

export function AnimatedChoiceButton({
  children,
  onClick,
  disabled,
  pattern
}: AnimatedChoiceButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 rounded-xl border-2 border-slate-200
        dark:border-slate-700 text-left
        ${pattern ? patternColors[pattern] : ""}
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.button>
  )
}
```

### Complete: Shared Element Character Modal

```typescript
// components/constellation/SharedElementModal.tsx
import { motion, AnimatePresence } from "framer-motion"

interface SharedElementModalProps {
  character: Character | null
  onClose: () => void
}

export function SharedElementModal({ character, onClose }: SharedElementModalProps) {
  return (
    <AnimatePresence>
      {character && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Modal with shared layoutId */}
          <motion.div
            layoutId={`character-card-${character.id}`}
            className="fixed bottom-0 inset-x-0 z-50 bg-slate-900 rounded-t-2xl p-6"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose()
            }}
          >
            {/* Shared avatar element */}
            <motion.div
              layoutId={`character-avatar-${character.id}`}
              className="w-20 h-20 rounded-full mx-auto"
              style={{ backgroundColor: character.color }}
            />

            {/* Content that fades in after layout animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2>{character.name}</h2>
              <p>{character.description}</p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Complete: Scroll-Triggered Journal Insights

```typescript
// components/ScrollRevealInsight.tsx
import { motion } from "framer-motion"

interface ScrollRevealInsightProps {
  title: string
  content: string
  index: number
}

export function ScrollRevealInsight({ title, content, index }: ScrollRevealInsightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.1 // Stagger based on index
      }}
      className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{content}</p>
    </motion.div>
  )
}
```

---

## Animation Constants

Create a shared constants file for consistency:

```typescript
// lib/animation-constants.ts
export const SPRING_CONFIGS = {
  // Snappy, responsive
  snappy: { type: "spring", stiffness: 400, damping: 25 },

  // Smooth, elegant
  smooth: { type: "spring", stiffness: 300, damping: 30 },

  // Bouncy, playful
  bouncy: { type: "spring", stiffness: 500, damping: 15 },

  // Slow, dramatic
  dramatic: { type: "spring", stiffness: 100, damping: 20 }
}

export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  },

  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  },

  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.05 }
    }
  }
}

export const GESTURE_CONFIGS = {
  button: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  },

  card: {
    whileHover: {
      y: -4,
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
    },
    whileTap: { scale: 0.98 }
  },

  icon: {
    whileHover: { scale: 1.1, rotate: 5 },
    whileTap: { scale: 0.95 }
  }
}
```

---

## Performance Considerations

### Do's
- Use `transform` and `opacity` for GPU-accelerated animations
- Set `will-change` sparingly and remove after animation
- Use `layout` prop only when needed (can be expensive)
- Prefer `whileInView` with `once: true` for scroll animations
- Use `useReducedMotion` hook for accessibility

### Don'ts
- Avoid animating `width`, `height`, `top`, `left` directly
- Don't animate too many elements simultaneously
- Avoid layout animations on frequently changing lists
- Don't use `layoutId` on elements that change frequently

### Accessibility
```typescript
import { useReducedMotion } from "framer-motion"

function AccessibleAnimation() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ x: 100 }}
      transition={shouldReduceMotion ? { duration: 0 } : { type: "spring" }}
    />
  )
}
```

---

## Next Steps

1. **Create shared animation utilities** (`lib/animation-constants.ts`)
2. **Start with Phase 1** quick wins (choice stagger, hover states)
3. **Test on mobile** for performance
4. **Add accessibility** with `useReducedMotion`
5. **Iterate** based on user feedback

---

*Document created: 2024-12-03*
*Last updated: 2024-12-03*
