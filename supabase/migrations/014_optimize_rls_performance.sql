-- ============================================================================
-- Migration 014: Optimize RLS Policy Performance
-- ============================================================================
-- Purpose: Fix performance warnings by optimizing auth.uid() calls in RLS policies
-- 
-- Issues Fixed:
-- 1. Replace auth.uid() with (select auth.uid()) in all RLS policies (prevents re-evaluation per row)
-- 2. This improves query performance at scale
--
-- Created: 2025-11-30
-- Dependencies: All previous migrations
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. PLAYER_URGENCY_SCORES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own urgency scores" ON player_urgency_scores;
CREATE POLICY "Users can view own urgency scores"
  ON player_urgency_scores
  FOR SELECT
  USING ((select auth.uid())::text = player_id);

-- ============================================================================
-- 2. PLAYER_PROFILES
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own profile" ON player_profiles;
CREATE POLICY "Users can read own profile"
  ON player_profiles
  FOR SELECT
  USING ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON player_profiles;
CREATE POLICY "Users can insert own profile"
  ON player_profiles
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON player_profiles;
CREATE POLICY "Users can update own profile"
  ON player_profiles
  FOR UPDATE
  USING ((select auth.uid())::text = user_id)
  WITH CHECK ((select auth.uid())::text = user_id);

-- ============================================================================
-- 3. SKILL_DEMONSTRATIONS
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own skill demonstrations" ON skill_demonstrations;
CREATE POLICY "Users can read own skill demonstrations"
  ON skill_demonstrations
  FOR SELECT
  USING ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can insert own skill demonstrations" ON skill_demonstrations;
CREATE POLICY "Users can insert own skill demonstrations"
  ON skill_demonstrations
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = user_id);

-- ============================================================================
-- 4. CAREER_EXPLORATIONS
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own career explorations" ON career_explorations;
CREATE POLICY "Users can read own career explorations"
  ON career_explorations
  FOR SELECT
  USING ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can insert own career explorations" ON career_explorations;
CREATE POLICY "Users can insert own career explorations"
  ON career_explorations
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can update own career explorations" ON career_explorations;
CREATE POLICY "Users can update own career explorations"
  ON career_explorations
  FOR UPDATE
  USING ((select auth.uid())::text = user_id)
  WITH CHECK ((select auth.uid())::text = user_id);

-- ============================================================================
-- 5. RELATIONSHIP_PROGRESS
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own relationships" ON relationship_progress;
CREATE POLICY "Users can read own relationships"
  ON relationship_progress
  FOR SELECT
  USING ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can insert own relationships" ON relationship_progress;
CREATE POLICY "Users can insert own relationships"
  ON relationship_progress
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can update own relationships" ON relationship_progress;
CREATE POLICY "Users can update own relationships"
  ON relationship_progress
  FOR UPDATE
  USING ((select auth.uid())::text = user_id)
  WITH CHECK ((select auth.uid())::text = user_id);

-- ============================================================================
-- 6. PLATFORM_STATES
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own platform states" ON platform_states;
CREATE POLICY "Users can read own platform states"
  ON platform_states
  FOR SELECT
  USING ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can insert own platform states" ON platform_states;
CREATE POLICY "Users can insert own platform states"
  ON platform_states
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can update own platform states" ON platform_states;
CREATE POLICY "Users can update own platform states"
  ON platform_states
  FOR UPDATE
  USING ((select auth.uid())::text = user_id)
  WITH CHECK ((select auth.uid())::text = user_id);

-- ============================================================================
-- 7. CAREER_ANALYTICS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own career analytics" ON career_analytics;
CREATE POLICY "Users can view own career analytics"
  ON career_analytics
  FOR SELECT
  USING ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can insert own career analytics" ON career_analytics;
CREATE POLICY "Users can insert own career analytics"
  ON career_analytics
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can update own career analytics" ON career_analytics;
CREATE POLICY "Users can update own career analytics"
  ON career_analytics
  FOR UPDATE
  USING ((select auth.uid())::text = user_id)
  WITH CHECK ((select auth.uid())::text = user_id);

-- ============================================================================
-- 8. VISITED_SCENES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own visited scenes" ON visited_scenes;
CREATE POLICY "Users can view own visited scenes"
  ON visited_scenes
  FOR SELECT
  USING ((select auth.uid())::text = player_id);

DROP POLICY IF EXISTS "Users can insert own visited scenes" ON visited_scenes;
CREATE POLICY "Users can insert own visited scenes"
  ON visited_scenes
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = player_id);

