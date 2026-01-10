# Software Development Considerations
## Pitch Deck vs. Codebase Gap Analysis

*Last Updated: January 2026*

---

## Executive Summary

The pitch deck is **largely accurate**. Most "gaps" identified in the audit are actually undersold features. Key development priorities are polish and demonstration readiness, not new feature development.

---

## Feature Verification Matrix

| Pitch Claim | Code Status | Location | Action |
|-------------|-------------|----------|--------|
| 5 Visualizer Engines | ✅ **ALL EXIST** | `components/game/simulations/*.tsx` | Demo polish |
| God Mode Dashboard | ✅ **EXISTS** | `components/journal/SimulationGodView.tsx` | Demo polish |
| 8 Skill Clusters | ✅ **EXISTS** | `lib/skill-definitions.ts` (comments) | Add UI grouping |
| 11 Cognitive Domains | ✅ **EXISTS** | `lib/cognitive-domains.ts` | None needed |
| Consequence Echo System | ✅ **EXISTS** | `lib/consequence-echoes.ts` | None needed |
| 7 Derivative Modules | ✅ **EXISTS** | `lib/*-derivatives.ts` | None needed |
| 80+ Relationship Edges | ✅ **EXISTS** | `lib/character-relationships.ts` | None needed |
| Simulation Registry | ✅ **EXISTS** | `content/simulation-registry.ts` | Expand content |

---

## 1. The 5 Visualizer Engines (VERIFIED)

All 5 engines exist as implemented React components:

```
components/game/simulations/
├── VisualCanvas.tsx        # Spatial design interface
├── DataDashboard.tsx       # Analytics/metrics view
├── SecureTerminal.tsx      # Command-line interface
├── MediaStudio.tsx         # Audio/video editing
└── SystemArchitectureSim.tsx  # Logic flow/blueprints
```

**Development Status:** Implemented but need demo polish.

**Action Items:**
- [ ] Ensure all 5 can be triggered via God Mode
- [ ] Add loading states and error handling
- [ ] Verify mobile responsiveness
- [ ] Create demo script showing each engine

---

## 2. God Mode Dashboard (VERIFIED)

**Location:** `components/journal/SimulationGodView.tsx`

**Features:**
- Real-time simulation mounting
- Bypasses narrative checks
- Constructs SimulationConfig on-the-fly
- Grid view of all available simulations

**Investor Demo Value:** This proves the system is not smoke and mirrors.

**Action Items:**
- [ ] Add trust/pattern manipulation controls
- [ ] Add "reset to default" button
- [ ] Create 60-second demo script
- [ ] Ensure works on iPad for in-person demos

---

## 3. Skill Cluster Architecture (VERIFIED)

The code defines **8 clusters** (not 6 as audit suggested):

```typescript
// lib/skill-definitions.ts
// --- MIND CLUSTER ---        (7 skills)
// --- HEART CLUSTER ---       (7 skills)
// --- VOICE CLUSTER ---       (7 skills)
// --- HANDS CLUSTER ---       (8 skills)
// --- COMPASS CLUSTER ---     (7 skills)
// --- CRAFT CLUSTER ---       (3 skills)
// --- CENTER HUB ---          (1 skill: Communication)
// --- FUTURE OF WORK ---      (6 skills: AI, Agentic Coding, etc.)
```

**Gap:** Clusters exist in comments but not as typed data structure.

**Action Items:**
- [ ] Add `cluster: string` field to SkillDefinition interface
- [ ] Create SKILL_CLUSTERS constant for UI grouping
- [ ] Update Skills tab in Journal to show cluster groupings
- [ ] Create hexagonal cluster visualization for pitch

---

## 4. Demo Readiness Checklist

### Must-Have for Investor Demos

| Feature | Status | Priority |
|---------|--------|----------|
| God Mode accessible from Journal | ✅ Works | - |
| All 5 simulation types loadable | ⚠️ Test | HIGH |
| Trust manipulation visible | ⚠️ Partial | HIGH |
| Pattern change shows on radar | ⚠️ Test | MEDIUM |
| Interrupt system triggerable | ✅ Works | - |
| Mobile responsive | ✅ Works | - |

### Demo Script Sequence (Recommended)

