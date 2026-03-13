import { buildMarketSignalFreshnessReport } from '@/lib/labor-market/market-signal-freshness-report'

type OutputFormat = 'text' | 'json' | 'markdown'

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`[report-market-signal-freshness] ${message}`)
  process.exit(1)
}

function parseFormatArg(): OutputFormat {
  const formatArg = process.argv.find((arg) => arg.startsWith('--format='))
  if (!formatArg) return 'text'

  const value = formatArg.slice('--format='.length)
  if (value === 'text' || value === 'json' || value === 'markdown') return value

  fail(`Unsupported format "${value}". Expected text, json, or markdown.`)
}

function parseThresholdArg(): number {
  const thresholdArg = process.argv.find((arg) => arg.startsWith('--threshold-days='))
  if (!thresholdArg) return 14

  const value = Number.parseInt(thresholdArg.slice('--threshold-days='.length), 10)
  if (!Number.isFinite(value) || value < 0) {
    fail('Expected --threshold-days to be a non-negative integer.')
  }

  return value
}

function shouldFailOnStale(): boolean {
  return process.argv.includes('--fail-on-stale')
}

function formatAgeDays(value: number | null): string {
  if (value === null) return 'invalid'
  return `${value}d`
}

function formatDaysUntilStale(value: number | null): string {
  if (value === null) return 'n/a'
  return `${value}d`
}

function formatTextReport(): string {
  const report = buildMarketSignalFreshnessReport({
    warningThresholdDays: parseThresholdArg(),
  })

  const lines = [
    'Market Signal Freshness Report',
    `Generated: ${report.generatedAtIso}`,
    `Warning threshold: ${report.warningThresholdDays} day(s)`,
    `Rows: ${report.summary.totalRows} total / ${report.summary.freshRows} fresh / ${report.summary.warningRows} warning / ${report.summary.staleRows} stale / ${report.summary.invalidTimestampRows} invalid`,
    '',
  ]

  if (report.rows.length === 0) {
    lines.push('No dataset rows found.')
    return lines.join('\n')
  }

  report.rows.forEach((row) => {
    lines.push(
      `[${row.status.toUpperCase()}] ${row.kind} | ${row.version} | age=${formatAgeDays(row.ageDays)} | days-until-stale=${formatDaysUntilStale(row.daysUntilStale)}`,
    )
    lines.push(`  Summary: ${row.summary}`)
    lines.push(`  Updated: ${row.updatedAtIso}`)
    lines.push(`  Source: ${row.source}`)
  })

  return lines.join('\n')
}

function formatMarkdownReport(): string {
  const report = buildMarketSignalFreshnessReport({
    warningThresholdDays: parseThresholdArg(),
  })

  return [
    '# Market Signal Freshness Report',
    '',
    `Generated: ${report.generatedAtIso}`,
    '',
    `Warning threshold: ${report.warningThresholdDays} day(s)`,
    '',
    `Totals: ${report.summary.totalRows} total / ${report.summary.freshRows} fresh / ${report.summary.warningRows} warning / ${report.summary.staleRows} stale / ${report.summary.invalidTimestampRows} invalid`,
    '',
    '| Status | Kind | Version | Age | Days Until Stale | Updated | Summary |',
    '| --- | --- | --- | ---: | ---: | --- | --- |',
    ...report.rows.map((row) =>
      `| ${row.status} | ${row.kind} | ${row.version} | ${formatAgeDays(row.ageDays)} | ${formatDaysUntilStale(row.daysUntilStale)} | ${row.updatedAtIso} | ${row.summary} |`,
    ),
  ].join('\n')
}

function main(): void {
  const warningThresholdDays = parseThresholdArg()
  const report = buildMarketSignalFreshnessReport({ warningThresholdDays })
  const format = parseFormatArg()

  if (format === 'json') {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(report, null, 2))
  } else if (format === 'markdown') {
    // eslint-disable-next-line no-console
    console.log(formatMarkdownReport())
  } else {
    // eslint-disable-next-line no-console
    console.log(formatTextReport())
  }

  if (shouldFailOnStale() && (report.summary.staleRows > 0 || report.summary.invalidTimestampRows > 0)) {
    process.exit(1)
  }
}

main()
