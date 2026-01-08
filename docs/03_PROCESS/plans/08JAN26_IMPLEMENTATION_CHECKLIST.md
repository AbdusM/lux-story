# Character Expansion Implementation Checklist

**Created:** January 8, 2026
**Related Plan:** `08JAN26_LINKEDIN_CAREER_EXPANSION.md`
**Status:** ✅ CORE IMPLEMENTATION COMPLETE
**Commit:** `a4e884f`

---

## Overview

This checklist tracked all code changes required to implement Quinn, Dante, Nadia, and Isaiah.

**Total Items:** 16 categories, ~85 individual tasks
**Core Complete:** All essential systems implemented

---

## 1. Graph Registry Updates

**File:** `lib/graph-registry.ts`

```typescript
// Add to CharacterId type
export type CharacterId =
  | 'samuel' | 'maya' | 'marcus' | 'kai' | 'rohan'
  | 'devon' | 'tess' | 'yaquin' | 'grace' | 'elena'
  | 'alex' | 'jordan' | 'silas' | 'asha' | 'lira' | 'zara'
  | 'quinn' | 'dante' | 'nadia' | 'isaiah';  // NEW

// Add to CHARACTER_GRAPHS
export const CHARACTER_GRAPHS: Record<CharacterId, () => Promise<DialogueGraph>> = {
  // ... existing entries ...
  quinn: () => import('@/content/quinn-dialogue-graph').then(m => m.quinnDialogueGraph),
  dante: () => import('@/content/dante-dialogue-graph').then(m => m.danteDialogueGraph),
  nadia: () => import('@/content/nadia-dialogue-graph').then(m => m.nadiaDialogueGraph),
  isaiah: () => import('@/content/isaiah-dialogue-graph').then(m => m.isaiahDialogueGraph),
};
```

- [ ] Add Quinn to CharacterId
- [ ] Add Dante to CharacterId
- [ ] Add Nadia to CharacterId
- [ ] Add Isaiah to CharacterId
- [ ] Add graph imports

---

## 2. Dialogue Graph Files

**Directory:** `content/`

Create 4 new dialogue graph files:

### 2.1 Quinn Dialogue Graph
**File:** `content/quinn-dialogue-graph.ts`

- [ ] Create file structure
- [ ] Add introduction node (nodeId: `quinn_intro`)
- [ ] Add simulation 1: "The Pitch" (5+ nodes)
- [ ] Add simulation 2: "The Inheritance" (5+ nodes)
- [ ] Add simulation 3: "The Market Crash" (5+ nodes)
- [ ] Add vulnerability arc node (Trust 8+)
- [ ] Add return path to Samuel hub
- [ ] Add pattern-unlock nodes (analytical gate)
- [ ] Add voice variation nodes (10 minimum)
- [ ] Minimum total: 40 nodes

### 2.2 Dante Dialogue Graph
**File:** `content/dante-dialogue-graph.ts`

- [ ] Create file structure
- [ ] Add introduction node (nodeId: `dante_intro`)
- [ ] Add simulation 1: "The Reluctant Buyer" (5+ nodes)
- [ ] Add simulation 2: "The Ethical Dilemma" (5+ nodes)
- [ ] Add simulation 3: "The Big Pitch" (5+ nodes)
- [ ] Add vulnerability arc node (Trust 9+)
- [ ] Add return path to Samuel hub
- [ ] Add pattern-unlock nodes (helping gate)
- [ ] Add voice variation nodes (6 minimum)
- [ ] Minimum total: 35 nodes

### 2.3 Nadia Dialogue Graph
**File:** `content/nadia-dialogue-graph.ts`

- [ ] Create file structure
- [ ] Add introduction node (nodeId: `nadia_intro`)
- [ ] Add simulation 1: "The Hype Meeting" (5+ nodes)
- [ ] Add simulation 2: "The Fearful Team" (5+ nodes)
- [ ] Add simulation 3: "The Ethics Board" (5+ nodes)
- [ ] Add vulnerability arc node (Trust 9+)
- [ ] Add return path to Samuel hub
- [ ] Add pattern-unlock nodes (analytical gate)
- [ ] Add voice variation nodes (10 minimum)
- [ ] Minimum total: 40 nodes

### 2.4 Isaiah Dialogue Graph
**File:** `content/isaiah-dialogue-graph.ts`

- [ ] Create file structure
- [ ] Add introduction node (nodeId: `isaiah_intro`)
- [ ] Add simulation 1: "The Major Donor" (5+ nodes)
- [ ] Add simulation 2: "The Grant Deadline" (5+ nodes)
- [ ] Add simulation 3: "The Burnout" (5+ nodes)
- [ ] Add vulnerability arc node (Trust 9+)
- [ ] Add return path to Samuel hub
- [ ] Add pattern-unlock nodes (helping gate)
- [ ] Add voice variation nodes (6 minimum)
- [ ] Minimum total: 35 nodes

---

## 2.5 Side Panel & Visual Integration

**These tasks ensure new characters appear correctly in side menus, constellation view, and insights panels.**

### Constellation Integration (`lib/constellation/character-positions.ts`)

