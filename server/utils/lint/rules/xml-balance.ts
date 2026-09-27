import type { LintRule } from '../../../../shared/types/lint'

/**
 * Many agent prompts use lightweight XML-ish tags (<rules>, <examples>, …).
 * Unbalanced tags are a common copy-paste failure mode.
 */
export const xmlBalanceRule: LintRule = {
  id: 'xml-tag-balance',
  description: 'Check that non-HTML XML-ish prompt tags are roughly balanced.',
  run({ files }) {
    const issues = []
    // Match simple <tag> / </tag> names; ignore markdown/HTML void-ish noise.
    const tagRe = /<\/?([a-zA-Z][\w:-]*)\b[^>]*>/g
    const ignored = new Set([
      'br', 'hr', 'img', 'a', 'code', 'pre', 'p', 'ul', 'ol', 'li',
      'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span',
    ])

    for (const file of files) {
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
              ruleId: 'xml-tag-balance',
              severity: 'warning' as const,
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
            ruleId: 'xml-tag-balance',
            severity: 'error' as const,
            message: `Unbalanced prompt tag <${name}>: ${open} open / ${close} close.`,
            path: file.path,
          })
        }
      }
    }

    return issues
  },
}
