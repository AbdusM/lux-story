# Implementation Plan - P0 Critical Fixes

**Ref:** `docs/03_PROCESS/plans/P0_FIX_HANDOFF_JAN2026.md`
**Goal:** Resolve 2 Critical P0 Blockers (Type Safety Risk & Runtime Crash Risk).

## 1. Safety & Stability (P0)

### 1.1 Type Safety: Discriminated Unions for Simulations
**Problem:** `content/simulation-registry.ts` uses `initialContext: any`, bypassing type checks for complex simulation patterns.
**Fix:** Define a strict Discriminated Union `SimulationDefaultContext` and apply it to the registry.

#### [MODIFY] [types.ts](file:///Users/abdusmuwwakkil/Development/30_lux-story/components/game/simulations/types.ts)
- Add `SynesthesiaContext`, `BotanyContext`, `TriageContext`, `CanvasContext`, etc. covering ALL variants.
- Export `SimulationDefaultContext` union.
- **Deep Fix:** Update `SimulationConfig` to use `type: SimulationType` (currently `string`), enforcing the union across the board.

#### [MODIFY] [simulation-registry.ts](file:///Users/abdusmuwwakkil/Development/30_lux-story/content/simulation-registry.ts)
- Import `SimulationDefaultContext` and `SimulationType`.
- Update `SimulationDefinition`:
    - `type: SimulationType` (Was `string`)
    - `defaultContext: SimulationDefaultContext` (Was `any`)
- **Coverage Guarantee:** This forces the compiler to validate ALL 20 character entries.

### 1.2 Error Containment: Simulation Integrity
**Problem:** A crash in a simulation (e.g. `MediaStudio` math error) breaks the entire Game UI.
**Fix:** Wrap the renderer in a localized Error Boundary.

#### [MODIFY] [StatefulGameInterface.tsx](file:///Users/abdusmuwwakkil/Development/30_lux-story/components/StatefulGameInterface.tsx)
- Import `GameErrorBoundary`.
- Wrap all instances of `<SimulationRenderer>` with `<GameErrorBoundary fallback={...}>`.

## 2. Coverage Verification Matrix (The "Deep" Check)
We ensure NO character is left behind by mapping every ID to a strict Type.

| Character | Sim Type | Context Type | Status |
| :--- | :--- | :--- | :--- |
| **Lira** | `audio_studio` | `SynesthesiaContext` | ✅ Covered |
| **Nadia** | `news_feed` | `SynesthesiaContext` | ✅ Covered |
| **Tess** | `botany_grid` | `BotanyContext` | ✅ Covered |
| **Maya** | `system_architecture` | `BaseContext` | ✅ Covered |
| **Kai** | `visual_canvas` | `BaseContext` (Blueprint) | ✅ Covered |
| **Asha** | `visual_canvas` | `BaseContext` (Art) | ✅ Covered |
| **Rohan** | `visual_canvas` | `BaseContext` (Star Map) | ✅ Covered |
| **Jordan** | `architect_3d` | `BaseContext` | ✅ Covered |
| **Marcus** | `dashboard_triage` | `BaseContext` (Triage) | ✅ Covered |
| **Grace** | `dashboard_triage` | `BaseContext` (Medical) | ✅ Covered |
| **Silas** | `dashboard_triage` | `BaseContext` (Soil) | ✅ Covered |
| **Isaiah** | `dashboard_triage` | `BaseContext` (Logistics) | ✅ Covered |
| **Elena** | `market_visualizer` | `BaseContext` | ✅ Covered |
| **Zara** | `data_audit` | `BaseContext` | ✅ Covered |
| **Yaquin** | `historical_timeline` | `BaseContext` | ✅ Covered |
| **Samuel** | `conductor_interface` | `BaseContext` | ✅ Covered |
| **Devon** | `conversation_tree` | `BaseContext` | ✅ Covered |
| **Alex** | `chat_negotiation` | `BaseContext` | ✅ Covered |
| **Dante** | `chat_negotiation` | `BaseContext` | ✅ Covered |
| **Quinn** | `creative_direction` | `BaseContext` | ✅ Covered |

*All 20/20 characters are strictly mapped. If `npm run type-check` passes, the coverage is 100% complete.*

## 3. Verification & Regression Testing Protocol

### 2.1 Automated Regression (The "Do No Harm" Check)
Run the full suite to ensure core logic remains intact.
```bash
# 1. Type Integrity Check (Must recognize new unions)
npm run type-check

# 2. Logic Regression (1,025 tests)
# Covers: Dialogue Traversal, State Management, Asset Loading
npm test
```

### 2.2 Manual Regression (The "Core Loop" Check)
Since we are touching the `SimulationRenderer`, we must verify existing paths:

1.  **Maya's Introduction (System Architecture):**
    *   Load Game (or Start New).
    *   Navigate to Maya.
    *   Trigger "Servo Debugger".
    *   **Pass Criteria:** Simulation loads, text displays code style, success triggers.

2.  **Kai's Blueprint (Visual Canvas):**
    *   Navigate to Kai.
    *   Trigger "Safety Blueprint".
    *   **Pass Criteria:** Blueprint variant renders, no crash.

3.  **Lira's Audio (New Type):**
    *   Navigate to Lira.
    *   Trigger "Harmonic Visualizer".
    *   **Pass Criteria:** `MediaStudio` loads, audio wave animates.

### 2.3 Safety Verification (The "Crash" Check)
1.  **Simulate Failure:**
    *   Temporarily add `throw new Error("Crash Test")` in `MediaStudio.tsx`.
2.  **Trigger:** Start Lira's simulation.
3.  **Verify:**
    *   Game does **NOT** crash (White Screen).
    *   Fallback UI appears: "Simulation Offline".
    *   Player can click "Leave" or navigate away.
4.  **Revert:** Remove the error.

## 3. User Review Required
-   **Strictness:** This change forces strict types on all future simulations. New simulations *must* define a context interface in `types.ts`.
-   **Fallback UI:** The error boundary shows a simple "Simulation Offline" message. Is this acceptable? (Yes, per handoff).
