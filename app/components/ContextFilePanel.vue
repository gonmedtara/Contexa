<script setup lang="ts">
import type { ContextFileType, ParsedContextFile } from '../../shared/types/context'

defineProps<{
  file: ParsedContextFile | null
}>()

const TYPE_LABELS: Record<ContextFileType, string> = {
  agents: 'AGENTS.md',
  claude: 'CLAUDE.md',
  'ide-rule': 'IDE rule',
  windsurf: 'Windsurf rules',
  skill: 'Skill',
}
</script>

<template>
  <main class="panel">
    <template v-if="file">
      <header class="panel__header">
        <p class="panel__type">
          {{ TYPE_LABELS[file.type] }}
        </p>
        <h1 class="panel__path">
          {{ file.path }}
        </h1>
        <p class="panel__meta">
          {{ file.sections.length }} section{{ file.sections.length === 1 ? '' : 's' }}
          · read-only
        </p>
      </header>

      <ContextFrontmatter :data="file.frontmatter" />
      <ContextSections
        :key="file.path"
        :sections="file.sections"
      />
    </template>

    <div
      v-else
      class="panel__empty"
    >
      <p>Select a context file to inspect its sections.</p>
    </div>
  </main>
</template>

<style scoped>
.panel {
  min-width: 0;
  padding: 1.5rem 1.75rem 2.5rem;
  overflow: auto;
}

.panel__header {
  margin-bottom: 1.25rem;
}

.panel__type {
  margin: 0 0 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cx-accent);
}

.panel__path {
  margin: 0;
  font-family: var(--cx-mono);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  word-break: break-all;
}

.panel__meta {
  margin: 0.4rem 0 0;
  font-size: 0.85rem;
  color: var(--cx-muted);
}

.panel__empty {
  display: grid;
  place-items: center;
  min-height: 50vh;
  color: var(--cx-muted);
}
</style>
