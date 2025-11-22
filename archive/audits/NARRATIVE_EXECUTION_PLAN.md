# Comprehensive Narrative Engineering Plan: "Project Soul Injection"

**Goal:** Transform the narrative from "competent tech demo" to "emotionally resonant interactive fiction."
**Core Strategy:** Replace templates with specific, character-driven conflicts. Replace "Game Over/Success" binary with complex, meaningful failure states.

---

## Phase 1: The "System Voice" Excision (Immersion & Voice)
**Objective:** Eliminate `speaker: 'SYSTEM ALERT'`. All technical feedback must be filtered through the character's perception and emotion.

*   **Devon:** He doesn't see "ERROR." He sees his father's silence. The UI should be his internal monologue panicking.
*   **Maya:** The robot doesn't say "CALIBRATION FAILED." Maya winces as the servo whines. The machine's pain is her pain.
*   **Jordan:** The UX graph isn't "Retention Drop." It's "People Leaving." She takes the data personally.
*   **Kai/Rohan/Silas:** Rewrite all simulation nodes to have the character narrate the system state.

**Action:**
*   [ ] Audit all `content/*-dialogue-graph.ts` files.
*   [ ] Replace every `speaker: 'SYSTEM ALERT'` node.
*   [ ] Rewrite content to be character-centric observations (e.g., "*Devon stares at the flatline.* 'He hung up. I didn't even hear him click.'").

## Phase 2: Character "Soul" Rewrites (Differentiation & Stakes)
**Objective:** Differentiate the "New Trio" (Kai, Rohan, Silas) so they don't sound like "Tech Bro Templates." Give them unique, painful stakes.

### 2.1 Kai (Instructional Architect) -> "The Guilty Teacher"
*   **Voice:** Manic, high-speed, desperate. Trying to outrun guilt.
*   **Old Stake:** Boredom.
*   **New Stake:** **Harm.** A bad training module they designed caused a real-world injury. They are haunted by the "Next" button.
*   **Scenario:** Rebuilding the specific safety module that failed.

### 2.2 Rohan (Deep Tech) -> "The Monk of the Machine"
*   **Voice:** Quiet, reverent, terrified. Whispers about code like it's scripture.
*   **Old Stake:** AI Slop / Code Quality.
*   **New Stake:** **Obsolescence/Erasure.** He found AI code that is *beautiful* and *soulless*. He fears human understanding is dead.
*   **Scenario:** Tracing a "ghost" in the machine—code that looks human but isn't.

### 2.3 Silas (AgTech) -> "The Humbled Engineer"
*   **Voice:** Slow, deliberate, fearful. Humbled by nature's brutality.
*   **Old Stake:** "Bits to Atoms" transition.
*   **New Stake:** **Bankruptcy/Survival.** He lost everything on a crop failure because he trusted sensors over eyes. He is terrified of failing again.
*   **Scenario:** A drought where sensors say "Wet" but plants say "Dry."

**Action:**
*   [ ] Rewrite `kai-dialogue-graph.ts` (Full overhaul).
*   [ ] Rewrite `rohan-dialogue-graph.ts` (Full overhaul).
*   [ ] Rewrite `silas-dialogue-graph.ts` (Full overhaul).

## Phase 3: Meaningful Failure States (Consequence)
**Objective:** Player choices must have negative consequences that alter the narrative path. "Success" is not guaranteed.

*   **The Rule:** Every simulation MUST have a path where the character fails *and learns the wrong lesson* or *retreats*, changing the ending options.

### 3.1 Maya's Failure
*   **Trigger:** Forcing a "Quick Fix" (Voltage check) instead of listening.
*   **Outcome:** The hand breaks. Maya retreats ("I knew I wasn't an engineer").
*   **Consequence:** The "Robotics" ending is **LOCKED**. Only "Pre-Med" or "Hybrid" remain.

### 3.2 Devon's Failure
*   **Trigger:** Using the Script/Algorithm choices repeatedly.
*   **Outcome:** Dad hangs up. Devon concludes "Emotions are too unstable, I need a *better* system."
*   **Consequence:** Devon doubles down on logic. "Integration" ending is **LOCKED**.

### 3.3 Kai's Failure
*   **Trigger:** Choosing "Safe" options in the simulation.
*   **Outcome:** Kai deletes the simulation. "It's too risky."
*   **Consequence:** Kai stays in the corporate job (Tragedy ending).

**Action:**
*   [ ] Update `maya-dialogue-graph.ts` with failure branch & state checks.
*   [ ] Update `devon-dialogue-graph.ts` with failure branch & state checks.
*   [ ] Update `kai-dialogue-graph.ts` (during rewrite) with failure branch.

## Phase 4: Sensory & Visual Polish (Atmosphere)
**Objective:** Make the station feel real, not just a text box.

*   **Rohan:** Describe the *smell* of ozone and stale coffee. The *sound* of the server hum.
*   **Silas:** Describe the *grit* of soil, the *heat* of the greenhouse.
*   **Devon:** Describe the *silence* of the phone line.

**Action:**
*   [ ] Pass through all files adding sensory details to `content` text blocks.

## Execution Order
1.  **Refactor Kai** (High impact rewrite).
2.  **Refactor Rohan** (High impact rewrite).
3.  **Refactor Silas** (High impact rewrite).
4.  **Update Maya/Devon/Jordan** (Inject failure states & remove System Voice).
5.  **Final Connectivity Check** (Verify cross-talk still makes sense with new stories).
