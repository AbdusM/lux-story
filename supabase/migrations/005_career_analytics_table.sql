-- ============================================================================
-- Migration 005: Career Analytics Persistence
-- ============================================================================
-- Purpose: Fix SimpleCareerAnalytics ephemeral state issue
-- Problem: Career analytics lost on page refresh (in-memory only)
-- Solution: Create career_analytics table for Supabase-primary architecture
-- ============================================================================

BEGIN;

-- Career analytics table for persistent career exploration data
CREATE TABLE IF NOT EXISTS career_analytics (
  user_id TEXT PRIMARY KEY REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  platforms_explored TEXT[] DEFAULT '{}',
  time_spent_per_platform JSONB DEFAULT '{}',
  career_interests JSONB DEFAULT '[]',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient user lookups
CREATE INDEX IF NOT EXISTS idx_career_analytics_user ON career_analytics(user_id);

-- Index for recent activity queries
CREATE INDEX IF NOT EXISTS idx_career_analytics_updated ON career_analytics(last_updated DESC);

-- Enable Row Level Security
ALTER TABLE career_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own career analytics
CREATE POLICY "Users can view own career analytics"
  ON career_analytics FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own career analytics
CREATE POLICY "Users can insert own career analytics"
  ON career_analytics FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own career analytics
CREATE POLICY "Users can update own career analytics"
  ON career_analytics FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Service role can access all career analytics (for admin dashboard)
CREATE POLICY "Service role can manage career analytics"
  ON career_analytics FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

COMMIT;
