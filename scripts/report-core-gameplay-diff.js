#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync } from 'child_process'

const args = new Map()
for (let i = 2; i < process.argv.length; i += 1) {
  const raw = process.argv[i]
  if (!raw.startsWith('--')) continue
  const [key, value] = raw.replace(/^--/, '').split('=')
  args.set(key, value ?? true)
}

const since = args.get('since') || process.env.CORE_GAMEPLAY_SINCE || 'HEAD~1'
const strict = Boolean(args.get('strict') || process.env.CORE_GAMEPLAY_STRICT)

let diffOutput = ''
try {
  diffOutput = execSync(`git diff --name-only ${since}`, { encoding: 'utf8' }).trim()
} catch (error) {
  console.error(`Failed to read git diff for "${since}".`)
  process.exit(1)
}

const files = diffOutput ? diffOutput.split('\n').filter(Boolean) : []
const coreMatchers = [
  /^lib\//,
  /^hooks\/game\//,
  /^components\/StatefulGameInterface\.tsx$/,
  /^components\/Journal\.tsx$/,
  /^components\/game\/EndingPanel\.tsx$/,
  /^components\/career\/StrategyReport\.tsx$/,
  /^app\/api\/user\//,
  /^supabase\/migrations\//,
  /^content\/.*-dialogue-graph\.ts$/
]

const coreChanges = files.filter((file) => coreMatchers.some((re) => re.test(file)))
const docPath = 'docs/reference/data-dictionary/CORE_GAMEPLAY_DATA_DICTIONARY.md'
const docTouched = files.includes(docPath)

if (coreChanges.length === 0) {
  console.log(`No core gameplay files changed since ${since}.`)
  process.exit(0)
}

console.log(`Core gameplay files changed since ${since}:`)
coreChanges.forEach((file) => console.log(`- ${file}`))

if (!docTouched) {
  console.log(`\nNote: ${docPath} was not updated.`)
  if (strict) {
    process.exit(1)
  }
}
