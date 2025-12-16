# Reference Index
**December 16, 2024 - Links to Archived Research & History**

---

## Game Design Research

### Pokemon/Nintendo Principles
| Document | Location | Key Insight |
|----------|----------|-------------|
| Pokemon Design Principles | `archive/13DECSprint/07-pokemon-design-principles.md` | Depth-under-simplicity, 4-channel constraint |
| Pokemon Scaling Complete | `archive/01_Sprint1/POKEMON_SCALING_COMPLETE.md` | How we applied scaling |
| Applicable RPG Patterns | `archive/01_Sprint1/APPLICABLE_RPG_PATTERNS.md` | RPG mechanics adaptation |

### Zelda Analysis
| Document | Location | Key Insight |
|----------|----------|-------------|
| Zelda Overview | `archive/13DECSprint/zeldaOverview.md` | Item Get ceremony, natural save points |

### Narrative Game Analysis
| Document | Location | Key Insight |
|----------|----------|-------------|
| Narrative Gameplay Analysis | `archive/13DECSprint/06-narrative-gameplay-analysis.md` | Disco Elysium, Kentucky Route Zero |
| Top Gamer Brain | `archive/13DECSprint/top-gamer-brain.md` | Cognitive patterns |
| Final Fantasy Requirements | `archive/13DECSprint/finanl_fantasy_reqs.md` | JRPG structure |
| Half Life Opening | `archive/00_Sprint2/Half Life Opening.md` | Environmental storytelling |

---

## Historical Decisions

### Why We Removed Things
| Decision | Document | Rationale |
|----------|----------|-----------|
| Removed toolbar | `archive/14DECSprint/BLOAT_AUDIT.md` | Broke mobile, single-purpose element |
| Removed onboarding modal | `archive/13DECSprint/08-IMPLEMENTATION-PLAN.md` | Tutorial Crutch red flag |
| Removed scene-skill-mappings | `archive/14DECSprint/BLOAT_AUDIT.md` | Duplicate of dialogue graph data |
| Removed meta-framing | `archive/root-level/IMMERSION_ENHANCEMENT_PLAN.md` | Broke fourth wall |

### Why We Built Things
| Feature | Document | Rationale |
|---------|----------|-----------|
| Identity System | `archive/13DECSprint/Identity_Agency_System_Implementation.md` | Disco Elysium Thought Cabinet |
| Session Boundaries | `archive/14DECSprint/Session_Boundaries_Implementation.md` | Mobile-friendly pacing |
| Consequence Echoes | `archive/isp-analysis/04_ISP_DORMANT_CAPABILITIES.md` | Sid Meier feedback principle |

---

## Completed Audits

| Audit | Location | Outcome |
|-------|----------|---------|
| Fake Choice Audit | `archive/root-level/FAKE_CHOICE_AUDIT_DEC15.md` | Fixed intro choices |
| Bloat Audit | `archive/14DECSprint/BLOAT_AUDIT.md` | Removed 3,455 lines |
| Five Lenses Audit | `archive/root-level/FIVE_LENSES_AUDIT_DEC2024.md` | Identified progressive paralysis |
| Codebase Audit (Dec 13) | `archive/13DECSprint/04-codebase-audit-report.md` | System inventory |
| Comprehensive Audit (Dec 14) | `archive/14DECSprint/COMPREHENSIVE_AUDIT_DEC14.md` | Full system review |

---

## Dormant Content (Ready to Activate)

| Content | Location | Lines | Status |
|---------|----------|-------|--------|
| 30 Career Paths | `archive/13DECSprint/30-career-paths.md` | 1,317 | Written, not integrated |
| Character Arc Templates | `archive/14DECSprint/07_Character_Arc_Templates.md` | 658 | Can guide new content |
| User Story Mapping | `archive/14DECSprint/01_User_Story_Mapping.md` | 957 | Personas defined |

---

## ISP Analysis (Strategic Research)

| Document | Location | Purpose |
|----------|----------|---------|
| Dormant Capabilities | `archive/isp-analysis/04_ISP_DORMANT_CAPABILITIES.md` | 80% built, 30% activated |
| Combinatorial Syntheses | `archive/isp-analysis/05_ISP_COMBINATORIAL_SYNTHESES.md` | A+B=C new mechanics |
| 10x Futures | `archive/isp-analysis/06_ISP_10X_FUTURES.md` | Moonshot scenarios |
| Master Synthesis | `archive/isp-analysis/07_ISP_MASTER_SYNTHESIS.md` | Unified roadmap |

