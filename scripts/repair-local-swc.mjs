import { createRequire } from 'node:module'
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile, access, cp } from 'node:fs/promises'
import { constants as fsConstants } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import https from 'node:https'
import { execFileSync } from 'node:child_process'

const require = createRequire(import.meta.url)

async function pathExists(targetPath) {
  try {
    await access(targetPath, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

async function getInstalledSwcPackage() {
  const nextPackagePath = require.resolve('next/package.json')
  const nextRoot = path.dirname(nextPackagePath)
  const nextVersion = JSON.parse(await readFile(nextPackagePath, 'utf8')).version
  const nextScopeDir = path.resolve(nextRoot, '..', '@next')
  const packageNames = await readdir(nextScopeDir)

  for (const packageName of packageNames) {
    if (!packageName.startsWith('swc-')) {
      continue
    }

    const packageRoot = path.join(nextScopeDir, packageName)
    const packageJsonPath = path.join(packageRoot, 'package.json')

    if (!(await pathExists(packageJsonPath))) {
      continue
    }

    const metadata = JSON.parse(await readFile(packageJsonPath, 'utf8'))
    const osMatches = Array.isArray(metadata.os) && metadata.os.includes(process.platform)
    const cpuMatches = Array.isArray(metadata.cpu) && metadata.cpu.includes(process.arch)

    if (!osMatches || !cpuMatches) {
      continue
    }

    return {
      mainFile: metadata.main,
      packageName: metadata.name,
      packageRoot,
      version: metadata.version || nextVersion,
    }
  }

  throw new Error(`No installed @next/swc package matches ${process.platform}/${process.arch}`)
}

function loadNativeModule(nativeModulePath) {
  delete require.cache[nativeModulePath]
  require(nativeModulePath)
}

function downloadToFile(url, destinationPath) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        response.resume()
        downloadToFile(response.headers.location, destinationPath).then(resolve, reject)
        return
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`))
        response.resume()
        return
      }

      const chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', async () => {
        try {
          await writeFile(destinationPath, Buffer.concat(chunks))
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    })

    request.on('error', reject)
  })
}

async function repairPackage({ packageName, packageRoot, version }) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), 'lux-story-swc-'))
  const tarballPath = path.join(tempRoot, 'package.tgz')
  const extractedRoot = path.join(tempRoot, 'extracted')
  const tarballBaseName = packageName.split('/')[1]
  const tarballUrl = `https://registry.npmjs.org/${packageName}/-/${tarballBaseName}-${version}.tgz`

  try {
    await downloadToFile(tarballUrl, tarballPath)
    await rm(extractedRoot, { force: true, recursive: true })
    await mkdir(extractedRoot, { recursive: true })
    execFileSync('tar', ['-xzf', tarballPath, '-C', extractedRoot], { stdio: 'inherit' })
    await cp(path.join(extractedRoot, 'package'), packageRoot, {
      force: true,
      recursive: true,
    })
  } finally {
    await rm(tempRoot, { force: true, recursive: true })
  }
}

async function main() {
  const swcPackage = await getInstalledSwcPackage()
  const nativeModulePath = path.join(swcPackage.packageRoot, swcPackage.mainFile)

  try {
    loadNativeModule(nativeModulePath)
    console.log(`SWC native module is healthy: ${swcPackage.packageName}@${swcPackage.version}`)
    return
  } catch (error) {
    console.warn(`SWC native module failed to load: ${error instanceof Error ? error.message : String(error)}`)
    console.warn(`Repairing ${swcPackage.packageName}@${swcPackage.version} from npm registry...`)
  }

  await repairPackage(swcPackage)
  loadNativeModule(nativeModulePath)
  console.log(`SWC native module repaired successfully: ${swcPackage.packageName}@${swcPackage.version}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
