# Component Audit: GameChoices.tsx

**File:** `components/GameChoices.tsx`
**Lines:** 867
**Last Audited:** January 22, 2026

---

## Component Overview

The GameChoices component renders interactive choice cards for the game narrative. It handles:
- Choice rendering with pattern-based styling
- Hover states with shadows and glows
- Animation transitions (Framer Motion)
- Accessibility features (keyboard navigation, ARIA)

---

## Design Token Compliance

### Currently Using (Correct)

| Token Type | Implementation | Source |
|------------|----------------|--------|
| Animation variants | `choiceCardVariants` | `lib/animations.ts` |
| Container layout | Grid with responsive breakpoints | Tailwind config |
| Pattern metadata | `PATTERN_METADATA` import | `lib/patterns.ts` |
| Spring animations | `SPRING_CONFIGS.gentle` | `lib/animations.ts` |

### Hardcoded Values Found (Gaps)

#### 1. Hover Shadow Colors (Lines ~420-450)

**Current Implementation:**
```tsx
const getPatternHoverStyle = (pattern: PatternName) => {
  // Hardcoded RGBA values
  switch (pattern) {
    case 'analytical':
      return 'hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)]'
    case 'exploring':
      return 'hover:shadow-[0_4px_12px_rgba(139,92,246,0.25)]'
    case 'helping':
      return 'hover:shadow-[0_4px_12px_rgba(34,197,94,0.2)]'
    case 'building':
      return 'hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)]'
    case 'patience':
      return 'hover:shadow-[0_4px_12px_rgba(236,72,153,0.2)]'
  }
}
```

**Issue:** Colors are hardcoded as RGBA values instead of using pattern tokens.

**Recommended Fix:**
```tsx
import { PATTERN_METADATA } from '@/lib/patterns'

// Option A: Use pattern metadata directly
const getPatternHoverStyle = (pattern: PatternName) => {
  const color = PATTERN_METADATA[pattern].color
  // Convert hex to shadow format
  return `hover:shadow-[0_4px_12px_${color}33]` // 33 = 20% opacity
}

// Option B: Create a new constant in ui-constants.ts
export const PATTERN_HOVER_SHADOWS = {
  analytical: 'hover:shadow-[0_4px_12px_var(--pattern-analytical-shadow)]',
  exploring: 'hover:shadow-[0_4px_12px_var(--pattern-exploring-shadow)]',
  // ...etc
} as const
```

#### 2. Hover Glow Effects (Lines ~460-490)

**Current Implementation:**
```tsx
const getPatternGlowStyle = (pattern: PatternName) => {
  switch (pattern) {
    case 'analytical':
      return 'rgba(59,130,246,0.15)'
    case 'exploring':
      return 'rgba(139,92,246,0.15)'
    // ... etc
  }
}
```

**Issue:** Same colors duplicated for glow effects.

**Recommended Fix:** Derive from single source (PATTERN_METADATA).

#### 3. Border Radius Values (Lines ~280)

**Current Implementation:**
```tsx
className="rounded-2xl"
```

**Status:** Acceptable - uses Tailwind preset which is documented in design system.

---

## Animation Analysis

### Using Design System

| Animation | Source | Compliance |
|-----------|--------|------------|
| `choiceCardVariants` | `lib/animations.ts` | ✅ Compliant |
| `initial`, `animate` props | Framer Motion | ✅ Compliant |
| Spring configs | `SPRING_CONFIGS.gentle` | ✅ Compliant |

### Inline Animations

None found - all animations use centralized variants.

---

## Accessibility Review

| Feature | Implementation | Status |
|---------|----------------|--------|
| Keyboard navigation | `tabIndex={0}`, `onKeyDown` handlers | ✅ Present |
| ARIA labels | `aria-label` on choice cards | ✅ Present |
| Focus states | `focus:ring-2 focus:ring-offset-2` | ✅ Present |
| Motion preferences | Uses `prefersReducedMotion` | ✅ Present |

---

## Remediation Priority: HIGH

### Required Changes

1. **Extract hover shadow colors** to `lib/ui-constants.ts`
   - Create `PATTERN_HOVER_STYLES` constant
   - Reference `PATTERN_METADATA` colors

2. **Extract glow colors** using same approach
   - Create `PATTERN_GLOW_STYLES` constant

3. **Add CSS custom properties** for pattern shadows in `globals.css`
   ```css
   :root {
     --pattern-analytical-shadow: rgba(59, 130, 246, 0.2);
     --pattern-exploring-shadow: rgba(139, 92, 246, 0.2);
     --pattern-helping-shadow: rgba(34, 197, 94, 0.2);
     --pattern-building-shadow: rgba(249, 115, 22, 0.2);
     --pattern-patience-shadow: rgba(236, 72, 153, 0.2);
   }
   ```

---

## Gap Count Summary

| Category | Count |
|----------|-------|
| Hardcoded colors | 10 (5 shadow + 5 glow) |
| Hardcoded spacing | 0 |
| Animation inconsistencies | 0 |
| Z-index issues | 0 |
| **Total gaps** | **10** |

---

## Related Design Token Files

- `lib/patterns.ts:15-52` - Pattern color definitions (canonical source)
- `lib/ui-constants.ts` - Should add `PATTERN_HOVER_STYLES`
- `app/globals.css` - Should add pattern shadow CSS variables
