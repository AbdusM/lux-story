# User Inputs and Requirements Compilation

**Date:** November 21, 2025
**Session Goal:** Systematically audit and enhance the narrative engine, data pipelines, and UX to ensure deep pedagogical integration and robust functionality.

---

## 1. Core Mandates & Design Principles
*   **Safety & Efficiency:** Prioritize user control and system stability.
*   **Project Conventions:** Adhere strictly to existing style, structure, and frameworks.
*   **Idiomatic Changes:** Ensure modifications integrate naturally with the codebase.
*   **"No Lip Service":** Avoid shallow implementations; ensure deep, systemic integration of learning objectives and narrative consequences.
*   **"Chocolate-Covered Broccoli" Avoidance:** Educational content must be diegetic and immersive, not intrusive or "tutorial-like."

## 2. Specific User Inputs & Requirements

### A. Narrative & Content
*   **"Ghost" Objectives:** Fix the disconnect between defined Learning Objectives and the narrative graph. Ensure objectives are actually triggered by gameplay.
*   **"Happy Path" Bias:** Address the lack of depth in "failure" or "early exit" paths. Ensure these paths are valid learning experiences, not just dead ends.
*   **Samuel's Role:** Elevate Samuel from a menu system to a "Kolb Cycle Guide" and mentor. He must facilitate Reflection (Stage 2) and Abstract Conceptualization (Stage 3).
*   **Character Arcs:** Apply fixes and standards across *all* characters (Maya, Devon, Jordan), not just one.
*   **Diegetic Synthesis:** Ensure prompts for synthesis (Action Plans) are delivered in-character (by Samuel), not as meta-instructions.

### B. Data & Analytics
*   **Data Integrity:** Eliminate "mock" data. Ensure dashboards reflect real user choices and system state.
*   **Birmingham Relevance:** Move beyond static flavor text. Implement dynamic scoring (`localAffinity`) based on user interaction with local keywords.
*   **Persistence:** Ensure robust data saving, including cloud sync (`useBackgroundSync`) and local fallbacks.
*   **Action Plan:** Implement a persistent "Action Plan" feature that bridges the narrative experience with concrete future goals.

### C. UX & Interface
*   **Feedback Loops:** replace "flat" UX with subtle, immersive feedback (e.g., "Narrative Feedback" toasts) when skills are demonstrated.
*   **Pacing:** Standardize "chat pacing" (typewriter effect) for high-stakes moments to improve readability and emotional weight.
*   **Accessibility:** Remove `userScalable: false` to ensure mobile accessibility.
*   **Sync Visibility:** Add a "Sync Status" indicator to give users confidence in data persistence.

### D. Cognitive Science Integration
*   **Limbic Learning:** Validate emotional choices as professional skills (via `FrameworkInsights`).
*   **Memory Encoding:** Use the Action Plan and Samuel's reflections to reinforce long-term retention.
*   **Synthesis:** Ensure the system actively prompts users to synthesize their learning into actionable goals.

---

## 3. Current Implementation Status (Self-Reported)

| Requirement | Status | Implemented Solution |
| :--- | :--- | :--- |
| **Fix Ghost Objectives** | ✅ Complete | Wired `learningObjectives` to graph nodes for all 3 characters. |
| **Map "Failure" Paths** | ✅ Complete | Added tracking to `early_gratitude` & `system_failure`; added Samuel reflections for these states. |
| **Samuel as Kolb Guide** | ✅ Complete | Implemented reflection gateways, meta-objectives (`reflective_observation`), and wisdom nodes. |
| **Diegetic Prompts** | ✅ Complete | Refined Samuel's dialogue to introduce the Action Plan naturally. |
| **Data Integrity** | ✅ Complete | Created `monitor-data-integrity.ts` script; verified real data flow. |
| **Birmingham Score** | ✅ Complete | Implemented `localAffinity` tracking in `SimpleCareerAnalytics`. |
| **Cloud Persistence** | ✅ Complete | Added `api/user/action-plan` route; updated `ActionPlanBuilder` to sync. |
| **Narrative Feedback** | ✅ Complete | Created `NarrativeFeedback` component; integrated into `StatefulGameInterface`. |
| **Standardized Pacing** | ✅ Complete | Applied `useChatPacing: true` to all climax/reveal nodes across all arcs. |
| **Accessibility** | ✅ Complete | Removed `userScalable: false` from `layout.tsx`. |

---

## 4. "Devil's Advocate" Audit Targets
*   **Depth of Failure Integration:** Is the ~40% coverage of failure paths sufficient, or does it still leave significant "dead zones"?
*   **Samuel's Logic:** Does Samuel's reflection logic *truly* account for complex, mixed states (e.g., high trust but failed objective), or is it binary?
*   **Action Plan Utility:** Is the Action Plan actually useful, or just a text dump? Does it connect back to the specific skills demonstrated?
*   **Framework Insights:** Are the "insights" generic, or do they dynamically reflect the user's *specific* gameplay patterns?
