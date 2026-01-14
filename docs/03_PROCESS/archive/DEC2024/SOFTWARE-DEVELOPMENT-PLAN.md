# LuxStory Software Development Plan
## UI Stability & Polish Sprint

**Created:** December 17, 2025
**Goal:** Eliminate layout shifts, add skeleton loading, standardize containers
**Priority:** Production-ready UI stability

---

## Executive Summary

UI audit identified **20 issues** across 6 categories affecting layout stability and polish.

| Category | Issues | Severity | Sprint |
|----------|--------|----------|--------|
| Layout Shifts | 3 | Critical | 1 |
| Missing Skeletons | 3 | Critical | 1 |
| Hardcoded Dimensions | 3 | High | 2 |
| Inconsistent Patterns | 3 | High | 2 |
| Animation Gaps | 5 | High | 2 |
| Additional Stability | 3 | Medium | 3 |

**Target Outcome:** Zero layout shift during data loading/switching, consistent container sizing, smooth transitions.

---

## Sprint 1: Critical Stability (Priority P0)

### 1.1 Skeleton Loading Components

**Problem:** Dashboard sections flash content when data loads - no placeholder reserves space.

**Files to Create:**

#### `components/ui/skeleton.tsx` (NEW)
```tsx
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-slate-200 animate-pulse rounded",
        variant === 'circular' && "rounded-full",
        variant === 'text' && "h-4 rounded",
        className
      )}
    />
  );
}

export function SkeletonCard({ height = 80 }: { height?: number }) {
  return (
    <div
      className="bg-slate-100 rounded-lg animate-pulse"
      style={{ height, minHeight: height }}
    />
  );
}
```

#### `components/admin/skeletons/DashboardSkeleton.tsx` (NEW)
```tsx
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12" variant="circular" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <SkeletonCard key={i} height={100} />
        ))}
      </div>

      {/* Navigation skeleton */}
      <div className="flex gap-2">
        {[1,2,3,4,5,6,7].map(i => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Content skeleton */}
      <SkeletonCard height={400} />
    </div>
  );
}
```

#### `components/admin/skeletons/SkillItemSkeleton.tsx` (NEW)
```tsx
export function SkillItemSkeleton() {
  return (
    <div className="h-16 bg-slate-100 rounded-lg animate-pulse flex items-center gap-3 p-4">
      <Skeleton className="h-10 w-10" variant="circular" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SkillsSectionSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkillItemSkeleton key={i} />
      ))}
    </div>
  );
}
```

**Files to Modify:**

| File | Line | Change |
|------|------|--------|
| `SharedDashboardLayout.tsx` | 103-111 | Replace spinner with `<DashboardSkeleton />` |
| `SkillsSection.tsx` | 147-169 | Add `<SkillsSectionSkeleton />` during load |
| `EvidenceTimeline.tsx` | 35-69 | Add loading prop + skeleton state |

### 1.2 Fix Layout Shifts

#### Issue: SkillProgressionChart height calculation
**File:** `components/admin/SkillProgressionChart.tsx`
**Lines:** 103-104, 201, 221

**Current:**
```tsx
const chartHeight = 120;
style={{ height: `${chartHeight + 40}px` }}
```

**Fix:**
```tsx
// Add to lib/constants.ts
export const CHART_CONFIG = {
  height: {
    mobile: 100,
    tablet: 140,
    desktop: 180,
  },
  axisWidth: 32,
  padding: 16,
  pointRadius: 4,
};

// In component
const chartHeight = useResponsiveValue(CHART_CONFIG.height);
```

#### Issue: DetailModal scrollbar shift
**File:** `components/constellation/DetailModal.tsx`
**Lines:** 76-77, 89

**Fix:** Add scrollbar gutter reserve
```tsx
<div
  className="overflow-y-auto scrollbar-gutter-stable"
  style={{
    maxHeight: 'calc(50vh - 40px)',
    paddingRight: 'var(--scrollbar-width, 15px)'
  }}
>
```

#### Issue: Progress bar scaleX artifacts
**File:** `components/constellation/PeopleView.tsx`
**Lines:** 308-316

**Fix:** Use width instead of scaleX
```tsx
<motion.div
  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${(selectedCharacter.trust / 10) * 100}%` }}
  transition={springs.smooth}
/>
```

### 1.3 Standardize Loading State Heights

**Problem:** Loading/error/empty states have different heights than content.

**Files to Modify:**

| File | Line | Current | Fix |
|------|------|---------|-----|
| `UrgencySection.tsx` | 130-143 | `py-12` | Add `min-h-96` to CardContent |
| `SkillsSection.tsx` | 147 | No min-height | Add `min-h-[400px]` |
| `EvidenceSection.tsx` | - | No min-height | Add `min-h-[300px]` |

**Pattern to Apply:**
```tsx
<CardContent className="min-h-[400px]">
  {loading ? <Skeleton /> : <Content />}
