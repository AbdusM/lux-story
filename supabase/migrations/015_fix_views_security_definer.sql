-- ============================================================================
-- Migration 015: Fix Views SECURITY DEFINER (Final Fix)
-- ============================================================================
-- Purpose: Remove SECURITY DEFINER from views that still have it
-- 
-- This is a targeted fix for views that migration 013 didn't fully resolve.
-- We'll drop and recreate them using the simplest possible syntax.
--
-- Created: 2025-11-30
-- Dependencies: 010_pattern_tracking.sql, 013_fix_security_issues.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- FIX VIEWS: Drop and recreate without SECURITY DEFINER
-- ============================================================================

-- Fix pattern_summaries
DROP VIEW IF EXISTS pattern_summaries CASCADE;
CREATE VIEW pattern_summaries AS
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

-- Fix pattern_evolution
DROP VIEW IF EXISTS pattern_evolution CASCADE;
CREATE VIEW pattern_evolution AS
SELECT
  user_id,
  pattern_name,
  DATE_TRUNC('week', demonstrated_at) as week_start,
  COUNT(*) as weekly_count
FROM pattern_demonstrations
GROUP BY user_id, pattern_name, DATE_TRUNC('week', demonstrated_at)
ORDER BY user_id, week_start, pattern_name;

-- Fix user_decision_styles
DROP VIEW IF EXISTS user_decision_styles CASCADE;
CREATE VIEW user_decision_styles AS
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

-- Restore comments
COMMENT ON VIEW pattern_summaries IS
  'Aggregated view of pattern counts per user for quick profile loading';

COMMENT ON VIEW pattern_evolution IS
  'Time-series view of pattern usage for trend analysis and evolution charts';

COMMENT ON VIEW user_decision_styles IS
  'Classified decision styles based on dominant and secondary patterns';

COMMIT;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 015_fix_views_security_definer completed successfully';
  RAISE NOTICE 'Fixed: 3 views (removed SECURITY DEFINER)';
  RAISE NOTICE 'Views now use default SECURITY INVOKER behavior';
END $$;
