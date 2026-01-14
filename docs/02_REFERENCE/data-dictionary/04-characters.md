# Characters - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/graph-registry.ts`, `/lib/character-tiers.ts`, `/lib/character-relationships.ts`, `CLAUDE.md`
**Status:** Auto-generated

## Overview

The character system includes 20 NPCs (non-player characters) across 4 narrative tiers, plus 4 explorable locations. Each character represents a distinct career path and has unique personality, relationships, and growth arcs.

**Key Stats:**
- Total NPCs: 20 characters
- Locations: 4 explorable areas
- Character tiers: 4 (Hub, Core, Primary, Secondary, Extended)
- Animal types: 18 unique
- Relationship types: 8 (ally, rival, mentor, protege, former, parallel, stranger, complicated)
- Total dialogue nodes: 1158 (across all characters)

---

## Complete Character Roster

### Tier 1: Core Characters (Hub + Primary Story)

**Investment:** 70% of development effort, deepest content
**Targets:** 80 nodes, 15 voice variations, 10 pattern reflections

#### Samuel - The Station Keeper (Hub)
- **Animal:** Owl
- **Role:** Station keeper, wise mentor
- **Career Path:** Service / Station Operations
- **Tier:** 1 (Hub)
- **Dialogue Nodes:** 205 (Hub ✅)
- **Trust Range:** 0-10
- **Theme:** The Power of Listening
- **Simulation:** The Listener's Log (conductor_interface)
- **AI Tool:** HubSpot (metaphor)
- **Personality:** Observant, patient, knows more than he reveals
- **Quote:** "Every journey begins with a single step. But most forget that every step is also a journey."

---

#### Maya - Tech Innovator
- **Animal:** Cat
- **Role:** Robotics engineer, torn between family pressure and passion
- **Career Path:** Technology / Engineering
- **Tier:** 1 (Core)
- **Dialogue Nodes:** 82 (Deep ✅)
- **Trust Range:** 0-10
- **Theme:** Authenticity vs. Expectation
- **Simulation:** The Pitch / Servo Control Debugger (system_architecture)
- **Family Pressure:** Parents want her to pursue pre-med, not robotics
- **Growth Arc:** Learning to honor both heritage and authentic self
- **Revisit Graph:** Yes (maya_revisit)
- **Quote:** "My parents sacrificed everything for me to become a doctor. But what if I could save lives a different way?"

---

#### Devon - Systems Thinker
- **Animal:** Deer
- **Role:** Engineering student, systems architecture
- **Career Path:** Engineering / Systems Thinking
- **Tier:** 1 (Core)
- **Dialogue Nodes:** 84 (Deep ✅)
- **Trust Range:** 0-10
- **Theme:** Logic vs. Emotion
- **Simulation:** The System / Cognitive Web (conversation_tree)
- **Specialty:** Mapping complex systems, understanding interconnections
- **Growth Arc:** Balancing analytical precision with emotional intelligence
- **Revisit Graph:** Yes (devon_revisit)
- **Quote:** "Everything is a system. The trick is figuring out which variables actually matter."

---

### Tier 2: Primary Characters (Deep Career Paths)

**Investment:** 20% of development effort, rich content
**Targets:** 50 nodes, 10 voice variations, 6 pattern reflections

#### Marcus - Healthcare Tech
- **Animal:** Bear
- **Role:** Medical technology specialist
- **Career Path:** Healthcare / Medical Technology
- **Tier:** 2 (Primary)
- **Dialogue Nodes:** 76 (Deep ✅)
- **Trust Range:** 0-10
- **Theme:** Human Touch vs. Efficiency
- **Simulation:** The Automation / Casualty Triage Board (dashboard_triage)
- **AI Tool:** Cursor AI
- **Specialty:** AI-assisted healthcare systems
- **Quote:** "The machines help us save lives. But they'll never replace the hand you hold when someone's scared."

---

