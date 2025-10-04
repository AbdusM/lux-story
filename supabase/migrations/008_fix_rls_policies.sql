-- Migration 008: Fix Row Level Security Policies
-- Replace overly permissive USING (true) policies with proper user-scoped policies
--
-- SECURITY IMPROVEMENT:
-- - Players can only access their own data
-- - Service role can bypass RLS for admin operations
-- - Anon users can create their own records

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all operations on player_profiles" ON player_profiles;
DROP POLICY IF EXISTS "Allow all operations on skill_demonstrations" ON skill_demonstrations;
DROP POLICY IF EXISTS "Allow all operations on career_explorations" ON career_explorations;
DROP POLICY IF EXISTS "Allow all operations on relationship_progress" ON relationship_progress;
DROP POLICY IF EXISTS "Allow all operations on platform_states" ON platform_states;

-- PLAYER PROFILES TABLE
-- Players can read and update their own profile
-- Anyone can create a new profile (for initial registration)
CREATE POLICY "Users can read own profile"
  ON player_profiles
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own profile"
  ON player_profiles
  FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own profile"
  ON player_profiles
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- SKILL DEMONSTRATIONS TABLE
-- Players can read/insert their own demonstrations
CREATE POLICY "Users can read own skill demonstrations"
  ON skill_demonstrations
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own skill demonstrations"
  ON skill_demonstrations
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- CAREER EXPLORATIONS TABLE
-- Players can read/insert/update their own explorations
CREATE POLICY "Users can read own career explorations"
  ON career_explorations
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own career explorations"
  ON career_explorations
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own career explorations"
  ON career_explorations
  FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true));

-- RELATIONSHIP PROGRESS TABLE
-- Players can read/insert/update their own relationship data
CREATE POLICY "Users can read own relationships"
  ON relationship_progress
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own relationships"
  ON relationship_progress
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own relationships"
  ON relationship_progress
  FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true));

-- PLATFORM STATES TABLE
-- Players can read/insert/update their own platform states
CREATE POLICY "Users can read own platform states"
  ON platform_states
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own platform states"
  ON platform_states
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own platform states"
  ON platform_states
  FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true));

-- Helper function to set current user ID in session
-- This should be called by API routes before database operations
CREATE OR REPLACE FUNCTION set_current_user_id(p_user_id TEXT)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', p_user_id, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION set_current_user_id IS 'Set the current user ID for RLS policies. Call this from API routes.';

-- Grant execute permission to anon role
GRANT EXECUTE ON FUNCTION set_current_user_id TO anon;

-- Note: Service role key bypasses RLS automatically, so admin operations still work
