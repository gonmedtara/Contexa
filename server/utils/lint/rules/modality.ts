import type { LintRule } from '../../../../shared/types/lint'

const MUST_RE = /\b(must|shall|required|obligatoire|interdit)\b/gi
const SHOULD_RE = /\b(should|preferably|recommandé|recommandée|idéalement)\b/gi
const WEAK_RE = /\b(try to|maybe|perhaps|si possible|éventuellement|si besoin)\b/gi

/**
 * Surface modality signals so authors notice weak or mixed obligation language.
 * Does not rewrite text — Phase 3 can propose edits later.
 */
export const modalityRule: LintRule = {
  id: 'modality-signals',
  description: 'Report must/should/weak obligation language for prompt-weight review.',
  run({ files }) {
    const issues = []

    for (const file of files) {
      const text = file.bodyMarkdown
      const mustCount = [...text.matchAll(MUST_RE)].length
      const shouldCount = [...text.matchAll(SHOULD_RE)].length
      const weakCount = [...text.matchAll(WEAK_RE)].length

      if (weakCount > 0 && mustCount === 0) {
        issues.push({
          ruleId: 'modality-signals',
          severity: 'info' as const,
          message: `Found ${weakCount} weak obligation phrase(s) and no hard « must » — check if intent is under-specified.`,
          path: file.path,
        })
      }

      if (mustCount > 0 && shouldCount > 0) {
        const ratio = shouldCount / mustCount
        if (ratio >= 2) {
          issues.push({
            ruleId: 'modality-signals',
            severity: 'warning' as const,
            message: `Soft guidance (« should », ${shouldCount}) outweighs hard rules (« must », ${mustCount}). Clarify priority.`,
            path: file.path,
          })
        }
      }

      // Section titled Must/Should with mismatched body language
      for (const section of file.sections) {
        const title = section.title.toLowerCase()
        const sectionText = JSON.stringify(section.body)
        if (title.includes('must') && SHOULD_RE.test(sectionText) && !MUST_RE.test(sectionText)) {
          issues.push({
            ruleId: 'modality-signals',
            severity: 'warning' as const,
            message: `Section « ${section.title} » is titled as hard rules but body uses soft language only.`,
            path: file.path,
            sectionId: section.id,
            sectionTitle: section.title,
          })
        }
        // reset lastIndex on global regexes
        SHOULD_RE.lastIndex = 0
        MUST_RE.lastIndex = 0
      }
    }

    return issues
  },
}
