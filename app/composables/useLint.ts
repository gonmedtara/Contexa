import type { LintIssue, LintResult } from '../../shared/types/lint'

export function useLint() {
  const { data, pending, error, refresh } = useAsyncData(
    'contexai-lint',
    () => $fetch<LintResult>('/api/lint', {
      query: { _: Date.now() },
    }),
    {
      getCachedData: () => undefined,
    },
  )

  const issues = computed<LintIssue[]>(() => data.value?.issues ?? [])
  const summary = computed(() => data.value?.summary ?? { error: 0, warning: 0, info: 0 })

  const issuesByPath = computed(() => {
    const map = new Map<string, LintIssue[]>()
    for (const issue of issues.value) {
      const list = map.get(issue.path) ?? []
      list.push(issue)
      map.set(issue.path, list)
    }
    return map
  })

  function issuesFor(path: string | null | undefined): LintIssue[] {
    if (!path) return []
    return issuesByPath.value.get(path) ?? []
  }

  return {
    data,
    issues,
    summary,
    issuesByPath,
    issuesFor,
    pending,
    error,
    refresh,
  }
}
