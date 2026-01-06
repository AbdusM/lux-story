# Lux Story: Game Capabilities Audit (v1.0)

**Date**: 2030-05-15 (Simulated)
**Status**: Verified & Locked
**Architecture**: The Worldbuilding OS (Hybrid Narrative/Simulation Engine)

---

## 1. Core Architecture: "The Hybrid Engine"
The game is built on a unique **"Heart & Hands"** philosophy, separating narrative depth from mechanical interaction.

| Component | Function | Status |
| :--- | :--- | :--- |
| **StatefulGameInterface.tsx** | **The Controller**. Manages the game loop, UI state, and transition logic. Integrates `Zustand` store with React state. | ✅ **Active** |
| **DialogueGraphNavigator** | **The Heart**. A graph-based narrative engine that handles branching, state checks, and NPC logic. | ✅ **Active** |
| **SimulationRenderer.tsx** | **The Hands**. A modular simulation container that renders 10+ types of interactive "Job Simulations". | ✅ **Active** |
| **2030 Skills System** | **The Brain**. A background tracking system that maps player choices to real-world career skills. | ✅ **Active** |

> [!NOTE]
> For the authoritative technical definition of state flow and ownership, see: [`STATE_ARCHITECTURE.md`](./STATE_ARCHITECTURE.md) (Rescued from codebase).


---

## 2. Advanced Narrative Features (The "Secret Sauce")
The engine supports several advanced RPG mechanics inspired by genre classics, fully implemented in TypeScript.

### A. The "Disco" Mechanics (Psychological Depth)
*   **Pattern Voices**: Inspired by *Disco Elysium*. The player's dominant stats (Analytical, Helping, etc.) "speak" to them via inner monologue (`pattern-voice-library.ts`).
*   **Pattern Reflection**: NPCs dynamically alter their dialogue based on the player's dominant trait (e.g., Samuel treats you differently if you are high `Analytical`).

### B. The "Bioware" Mechanics (Cinematic Agency)
*   **Interrupt Windows**: Inspired by *Mass Effect 2*. Real-time "Quick Time Events" during dialogue (e.g., "Reach out and comfort her") that appear briefly on screen.
*   **Gated Choices**: Inspired by *KOTOR*. Some choices are visible but "Locked" until specific stat thresholds (`OrbFill`) are met.

### C. The "System" Mechanics (Metagame)
*   **The Loop**: A "New Game+" mechanic built into the narrative (`ng_plus_1` flag). The game remembers previous runs (Sector 3).
*   **Ambient Events**: The station "breathes" when the player is idle, showing atmospheric text based on location and current stats.

---

### F. Immersion & Feedback System (New)
*   **Spec**: [`IMMERSION_SYSTEM_SPEC.md`](./IMMERSION_SYSTEM_SPEC.md)
*   **Core Mechanic**: "Consequence Echoes" — narrative feedback loops that replace "toast notifications" for trust changes.
*   **Design Goal**: Ensure the player feels "seen" by the game through subtle NPC micro-expressions and pattern-aware dialogue variants.

## 3. The Worldbuilding OS (Content Structure)
The game uses a "Worldbuilding as Code" approach where narrative content is structured like a database.
*   **Source of Truth**: [`lib/graph-registry.ts`](../../lib/graph-registry.ts) maintains the master index of all 16 characters and their locations.
*   **Templates**: [`CHARACTER_ARC_STRUCTURE.md`](../00_CORE/templates/CHARACTER_ARC_STRUCTURE.md) defines the rigid 4-Act structure (Intro, Crossroads, Challenge, Insight) for all 35-node arcs.
*   **Fractals**: The content is organized into "Fractals"—self-contained, infinitely deep sectors.

