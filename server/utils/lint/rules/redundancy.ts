import type { LintIssue, LintRuleContext } from '../../../../shared/types/lint'
import type { ParsedContextFile } from '../../../../shared/types/context'
import { ruleDef } from '../../criteria'

function normalizeLine(line: string): string {
  return line
    .toLowerCase()
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function substantiveLines(file: ParsedContextFile, minLen: number): string[] {
  return file.bodyMarkdown
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(line => line.length >= minLen)
    .filter(line => !line.startsWith('#'))
}

export function runRedundancyRule(ctx: LintRuleContext): LintIssue[] {
  const def = ruleDef(ctx.criteria, 'cross-file-redundancy')
  if (!def) return []

  const minLen = Number(def.minLineLength ?? 24)
  const issues: LintIssue[] = []
  const index = new Map<string, string[]>()

  for (const file of ctx.files) {
    const seenInFile = new Set<string>()
    for (const line of substantiveLines(file, minLen)) {
      if (seenInFile.has(line)) continue
      seenInFile.add(line)
      const paths = index.get(line) ?? []
      paths.push(file.path)
      index.set(line, paths)
    }
  }

  for (const [line, paths] of index) {
    const uniquePaths = [...new Set(paths)]
    if (uniquePaths.length < 2) continue

    const preview = line.length > 80 ? `${line.slice(0, 77)}…` : line
    issues.push({
      ruleId: def.id,
      severity: def.severity ?? 'warning',
      message: `Duplicated instruction across ${uniquePaths.length} files: « ${preview} »`,
      path: uniquePaths[0],
    })

    for (const path of uniquePaths.slice(1)) {
      issues.push({
        ruleId: def.id,
        severity: 'info',
        message: `Also duplicates text from ${uniquePaths[0]}: « ${preview} »`,
        path,
      })
    }
  }

  return issues
}
