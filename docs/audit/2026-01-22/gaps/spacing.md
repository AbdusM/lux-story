# Gap Analysis: Hardcoded Spacing & Dimensions

**Category:** Spacing Token Compliance
**Priority:** MEDIUM
**Estimated Instances:** 8-10
**Last Updated:** January 22, 2026

---

## Executive Summary

The design system has established spacing tokens in `lib/ui-constants.ts` including `SPACING`, `SAFE_AREA`, and layout constants. However, some components contain magic numbers and hardcoded pixel values that should reference these tokens.

---

## Canonical Spacing Sources

### UI Constants (`lib/ui-constants.ts`)

```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const

export const SAFE_AREA = {
  top: 'env(safe-area-inset-top, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
} as const

export const CHOICE_CONTAINER_HEIGHT = 180 // Height for choice cards
```

### Tailwind Config

Standard Tailwind spacing scale is available and documented.

---

## Gap Inventory

### Category 1: Container Padding & Safe Areas

#### StatefulGameInterface.tsx

| Line | Current Value | Should Be | Context |
|------|---------------|-----------|---------|
| ~150 | `max(64px, env(safe-area-inset-bottom))` | `SAFE_AREA.bottom` + `SPACING['3xl']` | Bottom padding |
| ~155 | `64px` (repeated) | `SPACING['3xl']` | Fallback value |
| ~280 | `padding: '16px'` | `SPACING.md` | Inline style |

**Total:** 3 instances

**Note:** The pattern `max(64px, env(...))` is common for mobile safe areas. Consider adding a utility:

```typescript
export const getSafeAreaPadding = (direction: 'top' | 'bottom', minPx: number) =>
  `max(${minPx}px, ${SAFE_AREA[direction]})`
```

---

### Category 2: Chart Dimensions

#### SkillProgressionChart.tsx

| Line | Current Value | Should Be | Context |
|------|---------------|-----------|---------|
| ~88 | `40` | `CHART_DIMENSIONS.skillProgression.rowHeight` | Row height |
| ~89 | `40` | `CHART_DIMENSIONS.skillProgression.padding` | Container padding |
| ~92 | `200` | `CHART_DIMENSIONS.skillProgression.minHeight` | Min height |
| ~93 | `600` | `CHART_DIMENSIONS.skillProgression.maxHeight` | Max height |

**Total:** 4 instances (magic numbers)

#### CareerValuesRadar.tsx

| Line | Current Value | Should Be | Context |
|------|---------------|-----------|---------|
| ~65 | `400` | `CHART_DIMENSIONS.radar.width` | Chart width |
| ~66 | `300` | `CHART_DIMENSIONS.radar.height` | Chart height |
| ~67 | `100` | `CHART_DIMENSIONS.radar.outerRadius` | Radar radius |

**Total:** 3 instances

---

### Category 3: Component-Specific Spacing

#### Various Components

| File | Line | Current | Should Be | Context |
|------|------|---------|-----------|---------|
| Multiple | - | `p-4` | Standard | Tailwind ✅ OK |
| Multiple | - | `gap-4` | Standard | Tailwind ✅ OK |
| Multiple | - | `space-y-4` | Standard | Tailwind ✅ OK |

**Status:** Most spacing uses Tailwind classes correctly.

---

## Summary by Category

| Category | Instances | Priority |
|----------|-----------|----------|
| Safe area magic numbers | 3 | MEDIUM |
| Chart dimensions | 7 | MEDIUM |
| Inline pixel values | 2 | LOW |
| **Total** | **12** | - |

---

## Remediation Strategy

### Phase 1: Add Chart Dimension Constants

Add to `lib/ui-constants.ts`:

```typescript
export const CHART_DIMENSIONS = {
  /** Skill progression horizontal bar chart */
  skillProgression: {
    rowHeight: 40,
    padding: 40,
    minHeight: 200,
    maxHeight: 600,
  },
  /** Career values radar chart */
  radar: {
    width: 400,
    height: 300,
    outerRadius: 100,
    innerRadius: 20,
  },
  /** Generic timeline/line charts */
  timeline: {
    height: 300,
    margin: {
      top: 20,
      right: 30,
      bottom: 20,
      left: 40,
    },
  },
} as const
```

### Phase 2: Add Safe Area Utilities

```typescript
// lib/ui-constants.ts

export const LAYOUT_UTILS = {
  /** Get safe area padding with minimum value */
  safeAreaPadding: (direction: keyof typeof SAFE_AREA, minPx: number) =>
    `max(${minPx}px, ${SAFE_AREA[direction]})`,

  /** Standard bottom safe area (for fixed bottom elements) */
  bottomSafe: `max(${SPACING['3xl']}px, ${SAFE_AREA.bottom})`,

  /** Standard top safe area (for fixed headers) */
  topSafe: `max(${SPACING.lg}px, ${SAFE_AREA.top})`,
} as const
```

### Phase 3: Update Components

```tsx
// Before
style={{ paddingBottom: 'max(64px, env(safe-area-inset-bottom))' }}

// After
import { LAYOUT_UTILS } from '@/lib/ui-constants'
style={{ paddingBottom: LAYOUT_UTILS.bottomSafe }}

// Or inline
import { SPACING, SAFE_AREA } from '@/lib/ui-constants'
style={{ paddingBottom: `max(${SPACING['3xl']}px, ${SAFE_AREA.bottom})` }}
```

---

## Verification Commands

```bash
# Find hardcoded pixel values in styles
grep -rn "px\|[0-9]\+px" components/ --include="*.tsx" | grep -E "(padding|margin|width|height|gap)" | head -50

# Find max() patterns with safe-area
grep -rn "max(.*safe-area" components/ --include="*.tsx"

# Find magic numbers in calculations
grep -rn " \* [0-9]\+\| + [0-9]\+\| - [0-9]\+" components/ --include="*.tsx" | head -20
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking layouts | Visual issues | Test on multiple screen sizes |
| Safe area changes | Mobile UI issues | Test on iOS/Android devices |
| Chart resize issues | Data visualization problems | Verify responsive behavior |

---

## Notes

### Acceptable Hardcoding

Some pixel values are acceptable as hardcoded:
- Border widths (`1px`, `2px`)
- Small adjustments for alignment
- Tailwind class values (already tokenized)

### Tailwind Integration

Most spacing should use Tailwind classes which are already tokenized. The issues here are primarily:
1. Inline styles with pixel values
2. JavaScript calculations with magic numbers
3. Safe area fallback patterns

---

## Dependencies

- None for Phase 1 (adding constants)
- Consider mobile device testing for safe area changes
