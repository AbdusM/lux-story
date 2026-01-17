# Data Dictionary - Index

**Last Updated:** January 13, 2026
**Status:** 100% Complete - All Categories Documented
**Coverage:** 12 of 12 categories documented (100% complete)

---

## Overview

This data dictionary documents all metadata used in the Lux Story game system, including emotions, skills, patterns, characters, dialogue systems, simulations, and more. The documentation is organized across multiple files for navigability and maintainability.

**Purpose:**
- **For Developers:** Type validation, data structures, integration patterns
- **For Content Creators:** Available options, usage guidelines, design philosophy
- **For Stakeholders:** Quick statistics, system coverage, metadata inventory

---

## Quick Stats

### Metadata Inventory

| Category | Count | Status | File |
|----------|-------|--------|------|
| **Patterns** | 5 types | ✅ Complete | `03-patterns.md` |
| **Skills** | 54 skills | ✅ Complete | `02-skills.md` |
| **Simulations** | 20 unique (16 types) | ✅ Complete | `06-simulations.md` |
| **UI Metadata** | 15 locations, 52 emotions | ✅ Complete | `10-ui-metadata.md` |
| **Career Paths** | 8 sectors, 32+ orgs | ✅ Complete | `11-careers.md` |
| **Emotions** | 503 primary, 180+ compounds | ✅ Complete | `01-emotions.md` |
| **Characters** | 20 NPCs | ✅ Complete | `04-characters.md` |
| **Dialogue System** | 1158 nodes | ✅ Complete | `05-dialogue-system.md` |
| **Knowledge Flags** | 508 flags | ✅ Complete | `07-knowledge-flags.md` |
| **Trust System** | 10 levels, 7 derivatives | ✅ Complete | `08-trust-system.md` |
| **Interrupts** | 23 interrupts, 6 types | ✅ Complete | `09-interrupts.md` |
| **Analytics & Events** | 5 engines, 30+ events | ✅ Complete | `12-analytics.md` |

**Total Metadata Values:** 2,500+ unique identifiers
**Source Files:** 30+ TypeScript files

---

## Table of Contents

### Complete Systems (All 12 files) ✅

1. **[Emotions](./01-emotions.md)** ✅ - 503 primary emotions, 180+ compound emotions
   - 38 emotion categories for semantic grouping
   - Polyvagal nervous system integration (3 states)
   - Chemical reactions (5 emergent types)
   - UI metadata (50+ emotions with colors)
   - Compound emotion validation (unlimited combinations)

2. **[Patterns](./03-patterns.md)** ✅ - 5 behavioral decision-making approaches
   - Pattern metadata (labels, colors, descriptions)
   - Pattern-to-skill mappings
   - Color blind accessibility (5 modes)
   - Pattern sensations (atmospheric feedback)
   - Thresholds: EMERGING (3), DEVELOPING (6), FLOURISHING (9)

3. **[Skills](./02-skills.md)** ✅ - 54 competencies across 7 semantic clusters
   - WEF 2030 Skills Framework alignment
   - Skill definitions, superpowers, manifestos
   - Pattern mappings (19 skills)
   - Character development hints (30 skills)
   - Cluster organization: MIND, HEART, VOICE, HANDS, COMPASS, CRAFT, CENTER HUB

4. **[Characters](./04-characters.md)** ✅ - 20 NPCs + 4 character tiers
   - Character tiers (Hub, Core, Primary, Secondary, Extended)
   - 18 animal types (Zootopia-style anthropomorphic)
   - Relationship web (8 relationship types)
   - Dialogue distribution (1158 total nodes)
   - Career paths and simulation mappings

5. **[Simulations](./06-simulations.md)** ✅ - 20 unique simulations (1 per character)
   - 16 simulation types (system_architecture, dashboard_triage, chat_negotiation, etc.)
   - 3 phases (Introduction, Application, Mastery)
   - 3 difficulty tiers
   - 2 display modes (fullscreen, inline)
   - 7 AI tool parallels (Cursor AI, Perplexity, Stable Diffusion, etc.)

6. **[UI/UX Metadata](./10-ui-metadata.md)** ✅ - UI enhancements and location context
   - 15 Birmingham locations with emoji icons
   - 52 emotion subtext mappings (observable behaviors)
   - Pattern unlock effects (15 total, 3 levels × 5 patterns)
   - Content enhancement system (6 types)
   - Trust delta insights