#### Tess - Education Founder
- **Animal:** Fox
- **Role:** Former teacher, education entrepreneur
- **Career Path:** Education / EdTech
- **Tier:** 2 (Primary)
- **Dialogue Nodes:** 50 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Purpose Through Sacrifice
- **Simulation:** The Classroom / Hydroponic Grid (botany_grid)
- **Background:** Left traditional teaching to create something bigger
- **Quote:** "I couldn't save every kid in that classroom. But maybe I can build something that helps teachers save more."

---

#### Rohan - Deep Tech
- **Animal:** Raven
- **Role:** Research scientist, introspective genius
- **Career Path:** Technology / Deep Tech Research
- **Tier:** 2 (Primary)
- **Dialogue Nodes:** 58 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Truth in the Machine
- **Simulation:** The Ghost / Constellation Navigator (visual_canvas)
- **Personality:** Quiet, precise, sees patterns others miss
- **Quote:** "The code doesn't lie. People lie. Systems lie. But if you listen to the machine, it tells the truth."

---

#### Kai - Safety Specialist
- **Animal:** (No animal specified)
- **Role:** Safety systems and protocols
- **Career Path:** Safety / Security Engineering
- **Tier:** 2 (Primary)
- **Dialogue Nodes:** 51 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Preparation Meets Crisis
- **Simulation:** The Safety Drill / Safety System Blueprint (visual_canvas/blueprint_editor)
- **Specialty:** Fail-safe design, emergency response
- **Quote:** "Hope for the best. Prepare for the worst. Know the difference."

---

#### Quinn - Finance Specialist (LinkedIn 2026)
- **Animal:** Hedgehog
- **Role:** Portfolio analyst, investment strategy
- **Career Path:** Finance / Investment
- **Tier:** 2 (Primary)
- **Dialogue Nodes:** 45 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Risk vs. Reward
- **Simulation:** Portfolio Analysis (creative_direction)
- **LinkedIn Skills:** #12, #20, #21
- **Quote:** "Numbers don't have emotions. But the people behind them do. That's where the real risk is."

---

