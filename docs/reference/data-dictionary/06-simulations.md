# Simulations - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/content/simulation-registry.ts`, `/lib/simulation-registry.ts`, `/lib/dialogue-graph.ts`
**Status:** Auto-generated

## Overview

Simulations are immersive interactive experiences where players help characters navigate challenging scenarios. They transform dialogue nodes into specialized tool interfaces (terminals, canvases, dashboards, etc.) that reveal character growth arcs and teach real-world AI/workflow skills.

**Key Stats:**
- Total simulations: 20 unique (1 per character)
- Simulation types: 16 distinct interface types
- Phases: 3 (Introduction, Application, Mastery)
- Difficulty tiers: 3 (introduction, application, mastery)
- Display modes: 2 (fullscreen, inline)
- AI tool parallels: 7 real-world tools mapped

---

## Complete Simulation Catalog

### Core Characters (9 simulations)

#### 1. Maya - The Pitch (Innovation Showcase)
- **ID:** `maya_servo_debugger`
- **Type:** `system_architecture`
- **Icon:** 💼 briefcase / wrench
- **Theme:** Authenticity vs. Expectation
- **Description:** Help Maya present her robotics prototype to investors while her skeptical parents watch from the audience. Calibrate mechanical arm PID parameters.
- **Entry Node:** `maya_robotics_passion`
- **Completion Flag:** `maya_simulation_complete`
- **Phase:** 1 (Introduction)
- **Task:** "The loading arm is oscillating wildly. The PID controller needs retuning."

---

#### 2. Grace - Patient Comfort (Home Health Visit)
- **ID:** `grace_diagnostics`
- **Type:** `dashboard_triage` (medical variant)
- **Icon:** ❤️ heart / activity
- **Theme:** Care Beyond Protocol
- **Description:** Navigate a difficult home health situation where medical knowledge meets human compassion. Analyze complex patient vitals.
- **Entry Node:** `grace_the_moment_setup`
- **Completion Flag:** `grace_simulation_complete` (knowledge)
- **Phase:** 1 (Introduction)
- **Task:** "Patient presenting with unknown toxicity. Isolate the compound."

---

#### 3. Tess - The Classroom (Teaching Moment)
- **ID:** `tess_botany`
- **Type:** `botany_grid` (cellular automata)
- **Icon:** 📚 book / sprout
- **Theme:** Purpose Through Sacrifice
- **Description:** Step into Tess's past as a teacher facing a pivotal moment that changed her career path. Optimize nutrient flow for rare flora.
- **Entry Node:** `tess_the_pitch_setup`
- **Completion Flag:** `tess_simulation_complete` (knowledge)
- **Phase:** 1 (Introduction)
- **Task:** "The Moonlight Orchid is fading. Rebalance nutrient mix to match genetic markers."

---

#### 4. Alex - The Logistics Puzzle (Supply Chain Crisis)
- **ID:** `alex_negotiation`
- **Type:** `chat_negotiation` (influence vector)
- **Icon:** 🧭 compass / users
- **Theme:** Order From Chaos
- **AI Tool:** Logistics AI
- **Description:** Help Alex solve a critical supply chain problem using systems thinking. Navigate complex social dynamics.
- **Entry Node:** `alex_llm_project_reveal`
- **Completion Flag:** `alex_logistics_completed` (knowledge)
- **Phase:** 1 (Introduction)
- **Task:** "Convince the Bootcamp Director that the curriculum is failing students."

---

#### 5. Yaquin - The Review (EdTech Demo)
- **ID:** `yaquin_timeline`
- **Type:** `historical_timeline`
- **Icon:** ⚡ zap / book
- **Theme:** Vision vs. Reality
- **Description:** Guide Yaquin through a high-stakes product review that could make or break their startup. Cross-reference historical events.
- **Entry Node:** `yaquin_simulation_intro`
- **Completion Flag:** `yaquin_review_simulation_complete`
- **Phase:** 1 (Introduction)
- **Task:** "Verify the date of the 'Great Blackout'. Records conflict."