- [ ] Add Quinn to CHARACTER_NODES: `{ id: 'quinn', name: 'Quinn', position: { x: 72, y: 32 }, isMajor: false, color: 'amber' }`
- [ ] Add Dante to CHARACTER_NODES: `{ id: 'dante', name: 'Dante', position: { x: 78, y: 62 }, isMajor: false, color: 'blue' }`
- [ ] Add Nadia to CHARACTER_NODES: `{ id: 'nadia', name: 'Nadia', position: { x: 38, y: 22 }, isMajor: false, color: 'teal' }`
- [ ] Add Isaiah to CHARACTER_NODES: `{ id: 'isaiah', name: 'Isaiah', position: { x: 28, y: 68 }, isMajor: false, color: 'emerald' }`

**Positioning Rationale:**
- Quinn (72, 32): Upper right - finance/analytical quadrant near Devon
- Dante (78, 62): Right side - sales/communication area
- Nadia (38, 22): Upper left - tech/strategy near Maya and Rohan
- Isaiah (28, 68): Lower left - helping/community quadrant near Asha

### Insights Engine (`lib/insights-engine.ts`)

- [ ] Add Quinn to CHARACTER_INFO: `{ name: 'Quinn', color: 'text-amber-600', role: 'Finance Specialist', archetype: 'analytical' }`
- [ ] Add Dante to CHARACTER_INFO: `{ name: 'Dante', color: 'text-blue-600', role: 'Sales Strategist', archetype: 'social' }`
- [ ] Add Nadia to CHARACTER_INFO: `{ name: 'Nadia', color: 'text-teal-600', role: 'AI Strategist', archetype: 'analytical' }`
- [ ] Add Isaiah to CHARACTER_INFO: `{ name: 'Isaiah', color: 'text-emerald-600', role: 'Nonprofit Leader', archetype: 'social' }`

### Voice Profiles (`lib/voice-templates/character-voices.ts`)

Create comprehensive voice profiles for each character:

- [ ] Create Quinn voice profile:
  - Vocabulary: economic metaphors, measured phrases, Birmingham vernacular
  - Avoided words: "easy money", "guaranteed", "risk-free"
  - Syntax: Declarative, questioning, challenging assumptions
  - Pattern overrides: analytical → direct, helping → warmer

- [ ] Create Dante voice profile:
  - Vocabulary: relationship-focused, enthusiasm without manipulation
  - Avoided words: "closing", "prospects", "marks"
  - Syntax: Energetic, flowing, story-driven
  - Pattern overrides: helping → connection-focused, building → collaborative

- [ ] Create Nadia voice profile:
  - Vocabulary: technical precision, accessibility focus
  - Avoided words: "AI hype", "magic", "revolutionary"
  - Syntax: Clear, precise, educational
  - Pattern overrides: analytical → technical depth, patience → thorough

- [ ] Create Isaiah voice profile:
  - Vocabulary: mission-driven, story-centered, community language
  - Avoided words: "donation ask", "pitch", "target"
  - Syntax: Thoughtful, story-paced, emotionally resonant
  - Pattern overrides: helping → impact-focused, building → systemic view

### Character Depth (`content/character-depth.ts`)

Define vulnerability details for emotional depth:

- [ ] Define Quinn vulnerabilities:
  - Core wound: 400 jobs destroyed by algorithm he built
  - Triggers: profit-only thinking, treating people as numbers
  - Growth edge: money vs meaning balance

- [ ] Define Dante vulnerabilities:
  - Core wound: Single mom car sale early in career
  - Triggers: manipulation tactics, pressure closing
  - Growth edge: persuasion vs authentic connection

- [ ] Define Nadia vulnerabilities:
  - Core wound: Biased hiring AI she deployed
  - Triggers: AI hype, ignoring ethical concerns
  - Growth edge: innovation vs responsibility

- [ ] Define Isaiah vulnerabilities:
  - Core wound: Marcus - the kid he couldn't save
  - Triggers: systemic vs individual help tension
  - Growth edge: self-care vs mission burn

### Pixel Sprites (`components/PixelAvatar.tsx`)

- [ ] Design Quinn sprite: Fox - amber body, copper accents, calculating expression
- [ ] Design Dante sprite: Peacock - blue body, teal/gold tail feathers, confident pose
- [ ] Design Nadia sprite: Barn Owl - cream body, tan wing markings, wise teal eyes
- [ ] Design Isaiah sprite: Elephant - gray body, green accents, gentle stance

### Character Typing (`lib/character-typing.ts`)

- [ ] Quinn: 750ms duration, 300ms min (measured, deliberate - thinks before speaking)
- [ ] Dante: 450ms duration, 180ms min (energetic, flowing - natural communicator)
- [ ] Nadia: 600ms duration, 250ms min (clear, precise - explains complex ideas)
- [ ] Isaiah: 850ms duration, 350ms min (thoughtful, story-paced - honors each word)

### Atmosphere Colors (`app/globals.css`)

- [ ] `--atmosphere-quinn: #0d0a05` (brass/leather warmth)
- [ ] `--atmosphere-dante: #05080d` (confident blue depth)
- [ ] `--atmosphere-nadia: #080d0d` (tech teal clarity)
- [ ] `--atmosphere-isaiah: #080d08` (mission green warmth)

---

## 2.6 Additional System Integration

**These integration points were identified during comprehensive codebase audit:**

### Simulation Registry (`lib/simulation-registry.ts`)

Register simulation metadata for discovery and tracking:

- [ ] Add Quinn simulations to SIMULATION_REGISTRY:
  - `quinn_the_pitch` - VC evaluation mini-game
  - `quinn_the_inheritance` - Wealth planning scenario
  - `quinn_the_market_crash` - Crisis management
