export function hasGodModeUrlParam(options: { nodeEnv: string | undefined; search: string | undefined }): boolean {
  const { nodeEnv, search } = options

  // Hard-disable URL param access in production builds.
  if (nodeEnv === 'production') return false

  return typeof search === 'string' && search.includes('godmode=true')
}

