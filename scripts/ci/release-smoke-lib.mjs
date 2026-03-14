export function normalizeCommitSha(value) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
  return /^[0-9a-f]{7,40}$/.test(normalized) ? normalized : null
}

export function commitMatchesExpected(actualCommitSha, expectedCommitSha) {
  const actual = normalizeCommitSha(actualCommitSha)
  const expected = normalizeCommitSha(expectedCommitSha)

  if (!actual || !expected) {
    return false
  }

  return actual === expected || actual.startsWith(expected) || expected.startsWith(actual)
}

export function readPositiveInteger(value, fallbackValue) {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackValue
}
