# Core Gameplay Data Dictionary & Admin Simplification

**Last updated:** 2026-02-01

**Purpose:** Define the core gameplay loop (end-user value flow) and the canonical data dictionary that supports it, with direct code-backed references for every claim.

**Scope:** Core gameplay experience (not admin), plus a minimal admin surface inventory and kill list.

---

## 1) Core Gameplay Loop (Record → Extract → Review → Deliver/Export)

### Step 1 — Initialize/Load Core State (Record: session starts)
- **Input:** localStorage save (if present). **Output:** hydrated `GameState` in memory. ( `lib/game-state-manager.ts:19-113` )
- If no save exists, a new user ID is generated and a new `GameState` is created. ( `hooks/game/useGameInitializer.ts:55-59` )
- `GameState` is the master runtime object for narrative decisions (playerId, currentNodeId, currentCharacterId, patterns, globalFlags, skillLevels, etc.). ( `lib/character-state.ts:88-139` )

### Step 2 — Ensure a DB Profile Exists (Record: create/ensure player record)
- During initialization, the client POSTs to `/api/user/profile` with `user_id` and `created_at` to ensure a `player_profiles` record exists before tracking. ( `hooks/game/useGameInitializer.ts:77-95` )
- The profile endpoint upserts into `player_profiles` and returns the profile. ( `app/api/user/profile/route.ts:31-83` )
- The `player_profiles` table stores core player info and current scene/last activity metadata. ( `supabase/migrations/001_setup.sql:139-150` )

### Step 3 — Present Narrative + Choices (Review: player sees the world)
- Dialogue content is modeled as `DialogueNode` with `content[]` and `choices[]` (`ConditionalChoice`). ( `lib/dialogue-graph.ts:21-82`, `lib/dialogue-graph.ts:342-369` )
- The main UI (`StatefulGameInterface`) renders the gameplay and passes available choices to the footer. ( `components/StatefulGameInterface.tsx:1407-1419` )

### Step 4 — Apply Choice → Update State (Record: canonical choice handling)
- Choice handling runs through a unified processor (`GameLogic.processChoice`) to produce the next `GameState`. ( `hooks/game/useChoiceHandler.ts:165-176` )
- State is persisted atomically to both Zustand and localStorage using `commitGameState`. ( `hooks/game/useChoiceHandler.ts:1541-1543`, `lib/game-store.ts:1011-1039` )
- Choice history is also recorded into the in-memory UI store for Journal/summary usage. ( `hooks/game/useChoiceHandler.ts:1545-1552` )

### Step 5 — Extract Signals (Extract: patterns/skills/relationships)
- Pattern demonstrations are queued for sync when a pattern is earned on a choice. ( `hooks/game/useChoiceHandler.ts:192-205` )
- Skill extraction happens in `SkillTracker.recordChoice`, which extracts demonstrations and queues **both** granular demonstrations and aggregated summaries. ( `lib/skill-tracker.ts:120-207` )
- Relationship progress and platform state are queued for sync on each choice when Supabase is configured. ( `hooks/game/useChoiceHandler.ts:1556-1577` )
- The sync queue persists actions offline-first in localStorage and later syncs. ( `lib/sync-queue.ts:1-113` )

### Step 6 — Review Progress (Review: Journal + Journey)
- The Journal panel is the core player-facing review surface (opened from the main game). ( `components/StatefulGameInterface.tsx:1489-1495`, `components/Journal.tsx:55-78` )
- Constellation is an additional review/overview surface. ( `components/StatefulGameInterface.tsx:1497-1503` )
- Journey Summary is generated and shown after ending flow. ( `components/StatefulGameInterface.tsx:1507-1514`, `components/StatefulGameInterface.tsx:1389-1397` )

### Step 7 — Deliver/Export (Deliver: career profile output)
- Ending panel exposes **See Your Journey** and **Export Career Profile** actions. ( `components/game/EndingPanel.tsx:31-56` )
- The export opens `StrategyReport`, which renders a printable report and includes an **Export PDF** action (`window.print()`). ( `components/StatefulGameInterface.tsx:1531-1538`, `components/career/StrategyReport.tsx:54-74` )

---

## 2) Canonical Data Dictionary

### A) Runtime Models (Client)

#### `GameState` (core narrative state)
- **Purpose:** Master runtime state used for narrative decisions and persistence. ( `lib/character-state.ts:88-103` )
- **Owner system:** Client runtime (localStorage + Zustand). ( `lib/game-state-manager.ts:19-55`, `lib/game-store.ts:1011-1039` )
- **Storage location:** `lib/character-state.ts` (type), `lib/game-state-manager.ts` (localStorage persistence). ( `lib/character-state.ts:88-139`, `lib/game-state-manager.ts:19-55` )
- **Key fields:** `playerId`, `currentNodeId`, `currentCharacterId`, `characters`, `globalFlags`, `patterns`, `skillLevels`, `skillUsage`. ( `lib/character-state.ts:92-139` )
- **Relationships:** `characters` map to `CharacterState`; `patterns` is `PlayerPatterns`. ( `lib/character-state.ts:92-139`, `lib/character-state.ts:156-162` )
- **Lifecycle events:** create new in `useGameInitializer`, load/save via `GameStateManager`, persist via `commitGameState`. ( `hooks/game/useGameInitializer.ts:55-70`, `lib/game-state-manager.ts:31-113`, `lib/game-store.ts:1011-1039` )
- **APIs/endpoints:** DB sync is queued separately (pattern/relationship/platform sync). ( `hooks/game/useChoiceHandler.ts:192-205`, `hooks/game/useChoiceHandler.ts:1556-1577` )
- **UI surfaces:** `StatefulGameInterface`, `StrategyReport`, `EndingPanel` consume `GameState`. ( `components/StatefulGameInterface.tsx:105-111`, `components/career/StrategyReport.tsx:1-29`, `components/game/EndingPanel.tsx:7-20` )

