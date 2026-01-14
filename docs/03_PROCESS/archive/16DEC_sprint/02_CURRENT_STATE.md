# Current State Analysis
**December 16, 2024 - What Actually Exists**

---

## Executive Summary

| Category | Files | Lines | Completion |
|----------|-------|-------|------------|
| Core Systems (lib/) | 103 | 32,000+ | 80% |
| Components | 56 | 9,700+ | 85% |
| Content | 24 | 750KB+ | 85% |
| Hooks | 12 | 400+ | 82% |
| API Routes | 27 | — | 80% |

**Overall:** Production-ready foundation with identified gaps.

---

## Part I: Codebase Statistics

### Architecture Flow
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

### File Structure
```
lib/                      (103 files, 32,000+ lines)
  ├── Core: character-state, game-store, dialogue-graph
  ├── Patterns: patterns, identity-system, pattern-affinity
  ├── Analytics: skill-tracker, orbs, career-analytics
  ├── Database: database-service, sync-queue
  └── Supporting: 30+ systems

components/               (56 files, 9,700+ lines)
  ├── StatefulGameInterface (main controller, 1,511 lines)
  ├── Dialogue: ChatPacedDialogue, GameChoices
  ├── Panels: Journal, Constellation
  └── Supporting: 40+ components

content/                  (24 files, 750KB+)
  ├── 11 character dialogue graphs
  └── Supporting content

hooks/                    (12 files, 400+ lines)
app/                      (27 routes)
```

---

## Part II: Character Roster (11 Characters)

| Character | Role | Graph Size | Phase 2 Ready |
|-----------|------|------------|---------------|
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

**Note:** PRD mentions "Lira" but she doesn't exist in code. Jordan, Kai, Silas, Alex exist but not in PRD.

---

## Part III: Core Systems Status

### 3.1 Pattern System (100% Complete)
**File:** `lib/patterns.ts` (237 lines)

**The 5 Patterns:**
| Pattern | Color | Description |
|---------|-------|-------------|
| analytical | blue | Logic, data-driven decisions |
| patience | green | Careful consideration |
| exploring | purple | Curiosity, discovery |
| helping | pink | Supporting others |
| building | amber | Creating, constructive action |

**Exports:** PATTERN_TYPES, PATTERN_METADATA, PATTERN_SENSATIONS

---

### 3.2 Orb System (90% Complete)
**File:** `lib/orbs.ts` (330 lines)

**Tiers:**
| Tier | Threshold | Label |
|------|-----------|-------|
| 1 | 0+ | Nascent |
| 2 | 10+ | Emerging |
| 3 | 30+ | Developing |
| 4 | 60+ | Flourishing |
| 5 | 100+ | Mastered |

**Earnings:**
- Per choice: 1 orb
- Arc completion: 5 orbs
- Pattern threshold: 10 orbs
- Streak bonuses: 2/5/15 orbs

**Gap:** `availableToAllocate` is vestigial—no spending system exists.

---

### 3.3 Identity System (80% Complete)
**File:** `lib/identity-system.ts` (637 lines)

**Mechanics:**
- Identity offered when pattern hits threshold 5
- INTERNALIZE: +20% future pattern gains
- DISCARD: Stay flexible (no penalty)

**Gap:** UI flow for identity offer not fully wired.

---

### 3.4 Pattern Unlocks (75% Complete)
**File:** `lib/pattern-unlocks.ts` (200+ lines)

**Thresholds:** 10%, 50%, 85%

**Gap:** Unlocks defined but don't gate dialogue content yet.

---

### 3.5 Dialogue Graph System (95% Complete)
**File:** `lib/dialogue-graph.ts` (520 lines)

**Features:**
- DialogueNode with conditional dialogue, choices, state changes
- Multiple pre-generated content variations per node
- PatternReflection system (NPCs acknowledge player patterns)
- onEnter/onExit hooks
- Rich text effects (thinking, warning, success)
- Interaction animations (shake, nod, bloom, ripple)

---

### 3.6 Character State (100% Complete)
**File:** `lib/character-state.ts` (461 lines)

**Tracks:**
- Trust (0-10) per character
- Relationship status (stranger → confidant)
- Knowledge flags
- PlayerPatterns (5 dimensions)
- SerializableGameState for persistence

---

### 3.7 Trust System (100% Complete)
**File:** `lib/trust-labels.ts` (50 lines)

| Trust Level | Label |
|-------------|-------|
| 0 | Stranger |
| 2+ | Observer |
| 4+ | Acquaintance |
| 6+ | Ally |
| 8+ | Confidant |
| 10 | Kindred Spirit |

---

### 3.8 Consequence Echoes (85% Complete)
**File:** `lib/consequence-echoes.ts` (782 lines)

**Features:**
- Dialogue-based feedback (not toasts)
- Per-character voice
- Trust up/down responses
- Pattern recognition acknowledgments
- Orb milestone echoes
- Resonance echoes

**Gap:** Echo selection works, but display triggering is incomplete.

---

### 3.9 Game Store (95% Complete)
**File:** `lib/game-store.ts` (1,090 lines)

**Manages:**
- Message history
- Choice records
- Pattern tracking
- Skills integration
- Thoughts storage
- Character relationships
- Platform state

---

## Part IV: UI Components Status

### Active UI Elements (7 Total)
| Element | File | Status |
|---------|------|--------|
| Journal Panel | `Journal.tsx` | 85% |
| Constellation Panel | `ConstellationPanel.tsx` | 80% |
| Journey Summary | `JourneySummary.tsx` | 80% |
| Detail Modal | `DetailModal.tsx` | 90% |
| Error Display | `StatefulGameInterface.tsx` | 100% |
| Fixed Header | `StatefulGameInterface.tsx` | 100% |
| Fixed Choices | `StatefulGameInterface.tsx` | 85% |

