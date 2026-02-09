# Knowledge Flags - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/content/*-dialogue-graph.ts` (24 files), `/lib/character-state.ts`
**Status:** Manual data mining

## Overview

Knowledge flags are the narrative memory system that tracks what players have learned, experienced, and unlocked throughout their journey. Every choice, conversation, and completed simulation sets flags that gate future content.

**Key Stats:**
- **Knowledge flags:** 345 unique (character-specific memory)
- **Global flags:** 163 unique (cross-character progress)
- **Total flags:** 508 unique identifiers
- **Characters with flags:** 20/20
- **Average flags per character:** 17 knowledge + 8 global
- **Flag categories:** 8 (arcs, simulations, choices, vulnerabilities, combos, meta, mystery, career)

---

## Flag Types (2 Categories)

### Knowledge Flags (Character-Specific)

**Purpose:** Track what a character knows about the player and what the player knows about them.

**Scope:** Per-character (stored in `CharacterState.knowledgeFlags`)

**Example:**
```typescript
characterState.knowledgeFlags.has('maya_vulnerability_revealed')
// → true if player has seen Maya's vulnerability arc
// → false if not yet unlocked
```

### Global Flags (Cross-Character)

**Purpose:** Track player progress across the entire game, independent of specific characters.

**Scope:** Game-wide (stored in `GameState.globalFlags`)

**Example:**
```typescript
gameState.globalFlags.has('golden_prompt_voice')
// → true if player achieved "Golden Prompt" mastery on voice simulation
// → Affects nervous system regulation (polyvagal bonus)
```

---

## Flag Categories (8 Types)

### 1. Arc Completion Flags (20 total)

Tracks when a character's narrative arc is complete.

**Pattern:** `{characterId}_arc_complete`

| Flag | Character | Trigger | Effect |
|------|-----------|---------|--------|
| `maya_arc_complete` | Maya | Final arc node reached | Unlocks finale content |
| `samuel_farewell_complete` | Samuel | Station keeper farewell | Ending variant |
| `devon_arc_complete` | Devon | Systems thinking mastery | Career insights |
| `marcus_arc_complete` | Marcus | Healthcare journey complete | Healer combo unlock |
| `rohan_arc_complete` | Rohan | Deep tech arc resolved | Advanced simulations |
| `tess_arc_complete` | Tess | Education founder arc | Educator combo unlock |
| `kai_arc_complete` | Kai | Safety specialist arc | Safety design mastery |
| `elena_arc_complete` | Elena | Information science arc | Knowledge curator combo |
| `alex_arc_complete` | Alex | Supply chain arc | Logistics mastery |
| `grace_arc_complete` | Grace | Healthcare operations | Care coordinator combo |
| `jordan_arc_complete` | Jordan | Career navigator arc | Pathfinder combo unlock |
| `silas_arc_complete` | Silas | Manufacturing arc | Precision maker combo |
| `asha_arc_complete` | Asha | Conflict resolution arc | Mediator mastery |
| `lira_arc_complete` | Lira | Sound design arc | Creative technologist combo |
| `zara_arc_complete` | Zara | Data ethics arc | Data storyteller combo |
| `yaquin_arc_complete` | Yaquin | EdTech creator arc | Curriculum designer combo |
| `quinn_arc_complete` | Quinn | Finance specialist arc | Operations optimizer combo |
| `dante_arc_complete` | Dante | Sales strategist arc | Authentic selling mastery |
| `nadia_arc_complete` | Nadia | AI strategist arc | Whistleblower mastery |
| `isaiah_arc_complete` | Isaiah | Nonprofit leader arc | Community builder mastery |

### 2. Simulation Completion Flags (60+ total)

Tracks completed workflow simulations (3 phases × 20 characters).

**Patterns:**
- `{character}_simulation_complete` - Phase 1 complete
- `{character}_simulation_phase1_complete` - Phase 1 complete (explicit)
- `{character}_sim2_complete` - Phase 2 complete
- `{character}_sim3_complete` - Phase 3 complete
- `{character}_all_sims_complete` - All phases complete

**Examples:**

