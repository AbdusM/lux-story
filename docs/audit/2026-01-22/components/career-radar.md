# Component Audit: CareerValuesRadar.tsx

**File:** `components/CareerValuesRadar.tsx`
**Lines:** 270
**Last Audited:** January 22, 2026

---

## Component Overview

The CareerValuesRadar component renders a radar/spider chart visualizing career values. It uses:
- Recharts library for data visualization
- Pattern-based color coding
- Responsive sizing

---

## Design Token Compliance

### Currently Using (Correct)

| Token Type | Implementation | Source |
|------------|----------------|--------|
| Component structure | React functional component | Standard |
| TypeScript types | Proper typing | Project conventions |

### Hardcoded Values Found (Gaps)

#### 1. Chart Colors (Lines ~80-120)

**Current Implementation:**
```tsx
const chartColors = {
  analytical: '#3B82F6',  // Blue
  exploring: '#8B5CF6',   // Purple
  helping: '#10B981',     // Emerald
  building: '#F97316',    // Orange
  patience: '#EC4899',    // Pink
}
```

**Issue:** These hex values duplicate the pattern colors in `lib/patterns.ts`.

**Recommended Fix:**
```tsx
import { PATTERN_METADATA } from '@/lib/patterns'

const chartColors = {
  analytical: PATTERN_METADATA.analytical.color,
  exploring: PATTERN_METADATA.exploring.color,
  helping: PATTERN_METADATA.helping.color,
  building: PATTERN_METADATA.building.color,
  patience: PATTERN_METADATA.patience.color,
}
```

#### 2. Recharts Theme Colors (Lines ~140-160)

**Current Implementation:**
```tsx
<RadarChart>
  <PolarGrid stroke="#374151" />
  <PolarAngleAxis tick={{ fill: '#9CA3AF' }} />
  <Radar
    stroke="#6366F1"
    fill="#6366F1"
    fillOpacity={0.3}
  />
</RadarChart>
```

**Issue:** Grid and axis colors are hardcoded gray values.

**Recommended Fix:**
```tsx
// Add to ui-constants.ts
export const CHART_THEME = {
  grid: {
    stroke: 'var(--glass-border)',
  },
  axis: {
    tick: { fill: 'var(--color-muted)' },
  },
  defaultFill: 'var(--pattern-exploring)',
} as const

// Or use CSS custom properties
<PolarGrid stroke="var(--chart-grid-color)" />
```

#### 3. Opacity Values (Lines ~155)

**Current Implementation:**
```tsx
fillOpacity={0.3}
```

**Issue:** Should use `GLASS_OPACITY` constants from `lib/ui-constants.ts`.

**Recommended Fix:**
```tsx
import { GLASS_OPACITY } from '@/lib/ui-constants'

fillOpacity={GLASS_OPACITY.subtle} // 0.1-0.15
// Or use a new CHART_OPACITY constant
```

---

## Dimension Analysis

### Chart Sizing

**Current Implementation:**
```tsx
const chartConfig = {
  width: 400,
  height: 300,
  outerRadius: 100,
}
```

**Issue:** These dimensions could be extracted to constants.

**Recommended Fix:**
```tsx
// Add to ui-constants.ts
export const CHART_DIMENSIONS = {
  radar: {
    width: 400,
    height: 300,
    outerRadius: 100,
  },
  // ... other chart types
} as const
```

---

## Animation Analysis

### Current Animation State

No Framer Motion animations - relies on Recharts built-in animations.

**Assessment:** Acceptable. Recharts has its own animation system that's consistent.

---

## Accessibility Review

| Feature | Implementation | Status |
|---------|----------------|--------|
| Color contrast | Pattern colors pass WCAG AA | ✅ Verified |
| Screen reader | `aria-label` on container | ⚠️ Should verify |
| Data table alt | None | ❌ Consider adding |

**Recommendation:** Add a visually-hidden data table for screen readers.

---

## Remediation Priority: HIGH

### Required Changes

1. **Replace hardcoded chart colors** with `PATTERN_METADATA` references
   - Import from `lib/patterns.ts`
   - Map pattern names to colors

2. **Extract chart theme colors** to design system
   - Add `CHART_THEME` constant to `lib/ui-constants.ts`
   - Or create CSS custom properties

3. **Use opacity constants** from `GLASS_OPACITY`

4. **Consider chart dimensions** extraction (MEDIUM priority)

---

## Gap Count Summary

| Category | Count |
|----------|-------|
| Hardcoded colors | 7 (5 pattern + 2 theme) |
| Hardcoded dimensions | 3 (width, height, radius) |
| Hardcoded opacity | 1 |
| **Total gaps** | **11** |

---

## Color Mapping Reference

| Pattern | PATTERN_METADATA | Current Hardcoded |
|---------|------------------|-------------------|
| analytical | `#3B82F6` | `#3B82F6` ✓ Match |
| exploring | `#8B5CF6` | `#8B5CF6` ✓ Match |
| helping | `#22C55E` | `#10B981` ✗ Different! |
| building | `#F97316` | `#F97316` ✓ Match |
| patience | `#EC4899` | `#EC4899` ✓ Match |

**Note:** The "helping" color differs between sources:
- `PATTERN_METADATA.helping.color`: `#22C55E` (green-500)
- CareerValuesRadar: `#10B981` (emerald-500)

This is a design inconsistency that should be resolved.

---

## Related Design Token Files

- `lib/patterns.ts:15-52` - Canonical pattern colors
- `lib/ui-constants.ts` - Should add `CHART_DIMENSIONS`, `CHART_THEME`