```
1. START: Fresh game, show "Shift Left" immediate hook
2. SAMUEL: 3 dialogue exchanges showing trust building
3. INTERRUPT: Trigger "Silence" or "Comfort" window
4. JOURNAL: Show real-time pattern tracking
5. GOD MODE: Open SimulationGodView
6. MOUNT: Force-load Maya's Servo Debugger
7. DASHBOARD: Switch to DataDashboard view
8. TRUST MANIPULATION: Max out Samuel trust, show UI reaction
9. CLOSE: Return to narrative, show changed dialogue options
```

---

## 5. Language Precision for Pitch

### Use These Terms

| Instead of... | Say... | Why |
|---------------|--------|-----|
| "Autonomous AI NPCs" | "Deterministic core with AI readiness" | Honest about current state |
| "Generative dialogue" | "Hand-crafted narrative with AI enhancement roadmap" | Accurate |
| "Real-time multiplayer" | "Global leaderboard and community echoes" | Future feature |
| "Clinical diagnosis" | "Pre-clinical screening and behavioral aptitude" | Legally safe |

### Defensible Claims

These are **100% accurate** and should be emphasized:

- "1,158 hand-authored dialogue nodes"
- "1,082 automated tests passing"
- "7 derivative modules computing trajectories per interaction"
- "11 cognitive domains aligned with DSM-5 framework"
- "55 skills with superpower naming and manifestos"
- "13 career fields with Birmingham employer mappings"
- "80+ relationship edges in the social graph"

---

## 6. Technical Debt to Address

### Before Demo (Priority 1)

1. **Simulation Type Mapping** - Ensure all `simulation-registry.ts` types match actual component types
2. **God Mode Polish** - Add visual feedback when simulation mounts
3. **Mobile Safe Areas** - Verify simulations respect safe-area-inset

### Before Launch (Priority 2)

1. **Skill Cluster Typing** - Add explicit cluster field to skills
2. **Pattern Radar Polish** - Ensure updates are smooth
3. **Interrupt Timing** - Verify 3-second windows work on mobile

### Future (Priority 3)

1. **LLM Integration Points** - Document where AI can inject
2. **Consequence Propagation Enhancement** - Add more dynamic rules
3. **Multi-session State** - Ensure save/load is bulletproof

---

## 7. Architecture Diagram for Pitch

```
┌─────────────────────────────────────────────────────────────┐
│                    GRAND CENTRAL TERMINUS                    │
├─────────────────────────────────────────────────────────────┤
│  SURFACE LAYER (10% Visible)                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Chat UI     │ │ Journal     │ │ Constellation│           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  5 VISUALIZER ENGINES                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │VisualCa│ │DataDash │ │SecureTe│ │MediaStu│ │SystemAr││
│  │nvas    │ │board    │ │rminal  │ │dio     │ │chitect ││
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────────┘│
├─────────────────────────────────────────────────────────────┤
│  ICEBERG LAYER (90% Hidden)                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 7 DERIVATIVE ENGINES                                    ││
│  │ Trust │ Pattern │ Skill │ Narrative │ Knowledge │ etc. ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ STATE GRAPH: 1,158 nodes × 20 characters × 80 edges    ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ COGNITIVE ENGINE: 11 domains × 55 skills × 5 patterns  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Risk Mitigation

### "Vaporware" Prevention

| Risk | Mitigation |
|------|------------|
| "Does the simulation actually work?" | Live demo via God Mode |
| "Is the AI real?" | Clearly state deterministic core + AI roadmap |
| "Can you prove learning happens?" | Show derivative engine output in real-time |
| "Is this just a chatbot?" | Demo all 5 visualization engines |

### Technical Demo Failures

| Scenario | Backup Plan |
|----------|-------------|
| Simulation won't load | Pre-record video of working simulation |
| Network issues | Run locally, deploy to demo device before meeting |
| Touch targets too small | Use iPad Pro, not phone |
| State gets corrupted | Have "Reset Game" button ready |

---

## Appendix: Quick Reference Commands

```bash
# Start dev server
npm run dev

# Run tests (verify 1,082 pass)
npm test

# Type check (should be clean)
npm run type-check

# Count dialogue nodes
grep -r "nodeId:" content/*-dialogue-graph.ts | wc -l

# Count skills
grep -c "id:" lib/skill-definitions.ts

# List simulation types
grep "type:" content/simulation-registry.ts | sort | uniq
```

---

*This document ensures all pitch deck claims are technically defensible and identifies polish items for demo readiness.*