| Flag | Character | Simulation Type | Phase |
|------|-----------|-----------------|-------|
| `maya_simulation_complete` | Maya | Prompt Engineering | 1 |
| `maya_demo_triumph` | Maya | Prompt Engineering | 3 (Mastery) |
| `rohan_simulation_phase1_complete` | Rohan | Deep Search | 1 |
| `devon_outage_mastery` | Devon | System Architecture | 3 |
| `grace_vigil_triumph` | Grace | Dashboard Triage | 3 |
| `marcus_crisis_ready` | Marcus | Dashboard Triage | 3 |
| `tess_mastery_achieved` | Tess | Curriculum Design | 3 |
| `alex_logistics_solved` | Alex | Supply Chain | 2 |
| `lira_symphony_complete` | Lira | Audio Studio | 3 |
| `zara_algorithm_purged` | Zara | Data Audit | 3 |
| `yaquin_launch_triumph` | Yaquin | EdTech Platform | 3 |
| `dante_authentic_selling_mastery` | Dante | Sales Negotiation | 3 |
| `nadia_whistleblower_mastery` | Nadia | AI Ethics | 3 |
| `isaiah_mastery_achieved` | Isaiah | Community Organizing | 3 |

### 3. Vulnerability Flags (20 total)

Tracks when characters have revealed their backstory/trauma (Trust ≥6 gate).

**Pattern:** `{characterId}_vulnerability_revealed`

| Flag | Character | Vulnerability Reveal |
|------|-----------|---------------------|
| `maya_vulnerability_revealed` | Maya | Family pressure about startup |
| `marcus_vulnerability_revealed` | Marcus | Father's stroke, switching to pre-med |
| `devon_vulnerability_revealed` | Devon | Autism diagnosis, optimization coping |
| `rohan_vulnerability_revealed` | Rohan | Sister's lab accident death |
| `tess_vulnerability_revealed` | Tess | Burnout from teaching, imposter syndrome |
| `kai_vulnerability_revealed` | Kai | Workplace accident trauma |
| `elena_vulnerability_revealed` | Elena | Loss of mentor, archival mission |
| `alex_vulnerability_revealed` | Alex | Supply chain failure guilt |
| `grace_vulnerability_revealed` | Grace | Patient death during shift |
| `jordan_vulnerability_revealed` | Jordan | Career counselor who lost their own path |
| `silas_vulnerability_revealed` | Silas | Manufacturing plant closure |
| `asha_vulnerability_revealed` | Asha | Failed mediation, lives lost |
| `lira_vulnerability_revealed` | Lira | Sound as escape from family conflict |
| `zara_vulnerability_revealed` | Zara | Algorithm bias harm |
| `yaquin_vulnerability_revealed` | Yaquin | EdTech platform used to surveil students |
| `quinn_vulnerability_revealed` | Quinn | Finance pressure, ethics compromise |
| `dante_vulnerability_revealed` | Dante | Mother's illness, sales to pay medical bills |
| `nadia_vulnerability_revealed` | Nadia | AI whistleblower consequences |
| `isaiah_vulnerability_revealed` | Isaiah | Nonprofit funding crisis, staff layoffs |

### 4. Choice Memory Flags (100+ total)

Tracks specific player choices for consequence echoes.

**Patterns:**
- `chose_{option}` - Player selected a branch
- `asked_about_{topic}` - Player inquired about something
- `challenged_{topic}` - Player questioned something

**Examples:**

| Flag | Context | Consequence |
|------|---------|-------------|
| `chose_robotics` | Maya's career choice | Robotics path dialogue |
| `chose_analytical_approach` | Problem-solving style | Analytical pattern reinforcement |
| `chose_patience_approach` | Conversation pacing | Patience pattern reinforcement |
| `chose_credential_first` | Education priority | Academic focus dialogue |
| `chose_quality_first` | Product priority | Quality-driven path |
| `chose_birmingham` | Location commitment | Local opportunities focus |
| `chose_internal` | Problem-solving style | Introspection vs. external action |
| `chose_hybrid` | Career blend | Multi-disciplinary path |
| `asked_about_studies` | Curiosity about education | Academic discussion unlocked |
| `asked_dante_past` | Dante's background | Personal history revealed |
| `challenged_expectations` | Questioning assumptions | Deeper dialogue unlocked |

### 5. Golden Prompt Flags (8 total)

Tracks "perfect" simulation completions (95%+ accuracy, mastery phase).

**Pattern:** `golden_prompt_{tool}`

