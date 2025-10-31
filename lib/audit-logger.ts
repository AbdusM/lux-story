/**
 * Audit Logger
 * Structured logging for admin actions to support compliance (FERPA/GDPR)
 *
 * Logs are written to console in JSON format for easy parsing and monitoring
 * in production environments (e.g., Vercel logs)
 */

export interface AuditLogEntry {
  timestamp: string
  type: 'AUDIT'
  action: string
  admin: string
  userId?: string
  metadata?: Record<string, unknown>
}

/**
 * Log an admin action for audit trail
 *
 * @param action - Description of the action (e.g., 'view_user_profile', 'export_data')
 * @param admin - Admin identifier (hashed for privacy)
 * @param userId - Student/user ID being accessed (if applicable)
 * @param metadata - Additional context (e.g., IP address, query params)
 *
 * @example
 * auditLog('view_user_profile', 'admin_abc', 'student_123', { ip: '192.168.1.1' })
 */
export function auditLog(
  action: string,
  admin: string,
  userId?: string,
  metadata?: Record<string, unknown>
): void {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    type: 'AUDIT',
    action,
    admin: admin.substring(0, 8), // Truncate for privacy
    ...(userId && { userId }),
    ...(metadata && { metadata })
  }

  // Log as JSON for structured logging systems (Vercel, CloudWatch, etc.)
  console.log(JSON.stringify(entry))
}

/**
 * Extract admin identifier from request
 * Uses cookie token as identifier (first 8 chars for privacy)
 */
export function getAdminIdentifier(request: Request): string {
  // In a real system, this would extract from JWT or session
  // For now, we use a generic identifier
  const token = request.headers.get('cookie')
  return token ? `admin_${token.substring(0, 8)}` : 'admin_unknown'
}
