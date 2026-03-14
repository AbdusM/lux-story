import packageJson from '@/package.json'

type EnvShape = Record<string, string | undefined>

export interface BuildMetadata {
  version: string
  commitSha: string | null
  commitShaShort: string | null
  deploymentUrl: string | null
}

export function normalizeCommitSha(value: string | undefined): string | null {
  const normalized = value?.trim().toLowerCase() ?? ''
  if (!/^[0-9a-f]{7,40}$/.test(normalized)) {
    return null
  }

  return normalized
}

function normalizeDeploymentUrl(value: string | undefined): string | null {
  const normalized = value?.trim() ?? ''
  if (!normalized) {
    return null
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized
  }

  return `https://${normalized}`
}

export function resolveBuildMetadata(env: EnvShape = process.env): BuildMetadata {
  const commitSha = normalizeCommitSha(
    env.VERCEL_GIT_COMMIT_SHA ?? env.GIT_COMMIT_SHA ?? env.COMMIT_SHA
  )

  return {
    version: typeof packageJson.version === 'string' ? packageJson.version : 'unknown',
    commitSha,
    commitShaShort: commitSha ? commitSha.slice(0, 7) : null,
    deploymentUrl: normalizeDeploymentUrl(env.VERCEL_URL),
  }
}
