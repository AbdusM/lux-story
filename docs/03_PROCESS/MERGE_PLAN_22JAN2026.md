# Merge Plan: review/gemini-merge → main

**Date:** January 22, 2026
**Status:** READY FOR EXECUTION

---

## Branch Divergence Summary

| Metric | Value |
|--------|-------|
| Commits on this branch (not in main) | 10 |
| Commits on main (not in this branch) | 90 |
| Common ancestor | `ce902c1` (docs: fix documentation inaccuracies) |
| Files modified on both branches | 18 |
| **Merge conflicts identified** | **9** |

---

## This Branch (`review/gemini-merge`) - What We're Adding

### Major Features
1. **UX Transformation (Sprint 1-4)**
   - Single scroll refactor (removed nested scrolling)
   - Signature choice animation (choice commitment with flyUp)
   - Bottom sheet preparation
   - Narrative lock UI

2. **Backlog Features**
   - Waiting Room patience mechanic (timer-based content reveals)
   - Pattern Resonance Paths (15 pattern-gated constellation connections)
   - Constellation smart zoom + snap-to-node
   - Evidence Schema

3. **Runtime Improvements**
   - Save durability (pagehide flush)
   - Session tracking
   - EnvironmentalEffects component

### Files Created (New)
- `components/ui/WaitingRoomIndicator.tsx`
- `components/ui/BottomSheet.tsx`
- `hooks/useWaitingRoom.ts`
- `hooks/useChoiceCommitment.ts`
- `lib/constellation/pattern-resonance-paths.ts`
- `lib/waiting-room-content.ts`
- `lib/narrative-locks.ts`
- `lib/choice-adapter.ts`
- `lib/ui-types.ts`
- `lib/evidence-schema.ts`

---

## Main Branch - What We're Receiving

### Major Features
1. **Keyboard Navigation & Accessibility**
   - `useKeyboardShortcuts` hook
   - `KeyboardShortcutsHelp` component
   - Constellation keyboard navigation

2. **Menu Consolidation**
   - `GameMenu` → `UnifiedMenu` migration
   - In-game settings moved to unified menu
   - `IdleWarningModal` component

3. **Dialogue Content Expansion (90 commits)**
   - 64 beat nodes for teaching moments
   - NPC voice variations for all 20 characters
   - Trust recovery system (20/20 characters)
   - Pattern reflections expansion

4. **Test Infrastructure**
   - E2E test fixtures
   - Mobile test suite
   - iPad viewport fixes
   - Visual validation tests

5. **Performance & Stability**
   - Background sync improvements
   - Rate limiting on API routes
   - Atomic state updates
   - God Mode refresh counter

---

## Conflict Resolution Strategy

### 1. `components/StatefulGameInterface.tsx` (CRITICAL)

**This branch adds:**
- `EnvironmentalEffects` component
- `setupPlayTimeTracking`
- Single scroll refactor (CardContent without overflow)
- Sticky footer with safe-area padding
- `pendingSaveRef` for pagehide flush

**Main adds:**
- `UnifiedMenu` (replaces GameMenu)
- `useSettingsSync`, `useKeyboardShortcuts`
- `KeyboardShortcutsHelp`, `IdleWarningModal`
- Audio volume state persistence
- God Mode `refreshCounter`
- Keyboard shortcut handlers

**Resolution:** KEEP BOTH - merge imports, hooks, and JSX from both branches. The single scroll refactor and main's menu/keyboard changes don't overlap in JSX structure.

---

### 2. `components/GameChoices.tsx` (MEDIUM)

**This branch adds:**
- Signature choice animation (`useChoiceCommitment`)
- `narrativeLockMessage`, `lockProgress`, `lockActionHint` props
- Animation variants (tapped, committed, flyUp)
- `selectedChoiceId`, `animationState` props

**Main adds:**
- Simplified pattern hover styles (removed bg/activeBg)
- `CHOICE_CONTAINER_HEIGHT` import
- `cn` utility import

**Resolution:** KEEP BOTH - main's style simplification is compatible with this branch's animation additions.

---

### 3. `components/Journal.tsx` (MEDIUM)

**This branch adds:**
- Pull-to-dismiss gesture support
- Bottom tab navigation prep

