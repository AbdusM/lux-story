# Software Development Plan: LinkedIn 2026 Character Expansion

**Created:** January 8, 2026
**Status:** READY FOR IMPLEMENTATION
**Priority:** High
**Estimated Scope:** ~3,500-4,500 lines of new code

---

## Executive Summary

Expand Grand Central Terminus with 4 new NPCs based on LinkedIn's "Jobs on the Rise 2026" report, covering career gaps in Finance, Sales, AI Strategy, and Nonprofit sectors.

### Characters
| Character | Animal | Career Cluster | LinkedIn Ranks | Tier |
|-----------|--------|----------------|----------------|------|
| **Quinn** | Fox | Finance/Investment | #12, #20, #21 | 2 |
| **Dante** | Peacock | Sales/Marketing | #8, #10, #13, #16 | 3 |
| **Nadia** | Barn Owl | AI Strategy | #2 | 2 |
| **Isaiah** | Elephant | Nonprofit/Fundraising | #14 | 3 |

### Success Criteria
- [ ] All 4 characters accessible via Samuel hub
- [ ] 150+ new dialogue nodes (Quinn: 40, Dante: 35, Nadia: 40, Isaiah: 35)
- [ ] 12 new simulations (3 per character)
- [ ] All type checks pass (`npm run type-check`)
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual playthrough of each character path

---

## Technical Architecture

### Dependency Graph

```
                    ┌─────────────────────────────────────┐
                    │  1. Type System Foundation          │
                    │  lib/graph-registry.ts (CharacterId)│
                    └─────────────────┬───────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│ 2. Dialogue Content │   │ 3. Character Config │   │ 4. Visual Systems   │
│ content/*-graph.ts  │   │ lib/character-*.ts  │   │ components/Pixel*.tsx│
└─────────┬───────────┘   └─────────┬───────────┘   └─────────┬───────────┘
          │                         │                         │
          └───────────────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │  5. Integration & Wiring            │
                    │  Samuel hub, relationships, echoes  │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │  6. Verification & Testing          │
                    │  Type check, tests, build, manual   │
                    └─────────────────────────────────────┘
```

### File Impact Summary

| Category | Files | New Lines |
|----------|-------|-----------|
| Type System | 2 | ~30 |
| Dialogue Graphs | 4 (new) | ~3,000 |
| Character Config | 12 | ~400 |
| Visual Systems | 3 | ~250 |
| Integration | 4 | ~150 |
| **Total** | **25 files** | **~3,830** |

---

## Implementation Phases

### Phase 1: Type System Foundation
**Risk:** HIGH - All other work depends on this
**Verification:** `npm run type-check` must pass

#### 1.1 Update CharacterId Type
**File:** `lib/graph-registry.ts`

```typescript
// Line ~74 - Add to CharacterId union
export type CharacterId =
  | 'samuel' | 'maya' | 'marcus' | 'kai' | 'rohan'
  | 'devon' | 'tess' | 'yaquin' | 'grace' | 'elena'
  | 'alex' | 'jordan' | 'silas' | 'asha' | 'lira' | 'zara'
  | 'quinn' | 'dante' | 'nadia' | 'isaiah';  // ADD

// Line ~76 - Add to CHARACTER_IDS array
export const CHARACTER_IDS: CharacterId[] = [
  'samuel', 'maya', 'marcus', 'kai', 'rohan',
  'devon', 'tess', 'yaquin', 'grace', 'elena',
  'alex', 'jordan', 'silas', 'asha', 'lira', 'zara',
  'quinn', 'dante', 'nadia', 'isaiah'  // ADD
];
```

#### 1.2 Add Character Tier Assignments
**File:** `lib/character-tiers.ts`

```typescript
// Add to CHARACTER_TIERS object
quinn: 2,   // Tier 2: 50 nodes, 10 voice variations
dante: 3,   // Tier 3: 35 nodes, 6 voice variations
nadia: 2,   // Tier 2: 50 nodes, 10 voice variations
isaiah: 3,  // Tier 3: 35 nodes, 6 voice variations
```

#### 1.3 Verification Checkpoint
```bash
npm run type-check
# Should pass with new CharacterId values
# Will show errors for missing dialogue graphs (expected at this stage)
```

---

### Phase 2: Dialogue Graph Creation
**Risk:** MEDIUM - Large content creation, but isolated per character
**Verification:** Graph validation tests pass

