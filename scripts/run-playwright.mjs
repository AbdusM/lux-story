import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const cliPath = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js')
const env = { ...process.env }

// Avoid Node startup noise when the parent shell exports both flags.
if (env.FORCE_COLOR && env.NO_COLOR) {
  delete env.NO_COLOR
  delete env.FORCE_COLOR
}

const child = spawn(process.execPath, [cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