| Flag | Simulation Type | Effect |
|------|-----------------|--------|
| `golden_prompt_voice` | Voice AI (ElevenLabs) | +30 nervous system regulation |
| `golden_prompt_midjourney` | Image generation | +30 nervous system regulation |
| `golden_prompt_workflow` | Workflow automation | +30 nervous system regulation |
| `golden_prompt_cursor` | Agentic coding | +30 nervous system regulation |
| `golden_prompt_deep_search` | Deep research | +30 nervous system regulation |
| `golden_prompt_logistics` | Supply chain | +30 nervous system regulation |
| `golden_prompt_safety_design` | Safety systems | +30 nervous system regulation |
| `golden_prompt_notebooklm` | Knowledge synthesis | +30 nervous system regulation |

**Special Effect:** Golden Prompts act as permanent polyvagal nervous system regulators (see `01-emotions.md` - Trust System integration).

### 6. Skill Combo Flags (30+ total)

Tracks when player unlocks WEF 2030 skill combinations.

**Pattern:** `combo_{skill_combo}_achieved`

**Healthcare Combos:**
| Flag | Skills Combined | Career Path |
|------|----------------|-------------|
| `combo_healers_path_achieved` | empathy + biology + clinical | Physician |
| `combo_medical_detective_achieved` | analysis + biology + research | Medical researcher |
| `combo_health_educator_achieved` | teaching + health + communication | Health educator |
| `combo_care_coordinator_achieved` | organization + empathy + systems | Care coordinator |

**Technology Combos:**
| Flag | Skills Combined | Career Path |
|------|----------------|-------------|
| `combo_deep_coder_achieved` | coding + systems + problem-solving | Software engineer |
| `combo_ux_engineer_achieved` | design + coding + empathy | UX engineer |
| `combo_data_storyteller_achieved` | data + visualization + communication | Data analyst |
| `combo_creative_technologist_achieved` | creativity + coding + design | Creative technologist |

**Systems Thinking Combos:**
| Flag | Skills Combined | Career Path |
|------|----------------|-------------|
| `combo_systems_thinker_achieved` | analysis + optimization + complexity | Systems architect |
| `combo_operations_optimizer_achieved` | efficiency + systems + metrics | Operations manager |
| `combo_safety_designer_achieved` | safety + systems + risk assessment | Safety engineer |
| `combo_logistics_master_achieved` | supply chain + optimization + coordination | Supply chain analyst |

**Education Combos:**
| Flag | Skills Combined | Career Path |
|------|----------------|-------------|
| `combo_curriculum_designer_achieved` | pedagogy + design + learning science | Curriculum designer |
| `combo_patient_teacher_achieved` | patience + empathy + communication | Educator |
| `combo_knowledge_translator_achieved` | synthesis + communication + accessibility | Educational content creator |

**Additional Combos:**
- `combo_architect_vision_achieved` - Vision + design + space planning
- `combo_knowledge_curator_achieved` - Information science + organization + access
- `combo_research_navigator_achieved` - Research + synthesis + discovery
- `combo_ux_researcher_achieved` - User research + empathy + analysis
- `combo_path_finder_achieved` - Career guidance + empathy + strategic thinking
- `combo_precision_maker_achieved` - Manufacturing + precision + quality
- `combo_sustainable_builder_achieved` - Sustainability + building + long-term thinking
- `combo_robotics_engineer_achieved` - Robotics + engineering + automation
- `combo_security_guardian_achieved` - Cybersecurity + vigilance + systems
- `combo_reliability_builder_achieved` - Reliability engineering + testing + quality

### 7. Meta-Narrative Flags (20+ total)

Tracks major game progression milestones.

| Flag | Meaning | Effect |
|------|---------|--------|
| `met_{character}` | First encounter with character | Character unlocked (20 flags) |
| `orbs_introduced` | Player learned about pattern system | Orb UI visible |
| `platform_seven_reached` | Arrived at Platform 7 | Late-game content |
| `platform_seven_visited` | Explored Platform 7 | Mystery progression |
| `quiet_hour_entered` | Special narrative moment | Contemplative dialogue |
| `quiet_hour_witnessed` | Station's quiet hour | Atmospheric reveal |
| `station_heartbeat_heard` | Station's living presence | Mystical understanding |
| `deep_mystery_begun` | Central mystery initiated | Investigation unlocked |
| `knows_larger_pattern` | Meta-awareness achieved | Philosophical dialogue |
| `shadow_broker_exposed` | Hidden actor revealed | Plot twist |
| `letter_mystery_solved` | Epistolary puzzle complete | Backstory unlocked |
| `platform_records_found` | Historical discovery | Lore accessible |
| `has_new_messages` | System notification | UI indicator |

### 8. Career Mention Flags (20 total)

Tracks when characters have discussed career paths with player.