#### `CharacterState`
- **Purpose:** Per-NPC relationship state (trust, anxiety, knowledge flags, history). ( `lib/character-state.ts:15-34` )
- **Owner system:** Client runtime (part of `GameState`). ( `lib/character-state.ts:92-107` )
- **Storage location:** `lib/character-state.ts`. ( `lib/character-state.ts:15-34` )
- **Key fields:** `trust`, `anxiety`, `knowledgeFlags`, `relationshipStatus`, `conversationHistory`. ( `lib/character-state.ts:19-34` )
- **Relationships:** Stored in `GameState.characters`. ( `lib/character-state.ts:92-97` )
- **Lifecycle events:** Updated through choice processing and persisted via `commitGameState`. ( `hooks/game/useChoiceHandler.ts:165-176`, `lib/game-store.ts:1011-1039` )
- **APIs/endpoints:** Relationship sync to Supabase is queued. ( `hooks/game/useChoiceHandler.ts:1556-1568` )
- **UI surfaces:** Used indirectly by UI via `GameState`. ( `components/StatefulGameInterface.tsx:105-111` )

#### `PlayerPatterns`
- **Purpose:** Tracks player behavioral pattern counters. ( `lib/character-state.ts:152-162` )
- **Owner system:** Client runtime. ( `lib/character-state.ts:92-99` )
- **Storage location:** `lib/character-state.ts`. ( `lib/character-state.ts:152-162` )
- **Key fields:** `analytical`, `helping`, `building`, `patience`, `exploring`. ( `lib/character-state.ts:156-162` )
- **Relationships:** Part of `GameState.patterns`. ( `lib/character-state.ts:96-99` )
- **Lifecycle events:** Modified via choice processing and persisted via `commitGameState`. ( `hooks/game/useChoiceHandler.ts:165-176`, `lib/game-store.ts:1011-1039` )
- **APIs/endpoints:** Pattern demonstrations are queued to `/api/user/pattern-demonstrations`. ( `hooks/game/useChoiceHandler.ts:192-205`, `app/api/user/pattern-demonstrations/route.ts:27-70` )
- **UI surfaces:** Pattern-driven UI lives in Journal and in-game feedback systems. ( `components/Journal.tsx:71-80`, `components/StatefulGameInterface.tsx:1489-1495` )

#### `StateCondition` + `StateChange`
- **Purpose:** Conditions gate content/choices; changes apply explicit state mutations. ( `lib/character-state.ts:164-216` )
- **Owner system:** Client runtime. ( `lib/character-state.ts:164-216` )
- **Storage location:** `lib/character-state.ts`. ( `lib/character-state.ts:164-216` )
- **Key fields:** trust, flags, patterns, mysteries (`StateCondition`); trustChange, flags, patternChanges (`StateChange`). ( `lib/character-state.ts:168-216` )
- **Relationships:** Used in `DialogueNode` and `ConditionalChoice`. ( `lib/dialogue-graph.ts:33-43`, `lib/dialogue-graph.ts:351-367` )
- **Lifecycle events:** Applied during choice processing (via `GameLogic.processChoice`). ( `hooks/game/useChoiceHandler.ts:165-176` )
- **APIs/endpoints:** Not directly persisted; results propagate through `GameState`. ( `hooks/game/useChoiceHandler.ts:165-176`, `lib/game-store.ts:1011-1039` )
- **UI surfaces:** Affects which choices appear in UI. ( `lib/dialogue-graph.ts:342-357` )

### B) Dialogue Graph Models

#### `DialogueNode`
- **Purpose:** The atomic narrative unit: content + choices + state gates. ( `lib/dialogue-graph.ts:21-82` )
- **Owner system:** Content layer (dialogue graphs) with runtime evaluation. ( `lib/dialogue-graph.ts:21-82`, `lib/graph-registry.ts:44-77` )
- **Storage location:** `lib/dialogue-graph.ts` (type) + `content/*-dialogue-graph.ts` (instances). ( `lib/dialogue-graph.ts:21-82`, `lib/graph-registry.ts:12-77` )
- **Key fields:** `nodeId`, `speaker`, `content[]`, `choices[]`, `requiredState`, `onEnter`, `onExit`. ( `lib/dialogue-graph.ts:25-43` )
- **Relationships:** Choices are `ConditionalChoice` objects. ( `lib/dialogue-graph.ts:36-37`, `lib/dialogue-graph.ts:342-367` )
- **Lifecycle events:** Selected by `StatefulGameInterface` navigation logic. ( `components/StatefulGameInterface.tsx:118-132` )
- **APIs/endpoints:** None (client-only narrative content). ( `lib/graph-registry.ts:44-77` )
- **UI surfaces:** Dialogue display and game flow. ( `components/StatefulGameInterface.tsx:94-99`, `components/StatefulGameInterface.tsx:1407-1419` )

#### `ConditionalChoice`
- **Purpose:** Choice definition with visibility rules and consequences. ( `lib/dialogue-graph.ts:342-367` )
- **Owner system:** Content layer + runtime evaluation. ( `lib/dialogue-graph.ts:342-367` )
- **Storage location:** `lib/dialogue-graph.ts` (type) + `content/*-dialogue-graph.ts`. ( `lib/dialogue-graph.ts:342-367`, `lib/graph-registry.ts:12-77` )
- **Key fields:** `choiceId`, `text`, `nextNodeId`, `visibleCondition`, `enabledCondition`, `pattern`, `skills`, `consequence`. ( `lib/dialogue-graph.ts:346-367` )
- **Relationships:** Applies `StateChange`, links to next `DialogueNode`. ( `lib/dialogue-graph.ts:346-367` )
- **Lifecycle events:** Evaluated and passed to `GameFooter` via `StatefulGameInterface`. ( `components/StatefulGameInterface.tsx:1407-1419` )
- **APIs/endpoints:** Pattern/skill signals are synced after choice handling. ( `hooks/game/useChoiceHandler.ts:192-205`, `lib/skill-tracker.ts:120-207` )
- **UI surfaces:** Choices are rendered in the game footer. ( `components/StatefulGameInterface.tsx:1407-1419` )

