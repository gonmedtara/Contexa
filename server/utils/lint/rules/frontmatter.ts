import type { LintRule } from '../../../../shared/types/lint'

const REQUIRES_DESCRIPTION = new Set(['ide-rule', 'skill'])

/** IDE rules and skills should declare a description in frontmatter. */
export const frontmatterRule: LintRule = {
  id: 'frontmatter-description',
  description: 'Certain context file types should expose a description in YAML frontmatter.',
  run({ files }) {
    const issues = []

    for (const file of files) {
      if (!REQUIRES_DESCRIPTION.has(file.type)) continue

      const description = file.frontmatter.description
      if (typeof description !== 'string' || !description.trim()) {
        issues.push({
          ruleId: 'frontmatter-description',
          severity: 'error' as const,
          message: `Missing frontmatter « description » for ${file.type} file.`,
          path: file.path,
        })
      }
    }

    return issues
  },
}