7. **[Career Paths](./11-careers.md)** ✅ - Birmingham-localized career guidance
   - 8 career sectors (healthcare, engineering, technology, education, etc.)
   - 32+ Birmingham organizations
   - Pattern-to-career mapping (15 behavioral patterns)
   - Career insights with evidence points
   - Next steps and personalized opportunities

8. **[Trust System](./08-trust-system.md)** ✅ - 10-point trust scale + 7 derivative mechanics
   - Trust labels (Stranger → Bonded)
   - Voice tone progression (Whisper → Command)
   - Trust asymmetry gameplay (jealousy, curiosity, concern)
   - Consequence echo intensity (faded → indelible memories)
   - Trust timeline (tracking relationship evolution)
   - Trust as social currency (information trading)
   - Trust momentum system (streak bonuses)
   - Trust inheritance (reputation through social network)

9. **[Dialogue System](./05-dialogue-system.md)** ✅ - 1158 total nodes across 4 node types
   - Node types: standard, interrupt, vulnerability arc, simulation
   - Conditional choices (132 total)
   - Pattern reflections (113 variations)
   - Trust-gated nodes (107 total)
   - Voice variations (178 pattern-based alternatives)
   - State condition evaluation system

10. **[Knowledge Flags](./07-knowledge-flags.md)** ✅ - 508 total flags (345 knowledge + 163 global)
   - 8 flag categories: arc completions, simulations, vulnerabilities, choices, golden prompts, skill combos, meta-narrative, career mentions
   - Character arc tracking (20 characters)
   - Simulation unlocks (20 simulations)
   - Golden prompts (nervous system regulation)
   - Trade chains (6 specialty paths)

11. **[Interrupts](./09-interrupts.md)** ✅ - 23 interrupt windows across 6 types
    - 6 types: connection (6), silence (7), encouragement (5), comfort (3), grounding (2), challenge (0)
    - ME2-style quick-time events (2-4 second windows)
    - No penalty for missing (trust bonus only if taken)
    - Coverage: 20/20 characters
    - Interrupt targeting and consequence system

12. **[Analytics & Events](./12-analytics.md)** ✅ - 5 analytics engines + 30+ event types
    - Event Bus (priority-based pub/sub, auto-cleanup)
    - Career Analytics (8 career paths, Birmingham-localized)
    - Simple Analytics (session tracking, engagement levels)
    - Simple Career Analytics (Supabase sync, local affinity)
    - Admin Analytics (real-time flow, drop-off heatmaps, A/B testing, cohort analysis)

---

## How to Use This Documentation

### For Developers

**Type Validation:**
```typescript
import { isValidPattern } from '@/lib/patterns'
import { SKILL_DEFINITIONS } from '@/lib/skill-definitions'

// Validate pattern
if (isValidPattern('analytical')) {
  // Safe to use
}

// Access skill metadata
const skill = SKILL_DEFINITIONS['criticalThinking']
console.log(skill.manifesto)
```

**Quick Lookups:**
- Need valid pattern types? → `03-patterns.md` → Pattern Metadata table
- Need skill clusters? → `02-skills.md` → Cluster Organization table
- Need character-skill associations? → `02-skills.md` → Character Development Hints

### For Content Creators

**Adding New Content:**
1. Check relevant data dictionary file for available options
2. Use exact IDs/identifiers as documented
3. Follow validation rules and examples
4. Reference cross-references for related systems

**Example Workflow:**
```
Task: Add pattern-gated dialogue node
1. Check 03-patterns.md → Pattern Metadata table → Get pattern ID ('analytical')
2. Check 05-dialogue-system.md → Conditional Choices → Get condition syntax
3. Implement using validated IDs
```

### For Stakeholders

**Quick Reference:**
- **System Coverage:** See Quick Stats table above
- **Design Philosophy:** Each file has "Design Notes" section
- **Future Roadmap:** Check "Future Considerations" in each file

---

## Maintenance Workflow

### Adding New Metadata

When adding metadata to the game:

1. **Update TypeScript Source** (e.g., add new emotion to `lib/emotions.ts`)
2. **Run Auto-Generation** (when script complete): `npm run generate-data-dict`
3. **Review Changes** - Check auto-generated sections for accuracy
4. **Add Manual Context** - Update "Design Notes" if needed
5. **Commit Together** - Source code + documentation in same commit

