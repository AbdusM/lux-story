-- ============================================================================
-- Migration 017: Fix Career Analytics RLS Performance Issues
-- ============================================================================
-- Purpose: Fix auth_rls_initplan and multiple_permissive_policies warnings
-- 
-- Issues Fixed:
-- 1. Service role policy uses auth.jwt() which re-evaluates per row
-- 2. Service role policy applies to all roles, causing multiple permissive policies
--
-- Solution:
-- - Change service role policy to use TO service_role (role-specific, no auth function)
-- - This eliminates both warnings
--
-- Created: 2025-11-30
-- Dependencies: Migration 005, 013, 014
-- ============================================================================

BEGIN;

-- ============================================================================
-- FIX CAREER_ANALYTICS RLS POLICIES
-- ============================================================================

-- Drop the problematic service role policy
DROP POLICY IF EXISTS "Service role can manage career analytics" ON career_analytics;

-- Recreate with proper TO service_role syntax (no auth function evaluation)
-- This policy only applies to service_role, eliminating multiple_permissive_policies
CREATE POLICY "Service role can manage career analytics"
  ON career_analytics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Note: User policies from migration 014 already use (select auth.uid())::text
-- so they're already optimized. No changes needed there.

COMMIT;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 017_fix_career_analytics_rls completed successfully';
  RAISE NOTICE 'Fixed: Service role policy now uses TO service_role (no auth function)';
  RAISE NOTICE 'Result: Eliminates auth_rls_initplan and multiple_permissive_policies warnings';
END $$;
