<script setup lang="ts">
import type { ContextFileType, ParsedContextFile } from '../../shared/types/context'

defineProps<{
  files: ParsedContextFile[]
  selectedPath: string | null
  repoPath: string
}>()

const emit = defineEmits<{
  select: [path: string]
}>()

const TYPE_LABELS: Record<ContextFileType, string> = {
  agents: 'AGENTS',
  claude: 'CLAUDE',
  'ide-rule': 'IDE rule',
  windsurf: 'Windsurf',
  skill: 'Skill',
}

function typeLabel(type: ContextFileType) {
  return TYPE_LABELS[type]
}
</script>

<template>
  <aside class="sidebar">
    <header class="sidebar__header">
      <p class="sidebar__brand">
        Contexa
      </p>
      <p
        class="sidebar__repo"
        :title="repoPath"
      >
        {{ repoPath }}
      </p>
      <p class="sidebar__count">
        {{ files.length }} file{{ files.length === 1 ? '' : 's' }}
      </p>
    </header>

    <nav
      v-if="files.length"
      class="sidebar__nav"
    >
      <button
        v-for="file in files"
        :key="file.path"
        type="button"
        class="file"
        :class="{ 'file--active': file.path === selectedPath }"
        @click="emit('select', file.path)"
      >
        <span class="file__type">{{ typeLabel(file.type) }}</span>
        <span class="file__path">{{ file.path }}</span>
      </button>
    </nav>
    <p
      v-else
      class="sidebar__empty"
    >
      No context files found in this repo.
    </p>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: color-mix(in srgb, var(--cx-surface) 92%, transparent);
  border-right: 1px solid var(--cx-border);
}

.sidebar__header {
  padding: 1.25rem 1.1rem 1rem;
  border-bottom: 1px solid var(--cx-border);
}

.sidebar__brand {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.sidebar__repo {
  margin: 0.4rem 0 0;
  font-family: var(--cx-mono);
  font-size: 0.7rem;
  color: var(--cx-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__count {
  margin: 0.55rem 0 0;
  font-size: 0.8rem;
  color: var(--cx-muted);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  overflow: auto;
}

.file {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  width: 100%;
  padding: 0.65rem 0.7rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  text-align: left;
  color: inherit;
}

.file:hover {
  background: var(--cx-bg);
}

.file--active {
  background: var(--cx-accent-soft);
  border-color: color-mix(in srgb, var(--cx-accent) 25%, var(--cx-border));
}

.file__type {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--cx-accent);
}

.file__path {
  font-family: var(--cx-mono);
  font-size: 0.78rem;
  word-break: break-all;
}

.sidebar__empty {
  margin: 1rem;
  color: var(--cx-muted);
  font-size: 0.9rem;
}
</style>
