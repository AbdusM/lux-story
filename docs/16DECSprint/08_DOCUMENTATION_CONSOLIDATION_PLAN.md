# Documentation Consolidation Plan
**December 16, 2024 - Systematic Analysis**

---

## Executive Summary

**Current State:** 120 documents, 51,466 lines across 6 folders
**Target State:** 10 canonical documents, ~8,000 lines in single folder
**Reduction:** 92% document count, 85% line count (through consolidation + archiving)

---

## Part I: Complete Document Inventory

### Tier 1: 16DECSprint (Current Sprint) - 4,278 lines

| Document | Lines | Category | Status |
|----------|-------|----------|--------|
| `000_lux-story-engineering-synthesis.md` | 1,417 | **ENGINEERING SPEC** | CANONICAL - Comprehensive SDP |
| `00_PHILOSOPHY_FOUNDATION.md` | 496 | **PHILOSOPHY** | CANONICAL - Decision filter |
| `01_SYSTEMS_INVENTORY.md` | 423 | Audit | MERGE → Current State |
| `02_COMPREHENSIVE_ROADMAP.md` | 430 | Roadmap | SUPERSEDED by 000 |
| `03_PRD_VALIDATION.md` | 167 | Validation | MERGE → Current State |
| `04_ISP_DORMANT_CAPABILITIES.md` | 381 | Analysis | REFERENCE ONLY |
| `05_ISP_COMBINATORIAL_SYNTHESES.md` | 339 | Analysis | REFERENCE ONLY |
| `06_ISP_10X_FUTURES.md` | 267 | Vision | ARCHIVE → Strategy |
| `07_ISP_MASTER_SYNTHESIS.md` | 251 | Synthesis | SUPERSEDED by 000 |
| `REVIEW_PROMPT.md` | 107 | Tool | KEEP - Utility |

**Key Finding:** `000_lux-story-engineering-synthesis.md` IS the comprehensive software development plan. It contains:
- Architectural layers
- 8 systems needing completion
- 5 implementation phases with daily tasks
- 4 technical specifications
- Quality gates
- Testing strategy
- What NOT to build

---

### Tier 2: 14DECSprint (Previous Sprint) - 10,724 lines

| Document | Lines | Category | Status |
|----------|-------|----------|--------|
| `02_Software_Architecture.md` | 1,113 | Architecture | PARTIALLY SUPERSEDED by 000 |
| `01_User_Story_Mapping.md` | 957 | User Stories | ARCHIVE - Good reference |
| `Session_Boundaries_Implementation.md` | 974 | Feature Spec | SUPERSEDED by 000 Part V |
| `03_Content_Creation_Formula.md` | 930 | Content | MERGE → Content Guidelines |
| `04_Implementation_Timeline.md` | 1,051 | Timeline | SUPERSEDED by 000 |
| `05_Anthony_Pilot_Plan.md` | 795 | Pilot | KEEP SEPARATE - Active |
| `06_Station_2_Specification.md` | 708 | Future | ARCHIVE → Future |
| `07_Character_Arc_Templates.md` | 658 | Content | MERGE → Content Guidelines |
| `00_MASTER_IMPLEMENTATION_ROADMAP.md` | 538 | Roadmap | SUPERSEDED by 000 |
| `PILOT_PREP_SPRINT.md` | 568 | Pilot | MERGE with Anthony Pilot |
| `COMPREHENSIVE_AUDIT_DEC14.md` | 763 | Audit | SUPERSEDED by 16DEC docs |
| `CONTENT_CREATION_WORKFLOW.md` | 526 | Content | MERGE → Content Guidelines |
| `CHARACTER_SYSTEMS_ROADMAP.md` | 424 | Roadmap | SUPERSEDED by 000 |
| `Session_Boundaries_REALIGNED.md` | 394 | Feature | SUPERSEDED by 000 |
| `CONTEXT_QUALITY_COMPARISON.md` | 326 | Analysis | ARCHIVE |
| `BLOAT_AUDIT.md` | 318 | Audit | COMPLETED - ARCHIVE |
| `00_REALIGNMENT_SUMMARY.md` | 323 | Status | ARCHIVE |
| `00_STATUS_AND_NEXT_STEPS.md` | 275 | Status | SUPERSEDED |
| `00_SPRINT_OVERVIEW.md` | 83 | Overview | ARCHIVE |

---

