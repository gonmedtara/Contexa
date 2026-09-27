<script setup lang="ts">
defineProps<{
  data: Record<string, unknown>
}>()

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    return value.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join(', ')
  }
  return JSON.stringify(value, null, 2)
}

function isMultiline(value: unknown): boolean {
  if (typeof value === 'object' && value !== null) return true
  return formatValue(value).includes('\n')
}
</script>

<template>
  <section
    v-if="Object.keys(data).length"
    class="fm"
  >
    <h2 class="fm__title">
      Frontmatter
    </h2>
    <dl class="fm__list">
      <div
        v-for="(value, key) in data"
        :key="key"
        class="fm__row"
      >
        <dt>{{ key }}</dt>
        <dd :class="{ 'fm__value--block': isMultiline(value) }">
          {{ formatValue(value) }}
        </dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.fm {
  margin-bottom: 1.5rem;
  padding: 1rem 1.1rem;
  background: var(--cx-accent-soft);
  border: 1px solid color-mix(in srgb, var(--cx-accent) 18%, var(--cx-border));
  border-radius: var(--cx-radius);
}

.fm__title {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cx-accent);
}

.fm__list {
  margin: 0;
  display: grid;
  gap: 0.65rem;
}

.fm__row {
  display: grid;
  grid-template-columns: minmax(7rem, 30%) 1fr;
  gap: 0.5rem 1rem;
  align-items: start;
}

.fm__row dt {
  margin: 0;
  font-family: var(--cx-mono);
  font-size: 0.8rem;
  color: var(--cx-muted);
  word-break: break-word;
}

.fm__row dd {
  margin: 0;
  font-size: 0.9rem;
  word-break: break-word;
}

.fm__value--block {
  font-family: var(--cx-mono);
  font-size: 0.8rem;
  white-space: pre-wrap;
}

@media (max-width: 640px) {
  .fm__row {
    grid-template-columns: 1fr;
    gap: 0.15rem;
  }
}
</style>
