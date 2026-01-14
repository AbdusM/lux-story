# Sprint Tasks
**December 16, 2024 - Engineering-Ready Task List**

---

## Current Sprint: Foundation & Activation

**Goal:** Wake up dormant systems. Complete what exists before adding.

**Duration:** 4 weeks
**Exit Criteria:** Core loop feels 40% more complete without new content.

---

## Week 1: Foundation

### Day 1: Cleanup
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Delete confirmed dead code | Various | 2-4 hrs | Zero unused imports in active paths |
| Fix ESLint warnings | Various | 1-2 hrs | `npm run lint` passes clean |

**Dead Code to Verify:**
- `scene-skill-mappings.backup.ts` → DELETE
- `crossroads-system.ts` → Grep for imports, DELETE if zero
- `apple-aesthetic-agent.ts` → Verify usage
- `apple-design-review.ts` → Verify usage

### Day 2: Orb Milestone Echoes
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Wire orb milestone echoes | `StatefulGameInterface.tsx` | 2-3 hrs | Samuel acknowledgment displays at tier transitions |

**Implementation:**
```typescript
// After earning orbs:
const milestone = getUnacknowledgedMilestone()
if (milestone) {
  const echo = getOrbMilestoneEcho(milestone)
  setState(prev => ({ ...prev, consequenceEcho: echo }))
  acknowledgeMilestone(milestone)
}
```

### Day 2: Consequence Echoes
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Wire consequence echo display | `StatefulGameInterface.tsx` | 2-4 hrs | Trust changes trigger character-specific echoes |

**Implementation:**
```typescript
// After trust changes:
const trustDelta = newTrust - oldTrust
if (Math.abs(trustDelta) >= 1) {
  const echo = getConsequenceEcho(characterId, trustDelta)
  if (echo) {
    setState(prev => ({ ...prev, consequenceEcho: echo }))
    setTimeout(() => setState(prev => ({ ...prev, consequenceEcho: null })), 4000)
  }
}
```

### Day 3: Session Boundaries
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Fix session boundary frequency | `session-structure.ts` | 4-6 hrs | Boundaries only at `canBoundary: true` nodes |

**Rules to Implement:**
- `minNodesBetween: 15`
- `maxNodesBetween: 30`
- Never during vulnerability reveal
- Prefer `resolution` type boundaries

### Day 4: First Orb Echo
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Verify first orb echo triggers | `consequence-echoes.ts` | 1-2 hrs | First pattern choice triggers Samuel's teaching moment |

**Critical Quote:**
> "The choices you make here... they reveal something. Patterns. The station notices. Check your Journal when you get a chance."

### Day 5: Pattern Reflections (Batch 1)
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Add 50 pattern reflections | Character dialogue files | 4-6 hrs | 100 total reflections (up from 50) |

**Target Nodes:**
- Samuel intro nodes
- Maya vulnerability nodes
- Devon technical explanation nodes
- High-trust conversation nodes

---

## Week 1 Exit Criteria

- [ ] Zero dead code in active paths
- [ ] Milestone echoes display at tier transitions
- [ ] Consequence echoes trigger on trust changes
- [ ] Session boundaries feel natural (not arbitrary)
- [ ] First-time player understands patterns through play
- [ ] 10% pattern acknowledgment rate (up from 4.4%)

---

## Week 2: Identity System

### Day 1: Identity Offer Dialogue
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Create identity offer dialogue nodes | `content/samuel.ts` | 4 hrs | 5 dialogue nodes (one per pattern) |

**Template per Pattern:**
```typescript
{
  nodeId: 'identity_offer_analytical',
  speaker: 'samuel',
  content: [{ text: "Is this who you are? The one who sees the patterns?" }],
  choices: [
    { text: "Yes, this is who I am", nextNodeId: 'identity_accept_analytical' },
    { text: "I'm still figuring that out", nextNodeId: 'identity_decline_analytical' }
  ]
}
```

### Day 1: Threshold Detection
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Wire threshold detection | `StatefulGameInterface.tsx` | 2 hrs | Pattern crossing 5 triggers identity offer |

### Day 2: Choice Handler
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Implement internalize/discard handler | `identity-system.ts` | 4 hrs | Accept → +20% gains; Decline → flexible |

### Day 2: Bonus Application
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Apply +20% bonus to pattern gains | `orbs.ts` | 2 hrs | Internalized patterns earn 1.2x orbs |

### Day 3: Samuel Acknowledgment
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Add Samuel acknowledgment dialogue | `content/samuel.ts` | 2 hrs | Samuel references internalized identities |

### Day 3: Ceremony Animation
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Add ceremony animation | New component | 3 hrs | 5-7 second sequence, screen dims, fanfare |