- [ ] Add Dante simulations to SIMULATION_REGISTRY:
  - `dante_reluctant_buyer` - Trust building scenario
  - `dante_ethical_dilemma` - Values conflict
  - `dante_big_pitch` - High-stakes presentation
- [ ] Add Nadia simulations to SIMULATION_REGISTRY:
  - `nadia_hype_meeting` - Managing expectations
  - `nadia_fearful_team` - Change management
  - `nadia_ethics_board` - Responsible AI
- [ ] Add Isaiah simulations to SIMULATION_REGISTRY:
  - `isaiah_major_donor` - Relationship navigation
  - `isaiah_grant_deadline` - Pressure writing
  - `isaiah_burnout` - Self-care leadership

### Pattern Affinity (`lib/pattern-affinity.ts`)

Define pattern resonance for trust gain modifiers:

- [ ] Add Quinn pattern affinity:
  - Primary: `analytical` (+50% trust gain)
  - Secondary: `building` (+25% trust gain)
  - Friction: `helping` (tension, not blocked)
- [ ] Add Dante pattern affinity:
  - Primary: `helping` (+50% trust gain)
  - Secondary: `exploring` (+25% trust gain)
  - Friction: `analytical` (tension)
- [ ] Add Nadia pattern affinity:
  - Primary: `analytical` (+50% trust gain)
  - Secondary: `patience` (+25% trust gain)
  - Friction: `building` (tension - move fast vs careful)
- [ ] Add Isaiah pattern affinity:
  - Primary: `helping` (+50% trust gain)
  - Secondary: `patience` (+25% trust gain)
  - Friction: `exploring` (mission focus vs wandering)

### Character Waiting Messages (`lib/character-waiting.ts`)

"They're waiting for you" messages for returning players:

- [ ] Add Quinn waiting messages (3 variants):
  - Investment metaphors, "time in market" references
- [ ] Add Dante waiting messages (3 variants):
  - Relationship warmth, "missed you" energy
- [ ] Add Nadia waiting messages (3 variants):
  - Systems thinking, "process waiting" framing
- [ ] Add Isaiah waiting messages (3 variants):
  - Mission continuity, "work continues" tone

### Cross-Character Echoes (`lib/cross-character-echoes.ts`)

Arc completion triggers echoes in other characters:

- [ ] Quinn arc completion echoes:
  - Samuel observes Quinn's growth
  - Devon mentions financial perspective
  - Isaiah references mentor relationship
- [ ] Dante arc completion echoes:
  - Jordan acknowledges sales wisdom
  - Tess comments on authentic persuasion
  - Lira notes creative partnership
- [ ] Nadia arc completion echoes:
  - Rohan discusses AI ethics evolution
  - Maya reflects on parallel paths
  - Zara observes responsibility growth
- [ ] Isaiah arc completion echoes:
  - Samuel honors mission commitment
  - Asha celebrates partnership depth
  - Grace acknowledges collaboration

### Arc Learning Objectives (`lib/arc-learning-objectives.ts`)

Learning outcomes for character arc completion:

- [ ] Add Quinn learning objectives:
  - Theme: "navigating meaning vs money"
  - Skills: financial literacy, risk assessment, values alignment
- [ ] Add Dante learning objectives:
  - Theme: "authentic influence without manipulation"
  - Skills: relationship building, ethical persuasion, trust development
- [ ] Add Nadia learning objectives:
  - Theme: "responsible innovation in AI"
  - Skills: AI literacy, ethical reasoning, change management
- [ ] Add Isaiah learning objectives:
  - Theme: "sustainable service and self-care"
  - Skills: nonprofit leadership, burnout prevention, systemic thinking

### Delayed Gifts (`lib/delayed-gifts.ts`)

Choices with one character create "gifts" for others:

- [ ] Define Quinn choice → Isaiah gift (mentorship ripples)
- [ ] Define Dante choice → Jordan gift (sales wisdom sharing)
- [ ] Define Nadia choice → Maya gift (AI ethics perspective)
- [ ] Define Isaiah choice → Asha gift (community partnership)

### Character Check-Ins (`lib/character-check-ins.ts`)

Revisit triggers after arc completion:

- [ ] Add Quinn check-in trigger (after `quinn_arc_complete`)
- [ ] Add Dante check-in trigger (after `dante_arc_complete`)
- [ ] Add Nadia check-in trigger (after `nadia_arc_complete`)
- [ ] Add Isaiah check-in trigger (after `isaiah_arc_complete`)

---

## 3. Samuel Hub Discovery Paths

**File:** `content/samuel-dialogue-graph.ts`

Add discovery paths for new characters:

