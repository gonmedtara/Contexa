import type { LintRule } from '../../../../shared/types/lint'

const VAGUE_PATTERNS: { re: RegExp, label: string }[] = [
  { re: /\bappropriately\b/gi, label: 'appropriately' },
  { re: /\bas needed\b/gi, label: 'as needed' },
  { re: /\betc\.?\b/gi, label: 'etc.' },
  { re: /\band so on\b/gi, label: 'and so on' },
  { re: /\bif necessary\b/gi, label: 'if necessary' },
  { re: /\bau besoin\b/gi, label: 'au besoin' },
  { re: /\bselon le contexte\b/gi, label: 'selon le contexte' },
  { re: /\bde manière appropriée\b/gi, label: 'de manière appropriée' },
]

/** Vague fillers dilute instruction weight in agent prompts. */
export const vagueLanguageRule: LintRule = {
  id: 'vague-language',
  description: 'Detect vague filler phrases that weaken prompt instructions.',
  run({ files }) {
    const issues = []

    for (const file of files) {
      const found = new Set<string>()
      for (const { re, label } of VAGUE_PATTERNS) {
        if (re.test(file.bodyMarkdown)) found.add(label)
        re.lastIndex = 0
      }
      if (found.size > 0) {
        issues.push({
          ruleId: 'vague-language',
          severity: 'info' as const,
          message: `Vague phrase(s): ${[...found].join(', ')}. Prefer concrete constraints.`,
          path: file.path,
        })
      }
    }

    return issues
  },
}
