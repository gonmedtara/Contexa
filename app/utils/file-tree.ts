import type { ContextFileType, ParsedContextFile } from '../../shared/types/context'

export interface FileTreeNode {
  name: string
  /** Repo-relative path (directory path or file path). */
  path: string
  kind: 'dir' | 'file'
  fileType?: ContextFileType
  children?: FileTreeNode[]
}

/**
 * Build a sorted directory tree from scanned context file paths.
 */
export function buildFileTree(files: ParsedContextFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = []

  for (const file of files) {
    const segments = file.path.split('/').filter(Boolean)
    const fileName = segments.pop()
    if (!fileName) continue

    let current = root
    let acc = ''
    for (const segment of segments) {
      acc = acc ? `${acc}/${segment}` : segment
      let dir = current.find(n => n.kind === 'dir' && n.name === segment)
      if (!dir) {
        dir = { name: segment, path: acc, kind: 'dir', children: [] }
        current.push(dir)
      }
      dir.children ??= []
      current = dir.children
    }

    current.push({
      name: fileName,
      path: file.path,
      kind: 'file',
      fileType: file.type,
    })
  }

  const sortNodes = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    for (const node of nodes) {
      if (node.children) sortNodes(node.children)
    }
  }

  sortNodes(root)
  return root
}
