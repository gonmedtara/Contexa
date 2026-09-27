import type { LintRule } from '../../../../shared/types/lint'

const LONG_FILE_CHARS = 400

/** Long prompt files without headings are hard to navigate and lint. */
export const structureRule: LintRule = {
  id: 'heading-structure',
  description: 'Long context files should expose at least one markdown heading.',
  run({ files }) {
    const issues = []

    for (const file of files) {
      const hasHeading = file.sections.some(s => s.level >= 1)
      if (!hasHeading && file.bodyMarkdown.trim().length >= LONG_FILE_CHARS) {
        issues.push({
          ruleId: 'heading-structure',
          severity: 'warning' as const,
          message: 'File is long but has no markdown headings — add structure for agents and reviewers.',
          path: file.path,
        })
      }

      if (file.sections.length === 0 && file.bodyMarkdown.trim().length > 0) {
        issues.push({
          ruleId: 'heading-structure',
          severity: 'info' as const,
          message: 'No sections detected. Consider adding headings to structure instructions.',
          path: file.path,
        })
      }
    }

    return issues
  },
}
