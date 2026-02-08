Here’s the “AAA engineering culture \+ methodology stack” I’d teach to **agentic coding game developers** if the goal is: *ship a large, long-lived game codebase with a lot of iteration, content, branching logic, telemetry, and production discipline*—**without over-indexing on heavy graphics/perf yet**.

Think of this as an onion: **culture → workflow → architecture → automation → quality → shipping**. AAA isn’t “more clever code”; it’s *repeatable execution at scale*.

---

## **The quintessential AAA best-practices stack**

### **Layer 0 — North Star and constraints (the part teams skip and regret)**

**Methodologies:** product pillars, risk management, decision logs

* **Game pillars and “non-goals.”** Every system decision is either in service of a pillar or it’s tech vanity.  
* **Risk register \+ kill criteria.** AAA teams don’t avoid risk; they *name it early* (save/load, content pipeline, localization, build times, branching complexity).  
* **ADR discipline (Architecture Decision Records).** Tiny docs for “why we chose X.” This is rocket fuel for agentic devs (they can’t infer your context reliably).

**Train agents to produce:** a 1–2 page system proposal \+ an ADR for any choice that affects future code.

---

### **Layer 1 — Culture OS (this is what “top engineering environments” are made of)**

**Methodologies:** ownership model, blameless learning loops, sustainable pace, “build stays green”

