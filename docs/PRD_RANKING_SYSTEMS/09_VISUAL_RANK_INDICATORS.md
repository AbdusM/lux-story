# Phase 9: Visual Rank Indicators

**PRD ID:** RANK-009
**Priority:** P3 (Polish)
**Commits:** 4-6
**Dependencies:** Phase 1, Phase 2, Phase 3, Phase 5
**Inspired By:** Kill la Kill (Life Fiber glow, uniform star system, visual power indicators)

---

## INTEGRATION NOTE

**This PRD extends existing visual systems.**

**Existing visual tokens to reference:**
- `lib/ui-constants.ts` - Design tokens for spacing, colors
- `lib/animations.ts` - `springs`, `STAGGER_DELAY` for animations
- `app/globals.css` - CSS variables: `--shadow-amber-dark`, `--shadow-amber-glow`
- `lib/orbs.ts` - `ORB_TIERS[tier].colorClass`: Existing tier colors

**Existing Color Mapping (from orbs.ts):**
| OrbTier | Existing Color | PRD Level |
|---------|---------------|-----------|
| nascent | `slate-400` | Level 0 |
| emerging | `blue-400` | Level 1 |
| developing | `indigo-400` | Level 2 |
| flourishing | `purple-400` | Level 3 |
| mastered | `amber-400` | Level 4 |

**Animation Integration:**
```typescript
// Use existing animation constants
import { springs, STAGGER_DELAY } from '@/lib/animations'

// Rank transitions should use existing springs
transition={{ ...springs.smooth }}
```

**Accessibility:** Existing `useReducedMotion()` from Framer Motion.

---

## Target Outcome

Create a cohesive visual language for displaying rank across all systems. Like Kill la Kill's glowing Life Fibers and uniform stars, visual indicators should communicate status at a glance while reinforcing the station aesthetic.

**Success Criteria:**
- [ ] Unified glow/shimmer system for rank display
- [ ] Star/badge variants across all rank categories
- [ ] Consistent color tokens mapped to ranks
- [ ] Animation library for rank transitions
- [ ] Accessibility: rank info also conveyed non-visually

---

## Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Animation duration | ≤300ms | Fast, not distracting |
| Color palette | 5 primary + 1 gold | Match station aesthetic |
| Glow intensity | 3 levels | Subtle → Medium → Intense |
| Performance | 60fps | No janky animations |

---

## System Design

### 1. Visual Token System

```typescript
// lib/ranking/visual-tokens.ts

/**
 * Visual tokens for rank display - Kill la Kill inspired
 * Unified system across all rank categories
 */

export type RankGlowIntensity = 'subtle' | 'medium' | 'intense'

export const RANK_COLORS = {
  // Base progression colors
  slate: { base: '#94a3b8', glow: 'rgba(148, 163, 184, 0.3)' },
  blue: { base: '#60a5fa', glow: 'rgba(96, 165, 250, 0.4)' },
  indigo: { base: '#818cf8', glow: 'rgba(129, 140, 248, 0.4)' },
  purple: { base: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)' },
  amber: { base: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)' },

  // Special colors
  gold: { base: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' },  // Elite/Champion
  emerald: { base: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },  // Success
  rose: { base: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)' }  // Warning
} as const

export type RankColorKey = keyof typeof RANK_COLORS

/**
 * Map rank levels to colors
 */
export const LEVEL_TO_COLOR: Record<number, RankColorKey> = {
  0: 'slate',
  1: 'blue',
  2: 'indigo',
  3: 'purple',
  4: 'amber',
  5: 'gold'  // Champion/Elite
}

/**
 * Glow CSS generator
 */
export function getRankGlow(
  color: RankColorKey,
  intensity: RankGlowIntensity
): string {
  const glowColor = RANK_COLORS[color].glow
  const sizes = {
    subtle: '0 0 8px',
    medium: '0 0 16px',
    intense: '0 0 24px, 0 0 48px'
  }
  return `${sizes[intensity]} ${glowColor}`
}

/**
 * Shimmer animation keyframes
 */
export const RANK_SHIMMER_KEYFRAMES = {
  subtle: {
    '0%, 100%': { opacity: 0.8 },
    '50%': { opacity: 1 }
  },
  pulse: {
    '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
    '50%': { transform: 'scale(1.05)', opacity: 1 }
  },
  breathe: {
    '0%, 100%': { boxShadow: '0 0 8px currentColor' },
    '50%': { boxShadow: '0 0 16px currentColor, 0 0 32px currentColor' }
  }
}
```