#### `SimulationConfig`
- **Purpose:** Defines mini-game/simulation configuration for a dialogue node. ( `lib/dialogue-graph.ts:116-192` )
- **Owner system:** Content + runtime. ( `lib/dialogue-graph.ts:116-192` )
- **Storage location:** `lib/dialogue-graph.ts`. ( `lib/dialogue-graph.ts:116-192` )
- **Key fields:** `type`, `title`, `taskDescription`, `initialContext`, `successFeedback`, `mode`, `phase`. ( `lib/dialogue-graph.ts:120-178` )
- **Relationships:** Optional on `DialogueNode.simulation`. ( `lib/dialogue-graph.ts:76-81` )
- **Lifecycle events:** Rendered by game UI when present. ( `components/StatefulGameInterface.tsx:94-99`, `components/StatefulGameInterface.tsx:1407-1419` )
- **APIs/endpoints:** None. ( `lib/dialogue-graph.ts:116-192` )
- **UI surfaces:** Simulation UI lives in the main game loop and Journal sims tab. ( `components/StatefulGameInterface.tsx:94-99`, `components/Journal.tsx:21-25` )

#### `InterruptWindow`
- **Purpose:** Timed interrupt actions during dialogue. ( `lib/dialogue-graph.ts:316-339` )
- **Owner system:** Content + runtime. ( `lib/dialogue-graph.ts:316-339` )
- **Storage location:** `lib/dialogue-graph.ts`. ( `lib/dialogue-graph.ts:316-339` )
- **Key fields:** `duration`, `type`, `action`, `targetNodeId`, `consequence`. ( `lib/dialogue-graph.ts:322-337` )
- **Relationships:** Optional on dialogue content; affects navigation. ( `lib/dialogue-graph.ts:300-313` )
- **Lifecycle events:** Triggered by `StatefulGameInterface` when present. ( `components/StatefulGameInterface.tsx:94-99` )
- **APIs/endpoints:** None. ( `lib/dialogue-graph.ts:316-339` )
- **UI surfaces:** Interrupt button UI. ( `components/StatefulGameInterface.tsx:95-96` )

### C) UI State Types

#### `GameInterfaceState`
- **Purpose:** UI state for the main gameplay interface (current node, choices, overlays, modals). ( `lib/game-interface-types.ts:22-69` )
- **Owner system:** Client UI state. ( `lib/game-interface-types.ts:22-69` )
- **Storage location:** `lib/game-interface-types.ts`. ( `lib/game-interface-types.ts:22-69` )
- **Key fields:** `currentNode`, `currentCharacterId`, `availableChoices`, `showJournal`, `showJourneySummary`, `showReport`, `activeInterrupt`. ( `lib/game-interface-types.ts:22-69` )
- **Relationships:** References `DialogueNode`, `EvaluatedChoice`, `InterruptWindow`. ( `lib/game-interface-types.ts:7-16`, `lib/game-interface-types.ts:22-69` )
- **Lifecycle events:** Mutated by gameplay hooks (choice handler, initializer). ( `hooks/game/useChoiceHandler.ts:142-155`, `hooks/game/useGameInitializer.ts:45-70` )
- **APIs/endpoints:** None (UI-only). ( `lib/game-interface-types.ts:22-69` )
- **UI surfaces:** Drives overlays such as Journal and Journey Summary. ( `components/StatefulGameInterface.tsx:1489-1514` )

### D) Validation / Model Schemas

#### `LocalPlayerDataSchema` (Zod)
- **Purpose:** Validate localStorage player data for sync integrity. ( `lib/schemas/player-data.ts:1-6`, `lib/schemas/player-data.ts:115-136` )
- **Owner system:** Client validation layer. ( `lib/schemas/player-data.ts:1-6` )
- **Storage location:** `lib/schemas/player-data.ts`. ( `lib/schemas/player-data.ts:115-136` )
- **Key fields:** `currentScene`, `totalDemonstrations`, `skillDemonstrations`, `careerExplorations`, `relationships`, `visitedScenes`, `choiceHistory`, `patterns`, `behavioralProfile`, `milestones`. ( `lib/schemas/player-data.ts:124-135` )
- **Relationships:** Used to parse localStorage payloads. ( `lib/schemas/player-data.ts:165-185` )
- **Lifecycle events:** Used when parsing stored JSON. ( `lib/schemas/player-data.ts:165-185` )
- **APIs/endpoints:** None (validation only). ( `lib/schemas/player-data.ts:165-185` )
- **UI surfaces:** Indirectly supports UI consistency by validating data. ( `lib/schemas/player-data.ts:1-6` )

### E) Static Catalogs

#### `PatternType`
- **Purpose:** Canonical list of patterns. ( `lib/patterns.ts:14-25` )
- **Owner system:** Content metadata. ( `lib/patterns.ts:1-6` )
- **Storage location:** `lib/patterns.ts`. ( `lib/patterns.ts:14-25` )
- **Key fields:** `analytical`, `patience`, `exploring`, `helping`, `building`. ( `lib/patterns.ts:17-23` )
- **Relationships:** Used by `PlayerPatterns` and `ConditionalChoice.pattern`. ( `lib/character-state.ts:156-162`, `lib/dialogue-graph.ts:357-361` )
- **Lifecycle events:** Updated through choice processing. ( `hooks/game/useChoiceHandler.ts:165-176` )
- **APIs/endpoints:** Pattern demonstrations API validates against `PATTERN_TYPES`. ( `app/api/user/pattern-demonstrations/route.ts:11-52` )
- **UI surfaces:** Pattern-based UI in Journal. ( `components/Journal.tsx:29-80` )

#### `SkillDefinition`
- **Purpose:** Canonical definitions for skills used in career profiling. ( `lib/skill-definitions.ts:1-8`, `lib/skill-definitions.ts:10-18` )
- **Owner system:** Content metadata. ( `lib/skill-definitions.ts:1-8` )
- **Storage location:** `lib/skill-definitions.ts`. ( `lib/skill-definitions.ts:1-18` )
- **Key fields:** `id`, `title`, `definition`, `manifesto`. ( `lib/skill-definitions.ts:1-8` )
- **Relationships:** Skills are referenced in `SkillTracker` and skill summaries. ( `lib/skill-tracker.ts:30-37`, `lib/skill-tracker.ts:163-199` )
- **Lifecycle events:** Static catalog. ( `lib/skill-definitions.ts:10-18` )
- **APIs/endpoints:** Skill summaries and demonstrations carry skill IDs. ( `app/api/user/skill-demonstrations/route.ts:42-68`, `app/api/user/skill-summaries/route.ts:94-151` )
- **UI surfaces:** Used in StrategyReport and Journal career views. ( `components/career/StrategyReport.tsx:1-29`, `components/Journal.tsx:23-26` )

