/**
 * Admin Permissions System
 * Role-based access control for admin features
 *
 * Roles hierarchy:
 * - student: No admin access
 * - educator: View-only + limited interventions
 * - admin: Full access to all features
 */

export type AdminRole = 'student' | 'educator' | 'admin'

export type AdminPermission =
  // Dashboard access
  | 'view_dashboard'
  | 'view_all_students'
  | 'view_urgency_data'
  | 'view_pattern_data'
  | 'view_skill_data'
  | 'view_career_data'
  | 'view_evidence_data'
  | 'view_gaps_data'
  | 'view_action_data'

  // Data modification
  | 'recalculate_urgency'
  | 'export_research_data'
  | 'export_advisor_briefing'

  // User management
  | 'view_users'
  | 'manage_roles'
  | 'view_user_activity'

  // System access
  | 'access_api_logs'
  | 'manage_feature_flags'

// Permission definitions for each role
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  student: [],

  educator: [
    // Dashboard viewing (read-only)
    'view_dashboard',
    'view_all_students',
    'view_urgency_data',
    'view_pattern_data',
    'view_skill_data',
    'view_career_data',
    'view_evidence_data',
    'view_gaps_data',
    'view_action_data',

    // Limited data access
    'export_advisor_briefing',
  ],

  admin: [
    // All educator permissions
    'view_dashboard',
    'view_all_students',
    'view_urgency_data',
    'view_pattern_data',
    'view_skill_data',
    'view_career_data',
    'view_evidence_data',
    'view_gaps_data',
    'view_action_data',
    'export_advisor_briefing',

    // Admin-only permissions
    'recalculate_urgency',
    'export_research_data',
    'view_users',
    'manage_roles',
    'view_user_activity',
    'access_api_logs',
    'manage_feature_flags',
  ],
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: AdminRole, permissions: AdminPermission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: AdminRole, permissions: AdminPermission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: AdminRole): AdminPermission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

/**
 * Check if user is admin (full access)
 */
export function isAdmin(role: AdminRole): boolean {
  return role === 'admin'
}

/**
 * Check if user is educator or admin (has some admin access)
 */
export function hasAdminAccess(role: AdminRole): boolean {
  return role === 'educator' || role === 'admin'
}

/**
 * Get permission level label for UI
 */
export function getPermissionLabel(role: AdminRole): string {
  switch (role) {
    case 'admin':
      return 'Full Access'
    case 'educator':
      return 'View Only'
    case 'student':
      return 'No Access'
    default:
      return 'Unknown'
  }
}

/**
 * Get permission level description
 */
export function getPermissionDescription(role: AdminRole): string {
  switch (role) {
    case 'admin':
      return 'Can view, modify, and manage all admin features including user roles and system settings'
    case 'educator':
      return 'Can view student data and export advisor briefings, but cannot modify data or manage users'
    case 'student':
      return 'Cannot access admin features'
    default:
      return ''
  }
}