</CardContent>
```

### 1.4 Acceptance Criteria - Sprint 1

- [ ] Skeleton components created and exported
- [ ] Dashboard shows skeleton during initial load
- [ ] No visible layout shift when data loads
- [ ] Chart dimensions responsive to viewport
- [ ] Modal scrollbar doesn't cause content shift
- [ ] All loading states reserve correct height

---

## Sprint 2: Consistency & Animation (Priority P1)

### 2.1 Create Constants Library

**File to Create:** `lib/ui-constants.ts`

```tsx
// Container max-widths
export const CONTAINERS = {
  sm: 'max-w-sm',     // 384px
  md: 'max-w-md',     // 448px
  lg: 'max-w-lg',     // 512px
  xl: 'max-w-xl',     // 576px
  '2xl': 'max-w-2xl', // 672px
} as const;

// Button heights (touch targets)
export const BUTTON_HEIGHT = {
  sm: 'min-h-[36px]',
  md: 'min-h-[44px]',  // Apple HIG minimum
  lg: 'min-h-[52px]',
} as const;

// Spacing scale
export const SPACING = {
  mobile: { padding: 'p-4', gap: 'space-y-4' },
  tablet: { padding: 'p-6', gap: 'space-y-6' },
} as const;

// Safe area
export const SAFE_AREA_BOTTOM = "max(16px, env(safe-area-inset-bottom))";

// Animation springs (from existing springs.ts)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
  message: 400,
} as const;
```

### 2.2 Standardize Button Heights

**Files to Modify:**

| File | Line | Current | Fix |
|------|------|---------|-----|
| `game-choice.tsx` | 41-71 | No min-height | Add `min-h-[44px]` |
| `SharedDashboardLayout.tsx` | 262 | No min-height | Add `BUTTON_HEIGHT.md` |
| `ConstellationPanel.tsx` | 162 | Varies | Add `BUTTON_HEIGHT.md` |

### 2.3 Replace Tailwind Animations with Framer Motion

**Problem:** Tailwind `animate-in` can't be cancelled, no reduced-motion hook integration.

#### Fix GameChoice
**File:** `components/game/game-choice.tsx`
**Lines:** 49, 69, 74-75

**Current:**
```tsx
animated && "animate-in fade-in slide-in-from-bottom-2",
style={{ animationDelay: `${index * 50}ms` }}
```

**Fix:**
```tsx
import { motion } from 'framer-motion';
import { springs } from '@/lib/springs';

<motion.button
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    delay: index * 0.05,
    ...springs.gentle
  }}
  className={cn(choiceVariants({ intent, state }))}
>
```

#### Fix GameMessage
**File:** `components/game/game-message.tsx`
**Lines:** 127-134

**Current:** `duration-700` (inconsistent with other components)

**Fix:** Use `springs.smooth` (300ms) for consistency

### 2.4 Coordinate Animation Durations

**Problem:** ResizablePanel has mismatched container/content animations.

**File:** `components/ResizablePanel.tsx`
**Lines:** 121-161

**Current:**
- Container: 300ms (springs.smooth)
- Content: 200ms (springs.gentle)

**Fix:** Synchronize to 300ms
```tsx
const TRANSITION_DURATION = 0.3;

// Container
transition={{ ...springs.smooth, duration: TRANSITION_DURATION }}

// Content
transition={{ ...springs.smooth, duration: TRANSITION_DURATION }}
```

### 2.5 Add Expand/Collapse Animation

**File:** `components/admin/sections/SkillsSection.tsx`
**Lines:** 185-189

**Current:** Instant expand/collapse

**Fix:**
```tsx
import { AnimatePresence, motion } from 'framer-motion';