### Quarterly Audit

Every 3 months:
1. Run `npm run verify-data-dict` (when script complete)
2. Review manual sections for accuracy
3. Update design notes with new learnings
4. Sync cross-references

### Verification Commands (Planned)

```bash
# Auto-generate all documentation
npm run generate-data-dict

# Verify completeness and accuracy
npm run verify-data-dict

# Check TypeScript examples compile
npx tsc --noEmit
```

---

## Source Files Reference

### Primary Sources

| Category | Source Files |
|----------|--------------|
| Patterns | `/lib/patterns.ts` |
| Skills | `/lib/skill-definitions.ts`, `/lib/2030-skills-system.ts` |
| Emotions | `/lib/emotions.ts` |
| Characters | `/lib/graph-registry.ts`, `/lib/character-tiers.ts` |
| Dialogue | `/content/*-dialogue-graph.ts` (24 files) |
| Knowledge Flags | `/content/*-dialogue-graph.ts` (24 files) |
| Simulations | `/lib/dialogue-graph.ts`, `/content/simulation-registry.ts` |
| Trust | `/lib/constants.ts`, `/lib/trust-derivatives.ts` |
| Interrupts | `/lib/dialogue-graph.ts` |
| UI Metadata | `/lib/unlock-effects.ts`, `/lib/ui-constants.ts` |
| Career Paths | `/content/birmingham-opportunities.ts` |
| Analytics | `/lib/event-bus.ts`, `/lib/career-analytics.ts`, `/lib/simple-analytics.ts`, `/lib/simple-career-analytics.ts`, `/lib/admin-analytics.ts` |

### Auto-Generation Strategy

**High ROI (Auto-Generate):**
- Patterns (95% auto-gen) ✅ Complete
- Skills (90% auto-gen) ✅ Complete
- Emotions (70% auto-gen) ✅ Complete
- Characters (60% auto-gen) ✅ Complete
- UI Metadata (95% auto-gen) ✅ Complete
- Career Paths (90% auto-gen) ✅ Complete

**Manual Only:**
- Dialogue System ✅ Complete - Interface documentation
- Knowledge Flags ✅ Complete - Scattered data mining
- Trust System ✅ Complete - Mechanics explanation
- Interrupts ✅ Complete - Design philosophy + coverage
- Analytics & Events ✅ Complete - Multi-engine documentation

---

## Document Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ Complete | Documentation fully written and verified |
| 🚧 Planned | In roadmap, not yet started |
| 🔄 Auto-generated | Created via script from source code |
| ✍️ Manual | Hand-written documentation |
| 🔗 Hybrid | Mix of auto-generated + manual curation |

---

## Phase Roadmap

### Phase 1: Foundation ✅ COMPLETE
- [x] Create folder structure
- [x] Auto-generate `03-patterns.md`
- [x] Auto-generate `02-skills.md`
- [x] Write `00-index.md`
- [x] Auto-generate `01-emotions.md` (BONUS: Beyond original scope)
- [x] Auto-generate `04-characters.md` (BONUS: Beyond original scope)
- [x] Auto-generate `06-simulations.md` (BONUS: Beyond original scope)
- [x] Auto-generate `10-ui-metadata.md` (BONUS: Beyond original scope)
- [x] Auto-generate `11-careers.md` (BONUS: Beyond original scope)
- [ ] Create basic `generate-data-dict.ts` script

**Deliverable:** Working documentation for 7 categories, index with navigation (exceeded target)

### Phase 2: Core Systems ✅ COMPLETE (Merged into Phase 1)
- [x] Auto-generate `01-emotions.md` ✅
- [x] Hybrid `04-characters.md` ✅
- [x] Auto-generate `10-ui-metadata.md` ✅
- [ ] Manual `08-trust-system.md` (Deferred to Phase 3)

**Deliverable:** All auto-generatable categories complete (7 of 10 total)

### Phase 3: Complex Systems ✅ COMPLETE
- [x] Manual `05-dialogue-system.md` ✅ - Interface documentation
- [x] Hybrid `06-simulations.md` ✅ (Completed in Phase 1)
- [x] Manual `07-knowledge-flags.md` ✅ - Knowledge flag mining
- [x] Manual `08-trust-system.md` ✅ - Trust mechanics
- [x] Manual `09-interrupts.md` ✅ - Interrupt coverage matrix
- [x] Manual `12-analytics.md` ✅ - Analytics & event tracking

