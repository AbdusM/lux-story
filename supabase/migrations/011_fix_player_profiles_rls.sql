-- Migration: Fix Player Profiles RLS for Profile Creation
-- Created: 2025-11-02
-- Purpose: Add service role policies to allow profile creation without auth context

-- ============================================================================
-- PROBLEM: Current RLS policies require current_setting('app.current_user_id')
-- which is never set, causing profile creation to fail silently
-- ============================================================================

-- Add service role policies for player_profiles
-- This allows the backend to create profiles without requiring user context

CREATE POLICY "Service role can read all player profiles"
  ON player_profiles
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert player profiles"
  ON player_profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update player profiles"
  ON player_profiles
  FOR UPDATE
  TO service_role
  USING (true);

-- ============================================================================
-- Also add service role policies for related tables that may have same issue
-- ============================================================================

-- skill_demonstrations
CREATE POLICY "Service role can insert skill demonstrations"
  ON skill_demonstrations
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read all skill demonstrations"
  ON skill_demonstrations
  FOR SELECT
  TO service_role
  USING (true);

-- career_explorations
CREATE POLICY "Service role can insert career explorations"
  ON career_explorations
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read all career explorations"
  ON career_explorations
  FOR SELECT
  TO service_role
  USING (true);

-- career_analytics
CREATE POLICY "Service role can insert career analytics"
  ON career_analytics
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read all career analytics"
  ON career_analytics
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can update career analytics"
  ON career_analytics
  FOR UPDATE
  TO service_role
  USING (true);

-- skill_summaries
CREATE POLICY "Service role can insert skill summaries"
  ON skill_summaries
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read all skill summaries"
  ON skill_summaries
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can update skill summaries"
  ON skill_summaries
  FOR UPDATE
  TO service_role
  USING (true);

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 011_fix_player_profiles_rls completed successfully';
  RAISE NOTICE 'Added service_role policies for:';
  RAISE NOTICE '  - player_profiles (SELECT, INSERT, UPDATE)';
  RAISE NOTICE '  - skill_demonstrations (SELECT, INSERT)';
  RAISE NOTICE '  - career_explorations (SELECT, INSERT)';
  RAISE NOTICE '  - career_analytics (SELECT, INSERT, UPDATE)';
  RAISE NOTICE '  - skill_summaries (SELECT, INSERT, UPDATE)';
  RAISE NOTICE 'Backend can now create profiles and sync data without auth context';
END $$;
