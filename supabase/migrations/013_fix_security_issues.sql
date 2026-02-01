-- ============================================================================
-- Migration 013: Fix Security Issues
-- ============================================================================
-- Purpose: Fix Supabase database linter security warnings
-- 
-- Issues Fixed:
-- 1. Remove SECURITY DEFINER from views (pattern_evolution, user_decision_styles, pattern_summaries)
-- 2. Enable RLS on tables missing it (9 tables)
-- 3. Add appropriate RLS policies for all tables
--
-- Created: 2025-11-30
-- Dependencies: All previous migrations
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. FIX SECURITY DEFINER VIEWS
-- Recreate views without SECURITY DEFINER property
-- ============================================================================

-- Recreate pattern_summaries view without SECURITY DEFINER
-- Drop and recreate to ensure SECURITY INVOKER (default, but explicit)
DROP VIEW IF EXISTS pattern_summaries CASCADE;
CREATE VIEW pattern_summaries
WITH (security_invoker = true) AS
SELECT
  user_id,
  pattern_name,
  COUNT(*) as demonstration_count,
  MAX(demonstrated_at) as last_demonstrated,
  MIN(demonstrated_at) as first_demonstrated,
  ARRAY_AGG(DISTINCT scene_id ORDER BY scene_id) as scenes_involved,
  ARRAY_AGG(DISTINCT character_id ORDER BY character_id) as characters_involved
FROM pattern_demonstrations
GROUP BY user_id, pattern_name;

-- Recreate pattern_evolution view without SECURITY DEFINER
DROP VIEW IF EXISTS pattern_evolution CASCADE;
CREATE VIEW pattern_evolution
WITH (security_invoker = true) AS
SELECT
  user_id,
  pattern_name,
  DATE_TRUNC('week', demonstrated_at) as week_start,
  COUNT(*) as weekly_count
FROM pattern_demonstrations
GROUP BY user_id, pattern_name, DATE_TRUNC('week', demonstrated_at)
ORDER BY user_id, week_start, pattern_name;

-- Recreate user_decision_styles view without SECURITY DEFINER
DROP VIEW IF EXISTS user_decision_styles CASCADE;
CREATE VIEW user_decision_styles
WITH (security_invoker = true) AS
WITH pattern_totals AS (
  SELECT
    user_id,
    pattern_name,
    COUNT(*) as count,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY user_id) as percentage
  FROM pattern_demonstrations
  GROUP BY user_id, pattern_name
),
ranked_patterns AS (
  SELECT
    user_id,
    pattern_name,
    count,
    percentage,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY count DESC) as rank
  FROM pattern_totals
)
SELECT
  user_id,
  MAX(CASE WHEN rank = 1 THEN pattern_name END) as dominant_pattern,
  MAX(CASE WHEN rank = 1 THEN percentage END) as dominant_percentage,
  MAX(CASE WHEN rank = 2 THEN pattern_name END) as secondary_pattern,
  MAX(CASE WHEN rank = 2 THEN percentage END) as secondary_percentage,
  -- Decision style classification
  CASE
    WHEN MAX(CASE WHEN rank = 1 THEN percentage END) > 50 THEN
      CASE MAX(CASE WHEN rank = 1 THEN pattern_name END)
        WHEN 'analytical' THEN 'Analytical Thinker'
        WHEN 'patience' THEN 'Patient Listener'
        WHEN 'exploring' THEN 'Curious Explorer'
        WHEN 'helping' THEN 'Supportive Helper'
        WHEN 'building' THEN 'Creative Builder'
      END
    WHEN MAX(CASE WHEN rank = 2 THEN percentage END) > MAX(CASE WHEN rank = 1 THEN percentage END) * 0.7 THEN
      -- Hybrid style if secondary is within 30% of primary
      CASE MAX(CASE WHEN rank = 1 THEN pattern_name END)
        WHEN 'analytical' THEN 'Analytical Thinker & '
        WHEN 'patience' THEN 'Patient Listener & '
        WHEN 'exploring' THEN 'Curious Explorer & '
        WHEN 'helping' THEN 'Supportive Helper & '
        WHEN 'building' THEN 'Creative Builder & '
      END ||
      CASE MAX(CASE WHEN rank = 2 THEN pattern_name END)
        WHEN 'analytical' THEN 'Analytical Thinker'
        WHEN 'patience' THEN 'Patient Listener'
        WHEN 'exploring' THEN 'Curious Explorer'
        WHEN 'helping' THEN 'Supportive Helper'
        WHEN 'building' THEN 'Creative Builder'
      END
    ELSE
      CASE MAX(CASE WHEN rank = 1 THEN pattern_name END)
        WHEN 'analytical' THEN 'Analytical Thinker'
        WHEN 'patience' THEN 'Patient Listener'
        WHEN 'exploring' THEN 'Curious Explorer'
        WHEN 'helping' THEN 'Supportive Helper'
        WHEN 'building' THEN 'Creative Builder'
      END
  END as decision_style
