-- Migration: Add Pattern Tracking Infrastructure
-- Created: 2025-11-02
-- Purpose: Enable tracking and analysis of decision-making patterns

-- ============================================================================
-- TABLE: pattern_demonstrations
-- Stores every pattern choice a user makes
-- ============================================================================

CREATE TABLE IF NOT EXISTS pattern_demonstrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  pattern_name TEXT NOT NULL CHECK (pattern_name IN ('analytical', 'patience', 'exploring', 'helping', 'building')),
  choice_id TEXT NOT NULL,
  choice_text TEXT,
  scene_id TEXT,
  character_id TEXT,
  context TEXT, -- Description of the pattern demonstration
  demonstrated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

  -- Note: Foreign key constraint removed to avoid dependency issues
  -- Pattern demonstrations can exist independently of user_profiles table
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- Primary lookup: Get all patterns for a user
CREATE INDEX idx_pattern_demos_user
  ON pattern_demonstrations(user_id);

-- Pattern analysis: Group by pattern type
CREATE INDEX idx_pattern_demos_pattern
  ON pattern_demonstrations(pattern_name);

-- Composite: User + Pattern queries (most common)
CREATE INDEX idx_pattern_demos_user_pattern
  ON pattern_demonstrations(user_id, pattern_name);

-- Time-based queries: Recent patterns
CREATE INDEX idx_pattern_demos_timestamp
  ON pattern_demonstrations(demonstrated_at DESC);

-- Scene analysis: Patterns by scene
CREATE INDEX idx_pattern_demos_scene
  ON pattern_demonstrations(scene_id);

-- ============================================================================
-- VIEW: pattern_summaries
-- Aggregated pattern counts per user
-- ============================================================================

CREATE OR REPLACE VIEW pattern_summaries AS
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

-- ============================================================================
-- VIEW: pattern_evolution
-- Pattern usage over time (weekly buckets)
-- ============================================================================

CREATE OR REPLACE VIEW pattern_evolution AS
SELECT
  user_id,
  pattern_name,
  DATE_TRUNC('week', demonstrated_at) as week_start,
  COUNT(*) as weekly_count
FROM pattern_demonstrations
GROUP BY user_id, pattern_name, DATE_TRUNC('week', demonstrated_at)
ORDER BY user_id, week_start, pattern_name;

-- ============================================================================
-- VIEW: user_decision_styles
-- Classify each user's dominant decision style
-- ============================================================================

CREATE OR REPLACE VIEW user_decision_styles AS
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
-- RLS (Row Level Security) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE pattern_demonstrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own pattern demonstrations
CREATE POLICY "Users can view own pattern demonstrations"
  ON pattern_demonstrations
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own pattern demonstrations
CREATE POLICY "Users can insert own pattern demonstrations"
  ON pattern_demonstrations
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Service role can view all (for admin dashboard)
CREATE POLICY "Service role can view all pattern demonstrations"
  ON pattern_demonstrations
  FOR SELECT
  TO service_role
  USING (true);

-- Policy: Service role can insert all (for background sync)
CREATE POLICY "Service role can insert all pattern demonstrations"
  ON pattern_demonstrations
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS for Documentation
-- ============================================================================

COMMENT ON TABLE pattern_demonstrations IS
  'Tracks every decision-making pattern demonstrated by users through their choices';

COMMENT ON COLUMN pattern_demonstrations.pattern_name IS
  'Type of decision-making pattern: analytical, patience, exploring, helping, or building';

COMMENT ON COLUMN pattern_demonstrations.context IS
  'Human-readable description of how this pattern was demonstrated';

COMMENT ON VIEW pattern_summaries IS
  'Aggregated view of pattern counts per user for quick profile loading';

COMMENT ON VIEW pattern_evolution IS
  'Time-series view of pattern usage for trend analysis and evolution charts';

COMMENT ON VIEW user_decision_styles IS
  'Classified decision styles based on dominant and secondary patterns';

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 010_pattern_tracking completed successfully';
  RAISE NOTICE 'Created: pattern_demonstrations table';
  RAISE NOTICE 'Created: pattern_summaries view';
  RAISE NOTICE 'Created: pattern_evolution view';
  RAISE NOTICE 'Created: user_decision_styles view';
  RAISE NOTICE 'Added: 5 indexes for performance';
  RAISE NOTICE 'Added: 4 RLS policies';
END $$;
