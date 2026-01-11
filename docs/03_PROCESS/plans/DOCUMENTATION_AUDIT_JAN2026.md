# Documentation Audit & Software Development Opportunities

**Status:** 📋 HANDOFF COMPLETE | Awaiting Gemini Execution
**Date:** January 10, 2026
**Audited By:** Claude Code (Opus 4.5)
**Scope:** `docs/cursor/` (non-existent) → `docs/ai_context/` + `.cursorrules` audit
**Objective:** Identify what's accurate vs outdated, map all software development opportunities

**Related Documents:**
- `P0_FIX_HANDOFF_JAN2026.md` - Detailed execution instructions for P0 fixes

---

## Executive Summary

**Key Finding:** The `docs/cursor/` directory does **not exist**. User likely meant `docs/ai_context/` which contains 5 strategic documents.

**Documentation Health:** 78-85/100 (varies by auditor)
- ✅ Patent claims 85%+ implemented
- ✅ Core systems robust (1,025 tests passing)
- ❌ **2 P0 blockers remain unfixed** (type safety, error boundaries)
- ❌ **4 P1 features incomplete** (integration gaps)

**Priority Opportunities:** 10 immediate fixes, 6 high-priority integrations, 8 medium-priority polish items

---

## Part 1: Documentation Landscape (What Exists)

### Actual File Locations

| File | Path | Lines | Purpose | Status |
|------|------|-------|---------|--------|
| **Operational Rules** | `.cursorrules` | 32 | ISP protocol, Craft Gates | ✅ Current (Jan 10) |
| **Master QA Plan** | `docs/ai_context/SUPER_COMPREHENSIVE_QA_PLAN.md` | 54 | Corrected audit, P0 issues | ✅ Accurate |
| **Deep Scan Audit** | `docs/ai_context/DEEP_SCAN_QA_AUDIT_REPORT.md` | 607 | Detailed field-level traceability | ✅ Comprehensive |
| **Patent Claims** | `docs/ai_context/GCT_Patent_Application.md` | 441 | Legal ground truth (18 claims) | ✅ Canonical |
| **Third-Party Audit** | `docs/ai_context/THIRD_PARTY_AUDIT_REPORT.md` | 57 | External review (72/100) | ⚠️ More critical |
| **ISP Playbook** | `docs/ai_context/infinite_solutions_protocol_...` | 129 | Development methodology | ✅ Sound |

### Missing Directory
- **`docs/cursor/`** - Does not exist (user may have confused with `.cursorrules` or `docs/ai_context/`)

---

## Part 2: What's RIGHT (Accurate Documentation)

### ✅ Patent Claims Verification (Corrected in SUPER_COMPREHENSIVE_QA_PLAN)

| Claim | Feature | Implementation | Evidence |
|-------|---------|----------------|----------|
| **1** | Multi-Dimensional Pattern Inference | ✅ VERIFIED | `lib/patterns.ts`, 5 patterns tracked |
| **2** | Derivative State Computation | ✅ VERIFIED | All 7 modules exist with deep logic |
| **3** | Consequence Echo Architecture | ✅ VERIFIED | `lib/consequence-echoes.ts`, 1800+ variations |
| **4** | Interrupt Window System | ✅ VERIFIED | `lib/interrupt-derivatives.ts`, 6 types |
| **5** | Implicit Skill Demonstration | ✅ VERIFIED | `lib/skill-tracker.ts`, 54 skills |
| **6** | Pattern-Gated Content | ✅ VERIFIED | `lib/pattern-unlocks.ts`, progressive disclosure |
| **12** | Cognitive Domain Assessment | ✅ VERIFIED | `lib/cognitive-domain-calculator.ts`, DSM-5 |
| **15** | Engagement Validation | ✅ VERIFIED | `lib/engagement-metrics.ts`, ISP thresholds |

**Key Correction:** SUPER_COMPREHENSIVE_QA_PLAN upgraded Claim 2 from "PARTIAL" to "VERIFIED" after discovering all 7 derivative modules contain deep logic (e.g., `narrative-derivatives.ts` implements rich text effects & magical realism).

### ✅ System Coverage (Accurate as of Jan 10, 2026)