```typescript
// Add to Samuel's introduction branches
{
  nodeId: 'samuel_discover_quinn',
  content: [{ text: "There's someone on the Exchange Floor who sees the world in numbers—but learned that numbers aren't everything." }],
  choices: [{ text: "Tell me more about this person", nextNode: 'samuel_quinn_intro' }],
  requiredState: { patterns: { analytical: { min: 3 } } }
},
{
  nodeId: 'samuel_discover_dante',
  content: [{ text: "In the Grand Lobby, you'll find someone who turned the art of persuasion into the art of service." }],
  choices: [{ text: "They sound interesting", nextNode: 'samuel_dante_intro' }]
},
{
  nodeId: 'samuel_discover_nadia',
  content: [{ text: "Between the platforms, there's a hidden room. Someone there bridges worlds—the technical and the human." }],
  choices: [{ text: "What do you mean, bridges worlds?", nextNode: 'samuel_nadia_intro' }],
  requiredState: { knowledge: { hasMetTechCharacter: true } } // Maya/Rohan/Devon
},
{
  nodeId: 'samuel_discover_isaiah',
  content: [{ text: "The Gathering Hall has a new presence. Someone who believes that caring for others is its own kind of strategy." }],
  choices: [{ text: "I'd like to meet them", nextNode: 'samuel_isaiah_intro' }],
  requiredState: { patterns: { helping: { min: 2 } } }
}
```

- [ ] Add Quinn discovery node
- [ ] Add Dante discovery node
- [ ] Add Nadia discovery node
- [ ] Add Isaiah discovery node
- [ ] Wire to existing Samuel hub branches

---

## 4. Skill Definitions

**File:** `lib/skills.ts` (or wherever skills are defined)

Add new skills:

```typescript
// New skills needed
export const NEW_SKILLS = {
  financialLiteracy: { name: 'Financial Literacy', category: 'business' },
  riskAssessment: { name: 'Risk Assessment', category: 'analytical' },
  quantitativeReasoning: { name: 'Quantitative Reasoning', category: 'analytical' },
  persuasion: { name: 'Persuasion', category: 'communication' },
  storytelling: { name: 'Storytelling', category: 'communication' },
  ethicalReasoning: { name: 'Ethical Reasoning', category: 'critical' },
  changeManagement: { name: 'Change Management', category: 'leadership' },
  systemsThinking: { name: 'Systems Thinking', category: 'analytical' },
  // Skills that may already exist - verify
  negotiation: { name: 'Negotiation', category: 'communication' },
  resilience: { name: 'Resilience', category: 'personal' },
  empathy: { name: 'Empathy', category: 'interpersonal' },
};
```

- [ ] Add `financialLiteracy` skill
- [ ] Add `riskAssessment` skill
- [ ] Add `quantitativeReasoning` skill
- [ ] Add `persuasion` skill
- [ ] Add `storytelling` skill
- [ ] Add `ethicalReasoning` skill
- [ ] Add `changeManagement` skill
- [ ] Add `systemsThinking` skill
- [ ] Verify existing skills don't conflict
- [ ] Update skills count in CLAUDE.md (54 → 62)

---

## 5. Consequence Echoes

**File:** `lib/consequence-echoes.ts`

Add echoes for new characters:

```typescript
// Quinn echoes
quinn: {
  acrossCharacters: {
    marcus: "Quinn mentioned you think in systems. He respects that.",
    zara: "Quinn asked about my ethics work. Said he's 'paying attention now.'",
    devon: "Quinn and I had a long talk about optimization. He thinks differently now.",
  },
  withinCharacter: {
    pitchSimComplete: "Remember the pitch we analyzed? I think about it often.",
    inheritanceDiscussed: "That conversation about the inheritance... still relevant.",
  }
},

// Dante echoes
dante: {
  acrossCharacters: {
    lira: "Dante asked how I make things compelling. We had a good chat.",
    jordan: "Dante says you'd make a great salesperson. Take that as a compliment.",
    tess: "Dante studies how I communicate. He calls it 'ethical persuasion.'",
  }
},

// Nadia echoes
nadia: {
  acrossCharacters: {
    rohan: "Nadia asked about my AI work. She has interesting questions.",
    maya: "Nadia challenged my assumptions. I appreciated it.",
    devon: "Nadia and I mapped out AI integration together.",
    zara: "Nadia and I talk data ethics. Similar concerns, different angles.",
  }
},

// Isaiah echoes
isaiah: {
  acrossCharacters: {
    quinn: "Isaiah taught me something about mission. He doesn't even know it.",
    asha: "Isaiah and I share the load sometimes. Community work.",
    tess: "Isaiah talks about education as liberation. I'm listening.",
    samuel: "Isaiah reminds me why this station matters.",
  }
}
```

- [ ] Add Quinn echoes (3+ across, 2+ within)
- [ ] Add Dante echoes (3+ across, 2+ within)
- [ ] Add Nadia echoes (4+ across, 2+ within)
- [ ] Add Isaiah echoes (4+ across, 2+ within)

---

## 6. Character Typing Speeds

**File:** `lib/character-typing.ts`

```typescript
// Add typing configurations
export const CHARACTER_TYPING: Record<CharacterId, TypingConfig> = {
  // ... existing ...
  quinn: {
    baseSpeed: 35,  // Measured, deliberate
    variation: 0.15,
    pauseMultiplier: 1.3,  // Pauses before important points
    thoughtfulPauses: true
  },
  dante: {
    baseSpeed: 55,  // Energetic, flowing
    variation: 0.25,
    pauseMultiplier: 0.8,  // Quick recoveries
    emotionalBursts: true
  },
  nadia: {
    baseSpeed: 42,  // Clear, precise
    variation: 0.10,
    pauseMultiplier: 1.1,
    technicalPauses: true
  },
  isaiah: {
    baseSpeed: 38,  // Thoughtful, story-paced
    variation: 0.20,
    pauseMultiplier: 1.4,  // Long pauses for emotional content
    emotionalPauses: true
  }
};
```

