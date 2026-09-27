import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Resolve the target repo path from runtime config / env.
 * CLI (`bin/contexa.mjs`) sets CONTEXA_REPO before Nuxt starts.
 */
export function resolveRepoPath(explicit?: string): string {
  const candidate =
    explicit?.trim() ||
    (useRuntimeConfig().contexa as { repoPath?: string } | undefined)?.repoPath ||
    process.env.CONTEXA_REPO ||
    process.cwd()

  const absolute = resolve(candidate)

  if (!existsSync(absolute) || !statSync(absolute).isDirectory()) {
    throw createError({
      statusCode: 400,
      statusMessage: `Contexa repo path is not a directory: ${absolute}`,
    })
  }

  return absolute
}
