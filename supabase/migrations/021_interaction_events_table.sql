-- ============================================================================
-- Migration 021: Interaction Events Telemetry
-- ============================================================================
-- Purpose: Store UI choice ordering + selection telemetry (bias & engagement analysis)
-- Date: 2026-02-06
-- ============================================================================

-- Ensure UUID helper exists (some Supabase projects don't enable this by default).
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;

-- Ensure extension-installed functions (often installed under `extensions`) are resolvable.
SET search_path TO public, extensions;

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

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_interaction_events_user_time
  ON interaction_events(user_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_interaction_events_type_time
  ON interaction_events(event_type, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_interaction_events_node_time
  ON interaction_events(node_id, occurred_at DESC);

-- Enable Row Level Security
ALTER TABLE interaction_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own interaction events
CREATE POLICY "Users can view own interaction events"
  ON interaction_events FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can insert their own interaction events
CREATE POLICY "Users can insert own interaction events"
  ON interaction_events FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Service role can manage all interaction events (admin + background sync)
CREATE POLICY "Service role can manage interaction events"
  ON interaction_events FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

COMMENT ON TABLE interaction_events IS
  'Telemetry events: choice-set presented (ordered), choice selected, and related UI interactions.';

COMMENT ON COLUMN interaction_events.payload IS
  'Event-specific JSON payload (ordered choices, gravity weights, indices, etc.).';

COMMIT;
