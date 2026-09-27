import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Resolve the target folder path.
 * Prefer runtime env (set by the CLI) over build-time runtimeConfig values.
 */
export function resolveRepoPath(explicit?: string): string {
  const config = useRuntimeConfig()
  const fromConfig = (config.contexa as { repoPath?: string } | undefined)?.repoPath

  const candidate =
    explicit?.trim()
    || process.env.CONTEXA_REPO?.trim()
    || process.env.NUXT_CONTEXA_REPO_PATH?.trim()
    || (fromConfig && fromConfig.length > 0 ? fromConfig : '')
    || process.cwd()

  const absolute = resolve(candidate)

  if (!existsSync(absolute) || !statSync(absolute).isDirectory()) {
    throw createError({
      statusCode: 400,
      statusMessage: `Contexa folder path is not a directory: ${absolute}`,
    })
  }

  return absolute
}
