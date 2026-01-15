/**
 * Admin Permissions Hook
 * Check user permissions for admin features
 *
 * Usage:
 * const { hasPermission, canRecalculate, canManageRoles } = useAdminPermissions()
 */

'use client'

import { useMemo } from 'react'
import { useUserRole } from './useUserRole'
import {
  hasPermission as checkPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  isAdmin,
  hasAdminAccess,
  getPermissionLabel,
  getPermissionDescription,
  type AdminPermission,
  type AdminRole,
} from '@/lib/admin-permissions'

export function useAdminPermissions() {
  const { role, loading } = useUserRole()

  const permissions = useMemo(() => {
    if (!role) return []
    return getRolePermissions(role as AdminRole)
  }, [role])

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!role) return false
    return checkPermission(role as AdminRole, permission)
  }

  const hasAny = (permissionList: AdminPermission[]): boolean => {
    if (!role) return false
    return hasAnyPermission(role as AdminRole, permissionList)
  }

  const hasAll = (permissionList: AdminPermission[]): boolean => {
    if (!role) return false
    return hasAllPermissions(role as AdminRole, permissionList)
  }

  // Convenience flags for common permissions
  const canViewDashboard = hasPermission('view_dashboard')
  const canRecalculateUrgency = hasPermission('recalculate_urgency')
  const canExportResearch = hasPermission('export_research_data')
  const canExportBriefing = hasPermission('export_advisor_briefing')
  const canManageRoles = hasPermission('manage_roles')
  const canViewUsers = hasPermission('view_users')
  const canAccessApiLogs = hasPermission('access_api_logs')
  const canManageFeatureFlags = hasPermission('manage_feature_flags')

  const userIsAdmin = role ? isAdmin(role as AdminRole) : false
  const userHasAdminAccess = role ? hasAdminAccess(role as AdminRole) : false

  const permissionLabel = role ? getPermissionLabel(role as AdminRole) : 'Unknown'
  const permissionDescription = role ? getPermissionDescription(role as AdminRole) : ''

  return {
    role: role as AdminRole | null,
    loading,
    permissions,
    hasPermission,
    hasAny,
    hasAll,

    // Convenience flags
    canViewDashboard,
    canRecalculateUrgency,
    canExportResearch,
    canExportBriefing,
    canManageRoles,
    canViewUsers,
    canAccessApiLogs,
    canManageFeatureFlags,

    // Role checks
    isAdmin: userIsAdmin,
    hasAdminAccess: userHasAdminAccess,

    // Labels
    permissionLabel,
    permissionDescription,
  }
}
