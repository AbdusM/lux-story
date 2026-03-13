import { z } from 'zod'

const PostureSchema = z.enum(['defend', 'balance', 'attack'])
const ProofKindSchema = z.enum(['resume_bullets', 'one_pager', 'interview_stories'])

const UserWritableActionPlanSchema = z
  .object({
    posture: PostureSchema.optional(),
    thisWeekFocus: z.string().max(2_000).optional(),
    nextMonthGoal: z.string().max(2_000).optional(),
    supportNeeded: z.string().max(2_000).optional(),
    notes: z.string().max(4_000).optional(),
    marketMove: z.string().max(2_000).optional(),
    skillMove: z.string().max(2_000).optional(),
    adjacentRoute: z.string().max(2_000).optional(),
    proofKind: ProofKindSchema.optional(),
    proofText: z.string().max(16_000).optional(),
    updatedAt: z.string().max(64).optional(),
    version: z.number().int().min(1).max(99).optional(),
    adaptiveGuidance: z.unknown().optional(),
  })
  .strip()

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export type UserWritableActionPlan = z.infer<typeof UserWritableActionPlanSchema>

export function sanitizeUserWritableActionPlan(
  input: Record<string, unknown>,
): { ok: true; plan: UserWritableActionPlan } | { ok: false } {
  if (!isPlainObject(input)) return { ok: false }

  const parsed = UserWritableActionPlanSchema.safeParse(input)
  if (!parsed.success) return { ok: false }

  const withoutUndefined: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value === undefined) continue
    withoutUndefined[key] = value
  }

  return { ok: true, plan: withoutUndefined as UserWritableActionPlan }
}

