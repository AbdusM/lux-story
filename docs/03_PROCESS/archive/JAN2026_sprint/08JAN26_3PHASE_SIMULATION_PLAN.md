# 3-Phase Simulation System: Comprehensive Implementation Plan

**Date:** January 8, 2026
**Status:** IN PROGRESS (Phase A/B Complete)
**Strategic Impact:** High (Aligns w/ "Handshake Protocol" from SIMULATION_ROADMAP.md)
**Tests:** 1025/1025 passing

---

## Implementation Progress

| Phase | Status | Details |
|-------|--------|---------|
| **Phase A: Schema** | ✅ COMPLETE | SimulationConfig extended, registry updated, God Mode UI has phase dots |
| **Phase B: Shift Left** | ✅ COMPLETE | Jordan 8→2, intro choices for 6 chars, registry synced to 20 |
| **Phase C: Completion Tracking** | ✅ COMPLETE | All 20 characters have `{char}_simulation_phase1_complete` flags |
| **Phase D: Future Phases** | 📋 DESIGNED | Phase 2/3 specs for all 20 characters |

---

## Executive Summary

Transform simulations from "hidden gems" to "core value prop" by:
1. Moving current simulations to trust 0-2 (immediate access)
2. Establishing current implementations as "Phase 1 Baseline"
3. Designing Phase 2/3 architecture for future advanced versions

---

## 1. The Shift Left Strategy

### Current State vs. Target

| Character | Current Trust Gate | New Trust Gate | Status |
|-----------|-------------------|----------------|--------|
| Grace, Elena, Lira, Devon, Zara, Alex, Asha, Kai, Samuel | 0 | 0 | No change |
| Tess, Rohan, Yaquin, Silas | 1 | 0 | Minor |
| Maya, Marcus | Knowledge flags | 0 | Remove flags |
| **Jordan** | **8** | **2** | Major |
| **Quinn, Dante, Nadia, Isaiah** | **6** | **2** | Major |

### Entry Point Pattern
Add "Show me what you're working on" choice to each character's introduction:

```typescript
{
  choiceId: '{char}_intro_show_work',
  text: "Show me what you're working on.",
  nextNodeId: '{char}_simulation_intro',
  pattern: 'exploring',
  skills: ['curiosity']
}
```

---

## 2. Phase Architecture

### Unlock Flow (Completion-Based - Most Accessible)

```
Trust 2 → PHASE 1 (Introduction) → Complete
                ↓
Trust 5 + Phase 1 Complete → PHASE 2 (Application) → Complete
                ↓
Trust 8 + Phase 2 Complete → PHASE 3 (Mastery)
```

### Schema Extension

**In `lib/dialogue-graph.ts`:**
```typescript
export interface SimulationConfig {
  // ... existing fields unchanged ...

  // NEW: Phase fields (all optional for backwards compat)
  phase?: 1 | 2 | 3
  difficulty?: 'introduction' | 'application' | 'mastery'
  variantId?: string  // e.g., 'maya_servo_debugger_phase1'
  unlockRequirements?: {
    previousPhaseCompleted?: string
    trustMin?: number
    patternRequirement?: { pattern: PatternType; minLevel: number }
  }
  timeLimit?: number
  successThreshold?: number
}
```

---

## 3. Per-Character Phase Vision (All 20)

### Core Characters

| Character | Phase 1 (Current) | Phase 2 (Future) | Phase 3 (Future) |
|-----------|-------------------|------------------|------------------|
| **Maya** | Servo Debugger (single PID) | Multi-Joint Sync (4 motors) | Real-Time Adaptation |
| **Samuel** | Traveler Triage | Platform Coordination | Crisis Override |
| **Marcus** | Workflow Triage | Architectural Refactor | Emergency Fallback |
| **Devon** | Cognitive Web (2-person) | Family Dynamics (4-person) | Intervention Planning |
| **Rohan** | Hallucination Debate | Codebase Archaeology | AI Collaboration Protocol |
| **Kai** | Safety Blueprint (single zone) | Factory-Wide Safety | Emergency Protocol |

### Secondary Characters

