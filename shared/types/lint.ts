/**
 * Lint types for Phase 2 (prompt-engineering rules).
 * Issues are advisory only — Phase 3 will attach fixes / writes later.
 */

export type LintSeverity = 'error' | 'warning' | 'info'

export interface LintIssue {
  /** Stable rule identifier, e.g. `modality-must-should`. */
  ruleId: string
  severity: LintSeverity
  message: string
  /** Repo-relative path of the affected file. */
  path: string
  /** Section id from the parser, when the issue is section-scoped. */
  sectionId?: string
  sectionTitle?: string
  /** Optional 1-based line hint for future diff/write UX. */
  line?: number
}

export interface LintResult {
  repoPath: string
  issues: LintIssue[]
  /** Counts by severity for quick UI badges. */
  summary: {
    error: number
    warning: number
    info: number
  }
}

export interface LintRuleContext {
  repoPath: string
  files: import('./context').ParsedContextFile[]
}

export interface LintRule {
  id: string
  description: string
  run: (ctx: LintRuleContext) => LintIssue[] | Promise<LintIssue[]>
}