FROM ranked_patterns
GROUP BY user_id;

-- ============================================================================
-- 2. ENABLE RLS ON TABLES MISSING IT
-- ============================================================================

-- Enable RLS on player_urgency_scores
ALTER TABLE player_urgency_scores ENABLE ROW LEVEL SECURITY;

-- Enable RLS on visited_scenes
ALTER TABLE visited_scenes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on choice_history
ALTER TABLE choice_history ENABLE ROW LEVEL SECURITY;

-- Enable RLS on player_patterns
ALTER TABLE player_patterns ENABLE ROW LEVEL SECURITY;

-- Enable RLS on player_behavioral_profiles
ALTER TABLE player_behavioral_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on skill_milestones
ALTER TABLE skill_milestones ENABLE ROW LEVEL SECURITY;

-- Enable RLS on relationship_key_moments
ALTER TABLE relationship_key_moments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on career_local_opportunities
ALTER TABLE career_local_opportunities ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. CREATE RLS POLICIES FOR EACH TABLE
-- ============================================================================

-- Drop existing policies to allow idempotent re-run
DROP POLICY IF EXISTS "Users can view own urgency scores" ON player_urgency_scores;
DROP POLICY IF EXISTS "Service role can view all urgency scores" ON player_urgency_scores;
DROP POLICY IF EXISTS "Service role can manage urgency scores" ON player_urgency_scores;

DROP POLICY IF EXISTS "Users can view own visited scenes" ON visited_scenes;
DROP POLICY IF EXISTS "Users can insert own visited scenes" ON visited_scenes;
DROP POLICY IF EXISTS "Service role can view all visited scenes" ON visited_scenes;
DROP POLICY IF EXISTS "Service role can insert all visited scenes" ON visited_scenes;

DROP POLICY IF EXISTS "Users can view own choice history" ON choice_history;
DROP POLICY IF EXISTS "Users can insert own choices" ON choice_history;
DROP POLICY IF EXISTS "Service role can view all choice history" ON choice_history;
DROP POLICY IF EXISTS "Service role can insert all choice history" ON choice_history;

DROP POLICY IF EXISTS "Users can view own patterns" ON player_patterns;
DROP POLICY IF EXISTS "Users can update own patterns" ON player_patterns;
DROP POLICY IF EXISTS "Users can insert own patterns" ON player_patterns;
DROP POLICY IF EXISTS "Service role can view all player patterns" ON player_patterns;
DROP POLICY IF EXISTS "Service role can manage all player patterns" ON player_patterns;

DROP POLICY IF EXISTS "Users can view own behavioral profile" ON player_behavioral_profiles;
DROP POLICY IF EXISTS "Users can update own behavioral profile" ON player_behavioral_profiles;
DROP POLICY IF EXISTS "Users can insert own behavioral profile" ON player_behavioral_profiles;
DROP POLICY IF EXISTS "Service role can view all behavioral profiles" ON player_behavioral_profiles;
DROP POLICY IF EXISTS "Service role can manage all behavioral profiles" ON player_behavioral_profiles;