| Character | Phase 1 (Current) | Phase 2 (Future) | Phase 3 (Future) |
|-----------|-------------------|------------------|------------------|
| **Tess** | Pitch Practice | Classroom Crisis | Business Pivot |
| **Yaquin** | Course Module | Curriculum Architecture | Adaptive Learning |
| **Grace** | Moment of Presence | Family Communication | End-of-Life Decisions |
| **Elena** | Deep Research Protocol | Contextual Synthesis | Visual Reconstruction |
| **Alex** | Learning Pattern Discovery | Supply Chain Triage | Ethical Procurement |
| **Jordan** | Launch Crisis | Roadmap Negotiation | Career Crossroads |

### Extended Characters

| Character | Phase 1 (Current) | Phase 2 (Future) | Phase 3 (Future) |
|-----------|-------------------|------------------|------------------|
| **Silas** | Ground Truth Diagnostic | Sensor Network Calibration | Predictive Maintenance |
| **Asha** | Mural Concept | Community Input Synthesis | Public Art Arbitration |
| **Lira** | Soundtrack Generation | Multi-Track Composition | Adaptive Score |
| **Zara** | Dataset Audit | Algorithmic Forensics | Bias Mitigation Design |

### LinkedIn 2026 Characters

| Character | Phase 1 (Current) | Phase 2 (Future) | Phase 3 (Future) |
|-----------|-------------------|------------------|------------------|
| **Quinn** | Portfolio Analysis | Market Correlation | Crisis Hedging |
| **Dante** | Pitch Deck Builder | Objection Handling | Deal Rescue |
| **Nadia** | Headline Editor | Narrative Threading | Misinformation Response |
| **Isaiah** | Supply Chain Map | Resource Allocation | Coalition Building |

---

## 4. Implementation Phases

### Phase A: Schema Updates (No gameplay changes)
1. Extend `SimulationConfig` interface with optional phase fields
2. Add `phase: 1` and `variantId` to all registry entries
3. Add phase indicator UI to God Mode

### Phase B: Shift Left (Trust Gate Changes)
**Files to modify:**

| File | Changes |
|------|---------|
| `content/jordan-dialogue-graph.ts` | Change trust 8 → 2 |
| `content/quinn-dialogue-graph.ts` | Add intro choice, trust 6 → 2 |
| `content/dante-dialogue-graph.ts` | Create simulation_intro node at trust 2 |
| `content/nadia-dialogue-graph.ts` | Create simulation_intro node at trust 2 |
| `content/isaiah-dialogue-graph.ts` | Create simulation_intro node at trust 2 |
| `content/maya-dialogue-graph.ts` | Add intro choice, remove knowledge flag requirement |
| `content/marcus-dialogue-graph.ts` | Add intro choice, remove knowledge flag requirement |

### Phase C: Completion Tracking
1. Add `{char}_simulation_phase1_complete` knowledge flags
2. Add flag to `onEnter` of simulation success nodes
3. Create `evaluateSimulationAccess()` function for Phase 2/3 unlocks

### Phase D: Registry Upgrade (Future Phase 2/3 support)
1. Create `SimulationMeta` interface with phases array
2. Populate Phase 2/3 designs with `status: 'designed'`
3. God Mode shows all phases with availability status

---

## 5. Critical Files

| File | Purpose |
|------|---------|
| `lib/dialogue-graph.ts` | Extend SimulationConfig interface |
| `content/simulation-registry.ts` | Add phase metadata to all 20 entries |
| `content/*-dialogue-graph.ts` | Add intro choices, modify trust gates |
| `components/game/SimulationRenderer.tsx` | Add phase indicator UI |
| `lib/character-state.ts` | Add simulation progress tracking (Phase C) |

---

## 6. Verification Plan

### Tests to Run
```bash
npm run type-check   # Verify schema changes compile
npm test             # Ensure no regressions
npm run build        # Production build succeeds
```

### Manual Verification
1. **Jordan:** Start new game, reach Jordan, verify simulation at trust 2
2. **Quinn:** Start new game, verify pitch simulation accessible early
3. **God Mode:** Verify all 20 simulations show phase indicators
4. **Completion Tracking:** Complete Maya Phase 1, verify flag is set

