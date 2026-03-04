# Grand Central Terminus UI/UX Review: Findings + Team Dialogue
Date: March 3, 2026
Status: Documentation only (no code changes implemented)

## Purpose
Capture the external UI/UX review, our internal response, and agreed direction before any implementation work.

## Participants
- External reviewer: Claude
- Internal team context/response: Codex + project team

---

## 1) External Reviewer Findings (As Submitted)

### Executive ratings
- Visual foundation: strong (dark cinematic atmosphere, glassmorphism, teal accent language)
- Interaction reliability: moderate concerns
- Mobile readiness: moderate concerns
- Overall assessment provided:
  - `7.5/10 visual`
  - `6/10 interaction reliability`
  - `7/10 mobile readiness`

### Core issue framing
- Main concern is structural UX, not visual style.
- Narrative container can consume too much viewport, pushing responses/choices below fold on mobile.
- Interaction friction compounded by:
  - keyboard scoping bug risk
  - selector ambiguity risk
  - layout/padding inefficiencies

### Priority fixes proposed by reviewer
1. Scope keyboard choice handling (High)
2. Disambiguate `data-choice-index` selectors (Medium)
3. Make footer/answer padding responsive (Medium)
4. Improve settings menu positioning + accessibility semantics (Medium)
5. Suppress Framer Motion prop warnings in tests (Low)
6. Additional design observations:
  - narrative card sizing for short content
  - choice border consistency
  - reduce/remove "YOUR RESPONSE" label
  - simplify/phase-in status indicators in header

### Reviewer-proposed sprint order
`1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8`

---

## 2) Internal Response (Current)

### Agreement (high confidence)
- We agree with priority of reliability-first changes.
- Highest ROI sequence is still:
  1. Keyboard scoping
  2. `data-choice-index` targeting cleanup
  3. Narrative/viewport layout tuning

### Internal nuance added
1. Keyboard safeguards likely required in two places:
   - global handlers in `GameChoices`
   - global shortcut handlers in `StatefulGameInterface`

2. `data-choice-index` cleanup is low-risk and likely quick:
   - keep index attribute on interactive button only
   - update shortcut/focus queries to target `button[data-choice-index=...]`

3. Narrative sizing changes should preserve current single-scroll architecture:
   - prefer reducing min-heights first
   - avoid reintroducing nested scroll unless required by evidence

4. Footer padding should be responsive/tokenized:
   - move mobile-specific behavior into explicit constants/tokens
   - avoid globally forcing mobile padding assumptions on desktop/tablet

5. Settings menu accessibility/positioning:
   - likely best solved via Radix primitives for robust modal/focus behavior
   - better than custom one-off focus trap logic

---

## 3) Back-and-Forth Record

### External reviewer to team
- Delivered comprehensive UX critique and concrete fix proposals with sample implementation strategy.
- Emphasized mobile-first usability and interaction reliability over purely visual polish.

### Team to external reviewer (current posture)
- Acknowledged the review as strong and directionally correct.
- Confirmed we are not implementing yet.
- Requested to document findings and response first, then stage implementation in sequenced passes.

### Team’s provisional implementation intent (not yet executed)
- Pass 1 (safety/reliability): fixes #1 and #2 + tests
- Pass 2 (layout/a11y): fixes #3 and #4
- Pass 3 (polish/noise): remaining design/test cleanup items

---

## 4) Evidence Context Used
- External reviewer write-up (provided in thread)
- Existing project architecture/context brief
- Existing screenshots:
  - `/analysis/reviewer-assets/game-ui-desktop-1440x900.png`
  - `/analysis/reviewer-assets/game-ui-mobile-iphone14.png`
- Prior audit notes and runtime observations already recorded in project QA docs

---

## 5) Decision Log

### Decision D1
- Document first, no implementation in this step.
- Rationale: preserve review intent and team alignment before touching runtime behavior.

### Decision D2
- Treat keyboard scoping + selector ambiguity as first implementation wave when execution begins.
- Rationale: highest risk reduction for accidental/incorrect choice commits.

### Decision D3
- Treat narrative/answer container adjustments as layout tuning with regression checks.
- Rationale: high user impact but higher chance of layout side effects.

---

## 6) Open Questions (For Next Working Session)
- Should settings open-state be lifted to parent or mirrored in store for global input gating?
- Do we want to keep strict single-scroll only, or permit optional narrative internal scroll at extremes?
- Should "YOUR RESPONSE" label be removed globally or only on small viewports/after onboarding?
- Are there product constraints requiring persistent header status text for all users?

---

## 7) Next Step (When Approved)
- Convert this document into a concrete implementation checklist with per-file diffs and tests.
- No code execution in this phase.