-- ============================================================================
-- 9. CHOICE_HISTORY
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own choice history" ON choice_history;
CREATE POLICY "Users can view own choice history"
  ON choice_history
  FOR SELECT
  USING ((select auth.uid())::text = player_id);

DROP POLICY IF EXISTS "Users can insert own choices" ON choice_history;
CREATE POLICY "Users can insert own choices"
  ON choice_history
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = player_id);

-- ============================================================================
-- 10. PLAYER_PATTERNS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own patterns" ON player_patterns;
CREATE POLICY "Users can view own patterns"
  ON player_patterns
  FOR SELECT
  USING ((select auth.uid())::text = player_id);

DROP POLICY IF EXISTS "Users can insert own patterns" ON player_patterns;
CREATE POLICY "Users can insert own patterns"
  ON player_patterns
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = player_id);

DROP POLICY IF EXISTS "Users can update own patterns" ON player_patterns;
CREATE POLICY "Users can update own patterns"
  ON player_patterns
  FOR UPDATE
  USING ((select auth.uid())::text = player_id)
  WITH CHECK ((select auth.uid())::text = player_id);

-- ============================================================================
-- 11. PLAYER_BEHAVIORAL_PROFILES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own behavioral profile" ON player_behavioral_profiles;
CREATE POLICY "Users can view own behavioral profile"
  ON player_behavioral_profiles
  FOR SELECT
  USING ((select auth.uid())::text = player_id);

DROP POLICY IF EXISTS "Users can insert own behavioral profile" ON player_behavioral_profiles;
CREATE POLICY "Users can insert own behavioral profile"
  ON player_behavioral_profiles
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = player_id);

DROP POLICY IF EXISTS "Users can update own behavioral profile" ON player_behavioral_profiles;
CREATE POLICY "Users can update own behavioral profile"
  ON player_behavioral_profiles
  FOR UPDATE
  USING ((select auth.uid())::text = player_id)
  WITH CHECK ((select auth.uid())::text = player_id);

-- ============================================================================
-- 12. SKILL_MILESTONES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own milestones" ON skill_milestones;
CREATE POLICY "Users can view own milestones"
  ON skill_milestones
  FOR SELECT
  USING ((select auth.uid())::text = player_id);

DROP POLICY IF EXISTS "Users can insert own milestones" ON skill_milestones;
CREATE POLICY "Users can insert own milestones"
  ON skill_milestones
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = player_id);

-- ============================================================================
-- 13. RELATIONSHIP_KEY_MOMENTS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own relationship key moments" ON relationship_key_moments;
CREATE POLICY "Users can view own relationship key moments"
  ON relationship_key_moments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM relationship_progress rp
      WHERE rp.id = relationship_key_moments.relationship_id
      AND rp.user_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Users can insert own relationship key moments" ON relationship_key_moments;
CREATE POLICY "Users can insert own relationship key moments"
  ON relationship_key_moments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationship_progress rp
      WHERE rp.id = relationship_key_moments.relationship_id
      AND rp.user_id = (select auth.uid())::text
    )
  );

-- ============================================================================
-- 14. CAREER_LOCAL_OPPORTUNITIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own career opportunities" ON career_local_opportunities;
CREATE POLICY "Users can view own career opportunities"
  ON career_local_opportunities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM career_explorations ce
      WHERE ce.id = career_local_opportunities.career_exploration_id
      AND ce.user_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Users can insert own career opportunities" ON career_local_opportunities;
CREATE POLICY "Users can insert own career opportunities"
  ON career_local_opportunities
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM career_explorations ce
      WHERE ce.id = career_local_opportunities.career_exploration_id
      AND ce.user_id = (select auth.uid())::text
    )
  );

-- ============================================================================
-- 15. PATTERN_DEMONSTRATIONS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own pattern demonstrations" ON pattern_demonstrations;
CREATE POLICY "Users can view own pattern demonstrations"
  ON pattern_demonstrations
  FOR SELECT
  USING ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "Users can insert own pattern demonstrations" ON pattern_demonstrations;
CREATE POLICY "Users can insert own pattern demonstrations"
  ON pattern_demonstrations
  FOR INSERT
  WITH CHECK ((select auth.uid())::text = user_id);

COMMIT;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 014_optimize_rls_performance completed successfully';
  RAISE NOTICE 'Optimized: ~40 RLS policies with (select auth.uid()) pattern';
  RAISE NOTICE 'Performance: Improved query performance at scale';
END $$;
