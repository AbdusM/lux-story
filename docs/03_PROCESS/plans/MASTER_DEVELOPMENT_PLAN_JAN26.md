# Master Development Plan: Lux Story (Jan 26 Onward)

**Date:** January 8, 2026
**Status:** DRAFT (v2 - Expanded with PRD & Strategy)
**Strategic Impact:** High (Aligns w/ AAA Quadrant B "Focused")

This document outlines the comprehensive software development roadmap, synthesizing **Tactical Fixes** (Browser Review) with **Strategic Goals** (AAA PRD & ISP Framework).

It ensures we are not just "fixing bugs" but building the **"Worldbuilding OS"** vision defined in the Strategic Framework.

---

## 1. STRATEGIC PHASING (The 70/20/10 Alignment)

We are adopting the **Vertical Slice** methodology to prevent "Mile Wide, Inch Deep" issues.

| Phase | Strategic Goal | Focus Area | Capstone Feature |
|-------|----------------|------------|------------------|
| **Phase 0: Foundation** | **Stability (The "Hands")** | Core Loop & Debt | `Interrupt System` |
| **Phase 1: Immersion** | **Feel (The "Heart")** | Navigation & Visuals | `Star Walking` (ISP: Spatial Metaphor) |
| **Phase 2: The OS** | **Depth (The "Brain")** | Satellite Menus | `Thought Cabinet` & `Relationship Web` |
| **Phase 3: Evolution** | **Mastery (The "Soul")** | Time & Secrets | `Time Scrubbing` |

---

## Phase 0: Stabilization ("The Critical Path")

**Objective:** Complete the "Vertical Slice" (Sector 0) to 100% specification.

| Item | Priority | Source | Description | Capabilities Used |
|------|----------|--------|-------------|-------------------|
| **Interrupt System** | **CRITICAL** | PRD (Pillar 1) | Enable players to physically interrupt NPC monologues. | React Interactivity |
| **Pattern Voice Fix** | **High** | Backlog | Ensure 5/5 voice coverage per character. (Discrepancy Check). | Asset Pipeline |
| **Quinn's Cluster** | **High** | Verification | Verify "LinkedIn 2026" path reachability. | Routing Logic |
| **Mobile Polish** | **Med** | Handoff | Touch target & safe area refinments. | Responsive CSS |

---

## Phase 1: "Touching the Stars" (Visual & Navigation Polish)

**Objective:** Elevate the UI from "Menu" to "World" (ISP Cluster: Spatial Metaphor).

| Item | Priority | Source | Description | Capabilities Used |
|------|----------|--------|-------------|-------------------|
| **Star Walking** | **High** | Idea 003 | **(APPROVED)** Click-to-travel on Constellation Map. | D3/Canvas Interactivity |
| **Atmosphere Tuning** | **Med** | Handoff | Refine glass-morphism & character-specific color palettes. | CSS Variables / Animations |
| **Visual Orb Handoff** | **Med** | Idea 001 | Create "Ceremony" around the Orb using CLI/ASCII art initially. | React Typewriter / ASCII |

---

## Phase 2: "The Satellite OS" (Deepening the System)

**Objective:** Implement the deep features of the Side Menu defined in PRD Section 5.H. **This is the main gap in the previous plan.**

| Item | Priority | Source | Description | Capabilities Used |
|------|----------|--------|-------------|-------------------|
| **Relationship Web** | **High** | PRD 5.H.3 | Force-directed graph showing "Echoes" (Who knows Who). | D3.js Force Simulation |
| **Deep Profile** | **High** | PRD 5.H.3 | "Public Stance" vs "Private Opinion" toggle on character cards. | State Management |
| **Thought Cabinet** | **Med** | PRD 5.H.4 | "Inventory" for ideas. Thoughts "cook" over time to become buffs. | Timer Logic / State Persistence |
| **The Fog** | **Low** | PRD 5.H.2 | Blur/Dim unused skills in the Harmonics view. | SVG Filters / CSS Blur |

---

## Phase 3: "Temporal Mastery" (Future Capabilities)

**Objective:** Leverage the "Time" capability of our engine.

| Item | Priority | Source | Description | Capabilities Used |
|------|----------|--------|-------------|-------------------|
| **Time Scrubbing** | **Med** | Idea 006 | Timeline slider to review conversation history. | State History / Replay |
| **Resonance Paths** | **Low** | Idea 004 | Highlight hidden connections based on Pattern. | Pathfinding Algorithms |

---

## Technical Feasibility & Capabilities Check

**Are we using our capabilities?**

1.  **ISP (Infinite Solutions Protocol):**
    *   *Spatial Metaphor:* Yes, **Star Walking** moves navigation from list to map.
    *   *Self-Awareness:* Yes, **Relationship Web** visualizes the player's impact.
    *   *Fog of War:* Yes, explicitly added to Phase 2 (Harmonics Fog).

2.  **Engine Capabilities:**
    *   *State Persistence:* Leveraging `localStorage` for "Thought Cabinet" cooking timers.
    *   *Graph Engine:* "Relationship Web" will push the D3/Graph engine harder than current Constellation.

---

## Immediate Action Plan

1.  **Execute Phase 0 (Stabilization):**
    *   Clarify **Interrupt System** status (files missing?).
    *   Verify **Pattern Voice** coverage.
2.  **Queue Phase 1 (Star Walking):**
    *   This is the highest "ROI" feature for "Feel".