1. **Small changes, continuously integrated.**  
2. **Code review as knowledge transfer \+ correctness gate.** Google’s guidance emphasizes review for correctness and comprehension/readability, not just style nitpicks. ([abseil.io](https://abseil.io/resources/swe-book/html/ch09.html?utm_source=chatgpt.com))  
3. **Blameless postmortems with actionable follow-ups.** (Treat incidents and regressions like engineering data, not personal failure.)  
4. **Tooling is a product.** Internal tools get roadmaps and quality bars because they compound velocity.  
5. **Quality is everyone’s job: dev \+ QA \+ design.** QA isn’t a “phase,” it’s a partner.

**Agent training hook:** every PR must include “intent, test, telemetry, rollback/flag plan.”

---

### **Layer 2 — Workflow and branching that doesn’t implode at 200k+ files**

**Methodologies:** trunk-based development, feature flags, short-lived branches, release branches

If you want AAA cadence, you want **merge pain to approach zero**.

* **Trunk-based development** (or a very close approximation): frequent merges to `main`, short-lived branches, constant integration. ([Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development?utm_source=chatgpt.com))  
* **Feature flags / content flags** so incomplete work can land safely and be tested without “big bang merges.”  
* **Branching is for releases, not development.** Development happens on trunk; release branches stabilize.

**Agent rules:**

* “No PR \> \~400 lines without explicit justification.”  
* “If it can’t be merged behind a flag, you probably designed it too big.”

---

### **Layer 3 — Build \+ CI as your heartbeat (AAA teams win or lose here)**

**Methodologies:** continuous integration, build reproducibility, build caching, build health SLAs, build farms

In big games, **build time is strategy**. It impacts everything: iteration, CI throughput, defect discovery, morale. Microsoft’s writeup on Call of Duty’s build insights is a good reminder that slow builds bottleneck verification of “every piece of code and content.” ([Microsoft Developer](https://developer.microsoft.com/en-us/games/articles/2025/03/gdc-2025-build-insights-call-of-duty-modern-warfare/?utm_source=chatgpt.com))

* **Per-change CI** (not just nightly): compile, unit tests, content validation, smoke boot, packaging checks.  
* **Reproducible builds**: same inputs → same output. Google’s release engineering chapter frames release engineering as ensuring consistent, repeatable release steps across the pipeline. ([sre.google](https://sre.google/sre-book/release-engineering/?utm_source=chatgpt.com))  
* **Build graph \+ caching**: treat the build like a DAG; cache artifacts; don’t rebuild the universe.  
* **Build health policy**: broken main is a P0. Fix \> feature work.

**Agent deliverables:**

* Every feature includes CI hooks (tests/validation) and doesn’t increase build time without measurement.

---

### **Layer 4 — Game architecture that scales with content, not heroics**

**Methodologies:** modular architecture, data-driven design, component-based design, dependency rules, versioned serialization

Because you’re not heavy-graphics yet, this is where you should go *hard*:

* **Hard module boundaries** (gameplay core vs UI vs tools vs data vs platform).  
* **Data-driven systems** (especially for choice games): content authors should be able to add/adjust narrative without code changes.  
* **Component / decoupling patterns**: classic game architecture patterns exist because game logic tends to sprawl. “Component” is a standard way to span domains without tightly coupling them. ([gameprogrammingpatterns.com](https://gameprogrammingpatterns.com/component.html?utm_source=chatgpt.com))  
* **Versioned save/load \+ migrations early.** Choice games become save-compatibility nightmares if you wait.  
* **Determinism where it matters** (replayable tests, consistent outcomes for the same state).

**A useful mental model (for agents):**

* *Code defines verbs (systems); data defines nouns (content/state).*

---

### **Layer 5 — Content pipeline as a first-class product (especially for choice/narrative)**

**Methodologies:** schema-first data, validation, authoring tools, localization pipeline, ID discipline

This is the “AAA without graphics” superpower.

* **Schema-first content**: define a strict schema for dialogue nodes, conditions, consequences, tags, localization keys.  
* **Validation gates** in CI:  
  * unreachable nodes  
  * missing localization keys  
  * circular dependencies  
  * broken references  
  * save-game migration coverage  
* **Diff-friendly formats** (where possible): JSON/YAML with stable ordering, or a custom format designed for mergeability.  
* **Tooling for designers**: editors, graph views, search, linting, preview, test-run harness.

**Agent training:** build “content lint” and “content unit tests” like you would for code.

---

### **Layer 6 — Testing pyramid for games (but adapted to reality)**

**Methodologies:** unit tests for pure logic, integration tests, golden tests, simulation harnesses, fuzzing for save/load

Most teams under-test because “games are hard to test.” AAA teams win by **carving the testable core**.

* **Pure logic unit tests**: rule evaluation, branching conditions, economy math, quest state transitions.  
* **Golden/master tests** for narrative: given a seed \+ initial state, the resulting state graph and key outputs match expected.  
* **Headless simulation**: run thousands of dialogue paths overnight and catch dead ends.  
* **Fuzz save/load**: serialize at random points, reload, verify invariants.

**Agent rule:** “If it’s deterministic, it gets a test. If it’s not deterministic, make a deterministic seam.”

---

### **Layer 7 — Observability and experimentation baked in (your earlier research angle fits perfectly)**

**Methodologies:** structured logging, analytics events, crash reporting, experiment framework, privacy-by-design

For choice games, telemetry isn’t “marketing analytics”—it’s **design truth**.

* **Structured events**: `choice_presented`, `choice_selected`, `outcome_applied`, `dialogue_node_enter`, `rollback_loaded`, etc.  
* **Experiment framework** for A/B tests (feature flags \+ consistent assignment \+ analysis-friendly logs).  
* **Crash dumps \+ symbol pipeline** early (crashes will happen; what matters is time-to-understand).  
* **Privacy/consent**: data minimization, clear retention.

If you want a *meta* methodology for engineering effectiveness, the Four Keys / DORA-style metrics (deploy frequency, lead time, MTTR, change failure rate) are a widely used lens for balancing speed and stability. ([Google Cloud](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance?utm_source=chatgpt.com))

---

### **Layer 8 — Release engineering \+ “live readiness” even before you’re live**

**Methodologies:** release pipelines, build promotion, staged rollout, rollback, launch checklists

Even if you’re not shipping live ops yet, build the bones:

* **Build promotion**: dev → QA → candidate → release  
* **Immutable artifacts**: don’t “hotfix” by hand; rebuild and promote  
* **Launch checklist mindset**: dependencies, versioning, migration, observability

Google’s release engineering framing (repeatable steps, consistent methodologies) is exactly what you want to emulate culturally, even if your stack differs. ([sre.google](https://sre.google/sre-book/release-engineering/?utm_source=chatgpt.com))

Riot’s “pipeline ownership” philosophy—teams owning the path from code to deployment—shows up in their talks on delivery pipelines as well. ([GDC Vault](https://www.gdcvault.com/play/1023327/-Continuous-Delivery-Pipelines-via?utm_source=chatgpt.com))

---

### **Layer 9 — Performance \+ DOD mindset (light touch for now, but don’t ignore it)**

**Methodologies:** data-oriented thinking, profiling culture, budgets, “measure before optimize”

You said no heavy graphics/gameplay yet, so don’t chase micro-optimizations. But do instill the **mindset** early:

* Structure data so it’s observable, testable, and scalable.  
* Avoid “abstraction castles” that make debugging impossible.

Data-Oriented Design is a useful corrective for over-abstracted designs, even before perf is critical. ([dataorienteddesign.com](https://www.dataorienteddesign.com/dodbook.pdf?utm_source=chatgpt.com))

---

## **The “non-negotiable” starter kit (ideal for where you are right now)**

If you implement only 10 things in the next phase, make them these:

1. **Trunk-based dev \+ short-lived branches** ([Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development?utm_source=chatgpt.com))  
2. **Feature/content flags** (so you can merge continuously)  
3. **Per-change CI** (build \+ tests \+ content validation)  
4. **Build health is sacred** (broken main is a stop-the-line event)  
5. **Schema-first narrative/content** \+ validation gates  
6. **Versioned save/load \+ migrations** (even if v0 is simple)  
7. **Headless simulation harness** for branching paths  
8. **Structured telemetry for choices**  
9. **Code review discipline** ([abseil.io](https://abseil.io/resources/swe-book/html/ch09.html?utm_source=chatgpt.com))  
10. **ADR \+ “definition of done” templates** (so agents don’t guess)

---

## **Training your agentic coding game developers: a practical curriculum**

### **Module A — “How we ship code here”**

* trunk-based workflow \+ PR size limits ([Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development?utm_source=chatgpt.com))  
* review checklist (correctness, readability, tests, telemetry) ([abseil.io](https://abseil.io/resources/swe-book/html/ch09.html?utm_source=chatgpt.com))  
* feature flag patterns  
  **Exercise:** add a small feature behind a flag \+ merge same day.

### **Module B — “Systems-first architecture”**

* module boundaries, dependency rules  
* component/event patterns ([gameprogrammingpatterns.com](https://gameprogrammingpatterns.com/component.html?utm_source=chatgpt.com))  
  **Exercise:** implement one gameplay subsystem with a clean interface and no UI dependency.

### **Module C — “Content as code”**

* schemas, validators, authoring workflow  
* localization keys, content linting  
  **Exercise:** implement a dialogue node type \+ validator \+ sample content pack.

### **Module D — “Testing the untestable”**

* pure logic tests  
* golden tests for narrative  
* headless simulation  
  **Exercise:** create a test runner that explores 1,000 random dialogue paths and reports dead ends.

### **Module E — “Observability and experiments”**

* event taxonomy, crash pipeline, experiment assignment  
  **Exercise:** instrument choice events \+ add an A/B variant of a prompt and log assignment.

### **Module F — “Build \+ release engineering”**

* reproducible builds, build caching mindset ([sre.google](https://sre.google/sre-book/release-engineering/?utm_source=chatgpt.com))  
* build promotion \+ rollback plan  
  **Exercise:** produce a “release candidate” artifact with versioning and a manifest.

---

## **A PR “Definition of Done” checklist (agent-friendly)**

Every PR must include:

* **Intent:** what user-facing or system behavior changes  
* **Safety:** flag/rollback plan (if behavior-impacting)  
* **Tests:** unit/integration/golden (as applicable)  
* **Telemetry:** new/updated events if behavior changes  
* **Docs:** ADR update if architectural  
* **Perf/Build:** does it affect build time? (measure if yes)  
* **Validation:** content schema \+ lints pass  
* **Repro:** steps to verify

This checklist is *the* alignment mechanism for agents.

---

## **A small “reading/watching spine” I’d assign agents**

* Code review principles: *Software Engineering at Google* (Code Review chapter). ([abseil.io](https://abseil.io/resources/swe-book/html/ch09.html?utm_source=chatgpt.com))  
* Release engineering mindset: Google SRE “Release Engineering.” ([sre.google](https://sre.google/sre-book/release-engineering/?utm_source=chatgpt.com))  
* Trunk-based development overview (Atlassian \+ AWS guidance are good primers). ([Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development?utm_source=chatgpt.com))  
* Game architecture patterns: *Game Programming Patterns* (components/decoupling). ([gameprogrammingpatterns.com](https://gameprogrammingpatterns.com/?utm_source=chatgpt.com))  
* Build pipelines at scale (examples from Riot / Microsoft’s build-time discussions). ([GDC Vault](https://www.gdcvault.com/play/1023327/-Continuous-Delivery-Pipelines-via?utm_source=chatgpt.com))  
* Data-oriented design (mindset): Richard Fabian’s DOD material. ([dataorienteddesign.com](https://www.dataorienteddesign.com/dodbook.pdf?utm_source=chatgpt.com))

---

## **If you want, I can turn this into a “Game Studio Engineering Handbook”**

Meaning: a single doc your agents follow that includes:

* repo conventions, module boundaries, naming  
* telemetry event dictionary  
* content schema \+ lint rules  
* test harness patterns  
* PR templates \+ ADR templates  
* “stop-the-line” incidents \+ postmortem format

If you tell me what engine/runtime you’re leaning toward (even loosely), I’ll tailor the stack into concrete conventions and folder/module boundaries without leaning into graphics.

