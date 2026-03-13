-- ============================================================================
-- Migration 024: Counselor Follow-Up Event Log
-- ============================================================================
-- Purpose: Persist durable counselor follow-up history outside the action-plan
-- JSON blob so admin audit trails do not roll off.
-- Date: 2026-03-13
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;

SET search_path TO public, extensions;

CREATE TABLE IF NOT EXISTS action_plan_follow_up_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (
    status IN ('contacted', 'follow_up_due', 'resolved')
  ),
  note TEXT,
  updated_by_user_id TEXT,
  updated_by_email TEXT,
  updated_by_full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_plan_follow_up_events_user_time
  ON action_plan_follow_up_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_action_plan_follow_up_events_status_time
  ON action_plan_follow_up_events(status, created_at DESC);

ALTER TABLE action_plan_follow_up_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage counselor follow-up events"
  ON action_plan_follow_up_events;
CREATE POLICY "Service role can manage counselor follow-up events"
  ON action_plan_follow_up_events FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

COMMENT ON TABLE action_plan_follow_up_events IS
  'Durable admin/counselor follow-up event log for learner action-plan outreach.';

COMMIT;
