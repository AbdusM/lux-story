# Simulation UI Audit (Jan 2026)

## Executive Summary
This audit analyzes the 8 identified simulations across the codebase against the "Satellite OS" aesthetic and immersive standards.
**Key Finding:** While the wrapper UI (Window Controls) has been standardized, the *internal renderers* are largely generic. Critical gaps exist for `audio_studio` (Lira) and `code_refactor` (Marcus), which fall back to default layouts.

## 1. Inventory & Status

| Character | Type ID | Title | Implementation Status | Aesthetic Alignment |
| :--- | :--- | :--- | :--- | :--- |
| **Maya** | `system_architecture` | Servo Control Debugger | **Polished** | ✅ High (Reference) |
| **Kai** | `visual_canvas` | Safety System Blueprint | ⚠️ Generic | 🟡 Medium |
| **Asha** | `visual_canvas` | Mural Concept Gen | ⚠️ Generic | 🟡 Medium |
| **Lira** | `audio_studio` | Soundtrack Generation | ❌ **MISSING** | 🔴 Low (Defaults to Terminal) |
| **Marcus** | `dashboard_triage` | Workflow Orchestration | 🟡 Basic | 🟡 Medium (Generic Dashboard) |
| **Marcus** | `code_refactor` | Architectural Refactor | ❌ **MISSING** | 🔴 Low (Defaults to Terminal) |
| **Zara** | `data_analysis` | Dataset Audit | 🟡 Basic | 🟡 Medium (Generic Dashboard) |
| **Devon** | `chat_negotiation` | Father Conversation | 🟡 Basic | 🟡 Medium (Slack-style) |

---

## 2. Global Critiques

### A. The "Generic Canvas" Problem
Kai (Blueprints) and Asha (Murals) share the exact same `visual_canvas` renderer.
*   **Issue:** A safety blueprint and an artistic mural should not look identical.
*   **Impact:** Reduces character distinctiveness.
*   **Recommendation:** Split into `blueprint_editor` (Grid, CAD lines, snapping) and `art_canvas` (Brush textures, color palette).

### B. Missing Renderers (The "Terminal Fallback")
types `audio_studio` and `code_refactor` are not defined in `SimulationRenderer.tsx`'s switch case.
*   **Issue:** They fall through to the default `Terminal` renderer.
*   **Impact:**
    *   Lira's "Soundtrack" looks like a text terminal, not a DAW (Digital Audio Workstation).
    *   Marcus's "Refactor" looks like a generic log, not a code editor (IDE).
*   **Recommendation:** Create distinct sub-renderers for these.

### C. Text Readability & Syntax Highlighting
*   **Status:** Basic highlighting added for Maya.
*   **Gap:** Other simulations (especially Zara's Data Audit) display raw CSV/Log text without highlighting active rows, errors, or outliers.

---

## 3. Specific Recommendations

### 🎵 Lira: `audio_studio` (Priority High)
*Current:* Text terminal.
*Target:* **waveform_visualizer**.
*   **Visuals:** Animated waveform visualization (using simple CSS bars or Canvas).
*   **Interactive:** "Play" button that actually triggers a sound effect (or simulates it visually).
*   **Satellite OS:** VU Meters, Frequency Spectrum analyzer in the side panel.

### 🏗️ Kai: `visual_canvas` -> `blueprint_editor`
*Current:* Empty grid.
*Target:* **CAD Interface**.
*   **Visuals:** Blueprint blue background, white lines. Draggable component "ghosts".
*   **Interactive:** "Drag & Drop" interaction simulation (e.g., clicking a slot 'places' the sensor).

### ⚕️ Marcus: `dashboard_triage`
*Current:* Static cards.
*Target:* **Live Triage Board**.
*   **Visuals:** Rows that animate/slide in. "Urgency" indicators that pulse red.
*   **Interactive:** "Approve/Reject" swipe gestures or buttons for each item.

### 📊 Zara: `data_analysis`
*Current:* Static text block.
*Target:* **Data Grid**.
*   **Visuals:** Excel-like grid with highlighted "Suspicious" cells (red background).
*   **Interactive:** Hovering over a row reveals "Metadata" in a tooltip.

### 💬 Devon: `chat_negotiation`
*Current:* Slack-style list.
*Target:* **Secure Comm Link**.
*   **Visuals:** Encryption keys handshake animation at start. "Typing..." waveform.
*   **Satellite OS:** "Signal Strength" and "Encryption Level" indicators.

## 4. Implementation Plan (Next Steps)

1.  **Refactor `SimulationRenderer`:** Extract internal renderers into separate components (`SimTerminal`, `SimDashboard`, `SimCanvas`, `SimChat`).
2.  **Add `SimAudio`:** Implement visuals for Lira.
3.  **Add `SimCode`:** Implement Monaco-lite visuals for Marcus.
4.  **Enhance `SimCanvas`:** Add `variant` prop (`blueprint` vs `art`).
