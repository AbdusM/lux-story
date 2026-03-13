# Labor market signals loop (Phase 1): Signal -> Plan -> Proof

This PRD defines a Phase 1 product loop that turns early AI-adoption signals into
reversible user actions and employer-proof artifacts, without “predicting job loss”
or presenting false precision.

Core thesis:
Translate early AI adoption signals into concrete entry-path decisions and
employer-proof artifacts, before unemployment becomes the headline.

---

## 1) Why Now

The underlying research suggests the earliest detectable labor-market effects of
AI may appear as subtle shifts in hiring and entry funnels, not headline
unemployment spikes.

If we wait for unemployment to spike to become “obviously useful,” we’ll lose
the window where learners are still choosing paths, building portfolios, and
finding first roles.

---

## 2) Who This Is For (Phase 1)

Primary:
- Learners exploring career lanes and building early proof (default assumption: ages 18-25, but not exclusive).

Secondary:
- Counselors/admins who want to review and validate learner plans and proof artifacts.

Not Phase 1:
- Employers as a first-class product user. We can generate employer-readable artifacts, but we are not building an employer marketplace.

---

## 3) Problem Statement

Learners face a changing entry-level labor market:
- Some roles are seeing meaningful AI adoption in core tasks.
- Entry funnels for young workers may tighten or reroute before aggregate unemployment signals move.

Learners need:
1. A calm, explainable view of signals (not doom or destiny).
2. A short-horizon plan that actually reduces entry friction.
3. Proof artifacts that translate their skill evidence into employer-readable signal.

---

## 4) Phase 1 Goals / Non-goals

Goals:
- Provide a role-level “signals card” that is explainable, uncertainty-aware, and action-oriented.
- Convert signals into a 90-day plan that directly targets entry friction levers.
- Produce at least one employer-readable proof artifact per plan.
- Support counselor/admin review and feedback on the plan and proof artifacts.

Non-goals (hard boundaries):
- No individual job-loss prediction.
- No claims like “AI will replace your job.”
- No precise numeric scores presented without uncertainty and “why” explanations.
- No alerting system that creates anxiety without clear alternatives and opt-in.
- No “labor market twin” simulation shipped to end users in Phase 1.

---

## 5) Definitions (Product Primitives)

### 5.1 Observed Exposure
Observed exposure is a role/task signal that combines:
- Theoretical feasibility (what models could do in principle)
- Observed adoption/usage signals (what people are actually doing in practice)
- Automation vs augmentation weighting (automated workflows carry higher displacement risk than augmentative use)
- Work-context relevance (professional settings weighted above casual)

Observed exposure is NOT “replaceability.”
It is a signal that AI is touching core tasks.

### 5.2 Entry Friction
Entry friction is the difficulty of entering a target lane in the next 30-90 days.

Phase 1 should treat entry friction as a small set of robust proxies (not perfect truth):
- Hiring slowdown / reduced entry-level openings
- Credential inflation / portfolio expectations
- Internship/apprenticeship scarcity
- Geographic or institutional constraints (when known)

Entry friction is NOT “career quality.”

### 5.3 Complementarity
Complementarity is the degree to which the learner’s strengths map to work where
humans gain leverage from AI rather than compete head-on with it.

Examples:
- judgment under ambiguity
- orchestration and workflow design
- domain translation and communication
- verification and risk management

Complementarity is NOT “AI literacy” alone.

### 5.4 Posture (Defend / Balance / Attack)
We support three learner postures:
- Defend: reduce downside, prioritize resilient adjacent routes and “human moat” skills.
- Balance: stay on target path but build differentiating proof and complementarity.
- Attack: lean into AI-native lanes and differentiate quickly.

The posture is not moral framing. It is a user-controlled strategy selector.

---

## 6) Trust Contract (Non-negotiable)

Phase 1 UX and copy must satisfy:
1. We do not predict individual job loss.
2. We do not claim “AI will replace your job by date X.”
3. We present signals + confidence + “why” + actions.
4. Every label/flag must have an explanation: “why this appears.”
5. Users can override: “this doesn’t match my reality.”
6. Young-user safe UX: calm language, opt-in for high-salience notifications, and always include alternatives.

---

## 7) Phase 1 Product Loop

### 7.1 Signals Card (Insight)
Surface in student insights as an additional section.

Outputs for a selected target lane:
- Observed exposure: level + confidence + top reasons
- Entry friction: level + confidence + top reasons
- Growth context: high-level context with provenance (e.g., BLS projections)
- “What this does NOT mean” block (anti-doom framing)

Design constraints:
- Prefer ordinal labels (“low / medium / high”) plus confidence and reasons.
- Avoid single-number scores unless uncertainty is visible.

### 7.2 90-Day Plan (Intervention)
Generate a plan that directly targets entry friction levers.

Plan structure (minimum viable):
- 1 proof artifact
- 1 market move (applications/networking/target list)
- 1 skill move (practice loop tied to complementarity)
- 1 adjacent-route option (reroute candidate with rationale)

