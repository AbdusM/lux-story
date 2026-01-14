# Comprehensive Codebase Audit & Architecture Map
**Date:** November 25, 2025
**Scope:** Full analysis of the 'Lux Story' codebase.

## 1. System Architecture Map (Current State)

### A. Core Narrative Engine
*   **Type:** Graph-Based State Machine.
*   **Driver:** `StatefulGameInterface.tsx` (Main Loop).
*   **Data Structure:** `dialogue-graph.ts` defines nodes, choices, and consequences.
*   **Content:** Hardcoded TypeScript files in `content/` (e.g., `samuel-dialogue-graph.ts`).
*   **Logic:**
    *   **Traversal:** `DialogueGraphNavigator` moves between nodes.
    *   **Conditions:** `StateConditionEvaluator` checks flags/variables to show/hide choices.
    *   **State:** `GameStateManager` handles persistence (localStorage + Supabase sync).

### B. RPG & Tracking Systems
*   **Skill Tracking:** `SkillTracker` records skills based on choice selection (mapped in `scene-skill-mappings.ts`).
*   **Pattern Recognition:** `patterns.ts` tracks broad archetypes (e.g., 'Analytical', 'Empathetic').
*   **Trust System:** Basic variable tracking (`trust` integer 0-10) on character objects.
*   **Arc Completion:** `arc-learning-objectives.ts` detects when a story arc ends and generates a summary.

### C. Analysis & Meta-Layers
*   **Narrative Analysis:** `NarrativeAnalysisSystem` (Agent-like) analyzes story structure (pacing, hooks).
*   **Student Insights:** `student-insights-parser.ts` attempts to derive "real" insights from gameplay data.

### D. Tech Stack
*   **Frontend:** Next.js (App Router), React, Tailwind CSS, Shadcn UI.
*   **State:** React Context + LocalStorage (primary) + Supabase (background sync).
*   **Utilities:** Extensive library in `lib/` covering everything from PDF generation to neuroscience simulation placeholders.

---

## 2. AAA "Chat-Based" Gap Analysis
*Comparing 'Lux Story' against a theoretical "AAA Text RPG" (e.g., Disco Elysium, text-only mode).*

### 🔴 Critical Gaps (The "Game Feel")
1.  **Static Presentation:** Text appears effectively, but lacks "juice." AAA text games use distinct typography per character, varying text speeds for emotion (hesitation, shouting), and screen shake/color shifts for dramatic moments. *We have basic versions of this, but they need polish.*
2.  **Binary Logic:** Choices are mostly "A leads to B." AAA systems use "Fuzzy Logic" or "Thresholds" (e.g., "You need Trust > 5 AND 'Analytical' > 3 to see this option"). *We have this capability but use it sparsely.*
3.  **The "Silent" World:** The game is purely visual text. A AAA text game uses "Atmospheric Audio" (drones, distant train sounds) to create immersion without 3D graphics.
4.  **Feedback Loops:** When a player builds trust, they get a "+1" notification or a summary. In a AAA game, the *world changes* (NPCs greet you differently, new areas unlock implicitly).

### 🟡 Technical Debt / "Ghost" Code
*   **Over-Engineering:** `lib/` contains many systems (`neuroscience-system.ts`, `crisis-system.js`) that appear to be "ideas" rather than fully integrated mechanics. This creates noise and maintenance burden.
*   **Content Hardcoding:** Storing dialogue in `.ts` files makes it hard for writers to edit without a dev. AAA workflows use CMS or JSON/YAML pipelines.

---

## 3. "Ultrathink" Enhancement Plan (No AR/Multiplayer)

### Phase 1: The "Juicy" Text Engine (Polishing the Core)
*   **Objective:** Make reading feel like playing.
*   **Features:**
    *   **Dynamic Typography:** Different fonts/sizes for different "Voices" (Samuel = Serif/Grounded, Maya = Sans/Clean).
    *   **Text Effects:** Shake, wave, blur, and "glitch" effects for emotional emphasis (already started in `RichTextRenderer`, needs expansion).
    *   **Micro-Interaction:** Haptic feedback (mobile) or sound cues on specific key-presses.

### Phase 2: The "Deep" State (Psychological Simulation)
*   **Objective:** The game reads the player.
*   **Features:**
    *   **Hidden Metrics:** Track "Hesitation" (time to pick choice) and "Aggression" (word choice analysis).
    *   **Reactive Portraits:** Character avatars that subtly change expression based on the *current* trust level (not just static images).
    *   **The "Thought Cabinet":** A UI where players can see the "beliefs" they are forming (e.g., "Belief: The System is Broken") which unlocks unique dialogue options.

### Phase 3: The "Living" Script (Content Pipeline)
*   **Objective:** Infinite variability within boundaries.
*   **Features:**
    *   **Hybrid AI Dialogue:** Use LLMs to generate *variations* of the written lines based on context, keeping the core plot but making the conversation feel fresh every time.
    *   **Contextual Memory:** NPCs reference *specific* past choices naturally ("Remember when you told me about your dad?"), rather than just checking a flag.