DROP POLICY IF EXISTS "Users can view own milestones" ON skill_milestones;
DROP POLICY IF EXISTS "Users can insert own milestones" ON skill_milestones;
DROP POLICY IF EXISTS "Service role can view all milestones" ON skill_milestones;
DROP POLICY IF EXISTS "Service role can insert all milestones" ON skill_milestones;

DROP POLICY IF EXISTS "Users can view own relationship key moments" ON relationship_key_moments;
DROP POLICY IF EXISTS "Users can insert own relationship key moments" ON relationship_key_moments;
DROP POLICY IF EXISTS "Service role can view all relationship key moments" ON relationship_key_moments;
DROP POLICY IF EXISTS "Service role can insert all relationship key moments" ON relationship_key_moments;

DROP POLICY IF EXISTS "Users can view own career opportunities" ON career_local_opportunities;
DROP POLICY IF EXISTS "Users can insert own career opportunities" ON career_local_opportunities;
DROP POLICY IF EXISTS "Service role can view all career opportunities" ON career_local_opportunities;
DROP POLICY IF EXISTS "Service role can insert all career opportunities" ON career_local_opportunities;

-- ============================================================================
-- player_urgency_scores policies
-- ============================================================================

-- Users can view their own urgency scores
CREATE POLICY "Users can view own urgency scores"
  ON player_urgency_scores
  FOR SELECT
  USING (auth.uid()::text = player_id);

-- Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all urgency scores"
  ON player_urgency_scores
  FOR SELECT
  TO service_role
  USING (true);

-- Service role can insert/update (for background calculations)
CREATE POLICY "Service role can manage urgency scores"
  ON player_urgency_scores
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- visited_scenes policies
-- ============================================================================

-- Users can view their own visited scenes
CREATE POLICY "Users can view own visited scenes"
  ON visited_scenes
  FOR SELECT
  USING (auth.uid()::text = player_id);

-- Users can insert their own visited scenes
CREATE POLICY "Users can insert own visited scenes"
  ON visited_scenes
  FOR INSERT
  WITH CHECK (auth.uid()::text = player_id);

-- Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all visited scenes"
  ON visited_scenes
  FOR SELECT
  TO service_role
  USING (true);

-- Service role can insert all (for background sync)
CREATE POLICY "Service role can insert all visited scenes"
  ON visited_scenes
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- choice_history policies
-- ============================================================================

-- Users can view their own choice history
CREATE POLICY "Users can view own choice history"
  ON choice_history
  FOR SELECT
  USING (auth.uid()::text = player_id);

-- Users can insert their own choices
CREATE POLICY "Users can insert own choices"
  ON choice_history
  FOR INSERT
  WITH CHECK (auth.uid()::text = player_id);

-- Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all choice history"
  ON choice_history
  FOR SELECT
  TO service_role
  USING (true);

-- Service role can insert all (for background sync)
CREATE POLICY "Service role can insert all choice history"
  ON choice_history
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- player_patterns policies
-- ============================================================================

-- Users can view their own patterns
CREATE POLICY "Users can view own patterns"
  ON player_patterns
  FOR SELECT
  USING (auth.uid()::text = player_id);

-- Users can update their own patterns
CREATE POLICY "Users can update own patterns"
  ON player_patterns
  FOR UPDATE
  USING (auth.uid()::text = player_id)
  WITH CHECK (auth.uid()::text = player_id);

-- Users can insert their own patterns
CREATE POLICY "Users can insert own patterns"
  ON player_patterns
  FOR INSERT
  WITH CHECK (auth.uid()::text = player_id);

-- Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all player patterns"
  ON player_patterns
  FOR SELECT
  TO service_role
  USING (true);