---

#### 6. Devon - The System (Logic Debugging)
- **ID:** `devon_logic`
- **Type:** `conversation_tree`
- **Icon:** 💻 code / network
- **Theme:** Logic vs. Emotion
- **Description:** Help Devon debug an emotional logic flow that reveals deeper truths about human connection. Map family dynamics.
- **Entry Node:** `devon_explains_system`
- **Completion Flag:** `devon_arc_complete`
- **Phase:** 1 (Introduction)
- **Task:** "Map the communication breakdown between Father and Son."

---

#### 7. Jordan - Launch Crisis (Product Negotiation)
- **ID:** `jordan_structural`
- **Type:** `architect_3d`
- **Icon:** 👥 users / drafting-compass
- **Theme:** Compromise vs. Conviction
- **Description:** Navigate a high-stakes product launch negotiation where user retention hangs in the balance. Ensure station integrity.
- **Entry Node:** `jordan_job_reveal_7`
- **Completion Flag:** `jordan_arc_complete`
- **Phase:** 1 (Introduction)
- **Task:** "Micro-fractures detected in Sector 7 supports."

---

#### 8. Marcus - The Automation (Code Evolution)
- **ID:** `marcus_triage`
- **Type:** `dashboard_triage`
- **Icon:** 💻 code / activity
- **Theme:** Human Touch vs. Efficiency
- **AI Tool:** Cursor AI
- **Description:** Experience the tension between human expertise and AI automation in healthcare systems. Manage patient inflow during crisis.
- **Entry Node:** `marcus_simulation_cursor`
- **Completion Flag:** `marcus_arc_complete`
- **Phase:** 1 (Introduction)
- **Task:** "Emergency overflow. Sort patients by urgency level."

---

#### 9. Samuel - The Listener's Log (Station Wisdom)
- **ID:** `samuel_ops`
- **Type:** `conductor_interface`
- **Icon:** 👥 users / train-front
- **Theme:** The Power of Listening
- **AI Tool:** HubSpot (metaphor)
- **Description:** Learn the art of truly hearing others through Samuel's accumulated wisdom. Monitor total station health.
- **Entry Node:** `samuel_listener_intro`
- **Completion Flag:** `samuel_listener_complete`
- **Phase:** 1 (Introduction)
- **Task:** "Override lock on Express Line for emergency transport."

---

### Secondary Characters (7 simulations)

#### 10. Kai - The Safety Drill (Emergency Protocol)
- **ID:** `kai_blueprint`
- **Type:** `visual_canvas` (blueprint_editor)
- **Icon:** 🛡️ shield / draftjs
- **Theme:** Preparation Meets Crisis
- **Description:** Experience Kai's world of safety protocols when a routine drill becomes unexpectedly real. Design fail-safe mechanisms.
- **Entry Node:** `kai_safety_drill_intro`
- **Completion Flag:** `simulation_complete` (tag)
- **Phase:** 1 (Introduction)
- **Task:** "The airlock cycling mechanism is jamming. Redesign the safety interlock circuit."

---

#### 11. Rohan - The Ghost (System Anomaly)
- **ID:** `rohan_nav`
- **Type:** `visual_canvas`
- **Icon:** 💻 code / compass
- **Theme:** Truth in the Machine
- **Description:** Dive deep into the station's systems with Rohan to trace a mysterious anomaly to its source. Chart routes through the stars.
- **Entry Node:** `rohan_ghost_intro`
- **Completion Flag:** `simulation_complete` (tag)
- **Phase:** 1 (Introduction)
- **Task:** "Plot a course to the 'Lost Sector'."

---

#### 12. Silas - The Drought (Manufacturing Crisis)
- **ID:** `silas_soil`
- **Type:** `dashboard_triage`
- **Icon:** 🔧 wrench / sprout
- **Theme:** Scarcity and Innovation
- **Description:** Face a critical resource shortage with Silas that tests leadership under pressure. Analyze soil microbiome data.
- **Entry Node:** `silas_drought_intro`
- **Completion Flag:** `simulation_complete` (tag)
- **Phase:** 1 (Introduction)
- **Task:** "Determine why the Basil crop failed despite optimal sensor readings."

