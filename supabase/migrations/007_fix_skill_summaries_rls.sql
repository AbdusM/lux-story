-- ============================================================================
-- Migration 007: Fix Skill Summaries RLS Policies
-- ============================================================================
-- Purpose: Make skill_summaries table accessible with anon key like other tables
-- Problem: RLS policies require authentication but app uses anon key
-- Solution: Use permissive policies like other tables in the system
-- ============================================================================

BEGIN;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own skill summaries" ON skill_summaries;
DROP POLICY IF EXISTS "Users can insert own skill summaries" ON skill_summaries;
DROP POLICY IF EXISTS "Users can update own skill summaries" ON skill_summaries;
DROP POLICY IF EXISTS "Service role can manage skill summaries" ON skill_summaries;

-- Create permissive policies (consistent with other tables)
CREATE POLICY "Allow all operations on skill_summaries" ON skill_summaries FOR ALL USING (true);

-- Grant access to anon role (if not already granted)
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON skill_summaries TO anon;

COMMIT;