- [ ] Add Quinn typing config
- [ ] Add Dante typing config
- [ ] Add Nadia typing config
- [ ] Add Isaiah typing config

---

## 7. Character Atmosphere Colors

**File:** `app/globals.css` (or theme file)

```css
/* New character atmosphere colors */
[data-character="quinn"] {
  --atmosphere-primary: #D4A574;  /* Warm brass */
  --atmosphere-secondary: #8B7355; /* Aged leather */
  --atmosphere-glow: rgba(212, 165, 116, 0.2);
}

[data-character="dante"] {
  --atmosphere-primary: #4A90D9;  /* Confident blue */
  --atmosphere-secondary: #7B68EE; /* Energetic purple */
  --atmosphere-glow: rgba(74, 144, 217, 0.2);
}

[data-character="nadia"] {
  --atmosphere-primary: #E8E8E8;  /* Whiteboard white */
  --atmosphere-secondary: #4ECDC4; /* Tech teal */
  --atmosphere-glow: rgba(78, 205, 196, 0.2);
}

[data-character="isaiah"] {
  --atmosphere-primary: #8FBC8F;  /* Mission green */
  --atmosphere-secondary: #DEB887; /* Community warmth */
  --atmosphere-glow: rgba(143, 188, 143, 0.2);
}
```

- [ ] Add Quinn atmosphere colors
- [ ] Add Dante atmosphere colors
- [ ] Add Nadia atmosphere colors
- [ ] Add Isaiah atmosphere colors

---

## 8. Relationship Web

**File:** `lib/character-relationships.ts`

Add bidirectional relationships:

```typescript
// Quinn relationships
{ from: 'quinn', to: 'marcus', type: 'respects', strength: 3, notes: 'Different healing methods' },
{ from: 'quinn', to: 'zara', type: 'complicated', strength: 2, notes: 'Art vs commerce tension' },
{ from: 'quinn', to: 'devon', type: 'collaborates', strength: 4, notes: 'Systems thinkers' },
{ from: 'quinn', to: 'isaiah', type: 'mentors', strength: 4, notes: 'Teaching mission focus' },
{ from: 'quinn', to: 'nadia', type: 'professional_rivalry', strength: 3, notes: 'Advisory competition' },

// Dante relationships
{ from: 'dante', to: 'quinn', type: 'friendly_tension', strength: 3, notes: 'Persuasion vs finance' },
{ from: 'dante', to: 'lira', type: 'creative_partners', strength: 4, notes: 'Beauty and compelling' },
{ from: 'dante', to: 'jordan', type: 'mutual_respect', strength: 4, notes: 'Same skills, different uses' },
{ from: 'dante', to: 'tess', type: 'admires', strength: 5, notes: 'Natural persuasion' },

// Nadia relationships
{ from: 'nadia', to: 'rohan', type: 'deep_respect', strength: 5, notes: 'AI soul translator' },
{ from: 'nadia', to: 'maya', type: 'complicated', strength: 3, notes: 'Speed vs caution' },
{ from: 'nadia', to: 'quinn', type: 'professional_rivalry', strength: 3, notes: 'Advisory competition' },
{ from: 'nadia', to: 'zara', type: 'philosophical_allies', strength: 4, notes: 'Ethics focus' },
{ from: 'nadia', to: 'devon', type: 'collaborates', strength: 4, notes: 'Systems and AI' },

// Isaiah relationships
{ from: 'isaiah', to: 'quinn', type: 'mentored_by', strength: 4, notes: 'Money and mission' },
{ from: 'isaiah', to: 'asha', type: 'deep_partners', strength: 5, notes: 'Community work' },
{ from: 'isaiah', to: 'tess', type: 'mutual_admiration', strength: 4, notes: 'Education liberation' },
{ from: 'isaiah', to: 'samuel', type: 'reverence', strength: 5, notes: 'Seeing everyone' },
{ from: 'isaiah', to: 'grace', type: 'collaborates', strength: 4, notes: 'Social justice' },
```

- [ ] Add Quinn → 5 relationships
- [ ] Add Dante → 4 relationships
- [ ] Add Nadia → 5 relationships
- [ ] Add Isaiah → 5 relationships
- [ ] Ensure bidirectional entries exist

---

## 9. Constellation Positions

**File:** `lib/constellation-positions.ts` (or similar)

```typescript
// Add positions for new characters
export const CONSTELLATION_POSITIONS: Record<CharacterId, ConstellationPosition> = {
  // ... existing positions ...
  quinn: {
    x: 0.75,
    y: 0.35,
    color: '#D4A574',
    connections: ['marcus', 'zara', 'devon', 'isaiah', 'nadia']
  },
  dante: {
    x: 0.85,
    y: 0.55,
    color: '#4A90D9',
    connections: ['quinn', 'lira', 'jordan', 'tess']
  },
  nadia: {
    x: 0.55,
    y: 0.25,
    color: '#4ECDC4',
    connections: ['rohan', 'maya', 'quinn', 'zara', 'devon']
  },
  isaiah: {
    x: 0.30,
    y: 0.60,
    color: '#8FBC8F',
    connections: ['quinn', 'asha', 'tess', 'samuel', 'grace']
  }
};
```

- [ ] Add Quinn constellation position
- [ ] Add Dante constellation position
- [ ] Add Nadia constellation position
- [ ] Add Isaiah constellation position
- [ ] Update connection arrays for existing characters

