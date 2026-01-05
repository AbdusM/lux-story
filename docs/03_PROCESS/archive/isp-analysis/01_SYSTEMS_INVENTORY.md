# Systems Inventory: What Actually Exists
**December 16, 2024 - Complete Codebase Audit**

---

## Executive Summary

| Category | Files | Lines | Status |
|----------|-------|-------|--------|
| Core Systems (lib/) | 103 | 32,000+ | 80% complete |
| Components | 56 | 9,700+ | 85% complete |
| Content | 24 | 750KB+ | 85% complete |
| Hooks | 12 | 400+ | 82% complete |
| API Routes | 27 | - | 80% complete |

**Overall Assessment:** Production-ready foundation with identified gaps.

---

## 1. Core Gameplay Systems

### 1.1 Dialogue Graph System
| Property | Value |
|----------|-------|
| File | `lib/dialogue-graph.ts` |
| Lines | 520 |
| Status | **95% Complete** |

**What it does:**
- DialogueNode interface with conditional dialogue, choices, state changes
- Content variations for replayability
- PatternReflection system - NPCs acknowledge player patterns
- Learning objectives mapping

**Key Features:**
- Multiple pre-generated content variations per node
- ConditionalChoice with state requirements
- onEnter/onExit hooks
- Rich text effects (thinking, warning, success)
- Interaction animations (shake, nod, bloom, ripple)

---

### 1.2 Character State Management
| Property | Value |
|----------|-------|
| File | `lib/character-state.ts` |
| Lines | 461 |
| Status | **100% Complete** |

**Tracks:**
- Trust (0-10) per character
- Relationship status (stranger → confidant)
- Knowledge flags
- PlayerPatterns (5 dimensions)
- SerializableGameState for persistence

---

### 1.3 Game Store (Zustand)
| Property | Value |
|----------|-------|
| File | `lib/game-store.ts` |
| Lines | 1,090 |
| Status | **95% Complete** |

**Manages:**
- Message history
- Choice records
- Pattern tracking
- Skills integration
- Thoughts storage
- Character relationships
- Platform state

---

## 2. Pattern & Identity Systems

### 2.1 Pattern System (Core)
| Property | Value |
|----------|-------|
| File | `lib/patterns.ts` |
| Lines | 237 |
| Status | **100% Complete** |

**The 5 Patterns:**
- analytical (blue) - Logic, data-driven
- patience (green) - Careful consideration
- exploring (purple) - Curiosity, discovery
- helping (pink) - Supporting others
- building (amber) - Creating, constructive

**Exports:**
- PATTERN_TYPES, PATTERN_METADATA
- PATTERN_SENSATIONS (atmospheric feedback)
- Helper functions for formatting, colors, validation

---

### 2.2 Orb System
| Property | Value |
|----------|-------|
| File | `lib/orbs.ts` |
| Lines | 330 |
| Status | **90% Complete** |

**Tiers:**
- nascent (0+) → emerging (10+) → developing (30+) → flourishing (60+) → mastered (100+)

**Earnings:**
- Per choice: 1 orb
- Arc completion: 5 orbs
- Pattern threshold: 10 orbs
- Streak bonuses: 2/5/15 orbs

**Gap:** `availableToAllocate` is vestigial - no spending system exists.

---

### 2.3 Identity System
| Property | Value |
|----------|-------|
| File | `lib/identity-system.ts` |
| Lines | 637 |
| Status | **80% Complete** |

**Mechanics:**
- IdentityOffer at threshold 5
- INTERNALIZE: +20% future gains
- DISCARD: Stay flexible (no penalty)

---

### 2.4 Pattern Unlocks
| Property | Value |
|----------|-------|
| File | `lib/pattern-unlocks.ts` |
| Lines | 200+ |
| Status | **75% Complete** |

**Thresholds:** 10%, 50%, 85%
**Gap:** Unlocks defined but don't gate dialogue yet.

---

## 3. Character Systems

### 3.1 Character Roster (11 Characters)
| Character | Role | Graph Size | Phase 2 |
|-----------|------|------------|---------|
| Samuel | Hub/Mentor | 190KB | N/A |
| Maya | Tech Innovator | 44KB | No |
| Devon | Systems Thinker | 47KB | No |
| Jordan | Career Navigator | 42KB | No |
| Marcus | Medical Tech | 51KB | Yes |
| Tess | Education Founder | 38KB | Yes |
| Yaquin | EdTech Creator | 40KB | Yes |
| Kai | Safety Specialist | 50KB | No |
| Rohan | Deep Tech | 40KB | No |
| Alex | Extra | 41KB | No |
| Silas | Crisis Manager | 32KB | No |

**Total Dialogue Content:** 750KB+

---

### 3.2 Character Relationships
| Property | Value |
|----------|-------|
| File | `lib/character-relationships.ts` |
| Lines | 672 |
| Status | **80% Complete** |

**Features:**
- Asymmetric relationships (A→B ≠ B→A)
- Dynamic rules on flag triggers
- Reveal conditions
- Public vs. private opinions
- Shared memories

---

### 3.3 Trust System
| Property | Value |
|----------|-------|
| File | `lib/trust-labels.ts` |
| Lines | 50 |
| Status | **100% Complete** |

**Levels:**
- 0: Stranger
- 2+: Observer
- 4+: Acquaintance
- 6+: Ally
- 8+: Confidant
- 10: Kindred Spirit

---

## 4. Analytics & Tracking

### 4.1 Skill Tracker
| Property | Value |
|----------|-------|
| File | `lib/skill-tracker.ts` |
| Lines | 1,021 |
| Status | **85% Complete** |

**Philosophy:** Evidence-first, not scores.
- Records choices as EVIDENCE
- Skill milestones tracking
- Career match recommendations
- 500 demonstration limit

