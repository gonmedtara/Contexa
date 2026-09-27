import { parseMarkdown } from '@nuxtjs/mdc/runtime'
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
 * Split raw markdown into sections by h1/h2 lines.
 * Fence-aware so ``` blocks are never treated as headings.
 */
export function extractMarkdownSections(bodyMarkdown: string): Array<{
  id: string
  title: string
  level: number
  markdown: string
}> {
  const lines = bodyMarkdown.replace(/\r\n/g, '\n').split('\n')
  const usedIds = new Map<string, number>()
  const uniqueId = (base: string) => {
    const count = usedIds.get(base) ?? 0
    usedIds.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }

  const sections: Array<{ id: string, title: string, level: number, markdown: string }> = []
  let current: { id: string, title: string, level: number, lines: string[] } | null = null
  const preamble: string[] = []
  let inFence = false
  let fenceMarker = ''

  const pushCurrent = () => {
    if (!current) return
    sections.push({
      id: current.id,
      title: current.title,
      level: current.level,
      markdown: current.lines.join('\n').replace(/^\n+/, '').replace(/\n+$/, ''),
    })
  }

  for (const line of lines) {
    const fenceOpen = line.match(/^(```|~~~)/)
    if (fenceOpen) {
      if (!inFence) {
        inFence = true
        fenceMarker = fenceOpen[1]
      }
      else if (line.startsWith(fenceMarker)) {
        inFence = false
        fenceMarker = ''
      }
    }

    const heading = !inFence ? line.match(/^(#{1,2})\s+(.+?)\s*$/) : null
    if (heading) {
      if (current) pushCurrent()
      else if (preamble.some(l => l.trim())) {
        sections.push({
          id: uniqueId('introduction'),
          title: 'Introduction',
          level: 0,
          markdown: preamble.join('\n').replace(/^\n+/, '').replace(/\n+$/, ''),
        })
        preamble.length = 0
      }

      const title = heading[2].trim()
      current = {
        id: uniqueId(slugify(title)),
        title,
        level: heading[1].length,
        lines: [],
      }
      continue
    }

    if (current) current.lines.push(line)
    else preamble.push(line)
  }

  if (current) pushCurrent()
  else if (preamble.some(l => l.trim())) {
    sections.push({
      id: uniqueId('introduction'),
      title: 'Introduction',
      level: 0,
      markdown: preamble.join('\n').replace(/^\n+/, '').replace(/\n+$/, ''),
    })
  }

  return sections
}

function extractAstBodies(ast: ContextAstRoot): ContextAstRoot[] {
  const bodies: ContextAstRoot[] = []
  const preamble: ContextAstNode[] = []
  let current: ContextAstNode[] | null = null

  const pushCurrent = () => {
    if (current) bodies.push({ type: 'root', children: current })
  }

  for (const node of ast.children) {
    if (isHeading(node) && headingLevel(node.tag) <= 2) {
      if (current) pushCurrent()
      else if (preamble.length > 0) {
        bodies.push({ type: 'root', children: [...preamble] })
        preamble.length = 0
      }
      current = []
      continue
    }

    if (current) current.push(node)
    else preamble.push(node)
  }

  if (current) pushCurrent()
  else if (preamble.length > 0) {
    bodies.push({ type: 'root', children: preamble })
  }

  return bodies
}

/**
 * Parse a scanned context file: frontmatter + markdown AST + sections.
 */
export async function parseContextFile(file: ContextFile): Promise<ParsedContextFile> {
  const { frontmatter = {}, body: bodyMarkdown } = extractFrontmatter(file.content)
  const markdownSections = extractMarkdownSections(bodyMarkdown)

  const parsed = await parseMarkdown(bodyMarkdown, {
    highlight: {
      theme: 'github-light',
    },
    contentHeading: false,
  })

  const ast = (parsed.body ?? { type: 'root', children: [] }) as ContextAstRoot
  const astBodies = extractAstBodies(ast)

  const sections: ContextSection[] = markdownSections.map((md, index) => ({
    id: md.id,
    title: md.title,
    level: md.level,
    markdown: md.markdown,
    body: astBodies[index] ?? { type: 'root', children: [] },
  }))

  return {
    ...file,
    frontmatter,
    bodyMarkdown,
    ast,
    sections,
  }
}

export async function parseScanResult(scan: ScanResult): Promise<ParseScanResult> {
  const files = await Promise.all(scan.files.map(file => parseContextFile(file)))
  return {
    repoPath: scan.repoPath,
    files,
  }
}
