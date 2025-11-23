/**
 * Admin Dashboard Date Formatting Utilities
 *
 * Standardizes date/time displays across the admin dashboard according to
 * accessibility and UX best practices (Section 3.3 of Accessibility Plan).
 *
 * FORMATTING RULES:
 * 1. Urgency Tab: Always relative time ("2 hours ago")
 * 2. Evidence Tab: Always full dates for scientific accuracy ("October 3, 2025 at 10:59 PM")
 * 3. Activity Summaries: Hybrid approach (<7 days = relative, ≥7 days = full date)
 * 4. Always include labels ("Last active: 2 hours ago")
 */

export type DateContext = 'urgency' | 'evidence' | 'activity';
export type ViewMode = 'family' | 'research';

/**
 * Formats a date according to the specified context and view mode
 *
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param context - Where the date will be displayed ('urgency', 'evidence', 'activity')
 * @param viewMode - Current admin view mode ('family' or 'research')
 * @returns Formatted date string
 */
export function formatAdminDate(
  date: Date | string | number,
  context: DateContext,
  viewMode: ViewMode = 'family'
): string {
  const d = new Date(date);

  // Validate date
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // RULE 1: Urgency Tab - Always relative time
  if (context === 'urgency') {
    return formatRelativeTime(d, now);
  }

  // RULE 2: Evidence Tab - Always full date for scientific accuracy
  if (context === 'evidence') {
    return formatFullDate(d, viewMode);
  }

  // RULE 3: Activity Summaries - Hybrid approach
  if (context === 'activity') {
    if (diffDays < 7) {
      return formatRelativeTime(d, now);
    } else {
      return formatLongDate(d);
    }
  }

  // Fallback
  return formatFullDate(d, viewMode);
}

/**
 * Format as relative time ("2 hours ago", "5 days ago")
 * Always includes "ago" suffix for clarity
 */
function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();

  // Future dates
  if (diffMs < 0) {
    return 'in the future';
  }

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

/**
 * Format as full date with time (Evidence tab)
 * Research mode: "October 3, 2025 at 10:59 PM"
 * Family mode: Same format (scientific accuracy needed)
 */
function formatFullDate(date: Date, _viewMode: ViewMode): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format as long date without time (Activity summaries for older dates)
 * "October 1, 2025"
 */
function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date with label prefix
 * Ensures no "naked" dates appear in the UI
 *
 * @param date - Date to format
 * @param context - Display context
 * @param viewMode - Current view mode
 * @param label - Label prefix (e.g., "Last active", "Demonstrated")
 * @returns Formatted string with label
 */
export function formatAdminDateWithLabel(
  date: Date | string | number,
  context: DateContext,
  viewMode: ViewMode,
  label: string
): string {
  const formattedDate = formatAdminDate(date, context, viewMode);
  return `${label}: ${formattedDate}`;
}

/**
 * Format date range (for Evidence tab or reports)
 * "October 1, 2025 to October 3, 2025"
 */
export function formatDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  _viewMode: ViewMode = 'research'
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date range';
  }

  const startFormatted = formatLongDate(start);
  const endFormatted = formatLongDate(end);

  return `${startFormatted} to ${endFormatted}`;
}

/**
 * Get time since a date (for recency indicators)
 * Returns object with days count and category
 */
export function getTimeSince(date: Date | string | number): {
  days: number;
  category: 'recent' | 'this-week' | 'older';
  label: string;
} {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return { days: 999, category: 'older', label: 'Unknown' };
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 3) {
    return { days, category: 'recent', label: 'New!' };
  } else if (days < 7) {
    return { days, category: 'this-week', label: 'This week' };
  } else {
    return { days, category: 'older', label: `${days} days ago` };
  }
}