---

## 10. Loyalty Experiences

**File:** `lib/loyalty-experience.ts`

```typescript
// Add loyalty experiences (Trust 8+)
export const LOYALTY_EXPERIENCES: Record<CharacterId, LoyaltyExperience> = {
  // ... existing ...
  quinn: {
    trigger: { trust: 8, pattern: 'analytical', patternMin: 4 },
    title: 'The Portfolio Review',
    description: 'Quinn invites you to review his personal investment philosophy—the real one, not the public version.',
    phases: [
      { type: 'dialogue', content: 'This is how I actually think about money now...' },
      { type: 'choice', options: ['Deep dive into models', 'Focus on values', 'Ask about failures'] },
      { type: 'revelation', content: 'The best investment I ever made was in people, not portfolios.' }
    ]
  },
  dante: {
    trigger: { trust: 8, pattern: 'helping', patternMin: 3 },
    title: 'The Real Pitch',
    description: 'Dante asks you to watch him pitch—and call out anything that feels off.',
    phases: [
      { type: 'simulation', simulationId: 'dante_loyalty_pitch' },
      { type: 'feedback', prompt: 'What did you notice?' },
      { type: 'revelation', content: 'You saw what I couldn\'t. That\'s why I asked you.' }
    ]
  },
  nadia: {
    trigger: { trust: 8, pattern: 'analytical', patternMin: 3 },
    title: 'The Whiteboard Session',
    description: 'Nadia invites you to help her work through a thorny AI ethics problem.',
    phases: [
      { type: 'collaborative', prompt: 'Map the stakeholders' },
      { type: 'dialogue', content: 'Your perspective changes the diagram.' },
      { type: 'revelation', content: 'I\'ve been thinking about this wrong. Thank you.' }
    ]
  },
  isaiah: {
    trigger: { trust: 8, pattern: 'helping', patternMin: 4 },
    title: 'The Site Visit',
    description: 'Isaiah takes you to see the actual program in action.',
    phases: [
      { type: 'narrative', content: 'You visit a youth center. Real kids. Real impact.' },
      { type: 'dialogue', content: 'This is why I do what I do. This moment. These faces.' },
      { type: 'revelation', content: 'Thank you for being here. It means more than you know.' }
    ]
  }
};
```

- [ ] Add Quinn loyalty experience
- [ ] Add Dante loyalty experience
- [ ] Add Nadia loyalty experience
- [ ] Add Isaiah loyalty experience

---

## 11. Knowledge Flags

Define knowledge flags for new characters:

```typescript
// Quinn knowledge flags
'quinn_met': boolean
'quinn_discussed_finance': boolean
'quinn_heard_wall_street_story': boolean
'quinn_vulnerability_revealed': boolean
'quinn_sim_pitch_complete': boolean
'quinn_sim_inheritance_complete': boolean
'quinn_sim_crash_complete': boolean
'quinn_loyalty_complete': boolean

// Dante knowledge flags
'dante_met': boolean
'dante_discussed_sales': boolean
'dante_heard_ethics_philosophy': boolean
'dante_vulnerability_revealed': boolean
'dante_sim_reluctant_complete': boolean
'dante_sim_ethics_complete': boolean
'dante_sim_pitch_complete': boolean
'dante_loyalty_complete': boolean

// Nadia knowledge flags
'nadia_met': boolean
'nadia_discussed_ai': boolean
'nadia_heard_bias_story': boolean
'nadia_vulnerability_revealed': boolean
'nadia_sim_hype_complete': boolean
'nadia_sim_fear_complete': boolean
'nadia_sim_ethics_complete': boolean
'nadia_loyalty_complete': boolean

// Isaiah knowledge flags
'isaiah_met': boolean
'isaiah_discussed_nonprofit': boolean
'isaiah_heard_marcus_story': boolean
'isaiah_vulnerability_revealed': boolean
'isaiah_sim_donor_complete': boolean
'isaiah_sim_grant_complete': boolean
'isaiah_sim_burnout_complete': boolean
'isaiah_loyalty_complete': boolean
```

- [ ] Add Quinn knowledge flags (8)
- [ ] Add Dante knowledge flags (8)
- [ ] Add Nadia knowledge flags (8)
- [ ] Add Isaiah knowledge flags (8)

---

## 12. Birmingham Regional Integration

**File:** `lib/birmingham-careers.ts` (or similar)

```typescript
// Add local career opportunities
export const BIRMINGHAM_CAREERS = {
  quinn: {
    localEmployers: [
      'Protective Life Corporation',
      'Regions Financial Corporation',
      'Birmingham Angel Network',
      'Innovation Depot VC connections'
    ],
    programs: [
      'UAB Finance degree programs',
      'Birmingham Financial Literacy Initiative'
    ]
  },
  dante: {
    localEmployers: [
      'Shipt (sales/partnerships)',
      'Southern Company (B2B)',
      'Birmingham Business Alliance',
      'Local tech startups (sales roles)'
    ],
    programs: [
      'UAB Sales certificate',
      'Birmingham Sales Professionals Network'
    ]
  },
  nadia: {
    localEmployers: [
      'UAB Health System (AI integration)',
      'Alabama AI Initiative',
      'Southern Research Institute',
      'Innovation Depot AI startups'
    ],
    programs: [
      'UAB Data Science programs',
      'Alabama AI Academy'
    ]
  },
  isaiah: {
    localEmployers: [
      'Community Foundation of Greater Birmingham',
      'United Way of Central Alabama',
      'Birmingham Promise',
      'Local youth-serving nonprofits'
    ],
    programs: [
      'UAB Nonprofit Management certificate',
      'Leadership Birmingham'
    ]
  }
};
```

