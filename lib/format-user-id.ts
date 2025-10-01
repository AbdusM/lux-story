/**
 * Format user ID timestamp into human-readable date
 * User IDs follow format: player_TIMESTAMP
 */
export function formatUserId(userId: string): string {
  // Extract timestamp from player_TIMESTAMP format
  const match = userId.match(/player_(\d+)/)
  if (!match) return userId

  const timestamp = parseInt(match[1])

  // Convert to milliseconds (our timestamps are in seconds with extra digits)
  // player_1759274143456 -> 1759274143 seconds
  const timestampSeconds = Math.floor(timestamp / 1000)

  const date = new Date(timestampSeconds * 1000)

  // Format as "MMM DD, YYYY HH:MM AM/PM"
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)

  return formatted
}

/**
 * Get short format for user display
 * Example: "Sep 30, 7:15 PM"
 */
export function formatUserIdShort(userId: string): string {
  const match = userId.match(/player_(\d+)/)
  if (!match) return userId.slice(0, 12) + '...'

  const timestamp = parseInt(match[1])
  const timestampSeconds = Math.floor(timestamp / 1000)
  const date = new Date(timestampSeconds * 1000)

  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)

  return formatted
}

/**
 * Get relative time for user display
 * Example: "5 minutes ago", "2 hours ago"
 */
export function formatUserIdRelative(userId: string): string {
  const match = userId.match(/player_(\d+)/)
  if (!match) return userId

  const timestamp = parseInt(match[1])
  const timestampSeconds = Math.floor(timestamp / 1000)
  const date = new Date(timestampSeconds * 1000)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  if (diffDays < 7) return `${diffDays} days ago`

  return formatUserIdShort(userId)
}
