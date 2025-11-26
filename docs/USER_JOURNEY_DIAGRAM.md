# User Journey Through Lux Story
## Birmingham Career Exploration Platform

> **Last Updated**: 2025-11-25 | **Version**: 2.0 (Fully Aligned with Codebase)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PLAYER ARRIVES AT APP                            │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │  Has Save File?       │
                       │  (localStorage check) │
                       └───────────────────────┘
                         │                   │
                   NO    │                   │ YES
                         ▼                   ▼
           ┌──────────────────────┐   ┌──────────────────────┐
           │ AtmosphericIntro     │   │ Continue / Start Over│
           │ "Welcome to Terminal"│   │ Dialog               │
           └──────────────────────┘   └──────────────────────┘
                         │                   │
                         └─────────┬─────────┘
                                   │ Click "Start" / "Continue"
                                   ▼
                   ┌───────────────────────────────┐
                   │   GAME INITIALIZATION         │
                   │ • Generate/Load User ID       │
                   │ • Create GameState            │
                   │ • Initialize SkillTracker     │
                   │ • Ensure Profile in Supabase  │
                   └───────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        MAIN GAME LOOP (StatefulGameInterface)            │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       │                                                       │
       ▼                                                       ▼
┌──────────────────┐                                  ┌──────────────────┐
│ CHARACTER HEADER │                                  │ SYNC STATUS      │
│ • Name           │                                  │ Indicator        │
│ • Relationship   │                                  │ (SyncStatus-     │
│ • Trust Level    │                                  │  Indicator.tsx)  │
└──────────────────┘                                  └──────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DIALOGUE CARD                                   │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │  Samuel: "Welcome to Terminal Station. Birmingham's Innovation      │ │
│ │  District is where dreams of the future take shape..."              │ │
│ │                                                                      │ │
│ │  [Text animates with staggered fade-in for emotional scenes]        │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CHOICES CARD                                    │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │  [1] "Tell me about innovation opportunities here"                  │ │
│ │      Pattern: analytical                                            │ │
│ │                                                                      │ │
│ │  [2] "How can I help Birmingham youth?"                             │ │
│ │      Pattern: helping                                               │ │
│ │                                                                      │ │
│ │  [3] "I want to build something new"                                │ │
│ │      Pattern: building                                              │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│  (Press 1-3 for keyboard navigation, or click)                          │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ Player selects choice
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CHOICE HANDLER PROCESSING                             │
│                                                                          │
│  1. Race Condition Guard (prevents double-clicks)                       │
│     └─ 10-second timeout safety net (CHOICE_HANDLER_TIMEOUT_MS)        │
│                                                                          │
│  2. Apply State Changes (GameStateUtils.applyStateChange)              │
│     ├─ Trust change (if specified)                                      │
│     ├─ Pattern increment (analytical/helping/building/exploring/       │
│     │                     patience/rushing)                             │
│     ├─ Add knowledge flags                                              │
│     └─ Add global flags                                                 │
│                                                                          │
│  3. Track Skills (SkillTracker.recordSkillDemonstration)               │
│     ├─ Maps choice to WEF 2030 Skills via SCENE_SKILL_MAPPINGS         │
│     │   (Problem Solving, Critical Thinking, Emotional Intelligence,   │
│     │    Communication, Leadership, Creativity, Adaptability, etc.)    │
│     ├─ Records Samuel quotes if applicable (SamuelQuote[])             │
│     └─ Queues sync to Supabase                                          │
│                                                                          │
│  4. Track Patterns (queuePatternDemonstrationSync)                     │
│     └─ Records pattern-aligned choices separately from skills           │
│                                                                          │
│  5. Navigate to Next Node (DialogueGraphNavigator)                     │
│     ├─ Find target node in dialogue graph                               │
│     ├─ Execute onEnter state changes                                    │
│     ├─ Check for character transitions (findCharacterForNode)          │
│     └─ Evaluate choice visibility conditions (StateConditionEvaluator) │
│                                                                          │
│  6. Save Game State                                                     │
│     ├─ localStorage (instant, offline-first)                            │
│     └─ Backup copy via GameStateManager                                 │
│                                                                          │
│  7. Queue Data Sync                                                     │
│     ├─ queueSkillDemonstrationSync()                                    │
│     ├─ queueSkillSummarySync()                                          │
│     ├─ queuePatternDemonstrationSync()                                  │
│     ├─ queueRelationshipSync()                                          │
│     └─ queuePlatformStateSync()                                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKGROUND SYNC (useBackgroundSync)                   │
│                                                                          │
│  Triggers:                                                               │
│  • Interval: Every 30 seconds (default, configurable via intervalMs)   │
│  • Window focus: When user returns to tab (syncOnFocus: true)          │
│  • Network online: When connection restored (syncOnOnline: true)       │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 1. Profile Cache Check                                            │  │
│  │    └─ Check localStorage cache (profile-existence-cache-{userId}) │  │
│  │        24-hour TTL to avoid redundant DB queries                  │  │
│  │                                                                    │  │
│  │ 2. Process Sync Queue (SyncQueue.processQueue)                    │  │
│  │    └─ For each queued action:                                     │  │
│  │        ├─ Ensure player profile exists (ensureUserProfile)        │  │
│  │        ├─ POST to appropriate API endpoint                        │  │
│  │        └─ Remove from queue on success                            │  │
│  │                                                                    │  │
│  │ 3. Retry Failed Actions                                           │  │
│  │    └─ Up to 3 retries (action.retries < 3)                        │  │
│  │        NOTE: Simple retry counter, NOT exponential backoff        │  │
│  │                                                                    │  │
│  │ 4. Clean Stale Actions                                            │  │
│  │    └─ Remove actions older than 7 days (MAX_RETRY_AGE_MS)         │  │
│  │                                                                    │  │
│  │ 5. Queue Limits                                                   │  │
│  │    └─ Max 500 actions (SYNC_QUEUE_MAX_SIZE)                       │  │
│  │        Drops oldest if exceeded                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      COMPLETE API ROUTES (Next.js App Router)            │
│                                                                          │
│  ══════════════════════════════════════════════════════════════════════ │
│  USER ENDPOINTS (/api/user/*)                                           │
│  ══════════════════════════════════════════════════════════════════════ │
│                                                                          │
│  POST /api/user/profile                                                 │
│  GET  /api/user/profile?userId=X                                        │
│  └─ UPSERT player_profiles (user_id, created_at)                        │
│                                                                          │
│  POST /api/user/skill-demonstrations                                    │
│  └─ INSERT skill_demonstrations                                         │
│      • user_id, skill_name, scene_id, scene_description                 │
│      • choice_text, context, demonstrated_at                            │
│                                                                          │
│  POST /api/user/skill-summaries                                         │
│  GET  /api/user/skill-summaries?userId=X                                │
│  └─ UPSERT skill_summaries (aggregated skill context)                   │
│                                                                          │
│  POST /api/user/pattern-demonstrations                                  │
│  └─ INSERT pattern_demonstrations                                       │
│      • user_id, pattern_name, scene_id, context                         │
│                                                                          │
│  GET  /api/user/pattern-profile?userId=X                                │
│  └─ SELECT pattern data for user                                        │
│                                                                          │
│  POST /api/user/relationship-progress                                   │
│  GET  /api/user/relationship-progress?userId=X                          │
│  └─ UPSERT relationship_progress                                        │
│      • user_id, character_name, trust_level, relationship_status        │
│                                                                          │
│  POST /api/user/platform-state                                          │
│  GET  /api/user/platform-state?userId=X                                 │
│  └─ UPSERT platform_states                                              │
│      • user_id, current_scene, global_flags[], patterns{}               │
│                                                                          │
│  POST /api/user/career-explorations                                     │
│  GET  /api/user/career-explorations?userId=X                            │
│  └─ UPSERT career_explorations                                          │
│      • user_id, career_name, match_score, readiness_level               │
│      • local_opportunities[], education_paths[]                         │
│                                                                          │
│  POST /api/user/career-analytics                                        │
│  GET  /api/user/career-analytics?userId=X                               │
│  └─ UPSERT career_analytics (computed matches)                          │
│                                                                          │
│  POST /api/user/action-plan                                             │
│  └─ Store user's action plan                                            │
│                                                                          │
│  ══════════════════════════════════════════════════════════════════════ │
│  ADMIN ENDPOINTS (/api/admin/*)                                         │
│  ══════════════════════════════════════════════════════════════════════ │
│                                                                          │
│  POST /api/admin/auth                                                   │
│  └─ Login with rate limiting, sets HTTP-only cookie                     │
│                                                                          │
│  GET  /api/admin/user-ids                                               │
│  └─ List all player profiles                                            │
│                                                                          │
│  GET  /api/admin/evidence/[userId]                                      │
│  └─ Aggregate 6 evidence frameworks for admin dashboard                 │
│                                                                          │
│  GET  /api/admin/skill-data                                             │
│  └─ Global skill analytics                                              │
│                                                                          │
│  GET  /api/admin/urgency?userId=X                                       │
│  └─ Urgency score and narrative for intervention triage                 │
│                                                                          │
│  GET  /api/admin/check-profile?userId=X                                 │
│  └─ Verify profile existence                                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  COMPLETE DATABASE SCHEMA (Supabase/PostgreSQL)          │
│                                                                          │
│  ══════════════════════════════════════════════════════════════════════ │
│  CORE TABLES                                                             │
│  ══════════════════════════════════════════════════════════════════════ │
│                                                                          │
│  player_profiles                                                        │
│  ├─ user_id (PK), created_at, updated_at, last_activity                │
│  ├─ current_scene_id, current_character_id                              │
│  ├─ has_started, journey_started_at, completion_percentage              │
│  └─ game_version, platform, total_demonstrations                        │
│                                                                          │
│  skill_demonstrations                                                   │
│  ├─ user_id (FK), skill_name, scene_id, scene_description              │
│  └─ choice_text, context, demonstrated_at                               │
│                                                                          │
│  skill_summaries                                                        │
│  ├─ user_id (FK), skill_name, demonstration_count                      │
│  └─ latest_context, scenes_involved[], scene_descriptions[]             │
│                                                                          │
│  pattern_demonstrations                                                 │
│  ├─ user_id (FK), pattern_name, scene_id                               │
│  └─ context, demonstrated_at                                            │
│                                                                          │
│  relationship_progress                                                  │
│  ├─ user_id (FK), character_name, trust_level (0-10)                   │
│  └─ relationship_status, last_interaction, key_moments[]                │
│                                                                          │
│  platform_states                                                        │
│  ├─ user_id (FK), platform_id, warmth (0-100)                          │
│  └─ accessible, discovered, updated_at                                  │
│                                                                          │
│  career_explorations                                                    │
│  ├─ user_id (FK), career_name, match_score (0-1)                       │
│  ├─ readiness_level (exploratory/emerging/near_ready/ready)            │
│  └─ local_opportunities[], education_paths[]                            │
│                                                                          │
│  career_analytics                                                       │
│  └─ Computed career matches and analytics                               │
│                                                                          │
│  ══════════════════════════════════════════════════════════════════════ │
│  NORMALIZED TRACKING TABLES                                              │
│  ══════════════════════════════════════════════════════════════════════ │
│                                                                          │
│  visited_scenes                                                         │
│  └─ player_id (FK), scene_id, visited_at                                │
│                                                                          │
│  choice_history                                                         │
│  └─ player_id (FK), scene_id, choice_id, choice_text, chosen_at        │
│                                                                          │
│  player_patterns                                                        │
│  └─ player_id (FK), pattern_name, pattern_value, demonstration_count   │
│      Patterns: helping, analyzing, building, exploring, patience, rushing│
│                                                                          │
│  player_behavioral_profiles                                             │
│  ├─ response_speed (deliberate/moderate/quick/impulsive)               │
│  ├─ stress_response (calm/adaptive/reactive/overwhelmed)               │
│  ├─ social_orientation (helper/collaborator/independent/observer)      │
│  ├─ problem_approach (analytical/creative/practical/intuitive)         │
│  └─ communication_style (direct/thoughtful/expressive/reserved)        │
│                                                                          │
│  skill_milestones                                                       │
│  └─ player_id (FK), milestone_type, milestone_context, reached_at      │
│      Types: journey_start, first_demonstration, five_demonstrations,   │
│             ten_demonstrations, character_trust_gained, arc_completed   │
│                                                                          │
│  relationship_key_moments                                               │
│  └─ relationship_id (FK), scene_id, choice_text, context, occurred_at  │
│                                                                          │
│  career_local_opportunities                                             │
│  └─ career_exploration_id (FK), opportunity_name, opportunity_type,    │
│      url, contact_info (Birmingham-specific employers & programs)       │
│                                                                          │
│  ══════════════════════════════════════════════════════════════════════ │
│  ADMIN & URGENCY TABLES                                                  │
│  ══════════════════════════════════════════════════════════════════════ │
│                                                                          │
│  player_urgency_scores                                                  │
│  ├─ player_id (FK), urgency_score (0-1), urgency_level                 │
│  ├─ disengagement_score, confusion_score, stress_score, isolation_score│
│  ├─ urgency_narrative (Glass Box: human-readable explanation)          │
│  └─ last_calculated, calculation_reason                                 │
│      Levels: low, medium, high, critical                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ (Loop continues until arc completion)
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      ARC COMPLETION DETECTED                             │
│                                                                          │
│  detectArcCompletion() in lib/arc-learning-objectives.ts                │
│                                                                          │
│  Checks for NEW global flags:                                           │
│  ├─ maya_arc_complete   → triggers ExperienceSummary for Maya          │
│  ├─ devon_arc_complete  → triggers ExperienceSummary for Devon         │
│  └─ jordan_arc_complete → triggers ExperienceSummary for Jordan        │
│                                                                          │
│  NOTE: Other arc flags exist but don't trigger ExperienceSummary:      │
│  • marcus_arc_complete, tess_arc_complete, yaquin_arc_complete         │
│  • kai_arc_complete, rohan_arc_complete (set in dialogue graphs)       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      EXPERIENCE SUMMARY MODAL                            │
│                      (ExperienceSummary.tsx)                             │
│                                                                          │
│  Generated via generateExperienceSummary():                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  🎓 Learning Journey with Maya Chen                              │  │
│  │                                                                   │  │
│  │  Arc Theme:                                                       │  │
│  │  "You helped Maya navigate the tension between her family's       │  │
│  │   expectations and her authentic passion for robotics..."        │  │
│  │                                                                   │  │
│  │  Skills Developed (from actual gameplay):                        │  │
│  │  • Emotional Intelligence                                         │  │
│  │    - "You recognized Maya's emotional struggle..."               │  │
│  │  • Cultural Competence                                            │  │
│  │    - "You understood the cultural dynamics of immigrant families" │  │
│  │  • Communication                                                  │  │
│  │    - "You asked thoughtful questions..."                         │  │
│  │  • Relationship Building (if trust >= 6)                         │  │
│  │    - "You built a deep level of trust (8/10)..."                 │  │
│  │                                                                   │  │
│  │  Key Insights:                                                    │  │
│  │  • "Family expectations can come from love..."                   │  │
│  │  • "Authentic choices require balancing multiple values..."      │  │
│  │                                                                   │  │
│  │  [Continue to Next Story]                                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PLAYER EXPLORES MORE ARCS                             │
│                                                                          │
│  COMPLETE CHARACTER GRAPH REGISTRY (lib/graph-registry.ts)              │
│  ════════════════════════════════════════════════════════════════════   │
│                                                                          │
│  BASE GRAPHS (10 characters):                                           │
│  ├─ samuel  → samuelDialogueGraph  (Station Master, tutorial)          │
│  ├─ maya    → mayaDialogueGraph    (Robotics, family expectations)     │
│  ├─ devon   → devonDialogueGraph   (Data Science, grief processing)    │
│  ├─ jordan  → jordanDialogueGraph  (Trades, impostor syndrome)         │
│  ├─ marcus  → marcusDialogueGraph  (Career pathway)                    │
│  ├─ tess    → tessDialogueGraph    (Career pathway)                    │
│  ├─ yaquin  → yaquinDialogueGraph  (Content creation)                  │
│  ├─ kai     → kaiDialogueGraph     (Career pathway)                    │
│  ├─ rohan   → rohanDialogueGraph   (Career pathway)                    │
│  └─ silas   → silasDialogueGraph   (Career pathway)                    │
│                                                                          │
│  REVISIT GRAPHS (for returning players):                                │
│  ├─ maya_revisit   → mayaRevisitGraph   (after maya_arc_complete)      │
│  └─ yaquin_revisit → yaquinRevisitGraph (after yaquin_arc_complete)    │
│                                                                          │
│  Graph Selection Logic (getGraphForCharacter):                          │
│  ├─ If maya + maya_arc_complete → use mayaRevisitGraph                 │
│  ├─ If yaquin + yaquin_arc_complete → use yaquinRevisitGraph           │
│  └─ Otherwise → use base graph for character                            │
│                                                                          │
│  Node Lookup (findCharacterForNode):                                    │
│  ├─ Searches all character graphs for node ID                          │
│  ├─ Handles cross-graph references (revisit → base node)               │
│  └─ Falls back to getSafeStart() → Samuel intro                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ At any time, player can:
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STUDENT INSIGHTS DASHBOARD                              │
│  /student/insights (app/student/insights/page.tsx)                      │
│                                                                          │
│  Sections:                                                               │
│  ├─ YourJourneySection      → Overall progress visualization           │
│  ├─ PatternInsightsSection  → Decision-making pattern breakdown        │
│  ├─ SkillGrowthSection      → Skill demonstration timeline             │
│  ├─ CareerExplorationSection → Career matches with evidence            │
│  ├─ NextStepsSection        → Actionable next steps                    │
│  ├─ FrameworkInsights       → Detailed framework analysis              │
│  └─ ActionPlanBuilder       → Create personal action plan              │
│                                                                          │
│  Data Source: loadSkillProfile() from lib/skill-profile-adapter.ts     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════
                          ADMIN / EDUCATOR FLOW
════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                      EDUCATOR VISITS /admin                              │
└─────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        ADMIN LOGIN PAGE                                  │
│  /admin/login (app/admin/login/page.tsx)                                │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Password: [________________]                                     │  │
│  │  [Login]                                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Security (/api/admin/auth):                                            │
│  • Rate limited: 5 attempts per 15 minutes                              │
│  • Simple password comparison (ADMIN_API_TOKEN env var)                 │
│  • HTTP-only secure cookie on success (7-day expiry)                    │
│  • Audit logging via auditLog() (login_success / login_failed)         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD - USER LIST                           │
│  /admin (app/admin/page.tsx)                                            │
│                                                                          │
│  GET /api/admin/user-ids                                                │
│  ├─ requireAdminAuth(request)                                           │
│  ├─ SELECT DISTINCT user_id FROM player_profiles                        │
│  └─ Display list of students with last activity                         │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Students:                                                        │  │
│  │  • player_abc123 (Active 2 hours ago) → [View Profile]           │  │
│  │  • player_def456 (Active 1 day ago)   → [View Profile]           │  │
│  │  • player_ghi789 (Active 3 days ago)  → [View Profile]           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Additional Admin Pages:                                                │
│  • /admin/skills    → Global skill analytics across all students       │
│  • /admin/preview   → Content preview tools                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
       │
       │ Click [View Profile]
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              STUDENT DETAIL PAGES (SharedDashboardLayout)                │
│  /admin/[userId]/* (7 specialized sub-views per student)                │
│                                                                          │
│  ══════════════════════════════════════════════════════════════════════ │
│  PAGE STRUCTURE                                                          │
│  ══════════════════════════════════════════════════════════════════════ │
│                                                                          │
│  /admin/[userId]                                                        │
│  └─ Default: UrgencySection (intervention triage)                       │
│                                                                          │
│  /admin/[userId]/urgency                                                │
│  └─ Urgency scoring with Glass Box narrative                            │
│      • urgency_score, urgency_level (low/medium/high/critical)         │
│      • Human-readable urgency_narrative explaining WHY                  │
│      • Contributing factors: disengagement, confusion, stress, isolation│
│                                                                          │
│  /admin/[userId]/evidence                                               │
│  └─ 6 Evidence Frameworks (GET /api/admin/evidence/[userId])           │
│                                                                          │
│  /admin/[userId]/skills                                                 │
│  └─ Detailed skill demonstration breakdown                              │
│                                                                          │
│  /admin/[userId]/patterns                                               │
│  └─ Pattern recognition and consistency analysis                        │
│                                                                          │
│  /admin/[userId]/careers                                                │
│  └─ Career readiness indicators and Birmingham opportunities            │
│                                                                          │
│  /admin/[userId]/gaps                                                   │
│  └─ Skill gaps and development areas                                    │
│                                                                          │
│  /admin/[userId]/action                                                 │
│  └─ Recommended interventions and action plans                          │
│                                                                          │
│  ══════════════════════════════════════════════════════════════════════ │
│  6 EVIDENCE FRAMEWORKS (from /api/admin/evidence/[userId])              │
│  ══════════════════════════════════════════════════════════════════════ │
│                                                                          │
│  📊 Framework 1: Skill Evidence                                         │
│     • Total demonstrations, unique skills                               │
│     • Per-skill breakdown with scene descriptions and context           │
│     • hasRealData threshold: 10+ demonstrations                         │
│                                                                          │
│  🎯 Framework 2: Career Readiness                                       │
│     • Explored careers count, top match                                 │
│     • Readiness distribution (exploratory/emerging/near_ready/ready)   │
│     • Birmingham-specific opportunities                                  │
│                                                                          │
│  🧩 Framework 3: Pattern Recognition                                    │
│     • Pattern consistency score                                          │
│     • Skill progression over time                                        │
│     • Behavioral trends analysis                                         │
│     • hasRealData threshold: 15+ demonstrations                         │
│                                                                          │
│  🤝 Framework 4: Relationships                                           │
│     • Total relationships, average trust level                          │
│     • Per-character details (trust, status, interactions)               │
│                                                                          │
│  ⏱️  Framework 5: Time Investment                                        │
│     • Total demonstrations over time period                             │
│     • Average demos per day                                              │
│     • Engagement timeline                                                │
│                                                                          │
│  🎨 Framework 6: Behavioral Consistency                                  │
│     • Top skills by frequency                                            │
│     • Exploration score (skills tried / total skills)                   │
│     • Consistency patterns                                               │
│                                                                          │
│  All data is REAL from Supabase (not mock/simulated)                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════
                         DATA FLOW ARCHITECTURE
════════════════════════════════════════════════════════════════════════════

 PLAYER SIDE (Client)                    SERVER SIDE (APIs)
 ═══════════════════                     ══════════════════

 ┌─────────────────┐                     ┌──────────────────┐
 │  StatefulGame   │                     │  Supabase        │
 │  Interface      │                     │  (PostgreSQL)    │
 └─────────────────┘                     └──────────────────┘
         │                                        ▲
         │ 1. Player makes choice                 │
         │                                        │
         ▼                                        │
 ┌─────────────────┐                             │
 │  SkillTracker   │                             │
 │  • Records demo │                             │
 │  • Stores quote │                             │
 │  • Queues sync  │                             │
 └─────────────────┘                             │
         │                                        │
         ├─────────────────────┐                  │
         ▼                     ▼                  │
 ┌─────────────────┐   ┌─────────────────┐       │
 │  SyncQueue      │   │  Real-Time      │       │
 │  (localStorage) │   │  Monitor        │       │
 │  • Offline-1st  │   │  • logSkillDemo │       │
 │  • 500 max      │   │  • logSync      │       │
 │  • 7-day TTL    │   └─────────────────┘       │
 └─────────────────┘                             │
         │                                        │
         │ 2. Background sync                     │
         │    • 30s interval                      │
         │    • Window focus                      │
         │    • Network online                    │
         ▼                                        │
 ┌─────────────────┐                     ┌──────────────────┐
 │  useBackground  │────POST────────────>│  API Routes      │
 │  Sync (hook)    │                     │  /api/user/*     │
 └─────────────────┘                     │  (10 endpoints)  │
                                         └──────────────────┘
                                                  │
                                                  │ 3. Validate & insert
                                                  │    via getSupabaseServerClient()
                                                  ▼
                                         ┌──────────────────┐
                                         │  Supabase        │
                                         │  Tables (16+):   │
                                         │  • player_profiles│
                                         │  • skill_demos   │
                                         │  • skill_summaries│
                                         │  • pattern_demos │
                                         │  • relationships │
                                         │  • platform_state│
                                         │  • career_explore│
                                         │  • career_analytics│
                                         │  • visited_scenes│
                                         │  • choice_history│
                                         │  • player_patterns│
                                         │  • behavioral_profiles│
                                         │  • skill_milestones│
                                         │  • relationship_moments│
                                         │  • career_opportunities│
                                         │  • urgency_scores│
                                         └──────────────────┘
                                                  │
                                                  │ 4. Admin queries
                                                  │
                                         ┌──────────────────┐
                                         │  Admin API       │
                                         │  /api/admin/*    │
                                         │  (6 endpoints)   │
                                         └──────────────────┘
                                                  │
                                                  ▼
                                         ┌──────────────────┐
                                         │  Admin Dashboard │
                                         │  12 pages:       │
                                         │  • login         │
                                         │  • user list     │
                                         │  • skills global │
                                         │  • preview       │
                                         │  • [userId]/     │
                                         │    - urgency     │
                                         │    - evidence    │
                                         │    - skills      │
                                         │    - patterns    │
                                         │    - careers     │
                                         │    - gaps        │
                                         │    - action      │
                                         └──────────────────┘


════════════════════════════════════════════════════════════════════════════
                        KEY FILES & RESPONSIBILITIES
════════════════════════════════════════════════════════════════════════════

CLIENT-SIDE:
  Core Game Loop:
  • StatefulGameInterface.tsx    → Main game loop, choice handling
  • DialogueDisplay.tsx          → Rich text rendering with animations
  • GameChoices.tsx              → Choice buttons with keyboard nav
  • ExperienceSummary.tsx        → Arc completion modal
  • NarrativeFeedback.tsx        → In-game feedback system
  • SyncStatusIndicator.tsx      → Sync queue status display

  State Management:
  • lib/character-state.ts       → GameState, GameStateUtils
  • lib/game-state-manager.ts    → localStorage persistence
  • lib/dialogue-graph.ts        → DialogueNode, StateConditionEvaluator
  • lib/graph-registry.ts        → Character graph routing (SINGLE SOURCE OF TRUTH)

  Skill & Pattern Tracking:
  • lib/skill-tracker.ts         → SkillTracker class, SkillDemonstration
  • lib/scene-skill-mappings.ts  → SCENE_SKILL_MAPPINGS (choice → skill)
  • lib/patterns.ts              → PATTERN_SKILL_MAP, pattern utilities
  • lib/2030-skills-system.ts    → FutureSkillsSystem (WEF 2030 Framework)

  Sync Infrastructure:
  • lib/sync-queue.ts            → SyncQueue class, offline-first queue
  • hooks/useBackgroundSync.ts   → 30s interval sync processor
  • lib/ensure-user-profile.ts   → Profile existence guarantee
  • lib/real-time-monitor.ts     → logSkillDemo, logSync

  Arc Completion:
  • lib/arc-learning-objectives.ts → ARC_LEARNING_OBJECTIVES, detectArcCompletion
  • lib/skill-profile-adapter.ts   → loadSkillProfile for summaries

SERVER-SIDE:
  User Data APIs (10 routes):
  • /api/user/profile              → Player profile CRUD
  • /api/user/skill-demonstrations → Insert skill evidence
  • /api/user/skill-summaries      → Aggregated skill context
  • /api/user/pattern-demonstrations → Pattern tracking
  • /api/user/pattern-profile      → Pattern data retrieval
  • /api/user/relationship-progress → Character relationships
  • /api/user/platform-state       → Game state (flags, patterns)
  • /api/user/career-explorations  → Career matches
  • /api/user/career-analytics     → Computed career data
  • /api/user/action-plan          → User action plans

  Admin APIs (6 routes):
  • /api/admin/auth                → Login with rate limiting
  • /api/admin/user-ids            → List all users
  • /api/admin/evidence/[userId]   → 6 evidence frameworks
  • /api/admin/skill-data          → Global skill analytics
  • /api/admin/urgency             → Intervention triage
  • /api/admin/check-profile       → Profile verification

  Infrastructure:
  • lib/supabase-server.ts         → getSupabaseServerClient (shared)
  • lib/admin-supabase-client.ts   → requireAdminAuth, getAdminSupabaseClient
  • lib/audit-logger.ts            → auditLog for admin actions

CONTENT (Dialogue Graphs):
  Base Graphs:
  • content/samuel-dialogue-graph.ts → Tutorial, station master
  • content/maya-dialogue-graph.ts   → Robotics, family expectations
  • content/devon-dialogue-graph.ts  → Data science, grief processing
  • content/jordan-dialogue-graph.ts → Trades, impostor syndrome
  • content/marcus-dialogue-graph.ts → Career pathway
  • content/tess-dialogue-graph.ts   → Career pathway
  • content/yaquin-dialogue-graph.ts → Content creation
  • content/kai-dialogue-graph.ts    → Career pathway
  • content/rohan-dialogue-graph.ts  → Career pathway
  • content/silas-dialogue-graph.ts  → Career pathway

  Revisit Graphs:
  • content/maya-revisit-graph.ts    → Post-arc Maya content
  • content/yaquin-revisit-graph.ts  → Post-arc Yaquin content

ADMIN PAGES (12 total):
  • app/admin/login/page.tsx         → Login form
  • app/admin/page.tsx               → User list dashboard
  • app/admin/skills/page.tsx        → Global skills view
  • app/admin/preview/page.tsx       → Content preview
  • app/admin/[userId]/page.tsx      → Student overview (urgency default)
  • app/admin/[userId]/urgency/page.tsx   → Intervention triage
  • app/admin/[userId]/evidence/page.tsx  → 6 evidence frameworks
  • app/admin/[userId]/skills/page.tsx    → Skill breakdown
  • app/admin/[userId]/patterns/page.tsx  → Pattern analysis
  • app/admin/[userId]/careers/page.tsx   → Career readiness
  • app/admin/[userId]/gaps/page.tsx      → Development areas
  • app/admin/[userId]/action/page.tsx    → Action plans

STUDENT PAGES:
  • app/student/insights/page.tsx    → Student self-view dashboard
  • components/student/sections/     → YourJourney, Patterns, Skills, Careers, NextSteps


════════════════════════════════════════════════════════════════════════════
                             OFFLINE RESILIENCE
════════════════════════════════════════════════════════════════════════════

  1. Player makes choices → Saved to localStorage IMMEDIATELY
  2. No network? → Queue builds up in localStorage (max 500 actions)
  3. Network returns? → Background sync processes queue
  4. Sync fails? → Retry up to 3 times (simple counter, NOT exponential backoff)
  5. Still failing? → Keep in queue for 7 days, then clean (MAX_RETRY_AGE_MS)
  6. Profile caching → 24-hour localStorage cache avoids redundant DB checks

  Result: ZERO data loss for student progress


════════════════════════════════════════════════════════════════════════════
                          BIRMINGHAM INTEGRATION
════════════════════════════════════════════════════════════════════════════

  Locations:
  • Terminal Station (dialogue setting, main hub)
  • Innovation Depot (entrepreneurship pathway)
  • UAB (university research opportunities)
  • Railroad Park, Pizitz Food Hall (local landmarks)

  Career Data:
  • career_local_opportunities table stores Birmingham-specific:
    - Employers (opportunity_type: 'employer')
    - Programs (opportunity_type: 'program')
    - Education paths (opportunity_type: 'education')
  • Real Birmingham employers and programs in career explorations

  Cultural Context:
  • Maya's arc: immigrant family expectations in Birmingham context
  • Local career pathways relevant to Birmingham economy
```

## Notes for Developers

### Starting a Session
1. User lands on `/`
2. `AtmosphericIntro` component shows if no save file
3. Click "Start" → `initializeGame()` → `StatefulGameInterface` mounts
4. GameStateManager loads/creates state from localStorage

### Making a Choice
1. User clicks or presses number key (1-9)
2. `handleChoice()` in StatefulGameInterface.tsx
3. Race condition guard (isProcessingChoiceRef) prevents double-processing
4. 10-second timeout safety net auto-resets if handler crashes
5. State changes applied via `GameStateUtils.applyStateChange()`
6. Skills tracked via `SkillTracker.recordSkillDemonstration()`
7. Patterns tracked via `queuePatternDemonstrationSync()`
8. Synced to queue via multiple `queue*Sync()` functions

### Background Sync
1. `useBackgroundSync` hook runs every 30 seconds (or on focus/online)
2. Calls `SyncQueue.processQueue()`
3. Checks profile cache before DB query (24-hour TTL)
4. For each queued action: ensure profile → POST to API → remove on success
5. Failed actions retry up to 3 times (simple counter)
6. Actions older than 7 days are cleaned

### Character Graph Routing
1. `getGraphForCharacter(characterId, gameState)` returns correct graph
2. Checks for arc completion flags to return revisit graphs
3. `findCharacterForNode(nodeId, gameState)` searches all graphs
4. Falls back to `getSafeStart()` (Samuel intro) if node not found

### Arc Completion
1. `detectArcCompletion(previousState, currentState)` checks for NEW flags
2. Only maya/devon/jordan trigger ExperienceSummary modal
3. `generateExperienceSummary()` builds data from actual gameplay
4. Displays skills with "how you showed it" and "why it matters"

### Admin View
1. Educator logs in at `/admin/login` with password
2. Cookie set with `ADMIN_API_TOKEN` value (7-day expiry)
3. `requireAdminAuth()` checks cookie on all admin routes
4. Evidence dashboard aggregates real Supabase data (not mocks)
5. 6 evidence frameworks computed per student
6. Urgency scores use "Glass Box" principle (human-readable narratives)

### Testing Locally
- No Supabase? → Offline mode with localStorage only
- Sync queue builds up, app still works
- Admin dashboard shows "no data" gracefully
- Set ADMIN_API_TOKEN in .env.local for admin access

## Conceptual Note

**Important**: Users don't "demonstrate" skills in the game - they make choices
that are **aligned with** skills. The SkillTracker explicitly states:

> "IMPORTANT: Users don't 'demonstrate' skills in the game - they make choices
> that are aligned with skills. Actual skill demonstration requires different work."

This distinction matters for how evidence is presented to educators.
