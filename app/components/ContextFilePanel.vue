<script setup lang="ts">
import type { EditTagDefinition } from '../../shared/types/criteria'
import type { LintIssue } from '../../shared/types/lint'
import type { ContextFileType, ParsedContextFile } from '../../shared/types/context'

const props = defineProps<{
  file: ParsedContextFile | null
  issues?: LintIssue[]
  /** Called after a successful disk write; must reload context + lint before view mode. */
  reloadAfterSave?: () => Promise<void>
}>()

const TYPE_LABELS: Record<ContextFileType, string> = {
  agents: 'AGENTS.md',
  claude: 'CLAUDE.md',
  copilot: 'Copilot',
  'ide-rule': 'IDE rule',
  windsurf: 'Windsurf rules',
  skill: 'Skill',
}

const CATEGORY_ORDER = ['frontmatter', 'modality', 'xml'] as const
const CATEGORY_LABELS: Record<string, string> = {
  frontmatter: 'Frontmatter',
  modality: 'Modality (RFC 2119)',
  xml: 'XML blocks',
}

const mode = ref<'view' | 'edit'>('view')
const draft = ref('')
const saving = ref(false)
const saveError = ref<string | null>(null)
const saveOk = ref<string | null>(null)
/** Bumps after reload so sections/lint remount with fresh data. */
const viewEpoch = ref(0)

const { data: tagsPayload } = await useAsyncData('contexa-edit-tags', () =>
  $fetch<{ tags: EditTagDefinition[] }>('/api/edit/tags'),
)

const tags = computed(() => tagsPayload.value?.tags ?? [])

const tagsByCategory = computed(() => {
  const groups: { id: string, label: string, tags: EditTagDefinition[] }[] = []
  for (const id of CATEGORY_ORDER) {
    const list = tags.value.filter(t => t.category === id)
    if (list.length) {
      groups.push({ id, label: CATEGORY_LABELS[id] || id, tags: list })
    }
  }
  const known = new Set<string>(CATEGORY_ORDER)
  const rest = tags.value.filter(t => !known.has(t.category))
  if (rest.length) {
    const byCat = new Map<string, EditTagDefinition[]>()
    for (const tag of rest) {
      const list = byCat.get(tag.category) ?? []
      list.push(tag)
      byCat.set(tag.category, list)
    }
    for (const [id, list] of byCat) {
      groups.push({ id, label: CATEGORY_LABELS[id] || id, tags: list })
    }
  }
  return groups
})

watch(
  () => [props.file?.path, props.file?.content] as const,
  () => {
    if (mode.value === 'view') {
      draft.value = props.file?.content ?? ''
    }
  },
  { immediate: true },
)

watch(
  () => props.file?.path,
  () => {
    mode.value = 'view'
    draft.value = props.file?.content ?? ''
    saveError.value = null
    saveOk.value = null
  },
)

const dirty = computed(() =>
  mode.value === 'edit' && props.file != null && draft.value !== props.file.content,
)

const diffLines = computed(() => {
  if (!props.file) return []
  return buildUnifiedDiff(props.file.content, draft.value)
})

function startEdit() {
  draft.value = props.file?.content ?? ''
  mode.value = 'edit'
  saveError.value = null
  saveOk.value = null
}

function cancelEdit() {
  mode.value = 'view'
  draft.value = props.file?.content ?? ''
  saveError.value = null
  saveOk.value = null
}