### 2. Rank Badge Component Library

```typescript
// components/ranking/visual/RankBadge.tsx

export type BadgeVariant =
  | 'pip'        // Small dot indicator
  | 'star'       // Star shape
  | 'chevron'    // Military-style
  | 'orb'        // Circular glow
  | 'sigil'      // Custom station symbol

interface RankBadgeProps {
  level: number
  maxLevel: number
  variant?: BadgeVariant
  color?: RankColorKey
  size?: 'xs' | 'sm' | 'md' | 'lg'
  animated?: boolean
  showLabel?: boolean
  label?: string
}

export function RankBadge({
  level,
  maxLevel,
  variant = 'pip',
  color,
  size = 'md',
  animated = true,
  showLabel = false,
  label
}: RankBadgeProps) {
  const derivedColor = color ?? LEVEL_TO_COLOR[level] ?? 'slate'
  const colorValues = RANK_COLORS[derivedColor]

  const sizeValues = {
    xs: { badge: 'w-2 h-2', container: 'gap-0.5' },
    sm: { badge: 'w-3 h-3', container: 'gap-1' },
    md: { badge: 'w-4 h-4', container: 'gap-1.5' },
    lg: { badge: 'w-5 h-5', container: 'gap-2' }
  }

  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = animated && !prefersReducedMotion

  return (
    <div className={cn("flex items-center", sizeValues[size].container)}>
      {/* Badge visualization based on variant */}
      {variant === 'pip' && (
        <PipBadge
          level={level}
          maxLevel={maxLevel}
          color={colorValues}
          size={sizeValues[size].badge}
          animated={shouldAnimate}
        />
      )}

      {variant === 'star' && (
        <StarBadge
          level={level}
          maxLevel={maxLevel}
          color={colorValues}
          size={sizeValues[size].badge}
          animated={shouldAnimate}
        />
      )}

      {variant === 'orb' && (
        <OrbBadge
          level={level}
          color={colorValues}
          size={sizeValues[size].badge}
          animated={shouldAnimate}
        />
      )}

      {/* Accessible label */}
      {showLabel && label && (
        <span
          className="text-xs font-medium"
          style={{ color: colorValues.base }}
        >
          {label}
        </span>
      )}

      {/* Screen reader text */}
      <span className="sr-only">
        Level {level} of {maxLevel}
        {label ? `: ${label}` : ''}
      </span>
    </div>
  )
}

function PipBadge({
  level,
  maxLevel,
  color,
  size,
  animated
}: {
  level: number
  maxLevel: number
  color: { base: string; glow: string }
  size: string
  animated: boolean
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxLevel }).map((_, i) => {
        const isFilled = i < level
        return (
          <motion.div
            key={i}
            className={cn("rounded-full", size)}
            style={{
              backgroundColor: isFilled ? color.base : 'rgba(100, 116, 139, 0.3)',
              boxShadow: isFilled && animated ? getRankGlow('slate', 'subtle') : 'none'
            }}
            initial={false}
            animate={
              isFilled && animated
                ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        )
      })}
    </div>
  )
}

function StarBadge({
  level,
  maxLevel,
  color,
  size,
  animated
}: {
  level: number
  maxLevel: number
  color: { base: string; glow: string }
  size: string
  animated: boolean
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxLevel }).map((_, i) => {
        const isFilled = i < level
        return (
          <motion.div
            key={i}
            className={cn("relative", size)}
            animate={
              isFilled && animated
                ? { rotate: [0, 5, -5, 0] }
                : {}
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3
            }}
          >
            <Star
              className="w-full h-full"
              fill={isFilled ? color.base : 'none'}
              stroke={isFilled ? color.base : 'rgba(100, 116, 139, 0.5)'}
              strokeWidth={isFilled ? 0 : 1.5}
              style={{
                filter: isFilled ? `drop-shadow(${getRankGlow('amber', 'subtle')})` : 'none'
              }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

function OrbBadge({
  level,
  color,
  size,
  animated
}: {
  level: number
  color: { base: string; glow: string }
  size: string
  animated: boolean
}) {
  const intensity: RankGlowIntensity = level >= 4 ? 'intense' : level >= 2 ? 'medium' : 'subtle'

  return (
    <motion.div
      className={cn("rounded-full", size)}
      style={{
        backgroundColor: color.base,
        boxShadow: getRankGlow(LEVEL_TO_COLOR[level], intensity)
      }}
      animate={
        animated
          ? {
              boxShadow: [
                getRankGlow(LEVEL_TO_COLOR[level], 'subtle'),
                getRankGlow(LEVEL_TO_COLOR[level], intensity),
                getRankGlow(LEVEL_TO_COLOR[level], 'subtle')
              ]
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}
```

