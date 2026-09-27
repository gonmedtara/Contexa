/**
 * Shared types for Contexa Phase 1 (scan + parse + read-only UI).
 * Kept free of write/lint concerns so later phases can extend without breaking callers.
 */

export type ContextFileType =
  | 'agents'
  | 'claude'
  | 'copilot'
  | 'ide-rule'
  | 'windsurf'
  | 'skill'

/** Raw file as returned by the scanner (disk read only). */
export interface ContextFile {
  /** Path relative to the scanned repo root. */
  path: string
  type: ContextFileType
  /** Full file contents as read from disk. */
  content: string
  /** YAML frontmatter if present; omitted when absent or unparsable. */
  frontmatter?: Record<string, unknown>
}

/** MDC/Nuxt Content AST root (subset we rely on). */
export interface ContextAstRoot {
  type: 'root'
  children: ContextAstNode[]
}

export interface ContextAstNode {
  type: string
  tag?: string
  value?: string
  children?: ContextAstNode[]
  props?: Record<string, unknown>
  [key: string]: unknown
}

/** One navigable section derived from markdown headings. */
export interface ContextSection {
  id: string
  title: string
  /** Heading level (1–6), or 0 for preamble before the first heading. */
  level: number
  /** Section body as Nuxt Content / MDC AST (lint / transforms). */
  body: ContextAstRoot
  /** Raw markdown for the section body (fences, lists, …) used by the UI renderer. */
  markdown: string
}

/** Scanner result enriched by the parser. */
export interface ParsedContextFile extends ContextFile {
  /** Markdown body without the frontmatter fence. */
  bodyMarkdown: string
  /** Parsed frontmatter object (empty object when none). */
  frontmatter: Record<string, unknown>
  sections: ContextSection[]
  /** Full document AST (body only), useful for later lint / transform phases. */
  ast: ContextAstRoot
}

export interface ScanResult {
  repoPath: string
  files: ContextFile[]
}

export interface ParseScanResult {
  repoPath: string
  files: ParsedContextFile[]
}
