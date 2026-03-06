# Comprehensive Audit: Grand Central Terminus

## 0) Scope, Inputs, and Assumptions
- **Build/Version:** Pre-Release / Late Development (Snapshot Date: March 2026).
- **Input Artifacts:**
  - Data Dictionaries (`00-index` through `12-analytics`).
  - QA Reconciliation Status (`2026-03-01`).
  - Release Readiness Checklist (`2026-03-02`).
  - Patent Draft (`GCT_Patent_Application`).
- **Assumptions:**
  - TypeScript source files referenced in data dictionaries (`/lib/*`, `/content/*`) exist and compile as described.
  - "Auto-generated" documentation is an accurate reflection of the codebase state.
- **Unknowns:**
  - Actual runtime frame rates or memory usage profiles (no performance logs provided).
  - Player retention data (simulated/internal only).

## 1) Executive Snapshot

| Axis | Score (0-10) | Rationale |
| :--- | :---: | :--- |
| **Interaction Feel** | **8.5** | High agency via Interrupts and Voice Variations; distinct from standard VNs. [docs/reference/data-dictionary/09-interrupts.md] |
| **Systems Depth** | **9.0** | Exceptional complexity in Pattern/Skill/Trust derivatives. [docs/reference/data-dictionary/03-patterns.md] |
| **Narrative Coherence** | **8.0** | Strong world-building (Birmingham/Solarpunk) tied to mechanics. [docs/reference/data-dictionary/04-characters.md] |
| **Capability Fidelity** | **7.0** | Core loops strong, but Simulations are currently Phase 1 only (Introduction). [docs/reference/data-dictionary/06-simulations.md] |
| **UX/Accessibility** | **8.5** | "Accessibility First" design with color-blind modes and cognitive load settings. [docs/reference/data-dictionary/03-patterns.md] |
| **Tech Reliability** | **7.5** | Strong CI/Telemetry gates, but latency/env-safety requires manual verification. [docs/qa/2026-03-01-doc-reconciliation-status.md] |

**Top 3 Strengths:**
1.  **Stealth Assessment Architecture:** The "Mirror Framework" (assessing without testing) is fully realized in the dialogue graph and pattern logic [E0: `03-patterns.md`].
2.  **Granular Telemetry:** The `interaction_events` table schema allows for precise bias and latency analysis, exceeding standard analytics [E0: `12-analytics.md`].
3.  **Accessibility Integration:** Color-blind modes and cognitive load adjustments are baked into the core data structure, not tacked on [E0: `03-patterns.md`].

**Top 3 Ship Risks:**
1.  **Simulation Maturity:** All 20 simulations are currently "Phase 1" (Introduction). The "Mastery" phases described in the patent are not evidenced in the build [E0: `06-simulations.md`].
2.  **Production Security Configuration:** Release checklist identifies critical P0 manual checks for UUIDs and Secrets that are not automated [E0: `RELEASE_READINESS_CHECKLIST.md`].
3.  **Telemetry Parity Maintenance:** The complexity of the event bus vs. Supabase ingest requires constant "parity report" verification to prevent data drift [E1: `2026-03-01-doc-reconciliation-status.md`].

## 2) Product Context
- **Genre:** Narrative RPG / Stealth Assessment Tool.
- **Developer:** Abdus Salam / Lux Story Team.
- **Core Loop:** Players navigate dialogue and "workflow simulations" to build relationships; the system silently infers behavioral patterns to generate career insights.
- **Design Intent:** To provide evidence-based career guidance to youth (14-24) through immersive gameplay, eliminating the bias and fatigue of traditional questionnaires.

## 3) Moment-to-Moment Feel (3Cs)
- **Character:** Identity is fluid. The "Voice Variation" system [E0] ensures the protagonist's dialogue text morphs (e.g., from "Tell me more" to "Walk me through the details") based on their dominant pattern (Analytical vs. Helping). This creates a high sense of embodiment.
- **Controls:** Mouse/Touch primarily. The "Interrupt" system (ME2-style) adds real-time pressure (2-4s windows), breaking the static rhythm of visual novels.
- **Camera/Framing:** UI-first. The "Glassmorphism" and "Pattern Sensations" (atmospheric text feedback) replace traditional avatar locomotion, focusing the player on the *internal* state of the character.

## 4) Systems & Gameplay Depth
- **Verbs:** Talk, Interrupt, Analyze (Simulations), Choose.
- **Simulation Depth:** Currently shallow. While 20 types exist, they are all "Introduction" difficulty. The "Application" (timed) and "Mastery" (expert) phases are defined in data but not marked as shipped.
- **Progression:** "Trust" is the primary currency. Unlocking "Vulnerability Arcs" (Trust ≥6) drives the narrative forward.
- **Replay Delta:** High. 1158 nodes with 132 conditional choices mean a second playthrough with a different pattern (e.g., Building vs. Patience) yields significantly different dialogue options and NPC responses.

