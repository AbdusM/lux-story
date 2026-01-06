# LUX STORY: AAA PRODUCT REQUIREMENTS DOCUMENT (PRD)
## "The Worldbuilding OS" for Career Discovery

**Version:** 1.9 (Satellite OS / Side Menu)
**Date:** January 6, 2026  
**Status:** DRAFT - Technical Vision  
**Target Quadrant:** B (High Quality / Focused) -> **Ω (Category Redefining)**

---

## 1. VISION & EXECUTIVE SUMMARY
**High Concept:** *Disco Elysium* meets *Mass Effect* in a stealth career assessment platform. 
**The Hook:** A high-fidelity sci-fi RPG where every dialogue choice, system interaction, and problem-solved invisibly tracks Future Skills defined by the World Economic Forum.

**Core Value Proposition:**
*   **For Players:** A premium, narrative-driven indie RPG experience. No "edutainment" stink.
*   **For Stakeholders:** A sophisticated psychometric instrument capable of mapping 50+ granular skills to real-world career paths.

**Strategic Positioning:**
We are targeting **Quadrant B (Focused AAA)**: High polish, 20-30 hour deep narrative campaign.
*   **Why:** Leverages our narrative strength (Writer/Designer bottleneck is manageable) vs. "Spreadsheet AAA" (Ubisoft open worlds).
*   **Risk Mitigation:** "Vertical Slice" approach first (Sector 0) to validate systems before scaling.

---

## 2. THE THREE PILLARS (CORE GAMEPLAY)
*Everything we build must support one of these three pillars. If it doesn't, it is cut.*

### Pillar 1: "The Heart" (Narrative-First Agency)
*   **Experience:** Dialogue is gameplay. Players negotiate, investigate, and bond.
*   **System:** A Graph-Based Dialogue Engine (Logic-heavy, not just trees).
*   **Key Features (Implemented & Core):**
    *   **Interrupt System:** *Mass Effect*-style physical agency.
    *   **Trust Economy:** Information is currency.
    *   **Consequence Web:** Cross-character "Echoes".

### Pillar 2: "The Hands" (Embedded Simulation)
*   **Experience:** Doing the actual work, not just talking about it.
*   **System:** Mini-Game/Simulation Layer embedded in narrative flow.
*   **Key Features:**
    *   **Loyalty Experiences:** Character-specific deep-dive missions (e.g., "The Outage" with Devon).
    *   **System Triage:** Debugging station systems.
    *   **Resource Management:** Allocating power/supplies.

### Pillar 3: "The Brain" (The 2030 Skills System)
*   **Experience:** "The game knows me better than I know myself."
*   **System:** Comprehensive tracking of 50+ weighted skill variables.
*   **Key Features (Implemented & Core):**
    *   **Thought Cabinet:** Inventory of internalized concepts.
    *   **Harmonics Interface:** Visualizing skill growth as a dynamic "Constellation".
    *   **Pattern Voices:** Inner monologues.
    *   **Career Translation:** Real-time mapping to O*NET.

---

## 3. CREATIVE TENSION & DIVERGENT UX (ISP LAYER)
*Solving contradictions to create novel gameplay.*

### A. The "Self-Awareness" Mechanic (Stealth vs. Feedback)
*   **The Solution:** **The Fog of War Assessment.**
    *   **Gameplay Loop:** Crashing the system to align subjective vs objective data.

### B. Sensory Immersion (Text vs. Feeling)
*   **The Solution:** **Synesthetic UX.**
    *   Haptics & Binaural Audio.

### C. The "Worldbuilding OS" (Game vs. Tool)
*   **The Solution:** **The Borderless Window.**
    *   Minimizes to "Tray App".

---

## 4. CONTENT STRATEGY & ROADMAP (70/20/10 RULE)

### 70% Scope: The "Station Core" (Phase 2 - IMMINENT)
**Immediate Production Deliverables (Narrative Excellence):**
*   **Marcus Arc (Crisis Management):** `stakeholder_management`, `adaptive_leadership`, `crisis_communication`.
*   **Tess Arc (Technical Leadership):** `technical_leadership`, `system_design`, `mentorship`.
*   **Yaquin Arc (Strategic Execution):** `strategic_execution`, `resource_management`, `change_management`.
*   **Samuel Hub (Mentorship):** Providing cross-arc synthesis.

### 20% Scope: "Station Life" (Breadth)
*   **"They're Waiting For You":** Return hooks.
*   **Delayed Gifts:** Payoff choices.
*   **Relationship Web:** Dynamic visualization.

### 10% Scope: "The Deep Station" (Mastery)
*   **New Game+:** Replay with different Patterns.
*   **Station Evolution:** Visual environment changes.

---

## 5. TECHNICAL ARCHITECTURE & ENGINEERING SPECIFICATIONS

### A. Dialogue System ("The Heart")
*   **Structure:** Graph-based (Nodes + Edges).
*   **Data Schema:** Standardized JSON/TS.
*   **Pipeline:** Automated validation (`validate-dialogue-graphs.ts`).

### B. Quest/Mission System
*   **Pattern:** "Event-Driven".
*   **State Machine:** `LOCKED` -> `UNLOCKED` -> `ACTIVE` -> `COMPLETED`.

