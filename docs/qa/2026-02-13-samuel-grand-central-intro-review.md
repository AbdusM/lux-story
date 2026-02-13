# Samuel / "Grand Central" Intro Review (Narrative + Choice Design + UX)

Date: 2026-02-13  
Repo state: `main` @ `ba46842`

## Screenshots (UI Evidence)

Captured 2026-02-12 and normalized for repo usage:

- `/Users/abdusmuwwakkil/Development/30_lux-story/docs/qa/screenshots-2026-02-12/`

## Scope

This review covers the first-run opening flow from:

- `content/samuel-dialogue-graph.ts`: `station_arrival` → Samuel intro variants → optional theme branch → orb gift → patterns primer
- `content/systemic-calibration.ts`: `systemic_calibration_start` (only insofar as it is reached from the intro)

The goal is **keep vs fix** guidance that is **decision-complete** for content owners and engine/UI owners.

## Implementation Update (2026-02-13, Iteration B)

Applied from this review:

- `samuel_introduction` now presents **3 choices** (reduced from 5): place anchor, Samuel anchor, and explore.
- `samuel_changing_world` opening line now starts with a **concrete station artifact** (departures board/routes) before the macro jobs theme.
- `samuel_orb_introduction` now names the gift object directly as a **signal token**.
- `samuel_orb_mechanics` copy is compressed to a shorter, less lecture-heavy pattern primer.
- Reachability preserved by adding `ask_whats_happening_from_platforms` in `samuel_explains_platforms` to keep the economic-context branch live.

## Reality Map (What The Game Actually Does)

### Entry (good, low cognitive load)

`station_arrival` (Narrator) presents **3 choices**:

- `step_forward_confident` → `samuel_introduction` (this is the only path that immediately presents 5 Samuel choices)
- `observe_first` → `station_observation` → (2 choices) → `samuel_introduction_patient` or `samuel_introduction_curious`
- `check_others` → `observe_passengers` → (2 choices) → `samuel_introduction_noticed` or `samuel_introduction_humble`

### First Samuel Prompt (inconsistent choice density)