### Playtest Checklist
- [ ] All 20 simulations accessible at trust 0-2
- [ ] No dialogue dead-ends from new intro choices
- [ ] Phase 1 completion flags properly stored
- [ ] God Mode Holographic Rack unchanged
- [ ] Vulnerability arcs (trust 6) still work correctly

---

## 7. Backwards Compatibility

All new fields are **optional with defaults**:
- `phase` defaults to `1`
- `difficulty` defaults to `'introduction'`
- `variantId` auto-generated if missing
- `unlockRequirements` ignored if absent

**Zero breaking changes to existing simulations.**

---

## 8. Registry Architecture & Side Menu Implications

### Dual Registry System
The simulation system uses two registries:

| Registry | Location | Purpose | Count |
|----------|----------|---------|-------|
| **Content Registry** | `content/simulation-registry.ts` | God Mode / Debug UI | 20 entries |
| **Lib Registry** | `lib/simulation-registry.ts` | Player-facing UI | 20 entries (synced) |

**Critical Fix Applied:** LinkedIn 2026 characters (Quinn, Dante, Nadia, Isaiah) were missing from `lib/simulation-registry.ts` - now synced.

### Side Menu (Journal) Integration
- **God Mode Tab:** Shows all 20 simulations via `content/simulation-registry.ts`
- **Phase Indicators:** 3 dots showing current phase (1 lit = Phase 1 complete)
- **Mount Button:** Force-starts simulation bypassing narrative gates

### Future UI Considerations
- Simulation tab in Journal could show unlocked simulations
- Phase progression could be visualized in character constellation
- Completion badges could appear on character avatars

---

## 9. Summary

| Deliverable | Scope | Status |
|-------------|-------|--------|
| Trust gate reductions | Jordan 8→2 | ✅ COMPLETE |
| New intro choices | Maya, Marcus, Dante, Nadia, Isaiah | ✅ COMPLETE |
| SimulationConfig extension | Schema + types | ✅ COMPLETE |
| God Mode phase indicators | UI dots | ✅ COMPLETE |
| Registry sync | lib ↔ content (20 entries) | ✅ COMPLETE |
| Phase 2/3 designs | 20 characters | 📋 DOCUMENTED |
| Completion tracking | Knowledge flags (all 20 chars) | ✅ COMPLETE |

**Characters with new intro choices:** Maya, Marcus, Dante, Nadia, Isaiah (5 total)
**Trust gate changes:** Jordan 8→2 (1 character)

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `SIMULATION_ROADMAP.md` | Strategic vision, Handshake Protocol |
| `SIMULATION_AUDIT_JAN2026.md` | Current state analysis |
| `SATELLITE_OS_IMPLEMENTATION_PLAN.md` | Visualizer architecture |
| **`08JAN26_GAME_DESIGN_SYNTHESIS.md`** | **Comprehensive game design patterns applied to all 8 Journal tabs + gameplay loops** |

---

## 10. Exploration Findings (Gap Analysis)

### Documentation Gaps Identified
- Phase 2/3 implementations only documented at high level
- 5 Visualizers (VisualCanvas, DataDashboard, SecureTerminal, MediaStudio, DiplomacyTable) documented but only Maya's SystemArchitectureSim implemented
- No detailed specs for advanced simulation mechanics

### Character Coverage Status
All 20 characters now have:
- ✅ Simulation in dialogue graph
- ✅ Entry in `lib/simulation-registry.ts`
- ✅ Entry in `content/simulation-registry.ts`
- ✅ Phase 1 metadata (phase: 1, difficulty: 'introduction')

### Next Sprint Priorities
1. **Phase C:** Add completion tracking flags to all simulation success nodes
2. **Visualizer Build:** Implement remaining 4 visualizers
3. **Phase 2 Content:** Design detailed Phase 2 simulations for 5 priority characters

---

## 11. Game Inspirations Matrix

### Primary Design Sources