#### `Emotion Types`
- **Purpose:** Canonical emotion tags for dialogue content. ( `lib/emotions.ts:1-18` )
- **Owner system:** Content metadata. ( `lib/emotions.ts:1-18` )
- **Storage location:** `lib/emotions.ts`. ( `lib/emotions.ts:1-18` )
- **Key fields:** `EMOTION_TYPES` array of primary emotions. ( `lib/emotions.ts:18-64` )
- **Relationships:** Dialogue content uses `emotion` field. ( `lib/dialogue-graph.ts:198-205` )
- **Lifecycle events:** Static catalog. ( `lib/emotions.ts:18-64` )
- **APIs/endpoints:** None. ( `lib/emotions.ts:1-18` )
- **UI surfaces:** Dialogue rendering uses emotion for effects. ( `lib/dialogue-graph.ts:198-205`, `components/StatefulGameInterface.tsx:94-99` )

### F) Database Tables (Supabase)

> **Note:** All table definitions below are from `supabase/migrations/*` (schema of record).

#### `public.profiles` (auth profiles)
- **Purpose:** Auth-linked user profiles with role. ( `supabase/migrations/001_setup.sql:11-18` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/001_setup.sql:11-18` )
- **Storage location:** `supabase/migrations/001_setup.sql`. ( `supabase/migrations/001_setup.sql:11-18` )
- **Key fields:** `user_id`, `email`, `full_name`, `role`, `created_at`, `updated_at`. ( `supabase/migrations/001_setup.sql:11-18` )
- **Relationships:** `user_id` references `auth.users`. ( `supabase/migrations/001_setup.sql:11-12` )
- **Lifecycle events:** Auto-created on auth signup via trigger. ( `supabase/migrations/001_setup.sql:37-55` )
- **APIs/endpoints:** Admin UI reads this table directly in `/admin/users`. ( `app/admin/users/page.tsx:67-72` )
- **UI surfaces:** `/admin/users` list. ( `app/admin/users/page.tsx:146-190` )

#### `player_profiles`
- **Purpose:** Core player profile and current game metadata. ( `supabase/migrations/001_setup.sql:139-150` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/001_setup.sql:139-150` )
- **Storage location:** `supabase/migrations/001_setup.sql`. ( `supabase/migrations/001_setup.sql:139-150` )
- **Key fields:** `user_id`, `current_scene`, `total_demonstrations`, `last_activity`, `game_version`, `platform`. ( `supabase/migrations/001_setup.sql:139-148` )
- **Relationships:** `user_id` referenced by many child tables. ( `supabase/migrations/001_setup.sql:163-166`, `supabase/migrations/001_setup.sql:182-185` )
- **Lifecycle events:** Upserted by `/api/user/profile`. ( `app/api/user/profile/route.ts:31-83` )
- **APIs/endpoints:** `/api/user/profile` GET/POST. ( `app/api/user/profile/route.ts:31-136` )
- **UI surfaces:** Admin urgency proxy reads `player_profiles`. ( `app/api/admin-proxy/urgency/route.ts:94-99` )

#### `skill_demonstrations`
- **Purpose:** Records each skill-aligned choice as evidence. ( `supabase/migrations/001_setup.sql:155-167` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/001_setup.sql:155-167` )
- **Storage location:** `supabase/migrations/001_setup.sql`, `supabase/migrations/012_add_scene_descriptions.sql`. ( `supabase/migrations/001_setup.sql:155-167`, `supabase/migrations/012_add_scene_descriptions.sql:8-16` )
- **Key fields:** `user_id`, `skill_name`, `scene_id`, `scene_description`, `choice_text`, `context`, `demonstrated_at`. ( `supabase/migrations/001_setup.sql:156-162`, `supabase/migrations/012_add_scene_descriptions.sql:8-12` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/001_setup.sql:163-166` )
- **Lifecycle events:** Inserted by `/api/user/skill-demonstrations`. ( `app/api/user/skill-demonstrations/route.ts:29-70` )
- **APIs/endpoints:** `/api/user/skill-demonstrations` POST. ( `app/api/user/skill-demonstrations/route.ts:29-77` )
- **UI surfaces:** Admin evidence API reads this table. ( `app/api/admin/evidence/[userId]/route.ts:91-97` )

#### `skill_summaries`
- **Purpose:** Aggregated per-skill summaries with latest context. ( `supabase/migrations/006_skill_summaries_table.sql:12-23` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/006_skill_summaries_table.sql:12-23` )
- **Storage location:** `supabase/migrations/006_skill_summaries_table.sql`, `supabase/migrations/012_add_scene_descriptions.sql`. ( `supabase/migrations/006_skill_summaries_table.sql:12-23`, `supabase/migrations/012_add_scene_descriptions.sql:23-27` )
- **Key fields:** `user_id`, `skill_name`, `demonstration_count`, `latest_context`, `scenes_involved`, `scene_descriptions`, `last_demonstrated`. ( `supabase/migrations/006_skill_summaries_table.sql:12-22`, `supabase/migrations/012_add_scene_descriptions.sql:23-27` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/006_skill_summaries_table.sql:12-15` )
- **Lifecycle events:** Upserted via `/api/user/skill-summaries`. ( `app/api/user/skill-summaries/route.ts:94-151` )
- **APIs/endpoints:** `/api/user/skill-summaries` GET/POST. ( `app/api/user/skill-summaries/route.ts:35-165` )
- **UI surfaces:** Admin evidence API reads this table. ( `app/api/admin/evidence/[userId]/route.ts:99-105` )