-- Service role can manage all (for background sync)
CREATE POLICY "Service role can manage all player patterns"
  ON player_patterns
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- player_behavioral_profiles policies
-- ============================================================================

-- Users can view their own behavioral profile
CREATE POLICY "Users can view own behavioral profile"
  ON player_behavioral_profiles
  FOR SELECT
  USING (auth.uid()::text = player_id);

-- Users can update their own behavioral profile
CREATE POLICY "Users can update own behavioral profile"
  ON player_behavioral_profiles
  FOR UPDATE
  USING (auth.uid()::text = player_id)
  WITH CHECK (auth.uid()::text = player_id);

-- Users can insert their own behavioral profile
CREATE POLICY "Users can insert own behavioral profile"
  ON player_behavioral_profiles
  FOR INSERT
  WITH CHECK (auth.uid()::text = player_id);

-- Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all behavioral profiles"
  ON player_behavioral_profiles
  FOR SELECT
  TO service_role
  USING (true);

-- Service role can manage all (for background sync)
CREATE POLICY "Service role can manage all behavioral profiles"
  ON player_behavioral_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- skill_milestones policies
-- ============================================================================

-- Users can view their own milestones
CREATE POLICY "Users can view own milestones"
  ON skill_milestones
  FOR SELECT
  USING (auth.uid()::text = player_id);

-- Users can insert their own milestones
CREATE POLICY "Users can insert own milestones"
  ON skill_milestones
  FOR INSERT
  WITH CHECK (auth.uid()::text = player_id);

-- Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all milestones"
  ON skill_milestones
  FOR SELECT
  TO service_role
  USING (true);

-- Service role can insert all (for background sync)
CREATE POLICY "Service role can insert all milestones"
  ON skill_milestones
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- relationship_key_moments policies
-- ============================================================================

-- Users can view their own relationship key moments (via relationship_id)
CREATE POLICY "Users can view own relationship key moments"
  ON relationship_key_moments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM relationship_progress rp
      WHERE rp.id = relationship_key_moments.relationship_id
      AND rp.user_id = auth.uid()::text
    )
  );

-- Users can insert their own relationship key moments
CREATE POLICY "Users can insert own relationship key moments"
  ON relationship_key_moments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationship_progress rp
      WHERE rp.id = relationship_key_moments.relationship_id
      AND rp.user_id = auth.uid()::text
    )
  );

-- Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all relationship key moments"
  ON relationship_key_moments
  FOR SELECT
  TO service_role
  USING (true);

-- Service role can insert all (for background sync)
CREATE POLICY "Service role can insert all relationship key moments"
  ON relationship_key_moments
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- career_local_opportunities policies
-- ============================================================================

-- Users can view their own career opportunities (via career_exploration_id)
CREATE POLICY "Users can view own career opportunities"
  ON career_local_opportunities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM career_explorations ce
      WHERE ce.id = career_local_opportunities.career_exploration_id
      AND ce.user_id = auth.uid()::text
    )
  );

-- Users can insert their own career opportunities
CREATE POLICY "Users can insert own career opportunities"
  ON career_local_opportunities
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM career_explorations ce
      WHERE ce.id = career_local_opportunities.career_exploration_id
      AND ce.user_id = auth.uid()::text
    )
  );

-- Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all career opportunities"
  ON career_local_opportunities
  FOR SELECT
  TO service_role
  USING (true);

-- Service role can insert all (for background sync)
CREATE POLICY "Service role can insert all career opportunities"
  ON career_local_opportunities
  FOR INSERT
  TO service_role
  WITH CHECK (true);

COMMIT;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 013_fix_security_issues completed successfully';
  RAISE NOTICE 'Fixed: 3 views (removed SECURITY DEFINER)';
  RAISE NOTICE 'Enabled RLS: 8 tables';
  RAISE NOTICE 'Created: 24 RLS policies';
END $$;