### Main Components
| Component | Lines | Status |
|-----------|-------|--------|
| StatefulGameInterface | 1,511 | 90% |
| ChatPacedDialogue | 460 | 90% |
| GameChoices | 427 | 85% |
| Journal | 597 | 85% |
| PixelAvatar | 724 | 95% |
| RichTextRenderer | 270 | 85% |

---

## Part V: Data Persistence

### Sync Queue (90% Complete)
**File:** `lib/sync-queue.ts` (914 lines)

**Features:**
- Offline-first
- Automatic retry with exponential backoff
- Static export detection
- Max queue size enforcement

### Database Service (80% Complete)
**File:** `lib/database-service.ts` (905 lines)

**Mode:** Dual-write (localStorage primary, Supabase secondary)

---

## Part VI: API Routes

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

## Part VII: Custom Hooks

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

## Part VIII: Supporting Systems

| System | File | Status |
|--------|------|--------|
| Character Typing | `character-typing.ts` | 95% |
| Ambient Events | `ambient-events.ts` | 85% |
| Animations | `animations.ts` | 90% |
| Platform Resonance | `platform-resonance.ts` | 75% |
| Session Structure | `session-structure.ts` | 80% |
| Journey Narrative | `journey-narrative-generator.ts` | 85% |
| Character Relationships | `character-relationships.ts` | 80% |
| Skill Tracker | `skill-tracker.ts` | 85% |
| Career Analytics | `career-analytics.ts` | 75% |
| Engagement Metrics | `engagement-metrics.ts` | 80% |

---

## Part IX: Dead/Unused Code (Cleanup Candidates)

| File | Lines | Status | Action |
|------|-------|--------|--------|
| `scene-skill-mappings.ts` | 2,183 | DUPLICATE | DELETE |
| `crossroads-system.ts` | 1,272 | UNUSED | VERIFY then DELETE |
| `character-quirks.ts` | 1,394 | WRONG FOLDER | MOVE or DELETE |
| `character-depth.ts` | 1,310 | WRONG FOLDER | MOVE or DELETE |
| `birmingham-opportunities.ts` | 567 | WRONG FOLDER | MOVE or DELETE |

**Total Cleanup Opportunity:** 6,726 lines

---

## Part X: PRD vs. Reality Gaps

### ✅ ACCURATE (No Changes Needed)
- 5 Pattern Types
- Trust System
- Journey Summary
- Orbs Visualization
- Constellation Panel
- Journal UI
- Mobile-first
- Samuel as Hub

### ❌ IMPLEMENTED BUT NOT IN PRD
| Feature | File | Status |
|---------|------|--------|
| Identity Offering | `lib/identity-system.ts` | 80% |
| Pattern Unlocks | `lib/pattern-unlocks.ts` | 75% |
| Consequence Echoes | `lib/consequence-echoes.ts` | 85% |
| Session Boundaries | `SessionBoundaryAnnouncement.tsx` | 80% |
| Pattern Sensations | `lib/patterns.ts` | 100% |

### ❌ IN PRD BUT NOT IMPLEMENTED
| Feature | PRD Status | Action |
|---------|------------|--------|
| Capstone System | "5 nanostems → Capstone" | Mark as P2/Future |
| Data Sharing Flow | "Share with partner" | Mark as P2/Future |
| Cross-Nanostem Progression | "Cumulative tracking" | Station 2+ feature |
| Orb Spending | Implied | Clarify: orbs are earned-only |

### ❌ TERMINOLOGY MISMATCH
| PRD Term | Code Term | Canonical |
|----------|-----------|-----------|
| Nanostem | Dialogue graph | Dialogue graph |
| Experience | Arc/Journey | Journey |
| Skill Tree | Constellation | Constellation |

---

## Part XI: Activation Levels

| System | Built % | Activated % | Gap |
|--------|---------|-------------|-----|
| Consequence Echoes | 85% | 20% | 65% dormant |
| Identity System | 80% | 5% | 75% dormant |
| Pattern Unlocks | 75% | 10% | 65% dormant |
| Character Transformations | 90% | 10% | 80% dormant |
| Platform Resonance | 75% | 20% | 55% dormant |
| Orb Milestones | 95% | 15% | 80% dormant |
| Session Boundaries | 80% | 30% | 50% dormant |

**Key Insight:** 80% built, 30% activated. Need ACTIVATION, not addition.

---

## Part XII: Technical Debt Summary

| Category | Issue | Priority |
|----------|-------|----------|
| Dual State | game-store.ts vs character-state.ts | High |
| Dead Code | 6,726 lines identified | Medium |
| Type Safety | Some `any` types in API routes | Medium |
| Component Size | StatefulGameInterface 1,500+ lines | Low |
| File Organization | Some files in wrong folders | Low |

---

## Quick Reference

### Key Implementation Files
| Feature | File |
|---------|------|
| Patterns | `lib/patterns.ts` |
| Orbs | `lib/orbs.ts` |
| Trust | `lib/trust-labels.ts` |
| Characters | `lib/constellation/character-positions.ts` |
| Identity | `lib/identity-system.ts` |
| Unlocks | `lib/pattern-unlocks.ts` |
| Echoes | `lib/consequence-echoes.ts` |
| Journey | `components/JourneySummary.tsx` |
| Narrative | `lib/journey-narrative-generator.ts` |

---

*This document reflects what EXISTS. See 01_ENGINEERING_SYNTHESIS.md for what to BUILD.*
