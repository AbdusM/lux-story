# LUX STORY: THE LIVING MASTER DESIGN DOC
**Status**: Active & Living
**Role**: Single Source of Truth
**Philosophy**: "Worldbuilding is Infrastructure, Not Flavor"

---

## 1. THE CORE VISION: "Transient Connections"
**The Experience**: You are a traveler at a massive, timeless **Train Station**.
*   **The Feeling**: The hustle of arrival, the melancholy of departure, the intimacy of strangers meeting in transit.
*   **The Goal**: To connect. You meet people (Maya, Kai) who are stuck, stressed, or rushing. You help them find their way, and in doing so, you uncover the history of the Station itself.
*   **The Antagonist**: The **"Logic Cascade"** (A software failure that caused the Station to turn on humanity). It is impersonal, invisible, and everywhere (like "The Heat").

---

## 2. THE STRUCTURAL MECHANICS (The DNA)
*Synthesized from the Worldbuilding-First Blueprint & Lux Story 2.0 Features.*

### A. The "Iceberg" Architecture (Station Evolution)
*   **Rule**: 90% of the world is never explained. It is implied.
*   **Technique: The Casual Mention**: Characters reference "The Oxygen Tax" or "The Burned District" without exposition.
*   **System: Station Evolution**: The Station physically changes based on your relationships.
    *   *Example*: Help the Engineer -> The lights in the terminal stop flickering.
    *   *Mechanism*: `StationState` tracks `ambientEvents` and `platformVisuals`.

### B. Cultural Architecture (The Relationship Web)
Factions are not just "Red Team vs. Blue Team." They are defined by **Sensory Pillars** and **Interconnection**.
*   **System: The Consequence Web**: Characters reference your interactions with others.
    *   *Example*: "Maya mentioned you. Said you didn't try to fix her." (Cross-Character Echo).
    *   *Tool*: **Relationship Web UI** visualizes these connections as a constellation, highlighting unlocked "Private Opinions" at high trust.
*   **The Yojimbo Dynamic**: No faction is "Right." Each has a valid point and a fatal flaw. The player is the moral arbiter.

### C. The Unreliable Narrator & Information Hunger
*   **Rule**: There is no "God View." Every piece of lore is written by a character with an agenda.
*   **Technique**: "Play, Show, Tell." Choices (Play) > Reactions (Show) > Exposition (Tell).
*   **System: Delayed Gifts**: Choices pay off 2-5 interactions later.
    *   *Example*: You give advice in Chapter 1 -> A stranger thanks you in Chapter 3.

### D. Neuro-Symbiosis (The Thought Cabinet)
*   **Concept**: The Game listens to the Player's trivial choices.
*   **System: Pattern Voices**: Your 5 Patterns (Analytical, Empathetic, etc.) become internal voices that interrupt the chat.
    *   *Mechanism*: "The Thought Cabinet" unlocks mental inventory (e.g., "The Maker Mindset") based on your playstyle, opening new dialogue options.

---

## 3. WRITING & INTERACTION PROTOCOLS

### A. The "Accept/Reject/Deflect" Pattern
We avoid complex branching trees. Every choice node follows this taxonomy:
1.  **Accept**: Go with the flow (Cooperative).
2.  **Reject**: Fight the premise (Confrontational).
3.  **Deflect**: Change the subject (Evasive/Chaotic).

### B. The Interrupt System (Agency)
**"Moment-to-Moment Agency."**
We break the "Text Wall" with timed opportunities to act.
*   **The Mechanism**: A subtle button appears during NPC dialogue (e.g., "Reach out" while they are crying).
*   **Rule**: These are rare, high-impact moments. Missing them is a valid choice (Silence).

### C. Quest Architecture: "Loyalty Experiences"
**"Every Interaction is a Story."**
Every major character has one signature **Loyalty Experience** (Deep Dive).
*   *Maya*: "The Demo" (Help her present to investors).
*   *Devon*: "The Outage" (Triage a system failure).
*   *Samuel*: "The Quiet Hour" (Sit in silence; choose when to speak).

---

## 4. THE OPERATING SYSTEM: "OVERDENSITY"
"Lux Story" is the Interface. "Overdensity" is the Backend.
*   **The Player** sees a chat with a stranger.
*   **The System** sees a `LoreEntry` verification check against a 5,000-year database.
*   **Why this matters**: We don't write "flavor text". We write **History**. This ensures that if you ask Samuel about a pipe, his answer is consistent with the `Logic Cascade` event from 2,000 years ago, even if you never explicitly learned about it.