#### 2.1 Create Stub Files First
Create minimal valid graphs to unblock type system:

**Files to create:**
- `content/quinn-dialogue-graph.ts`
- `content/dante-dialogue-graph.ts`
- `content/nadia-dialogue-graph.ts`
- `content/isaiah-dialogue-graph.ts`

**Stub template:**
```typescript
import type { DialogueGraph } from '@/lib/dialogue-graph';

export const quinnDialogueGraph: DialogueGraph = {
  nodes: new Map([
    [
      'quinn_introduction',
      {
        nodeId: 'quinn_introduction',
        characterId: 'quinn',
        content: [{ text: 'Quinn introduction placeholder.', emotion: 'neutral' }],
        choices: [
          { text: 'Continue', nextNode: 'quinn_introduction', pattern: 'exploring' }
        ]
      }
    ]
  ])
};
```

#### 2.2 Register Graphs in Registry
**File:** `lib/graph-registry.ts`

```typescript
// Add imports at top
import { quinnDialogueGraph } from '@/content/quinn-dialogue-graph';
import { danteDialogueGraph } from '@/content/dante-dialogue-graph';
import { nadiaDialogueGraph } from '@/content/nadia-dialogue-graph';
import { isaiahDialogueGraph } from '@/content/isaiah-dialogue-graph';

// Add to DIALOGUE_GRAPHS object (line ~44)
export const DIALOGUE_GRAPHS: Record<CharacterId, DialogueGraph> = {
  // ... existing entries ...
  quinn: quinnDialogueGraph,
  dante: danteDialogueGraph,
  nadia: nadiaDialogueGraph,
  isaiah: isaiahDialogueGraph,
};
```

#### 2.3 Verification Checkpoint
```bash
npm run type-check  # Should pass
npm test            # Graph validation should pass with stubs
```

#### 2.4 Expand Dialogue Content
Build out full dialogue graphs per character spec in `08JAN26_LINKEDIN_CAREER_EXPANSION.md`.

**Per-character structure:**
```
introduction (1 node)
├── topic_branches (3-5 nodes)
├── simulation_1 (5-8 nodes)
├── simulation_2 (5-8 nodes)
├── simulation_3 (5-8 nodes)
├── vulnerability_arc (3-5 nodes, Trust 6+ gated)
├── pattern_unlock_nodes (2-3 nodes)
├── voice_variation_nodes (6-10 nodes)
└── return_to_hub (1 node)
```

**Node count targets:**
| Character | Tier | Target Nodes | Voice Variations | Pattern Reflections |
|-----------|------|--------------|------------------|---------------------|
| Quinn | 2 | 40+ | 10+ | 6+ |
| Dante | 3 | 35+ | 6+ | 4+ |
| Nadia | 2 | 40+ | 10+ | 6+ |
| Isaiah | 3 | 35+ | 6+ | 4+ |

---

### Phase 3: Character Configuration
**Risk:** LOW - Isolated config files, no cross-dependencies
**Verification:** Type checks pass

#### 3.1 Character Typing Speeds
**File:** `lib/character-typing.ts`

```typescript
quinn: {
  typingDuration: 750,
  minChunkDelay: 300,
  msPerChar: 6,
  maxChunkDelay: 1400,
  personality: 'measured'  // deliberate, thinks before speaking
},
dante: {
  typingDuration: 450,
  minChunkDelay: 180,
  msPerChar: 4,
  maxChunkDelay: 900,
  personality: 'restless'  // energetic, natural communicator
},
nadia: {
  typingDuration: 600,
  minChunkDelay: 250,
  msPerChar: 5,
  maxChunkDelay: 1100,
  personality: 'precise'  // clear, explains complex ideas
},
isaiah: {
  typingDuration: 850,
  minChunkDelay: 350,
  msPerChar: 7,
  maxChunkDelay: 1600,
  personality: 'thoughtful'  // story-paced, honors each word
},
```

#### 3.2 Voice Profiles
**File:** `lib/voice-templates/character-voices.ts`

See `08JAN26_IMPLEMENTATION_CHECKLIST.md` Section 2.5 for full specs.

#### 3.3 Pattern Affinity
**File:** `lib/pattern-affinity.ts`