#### `pattern_demonstrations`
- **Purpose:** Records each decision pattern demonstrated by a choice. ( `supabase/migrations/010_pattern_tracking.sql:6-23` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/010_pattern_tracking.sql:6-23` )
- **Storage location:** `supabase/migrations/010_pattern_tracking.sql`, `supabase/migrations/012_add_scene_descriptions.sql`. ( `supabase/migrations/010_pattern_tracking.sql:10-19`, `supabase/migrations/012_add_scene_descriptions.sql:29-33` )
- **Key fields:** `user_id`, `pattern_name`, `choice_id`, `choice_text`, `scene_id`, `scene_description`, `character_id`, `context`, `demonstrated_at`. ( `supabase/migrations/010_pattern_tracking.sql:10-20`, `supabase/migrations/012_add_scene_descriptions.sql:29-33` )
- **Relationships:** No FK enforced (per migration comment). ( `supabase/migrations/010_pattern_tracking.sql:21-22` )
- **Lifecycle events:** Inserted by `/api/user/pattern-demonstrations`. ( `app/api/user/pattern-demonstrations/route.ts:27-72` )
- **APIs/endpoints:** `/api/user/pattern-demonstrations` POST. ( `app/api/user/pattern-demonstrations/route.ts:27-81` )
- **UI surfaces:** Supports pattern analytics (views in migration). ( `supabase/migrations/010_pattern_tracking.sql:50-79` )

#### `career_explorations`
- **Purpose:** Track career paths explored and match scores. ( `supabase/migrations/001_setup.sql:173-187` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/001_setup.sql:173-187` )
- **Storage location:** `supabase/migrations/001_setup.sql`. ( `supabase/migrations/001_setup.sql:173-187` )
- **Key fields:** `user_id`, `career_name`, `match_score`, `readiness_level`, `local_opportunities`, `education_paths`. ( `supabase/migrations/001_setup.sql:175-181` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/001_setup.sql:182-185` )
- **Lifecycle events:** Upserted by `/api/user/career-explorations`. ( `app/api/user/career-explorations/route.ts:35-90` )
- **APIs/endpoints:** `/api/user/career-explorations` GET/POST. ( `app/api/user/career-explorations/route.ts:35-126` )
- **UI surfaces:** Admin evidence API reads this table. ( `app/api/admin/evidence/[userId]/route.ts:106-113` )

#### `relationship_progress`
- **Purpose:** Track trust level and relationship status with NPCs. ( `supabase/migrations/001_setup.sql:192-204` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/001_setup.sql:192-204` )
- **Storage location:** `supabase/migrations/001_setup.sql`. ( `supabase/migrations/001_setup.sql:192-204` )
- **Key fields:** `user_id`, `character_name`, `trust_level`, `last_interaction`, `key_moments`. ( `supabase/migrations/001_setup.sql:194-198` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/001_setup.sql:199-202` )
- **Lifecycle events:** Upserted via `/api/user/relationship-progress`. ( `app/api/user/relationship-progress/route.ts:28-67` )
- **APIs/endpoints:** `/api/user/relationship-progress` GET/POST. ( `app/api/user/relationship-progress/route.ts:28-106` )
- **UI surfaces:** Admin evidence API reads this table. ( `app/api/admin/evidence/[userId]/route.ts:114-119` )

#### `platform_states`
- **Purpose:** Track platform warmth/accessibility per user and persist aggregate core state snapshots used by sync. ( `supabase/migrations/001_setup.sql:209-222`, `supabase/migrations/019_align_gameplay_contracts.sql:12-20` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/001_setup.sql:209-222` )
- **Storage location:** `supabase/migrations/001_setup.sql`, `supabase/migrations/019_align_gameplay_contracts.sql`. ( `supabase/migrations/001_setup.sql:209-222`, `supabase/migrations/019_align_gameplay_contracts.sql:12-20` )
- **Key fields:** `user_id`, `platform_id`, `warmth`, `accessible`, `discovered`, `updated_at`, `current_scene`, `global_flags`, `patterns`. ( `supabase/migrations/001_setup.sql:210-216`, `supabase/migrations/019_align_gameplay_contracts.sql:12-15` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/001_setup.sql:217-220` )
- **Lifecycle events:** Upserted via `/api/user/platform-state` (defaults `platform_id` to `core` for aggregate sync). ( `app/api/user/platform-state/route.ts:28-70` )
- **APIs/endpoints:** `/api/user/platform-state` GET/POST. ( `app/api/user/platform-state/route.ts:28-101` )
- **UI surfaces:** Admin evidence API reads `platform_states.warmth`. ( `app/api/admin/evidence/[userId]/route.ts:121-127` )

#### `visited_scenes`
- **Purpose:** Records scenes visited per player. ( `supabase/migrations/002_normalized_core.sql:26-33` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/002_normalized_core.sql:26-33` )
- **Storage location:** `supabase/migrations/002_normalized_core.sql`. ( `supabase/migrations/002_normalized_core.sql:26-33` )
- **Key fields:** `player_id`, `scene_id`, `visited_at`. ( `supabase/migrations/002_normalized_core.sql:27-31` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/002_normalized_core.sql:28-33` )
- **Lifecycle events:** DatabaseService has `recordSceneVisitToSupabase`. ( `lib/database-service.ts:712-723` )
- **APIs/endpoints:** None explicitly; accessed via DatabaseService. ( `lib/database-service.ts:712-723`, `lib/database-service.ts:747-758` )
- **UI surfaces:** Used indirectly for analytics/urgency calculations. ( `supabase/migrations/003_urgency_triage.sql:101-109` )

#### `choice_history`
- **Purpose:** Records each player choice for analytics. ( `supabase/migrations/002_normalized_core.sql:40-54` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/002_normalized_core.sql:40-54` )
- **Storage location:** `supabase/migrations/002_normalized_core.sql`. ( `supabase/migrations/002_normalized_core.sql:40-54` )
- **Key fields:** `player_id`, `scene_id`, `choice_id`, `choice_text`, `chosen_at`. ( `supabase/migrations/002_normalized_core.sql:41-47` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/002_normalized_core.sql:42-44` )
- **Lifecycle events:** DatabaseService has `recordChoiceToSupabase`. ( `lib/database-service.ts:730-739` )
- **APIs/endpoints:** None explicitly; accessed via DatabaseService. ( `lib/database-service.ts:730-739`, `lib/database-service.ts:761-778` )
- **UI surfaces:** Used indirectly for urgency calculations. ( `supabase/migrations/003_urgency_triage.sql:100-103` )

#### `player_patterns`
- **Purpose:** Normalized pattern values for analytics. ( `supabase/migrations/002_normalized_core.sql:60-75` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/002_normalized_core.sql:60-75` )
- **Storage location:** `supabase/migrations/002_normalized_core.sql`. ( `supabase/migrations/002_normalized_core.sql:60-69` )
- **Key fields:** `player_id`, `pattern_name`, `pattern_value`, `demonstration_count`, `updated_at`. ( `supabase/migrations/002_normalized_core.sql:60-69` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/002_normalized_core.sql:61-62` )
- **Lifecycle events:** DatabaseService updates patterns. ( `lib/database-service.ts:781-793` )
- **APIs/endpoints:** None explicitly; accessed via DatabaseService. ( `lib/database-service.ts:781-815` )
- **UI surfaces:** Used indirectly in urgency calculations. ( `supabase/migrations/003_urgency_triage.sql:110-118` )

#### `player_behavioral_profiles`
- **Purpose:** Normalized behavioral traits for cohort analysis. ( `supabase/migrations/002_normalized_core.sql:81-102` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/002_normalized_core.sql:81-102` )
- **Storage location:** `supabase/migrations/002_normalized_core.sql`. ( `supabase/migrations/002_normalized_core.sql:81-102` )
- **Key fields:** `response_speed`, `stress_response`, `social_orientation`, `problem_approach`, `communication_style`, `cultural_alignment`. ( `supabase/migrations/002_normalized_core.sql:85-93` )
- **Relationships:** FK to `player_profiles(user_id)` via `player_id`. ( `supabase/migrations/002_normalized_core.sql:81-83` )
- **Lifecycle events:** DatabaseService reads/writes this table. ( `lib/database-service.ts:818-866` )
- **APIs/endpoints:** None explicitly; accessed via DatabaseService. ( `lib/database-service.ts:818-866` )
- **UI surfaces:** Not directly referenced in core UI. ( `lib/database-service.ts:818-866` )

