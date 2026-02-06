# Lux Story Documentation Navigation Guide

**For:** New team members, non-technical stakeholders, educators
**Last Updated:** January 2026

---

## Quick Start: Where Do I Find...?

### Game Design & Philosophy
📂 **Location:** `docs/00_CORE/`
- **What is Lux Story?** → `docs/00_CORE/00-readme.md`
- **Design principles** → `docs/00_CORE/critique/`
- **Writing templates** → `docs/00_CORE/templates/`

### Game Features & Capabilities
📂 **Location:** `docs/01_MECHANICS/`
- **All 572 features** → `docs/01_MECHANICS/21-infinite-canvas-feature-catalog.md`
- **How systems work** → `docs/01_MECHANICS/02-state-architecture.md`
- **What's implemented** → `docs/01_MECHANICS/11-game-capabilities-audit.md`

### Characters & Story
📂 **Location:** `docs/02_WORLD/`
- **All 20 characters** → `docs/02_WORLD/03_CHARACTERS/` (alphabetical)
- **World timeline** → `docs/02_WORLD/00_CORE_TRUTH/`
- **Locations** → `docs/02_WORLD/02_LOCATIONS/`
- **Factions** → `docs/02_WORLD/01_FACTIONS/`

### Development Status & Planning
📂 **Location:** `docs/03_PROCESS/`
- **Product vision (THE source of truth)** → `docs/03_PROCESS/50-isp-comprehensive-prd.md`
- **Implementation checklist** → `docs/03_PROCESS/52-software-development-ready.md`
- **Current status** → `docs/03_PROCESS/10-system-coverage.md`
- **Feature progress (572 tracked)** → `docs/03_PROCESS/11-feature-progress-tracker.md`

### For Educators & Pilots
📂 **Location:** `docs/reference/` and `docs/03_PROCESS/archive/DEC2024/`
- **Educator guide** → Archived in `docs/03_PROCESS/archive/DEC2024/EDUCATOR_GUIDE.md`
- **Student instructions** → Archived in `docs/03_PROCESS/archive/DEC2024/STUDENT_INSTRUCTIONS.md`
- **Scientific foundation** → `docs/SCIENTIFIC_FOUNDATION.md`

### For Developers & Engineers
📂 **Location:** Root directory + `lib/`
- **Quick context** → `CLAUDE.md` (root directory - PRIMARY reference)
- **How to build** → `docs/03_PROCESS/00-readme.md`
- **Code architecture** → `docs/01_MECHANICS/02-state-architecture.md` + `docs/architecture/`
- **Testing guide** → `docs/03_PROCESS/01-testing.md`

---

## Document Hierarchy (What's Most Important?)

1. **CLAUDE.md** (root) - Start here! Master context for AI agents & developers
2. **docs/03_PROCESS/50-isp-comprehensive-prd.md** - Product vision
3. **docs/03_PROCESS/52-software-development-ready.md** - Implementation checklist
4. **docs/00_CORE/** - Game design philosophy (immutable principles)
5. **docs/02_WORLD/03_CHARACTERS/** - Character specs (for writers/designers)

---

## How Documentation is Organized

### The 4-Pillar System

**00_CORE** - Philosophy & Vision
→ The "why" behind everything. Immutable design principles.

**01_MECHANICS** - Technical Specifications
→ How systems work. Numbered docs (00-29) for easy scanning.

**02_WORLD** - Story & Content
→ Characters, locations, lore. Everything players experience.

**03_PROCESS** - Development & Execution
→ How we build, what's done, what's next.

### Numbering Convention (03_PROCESS)

| Number Range | Purpose | Example |
|--------------|---------|---------|
| 00-09 | Testing, Onboarding | `00-readme.md`, `01-testing.md` |
| 10-19 | Status, Coverage, Audits | `10-system-coverage.md` |
| 20-29 | Frameworks, Strategy | `20-lux-story-abc-story-framework.md` |
| 50-59 | Product Vision (SOURCE OF TRUTH) | `50-isp-comprehensive-prd.md` |
| 90-99 | Archive Index | `91-docs-reorg-log.md` |

---

## Finding Old Documents (Archive)

Historical documents live in `docs/03_PROCESS/archive/` organized by date:
- `JAN2026/` - January 2026 session docs
- `DEC2024/` - December 2024 historical work (root cleanup)
- `Sprint_1/`, `Sprint_2/` - Legacy sprint documentation
- `25DEC_session/`, `27DEC_session/`, `16DEC_sprint/` - December sprint work

**Why archived?** Preserves history without cluttering active work.

---

## Common Questions

**Q: Where's the deployment guide?**
A: Archived in `docs/03_PROCESS/archive/DEC2024/DEPLOYMENT_STATUS.md` (completed work)

**Q: Where are the walkthroughs for stakeholders?**
A: `docs/03_PROCESS/archive/DEC2024/CEO_WALKTHROUGH_*.md`

**Q: How do I know what's implemented vs. planned?**
A: Check `docs/03_PROCESS/11-feature-progress-tracker.md` (572 features with status)

**Q: Where's the master README?**
A: Root `README.md` for project overview, `docs/03_PROCESS/00-readme.md` for docs hierarchy

**Q: I'm not technical - where do I start?**
A: Read this guide, then `docs/00_CORE/00-readme.md`, then browse `docs/02_WORLD/03_CHARACTERS/`

**Q: What are the 20 characters?**
A: See `docs/03_PROCESS/onboarding/01-character-quick-reference.md` for quick overview

**Q: What's the difference between a "pattern" and a "skill"?**
A: See `docs/03_PROCESS/onboarding/02-glossary.md` for game terminology

---

## Quick Keyboard Navigation

If viewing in a code editor:
- `Cmd/Ctrl + P` - Quick file search
- Search for keywords like "character", "pattern", "trust", "simulation"

Naming makes things findable:
- Character specs: All in `docs/02_WORLD/03_CHARACTERS/`
- Process docs: Numbered by purpose in `docs/03_PROCESS/`
- Archive: Dated folders in `docs/03_PROCESS/archive/`

---

## Team Onboarding Checklist

### For Writers & Designers
- [ ] Read `docs/00_CORE/00-readme.md` - Game philosophy
- [ ] Browse `docs/02_WORLD/03_CHARACTERS/` - All 20 characters
- [ ] Read `docs/03_PROCESS/onboarding/02-glossary.md` - Game terminology
- [ ] Check `CLAUDE.md` - Master context (especially Character table)

### For Developers
- [ ] Read `CLAUDE.md` - Master context (PRIMARY reference)
- [ ] Review `docs/01_MECHANICS/02-state-architecture.md` - Code architecture
- [ ] Run `npm run test:run` - Verify environment (tests should pass)
- [ ] Check `docs/03_PROCESS/00-readme.md` - Build process

### For Stakeholders & Educators
- [ ] Read this navigation guide
- [ ] Review `docs/03_PROCESS/50-isp-comprehensive-prd.md` - Product vision
- [ ] Check `docs/03_PROCESS/10-system-coverage.md` - What's done
- [ ] See `docs/reference/COGNITIVE_GAMING_RESEARCH_SUMMARY.md` - Scientific foundation

---

**Document Control**
- Created: January 2026
- Purpose: Team onboarding for comprehensive repository cleanup
- Maintainer: Update when major structure changes occur