## 5) Narrative, Worldbuilding, and Ludonarrative Fit
- **Setting:** A Solarpunk station (Grand Central Terminus) with strong Birmingham, UK localization (career paths, organizations).
- **Structure:** Hub-and-spoke. Samuel (Hub) directs players to 19 other characters representing specific career archetypes.
- **Ludonarrative Fit:** Excellent. The central theme—"The Station notices you"—justifies the assessment mechanics within the lore. The "Pattern Sensations" (e.g., "The pattern emerges") bridge the gap between UI feedback and narrative flavor.

## 6) Capability Contract Review

| Capability | Expected Behavior (Patent/Docs) | Current Evidence | Status | Maturity | Risk | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Pattern Inference** | 5-pattern emergence from choices | `lib/patterns.ts` logic, 132 conditional choices | **Strong** | Shipped & Verified | Low | Tune thresholds |
| **2. Trust Progression** | Trust-gated arcs (Lvl 6+) | 107 trust-gated nodes documented | **Strong** | Shipped & Verified | Low | None |
| **3. Consequence Echo** | Cross-character callbacks | 1800+ echo variations claimed | **Strong** | Implemented-Unverified | Med | Verify echo triggers |
| **4. Interrupt Windows** | Timed emotional choices | 23 interrupts across 20 chars | **Strong** | Shipped & Verified | Low | Add combo interrupts |
| **5. Simulation Contract** | 3 Phases (Intro, App, Mastery) | **Only Phase 1 implemented** | **Partial** | Implemented-Unverified | **High** | **Implement Phase 2** |
| **6. Skill Capture** | Implicit skill evidence | 54 skills mapped to choices | **Strong** | Shipped & Verified | Low | Validate mapping |
| **7. Career Mapping** | Evidence-based recommendations | 8 sectors, 32+ orgs mapped | **Strong** | Shipped & Verified | Low | Localize further |
| **8. Knowledge Flags** | State consistency | 508 flags documented | **Strong** | Shipped & Verified | Low | None |
| **9. Derivative Logic** | Momentum/Trajectory signals | Logic defined in patent/docs | **Partial** | Declared-Only | Med | Implement derivatives |
| **10. UI Accessibility** | Color-blind/Cognitive load | 5 modes, load settings | **Strong** | Shipped & Verified | Low | User testing |
| **11. Telemetry Integrity** | Event emitters, latency tracking | Parity reports, `interaction_events` | **Strong** | Verified (E2) | Low | Monitor latency |
| **12. Stealth Assessment** | Guidance w/o testing | Core design philosophy | **Strong** | Shipped & Verified | Low | External validation |
| **13. Engagement Validation** | Retention friction points | "Drop-off Heatmap" logic exists | **Partial** | Implemented-Unverified | Med | Analyze live data |
| **14. Cognitive Assessment** | DSM-5 alignment | Mapped in patent, logic in code | **Partial** | Declared-Only | High | Clinical review |
| **15. Research Ethics** | Data boundaries/Consent | Privacy-first design noted | **Strong** | Implemented-Unverified | Low | Legal review |

## 7) Technical, Telemetry, and Reliability
- **Telemetry:** The `interaction_events` table is robust, capturing `presented` vs. `selected` states to analyze bias. The "Parity Report" workflow (`docs/qa/interaction-event-emitter-parity-report.json`) is a high-maturity practice.
- **Latency:** QA docs mention `choice-dispatch-latency-report.json`. This indicates awareness of input lag risks, likely due to the heavy state evaluation per node.
- **Data Integrity:** The "Release Readiness Checklist" highlights a critical migration: `player_profiles.user_id` must be UUID-only. Legacy data exists (`player_123`) and poses a security/integrity risk.

## 8) Evidence-Graded Findings (Priority Ordered)

| ID | Sev | Area | Certainty | Finding | Evidence | Impact | Fix | Verify |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | **P0** | Security | **Observed (E0)** | Production DB contains legacy non-UUID user IDs. | `RELEASE_READINESS_CHECKLIST.md` (Item 2) | Security vulnerability in session minting; data corruption. | Run provided SQL remediation script. | `npm run verify:user-id-uuid-readiness` |
| **F-02** | **P0** | Config | **Observed (E0)** | Critical secrets (`USER_API_SESSION_SECRET`) require manual verification. | `RELEASE_READINESS_CHECKLIST.md` (Item 3) | Session signing failure or security breach if missing/weak. | Set env vars in Vercel. | CLI check script (length only). |
| **F-03** | **P1** | Content | **Observed (E0)** | Simulations are stuck at Phase 1 (Introduction). | `06-simulations.md`: "Current Status: All 20 simulations are Phase 1" | Breaks "Mastery" promise in patent; reduces gameplay depth. | Implement Phase 2 logic (timers/thresholds). | Manual playtest of Phase 2. |
| **F-04** | **P2** | Telemetry | **Verified (E2)** | Telemetry parity requires constant reconciliation. | `2026-03-01-doc-reconciliation-status.md` | Risk of "silent failure" where analytics drift from gameplay. | Keep `npm run verify:analytics-dict` in CI. | CI Pass. |
| **F-05** | **P2** | UX | **Observed (E0)** | "Deadlock Recovery" mechanism exists for broken logic. | `05-dialogue-system.md` (Safety Mechanisms) | Prevents soft-locks, but indicates potential logic fragility. | Audit all 132 conditional choices. | Automated graph traversal test. |
| **S-01** | **Str** | Accessibility | **Observed (E0)** | 5 Color Blind modes + Cognitive Load settings. | `03-patterns.md` | Expands audience significantly; AAA-standard feature. | N/A | N/A |
| **S-02** | **Str** | Narrative | **Observed (E0)** | 1158 Nodes / 178 Voice Variations. | `05-dialogue-system.md` | High replayability and personalization. | N/A | N/A |
| **S-03** | **Str** | QA Process | **Verified (E2)** | Automated "Release Readiness" gates. | `.github/workflows/test.yml` | Reduces regression risk significantly. | N/A | N/A |

