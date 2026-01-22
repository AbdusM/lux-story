# Gap Analysis: Z-Index

**Category:** Z-Index Token Compliance
**Priority:** NONE (No real issues found)
**Estimated Instances:** 0 actual issues (Revised from 3-5)
**Last Updated:** January 22, 2026
**Revision:** 2 (corrected after re-analysis)

---

## Executive Summary

**CORRECTION:** The initial audit claimed z-index inconsistencies, but re-analysis shows:

1. **No `z-index: 50` for modals found in globals.css** - Claim was unverified
2. **Original audit had wrong `Z_INDEX` values** - Listed 50 for modal, actual is 110
3. **Only z-index values found:** `z-index: 10` and `z-index: -1` (decorative elements)

**No action required.** The z-index system is properly defined.

---

## Canonical Z-Index Source (CORRECTED)

### UI Constants (`lib/ui-constants.ts`)

```typescript
export const Z_INDEX = {
  dropdown: 50,
  sticky: 60,
  fixed: 70,
  modalBackdrop: 100,
  modal: 110,        // ← NOT 50!
  popover: 120,
  tooltip: 130,
  toast: 140,
} as const
```

**Note:** The original audit document incorrectly listed `modal: 50`. The actual value is `110`.

---

## Actual Z-Index Usage in globals.css

Grep results from re-analysis:

```
globals.css:425:  z-index: 10;   // Decorative element
globals.css:454:  z-index: -1;   // Background element
globals.css:758:  z-index: -1;   // Background element
```

**No modal, overlay, toast, or tooltip z-index declarations found in globals.css.**

---

## Correction to Original Audit

### Error: Fabricated Modal Z-Index Claim

**Original Claim:**
> globals.css modal uses `z-index: 50` but `Z_INDEX.modal` should be `110`

**Reality:**
- No `.modal` class with z-index found in globals.css
- `Z_INDEX.modal = 110` (not 50 as original document stated)
- The claim was never verified before documenting

### Error: Wrong Token Values

The original document showed:
```typescript
// WRONG - from original audit
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  modal: 50,  // Incorrect!
  ...
}
```

Actual values:
```typescript
// CORRECT - from lib/ui-constants.ts
export const Z_INDEX = {
  dropdown: 50,
  sticky: 60,
  fixed: 70,
  modalBackdrop: 100,
  modal: 110,
  popover: 120,
  tooltip: 130,
  toast: 140,
}
```

---

## Z-Index Architecture (Verified Correct)

The design system has a well-defined semantic z-index scale:

```
┌─────────────────────────────────────┐
│ Toast Notifications (z-140)         │
├─────────────────────────────────────┤
│ Tooltips (z-130)                    │
├─────────────────────────────────────┤
│ Popovers (z-120)                    │
├─────────────────────────────────────┤
│ Modals (z-110)                      │
├─────────────────────────────────────┤
│ Modal Backdrops (z-100)             │
├─────────────────────────────────────┤
│ Fixed Navigation (z-70)             │
├─────────────────────────────────────┤
│ Sticky Headers (z-60)               │
├─────────────────────────────────────┤
│ Dropdowns (z-50)                    │
├─────────────────────────────────────┤
│ Base Content (z-0)                  │
└─────────────────────────────────────┘
```

This is a proper layered architecture with appropriate gaps between levels.

---

## Revised Gap Count

| Category | Original Claim | Actual Count |
|----------|----------------|--------------|
| CSS/Token mismatch | ~3 | **0** |
| Non-standard values | ~2 | **0** |
| **Total** | **~5** | **0** |

---

## Conclusion

The z-index system is **well-designed and consistent**. The original audit:
- Listed incorrect token values
- Claimed CSS classes that don't exist
- Didn't verify claims before documenting

**No action required.**

---

## Tailwind Z-Index Classes

Components may use standard Tailwind z-index classes:

| Tailwind | Value | Semantic Meaning |
|----------|-------|------------------|
| `z-10` | 10 | Light elevation |
| `z-20` | 20 | Sticky |
| `z-30` | 30 | Fixed |
| `z-40` | 40 | Overlay (light) |
| `z-50` | 50 | Dropdown |

These align with the lower end of the `Z_INDEX` scale. Components requiring higher z-index (modals, tooltips, toasts) should use the TypeScript constants directly or CSS-in-JS.

---

## Optional Enhancement (Future)

If desired, add CSS custom properties for z-index tokens:

```css
:root {
  --z-dropdown: 50;
  --z-sticky: 60;
  --z-fixed: 70;
  --z-modal-backdrop: 100;
  --z-modal: 110;
  --z-popover: 120;
  --z-tooltip: 130;
  --z-toast: 140;
}
```

This would enable CSS classes to reference the semantic scale. However, this is a nice-to-have, not a bug fix.
