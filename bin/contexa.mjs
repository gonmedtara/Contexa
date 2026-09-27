#!/usr/bin/env node
/**
 * Zero-config CLI entry for Contexa.
 *
 * Usage:
 *   npm run dev                         # scan process.cwd()
 *   npm run dev -- /path/to/repo        # scan the given repo
 *   node bin/contexa.mjs dev ./fixtures/sample-repo
 */
import { spawn } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

const argv = process.argv.slice(2)
const nuxtCommands = new Set(['dev', 'build', 'preview', 'start', 'generate'])

let command = 'dev'
if (argv[0] && nuxtCommands.has(argv[0])) {
  command = argv.shift()
}

const passthrough = []
let repoPath

for (const arg of argv) {
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
  repoPath = process.env.CONTEXA_REPO
    ? resolve(process.env.CONTEXA_REPO)
    : process.cwd()
}

process.env.CONTEXA_REPO = repoPath

console.info(`[contexa] repo: ${repoPath}`)

const child = spawn(
  'npx',
  ['nuxt', command, ...passthrough],
  {
    cwd: projectRoot,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  },
)

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