#### `skill_milestones`
- **Purpose:** Track milestone events (journey start, demonstrations, arcs). ( `supabase/migrations/002_normalized_core.sql:125-149` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/002_normalized_core.sql:125-149` )
- **Storage location:** `supabase/migrations/002_normalized_core.sql`. ( `supabase/migrations/002_normalized_core.sql:128-143` )
- **Key fields:** `player_id`, `milestone_type`, `milestone_context`, `reached_at`. ( `supabase/migrations/002_normalized_core.sql:128-143` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/002_normalized_core.sql:130-131` )
- **Lifecycle events:** DatabaseService inserts milestones. ( `lib/database-service.ts:868-877` )
- **APIs/endpoints:** None explicitly; accessed via DatabaseService. ( `lib/database-service.ts:868-877` )
- **UI surfaces:** Used for urgency calculation. ( `supabase/migrations/003_urgency_triage.sql:123-125` )

#### `relationship_key_moments`
- **Purpose:** Normalized key moments in NPC relationships. ( `supabase/migrations/002_normalized_core.sql:155-168` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/002_normalized_core.sql:155-168` )
- **Storage location:** `supabase/migrations/002_normalized_core.sql`. ( `supabase/migrations/002_normalized_core.sql:155-168` )
- **Key fields:** `relationship_id`, `scene_id`, `choice_text`, `context`, `occurred_at`. ( `supabase/migrations/002_normalized_core.sql:156-163` )
- **Relationships:** FK to `relationship_progress(id)`. ( `supabase/migrations/002_normalized_core.sql:157-158` )
- **Lifecycle events:** Not directly referenced in runtime code (see Open Questions). ( `supabase/migrations/002_normalized_core.sql:155-168` )
- **APIs/endpoints:** None shown. ( `supabase/migrations/002_normalized_core.sql:155-168` )
- **UI surfaces:** None shown. ( `supabase/migrations/002_normalized_core.sql:155-168` )

#### `career_local_opportunities`
- **Purpose:** Normalize Birmingham opportunities per career. ( `supabase/migrations/002_normalized_core.sql:170-184` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/002_normalized_core.sql:170-184` )
- **Storage location:** `supabase/migrations/002_normalized_core.sql`. ( `supabase/migrations/002_normalized_core.sql:170-184` )
- **Key fields:** `career_exploration_id`, `opportunity_name`, `opportunity_type`, `url`. ( `supabase/migrations/002_normalized_core.sql:171-178` )
- **Relationships:** FK to `career_explorations(id)`. ( `supabase/migrations/002_normalized_core.sql:173-174` )
- **Lifecycle events:** Not directly referenced in runtime code (see Open Questions). ( `supabase/migrations/002_normalized_core.sql:170-184` )
- **APIs/endpoints:** None shown. ( `supabase/migrations/002_normalized_core.sql:170-184` )
- **UI surfaces:** None shown. ( `supabase/migrations/002_normalized_core.sql:170-184` )

#### `career_analytics`
- **Purpose:** Persist career analytics (platforms explored, interests, UI engagement metrics). ( `supabase/migrations/005_career_analytics_table.sql:11-19`, `supabase/migrations/019_align_gameplay_contracts.sql:22-29` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/005_career_analytics_table.sql:11-19` )
- **Storage location:** `supabase/migrations/005_career_analytics_table.sql`, `supabase/migrations/019_align_gameplay_contracts.sql`. ( `supabase/migrations/005_career_analytics_table.sql:11-19`, `supabase/migrations/019_align_gameplay_contracts.sql:22-29` )
- **Key fields:** `user_id`, `platforms_explored`, `career_interests`, `choices_made`, `time_spent_seconds`, `sections_viewed`, `birmingham_opportunities`, `last_updated`. ( `supabase/migrations/005_career_analytics_table.sql:12-18`, `supabase/migrations/019_align_gameplay_contracts.sql:22-25` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/005_career_analytics_table.sql:12-13` )
- **Lifecycle events:** Upserted by `/api/user/career-analytics`. ( `app/api/user/career-analytics/route.ts:94-123` )
- **APIs/endpoints:** `/api/user/career-analytics` GET/POST. ( `app/api/user/career-analytics/route.ts:33-131` )
- **UI surfaces:** None shown in core UI. ( `app/api/user/career-analytics/route.ts:33-131` )