### Day 4: Testing All Flows
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Test all 5 pattern identity flows | Manual testing | 4 hrs | Each pattern can trigger, accept, decline |

### Day 5: Polish
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Polish transitions and timing | Various | 4 hrs | Ceremony feels significant (5-7 seconds) |

---

## Week 2 Exit Criteria

- [ ] Each pattern can trigger identity offer at threshold 5
- [ ] Internalization visibly affects future gains (+20%)
- [ ] Ceremony feels significant (5-7 seconds, memorable)
- [ ] Samuel acknowledges chosen identities naturally
- [ ] Discarding feels like valid choice, not punishment

---

## Week 3: Unlock Gating

### Day 1: Design Unlock UI
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Design unlock UI (NOT lock icons) | Design doc | 4 hrs | Philosophy-aligned approach documented |

**Philosophy Decision:**
- High-pattern players see additional choices
- Low-pattern players see different (not fewer) choices
- NO lock icons anywhere

### Day 2: Add `requires` Field
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Add `requires` field to choice type | `lib/dialogue-graph.ts` | 4 hrs | TypeScript type updated, validated |

```typescript
interface GatedChoice extends EvaluatedChoice {
  requires?: {
    pattern: PatternType
    threshold: number // 0-100
  }
}
```

### Day 3: Tag High-Value Choices
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Tag 30 choices with requirements | Character dialogue files | 6 hrs | 30 choices respond to pattern thresholds |

### Day 4: Requirement Evaluation
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Implement requirement evaluation | `GameChoices.tsx` | 4 hrs | Choices filtered/styled based on requirements |

### Day 5: Unlock Hints
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Add unlock hints | `GameChoices.tsx` | 4 hrs | Players know what's needed without feeling punished |

---

## Week 3 Exit Criteria

- [ ] 30+ choices respond to pattern thresholds
- [ ] NO lock icons anywhere (philosophy violation)
- [ ] Every build gets full content, different flavors
- [ ] Unlocking feels like earned access, not grind reward

---

## Week 4: Polish & Content

### Days 1-2: Pattern Reflections (Batch 2)
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Add 130 more pattern reflections | Character dialogue files | 8-12 hrs | 230 total (20% acknowledgment rate) |

### Day 2: Audio Vocabulary
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Implement 9-sound audio vocabulary | New `lib/audio-feedback.ts` | 4 hrs | 5 pattern sounds + trust + identity + milestone + episode |

### Day 3: Visual State Labels
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Add visual state labels to orbs | `Journal.tsx` | 2 hrs | "Flickering/Glowing/Radiant/Blazing" not percentages |

### Day 3: Character Transformations
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Character transformation POCs | `character-transformations.ts` | 4 hrs | 2-3 characters have transformation moments |

### Day 4: Journey Summary Enhancement
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Enhance Journey Summary ceremony | `JourneySummary.tsx` | 6 hrs | Ending feels ceremonial, not transactional |

### Day 5: End-to-End Playtest
| Task | File | Effort | Acceptance Criteria |
|------|------|--------|---------------------|
| Full playtest and bug fixes | All | 8 hrs | Smooth playthrough, zero critical bugs |

---

## Week 4 Exit Criteria

- [ ] 20% pattern acknowledgment rate
- [ ] 9 audio sounds implemented and triggered
- [ ] Orbs show emotional labels not percentages
- [ ] 3+ characters have transformation moments
- [ ] Journey ending feels ceremonial
- [ ] Full playthrough is smooth

---

## Quality Gates (All Phases)

### Gate 1: No Silent State Changes
Every state change must have feedback:
- Trust change → Consequence echo
- Pattern earned → Orb visual + optional sensation
- Milestone hit → Samuel acknowledgment
- Transformation witnessed → Character reaction

### Gate 2: No Orphaned Systems
Every lib file must either:
- Be imported and used in active code paths
- Be explicitly archived in `/lib/archive/`
- Be documented as "future" in roadmap

### Gate 3: Mobile-First
Every UI change must work on:
- 375px width (iPhone SE)
- Touch targets 44px minimum
- No hover-only interactions
- Safe area insets respected

### Gate 4: Philosophy Alignment
Every feature must pass 10 Commandments check:
- Does it respect player intelligence?
- Does it show rather than tell?
- Does it prioritize feel over mechanics?
- Can it be expressed through dialogue?

---

## Not This Sprint

**Do NOT build:**
- Platform features (creator tools, white-label)
- Scale features (multiplayer, leaderboards)
- Monetization features
- Advanced AI (Claude-generated dialogue)
- New content systems (narrative scarcity, character intersection)

**Why:** These violate "Clean Before Add." Existing systems must work completely first.

---

*This document is the executable task list. See 01_ENGINEERING_SYNTHESIS for context.*
