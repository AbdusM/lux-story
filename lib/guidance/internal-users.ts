export const GUIDANCE_INTERNAL_VALIDATION_USER_PREFIX = 'guidance_validation_'
export const GUIDANCE_INTERNAL_VALIDATION_USER_ID = `${GUIDANCE_INTERNAL_VALIDATION_USER_PREFIX}internal`

export function isInternalGuidanceValidationUserId(userId: string): boolean {
  return userId.startsWith(GUIDANCE_INTERNAL_VALIDATION_USER_PREFIX)
}
