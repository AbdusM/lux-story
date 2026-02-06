Below is a “game-research translation” of everything you listed, written as if you’re building a choice-based game that can also function as a clean experimental instrument (A/B tests, behavioral study, etc.). I’m going to keep your structure (I–IV), but for each item I’ll add:

* **What it means in a choice-based game**  
* **How to implement it**  
* **Common pitfalls**  
* **A concrete in-game example**

At the end, I’ll give you a **plug‑and‑play study design template** and a **telemetry/logging schema** you can drop into your design doc.

---

## **First, the “unit of experimentation” in a choice-based game**

Before any control technique matters, decide what counts as a “condition” in your game. In choice games, conditions are usually one of these:

1. **Narrative framing** (same outcomes, different wording/voiceover/visual tone)  
2. **Information availability** (how much context the player sees before choosing)  
3. **Incentive structure** (rewards, penalties, reputation systems)  
4. **Interface / UX** (default options, button order, timers, emphasis)  
5. **Timing pressure** (time limits, interruptions, pacing)  
6. **Social cues** (NPC reactions, social approval meters, “others chose X” prompts)  
7. **Moral salience** (making consequences vivid vs abstract)  
8. **Branch availability** (the game literally offers different options)

Most “bias” problems come from accidentally changing more than one of those at once.

---

## Lux Story Implementation Mapping (Updated Feb 6, 2026)

This repo now has concrete instrumentation and bias-mitigation hooks that map to the “research controls” concepts below.

### Choice Ordering (Position Bias Mitigation)
- **UI ordering helper:** `lib/choice-ordering.ts`
- **Current strategy:** `gravity_bucket_shuffle` (sort by gravity weight desc, deterministic shuffle within equal-weight buckets)
- **Render + ordering integration:** `components/GameChoices.tsx`

### Telemetry (What Was Shown vs What Was Chosen)
- **Client queue (offline-first):** `lib/sync-queue.ts` (`queueInteractionEventSync`, action type `interaction_event`)
- **Server ingest:** `app/api/user/interaction-events/route.ts`
- **Database table:** `interaction_events` via `supabase/migrations/021_interaction_events_table.sql`
- **Core events emitted:**
  - `choice_presented` (ordered list + gravity weights + lock state snapshot)
  - `choice_selected_ui` (selected index + reaction time)
  - `choice_selected_result` (authoritative result from game logic: pattern awarded, trust delta, etc.) in `hooks/game/useChoiceHandler.ts`

### Pattern Naming Drift (Legacy Alias)
- Legacy `analyzing` is normalized to canonical `analytical` where practical (e.g., `lib/player-persona.ts`, `lib/sync-queue.ts`).

# **I. Controlling for Researcher & Participant Bias**

## **1\) Double-Blind Study**

**In a game context:** The gold standard is: *players don’t know what variant they’re in, and the humans running the study (support staff, moderators, even analysts) can’t tell either*—until after data is locked.

**How to implement**

* Use an **automated assignment service** (backend or build-time assignment) that sets a hidden `condition_id`.  
* Store the mapping from `condition_id -> variant meaning` in a **separate file** with restricted access (or reveal only after analysis is finalized).  
* If humans interact with participants (Discord, lab facilitator), give them **standard scripts** and **no access** to condition.

**Pitfalls**

* Patch notes, UI differences, or content leaks can “unblind” players.  
* Debug tools that show condition IDs can leak in streams/logs.  
* Support staff will sometimes infer condition from bug reports.

**Example**  
You’re testing whether **“empathy framing”** changes moral choices:

* Condition A: NPC says “Please… my kids are hungry.”  
* Condition B: NPC says “Transaction request: 20 credits.”  
  The facilitator can’t see which line the NPC delivered; only the game logs it.

---

## **2\) Single-Blind Study**

**In a game context:** Most practical game experiments are single-blind: players don’t know their condition, but developers do.

**How to implement**

* Don’t mention “we’re testing your morality” or “we’re testing UI effects.”  
* Present variants as normal content (“this is the game”).

**Pitfalls**

* Players can guess the hypothesis if the manipulation is obvious.  
* Choice games often encourage meta-gaming. Some players will try to “solve” the study.

**Example**  
You’re testing “default bias” by pre-selecting an option:

* Condition A: Default highlight on “Help the stranger”  
* Condition B: Default highlight on “Ignore”  
  Players aren’t told anything about defaults.

---

## **3\) Placebo Control (Sham Treatment)**

**In a game context:** Placebo is an **“active control”** that looks like the treatment but should not contain the active ingredient.

**How to implement**

* If the treatment is “players see a warning about consequences,” placebo could be “players see a neutral message of equal length and style.”  
* Keep **presentation identical**: same font, timing, sound cue, placement.

**Pitfalls**

