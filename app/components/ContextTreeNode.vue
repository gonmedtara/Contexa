<script setup lang="ts">
import type { ContextFileType } from '../../shared/types/context'
import type { FileTreeNode } from '../utils/file-tree'

const props = defineProps<{
  node: FileTreeNode
  depth: number
  selectedPath: string | null
  openDirs: Set<string>
  issueCounts?: Record<string, number>
}>()

const emit = defineEmits<{
  select: [path: string]
  toggle: [path: string]
}>()

const TYPE_LABELS: Record<ContextFileType, string> = {
  agents: 'AGENTS',
  claude: 'CLAUDE',
  'ide-rule': 'IDE rule',
  windsurf: 'Windsurf',
  skill: 'Skill',
}

function countFor(path: string) {
  return props.issueCounts?.[path] ?? 0
}

function dirIssueCount(node: FileTreeNode): number {
  if (node.kind === 'file') return countFor(node.path)
  return (node.children ?? []).reduce((sum, child) => sum + dirIssueCount(child), 0)
}

const badge = computed(() =>
  props.node.kind === 'file'
    ? countFor(props.node.path)
    : dirIssueCount(props.node),
)

const isDirOpen = computed(() =>
  props.node.kind === 'dir' && props.openDirs.has(props.node.path),
)

const pad = computed(() => `${0.35 + props.depth * 0.7}rem`)
</script>

<template>
  <div class="tree-node">
    <button
      v-if="node.kind === 'dir'"
      type="button"
      class="row row--dir"
      :style="{ paddingLeft: pad }"
      @click="emit('toggle', node.path)"
    >
      <span
        class="chevron"
        :class="{ 'chevron--open': isDirOpen }"
      />
      <span class="name">{{ node.name }}/</span>
      <span
        v-if="badge"
        class="badge"
      >{{ badge }}</span>
    </button>

    <button
      v-else
      type="button"
      class="row row--file"
      :class="{ 'row--active': node.path === selectedPath }"
      :style="{ paddingLeft: pad }"
      @click="emit('select', node.path)"
    >
      <span class="type">{{ node.fileType ? TYPE_LABELS[node.fileType] : '' }}</span>
      <span class="name">{{ node.name }}</span>
      <span
        v-if="badge"
        class="badge"
      >{{ badge }}</span>
    </button>

    <div
      v-if="node.kind === 'dir' && isDirOpen && node.children?.length"
      class="children"
    >
      <ContextTreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 1"
        :selected-path="selectedPath"
        :open-dirs="openDirs"
        :issue-counts="issueCounts"
        @select="emit('select', $event)"
        @toggle="emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.35rem 0.5rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  text-align: left;
  color: inherit;
}

.row:hover {
  background: var(--cx-bg);
}

.row--active {
  background: var(--cx-accent-soft);
  border-color: color-mix(in srgb, var(--cx-accent) 25%, var(--cx-border));
}

.chevron {
  flex-shrink: 0;
  width: 0.4rem;
  height: 0.4rem;
  border-right: 1.5px solid var(--cx-muted);
  border-bottom: 1.5px solid var(--cx-muted);
  transform: rotate(-45deg);
  transition: transform 0.12s ease;
}

.chevron--open {
  transform: rotate(45deg);
  margin-top: -0.1rem;
}

.type {
  flex-shrink: 0;
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--cx-accent);
}

.name {
  flex: 1;
  min-width: 0;
  font-family: var(--cx-mono);
  font-size: 0.78rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row--dir .name {
  color: var(--cx-muted);
  font-weight: 500;
}

.badge {
  flex-shrink: 0;
  min-width: 1.15rem;
  padding: 0.05rem 0.3rem;
  border-radius: 999px;
  background: color-mix(in srgb, #8a6a1c 18%, var(--cx-bg));
  color: #6a5214;
  font-family: var(--cx-mono);
  font-size: 0.65rem;
  text-align: center;
}
</style>
