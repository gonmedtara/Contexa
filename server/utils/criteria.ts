import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'
import type { EditTagsFile, LintCriteriaFile, LintRuleDefinition } from '../../shared/types/criteria'

function findPackageRoot(): string {
  if (process.env.CONTEXAI_PACKAGE_ROOT && existsSync(join(process.env.CONTEXAI_PACKAGE_ROOT, 'criteria/lint.yaml'))) {
    return process.env.CONTEXAI_PACKAGE_ROOT
  }

  let dir = dirname(fileURLToPath(import.meta.url))
  for (let i = 0; i < 10; i++) {
    const criteriaPath = join(dir, 'criteria/lint.yaml')
    const pkgPath = join(dir, 'package.json')
    if (existsSync(criteriaPath)) return dir
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { name?: string }
        if (pkg.name === 'contexai' && existsSync(criteriaPath)) return dir
      }
      catch {
        // continue walking
      }
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  // Dev fallback: server/utils -> repo root
  return join(dirname(fileURLToPath(import.meta.url)), '../..')
}

async function readYamlFile<T>(path: string): Promise<T | null> {
  if (!existsSync(path)) return null
  const raw = await readFile(path, 'utf8')
  return parseYaml(raw) as T
}

/**
 * Load lint criteria: package defaults, then host `.contexai/lint.yaml` override (merge by rule id).
 */
export async function loadLintCriteria(repoPath: string): Promise<{
  criteria: LintCriteriaFile
  sources: string[]
}> {
  const packageRoot = findPackageRoot()
  const defaultsPath = join(packageRoot, 'criteria/lint.yaml')
  const hostPath = join(repoPath, '.contexai/lint.yaml')
  const sources: string[] = []

  const defaults = (await readYamlFile<LintCriteriaFile>(defaultsPath)) ?? { rules: [] }
  if (existsSync(defaultsPath)) sources.push(defaultsPath)

  const host = await readYamlFile<LintCriteriaFile>(hostPath)
  if (!host) {
    return { criteria: defaults, sources }
  }

  sources.push(hostPath)
  const byId = new Map<string, LintRuleDefinition>()
  for (const rule of defaults.rules ?? []) byId.set(rule.id, { ...rule })
  for (const rule of host.rules ?? []) {
    const prev = byId.get(rule.id) ?? { id: rule.id }
    byId.set(rule.id, { ...prev, ...rule, id: rule.id })
  }

  return {
    criteria: {
      meta: { ...defaults.meta, ...host.meta },
      rules: [...byId.values()],
    },
    sources,
  }
}

export async function loadEditTags(repoPath: string): Promise<{
  tags: EditTagsFile
  sources: string[]
}> {
  const packageRoot = findPackageRoot()
  const defaultsPath = join(packageRoot, 'criteria/edit-tags.yaml')
  const hostPath = join(repoPath, '.contexai/edit-tags.yaml')
  const sources: string[] = []

  const defaults = (await readYamlFile<EditTagsFile>(defaultsPath)) ?? { tags: [] }
  if (existsSync(defaultsPath)) sources.push(defaultsPath)

  const host = await readYamlFile<EditTagsFile>(hostPath)
  if (!host) {
    return { tags: defaults, sources }
  }

  sources.push(hostPath)
  const byId = new Map((defaults.tags ?? []).map(t => [t.id, t]))
  for (const tag of host.tags ?? []) byId.set(tag.id, tag)

  return {
    tags: {
      meta: { ...defaults.meta, ...host.meta },
      tags: [...byId.values()],
    },
    sources,
  }
}

export function ruleDef(
  criteria: LintCriteriaFile,
  id: string,
): LintRuleDefinition | undefined {
  return criteria.rules.find(r => r.id === id && r.enabled !== false)
}
