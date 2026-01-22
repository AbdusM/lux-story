# Component Audit: Chart Components

**Primary File:** `components/admin/SkillProgressionChart.tsx`
**Lines:** 410
**Last Audited:** January 22, 2026

---

## Component Overview

The SkillProgressionChart component renders skill progression data visualization using Recharts. Additional chart components may exist in the admin section.

---

## Design Token Compliance

### Currently Using (Correct)

| Token Type | Implementation | Source |
|------------|----------------|--------|
| Layout | Responsive container | Tailwind |
| Container styling | Glass morphism classes | `grand-central.css` |

### Hardcoded Values Found (Gaps)

#### 1. Chart Height Calculation (Lines ~85-95)

**Current Implementation:**
```tsx
const chartHeight = data.length * 40
const containerHeight = chartHeight + 40 // Magic number padding
```

**Issue:** Magic number `40` used for both row height and padding.

**Recommended Fix:**
```tsx
// Add to ui-constants.ts
export const CHART_DIMENSIONS = {
  skillProgression: {
    rowHeight: 40,
    padding: 40,
    minHeight: 200,
    maxHeight: 600,
  },
  // ... other chart configs
} as const

// Usage
import { CHART_DIMENSIONS } from '@/lib/ui-constants'
const { rowHeight, padding } = CHART_DIMENSIONS.skillProgression
const chartHeight = data.length * rowHeight
const containerHeight = chartHeight + padding
```

#### 2. Chart Colors (Lines ~120-150)

**Current Implementation:**
```tsx
const colors = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  tertiary: '#EC4899',
  background: '#1F2937',
  grid: '#374151',
  text: '#9CA3AF',
}
```

**Issue:** Colors should reference CSS custom properties or design tokens.

**Recommended Fix:**
```tsx
// Using CSS custom properties
const colors = {
  primary: 'var(--pattern-exploring)',
  secondary: 'var(--pattern-patience)',
  background: 'var(--glass-bg)',
  grid: 'var(--glass-border)',
  text: 'var(--color-muted)',
}
```

#### 3. Stroke Widths (Lines ~180)

**Current Implementation:**
```tsx
<Line strokeWidth={2} />
<Bar strokeWidth={1} />
```

**Status:** Acceptable - standard values for data visualization.

#### 4. Tooltip Styling (Lines ~200-220)

**Current Implementation:**
```tsx
<Tooltip
  contentStyle={{
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  }}
/>
```

**Issue:** Inline styles should use glass morphism tokens.

**Recommended Fix:**
```tsx
// Reference existing glass tokens
contentStyle={{
  backgroundColor: 'var(--glass-bg)',
  border: `1px solid var(--glass-border)`,
  borderRadius: 'var(--radius-md)',
}}

// Or use glass classes and apply via className
```

---

## Animation Analysis

### Recharts Animations

**Current Implementation:**
```tsx
<LineChart>
  <Line animationDuration={300} animationEasing="ease-out" />
</LineChart>
```

**Issue:** Animation duration `300` doesn't match `ANIMATION_DURATION` values.

**Comparison:**
| Recharts | Design System |
|----------|---------------|
| 300ms | `normal`: 250ms |
| - | `slow`: 400ms |

**Recommended Fix:**
```tsx
import { ANIMATION_DURATION } from '@/lib/ui-constants'

// Use slow for charts (more data to process visually)
animationDuration={ANIMATION_DURATION.slow * 1000} // Convert to ms
```

---

## Responsive Behavior

### Current State

**Implementation:**
```tsx
<ResponsiveContainer width="100%" height={containerHeight}>
```

**Status:** ✅ Correctly uses ResponsiveContainer for width.

**Gap:** Height is calculated but doesn't have min/max constraints.

**Recommended Fix:**
```tsx
const clampedHeight = Math.max(
  CHART_DIMENSIONS.skillProgression.minHeight,
  Math.min(containerHeight, CHART_DIMENSIONS.skillProgression.maxHeight)
)
```

---

## Accessibility Review

| Feature | Implementation | Status |
|---------|----------------|--------|
| Color contrast | WCAG AA compliant | ⚠️ Verify in dark mode |
| Alt text | None on SVG | ❌ Add `aria-label` |
| Data table | Not provided | ❌ Add for screen readers |

**Recommendations:**
1. Add `aria-label` describing the chart
2. Consider adding visually-hidden data table
3. Verify color contrast in both themes

---

## Remediation Priority: MEDIUM

### Required Changes

1. **Extract chart dimensions** to `lib/ui-constants.ts`
   - Add `CHART_DIMENSIONS` constant
   - Include row heights, padding, min/max constraints

2. **Replace hardcoded colors** with CSS custom properties
   - Use `var(--pattern-*)` for data colors
   - Use `var(--glass-*)` for UI chrome

3. **Use glass morphism tokens** for tooltip styling

4. **Align animation duration** with design system (LOW priority)

---

## Gap Count Summary

| Category | Count |
|----------|-------|
| Hardcoded dimensions | 3 (rowHeight, padding, container calc) |
| Hardcoded colors | 6 (primary, secondary, etc.) |
| Hardcoded opacity | 1 (tooltip background) |
| Animation timing | 1 (300ms) |
| **Total gaps** | **11** |

---

## Suggested Constants Addition

```typescript
// lib/ui-constants.ts

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
  /** Timeline/line charts */
  timeline: {
    height: 300,
    marginTop: 20,
    marginRight: 30,
    marginBottom: 20,
    marginLeft: 40,
  },
} as const

export const CHART_THEME = {
  /** Colors for chart elements */
  colors: {
    primary: 'var(--pattern-exploring)',
    secondary: 'var(--pattern-analytical)',
    tertiary: 'var(--pattern-helping)',
    quaternary: 'var(--pattern-building)',
    quinary: 'var(--pattern-patience)',
  },
  /** Grid and axis colors */
  chrome: {
    grid: 'var(--glass-border)',
    axis: 'var(--color-muted)',
    background: 'var(--glass-bg)',
  },
  /** Stroke widths */
  strokes: {
    line: 2,
    bar: 1,
    grid: 1,
  },
} as const
```

---

## Related Files to Update

- `lib/ui-constants.ts` - Add `CHART_DIMENSIONS`, `CHART_THEME`
- `app/globals.css` - May need chart-specific CSS variables
- `components/admin/SkillProgressionChart.tsx` - Primary refactor target
- `components/CareerValuesRadar.tsx` - Secondary (see separate audit)