* If your placebo is obviously meaningless, players detect it and it stops working.  
* If your placebo accidentally changes emotion/attention, it’s no longer placebo.

**Example**  
Testing whether “ethical reminder” reduces harmful choices:

* Treatment: “Remember: your actions affect others.”  
* Placebo: “Tip: You can review previous dialogue in the journal.”  
  Same pop-up style, same timing, same duration.

---

## **4\) Standardized Instructions**

**In a game context:** Your tutorial, onboarding, and prompts are your “researcher voice.” They must be identical across conditions unless they *are* the manipulation.

**How to implement**

* Put instructions in a **single source of truth** (one script file, one tutorial sequence).  
* Lock tutorial text/voiceover so it can’t diverge across builds.  
* If running in-person sessions, facilitators must read from a **script**.

**Pitfalls**

* A single extra hint in one condition can cause massive downstream choice differences.  
* “Helpful” moderators answering questions differently ruins standardization.

**Example**  
All participants get the same tutorial: how to navigate dialogue, what stats mean, and that choices matter—without mentioning the research topic.

---

## **5\) Deception**

**In a game context:** Deception is usually about hiding the **true dependent variable** (what you care about) or the **true purpose** so players don’t role-play what they think you want.

**How to implement (ethically)**

* Use a **cover story** that’s plausible and low-risk.  
* Avoid deception about risks, data usage, or anything that affects informed consent.  
* Plan a **debrief** and a **withdrawal option** (where feasible).

**Pitfalls**

* Overly elaborate deception can backfire and create distrust.  
* If the deception is discovered mid-study (Reddit/Discord), behavior changes.

**Example**  
Cover story: “We’re evaluating narrative pacing and readability.”  
True purpose: measuring whether “time pressure” increases selfish choices.

---

## **6\) Debriefing**

**In a game context:** This can be a post-session screen, email, webpage, or “research mode results” page.

**How to implement**

* Provide: what was studied, what was manipulated, why deception was needed (if used), what data you collected, and contact/opt-out info.  
* If it’s a lab study: do it immediately.  
* If it’s remote: provide it at the end of play session or after data collection closes (depending on your design).

**Pitfalls**

* Debriefing too early can contaminate repeat play or sharing with others.  
* But delaying too long can be ethically questionable if deception was meaningful.

**Example debrief screen snippet**

* “This build included a randomized narrative framing manipulation to study decision-making under uncertainty… Your choices were logged as anonymous events…”

---

## **7\) Inter-Rater Reliability**

**In a game context:** Only needed when humans are labeling/coding behavior (e.g., coding open-text responses, classifying playstyles, labeling streamer footage).

**How to implement**

* Create a **codebook** (definitions \+ examples).  
* Two independent raters label the same subset.  
* Compute agreement (e.g., Cohen’s kappa) and refine codebook until reliable.

**Pitfalls**

* Vague labels (“aggressive”, “empathetic”) cause low agreement.  
* Raters can become biased if they know the condition or hypothesis.

**Example**  
Players type a final reflection: “Why did you choose to betray the ally?”  
Raters label responses as: “self-interest,” “fear,” “loyalty conflict,” “role-play,” etc.

---

# **II. Procedural & Design Controls**

## **1\) Random Assignment**

**In a game context:** The cleanest way to ensure groups are comparable.

**How to implement**

* Assign condition at **first eligible moment** (first launch, first time reaching a research checkpoint).  
* Use stable assignment (same player always gets same condition) if repeat sessions matter.  
* Consider **stratified randomization** if you have key covariates (platform, language, prior play experience).

**Pitfalls**

* If players can restart to “reroll” variants, random assignment fails.  
* If assignment happens after a tutorial, you may have early dropouts biasing groups.

**Example**  
On first launch, you assign:

* `condition_id ∈ {A, B, C, D}`  
  Then you log it and never show it.

---

## **2\) Random Sampling**

**In a game context:** Harder than in textbooks, because game players are not the general population.

**How to implement (best-effort)**

* Recruit across multiple channels, not just your Discord.  
* Use quotas or weighting for key demographics if generalizability matters.  
* Be explicit: “This generalizes to *players like these*.”

**Pitfalls**

* Self-selection: people who love moral choice games are not “everyone.”  
* Streamer audiences can skew behavior (performative play).

**Example**  
If your claim is about “players in narrative choice games,” your sampling can be valid even if it’s not the general population.

---

## **3\) Matched Pairs Design**

**In a game context:** Useful when you have small samples or one known confound (e.g., prior genre expertise).

**How to implement**

* Collect baseline measure (short pre-survey or in-game calibration).  
* Pair players with similar baseline values.  
* Randomly assign one from each pair to each condition.

**Pitfalls**

* Matching on too many variables becomes impossible.  
* Matching requires reliable baseline measures; noisy baselines harm more than help.

