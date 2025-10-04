/**
 * Admin Dashboard - Urgency Color System
 * Agent 2: WCAG AA Color Compliance Engineer
 *
 * Helper function for urgency CSS classes with WCAG AA compliance
 * Provides consistent color treatment across:
 * - Card backgrounds with border-left accent
 * - Percentage numbers matching urgency badge colors
 * - Badge styling
 */

export function getUrgencyClasses(level: string | null) {
  switch (level) {
    case 'critical':
      return {
        card: 'admin-urgency-critical-card p-4 sm:p-6 rounded-lg',
        percentage: 'text-3xl sm:text-4xl admin-urgency-critical-percentage',
        badge: 'bg-red-100 text-red-800'
      };
    case 'high':
      return {
        card: 'admin-urgency-high-card p-4 sm:p-6 rounded-lg',
        percentage: 'text-3xl sm:text-4xl admin-urgency-high-percentage',
        badge: 'bg-orange-100 text-orange-800'
      };
    case 'medium':
      return {
        card: 'admin-urgency-medium-card p-4 sm:p-6 rounded-lg',
        percentage: 'text-3xl sm:text-4xl admin-urgency-medium-percentage',
        badge: 'bg-yellow-100 text-yellow-800'
      };
    case 'low':
      return {
        card: 'admin-urgency-low-card p-4 sm:p-6 rounded-lg',
        percentage: 'text-3xl sm:text-4xl admin-urgency-low-percentage',
        badge: 'bg-green-100 text-green-800'
      };
    default:
      return {
        card: 'p-4 sm:p-6 bg-gray-50 rounded-lg',
        percentage: 'text-3xl sm:text-4xl font-bold text-gray-900',
        badge: 'bg-gray-100 text-gray-800'
      };
  }
}
