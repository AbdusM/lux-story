-- ============================================================================
-- Migration 020: Backfill Legacy "analyzing" Pattern Name
-- ============================================================================
-- Purpose: Normalize legacy player_patterns rows to canonical "analytical"
-- Date: 2026-02-01
-- ============================================================================

BEGIN;

-- If a player already has an "analytical" row, drop the legacy "analyzing" row.
DELETE FROM player_patterns
WHERE pattern_name = 'analyzing'
  AND EXISTS (
    SELECT 1
    FROM player_patterns AS p2
    WHERE p2.player_id = player_patterns.player_id
      AND p2.pattern_name = 'analytical'
  );

-- Otherwise, rename legacy "analyzing" to "analytical".
UPDATE player_patterns
SET pattern_name = 'analytical'
WHERE pattern_name = 'analyzing';

COMMIT;
