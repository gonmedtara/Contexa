#!/usr/bin/env node
/**
 * Contexai CLI — installable npm bin.
 *
 * Usage (in any folder / host repo):
 *   npx contexai                 # scan cwd, serve UI, open browser
 *   npx contexai ./path          # scan given folder
 *   npx contexai start ./path    # same (explicit)
 *   npx contexai dev ./path      # Nuxt dev (package source only)
 *
 * Flags:
 *   --port <n>     HTTP port (default 3927)
 *   --host <h>     bind host (default 127.0.0.1)
 *   --no-open      do not open the browser
 */
import { spawn } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import net from 'node:net'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { platform } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(__dirname, '..')

const argv = process.argv.slice(2)
const commands = new Set(['dev', 'build', 'preview', 'start', 'generate'])

let command = 'start'
if (argv[0] && commands.has(argv[0])) {
  command = argv.shift()
}

let repoPath
let host = process.env.HOST || '127.0.0.1'
let port = Number(process.env.PORT || process.env.NITRO_PORT || 3927)
let openBrowser = true
const passthrough = []

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i]
  if (arg === '--no-open') {
    openBrowser = false
    continue
  }
  if (arg === '--port') {
    port = Number(argv[++i])
    continue
  }
  if (arg.startsWith('--port=')) {
    port = Number(arg.slice('--port='.length))
    continue
  }
  if (arg === '--host') {
    host = argv[++i]
    continue
  }
  if (arg.startsWith('--host=')) {
    host = arg.slice('--host='.length)
    continue
  }
  if (!repoPath && !arg.startsWith('-')) {
    const absolute = resolve(process.cwd(), arg)
    if (existsSync(absolute) && statSync(absolute).isDirectory()) {
      repoPath = absolute
      continue
    }
  }
  passthrough.push(arg)
}

if (!repoPath) {
  repoPath = process.env.CONTEXAI_REPO
    ? resolve(process.env.CONTEXAI_REPO)
    : process.cwd()
}

process.env.CONTEXAI_REPO = repoPath
process.env.NUXT_CONTEXAI_REPO_PATH = repoPath
process.env.CONTEXAI_PACKAGE_ROOT = packageRoot
process.env.HOST = host
process.env.PORT = String(port)
process.env.NITRO_PORT = String(port)
process.env.NITRO_HOST = host

console.info(`[contexai] folder: ${repoPath}`)

function openUrl(url) {
  const name = platform()
  let cmd
  let args
  if (name === 'darwin') {
    cmd = 'open'
    args = [url]
  }
  else if (name === 'win32') {
    cmd = 'cmd'
    args = ['/c', 'start', '', url]
  }
  else {
    cmd = 'xdg-open'
    args = [url]
  }
  spawn(cmd, args, { stdio: 'ignore', detached: true }).unref()
}

function waitForPort(targetHost, targetPort, timeoutMs = 90000) {
  const started = Date.now()
  return new Promise((resolveWait, reject) => {
    const attempt = () => {
      const socket = net.connect({ host: targetHost, port: targetPort }, () => {
        socket.end()
        resolveWait()
      })
      socket.on('error', () => {
        socket.destroy()
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for ${targetHost}:${targetPort}`))
        }
        else {
          setTimeout(attempt, 250)
        }
      })
    }
    attempt()
  })
}

function runDevOrBuildLike() {
  const child = spawn(
    'npx',
    ['nuxt', command, ...passthrough],
    {
      cwd: packageRoot,
      stdio: 'inherit',
      env: process.env,
      shell: platform() === 'win32',
    },
  )
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal)
    else process.exit(code ?? 0)
  })
}

async function runStart() {
  const serverEntry = join(packageRoot, '.output', 'server', 'index.mjs')
  if (!existsSync(serverEntry)) {
    console.error('[contexai] Production build missing (.output). Run `npm run build` in the contexai package, or use `npx contexai dev`.')
    process.exit(1)
  }

  const browseHost = host === '0.0.0.0' ? '127.0.0.1' : host
  const url = `http://${browseHost}:${port}/`
  console.info(`[contexai] starting ${url}`)

  const child = spawn(process.execPath, [serverEntry, ...passthrough], {
    cwd: packageRoot,
    stdio: 'inherit',
    env: process.env,
  })

  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal)
    else process.exit(code ?? 0)
  })

  if (openBrowser) {
    try {
      await waitForPort(browseHost, port)
      openUrl(url)
      console.info(`[contexai] opened ${url}`)
    }
    catch (error) {
      console.warn(`[contexai] could not open browser: ${error.message}`)
    }
  }
}

if (command === 'start') {
  runStart()
}
else {
  runDevOrBuildLike()
}
