import type { EditTagsFile } from '../../../shared/types/criteria'

/**
 * GET /api/edit/tags
 * Tag templates for edit mode (MUST/SHOULD, XML blocks, …).
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const override = typeof query.repo === 'string' ? query.repo : undefined
  const repoPath = resolveRepoPath(override)
  const { tags, sources } = await loadEditTags(repoPath)
  return {
    repoPath,
    sources,
    ...tags,
  } satisfies EditTagsFile & { repoPath: string, sources: string[] }
})