---

#### 13. Elena - The Search (Pattern Analysis)
- **ID:** `elena_market`
- **Type:** `market_visualizer` (ticker)
- **Icon:** 🔍 search / trending-up
- **Theme:** Signal vs. Noise
- **AI Tool:** Perplexity
- **Description:** Help Elena trace suspicious patterns through the station's data archives. Track resource scarcity.
- **Entry Node:** `elena_perplexity_intro`
- **Completion Flag:** `elena_arc_complete`
- **Phase:** 1 (Introduction)
- **Task:** "There is a run on water filters. Stabilize the price."

---

#### 14. Quinn - Portfolio Analysis (Investment Strategy)
- **ID:** `quinn_pitch`
- **Type:** `creative_direction`
- **Icon:** 💼 briefcase / presentation
- **Theme:** Risk vs. Reward
- **Description:** Analyze investment risk and opportunity with Quinn's data-driven approach.
- **Entry Node:** `quinn_simulation_pitch_intro`
- **Completion Flag:** `quinn_simulation_complete`
- **Phase:** 1 (Introduction)
- **Task:** "Investors are skeptical. Build a slide deck that sells the vision."

---

#### 15. Nadia - Headline Editor (Strategic Communication)
- **ID:** `nadia_news`
- **Type:** `chat_negotiation`
- **Icon:** 📚 book / newspaper
- **Theme:** Truth vs. Impact
- **Description:** Shape public perception through strategic framing and ethical journalism with Nadia.
- **Entry Node:** `nadia_sim_hype`
- **Completion Flag:** `nadia_simulation_complete`
- **Phase:** 1 (Introduction)
- **Task:** "A riot is starting. Edit the headline to de-escalate."
- **Synesthesia Target:** De-escalation (Low Urgency, Neutral Tone, High Nuance)

---

### Extended Characters (4 simulations)

#### 16. Asha - The Canvas (Visual Creation)
- **ID:** `asha_mural`
- **Type:** `visual_canvas` (art canvas)
- **Icon:** 🎨 palette
- **Theme:** Human Touch in AI Art
- **AI Tool:** Stable Diffusion
- **Description:** Explore the intersection of AI and art with Asha as she creates something meaningful. Design public art for the station.
- **Entry Node:** `asha_visual_canvas_intro`
- **Completion Flag:** `asha_arc_complete`
- **Phase:** 1 (Introduction)
- **Task:** "The Grand Hall wall is empty. Design a mural that represents 'Unity'."

---

#### 17. Lira - The Studio (Sound Design)
- **ID:** `lira_audio`
- **Type:** `audio_studio` (synesthesia engine)
- **Icon:** 🎤 mic / music
- **Theme:** Memory in Sound
- **AI Tool:** Suno/Udio
- **Description:** Craft audio experiences with Lira that capture emotion beyond words. Visualize the station's ambient hum.
- **Entry Node:** `lira_audio_studio_intro`
- **Completion Flag:** `lira_composition_complete` (knowledge)
- **Phase:** 1 (Introduction)
- **Task:** "The station's reactor hum has a dissonance. Isolate the irregular frequency."
- **Synesthesia Target:** Dementia/Confusion (Slow, Dark, Dense texture)

---

#### 18. Zara - The Analysis (Data Ethics)
- **ID:** `zara_audit`
- **Type:** `data_audit`
- **Icon:** 🎨 palette / database
- **Theme:** Truth in Data
- **AI Tool:** Excel/Data Tools
- **Description:** Navigate the ethical complexities of data with Zara when numbers tell uncomfortable truths. Find anomalies in large datasets.
- **Entry Node:** `zara_data_analysis_intro`
- **Completion Flag:** `zara_arc_complete`
- **Phase:** 1 (Introduction)
- **Task:** "The water usage logs show phantom consumption."