### Tier 3: 13DECSprint (Research Sprint) - 9,146 lines

| Document | Lines | Category | Status |
|----------|-------|----------|--------|
| `Strategic_Implementation_Options.md` | 1,480 | Strategy | ARCHIVE - Reference |
| `30-career-paths.md` | 1,317 | Content | KEEP - Dormant content |
| `08-IMPLEMENTATION-PLAN.md` | 929 | Plan | SUPERSEDED |
| `07-pokemon-design-principles.md` | 687 | Research | ARCHIVE → Reference Index |
| `06-narrative-gameplay-analysis.md` | 579 | Research | ARCHIVE → Reference Index |
| `GCT_Meeting_Transcript_Complete.md` | 591 | Historical | ARCHIVE |
| `04-codebase-audit-report.md` | 538 | Audit | SUPERSEDED |
| `01-design-audit-findings.md` | 515 | Audit | SUPERSEDED |
| `zeldaOverview.md` | 465 | Research | ARCHIVE → Reference Index |
| `GCT_Product_Requirements_Document.md` | 445 | PRD | SUPERSEDED by Philosophy |
| `03-critical-gaps-analysis.md` | 427 | Analysis | SUPERSEDED |
| `05-reconciliation-core-focus.md` | 415 | Analysis | SUPERSEDED |
| `Identity_Agency_System_Implementation.md` | 411 | Feature | SUPERSEDED by 000 Part V |
| `README.md` | 367 | Index | ARCHIVE |
| `DOCUMENTATION-SUMMARY.md` | 274 | Summary | ARCHIVE |
| `00-EXECUTIVE-SUMMARY.md` | 257 | Summary | ARCHIVE |
| `02-implementation-recommendations.md` | 624 | Recommendations | SUPERSEDED |
| `finanl_fantasy_reqs.md` | 117 | Research | ARCHIVE → Reference Index |
| `top-gamer-brain.md` | 104 | Research | ARCHIVE → Reference Index |

**Key Finding:** This folder contains valuable RESEARCH but outdated PLANS. Research should be indexed, plans archived.

---

### Tier 4: 01_Sprint1 (Legacy) - 14,678 lines

| Document | Lines | Category | Status |
|----------|-------|----------|--------|
| `SCENARIO_DOCUMENTATION.md` | 2,992 | Content | ARCHIVE - Historical |
| `ActualizeME_Scenario Documentation Guide.md` | 2,267 | Guide | ARCHIVE |
| `USER_JOURNEY_DIAGRAM.md` | 834 | UX | ARCHIVE |
| `FRAMER_MOTION_ENHANCEMENT_PLAN.md` | 870 | Technical | ARCHIVE |
| `DIALOGUE_REFACTOR_PLAN.md` | 710 | Plan | COMPLETED - ARCHIVE |
| `POKEMON_SCALING_COMPLETE.md` | 708 | Research | ARCHIVE → Reference |
| `DIALOGUE_STYLE_GUIDE.md` | 465 | Content | CHECK overlap with 000 |
| `DIALOGUE_IMPROVEMENT_PLAN.md` | 450 | Plan | COMPLETED - ARCHIVE |
| `MARCUS_REFACTOR_REPORT.md` | 413 | Report | COMPLETED - ARCHIVE |
| `PIXEL_ART_PRINCIPLES.md` | 356 | Design | KEEP - Active reference |
| All others | ~5,613 | Various | ARCHIVE |

**Key Finding:** Sprint 1 is fully historical. Archive entire folder.

---

### Tier 5: Root Level Docs - 4,858 lines