**Pattern:** `{character}_mentioned_career`

| Flag | Character | Career Domain |
|------|-----------|---------------|
| `maya_mentioned_career` | Maya | Tech/Innovation |
| `marcus_mentioned_career` | Marcus | Healthcare |
| `devon_mentioned_career` | Devon | Engineering/Systems |
| `tess_mentioned_career` | Tess | Education |
| `rohan_mentioned_career` | Rohan | Deep Tech/Research |
| `kai_mentioned_career` | Kai | Safety/Risk Management |
| `elena_mentioned_career` | Elena | Information Science |
| `jordan_mentioned_career` | Jordan | Career Counseling |
| `alex_mentioned_career` | Alex | Supply Chain/Logistics |
| `grace_mentioned_career` | Grace | Healthcare Operations |
| `silas_mentioned_career` | Silas | Manufacturing |
| (10 more) | ... | Various |

---

## Flag Lifecycle

### Setting Flags

**Via onEnter:**
```typescript
{
  nodeId: 'maya_vulnerability_arc',
  onEnter: [{
    characterId: 'maya',
    addKnowledgeFlags: ['maya_vulnerability_revealed']
  }]
}
```

**Via choice consequence:**
```typescript
{
  choiceId: 'maya_robotics_path',
  text: "Focus on robotics.",
  consequence: {
    characterId: 'maya',
    addKnowledgeFlags: ['maya_chose_robotics', 'chose_robotics']
  }
}
```

**Via global flags:**
```typescript
{
  choiceId: 'complete_simulation',
  consequence: {
    addGlobalFlags: ['golden_prompt_voice']
  }
}
```

### Checking Flags

**Knowledge flag condition:**
```typescript
requiredState: {
  hasKnowledgeFlags: ['maya_vulnerability_revealed']
}
```

**Lacking knowledge flag:**
```typescript
requiredState: {
  lacksKnowledgeFlags: ['maya_arc_complete']  // Before arc ends
}
```

**Global flag condition:**
```typescript
requiredState: {
  hasGlobalFlags: ['golden_prompt_voice', 'orbs_introduced']
}
```

### Removing Flags (Rare)

```typescript
onEnter: [{
  characterId: 'maya',
  removeKnowledgeFlags: ['maya_temporary_state']
}]
```

**Use Case:** Temporary states that should be cleared (uncommon pattern).

---

## Flag Naming Conventions

### Knowledge Flags

| Pattern | Example | Meaning |
|---------|---------|---------|
| `{char}_vulnerability_revealed` | `maya_vulnerability_revealed` | Vulnerability arc seen |
| `{char}_arc_complete` | `devon_arc_complete` | Character arc finished |
| `{char}_simulation_complete` | `rohan_simulation_complete` | Phase 1 simulation done |
| `{char}_sim{N}_complete` | `alex_sim2_complete` | Phase N simulation done |
| `{char}_{event}_shared` | `asha_hardest_case_shared` | Character shared memory |
| `{char}_mastery_achieved` | `grace_mastery_achieved` | Phase 3 simulation perfected |
| `{char}_chose_{option}` | `kai_chose_safety` | Character-specific choice |
| `chose_{option}` | `chose_analytical_approach` | Global choice record |
| `asked_about_{topic}` | `asked_dante_past` | Topic inquiry |

### Global Flags

| Pattern | Example | Meaning |
|---------|---------|---------|
| `golden_prompt_{tool}` | `golden_prompt_voice` | Perfect simulation completion |
| `combo_{skill_combo}_achieved` | `combo_healers_path_achieved` | Skill combo unlocked |
| `met_{character}` | `met_maya` | First encounter |
| `{event}_begun` | `deep_mystery_begun` | Event initiated |
| `{event}_complete` | `samuel_farewell_complete` | Event concluded |
| `{location}_reached` | `platform_seven_reached` | Location discovered |
| `{location}_visited` | `platform_seven_visited` | Location explored |
| `{item}_found` | `platform_records_found` | Discovery made |

---

## Cross-Character Flag Dependencies

### Trade Chains (6 documented)

**Trade chains** are sequences where knowledge gained from one character unlocks content with another.

#### Example: Maya → Samuel Chain