| Sector | Theme | Core Mechanic | Key Career Skill |
| :--- | :--- | :--- | :--- |
| **Sector 0: Station Entry** | "The Threshold" | **Discovery** | `Emotional Intelligence` |
| **Sector 1: Grand Hall** | "The Facade" | **Reality Switching** (AR Lens) | `Systems Thinking` |
| **Sector 2: Market** | "The Exchange" | **Trust Economy** (Information Trading) | `Financial Literacy` |
| **Sector 3: Deep Station** | "The Source" | **Recursion** (The Loop) | `Visionary Thinking` |

### The Cast (Complete Roster)
A full matrix of the 16 characters and their associated pedagogical functions.

| Character | Role | Faction | Associated Career / Skill |
| :--- | :--- | :--- | :--- |
| **Samuel** | The Conductor | Independent | **Learning Experience Architect** |
| **Maya** | The Burnout | Technocrat | **Healthcare Tech** (`triage`) |
| **Marcus** | The System | Technocrat | **Cybersecurity** (`patternRecognition`) |
| **Kai** | The Architect | Naturalist | **Sustainable Construction** (`systemsThinking`) |
| **Rohan** | The Question | Naturalist | **Community Data** (`criticalThinking`) |
| **Jordan** | The Voice | Independent | **Crisis Management** (`communication`) |
| **Asha** | The Vision | Creative | **Creative Entrepreneur** (`creativity`) |
| **Devon** | The Fix | Technocrat | **Prompt Engineering** (`technicalLiteracy`) |
| **Lira** | The Silence | Independent | **Audio/Media Production** (`listening`) |
| **Zara** | The Bias | Technocrat | **Data Analysis** (`dataInsights`) |
| **Elena** | The Truth | Historian | **Archival Science** (`informationLiteracy`) |
| **Grace** | The Caretaker | Medical | **Nursing/Triage** (`empathy`) |
| **Alex** | The Rat | Outlier | **Advanced Logistics** (`adaptability`) |
| **Tess** | The Broker | Market | **FinTech** (`financialLiteracy`) |
| **Yaquin** | The Oracle | Outlier | **astrophysics** (`observation`) |
| **Silas** | The Wall | Security | **Public Safety** (`riskManagement`) |


---

## 4. The Simulation Suite ("The Hands")
The engine includes a modular `SimulationRenderer` that handles 10 specific job-related interactive modes, embedded directly into the narrative flow.

| Simulation Type | Interaction Style | Pedagogical Goal |
| :--- | :--- | :--- |
| **Terminal Coding** | Command Line Interface | Python/JS Syntax & Logic |
| **System Architecture** | Drag-and-Drop Canvas | Systems Thinking & Design |
| **Dashboard Triage** | Real-time Data Grid | Prioritization & Crisis Mgmt |
| **Chat Negotiation** | Branching Messenger | Emotional Intelligence |
| **Prompt Engineering** | AI Chat Interface | Iterative Refinement |
| **Data Analysis** | Interactive Charts | Pattern Recognition |
| **Creative Direction** | Visual Selection Tool | Aesthetic Judgment |
| **Audio Studio** | Waveform Editor | Listening & Timing |
| **Code Refactor** | Diff Viewer | Optimization & Readability |
| **Visual Canvas** | Spatial Layout | Spatial Reasoning |

---

## 5. The Mechanics of Growth (Meta-Game)
Beyond simple XP, the game uses three invisible systems to track detailed psychological growth.

### A. The Orb System (Ability Unlocks)
*   **Logic**: Tracks 5 granular playstyles (`Analytical`, `Patience`, `Exploring`, `Helping`, `Building`).
*   **Status**: ⚠️ **Refactoring**. Current unlocks are non-functional.
*   **Fix**: Implementing the **Insight System** (Hades-style mirror) defined in [`PROGRESSION_SYSTEM_SPEC.md`](./PROGRESSION_SYSTEM_SPEC.md).
*   **Source**: `lib/unlock-manager.ts`


### B. The Thought Cabinet (Intellectual Identity)
*   **Logic**: Narrative choices trigger "Thoughts" (e.g., "The Burden of Command", "The Glitch").
*   **Progression**: Thoughts start as "Developing" and become "Internalized" over time, permanently altering the player's stat bonuses and available choices.
*   **Source**: `lib/thought-system.ts`