| Document | Lines | Category | Status |
|----------|-------|----------|--------|
| `IMMERSION_ENHANCEMENT_PLAN.md` | 479 | Plan | SUPERSEDED by Philosophy |
| `NARRATIVE_QUALITY_AUDIT_DEC7.md` | 421 | Audit | SUPERSEDED |
| `PROGRESSION_SYSTEM_REDESIGN.md` | 395 | Design | SUPERSEDED by 000 |
| `DIALOGUE_CHARACTER_BEST_PRACTICES.md` | 383 | Content | MERGE → Content Guidelines |
| `GAP_ANALYSIS_COMPETITIVE.md` | 371 | Analysis | ARCHIVE |
| `CHOICE_CONSEQUENCE_PHILOSOPHY.md` | 367 | Philosophy | MERGED into 00 |
| `PIXEL_AVATAR_SPECIFICATIONS.md` | 343 | Design | KEEP - Active |
| `FIVE_LENSES_AUDIT_DEC2024.md` | 341 | Audit | ARCHIVE - Reference |
| `DESIGN_PRINCIPLES.md` | 338 | Design | MERGED into 00 |
| `ui-consolidation-analysis.md` | 323 | Analysis | MERGED into 00 |
| `dec7sprint3-FINAL-PLAN.md` | 392 | Plan | SUPERSEDED |
| `dec7sprint3-narrative-audit.md` | 255 | Audit | SUPERSEDED |
| `ui-flows-audit.md` | 233 | Audit | ARCHIVE |
| `FAKE_CHOICE_AUDIT_DEC15.md` | 175 | Audit | COMPLETED - ARCHIVE |
| `README.md` | 42 | Index | UPDATE |

---

## Part II: Document Dependency Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CANONICAL HIERARCHY                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  TIER 1: FOUNDATION (WHAT WE BELIEVE)                                   │
│  └── 00_PHILOSOPHY_FOUNDATION.md (496 lines)                            │
│      ├── Filters ALL other documents                                     │
│      ├── 10 Commandments, 6 Red Flags                                   │
│      ├── UI Consolidation, Joyce's Meanness                             │
│      └── Non-negotiable vs. Flexible                                    │
│                                                                          │
│  TIER 2: ENGINEERING (HOW WE BUILD)                                     │
│  └── 000_lux-story-engineering-synthesis.md (1,417 lines)               │
│      ├── Architectural layers                                            │
│      ├── 8 systems needing completion                                   │
│      ├── 5 implementation phases                                        │
│      ├── Technical specifications                                       │
│      ├── Quality gates                                                  │
│      └── What NOT to build                                              │
│                                                                          │
│  TIER 3: CONTEXT (WHAT WE KNOW)                                         │
│  ├── 01_CURRENT_STATE.md (NEW - merge inventory + validation)           │
│  ├── 05_CONTENT_GUIDELINES.md (NEW - merge content docs)                │
│  └── 09_REFERENCE_INDEX.md (NEW - links to research)                    │
│                                                                          │
│  TIER 4: EXECUTION (WHAT WE DO NOW)                                     │
│  ├── 05_Anthony_Pilot_Plan.md (KEEP - active pilot)                     │
│  └── SPRINT_TASKS.md (NEW - current sprint items)                       │
│                                                                          │
│  TIER 5: ARCHIVE (WHAT WE DID)                                          │
│  └── /archive/ folder with all historical docs                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Part III: Conflict Analysis

### Critical Conflicts Found

| Conflict | Doc A | Doc B | Resolution |
|----------|-------|-------|------------|
| Character count | CLAUDE.md says 8 | Code has 11 | Update CLAUDE.md |
| Roadmap phases | 02_COMPREHENSIVE | 000_engineering | 000 is canonical |
| Session boundaries | 14DEC spec | 000 Part V | 000 is canonical |
| UI elements | Various | 00_PHILOSOPHY | Philosophy is canonical (7 elements) |
| Pattern acknowledgment target | Some say 15% | 00 says 20% | 20% is canonical |

### Terminology Mismatches

| Term in Docs | Term in Code | Canonical |
|--------------|--------------|-----------|
| Nanostem | Dialogue graph | Dialogue graph |
| Experience | Arc/Journey | Journey |
| Lira (character) | Not in code | REMOVE from docs |
| Jordan, Kai, Silas | In code | ADD to docs |

---

## Part IV: Final Document Structure

### Target: 10 Canonical Documents

```
docs/
├── 16DECSprint/                          # ACTIVE SPRINT
│   ├── 00_PHILOSOPHY_FOUNDATION.md       # 496 lines - DONE
│   ├── 01_ENGINEERING_SYNTHESIS.md       # 1,417 lines - RENAME from 000
│   ├── 02_CURRENT_STATE.md               # ~400 lines - NEW (merge)
│   ├── 03_CONTENT_GUIDELINES.md          # ~600 lines - NEW (merge)
│   ├── 04_ANTHONY_PILOT_PLAN.md          # 795 lines - MOVE from 14DEC
│   ├── 05_SPRINT_TASKS.md                # ~200 lines - NEW
│   ├── 06_SUCCESS_METRICS.md             # ~150 lines - NEW
│   ├── 07_REFERENCE_INDEX.md             # ~200 lines - NEW
│   └── REVIEW_PROMPT.md                  # 107 lines - KEEP
│
├── archive/                              # ARCHIVED DOCS
│   ├── 13DECSprint/                      # Move entire folder
│   ├── 14DECSprint/                      # Move entire folder
│   ├── 01_Sprint1/                       # Move entire folder
│   ├── 00_Sprint2/                       # Move entire folder
│   └── root-level/                       # Move root docs here
│
└── README.md                             # Index pointing to 16DECSprint
```