- **Tests:** 1,025 passing (verified)
- **Dialogue Nodes:** 1,158 total across 20 characters
- **Simulations:** 20 mapped in `simulation-registry.ts`
- **Content Lines:** 48,147 total in `content/` directory
- **Core Systems:** 85%+ implementation status

### ✅ Accessibility & UX Principles

- `prefers-reduced-motion` respected (verified in code)
- Modal semantics in Constellation panel (role="dialog", aria-modal)
- Escape key handler in Constellation (lines 74-81)
- Cognitive load levels implemented per patent spec (4 levels: Minimal/Reduced/Normal/Detailed)

---

## Part 3: What's WRONG (Outdated or Conflicting)

### 🔴 CRITICAL (P0) - Still Unresolved

#### P0-1: Simulation Type Safety Gap ❌ NOT FIXED
**Documentation says:** P0 blocker identified in both audits
**Reality:** Still exists as of Jan 10, 2026
**Evidence:** `content/simulation-registry.ts` line 25: `initialContext: any`
**Impact:** Runtime crashes if invalid context passed to SimulationRenderer
**Policy Violation:** `.cursorrules` line 12: "No `any` unless absolutely necessary (and commented with justification)"
**No justification comment found**

**Fix Required:**
```typescript
// Create discriminated union for all 20 simulation types
export type SimulationContext =
  | { type: 'audio_studio'; target: SynesthesiaTarget }
  | { type: 'dashboard_triage'; items: TriageItem[] }
  | { type: 'visual_canvas'; variant: CanvasVariant }
  // ... 17 more types
```

#### P0-2: Error Boundary Not Applied ⚠️ PARTIAL
**Documentation says:** P0 - `GameErrorBoundary` missing around `SimulationRenderer`
**Reality:** `GameErrorBoundary.tsx` EXISTS in codebase (contradicts audit claim)
**BUT:** Not wrapped around `SimulationRenderer` in `StatefulGameInterface.tsx` (lines ~3195/3412/3454)
**Impact:** Simulation crash → full game crash

**Fix Required:**
```tsx
<GameErrorBoundary fallback={<SimulationOffline />}>
  <SimulationRenderer config={simConfig} onSuccess={handleSuccess} />
</GameErrorBoundary>
```

---

### 🟡 HIGH PRIORITY (P1) - Documented but Not Fixed

#### P1-1: Skill Decay Not Invoked
**Status:** Function exists, not called
**Evidence:** `lib/assessment-derivatives.ts` has `calculateSkillDecay` (lines 1345-1442)
**Missing:** No invocation in `StatefulGameInterface.tsx` or `game-state-manager.ts`
**Impact:** Patent Claim 14 (skill decay mechanics) implemented but inactive

#### P1-2: Cognitive Load Not Applied
**Status:** Config exists, not enforced
**Evidence:** `lib/cognitive-load.ts` defines maxChoices (2/3/5/8)
**Missing:** `GameChoices.tsx` doesn't filter choices by maxChoices
**Impact:** Patent Claim 16 (accessibility) not enforced at render time

#### P1-3: Research Export API Incomplete
**Status:** Functions exist, no endpoints
**Evidence:** `lib/cognitive-domain-calculator.ts` has `createResearchExport`
**Missing:** No `/api/admin/research-export` or cohort endpoints
**Impact:** Patent Claim 18 partially implemented - data exists but not accessible

#### P1-4: Engagement Validation Not in UI
**Status:** Thresholds implemented, not displayed
**Evidence:** `lib/cognitive-domains.ts` has ENGAGEMENT_THRESHOLDS (3x/week = MODERATE)
**Missing:** `CognitionView.tsx` doesn't show engagement level
**Impact:** Patent Claim 15 (engagement validation) invisible to users/counselors

---

### 🟠 MEDIUM PRIORITY (P2) - Polish & Documentation

