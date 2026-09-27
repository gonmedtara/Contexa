<script setup lang="ts">
import type { LintIssue, LintSeverity } from '../../shared/types/lint'

defineProps<{
  issues: LintIssue[]
}>()

const SEVERITY_LABEL: Record<LintSeverity, string> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
}
</script>

<template>
  <section
    v-if="issues.length"
    class="lint"
  >
    <h2 class="lint__title">
      Lint
      <span class="lint__count">{{ issues.length }}</span>
    </h2>
    <ul class="lint__list">
      <li
        v-for="(issue, index) in issues"
        :key="`${issue.ruleId}-${issue.path}-${index}`"
        class="lint__item"
        :data-severity="issue.severity"
      >
        <span class="lint__sev">{{ SEVERITY_LABEL[issue.severity] }}</span>
        <div class="lint__body">
          <p class="lint__msg">
            {{ issue.message }}
          </p>
          <p class="lint__meta">
            <code>{{ issue.ruleId }}</code>
            <span v-if="issue.sectionTitle">· {{ issue.sectionTitle }}</span>
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.lint {
  margin-bottom: 1.5rem;
  padding: 1rem 1.1rem;
  background: var(--cx-surface);
  border: 1px solid var(--cx-border);
  border-radius: var(--cx-radius);
}

.lint__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cx-muted);
}

.lint__count {
  display: inline-grid;
  place-items: center;
  min-width: 1.4rem;
  padding: 0.05rem 0.35rem;
  border-radius: 999px;
  background: var(--cx-bg);
  font-family: var(--cx-mono);
  font-size: 0.7rem;
  letter-spacing: 0;
  text-transform: none;
}

.lint__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.lint__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.65rem;
  padding: 0.55rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--cx-border);
  background: var(--cx-bg);
}

.lint__sev {
  align-self: start;
  margin-top: 0.15rem;
  font-family: var(--cx-mono);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lint__item[data-severity="error"] .lint__sev { color: #8a3b2c; }
.lint__item[data-severity="warning"] .lint__sev { color: #8a6a1c; }
.lint__item[data-severity="info"] .lint__sev { color: var(--cx-accent); }

.lint__item[data-severity="error"] {
  border-color: color-mix(in srgb, #8a3b2c 28%, var(--cx-border));
  background: var(--cx-danger-soft);
}

.lint__msg {
  margin: 0;
  font-size: 0.9rem;
}

.lint__meta {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--cx-muted);
}

.lint__meta code {
  font-size: 0.72rem;
}
</style>