- `samuel_introduction` (Samuel) is **5 choices**:
  - `ask_what_is_this` ("What is this place exactly?") → `systemic_calibration_start` (**mismatch**, see Fix #1)
  - `ask_about_platforms` → `samuel_explains_platforms`
  - `ask_who_are_you` → `samuel_backstory_intro`
  - `ask_whats_happening` → `samuel_changing_world` (machines/jobs theme; optional)
  - `ready_to_explore_intro` → `samuel_orb_introduction` (gift)

- The other intro variants (`samuel_introduction_patient|curious|noticed|humble`) are all **3 choices**, which feels better for first-time onboarding.

### Theme Beat (optional; good that it's optional)

`samuel_changing_world` is only reachable via `ask_whats_happening`.

### Gift + Patterns Primer (short, optional depth)

- `samuel_orb_introduction`: "take this" moment (2 choices, both → `samuel_orb_explanation`)
- `samuel_orb_explanation`: what the orbs *mean* (2 choices)
- `samuel_orb_mechanics`: the **"five patterns"** taxonomy (1 choice; only if player asks "How does it work?")

### Quick objective metrics (words stripped of markup tags)

| Node ID | Speaker | Content words | Choice count |
| --- | --- | ---: | ---: |
| `station_arrival` | Narrator | 4 | 3 |
| `samuel_introduction` | Samuel | 6 | 5 |
| `samuel_introduction_patient` | Samuel | 5 | 3 |
| `samuel_introduction_curious` | Samuel | 6 | 3 |
| `samuel_introduction_noticed` | Samuel | 6 | 3 |
| `samuel_introduction_humble` | Samuel | 10 | 3 |
| `samuel_changing_world` | Samuel | 15 | 3 |
| `samuel_orb_introduction` | Samuel | 8 | 2 |
| `samuel_orb_explanation` | Samuel | 38 | 2 |
| `samuel_orb_mechanics` | Samuel | 50 | 1 |
| `systemic_calibration_start` | Samuel | 27 | 3 |
| `samuel_explains_station` | Samuel | 13 | 2 |
| `samuel_explains_platforms` | Samuel | 14 | 2 |
| `samuel_backstory_intro` | Samuel | 2 | 2 |

## Keep (Working Well)

1. **Arrival choice design is clean and purposeful.**  
   `station_arrival` offers 3 clear intents (act / observe / check others). This is good pacing and avoids early overwhelm.

2. **Intro variants are better than the "direct step-off" intro from a UX standpoint.**  
   `samuel_introduction_patient|curious|noticed|humble` all present 3 choices, which matches early-game decision bandwidth.

3. **Optionality is respected.**  
   The machines/jobs theme (`samuel_changing_world`) and the full patterns taxonomy (`samuel_orb_mechanics`) are opt-in.

4. **The orb gift is a strong ritual moment structurally.**  
   `samuel_orb_introduction` → explanation → (optional mechanics) → hub router is a clean, deterministic teaching sequence. It also has `metadata.sessionBoundary` which is a good "AAA seam" for future pacing control.

5. **Station + platform explanations are grounded and short.**  
   `samuel_explains_station` (1929 / theatre upstairs) and `samuel_explains_platforms` (medical centers / tech districts) give concrete anchors without dumping lore.

## Fix (Highest ROI Changes)

### Fix #1 (P0): Choice label vs destination mismatch to Calibration

**Problem:** Some "tell me about the station" questions route to `systemic_calibration_start`, which is a different kind of scene (internal bio-state / "static" / narrative gravity vertical slice).

Concrete mismatches:

- `samuel_introduction.ask_what_is_this`: "What is this place exactly?" → `systemic_calibration_start`
- `samuel_introduction_patient.ask_what_is_this_patient`: "What is this place exactly?" → `systemic_calibration_start`
- `samuel_introduction_patient.ask_about_platforms_patient`: "The platforms.where do they lead?" → `systemic_calibration_start`

**Player impact:** this reads like a broken conversation: the player asks for **world context**, Samuel answers about **the player's internal noise**. Even if the calibration is good content, the prompt mismatch breaks trust in choice meaning.

**Decision-complete options (pick one):**

1. **Route-fix (recommended):** worldbuilding questions must route to worldbuilding answers.  
   - Route those choices to `samuel_explains_station` / `samuel_explains_platforms`.
   - Introduce calibration behind a choice whose text implies it ("Something feels off..." / "I feel like my head is loud.") or as an explicit Samuel interrupt ("Hold up. Before we talk about the station...").

2. **Label-fix (acceptable if calibration must be forced early):** keep routing to calibration but rename the choices so players understand the move.  
   Examples:
   - "Something feels wrong. What is happening to me?" → calibration
   - "I feel like I'm buzzing. Do you hear that?" → calibration

**AAA acceptance criterion:** At the first Samuel prompt, every choice must be "truthful": the choice label's intent matches the next scene's topic within 1 exchange.

---

### Fix #2 (P1): "5 first Samuel choices" only happens on the "confident" path

**Problem:** If the player chooses `step_forward_confident`, they hit `samuel_introduction` and are presented **5 categories of intent** (mechanics/calibration, platforms, backstory, theme, explore). If they choose the observational paths, they get fewer choices and better pacing.

**Player impact:** two different onboarding experiences based on a very early micro-choice; the "confident" player gets the highest cognitive load.

**Recommendation:** standardize the first Samuel prompt to **3 choices** + a **"More questions..."** follow-up node.

Suggested top-level 3:

1. "What is this place?" (world anchor) → station explanation
2. "Who are you?" (character anchor) → backstory
3. "I'm ready to look around." (agency anchor) → orb gift / hub

Then a secondary node can carry:

- platforms detail
- "what's happening out there" (theme)
- calibration (if desired) with truthful framing

**AAA acceptance criterion:** First Samuel prompt shows **<= 3** choices unless player explicitly asks for more.

---

### Fix #3 (P1): Theme beat needs a concrete station hook in its first line

**Current:** `samuel_changing_world` opens with a macro statement ("Machines do work people once did...").

**Why it risks missing:** early players are still forming "what's weird here" mental model. Abstract theme without a station artifact can feel like an essay beat.

**Recommendation:** anchor the first sentence in a station detail, then widen to the macro theme.

Example shape:

- concrete: "Half these boards still list trains that don't exist anymore."
- macro: "That's the world right now. Jobs vanish the same way."

**AAA acceptance criterion:** After selecting `ask_whats_happening`, a player can answer "what is strange about this station" in one sentence.

---

### Fix #4 (P2): "Take this" gift moment should name the object and its loop

`samuel_orb_introduction` is structurally good but emotionally/mechanically under-labeled. Right now the player receives "this" and only later learns it relates to choice echoes.

**Recommendation (content-only, no UI work required):**

- Give the orb a name in `samuel_orb_introduction` ("an orb", "a small glass orb", etc.).
- Add a 1-line "what it does" hint (even if mysterious): "It helps you notice the patterns you leave behind."

**Recommendation (UI, optional later):**

- Show an item card on this node with name + 1-line function (feels premium).

**AAA acceptance criterion:** A first-time player can describe what they received in **one sentence** immediately after the gift scene.

---

### Fix #5 (P2): "Fox Theatre Station" vs "Grand Central" naming clarity

Samuel says "Welcome to Grand Central" (`samuel_introduction`), but station explanation says "Fox Theatre Station" (`samuel_explains_station`).

If this is intentional (Grand Central Terminus is the metaphysical layer; Fox Theatre Station is the real-world skin), add a one-liner to prevent confusion:

- "Some folks call it Fox Theatre Station. Around here, we just say Grand Central."

## Recommendation: One Tight "Decision Lock" For Owners

Decide whether **Systemic Calibration** is:

1. a **mandatory** early vertical slice (then it must be framed honestly as "about you", not "about the station"), or
2. an **optional** mechanics scene (then route it behind an explicit mechanics/inner-state choice).

Until that decision is locked, the intro will remain vulnerable to "choice meaning drift."

## Suggested Next Step (If Implementing)

Implement Fix #1 + Fix #2 first (they are mostly routing + copy and are easy to validate via headless sims and JSDOM choice/menu tests).
