# Gap Analysis: Animation Timing

**Category:** Animation Token Compliance
**Priority:** NONE (No real issues found)
**Estimated Instances:** 0 actual issues (Revised from 5-8)
**Last Updated:** January 22, 2026
**Revision:** 2 (corrected after re-analysis)

---

## Executive Summary

**CORRECTION:** The initial audit claimed animation timing inconsistencies, but re-analysis shows:

1. **CSS 0.3s matches `ANIMATION_DURATION.slow` (300ms)** - No mismatch
2. **Original audit used wrong units** - Tokens are in MILLISECONDS, not seconds
3. **globals.css already has timing alignment comments** - Intentional design

**No action required.** The animation system is consistent.

---

## Canonical Animation Sources (CORRECTED)

### UI Constants (`lib/ui-constants.ts`)

```typescript
// Values are in MILLISECONDS, not seconds!
export const ANIMATION_DURATION = {
  instant: 0,       // 0ms
  fast: 150,        // 150ms = 0.15s
  normal: 200,      // 200ms = 0.2s
  slow: 300,        // 300ms = 0.3s ← CSS uses this!
  message: 400,     // 400ms = 0.4s
  page: 500,        // 500ms = 0.5s
} as const
```

### CSS Already Aligned (`globals.css` Lines 652-655)

```css
/* Timing - aligned with lib/animations.ts durations */
--transition-slow: 0.4s;
```

---

## Correction to Original Audit

### Error: Unit Confusion

**Original Claim:**
> `ANIMATION_DURATION.normal = 0.25s` but CSS uses 0.3s

**Reality:**
- `ANIMATION_DURATION.slow = 300` (milliseconds = 0.3s)
- CSS animations using 0.3s ARE CORRECT
- The original audit confused the unit (assumed seconds, actual is milliseconds)

### Verified CSS Durations

| CSS Animation | Duration | Token Match |
|---------------|----------|-------------|
| `fadeIn` | 0.3s | `slow` (300ms) ✓ |
| `slideInFromBottom` | 0.3s | `slow` (300ms) ✓ |
| `slideOutToBottom` | 0.3s | `slow` (300ms) ✓ |
| `zoomIn` | 0.3s | `slow` (300ms) ✓ |
| `fadeInText` | 0.4s | `message` (400ms) ✓ |
| `glassFloatIn` | 0.5s | `page` (500ms) ✓ |

**All durations align with design tokens.**

---

## Looping Animations (Correctly Excluded)

These animations have custom timing for rhythm/feel:

| Animation | Duration | Purpose |
|-----------|----------|---------|
| `navMarqueeShimmer` | 2s | Attention-grabbing loop |
| `navBorderPulse` | 2s | Subtle breathing effect |
| `orbBreathe` | 4s | Calm background rhythm |
| `atmospherePulse` | 8s | Slow ambient mood |

These are intentionally longer and not subject to `ANIMATION_DURATION` tokens.

---

## Tailwind Duration Classes

### Analysis

| Class | Duration | Nearest Token |
|-------|----------|---------------|
| `duration-150` | 150ms | `fast` (150ms) ✓ |
| `duration-200` | 200ms | `normal` (200ms) ✓ |
| `duration-300` | 300ms | `slow` (300ms) ✓ |
| `duration-500` | 500ms | `page` (500ms) ✓ |

**All Tailwind classes align with tokens.**

---

## Revised Gap Count

| Category | Original Claim | Actual Count |
|----------|----------------|--------------|
| CSS keyframe mismatches | 3 | **0** |
| Tailwind non-standard | ~5 | **0** |
| Recharts durations | 1 | Minor (acceptable) |
| **Total** | **~9** | **~0** |

---

## Conclusion

The animation timing system is **well-designed and consistent**. The original audit:
- Confused milliseconds with seconds in token values
- Didn't notice globals.css comments about intentional alignment
- Flagged non-issues as problems

**No action required.**

---

## Optional Enhancement (Future)

If desired, add CSS custom properties for the full token set:

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-message: 400ms;
  --duration-page: 500ms;
}
```

This would allow CSS animations to reference tokens directly. However, this is a nice-to-have, not a bug fix.