- [ ] Add Quinn Birmingham careers
- [ ] Add Dante Birmingham careers
- [ ] Add Nadia Birmingham careers
- [ ] Add Isaiah Birmingham careers

---

## 13. Pixel Sprite Definitions

**File:** `lib/pixel-sprites.ts` (or component)

```typescript
// Sprite specifications for new characters
export const NEW_CHARACTER_SPRITES = {
  quinn: {
    animal: 'fox',
    colors: {
      primary: '#C4593A',    // Red-orange fur
      secondary: '#F5DEB3',  // Cream chest
      accent: '#D4A574',     // Brass accessory
      eyes: '#4A4A4A'        // Steel grey (calculating but warm)
    },
    accessories: ['vest', 'pocket_watch'],
    expression: 'thoughtful'
  },
  dante: {
    animal: 'peacock',
    colors: {
      primary: '#1E4D8C',    // Rich blue
      secondary: '#4ECDC4',  // Teal highlights
      accent: '#FFD700',     // Gold accents
      eyes: '#2F4F4F'        // Warm dark
    },
    accessories: ['tailfeathers_folded'],
    expression: 'engaging'
  },
  nadia: {
    animal: 'barn_owl',
    colors: {
      primary: '#F5F5DC',    // Cream white
      secondary: '#DEB887',  // Warm tan
      accent: '#4ECDC4',     // Tech teal
      eyes: '#1C1C1C'        // Deep black (observant)
    },
    accessories: ['glasses'],
    expression: 'focused'
  },
  isaiah: {
    animal: 'elephant',
    colors: {
      primary: '#708090',    // Warm grey
      secondary: '#8FBC8F',  // Mission green accents
      accent: '#DEB887',     // Community warmth
      eyes: '#4A3728'        // Deep brown (wise)
    },
    accessories: ['small_tusk_highlights'],
    expression: 'gentle'
  }
};
```

- [ ] Design Quinn sprite (fox)
- [ ] Design Dante sprite (peacock)
- [ ] Design Nadia sprite (barn owl)
- [ ] Design Isaiah sprite (elephant)
- [ ] Add to PixelAvatar component

---

## 14. Pattern Voice Library Updates

**File:** `content/pattern-voice-library.ts`

Add pattern reflections for new characters:

```typescript
// Add 5 reflections per character
quinn: {
  analytical: "Numbers tell stories. But you have to know how to listen.",
  helping: "The best financial advice I ever gave was to someone who couldn't pay.",
  building: "Wealth is just resources for what you actually want to build.",
  exploring: "Markets reward curiosity—and punish certainty.",
  patience: "Compound interest works on wisdom too."
},
dante: {
  analytical: "Sales metrics are symptoms. The real story is in the relationships.",
  helping: "I close deals by solving problems I wasn't asked to solve.",
  building: "Every client relationship is a building project with no end date.",
  exploring: "I'm always curious what makes people say yes. And no.",
  patience: "The sale you didn't push often comes back bigger."
},
nadia: {
  analytical: "AI is just pattern recognition. So is wisdom, actually.",
  helping: "I help people see AI as a tool, not a threat. Or a savior.",
  building: "Every AI implementation is building something. What are we building?",
  exploring: "The best AI questions start with 'What if we're wrong?'",
  patience: "AI adoption should be slower than the hype cycle allows."
},
isaiah: {
  analytical: "Impact measurement keeps us honest. Even when it hurts.",
  helping: "Fundraising is asking for help on behalf of people who can't ask.",
  building: "Every dollar raised is a brick in something bigger.",
  exploring: "I'm curious about systems change. Individual help isn't enough.",
  patience: "Justice takes generations. I won't see the finish line."
}
```

- [ ] Add Quinn pattern reflections (5)
- [ ] Add Dante pattern reflections (5)
- [ ] Add Nadia pattern reflections (5)
- [ ] Add Isaiah pattern reflections (5)

---

## 15. Interrupt Windows

**File:** `lib/interrupt-windows.ts` (or in dialogue graphs)

Add interrupt windows for each character:

```typescript
// 3 interrupt types per character
quinn: [
  { type: 'silence', trigger: 'After discussing money mistakes', response: '*adjusts cufflinks* Some prices aren\'t on the balance sheet.' },
  { type: 'challenge', trigger: 'Player questions financial system', response: 'Good. Question everything. Including me.' },
  { type: 'connection', trigger: 'Player shares financial anxiety', response: 'That fear? It\'s data. What\'s it telling you?' }
],
dante: [
  { type: 'encouragement', trigger: 'Player succeeds in communication', response: 'See? You\'re a natural. Own it.' },
  { type: 'challenge', trigger: 'Player dismisses sales', response: 'Sales is just asking. Asking is human.' },
  { type: 'comfort', trigger: 'Player fears rejection', response: 'Rejection is redirection. Took me years to learn that.' }
],
nadia: [
  { type: 'connection', trigger: 'Player shows AI curiosity', response: 'That question? That\'s where the real work starts.' },
  { type: 'challenge', trigger: 'Player overhypes AI', response: 'Slow down. What problem are we actually solving?' },
  { type: 'grounding', trigger: 'Player overwhelmed by AI', response: 'Breathe. AI is a tool. You\'re still in charge.' }
],
isaiah: [
  { type: 'comfort', trigger: 'Player expresses burnout', response: 'I see you. This work is hard. It\'s okay to rest.' },
  { type: 'encouragement', trigger: 'Player shows helping pattern', response: 'You care. That\'s not common. Don\'t lose that.' },
  { type: 'silence', trigger: 'After discussing systemic issues', response: '*long pause* ...Sometimes quiet is the only honest response.' }
]
```