### C. The Delayed Gift System (Ripple Effects)
*   **Logic**: A sophisticated "Karma Engine" that tracks choices and surfaces them *later* and *elsewhere*.
*   **Example**: Encouraging Maya in Sector 1 might cause Samuel to thank you in Sector 3 (via `GIFT_TRIGGERS`).
*   **Mechanism**: Uses a `interactionsRemaining` ticker to ensure consequences feel organic and time-delayed, protecting the "Magic Circle."
*   **Source**: `lib/delayed-gifts.ts`

---

## 6. The "Stealth Career Simulator" (Skills)
The game ostensibly tracks "RPG Stats" but actually tracks **2030 Future Skills**.

*   **Logic**: Every choice awards points (~0.1 to 1.0) in categories like `criticalThinking`, `adaptability`, `coding`.
*   **Careers**: These skills map to 6 specific **Birmingham-Ready Career Paths**:
    1.  **Sustainable Construction** (Kai)
    2.  **Healthcare Tech** (Maya)
    3.  **Cybersecurity** (Marcus)
    4.  **Community Data Analyst** (Rohan)
    5.  **FinTech Entrepreneur** (Tess)
    6.  **Advanced Logistics** (Alex)

---

## 7. Future & Dormant Capabilities
While this audit covers *active* systems, several advanced backend features exist in a dormant state, documented in [DORMANT_CAPABILITIES_AUDIT.md](../01_MECHANICS/DORMANT_CAPABILITIES_AUDIT.md).

*   **Chemistry Engine**: A "Nervous System" simulator that tracks stress/calm (`lib/emotions.ts`).
*   **Platform Evolution**: A system for platform-specific affinity (Warmth/Resonance).
*   **Mystery State Machine**: A tracking system for the 4 meta-mysteries.

These systems are code-complete but currently disabled in the UI to prioritize the "No Overlay" design philosophy ([EXPEDITION33_DESIGN_SYNTHESIS.md](../03_PROCESS/EXPEDITION33_DESIGN_SYNTHESIS.md)).

## 8. Technical Stack
*   **Frontend**: React (Next.js), Tailwind CSS, Framer Motion (Animations).
*   **State**: Zustand (Store), localStorage (Persistence).
*   **Logic**: TypeScript (Strict Typing for all Nodes/Choices).
*   **Assets**: Minimalist SVG Icons (Lucide), CSS Gradients (No heavy assets).

## 9. Alignment with Active Roadmap (Polish Sprint)
The current [POLISH_SPRINT_PLAN.md](../03_PROCESS/POLISH_SPRINT_PLAN.md) addresses specific enhancements to the audited systems:

### A. State Architecture Hardening
*   **Goal**: Centralize "Sources of Truth" (Rules: `lib/constants.ts`, State: `character-state.ts`).
*   **Status**: ✅ **Partially Completed**. `lib/emotions.ts` and `lib/identity-system.ts` safety checks are live. `lib/constants.ts` consolidation is still pending.
*   **Note**: The [POLISH_SPRINT_PLAN.md](../03_PROCESS/POLISH_SPRINT_PLAN.md) is slightly stale; always verify against code first.


### B. Skill UX Deepening
*   **Goal**: Transform skill feedback from "Information" to "Progression".
*   **Features**: Mastery Bars, Smart Unlock Hints, Cluster Badges (Spec: `SKILL_MODAL_ENHANCEMENT.md`).

### C. "Iceberg" Verification
*   **Goal**: Ensure the "90% Invisible" rule from the Design Doc is respected.
*   **Validation**: The Code Audit confirms that most complexity (Chemistry, Trusts) remains backend-only, matching the [LIVING_DESIGN_DOCUMENT.md](../00_CORE/LIVING_DESIGN_DOCUMENT.md) vision.

