# Component Audit: GameMenu.tsx

**File:** `components/GameMenu.tsx`
**Lines:** 88
**Last Audited:** January 22, 2026

---

## Component Overview

The GameMenu component renders the main game navigation menu. It provides:
- Menu item navigation
- Visual styling with gradients
- Hover/active states

---

## Design Token Compliance

### Currently Using (Correct)

| Token Type | Implementation | Source |
|------------|----------------|--------|
| Layout | Flexbox with Tailwind | Tailwind config |
| Spacing | Tailwind classes | Standard |
| Typography | Font size classes | Tailwind config |

### Hardcoded Values Found (Gaps)

#### 1. Gradient Definitions (Lines ~35-50)

**Current Implementation:**
```tsx
const menuGradient = 'bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899]'
```

**Issue:** Inline gradient using hardcoded hex values that match pattern colors.

**Recommended Fix:**
```tsx
// Option A: Add to ui-constants.ts
export const GRADIENT_LIBRARY = {
  patternSpectrum: 'bg-gradient-to-r from-pattern-analytical via-pattern-exploring to-pattern-patience',
  // Or with CSS variables
  patternSpectrumVar: 'bg-gradient-to-r from-[var(--pattern-analytical)] via-[var(--pattern-exploring)] to-[var(--pattern-patience)]',
} as const

// Option B: Add CSS class in globals.css
.gradient-pattern-spectrum {
  background: linear-gradient(
    to right,
    var(--pattern-analytical),
    var(--pattern-exploring),
    var(--pattern-patience)
  );
}
```

#### 2. Box Shadow Values (Lines ~60-65)

**Current Implementation:**
```tsx
className="shadow-lg hover:shadow-xl"
```

**Status:** Acceptable - uses Tailwind presets.

#### 3. Border/Ring Colors (Lines ~70)

**Current Implementation:**
```tsx
className="ring-1 ring-white/10"
```

**Status:** Acceptable - uses standard glass morphism opacity pattern.

---

## Animation Analysis

### Current State

**Implementation:**
```tsx
const menuTransition = 'transition-all duration-200 ease-out'
```

**Issue:** `duration-200` (0.2s) is close to but not exactly `ANIMATION_DURATION.normal` (0.25s).

**Recommended Fix:**
```tsx
// Use Tailwind's duration-200 as it's close enough
// OR create custom Tailwind duration class that matches exactly
// In tailwind.config.ts:
extend: {
  transitionDuration: {
    'normal': '250ms', // Matches ANIMATION_DURATION.normal
  }
}

// Then use:
className="transition-all duration-normal ease-out"
```

---

## Accessibility Review

| Feature | Implementation | Status |
|---------|----------------|--------|
| Keyboard navigation | `tabIndex`, focus states | ✅ Present |
| ARIA roles | `role="menu"`, `role="menuitem"` | ✅ Present |
| Focus indication | `focus:ring-2` | ✅ Present |

---

## Remediation Priority: MEDIUM

### Required Changes

1. **Extract gradient to design system**
   - Add `GRADIENT_LIBRARY` to `lib/ui-constants.ts`
   - Or add CSS class to `globals.css`

2. **Consider duration alignment** (LOW priority)
   - Create custom Tailwind duration class if exact matching needed

---

## Gap Count Summary

| Category | Count |
|----------|-------|
| Hardcoded colors | 3 (gradient hex values) |
| Animation timing | 1 (200ms vs 250ms) |
| **Total gaps** | **4** |

---

## Gradient Color Analysis

| Gradient Stop | Current | Pattern Token |
|---------------|---------|---------------|
| from | `#3B82F6` | `PATTERN_METADATA.analytical.color` |
| via | `#8B5CF6` | `PATTERN_METADATA.exploring.color` |
| to | `#EC4899` | `PATTERN_METADATA.patience.color` |

All colors match pattern tokens - just need to reference them properly.

---

## Suggested New Constants

```typescript
// lib/ui-constants.ts

export const GRADIENT_LIBRARY = {
  /** Full pattern spectrum: analytical → exploring → patience */
  patternSpectrum: {
    class: 'bg-gradient-to-r from-[var(--pattern-analytical)] via-[var(--pattern-exploring)] to-[var(--pattern-patience)]',
    css: 'linear-gradient(to right, var(--pattern-analytical), var(--pattern-exploring), var(--pattern-patience))',
  },
  /** Warm spectrum: building → patience */
  warmSpectrum: {
    class: 'bg-gradient-to-r from-[var(--pattern-building)] to-[var(--pattern-patience)]',
    css: 'linear-gradient(to right, var(--pattern-building), var(--pattern-patience))',
  },
  /** Cool spectrum: analytical → helping */
  coolSpectrum: {
    class: 'bg-gradient-to-r from-[var(--pattern-analytical)] to-[var(--pattern-helping)]',
    css: 'linear-gradient(to right, var(--pattern-analytical), var(--pattern-helping))',
  },
} as const
```

---

## Related Design Token Files

- `lib/patterns.ts` - Pattern colors for gradient stops
- `lib/ui-constants.ts` - Should add `GRADIENT_LIBRARY`
- `lib/animations.ts` - Duration constants reference
