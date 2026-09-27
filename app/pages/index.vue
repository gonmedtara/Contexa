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
} = useContextFiles()
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
        @select="selectFile"
      />
      <ContextFilePanel :file="selectedFile" />
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

@media (max-width: 800px) {
  .shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
}
</style>
