# Deprecated Components

⚠️ **These components are NOT used in production and should NOT be imported in new code.**

## Purpose

This folder contains game interface components that have been superseded by `StatefulGameInterface.tsx`. They are preserved for historical reference and to understand the evolution of the game's architecture.

## Deprecated Components

### 1. `GameInterface.tsx`
- **Deprecated**: October 17, 2025
- **Reason**: Superseded by StatefulGameInterface with dialogue graph system
- **Features**: Original complex game interface with emotional tracking, visual effects, and Apple Design System
- **Use Instead**: `StatefulGameInterface.tsx`

### 2. `SimpleGameInterface.tsx`
- **Deprecated**: October 17, 2025
- **Reason**: Simplified prototype, not feature-complete
- **Features**: Simplified hooks and analytics, cleaner than complex version
- **Use Instead**: `StatefulGameInterface.tsx`

### 3. `MinimalGameInterface.tsx`
- **Deprecated**: October 17, 2025
- **Reason**: Intermediate implementation, superseded by dialogue graph system
- **Features**: Zero complex dependencies, guaranteed-working simple components
- **Use Instead**: `StatefulGameInterface.tsx`

### 4. `MinimalGameInterfaceShadcn.tsx`
- **Deprecated**: October 21, 2025 (no explicit header, but not in use)
- **Reason**: Experimental shadcn UI integration, never deployed
- **Features**: shadcn components, GameCard variants, Typography system
- **Use Instead**: `StatefulGameInterface.tsx`

## Production Component

The **active** game interface is:
```
components/StatefulGameInterface.tsx
```

**Entry point**: `app/page.tsx`

## Why These Were Deprecated

### Evolution Path:
1. **GameInterface** (v1) → Too complex, hard to maintain
2. **SimpleGameInterface** (v2) → Too simple, missing features
3. **MinimalGameInterface** (v3) → Better, but still linear scenes
4. **StatefulGameInterface** (v4) → ✅ Current: Dialogue graphs, state-driven, cross-character navigation

### Key Improvements in StatefulGameInterface:
- ✅ Dialogue graph system (vs linear scenes)
- ✅ State-aware content selection
- ✅ Cross-character navigation
- ✅ Comprehensive user tracking
- ✅ Skill demonstration recording
- ✅ Background sync for offline-first storage
- ✅ AtmosphericIntro for new users
- ✅ Auto-chunking via DialogueDisplay

## Migration Notes

If you find any imports of these components:

```typescript
// ❌ BAD
import { GameInterface } from '@/components/GameInterface'
import { SimpleGameInterface } from '@/components/SimpleGameInterface'
import { MinimalGameInterface } from '@/components/MinimalGameInterface'

// ✅ GOOD
import StatefulGameInterface from '@/components/StatefulGameInterface'
```

## Testing

These components are **excluded** from automated tests. The content spoiler detection tests only validate the active production code path.

## Deletion Policy

These files will be:
1. ✅ Moved to `deprecated/` (October 21, 2025)
2. ⏳ Kept for 6 months as reference
3. 🗑️ Permanently deleted (April 2026) if no issues arise

## Questions?

See: `components/_GAME_INTERFACE_STATUS.md` for detailed status of all game interface components.

---

**Last Updated**: October 21, 2025  
**Maintainer**: Lux Story Team