---

#### 19. Dante - Pitch Deck Builder (Sales Strategy)
- **ID:** `dante_pitch`
- **Type:** `chat_negotiation`
- **Icon:** 💼 briefcase / megaphone
- **Theme:** Persuasion vs. Authenticity
- **Description:** Craft persuasive sales narratives and navigate client objections with Dante.
- **Entry Node:** `dante_sim_reluctant`
- **Completion Flag:** `dante_simulation_complete`
- **Phase:** 1 (Introduction)
- **Task:** "A potential client thinks they know what they want. They're wrong. Navigate to the real need."

---

#### 20. Isaiah - Supply Chain Map (Resource Allocation)
- **ID:** `isaiah_logistics`
- **Type:** `dashboard_triage`
- **Icon:** 🧭 compass / truck
- **Theme:** Efficiency vs. Equity
- **Description:** Route critical resources to communities in need with Isaiah's coalition-building approach.
- **Entry Node:** `isaiah_sim_donor`
- **Completion Flag:** `isaiah_simulation_complete`
- **Phase:** 1 (Introduction)
- **Task:** "Food shipment delayed. Reroute via Sector 9."

---

## Simulation Types

### The 16 Interface Types

| Type | Count | Description | Characters |
|------|-------|-------------|------------|
| `terminal_coding` | 0 | Code editing terminal interface | (planned) |
| `system_architecture` | 1 | System calibration and debugging | Maya |
| `creative_direction` | 1 | Slide deck / presentation builder | Quinn |
| `data_analysis` | 0 | Data manipulation interface | (use data_audit) |
| `prompt_engineering` | 0 | LLM prompt refinement | (planned) |
| `code_refactor` | 0 | Code refactoring interface | (planned) |
| `chat_negotiation` | 3 | Influence-based conversation | Alex, Nadia, Dante |
| `dashboard_triage` | 5 | Priority sorting and management | Marcus, Grace, Silas, Isaiah, Kai |
| `visual_canvas` | 3 | Drawing/design canvas | Kai, Rohan, Asha |
| `audio_studio` | 1 | Sound design and harmonic editor | Lira |
| `news_feed` | 0 | (deprecated - use chat_negotiation) | |
| `data_ticker` | 0 | (deprecated - use market_visualizer) | |
| `data_audit` | 1 | Dataset anomaly detection | Zara |
| `secure_terminal` | 0 | (planned) | |
| `botany_grid` | 1 | Nutrient optimization / cellular automata | Tess |
| `architect_3d` | 1 | Structural analysis | Jordan |
| `market_visualizer` | 1 | Economic ticker and resource tracking | Elena |
| `conversation_tree` | 1 | Logic flow mapping | Devon |
| `conductor_interface` | 1 | Station operations control | Samuel |
| `historical_timeline` | 1 | Timeline reconciliation | Yaquin |
| `blueprint_editor` | 0 | (variant of visual_canvas) | |

**Most Common Types:**
1. `dashboard_triage` (5 simulations)
2. `visual_canvas` (3 simulations)
3. `chat_negotiation` (3 simulations)

---

## Phase System

### 3-Phase Progression

| Phase | Name | Trust Requirement | Description | Time Limit | Threshold |
|-------|------|-------------------|-------------|------------|-----------|
| **1** | Introduction | 0-2 | Accessible early, teaches basics | None | 75% |
| **2** | Application | 5+ | Complex scenarios, real pressure | 120s | 85% |
| **3** | Mastery | 8+ | Expert challenges, high stakes | 60s | 95% |

**Current Status:** All 20 simulations are Phase 1 (Introduction)

**Phase Unlocks:**
- Phase 1: Always available (or trust >= 2)
- Phase 2: Requires Phase 1 completion
- Phase 3: Requires Phase 2 completion + trust >= 8

### Difficulty Tiers