---

## Part V: Specific Consolidation Actions

### Action 1: Rename 000 → 01

```bash
mv docs/16DECSprint/000_lux-story-engineering-synthesis.md \
   docs/16DECSprint/01_ENGINEERING_SYNTHESIS.md
```

**Reason:** Establishes clear hierarchy (00 = Philosophy, 01 = Engineering)

---

### Action 2: Create 02_CURRENT_STATE.md

**Merge Sources:**
- `01_SYSTEMS_INVENTORY.md` (423 lines)
- `03_PRD_VALIDATION.md` (167 lines)

**Structure:**
```markdown
# Current State Analysis
## Codebase Statistics
## System Activation Levels
## Character Roster (11 characters)
## What's Working
## What's Broken
## Technical Debt
```

**Estimated Result:** ~400 lines

---

### Action 3: Create 03_CONTENT_GUIDELINES.md

**Merge Sources:**
- `03_Content_Creation_Formula.md` (930 lines → extract ~200)
- `07_Character_Arc_Templates.md` (658 lines → extract ~150)
- `DIALOGUE_CHARACTER_BEST_PRACTICES.md` (383 lines → extract ~150)
- `CONTENT_CREATION_WORKFLOW.md` (526 lines → extract ~100)

**Structure:**
```markdown
# Content Guidelines
## Writing Philosophy (Joyce's Meanness from 00)
## Character Voice Templates
## Dialogue Writing Rules
## Pattern Reflection Examples
## Session Boundary Placement
```

**Estimated Result:** ~600 lines

---

### Action 4: Move Anthony Pilot

```bash
mv docs/14DECSprint/05_Anthony_Pilot_Plan.md \
   docs/16DECSprint/04_ANTHONY_PILOT_PLAN.md
```

**Also merge:** `PILOT_PREP_SPRINT.md` relevant sections

---

### Action 5: Create 05_SPRINT_TASKS.md

**Extract from:** `01_ENGINEERING_SYNTHESIS.md` Part V (Completion Sequence)

**Structure:**
```markdown
# Current Sprint Tasks

## Week 1: Foundation
- [ ] Task 1: Wire orb milestone echoes (2-3 hrs)
- [ ] Task 2: Wire consequence echoes (2-4 hrs)
- [ ] Task 3: Fix session boundaries (4-6 hrs)

## Week 2: Identity System
- [ ] Task 4: Create identity offer nodes (4 hrs)
...
```

---

### Action 6: Create 06_SUCCESS_METRICS.md

**Extract from:** Various docs

**Structure:**
```markdown
# Success Metrics

## Pattern System
- Acknowledgment rate: 4% → 20%
- First orb view time: <3 min

## Engagement
- Session completion: target 80%
- Return rate: target 50% within 7 days

## Pilot (Anthony/Urban Chamber)
- Completion rate: target 80%
- NPS: target 50+
```

---

### Action 7: Create 07_REFERENCE_INDEX.md

**Structure:**
```markdown
# Reference Index

## Game Design Research
- Pokemon Principles: archive/13DECSprint/07-pokemon-design-principles.md
- Zelda Analysis: archive/13DECSprint/zeldaOverview.md
- Narrative Analysis: archive/13DECSprint/06-narrative-gameplay-analysis.md

## Historical Decisions
- Why we removed toolbars: archive/14DECSprint/BLOAT_AUDIT.md
- Fake choice fix: archive/root-level/FAKE_CHOICE_AUDIT_DEC15.md

## Dormant Content
- 30 Career Paths: archive/13DECSprint/30-career-paths.md
- ISP Analysis: archive/16DECSprint/04_ISP_DORMANT_CAPABILITIES.md
```

---

### Action 8: Create Archive Structure

