import type { LintIssue, LintRuleContext } from '../../../../shared/types/lint'
import { ruleDef } from '../../criteria'

export function runXmlBalanceRule(ctx: LintRuleContext): LintIssue[] {
  const def = ruleDef(ctx.criteria, 'xml-tag-balance')
  if (!def) return []

  const ignored = new Set((def.ignoredTags ?? []).map(t => t.toLowerCase()))
  const tagRe = /<\/?([a-zA-Z][\w:-]*)\b[^>]*>/g
  const issues: LintIssue[] = []

  for (const file of ctx.files) {
    const stack: string[] = []
    const counts = new Map<string, { open: number, close: number }>()

    for (const match of file.bodyMarkdown.matchAll(tagRe)) {
      const full = match[0]
      const name = match[1].toLowerCase()
      if (ignored.has(name)) continue
      if (full.endsWith('/>')) continue

      const entry = counts.get(name) ?? { open: 0, close: 0 }
      if (full.startsWith('</')) {
        entry.close++
        const top = stack.pop()
        if (top && top !== name) {
          issues.push({
            ruleId: def.id,
            severity: 'warning',
            message: `Possible mismatched close tag </${name}> (open was <${top}>).`,
            path: file.path,
          })
        }
      }
      else {
        entry.open++
        stack.push(name)
      }
      counts.set(name, entry)
    }

    for (const [name, { open, close }] of counts) {
      if (open !== close) {
        issues.push({
          ruleId: def.id,
          severity: def.severity ?? 'error',
          message: `Unbalanced prompt tag <${name}>: ${open} open / ${close} close.`,
          path: file.path,
        })
      }
    }
  }

  return issues
}
