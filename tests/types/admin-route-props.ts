/**
 * Type-level sentinel for admin route props
 *
 * This file fails at TYPE-CHECK time if pages drift from shared types.
 * No runtime cost - purely compile-time validation.
 *
 * How it works:
 * - Imports the page/layout functions as types
 * - Uses type assertions to verify they accept the correct props
 * - If any page uses the wrong props type, TypeScript will error
 *
 * @see Plan: /Users/abdusmuwwakkil/.claude/plans/bright-meandering-robin.md
 */

import type { AdminUserPageProps, AdminUserLayoutProps } from '@/lib/types/admin'

// Type helpers
type Assert<T extends true> = T
type Extends<A, B> = A extends B ? true : false

// Verify page functions accept AdminUserPageProps
// Using a more lenient check that works with async functions
type AcceptsPageProps<T> = T extends (props: AdminUserPageProps) => unknown ? true : false
type AcceptsLayoutProps<T> = T extends (props: AdminUserLayoutProps) => unknown ? true : false

// Import page default exports
import type { default as MainPage } from '@/app/admin/(protected)/[userId]/page'
import type { default as Layout } from '@/app/admin/(protected)/[userId]/layout'
import type { default as ActionPage } from '@/app/admin/(protected)/[userId]/action/page'
import type { default as CareersPage } from '@/app/admin/(protected)/[userId]/careers/page'
import type { default as EvidencePage } from '@/app/admin/(protected)/[userId]/evidence/page'
import type { default as GapsPage } from '@/app/admin/(protected)/[userId]/gaps/page'
import type { default as PatternsPage } from '@/app/admin/(protected)/[userId]/patterns/page'
import type { default as SkillsPage } from '@/app/admin/(protected)/[userId]/skills/page'
import type { default as UrgencyPage } from '@/app/admin/(protected)/[userId]/urgency/page'

// These assertions fail at type-check if any page doesn't match
// The variable names are prefixed with _ to indicate they're unused at runtime
type _MainPageCheck = Assert<AcceptsPageProps<typeof MainPage>>
type _LayoutCheck = Assert<AcceptsLayoutProps<typeof Layout>>
type _ActionPageCheck = Assert<AcceptsPageProps<typeof ActionPage>>
type _CareersPageCheck = Assert<AcceptsPageProps<typeof CareersPage>>
type _EvidencePageCheck = Assert<AcceptsPageProps<typeof EvidencePage>>
type _GapsPageCheck = Assert<AcceptsPageProps<typeof GapsPage>>
type _PatternsPageCheck = Assert<AcceptsPageProps<typeof PatternsPage>>
type _SkillsPageCheck = Assert<AcceptsPageProps<typeof SkillsPage>>
type _UrgencyPageCheck = Assert<AcceptsPageProps<typeof UrgencyPage>>

// Export a dummy value to make this a valid module
export {}
