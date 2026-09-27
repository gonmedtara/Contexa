import type { LintRule } from '../../../../shared/types/lint'
import type { ParsedContextFile } from '../../../../shared/types/context'

function normalizeLine(line: string): string {
  return line
    .toLowerCase()
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function substantiveLines(file: ParsedContextFile): string[] {
  return file.bodyMarkdown
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(line => line.length >= 24)
    .filter(line => !line.startsWith('#'))
}

/**
 * Detect near-duplicate instruction lines shared across context files.
 * Helps catch drift / copy-paste between AGENTS, CLAUDE, skills, etc.
 */
export const redundancyRule: LintRule = {
  id: 'cross-file-redundancy',
  description: 'Report substantive lines duplicated across different context files.',
  run({ files }) {
    const issues = []
    const index = new Map<string, string[]>()

    for (const file of files) {
      const seenInFile = new Set<string>()
      for (const line of substantiveLines(file)) {
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
        ruleId: 'cross-file-redundancy',
        severity: 'warning' as const,
        message: `Duplicated instruction across ${uniquePaths.length} files: « ${preview} »`,
        path: uniquePaths[0],
      })

      // Also attach a lighter info on the other files for navigation.
      for (const path of uniquePaths.slice(1)) {
        issues.push({
          ruleId: 'cross-file-redundancy',
          severity: 'info' as const,
          message: `Also duplicates text from ${uniquePaths[0]}: « ${preview} »`,
          path,
        })
      }
    }

    return issues
  },
}