| Game | What We Borrowed | Simulation Application |
|------|------------------|----------------------|
| **Pokemon** | Invisible stat tracking → visible outcomes, 4-move limit philosophy | Patterns accumulate silently; threshold reveals trigger pattern identity choices |
| **Disco Elysium** | 24 skill voices as internal monologue, micro-reactivity at industrial scale | 5 Pattern Voices speak during choices; 113+ pattern reflection nodes |
| **Persona 3/5** | Social Links with scarcity, 10-rank progression gating content | Trust levels 0-10 gate dialogue; planned 7-day countdown forcing choices |
| **Fire Emblem** | Support system integration with core gameplay, C/B/A/S ranks | Relationships develop through dialogue; simulations deepen character arcs |
| **Zelda (BotW/TotK)** | "UI is better when it's not there", Item Get ceremony (5-7 sec) | Minimal Journal UI; pattern milestone celebrations |
| **Mass Effect** | Dialogue wheel, loyalty/romance systems, multi-game consequence tracking | Trust economy; knowledge flags tracking player history |
| **Kentucky Route Zero** | Character ecosystem (not parallel dialogues), magical realism | Future: multi-character scenes where NPCs acknowledge each other |
| **Fallen London** | Quality-based progression, hundreds of hidden variables | Knowledge flags unlocking career path depth |
| **Heaven's Vault** | Knowledge as progression currency, language learning through context | Career understanding accumulates through conversation |

### Design Pattern Synthesis

| Pattern | Source Games | Lux Story Implementation |
|---------|-------------|-------------------------|
| Invisible tracking → visible outcomes | Pokemon IVs/EVs, Fallen London | Pattern accumulation with threshold-triggered reveals |
| Limited time creates scarcity | Persona (30 days), Majora's Mask (72 hrs) | Planned: 7-day countdown restricting character choices |
| Relationship progression gating | Mass Effect, Persona, Fire Emblem | Trust levels 0-10 unlocking dialogue nodes |
| Failure as entertainment | Disco Elysium skill checks | Non-optimal choices trigger interesting responses |
| Ceremony for permanent changes | Pokemon evolution, Zelda Item Get | Pattern identity acceptance with theatrical presentation |
| Micro-reactivity at scale | Disco Elysium (shaved beard echoes) | 113+ pattern reflection nodes |
| Combinatorial identity | Persona (multiple social links) | 5 patterns combined creating unique profiles |

---

## 12. Simulation Mechanic Taxonomy

### Group 1: Negotiation/Persuasion (Dialogue-Based)
**Characters:** Maya, Rohan, Tess, Grace

| Character | Simulation | Core Mechanic | Success Pattern |
|-----------|------------|---------------|-----------------|
| Maya | Investor Pitch | Multi-phase investor Q&A | Multiple approaches (data/story/bridge) |
| Rohan | Hallucination Debate | Convince AI it's wrong | Technical investigation → truth |
| Tess | B-Side Pitch | Pitch vinyl community hub | Community/Experience beats "safe" |
| Grace | Moment of Presence | Teach empathy through failure | Wrong answers teach why; silence wins |

### Group 2: System Design/Architecture
**Characters:** Kai, Devon, Marcus

| Character | Simulation | Core Mechanic | Success Pattern |
|-----------|------------|---------------|-----------------|
| Kai | Safety Blueprint | Design fail-safe mechanisms | Systems thinking > compliance docs |
| Marcus | Hospital Triage | Resource allocation under crisis | Logic + ethical weight |
| Devon | Cognitive Web | Map emotional logic systems | Building + analytical hybrid |

### Group 3: Data Analysis/Discovery
**Characters:** Elena, Zara, Lira (partial)

| Character | Simulation | Core Mechanic | Success Pattern |
|-----------|------------|---------------|-----------------|
| Elena | Deep Research | Iterative search refinement | Prompt engineering mastery |
| Zara | Dataset Audit | Identify hidden bias in algorithm | Ethics + systems thinking |

### Group 4: Creative Direction (AI-Guided)
**Characters:** Lira, Asha

| Character | Simulation | Core Mechanic | Success Pattern |
|-----------|------------|---------------|-----------------|
| Lira | Soundtrack Generation | Refine AI music prompts | Emotional + technical specificity |
| Asha | Mural Concept | Guide AI art generation | Human curation > randomization |

