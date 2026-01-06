# LUX STORY: AAA PRODUCT REQUIREMENTS DOCUMENT (PRD)
## "The Worldbuilding OS" for Career Discovery

**Version:** 1.3 (ISP / Infinite Horizon)
**Date:** January 6, 2026  
**Status:** DRAFT - Visionary  
**Target Quadrant:** B (High Quality / Focused) -> **Ω (Category Redefining)**

---

## 1. VISION & EXECUTIVE SUMMARY
**High Concept:** *Disco Elysium* meets *Mass Effect* in a stealth career assessment platform. 
**The Hook:** A high-fidelity sci-fi RPG where every dialogue choice, system interaction, and problem-solved invisibly tracks Future Skills defined by the World Economic Forum.

**Core Value Proposition:**
*   **For Players:** A premium, narrative-driven indie RPG experience. No "edutainment" stink.
*   **For Stakeholders:** A sophisticated psychometric instrument capable of mapping 50+ granular skills to real-world career paths without explicit testing.

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
    *   **System Triage:** Debugging station systems (Coding/Logistics).
    *   **Resource Management:** Allocating power/supplies (FinTech/Ops).
    *   **Crisis Negotiation:** De-escalating conflicts (Leadership/HR).

### Pillar 3: "The Brain" (The 2030 Skills System)
*   **Experience:** "The game knows me better than I know myself."
*   **System:** Comprehensive tracking of 50+ weighted skill variables.
*   **Key Features (Implemented & Core):**
    *   **Harmonics Interface:** Visualizing skill growth as a dynamic "Constellation".
    *   **Pattern Voices:** *Disco Elysium*-style inner monologues.
    *   **Career Translation:** Real-time mapping to O*NET/Birmingham job codes.

---

## 3. CREATIVE TENSION & DIVERGENT UX (ISP LAYER)
*Solving contradictions to create novel gameplay.*

### A. The "Self-Awareness" Mechanic (Stealth vs. Feedback)
*   **The Contradiction:** We want "Stealth Assessment" (hiding the test) AND "Useful Feedback" (showing the stats).
*   **The Solution:** **The Fog of War Assessment.**
    *   **Subjective View:** The UI initially shows what the player *thinks* they are (Self-Perception). E.g., Player picks "Aggressive" options but thinks they are being "Assertive".
    *   **Objective View:** The hidden engine tracks the *real* data.
    *   **The Gameplay Loop:** The *Delta* between "Self-Perception" and "Reality" is a visible stat called **Self-Awareness**.
    *   **Resolution:** "Breakthrough Moments" (boss fights of the mind) crash the UI and force the two graphs to align, revealing the player's true nature in a dramatic "System Reboot".

### B. Sensory Immersion (Text vs. Feeling)
*   **The Contradiction:** Text-based games often feel detached. We want AAA immersion without 3D cinematics.
*   **The Solution:** **Synesthetic UX.**
    *   **Haptics:** "Pattern Voices" have distinct vibration textures (e.g., *Analytical* is a sharp, rhythmic buzz; *Helping* is a warm, steady hum).
    *   **Binaural Audio:** Voices don't just appear as text; they are whispered in 3D space (Left ear for Logic, Right ear for Empathy).
    *   **Diegetic Glitching:** When the player is stressed (Crisis Management), the actual game UI begins to artifact and lag, forcing them to "focus" (gameplay mechanic) to stabilize the interface.

### C. The "Worldbuilding OS" (Game vs. Tool)
*   **The Contradiction:** Is it a game or a desktop app?
*   **The Solution:** **The Borderless Window.**
    *   The game can minimize into a "Tray App" mode where it behaves like a real OS utility, sending "System Notifications" from Terminus Characters directly to your Windows/Mac Notification Center.
    *   *Experience:* You get a real Slack-style ping from Marcus: "I need you at the terminal." It blurs the line between playing and working.

---

## 4. CONTENT STRATEGY & ROADMAP (70/20/10 RULE)

### 70% Scope: The "Station Core" (Phase 2 - IMMINENT)
**Immediate Production Deliverables (Narrative Excellence):**
*   **Marcus Arc (Crisis Management):** Escalation from project manager to crisis leader.
*   **Tess Arc (Technical Leadership):** Transition from debugger to architect.
*   **Yaquin Arc (Strategic Execution):** Moving from idea to implementation.
*   **Samuel Hub (Mentorship):** Providing cross-arc synthesis.

### 20% Scope: "Station Life" (Breadth)
*   **"They're Waiting For You":** Return hooks.
*   **Delayed Gifts:** Choices that pay off later.
*   **Relationship Web:** Dynamic visualization.

### 10% Scope: "The Deep Station" (Mastery)
*   **New Game+:** Replay with different unlocked "Pattern Voices".
*   **Hard Mode Simulations:** Purely mechanical challenges.

---

## 5. TECHNICAL ARCHITECTURE SPECIFICATIONS

### A. Dialogue System ("The Heart")
*   **Structure:** Graph-based (Nodes + Edges).
*   **Data Schema:** Standardized JSON/TS.
*   **Pipeline:** Hot-reloadable content files with automated validation.

### B. Quest/Mission System
*   **Pattern:** "Event-Driven" over "Polled".
*   **State Machine:** `LOCKED` -> `UNLOCKED` -> `ACTIVE` -> `COMPLETED`.

### C. Character & Progression ("The Brain")
*   **Model:** Hybrid Class/Skill (Patterns + granular Skills).
*   **Visualizer:** "Galaxy Map" style skill tree.

### D. Inventory & Economy
*   **Data:** Component-Based Item System.
*   **Logic:** List-Based Inventory (Narrative focus).

### E. Animation & Fidelity
*   **State Machine:** Hierarchical State Machine (HSM).
*   **Event Notifiers:** Audio/FX tied to animation frames.

---

## 6. AAA ACCESSIBILITY & UX STANDARDS
*Non-negotiable features for a modern "Quality" title.*

1.  **Cognitive Accessibility:**
    *   **"Review Mode":** All dialogue history is scrollable and searchable (don't rely on player working memory).
    *   **"Decision Pause":** No timed choices unless explicitly creating "Stress" (and toggleable).
2.  **Visual Accessibility:**
    *   **Colorblind Support:** Pattern archetypes use Shape + Color + Sound (Triple Coding).
    *   **Scalable UI:** Text size adjustments without breaking layout.
3.  **Input Accessibility:**
    *   **One-Handed Mode:** Entire game playable with just a mouse or just a numpad.
    *   **Remappable Controls:** Full freedom.

---

## 7. STRATEGIC RESOURCE ALLOCATION

### A. Team Scaling Model
*   **Phase 1:** ~20-50 people (Proof of Concept).
*   **Phase 2:** ~200 people (Content Scaling).
*   **Phase 3:** ~150 people (Polish).

### B. Financial Modeling
*   **Budget:** ~$20-40M (Indie AAA) to ~$150M (Full AAA).

### C. Build vs. Buy
*   **Buy:** Engine (Unity/Unreal), Audio (Wwise).
*   **Build:** Dialogue Graph, Skill Engine, Quest Logic.

---

## 8. RISK MANAGEMENT & SUCCESS METRICS
*   **Risk:** "Edutainment" Perception. -> **Mitigation:** Synesthetic UX & Diegetic interfaces.
*   **Success Metric:** Retention D30 > 25%.
*   **Success Metric:** "Self-Awareness" Delta Closure (Players' self-perception aligns with data by endgame).
