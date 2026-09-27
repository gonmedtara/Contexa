import type { LintIssue, LintRuleContext } from '../../../../shared/types/lint'
import { ruleDef } from '../../criteria'

function compileAll(patterns: string[] | undefined, flags = 'gi'): RegExp[] {
  return (patterns ?? []).map(source => new RegExp(source, flags))
}

function countMatches(text: string, patterns: RegExp[]): number {
  let total = 0
  for (const re of patterns) {
    total += [...text.matchAll(re)].length
    re.lastIndex = 0
  }
  return total
}

export function runModalityRule(ctx: LintRuleContext): LintIssue[] {
  const def = ruleDef(ctx.criteria, 'modality-signals')
  if (!def) return []

  const mustRe = compileAll(def.mustPatterns)
  const shouldRe = compileAll(def.shouldPatterns)
  const weakRe = compileAll(def.weakPatterns)
  const ratioWarn = Number(def.shouldToMustRatioWarning ?? 2)
  const issues: LintIssue[] = []

  for (const file of ctx.files) {
    const text = file.bodyMarkdown
    const mustCount = countMatches(text, mustRe)
    const shouldCount = countMatches(text, shouldRe)
    const weakCount = countMatches(text, weakRe)

    if (weakCount > 0 && mustCount === 0) {
      issues.push({
        ruleId: def.id,
        severity: 'info',
        message: `Found ${weakCount} weak obligation phrase(s) and no hard MUST-level language — check if intent is under-specified (see RFC 2119).`,
        path: file.path,
      })
    }

    if (mustCount > 0 && shouldCount > 0) {
      const ratio = shouldCount / mustCount
      if (ratio >= ratioWarn) {
        issues.push({
          ruleId: def.id,
          severity: def.severity ?? 'warning',
          message: `Soft guidance (SHOULD-level, ${shouldCount}) outweighs hard rules (MUST-level, ${mustCount}). Clarify priority (RFC 2119).`,
          path: file.path,
        })
      }
    }

    for (const section of file.sections) {
      const title = section.title.toLowerCase()
      const sectionText = JSON.stringify(section.body)
      const sectionMust = countMatches(sectionText, mustRe)
      const sectionShould = countMatches(sectionText, shouldRe)
      if (title.includes('must') && sectionShould > 0 && sectionMust === 0) {
        issues.push({
          ruleId: def.id,
          severity: def.severity ?? 'warning',
          message: `Section « ${section.title} » is titled as hard rules but body uses soft language only.`,
          path: file.path,
          sectionId: section.id,
          sectionTitle: section.title,
        })
      }
    }
  }

  return issues
}
