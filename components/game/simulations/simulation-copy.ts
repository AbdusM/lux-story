export function humanizeSimulationContextLabel(label?: string): string | null {
  if (!label) return null

  const normalized = label.trim()
  if (!normalized) return null

  const canonical = normalized.toUpperCase().replace(/[\s-]+/g, '_')
  const overrides: Record<string, string> = {
    ARCHIVE: 'Archive Note',
    CASE_FILE: 'Case File',
    DATASET: 'Case File',
    EVIDENCE: 'Reference Notes',
    FOUNDER_MEETING: 'Meeting Record',
    FRAMEWORK: 'Working Brief',
    LOG: 'Logbook',
    QUERY: 'Signal Trace',
    RECORD: 'Record',
    REPORT: 'Case Summary',
    SCENARIO: 'Scenario Brief',
    TERMINAL: 'Access Panel',
    TIMELINE: 'Timeline Note',
  }

  if (overrides[canonical]) {
    return overrides[canonical]
  }

  return normalized
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}
