import type { ParseScanResult } from '../../../shared/types/context'

/**
 * GET /api/context
 * Scan + parse the configured repo. Optional ?repo= overrides the CLI path
 * for ad-hoc inspection without restarting (still read-only).
 */
export default defineEventHandler(async (event): Promise<ParseScanResult> => {
  const query = getQuery(event)
  const override = typeof query.repo === 'string' ? query.repo : undefined
  const repoPath = resolveRepoPath(override)

  const scan = await scanRepo(repoPath)
  return parseScanResult(scan)
})
