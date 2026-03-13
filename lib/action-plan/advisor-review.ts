import { z } from 'zod'

export const AdvisorReviewStatusSchema = z.enum(['draft', 'needs_work', 'approved'])

export const AdvisorReviewSchema = z
  .object({
    status: AdvisorReviewStatusSchema,
    feedback: z.string().max(8_000).optional().default(''),
    updatedAt: z.string().datetime(),
  })
  .passthrough()

export type AdvisorReview = z.infer<typeof AdvisorReviewSchema>

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function extractAdvisorReview(plan: unknown): AdvisorReview | null {
  if (!isPlainObject(plan)) return null

  const candidate = plan.advisorReview
  const result = AdvisorReviewSchema.safeParse(candidate)
  if (!result.success) return null
  return result.data
}

export function stripAdvisorReviewFromPlan(
  plan: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!isPlainObject(plan)) return {}

  const { advisorReview: _advisorReview, ...rest } = plan
  return rest
}

export function withAdvisorReview(
  plan: Record<string, unknown> | null | undefined,
  review: AdvisorReview,
): Record<string, unknown> {
  return { ...(isPlainObject(plan) ? plan : {}), advisorReview: review }
}