**Main adds:**
- Settings sync integration
- Keyboard shortcut hints

**Resolution:** KEEP BOTH - pull-to-dismiss and settings sync are independent features.

---

### 4. `components/constellation/ConstellationGraph.tsx` (MEDIUM)

**This branch adds:**
- Smart zoom (1x-2.5x)
- Pan offset for zoomed views
- Snap-to-node magnetic selection
- Pattern resonance paths rendering

**Main adds:**
- Keyboard navigation support
- Focus management

**Resolution:** KEEP BOTH - zoom/pan and keyboard navigation complement each other.

---

### 5. `components/ShareResultCard.tsx` (DELETE CONFLICT)

**This branch:** Modified
**Main:** Deleted

**Resolution:** DELETE - follow main's deletion. Any modifications we made are superseded.

---

### 6. `lib/validators/dialogue-validators.ts` (ADD/ADD)

**Both branches:** Created this file

**Resolution:** COMPARE AND MERGE - likely similar validation logic, combine best of both.

---

### 7. `lib/pattern-combos.ts` (MINOR)

**This branch:** Minor changes
**Main:** Test-related changes

**Resolution:** Keep main's version, verify our changes aren't lost.

---

### 8. `lib/dev-tools/god-mode-api.ts` (MINOR)

**This branch:** Removed 2 lines
**Main:** Added refresh counter logic

**Resolution:** Keep main's version (has more recent features).

---

### 9. `CLAUDE.md` (DOCUMENTATION)

**Both branches:** Updated documentation

**Resolution:** Merge both updates, prioritize main's content structure with our January 22 additions.

---

## Execution Plan

### Step 1: Pre-Merge Verification
```bash
# Ensure working tree is clean
git status

# Run tests on current branch
npm test

# Build to verify no errors
npm run build
```

### Step 2: Create Merge Branch
```bash
# Create a new branch for the merge
git checkout -b merge/gemini-to-main

# Merge main into this branch (resolve conflicts here)
git merge main
```

### Step 3: Conflict Resolution Order
1. `components/ShareResultCard.tsx` - Delete the file (follow main)
2. `lib/pattern-combos.ts` - Accept main's version
3. `lib/dev-tools/god-mode-api.ts` - Accept main's version
4. `lib/validators/dialogue-validators.ts` - Merge both versions
5. `CLAUDE.md` - Merge documentation
6. `components/constellation/ConstellationGraph.tsx` - Merge zoom + keyboard
7. `components/Journal.tsx` - Merge pull-to-dismiss + settings
8. `components/GameChoices.tsx` - Merge animation + style cleanup
9. `components/StatefulGameInterface.tsx` - Careful merge (most complex)

### Step 4: Post-Merge Verification
```bash
# Run full test suite
npm test

# Build to verify
npm run build

# Run lint
npm run lint

# Manual smoke test
npm run dev
# Test: Dialogue flow, Journal, Constellation, Keyboard shortcuts
```

### Step 5: Finalize
```bash
# If all tests pass, merge to main
git checkout main
git merge merge/gemini-to-main

# Push to remote
git push origin main
```

---

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| StatefulGameInterface merge | HIGH | Careful line-by-line review |
| Test regressions | MEDIUM | Run full suite after each file |
| Missing keyboard shortcuts | LOW | Verify handler registration |
| Broken animations | LOW | Visual smoke test |
| Mobile layout issues | MEDIUM | Test on mobile viewport |

---

## Rollback Plan

If merge causes critical issues:

```bash
# Revert the merge commit
git revert -m 1 <merge-commit-hash>

# Or reset to pre-merge state
git reset --hard <pre-merge-commit>
```

---

## Files That Auto-Merged Successfully

These files had changes on both branches but Git resolved automatically:
- `app/layout.tsx`
- `components/HarmonicsView.tsx`
- `components/ThoughtCabinet.tsx`
- `components/constellation/ConstellationPanel.tsx`
- `components/constellation/QuestsView.tsx`
- `content/samuel-dialogue-graph.ts`
- `lib/safe-storage.ts`
- `package.json`
- `package-lock.json`

Still need manual review after merge to ensure correctness.

---

**Ready to execute merge?** Proceed with Step 1 verification.
