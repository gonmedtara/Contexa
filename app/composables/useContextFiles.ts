import type { ParsedContextFile, ParseScanResult } from '../../shared/types/context'

export function useContextFiles() {
  const selectedPath = useState<string | null>('contexai-selected-path', () => null)

  const { data, pending, error, refresh } = useAsyncData(
    'contexai-context',
    () => $fetch<ParseScanResult>('/api/context', {
      query: { _: Date.now() },
    }),
    {
      // Always hit the server after save / explicit refresh.
      getCachedData: () => undefined,
    },
  )

  const files = computed<ParsedContextFile[]>(() => data.value?.files ?? [])
  const repoPath = computed(() => data.value?.repoPath ?? '')

  const effectiveSelectedPath = computed(() => {
    const current = selectedPath.value
    if (current && files.value.some(f => f.path === current)) {
      return current
    }
    return files.value[0]?.path ?? null
  })

  const selectedFile = computed(() =>
    files.value.find(f => f.path === effectiveSelectedPath.value) ?? null,
  )

  function selectFile(path: string) {
    selectedPath.value = path
  }

  return {
    data,
    files,
    repoPath,
    pending,
    error,
    refresh,
    selectedPath: effectiveSelectedPath,
    selectedFile,
    selectFile,
  }
}
