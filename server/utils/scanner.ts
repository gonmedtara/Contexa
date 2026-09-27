import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, join, relative, sep } from 'node:path'
import { parse as parseYaml } from 'yaml'
import type { ContextFile, ContextFileType, ScanResult } from '../../shared/types/context'

const SKIP_DIR_NAMES = new Set([
  '.git',
  'node_modules',
  '.nuxt',
  '.output',
  'dist',
  'coverage',
  '.next',
  '.turbo',
  '.cache',
  'vendor',
])

/**
 * Light frontmatter split used by the scanner.
 * Full AST parsing is handled separately by the parser.
 */
export function extractFrontmatter(content: string): {
  frontmatter?: Record<string, unknown>
  body: string
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { body: content }
  }

  try {
    const data = parseYaml(match[1])
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return {
        frontmatter: data as Record<string, unknown>,
        body: match[2],
      }
    }
  }
  catch {
    // Keep raw content when YAML is invalid; parser / later lint can surface issues.
  }

  return { body: content }
}

function classifyPath(relativePath: string): ContextFileType | null {
  const normalized = relativePath.split(sep).join('/')
  const name = basename(normalized)

  if (name === 'AGENTS.md') return 'agents'
  if (name === 'CLAUDE.md') return 'claude'
  if (name === '.windsurfrules') return 'windsurf'
  if (name === 'SKILL.md') return 'skill'

  // GitHub Copilot repository / path-specific instructions
  if (
    normalized === '.github/copilot-instructions.md'
    || name === 'copilot-instructions.md'
  ) {
    return 'copilot'
  }
  if (
    (normalized.includes('/.github/instructions/') || normalized.startsWith('.github/instructions/'))
    && name.endsWith('.instructions.md')
  ) {
    return 'copilot'
  }

  // IDE agent rules directory (dotfolder + /rules/)
  const ideRulesMarker = '/.' + 'cursor' + '/rules/'
  if (
    normalized.includes(ideRulesMarker)
    || normalized.startsWith(ideRulesMarker.slice(1))
  ) {
    if (name.endsWith('.mdc') || name.endsWith('.md')) {
      return 'ide-rule'
    }
  }

  return null
}

async function walk(dir: string, root: string, out: string[]): Promise<void> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  }
  catch {
    return
  }

  for (const entry of entries) {
    const absolute = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue
      await walk(absolute, root, out)
      continue
    }

    if (!entry.isFile()) continue

    const rel = relative(root, absolute)
    if (classifyPath(rel)) {
      out.push(absolute)
    }
  }
}

async function readContextFile(absolutePath: string, root: string): Promise<ContextFile> {
  const content = await readFile(absolutePath, 'utf8')
  const relativePath = relative(root, absolutePath).split(sep).join('/')
  const type = classifyPath(relativePath)

  if (!type) {
    throw new Error(`Unclassified context file: ${relativePath}`)
  }

  const { frontmatter } = extractFrontmatter(content)

  const file: ContextFile = {
    path: relativePath,
    type,
    content,
  }

  if (frontmatter && Object.keys(frontmatter).length > 0) {
    file.frontmatter = frontmatter
  }

  return file
}

/**
 * Scan a repository for AI context files.
 * Read-only: never writes to disk.
 */
export async function scanRepo(repoPath: string): Promise<ScanResult> {
  const rootStat = await stat(repoPath)
  if (!rootStat.isDirectory()) {
    throw createError({
      statusCode: 400,
      statusMessage: `Not a directory: ${repoPath}`,
    })
  }

  const absolutePaths: string[] = []
  await walk(repoPath, repoPath, absolutePaths)
  absolutePaths.sort((a, b) => a.localeCompare(b))

  const files = await Promise.all(
    absolutePaths.map(path => readContextFile(path, repoPath)),
  )

  return { repoPath, files }
}
