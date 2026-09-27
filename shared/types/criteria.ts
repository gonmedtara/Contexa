import type { ContextFileType } from './context'
import type { LintSeverity } from './lint'

export interface CriteriaSource {
  name: string
  url?: string
}

export interface LintRuleDefinition {
  id: string
  enabled?: boolean
  severity?: LintSeverity
  description?: string
  types?: ContextFileType[]
  requireFrontmatterKeys?: string[]
  longFileChars?: number
  mustPatterns?: string[]
  shouldPatterns?: string[]
  weakPatterns?: string[]
  shouldToMustRatioWarning?: number
  phrases?: string[]
  minLineLength?: number
  ignoredTags?: string[]
  [key: string]: unknown
}

export interface LintCriteriaFile {
  meta?: {
    version?: number
    basedOn?: CriteriaSource[]
  }
  rules: LintRuleDefinition[]
}

export interface EditTagDefinition {
  id: string
  label: string
  category: string
  description?: string
  snippet: string
}

export interface EditTagsFile {
  meta?: {
    version?: number
    basedOn?: CriteriaSource[]
  }
  tags: EditTagDefinition[]
}
