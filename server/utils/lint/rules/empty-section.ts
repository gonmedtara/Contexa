import type { LintRule } from '../../../../shared/types/lint'

/** Flag accordion sections that have no body content. */
export const emptySectionRule: LintRule = {
  id: 'empty-section',
  description: 'Sections with a heading but no body are usually incomplete prompts.',
  run({ files }) {
    const issues = []

    for (const file of files) {
      for (const section of file.sections) {
        if (section.body.children.length === 0) {
          issues.push({
            ruleId: 'empty-section',
            severity: 'warning' as const,
            message: `Section « ${section.title} » is empty.`,
            path: file.path,
            sectionId: section.id,
            sectionTitle: section.title,
          })
        }
      }
    }

    return issues
  },
}
