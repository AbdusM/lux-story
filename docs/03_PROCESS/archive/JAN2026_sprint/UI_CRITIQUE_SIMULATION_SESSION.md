# UI Critique: Simulation Session (System Architecture)
**Session ID:** `passion` | **Component:** `SimulationRenderer.tsx`

## Executive Summary
The "System Architecture" simulation UI provides a functional textual representation of the task but falls short of the "Premium/Holographic" aesthetic established elsewhere in the application. It relies heavily on standard web conventions (macOS-style window controls, raw `<pre>` blocks) rather than immersive, diegetic interface elements.

## 🔎 Critical Findings

### 1. Visual Authenticity & Immersion
*   **ISSUE:** The "Terminal View" uses standard macOS-style window controls (Red/Yellow/Green circles) on the top right.
    *   *Critique:* This breaks the "Satellite OS" narrative. We are not on a Mac; we are on a custom embedded system.
    *   *Recommendation:* Replace with sci-fi glyphs (square, diamond, cross) or simple monochromatic indicators.
*   **ISSUE:** The "Mission Objective" box is a distinct, heavy UI block (`bg-slate-900/30`) separated from the terminal.
    *   *Critique:* It feels like "game UI" rather than "system UI".
    *   *Recommendation:* Integrate the objective as a "System Comment" block at the top of the code, or a floating glass overlay that can be dismissed.

### 2. Syntax & Readability
*   **ISSUE:** The code/content is rendered as a single monochromatic block (`text-emerald-300`).
    *   *Critique:* Complex data (Sensor Inputs, Arrays, PID Loops) is hard to parse. It looks like a wall of text rather than structured data.
    *   *Recommendation:* Implement a lightweight syntax highlighter or manual color parsing.
        *   Keys (`SENSOR INPUT`): Cyan
        *   Values (`2.3N`): White/Amber
        *   Warnings (`OSCILLATING`): Red/Orange with glow.
*   **ISSUE:** The font handling is generic (`font-mono`).
    *   *Critique:* It lacks the specific "technical" feel of a high-end interface.

### 3. Layout & Responsiveness
*   **ISSUE:** The terminal height is capped (`max-h-[300px]`) even on large desktops.
    *   *Critique:* This creates unnecessary scrolling and hides the context of the simulation.
    *   *Recommendation:* Use `flex-1` to fill available vertical space, especially since `StatefulGameInterface` has a fixed height container.

### 4. Missed Opportunities
*   **Dynamic Data:** The screenshot implies "OSCILLATING" values.
    *   *Opportunity:* Animate these specific values! Use `<KineticText>` for numbers that are "fluctuating" (jitter effect).
*   **Cursor/Type Effects:** The chat mode has a "typing" indicator, but the terminal mode is static.
    *   *Opportunity:* Specific lines could "stream" in or have a blinking block cursor at the bottom to imply an active connection.
*   **Scanlines/Glow:** The terminal background is a flat color.
    *   *Opportunity:* Add extremely subtle scanlines or a CRT bloom effect to the `<pre>` container to sell the "remote connection" vibe.

## 🛠 Proposed Action Plan

1.  **Refactor `SimulationRenderer.tsx`**:
    *   Remove macOS window controls.
    *   Add `SimpleSyntaxHighlighter` helper function.
    *   Support `rich content` rendering (Parsing `[ERROR]` or `[WARNING]` tags in the content string to apply styles).
2.  **Enhance `maya-dialogue-graph.ts` Content**:
    *   Update the text content to include markup for the syntax highlighter (e.g. `{{val:2.3N}}` or just regex matching).

## Mockup comparison
| Feature | Current | Ideal "Satellite OS" |
| :--- | :--- | :--- |
| **Window Controls** | 🔴 🟡 🟢 (Mac) | `[ _ ] [ □ ] [ X ]` (Technical) |
| **Code Color** | All Green | Syntax Highlighted (Keys/Values/Alerts) |
| **Motion** | None | Jittering values, blinking cursor |
| **Objective** | External Box | Integrated "Comment Block" header |
