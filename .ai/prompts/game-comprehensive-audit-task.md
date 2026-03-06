Audit target: Grand Central Terminus (Lux Story).

ROLE
You are a professional AAA video game analyst running a comprehensive, evidence-graded audit for an in-development narrative game with stealth-assessment systems.

CONTEXT SOURCES TO USE
- Data dictionary: `docs/reference/data-dictionary/*.md`
- Patent draft: `docs/03_PROCESS/archive/ai_analysis/GCT_Patent_Application.md`
- QA artifacts and reports if provided (latency, emitter parity, narrative coverage, accessibility checks)
- Build/playtest notes if provided

SOURCE PRECEDENCE (HIGHEST -> LOWEST)
1. Current QA/release-truth artifacts (latest dated JSON/MD in `docs/qa/` and release checklist)
2. Runtime evidence (test logs, command outputs, CI artifacts)
3. Current implementation contracts (content/lib/component source)
4. Data dictionary and architecture docs
5. Patent claims (intent/reference, not proof of shipped behavior)

CLAIM DISCIPLINE
- Distinguish:
  - `Shipped & Verified` (E1/E2),
  - `Implemented but Unverified` (E0),
  - `Declared Intent Only` (docs/patent without runtime evidence).
- Never score a patent/data-dictionary claim as shipped unless runtime evidence exists.
- Never treat dictionary counts or patent language as proof of live runtime quality by themselves.
- If two artifacts conflict, explicitly name the conflict and resolve by recency + source precedence.

DO NOT INVENT DETAILS
If facts are missing (platform, version, patch, telemetry artifacts), either:
- state assumptions explicitly, or
- mark as unknown and "needs manual verification."

EVIDENCE RULES
- `Observed (E0)`: static artifact inspection only.
- `Observed (E1)`: runtime/log/command evidence provided.
- `Verified (E2)`: automated test evidence provided.
- Never present E0 as runtime fact.

AUDIT GOAL
Assess three layers simultaneously:
1. Product quality now (UX, systems, reliability)
2. Capability fidelity (does implementation match declared data contract + patent-level intent)
3. Expansion opportunity (high-leverage next capabilities)

MANDATORY CAPABILITY COVERAGE (from data dictionary + patent)
For each capability, assign status: `Strong`, `Partial`, `Dormant`, or `Not Evidenced`, with evidence grade:
1. Pattern inference (5-pattern emergence, thresholds, pattern feedback)
2. Trust/vulnerability progression (trust-gated arcs and relationship depth)
3. Consequence echo/memory continuity (cross-character callback behavior)
4. Interrupt windows (timed emotional choices, consequence handling, missed behavior)
5. Simulation contract (20 simulations, phase/difficulty progression integrity)
6. Skill demonstration capture (implicit skill evidence from choices)
7. Career mapping quality (evidence-based recommendations vs generic output)
8. Knowledge flag propagation (state consistency and narrative continuity)
9. Derivative/trajectory logic (momentum/change-over-time signals where implemented)
10. UI accessibility contract (keyboard safety, focus, color-blind readiness, readability)
11. Telemetry integrity (event emitters, choice latency, analytics parity)
12. Stealth assessment quality (guidance without feeling like a test)
13. Engagement validation system (hook quality, retention friction points, completion risk)
14. Cognitive assessment alignment (domain logic consistency, overclaim risk, interpretation clarity)
15. Research/ethics posture (data collection boundaries, consent/transparency, safe interpretation limits)

OUTPUT FORMAT (STRICT)

# Comprehensive Audit: Grand Central Terminus

## 0) Scope, Inputs, and Assumptions
- Build/version under review
- Input artifacts actually used
- Declared assumptions
- Unknowns requiring manual verification

## 1) Executive Snapshot
- 6-axis scorecard (0-10) with one-line rationale:
  - Interaction feel
  - Systems depth
  - Narrative/world coherence
  - Capability fidelity (data dictionary + patent intent)
  - UX/accessibility
  - Technical reliability/performance
- For each axis include evidence refs in brackets, e.g. `[docs/qa/...json]` or `[needs manual verification]`.
- Top 3 strengths
- Top 3 ship risks
- Each strength/risk must include at least one evidence reference.

## 2) Product Context
- Genre/subgenre, developer/publisher, release context (if known)
- Core gameplay loop in 1-2 sentences
- One-sentence design-intent hypothesis

## 3) Moment-to-Moment Feel (3Cs, adapted)
- Character/embodiment (identity expression via dialogue/system response if no avatar locomotion)
- Controls/input model (consistency, accessibility, key conflicts, accidental commits)
- Camera/framing (for UI-first games: hierarchy, scanability, overlay clarity)
- Where this layer elevates play vs creates friction

## 4) Systems & Gameplay Depth
- Primary verbs and combination space
- Simulation depth and progression quality
- Difficulty/pacing/repetition analysis
- Replay delta (what meaningfully changes on subsequent runs)

## 5) Narrative, Worldbuilding, and Ludonarrative Fit
- Structure and pacing (setup -> escalation -> payoff)
- Character arc quality and emotional beats
- World coherence, iceberg depth, contradiction quality
- Alignment/misalignment between narrative claims and mechanics

## 6) Capability Contract Review
Provide a table:
- Capability
- Expected behavior (from docs/patent)
- Current evidence
- Status (Strong/Partial/Dormant/Not Evidenced)
- Maturity (`Shipped & Verified` / `Implemented-Unverified` / `Declared-Only`)
- Risk if unchanged
- Smallest safe next step

## 7) Technical, Telemetry, and Reliability
- Performance/readability findings (known or unknown)
- Input safety and overlay behavior reliability
- Telemetry coverage and trustworthiness
- Data integrity risks (state drift, contract mismatch, missing verification)

## 8) Evidence-Graded Findings (Priority Ordered)
For each finding use:
- ID
- Severity: P0/P1/P2/P3
- Area
- Certainty: Observed (E0/E1/E2) or Inferred
- Finding
- Evidence (artifact path, snippet, or runtime proof)
- Impact
- Smallest safe fix
- Verification method

Include at minimum:
- 2 high-priority risks
- 3 medium-priority risks
- 3 strengths with the same evidence rigor
- If evidence is only E0, explicitly state that runtime/player impact remains unproven.

## 9) Root Cause Clusters
Cluster findings by root cause, not symptoms.
Name each cluster and list impacted findings.

## 10) Fix Queue (Actionable)
Provide a concise table:
- Priority
- Task
- Owner type (Eng / Design / Narrative / QA / Data)
- Effort (S/M/L/XL)
- Dependencies
- Acceptance criteria
- Evidence gate to close ticket (E1/E2 target)

## 11) Expansion Opportunities (Next 90 Days)
- 5-8 high-leverage capability expansions
- For each: why it matters, prerequisite, effort, expected player impact
- Prioritize opportunities that improve both narrative depth and guidance validity

## 12) Run-Robustness Addendum
- List top 5 checks that must pass before calling this build "audit-ready" for external review.
- For each check include:
  - exact artifact or command,
  - owner,
  - fail condition.

## 13) Final Verdict
- Concise strengths vs weaknesses summary
- Who this game currently serves best vs who may bounce
- Recommendation in this form:
  - Play if you want ___
  - Skip if you dislike ___

QUALITY BAR
- Professional, critical, balanced tone.
- Claims must be tied to evidence.
- Uncertainty must be explicit and localized.
- Prefer specific examples over broad statements.
