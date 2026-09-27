import type { LintIssue, LintRuleContext } from '../../../../shared/types/lint'
import { ruleDef } from '../../criteria'

export function runVagueLanguageRule(ctx: LintRuleContext): LintIssue[] {
  const def = ruleDef(ctx.criteria, 'vague-language')
  if (!def) return []

  const phrases = def.phrases ?? []
  const severity = def.severity ?? 'info'
  const issues: LintIssue[] = []

  for (const file of ctx.files) {
    const found = new Set<string>()
    for (const phrase of phrases) {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(`\\b${escaped.replace(/\s+/g, '\\s+')}\\b`, 'gi')
      if (re.test(file.bodyMarkdown)) found.add(phrase)
    }
    if (found.size > 0) {
      issues.push({
        ruleId: def.id,
        severity,
        message: `Vague phrase(s): ${[...found].join(', ')}. Prefer concrete constraints.`,
        path: file.path,
      })
    }
  }

  return issues
}
