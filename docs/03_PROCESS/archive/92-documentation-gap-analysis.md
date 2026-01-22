# Documentation Gap Analysis & Reorganization Plan

**Date**: 2030-05-15 (Simulated)
**Target Standard**: AAA Studio (Ubisoft/Bioware style)

---

## 1. The Gap Analysis

### Current State ("Organic Sprawl")
The `docs/` folder reflects the project's rapid, iterative development history. It is functional but disorganized, mixing "Source of Truth" documents with ephemeral sprint logs.

*   **Strengths**: High-quality individual artifacts (`GAME_CAPABILITIES_AUDIT`, `STATION_HISTORY_BIBLE`).
*   **Weaknesses**:
    *   **Root Clutter**: 13 files in the root directory.
    *   **Inconsistent Naming**: Mixed schemes (`00-core` vs `worldbuilding` vs `16DECSprint`).
    *   **Hidden Gems**: Critical lore buried in subfolders.
    *   **Dead Weight**: `archive` and `04-archive` split the history.

### Missing Capabilities (The "Gap")
To match the sophistication of the "Worldbuilding OS" engine we just audited, the documentation needs:
1.  **A Single Source of Truth for Mechanics**: The `DelayGifts` and `ThoughtSystem` are documented in code but lack a dedicated design spec in docs.
2.  **Unified World Bible**: Character specs are in `worldbuilding/` but the history is in root.
3.  **Onboarding Path**: A clear `00_START.md` or equivalent for new devs (or future AI agents).

---

## 2. The AAA Target Structure

We will reorganize the entire directory into 4 canonical pillars.

### 🏛️ `00_CORE` (The Pillars)
*   *Purpose*: Vision, Principles, High-Level Architecture.
*   *Moves*: `DESIGN_PRINCIPLES.md`, `LIVING_DESIGN_DOCUMENT.md`, `README.md` (Copy/Link).

### ⚙️ `01_MECHANICS` (The Engine)
*   *Purpose*: Systems, Technical Audits, Implementation Specs.
*   *Moves*: `GAME_CAPABILITIES_AUDIT.md`, `SYSTEM_INTEGRATION_REPORT.md`, `CAREER_MAPPING_MATRIX.md`, `SKILL_MODAL_ENHANCEMENT.md`.

### 🌍 `02_WORLD` (The Bible)
*   *Purpose*: Lore, Characters, Locations, Scripts.
*   *Moves*: `STATION_HISTORY_BIBLE.md`, entire `worldbuilding/` folder content.

### 📜 `03_PROCESS` (The Logs)
*   *Purpose*: Sprints, Plans, Archives, Ephemeral notes.
*   *Moves*: `16DECSprint`, `27dec`, `POLISH_SPRINT_PLAN.md`, `archive`, `04-archive`.

---

## 3. Migration Plan (Sub-Agent Instructions)

### Phase 1: Creation
1.  Create `00_CORE`, `01_MECHANICS`, `02_WORLD`, `03_PROCESS`.

### Phase 2: Consolidation
1.  **Core**: Move Vision/Design docs.
2.  **Mechanics**: Move Audit/Matrix/Tech docs.
3.  **World**: Move `STATION_HISTORY_BIBLE` and merge `worldbuilding/` subfolders.
4.  **Process**: Sweep all dated folders (`16DEC...`) and `archive` folders into `03_PROCESS`.

### Phase 3: Validation
1.  Update `README.md` links.
2.  Verify no data loss.

---

**Approval Status**: 🚦 READY FOR EXECUTION