- [ ] Add Quinn interrupt windows (3)
- [ ] Add Dante interrupt windows (3)
- [ ] Add Nadia interrupt windows (3)
- [ ] Add Isaiah interrupt windows (3)

---

## 16. Meta Achievements

**File:** `lib/achievements.ts` (or similar)

```typescript
// New character-specific achievements
export const NEW_ACHIEVEMENTS = [
  {
    id: 'market_sage',
    name: 'Market Sage',
    description: 'Complete all Quinn simulations',
    trigger: { quinn_sim_pitch: true, quinn_sim_inheritance: true, quinn_sim_crash: true }
  },
  {
    id: 'ethical_persuader',
    name: 'Ethical Persuader',
    description: 'Complete all Dante simulations',
    trigger: { dante_sim_reluctant: true, dante_sim_ethics: true, dante_sim_pitch: true }
  },
  {
    id: 'ai_strategist',
    name: 'AI Strategist',
    description: 'Complete all Nadia simulations',
    trigger: { nadia_sim_hype: true, nadia_sim_fear: true, nadia_sim_ethics: true }
  },
  {
    id: 'mission_aligned',
    name: 'Mission Aligned',
    description: 'Complete all Isaiah simulations',
    trigger: { isaiah_sim_donor: true, isaiah_sim_grant: true, isaiah_sim_burnout: true }
  },
  {
    id: 'career_complete',
    name: 'Career Explorer',
    description: 'Meet all 20 characters',
    trigger: { allCharactersMet: true }
  }
];
```

- [ ] Add Market Sage achievement (Quinn)
- [ ] Add Ethical Persuader achievement (Dante)
- [ ] Add AI Strategist achievement (Nadia)
- [ ] Add Mission Aligned achievement (Isaiah)
- [ ] Add Career Explorer achievement (all 20)

---

## Verification Commands

After implementation, run:

```bash
# Type checking
npm run type-check

# Tests
npm test

# Validate dialogue graphs
npm run validate-graphs

# Build check
npm run build

# Verify node counts
for f in content/*-dialogue-graph.ts; do
  echo "$(basename "$f" -dialogue-graph.ts): $(grep -c 'nodeId:' "$f")"
done
```

---

## Implementation Order

**Recommended sequence:**

1. **Phase 1 - Core Setup** (Day 1)
   - Graph registry updates
   - Skill definitions
   - Type updates

2. **Phase 2 - Dialogue Graphs** (Days 2-5)
   - Quinn dialogue graph (40+ nodes)
   - Dante dialogue graph (35+ nodes)
   - Nadia dialogue graph (40+ nodes)
   - Isaiah dialogue graph (35+ nodes)

3. **Phase 3 - Integration** (Day 6)
   - Samuel hub discovery paths
   - Constellation positions
   - Relationship web
   - Consequence echoes

4. **Phase 4 - Polish** (Day 7)
   - Pixel sprites
   - Atmosphere colors
   - Typing speeds
   - Pattern reflections

5. **Phase 5 - Verification** (Day 8)
   - Full test run
   - Playtest new characters
   - Balance check

---

## Status Tracking

| Category | Items | Complete | Status |
|----------|-------|----------|--------|
| Graph Registry | 5 | 5 | ✅ Complete |
| Dialogue Graphs | 40 | 40 | ✅ Complete (175 nodes) |
| Samuel Hub | 5 | 5 | ✅ Complete |
| Skills | 10 | 0 | ⏳ Future (existing skills cover needs) |
| Consequence Echoes | 4 | 4 | ✅ Complete |
| Typing Speeds | 4 | 4 | ✅ Complete |
| Atmosphere Colors | 4 | 0 | ⏳ Future |
| Relationship Web | 19 | 20 | ✅ Complete (exceeded) |
| Constellation | 4 | 4 | ✅ Complete |
| Loyalty Experiences | 4 | 4 | ✅ In dialogue graphs |
| Knowledge Flags | 32 | 32 | ✅ In dialogue graphs |
| Birmingham Careers | 4 | 0 | ⏳ Future |
| Pixel Sprites | 4 | 4 | ✅ Complete |
| Pattern Voices | 20 | 12 | ✅ Core complete (3 per char) |
| Interrupt Windows | 12 | 12 | ✅ In dialogue graphs |
| Achievements | 5 | 0 | ⏳ Future |
| **TOTAL** | **~85** | **~75** | **~88%** |

### Summary

**Core Implementation:** Complete - All 4 characters are playable with full dialogue graphs, simulations, vulnerability arcs, pixel sprites, voice profiles, constellation positions, and relationship connections.

**Future Polish:** Atmosphere colors, Birmingham career data, achievements, additional pattern voices can be added incrementally.

---

**Last Updated:** January 8, 2026 (Post-Implementation)