/** Insert a frontmatter field into the YAML block (create the block if missing). */
function insertFrontmatterLine(line: string) {
  const trimmed = line.trim()
  if (trimmed === '---' || trimmed.startsWith('---\n')) {
    // Full block snippet
    if (/^---\r?\n[\s\S]*\r?\n---\s*$/.test(draft.value.trimStart()) || draft.value.startsWith('---\n')) {
      return
    }
    draft.value = `${trimmed.endsWith('\n') ? trimmed : `${trimmed}\n`}${draft.value.replace(/^\n+/, '')}`
    return
  }

  const fm = draft.value.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!fm) {
    draft.value = `---\n${trimmed}\n---\n\n${draft.value.replace(/^\n+/, '')}`
    return
  }

  const key = trimmed.split(':')[0]?.trim()
  const body = fm[1]
  const rest = fm[2]
  if (key && new RegExp(`^${key}\\s*:`, 'm').test(body)) {
    // Replace existing key line
    const nextBody = body
      .split('\n')
      .map(l => (l.match(new RegExp(`^${key}\\s*:`)) ? trimmed : l))
      .join('\n')
    draft.value = `---\n${nextBody}\n---\n${rest}`
    return
  }

  const nextBody = body.trimEnd() ? `${body.trimEnd()}\n${trimmed}` : trimmed
  draft.value = `---\n${nextBody}\n---\n${rest}`
}

function insertTag(tag: EditTagDefinition) {
  const snippet = tag.snippet.replace(/\n$/, '')

  if (tag.category === 'frontmatter') {
    insertFrontmatterLine(snippet)
    return
  }

  const text = snippet.endsWith('\n') ? snippet : `${snippet}\n`
  const el = document.getElementById('contexa-editor') as HTMLTextAreaElement | null
  if (!el) {
    draft.value += text
    return
  }
  const start = el.selectionStart
  const end = el.selectionEnd
  const before = draft.value.slice(0, start)
  const after = draft.value.slice(end)
  draft.value = before + text + after
  nextTick(() => {
    const pos = start + text.length
    el.focus()
    el.setSelectionRange(pos, pos)
  })
}

async function save() {
  if (!props.file) return
  saving.value = true
  saveError.value = null
  saveOk.value = null
  try {
    await $fetch('/api/write', {
      method: 'POST',
      body: {
        path: props.file.path,
        content: draft.value,
      },
    })
    // Reload context + lint BEFORE leaving edit mode so the view shows fresh data.
    if (props.reloadAfterSave) {
      await props.reloadAfterSave()
    }
    viewEpoch.value += 1
    mode.value = 'view'
    saveOk.value = 'Saved. Lint refreshed.'
  }
  catch (error: unknown) {
    const err = error as { data?: { statusMessage?: string }, message?: string }
    saveError.value = err?.data?.statusMessage || err?.message || 'Save failed'
  }
  finally {
    saving.value = false
  }
}

function buildUnifiedDiff(before: string, after: string): string[] {
  const a = before.split('\n')
  const b = after.split('\n')
  const lines: string[] = []
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    const left = a[i]
    const right = b[i]
    if (left === right) {
      if (left !== undefined) lines.push(`  ${left}`)
    }
    else {
      if (left !== undefined) lines.push(`- ${left}`)
      if (right !== undefined) lines.push(`+ ${right}`)
    }
  }
  return lines.slice(0, 400)
}
</script>

