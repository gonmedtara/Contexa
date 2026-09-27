<script setup lang="ts">
useHead({
  title: 'Contexa',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;600;700&display=swap',
    },
  ],
})

const {
  files,
  repoPath,
  pending,
  error,
  selectedPath,
  selectedFile,
  selectFile,
  refresh,
} = useContextFiles()

const {
  summary,
  issuesByPath,
  issuesFor,
  pending: lintPending,
  error: lintError,
  refresh: refreshLint,
} = useLint()

const issueCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const [path, list] of issuesByPath.value) {
    counts[path] = list.length
  }
  return counts
})

const selectedIssues = computed(() => issuesFor(selectedPath.value))

async function onSaved() {
  await Promise.all([refresh(), refreshLint()])
}
</script>

<template>
  <div class="shell">
    <div
      v-if="pending"
      class="shell__status"
    >
      Scanning context files…
    </div>

    <div
      v-else-if="error"
      class="shell__status shell__status--error"
    >
      Failed to load context files: {{ error.message }}
    </div>

    <template v-else>
      <ContextFileList
        :files="files"
        :selected-path="selectedPath"
        :repo-path="repoPath"
        :issue-counts="issueCounts"
        :summary="summary"
        @select="selectFile"
      />
      <ContextFilePanel
        :file="selectedFile"
        :issues="selectedIssues"
        @saved="onSaved"
      />
      <p
        v-if="lintError"
        class="shell__lint-error"
      >
        Lint unavailable: {{ lintError.message }}
      </p>
      <p
        v-else-if="lintPending"
        class="shell__lint-pending"
      >
        Running lint…
      </p>
    </template>
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: var(--cx-sidebar) 1fr;
  min-height: 100vh;
}

.shell__status {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  min-height: 100vh;
  color: var(--cx-muted);
}

.shell__status--error {
  color: #8a3b2c;
  background: var(--cx-danger-soft);
  padding: 2rem;
  text-align: center;
}

.shell__lint-error,
.shell__lint-pending {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  margin: 0;
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  font-size: 0.8rem;
  background: var(--cx-surface);
  border: 1px solid var(--cx-border);
  color: var(--cx-muted);
  box-shadow: 0 4px 16px rgb(0 0 0 / 6%);
}

.shell__lint-error {
  color: #8a3b2c;
  border-color: color-mix(in srgb, #8a3b2c 30%, var(--cx-border));
}

@media (max-width: 800px) {
  .shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
}
</style>
