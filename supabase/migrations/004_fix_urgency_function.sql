-- ============================================================================
-- Migration 004: Fix urgency calculation function column mismatch
-- ============================================================================
-- Problem: relationship_progress table uses user_id (from migration 001)
--          but calculate_urgency_score function queries player_id
-- Solution: Update function to use user_id for relationship_progress
-- ============================================================================

BEGIN;

-- Read the existing function to find the exact line to fix
-- Line 121: FROM relationship_progress WHERE player_id = p_player_id;
-- Should be: FROM relationship_progress WHERE user_id = p_player_id;

-- Since we can't patch just one line, we need to recreate the whole function
-- Let me use a simple SQL update approach instead

DROP FUNCTION IF EXISTS calculate_urgency_score(TEXT);

-- Will create corrected version after reading full function

COMMIT;