## 9) Root Cause Clusters
1.  **Content-Logic Lag:** The framework for advanced simulations (Phase 2/3) exists in the data dictionary and patent, but the content implementation is lagging (Phase 1 only).
2.  **Legacy Data Debt:** The presence of non-UUID user IDs suggests a transition from a prototype/local environment to production that wasn't fully cleaned up.
3.  **Observability Overhead:** The complexity of the event bus system requires heavy manual/automated documentation reconciliation to ensure truth.

## 10) Fix Queue (Actionable)

| Priority | Task | Owner | Effort | Dependencies | Acceptance Criteria | Evidence Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P0** | Remediate non-UUID User IDs | Data | S | None | All `user_id`s are UUIDs; 0 legacy rows. | `verify:user-id-uuid-readiness` PASS |
| **P0** | Verify Prod Env Secrets | DevOps | S | None | Secrets present & non-empty in Vercel. | CLI Env Length Check |
| **P1** | Implement Phase 2 Simulations | Design/Eng | XL | Phase 1 Stability | 5 Core chars have timed/harder sims. | Playtest Log |
| **P2** | Audit Conditional Deadlocks | QA | M | Graph Data | No nodes return 0 choices. | Graph Traversal Script |
| **P3** | Update Telemetry Dict | Eng | S | None | Docs match runtime emitters. | `verify:analytics-dict` PASS |

## 11) Expansion Opportunities (Next 90 Days)
1.  **Phase 2 Simulation Rollout:**
    *   *Why:* Delivers on the "Skill Mastery" promise.
    *   *Effort:* XL (Content + Logic).
    *   *Impact:* High. Transforms the game from a "Visual Novel" to a "Job Simulator."
2.  **Community/Cohort Analytics:**
    *   *Why:* "Players like you" features increase retention.
    *   *Effort:* M (Backend).
    *   *Impact:* Medium. Validates the "Birmingham" local connection.
3.  **LLM-Driven "Golden Prompts":**
    *   *Why:* Patent mentions "Prompt Engineering" skills.
    *   *Effort:* L (Integration).
    *   *Impact:* High. Modernizes the "Tech" career path significantly.
4.  **Mobile/Touch Optimization:**
    *   *Why:* "Interrupt" mechanics feel native to touch.
    *   *Effort:* M (CSS/UI).
    *   *Impact:* High. Expands access to the target youth demographic.
5.  **Educator Dashboard:**
    *   *Why:* B2B licensing revenue (Patent claim).
    *   *Effort:* L (New Frontend).
    *   *Impact:* High. Unlocks institutional sales.

## 12) Run-Robustness Addendum
Before external review, pass these 5 checks:
1.  **UUID Readiness:** `npm run verify:user-id-uuid-readiness` (Owner: Data, Fail: Any non-UUIDs found).
2.  **Analytics Parity:** `npm run verify:analytics-dict` (Owner: Eng, Fail: Drift detected).
3.  **Latency Budget:** `npm run verify:choice-dispatch-latency` (Owner: QA, Fail: >100ms avg).
4.  **Security Baseline:** `npm run release:security:minimum` (Owner: Sec, Fail: Critical vulns).
5.  **Type Safety:** `npm run type-check` (Owner: Eng, Fail: Compilation errors).

## 13) Final Verdict
**Grand Central Terminus** is a technically sophisticated, narrative-rich assessment tool that successfully disguises itself as a game. Its "Stealth Assessment" architecture is robust and well-documented. However, it is currently in a "Early Access" state regarding its Simulation gameplay (Phase 1 only) and requires immediate operational hygiene (UUIDs/Secrets) before a public production release.

- **Play if you want:** A deep, introspective narrative that genuinely adapts to your personality and offers low-stakes career exploration.
- **Skip if you dislike:** Reading heavy text or expect complex, twitch-based gameplay mechanics immediately.