```typescript
// Step 1: Learn about Maya's startup
// maya-dialogue-graph.ts
onEnter: [{
  characterId: 'maya',
  addKnowledgeFlags: ['maya_startup_revealed']
}]

// Step 2: Mention Maya to Samuel
// samuel-dialogue-graph.ts
{
  nodeId: 'samuel_maya_connection',
  requiredState: {
    hasKnowledgeFlags: ['maya_startup_revealed']  // Player knows about startup
  },
  content: [{
    text: "Ah, Maya told you about her project? She's brilliant. Reckless, but brilliant."
  }]
}
```

#### Example: Vulnerability Cascade

```typescript
// Rohan's vulnerability unlocks empathy dialogue with Marcus
{
  nodeId: 'marcus_recognizes_grief',
  requiredState: {
    hasGlobalFlags: ['rohan_vulnerability_revealed']  // Knows about Rohan's sister
  },
  content: [{
    text: "You've seen loss before, haven't you? I can tell."
  }]
}
```

### Mystery Progression

**Central Mystery Flags:**
1. `deep_mystery_begun` - Investigation starts
2. `platform_records_found` - Historical clue
3. `knows_larger_pattern` - Meta-awareness
4. `shadow_broker_exposed` - Antagonist revealed
5. `letter_mystery_solved` - Resolution

**Flow:**
```
deep_mystery_begun
  ↓
platform_records_found (requires 3+ characters at Trust ≥6)
  ↓
knows_larger_pattern (requires 5+ vulnerability arcs seen)
  ↓
shadow_broker_exposed (requires all simulations complete)
  ↓
letter_mystery_solved (finale)
```

---

## Validation Rules

### Flag Existence Check

```typescript
import { GameState, CharacterState } from '@/lib/character-state'

function hasKnowledgeFlag(
  characterId: string,
  flag: string,
  gameState: GameState
): boolean {
  const charState = gameState.characters.get(characterId)
  return charState?.knowledgeFlags.has(flag) ?? false
}

function hasGlobalFlag(
  flag: string,
  gameState: GameState
): boolean {
  return gameState.globalFlags.has(flag)
}
```

### Multi-Flag Conditions

```typescript
// ALL flags must be present
requiredState: {
  hasGlobalFlags: [
    'maya_arc_complete',
    'devon_arc_complete',
    'marcus_arc_complete'
  ]
}

// Any LACKING flag blocks access
requiredState: {
  lacksKnowledgeFlags: [
    'maya_vulnerability_revealed'  // Blocks if present
  ]
}
```

---

## Usage Examples

### Example 1: Arc Completion Gate

```typescript
// Late-game node requiring 3 completed arcs
{
  nodeId: 'platform_seven_revelation',
  requiredState: {
    hasGlobalFlags: [
      'maya_arc_complete',
      'devon_arc_complete',
      'marcus_arc_complete'
    ]
  },
  content: [{
    text: "The station reveals its true purpose..."
  }]
}
```

### Example 2: Simulation Progress Tracking

```typescript
// Phase 2 requires Phase 1 completion
{
  nodeId: 'maya_sim_phase2',
  simulation: {
    type: 'prompt_engineering',
    phase: 2,
    unlockRequirements: {
      previousPhaseCompleted: 'maya_simulation_phase1_complete',
      trustMin: 5
    }
  }
}
```

### Example 3: Choice Echo

```typescript
// Consequence echoes later in dialogue
{
  nodeId: 'maya_robotics_callback',
  requiredState: {
    hasKnowledgeFlags: ['maya_chose_robotics']
  },
  content: [{
    text: "Remember when you suggested I focus on robotics? I've been thinking about that..."
  }]
}
```

### Example 4: Golden Prompt Unlock

```typescript
// Perfect simulation completion
{
  nodeId: 'maya_prompt_mastery',
  onEnter: [{
    addGlobalFlags: ['golden_prompt_voice']  // Permanent nervous system buff
  }],
  content: [{
    text: "That was... perfect. You understand this at a deep level."
  }]
}
```

---

## Cross-References

- **Dialogue System:** See `05-dialogue-system.md` for how flags gate nodes
- **Trust System:** See `08-trust-system.md` for trust-gated content
- **Emotions:** See `01-emotions.md` for nervous system regulation via Golden Prompts
- **Characters:** See `04-characters.md` for character-specific flags
- **Simulations:** See `06-simulations.md` for simulation completion flags

---

## Design Notes

### Philosophy: Memory as Narrative State

**Traditional Games:**
```
Progress = Checkpoints + Save Files
```

**Lux Story:**
```
Progress = Knowledge Flags (what you've learned)
```

