<script setup lang="ts">
import type { ParsedContextFile } from '../../shared/types/context'
import { buildFileTree } from '../utils/file-tree'

const props = defineProps<{
  files: ParsedContextFile[]
  selectedPath: string | null
  repoPath: string
  issueCounts?: Record<string, number>
  summary?: { error: number, warning: number, info: number }
}>()

const emit = defineEmits<{
  select: [path: string]
}>()

const tree = computed(() => buildFileTree(props.files))

/** Directories start expanded. */
const openDirs = ref<Set<string>>(new Set())

watch(
  tree,
  (nodes) => {
    const next = new Set<string>()
    const walk = (list: typeof nodes) => {
      for (const node of list) {
        if (node.kind === 'dir') {
          next.add(node.path)
          if (node.children) walk(node.children)
        }
      }
    }
    walk(nodes)
    openDirs.value = next
  },
  { immediate: true },
)

function toggleDir(path: string) {
  const next = new Set(openDirs.value)
  if (next.has(path)) next.delete(path)
  else next.add(path)
  openDirs.value = next
}
</script>

<template>
  <aside class="sidebar">
    <header class="sidebar__header">
      <div class="sidebar__brand">
        <img
          src="/logo.svg"
          alt="Contexai"
          class="sidebar__logo"
          width="148"
          height="32"
        >
      </div>
      <p
        class="sidebar__repo"
        :title="repoPath"
      >
        {{ repoPath }}
      </p>
      <p class="sidebar__count">
        {{ files.length }} file{{ files.length === 1 ? '' : 's' }}
        <template v-if="summary">
          · {{ summary.error + summary.warning + summary.info }} lint
        </template>
      </p>
    </header>

    <nav
      v-if="files.length"
      class="sidebar__nav"
      aria-label="Context file tree"
    >
      <ContextTreeNode
        v-for="node in tree"
        :key="node.path"
        :node="node"
        :depth="0"
        :selected-path="selectedPath"
        :open-dirs="openDirs"
        :issue-counts="issueCounts"
        @select="emit('select', $event)"
        @toggle="toggleDir"
      />
    </nav>
    <p
      v-else
      class="sidebar__empty"
    >
      No context files found in this folder.
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
  display: flex;
  align-items: center;
}

.sidebar__logo {
  display: block;
  height: 32px;
  width: auto;
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
  gap: 0.05rem;
  padding: 0.6rem 0.45rem;
  overflow: auto;
}

.sidebar__empty {
  margin: 1rem;
  color: var(--cx-muted);
  font-size: 0.9rem;
}
</style>