**Example**  
Match players based on “prior hours in similar games” and “reading speed,” then split pairs across two framing conditions.

---

## **4\) Counterbalancing**

**In a game context:** Essential for within-subject designs (the same player sees multiple conditions).

**How to implement**

* Create modular scenes A and B (or multiple).  
* Half of players see A→B, half see B→A.  
* If more than two scenes/conditions, consider Latin square.

**Pitfalls**

* Story coherence: changing order may change meaning.  
* Carryover effects: once players learn a mechanic, they can’t “unlearn” it.

**Example**  
Testing two persuasion styles:

* Scene A: authority-based appeal  
* Scene B: empathy-based appeal  
  Counterbalance order across participants.

---

## **5\) Pilot Studies**

**In a game context:** Absolutely mandatory if you’re measuring subtle choice effects.

**How to implement**

* Do a micro-pilot (5–10 people) for comprehension and bugs.  
* Do a pilot (20–50) to estimate effect size, dropout, and whether choices vary enough.

**Pitfalls**

* Using pilot data in final analysis without pre-planning can bias results.  
* Not piloting leads to “your manipulation didn’t actually manipulate anything.”

**Example**  
Pilot reveals: everyone chooses “help” because the “ignore” option looks cruel. You adjust wording so both options are plausible.

---

## **6\) Latin Square Design**

**In a game context:** Use when you have 3+ conditions that must be presented in different orders.

**How to implement**

* Build a matrix so each condition appears equally often in each position (1st, 2nd, 3rd…).  
* Assign players to one of the orderings.

**Pitfalls**

* Still doesn’t fix all carryover effects—just balances them.  
* Requires each condition be compatible with each position in the narrative.

**Example**  
You have 4 dilemma scenes (A, B, C, D) and want to avoid “late game fatigue” confounding one scene.

---

# **III. Measurement & Statistical Controls**

## **1\) Operationalization**

**In a game context:** This is the difference between “we studied empathy” and “we measured X, Y, Z.”

**How to implement**  
Define constructs as **specific metrics**, like:

* “Prosocial choice rate” \= % of dilemmas where player chooses options tagged prosocial  
* “Decision latency” \= time from options shown → selection  
* “Exploration” \= optional dialogue lines viewed / total  
* “Rule compliance” \= did they follow instructions in a tutorial check

**Pitfalls**

* If your operational definition doesn’t match the construct, your conclusion is weak.  
* If tagging choices (“good vs bad”) is subjective, you need inter-rater reliability or explicit rules.

**Example**  
Instead of “stress,” you measure:

* time pressure condition \+ increased misclicks \+ shorter deliberation \+ self-report “felt rushed”

---

## **2\) Blind Data Scoring**

**In a game context:** Analysts shouldn’t know which condition is which while cleaning and scoring.

**How to implement**

* Replace condition labels with neutral codes (`C1, C2, C3`).  
* Keep the mapping file separate until after:  
  * exclusions are decided  
  * scoring rules are finalized  
  * primary analysis is run

**Pitfalls**

* If analysts can infer condition from obvious variables (like a unique tutorial line), blinding fails.  
* Debug columns and comments can leak condition meaning.

**Example**  
Your dataset shows `condition=C2`, not “empathy framing.”

---

## **3\) Pre-registration**

**In a game context:** Especially valuable because games produce tons of variables (easy to p-hack).

**How to implement**  
Pre-register:

* Hypothesis  
* Primary outcome(s)  
* Exclusion criteria (e.g., \< X minutes played, failed attention check)  
* Sample size target / stopping rule  
* Analysis method (tests, models)  
* Handling of multiple comparisons

**Pitfalls**

* Overly rigid prereg makes iteration hard; plan pilots separately.  
* If you don’t prereg, you can still do exploratory analysis—just label it honestly.

**Example**  
Primary endpoint: difference in prosocial choice rate between framing conditions across 6 pre-specified dilemmas.

---

## **4\) Triangulation**

**In a game context:** Combine behavior logs with at least one other data source.

**How to implement**

* Telemetry (choices, timings)  
* In-game micro-surveys after key moments  
* Post-session survey (mood, immersion, comprehension)  
* Optional qualitative interview for a subset

**Pitfalls**

* Surveys can introduce demand characteristics; keep them minimal and well-timed.  
* Too much surveying breaks immersion and changes play.

**Example**  
Telemetry shows more “betrayal” under time pressure; post-session survey shows players *felt* less control and more panic—supporting interpretation.

---

# **IV. Participant Influence & Environment Controls**

## **1\) Anonymity & Confidentiality**

**In a game context:** This affects honesty and reduces “I want to look good” responding.

**How to implement**