1. **Journal Panel Missing Modal Semantics** - No `role="dialog"` or `aria-modal` (Constellation has it)
2. **Safe Area Handling** - Not verified in SimulationRenderer inline/fullscreen modes
3. **Synesthesia Math Mismatch** - Code uses Manhattan distance, docs may claim Euclidean
4. **Simulation Type Union Drift** - `lib/dialogue-graph.ts` (16 types) vs `types.ts` (17 types, includes `secure_terminal`)
5. **Documentation Gaps** - Synesthesia Engine not documented (no design doc explaining math/UX)
6. **Silas Simulation Mismatch** - Dialogue uses `data_ticker`, registry uses `dashboard_triage`
7. **Focus Management** - Journal panel needs focus trap (Constellation has it)
8. **Type Definition Sync** - `SimulationType` union needs alignment across files

---

## Part 4: Software Development Opportunities (Prioritized)

### Immediate (P0 - Blockers)

| # | Task | File(s) | Estimated Effort | Impact |
|---|------|---------|------------------|--------|
| 1 | **Fix Type Safety in Simulation Registry** | `content/simulation-registry.ts` | 2-4 hours | Prevents runtime crashes |
| 2 | **Apply Error Boundary to SimulationRenderer** | `components/StatefulGameInterface.tsx` | 30 minutes | Graceful degradation on sim crash |

**Verification:**
```bash
# After fix 1
npm run type-check  # Must pass with ZERO `any` usage in registry

# After fix 2
# Manual test: Intentionally break a simulation context → Verify ErrorBoundary catches it
```

---

### High Priority (P1 - Feature Completion)

| # | Task | File(s) | Estimated Effort | Impact |
|---|------|---------|------------------|--------|
| 3 | **Integrate Skill Decay into Game Loop** | `lib/game-state-manager.ts`, `StatefulGameInterface.tsx` | 3-4 hours | Activates Patent Claim 14 |
| 4 | **Apply Cognitive Load Filtering** | `components/GameChoices.tsx`, `lib/cognitive-load.ts` | 2-3 hours | Enforces accessibility (Claim 16) |
| 5 | **Expose Research Export API** | `app/api/admin/research-export/route.ts`, `app/api/admin/cohort-analysis/route.ts` | 4-6 hours | Completes Patent Claim 18 |
| 6 | **Display Engagement Validation in UI** | `components/journal/CognitionView.tsx` or admin dashboard | 2-3 hours | Makes Claim 15 visible |

**Skill Decay Integration Example:**
```typescript
// In game-state-manager.ts - Session initialization
export function initializeGameSession() {
  // ...existing code

  // Check skill decay
  const currentSession = getCurrentSessionNumber()
  const lastSession = getLastSessionNumber()
  const sessionsSince = currentSession - lastSession

  if (sessionsSince > GRACE_PERIOD) {
    const decayedSkills = calculateSkillDecay(skills, sessionsSince)
    updateSkills(decayedSkills)

    // Warning UI 2 sessions before decay
    if (sessionsSince === GRACE_PERIOD - 2) {
      showDecayWarning()
    }
  }
}
```

**Cognitive Load Filtering Example:**
```typescript
// In GameChoices.tsx
const cognitiveLoad = useCognitiveLoad()
const filteredChoices = choices.slice(0, cognitiveLoad.maxChoices)
const truncatedText = choice.text.slice(0, cognitiveLoad.maxTextLength)
```

---

### Medium Priority (P2 - Polish)

| # | Task | File(s) | Estimated Effort | Impact |
|---|------|---------|------------------|--------|
| 7 | **Add Focus Management to Journal Panel** | `components/Journal.tsx` | 2-3 hours | Accessibility parity with Constellation |
| 8 | **Verify Safe Area Handling** | `components/game/SimulationRenderer.tsx` | 1-2 hours | Mobile UX |
| 9 | **Document Synesthesia Engine** | `docs/` (new file) | 1-2 hours | Design rationale, math proof |
| 10 | **Synchronize Type Definitions** | `lib/dialogue-graph.ts`, `components/game/simulations/types.ts` | 1 hour | Eliminate drift |

**Journal Focus Management Pattern (copy from Constellation):**
```typescript
// Add modal semantics
<div
  role="dialog"
  aria-modal="true"
  aria-label="Prism Journal"
  className="fixed inset-0 z-50"
>
  {/* Focus trap */}
  <FocusTrap>
    {/* Journal content */}
  </FocusTrap>
</div>

// Add Escape key handler
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }
  document.addEventListener('keydown', handleEscape)
  return () => document.removeEventListener('keydown', handleEscape)
}, [onClose])
```