<div className="border rounded-lg">
  <button onClick={toggleExpand}>...</button>
  <AnimatePresence>
    {isExpanded && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={springs.smooth}
      >
        {/* Expanded content */}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

### 2.6 Acceptance Criteria - Sprint 2

- [ ] UI constants library created and documented
- [ ] All buttons have 44px minimum touch target
- [ ] GameChoice uses Framer Motion
- [ ] GameMessage animation matches system (300ms)
- [ ] ResizablePanel animations synchronized
- [ ] SkillsSection has smooth expand/collapse
- [ ] Safe area padding consistent across app

---

## Sprint 3: Polish & Performance (Priority P2)

### 3.1 Fix Safe Area Consistency

**Problem:** Different fallback values across components.

**Files to Modify:**

| File | Current | Fix |
|------|---------|-----|
| `ConstellationPanel.tsx:115` | `env(..., 0px)` | `SAFE_AREA_BOTTOM` |
| `PeopleView.tsx:281` | `max(16px, env(...))` | `SAFE_AREA_BOTTOM` |
| `SkillsView.tsx:335` | `max(12px, env(...))` | `SAFE_AREA_BOTTOM` |

### 3.2 Fix SVG Responsiveness

**File:** `components/constellation/PeopleView.tsx`
**Lines:** 61-69

**Current:**
```tsx
<motion.svg
  viewBox="0 0 100 100"
  className="w-full h-full max-h-[400px]"
>
```

**Fix:**
```tsx
<div className="aspect-square w-full max-w-[400px] mx-auto">
  <motion.svg viewBox="0 0 100 100" className="w-full h-full">
```

### 3.3 Add contain: layout for Scroll Performance

**Files to Modify:**
- `PeopleView.tsx:174`
- `SkillsView.tsx:174`

**Fix:**
```tsx
<div
  className="flex-1 overflow-y-auto"
  style={{
    contain: 'layout',
    paddingBottom: SAFE_AREA_BOTTOM
  }}
>
```

### 3.4 Hardcoded Shadow Colors

**File:** `components/game/game-message.tsx`
**Lines:** 156, 169

**Current:**
```tsx
boxShadow: `0 2px 0 0 #92400e, ...`
```

**Fix:** Add to CSS variables
```css
:root {
  --shadow-amber-dark: #92400e;
  --shadow-amber-glow: rgba(146, 64, 14, 0.3);
}
```

### 3.5 Responsive Avatar Sizing

**File:** `components/game/game-message.tsx`
**Line:** 156

**Current:** `w-16 h-16` (64px fixed)

**Fix:** `w-12 h-12 sm:w-16 sm:h-16` (48px mobile, 64px tablet+)

### 3.6 Acceptance Criteria - Sprint 3

- [ ] Safe area padding uses single constant
- [ ] SVG containers have aspect-ratio lock
- [ ] Scroll containers use `contain: layout`
- [ ] Shadow colors in CSS variables
- [ ] Avatar responsive on small screens
- [ ] Performance audit passes (no layout thrashing)

---

## File Change Summary

### New Files to Create

| File | Sprint | Purpose |
|------|--------|---------|
| `components/ui/skeleton.tsx` | 1 | Base skeleton component |
| `components/admin/skeletons/DashboardSkeleton.tsx` | 1 | Full dashboard placeholder |
| `components/admin/skeletons/SkillItemSkeleton.tsx` | 1 | Skills list placeholder |
| `lib/ui-constants.ts` | 2 | Centralized UI constants |

### Files to Modify

| File | Sprint | Changes |
|------|--------|---------|
| `SharedDashboardLayout.tsx` | 1 | Add skeleton, button heights |
| `SkillsSection.tsx` | 1, 2 | Add skeleton, expand animation |
| `EvidenceTimeline.tsx` | 1 | Add loading state |
| `SkillProgressionChart.tsx` | 1 | Responsive dimensions |
| `DetailModal.tsx` | 1 | Scrollbar gutter |
| `PeopleView.tsx` | 1, 3 | Progress bar, SVG aspect |
| `game-choice.tsx` | 2 | Framer Motion migration |
| `game-message.tsx` | 2, 3 | Animation timing, avatar size |
| `ResizablePanel.tsx` | 2 | Sync durations |
| `ConstellationPanel.tsx` | 2, 3 | Button heights, safe area |
| `SkillsView.tsx` | 3 | Safe area, contain |

---

## Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Layout shifts during load | 5+ visible | 0 |
| Skeleton coverage | 0% | 100% of data sections |
| Button touch target compliance | ~60% | 100% (44px min) |
| Animation consistency | 3+ different durations | 2 (fast/normal) |
| Safe area consistency | 3 different values | 1 constant |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Framer Motion bundle size | Tree-shake unused features |
| Skeleton flash on fast connections | Add 200ms delay before showing |
| Breaking existing animations | Test with reduced-motion preference |
| Mobile performance | Profile with Chrome DevTools |

---

## Testing Checklist

### Sprint 1 Verification
- [ ] Load dashboard on slow 3G - skeleton visible
- [ ] Switch between skills - no jump
- [ ] Open/close modal - no scrollbar shift
- [ ] Resize window - chart scales smoothly

### Sprint 2 Verification
- [ ] All buttons 44px+ on mobile
- [ ] Expand skill item - smooth animation
- [ ] Game choices appear with stagger
- [ ] Reduced motion preference respected

### Sprint 3 Verification
- [ ] Test on iPhone with notch
- [ ] Test on Android with navigation bar
- [ ] Lighthouse performance score 90+
- [ ] No forced reflows in DevTools

---

## Implementation Order

```
Sprint 1 (Critical)
├── Day 1: Create skeleton components
├── Day 2: Integrate skeletons into dashboard
├── Day 3: Fix layout shift issues
└── Day 4: Test and refine

Sprint 2 (Consistency)
├── Day 1: Create constants library
├── Day 2: Standardize button heights
├── Day 3: Migrate animations to Framer Motion
└── Day 4: Sync animation durations

Sprint 3 (Polish)
├── Day 1: Safe area + SVG fixes
├── Day 2: Shadow variables + avatar sizing
├── Day 3: Performance optimization
└── Day 4: Final testing across devices
```

---

**Document Owner:** Development Team
**Review Status:** Ready for implementation