Plans are posture-dependent:
- Defend: prioritize adjacent routes + resilience skills
- Balance: keep target but emphasize proof and complementarity
- Attack: fast differentiation and AI-native proof

### 7.3 Proof Artifact (Proof)
Generate one employer-readable output per plan.

Phase 1 artifact types:
- Resume bullet set (evidence-backed)
- Portfolio “project one-pager”
- Interview story bank (STAR-like)

Constraint:
- Artifacts must be specific to the learner’s evidence, not generic templates.

### 7.4 Counselor/Admin Review (Safety + Quality)
Counselors/admins can:
- view the signals card (with provenance)
- review learner plan and proof artifact
- provide feedback and/or approve as “ready to apply”

Rollout note:
Start with counselor/admin review before enabling broad self-serve sharing externally.

---

## 8) Data & Provenance (Phase 1)

### 8.1 Minimum Viable Data Inputs
Required:
- occupation taxonomy (SOC or internal mapping)
- task-to-occupation mapping (where available)
- observed exposure baseline by occupation family
- growth context (e.g., BLS projections)
- internal learner evidence and skill profile

Optional (Phase 2+):
- job postings feeds (Lightcast/Burning Glass/Indeed/LinkedIn, etc.)
- geo-specific demand
- wage feeds
- employer acceptance signals

### 8.2 Update Cadence
We must display freshness in-product.

Recommended defaults:
- observed exposure baseline: monthly or quarterly
- growth context: annual / source-updated
- entry friction proxies: monthly if external feeds exist, otherwise quarterly
- learner evidence: real time
- guidance rules: versioned, reviewed

### 8.3 Missing / Contradictory Data
Rules:
- If data is missing, show “unknown” with explanation and fall back to learner-driven planning (skills + proof).
- If data is contradictory, prefer conservative interpretation and present uncertainty explicitly.

---

## 9) UX Safety (Young Users)

Guidelines:
- No “doom alerts.” If we ship notifications later, they must be opt-in and always include adjacent-route alternatives.
- Copy should avoid catastrophic phrasing (“your career is dying”) and avoid certainty.
- Provide a “Talk to an advisor” path when signals are high-salience.
- Allow user override on lane selection and posture.

---

## 10) Metrics (How We Know This Works)

Primary (behavioral):
- signals card engagement (open rate, “why” open rate)
- posture selection distribution and changes over time
- plan adoption rate
- proof artifact completion rate
- adjacent-route exploration rate

Outcome-oriented (proxy outcomes):
- application-to-interview conversion (if we can measure)
- time-to-first-interview (self-report if needed)
- portfolio completion velocity
- re-engagement after receiving friction guidance

Trust / harm:
- “felt alarmist” rate (should be low)
- “felt understandable” rate (should be high)
- override rate (expected non-zero)

---

## 11) Engineering Decomposition (Buildable Units)

This section is intentionally “compilable” into tickets.

### 11.1 Data model (conceptual)
- `OccupationSignal`: exposure + friction + growth context + provenance + freshness
- `LearnerPlan`: posture + actions + linked proof artifact + timestamps + advisor feedback
- `ProofArtifact`: type + content + evidence links + export formats

### 11.2 API contracts (high-level)
- Fetch signals for a lane (by occupation code and/or user targets)
- Generate/update 90-day plan
- Generate/update proof artifact
- Submit counselor feedback / approval state

### 11.3 UI modules (student)
- Signals card section
- Posture selector (Defend/Balance/Attack)
- 90-day plan editor + progress tracking
- Proof artifact viewer/exporter

### 11.4 UI modules (admin/counselor)
- Learner plan review
- Proof artifact review
- Approval / feedback workflow

### 11.5 Telemetry
Add events for:
- `signals_viewed`
- `signals_why_opened`
- `posture_selected`
- `plan_generated`
- `plan_edited`
- `proof_generated`
- `proof_exported`
- `advisor_feedback_submitted`
- `advisor_approved`

---

## 12) Risks & Mitigations

Risk: false precision and loss of trust
- Mitigation: ordinal labels + confidence + “why” explanations; no destiny claims.

Risk: anxiety harm (young users)
- Mitigation: calm copy, opt-in notifications, always include alternatives, counselor review mode.

Risk: stale or weak data
- Mitigation: show freshness; degrade to “unknown” instead of guessing; versioned guidance rules.

Risk: generic proof artifacts
- Mitigation: tie proof to learner evidence; counselor review before broad self-serve.

---

## 13) Open Questions (To Resolve Before Phase 1 Lock)

- Taxonomy: Which occupation codes do we use as canonical (SOC, O*NET-SOC, internal mapping)?
- Provenance UI: what “why” reasons do we show without exposing private data sources?
- Evidence schema: what internal learner evidence is acceptable to quote verbatim in artifacts?
- Export: what formats are required first (PDF, docx, plain text)?
- Age/stage gating: do we tailor default posture based on age, or only on user choice?