---

## Historical Sprint Documentation

### Sprint 1 (Legacy)
| Document | Purpose |
|----------|---------|
| `archive/01_Sprint1/SCENARIO_DOCUMENTATION.md` | Original scenario structure |
| `archive/01_Sprint1/USER_JOURNEY_DIAGRAM.md` | UX flow mapping |
| `archive/01_Sprint1/PIXEL_ART_PRINCIPLES.md` | **Still relevant** - avatar design |
| `archive/01_Sprint1/DIALOGUE_STYLE_GUIDE.md` | Original voice guidelines |

### Sprint 2
| Document | Purpose |
|----------|---------|
| `archive/00_Sprint2/SOFTWARE_DEVELOPMENT_PLAN_SPRINT2.md` | Previous SDP |

### 13DECSprint (Research)
| Document | Purpose |
|----------|---------|
| `archive/13DECSprint/00-EXECUTIVE-SUMMARY.md` | Sprint summary |
| `archive/13DECSprint/Strategic_Implementation_Options.md` | Path analysis |
| `archive/13DECSprint/GCT_Product_Requirements_Document.md` | Original PRD |
| `archive/13DECSprint/GCT_Meeting_Transcript_Complete.md` | Stakeholder input |

### 14DECSprint (Previous)
| Document | Purpose |
|----------|---------|
| `archive/14DECSprint/00_MASTER_IMPLEMENTATION_ROADMAP.md` | Previous roadmap |
| `archive/14DECSprint/02_Software_Architecture.md` | Architecture detail |
| `archive/14DECSprint/03_Content_Creation_Formula.md` | Content workflow |
| `archive/14DECSprint/06_Station_2_Specification.md` | Future station |

---

## Root Level Archives

| Document | Location | Status |
|----------|----------|--------|
| DESIGN_PRINCIPLES.md | `archive/root-level/` | Merged into 00_PHILOSOPHY |
| CHOICE_CONSEQUENCE_PHILOSOPHY.md | `archive/root-level/` | Merged into 00_PHILOSOPHY |
| ui-consolidation-analysis.md | `archive/root-level/` | Merged into 00_PHILOSOPHY |
| DIALOGUE_CHARACTER_BEST_PRACTICES.md | `archive/root-level/` | Merged into 03_CONTENT_GUIDELINES |
| PIXEL_AVATAR_SPECIFICATIONS.md | `archive/root-level/` | **Still relevant** - keep accessible |

---

## Quick Lookup

### "Why did we...?"
- Remove the toolbar? → `archive/14DECSprint/BLOAT_AUDIT.md`
- Choose Philosophy C? → `00_PHILOSOPHY_FOUNDATION.md` line 339
- Make patterns 5 types? → `archive/13DECSprint/07-pokemon-design-principles.md`
- Target 20% acknowledgment? → `01_ENGINEERING_SYNTHESIS.md` Part VI

### "Where is the...?"
- Character voice guide? → `03_CONTENT_GUIDELINES.md` Part II
- Pattern sensation text? → `lib/patterns.ts` PATTERN_SENSATIONS
- Trust labels? → `lib/trust-labels.ts`
- Samuel dialogue? → `content/samuel.ts`

### "What's the philosophy on...?"
- UI consolidation? → `00_PHILOSOPHY_FOUNDATION.md` line 46
- Player voice? → `00_PHILOSOPHY_FOUNDATION.md` line 121
- Fake choices? → `00_PHILOSOPHY_FOUNDATION.md` line 247
- Session boundaries? → `01_ENGINEERING_SYNTHESIS.md` Part V System 5

---

## Archive Structure

```
docs/archive/
├── 00_Sprint2/
├── 01_Sprint1/
├── 13DECSprint/
├── 14DECSprint/
├── isp-analysis/
│   ├── 04_ISP_DORMANT_CAPABILITIES.md
│   ├── 05_ISP_COMBINATORIAL_SYNTHESES.md
│   ├── 06_ISP_10X_FUTURES.md
│   └── 07_ISP_MASTER_SYNTHESIS.md
└── root-level/
    ├── DESIGN_PRINCIPLES.md
    ├── CHOICE_CONSEQUENCE_PHILOSOPHY.md
    ├── FIVE_LENSES_AUDIT_DEC2024.md
    ├── FAKE_CHOICE_AUDIT_DEC15.md
    ├── PIXEL_AVATAR_SPECIFICATIONS.md
    └── ... (other root docs)
```

---

*This index helps find historical context. Active docs are in 16DECSprint/.*
