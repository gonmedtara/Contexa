<script setup lang="ts">
import type { ContextSection } from '../../shared/types/context'

const props = defineProps<{
  sections: ContextSection[]
}>()

/** First section open by default; user toggles via native <details>. */
const initiallyOpen = computed(() => props.sections[0]?.id ?? null)
</script>

<template>
  <div
    v-if="sections.length"
    class="sections"
  >
    <details
      v-for="section in sections"
      :key="`${section.id}-${section.id === initiallyOpen}`"
      class="section"
      :open="section.id === initiallyOpen"
    >
      <summary class="section__summary">
        <span class="section__level">H{{ section.level || '·' }}</span>
        <span class="section__title">{{ section.title }}</span>
      </summary>
      <div class="section__body cx-prose">
        <!-- MDC re-parses raw markdown so fenced ``` blocks render as real <pre><code> -->
        <MDC
          v-if="section.markdown.trim()"
          :value="section.markdown"
          tag="div"
        />
        <p
          v-else
          class="section__empty"
        >
          (empty section)
        </p>
      </div>
    </details>
  </div>
  <p
    v-else
    class="sections__empty"
  >
    No sections found in this file.
  </p>
</template>

<style scoped>
.sections {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section {
  background: var(--cx-surface);
  border: 1px solid var(--cx-border);
  border-radius: var(--cx-radius);
  overflow: hidden;
}

.section__summary {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  list-style: none;
  cursor: pointer;
  user-select: none;
  background: color-mix(in srgb, var(--cx-surface) 88%, var(--cx-bg));
}

.section__summary::-webkit-details-marker {
  display: none;
}

.section__summary::after {
  content: "";
  margin-left: auto;
  width: 0.45rem;
  height: 0.45rem;
  border-right: 1.5px solid var(--cx-muted);
  border-bottom: 1.5px solid var(--cx-muted);
  transform: rotate(45deg);
  transition: transform 0.15s ease;
}

.section[open] .section__summary::after {
  transform: rotate(-135deg);
  margin-top: 0.2rem;
}

.section__level {
  flex-shrink: 0;
  min-width: 1.6rem;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: var(--cx-bg);
  color: var(--cx-muted);
  font-family: var(--cx-mono);
  font-size: 0.7rem;
  text-align: center;
}

.section__title {
  font-weight: 600;
  font-size: 0.95rem;
}

.section__body {
  padding: 1rem 1.1rem 1.15rem;
  border-top: 1px solid var(--cx-border);
}

.section__empty,
.sections__empty {
  margin: 0;
  color: var(--cx-muted);
  font-size: 0.9rem;
}
</style>