## 10. Critical Reality Check (The "Lost Artifacts" Analysis)
To balance the architectural view, we incorporate findings from the "Critical Conscience" documents found in `docs/00_CORE/critique/`. These audits provide the necessary skepticism to ensure robust development.

### A. The "Iceberg Problem" (UX)
*   **Source**: [FIVE_LENSES_AUDIT_DEC2024.md](../00_CORE/critique/FIVE_LENSES_AUDIT_DEC2024.md)
*   **Finding**: 60% of the game's value (Career Matching, sophisticated Pattern Tracking) is hidden below the surface.
*   **Risk**: "Progressive Paralysis" — empty states (Journal, Thoughts) feel broken rather than mysterious.
*   **Action**: The **Polish Sprint** must prioritize "Teaser States" over "Empty States".

### B. System Efficiency vs. Vestigial Code (Tech)
*   **Source**: [CHOICE_CONSEQUENCE_PHILOSOPHY.md](../00_CORE/critique/CHOICE_CONSEQUENCE_PHILOSOPHY.md) & [BLOAT_AUDIT.md](../00_CORE/critique/BLOAT_AUDIT.md)
*   **Finding**: The **Skills System** is currently "Dead Code" — tracked in metadata but never used in logic.
*   **Finding**: The **Trust System** is 100% active, but **Pattern Tracking** suffers from "Silent Tracking" (only 4% of patterns are acknowledged by NPCs).
*   **Action**: Explicitly deprecate the "Skills" metadata in favor of the "Pattern" system, which drives the core narrative engine.

### C. Narrative Integrity (Content)
*   **Source**: [FAKE_CHOICE_AUDIT_DEC15.md](../00_CORE/critique/FAKE_CHOICE_AUDIT_DEC15.md)
*   **Finding**: Identification of "Narrative Funnels" where distinct choices force identical outcomes (e.g., Samuel Introduction).
*   **Action**: Adopt the "Milestone Acknowledgment" philosophy — ensure distinct choices receive distinct *reactions* even if the *destination* converges.

### D. Visual Roots
*   **Source**: [`patient_centered_data.md`](../../docs/reference/research/patient_centered_data.md)
*   **Insight**: The interface's aesthetic (Dashboard, Timeline, Data Density) is directly derived from research into **Emergency Room Clinical Dashboards**. This links the game's visual identity to the "Medical Tech" reality of its creators.

### E. Technical Health (Stability)
*   **Source**: [`DEVIL_ADVOCATE_AUDIT_OCT23.md`](../00_CORE/critique/DEVIL_ADVOCATE_AUDIT_OCT23.md)
*   **Finding**: Historical audit identified "Over-Engineering" risks in the LinkDap integration and module resolution fragility.
*   **Action**: Maintain strict separation of concerns to prevent regression to the "Broken State" of Oct 2025.

## 11. The Deep Foundation (Reference Library)
These documents represent the "Soul" and "Science" of the project, rescued from the archives.

*   **Game Theory**: [`RPG_SYSTEMS_ANALYSIS.md`](../../docs/reference/research/RPG_SYSTEMS_ANALYSIS.md) (Detailed analysis of BG3, Disco Elysium, Witcher 3 mechanics).
*   **Cognitive Science**: [`NEUROSCIENCE_FRAMEWORK.md`](../../docs/reference/research/NEUROSCIENCE_FRAMEWORK.md) (Polyvagal Theory, Limbic Learning).
*   **Narrative Design**: [`GROUNDED_MYTH_SPEC.md`](../00_CORE/critique/GROUNDED_MYTH_SPEC.md) (The 70/30 Reality/Myth rule).


## 12. Conclusion

The system is a fully realized **"EdTech Trojan Horse."** It plays like a high-fidelity Sci-Fi RPG but functions as a sophisticated career assessment tool. By acknowledging the "Iceberg Problem" and focusing on the active Trust/Pattern systems (while pruning the vestigial Skills code), we ensure the "Trojan Horse" actually delivers its payload.