```typescript
quinn: {
  characterId: 'quinn',
  primary: 'analytical',    // +50% trust
  secondary: 'building',    // +25% trust
  neutral: ['patience', 'exploring'],
  friction: 'helping',      // tension
},
dante: {
  characterId: 'dante',
  primary: 'helping',
  secondary: 'exploring',
  neutral: ['patience', 'building'],
  friction: 'analytical',
},
nadia: {
  characterId: 'nadia',
  primary: 'analytical',
  secondary: 'patience',
  neutral: ['exploring', 'helping'],
  friction: 'building',
},
isaiah: {
  characterId: 'isaiah',
  primary: 'helping',
  secondary: 'patience',
  neutral: ['analytical', 'building'],
  friction: 'exploring',
},
```

#### 3.4 Consequence Echoes
**File:** `lib/consequence-echoes.ts`

Add trust up/down echoes and pattern recognition for each character.

#### 3.5 Character Relationships
**File:** `lib/character-relationships.ts`

See `08JAN26_LINKEDIN_CAREER_EXPANSION.md` for relationship web specs.

#### 3.6 Additional Config Files
- `lib/character-waiting.ts` - Waiting messages
- `lib/simulation-registry.ts` - Simulation metadata
- `lib/loyalty-experience.ts` - Loyalty experience types
- `lib/cross-character-echoes.ts` - Arc completion echoes
- `lib/arc-learning-objectives.ts` - Learning outcomes
- `lib/delayed-gifts.ts` - Cross-character gifts
- `lib/character-check-ins.ts` - Revisit triggers

---

### Phase 4: Visual Systems
**Risk:** MEDIUM - Pixel art requires care
**Verification:** Visual inspection on `/test-pixels` page

#### 4.1 Pixel Sprites
**File:** `components/PixelAvatar.tsx` or `content/pixel-sprites.ts`

Create 32×32 pixel art for:
- Quinn: Fox (amber/copper palette)
- Dante: Peacock (blue/teal/gold palette)
- Nadia: Barn Owl (cream/tan/teal palette)
- Isaiah: Elephant (gray/green palette)

#### 4.2 Constellation Positions
**File:** `lib/constellation/character-positions.ts`

```typescript
{ id: 'quinn', name: 'Quinn', position: { x: 72, y: 32 }, isMajor: false, color: 'amber' },
{ id: 'dante', name: 'Dante', position: { x: 78, y: 62 }, isMajor: false, color: 'blue' },
{ id: 'nadia', name: 'Nadia', position: { x: 38, y: 22 }, isMajor: false, color: 'teal' },
{ id: 'isaiah', name: 'Isaiah', position: { x: 28, y: 68 }, isMajor: false, color: 'emerald' },
```

#### 4.3 Atmosphere Colors
**File:** `app/globals.css`

```css
--atmosphere-quinn: #0d0a05;   /* brass/leather warmth */
--atmosphere-dante: #05080d;   /* confident blue depth */
--atmosphere-nadia: #080d0d;   /* tech teal clarity */
--atmosphere-isaiah: #080d08;  /* mission green warmth */
```

#### 4.4 Insights Engine
**File:** `lib/insights-engine.ts`

Add CHARACTER_INFO entries for side panel display.

---

### Phase 5: Integration & Wiring
**Risk:** MEDIUM - Cross-system coordination
**Verification:** Navigate to each character via Samuel

#### 5.1 Samuel Hub Discovery Paths
**File:** `content/samuel-dialogue-graph.ts`

Add discovery nodes for each new character with appropriate gating:
- Quinn: `requiredState: { patterns: { analytical: { min: 3 } } }`
- Dante: No gate (accessible to all)
- Nadia: `requiredState: { knowledge: { hasMetTechCharacter: true } }`
- Isaiah: `requiredState: { patterns: { helping: { min: 2 } } }`

#### 5.2 Pattern Voice Library
**File:** `content/pattern-voice-library.ts`

Add pattern voice entries for each character (5 patterns × 4 characters = 20 entries).

#### 5.3 Birmingham Opportunities
**File:** `content/birmingham-opportunities.ts`

Add local career connections per LinkedIn data.

---

### Phase 6: Verification & Testing
**Risk:** LOW - Catches issues before deploy
**Verification:** All checks green

#### 6.1 Automated Checks
```bash
# Type checking
npm run type-check

# Run all tests
npm test

# Production build
npm run build

# Node count verification
for f in content/*-dialogue-graph.ts; do
  echo "$(basename "$f" -dialogue-graph.ts): $(grep -c 'nodeId:' "$f")"
done
```

