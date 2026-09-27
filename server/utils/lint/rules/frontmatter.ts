import type { LintIssue, LintRuleContext } from '../../../../shared/types/lint'
import { ruleDef } from '../../criteria'

export function runFrontmatterRule(ctx: LintRuleContext): LintIssue[] {
  const def = ruleDef(ctx.criteria, 'frontmatter-description')
  if (!def) return []

  const types = new Set(def.types ?? [])
  const keys = def.requireFrontmatterKeys ?? ['description']
  const severity = def.severity ?? 'error'
  const issues: LintIssue[] = []

  for (const file of ctx.files) {
    if (types.size && !types.has(file.type)) continue
    for (const key of keys) {
      const value = file.frontmatter[key]
      if (typeof value !== 'string' || !value.trim()) {
        issues.push({
          ruleId: def.id,
          severity,
          message: `Missing frontmatter « ${key} » for ${file.type} file.`,
          path: file.path,
        })
      }
    }
  }

  return issues
}