### 3. Rank Transition Animations

```typescript
// lib/ranking/visual-animations.ts

import { Variants, Transition } from 'framer-motion'

/**
 * Animation variants for rank changes
 */
export const RANK_TRANSITION_VARIANTS: Record<string, Variants> = {
  // Level up celebration
  levelUp: {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 1, 1],
      filter: [
        'brightness(1)',
        'brightness(1.5)',
        'brightness(1)'
      ]
    }
  },

  // New rank unlocked
  unlock: {
    initial: { scale: 0, opacity: 0, rotate: -180 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0
    }
  },

  // Shimmer effect for elite/champion
  eliteShimmer: {
    initial: { backgroundPosition: '200% 0' },
    animate: {
      backgroundPosition: ['-200% 0', '200% 0']
    }
  },

  // Pulse for active rank
  activePulse: {
    initial: { boxShadow: '0 0 0 0 currentColor' },
    animate: {
      boxShadow: [
        '0 0 0 0 currentColor',
        '0 0 0 8px transparent',
        '0 0 0 0 currentColor'
      ]
    }
  }
}

export const RANK_TRANSITIONS: Record<string, Transition> = {
  levelUp: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1]
  },
  unlock: {
    type: 'spring',
    stiffness: 200,
    damping: 15
  },
  shimmer: {
    duration: 3,
    repeat: Infinity,
    ease: 'linear'
  },
  pulse: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}
```

### 4. Rank Display Card

```typescript
// components/ranking/visual/RankDisplayCard.tsx

interface RankDisplayCardProps {
  category: RankCategory
  currentLevel: number
  maxLevel: number
  name: string
  description: string
  progress: number  // 0-100
  isNew?: boolean  // Just leveled up
}

export function RankDisplayCard({
  category,
  currentLevel,
  maxLevel,
  name,
  description,
  progress,
  isNew = false
}: RankDisplayCardProps) {
  const color = LEVEL_TO_COLOR[currentLevel]
  const colorValues = RANK_COLORS[color]
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="relative p-4 rounded-lg overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))`,
        border: `1px solid ${colorValues.glow}`
      }}
      variants={isNew ? RANK_TRANSITION_VARIANTS.levelUp : undefined}
      initial={isNew ? 'initial' : false}
      animate={isNew ? 'animate' : undefined}
      transition={RANK_TRANSITIONS.levelUp}
    >
      {/* Glow effect for high ranks */}
      {currentLevel >= 3 && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colorValues.glow}, transparent 70%)`
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="relative z-10">
        {/* Header with badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RankBadge
              level={currentLevel}
              maxLevel={maxLevel}
              variant="orb"
              animated={!prefersReducedMotion}
            />
            <div>
              <h3 className="font-medium text-white">{name}</h3>
              <p className="text-xs text-slate-400">{getCategoryLabel(category)}</p>
            </div>
          </div>

          {/* Star indicator */}
          <RankBadge
            level={currentLevel}
            maxLevel={maxLevel}
            variant="star"
            size="sm"
            animated={!prefersReducedMotion}
          />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-3">{description}</p>

        {/* Progress bar */}
        {currentLevel < maxLevel && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Progress to next</span>
              <span className="text-slate-300">{progress}%</span>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: colorValues.base }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Max level indicator */}
        {currentLevel === maxLevel && (
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: colorValues.base }}>✦</span>
            <span className="text-slate-300">Maximum rank achieved</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function getCategoryLabel(category: RankCategory): string {
  const labels: Record<RankCategory, string> = {
    pattern_mastery: 'Pattern Mastery',
    career_expertise: 'Career Expertise',
    challenge_rating: 'Challenge Rating',
    station_standing: 'Station Standing',
    skill_stars: 'Skill Stars',
    elite_status: 'Elite Status'
  }
  return labels[category]
}
```

