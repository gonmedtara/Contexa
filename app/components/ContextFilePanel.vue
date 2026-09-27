<script setup lang="ts">
import type { EditTagDefinition } from '../../shared/types/criteria'
import type { LintIssue } from '../../shared/types/lint'
import type { ContextFileType, ParsedContextFile } from '../../shared/types/context'

const props = defineProps<{
  file: ParsedContextFile | null
  issues?: LintIssue[]
}>()

const emit = defineEmits<{
  saved: []
}>()

const TYPE_LABELS: Record<ContextFileType, string> = {
  agents: 'AGENTS.md',
  claude: 'CLAUDE.md',
  copilot: 'Copilot',
  'ide-rule': 'IDE rule',
  windsurf: 'Windsurf rules',
  skill: 'Skill',
}

const mode = ref<'view' | 'edit'>('view')
const draft = ref('')
const saving = ref(false)
const saveError = ref<string | null>(null)
const saveOk = ref<string | null>(null)
const commitAfterWrite = ref(false)
const commitMessage = ref('')

const { data: tagsPayload } = await useAsyncData('contexa-edit-tags', () =>
  $fetch<{ tags: EditTagDefinition[], sources?: string[] }>('/api/edit/tags'),
)

const tags = computed(() => tagsPayload.value?.tags ?? [])

watch(
  () => props.file?.path,
  () => {
    mode.value = 'view'
    draft.value = props.file?.content ?? ''
    saveError.value = null
    saveOk.value = null
  },
  { immediate: true },
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

function insertTag(tag: EditTagDefinition) {
  const snippet = tag.snippet.endsWith('\n') ? tag.snippet : `${tag.snippet}\n`
  const el = document.getElementById('contexa-editor') as HTMLTextAreaElement | null
  if (!el) {
    draft.value += snippet
    return
  }
  const start = el.selectionStart
  const end = el.selectionEnd
  const before = draft.value.slice(0, start)
  const after = draft.value.slice(end)
  draft.value = before + snippet + after
  nextTick(() => {
    const pos = start + snippet.length
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
    const result = await $fetch<{ ok: boolean, git?: { staged?: boolean, committed?: boolean } }>('/api/write', {
      method: 'POST',
      body: {
        path: props.file.path,
        content: draft.value,
        commit: commitAfterWrite.value,
        message: commitMessage.value || undefined,
      },
    })
    saveOk.value = result.git?.committed
      ? 'Saved and committed.'
      : result.git?.staged
        ? 'Saved and staged in git.'
        : 'Saved to disk.'
    mode.value = 'view'
    emit('saved')
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

      <ContextFrontmatter
        v-if="mode === 'view'"
        :data="file.frontmatter"
      />
      <ContextLintPanel :issues="issues ?? []" />

      <template v-if="mode === 'view'">
        <ContextSections
          :key="file.path"
          :sections="file.sections"
        />
      </template>

      <template v-else>
        <section class="edit">
          <h2 class="edit__title">
            Tags
          </h2>
          <p class="edit__hint">
            Select a tag, then adapt the inserted text. Modality tags follow RFC 2119; XML blocks are common agent-prompt scaffolds.
          </p>
          <div class="tags">
            <button
              v-for="tag in tags"
              :key="tag.id"
              type="button"
              class="tag"
              :title="tag.description"
              @click="insertTag(tag)"
            >
              {{ tag.label }}
            </button>
          </div>

          <textarea
            id="contexa-editor"
            v-model="draft"
            class="editor"
            spellcheck="false"
          />

          <label class="commit">
            <input
              v-model="commitAfterWrite"
              type="checkbox"
            >
            Also create a git commit
          </label>
          <p
            v-if="commitAfterWrite"
            class="edit__hint"
          >
            Requires a git repo in the scanned folder and configured
            <code>user.name</code> / <code>user.email</code>.
          </p>
          <input
            v-if="commitAfterWrite"
            v-model="commitMessage"
            type="text"
            class="commit__msg"
            placeholder="Commit message"
          >

          <p
            v-if="saveError"
            class="edit__error"
          >
            {{ saveError }}
          </p>
          <p
            v-if="saveOk"
            class="edit__ok"
          >
            {{ saveOk }}
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

.edit__title {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cx-muted);
}

.edit__hint {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  color: var(--cx-muted);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
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

.editor {
  width: 100%;
  min-height: 22rem;
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

.commit {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0.75rem 0 0.4rem;
  font-size: 0.85rem;
}

.commit__msg {
  width: 100%;
  max-width: 32rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--cx-border);
  border-radius: 6px;
  font: inherit;
  margin-bottom: 0.5rem;
}

.edit__error { color: #8a3b2c; font-size: 0.85rem; }
.edit__ok { color: var(--cx-accent); font-size: 0.85rem; }

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