* Use a random participant ID not tied to email/username in the analysis dataset.  
* Store personally identifying info separately (or don’t collect it).  
* Minimize free-text that may contain identifying details.  
* Be clear about retention and access.

**Pitfalls**

* Steam IDs / console IDs can be identifying.  
* Chat logs or typed names can reveal identity.

**Example**  
Gameplay events use `pid=8f3a…` and no name. Any incentive email list is stored separately.

---

## **2\) Naturalistic Observation**

**In a game context:** Let people play at home as they naturally would, without a researcher present.

**How to implement**

* Remote build, minimal interruptions, no live facilitator.  
* Avoid heavy “you are being studied” messaging (while still obtaining consent).

**Pitfalls**

* Less control over environment (distractions, stream audiences, multitasking).  
* Harder to verify attention and comprehension.

**Example**  
You run the study as a “special playtest build” with consent screen; players proceed normally.

---

## **3\) Distractor (Filler) Tasks**

**In a game context:** These are perfect as side quests, minigames, travel segments, or neutral dialogue.

**How to implement**

* Insert neutral gameplay between key measurement moments.  
* Use filler to mask the connection between repeated dilemmas.

**Pitfalls**

* Filler that’s too fun/engaging changes mood and can become a confound.  
* Filler that’s boring increases dropout.

**Example**  
Between two moral dilemmas, the player does a short navigation puzzle unrelated to ethics.

---

# **Game-specific additions you should strongly consider (not in your list, but very relevant)**

### **Manipulation checks**

A quick check that your manipulation actually changed what you think it changed.

* Example: after a framing manipulation, ask 1 question: “How personally connected did you feel to the NPC?” (1–7)

### **Attention / comprehension checks**

Especially for remote play.

* Example: “Select option 2 to show you’re paying attention” (used sparingly)  
* Or embed comprehension checks diegetically: “What did the guard say the password was?”

### **Attrition and stopping rules**

Choice games have dropout at branching points.

* Decide in advance how you handle partial playthroughs.

### **Instrumentation consistency**

Frame rate, input lag, and UI scaling can affect decision time and misclicks.

* Log device type, FPS bucket, input method.

---

# **A practical “Study Design Doc” template for your game**

You can literally paste this into your design doc and fill it in:

1. **Research Question**  
   * What behavior are we studying in the game?  
2. **Hypothesis**  
   * Primary: …  
   * Secondary/exploratory: …  
3. **Independent Variable(s)**  
   * Condition A: …  
   * Condition B: …  
   * What must remain identical across conditions?  
4. **Dependent Variables (Operationalized)**  
   * Primary outcome: …  
   * Secondary outcomes: …  
   * Manipulation check: …  
5. **Design**  
   * Between-subject / within-subject / mixed  
   * Random assignment method:  
   * Counterbalancing / Latin square (if needed):  
6. **Bias Controls**  
   * Single/double blind approach:  
   * Standardized instructions location:  
   * Deception \+ debrief plan:  
7. **Participants**  
   * Recruitment channels:  
   * Inclusion/exclusion:  
   * Target sample size \+ stopping rule:  
8. **Procedure**  
   * Consent flow:  
   * Tutorial:  
   * Key scenes where measurement occurs:  
   * Surveys/prompts timing:  
9. **Data Handling**  
   * What is logged:  
   * Anonymization method:  
   * Storage \+ access:  
10. **Analysis Plan**  
* Pre-registered tests/models:  
* Exclusions:  
* Multiple comparisons handling:  
11. **Pilot Plan**  
* What we’re testing in pilot:  
* What success looks like:

---

# **Telemetry schema (so your data is actually analyzable)**

For choice-based experiments, you usually want *event-based logging* like:

* `session_start`: device, build version, locale  
* `condition_assigned`: `condition_id`  
* `scene_enter`: `scene_id`  
* `choice_presented`: `choice_set_id`, options shown, time  
* `choice_made`: chosen option, response time, cursor/controller type  
* `scene_outcome`: consequence variables  
* `survey_response`: item\_id, response  
* `session_end`: completion status, total time

Key fields to include in every event:

* `pid` (anonymous participant id)  
* `sid` (session id)  
* `timestamp`  
* `build_version`  
* `condition_id`

---

## **If you tell me one thing, I can make this extremely concrete**

If you share your **actual research target** (examples: “empathy,” “risk taking,” “conformity,” “time pressure,” “political persuasion,” “moral licensing,” etc.) and the **type of choice moments** you have (dialogue choices, resource tradeoffs, stealth vs violence, etc.), I can turn the above into:

* A full experimental design (conditions \+ exact manipulations)  
* A counterbalanced scene ordering plan  
* Specific operational definitions  
* A prereg-style analysis outline  
* A debrief script that fits your game’s tone

But even without that, the framework above is the full map from “psych methods” → “choice game implementation.”
