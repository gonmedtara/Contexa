import type { LintResult } from '../../../shared/types/lint'

/**
 * GET /api/lint
 * Run prompt-engineering lint rules on the configured (or ?repo=) path.
 * Read-only — never writes to disk.
 */
export default defineEventHandler(async (event): Promise<LintResult> => {
  const query = getQuery(event)
  const override = typeof query.repo === 'string' ? query.repo : undefined
  const repoPath = resolveRepoPath(override)
  return lintRepo(repoPath)
})