---

### 4.2 Consequence Echoes
| Property | Value |
|----------|-------|
| File | `lib/consequence-echoes.ts` |
| Lines | 782 |
| Status | **85% Complete** |

**Features:**
- Dialogue-based feedback (not toasts)
- Per-character voice
- Trust up/down responses
- Pattern recognition acknowledgments

---

### 4.3 Engagement Metrics
| Property | Value |
|----------|-------|
| File | `lib/engagement-metrics.ts` |
| Lines | 554 |
| Status | **80% Complete** |

**Tracks:** Response time, engagement depth, consistency, learning velocity

---

### 4.4 Career Analytics
| Property | Value |
|----------|-------|
| File | `lib/career-analytics.ts` |
| Lines | 440 |
| Status | **75% Complete** |

**Career Affinities:** healthcare, engineering, technology, education, sustainability, entrepreneurship, creative, service

---

## 5. UI Components

### 5.1 Active UI Elements (7 Total)
| Element | File | Status |
|---------|------|--------|
| Journal Panel | `Journal.tsx` | 85% |
| Constellation Panel | `ConstellationPanel.tsx` | 80% |
| Journey Summary | `JourneySummary.tsx` | 80% |
| Detail Modal | `DetailModal.tsx` | 90% |
| Error Display | `StatefulGameInterface.tsx` | 100% |
| Fixed Header | `StatefulGameInterface.tsx` | 100% |
| Fixed Choices | `StatefulGameInterface.tsx` | 85% |

### 5.2 Main Components
| Component | Lines | Status |
|-----------|-------|--------|
| StatefulGameInterface | 1,511 | 90% |
| ChatPacedDialogue | 460 | 90% |
| GameChoices | 427 | 85% |
| Journal | 597 | 85% |
| PixelAvatar | 724 | 95% |
| RichTextRenderer | 270 | 85% |

---

## 6. Data Persistence

### 6.1 Sync Queue
| Property | Value |
|----------|-------|
| File | `lib/sync-queue.ts` |
| Lines | 914 |
| Status | **90% Complete** |

**Features:**
- Offline-first
- Automatic retry with exponential backoff
- Static export detection
- Max queue size enforcement

---

### 6.2 Database Service
| Property | Value |
|----------|-------|
| File | `lib/database-service.ts` |
| Lines | 905 |
| Status | **80% Complete** |

**Mode:** Dual-write (localStorage primary, Supabase secondary)

---

## 7. API Routes

### User Routes (10)
- `/user/profile`
- `/user/pattern-profile`
- `/user/pattern-demonstrations`
- `/user/skill-demonstrations`
- `/user/skill-summaries`
- `/user/career-analytics`
- `/user/career-explorations`
- `/user/action-plan`
- `/user/relationship-progress`
- `/user/platform-state`

### Admin Routes (7)
- `/admin/auth`
- `/admin/check-profile`
- `/admin/user-ids`
- `/admin/evidence/[userId]`
- `/admin/urgency`
- `/admin/skill-data`
- `/admin/pattern-analysis`

### Health Routes (3)
- `/health`
- `/health/db`
- `/health/storage`

---

## 8. Custom Hooks

| Hook | Lines | Status |
|------|-------|--------|
| useOrbs | 200+ | 90% |
| useInsights | 100+ | 75% |
| useConstellationData | 150+ | 80% |
| useEventBus | 200+ | 85% |
| useBackgroundSync | 175+ | 85% |
| usePatternUnlocks | 150+ | 80% |
| useUnlockEffects | 100+ | 85% |
| useLocalStorage | 50+ | 100% |

---

## 9. Supporting Systems

| System | File | Status |
|--------|------|--------|
| Character Typing | `character-typing.ts` | 95% |
| Ambient Events | `ambient-events.ts` | 85% |
| Animations | `animations.ts` | 90% |
| Platform Resonance | `platform-resonance.ts` | 75% |
| Session Structure | `session-structure.ts` | 80% |
| Journey Narrative | `journey-narrative-generator.ts` | 85% |

---

## 10. Dead/Unused Code (Cleanup Candidates)

| File | Lines | Status |
|------|-------|--------|
| `scene-skill-mappings.ts` | 2,183 | DUPLICATE |
| `crossroads-system.ts` | 1,272 | UNUSED |
| `character-quirks.ts` | 1,394 | WRONG FOLDER |
| `character-depth.ts` | 1,310 | WRONG FOLDER |
| `birmingham-opportunities.ts` | 567 | WRONG FOLDER |

**Total Cleanup Opportunity:** 6,726 lines

---

## Architecture Flow

```
User Choice
    → GameStore (Zustand)
        → Character State
            → Skill Tracker
                ↓
Consequence Echo ← Pattern Recognition ← Orbs
                ↓
Journal (UI) ← Career Analytics ← Evidence Collection
                ↓
SyncQueue → Supabase/localStorage
```

---

## File Structure Summary

```
lib/                      (103 files)
  ├── Core: character-state, game-store, dialogue-graph
  ├── Patterns: patterns, identity-system, pattern-affinity
  ├── Analytics: skill-tracker, orbs, career-analytics
  ├── Database: database-service, sync-queue
  └── Supporting: 30+ systems

components/               (56 files)
  ├── StatefulGameInterface (main controller)
  ├── Dialogue: ChatPacedDialogue, GameChoices
  ├── Panels: Journal, Constellation
  └── Supporting: 40+ components

content/                  (24 files)
  ├── 11 character dialogue graphs
  └── Supporting content

hooks/                    (12 files)
app/                      (27 routes)
```

---

*This inventory represents what EXISTS. See 02_COMPREHENSIVE_ROADMAP.md for improvements.*
