import { parseMarkdown, nodeTextContent } from '@nuxtjs/mdc/runtime'
import type {
  ContextAstNode,
  ContextAstRoot,
  ContextFile,
  ContextSection,
  ParsedContextFile,
  ParseScanResult,
  ScanResult,
} from '../../shared/types/context'
import { extractFrontmatter } from './scanner'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    || 'section'
}

function isHeading(node: ContextAstNode): node is ContextAstNode & { tag: string } {
  return node.type === 'element'
    && typeof node.tag === 'string'
    && /^h[1-6]$/.test(node.tag)
}

function headingLevel(tag: string): number {
  return Number(tag.slice(1))
}

/**
 * Split an MDC AST into navigable sections by h1/h2 headings.
 * Nested h3+ stay inside the current section body.
 */
export function extractSections(ast: ContextAstRoot): ContextSection[] {
  const sections: ContextSection[] = []
  const preamble: ContextAstNode[] = []
  let current: ContextSection | null = null
  const usedIds = new Map<string, number>()

  const uniqueId = (base: string) => {
    const count = usedIds.get(base) ?? 0
    usedIds.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }

  for (const node of ast.children) {
    if (isHeading(node) && headingLevel(node.tag) <= 2) {
      if (current) {
        sections.push(current)
      }
      else if (preamble.length > 0) {
        sections.push({
          id: uniqueId('introduction'),
          title: 'Introduction',
          level: 0,
          body: { type: 'root', children: [...preamble] },
        })
        preamble.length = 0
      }

      const title = nodeTextContent(node as never).trim() || 'Untitled'
      current = {
        id: uniqueId(slugify(title)),
        title,
        level: headingLevel(node.tag),
        // Heading text lives in the accordion label; body starts after it.
        body: { type: 'root', children: [] },
      }
      continue
    }

    if (current) {
      current.body.children.push(node)
    }
    else {
      preamble.push(node)
    }
  }

  if (current) {
    sections.push(current)
  }
  else if (preamble.length > 0) {
    sections.push({
      id: uniqueId('introduction'),
      title: 'Introduction',
      level: 0,
      body: { type: 'root', children: preamble },
    })
  }

  return sections
}

/**
 * Parse a scanned context file: frontmatter + markdown AST + sections.
 */
export async function parseContextFile(file: ContextFile): Promise<ParsedContextFile> {
  const { frontmatter = {}, body: bodyMarkdown } = extractFrontmatter(file.content)

  // Parse body only so YAML stays the single source of truth for frontmatter.
  const parsed = await parseMarkdown(bodyMarkdown, {
    highlight: false,
    contentHeading: false,
  })

  const ast = (parsed.body ?? { type: 'root', children: [] }) as ContextAstRoot

  return {
    ...file,
    frontmatter,
    bodyMarkdown,
    ast,
    sections: extractSections(ast),
  }
}

export async function parseScanResult(scan: ScanResult): Promise<ParseScanResult> {
  const files = await Promise.all(scan.files.map(file => parseContextFile(file)))
  return {
    repoPath: scan.repoPath,
    files,
  }
}