| Tier | Player Experience | Complexity |
|------|-------------------|------------|
| `introduction` | First exposure, learning mechanics | Low |
| `application` | Applying learned concepts | Medium |
| `mastery` | Expert-level challenges | High |

---

## Display Modes

### Fullscreen vs. Inline

| Mode | Description | Use Case |
|------|-------------|----------|
| **fullscreen** | Replaces entire dialogue card | Legacy "God Mode", immersive experiences |
| **inline** | Widget below dialogue text | "Handshake Lite", contextual tools |

**Default:** `fullscreen`

**Inline Height:** Configurable via `inlineHeight` (default: `h-48`)

---

## AI Tool Parallels

### Real-World Tool Mappings

| Simulation | Character | AI Tool | Skill Demonstrated |
|------------|-----------|---------|-------------------|
| The Automation | Marcus | Cursor AI | Agentic coding, AI-assisted development |
| The Logistics Puzzle | Alex | Logistics AI | Supply chain optimization |
| The Search | Elena | Perplexity | Research, information synthesis |
| The Canvas | Asha | Stable Diffusion | AI art creation, prompt engineering |
| The Studio | Lira | Suno/Udio | AI music generation |
| The Analysis | Zara | Excel/Data Tools | Data analysis, anomaly detection |
| The Listener's Log | Samuel | HubSpot (metaphor) | CRM, relationship management |

**Total AI Tool References:** 7 distinct tools

---

## Simulation Configuration

### SimulationConfig Interface

```typescript
interface SimulationConfig {
  type: SimulationType
  title: string
  taskDescription: string
  initialContext: {
    label?: string
    content?: string
    displayStyle?: 'code' | 'text' | 'image_placeholder' | 'visual'
    [key: string]: unknown // Flexible data for specific engines
  }
  successFeedback: string
  mode?: 'fullscreen' | 'inline'
  inlineHeight?: string
  phase?: SimulationPhase
  difficulty?: SimulationDifficulty
  variantId?: string
  unlockRequirements?: SimulationUnlockRequirements
  timeLimit?: number
  successThreshold?: number
}
```

### Unlock Requirements

```typescript
interface SimulationUnlockRequirements {
  previousPhaseCompleted?: string // e.g., 'maya_servo_debugger_phase1'
  trustMin?: number
  patternRequirement?: {
    pattern: PatternType
    minLevel: number
  }
  requiredKnowledge?: string[]
  requiredFlags?: string[]
}
```

---

## Usage Examples

### Accessing Simulation Metadata

```typescript
import { SIMULATION_REGISTRY, getSimulationById, getSimulationByCharacter } from '@/lib/simulation-registry'

// Get specific simulation
const mayaSim = getSimulationById('maya_servo_debugger')
console.log(mayaSim.title) // "The Pitch"
console.log(mayaSim.theme) // "Authenticity vs. Expectation"

// Get character's simulation
const graceSim = getSimulationByCharacter('grace')
console.log(graceSim.icon) // "heart"
```

### Filtering by Completion

```typescript
import { getSimulationsForCharacters } from '@/lib/simulation-registry'

const coreCharacters = ['maya', 'grace', 'tess', 'alex']
const coreSims = getSimulationsForCharacters(coreCharacters)
// Returns: 4 simulations
```

### Rendering Simulation in Dialogue Node

```typescript
import { DialogueNode, SimulationConfig } from '@/lib/dialogue-graph'

const mayaNode: DialogueNode = {
  nodeId: 'maya_robotics_passion',
  speaker: 'maya',
  content: [{ text: "Let me show you the prototype...", variation_id: 'v1' }],
  choices: [],
  simulation: {
    type: 'system_architecture',
    title: 'Servo Control Debugger',
    taskDescription: 'The loading arm is oscillating wildly...',
    initialContext: {
      label: 'Servo Motor A7 Status',
      content: 'ERROR: Oscillation detected. Stability: 42%.',
      displayStyle: 'code'
    },
    successFeedback: '✓ STABILIZED: Signal variance < 5%.',
    phase: 1,
    difficulty: 'introduction',
    variantId: 'maya_servo_debugger_phase1'
  }
}
```

