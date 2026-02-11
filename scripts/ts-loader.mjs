/**
 * Minimal TS/TSX ESM loader for running repo scripts in Node without `tsx`.
 *
 * Why this exists:
 * - CI runs multiple TypeScript scripts via `node ... scripts/*.ts`.
 * - We don't want a hidden dependency on a globally-installed `tsx`.
 *
 * Supports:
 * - Extensionless TS imports (e.g. `../lib/graph-registry`)
 * - Repo alias imports (e.g. `@/lib/foo`)
 *
 * Note: This is for scripts/runtime tooling only, not the Next.js app bundle.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as ts from 'typescript'

const repoRoot = process.cwd()

function isFile(p) {
  try {
    return fs.statSync(p).isFile()
  } catch {
    return false
  }
}

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory()
  } catch {
    return false
  }
}

function resolveWithExtensions(basePath) {
  if (isFile(basePath)) return basePath

  const exts = ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json']
  for (const ext of exts) {
    const p = basePath + ext
    if (isFile(p)) return p
  }

  if (isDir(basePath)) {
    for (const ext of exts) {
      const p = path.join(basePath, 'index' + ext)
      if (isFile(p)) return p
    }
  }

  return null
}

function tryResolveAlias(specifier) {
  if (!specifier.startsWith('@/')) return null
  const target = path.join(repoRoot, specifier.slice(2))
  return resolveWithExtensions(target)
}

function tryResolveRelative(specifier, parentURL) {
  if (!specifier.startsWith('.') && !specifier.startsWith('/')) return null

  const parentPath = parentURL ? fileURLToPath(parentURL) : path.join(repoRoot, 'scripts', 'noop.mjs')
  const baseDir = path.dirname(parentPath)
  const target = specifier.startsWith('/')
    ? path.join(repoRoot, specifier)
    : path.resolve(baseDir, specifier)
  return resolveWithExtensions(target)
}

export async function resolve(specifier, context, nextResolve) {
  // Let Node handle builtins and URLs.
  if (
    specifier.startsWith('node:') ||
    specifier.startsWith('data:') ||
    specifier.startsWith('http:') ||
    specifier.startsWith('https:')
  ) {
    return nextResolve(specifier, context)
  }

  const alias = tryResolveAlias(specifier)
  if (alias) return { url: pathToFileURL(alias).href, shortCircuit: true }

  const rel = tryResolveRelative(specifier, context.parentURL)
  if (rel) return { url: pathToFileURL(rel).href, shortCircuit: true }

  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && (url.endsWith('.ts') || url.endsWith('.tsx'))) {
    const filename = fileURLToPath(url)
    const sourceText = fs.readFileSync(filename, 'utf8')

    const transpiled = ts.transpileModule(sourceText, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        sourceMap: false,
        inlineSourceMap: false,
      },
    })

    return {
      format: 'module',
      source: transpiled.outputText,
      shortCircuit: true,
    }
  }

  return nextLoad(url, context)
}
