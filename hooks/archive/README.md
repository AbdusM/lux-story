# Archived Hooks

Hooks preserved for potential future use but not currently imported anywhere.

## useVirtualScrolling.ts

**Archived:** 2026-02-04
**Reason:** No components currently use virtual scrolling
**Restore when:** Message lists exceed 50+ items and performance degrades

Provides:
- `useVirtualScrolling()` - Generic virtual scrolling state
- `useMessageListVirtualization()` - Pre-configured for message lists

To restore: Move back to `/hooks/` and import where needed.
