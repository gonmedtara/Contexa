import type { LintIssue, LintRuleContext } from '../../../../shared/types/lint'
import { ruleDef } from '../../criteria'

export function runStructureRule(ctx: LintRuleContext): LintIssue[] {
  const def = ruleDef(ctx.criteria, 'heading-structure')
  if (!def) return []

  const longFileChars = Number(def.longFileChars ?? 400)
  const severity = def.severity ?? 'warning'
  const issues: LintIssue[] = []

  for (const file of ctx.files) {
    const hasHeading = file.sections.some(s => s.level >= 1)
    if (!hasHeading && file.bodyMarkdown.trim().length >= longFileChars) {
      issues.push({
        ruleId: def.id,
        severity,
        message: 'File is long but has no markdown headings — add structure for agents and reviewers.',
        path: file.path,
      })
    }

    if (file.sections.length === 0 && file.bodyMarkdown.trim().length > 0) {
      issues.push({
        ruleId: def.id,
        severity: 'info',
        message: 'No sections detected. Consider adding headings to structure instructions.',
        path: file.path,
      })
    }
  }

  return issues
}