---

## Cross-References

- **Characters:** See `04-characters.md` for character roster and trust mechanics
- **Patterns:** See `03-patterns.md` for pattern unlock requirements
- **Skills:** See `02-skills.md` for WEF 2030 skills demonstrated in simulations
- **Dialogue System:** See `05-dialogue-system.md` for node structure and state changes

---

## Design Notes

### Philosophy: "Golden Prompts" vs. Traditional Mini-Games

**Traditional Mini-Games:**
- Pattern matching (Bejeweled)
- Timing challenges (rhythm games)
- Resource management (tower defense)
- Puzzle solving (Tetris)

**Lux Story Simulations ("Workflow Simulations"):**
- Mirrors real professional workflows
- Teaches transferable skills (prompt engineering, data analysis, triage)
- Embedded in narrative (characters teach you their tools)
- AI tool parallels (Cursor AI, Perplexity, Stable Diffusion)

**Design Goal:** Make simulations feel like "using a professional tool" rather than "playing a game."

### Synesthesia Engine (Lira, Nadia)

**Unique Feature:** Some simulations map abstract concepts to sensory parameters.

**Lira's Audio Studio:**
- **Target:** "Dementia/Confusion"
- **Parameters:** Tempo (30 = slow), Mood (25 = dark), Texture (60 = dense/confused)
- **Player Action:** Adjust audio sliders to match emotional state

**Nadia's Headline Editor:**
- **Target:** "De-escalation"
- **Parameters:** Tempo (20 = low urgency), Mood (40 = neutral), Texture (80 = high nuance)
- **Player Action:** Rewrite headline to hit emotional target

### Phase 2/3 Expansion Strategy

**Current State:** All 20 simulations at Phase 1

**Phase 2 Design:**
- Time pressure (120s limit)
- Multiple objectives (solve 3 problems simultaneously)
- Ambiguous scenarios (no clear "right" answer)
- Higher success threshold (85% vs. 75%)

**Phase 3 Design:**
- Extreme time pressure (60s limit)
- Ethical dilemmas (competing values)
- Expert-level complexity
- 95% success threshold

**Implementation Priority:**
1. Maya (servo debugger) - Reference standard
2. Marcus (triage) - Time pressure natural fit
3. Lira (audio studio) - Synesthesia mastery

### Completion Flag Types

| Type | Scope | Example |
|------|-------|---------|
| `global` | Cross-session persistent | `maya_simulation_complete` |
| `knowledge` | Character-specific knowledge | `grace_simulation_complete` |
| `tag` | Dialogue node tagging | `simulation_complete` |

**Global flags (most common):** Used for 14/20 simulations
**Knowledge flags:** Used for 4/20 simulations (Grace, Tess, Alex, Lira)
**Tag flags:** Used for 3/20 simulations (Kai, Rohan, Silas)

### AI Tool Integration Potential

**Current:** 7 simulations reference real AI tools
**Future Opportunities:**
- **ChatGPT integration** - Live prompt engineering in Devon's conversation tree
- **Midjourney API** - Real AI art generation in Asha's canvas
- **Suno/Udio API** - Actual AI music in Lira's studio
- **Perplexity API** - Live research in Elena's search
- **GitHub Copilot** - Real code suggestions in Marcus's automation

**Trade-off:** Authenticity vs. unpredictability (LLM outputs may break narrative)

### Simulation Density by Character Tier

| Tier | Characters | Simulations | Avg per Character |
|------|-----------|-------------|-------------------|
| Hub | 1 (Samuel) | 1 | 1.0 |
| Core | 8 | 8 | 1.0 |
| Secondary | 7 | 7 | 1.0 |
| Extended | 4 | 4 | 1.0 |

**Perfect 1:1 Ratio:** Every character has exactly 1 simulation

---

**Generated on:** January 13, 2026
**Verification:** Run `npm run verify-data-dict` to check for drift from source