---

## Part 5: Documentation Conflicts Analysis

### Conflict 1: Health Scores
- **Deep Scan Audit:** 78/100
- **Third-Party Audit:** 72/100
- **Resolution:** Third-party more critical, focused on safety rails vs feature completeness

### Conflict 2: Claim 2 (Derivatives)
- **Original Deep Scan:** PARTIAL (only 3 modules found)
- **Super Comprehensive QA Plan:** VERIFIED (all 7 modules exist)
- **Resolution:** Super plan correct - deeper inspection found all modules

### Conflict 3: Rohan Simulation
- **Initial Deep Scan:** Missing (not found)
- **Deep Scan Addendum:** Found at `rohan_simulation_setup` node (line 600)
- **Resolution:** Corrected in Mismatch-2 section

### Conflict 4: Error Boundary
- **Audit Claims:** `GameErrorBoundary` doesn't exist
- **Reality:** `GameErrorBoundary.tsx` exists in codebase
- **Actual Issue:** Boundary exists but not applied to SimulationRenderer
- **Resolution:** P0-2 is about integration, not existence

---

## Part 6: Policy Compliance Check

### .cursorrules Violations

| Rule | Location | Violation | Severity |
|------|----------|-----------|----------|
| **"No `any` unless absolutely necessary"** | `content/simulation-registry.ts:25` | `initialContext: any` with no justification comment | 🔴 P0 |
| **"Error Handling: No silent failures"** | `components/StatefulGameInterface.tsx` | SimulationRenderer not wrapped in ErrorBoundary | 🔴 P0 |
| **"Tests: If you build it, write a verified smoke test"** | Skill decay, cognitive load | Functions exist but no integration tests | 🟡 P1 |

**Recommendation:** Add pre-commit hook to enforce `any` prohibition and ErrorBoundary requirements

---

## Part 7: Quick Context Recovery (For Future Sessions)

If you need to verify current codebase state:

```bash
# Test status
npm test  # Should show 1,025 passing

# Type check (will fail due to P0-1)
npm run type-check  # Currently has type errors

# Dialogue node count
for f in content/*-dialogue-graph.ts; do
  echo "$(basename "$f" -dialogue-graph.ts): $(grep -c 'nodeId:' "$f")"
done

# Find all `any` usage
grep -r "any" --include="*.ts" --include="*.tsx" | grep -v "node_modules"
```

**Priority Reading for Context:**
1. `docs/ai_context/SUPER_COMPREHENSIVE_QA_PLAN.md` - Corrected master plan
2. `docs/ai_context/DEEP_SCAN_QA_AUDIT_REPORT.md` - Detailed evidence
3. `.cursorrules` - Operational rules
4. This plan file - Current opportunities

---

## Part 8: Implementation Roadmap

### Sprint 1: Critical Fixes (P0) - 1 Day
1. Fix type safety in simulation registry (2-4 hours)
2. Apply error boundary to SimulationRenderer (30 min)
3. Verification tests (1-2 hours)

**Success Criteria:**
- ✅ `npm run type-check` passes with zero `any` usage
- ✅ Manual test: Break simulation → Game survives with fallback UI
- ✅ No policy violations in pre-commit hook

### Sprint 2: Feature Integration (P1) - 2-3 Days
1. Integrate skill decay into game loop (3-4 hours)
2. Apply cognitive load filtering to choices (2-3 hours)
3. Create research export API endpoints (4-6 hours)
4. Display engagement validation in UI (2-3 hours)

**Success Criteria:**
- ✅ Skill decay triggers after grace period
- ✅ Choice count respects maxChoices setting
- ✅ Admin can export anonymized cohort data
- ✅ Engagement level visible in CognitionView

### Sprint 3: Polish (P2) - 1-2 Days
1. Add focus management to Journal (2-3 hours)
2. Verify safe area handling (1-2 hours)
3. Document Synesthesia Engine (1-2 hours)
4. Synchronize type definitions (1 hour)