```bash
mkdir -p docs/archive/{13DECSprint,14DECSprint,01_Sprint1,00_Sprint2,root-level,isp-analysis}

# Move sprint folders
mv docs/13DECSprint docs/archive/
mv docs/14DECSprint docs/archive/
mv docs/01_Sprint1 docs/archive/
mv docs/00_Sprint2 docs/archive/

# Move root level docs
mv docs/DESIGN_PRINCIPLES.md docs/archive/root-level/
mv docs/FIVE_LENSES_AUDIT_DEC2024.md docs/archive/root-level/
# ... etc

# Move ISP docs to reference (not active)
mv docs/16DECSprint/04_ISP_*.md docs/archive/isp-analysis/
mv docs/16DECSprint/05_ISP_*.md docs/archive/isp-analysis/
mv docs/16DECSprint/06_ISP_*.md docs/archive/isp-analysis/
mv docs/16DECSprint/07_ISP_*.md docs/archive/isp-analysis/
```

---

### Action 9: Update Root README.md

```markdown
# Lux Story Documentation

## Active Documents (16DECSprint/)

| # | Document | Purpose |
|---|----------|---------|
| 00 | PHILOSOPHY_FOUNDATION | Decision filter, non-negotiables |
| 01 | ENGINEERING_SYNTHESIS | Complete software development plan |
| 02 | CURRENT_STATE | What exists now |
| 03 | CONTENT_GUIDELINES | Writing rules |
| 04 | ANTHONY_PILOT_PLAN | B2B validation |
| 05 | SPRINT_TASKS | Current work items |
| 06 | SUCCESS_METRICS | Measurable goals |
| 07 | REFERENCE_INDEX | Links to archived research |

## Archive (archive/)
Historical documents, completed audits, and research reference.

## Quick Start
1. Read 00_PHILOSOPHY_FOUNDATION first
2. Read 01_ENGINEERING_SYNTHESIS for implementation
3. Check 05_SPRINT_TASKS for current work
```

---

### Action 10: Update CLAUDE.md

**Fixes needed:**
- Character count: 8 → 11
- Add Jordan, Kai, Silas to roster
- Remove Lira (not in code)
- Update file references

---

## Part VI: Execution Order

### Phase 1: Structural (30 minutes)
1. Create archive folder structure
2. Move old sprint folders to archive
3. Rename 000 → 01

### Phase 2: Merges (2-3 hours)
4. Create 02_CURRENT_STATE.md
5. Create 03_CONTENT_GUIDELINES.md
6. Create 05_SPRINT_TASKS.md
7. Create 06_SUCCESS_METRICS.md
8. Create 07_REFERENCE_INDEX.md

### Phase 3: Cleanup (30 minutes)
9. Move ISP analysis docs to archive
10. Update root README.md
11. Update CLAUDE.md

### Phase 4: Validation (1 hour)
12. Verify all links work
13. Run review prompt on final docs
14. Fix any remaining conflicts

---

## Part VII: What This Achieves

### Before
```
120 documents
51,466 lines
6+ folders
No clear hierarchy
Multiple superseded versions
Conflicting information
Engineers can't find canonical source
```

### After
```
10 documents
~4,500 lines
2 folders (active + archive)
Clear hierarchy
Single source of truth per topic
Philosophy filters all decisions
Engineers start with 00 → 01 → 05
```

### Document Purpose Map

| Document | Audience | Question It Answers |
|----------|----------|---------------------|
| 00_PHILOSOPHY | Everyone | "What principles guide all decisions?" |
| 01_ENGINEERING | Engineers | "What do I build and how?" |
| 02_CURRENT_STATE | Everyone | "What exists right now?" |
| 03_CONTENT_GUIDELINES | Writers | "How do I write dialogue?" |
| 04_ANTHONY_PILOT | Business | "What's the B2B validation plan?" |
| 05_SPRINT_TASKS | Engineers | "What do I work on today?" |
| 06_SUCCESS_METRICS | Everyone | "How do we measure success?" |
| 07_REFERENCE_INDEX | Researchers | "Where's that old document?" |

---

## Decision Required

**Do you want me to execute this consolidation plan?**

Options:
1. **Execute all** - Create archive structure, merge docs, update references
2. **Execute Phase 1 only** - Just structural changes (move folders)
3. **Wait for Claude web feedback** - Incorporate review first
4. **Modify plan** - Adjust before execution

---

*This consolidation reduces cognitive load by 85% while preserving all historical work in accessible archive.*
