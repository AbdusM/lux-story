# Screen Triage Matrix & Play Clarity Contract

Last updated: 2026-03-06
Status: `active design triage`
Primary runtime basis: `main` at `97cb6b6`
Production alias: `https://lux-story.vercel.app`
Visual evidence basis: refreshed 2026-03-06 production screenshot pack captured from the `ede228e` runtime candidate, plus post-ship runtime verification on `97cb6b6`

## Purpose

Turn the strongest visual-review takeaways into an execution artifact that is specific enough to drive design and implementation.

This document is not a ship blocker list. It is a triage and contract artifact for the next frontend/product lane:

- convert shell identity into clearer play
- tighten the first playable minute
- define real mobile compaction rules
- unify the fiction across gameplay, simulation, profile, and research/system layers

Use this alongside `docs/03_PROCESS/plans/2026-03-06-frontend-redesign-contract.md`.

## Evidence Model

- `E0`: screenshot-backed or review-backed design inference
- `E1`: reproduced through explicit production/browser observation
- `E2`: backed by automated verification of related runtime behavior

This artifact is intentionally mixed-mode. Some decisions here are product-policy calls, not bug findings.

## Triage Legend

- `Ship-Ready`: acceptable to leave as-is for now; revisit only if broader art direction changes
- `Keep`: the direction is correct; preserve the concept but refine supporting details later
- `Revise`: strong base, but the current implementation undershoots the intended product quality
- `Rebuild`: the current surface or sequence is not converting the product promise into clear play

## Contract 1: First-Minute Payoff

The first playable minute must cash the aesthetic promise made by the landing and shell.

Rules:

1. By the end of the first screenful, the player should understand where they are and why this moment matters.
2. The first authored beat must contain a concrete tension, ask, interruption, or route signal. Atmosphere alone is not enough.
3. The first meaningful choice should appear quickly enough that the player experiences Lux Story as play, not as staging.
4. The first consequence should clarify that choices change relationship, route, tone, or future opportunity.

Forbidden failure modes:

- a premium shell containing low-density opening copy with no immediate stake
- more than one passive exposition beat before the first authored decision
- an opening that reads as onboarding ambiance rather than arrival

Acceptance targets:

- first meaningful decision visible within the opening flow on desktop and mobile
- opening copy contains at least one concrete stake, invitation, or disruption
- first minute communicates the loop: scene, tension, response, consequence

## Contract 2: Mobile Compaction

Mobile must have its own dramaturgy rather than inheriting desktop structure vertically.

Rules:

1. One primary question or prompt per view on small screens.
2. Stakes and immediate action stay closer together than on desktop.
3. Secondary context collapses before primary action does.
4. Small-screen layouts prioritize reachability, safe-area padding, and fast action access.
5. Simulation and profile surfaces must compact content semantically, not just shrink typography.

Acceptance targets:

- primary action reachable without chewing through duplicated context
- no clipped tabs, truncated mission titles, or safe-area collisions
- choice sheets fully occlude the underlying shell on small screens
- mobile-first variants can remove decorative density if they preserve tension and clarity

## Contract 3: Fiction Unification

Lux Story can contain narrative, simulation, and institutional surfaces, but they must belong to one authored system.

Rules:

1. `Terminus`, `Grand Central`, and the wider station language must remain the primary fiction wrapper.
2. Profile, research, and settings surfaces must feel like intentional adjacent lanes, not foreign products bolted on.
3. Admin/research seriousness is allowed, but it must be visually and linguistically framed as a separate utility layer.
4. Retro-terminal motifs, cinematic shell language, and institutional controls must not compete equally on the same screen.
5. If a tonal device such as pixel avatars remains, it needs a stronger fiction-facing rationale or it risks softening the product stakes.

Acceptance targets:

- player can explain the difference between story space, simulation space, and system space without confusion
- institutional trust surfaces do not collapse the magic circle unless intentionally entered
- naming, copy, and framing feel like one world with multiple lanes rather than three unrelated products

## Contract 4: Screen Triage Matrix

### 1. Landing / Home

Verdict: `Revise`
Evidence: `E0`

What is working:

- premium atmosphere
- clear CTA hierarchy
- strong title treatment
- recognizable palette and world tone

Why it is not ship-perfect:

- the quote/secondary copy risks reading as generic inspiration rather than world-authored invitation
- the screen communicates significance and mood more strongly than it communicates the loop
- it promises a meaningful arrival without yet delivering a concrete reason to care now

Next changes:

- replace generic inspirational framing with an in-world dispatch, route teaser, or character fragment
- show a more legible reason to enter now
- make the opening beat feel authored, not merely decorated

### 2. First Playable Minute

Verdict: `Rebuild`
Evidence: `E0`

What is working:

- strong atmosphere
- intimate shell
- credible tone for reflective play

Why it needs rebuild rather than polish:

- the opening content density undershoots the shell promise
- the player risks reading the first scene as setup rather than play
- there is not yet enough inciting force in the first beat

Next changes:

- rewrite the opening sequence around stake, interruption, and first consequence
- ensure the first meaningful decision lands earlier
- make the first minute answer: where am I, why now, and why should I respond

### 3. Core Gameplay Shell

Verdict: `Revise`
Evidence: `E1`, `E2`

What is working:

- shell geometry is materially more stable than before
- the atmosphere is distinctive
- response controls read cleanly
- the story lane is less polluted by dashboard/meta noise

Why it still needs work:

- the header footprint can still feel slightly large relative to prompt density
- some scenes feel underfilled rather than intentionally sparse
- prompt-to-response distance can weaken conversational rhythm

Next changes:

- tighten early-scene vertical rhythm
- reduce any remaining dead air before choice
- add ambient life or denser authored content where negative space currently reads as emptiness

### 4. Returning-Player Re-entry

Verdict: `Revise`
Evidence: `E0`, `E1`

What is working:

- the concept of a held route or renewed contact is good
- the copy direction is closer to fiction-facing than before

Why it still needs work:

- it can still read as a premium SaaS interruption more than a world event
- the nested treatment is structurally cleaner now, but not yet emotionally elegant
- CTA hierarchy may not yet express the most compelling emotional action

Next changes:

- redesign it as a station bulletin, conductor note, or held-route signal
- make the primary action feel like a story pull, not an alert response
- reduce "banner" energy and increase world-event energy

### 5. Simulation Shell

Verdict: `Revise`
Evidence: `E0`, `E1`, `E2`

What is working:

- strongest proof-of-product screen in the current set
- clear tension, scenario, and decision framing
- timed play reads as a real product loop
- detached dashboard chrome has already been reduced materially

Why it still needs work:

- desktop can tolerate repeated scaffolding, mobile cannot
- scenario summary and case-file framing can still duplicate meaning
- small screens need a faster route to action

Next changes:

- create a true mobile compaction rule for simulation context
- keep one short mission summary visible and collapse deeper case context
- optimize for action-under-pressure instead of complete upfront exposition

### 6. Settings Surface (Desktop)

Verdict: `Ship-Ready`
Evidence: `E0`

What is working:

- clear hierarchy
- premium palette and framing
- clean separation from active play
- respectable clarity for accessibility and profile controls

Why it is acceptable to hold:

- the remaining issues are mostly micro-polish, not product confusion
- the surface now reads like intentional system controls rather than menu sprawl

Next changes:

- optional polish only: micro-preview states, richer slider affordances, slightly clearer secondary copy contrast

### 7. Settings Surface (Mobile)

Verdict: `Revise`
Evidence: `E0`

What is working:

- the desktop logic carries over better than before
- the visual language stays coherent

Why it still needs work:

- the surface remains tall and heavy on mobile
- state chips and helper text can feel abstract or dense
- small screens need more immediate, less interpretive controls

Next changes:

- compact section framing for mobile
- add plainer labels or micro-previews for accessibility/display states
- reduce visual and cognitive depth before the user reaches the needed control

### 8. Profile / Journey Artifacts / Research

Verdict: `Revise`
Evidence: `E0`, `E1`

What is working:

- improved trust posture
- raw technical identifiers are no longer exposed by default
- "Journey Artifacts" is stronger language than generic dashboard naming

Why it still needs work:

- this lane still feels more institutional than magical
- research participation is important, but emotionally cold when surfaced too close to player identity/progression
- the profile lane does not yet convert enough of the game identity into progression energy

Next changes:

- make the profile lane feel more like a held route/history space than a responsible settings form
- push research seriousness one layer deeper where possible
- add stronger progression framing: routes, relationships, unlocks, or accumulated artifacts

### 9. Mobile Choice Sheet

Verdict: `Ship-Ready`
Evidence: `E1`, `E2`

What is working:

- prior clipping and bleed issues have been resolved
- response presentation is readable and functionally solid
- the sheet now behaves like a real mobile control layer rather than a broken overflow state

Why it can hold:

- the remaining button-width concern is aesthetic, not functional
- the surface now does the primary job well

Next changes:

- optional polish only: richer internal affordance treatment for full-width buttons

### 10. Pixel Avatar / Iconography Layer

Verdict: `Keep`
Evidence: `E0`

What is working:

- memorable
- charming
- tonally distinctive against the darker shell

Why it is unresolved:

- the contrast between pixel charm and emotionally mature shell can feel either intentional or split, depending on context
- the fiction justification is not yet strong enough to fully lock the choice

Next changes:

- either reinforce the in-world rationale for this visual language
- or gradually tune it toward the more mature station/simulation tone if that is the intended direction

## Priority Order

### P0

1. Rebuild the first playable minute.
2. Implement true mobile compaction rules.

### P1

3. Revise the return-hook into a world event.
4. Revise simulation context density for mobile and pressure scenarios.
5. Revise profile/research framing into a stronger progression lane.

### P2

6. Tighten gameplay-shell rhythm and dead-space handling.
7. Decide the long-term role of the pixel-avatar visual layer.
8. Apply polish-only improvements to choice affordance, settings micro-preview, and optical depth.

## Immediate Next Deliverables

1. A rewritten first-minute script and shell comp for desktop and mobile.
2. A mobile compaction spec with before/after examples for gameplay, simulation, settings, and profile.
3. A `keep / revise / rebuild / ship-ready` visual board for the major surfaces.
4. One follow-up browser review specifically for first-minute payoff and mobile action distance.

## Decision Rule

If a design choice preserves atmosphere but delays clarity, prefer clarity in the first five minutes.

If a design choice improves clarity but collapses the product's authored identity, redesign rather than flatten.