**Benefits:**
- **Granular branching:** 508 flags vs. 10 checkpoints
- **Organic gating:** "You haven't learned this yet" vs. "Level 5 required"
- **Consequence memory:** Choices echo across conversations
- **Player-driven:** Discovery unlocks content, not arbitrary gates

### Flag Explosion: The Double-Edged Sword

**Original Estimate:** 210+ flags

**Actual Count:** 508 flags (345 knowledge + 163 global)

**Why So Many?**
1. **20 characters** × 17 flags avg = 340 baseline
2. **Choice memories** for consequence echoes
3. **Simulation phases** (3 per character = 60)
4. **Skill combos** (30 unique career paths)
5. **Mystery progression** (20+ narrative milestones)

**Trade-Offs:**
- ✅ **Rich branching:** Every choice can be remembered and echoed
- ✅ **Personalization:** Dialogue feels custom to your journey
- ⚠️ **Complexity:** Hard to debug "Why isn't this node appearing?"
- ⚠️ **Authorship burden:** Each flag requires dialogue variations

**Mitigation:**
- Naming conventions (predictable patterns)
- Deadlock recovery choice (does **not** reveal gated content; injects a single safe escape hatch when no selectable choices exist)
- Validation tools (required-state guarding + narrative simulation + flag existence checks in dialogue graphs)

### Golden Prompts: The Nervous System Link

**Design Philosophy:**
- Perfect simulation completion = **mastery**
- Mastery = confidence = reduced anxiety
- Reduced anxiety = nervous system regulation

**Implementation:**
```typescript
// lib/emotions.ts - determineNervousSystemState()
if (flags.has('golden_prompt_voice') ||
    flags.has('golden_prompt_midjourney') ||
    flags.has('golden_prompt_workflow')) {
  flagBuffer = 30  // Massive stabilizer
}
```

**Result:** Golden Prompts act as **permanent anxiety buffers** (+30 points).

**Example:**
```
Player anxiety: 70
Trust buffer: 12
Skill buffer: 20
Golden Prompt buffer: 30 (has golden_prompt_voice)
Effective anxiety: 70 - 12 - 20 - 30 = 8 (Safe & Social state)
```

### Skill Combos: WEF 2030 Integration

**Design Goal:** Map in-game choices to real-world career paths.

**Mechanic:**
- Player demonstrates skills through choices (empathy, analysis, creativity)
- When specific skill combinations reached → combo flag set
- Combo unlocks career insights and Birmingham opportunities

**Example:**
```
Player shows: empathy (5) + biology (4) + clinical thinking (5)
→ Triggers: combo_healers_path_achieved
→ Unlocks: "Physician" career insights with UAB Medical opportunities
```

**Count:** 30+ combos covering healthcare, tech, education, systems, creative fields

### Trade Chains: Inter-Character Knowledge

**Design Problem:**
- Characters feel isolated—no social network
- Player learns things but can't discuss with others

**Solution:**
- Knowledge flags are **transferable** between characters
- Learning about Maya's startup → can mention to Samuel
- Seeing Rohan's grief → Marcus recognizes shared loss

**Example Chain:**
```
1. Maya reveals family conflict (maya_vulnerability_revealed)
2. Player talks to Samuel about it
3. Samuel: "Family pressure is hard. I see it in many students."
4. New dialogue branch unlocked (empathy connection)
```

**Count:** 6 documented trade chains, but any knowledge flag can theoretically be referenced by other characters.

### Future Considerations

**Flag Consolidation:**
- Currently: Separate flags for `{char}_sim2_complete` and `{char}_sim3_complete`
- Future: Single `{char}_max_sim_phase` number (reduces flag count)
- Trade-off: Simplicity vs. explicit tracking

**Dynamic Flag Generation:**
- Currently: All flags pre-defined in dialogue graphs
- Future: LLM generates flags based on player actions
- Trade-off: Infinite branching vs. narrative control

**Flag Analytics:**
- Currently: No visibility into which flags are most common
- Future: Dashboard showing flag distribution across players
- Use case: Identify dead branches (flags that never get set)

**Flag Expiration:**
- Currently: Flags are permanent once set
- Future: Time-based flags ("maya_angry" expires after 2 sessions)
- Use case: Temporary emotional states

**Cross-Game Flags:**
- Currently: Flags confined to single save file
- Future: Account-level flags that persist across playthroughs
- Use case: New Game+ content, meta-progression

---

**Generated on:** January 13, 2026
**Verification:** Run `grep -r "addKnowledgeFlags\|addGlobalFlags" content/` to audit flag additions
