# Mobile Choices Container - Cursor Handoff

**Date:** January 16, 2026
**Status:** IN PROGRESS - Needs Testing
**Priority:** CRITICAL

---

## Session Summary

Extensive mobile UX debugging session focused on the choices/answer container in the game interface. Multiple iterations of fixes deployed.

---

## Current State

**Production:** https://lux-story.vercel.app
**Git HEAD:** Uncommitted changes on top of `2b770e0`

### What's Working
- ✅ Narrative container scrolls smoothly on mobile
- ✅ Ghost text fix (z-[1] on button content)
- ✅ Hover translate removed (no more 2px jump on mobile tap)
- ✅ Animation conflicts resolved (whileTap, scrollSnapAlign removed)

### What's Still Broken (User Reports)
- ❌ Answer container width may have changed (unintended)
- ❌ Can't navigate to bottom of choices
- ❌ Chrome mobile bottom bar cuts off answers
- ❌ Bottom of 2nd answer option not visible

---

## Changes Made Today

### Reverted Commits
We reverted from `9e5d55c` back to `2b770e0` to restore working narrative scroll. Lost commits were UI-only (no content/dialogue affected).

### Files Modified (Current Uncommitted State)

**1. `components/GameChoices.tsx`**
```tsx
// Line 255-263: Removed tap/hover variants from buttonVariants
const buttonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, ease: [...] } },
  // REMOVED: tap: { scale: 0.98 }, hover: { scale: 1.0 }
}

// Line 406-415: Removed whileTap and scrollSnapAlign from motion.div
<motion.div
  variants={combinedVariants}
  // REMOVED: whileTap="tap"
  animate={_animateState}
  // REMOVED: style={{ scrollSnapAlign: 'start' }}
>

// Line 472-476: Added touch selection prevention
style={{
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  userSelect: 'none',
  ...
}}

// Line 491, 499: Added z-[1] for ghost text fix
<div className="mr-3 opacity-90 relative z-[1]">
<span className="flex-1 line-clamp-4 relative z-[1]">
```

**2. `lib/ui-constants.ts`**
```tsx
// Line 311: Removed hover translate from GLASS_BUTTON
export const GLASS_BUTTON = `${GLASS_STYLES.base} ${GLASS_STYLES.text} ${GLASS_STYLES.shadow} ${GLASS_STYLES.hover} ${GLASS_STYLES.transition}`;
// REMOVED: hover:-translate-y-0.5

// Lines 328-332: Updated CHOICE_CONTAINER_HEIGHT
export const CHOICE_CONTAINER_HEIGHT = {
  mobileSm: 'max-h-[280px]',          // was: min-h-[220px] max-h-[220px]
  mobile: 'xs:max-h-[320px]',         // was: xs:min-h-[296px] xs:max-h-[296px]
  tablet: 'sm:max-h-[260px]',         // was: sm:min-h-[198px] sm:max-h-[198px]
} as const;
```

**3. `components/StatefulGameInterface.tsx`**
```tsx
// Lines 3891-3907: Footer with increased padding for Chrome bottom bar
<footer
  className="flex-shrink-0 glass-panel max-w-4xl mx-auto w-full px-3 sm:px-4 z-20"
  style={{
    marginTop: '0.75rem',
    paddingBottom: 'max(48px, env(safe-area-inset-bottom, 48px))'
  }}
>
  <div className="px-4 sm:px-6 pt-2 pb-0.5 text-center">
    <span className="text-[10px] sm:text-[11px] ...">Your Response</span>
  </div>
  <div className="px-4 sm:px-6 pt-1 pb-2">
```

---

## Deep Investigation Findings

### Critical Issues Identified

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | whileTap blocks scroll | HIGH | ✅ Fixed |
| 2 | Two competing scale animations | HIGH | ✅ Fixed |
| 3 | hover:-translate-y-0.5 causes jump | HIGH | ✅ Fixed |
| 4 | Container height too small (220px) | HIGH | ✅ Fixed (now 280px) |
| 5 | Chrome bottom bar not in safe-area | HIGH | ⚠️ Attempted (48px padding) |
| 6 | scrollSnapAlign fights touch | MEDIUM | ✅ Fixed |
| 7 | Width container change | MEDIUM | ❓ Undiagnosed |

### Architecture Notes

The layout uses flexbox:
```
Container: min-h-[100dvh] flex flex-col
├── Header: flex-shrink-0
├── Main: flex-1 overflow-y-auto (narrative - WORKS)
└── Footer: flex-shrink-0 (choices - ISSUES)
```

- `env(safe-area-inset-bottom)` returns 0 on Android Chrome
- Chrome's bottom bar (URL + nav) is 48-56px, NOT covered by safe-area
- The GameChoices component has its own height constraints via CHOICE_CONTAINER_HEIGHT

---

## Next Steps for Cursor

### Priority 1: Debug Width Issue
User reports answer container width changed. Check:
- Did removing `min-h` from CHOICE_CONTAINER_HEIGHT affect layout?
- Is the footer's `w-full` being overridden somewhere?
- Compare current render to previous state

### Priority 2: Bottom Cutoff
48px padding may not be enough. Options:
1. Increase padding further (56px or 64px)
2. Use CSS `100dvh` minus explicit footer height
3. Add JavaScript to detect bottom bar height

### Priority 3: Test on Actual Devices
- iPhone Safari (home indicator)
- iPhone Chrome
- Android Chrome (bottom nav bar)
- iPad

### Potential Quick Fixes
```tsx
// Option A: Increase footer padding even more
paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))'

// Option B: Use explicit bottom margin on last choice
// In GameChoices.tsx, add margin-bottom to last button

// Option C: Reduce choice container max-height to leave more room
CHOICE_CONTAINER_HEIGHT = {
  mobileSm: 'max-h-[240px]',  // Reduced from 280px
  ...
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `components/StatefulGameInterface.tsx` | Main game layout, footer structure |
| `components/GameChoices.tsx` | Choice buttons, height constraints |
| `lib/ui-constants.ts` | GLASS_BUTTON, CHOICE_CONTAINER_HEIGHT |
| `app/globals.css` | Touch handling CSS |
| `tailwind.config.ts` | Custom `xs:` breakpoint at 400px |

---

## Commands

```bash
# Dev server
npm run dev

# Build
npm run build

# Deploy
vercel --prod

# Check current git state
git status
git diff HEAD
```

---

## Plan File Reference

Full investigation details at:
`/Users/abdusmuwwakkil/.claude/plans/humble-shimmying-hellman.md`

