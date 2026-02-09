-- ============================================================================
-- Migration 019: Interaction Events Telemetry
-- ============================================================================
-- Purpose: Canonical, contract-validated analytics telemetry sink.
-- Notes:
-- - payload stored as JSONB for schema evolution
-- - inserted via server API (service role) and/or RLS for direct client writes
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS interaction_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  node_id TEXT,
  character_id TEXT,
  ordering_variant TEXT,
  ordering_seed TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interaction_events_user ON interaction_events(user_id);
CREATE INDEX IF NOT EXISTS idx_interaction_events_session ON interaction_events(session_id);
CREATE INDEX IF NOT EXISTS idx_interaction_events_type ON interaction_events(event_type);
CREATE INDEX IF NOT EXISTS idx_interaction_events_occurred_at ON interaction_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_interaction_events_user_time ON interaction_events(user_id, occurred_at DESC);

ALTER TABLE interaction_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own telemetry events.
CREATE POLICY "Users can view own interaction events"
  ON interaction_events FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can insert their own telemetry events.
CREATE POLICY "Users can insert own interaction events"
  ON interaction_events FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Service role can manage all telemetry events (admin analytics).
CREATE POLICY "Service role can manage interaction events"
  ON interaction_events FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

COMMIT;

