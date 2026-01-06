# Documentation Reorganization Report
**Date**: 2026-01-04
**Auditor**: Antigravity

## 1. Overview
The `docs/` folder has been completely restructured from an organic collection of files into a **AAA Studio Standard** library. The goal was to ensure that every file has a home, and that "Lost Artifacts" were rescued from the archives to serve as the project's "Conscience."

## 2. The New Structure

### [00_CORE](../00_CORE/) ("The Why")
*   **Vision**: `LIVING_DESIGN_DOCUMENT.md` (The "Iceberg" philosophy).
*   **Critique**: `docs/00_CORE/critique/` (The "Shadow Documentation").
    *   *Includes*: `FIVE_LENSES_AUDIT`, `CHOICE_CONSEQUENCE`, `ARCHITECT_MANIFESTO`, `GROUNDED_MYTH_SPEC`, `COGNITIVE_LOAD_FRAMEWORK`, `TYPOGRAPHY_READABILITY_BIBLE`.
    *   *New Rescue*: `DESIGN_THEORY_BIBLE.md` & **`DEVIL_ADVOCATE_AUDIT_OCT23.md`** (The "Bad Cop" Audit).
*   **Templates**: `docs/00_CORE/templates/` (The "Physics").
    *   *Includes*: `CHARACTER_ARC_STRUCTURE.md` (The 4-Act Template), `WRITER_BRIEFS_TEMPLATE`.

### [01_MECHANICS](../01_MECHANICS/) ("The What")
*   **Architecture**: **`STATE_ARCHITECTURE.md`** (Rescued from `lib/` - The technical source of truth).
*   **Audits**: `GAME_CAPABILITIES_AUDIT.md` (The Master Index).
*   **Specs**: 
    *   `IMMERSION_SYSTEM_SPEC.md` (New Immersion Plan).
    *   `PROGRESSION_SYSTEM_SPEC.md` (The "Insight System" fix for Orbs).
    *   `SKILLS_ENGAGEMENT_LINK.md` (The WEF Connection).
    *   `URGENCY_TEXT_SPEC.md` (Glass Box Limits).
    *   `ADVISOR_BRIEFING_SPEC.md` (Admin Report Card).

### [02_WORLD](../02_WORLD/) ("The Where")
*   **Truth**: `STATION_HISTORY_BIBLE.md`.
*   **Lore**: `docs/02_WORLD/04_LORE/` (New Folder).
    *   *Includes*: **`LUX_DIGITAL_SLOTH_BACKSTORY.md`** (Rescued from `story/` - The Mascot's Soul).
*   **Factions**: `Technocrats`, `Naturalists`, `Brokers`.
*   **Characters**: `docs/02_WORLD/03_CHARACTERS/`.

### [03_PROCESS](../03_PROCESS/) ("The How")
*   **Active Plans**: `POLISH_SPRINT_PLAN.md` (The Roadmap).
*   **Gap Analysis**: `DOCUMENTATION_GAP_ANALYSIS.md`.
*   **Insights Log**: `ARCHIVE_INSIGHTS_DATABASE.md` (The full systematic review log).

### [reference](../reference/) ("The Inspiration")
*   **Research**: 
    *   **`RPG_SYSTEMS_ANALYSIS.md`** (The 600-line deep dive on BG3/Disco Elysium/Witcher 3).
    *   **`NEUROSCIENCE_FRAMEWORK.md`** (Polyvagal Theory & Learning).
    *   `patient_centered_data.md`.

## 3. Notable Rescues ("The Lost Artifacts")
We conducted a systematic review of ~120 archive files AND a global scan of the codebase, rescuing 20+ critical documents.

### The "Hidden Clusters" (Located outside docs/)
*   **`STATE_ARCHITECTURE.md`**: Was hidden in `lib/`. A critical technical spec.
*   **`LUX_DIGITAL_SLOTH_BACKSTORY.md`**: Was in `story/`. The narrative core of the guide.
*   **`RPG_SYSTEMS_ANALYSIS.md`**: Was in `docs/new_enhancement/`. A massive research paper on RPG mechanics.
*   **`DEVIL_ADVOCATE_AUDIT_OCT23.md`**: Was in `test-screenshots/`. A critical stability audit.

### The "Conscience" (Archive Critiques)
*   **`FIVE_LENSES_AUDIT`**: Identifies the "Iceberg Problem" (60% value hidden).
*   **`CHOICE_CONSEQUENCE`**: Admitted the Skills system was vestigial.
*   **`ARCHITECT_MANIFESTO`**: Defines "Honest Architecture" and "Brutal & Brilliant".

The documentation is now fully synchronized with the codebase. The "Trojan Horse" Strategy is clearer than ever: The **Game** (01_MECHANICS) serves the **World** (02_WORLD), but relies on the **Critique** (00_CORE) to stay honest. Every hidden folder has been centralized.

## 5. Final Deep Cleanup (Jan 4, 2026)
To ensure zero structural debt before the Polish Sprint:
*   **Removed**: `docs/research`, `docs/vision`, `docs/00-core` (Non-compliant folders).
*   **Archived**: Their contents moved to `docs/03_PROCESS/04-archive/legacy_structures/`.
*   **Outcome**: The `docs/` folder now strictly follows the 4-Pillar Standard (`00_CORE`, `01_MECHANICS`, `02_WORLD`, `03_PROCESS`) + `reference/`.
