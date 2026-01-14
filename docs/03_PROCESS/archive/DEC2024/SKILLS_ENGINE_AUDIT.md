# Skills Engine & Scientific Grounding Audit

## Executive Summary
**Status:** ⚠️ Needs Calibration
**Verdict:** The skill engine is sophisticated and evidence-based, but the *data entry* (mappings) needs to be updated to reflect the new "Soul Injection" failure states. The scientific grounding is generally strong, but some new scenarios need fact-checking against real-world protocols.

**Critical Gap:** The new "Failure States" (e.g., `maya_robotics_fail_burnout`) are NOT yet mapped in `SCENE_SKILL_MAPPINGS`. This means players who fall into the traps won't get credit for the *learning* that comes from failure.

---

## 1. Skill Alignment Audit

### ✅ Strong Alignments
*   **Maya's Hybrid Path:** Correctly maps to `problemSolving` and `creativity`. The context ("Synthesized conflicting passions") is accurate.
*   **Devon's Empathy Reframe:** Correctly maps `emotionalIntelligence` to the realization that "empathy is data."
*   **Jordan's Crossroads:** Correctly distinguishes between `leadership` (Internal Choice) and `adaptability` (Birmingham Choice).

### ⚠️ Misalignments / Gaps (Action Required)
*   **The "Trap" Choices:**
    *   *Example:* `debug_voltage` in Maya's arc is tagged `analytical` in the graph, but it's *wrong*.
    *   *Risk:* The system currently rewards this as a "valid" analytical choice. It should probably be tagged with a lower intensity or a specific "Learning from Failure" context in `SCENE_SKILL_MAPPINGS`.
*   **Missing New Characters:** `SCENE_SKILL_MAPPINGS` completely lacks entries for **Kai**, **Rohan**, **Silas**, **Marcus**, **Tess**, and **Yaquin**.
    *   *Impact:* 60% of the game's content is currently untracked by the high-fidelity skill system. It falls back to the basic keyword scraper (`2030-skills-system.ts`), which is far less accurate.

---

## 2. Scientific Grounding Audit

### ✅ Verified Concepts
*   **ECMO (Marcus):** "Air in line -> Vapor Lock -> Stroke" is accurate. The time pressure (1.5s) is realistic for arterial line air embolism.
*   **Microgrid (Silas):** "kW Deficit" and "Priority Load Shedding" are accurate engineering principles.
*   **Ransomware (Rohan):** "Backup Encrypted via SMB" is a classic lateral movement pattern (e.g., WannaCry, Ryuk).

### ⚠️ Nitpicks (For Polish)
*   **Maya's Servo:** "Voltage Regulator" check causing immediate burnout is plausible but slightly "Hollywood." A real servo burnout usually happens from stalled torque (mechanical block), not checking voltage.
    *   *Fix:* Change text to "Force the servo to zero position" (Mechanical stall).
*   **Devon's Spectral Analysis:** "140Hz tremor" is techno-babble.
    *   *Fix:* Change to "Pitch variance / Micro-tremors" (Vocal biomarkers are real, but specific Hz is made up).

---

## 3. Player Engagement (Feedback Loops)

### Strengths
*   **Context, Not Scores:** The system stores *stories* ("Reframed parental sacrifice..."), not just numbers. This is excellent for the "Career Portfolio" output.
*   **Pattern Recognition:** Tracking "Patterns" (Building, Helping, etc.) aligns well with the narrative themes.

### Weaknesses
*   **Invisible Learning:** Players don't *see* the rich context strings ("Reframed parental sacrifice...") until the very end.
*   **Recommendation:** Display the "Skill Toast" with a *shortened* version of the context (e.g., "Skill Unlocked: Cultural Competence (Reframed Sacrifice)") to reinforce the learning moment immediately.

---

## Action Plan

1.  **Update `SCENE_SKILL_MAPPINGS`:** Add entries for Kai, Rohan, Silas, Marcus, Tess, and Yaquin. This is a large data entry task but essential for the "Evidence-First" promise.
2.  **Map Failure States:** Add specific mappings for the "Trap Choices" that award skills like `resilience` or `adaptability` *when the player accepts the failure* (e.g., `maya_retreat_to_safety` choice "Maybe it is a sign" -> `adaptability`).
3.  **Technical Polish:** Tweak Maya's "Voltage" text to "Force Zero" for realism.

## Code Changes Required

**File:** `lib/scene-skill-mappings.ts`
**Task:** Append 20+ new scene mappings for the new characters.

**File:** `content/maya-dialogue-graph.ts`
**Task:** Change "Check voltage" to "Force servo position" for realism.
