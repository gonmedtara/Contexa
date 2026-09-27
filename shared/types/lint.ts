/**
 * Lint types for Phase 2+ (prompt-engineering rules).
 * Criteria live in external YAML — see criteria/lint.yaml.
 */

import type { LintCriteriaFile } from './criteria'
import type { ParsedContextFile } from './context'

export type LintSeverity = 'error' | 'warning' | 'info'

export interface LintIssue {
  ruleId: string
  severity: LintSeverity
  message: string
  path: string
  sectionId?: string
  sectionTitle?: string
  line?: number
}

export interface LintResult {
  repoPath: string
  issues: LintIssue[]
  summary: {
    error: number
    warning: number
    info: number
  }
  /** Paths of criteria files that were loaded. */
  criteriaSources?: string[]
}

export interface LintRuleContext {
  repoPath: string
  files: ParsedContextFile[]
  criteria: LintCriteriaFile
}

export type LintRuleRunner = (ctx: LintRuleContext) => LintIssue[] | Promise<LintIssue[]>
