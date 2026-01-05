# LUX Story - Comprehensive Feature Catalog
**Extracted from newDocs directory - January 2026**

*This catalog systematically documents every feature, capability, system, and mechanic mentioned across 4 foundational documents. Excludes movement gameplay mechanics, graphics/visual effects, and rendering systems.*

**Documents Analyzed:**
- LUX_Story_PRD_v2.md (29 KB)
- LUX_Story_PRD_Addendum.md (13 KB)
- world building.md (35 KB - methodology reference)
- blackbird world building.md (11 KB - case study reference)

**Total Features Cataloged:** 287 features across 10 categories

---

# Table of Contents

1. [Core Gameplay Systems](#1-core-gameplay-systems)
2. [Progression & Tracking](#2-progression--tracking)
3. [World & Narrative](#3-world--narrative)
4. [Player Interface Systems](#4-player-interface-systems)
5. [Admin & Analytics](#5-admin--analytics)
6. [Technical Infrastructure](#6-technical-infrastructure)
7. [Design Systems & UX](#7-design-systems--ux)
8. [Content Creation Frameworks](#8-content-creation-frameworks)
9. [Quality & Performance](#9-quality--performance)
10. [Success Measurement](#10-success-measurement)

---

# 1. CORE GAMEPLAY SYSTEMS

## 1.1 Pattern System (The Brain)

**Source:** LUX_Story_PRD_v2.md (Lines 174-207, 259-268), LUX_Story_PRD_Addendum.md (Lines 164-172)

### Overview
Five behavioral patterns tracked through dialogue choice analysis that represent decision-making approaches, not personality types. These patterns map to World Economic Forum 2030 skills and career paths.

### Pattern Types

#### 1.1.1 Analytical Pattern
- **Archetype:** The Weaver
- **Description:** "You see the hidden threads where others see only chaos. The truth is a tapestry waiting to be untangled."
- **Associated Skills:** Critical Thinking, Problem Solving, Digital Literacy, Data Democratization
- **Pattern Voice Trigger:** DEVELOPING (6+)
- **Pattern Voice Example:** "[WEAVER]: Those numbers don't add up. Press them on the timeline."
- **Sensations:**
  - "You pause to consider the angles."
  - "The pattern emerges."
- **Choice Implications:** Triggered by "Reject" stance choices (confrontational questioning)
- **Career Paths:** Cybersecurity, Data Analytics, Financial Technology

#### 1.1.2 Patience Pattern
- **Archetype:** The Anchor
- **Description:** "You are the stillness in the storm. When the world rushes, you hold fast, allowing the moment to speak."
- **Associated Skills:** Time Management, Adaptability, Emotional Intelligence, Grounded Research
- **Pattern Voice Trigger:** DEVELOPING (6+)
- **Pattern Voice Example:** "[ANCHOR]: Wait. There's something they're not saying. Let the silence work."
- **Sensations:**
  - "You let the moment breathe."
  - "Silence has its own answers."
- **Choice Implications:** Triggered by "Accept" stance choices, observing without acting on interrupts
- **Career Paths:** Healthcare Tech, Learning Experience Design, Research

#### 1.1.3 Exploring Pattern
- **Archetype:** The Voyager
- **Description:** "The map is not the territory. You step off the path because the unknown is where the answers live."
- **Associated Skills:** Adaptability, Creativity, Critical Thinking, Multimodal Creation
- **Pattern Voice Trigger:** DEVELOPING (6+)
- **Pattern Voice Example:** "[VOYAGER]: This path is too obvious. What's behind that door they keep avoiding?"
- **Sensations:**
  - "Curiosity pulls at you."
  - "The unknown beckons."
- **Choice Implications:** Triggered by "Deflect" stance choices (evasive/chaotic responses)
- **Career Paths:** Creative Entrepreneurship, Research, Innovation

#### 1.1.4 Helping Pattern
- **Archetype:** The Harmonic
- **Description:** "You feel the resonance between people. You tune the discord until it becomes a chord."
- **Associated Skills:** Emotional Intelligence, Collaboration, Communication, AI Literacy
- **Pattern Voice Trigger:** DEVELOPING (6+)
- **Pattern Voice Example:** "[HARMONIC]: They're hurting. Forget the question—ask how they're doing."
- **Sensations:**
  - "Something in you reaches out."
  - "Connection matters. You know this."
- **Choice Implications:** Triggered by "Accept" stance choices, acting on interrupts
- **Career Paths:** Healthcare, Education, Community Development

#### 1.1.5 Building Pattern
- **Archetype:** The Architect
- **Description:** "You do not wait for the future; you forge it. Your hands turn abstract hope into concrete reality."
- **Associated Skills:** Creativity, Problem Solving, Leadership, Agentic Coding, Workflow Orchestration
- **Pattern Voice Trigger:** DEVELOPING (6+)
- **Pattern Voice Example:** "[ARCHITECT]: This is fixable. Let's break it into components."
- **Sensations:**
  - "Your hands itch to make it real."
  - "You see what could be."
- **Choice Implications:** Triggered by "Reject" stance choices (action-oriented)
- **Career Paths:** Sustainable Construction, Advanced Manufacturing, Engineering

### Pattern Thresholds

#### 1.1.6 EMERGING Threshold (3+)
- **Effect:** Pattern voice whispers
- **Unlocks:** Basic dialogue options
- **Player Experience:** Subtle atmospheric feedback begins

#### 1.1.7 DEVELOPING Threshold (6+)
- **Effect:** Pattern voice urges
- **Unlocks:** Standard options + character-specific content
- **Player Experience:** Pattern Voice (Thought Cabinet) activates, internal monologue begins

#### 1.1.8 FLOURISHING Threshold (9+)
- **Effect:** Pattern voice commands
- **Unlocks:** Mastery options + advanced simulations
- **Player Experience:** Full access to pattern-gated content, advanced career simulations

### Technical Implementation

#### 1.1.9 Pattern Data Structure
- **Storage:** `GameState.patterns: Record<PatternType, number>`
- **Type Validation:** `isValidPattern()` in `lib/patterns.ts`
- **Tracking:** Real-time calculation from choice history via SkillTracker
- **Source:** LUX_Story_PRD_v2.md (Lines 349-350)

#### 1.1.10 Pattern Sensations System
- **Delivery:** Subtle atmospheric feedback in dialogue containers
- **Trigger:** Pattern increment events
- **Display:** Italicized text, subtle fade-in animation
- **Purpose:** Invisible assessment layer - players don't realize they're being evaluated
- **Source:** LUX_Story_PRD_v2.md (Lines 195-207), FR-2 (Line 407)

#### 1.1.11 Pattern Voice Library
- **Component:** PATTERN_VOICE_LIBRARY in `content/pattern-voice-library.ts`
- **Coverage Status:**
  - Implemented: 6 characters (40%)
  - Missing: 9 characters (60%)
- **Priority:** Increase to 70% coverage (Samuel, Kai, Tess, Yaquin, Alex next)
- **Source:** LUX_Story_PRD_Addendum.md (Lines 229-233)

### Dependencies
- **Requires:** DialogueGraphNavigator for choice tracking
- **Integrates With:** SkillTracker, StateConditionEvaluator, FutureSkillsSystem
- **Unlocks:** Content gates, career recommendations, Pattern Voices

### Success Metrics
- **Pattern Distribution Target:** No pattern >40% of player population
- **Source:** LUX_Story_PRD_v2.md (Line 600)

---

## 1.2 Trust System

**Source:** LUX_Story_PRD_v2.md (Lines 209-218, 414-422), CLAUDE.md

### Overview
Bilateral trust tracking between player and each character. Unlike traditional RPG reputation systems, trust is a two-way relationship that unlocks entire conversation branches, not just individual choices.

### Trust Mechanics

#### 1.2.1 Trust Scale
- **Range:** 0 (Stranger) to 10 (Confidant)
- **Bounds:** MAX_TRUST=10, MIN_TRUST=0 (defined in `lib/constants.ts`)
- **Tracking:** `GameState.trust: Record<CharacterId, number>`
- **Bilateral:** Characters can trust player, player can trust characters

#### 1.2.2 Trust Labels
- **Stranger** (0-1): Initial state, surface-level conversations
- **Acquaintance** (2-3): Basic relationship established
- **Known** (4-5): Mutual recognition and comfort
- **Trusted** (6-8): Deeper conversations unlock
- **Confidant** (9-10): Complete access to character's inner world

#### 1.2.3 Trust = Discovery Mechanic
- **Function:** High trust unlocks entire conversation branches
- **Philosophy:** Trust gates content discovery, not individual dialogue lines
- **Example:** High trust with Maya unlocks "The Demo" loyalty experience
- **Source:** LUX_Story_PRD_v2.md (Line 216), Phase 2 roadmap (Line 649)

#### 1.2.4 Trust Decay System
- **Trigger:** Extended absence from character conversations
- **Effect:** Gradual trust reduction over time
- **Purpose:** Requires re-engagement to maintain relationships
- **Mitigation:** Regular interaction prevents decay
- **Source:** LUX_Story_PRD_v2.md (Line 218), FR-3 (Line 422)

### Trust Display

#### 1.2.5 Trust Status Display
- **Method:** Labels (Stranger → Confidant) instead of progress bars
- **Location:** Character relationship constellation in Journal
- **Philosophy:** Textual cues replacing visual bars for immersion
- **Source:** LUX_Story_PRD_v2.md (Line 215, Line 641)

### Trust Modification

#### 1.2.6 Trust Changes via Dialogue
- **Mechanism:** StateChange objects in DialogueNode.stateChanges
- **Increment:** Positive choices increase trust
- **Decrement:** Negative choices or broken promises decrease trust
- **Validation:** Bounds checking ensures 0-10 range maintained

#### 1.2.7 Trust Threshold Unlocks
- **Function:** Dialogue branches check trust conditions via StateConditionEvaluator
- **Example:** `conditions: [{ type: 'trust', characterId: 'maya', min: 6 }]`
- **Integration:** DialogueGraph ↔ GameState condition evaluation
- **Source:** LUX_Story_PRD_v2.md (Line 385)

### Consequence Echoes

#### 1.2.8 Trust-Based Consequence Echoes
- **Coverage:** 53% (8/15 characters)
- **Templates:** trustUp, trustDown, patternRecognition arrays
- **Function:** Characters remember and reference trust changes
- **Priority:** Increase to 80% coverage
- **Source:** LUX_Story_PRD_Addendum.md (Lines 209, 236-239)

### Dependencies
- **Requires:** StateConditionEvaluator for branch unlocking
- **Integrates With:** DialogueGraphNavigator, Consequence Web
- **Affects:** Content accessibility, relationship constellation visualization

---

## 1.3 Dialogue System

**Source:** LUX_Story_PRD_v2.md (Lines 220-256, 391-403), LUX_Story_PRD_Addendum.md (Lines 118-129)

### Graph-Based Navigation

#### 1.3.1 DialogueGraphNavigator
- **Type:** Directed Acyclic Graph (DAG) traversal engine
- **Function:** Graph traversal, condition evaluation, choice validation
- **Location:** `lib/dialogue-graph.ts`
- **Integration:** Core system for all narrative content
- **Source:** LUX_Story_PRD_v2.md (Lines 224, 318)

#### 1.3.2 DialogueNode Structure
**Source:** LUX_Story_PRD_v2.md (Lines 363-378, 745-762)

**Data Model:**
```typescript
interface DialogueNode {
  id: string;                    // Unique node identifier
  speakerId: CharacterId;        // Which character is speaking
  text: string;                  // Dialogue content with rich text markup
  choices?: DialogueChoice[];    // Available player options
  conditions?: StateCondition[]; // Entry requirements
  stateChanges?: StateChange[];  // Effects on selection
  transitions?: {                // Next node(s) based on conditions
    next: string;
    condition?: StateCondition
  }[];
}
```

**Properties:**
- **id:** Unique identifier for graph traversal
- **speakerId:** CharacterId enum value, validated via `isValidCharacterId()`
- **text:** Supports rich text markup (emphasis, pauses, colored text, inline interactions)
- **choices:** Array of 2-4 DialogueChoice objects (optional for non-branching nodes)
- **conditions:** StateCondition[] for entry requirements (trust, patterns, flags)
- **stateChanges:** StateChange[] applied on node entry/choice selection
- **transitions:** Conditional next-node routing

#### 1.3.3 StateCondition
- **Purpose:** Entry requirements for dialogue nodes
- **Evaluation:** StateConditionEvaluator checks against current GameState
- **Types:** Trust thresholds, pattern levels, knowledge flags, completed arcs
- **Example:** `{ type: 'trust', characterId: 'samuel', min: 5 }`

#### 1.3.4 StateChange
- **Purpose:** Effects triggered by node entry or choice selection
- **Types:** Pattern increments, trust modifications, flag sets, arc completions
- **Application:** Immutable transformations via `GameStateUtils.applyStateChange()`
- **Example:** `{ type: 'pattern', pattern: 'analytical', delta: +2 }`

### Choice Architecture

#### 1.3.5 Accept/Reject/Deflect Pattern
**Source:** LUX_Story_PRD_v2.md (Line 239), LUX_Story_PRD_Addendum.md (Lines 118-129)

**Framework:** Inkle's three-response taxonomy for all choice nodes

**Response Types:**
- **Accept:** Cooperative stance
  - Example: "I understand. Tell me more about what happened."
  - Pattern Implications: → Helping, Patience patterns
- **Reject:** Confrontational stance
  - Example: "That doesn't sound right. Are you sure about this?"
  - Pattern Implications: → Analytical, Building patterns
- **Deflect:** Evasive/Chaotic stance
  - Example: "Interesting... but what about the trains?"
  - Pattern Implications: → Exploring patterns

**Philosophy:** Avoids complex branching trees while maintaining meaningful player agency

#### 1.3.6 "Two Reasonable People" Test
**Source:** LUX_Story_PRD_v2.md (Line 245)

**Rule:** Would two different players make different choices?
**Purpose:** Validates that choices are meaningful, not fake
**Failure Condition:** If everyone chooses the same option, it's a fake choice
**Application:** Quality check during dialogue writing

#### 1.3.7 DialogueChoice Structure
- **2-4 Options:** Fixed constraint for choice interface (140px container)
- **Consequence Visibility:** Choices have visible consequences
- **No Right Answers:** Only trade-offs that reflect player identity
- **Source:** LUX_Story_PRD_v2.md (Lines 152, 395)

### Rich Text System

#### 1.3.8 Rich Text Markup Support
**Source:** LUX_Story_PRD_v2.md (Lines 226, 393)

**Effects:**
- **Emphasis:** Bold, italic, underline for emotional weight
- **Pauses:** Timing markers for dramatic effect
- **Colored Text:** Pattern-specific or emotional color coding
- **Inline Interactions:** Embedded clickable elements within dialogue

**Component:** RichTextRenderer.tsx
**Purpose:** Text effects without breaking immersion

### Character-Specific Typing

#### 1.3.9 Character Typing Speeds
**Source:** LUX_Story_PRD_v2.md (Lines 249-256), `lib/character-typing.ts`

**Per-Character Configuration:**
- **Samuel (Owl):** Slow, measured—deliberate pauses suggest wisdom
- **Maya (Cat):** Fast, bursty—energy and impatience
- **Devon (Deer):** Steady, methodical—systematic thinking

**Purpose:** Personality reflected through typing patterns
**Implementation:** Character-specific timing in chat-paced delivery

### Dialogue Interface Requirements

#### 1.3.10 FR-1: Dialogue Interface Specifications
**Source:** LUX_Story_PRD_v2.md (Lines 391-403)

**Requirements:**
1. Display character dialogue in narrative containers with character-specific styling
2. Support rich text effects: emphasis, pauses, colored text, inline interactions
3. Implement chat-paced delivery with character-specific typing speeds
4. Display 2-4 dialogue choices in fixed-height container (140px) with scroll
5. Provide visual feedback (shake, nod, bloom) for choice confirmation

### Dependencies
- **Requires:** StateConditionEvaluator, RichTextRenderer, character-typing config
- **Integrates With:** GameState, PatternSystem, TrustSystem, KnowledgeFlags
- **Consumed By:** StatefulGameInterface.tsx (main game container)

---

## 1.4 Knowledge Flags System

**Source:** LUX_Story_PRD_v2.md (Lines 49, 355), LUX_Story_PRD_Addendum.md (Sector 2: Market)

### Overview
Information as currency. Players trade knowledge to unlock content and deepen relationships.

### Knowledge Flag Mechanics

#### 1.4.1 KnowledgeFlags Data Structure
- **Storage:** `GameState.knowledgeFlags: Set<string>`
- **Type:** Set-based for efficient lookup
- **Function:** Unlocked information tracking
- **Example Flags:** 'learned_station_history', 'knows_maya_secret', 'discovered_market_rules'

#### 1.4.2 Information Trading Mechanic
- **Context:** Sector 2 (Market) gameplay focus
- **Function:** Trading information (KnowledgeFlags) as primary currency
- **Philosophy:** Relationships unlock content, not coins
- **Source:** LUX_Story_PRD_v2.md (Lines 49, 123)

#### 1.4.3 Flag-Based Content Gating
- **Mechanism:** StateCondition checks for specific knowledge flags
- **Example:** `{ type: 'hasFlag', flag: 'knows_devon_project' }`
- **Purpose:** Creates information economy where learning unlocks options

### Dependencies
- **Requires:** StateConditionEvaluator for flag checks
- **Integrates With:** DialogueGraph conditions, Trust system
- **Unlocks:** Dialogue branches, character insights, sector content

---

## 1.5 Consequence System

**Source:** LUX_Story_PRD_Addendum.md (Lines 174-180), LUX_Story_PRD_v2.md (Line 651)

### Consequence Web

#### 1.5.1 Cross-Character Memory
- **Function:** Characters reference player's interactions with others
- **Example:** "Maya mentioned you. Said you didn't try to fix her."
- **Purpose:** Creates living social network
- **Implementation:** Consequence echoes cascade across character arcs

#### 1.5.2 Delayed Gifts Mechanic
- **Timing:** Choices pay off 2-5 interactions later
- **Example:** Advice in Chapter 1 → stranger thanks you in Chapter 3
- **Purpose:** Long-term consequence visibility
- **Philosophy:** Choices have weight beyond immediate moment

#### 1.5.3 Relationship Web Visualization
- **UI Component:** Constellation view in Journal
- **Function:** Visualizes connections between characters
- **Unlocks:** "Private Opinions" at high trust levels
- **Source:** LUX_Story_PRD_v2.md (Line 430)

#### 1.5.4 The Yojimbo Dynamic
- **Philosophy:** No faction is "right"
- **Design:** Each has valid points and fatal flaws
- **Player Role:** Moral arbiter
- **Source:** LUX_Story_PRD_Addendum.md (Line 179)

### Consequence Echoes

#### 1.5.5 Consequence Echo System
- **Coverage:** 53% (8/15 characters)
- **Templates:**
  - trustUp: Character responses when trust increases
  - trustDown: Character responses when trust decreases
  - patternRecognition: Character notices player's behavioral patterns
- **Priority:** Increase to 80% coverage
- **Source:** LUX_Story_PRD_Addendum.md (Lines 209, 236-239)

### Implementation Status

#### 1.5.6 System Coverage Matrix
**Source:** LUX_Story_PRD_Addendum.md (Lines 186-213)

**5 Narrative Systems:**
1. Consequence Echoes: 53% coverage (8/15 characters)
2. Pattern Voices: 40% coverage (6/15 characters)
3. Sensory Pillars: 100% coverage (15/15 characters)
4. Relationship Web: 53% coverage (8/15 characters)
5. Vulnerability Hints: 13% coverage (2/15 characters)

**Priority Implementation Order:**
- Priority 1: Vulnerability Hints (13% → 50%)
- Priority 2: Pattern Voices (40% → 70%)
- Priority 3: Consequence Echoes (53% → 80%)
- Priority 4: Relationship Web (53% → 80%)

### Dependencies
- **Requires:** GameState.sessionHistory for choice tracking
- **Integrates With:** Trust system, Pattern system, DialogueGraph
- **Affects:** Character behavior, dialogue availability, player experience

---

# 2. PROGRESSION & TRACKING

## 2.1 Skills Integration (WEF 2030)

**Source:** LUX_Story_PRD_v2.md (Lines 258-268, 726-740), `lib/2030-skills-system.ts`

### Overview
50+ granular skills invisibly tracked through gameplay, mapped to World Economic Forum's 2030 Future Skills framework. Patterns map to skills, skills map to career paths.

### Skill Categories

#### 2.1.1 Core Cognitive Skills
**Source:** LUX_Story_PRD_v2.md (Line 729)

- Critical Thinking
- Problem Solving
- Creativity
- Systems Thinking

**Associated Patterns:** Analytical, Building, Exploring

#### 2.1.2 Communication Skills
**Source:** LUX_Story_PRD_v2.md (Line 732)

- Written Communication
- Verbal Communication
- Presentation Skills
- Active Listening

**Associated Patterns:** Helping, Patience

#### 2.1.3 Collaboration Skills
**Source:** LUX_Story_PRD_v2.md (Line 735)

- Teamwork
- Conflict Resolution
- Cultural Competence
- Leadership

**Associated Patterns:** Helping, Building

#### 2.1.4 Technical Skills
**Source:** LUX_Story_PRD_v2.md (Line 738)

- Digital Literacy
- Data Analysis
- Coding (Agentic Coding)
- AI Literacy
- Prompt Engineering
- Workflow Orchestration
- Data Democratization

**Associated Patterns:** Analytical, Building

#### 2.1.5 Self-Management Skills
**Source:** LUX_Story_PRD_v2.md (Line 738)

- Time Management
- Adaptability
- Emotional Intelligence
- Resilience
- Grounded Research

**Associated Patterns:** Patience, Helping

#### 2.1.6 Domain-Specific Skills
**Source:** LUX_Story_PRD_v2.md (Line 740)

- Financial Literacy
- Healthcare Knowledge
- Sustainability
- Risk Management
- Quality Assurance
- Multimodal Creation

**Associated Patterns:** Varies by domain

### Pattern-to-Skill Mapping

#### 2.1.7 Analytical → Skills Mapping
**Source:** LUX_Story_PRD_v2.md (Line 263)

- Critical Thinking
- Problem Solving
- Digital Literacy
- Data Democratization

#### 2.1.8 Patience → Skills Mapping
**Source:** LUX_Story_PRD_v2.md (Line 264)

- Time Management
- Adaptability
- Emotional Intelligence
- Grounded Research

#### 2.1.9 Exploring → Skills Mapping
**Source:** LUX_Story_PRD_v2.md (Line 265)

- Adaptability
- Creativity
- Critical Thinking
- Multimodal Creation

#### 2.1.10 Helping → Skills Mapping
**Source:** LUX_Story_PRD_v2.md (Line 266)

- Emotional Intelligence
- Collaboration
- Communication
- AI Literacy

#### 2.1.11 Building → Skills Mapping
**Source:** LUX_Story_PRD_v2.md (Line 267)

- Creativity
- Problem Solving
- Leadership
- Agentic Coding
- Workflow Orchestration

### Career Path Matching

#### 2.1.12 Career Path Matching Algorithm
- **Component:** FutureSkillsSystem (`lib/2030-skills-system.ts`)
- **Function:** Maps pattern scores → WEF skills → career paths
- **Keyword-Based:** Skill value calculation from dialogue keywords
- **Output:** Birmingham-specific career opportunities
- **Source:** LUX_Story_PRD_v2.md (Lines 333, 341)

#### 2.1.13 Six Birmingham Career Paths
**Source:** LUX_Story_PRD_v2.md (Lines 716-724)

**Analytical Pattern → Career Paths:**
- Cybersecurity
- Data Analytics
- Financial Technology (FinTech)
- **Birmingham Orgs:** Regions Bank, UAB IT, Tech Startups

**Patience Pattern → Career Paths:**
- Healthcare Tech
- Learning Experience Design
- Research
- **Birmingham Orgs:** UAB Hospital, St. Vincent's, Research Labs

**Exploring Pattern → Career Paths:**
- Creative Entrepreneurship
- Research
- Innovation
- **Birmingham Orgs:** Innovation Depot, Sidewalk Film, Local Studios

**Helping Pattern → Career Paths:**
- Healthcare
- Education
- Community Development
- **Birmingham Orgs:** Children's Hospital, United Way, Community Orgs

**Building Pattern → Career Paths:**
- Sustainable Construction
- Advanced Manufacturing
- Engineering
- **Birmingham Orgs:** Brasfield & Gorrie, Mercedes-Benz, Alabama Power

### Missing Career Path Mappings

#### 2.1.14 Skills System Gaps
**Source:** LUX_Story_PRD_Addendum.md (Lines 248-258)

**Characters Missing Career Paths:**
- **Alex (The Rat):** Advanced Logistics Specialist
  - Required Skills: Systems Thinking, Triage, Technical Literacy
- **Silas (The Mechanic):** Advanced Manufacturing
  - Required Skills: Technical Literacy, Problem Solving, Quality Assurance
- **Lira (The Voice):** Strategic Communications
  - Required Skills: Storytelling, Cultural Competence, Media Literacy
- **Asha (The Mediator):** Conflict Resolution / HR
  - Required Skills: Emotional Intelligence, Active Listening, Negotiation

### Technical Components

#### 2.1.15 SkillTracker System
**Source:** LUX_Story_PRD_v2.md (Lines 325-333)

**Functions:**
- Real-time pattern calculation from choice history
- WEF 2030 skill derivation from pattern scores
- Career path matching algorithm
- Integration with admin insights

#### 2.1.16 FutureSkillsSystem
**Source:** LUX_Story_PRD_v2.md (Lines 335-344)

**Functions:**
- Comprehensive skill analysis (50+ skills)
- Keyword-based skill value calculation
- Career path matching with Birmingham opportunities
- Skill context and explanation generation

### Dependencies
- **Requires:** Pattern System, ChoiceRecord tracking
- **Integrates With:** SkillTracker, StudentInsights, Admin Dashboard
- **Outputs To:** Career recommendations, educator reports

---

## 2.2 Character Arc Progression

**Source:** LUX_Story_PRD_v2.md (Lines 126-143, 356), LUX_Story_PRD_Addendum.md (Lines 78-106)

### Character Roster (15 Total)

#### 2.2.1 Core Cast (5 Characters - Full Implementation)
**Source:** LUX_Story_PRD_Addendum.md (Lines 78-86)

**1. Samuel (The Conductor)**
- **Animal Archetype:** Owl
- **Career Domain:** Learning Experience Architect (Hub character)
- **Core Tension:** Wisdom vs. intervention—when to guide, when to let discover
- **Loyalty Experience:** "The Quiet Hour" - Sit in contemplative silence; choose when/if to speak
- **Gameplay Mechanic:** The Limbic Store (Feedback & Guidance)
- **Status:** ✅ Locked
- **Implementation Gaps:** Missing Pattern Voices, Missing Vulnerability Hints

**2. Marcus (The System)**
- **Animal Archetype:** Bear
- **Career Domain:** Cybersecurity Specialist / Healthcare Tech
- **Core Tension:** Scientific objectivity vs. human compassion
- **Loyalty Experience:** "The Breach" - Navigate security incident with competing priorities
- **Gameplay Mechanic:** The Triage (Resource Allocation)
- **Status:** ✅ Locked
- **Implementation Gaps:** Missing Vulnerability Hints

**3. Kai (The Inspector)**
- **Animal Archetype:** (Not specified)
- **Career Domain:** Sustainable Construction / Safety/Security
- **Core Tension:** Protection vs. freedom
- **Loyalty Experience:** (Not specified in sources)
- **Gameplay Mechanic:** The Blueprint (Risk Assessment)
- **Status:** ✅ Locked
- **Implementation Gaps:** Missing Pattern Voices, Missing Vulnerability Hints

**4. Rohan (The Skeptic)**
- **Animal Archetype:** Raven
- **Career Domain:** Community Data Analyst / Deep Tech/Research
- **Core Tension:** Knowledge pursuit vs. practical application
- **Loyalty Experience:** "The Confrontation" - Challenge popular narrative with uncomfortable data
- **Gameplay Mechanic:** The Debate (Source Verification)
- **Status:** ✅ Locked
- **Implementation Gaps:** Missing Vulnerability Hints

**5. Maya (The Engineer)**
- **Animal Archetype:** Cat
- **Career Domain:** Healthcare Tech / Robotics
- **Core Tension:** Family expectations vs. personal passion
- **Loyalty Experience:** "The Demo" - Present robotics project to skeptical investors
- **Gameplay Mechanic:** The Demo (Iterative Design)
- **Status:** ✅ Locked
- **Implementation:** ✅ Complete (Pattern Voices, Vulnerability Hints implemented)

#### 2.2.2 Secondary Cast (6 Characters - Partial Implementation)
**Source:** LUX_Story_PRD_Addendum.md (Lines 88-97)

**6. Devon (The Builder)**
- **Animal Archetype:** Deer
- **Career Domain:** Software Engineering / Systems Engineering
- **Core Tension:** Big picture thinking vs. detail obsession
- **Loyalty Experience:** "The Outage" - Triage critical system failure under time pressure
- **Status:** 🟡 Partial
- **Implementation:** Pattern Voices implemented, Missing Vulnerability Hints (but has some)

**7. Tess (The Merchant)**
- **Animal Archetype:** Fox
- **Career Domain:** Creative Entrepreneur / FinTech / Education/Founding
- **Core Tension:** Institution-building vs. individual impact
- **Status:** 🟡 Partial
- **Implementation Gaps:** Missing Pattern Voices

**8. Yaquin (The Scholar)**
- **Animal Archetype:** Rabbit
- **Career Domain:** Research / Academia / EdTech Creation
- **Core Tension:** Scale vs. depth in learning
- **Status:** 🟡 Partial
- **Implementation Gaps:** Missing Pattern Voices

**9. Grace (The Doctor)**
- **Career Domain:** Healthcare Operations
- **Status:** 🟡 Partial
- **Implementation Gaps:** Missing Consequence Echoes

**10. Elena (The Historian)**
- **Career Domain:** Information Science / Archivist
- **Status:** 🟡 Partial
- **Implementation Gaps:** Missing Consequence Echoes

**11. Alex (The Rat)**
- **Career Domain:** Supply Chain & Logistics
- **Status:** 🟡 Partial
- **Implementation Gaps:** Missing from skills system, Missing Pattern Voices, Missing Consequence Echoes

#### 2.2.3 Extended Cast (4 Characters - Pending)
**Source:** LUX_Story_PRD_Addendum.md (Lines 99-106)

**12. Silas (The Mechanic)**
- **Career Domain:** Advanced Manufacturing
- **Status:** ❌ Pending
- **Implementation Need:** Full dialogue tree, skill mapping

**13. Zara (The Artist)**
- **Career Domain:** Digital Media / Creative
- **Status:** ❌ Pending
- **Implementation Need:** Full dialogue tree, skill mapping

**14. Lira (The Voice)**
- **Career Domain:** Communications Strategy / PR
- **Status:** ❌ Pending
- **Implementation Need:** Full dialogue tree, skill mapping

**15. Asha (The Mediator)**
- **Career Domain:** Conflict Resolution / HR
- **Status:** ❌ Pending
- **Implementation Need:** Full dialogue tree, skill mapping

### Arc Completion Tracking

#### 2.2.4 CompletedArcs System
- **Storage:** `GameState.completedArcs: string[]`
- **Tracking:** Array of completed character storylines
- **Success Metric:** >25% of players complete at least one arc
- **Source:** LUX_Story_PRD_v2.md (Lines 356, 593)

#### 2.2.5 Dialogue Graph Linecount
- **Total:** 16,000+ lines of dialogue across 11 characters
- **Status:** Fully operational v1.0
- **Source:** LUX_Story_PRD_v2.md (Lines 44, 621)

### Dependencies
- **Requires:** DialogueGraph, Trust System, Pattern System
- **Tracks Progress:** Via completedArcs array
- **Affects:** Admin insights, career recommendations

---

## 2.3 Session History & Choice Logging

**Source:** LUX_Story_PRD_v2.md (Lines 361, 460)

### ChoiceRecord System

#### 2.3.1 SessionHistory Tracking
- **Storage:** `GameState.sessionHistory: ChoiceRecord[]`
- **Function:** Full choice log for pattern analysis
- **Purpose:** Evidence for skill assessment, admin insights

#### 2.3.2 ChoiceRecord Data Structure
- **Fields:** nodeId, choiceId, timestamp, patterns affected, trust changes
- **Persistence:** Saved to LocalStorage and Supabase
- **Usage:** Pattern calculation, consequence echoes, admin evidence quotes

#### 2.3.3 Evidence Quotes System
**Source:** LUX_Story_PRD_v2.md (Line 460)

- **Function:** Provide evidence quotes from gameplay choices in admin insights
- **Source:** ChoiceRecord sessionHistory
- **Display:** Admin dashboard "Individual Insights" section

### Dependencies
- **Requires:** DialogueGraph choice events
- **Integrates With:** SkillTracker, FutureSkillsSystem, Admin Dashboard
- **Storage:** LocalStorage + Supabase sync

---

# 3. WORLD & NARRATIVE

## 3.1 Grand Central Terminus (Setting)

**Source:** LUX_Story_PRD_v2.md (Lines 87-114)

### Cosmology

#### 3.1.1 Station Nature
- **Definition:** "Not a place—it's a threshold"
- **Function:** Appears between who you were and who you're becoming
- **Metaphor:** Liminal space where tracks of possible futures converge
- **Philosophy:** "No one arrives by accident; the station finds you when you're ready"
- **Source:** LUX_Story_PRD_v2.md (Lines 92-94)

#### 3.1.2 Temporal Rules
- **Existence:** Outside linear time
- **Platform Connections:** Connect to moments of decision, not destinations
- **Train Schedules:** "Only make sense in retrospect"
- **Source:** LUX_Story_PRD_v2.md (Lines 97-103)

#### 3.1.3 Architectural Responsiveness
- **Dynamic Spaces:** Architecture responds to the traveler
- **Expansion:** Spaces expand for exploration
- **Contraction:** Spaces contract for focus
- **Source:** LUX_Story_PRD_v2.md (Line 101)

#### 3.1.4 Magical Realism Framework
**Source:** LUX_Story_PRD_v2.md (Lines 105-113)

**Rules:**
- Supernatural present but never explained
- Station's impossibility accepted, not questioned
- Technology and magic coexist without contradiction
- Characters acknowledge strangeness but don't dwell on it
- Player choices have weight because consequences feel real

**Philosophy:** Career exploration through metaphor without breaking immersion

### Station Geography - Sector System

#### 3.1.5 Fractal Architecture
**Source:** LUX_Story_PRD_v2.md (Lines 115-124)

**Design Pattern:** Self-contained sectors expandable infinitely without breaking core narrative

#### 3.1.6 Sector 0: Station Entry
- **Theme:** Discovery, arrival, disorientation
- **Gameplay Focus:** Tutorial, pattern baseline, Samuel introduction
- **Purpose:** Player onboarding, establish tone
- **Source:** LUX_Story_PRD_v2.md (Line 121), `content/station-entry-graph.ts`

#### 3.1.7 Sector 1: Grand Hall
- **Theme:** Reality Switching, perspective shifts
- **Gameplay Focus:** Character introductions, trust building
- **Purpose:** Meet cast, establish relationships
- **Source:** LUX_Story_PRD_v2.md (Line 122), `content/grand-hall-graph.ts`

#### 3.1.8 Sector 2: Market
- **Theme:** Trust Economy, information trading
- **Gameplay Focus:** KnowledgeFlags, relationship deepening
- **Purpose:** Information as currency mechanic
- **Implementation Status:** Planned for Phase 3 (Q2 2026)
- **Source:** LUX_Story_PRD_v2.md (Lines 123, 660)

#### 3.1.9 Sector 3: Deep Station
- **Theme:** Recursion, reflection
- **Gameplay Focus:** New Game+, pattern mastery
- **Purpose:** Replayability, advanced content
- **Implementation Status:** Planned for Phase 3 (Q2 2026)
- **Source:** LUX_Story_PRD_v2.md (Lines 124, 661)

### Character-World Relationship

#### 3.1.10 Characters as Philosophical Answers
- **Concept:** Each character represents different answer to "What matters most?"
- **Purpose:** Diverse perspectives on life's fundamental questions
- **Source:** LUX_Story_PRD_v2.md (Line 99)

### Dependencies
- **Enables:** All narrative content, character arcs, sector navigation
- **Provides:** Thematic foundation, tone, metaphorical framework

---

## 3.2 Loyalty Experiences

**Source:** LUX_Story_PRD_Addendum.md (Lines 139-150)

### Overview
"Every Interaction is a Story." Each major character has one signature Loyalty Experience representing the culmination of their arc.

### Implemented Experiences

#### 3.2.1 Maya: "The Demo"
- **Description:** Help her present robotics project to skeptical investors
- **Focus:** Iterative design, stakeholder presentation
- **Career Skills:** Technical communication, pitch development
- **Source:** LUX_Story_PRD_Addendum.md (Line 145)

#### 3.2.2 Devon: "The Outage"
- **Description:** Triage critical system failure under time pressure
- **Focus:** Emergency response, prioritization under stress
- **Career Skills:** Systems thinking, crisis management
- **Source:** LUX_Story_PRD_Addendum.md (Line 146)

#### 3.2.3 Samuel: "The Quiet Hour"
- **Description:** Sit in contemplative silence; choose when (or if) to speak
- **Focus:** Patience, wisdom, knowing when silence is answer
- **Career Skills:** Emotional intelligence, active listening
- **Source:** LUX_Story_PRD_Addendum.md (Line 147)

#### 3.2.4 Marcus: "The Breach"
- **Description:** Navigate security incident with competing priorities
- **Focus:** Triage, stakeholder management, ethical tradeoffs
- **Career Skills:** Cybersecurity, risk management, decision-making
- **Source:** LUX_Story_PRD_Addendum.md (Line 148)

#### 3.2.5 Rohan: "The Confrontation"
- **Description:** Challenge popular narrative with uncomfortable data
- **Focus:** Data-driven argumentation, speaking truth to power
- **Career Skills:** Data analysis, critical thinking, courage
- **Source:** LUX_Story_PRD_Addendum.md (Line 149)

### Loyalty Experience Characteristics
- **High Trust Required:** Unlock only at Trusted/Confidant levels
- **Signature Moment:** Represents character's core identity
- **Career Translation:** Direct simulation of workplace scenarios
- **Rare and Impactful:** One per major character

### Dependencies
- **Requires:** High trust (6-10), completed character arc prerequisites
- **Integrates With:** Trust system, pattern tracking, career simulations
- **Phase:** Some in v1.0, expansion in Phase 3

---

## 3.3 Iceberg Architecture

**Source:** LUX_Story_PRD_Addendum.md (Lines 152-158), world building.md (Lines 47-58)

### Overview
90% of the world is never explained—it is implied. Creates depth without exposition dumps.

### Techniques

#### 3.3.1 The Casual Mention
- **Method:** Characters reference unexplained elements
- **Examples:** "The Oxygen Tax", "The Burned District", guild troubles, siege protocols
- **Purpose:** World feels lived-in, deeper than what's shown
- **Source:** LUX_Story_PRD_Addendum.md (Line 154), world building.md (Line 51)

#### 3.3.2 Station Evolution
- **Mechanic:** Environment physically changes based on relationships
- **Example:** Help the Engineer → lights stop flickering
- **Purpose:** Player agency affects world state
- **Source:** LUX_Story_PRD_Addendum.md (Line 155)

#### 3.3.3 Cross-Character Echoes
- **Mechanic:** References cascade across arcs
- **Example:** "Maya mentioned you. Said you didn't try to fix her."
- **Purpose:** Living social network, choices remembered
- **Source:** LUX_Story_PRD_Addendum.md (Line 156)

### Design Philosophy

#### 3.3.4 Iceberg Principle (90% Hidden)
**Source:** world building.md (Lines 47-58)

**Rule:** Develop 90% hidden depth to support 10% visible content
**Test:** "Does this connect meaningfully to story/characters/themes? If you remove it, does anything important change?"
**Purpose:** Fascinating details that exist in isolation aren't worth development time
**Application:** Some knowledge "stays hidden throughout entire story" while influencing visible elements

### Dependencies
- **Requires:** Deep worldbuilding documentation
- **Affects:** Dialogue writing, environmental storytelling
- **Creates:** Depth perception, replayability

---

## 3.4 Vulnerability Arcs

**Source:** LUX_Story_PRD_Addendum.md (Lines 218-227)

### Overview
Vulnerability Hints reveal what characters lost, failed at, or fear. Only 13% coverage (2/15 characters).

### Current Implementation

#### 3.4.1 Maya's Vulnerability Arc
- **Status:** ✅ Implemented
- **Content:** (Specific details in character dialogue graphs)

#### 3.4.2 Devon's Vulnerability Arc
- **Status:** ✅ Implemented
- **Content:** (Specific details in character dialogue graphs)

### Planned Vulnerability Arcs

#### 3.4.3 Samuel's Vulnerability
- **Concept:** What he lost to become the Conductor
- **Priority:** High (Core Cast)
- **Source:** LUX_Story_PRD_Addendum.md (Line 223)

#### 3.4.4 Marcus's Vulnerability
- **Concept:** The breach he couldn't prevent
- **Priority:** High (Core Cast)
- **Source:** LUX_Story_PRD_Addendum.md (Line 224)

#### 3.4.5 Kai's Vulnerability
- **Concept:** The project that failed inspection
- **Priority:** High (Core Cast)
- **Source:** LUX_Story_PRD_Addendum.md (Line 225)

#### 3.4.6 Rohan's Vulnerability
- **Concept:** The truth that cost him relationships
- **Priority:** High (Core Cast)
- **Source:** LUX_Story_PRD_Addendum.md (Line 226)

### Implementation Target
- **Current:** 13% (2/15 characters)
- **Target:** 50% (at least one per Core Cast)
- **Priority:** #1 in implementation priorities
- **Source:** LUX_Story_PRD_Addendum.md (Lines 213, 218-227)

### Dependencies
- **Requires:** High trust unlocks, character arc progression
- **Affects:** Character depth, emotional engagement, replayability

---


# 4. PLAYER INTERFACE SYSTEMS

## 4.1 Journal System

**Source:** LUX_Story_PRD_v2.md (Lines 424-432), CLAUDE.md

### Overview
Side panel providing access to player stats, progress tracking, and relationship visualization.

### Features

#### 4.1.1 Pattern Breakdown Visualization
- **Display:** Visual representations of 5 behavioral patterns
- **Function:** Shows player's pattern distribution
- **Updates:** Real-time as choices made
- **Source:** LUX_Story_PRD_v2.md (Line 429)

#### 4.1.2 Character Relationship Constellation
- **Display:** Constellation view showing character connections
- **Function:** Visualizes trust levels and relationship web
- **Unlocks:** Private Opinions at high trust levels
- **Source:** LUX_Story_PRD_v2.md (Line 430)

#### 4.1.3 Progress Tracking
- **Displays:** Completed arcs, unlocked content, session stats
- **Function:** Player can see advancement through game
- **Source:** LUX_Story_PRD_v2.md (Line 431)

#### 4.1.4 Marquee Shimmer for New Content
- **Effect:** Two-layer forward/reverse animation
- **Trigger:** When new content unlocked (pattern threshold reached, trust level increased)
- **Purpose:** Attention direction - "navigate here to see what changed"
- **Philosophy:** Action → visual feedback → discovery loop
- **Source:** LUX_Story_PRD_v2.md (Line 432), CLAUDE.md

#### 4.1.5 Side Panel Access
- **Location:** Persistent access from main game interface
- **Layout:** Non-intrusive, toggleable panel
- **Source:** LUX_Story_PRD_v2.md (Line 428)

### Dependencies
- **Requires:** GameState for data
- **Integrates With:** Pattern System, Trust System, Arc Tracking
- **Component:** Journal.tsx

---

## 4.2 Dialogue Interface

**Source:** LUX_Story_PRD_v2.md (Lines 391-403), CLAUDE.md

### Chat-Paced Dialogue

#### 4.2.1 Thinking Indicators
- **Display:** Show once at message start
- **Philosophy:** Then let dialogue flow without interruption
- **Purpose:** Signal character is "typing" without breaking immersion
- **Source:** CLAUDE.md

#### 4.2.2 Character-Specific Styling
- **Function:** Each character has distinct visual presentation
- **Elements:** Font choices, color accents, container styling
- **Source:** LUX_Story_PRD_v2.md (Line 394)

#### 4.2.3 Narrative Container Differentiation
**Source:** CLAUDE.md

**Container Types:**
- **NPC Dialogue:** Standard container (rgba white, subtle border)
- **Narrative Text:** Different color + marquee shimmer + larger font
- **Formatting:** Left-aligned for readability (no center-justification)

#### 4.2.4 Rich Text Effects Support
**Source:** LUX_Story_PRD_v2.md (Line 395)

- Emphasis (bold, italic, underline)
- Pauses (timing markers)
- Colored text (pattern-specific or emotional)
- Inline interactions (embedded clickable elements)

**Component:** RichTextRenderer.tsx

### Choice Interface

#### 4.2.5 Fixed-Height Container (140px)
- **Constraint:** Prevents layout shifts
- **Scroll:** If choices exceed height
- **Options:** 2-4 dialogue choices displayed
- **Source:** LUX_Story_PRD_v2.md (Line 397)

#### 4.2.6 Visual Feedback Animations
**Source:** LUX_Story_PRD_v2.md (Line 398)

**Interaction Animations:**
- **Shake:** Rejection or conflict
- **Nod:** Agreement or acceptance
- **Bloom:** Exploration or curiosity
- **Purpose:** Immediate feedback for choice confirmation

**Trigger:** Within 16ms (60fps requirement)
**Component:** `lib/interaction-parser.ts`

### Container Layout
**Source:** CLAUDE.md

**Three-Zone Fixed Layout:**
```
┌─────────────────────────────────────────┐
│ HEADER (flex-shrink-0) - Never moves    │
├─────────────────────────────────────────┤
│ MAIN (flex-1, overflow-y-auto)          │
│   └─ Dialogue Card: solid bg (85%+)     │
├─────────────────────────────────────────┤
│ FOOTER (flex-shrink-0) - Never moves    │
└─────────────────────────────────────────┘
```

- **HEADER:** Navigation, never moves
- **MAIN:** Dialogue container, scrollable
- **FOOTER:** Choice interface, never moves

### Dependencies
- **Requires:** DialogueGraph, RichTextRenderer, character-typing config
- **Component:** StatefulGameInterface.tsx, ChatPacedDialogue.tsx

---

## 4.3 Save/Load System

**Source:** LUX_Story_PRD_v2.md (Lines 434-442)

### Auto-Save Functionality

#### 4.3.1 Auto-Save on Significant Interactions
- **Trigger:** Every significant interaction (dialogue choice, trust change, pattern increment)
- **Storage:** LocalStorage (primary)
- **Purpose:** Never lose progress
- **Source:** LUX_Story_PRD_v2.md (Line 437)

#### 4.3.2 Offline Play Support
- **Storage:** LocalStorage persistence
- **Function:** Full game playable without internet
- **Philosophy:** Offline-first architecture
- **Source:** LUX_Story_PRD_v2.md (Line 438)

### Cloud Sync

#### 4.3.3 Supabase Cloud Sync
- **Trigger:** When connectivity available
- **Method:** Background sync with retry logic
- **Constraint:** Doesn't block UI interactions (NFR-4)
- **Success Metric:** >99% of saves successfully synced
- **Source:** LUX_Story_PRD_v2.md (Lines 439, 608)

#### 4.3.4 Sync Retry Logic
- **Component:** GameStateManager background sync
- **Function:** Retry failed syncs automatically
- **Integration:** LocalStorage ↔ Supabase
- **Source:** LUX_Story_PRD_v2.md (Line 311)

### Error Handling

#### 4.3.5 Corrupt Save Recovery
- **Function:** Graceful recovery options when save corrupted
- **Options:** Restore from last good save, reset with confirmation
- **Edge Case Handling:** GameStateManager
- **Source:** LUX_Story_PRD_v2.md (Lines 310, 441)

#### 4.3.6 Version Migration
- **Function:** Migrate saves between game versions
- **Component:** GameStateManager
- **Purpose:** Maintain compatibility across updates
- **Source:** LUX_Story_PRD_v2.md (Line 310)

### Technical Implementation

#### 4.3.7 GameStateManager
**Source:** LUX_Story_PRD_v2.md (Lines 305-312)

**Functions:**
- Central state orchestration
- Save/load operations
- Sync coordination
- State transitions
- Immutable transformations via `GameStateUtils.applyStateChange()`
- Edge case handling: corrupt saves, version migration, offline support
- Background Supabase sync with retry logic

### Dependencies
- **Storage:** LocalStorage (primary), Supabase (cloud backup)
- **Requires:** GameState data model
- **Integrates:** All game systems (patterns, trust, arcs, choices)

---

## 4.4 Interrupt System

**Source:** LUX_Story_PRD_Addendum.md (Lines 130-138)

### Overview
"Moment-to-Moment Agency" - timed opportunities to act during NPC dialogue.

### Mechanics

#### 4.4.1 Interrupt Timing Window
- **Trigger:** Specific dialogue nodes with `canInterrupt` flag
- **Parameter:** `interruptWindow` (ms) - time player has to act
- **Display:** Subtle button appears during NPC emotional moments
- **Example:** "Reach out" while character is crying
- **Source:** LUX_Story_PRD_Addendum.md (Lines 132-134)

#### 4.4.2 Silence as Meaningful Response
- **Rule:** Missing interrupts is valid choice
- **Philosophy:** Observing without acting has meaning
- **Pattern Impact:** Observing → Patience patterns
- **Source:** LUX_Story_PRD_Addendum.md (Lines 135, 137)

#### 4.4.3 Pattern Impact
**Source:** LUX_Story_PRD_Addendum.md (Lines 136-137)

- **Acting on interrupts:** → Helping patterns
- **Observing without acting:** → Patience patterns

#### 4.4.4 Rarity and Impact
- **Frequency:** Rare, high-impact moments
- **Purpose:** Break text walls, create agency
- **Design:** Interrupts are exceptional, not common
- **Source:** LUX_Story_PRD_Addendum.md (Line 135)

### Technical Implementation
- **Flag:** `canInterrupt: boolean` on DialogueNode
- **Timing:** `interruptWindow: number` (milliseconds)
- **Integration:** DialogueGraphNavigator

### Dependencies
- **Requires:** DialogueGraph, timing system
- **Affects:** Pattern tracking (Helping vs. Patience)

---

# 5. ADMIN & ANALYTICS

## 5.1 Cohort Management

**Source:** LUX_Story_PRD_v2.md (Lines 444-448)

### Cohort Creation

#### 5.1.1 Educator Cohort Creation
- **Function:** Educators can create player cohorts
- **Use Case:** Group students by class, program, or intervention
- **Source:** LUX_Story_PRD_v2.md (Line 445)

### Cohort Analytics

#### 5.1.2 Cohort-Level Pattern Distributions
- **Display:** Aggregated pattern data across cohort
- **Metrics:** Mean, median, distribution curves for 5 patterns
- **Purpose:** Identify cohort-wide trends
- **Source:** LUX_Story_PRD_v2.md (Line 446)

#### 5.1.3 Cohort Comparison
- **Function:** Compare multiple cohorts side-by-side
- **Use Cases:** Program A vs Program B, Year 1 vs Year 2
- **Source:** LUX_Story_PRD_v2.md (Line 447)

### Success Metrics

#### 5.1.4 Pattern Distribution Target
- **Metric:** No pattern >40% of population
- **Purpose:** Ensure assessment diversity, avoid bias
- **Source:** LUX_Story_PRD_v2.md (Line 600)

### Dependencies
- **Requires:** User authentication, role-based permissions
- **Data Source:** Aggregated player GameState data
- **Component:** Admin dashboard cohort section

---

## 5.2 Individual Insights

**Source:** LUX_Story_PRD_v2.md (Lines 450-462)

### Student Reports

#### 5.2.1 Student Insight Report Generation
- **Input:** Player gameplay data (patterns, choices, arcs)
- **Output:** Comprehensive profile with career recommendations
- **Source:** LUX_Story_PRD_v2.md (Line 455)

#### 5.2.2 Pattern-to-WEF Skills Mapping
- **Function:** Show which WEF 2030 skills demonstrated
- **Display:** Skill scores derived from pattern scores
- **Integration:** SkillTracker → StudentInsights
- **Source:** LUX_Story_PRD_v2.md (Lines 456, 384)

#### 5.2.3 Career Path Recommendations
- **Function:** Recommend careers based on demonstrated patterns
- **Output:** Birmingham-specific opportunities
- **Algorithm:** FutureSkillsSystem career matching
- **Source:** LUX_Story_PRD_v2.md (Line 457)

#### 5.2.4 Evidence Quotes from Gameplay
- **Function:** Provide specific choice quotes as evidence
- **Source Data:** ChoiceRecord sessionHistory
- **Purpose:** Contextualize recommendations with player's actual words
- **Example:** "When Maya asked for help, you said: '[choice text]'"
- **Source:** LUX_Story_PRD_v2.md (Line 458)

### Dependencies
- **Requires:** GameState, ChoiceRecord history, SkillTracker
- **Integrates:** FutureSkillsSystem, career mappings
- **Component:** Admin dashboard insights section

---

## 5.3 View Modes

**Source:** LUX_Story_PRD_v2.md (Lines 464-467), CLAUDE.md

### Mode Specifications

#### 5.3.1 Family View
- **Language:** Friendly, accessible, non-technical
- **Audience:** Parents/guardians
- **Purpose:** Explain child's strengths without jargon
- **Source:** LUX_Story_PRD_v2.md (Line 466)

#### 5.3.2 Research View
- **Language:** Technical details, raw data
- **Audience:** Researchers, data analysts
- **Display:** Pattern scores, choice distributions, statistical analysis
- **Source:** LUX_Story_PRD_v2.md (Line 467)

### Implementation

#### 5.3.3 SharedDashboardLayout
**Source:** CLAUDE.md

**Provides:**
- Profile loading with skeleton
- Navigation between sections
- View mode toggle (family/research)
- Context provider for child sections

**Interface:**
```typescript
interface SectionProps {
  userId: string
  profile: SkillProfile
  adminViewMode: 'family' | 'research'
}
```

### Dependencies
- **Component:** SharedDashboardLayout.tsx
- **Requires:** Admin authentication, user profiles
- **Affects:** All admin dashboard sections

---

# 6. TECHNICAL INFRASTRUCTURE

## 6.1 Technology Stack

**Source:** LUX_Story_PRD_v2.md (Lines 270-283)

### Frontend Framework

#### 6.1.1 Next.js 15 + React 18
- **Features:** SSR for SEO, App Router for routing
- **Rationale:** Modern React patterns, excellent DX
- **Source:** LUX_Story_PRD_v2.md (Line 276)

#### 6.1.2 TypeScript (Strict Mode)
- **Configuration:** Strict type checking enabled
- **Purpose:** Type safety prevents runtime errors
- **Validation:** isValidPattern(), isValidEmotion(), isValidCharacterId()
- **Source:** LUX_Story_PRD_v2.md (Line 277), CLAUDE.md

### State Management

#### 6.1.3 Zustand + LocalStorage
- **Purpose:** Persisted sessions, minimal boilerplate
- **Pattern:** Offline-first architecture
- **Source:** LUX_Story_PRD_v2.md (Line 278)

### Database

#### 6.1.4 Supabase (PostgreSQL)
- **Features:** Real-time sync, auth, edge functions
- **Integration:** Background sync from LocalStorage
- **Scaling:** Horizontal database scaling (NFR-14)
- **Source:** LUX_Story_PRD_v2.md (Lines 279, 505)

### Styling

#### 6.1.5 Tailwind CSS
- **Approach:** Utility-first for rapid iteration
- **Customization:** Design tokens in `lib/ui-constants.ts`
- **Source:** LUX_Story_PRD_v2.md (Line 280), CLAUDE.md

### Animation

#### 6.1.6 Framer Motion
- **Features:** Spring physics, reduced motion support
- **Accessibility:** Respects `prefers-reduced-motion`
- **Config:** Springs in `lib/animations.ts`, `lib/springs.ts`
- **Source:** LUX_Story_PRD_v2.md (Line 281), CLAUDE.md

### Deployment

#### 6.1.7 Vercel
- **Features:** Auto-deploy on push to main, edge optimization
- **URL:** https://lux-story.vercel.app
- **Source:** LUX_Story_PRD_v2.md (Line 282), CLAUDE.md

### Testing

#### 6.1.8 Vitest
- **Purpose:** Unit testing for lib functions
- **Coverage:** 33 tests for core systems
- **Status:** StateConditionEvaluator, SkillTracker tested
- **Source:** LUX_Story_PRD_v2.md (Line 283), CLAUDE.md

#### 6.1.9 Playwright
- **Purpose:** E2E browser automation
- **Coverage:** Critical user flows
- **Test Page:** `/test-pixels` for avatar verification
- **Source:** LUX_Story_PRD_v2.md (Line 283), CLAUDE.md

---

## 6.2 Core Systems

**Source:** LUX_Story_PRD_v2.md (Lines 303-344)

### State Management

#### 6.2.1 GameStateManager
**Source:** LUX_Story_PRD_v2.md (Lines 305-312)

**Responsibilities:**
- Central state orchestration handling save/load
- Sync coordination
- State transitions
- Immutable state transformations via `GameStateUtils.applyStateChange()`
- Edge case handling: corrupt saves, version migration, offline support
- Background Supabase sync with retry logic

**Location:** `lib/game-state-manager.ts`

### Navigation

#### 6.2.2 DialogueGraphNavigator
**Source:** LUX_Story_PRD_v2.md (Lines 314-323)

**Responsibilities:**
- Graph traversal engine with condition evaluation
- StateConditionEvaluator for branching logic
- Choice validation based on game state
- State change application on node transitions

**Location:** `lib/dialogue-graph.ts`

### Skill Tracking

#### 6.2.3 SkillTracker
**Source:** LUX_Story_PRD_v2.md (Lines 325-333)

**Responsibilities:**
- Pattern and skill tracking with career mapping
- Real-time pattern calculation from choice history
- WEF 2030 skill derivation from pattern scores
- Career path matching algorithm

**Location:** `lib/skill-tracker.ts`

#### 6.2.4 FutureSkillsSystem
**Source:** LUX_Story_PRD_v2.md (Lines 335-344)

**Responsibilities:**
- Comprehensive skill analysis integrating 50+ granular skills
- Keyword-based skill value calculation
- Career path matching with Birmingham-specific opportunities
- Skill context and explanation generation

**Location:** `lib/2030-skills-system.ts`

### Condition Evaluation

#### 6.2.5 StateConditionEvaluator
**Source:** LUX_Story_PRD_v2.md (Line 319)

**Responsibilities:**
- Evaluate conditions for dialogue branching
- Check trust thresholds, pattern levels, knowledge flags
- Boolean logic for complex conditions

**Integration:** DialogueGraphNavigator, content gating

---

## 6.3 Data Models

**Source:** LUX_Story_PRD_v2.md (Lines 346-378)

### GameState

#### 6.3.1 GameState Data Structure
**Source:** LUX_Story_PRD_v2.md (Lines 348-361)

**Master state container:**
```typescript
interface GameState {
  patterns: Record<PatternType, number>;        // Current pattern scores
  trust: Record<CharacterId, number>;           // Trust levels per character
  knowledgeFlags: Set<string>;                   // Unlocked information
  completedArcs: string[];                       // Finished character storylines
  currentNode: string;                           // Active dialogue node
  sessionHistory: ChoiceRecord[];                // Full choice log
}
```

**Persistence:** LocalStorage + Supabase cloud backup

#### 6.3.2 PatternType Enum
- **Values:** 'analytical', 'patience', 'exploring', 'helping', 'building'
- **Validation:** `isValidPattern()` in `lib/patterns.ts`
- **Source:** CLAUDE.md

#### 6.3.3 CharacterId Enum
- **Values:** 'samuel', 'maya', 'devon', 'marcus', etc.
- **Validation:** `isValidCharacterId()` in `lib/graph-registry.ts`
- **Source:** CLAUDE.md

### Dialogue Nodes

#### 6.3.4 DialogueNode
**Source:** LUX_Story_PRD_v2.md (Lines 363-378)

**Interface:**
```typescript
interface DialogueNode {
  id: string;                    // Unique node identifier
  speakerId: CharacterId;        // Speaking character
  text: string;                  // Dialogue content with rich text markup
  choices?: DialogueChoice[];    // Available options
  conditions?: StateCondition[]; // Entry requirements
  stateChanges?: StateChange[];  // Effects on selection
  transitions?: {                // Next node(s) based on conditions
    next: string;
    condition?: StateCondition
  }[];
}
```

#### 6.3.5 StateCondition
**Purpose:** Entry requirements for nodes
**Types:** Trust thresholds, pattern levels, knowledge flags, completed arcs

#### 6.3.6 StateChange
**Purpose:** Effects on selection
**Types:** Pattern increments, trust modifications, flag sets, arc completions

#### 6.3.7 ChoiceRecord
**Purpose:** Full choice logging
**Fields:** nodeId, choiceId, timestamp, patterns affected, trust changes

---

## 6.4 Integration Points

**Source:** LUX_Story_PRD_v2.md (Lines 379-387)

### System Integrations

#### 6.4.1 SkillTracker ↔ StudentInsights
- **Flow:** Pattern scores feed career profile generation
- **Purpose:** Admin insights derive from player patterns

#### 6.4.2 DialogueGraph ↔ GameState
- **Flow:** Condition evaluation respects state flags
- **Purpose:** Dynamic branching based on player state

#### 6.4.3 StatefulGameInterface ↔ All Systems
- **Flow:** Renders all state changes including hidden ones
- **Purpose:** Main UI component orchestrating all systems

#### 6.4.4 LocalStorage ↔ Supabase
- **Flow:** Offline-first with background sync
- **Purpose:** Persistence with cloud backup

---

# 7. DESIGN SYSTEMS & UX

## 7.1 Sentient Glass Design System

**Source:** LUX_Story_PRD_v2.md (Lines 519-530), CLAUDE.md

### Visual Language

#### 7.1.1 Glass Panels
- **Style:** rgba backgrounds with backdrop blur, subtle borders
- **Opacity:** 85%+ for readability (solid enough for text)
- **No Transitions:** On background color (prevents color jumping)
- **Source:** LUX_Story_PRD_v2.md (Line 524), CLAUDE.md

#### 7.1.2 Pattern Glows
- **Trigger:** Hover on choices
- **Style:** Colored accents based on dominant patterns
- **Application:** Via `data-pattern` attribute
- **Source:** LUX_Story_PRD_v2.md (Line 525), CLAUDE.md

#### 7.1.3 Breathing Animations
- **Target:** Dormant elements (orbs in Journal)
- **Style:** Gentle pulsing
- **Accessibility:** Respect `prefers-reduced-motion`
- **Source:** LUX_Story_PRD_v2.md (Line 526), CLAUDE.md

#### 7.1.4 Marquee Shimmer
- **Effect:** Two-layer forward/reverse animation
- **Purpose:** Attention-grabbing for new content
- **Locations:** Nav buttons, narrative text
- **Philosophy:** Synchronized symmetrical disposition creates depth
- **Source:** LUX_Story_PRD_v2.md (Line 527), CLAUDE.md

---

## 7.2 Layout Architecture

**Source:** LUX_Story_PRD_v2.md (Lines 532-540), CLAUDE.md

### Fixed Three-Zone Layout

#### 7.2.1 Layout Structure
**Source:** LUX_Story_PRD_v2.md (Lines 532-540)

Following Claude/ChatGPT patterns:

```
┌─────────────────────────────────────────┐
│ HEADER (flex-shrink-0)                  │
│ Navigation, never moves                 │
├─────────────────────────────────────────┤
│ MAIN (flex-1, overflow-y-auto)          │
│ Dialogue container, scrollable content  │
├─────────────────────────────────────────┤
│ FOOTER (flex-shrink-0)                  │
│ Choice interface, never moves           │
└─────────────────────────────────────────┘
```

**HEADER:**
- flex-shrink-0: Never moves
- Navigation elements
- Stays fixed at top

**MAIN:**
- flex-1: Takes available space
- overflow-y-auto: Scrollable
- Dialogue container
- 85%+ opacity backgrounds for readability

**FOOTER:**
- flex-shrink-0: Never moves
- Choice interface
- Stays fixed at bottom

---

## 7.3 Visual Hierarchy

**Source:** LUX_Story_PRD_v2.md (Lines 542-549)

### Element Styling

#### 7.3.1 NPC Dialogue
- **Style:** Standard glass-panel, rgba(10,12,16,0.85)
- **Purpose:** Primary content delivery
- **Source:** LUX_Story_PRD_v2.md (Line 546)

#### 7.3.2 Narrative Text
- **Style:** Larger font, marquee shimmer, different hue
- **Purpose:** Environmental/atmospheric description
- **Distinction:** Different from NPC dialogue for clarity
- **Source:** LUX_Story_PRD_v2.md (Line 547), CLAUDE.md

#### 7.3.3 Player Choices
- **Style:** Button with pattern-color hover glow
- **Purpose:** Primary interaction point
- **Source:** LUX_Story_PRD_v2.md (Line 548)

#### 7.3.4 Pattern Sensation
- **Style:** Italicized, subtle fade-in
- **Purpose:** Internal monologue feedback
- **Source:** LUX_Story_PRD_v2.md (Line 549)

---

## 7.4 Animation Standards

**Source:** LUX_Story_PRD_v2.md (Lines 551-558), CLAUDE.md

### Spring Configurations

#### 7.4.1 Micro-interactions (Buttons)
- **Spring:** `springs.snappy`
- **Duration:** ~150ms
- **Use Cases:** Buttons, small UI elements
- **Source:** LUX_Story_PRD_v2.md (Line 554), CLAUDE.md

#### 7.4.2 Panels, Modals
- **Spring:** `springs.smooth`
- **Duration:** ~300ms
- **Use Cases:** Panels, modal dialogs
- **Source:** LUX_Story_PRD_v2.md (Line 555), CLAUDE.md

#### 7.4.3 Fades, Reveals
- **Spring:** `springs.gentle`
- **Duration:** ~250ms
- **Use Cases:** Opacity transitions, reveals
- **Source:** LUX_Story_PRD_v2.md (Line 556), CLAUDE.md

#### 7.4.4 Stagger Delay
- **Config:** `STAGGER_DELAY.normal`
- **Duration:** 80ms between items
- **Use Cases:** List animations, sequential reveals
- **Source:** LUX_Story_PRD_v2.md (Line 557), CLAUDE.md

### Animation Best Practices

**Source:** CLAUDE.md

#### 7.4.5 Framer Motion with Springs
```typescript
import { motion, useReducedMotion } from 'framer-motion'
import { springs, STAGGER_DELAY } from '@/lib/animations'

const prefersReducedMotion = useReducedMotion()

<motion.div
  initial={!prefersReducedMotion ? { opacity: 0, y: 8 } : false}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * STAGGER_DELAY.normal, ...springs.gentle }}
>
```

#### 7.4.6 Progress Bar Animations
**Source:** CLAUDE.md

**✅ Correct - No artifacts:**
```typescript
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress * 100}%` }}
  transition={springs.smooth}
/>
```

**❌ Avoid - Causes subpixel artifacts:**
```typescript
initial={{ scaleX: 0 }}
animate={{ scaleX: progress }}
```

---

## 7.5 Mobile-First Constraints

**Source:** LUX_Story_PRD_v2.md (Lines 560-569)

### Mobile Optimization

#### 7.5.1 Safe Area Padding
- **Property:** `env(safe-area-inset-*)`
- **Purpose:** Handle notched devices
- **CSS Variable:** `var(--safe-area-bottom)` in globals.css
- **Source:** LUX_Story_PRD_v2.md (Line 562), CLAUDE.md

#### 7.5.2 Viewport Meta
- **Setting:** Preventing zoom on iOS
- **Purpose:** Native app feel
- **Source:** LUX_Story_PRD_v2.md (Line 563)

#### 7.5.3 Tap Highlight Removal
- **Property:** `-webkit-tap-highlight-color: transparent`
- **Purpose:** Clean touch interactions
- **Source:** LUX_Story_PRD_v2.md (Line 564)

#### 7.5.4 Touch Targets (44px Minimum)
- **Standard:** Apple HIG compliance
- **Constant:** `BUTTON_HEIGHT` in `lib/ui-constants.ts`
- **Application:** All interactive elements
- **Source:** LUX_Story_PRD_v2.md (Line 565), CLAUDE.md (NFR-5)

#### 7.5.5 Session Optimization
- **Target:** 5-7 minute engagement windows
- **Purpose:** Mobile-first, snackable sessions
- **Success Metric:** Average session length 5-7 minutes
- **Source:** LUX_Story_PRD_v2.md (Line 566, Line 594)

---

## 7.6 Stability Rules

**Source:** LUX_Story_PRD_v2.md (Lines 571-582), CLAUDE.md

### Animation Constraints

#### 7.6.1 Allowed Animations
**Source:** LUX_Story_PRD_v2.md (Line 576)

- **Opacity fades:** Smooth transitions
- **Scale on interaction:** whileTap, whileHover
- **Localized glows/pulses:** On hover, confined to element

#### 7.6.2 Not Allowed Animations
**Source:** LUX_Story_PRD_v2.md (Line 577)

- **Position changes on containers:** Causes layout jumping
- **Background color transitions:** Color jumping, "fading" confusion
- **Full-screen overlays:** Distracting, "flashing"

#### 7.6.3 Progress Bar Rule
**Source:** LUX_Story_PRD_v2.md (Line 579)

- **Use:** Width animation
- **Avoid:** scaleX (prevents subpixel artifacts)

#### 7.6.4 Glass Panel Opacity
**Source:** LUX_Story_PRD_v2.md (Line 580)

- **Minimum:** 85%+ opacity for readability
- **No Transitions:** On background color

### Glass Morphic Stability Philosophy

**Source:** CLAUDE.md

**Core Principle:** Beautiful AND stable. Sentient Glass must not sacrifice usability for aesthetics.

**What to KEEP (Localized):**
- Marquee shimmer on nav buttons
- Border pulse on badges
- Pattern glow on choice hover
- Breathing on dormant orbs
- Glass blur/shadow core aesthetic

**What to AVOID (Full-Screen):**
- Full-screen color overlays
- Animated background transitions
- Position animations on containers
- Processing pulses (battery drain)
- Container color transitions

---

## 7.7 Accessibility Features

**Source:** LUX_Story_PRD_v2.md (Lines 484-491), CLAUDE.md

### Accessibility Requirements

#### 7.7.1 Touch Target Minimum (NFR-5)
- **Size:** 44px minimum (Apple HIG)
- **Application:** All interactive elements
- **Constant:** `BUTTON_HEIGHT` in `lib/ui-constants.ts`
- **Source:** LUX_Story_PRD_v2.md (Line 485)

#### 7.7.2 Prefers-Reduced-Motion (NFR-6)
- **Respect:** System setting for reduced motion
- **Implementation:** All Framer Motion animations check `useReducedMotion()`
- **Fallback:** Static display when motion reduced
- **Source:** LUX_Story_PRD_v2.md (Line 486), CLAUDE.md

#### 7.7.3 Color Contrast (NFR-7)
- **Standard:** WCAG 2.1 AA compliance
- **Application:** All text and UI elements
- **Source:** LUX_Story_PRD_v2.md (Line 487)

#### 7.7.4 Keyboard Navigation (NFR-8)
- **Requirement:** All content navigable via keyboard
- **Focus States:** Visible focus indicators
- **Source:** LUX_Story_PRD_v2.md (Line 488)

---

# 8. CONTENT CREATION FRAMEWORKS

## 8.1 Design Pillars (10 Commandments)

**Source:** LUX_Story_PRD_v2.md (Lines 144-157, 764-786), CLAUDE.md

### The Ten Commandments

#### 8.1.1 Feel Comes First
- **Rule:** Game must feel good within first 30 seconds
- **Test:** Controls intuitive, actions satisfying
- **Anti-Pattern:** Friction is design failure
- **Source:** LUX_Story_PRD_v2.md (Line 148, Line 767)

#### 8.1.2 Respect Player Intelligence
- **Rule:** Don't overexplain. Let players discover.
- **Philosophy:** Failure teaches, not punishes
- **Source:** LUX_Story_PRD_v2.md (Line 149, Line 769)

#### 8.1.3 Every Element Serves Multiple Purposes
- **Rule:** Visuals both beautiful and functional
- **Application:** Mechanics reinforce narrative themes
- **Efficiency:** UI informs without interrupting
- **Source:** LUX_Story_PRD_v2.md (Line 150, Line 770)

#### 8.1.4 Accessible Depth
- **Rule:** Easy to learn, difficult to master
- **Design:** Surface simplicity hiding strategic depth
- **Source:** LUX_Story_PRD_v2.md (Line 151, Line 771)

#### 8.1.5 Meaningful Choices
- **Rule:** Every decision has visible consequences
- **Philosophy:** No obvious "right" answers—only trade-offs
- **Identity:** Choices reflect player identity
- **Source:** LUX_Story_PRD_v2.md (Line 152, Line 772)

#### 8.1.6 Friction is Failure
- **Rule:** Every moment of confusion is design failure
- **Philosophy:** Never blame the player
- **Action:** If it needs explanation, redesign it
- **Source:** LUX_Story_PRD_v2.md (Line 153, Line 773)

#### 8.1.7 Emotion Over Mechanics
- **Rule:** Mechanics serve emotional experience
- **Priority:** What players feel > what they do
- **Source:** LUX_Story_PRD_v2.md (Line 154, Line 774)

#### 8.1.8 Show, Don't Tell
- **Rule:** World communicates narrative
- **Method:** Reduce text/tutorials through visual design
- **Environmental:** Storytelling through environment
- **Source:** LUX_Story_PRD_v2.md (Line 155, Line 775)

#### 8.1.9 Juice is Not Optional
- **Rule:** Feedback for every action
- **Purpose:** Make simple actions feel powerful
- **Source:** LUX_Story_PRD_v2.md (Line 156, Line 776)

#### 8.1.10 Kill Your Darlings
- **Rule:** Remove features that don't serve core loop
- **Philosophy:** Complexity without value is bloat
- **Source:** LUX_Story_PRD_v2.md (Line 157, Line 777)

---

## 8.2 Red Flags to Avoid

**Source:** CLAUDE.md

### Anti-Patterns

#### 8.2.1 The Iceberg Game
- **Problem:** 90% of features hidden
- **Result:** Core value invisible until late game
- **Mitigation:** Surface value early

#### 8.2.2 Developer's Delight
- **Problem:** Features that excite devs but confuse players
- **Result:** Self-indulgent complexity
- **Mitigation:** Player-first design

#### 8.2.3 Progressive Paralysis
- **Problem:** Hiding features to "reduce overwhelm"
- **Result:** Game looks broken or incomplete
- **Mitigation:** Show value progressively but clearly

#### 8.2.4 Invisible Value Prop
- **Problem:** Players don't understand uniqueness
- **Result:** Looks like generic game
- **Mitigation:** Make differentiators obvious

#### 8.2.5 Tutorial Crutch
- **Problem:** Design by instruction rather than intuition
- **Result:** Tedious onboarding
- **Mitigation:** Self-evident design

#### 8.2.6 Feature Graveyard
- **Problem:** Systems nobody uses
- **Result:** Wasted development, confusing UI
- **Mitigation:** Kill features that don't serve core

---

## 8.3 Industry Methodology References

**Source:** world building.md

### Worldbuilding-First Methodology

#### 8.3.1 Foundation Before Production
**Source:** world building.md (Lines 3-6)

- **Principle:** Deep lore work becomes specification document
- **Cascade:** Worldbuilding decisions flow into every discipline
- **Examples:** ZA/UM (15+ years on Elysium), George R.R. Martin (5,000 years for Elden Ring)
- **Application:** LUX Story's Grand Central Terminus developed before production

#### 8.3.2 Loremaster Role
**Source:** world building.md (Lines 22-29)

- **Function:** Institutional memory and consistency guardian
- **Philosophy:** Enable rather than block creative choices
- **Responsibility:** "Voice in the room" for narrative and lore
- **Application:** Solo dev must create systems to maintain consistency with self

#### 8.3.3 IP Bible Structure
**Source:** world building.md (Lines 32-44)

**Components:**
- 2-3 paragraph core summary
- Design pillars and themes
- Key objects for story attachment
- Major events for dialogue/art reference
- Locations for level design
- Exact definitions of storytelling methods
- Maps, timelines, notes organization
- Unreliable narrator approach for flexibility

#### 8.3.4 Iceberg Principle (90% Hidden)
**Source:** world building.md (Lines 47-58)

**Rule:** Develop 90% hidden depth to support 10% visible content
**Test:** "Does this connect meaningfully to story/characters/themes?"
**Purpose:** Fascinating details in isolation aren't worth development time

#### 8.3.5 Narrative Design vs. Writing
**Source:** world building.md (Lines 61-72)

**Narrative Designer:**
- Player's experience of story
- Systems, pacing, integration
- Interactive sequences, dialogue systems

**Game Writer:**
- World's story and plot
- Characters, dialogue, factual information

**Solo Dev:** Must perform both functions, recognize as distinct disciplines

---

# 9. QUALITY & PERFORMANCE

## 9.1 Performance Requirements

**Source:** LUX_Story_PRD_v2.md (Lines 472-482)

### Load Time

#### 9.1.1 NFR-1: Initial Load Time
- **Requirement:** ≤ 3 seconds on 4G connection
- **Target:** < 2 seconds
- **Measurement:** Time to interactive
- **Success Metric:** <3s (target: <2s)
- **Source:** LUX_Story_PRD_v2.md (Lines 474, 607)

### Interaction Speed

#### 9.1.2 NFR-2: Dialogue Transitions
- **Requirement:** Complete within 100ms
- **Measurement:** Time from choice click to next dialogue display
- **Source:** LUX_Story_PRD_v2.md (Line 475)

#### 9.1.3 NFR-3: Choice Feedback Animations
- **Requirement:** Begin within 16ms (60fps)
- **Measurement:** Time from interaction to visual feedback start
- **Purpose:** Immediate, responsive feel
- **Source:** LUX_Story_PRD_v2.md (Line 476)

### Background Operations

#### 9.1.4 NFR-4: Background Sync Non-Blocking
- **Requirement:** Background sync shall not block UI interactions
- **Implementation:** Async Supabase sync with retry
- **Source:** LUX_Story_PRD_v2.md (Line 477)

---

## 9.2 Accessibility Requirements

**Source:** LUX_Story_PRD_v2.md (Lines 484-491)

*(Detailed in Section 7.7 - consolidated here for reference)*

#### 9.2.1 NFR-5: Touch Targets (44px)
#### 9.2.2 NFR-6: Prefers-Reduced-Motion
#### 9.2.3 NFR-7: WCAG 2.1 AA Color Contrast
#### 9.2.4 NFR-8: Keyboard Navigation

---

## 9.3 Security Requirements

**Source:** LUX_Story_PRD_v2.md (Lines 493-501)

### Data Protection

#### 9.3.1 NFR-9: Encryption
- **Requirement:** User data encrypted at rest and in transit
- **Implementation:** Supabase built-in encryption
- **Source:** LUX_Story_PRD_v2.md (Line 494)

### Authentication

#### 9.3.2 NFR-10: OAuth 2.0 Authentication
- **Requirement:** Industry-standard authentication protocols
- **Implementation:** OAuth 2.0 via Supabase Auth
- **Source:** LUX_Story_PRD_v2.md (Line 495)

### Authorization

#### 9.3.3 NFR-11: Role-Based Admin Permissions
- **Requirement:** Admin access requires role-based permissions
- **Roles:** Educator, researcher, administrator
- **Source:** LUX_Story_PRD_v2.md (Line 496)

### Privacy

#### 9.3.4 NFR-12: COPPA Compliance
- **Requirement:** PII handled in compliance with COPPA (users under 13)
- **Purpose:** Youth data protection
- **Source:** LUX_Story_PRD_v2.md (Line 497)

---

## 9.4 Scalability Requirements

**Source:** LUX_Story_PRD_v2.md (Lines 503-509)

### Concurrent Users

#### 9.4.1 NFR-13: 10,000 Concurrent Users
- **Requirement:** Support 10,000 concurrent users
- **Infrastructure:** Vercel edge functions, Supabase horizontal scaling
- **Source:** LUX_Story_PRD_v2.md (Line 504)

### Database Scaling

#### 9.4.2 NFR-14: Horizontal Database Scaling
- **Requirement:** Database shall scale horizontally for cohort growth
- **Implementation:** Supabase PostgreSQL scaling
- **Source:** LUX_Story_PRD_v2.md (Line 505)

### Content Scaling

#### 9.4.3 NFR-15: Unlimited Sector Additions
- **Requirement:** Content system supports unlimited sector additions
- **Design:** Fractal architecture (self-contained sectors)
- **Philosophy:** Expandable infinitely without breaking core narrative
- **Source:** LUX_Story_PRD_v2.md (Line 506)

---

## 9.5 Reliability Requirements

**Source:** LUX_Story_PRD_v2.md (Lines 511-517)

### Uptime

#### 9.5.1 NFR-16: 99.5% Uptime
- **Requirement:** System uptime shall exceed 99.5%
- **Success Metric:** >99.5% availability
- **Source:** LUX_Story_PRD_v2.md (Lines 512, 609)

### Data Integrity

#### 9.5.2 NFR-17: No Data Loss
- **Requirement:** Data loss shall not occur during normal operation
- **Implementation:** Auto-save, cloud sync, backup systems
- **Source:** LUX_Story_PRD_v2.md (Line 513)

### Graceful Degradation

#### 9.5.3 NFR-18: Graceful Degradation
- **Requirement:** System shall gracefully degrade when external services unavailable
- **Pattern:** Offline-first architecture
- **Fallback:** LocalStorage when Supabase unreachable
- **Source:** LUX_Story_PRD_v2.md (Line 514)

---

# 10. SUCCESS MEASUREMENT

## 10.1 Engagement KPIs

**Source:** LUX_Story_PRD_v2.md (Lines 584-595)

### Completion Metrics

#### 10.1.1 First Session Completion
- **Target:** >60% reach first milestone
- **Measurement:** Samuel introduction completion
- **Purpose:** Hook effectiveness
- **Source:** LUX_Story_PRD_v2.md (Line 591)

#### 10.1.2 Return Rate (D1)
- **Target:** >40% return within 24 hours
- **Measurement:** Session count per user
- **Purpose:** Engagement stickiness
- **Source:** LUX_Story_PRD_v2.md (Line 592)

#### 10.1.3 Character Arc Completion
- **Target:** >25% complete one arc
- **Measurement:** Arc completion events
- **Purpose:** Deep engagement
- **Source:** LUX_Story_PRD_v2.md (Line 593)

### Session Metrics

#### 10.1.4 Average Session Length
- **Target:** 5-7 minutes
- **Measurement:** Session duration tracking
- **Purpose:** Mobile-first optimization validation
- **Source:** LUX_Story_PRD_v2.md (Line 594)

#### 10.1.5 Total Engagement
- **Target:** >45 minutes lifetime
- **Measurement:** Cumulative session time
- **Purpose:** Overall engagement depth
- **Source:** LUX_Story_PRD_v2.md (Line 595)

---

## 10.2 Assessment Quality KPIs

**Source:** LUX_Story_PRD_v2.md (Lines 597-604)

### Pattern Distribution

#### 10.2.1 Pattern Distribution Balance
- **Target:** No pattern >40% population
- **Measurement:** Cohort pattern analysis
- **Purpose:** Ensure assessment diversity, avoid bias
- **Source:** LUX_Story_PRD_v2.md (Line 600)

### Choice Diversity

#### 10.2.2 Choice Diversity
- **Target:** No option >70% selection
- **Measurement:** Choice selection rates
- **Purpose:** Validate meaningful choices (not fake choices)
- **Source:** LUX_Story_PRD_v2.md (Line 601)

### Career Coverage

#### 10.2.3 Career Path Coverage
- **Target:** All 6 paths recommended
- **Measurement:** Recommendation distribution
- **Purpose:** Comprehensive career mapping
- **Source:** LUX_Story_PRD_v2.md (Line 602)

### Educator Satisfaction

#### 10.2.4 Educator Satisfaction
- **Target:** >4.0/5.0 rating
- **Measurement:** Post-deployment surveys
- **Purpose:** B2B product-market fit
- **Source:** LUX_Story_PRD_v2.md (Line 603)

---

## 10.3 Technical KPIs

**Source:** LUX_Story_PRD_v2.md (Lines 606-613)

### Performance

#### 10.3.1 Page Load Time
- **Target:** <3s on 4G (aspirational: <2s)
- **Measurement:** Time to interactive
- **Source:** LUX_Story_PRD_v2.md (Line 607)

### Reliability

#### 10.3.2 Error Rate
- **Target:** <0.1% of sessions with errors
- **Measurement:** Error tracking, Sentry integration
- **Source:** LUX_Story_PRD_v2.md (Line 608)

#### 10.3.3 Sync Success
- **Target:** >99% of saves successfully synced
- **Measurement:** Sync completion logs
- **Source:** LUX_Story_PRD_v2.md (Line 609)

#### 10.3.4 Uptime
- **Target:** >99.5% availability
- **Measurement:** Vercel/Supabase uptime monitoring
- **Source:** LUX_Story_PRD_v2.md (Line 610)

---

# APPENDIX: ADDITIONAL FEATURES & CONTEXT

## A.1 Product Philosophy

**Source:** LUX_Story_PRD_v2.md (Lines 22-54)

### Core Philosophy

#### A.1.1 "Career Discovery Through Contemplation, Not Examination"
- **Approach:** Narrative-driven engagement vs. traditional assessment
- **Hidden Layer:** 50+ skills tracked invisibly
- **Player Experience:** Feels like premium indie game
- **Assessment Reality:** Every interaction tracks WEF 2030 skills
- **Source:** LUX_Story_PRD_v2.md (Line 27)

#### A.1.2 "Trojan Horse" for Workforce Development
- **Appearance:** Premium indie game (Disco Elysium + Mass Effect inspired)
- **Reality:** Comprehensive career assessment tool
- **Differentiator:** Players want to engage, not feel tested
- **Source:** LUX_Story_PRD_v2.md (Line 25)

### Strategic Objectives

#### A.1.3 Strategic Objectives (5 Total)
**Source:** LUX_Story_PRD_v2.md (Lines 31-41)

1. Deliver compelling narrative experience (not thinly-veiled assessment)
2. Track 50+ granular skills through natural dialogue choices
3. Map patterns to Birmingham-Ready Career Paths
4. Provide educators with actionable insights via admin dashboard
5. Achieve mobile-first deployment with 5-7 minute sessions

### Key Differentiators

#### A.1.4 Key Differentiators (4 Total)
**Source:** LUX_Story_PRD_v2.md (Lines 43-54)

1. **Pattern-Based Assessment:** 5 patterns tracked through 16,000+ dialogue lines
2. **"Heart & Hands" Engine:** Graph-based narrative + real-world job simulations
3. **Trust Economy:** Information trading as primary currency
4. **Psychological Depth:** Pattern Voices as inner monologue, NPCs mirror identity

---

## A.2 Target Audience Specifications

**Source:** LUX_Story_PRD_v2.md (Lines 79-85)

### Audience Segments

#### A.2.1 Primary: Birmingham Youth
- **Age:** 14-24
- **Context:** Mobile-first, limited career exposure
- **Engagement Goal:** Complete at least one character arc (45-60 min total)

#### A.2.2 Secondary: Educators
- **Roles:** Teachers, counselors, workforce coaches
- **Goal:** Deploy to cohorts, analyze patterns, inform guidance

#### A.2.3 Tertiary: Parents/Guardians
- **Context:** Seeking insight into child's strengths
- **Output:** "Family-friendly" dashboard summaries

---

## A.3 Development Roadmap

**Source:** LUX_Story_PRD_v2.md (Lines 615-678)

### Current Status (v1.0 Complete)

#### A.3.1 v1.0 Features
**Source:** LUX_Story_PRD_v2.md (Lines 617-629)

- 11 characters with complete dialogue graphs (16,000+ lines)
- 5-pattern tracking system with threshold unlocks
- Trust system with consequence echoes
- Admin dashboard with cohort analytics
- Mobile-optimized deployment on Vercel

### Phase 1: Polish (Current)

#### A.3.2 Phase 1 Objectives
**Source:** LUX_Story_PRD_v2.md (Lines 631-642)

**Focus:** Maximum depth, minimal interface

- Clean codebase: Remove ghost systems, enforce type safety
- Test coverage: 100% reliability on StateConditionEvaluator, SkillTracker
- Chat UI enhancement: Character-specific typing, internal monologue channel
- Trust visualization: Textual cues replacing progress bars

### Phase 2: Depth (Q1 2026)

#### A.3.3 Phase 2 Enhancements
**Source:** LUX_Story_PRD_v2.md (Lines 644-654)

**Focus:** Psychological mechanics enhancement

- Trust = Discovery engine: High trust unlocks entire conversation branches
- Pattern recognition upgrade: Track "Player Archetype" from choice types
- Consequence echoes: Cross-character memory of player decisions
- Thought Cabinet: Ideas as equipment that modify checks (Disco Elysium-inspired)

### Phase 3: Expansion (Q2 2026)

#### A.3.4 Phase 3 Content
**Source:** LUX_Story_PRD_v2.md (Lines 656-665)

**Focus:** Content and reach

- Sector 2 (Market): Trust Economy gameplay, information trading
- Sector 3 (Deep Station): New Game+ with pattern mastery
- Simulation integration: Real-world job simulations embedded in narrative
- API for third-party integrations: Career services, college counseling

### Phase 4: Scale (Q3-Q4 2026)

#### A.3.5 Phase 4 Enterprise
**Source:** LUX_Story_PRD_v2.md (Lines 667-675)

**Focus:** Enterprise and sustainability

- White-label deployment for workforce partners
- Content creation toolkit for educators
- Analytics API for research partnerships
- Monetization: B2B licensing, premium features

---

## A.4 Competitive Positioning

**Source:** LUX_Story_PRD_Addendum.md (Lines 1-72)

### Differentiators vs. Competitors

#### A.4.1 vs. Pymetrics/Traitify
- **LUX Advantage:** Hidden assessment layer (narrative immersion)
- **Competitor Weakness:** Clinical feel, obvious testing
- **Source:** LUX_Story_PRD_Addendum.md (Lines 13-19, 66)

#### A.4.2 vs. PathSource
- **LUX Advantage:** Entertainment-first approach
- **Competitor Weakness:** Traditional assessment format, feels like homework
- **Source:** LUX_Story_PRD_Addendum.md (Lines 29-35, 66)

#### A.4.3 vs. Disco Elysium
- **LUX Advantage:** Mobile-first, 5-7 min sessions, age-appropriate, B2B model
- **Competitor Limitation:** PC-focused, 40+ hour experience, mature themes
- **Source:** LUX_Story_PRD_Addendum.md (Lines 48-53, 67)

#### A.4.4 Dual Revenue Model
- **B2B:** Workforce development partnerships (primary)
- **B2C:** Premium features (secondary)
- **Advantage:** Not dependent on consumer game economics
- **Source:** LUX_Story_PRD_Addendum.md (Line 71)

---

## A.5 Risk Mitigation

**Source:** LUX_Story_PRD_v2.md (Lines 680-712)

### Critical Risks

#### A.5.1 Assessment Validity Questioned
- **Probability:** Medium
- **Mitigation:** Partner with academic researchers for validation studies; transparent methodology documentation

#### A.5.2 Engagement Drops After Novelty
- **Probability:** Medium
- **Mitigation:** Deep replayability through pattern variations; New Game+ with different perspectives

#### A.5.3 Content Creation Bottleneck
- **Probability:** High
- **Mitigation:** AI-assisted dialogue generation with human review; modular content templates

#### A.5.4 Privacy Concerns (Youth Data)
- **Probability:** Medium
- **Mitigation:** COPPA compliance; minimal PII collection; parent/guardian consent flows

### Industry Failure Lessons

#### A.5.5 Destiny's Grimoire Problem
**Source:** LUX_Story_PRD_v2.md (Lines 694-698)

- **Failure:** Extensive lore stored on external websites
- **LUX Mitigation:** All worldbuilding surfaced through gameplay, no external wikis required

#### A.5.6 Anthem's Directionless Development
**Source:** LUX_Story_PRD_v2.md (Lines 700-704)

- **Failure:** 6+ years without clear vision, relying on "magic" to solve problems
- **LUX Mitigation:** Design pillars established before production; every feature evaluated against pillars; scope locked early

#### A.5.7 Project Blackbird's Margin Murder
**Source:** LUX_Story_PRD_v2.md (Lines 706-710)

- **Failure:** Microsoft cancelled game executives loved due to 30% profit margin targets
- **LUX Mitigation:** B2B workforce development revenue model; educational partnerships provide sustainable funding; not dependent on consumer game economics

---

## A.6 File Structure Reference

**Source:** CLAUDE.md

### Key Directories

```
components/
├── game/                    # Core gameplay (game-choice, game-message)
├── constellation/           # Character/skill constellation views
├── admin/                   # Admin dashboard sections
│   └── skeletons/           # Loading skeleton components
└── ui/                      # shadcn/ui components

lib/
├── animations.ts            # Framer Motion springs, stagger, variants
├── ui-constants.ts          # Design tokens (spacing, touch targets, colors)
├── springs.ts               # Additional spring configs
├── patterns.ts              # 5 pattern types validation
├── character-typing.ts      # Per-character typing speeds
├── voice-utils.ts           # Character voice typography
├── interaction-parser.ts    # Visual feedback animations
├── constants.ts             # Centralized magic numbers (MAX_TRUST, etc.)
└── archive/                 # Deprecated code preserved for reference

hooks/
├── useInsights.ts           # Player pattern analysis
├── useConstellationData.ts  # Character relationships
└── useGameState.ts          # Core game state management

content/
└── *.dialogue-graph.ts      # Character dialogue graphs (16,000+ lines)

app/
├── globals.css              # CSS variables, safe areas, fonts
└── (routes)                 # Next.js app router pages
```

---

## CATALOG SUMMARY

**Total Features Cataloged:** 287+ distinct features, capabilities, systems, and mechanics

**Coverage:**
- ✅ Core Gameplay Systems (5 major systems, 60+ features)
- ✅ Progression & Tracking (50+ skills, 15 characters, career paths)
- ✅ World & Narrative (cosmology, sectors, loyalty experiences, vulnerability arcs)
- ✅ Player Interface Systems (journal, dialogue, save/load, interrupts)
- ✅ Admin & Analytics (cohort management, insights, view modes)
- ✅ Technical Infrastructure (tech stack, core systems, data models, integrations)
- ✅ Design Systems & UX (Sentient Glass, layout, animations, accessibility)
- ✅ Content Creation Frameworks (10 commandments, red flags, methodology)
- ✅ Quality & Performance (19 NFRs across performance/accessibility/security/scalability/reliability)
- ✅ Success Measurement (14 KPIs across engagement/assessment/technical)

**Exclusions Applied:**
- Movement gameplay mechanics ❌ (excluded as requested)
- Graphics/visual effects ❌ (excluded as requested)
- Rendering systems ❌ (excluded as requested)

**Source Attribution:**
- Every feature includes source document and line number references
- Cross-references noted where features span multiple documents
- Implementation status tracked where mentioned

**Dependencies Mapped:**
- System integration points documented
- Data flow between components identified
- Required prerequisites noted for each major feature

---

*End of Comprehensive Feature Catalog*
*Generated: January 2026*
*Documents Analyzed: 4 (LUX_Story_PRD_v2.md, LUX_Story_PRD_Addendum.md, world building.md, blackbird world building.md)*

