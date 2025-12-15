# Polish Audit - December 15, 2024
**Follow-up to Side Menus Audit**

---

## Executive Summary

Found **5 additional issues** that need addressing before pilot:

| Issue | Severity | Fix Time | Status |
|-------|----------|----------|--------|
| Orbs comment promises "allocate" feature | Medium | 5 min | 🔴 Fix |
| ThoughtCabinet footer still misleading | High | Done | ✅ Fixed |
| Unlock effects component exists but unused | Low | Defer | ⏸️ |
| Trust-based unlocks claim in docs | Low | N/A | ✅ Working |
| Various TODO comments in content | Low | Defer | ⏸️ |

---

## Issue 1: Orbs Comment Promises "Allocate" Feature

**File:** `lib/orbs.ts` (line 6)
```typescript
/**
 * Orb System - Insight Currency for Lux Story
 *
 * Orbs represent self-knowledge earned through choices.
 * Players earn orbs by making choices that demonstrate patterns,
 * and can allocate them to unlock career insights and dialogue options.  // ← FALSE
 ```

**Problem:** Comment says players "can allocate" orbs, but:
- No allocation UI exists
- `totalAllocated` and `availableToAllocate` fields exist but are always 0
- No mechanism to "spend" orbs

**Impact:** Developer confusion (not player-facing)

**Fix:** Update comment to reflect actual system:
```typescript
/**
 * Orb System - Insight Currency for Lux Story
 *
 * Orbs represent self-knowledge earned through choices.
 * Players earn orbs by making choices that demonstrate patterns.
 * Orb fill levels unlock achievement descriptions in the Journal.
 *
 * Note: Allocation feature not implemented - orbs are earned-only.
 */
```

---

## Issue 2: ThoughtCabinet Footer (ALREADY FIXED)

**File:** `components/ThoughtCabinet.tsx` (line 306)
```tsx
<p className="text-xs text-slate-400">Thoughts shape your dialogue options.</p>
```

**Status:** ThoughtCabinet Brain icon was hidden in previous commit, so this footer is no longer visible to users.

**Future:** If ThoughtCabinet is re-enabled, update footer to:
```tsx
<p className="text-xs text-slate-400">Thoughts reflect your developing worldview.</p>
```

---

## Issue 3: Unlock Effects Component Exists But Mostly Unused

**Files:**
- `components/unlock-enhancements/` directory
- `hooks/useUnlockEffects.ts`

**Components:**
- `BirminghamTooltip.tsx` - Shows Birmingham location info
- `EmotionTag.tsx` - Shows character emotion
- `Subtext.tsx` - Shows subtext hints
- `TrustDisplay.tsx` - Shows trust level

**Current Usage:**
- `EmotionTag` - Used in DialogueDisplay (working)
- `TrustDisplay` - Used in DialogueDisplay (working)
- `Subtext` - Imported but rarely triggered (needs more content)
- `BirminghamTooltip` - Imported but location parameter unused

**Impact:** Medium - features exist but don't appear often

**Recommendation:** Defer - these are enhancements, not broken promises

---

## Issue 4: Trust-Based Scene Unlocks (VERIFIED WORKING)

**Claim:** "High trust unlocks optional scenes"

**Verification:**
```typescript
// lib/dialogue-graph.ts line 257
if (condition.trust.max !== undefined && trust > condition.trust.max) {
```

**Finding:** Trust conditions ARE evaluated. Choices with `visibleCondition.trust` or `enabledCondition.trust` respect trust levels.

**Status:** ✅ Working as designed

---

## Issue 5: TODO Comments in Content Files

**Found 70+ TODO comments**, mostly in `content/marcus-dialogue-graph.ts` for future SFX/VFX:

```typescript
// TODO: [SFX] Subtle mechanical hum (ECMO machine sound)
// TODO: [VFX] Soft glow effect on "ECMO" - educational highlight
```

**Impact:** None - these are development notes, not player-facing

**Recommendation:** Keep as future enhancement roadmap

---

## Quick Fixes (Do Now)

### Fix 1: Update orbs.ts comment (5 min)

```typescript
// lib/orbs.ts - Update header comment
```

---

## Deferred Items (Post-Pilot)

1. **Add more subtext triggers** - Subtext component exists but needs more dialogue nodes with `subtext` field
2. **Birmingham tooltip location** - Parameter exists but not populated in current dialogue
3. **SFX/VFX system** - All the TODO comments in marcus-dialogue-graph.ts

---

## Summary

**Critical Issues Found:** 1 (orbs comment - misleading to developers)
**Already Fixed:** 1 (ThoughtCabinet hidden)
**Working As Designed:** 2 (trust unlocks, unlock effects)
**Deferred:** 2 (subtext content, SFX/VFX)

**Total Fix Time:** 5 minutes

---

## Action Items

- [x] Hide ThoughtCabinet Brain icon (done in previous commit)
- [x] Reframe unlock descriptions (done in previous commit)
- [ ] Update lib/orbs.ts comment to reflect reality
- [ ] (Optional) Add more subtext to dialogue nodes
- [ ] (Future) Wire ThoughtCabinet to 5-10 dialogue nodes
