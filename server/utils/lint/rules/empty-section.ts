import type { LintIssue, LintRuleContext } from '../../../../shared/types/lint'
import { ruleDef } from '../../criteria'

export function runEmptySectionRule(ctx: LintRuleContext): LintIssue[] {
  const def = ruleDef(ctx.criteria, 'empty-section')
  if (!def) return []

  const severity = def.severity ?? 'warning'
  const issues: LintIssue[] = []

  for (const file of ctx.files) {
    for (const section of file.sections) {
      if (section.body.children.length === 0) {
        issues.push({
          ruleId: def.id,
          severity,
          message: `Section « ${section.title} » is empty.`,
          path: file.path,
          sectionId: section.id,
          sectionTitle: section.title,
        })
      }
    }
  }

  return issues
}
