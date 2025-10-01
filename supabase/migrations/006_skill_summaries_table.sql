-- ============================================================================
-- Migration 006: Skill Summaries Persistence
-- ============================================================================
-- Purpose: Sync rich skill demonstration contexts to Supabase
-- Problem: SkillTracker stores 100-150 word contexts in localStorage only
-- Solution: Create skill_summaries table for admin dashboard access
-- Strategy: Sync summaries (not raw demonstrations) - pragmatic Option B
-- ============================================================================

BEGIN;

-- Skill summaries table for rich contextual skill tracking
CREATE TABLE IF NOT EXISTS skill_summaries (
  user_id TEXT NOT NULL REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  demonstration_count INT DEFAULT 0,
  latest_context TEXT,
  scenes_involved TEXT[] DEFAULT '{}',
  last_demonstrated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_name)
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_skill_summaries_user ON skill_summaries(user_id);

-- Index for skill name queries (cohort analytics)
CREATE INDEX IF NOT EXISTS idx_skill_summaries_skill ON skill_summaries(skill_name);

-- Index for recent activity
CREATE INDEX IF NOT EXISTS idx_skill_summaries_demonstrated ON skill_summaries(last_demonstrated DESC);

-- Composite index for user + skill lookups
CREATE INDEX IF NOT EXISTS idx_skill_summaries_user_skill ON skill_summaries(user_id, skill_name);

-- Enable Row Level Security
ALTER TABLE skill_summaries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own skill summaries
CREATE POLICY "Users can view own skill summaries"
  ON skill_summaries FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own skill summaries
CREATE POLICY "Users can insert own skill summaries"
  ON skill_summaries FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own skill summaries
CREATE POLICY "Users can update own skill summaries"
  ON skill_summaries FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Service role can access all skill summaries (for admin dashboard)
CREATE POLICY "Service role can manage skill summaries"
  ON skill_summaries FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_skill_summary_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
CREATE TRIGGER skill_summary_updated_at
  BEFORE UPDATE ON skill_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_skill_summary_timestamp();

COMMIT;