### C. Character & Progression ("The Brain")
*   **Model:** Hybrid Class/Skill.
*   **Visualizer:** "Galaxy Map" style skill tree.

### D. Inventory & Loot Algorithms
*   **Data:** Component-Based Item System.
*   **Loot Logic:** Weighted Random Selection.

### E. Animation State & Fidelity
*   **State Machine:** Hierarchical (HSM) with Additive Blending.

### F. World Simulation & Density
*   **POI Distribution:** Radial Distribution Model ("Rule of 40 Seconds").
*   **NPC Scheduling:** Radiant AI Pattern.
*   **Station Evolution System:** State-driven visual layer.

### G. Performance & Streaming
*   **Strategy:** Asset Bundles / Sector Streaming.

### H. THE SATELLITE OS (SIDE MENU ARCHITECTURE)
*The "Device" through which the player interacts with their data. Must be Deeply Implemented, not just a list.*

1.  **Dashboard (Home Screen):**
    *   **Experience:** "Morning Briefing".
    *   **Features:**
        *   **Active Quest Tracker:** Only top 1 priority displayed.
        *   **Notifications:** "3 Unread Echoes", "1 New Thought Formed".
        *   **Station Status:** "Sector 2 Power: 45%" (Dynamic world state).
    *   **Implementation:** `DashboardView.tsx` aggregating disparate state slices.

2.  **Harmonics (Skills & Career):**
    *   **Experience:** "Navigating a Galaxy".
    *   **Features:**
        *   **Constellation View:** 3D rotatable graph of Patterns (Stars) and Skills (Planets).
        *   **"The Fog":** Unused skills are dimmed/blurred.
        *   **Career Projection:** Overlay showing "Code 15-1121" matches your current shape.
    *   **Implementation:** D3.js or React-Three-Fiber visualization driven by `skill-state.ts`.

3.  **Relations (Social Graph):**
    *   **Experience:** "Spy Agency Org Chart".
    *   **Features:**
        *   **Web View:** Force-directed graph showing who knows who (The "Echoes" network).
        *   **Deep Profile:** Clicking a face shows "Public Stance" (what they say) vs "Private Opinion" (unlocked by Trust).
        *   **Gift Log:** "You gave advice to Maya -> Manifested in Devon's Arc".
    *   **Implementation:** Shared `RelationshipWeb` component consuming `character-relationships.ts`.

4.  **The Mind (Thought Cabinet):**
    *   **Experience:** "Developing Photos in a Darkroom".
    *   **Features:**
        *   **Inventory:** Grid of "Unknown Thoughts" (Locked slots) vs "Active Thoughts" (Equipped).
        *   **Internalization:** Thoughts "cook" over time (in-game minutes) to become permanent buffs.
        *   **Synergy:** Certain thoughts unlock unique dialogue options (e.g., "Maker Mindset" unlocks Engineering choices).
    *   **Implementation:** `ThoughtCabinet.tsx` with timer logic in `game-loop.ts`.

5.  **Log (Legacy Journal):**
    *   **Experience:** "Captain's Log".
    *   **Features:**
        *   **Auto-Summarization:** LLM-generated summaries of completed arcs (baked, not real-time cost).
        *   **Searchable History:** "What did Marcus say about the budget?"
    *   **Implementation:** `JournalView.tsx` with text search.

---

## 6. PLAYER PSYCHOLOGY ARCHITECTURE
*   **Layer 1 (Core Fun):** Dialogue/Interrupts.
*   **Layer 2 (Progression):** Harmonics/Thought Cabinet.
*   **Layer 3 (Achievement):** Relationship Web.
*   **Layer 4 (Mastery):** Hard Mode.

---

## 7. PRODUCTION RESILIENCE & PROCESS
*   **MoSCoW:** Core = Arcs/Skills. Should = Cabinet/Web. Won't = Multiplayer.
*   **Crisis Protocol:** Cut Features ("Legs"), not Quality.

---

## 8. POST-LAUNCH & LIFECYCLE STRATEGY
*   **Launch:** Sector 0+1.
*   **Sequel:** Legacy Save (Career State).

---

## 9. AAA ACCESSIBILITY & UX STANDARDS
1.  **Cognitive:** Review Mode, Decision Pause.
2.  **Visual:** Colorblind Triple Coding, Scalable UI.
3.  **Input:** One-Handed Mode, Remapping.

---

## 10. STRATEGIC RESOURCE ALLOCATION
*   **Team:** 50 -> 200 -> 150.
*   **Budget:** $20M - $150M.
*   **Build vs Buy:** License Engine/Audio; Build Narrative/Skill Tech.

---

## 11. APPENDIX A: POTENTIAL FEATURE BACKLOG
*   [ ] Procedural Texture Text
*   [ ] Dynamic World Events
*   [ ] Crafting System
*   [ ] Desktop OS Integration
*   [ ] Mobile Companion App

## 12. APPENDIX B: TECHNICAL CONSIDERATIONS
*   **Networking:** NO Multiplayer.
*   **Localization:** Architecture Yes, Content English-Only first.
*   **Physics:** Baked Only.