### Key Mechanics for Phase 2/3 Scaling

1. **Emotional + Technical Hybrid Prompting** (Lira model)
   - Players combine feelings with technical specificity
   - Best path: "Piano melody, early dementia, the music knows something is wrong before she does"

2. **Cascading Failure with Named Consequences** (Rohan model)
   - Wrong choice affects specific NPC ("Zoe dies in database")
   - Creates emotional weight beyond abstract failure

3. **Multiple Failure Paths Teaching Same Lesson** (Grace model)
   - Each wrong answer is its own mini-simulation
   - Builds understanding through exploration

4. **Bias Detection in Systems** (Zara model)
   - Player finds hidden assumption in data
   - Real-world transferable skill

5. **Post-Success Depth Options** (Tess model)
   - After simulation succeeds, player can deepen vision
   - Lets ambitious players drive character arc further

6. **Interrupt Rewards** (Kai, Grace, Maya, Asha)
   - Non-verbal moments during high-stakes scenes
   - Creates presence beyond dialogue

---

## 13. Five Visualizer Architecture

### Implementation Status

| Visualizer | Status | Characters | Technology |
|------------|--------|------------|------------|
| **SystemArchitectureSim** | ✅ 100% | Maya | PID sliders, waveform animation |
| **MediaStudio** | ✅ 100% | Lira, Nadia | Synesthesia Engine (Tempo/Mood/Texture sliders, resonance scoring) |
| **VisualCanvas** | ✅ 100% | Kai, Asha, Jordan, Rohan | Blueprint/Art/Navigation variants, element placement, connections |
| **DataDashboard** | ✅ 100% | Marcus, Grace, Elena, Isaiah, Silas | Triage/Market/Logistics/Analysis variants, priority sorting |
| **SecureTerminal** | ✅ 100% | Zara, Yaquin | Audit/Archive variants, query selection, anomaly detection |
| **DiplomacyTable** | ✅ 100% | Alex, Devon, Samuel | Negotiation/Cognitive/Operations variants, relationship graphs |

### Visualizer Specifications

**VisualCanvas** - Blueprint/Art/3D variants
- Kai: CAD interface, blueprint blue, draggable components, grid snapping
- Asha: Semantic brushes, color palette, texture effects
- Jordan: 3D space visualization

**DataDashboard** - Real-time analytics
- Live stress indicators, urgency pulses
- Animated row slides, approval/rejection gestures
- Marcus: Medical triage; Elena: Research patterns; Isaiah: Logistics routes

**SecureTerminal** - Code/Query interface
- Syntax highlighting, blinking cursor, stream-in text
- "Signal Strength" & "Encryption Level" indicators
- Zara: Audit logs; Elena: Search queries

**MediaStudio** - Audio/Video creation (PRIORITY)
- Synesthesia Engine: Waveform visualization, VU meters
- Frequency spectrum analyzer
- Multi-track composition (Phase 2), adaptive scoring (Phase 3)

**DiplomacyTable** - Relationship visualization
- Force-directed layout, influence vectors
- Alex: Supply chain maps; Devon: Cognitive webs

---

## 14. Phase 2/3 Design Templates

### Phase 2 Pattern: "Application" (Trust 5+)
- Same core mechanic, increased complexity
- Multi-variable scenarios (4 motors vs 1, family dynamics vs 2-person)
- Time pressure introduced
- Cascading consequences from wrong choices

### Phase 3 Pattern: "Mastery" (Trust 8+)
- Real-time adaptation required
- No clear "right" answer (ethical dilemmas)
- Cross-character implications
- Expert-level domain knowledge tested

### Priority Characters for Phase 2 Design
1. **Maya** - Multi-Joint Sync (4 motors, interdependent tuning)
2. **Kai** - Factory-Wide Safety (multiple zones, conflicting priorities)
3. **Elena** - Contextual Synthesis (multi-source research, contradiction resolution)
4. **Lira** - Multi-Track Composition (layering, mixing, emotion mapping)
5. **Zara** - Algorithmic Forensics (trace bias through system architecture)

---

**Last Updated:** January 8, 2026 (Deep Research Complete)