---

## 5. USER CONSTRAINTS (The Guardrails)
1.  **Grounded Sci-Fi**: **No Magic**. It is a **Logic Cascade** (Software Desynchronization).
2.  **Simple Language**: High-impact, accessible phrasing.
3.  **Age Appropriateness**: Themes of loss/connection are fine; graphic horror/esoteric fantasy is out.
4.  **No "Meta" Drift**: The game is about *meeting folks*. The Lore supports that; it doesn't replace it.

---

## 6. PRODUCTION PIPELINE: "The Living Station"

### The Lockdown Protocol
*   **Phase 1: Foundation (DONE)**. Lore System, History Bible, State Machine Refactor.
*   **Phase 2: Vertical Slice (NOW)**. "The Station Entry."
    *   *Goal*: Validating **Interrupts**, **Pattern Voices**, and **Casual Mention** in one scene.

## System Coverage Matrix

The following matrix tracks the implementation status of key "Lux Story 2.0" features across the full character cast.

| Character | Consequence Echoes | Pattern Voices | Sensory Pillars | Relationship Web | Vulnerability Hints |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Samuel** | ✅ Implemented | ❌ Missing | ✅ Defined | ✅ Defined | ❌ Missing |
| **Maya** | ✅ Implemented | ✅ Implemented | ✅ Defined | ✅ Defined | ✅ Implemented |
| **Devon** | ✅ Implemented | ✅ Implemented | ✅ Defined | ✅ Defined | ✅ Implemented |
| **Kai** | ✅ Implemented | ❌ Missing | ✅ Defined | ✅ Defined | ❌ Missing |
| **Rohan** | ✅ Implemented | ✅ Implemented | ✅ Defined | ✅ Defined | ❌ Missing |
| **Tess** | ✅ Implemented | ❌ Missing | ✅ Defined | ✅ Defined | ❌ Missing |
| **Yaquin** | ✅ Implemented | ❌ Missing | ✅ Defined | ✅ Defined | ❌ Missing |
| **Marcus** | ✅ Implemented | ✅ Implemented | ✅ Defined | ✅ Defined | ❌ Missing |
| **Elena** | ❌ Missing | ✅ Implemented | ✅ Defined | ❌ Missing | ❌ Missing |
| **Grace** | ❌ Missing | ✅ Implemented | ✅ Defined | ❌ Missing | ❌ Missing |
| **Alex** | ❌ Missing | ❌ Missing | ✅ Defined | ❌ Missing | ❌ Missing |
| **Asha** | ❌ Missing | ❌ Missing | ✅ Defined | ❌ Missing | ❌ Missing |
| **Silas** | ❌ Missing | ❌ Missing | ✅ Defined | ❌ Missing | ❌ Missing |
| **Lira** | ❌ Missing | ❌ Missing | ✅ Defined | ❌ Missing | ❌ Missing |
| **Zara** | ❌ Missing | ❌ Missing | ✅ Defined | ❌ Missing | ❌ Missing |

### Missing Content Plan

#### 1. Consequence Echo Templates
*   **Characters requiring updates:** Elena, Grace, Alex, Asha, Silas, Lira, Zara.
*   **Action:** Create `trustUp`, `trustDown`, and `patternRecognition` template arrays for each.

#### 2. Pattern Voice Triggers
*   **Characters requiring updates:** Alex, Asha, Kai, Tess, Yaquin, Silas, Zara, Lira.
*   **Action:** Add specific `node_enter` or `npc_emotion` triggers to `PATTERN_VOICE_LIBRARY` for these characters.

#### 3. Vulnerability Hints
*   **Characters requiring updates:** Everyone except Maya and Devon.
*   **Action:** Define at least one "Vulnerability Arc" for each major NPC and write corresponding hints.

#### 4. Relationship Constellations
*   **Action:** Ensure `RelationshipWeb.tsx` has node definitions for the extended cast (Elena, Grace, etc.).

*   **Phase 3: Integration**. Connecting the "Folks" (Maya, Kai) via the **Relationship Web**.

---
*This document is living. Update it as we learn.*