<template>
  <main class="panel">
    <template v-if="file">
      <header class="panel__header">
        <div class="panel__top">
          <div>
            <p class="panel__type">
              {{ TYPE_LABELS[file.type] }}
            </p>
            <h1 class="panel__path">
              {{ file.path }}
            </h1>
            <p class="panel__meta">
              {{ file.sections.length }} section{{ file.sections.length === 1 ? '' : 's' }}
              · {{ (issues ?? []).length }} lint
              · {{ mode === 'edit' ? 'edit' : 'view' }}
            </p>
          </div>
          <div class="panel__actions">
            <button
              v-if="mode === 'view'"
              type="button"
              class="btn btn--primary"
              @click="startEdit"
            >
              Edit
            </button>
            <template v-else>
              <button
                type="button"
                class="btn"
                :disabled="saving"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn--primary"
                :disabled="saving || !dirty"
                @click="save"
              >
                {{ saving ? 'Saving…' : 'Save' }}
              </button>
            </template>
          </div>
        </div>
      </header>

      <p
        v-if="saveOk && mode === 'view'"
        class="edit__ok"
      >
        {{ saveOk }}
      </p>

      <ContextFrontmatter
        v-if="mode === 'view'"
        :key="`fm-${file.path}-${viewEpoch}`"
        :data="file.frontmatter"
      />
      <ContextLintPanel
        :key="`lint-${file.path}-${viewEpoch}-${(issues ?? []).length}`"
        :issues="issues ?? []"
      />

      <template v-if="mode === 'view'">
        <ContextSections
          :key="`sec-${file.path}-${viewEpoch}`"
          :sections="file.sections"
        />
      </template>

      <template v-else>
        <section class="edit">
          <p class="edit__hint">
            Select a tag, then adapt the text. Frontmatter tags edit the YAML block at the top; modality tags follow RFC 2119; XML blocks are agent-prompt scaffolds.
          </p>

          <div
            v-for="group in tagsByCategory"
            :key="group.id"
            class="tag-group"
          >
            <h2 class="edit__title">
              {{ group.label }}
            </h2>
            <div class="tags">
              <button
                v-for="tag in group.tags"
                :key="tag.id"
                type="button"
                class="tag"
                :class="{ 'tag--fm': group.id === 'frontmatter' }"
                :title="tag.description"
                @click="insertTag(tag)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

          <textarea
            id="contexa-editor"
            v-model="draft"
            class="editor"
            spellcheck="false"
          />

          <p
            v-if="saveError"
            class="edit__error"
          >
            {{ saveError }}
          </p>

          <div
            v-if="dirty"
            class="diff"
          >
            <h3 class="diff__title">
              Diff preview
            </h3>
            <pre class="diff__body">{{ diffLines.join('\n') }}</pre>
          </div>
        </section>
      </template>
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

.panel__top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
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

.panel__actions {
  display: flex;
  gap: 0.45rem;
  flex-shrink: 0;
}

.btn {
  padding: 0.45rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--cx-border);
  background: var(--cx-surface);
  color: inherit;
}

.btn--primary {
  background: var(--cx-accent);
  border-color: var(--cx-accent);
  color: #fff;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.panel__empty {
  display: grid;
  place-items: center;
  min-height: 50vh;
  color: var(--cx-muted);
}

.edit {
  margin-top: 0.5rem;
}

.tag-group {
  margin-bottom: 0.85rem;
}

.edit__title {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cx-muted);
}

.edit__hint {
  margin: 0 0 0.85rem;
  font-size: 0.85rem;
  color: var(--cx-muted);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  padding: 0.3rem 0.55rem;
  border-radius: 6px;
  border: 1px solid var(--cx-border);
  background: var(--cx-accent-soft);
  color: var(--cx-accent);
  font-family: var(--cx-mono);
  font-size: 0.75rem;
}

.tag--fm {
  background: #f0eeea;
  color: #3d3a36;
}

.editor {
  width: 100%;
  min-height: 22rem;
  margin-top: 0.35rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--cx-border);
  border-radius: var(--cx-radius);
  background: var(--cx-surface);
  color: inherit;
  font-family: var(--cx-mono);
  font-size: 0.85rem;
  line-height: 1.45;
  resize: vertical;
}

.edit__error { color: #8a3b2c; font-size: 0.85rem; margin-top: 0.65rem; }
.edit__ok { color: var(--cx-accent); font-size: 0.85rem; margin: 0 0 0.85rem; }

.diff {
  margin-top: 1rem;
  border: 1px solid var(--cx-border);
  border-radius: var(--cx-radius);
  overflow: hidden;
}

.diff__title {
  margin: 0;
  padding: 0.55rem 0.75rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--cx-bg);
  color: var(--cx-muted);
}

.diff__body {
  margin: 0;
  padding: 0.75rem;
  max-height: 16rem;
  overflow: auto;
  font-family: var(--cx-mono);
  font-size: 0.75rem;
  white-space: pre-wrap;
  background: #1c1b19;
  color: #f2efe8;
}
</style>
