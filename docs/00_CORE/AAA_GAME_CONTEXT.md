# AAA Game Context & Technical Standards
**Scope:** Architecture, Design Philosophy, and "High Fidelity" Systems
**Status:** Implementation Blueprint

## Core Philosophy: "The Living Station"
Lux Story is architected not as a simple chat-bot, but as a **Systemic Narrative RPG** (Role-Playing Game). It adheres to AAA game design pillars: **Immersion**, **Agency**, **Reactivity**, and **Consequences**.

---

## 1. Production-Grade Systems (The "AAA" Standard)

### A. The "Iceberg" Architecture
Like *Skyrim* or *Red Dead Redemption 2*, the visible UI is just the tip of a massive simulation.
*   **Visible:** Chat interface, Journal tabs.
*   **Invisible (The "Iceberg"):**
    *   **State Machines:** Complex FSMs for quests and mysteries (linear → branching → rejoining).
    *   **Economy:** A scarcity-based "Time/Energy" economy (Pattern Focus Points).
    *   **Derivatives:** Continuous calculus of 7+ variables per interaction (Trust, Pattern, Knowledge).

### B. High-Fidelity "Visualizers" (The "Wow" Factor)
To differentiate from standard generative AI, we employ **5 Distinct Game Engines** beyond text:
1.  **VisualCanvas (The Builder):** Interactive spatial design tool (like *The Sims* build mode).
2.  **MediaStudio (The Creator):** Multi-track audio/video editor interface.
3.  **DataDashboard (The Analyst):** *Minority Report*-style node graph visualization.
4.  **SecureTerminal (The Hacker):** Command-line interface with distinct "Game Feel".
5.  **SystemArchitecture (The Planner):** Blueprint and logic flow designer.

### C. "Shift Left" Design (Immediate Hook)
We moved deep mechanics to **Trust 0-2** (The "Introduction"):
*   **No "Slow Burn":** Users access Simulations and Tools within 5 minutes.
*   **Instant Reactivity:** The "Derivative Engine" provides immediate feedback ("Samuel nods") on the very first choice.

---

## 2. The "Consequence Web" (Current Reality)

### The Vision (Pitch Deck)
"A Living World where characters talk to each other. 'Gossip' propagates state."
*   *Context:* This is the "Holy Grail" of narrative design (like *Middle-earth: Shadow of Mordor*'s Nemesis System).

### The Reality (Codebase)
*   **Local Reactivity (Implemented):** `consequence-echoes.ts` allows Samuel to react *immediately* to your tone.
*   **Systemic Propagation (Planned/Vaporware):** Logic for "Maya tells Marcus about your choice" is **not yet built**.
    *   *Mitigation:* The "Consequence Echoes" system is robust enough to *feel* systemic to a casual user, but a deep audit reveals the silos.

---

## 3. "AAA" Feature Roadmap (From Addendum)

### Phase 1: Immersion (The "Juice")
*   **Audio Signatures:** Unique soundscapes for each Voice upgrade (Whisper → Speak → Command).
*   **Diegetic UI:** Unlocks appear "in world" (e.g., a tool given by a character), not just a menu unlock.

### Phase 2: Reactivity (The "Echo")
*   **Pattern Reflection:** NPCs explicitly comment on your dominant stats ("You are a Weaver").
*   **Badge Ceremonies:** Full-screen celebrations for "Leveling Up" (Zelda-style).

### Phase 3: Agency (The "Cost")
*   **Scarcity Mode:** Optional "7-Day Limit" forces hard choices (Persona-style). You cannot befriend everyone.
*   **Identity Offering:** A formal game moment where you must "Accept" or "Reject" your behavioral pattern.

---

## 4. Technical Comparison

| Feature | GenAI Chatbot | Lux Story (AAA RPG) |
|:---|:---|:---|
| **Memory** | Vector Database (RAG) | **Detailed State Graph** (Flags, Variables, Quests) |
| **Logic** | LLM Inference | **Deterministic Derivatives** (Math > Vibes) |
| **Progression**| Endless Chat | **Tiered Arcs** (Emerging → Mastery) |
| **Feedback** | Text Reply | **Multi-Sensory Ceremonies** (Audio, Visual, UI) |
| **End State** | None | **Personal Synthesis & Identity Offering** |