**Deliverable:** Complete data dictionary (12 essential files, 100% complete)

### Phase 4: Automation (Planned)
- [ ] Enhance `generate-data-dict.ts` with all extractors
- [ ] Create `verify-data-dict.ts`
- [ ] Add npm scripts
- [ ] Document maintenance workflow
- [ ] Optional: GitHub Action for auto-verification

**Deliverable:** Sustainable documentation pipeline

---

## Cross-System Relationships

### Pattern → Skills
- analytical → 4 skills (criticalThinking, problemSolving, digitalLiteracy, dataDemocratization)
- patience → 4 skills (timeManagement, adaptability, emotionalIntelligence, groundedResearch)
- exploring → 4 skills (adaptability, creativity, criticalThinking, multimodalCreation)
- helping → 4 skills (emotionalIntelligence, collaboration, communication, aiLiteracy)
- building → 5 skills (creativity, problemSolving, leadership, agenticCoding, workflowOrchestration)

**Total unique skills mapped:** 19 of 54 (35%)

### Skills → Characters
- 30 of 54 skills (56%) have character development associations
- Samuel associated with 9 skills (most)
- Jordan, Kai, Rohan associated with 8-10 skills each

### Patterns → Dialogue
- 113 total pattern reflections in NPC dialogue
- 17 of 20 characters have pattern-gated content
- Pattern unlocks accessible via conditional choices

---

## Design Philosophy

### Core Principles

1. **Single Source of Truth:** TypeScript source files are authoritative
2. **Auto-Generation Where Possible:** Reduce manual drift with scripts
3. **Human Curation Where Valuable:** Design notes, philosophy, examples
4. **Verification Over Trust:** Automated checks for completeness
5. **Navigability Over Comprehensiveness:** Multiple focused files beat one massive file

### Documentation Standards

**Each file includes:**
- Overview with key stats
- Complete reference (tables, lists)
- Validation rules with TypeScript examples
- Usage examples
- Cross-references to related sections
- Design notes (philosophy, constraints, future)

**Auto-generated sections have:**
- Timestamp of generation
- Source file reference
- Status indicator (Auto-generated)

**Manual sections have:**
- Design philosophy
- Usage patterns
- Future considerations

---

## Quick Reference Commands

### File Navigation

```bash
# Open patterns documentation
code docs/reference/data-dictionary/03-patterns.md

# Open skills documentation
code docs/reference/data-dictionary/02-skills.md

# Open entire folder
code docs/reference/data-dictionary/
```

### Data Validation

```typescript
// Patterns
import { isValidPattern, PATTERN_TYPES } from '@/lib/patterns'
console.log(PATTERN_TYPES) // ['analytical', 'patience', 'exploring', 'helping', 'building']

// Skills
import { SKILL_DEFINITIONS } from '@/lib/skill-definitions'
console.log(Object.keys(SKILL_DEFINITIONS).length) // 54
```

### Quick Searches

```bash
# Find all pattern references in code
grep -r "analytical\|patience\|exploring\|helping\|building" content/

# Count skill usages
grep -r "criticalThinking" content/ | wc -l
```

---

## Success Metrics

A successful data dictionary achieves:

1. **Discoverability** - New team members find it in < 30 seconds
2. **Accuracy** - No drift between source and docs (verified by script)
3. **Completeness** - All 10 categories documented
4. **Maintainability** - Auto-generation reduces burden 50%+
5. **Usefulness** - Regularly referenced by team

**Key Indicator:** "What emotions are valid?" → "Check `/docs/reference/data-dictionary/01-emotions.md`"

---

## Contact and Contributions

### Reporting Issues
- **Drift detected?** Run `npm run verify-data-dict` and report output
- **Missing metadata?** Check source files first, then update docs
- **Unclear documentation?** Suggest improvements in design notes

### Adding New Metadata Categories
1. Update this index with new category
2. Create new markdown file following template
3. Update auto-generation script if applicable
4. Add cross-references to related files

---

**Document Control:**
- Location: `/docs/reference/data-dictionary/`
- Parent: `/docs/reference/` (Reference documentation folder)
- Related: `/docs/01_MECHANICS/` (Game mechanics documentation)

**Last Updated:** January 13, 2026
**Next Review:** April 13, 2026 (Quarterly audit)
