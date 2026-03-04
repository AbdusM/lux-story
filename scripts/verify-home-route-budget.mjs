#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const REPO_ROOT = process.cwd()
const DEFAULT_BUILD_LOG = '.next-build-output.log'
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/home-route-budget-report.json')

// Current enforced budgets. Tighten over time using CI env overrides.
const ROUTE_CHUNK_BUDGET_KB = Number(process.env.HOME_ROUTE_CHUNK_KB_BUDGET || 340)
const FIRST_LOAD_BUDGET_KB = Number(process.env.HOME_ROUTE_FIRST_LOAD_KB_BUDGET || 1230)

function fail(message) {
  // eslint-disable-next-line no-console
  console.error(`\n[verify-home-route-budget] ${message}\n`)
  process.exit(1)
}

function toKilobytes(value, unit) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return NaN
  if (unit === 'MB') return numeric * 1024
  return numeric
}

function writeReport(payload) {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function main() {
  const buildLogPath = path.resolve(REPO_ROOT, process.argv[2] || DEFAULT_BUILD_LOG)
  if (!fs.existsSync(buildLogPath)) {
    fail(`Build log not found: ${path.relative(REPO_ROOT, buildLogPath)}`)
  }

  const log = fs.readFileSync(buildLogPath, 'utf8')
  const routeLineMatch = log.match(/^[├┌]\s+[○ƒ]\s+\/\s+([0-9.]+)\s+(kB|MB)\s+([0-9.]+)\s+(kB|MB)$/m)

  if (!routeLineMatch) {
    fail('Could not parse home route metrics from build log.')
  }

  const [, routeChunkRaw, routeChunkUnit, firstLoadRaw, firstLoadUnit] = routeLineMatch
  const routeChunkKb = toKilobytes(routeChunkRaw, routeChunkUnit)
  const firstLoadKb = toKilobytes(firstLoadRaw, firstLoadUnit)

  const violations = []
  if (routeChunkKb > ROUTE_CHUNK_BUDGET_KB) {
    violations.push(
      `Home route chunk budget exceeded: ${routeChunkKb.toFixed(2)}KB > ${ROUTE_CHUNK_BUDGET_KB}KB`,
    )
  }
  if (firstLoadKb > FIRST_LOAD_BUDGET_KB) {
    violations.push(
      `Home first-load budget exceeded: ${firstLoadKb.toFixed(2)}KB > ${FIRST_LOAD_BUDGET_KB}KB`,
    )
  }

  writeReport({
    generated_at: new Date().toISOString(),
    source_log: path.relative(REPO_ROOT, buildLogPath),
    budgets_kb: {
      route_chunk: ROUTE_CHUNK_BUDGET_KB,
      first_load: FIRST_LOAD_BUDGET_KB,
    },
    observed_kb: {
      route_chunk: Number(routeChunkKb.toFixed(2)),
      first_load: Number(firstLoadKb.toFixed(2)),
    },
    violations,
    note: 'Tighten HOME_ROUTE_*_BUDGET_KB over time toward target mobile budget.',
  })

  if (violations.length > 0) {
    fail(`${violations.join('\n')}\nReport: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
  }

  // eslint-disable-next-line no-console
  console.log(
    `[verify-home-route-budget] OK: route_chunk=${routeChunkKb.toFixed(2)}KB, first_load=${firstLoadKb.toFixed(2)}KB. ` +
    `Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`,
  )
}

main()
