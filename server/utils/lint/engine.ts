import type { ParsedContextFile } from '../../../shared/types/context'
import type { LintIssue, LintResult, LintRule } from '../../../shared/types/lint'
import { emptySectionRule } from './rules/empty-section'
import { frontmatterRule } from './rules/frontmatter'
import { modalityRule } from './rules/modality'
import { redundancyRule } from './rules/redundancy'
import { structureRule } from './rules/structure'
import { vagueLanguageRule } from './rules/vague-language'
import { xmlBalanceRule } from './rules/xml-balance'

/** Ordered registry — append new rules here without changing the API shape. */
export const lintRules: LintRule[] = [
  frontmatterRule,
  emptySectionRule,
  structureRule,
  modalityRule,
  vagueLanguageRule,
  redundancyRule,
  xmlBalanceRule,
]

function summarize(issues: LintIssue[]): LintResult['summary'] {
  const summary = { error: 0, warning: 0, info: 0 }
  for (const issue of issues) {
    summary[issue.severity]++
  }
  return summary
}

const severityRank: Record<LintIssue['severity'], number> = {
  error: 0,
  warning: 1,
  info: 2,
}

/**
 * Run all prompt-engineering lint rules on already-parsed context files.
 * Pure: no disk writes.
 */
export async function lintParsedFiles(
  repoPath: string,
  files: ParsedContextFile[],
  rules: LintRule[] = lintRules,
): Promise<LintResult> {
  const ctx = { repoPath, files }
  const issues: LintIssue[] = []

  for (const rule of rules) {
    const batch = await rule.run(ctx)
    issues.push(...batch)
  }

  issues.sort((a, b) => {
    const bySev = severityRank[a.severity] - severityRank[b.severity]
    if (bySev !== 0) return bySev
    return a.path.localeCompare(b.path) || a.ruleId.localeCompare(b.ruleId)
  })

  return {
    repoPath,
    issues,
    summary: summarize(issues),
  }
}

export async function lintRepo(repoPath: string): Promise<LintResult> {
  const scan = await scanRepo(repoPath)
  const parsed = await parseScanResult(scan)
  return lintParsedFiles(repoPath, parsed.files)
}
