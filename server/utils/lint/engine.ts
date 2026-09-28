import type { ParsedContextFile } from '../../../shared/types/context'
import type { LintIssue, LintResult, LintRuleRunner } from '../../../shared/types/lint'
import { runEmptySectionRule } from './rules/empty-section'
import { runFrontmatterRule } from './rules/frontmatter'
import { runModalityRule } from './rules/modality'
import { runRedundancyRule } from './rules/redundancy'
import { runStructureRule } from './rules/structure'
import { runVagueLanguageRule } from './rules/vague-language'
import { runXmlBalanceRule } from './rules/xml-balance'

/** Runners keyed by criteria rule id — behavior is driven by YAML criteria. */
const runners: Record<string, LintRuleRunner> = {
  'frontmatter-description': runFrontmatterRule,
  'empty-section': runEmptySectionRule,
  'heading-structure': runStructureRule,
  'modality-signals': runModalityRule,
  'vague-language': runVagueLanguageRule,
  'cross-file-redundancy': runRedundancyRule,
  'xml-tag-balance': runXmlBalanceRule,
}

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

export async function lintParsedFiles(
  repoPath: string,
  files: ParsedContextFile[],
): Promise<LintResult> {
  const { criteria, sources } = await loadLintCriteria(repoPath)
  const ctx = { repoPath, files, criteria }
  const issues: LintIssue[] = []

  for (const rule of criteria.rules) {
    if (rule.enabled === false) continue
    const runner = runners[rule.id]
    if (!runner) {
      console.warn(`[contexai] No runner for lint rule id « ${rule.id} » — skipped`)
      continue
    }
    issues.push(...await runner(ctx))
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
    criteriaSources: sources,
  }
}

export async function lintRepo(repoPath: string): Promise<LintResult> {
  const scan = await scanRepo(repoPath)
  const parsed = await parseScanResult(scan)
  return lintParsedFiles(repoPath, parsed.files)
}