#### `user_action_plans`
- **Purpose:** Store the player's exported/committed action plan payload. ( `supabase/migrations/019_align_gameplay_contracts.sql:35-41` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/019_align_gameplay_contracts.sql:35-41` )
- **Storage location:** `supabase/migrations/019_align_gameplay_contracts.sql`. ( `supabase/migrations/019_align_gameplay_contracts.sql:35-41` )
- **Key fields:** `user_id`, `plan_data`, `created_at`, `updated_at`. ( `supabase/migrations/019_align_gameplay_contracts.sql:35-39` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/019_align_gameplay_contracts.sql:35-36` )
- **Lifecycle events:** Upserted by `/api/user/action-plan`. ( `app/api/user/action-plan/route.ts:34-43` )
- **APIs/endpoints:** `/api/user/action-plan` POST. ( `app/api/user/action-plan/route.ts:19-50` )
- **UI surfaces:** Action plan export/save flow (client-side). ( `app/api/user/action-plan/route.ts:19-50` )

#### `player_urgency_scores`
- **Purpose:** Stores urgency scores and narrative justification for admin triage. ( `supabase/migrations/003_urgency_triage.sql:14-41` )
- **Owner system:** Supabase/Postgres. ( `supabase/migrations/003_urgency_triage.sql:14-41` )
- **Storage location:** `supabase/migrations/003_urgency_triage.sql`. ( `supabase/migrations/003_urgency_triage.sql:19-41` )
- **Key fields:** `player_id`, `urgency_score`, `urgency_level`, factor scores, `urgency_narrative`. ( `supabase/migrations/003_urgency_triage.sql:20-34` )
- **Relationships:** FK to `player_profiles(user_id)`. ( `supabase/migrations/003_urgency_triage.sql:20-21` )
- **Lifecycle events:** Calculated via `calculate_urgency_score` function. ( `supabase/migrations/003_urgency_triage.sql:50-171` )
- **APIs/endpoints:** Consumed via `/api/admin/urgency` and proxied by `/api/admin-proxy/urgency`. ( `app/api/admin-proxy/urgency/route.ts:32-55`, `app/api/admin-proxy/urgency/route.ts:129-146` )
- **UI surfaces:** `UrgencySection` in `/admin/[userId]` renders this data. ( `components/admin/sections/UrgencySection.tsx:16-28`, `components/admin/sections/UrgencySection.tsx:42-90` )

---

## 3) Admin Surface Inventory (Minimal)

### Admin UI Surfaces

1) **/admin → /admin/users**
- **UI component:** Root admin page redirects to users list. ( `app/admin/page.tsx:1-4` )
- **Entities:** `public.profiles` (auth profiles). ( `supabase/migrations/001_setup.sql:11-18` )
- **Endpoints:** none; client reads via Supabase JS. ( `app/admin/users/page.tsx:67-73` )

2) **/admin/users**
- **UI component:** Read-only user list with view link. ( `app/admin/users/page.tsx:146-190` )
- **Entities:** `public.profiles` (`user_id`, `email`, `role`, etc.). ( `app/admin/users/page.tsx:67-72`, `supabase/migrations/001_setup.sql:11-18` )
- **Endpoints:** none (Supabase JS query). ( `app/admin/users/page.tsx:67-73` )

3) **/admin/[userId] (Urgency View)**
- **UI component:** `UrgencySection` shows urgency scores and factors. ( `app/admin/[userId]/page.tsx:1-4`, `components/admin/sections/UrgencySection.tsx:16-235` )
- **Entities:** `player_urgency_scores` + dependent tables used in urgency calculation (choice_history, visited_scenes, player_patterns, relationship_progress, skill_milestones, player_profiles). ( `supabase/migrations/003_urgency_triage.sql:19-125` )
- **Endpoints:** `/api/admin-proxy/urgency` GET/POST. ( `components/admin/sections/UrgencySection.tsx:42-90`, `components/admin/sections/UrgencySection.tsx:72-96` )

4) **/admin/login**
- **UI component:** Redirect page for role-based auth. ( `app/admin/login/page.tsx:8-45` )
- **Entities:** None (UI-only). ( `app/admin/login/page.tsx:8-45` )
- **Endpoints:** none. ( `app/admin/login/page.tsx:17-24` )

---

## 4) Simplification Plan (Kill List)

> **Principle:** Remove routes that are already redirect-only, keeping only `/admin/users` and `/admin/[userId]` as the minimal admin surface.

### Kill List (Redirect Stubs → Remove or Keep Hidden)

- **/admin/skills** → redirects to `/admin/users`. ( `app/admin/skills/page.tsx:1-4` )
  - **Justification:** Route is already a redirect stub. ( `app/admin/skills/page.tsx:1-4` )
  - **Impact:** No UI loss (current behavior is redirect). ( `app/admin/skills/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/users` as the canonical entry. ( `app/admin/page.tsx:1-4` )

- **/admin/diagnostics** → redirects to `/admin/users`. ( `app/admin/diagnostics/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/diagnostics/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/diagnostics/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/users` as canonical. ( `app/admin/page.tsx:1-4` )

- **/admin/preview** → redirects to `/admin/users`. ( `app/admin/preview/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/preview/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/preview/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/users` as canonical. ( `app/admin/page.tsx:1-4` )

- **/admin/[userId]/skills** → redirects to `/admin/[userId]`. ( `app/admin/[userId]/skills/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/[userId]/skills/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/[userId]/skills/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/[userId]` (Urgency) as canonical detail view. ( `app/admin/[userId]/page.tsx:1-4` )

- **/admin/[userId]/patterns** → redirects to `/admin/[userId]`. ( `app/admin/[userId]/patterns/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/[userId]/patterns/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/[userId]/patterns/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/[userId]` (Urgency). ( `app/admin/[userId]/page.tsx:1-4` )

- **/admin/[userId]/careers** → redirects to `/admin/[userId]`. ( `app/admin/[userId]/careers/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/[userId]/careers/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/[userId]/careers/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/[userId]` (Urgency). ( `app/admin/[userId]/page.tsx:1-4` )

- **/admin/[userId]/evidence** → redirects to `/admin/[userId]`. ( `app/admin/[userId]/evidence/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/[userId]/evidence/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/[userId]/evidence/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/[userId]` (Urgency). ( `app/admin/[userId]/page.tsx:1-4` )

- **/admin/[userId]/gaps** → redirects to `/admin/[userId]`. ( `app/admin/[userId]/gaps/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/[userId]/gaps/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/[userId]/gaps/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/[userId]` (Urgency). ( `app/admin/[userId]/page.tsx:1-4` )

- **/admin/[userId]/action** → redirects to `/admin/[userId]`. ( `app/admin/[userId]/action/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/[userId]/action/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/[userId]/action/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/[userId]` (Urgency). ( `app/admin/[userId]/page.tsx:1-4` )

- **/admin/[userId]/urgency** → redirects to `/admin/[userId]`. ( `app/admin/[userId]/urgency/page.tsx:1-4` )
  - **Justification:** Redirect stub. ( `app/admin/[userId]/urgency/page.tsx:1-4` )
  - **Impact:** No UI loss. ( `app/admin/[userId]/urgency/page.tsx:1-4` )
  - **Mitigation:** Keep `/admin/[userId]` as canonical urgency view. ( `app/admin/[userId]/page.tsx:1-4` )

---

## 5) Decisions & Remaining Questions

1) **Decision: Canonicalize to `analytical`, keep legacy alias**
- Canonical patterns are `analytical | patience | exploring | helping | building`. ( `lib/patterns.ts:14-25` )
- Legacy `analyzing` is normalized to `analytical` at runtime and allowed in DB for backward compatibility. ( `lib/patterns.ts:27-48`, `supabase/migrations/019_align_gameplay_contracts.sql:56-62` )
- A backfill migration normalizes existing `player_patterns` rows to `analytical`. ( `supabase/migrations/020_backfill_pattern_name_analytical.sql:11-24` )

2) **Decision: Keep `platform_states` dual‑purpose**
- Table continues to store platform warmth/accessibility plus aggregate core sync fields. ( `supabase/migrations/001_setup.sql:209-222`, `supabase/migrations/019_align_gameplay_contracts.sql:12-20`, `app/api/user/platform-state/route.ts:28-70` )
- Revisit only if historical snapshots or platform‑level analytics require separation.

3) **Remaining: Normalized tables not referenced at runtime**
- `relationship_key_moments` and `career_local_opportunities` exist but are not referenced by runtime code. Decide whether to wire them into gameplay/admin flows or remove them. ( `supabase/migrations/002_normalized_core.sql:155-184` )

---

## 6) References (All Sources Used)

- `lib/character-state.ts:15-216`
- `lib/dialogue-graph.ts:21-205, 300-410`
- `lib/graph-registry.ts:12-130`
- `lib/game-state-manager.ts:19-113`
- `lib/game-store.ts:1011-1039`
- `lib/game-interface-types.ts:7-69`
- `lib/patterns.ts:14-118`
- `lib/skill-definitions.ts:1-18`
- `lib/emotions.ts:1-64`
- `lib/schemas/player-data.ts:1-201`
- `lib/skill-tracker.ts:30-207`
- `lib/sync-queue.ts:1-929`
- `hooks/game/useGameInitializer.ts:45-106`
- `hooks/game/useChoiceHandler.ts:142-205, 1541-1577`
- `components/StatefulGameInterface.tsx:94-149, 1389-1399, 1489-1540`
- `components/Journal.tsx:55-169`
- `components/game/EndingPanel.tsx:10-56`
- `components/career/StrategyReport.tsx:14-74`
- `app/api/user/profile/route.ts:31-136`
- `app/api/user/skill-demonstrations/route.ts:29-77`
- `app/api/user/skill-summaries/route.ts:35-165`
- `app/api/user/pattern-demonstrations/route.ts:27-81`
- `app/api/user/career-explorations/route.ts:35-126`
- `app/api/user/relationship-progress/route.ts:28-106`
- `app/api/user/platform-state/route.ts:28-101`
- `app/api/user/career-analytics/route.ts:33-131`
- `app/api/user/action-plan/route.ts:19-50`
- `app/api/admin-proxy/urgency/route.ts:32-146, 157-185`
- `app/api/admin/evidence/[userId]/route.ts:72-127`
- `app/admin/page.tsx:1-4`
- `app/admin/users/page.tsx:1-213`
- `app/admin/[userId]/page.tsx:1-4`
- `app/admin/[userId]/urgency/page.tsx:1-4`
- `app/admin/[userId]/skills/page.tsx:1-4`
- `app/admin/[userId]/patterns/page.tsx:1-4`
- `app/admin/[userId]/careers/page.tsx:1-4`
- `app/admin/[userId]/evidence/page.tsx:1-4`
- `app/admin/[userId]/gaps/page.tsx:1-4`
- `app/admin/[userId]/action/page.tsx:1-4`
- `app/admin/skills/page.tsx:1-4`
- `app/admin/diagnostics/page.tsx:1-4`
- `app/admin/preview/page.tsx:1-4`
- `app/admin/login/page.tsx:8-45`
- `components/admin/sections/UrgencySection.tsx:16-235`
- `supabase/migrations/001_setup.sql:11-127`
- `supabase/migrations/001_setup.sql:139-271`
- `supabase/migrations/002_normalized_core.sql:18-184`
- `supabase/migrations/003_urgency_triage.sql:19-171`
- `supabase/migrations/005_career_analytics_table.sql:11-49`
- `supabase/migrations/006_skill_summaries_table.sql:12-74`
- `supabase/migrations/012_add_scene_descriptions.sql:1-36`
- `supabase/migrations/010_pattern_tracking.sql:10-147`
- `supabase/migrations/019_align_gameplay_contracts.sql:1-63`
- `supabase/migrations/020_backfill_pattern_name_analytical.sql:1-24`
