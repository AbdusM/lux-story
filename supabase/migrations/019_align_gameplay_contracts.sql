-- ============================================================================
-- Migration 019: Align Gameplay Sync Contracts
-- ============================================================================
-- Purpose: Bring DB schema in line with gameplay sync payloads
-- Date: 2026-02-01
-- ============================================================================

BEGIN;

-- 1) Platform state sync fields (used by /api/user/platform-state)
ALTER TABLE platform_states
  ADD COLUMN IF NOT EXISTS current_scene TEXT,
  ADD COLUMN IF NOT EXISTS global_flags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS patterns JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN platform_states.current_scene IS 'Latest scene/node id from core game state';
COMMENT ON COLUMN platform_states.global_flags IS 'Global flag snapshot from core game state';
COMMENT ON COLUMN platform_states.patterns IS 'Serialized pattern scores from core game state';

-- 2) Career analytics fields (used by /api/user/career-analytics)
ALTER TABLE career_analytics
  ADD COLUMN IF NOT EXISTS choices_made INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sections_viewed TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS birmingham_opportunities JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN career_analytics.choices_made IS 'Total choices captured during career exploration';
COMMENT ON COLUMN career_analytics.time_spent_seconds IS 'Total time spent in career exploration UI (seconds)';
COMMENT ON COLUMN career_analytics.sections_viewed IS 'UI sections viewed during career exploration';
COMMENT ON COLUMN career_analytics.birmingham_opportunities IS 'Local opportunities surfaced/selected during exploration';

-- 3) Action plan persistence (used by /api/user/action-plan)
CREATE TABLE IF NOT EXISTS user_action_plans (
  user_id TEXT PRIMARY KEY REFERENCES player_profiles(user_id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_action_plans_updated ON user_action_plans(updated_at DESC);

ALTER TABLE user_action_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own action plans"
  ON user_action_plans FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own action plans"
  ON user_action_plans FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own action plans"
  ON user_action_plans FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage action plans"
  ON user_action_plans FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- 4) Allow both legacy + canonical pattern names
ALTER TABLE player_patterns
  DROP CONSTRAINT IF EXISTS player_patterns_pattern_name_check;

ALTER TABLE player_patterns
  ADD CONSTRAINT player_patterns_pattern_name_check CHECK (pattern_name IN (
    'helping', 'analyzing', 'analytical', 'building', 'exploring', 'patience', 'rushing'
  ));

COMMIT;