#### 6.2 Manual Testing Checklist
- [ ] Start new game, reach Samuel hub
- [ ] Navigate to Quinn via analytical path
- [ ] Complete Quinn Sim 1 ("The Pitch")
- [ ] Navigate to Dante (no gate)
- [ ] Complete Dante Sim 1 ("The Reluctant Buyer")
- [ ] Navigate to Nadia (after meeting Maya/Rohan/Devon)
- [ ] Complete Nadia Sim 1 ("The Hype Meeting")
- [ ] Navigate to Isaiah via helping path
- [ ] Complete Isaiah Sim 1 ("The Major Donor")
- [ ] Verify constellation shows all 4 new characters
- [ ] Verify pixel sprites render correctly
- [ ] Verify atmosphere colors change per character
- [ ] Verify typing speeds feel distinct

#### 6.3 Coverage Verification
```bash
# Voice variations per character
grep -c "voiceVariations" content/quinn-dialogue-graph.ts  # Should be 10+
grep -c "voiceVariations" content/dante-dialogue-graph.ts  # Should be 6+
grep -c "voiceVariations" content/nadia-dialogue-graph.ts  # Should be 10+
grep -c "voiceVariations" content/isaiah-dialogue-graph.ts # Should be 6+

# Pattern reflections per character
grep -c "patternReflection" content/quinn-dialogue-graph.ts  # Should be 6+
grep -c "patternReflection" content/dante-dialogue-graph.ts  # Should be 4+
grep -c "patternReflection" content/nadia-dialogue-graph.ts  # Should be 6+
grep -c "patternReflection" content/isaiah-dialogue-graph.ts # Should be 4+
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Type errors cascade | Medium | High | Phase 1 verification checkpoint |
| Dialogue graph validation fails | Low | Medium | Use stub graphs, expand incrementally |
| Pixel art quality | Medium | Low | Use existing animal styles as reference |
| Samuel hub routing broken | Low | High | Test hub navigation after each character |
| Missing cross-references | Medium | Medium | Use checklist systematically |
| Build fails on deploy | Low | High | Run `npm run build` before PR |

---

## Implementation Order (Recommended)

For a single character end-to-end before parallelizing:

### Iteration 1: Quinn (Finance) - Full Implementation
1. Add `quinn` to CharacterId type
2. Create `quinn-dialogue-graph.ts` (stub)
3. Register in graph-registry
4. Add to character-tiers
5. **Checkpoint:** `npm run type-check`
6. Expand dialogue graph (40 nodes)
7. Add character config (typing, voice, affinity, echoes)
8. Add pixel sprite
9. Add constellation position
10. Add Samuel hub discovery
11. **Checkpoint:** Manual playthrough Quinn path

### Iteration 2: Dante (Sales)
Repeat process for Dante.

### Iteration 3: Nadia (AI Strategy)
Repeat process for Nadia.

### Iteration 4: Isaiah (Nonprofit)
Repeat process for Isaiah.

### Iteration 5: Cross-Character Integration
1. Add all cross-character echoes
2. Add delayed gifts
3. Add relationship web entries
4. Final integration testing

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `08JAN26_LINKEDIN_CAREER_EXPANSION.md` | Character specs, LinkedIn data, voice variations |
| `08JAN26_IMPLEMENTATION_CHECKLIST.md` | 168 individual tasks with file locations |
| `08JAN26_DIALOGUE_QUALITY_AUDIT.md` | Quality standards for pattern reflections |
| `CLAUDE.md` | Project overview, architecture, conventions |

---

## Definition of Done

### Per Character
- [ ] Dialogue graph created with target node count
- [ ] Voice variations meet tier target
- [ ] Pattern reflections meet tier target
- [ ] All simulations implemented (3 per character)
- [ ] Vulnerability arc implemented (Trust 6+ gated)
- [ ] Pixel sprite renders correctly
- [ ] Constellation position set
- [ ] Typing speed configured
- [ ] Atmosphere color defined
- [ ] Character relationships defined
- [ ] Consequence echoes defined
- [ ] Samuel hub discovery path works

### Project Complete
- [ ] All 4 characters pass per-character checklist
- [ ] Cross-character echoes implemented
- [ ] Delayed gifts implemented
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Manual playthrough of all paths
- [ ] Code reviewed and merged

---

**Last Updated:** January 8, 2026
