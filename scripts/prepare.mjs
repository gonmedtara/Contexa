#!/usr/bin/env node
/**
 * Run `nuxt prepare` only when developing from source (nuxt.config present).
 * Skips silently for published installs that ship a prebuilt `.output`.
 */
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { platform } from 'node:os'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const hasNuxtConfig = ['nuxt.config.ts', 'nuxt.config.js', 'nuxt.config.mjs']
  .some(name => existsSync(resolve(root, name)))

if (!hasNuxtConfig) {
  process.exit(0)
}

const result = spawnSync('npx', ['nuxt', 'prepare'], {
  cwd: root,
  stdio: 'inherit',
  shell: platform() === 'win32',
})

process.exit(result.status ?? 0)