---

## Accessibility

### 5. Non-Visual Rank Communication

```typescript
// lib/ranking/accessibility.ts

/**
 * Generate accessible descriptions for rank states
 */
export function getRankAccessibleLabel(
  category: RankCategory,
  level: number,
  maxLevel: number,
  tierName: string
): string {
  const categoryName = getCategoryLabel(category)
  const progress = Math.round((level / maxLevel) * 100)

  return `${categoryName}: ${tierName}, level ${level} of ${maxLevel}, ${progress}% complete`
}

/**
 * Announce rank changes to screen readers
 */
export function announceRankChange(
  previousLevel: number,
  newLevel: number,
  tierName: string
): void {
  if (newLevel > previousLevel) {
    const message = `Congratulations! You've reached ${tierName}, level ${newLevel}`
    announceToScreenReader(message, 'polite')
  }
}

function announceToScreenReader(message: string, priority: 'polite' | 'assertive'): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)
  setTimeout(() => announcement.remove(), 1000)
}
```

---

## Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| Pattern Mastery | Visual badge display | Output |
| Career Expertise | Visual progress card | Output |
| Station Standing | Billboard visual | Output |
| Skill Stars | Constellation display | Output |
| Elite Status | Special glow effects | Output |
| Journal UI | All rank visuals | Output |

---

## Plan of Attack

| Step | Task | Acceptance | Files |
|------|------|------------|-------|
| 9.1 | Define visual tokens | Colors, glows, shimmer | `lib/ranking/visual-tokens.ts` |
| 9.2 | Create badge library | 5 variants | `components/ranking/visual/RankBadge.tsx` |
| 9.3 | Add transition animations | Level up, unlock effects | `lib/ranking/visual-animations.ts` |
| 9.4 | Build display card | Unified rank card | `components/ranking/visual/RankDisplayCard.tsx` |
| 9.5 | Add accessibility layer | Screen reader support | `lib/ranking/accessibility.ts` |
| 9.6 | Apply across systems | Update all rank UIs | Various components |

---

## Tests & Verification

```typescript
describe('Visual Rank Indicators', () => {
  describe('Color Mapping', () => {
    it('maps levels to correct colors', () => {
      expect(LEVEL_TO_COLOR[0]).toBe('slate')
      expect(LEVEL_TO_COLOR[4]).toBe('amber')
      expect(LEVEL_TO_COLOR[5]).toBe('gold')
    })
  })

  describe('Glow Generation', () => {
    it('generates correct glow CSS', () => {
      const glow = getRankGlow('amber', 'medium')
      expect(glow).toContain('16px')
      expect(glow).toContain('rgba(251, 191, 36')
    })
  })

  describe('Accessibility', () => {
    it('generates correct accessible label', () => {
      const label = getRankAccessibleLabel('pattern_mastery', 2, 4, 'Regular')
      expect(label).toContain('Pattern Mastery')
      expect(label).toContain('level 2 of 4')
      expect(label).toContain('50%')
    })
  })

  describe('Reduced Motion', () => {
    it('respects prefers-reduced-motion', () => {
      // Mock useReducedMotion to return true
      render(<RankBadge level={3} maxLevel={5} animated />)
      // Verify no animation classes applied
    })
  })
})
```

---

## Performance Budget

| Operation | Budget |
|-----------|--------|
| Badge render | <5ms |
| Animation frame | >60fps |
| Glow calculation | <1ms |
| Transition | <300ms total |

---

## Kill la Kill Design Principles Applied

| Kill la Kill Principle | Lux Story Application |
|------------------------|----------------------|
| Life Fiber glow | Rank-based glow intensity |
| Uniform star system | Star badge variant |
| Visual power scaling | Higher ranks = more glow |
| Color-coded hierarchy | Consistent color progression |
| Dramatic transformations | Level-up animations |
| Reduced motion respect | Accessibility compliance |