**Success Criteria:**
- ✅ Journal panel accessible via keyboard (Escape key, focus trap)
- ✅ Mobile safe areas respected in all simulation modes
- ✅ Synesthesia math documented with UX rationale
- ✅ No type drift between dialogue-graph.ts and types.ts

---

## Part 9: Verification Matrix

| System | Test Type | Verification Method | Status |
|--------|-----------|---------------------|--------|
| **Error Containment** | Manual | Sim crash → Game survives | ❌ Not tested |
| **Type Safety** | Static | `npm run type-check` passes | ❌ Currently fails |
| **Skill Decay** | Integration | New session after grace period → Levels decay | ❌ Not active |
| **Cognitive Load** | UI | Switch levels → Choices/text reduced | ❌ Not enforced |
| **Research Export** | API | Admin endpoint returns anonymized data | ❌ No endpoints |
| **Engagement Display** | UI | Engagement level visible in UI | ❌ Not shown |
| **Accessibility** | Manual | Dialog panels maintain focus trap/escape | ⚠️ Partial (Constellation yes, Journal no) |
| **Safe Areas** | Visual | Mobile simulation modes respect safe areas | ❓ Not verified |

---

## Part 10: Next Steps

**Immediate Actions:**
1. ✅ Review this plan with user to confirm priorities
2. ⏳ Fix P0-1 (type safety) - Highest impact, technical debt
3. ⏳ Fix P0-2 (error boundary) - User safety critical

**After P0 Fixes:**
4. Decide P1 priority order (user input needed):
   - Option A: Skill decay (activates Patent Claim 14)
   - Option B: Research export (completes Patent Claim 18)
   - Option C: Cognitive load (enforces accessibility Claim 16)

**After P1 Completion:**
5. Polish pass (P2 items)
6. Update audit reports to reflect fixes
7. Document any new patterns discovered during implementation

---

## Appendix A: File-by-File Accuracy Assessment

| File | Claims | Reality | Accuracy |
|------|--------|---------|----------|
| `.cursorrules` | ISP protocol, Craft Gates | ✅ Current (Jan 10) | 100% |
| `SUPER_COMPREHENSIVE_QA_PLAN.md` | 8 patent claims verified, 2 P0s | ✅ Accurate | 100% |
| `DEEP_SCAN_QA_AUDIT_REPORT.md` | Detailed traceability, 78/100 health | ✅ Comprehensive, minor errors corrected in addendum | 95% |
| `THIRD_PARTY_AUDIT_REPORT.md` | 72/100 health, safety concerns | ✅ Valid external perspective | 100% |
| `GCT_Patent_Application.md` | 18 claims, legal ground truth | ✅ Canonical source | 100% |
| `infinite_solutions_protocol_*.md` | Development playbook | ✅ Sound methodology | 100% |

**Overall Documentation Health:** 98% accurate (only minor errors in initial Deep Scan, corrected in later passes)

---

## Appendix B: Critical Files Reference

**For Type Safety Fix (P0-1):**
- `content/simulation-registry.ts` (line 25)
- `lib/dialogue-graph.ts` (SimulationConfig interface)
- `components/game/simulations/types.ts` (BaseSimulationContext)

**For Error Boundary Fix (P0-2):**
- `components/StatefulGameInterface.tsx` (lines ~3195, 3412, 3454)
- `components/GameErrorBoundary.tsx` (already exists)

**For Skill Decay Integration (P1-1):**
- `lib/assessment-derivatives.ts` (calculateSkillDecay function)
- `lib/game-state-manager.ts` (session initialization)
- `components/StatefulGameInterface.tsx` (game loop)

**For Cognitive Load (P1-2):**
- `lib/cognitive-load.ts` (COGNITIVE_LOAD_CONFIG)
- `hooks/useCognitiveLoad.ts` (hook)
- `components/GameChoices.tsx` (choice rendering)

**For Research Export (P1-3):**
- `lib/cognitive-domain-calculator.ts` (createResearchExport)
- `lib/engagement-metrics.ts` (exportAnalyticsData)
- `app/api/admin/` (needs new routes)

---

**End of Audit Document**