#### Nadia - AI Strategist (LinkedIn 2026)
- **Animal:** Barn Owl
- **Role:** AI strategy and communication
- **Career Path:** Technology / AI Strategy
- **Tier:** 2 (Primary)
- **Dialogue Nodes:** 48 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Truth vs. Impact
- **Simulation:** Headline Editor (chat_negotiation)
- **LinkedIn:** Fastest growing skill (#2)
- **Specialty:** Strategic framing, ethical journalism
- **Quote:** "AI doesn't create bias. It reveals it. The question is what we do about it."

---

### Tier 3: Secondary Characters (Supporting Paths)

**Investment:** 10% of development effort, standard content
**Targets:** 35 nodes, 6 voice variations, 4 pattern reflections

#### Grace - Healthcare Operations
- **Animal:** (No animal specified)
- **Role:** Home health specialist
- **Career Path:** Healthcare / Operations
- **Tier:** 3 (Secondary)
- **Dialogue Nodes:** 38 (Core ⚠️ -2 from target)
- **Trust Range:** 0-10
- **Theme:** Care Beyond Protocol
- **Simulation:** Patient Comfort / Medical Diagnostics (dashboard_triage)
- **Revisit Graph:** Yes (grace_revisit)
- **Quote:** "Protocols save lives. But sometimes you have to know when to break them."

---

#### Elena - Information Science / Archivist
- **Animal:** (No animal specified)
- **Role:** Data archivist, pattern analyst
- **Career Path:** Information Science / Archives
- **Tier:** 3 (Secondary)
- **Dialogue Nodes:** 83 (Deep ✅)
- **Trust Range:** 0-10
- **Theme:** Signal vs. Noise
- **Simulation:** The Search / Market Flow Visualizer (market_visualizer/ticker)
- **AI Tool:** Perplexity
- **Quote:** "The archive remembers what people forget. Sometimes that's dangerous."

---

#### Alex - Supply Chain & Logistics
- **Animal:** Rat
- **Role:** Logistics specialist, systems coordinator
- **Career Path:** Supply Chain / Operations
- **Tier:** 3 (Secondary)
- **Dialogue Nodes:** 49 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Order From Chaos
- **Simulation:** The Logistics Puzzle / Diplomacy Table (chat_negotiation)
- **AI Tool:** Logistics AI
- **Quote:** "Chaos is just a system you don't understand yet."

---

#### Yaquin - EdTech Creator
- **Animal:** Rabbit
- **Role:** EdTech entrepreneur, product designer
- **Career Path:** Education / EdTech
- **Tier:** 3 (Secondary)
- **Dialogue Nodes:** 43 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Vision vs. Reality
- **Simulation:** The Review / Historical Archive (historical_timeline)
- **Revisit Graph:** Yes (yaquin_revisit)
- **Quote:** "Build for the students, not the administrators. But good luck getting funding that way."

---

#### Dante - Sales Strategist (LinkedIn 2026)
- **Animal:** Peacock
- **Role:** Sales strategy, persuasive narratives
- **Career Path:** Sales / Marketing
- **Tier:** 3 (Secondary)
- **Dialogue Nodes:** 50 (Deep ✅)
- **Trust Range:** 0-10
- **Theme:** Persuasion vs. Authenticity
- **Simulation:** Pitch Deck Builder (chat_negotiation)
- **LinkedIn Skills:** #8, #10, #13, #16
- **Quote:** "Selling isn't lying. It's showing people what they didn't know they needed."

---

#### Isaiah - Nonprofit Leader (LinkedIn 2026)
- **Animal:** Elephant
- **Role:** Coalition builder, resource allocation
- **Career Path:** Nonprofit / Community Development
- **Tier:** 3 (Secondary)
- **Dialogue Nodes:** 42 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Efficiency vs. Equity
- **Simulation:** Supply Chain Map (dashboard_triage)
- **LinkedIn Skills:** #14
- **Quote:** "Resources are finite. Need is infinite. That's not a problem to solve—it's a reality to navigate."

---

### Tier 4: Extended Cast (Specialized/Niche Paths)

**Investment:** Supporting cast, minimal investment
**Targets:** 25 nodes, 6 voice variations, 2 pattern reflections

#### Silas - Advanced Manufacturing
- **Animal:** (No animal specified)
- **Role:** Manufacturing systems, resource management
- **Career Path:** Manufacturing / Engineering
- **Tier:** 4 (Extended)
- **Dialogue Nodes:** 40 (Core ✅)
- **Trust Range:** 0-10
- **Theme:** Scarcity and Innovation
- **Simulation:** The Drought / Soil Composition Analysis (dashboard_triage)
- **Quote:** "Sustainability isn't about doing more with less. It's about doing better with what you have."

---

#### Asha - Conflict Resolution / Mediator
- **Animal:** (No animal specified)
- **Role:** Mediator, conflict resolution specialist
- **Career Path:** Mediation / Conflict Resolution
- **Tier:** 4 (Extended)
- **Dialogue Nodes:** 51 (Standard ✅)
- **Trust Range:** 0-10
- **Theme:** Human Touch in AI Art
- **Simulation:** The Canvas / Mural Design Canvas (visual_canvas/art canvas)
- **AI Tool:** Stable Diffusion
- **Quote:** "Art doesn't resolve conflict. But it makes space for people to see each other differently."

---

#### Lira - Communications / Sound Design
- **Animal:** (No animal specified)
- **Role:** Sound designer, communications specialist
- **Career Path:** Communications / Audio
- **Tier:** 4 (Extended)
- **Dialogue Nodes:** 69 (Deep ✅)
- **Trust Range:** 0-10
- **Theme:** Memory in Sound
- **Simulation:** The Studio / Harmonic Visualizer (audio_studio/synesthesia engine)
- **AI Tool:** Suno/Udio
- **Quote:** "Sound is memory made tangible. Close your eyes and you're 10 years old again."

---

#### Zara - Data Ethics / Artist
- **Animal:** (No animal specified)
- **Role:** Data ethicist, visual artist
- **Career Path:** Data Ethics / Art
- **Tier:** 4 (Extended)
- **Dialogue Nodes:** 77 (Deep ✅)
- **Trust Range:** 0-10
- **Theme:** Truth in Data
- **Simulation:** The Analysis / Dataset Auditor (data_audit)
- **AI Tool:** Excel/Data Tools
- **Quote:** "Data shows what happened. Art shows what it meant."

---

#### Jordan - Career Navigator
- **Animal:** (No animal specified)
- **Role:** Career counselor, UX negotiator
- **Career Path:** Career Development / UX
- **Tier:** 4 (Extended)
- **Dialogue Nodes:** 39 (Core ✅)
- **Trust Range:** 0-10
- **Theme:** Compromise vs. Conviction
- **Simulation:** Launch Crisis / Structural Load Analysis (architect_3d)
- **Quote:** "There's no perfect path. Just the one you choose, and what you make of it."

---

## Locations (Non-Character Areas)

### Station Entry
- **Type:** Location
- **Description:** The arrival point where players first materialize
- **Graph:** `station_entry_graph`
- **Function:** Tutorial space, introduces the station concept

### Grand Hall
- **Type:** Location
- **Description:** Central hub with multiple character platforms visible
- **Graph:** `grand_hall_graph`
- **Function:** Navigation hub, social space

### Market
- **Type:** Location
- **Description:** Trading and exchange area
- **Graph:** `market_graph`
- **Function:** Resource dynamics, economic systems

### Deep Station
- **Type:** Location
- **Description:** Hidden depths of the station
- **Graph:** `deep_station_graph`
- **Function:** Advanced content, mystery space

---

## Character Tier System

### Tier Targets and Philosophy

| Tier | Description | Dialogue Target | Voice Variations | Pattern Reflections | Investment |
|------|-------------|-----------------|------------------|---------------------|------------|
| **1** | Hub + Core story drivers | 80 nodes | 15 variations | 10 reflections | 70% effort |
| **2** | Deep career path representation | 50 nodes | 10 variations | 6 reflections | 20% effort |
| **3** | Supporting career paths | 35 nodes | 6 variations | 4 reflections | 10% effort |
| **4** | Specialized/niche paths | 25 nodes | 6 variations | 2 reflections | Minimal |

**Based on AAA 70/20/10 principle** for content investment

### Tier Assignments

| Tier | Characters | Count |
|------|-----------|-------|
| **1** | Samuel (hub), Maya, Devon | 3 |
| **2** | Marcus, Tess, Rohan, Kai, Quinn, Nadia | 6 |
| **3** | Grace, Elena, Alex, Yaquin, Dante, Isaiah | 6 |
| **4** | Silas, Asha, Lira, Zara, Jordan | 5 |

**Total:** 20 characters

---

## Animal Types

### Complete Animal Roster (18 unique)

| Animal | Character | Symbolism |
|--------|-----------|-----------|
| Owl | Samuel | Wisdom, observation |
| Cat | Maya | Independence, curiosity |
| Bear | Marcus | Strength, protection |
| Deer | Devon | Grace, gentleness |
| Fox | Tess | Cleverness, adaptability |
| Raven | Rohan | Intelligence, mystery |
| Rabbit | Yaquin | Energy, quick thinking |
| Rat | Alex | Resourcefulness, survival |
| Hedgehog | Quinn | Defense, precision |
| Barn Owl | Nadia | Silent wisdom, hunting |
| Peacock | Dante | Display, confidence |
| Elephant | Isaiah | Memory, community |

**Note:** 8 characters do not have assigned animals (Kai, Grace, Elena, Silas, Asha, Lira, Zara, Jordan)

**Art Style:** Zootopia-style anthropomorphic animals, 32×32 pixel art

---

## Relationship Web

### Relationship Types (8 total)

| Type | Description | Dynamics |
|------|-------------|----------|
| **ally** | Mutual support and friendship | Collaborative, positive |
| **rival** | Competitive tension (not hostile) | Challenging, growth-oriented |
| **mentor** | One guides the other | Teaching, nurturing |
| **protege** | Being guided by another | Learning, aspirational |
| **former** | Past relationship (history) | Complicated, nostalgic |
| **parallel** | Similar situations, potential connection | Empathetic, understanding |
| **stranger** | No relationship yet | Neutral, potential |
| **complicated** | Mixed feelings, unresolved | Conflicted, tension |

### Relationship Dynamics

**Asymmetric Relationships:** Character A's view of B may differ from B's view of A

**Dynamic Evolution:** Relationships change based on player actions (trigger flags)

**Reveal Conditions:** Relationships unlock progressively based on trust and flags

**Opinion Layers:**
- **Public Opinion:** What they say openly (low trust)
- **Private Opinion:** What they really think (high trust)
- **Memories:** Specific shared moments they reference

### Key Relationship Examples

**Maya → Devon:**
- Type: parallel (initially) → ally (after collaboration)
- Intensity: 5 → 7
- Theme: Former UAB classmates, both facing family/career pressure
- Public: "We had some classes together."
- Private: "He made it look so easy. Must be nice."
- Trigger: `devon_maya_collaboration_started`

**Maya → Samuel:**
- Type: protege
- Intensity: 6
- Theme: Seeks guidance, mentorship
- Public: "He runs this place. Always watching."
- Private: "He looks at me like he already knows what I'm going to figure out."

**Maya → Marcus:**
- Type: stranger → ally
- Intensity: 2 → 5
- Theme: Discovering biomedical engineering path
- Trigger: `maya_considers_biomedical`
- Evolution: Realizes she can combine helping + building

---

## Dialogue Node Distribution

### Current Status (Total: 1158 nodes)

| Character | Nodes | Target | Status | Delta |
|-----------|-------|--------|--------|-------|
| Samuel | 205 | 80 | Hub ✅ | +125 |
| Devon | 84 | 80 | Deep ✅ | +4 |
| Elena | 83 | 35 | Deep ✅ | +48 |
| Maya | 82 | 80 | Deep ✅ | +2 |
| Zara | 77 | 25 | Deep ✅ | +52 |
| Marcus | 76 | 50 | Deep ✅ | +26 |
| Lira | 69 | 25 | Deep ✅ | +44 |
| Rohan | 58 | 50 | Standard ✅ | +8 |
| Kai | 51 | 50 | Standard ✅ | +1 |
| Asha | 51 | 25 | Standard ✅ | +26 |
| Tess | 50 | 50 | Standard ✅ | 0 |
| Dante | 50 | 35 | Deep ✅ | +15 |
| Alex | 49 | 35 | Standard ✅ | +14 |
| Nadia | 48 | 50 | Standard ✅ | -2 |
| Quinn | 45 | 50 | Standard ✅ | -5 |
| Yaquin | 43 | 35 | Standard ✅ | +8 |
| Isaiah | 42 | 35 | Standard ✅ | +7 |
| Silas | 40 | 25 | Core ✅ | +15 |
| Jordan | 39 | 25 | Core ✅ | +14 |
| Grace | 38 | 35 | Core ⚠️ | -2 |

**Tier Performance:**
- Tier 1 (Core): All meet or exceed targets ✅
- Tier 2 (Primary): 4/6 meet targets (Nadia, Quinn slightly below)
- Tier 3 (Secondary): 5/6 meet targets (Grace 2 nodes short)
- Tier 4 (Extended): All exceed targets ✅

---

## Usage Examples

### Accessing Character Data

```typescript
import { CHARACTER_IDS, isValidCharacterId, getGraphForCharacter } from '@/lib/graph-registry'

// Validate character ID
if (isValidCharacterId('maya')) {
  const graph = getGraphForCharacter('maya', gameState)
  // Returns: mayaDialogueGraph or mayaRevisitGraph based on arc completion
}

// Get all character IDs
console.log(CHARACTER_IDS)
// Returns: ['samuel', 'maya', 'devon', ... 'station_entry', 'grand_hall', ...]
```

### Checking Tier Requirements

```typescript
import { getCharacterTier, getCharacterTierConfig, meetsDialogueTarget } from '@/lib/character-tiers'

const tier = getCharacterTier('maya')
// Returns: 1

const config = getCharacterTierConfig('maya')
// Returns: { tier: 1, dialogueTarget: 80, voiceVariationTarget: 15, ... }

const meets = meetsDialogueTarget('maya', 82)
// Returns: true (82 >= 80)
```

### Accessing Relationships

```typescript
import { CHARACTER_RELATIONSHIP_WEB } from '@/lib/character-relationships'

// Find Maya's relationships
const mayaRelationships = CHARACTER_RELATIONSHIP_WEB.filter(
  edge => edge.fromCharacterId === 'maya'
)

// Get Maya → Devon relationship
const mayaDevon = mayaRelationships.find(edge => edge.toCharacterId === 'devon')
console.log(mayaDevon.type) // 'parallel'
console.log(mayaDevon.opinions.publicOpinion) // "We had some classes together..."
```

---

## Cross-References

- **Simulations:** See `06-simulations.md` - Every character has 1 unique simulation
- **Patterns:** See `03-patterns.md` - Characters reflect player patterns in dialogue
- **Skills:** See `02-skills.md` - Character hints (30 skills associated with characters)
- **Careers:** See `11-careers.md` - Career paths mapped to characters

---

## Design Notes

### Character Design Philosophy

**Diversity of Representation:**
- Geographic: Birmingham-rooted, but universal themes
- Career Paths: 15+ distinct fields represented
- Backgrounds: Family pressure, career transitions, identity conflicts
- Ages: Implicit range from students to established professionals

**Authenticity over Stereotypes:**
- No "token" representations
- Complex motivations (Maya's family pressure is specific, not generic)
- Career paths grounded in real Birmingham opportunities
- Flaws and growth (no perfect characters)

### Relationship Web Design

**Living Community:**
- Characters exist in relation to each other, not just the player
- Relationships can evolve based on player actions (ripple effects)
- Characters naturally mention each other in dialogue
- Makes the station feel like a real place with history

**Asymmetric Dynamics:**
- Maya sees Devon as "having it easy"
- Devon might see Maya differently
- Reflects real relationships (not all mutual)

**Reveal Progression:**
- Early trust: Public opinions (surface-level)
- High trust: Private thoughts (vulnerability)
- Flag-gated: Deep memories and history

### Tier System Strategy

**70/20/10 Investment Principle:**
- Focus 70% effort on Tier 1 (Samuel, Maya, Devon)
- 20% on Tier 2 (6 characters with deep career representation)
- 10% on Tier 3 (6 supporting characters)
- Minimal on Tier 4 (5 specialized/niche paths)

**Why This Works:**
- Prevents "inch-deep, mile-wide" problem
- Ensures flagship characters are excellent
- Still provides breadth across 20 career paths
- Sustainable for small team

### Animal Symbolism

**Zootopia-Style Anthropomorphism:**
- Animals chosen for symbolic resonance (Owl = wisdom, Fox = cleverness)
- 32×32 pixel art for technical/nostalgia aesthetic
- Not all characters have animals (intentional - not forced)

**Visual Hierarchy:**
- Hub character (Samuel) = Owl (universal wisdom symbol)
- Core characters have distinct, memorable animals
- Extended cast may or may not have animals (flexibility)

### Future Expansion Opportunities

**Potential New Characters:**
- Arts (visual artist, musician beyond Lira)
- Trades (electrician, plumber, HVAC)
- Government (policy, public administration)
- Military/Defense (veteran transition paths)
- Hospitality/Service (chef, event planning)

**Depth vs. Breadth Trade-off:**
- Current: 20 characters, 1158 nodes (avg 58 nodes/char)
- Alternative A: 10 characters, 1158 nodes (avg 116 nodes/char) - deeper but narrower
- Alternative B: 30 characters, 1158 nodes (avg 39 nodes/char) - broader but shallower
- **Current approach balances both**

---

**Generated on:** January 13, 2026
**Verification:** Run `npm run verify-data-dict` to check for drift from source
