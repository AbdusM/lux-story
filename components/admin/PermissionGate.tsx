/**
 * Permission Gate Component
 * Conditionally renders content based on admin permissions
 *
 * Usage:
 * <PermissionGate permission="manage_roles">
 *   <button>Manage Roles</button>
 * </PermissionGate>
 */

'use client'

import { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { useAdminPermissions } from '@/hooks/useAdminPermissions'
import type { AdminPermission } from '@/lib/admin-permissions'
import { cn } from '@/lib/utils'

interface PermissionGateProps {
  permission: AdminPermission
  children: ReactNode
  fallback?: ReactNode
  showLocked?: boolean  // Show locked state instead of hiding
  className?: string
}

export function PermissionGate({
  permission,
  children,
  fallback,
  showLocked = false,
  className,
}: PermissionGateProps) {
  const { hasPermission, permissionLabel } = useAdminPermissions()

  const hasAccess = hasPermission(permission)

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    if (showLocked) {
      return (
        <div
          className={cn(
            'relative opacity-50 cursor-not-allowed',
            className
          )}
          title={`Requires higher permissions (Current: ${permissionLabel})`}
        >
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Lock className="w-4 h-4" />
              <span>Restricted</span>
            </div>
          </div>
          <div className="pointer-events-none blur-sm">
            {children}
          </div>
        </div>
      )
    }

    return null
  }

  return <>{children}</>
}

/**
 * Permission-restricted button component
 */
interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: AdminPermission
  children: ReactNode
}

export function PermissionButton({
  permission,
  children,
  className,
  ...props
}: PermissionButtonProps) {
  const { hasPermission, permissionLabel } = useAdminPermissions()

  const hasAccess = hasPermission(permission)

  return (
    <button
      {...props}
      disabled={!hasAccess || props.disabled}
      className={cn(
        className,
        !hasAccess && 'opacity-50 cursor-not-allowed'
      )}
      title={
        !hasAccess
          ? `Requires higher permissions (Current: ${permissionLabel})`
          : props.title
      }
    >
      {!hasAccess && <Lock className="w-4 h-4 mr-2" />}
      {children}
    </button>
  )
}
